import type { SpindleAPI } from 'lumiverse-spindle-types';
import {
  formatSceneBanner,
  formatStoryClock,
  recomputeDerivedStats,
  resolveAnchorLabel,
} from '../shared/formula';
import { findShortestTravelRoute } from '../shared/map-graph';
import {
  buildChatVariableProjection,
  buildCompactFormatExample,
  buildFlatChatVariablesMap,
  compileExtractorPrompt,
  compileNarratorContinuity,
  resolveCharacterFieldValue,
} from '../shared/prompt-compiler';
import {
  RenderProseCache,
  buildWordRestoreRegexSpec,
  cleanBrailleAndProseWhitespace,
  deobfuscateSensitiveWords,
  hasBrailleOrWhitespaceArtifacts,
  normalizeSensitiveWordsList,
  obfuscateSensitiveWords,
} from '../shared/prose-cleaner';
import {
  applyTurnPatch,
  extractInlineStatsTag,
  stripInlineStatsTags,
} from '../shared/state-reducer';
import {
  BUILTIN_TEMPLATES,
  normalizeImportedTemplate,
  slugifyKey,
} from '../shared/templates';
import {
  LUMI_STATS_CHANNEL,
  type CampaignState,
  type CopilotTurnRecord,
  type ExtractedTurnPatch,
  type LumiRpcRequest,
  type LumiRpcResponse,
  type LumiStatsTemplate,
  type LumiUserSettings,
} from '../shared/types';
import { evaluateWorldInfoStatGates, invalidateGroundingCache } from './grounding';
import { LumiStorage } from './storage';
import { TrackerEngine, isAbortError, sha256Hex } from './tracker-engine';

export class LumiStatsService {
  readonly storage: LumiStorage;
  readonly tracker: TrackerEngine;
  private renderCache = new RenderProseCache(200);
  private selfEditedMessages = new Set<string>();
  private activeGenerations = new Map<string, string>();
  private lastActiveChatByUser = new Map<string, string>();
  private chatOwnerMap = new Map<string, string>();
  private lastKnownUserId: string | undefined;
  private disposers: Array<() => void> = [];
  private stopped = false;

  constructor(private api: SpindleAPI) {
    this.storage = new LumiStorage(api);
    this.tracker = new TrackerEngine(api, this.storage, (u, c, p) => this.emitToUser(u, c, p));
  }

  private clearActiveChat(userId: string | undefined): void {
    const cleanUser = userId?.trim();
    this.lastActiveChatByUser.delete(cleanUser || '__owner__');
    if (!cleanUser) this.lastActiveChatByUser.delete('__owner__');
  }

  private rememberActiveChat(userId: string | undefined, chatId: string | null | undefined): void {
    const cleanUser = userId?.trim();
    if (cleanUser) this.lastKnownUserId = cleanUser;
    const trimmed = typeof chatId === 'string' ? chatId.trim() : '';
    if (!trimmed || trimmed === 'sandbox') return;
    this.lastActiveChatByUser.set(cleanUser || '__owner__', trimmed);
    if (cleanUser) {
      if (this.chatOwnerMap.size >= 200 && !this.chatOwnerMap.has(trimmed)) {
        const oldest = this.chatOwnerMap.keys().next().value;
        if (oldest !== undefined) this.chatOwnerMap.delete(oldest);
      }
      this.chatOwnerMap.set(trimmed, cleanUser);
    }
  }

  private resolveUserId(userId: string | undefined, chatId?: string): string | undefined {
    const cleanUser = userId?.trim();
    if (cleanUser) return cleanUser;
    const cleanChat = chatId?.trim();
    if (cleanChat && this.chatOwnerMap.has(cleanChat)) {
      return this.chatOwnerMap.get(cleanChat);
    }
    return this.lastKnownUserId;
  }

  private async resolveEffectiveChatId(userId: string | undefined, requestedChatId: string): Promise<string> {
    const clean = requestedChatId.trim();
    const resolvedUser = this.resolveUserId(userId, clean);
    if (clean && clean !== 'sandbox') {
      this.rememberActiveChat(resolvedUser, clean);
      return clean;
    }
    if (this.api.permissions.has('chats')) {
      try {
        const active = await (
          this.api.chats.getActive as (u?: string) => Promise<{ id?: string } | null>
        )(resolvedUser);
        if (active?.id) {
          this.rememberActiveChat(resolvedUser, active.id);
          return active.id;
        }
      } catch {
        // Fall through to cached active chat ID
      }
    }
    return this.lastActiveChatByUser.get(resolvedUser || '__owner__') ?? (clean || 'sandbox');
  }

  private emitToUser(
    userId: string | undefined,
    chatId: string,
    payload: Record<string, unknown>,
    frontendSessionId?: string,
  ): void {
    if (this.stopped) return;
    const resolvedUser = this.resolveUserId(userId, chatId);
    this.api.sendToFrontend(
      { channel: LUMI_STATS_CHANNEL, chatId, ...payload },
      resolvedUser,
      frontendSessionId ? { frontendSessionId } : undefined,
    );
  }

  async broadcastSnapshot(
    userId: string | undefined,
    chatId: string,
    frontendSessionId?: string,
  ): Promise<void> {
    const effectiveChatId = chatId || 'sandbox';
    const resolvedUser = this.resolveUserId(userId, effectiveChatId);
    const [snapshot, settings, customTemplates, copilotTurns] = await Promise.all([
      this.storage.loadCampaign(resolvedUser, effectiveChatId),
      this.storage.loadSettings(resolvedUser),
      this.storage.listCustomTemplates(resolvedUser),
      effectiveChatId !== 'sandbox'
        ? this.api.userStorage.getJson<CopilotTurnRecord[]>(
            `copilot/${encodeURIComponent(effectiveChatId)}.json`,
            { fallback: [], userId: resolvedUser },
          )
        : Promise.resolve([]),
    ]);

    this.emitToUser(
      resolvedUser,
      effectiveChatId,
      {
        type: 'snapshot',
        resolvedChatId: effectiveChatId !== 'sandbox' ? effectiveChatId : '',
        snapshot,
        settings,
        customTemplates,
        builtinTemplates: BUILTIN_TEMPLATES,
        copilotTurns,
        busy: this.tracker.isBusy(resolvedUser, effectiveChatId),
      },
      frontendSessionId,
    );
  }

  private async syncCampaignStatsToTemplate(
    userId: string | undefined,
    chatId: string,
    template: LumiStatsTemplate,
    reason: string,
  ): Promise<void> {
    if (!chatId || chatId === 'sandbox') return;
    const resolvedUser = this.resolveUserId(userId, chatId);
    await this.storage.queue(resolvedUser, chatId, async () => {
      const snap = await this.storage.loadCampaign(resolvedUser, chatId);
      const nextState = structuredClone(snap.state);
      for (const def of template.stats) {
        if (!def.enabled) continue;
        const isTextDef =
          def.kind === 'text' ||
          def.kind === 'tags' ||
          def.kind === 'tier' ||
          def.kind === 'skill_tree' ||
          def.kind === 'xp_level' ||
          def.kind === 'attributes' ||
          def.kind === 'inventory' ||
          def.kind === 'status_fx' ||
          Boolean(def.displayStyle && def.displayStyle !== 'auto');

        if (def.scope === 'character') {
          for (const actor of Object.values(nextState.characters)) {
            const curM = actor.meters[def.id];
            if (!curM) {
              actor.meters[def.id] = {
                value: def.defaultValue,
                calibrated: false,
                locked: def.locked,
              };
            } else if (isTextDef && typeof curM.value === 'number') {
              curM.value = typeof def.defaultValue === 'string' ? def.defaultValue : String(curM.value);
            }
          }
          continue;
        }

        const existing = nextState.stats[def.id];
        if (!existing) {
          nextState.stats[def.id] = {
            id: def.id,
            scope: def.scope,
            value: def.defaultValue,
            calibrated: false,
            locked: def.locked,
          };
        } else {
          existing.scope = def.scope;
          existing.locked = def.locked;
          if (isTextDef && typeof existing.value === 'number') {
            existing.value = typeof def.defaultValue === 'string' ? def.defaultValue : String(existing.value);
          } else if (!isTextDef && typeof existing.value === 'number') {
            existing.value = Math.max(def.min, Math.min(def.max, existing.value));
          }
        }
      }
      recomputeDerivedStats(template.stats, nextState, template.categories ?? []);
      await this.storage.commitCampaign(resolvedUser, chatId, snap.state, nextState, reason);
    });
  }

  private async rehydrateChatMessages(userId: string | undefined, chatId: string): Promise<void> {
    if (!chatId || chatId === 'sandbox' || !this.api.permissions.has('chat_mutation')) return;
    const resolvedUser = this.resolveUserId(userId, chatId);

    try {
      const untrackedAssistantId = await this.storage.queue(resolvedUser, chatId, async () => {
        const snap = await this.storage.loadCampaign(resolvedUser, chatId);
        const allRows = await this.api.chat.getMessages(chatId);
        const rows = allRows.slice(-40);
        const indexOffset = Math.max(0, allRows.length - rows.length);
        if (!rows.length) return undefined;

        const boundMap = new Map(snap.bindings.map(b => [b.messageId, b]));
        const maxBoundIndex = snap.bindings.reduce((max, b) => Math.max(max, b.messageIndex), -1);
        let stateCursor = structuredClone(snap.state);
        const nextBindings = [...snap.bindings];
        let appliedAnyTag = false;

        for (let i = 0; i < rows.length; i++) {
          const msg = rows[i]!;
          if (msg.role !== 'assistant' || typeof msg.content !== 'string') continue;
          const tagPatch = extractInlineStatsTag(msg.content);
          if (!tagPatch) continue;

          const msgIndex = indexOffset + i;
          const swipeId = typeof msg.swipe_id === 'number' ? msg.swipe_id : 0;
          const contentHash = await sha256Hex(stripInlineStatsTags(msg.content));
          const prevBinding = boundMap.get(msg.id);
          if (snap.state.initialized && msgIndex < maxBoundIndex) {
            continue;
          }
          if (
            prevBinding &&
            prevBinding.contentHash === contentHash &&
            snap.state.initialized
          ) {
            // Keep swipeId synced without re-applying an already-tracked turn on top of current state
            if (prevBinding.swipeId !== swipeId) {
              prevBinding.swipeId = swipeId;
            }
            continue;
          }

          stateCursor = applyTurnPatch(stateCursor, snap.template, tagPatch, {
            incrementTurn: true,
          }).state;
          const binding = {
            messageId: msg.id,
            swipeId,
            contentHash,
            messageIndex: msgIndex,
          };
          const existingIdx = nextBindings.findIndex(b => b.messageId === msg.id);
          if (existingIdx >= 0) nextBindings[existingIdx] = binding;
          else nextBindings.push(binding);
          boundMap.set(msg.id, binding);
          appliedAnyTag = true;
        }

        if (appliedAnyTag) {
          await this.storage.commitCampaign(
            resolvedUser,
            chatId,
            snap.state,
            stateCursor,
            'Rehydrated stats from chat message tags',
            undefined,
            nextBindings.slice(-120),
          );
          return undefined;
        }

        const latestAssistant = rows.findLast(
          m => m.role === 'assistant' && m.content.trim().length > 0,
        );
        return latestAssistant && !boundMap.has(latestAssistant.id)
          ? latestAssistant.id
          : undefined;
      });

      if (untrackedAssistantId) {
        const settings = await this.storage.loadSettings(resolvedUser);
        if (settings.autoTrack && this.api.permissions.has('generation') && !this.tracker.isBusy(resolvedUser, chatId)) {
          void this.tracker
            .trackTurn(resolvedUser, chatId, { targetMessageId: untrackedAssistantId })
            .then(updated => {
              if (updated) return this.broadcastSnapshot(resolvedUser, chatId);
            })
            .catch(() => undefined);
        }
      }
    } catch {
      // Ignore if chat messages are temporarily unavailable
    }
  }

  private async handleRpc(
    req: LumiRpcRequest,
    userId: string,
    session?: string,
  ): Promise<Record<string, unknown>> {
    const rawChatId = String(req.chatId ?? '').trim();
    const chatId = await this.resolveEffectiveChatId(userId, rawChatId);
    const payload = req.payload ?? {};

    switch (req.type) {
      case 'snapshot:get': {
        if (chatId && chatId !== 'sandbox') {
          await this.rehydrateChatMessages(userId, chatId);
          const snap = await this.storage.loadCampaign(userId, chatId);
          await this.storage.syncNativeLumiverseSurfaces(
            userId,
            chatId,
            snap.revision,
            snap.state,
            snap.template,
            false,
          );
        }
        await this.broadcastSnapshot(userId, chatId, session);
        const [settings, connections, rawMessages] = await Promise.all([
          this.storage.loadSettings(userId),
          this.api.permissions.has('generation') && this.api.connections?.list
            ? this.api.connections.list(userId).catch(() => [])
            : Promise.resolve([]),
          chatId && chatId !== 'sandbox' && this.api.permissions.has('chat_mutation')
            ? this.api.chat.getMessages(chatId).catch(() => [])
            : Promise.resolve([]),
        ]);
        const shouldRestoreTurns =
          Boolean(settings.sensitiveObfuscatorEnabled) &&
          settings.restoreObfuscatedOnRender !== false &&
          (settings.sensitiveWords?.length ?? 0) > 0;
        const recentTurns = rawMessages
          .filter(m => m.role === 'user' || m.role === 'assistant')
          .slice(-24)
          .map(m => {
            let text = stripInlineStatsTags(typeof m.content === 'string' ? m.content : '');
            if (shouldRestoreTurns) {
              text = deobfuscateSensitiveWords(
                text,
                settings.sensitiveWords,
                settings.obfuscateVowelsWithOne !== false,
              );
            }
            return {
              id: m.id,
              role: m.role as 'user' | 'assistant',
              content: text,
            };
          });
        return {
          resolvedChatId: chatId !== 'sandbox' ? chatId : '',
          recentTurns,
          connections: connections.map(c => ({
            id: c.id,
            name: c.name,
            provider: c.provider,
            model: c.model,
            is_default: c.is_default,
          })),
        };
      }

      case 'vn:sendReply': {
        if (!chatId || chatId === 'sandbox') {
          throw new Error('Open an active chat before sending a reply from the VN Stage.');
        }
        if (!this.api.permissions.has('chat_mutation') || !this.api.permissions.has('generation')) {
          throw new Error('Enable "chat_mutation" and "generation" permissions to send replies directly from the VN Stage.');
        }
        const content = String(payload.text ?? '').trim();
        if (!content) return { ok: false };
        const appended = await this.api.chat.appendMessage(
          chatId,
          {
            role: 'user',
            content,
            metadata: { source: 'lumi_stats_vn_stage' },
          },
          { triggerGeneration: true },
        );
        return { ok: true, messageId: appended.id, generationId: appended.generationId };
      }

      case 'tag:intercepted': {
        if (!chatId || chatId === 'sandbox') return { ok: false };
        const rawContent = String(payload.content ?? '').trim();
        const messageId = typeof payload.messageId === 'string' ? payload.messageId : undefined;
        if (!rawContent) return { ok: false };
        const snap = await this.tracker.trackTurn(userId, chatId, {
          targetMessageId: messageId,
          inlineTagContent: rawContent,
        });
        if (snap) await this.broadcastSnapshot(userId, chatId, session);
        return { ok: Boolean(snap) };
      }

      case 'settings:update': {
        const nextSettings = await this.storage.saveSettings(
          userId,
          (payload.settings as Partial<LumiUserSettings>) ?? {},
        );
        this.renderCache.clear();
        await this.syncObfuscatorDisplayRegex(userId);
        if (chatId) await this.broadcastSnapshot(userId, chatId, session);
        return { settings: nextSettings };
      }

      case 'template:saveCurrent': {
        const effectiveChatId = chatId || 'sandbox';
        const updatedTpl = await this.storage.saveChatTemplate(
          userId,
          effectiveChatId,
          normalizeImportedTemplate(payload.template),
        );
        if (payload.saveToLibrary === true) {
          const lib = await this.storage.saveCustomTemplateToLibrary(userId, updatedTpl);
          const latest = lib.at(-1);
          if (latest) {
            await this.storage.saveSettings(userId, { defaultTemplateId: latest.id });
          }
        }
        await this.syncCampaignStatsToTemplate(
          userId,
          effectiveChatId,
          updatedTpl,
          `Updated template "${updatedTpl.name}"`,
        );
        await this.broadcastSnapshot(userId, chatId, session);
        return { template: updatedTpl };
      }

      case 'prose:cleanChat': {
        if (!this.api.permissions.has('chat_mutation')) {
          throw new Error('Enable the "chat_mutation" permission to clean chat messages.');
        }
        const messages = await this.api.chat.getMessages(chatId);
        let cleanedCount = 0;
        for (const m of messages) {
          if (typeof m.content !== 'string') continue;
          const cleaned = cleanBrailleAndProseWhitespace(m.content);
          if (cleaned !== m.content) {
            this.selfEditedMessages.add(`${chatId}:${m.id}`);
            await this.api.chat.updateMessage(chatId, m.id, {
              content: cleaned,
              skipChunkRebuild: true,
            });
            cleanedCount++;
          }
        }
        this.renderCache.invalidateChat(chatId);
        return { cleanedCount, total: messages.length };
      }

      case 'template:apply': {
        const effectiveChatId = chatId || 'sandbox';
        const tplId = String(payload.templateId ?? '').trim();
        const customList = await this.storage.listCustomTemplates(userId);
        const all = [...customList, ...BUILTIN_TEMPLATES];
        const found =
          all.find(t => t.id === tplId) ??
          (payload.template ? normalizeImportedTemplate(payload.template) : undefined);
        if (!found) throw new Error('Template not found.');

        const applied = await this.storage.saveChatTemplate(userId, effectiveChatId, {
          ...found,
          userSelected: true,
        });
        await this.storage.saveSettings(userId, { defaultTemplateId: applied.id });
        await this.syncCampaignStatsToTemplate(
          userId,
          effectiveChatId,
          applied,
          `Applied template "${applied.name}"`,
        );
        await this.broadcastSnapshot(userId, effectiveChatId);
        return { template: applied };
      }

      case 'template:duplicate': {
        const effectiveChatId = chatId || 'sandbox';
        const sourceId = String(payload.sourceTemplateId ?? '').trim();
        const customList = await this.storage.listCustomTemplates(userId);
        const all = [...customList, ...BUILTIN_TEMPLATES];
        const sourceTpl =
          all.find(t => t.id === sourceId) ??
          (payload.template
            ? normalizeImportedTemplate(payload.template)
            : await this.storage.loadChatTemplate(userId, effectiveChatId));

        const baseName = String(payload.name ?? `${sourceTpl.name} (Copy)`).trim().slice(0, 80);
        const uniqueSuffix = Date.now().toString(36).slice(-4);
        const draftDuplicate: LumiStatsTemplate = {
          ...structuredClone(sourceTpl),
          id: `custom_${slugifyKey(baseName, 'template')}_${uniqueSuffix}`,
          name: baseName,
          icon: String(payload.icon ?? sourceTpl.icon).trim().slice(0, 12) || '✨',
          description: String(payload.description ?? sourceTpl.description).trim().slice(0, 400),
          userSelected: true,
          updatedAt: new Date().toISOString(),
        };

        const { library, saved: duplicated } = await this.storage.upsertCustomTemplateInLibrary(
          userId,
          draftDuplicate,
        );
        await this.storage.saveChatTemplate(userId, effectiveChatId, duplicated);
        await this.storage.saveSettings(userId, { defaultTemplateId: duplicated.id });
        await this.syncCampaignStatsToTemplate(
          userId,
          effectiveChatId,
          duplicated,
          `Duplicated template "${duplicated.name}"`,
        );
        await this.broadcastSnapshot(userId, effectiveChatId);
        return { template: duplicated, customTemplates: library };
      }

      case 'template:saveToLibrary': {
        const effectiveChatId = chatId || 'sandbox';
        const currentTpl = await this.storage.loadChatTemplate(userId, effectiveChatId);
        const name = String(payload.name ?? currentTpl.name).trim().slice(0, 80) || 'Custom Template';
        const icon = String(payload.icon ?? currentTpl.icon).trim().slice(0, 12) || '✨';
        const description = String(payload.description ?? currentTpl.description).trim().slice(0, 400);
        const isCurrentBuiltin = BUILTIN_TEMPLATES.some(b => b.id === currentTpl.id);
        const preservedId =
          !isCurrentBuiltin && payload.forceNew !== true && currentTpl.id
            ? currentTpl.id
            : `custom_${slugifyKey(name, 'template')}_${Date.now().toString(36).slice(-4)}`;
        const toSave: LumiStatsTemplate = {
          ...currentTpl,
          id: preservedId,
          name,
          icon,
          description,
          userSelected: true,
          updatedAt: new Date().toISOString(),
        };
        const { library, saved } = await this.storage.upsertCustomTemplateInLibrary(userId, toSave);
        await this.storage.saveChatTemplate(userId, effectiveChatId, saved);
        await this.storage.saveSettings(userId, { defaultTemplateId: saved.id });
        await this.broadcastSnapshot(userId, effectiveChatId);
        return { template: saved, customTemplates: library };
      }

      case 'template:createNew': {
        const effectiveChatId = chatId || 'sandbox';
        const baseMode = String(payload.starter ?? 'minimal').trim();
        const name = String(payload.name ?? 'My Custom Template').trim().slice(0, 80) || 'My Custom Template';
        const icon = String(payload.icon ?? '✨').trim().slice(0, 12) || '✨';
        const description =
          String(payload.description ?? 'Custom roleplay tracker template.').trim().slice(0, 400) ||
          'Custom roleplay tracker template.';
        const customList = await this.storage.listCustomTemplates(userId);
        const baseStarter =
          customList.find(c => c.id === baseMode) ??
          BUILTIN_TEMPLATES.find(b => b.id === baseMode) ??
          BUILTIN_TEMPLATES[0]!;
        const freshDraft: LumiStatsTemplate = normalizeImportedTemplate({
          ...structuredClone(baseStarter),
          id: `custom_${slugifyKey(name, 'template')}_${Date.now().toString(36).slice(-4)}`,
          name,
          icon,
          description,
          ...(payload.promptPosition ? { promptPosition: payload.promptPosition } : {}),
          ...(payload.promptDepth !== undefined ? { promptDepth: payload.promptDepth } : {}),
          stats:
            baseMode === 'empty'
              ? []
              : baseMode === 'blank'
                ? [
                    baseStarter.stats.find(s => s.id === 'trust') ?? baseStarter.stats[0]!,
                  ].filter(Boolean)
                : structuredClone(baseStarter.stats),
          userSelected: true,
          updatedAt: new Date().toISOString(),
        }, name);
        const { library, saved: freshTpl } = await this.storage.upsertCustomTemplateInLibrary(
          userId,
          freshDraft,
        );
        await this.storage.saveChatTemplate(userId, effectiveChatId, freshTpl);
        await this.storage.saveSettings(userId, { defaultTemplateId: freshTpl.id });
        await this.syncCampaignStatsToTemplate(
          userId,
          effectiveChatId,
          freshTpl,
          `Created new template "${freshTpl.name}"`,
        );
        await this.broadcastSnapshot(userId, effectiveChatId);
        return { template: freshTpl, customTemplates: library };
      }

      case 'template:deleteFromLibrary': {
        const effectiveChatId = chatId || 'sandbox';
        const tplId = String(payload.templateId ?? '').trim();
        const library = await this.storage.deleteCustomTemplateFromLibrary(userId, tplId);
        const settings = await this.storage.loadSettings(userId);
        const fallbackTpl = BUILTIN_TEMPLATES[0]!;
        if (settings.defaultTemplateId === tplId) {
          await this.storage.saveSettings(userId, { defaultTemplateId: fallbackTpl.id });
        }
        const curTpl = await this.storage.loadChatTemplate(userId, effectiveChatId);
        if (curTpl.id === tplId) {
          await this.storage.saveChatTemplate(userId, effectiveChatId, fallbackTpl);
          await this.syncCampaignStatsToTemplate(
            userId,
            effectiveChatId,
            fallbackTpl,
            `Reverted deleted template "${curTpl.name}" to default`,
          );
        }
        await this.broadcastSnapshot(userId, effectiveChatId);
        return { customTemplates: library };
      }

      case 'template:importJson': {
        const effectiveChatId = chatId || 'sandbox';
        const parsed = JSON.parse(String(payload.json ?? '')) as unknown;
        const list = Array.isArray(parsed)
          ? parsed.map(item => normalizeImportedTemplate(item))
          : [normalizeImportedTemplate(parsed)];
        let library = await this.storage.listCustomTemplates(userId);
        let active = list[0]!;
        for (const item of list) {
          const res = await this.storage.upsertCustomTemplateInLibrary(userId, item);
          library = res.library;
          active = res.saved;
        }
        await this.storage.saveChatTemplate(userId, effectiveChatId, active);
        await this.storage.saveSettings(userId, { defaultTemplateId: active.id });
        await this.syncCampaignStatsToTemplate(
          userId,
          effectiveChatId,
          active,
          `Imported template "${active.name}"`,
        );
        await this.broadcastSnapshot(userId, effectiveChatId);
        return { template: active, customTemplates: library };
      }

      case 'state:mutate': {
        const effectiveChatId = chatId || 'sandbox';
        await this.storage.queue(userId, effectiveChatId, async () => {
          const snap = await this.storage.loadCampaign(userId, effectiveChatId);
          let nextState = structuredClone(snap.state);
          let nextTemplate = structuredClone(snap.template);

          if (payload.templatePatch && typeof payload.templatePatch === 'object') {
            const rawPatch = payload.templatePatch as Partial<LumiStatsTemplate>;
            nextTemplate = normalizeImportedTemplate({
              ...nextTemplate,
              ...rawPatch,
              ...(rawPatch.theme
                ? {
                    theme: {
                      ...nextTemplate.theme,
                      ...rawPatch.theme,
                      ...(rawPatch.theme.showSceneChips
                        ? {
                            showSceneChips: {
                              ...nextTemplate.theme.showSceneChips,
                              ...rawPatch.theme.showSceneChips,
                            },
                          }
                        : {}),
                    },
                  }
                : {}),
              ...(rawPatch.surfaces
                ? { surfaces: { ...nextTemplate.surfaces, ...rawPatch.surfaces } }
                : {}),
            });
            await this.storage.saveChatTemplate(userId, effectiveChatId, nextTemplate);

            const customLib = await this.storage.listCustomTemplates(userId);
            if (customLib.some(t => t.id === nextTemplate.id)) {
              await this.storage.upsertCustomTemplateInLibrary(userId, nextTemplate);
            }

            for (const def of nextTemplate.stats) {
              if (!def.enabled) continue;
              const isTextDef =
                def.kind === 'text' ||
                def.kind === 'tags' ||
                def.kind === 'tier' ||
                Boolean(def.displayStyle && def.displayStyle !== 'auto');
              if (def.scope === 'character') {
                for (const actor of Object.values(nextState.characters)) {
                  const curM = actor.meters[def.id];
                  if (!curM) {
                    actor.meters[def.id] = {
                      value: def.defaultValue,
                      calibrated: false,
                      locked: def.locked,
                    };
                  } else if (isTextDef && typeof curM.value === 'number') {
                    curM.value = typeof def.defaultValue === 'string' ? def.defaultValue : String(curM.value);
                  }
                }
              } else {
                const curS = nextState.stats[def.id];
                if (!curS) {
                  nextState.stats[def.id] = {
                    id: def.id,
                    scope: def.scope,
                    value: def.defaultValue,
                    calibrated: false,
                    locked: def.locked,
                  };
                } else if (isTextDef && typeof curS.value === 'number') {
                  curS.value = typeof def.defaultValue === 'string' ? def.defaultValue : String(curS.value);
                }
              }
            }
          }

          if (payload.patch && typeof payload.patch === 'object') {
            const reduced = applyTurnPatch(
              nextState,
              nextTemplate,
              payload.patch as ExtractedTurnPatch,
              { isManualEdit: true },
            );
            nextState = reduced.state;
          }

          if (payload.stateOverride && typeof payload.stateOverride === 'object') {
            nextState = {
              ...nextState,
              ...(payload.stateOverride as Partial<CampaignState>),
            };
          }

          recomputeDerivedStats(nextTemplate.stats, nextState, nextTemplate.categories ?? []);

          await this.storage.commitCampaign(
            userId,
            effectiveChatId,
            snap.state,
            nextState,
            String(payload.reason ?? 'Manual stat update'),
          );
        });
        await this.broadcastSnapshot(userId, effectiveChatId);
        return { ok: true };
      }

      case 'state:undo': {
        await this.storage.undoLatest(userId, chatId);
        await this.broadcastSnapshot(userId, chatId, session);
        return { ok: true };
      }

      case 'state:restoreCheckpoint': {
        await this.storage.restoreCheckpoint(userId, chatId, String(payload.checkpointId ?? ''));
        await this.broadcastSnapshot(userId, chatId, session);
        return { ok: true };
      }

      case 'track:manual': {
        await this.tracker.trackTurn(userId, chatId, { manual: true });
        await this.broadcastSnapshot(userId, chatId, session);
        return { ok: true };
      }

      case 'track:cancel': {
        this.tracker.cancelInFlight(userId, chatId);
        return { ok: true };
      }

      case 'map:travel': {
        const placeId = String(payload.placeId ?? '');
        const fastTravel = payload.fastTravel === true;
        const snap = await this.storage.loadCampaign(userId, chatId);
        const dest = snap.state.places[placeId];
        if (!dest) throw new Error('Destination not found.');
        const route = findShortestTravelRoute(snap.state, placeId);
        const mins = route ? route.totalMinutes : dest.travelMinutes || 5;

        if (fastTravel) {
          await this.storage.queue(userId, chatId, async () => {
            const latest = await this.storage.loadCampaign(userId, chatId);
            const reduced = applyTurnPatch(
              latest.state,
              latest.template,
              {
                scene: { location: dest.name, elapsedMinutes: mins },
              },
              { isManualEdit: true },
            );
            reduced.state.currentPlaceId = dest.id;
            await this.storage.commitCampaign(
              userId,
              chatId,
              latest.state,
              reduced.state,
              `Traveled to ${dest.name}`,
            );
          });
          await this.broadcastSnapshot(userId, chatId, session);
          return { moved: true, destination: dest.name, minutes: mins };
        }

        const routeNames = route
          ? route.pathIds.map(id => snap.state.places[id]?.name ?? id).join(' → ')
          : dest.name;
        return {
          moved: false,
          draftText:
            route && route.pathIds.length > 1
              ? `I head toward ${dest.name} (${routeNames}).`
              : `I head to ${dest.name}.`,
          minutes: mins,
        };
      }

      case 'asset:upload': {
        if (!this.api.permissions.has('images')) {
          throw new Error('Enable the "images" permission to upload portraits or backdrops.');
        }
        const dataUrl = String(payload.dataUrl ?? '');
        const kind = String(payload.kind ?? 'portrait');
        const targetId = String(payload.targetId ?? '');
        const variant = String(payload.variant ?? 'neutral').trim().toLowerCase() || 'neutral';

        const uploaded = await this.api.images.uploadFromDataUrl(dataUrl, {
          owner_chat_id: chatId,
          userId,
        });

        await this.storage.queue(userId, chatId, async () => {
          const snap = await this.storage.loadCampaign(userId, chatId);
          const nextState = structuredClone(snap.state);
          if ((kind === 'backdrop' || kind === 'backdrop_variant') && nextState.places[targetId]) {
            const place = nextState.places[targetId]!;
            const timeSlot = (String(payload.timeSlot ?? 'default').trim() || 'default') as
              | 'default'
              | 'morning'
              | 'day'
              | 'evening'
              | 'night'
              | 'custom';
            const customTag = String(payload.customTag ?? '').trim();
            if (kind === 'backdrop' || timeSlot === 'default' || !place.backdropUrl) {
              place.backdropImageId = uploaded.id;
              place.backdropUrl = uploaded.url;
            }
            place.backdropVariants ??= [];
            const varId =
              timeSlot === 'custom' && customTag
                ? `bg_${slugifyKey(customTag, 'custom')}`
                : `bg_${timeSlot}`;
            const existingIdx = place.backdropVariants.findIndex(v => v.id === varId);
            const entry = {
              id: varId,
              timeSlot,
              customTag,
              imageId: uploaded.id,
              url: uploaded.url,
              pinned: Boolean(payload.pinned),
            };
            if (existingIdx >= 0) place.backdropVariants[existingIdx] = entry;
            else place.backdropVariants.push(entry);
          } else if (nextState.characters[targetId]) {
            const actor = nextState.characters[targetId]!;
            if (kind === 'sprite_variant') {
              const emotionTag = String(payload.emotionTag ?? '').trim();
              const clothesTag = String(payload.clothesTag ?? '').trim();
              const poseTag = String(payload.poseTag ?? '').trim();
              const label =
                String(payload.label ?? '').trim() ||
                [emotionTag, clothesTag, poseTag].filter(Boolean).join(' · ') ||
                'Default Sprite';
              actor.spriteVariants ??= [];
              const varId = `sp_${slugifyKey(`${emotionTag}_${clothesTag}_${poseTag}`, `v${actor.spriteVariants.length + 1}`)}_${Date.now().toString(36).slice(-3)}`;
              actor.spriteVariants.push({
                id: varId,
                label,
                emotionTag,
                clothesTag,
                poseTag,
                imageId: uploaded.id,
                url: uploaded.url,
                pinned: Boolean(payload.pinned),
              });
              if (emotionTag) {
                actor.expressionAssets[emotionTag.toLowerCase()] = {
                  imageId: uploaded.id,
                  url: uploaded.url,
                };
              }
              if (!actor.portraitUrl) {
                actor.portraitAssetId = uploaded.id;
                actor.portraitUrl = uploaded.url;
              }
            } else if (kind === 'expression') {
              actor.expressionAssets[variant] = {
                imageId: uploaded.id,
                url: uploaded.url,
              };
            } else {
              actor.portraitAssetId = uploaded.id;
              actor.portraitUrl = uploaded.url;
            }
          }
          await this.storage.commitCampaign(
            userId,
            chatId,
            snap.state,
            nextState,
            `Uploaded ${kind} asset`,
          );
        });
        await this.broadcastSnapshot(userId, chatId, session);
        return { url: uploaded.url, imageId: uploaded.id };
      }

      case 'textEditor:open': {
        const res = await this.api.textEditor.open({
          title: String(payload.title ?? 'Edit Text'),
          value: String(payload.value ?? ''),
          placeholder: String(payload.placeholder ?? ''),
          userId,
        });
        return { text: res.text, cancelled: res.cancelled };
      }

      case 'sandbox:test': {
        return this.tracker.runSandboxRuleTest(userId, chatId, {
          statId: typeof payload.statId === 'string' ? payload.statId : undefined,
          scenarioText: typeof payload.scenarioText === 'string' ? payload.scenarioText : undefined,
        });
      }

      case 'formula:compile': {
        return this.tracker.compileRuleToLocalFormula(userId, chatId, {
          statLabel: String(payload.statLabel ?? 'Stat'),
          ruleText: String(payload.ruleText ?? ''),
          scope: String(payload.scope ?? 'character'),
        });
      }

      case 'copilot:send': {
        const result = await this.tracker.consultCopilot(
          userId,
          chatId,
          String(payload.message ?? '').trim().slice(0, 4000),
          (payload.mode as 'ask' | 'adjust' | 'architect') ?? 'ask',
        );
        await this.broadcastSnapshot(userId, chatId, session);
        return result;
      }

      case 'copilot:acceptProposal': {
        const proposalId = String(payload.proposalId ?? '');
        const prop = this.tracker.getProposal(userId, proposalId);
        if (!prop || prop.chatId !== chatId) {
          throw new Error('Copilot proposal expired or not found.');
        }
        if (prop.templatePatch) {
          const savedTpl = await this.storage.saveChatTemplate(userId, chatId, prop.templatePatch);
          await this.syncCampaignStatsToTemplate(
            userId,
            chatId,
            savedTpl,
            'Synced Copilot template schema',
          );
        }
        if (prop.statePatch) {
          await this.storage.queue(userId, chatId, async () => {
            const snap = await this.storage.loadCampaign(userId, chatId);
            const tpl = prop.templatePatch ?? snap.template;
            const reduced = applyTurnPatch(snap.state, tpl, prop.statePatch!, {
              isManualEdit: true,
            });
            await this.storage.commitCampaign(
              userId,
              chatId,
              snap.state,
              reduced.state,
              'Applied Copilot proposal',
            );
          });
        }
        this.tracker.deleteProposal(userId, proposalId);
        await this.broadcastSnapshot(userId, chatId, session);
        return { ok: true };
      }

      case 'copilot:clear': {
        await this.api.userStorage.setJson(
          `copilot/${encodeURIComponent(chatId)}.json`,
          [],
          { userId },
        );
        await this.broadcastSnapshot(userId, chatId, session);
        return { ok: true };
      }

      case 'debug:get': {
        return { record: this.tracker.getDebugRecord(userId, chatId) };
      }

      case 'debug:clear': {
        this.tracker.clearDebugRecord(userId, chatId);
        return { ok: true };
      }

      case 'tokens:analyze': {
        const effectiveChatId = chatId || 'sandbox';
        const [snap, settings] = await Promise.all([
          this.storage.loadCampaign(userId, effectiveChatId),
          this.storage.loadSettings(userId),
        ]);
        const countApproxOrExact = async (text: string): Promise<{ tokens: number; approximate: boolean }> => {
          if (!text) return { tokens: 0, approximate: false };
          if (this.api.tokens?.countText) {
            try {
              const res = await this.api.tokens.countText(text, {
                modelSource: 'main',
                ...(userId ? { userId } : {}),
              });
              return { tokens: res.total_tokens, approximate: Boolean(res.approximate) };
            } catch {
              // Fallback to char/4 if no default connection is configured
            }
          }
          return { tokens: Math.ceil(text.length / 4), approximate: true };
        };

        const charBudget = Math.max(400, settings.tokenBudget * 4);
        const budgetedCont = compileNarratorContinuity(snap.state, snap.template, charBudget).text;
        const unbudgetedCont = compileNarratorContinuity(snap.state, snap.template, 40000).text;
        const protocolTxt =
          settings.extractionMode === 'inline_tag'
            ? compileExtractorPrompt(snap.state, snap.template, '', {
                verbosity: settings.protocolVerbosity ?? 'compact',
              })
            : '';

        const [contCount, rawContCount, protoCount] = await Promise.all([
          countApproxOrExact(budgetedCont),
          countApproxOrExact(unbudgetedCont),
          countApproxOrExact(protocolTxt),
        ]);

        const statBreakdown = snap.template.stats
          .filter(s => s.enabled)
          .map(s => {
            const ruleChars =
              settings.extractionMode === 'inline_tag' && s.calculationMode !== 'local_formula'
                ? (s.triggerCues?.length ?? 0) + s.id.length + 18
                : 0;
            let stateChars = 0;
            if (s.injectInContinuity !== false) {
              if (s.scope === 'character') {
                for (const actor of Object.values(snap.state.characters)) {
                  const m = actor.meters[s.id];
                  if (m?.calibrated) stateChars += s.id.length + String(m.value).length + 3;
                }
              } else {
                const r = snap.state.stats[s.id];
                if (r?.calibrated) stateChars += s.id.length + String(r.value).length + 3;
              }
            }
            return {
              id: s.id,
              label: `${s.icon} ${s.label}`,
              scope: s.scope,
              approxTokens: Math.ceil((ruleChars + stateChars) / 4),
              ruleTokens: Math.ceil(ruleChars / 4),
              stateTokens: Math.ceil(stateChars / 4),
            };
          })
          .sort((a, b) => b.approxTokens - a.approxTokens)
          .slice(0, 8);

        let dossierChars = 0;
        for (const actor of Object.values(snap.state.characters).filter(c => c.present)) {
          for (const f of snap.template.dossierFields.filter(df => df.enabled)) {
            const val = resolveCharacterFieldValue(actor, f.id);
            if (val) dossierChars += f.id.length + val.length + 4;
          }
        }

        return {
          extractionMode: settings.extractionMode,
          protocolVerbosity: settings.protocolVerbosity ?? 'compact',
          tokenBudget: settings.tokenBudget,
          approximate: contCount.approximate || protoCount.approximate,
          continuityTokens: contCount.tokens,
          rawContinuityTokens: rawContCount.tokens,
          protocolTokens: protoCount.tokens,
          totalInjectedTokens: contCount.tokens + protoCount.tokens,
          dossierStateTokens: Math.ceil(dossierChars / 4),
          topStats: statBreakdown,
        };
      }

      default:
        throw new Error(`Unknown Lumi Stats RPC action: ${req.type}`);
    }
  }

  start(): () => void {
    const releaseTagCap = (
      this.api as SpindleAPI & {
        frontendCapabilities?: { declare(c: 'message_tag_interceptor'): () => void };
      }
    ).frontendCapabilities?.declare('message_tag_interceptor');
    if (releaseTagCap) this.disposers.push(releaseTagCap);

    void this.storage.loadSettings().then(() => this.syncObfuscatorDisplayRegex(undefined)).catch(() => undefined);

    this.disposers.push(
      this.api.onFrontendMessage((rawPayload, userId, frontendSessionId) => {
        if (!rawPayload || typeof rawPayload !== 'object') return;
        const req = rawPayload as LumiRpcRequest;
        if (req.channel !== LUMI_STATS_CHANNEL || !req.requestId || !req.type) return;

        void this.handleRpc(req, userId, frontendSessionId)
          .then(data => {
            const resp: LumiRpcResponse = {
              channel: LUMI_STATS_CHANNEL,
              requestId: req.requestId,
              chatId: req.chatId,
              type: 'rpc_ack',
              ok: true,
              data,
            };
            this.api.sendToFrontend(
              resp,
              userId,
              frontendSessionId ? { frontendSessionId } : undefined,
            );
          })
          .catch(err => {
            if (isAbortError(err)) {
              const resp: LumiRpcResponse = {
                channel: LUMI_STATS_CHANNEL,
                requestId: req.requestId,
                chatId: req.chatId,
                type: 'rpc_ack',
                ok: true,
                data: { cancelled: true },
              };
              this.api.sendToFrontend(
                resp,
                userId,
                frontendSessionId ? { frontendSessionId } : undefined,
              );
              return;
            }
            const msg = err instanceof Error ? err.message : String(err);
            const resp: LumiRpcResponse = {
              channel: LUMI_STATS_CHANNEL,
              requestId: req.requestId,
              chatId: req.chatId,
              type: 'rpc_ack',
              ok: false,
              error: msg,
            };
            this.api.sendToFrontend(
              resp,
              userId,
              frontendSessionId ? { frontendSessionId } : undefined,
            );
          });
      }),
    );

    let disposeInterceptor: (() => void) | undefined;
    const ensureInterceptor = () => {
      if (disposeInterceptor || !this.api.permissions.has('interceptor')) return;
      disposeInterceptor = this.api.registerInterceptor(async (messages, context) => {
        if (this.stopped) return messages;
        const ctxObj =
          context && typeof context === 'object'
            ? (context as unknown as Record<string, unknown> & { signal?: AbortSignal })
            : {};
        ctxObj.signal?.throwIfAborted();

        const genType = String(ctxObj.generationType ?? 'normal').toLowerCase();
        if (genType === 'impersonate' || genType === 'quiet') return messages;

        const chatId = typeof ctxObj.chatId === 'string' ? ctxObj.chatId : '';
        if (!chatId) return messages;
        const userId = this.resolveUserId(
          typeof ctxObj.userId === 'string' ? ctxObj.userId : undefined,
          chatId,
        );
        this.rememberActiveChat(userId, chatId);

        const settings = await this.storage.loadSettings(userId);
        if (!settings.injectContinuity && settings.extractionMode !== 'inline_tag') {
          return messages;
        }

        const presetMeta =
          ctxObj.presetMetadata && typeof ctxObj.presetMetadata === 'object'
            ? (ctxObj.presetMetadata as Record<string, unknown>)
            : undefined;
        const presetDefaultTemplateId =
          typeof presetMeta?.defaultTemplateId === 'string'
            ? presetMeta.defaultTemplateId
            : undefined;

        let snap = await this.storage.loadCampaign(userId, chatId, { presetDefaultTemplateId });
        if (genType === 'regenerate' || genType === 'swipe') {
          const targetId =
            String(ctxObj.excludeMessageId ?? ctxObj.targetMessageId ?? '').trim() ||
            snap.bindings.at(-1)?.messageId;
          snap = await this.storage.previewRollbackBeforeMessage(userId, chatId, targetId);
        } else if (ctxObj.dryRun !== true) {
          const boundIds = new Set(snap.bindings.map(b => b.messageId));
          const maxBoundIndex = snap.bindings.reduce((max, b) => Math.max(max, b.messageIndex), -1);
          let stateCursor = structuredClone(snap.state);
          const nextBindings = [...snap.bindings];
          let caughtUp = false;

          for (const m of messages) {
            if (!m || m.role !== 'assistant' || typeof m.content !== 'string') continue;
            const msgMeta = m as {
              __isChatHistory?: boolean;
              sourceMessageId?: string;
              sourceIndexInChat?: number;
            };
            const srcId = typeof msgMeta.sourceMessageId === 'string' ? msgMeta.sourceMessageId.trim() : '';
            if (!srcId || boundIds.has(srcId)) continue;
            const srcIndex =
              typeof msgMeta.sourceIndexInChat === 'number'
                ? msgMeta.sourceIndexInChat
                : Math.max(0, maxBoundIndex + 1);
            if (snap.state.initialized && srcIndex < maxBoundIndex) continue;

            const inlinePatch = extractInlineStatsTag(m.content);
            if (!inlinePatch) continue;

            const contentHash = await sha256Hex(stripInlineStatsTags(m.content));
            stateCursor = applyTurnPatch(stateCursor, snap.template, inlinePatch, {
              incrementTurn: true,
            }).state;
            nextBindings.push({
              messageId: srcId,
              swipeId: 0,
              contentHash,
              messageIndex: srcIndex,
            });
            boundIds.add(srcId);
            caughtUp = true;
          }

          if (caughtUp) {
            snap = await this.storage.queue(userId, chatId, () =>
              this.storage.commitCampaign(
                userId,
                chatId,
                snap.state,
                stateCursor,
                'Synced inline <lumi-stats> block from chat history',
                undefined,
                nextBindings.slice(-120),
              ),
            );
            void this.broadcastSnapshot(userId, chatId);
          }
        }

        const cleanedMessages = messages.map(m => {
          if (!m || m.role === 'system' || typeof m.content !== 'string') return m;
          let txt = stripInlineStatsTags(m.content);
          if (settings.cleanBraille && hasBrailleOrWhitespaceArtifacts(txt)) {
            txt = cleanBrailleAndProseWhitespace(txt);
          }
          return txt !== m.content ? { ...m, content: txt } : m;
        });

        let charBudget = Math.max(400, settings.tokenBudget * 4);
        let continuity = this.storage.getCompiledContinuity(
          userId,
          chatId,
          snap.revision,
          snap.state,
          snap.template,
          charBudget,
        );

        if (this.api.tokens?.countText && continuity.text) {
          try {
            let measuredTokens = continuity.tokenCount;
            if (measuredTokens === undefined) {
              const countRes = await this.api.tokens.countText(continuity.text, {
                modelSource: 'main',
                ...(userId ? { userId } : {}),
              });
              measuredTokens = countRes.total_tokens;
              continuity.tokenCount = measuredTokens;
            }
            if (measuredTokens > settings.tokenBudget && measuredTokens > 0) {
              const ratio = settings.tokenBudget / measuredTokens;
              charBudget = Math.max(300, Math.floor(continuity.text.length * ratio));
              continuity = this.storage.getCompiledContinuity(
                userId,
                chatId,
                snap.revision,
                snap.state,
                snap.template,
                charBudget,
              );
            }
          } catch {
            // Keep character-budgeted fallback if no default connection is configured yet
          }
        }

        const promptAlreadyHasContinuity = cleanedMessages.some(
          m =>
            typeof m?.content === 'string' &&
            (m.content.includes('[Lumi Stats ·') ||
              m.content.includes('Scene: [') ||
              (continuity.text.length > 32 && m.content.includes(continuity.text.slice(0, 32)))),
        );
        const promptAlreadyHasProtocol = cleanedMessages.some(
          m => typeof m?.content === 'string' && m.content.includes('<lumi_stats_protocol>'),
        );

        const shouldInjectContinuity =
          !promptAlreadyHasContinuity &&
          Boolean(snap.state.canonPremise || (settings.injectContinuity && continuity.text));
        const recentTextForGating = cleanedMessages
          .filter(m => m?.__isChatHistory)
          .slice(-4)
          .map(m => (typeof m.content === 'string' ? m.content : ''))
          .join('\n');

        const inlineContract =
          settings.extractionMode === 'inline_tag' && !promptAlreadyHasProtocol
            ? `Append updated state at the end as <lumi-stats>{...JSON...}</lumi-stats>:\n${compileExtractorPrompt(snap.state, snap.template, recentTextForGating, { verbosity: settings.protocolVerbosity ?? 'compact', skipContinuityCategoryRules: Boolean(shouldInjectContinuity && settings.injectContinuity && continuity.text) })}`
            : '';

        const obfSendActive =
          Boolean(settings.sensitiveObfuscatorEnabled) &&
          settings.obfuscateOnSend !== false &&
          (settings.sensitiveWords?.length ?? 0) > 0;
        const obfWords = settings.sensitiveWords ?? [];
        const useOne = settings.obfuscateVowelsWithOne !== false;
        const applyObfToMessage = <T extends (typeof cleanedMessages)[number]>(msg: T): T => {
          if (!obfSendActive || !msg) return msg;
          if (typeof msg.content === 'string') {
            const nextText = obfuscateSensitiveWords(msg.content, obfWords, useOne);
            return nextText !== msg.content ? { ...msg, content: nextText } : msg;
          }
          if (Array.isArray(msg.content)) {
            const nextParts = msg.content.map(part =>
              part && part.type === 'text' && typeof part.text === 'string'
                ? { ...part, text: obfuscateSensitiveWords(part.text, obfWords, useOne) }
                : part,
            );
            return { ...msg, content: nextParts };
          }
          return msg;
        };

        const markerChar = useOne ? '1' : '*';
        const cipherNoteText = `[Cipher Note: Some input terms use "${markerChar}" in place of vowels (a,e,i,o,u). Read them as normal words. Write your own narration, headers, and dialogue in standard English with normal vowels—never imitate "${markerChar}"-spelling across ordinary prose.]`;

        if (!shouldInjectContinuity && !inlineContract) {
          if (!obfSendActive) return cleanedMessages;
          const outObf = cleanedMessages.map(applyObfToMessage);
          if (settings.includeCipherHint === true) {
            outObf.unshift({
              role: 'system',
              content: cipherNoteText,
            });
          }
          return outObf;
        }

        const cipherHintLine =
          obfSendActive && settings.includeCipherHint === true ? cipherNoteText : '';

        const storyContinuityRaw = [
          shouldInjectContinuity
            ? `[Lumi Stats · Story Continuity — guide reactions naturally; never quote raw numbers in dialogue]`
            : '',
          cipherHintLine,
          shouldInjectContinuity && snap.state.canonPremise
            ? `Canon Premise: ${snap.state.canonPremise}`
            : '',
          shouldInjectContinuity && settings.injectContinuity ? continuity.text : '',
        ]
          .filter(Boolean)
          .join('\n\n');

        const obfuscatedContinuity = obfSendActive
          ? obfuscateSensitiveWords(storyContinuityRaw, obfWords, useOne)
          : storyContinuityRaw;

        // Keep static <lumi_stats_protocol> unobfuscated & first for prompt-prefix caching
        const finalSystemContent = [inlineContract, obfuscatedContinuity]
          .filter(Boolean)
          .join('\n\n');

        const pos = snap.template.promptPosition || 'post_history';
        const out = cleanedMessages.map(applyObfToMessage);
        const historyIndices: number[] = [];
        for (let i = 0; i < out.length; i++) {
          if ((out[i] as { __isChatHistory?: boolean })?.__isChatHistory) {
            historyIndices.push(i);
          }
        }

        let insertIndex = out.length;
        if (pos === 'pre_history') {
          insertIndex = historyIndices.length > 0 ? historyIndices[0]! : 0;
        } else if (pos === 'in_history') {
          const depth = Math.max(0, Math.round(Number(snap.template.promptDepth ?? 1) || 0));
          if (historyIndices.length > 0) {
            if (depth === 0) {
              insertIndex = historyIndices[historyIndices.length - 1]! + 1;
            } else if (depth <= historyIndices.length) {
              insertIndex = historyIndices[historyIndices.length - depth]!;
            } else {
              insertIndex = historyIndices[0]!;
            }
          } else {
            insertIndex = Math.max(0, out.length - depth);
          }
        } else {
          // Keep any trailing assistant prefill as the final message in the array
          while (insertIndex > 0 && out[insertIndex - 1]?.role === 'assistant') {
            insertIndex--;
          }
        }
        out.splice(insertIndex, 0, { role: 'system', content: finalSystemContent });
        return {
          messages: out,
          breakdown: [{ messageIndex: insertIndex, name: 'Lumi Stats Continuity' }],
        };
      }, 240);
    };
    ensureInterceptor();

    let disposeContentProc: (() => void) | undefined;
    let contentProcRegistered = false;
    const ensureContentProcessor = () => {
      if (
        contentProcRegistered ||
        !this.api.permissions.has('chat_mutation') ||
        typeof this.api.registerMessageContentProcessor !== 'function'
      ) {
        return;
      }
      const maybeDisposer = this.api.registerMessageContentProcessor(async ctx => {
        if (this.stopped || !this.api.permissions.has('chat_mutation') || typeof ctx?.content !== 'string') {
          return;
        }
        const userId = typeof ctx.userId === 'string' ? ctx.userId : '__owner__';
        const settings = await this.storage.loadSettings(userId);
        const obfActive =
          Boolean(settings.sensitiveObfuscatorEnabled) &&
          (settings.sensitiveWords?.length ?? 0) > 0;

        if (!settings.cleanBraille && !obfActive) return;

        const raw = ctx.content;
        const hasBraille = settings.cleanBraille && hasBrailleOrWhitespaceArtifacts(raw);
        if (!hasBraille && !obfActive) return;

        const transformContent = (input: string, origin: string): string => {
          let out = hasBraille ? cleanBrailleAndProseWhitespace(input) : input;
          if (obfActive) {
            const words = settings.sensitiveWords ?? [];
            const useOne = settings.obfuscateVowelsWithOne !== false;
            if (origin === 'render') {
              if (settings.restoreObfuscatedOnRender !== false) {
                out = deobfuscateSensitiveWords(out, words, useOne);
              } else if (settings.obfuscateOnOutput) {
                out = obfuscateSensitiveWords(out, words, useOne);
              }
            } else if (settings.obfuscateOnOutput) {
              out = obfuscateSensitiveWords(out, words, useOne);
            }
          }
          return out;
        };

        if (ctx.origin === 'render') {
          const cached = this.renderCache.get(userId, ctx.chatId ?? '', ctx.messageId, raw);
          if (cached !== undefined) {
            return cached !== raw ? { content: cached } : undefined;
          }
          const out = transformContent(raw, 'render');
          this.renderCache.set(userId, ctx.chatId ?? '', ctx.messageId, raw, out);
          return out !== raw ? { content: out } : undefined;
        }

        if (['create', 'update', 'swipe_add', 'swipe_update'].includes(ctx.origin)) {
          const out = transformContent(raw, ctx.origin);
          return out !== raw ? { content: out } : undefined;
        }
      }, 90);
      if (typeof maybeDisposer === 'function') {
        disposeContentProc = maybeDisposer;
      }
      contentProcRegistered = true;
    };
    ensureContentProcessor();

    let disposeWorldInfo: (() => void) | undefined;
    let worldInfoRegistered = false;
    const ensureWorldInfoInterceptor = () => {
      if (
        worldInfoRegistered ||
        !this.api.permissions.has('generation') ||
        typeof this.api.registerWorldInfoInterceptor !== 'function'
      ) {
        return;
      }
      const maybeDisposer = this.api.registerWorldInfoInterceptor(async ctx => {
        if (this.stopped || !this.api.permissions.has('generation') || !ctx.chatId) return;
        const userId = this.resolveUserId(ctx.userId, ctx.chatId);
        const settings = await this.storage.loadSettings(userId);
        if (!settings.worldInfoGating) return;
        const snap = await this.storage.loadCampaign(userId, ctx.chatId);
        return evaluateWorldInfoStatGates(ctx, snap.state);
      }, 90);
      if (typeof maybeDisposer === 'function') {
        disposeWorldInfo = maybeDisposer;
      }
      worldInfoRegistered = true;
    };
    ensureWorldInfoInterceptor();

    try {
      const readSyncForMacro = (ctx: unknown) => {
        const o = (ctx && typeof ctx === 'object' ? (ctx as Record<string, unknown>) : {}) as Record<string, unknown>;
        const env = (o.env && typeof o.env === 'object' ? (o.env as Record<string, unknown>) : {}) as Record<string, unknown>;
        const envChat = (env.chat && typeof env.chat === 'object' ? (env.chat as Record<string, unknown>) : {}) as Record<string, unknown>;
        const rawUserId = typeof o.userId === 'string' ? o.userId : undefined;
        const chatId =
          String(
            o.chatId ??
              o.chat_id ??
              envChat.id ??
              envChat.chatId ??
              this.lastActiveChatByUser.get(rawUserId?.trim() || '__owner__') ??
              '',
          ).trim();
        const userId = this.resolveUserId(rawUserId, chatId);
        return {
          userId,
          chatId,
          ...this.storage.getStateAndTemplateSync(userId, chatId),
        };
      };

      this.api.registerMacro({
        name: 'lumi_stats',
        category: 'extension:lumi_stats',
        description: 'Grounded Lumi Stats continuity block for the active chat',
        returnType: 'string',
        volatile: true,
        handler: ((ctx: unknown) => {
          const { userId, chatId, state, template, revision } = readSyncForMacro(ctx);
          return this.storage.getCompiledContinuity(userId, chatId, revision, state, template, 6000).text;
        }) as unknown as string,
      });

      this.api.registerMacro({
        name: 'lumi_header',
        category: 'extension:lumi_stats',
        description: 'Bracketed scene banner [ 🕰️ Time | 📅 Date | 📍 Location | 🌦️ Weather ]',
        returnType: 'string',
        volatile: true,
        handler: ((ctx: unknown) => {
          const { state } = readSyncForMacro(ctx);
          return formatSceneBanner(state).formatted;
        }) as unknown as string,
      });

      this.api.registerMacro({
        name: 'lumi_clock',
        category: 'extension:lumi_stats',
        description: 'Current 12-hour story clock for the active chat',
        returnType: 'string',
        volatile: true,
        handler: ((ctx: unknown) => {
          const { state } = readSyncForMacro(ctx);
          return formatStoryClock(state.elapsedMinutes);
        }) as unknown as string,
      });

      this.api.registerMacro({
        name: 'lumi_stat',
        category: 'extension:lumi_stats',
        description: 'Read a specific stat or character meter (e.g. {{lumi_stat::composure}} or {{lumi_stat::akane.loyalty}})',
        returnType: 'string',
        volatile: true,
        args: [{ name: 'key', description: 'Stat ID or actor.meter path', required: true }],
        handler: ((ctx: unknown) => {
          const { state } = readSyncForMacro(ctx);
          const rawArgs = (ctx as { args?: unknown[] })?.args;
          const key = String(Array.isArray(rawArgs) ? (rawArgs[0] ?? '') : '').trim();
          if (!key) return '';
          if (key.includes('.')) {
            const [actorPart, meterPart] = key.split('.');
            const actorSlug = slugifyKey(actorPart, '');
            const actor =
              state.characters[actorSlug] ??
              Object.values(state.characters).find(c => slugifyKey(c.name, '') === actorSlug);
            const m = actor?.meters[slugifyKey(meterPart, '')];
            return m !== undefined ? String(m.value) : '';
          }
          const clean = slugifyKey(key, '');
          if (state.stats[clean] !== undefined) return String(state.stats[clean]!.value);
          const firstPresent = Object.values(state.characters).find(c => c.present);
          const m = firstPresent?.meters[clean];
          return m !== undefined ? String(m.value) : '';
        }) as unknown as string,
      });

      this.api.registerMacro({
        name: 'lumi_var_table',
        category: 'extension:lumi_stats',
        description: 'Lists all persisted @lumi_stat_* and @lumi_char_* variables for the active chat',
        returnType: 'string',
        volatile: true,
        handler: ((ctx: unknown) => {
          const { state, template } = readSyncForMacro(ctx);
          const flatVars = buildFlatChatVariablesMap(state, template);
          return Object.entries(flatVars)
            .filter(([k]) => k.startsWith('lumi_stat_') || k.startsWith('lumi_char_'))
            .map(([k, v]) => `@${k}: ${v}`)
            .join('\n');
        }) as unknown as string,
      });

      this.api.registerMacro({
        name: 'lumi_format',
        category: 'extension:lumi_stats',
        description: 'Compact ~100-token JSON example block for the active Lumi Stats template',
        returnType: 'string',
        volatile: true,
        handler: ((ctx: unknown) => {
          const { state, template } = readSyncForMacro(ctx);
          return `<lumi-stats>\n${buildCompactFormatExample(state, template, state.initialized)}\n</lumi-stats>`;
        }) as unknown as string,
      });

      this.api.registerMacro({
        name: 'lumi_instructions',
        category: 'extension:lumi_stats',
        description: 'Complete Lumi Stats inline extraction instructions and compact format example',
        returnType: 'string',
        volatile: true,
        handler: ((ctx: unknown) => {
          const { state, template } = readSyncForMacro(ctx);
          return `At the end of your reply, append the updated state wrapped in <lumi-stats>{...JSON...}</lumi-stats>:\n${compileExtractorPrompt(state, template)}`;
        }) as unknown as string,
      });

      this.disposers.push(() => {
        for (const name of [
          'lumi_stats',
          'lumi_header',
          'lumi_clock',
          'lumi_stat',
          'lumi_var_table',
          'lumi_format',
          'lumi_instructions',
        ]) {
          this.api.unregisterMacro?.(name);
        }
      });
    } catch {
      // Ignore on minimal hosts
    }

    let toolsRegistered = false;
    const syncToolsRegistration = () => {
      if (!this.api.permissions.has('tools')) {
        if (toolsRegistered) {
          this.api.unregisterTool?.('lumi_stats_inspect');
          this.api.unregisterTool?.('lumi_stats_check');
          toolsRegistered = false;
        }
        return;
      }
      if (toolsRegistered) return;

      this.api.registerTool({
        name: 'lumi_stats_inspect',
        display_name: 'Lumi Stats: Inspect Scene & Character Meters',
        description: 'Inspects calibrated character meters, attire, goals, and world stats to guide narrative direction.',
        parameters: {
          type: 'object',
          properties: {
            focusCharacter: {
              type: 'string',
              description: 'Optional character name to focus the inspection on',
            },
          },
        },
        council_eligible: true,
      });

      this.api.registerTool({
        name: 'lumi_stats_check',
        display_name: 'Lumi Stats: Roll Stat / Meter Check',
        description: 'Performs a percentile check against a tracked stat or character meter and reports the outcome tier.',
        parameters: {
          type: 'object',
          properties: {
            statKey: {
              type: 'string',
              description: 'Stat ID or character.meter key to test',
            },
            difficulty: {
              type: 'number',
              description: 'Target threshold between 10 and 90 (default 50)',
            },
          },
          required: ['statKey'],
        },
        council_eligible: true,
      });
      toolsRegistered = true;
    };
    syncToolsRegistration();

    this.disposers.push(
      this.api.on('TOOL_INVOCATION', async (payload, eventUserId) => {
        const p = payload as {
          toolName?: string;
          args?: Record<string, unknown>;
          councilMember?: { name: string; role: string };
        };
        const resolvedUser = this.resolveUserId(eventUserId);
        const activeChat = this.api.permissions.has('chats')
          ? await (this.api.chats.getActive as (u?: string) => Promise<{ id?: string } | null>)(resolvedUser).catch(() => null)
          : null;
        const chatId = activeChat?.id ?? this.lastActiveChatByUser.get(resolvedUser || '__owner__') ?? '';
        const ownerUser = this.resolveUserId(resolvedUser, chatId);
        const snap = await this.storage.loadCampaign(ownerUser, chatId);
        const directorPrefix = p.councilMember
          ? `[Council Director ${p.councilMember.name} (${p.councilMember.role || 'Analyst'})]\n`
          : '';

        if (p.toolName === 'lumi_stats_inspect') {
          const continuity = this.storage.getCompiledContinuity(
            ownerUser,
            chatId,
            snap.revision,
            snap.state,
            snap.template,
            4000,
          ).text;
          return `${directorPrefix}${continuity || 'No stats calibrated yet for this chat.'}`;
        }

        if (p.toolName === 'lumi_stats_check') {
          const statKey = String(p.args?.statKey ?? '').trim();
          const difficulty = Number(p.args?.difficulty ?? 50);
          const schema = snap.template.stats.find(
            s => s.id === statKey || slugifyKey(s.label, '') === slugifyKey(statKey, ''),
          );
          const firstPresent = Object.values(snap.state.characters).find(c => c.present);
          const rawVal =
            snap.state.stats[statKey]?.value ??
            (schema ? firstPresent?.meters[schema.id]?.value : undefined) ??
            50;
          const numVal = typeof rawVal === 'number' ? rawVal : 50;
          const anchor = schema ? resolveAnchorLabel(schema.anchors, numVal) : String(numVal);
          const passed = numVal >= difficulty;
          return `${directorPrefix}Stat Check [${schema?.label ?? statKey}]: Current=${numVal} (${anchor}) vs Difficulty=${difficulty} → ${passed ? 'SUCCESS' : 'COMPLICATION / PARTIAL'}.`;
        }

        return 'Unknown Lumi Stats tool';
      }),
    );

    try {
      this.api.commands.register([
        {
          id: 'lumi-sync-turn',
          label: 'Lumi Stats: Sync & Calibrate Current Turn',
          description: 'Calibrate or update all scene and character stats from recent chat messages',
          keywords: ['lumi', 'stats', 'sync', 'calibrate', 'tracker'],
          scope: 'chat-idle',
        },
        {
          id: 'lumi-undo-turn',
          label: 'Lumi Stats: Undo Latest Stat Change',
          description: 'Revert Lumi Stats to the previous turn checkpoint',
          keywords: ['lumi', 'stats', 'undo', 'rollback'],
          scope: 'chat',
        },
        {
          id: 'lumi-open-drawer',
          label: 'Lumi Stats: Open Stats Drawer',
          description: 'Open the Lumi Stats sidebar drawer tab',
          keywords: ['lumi', 'stats', 'drawer', 'dossier', 'map'],
          scope: 'global',
        },
      ]);

      this.disposers.push(
        this.api.commands.onInvoked(async (commandId, ctx) => {
          const ownerUser = this.resolveUserId(
            (ctx as { userId?: string })?.userId,
            ctx.chatId,
          );
          if (commandId === 'lumi-open-drawer') {
            await this.api.ui.openDrawerTab('lumi-stats', ownerUser ? { userId: ownerUser } : undefined);
            return;
          }
          const toastOpts = ownerUser ? ({ userId: ownerUser } as Record<string, unknown>) : undefined;
          if (!ctx.chatId) {
            this.api.toast.warning('Open a chat first to run this Lumi Stats command.', toastOpts);
            return;
          }
          if (commandId === 'lumi-sync-turn') {
            this.api.toast.info('Calibrating Lumi Stats for current turn…', toastOpts);
            await this.tracker.trackTurn(ownerUser, ctx.chatId, { manual: true });
            await this.broadcastSnapshot(ownerUser, ctx.chatId);
            this.api.toast.success('Lumi Stats updated.', toastOpts);
          } else if (commandId === 'lumi-undo-turn') {
            await this.storage.undoLatest(ownerUser, ctx.chatId);
            await this.broadcastSnapshot(ownerUser, ctx.chatId);
            this.api.toast.info('Reverted latest Lumi Stats change.', toastOpts);
          }
        }),
      );

      this.disposers.push(() => this.api.commands.unregister());
    } catch {
      // Ignore if commands API is unavailable
    }

    try {
      this.api.rpcPool?.handle(
        'state.get',
        async () => {
          const ownerUser = this.resolveUserId(undefined);
          const active = this.api.permissions.has('chats')
            ? await (this.api.chats.getActive as (u?: string) => Promise<{ id?: string } | null>)(ownerUser).catch(() => null)
            : null;
          const chatId = active?.id ?? this.lastActiveChatByUser.get(ownerUser || '__owner__') ?? '';
          if (!chatId) return null;
          const resolvedOwner = this.resolveUserId(ownerUser, chatId);
          const snap = await this.storage.loadCampaign(resolvedOwner, chatId);
          return buildChatVariableProjection(snap.state);
        },
        { requires: [] },
      );
      this.disposers.push(() => {
        this.api.rpcPool?.unregister('state.current');
        this.api.rpcPool?.unregister('state.get');
      });
    } catch {
      // Ignore if rpcPool is unavailable
    }

    const getChatId = (p: unknown): string => {
      if (!p || typeof p !== 'object') return '';
      const o = p as Record<string, unknown>;
      const msg = o.message && typeof o.message === 'object' ? (o.message as Record<string, unknown>) : undefined;
      return String(o.chatId ?? o.chat_id ?? msg?.chatId ?? '').trim();
    };
    const getMsgId = (p: unknown): string => {
      if (!p || typeof p !== 'object') return '';
      const o = p as Record<string, unknown>;
      const msg = o.message && typeof o.message === 'object' ? (o.message as Record<string, unknown>) : undefined;
      return String(o.messageId ?? o.message_id ?? msg?.id ?? '').trim();
    };

    this.disposers.push(
      this.api.on('CHARACTER_EDITED', () => {
        invalidateGroundingCache();
      }),
    );

    this.disposers.push(
      this.api.on('PERSONA_CHANGED', () => {
        invalidateGroundingCache();
      }),
    );

    this.disposers.push(
      this.api.on('CHAT_SWITCHED', (p, userId) => {
        const chatId = getChatId(p);
        invalidateGroundingCache(chatId || undefined);
        if (chatId) {
          this.rememberActiveChat(userId, chatId);
          const resolvedUser = this.resolveUserId(userId, chatId);
          void this.rehydrateChatMessages(resolvedUser, chatId).then(async () => {
            const snap = await this.storage.loadCampaign(resolvedUser, chatId);
            await this.storage.syncNativeLumiverseSurfaces(
              resolvedUser,
              chatId,
              snap.revision,
              snap.state,
              snap.template,
              false,
            );
            await this.broadcastSnapshot(resolvedUser, chatId);
          });
        } else {
          this.clearActiveChat(userId);
          const resolvedUser = this.resolveUserId(userId);
          void this.broadcastSnapshot(resolvedUser, 'sandbox');
        }
      }),
    );

    this.disposers.push(
      this.api.on('CHAT_CHANGED', p => {
        const chatId = getChatId(p);
        if (chatId) this.renderCache.invalidateChat(chatId);
      }),
    );

    let disposeGenEvents: Array<() => void> = [];
    const syncGenerationSubscriptions = () => {
      for (const fn of disposeGenEvents.splice(0)) fn();
      if (!this.api.permissions.has('generation')) return;

      disposeGenEvents.push(
        this.api.on('GENERATION_STARTED', (p, userId) => {
          const ev = (p ?? {}) as unknown as Record<string, unknown>;
          const genType = String(ev.generationType ?? 'normal').toLowerCase();
          if (genType === 'quiet' || genType === 'raw' || genType === 'impersonate') return;
          const chatId = getChatId(p);
          const genId = String(ev.generationId ?? '');
          if (!chatId || !genId) return;

          this.rememberActiveChat(userId, chatId);
          const resolvedUser = this.resolveUserId(userId, chatId);
          this.activeGenerations.set(`${resolvedUser ?? '__owner__'}:${chatId}`, genId);
          this.tracker.cancelInFlight(resolvedUser, chatId);

          if (genType === 'regenerate' || genType === 'swipe') {
            const targetMsgId = String(ev.targetMessageId ?? '').trim();
            void this.storage
              .queue(resolvedUser, chatId, async () => {
                const snap = await this.storage.loadCampaign(resolvedUser, chatId);
                const rollbackId = targetMsgId || snap.bindings.at(-1)?.messageId;
                if (!rollbackId) return null;
                return this.storage.rollbackBeforeMessage(resolvedUser, chatId, {
                  targetMessageId: rollbackId,
                });
              })
              .then(rolled => {
                if (rolled) return this.broadcastSnapshot(resolvedUser, chatId);
              })
              .catch(() => undefined);
          }
        }),
      );

      disposeGenEvents.push(
        this.api.on('GENERATION_ENDED', (p, userId) => {
          const chatId = getChatId(p);
          if (!chatId) return;
          const ev = (p ?? {}) as unknown as Record<string, unknown>;
          const genType = String(ev.generationType ?? 'normal').toLowerCase();
          if (genType === 'quiet' || genType === 'raw' || genType === 'impersonate') return;
          const resolvedUser = this.resolveUserId(userId, chatId);
          this.activeGenerations.delete(`${resolvedUser ?? '__owner__'}:${chatId}`);
          if (ev.error) return;
          const msgId = getMsgId(p);

          void (async () => {
            const settings = await this.storage.loadSettings(resolvedUser);
            if (!settings.autoTrack) return;
            const snap = await this.tracker.trackTurn(resolvedUser, chatId, {
              targetMessageId: msgId || undefined,
              inlineTagContent:
                typeof ev.content === 'string' && extractInlineStatsTag(ev.content)
                  ? ev.content
                  : undefined,
            });
            if (snap) await this.broadcastSnapshot(resolvedUser, chatId);
          })().catch(err => {
            if (isAbortError(err)) return;
            this.emitToUser(resolvedUser, chatId, {
              type: 'error',
              message: err instanceof Error ? err.message : String(err),
            });
          });
        }),
      );

      disposeGenEvents.push(
        this.api.on('GENERATION_STOPPED', (p, userId) => {
          const chatId = getChatId(p);
          if (chatId) {
            const resolvedUser = this.resolveUserId(userId, chatId);
            this.activeGenerations.delete(`${resolvedUser ?? '__owner__'}:${chatId}`);
          }
        }),
      );
    };
    syncGenerationSubscriptions();

    this.disposers.push(
      this.api.on('MESSAGE_SENT', (p, userId) => {
        const chatId = getChatId(p);
        if (!chatId) return;
        this.rememberActiveChat(userId, chatId);
        const resolvedUser = this.resolveUserId(userId, chatId);
        const o = (p ?? {}) as Record<string, unknown>;
        const msg = o.message && typeof o.message === 'object' ? (o.message as Record<string, unknown>) : o;
        const content = typeof msg.content === 'string' ? msg.content : '';
        if (extractInlineStatsTag(content)) {
          void this.rehydrateChatMessages(resolvedUser, chatId).then(() =>
            this.broadcastSnapshot(resolvedUser, chatId),
          );
        }
      }),
    );

    for (const evName of ['MESSAGE_EDITED', 'MESSAGE_SWIPED', 'SWIPE_EDITED', 'MESSAGE_DELETED'] as const) {
      this.disposers.push(
        this.api.on(evName, (p, userId) => {
          const chatId = getChatId(p);
          if (!chatId) return;
          this.renderCache.invalidateChat(chatId);
          const msgId = getMsgId(p);
          if (evName === 'MESSAGE_EDITED' && msgId && this.selfEditedMessages.has(`${chatId}:${msgId}`)) {
            this.selfEditedMessages.delete(`${chatId}:${msgId}`);
            return;
          }
          const resolvedUser = this.resolveUserId(userId, chatId);
          if (this.activeGenerations.has(`${resolvedUser ?? '__owner__'}:${chatId}`) && evName !== 'MESSAGE_DELETED') {
            return;
          }
          void this.tracker
            .reconcileMessageChange(resolvedUser, chatId, msgId || undefined)
            .then(snap => {
              if (snap) return this.broadcastSnapshot(resolvedUser, chatId);
            })
            .catch(() => undefined);
        }),
      );
    }

    if (this.api.permissions.onChanged) {
      this.disposers.push(
        this.api.permissions.onChanged(detail => {
          if (detail.permission === 'interceptor') {
            disposeInterceptor?.();
            disposeInterceptor = undefined;
            if (detail.granted) ensureInterceptor();
          }
          if (detail.permission === 'generation') {
            syncGenerationSubscriptions();
            if (!detail.granted) {
              disposeWorldInfo?.();
              disposeWorldInfo = undefined;
              worldInfoRegistered = false;
            } else {
              ensureWorldInfoInterceptor();
            }
          }
          if (detail.permission === 'tools') {
            syncToolsRegistration();
          }
          if (detail.permission === 'chat_mutation') {
            if (!detail.granted) {
              disposeContentProc?.();
              disposeContentProc = undefined;
              contentProcRegistered = false;
            } else {
              ensureContentProcessor();
            }
          }
          if (detail.permission === 'regex_scripts' && detail.granted) {
            void this.syncObfuscatorDisplayRegex(undefined);
          }
        }),
      );
    }

    this.api.log.info('Lumi Stats backend initialized.');
    return () => {
      this.stopped = true;
      disposeInterceptor?.();
      disposeContentProc?.();
      disposeWorldInfo?.();
      for (const fn of disposeGenEvents.splice(0)) fn();
      for (const fn of this.disposers.splice(0)) fn();
    };
  }

  /**
   * Syncs extension-owned Lumiverse Display Regex scripts (`target: "display"`) when
   * `regex_scripts` permission is granted so `1`-obfuscated words restore natively in chat UI.
   */
  private async syncObfuscatorDisplayRegex(userId: string | undefined): Promise<void> {
    if (!this.api.permissions.has('regex_scripts') || !this.api.regex_scripts) return;
    const resolvedUser = this.resolveUserId(userId);
    try {
      const settings = await this.storage.loadSettings(resolvedUser);
      const { data: existingScripts } = await this.api.regex_scripts.list({
        scope: 'global',
        target: 'display',
        limit: 200,
        ...(resolvedUser ? { userId: resolvedUser } : {}),
      });
      const owned = existingScripts.filter(
        s => s.can_mutate && (s.folder === 'Lumi Stats' || s.script_id.startsWith('lumi_stats_obf_')),
      );

      const shouldRestore =
        Boolean(settings.sensitiveObfuscatorEnabled) &&
        settings.restoreObfuscatedOnRender !== false;
      const words = shouldRestore
        ? normalizeSensitiveWordsList(settings.sensitiveWords).slice(0, 40)
        : [];
      const useOne = settings.obfuscateVowelsWithOne !== false;

      const desiredByScriptId = new Map<string, ReturnType<typeof buildWordRestoreRegexSpec>>();
      for (const w of words) {
        const spec = buildWordRestoreRegexSpec(w, useOne);
        if (!spec) continue;
        const scriptId = `lumi_stats_obf_${slugifyKey(w, 'word')}`;
        desiredByScriptId.set(scriptId, spec);
      }

      const ownedByScriptId = new Map(owned.map(s => [s.script_id, s]));

      for (const existing of owned) {
        if (!desiredByScriptId.has(existing.script_id)) {
          await this.api.regex_scripts.delete(existing.id).catch(() => undefined);
        }
      }

      for (const [scriptId, spec] of desiredByScriptId.entries()) {
        if (!spec) continue;
        const prev = ownedByScriptId.get(scriptId);
        const payload = {
          name: `Lumi Stats: Restore "${spec.word}"`,
          find_regex: spec.findRegex,
          replace_string: spec.replaceString,
          flags: spec.flags,
          placement: ['ai_output', 'user_input'] as Array<'ai_output' | 'user_input'>,
          scope: 'global' as const,
          target: 'display' as const,
          substitute_macros: 'none' as const,
          disabled: false,
          folder: 'Lumi Stats',
          description: `Restores obfuscated "${spec.word}" in chat display without changing stored history.`,
        };
        if (prev) {
          const changed =
            prev.find_regex !== payload.find_regex ||
            prev.replace_string !== payload.replace_string ||
            prev.flags !== payload.flags ||
            prev.disabled !== false;
          if (changed) {
            await this.api.regex_scripts.update(prev.id, payload).catch(() => undefined);
          }
        } else {
          await this.api.regex_scripts
            .create({ ...payload, script_id: scriptId })
            .catch(() => undefined);
        }
      }
    } catch {
      // Graceful no-op if regex_scripts permission was revoked mid-flight
    }
  }
}
