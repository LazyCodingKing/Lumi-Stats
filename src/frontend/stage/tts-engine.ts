import { fnv1a32 } from '../../shared/prose-cleaner';
import type {
  CampaignState,
  CharacterRecord,
  LumiUserSettings,
  TtsReadMode,
} from '../../shared/types';

export interface TtsConnectionInfo {
  id: string;
  name: string;
  provider: string;
  model: string;
  voice: string;
  is_default: boolean;
}

export interface TtsVoiceOption {
  id: string;
  name: string;
  gender?: string;
}

export interface VoiceSegment {
  kind: 'dialogue' | 'narration';
  text: string;
  speakerName: string;
  actorId?: string;
  connectionId?: string;
  voiceId?: string;
  model?: string;
  speed: number;
}

const TTS_DB_NAME = 'lumi_stats_tts_cache_v1';
const TTS_STORE_NAME = 'clips';
const MAX_MEM_CLIPS = 60;
const MAX_IDB_CLIPS = 80;

/**
 * Splits a VN beat into ordered Narration & Character Dialogue segments so:
 * 1. Quoted dialogue (`"..."`, `“...”`, `「...」`) is spoken by the matched Cast Character's TTS voice.
 * 2. Unquoted prose / `*actions*` are spoken by the Narrator voice (or skipped in `dialogue_only` mode to save 60%+ TTS tokens).
 */
export function splitBeatIntoVoiceSegments(
  beatText: string,
  beatSpeaker: {
    speakerName: string;
    isNarrator: boolean;
    matchedActor: CharacterRecord | null;
  },
  state: CampaignState,
  settings: LumiUserSettings | undefined,
): VoiceSegment[] {
  const readMode: TtsReadMode = settings?.ttsReadMode || 'dialogue_only';
  const cleanBeat = String(beatText || '')
    .replace(/^\s*(?:\*\*[^*\n:：]{1,48}\s*[:：]\*\*|[A-Z][\p{L}\p{N}_' -]{1,40}\s*[:：])\s*/mu, '')
    .trim();
  if (!cleanBeat) return [];

  const defaultNarratorConn = settings?.narratorConnectionId || '';
  const defaultNarratorVoice = settings?.narratorVoiceId || '';
  const defaultNarratorModel = settings?.narratorModel || '';
  const defaultNarratorSpeed = settings?.narratorSpeed || 1.0;

  const actorVoice = beatSpeaker.matchedActor?.ttsVoice;
  const charConn = actorVoice?.connectionId || defaultNarratorConn;
  const charVoice = actorVoice?.voiceId || defaultNarratorVoice;
  const charModel = actorVoice?.model || defaultNarratorModel;
  const charSpeed = actorVoice?.speed || 1.0;

  const quoteRe = /(?:"([^"\n]{1,})"|“([^”\n]{1,})”|「([^」\n]{1,})」|『([^』\n]{1,})』)/g;
  const segments: VoiceSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const pushNarration = (rawText: string) => {
    if (readMode === 'dialogue_only') return;
    const stripped = rawText.replace(/\*+/g, '').replace(/\s+/g, ' ').trim();
    if (!stripped || stripped.length < 2) return;
    segments.push({
      kind: 'narration',
      text: stripped,
      speakerName: 'Narrator',
      connectionId: defaultNarratorConn,
      voiceId: defaultNarratorVoice,
      model: defaultNarratorModel,
      speed: defaultNarratorSpeed,
    });
  };

  const pushDialogue = (rawText: string) => {
    if (readMode === 'narration_only') return;
    if (actorVoice?.muted) return;
    const stripped = rawText.replace(/\*+/g, '').replace(/\s+/g, ' ').trim();
    if (!stripped) return;
    segments.push({
      kind: 'dialogue',
      text: stripped,
      speakerName: beatSpeaker.speakerName,
      actorId: beatSpeaker.matchedActor?.id,
      connectionId: charConn,
      voiceId: charVoice,
      model: charModel,
      speed: charSpeed,
    });
  };

  while ((match = quoteRe.exec(cleanBeat)) !== null) {
    if (match.index > lastIndex) {
      pushNarration(cleanBeat.slice(lastIndex, match.index));
    }
    const quoted = (match[1] ?? match[2] ?? match[3] ?? match[4] ?? '').trim();
    if (quoted) {
      pushDialogue(quoted);
    }
    lastIndex = quoteRe.lastIndex;
  }

  if (lastIndex < cleanBeat.length) {
    const tail = cleanBeat.slice(lastIndex);
    if (segments.length === 0 && !beatSpeaker.isNarrator && beatSpeaker.matchedActor) {
      // Whole beat is unquoted dialogue attributed to a character prefix
      pushDialogue(tail);
    } else {
      pushNarration(tail);
    }
  }

  // Fallback: if `dialogue_only` produced 0 segments on a purely narrative beat and user clicked Voice manually,
  // allow reading the beat if `state` has no quotes only when explicitly forced by caller.
  void state;
  return segments;
}

export class LumiTtsEngine {
  private connectionsCache: TtsConnectionInfo[] | null = null;
  private voicesByConnId = new Map<string, TtsVoiceOption[]>();
  private memUrlCache = new Map<string, string>();
  private inFlightSynth = new Map<string, Promise<string | null>>();
  private dbPromise: Promise<IDBDatabase | null> | null = null;
  private activeAudio: HTMLAudioElement | null = null;
  private playToken = 0;
  public isPlaying = false;
  public activeSpeakerLabel = '';
  public cacheHitCount = 0;

  private openDb(): Promise<IDBDatabase | null> {
    if (this.dbPromise) return this.dbPromise;
    if (typeof indexedDB === 'undefined') return Promise.resolve(null);
    this.dbPromise = new Promise(resolve => {
      try {
        const req = indexedDB.open(TTS_DB_NAME, 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(TTS_STORE_NAME)) {
            db.createObjectStore(TTS_STORE_NAME, { keyPath: 'key' });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
    return this.dbPromise;
  }

  public async listConnections(forceRefresh = false): Promise<TtsConnectionInfo[]> {
    if (this.connectionsCache && !forceRefresh) return this.connectionsCache;
    try {
      const res = await fetch('/api/v1/tts-connections?limit=25', {
        credentials: 'include',
      });
      if (!res.ok) return this.connectionsCache ?? [];
      const body = (await res.json()) as { data?: Array<Record<string, unknown>> };
      const list = Array.isArray(body?.data) ? body.data : [];
      this.connectionsCache = list.map(c => ({
        id: String(c.id ?? ''),
        name: String(c.name ?? 'TTS Connection'),
        provider: String(c.provider ?? ''),
        model: String(c.model ?? ''),
        voice: String(c.voice ?? ''),
        is_default: Boolean(c.is_default),
      }));
      return this.connectionsCache;
    } catch {
      return this.connectionsCache ?? [];
    }
  }

  public async listVoicesForConnection(connectionId: string): Promise<TtsVoiceOption[]> {
    if (!connectionId) return [];
    const cached = this.voicesByConnId.get(connectionId);
    if (cached) return cached;
    try {
      const res = await fetch(`/api/v1/tts-connections/${encodeURIComponent(connectionId)}/voices`, {
        credentials: 'include',
      });
      if (!res.ok) return [];
      const body = (await res.json()) as { voices?: Array<Record<string, unknown>>; data?: Array<Record<string, unknown>> };
      const rawList = Array.isArray(body?.voices)
        ? body.voices
        : Array.isArray(body?.data)
          ? body.data
          : Array.isArray(body)
            ? (body as Array<Record<string, unknown>>)
            : [];
      const voices: TtsVoiceOption[] = rawList
        .map(v => ({
          id: String(v.id ?? v.voice_id ?? v.name ?? ''),
          name: String(v.name ?? v.label ?? v.id ?? ''),
          ...(typeof v.gender === 'string' ? { gender: v.gender } : {}),
        }))
        .filter(v => Boolean(v.id));
      this.voicesByConnId.set(connectionId, voices);
      return voices;
    } catch {
      return [];
    }
  }

  private rememberMemUrl(key: string, objUrl: string): void {
    const prev = this.memUrlCache.get(key);
    if (prev && prev !== objUrl && prev.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(prev);
      } catch {
        // Ignore
      }
    }
    this.memUrlCache.delete(key);
    while (this.memUrlCache.size >= MAX_MEM_CLIPS) {
      const oldestKey = this.memUrlCache.keys().next().value;
      if (!oldestKey) break;
      const oldUrl = this.memUrlCache.get(oldestKey);
      if (oldUrl?.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(oldUrl);
        } catch {
          // Ignore
        }
      }
      this.memUrlCache.delete(oldestKey);
    }
    this.memUrlCache.set(key, objUrl);
  }

  private async readFromIdbCache(key: string): Promise<Blob | null> {
    const db = await this.openDb();
    if (!db) return null;
    return new Promise(resolve => {
      try {
        const tx = db.transaction(TTS_STORE_NAME, 'readonly');
        const req = tx.objectStore(TTS_STORE_NAME).get(key);
        req.onsuccess = () => {
          const row = req.result as { blob?: Blob } | undefined;
          resolve(row?.blob instanceof Blob ? row.blob : null);
        };
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  private async writeToIdbCache(key: string, blob: Blob): Promise<void> {
    const db = await this.openDb();
    if (!db) return;
    await new Promise<void>(resolve => {
      try {
        const tx = db.transaction(TTS_STORE_NAME, 'readwrite');
        const store = tx.objectStore(TTS_STORE_NAME);
        store.put({ key, blob, updatedAt: Date.now() });
        const countReq = store.count();
        countReq.onsuccess = () => {
          if (countReq.result > MAX_IDB_CLIPS) {
            const cursorReq = store.openCursor();
            cursorReq.onsuccess = () => {
              const cursor = cursorReq.result;
              if (cursor) cursor.delete();
            };
          }
        };
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  /**
   * Resolves a playable ObjectURL for `segment`, checking:
   * 1. In-memory LRU ObjectURL cache (0ms, 0 tokens)
   * 2. IndexedDB Blob cache (0 tokens)
   * 3. Live `/api/v1/tts/synthesize` synthesis (persisted into both caches)
   */
  public async synthesizeSegmentCached(segment: VoiceSegment): Promise<string | null> {
    const conns = await this.listConnections();
    const matchedConn =
      (segment.connectionId ? conns.find(c => c.id === segment.connectionId) : undefined) ??
      conns.find(c => c.is_default) ??
      conns[0];
    if (!matchedConn?.id) return null;

    const connId = matchedConn.id;
    const model = segment.model || matchedConn.model || '';
    const voice = segment.voiceId || matchedConn.voice || '';
    const cleanText = segment.text.trim();
    if (!cleanText) return null;

    const cacheKey = `tts_${fnv1a32(`${connId}|${model}|${voice}|${ cleanText.toLowerCase() }`)}`;

    // 1. Check Tier-1 Memory Cache
    const memHit = this.memUrlCache.get(cacheKey);
    if (memHit) {
      this.cacheHitCount++;
      this.rememberMemUrl(cacheKey, memHit);
      return memHit;
    }

    const pending = this.inFlightSynth.get(cacheKey);
    if (pending) return pending;

    const task = (async (): Promise<string | null> => {
      // 2. Check Tier-2 IndexedDB Cache
      const idbBlob = await this.readFromIdbCache(cacheKey);
      if (idbBlob) {
        this.cacheHitCount++;
        const url = URL.createObjectURL(idbBlob);
        this.rememberMemUrl(cacheKey, url);
        return url;
      }

      // 3. Synthesize via Lumiverse TTS API
      try {
        const res = await fetch('/api/v1/tts/synthesize', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            connectionId: connId,
            ...(model ? { model } : {}),
            ...(voice ? { voice } : {}),
            text: cleanText,
            outputFormat: 'mp3',
          }),
        });
        if (!res.ok) return null;
        const blob = await res.blob();
        if (!blob.size) return null;
        void this.writeToIdbCache(cacheKey, blob);
        const url = URL.createObjectURL(blob);
        this.rememberMemUrl(cacheKey, url);
        return url;
      } catch {
        return null;
      }
    })();

    this.inFlightSynth.set(cacheKey, task);
    try {
      return await task;
    } finally {
      if (this.inFlightSynth.get(cacheKey) === task) {
        this.inFlightSynth.delete(cacheKey);
      }
    }
  }

  /**
   * Pre-warms the audio cache for an upcoming beat in the background.
   */
  public prefetchSegments(segments: VoiceSegment[]): void {
    for (const seg of segments.slice(0, 3)) {
      void this.synthesizeSegmentCached(seg);
    }
  }

  public stop(): void {
    this.playToken++;
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.removeAttribute('src');
      } catch {
        // Ignore
      }
      this.activeAudio = null;
    }
    this.isPlaying = false;
    this.activeSpeakerLabel = '';
  }

  /**
   * Plays an ordered queue of `VoiceSegment`s sequentially (e.g. Narrator -> Character A -> Narrator),
   * invoking `onStateChange` as each segment starts/stops.
   */
  public async playSegments(
    segments: VoiceSegment[],
    onStateChange?: () => void,
  ): Promise<boolean> {
    this.stop();
    if (!segments.length) {
      onStateChange?.();
      return false;
    }

    const myToken = ++this.playToken;
    this.isPlaying = true;
    onStateChange?.();

    // Kick off parallel synthesis/cache lookup for all segments in this beat
    const urlPromises = segments.map(seg => this.synthesizeSegmentCached(seg));

    for (let i = 0; i < segments.length; i++) {
      if (this.playToken !== myToken) return false;
      const seg = segments[i]!;
      const audioUrl = await urlPromises[i];
      if (!audioUrl || this.playToken !== myToken) continue;

      this.activeSpeakerLabel = seg.speakerName;
      onStateChange?.();

      await new Promise<void>(resolve => {
        if (this.playToken !== myToken) {
          resolve();
          return;
        }
        const audio = new Audio(audioUrl);
        audio.playbackRate = Math.max(0.5, Math.min(2.0, seg.speed || 1.0));
        this.activeAudio = audio;
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
        void audio.play().catch(() => resolve());
      });
    }

    if (this.playToken === myToken) {
      this.isPlaying = false;
      this.activeSpeakerLabel = '';
      this.activeAudio = null;
      onStateChange?.();
      return true;
    }
    return false;
  }

  public destroy(): void {
    this.stop();
    for (const url of this.memUrlCache.values()) {
      if (url.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // Ignore
        }
      }
    }
    this.memUrlCache.clear();
    this.inFlightSynth.clear();
  }
}
