import type {
  CampaignState,
  CoreTrackersConfig,
  DossierFieldDef,
  DossierTabConfig,
  LumiStatsTemplate,
  LumiVisualSkinPack,
  PillSkinStyle,
  StatCategoryDef,
  StatScaleAnchor,
  StatSchemaDef,
  StatScope,
  StatValueKind,
  StatVolatility,
  SurfaceTabConfig,
  TemplateSurfacesConfig,
} from './types';

export function createStatCategory(
  partial: Partial<StatCategoryDef> & { name: string },
): StatCategoryDef {
  const name = partial.name.trim().slice(0, 80) || 'Custom Group';
  const id = slugifyKey(partial.id ?? name, 'cat');
  return {
    id,
    name,
    icon: partial.icon?.trim().slice(0, 8) || '📁',
    color: partial.color?.trim() || 'var(--lumiverse-primary)',
    enabled: partial.enabled !== false,
    collapsedByDefault: Boolean(partial.collapsedByDefault),
    showGroupHeaderInHud: partial.showGroupHeaderInHud !== false,
    promptTriggerMode:
      partial.promptTriggerMode === 'conditional' || partial.promptTriggerMode === 'manual'
        ? partial.promptTriggerMode
        : 'always',
    ...(Array.isArray(partial.promptKeywords) && partial.promptKeywords.length
      ? {
          promptKeywords: [
            ...new Set(partial.promptKeywords.map(k => String(k).trim().toLowerCase()).filter(Boolean)),
          ].slice(0, 32),
        }
      : {}),
    ...(partial.aiRule?.trim() ? { aiRule: partial.aiRule.trim() } : {}),
    ...(partial.localRuleFormula?.trim() ? { localRuleFormula: partial.localRuleFormula.trim() } : {}),
    injectInContinuity: partial.injectInContinuity !== false,
    order: Number.isFinite(partial.order) ? Math.round(Number(partial.order)) : 0,
  };
}

export function slugifyKey(raw: unknown, fallback = 'stat'): string {
  const cleaned = String(raw ?? '')
    .trim()
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 64);
  return cleaned || fallback;
}

export function buildProportionalAnchors(
  min: number,
  max: number,
  _volatility: StatVolatility,
): StatScaleAnchor[] {
  const span = max - min;
  if (span <= 0) return [{ value: min, label: 'Baseline', description: 'Default baseline' }];
  const at = (pct: number) => Math.round(min + span * pct);

  return [
    { value: at(0.85), label: 'Very High / Peak', description: 'Dominant, intense, or near maximum capacity' },
    { value: at(0.65), label: 'High / Strong', description: 'Clearly elevated, strong, or well-established' },
    { value: at(0.45), label: 'Moderate / Balanced', description: 'Standard working baseline or neutral equilibrium' },
    { value: at(0.2), label: 'Low / Guarded', description: 'Mild, strained, or subdued' },
    { value: min, label: 'None / Minimal', description: 'Absent, calm baseline, or depleted' },
  ];
}

export function createStatSchema(
  partial: Partial<StatSchemaDef> & { id?: string; label: string },
): StatSchemaDef {
  const id = slugifyKey(partial.id ?? partial.label, 'stat');
  const scope: StatScope = partial.scope ?? 'character';
  const displayStyle = partial.displayStyle ?? 'auto';
  const textStyleSelected =
    displayStyle === 'feed_cards' ||
    displayStyle === 'step_chain' ||
    displayStyle === 'quote_callout' ||
    displayStyle === 'key_value' ||
    displayStyle === 'arc_tracker' ||
    displayStyle === 'accordion_cards' ||
    displayStyle === 'matrix_badges' ||
    displayStyle === 'meter_mini_bars' ||
    displayStyle === 'stat_pills_grid' ||
    displayStyle === 'bullet_ledger' ||
    displayStyle === 'timeline_list' ||
    displayStyle === 'checklist';
  const kind: StatValueKind =
    displayStyle === 'pill_list'
      ? 'tags'
      : textStyleSelected && (!partial.kind || partial.kind === 'meter')
        ? 'text'
        : (partial.kind ?? 'meter');
  const min = Number.isFinite(partial.min) ? Number(partial.min) : 0;
  const max = Number.isFinite(partial.max)
    ? Number(partial.max)
    : kind === 'clock'
      ? 6
      : kind === 'pips' || kind === 'hearts'
        ? 5
        : kind === 'attributes'
          ? 20
          : kind === 'currency'
            ? 99999999
            : 100;
  const volatility: StatVolatility =
    partial.volatility ?? (scope === 'character' ? 'progressive' : 'momentary');
  const anchors: StatScaleAnchor[] = Array.isArray(partial.anchors) ? partial.anchors : [];

  const defaultTab =
    scope === 'character'
      ? 'cast'
      : scope === 'world'
        ? 'world'
        : 'stats';

  const pinned = Boolean(partial.pinnedToHeader ?? partial.showIn?.pinnedHeader);
  const showIn = {
    widget: partial.showIn?.widget ?? true,
    inline: partial.showIn?.inline ?? true,
    dossier: partial.showIn?.dossier ?? (scope === 'character'),
    pinnedHeader: pinned,
  };

  return {
    id,
    label: partial.label.trim().slice(0, 80) || id,
    icon: partial.icon?.trim().slice(0, 8) || '📊',
    scope,
    kind,
    min: Math.min(min, max),
    max: Math.max(min, max),
    step: Number.isFinite(partial.step) && Number(partial.step) > 0 ? Number(partial.step) : 1,
    defaultValue:
      partial.defaultValue !== undefined
        ? partial.defaultValue
        : kind === 'boolean'
          ? false
          : kind === 'skill_tree'
            ? 'SP: 2 | Basic Focus (Lv.1/5, cost:1, +10% efficiency)'
            : kind === 'xp_level'
              ? 'Lv. 1 | 0/100 XP | Rank E'
              : kind === 'attributes'
                ? 'STR:10, DEX:10, CON:10, INT:10, WIS:10, CHA:10'
                : kind === 'inventory'
                  ? 'None'
                  : kind === 'status_fx'
                    ? 'None'
                    : kind === 'text' || kind === 'tags' || kind === 'tier'
                      ? (partial.options?.[0] ?? 'None')
                      : Math.max(Math.min(min, max), Math.min(Math.max(min, max), 0)),
    ...(partial.options?.length ? { options: partial.options } : {}),
    anchors,
    volatility,
    triggerCues: partial.triggerCues?.trim() ?? '',
    ...(partial.formula?.trim() ? { formula: partial.formula.trim() } : {}),
    color: partial.color?.trim() || 'var(--lumiverse-primary)',
    enabled: partial.enabled !== false,
    locked: Boolean(partial.locked),
    pinnedToHeader: pinned,
    displayStyle: partial.displayStyle ?? 'auto',
    layoutSpan: partial.layoutSpan ?? 'auto',
    showIn,
    tabId: partial.tabId?.trim() || defaultTab,
    widgetTabId: partial.widgetTabId?.trim() || defaultTab,
    inlineTabId: partial.inlineTabId?.trim() || defaultTab,
    dossierTabId: partial.dossierTabId?.trim() || 'bonds',
    ...(Array.isArray(partial.extraWidgetTabIds) && partial.extraWidgetTabIds.length
      ? { extraWidgetTabIds: [...new Set(partial.extraWidgetTabIds.map(String))] }
      : {}),
    ...(Array.isArray(partial.extraInlineTabIds) && partial.extraInlineTabIds.length
      ? { extraInlineTabIds: [...new Set(partial.extraInlineTabIds.map(String))] }
      : {}),
    calculationMode:
      partial.calculationMode === 'local_formula' ||
      partial.calculationMode === 'ai_plus_local' ||
      partial.calculationMode === 'ai'
        ? partial.calculationMode
        : Boolean(partial.formula?.trim())
          ? 'local_formula'
          : 'ai',
    ...(partial.formulaOutputTemplate?.trim()
      ? { formulaOutputTemplate: partial.formulaOutputTemplate.trim() }
      : {}),
    promptTriggerMode:
      partial.promptTriggerMode === 'conditional' || partial.promptTriggerMode === 'manual'
        ? partial.promptTriggerMode
        : 'always',
    ...(Array.isArray(partial.promptKeywords) && partial.promptKeywords.length
      ? {
          promptKeywords: [
            ...new Set(partial.promptKeywords.map(k => String(k).trim().toLowerCase()).filter(Boolean)),
          ].slice(0, 32),
        }
      : {}),
    injectInContinuity: partial.injectInContinuity !== false,
    ...(partial.categoryId?.trim() ? { categoryId: partial.categoryId.trim() } : {}),
    ...(partial.alerts?.length ? { alerts: partial.alerts } : {}),
  };
}

export function defaultSurfaceTabs(): SurfaceTabConfig[] {
  return [
    { id: 'stats', label: 'You & Scene', icon: '📊', kind: 'stats', enabled: true, order: 0 },
    { id: 'cast', label: 'Cast', icon: '👥', kind: 'cast', enabled: true, order: 1 },
    { id: 'web', label: 'Bond Web', icon: '🕸️', kind: 'web', enabled: true, order: 2 },
    { id: 'map', label: 'Atlas', icon: '🗺️', kind: 'map', enabled: true, order: 3 },
    { id: 'world', label: 'World & Clocks', icon: '🌍', kind: 'world', enabled: true, order: 4 },
  ];
}

export function defaultInlineTabs(): SurfaceTabConfig[] {
  return [
    { id: 'stats', label: 'Stats', icon: '📊', kind: 'stats', enabled: true, order: 0 },
    { id: 'cast', label: 'Cast', icon: '👥', kind: 'cast', enabled: true, order: 1 },
    { id: 'web', label: 'Bond Web', icon: '🕸️', kind: 'web', enabled: true, order: 2 },
    { id: 'world', label: 'World', icon: '🌍', kind: 'world', enabled: true, order: 3 },
  ];
}

export function defaultDossierTabs(): DossierTabConfig[] {
  return [
    {
      id: 'overview',
      label: 'Overview',
      icon: '✨',
      kind: 'overview',
      enabled: true,
      order: 0,
      showMeters: true,
      showFields: true,
      showSecrets: false,
      showAudit: false,
      showNpcBonds: false,
    },
    {
      id: 'bonds',
      label: 'Player Bonds',
      icon: '💖',
      kind: 'bonds',
      enabled: true,
      order: 1,
      showMeters: true,
      showFields: false,
      showSecrets: false,
      showAudit: true,
      showNpcBonds: false,
    },
    {
      id: 'peer_bonds',
      label: 'Peer Bonds (NPC↔NPC)',
      icon: '🤝',
      kind: 'peer_bonds',
      enabled: true,
      order: 2,
      showMeters: false,
      showFields: false,
      showSecrets: false,
      showAudit: false,
      showNpcBonds: true,
    },
    {
      id: 'loadout',
      label: 'Attire & Loadout',
      icon: '👗',
      kind: 'loadout',
      enabled: true,
      order: 3,
      showMeters: false,
      showFields: true,
      showSecrets: false,
      showAudit: false,
      showNpcBonds: false,
    },
    {
      id: 'secrets',
      label: 'Secrets & Notes',
      icon: '🕵️',
      kind: 'secrets',
      enabled: true,
      order: 4,
      showMeters: false,
      showFields: false,
      showSecrets: true,
      showAudit: false,
      showNpcBonds: false,
    },
  ];
}

export function defaultSurfacesConfig(): TemplateSurfacesConfig {
  return {
    widgetTabs: defaultSurfaceTabs(),
    inlineTabs: defaultInlineTabs(),
    dossierTabs: defaultDossierTabs(),
    trackNpcBonds: true,
    showRelationshipWeb: true,
    customWidgetHtml: '',
    customInlineHtml: '',
    customDossierHtml: '',
  };
}

export function defaultCoreTrackersConfig(): CoreTrackersConfig {
  return {
    trackPlayerAttire: true,
    playerAttireLabel: 'Your Current Attire / Presentation',
    playerAttireInstruction: 'Update whenever the player character changes clothing, state of dress, or physical presentation.',
    showPlayerAttireCard: true,
    trackPlayerCondition: true,
    playerConditionLabel: 'Physical / Mental Condition',
    playerConditionInstruction: 'Track physical injuries, fatigue, intoxication, disorientation, or mental state.',
    showPlayerConditionCard: true,
    trackPlayerAction: false,
    playerActionLabel: 'Latest Notable Action',
    playerActionInstruction: 'Summarize the player character’s most consequential current action.',
    showPlayerActionCard: true,
    trackSceneSummary: true,
    sceneSummaryLabel: 'Scene Beat Summary',
    sceneSummaryInstruction: 'Concise 1-sentence summary of what just happened in the scene.',
    showSceneSummaryInWidget: true,
    trackScenePresence: true,
    scenePresenceLabel: 'Present & Away',
    scenePresenceInstruction:
      'Format: Present: [List NPCs present in the scene], Away: [List NPCs away/offscreen]. Update EVERY turn whenever anyone enters, leaves, or the scene moves to a new location.',
    showScenePresenceCard: true,
    trackPlaces: true,
    placesInstruction: 'Extract new or visited locations into zones[] (building/district), places[] (room/spot with tags & brief note), and paths[].',
    trackQuests: true,
    questsInstruction: 'Track active story goals, deadlines, and sub-objectives; mark completed when resolved.',
    showQuestsInWidget: true,
    trackDispatches: true,
    dispatchesInstruction: 'Log brief off-screen developments or upcoming hooks for characters not currently in the room.',
    showDispatchesInWidget: true,
    trackNpcConditions: true,
    npcConditionsInstruction: 'Track short status tags on NPCs (e.g. Flustered, Armed, Injured, Hurried).',
    trackNpcSecrets: true,
    npcSecretsInstruction: 'Record discovered clues, hidden motives, or confirmed secrets per NPC.',
    sceneLocationInstruction: 'Current specific spot and broader area formatted cleanly as "Specific Room/Spot, District/Building".',
    sceneTimeInstruction: 'Current in-story clock time (e.g. "08:15 AM" or story-appropriate time-of-day).',
    sceneDateInstruction: 'Current in-story date, day count, or era label (e.g. "Day 1" or "Oct 14, 2002").',
    sceneWeatherInstruction: 'Concise weather and immediate atmosphere (e.g. "Clear", "Light Rain", "Tense Indoors").',
    sceneTimeFlowInstruction: 'Estimate elapsed minutes ("mins") realistically for the actions in this beat.',
    scenePillLocked: false,
    overrides: {
      scene_presence: {
        pinnedToHeader: true,
      },
    },
  };
}

/**
 * Zero-hardcoding Character Dossier fields!
 * `inner_thought`, `immediate_goal`, `attire_layers`, `demeanor`, and `role_summary`
 * are all user-editable, toggleable, and deletable in Studio -> Dossier Fields.
 */
export function defaultDossierFields(): DossierFieldDef[] {
  return [
    {
      id: 'role_summary',
      label: 'Role & Bond to Player',
      icon: '🪪',
      placeholder: 'e.g. Loyal personal maid, Childhood rival…',
      instruction: 'Concise role and established relationship to the player.',
      tabId: 'overview',
      displayStyle: 'badge',
      showInHudCast: false,
      showInInlineCast: false,
      enabled: true,
      locked: false,
    },
    {
      id: 'demeanor',
      label: 'Current Demeanor & Mood',
      icon: '🎭',
      placeholder: 'e.g. Flustered, Guarded, Warm…',
      instruction: 'Current emotional demeanor and facial expression in the scene.',
      tabId: 'overview',
      displayStyle: 'badge',
      showInHudCast: true,
      showInInlineCast: false,
      enabled: true,
      locked: false,
    },
    {
      id: 'inner_thought',
      label: 'Inner Monologue',
      icon: '💭',
      placeholder: 'Unspoken internal thought in this moment…',
      instruction: 'Short first-person unspoken thought or internal reaction to the current beat.',
      tabId: 'overview',
      displayStyle: 'quote',
      showInHudCast: true,
      showInInlineCast: true,
      enabled: true,
      locked: false,
    },
    {
      id: 'immediate_goal',
      label: 'Immediate Goal',
      icon: '🎯',
      placeholder: 'What this character is trying to do right now…',
      instruction: 'Immediate objective or intention in the current scene.',
      tabId: 'overview',
      displayStyle: 'card',
      showInHudCast: false,
      showInInlineCast: false,
      enabled: true,
      locked: false,
    },
    {
      id: 'attire_layers',
      label: 'Current Outfit & Presentation',
      icon: '👗',
      placeholder: 'Observed clothing & state of dress',
      instruction: 'Update whenever clothing, state of undress, or physical presentation is described or changed.',
      tabId: 'loadout',
      displayStyle: 'card',
      showInHudCast: true,
      showInInlineCast: true,
      enabled: true,
      locked: false,
    },
    {
      id: 'carried_items',
      label: 'Carried Items & Props',
      icon: '🎒',
      placeholder: 'Items in hand or on person',
      instruction: 'Track notable items, tools, or gifts currently held or worn.',
      tabId: 'loadout',
      displayStyle: 'pills',
      showInHudCast: false,
      showInInlineCast: false,
      enabled: true,
      locked: false,
    },
    {
      id: 'bond_dynamic',
      label: 'Relationship Dynamic',
      icon: '🔗',
      placeholder: 'Established dynamic with player',
      instruction: 'Summarize the current interpersonal dynamic and power balance with the player.',
      tabId: 'overview',
      displayStyle: 'card',
      showInHudCast: false,
      showInInlineCast: false,
      enabled: true,
      locked: false,
    },
  ];
}

export function createDefaultTemplate(): LumiStatsTemplate {
  return {
    schema: 'lumi-stats-template/v1',
    id: 'universal_companion',
    name: 'Universal Roleplay Companion',
    icon: '✨',
    description: 'Schema-driven roleplay stats with two-phase calibration for relationships, momentary situational reactions, and world progression.',
    promptPosition: 'post_history',
    promptDepth: 1,
    theme: {
      surfaceStyle: 'glass',
      pillStyle: 'glass_capsule',
      frameShape: 'rounded',
      radiusPreset: 'balanced',
      meterStyle: 'smooth',
      castLayout: 'roster',
      glowIntensity: 55,
      glassBlur: true,
      widgetWidth: 460,
      widgetHeight: 540,
      pillWidth: 420,
      pillHeight: 92,
      widgetTabsIconOnly: false,
      compact: false,
      placement: 'both_bottom',
      inlineDefaultExpanded: false,
      showSceneChips: {
        time: true,
        date: true,
        location: true,
        weather: true,
        cast: true,
        pinnedStats: true,
      },
      customCss: '',
    },
    tabs: defaultSurfaceTabs(),
    surfaces: defaultSurfacesConfig(),
    coreTrackers: defaultCoreTrackersConfig(),
    categories: [],
    stats: [
      createStatSchema({
        id: 'composure',
        label: 'Composure',
        icon: '🧭',
        scope: 'player',
        kind: 'meter',
        min: 0,
        max: 100,
        defaultValue: 85,
        volatility: 'momentary',
        pinnedToHeader: true,
        triggerCues: '85=poised, 55=masking, 30=flustered, 0=shaken; drops on teasing, undress, or pressure.',
        anchors: [
          { value: 80, label: 'Poised & Collected', description: 'Calm, confident, and in control' },
          { value: 55, label: 'Steady / Masking', description: 'Holding it together despite pressure' },
          { value: 30, label: 'Flustered / Rattled', description: 'Caught off-guard, blushing, or defensive' },
          { value: 0, label: 'Shaken / Overwhelmed', description: 'Completely flustered or panicking' },
        ],
      }),
      createStatSchema({
        id: 'trust',
        label: 'Trust',
        icon: '🛡️',
        scope: 'character',
        kind: 'meter',
        min: 0,
        max: 100,
        defaultValue: 45,
        volatility: 'progressive',
        pinnedToHeader: true,
        dossierTabId: 'bonds',
        triggerCues: 'Calibrate: hostile=15, stranger=45, ally/family=70, confidant=90; shift on honesty/betrayal.',
        anchors: [
          { value: 85, label: 'Trusted Confidant', description: 'Unconditional trust and deep confidence' },
          { value: 65, label: 'Open & Relying', description: 'Clear trust, family familiarity, or proven ally' },
          { value: 40, label: 'Neutral / Polite', description: 'Standard baseline for unproven acquaintances' },
          { value: 20, label: 'Guarded / Wary', description: 'Skeptical, cautious, or holding back' },
          { value: 0, label: 'Deeply Distrustful', description: 'Expects betrayal or actively hostile' },
        ],
      }),
      createStatSchema({
        id: 'loyalty',
        label: 'Loyalty & Devotion',
        icon: '⚜️',
        scope: 'character',
        kind: 'meter',
        min: 0,
        max: 100,
        defaultValue: 50,
        volatility: 'anchor',
        dossierTabId: 'bonds',
        triggerCues: 'Calibrate: rival=10, peer=45, family=75, sworn retainer/partner=90; shift on oaths/betrayal.',
        anchors: [
          { value: 85, label: 'Fiercely Loyal', description: 'Devoted retainer, sworn protector, or deeply committed partner' },
          { value: 65, label: 'Dependable Ally', description: 'Supportive family member, friend, or companion' },
          { value: 40, label: 'Cooperative', description: 'Neutral or professional alignment' },
          { value: 15, label: 'Self-Interested', description: 'Prioritizes own agenda; easily swayed' },
          { value: 0, label: 'Unbound / Opposed', description: 'No allegiance or actively opposed' },
        ],
      }),
      createStatSchema({
        id: 'affection',
        label: 'Affection & Fondness',
        icon: '❤️',
        scope: 'character',
        kind: 'meter',
        min: 0,
        max: 100,
        defaultValue: 45,
        volatility: 'progressive',
        dossierTabId: 'bonds',
        triggerCues: 'Calibrate: cold=15, polite=45, fond friend/family=70, loving=90; shift with warmth/coldness.',
        anchors: [
          { value: 85, label: 'Deeply Devoted', description: 'Profound love, adoration, or attachment' },
          { value: 65, label: 'Warm & Fond', description: 'Genuine care, closeness, and affection' },
          { value: 40, label: 'Friendly / Neutral', description: 'Amiable or neutral baseline' },
          { value: 20, label: 'Cold / Distant', description: 'Aloof, irritated, or emotionally detached' },
          { value: 0, label: 'Averse / Hostile', description: 'Dislike, bitterness, or rejection' },
        ],
      }),
      createStatSchema({
        id: 'desire',
        label: 'Desire & Attraction',
        icon: '🔥',
        scope: 'character',
        kind: 'meter',
        min: 0,
        max: 100,
        defaultValue: 0,
        volatility: 'momentary',
        dossierTabId: 'bonds',
        triggerCues: '0=platonic, 30=sparked, 60=intense, 85=consuming; spikes on allure, undress, touch, flirting.',
        anchors: [
          { value: 80, label: 'Consuming', description: 'Overwhelming attraction or longing in the scene' },
          { value: 55, label: 'Intense', description: 'Strong visible attraction, flustered gaze, or magnetic pull' },
          { value: 25, label: 'Sparked / Noticeable', description: 'Caught off-guard by appearance, proximity, or suggestive beat' },
          { value: 0, label: 'Platonic / Dormant', description: 'No active romantic or physical tension' },
        ],
      }),
      createStatSchema({
        id: 'arousal',
        label: 'Arousal & Fluster',
        icon: '💓',
        scope: 'character',
        kind: 'meter',
        min: 0,
        max: 100,
        defaultValue: 0,
        volatility: 'momentary',
        dossierTabId: 'bonds',
        triggerCues: '0=calm, 25=blushing, 55=heated, 85=breathless; spikes on nudity/towel, skin contact, intimacy.',
        anchors: [
          { value: 80, label: 'Breathless / Peak', description: 'Heavily aroused or physically overwhelmed' },
          { value: 50, label: 'Heated / Flushed', description: 'Visibly flustered, racing pulse, or strong physical reaction' },
          { value: 20, label: 'Stirred / Blushing', description: 'Initial spike from suggestive visual cue, towel, or close contact' },
          { value: 0, label: 'Composed', description: 'Calm physiological state' },
        ],
      }),
      createStatSchema({
        id: 'present',
        label: 'Present & Away',
        icon: '👥',
        scope: 'scene',
        kind: 'text',
        defaultValue: 'Present: [], Away: []',
        volatility: 'momentary',
        pinnedToHeader: true,
        triggerCues: 'Format: Present: [List NPCs present in the scene], Away: [List NPCs away/offscreen]. Update EVERY turn whenever anyone enters, leaves, or the scene moves to a new location.',
      }),
      createStatSchema({
        id: 'world_tension',
        label: 'Scene Tension Clock',
        icon: '⏱️',
        scope: 'world',
        kind: 'clock',
        min: 0,
        max: 6,
        defaultValue: 0,
        volatility: 'progressive',
        widgetTabId: 'world',
        inlineTabId: 'world',
        triggerCues: '+1 when suspense, danger, or complications escalate; reduce when resolved.',
      }),
    ],
    dossierFields: defaultDossierFields(),
    updatedAt: new Date().toISOString(),
  };
}

export const BUILTIN_TEMPLATES: LumiStatsTemplate[] = [
  createDefaultTemplate(),
  {
    ...createDefaultTemplate(),
    id: 'romance_slice_of_life',
    name: 'Romance, Chemistry & Wardrobe',
    icon: '🌸',
    description: 'Focused on interpersonal chemistry, momentary blush/fluster, desire, devotion, and detailed outfit layers.',
    theme: {
      ...createDefaultTemplate().theme,
      surfaceStyle: 'cozy_vn',
      pillStyle: 'vn_dialogue_bar',
      accentHue: 330,
      secondaryHue: 200,
    },
    stats: [
      ...createDefaultTemplate().stats.filter(s => s.id !== 'world_tension'),
      createStatSchema({
        id: 'chemistry',
        label: 'Spark & Chemistry',
        icon: '✨',
        scope: 'character',
        kind: 'meter',
        min: 0,
        max: 100,
        defaultValue: 35,
        color: '#f472b6',
        volatility: 'momentary',
        pinnedToHeader: true,
        dossierTabId: 'bonds',
        triggerCues: '0–100 scale. Rises on playful banter, shared silences, eye contact, and romantic tension; cools on awkwardness.',
      }),
      createStatSchema({
        id: 'intimacy_stage',
        label: 'Romantic Tension Clock',
        icon: '💗',
        scope: 'scene',
        kind: 'clock',
        min: 0,
        max: 6,
        defaultValue: 0,
        color: '#f472b6',
        volatility: 'momentary',
        widgetTabId: 'stats',
        inlineTabId: 'stats',
        triggerCues: '0–6 segments. Advances as physical proximity, vulnerability, or romantic confession builds in the scene.',
      }),
    ],
  },
  {
    ...createDefaultTemplate(),
    id: 'tactical_adventure',
    name: 'Adventure, Party & World Clocks',
    icon: '⚔️',
    description: 'Vitality, Resolve, Party Loyalty, Trust, and World Threat Clocks for fantasy or sci-fi campaigns.',
    stats: [
      createStatSchema({
        id: 'vitality',
        label: 'Vitality',
        icon: '❤️',
        scope: 'player',
        kind: 'meter',
        min: 0,
        max: 100,
        defaultValue: 100,
        volatility: 'momentary',
        pinnedToHeader: true,
        triggerCues: 'Drops on injuries, exhaustion, or hazards; restores with medical care or rest.',
      }),
      createStatSchema({
        id: 'resolve',
        label: 'Resolve & Energy',
        icon: '⚡',
        scope: 'player',
        kind: 'meter',
        min: 0,
        max: 100,
        defaultValue: 100,
        volatility: 'momentary',
        pinnedToHeader: true,
        triggerCues: 'Spent on strenuous feats, spells, or high-stress confrontations; recovered on rest.',
      }),
      ...createDefaultTemplate().stats.filter(s => s.scope !== 'player'),
    ],
  },
  {
    ...createDefaultTemplate(),
    id: 'mystery_thriller',
    name: 'Investigation & Suspicion Ledger',
    icon: '🕵️',
    description: 'Tracks Case Progress, Suspect Alertness, Credibility, Pressure, and discovered clues.',
    stats: [
      createStatSchema({
        id: 'case_progress',
        label: 'Investigation Progress',
        icon: '🔎',
        scope: 'player',
        kind: 'meter',
        min: 0,
        max: 100,
        defaultValue: 0,
        volatility: 'progressive',
        pinnedToHeader: true,
        triggerCues: 'Increases as physical clues, motives, and alibi contradictions are uncovered.',
      }),
      createStatSchema({
        id: 'suspicion',
        label: 'Suspicion & Guilt',
        icon: '👁️',
        scope: 'character',
        kind: 'meter',
        min: 0,
        max: 100,
        defaultValue: 15,
        volatility: 'progressive',
        pinnedToHeader: true,
        triggerCues: 'Calibrate from initial evidence; increase on lies, evasions, or incriminating discoveries.',
      }),
      createStatSchema({
        id: 'pressure',
        label: 'Interrogation Pressure',
        icon: '💢',
        scope: 'character',
        kind: 'clock',
        min: 0,
        max: 6,
        defaultValue: 0,
        volatility: 'momentary',
        triggerCues: 'Advance when cornered with evidence or tough questioning; drops when given breathing room.',
      }),
      createStatSchema({
        id: 'alert_clock',
        label: 'Danger / Alert Clock',
        icon: '🚨',
        scope: 'world',
        kind: 'clock',
        min: 0,
        max: 6,
        defaultValue: 0,
        volatility: 'momentary',
        pinnedToHeader: true,
        widgetTabId: 'world',
        inlineTabId: 'world',
        triggerCues: 'Advances by +1 when making noise, tipping off suspects, or triggering alarms.',
      }),
    ],
  },
  {
    ...createDefaultTemplate(),
    id: 'litrpg_skill_tree',
    name: 'LitRPG System, Skill Trees & Gear',
    icon: '⚔️',
    description: 'Full game HUD with HP/MP, XP & Leveling, Skill Points & Interactive Skill Tree, Core Attributes, Buffs/Debuffs, and Rarity Gear.',
    theme: {
      ...createDefaultTemplate().theme,
      surfaceStyle: 'arcane_rpg',
      frameShape: 'ornate',
      meterStyle: 'glow',
      accentHue: 42,
      secondaryHue: 198,
    },
    stats: [
      createStatSchema({
        id: 'hp',
        label: 'Health (HP)',
        icon: '❤️',
        scope: 'player',
        kind: 'meter',
        min: 0,
        max: 100,
        defaultValue: 100,
        color: '#f43f5e',
        volatility: 'momentary',
        pinnedToHeader: true,
        triggerCues: 'Drops on damage, traps, or exhaustion; recovers via healing, potions, or rest.',
      }),
      createStatSchema({
        id: 'mp',
        label: 'Mana / Stamina',
        icon: '💠',
        scope: 'player',
        kind: 'meter',
        min: 0,
        max: 100,
        defaultValue: 100,
        color: '#38bdf8',
        volatility: 'momentary',
        pinnedToHeader: true,
        triggerCues: 'Spent when casting spells or using active skills; regenerates during recovery.',
      }),
      createStatSchema({
        id: 'xp_level',
        label: 'Level & XP',
        icon: '⭐',
        scope: 'player',
        kind: 'xp_level',
        defaultValue: 'Lv. 1 | 0/100 XP | Rank E',
        color: '#f59e0b',
        volatility: 'progressive',
        triggerCues: 'Format: "Lv. N | cur/next XP | Rank X". Award XP on victories, discoveries, and milestones; level up when cur >= next.',
      }),
      createStatSchema({
        id: 'gold',
        label: 'Gold Coins',
        icon: '🪙',
        scope: 'player',
        kind: 'currency',
        min: 0,
        max: 99999999,
        defaultValue: 100,
        color: '#f59e0b',
        volatility: 'progressive',
        triggerCues: 'Track player currency/gold. Adjust via +N / -N on purchases, rewards, or loot.',
      }),
      createStatSchema({
        id: 'attributes',
        label: 'Core Attributes',
        icon: '🧬',
        scope: 'player',
        kind: 'attributes',
        min: 1,
        max: 30,
        defaultValue: 'STR:10, DEX:10, CON:10, INT:10, WIS:10, CHA:10',
        color: '#818cf8',
        layoutSpan: 'full',
        volatility: 'anchor',
        triggerCues: 'Comma-separated stats: "STR:N, DEX:N, CON:N, INT:N, WIS:N, CHA:N". Update when training or leveling.',
      }),
      createStatSchema({
        id: 'skill_tree',
        label: 'Skill Tree & SP',
        icon: '🌳',
        scope: 'player',
        kind: 'skill_tree',
        defaultValue: 'SP: 2 | Combat Sense (Lv.1/5, cost:1, +10% Eva) ; Arcane Spark (Lv.0/5, cost:1, req:Combat Sense)',
        color: '#10b981',
        layoutSpan: 'full',
        volatility: 'progressive',
        triggerCues: 'Format: "SP: N | Skill A (Lv.X/Y, cost:1, bonus) ; Skill B (Lv.X/Y, cost:1, req:Skill A)". Grant SP on level-ups or breakthroughs.',
      }),
      createStatSchema({
        id: 'status_fx',
        label: 'Buffs & Debuffs',
        icon: '⚡',
        scope: 'player',
        kind: 'status_fx',
        defaultValue: 'None',
        color: '#2dd4bf',
        layoutSpan: 'full',
        volatility: 'momentary',
        triggerCues: 'Prefix buffs with "+" and debuffs with "-" separated by "; ", e.g. "+Barrier (3t) ; -Bleeding (2t)".',
      }),
      createStatSchema({
        id: 'inventory',
        label: 'Gear & Inventory',
        icon: '🎒',
        scope: 'player',
        kind: 'inventory',
        defaultValue: 'Traveler Blade [common, equipped] ; Ration x2 [common]',
        color: '#a78bfa',
        layoutSpan: 'full',
        volatility: 'progressive',
        triggerCues: 'List items separated by "; " with qty & rarity tags, e.g. "Runed Dagger [rare, equipped] ; Potion x3 [common]".',
      }),
      ...createDefaultTemplate().stats.filter(s => s.scope === 'character' || s.scope === 'world'),
    ],
  },
  {
    ...createDefaultTemplate(),
    id: 'persona_social_sim',
    name: 'Stylish Social Sim & Confidants',
    icon: '🃏',
    description: 'High-contrast social sim HUD with Confidant Heart ranks, Social Stats (Charm/Courage/Knowledge), and stylish badges.',
    theme: {
      ...createDefaultTemplate().theme,
      surfaceStyle: 'persona_pop',
      frameShape: 'sharp',
      meterStyle: 'segmented',
      accentHue: 348,
      secondaryHue: 45,
    },
    stats: [
      createStatSchema({
        id: 'social_stats',
        label: 'Social Qualities',
        icon: '⭐',
        scope: 'player',
        kind: 'attributes',
        min: 1,
        max: 10,
        defaultValue: 'Knowledge:2, Charm:2, Courage:2, Kindness:2, Proficiency:2',
        color: '#f43f5e',
        layoutSpan: 'full',
        volatility: 'progressive',
        triggerCues: 'Comma-separated 1–10 qualities: "Knowledge:N, Charm:N, Courage:N, Kindness:N, Proficiency:N".',
      }),
      createStatSchema({
        id: 'composure',
        label: 'Cool / Composure',
        icon: '🎭',
        scope: 'player',
        kind: 'meter',
        min: 0,
        max: 100,
        defaultValue: 85,
        color: '#facc15',
        volatility: 'momentary',
        pinnedToHeader: true,
        triggerCues: '85=stylish, 55=steady, 30=rattled, 0=flustered.',
      }),
      createStatSchema({
        id: 'bond_hearts',
        label: 'Confidant Bond Rank',
        icon: '❤️',
        scope: 'character',
        kind: 'hearts',
        min: 0,
        max: 10,
        defaultValue: 3,
        color: '#f472b6',
        volatility: 'progressive',
        pinnedToHeader: true,
        triggerCues: '0–10 heart rank. Increases on meaningful hangouts, honesty, or breakthroughs.',
      }),
      ...createDefaultTemplate().stats.filter(s => s.scope === 'character' || s.scope === 'world'),
    ],
  },
];

export const BUILTIN_VISUAL_SKINS: LumiVisualSkinPack[] = [
  {
    schema: 'lumi-stats-skin/v1',
    name: 'Adaptive Lumiverse Glass',
    surfaceStyle: 'glass',
    frameShape: 'rounded',
    meterStyle: 'smooth',
    glowIntensity: 45,
    glassBlur: true,
    castLayout: 'roster',
  },
  {
    schema: 'lumi-stats-skin/v1',
    name: 'Arcane Fantasy RPG',
    surfaceStyle: 'arcane_rpg',
    frameShape: 'ornate',
    meterStyle: 'glow',
    accentHue: 42,
    secondaryHue: 198,
    glowIntensity: 70,
    glassBlur: true,
    castLayout: 'roster',
  },
  {
    schema: 'lumi-stats-skin/v1',
    name: 'Cyber Tactical HUD',
    surfaceStyle: 'cyber_hud',
    frameShape: 'chamfered',
    meterStyle: 'segmented',
    accentHue: 190,
    secondaryHue: 315,
    glowIntensity: 85,
    glassBlur: true,
    castLayout: 'roster',
  },
  {
    schema: 'lumi-stats-skin/v1',
    name: 'Stylish Social Sim (Pop)',
    surfaceStyle: 'persona_pop',
    frameShape: 'sharp',
    meterStyle: 'segmented',
    accentHue: 348,
    secondaryHue: 48,
    glowIntensity: 60,
    glassBlur: false,
    castLayout: 'roster',
  },
  {
    schema: 'lumi-stats-skin/v1',
    name: 'Cozy Visual Novel',
    surfaceStyle: 'cozy_vn',
    frameShape: 'rounded',
    meterStyle: 'smooth',
    accentHue: 330,
    secondaryHue: 200,
    glowIntensity: 40,
    glassBlur: true,
    castLayout: 'roster',
  },
];

export function extractSkinPackFromTemplate(tpl: LumiStatsTemplate): LumiVisualSkinPack {
  return {
    schema: 'lumi-stats-skin/v1',
    name: `${tpl.name} Skin`,
    surfaceStyle: tpl.theme.surfaceStyle ?? 'glass',
    frameShape: tpl.theme.frameShape ?? (tpl.theme.radiusPreset === 'sharp' ? 'sharp' : 'rounded'),
    meterStyle: tpl.theme.meterStyle ?? 'smooth',
    ...(tpl.theme.accentHue !== undefined ? { accentHue: tpl.theme.accentHue } : {}),
    ...(tpl.theme.secondaryHue !== undefined ? { secondaryHue: tpl.theme.secondaryHue } : {}),
    glowIntensity: tpl.theme.glowIntensity ?? 55,
    glassBlur: tpl.theme.glassBlur !== false,
    compact: Boolean(tpl.theme.compact),
    castLayout: tpl.theme.castLayout ?? 'roster',
    ...(tpl.theme.customCss ? { customCss: tpl.theme.customCss } : {}),
  };
}

export function normalizeSkinPack(rawInput: unknown): LumiVisualSkinPack {
  const raw = rawInput && typeof rawInput === 'object' ? (rawInput as Record<string, unknown>) : {};
  const validStyles = new Set([
    'glass', 'soft', 'sleek', 'minimal', 'neon',
    'arcane_rpg', 'cyber_hud', 'persona_pop', 'cozy_vn',
  ]);
  const surfaceStyle = validStyles.has(String(raw.surfaceStyle))
    ? (raw.surfaceStyle as LumiVisualSkinPack['surfaceStyle'])
    : 'glass';
  const frameShape =
    raw.frameShape === 'chamfered' || raw.frameShape === 'sharp' || raw.frameShape === 'ornate'
      ? raw.frameShape
      : 'rounded';
  const meterStyle =
    raw.meterStyle === 'segmented' || raw.meterStyle === 'glow' ? raw.meterStyle : 'smooth';
  const castLayout = raw.castLayout === 'cards' ? 'cards' : 'roster';
  const accentHue =
    typeof raw.accentHue === 'number' && Number.isFinite(raw.accentHue)
      ? Math.max(0, Math.min(360, Math.round(raw.accentHue)))
      : undefined;
  const secondaryHue =
    typeof raw.secondaryHue === 'number' && Number.isFinite(raw.secondaryHue)
      ? Math.max(0, Math.min(360, Math.round(raw.secondaryHue)))
      : undefined;
  const glowIntensity =
    typeof raw.glowIntensity === 'number' && Number.isFinite(raw.glowIntensity)
      ? Math.max(0, Math.min(100, Math.round(raw.glowIntensity)))
      : 55;

  return {
    schema: 'lumi-stats-skin/v1',
    name: String(raw.name ?? 'Imported Skin').trim().slice(0, 80) || 'Imported Skin',
    surfaceStyle,
    frameShape,
    meterStyle,
    ...(accentHue !== undefined ? { accentHue } : {}),
    ...(secondaryHue !== undefined ? { secondaryHue } : {}),
    glowIntensity,
    glassBlur: raw.glassBlur !== false,
    compact: Boolean(raw.compact),
    castLayout,
    ...(typeof raw.customCss === 'string' && raw.customCss.trim()
      ? { customCss: raw.customCss.slice(0, 8000) }
      : {}),
  };
}

export function createEmptyCampaignState(template: LumiStatsTemplate): CampaignState {
  const stats: CampaignState['stats'] = {};
  for (const def of template.stats) {
    if (!def.enabled || def.scope === 'character') continue;
    stats[def.id] = {
      id: def.id,
      scope: def.scope,
      value: def.defaultValue,
      calibrated: false,
      locked: def.locked,
    };
  }

  return {
    initialized: false,
    title: 'Uncharted Story',
    canonPremise: '',
    turnCount: 0,
    elapsedMinutes: 0,
    scene: {
      location: '',
      timeLabel: '08:00 AM',
      dateLabel: 'Day 1',
      weather: 'Clear',
      beatSummary: '',
    },
    player: {
      name: '',
      attire: '',
      condition: 'Normal',
      notableAction: '',
    },
    currentPlaceId: '',
    stats,
    modifiers: [],
    characters: {},
    mapZones: {},
    places: {},
    mapPaths: [],
    quests: {},
    dispatches: [],
    auditLog: [],
  };
}

export function normalizeImportedTemplate(rawInput: unknown, nameOverride?: string): LumiStatsTemplate {
  const base = createDefaultTemplate();
  if (!rawInput || typeof rawInput !== 'object') return base;
  const raw = rawInput as Record<string, unknown>;

  const name = (nameOverride?.trim() || String(raw.name ?? raw.templateName ?? base.name)).slice(0, 80);
  const id = slugifyKey(raw.id ?? name, 'template');

  const stats: StatSchemaDef[] = [];
  const hasExplicitStatsArray = Array.isArray(raw.stats);
  if (hasExplicitStatsArray) {
    for (const item of raw.stats as unknown[]) {
      if (item && typeof item === 'object') {
        const s = { ...(item as Partial<StatSchemaDef>) };
        if (s.label || s.id) {
          if (
            s.kind !== 'skill_tree' &&
            typeof s.defaultValue === 'string' &&
            /^SP:\s*\d+\s*\|\s*Basic Focus/i.test(s.defaultValue)
          ) {
            s.defaultValue = 'None';
          }
          stats.push(createStatSchema({ ...s, label: String(s.label ?? s.id) }));
        }
      }
    }
  }

  const rawSurfaces =
    raw.surfaces && typeof raw.surfaces === 'object'
      ? (raw.surfaces as Partial<TemplateSurfacesConfig>)
      : {};

  const surfaces: TemplateSurfacesConfig = {
    widgetTabs:
      Array.isArray(rawSurfaces.widgetTabs) && rawSurfaces.widgetTabs.length
        ? rawSurfaces.widgetTabs
        : base.surfaces.widgetTabs,
    inlineTabs:
      Array.isArray(rawSurfaces.inlineTabs) && rawSurfaces.inlineTabs.length
        ? rawSurfaces.inlineTabs
        : base.surfaces.inlineTabs,
    dossierTabs:
      Array.isArray(rawSurfaces.dossierTabs) && rawSurfaces.dossierTabs.length
        ? rawSurfaces.dossierTabs
        : base.surfaces.dossierTabs,
    trackNpcBonds: rawSurfaces.trackNpcBonds !== false,
    showRelationshipWeb: rawSurfaces.showRelationshipWeb !== false,
    customWidgetHtml: typeof rawSurfaces.customWidgetHtml === 'string' ? rawSurfaces.customWidgetHtml : '',
    customInlineHtml: typeof rawSurfaces.customInlineHtml === 'string' ? rawSurfaces.customInlineHtml : '',
    customDossierHtml: typeof rawSurfaces.customDossierHtml === 'string' ? rawSurfaces.customDossierHtml : '',
  };

  // Migrate older templates that lacked `inner_thought`, `immediate_goal`, `demeanor`, `role_summary` in `dossierFields`
  let dossierFields: DossierFieldDef[] = base.dossierFields;
  if (Array.isArray(raw.dossierFields)) {
    const incoming = raw.dossierFields as DossierFieldDef[];
    const hasCoreMigrated = incoming.some(
      f => f.id === 'inner_thought' || f.id === 'immediate_goal' || f.id === 'demeanor',
    );
    if (hasCoreMigrated) {
      dossierFields = incoming;
    } else {
      const existingIds = new Set(incoming.map(f => f.id));
      const prependedCore = base.dossierFields.filter(
        bf =>
          ['role_summary', 'demeanor', 'inner_thought', 'immediate_goal'].includes(bf.id) &&
          !existingIds.has(bf.id),
      );
      dossierFields = [...prependedCore, ...incoming];
    }
  }

  const defaultsCore = defaultCoreTrackersConfig();
  const rawCoreTrackers =
    raw.coreTrackers && typeof raw.coreTrackers === 'object'
      ? (raw.coreTrackers as Partial<CoreTrackersConfig>)
      : {};
  const coreTrackers: CoreTrackersConfig = {
    ...defaultsCore,
    ...rawCoreTrackers,
    overrides: {
      ...(defaultsCore.overrides ?? {}),
      ...(rawCoreTrackers.overrides && typeof rawCoreTrackers.overrides === 'object'
        ? rawCoreTrackers.overrides
        : {}),
    },
  };

  const rawTheme =
    raw.theme && typeof raw.theme === 'object'
      ? (raw.theme as Partial<LumiStatsTemplate['theme']>)
      : {};

  const validStyles = new Set([
    'glass', 'soft', 'sleek', 'minimal', 'neon',
    'arcane_rpg', 'cyber_hud', 'persona_pop', 'cozy_vn',
  ]);
  const validSurfaceStyle = validStyles.has(String(rawTheme.surfaceStyle))
    ? (rawTheme.surfaceStyle as LumiStatsTemplate['theme']['surfaceStyle'])
    : base.theme.surfaceStyle;
  const validPillStyles = new Set<PillSkinStyle>([
    'glass_capsule',
    'vn_dialogue_bar',
    'rpg_status_bar',
    'persona_ticker',
    'cyber_telemetry',
    'minimal_floating',
    'neon_edge',
    'split_deck',
    'compact_badge',
    'ledger_strip',
  ]);
  const validPillStyle: PillSkinStyle = validPillStyles.has(rawTheme.pillStyle as PillSkinStyle)
    ? (rawTheme.pillStyle as PillSkinStyle)
    : (base.theme.pillStyle ?? 'glass_capsule');
  const validFrameShape =
    rawTheme.frameShape === 'chamfered' ||
    rawTheme.frameShape === 'sharp' ||
    rawTheme.frameShape === 'ornate' ||
    rawTheme.frameShape === 'rounded'
      ? rawTheme.frameShape
      : base.theme.frameShape;
  const validRadiusPreset =
    rawTheme.radiusPreset === 'sharp' ||
    rawTheme.radiusPreset === 'pill' ||
    rawTheme.radiusPreset === 'balanced'
      ? rawTheme.radiusPreset
      : base.theme.radiusPreset;
  const validMeterStyle =
    rawTheme.meterStyle === 'segmented' ||
    rawTheme.meterStyle === 'glow' ||
    rawTheme.meterStyle === 'smooth'
      ? rawTheme.meterStyle
      : base.theme.meterStyle;
  const validCastLayout =
    rawTheme.castLayout === 'cards' || rawTheme.castLayout === 'roster'
      ? rawTheme.castLayout
      : base.theme.castLayout;

  const validAccentHue =
    typeof rawTheme.accentHue === 'number' && Number.isFinite(rawTheme.accentHue)
      ? Math.max(0, Math.min(360, Math.round(rawTheme.accentHue)))
      : undefined;
  const validSecondaryHue =
    typeof rawTheme.secondaryHue === 'number' && Number.isFinite(rawTheme.secondaryHue)
      ? Math.max(0, Math.min(360, Math.round(rawTheme.secondaryHue)))
      : undefined;
  const clampNum = (v: unknown, min: number, max: number, fallback: number) =>
    typeof v === 'number' && Number.isFinite(v) ? Math.max(min, Math.min(max, Math.round(v))) : fallback;

  return {
    ...base,
    id,
    name,
    icon: typeof raw.icon === 'string' && raw.icon.trim() ? raw.icon.trim().slice(0, 12) : base.icon,
    description: typeof raw.description === 'string' ? raw.description.slice(0, 400) : base.description,
    userSelected: true,
    promptPosition:
      raw.promptPosition === 'pre_history' || raw.promptPosition === 'in_history'
        ? raw.promptPosition
        : 'post_history',
    promptDepth: Number.isFinite(Number(raw.promptDepth)) ? Math.max(0, Math.round(Number(raw.promptDepth))) : 1,
    theme: {
      ...base.theme,
      ...rawTheme,
      surfaceStyle: validSurfaceStyle,
      pillStyle: validPillStyle,
      frameShape: validFrameShape,
      radiusPreset: validRadiusPreset,
      meterStyle: validMeterStyle,
      castLayout: validCastLayout,
      glassBlur: rawTheme.glassBlur !== false,
      glowIntensity: clampNum(rawTheme.glowIntensity, 0, 100, 55),
      widgetWidth: clampNum(rawTheme.widgetWidth, 240, 1200, 460),
      widgetHeight: clampNum(rawTheme.widgetHeight, 180, 900, 540),
      pillWidth: clampNum(rawTheme.pillWidth, 220, 960, 420),
      pillHeight: clampNum(rawTheme.pillHeight, 56, 220, 92),
      ...(validAccentHue !== undefined ? { accentHue: validAccentHue } : { accentHue: undefined }),
      ...(validSecondaryHue !== undefined ? { secondaryHue: validSecondaryHue } : { secondaryHue: undefined }),
      widgetTabsIconOnly: Boolean(rawTheme.widgetTabsIconOnly),
      compact: Boolean(rawTheme.compact),
      inlineDefaultExpanded: Boolean(rawTheme.inlineDefaultExpanded),
      customCss: typeof rawTheme.customCss === 'string' ? rawTheme.customCss.slice(0, 8000) : '',
      showSceneChips: {
        ...base.theme.showSceneChips,
        ...(rawTheme.showSceneChips ?? {}),
      },
    },
    tabs: surfaces.widgetTabs,
    surfaces,
    coreTrackers,
    categories: Array.isArray(raw.categories)
      ? raw.categories
          .filter((c): c is Partial<StatCategoryDef> & { name: string } =>
            Boolean(c && typeof c === 'object' && typeof (c as { name?: unknown }).name === 'string'),
          )
          .map((c, idx) => createStatCategory({ ...c, order: c.order ?? idx }))
      : [],
    stats: hasExplicitStatsArray ? stats : base.stats,
    dossierFields,
    updatedAt: new Date().toISOString(),
  };
}
