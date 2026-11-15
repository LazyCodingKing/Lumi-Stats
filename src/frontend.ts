import type { SpindleFrontendContext } from 'lumiverse-spindle-types';
import { fnv1a32 } from './shared/prose-cleaner';
import {
  ComponentScope,
  LumiFrontendController,
  acquireLumiStatsStyles,
  btn,
  el,
  openQuickTemplateModal,
  preserveScrollAndFocus,
} from './frontend/controller';
import {
  openCharacterDossierModal,
  renderCastDossierSurface,
} from './frontend/surfaces/CastDossier';
import {
  InlineRibbonManager,
  renderSceneHeaderChips,
} from './frontend/surfaces/InlineRibbon';
import { openSettingsStudioModal } from './frontend/surfaces/SettingsStudio';
import { renderSpatialMapSurface } from './frontend/surfaces/SpatialMap';
import {
  openSceneBannerModal,
  renderCorePlayerAndSceneCards,
  renderStatGridSurface,
} from './frontend/surfaces/StatGrid';
import { LumiVnStage, openVoiceAssignmentModal } from './frontend/surfaces/VnStage';
import {
  renderCopilotSurface,
  renderWorldSurface,
} from './frontend/surfaces/WorldAndCopilot';
import { mountFloatingWidget } from './frontend/widget-mount';

export function mountLumiStats(ctx: SpindleFrontendContext): () => void {
  ctx.deferReady?.();

  const cleanup: Array<() => void> = [];
  cleanup.push(acquireLumiStatsStyles(ctx));

  const ctrl = new LumiFrontendController(ctx);
  cleanup.push(() => ctrl.destroy());

  const vnStage = new LumiVnStage(ctrl);
  cleanup.push(() => vnStage.destroy());
  ctrl.onToggleVnStage = () => {
    if (ctrl.vnStageOpen) vnStage.close();
    else vnStage.open();
  };

  const openStudio = () => openSettingsStudioModal(ctrl);

  const inlineManager = new InlineRibbonManager(ctrl);
  cleanup.push(() => inlineManager.clear());

  const stopWidget = mountFloatingWidget(ctx, ctrl, openStudio);
  if (stopWidget) cleanup.push(stopWidget);

  // 1. Register Main Drawer Tab
  const drawerScope = new ComponentScope();
  cleanup.push(() => drawerScope.clear());

  const tab = ctx.ui.registerDrawerTab({
    id: 'lumi-stats',
    title: 'Lumi Stats',
    shortName: 'Stats',
    description: 'Two-phase grounded roleplay stats, character dossiers, spatial map & Copilot',
    keywords: ['lumi', 'stats', 'tracker', 'dossier', 'meters', 'map'],
  });
  cleanup.push(() => tab.destroy());

  const root = el('div', 'ls-root');
  const head = el('header', 'ls-drawer-head');
  const nav = el('nav', 'ls-drawer-nav');
  const body = el('main', 'ls-drawer-body');
  const statusBar = el('div', 'ls-status-bar');
  statusBar.setAttribute('role', 'status');
  statusBar.setAttribute('aria-live', 'polite');

  root.append(head, nav, body, statusBar);
  tab.root.style.cssText +=
    ';display:flex;flex-direction:column;height:100%;max-height:100%;min-height:0;overflow:hidden;';
  tab.root.append(root);

  let drawerDirty = false;

  const renderDrawer = (force = false) => {
    if (!ctrl.isGenerationStreaming) {
      inlineManager.sync(
        actorId => openCharacterDossierModal(ctrl, actorId),
        openStudio,
      );
    }

    if (!force && !ctrl.isDrawerTabVisible) {
      drawerDirty = true;
      return;
    }

    preserveScrollAndFocus(
      root,
      () => {
        drawerDirty = false;
        drawerScope.clear();
        const { state } = ctrl.snapshot;

        head.replaceChildren();
        const brand = el('div', 'ls-brand');
        brand.append(el('span', 'ls-brand-mark', 'L'), document.createTextNode('Lumi Stats'));

        const headBtns = el('div', 'ls-row');
        headBtns.append(
          btn('↻ Sync', () => void ctrl.request('track:manual'), 'ls-btn-sm', 'Calibrate & update stats now'),
          btn('🎬 VN Stage', () => ctrl.toggleVnStage(), 'ls-btn-sm', 'Launch 2D Visual Novel Stage'),
          btn('🔊 Voices', () => openVoiceAssignmentModal(ctrl), 'ls-btn-sm', 'Configure Cast & Narrator TTS Voices'),
          btn(
            `${ctrl.snapshot.template.icon || '🎭'} Template`,
            () => openQuickTemplateModal(ctrl, openStudio),
            'ls-btn-sm',
            'Switch or create a Lumi Stats template',
          ),
          btn('⚙️ Studio', openStudio, 'ls-btn-sm ls-btn-primary'),
        );
        head.append(brand, headBtns);

        nav.replaceChildren();
        for (const [id, label] of [
          ['Stats', '📊 Stats'],
          ['Cast', `👥 Cast (${Object.keys(state.characters).length})`],
          ['Map', `🗺️ Atlas (${Object.keys(state.places).length})`],
          ['World', '🌍 World'],
          ['Copilot', '🤖 Copilot'],
        ] as const) {
          const b = btn(label, () => {
            ctrl.activeDrawerTab = id;
            renderDrawer(true);
          }, 'ls-btn-sm');
          if (ctrl.activeDrawerTab === id) b.setAttribute('aria-current', 'page');
          nav.append(b);
        }

        body.replaceChildren();
        if (!ctrl.chatId) {
          const empty = el('div', 'ls-card');
          empty.append(
            el('strong', '', 'Open a chat to begin'),
            el('p', 'ls-muted', 'Lumi Stats calibrates initial baselines from the Character Card, Persona, and Opening Message, and tracks turn-by-turn changes automatically.'),
          );
          body.append(empty);
        } else if (ctrl.activeDrawerTab === 'Stats') {
          const sceneCard = el('section', 'ls-card');
          const topRow = el('div', 'ls-row-between');
          topRow.append(
            renderSceneHeaderChips(ctrl),
            btn('✏️ Edit Scene', () => openSceneBannerModal(ctrl), 'ls-btn-sm'),
          );
          sceneCard.append(topRow);
          if (state.scene.beatSummary) {
            sceneCard.append(el('p', 'ls-muted', state.scene.beatSummary));
          }
          body.append(sceneCard);

          const playerStatsCard = el('section', 'ls-card');
          const corePlayerEl = renderCorePlayerAndSceneCards(ctrl, 'drawer');
          if (corePlayerEl.childElementCount > 0) {
            playerStatsCard.append(corePlayerEl);
          }
          playerStatsCard.append(renderStatGridSurface(ctrl, ['player'], drawerScope, true));
          body.append(playerStatsCard);
        } else if (ctrl.activeDrawerTab === 'Cast') {
          body.append(renderCastDossierSurface(ctrl, drawerScope));
        } else if (ctrl.activeDrawerTab === 'Map') {
          body.append(renderSpatialMapSurface(ctrl));
        } else if (ctrl.activeDrawerTab === 'World') {
          body.append(renderWorldSurface(ctrl, drawerScope));
        } else if (ctrl.activeDrawerTab === 'Copilot') {
          body.append(renderCopilotSurface(ctrl));
        }

        statusBar.textContent = ctrl.statusText;
        statusBar.dataset.error = String(ctrl.statusError);
      },
      {
        deferIfTyping: !force,
        onDeferredFlush: () => renderDrawer(true),
      },
    );
  };

  // Track drawer visibility & virtual keyboard insets (`ui-events-helper.md`)
  if (typeof tab.onActivate === 'function') {
    cleanup.push(
      tab.onActivate(() => {
        ctrl.isDrawerTabVisible = true;
        if (drawerDirty) renderDrawer(true);
      }),
    );
  }

  if (ctx.ui?.events) {
    if (typeof ctx.ui.events.onDrawerChange === 'function') {
      cleanup.push(
        ctx.ui.events.onDrawerChange(({ open, tabId }) => {
          const isMine = Boolean(open && tabId && (tabId === tab.tabId || tabId.endsWith('lumi-stats')));
          ctrl.isDrawerTabVisible = isMine;
          if (isMine && drawerDirty) {
            renderDrawer(true);
          }
        }),
      );
    }

    if (typeof ctx.ui.events.onKeyboardChange === 'function') {
      const applyKeyboardInset = (insetBottom: number) => {
        const px = `${Math.max(0, Math.round(insetBottom || 0))}px`;
        root.style.setProperty('--ls-kb-inset', px);
        document.documentElement.style.setProperty('--ls-kb-inset', px);
      };
      try {
        const initialKb = ctx.ui.events.getKeyboardState?.();
        if (initialKb) applyKeyboardInset(initialKb.insetBottom);
      } catch {
        // Ignore
      }
      cleanup.push(
        ctx.ui.events.onKeyboardChange(kbState => {
          applyKeyboardInset(kbState.visible ? kbState.insetBottom : 0);
        }),
      );
    }
  }

  let lastBusyState = ctrl.busy;
  cleanup.push(
    ctrl.subscribe(() => {
      renderDrawer(false);
      if (ctrl.vnStageOpen) {
        vnStage.sync();
      }
    }),
  );
  cleanup.push(
    ctrl.subscribeStatus(() => {
      statusBar.textContent = ctrl.statusText;
      statusBar.dataset.error = String(ctrl.statusError);
      if (ctrl.busy !== lastBusyState) {
        lastBusyState = ctrl.busy;
        if (!ctrl.isGenerationStreaming) {
          inlineManager.sync(
            actorId => openCharacterDossierModal(ctrl, actorId),
            openStudio,
          );
        }
      }
    }),
  );

  // 2. Register Input Bar Extras Actions (Free-tier)
  if (typeof ctx.ui?.registerInputBarAction === 'function') {
    try {
      const syncAction = ctx.ui.registerInputBarAction({
        id: 'lumi-stats-sync',
        label: '↻ Calibrate / Sync Lumi Stats',
        enabled: true,
      });
      const unsubSync = syncAction.onClick(() => {
        void ctrl.request('track:manual');
      });
      const studioAction = ctx.ui.registerInputBarAction({
        id: 'lumi-stats-studio',
        label: '⚙️ Open Lumi Stats Studio',
        enabled: true,
      });
      const unsubStudio = studioAction.onClick(openStudio);
      const vnAction = ctx.ui.registerInputBarAction({
        id: 'lumi-stats-vn-stage',
        label: '🎬 Toggle Lumi 2D Visual Novel Stage',
        enabled: true,
      });
      const unsubVn = vnAction.onClick(() => ctrl.toggleVnStage());
      cleanup.push(() => {
        unsubSync();
        unsubStudio();
        unsubVn();
        syncAction.destroy();
        studioAction.destroy();
        vnAction.destroy();
      });
    } catch {
      // Ignore if capacity reached
    }
  }

  // 3. Register Character Editor Tab (when `characters` permission is granted)
  if (typeof ctx.ui?.registerCharacterEditorTab === 'function' && ctx.ui.characterEditor) {
    try {
      const charTab = ctx.ui.registerCharacterEditorTab({
        id: 'lumi-stats-card-binding',
        title: 'Lumi Stats',
      });
      charTab.root.classList.add('ls-root');
      charTab.root.style.padding = '14px';

      const renderCharEditorTab = () => {
        const state = ctx.ui.characterEditor.getState();
        charTab.root.replaceChildren();
        if (!state.open || !state.characterId) return;
        const bound = state.extensions?.lumi_stats as { template?: { name?: string } } | undefined;
        const card = el('div', 'ls-card');
        card.append(
          el('h3', '', '📊 Character-Bound Lumi Stats Template'),
          el(
            'p',
            'ls-muted',
            bound?.template?.name
              ? `Currently bound template: "${bound.template.name}". New chats with this character will automatically load this schema.`
              : 'No template bound to this character card yet.',
          ),
        );
        const btnRow = el('div', 'ls-row');
        btnRow.append(
          btn('📌 Bind Current Active Template to Character', () => {
            ctx.ui.characterEditor.updateExtensions(
              ext => ({
                ...ext,
                lumi_stats: {
                  template: ctrl.snapshot.template,
                },
              }),
              { immediate: true },
            );
          }, 'ls-btn-sm ls-btn-primary'),
        );
        if (bound?.template) {
          btnRow.append(
            btn('🗑️ Unbind Template', () => {
              ctx.ui.characterEditor.updateExtensions(
                ext => {
                  const next = { ...ext };
                  delete next.lumi_stats;
                  return next;
                },
                { immediate: true },
              );
            }, 'ls-btn-sm ls-btn-danger'),
          );
        }
        card.append(btnRow);
        charTab.root.append(card);
      };

      const unsubCharEditor = ctx.ui.characterEditor.onChange(renderCharEditorTab);
      renderCharEditorTab();
      cleanup.push(() => {
        unsubCharEditor();
        charTab.destroy();
      });
    } catch {
      // Optional when `characters` permission is not granted
    }
  }

  // 4. Register Preset Editor Tab (when `presets` permission is granted)
  if (typeof ctx.ui?.registerPresetEditorTab === 'function' && ctx.ui.presetEditor?.extension) {
    try {
      const presetTab = ctx.ui.registerPresetEditorTab({
        id: 'lumi-stats-preset',
        title: 'Lumi Stats',
      });
      presetTab.root.classList.add('ls-root');
      presetTab.root.style.padding = '14px';

      const renderPresetTab = () => {
        const ext = ctx.ui.presetEditor.extension;
        const st = ext.getState();
        presetTab.root.replaceChildren();
        const card = el('div', 'ls-card');
        card.append(
          el('h3', '', '✨ Lumi Stats Preset Macros & Variable Paths'),
          el('p', 'ls-muted', 'Use these zero-RPC macros anywhere inside your Loom Preset blocks:'),
          el('pre', 'ls-stat-cell', [
            '{{lumi_stats}}                                    — Full grounded continuity block',
            '{{lumi_header}}                                   — [ 🕰️ Time | 📅 Date | 📍 Location | 🌦️ Weather ]',
            '{{lumi_stat::composure}}                          — Single stat or actor.meter value',
            '{{getchatvarkey::lumi_stats::stats.composure}}    — Native JSON chat variable read',
            '{{getchatvarkey::lumi_stats::actors.rem.meters.loyalty}}',
          ].join('\n')),
        );
        if (st.presetId) {
          card.append(
            btn('📌 Save Default Template ID to Preset Metadata', () => {
              ext.updateMetadata(
                cur => ({
                  ...(cur && typeof cur === 'object' ? cur : {}),
                  defaultTemplateId: ctrl.snapshot.template.id,
                }),
                { immediate: true },
              );
            }, 'ls-btn-sm ls-btn-primary'),
          );
        }
        presetTab.root.append(card);
      };

      const unsubPreset = ctx.ui.presetEditor.extension.onChange(renderPresetTab);
      renderPresetTab();
      cleanup.push(() => {
        unsubPreset();
        presetTab.destroy();
      });
    } catch {
      // Optional when `presets` permission is not granted
    }
  }

  // 5. Chat Lifecycle, Generation Streaming Guards & Tag Interceptors
  cleanup.push(
    ctx.events.on('CHAT_SWITCHED', (payload: unknown) => {
      const obj = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};
      const nextChatId = typeof obj.chatId === 'string' ? obj.chatId : null;
      ctrl.isGenerationStreaming = false;
      inlineManager.clear();
      void ctrl.refreshActiveChat(nextChatId);
    }),
  );

  cleanup.push(
    ctx.events.on('GENERATION_STARTED', (payload: unknown) => {
      const obj = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};
      const msgChatId = typeof obj.chatId === 'string' ? obj.chatId : null;
      if (ctrl.isActivityForActiveChat(msgChatId)) {
        ctrl.isGenerationStreaming = true;
      }
    }),
  );

  for (const endEvent of ['GENERATION_ENDED', 'GENERATION_STOPPED'] as const) {
    cleanup.push(
      ctx.events.on(endEvent, (payload: unknown) => {
        const obj = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};
        const msgChatId = typeof obj.chatId === 'string' ? obj.chatId : null;
        if (!ctrl.isActivityForActiveChat(msgChatId)) return;
        ctrl.isGenerationStreaming = false;
        if (ctrl.vnStageOpen) {
          void ctrl.refreshActiveChat(ctrl.chatId);
        }
        inlineManager.sync(
          actorId => openCharacterDossierModal(ctrl, actorId),
          openStudio,
        );
      }),
    );
  }

  cleanup.push(
    ctx.events.on('CHARACTER_MESSAGE_RENDERED', (payload: unknown) => {
      const obj = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};
      const msgChatId = typeof obj.chatId === 'string' ? obj.chatId : null;
      if (!ctrl.isActivityForActiveChat(msgChatId) || ctrl.isGenerationStreaming) return;
      inlineManager.sync(
        actorId => openCharacterDossierModal(ctrl, actorId),
        openStudio,
      );
    }),
  );

  if (ctx.messages?.registerTagInterceptor) {
    const seenInterceptSigs = new Set<string>();
    for (const tagName of ['lumi-stats', 'lumi_stats', 'lumi-tracker', 'worldweave', 'tracker'] as const) {
      cleanup.push(
        ctx.messages.registerTagInterceptor({ tagName, removeFromMessage: true }, payload => {
          if (payload.isStreaming) return;
          const payloadChatId = payload.chatId || null;
          if (!ctrl.isActivityForActiveChat(payloadChatId)) return;
          if (ctrl.hydratingChat) return;
          const latestId = ctx.messages.getLatestMessageId();
          if (!payload.messageId || !latestId || payload.messageId !== latestId) return;

          const content = typeof payload.content === 'string' ? payload.content.trim() : '';
          if (!content) return;
          const sig = `${payloadChatId ?? ctrl.chatId}:${payload.messageId}:${fnv1a32(content)}`;
          if (seenInterceptSigs.has(sig)) return;
          if (seenInterceptSigs.size >= 60) {
            const oldest = seenInterceptSigs.values().next().value;
            if (oldest !== undefined) seenInterceptSigs.delete(oldest);
          }
          seenInterceptSigs.add(sig);
          void ctrl.request('tag:intercepted', {
            messageId: payload.messageId,
            content,
          });
        }),
      );
    }
  }

  renderDrawer(true);
  ctx.ready?.();
  void ctrl.refreshActiveChat();

  return () => {
    for (const fn of cleanup.reverse()) fn();
    ctx.dom.cleanup();
  };
}

export function setup(ctx: SpindleFrontendContext): () => void {
  return mountLumiStats(ctx);
}
