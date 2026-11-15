import type { SpindleAppMountHandle, SpindleModalHandle, SpindleSTTSession } from 'lumiverse-spindle-types';
import { formatSceneBanner, resolveAnchorLabel } from '../../shared/formula';
import { resolveCharacterFieldValue } from '../../shared/prompt-compiler';
import { cleanBrailleAndProseWhitespace } from '../../shared/prose-cleaner';
import type {
  CampaignState,
  CharacterRecord,
  CharacterStageRig,
  VnBgTransitionStyle,
  VnShotMode,
  VnStageSlotName,
  VnWeatherEffect,
} from '../../shared/types';
import {
  ComponentScope,
  btn,
  el,
  type LumiFrontendController,
} from '../controller';
import { openVoiceAssignmentModal } from './VoiceAssignmentModal';

export { openVoiceAssignmentModal };
import { renderFloatingHudSurface } from './FloatingHud';
import { openSettingsStudioModal } from './SettingsStudio';
import {
  generateWeatherParticlesHtml,
  inferWeatherEffect,
} from '../stage/procedural-particles';
import {
  escapeCssUrl,
  getSpeakerAccentColor,
  LumiStageDirector,
} from '../stage/stage-director';
import { splitBeatIntoVoiceSegments } from '../stage/tts-engine';
import { openCharacterDossierModal } from './CastDossier';
import {
  openStageAssetStudioModal,
  resolveBestCharacterSprite,
  resolveBestPlaceBackdropUrl,
} from './StageAssetStudio';

const DEFAULT_STAGE_RIG: CharacterStageRig = {
  scale: 1.0,
  offsetX: 0,
  offsetY: 0,
  flipX: false,
};

export function splitTurnIntoVnBeats(rawText: string): string[] {
  const cleaned = cleanBrailleAndProseWhitespace(rawText).trim();
  if (!cleaned) return ['…'];
  const rawParagraphs = cleaned
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean);

  const paragraphs: string[] = [];
  for (const p of rawParagraphs) {
    if (
      paragraphs.length > 0 &&
      (paragraphs[paragraphs.length - 1]!.length < 110 || p.length < 110) &&
      paragraphs[paragraphs.length - 1]!.length + 2 + p.length <= 340
    ) {
      paragraphs[paragraphs.length - 1] += `\n\n${p}`;
    } else {
      paragraphs.push(p);
    }
  }

  const beats: string[] = [];
  for (const p of paragraphs) {
    if (p.length <= 340) {
      beats.push(p);
      continue;
    }
    const sents =
      p.match(/[^.!?。！？\n]+[.!?。！？]+(?:["”」』*]+)?|[^.!?。！？\n]+$/g) || [p];
    let cur = '';
    for (const s of sents) {
      const trimmed = s.trim();
      if (!trimmed) continue;
      if (!cur) cur = trimmed;
      else if (cur.length + 1 + trimmed.length <= 340) {
        cur = `${cur} ${trimmed}`;
      } else {
        beats.push(cur);
        cur = trimmed;
      }
    }
    if (cur) beats.push(cur);
  }
  return beats.length > 0 ? beats : [cleaned];
}

export function resolveVnBeatSpeaker(
  beatText: string,
  turnRole: 'user' | 'assistant',
  state: CampaignState,
): {
  speakerName: string;
  isNarrator: boolean;
  matchedActor: CharacterRecord | null;
} {
  if (turnRole === 'user') {
    return {
      speakerName: state.player.name || 'You',
      isNarrator: false,
      matchedActor: null,
    };
  }

  const text = String(beatText || '').trim();
  const allActors = Object.values(state.characters);
  const presentActors = allActors.filter(c => c.present);
  const candidates = presentActors.length > 0 ? presentActors : allActors;

  const findActorByName = (label: string): CharacterRecord | null => {
    const low = label.trim().toLowerCase();
    if (!low) return null;
    for (const actor of candidates) {
      if (actor.name.toLowerCase() === low) return actor;
      const firstWord = actor.name.split(/\s+/)[0]?.toLowerCase();
      if (firstWord && firstWord.length >= 2 && firstWord === low) return actor;
      if (actor.aliases?.some(a => a.trim().toLowerCase() === low)) return actor;
    }
    return null;
  };

  const prefixMatch = text.match(
    /^\s*(?:\*\*([^*\n:：]{1,48})\s*[:：]\*\*|\*\*([^*\n:：]{1,48})\*\*\s*[:：]|([A-Z][\p{L}\p{N}_' -]{1,40})\s*[:：])\s*/mu,
  );
  const prefixName = (prefixMatch?.[1] || prefixMatch?.[2] || prefixMatch?.[3] || '').trim();
  if (prefixName) {
    if (/^(?:narrator|narration|gm|dm|system|scene)$/i.test(prefixName)) {
      return { speakerName: 'Narrator', isNarrator: true, matchedActor: null };
    }
    const matched = findActorByName(prefixName);
    if (matched) {
      return { speakerName: matched.name, isNarrator: false, matchedActor: matched };
    }
  }

  const hasQuotes = /(?:"[^"\n]{1,}"|“[^”\n]{1,}”|「[^」\n]{1,}」|『[^』\n]{1,}』)/.test(text);
  if (!hasQuotes) {
    return { speakerName: 'Narrator', isNarrator: true, matchedActor: null };
  }

  const outsideQuotes = text
    .replace(/(?:"[^"]*"|“[^”]*”|「[^」]*」|『[^』]*』)/g, ' ')
    .toLowerCase();

  const mentioned = candidates.filter(actor => {
    const tokens = [
      actor.name.toLowerCase(),
      actor.name.split(/\s+/)[0]?.toLowerCase() || '',
      ...(actor.aliases || []).map(a => a.toLowerCase()),
    ].filter(t => t.length >= 2);
    return tokens.some(tok => {
      const esc = tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`\\b${esc}\\b`, 'i').test(outsideQuotes);
    });
  });

  if (mentioned.length >= 1) {
    const ranked = [...mentioned].sort((a, b) => {
      const aFirst = a.name.split(/\s+/)[0]!.toLowerCase();
      const bFirst = b.name.split(/\s+/)[0]!.toLowerCase();
      return outsideQuotes.indexOf(aFirst) - outsideQuotes.indexOf(bFirst);
    });
    return {
      speakerName: ranked[0]!.name,
      isNarrator: false,
      matchedActor: ranked[0]!,
    };
  }

  if (presentActors.length === 1) {
    return {
      speakerName: presentActors[0]!.name,
      isNarrator: false,
      matchedActor: presentActors[0]!,
    };
  }

  return { speakerName: 'Narrator', isNarrator: true, matchedActor: null };
}

function mapDemeanorToStageEmotion(demeanor?: string | null): string {
  const e = String(demeanor || 'neutral').toLowerCase();
  if (/\b(?:joy|warm|happy|excited|amused|smiling|cheerful)\b/.test(e)) return 'joy';
  if (/\b(?:angry|furious|hostile|annoyed|irritated|brusque|stern)\b/.test(e)) return 'anger';
  if (/\b(?:sad|grieving|lonely|hurt|melancholy)\b/.test(e)) return 'sadness';
  if (/\b(?:afraid|surprised|shocked|startled|tense|hurried)\b/.test(e)) return 'surprise';
  if (/\b(?:embarrassed|shy|flustered|blushing|heated)\b/.test(e)) return 'embarrassment';
  if (/\b(?:curious|suspicious|conflicted|calculating|expectant)\b/.test(e)) return 'curiosity';
  return 'neutral';
}

function renderFormattedBeatDom(beatText: string): DocumentFragment {
  const frag = document.createDocumentFragment();
  const clean = beatText.trim();
  const tokenRe = /("[^"\n]+"|“[^”\n]+”|「[^」\n]+」|『[^』\n]+』|\*[^*\n]+\*)/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  while ((match = tokenRe.exec(clean)) !== null) {
    if (match.index > lastIdx) {
      frag.append(document.createTextNode(clean.slice(lastIdx, match.index)));
    }
    const token = match[0]!;
    if (token.startsWith('*') && token.endsWith('*')) {
      const em = el('em', 'ls-vn-prose-thought', token.slice(1, -1));
      frag.append(em);
    } else {
      const q = el('span', 'ls-vn-prose-quote', token);
      frag.append(q);
    }
    lastIdx = tokenRe.lastIndex;
  }
  if (lastIdx < clean.length) {
    frag.append(document.createTextNode(clean.slice(lastIdx)));
  }
  return frag;
}

// Voice assignment modal moved to ./VoiceAssignmentModal.ts and re-exported above.

/**
 * High-Efficiency 4-Layer Surgical-DOM 2D Visual Novel Stage.
 * Advancing beats (`◀ PREV` / `NEXT ▶`) or playing TTS never rebuilds the background,
 * weather particle layer, or character sprite DOM nodes.
 */
export class LumiVnStage {
  public activeTurnIndex = -1;
  public activeBeatIndex = 0;
  public beatPaginationEnabled = true;
  public uiHidden = false;
  public directorOpen = false;
  public thoughtPeekOpen = false;
  public composerOpen = false;
  public isAutoPlay = false;
  public isRecordingStt = false;
  public activeCheckResult: {
    statLabel: string;
    statVal: number;
    roll: number;
    dc: number;
    passed: boolean;
  } | null = null;

  private readonly director = new LumiStageDirector();
  private readonly stageHudScope = new ComponentScope();
  private portalMount: SpindleAppMountHandle | null = null;
  private fallbackModal: SpindleModalHandle | null = null;
  private stageRoot: HTMLElement | null = null;
  private bgStackEl: HTMLElement | null = null;
  private weatherLayerEl: HTMLElement | null = null;
  private actorsLayerEl: HTMLElement | null = null;
  private topHudEl: HTMLElement | null = null;
  private hudWidgetEl: HTMLElement | null = null;
  private popoversEl: HTMLElement | null = null;
  private bottomDockEl: HTMLElement | null = null;
  private hudWidgetPos: { x: number; y: number } | null = null;

  private lastRenderedBgUrl: string | null = null;
  private lastRenderedWeather: VnWeatherEffect | null | undefined = undefined;
  private lastTurnSig = '';
  private lastTurnsCount = 0;
  private lastBeatSig = '';
  private lastAutoSpokenBeatSig = '';
  private typewriterTimer: ReturnType<typeof setInterval> | null = null;
  private isTypewriterRunning = false;
  private autoPlayTimer: ReturnType<typeof setTimeout> | null = null;
  private sttSession: SpindleSTTSession | null = null;

  constructor(private readonly ctrl: LumiFrontendController) {}

  public open(): void {
    this.ctrl.vnStageOpen = true;
    this.lastAutoSpokenBeatSig = '';
    this.ctrl.emitChange();
    this.ensureMounted();
    this.sync();
    void this.ctrl.refreshActiveChat().then(() => {
      if (!this.ctrl.vnStageOpen) return;
      this.ensureMounted();
      this.sync();
    });
  }

  public close(): void {
    this.ctrl.vnStageOpen = false;
    this.stopTypewriter();
    this.ctrl.tts.stop();
    if (this.autoPlayTimer) {
      clearTimeout(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
    this.isAutoPlay = false;
    if (this.sttSession) {
      try {
        this.sttSession.cancel();
      } catch {
        // Ignore
      }
      this.sttSession = null;
      this.isRecordingStt = false;
    }
    this.director.destroy();
    if (this.portalMount) {
      this.portalMount.setVisible(false);
    }
    if (this.fallbackModal) {
      this.fallbackModal.dismiss();
      this.fallbackModal = null;
    }
    this.ctrl.emitChange();
  }

  private ensureMounted(): void {
    if (this.stageRoot && this.stageRoot.isConnected) {
      this.portalMount?.setVisible(true);
      return;
    }

    let hostRoot: HTMLElement | null = null;
    if (!this.portalMount && typeof this.ctrl.ctx.ui?.mountApp === 'function') {
      try {
        this.portalMount = this.ctrl.ctx.ui.mountApp({
          className: 'ls-vn-portal',
          position: 'app-overlay',
        });
      } catch {
        this.portalMount = null;
      }
    }

    if (this.portalMount) {
      this.portalMount.setVisible(true);
      hostRoot = this.portalMount.root;
    } else {
      this.fallbackModal =
        this.ctrl.modals.open(
          { title: '🎭 Lumi Stats — 2D Visual Novel Stage', width: 1360, maxHeight: 880 },
          (body, _close, handle) => {
            body.style.padding = '0';
            handle.onDismiss(() => {
              this.ctrl.vnStageOpen = false;
              this.stageRoot = null;
            });
          },
        ) ?? null;
      hostRoot = this.fallbackModal?.root ?? null;
    }

    if (!hostRoot) return;

    // Build the 4 persistent stage layers ONCE
    const shell = el('div', 'ls-vn-stage ls-root');
    shell.setAttribute('data-ls-vn-stage-root', 'true');
    shell.tabIndex = 0;

    const bgStack = el('div', 'ls-vn-bg-stack');
    bgStack.append(el('div', 'ls-vn-bg-layer ls-vn-bg-base'), el('div', 'ls-vn-bg-layer ls-vn-bg-front'));

    const weatherLayer = el('div', 'ls-vn-weather-layer');
    const actorsLayer = el('div', 'ls-vn-actors-layer');
    const topHud = el('header', 'ls-vn-top-hud');
    const hudWidget = el('aside', 'ls-vn-hud-widget');
    const popovers = el('div', 'ls-vn-popovers');
    const bottomDock = el('div', 'ls-vn-bottom-dock');

    this.bindStageHudDrag(hudWidget);

    shell.append(bgStack, weatherLayer, actorsLayer, topHud, hudWidget, popovers, bottomDock);
    hostRoot.replaceChildren(shell);

    this.stageRoot = shell;
    this.bgStackEl = bgStack;
    this.weatherLayerEl = weatherLayer;
    this.actorsLayerEl = actorsLayer;
    this.topHudEl = topHud;
    this.hudWidgetEl = hudWidget;
    this.popoversEl = popovers;
    this.bottomDockEl = bottomDock;
    this.lastRenderedBgUrl = null;
    this.lastRenderedWeather = undefined;

    shell.addEventListener('keydown', ev => {
      const target = ev.target as HTMLElement | null;
      if (ev.key !== 'Escape' && target?.closest('input, textarea, select, button')) {
        return;
      }
      if (ev.key === 'Escape') {
        ev.preventDefault();
        this.close();
      } else if (ev.key === 'h' || ev.key === 'H') {
        ev.preventDefault();
        this.uiHidden = !this.uiHidden;
        this.sync();
      } else if (ev.key === ' ' || ev.key === 'ArrowRight') {
        ev.preventDefault();
        this.advanceBeatOrTurn();
      } else if (ev.key === 'ArrowLeft') {
        ev.preventDefault();
        this.stepBackBeatOrTurn();
      }
    });
  }

  private bindStageHudDrag(widgetEl: HTMLElement): void {
    widgetEl.addEventListener('pointerdown', e => {
      if (
        e.button !== 0 ||
        (e.target as HTMLElement | null)?.closest(
          'button, input, select, textarea, a, .ls-hud-content',
        )
      ) {
        return;
      }
      const rect = widgetEl.getBoundingClientRect();
      const uiScale =
        rect.width > 0 && widgetEl.offsetWidth > 0
          ? rect.width / widgetEl.offsetWidth
          : 1;
      const startX = e.clientX;
      const startY = e.clientY;
      const origX = this.hudWidgetPos?.x ?? widgetEl.offsetLeft;
      const origY = this.hudWidgetPos?.y ?? widgetEl.offsetTop;

      try {
        widgetEl.setPointerCapture(e.pointerId);
      } catch {
        // Ignore
      }

      const onMove = (me: PointerEvent) => {
        const dx = (me.clientX - startX) / uiScale;
        const dy = (me.clientY - startY) / uiScale;
        const maxX = Math.max(12, (this.stageRoot?.clientWidth ?? window.innerWidth) - widgetEl.offsetWidth - 12);
        const maxY = Math.max(12, (this.stageRoot?.clientHeight ?? window.innerHeight) - widgetEl.offsetHeight - 12);
        const nx = Math.max(12, Math.min(maxX, Math.round(origX + dx)));
        const ny = Math.max(12, Math.min(maxY, Math.round(origY + dy)));
        this.hudWidgetPos = { x: nx, y: ny };
        widgetEl.style.right = 'auto';
        widgetEl.style.left = `${nx}px`;
        widgetEl.style.top = `${ny}px`;
      };

      const onUp = (ue: PointerEvent) => {
        widgetEl.removeEventListener('pointermove', onMove);
        widgetEl.removeEventListener('pointerup', onUp);
        widgetEl.removeEventListener('pointercancel', onUp);
        try {
          widgetEl.releasePointerCapture(ue.pointerId);
        } catch {
          // Ignore
        }
      };

      widgetEl.addEventListener('pointermove', onMove);
      widgetEl.addEventListener('pointerup', onUp);
      widgetEl.addEventListener('pointercancel', onUp);
    });
  }

  private syncStageHudWidget(): void {
    if (!this.hudWidgetEl) return;
    this.stageHudScope.clear();
    const showHudWidget =
      !this.uiHidden &&
      (this.ctrl.settings?.vnShowHudWidget !== undefined
        ? Boolean(this.ctrl.settings.vnShowHudWidget)
        : this.ctrl.vnShowHudWidget);

    if (!showHudWidget) {
      this.hudWidgetEl.style.display = 'none';
      this.hudWidgetEl.replaceChildren();
      return;
    }

    this.hudWidgetEl.style.display = 'flex';
    this.hudWidgetEl.dataset.expanded = String(this.ctrl.widgetExpanded);
    if (this.hudWidgetPos) {
      this.hudWidgetEl.style.right = 'auto';
      this.hudWidgetEl.style.left = `${this.hudWidgetPos.x}px`;
      this.hudWidgetEl.style.top = `${this.hudWidgetPos.y}px`;
    }

    const hudDom = renderFloatingHudSurface(
      this.ctrl,
      !this.ctrl.widgetExpanded,
      () => {
        this.ctrl.widgetExpanded = !this.ctrl.widgetExpanded;
        this.syncStageHudWidget();
      },
      actorId => openCharacterDossierModal(this.ctrl, actorId),
      () => openSettingsStudioModal(this.ctrl),
      this.stageHudScope,
    );
    this.hudWidgetEl.replaceChildren(hudDom);
  }

  private getTurnsList(): Array<{ id: string; role: 'user' | 'assistant'; content: string }> {
    if (this.ctrl.recentTurns.length > 0) return this.ctrl.recentTurns;
    const { state } = this.ctrl.snapshot;
    return [
      {
        id: 'scene_summary',
        role: 'assistant',
        content:
          state.scene.beatSummary ||
          `*Scene ready at ${state.scene.location || state.title || 'the current location'}.*`,
      },
    ];
  }

  private stopTypewriter(flushFullText?: string): void {
    if (this.typewriterTimer) {
      clearInterval(this.typewriterTimer);
      this.typewriterTimer = null;
    }
    if (this.isTypewriterRunning && flushFullText && this.bottomDockEl) {
      const proseEl = this.bottomDockEl.querySelector<HTMLElement>('[data-ls-vn-prose]');
      if (proseEl) {
        proseEl.replaceChildren(renderFormattedBeatDom(flushFullText));
      }
    }
    this.isTypewriterRunning = false;
  }

  private runTypewriter(proseEl: HTMLElement, beatText: string): void {
    this.stopTypewriter();
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !this.beatPaginationEnabled || beatText.length > 350) {
      proseEl.replaceChildren(renderFormattedBeatDom(beatText));
      return;
    }

    this.isTypewriterRunning = true;
    let idx = 0;
    const step = Math.max(1, Math.ceil(beatText.length / 40));
    proseEl.textContent = '';

    this.typewriterTimer = setInterval(() => {
      idx += step;
      if (idx >= beatText.length) {
        this.stopTypewriter(beatText);
        return;
      }
      proseEl.textContent = beatText.slice(0, idx);
    }, 18);
  }

  private advanceBeatOrTurn(): void {
    const turns = this.getTurnsList();
    const turnIdx =
      this.activeTurnIndex >= 0 && this.activeTurnIndex < turns.length
        ? this.activeTurnIndex
        : turns.length - 1;
    const curTurn = turns[turnIdx]!;
    const beats = this.beatPaginationEnabled
      ? splitTurnIntoVnBeats(curTurn.content)
      : [curTurn.content];
    const curBeatText = beats[this.activeBeatIndex] ?? curTurn.content;

    if (this.isTypewriterRunning) {
      this.stopTypewriter(curBeatText);
      return;
    }

    if (this.beatPaginationEnabled && this.activeBeatIndex + 1 < beats.length) {
      this.activeBeatIndex++;
      this.sync();
    } else if (turnIdx + 1 < turns.length) {
      this.activeTurnIndex = turnIdx + 1;
      this.activeBeatIndex = 0;
      this.sync();
    } else {
      this.isAutoPlay = false;
      if (this.autoPlayTimer) {
        clearTimeout(this.autoPlayTimer);
        this.autoPlayTimer = null;
      }
      this.composerOpen = true;
      this.sync();
    }
  }

  private stepBackBeatOrTurn(): void {
    this.stopTypewriter();
    const turns = this.getTurnsList();
    const turnIdx =
      this.activeTurnIndex >= 0 && this.activeTurnIndex < turns.length
        ? this.activeTurnIndex
        : turns.length - 1;

    if (this.beatPaginationEnabled && this.activeBeatIndex > 0) {
      this.activeBeatIndex--;
      this.sync();
    } else if (turnIdx > 0) {
      this.activeTurnIndex = turnIdx - 1;
      this.activeBeatIndex = 0;
      this.sync();
    }
  }

  public speakCurrentBeat(fromAutoAdvance = false): void {
    void fromAutoAdvance;
    if (this.autoPlayTimer) {
      clearTimeout(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }

    const { state } = this.ctrl.snapshot;
    const turns = this.getTurnsList();
    const turnIdx =
      this.activeTurnIndex >= 0 && this.activeTurnIndex < turns.length
        ? this.activeTurnIndex
        : turns.length - 1;
    const curTurn = turns[turnIdx]!;
    const beats = this.beatPaginationEnabled
      ? splitTurnIntoVnBeats(curTurn.content)
      : [curTurn.content];
    const beatText = beats[this.activeBeatIndex] ?? curTurn.content;
    const speakerInfo = resolveVnBeatSpeaker(beatText, curTurn.role, state);

    let segments = splitBeatIntoVoiceSegments(beatText, speakerInfo, state, this.ctrl.settings);
    if (!segments.length) {
      // If a beat has no quotation marks while in `dialogue_only` mode, fall back to Narrator/Character voice
      // so Auto-TTS in the VN Stage never goes mute on narrative beats.
      segments = splitBeatIntoVoiceSegments(
        beatText,
        speakerInfo,
        state,
        this.ctrl.settings
          ? { ...this.ctrl.settings, ttsReadMode: 'narration_and_dialogue' }
          : undefined,
      );
    }

    // Prefetch Next Beat in the background so there is zero pause on advance!
    const nextBeatText = beats[this.activeBeatIndex + 1];
    if (nextBeatText) {
      const nextSpeaker = resolveVnBeatSpeaker(nextBeatText, curTurn.role, state);
      const nextSegs = splitBeatIntoVoiceSegments(
        nextBeatText,
        nextSpeaker,
        state,
        this.ctrl.settings,
      );
      this.ctrl.tts.prefetchSegments(nextSegs);
    }

    void this.ctrl.tts
      .playSegments(segments, () => this.syncDialogueDockOnly())
      .then(completed => {
        if (completed && this.isAutoPlay && this.ctrl.vnStageOpen) {
          if (this.autoPlayTimer) clearTimeout(this.autoPlayTimer);
          this.autoPlayTimer = setTimeout(() => this.advanceBeatOrTurn(), 550);
        }
      });
  }

  public sync(): void {
    if (!this.ctrl.vnStageOpen) {
      if (this.portalMount) this.portalMount.setVisible(false);
      return;
    }
    this.ensureMounted();
    if (!this.stageRoot) return;
    this.ctrl.applyTemplateThemeToDom();

    const { state } = this.ctrl.snapshot;
    const settings = this.ctrl.settings;

    // 1. Sync Persistent Background Layer (Resolves best Time-of-Day / Weather / Default backdrop!)
    const currentPlace =
      state.places[state.currentPlaceId] ?? Object.values(state.places)[0];
    const resolvedBg = resolveBestPlaceBackdropUrl(currentPlace, state);
    const bgUrl = resolvedBg.url;
    if (bgUrl !== this.lastRenderedBgUrl && this.stageRoot) {
      const prevUrl = this.lastRenderedBgUrl ?? '';
      const isInitialMount = this.lastRenderedBgUrl === null;
      this.lastRenderedBgUrl = bgUrl;
      void this.director.playBackgroundTransition({
        stageRoot: this.stageRoot,
        prevUrl,
        nextUrl: bgUrl,
        transition: settings?.vnTransitionStyle || 'cinematic',
        sceneTitle: currentPlace?.name || state.scene.location || state.title,
        timeLabel: state.scene.timeLabel,
        forcePreview: !isInitialMount,
      });
      if (bgUrl && settings?.vnAmbientLightEnabled !== false) {
        void this.director.sampleAndApplyAmbientLight(bgUrl, this.stageRoot, true);
      }
    }

    // 2. Sync Persistent Weather Layer (Only when active weather effect changes!)
    const activeWeather = inferWeatherEffect(
      state.scene.weather,
      settings?.vnWeatherOverride,
    );
    if (activeWeather !== this.lastRenderedWeather && this.weatherLayerEl) {
      this.lastRenderedWeather = activeWeather;
      this.weatherLayerEl.className = `ls-vn-weather-layer${activeWeather ? ` ls-vn-weather-${activeWeather}` : ''}`;
      this.weatherLayerEl.innerHTML = activeWeather
        ? generateWeatherParticlesHtml(activeWeather, false)
        : '';
    }

    // 3. Resolve Active Turn & Beat
    const turns = this.getTurnsList();
    const wasAtLatest = this.lastTurnsCount > 0 && this.activeTurnIndex === this.lastTurnsCount - 1;
    if (
      this.activeTurnIndex < 0 ||
      this.activeTurnIndex >= turns.length ||
      (wasAtLatest && turns.length > this.lastTurnsCount)
    ) {
      this.activeTurnIndex = turns.length - 1;
    }
    this.lastTurnsCount = turns.length;
    const currentTurn = turns[this.activeTurnIndex]!;
    const turnSig = `${this.ctrl.chatId}:${currentTurn.id}:${this.activeTurnIndex}:${currentTurn.content.length}`;
    if (turnSig !== this.lastTurnSig) {
      this.lastTurnSig = turnSig;
      this.activeBeatIndex = 0;
    }

    const beats = this.beatPaginationEnabled
      ? splitTurnIntoVnBeats(currentTurn.content)
      : [currentTurn.content];
    if (this.activeBeatIndex >= beats.length) {
      this.activeBeatIndex = Math.max(0, beats.length - 1);
    }
    const beatText = beats[this.activeBeatIndex] ?? currentTurn.content;
    const speakerInfo = resolveVnBeatSpeaker(beatText, currentTurn.role, state);

    // 4. Surgically Sync 2D Character Sprites Layer (Matches Emotion + Clothes + Pose sprites automatically!)
    this.syncActorsLayer(state, speakerInfo, beatText);

    // 5. Sync Top HUD, In-Stage Floating HUD Widget, Popovers & Bottom Dialogue Dock
    this.syncTopHudAndPopovers(state);
    this.syncStageHudWidget();
    this.syncDialogueDockOnly(turns, currentTurn, beats, beatText, speakerInfo);

    // 6. Auto-TTS: Automatically speak the current beat whenever `ttsAutoPlayInStage` is ON and the beat changed!
    const currentBeatSig = `${turnSig}:${this.activeBeatIndex}:${this.beatPaginationEnabled}`;
    const autoTtsOn = settings?.ttsAutoPlayInStage !== false;
    if (autoTtsOn && currentBeatSig !== this.lastAutoSpokenBeatSig && beatText.trim().length > 1) {
      this.lastAutoSpokenBeatSig = currentBeatSig;
      this.speakCurrentBeat(true);
    }

    // 6. Sync 2.5D Parallax & Active Speaker Push
    this.director.syncParallaxAndSpeakerPush(this.stageRoot, {
      parallaxEnabled: settings?.vnParallaxEnabled !== false,
      speakerPushEnabled: true,
    });

    // Schedule non-TTS auto-play advance if TTS auto-play is off
    if (
      this.isAutoPlay &&
      !this.ctrl.tts.isPlaying &&
      (this.activeBeatIndex + 1 < beats.length || this.activeTurnIndex + 1 < turns.length)
    ) {
      if (this.autoPlayTimer) clearTimeout(this.autoPlayTimer);
      this.autoPlayTimer = setTimeout(() => {
        if (!this.ctrl.tts.isPlaying && this.isAutoPlay) {
          this.advanceBeatOrTurn();
        }
      }, 3200);
    }
  }

  private syncActorsLayer(
    state: CampaignState,
    speakerInfo: { speakerName: string; isNarrator: boolean; matchedActor: CharacterRecord | null },
    beatText = '',
  ): void {
    if (!this.actorsLayerEl) return;
    const shotMode: VnShotMode = this.ctrl.settings?.vnShotMode || 'waist';
    this.actorsLayerEl.dataset.shotMode = shotMode;

    const allChars = Object.values(state.characters);
    const hasSprite = (c: CharacterRecord) => {
      return Boolean(resolveBestCharacterSprite(c, beatText).url);
    };
    const presentWithSprites = allChars.filter(c => c.present && hasSprite(c));
    const anyWithSprites = allChars.filter(hasSprite);
    const stageCast = (presentWithSprites.length > 0 ? presentWithSprites : anyWithSprites).slice(0, 4);

    const slotOrder: VnStageSlotName[] =
      stageCast.length <= 1
        ? ['center']
        : stageCast.length === 2
          ? ['left', 'right']
          : ['left', 'center', 'right', 'far-right'];

    const activeIds = new Set(stageCast.map(c => c.id));
    for (const child of [...this.actorsLayerEl.children]) {
      const cid = (child as HTMLElement).dataset.actorId;
      if (!cid || !activeIds.has(cid)) {
        child.remove();
      }
    }

    stageCast.forEach((actor, idx) => {
      let slotEl = this.actorsLayerEl!.querySelector<HTMLElement>(
        `.ls-vn-actor-slot[data-actor-id="${CSS.escape(actor.id)}"]`,
      );
      if (!slotEl) {
        slotEl = this.createActorSlotDom(actor);
        this.actorsLayerEl!.append(slotEl);
      }

      const rig: CharacterStageRig = { ...DEFAULT_STAGE_RIG, ...(actor.stageRig ?? {}) };
      const slotName =
        rig.pinnedSlot && rig.slot && rig.slot !== 'hidden'
          ? rig.slot
          : slotOrder[idx % slotOrder.length]!;
      const isSpeaking =
        !speakerInfo.isNarrator &&
        (speakerInfo.matchedActor?.id === actor.id ||
          speakerInfo.speakerName.toLowerCase() === actor.name.toLowerCase());
      const demeanorVal = resolveCharacterFieldValue(actor, 'demeanor');
      const resolvedSprite = resolveBestCharacterSprite(actor, beatText);
      const spriteUrl = resolvedSprite.url;

      slotEl.dataset.slot = slotName;
      slotEl.dataset.activeSpeaker = String(isSpeaking);
      slotEl.dataset.emotion = mapDemeanorToStageEmotion(demeanorVal);

      const gizmoBar = slotEl.querySelector<HTMLElement>('.ls-vn-gizmo-bar');
      if (gizmoBar) {
        gizmoBar.style.display = this.uiHidden ? 'none' : '';
      }

      const rigEl = slotEl.querySelector<HTMLElement>('.ls-vn-avatar-rig');
      if (rigEl) {
        const flipMul = rig.flipX ? -1 : 1;
        rigEl.style.transform = `translate(${rig.offsetX}px, ${-rig.offsetY}px) scale(${(rig.scale * flipMul).toFixed(2)}, ${rig.scale.toFixed(2)})`;
        const existingImg = rigEl.querySelector<HTMLImageElement>('img.ls-vn-sprite-img');
        if (spriteUrl) {
          if (existingImg) {
            if (existingImg.getAttribute('src') !== spriteUrl) {
              existingImg.src = spriteUrl;
            }
          } else {
            const img = el('img', 'ls-vn-sprite-img');
            img.src = spriteUrl;
            img.alt = actor.name;
            img.draggable = false;
            rigEl.replaceChildren(img);
          }
        } else {
          rigEl.replaceChildren();
        }
      }
    });
  }

  private createActorSlotDom(actor: CharacterRecord): HTMLElement {
    const slotEl = el('div', 'ls-vn-actor-slot');
    slotEl.dataset.actorId = actor.id;

    const gizmoBar = el('div', 'ls-vn-gizmo-bar');
    const mutateRig = (updater: (cur: CharacterStageRig) => CharacterStageRig) => {
      const latestActor = this.ctrl.snapshot.state.characters[actor.id];
      if (!latestActor) return;
      const nextRig = updater({ ...DEFAULT_STAGE_RIG, ...(latestActor.stageRig ?? {}) });
      const nextChars = structuredClone(this.ctrl.snapshot.state.characters);
      nextChars[actor.id]!.stageRig = nextRig;
      void this.ctrl.request('state:mutate', {
        stateOverride: { characters: nextChars },
        reason: `Adjusted 2D stage rig for ${actor.name}`,
      });
    };

    gizmoBar.append(
      btn('🪪', () => openCharacterDossierModal(this.ctrl, actor.id), 'ls-btn-sm ls-btn-icon', 'Open Character Dossier'),
      btn('🔊', () => openVoiceAssignmentModal(this.ctrl, actor.id), 'ls-btn-sm ls-btn-icon', `Assign TTS Voice for ${actor.name}`),
      btn('🖼️', () => this.ctrl.pickAndUploadImage(actor.id, 'portrait'), 'ls-btn-sm ls-btn-icon', 'Upload 2D Character Sprite'),
      btn('＋', () => mutateRig(r => ({ ...r, scale: Number(Math.min(2.4, r.scale + 0.12).toFixed(2)) })), 'ls-btn-sm ls-btn-icon', 'Scale Up'),
      btn('－', () => mutateRig(r => ({ ...r, scale: Number(Math.max(0.45, r.scale - 0.12).toFixed(2)) })), 'ls-btn-sm ls-btn-icon', 'Scale Down'),
      btn('⇄', () => mutateRig(r => ({ ...r, flipX: !r.flipX })), 'ls-btn-sm ls-btn-icon', 'Flip Horizontally'),
      btn('↺', () => mutateRig(() => ({ ...DEFAULT_STAGE_RIG })), 'ls-btn-sm ls-btn-icon', 'Reset Position & Scale'),
    );

    const rigEl = el('div', 'ls-vn-avatar-rig');
    slotEl.append(gizmoBar, rigEl);

    // UI-Scale-Safe Pointer Dragging on 2D Sprites
    slotEl.addEventListener('pointerdown', e => {
      if (e.button !== 0 || (e.target as HTMLElement | null)?.closest('button')) return;
      const rect = slotEl.getBoundingClientRect();
      const uiScale = rect.width > 0 && slotEl.offsetWidth > 0 ? rect.width / slotEl.offsetWidth : 1;
      const latestActor = this.ctrl.snapshot.state.characters[actor.id];
      const curRig = { ...DEFAULT_STAGE_RIG, ...(latestActor?.stageRig ?? {}) };
      const startX = e.clientX;
      const startY = e.clientY;
      let nextX = curRig.offsetX;
      let nextY = curRig.offsetY;
      let moved = false;

      try {
        slotEl.setPointerCapture(e.pointerId);
      } catch {
        // Ignore
      }

      const onMove = (me: PointerEvent) => {
        const dx = (me.clientX - startX) / uiScale;
        const dy = (me.clientY - startY) / uiScale;
        if (!moved && Math.hypot(dx, dy) > 4) moved = true;
        if (!moved) return;
        nextX = Math.round(curRig.offsetX + dx);
        nextY = Math.round(curRig.offsetY - dy);
        const flipMul = curRig.flipX ? -1 : 1;
        rigEl.style.transform = `translate(${nextX}px, ${-nextY}px) scale(${(curRig.scale * flipMul).toFixed(2)}, ${curRig.scale.toFixed(2)})`;
      };

      const onUp = (ue: PointerEvent) => {
        slotEl.removeEventListener('pointermove', onMove);
        slotEl.removeEventListener('pointerup', onUp);
        slotEl.removeEventListener('pointercancel', onUp);
        try {
          slotEl.releasePointerCapture(ue.pointerId);
        } catch {
          // Ignore
        }
        if (moved) {
          mutateRig(r => ({ ...r, offsetX: nextX, offsetY: nextY }));
        }
      };

      slotEl.addEventListener('pointermove', onMove);
      slotEl.addEventListener('pointerup', onUp);
      slotEl.addEventListener('pointercancel', onUp);
    });

    return slotEl;
  }

  private syncTopHudAndPopovers(state: CampaignState): void {
    if (!this.topHudEl || !this.popoversEl) return;
    this.topHudEl.replaceChildren();
    this.popoversEl.replaceChildren();

    if (this.uiHidden) {
      const restoreWrap = el('div');
      restoreWrap.style.cssText = 'margin-left:auto;pointer-events:auto;';
      restoreWrap.append(
        btn('👁️ Show Stage UI (H)', () => {
          this.uiHidden = false;
          this.sync();
        }, 'ls-btn-sm ls-btn-primary'),
      );
      this.topHudEl.append(restoreWrap);
      return;
    }

    const banner = formatSceneBanner(state);
    const leftRow = el('div', 'ls-row');
    leftRow.append(
      el('span', 'ls-chip ls-chip-accent', `📍 ${banner.location}`),
      el('span', 'ls-chip', `🕰️ ${banner.time} · ${banner.date}`),
      el('span', 'ls-chip', `🌦️ ${banner.weather}`),
    );

    // Live Stat Shift Toast Pills on Stage
    const { deltas, template } = this.ctrl.snapshot;
    for (const [statId, deltaVal] of Object.entries(deltas.statDeltas)) {
      if (deltaVal === 0) continue;
      const schema = template.stats.find(s => s.id === statId);
      if (schema) {
        leftRow.append(
          el(
            'span',
            `ls-delta ${deltaVal > 0 ? 'is-pos' : 'is-neg'}`,
            `${schema.icon} ${schema.label} ${deltaVal > 0 ? `+${deltaVal} ▲` : `${deltaVal} ▼`}`,
          ),
        );
      }
    }

    const showHudWidget =
      this.ctrl.settings?.vnShowHudWidget !== undefined
        ? Boolean(this.ctrl.settings.vnShowHudWidget)
        : this.ctrl.vnShowHudWidget;
    const rightRow = el('div', 'ls-row');
    rightRow.append(
      btn(
        '🎨 Studio (Sprites & Locations)',
        () => openStageAssetStudioModal(this.ctrl, 'characters'),
        'ls-btn-sm ls-btn-primary',
        'Open Stage Visual Studio: Upload Character Emotion/Clothes/Pose Sprites & Location Time-of-Day Backdrops',
      ),
      btn(
        showHudWidget ? '🪟 Widget: ON' : '🪟 Widget: OFF',
        () => {
          const next = !showHudWidget;
          this.ctrl.vnShowHudWidget = next;
          if (this.ctrl.settings) this.ctrl.settings.vnShowHudWidget = next;
          this.ctrl.emitChange();
          void this.ctrl.request('settings:update', {
            settings: { vnShowHudWidget: next },
          });
        },
        `ls-btn-sm ${showHudWidget ? 'ls-btn-primary' : ''}`,
        'Show or hide the Floating HUD Widget over the VN Stage',
      ),
      btn('🔊 Voices & TTS', () => openVoiceAssignmentModal(this.ctrl), 'ls-btn-sm', 'Assign Per-Character & Narrator TTS Voices'),
      btn(
        '🎥 Camera & FX',
        () => {
          this.directorOpen = !this.directorOpen;
          this.sync();
        },
        `ls-btn-sm ${this.directorOpen ? 'ls-btn-primary' : ''}`,
      ),
      btn('👁️ Hide UI', () => {
        this.uiHidden = true;
        this.sync();
      }, 'ls-btn-sm', 'Hide UI (Shortcut: H)'),
      btn('🚪 Exit Stage', () => this.close(), 'ls-btn-sm', 'Exit VN Stage (Esc)'),
    );

    this.topHudEl.append(leftRow, rightRow);

    // Camera, Sprites & Weather FX Popover
    if (this.directorOpen) {
      const settings = this.ctrl.settings;
      const panel = el('div', 'ls-card ls-vn-director-popover');
      const head = el('div', 'ls-row-between');
      head.append(
        el('span', 'ls-kicker', '🎥 2D Camera, Sprites, Weather & Transitions'),
        btn('✕', () => {
          this.directorOpen = false;
          this.sync();
        }, 'ls-btn-sm ls-btn-icon'),
      );
      panel.append(head);

      const castList = Object.values(state.characters);
      if (castList.length > 0) {
        panel.append(el('small', 'ls-muted', 'Cast 2D Sprites (Click to Upload / Replace):'));
        const spriteRow = el('div', 'ls-row');
        for (const c of castList) {
          spriteRow.append(
            btn(
              `${c.portraitUrl ? '🖼️' : '➕'} ${c.name}`,
              () => this.ctrl.pickAndUploadImage(c.id, 'portrait'),
              `ls-btn-sm ${c.portraitUrl ? 'ls-chip-accent' : ''}`,
              `Upload 2D Stage Sprite for ${c.name}`,
            ),
          );
        }
        panel.append(spriteRow);
      }

      panel.append(el('small', 'ls-muted', 'Camera Shot Framing:'));
      const shotRow = el('div', 'ls-row');
      for (const [sId, sLbl] of [
        ['closeup', '🔍 Close-Up'],
        ['waist', '🧍 Waist Shot'],
        ['full', '🖼️ Full Body'],
        ['orbit', '🌀 Slow Orbit'],
      ] as const) {
        const b = btn(sLbl, () => {
          if (this.ctrl.settings) this.ctrl.settings.vnShotMode = sId;
          this.sync();
          void this.ctrl.request('settings:update', { settings: { vnShotMode: sId } });
        }, 'ls-btn-sm');
        if ((settings?.vnShotMode || 'waist') === sId) b.setAttribute('aria-current', 'page');
        shotRow.append(b);
      }
      panel.append(shotRow);

      panel.append(el('small', 'ls-muted', 'Weather Particle Overlay:'));
      const weatherRow = el('div', 'ls-row');
      for (const [wId, wLbl] of [
        ['', '✨ Auto'],
        ['clear', '☀️ Clear'],
        ['rain', '🌧️ Rain'],
        ['heavy_rain', '⛈️ Storm'],
        ['snow', '❄️ Snow'],
        ['sakura', '🌸 Sakura'],
        ['fog', '🌫️ Fog'],
        ['fireflies', '✨ Fireflies'],
        ['embers', '🔥 Embers'],
      ] as const) {
        const b = btn(wLbl, () => {
          if (this.ctrl.settings) this.ctrl.settings.vnWeatherOverride = wId;
          this.sync();
          void this.ctrl.request('settings:update', { settings: { vnWeatherOverride: wId } });
        }, 'ls-btn-sm');
        if ((settings?.vnWeatherOverride ?? '') === wId) b.setAttribute('aria-current', 'page');
        weatherRow.append(b);
      }
      panel.append(weatherRow);

      panel.append(el('small', 'ls-muted', 'Backdrop Transition Style (Click to Preview):'));
      const trRow = el('div', 'ls-row');
      for (const [tId, tLbl] of [
        ['cinematic', '🎬 Cinematic'],
        ['wipe', '➡️ Wipe'],
        ['iris', '⭕ Iris'],
        ['strips', '🎞️ Strips'],
        ['black', '⬛ Curtain'],
        ['flash', '⚡ Flash'],
      ] as const) {
        const b = btn(tLbl, () => {
          if (this.ctrl.settings) this.ctrl.settings.vnTransitionStyle = tId;
          this.syncTopHudAndPopovers(state);
          if (this.stageRoot) {
            const currentPlace =
              state.places[state.currentPlaceId] ?? Object.values(state.places)[0];
            const curBg = currentPlace?.backdropUrl || '';
            void this.director.playBackgroundTransition({
              stageRoot: this.stageRoot,
              prevUrl: curBg,
              nextUrl: curBg,
              transition: tId,
              sceneTitle: currentPlace?.name || state.scene.location || state.title,
              timeLabel: state.scene.timeLabel,
              forcePreview: true,
            });
          }
          void this.ctrl.request('settings:update', { settings: { vnTransitionStyle: tId } });
        }, 'ls-btn-sm');
        if ((settings?.vnTransitionStyle || 'cinematic') === tId) b.setAttribute('aria-current', 'page');
        trRow.append(b);
      }
      panel.append(trRow);
      this.popoversEl.append(panel);
    }

    // Skill Check Overlay Card
    if (this.activeCheckResult) {
      const res = this.activeCheckResult;
      const overlay = el('div', 'ls-vn-d20-overlay');
      const card = el('div', 'ls-card ls-vn-d20-card');
      card.append(
        el('span', 'ls-kicker', `🎲 Lumi Stat Check · ${res.statLabel}`),
        el(
          'div',
          '',
          `${res.roll}`,
        ),
      );
      (card.lastElementChild as HTMLElement).style.cssText = `font-size:40px;font-weight:900;color:${res.passed ? 'var(--ls-success)' : 'var(--ls-danger)'};`;
      card.append(
        el(
          'p',
          'ls-muted',
          `Stat ${res.statVal} + Roll ${res.roll} vs DC ${res.dc} → ${res.passed ? 'SUCCESS' : 'COMPLICATION'}`,
        ),
      );
      const actRow = el('div', 'ls-row');
      actRow.style.justifyContent = 'center';
      actRow.append(
        btn('Insert into Reply ↵', () => {
          const tag = `[🎲 ${res.statLabel} Check: ${res.roll} (Stat ${res.statVal}) vs DC ${res.dc} — ${res.passed ? 'SUCCESS' : 'COMPLICATION'}]`;
          this.activeCheckResult = null;
          this.composerOpen = true;
          this.sync();
          const inp = this.bottomDockEl?.querySelector<HTMLInputElement>('[data-ls-vn-reply-input]');
          if (inp) {
            inp.value = `${inp.value ? `${inp.value} ` : ''}${tag}`;
            inp.focus();
          }
        }, 'ls-btn-sm ls-btn-primary'),
        btn('Dismiss', () => {
          this.activeCheckResult = null;
          this.sync();
        }, 'ls-btn-sm'),
      );
      card.append(actRow);
      overlay.append(card);
      this.popoversEl.append(overlay);
    }
  }

  private syncDialogueDockOnly(
    turnsArg?: Array<{ id: string; role: 'user' | 'assistant'; content: string }>,
    currentTurnArg?: { id: string; role: 'user' | 'assistant'; content: string },
    beatsArg?: string[],
    beatTextArg?: string,
    speakerInfoArg?: { speakerName: string; isNarrator: boolean; matchedActor: CharacterRecord | null },
  ): void {
    if (!this.bottomDockEl) return;
    if (this.uiHidden) {
      this.bottomDockEl.replaceChildren();
      return;
    }

    const { state, template } = this.ctrl.snapshot;
    const turns = turnsArg ?? this.getTurnsList();
    const turnIdx =
      this.activeTurnIndex >= 0 && this.activeTurnIndex < turns.length
        ? this.activeTurnIndex
        : turns.length - 1;
    const currentTurn = currentTurnArg ?? turns[turnIdx]!;
    const beats =
      beatsArg ??
      (this.beatPaginationEnabled
        ? splitTurnIntoVnBeats(currentTurn.content)
        : [currentTurn.content]);
    const beatText = beatTextArg ?? beats[this.activeBeatIndex] ?? currentTurn.content;
    const speakerInfo =
      speakerInfoArg ?? resolveVnBeatSpeaker(beatText, currentTurn.role, state);

    const beatSig = `${this.ctrl.chatId}:${currentTurn.id}:${turnIdx}:${this.activeBeatIndex}:${this.beatPaginationEnabled}:${beatText.length}`;
    const beatChanged = beatSig !== this.lastBeatSig;
    this.lastBeatSig = beatSig;

    // Preserve any text being typed in the reply input
    const existingInputVal =
      this.bottomDockEl.querySelector<HTMLInputElement>('[data-ls-vn-reply-input]')?.value ?? '';

    this.bottomDockEl.replaceChildren();

    // Optional Inner Monologue Peek Bubble above the Dialogue Box
    const matchedActor = speakerInfo.matchedActor;
    const innerThought = matchedActor ? resolveCharacterFieldValue(matchedActor, 'inner_thought') : '';
    if (matchedActor && innerThought && this.thoughtPeekOpen) {
      const thoughtBar = el('div', 'ls-thought-box ls-row-between');
      thoughtBar.style.marginBottom = '8px';
      thoughtBar.append(
        el('span', '', `💭 ${matchedActor.name}'s Inner Monologue: “${innerThought}”`),
        btn('🔊 Speak Thought', () => {
          void this.ctrl.tts.playSegments(
            [
              {
                kind: 'dialogue',
                text: innerThought,
                speakerName: matchedActor.name,
                actorId: matchedActor.id,
                connectionId: matchedActor.ttsVoice?.connectionId,
                voiceId: matchedActor.ttsVoice?.voiceId,
                speed: matchedActor.ttsVoice?.speed || 1.0,
              },
            ],
            () => this.syncDialogueDockOnly(),
          );
        }, 'ls-btn-sm'),
      );
      this.bottomDockEl.append(thoughtBar);
    }

    const box = el('div', 'ls-vn-dialogue-box');
    box.addEventListener('click', e => {
      if ((e.target as HTMLElement | null)?.closest('button, input, form, select')) return;
      const sel = typeof window !== 'undefined' ? window.getSelection()?.toString() : '';
      if (sel && sel.length > 0) return;
      this.advanceBeatOrTurn();
    });

    // Speaker Nameplate + Beat Counter Row
    const headRow = el('div', 'ls-row-between');
    const leftBadges = el('div', 'ls-row');
    const speakerBadge = el(
      'span',
      'ls-vn-speaker-badge',
      `${currentTurn.role === 'user' ? '🧑' : speakerInfo.isNarrator ? '📖' : '🎭'} ${speakerInfo.speakerName}`,
    );
    speakerBadge.style.background = getSpeakerAccentColor(speakerInfo.speakerName);
    leftBadges.append(speakerBadge);

    if (matchedActor) {
      const dem = resolveCharacterFieldValue(matchedActor, 'demeanor');
      if (dem) leftBadges.append(el('span', 'ls-chip', `🎭 ${dem}`));
      if (innerThought) {
        leftBadges.append(
          btn(
            this.thoughtPeekOpen ? '💭 Hide Thought' : '💭 Inner Thought',
            () => {
              this.thoughtPeekOpen = !this.thoughtPeekOpen;
              this.syncDialogueDockOnly();
            },
            `ls-btn-sm ${this.thoughtPeekOpen ? 'ls-btn-primary' : ''}`,
          ),
        );
      }
    }
    if (this.ctrl.tts.isPlaying && this.ctrl.tts.activeSpeakerLabel) {
      leftBadges.append(
        el('span', 'ls-chip ls-chip-accent', `🔊 Speaking: ${this.ctrl.tts.activeSpeakerLabel}`),
      );
    }

    const counterSpan = el(
      'small',
      'ls-muted',
      `Beat ${this.activeBeatIndex + 1}/${beats.length} · Turn ${turnIdx + 1}/${turns.length}`,
    );
    headRow.append(leftBadges, counterSpan);
    box.append(headRow);

    // Prose Container
    const proseBox = el('div', 'ls-vn-prose');
    const proseSpan = el('span');
    proseSpan.setAttribute('data-ls-vn-prose', 'true');
    proseBox.append(proseSpan);
    box.append(proseBox);

    if (beatChanged) {
      this.runTypewriter(proseSpan, beatText);
    } else {
      proseSpan.replaceChildren(renderFormattedBeatDom(beatText));
    }

    // Controls Toolbar
    const controlsBar = el('div', 'ls-row-between ls-vn-controls-bar');
    const navCluster = el('div', 'ls-row');

    const prevBtn = btn('◀ PREV', () => this.stepBackBeatOrTurn(), 'ls-btn-sm');
    prevBtn.disabled = turnIdx === 0 && this.activeBeatIndex === 0;

    const nextBtn = btn('NEXT ▶', () => this.advanceBeatOrTurn(), 'ls-btn-sm ls-btn-primary');
    nextBtn.disabled = turnIdx + 1 >= turns.length && this.activeBeatIndex + 1 >= beats.length;

    const modeBtn = btn(
      this.beatPaginationEnabled
        ? `📖 VN (${this.activeBeatIndex + 1}/${beats.length})`
        : '📜 Full Turn',
      () => {
        this.beatPaginationEnabled = !this.beatPaginationEnabled;
        this.activeBeatIndex = 0;
        this.sync();
      },
      `ls-btn-sm ${this.beatPaginationEnabled ? 'ls-btn-primary' : ''}`,
    );

    const backlogBtn = btn('📜 Backlog', () => {
      this.ctrl.modals.open(
        { title: `📜 Scene Transcript & Turn Backlog (${turns.length})`, width: 620, maxHeight: 700 },
        (mBody, close) => {
          const stack = el('div', 'ls-stack');
          turns.forEach((t, idx) => {
            const sp = resolveVnBeatSpeaker(t.content, t.role, state);
            const row = el('div', 'ls-stat-cell');
            row.style.cursor = 'pointer';
            if (idx === turnIdx) row.style.borderColor = 'var(--ls-primary)';
            const rTop = el('div', 'ls-row-between');
            rTop.append(
              el('strong', '', `${t.role === 'user' ? '🧑' : '🎭'} ${sp.speakerName}`),
              el('span', 'ls-chip', `Turn #${idx + 1}${idx === turnIdx ? ' · Active' : ''}`),
            );
            row.append(rTop, el('p', 'ls-muted', t.content.slice(0, 260) + (t.content.length > 260 ? '…' : '')));
            row.addEventListener('click', () => {
              this.activeTurnIndex = idx;
              this.activeBeatIndex = 0;
              close();
              this.sync();
            });
            stack.append(row);
          });
          mBody.append(stack);
        },
      );
    }, 'ls-btn-sm');

    const autoBtn = btn(
      '▶ Auto',
      () => {
        this.isAutoPlay = !this.isAutoPlay;
        if (!this.isAutoPlay && this.autoPlayTimer) {
          clearTimeout(this.autoPlayTimer);
          this.autoPlayTimer = null;
        }
        this.sync();
      },
      `ls-btn-sm ${this.isAutoPlay ? 'ls-btn-primary' : ''}`,
    );

    const skipBtn = btn(
      this.ctrl.tts.isPlaying ? '⏭️ Skip Voice' : '⏭️ Skip',
      () => {
        if (this.ctrl.tts.isPlaying) {
          this.ctrl.tts.stop();
          this.syncDialogueDockOnly();
        } else {
          this.advanceBeatOrTurn();
        }
      },
      `ls-btn-sm ${this.ctrl.tts.isPlaying ? 'ls-btn-primary' : ''}`,
      this.ctrl.tts.isPlaying ? 'Skip current TTS voice playback' : 'Skip to next beat',
    );

    const replayVoiceBtn = btn(
      '↺',
      () => this.speakCurrentBeat(false),
      'ls-btn-sm ls-btn-icon',
      'Replay voice for current beat',
    );

    const isAutoTtsEnabled = this.ctrl.settings?.ttsAutoPlayInStage !== false;
    const autoVoiceToggle = btn(
      isAutoTtsEnabled ? '🔊 Auto-TTS: ON' : '🔈 Auto-TTS: OFF',
      () => {
        const nextVal = !isAutoTtsEnabled;
        if (this.ctrl.settings) this.ctrl.settings.ttsAutoPlayInStage = nextVal;
        if (!nextVal) {
          this.ctrl.tts.stop();
        } else {
          this.lastAutoSpokenBeatSig = '';
        }
        this.sync();
        void this.ctrl.request('settings:update', {
          settings: { ttsAutoPlayInStage: nextVal },
        });
      },
      `ls-btn-sm ${isAutoTtsEnabled ? 'ls-btn-primary' : ''}`,
      'Automatically speak each beat as you advance or open the stage',
    );

    const checkBtn = btn('🎲 Stat Check', () => {
      const charMeters = template.stats.filter(s => s.enabled && s.scope === 'character' && s.kind === 'meter');
      const playerMeters = template.stats.filter(s => s.enabled && s.scope === 'player' && s.kind === 'meter');
      const pickedSchema =
        (matchedActor && charMeters[0]) || playerMeters[0] || template.stats[0];
      const rawVal =
        (matchedActor && pickedSchema ? matchedActor.meters[pickedSchema.id]?.value : undefined) ??
        (pickedSchema ? state.stats[pickedSchema.id]?.value : undefined) ??
        50;
      const statVal = typeof rawVal === 'number' ? rawVal : 50;
      let d20 = 10;
      if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
        const arr = new Uint32Array(1);
        crypto.getRandomValues(arr);
        d20 = (arr[0]! % 20) + 1;
      } else {
        d20 = Math.floor(Math.random() * 20) + 1;
      }
      const bonus = Math.round((statVal - 50) / 10);
      const total = Math.max(1, d20 + bonus);
      const dc = 12;
      this.activeCheckResult = {
        statLabel: pickedSchema ? `${pickedSchema.icon} ${pickedSchema.label}` : 'Composure',
        statVal,
        roll: total,
        dc,
        passed: total >= dc,
      };
      this.syncTopHudAndPopovers(state);
    }, 'ls-btn-sm');

    navCluster.append(prevBtn, nextBtn, skipBtn, replayVoiceBtn, modeBtn, backlogBtn, autoBtn, autoVoiceToggle, checkBtn);

    const rightCluster = el('div', 'ls-row');
    if (this.ctrl.ctx.stt && (this.ctrl.ctx.host?.capabilities?.['speech-to-text-v1'] ?? 0) >= 1) {
      rightCluster.append(
        btn(
          this.isRecordingStt ? '🎙️ Listening…' : '🎙️ Mic',
          () => this.toggleSttDictation(),
          `ls-btn-sm ${this.isRecordingStt ? 'ls-btn-primary' : ''}`,
        ),
      );
    }
    rightCluster.append(
      btn(
        this.composerOpen ? '✍️ Hide Reply' : '✍️ Reply',
        () => {
          this.composerOpen = !this.composerOpen;
          this.syncDialogueDockOnly();
        },
        `ls-btn-sm ${this.composerOpen ? 'ls-btn-primary' : ''}`,
      ),
    );

    controlsBar.append(navCluster, rightCluster);
    box.append(controlsBar);

    if (this.composerOpen) {
      const form = el('form', 'ls-row ls-vn-reply-form');
      const inp = el('input', 'ls-input');
      inp.setAttribute('data-ls-vn-reply-input', 'true');
      inp.style.flex = '1';
      inp.placeholder = 'Write your dialogue or action and press Enter…';
      inp.value = existingInputVal;
      const sendBtn = btn('Send Reply ↵', () => undefined, 'ls-btn-primary');
      sendBtn.type = 'submit';
      form.append(inp, sendBtn);
      form.addEventListener('submit', ev => {
        ev.preventDefault();
        ev.stopPropagation();
        const text = inp.value.trim();
        if (!text) return;
        inp.value = '';
        this.composerOpen = false;
        this.ctrl.notify('⏳ Sending reply & generating next scene beat…');
        void this.ctrl.request('vn:sendReply', { text });
      });
      box.append(form);
    }

    this.bottomDockEl.append(box);
  }

  private toggleSttDictation(): void {
    const stt = this.ctrl.ctx.stt;
    if (!stt) return;
    if (this.isRecordingStt && this.sttSession) {
      void this.sttSession.stop().catch(() => undefined);
      return;
    }
    try {
      this.isRecordingStt = true;
      this.composerOpen = true;
      this.syncDialogueDockOnly();
      const session = stt.start({ continuous: true, interimResults: true });
      this.sttSession = session;
      void session.result
        .then(({ text }) => {
          this.isRecordingStt = false;
          this.sttSession = null;
          this.syncDialogueDockOnly();
          const inp = this.bottomDockEl?.querySelector<HTMLInputElement>('[data-ls-vn-reply-input]');
          if (inp && text?.trim()) {
            inp.value = `${inp.value ? `${inp.value} ` : ''}${text.trim()}`;
            inp.focus();
          }
        })
        .catch(() => {
          this.isRecordingStt = false;
          this.sttSession = null;
          this.syncDialogueDockOnly();
        });
    } catch {
      this.isRecordingStt = false;
      this.syncDialogueDockOnly();
    }
  }

  public destroy(): void {
    this.stageHudScope.clear();
    this.close();
    this.portalMount?.destroy();
    this.portalMount = null;
  }
}
