import { formatSceneBanner } from '../../shared/formula';
import {
  btn,
  el,
  iconBtn,
  openQuickTemplateModal,
  type ComponentScope,
  type LumiFrontendController,
} from '../controller';
import { svgIcon } from '../icons';
import { openScenePillEditorModal } from './BuiltinTrackerModals';
import { renderSurfaceCastRoster } from './CastDossier';
import { renderRelationshipWebSurface } from './RelationshipWeb';
import { renderSpatialMapSurface } from './SpatialMap';
import {
  interpolateBannerTemplate,
  mountSanitizedHtml,
  openSceneBannerModal,
  renderStatsForSurfaceTab,
} from './StatGrid';

export function openWidgetResizeModal(ctrl: LumiFrontendController): void {
  const { theme } = ctrl.snapshot.template;
  ctrl.modals.open({ title: '📐 Widget & Pill Size Customizer (Any Extreme)', width: 520 }, (body, close) => {
    let w = theme.widgetWidth ?? 460;
    let h = theme.widgetHeight ?? 540;
    let pw = theme.pillWidth ?? 420;
    let ph = theme.pillHeight ?? 92;

    const presetsCard = el('div', 'ls-card');
    presetsCard.append(el('span', 'ls-kicker', '1-Click Widget Size Presets'));
    const pRow = el('div', 'ls-row');
    for (const [lbl, pwVal, phVal] of [
      ['Micro (280×240)', 280, 240],
      ['Compact (380×420)', 380, 420],
      ['Standard (460×540)', 460, 540],
      ['Wide (680×560)', 680, 560],
      ['Theater (920×720)', 920, 720],
      ['Extreme Max (1180×860)', 1180, 860],
    ] as const) {
      pRow.append(
        btn(lbl, () => {
          w = pwVal;
          h = phVal;
          wInp.value = String(w);
          hInp.value = String(h);
          ctrl.widgetExpanded = true;
          ctrl.onResizeWidgetLive?.(w, h, true);
        }, 'ls-btn-sm'),
      );
    }
    const tabsModeRow = el('div', 'ls-row');
    tabsModeRow.append(el('small', 'ls-muted', 'Widget Tabs:'));
    for (const [iconOnlyVal, lbl] of [
      [false, '🏷️ Icons + Labels'],
      [true, '✨ Icons Only'],
    ] as const) {
      const b = btn(lbl, () => {
        void ctrl.request('state:mutate', {
          templatePatch: {
            theme: { ...ctrl.snapshot.template.theme, widgetTabsIconOnly: iconOnlyVal },
          },
          reason: `Set widget tabs to ${iconOnlyVal ? 'icons only' : 'icons + labels'}`,
        });
      }, 'ls-btn-sm');
      if (Boolean(ctrl.snapshot.template.theme.widgetTabsIconOnly) === iconOnlyVal) {
        b.setAttribute('aria-current', 'page');
      }
      tabsModeRow.append(b);
    }
    presetsCard.append(pRow, tabsModeRow);

    const grid = el('div', 'ls-grid');
    const wWrap = el('label', 'ls-label', 'Expanded Width (240–1200 px)');
    const wInp = el('input', 'ls-input');
    wInp.type = 'number';
    wInp.min = '240';
    wInp.max = '1200';
    wInp.value = String(w);
    wWrap.append(wInp);

    const hWrap = el('label', 'ls-label', 'Expanded Height (180–900 px)');
    const hInp = el('input', 'ls-input');
    hInp.type = 'number';
    hInp.min = '180';
    hInp.max = '900';
    hInp.value = String(h);
    hWrap.append(hInp);

    const pwWrap = el('label', 'ls-label', 'Collapsed Pill Width (220–960 px)');
    const pwInp = el('input', 'ls-input');
    pwInp.type = 'number';
    pwInp.min = '220';
    pwInp.max = '960';
    pwInp.value = String(pw);
    pwWrap.append(pwInp);

    const phWrap = el('label', 'ls-label', 'Collapsed Pill Height (56–220 px)');
    const phInp = el('input', 'ls-input');
    phInp.type = 'number';
    phInp.min = '56';
    phInp.max = '220';
    phInp.value = String(ph);
    phWrap.append(phInp);

    grid.append(wWrap, hWrap, pwWrap, phWrap);

    const applyBtn = btn('💾 Apply & Save Dimensions', () => {
      const nextW = Math.max(240, Math.min(1200, Number(wInp.value) || 460));
      const nextH = Math.max(180, Math.min(900, Number(hInp.value) || 540));
      const nextPW = Math.max(220, Math.min(960, Number(pwInp.value) || 420));
      const nextPH = Math.max(56, Math.min(220, Number(phInp.value) || 92));
      void ctrl.request('state:mutate', {
        templatePatch: {
          theme: {
            ...ctrl.snapshot.template.theme,
            widgetWidth: nextW,
            widgetHeight: nextH,
            pillWidth: nextPW,
            pillHeight: nextPH,
          },
        },
        reason: `Resized widget (${nextW}×${nextH})`,
      });
      if (ctrl.widgetExpanded) {
        ctrl.onResizeWidgetLive?.(nextW, nextH, false);
      } else {
        ctrl.onResizeWidgetLive?.(nextPW, nextPH, false);
      }
      close();
    }, 'ls-btn-primary');

    body.append(presetsCard, grid, applyBtn);
  });
}

export function buildGameStatusPillStrip(
  ctrl: LumiFrontendController,
  options?: { omitLocation?: boolean },
): HTMLElement {
  const { state, template, deltas } = ctrl.snapshot;
  const show = template.theme.showSceneChips;
  const banner = formatSceneBanner(state);
  const main = el('div', 'ls-game-pill-main');

  if (show.location && !options?.omitLocation) {
    main.append(el('span', 'ls-chip ls-chip-accent', `📍 ${banner.location}`));
  }
  if (show.time) {
    main.append(el('span', 'ls-chip', `🕰️ ${banner.time}`));
  }
  if (show.date && banner.date) {
    main.append(el('span', 'ls-chip', `📅 ${banner.date}`));
  }
  if (show.weather && banner.weather && banner.weather !== 'Clear') {
    main.append(el('span', 'ls-chip', `🌦️ ${banner.weather}`));
  }

  const presentActors = Object.values(state.characters).filter(c => c.present);
  if (show.cast && presentActors.length > 0) {
    const stack = el('div', 'ls-avatar-stack');
    stack.title = `In Scene: ${presentActors.map(a => a.name).join(', ')}`;
    for (const actor of presentActors.slice(0, 4)) {
      const item = el('span', 'ls-avatar-stack-item');
      if (actor.portraitUrl) {
        const img = el('img');
        img.src = actor.portraitUrl;
        img.alt = actor.name;
        item.append(img);
      } else {
        item.textContent = actor.name.slice(0, 2).toUpperCase();
      }
      stack.append(item);
    }
    main.append(stack);
  }

  const allPinned = show.pinnedStats
    ? template.stats.filter(
        s => s.enabled && (s.pinnedToHeader || s.showIn?.pinnedHeader),
      )
    : [];
  const presenceSchema = allPinned.find(s => s.id === 'present' || s.id === 'scene_presence');
  const otherPinned = allPinned.filter(s => s.id !== 'present' && s.id !== 'scene_presence').slice(0, 3);
  const pinnedSchemas = presenceSchema ? [presenceSchema, ...otherPinned] : otherPinned;

  for (const schema of pinnedSchemas) {
    const isChar = schema.scope === 'character';
    const firstPresent = presentActors[0] ?? Object.values(state.characters)[0];
    const runtime = isChar ? firstPresent?.meters[schema.id] : state.stats[schema.id];
    const isPresenceStat = schema.id === 'present' || schema.id === 'scene_presence';
    const allActors = Object.values(state.characters);
    if (!runtime?.calibrated && !(isPresenceStat && allActors.length > 0)) continue;

    const val =
      isPresenceStat && allActors.length > 0 && !runtime?.calibrated
        ? `Present: [${presentActors.map(a => a.name).join(', ')}], Away: [${allActors.filter(a => !a.present).map(a => a.name).join(', ')}]`
        : runtime!.value;
    const d = isChar
      ? (firstPresent ? deltas.characterDeltas[firstPresent.id]?.[schema.id] ?? 0 : 0)
      : (deltas.statDeltas[schema.id] ?? 0);

    if (typeof val === 'number' && schema.kind !== 'currency') {
      const gauge = el('div', 'ls-pill-gauge');
      gauge.style.setProperty('--ls-bar-color', schema.color || 'var(--ls-primary)');
      const top = el('div', 'ls-pill-gauge-top');
      top.append(
        el('span', '', `${schema.icon} ${isChar && firstPresent ? firstPresent.name.split(' ')[0] : schema.label}`),
        el('span', '', `${val}${d !== 0 ? (d > 0 ? ` +${d}` : ` ${d}`) : ''}`),
      );
      const track = el('div', 'ls-pill-gauge-track');
      const fill = el('div', 'ls-bar-fill');
      const span = Math.max(1, schema.max - schema.min);
      const pct = Math.max(0, Math.min(100, Math.round(((val - schema.min) / span) * 100)));
      fill.style.width = `${pct}%`;
      track.append(fill);
      gauge.append(top, track);
      main.append(gauge);
    } else {
      main.append(
        el(
          'span',
          'ls-chip',
          `${schema.icon} ${isChar && firstPresent ? `${firstPresent.name}: ` : ''}${String(val)}`,
        ),
      );
    }
  }

  return main;
}

export function renderFloatingHudSurface(
  ctrl: LumiFrontendController,
  compact: boolean,
  onToggleCompact: () => void,
  onOpenDossier: (actorId: string) => void,
  onOpenStudio: () => void,
  compScope?: ComponentScope,
): HTMLElement {
  const { state, template } = ctrl.snapshot;
  const hud = el('section', 'ls-hud');
  ctrl.stampThemeOnElement(hud);

  const openHudMenu = async (e: MouseEvent) => {
    const fallback = () => openQuickTemplateModal(ctrl, onOpenStudio);
    if (typeof ctrl.ctx.ui?.showContextMenu !== 'function') {
      fallback();
      return;
    }
    const { selectedKey } = await ctrl.ctx.ui.showContextMenu({
      position: { x: e.clientX, y: e.clientY },
      items: [
        { key: 'edit_scene', label: 'Edit Scene Values (Location, Time, Date)' },
        { key: 'pill_prompts', label: 'Edit Scene Pill AI Prompts & Chips' },
        { key: 'div1', label: '', type: 'divider' },
        { key: 'template', label: `Switch Template & Skin (${template.name})` },
        { key: 'resize', label: 'Resize Floating Widget' },
        { key: 'studio', label: 'Open Full Settings Studio' },
      ],
    });
    if (selectedKey === 'edit_scene') openSceneBannerModal(ctrl);
    else if (selectedKey === 'pill_prompts') openScenePillEditorModal(ctrl);
    else if (selectedKey === 'template') openQuickTemplateModal(ctrl, onOpenStudio);
    else if (selectedKey === 'resize') openWidgetResizeModal(ctrl);
    else if (selectedKey === 'studio') onOpenStudio();
  };

  const buildActionCluster = () => {
    const row = el('div', 'ls-row');
    const syncBtn = iconBtn(
      'sync',
      () => void ctrl.request('track:manual'),
      {
        className: 'ls-btn-sm ls-btn-icon ls-btn-ghost',
        title: ctrl.busy ? 'Calibrating…' : 'Sync & calibrate current turn',
      },
    );
    syncBtn.disabled = ctrl.busy;

    const stageBtn = iconBtn(
      'stage',
      () => ctrl.toggleVnStage(),
      {
        className: 'ls-btn-sm ls-btn-icon ls-btn-ghost',
        title: 'Launch 2D Visual Novel Stage & Voices',
      },
    );

    const moreBtn = iconBtn(
      'more',
      e => void openHudMenu(e),
      {
        className: 'ls-btn-sm ls-btn-icon ls-btn-ghost',
        title: 'Scene Pill Prompts, Template Switcher, Resize & Studio',
      },
    );

    const studioBtn = iconBtn(
      'settings',
      () => {
        console.log('[LumiStats FloatingHud] ⚙️ studio button clicked');
        onOpenStudio();
      },
      {
        className: 'ls-btn-sm ls-btn-icon ls-btn-ghost',
        title: 'Open Lumi Stats Studio',
      },
    );

    const toggleBtn = iconBtn(
      compact ? 'chevronDown' : 'chevronUp',
      onToggleCompact,
      {
        label: compact ? 'Expand' : 'Pill',
        className: 'ls-btn-sm ls-btn-primary',
        title: compact ? 'Expand Floating HUD' : 'Collapse to Status Pill',
      },
    );

    row.append(syncBtn, stageBtn, moreBtn, studioBtn, toggleBtn);
    return row;
  };

  if (compact) {
    const pillSkin = template.theme.pillStyle || 'glass_capsule';
    const show = template.theme.showSceneChips;
    const banner = formatSceneBanner(state);
    const pill = el('div', 'ls-hud-pill');
    pill.dataset.pillSkin = pillSkin;
    pill.addEventListener('click', e => {
      if (e.target instanceof Element && e.target.closest('button')) return;
      onToggleCompact();
    });

    const topRow = el('div', 'ls-row-between ls-pill-top-deck');
    const titleBadge = el('span', 'ls-hud-title-badge');
    const liveDot = el('span', 'ls-pill-live-dot');
    const baseLabel = show.location
      ? state.scene.location || state.title || 'Lumi Stats'
      : state.title || template.name || 'Lumi Stats';
    const titleText =
      pillSkin === 'cyber_telemetry'
        ? `${show.location ? 'LOC' : 'HUD'} // ${baseLabel.toUpperCase()}`
        : pillSkin === 'ledger_strip' && show.date
          ? `${banner.date} · ${baseLabel}`
          : baseLabel;
    titleBadge.append(
      liveDot,
      el('span', '', template.icon || '✨'),
      el('span', 'ls-pill-title-text', titleText),
    );

    const actionsEl = buildActionCluster();
    actionsEl.classList.add('ls-pill-actions');
    topRow.append(titleBadge, actionsEl);
    pill.append(topRow);

    let hasBottomDeck = false;
    if (pillSkin !== 'compact_badge') {
      if (state.initialized) {
        const strip = buildGameStatusPillStrip(ctrl, { omitLocation: true });
        if (strip.childElementCount > 0) {
          strip.classList.add('ls-pill-bottom-deck');
          pill.append(strip);
          hasBottomDeck = true;
        }
      } else if (ctrl.chatId) {
        const bootRow = el('div', 'ls-row ls-pill-bottom-deck');
        bootRow.append(
          btn('Calibrate World Now', () => void ctrl.request('track:manual'), 'ls-btn-sm ls-btn-primary'),
          btn('Studio', onOpenStudio, 'ls-btn-sm'),
        );
        pill.append(bootRow);
        hasBottomDeck = true;
      }
    }
    pill.dataset.emptyDeck = String(!hasBottomDeck);
    hud.append(pill);
    return hud;
  }

  const enabledTabs = [...template.surfaces.widgetTabs]
    .filter(t => t.enabled && (t.kind !== 'web' || template.surfaces.showRelationshipWeb !== false))
    .sort((a, b) => a.order - b.order);
  const activeTab =
    enabledTabs.find(t => t.id === ctrl.activeSurfaceTab) ??
    enabledTabs[0] ?? {
      id: 'stats',
      label: 'Stats',
      icon: '📊',
      kind: 'stats' as const,
      enabled: true,
      order: 0,
    };

  const headerBar = el('nav', 'ls-hud-header-bar');
  const topMetaRow = el('div', 'ls-hud-top-row');
  const titleBtn = btn(
    `${template.icon} ${state.scene.location || state.title || 'Lumi Stats'}`,
    () => openScenePillEditorModal(ctrl),
    'ls-btn-sm ls-btn-ghost ls-hud-title-badge',
    'Click to customize Scene Pill prompt & visible chips',
  );
  topMetaRow.append(titleBtn, buildActionCluster());

  const iconOnlyTabs = Boolean(template.theme.widgetTabsIconOnly);
  const tabsRow = el('div', 'ls-hud-tabs-scroll');
  const hasRealEmojiOrSymbol = (s: string) => /[^\w\s]/u.test(s.trim());
  for (const tab of enabledTabs) {
    const countSuffix =
      tab.kind === 'cast'
        ? ` (${Object.keys(state.characters).length})`
        : tab.kind === 'map'
          ? ` (${Object.keys(state.places).length})`
          : '';
    const fullLabel = `${tab.label}${countSuffix}`;
    const showIconOnly = iconOnlyTabs && hasRealEmojiOrSymbol(tab.icon);
    const b = btn(
      showIconOnly ? tab.icon : `${tab.icon} ${fullLabel}`,
      () => {
        ctrl.activeSurfaceTab = tab.id;
        ctrl.emitChange();
      },
      `ls-btn-sm${showIconOnly ? ' ls-hud-tab-icon-only' : ''}`,
      fullLabel,
    );
    if (tab.id === activeTab.id) b.setAttribute('aria-current', 'page');
    tabsRow.append(b);
  }
  headerBar.append(topMetaRow, tabsRow);
  hud.append(headerBar);

  const content = el('div', 'ls-hud-content');
  if (!state.initialized) {
    const empty = el('div', 'ls-card');
    empty.append(
      el('strong', '', ctrl.chatId ? 'Ready to calibrate this story' : 'Open a chat to begin'),
      el('p', 'ls-muted', 'Send a message for automatic two-phase calibration, or click below to calibrate now:'),
    );
    if (ctrl.chatId) {
      empty.append(btn('✨ Calibrate Stats Now', () => void ctrl.request('track:manual'), 'ls-btn-primary'));
    }
    content.append(empty);
    hud.append(content);
    return hud;
  }

  if (template.surfaces.customWidgetHtml) {
    const customBanner = el('div', 'ls-card');
    content.append(customBanner);
    mountSanitizedHtml(
      customBanner,
      interpolateBannerTemplate(template.surfaces.customWidgetHtml, state),
      ctrl.ctx,
    );
  }

  if (state.modifiers.length > 0 && activeTab.kind === 'stats') {
    const modRow = el('div', 'ls-row');
    for (const mod of state.modifiers) {
      const fx = el(
        'span',
        'ls-rpg-fx-pill',
        `${mod.delta >= 0 ? '▲' : '▼'} ${mod.label} (${mod.delta >= 0 ? `+${mod.delta}` : mod.delta}${mod.remainingTurns ? ` · ${mod.remainingTurns}t` : ''})`,
      );
      fx.dataset.fxKind = mod.delta >= 0 ? 'buff' : 'debuff';
      modRow.append(fx);
    }
    content.append(modRow);
  }

  if (activeTab.kind === 'cast') {
    content.append(renderSurfaceCastRoster(ctrl, 'widget', activeTab.id, onOpenDossier));
  } else if (activeTab.kind === 'web') {
    content.append(renderRelationshipWebSurface(ctrl, onOpenDossier));
  } else if (activeTab.kind === 'map') {
    content.append(renderSpatialMapSurface(ctrl));
  } else {
    if (activeTab.customHtml) {
      const box = el('div', 'ls-card');
      content.append(box);
      mountSanitizedHtml(box, interpolateBannerTemplate(activeTab.customHtml, state), ctrl.ctx);
    }
    content.append(renderStatsForSurfaceTab(ctrl, 'widget', activeTab.id, compScope, false));
  }

  hud.append(content);

  // Corner Drag-Resize Grip (`◢`) supporting extreme sizes (240x180 up to 1200x900)
  const resizeGrip = el('div', 'ls-hud-resize-grip', '◢');
  resizeGrip.title = 'Drag to resize widget to any size';
  resizeGrip.addEventListener('pointerdown', e => {
    if (e.button !== 0 || !ctrl.onResizeWidgetLive) return;
    e.preventDefault();
    e.stopPropagation();

    const rect = hud.getBoundingClientRect();
    const uiScale = rect.width > 0 && hud.offsetWidth > 0 ? rect.width / hud.offsetWidth : 1;
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = hud.offsetWidth || (template.theme.widgetWidth ?? 460);
    const startH = hud.offsetHeight || (template.theme.widgetHeight ?? 540);
    let curW = startW;
    let curH = startH;

    try {
      resizeGrip.setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    const onMove = (me: PointerEvent) => {
      const dx = (me.clientX - startX) / uiScale;
      const dy = (me.clientY - startY) / uiScale;
      curW = Math.max(240, Math.min(1200, Math.round(startW + dx)));
      curH = Math.max(180, Math.min(900, Math.round(startH + dy)));
      ctrl.onResizeWidgetLive?.(curW, curH, false);
    };

    const onUp = (ue: PointerEvent) => {
      resizeGrip.removeEventListener('pointermove', onMove);
      resizeGrip.removeEventListener('pointerup', onUp);
      resizeGrip.removeEventListener('pointercancel', onUp);
      try {
        resizeGrip.releasePointerCapture(ue.pointerId);
      } catch {
        // Ignore
      }
      ctrl.onResizeWidgetLive?.(curW, curH, true);
    };

    resizeGrip.addEventListener('pointermove', onMove);
    resizeGrip.addEventListener('pointerup', onUp);
    resizeGrip.addEventListener('pointercancel', onUp);
  });
  hud.append(resizeGrip);

  return hud;
}
