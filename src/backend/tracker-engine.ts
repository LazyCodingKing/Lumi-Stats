import type { SpindleAPI } from 'lumiverse-spindle-types';
import {
  buildLeanSidecarStateSnapshot,
  compileExtractorPrompt,
} from '../shared/prompt-compiler';
import { obfuscateSensitiveWords } from '../shared/prose-cleaner';
import {
  applyTurnPatch,
  extractInlineStatsTag,
  parseExtractedJson,
  stripInlineStatsTags,
} from '../shared/state-reducer';
import {
  createStatSchema,
} from '../shared/templates';
import type {
  CampaignSnapshot,
  CopilotProposalRecord,
  CopilotTurnRecord,
  ExtractedTurnPatch,
  MessageSourceBinding,
  StatSchemaDef,
} from '../shared/types';
import { readAuthoritativeGrounding, syncStateToMemoryCortex } from './grounding';
import type { LumiStorage } from './storage';

type ChatMessageRow = Awaited<ReturnType<SpindleAPI['chat']['getMessages']>>[number];

export async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}

export function isAbortError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as { name?: string; code?: number; message?: string };
  return (
    e.name === 'AbortError' ||
    e.code === 20 ||
    (typeof e.message === 'string' && /aborted/i.test(e.message))
  );
}

const MODEL_PLACEHOLDERS = new Set([
  '',
  'string',
  'model',
  'your-model-here',
  'null',
  'undefined',
]);

function sanitizeModelName(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return MODEL_PLACEHOLDERS.has(trimmed.toLowerCase()) ? undefined : trimmed;
}

export class TrackerEngine {
  private inFlight = new Map<string, AbortController>();
  private processedTurnKeys = new Set<string>();
  private debugRecords = new Map<string, Record<string, unknown>>();
  private proposals = new Map<string, CopilotProposalRecord>();

  constructor(
    private api: SpindleAPI,
    private storage: LumiStorage,
    private emitToUser: (
      userId: string | undefined,
      chatId: string,
      payload: Record<string, unknown>,
    ) => void,
  ) {}

  private jobKey(userId: string | undefined, chatId: string): string {
    return `${userId ?? '__owner__'}:${chatId}`;
  }

  isBusy(userId: string | undefined, chatId: string): boolean {
    return this.inFlight.has(this.jobKey(userId, chatId));
  }

  cancelInFlight(userId: string | undefined, chatId: string): void {
    const key = this.jobKey(userId, chatId);
    this.inFlight.get(key)?.abort();
    this.inFlight.delete(key);
  }

  getDebugRecord(userId: string | undefined, chatId: string): Record<string, unknown> | null {
    return this.debugRecords.get(this.jobKey(userId, chatId)) ?? null;
  }

  clearDebugRecord(userId: string | undefined, chatId: string): void {
    this.debugRecords.delete(this.jobKey(userId, chatId));
  }

  async readTranscript(chatId: string): Promise<ChatMessageRow[]> {
    if (!chatId || chatId === 'sandbox') return [];
    if (!this.api.permissions.has('chat_mutation')) {
      throw new Error('Enable the "chat_mutation" permission for Lumi Stats to read chat messages.');
    }
    return this.api.chat.getMessages(chatId);
  }

  async readRecentMessages(chatId: string, tail = 14): Promise<ChatMessageRow[]> {
    const rows = await this.readTranscript(chatId);
    return rows.slice(-tail);
  }

  private async buildBinding(msg: ChatMessageRow, messageIndex: number): Promise<MessageSourceBinding> {
    const swipeId = typeof msg.swipe_id === 'number' ? msg.swipe_id : 0;
    const contentHash = await sha256Hex(stripInlineStatsTags(msg.content));
    return { messageId: msg.id, swipeId, contentHash, messageIndex };
  }

  async invokeStructuredModel(
    userId: string | undefined,
    chatId: string,
    role: 'extractor' | 'copilot',
    systemPrompt: string,
    contextPayload: unknown,
  ): Promise<{ parsed: Record<string, unknown>; rawText: string }> {
    if (!this.api.permissions.has('generation')) {
      throw new Error('Enable the "generation" permission in the Extensions panel to run AI stat calibration.');
    }

    const baseKey = this.jobKey(userId, chatId);
    const key = role === 'copilot' ? `${baseKey}:copilot` : baseKey;
    this.inFlight.get(key)?.abort();
    const controller = new AbortController();
    this.inFlight.set(key, controller);
    const timer = setTimeout(() => controller.abort(), 55_000);

    this.emitToUser(userId, chatId, {
      type: 'status',
      busy: true,
      text: role === 'copilot' ? 'Lumi Architect is analyzing…' : 'Calibrating scene & character stats…',
    });

    try {
      const settings = await this.storage.loadSettings(userId);
      const explicitConnId =
        (role === 'copilot' ? settings.copilotConnectionId : settings.extractorConnectionId).trim() || undefined;
      const explicitModel = sanitizeModelName(
        role === 'copilot' ? settings.copilotModel : settings.extractorModel,
      );
      let effectiveConnId = explicitConnId;
      let resolvedModel = explicitModel;
      let resolvedProvider: string | undefined;

      if ((explicitConnId || explicitModel || typeof this.api.generate.quiet !== 'function') && this.api.connections?.list) {
        try {
          const conns = await this.api.connections.list(userId);
          const matched = explicitConnId
            ? conns.find(c => c.id === explicitConnId)
            : conns.find(c => c.is_default) ?? conns[0];
          if (matched) {
            effectiveConnId ||= matched.id || undefined;
            resolvedModel ||= sanitizeModelName(matched.model);
            resolvedProvider = matched.provider || undefined;
          }
        } catch {
          // Proceed with default connection
        }
      }

      const messages = [
        {
          role: 'system' as const,
          content: `${systemPrompt}\n\nIMPORTANT: Output ONLY a single valid JSON object. Do not wrap in conversational prose.`,
        },
        {
          role: 'user' as const,
          content: JSON.stringify(contextPayload),
        },
      ];

      const parameters: Record<string, unknown> = {
        temperature: 0.2,
        max_tokens: 3000,
        ...(resolvedModel ? { model: resolvedModel } : {}),
      };

      let response: unknown;
      if (!explicitConnId && !explicitModel && typeof this.api.generate.quiet === 'function') {
        response = await this.api.generate.quiet({
          type: 'quiet',
          ...(userId ? { userId } : {}),
          messages,
          parameters,
          reasoning: { source: 'off' },
          signal: controller.signal,
        } as Parameters<SpindleAPI['generate']['quiet']>[0]);
      } else {
        response = await this.api.generate.raw({
          type: 'raw',
          connection_id: effectiveConnId,
          ...(userId ? { userId } : {}),
          ...(resolvedProvider ? { provider: resolvedProvider } : {}),
          ...(resolvedModel ? { model: resolvedModel } : {}),
          messages,
          parameters,
          reasoning: { source: 'off' },
          signal: controller.signal,
        } as Parameters<SpindleAPI['generate']['raw']>[0]);
      }

      const rawText = String((response as { content?: unknown })?.content ?? '');
      const parsed = parseExtractedJson(rawText) as unknown as Record<string, unknown>;
      return { parsed, rawText };
    } finally {
      clearTimeout(timer);
      if (this.inFlight.get(key) === controller) {
        this.inFlight.delete(key);
        this.emitToUser(userId, chatId, { type: 'status', busy: false, text: '' });
      }
    }
  }

  /**
   * Single-owner, idempotent turn tracker with Two-Phase Grounded Calibration.
   */
  async trackTurn(
    userId: string | undefined,
    chatId: string,
    options: { targetMessageId?: string; inlineTagContent?: string; manual?: boolean } = {},
  ): Promise<CampaignSnapshot | null> {
    if (!options.manual && this.isBusy(userId, chatId)) return null;

    return this.storage.queue(userId, chatId, async () => {
      let allMessages = await this.readTranscript(chatId);
      if (!allMessages.length) return null;

      let targetIdx = options.targetMessageId
        ? allMessages.findIndex(m => m.id === options.targetMessageId)
        : -1;
      if (targetIdx < 0 && options.targetMessageId) {
        await new Promise(r => setTimeout(r, 200));
        allMessages = await this.readTranscript(chatId);
        targetIdx = allMessages.findIndex(m => m.id === options.targetMessageId);
      }
      if (targetIdx < 0) {
        targetIdx = allMessages.findLastIndex(m => m.role === 'assistant' && m.content.trim().length > 0);
        if (targetIdx < 0) targetIdx = allMessages.length - 1;
      }
      const targetMsg = allMessages[targetIdx];
      if (!targetMsg || targetMsg.role === 'system') return null;

      const binding = await this.buildBinding(targetMsg, targetIdx);
      const idempotencyKey = `${chatId}:${binding.messageId}:${binding.swipeId}:${binding.contentHash}`;
      if (!options.manual && this.processedTurnKeys.has(idempotencyKey)) {
        return null;
      }

      let snapshot = await this.storage.loadCampaign(userId, chatId);
      if (
        !options.manual &&
        snapshot.bindings.some(
          b =>
            b.messageId === binding.messageId &&
            b.swipeId === binding.swipeId &&
            b.contentHash === binding.contentHash,
        )
      ) {
        this.processedTurnKeys.add(idempotencyKey);
        return null;
      }

      const validIds = new Set(allMessages.map(m => m.id));
      const lastBinding = snapshot.bindings.at(-1);
      const needsRollback =
        snapshot.bindings.some(
          b => b.messageId === binding.messageId || b.messageIndex >= binding.messageIndex,
        ) ||
        Boolean(lastBinding && !validIds.has(lastBinding.messageId));
      if (needsRollback) {
        const rolled = await this.storage.rollbackBeforeMessage(userId, chatId, {
          targetMessageId: binding.messageId,
          targetIndex: binding.messageIndex,
          validMessageIds: validIds,
        });
        if (rolled) snapshot = rolled;
      }

      const settings = await this.storage.loadSettings(userId);
      const template = snapshot.template;

      let patch: ExtractedTurnPatch | null = null;
      if (options.inlineTagContent) {
        try {
          patch = parseExtractedJson(options.inlineTagContent);
        } catch (err) {
          this.api.log.warn(
            `Malformed inline <lumi-stats> tag; falling back to sidecar extraction: ${err instanceof Error ? err.message : String(err)}`,
          );
          patch = null;
        }
      }
      if (!patch) {
        patch = extractInlineStatsTag(targetMsg.content);
      }
      let rawDebugText = options.inlineTagContent || '';

      if (!patch && this.api.permissions.has('generation')) {
        const useCompactGrounding = snapshot.state.initialized && snapshot.state.turnCount >= 2;
        const grounding = useCompactGrounding
          ? {}
          : await readAuthoritativeGrounding(this.api, userId, chatId, { compact: false });
        const historyTurns = Math.max(2, Math.min(12, Math.round(settings.sidecarHistoryTurns ?? 4)));
        const maxMsgChars = Math.max(800, Math.min(6000, Math.round(settings.sidecarMaxCharsPerMsg ?? 2500)));
        const recentTranscript = allMessages
          .slice(Math.max(0, targetIdx - (historyTurns - 1)), targetIdx + 1)
          .map(m => ({
            id: m.id,
            role: m.role,
            content: stripInlineStatsTags(m.content).slice(0, maxMsgChars),
          }));

        const recentJoinedText = recentTranscript.map(m => m.content).join('\n');
        const leanCurrentState = buildLeanSidecarStateSnapshot(
          snapshot.state,
          template,
          recentJoinedText,
        );

        const obfEnabled =
          Boolean(settings.sensitiveObfuscatorEnabled) &&
          settings.obfuscateOnSend !== false &&
          (settings.sensitiveWords?.length ?? 0) > 0;
        const obfWords = settings.sensitiveWords ?? [];
        const useOne = settings.obfuscateVowelsWithOne !== false;
        const obfText = (txt: string | undefined) =>
          txt && obfEnabled ? obfuscateSensitiveWords(txt, obfWords, useOne) : txt;

        const safeCard = grounding.characterCard
          ? {
              name: grounding.characterCard.name,
              description: obfText(grounding.characterCard.description) ?? '',
              personality: obfText(grounding.characterCard.personality) ?? '',
              scenario: obfText(grounding.characterCard.scenario) ?? '',
              ...(grounding.characterCard.firstMessage
                ? { firstMessage: obfText(grounding.characterCard.firstMessage) }
                : {}),
            }
          : undefined;
        const safePersona = grounding.persona
          ? {
              name: grounding.persona.name,
              description: obfText(grounding.persona.description) ?? '',
            }
          : undefined;
        const safeTranscript = recentTranscript.map(m => ({
          ...m,
          content: obfText(m.content) ?? m.content,
        }));

        const sysPrompt = compileExtractorPrompt(snapshot.state, template, recentJoinedText, {
          verbosity: settings.protocolVerbosity ?? 'compact',
        });
        const canonSetupAndCardGrounding: Record<string, unknown> = {};
        if (snapshot.state.canonPremise) {
          canonSetupAndCardGrounding.canonPremise = obfText(snapshot.state.canonPremise);
        }
        if (safeCard) canonSetupAndCardGrounding.characterCard = safeCard;
        if (safePersona) canonSetupAndCardGrounding.activePersona = safePersona;
        if (grounding.openingUserMessage) {
          canonSetupAndCardGrounding.openingUserMessage = obfText(grounding.openingUserMessage);
        }
        const { parsed, rawText } = await this.invokeStructuredModel(
          userId,
          chatId,
          'extractor',
          sysPrompt,
          {
            ...(Object.keys(canonSetupAndCardGrounding).length
              ? { canonSetupAndCardGrounding }
              : {}),
            currentState: leanCurrentState,
            recentMessagesToEvaluate: safeTranscript,
          },
        );
        patch = parsed as unknown as ExtractedTurnPatch;
        rawDebugText = rawText;
      }

      if (!patch) return null;

      const latestAll = await this.readTranscript(chatId);
      const latestIdx = latestAll.findIndex(m => m.id === targetMsg.id);
      const latestTarget = latestIdx >= 0 ? latestAll[latestIdx] : undefined;
      if (latestTarget) {
        const latestBinding = await this.buildBinding(latestTarget, latestIdx);
        if (
          latestBinding.swipeId !== binding.swipeId ||
          latestBinding.contentHash !== binding.contentHash
        ) {
          return null;
        }
      }

      const reduced = applyTurnPatch(snapshot.state, template, patch, {
        incrementTurn: targetMsg.role === 'assistant',
        ...(settings.sensitiveObfuscatorEnabled && (settings.sensitiveWords?.length ?? 0) > 0
          ? {
              obfuscationConfig: {
                words: settings.sensitiveWords,
                useOne: settings.obfuscateVowelsWithOne !== false,
              },
            }
          : {}),
      });

      await this.linkCardPortraitIfAvailable(userId, chatId, reduced.state);

      this.processedTurnKeys.add(idempotencyKey);
      if (this.processedTurnKeys.size > 400) {
        const oldest = this.processedTurnKeys.values().next().value;
        if (oldest) this.processedTurnKeys.delete(oldest);
      }

      const committed = await this.storage.commitCampaign(
        userId,
        chatId,
        snapshot.state,
        reduced.state,
        snapshot.state.initialized ? 'Tracked story turn' : 'Calibrated initial world & character stats',
        binding,
      );

      if (settings.debugInspector) {
        const dbgKey = this.jobKey(userId, chatId);
        if (!this.debugRecords.has(dbgKey) && this.debugRecords.size >= 30) {
          const oldestDbg = this.debugRecords.keys().next().value;
          if (oldestDbg !== undefined) this.debugRecords.delete(oldestDbg);
        }
        this.debugRecords.set(dbgKey, {
          at: new Date().toISOString(),
          messageId: targetMsg.id,
          rawOutput: rawDebugText.slice(0, 32000),
          parsedPatch: patch,
          appliedDeltas: reduced.deltas,
        });
      }

      if (settings.thresholdToasts && reduced.triggeredAlerts.length > 0) {
        for (const alertMsg of reduced.triggeredAlerts.slice(0, 3)) {
          this.api.toast.info(alertMsg, {
            title: 'Stat Threshold Reached',
            ...(userId ? { userId } : {}),
          } as Parameters<SpindleAPI['toast']['info']>[1]);
        }
      }

      if (settings.memoryCortexSync) {
        void syncStateToMemoryCortex(this.api, userId, chatId, reduced.state, template, {
          touchedCharacterIds: reduced.touchedCharacterIds,
          touchedPlaceIds: reduced.touchedPlaceIds,
        });
      }

      return committed;
    });
  }

  /**
   * Reconciles campaign state when a message is swiped, edited, or deleted.
   */
  async reconcileMessageChange(
    userId: string | undefined,
    chatId: string,
    changedMessageId?: string,
  ): Promise<CampaignSnapshot | null> {
    this.cancelInFlight(userId, chatId);
    return this.storage.queue(userId, chatId, async () => {
      const snapshot = await this.storage.loadCampaign(userId, chatId);
      const messages = await this.readTranscript(chatId);
      const validIds = new Set(messages.map(m => m.id));
      const checkpoints = await this.storage.loadCheckpoints(userId, chatId);

      const targetMsg = changedMessageId
        ? messages.find(m => m.id === changedMessageId)
        : messages.findLast(m => m.role === 'assistant');

      const latestAssistantIdx = messages.findLastIndex(
        m => m.role === 'assistant' && m.content.trim().length > 0,
      );
      const maxBoundIndex = snapshot.bindings.reduce((max, b) => Math.max(max, b.messageIndex), -1);

      if (targetMsg && targetMsg.content.trim()) {
        const idx = messages.indexOf(targetMsg);
        // Never rewind the entire campaign when an older historical message is edited/re-rendered
        if (idx < maxBoundIndex && idx < latestAssistantIdx) {
          return null;
        }

        const nowBinding = await this.buildBinding(targetMsg, idx);
        const exactMatch = checkpoints.findLast(
          c =>
            !c.undone &&
            c.binding?.messageId === nowBinding.messageId &&
            c.binding?.swipeId === nowBinding.swipeId &&
            c.binding?.contentHash === nowBinding.contentHash,
        );
        if (exactMatch) {
          const restored = this.storage.preserveUserAssets(exactMatch.after, snapshot.state);
          return this.storage.commitCampaign(
            userId,
            chatId,
            snapshot.state,
            restored,
            `Restored swipe #${nowBinding.swipeId + 1} state`,
            nowBinding,
          );
        }

        const inlinePatch = extractInlineStatsTag(targetMsg.content);
        if (inlinePatch) {
          const rolled = await this.storage.rollbackBeforeMessage(userId, chatId, {
            targetMessageId: targetMsg.id,
            targetIndex: idx,
            validMessageIds: validIds,
          });
          const baseBefore = rolled ? rolled.state : snapshot.state;
          const reduced = applyTurnPatch(baseBefore, snapshot.template, inlinePatch, {
            incrementTurn: true,
          });
          return this.storage.commitCampaign(
            userId,
            chatId,
            baseBefore,
            reduced.state,
            'Synced state from swipe/edit tag',
            nowBinding,
          );
        }

        // Plain prose edit on a tagless message (e.g. sidecar mode): keep current state intact
        return null;
      }

      // Deleted message: only roll back if the deleted ID matches the latest/tail tracked message
      const latestBound = snapshot.bindings.at(-1);
      if (
        changedMessageId &&
        latestBound &&
        latestBound.messageId !== changedMessageId &&
        validIds.has(latestBound.messageId)
      ) {
        return null;
      }

      return this.storage.rollbackBeforeMessage(userId, chatId, {
        targetMessageId: changedMessageId,
        validMessageIds: validIds,
      });
    });
  }

  private async linkCardPortraitIfAvailable(
    userId: string | undefined,
    chatId: string,
    state: CampaignSnapshot['state'],
  ): Promise<void> {
    if (!chatId || chatId === 'sandbox') return;
    if (!this.api.permissions.has('chats') || !this.api.permissions.has('characters')) return;
    try {
      const chat = await (this.api.chats.get as (id: string, u?: string) => Promise<{ character_id?: string } | null>)(chatId, userId);
      const card = chat?.character_id
        ? await (this.api.characters.get as (id: string, u?: string) => Promise<{ name?: string; image_id?: string | null } | null>)(chat.character_id, userId)
        : null;
      if (!card?.image_id || !card.name) return;
      const chars = Object.values(state.characters);
      const matched =
        chars.find(c => c.name.toLowerCase() === card.name!.toLowerCase()) ??
        (chars.length === 1 ? chars[0] : undefined);
      if (matched && !matched.portraitUrl) {
        matched.portraitAssetId = card.image_id;
        matched.portraitUrl = `/api/v1/images/${card.image_id}`;
      }
    } catch {
      // Non-fatal
    }
  }

  async runSandboxRuleTest(
    userId: string | undefined,
    chatId: string,
    payload: { statId?: string; scenarioText?: string },
  ): Promise<Record<string, unknown>> {
    const snapshot = await this.storage.loadCampaign(userId, chatId || 'sandbox');
    const testState = structuredClone(snapshot.state);
    if (Object.keys(testState.characters).length === 0) {
      testState.characters['sample_npc'] = {
        id: 'sample_npc',
        name: 'Sample Companion',
        aliases: [],
        roleSummary: 'Devoted companion in scene',
        present: true,
        locationId: testState.currentPlaceId,
        demeanor: 'Attentive',
        innerThought: 'Observing the player.',
        immediateGoal: 'Respond to the scene beat',
        attire: 'Standard attire',
        fields: {},
        meters: {},
        peerBonds: {},
        conditions: [],
        secrets: [],
        expressionAssets: {},
        notes: '',
      };
    }

    const prompt = [
      compileExtractorPrompt(testState, snapshot.template),
      payload.scenarioText?.trim()
        ? `Evaluate this exact test scenario: "${payload.scenarioText.trim()}"`
        : `Invent a 2-sentence roleplay beat ("testBeat") that tests "${payload.statId || 'all configured stats'}" and include your updates.`,
    ].join('\n\n');

    const { parsed, rawText } = await this.invokeStructuredModel(
      userId,
      chatId || 'sandbox',
      'extractor',
      prompt,
      { testScenario: payload.scenarioText || 'Generate a test beat', currentState: buildLeanSidecarStateSnapshot(testState, snapshot.template) },
    );

    const reduced = applyTurnPatch(testState, snapshot.template, parsed as unknown as ExtractedTurnPatch);
    return {
      testBeat: String(parsed.testBeat ?? payload.scenarioText ?? reduced.state.scene.beatSummary ?? 'Evaluated test scenario.'),
      statDeltas: reduced.deltas.statDeltas,
      characterDeltas: reduced.deltas.characterDeltas,
      auditEntries: reduced.state.auditLog.slice(-8),
      rawOutput: rawText,
    };
  }

  async consultCopilot(
    userId: string | undefined,
    chatId: string,
    userPrompt: string,
    mode: 'ask' | 'adjust' | 'architect' = 'ask',
  ): Promise<{
    reply: string;
    turns: CopilotTurnRecord[];
    proposal?: CopilotProposalRecord;
  }> {
    const snapshot = await this.storage.loadCampaign(userId, chatId);
    const history = await this.storage.api.userStorage.getJson<CopilotTurnRecord[]>(
      `copilot/${encodeURIComponent(chatId)}.json`,
      { fallback: [], userId },
    );

    const sysPrompt = [
      `You are the Lumi Stats Copilot & Schema Architect.`,
      `Analyze the active CampaignState, LumiStatsTemplate, and user request.`,
      `Return ONLY a JSON object with this shape:`,
      `{`,
      `  "reply": "Clear response to the user",`,
      `  "summaries": ["Bullet summary of each proposed change"],`,
      `  "statePatch": { ...optional ExtractedTurnPatch... },`,
      `  "addStats": [`,
      `    {`,
      `      "id": "stat_slug",`,
      `      "label": "Human Label",`,
      `      "icon": "🔥",`,
      `      "scope": "character|player|world|scene",`,
      `      "kind": "meter|number|clock|pips|tier|tags|text|boolean",`,
      `      "min": 0,`,
      `      "max": 100,`,
      `      "volatility": "momentary|progressive|anchor",`,
      `      "triggerCues": "Clear cues for calibration and situational shifts"`,
      `    }`,
      `  ]`,
      `}`,
    ].join('\n');

    const { parsed } = await this.invokeStructuredModel(userId, chatId, 'copilot', sysPrompt, {
      mode,
      userRequest: userPrompt,
      currentState: buildLeanSidecarStateSnapshot(snapshot.state, snapshot.template),
      templateStats: snapshot.template.stats,
      recentHistory: history.slice(-6),
    });

    const reply = String(parsed.reply ?? 'Completed analysis.').trim();
    const summaries = Array.isArray(parsed.summaries) ? parsed.summaries.map(String) : [];

    let nextTemplate: typeof snapshot.template | undefined;
    if (Array.isArray(parsed.addStats) && parsed.addStats.length > 0) {
      nextTemplate = structuredClone(snapshot.template);
      for (const rawStat of parsed.addStats) {
        if (!rawStat || typeof rawStat !== 'object') continue;
        const created: StatSchemaDef = createStatSchema(rawStat as Partial<StatSchemaDef> & { label: string });
        const idx = nextTemplate.stats.findIndex(s => s.id === created.id);
        if (idx >= 0) nextTemplate.stats[idx] = created;
        else nextTemplate.stats.push(created);
        summaries.push(`Add ${created.scope} stat "${created.icon} ${created.label}" (${created.volatility})`);
      }
    }

    const statePatch =
      parsed.statePatch && typeof parsed.statePatch === 'object'
        ? (parsed.statePatch as ExtractedTurnPatch)
        : undefined;

    let proposal: CopilotProposalRecord | undefined;
    if (nextTemplate || statePatch) {
      proposal = {
        id: crypto.randomUUID(),
        chatId,
        revision: snapshot.revision,
        summaries: summaries.length ? summaries : ['Apply Copilot adjustments'],
        statePatch,
        templatePatch: nextTemplate,
      };
      if (this.proposals.size >= 50) {
        const oldestProp = this.proposals.keys().next().value;
        if (oldestProp !== undefined) this.proposals.delete(oldestProp);
      }
      this.proposals.set(`${userId ?? '__owner__'}:${proposal.id}`, proposal);
    }

    const now = new Date().toISOString();
    const nextTurns: CopilotTurnRecord[] = [
      ...history,
      { role: 'user' as const, text: userPrompt, at: now },
      { role: 'assistant' as const, text: reply, at: now },
    ].slice(-40);

    await this.storage.api.userStorage.setJson(
      `copilot/${encodeURIComponent(chatId)}.json`,
      nextTurns,
      { userId },
    );

    return { reply, turns: nextTurns, proposal };
  }

  getProposal(userId: string | undefined, proposalId: string): CopilotProposalRecord | undefined {
    return this.proposals.get(`${userId ?? '__owner__'}:${proposalId}`);
  }

  deleteProposal(userId: string | undefined, proposalId: string): void {
    this.proposals.delete(`${userId ?? '__owner__'}:${proposalId}`);
  }

  async compileRuleToLocalFormula(
    userId: string | undefined,
    chatId: string,
    payload: { statLabel: string; ruleText: string; scope: string },
  ): Promise<{
    formula: string;
    outputTemplate: string;
    suggestedMode?: 'ai_plus_local' | 'local_formula';
    explanation: string;
  }> {
    const snapshot = await this.storage.loadCampaign(userId, chatId || 'sandbox');
    const availableVars = snapshot.template.stats
      .filter(s => s.enabled)
      .map(s => {
        const liveSample =
          s.scope === 'character'
            ? Object.values(snapshot.state.characters)[0]?.meters[s.id]?.value
            : snapshot.state.stats[s.id]?.value;
        return `${s.id} (${s.scope}, current/sample: "${String(liveSample ?? s.defaultValue)}")`;
      });

    const sysPrompt = [
      `Convert the user's plain-English stat rule into a universal Lumi Stats local formula.`,
      `You may output EITHER:`,
      `Option A — Semicolon-separated math assignments ("; ") + optional outputTemplate:`,
      `  - Operators: + - * / % < <= > >= == != && || ! ? :`,
      `  - Functions: round(x), floor(x), ceil(x), abs(x), min(...), max(...), clamp(x,lo,hi), if(cond,a,b), hasCond("a|b"), match(conditions,"a|b")`,
      `  - Variables: any stat ID or auto-extracted sub-token (e.g. from "Key 10/20" -> Key, Key_max; from "X45" -> X; or [stat_id.sub])`,
      `  - outputTemplate: e.g. "Label {varA} | Other {varB}" (empty if single numeric output)`,
      `Option B — Single-line Lumiverse Macro Template (leave outputTemplate empty):`,
      `  - Uses {{.var}}, {{.var = ...}}, {{calc::...}}, {{round::...}}, {{floor::...}}, {{min::...}}, {{max::...}}, {{if::...}}...{{elseif::...}}...{{else}}...{{/if}}, {{matches::{{.conditions}}::pat::i}}.`,
      `CRITICAL RULES:`,
      `1. Keep "formula" valid inside JSON (use "; " instead of raw newlines, escape quotes properly). NEVER leave English prose in "formula".`,
      `2. If the rule specifies a text format (e.g. "Format strictly Lv<0-10> (<0-99>%) | P<0-100> A<0-100> I<0-100>" or "HP <cur>/<max>"), you MUST return the matching "outputTemplate" using the exact {var} names from "formula" (e.g. "Lv{final_lv} ({final_pct}%) | P{final_p} A{final_a} I{final_i}").`,
      `3. Set "suggestedMode": "ai_plus_local" if the AI still needs to initialize/change inputs on this stat (like P/A/I, XP %, HP damage), or "local_formula" if all inputs come strictly from OTHER stats (0 AI tokens).`,
      `Return ONLY JSON: { "formula": "...", "outputTemplate": "...", "suggestedMode": "ai_plus_local|local_formula", "explanation": "Short summary" }`,
    ].join('\n');

    const { parsed } = await this.invokeStructuredModel(
      userId,
      chatId || 'sandbox',
      'copilot',
      sysPrompt,
      {
        statLabel: payload.statLabel,
        scope: payload.scope,
        ruleText: payload.ruleText,
        availableStats: availableVars,
      },
    );

    const rawFormula = String(parsed.formula ?? '').trim();
    if (!rawFormula) {
      throw new Error('The AI model returned an empty formula. Check your connection/model in Studio → 6. AI & Connections.');
    }
    const formattedFormula = rawFormula.includes('{{')
      ? rawFormula
      : rawFormula.split(/\s*;\s*/).filter(Boolean).join('\n');

    return {
      formula: formattedFormula,
      outputTemplate: String(parsed.outputTemplate ?? '').trim(),
      suggestedMode:
        parsed.suggestedMode === 'ai_plus_local' ? 'ai_plus_local' : 'local_formula',
      explanation: String(parsed.explanation ?? 'Converted rule to local formula.').trim(),
    };
  }
}
