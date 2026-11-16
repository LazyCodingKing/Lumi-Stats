import type { SpindleAPI } from 'lumiverse-spindle-types';
import { formatSceneBanner, formatStoryClock } from '../shared/formula';
import {
  buildChatVariableProjection,
  compileNarratorContinuity,
} from '../shared/prompt-compiler';
import { diffCampaignStates } from '../shared/state-reducer';
import {
  BUILTIN_TEMPLATES,
  createDefaultTemplate,
  createEmptyCampaignState,
  normalizeImportedTemplate,
} from '../shared/templates';
import {
  LUMI_CHAT_VAR_CLOCK,
  LUMI_CHAT_VAR_HEADER,
  LUMI_CHAT_VAR_JSON,
  LUMI_CHAT_VAR_LOCATION,
  type CampaignSnapshot,
  type CampaignState,
  type CheckpointRecord,
  type LumiStatsTemplate,
  type LumiUserSettings,
  type MessageSourceBinding,
} from '../shared/types';

export const DEFAULT_USER_SETTINGS: Readonly<LumiUserSettings> = Object.freeze({
  autoTrack: true,
  extractionMode: 'sidecar',
  injectContinuity: true,
  tokenBudget: 450,
  protocolVerbosity: 'compact',
  sidecarHistoryTurns: 4,
  sidecarMaxCharsPerMsg: 2500,
  defaultTemplateId: 'universal_companion',
  extractorConnectionId: '',
  extractorModel: '',
  copilotConnectionId: '',
  copilotModel: '',
  cleanBraille: true,
  memoryCortexSync: false,
  worldInfoGating: true,
  thresholdToasts: true,
  debugInspector: false,
  ttsEnabled: true,
  ttsAutoPlayInStage: true,
  ttsReadMode: 'dialogue_only',
  narratorConnectionId: '',
  narratorVoiceId: '',
  narratorModel: '',
  narratorSpeed: 1.0,
  vnShotMode: 'waist',
  vnTransitionStyle: 'cinematic',
  vnWeatherOverride: '',
  vnParallaxEnabled: true,
  vnAmbientLightEnabled: true,
  vnShowHudWidget: true,
  sensitiveObfuscatorEnabled: false,
  obfuscateVowelsWithOne: true,
  obfuscateOnSend: true,
  obfuscateOnOutput: false,
  restoreObfuscatedOnRender: true,
  includeCipherHint: false,
  sensitiveWords: [],
});

interface PersistedStateEnvelope {
  schemaVersion: 1;
  chatId: string;
  revision: number;
  state: CampaignState;
  bindings: MessageSourceBinding[];
}

interface PersistedCheckpointFile {
  chatId: string;
  entries: CheckpointRecord[];
}

interface CachedContinuityEntry {
  revision: number;
  templateUpdatedAt: string;
  charBudget: number;
  text: string;
  omittedCount: number;
  tokenCount?: number;
}

const MAX_CHECKPOINTS = 25;
const MAX_CACHED_SCOPES = 50;

export class LumiStorage {
  private settingsCache = new Map<string, LumiUserSettings>();
  private stateCache = new Map<string, PersistedStateEnvelope>();
  private checkpointCache = new Map<string, CheckpointRecord[]>();
  private templateCache = new Map<string, LumiStatsTemplate>();
  private explicitChatTemplates = new Set<string>();
  private continuityCache = new Map<string, CachedContinuityEntry>();
  private dirsReady = new Set<string>();
  private queues = new Map<string, Promise<unknown>>();
  private queueDepth = new Map<string, number>();

  constructor(readonly api: SpindleAPI) {}

  private setBoundedCache<K, V>(map: Map<K, V>, key: K, value: V, max = MAX_CACHED_SCOPES): void {
    if (map.has(key)) map.delete(key);
    else if (map.size >= max) {
      const oldest = map.keys().next().value;
      if (oldest !== undefined) map.delete(oldest);
    }
    map.set(key, value);
  }

  private userKey(userId?: string): string {
    return userId?.trim() ? userId.trim() : '__owner__';
  }

  private scopeKey(userId: string | undefined, chatId: string): string {
    return `${this.userKey(userId)}:${chatId}`;
  }

  private async ensureDirs(userId?: string): Promise<void> {
    const uk = this.userKey(userId);
    if (this.dirsReady.has(uk)) return;
    this.dirsReady.add(uk);
    for (const dir of ['configs', 'state', 'history', 'copilot']) {
      await this.api.userStorage.mkdir(dir, userId).catch(() => undefined);
    }
  }

  /**
   * Returns memoized continuity text (and cached server token count if already measured)
   * for `(userId, chatId, revision, template.updatedAt, charBudget)`.
   */
  getCompiledContinuity(
    userId: string | undefined,
    chatId: string,
    revision: number,
    state: CampaignState,
    template: LumiStatsTemplate,
    charBudget = 2400,
  ): CachedContinuityEntry {
    const key = this.scopeKey(userId, chatId);
    const cached = this.continuityCache.get(key);
    if (
      cached &&
      cached.revision === revision &&
      cached.templateUpdatedAt === template.updatedAt &&
      cached.charBudget === charBudget
    ) {
      return cached;
    }
    const compiled = compileNarratorContinuity(state, template, charBudget);
    const entry: CachedContinuityEntry = {
      revision,
      templateUpdatedAt: template.updatedAt,
      charBudget,
      text: compiled.text,
      omittedCount: compiled.omittedCount,
    };
    this.setBoundedCache(this.continuityCache, key, entry);
    return entry;
  }

  /**
   * Serializes mutating operations per `(userId, chatId)` so concurrent events never race.
   */
  queue<T>(userId: string | undefined, chatId: string, fn: () => Promise<T>): Promise<T> {
    const key = this.scopeKey(userId, chatId);
    const depth = this.queueDepth.get(key) ?? 0;
    if (depth >= 16) {
      return Promise.reject(new Error('Too many queued Lumi Stats operations for this chat.'));
    }
    this.queueDepth.set(key, depth + 1);
    const prev = this.queues.get(key) ?? Promise.resolve();
    const next = prev.catch(() => undefined).then(fn);
    this.queues.set(key, next);
    void next
      .finally(() => {
        const remaining = (this.queueDepth.get(key) ?? 1) - 1;
        if (remaining <= 0) this.queueDepth.delete(key);
        else this.queueDepth.set(key, remaining);
        if (this.queues.get(key) === next) this.queues.delete(key);
      })
      .catch(() => undefined);
    return next;
  }

  private clearOwnerMirrorForChat(userId: string | undefined, chatId: string): void {
    if (!chatId) return;
    if (!userId?.trim()) {
      const suffix = `:${chatId}`;
      for (const map of [
        this.templateCache,
        this.stateCache,
        this.checkpointCache,
        this.continuityCache,
      ] as Array<Map<string, unknown>>) {
        for (const k of map.keys()) {
          if (k.endsWith(suffix)) map.delete(k);
        }
      }
      for (const k of this.explicitChatTemplates) {
        if (k.endsWith(suffix)) this.explicitChatTemplates.delete(k);
      }
    } else {
      const ownerKey = `__owner__:${chatId}`;
      this.templateCache.delete(ownerKey);
      this.stateCache.delete(ownerKey);
      this.checkpointCache.delete(ownerKey);
      this.continuityCache.delete(ownerKey);
      this.explicitChatTemplates.delete(ownerKey);
    }
  }

  getSettingsSync(userId?: string): LumiUserSettings {
    const uk = this.userKey(userId);
    let cached = this.settingsCache.get(uk);
    if (!cached && !userId?.trim()) {
      for (const v of this.settingsCache.values()) {
        cached = v;
        break;
      }
    }
    return structuredClone(cached ?? DEFAULT_USER_SETTINGS);
  }

  async loadSettings(userId?: string): Promise<LumiUserSettings> {
    const uk = this.userKey(userId);
    const mem = this.settingsCache.get(uk);
    if (mem) return structuredClone(mem);

    const saved = await this.api.userStorage.getJson<Partial<LumiUserSettings>>('settings.json', {
      fallback: {},
      userId,
    });
    const merged: LumiUserSettings = {
      ...DEFAULT_USER_SETTINGS,
      ...saved,
    };
    this.settingsCache.set(uk, merged);
    return structuredClone(merged);
  }

  async saveSettings(
    userId: string | undefined,
    patch: Partial<LumiUserSettings>,
  ): Promise<LumiUserSettings> {
    const current = await this.loadSettings(userId);
    const next: LumiUserSettings = {
      ...current,
      ...patch,
    };
    if (!userId?.trim()) {
      this.settingsCache.clear();
    } else {
      this.settingsCache.delete('__owner__');
    }
    this.settingsCache.set(this.userKey(userId), next);
    await this.api.userStorage.setJson('settings.json', next, { indent: 2, userId });
    return structuredClone(next);
  }

  async listCustomTemplates(userId?: string): Promise<LumiStatsTemplate[]> {
    const raw = await this.api.userStorage.getJson<unknown[]>('templates.json', {
      fallback: [],
      userId,
    });
    if (!Array.isArray(raw)) return [];
    return raw.map(item => normalizeImportedTemplate(item));
  }

  evictTemplateFromCache(userId: string | undefined, templateId: string): void {
    const uk = this.userKey(userId);
    const prefix = `${uk}:`;
    for (const [key, tpl] of this.templateCache.entries()) {
      const matchesUser = uk === '__owner__' || key.startsWith(prefix) || key.startsWith('__owner__:');
      if (matchesUser && tpl.id === templateId) {
        this.templateCache.delete(key);
        this.explicitChatTemplates.delete(key);
        this.continuityCache.delete(key);
      }
    }
  }

  async upsertCustomTemplateInLibrary(
    userId: string | undefined,
    template: LumiStatsTemplate,
  ): Promise<{ library: LumiStatsTemplate[]; saved: LumiStatsTemplate }> {
    return this.queue(userId, '__library__', async () => {
      await this.ensureDirs(userId);
      const list = await this.listCustomTemplates(userId);
      const normalized = normalizeImportedTemplate(template, template.name);
      if (BUILTIN_TEMPLATES.some(b => b.id === normalized.id)) {
        normalized.id = `custom_${normalized.id}_${Date.now().toString(36).slice(-4)}`;
      }

      const existingIdx = list.findIndex(t => t.id === normalized.id);
      if (existingIdx < 0) {
        const usedNames = new Set(list.map(t => t.name.toLowerCase()));
        if (usedNames.has(normalized.name.toLowerCase())) {
          let suffix = 2;
          const baseName = normalized.name.slice(0, 74);
          while (usedNames.has(`${baseName} (${suffix})`.toLowerCase())) {
            suffix++;
          }
          normalized.name = `${baseName} (${suffix})`;
        }
      }

      const filtered = list.filter(t => t.id !== normalized.id);
      const next = [...filtered, normalized].slice(-50);
      await this.api.userStorage.setJson('templates.json', next, { indent: 2, userId });
      this.evictTemplateFromCache(userId, normalized.id);
      return { library: next, saved: normalized };
    });
  }

  async saveCustomTemplateToLibrary(
    userId: string | undefined,
    template: LumiStatsTemplate,
  ): Promise<LumiStatsTemplate[]> {
    const { library } = await this.upsertCustomTemplateInLibrary(userId, template);
    return library;
  }

  async deleteCustomTemplateFromLibrary(
    userId: string | undefined,
    templateId: string,
  ): Promise<LumiStatsTemplate[]> {
    return this.queue(userId, '__library__', async () => {
      await this.ensureDirs(userId);
      const list = await this.listCustomTemplates(userId);
      const next = list.filter(t => t.id !== templateId);
      await this.api.userStorage.setJson('templates.json', next, { indent: 2, userId });
      this.evictTemplateFromCache(userId, templateId);
      return next;
    });
  }

  async loadChatTemplate(
    userId: string | undefined,
    chatId: string,
    presetDefaultTemplateId?: string,
  ): Promise<LumiStatsTemplate> {
    const key = this.scopeKey(userId, chatId);
    const presetPref = presetDefaultTemplateId?.trim();
    const cached = this.templateCache.get(key);
    if (
      cached &&
      (!presetPref || this.explicitChatTemplates.has(key) || cached.id === presetPref)
    ) {
      return structuredClone(cached);
    }

    await this.ensureDirs(userId);
    const saved = await this.api.userStorage.getJson<unknown | null>(
      `configs/${encodeURIComponent(chatId)}.json`,
      { fallback: null, userId },
    );

    let resolved: LumiStatsTemplate | undefined;
    let isExplicit = false;
    if (saved && typeof saved === 'object') {
      resolved = normalizeImportedTemplate(saved);
      isExplicit = true;
    }

    if (!resolved && chatId && chatId !== 'sandbox' && this.api.permissions.has('chats') && this.api.permissions.has('characters')) {
      try {
        const chat = await (this.api.chats.get as (id: string, u?: string) => Promise<{ character_id?: string } | null>)(chatId, userId);
        const card = chat?.character_id
          ? await (this.api.characters.get as (id: string, u?: string) => Promise<{ extensions?: Record<string, unknown> } | null>)(chat.character_id, userId)
          : null;
        const extBag = card?.extensions?.lumi_stats as Record<string, unknown> | undefined;
        if (extBag?.template && typeof extBag.template === 'object') {
          resolved = normalizeImportedTemplate(extBag.template);
          isExplicit = true;
        }
      } catch {
        // Ignore if card lookup fails
      }
    }

    if (!resolved) {
      const settings = await this.loadSettings(userId);
      const custom = await this.listCustomTemplates(userId);
      const preferredId = presetPref || settings.defaultTemplateId;
      resolved =
        custom.find(t => t.id === preferredId) ??
        BUILTIN_TEMPLATES.find(t => t.id === preferredId) ??
        custom.find(t => t.id === settings.defaultTemplateId) ??
        BUILTIN_TEMPLATES.find(t => t.id === settings.defaultTemplateId) ??
        createDefaultTemplate();
    }

    if (isExplicit) this.explicitChatTemplates.add(key);
    else this.explicitChatTemplates.delete(key);

    this.setBoundedCache(this.templateCache, key, structuredClone(resolved));
    return structuredClone(resolved);
  }

  async saveChatTemplate(
    userId: string | undefined,
    chatId: string,
    template: LumiStatsTemplate,
  ): Promise<LumiStatsTemplate> {
    await this.ensureDirs(userId);
    const normalized = normalizeImportedTemplate(template, template.name);
    this.clearOwnerMirrorForChat(userId, chatId);
    const key = this.scopeKey(userId, chatId);
    this.explicitChatTemplates.add(key);
    this.setBoundedCache(this.templateCache, key, structuredClone(normalized));
    this.continuityCache.delete(key);
    await this.api.userStorage.setJson(
      `configs/${encodeURIComponent(chatId)}.json`,
      normalized,
      { indent: 2, userId },
    );
    return structuredClone(normalized);
  }

  async loadCheckpoints(userId: string | undefined, chatId: string): Promise<CheckpointRecord[]> {
    if (!chatId || chatId === 'sandbox') return [];
    const key = this.scopeKey(userId, chatId);
    const mem = this.checkpointCache.get(key);
    if (mem) return structuredClone(mem);

    await this.ensureDirs(userId);
    const file = await this.api.userStorage.getJson<PersistedCheckpointFile | null>(
      `history/${encodeURIComponent(chatId)}.json`,
      { fallback: null, userId },
    );
    const entries = Array.isArray(file?.entries) ? file.entries : [];
    this.setBoundedCache(this.checkpointCache, key, structuredClone(entries));
    return entries;
  }

  private async saveCheckpoints(
    userId: string | undefined,
    chatId: string,
    entries: CheckpointRecord[],
  ): Promise<void> {
    if (!chatId || chatId === 'sandbox') return;
    await this.ensureDirs(userId);
    const bounded = entries.slice(-MAX_CHECKPOINTS);
    this.setBoundedCache(this.checkpointCache, this.scopeKey(userId, chatId), structuredClone(bounded));
    await this.api.userStorage.setJson(
      `history/${encodeURIComponent(chatId)}.json`,
      { chatId, entries: bounded } satisfies PersistedCheckpointFile,
      { userId },
    );
  }

  getStateAndTemplateSync(
    userId: string | undefined,
    chatId: string,
  ): { state: CampaignState; template: LumiStatsTemplate; revision: number } {
    const key = this.scopeKey(userId, chatId);
    let template = this.templateCache.get(key);
    let env = this.stateCache.get(key);
    if (!userId?.trim() && chatId) {
      const suffix = `:${chatId}`;
      if (!template) {
        for (const [k, v] of this.templateCache.entries()) {
          if (k.endsWith(suffix)) {
            template = v;
            break;
          }
        }
      }
      if (!env) {
        for (const [k, v] of this.stateCache.entries()) {
          if (k.endsWith(suffix)) {
            env = v;
            break;
          }
        }
      }
    }
    const resolvedTemplate = template ?? createDefaultTemplate();
    const state = env?.state ?? createEmptyCampaignState(resolvedTemplate);
    return {
      state: structuredClone(state),
      template: structuredClone(resolvedTemplate),
      revision: env?.revision ?? 0,
    };
  }

  /**
   * Syncs the authoritative `CampaignState` to:
   * 1. `spindle.variables.chat` (`lumi_stats`, `lumi_header`, `lumi_clock`, `lumi_location`)
   * 2. Push-model macros (`spindle.updateMacroValue`)
   * 3. Cross-extension Shared RPC Pool (`spindle.rpcPool.sync`)
   */
  async syncNativeLumiverseSurfaces(
    userId: string | undefined,
    chatId: string,
    _revision: number,
    state: CampaignState,
    template: LumiStatsTemplate,
    persistChatVars = true,
  ): Promise<void> {
    if (!chatId || chatId === 'sandbox') return;
    const projection = buildChatVariableProjection(state, template);
    const banner = formatSceneBanner(state);
    const clock = formatStoryClock(state.elapsedMinutes);

    if (persistChatVars) {
      try {
        await Promise.all([
          this.api.variables.chat.set(chatId, LUMI_CHAT_VAR_JSON, JSON.stringify(projection)),
          this.api.variables.chat.set(chatId, LUMI_CHAT_VAR_HEADER, banner.formatted),
          this.api.variables.chat.set(chatId, LUMI_CHAT_VAR_CLOCK, clock),
          this.api.variables.chat.set(chatId, LUMI_CHAT_VAR_LOCATION, banner.location),
        ]);
      } catch {
        // Safe fallback if chat record was deleted concurrently
      }
    }

    try {
      this.api.rpcPool?.sync(
        'state.current',
        {
          chatId,
          updatedAt: Date.now(),
          ...projection,
        },
        { requires: [] },
      );
    } catch {
      // Ignore if rpcPool is unavailable
    }
  }

  async loadCampaign(
    userId: string | undefined,
    chatId: string,
    options?: { skipChatVarReconcile?: boolean; presetDefaultTemplateId?: string },
  ): Promise<CampaignSnapshot> {
    await this.ensureDirs(userId);
    const template = await this.loadChatTemplate(userId, chatId, options?.presetDefaultTemplateId);
    if (!chatId || chatId === 'sandbox') {
      return {
        schemaVersion: 1,
        chatId: chatId || 'sandbox',
        revision: 0,
        state: createEmptyCampaignState(template),
        template,
        deltas: { statDeltas: {}, characterDeltas: {} },
        bindings: [],
        checkpoints: [],
      };
    }

    const key = this.scopeKey(userId, chatId);
    let env = this.stateCache.get(key);
    if (!env) {
      const disk = await this.api.userStorage.getJson<PersistedStateEnvelope | null>(
        `state/${encodeURIComponent(chatId)}.json`,
        { fallback: null, userId },
      );
      if (disk && disk.chatId === chatId && disk.state) {
        env = disk;
        this.setBoundedCache(this.stateCache, key, structuredClone(disk));
      }
    }

    if (!env) {
      env = {
        schemaVersion: 1,
        chatId,
        revision: 0,
        state: createEmptyCampaignState(template),
        bindings: [],
      };
    } else {
      env = structuredClone(env);
    }

    for (const def of template.stats) {
      if (!def.enabled || def.scope === 'character') continue;
      if (!env.state.stats[def.id]) {
        env.state.stats[def.id] = {
          id: def.id,
          scope: def.scope,
          value: def.defaultValue,
          calibrated: false,
          locked: def.locked,
        };
      }
    }

    const charSchemas = template.stats.filter(s => s.enabled && s.scope === 'character');
    for (const actor of Object.values(env.state.characters)) {
      for (const schema of charSchemas) {
        if (!actor.meters[schema.id]) {
          actor.meters[schema.id] = {
            value: schema.defaultValue,
            calibrated: false,
            locked: schema.locked,
          };
        }
      }
    }

    if (!options?.skipChatVarReconcile) {
      try {
        const rawJsonVar = await this.api.variables.chat.get(chatId, LUMI_CHAT_VAR_JSON);
        if (rawJsonVar) {
          const parsedVar = JSON.parse(rawJsonVar) as {
            turn?: number;
            stats?: Record<string, number | string | boolean>;
            actors?: Record<string, { meters?: Record<string, number | string | boolean> }>;
          };
          const varIsStale =
            typeof parsedVar?.turn === 'number' && parsedVar.turn < env.state.turnCount;
          let reconciledAny = false;
          if (!varIsStale && parsedVar?.stats && typeof parsedVar.stats === 'object') {
            for (const def of template.stats) {
              if (!def.enabled || def.scope === 'character') continue;
              const v = parsedVar.stats[def.id];
              const cur = env.state.stats[def.id];
              if (v !== undefined && cur && cur.calibrated && cur.value !== v) {
                cur.value = v;
                reconciledAny = true;
              }
            }
          }
          if (!varIsStale && parsedVar?.actors && typeof parsedVar.actors === 'object') {
            for (const [actorId, actorProj] of Object.entries(parsedVar.actors)) {
              const actor = env.state.characters[actorId];
              if (!actor || !actorProj?.meters) continue;
              for (const schema of charSchemas) {
                const v = actorProj.meters[schema.id];
                const curMeter = actor.meters[schema.id];
                if (v !== undefined && curMeter && curMeter.calibrated && curMeter.value !== v) {
                  curMeter.value = v;
                  reconciledAny = true;
                }
              }
            }
          }
          if (reconciledAny) {
            this.continuityCache.delete(key);
          }
        }
      } catch {
        // Ignore if chat variable lookup is unavailable
      }
    }

    const checkpoints = await this.loadCheckpoints(userId, chatId);
    const activeCp = checkpoints.filter(c => !c.undone);
    const latestCp = activeCp.at(-1);
    const deltas = latestCp
      ? diffCampaignStates(latestCp.before, env.state)
      : { statDeltas: {}, characterDeltas: {} };

    return {
      schemaVersion: 1,
      chatId,
      revision: env.revision,
      state: env.state,
      template,
      deltas,
      bindings: env.bindings ?? [],
      checkpoints: checkpoints
        .slice(-25)
        .reverse()
        .map(c => ({
          id: c.id,
          revision: c.revision,
          at: c.at,
          reason: c.reason,
          messageId: c.binding?.messageId,
          swipeId: c.binding?.swipeId,
        })),
    };
  }

  async commitCampaign(
    userId: string | undefined,
    chatId: string,
    before: CampaignState,
    after: CampaignState,
    reason: string,
    binding?: MessageSourceBinding,
    bindingsOverride?: MessageSourceBinding[],
  ): Promise<CampaignSnapshot> {
    const current = await this.loadCampaign(userId, chatId, { skipChatVarReconcile: true });
    if (!chatId || chatId === 'sandbox') return current;

    await this.ensureDirs(userId);
    const nextRevision = current.revision + 1;
    const bindings = bindingsOverride
      ? [...bindingsOverride]
      : binding
        ? [...current.bindings.filter(b => b.messageId !== binding.messageId), binding].slice(-120)
        : current.bindings;

    const env: PersistedStateEnvelope = {
      schemaVersion: 1,
      chatId,
      revision: nextRevision,
      state: after,
      bindings,
    };

    this.clearOwnerMirrorForChat(userId, chatId);
    const key = this.scopeKey(userId, chatId);
    this.setBoundedCache(this.stateCache, key, structuredClone(env));
    this.continuityCache.delete(key);
    await this.api.userStorage.setJson(
      `state/${encodeURIComponent(chatId)}.json`,
      env,
      { userId },
    );

    const slimAudit = (s: CampaignState): CampaignState => ({
      ...s,
      auditLog: s.auditLog.slice(-15),
    });

    const checkpoints = await this.loadCheckpoints(userId, chatId);
    const record: CheckpointRecord = {
      id: crypto.randomUUID(),
      revision: nextRevision,
      at: new Date().toISOString(),
      reason,
      ...(binding ? { binding } : {}),
      before: slimAudit(before),
      after: slimAudit(after),
    };
    const nextCheckpoints = [...checkpoints, record].slice(-MAX_CHECKPOINTS);
    await this.saveCheckpoints(userId, chatId, nextCheckpoints);

    await this.syncNativeLumiverseSurfaces(
      userId,
      chatId,
      nextRevision,
      after,
      current.template,
      true,
    );

    return {
      schemaVersion: 1,
      chatId,
      revision: nextRevision,
      state: after,
      template: current.template,
      deltas: diffCampaignStates(before, after),
      bindings,
      checkpoints: nextCheckpoints
        .slice()
        .reverse()
        .map(c => ({
          id: c.id,
          revision: c.revision,
          at: c.at,
          reason: c.reason,
          messageId: c.binding?.messageId,
          swipeId: c.binding?.swipeId,
        })),
    };
  }

  preserveUserAssets(restored: CampaignState, current: CampaignState): CampaignState {
    const out = structuredClone(restored);
    out.canonPremise = current.canonPremise;
    for (const [cid, curChar] of Object.entries(current.characters)) {
      if (out.characters[cid]) {
        out.characters[cid].portraitAssetId = curChar.portraitAssetId;
        out.characters[cid].portraitUrl = curChar.portraitUrl;
        out.characters[cid].expressionAssets = structuredClone(curChar.expressionAssets);
        if (curChar.spriteVariants) {
          out.characters[cid].spriteVariants = structuredClone(curChar.spriteVariants);
        }
        if (curChar.stageRig) {
          out.characters[cid].stageRig = structuredClone(curChar.stageRig);
        }
        if (curChar.ttsVoice) {
          out.characters[cid].ttsVoice = structuredClone(curChar.ttsVoice);
        }
      }
    }
    for (const [pid, curPlace] of Object.entries(current.places)) {
      if (out.places[pid]) {
        out.places[pid].backdropImageId = curPlace.backdropImageId;
        out.places[pid].backdropUrl = curPlace.backdropUrl;
        if (curPlace.backdropVariants) {
          out.places[pid].backdropVariants = structuredClone(curPlace.backdropVariants);
        }
      }
    }
    return out;
  }

  async previewRollbackBeforeMessage(
    userId: string | undefined,
    chatId: string,
    targetMessageId?: string,
  ): Promise<CampaignSnapshot> {
    const current = await this.loadCampaign(userId, chatId);
    const checkpoints = await this.loadCheckpoints(userId, chatId);
    const targetId = targetMessageId || current.bindings.at(-1)?.messageId;
    if (!targetId) return current;
    const pivot = checkpoints.find(c => !c.undone && c.binding?.messageId === targetId);
    if (!pivot) return current;
    return {
      ...current,
      state: this.preserveUserAssets(pivot.before, current.state),
    };
  }

  async rollbackBeforeMessage(
    userId: string | undefined,
    chatId: string,
    options: {
      targetMessageId?: string;
      targetIndex?: number;
      validMessageIds?: Set<string>;
    },
  ): Promise<CampaignSnapshot | null> {
    const checkpoints = await this.loadCheckpoints(userId, chatId);
    if (!checkpoints.length) return null;

    const current = await this.loadCampaign(userId, chatId, { skipChatVarReconcile: true });
    let pivotIdx = -1;

    const hasExplicitTarget = Boolean(options.targetMessageId) || options.targetIndex !== undefined;
    const latestActiveCpIdx = checkpoints.findLastIndex(c => !c.undone && Boolean(c.binding));

    for (let i = 0; i < checkpoints.length; i++) {
      const cp = checkpoints[i]!;
      if (cp.undone || !cp.binding) continue;
      const matchesId = Boolean(options.targetMessageId && cp.binding.messageId === options.targetMessageId);
      const afterIdx = options.targetIndex !== undefined && cp.binding.messageIndex >= options.targetIndex;
      const tailDeleted =
        !hasExplicitTarget &&
        i === latestActiveCpIdx &&
        Boolean(options.validMessageIds && !options.validMessageIds.has(cp.binding.messageId));
      if (matchesId || afterIdx || tailDeleted) {
        pivotIdx = i;
        break;
      }
    }

    if (pivotIdx < 0) return null;
    const pivot = checkpoints[pivotIdx]!;
    for (let i = pivotIdx; i < checkpoints.length; i++) {
      checkpoints[i]!.undone = true;
    }
    await this.saveCheckpoints(userId, chatId, checkpoints);

    const restored = this.preserveUserAssets(pivot.before, current.state);
    const keptBindings = current.bindings.filter(b => {
      if (options.targetMessageId && b.messageId === options.targetMessageId) return false;
      if (options.targetIndex !== undefined && b.messageIndex >= options.targetIndex) return false;
      if (options.validMessageIds && !options.validMessageIds.has(b.messageId)) return false;
      return true;
    });

    const nextRev = current.revision + 1;
    const env: PersistedStateEnvelope = {
      schemaVersion: 1,
      chatId,
      revision: nextRev,
      state: restored,
      bindings: keptBindings,
    };
    this.clearOwnerMirrorForChat(userId, chatId);
    const key = this.scopeKey(userId, chatId);
    this.setBoundedCache(this.stateCache, key, structuredClone(env));
    this.continuityCache.delete(key);
    await this.api.userStorage.setJson(`state/${encodeURIComponent(chatId)}.json`, env, { userId });
    await this.syncNativeLumiverseSurfaces(userId, chatId, nextRev, restored, current.template, true);
    return this.loadCampaign(userId, chatId, { skipChatVarReconcile: true });
  }

  async undoLatest(userId: string | undefined, chatId: string): Promise<CampaignSnapshot> {
    const checkpoints = await this.loadCheckpoints(userId, chatId);
    const idx = checkpoints.findLastIndex(c => !c.undone);
    if (idx < 0) throw new Error('No recorded change available to undo.');
    const target = checkpoints[idx]!;
    target.undone = true;
    await this.saveCheckpoints(userId, chatId, checkpoints);
    const current = await this.loadCampaign(userId, chatId, { skipChatVarReconcile: true });
    const keptBindings = target.binding
      ? current.bindings.filter(b => b.messageId !== target.binding!.messageId)
      : current.bindings;
    return this.commitCampaign(
      userId,
      chatId,
      current.state,
      this.preserveUserAssets(target.before, current.state),
      `Undo: ${target.reason}`,
      undefined,
      keptBindings,
    );
  }

  async restoreCheckpoint(
    userId: string | undefined,
    chatId: string,
    checkpointId: string,
  ): Promise<CampaignSnapshot> {
    const checkpoints = await this.loadCheckpoints(userId, chatId);
    const foundIdx = checkpoints.findIndex(c => c.id === checkpointId);
    if (foundIdx < 0) throw new Error('Checkpoint not found.');
    const found = checkpoints[foundIdx]!;
    for (let i = 0; i < checkpoints.length; i++) {
      checkpoints[i]!.undone = i > foundIdx;
    }
    await this.saveCheckpoints(userId, chatId, checkpoints);
    const current = await this.loadCampaign(userId, chatId, { skipChatVarReconcile: true });
    const maxMessageIndex = found.binding?.messageIndex;
    const keptBindings =
      maxMessageIndex !== undefined
        ? current.bindings.filter(b => b.messageIndex <= maxMessageIndex)
        : current.bindings;
    return this.commitCampaign(
      userId,
      chatId,
      current.state,
      this.preserveUserAssets(found.after, current.state),
      `Restored revision ${found.revision}`,
      found.binding,
      keptBindings,
    );
  }
}
