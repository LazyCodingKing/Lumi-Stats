import { isTextLikeStat } from '../../../shared/prompt-compiler';
import {
  createStatSchema,
  defaultDossierFields,
  slugifyKey,
} from '../../../shared/templates';
import type {
  BuiltInTrackerId,
  LumiStatsTemplate,
  StatSchemaDef,
  StatScope,
  StatValueKind,
  StatVolatility,
} from '../../../shared/types';
import {
  btn,
  el,
  iconBtn,
  mountNativeCollapsible,
  mountNativeSwitch,
  type ComponentScope,
  type LumiFrontendController,
} from '../../controller';
import {
  openBuiltinTrackerModal,
  openScenePillEditorModal,
  resolveBuiltInTrackerConfig,
} from '../BuiltinTrackerModals';
import { openDossierFieldModal } from '../CastDossier';
import { openStatCategoryModal } from '../CategoryModals';
import {
  openDuplicateStatModal,
  openSandboxTesterModal,
  openStatSchemaModal,
} from '../StatGrid';

type StatsFilterCategory =
  | 'all'
  | 'categories'
  | 'scene_world'
  | 'player'
  | 'character'
  | 'dossier'
  | 'builtin';

let activeStatsFilter: StatsFilterCategory = 'all';
let statsSearchQuery = '';

const QUICK_ADD_STAT_PRESETS: ReadonlyArray<{
  id?: string;
  label: string;
  icon: string;
  scope: StatScope;
  kind: StatValueKind;
  min: number;
  max: number;
  defaultValue: number | string;
  volatility: StatVolatility;
  pinnedToHeader?: boolean;
  triggerCues: string;
}> = [
  {
    id: 'present',
    label: 'Present & Away',
    icon: '👥',
    scope: 'scene',
    kind: 'text',
    min: 0,
    max: 100,
    defaultValue: 'Present: [], Away: []',
    volatility: 'momentary',
    pinnedToHeader: true,
    triggerCues: 'Format: Present: [List NPCs present in the scene], Away: [List NPCs away/offscreen]. Update EVERY turn whenever anyone enters, leaves, or the scene moves to a new location.',
  },
  {
    label: 'Blush & Fluster',
    icon: '💓',
    scope: 'character',
    kind: 'meter',
    min: 0,
    max: 100,
    defaultValue: 0,
    volatility: 'momentary',
    triggerCues: '0–100 scale. Spikes immediately on teasing, eye contact, state of undress, or closeness; cools down in calm talk.',
  },
  {
    label: 'Jealousy & Possessiveness',
    icon: '🔥',
    scope: 'character',
    kind: 'meter',
    min: 0,
    max: 100,
    defaultValue: 10,
    volatility: 'momentary',
    triggerCues: '0–100 scale. Rises when the player praises, flirts with, or prioritizes another rival.',
  },
  {
    label: 'Respect & Standing',
    icon: '👑',
    scope: 'character',
    kind: 'meter',
    min: 0,
    max: 100,
    defaultValue: 50,
    volatility: 'progressive',
    triggerCues: '0–100 scale. Rises when the player shows competence, poise, or backbone; drops on weakness.',
  },
  {
    label: 'Suspicion',
    icon: '🔍',
    scope: 'character',
    kind: 'meter',
    min: 0,
    max: 100,
    defaultValue: 15,
    volatility: 'progressive',
    triggerCues: '0–100 scale. Increases when catching inconsistencies, secrets, or unusual behavior.',
  },
  {
    label: 'Stamina & Energy',
    icon: '⚡',
    scope: 'player',
    kind: 'meter',
    min: 0,
    max: 100,
    defaultValue: 100,
    volatility: 'momentary',
    triggerCues: '0–100 scale. Spent during physical exertion, combat, or sleepless nights; restored by rest or meals.',
  },
  {
    label: 'Danger / Event Clock',
    icon: '⏱️',
    scope: 'world',
    kind: 'clock',
    min: 0,
    max: 6,
    defaultValue: 0,
    volatility: 'progressive',
    triggerCues: '0–6 segments. Advance by +1 segment as an approaching confrontation, deadline, or alarm draws closer.',
  },
  {
    label: 'Skill Tree & SP',
    icon: '🌳',
    scope: 'player',
    kind: 'skill_tree',
    min: 0,
    max: 100,
    defaultValue: 0,
    volatility: 'progressive',
    triggerCues: 'Format: "SP: N | Skill A (Lv.X/Y, cost:1, bonus) ; Skill B (Lv.X/Y, cost:1, req:Skill A)". Award SP on milestones.',
  },
  {
    label: 'Level & XP',
    icon: '⭐',
    scope: 'player',
    kind: 'xp_level',
    min: 0,
    max: 100,
    defaultValue: 0,
    volatility: 'progressive',
    triggerCues: 'Format: "Lv. N | cur/next XP | Rank X". Award XP on quests/battles; level up when cur >= next.',
  },
  {
    label: 'Core Attributes',
    icon: '🧬',
    scope: 'player',
    kind: 'attributes',
    min: 1,
    max: 30,
    defaultValue: 10,
    volatility: 'anchor',
    triggerCues: 'Comma-separated stats: "STR:N, DEX:N, CON:N, INT:N, WIS:N, CHA:N".',
  },
  {
    label: 'Gear & Inventory',
    icon: '🎒',
    scope: 'player',
    kind: 'inventory',
    min: 0,
    max: 100,
    defaultValue: 0,
    volatility: 'progressive',
    triggerCues: 'Separate items by "; " with qty & rarity tags: "Runed Blade [rare, equipped] ; Potion x3 [common]".',
  },
  {
    label: 'Buffs & Debuffs',
    icon: '⚡',
    scope: 'player',
    kind: 'status_fx',
    min: 0,
    max: 100,
    defaultValue: 0,
    volatility: 'momentary',
    triggerCues: 'Prefix buffs with "+" and debuffs with "-" separated by "; ", e.g. "+Shielded (2t) ; -Exhausted (1t)".',
  },
  {
    label: 'Gold / Credits',
    icon: '🪙',
    scope: 'player',
    kind: 'currency',
    min: 0,
    max: 99999999,
    defaultValue: 100,
    volatility: 'progressive',
    triggerCues: 'Track currency. Emit +N / -N on rewards, loot, or spending.',
  },
];

const BUILTIN_IDS: ReadonlyArray<{ id: BuiltInTrackerId; group: 'player' | 'scene_world' | 'character' }> = [
  { id: 'player_attire', group: 'player' },
  { id: 'player_condition', group: 'player' },
  { id: 'player_action', group: 'player' },
  { id: 'scene_summary', group: 'scene_world' },
  { id: 'scene_presence', group: 'scene_world' },
  { id: 'places', group: 'scene_world' },
  { id: 'quests', group: 'scene_world' },
  { id: 'dispatches', group: 'scene_world' },
  { id: 'npc_conditions', group: 'character' },
  { id: 'npc_secrets', group: 'character' },
];

export function renderStudioStatsTab(
  ctrl: LumiFrontendController,
  compScope: ComponentScope,
  tpl: LumiStatsTemplate,
  saveTemplatePatch: (
    patch:
      | Partial<LumiStatsTemplate>
      | ((live: LumiStatsTemplate) => Partial<LumiStatsTemplate>),
    reason?: string,
  ) => void,
  forceRedraw: () => void,
): HTMLElement {
  const wrap = el('div', 'ls-stack');

  // 1. Top Toolbar: Search + Add Stat + Sandbox
  const topBar = el('div', 'ls-row-between');
  const searchInp = el('input', 'ls-input');
  searchInp.style.cssText = 'flex:1 1 220px;min-width:160px;';
  searchInp.placeholder = 'Search stats, meters, built-ins, or dossier fields…';
  searchInp.value = statsSearchQuery;

  const actionCluster = el('div', 'ls-row');
  actionCluster.append(
    iconBtn('flask', () => openSandboxTesterModal(ctrl), {
      label: 'Test Sandbox',
      className: 'ls-btn-sm',
    }),
    iconBtn('plus', () => openStatCategoryModal(ctrl), {
      label: 'New Category',
      className: 'ls-btn-sm',
      title: 'Create a custom Stat Category with shared AI/local rules',
    }),
    iconBtn('plus', () => openStatSchemaModal(ctrl, 'character'), {
      label: 'New Stat',
      className: 'ls-btn-sm ls-btn-primary',
    }),
  );
  topBar.append(searchInp, actionCluster);
  wrap.append(topBar);

  // 2. Category Filter Pills
  const filterRow = el('div', 'ls-subnav-pills');
  for (const [fId, fLbl] of [
    ['all', 'All Trackers'],
    ['categories', `Categories (${(tpl.categories ?? []).length})`],
    ['character', 'NPC Meters'],
    ['player', 'Player Stats'],
    ['scene_world', 'Scene & World'],
    ['builtin', 'Built-Ins & Pill'],
    ['dossier', 'Dossier Fields'],
  ] as const) {
    const b = btn(fLbl, () => {
      activeStatsFilter = fId;
      forceRedraw();
    }, 'ls-btn-sm');
    if (activeStatsFilter === fId) b.setAttribute('aria-current', 'page');
    filterRow.append(b);
  }
  wrap.append(filterRow);

  // 3. Quick-Add Popular Stats (Remembers open state across clicks)
  const quickHost = el('div');
  wrap.append(quickHost);
  const quickBody = mountNativeCollapsible(ctrl, compScope, quickHost, {
    title: '1-Click Quick-Add Popular Stats',
    iconName: 'sparkles',
    badge: QUICK_ADD_STAT_PRESETS.length,
    defaultExpanded: false,
    persistKey: 'studio_stats_quick_add',
  });
  const quickRow = el('div', 'ls-row');
  for (const item of QUICK_ADD_STAT_PRESETS) {
    const targetId = item.id ?? slugifyKey(item.label, 'stat');
    const exists = tpl.stats.some(s => s.id === targetId);
    const b = btn(
      `${exists ? '✓ ' : '+ '}${item.icon} ${item.label}`,
      () => {
        const created = createStatSchema({
          ...(item.id ? { id: item.id } : {}),
          label: item.label,
          icon: item.icon,
          scope: item.scope,
          kind: item.kind,
          min: item.min,
          max: item.max,
          defaultValue: item.defaultValue,
          volatility: item.volatility,
          ...(item.pinnedToHeader ? { pinnedToHeader: true } : {}),
          triggerCues: item.triggerCues,
        });
        saveTemplatePatch(
          live => ({ stats: [...live.stats.filter(s => s.id !== created.id), created] }),
          `Added stat "${created.label}"`,
        );
        ctrl.notify(`Added "${created.icon} ${created.label}".`);
      },
      `ls-btn-sm ls-quick-pill ${exists ? 'ls-chip-accent' : ''}`,
      item.triggerCues,
    );
    quickRow.append(b);
  }
  quickBody.append(quickRow);

  const listHost = el('div', 'ls-stack');
  wrap.append(listHost);

  const renderFilteredLists = () => {
    listHost.replaceChildren();
    const q = statsSearchQuery.trim().toLowerCase();
    const matchesQuery = (text: string) => !q || text.toLowerCase().includes(q);

    // 4. Scene Pill Card (Editable AI Prompts & Visible Chips!)
    if (
      (activeStatsFilter === 'all' || activeStatsFilter === 'scene_world' || activeStatsFilter === 'builtin') &&
      matchesQuery('scene pill location time date weather clock')
    ) {
      const pillRow = el('div', 'ls-stat-row-compact');
      pillRow.style.borderLeft = '3px solid var(--ls-primary)';
      const left = el('div', 'ls-row');
      left.append(
        el('strong', '', '📍 Scene Pill (Location, Time, Date, Weather)'),
        el('span', 'ls-chip ls-chip-accent', tpl.coreTrackers?.scenePillLocked ? '🔒 Locked' : 'Built-In Pill'),
      );
      const right = el('div', 'ls-row');
      right.append(
        btn('Full Edit & Prompts', () => openScenePillEditorModal(ctrl), 'ls-btn-sm ls-btn-primary'),
      );
      pillRow.append(left, right);
      listHost.append(pillRow);
    }

    // Helper: Compact, beginner-friendly Stat Row
    const renderCompactStatRow = (schema: StatSchemaDef) => {
      const row = el('div', 'ls-stat-row-compact');
      row.style.borderLeft = `3px solid ${schema.color || 'var(--ls-primary)'}`;

      const left = el('div', 'ls-row');
      left.style.minWidth = '0';
      const swSlot = el('div');
      mountNativeSwitch(ctrl, compScope, swSlot, {
        checked: schema.enabled,
        ariaLabel: `Toggle ${schema.label}`,
        onChange: on => {
          saveTemplatePatch(live => ({
            stats: live.stats.map(s => (s.id === schema.id ? { ...s, enabled: on } : s)),
          }));
        },
      });

      const showRange = !isTextLikeStat(schema) && schema.kind !== 'boolean';
      const typeLabel = showRange ? `${schema.kind} (${schema.min}–${schema.max})` : schema.kind;
      const scopeLabel = schema.scope === 'character' ? 'NPC' : schema.scope;

      const modeBadge =
        schema.calculationMode === 'ai_plus_local'
          ? '🔀 Hybrid'
          : schema.calculationMode === 'local_formula' ||
              (Boolean(schema.formula?.trim()) && schema.calculationMode !== 'ai')
            ? '⚡ Local'
            : '🤖 AI';
      left.append(
        swSlot,
        el('strong', '', `${schema.icon} ${schema.label}`),
        el('span', 'ls-chip', `${scopeLabel} · ${typeLabel}`),
        el('span', `ls-chip ${modeBadge !== '🤖 AI' ? 'ls-chip-accent' : ''}`, modeBadge),
        ...(schema.promptTriggerMode === 'conditional' ? [el('span', 'ls-chip', '🔍 Conditional')] : []),
        ...(schema.pinnedToHeader ? [el('span', 'ls-chip ls-chip-accent', 'Pinned')] : []),
        ...(schema.locked ? [el('span', 'ls-chip', '🔒')] : []),
      );

      const right = el('div', 'ls-row');
      right.style.flex = 'none';
      right.append(
        btn('Full Edit', () => openStatSchemaModal(ctrl, schema.scope, schema), 'ls-btn-sm'),
        iconBtn('trash', () => {
          saveTemplatePatch(live => ({
            stats: live.stats.filter(s => s.id !== schema.id),
          }), `Deleted stat "${schema.label}"`);
          ctrl.notify(`Deleted "${schema.icon} ${schema.label}".`);
        }, {
          className: 'ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger',
          title: `Delete "${schema.label}"`,
        }),
        iconBtn(
          'more',
          async e => {
            if (typeof ctrl.ctx.ui?.showContextMenu !== 'function') {
              openStatSchemaModal(ctrl, schema.scope, schema);
              return;
            }
            const { selectedKey } = await ctrl.ctx.ui.showContextMenu({
              position: { x: e.clientX, y: e.clientY },
              items: [
                { key: 'edit', label: 'Full Edit (Style, Tabs & AI Prompt)' },
                { key: 'pin', label: schema.pinnedToHeader ? 'Unpin from Pill' : 'Pin to Scene Pill', active: schema.pinnedToHeader },
                { key: 'lock', label: schema.locked ? 'Unlock Value' : 'Lock Value', active: schema.locked },
                { key: 'duplicate', label: 'Duplicate to Another Scope / Tab…' },
                { key: 'test', label: 'Test in AI Sandbox' },
                { key: 'div', label: '', type: 'divider' },
                { key: 'delete', label: 'Delete Stat', danger: true },
              ],
            });
            if (selectedKey === 'edit') openStatSchemaModal(ctrl, schema.scope, schema);
            else if (selectedKey === 'pin') {
              saveTemplatePatch(live => ({
                stats: live.stats.map(s =>
                  s.id === schema.id
                    ? {
                        ...s,
                        pinnedToHeader: !s.pinnedToHeader,
                        showIn: { ...s.showIn, pinnedHeader: !s.pinnedToHeader },
                      }
                    : s,
                ),
              }));
            } else if (selectedKey === 'lock') {
              saveTemplatePatch(live => ({
                stats: live.stats.map(s =>
                  s.id === schema.id ? { ...s, locked: !s.locked } : s,
                ),
              }));
            } else if (selectedKey === 'duplicate') {
              openDuplicateStatModal(ctrl, schema);
            } else if (selectedKey === 'test') {
              openSandboxTesterModal(ctrl, schema.id);
            } else if (selectedKey === 'delete') {
              saveTemplatePatch(live => ({
                stats: live.stats.filter(s => s.id !== schema.id),
              }));
            }
          },
          { className: 'ls-btn-sm ls-btn-icon ls-btn-ghost', title: 'More actions' },
        ),
      );

      row.append(left, right);
      return row;
    };

    // 5. Custom Stat Categories + Member Stats (preserving every stat's own rules intact)
    const definedCategories = [...(tpl.categories ?? [])].sort((a, b) => a.order - b.order);
    const categoryIdSet = new Set(definedCategories.map(c => c.id));

    const filteredStats = tpl.stats.filter(s => {
      if (activeStatsFilter === 'dossier' || activeStatsFilter === 'builtin') return false;
      if (activeStatsFilter === 'character' && s.scope !== 'character') return false;
      if (activeStatsFilter === 'player' && s.scope !== 'player') return false;
      if (activeStatsFilter === 'scene_world' && s.scope !== 'world' && s.scope !== 'scene') return false;
      return matchesQuery(`${s.label} ${s.id} ${s.kind} ${s.triggerCues}`);
    });

    if (activeStatsFilter === 'categories' && definedCategories.length === 0) {
      const emptyCat = el('section', 'ls-card');
      emptyCat.append(
        el('strong', '', 'No custom categories created yet'),
        el('p', 'ls-muted', 'Group related stats (e.g. Combat & Power, Romance, Finances) to attach shared AI delta rules, group keyword triggers, or cross-stat local modifiers—while keeping each stat’s own rules intact.'),
        btn('+ Create First Category', () => openStatCategoryModal(ctrl), 'ls-btn-sm ls-btn-primary'),
      );
      listHost.append(emptyCat);
    }

    for (const cat of definedCategories) {
      const members = filteredStats.filter(s => s.categoryId === cat.id);
      if (activeStatsFilter !== 'categories' && members.length === 0 && q) continue;
      if (
        activeStatsFilter !== 'all' &&
        activeStatsFilter !== 'categories' &&
        members.length === 0
      ) {
        continue;
      }

      const catCard = el('section', 'ls-card ls-cat-group');
      catCard.style.borderLeft = `3px solid ${cat.color || 'var(--ls-primary)'}`;
      const catHead = el('div', 'ls-row-between');
      const catLeft = el('div', 'ls-row');
      const catSwSlot = el('div');
      mountNativeSwitch(ctrl, compScope, catSwSlot, {
        checked: cat.enabled,
        ariaLabel: `Toggle category ${cat.name}`,
        onChange: on => {
          saveTemplatePatch(live => ({
            categories: (live.categories ?? []).map(c =>
              c.id === cat.id ? { ...c, enabled: on } : c,
            ),
          }));
        },
      });
      catLeft.append(
        catSwSlot,
        el('strong', '', `${cat.icon} ${cat.name}`),
        el('span', 'ls-chip', `${members.length} stats`),
        ...(cat.aiRule ? [el('span', 'ls-chip ls-chip-accent', 'Shared Rule')] : []),
        ...(cat.localRuleFormula ? [el('span', 'ls-chip ls-chip-accent', '⚡ Local Rule')] : []),
        ...(cat.promptTriggerMode === 'conditional' ? [el('span', 'ls-chip', '🔍 Conditional')] : []),
      );
      const catRight = el('div', 'ls-row');
      catRight.append(
        btn('Edit Group & Rules', () => openStatCategoryModal(ctrl, cat), 'ls-btn-sm'),
      );
      catHead.append(catLeft, catRight);
      catCard.append(catHead);

      if (members.length > 0) {
        const catHost = el('div');
        catCard.append(catHost);
        const catBody = mountNativeCollapsible(ctrl, compScope, catHost, {
          title: `Member Stats (${members.length})`,
          defaultExpanded: !cat.collapsedByDefault,
          persistKey: `studio_cat_${cat.id}`,
        });
        for (const s of members) {
          catBody.append(renderCompactStatRow(s));
        }
      } else {
        catCard.append(el('small', 'ls-muted', 'No stats assigned to this category yet. Click "Edit Group & Rules" to assign stats.'));
      }

      listHost.append(catCard);
    }

    const uncategorizedStats = filteredStats.filter(
      s => !s.categoryId || !categoryIdSet.has(s.categoryId),
    );
    if (uncategorizedStats.length > 0 && activeStatsFilter !== 'categories') {
      const statCard = el('section', 'ls-card');
      const sHead = el('div', 'ls-row-between');
      sHead.append(
        el(
          'h3',
          '',
          definedCategories.length > 0
            ? `Uncategorized Stats (${uncategorizedStats.length})`
            : `Stats & Meters (${uncategorizedStats.length})`,
        ),
        el('span', 'ls-muted', 'Click Full Edit to customize prompt, category, style & formula'),
      );
      statCard.append(sHead);
      for (const s of uncategorizedStats) {
        statCard.append(renderCompactStatRow(s));
      }
      listHost.append(statCard);
    }

    // 6. Built-In Core Trackers (Editable & Deletable!)
    const deletedBuiltinsCount = BUILTIN_IDS.filter(item =>
      Boolean(tpl.coreTrackers?.overrides?.[item.id]?.deleted),
    ).length;

    const filteredBuiltins = BUILTIN_IDS.filter(item => {
      if (activeStatsFilter === 'dossier') return false;
      if (
        activeStatsFilter !== 'all' &&
        activeStatsFilter !== 'builtin' &&
        item.group !== activeStatsFilter
      ) {
        return false;
      }
      const cfg = resolveBuiltInTrackerConfig(tpl.coreTrackers, item.id);
      if (cfg.deleted) return false;
      return matchesQuery(`${item.id} ${cfg.label} ${cfg.instruction}`);
    });

    if (filteredBuiltins.length > 0 || (deletedBuiltinsCount > 0 && (activeStatsFilter === 'all' || activeStatsFilter === 'builtin'))) {
      const builtCard = el('section', 'ls-card');
      const builtHead = el('div', 'ls-row-between');
      const builtRightHead = el('div', 'ls-row');
      if (deletedBuiltinsCount > 0) {
        builtRightHead.append(
          btn(`↺ Restore Deleted (${deletedBuiltinsCount})`, () => {
            saveTemplatePatch(live => {
              const nextOverrides = { ...(live.coreTrackers?.overrides ?? {}) };
              for (const k of Object.keys(nextOverrides) as BuiltInTrackerId[]) {
                if (nextOverrides[k]?.deleted) {
                  nextOverrides[k] = { ...nextOverrides[k], deleted: false };
                }
              }
              return {
                coreTrackers: {
                  ...(live.coreTrackers ?? {}),
                  overrides: nextOverrides,
                } as LumiStatsTemplate['coreTrackers'],
              };
            }, 'Restored deleted built-in trackers');
          }, 'ls-btn-sm ls-btn-ghost'),
        );
      } else {
        builtRightHead.append(el('span', 'ls-muted', 'Editable labels, prompts, styles & tabs'));
      }
      builtHead.append(
        el('h3', '', `Built-In Story Trackers (${filteredBuiltins.length})`),
        builtRightHead,
      );
      builtCard.append(builtHead);

      const toggleMap: Record<BuiltInTrackerId, string> = {
        player_attire: 'trackPlayerAttire',
        player_condition: 'trackPlayerCondition',
        player_action: 'trackPlayerAction',
        scene_summary: 'trackSceneSummary',
        scene_presence: 'trackScenePresence',
        places: 'trackPlaces',
        quests: 'trackQuests',
        dispatches: 'trackDispatches',
        npc_conditions: 'trackNpcConditions',
        npc_secrets: 'trackNpcSecrets',
      };
      const showCardMap: Partial<Record<BuiltInTrackerId, string>> = {
        player_attire: 'showPlayerAttireCard',
        player_condition: 'showPlayerConditionCard',
        player_action: 'showPlayerActionCard',
        scene_summary: 'showSceneSummaryInWidget',
        quests: 'showQuestsInWidget',
        dispatches: 'showDispatchesInWidget',
      };

      for (const item of filteredBuiltins) {
        const cfg = resolveBuiltInTrackerConfig(tpl.coreTrackers, item.id);
        const row = el('div', 'ls-stat-row-compact');
        row.style.borderLeft = `3px solid ${cfg.color || 'var(--ls-primary)'}`;

        const left = el('div', 'ls-row');
        const swSlot = el('div');
        mountNativeSwitch(ctrl, compScope, swSlot, {
          checked: cfg.enabled,
          ariaLabel: `Toggle ${cfg.label}`,
          onChange: on => {
            saveTemplatePatch(live => {
              const core = { ...(live.coreTrackers ?? {}) } as Record<string, unknown>;
              core[toggleMap[item.id]] = on;
              return { coreTrackers: core as unknown as LumiStatsTemplate['coreTrackers'] };
            });
          },
        });
        left.append(
          swSlot,
          el('strong', '', `${cfg.icon || '📊'} ${cfg.label}`),
          el('span', 'ls-chip', 'Built-In'),
          ...(cfg.locked ? [el('span', 'ls-chip', '🔒')] : []),
        );

        const right = el('div', 'ls-row');
        right.append(
          btn('Full Edit', () => openBuiltinTrackerModal(ctrl, item.id), 'ls-btn-sm'),
          iconBtn('trash', () => {
            saveTemplatePatch(live => {
              const core = { ...(live.coreTrackers ?? {}) } as Record<string, unknown>;
              core[toggleMap[item.id]] = false;
              const cardKey = showCardMap[item.id];
              if (cardKey) core[cardKey] = false;
              const prevOv = (core.overrides as Record<string, Record<string, unknown>> | undefined) ?? {};
              core.overrides = {
                ...prevOv,
                [item.id]: {
                  ...(prevOv[item.id] ?? {}),
                  deleted: true,
                },
              };
              return { coreTrackers: core as unknown as LumiStatsTemplate['coreTrackers'] };
            }, `Deleted built-in tracker "${cfg.label}"`);
            ctrl.notify(`Removed "${cfg.label}".`);
          }, {
            className: 'ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger',
            title: `Remove "${cfg.label}"`,
          }),
        );
        row.append(left, right);
        builtCard.append(row);
      }
      listHost.append(builtCard);
    }

    // 7. Character Dossier Fields
    const filteredFields = tpl.dossierFields.filter(f => {
      if (activeStatsFilter !== 'all' && activeStatsFilter !== 'dossier' && activeStatsFilter !== 'character') {
        return false;
      }
      return matchesQuery(`${f.label} ${f.id} ${f.instruction}`);
    });

    if (filteredFields.length > 0 || activeStatsFilter === 'dossier') {
      const dfCard = el('section', 'ls-card');
      const dfHead = el('div', 'ls-row-between');
      dfHead.append(
        el('h3', '', `Character Dossier Fields (${filteredFields.length})`),
        el('div', 'ls-row'),
      );
      (dfHead.lastElementChild as HTMLElement).append(
        btn('Restore Defaults', () => {
          saveTemplatePatch({ dossierFields: defaultDossierFields() }, 'Restored default dossier fields');
        }, 'ls-btn-sm ls-btn-ghost'),
        iconBtn('plus', () => openDossierFieldModal(ctrl), {
          label: 'New Field',
          className: 'ls-btn-sm ls-btn-primary',
        }),
      );
      dfCard.append(dfHead);

      for (const field of filteredFields) {
        const row = el('div', 'ls-stat-row-compact');
        row.style.borderLeft = `3px solid ${field.color || 'var(--ls-primary)'}`;
        const left = el('div', 'ls-row');
        const swSlot = el('div');
        mountNativeSwitch(ctrl, compScope, swSlot, {
          checked: field.enabled,
          ariaLabel: `Toggle ${field.label}`,
          onChange: on => {
            saveTemplatePatch(live => ({
              dossierFields: live.dossierFields.map(x =>
                x.id === field.id ? { ...x, enabled: on } : x,
              ),
            }));
          },
        });
        left.append(
          swSlot,
          el('strong', '', `${field.icon} ${field.label}`),
          el('span', 'ls-chip', `Dossier · ${field.displayStyle || 'card'}`),
        );
        const right = el('div', 'ls-row');
        right.append(
          btn('Full Edit', () => openDossierFieldModal(ctrl, field), 'ls-btn-sm'),
          iconBtn('trash', () => {
            saveTemplatePatch(live => ({
              dossierFields: live.dossierFields.filter(x => x.id !== field.id),
            }));
          }, { className: 'ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger', title: 'Delete field' }),
        );
        row.append(left, right);
        dfCard.append(row);
      }
      listHost.append(dfCard);
    }
  };

  searchInp.addEventListener('input', () => {
    statsSearchQuery = searchInp.value;
    renderFilteredLists();
  });
  renderFilteredLists();

  return wrap;
}
