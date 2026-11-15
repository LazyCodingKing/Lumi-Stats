import { formatSceneBanner } from '../../shared/formula';
import {
  isDossierFieldEnabled,
  resolveCharacterFieldValue,
} from '../../shared/prompt-compiler';
import {
  btn,
  el,
  iconBtn,
  openQuickTemplateModal,
  type LumiFrontendController,
} from '../controller';
import { openScenePillEditorModal } from './BuiltinTrackerModals';
import { renderSurfaceCastRoster } from './CastDossier';
import { buildGameStatusPillStrip } from './FloatingHud';
import { renderRelationshipWebSurface } from './RelationshipWeb';
import { renderSpatialMapSurface } from './SpatialMap';
import {
  interpolateBannerTemplate,
  mountSanitizedHtml,
  openSceneBannerModal,
  renderStatsForSurfaceTab,
} from './StatGrid';

export function renderSceneHeaderChips(ctrl: LumiFrontendController): HTMLElement {
  const { state, template, deltas } = ctrl.snapshot;
  const show = template.theme.showSceneChips;
  const banner = formatSceneBanner(state);
  const row = el('div', 'ls-row');

  if (show.time) row.append(el('span', 'ls-chip', `🕰️ ${banner.time}`));
  if (show.date) row.append(el('span', 'ls-chip', `📅 ${banner.date}`));
  if (show.location) row.append(el('span', 'ls-chip ls-chip-accent', `📍 ${banner.location}`));
  if (show.weather) row.append(el('span', 'ls-chip', `🌦️ ${banner.weather}`));

  if (template.coreTrackers?.trackPlayerAttire !== false && state.player.attire) {
    row.append(el('span', 'ls-chip', `👕 You: ${state.player.attire.slice(0, 28)}`));
  }

  if (show.cast) {
    const showDem = isDossierFieldEnabled(template, 'demeanor');
    for (const actor of Object.values(state.characters).filter(c => c.present).slice(0, 4)) {
      const charDeltas = deltas.characterDeltas[actor.id] ?? {};
      const firstShift = Object.values(charDeltas).find(v => v !== 0);
      const demVal = showDem ? resolveCharacterFieldValue(actor, 'demeanor') : '';
      const chip = el(
        'span',
        'ls-chip',
        `👤 ${actor.name}${demVal ? ` · ${demVal}` : ''}`,
      );
      if (firstShift) {
        chip.append(
          el(
            'span',
            `ls-delta ${firstShift > 0 ? 'is-pos' : 'is-neg'}`,
            firstShift > 0 ? `+${firstShift}` : String(firstShift),
          ),
        );
      }
      row.append(chip);
    }
  }

  if (show.pinnedStats) {
    for (const schema of template.stats.filter(
      s => s.enabled && (s.pinnedToHeader || s.showIn?.pinnedHeader),
    )) {
      if (schema.scope === 'character') {
        const firstPresent = Object.values(state.characters).find(c => c.present);
        const meter = firstPresent?.meters[schema.id];
        if (!meter?.calibrated) continue;
        const d = (firstPresent ? deltas.characterDeltas[firstPresent.id]?.[schema.id] : 0) ?? 0;
        const chip = el(
          'span',
          'ls-chip ls-chip-accent',
          `${schema.icon} ${firstPresent!.name} ${schema.label}: ${String(meter.value)}`,
        );
        if (d !== 0) {
          chip.append(el('span', `ls-delta ${d > 0 ? 'is-pos' : 'is-neg'}`, d > 0 ? `+${d}` : String(d)));
        }
        row.append(chip);
      } else {
        const runtime = state.stats[schema.id];
        if (!runtime?.calibrated) continue;
        const d = deltas.statDeltas[schema.id] ?? 0;
        const chip = el('span', 'ls-chip ls-chip-accent', `${schema.icon} ${schema.label}: ${String(runtime.value)}`);
        if (d !== 0) {
          chip.append(el('span', `ls-delta ${d > 0 ? 'is-pos' : 'is-neg'}`, d > 0 ? `+${d}` : String(d)));
        }
        row.append(chip);
      }
    }
  }

  return row;
}

export function renderInlineRibbonCard(
  ctrl: LumiFrontendController,
  onOpenDossier: (actorId: string) => void,
  onOpenStudio: () => void,
): HTMLElement {
  const { state, template } = ctrl.snapshot;
  const host = el('div', 'ls-inline-host');
  ctrl.stampThemeOnElement(host);
  const card = el('div', 'ls-inline-card');

  if (!ctrl.inlineExpanded) {
    const pillBar = el('div', 'ls-inline-pill-bar');
    pillBar.addEventListener('click', () => {
      ctrl.inlineExpanded = true;
      ctrl.emitChange();
    });
    const strip = buildGameStatusPillStrip(ctrl);
    if (strip.childElementCount === 0) {
      strip.append(
        el(
          'span',
          'ls-chip ls-chip-accent',
          `${template.icon || '✨'} ${state.title || template.name || 'Lumi Stats'}`,
        ),
      );
    }
    pillBar.append(
      strip,
      iconBtn(
        'chevronDown',
        () => {
          ctrl.inlineExpanded = true;
          ctrl.emitChange();
        },
        { label: 'Expand', className: 'ls-btn-sm ls-btn-primary', title: 'Expand Inline Ribbon' },
      ),
    );
    card.append(pillBar);
    host.append(card);
    return host;
  }

  if (template.surfaces.customInlineHtml) {
    const customBanner = el('div', 'ls-card');
    card.append(customBanner);
    mountSanitizedHtml(
      customBanner,
      interpolateBannerTemplate(template.surfaces.customInlineHtml, state),
      ctrl.ctx,
    );
  }

  const enabledTabs = [...template.surfaces.inlineTabs]
    .filter(t => t.enabled && (t.kind !== 'web' || template.surfaces.showRelationshipWeb !== false))
    .sort((a, b) => a.order - b.order);
  const activeTab =
    enabledTabs.find(t => t.id === ctrl.activeInlineTab) ??
    enabledTabs[0] ?? {
      id: 'stats',
      label: 'Stats',
      icon: '📊',
      kind: 'stats' as const,
      enabled: true,
      order: 0,
    };

  const topBar = el('div', 'ls-row-between');
  const leftCluster = el('div', 'ls-row');
  if (enabledTabs.length > 1) {
    for (const tab of enabledTabs) {
      const b = btn(`${tab.icon} ${tab.label}`, () => {
        ctrl.activeInlineTab = tab.id;
        ctrl.emitChange();
      }, 'ls-btn-sm');
      if (tab.id === activeTab.id) b.setAttribute('aria-current', 'page');
      leftCluster.append(b);
    }
  } else {
    leftCluster.append(renderSceneHeaderChips(ctrl));
  }

  const openInlineMore = async (e: MouseEvent) => {
    if (typeof ctrl.ctx.ui?.showContextMenu !== 'function') {
      openQuickTemplateModal(ctrl, onOpenStudio);
      return;
    }
    const { selectedKey } = await ctrl.ctx.ui.showContextMenu({
      position: { x: e.clientX, y: e.clientY },
      items: [
        { key: 'edit_scene', label: 'Edit Scene Values' },
        { key: 'pill_prompts', label: 'Edit Scene Pill Prompts & Chips' },
        { key: 'template', label: `Switch Template & Skin (${template.name})` },
      ],
    });
    if (selectedKey === 'edit_scene') openSceneBannerModal(ctrl);
    else if (selectedKey === 'pill_prompts') openScenePillEditorModal(ctrl);
    else if (selectedKey === 'template') openQuickTemplateModal(ctrl, onOpenStudio);
  };

  const rightCluster = el('div', 'ls-row');
  rightCluster.append(
    iconBtn('stage', () => ctrl.toggleVnStage(), {
      className: 'ls-btn-sm ls-btn-ghost',
      label: 'Stage',
      title: 'Launch 2D Visual Novel Stage',
    }),
    iconBtn('more', e => void openInlineMore(e), {
      className: 'ls-btn-sm ls-btn-icon ls-btn-ghost',
      title: 'Scene Pill, Template & Skin Options',
    }),
    iconBtn('settings', onOpenStudio, {
      className: 'ls-btn-sm ls-btn-icon ls-btn-ghost',
      title: 'Open Settings Studio',
    }),
    iconBtn(
      'chevronUp',
      () => {
        ctrl.inlineExpanded = false;
        ctrl.emitChange();
      },
      { label: 'Collapse', className: 'ls-btn-sm ls-btn-primary', title: 'Collapse Ribbon' },
    ),
  );
  topBar.append(leftCluster, rightCluster);
  card.append(topBar);

  if (activeTab.kind === 'cast') {
    card.append(renderSurfaceCastRoster(ctrl, 'inline', activeTab.id, onOpenDossier));
  } else if (activeTab.kind === 'web') {
    card.append(renderRelationshipWebSurface(ctrl, onOpenDossier));
  } else if (activeTab.kind === 'map') {
    card.append(renderSpatialMapSurface(ctrl));
  } else {
    if (activeTab.customHtml) {
      const box = el('div', 'ls-card');
      card.append(box);
      mountSanitizedHtml(box, interpolateBannerTemplate(activeTab.customHtml, state), ctrl.ctx);
    }
    card.append(renderStatsForSurfaceTab(ctrl, 'inline', activeTab.id));
  }

  host.append(card);
  return host;
}


export class InlineRibbonManager {
  private activeMount:
    | { messageId: string; wrapper: Element; pos: InsertPosition; renderSig: string }
    | undefined;
  private busyMount: { messageId: string; wrapper: Element } | undefined;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private retryAttempts = 0;

  constructor(private ctrl: LumiFrontendController) {}

  private clearRetryTimer(): void {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
  }

  private clearBusyIndicator(): void {
    if (!this.busyMount) return;
    this.ctrl.ctx.dom.uninject(this.busyMount.wrapper);
    this.busyMount = undefined;
  }

  clear(): void {
    this.clearRetryTimer();
    this.retryAttempts = 0;
    this.clearBusyIndicator();
    if (!this.activeMount) return;
    this.ctrl.ctx.dom.uninject(this.activeMount.wrapper);
    this.activeMount = undefined;
  }

  sync(
    onOpenDossier: (actorId: string) => void,
    onOpenStudio: () => void,
  ): void {
    const { state, template, revision } = this.ctrl.snapshot;
    if (template.theme.placement === 'floating_only') {
      this.clear();
      return;
    }

    const mountedList = this.ctrl.ctx.dom.listMessageElements?.() ?? [];
    const latestId =
      this.ctrl.ctx.messages.getLatestMessageId() ??
      this.ctrl.snapshot.bindings.at(-1)?.messageId ??
      mountedList.at(-1)?.messageId;

    if (!latestId) {
      if (this.ctrl.chatId && state.initialized && this.retryAttempts < 5 && !this.retryTimer) {
        this.retryAttempts++;
        this.retryTimer = setTimeout(() => {
          this.retryTimer = null;
          this.sync(onOpenDossier, onOpenStudio);
        }, 180 * this.retryAttempts);
      }
      return;
    }

    const messageNode =
      this.ctrl.ctx.dom.findMessageElement(latestId) ??
      mountedList.at(-1)?.element ??
      null;
    if (!messageNode) {
      if (this.retryAttempts < 5 && !this.retryTimer) {
        this.retryAttempts++;
        this.retryTimer = setTimeout(() => {
          this.retryTimer = null;
          this.sync(onOpenDossier, onOpenStudio);
        }, 180 * this.retryAttempts);
      }
      return;
    }
    this.clearRetryTimer();
    this.retryAttempts = 0;
    const bubbleNode = messageNode;

    if (this.ctrl.busy) {
      if (!this.busyMount || this.busyMount.messageId !== latestId || !this.busyMount.wrapper.isConnected) {
        this.clearBusyIndicator();
        const wrapper = this.ctrl.ctx.dom.inject(
          bubbleNode,
          '<div class="ls-calibrating-pill" role="status" aria-live="polite">Calibrating Lumi Stats…</div>',
          'beforeend',
        );
        this.busyMount = { messageId: latestId, wrapper };
      }
    } else {
      this.clearBusyIndicator();
    }

    if (!state.initialized) {
      if (this.activeMount) {
        this.ctrl.ctx.dom.uninject(this.activeMount.wrapper);
        this.activeMount = undefined;
      }
      return;
    }

    const pos: InsertPosition =
      template.theme.placement === 'inline_top' || template.theme.placement === 'both_top'
        ? 'afterbegin'
        : 'beforeend';

    const renderSig = [
      this.ctrl.chatId,
      latestId,
      revision,
      template.updatedAt,
      pos,
      this.ctrl.inlineExpanded,
      this.ctrl.activeInlineTab,
      this.ctrl.selectedActorId,
      this.ctrl.activeCastTabActorId,
      this.ctrl.openedCastTabs.join(','),
      this.ctrl.selectedPlaceId,
      this.ctrl.webFilterMode,
    ].join(':');

    if (
      this.activeMount &&
      this.activeMount.messageId === latestId &&
      this.activeMount.pos === pos &&
      this.activeMount.wrapper.isConnected &&
      this.activeMount.renderSig === renderSig
    ) {
      return;
    }

    if (
      this.activeMount &&
      (this.activeMount.messageId !== latestId || this.activeMount.pos !== pos)
    ) {
      this.ctrl.ctx.dom.uninject(this.activeMount.wrapper);
      this.activeMount = undefined;
    }

    const cardNode = renderInlineRibbonCard(this.ctrl, onOpenDossier, onOpenStudio);
    if (this.activeMount && this.activeMount.wrapper.isConnected) {
      this.activeMount.wrapper.replaceChildren(cardNode);
      this.activeMount.renderSig = renderSig;
      return;
    }

    const wrapper = this.ctrl.ctx.dom.inject(
      bubbleNode,
      '<div class="ls-inline-slot"></div>',
      pos,
    );
    wrapper.replaceChildren(cardNode);
    this.activeMount = { messageId: latestId, wrapper, pos, renderSig };
  }
}
// --- END OF FILE src/frontend/surfaces/InlineRibbon.ts ---
