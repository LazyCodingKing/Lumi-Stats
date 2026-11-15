import {
  BUILTIN_VISUAL_SKINS,
  extractSkinPackFromTemplate,
  slugifyKey,
} from '../../../shared/templates';
import type {
  CastLayoutMode,
  LumiStatsTemplate,
  MeterVisualStyle,
  PillSkinStyle,
  PlacementMode,
  SurfaceFrameShape,
  SurfaceVisualStyle,
} from '../../../shared/types';
import {
  btn,
  el,
  iconBtn,
  mountNativeCheckbox,
  mountNativeCollapsible,
  mountThemedSelect,
  openCreateTemplateModal,
  type ComponentScope,
  type LumiFrontendController,
} from '../../controller';

export function renderStudioTemplatesTab(
  ctrl: LumiFrontendController,
  compScope: ComponentScope,
  tpl: LumiStatsTemplate,
  saveTemplatePatch: (patch: Partial<LumiStatsTemplate>, reason?: string) => void,
  duplicateAndEditTemplate: (sourceTpl: LumiStatsTemplate, customName?: string) => void,
  forceRedraw: () => void,
): HTMLElement {
  const { state } = ctrl.snapshot;
  const wrap = el('div', 'ls-stack');

  const savedCustomTemplates = ctrl.customTemplates.filter(
    ct => !ctrl.builtinTemplates.some(bt => bt.id === ct.id),
  );
  const allTemplatesCount = savedCustomTemplates.length + ctrl.builtinTemplates.length;

  // 1. Template Library
  const libCard = el('section', 'ls-card');
  const libHead = el('div', 'ls-row-between');
  const libTitle = el('div');
  libTitle.append(
    el('span', 'ls-kicker', 'Template Gallery'),
    el('h3', '', `Saved & Built-In Templates (${allTemplatesCount})`),
  );
  const libRightBtns = el('div', 'ls-row');
  libRightBtns.append(
    iconBtn('plus', () => openCreateTemplateModal(ctrl, forceRedraw), {
      label: 'New Template',
      className: 'ls-btn-sm ls-btn-primary',
    }),
    btn('Import .json', () => {
      void ctrl.ctx.uploads
        .pickFile({ accept: ['.json', 'application/json'], multiple: false, maxSizeBytes: 2_500_000 })
        .then(async files => {
          const f = files[0];
          if (!f) return;
          const json = new TextDecoder().decode(f.bytes);
          await ctrl.request('template:importJson', { json });
          ctrl.notify(`Imported & activated template from ${f.name}.`);
        })
        .catch(err => ctrl.notify(err instanceof Error ? err.message : String(err), true));
    }, 'ls-btn-sm'),
  );
  libHead.append(libTitle, libRightBtns);
  libCard.append(libHead);

  const renderPresetCard = (preset: LumiStatsTemplate, isCustom: boolean): HTMLElement => {
    const isActive = preset.id === tpl.id;
    const card = el('div', 'ls-preset-card');
    card.dataset.active = String(isActive);

    const topInfo = el('div', 'ls-stack');
    topInfo.style.gap = '5px';
    const titleRow = el('div', 'ls-row-between');
    titleRow.append(
      el('strong', '', `${preset.icon} ${preset.name}`),
      el('span', `ls-chip ${isCustom ? 'ls-chip-accent' : ''}`, isCustom ? 'Saved Custom' : 'Built-In'),
    );
    const badgeRow = el('div', 'ls-row');
    const charCount = preset.stats.filter(s => s.scope === 'character').length;
    const otherCount = preset.stats.filter(s => s.scope !== 'character').length;
    badgeRow.append(
      el('span', 'ls-chip', `${charCount} NPC meters`),
      el('span', 'ls-chip', `${otherCount} stats`),
    );
    topInfo.append(titleRow, el('p', 'ls-muted', preset.description), badgeRow);

    const btnBar = el('div', 'ls-row');
    if (isActive) {
      btnBar.append(el('span', 'ls-chip ls-chip-accent', '✓ Active'));
    } else {
      const actBtn = btn('Activate', () => {
        actBtn.disabled = true;
        actBtn.textContent = 'Applying…';
        void ctrl
          .request('template:apply', { templateId: preset.id, template: preset })
          .then(() => {
            ctrl.notify(`Activated "${preset.name}"!`);
          })
          .catch(err => {
            ctrl.notify(err instanceof Error ? err.message : String(err), true);
            if (actBtn.isConnected) {
              actBtn.disabled = false;
              actBtn.textContent = 'Activate';
            }
          });
      }, 'ls-btn-sm ls-btn-primary');
      btnBar.append(actBtn);
    }
    btnBar.append(
      iconBtn('copy', () => duplicateAndEditTemplate(preset), {
        label: 'Copy & Edit',
        className: 'ls-btn-sm',
        title: 'Create an editable copy of this template',
      }),
    );
    if (isCustom) {
      btnBar.append(
        iconBtn('trash', () => {
          void ctrl.modals
            .confirm({
              title: 'Delete Saved Template?',
              message: `Remove "${preset.name}" from your Template Library?`,
              confirmLabel: 'Delete',
              variant: 'danger',
            })
            .then(confirmed => {
              if (!confirmed) return;
              void ctrl
                .request('template:deleteFromLibrary', { templateId: preset.id })
                .then(() => ctrl.notify(`Deleted "${preset.name}" from library.`))
                .catch(err => ctrl.notify(err instanceof Error ? err.message : String(err), true));
            });
        }, {
          className: 'ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger',
          title: 'Delete from library',
        }),
      );
    }

    card.append(topInfo, btnBar);
    return card;
  };

  libCard.append(el('span', 'ls-kicker', `Saved Custom Templates (${savedCustomTemplates.length})`));
  if (savedCustomTemplates.length > 0) {
    const customGrid = el('div', 'ls-grid');
    for (const preset of savedCustomTemplates) {
      customGrid.append(renderPresetCard(preset, true));
    }
    libCard.append(customGrid);
  } else {
    libCard.append(
      el('p', 'ls-muted', 'No saved custom templates yet. Click "+ New Template", "Save to Library", or "Copy & Edit" on any preset below.'),
    );
  }

  libCard.append(el('span', 'ls-kicker', `Built-In Presets (${ctrl.builtinTemplates.length})`));
  const builtinGrid = el('div', 'ls-grid');
  for (const preset of ctrl.builtinTemplates) {
    builtinGrid.append(renderPresetCard(preset, false));
  }
  libCard.append(builtinGrid);
  wrap.append(libCard);

  // 2. Display Location & AI Injection Position (Compact side-by-side)
  const placeCard = el('section', 'ls-card');
  placeCard.append(
    el('span', 'ls-kicker', 'Display & Prompt Placement'),
    el('h3', '', 'Where Lumi Stats Appears'),
  );
  const placementRow = el('div', 'ls-row');
  for (const [pVal, pLbl] of [
    ['both_bottom', 'HUD + Below Reply'],
    ['both_top', 'HUD + Above Reply'],
    ['inline_bottom', 'Below Reply Only'],
    ['floating_only', 'Floating HUD Only'],
  ] as const) {
    const b = btn(pLbl, () => {
      saveTemplatePatch({
        theme: { ...ctrl.snapshot.template.theme, placement: pVal as PlacementMode },
      });
    }, 'ls-btn-sm');
    if (tpl.theme.placement === pVal) b.setAttribute('aria-current', 'page');
    placementRow.append(b);
  }
  placeCard.append(placementRow);

  const promptPosRow = el('div', 'ls-row');
  promptPosRow.append(el('small', 'ls-muted', 'AI Prompt Injection:'));
  for (const [ppVal, ppLbl] of [
    ['pre_history', 'Before History'],
    ['in_history', 'Within History'],
    ['post_history', 'After History'],
  ] as const) {
    const b = btn(ppLbl, () => {
      saveTemplatePatch({ promptPosition: ppVal }, `Set prompt position to ${ppVal}`);
    }, 'ls-btn-sm');
    if ((tpl.promptPosition || 'post_history') === ppVal) {
      b.setAttribute('aria-current', 'page');
    }
    promptPosRow.append(b);
  }
  if (tpl.promptPosition === 'in_history') {
    const curDepth = Math.max(0, Math.round(Number(tpl.promptDepth ?? 1) || 0));
    const depthInp = el('input', 'ls-input');
    depthInp.type = 'number';
    depthInp.min = '0';
    depthInp.max = '20';
    depthInp.style.cssText = 'width:68px;min-height:26px;padding:2px 6px;';
    depthInp.value = String(curDepth);
    depthInp.addEventListener('change', () => {
      const nextDepth = Math.max(0, Math.min(20, Math.round(Number(depthInp.value) || 0)));
      saveTemplatePatch({ promptDepth: nextDepth });
    });
    promptPosRow.append(el('small', 'ls-muted', 'Depth:'), depthInp);
  }
  placeCard.append(promptPosRow);
  wrap.append(placeCard);

  // 3. Visual Skin & Appearance (Collapsible so beginners aren't hit with 32 controls at once)
  const skinHost = el('div');
  wrap.append(skinHost);
  const skinBody = mountNativeCollapsible(ctrl, compScope, skinHost, {
    title: 'Appearance, Skins, Frame Shapes & Widget Size',
    iconName: 'palette',
    defaultExpanded: false,
    persistKey: 'studio_templates_skin',
  });

  const skinPackRow = el('div', 'ls-row');
  skinPackRow.append(el('small', 'ls-muted', '1-Click Skins:'));
  for (const skin of BUILTIN_VISUAL_SKINS) {
    const b = btn(skin.name, () => ctrl.applySkinPack(skin), 'ls-btn-sm');
    if ((tpl.theme.surfaceStyle || 'glass') === skin.surfaceStyle) b.setAttribute('aria-current', 'page');
    skinPackRow.append(b);
  }
  skinPackRow.append(
    btn('Import Skin', () => {
      void ctrl.ctx.uploads
        .pickFile({ accept: ['.json', 'application/json'], multiple: false, maxSizeBytes: 500_000 })
        .then(files => {
          const f = files[0];
          if (!f) return;
          const parsed = JSON.parse(new TextDecoder().decode(f.bytes)) as unknown;
          ctrl.applySkinPack(parsed);
        });
    }, 'ls-btn-sm ls-btn-ghost'),
    btn('Export Skin', () => {
      const pack = extractSkinPackFromTemplate(tpl);
      const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slugifyKey(tpl.name, 'lumi_skin')}.lumi-skin.json`;
      document.body.append(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }, 'ls-btn-sm ls-btn-ghost'),
  );
  skinBody.append(skinPackRow);

  const pillSkinWrap = el('div', 'ls-row-between ls-stat-cell');
  pillSkinWrap.append(el('strong', '', 'Collapsed Pill Skin (10 Designs)'));
  const pillSkinSlot = el('div');
  pillSkinSlot.style.minWidth = '230px';
  pillSkinWrap.append(pillSkinSlot);
  mountThemedSelect(ctrl, compScope, pillSkinSlot, {
    value: tpl.theme.pillStyle || 'glass_capsule',
    ariaLabel: 'Collapsed Pill Skin',
    options: [
      { value: 'glass_capsule', label: '✨ Frosted Split Capsule (Default Best)' },
      { value: 'vn_dialogue_bar', label: '🎬 VN Cinema Strip' },
      { value: 'rpg_status_bar', label: '⚔️ JRPG Party Status Bar' },
      { value: 'persona_ticker', label: '🃏 Stylish Pop Ticker' },
      { value: 'cyber_telemetry', label: '🛸 Cyber Telemetry' },
      { value: 'minimal_floating', label: '☁️ Minimal Ghost Pill' },
      { value: 'neon_edge', label: '⚡ Neon Glow Rail' },
      { value: 'split_deck', label: '🗂️ Dual-Deck Card Pill' },
      { value: 'compact_badge', label: '📱 Micro Compact Badge' },
      { value: 'ledger_strip', label: '📜 Editorial Case Strip' },
    ],
    onChange: nextPill => {
      saveTemplatePatch({
        theme: { ...ctrl.snapshot.template.theme, pillStyle: nextPill as PillSkinStyle },
      });
    },
  });
  skinBody.append(pillSkinWrap);

  const styleRow = el('div', 'ls-row');
  styleRow.append(el('small', 'ls-muted', 'Base Surface:'));
  for (const [sVal, sLbl] of [
    ['glass', 'Auto Glass'],
    ['soft', 'Soft Card'],
    ['sleek', 'Sleek Dark'],
    ['minimal', 'Minimal'],
    ['neon', 'Neon'],
    ['arcane_rpg', 'Arcane RPG'],
    ['cyber_hud', 'Cyber HUD'],
    ['persona_pop', 'Pop Sim'],
    ['cozy_vn', 'Cozy VN'],
  ] as const) {
    const b = btn(sLbl, () => {
      saveTemplatePatch({ theme: { ...ctrl.snapshot.template.theme, surfaceStyle: sVal as SurfaceVisualStyle } });
    }, 'ls-btn-sm');
    if ((tpl.theme.surfaceStyle || 'glass') === sVal) b.setAttribute('aria-current', 'page');
    styleRow.append(b);
  }

  const frameRow = el('div', 'ls-row');
  frameRow.append(el('small', 'ls-muted', 'Frame & Bars:'));
  for (const [fVal, fLbl] of [
    ['rounded', 'Rounded'],
    ['chamfered', 'Angled'],
    ['ornate', 'Ornate'],
    ['sharp', 'Sharp'],
  ] as const) {
    const b = btn(fLbl, () => {
      saveTemplatePatch({ theme: { ...ctrl.snapshot.template.theme, frameShape: fVal as SurfaceFrameShape } });
    }, 'ls-btn-sm');
    if ((tpl.theme.frameShape || 'rounded') === fVal) b.setAttribute('aria-current', 'page');
    frameRow.append(b);
  }
  for (const [mVal, mLbl] of [
    ['smooth', 'Gradient Bar'],
    ['segmented', 'Segmented Bar'],
    ['glow', 'Neon Glow Bar'],
  ] as const) {
    const b = btn(mLbl, () => {
      saveTemplatePatch({ theme: { ...ctrl.snapshot.template.theme, meterStyle: mVal as MeterVisualStyle } });
    }, 'ls-btn-sm');
    if ((tpl.theme.meterStyle || 'smooth') === mVal) b.setAttribute('aria-current', 'page');
    frameRow.append(b);
  }

  const hueRow = el('div', 'ls-row');
  hueRow.append(el('small', 'ls-muted', 'Accent Color:'));
  for (const [hueVal, hueLbl] of [
    [undefined, 'Theme Default'],
    [198, 'Cyan'],
    [330, 'Rose'],
    [38, 'Gold'],
    [158, 'Emerald'],
    [262, 'Violet'],
    [350, 'Crimson'],
  ] as const) {
    const b = btn(hueLbl, () => {
      saveTemplatePatch({ theme: { ...ctrl.snapshot.template.theme, accentHue: hueVal } });
    }, 'ls-btn-sm');
    if (tpl.theme.accentHue === hueVal) b.setAttribute('aria-current', 'page');
    hueRow.append(b);
  }

  const sizeGrid = el('div', 'ls-grid');
  const makeSizeInput = (label: string, val: number, min: number, max: number, onSave: (n: number) => void) => {
    const w = el('label', 'ls-label', label);
    const inp = el('input', 'ls-input');
    inp.type = 'number';
    inp.min = String(min);
    inp.max = String(max);
    inp.value = String(val);
    inp.addEventListener('change', () => {
      onSave(Math.max(min, Math.min(max, Number(inp.value) || val)));
    });
    w.append(inp);
    return w;
  };
  sizeGrid.append(
    makeSizeInput('Widget Width (px)', tpl.theme.widgetWidth ?? 460, 240, 1200, val => {
      const liveTheme = ctrl.snapshot.template.theme;
      saveTemplatePatch({ theme: { ...liveTheme, widgetWidth: val } });
      if (ctrl.widgetExpanded) ctrl.onResizeWidgetLive?.(val, liveTheme.widgetHeight ?? 540, false);
    }),
    makeSizeInput('Widget Height (px)', tpl.theme.widgetHeight ?? 540, 180, 900, val => {
      const liveTheme = ctrl.snapshot.template.theme;
      saveTemplatePatch({ theme: { ...liveTheme, widgetHeight: val } });
      if (ctrl.widgetExpanded) ctrl.onResizeWidgetLive?.(liveTheme.widgetWidth ?? 460, val, false);
    }),
    makeSizeInput('Pill Width (px)', tpl.theme.pillWidth ?? 420, 220, 960, val => {
      const liveTheme = ctrl.snapshot.template.theme;
      saveTemplatePatch({ theme: { ...liveTheme, pillWidth: val } });
      if (!ctrl.widgetExpanded) ctrl.onResizeWidgetLive?.(val, liveTheme.pillHeight ?? 92, false);
    }),
  );

  const densityGrid = el('div', 'ls-grid');
  for (const [lbl, checked, onChange] of [
    [
      'Frosted Glass Blur',
      tpl.theme.glassBlur !== false,
      (v: boolean) => saveTemplatePatch({ theme: { ...ctrl.snapshot.template.theme, glassBlur: v } }),
    ],
    [
      'Compact Card Density',
      Boolean(tpl.theme.compact),
      (v: boolean) => saveTemplatePatch({ theme: { ...ctrl.snapshot.template.theme, compact: v } }),
    ],
    [
      'Expand Inline Ribbon by Default',
      Boolean(tpl.theme.inlineDefaultExpanded),
      (v: boolean) => {
        ctrl.inlineExpanded = v;
        saveTemplatePatch({ theme: { ...ctrl.snapshot.template.theme, inlineDefaultExpanded: v } });
      },
    ],
    [
      'Icon-Only Widget Tabs',
      Boolean(tpl.theme.widgetTabsIconOnly),
      (v: boolean) => saveTemplatePatch({ theme: { ...ctrl.snapshot.template.theme, widgetTabsIconOnly: v } }),
    ],
    [
      'All Cast Cards Expanded',
      (tpl.theme.castLayout || 'roster') === 'cards',
      (v: boolean) => saveTemplatePatch({ theme: { ...ctrl.snapshot.template.theme, castLayout: (v ? 'cards' : 'roster') as CastLayoutMode } }),
    ],
  ] as const) {
    const slot = el('div');
    mountNativeCheckbox(ctrl, compScope, slot, { checked, label: lbl, onChange });
    densityGrid.append(slot);
  }

  skinBody.append(styleRow, frameRow, hueRow, sizeGrid, densityGrid);

  // 4. Canon Story Premise
  const premiseHost = el('div');
  wrap.append(premiseHost);
  const premiseBody = mountNativeCollapsible(ctrl, compScope, premiseHost, {
    title: 'Canon Story Premise (Optional Turn-1 Setup)',
    iconName: 'edit',
    badge: state.canonPremise ? 'Set' : undefined,
    defaultExpanded: Boolean(state.canonPremise),
    persistKey: 'studio_templates_premise',
  });
  premiseBody.append(
    el('p', 'ls-muted', state.canonPremise || 'No custom premise set. Lumi Stats automatically calibrates from your Character Card, Persona, and Opening Message on Turn 1.'),
    btn('Open Full-Screen Premise Editor', () => {
      void ctrl
        .request('textEditor:open', {
          title: 'Canon Story Premise (Lumi Stats)',
          value: state.canonPremise || '',
          placeholder: 'Write established relationships, roles, or world rules…',
        })
        .then(res => {
          if (!res.cancelled && typeof res.text === 'string') {
            void ctrl.request('state:mutate', {
              stateOverride: { canonPremise: res.text.trim() },
              reason: 'Updated canon premise',
            });
          }
        });
    }, 'ls-btn-sm ls-btn-primary'),
  );

  return wrap;
}
