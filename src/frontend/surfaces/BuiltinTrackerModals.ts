import { defaultCoreTrackersConfig } from '../../shared/templates';
import type {
  BuiltInTrackerConfig,
  BuiltInTrackerId,
  CoreTrackersConfig,
  StatDisplayStyle,
  StatLayoutSpan,
} from '../../shared/types';
import {
  btn,
  el,
  mountNativeCollapsible,
  mountNativeSwitch,
  mountThemedSelect,
  type LumiFrontendController,
} from '../controller';

interface BuiltInMeta {
  title: string;
  defaultIcon: string;
  defaultLabel: string;
  toggleKey: keyof CoreTrackersConfig;
  labelKey?: keyof CoreTrackersConfig;
  instructionKey: keyof CoreTrackersConfig;
  showCardKey?: keyof CoreTrackersConfig;
  supportsCardDisplay: boolean;
}

const BUILTIN_TRACKER_META: Record<BuiltInTrackerId, BuiltInMeta> = {
  player_attire: {
    title: 'Player Attire / Presentation',
    defaultIcon: '👕',
    defaultLabel: 'Your Current Attire / Presentation',
    toggleKey: 'trackPlayerAttire',
    labelKey: 'playerAttireLabel',
    instructionKey: 'playerAttireInstruction',
    showCardKey: 'showPlayerAttireCard',
    supportsCardDisplay: true,
  },
  player_condition: {
    title: 'Player Physical / Mental Condition',
    defaultIcon: '🩺',
    defaultLabel: 'Physical / Mental Condition',
    toggleKey: 'trackPlayerCondition',
    labelKey: 'playerConditionLabel',
    instructionKey: 'playerConditionInstruction',
    showCardKey: 'showPlayerConditionCard',
    supportsCardDisplay: true,
  },
  player_action: {
    title: 'Player Latest Notable Action',
    defaultIcon: '⚡',
    defaultLabel: 'Latest Notable Action',
    toggleKey: 'trackPlayerAction',
    labelKey: 'playerActionLabel',
    instructionKey: 'playerActionInstruction',
    showCardKey: 'showPlayerActionCard',
    supportsCardDisplay: true,
  },
  scene_summary: {
    title: 'Scene Beat Summary',
    defaultIcon: '📖',
    defaultLabel: 'Scene Beat Summary',
    toggleKey: 'trackSceneSummary',
    labelKey: 'sceneSummaryLabel',
    instructionKey: 'sceneSummaryInstruction',
    showCardKey: 'showSceneSummaryInWidget',
    supportsCardDisplay: true,
  },
  places: {
    title: 'Spatial Atlas (Places, Zones & Paths)',
    defaultIcon: '🗺️',
    defaultLabel: 'Spatial Atlas & Locations',
    toggleKey: 'trackPlaces',
    instructionKey: 'placesInstruction',
    supportsCardDisplay: false,
  },
  quests: {
    title: 'Quests & Objectives',
    defaultIcon: '🎯',
    defaultLabel: 'Quests & Objectives',
    toggleKey: 'trackQuests',
    instructionKey: 'questsInstruction',
    showCardKey: 'showQuestsInWidget',
    supportsCardDisplay: false,
  },
  dispatches: {
    title: 'Off-Screen Dispatches',
    defaultIcon: '📡',
    defaultLabel: 'Off-Screen Dispatches',
    toggleKey: 'trackDispatches',
    instructionKey: 'dispatchesInstruction',
    showCardKey: 'showDispatchesInWidget',
    supportsCardDisplay: false,
  },
  npc_conditions: {
    title: 'NPC Conditions & Status Tags',
    defaultIcon: '⚡',
    defaultLabel: 'NPC Conditions',
    toggleKey: 'trackNpcConditions',
    instructionKey: 'npcConditionsInstruction',
    supportsCardDisplay: false,
  },
  npc_secrets: {
    title: 'NPC Secrets & Clues',
    defaultIcon: '🕵️',
    defaultLabel: 'NPC Secrets & Clues',
    toggleKey: 'trackNpcSecrets',
    instructionKey: 'npcSecretsInstruction',
    supportsCardDisplay: false,
  },
};

export function resolveBuiltInTrackerConfig(
  core: CoreTrackersConfig | undefined,
  id: BuiltInTrackerId,
): BuiltInTrackerConfig & { enabled: boolean; showCard: boolean } {
  const defaults = defaultCoreTrackersConfig();
  const merged = { ...defaults, ...(core ?? {}) };
  const meta = BUILTIN_TRACKER_META[id];
  const ov = merged.overrides?.[id] ?? {};

  const enabled = merged[meta.toggleKey] !== false;
  const showCard = meta.showCardKey ? merged[meta.showCardKey] !== false : true;
  const label =
    ov.label ||
    (meta.labelKey ? String(merged[meta.labelKey] ?? '') : '') ||
    meta.defaultLabel;
  const instruction =
    ov.instruction ??
    String(merged[meta.instructionKey] ?? defaults[meta.instructionKey] ?? '');

  return {
    enabled,
    showCard,
    icon: ov.icon || meta.defaultIcon,
    label,
    instruction,
    color: ov.color || 'var(--lumiverse-primary)',
    displayStyle: ov.displayStyle ?? 'auto',
    layoutSpan: ov.layoutSpan ?? 'full',
    widgetTabId: ov.widgetTabId ?? (id === 'quests' || id === 'dispatches' ? 'world' : 'stats'),
    inlineTabId: ov.inlineTabId ?? (id === 'quests' || id === 'dispatches' ? 'world' : 'stats'),
    pinnedToHeader: Boolean(ov.pinnedToHeader),
    locked: Boolean(ov.locked),
    deleted: Boolean(ov.deleted),
  };
}

/**
 * Full Editor Modal for the Scene Pill (`date`, `time`, `location`, `weather`, `mins` & chip visibility).
 */
export function openScenePillEditorModal(ctrl: LumiFrontendController): void {
  const tpl = structuredClone(ctrl.snapshot.template);
  const defaults = defaultCoreTrackersConfig();
  const core: CoreTrackersConfig = {
    ...defaults,
    ...(tpl.coreTrackers ?? {}),
  };

  ctrl.modals.open(
    { title: '📍 Customize Scene Pill & AI Prompt Rules (Date, Time, Location, Weather)', width: 640, maxHeight: 820 },
    (body, close, _handle, modalScope) => {
      const chips = { ...tpl.theme.showSceneChips };
      let locked = Boolean(core.scenePillLocked);

      const chipCard = el('section', 'ls-card');
      chipCard.append(
        el('span', 'ls-kicker', 'Visible Pill Chips & Lock'),
        el('p', 'ls-muted', 'Choose which scene tokens appear in the Scene Pill & Header, or lock the pill so AI turns never alter the clock/location.'),
      );

      const chipGrid = el('div', 'ls-grid');
      for (const [key, lbl] of [
        ['location', '📍 Location'],
        ['time', '🕰️ Clock Time'],
        ['date', '📅 Date / Era'],
        ['weather', '🌦️ Weather'],
        ['cast', '👤 Present Cast'],
        ['pinnedStats', '📌 Pinned Stats'],
      ] as const) {
        const row = el('div', 'ls-row-between ls-stat-cell');
        row.append(el('span', '', lbl));
        const swSlot = el('div');
        row.append(swSlot);
        mountNativeSwitch(ctrl, modalScope, swSlot, {
          checked: Boolean(chips[key]),
          ariaLabel: lbl,
          onChange: v => {
            chips[key] = v;
          },
        });
        chipGrid.append(row);
      }

      const lockRow = el('div', 'ls-row-between ls-stat-cell');
      lockRow.append(el('span', '', '🔒 Lock Scene Pill (Prevent AI from changing Date/Time/Location/Weather)'));
      const lockSlot = el('div');
      lockRow.append(lockSlot);
      mountNativeSwitch(ctrl, modalScope, lockSlot, {
        checked: locked,
        ariaLabel: 'Lock Scene Pill',
        onChange: v => {
          locked = v;
        },
      });
      chipCard.append(chipGrid, lockRow);
      body.append(chipCard);

      // Editable AI Prompt Instructions for each Scene Pill field
      const promptHost = el('div');
      body.append(promptHost);
      const promptBody = mountNativeCollapsible(ctrl, modalScope, promptHost, {
        title: 'AI Extraction Prompts for Pill Fields (Location, Time, Date, Weather)',
        iconName: 'sliders',
        defaultExpanded: true,
      });

      const makePromptField = (
        label: string,
        val: string,
        placeholder: string,
      ): HTMLTextAreaElement => {
        const wrap = el('div', 'ls-label');
        const head = el('div', 'ls-row-between');
        const area = el('textarea', 'ls-input');
        area.rows = 2;
        area.value = val;
        area.placeholder = placeholder;
        head.append(
          el('span', '', label),
          btn('⛶ Full-Screen', () => {
            void ctrl
              .request('textEditor:open', {
                title: `Scene Pill Prompt: ${label}`,
                value: area.value,
                placeholder,
              })
              .then(res => {
                if (!res.cancelled && typeof res.text === 'string') {
                  area.value = res.text;
                }
              });
          }, 'ls-btn-sm'),
        );
        wrap.append(head, area);
        promptBody.append(wrap);
        return area;
      };

      const locArea = makePromptField(
        '📍 Location Prompt Rule',
        core.sceneLocationInstruction ?? defaults.sceneLocationInstruction ?? '',
        'e.g. Format as "Room, Building" or "Landmark, District".',
      );
      const timeArea = makePromptField(
        '🕰️ Time Prompt Rule',
        core.sceneTimeInstruction ?? defaults.sceneTimeInstruction ?? '',
        'e.g. Use 24-hour military clock, or narrative time like "Late Evening".',
      );
      const dateArea = makePromptField(
        '📅 Date / Era Prompt Rule',
        core.sceneDateInstruction ?? defaults.sceneDateInstruction ?? '',
        'e.g. Format as "Year 412, Frostfall 14" or "Oct 14, 2002".',
      );
      const weatherArea = makePromptField(
        '🌦️ Weather & Atmosphere Prompt Rule',
        core.sceneWeatherInstruction ?? defaults.sceneWeatherInstruction ?? '',
        'e.g. Keep to 2–4 vivid words like "Neon Drizzle" or "Warm Indoor Steam".',
      );
      const flowArea = makePromptField(
        '⏱️ Time Progression ("mins") Prompt Rule',
        core.sceneTimeFlowInstruction ?? defaults.sceneTimeFlowInstruction ?? '',
        'e.g. Estimate realistic elapsed minutes per turn.',
      );

      const footer = el('div', 'ls-row-between');
      footer.style.marginTop = '12px';
      footer.append(
        btn('↺ Reset Default Prompts', () => {
          locArea.value = defaults.sceneLocationInstruction ?? '';
          timeArea.value = defaults.sceneTimeInstruction ?? '';
          dateArea.value = defaults.sceneDateInstruction ?? '';
          weatherArea.value = defaults.sceneWeatherInstruction ?? '';
          flowArea.value = defaults.sceneTimeFlowInstruction ?? '';
        }, 'ls-btn-sm'),
        btn('💾 Save Scene Pill Config', () => {
          const liveTpl = structuredClone(ctrl.snapshot.template);
          const liveCore: CoreTrackersConfig = {
            ...defaults,
            ...(liveTpl.coreTrackers ?? {}),
          };
          void ctrl.request('state:mutate', {
            templatePatch: {
              theme: { ...liveTpl.theme, showSceneChips: chips },
              coreTrackers: {
                ...liveCore,
                scenePillLocked: locked,
                sceneLocationInstruction: locArea.value.trim(),
                sceneTimeInstruction: timeArea.value.trim(),
                sceneDateInstruction: dateArea.value.trim(),
                sceneWeatherInstruction: weatherArea.value.trim(),
                sceneTimeFlowInstruction: flowArea.value.trim(),
              },
            },
            reason: 'Updated Scene Pill prompt rules & visibility',
          });
          ctrl.notify('Saved Scene Pill prompt rules.');
          close();
        }, 'ls-btn-primary'),
      );
      body.append(footer);
    },
  );
}

/**
 * Full Edit Modal for ANY Built-In / Hardcoded Core Tracker (matching custom stats).
 */
export function openBuiltinTrackerModal(
  ctrl: LumiFrontendController,
  id: BuiltInTrackerId,
): void {
  const tpl = structuredClone(ctrl.snapshot.template);
  const defaults = defaultCoreTrackersConfig();
  const core: CoreTrackersConfig = {
    ...defaults,
    ...(tpl.coreTrackers ?? {}),
    overrides: { ...(tpl.coreTrackers?.overrides ?? {}) },
  };
  const meta = BUILTIN_TRACKER_META[id];
  const resolved = resolveBuiltInTrackerConfig(core, id);

  ctrl.modals.open(
    { title: `✏️ Full Edit Built-In Tracker: ${meta.title}`, width: 640, maxHeight: 820 },
    (body, close, _handle, modalScope) => {
      let enabled = resolved.enabled;
      let showCard = resolved.showCard;
      let locked = Boolean(resolved.locked);
      let selectedStyle: StatDisplayStyle = resolved.displayStyle ?? 'auto';
      let selectedSpan: StatLayoutSpan = resolved.layoutSpan ?? 'full';
      let selectedColor = resolved.color || 'var(--lumiverse-primary)';
      let selectedWTab = resolved.widgetTabId || 'stats';
      let selectedITab = resolved.inlineTabId || 'stats';

      const topGrid = el('div', 'ls-grid');
      const iconWrap = el('label', 'ls-label', 'Icon');
      const iconInp = el('input', 'ls-input');
      iconInp.value = resolved.icon || meta.defaultIcon;
      iconWrap.append(iconInp);

      const labelWrap = el('label', 'ls-label', 'Display Label');
      const labelInp = el('input', 'ls-input');
      labelInp.value = resolved.label || meta.defaultLabel;
      labelWrap.append(labelInp);
      topGrid.append(iconWrap, labelWrap);
      body.append(topGrid);

      const switchGrid = el('div', 'ls-grid');
      const enRow = el('div', 'ls-row-between ls-stat-cell');
      enRow.append(el('span', '', '✓ Track in AI Prompts'));
      const enSlot = el('div');
      enRow.append(enSlot);
      mountNativeSwitch(ctrl, modalScope, enSlot, {
        checked: enabled,
        onChange: v => {
          enabled = v;
        },
      });
      switchGrid.append(enRow);

      if (meta.supportsCardDisplay) {
        const cardRow = el('div', 'ls-row-between ls-stat-cell');
        cardRow.append(el('span', '', '🪟 Show Card in Widget / Inline'));
        const cardSlot = el('div');
        cardRow.append(cardSlot);
        mountNativeSwitch(ctrl, modalScope, cardSlot, {
          checked: showCard,
          onChange: v => {
            showCard = v;
          },
        });
        switchGrid.append(cardRow);
      }

      const lockRow = el('div', 'ls-row-between ls-stat-cell');
      lockRow.append(el('span', '', '🔒 Lock Value (Skip AI Updates)'));
      const lockSlot = el('div');
      lockRow.append(lockSlot);
      mountNativeSwitch(ctrl, modalScope, lockSlot, {
        checked: locked,
        onChange: v => {
          locked = v;
        },
      });
      switchGrid.append(lockRow);
      body.append(switchGrid);

      // Visual Style & Routing Section
      const styleHost = el('div');
      body.append(styleHost);
      const styleBody = mountNativeCollapsible(ctrl, modalScope, styleHost, {
        title: 'Display Style, Color & Tab Routing',
        iconName: 'palette',
        defaultExpanded: true,
      });

      const styleGrid = el('div', 'ls-grid');
      const sWrap = el('div', 'ls-label', 'Visual Display Style');
      const sSlot = el('div');
      sWrap.append(sSlot);
      mountThemedSelect(ctrl, modalScope, sSlot, {
        value: selectedStyle,
        ariaLabel: 'Visual Display Style',
        options: [
          { value: 'auto', label: '✨ Smart Auto-Detect' },
          { value: 'arc_tracker', label: '🎯 Multi-Thread / Arc / Quest Cards' },
          { value: 'accordion_cards', label: '🗂️ Collapsible Multi-Entry Cards' },
          { value: 'matrix_badges', label: '⚖️ Split / Versus Comparison (Knows vs Blind)' },
          { value: 'meter_mini_bars', label: '📊 Multi-Bar Mini Gauges (HP/MP cur/max)' },
          { value: 'stat_pills_grid', label: '🧬 Compact Stat Badges (Lv / P A I / POW)' },
          { value: 'bullet_ledger', label: '💰 Aligned Bullet & Currency Ledger' },
          { value: 'timeline_list', label: '📜 Vertical Event Timeline' },
          { value: 'checklist', label: '☑️ Visual Objectives Checklist' },
          { value: 'feed_cards', label: '🃏 Structured Flow Cards' },
          { value: 'step_chain', label: '⛓️ Horizontal Step Chain' },
          { value: 'key_value', label: '📋 Key–Value Table' },
          { value: 'pill_list', label: '🏷️ Tag / Pill List' },
          { value: 'quote_callout', label: '💭 Quote Callout Box' },
        ],
        onChange: v => {
          selectedStyle = v as StatDisplayStyle;
        },
      });

      const spanWrap = el('div', 'ls-label', 'Card Grid Width');
      const spanSlot = el('div');
      spanWrap.append(spanSlot);
      mountThemedSelect(ctrl, modalScope, spanSlot, {
        value: selectedSpan,
        ariaLabel: 'Card Grid Width',
        options: [
          { value: 'full', label: '↔️ Full Width' },
          { value: 'auto', label: '📐 Auto' },
          { value: 'half', label: '▫ Compact Column' },
        ],
        onChange: v => {
          selectedSpan = v as StatLayoutSpan;
        },
      });
      styleGrid.append(sWrap, spanWrap);
      styleBody.append(styleGrid);

      if (meta.supportsCardDisplay) {
        const tabGrid = el('div', 'ls-grid');
        const wWrap = el('div', 'ls-label', 'Widget Tab');
        const wSlot = el('div');
        wWrap.append(wSlot);
        mountThemedSelect(ctrl, modalScope, wSlot, {
          value: selectedWTab,
          ariaLabel: 'Widget Tab',
          options: tpl.surfaces.widgetTabs.map(t => ({ value: t.id, label: `${t.icon} ${t.label}` })),
          onChange: v => {
            selectedWTab = v;
          },
        });

        const iWrap = el('div', 'ls-label', 'Inline Ribbon Tab');
        const iSlot = el('div');
        iWrap.append(iSlot);
        mountThemedSelect(ctrl, modalScope, iSlot, {
          value: selectedITab,
          ariaLabel: 'Inline Ribbon Tab',
          options: tpl.surfaces.inlineTabs.map(t => ({ value: t.id, label: `${t.icon} ${t.label}` })),
          onChange: v => {
            selectedITab = v;
          },
        });
        tabGrid.append(wWrap, iWrap);
        styleBody.append(tabGrid);
      }

      const colorWrap = el('div', 'ls-label', 'Accent Color');
      const colorRow = el('div', 'ls-row');
      const syncSwatches = () => {
        for (const b of [...colorRow.querySelectorAll<HTMLButtonElement>('.ls-color-swatch')]) {
          b.setAttribute('aria-pressed', String(b.dataset.colorVal === selectedColor));
        }
      };
      for (const [val, lbl, preview] of [
        ['var(--lumiverse-primary)', 'Theme Primary', 'var(--lumiverse-primary, #38bdf8)'],
        ['#38bdf8', 'Sky', '#38bdf8'],
        ['#f472b6', 'Rose', '#f472b6'],
        ['#f59e0b', 'Amber', '#f59e0b'],
        ['#10b981', 'Emerald', '#10b981'],
        ['#a78bfa', 'Violet', '#a78bfa'],
        ['#f43f5e', 'Crimson', '#f43f5e'],
      ] as const) {
        const b = btn('', () => {
          selectedColor = val;
          syncSwatches();
        }, 'ls-color-swatch', lbl);
        b.dataset.colorVal = val;
        b.style.background = preview;
        colorRow.append(b);
      }
      syncSwatches();
      colorWrap.append(colorRow);
      styleBody.append(colorWrap);

      // AI Prompt Section
      const promptHost = el('div');
      body.append(promptHost);
      const promptBody = mountNativeCollapsible(ctrl, modalScope, promptHost, {
        title: 'AI Extraction Prompt Rule',
        iconName: 'sparkles',
        defaultExpanded: true,
      });

      const promptHead = el('div', 'ls-row-between');
      const promptArea = el('textarea', 'ls-input');
      promptArea.rows = 3;
      promptArea.value = resolved.instruction ?? '';
      promptArea.placeholder = 'Tell the AI exactly how and when to extract or format this tracker…';

      promptHead.append(
        el('span', 'ls-muted', 'Prompt instruction sent to the AI extractor:'),
        btn('⛶ Full-Screen Editor', () => {
          void ctrl
            .request('textEditor:open', {
              title: `Built-In Prompt: ${labelInp.value || meta.title}`,
              value: promptArea.value,
              placeholder: 'Describe formatting, triggers, and when the AI should update this built-in tracker…',
            })
            .then(res => {
              if (!res.cancelled && typeof res.text === 'string') {
                promptArea.value = res.text;
              }
            });
        }, 'ls-btn-sm'),
      );
      promptBody.append(promptHead, promptArea);

      const footer = el('div', 'ls-row-between');
      footer.style.marginTop = '12px';
      const leftBtns = el('div', 'ls-row');
      leftBtns.append(
        btn('↺ Reset Default', () => {
          iconInp.value = meta.defaultIcon;
          labelInp.value = meta.defaultLabel;
          promptArea.value = String(defaults[meta.instructionKey] ?? '');
          selectedColor = 'var(--lumiverse-primary)';
          selectedStyle = 'auto';
          selectedSpan = 'full';
          syncSwatches();
        }, 'ls-btn-sm'),
        btn('🗑️ Delete Built-In', async () => {
          const ok = await ctrl.modals.confirm({
            title: `Remove "${meta.defaultLabel}"?`,
            message: `Disable and remove "${meta.defaultLabel}" from active tracking and Studio? (You can restore deleted built-ins anytime from Studio.)`,
            confirmLabel: 'Delete',
            variant: 'danger',
          });
          if (!ok) return;
          const liveTpl = structuredClone(ctrl.snapshot.template);
          const liveCore: CoreTrackersConfig = {
            ...defaults,
            ...(liveTpl.coreTrackers ?? {}),
            overrides: { ...(liveTpl.coreTrackers?.overrides ?? {}) },
          };
          const nextCore: CoreTrackersConfig = {
            ...liveCore,
            [meta.toggleKey]: false,
            ...(meta.showCardKey ? { [meta.showCardKey]: false } : {}),
            overrides: {
              ...(liveCore.overrides ?? {}),
              [id]: {
                ...(liveCore.overrides?.[id] ?? {}),
                deleted: true,
              },
            },
          };
          void ctrl.request('state:mutate', {
            templatePatch: { coreTrackers: nextCore },
            reason: `Deleted built-in tracker "${meta.defaultLabel}"`,
          });
          ctrl.notify(`Removed "${meta.defaultLabel}".`);
          close();
        }, 'ls-btn-sm ls-btn-danger'),
      );
      footer.append(
        leftBtns,
        btn('💾 Save Built-In Tracker', () => {
          const nextLabel = labelInp.value.trim() || meta.defaultLabel;
          const nextInst = promptArea.value.trim();
          const liveTpl = structuredClone(ctrl.snapshot.template);
          const liveCore: CoreTrackersConfig = {
            ...defaults,
            ...(liveTpl.coreTrackers ?? {}),
            overrides: { ...(liveTpl.coreTrackers?.overrides ?? {}) },
          };
          const nextCore: CoreTrackersConfig = {
            ...liveCore,
            [meta.toggleKey]: enabled,
            ...(meta.labelKey ? { [meta.labelKey]: nextLabel } : {}),
            [meta.instructionKey]: nextInst,
            ...(meta.showCardKey ? { [meta.showCardKey]: showCard } : {}),
            overrides: {
              ...(liveCore.overrides ?? {}),
              [id]: {
                icon: iconInp.value.trim() || meta.defaultIcon,
                label: nextLabel,
                instruction: nextInst,
                color: selectedColor,
                displayStyle: selectedStyle,
                layoutSpan: selectedSpan,
                widgetTabId: selectedWTab,
                inlineTabId: selectedITab,
                locked,
                deleted: false,
              },
            },
          };

          void ctrl.request('state:mutate', {
            templatePatch: { coreTrackers: nextCore },
            reason: `Customized built-in tracker "${nextLabel}"`,
          });
          ctrl.notify(`Saved "${nextLabel}".`);
          close();
        }, 'ls-btn-primary'),
      );
      body.append(footer);
    },
  );
}
