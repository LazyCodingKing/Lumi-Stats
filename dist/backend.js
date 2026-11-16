// @bun
// src/shared/templates.ts
function createStatCategory(partial) {
  const name = partial.name.trim().slice(0, 80) || "Custom Group";
  const id = slugifyKey(partial.id ?? name, "cat");
  return {
    id,
    name,
    icon: partial.icon?.trim().slice(0, 8) || "\uD83D\uDCC1",
    color: partial.color?.trim() || "var(--lumiverse-primary)",
    enabled: partial.enabled !== false,
    collapsedByDefault: Boolean(partial.collapsedByDefault),
    showGroupHeaderInHud: partial.showGroupHeaderInHud !== false,
    promptTriggerMode: partial.promptTriggerMode === "conditional" || partial.promptTriggerMode === "manual" ? partial.promptTriggerMode : "always",
    ...Array.isArray(partial.promptKeywords) && partial.promptKeywords.length ? {
      promptKeywords: [
        ...new Set(partial.promptKeywords.map((k) => String(k).trim().toLowerCase()).filter(Boolean))
      ].slice(0, 32)
    } : {},
    ...partial.aiRule?.trim() ? { aiRule: partial.aiRule.trim() } : {},
    ...partial.localRuleFormula?.trim() ? { localRuleFormula: partial.localRuleFormula.trim() } : {},
    injectInContinuity: partial.injectInContinuity !== false,
    order: Number.isFinite(partial.order) ? Math.round(Number(partial.order)) : 0
  };
}
function slugifyKey(raw, fallback = "stat") {
  const cleaned = String(raw ?? "").trim().toLowerCase().replace(/['\u2019]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 64);
  return cleaned || fallback;
}
function createStatSchema(partial) {
  const id = slugifyKey(partial.id ?? partial.label, "stat");
  const scope = partial.scope ?? "character";
  const displayStyle = partial.displayStyle ?? "auto";
  const textStyleSelected = displayStyle === "feed_cards" || displayStyle === "step_chain" || displayStyle === "quote_callout" || displayStyle === "key_value" || displayStyle === "arc_tracker" || displayStyle === "accordion_cards" || displayStyle === "matrix_badges" || displayStyle === "meter_mini_bars" || displayStyle === "stat_pills_grid" || displayStyle === "bullet_ledger" || displayStyle === "timeline_list" || displayStyle === "checklist";
  const kind = displayStyle === "pill_list" ? "tags" : textStyleSelected && (!partial.kind || partial.kind === "meter") ? "text" : partial.kind ?? "meter";
  const min = Number.isFinite(partial.min) ? Number(partial.min) : 0;
  const max = Number.isFinite(partial.max) ? Number(partial.max) : kind === "clock" ? 6 : kind === "pips" || kind === "hearts" ? 5 : kind === "attributes" ? 20 : kind === "currency" ? 99999999 : 100;
  const volatility = partial.volatility ?? (scope === "character" ? "progressive" : "momentary");
  const anchors = Array.isArray(partial.anchors) ? partial.anchors : [];
  const defaultTab = scope === "character" ? "cast" : scope === "world" ? "world" : "stats";
  const pinned = Boolean(partial.pinnedToHeader ?? partial.showIn?.pinnedHeader);
  const showIn = {
    widget: partial.showIn?.widget ?? true,
    inline: partial.showIn?.inline ?? true,
    dossier: partial.showIn?.dossier ?? scope === "character",
    pinnedHeader: pinned
  };
  return {
    id,
    label: partial.label.trim().slice(0, 80) || id,
    icon: partial.icon?.trim().slice(0, 8) || "\uD83D\uDCCA",
    scope,
    kind,
    min: Math.min(min, max),
    max: Math.max(min, max),
    step: Number.isFinite(partial.step) && Number(partial.step) > 0 ? Number(partial.step) : 1,
    defaultValue: partial.defaultValue !== undefined ? partial.defaultValue : kind === "boolean" ? false : kind === "skill_tree" ? "SP: 2 | Basic Focus (Lv.1/5, cost:1, +10% efficiency)" : kind === "xp_level" ? "Lv. 1 | 0/100 XP | Rank E" : kind === "attributes" ? "STR:10, DEX:10, CON:10, INT:10, WIS:10, CHA:10" : kind === "inventory" ? "None" : kind === "status_fx" ? "None" : kind === "text" || kind === "tags" || kind === "tier" ? partial.options?.[0] ?? "None" : Math.max(Math.min(min, max), Math.min(Math.max(min, max), 0)),
    ...partial.options?.length ? { options: partial.options } : {},
    anchors,
    volatility,
    triggerCues: partial.triggerCues?.trim() ?? "",
    ...partial.formula?.trim() ? { formula: partial.formula.trim() } : {},
    color: partial.color?.trim() || "var(--lumiverse-primary)",
    enabled: partial.enabled !== false,
    locked: Boolean(partial.locked),
    pinnedToHeader: pinned,
    displayStyle: partial.displayStyle ?? "auto",
    layoutSpan: partial.layoutSpan ?? "auto",
    showIn,
    tabId: partial.tabId?.trim() || defaultTab,
    widgetTabId: partial.widgetTabId?.trim() || defaultTab,
    inlineTabId: partial.inlineTabId?.trim() || defaultTab,
    dossierTabId: partial.dossierTabId?.trim() || "bonds",
    ...Array.isArray(partial.extraWidgetTabIds) && partial.extraWidgetTabIds.length ? { extraWidgetTabIds: [...new Set(partial.extraWidgetTabIds.map(String))] } : {},
    ...Array.isArray(partial.extraInlineTabIds) && partial.extraInlineTabIds.length ? { extraInlineTabIds: [...new Set(partial.extraInlineTabIds.map(String))] } : {},
    calculationMode: partial.calculationMode === "local_formula" || partial.calculationMode === "ai_plus_local" || partial.calculationMode === "ai" ? partial.calculationMode : Boolean(partial.formula?.trim()) ? "local_formula" : "ai",
    ...partial.formulaOutputTemplate?.trim() ? { formulaOutputTemplate: partial.formulaOutputTemplate.trim() } : {},
    promptTriggerMode: partial.promptTriggerMode === "conditional" || partial.promptTriggerMode === "manual" ? partial.promptTriggerMode : "always",
    ...Array.isArray(partial.promptKeywords) && partial.promptKeywords.length ? {
      promptKeywords: [
        ...new Set(partial.promptKeywords.map((k) => String(k).trim().toLowerCase()).filter(Boolean))
      ].slice(0, 32)
    } : {},
    injectInContinuity: partial.injectInContinuity !== false,
    ...partial.categoryId?.trim() ? { categoryId: partial.categoryId.trim() } : {},
    ...partial.alerts?.length ? { alerts: partial.alerts } : {}
  };
}
function defaultSurfaceTabs() {
  return [
    { id: "stats", label: "You & Scene", icon: "\uD83D\uDCCA", kind: "stats", enabled: true, order: 0 },
    { id: "cast", label: "Cast", icon: "\uD83D\uDC65", kind: "cast", enabled: true, order: 1 },
    { id: "web", label: "Bond Web", icon: "\uD83D\uDD78\uFE0F", kind: "web", enabled: true, order: 2 },
    { id: "map", label: "Atlas", icon: "\uD83D\uDDFA\uFE0F", kind: "map", enabled: true, order: 3 },
    { id: "world", label: "World & Clocks", icon: "\uD83C\uDF0D", kind: "world", enabled: true, order: 4 }
  ];
}
function defaultInlineTabs() {
  return [
    { id: "stats", label: "Stats", icon: "\uD83D\uDCCA", kind: "stats", enabled: true, order: 0 },
    { id: "cast", label: "Cast", icon: "\uD83D\uDC65", kind: "cast", enabled: true, order: 1 },
    { id: "web", label: "Bond Web", icon: "\uD83D\uDD78\uFE0F", kind: "web", enabled: true, order: 2 },
    { id: "world", label: "World", icon: "\uD83C\uDF0D", kind: "world", enabled: true, order: 3 }
  ];
}
function defaultDossierTabs() {
  return [
    {
      id: "overview",
      label: "Overview",
      icon: "\u2728",
      kind: "overview",
      enabled: true,
      order: 0,
      showMeters: true,
      showFields: true,
      showSecrets: false,
      showAudit: false,
      showNpcBonds: false
    },
    {
      id: "bonds",
      label: "Player Bonds",
      icon: "\uD83D\uDC96",
      kind: "bonds",
      enabled: true,
      order: 1,
      showMeters: true,
      showFields: false,
      showSecrets: false,
      showAudit: true,
      showNpcBonds: false
    },
    {
      id: "peer_bonds",
      label: "Peer Bonds (NPC\u2194NPC)",
      icon: "\uD83E\uDD1D",
      kind: "peer_bonds",
      enabled: true,
      order: 2,
      showMeters: false,
      showFields: false,
      showSecrets: false,
      showAudit: false,
      showNpcBonds: true
    },
    {
      id: "loadout",
      label: "Attire & Loadout",
      icon: "\uD83D\uDC57",
      kind: "loadout",
      enabled: true,
      order: 3,
      showMeters: false,
      showFields: true,
      showSecrets: false,
      showAudit: false,
      showNpcBonds: false
    },
    {
      id: "secrets",
      label: "Secrets & Notes",
      icon: "\uD83D\uDD75\uFE0F",
      kind: "secrets",
      enabled: true,
      order: 4,
      showMeters: false,
      showFields: false,
      showSecrets: true,
      showAudit: false,
      showNpcBonds: false
    }
  ];
}
function defaultSurfacesConfig() {
  return {
    widgetTabs: defaultSurfaceTabs(),
    inlineTabs: defaultInlineTabs(),
    dossierTabs: defaultDossierTabs(),
    trackNpcBonds: true,
    showRelationshipWeb: true,
    customWidgetHtml: "",
    customInlineHtml: "",
    customDossierHtml: ""
  };
}
function defaultCoreTrackersConfig() {
  return {
    trackPlayerAttire: true,
    playerAttireLabel: "Your Current Attire / Presentation",
    playerAttireInstruction: "Update whenever the player character changes clothing, state of dress, or physical presentation.",
    showPlayerAttireCard: true,
    trackPlayerCondition: true,
    playerConditionLabel: "Physical / Mental Condition",
    playerConditionInstruction: "Track physical injuries, fatigue, intoxication, disorientation, or mental state.",
    showPlayerConditionCard: true,
    trackPlayerAction: false,
    playerActionLabel: "Latest Notable Action",
    playerActionInstruction: "Summarize the player character\u2019s most consequential current action.",
    trackSceneSummary: true,
    sceneSummaryLabel: "Scene Beat Summary",
    sceneSummaryInstruction: "Concise 1-sentence summary of what just happened in the scene.",
    showSceneSummaryInWidget: true,
    trackPlaces: true,
    placesInstruction: "Extract new or visited locations into zones[] (building/district), places[] (room/spot with tags & brief note), and paths[].",
    trackQuests: true,
    questsInstruction: "Track active story goals, deadlines, and sub-objectives; mark completed when resolved.",
    showQuestsInWidget: true,
    trackDispatches: true,
    dispatchesInstruction: "Log brief off-screen developments or upcoming hooks for characters not currently in the room.",
    showDispatchesInWidget: true,
    trackNpcConditions: true,
    npcConditionsInstruction: "Track short status tags on NPCs (e.g. Flustered, Armed, Injured, Hurried).",
    trackNpcSecrets: true,
    npcSecretsInstruction: "Record discovered clues, hidden motives, or confirmed secrets per NPC.",
    sceneLocationInstruction: 'Current specific spot and broader area formatted cleanly as "Specific Room/Spot, District/Building".',
    sceneTimeInstruction: 'Current in-story clock time (e.g. "08:15 AM" or story-appropriate time-of-day).',
    sceneDateInstruction: 'Current in-story date, day count, or era label (e.g. "Day 1" or "Oct 14, 2002").',
    sceneWeatherInstruction: 'Concise weather and immediate atmosphere (e.g. "Clear", "Light Rain", "Tense Indoors").',
    sceneTimeFlowInstruction: 'Estimate elapsed minutes ("mins") realistically for the actions in this beat.',
    scenePillLocked: false,
    overrides: {}
  };
}
function defaultDossierFields() {
  return [
    {
      id: "role_summary",
      label: "Role & Bond to Player",
      icon: "\uD83E\uDEAA",
      placeholder: "e.g. Loyal personal maid, Childhood rival\u2026",
      instruction: "Concise role and established relationship to the player.",
      tabId: "overview",
      displayStyle: "badge",
      showInHudCast: false,
      showInInlineCast: false,
      enabled: true,
      locked: false
    },
    {
      id: "demeanor",
      label: "Current Demeanor & Mood",
      icon: "\uD83C\uDFAD",
      placeholder: "e.g. Flustered, Guarded, Warm\u2026",
      instruction: "Current emotional demeanor and facial expression in the scene.",
      tabId: "overview",
      displayStyle: "badge",
      showInHudCast: true,
      showInInlineCast: false,
      enabled: true,
      locked: false
    },
    {
      id: "inner_thought",
      label: "Inner Monologue",
      icon: "\uD83D\uDCAD",
      placeholder: "Unspoken internal thought in this moment\u2026",
      instruction: "Short first-person unspoken thought or internal reaction to the current beat.",
      tabId: "overview",
      displayStyle: "quote",
      showInHudCast: true,
      showInInlineCast: true,
      enabled: true,
      locked: false
    },
    {
      id: "immediate_goal",
      label: "Immediate Goal",
      icon: "\uD83C\uDFAF",
      placeholder: "What this character is trying to do right now\u2026",
      instruction: "Immediate objective or intention in the current scene.",
      tabId: "overview",
      displayStyle: "card",
      showInHudCast: false,
      showInInlineCast: false,
      enabled: true,
      locked: false
    },
    {
      id: "attire_layers",
      label: "Current Outfit & Presentation",
      icon: "\uD83D\uDC57",
      placeholder: "Observed clothing & state of dress",
      instruction: "Update whenever clothing, state of undress, or physical presentation is described or changed.",
      tabId: "loadout",
      displayStyle: "card",
      showInHudCast: true,
      showInInlineCast: true,
      enabled: true,
      locked: false
    },
    {
      id: "carried_items",
      label: "Carried Items & Props",
      icon: "\uD83C\uDF92",
      placeholder: "Items in hand or on person",
      instruction: "Track notable items, tools, or gifts currently held or worn.",
      tabId: "loadout",
      displayStyle: "pills",
      showInHudCast: false,
      showInInlineCast: false,
      enabled: true,
      locked: false
    },
    {
      id: "bond_dynamic",
      label: "Relationship Dynamic",
      icon: "\uD83D\uDD17",
      placeholder: "Established dynamic with player",
      instruction: "Summarize the current interpersonal dynamic and power balance with the player.",
      tabId: "overview",
      displayStyle: "card",
      showInHudCast: false,
      showInInlineCast: false,
      enabled: true,
      locked: false
    }
  ];
}
function createDefaultTemplate() {
  return {
    schema: "lumi-stats-template/v1",
    id: "universal_companion",
    name: "Universal Roleplay Companion",
    icon: "\u2728",
    description: "Schema-driven roleplay stats with two-phase calibration for relationships, momentary situational reactions, and world progression.",
    promptPosition: "post_history",
    promptDepth: 1,
    theme: {
      surfaceStyle: "glass",
      pillStyle: "glass_capsule",
      frameShape: "rounded",
      radiusPreset: "balanced",
      meterStyle: "smooth",
      castLayout: "roster",
      glowIntensity: 55,
      glassBlur: true,
      widgetWidth: 460,
      widgetHeight: 540,
      pillWidth: 420,
      pillHeight: 92,
      widgetTabsIconOnly: false,
      compact: false,
      placement: "both_bottom",
      inlineDefaultExpanded: false,
      showSceneChips: {
        time: true,
        date: true,
        location: true,
        weather: true,
        cast: true,
        pinnedStats: true
      },
      customCss: ""
    },
    tabs: defaultSurfaceTabs(),
    surfaces: defaultSurfacesConfig(),
    coreTrackers: defaultCoreTrackersConfig(),
    categories: [],
    stats: [
      createStatSchema({
        id: "composure",
        label: "Composure",
        icon: "\uD83E\uDDED",
        scope: "player",
        kind: "meter",
        min: 0,
        max: 100,
        defaultValue: 85,
        volatility: "momentary",
        pinnedToHeader: true,
        triggerCues: "85=poised, 55=masking, 30=flustered, 0=shaken; drops on teasing, undress, or pressure.",
        anchors: [
          { value: 80, label: "Poised & Collected", description: "Calm, confident, and in control" },
          { value: 55, label: "Steady / Masking", description: "Holding it together despite pressure" },
          { value: 30, label: "Flustered / Rattled", description: "Caught off-guard, blushing, or defensive" },
          { value: 0, label: "Shaken / Overwhelmed", description: "Completely flustered or panicking" }
        ]
      }),
      createStatSchema({
        id: "trust",
        label: "Trust",
        icon: "\uD83D\uDEE1\uFE0F",
        scope: "character",
        kind: "meter",
        min: 0,
        max: 100,
        defaultValue: 45,
        volatility: "progressive",
        pinnedToHeader: true,
        dossierTabId: "bonds",
        triggerCues: "Calibrate: hostile=15, stranger=45, ally/family=70, confidant=90; shift on honesty/betrayal.",
        anchors: [
          { value: 85, label: "Trusted Confidant", description: "Unconditional trust and deep confidence" },
          { value: 65, label: "Open & Relying", description: "Clear trust, family familiarity, or proven ally" },
          { value: 40, label: "Neutral / Polite", description: "Standard baseline for unproven acquaintances" },
          { value: 20, label: "Guarded / Wary", description: "Skeptical, cautious, or holding back" },
          { value: 0, label: "Deeply Distrustful", description: "Expects betrayal or actively hostile" }
        ]
      }),
      createStatSchema({
        id: "loyalty",
        label: "Loyalty & Devotion",
        icon: "\u269C\uFE0F",
        scope: "character",
        kind: "meter",
        min: 0,
        max: 100,
        defaultValue: 50,
        volatility: "anchor",
        dossierTabId: "bonds",
        triggerCues: "Calibrate: rival=10, peer=45, family=75, sworn retainer/partner=90; shift on oaths/betrayal.",
        anchors: [
          { value: 85, label: "Fiercely Loyal", description: "Devoted retainer, sworn protector, or deeply committed partner" },
          { value: 65, label: "Dependable Ally", description: "Supportive family member, friend, or companion" },
          { value: 40, label: "Cooperative", description: "Neutral or professional alignment" },
          { value: 15, label: "Self-Interested", description: "Prioritizes own agenda; easily swayed" },
          { value: 0, label: "Unbound / Opposed", description: "No allegiance or actively opposed" }
        ]
      }),
      createStatSchema({
        id: "affection",
        label: "Affection & Fondness",
        icon: "\u2764\uFE0F",
        scope: "character",
        kind: "meter",
        min: 0,
        max: 100,
        defaultValue: 45,
        volatility: "progressive",
        dossierTabId: "bonds",
        triggerCues: "Calibrate: cold=15, polite=45, fond friend/family=70, loving=90; shift with warmth/coldness.",
        anchors: [
          { value: 85, label: "Deeply Devoted", description: "Profound love, adoration, or attachment" },
          { value: 65, label: "Warm & Fond", description: "Genuine care, closeness, and affection" },
          { value: 40, label: "Friendly / Neutral", description: "Amiable or neutral baseline" },
          { value: 20, label: "Cold / Distant", description: "Aloof, irritated, or emotionally detached" },
          { value: 0, label: "Averse / Hostile", description: "Dislike, bitterness, or rejection" }
        ]
      }),
      createStatSchema({
        id: "desire",
        label: "Desire & Attraction",
        icon: "\uD83D\uDD25",
        scope: "character",
        kind: "meter",
        min: 0,
        max: 100,
        defaultValue: 0,
        volatility: "momentary",
        dossierTabId: "bonds",
        triggerCues: "0=platonic, 30=sparked, 60=intense, 85=consuming; spikes on allure, undress, touch, flirting.",
        anchors: [
          { value: 80, label: "Consuming", description: "Overwhelming attraction or longing in the scene" },
          { value: 55, label: "Intense", description: "Strong visible attraction, flustered gaze, or magnetic pull" },
          { value: 25, label: "Sparked / Noticeable", description: "Caught off-guard by appearance, proximity, or suggestive beat" },
          { value: 0, label: "Platonic / Dormant", description: "No active romantic or physical tension" }
        ]
      }),
      createStatSchema({
        id: "arousal",
        label: "Arousal & Fluster",
        icon: "\uD83D\uDC93",
        scope: "character",
        kind: "meter",
        min: 0,
        max: 100,
        defaultValue: 0,
        volatility: "momentary",
        dossierTabId: "bonds",
        triggerCues: "0=calm, 25=blushing, 55=heated, 85=breathless; spikes on nudity/towel, skin contact, intimacy.",
        anchors: [
          { value: 80, label: "Breathless / Peak", description: "Heavily aroused or physically overwhelmed" },
          { value: 50, label: "Heated / Flushed", description: "Visibly flustered, racing pulse, or strong physical reaction" },
          { value: 20, label: "Stirred / Blushing", description: "Initial spike from suggestive visual cue, towel, or close contact" },
          { value: 0, label: "Composed", description: "Calm physiological state" }
        ]
      }),
      createStatSchema({
        id: "world_tension",
        label: "Scene Tension Clock",
        icon: "\u23F1\uFE0F",
        scope: "world",
        kind: "clock",
        min: 0,
        max: 6,
        defaultValue: 0,
        volatility: "progressive",
        widgetTabId: "world",
        inlineTabId: "world",
        triggerCues: "+1 when suspense, danger, or complications escalate; reduce when resolved."
      })
    ],
    dossierFields: defaultDossierFields(),
    updatedAt: new Date().toISOString()
  };
}
var BUILTIN_TEMPLATES = [
  createDefaultTemplate(),
  {
    ...createDefaultTemplate(),
    id: "romance_slice_of_life",
    name: "Romance, Chemistry & Wardrobe",
    icon: "\uD83C\uDF38",
    description: "Focused on interpersonal chemistry, momentary blush/fluster, desire, devotion, and detailed outfit layers.",
    theme: {
      ...createDefaultTemplate().theme,
      surfaceStyle: "cozy_vn",
      pillStyle: "vn_dialogue_bar",
      accentHue: 330,
      secondaryHue: 200
    },
    stats: [
      ...createDefaultTemplate().stats.filter((s) => s.id !== "world_tension"),
      createStatSchema({
        id: "chemistry",
        label: "Spark & Chemistry",
        icon: "\u2728",
        scope: "character",
        kind: "meter",
        min: 0,
        max: 100,
        defaultValue: 35,
        color: "#f472b6",
        volatility: "momentary",
        pinnedToHeader: true,
        dossierTabId: "bonds",
        triggerCues: "0\u2013100 scale. Rises on playful banter, shared silences, eye contact, and romantic tension; cools on awkwardness."
      }),
      createStatSchema({
        id: "intimacy_stage",
        label: "Romantic Tension Clock",
        icon: "\uD83D\uDC97",
        scope: "scene",
        kind: "clock",
        min: 0,
        max: 6,
        defaultValue: 0,
        color: "#f472b6",
        volatility: "momentary",
        widgetTabId: "stats",
        inlineTabId: "stats",
        triggerCues: "0\u20136 segments. Advances as physical proximity, vulnerability, or romantic confession builds in the scene."
      })
    ]
  },
  {
    ...createDefaultTemplate(),
    id: "tactical_adventure",
    name: "Adventure, Party & World Clocks",
    icon: "\u2694\uFE0F",
    description: "Vitality, Resolve, Party Loyalty, Trust, and World Threat Clocks for fantasy or sci-fi campaigns.",
    stats: [
      createStatSchema({
        id: "vitality",
        label: "Vitality",
        icon: "\u2764\uFE0F",
        scope: "player",
        kind: "meter",
        min: 0,
        max: 100,
        defaultValue: 100,
        volatility: "momentary",
        pinnedToHeader: true,
        triggerCues: "Drops on injuries, exhaustion, or hazards; restores with medical care or rest."
      }),
      createStatSchema({
        id: "resolve",
        label: "Resolve & Energy",
        icon: "\u26A1",
        scope: "player",
        kind: "meter",
        min: 0,
        max: 100,
        defaultValue: 100,
        volatility: "momentary",
        pinnedToHeader: true,
        triggerCues: "Spent on strenuous feats, spells, or high-stress confrontations; recovered on rest."
      }),
      ...createDefaultTemplate().stats.filter((s) => s.scope !== "player")
    ]
  },
  {
    ...createDefaultTemplate(),
    id: "mystery_thriller",
    name: "Investigation & Suspicion Ledger",
    icon: "\uD83D\uDD75\uFE0F",
    description: "Tracks Case Progress, Suspect Alertness, Credibility, Pressure, and discovered clues.",
    stats: [
      createStatSchema({
        id: "case_progress",
        label: "Investigation Progress",
        icon: "\uD83D\uDD0E",
        scope: "player",
        kind: "meter",
        min: 0,
        max: 100,
        defaultValue: 0,
        volatility: "progressive",
        pinnedToHeader: true,
        triggerCues: "Increases as physical clues, motives, and alibi contradictions are uncovered."
      }),
      createStatSchema({
        id: "suspicion",
        label: "Suspicion & Guilt",
        icon: "\uD83D\uDC41\uFE0F",
        scope: "character",
        kind: "meter",
        min: 0,
        max: 100,
        defaultValue: 15,
        volatility: "progressive",
        pinnedToHeader: true,
        triggerCues: "Calibrate from initial evidence; increase on lies, evasions, or incriminating discoveries."
      }),
      createStatSchema({
        id: "pressure",
        label: "Interrogation Pressure",
        icon: "\uD83D\uDCA2",
        scope: "character",
        kind: "clock",
        min: 0,
        max: 6,
        defaultValue: 0,
        volatility: "momentary",
        triggerCues: "Advance when cornered with evidence or tough questioning; drops when given breathing room."
      }),
      createStatSchema({
        id: "alert_clock",
        label: "Danger / Alert Clock",
        icon: "\uD83D\uDEA8",
        scope: "world",
        kind: "clock",
        min: 0,
        max: 6,
        defaultValue: 0,
        volatility: "momentary",
        pinnedToHeader: true,
        widgetTabId: "world",
        inlineTabId: "world",
        triggerCues: "Advances by +1 when making noise, tipping off suspects, or triggering alarms."
      })
    ]
  },
  {
    ...createDefaultTemplate(),
    id: "litrpg_skill_tree",
    name: "LitRPG System, Skill Trees & Gear",
    icon: "\u2694\uFE0F",
    description: "Full game HUD with HP/MP, XP & Leveling, Skill Points & Interactive Skill Tree, Core Attributes, Buffs/Debuffs, and Rarity Gear.",
    theme: {
      ...createDefaultTemplate().theme,
      surfaceStyle: "arcane_rpg",
      frameShape: "ornate",
      meterStyle: "glow",
      accentHue: 42,
      secondaryHue: 198
    },
    stats: [
      createStatSchema({
        id: "hp",
        label: "Health (HP)",
        icon: "\u2764\uFE0F",
        scope: "player",
        kind: "meter",
        min: 0,
        max: 100,
        defaultValue: 100,
        color: "#f43f5e",
        volatility: "momentary",
        pinnedToHeader: true,
        triggerCues: "Drops on damage, traps, or exhaustion; recovers via healing, potions, or rest."
      }),
      createStatSchema({
        id: "mp",
        label: "Mana / Stamina",
        icon: "\uD83D\uDCA0",
        scope: "player",
        kind: "meter",
        min: 0,
        max: 100,
        defaultValue: 100,
        color: "#38bdf8",
        volatility: "momentary",
        pinnedToHeader: true,
        triggerCues: "Spent when casting spells or using active skills; regenerates during recovery."
      }),
      createStatSchema({
        id: "xp_level",
        label: "Level & XP",
        icon: "\u2B50",
        scope: "player",
        kind: "xp_level",
        defaultValue: "Lv. 1 | 0/100 XP | Rank E",
        color: "#f59e0b",
        volatility: "progressive",
        triggerCues: 'Format: "Lv. N | cur/next XP | Rank X". Award XP on victories, discoveries, and milestones; level up when cur >= next.'
      }),
      createStatSchema({
        id: "gold",
        label: "Gold Coins",
        icon: "\uD83E\uDE99",
        scope: "player",
        kind: "currency",
        min: 0,
        max: 99999999,
        defaultValue: 100,
        color: "#f59e0b",
        volatility: "progressive",
        triggerCues: "Track player currency/gold. Adjust via +N / -N on purchases, rewards, or loot."
      }),
      createStatSchema({
        id: "attributes",
        label: "Core Attributes",
        icon: "\uD83E\uDDEC",
        scope: "player",
        kind: "attributes",
        min: 1,
        max: 30,
        defaultValue: "STR:10, DEX:10, CON:10, INT:10, WIS:10, CHA:10",
        color: "#818cf8",
        layoutSpan: "full",
        volatility: "anchor",
        triggerCues: 'Comma-separated stats: "STR:N, DEX:N, CON:N, INT:N, WIS:N, CHA:N". Update when training or leveling.'
      }),
      createStatSchema({
        id: "skill_tree",
        label: "Skill Tree & SP",
        icon: "\uD83C\uDF33",
        scope: "player",
        kind: "skill_tree",
        defaultValue: "SP: 2 | Combat Sense (Lv.1/5, cost:1, +10% Eva) ; Arcane Spark (Lv.0/5, cost:1, req:Combat Sense)",
        color: "#10b981",
        layoutSpan: "full",
        volatility: "progressive",
        triggerCues: 'Format: "SP: N | Skill A (Lv.X/Y, cost:1, bonus) ; Skill B (Lv.X/Y, cost:1, req:Skill A)". Grant SP on level-ups or breakthroughs.'
      }),
      createStatSchema({
        id: "status_fx",
        label: "Buffs & Debuffs",
        icon: "\u26A1",
        scope: "player",
        kind: "status_fx",
        defaultValue: "None",
        color: "#2dd4bf",
        layoutSpan: "full",
        volatility: "momentary",
        triggerCues: 'Prefix buffs with "+" and debuffs with "-" separated by "; ", e.g. "+Barrier (3t) ; -Bleeding (2t)".'
      }),
      createStatSchema({
        id: "inventory",
        label: "Gear & Inventory",
        icon: "\uD83C\uDF92",
        scope: "player",
        kind: "inventory",
        defaultValue: "Traveler Blade [common, equipped] ; Ration x2 [common]",
        color: "#a78bfa",
        layoutSpan: "full",
        volatility: "progressive",
        triggerCues: 'List items separated by "; " with qty & rarity tags, e.g. "Runed Dagger [rare, equipped] ; Potion x3 [common]".'
      }),
      ...createDefaultTemplate().stats.filter((s) => s.scope === "character" || s.scope === "world")
    ]
  },
  {
    ...createDefaultTemplate(),
    id: "persona_social_sim",
    name: "Stylish Social Sim & Confidants",
    icon: "\uD83C\uDCCF",
    description: "High-contrast social sim HUD with Confidant Heart ranks, Social Stats (Charm/Courage/Knowledge), and stylish badges.",
    theme: {
      ...createDefaultTemplate().theme,
      surfaceStyle: "persona_pop",
      frameShape: "sharp",
      meterStyle: "segmented",
      accentHue: 348,
      secondaryHue: 45
    },
    stats: [
      createStatSchema({
        id: "social_stats",
        label: "Social Qualities",
        icon: "\u2B50",
        scope: "player",
        kind: "attributes",
        min: 1,
        max: 10,
        defaultValue: "Knowledge:2, Charm:2, Courage:2, Kindness:2, Proficiency:2",
        color: "#f43f5e",
        layoutSpan: "full",
        volatility: "progressive",
        triggerCues: 'Comma-separated 1\u201310 qualities: "Knowledge:N, Charm:N, Courage:N, Kindness:N, Proficiency:N".'
      }),
      createStatSchema({
        id: "composure",
        label: "Cool / Composure",
        icon: "\uD83C\uDFAD",
        scope: "player",
        kind: "meter",
        min: 0,
        max: 100,
        defaultValue: 85,
        color: "#facc15",
        volatility: "momentary",
        pinnedToHeader: true,
        triggerCues: "85=stylish, 55=steady, 30=rattled, 0=flustered."
      }),
      createStatSchema({
        id: "bond_hearts",
        label: "Confidant Bond Rank",
        icon: "\u2764\uFE0F",
        scope: "character",
        kind: "hearts",
        min: 0,
        max: 10,
        defaultValue: 3,
        color: "#f472b6",
        volatility: "progressive",
        pinnedToHeader: true,
        triggerCues: "0\u201310 heart rank. Increases on meaningful hangouts, honesty, or breakthroughs."
      }),
      ...createDefaultTemplate().stats.filter((s) => s.scope === "character" || s.scope === "world")
    ]
  }
];
function createEmptyCampaignState(template) {
  const stats = {};
  for (const def of template.stats) {
    if (!def.enabled || def.scope === "character")
      continue;
    stats[def.id] = {
      id: def.id,
      scope: def.scope,
      value: def.defaultValue,
      calibrated: false,
      locked: def.locked
    };
  }
  return {
    initialized: false,
    title: "Uncharted Story",
    canonPremise: "",
    turnCount: 0,
    elapsedMinutes: 0,
    scene: {
      location: "",
      timeLabel: "08:00 AM",
      dateLabel: "Day 1",
      weather: "Clear",
      beatSummary: ""
    },
    player: {
      name: "",
      attire: "",
      condition: "Normal",
      notableAction: ""
    },
    currentPlaceId: "",
    stats,
    modifiers: [],
    characters: {},
    mapZones: {},
    places: {},
    mapPaths: [],
    quests: {},
    dispatches: [],
    auditLog: []
  };
}
function normalizeImportedTemplate(rawInput, nameOverride) {
  const base = createDefaultTemplate();
  if (!rawInput || typeof rawInput !== "object")
    return base;
  const raw = rawInput;
  const name = (nameOverride?.trim() || String(raw.name ?? raw.templateName ?? base.name)).slice(0, 80);
  const id = slugifyKey(raw.id ?? name, "template");
  const stats = [];
  const hasExplicitStatsArray = Array.isArray(raw.stats);
  if (hasExplicitStatsArray) {
    for (const item of raw.stats) {
      if (item && typeof item === "object") {
        const s = { ...item };
        if (s.label || s.id) {
          if (s.kind !== "skill_tree" && typeof s.defaultValue === "string" && /^SP:\s*\d+\s*\|\s*Basic Focus/i.test(s.defaultValue)) {
            s.defaultValue = "None";
          }
          stats.push(createStatSchema({ ...s, label: String(s.label ?? s.id) }));
        }
      }
    }
  }
  const rawSurfaces = raw.surfaces && typeof raw.surfaces === "object" ? raw.surfaces : {};
  const surfaces = {
    widgetTabs: Array.isArray(rawSurfaces.widgetTabs) && rawSurfaces.widgetTabs.length ? rawSurfaces.widgetTabs : base.surfaces.widgetTabs,
    inlineTabs: Array.isArray(rawSurfaces.inlineTabs) && rawSurfaces.inlineTabs.length ? rawSurfaces.inlineTabs : base.surfaces.inlineTabs,
    dossierTabs: Array.isArray(rawSurfaces.dossierTabs) && rawSurfaces.dossierTabs.length ? rawSurfaces.dossierTabs : base.surfaces.dossierTabs,
    trackNpcBonds: rawSurfaces.trackNpcBonds !== false,
    showRelationshipWeb: rawSurfaces.showRelationshipWeb !== false,
    customWidgetHtml: typeof rawSurfaces.customWidgetHtml === "string" ? rawSurfaces.customWidgetHtml : "",
    customInlineHtml: typeof rawSurfaces.customInlineHtml === "string" ? rawSurfaces.customInlineHtml : "",
    customDossierHtml: typeof rawSurfaces.customDossierHtml === "string" ? rawSurfaces.customDossierHtml : ""
  };
  let dossierFields = base.dossierFields;
  if (Array.isArray(raw.dossierFields)) {
    const incoming = raw.dossierFields;
    const hasCoreMigrated = incoming.some((f) => f.id === "inner_thought" || f.id === "immediate_goal" || f.id === "demeanor");
    if (hasCoreMigrated) {
      dossierFields = incoming;
    } else {
      const existingIds = new Set(incoming.map((f) => f.id));
      const prependedCore = base.dossierFields.filter((bf) => ["role_summary", "demeanor", "inner_thought", "immediate_goal"].includes(bf.id) && !existingIds.has(bf.id));
      dossierFields = [...prependedCore, ...incoming];
    }
  }
  const defaultsCore = defaultCoreTrackersConfig();
  const rawCoreTrackers = raw.coreTrackers && typeof raw.coreTrackers === "object" ? raw.coreTrackers : {};
  const coreTrackers = {
    ...defaultsCore,
    ...rawCoreTrackers,
    overrides: {
      ...defaultsCore.overrides ?? {},
      ...rawCoreTrackers.overrides && typeof rawCoreTrackers.overrides === "object" ? rawCoreTrackers.overrides : {}
    }
  };
  const rawTheme = raw.theme && typeof raw.theme === "object" ? raw.theme : {};
  const validStyles = new Set([
    "glass",
    "soft",
    "sleek",
    "minimal",
    "neon",
    "arcane_rpg",
    "cyber_hud",
    "persona_pop",
    "cozy_vn"
  ]);
  const validSurfaceStyle = validStyles.has(String(rawTheme.surfaceStyle)) ? rawTheme.surfaceStyle : base.theme.surfaceStyle;
  const validPillStyles = new Set([
    "glass_capsule",
    "vn_dialogue_bar",
    "rpg_status_bar",
    "persona_ticker",
    "cyber_telemetry",
    "minimal_floating",
    "neon_edge",
    "split_deck",
    "compact_badge",
    "ledger_strip"
  ]);
  const validPillStyle = validPillStyles.has(rawTheme.pillStyle) ? rawTheme.pillStyle : base.theme.pillStyle ?? "glass_capsule";
  const validFrameShape = rawTheme.frameShape === "chamfered" || rawTheme.frameShape === "sharp" || rawTheme.frameShape === "ornate" || rawTheme.frameShape === "rounded" ? rawTheme.frameShape : base.theme.frameShape;
  const validRadiusPreset = rawTheme.radiusPreset === "sharp" || rawTheme.radiusPreset === "pill" || rawTheme.radiusPreset === "balanced" ? rawTheme.radiusPreset : base.theme.radiusPreset;
  const validMeterStyle = rawTheme.meterStyle === "segmented" || rawTheme.meterStyle === "glow" || rawTheme.meterStyle === "smooth" ? rawTheme.meterStyle : base.theme.meterStyle;
  const validCastLayout = rawTheme.castLayout === "cards" || rawTheme.castLayout === "roster" ? rawTheme.castLayout : base.theme.castLayout;
  const validAccentHue = typeof rawTheme.accentHue === "number" && Number.isFinite(rawTheme.accentHue) ? Math.max(0, Math.min(360, Math.round(rawTheme.accentHue))) : undefined;
  const validSecondaryHue = typeof rawTheme.secondaryHue === "number" && Number.isFinite(rawTheme.secondaryHue) ? Math.max(0, Math.min(360, Math.round(rawTheme.secondaryHue))) : undefined;
  const clampNum = (v, min, max, fallback) => typeof v === "number" && Number.isFinite(v) ? Math.max(min, Math.min(max, Math.round(v))) : fallback;
  return {
    ...base,
    id,
    name,
    icon: typeof raw.icon === "string" && raw.icon.trim() ? raw.icon.trim().slice(0, 12) : base.icon,
    description: typeof raw.description === "string" ? raw.description.slice(0, 400) : base.description,
    userSelected: true,
    promptPosition: raw.promptPosition === "pre_history" || raw.promptPosition === "in_history" ? raw.promptPosition : "post_history",
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
      ...validAccentHue !== undefined ? { accentHue: validAccentHue } : { accentHue: undefined },
      ...validSecondaryHue !== undefined ? { secondaryHue: validSecondaryHue } : { secondaryHue: undefined },
      widgetTabsIconOnly: Boolean(rawTheme.widgetTabsIconOnly),
      compact: Boolean(rawTheme.compact),
      inlineDefaultExpanded: Boolean(rawTheme.inlineDefaultExpanded),
      customCss: typeof rawTheme.customCss === "string" ? rawTheme.customCss.slice(0, 8000) : "",
      showSceneChips: {
        ...base.theme.showSceneChips,
        ...rawTheme.showSceneChips ?? {}
      }
    },
    tabs: surfaces.widgetTabs,
    surfaces,
    coreTrackers,
    categories: Array.isArray(raw.categories) ? raw.categories.filter((c) => Boolean(c && typeof c === "object" && typeof c.name === "string")).map((c, idx) => createStatCategory({ ...c, order: c.order ?? idx })) : [],
    stats: hasExplicitStatsArray ? stats : base.stats,
    dossierFields,
    updatedAt: new Date().toISOString()
  };
}

// src/shared/formula.ts
function parseStatTokens(rawValue) {
  const out = {};
  if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
    out.value = rawValue;
    return out;
  }
  const text = String(rawValue ?? "").trim();
  if (!text || text === "None")
    return out;
  const plainNum = Number(text);
  if (Number.isFinite(plainNum)) {
    out.value = plainNum;
  }
  const slashRe = /\b([A-Za-z][A-Za-z0-9_]{0,20})\s*[:=]?\s*(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)\b/g;
  let m;
  while ((m = slashRe.exec(text)) !== null) {
    const key = m[1];
    const cur = Number(m[2]);
    const max = Number(m[3]);
    if (Number.isFinite(cur)) {
      out[key] = cur;
      out[`${key}_cur`] = cur;
      out[key.toLowerCase()] = cur;
      out[`${key.toLowerCase()}_cur`] = cur;
    }
    if (Number.isFinite(max)) {
      out[`${key}_max`] = max;
      out[`${key.toLowerCase()}_max`] = max;
    }
  }
  const pctMatch = text.match(/(-?\d+(?:\.\d+)?)\s*%/);
  if (pctMatch) {
    const pct = Number(pctMatch[1]);
    if (Number.isFinite(pct)) {
      out.pct = pct;
    }
  }
  const kvRe = /\b([A-Za-z][A-Za-z0-9_]{0,20})(?:\s*[:=]\s*|\.\s*|\s+|(?=-?\d))(-?\d+(?:\.\d+)?)\b(?!\s*\/)/g;
  while ((m = kvRe.exec(text)) !== null) {
    const key = m[1];
    const num = Number(m[2]);
    if (!Number.isFinite(num))
      continue;
    if (out[key] === undefined)
      out[key] = num;
    if (out[key.toLowerCase()] === undefined)
      out[key.toLowerCase()] = num;
  }
  return out;
}
function looksLikeEnglishProse(raw) {
  const s = raw.trim();
  if (!s || s.includes("{{"))
    return false;
  if (/^(?:compute|calculate|format|write|track|update|use)\b/i.test(s))
    return true;
  if (/\.\s+[A-Za-z]+\s+[a-z]+\s+[a-z]+/.test(s))
    return true;
  if (/\b(?:loses|per\s+\d|during|whenever|only\s+if|in\s+this\s+format)\b/i.test(s))
    return true;
  return false;
}
function evaluateSingleExpression(exprSrc, locals, ctx, diagnostics) {
  const src = exprSrc.trim();
  if (!src || src.length > 1000)
    return;
  let pos = 0;
  let steps = 0;
  const skipWhitespace = () => {
    while (pos < src.length && /\s/.test(src[pos] ?? ""))
      pos++;
  };
  const readStringLiteral = () => {
    const quote = src[pos];
    pos++;
    let out = "";
    while (pos < src.length) {
      const ch = src[pos];
      if (ch === "\\" && pos + 1 < src.length) {
        out += src[pos + 1];
        pos += 2;
        continue;
      }
      if (ch === quote) {
        pos++;
        return out;
      }
      out += ch;
      pos++;
    }
    throw new Error("Unterminated string literal");
  };
  const resolveIdentifier = (name) => {
    if (Object.prototype.hasOwnProperty.call(locals, name))
      return locals[name];
    const low = name.toLowerCase();
    for (const [k, v] of Object.entries(locals)) {
      if (k.toLowerCase() === low)
        return v;
    }
    const viaRef = ctx.resolveRef(name);
    if (viaRef !== undefined && Number.isFinite(viaRef))
      return viaRef;
    diagnostics?.missingRefs.add(name);
    return NaN;
  };
  const callBuiltinFn = (name, args) => {
    const fn = name.toLowerCase();
    if (fn === "round") {
      if (!args.length)
        return NaN;
      const dec = args[1] !== undefined && Number.isFinite(args[1]) ? Math.max(0, Math.min(6, Math.round(args[1]))) : 0;
      const factor = 10 ** dec;
      return Math.round(args[0] * factor) / factor;
    }
    if (fn === "floor")
      return args.length ? Math.floor(args[0]) : NaN;
    if (fn === "ceil")
      return args.length ? Math.ceil(args[0]) : NaN;
    if (fn === "abs")
      return args.length ? Math.abs(args[0]) : NaN;
    if (fn === "min")
      return args.length ? Math.min(...args) : NaN;
    if (fn === "max")
      return args.length ? Math.max(...args) : NaN;
    if (fn === "mod")
      return args.length >= 2 && args[1] !== 0 ? args[0] % args[1] : NaN;
    if (fn === "clamp") {
      if (args.length < 3)
        return NaN;
      return Math.max(args[1], Math.min(args[2], args[0]));
    }
    if (fn === "if") {
      if (args.length < 2)
        return NaN;
      const cond = args[0];
      return cond !== 0 && !Number.isNaN(cond) ? args[1] : args[2] ?? 0;
    }
    throw new Error(`Unknown function: ${name}`);
  };
  const parsePrimary = () => {
    if (++steps > 800)
      throw new Error("Formula complexity limit exceeded");
    skipWhitespace();
    const ch = src[pos];
    if (ch === "+" || ch === "-" || ch === "!") {
      pos++;
      const operand = parsePrimary();
      if (ch === "!")
        return operand === 0 || Number.isNaN(operand) ? 1 : 0;
      return ch === "-" ? -operand : operand;
    }
    if (ch === "(") {
      pos++;
      const inner = parseTernary();
      skipWhitespace();
      if (src[pos] !== ")")
        throw new Error("Unclosed parenthesis");
      pos++;
      return inner;
    }
    if (ch === "[") {
      const closeIdx = src.indexOf("]", pos + 1);
      if (closeIdx < 0)
        throw new Error("Unclosed bracket reference");
      const refKey = src.slice(pos + 1, closeIdx).trim();
      pos = closeIdx + 1;
      const val = ctx.resolveRef(refKey);
      if (val !== undefined && Number.isFinite(val))
        return val;
      diagnostics?.missingRefs.add(refKey);
      return NaN;
    }
    const numMatch = src.slice(pos).match(/^(?:\d+(?:\.\d+)?|\.\d+)/);
    if (numMatch) {
      pos += numMatch[0].length;
      return Number(numMatch[0]);
    }
    const idMatch = src.slice(pos).match(/^[A-Za-z_][A-Za-z0-9_.]*/);
    if (idMatch) {
      const ident = idMatch[0];
      pos += ident.length;
      skipWhitespace();
      if (src[pos] === "(") {
        pos++;
        skipWhitespace();
        const fnLow = ident.toLowerCase();
        if (fnLow === "hascond" || fnLow === "hasflag") {
          let matched = false;
          if (src[pos] === '"' || src[pos] === "'") {
            const pattern = readStringLiteral();
            matched = ctx.hasCond(pattern);
            skipWhitespace();
          }
          if (src[pos] !== ")")
            throw new Error(`Expected ) after ${ident}`);
          pos++;
          return matched ? 1 : 0;
        }
        if (fnLow === "match" || fnLow === "matches") {
          let targetStr = "";
          let patStr = "";
          if (src[pos] === '"' || src[pos] === "'") {
            targetStr = readStringLiteral();
          } else {
            const refStart = pos;
            while (pos < src.length && src[pos] !== "," && src[pos] !== ")")
              pos++;
            const key = src.slice(refStart, pos).trim();
            targetStr = ctx.resolveStringRef(key) ?? String(resolveIdentifier(key) || "");
          }
          skipWhitespace();
          if (src[pos] === ",") {
            pos++;
            skipWhitespace();
            if (src[pos] === '"' || src[pos] === "'") {
              patStr = readStringLiteral();
            }
          }
          skipWhitespace();
          if (src[pos] !== ")")
            throw new Error("Expected ) after match()");
          pos++;
          if (!patStr)
            return 0;
          try {
            return new RegExp(patStr, "i").test(targetStr) ? 1 : 0;
          } catch {
            return targetStr.toLowerCase().includes(patStr.toLowerCase()) ? 1 : 0;
          }
        }
        const args = [];
        if (src[pos] !== ")") {
          while (true) {
            args.push(parseTernary());
            skipWhitespace();
            if (src[pos] === ",") {
              pos++;
              continue;
            }
            break;
          }
        }
        if (src[pos] !== ")")
          throw new Error(`Expected ) in ${ident}()`);
        pos++;
        return callBuiltinFn(ident, args);
      }
      return resolveIdentifier(ident);
    }
    throw new Error(`Unexpected character near "${src.slice(pos, pos + 18)}"`);
  };
  const parseMultiplicative = () => {
    let left = parsePrimary();
    while (true) {
      skipWhitespace();
      const op = src[pos];
      if (op !== "*" && op !== "/" && op !== "%")
        return left;
      pos++;
      const right = parsePrimary();
      if ((op === "/" || op === "%") && right === 0)
        return NaN;
      left = op === "*" ? left * right : op === "/" ? left / right : left % right;
    }
  };
  const parseAdditive = () => {
    let left = parseMultiplicative();
    while (true) {
      skipWhitespace();
      const op = src[pos];
      if (op !== "+" && op !== "-")
        return left;
      pos++;
      const right = parseMultiplicative();
      left = op === "+" ? left + right : left - right;
    }
  };
  const parseComparison = () => {
    let left = parseAdditive();
    while (true) {
      skipWhitespace();
      const two = src.slice(pos, pos + 2);
      const one = src[pos];
      let op = "";
      if (two === "<=" || two === ">=" || two === "==" || two === "!=")
        op = two;
      else if (one === "<" || one === ">")
        op = one;
      if (!op)
        return left;
      pos += op.length;
      const right = parseAdditive();
      if (op === "<=")
        left = left <= right ? 1 : 0;
      else if (op === ">=")
        left = left >= right ? 1 : 0;
      else if (op === "==")
        left = left === right ? 1 : 0;
      else if (op === "!=")
        left = left !== right ? 1 : 0;
      else if (op === "<")
        left = left < right ? 1 : 0;
      else
        left = left > right ? 1 : 0;
    }
  };
  const parseAnd = () => {
    let left = parseComparison();
    while (true) {
      skipWhitespace();
      if (src.slice(pos, pos + 2) !== "&&")
        return left;
      pos += 2;
      const right = parseComparison();
      left = left !== 0 && !Number.isNaN(left) && right !== 0 && !Number.isNaN(right) ? 1 : 0;
    }
  };
  const parseOr = () => {
    let left = parseAnd();
    while (true) {
      skipWhitespace();
      if (src.slice(pos, pos + 2) !== "||")
        return left;
      pos += 2;
      const right = parseAnd();
      left = left !== 0 && !Number.isNaN(left) || right !== 0 && !Number.isNaN(right) ? 1 : 0;
    }
  };
  const parseTernary = () => {
    const cond = parseOr();
    skipWhitespace();
    if (src[pos] !== "?")
      return cond;
    pos++;
    const trueVal = parseTernary();
    skipWhitespace();
    if (src[pos] !== ":")
      throw new Error('Expected ":" in ternary expression');
    pos++;
    const falseVal = parseTernary();
    return cond !== 0 && !Number.isNaN(cond) ? trueVal : falseVal;
  };
  try {
    const out = parseTernary();
    skipWhitespace();
    if (pos !== src.length) {
      if (diagnostics)
        diagnostics.error = `Unexpected character near "${src.slice(pos, pos + 18)}"`;
      return;
    }
    if (!Number.isFinite(out))
      return;
    return Number(out.toFixed(2));
  } catch (err) {
    if (diagnostics) {
      diagnostics.error = err instanceof Error ? err.message : String(err);
    }
    return;
  }
}
function isMacroTruthy(raw) {
  const s = raw.trim().toLowerCase();
  return !["", "0", "false", "null", "undefined", "no", "off"].includes(s);
}
function splitMacroArgs(rawBody) {
  const args = [];
  let depth = 0;
  let cur = "";
  for (let i = 0;i < rawBody.length; i++) {
    if (rawBody[i] === "{" && rawBody[i + 1] === "{") {
      depth++;
      cur += "{{";
      i++;
      continue;
    }
    if (rawBody[i] === "}" && rawBody[i + 1] === "}" && depth > 0) {
      depth--;
      cur += "}}";
      i++;
      continue;
    }
    if (depth === 0 && rawBody[i] === ":" && rawBody[i + 1] === ":") {
      args.push(cur);
      cur = "";
      i++;
      continue;
    }
    cur += rawBody[i];
  }
  args.push(cur);
  return args;
}
function findMatchingTagEnd(src, startIdx) {
  let depth = 0;
  for (let i = startIdx;i < src.length - 1; i++) {
    if (src[i] === "{" && src[i + 1] === "{") {
      depth++;
      i++;
    } else if (src[i] === "}" && src[i + 1] === "}") {
      depth--;
      if (depth === 0)
        return i + 2;
      i++;
    }
  }
  return -1;
}
function findScopedClose(src, bodyStart, tagName) {
  const openRe = new RegExp(`^\\{\\{\\s*#?${tagName}(?:\\s|::|\\}\\})`, "i");
  const closeRe = new RegExp(`^\\{\\{\\s*\\/${tagName}\\s*\\}\\}`, "i");
  let depth = 1;
  for (let i = bodyStart;i < src.length; i++) {
    if (src[i] === "{" && src[i + 1] === "{") {
      const slice = src.slice(i);
      if (closeRe.test(slice)) {
        depth--;
        if (depth === 0) {
          const endIdx = src.indexOf("}}", i);
          return { bodyEnd: i, closeEnd: endIdx + 2 };
        }
      } else if (openRe.test(slice)) {
        depth++;
      }
    }
  }
  return null;
}
function splitTopLevelIfBranches(body) {
  const branches = [];
  let elseContent = "";
  let depth = 0;
  let curStart = 0;
  let pendingCond = null;
  let inElse = false;
  for (let i = 0;i < body.length; i++) {
    if (body[i] !== "{" || body[i + 1] !== "{")
      continue;
    const tagEnd = findMatchingTagEnd(body, i);
    if (tagEnd < 0)
      continue;
    const inner = body.slice(i + 2, tagEnd - 2).trim();
    if (/^#?(?:if|unless)\b/i.test(inner)) {
      depth++;
    } else if (/^\/(?:if|unless)\b/i.test(inner)) {
      depth = Math.max(0, depth - 1);
    } else if (depth === 0 && /^(?:elseif|elif)\b/i.test(inner)) {
      const chunk = body.slice(curStart, i);
      if (pendingCond === null)
        branches.push({ cond: "__first__", content: chunk });
      else
        branches.push({ cond: pendingCond, content: chunk });
      const rest = inner.replace(/^(?:elseif|elif)(?:::|\s+)/i, "").trim();
      pendingCond = rest;
      curStart = tagEnd;
    } else if (depth === 0 && /^else$/i.test(inner)) {
      const chunk = body.slice(curStart, i);
      if (pendingCond === null)
        branches.push({ cond: "__first__", content: chunk });
      else
        branches.push({ cond: pendingCond, content: chunk });
      pendingCond = null;
      inElse = true;
      curStart = tagEnd;
    }
    i = tagEnd - 1;
  }
  const tail = body.slice(curStart);
  if (inElse)
    elseContent = tail;
  else if (pendingCond === null)
    branches.push({ cond: "__first__", content: tail });
  else
    branches.push({ cond: pendingCond, content: tail });
  return { branches, elseContent };
}
function evaluateMacroTemplate(template, ctx, initialStrLocals = {}, initialNumLocals = {}) {
  const numLocals = { ...initialNumLocals };
  const strLocals = { ...initialStrLocals };
  const diagnostics = {
    missingRefs: new Set
  };
  let workSteps = 0;
  const readLocalStr = (key) => {
    if (Object.prototype.hasOwnProperty.call(strLocals, key))
      return strLocals[key];
    const low = key.toLowerCase();
    for (const [k, v] of Object.entries(strLocals)) {
      if (k.toLowerCase() === low)
        return v;
    }
    if (Object.prototype.hasOwnProperty.call(numLocals, key))
      return String(numLocals[key]);
    for (const [k, v] of Object.entries(numLocals)) {
      if (k.toLowerCase() === low)
        return String(v);
    }
    const strRef = ctx.resolveStringRef(key);
    if (strRef !== undefined)
      return strRef;
    const numRef = ctx.resolveRef(key);
    if (numRef !== undefined)
      return String(numRef);
    return;
  };
  const evalConditionStr = (rawCond) => {
    const trimmed = rawCond.trim();
    if (!trimmed)
      return false;
    const negated = trimmed.startsWith("!");
    const body = negated ? trimmed.slice(1).trim() : trimmed;
    const resolved = evalPass(body).trim();
    const cmpMatch = resolved.match(/^(.+?)\s*(==|!=|>=|<=|>|<)\s*(.+)$/);
    let result = false;
    if (cmpMatch) {
      const l = cmpMatch[1].trim();
      const op = cmpMatch[2];
      const r = cmpMatch[3].trim();
      const ln = Number(l);
      const rn = Number(r);
      if (l !== "" && r !== "" && Number.isFinite(ln) && Number.isFinite(rn)) {
        result = op === "==" ? ln === rn : op === "!=" ? ln !== rn : op === ">" ? ln > rn : op === "<" ? ln < rn : op === ">=" ? ln >= rn : ln <= rn;
      } else {
        result = op === "==" ? l === r : op === "!=" ? l !== r : op === ">" ? l > r : op === "<" ? l < r : op === ">=" ? l >= r : l <= r;
      }
    } else {
      result = isMacroTruthy(resolved);
    }
    return negated ? !result : result;
  };
  const evalPass = (input) => {
    if (++workSteps > 1200) {
      diagnostics.error = "Macro work budget exceeded (possible infinite recursion)";
      return input;
    }
    let out = "";
    let i = 0;
    while (i < input.length) {
      if (input[i] !== "{" || input[i + 1] !== "{") {
        out += input[i++];
        continue;
      }
      const tagEnd = findMatchingTagEnd(input, i);
      if (tagEnd < 0) {
        out += input.slice(i);
        break;
      }
      const rawInner = input.slice(i + 2, tagEnd - 2).trim();
      if (rawInner.startsWith("//") || /^comment::|^note::/i.test(rawInner)) {
        i = tagEnd;
        continue;
      }
      if (/^#escape$/i.test(rawInner)) {
        const closed = findScopedClose(input, tagEnd, "escape");
        if (closed) {
          out += input.slice(tagEnd, closed.bodyEnd);
          i = closed.closeEnd;
          continue;
        }
      }
      const ifMatch = rawInner.match(/^#?(if|unless)(?:::|\s+)([\s\S]+)$/i);
      if (ifMatch) {
        const tagKind = ifMatch[1].toLowerCase();
        const firstCond = ifMatch[2].trim();
        const closed = findScopedClose(input, tagEnd, tagKind);
        if (closed) {
          const body = input.slice(tagEnd, closed.bodyEnd);
          const { branches, elseContent } = splitTopLevelIfBranches(body);
          let chosen = elseContent;
          for (const br of branches) {
            const c = br.cond === "__first__" ? firstCond : br.cond;
            const passed = evalConditionStr(c);
            if (tagKind === "unless" ? !passed : passed) {
              chosen = br.content;
              break;
            }
          }
          out += evalPass(chosen);
          i = closed.closeEnd;
          continue;
        }
      }
      if (/^let(?:::|\s+)/i.test(rawInner)) {
        const closed = findScopedClose(input, tagEnd, "let");
        if (closed) {
          const parts = splitMacroArgs(rawInner.replace(/^let(?:::|\s+)/i, ""));
          const prevStr = new Map;
          const prevNum = new Map;
          for (let p = 0;p + 1 < parts.length; p += 2) {
            const k = evalPass(parts[p]).trim();
            const v = evalPass(parts[p + 1]);
            if (!k)
              continue;
            prevStr.set(k, Object.prototype.hasOwnProperty.call(strLocals, k) ? strLocals[k] : undefined);
            prevNum.set(k, Object.prototype.hasOwnProperty.call(numLocals, k) ? numLocals[k] : undefined);
            strLocals[k] = v;
            const nv = Number(v);
            if (v.trim() !== "" && Number.isFinite(nv))
              numLocals[k] = nv;
          }
          out += evalPass(input.slice(tagEnd, closed.bodyEnd));
          for (const [k, oldV] of prevStr.entries()) {
            if (oldV === undefined)
              delete strLocals[k];
            else
              strLocals[k] = oldV;
          }
          for (const [k, oldN] of prevNum.entries()) {
            if (oldN === undefined)
              delete numLocals[k];
            else
              numLocals[k] = oldN;
          }
          i = closed.closeEnd;
          continue;
        }
      }
      if (/^#?trim$/i.test(rawInner)) {
        const closed = findScopedClose(input, tagEnd, "trim");
        if (closed) {
          out += evalPass(input.slice(tagEnd, closed.bodyEnd)).trim();
          i = closed.closeEnd;
          continue;
        }
      }
      if (/^switch::/i.test(rawInner)) {
        const parts = splitMacroArgs(rawInner);
        if (parts.length <= 2) {
          const closed = findScopedClose(input, tagEnd, "switch");
          if (closed) {
            const targetVal = evalPass(parts[1] ?? "").trim();
            const swBody = input.slice(tagEnd, closed.bodyEnd);
            let matchedText = "";
            let defaultText = "";
            const caseRe = /\{\{\s*case::([\s\S]*?)\}\}([\s\S]*?)\{\{\s*\/case\s*\}\}/gi;
            let cm;
            while ((cm = caseRe.exec(swBody)) !== null) {
              const caseOpts = splitMacroArgs(cm[1]).map((o) => evalPass(o).trim());
              if (caseOpts.includes(targetVal)) {
                matchedText = cm[2];
                break;
              }
            }
            if (!matchedText) {
              const defMatch = swBody.match(/\{\{\s*default\s*\}\}([\s\S]*?)\{\{\s*\/default\s*\}\}/i);
              if (defMatch)
                defaultText = defMatch[1];
            }
            out += evalPass(matchedText || defaultText);
            i = closed.closeEnd;
            continue;
          }
        }
      }
      const assignShort = rawInner.match(/^\.([A-Za-z_][A-Za-z0-9_]*)\s*(=|\+=|-=)\s*([\s\S]+)$/);
      if (assignShort) {
        const vName = assignShort[1];
        const op = assignShort[2];
        const rhs = evalPass(assignShort[3]).trim();
        const rhsNum = Number(rhs);
        if (op === "=") {
          strLocals[vName] = rhs;
          if (rhs !== "" && Number.isFinite(rhsNum))
            numLocals[vName] = rhsNum;
        } else {
          const cur = numLocals[vName] ?? Number(readLocalStr(vName) ?? 0) ?? 0;
          const next = op === "+=" ? cur + (Number.isFinite(rhsNum) ? rhsNum : 0) : cur - (Number.isFinite(rhsNum) ? rhsNum : 0);
          numLocals[vName] = next;
          strLocals[vName] = String(next);
        }
        i = tagEnd;
        continue;
      }
      const incShort = rawInner.match(/^\.([A-Za-z_][A-Za-z0-9_]*)(\+\+|--)$/);
      if (incShort) {
        const vName = incShort[1];
        const cur = numLocals[vName] ?? Number(readLocalStr(vName) ?? 0) ?? 0;
        const next = incShort[2] === "++" ? cur + 1 : cur - 1;
        numLocals[vName] = next;
        strLocals[vName] = String(next);
        out += String(next);
        i = tagEnd;
        continue;
      }
      if (/^[.@$][A-Za-z_][A-Za-z0-9_]*$/.test(rawInner)) {
        const key = rawInner.slice(1);
        const val = readLocalStr(key);
        if (val === undefined) {
          diagnostics.missingRefs.add(key);
        } else {
          out += val;
        }
        i = tagEnd;
        continue;
      }
      const parts = rawInner.includes("::") ? splitMacroArgs(rawInner) : rawInner.split(/\s+/);
      const name = (parts[0] ?? "").trim().toLowerCase();
      const args = parts.slice(1).map((a) => evalPass(a));
      if (name === "space")
        out += " ";
      else if (name === "newline" || name === "nl" || name === "n")
        out += `
`;
      else if (name === "noop")
        out += "";
      else if (name === "getvar" || name === "getchatvar") {
        const key = (args[0] ?? "").trim();
        const val = readLocalStr(key);
        if (val === undefined)
          diagnostics.missingRefs.add(key);
        else
          out += val;
      } else if (name === "setvar") {
        const key = (args[0] ?? "").trim();
        const val = args[1] ?? "";
        if (key) {
          strLocals[key] = val;
          const nv = Number(val);
          if (val.trim() !== "" && Number.isFinite(nv))
            numLocals[key] = nv;
        }
      } else if (name === "hasvar" || name === "haschatvar" || name === "varexists") {
        const key = (args[0] ?? "").trim();
        out += readLocalStr(key) !== undefined ? "true" : "false";
      } else if (name === "calc" || name === "math" || name === "evaluate") {
        const expr = args.join("::");
        const val = evaluateSingleExpression(expr, numLocals, ctx, diagnostics);
        if (val !== undefined)
          out += String(val);
      } else if (name === "round") {
        const n = Number(args[0]);
        const d = args[1] !== undefined ? Math.max(0, Math.min(6, Math.round(Number(args[1]) || 0))) : 0;
        if (Number.isFinite(n))
          out += String(Math.round(n * 10 ** d) / 10 ** d);
      } else if (name === "floor") {
        const n = Number(args[0]);
        if (Number.isFinite(n))
          out += String(Math.floor(n));
      } else if (name === "ceil") {
        const n = Number(args[0]);
        if (Number.isFinite(n))
          out += String(Math.ceil(n));
      } else if (name === "abs") {
        const n = Number(args[0]);
        if (Number.isFinite(n))
          out += String(Math.abs(n));
      } else if (name === "min") {
        const nums = args.map(Number).filter(Number.isFinite);
        if (nums.length)
          out += String(Math.min(...nums));
      } else if (name === "max") {
        const nums = args.map(Number).filter(Number.isFinite);
        if (nums.length)
          out += String(Math.max(...nums));
      } else if (name === "clamp") {
        const [v, lo, hi] = args.map(Number);
        if (Number.isFinite(v) && Number.isFinite(lo) && Number.isFinite(hi)) {
          out += String(Math.max(lo, Math.min(hi, v)));
        }
      } else if (name === "mod") {
        const a = Number(args[0]);
        const b = Number(args[1]);
        if (Number.isFinite(a) && Number.isFinite(b) && b !== 0)
          out += String(a % b);
      } else if (name === "and") {
        out += args.length && args.every(isMacroTruthy) ? "true" : "";
      } else if (name === "or") {
        out += args.some(isMacroTruthy) ? "true" : "";
      } else if (name === "not") {
        out += !isMacroTruthy(args[0] ?? "") ? "true" : "";
      } else if (["eq", "ne", "gt", "lt", "gte", "lte"].includes(name)) {
        const a = args[0]?.trim() ?? "";
        const b = args[1]?.trim() ?? "";
        const an = Number(a);
        const bn = Number(b);
        const isNum = a !== "" && b !== "" && Number.isFinite(an) && Number.isFinite(bn);
        let ok = false;
        if (name === "eq")
          ok = isNum ? an === bn : a === b;
        else if (name === "ne")
          ok = isNum ? an !== bn : a !== b;
        else if (name === "gt")
          ok = isNum ? an > bn : a > b;
        else if (name === "lt")
          ok = isNum ? an < bn : a < b;
        else if (name === "gte")
          ok = isNum ? an >= bn : a >= b;
        else if (name === "lte")
          ok = isNum ? an <= bn : a <= b;
        out += ok ? "true" : "";
      } else if (name === "empty" || name === "isempty") {
        out += (args[0] ?? "") === "" ? "true" : "";
      } else if (name === "blank" || name === "isblank") {
        out += (args[0] ?? "").trim() === "" ? "true" : "";
      } else if (name === "default" || name === "fallback" || name === "coalesce") {
        out += args.find(isMacroTruthy) ?? "";
      } else if (name === "matches") {
        const [txt = "", pat = "", flags = ""] = args;
        if (pat) {
          try {
            out += new RegExp(pat, flags).test(txt) ? "true" : "";
          } catch {
            out += txt.toLowerCase().includes(pat.toLowerCase()) ? "true" : "";
          }
        }
      } else if (name === "includes" || name === "contains" || name === "inlist") {
        const list = (args[0] ?? "").split(",").map((x) => x.trim()).filter(Boolean);
        out += list.includes((args[1] ?? "").trim()) ? "true" : "";
      } else if (name === "upper" || name === "uppercase" || name === "toupper") {
        out += (args[0] ?? "").toUpperCase();
      } else if (name === "lower" || name === "lowercase" || name === "tolower") {
        out += (args[0] ?? "").toLowerCase();
      } else if (name === "len" || name === "length") {
        out += String((args[0] ?? "").length);
      } else if (name === "replace") {
        out += (args[2] ?? "").split(args[0] ?? "").join(args[1] ?? "");
      } else if (name === "split") {
        const items = (args[0] ?? "").split(args[1] ?? ",");
        const idx = Number(args[2] ?? 0);
        const norm = idx < 0 ? items.length + idx : idx;
        out += (items[norm] ?? "").trim();
      } else if (name === "wrap") {
        const content = args[2] ?? "";
        out += content ? `${args[0] ?? ""}${content}${args[1] ?? ""}` : "";
      } else if (name === "switch") {
        const targetVal = (args[0] ?? "").trim();
        let matched = "";
        for (let k = 1;k + 1 < args.length; k += 2) {
          if (args[k].trim() === targetVal) {
            matched = args[k + 1];
            break;
          }
        }
        if (!matched && args.length % 2 === 0) {
          matched = args[args.length - 1];
        }
        out += matched;
      } else {
        out += input.slice(i, tagEnd);
      }
      i = tagEnd;
    }
    return out;
  };
  const rendered = evalPass(template).split(`
`).map((l) => l.trimEnd()).filter((l) => l.trim() !== "").join(`
`).trim();
  const maybeNum = Number(rendered);
  if (rendered !== "" && Number.isFinite(maybeNum)) {
    numLocals.value = maybeNum;
    numLocals.result = maybeNum;
  }
  return {
    text: rendered,
    locals: numLocals,
    strLocals,
    missingRefs: [...diagnostics.missingRefs],
    error: diagnostics.error
  };
}
function evaluateFormulaProgram(program, ctx, initialStrLocals = {}, initialNumLocals = {}) {
  const trimmed = program.trim();
  if (!trimmed) {
    return { value: undefined, locals: {}, missingRefs: [], error: "Formula is empty" };
  }
  if (trimmed.includes("{{") && trimmed.includes("}}")) {
    const macroRes = evaluateMacroTemplate(trimmed, ctx, initialStrLocals, initialNumLocals);
    const numVal = macroRes.text !== "" && Number.isFinite(Number(macroRes.text)) ? Number(macroRes.text) : macroRes.locals.value;
    return {
      value: numVal,
      textOutput: macroRes.text || undefined,
      locals: macroRes.locals,
      missingRefs: macroRes.missingRefs,
      error: macroRes.error
    };
  }
  if (looksLikeEnglishProse(trimmed)) {
    return {
      value: undefined,
      locals: {},
      missingRefs: [],
      isProse: true,
      error: 'Plain-English rule detected \u2014 click "Convert to Local Formula" to translate it into math/macro syntax.'
    };
  }
  const locals = { ...initialNumLocals };
  const diagnostics = {
    missingRefs: new Set
  };
  const lines = trimmed.split(/\r?\n|;/).map((s) => s.trim()).filter((s) => Boolean(s) && !s.startsWith("//") && !s.startsWith("#"));
  if (!lines.length) {
    return { value: undefined, locals, missingRefs: [], error: "Formula is empty" };
  }
  let lastValue;
  for (const line of lines) {
    const assignMatch = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([\s\S]+)$/);
    if (assignMatch && !assignMatch[2].startsWith("=")) {
      const varName = assignMatch[1];
      const expr = assignMatch[2];
      const val = evaluateSingleExpression(expr, locals, ctx, diagnostics);
      if (val === undefined) {
        return {
          value: undefined,
          locals,
          missingRefs: [...diagnostics.missingRefs],
          error: diagnostics.error
        };
      }
      locals[varName] = val;
      lastValue = val;
    } else {
      const val = evaluateSingleExpression(line, locals, ctx, diagnostics);
      if (val === undefined) {
        return {
          value: undefined,
          locals,
          missingRefs: [...diagnostics.missingRefs],
          error: diagnostics.error
        };
      }
      lastValue = val;
    }
  }
  if (lastValue !== undefined) {
    locals.value = lastValue;
    locals.result = lastValue;
  }
  return {
    value: lastValue,
    locals,
    missingRefs: [...diagnostics.missingRefs],
    error: diagnostics.error
  };
}
function buildContextResolver(state, schemas, actor) {
  const sumModifierDelta = (statId, actorId) => {
    if (!state.modifiers?.length)
      return 0;
    let total = 0;
    for (const mod of state.modifiers) {
      if (mod.statId !== statId)
        continue;
      if (actorId ? mod.targetActorId === actorId : !mod.targetActorId) {
        total += Number.isFinite(mod.delta) ? mod.delta : 0;
      }
    }
    return total;
  };
  const strVars = {
    location: state.scene.location || "",
    time: state.scene.timeLabel || "",
    date: state.scene.dateLabel || "",
    weather: state.scene.weather || "",
    turn: String(state.turnCount),
    player_name: state.player.name || "User",
    player_attire: state.player.attire || "",
    player_condition: state.player.condition || ""
  };
  const numVars = {
    turn: state.turnCount,
    elapsed_minutes: state.elapsedMinutes
  };
  const isCompactTokenSource = (s, rawVal) => {
    if (typeof rawVal === "number")
      return true;
    if (typeof rawVal !== "string")
      return false;
    if (s.displayStyle === "feed_cards" || s.displayStyle === "quote_callout")
      return false;
    const trimmed = rawVal.trim();
    if (!trimmed || trimmed === "None")
      return false;
    if (trimmed.includes(`
`) || trimmed.length > 110)
      return false;
    return true;
  };
  if (actor) {
    strVars.name = actor.name;
    strVars.conditions = actor.conditions.join(", ");
    strVars.demeanor = actor.demeanor || "";
    strVars.attire = actor.attire || "";
    for (const [fk, fv] of Object.entries(actor.fields)) {
      if (fv)
        strVars[fk] = fv;
    }
    for (const s of schemas) {
      if (!s.enabled || s.scope !== "character")
        continue;
      const m = actor.meters[s.id];
      const srcVal = m?.calibrated ? m.value : s.defaultValue;
      strVars[s.id] = String(srcVal ?? "");
      if (!isCompactTokenSource(s, srcVal))
        continue;
      for (const [tk, tv] of Object.entries(parseStatTokens(srcVal))) {
        const key = tk === "value" ? s.id : tk;
        if (numVars[key] === undefined) {
          numVars[key] = tv;
          strVars[key] = String(tv);
        }
      }
    }
  } else {
    strVars.name = state.player.name || "User";
    strVars.conditions = state.player.condition || "";
    strVars.attire = state.player.attire || "";
    for (const s of schemas) {
      if (!s.enabled || s.scope === "character")
        continue;
      const r = state.stats[s.id];
      const srcVal = r?.calibrated ? r.value : s.defaultValue;
      strVars[s.id] = String(srcVal ?? "");
      if (!isCompactTokenSource(s, srcVal))
        continue;
      for (const [tk, tv] of Object.entries(parseStatTokens(srcVal))) {
        const key = tk === "value" ? s.id : tk;
        if (numVars[key] === undefined) {
          numVars[key] = tv;
          strVars[key] = String(tv);
        }
      }
    }
  }
  const resolveFromRuntimeValue = (rawVal, subKey, statId, actorId) => {
    if (subKey) {
      const tokens = parseStatTokens(rawVal);
      if (tokens[subKey] !== undefined)
        return tokens[subKey];
      return tokens[subKey.toLowerCase()];
    }
    if (typeof rawVal === "number" && Number.isFinite(rawVal)) {
      return rawVal + sumModifierDelta(statId, actorId);
    }
    if (typeof rawVal === "string") {
      const num = Number(rawVal);
      if (Number.isFinite(num))
        return num + sumModifierDelta(statId, actorId);
    }
    return;
  };
  const firstPresentActor = Object.values(state.characters).find((c) => c.present);
  const resolveStringRef = (rawRef) => {
    const clean = rawRef.trim();
    if (!clean)
      return;
    if (Object.prototype.hasOwnProperty.call(strVars, clean))
      return strVars[clean];
    const low = clean.toLowerCase();
    for (const [k, v] of Object.entries(strVars)) {
      if (k.toLowerCase() === low)
        return v;
    }
    if (actor && actor.meters[clean] !== undefined)
      return String(actor.meters[clean].value);
    if (state.stats[clean] !== undefined)
      return String(state.stats[clean].value);
    return;
  };
  const resolveRef = (rawRef) => {
    const clean = rawRef.trim();
    if (!clean)
      return;
    if (clean.startsWith("character:")) {
      const parts = clean.slice(10).split(".");
      const actorPart = parts[0];
      const rest = parts[1];
      const third = parts[2];
      if (!actorPart || !rest)
        return;
      const target = state.characters[actorPart];
      return target ? resolveFromRuntimeValue(target.meters[rest]?.value, third, rest, target.id) : undefined;
    }
    if (clean.startsWith("first_present.")) {
      const parts = clean.slice("first_present.".length).split(".");
      const meterId = parts[0];
      if (!meterId || !firstPresentActor)
        return;
      return resolveFromRuntimeValue(firstPresentActor.meters[meterId]?.value, parts[1], meterId, firstPresentActor.id);
    }
    if (clean.startsWith("self.")) {
      const parts = clean.slice(5).split(".");
      const key = parts[0];
      const subKey = parts[1];
      if (actor) {
        const val = resolveFromRuntimeValue(actor.meters[key]?.value, subKey, key, actor.id);
        if (val !== undefined)
          return val;
      }
      return resolveFromRuntimeValue(state.stats[key]?.value, subKey, key);
    }
    if (clean.includes(".")) {
      const [statId, subKey] = clean.split(".", 2);
      if (statId && subKey) {
        if (actor && actor.meters[statId]) {
          const val = resolveFromRuntimeValue(actor.meters[statId]?.value, subKey, statId, actor.id);
          if (val !== undefined)
            return val;
        }
        if (state.stats[statId]) {
          const val = resolveFromRuntimeValue(state.stats[statId]?.value, subKey, statId);
          if (val !== undefined)
            return val;
        }
      }
    }
    if (actor && actor.meters[clean]) {
      const val = resolveFromRuntimeValue(actor.meters[clean]?.value, undefined, clean, actor.id);
      if (val !== undefined)
        return val;
    }
    if (state.stats[clean]) {
      const val = resolveFromRuntimeValue(state.stats[clean]?.value, undefined, clean);
      if (val !== undefined)
        return val;
    }
    if (numVars[clean] !== undefined)
      return numVars[clean];
    const lowClean = clean.toLowerCase();
    for (const [k, v] of Object.entries(numVars)) {
      if (k.toLowerCase() === lowClean)
        return v;
    }
    return;
  };
  const hasCond = (pattern) => {
    const terms = pattern.split(/[|,;]+/).map((t) => t.trim().toLowerCase()).filter(Boolean);
    if (!terms.length)
      return false;
    const haystackParts = [];
    if (actor) {
      haystackParts.push(...actor.conditions, actor.demeanor, actor.attire);
      for (const m of Object.values(actor.meters)) {
        if (typeof m.value === "string")
          haystackParts.push(m.value);
      }
    } else {
      haystackParts.push(state.player.condition, state.player.attire);
      for (const s of Object.values(state.stats)) {
        if (typeof s.value === "string")
          haystackParts.push(s.value);
      }
    }
    const haystack = haystackParts.join(" ").toLowerCase();
    return terms.some((t) => haystack.includes(t));
  };
  return {
    ctx: { resolveRef, resolveStringRef, hasCond },
    strVars,
    numVars
  };
}
function formatFormulaOutput(schema, evalResult) {
  const tpl = schema.formulaOutputTemplate?.trim();
  if (tpl) {
    let anyReplaced = false;
    const formatted = tpl.replace(/\{([A-Za-z0-9_]+)\}/g, (_m, key) => {
      if (evalResult.locals[key] !== undefined) {
        anyReplaced = true;
        return String(evalResult.locals[key]);
      }
      const low = key.toLowerCase();
      for (const [k, v] of Object.entries(evalResult.locals)) {
        if (k.toLowerCase() === low) {
          anyReplaced = true;
          return String(v);
        }
      }
      return "\u2014";
    });
    return anyReplaced ? formatted : undefined;
  }
  if (evalResult.textOutput !== undefined) {
    return evalResult.textOutput;
  }
  if (evalResult.value === undefined)
    return;
  return Math.max(schema.min, Math.min(schema.max, evalResult.value));
}
function splitTopLevelCallArgs(rawArgs) {
  const args = [];
  let depth = 0;
  let quote = null;
  let cur = "";
  for (let i = 0;i < rawArgs.length; i++) {
    const ch = rawArgs[i];
    if (quote) {
      cur += ch;
      if (ch === "\\" && i + 1 < rawArgs.length) {
        cur += rawArgs[++i];
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      cur += ch;
      continue;
    }
    if (ch === "(" || ch === "[")
      depth++;
    else if ((ch === ")" || ch === "]") && depth > 0)
      depth--;
    else if (ch === "," && depth === 0) {
      args.push(cur.trim());
      cur = "";
      continue;
    }
    cur += ch;
  }
  if (cur.trim() || args.length)
    args.push(cur.trim());
  return args;
}
function unquoteStringArg(raw) {
  const t = raw.trim();
  if (t.startsWith('"') && t.endsWith('"') || t.startsWith("'") && t.endsWith("'")) {
    return t.slice(1, -1);
  }
  return t;
}
function executeCategoryLocalRuleForScope(cat, schemas, state, actor) {
  const program = cat.localRuleFormula?.trim() ?? "";
  if (!program)
    return { appliedEffects: [] };
  const sourceKey = `category:${cat.id}:${actor?.id ?? "player"}`;
  state.modifiers = (state.modifiers ?? []).filter((m) => m.source !== sourceKey);
  const env = buildContextResolver(state, schemas, actor);
  const locals = { ...env.numVars };
  const diagnostics = {
    missingRefs: new Set
  };
  const appliedEffects = [];
  const rawLines = program.split(/\r?\n|;/).map((s) => s.trim()).filter((s) => Boolean(s) && !s.startsWith("//") && !s.startsWith("#"));
  const runStatement = (stmt) => {
    const ifAction = stmt.match(/^if\s*\(([\s\S]+?)\)\s+(mod|set|add)\s*\(([\s\S]+)\)$/i);
    if (ifAction) {
      const condVal = evaluateSingleExpression(ifAction[1], locals, env.ctx, diagnostics);
      if (condVal !== undefined && condVal !== 0 && !Number.isNaN(condVal)) {
        runStatement(`${ifAction[2]}(${ifAction[3]})`);
      }
      return;
    }
    const modMatch = stmt.match(/^mod\s*\(([\s\S]+)\)$/i);
    if (modMatch) {
      const args = splitTopLevelCallArgs(modMatch[1]);
      if (args.length < 3) {
        diagnostics.error = "mod() requires (statId, label, deltaExpression)";
        return;
      }
      const statId = unquoteStringArg(args[0]);
      const label = unquoteStringArg(args[1]) || cat.name;
      const deltaVal = evaluateSingleExpression(args.slice(2).join(","), locals, env.ctx, diagnostics);
      if (deltaVal === undefined || deltaVal === 0)
        return;
      const modId = `catmod_${slugifyKey(cat.id)}_${slugifyKey(actor?.id ?? "player")}_${slugifyKey(statId)}_${slugifyKey(label)}`;
      const entry = {
        id: modId,
        label,
        statId,
        ...actor ? { targetActorId: actor.id } : {},
        delta: Math.round(deltaVal),
        source: sourceKey
      };
      state.modifiers.push(entry);
      appliedEffects.push(`${actor ? `${actor.name} \xB7 ` : ""}${statId} ${entry.delta >= 0 ? `+${entry.delta}` : entry.delta} (${label})`);
      return;
    }
    const setMatch = stmt.match(/^(set|add)\s*\(([\s\S]+)\)$/i);
    if (setMatch) {
      const action = setMatch[1].toLowerCase();
      const args = splitTopLevelCallArgs(setMatch[2]);
      if (args.length < 2) {
        diagnostics.error = `${action}() requires (statId, expression)`;
        return;
      }
      const statId = unquoteStringArg(args[0]);
      const val = evaluateSingleExpression(args.slice(1).join(","), locals, env.ctx, diagnostics);
      if (val === undefined)
        return;
      const targetSchema = schemas.find((s) => s.id === statId);
      if (actor && (targetSchema?.scope === "character" || actor.meters[statId])) {
        const cur = actor.meters[statId];
        if (cur?.locked || targetSchema?.locked)
          return;
        const base = typeof cur?.value === "number" ? cur.value : 0;
        const rawNext = action === "add" ? base + val : val;
        const clamped = targetSchema ? Math.max(targetSchema.min, Math.min(targetSchema.max, Math.round(rawNext))) : Math.round(rawNext);
        actor.meters[statId] = {
          value: clamped,
          calibrated: true,
          locked: false,
          lastReason: `Category rule: ${cat.name}`
        };
        appliedEffects.push(`${actor.name} \xB7 ${statId} = ${clamped}`);
      } else if (targetSchema && targetSchema.scope !== "character") {
        const cur = state.stats[statId];
        if (cur?.locked || targetSchema.locked)
          return;
        const base = typeof cur?.value === "number" ? cur.value : 0;
        const rawNext = action === "add" ? base + val : val;
        const clamped = Math.max(targetSchema.min, Math.min(targetSchema.max, Number(rawNext.toFixed(2))));
        state.stats[statId] = {
          id: statId,
          scope: targetSchema.scope,
          value: clamped,
          calibrated: true,
          locked: false,
          lastReason: `Category rule: ${cat.name}`
        };
        appliedEffects.push(`${statId} = ${clamped}`);
      }
      return;
    }
    const assignMatch = stmt.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([\s\S]+)$/);
    if (assignMatch && !assignMatch[2].startsWith("=")) {
      const varName = assignMatch[1];
      const val = evaluateSingleExpression(assignMatch[2], locals, env.ctx, diagnostics);
      if (val !== undefined)
        locals[varName] = val;
    }
  };
  for (const line of rawLines) {
    runStatement(line);
    if (diagnostics.error)
      break;
  }
  return { appliedEffects, error: diagnostics.error };
}
function recomputeDerivedStats(schemas, state, categories = []) {
  const derivedDefs = schemas.filter((s) => s.enabled && s.calculationMode !== "ai" && Boolean(s.formula?.trim()));
  if (!derivedDefs.length)
    return;
  const maxPasses = Math.min(8, derivedDefs.length + 2);
  for (let pass = 0;pass < maxPasses; pass++) {
    let changed = false;
    const nonCharEnv = buildContextResolver(state, schemas);
    for (const def of derivedDefs) {
      if (def.scope === "character" || !def.formula)
        continue;
      const current = state.stats[def.id];
      if (current?.locked || def.locked)
        continue;
      const evalRes = evaluateFormulaProgram(def.formula, nonCharEnv.ctx, nonCharEnv.strVars, nonCharEnv.numVars);
      const formatted = formatFormulaOutput(def, evalRes);
      if (formatted === undefined)
        continue;
      if (!current?.calibrated || current.value !== formatted) {
        changed = true;
      }
      state.stats[def.id] = {
        id: def.id,
        scope: def.scope,
        value: formatted,
        calibrated: true,
        locked: false,
        lastReason: def.calculationMode === "ai_plus_local" ? `AI + Local Math (${slugifyKey(def.id, "formula")})` : `Computed locally (${slugifyKey(def.id, "formula")})`
      };
    }
    const charDerived = derivedDefs.filter((d) => d.scope === "character");
    if (charDerived.length > 0) {
      for (const actor of Object.values(state.characters)) {
        const actorEnv = buildContextResolver(state, schemas, actor);
        for (const def of charDerived) {
          if (!def.formula)
            continue;
          const current = actor.meters[def.id];
          if (current?.locked || def.locked)
            continue;
          const evalRes = evaluateFormulaProgram(def.formula, actorEnv.ctx, actorEnv.strVars, actorEnv.numVars);
          const formatted = formatFormulaOutput(def, evalRes);
          if (formatted === undefined)
            continue;
          if (!current?.calibrated || current.value !== formatted) {
            changed = true;
          }
          actor.meters[def.id] = {
            value: formatted,
            calibrated: true,
            locked: false,
            lastReason: def.calculationMode === "ai_plus_local" ? `AI + Local Math (${slugifyKey(def.id, "formula")})` : `Computed locally (${slugifyKey(def.id, "formula")})`
          };
        }
      }
    }
    if (!changed)
      break;
  }
  const activeFormulaCats = categories.filter((c) => c.enabled && Boolean(c.localRuleFormula?.trim()));
  if (activeFormulaCats.length > 0) {
    for (const cat of activeFormulaCats) {
      const memberStats = schemas.filter((s) => s.enabled && s.categoryId === cat.id);
      const hasCharMembers = memberStats.some((s) => s.scope === "character") || /\bself\.|character:/.test(cat.localRuleFormula ?? "");
      const hasPlayerMembers = memberStats.some((s) => s.scope !== "character") || memberStats.length === 0 || !hasCharMembers;
      if (hasPlayerMembers) {
        executeCategoryLocalRuleForScope(cat, schemas, state);
      }
      if (hasCharMembers) {
        for (const actor of Object.values(state.characters)) {
          executeCategoryLocalRuleForScope(cat, schemas, state, actor);
        }
      }
    }
  }
}
function resolveAnchorLabel(anchors, value) {
  if (!anchors || !anchors.length)
    return "";
  const sorted = [...anchors].sort((a, b) => b.value - a.value);
  for (const anchor of sorted) {
    if (value >= anchor.value)
      return anchor.label;
  }
  return sorted.at(-1)?.label ?? "";
}
function formatStoryClock(elapsedMinutes) {
  const totalMinutes = Math.max(0, Math.round(elapsedMinutes)) + 8 * 60;
  const hours24 = Math.floor(totalMinutes % 1440 / 60);
  const mins = totalMinutes % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${String(hours12).padStart(2, "0")}:${String(mins).padStart(2, "0")} ${period}`;
}
function formatSceneBanner(state) {
  const day = Math.floor(Math.max(0, state.elapsedMinutes) / 1440) + 1;
  const time = state.scene.timeLabel?.trim() || formatStoryClock(state.elapsedMinutes);
  const date = state.scene.dateLabel?.trim() || `Day ${day}`;
  const location = state.scene.location?.trim() || state.title || "Uncharted Scene";
  const weather = state.scene.weather?.trim() || "Clear";
  return {
    time,
    date,
    location,
    weather,
    formatted: `[ \uD83D\uDD70\uFE0F ${time} | \uD83D\uDCC5 ${date} | \uD83D\uDCCD ${location} | \uD83C\uDF26\uFE0F ${weather} ]`
  };
}

// src/shared/map-graph.ts
function resolveMapPathEdges(state) {
  const byId = new Map;
  for (const edge of state.mapPaths ?? []) {
    if (!state.places[edge.fromId] || !state.places[edge.toId] || edge.fromId === edge.toId)
      continue;
    const [a, b] = [edge.fromId, edge.toId].sort();
    const id = `${a}__${b}`;
    byId.set(id, { ...edge, id, fromId: a, toId: b });
  }
  for (const place of Object.values(state.places)) {
    for (const cid of place.connectedIds) {
      if (!state.places[cid] || cid === place.id)
        continue;
      const [a, b] = [place.id, cid].sort();
      const id = `${a}__${b}`;
      if (!byId.has(id)) {
        const peer = state.places[cid];
        const sameZone = (place.zoneId || "zone_local") === (peer.zoneId || "zone_local");
        byId.set(id, {
          id,
          fromId: a,
          toId: b,
          pathType: sameZone ? "door" : "street",
          travelMinutes: Math.max(1, peer.travelMinutes || place.travelMinutes || 5)
        });
      }
    }
  }
  return [...byId.values()];
}
function findShortestTravelRoute(state, destinationId) {
  const startId = state.currentPlaceId || Object.keys(state.places)[0] || "";
  if (!startId || !state.places[destinationId])
    return null;
  if (startId === destinationId)
    return { pathIds: [startId], totalMinutes: 0 };
  const edges = resolveMapPathEdges(state);
  const adj = new Map;
  for (const e of edges) {
    (adj.get(e.fromId) ?? adj.set(e.fromId, []).get(e.fromId)).push({
      to: e.toId,
      mins: Math.max(1, e.travelMinutes || 5),
      locked: Boolean(e.locked)
    });
    (adj.get(e.toId) ?? adj.set(e.toId, []).get(e.toId)).push({
      to: e.fromId,
      mins: Math.max(1, e.travelMinutes || 5),
      locked: Boolean(e.locked)
    });
  }
  const runSearch = (allowLocked) => {
    const dist = new Map([[startId, 0]]);
    const prev = new Map;
    const visited = new Set;
    while (true) {
      let bestId = null;
      let bestCost = Infinity;
      for (const [id, cost] of dist.entries()) {
        if (!visited.has(id) && cost < bestCost) {
          bestId = id;
          bestCost = cost;
        }
      }
      if (!bestId)
        return null;
      if (bestId === destinationId) {
        const pathIds = [bestId];
        while (prev.has(pathIds[0])) {
          pathIds.unshift(prev.get(pathIds[0]));
        }
        return { pathIds, totalMinutes: bestCost };
      }
      visited.add(bestId);
      for (const step of adj.get(bestId) ?? []) {
        if (!allowLocked && step.locked)
          continue;
        const nextCost = bestCost + step.mins;
        if (nextCost < (dist.get(step.to) ?? Infinity)) {
          dist.set(step.to, nextCost);
          prev.set(step.to, bestId);
        }
      }
    }
  };
  return runSearch(false) ?? runSearch(true);
}

// src/shared/prompt-compiler.ts
function resolveCharacterFieldValue(actor, fieldId) {
  const explicit = actor.fields[fieldId];
  if (explicit && explicit.trim())
    return explicit.trim();
  if (fieldId === "role_summary")
    return actor.roleSummary || "";
  if (fieldId === "demeanor")
    return actor.demeanor || "";
  if (fieldId === "inner_thought")
    return actor.innerThought || "";
  if (fieldId === "immediate_goal")
    return actor.immediateGoal || "";
  if (fieldId === "attire_layers")
    return actor.attire || "";
  return "";
}
function buildFlatChatVariablesMap(state, template) {
  const banner = formatSceneBanner(state);
  const vars = {
    lumi_turn: String(state.turnCount),
    lumi_minute: String(state.elapsedMinutes),
    lumi_clock: formatStoryClock(state.elapsedMinutes),
    lumi_header: banner.formatted,
    lumi_location: banner.location,
    lumi_scene_location: banner.location,
    lumi_scene_time: banner.time,
    lumi_scene_date: banner.date,
    lumi_scene_weather: banner.weather,
    lumi_scene_summary: state.scene.beatSummary || "",
    lumi_player_attire: state.player.attire || "",
    lumi_player_condition: state.player.condition || "",
    lumi_player_action: state.player.notableAction || ""
  };
  for (const schema of template.stats.filter((s) => s.enabled && s.scope !== "character")) {
    const rec = state.stats[schema.id];
    const effectiveValue = rec !== undefined ? rec.value : schema.defaultValue;
    vars[`lumi_stat_${schema.id}`] = String(effectiveValue);
  }
  const charSchemas = template.stats.filter((s) => s.enabled && s.scope === "character");
  const enabledFields = template.dossierFields.filter((f) => f.enabled);
  for (const [actorId, actor] of Object.entries(state.characters)) {
    vars[`lumi_char_${actorId}_name`] = actor.name;
    vars[`lumi_char_${actorId}_present`] = actor.present ? "true" : "false";
    vars[`lumi_char_${actorId}_role`] = resolveCharacterFieldValue(actor, "role_summary");
    vars[`lumi_char_${actorId}_bond_to_you`] = actor.bondToPlayer?.label || resolveCharacterFieldValue(actor, "role_summary");
    vars[`lumi_char_${actorId}_your_bond`] = actor.bondFromPlayer?.label || "";
    vars[`lumi_char_${actorId}_demeanor`] = resolveCharacterFieldValue(actor, "demeanor");
    vars[`lumi_char_${actorId}_attire`] = resolveCharacterFieldValue(actor, "attire_layers");
    vars[`lumi_char_${actorId}_goal`] = resolveCharacterFieldValue(actor, "immediate_goal");
    for (const schema of charSchemas) {
      const m = actor.meters[schema.id];
      const effectiveMeterVal = m !== undefined ? m.value : schema.defaultValue;
      vars[`lumi_char_${actorId}_${schema.id}`] = String(effectiveMeterVal);
    }
    for (const field of enabledFields) {
      vars[`lumi_char_${actorId}_field_${field.id}`] = resolveCharacterFieldValue(actor, field.id);
    }
    for (const [toId, bond] of Object.entries(actor.peerBonds ?? {})) {
      vars[`lumi_bond_${actorId}_to_${toId}_label`] = bond.label;
      for (const [mk, mv] of Object.entries(bond.meters)) {
        vars[`lumi_bond_${actorId}_to_${toId}_${mk}`] = String(mv);
      }
    }
  }
  return vars;
}
function buildLeanSidecarStateSnapshot(state, template, recentTranscriptText = "") {
  const recentLower = recentTranscriptText.toLowerCase();
  const calibratedStats = {};
  const uncalibratedStats = [];
  for (const s of template.stats) {
    if (!s.enabled || s.scope === "character")
      continue;
    const rec = state.stats[s.id];
    if (rec?.calibrated) {
      calibratedStats[s.id] = rec.value;
    } else {
      uncalibratedStats.push(s.id);
    }
  }
  const charSchemas = template.stats.filter((s) => s.enabled && s.scope === "character");
  const enabledFields = template.dossierFields.filter((f) => f.enabled);
  const characters = Object.values(state.characters).map((c) => {
    const mentionedRecently = Boolean(recentLower) && (recentLower.includes(c.name.toLowerCase()) || c.aliases.some((a) => a && recentLower.includes(a.toLowerCase())));
    const hasUncalibrated = charSchemas.some((s) => !c.meters[s.id]?.calibrated);
    if (!c.present && !mentionedRecently && !hasUncalibrated) {
      const compactOffscreenMeters = {};
      for (const s of charSchemas) {
        const m = c.meters[s.id];
        if (m?.calibrated) {
          compactOffscreenMeters[s.id] = m.value;
        }
      }
      return {
        id: c.id,
        name: c.name,
        present: false,
        role: c.roleSummary,
        ...Object.keys(compactOffscreenMeters).length ? { meters: compactOffscreenMeters } : {}
      };
    }
    const meters = {};
    const uncalibratedMeters = [];
    for (const s of charSchemas) {
      const m = c.meters[s.id];
      if (m?.calibrated) {
        meters[s.id] = m.value;
      } else {
        uncalibratedMeters.push(s.id);
      }
    }
    const activeFields = {};
    for (const f of enabledFields) {
      const val = resolveCharacterFieldValue(c, f.id);
      if (val)
        activeFields[f.id] = val;
    }
    const peerBonds = Object.values(c.peerBonds ?? {}).map((b) => ({
      target: b.toName,
      label: b.label,
      ...b.attitude ? { attitude: b.attitude } : {},
      ...b.meters
    }));
    return {
      id: c.id,
      name: c.name,
      present: c.present,
      ...c.bondToPlayer ? { bondToPlayer: c.bondToPlayer.label } : {},
      ...c.bondFromPlayer ? { bondFromPlayer: c.bondFromPlayer.label } : {},
      ...Object.keys(activeFields).length ? { fields: activeFields } : {},
      meters,
      ...uncalibratedMeters.length ? { uncalibratedMeters } : {},
      ...peerBonds.length ? { peerBonds } : {}
    };
  });
  return {
    turnCount: state.turnCount,
    elapsedMinutes: state.elapsedMinutes,
    scene: state.scene,
    player: state.player,
    stats: calibratedStats,
    ...uncalibratedStats.length ? { uncalibratedStats } : {},
    characters
  };
}
var DEFAULT_FIELD_IDS = new Set([
  "role_summary",
  "demeanor",
  "inner_thought",
  "immediate_goal",
  "attire_layers",
  "carried_items",
  "bond_dynamic"
]);
function isTextLikeStat(s) {
  if (["text", "tags", "tier", "skill_tree", "xp_level", "attributes", "inventory", "status_fx"].includes(s.kind)) {
    return true;
  }
  if (s.displayStyle && s.displayStyle !== "auto")
    return true;
  return /\[[^\]]*\]|->|\u2192|\b(?:format|write\s+in|write\s+this|saw\/heard|impulse\s*:)\b/i.test(s.triggerCues);
}
function compactContinuityTextValue(statId, rawVal, maxLen) {
  let txt = rawVal.replace(/\s+/g, " ").trim();
  if (!txt)
    return txt;
  if (statId === "plan" || statId.endsWith("_plan")) {
    txt = txt.replace(/\s*\u2192\s*If welcomed\/works:[\s\S]*$/i, "").replace(/\s*\|\s*If declined\/changed:[\s\S]*$/i, "").trim();
  }
  if (txt.length <= maxLen)
    return txt;
  const sliced = txt.slice(0, maxLen);
  const cut = Math.max(sliced.lastIndexOf(" | "), sliced.lastIndexOf(" "), 0);
  return `${(cut > maxLen * 0.5 ? sliced.slice(0, cut) : sliced).trim()}\u2026`;
}
function compileNarratorContinuity(state, template, charBudget = 2400) {
  const core = template.coreTrackers;
  const trackPlayerAttire = core?.trackPlayerAttire !== false;
  const trackPlayerCondition = core?.trackPlayerCondition !== false;
  const catMap = new Map((template.categories ?? []).map((c) => [c.id, c]));
  const isContinuityStatEnabled = (s) => {
    if (!s.enabled || s.injectInContinuity === false)
      return false;
    if (s.categoryId) {
      const cat = catMap.get(s.categoryId);
      if (cat && (!cat.enabled || cat.injectInContinuity === false))
        return false;
    }
    return true;
  };
  const nonCharSchemas = template.stats.filter((s) => s.scope !== "character" && isContinuityStatEnabled(s));
  const hasPlayerCondition = trackPlayerCondition && Boolean(state.player.condition && state.player.condition !== "Normal");
  const hasPlayerAttire = trackPlayerAttire && Boolean(state.player.attire);
  const hasCharacters = Object.keys(state.characters).length > 0;
  const hasPlaces = core?.trackPlaces !== false && Object.keys(state.places).length > 0;
  const hasActiveQuests = core?.trackQuests !== false && Object.values(state.quests).some((q) => q.status === "active");
  const activeContinuityCategoryRules = [...template.categories ?? []].sort((a, b) => a.order - b.order).filter((cat) => {
    if (!cat.enabled || cat.injectInContinuity === false || cat.promptTriggerMode === "manual") {
      return false;
    }
    if (!cat.aiRule?.trim())
      return false;
    return template.stats.some((s) => s.enabled && s.categoryId === cat.id);
  }).map((cat) => {
    const members = template.stats.filter((s) => s.enabled && s.categoryId === cat.id).map((s) => s.id);
    const formattedRule = cat.aiRule.replace(/\n{3,}/g, `

`).trim();
    return `[${cat.name}] (governs: ${members.join(", ")}):
${formattedRule}`;
  });
  const calibratedNonChar = nonCharSchemas.filter((s) => state.stats[s.id]?.calibrated);
  if (!state.initialized && !hasCharacters && !hasPlaces && !hasActiveQuests && !hasPlayerAttire && !hasPlayerCondition && calibratedNonChar.length === 0 && activeContinuityCategoryRules.length === 0) {
    return { text: "", omittedCount: 0 };
  }
  const buildWithTextCap = (textCap, compactMode) => {
    const playerStatParts = [];
    const worldStatParts = [];
    for (const s of calibratedNonChar) {
      const rec = state.stats[s.id];
      if (compactMode && (rec.value === "None" || rec.value === "" || rec.value === 0))
        continue;
      const resolvedLabel = !compactMode && typeof rec.value === "number" && s.anchors.length > 0 ? resolveAnchorLabel(s.anchors, rec.value) : "";
      const tier = resolvedLabel ? ` (${resolvedLabel})` : "";
      const formattedVal = typeof rec.value === "string" ? compactContinuityTextValue(s.id, rec.value, textCap) : String(rec.value);
      const item = `${s.id}=${formattedVal}${s.kind === "clock" || s.kind === "pips" ? `/${s.max}` : ""}${tier}`;
      if (s.scope === "player")
        playerStatParts.push(item);
      else
        worldStatParts.push(item);
    }
    const banner = formatSceneBanner(state);
    const outLines = [`Scene: ${banner.formatted}`];
    const playerParts = [
      hasPlayerAttire ? `attire="${compactContinuityTextValue("attire", state.player.attire, 90)}"` : "",
      hasPlayerCondition ? `state="${compactContinuityTextValue("condition", state.player.condition, 80)}"` : "",
      ...playerStatParts
    ].filter(Boolean);
    if (playerParts.length > 0) {
      outLines.push(`Player: ${playerParts.join(" | ")}`);
    }
    if (worldStatParts.length > 0) {
      outLines.push(`World: ${worldStatParts.join(" | ")}`);
    }
    if (activeContinuityCategoryRules.length > 0) {
      outLines.push(`Category Directives:
${activeContinuityCategoryRules.join(`
`)}`);
    }
    const charSchemas = template.stats.filter((s) => s.scope === "character" && isContinuityStatEnabled(s));
    const enabledFields = template.dossierFields.filter((f) => f.enabled);
    const characters = Object.values(state.characters);
    if (characters.length > 0) {
      const presentFirst = [
        ...characters.filter((c) => c.present),
        ...characters.filter((c) => !c.present)
      ];
      outLines.push(`Cast (${characters.length}):`);
      for (const actor of presentFirst) {
        const peerBonds = template.surfaces.trackNpcBonds !== false ? Object.values(actor.peerBonds ?? {}).map((b) => `\u2192${b.toName}(${b.label})`).join(", ") : "";
        if (!actor.present) {
          const isTransientSceneStat = (id) => id === "acted" || id === "observation";
          const compactMeters = charSchemas.filter((s) => !isTransientSceneStat(s.id)).map((s) => {
            const m = actor.meters[s.id];
            if (!m?.calibrated)
              return "";
            if (compactMode && (m.value === "None" || m.value === ""))
              return "";
            const valStr = typeof m.value === "string" ? compactContinuityTextValue(s.id, m.value, Math.min(textCap, 90)) : String(m.value);
            return `${s.id}=${valStr}`;
          }).filter(Boolean).join(", ");
          const roleTxt = resolveCharacterFieldValue(actor, "role_summary");
          const carriedTxt = resolveCharacterFieldValue(actor, "carried_items");
          const bondLabel = actor.bondToPlayer?.label?.trim() || "";
          const parts = [
            bondLabel ? `toYou="${bondLabel}"` : "",
            roleTxt && roleTxt.toLowerCase() !== bondLabel.toLowerCase() ? `role="${compactContinuityTextValue("role", roleTxt, 50)}"` : "",
            carriedTxt && carriedTxt !== "None" ? `items="${compactContinuityTextValue("carried_items", carriedTxt, 60)}"` : "",
            compactMeters,
            peerBonds ? `peers=[${peerBonds}]` : ""
          ].filter(Boolean);
          outLines.push(`- ${actor.name} (offscreen)${parts.length ? `: ${parts.join(" | ")}` : ""}`);
          continue;
        }
        const meters = charSchemas.map((s) => {
          const m = actor.meters[s.id];
          if (!m?.calibrated)
            return compactMode ? "" : `${s.id}=?`;
          if (compactMode && (m.value === "None" || m.value === ""))
            return "";
          const valStr = typeof m.value === "string" ? compactContinuityTextValue(s.id, m.value, textCap) : String(m.value);
          return `${s.id}=${valStr}`;
        }).filter(Boolean).join(", ");
        const planActive = charSchemas.some((s) => s.id === "plan" && actor.meters[s.id]?.calibrated);
        const bondLabel = actor.bondToPlayer?.label?.trim() || "";
        const fieldSummary = enabledFields.map((f) => {
          const val = resolveCharacterFieldValue(actor, f.id);
          if (!val)
            return "";
          if (f.id === "role_summary" && bondLabel && val.toLowerCase() === bondLabel.toLowerCase()) {
            return "";
          }
          if (compactMode && f.id === "immediate_goal" && planActive) {
            return "";
          }
          return `${f.id}="${compactContinuityTextValue(f.id, val, Math.min(textCap, 110))}"`;
        }).filter(Boolean).join(" | ");
        const bondSummary = [
          bondLabel ? `toYou="${bondLabel}"` : "",
          actor.bondFromPlayer?.label ? `yourBond="${actor.bondFromPlayer.label}"` : ""
        ].filter(Boolean).join(", ");
        const head = `- ${actor.name}${bondSummary ? ` [${bondSummary}]` : ""}${fieldSummary ? `: ${fieldSummary}` : ""}`;
        outLines.push(head);
        if (meters || peerBonds) {
          outLines.push(`  stats: ${[meters, peerBonds ? `peers=[${peerBonds}]` : ""].filter(Boolean).join(" | ")}`);
        }
      }
    }
    if (hasPlaces) {
      const placesList = Object.values(state.places);
      outLines.push(`Places: ${placesList.map((p) => p.name).join(", ")}`);
    }
    if (hasActiveQuests) {
      const activeQuests = Object.values(state.quests).filter((q) => q.status === "active");
      outLines.push(`Quests: ${activeQuests.map((q) => q.title).join("; ")}`);
    }
    return outLines;
  };
  let lines = buildWithTextCap(220, false);
  if (lines.join(`
`).length > charBudget) {
    lines = buildWithTextCap(130, true);
  }
  if (lines.join(`
`).length > charBudget) {
    lines = buildWithTextCap(75, true);
  }
  let out = "";
  let omittedCount = 0;
  for (const line of lines) {
    if (out.length + line.length + 1 <= charBudget) {
      out += (out ? `
` : "") + line;
    } else {
      omittedCount++;
    }
  }
  return { text: out, omittedCount };
}
function isLocallyComputedStat(s) {
  if (s.calculationMode === "local_formula")
    return true;
  if (s.calculationMode === "ai_plus_local" || s.calculationMode === "ai")
    return false;
  return Boolean(s.formula?.trim());
}
function checkKeywordsOrVitalsMatch(keywords, statIdsToCheck, state, recentTranscriptText) {
  for (const sid of statIdsToCheck) {
    if (/vital|hp|mp/i.test(sid)) {
      const checkVal = (raw) => {
        const tok = parseStatTokens(raw);
        return tok.HP !== undefined && tok.HP_max !== undefined && tok.HP < tok.HP_max || tok.MP !== undefined && tok.MP_max !== undefined && tok.MP < tok.MP_max;
      };
      if (checkVal(state.stats[sid]?.value))
        return true;
      for (const c of Object.values(state.characters)) {
        if (c.present && checkVal(c.meters[sid]?.value))
          return true;
      }
    }
  }
  const kws = keywords ?? [];
  if (!kws.length)
    return true;
  if (!recentTranscriptText.trim())
    return !state.initialized;
  const hay = recentTranscriptText.toLowerCase();
  return kws.some((kw) => kw && hay.includes(kw.toLowerCase()));
}
function isCategoryPromptActive(cat, memberStatIds, state, recentTranscriptText) {
  if (!cat.enabled)
    return false;
  if (cat.promptTriggerMode === "manual")
    return false;
  if (cat.promptTriggerMode !== "conditional")
    return true;
  return checkKeywordsOrVitalsMatch(cat.promptKeywords, memberStatIds, state, recentTranscriptText);
}
function isStatPromptActive(s, state, recentTranscriptText, categoryMap, allStats) {
  if (!s.enabled || s.locked || isLocallyComputedStat(s))
    return false;
  if (s.categoryId && categoryMap) {
    const cat = categoryMap.get(s.categoryId);
    if (cat) {
      const memberIds = (allStats ?? []).filter((st) => st.categoryId === cat.id).map((st) => st.id);
      if (!isCategoryPromptActive(cat, memberIds, state, recentTranscriptText)) {
        return false;
      }
    }
  }
  if (s.promptTriggerMode === "manual")
    return false;
  if (s.promptTriggerMode !== "conditional")
    return true;
  return checkKeywordsOrVitalsMatch(s.promptKeywords, [s.id], state, recentTranscriptText);
}
function sampleValueForSchema(s, hasPersistedState) {
  if (s.kind === "boolean")
    return Boolean(s.defaultValue);
  if (isTextLikeStat(s)) {
    const defStr = typeof s.defaultValue === "string" ? s.defaultValue.trim() : "";
    if (s.kind === "skill_tree" && defStr && defStr !== "None" && defStr !== "0") {
      return defStr;
    }
    return "...";
  }
  if (hasPersistedState)
    return "+1";
  return typeof s.defaultValue === "number" ? s.defaultValue : 50;
}
function hasUncalibratedTarget(state, s) {
  if (!state.initialized)
    return true;
  if (s.scope === "character") {
    const presentChars = Object.values(state.characters).filter((c) => c.present);
    if (!presentChars.length)
      return true;
    return presentChars.some((c) => !c.meters[s.id]?.calibrated);
  }
  return !state.stats[s.id]?.calibrated;
}
function buildCompactFormatExample(state, template, hasPersistedState = false, recentTranscriptText = "", options) {
  const isCompact = (options?.verbosity ?? "compact") === "compact";
  const core = template.coreTrackers;
  const categoryMap = new Map((template.categories ?? []).map((c) => [c.id, c]));
  const charSchemas = template.stats.filter((s) => s.scope === "character" && isStatPromptActive(s, state, recentTranscriptText, categoryMap, template.stats));
  const otherSchemas = template.stats.filter((s) => s.scope !== "character" && isStatPromptActive(s, state, recentTranscriptText, categoryMap, template.stats));
  const flatMeters = {};
  for (const s of charSchemas) {
    flatMeters[s.id] = isCompact && hasPersistedState ? isTextLikeStat(s) ? "..." : "+N" : sampleValueForSchema(s, hasPersistedState);
  }
  const flatStats = {};
  for (const s of otherSchemas) {
    flatStats[s.id] = isCompact && hasPersistedState ? isTextLikeStat(s) ? "..." : "+N" : sampleValueForSchema(s, hasPersistedState);
  }
  const charExample = {
    name: "NPC",
    present: true,
    location: "Spot",
    ...isCompact && hasPersistedState ? {} : {
      bondToPlayer: { label: "Ally", category: "friend", note: "Why" },
      bondFromPlayer: { label: "Friend", category: "friend", note: "Why" }
    }
  };
  for (const f of template.dossierFields.filter((df) => df.enabled && !df.locked)) {
    if (f.id === "role_summary") {
      if (!isCompact || !hasPersistedState)
        charExample.role = "Role";
    } else if (f.id === "demeanor")
      charExample.demeanor = "...";
    else if (f.id === "inner_thought")
      charExample.thought = "...";
    else if (f.id === "immediate_goal")
      charExample.goal = "...";
    else if (f.id === "attire_layers")
      charExample.attire = "...";
    else
      charExample[f.id] = "...";
  }
  Object.assign(charExample, flatMeters);
  if (template.surfaces.trackNpcBonds !== false && (!isCompact || !hasPersistedState)) {
    charExample.peerBonds = [
      {
        target: "NPC2",
        label: "Relation",
        category: "family|friend|romance|rival|professional|neutral",
        attitude: "Why"
      }
    ];
  }
  const ov = core?.overrides ?? {};
  const playerExample = {};
  if (core?.trackPlayerAttire !== false && !ov.player_attire?.locked)
    playerExample.attire = "...";
  if (core?.trackPlayerCondition !== false && !ov.player_condition?.locked)
    playerExample.condition = "...";
  if (core?.trackPlayerAction && !ov.player_action?.locked)
    playerExample.notableAction = "...";
  const sceneExample = {};
  if (!core?.scenePillLocked) {
    sceneExample.location = "Spot, Area";
    sceneExample.time = "08:05 AM";
    if (!isCompact || !hasPersistedState) {
      sceneExample.date = "Day 1";
      sceneExample.weather = "Clear";
    }
    sceneExample.mins = 5;
  }
  if (core?.trackSceneSummary !== false && !ov.scene_summary?.locked) {
    sceneExample.summary = "...";
  }
  const exampleObj = {
    ...Object.keys(sceneExample).length ? { scene: sceneExample } : {},
    ...Object.keys(playerExample).length ? { player: playerExample } : {},
    ...Object.keys(flatStats).length ? { stats: flatStats } : {},
    characters: [charExample]
  };
  const hasPlacesAlready = Object.keys(state.places).length > 0;
  const movementMentioned = !hasPlacesAlready || /\b(?:entered|arrived\s+at|walked\s+(?:into|to)|headed\s+to|stepped\s+(?:into|outside)|moved\s+to|travel(?:ed|ing)\s+to|left\s+for|new\s+location)\b/i.test(recentTranscriptText);
  if (core?.trackPlaces !== false && !ov.places?.locked && movementMentioned) {
    exampleObj.zones = [
      { name: "Zone", kind: "building|district|region|ship_deck", icon: "\uD83C\uDFDB\uFE0F" }
    ];
    exampleObj.places = [
      { name: "Spot", zone: "Zone", category: "interior", icon: "\uD83D\uDCCD", tags: ["safe"], description: "..." }
    ];
    exampleObj.paths = [
      { from: "A", to: "B", type: "door|hallway|stairs|street|trail|portal", mins: 2 }
    ];
  }
  if (core?.trackQuests !== false && !ov.quests?.locked && !hasPersistedState) {
    exampleObj.quests = [
      { title: "Arc", status: "active", summary: "..." }
    ];
  }
  return JSON.stringify(exampleObj);
}
function clipAtWordBoundary(text, maxLen) {
  const clean = text.replace(/\r?\n+/g, " ").replace(/\s+/g, " ").trim();
  if (clean.length <= maxLen)
    return clean;
  const sliced = clean.slice(0, maxLen);
  const lastSpace = sliced.lastIndexOf(" ");
  return (lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced) + "\u2026";
}
function compileExtractorPrompt(state, template, recentTranscriptText = "", options) {
  const isCompact = (options?.verbosity ?? "compact") === "compact";
  const core = template.coreTrackers;
  const ov = core?.overrides ?? {};
  const categoryMap = new Map((template.categories ?? []).map((c) => [c.id, c]));
  const activeSchemas = template.stats.filter((s) => isStatPromptActive(s, state, recentTranscriptText, categoryMap, template.stats));
  const activeIdSet = new Set(activeSchemas.map((s) => s.id));
  const categoryRuleLines = [];
  for (const cat of [...template.categories ?? []].sort((a, b) => a.order - b.order)) {
    if (!cat.aiRule?.trim())
      continue;
    const catMemberStats = template.stats.filter((s) => s.enabled && s.categoryId === cat.id);
    if (!catMemberStats.length)
      continue;
    if (!isCategoryPromptActive(cat, catMemberStats.map((s) => s.id), state, recentTranscriptText)) {
      continue;
    }
    const activeMemberLabels = catMemberStats.filter((s) => activeIdSet.has(s.id)).map((s) => s.id);
    if (!activeMemberLabels.length)
      continue;
    if (options?.skipContinuityCategoryRules && cat.injectInContinuity !== false) {
      categoryRuleLines.push(`  \u2022 [${cat.name}] (${activeMemberLabels.join(", ")}): Follow the [${cat.name}] directives in Story Continuity above.`);
    } else {
      const formattedRule = cat.aiRule.replace(/\n{3,}/g, `

`).trim();
      categoryRuleLines.push(`[${cat.name}] (applies to: ${activeMemberLabels.join(", ")}):
${formattedRule}`);
    }
  }
  const charSchemas = activeSchemas.filter((s) => s.scope === "character");
  const otherSchemas = activeSchemas.filter((s) => s.scope !== "character");
  const enabledFields = template.dossierFields.filter((f) => f.enabled && !f.locked);
  const existingChars = Object.values(state.characters);
  const compactNumericTag = (s) => {
    const mode = s.volatility === "momentary" ? "mom" : s.volatility === "anchor" ? "anc" : "prog";
    const needsFullCalibration = !isCompact || hasUncalibratedTarget(state, s);
    let cueText = s.triggerCues;
    if (!needsFullCalibration && cueText) {
      cueText = cueText.replace(/0[\u2013-]100\s*scale\.\s*/gi, "").replace(/Calibrate[^.;]*?\([^)]*\)[^.;]*[.;]\s*/gi, "").trim();
    }
    const cueShort = cueText ? clipAtWordBoundary(cueText, needsFullCalibration ? 240 : 110) : "";
    const labelHint = slugifyKey(s.label, "") !== s.id ? ` "${s.label}"` : "";
    return `${s.id}${labelHint}[${s.min}..${s.max},${mode}${cueShort ? `: ${cueShort}` : ""}]`;
  };
  const charNumeric = charSchemas.filter((s) => !isTextLikeStat(s) && s.kind !== "boolean");
  const otherNumeric = otherSchemas.filter((s) => !isTextLikeStat(s) && s.kind !== "boolean");
  const textAndCustomSchemas = [...charSchemas, ...otherSchemas].filter((s) => isTextLikeStat(s) || s.kind === "boolean");
  const groupedTextRules = [];
  const cueGroupMap = new Map;
  for (const s of textAndCustomSchemas) {
    const cueClean = s.triggerCues ? s.triggerCues.replace(/\r?\n+/g, " \u2014 ").replace(/\s+/g, " ").trim() : "Concise update";
    const scopeTag = s.scope === "character" ? "NPC" : "stat";
    const labelToken = slugifyKey(s.label, "") !== s.id ? `"${s.id}"("${s.label}",${scopeTag})` : `"${s.id}"(${scopeTag})`;
    const normKey = cueClean.toLowerCase();
    const existingGroup = cueGroupMap.get(normKey);
    if (existingGroup && cueClean.length > 20) {
      existingGroup.labels.push(labelToken);
    } else {
      cueGroupMap.set(normKey, { labels: [labelToken], rule: cueClean });
    }
  }
  for (const grp of cueGroupMap.values()) {
    groupedTextRules.push(`  \u2022 ${grp.labels.join(" & ")}: ${grp.rule}`);
  }
  const customDossierFields = enabledFields.filter((f) => !DEFAULT_FIELD_IDS.has(f.id));
  const editedDefaultFields = enabledFields.filter((f) => DEFAULT_FIELD_IDS.has(f.id));
  const trackedTargets = [
    core?.trackPlayerAttire !== false && !ov.player_attire?.locked ? "player.attire" : "",
    core?.trackPlayerCondition !== false && !ov.player_condition?.locked ? "player.condition" : "",
    core?.trackPlayerAction && !ov.player_action?.locked ? "player.notableAction" : "",
    !core?.scenePillLocked ? "scene" : "",
    core?.trackPlaces !== false && !ov.places?.locked ? "places[]" : "",
    core?.trackQuests !== false && !ov.quests?.locked ? "quests[]" : "",
    core?.trackDispatches !== false && !ov.dispatches?.locked ? "dispatches[]" : ""
  ].filter(Boolean);
  const resolveCoreInst = (id, fallback) => (ov[id]?.instruction ?? fallback ?? "").trim();
  let coreSection = "";
  if (isCompact && state.initialized) {
    const compactCoreItems = [];
    if (!core?.scenePillLocked) {
      compactCoreItems.push('scene{location("Spot, Area"),time,date,weather,mins(int)}');
    } else {
      compactCoreItems.push("scene pill LOCKED (omit location/time/date/weather)");
    }
    if (core?.trackSceneSummary !== false && !ov.scene_summary?.locked)
      compactCoreItems.push("scene.summary(1-sent)");
    if (core?.trackPlayerAttire !== false && !ov.player_attire?.locked)
      compactCoreItems.push("player.attire");
    if (core?.trackPlayerCondition !== false && !ov.player_condition?.locked)
      compactCoreItems.push("player.condition");
    if (core?.trackPlayerAction && !ov.player_action?.locked)
      compactCoreItems.push("player.notableAction");
    if (core?.trackPlaces !== false && !ov.places?.locked)
      compactCoreItems.push("zones[]/places[]/paths[] on new places");
    if (core?.trackQuests !== false && !ov.quests?.locked)
      compactCoreItems.push("quests[] on change");
    if (core?.trackDispatches !== false && !ov.dispatches?.locked)
      compactCoreItems.push("dispatches[] if offscreen");
    if (core?.trackNpcConditions !== false && !ov.npc_conditions?.locked)
      compactCoreItems.push("characters[].conditions");
    if (core?.trackNpcSecrets !== false && !ov.npc_secrets?.locked)
      compactCoreItems.push("characters[].secrets");
    coreSection = `Core Keys (update only if changed): ${compactCoreItems.join(" | ")}`;
  } else {
    const scenePillHints = !core?.scenePillLocked ? [
      core?.sceneLocationInstruction ? `  \u2022 "scene.location": ${clipAtWordBoundary(core.sceneLocationInstruction, 200)}` : "",
      core?.sceneTimeInstruction ? `  \u2022 "scene.time": ${clipAtWordBoundary(core.sceneTimeInstruction, 200)}` : "",
      core?.sceneDateInstruction ? `  \u2022 "scene.date": ${clipAtWordBoundary(core.sceneDateInstruction, 200)}` : "",
      core?.sceneWeatherInstruction ? `  \u2022 "scene.weather": ${clipAtWordBoundary(core.sceneWeatherInstruction, 200)}` : "",
      core?.sceneTimeFlowInstruction ? `  \u2022 "scene.mins": ${clipAtWordBoundary(core.sceneTimeFlowInstruction, 200)}` : ""
    ].filter(Boolean) : ["  \u2022 Scene Pill is LOCKED \u2014 omit location/time/date/weather."];
    const corePromptHints = [
      ...scenePillHints,
      core?.trackPlayerAttire !== false && !ov.player_attire?.locked && resolveCoreInst("player_attire", core?.playerAttireInstruction) ? `  \u2022 "player.attire": ${clipAtWordBoundary(resolveCoreInst("player_attire", core?.playerAttireInstruction), 200)}` : "",
      core?.trackPlayerCondition !== false && !ov.player_condition?.locked && resolveCoreInst("player_condition", core?.playerConditionInstruction) ? `  \u2022 "player.condition": ${clipAtWordBoundary(resolveCoreInst("player_condition", core?.playerConditionInstruction), 200)}` : "",
      core?.trackPlayerAction && !ov.player_action?.locked && resolveCoreInst("player_action", core?.playerActionInstruction) ? `  \u2022 "player.notableAction": ${clipAtWordBoundary(resolveCoreInst("player_action", core?.playerActionInstruction), 200)}` : "",
      core?.trackSceneSummary !== false && !ov.scene_summary?.locked && resolveCoreInst("scene_summary", core?.sceneSummaryInstruction) ? `  \u2022 "scene.summary": ${clipAtWordBoundary(resolveCoreInst("scene_summary", core?.sceneSummaryInstruction), 200)}` : "",
      core?.trackPlaces !== false && !ov.places?.locked && resolveCoreInst("places", core?.placesInstruction) ? `  \u2022 "places[]/zones[]": ${clipAtWordBoundary(resolveCoreInst("places", core?.placesInstruction), 200)}` : "",
      core?.trackQuests !== false && !ov.quests?.locked && resolveCoreInst("quests", core?.questsInstruction) ? `  \u2022 "quests[]": ${clipAtWordBoundary(resolveCoreInst("quests", core?.questsInstruction), 200)}` : "",
      core?.trackDispatches !== false && !ov.dispatches?.locked && resolveCoreInst("dispatches", core?.dispatchesInstruction) ? `  \u2022 "dispatches[]": ${clipAtWordBoundary(resolveCoreInst("dispatches", core?.dispatchesInstruction), 200)}` : "",
      core?.trackNpcConditions === false || ov.npc_conditions?.locked ? "  \u2022 Skip character conditions[]." : resolveCoreInst("npc_conditions", core?.npcConditionsInstruction) ? `  \u2022 "characters[].conditions": ${clipAtWordBoundary(resolveCoreInst("npc_conditions", core?.npcConditionsInstruction), 180)}` : "",
      core?.trackNpcSecrets === false || ov.npc_secrets?.locked ? "  \u2022 Skip character secrets[]." : resolveCoreInst("npc_secrets", core?.npcSecretsInstruction) ? `  \u2022 "characters[].secrets": ${clipAtWordBoundary(resolveCoreInst("npc_secrets", core?.npcSecretsInstruction), 180)}` : ""
    ].filter(Boolean);
    coreSection = corePromptHints.length ? `Core & Scene Pill Rules:
${corePromptHints.join(`
`)}` : "";
  }
  let dossierSection = "";
  if (isCompact && state.initialized) {
    const defKeys = editedDefaultFields.map((f) => f.id);
    const customHints = customDossierFields.map((f) => `"${f.id}" (${clipAtWordBoundary(f.instruction, 140)})`);
    const parts = [
      defKeys.length ? `keys: ${defKeys.join(", ")}` : "",
      ...customHints
    ].filter(Boolean);
    if (parts.length) {
      dossierSection = `Dossier Fields (omit unchanged): ${parts.join(" | ")}`;
    }
  } else {
    const dossierHints = [
      ...editedDefaultFields.map((f) => `"${f.id}" (${clipAtWordBoundary(f.instruction, 130)})`),
      ...customDossierFields.map((f) => `"${f.id}" (${clipAtWordBoundary(f.instruction, 160)})`)
    ];
    if (dossierHints.length) {
      dossierSection = `Character Dossier Field Rules:
  \u2022 ${dossierHints.join(" | ")}`;
    }
  }
  return [
    `<lumi_stats_protocol>`,
    `ACTIVE REQUIRED CONTRACT: In EVERY reply, after all prose and preset footers, append one <lumi-stats>{...JSON...}</lumi-stats> block (use hyphenated <lumi-stats>).`,
    `1. CAST: List active/mentioned NPCs in "characters[]" ("present": true if in room, false if offscreen; set "location", "bondToPlayer", "bondFromPlayer" on new/changed bonds). Use "+N"/"-N" deltas for numeric meters; omit unchanged fields.`,
    template.surfaces.trackNpcBonds !== false ? `2. PEER BONDS ("peerBonds[]"): For NPC\u2194NPC relations, set {"target","label","category":"family|friend|romance|rival|professional|neutral","attitude"}.` : "",
    `3. UPDATE (${trackedTargets.join(", ")} \u2014 use ONLY the exact stat/meter keys listed below; omit any removed or unlisted keys):`,
    categoryRuleLines.length ? `Category Rules:
${categoryRuleLines.join(`
`)}` : "",
    charNumeric.length ? `NPC Meters: ${charNumeric.map(compactNumericTag).join(" | ")}` : "",
    otherNumeric.length ? `Player/World Meters: ${otherNumeric.map(compactNumericTag).join(" | ")}` : "",
    groupedTextRules.length ? `Text & Format Stats (follow exact format):
${groupedTextRules.join(`
`)}` : "",
    coreSection,
    dossierSection,
    `Append at end (ASCII spaces only; omit unchanged keys):`,
    `<lumi-stats>`,
    buildCompactFormatExample(state, template, existingChars.length > 0, recentTranscriptText, {
      verbosity: options?.verbosity ?? "compact"
    }),
    `</lumi-stats>`,
    `</lumi_stats_protocol>`
  ].filter(Boolean).join(`
`);
}
function buildChatVariableProjection(state, template) {
  const banner = formatSceneBanner(state);
  const allowedNonChar = template ? new Set(template.stats.filter((s) => s.enabled && s.scope !== "character").map((s) => s.id)) : null;
  const allowedChar = template ? new Set(template.stats.filter((s) => s.enabled && s.scope === "character").map((s) => s.id)) : null;
  const statsFlat = {};
  for (const [k, v] of Object.entries(state.stats)) {
    if (allowedNonChar && !allowedNonChar.has(k))
      continue;
    statsFlat[k] = v.value;
  }
  const actorsFlat = {};
  for (const [id, char] of Object.entries(state.characters)) {
    const metersFlat = {};
    for (const [mk, mv] of Object.entries(char.meters)) {
      if (allowedChar && !allowedChar.has(mk))
        continue;
      metersFlat[mk] = mv.value;
    }
    actorsFlat[id] = {
      name: char.name,
      present: char.present,
      role: char.roleSummary,
      bondToPlayer: char.bondToPlayer,
      bondFromPlayer: char.bondFromPlayer,
      demeanor: char.demeanor,
      attire: char.attire,
      goal: char.immediateGoal,
      meters: metersFlat,
      fields: char.fields,
      peerBonds: char.peerBonds
    };
  }
  return {
    turn: state.turnCount,
    minute: state.elapsedMinutes,
    header: banner.formatted,
    scene: {
      location: banner.location,
      time: banner.time,
      date: banner.date,
      weather: banner.weather,
      summary: state.scene.beatSummary
    },
    player: state.player,
    trackers: statsFlat,
    stats: statsFlat,
    actors: actorsFlat
  };
}

// src/shared/prose-cleaner.ts
var BRAILLE_OR_EXOTIC_SPACE_RE = /[\u2800\u00A0\u1680\u180E\u2000-\u200A\u202F\u205F\u2060\u3000\u200B-\u200D\uFEFF]|^[ \t]{4,}\S/m;
var PROTECTED_BLOCKS_RE = /(<(?:lumi-stats|lumi-tracker|worldweave|json|style|script|pre|code)\b[\s\S]*?<\/(?:lumi-stats|lumi-tracker|worldweave|json|style|script|pre|code)\s*>|```[\s\S]*?```)/gi;
function fnv1a32(input) {
  let hash = 2166136261;
  for (let i = 0;i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}
function hasBrailleOrWhitespaceArtifacts(raw) {
  if (!raw || typeof raw !== "string")
    return false;
  return BRAILLE_OR_EXOTIC_SPACE_RE.test(raw);
}
function cleanBrailleAndProseWhitespace(raw) {
  if (!raw || typeof raw !== "string")
    return "";
  const normalizeProseSegment = (seg) => {
    let txt = seg;
    txt = txt.replace(/[\u2800\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, " ");
    txt = txt.replace(/[\u180E\u200B-\u200D\u2060\uFEFF]/g, "");
    txt = txt.replace(/^[ \t]+(\*[^\s*]|-[^\s\-]|[^\s\-*#+>0-9`~])/gm, "$1");
    txt = txt.replace(/^[ \t]{4,}(?=[-*+]\s|\d+\.\s|>)/gm, "  ");
    txt = txt.replace(/[ \t]+\n/g, `
`);
    txt = txt.replace(/([^\n \t])[ \t]{2,}([^\n \t])/g, "$1 $2");
    txt = txt.replace(/\n{3,}/g, `

`);
    return txt;
  };
  return raw.split(PROTECTED_BLOCKS_RE).map((chunk, idx) => idx % 2 === 1 ? chunk : normalizeProseSegment(chunk)).join("");
}
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function normalizeSensitiveWordsList(words) {
  if (!Array.isArray(words))
    return [];
  const unique = new Set;
  for (const w of words) {
    const clean = String(w ?? "").trim().toLowerCase();
    if (clean.length >= 2 && clean.length <= 64) {
      unique.add(clean);
    }
  }
  return [...unique].sort((a, b) => b.length - a.length);
}
function obfuscateWordToken(word, replaceVowelsWith1 = true) {
  const replacement = replaceVowelsWith1 ? "1" : "*";
  return word.replace(/[aeiouAEIOU]/g, replacement);
}
function obfuscateSensitiveWords(raw, words, replaceVowelsWith1 = true) {
  if (!raw || typeof raw !== "string")
    return "";
  const list = normalizeSensitiveWordsList(words);
  if (!list.length)
    return raw;
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}_])(?:${list.map(escapeRegExp).join("|")})(?![\\p{L}\\p{N}_])`, "giu");
  return raw.split(PROTECTED_BLOCKS_RE).map((chunk, idx) => idx % 2 === 1 ? chunk : chunk.replace(pattern, (match) => obfuscateWordToken(match, replaceVowelsWith1))).join("");
}
function buildWordRestoreRegexSpec(rawWord, _replaceVowelsWith1 = true) {
  const word = String(rawWord ?? "").trim().toLowerCase();
  if (word.length < 2 || !/[aeiou]/i.test(word))
    return null;
  const chars = [...word];
  const charTokens = chars.map((ch) => {
    if (/[aeiou]/i.test(ch)) {
      return `[${ch}${ch.toUpperCase()}1*]`;
    }
    if (/[a-z]/i.test(ch)) {
      return `[${ch}${ch.toUpperCase()}]`;
    }
    return escapeRegExp(ch);
  });
  const firstChar = chars[0];
  const startsWithConsonant = /[a-z]/i.test(firstChar) && !/[aeiou]/i.test(firstChar);
  if (startsWithConsonant) {
    charTokens[0] = `([${firstChar}${firstChar.toUpperCase()}])`;
  }
  const maxSpan = Math.max(0, chars.length - 1);
  const hasMarkerGuard = `(?=[\\p{L}\\p{N}*'\\- ]{0,${maxSpan}}[1*])`;
  const trailingBoundary = chars.length >= 4 ? `(?=[a-zA-Z]{0,10}(?![\\p{L}\\p{N}_]))` : `(?![\\p{L}\\p{N}_])`;
  return {
    word,
    findRegex: `(?<![\\p{L}\\p{N}_])${hasMarkerGuard}${charTokens.join("")}${trailingBoundary}`,
    replaceString: startsWithConsonant ? `$1${word.slice(1)}` : word,
    flags: startsWithConsonant ? "gu" : "giu"
  };
}
function deobfuscateSensitiveWords(raw, words, replaceVowelsWith1 = true) {
  if (!raw || typeof raw !== "string")
    return "";
  const list = normalizeSensitiveWordsList(words);
  if (!list.length)
    return raw;
  const specs = list.map((w) => {
    const spec = buildWordRestoreRegexSpec(w, replaceVowelsWith1);
    if (!spec)
      return null;
    try {
      return {
        word: spec.word,
        regex: new RegExp(spec.findRegex, spec.flags)
      };
    } catch {
      return null;
    }
  }).filter((item) => Boolean(item));
  if (!specs.length)
    return raw;
  const matchCase = (matched, original) => {
    const letters = matched.replace(/[^a-zA-Z]/g, "");
    if (letters.length > 1 && letters === letters.toUpperCase()) {
      return original.toUpperCase();
    }
    if (matched[0] && matched[0] === matched[0].toUpperCase() && matched[0] !== matched[0].toLowerCase()) {
      return original.charAt(0).toUpperCase() + original.slice(1);
    }
    return original;
  };
  return raw.split(PROTECTED_BLOCKS_RE).map((chunk, idx) => {
    if (idx % 2 === 1)
      return chunk;
    let out = chunk;
    for (const item of specs) {
      out = out.replace(item.regex, (matched) => matchCase(matched, item.word));
    }
    return out;
  }).join("");
}

class RenderProseCache {
  maxEntries;
  map = new Map;
  constructor(maxEntries = 200) {
    this.maxEntries = maxEntries;
  }
  get(userId, chatId, messageId, content) {
    const key = `${userId}:${chatId}:${messageId ?? ""}:${fnv1a32(content)}`;
    const cached = this.map.get(key);
    if (cached !== undefined) {
      this.map.delete(key);
      this.map.set(key, cached);
    }
    return cached;
  }
  set(userId, chatId, messageId, content, output) {
    const key = `${userId}:${chatId}:${messageId ?? ""}:${fnv1a32(content)}`;
    if (this.map.size >= this.maxEntries && !this.map.has(key)) {
      const oldest = this.map.keys().next().value;
      if (oldest !== undefined)
        this.map.delete(oldest);
    }
    this.map.set(key, output);
  }
  invalidateChat(chatId) {
    for (const k of this.map.keys()) {
      if (k.includes(`:${chatId}:`))
        this.map.delete(k);
    }
  }
  clear() {
    this.map.clear();
  }
}

// src/shared/state-reducer.ts
function scrubUnicodeSpacesForJson(raw) {
  return raw.replace(/[\u2800\u00A0\u1680\u180E\u2000-\u200A\u202F\u205F\u2060\u3000]/g, " ").replace(/[\u200B-\u200D\uFEFF]/g, "");
}
function closeTruncatedJson(raw) {
  const s = scrubUnicodeSpacesForJson(raw).trim();
  if (!s.startsWith("{") && !s.startsWith("["))
    return s;
  const stack = [];
  let inString = false;
  let escaped = false;
  for (let i = 0;i < s.length; i++) {
    const ch = s[i];
    if (inString) {
      if (escaped)
        escaped = false;
      else if (ch === "\\")
        escaped = true;
      else if (ch === '"')
        inString = false;
    } else if (ch === '"') {
      inString = true;
    } else if (ch === "{") {
      stack.push("}");
    } else if (ch === "[") {
      stack.push("]");
    } else if ((ch === "}" || ch === "]") && stack.at(-1) === ch) {
      stack.pop();
    }
  }
  if (!inString && !stack.length)
    return s;
  let out = s;
  if (inString)
    out += '"';
  out = out.replace(/:\s*(?:t(?:r(?:u)?)?|f(?:a(?:l(?:s)?)?)?|n(?:u(?:l)?)?|-?\d+\.)\s*$/i, ": null");
  out = out.replace(/[,:\s]+$/, "");
  if (/\{\s*"[^"]*"\s*$|,\s*"[^"]*"\s*$/.test(out) && stack.at(-1) === "}") {
    out += ": null";
  }
  while (stack.length)
    out += stack.pop();
  return out;
}
function parseExtractedJson(rawText) {
  const unicodeCleaned = scrubUnicodeSpacesForJson(rawText);
  const stripped = unicodeCleaned.replace(/<(?:think|thinking|reasoning|analysis|scratchpad)\b[^>]*>[\s\S]*?<\/(?:think|thinking|reasoning|analysis|scratchpad)\s*>/gi, "").trim();
  if (!stripped)
    throw new Error("Empty response from extractor model.");
  const candidates = [];
  const tagMatch = stripped.match(/<(?:lumi-stats|lumi_stats|lumi-tracker|worldweave)\b[^>]*>([\s\S]*?)(?:<\/(?:lumi-stats|lumi_stats|lumi-tracker|worldweave)>|$)/i);
  if (tagMatch?.[1])
    candidates.push(tagMatch[1].trim());
  const fenceMatch = stripped.match(/```(?:json|lumi-stats|lumi-tracker)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch?.[1])
    candidates.push(fenceMatch[1].trim());
  const firstBrace = stripped.indexOf("{");
  const lastBrace = stripped.lastIndexOf("}");
  if (firstBrace >= 0) {
    candidates.push(lastBrace > firstBrace ? stripped.slice(firstBrace, lastBrace + 1) : stripped.slice(firstBrace));
  }
  let lastErr;
  for (const cand of candidates) {
    const cleanCand = scrubUnicodeSpacesForJson(cand);
    const preserveSignedPlus = cleanCand.replace(/(:\s*)\+(\d+(?:\.\d+)?)(?=\s*[,}\]\r\n])/g, '$1"+$2"');
    const removeTrailingCommas = preserveSignedPlus.replace(/("(?:\\.|[^"\\])*")|,(\s*[}\]])/g, (_m, quoted, closing) => quoted ? quoted : closing);
    for (const attempt of [
      cleanCand,
      preserveSignedPlus,
      removeTrailingCommas,
      closeTruncatedJson(removeTrailingCommas)
    ]) {
      try {
        const parsed = JSON.parse(attempt);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          return parsed;
        }
      } catch (err) {
        lastErr = err;
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Failed to parse extractor JSON output.");
}
function extractInlineStatsTag(rawMessage) {
  if (!rawMessage)
    return null;
  const blocks = [];
  const tagRe = /<(lumi-stats|lumi_stats|lumi-tracker|worldweave|tracker)\b[^>]*>([\s\S]*?)(?:<\/\1\s*>|$)/gi;
  let match;
  while ((match = tagRe.exec(rawMessage)) !== null) {
    if (match[2]?.trim())
      blocks.push(match[2].trim());
  }
  const fenceRe = /```[ \t]*(?:lumi-stats|lumi_stats|lumi-tracker|tracker|sim)\b[^\n]*\r?\n([\s\S]*?)(?:```|$)/gi;
  while ((match = fenceRe.exec(rawMessage)) !== null) {
    if (match[1]?.trim())
      blocks.push(match[1].trim());
  }
  for (let i = blocks.length - 1;i >= 0; i--) {
    try {
      return parseExtractedJson(blocks[i]);
    } catch {}
  }
  return null;
}
function stripInlineStatsTags(rawMessage) {
  return rawMessage.replace(/<(lumi-stats|lumi_stats|lumi-tracker|worldweave|tracker)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "").replace(/<(lumi-stats|lumi_stats|lumi-tracker|worldweave|tracker)\b[^>]*>[\s\S]*$/gi, "").replace(/```[ \t]*(?:lumi-stats|lumi_stats|lumi-tracker|tracker|sim)\b[^\n]*\r?\n[\s\S]*?(?:```|$)/gi, "").trim();
}
function cleanStringValue(val) {
  return cleanBrailleAndProseWhitespace(val).trim();
}
function toTitleCaseWords(text) {
  return text.replace(/(^|[\s\-'])([a-z])/g, (_m, sep, ch) => sep + ch.toUpperCase());
}
function normalizeDisplayLabel(raw, fromIdSlug = false) {
  let txt = cleanStringValue(raw);
  if (!txt)
    return "";
  if (fromIdSlug) {
    txt = txt.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  }
  const hasLower = txt !== txt.toUpperCase();
  const hasUpper = txt !== txt.toLowerCase();
  if (hasLower && !hasUpper) {
    return toTitleCaseWords(txt);
  }
  if (hasUpper && !hasLower && txt.length > 3) {
    return toTitleCaseWords(txt.toLowerCase());
  }
  return txt;
}
function pickBetterCasedLabel(existing, incoming, fromIdSlug = false) {
  const normalizedIncoming = normalizeDisplayLabel(incoming, fromIdSlug);
  const cur = existing?.trim() ?? "";
  if (!cur)
    return normalizedIncoming;
  if (!normalizedIncoming)
    return cur;
  if (cur.toLowerCase() === normalizedIncoming.toLowerCase()) {
    const curHasUpper = cur !== cur.toLowerCase();
    const curHasLower = cur !== cur.toUpperCase();
    const curIsProperOrMixed = curHasUpper && curHasLower;
    const rawClean = cleanStringValue(incoming);
    const rawIsAllLower = rawClean === rawClean.toLowerCase();
    if (curIsProperOrMixed && (fromIdSlug || rawIsAllLower)) {
      return cur;
    }
    return normalizedIncoming;
  }
  return normalizedIncoming;
}
function inferBondCategory(label, note = "") {
  const txt = `${label} ${note}`.toLowerCase();
  if (/\b(?:sister|brother|sibling|mother|mom|father|dad|parent|son|daughter|cousin|aunt|uncle|family|twin|niece|nephew|guardian)\b/.test(txt)) {
    return "family";
  }
  if (/\b(?:lover|partner|wife|husband|spouse|fianc[e\u00E9]e?|boyfriend|girlfriend|crush|sweetheart|romantic|beloved|infatuat)\b/.test(txt)) {
    return "romance";
  }
  if (/\b(?:rival|enemy|nemesis|hostile|antagonist|foe|hatred|bitter|estranged|ex-|ex\b|adversary|suspicious|threat)\b/.test(txt)) {
    return "rival";
  }
  if (/\b(?:boss|employer|employee|subordinate|maid|butler|servant|retainer|master|teacher|student|mentor|apprentice|client|doctor|colleague|coworker|captain|commander)\b/.test(txt)) {
    return "professional";
  }
  if (/\b(?:friend|best\s+friend|ally|companion|confidant|buddy|comrade|roommate|childhood|pal|trusted|protector)\b/.test(txt)) {
    return "friend";
  }
  return "neutral";
}
function normalizeRelationLink(raw, fallback) {
  if (!raw)
    return fallback;
  if (typeof raw === "string") {
    const label = cleanStringValue(raw).slice(0, 140);
    if (!label)
      return fallback;
    return {
      label,
      ...fallback?.note ? { note: fallback.note } : {},
      category: inferBondCategory(label, fallback?.note ?? "")
    };
  }
  if (typeof raw === "object" && !Array.isArray(raw)) {
    const o = raw;
    const label = cleanStringValue(String(o.label ?? o.relation ?? o.bond ?? fallback?.label ?? "")).slice(0, 140);
    const note = cleanStringValue(String(o.note ?? o.attitude ?? o.reason ?? fallback?.note ?? "")).slice(0, 260);
    if (!label && !note)
      return fallback;
    const validCat = new Set(["family", "friend", "romance", "rival", "professional", "neutral"]);
    const explicitCat = typeof o.category === "string" && validCat.has(o.category) ? o.category : undefined;
    return {
      label: label || fallback?.label || "Acquaintance",
      ...note ? { note } : {},
      category: explicitCat ?? inferBondCategory(label || fallback?.label || "", note)
    };
  }
  return fallback;
}
function inferInitialPeerBondMeters(label, attitude) {
  const combined = `${label} ${attitude}`.toLowerCase();
  if (/\b(?:rival|enemy|hostile|bitter|ex-|ex\b|nemesis|distrust|wary|suspicious|cold|resent|feud|threat|antagonist)\b/.test(combined)) {
    return { affinity: 32, trust: 28 };
  }
  if (/\b(?:sister|brother|mother|father|family|roommate|best\s+friend|close\s+friend|loyal|ally|devoted|partner|lover|confidant|trusted|protective)\b/.test(combined)) {
    return { affinity: 74, trust: 72 };
  }
  if (/\b(?:colleague|advocate|lawyer|doctor|assistant|retainer|maid|butler|associate|mentor)\b/.test(combined)) {
    return { affinity: 58, trust: 65 };
  }
  return { affinity: 50, trust: 50 };
}
function normalizeStatMutation(rawInput, alreadyCalibrated) {
  if (rawInput === null || rawInput === undefined)
    return null;
  if (Array.isArray(rawInput)) {
    const joined = rawInput.map((item) => typeof item === "object" && item !== null ? Object.entries(item).map(([k, v]) => `${k}: ${String(v)}`).join(" -> ") : String(item)).filter(Boolean).join(`
`);
    return joined ? { op: "set", value: cleanStringValue(joined) } : null;
  }
  if (typeof rawInput === "object" && !Array.isArray(rawInput)) {
    const obj = rawInput;
    if (obj.value === undefined || obj.value === null) {
      if ("op" in obj)
        return null;
      return { op: "set", value: JSON.stringify(rawInput) };
    }
    const rawVal = obj.value;
    const explicitOp = obj.op === "delta" && alreadyCalibrated ? "delta" : "set";
    const rawReasonStr = typeof obj.reason === "string" ? cleanStringValue(obj.reason) : "";
    const cleanedReason = rawReasonStr && !/^(?:manual ui adjustment|manual dossier adjustment|scene progression)$/i.test(rawReasonStr) ? rawReasonStr : undefined;
    if (typeof rawVal === "string") {
      const trimmed = cleanStringValue(rawVal);
      if (!trimmed || trimmed === "\u2205")
        return null;
      const signedMatch = trimmed.match(/^([+-])(\d+(?:\.\d+)?)$/);
      if (signedMatch) {
        const num = Number(trimmed);
        return {
          op: alreadyCalibrated ? "delta" : "set",
          value: alreadyCalibrated ? num : Math.abs(num),
          reason: cleanedReason
        };
      }
      const plainNum = Number(trimmed);
      if (Number.isFinite(plainNum)) {
        return { op: explicitOp, value: plainNum, reason: cleanedReason };
      }
      return { op: "set", value: trimmed, reason: cleanedReason };
    }
    return { op: explicitOp, value: rawVal, reason: cleanedReason };
  }
  if (typeof rawInput === "string") {
    const trimmed = cleanStringValue(rawInput);
    if (!trimmed || trimmed === "\u2205")
      return null;
    const signedMatch = trimmed.match(/^([+-])(\d+(?:\.\d+)?)$/);
    if (signedMatch) {
      const num = Number(trimmed);
      return {
        op: alreadyCalibrated ? "delta" : "set",
        value: alreadyCalibrated ? num : Math.abs(num)
      };
    }
    const plainNum = Number(trimmed);
    if (Number.isFinite(plainNum)) {
      return { op: "set", value: plainNum };
    }
    return { op: "set", value: trimmed };
  }
  if (typeof rawInput === "number") {
    if (!Number.isFinite(rawInput))
      return null;
    return { op: "set", value: rawInput };
  }
  if (typeof rawInput === "boolean") {
    return { op: "set", value: rawInput };
  }
  return null;
}
function matchStatSchema(schemas, rawKey, scopeFilter) {
  const slug = slugifyKey(rawKey, "");
  return schemas.find((s) => {
    if (scopeFilter === "character" && s.scope !== "character")
      return false;
    if (scopeFilter === "non_character" && s.scope === "character")
      return false;
    return s.id === rawKey || slugifyKey(s.id, "") === slug || slugifyKey(s.label, "") === slug;
  });
}
function applyTurnPatch(before, template, patch, options = {}) {
  const next = structuredClone(before);
  const bypassLocks = options.isManualEdit === true;
  const triggeredAlerts = [];
  const statDeltas = {};
  const characterDeltas = {};
  const touchedCharacterSet = new Set;
  const touchedPlaceSet = new Set;
  if (options.incrementTurn) {
    next.turnCount = (next.turnCount || 0) + 1;
  }
  const rawPatchObj = patch;
  const sceneSource = (patch.scene && typeof patch.scene === "object" ? patch.scene : undefined) ?? (rawPatchObj.worldData && typeof rawPatchObj.worldData === "object" ? rawPatchObj.worldData : undefined);
  const rawElapsed = Number(patch.scene?.elapsedMinutes ?? sceneSource?.elapsedMinutes ?? sceneSource?.mins ?? 0);
  const effectiveElapsed = Number.isFinite(rawElapsed) && rawElapsed > 0 && rawElapsed <= 10080 ? Math.round(rawElapsed) : 0;
  if (effectiveElapsed > 0) {
    next.elapsedMinutes += effectiveElapsed;
  }
  const pillLocked = !bypassLocks && Boolean(template.coreTrackers?.scenePillLocked);
  if (sceneSource) {
    const loc = String(sceneSource.location ?? "").trim();
    const time = String(sceneSource.timeLabel ?? sceneSource.time ?? sceneSource.current_time ?? "").trim();
    const date = String(sceneSource.dateLabel ?? sceneSource.date ?? sceneSource.current_date ?? "").trim();
    const weather = String(sceneSource.weather ?? "").trim();
    const summary = String(sceneSource.beatSummary ?? sceneSource.summary ?? "").trim();
    if (!pillLocked) {
      if (loc)
        next.scene.location = cleanStringValue(loc);
      if (time)
        next.scene.timeLabel = cleanStringValue(time);
      if (date)
        next.scene.dateLabel = cleanStringValue(date);
      if (weather)
        next.scene.weather = cleanStringValue(weather);
    }
    if (summary && (bypassLocks || !template.coreTrackers?.overrides?.scene_summary?.locked)) {
      next.scene.beatSummary = cleanStringValue(summary);
    }
    if (loc || summary || time || date) {
      next.initialized = true;
    }
    if ((!next.title || next.title === "Uncharted Story") && next.scene.location) {
      next.title = next.scene.location.split(",")[0]?.trim() || next.scene.location;
    }
  }
  const extraStatBags = [];
  if (patch.player && typeof patch.player === "object") {
    const pObj = patch.player;
    if (typeof pObj.attire === "string" && pObj.attire.trim())
      next.player.attire = cleanStringValue(pObj.attire);
    if (typeof pObj.condition === "string" && pObj.condition.trim())
      next.player.condition = cleanStringValue(pObj.condition);
    if (typeof pObj.notableAction === "string" && pObj.notableAction.trim())
      next.player.notableAction = cleanStringValue(pObj.notableAction);
    const playerStatCandidates = {};
    for (const [pk, pv] of Object.entries(pObj)) {
      if (!["attire", "condition", "notableAction", "name"].includes(pk) && pv !== undefined) {
        playerStatCandidates[pk] = pv;
      }
    }
    if (Object.keys(playerStatCandidates).length > 0)
      extraStatBags.push(playerStatCandidates);
  }
  if (rawPatchObj.world && typeof rawPatchObj.world === "object" && !Array.isArray(rawPatchObj.world)) {
    extraStatBags.push(rawPatchObj.world);
  }
  if (options.incrementTurn || effectiveElapsed > 0) {
    next.modifiers = next.modifiers.filter((mod) => {
      if (mod.remainingTurns !== undefined && options.incrementTurn) {
        mod.remainingTurns -= 1;
        if (mod.remainingTurns <= 0)
          return false;
      }
      if (mod.remainingMinutes !== undefined && effectiveElapsed > 0) {
        mod.remainingMinutes -= effectiveElapsed;
        if (mod.remainingMinutes <= 0)
          return false;
      }
      return true;
    });
  }
  const defaultReason = next.scene.beatSummary || "Scene progression";
  const checkThresholdAlerts = (schema, prevVal, nextVal, ownerLabel) => {
    if (!schema.alerts?.length)
      return;
    for (const alert of schema.alerts) {
      const crossedAbove = alert.direction === "above" && (prevVal === undefined || prevVal < alert.value) && nextVal >= alert.value;
      const crossedBelow = alert.direction === "below" && (prevVal === undefined || prevVal > alert.value) && nextVal <= alert.value;
      if (crossedAbove || crossedBelow) {
        const prefix = ownerLabel ? `${ownerLabel} \xB7 ` : "";
        triggeredAlerts.push(`${schema.icon} ${prefix}${alert.message}`);
      }
    }
  };
  const applyNonCharStat = (schema, rawMutation) => {
    const existing = next.stats[schema.id];
    if (!bypassLocks && (schema.locked || existing?.locked))
      return;
    const wasCalibrated = Boolean(existing?.calibrated);
    const mutation = normalizeStatMutation(rawMutation, wasCalibrated);
    if (!mutation)
      return;
    const prevValue = existing?.calibrated ? existing.value : null;
    let finalValue;
    let numericDelta = 0;
    const isTextStyle = Boolean(schema.displayStyle && schema.displayStyle !== "auto") || ["text", "tags", "tier", "skill_tree", "xp_level", "attributes", "inventory", "status_fx"].includes(schema.kind);
    if (!isTextStyle && ["meter", "number", "clock", "pips", "hearts", "currency"].includes(schema.kind) && Number.isFinite(Number(mutation.value))) {
      const rawNum = Number(mutation.value);
      if (!Number.isFinite(rawNum))
        return;
      const baseNum = wasCalibrated && typeof existing?.value === "number" ? existing.value : typeof schema.defaultValue === "number" ? schema.defaultValue : schema.min;
      const isIntKind = ["clock", "pips", "hearts", "currency"].includes(schema.kind);
      if (mutation.op === "delta" && wasCalibrated) {
        if (rawNum === 0)
          return;
        const computed = baseNum + rawNum;
        finalValue = Math.max(schema.min, Math.min(schema.max, isIntKind ? Math.round(computed) : Number(computed.toFixed(2))));
      } else {
        finalValue = Math.max(schema.min, Math.min(schema.max, isIntKind ? Math.round(rawNum) : Number(rawNum.toFixed(2))));
      }
      numericDelta = typeof prevValue === "number" ? Number((finalValue - prevValue).toFixed(2)) : Number((finalValue - baseNum).toFixed(2));
      checkThresholdAlerts(schema, typeof prevValue === "number" ? prevValue : undefined, finalValue);
    } else if (schema.kind === "boolean") {
      finalValue = mutation.value === true || mutation.value === 1 || String(mutation.value).toLowerCase() === "true";
    } else {
      finalValue = cleanStringValue(String(mutation.value)).slice(0, 4000);
    }
    next.stats[schema.id] = {
      id: schema.id,
      scope: schema.scope === "character" ? "player" : schema.scope,
      value: finalValue,
      calibrated: true,
      locked: Boolean(existing?.locked || schema.locked),
      ...mutation.reason ? { lastReason: mutation.reason } : existing?.lastReason && existing.lastReason !== next.scene.beatSummary ? { lastReason: existing.lastReason } : {}
    };
    if (numericDelta !== 0) {
      statDeltas[schema.id] = numericDelta;
    }
    if (prevValue !== finalValue) {
      const audit = {
        id: `aud_${schema.id}_${next.turnCount}_${next.auditLog.length + 1}`,
        statId: schema.id,
        statLabel: `${schema.icon} ${schema.label}`,
        op: bypassLocks ? "manual" : mutation.op,
        before: prevValue,
        after: finalValue,
        numericDelta,
        reason: mutation.reason || defaultReason,
        turn: next.turnCount,
        minute: next.elapsedMinutes,
        at: new Date().toISOString()
      };
      next.auditLog.push(audit);
      if (next.auditLog.length > 200)
        next.auditLog.shift();
    }
  };
  const applyCharMeter = (char, schema, rawMutation) => {
    const existing = char.meters[schema.id];
    if (!bypassLocks && (schema.locked || existing?.locked))
      return;
    const wasCalibrated = Boolean(existing?.calibrated);
    const mutation = normalizeStatMutation(rawMutation, wasCalibrated);
    if (!mutation)
      return;
    const prevValue = wasCalibrated && existing ? existing.value : null;
    let finalValue;
    let numericDelta = 0;
    const isCharTextStyle = Boolean(schema.displayStyle && schema.displayStyle !== "auto") || ["text", "tags", "tier", "skill_tree", "xp_level", "attributes", "inventory", "status_fx"].includes(schema.kind);
    if (!isCharTextStyle && ["meter", "number", "clock", "pips", "hearts", "currency"].includes(schema.kind) && Number.isFinite(Number(mutation.value))) {
      const rawNum = Number(mutation.value);
      const baseNum = wasCalibrated && typeof existing?.value === "number" ? existing.value : typeof schema.defaultValue === "number" ? schema.defaultValue : 0;
      if (!bypassLocks && wasCalibrated && mutation.op === "set" && rawNum === 0 && baseNum !== 0 && schema.volatility !== "momentary") {
        return;
      }
      if (mutation.op === "delta" && wasCalibrated) {
        if (rawNum === 0)
          return;
        const computed = baseNum + rawNum;
        finalValue = Math.max(schema.min, Math.min(schema.max, Math.round(computed)));
      } else {
        finalValue = Math.max(schema.min, Math.min(schema.max, Math.round(rawNum)));
      }
      numericDelta = typeof prevValue === "number" ? finalValue - prevValue : finalValue - (typeof schema.defaultValue === "number" ? schema.defaultValue : 0);
      checkThresholdAlerts(schema, typeof prevValue === "number" ? prevValue : undefined, finalValue, char.name);
    } else if (schema.kind === "boolean") {
      finalValue = mutation.value === true || mutation.value === 1 || String(mutation.value).toLowerCase() === "true";
    } else {
      finalValue = cleanStringValue(String(mutation.value)).slice(0, 4000);
    }
    char.meters[schema.id] = {
      value: finalValue,
      calibrated: true,
      locked: Boolean(existing?.locked || schema.locked),
      ...mutation.reason ? { lastReason: mutation.reason } : existing?.lastReason && existing.lastReason !== next.scene.beatSummary ? { lastReason: existing.lastReason } : {}
    };
    touchedCharacterSet.add(char.id);
    if (numericDelta !== 0) {
      (characterDeltas[char.id] ??= {})[schema.id] = numericDelta;
    }
    if (prevValue !== finalValue) {
      next.auditLog.push({
        id: `aud_${char.id}_${schema.id}_${next.turnCount}_${next.auditLog.length + 1}`,
        statId: schema.id,
        statLabel: `${schema.icon} ${schema.label}`,
        actorId: char.id,
        op: bypassLocks ? "manual" : mutation.op,
        before: prevValue,
        after: finalValue,
        numericDelta,
        reason: mutation.reason || defaultReason,
        turn: next.turnCount,
        minute: next.elapsedMinutes,
        at: new Date().toISOString()
      });
      if (next.auditLog.length > 200)
        next.auditLog.shift();
    }
  };
  const findExistingCharacter = (rawId, rawName) => {
    const cleanName = cleanStringValue(rawName);
    const idSlug = rawId ? slugifyKey(rawId, "") : "";
    const nameSlug = cleanName ? slugifyKey(cleanName, "") : "";
    const lowName = cleanName.toLowerCase();
    if (idSlug && next.characters[idSlug])
      return next.characters[idSlug];
    if (nameSlug && next.characters[nameSlug])
      return next.characters[nameSlug];
    const all = Object.values(next.characters);
    const exact = all.find((c) => c.name.toLowerCase() === lowName || c.aliases.some((a) => a.toLowerCase() === lowName));
    if (exact)
      return exact;
    if (!lowName)
      return;
    const tokenMatches = all.filter((c) => {
      const cWords = c.name.toLowerCase().split(/\s+/).filter(Boolean);
      const inWords = lowName.split(/\s+/).filter(Boolean);
      if (inWords.length === 1 && cWords.length > 1 && cWords[0] === inWords[0])
        return true;
      if (cWords.length === 1 && inWords.length > 1 && inWords[0] === cWords[0])
        return true;
      return false;
    });
    return tokenMatches.length === 1 ? tokenMatches[0] : undefined;
  };
  const parsePresenceFlag = (val) => {
    if (typeof val === "boolean")
      return val;
    if (typeof val === "number")
      return val !== 0;
    if (typeof val === "string") {
      const low = val.trim().toLowerCase();
      if (["true", "yes", "1", "present", "in_scene", "in scene", "here"].includes(low)) {
        return true;
      }
      if (["false", "no", "0", "away", "offscreen", "off-screen", "absent", "left"].includes(low)) {
        return false;
      }
    }
    return;
  };
  const sceneLocPrimary = (next.scene.location || "").split(",")[0]?.trim().toLowerCase() || "";
  if (Array.isArray(patch.characters)) {
    for (const rawChar of patch.characters) {
      if (!rawChar || typeof rawChar !== "object")
        continue;
      const rawExplicitName = typeof rawChar.name === "string" ? cleanStringValue(rawChar.name) : "";
      const fromIdFallback = !rawExplicitName;
      const rawCandidate = rawExplicitName || cleanStringValue(String(rawChar.id ?? ""));
      const name = normalizeDisplayLabel(rawCandidate, fromIdFallback);
      if (!name)
        continue;
      const slug = slugifyKey(rawChar.id ?? name, "npc");
      if (slug === "player")
        continue;
      const existing = findExistingCharacter(rawChar.id, name);
      const charId = existing?.id ?? slug;
      touchedCharacterSet.add(charId);
      const rawCharRec = rawChar;
      const parsedPresent = parsePresenceFlag(rawCharRec.present);
      const charLocText = cleanStringValue(String(rawCharRec.location ?? rawCharRec.locationId ?? ""));
      const charLocLow = charLocText.toLowerCase();
      const charLocMatchesScene = Boolean(charLocLow && sceneLocPrimary && (charLocLow === sceneLocPrimary || charLocLow.includes(sceneLocPrimary) || sceneLocPrimary.includes(charLocLow)));
      const charLocIsExplicitlyAway = Boolean(charLocLow && (/\b(?:away|offscreen|off-screen|elsewhere|outside|hallway|downstairs|upstairs)\b/.test(charLocLow) || sceneLocPrimary && !charLocMatchesScene));
      const char = existing ?? {
        id: charId,
        name,
        aliases: [],
        roleSummary: cleanStringValue(rawChar.roleSummary ?? "Story Character"),
        present: parsedPresent !== undefined ? parsedPresent : !charLocIsExplicitlyAway,
        locationId: next.currentPlaceId,
        demeanor: "",
        innerThought: "",
        immediateGoal: "",
        attire: "",
        fields: {},
        meters: {},
        peerBonds: {},
        conditions: [],
        secrets: [],
        expressionAssets: {},
        notes: ""
      };
      char.peerBonds ??= {};
      if (existing && existing.name.toLowerCase() !== name.toLowerCase()) {
        const aliasSet = new Set(char.aliases);
        if (!fromIdFallback && name.length >= existing.name.length) {
          aliasSet.add(existing.name);
          char.name = name;
        } else {
          aliasSet.add(name);
        }
        char.aliases = [...aliasSet].slice(0, 12);
      } else {
        char.name = pickBetterCasedLabel(existing?.name, rawCandidate, fromIdFallback);
      }
      if (parsedPresent !== undefined) {
        char.present = parsedPresent;
      } else if (charLocMatchesScene) {
        char.present = true;
      } else if (existing && !existing.present && existing.demeanor === "Unseen" && !charLocIsExplicitlyAway) {
        char.present = true;
      }
      if (charLocText) {
        const matchedPlace = next.places[slugifyKey(charLocText, "")] ?? Object.values(next.places).find((p) => p.name.toLowerCase() === charLocLow);
        char.locationId = matchedPlace ? matchedPlace.id : slugifyKey(charLocText, char.locationId || "");
      }
      const roleVal = String(rawChar.roleSummary ?? rawCharRec.role ?? rawCharRec.relationshipStatus ?? "").trim();
      const demVal = String(rawChar.demeanor ?? rawCharRec.emotion ?? rawCharRec.mood ?? "").trim();
      const thoughtVal = String(rawChar.innerThought ?? rawCharRec.thought ?? rawCharRec.internal_thought ?? "").trim();
      const goalVal = String(rawChar.immediateGoal ?? rawCharRec.goal ?? rawCharRec.aim ?? "").trim();
      const attireVal = String(rawChar.attire ?? rawCharRec.clothing ?? "").trim();
      const isDossierFieldAllowed = (fid) => bypassLocks || template.dossierFields.find((f) => f.id === fid)?.locked !== true;
      if (roleVal && isDossierFieldAllowed("role_summary")) {
        char.roleSummary = cleanStringValue(roleVal);
        char.fields.role_summary = char.roleSummary;
      }
      if (demVal && isDossierFieldAllowed("demeanor")) {
        char.demeanor = cleanStringValue(demVal);
        char.fields.demeanor = char.demeanor;
      }
      if (thoughtVal && isDossierFieldAllowed("inner_thought")) {
        char.innerThought = cleanStringValue(thoughtVal);
        char.fields.inner_thought = char.innerThought;
      }
      if (goalVal && isDossierFieldAllowed("immediate_goal")) {
        char.immediateGoal = cleanStringValue(goalVal);
        char.fields.immediate_goal = char.immediateGoal;
      }
      if (attireVal && isDossierFieldAllowed("attire_layers")) {
        char.attire = cleanStringValue(attireVal);
        char.fields.attire_layers = char.attire;
      }
      if (Array.isArray(rawChar.aliases)) {
        char.aliases = [...new Set([...char.aliases, ...rawChar.aliases.map((a) => cleanStringValue(String(a)))])].slice(0, 12);
      }
      if (Array.isArray(rawChar.conditions)) {
        char.conditions = rawChar.conditions.map((c) => cleanStringValue(String(c))).filter(Boolean).slice(0, 10);
      }
      if (typeof rawCharRec.notes === "string") {
        char.notes = cleanStringValue(rawCharRec.notes).slice(0, 2000);
      }
      if (rawChar.fields && typeof rawChar.fields === "object") {
        for (const [fk, fv] of Object.entries(rawChar.fields)) {
          if (typeof fv === "string" && fv.trim()) {
            const matchedField = template.dossierFields.find((f) => f.id === fk || slugifyKey(f.label, "") === slugifyKey(fk, ""));
            const targetKey = matchedField?.id ?? slugifyKey(fk, "field");
            if (!bypassLocks && matchedField?.locked)
              continue;
            const cleanedField = cleanStringValue(fv).slice(0, 1000);
            char.fields[targetKey] = cleanedField;
            if (targetKey === "role_summary")
              char.roleSummary = cleanedField;
            else if (targetKey === "demeanor")
              char.demeanor = cleanedField;
            else if (targetKey === "inner_thought")
              char.innerThought = cleanedField;
            else if (targetKey === "immediate_goal")
              char.immediateGoal = cleanedField;
            else if (targetKey === "attire_layers")
              char.attire = cleanedField;
          }
        }
      }
      const rawToPlayer = rawChar.bondToPlayer ?? rawCharRec.npcToUser ?? rawCharRec.relationToPlayer ?? (roleVal && !char.bondToPlayer ? roleVal : undefined);
      const nextToPlayer = normalizeRelationLink(rawToPlayer, char.bondToPlayer);
      if (nextToPlayer)
        char.bondToPlayer = nextToPlayer;
      const rawFromPlayer = rawChar.bondFromPlayer ?? rawCharRec.userToNpc ?? rawCharRec.playerBond;
      const nextFromPlayer = normalizeRelationLink(rawFromPlayer, char.bondFromPlayer);
      if (nextFromPlayer)
        char.bondFromPlayer = nextFromPlayer;
      const RESERVED_CHAR_KEYS = new Set([
        "id",
        "name",
        "aliases",
        "present",
        "role",
        "roleSummary",
        "relationshipStatus",
        "demeanor",
        "emotion",
        "mood",
        "innerThought",
        "thought",
        "internal_thought",
        "immediateGoal",
        "goal",
        "aim",
        "attire",
        "clothing",
        "location",
        "locationId",
        "conditions",
        "fields",
        "meters",
        "stats",
        "peerBonds",
        "npcBonds",
        "bonds",
        "secrets",
        "notes",
        "bondToPlayer",
        "bondFromPlayer",
        "npcToUser",
        "userToNpc",
        "relationToPlayer",
        "playerBond"
      ]);
      const combinedMeters = {};
      if (rawCharRec.stats && typeof rawCharRec.stats === "object" && !Array.isArray(rawCharRec.stats)) {
        Object.assign(combinedMeters, rawCharRec.stats);
      }
      if (rawChar.meters && typeof rawChar.meters === "object") {
        Object.assign(combinedMeters, rawChar.meters);
      }
      for (const [ck, cv] of Object.entries(rawCharRec)) {
        if (RESERVED_CHAR_KEYS.has(ck) || cv === null || cv === undefined)
          continue;
        if (typeof cv === "number" || typeof cv === "boolean" || typeof cv === "string") {
          const matchedField = template.dossierFields.find((f) => f.id === ck || slugifyKey(f.label, "") === slugifyKey(ck, ""));
          if (matchedField && typeof cv === "string") {
            char.fields[matchedField.id] = cleanStringValue(cv).slice(0, 1000);
          } else {
            combinedMeters[ck] = cv;
          }
        }
      }
      for (const [mk, mv] of Object.entries(combinedMeters)) {
        const schema = matchStatSchema(template.stats, mk, "character");
        if (!schema) {
          const matchedField = template.dossierFields.find((f) => f.id === mk || slugifyKey(f.label, "") === slugifyKey(mk, ""));
          if (matchedField && typeof mv === "string" && mv.trim()) {
            char.fields[matchedField.id] = cleanStringValue(mv).slice(0, 1000);
          }
          continue;
        }
        applyCharMeter(char, schema, mv);
      }
      const rawBondsList = Array.isArray(rawChar.peerBonds) ? rawChar.peerBonds : Array.isArray(rawCharRec.npcBonds) ? rawCharRec.npcBonds : Array.isArray(rawCharRec.bonds) ? rawCharRec.bonds : [];
      for (const rawBond of rawBondsList) {
        if (!rawBond || typeof rawBond !== "object")
          continue;
        const bObj = rawBond;
        const targetName = cleanStringValue(String(bObj.target ?? bObj.toName ?? bObj.name ?? bObj.to ?? ""));
        if (!targetName)
          continue;
        const matchedPeer = findExistingCharacter(bObj.toId, targetName);
        const targetSlug = matchedPeer?.id ?? slugifyKey(bObj.toId ?? targetName, "npc");
        const resolvedTargetName = matchedPeer ? pickBetterCasedLabel(matchedPeer.name, targetName, false) : normalizeDisplayLabel(targetName, false);
        const playerSlug = slugifyKey(next.player.name || "player", "player");
        if (!targetSlug || targetSlug === charId || targetSlug === "player" || targetSlug === "user" || next.player.name && targetSlug === playerSlug) {
          continue;
        }
        const prevBond = char.peerBonds[targetSlug];
        const nextMeters = { ...prevBond?.meters ?? {} };
        const resolveBondNum = (rawV, prevN) => {
          if (typeof rawV === "number" && Number.isFinite(rawV)) {
            return Math.max(0, Math.min(100, Math.round(rawV)));
          }
          if (typeof rawV === "string") {
            const t = rawV.trim();
            if (/^[+-]\d+(?:\.\d+)?$/.test(t)) {
              return Math.max(0, Math.min(100, Math.round(prevN + Number(t))));
            }
            const n = Number(t);
            if (Number.isFinite(n))
              return Math.max(0, Math.min(100, Math.round(n)));
          }
          return;
        };
        for (const [bk, bv] of Object.entries(bObj)) {
          if (["target", "to", "toId", "toName", "name", "label", "attitude", "thought", "dynamic"].includes(bk)) {
            continue;
          }
          if (bk === "meters" && bv && typeof bv === "object" && !Array.isArray(bv)) {
            for (const [mk, mv] of Object.entries(bv)) {
              const resolved = resolveBondNum(mv, nextMeters[mk] ?? 50);
              if (resolved !== undefined)
                nextMeters[mk] = resolved;
            }
            continue;
          }
          const resolved = resolveBondNum(bv, nextMeters[bk] ?? 50);
          if (resolved !== undefined)
            nextMeters[bk] = resolved;
        }
        const resolvedLabel = cleanStringValue(String(bObj.label ?? bObj.relation ?? bObj.dynamic ?? prevBond?.label ?? "Acquaintance"));
        const resolvedAttitude = cleanStringValue(String(bObj.attitude ?? bObj.note ?? bObj.thought ?? prevBond?.attitude ?? ""));
        const validCat = new Set(["family", "friend", "romance", "rival", "professional", "neutral"]);
        const resolvedCategory = typeof bObj.category === "string" && validCat.has(bObj.category) ? bObj.category : prevBond?.category ?? inferBondCategory(resolvedLabel, resolvedAttitude);
        const inferred = inferInitialPeerBondMeters(resolvedLabel, resolvedAttitude);
        if (nextMeters.affinity === undefined) {
          nextMeters.affinity = nextMeters.affection ?? inferred.affinity;
        }
        if (nextMeters.trust === undefined) {
          nextMeters.trust = nextMeters.loyalty ?? inferred.trust;
        }
        char.peerBonds[targetSlug] = {
          fromId: charId,
          toId: targetSlug,
          toName: resolvedTargetName,
          label: resolvedLabel,
          attitude: resolvedAttitude,
          category: resolvedCategory,
          meters: nextMeters,
          updatedTurn: next.turnCount
        };
        if (!next.characters[targetSlug]) {
          next.characters[targetSlug] = {
            id: targetSlug,
            name: resolvedTargetName,
            aliases: [],
            roleSummary: cleanStringValue(String(bObj.label ?? "Mentioned Character")),
            present: false,
            locationId: "",
            demeanor: "Unseen",
            innerThought: "",
            immediateGoal: "",
            attire: "",
            fields: {},
            meters: {},
            peerBonds: {},
            conditions: [],
            secrets: [],
            expressionAssets: {},
            notes: ""
          };
          touchedCharacterSet.add(targetSlug);
        }
      }
      for (const schema of template.stats.filter((s) => s.enabled && s.scope === "character")) {
        if (!char.meters[schema.id]) {
          char.meters[schema.id] = {
            value: schema.defaultValue,
            calibrated: false,
            locked: schema.locked
          };
        }
      }
      if (Array.isArray(rawChar.secrets)) {
        for (const sec of rawChar.secrets) {
          if (!sec?.title?.trim())
            continue;
          const sid = slugifyKey(sec.id ?? sec.title, "sec");
          const stage = sec.stage === "confirmed" || sec.stage === "clue" ? sec.stage : "rumor";
          const idx = char.secrets.findIndex((s) => s.id === sid);
          const item = {
            id: sid,
            title: cleanStringValue(sec.title),
            detail: cleanStringValue(String(sec.detail ?? "")),
            stage
          };
          if (idx >= 0)
            char.secrets[idx] = item;
          else
            char.secrets.push(item);
        }
      }
      next.characters[charId] = char;
      next.initialized = true;
    }
  }
  if (template.surfaces.trackNpcBonds !== false) {
    const castList = Object.values(next.characters);
    for (const charA of castList) {
      charA.peerBonds ??= {};
      for (const bondAB of Object.values(charA.peerBonds)) {
        bondAB.category ??= inferBondCategory(bondAB.label, bondAB.attitude);
        const inferred = inferInitialPeerBondMeters(bondAB.label, bondAB.attitude);
        bondAB.meters.affinity ??= inferred.affinity;
        bondAB.meters.trust ??= inferred.trust;
      }
    }
  }
  const mergedStatsBag = {};
  for (const bag of extraStatBags) {
    Object.assign(mergedStatsBag, bag);
  }
  if (patch.stats && typeof patch.stats === "object") {
    Object.assign(mergedStatsBag, patch.stats);
  }
  if (Object.keys(mergedStatsBag).length > 0) {
    for (const [sk, sv] of Object.entries(mergedStatsBag)) {
      const nonCharSchema = matchStatSchema(template.stats, sk, "non_character");
      if (nonCharSchema) {
        applyNonCharStat(nonCharSchema, sv);
        continue;
      }
      const charSchema = matchStatSchema(template.stats, sk, "character");
      if (charSchema) {
        const presentChars = Object.values(next.characters).filter((c) => c.present);
        const targets = presentChars.length ? presentChars : Object.values(next.characters).slice(0, 1);
        for (const target of targets) {
          applyCharMeter(target, charSchema, sv);
        }
        continue;
      }
      if (bypassLocks) {
        const label = sk.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        const adopted = createStatSchema({
          id: slugifyKey(sk, "stat"),
          label,
          scope: "player",
          kind: typeof sv === "boolean" ? "boolean" : typeof sv === "string" && Number.isNaN(Number(sv)) ? "text" : "meter",
          min: 0,
          max: 100,
          volatility: "progressive"
        });
        applyNonCharStat(adopted, sv);
      }
    }
  }
  next.mapZones ??= {};
  next.mapPaths ??= [];
  const ZONE_PALETTE = ["#38bdf8", "#f59e0b", "#10b981", "#a78bfa", "#f472b6", "#2dd4bf"];
  const VALID_ZONE_KINDS = new Set(["building", "district", "region", "ship_deck", "realm"]);
  const VALID_PATH_KINDS = new Set(["door", "hallway", "stairs", "street", "trail", "transit", "portal"]);
  const ensureZone = (rawZoneName, opts) => {
    const cleanName = normalizeDisplayLabel(rawZoneName, false);
    const zid = slugifyKey(opts?.id ?? cleanName, "zone_main");
    const existing = next.mapZones[zid];
    const kind = opts?.kind && VALID_ZONE_KINDS.has(opts.kind) ? opts.kind : existing?.kind ?? (/\b(?:ship|deck|bay|bridge|station)\b/i.test(cleanName) ? "ship_deck" : /\b(?:district|quarter|ward|city|town|market)\b/i.test(cleanName) ? "district" : /\b(?:forest|valley|realm|kingdom|wild|coast)\b/i.test(cleanName) ? "region" : "building");
    const defaultIcon = kind === "ship_deck" ? "\uD83D\uDE80" : kind === "district" ? "\uD83C\uDF06" : kind === "region" ? "\uD83C\uDFD4\uFE0F" : kind === "realm" ? "\u2728" : "\uD83C\uDFDB\uFE0F";
    next.mapZones[zid] = {
      id: zid,
      name: existing ? pickBetterCasedLabel(existing.name, rawZoneName, false) : cleanName || "Local Area",
      kind,
      icon: opts?.icon?.trim().slice(0, 8) || existing?.icon || defaultIcon,
      color: opts?.color?.trim() || existing?.color || ZONE_PALETTE[Object.keys(next.mapZones).length % ZONE_PALETTE.length],
      description: opts?.description?.trim() ? cleanStringValue(opts.description) : existing?.description || ""
    };
    return zid;
  };
  const upsertPathEdge = (raw) => {
    if (!raw.fromId || !raw.toId || raw.fromId === raw.toId)
      return;
    if (!next.places[raw.fromId] || !next.places[raw.toId])
      return;
    const [a, b] = [raw.fromId, raw.toId].sort();
    const edgeId = `${a}__${b}`;
    const existingIdx = next.mapPaths.findIndex((e) => e.id === edgeId);
    const prev = existingIdx >= 0 ? next.mapPaths[existingIdx] : undefined;
    const pType = raw.pathType && VALID_PATH_KINDS.has(raw.pathType) ? raw.pathType : prev?.pathType ?? (next.places[raw.fromId].zoneId === next.places[raw.toId].zoneId ? "door" : "street");
    const edge = {
      id: edgeId,
      fromId: a,
      toId: b,
      pathType: pType,
      ...raw.label?.trim() ? { label: cleanStringValue(raw.label) } : prev?.label ? { label: prev.label } : {},
      travelMinutes: Math.max(1, Math.round(Number(raw.travelMinutes ?? prev?.travelMinutes ?? next.places[raw.toId].travelMinutes ?? 5))),
      ...raw.locked !== undefined ? { locked: Boolean(raw.locked) } : prev?.locked ? { locked: prev.locked } : {}
    };
    if (existingIdx >= 0)
      next.mapPaths[existingIdx] = edge;
    else
      next.mapPaths.push(edge);
    if (!next.places[raw.fromId].connectedIds.includes(raw.toId)) {
      next.places[raw.fromId].connectedIds.push(raw.toId);
    }
    if (!next.places[raw.toId].connectedIds.includes(raw.fromId)) {
      next.places[raw.toId].connectedIds.push(raw.fromId);
    }
  };
  if (Array.isArray(patch.zones)) {
    for (const rz of patch.zones) {
      if (!rz?.name?.trim())
        continue;
      ensureZone(rz.name, {
        id: rz.id,
        kind: rz.kind,
        icon: rz.icon,
        color: rz.color,
        description: rz.description
      });
    }
  }
  if (next.scene.location) {
    const locParts = next.scene.location.split(/\s*(?:,|\u2014|\u2013|\|)\s*/).map((s) => s.trim()).filter(Boolean);
    const primaryName = normalizeDisplayLabel(locParts[0] || next.scene.location, false);
    const secondaryZoneName = locParts[1] || "";
    const placeId = slugifyKey(primaryName, "scene_location");
    const prevPlaceId = next.currentPlaceId;
    const inferredZoneId = secondaryZoneName ? ensureZone(secondaryZoneName) : next.places[placeId]?.zoneId ?? (prevPlaceId ? next.places[prevPlaceId]?.zoneId : undefined);
    if (!next.places[placeId]) {
      next.places[placeId] = {
        id: placeId,
        name: primaryName,
        category: "interior",
        ...inferredZoneId ? { zoneId: inferredZoneId } : {},
        icon: "\uD83D\uDCCD",
        description: next.scene.beatSummary || "Current scene location.",
        connectedIds: prevPlaceId && prevPlaceId !== placeId ? [prevPlaceId] : [],
        travelMinutes: 5,
        visited: true,
        atmosphere: next.scene.weather
      };
      touchedPlaceSet.add(placeId);
    } else {
      if (!next.places[placeId].visited) {
        next.places[placeId].visited = true;
        touchedPlaceSet.add(placeId);
      }
      if (!next.places[placeId].zoneId && inferredZoneId) {
        next.places[placeId].zoneId = inferredZoneId;
      }
    }
    if (prevPlaceId && prevPlaceId !== placeId && next.places[prevPlaceId]) {
      upsertPathEdge({ fromId: prevPlaceId, toId: placeId });
    }
    next.currentPlaceId = placeId;
    for (const actor of Object.values(next.characters)) {
      if (actor.present) {
        actor.locationId = placeId;
      }
    }
  }
  if (Array.isArray(patch.places)) {
    for (const rp of patch.places) {
      if (!rp?.name?.trim())
        continue;
      const pid = slugifyKey(rp.id ?? rp.name, "place");
      const existing = next.places[pid];
      const cleanName = pickBetterCasedLabel(existing?.name, rp.name, false);
      let resolvedZoneId = rp.zoneId?.trim() || existing?.zoneId;
      if (rp.zone?.trim()) {
        resolvedZoneId = ensureZone(rp.zone, { id: rp.zoneId });
      } else if (!resolvedZoneId && next.currentPlaceId && next.places[next.currentPlaceId]?.zoneId) {
        resolvedZoneId = next.places[next.currentPlaceId].zoneId;
      }
      const rawConns = (rp.connectedNames ?? []).map((n) => {
        const cleanConn = cleanStringValue(String(n));
        const byName = Object.values(next.places).find((p) => p.name.toLowerCase() === cleanConn.toLowerCase());
        return byName ? byName.id : slugifyKey(cleanConn, "");
      }).filter((cid) => cid && cid !== pid);
      if (rawConns.length === 0 && next.currentPlaceId && next.currentPlaceId !== pid && !Array.isArray(patch.paths)) {
        rawConns.push(next.currentPlaceId);
      }
      const mergedConns = [...new Set([...existing?.connectedIds ?? [], ...rawConns])];
      const cleanedTags = Array.isArray(rp.tags) ? [...new Set(rp.tags.map((t) => cleanStringValue(String(t))).filter(Boolean))].slice(0, 6) : existing?.tags;
      next.places[pid] = {
        id: pid,
        name: cleanName,
        category: rp.category ?? existing?.category ?? "venue",
        ...resolvedZoneId ? { zoneId: resolvedZoneId } : {},
        ...cleanedTags?.length ? { tags: cleanedTags } : {},
        icon: rp.icon?.trim().slice(0, 8) || existing?.icon || "\uD83C\uDFDB\uFE0F",
        description: rp.description?.trim() ? cleanStringValue(rp.description) : existing?.description || "Known location.",
        connectedIds: mergedConns,
        travelMinutes: Number(rp.travelMinutes ?? existing?.travelMinutes ?? 5),
        visited: existing?.visited ?? pid === next.currentPlaceId,
        atmosphere: rp.atmosphere?.trim() ? cleanStringValue(rp.atmosphere) : existing?.atmosphere || next.scene.weather,
        backdropUrl: existing?.backdropUrl,
        backdropImageId: existing?.backdropImageId,
        backdropVariants: existing?.backdropVariants
      };
      touchedPlaceSet.add(pid);
      for (const cid of mergedConns) {
        if (next.places[cid]) {
          upsertPathEdge({ fromId: pid, toId: cid, travelMinutes: next.places[pid].travelMinutes });
        }
      }
    }
  }
  if (Array.isArray(patch.paths)) {
    const resolvePlaceByRef = (ref) => {
      const clean = cleanStringValue(ref);
      const byExact = next.places[clean];
      if (byExact)
        return byExact.id;
      const byName = Object.values(next.places).find((p) => p.name.toLowerCase() === clean.toLowerCase());
      return byName ? byName.id : slugifyKey(clean, "");
    };
    for (const edgeInput of patch.paths) {
      if (!edgeInput?.from || !edgeInput?.to)
        continue;
      const fromId = resolvePlaceByRef(edgeInput.from);
      const toId = resolvePlaceByRef(edgeInput.to);
      upsertPathEdge({
        fromId,
        toId,
        pathType: edgeInput.pathType ?? edgeInput.type,
        label: edgeInput.label,
        travelMinutes: edgeInput.travelMinutes ?? edgeInput.mins,
        locked: edgeInput.locked
      });
    }
  }
  const placeIds = Object.keys(next.places);
  const anchorPlaceId = next.currentPlaceId || placeIds[0] || "";
  if (anchorPlaceId && next.places[anchorPlaceId]) {
    for (const p of Object.values(next.places)) {
      p.connectedIds = p.connectedIds.filter((cid) => cid !== p.id && Boolean(next.places[cid]));
      if (p.id !== anchorPlaceId && p.connectedIds.length === 0) {
        upsertPathEdge({ fromId: anchorPlaceId, toId: p.id, travelMinutes: p.travelMinutes });
      }
      for (const cid of p.connectedIds) {
        upsertPathEdge({ fromId: p.id, toId: cid, travelMinutes: p.travelMinutes });
      }
    }
  }
  if (Array.isArray(patch.quests)) {
    for (const rq of patch.quests) {
      if (!rq?.title?.trim())
        continue;
      const qid = slugifyKey(rq.id ?? rq.title, "quest");
      const existing = next.quests[qid];
      const cleanTitle = pickBetterCasedLabel(existing?.title, rq.title, false);
      next.quests[qid] = {
        id: qid,
        title: cleanTitle,
        summary: rq.summary?.trim() ? cleanStringValue(rq.summary) : existing?.summary || cleanTitle,
        status: rq.status ?? existing?.status ?? "active",
        objectives: Array.isArray(rq.objectives) ? rq.objectives.map((o, i) => ({
          id: `obj_${i + 1}`,
          text: cleanStringValue(String(o.text ?? "")),
          completed: Boolean(o.completed)
        })) : existing?.objectives ?? [{ id: "obj_1", text: cleanTitle, completed: false }]
      };
    }
  }
  if (Array.isArray(patch.dispatches)) {
    for (const rd of patch.dispatches) {
      if (!rd?.summary?.trim())
        continue;
      next.dispatches.push({
        id: `disp_${next.turnCount}_${next.dispatches.length + 1}`,
        turn: next.turnCount,
        minute: next.elapsedMinutes,
        title: rd.title?.trim() ? cleanStringValue(rd.title) : "Meanwhile\u2026",
        locationName: rd.locationName?.trim() ? cleanStringValue(rd.locationName) : "Elsewhere",
        summary: cleanStringValue(rd.summary),
        futureHook: rd.futureHook?.trim() ? cleanStringValue(rd.futureHook) : ""
      });
      if (next.dispatches.length > 30)
        next.dispatches.shift();
    }
  }
  recomputeDerivedStats(template.stats, next, template.categories ?? []);
  return {
    state: next,
    deltas: { statDeltas, characterDeltas },
    triggeredAlerts,
    touchedCharacterIds: [...touchedCharacterSet],
    touchedPlaceIds: [...touchedPlaceSet]
  };
}
function diffCampaignStates(before, after) {
  const statDeltas = {};
  const characterDeltas = {};
  for (const [id, cur] of Object.entries(after.stats)) {
    const prev = before.stats[id];
    if (typeof cur.value === "number") {
      const base = typeof prev?.value === "number" ? prev.value : 0;
      const d = Number((cur.value - base).toFixed(2));
      if (d !== 0)
        statDeltas[id] = d;
    }
  }
  for (const [cid, char] of Object.entries(after.characters)) {
    const prevChar = before.characters[cid];
    for (const [mk, mv] of Object.entries(char.meters)) {
      if (typeof mv.value === "number") {
        const prevVal = prevChar?.meters[mk]?.calibrated && typeof prevChar.meters[mk]?.value === "number" ? prevChar.meters[mk].value : 0;
        const d = Math.round(mv.value - prevVal);
        if (d !== 0) {
          (characterDeltas[cid] ??= {})[mk] = d;
        }
      }
    }
  }
  return { statDeltas, characterDeltas };
}

// src/shared/types.ts
var LUMI_STATS_CHANNEL = "lumi_stats/v1";
var LUMI_CHAT_VAR_JSON = "lumi_stats";
var LUMI_CHAT_VAR_HEADER = "lumi_header";
var LUMI_CHAT_VAR_CLOCK = "lumi_clock";
var LUMI_CHAT_VAR_LOCATION = "lumi_location";

// src/backend/grounding.ts
async function runWithConcurrency(items, limit, worker) {
  if (!items.length)
    return;
  let index = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const current = items[index++];
      await worker(current);
    }
  });
  await Promise.all(runners);
}
var GROUNDING_CACHE_TTL_MS = 60000;
var groundingCache = new Map;
function invalidateGroundingCache(chatId) {
  if (!chatId) {
    groundingCache.clear();
    return;
  }
  for (const key of groundingCache.keys()) {
    if (key.includes(`:${chatId}:`)) {
      groundingCache.delete(key);
    }
  }
}
async function readAuthoritativeGrounding(api, userId, chatId, options) {
  const ctx = {};
  if (!chatId || chatId === "sandbox")
    return ctx;
  const compact = options?.compact === true;
  const cacheKey = `${userId?.trim() || "__owner__"}:${chatId}:${compact ? "1" : "0"}`;
  const cached = groundingCache.get(cacheKey);
  if (cached && Date.now() - cached.at < GROUNDING_CACHE_TTL_MS) {
    return structuredClone(cached.ctx);
  }
  if (api.permissions.has("chats") && api.permissions.has("characters")) {
    try {
      const chat = await api.chats.get(chatId, userId);
      const card = chat?.character_id ? await api.characters.get(chat.character_id, userId) : null;
      if (card) {
        ctx.characterCard = {
          name: String(card.name ?? ""),
          description: String(card.description ?? "").slice(0, compact ? 1200 : 4000),
          personality: String(card.personality ?? "").slice(0, compact ? 800 : 2000),
          scenario: String(card.scenario ?? "").slice(0, compact ? 1000 : 2500),
          ...compact ? {} : { firstMessage: String(card.first_mes ?? "").slice(0, 3000) }
        };
      }
    } catch {}
  }
  if (api.permissions.has("personas")) {
    try {
      const persona = await api.personas.getActive(userId);
      if (persona) {
        ctx.persona = {
          name: String(persona.name ?? ""),
          description: String(persona.description ?? "").slice(0, compact ? 900 : 2500)
        };
      }
    } catch {}
  }
  if (!compact && api.permissions.has("chat_mutation")) {
    try {
      const messages = await api.chat.getMessages(chatId);
      const firstUser = messages.find((m) => m.role === "user" && m.content.trim().length > 0);
      if (firstUser) {
        ctx.openingUserMessage = stripInlineStatsTags(firstUser.content).slice(0, 4000);
      }
    } catch {}
  }
  if (groundingCache.size >= 40 && !groundingCache.has(cacheKey)) {
    const oldest = groundingCache.keys().next().value;
    if (oldest !== undefined)
      groundingCache.delete(oldest);
  }
  groundingCache.set(cacheKey, { at: Date.now(), ctx: structuredClone(ctx) });
  return ctx;
}
async function syncStateToMemoryCortex(api, userId, chatId, state, template, options) {
  if (!chatId || chatId === "sandbox" || !api.permissions.has("memories") || !api.memories) {
    return;
  }
  const memories = api.memories;
  const charFilter = options?.touchedCharacterIds ? new Set(options.touchedCharacterIds) : null;
  const placeFilter = options?.touchedPlaceIds ? new Set(options.touchedPlaceIds) : null;
  const targetActors = Object.values(state.characters).filter((a) => !charFilter || charFilter.has(a.id));
  const targetPlaces = Object.values(state.places).filter((p) => p.visited && (!placeFilter || placeFilter.has(p.id)));
  if (!targetActors.length && !targetPlaces.length)
    return;
  try {
    const playerName = state.player.name || "Player";
    if (targetActors.length > 0) {
      await memories.entities.upsert(chatId, { name: playerName, type: "character", aliases: ["User", "Protagonist"], confidence: 0.95 }, { userId });
    }
    const charSchemas = template.stats.filter((s) => s.scope === "character" && s.enabled);
    await runWithConcurrency(targetActors, 4, async (actor) => {
      const entity = await memories.entities.upsert(chatId, {
        name: actor.name,
        type: "character",
        aliases: actor.aliases,
        confidence: 0.92
      }, { userId });
      const facts = [];
      if (actor.roleSummary)
        facts.push(`Role: ${actor.roleSummary}`);
      if (actor.attire)
        facts.push(`Current attire: ${actor.attire}`);
      if (actor.immediateGoal)
        facts.push(`Current goal: ${actor.immediateGoal}`);
      for (const sec of actor.secrets.filter((s) => s.stage === "confirmed")) {
        facts.push(`${sec.title}: ${sec.detail}`);
      }
      if (facts.length > 0) {
        await memories.entities.addFacts(entity.id, facts.slice(0, 8), userId);
      }
      const meterSummary = [];
      let totalNormalized = 0;
      let count = 0;
      for (const schema of charSchemas) {
        const m = actor.meters[schema.id];
        if (m?.calibrated && typeof m.value === "number") {
          meterSummary.push(`${schema.label}: ${m.value}`);
          const span = Math.max(1, schema.max - schema.min);
          const norm = (m.value - schema.min) / span * 2 - 1;
          totalNormalized += norm;
          count++;
        }
      }
      if (meterSummary.length > 0) {
        const sentiment = count > 0 ? Number((totalNormalized / count).toFixed(2)) : 0;
        const relType = sentiment >= 0.25 ? "ally" : sentiment <= -0.25 ? "rival" : "custom";
        await memories.relations.upsert(chatId, {
          source: actor.name,
          target: playerName,
          type: relType,
          label: meterSummary.slice(0, 4).join(", "),
          sentiment: Math.max(-1, Math.min(1, sentiment))
        }, { userId });
      }
    });
    await runWithConcurrency(targetPlaces, 4, async (place) => {
      await memories.entities.upsert(chatId, {
        name: place.name,
        type: "location",
        aliases: [],
        confidence: 0.9
      }, { userId });
    });
  } catch {}
}
function evaluateWorldInfoStatGates(ctx, state) {
  const disabled = [];
  const forced = [];
  const ruleRe = /\[lumi:([a-zA-Z0-9_.-]+)\s*(>=|<=|==|!=|>|<|=)\s*([^\]]+)\]/gi;
  const resolveLeftValue = (path) => {
    const clean = path.trim();
    if (clean === "location")
      return slugifyKey(state.scene.location, "");
    if (clean === "turn")
      return state.turnCount;
    if (clean.includes(".")) {
      const [actorSlug, meterKey] = clean.split(".");
      const actor = state.characters[actorSlug] ?? Object.values(state.characters).find((c) => slugifyKey(c.name, "") === slugifyKey(actorSlug, ""));
      return actor?.meters[meterKey]?.value;
    }
    if (state.stats[clean] !== undefined) {
      return state.stats[clean].value;
    }
    const firstPresent = Object.values(state.characters).find((c) => c.present);
    return firstPresent?.meters[clean]?.value;
  };
  const compare = (actual, op, rawTarget) => {
    if (actual === undefined)
      return false;
    const targetTrimmed = rawTarget.trim();
    const actualNum = typeof actual === "number" ? actual : Number(actual);
    const targetNum = Number(targetTrimmed);
    if (Number.isFinite(actualNum) && Number.isFinite(targetNum)) {
      if (op === ">=")
        return actualNum >= targetNum;
      if (op === "<=")
        return actualNum <= targetNum;
      if (op === ">")
        return actualNum > targetNum;
      if (op === "<")
        return actualNum < targetNum;
      if (op === "!=")
        return actualNum !== targetNum;
      return actualNum === targetNum;
    }
    const aStr = slugifyKey(String(actual), "");
    const tStr = slugifyKey(targetTrimmed, "");
    return op === "!=" ? aStr !== tStr : aStr.includes(tStr) || aStr === tStr;
  };
  for (const entry of ctx.entries) {
    const comment = entry.comment || "";
    const matches = [...comment.matchAll(ruleRe)];
    if (!matches.length)
      continue;
    const allPassed = matches.every((m) => compare(resolveLeftValue(m[1]), m[2], m[3]));
    if (!allPassed) {
      disabled.push(entry.id);
    } else if (comment.includes("[lumi:force]")) {
      forced.push(entry.id);
    }
  }
  if (!disabled.length && !forced.length)
    return;
  return {
    ...disabled.length ? { disabled } : {},
    ...forced.length ? { forced } : {}
  };
}

// src/backend/storage.ts
var DEFAULT_USER_SETTINGS = Object.freeze({
  autoTrack: true,
  extractionMode: "sidecar",
  injectContinuity: true,
  tokenBudget: 450,
  protocolVerbosity: "compact",
  sidecarHistoryTurns: 4,
  sidecarMaxCharsPerMsg: 2500,
  defaultTemplateId: "universal_companion",
  extractorConnectionId: "",
  extractorModel: "",
  copilotConnectionId: "",
  copilotModel: "",
  cleanBraille: true,
  memoryCortexSync: false,
  worldInfoGating: true,
  thresholdToasts: true,
  debugInspector: false,
  ttsEnabled: true,
  ttsAutoPlayInStage: true,
  ttsReadMode: "dialogue_only",
  narratorConnectionId: "",
  narratorVoiceId: "",
  narratorModel: "",
  narratorSpeed: 1,
  vnShotMode: "waist",
  vnTransitionStyle: "cinematic",
  vnWeatherOverride: "",
  vnParallaxEnabled: true,
  vnAmbientLightEnabled: true,
  vnShowHudWidget: true,
  sensitiveObfuscatorEnabled: false,
  obfuscateVowelsWithOne: true,
  obfuscateOnSend: true,
  obfuscateOnOutput: false,
  restoreObfuscatedOnRender: true,
  includeCipherHint: false,
  sensitiveWords: []
});
var MAX_CHECKPOINTS = 25;
var MAX_CACHED_SCOPES = 50;

class LumiStorage {
  api;
  settingsCache = new Map;
  stateCache = new Map;
  checkpointCache = new Map;
  templateCache = new Map;
  explicitChatTemplates = new Set;
  continuityCache = new Map;
  dirsReady = new Set;
  queues = new Map;
  queueDepth = new Map;
  constructor(api) {
    this.api = api;
  }
  setBoundedCache(map, key, value, max = MAX_CACHED_SCOPES) {
    if (map.has(key))
      map.delete(key);
    else if (map.size >= max) {
      const oldest = map.keys().next().value;
      if (oldest !== undefined)
        map.delete(oldest);
    }
    map.set(key, value);
  }
  userKey(userId) {
    return userId?.trim() ? userId.trim() : "__owner__";
  }
  scopeKey(userId, chatId) {
    return `${this.userKey(userId)}:${chatId}`;
  }
  async ensureDirs(userId) {
    const uk = this.userKey(userId);
    if (this.dirsReady.has(uk))
      return;
    this.dirsReady.add(uk);
    for (const dir of ["configs", "state", "history", "copilot"]) {
      await this.api.userStorage.mkdir(dir, userId).catch(() => {
        return;
      });
    }
  }
  getCompiledContinuity(userId, chatId, revision, state, template, charBudget = 2400) {
    const key = this.scopeKey(userId, chatId);
    const cached = this.continuityCache.get(key);
    if (cached && cached.revision === revision && cached.templateUpdatedAt === template.updatedAt && cached.charBudget === charBudget) {
      return cached;
    }
    const compiled = compileNarratorContinuity(state, template, charBudget);
    const entry = {
      revision,
      templateUpdatedAt: template.updatedAt,
      charBudget,
      text: compiled.text,
      omittedCount: compiled.omittedCount
    };
    this.setBoundedCache(this.continuityCache, key, entry);
    return entry;
  }
  queue(userId, chatId, fn) {
    const key = this.scopeKey(userId, chatId);
    const depth = this.queueDepth.get(key) ?? 0;
    if (depth >= 16) {
      return Promise.reject(new Error("Too many queued Lumi Stats operations for this chat."));
    }
    this.queueDepth.set(key, depth + 1);
    const prev = this.queues.get(key) ?? Promise.resolve();
    const next = prev.catch(() => {
      return;
    }).then(fn);
    this.queues.set(key, next);
    next.finally(() => {
      const remaining = (this.queueDepth.get(key) ?? 1) - 1;
      if (remaining <= 0)
        this.queueDepth.delete(key);
      else
        this.queueDepth.set(key, remaining);
      if (this.queues.get(key) === next)
        this.queues.delete(key);
    }).catch(() => {
      return;
    });
    return next;
  }
  clearOwnerMirrorForChat(userId, chatId) {
    if (!chatId)
      return;
    if (!userId?.trim()) {
      const suffix = `:${chatId}`;
      for (const map of [
        this.templateCache,
        this.stateCache,
        this.checkpointCache,
        this.continuityCache
      ]) {
        for (const k of map.keys()) {
          if (k.endsWith(suffix))
            map.delete(k);
        }
      }
      for (const k of this.explicitChatTemplates) {
        if (k.endsWith(suffix))
          this.explicitChatTemplates.delete(k);
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
  getSettingsSync(userId) {
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
  async loadSettings(userId) {
    const uk = this.userKey(userId);
    const mem = this.settingsCache.get(uk);
    if (mem)
      return structuredClone(mem);
    const saved = await this.api.userStorage.getJson("settings.json", {
      fallback: {},
      userId
    });
    const merged = {
      ...DEFAULT_USER_SETTINGS,
      ...saved
    };
    this.settingsCache.set(uk, merged);
    return structuredClone(merged);
  }
  async saveSettings(userId, patch) {
    const current = await this.loadSettings(userId);
    const next = {
      ...current,
      ...patch
    };
    if (!userId?.trim()) {
      this.settingsCache.clear();
    } else {
      this.settingsCache.delete("__owner__");
    }
    this.settingsCache.set(this.userKey(userId), next);
    await this.api.userStorage.setJson("settings.json", next, { indent: 2, userId });
    return structuredClone(next);
  }
  async listCustomTemplates(userId) {
    const raw = await this.api.userStorage.getJson("templates.json", {
      fallback: [],
      userId
    });
    if (!Array.isArray(raw))
      return [];
    return raw.map((item) => normalizeImportedTemplate(item));
  }
  evictTemplateFromCache(userId, templateId) {
    const uk = this.userKey(userId);
    const prefix = `${uk}:`;
    for (const [key, tpl] of this.templateCache.entries()) {
      const matchesUser = uk === "__owner__" || key.startsWith(prefix) || key.startsWith("__owner__:");
      if (matchesUser && tpl.id === templateId) {
        this.templateCache.delete(key);
        this.explicitChatTemplates.delete(key);
        this.continuityCache.delete(key);
      }
    }
  }
  async upsertCustomTemplateInLibrary(userId, template) {
    return this.queue(userId, "__library__", async () => {
      await this.ensureDirs(userId);
      const list = await this.listCustomTemplates(userId);
      const normalized = normalizeImportedTemplate(template, template.name);
      if (BUILTIN_TEMPLATES.some((b) => b.id === normalized.id)) {
        normalized.id = `custom_${normalized.id}_${Date.now().toString(36).slice(-4)}`;
      }
      const existingIdx = list.findIndex((t) => t.id === normalized.id);
      if (existingIdx < 0) {
        const usedNames = new Set(list.map((t) => t.name.toLowerCase()));
        if (usedNames.has(normalized.name.toLowerCase())) {
          let suffix = 2;
          const baseName = normalized.name.slice(0, 74);
          while (usedNames.has(`${baseName} (${suffix})`.toLowerCase())) {
            suffix++;
          }
          normalized.name = `${baseName} (${suffix})`;
        }
      }
      const filtered = list.filter((t) => t.id !== normalized.id);
      const next = [...filtered, normalized].slice(-50);
      await this.api.userStorage.setJson("templates.json", next, { indent: 2, userId });
      this.evictTemplateFromCache(userId, normalized.id);
      return { library: next, saved: normalized };
    });
  }
  async saveCustomTemplateToLibrary(userId, template) {
    const { library } = await this.upsertCustomTemplateInLibrary(userId, template);
    return library;
  }
  async deleteCustomTemplateFromLibrary(userId, templateId) {
    return this.queue(userId, "__library__", async () => {
      await this.ensureDirs(userId);
      const list = await this.listCustomTemplates(userId);
      const next = list.filter((t) => t.id !== templateId);
      await this.api.userStorage.setJson("templates.json", next, { indent: 2, userId });
      this.evictTemplateFromCache(userId, templateId);
      return next;
    });
  }
  async loadChatTemplate(userId, chatId, presetDefaultTemplateId) {
    const key = this.scopeKey(userId, chatId);
    const presetPref = presetDefaultTemplateId?.trim();
    const cached = this.templateCache.get(key);
    if (cached && (!presetPref || this.explicitChatTemplates.has(key) || cached.id === presetPref)) {
      return structuredClone(cached);
    }
    await this.ensureDirs(userId);
    const saved = await this.api.userStorage.getJson(`configs/${encodeURIComponent(chatId)}.json`, { fallback: null, userId });
    let resolved;
    let isExplicit = false;
    if (saved && typeof saved === "object") {
      resolved = normalizeImportedTemplate(saved);
      isExplicit = true;
    }
    if (!resolved && chatId && chatId !== "sandbox" && this.api.permissions.has("chats") && this.api.permissions.has("characters")) {
      try {
        const chat = await this.api.chats.get(chatId, userId);
        const card = chat?.character_id ? await this.api.characters.get(chat.character_id, userId) : null;
        const extBag = card?.extensions?.lumi_stats;
        if (extBag?.template && typeof extBag.template === "object") {
          resolved = normalizeImportedTemplate(extBag.template);
          isExplicit = true;
        }
      } catch {}
    }
    if (!resolved) {
      const settings = await this.loadSettings(userId);
      const custom = await this.listCustomTemplates(userId);
      const preferredId = presetPref || settings.defaultTemplateId;
      resolved = custom.find((t) => t.id === preferredId) ?? BUILTIN_TEMPLATES.find((t) => t.id === preferredId) ?? custom.find((t) => t.id === settings.defaultTemplateId) ?? BUILTIN_TEMPLATES.find((t) => t.id === settings.defaultTemplateId) ?? createDefaultTemplate();
    }
    if (isExplicit)
      this.explicitChatTemplates.add(key);
    else
      this.explicitChatTemplates.delete(key);
    this.setBoundedCache(this.templateCache, key, structuredClone(resolved));
    return structuredClone(resolved);
  }
  async saveChatTemplate(userId, chatId, template) {
    await this.ensureDirs(userId);
    const normalized = normalizeImportedTemplate(template, template.name);
    this.clearOwnerMirrorForChat(userId, chatId);
    const key = this.scopeKey(userId, chatId);
    this.explicitChatTemplates.add(key);
    this.setBoundedCache(this.templateCache, key, structuredClone(normalized));
    this.continuityCache.delete(key);
    await this.api.userStorage.setJson(`configs/${encodeURIComponent(chatId)}.json`, normalized, { indent: 2, userId });
    return structuredClone(normalized);
  }
  async loadCheckpoints(userId, chatId) {
    if (!chatId || chatId === "sandbox")
      return [];
    const key = this.scopeKey(userId, chatId);
    const mem = this.checkpointCache.get(key);
    if (mem)
      return structuredClone(mem);
    await this.ensureDirs(userId);
    const file = await this.api.userStorage.getJson(`history/${encodeURIComponent(chatId)}.json`, { fallback: null, userId });
    const entries = Array.isArray(file?.entries) ? file.entries : [];
    this.setBoundedCache(this.checkpointCache, key, structuredClone(entries));
    return entries;
  }
  async saveCheckpoints(userId, chatId, entries) {
    if (!chatId || chatId === "sandbox")
      return;
    await this.ensureDirs(userId);
    const bounded = entries.slice(-MAX_CHECKPOINTS);
    this.setBoundedCache(this.checkpointCache, this.scopeKey(userId, chatId), structuredClone(bounded));
    await this.api.userStorage.setJson(`history/${encodeURIComponent(chatId)}.json`, { chatId, entries: bounded }, { userId });
  }
  getStateAndTemplateSync(userId, chatId) {
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
      revision: env?.revision ?? 0
    };
  }
  async syncNativeLumiverseSurfaces(userId, chatId, _revision, state, template, persistChatVars = true) {
    if (!chatId || chatId === "sandbox")
      return;
    const projection = buildChatVariableProjection(state, template);
    const banner = formatSceneBanner(state);
    const clock = formatStoryClock(state.elapsedMinutes);
    if (persistChatVars) {
      try {
        await Promise.all([
          this.api.variables.chat.set(chatId, LUMI_CHAT_VAR_JSON, JSON.stringify(projection)),
          this.api.variables.chat.set(chatId, LUMI_CHAT_VAR_HEADER, banner.formatted),
          this.api.variables.chat.set(chatId, LUMI_CHAT_VAR_CLOCK, clock),
          this.api.variables.chat.set(chatId, LUMI_CHAT_VAR_LOCATION, banner.location)
        ]);
      } catch {}
    }
    try {
      this.api.rpcPool?.sync("state.current", {
        chatId,
        updatedAt: Date.now(),
        ...projection
      }, { requires: [] });
    } catch {}
  }
  async loadCampaign(userId, chatId, options) {
    await this.ensureDirs(userId);
    const template = await this.loadChatTemplate(userId, chatId, options?.presetDefaultTemplateId);
    if (!chatId || chatId === "sandbox") {
      return {
        schemaVersion: 1,
        chatId: chatId || "sandbox",
        revision: 0,
        state: createEmptyCampaignState(template),
        template,
        deltas: { statDeltas: {}, characterDeltas: {} },
        bindings: [],
        checkpoints: []
      };
    }
    const key = this.scopeKey(userId, chatId);
    let env = this.stateCache.get(key);
    if (!env) {
      const disk = await this.api.userStorage.getJson(`state/${encodeURIComponent(chatId)}.json`, { fallback: null, userId });
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
        bindings: []
      };
    } else {
      env = structuredClone(env);
    }
    for (const def of template.stats) {
      if (!def.enabled || def.scope === "character")
        continue;
      if (!env.state.stats[def.id]) {
        env.state.stats[def.id] = {
          id: def.id,
          scope: def.scope,
          value: def.defaultValue,
          calibrated: false,
          locked: def.locked
        };
      }
    }
    const charSchemas = template.stats.filter((s) => s.enabled && s.scope === "character");
    for (const actor of Object.values(env.state.characters)) {
      for (const schema of charSchemas) {
        if (!actor.meters[schema.id]) {
          actor.meters[schema.id] = {
            value: schema.defaultValue,
            calibrated: false,
            locked: schema.locked
          };
        }
      }
    }
    if (!options?.skipChatVarReconcile) {
      try {
        const rawJsonVar = await this.api.variables.chat.get(chatId, LUMI_CHAT_VAR_JSON);
        if (rawJsonVar) {
          const parsedVar = JSON.parse(rawJsonVar);
          const varIsStale = typeof parsedVar?.turn === "number" && parsedVar.turn < env.state.turnCount;
          let reconciledAny = false;
          if (!varIsStale && parsedVar?.stats && typeof parsedVar.stats === "object") {
            for (const def of template.stats) {
              if (!def.enabled || def.scope === "character")
                continue;
              const v = parsedVar.stats[def.id];
              const cur = env.state.stats[def.id];
              if (v !== undefined && cur && cur.calibrated && cur.value !== v) {
                cur.value = v;
                reconciledAny = true;
              }
            }
          }
          if (!varIsStale && parsedVar?.actors && typeof parsedVar.actors === "object") {
            for (const [actorId, actorProj] of Object.entries(parsedVar.actors)) {
              const actor = env.state.characters[actorId];
              if (!actor || !actorProj?.meters)
                continue;
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
      } catch {}
    }
    const checkpoints = await this.loadCheckpoints(userId, chatId);
    const activeCp = checkpoints.filter((c) => !c.undone);
    const latestCp = activeCp.at(-1);
    const deltas = latestCp ? diffCampaignStates(latestCp.before, env.state) : { statDeltas: {}, characterDeltas: {} };
    return {
      schemaVersion: 1,
      chatId,
      revision: env.revision,
      state: env.state,
      template,
      deltas,
      bindings: env.bindings ?? [],
      checkpoints: checkpoints.slice(-25).reverse().map((c) => ({
        id: c.id,
        revision: c.revision,
        at: c.at,
        reason: c.reason,
        messageId: c.binding?.messageId,
        swipeId: c.binding?.swipeId
      }))
    };
  }
  async commitCampaign(userId, chatId, before, after, reason, binding, bindingsOverride) {
    const current = await this.loadCampaign(userId, chatId, { skipChatVarReconcile: true });
    if (!chatId || chatId === "sandbox")
      return current;
    await this.ensureDirs(userId);
    const nextRevision = current.revision + 1;
    const bindings = bindingsOverride ? [...bindingsOverride] : binding ? [...current.bindings.filter((b) => b.messageId !== binding.messageId), binding].slice(-120) : current.bindings;
    const env = {
      schemaVersion: 1,
      chatId,
      revision: nextRevision,
      state: after,
      bindings
    };
    this.clearOwnerMirrorForChat(userId, chatId);
    const key = this.scopeKey(userId, chatId);
    this.setBoundedCache(this.stateCache, key, structuredClone(env));
    this.continuityCache.delete(key);
    await this.api.userStorage.setJson(`state/${encodeURIComponent(chatId)}.json`, env, { userId });
    const slimAudit = (s) => ({
      ...s,
      auditLog: s.auditLog.slice(-15)
    });
    const checkpoints = await this.loadCheckpoints(userId, chatId);
    const record = {
      id: crypto.randomUUID(),
      revision: nextRevision,
      at: new Date().toISOString(),
      reason,
      ...binding ? { binding } : {},
      before: slimAudit(before),
      after: slimAudit(after)
    };
    const nextCheckpoints = [...checkpoints, record].slice(-MAX_CHECKPOINTS);
    await this.saveCheckpoints(userId, chatId, nextCheckpoints);
    await this.syncNativeLumiverseSurfaces(userId, chatId, nextRevision, after, current.template, true);
    return {
      schemaVersion: 1,
      chatId,
      revision: nextRevision,
      state: after,
      template: current.template,
      deltas: diffCampaignStates(before, after),
      bindings,
      checkpoints: nextCheckpoints.slice().reverse().map((c) => ({
        id: c.id,
        revision: c.revision,
        at: c.at,
        reason: c.reason,
        messageId: c.binding?.messageId,
        swipeId: c.binding?.swipeId
      }))
    };
  }
  preserveUserAssets(restored, current) {
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
  async previewRollbackBeforeMessage(userId, chatId, targetMessageId) {
    const current = await this.loadCampaign(userId, chatId);
    const checkpoints = await this.loadCheckpoints(userId, chatId);
    const targetId = targetMessageId || current.bindings.at(-1)?.messageId;
    if (!targetId)
      return current;
    const pivot = checkpoints.find((c) => !c.undone && c.binding?.messageId === targetId);
    if (!pivot)
      return current;
    return {
      ...current,
      state: this.preserveUserAssets(pivot.before, current.state)
    };
  }
  async rollbackBeforeMessage(userId, chatId, options) {
    const checkpoints = await this.loadCheckpoints(userId, chatId);
    if (!checkpoints.length)
      return null;
    const current = await this.loadCampaign(userId, chatId, { skipChatVarReconcile: true });
    let pivotIdx = -1;
    const hasExplicitTarget = Boolean(options.targetMessageId) || options.targetIndex !== undefined;
    const latestActiveCpIdx = checkpoints.findLastIndex((c) => !c.undone && Boolean(c.binding));
    for (let i = 0;i < checkpoints.length; i++) {
      const cp = checkpoints[i];
      if (cp.undone || !cp.binding)
        continue;
      const matchesId = Boolean(options.targetMessageId && cp.binding.messageId === options.targetMessageId);
      const afterIdx = options.targetIndex !== undefined && cp.binding.messageIndex >= options.targetIndex;
      const tailDeleted = !hasExplicitTarget && i === latestActiveCpIdx && Boolean(options.validMessageIds && !options.validMessageIds.has(cp.binding.messageId));
      if (matchesId || afterIdx || tailDeleted) {
        pivotIdx = i;
        break;
      }
    }
    if (pivotIdx < 0)
      return null;
    const pivot = checkpoints[pivotIdx];
    for (let i = pivotIdx;i < checkpoints.length; i++) {
      checkpoints[i].undone = true;
    }
    await this.saveCheckpoints(userId, chatId, checkpoints);
    const restored = this.preserveUserAssets(pivot.before, current.state);
    const keptBindings = current.bindings.filter((b) => {
      if (options.targetMessageId && b.messageId === options.targetMessageId)
        return false;
      if (options.targetIndex !== undefined && b.messageIndex >= options.targetIndex)
        return false;
      if (options.validMessageIds && !options.validMessageIds.has(b.messageId))
        return false;
      return true;
    });
    const nextRev = current.revision + 1;
    const env = {
      schemaVersion: 1,
      chatId,
      revision: nextRev,
      state: restored,
      bindings: keptBindings
    };
    this.clearOwnerMirrorForChat(userId, chatId);
    const key = this.scopeKey(userId, chatId);
    this.setBoundedCache(this.stateCache, key, structuredClone(env));
    this.continuityCache.delete(key);
    await this.api.userStorage.setJson(`state/${encodeURIComponent(chatId)}.json`, env, { userId });
    await this.syncNativeLumiverseSurfaces(userId, chatId, nextRev, restored, current.template, true);
    return this.loadCampaign(userId, chatId, { skipChatVarReconcile: true });
  }
  async undoLatest(userId, chatId) {
    const checkpoints = await this.loadCheckpoints(userId, chatId);
    const idx = checkpoints.findLastIndex((c) => !c.undone);
    if (idx < 0)
      throw new Error("No recorded change available to undo.");
    const target = checkpoints[idx];
    target.undone = true;
    await this.saveCheckpoints(userId, chatId, checkpoints);
    const current = await this.loadCampaign(userId, chatId, { skipChatVarReconcile: true });
    const keptBindings = target.binding ? current.bindings.filter((b) => b.messageId !== target.binding.messageId) : current.bindings;
    return this.commitCampaign(userId, chatId, current.state, this.preserveUserAssets(target.before, current.state), `Undo: ${target.reason}`, undefined, keptBindings);
  }
  async restoreCheckpoint(userId, chatId, checkpointId) {
    const checkpoints = await this.loadCheckpoints(userId, chatId);
    const foundIdx = checkpoints.findIndex((c) => c.id === checkpointId);
    if (foundIdx < 0)
      throw new Error("Checkpoint not found.");
    const found = checkpoints[foundIdx];
    for (let i = 0;i < checkpoints.length; i++) {
      checkpoints[i].undone = i > foundIdx;
    }
    await this.saveCheckpoints(userId, chatId, checkpoints);
    const current = await this.loadCampaign(userId, chatId, { skipChatVarReconcile: true });
    const maxMessageIndex = found.binding?.messageIndex;
    const keptBindings = maxMessageIndex !== undefined ? current.bindings.filter((b) => b.messageIndex <= maxMessageIndex) : current.bindings;
    return this.commitCampaign(userId, chatId, current.state, this.preserveUserAssets(found.after, current.state), `Restored revision ${found.revision}`, found.binding, keptBindings);
  }
}

// src/backend/tracker-engine.ts
async function sha256Hex(text) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}
function isAbortError(err) {
  if (!err || typeof err !== "object")
    return false;
  const e = err;
  return e.name === "AbortError" || e.code === 20 || typeof e.message === "string" && /aborted/i.test(e.message);
}
var MODEL_PLACEHOLDERS = new Set([
  "",
  "string",
  "model",
  "your-model-here",
  "null",
  "undefined"
]);
function sanitizeModelName(value) {
  if (typeof value !== "string")
    return;
  const trimmed = value.trim();
  return MODEL_PLACEHOLDERS.has(trimmed.toLowerCase()) ? undefined : trimmed;
}

class TrackerEngine {
  api;
  storage;
  emitToUser;
  inFlight = new Map;
  processedTurnKeys = new Set;
  debugRecords = new Map;
  proposals = new Map;
  constructor(api, storage, emitToUser) {
    this.api = api;
    this.storage = storage;
    this.emitToUser = emitToUser;
  }
  jobKey(userId, chatId) {
    return `${userId ?? "__owner__"}:${chatId}`;
  }
  isBusy(userId, chatId) {
    return this.inFlight.has(this.jobKey(userId, chatId));
  }
  cancelInFlight(userId, chatId) {
    const key = this.jobKey(userId, chatId);
    this.inFlight.get(key)?.abort();
    this.inFlight.delete(key);
  }
  getDebugRecord(userId, chatId) {
    return this.debugRecords.get(this.jobKey(userId, chatId)) ?? null;
  }
  clearDebugRecord(userId, chatId) {
    this.debugRecords.delete(this.jobKey(userId, chatId));
  }
  async readTranscript(chatId) {
    if (!chatId || chatId === "sandbox")
      return [];
    if (!this.api.permissions.has("chat_mutation")) {
      throw new Error('Enable the "chat_mutation" permission for Lumi Stats to read chat messages.');
    }
    return this.api.chat.getMessages(chatId);
  }
  async readRecentMessages(chatId, tail = 14) {
    const rows = await this.readTranscript(chatId);
    return rows.slice(-tail);
  }
  async buildBinding(msg, messageIndex) {
    const swipeId = typeof msg.swipe_id === "number" ? msg.swipe_id : 0;
    const contentHash = await sha256Hex(stripInlineStatsTags(msg.content));
    return { messageId: msg.id, swipeId, contentHash, messageIndex };
  }
  async invokeStructuredModel(userId, chatId, role, systemPrompt, contextPayload) {
    if (!this.api.permissions.has("generation")) {
      throw new Error('Enable the "generation" permission in the Extensions panel to run AI stat calibration.');
    }
    const baseKey = this.jobKey(userId, chatId);
    const key = role === "copilot" ? `${baseKey}:copilot` : baseKey;
    this.inFlight.get(key)?.abort();
    const controller = new AbortController;
    this.inFlight.set(key, controller);
    const timer = setTimeout(() => controller.abort(), 55000);
    this.emitToUser(userId, chatId, {
      type: "status",
      busy: true,
      text: role === "copilot" ? "Lumi Architect is analyzing\u2026" : "Calibrating scene & character stats\u2026"
    });
    try {
      const settings = await this.storage.loadSettings(userId);
      const explicitConnId = (role === "copilot" ? settings.copilotConnectionId : settings.extractorConnectionId).trim() || undefined;
      const explicitModel = sanitizeModelName(role === "copilot" ? settings.copilotModel : settings.extractorModel);
      let effectiveConnId = explicitConnId;
      let resolvedModel = explicitModel;
      let resolvedProvider;
      if ((explicitConnId || explicitModel || typeof this.api.generate.quiet !== "function") && this.api.connections?.list) {
        try {
          const conns = await this.api.connections.list(userId);
          const matched = explicitConnId ? conns.find((c) => c.id === explicitConnId) : conns.find((c) => c.is_default) ?? conns[0];
          if (matched) {
            effectiveConnId ||= matched.id || undefined;
            resolvedModel ||= sanitizeModelName(matched.model);
            resolvedProvider = matched.provider || undefined;
          }
        } catch {}
      }
      const messages = [
        {
          role: "system",
          content: `${systemPrompt}

IMPORTANT: Output ONLY a single valid JSON object. Do not wrap in conversational prose.`
        },
        {
          role: "user",
          content: JSON.stringify(contextPayload)
        }
      ];
      const parameters = {
        temperature: 0.2,
        max_tokens: 3000,
        ...resolvedModel ? { model: resolvedModel } : {}
      };
      let response;
      if (!explicitConnId && !explicitModel && typeof this.api.generate.quiet === "function") {
        response = await this.api.generate.quiet({
          type: "quiet",
          ...userId ? { userId } : {},
          messages,
          parameters,
          reasoning: { source: "off" },
          signal: controller.signal
        });
      } else {
        response = await this.api.generate.raw({
          type: "raw",
          connection_id: effectiveConnId,
          ...userId ? { userId } : {},
          ...resolvedProvider ? { provider: resolvedProvider } : {},
          ...resolvedModel ? { model: resolvedModel } : {},
          messages,
          parameters,
          reasoning: { source: "off" },
          signal: controller.signal
        });
      }
      const rawText = String(response?.content ?? "");
      const parsed = parseExtractedJson(rawText);
      return { parsed, rawText };
    } finally {
      clearTimeout(timer);
      if (this.inFlight.get(key) === controller) {
        this.inFlight.delete(key);
        this.emitToUser(userId, chatId, { type: "status", busy: false, text: "" });
      }
    }
  }
  async trackTurn(userId, chatId, options = {}) {
    if (!options.manual && this.isBusy(userId, chatId))
      return null;
    return this.storage.queue(userId, chatId, async () => {
      let allMessages = await this.readTranscript(chatId);
      if (!allMessages.length)
        return null;
      let targetIdx = options.targetMessageId ? allMessages.findIndex((m) => m.id === options.targetMessageId) : -1;
      if (targetIdx < 0 && options.targetMessageId) {
        await new Promise((r) => setTimeout(r, 200));
        allMessages = await this.readTranscript(chatId);
        targetIdx = allMessages.findIndex((m) => m.id === options.targetMessageId);
      }
      if (targetIdx < 0) {
        targetIdx = allMessages.findLastIndex((m) => m.role === "assistant" && m.content.trim().length > 0);
        if (targetIdx < 0)
          targetIdx = allMessages.length - 1;
      }
      const targetMsg = allMessages[targetIdx];
      if (!targetMsg || targetMsg.role === "system")
        return null;
      const binding = await this.buildBinding(targetMsg, targetIdx);
      const idempotencyKey = `${chatId}:${binding.messageId}:${binding.swipeId}:${binding.contentHash}`;
      if (!options.manual && this.processedTurnKeys.has(idempotencyKey)) {
        return null;
      }
      let snapshot = await this.storage.loadCampaign(userId, chatId);
      if (!options.manual && snapshot.bindings.some((b) => b.messageId === binding.messageId && b.swipeId === binding.swipeId && b.contentHash === binding.contentHash)) {
        this.processedTurnKeys.add(idempotencyKey);
        return null;
      }
      const validIds = new Set(allMessages.map((m) => m.id));
      const lastBinding = snapshot.bindings.at(-1);
      const needsRollback = snapshot.bindings.some((b) => b.messageId === binding.messageId || b.messageIndex >= binding.messageIndex) || Boolean(lastBinding && !validIds.has(lastBinding.messageId));
      if (needsRollback) {
        const rolled = await this.storage.rollbackBeforeMessage(userId, chatId, {
          targetMessageId: binding.messageId,
          targetIndex: binding.messageIndex,
          validMessageIds: validIds
        });
        if (rolled)
          snapshot = rolled;
      }
      const settings = await this.storage.loadSettings(userId);
      const template = snapshot.template;
      let patch = null;
      if (options.inlineTagContent) {
        try {
          patch = parseExtractedJson(options.inlineTagContent);
        } catch (err) {
          this.api.log.warn(`Malformed inline <lumi-stats> tag; falling back to sidecar extraction: ${err instanceof Error ? err.message : String(err)}`);
          patch = null;
        }
      }
      if (!patch) {
        patch = extractInlineStatsTag(targetMsg.content);
      }
      let rawDebugText = options.inlineTagContent || "";
      if (!patch && this.api.permissions.has("generation")) {
        const useCompactGrounding = snapshot.state.initialized && snapshot.state.turnCount >= 2;
        const grounding = useCompactGrounding ? {} : await readAuthoritativeGrounding(this.api, userId, chatId, { compact: false });
        const historyTurns = Math.max(2, Math.min(12, Math.round(settings.sidecarHistoryTurns ?? 4)));
        const maxMsgChars = Math.max(800, Math.min(6000, Math.round(settings.sidecarMaxCharsPerMsg ?? 2500)));
        const recentTranscript = allMessages.slice(Math.max(0, targetIdx - (historyTurns - 1)), targetIdx + 1).map((m) => ({
          id: m.id,
          role: m.role,
          content: stripInlineStatsTags(m.content).slice(0, maxMsgChars)
        }));
        const recentJoinedText = recentTranscript.map((m) => m.content).join(`
`);
        const leanCurrentState = buildLeanSidecarStateSnapshot(snapshot.state, template, recentJoinedText);
        const obfEnabled = Boolean(settings.sensitiveObfuscatorEnabled) && settings.obfuscateOnSend !== false && (settings.sensitiveWords?.length ?? 0) > 0;
        const obfWords = settings.sensitiveWords ?? [];
        const useOne = settings.obfuscateVowelsWithOne !== false;
        const obfText = (txt) => txt && obfEnabled ? obfuscateSensitiveWords(txt, obfWords, useOne) : txt;
        const safeCard = grounding.characterCard ? {
          name: grounding.characterCard.name,
          description: obfText(grounding.characterCard.description) ?? "",
          personality: obfText(grounding.characterCard.personality) ?? "",
          scenario: obfText(grounding.characterCard.scenario) ?? "",
          ...grounding.characterCard.firstMessage ? { firstMessage: obfText(grounding.characterCard.firstMessage) } : {}
        } : undefined;
        const safePersona = grounding.persona ? {
          name: grounding.persona.name,
          description: obfText(grounding.persona.description) ?? ""
        } : undefined;
        const safeTranscript = recentTranscript.map((m) => ({
          ...m,
          content: obfText(m.content) ?? m.content
        }));
        const sysPrompt = compileExtractorPrompt(snapshot.state, template, recentJoinedText, {
          verbosity: settings.protocolVerbosity ?? "compact"
        });
        const canonSetupAndCardGrounding = {};
        if (snapshot.state.canonPremise) {
          canonSetupAndCardGrounding.canonPremise = obfText(snapshot.state.canonPremise);
        }
        if (safeCard)
          canonSetupAndCardGrounding.characterCard = safeCard;
        if (safePersona)
          canonSetupAndCardGrounding.activePersona = safePersona;
        if (grounding.openingUserMessage) {
          canonSetupAndCardGrounding.openingUserMessage = obfText(grounding.openingUserMessage);
        }
        const { parsed, rawText } = await this.invokeStructuredModel(userId, chatId, "extractor", sysPrompt, {
          ...Object.keys(canonSetupAndCardGrounding).length ? { canonSetupAndCardGrounding } : {},
          currentState: leanCurrentState,
          recentMessagesToEvaluate: safeTranscript
        });
        patch = parsed;
        rawDebugText = rawText;
      }
      if (!patch)
        return null;
      const latestAll = await this.readTranscript(chatId);
      const latestIdx = latestAll.findIndex((m) => m.id === targetMsg.id);
      const latestTarget = latestIdx >= 0 ? latestAll[latestIdx] : undefined;
      if (latestTarget) {
        const latestBinding = await this.buildBinding(latestTarget, latestIdx);
        if (latestBinding.swipeId !== binding.swipeId || latestBinding.contentHash !== binding.contentHash) {
          return null;
        }
      }
      const reduced = applyTurnPatch(snapshot.state, template, patch, {
        incrementTurn: targetMsg.role === "assistant"
      });
      await this.linkCardPortraitIfAvailable(userId, chatId, reduced.state);
      this.processedTurnKeys.add(idempotencyKey);
      if (this.processedTurnKeys.size > 400) {
        const oldest = this.processedTurnKeys.values().next().value;
        if (oldest)
          this.processedTurnKeys.delete(oldest);
      }
      const committed = await this.storage.commitCampaign(userId, chatId, snapshot.state, reduced.state, snapshot.state.initialized ? "Tracked story turn" : "Calibrated initial world & character stats", binding);
      if (settings.debugInspector) {
        const dbgKey = this.jobKey(userId, chatId);
        if (!this.debugRecords.has(dbgKey) && this.debugRecords.size >= 30) {
          const oldestDbg = this.debugRecords.keys().next().value;
          if (oldestDbg !== undefined)
            this.debugRecords.delete(oldestDbg);
        }
        this.debugRecords.set(dbgKey, {
          at: new Date().toISOString(),
          messageId: targetMsg.id,
          rawOutput: rawDebugText.slice(0, 32000),
          parsedPatch: patch,
          appliedDeltas: reduced.deltas
        });
      }
      if (settings.thresholdToasts && reduced.triggeredAlerts.length > 0) {
        for (const alertMsg of reduced.triggeredAlerts.slice(0, 3)) {
          this.api.toast.info(alertMsg, {
            title: "Stat Threshold Reached",
            ...userId ? { userId } : {}
          });
        }
      }
      if (settings.memoryCortexSync) {
        syncStateToMemoryCortex(this.api, userId, chatId, reduced.state, template, {
          touchedCharacterIds: reduced.touchedCharacterIds,
          touchedPlaceIds: reduced.touchedPlaceIds
        });
      }
      return committed;
    });
  }
  async reconcileMessageChange(userId, chatId, changedMessageId) {
    this.cancelInFlight(userId, chatId);
    return this.storage.queue(userId, chatId, async () => {
      const snapshot = await this.storage.loadCampaign(userId, chatId);
      const messages = await this.readTranscript(chatId);
      const validIds = new Set(messages.map((m) => m.id));
      const checkpoints = await this.storage.loadCheckpoints(userId, chatId);
      const targetMsg = changedMessageId ? messages.find((m) => m.id === changedMessageId) : messages.findLast((m) => m.role === "assistant");
      const latestAssistantIdx = messages.findLastIndex((m) => m.role === "assistant" && m.content.trim().length > 0);
      const maxBoundIndex = snapshot.bindings.reduce((max, b) => Math.max(max, b.messageIndex), -1);
      if (targetMsg && targetMsg.content.trim()) {
        const idx = messages.indexOf(targetMsg);
        if (idx < maxBoundIndex && idx < latestAssistantIdx) {
          return null;
        }
        const nowBinding = await this.buildBinding(targetMsg, idx);
        const exactMatch = checkpoints.findLast((c) => !c.undone && c.binding?.messageId === nowBinding.messageId && c.binding?.swipeId === nowBinding.swipeId && c.binding?.contentHash === nowBinding.contentHash);
        if (exactMatch) {
          const restored = this.storage.preserveUserAssets(exactMatch.after, snapshot.state);
          return this.storage.commitCampaign(userId, chatId, snapshot.state, restored, `Restored swipe #${nowBinding.swipeId + 1} state`, nowBinding);
        }
        const inlinePatch = extractInlineStatsTag(targetMsg.content);
        if (inlinePatch) {
          const rolled = await this.storage.rollbackBeforeMessage(userId, chatId, {
            targetMessageId: targetMsg.id,
            targetIndex: idx,
            validMessageIds: validIds
          });
          const baseBefore = rolled ? rolled.state : snapshot.state;
          const reduced = applyTurnPatch(baseBefore, snapshot.template, inlinePatch, {
            incrementTurn: true
          });
          return this.storage.commitCampaign(userId, chatId, baseBefore, reduced.state, "Synced state from swipe/edit tag", nowBinding);
        }
        return null;
      }
      const latestBound = snapshot.bindings.at(-1);
      if (changedMessageId && latestBound && latestBound.messageId !== changedMessageId && validIds.has(latestBound.messageId)) {
        return null;
      }
      return this.storage.rollbackBeforeMessage(userId, chatId, {
        targetMessageId: changedMessageId,
        validMessageIds: validIds
      });
    });
  }
  async linkCardPortraitIfAvailable(userId, chatId, state) {
    if (!chatId || chatId === "sandbox")
      return;
    if (!this.api.permissions.has("chats") || !this.api.permissions.has("characters"))
      return;
    try {
      const chat = await this.api.chats.get(chatId, userId);
      const card = chat?.character_id ? await this.api.characters.get(chat.character_id, userId) : null;
      if (!card?.image_id || !card.name)
        return;
      const chars = Object.values(state.characters);
      const matched = chars.find((c) => c.name.toLowerCase() === card.name.toLowerCase()) ?? (chars.length === 1 ? chars[0] : undefined);
      if (matched && !matched.portraitUrl) {
        matched.portraitAssetId = card.image_id;
        matched.portraitUrl = `/api/v1/images/${card.image_id}`;
      }
    } catch {}
  }
  async runSandboxRuleTest(userId, chatId, payload) {
    const snapshot = await this.storage.loadCampaign(userId, chatId || "sandbox");
    const testState = structuredClone(snapshot.state);
    if (Object.keys(testState.characters).length === 0) {
      testState.characters["sample_npc"] = {
        id: "sample_npc",
        name: "Sample Companion",
        aliases: [],
        roleSummary: "Devoted companion in scene",
        present: true,
        locationId: testState.currentPlaceId,
        demeanor: "Attentive",
        innerThought: "Observing the player.",
        immediateGoal: "Respond to the scene beat",
        attire: "Standard attire",
        fields: {},
        meters: {},
        peerBonds: {},
        conditions: [],
        secrets: [],
        expressionAssets: {},
        notes: ""
      };
    }
    const prompt = [
      compileExtractorPrompt(testState, snapshot.template),
      payload.scenarioText?.trim() ? `Evaluate this exact test scenario: "${payload.scenarioText.trim()}"` : `Invent a 2-sentence roleplay beat ("testBeat") that tests "${payload.statId || "all configured stats"}" and include your updates.`
    ].join(`

`);
    const { parsed, rawText } = await this.invokeStructuredModel(userId, chatId || "sandbox", "extractor", prompt, { testScenario: payload.scenarioText || "Generate a test beat", currentState: buildLeanSidecarStateSnapshot(testState, snapshot.template) });
    const reduced = applyTurnPatch(testState, snapshot.template, parsed);
    return {
      testBeat: String(parsed.testBeat ?? payload.scenarioText ?? reduced.state.scene.beatSummary ?? "Evaluated test scenario."),
      statDeltas: reduced.deltas.statDeltas,
      characterDeltas: reduced.deltas.characterDeltas,
      auditEntries: reduced.state.auditLog.slice(-8),
      rawOutput: rawText
    };
  }
  async consultCopilot(userId, chatId, userPrompt, mode = "ask") {
    const snapshot = await this.storage.loadCampaign(userId, chatId);
    const history = await this.storage.api.userStorage.getJson(`copilot/${encodeURIComponent(chatId)}.json`, { fallback: [], userId });
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
      `      "icon": "\uD83D\uDD25",`,
      `      "scope": "character|player|world|scene",`,
      `      "kind": "meter|number|clock|pips|tier|tags|text|boolean",`,
      `      "min": 0,`,
      `      "max": 100,`,
      `      "volatility": "momentary|progressive|anchor",`,
      `      "triggerCues": "Clear cues for calibration and situational shifts"`,
      `    }`,
      `  ]`,
      `}`
    ].join(`
`);
    const { parsed } = await this.invokeStructuredModel(userId, chatId, "copilot", sysPrompt, {
      mode,
      userRequest: userPrompt,
      currentState: buildLeanSidecarStateSnapshot(snapshot.state, snapshot.template),
      templateStats: snapshot.template.stats,
      recentHistory: history.slice(-6)
    });
    const reply = String(parsed.reply ?? "Completed analysis.").trim();
    const summaries = Array.isArray(parsed.summaries) ? parsed.summaries.map(String) : [];
    let nextTemplate;
    if (Array.isArray(parsed.addStats) && parsed.addStats.length > 0) {
      nextTemplate = structuredClone(snapshot.template);
      for (const rawStat of parsed.addStats) {
        if (!rawStat || typeof rawStat !== "object")
          continue;
        const created = createStatSchema(rawStat);
        const idx = nextTemplate.stats.findIndex((s) => s.id === created.id);
        if (idx >= 0)
          nextTemplate.stats[idx] = created;
        else
          nextTemplate.stats.push(created);
        summaries.push(`Add ${created.scope} stat "${created.icon} ${created.label}" (${created.volatility})`);
      }
    }
    const statePatch = parsed.statePatch && typeof parsed.statePatch === "object" ? parsed.statePatch : undefined;
    let proposal;
    if (nextTemplate || statePatch) {
      proposal = {
        id: crypto.randomUUID(),
        chatId,
        revision: snapshot.revision,
        summaries: summaries.length ? summaries : ["Apply Copilot adjustments"],
        statePatch,
        templatePatch: nextTemplate
      };
      if (this.proposals.size >= 50) {
        const oldestProp = this.proposals.keys().next().value;
        if (oldestProp !== undefined)
          this.proposals.delete(oldestProp);
      }
      this.proposals.set(`${userId ?? "__owner__"}:${proposal.id}`, proposal);
    }
    const now = new Date().toISOString();
    const nextTurns = [
      ...history,
      { role: "user", text: userPrompt, at: now },
      { role: "assistant", text: reply, at: now }
    ].slice(-40);
    await this.storage.api.userStorage.setJson(`copilot/${encodeURIComponent(chatId)}.json`, nextTurns, { userId });
    return { reply, turns: nextTurns, proposal };
  }
  getProposal(userId, proposalId) {
    return this.proposals.get(`${userId ?? "__owner__"}:${proposalId}`);
  }
  deleteProposal(userId, proposalId) {
    this.proposals.delete(`${userId ?? "__owner__"}:${proposalId}`);
  }
  async compileRuleToLocalFormula(userId, chatId, payload) {
    const snapshot = await this.storage.loadCampaign(userId, chatId || "sandbox");
    const availableVars = snapshot.template.stats.filter((s) => s.enabled).map((s) => {
      const liveSample = s.scope === "character" ? Object.values(snapshot.state.characters)[0]?.meters[s.id]?.value : snapshot.state.stats[s.id]?.value;
      return `${s.id} (${s.scope}, current/sample: "${String(liveSample ?? s.defaultValue)}")`;
    });
    const sysPrompt = [
      `Convert the user's plain-English stat rule into a universal Lumi Stats local formula.`,
      `You may output EITHER:`,
      `Option A \u2014 Semicolon-separated math assignments ("; ") + optional outputTemplate:`,
      `  - Operators: + - * / % < <= > >= == != && || ! ? :`,
      `  - Functions: round(x), floor(x), ceil(x), abs(x), min(...), max(...), clamp(x,lo,hi), if(cond,a,b), hasCond("a|b"), match(conditions,"a|b")`,
      `  - Variables: any stat ID or auto-extracted sub-token (e.g. from "Key 10/20" -> Key, Key_max; from "X45" -> X; or [stat_id.sub])`,
      `  - outputTemplate: e.g. "Label {varA} | Other {varB}" (empty if single numeric output)`,
      `Option B \u2014 Single-line Lumiverse Macro Template (leave outputTemplate empty):`,
      `  - Uses {{.var}}, {{.var = ...}}, {{calc::...}}, {{round::...}}, {{floor::...}}, {{min::...}}, {{max::...}}, {{if::...}}...{{elseif::...}}...{{else}}...{{/if}}, {{matches::{{.conditions}}::pat::i}}.`,
      `CRITICAL RULES:`,
      `1. Keep "formula" valid inside JSON (use "; " instead of raw newlines, escape quotes properly). NEVER leave English prose in "formula".`,
      `2. If the rule specifies a text format (e.g. "Format strictly Lv<0-10> (<0-99>%) | P<0-100> A<0-100> I<0-100>" or "HP <cur>/<max>"), you MUST return the matching "outputTemplate" using the exact {var} names from "formula" (e.g. "Lv{final_lv} ({final_pct}%) | P{final_p} A{final_a} I{final_i}").`,
      `3. Set "suggestedMode": "ai_plus_local" if the AI still needs to initialize/change inputs on this stat (like P/A/I, XP %, HP damage), or "local_formula" if all inputs come strictly from OTHER stats (0 AI tokens).`,
      `Return ONLY JSON: { "formula": "...", "outputTemplate": "...", "suggestedMode": "ai_plus_local|local_formula", "explanation": "Short summary" }`
    ].join(`
`);
    const { parsed } = await this.invokeStructuredModel(userId, chatId || "sandbox", "copilot", sysPrompt, {
      statLabel: payload.statLabel,
      scope: payload.scope,
      ruleText: payload.ruleText,
      availableStats: availableVars
    });
    const rawFormula = String(parsed.formula ?? "").trim();
    if (!rawFormula) {
      throw new Error("The AI model returned an empty formula. Check your connection/model in Studio \u2192 6. AI & Connections.");
    }
    const formattedFormula = rawFormula.includes("{{") ? rawFormula : rawFormula.split(/\s*;\s*/).filter(Boolean).join(`
`);
    return {
      formula: formattedFormula,
      outputTemplate: String(parsed.outputTemplate ?? "").trim(),
      suggestedMode: parsed.suggestedMode === "ai_plus_local" ? "ai_plus_local" : "local_formula",
      explanation: String(parsed.explanation ?? "Converted rule to local formula.").trim()
    };
  }
}

// src/backend/service.ts
class LumiStatsService {
  api;
  storage;
  tracker;
  renderCache = new RenderProseCache(200);
  selfEditedMessages = new Set;
  activeGenerations = new Map;
  lastActiveChatByUser = new Map;
  chatOwnerMap = new Map;
  lastKnownUserId;
  disposers = [];
  stopped = false;
  constructor(api) {
    this.api = api;
    this.storage = new LumiStorage(api);
    this.tracker = new TrackerEngine(api, this.storage, (u, c, p) => this.emitToUser(u, c, p));
  }
  clearActiveChat(userId) {
    const cleanUser = userId?.trim();
    this.lastActiveChatByUser.delete(cleanUser || "__owner__");
    if (!cleanUser)
      this.lastActiveChatByUser.delete("__owner__");
  }
  rememberActiveChat(userId, chatId) {
    const cleanUser = userId?.trim();
    if (cleanUser)
      this.lastKnownUserId = cleanUser;
    const trimmed = typeof chatId === "string" ? chatId.trim() : "";
    if (!trimmed || trimmed === "sandbox")
      return;
    this.lastActiveChatByUser.set(cleanUser || "__owner__", trimmed);
    if (cleanUser) {
      if (this.chatOwnerMap.size >= 200 && !this.chatOwnerMap.has(trimmed)) {
        const oldest = this.chatOwnerMap.keys().next().value;
        if (oldest !== undefined)
          this.chatOwnerMap.delete(oldest);
      }
      this.chatOwnerMap.set(trimmed, cleanUser);
    }
  }
  resolveUserId(userId, chatId) {
    const cleanUser = userId?.trim();
    if (cleanUser)
      return cleanUser;
    const cleanChat = chatId?.trim();
    if (cleanChat && this.chatOwnerMap.has(cleanChat)) {
      return this.chatOwnerMap.get(cleanChat);
    }
    return this.lastKnownUserId;
  }
  async resolveEffectiveChatId(userId, requestedChatId) {
    const clean = requestedChatId.trim();
    const resolvedUser = this.resolveUserId(userId, clean);
    if (clean && clean !== "sandbox") {
      this.rememberActiveChat(resolvedUser, clean);
      return clean;
    }
    if (this.api.permissions.has("chats")) {
      try {
        const active = await this.api.chats.getActive(resolvedUser);
        if (active?.id) {
          this.rememberActiveChat(resolvedUser, active.id);
          return active.id;
        }
      } catch {}
    }
    return this.lastActiveChatByUser.get(resolvedUser || "__owner__") ?? (clean || "sandbox");
  }
  emitToUser(userId, chatId, payload, frontendSessionId) {
    if (this.stopped)
      return;
    const resolvedUser = this.resolveUserId(userId, chatId);
    this.api.sendToFrontend({ channel: LUMI_STATS_CHANNEL, chatId, ...payload }, resolvedUser, frontendSessionId ? { frontendSessionId } : undefined);
  }
  async broadcastSnapshot(userId, chatId, frontendSessionId) {
    const effectiveChatId = chatId || "sandbox";
    const resolvedUser = this.resolveUserId(userId, effectiveChatId);
    const [snapshot, settings, customTemplates, copilotTurns] = await Promise.all([
      this.storage.loadCampaign(resolvedUser, effectiveChatId),
      this.storage.loadSettings(resolvedUser),
      this.storage.listCustomTemplates(resolvedUser),
      effectiveChatId !== "sandbox" ? this.api.userStorage.getJson(`copilot/${encodeURIComponent(effectiveChatId)}.json`, { fallback: [], userId: resolvedUser }) : Promise.resolve([])
    ]);
    this.emitToUser(resolvedUser, effectiveChatId, {
      type: "snapshot",
      resolvedChatId: effectiveChatId !== "sandbox" ? effectiveChatId : "",
      snapshot,
      settings,
      customTemplates,
      builtinTemplates: BUILTIN_TEMPLATES,
      copilotTurns,
      busy: this.tracker.isBusy(resolvedUser, effectiveChatId)
    }, frontendSessionId);
  }
  reconcileStateWithTemplate(nextState, template, statRenames = []) {
    for (const rename of statRenames) {
      const fromId = rename?.fromId?.trim();
      const toId = rename?.toId?.trim();
      if (!fromId || !toId || fromId === toId)
        continue;
      if (nextState.stats[fromId] && !nextState.stats[toId]) {
        nextState.stats[toId] = { ...nextState.stats[fromId], id: toId };
      }
      delete nextState.stats[fromId];
      for (const actor of Object.values(nextState.characters)) {
        if (actor.meters[fromId] && !actor.meters[toId]) {
          actor.meters[toId] = { ...actor.meters[fromId] };
        }
        delete actor.meters[fromId];
      }
      for (const mod of nextState.modifiers) {
        if (mod.statId === fromId)
          mod.statId = toId;
      }
      for (const entry of nextState.auditLog) {
        if (entry.statId === fromId)
          entry.statId = toId;
      }
    }
    const activeNonCharIds = new Set(template.stats.filter((s) => s.scope !== "character").map((s) => s.id));
    const activeCharIds = new Set(template.stats.filter((s) => s.scope === "character").map((s) => s.id));
    for (const key of Object.keys(nextState.stats)) {
      if (!activeNonCharIds.has(key))
        delete nextState.stats[key];
    }
    for (const actor of Object.values(nextState.characters)) {
      for (const key of Object.keys(actor.meters)) {
        if (!activeCharIds.has(key))
          delete actor.meters[key];
      }
    }
    for (const def of template.stats) {
      if (!def.enabled)
        continue;
      const isTextDef = def.kind === "text" || def.kind === "tags" || def.kind === "tier" || def.kind === "skill_tree" || def.kind === "xp_level" || def.kind === "attributes" || def.kind === "inventory" || def.kind === "status_fx" || Boolean(def.displayStyle && def.displayStyle !== "auto");
      if (def.scope === "character") {
        for (const actor of Object.values(nextState.characters)) {
          const curM = actor.meters[def.id];
          if (!curM) {
            actor.meters[def.id] = {
              value: def.defaultValue,
              calibrated: false,
              locked: def.locked
            };
          } else if (isTextDef && typeof curM.value === "number") {
            curM.value = typeof def.defaultValue === "string" ? def.defaultValue : String(curM.value);
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
          locked: def.locked
        };
      } else {
        existing.scope = def.scope;
        existing.locked = def.locked;
        if (isTextDef && typeof existing.value === "number") {
          existing.value = typeof def.defaultValue === "string" ? def.defaultValue : String(existing.value);
        } else if (!isTextDef && typeof existing.value === "number") {
          existing.value = Math.max(def.min, Math.min(def.max, existing.value));
        }
      }
    }
  }
  async syncCampaignStatsToTemplate(userId, chatId, template, reason) {
    if (!chatId || chatId === "sandbox")
      return;
    const resolvedUser = this.resolveUserId(userId, chatId);
    await this.storage.queue(resolvedUser, chatId, async () => {
      const snap = await this.storage.loadCampaign(resolvedUser, chatId);
      const nextState = structuredClone(snap.state);
      this.reconcileStateWithTemplate(nextState, template);
      recomputeDerivedStats(template.stats, nextState, template.categories ?? []);
      await this.storage.commitCampaign(resolvedUser, chatId, snap.state, nextState, reason);
    });
  }
  async rehydrateChatMessages(userId, chatId) {
    if (!chatId || chatId === "sandbox" || !this.api.permissions.has("chat_mutation"))
      return;
    const resolvedUser = this.resolveUserId(userId, chatId);
    try {
      const untrackedAssistantId = await this.storage.queue(resolvedUser, chatId, async () => {
        const snap = await this.storage.loadCampaign(resolvedUser, chatId);
        const allRows = await this.api.chat.getMessages(chatId);
        const rows = allRows.slice(-40);
        const indexOffset = Math.max(0, allRows.length - rows.length);
        if (!rows.length)
          return;
        const boundMap = new Map(snap.bindings.map((b) => [b.messageId, b]));
        const maxBoundIndex = snap.bindings.reduce((max, b) => Math.max(max, b.messageIndex), -1);
        let stateCursor = structuredClone(snap.state);
        const nextBindings = [...snap.bindings];
        let appliedAnyTag = false;
        for (let i = 0;i < rows.length; i++) {
          const msg = rows[i];
          if (msg.role !== "assistant" || typeof msg.content !== "string")
            continue;
          const tagPatch = extractInlineStatsTag(msg.content);
          if (!tagPatch)
            continue;
          const msgIndex = indexOffset + i;
          const swipeId = typeof msg.swipe_id === "number" ? msg.swipe_id : 0;
          const contentHash = await sha256Hex(stripInlineStatsTags(msg.content));
          const prevBinding = boundMap.get(msg.id);
          if (snap.state.initialized && msgIndex < maxBoundIndex) {
            continue;
          }
          if (prevBinding && prevBinding.contentHash === contentHash && snap.state.initialized) {
            if (prevBinding.swipeId !== swipeId) {
              prevBinding.swipeId = swipeId;
            }
            continue;
          }
          stateCursor = applyTurnPatch(stateCursor, snap.template, tagPatch, {
            incrementTurn: true
          }).state;
          const binding = {
            messageId: msg.id,
            swipeId,
            contentHash,
            messageIndex: msgIndex
          };
          const existingIdx = nextBindings.findIndex((b) => b.messageId === msg.id);
          if (existingIdx >= 0)
            nextBindings[existingIdx] = binding;
          else
            nextBindings.push(binding);
          boundMap.set(msg.id, binding);
          appliedAnyTag = true;
        }
        if (appliedAnyTag) {
          await this.storage.commitCampaign(resolvedUser, chatId, snap.state, stateCursor, "Rehydrated stats from chat message tags", undefined, nextBindings.slice(-120));
          return;
        }
        const latestAssistant = rows.findLast((m) => m.role === "assistant" && m.content.trim().length > 0);
        return latestAssistant && !boundMap.has(latestAssistant.id) ? latestAssistant.id : undefined;
      });
      if (untrackedAssistantId) {
        const settings = await this.storage.loadSettings(resolvedUser);
        if (settings.autoTrack && this.api.permissions.has("generation") && !this.tracker.isBusy(resolvedUser, chatId)) {
          this.tracker.trackTurn(resolvedUser, chatId, { targetMessageId: untrackedAssistantId }).then((updated) => {
            if (updated)
              return this.broadcastSnapshot(resolvedUser, chatId);
          }).catch(() => {
            return;
          });
        }
      }
    } catch {}
  }
  async handleRpc(req, userId, session) {
    const rawChatId = String(req.chatId ?? "").trim();
    const chatId = await this.resolveEffectiveChatId(userId, rawChatId);
    const payload = req.payload ?? {};
    switch (req.type) {
      case "snapshot:get": {
        if (chatId && chatId !== "sandbox") {
          await this.rehydrateChatMessages(userId, chatId);
          const snap = await this.storage.loadCampaign(userId, chatId);
          await this.storage.syncNativeLumiverseSurfaces(userId, chatId, snap.revision, snap.state, snap.template, false);
        }
        await this.broadcastSnapshot(userId, chatId, session);
        const [settings, connections, rawMessages] = await Promise.all([
          this.storage.loadSettings(userId),
          this.api.permissions.has("generation") && this.api.connections?.list ? this.api.connections.list(userId).catch(() => []) : Promise.resolve([]),
          chatId && chatId !== "sandbox" && this.api.permissions.has("chat_mutation") ? this.api.chat.getMessages(chatId).catch(() => []) : Promise.resolve([])
        ]);
        const shouldRestoreTurns = Boolean(settings.sensitiveObfuscatorEnabled) && settings.restoreObfuscatedOnRender !== false && (settings.sensitiveWords?.length ?? 0) > 0;
        const recentTurns = rawMessages.filter((m) => m.role === "user" || m.role === "assistant").slice(-24).map((m) => {
          let text = stripInlineStatsTags(typeof m.content === "string" ? m.content : "");
          if (shouldRestoreTurns) {
            text = deobfuscateSensitiveWords(text, settings.sensitiveWords, settings.obfuscateVowelsWithOne !== false);
          }
          return {
            id: m.id,
            role: m.role,
            content: text
          };
        });
        return {
          resolvedChatId: chatId !== "sandbox" ? chatId : "",
          recentTurns,
          connections: connections.map((c) => ({
            id: c.id,
            name: c.name,
            provider: c.provider,
            model: c.model,
            is_default: c.is_default
          }))
        };
      }
      case "vn:sendReply": {
        if (!chatId || chatId === "sandbox") {
          throw new Error("Open an active chat before sending a reply from the VN Stage.");
        }
        if (!this.api.permissions.has("chat_mutation") || !this.api.permissions.has("generation")) {
          throw new Error('Enable "chat_mutation" and "generation" permissions to send replies directly from the VN Stage.');
        }
        const content = String(payload.text ?? "").trim();
        if (!content)
          return { ok: false };
        const appended = await this.api.chat.appendMessage(chatId, {
          role: "user",
          content,
          metadata: { source: "lumi_stats_vn_stage" }
        }, { triggerGeneration: true });
        return { ok: true, messageId: appended.id, generationId: appended.generationId };
      }
      case "tag:intercepted": {
        if (!chatId || chatId === "sandbox")
          return { ok: false };
        const rawContent = String(payload.content ?? "").trim();
        const messageId = typeof payload.messageId === "string" ? payload.messageId : undefined;
        if (!rawContent)
          return { ok: false };
        const snap = await this.tracker.trackTurn(userId, chatId, {
          targetMessageId: messageId,
          inlineTagContent: rawContent
        });
        if (snap)
          await this.broadcastSnapshot(userId, chatId, session);
        return { ok: Boolean(snap) };
      }
      case "settings:update": {
        const nextSettings = await this.storage.saveSettings(userId, payload.settings ?? {});
        this.renderCache.clear();
        await this.syncObfuscatorDisplayRegex(userId);
        if (chatId)
          await this.broadcastSnapshot(userId, chatId, session);
        return { settings: nextSettings };
      }
      case "template:saveCurrent": {
        const effectiveChatId = chatId || "sandbox";
        const updatedTpl = await this.storage.saveChatTemplate(userId, effectiveChatId, normalizeImportedTemplate(payload.template));
        if (payload.saveToLibrary === true) {
          const lib = await this.storage.saveCustomTemplateToLibrary(userId, updatedTpl);
          const latest = lib.at(-1);
          if (latest) {
            await this.storage.saveSettings(userId, { defaultTemplateId: latest.id });
          }
        }
        await this.syncCampaignStatsToTemplate(userId, effectiveChatId, updatedTpl, `Updated template "${updatedTpl.name}"`);
        await this.broadcastSnapshot(userId, chatId, session);
        return { template: updatedTpl };
      }
      case "prose:cleanChat": {
        if (!this.api.permissions.has("chat_mutation")) {
          throw new Error('Enable the "chat_mutation" permission to clean chat messages.');
        }
        const messages = await this.api.chat.getMessages(chatId);
        let cleanedCount = 0;
        for (const m of messages) {
          if (typeof m.content !== "string")
            continue;
          const cleaned = cleanBrailleAndProseWhitespace(m.content);
          if (cleaned !== m.content) {
            this.selfEditedMessages.add(`${chatId}:${m.id}`);
            await this.api.chat.updateMessage(chatId, m.id, {
              content: cleaned,
              skipChunkRebuild: true
            });
            cleanedCount++;
          }
        }
        this.renderCache.invalidateChat(chatId);
        return { cleanedCount, total: messages.length };
      }
      case "template:apply": {
        const effectiveChatId = chatId || "sandbox";
        const tplId = String(payload.templateId ?? "").trim();
        const customList = await this.storage.listCustomTemplates(userId);
        const all = [...customList, ...BUILTIN_TEMPLATES];
        const found = all.find((t) => t.id === tplId) ?? (payload.template ? normalizeImportedTemplate(payload.template) : undefined);
        if (!found)
          throw new Error("Template not found.");
        const applied = await this.storage.saveChatTemplate(userId, effectiveChatId, {
          ...found,
          userSelected: true
        });
        await this.storage.saveSettings(userId, { defaultTemplateId: applied.id });
        await this.syncCampaignStatsToTemplate(userId, effectiveChatId, applied, `Applied template "${applied.name}"`);
        await this.broadcastSnapshot(userId, effectiveChatId);
        return { template: applied };
      }
      case "template:duplicate": {
        const effectiveChatId = chatId || "sandbox";
        const sourceId = String(payload.sourceTemplateId ?? "").trim();
        const customList = await this.storage.listCustomTemplates(userId);
        const all = [...customList, ...BUILTIN_TEMPLATES];
        const sourceTpl = all.find((t) => t.id === sourceId) ?? (payload.template ? normalizeImportedTemplate(payload.template) : await this.storage.loadChatTemplate(userId, effectiveChatId));
        const baseName = String(payload.name ?? `${sourceTpl.name} (Copy)`).trim().slice(0, 80);
        const uniqueSuffix = Date.now().toString(36).slice(-4);
        const draftDuplicate = {
          ...structuredClone(sourceTpl),
          id: `custom_${slugifyKey(baseName, "template")}_${uniqueSuffix}`,
          name: baseName,
          icon: String(payload.icon ?? sourceTpl.icon).trim().slice(0, 12) || "\u2728",
          description: String(payload.description ?? sourceTpl.description).trim().slice(0, 400),
          userSelected: true,
          updatedAt: new Date().toISOString()
        };
        const { library, saved: duplicated } = await this.storage.upsertCustomTemplateInLibrary(userId, draftDuplicate);
        await this.storage.saveChatTemplate(userId, effectiveChatId, duplicated);
        await this.storage.saveSettings(userId, { defaultTemplateId: duplicated.id });
        await this.syncCampaignStatsToTemplate(userId, effectiveChatId, duplicated, `Duplicated template "${duplicated.name}"`);
        await this.broadcastSnapshot(userId, effectiveChatId);
        return { template: duplicated, customTemplates: library };
      }
      case "template:saveToLibrary": {
        const effectiveChatId = chatId || "sandbox";
        const currentTpl = await this.storage.loadChatTemplate(userId, effectiveChatId);
        const name = String(payload.name ?? currentTpl.name).trim().slice(0, 80) || "Custom Template";
        const icon = String(payload.icon ?? currentTpl.icon).trim().slice(0, 12) || "\u2728";
        const description = String(payload.description ?? currentTpl.description).trim().slice(0, 400);
        const isCurrentBuiltin = BUILTIN_TEMPLATES.some((b) => b.id === currentTpl.id);
        const preservedId = !isCurrentBuiltin && payload.forceNew !== true && currentTpl.id ? currentTpl.id : `custom_${slugifyKey(name, "template")}_${Date.now().toString(36).slice(-4)}`;
        const toSave = {
          ...currentTpl,
          id: preservedId,
          name,
          icon,
          description,
          userSelected: true,
          updatedAt: new Date().toISOString()
        };
        const { library, saved } = await this.storage.upsertCustomTemplateInLibrary(userId, toSave);
        await this.storage.saveChatTemplate(userId, effectiveChatId, saved);
        await this.storage.saveSettings(userId, { defaultTemplateId: saved.id });
        await this.broadcastSnapshot(userId, effectiveChatId);
        return { template: saved, customTemplates: library };
      }
      case "template:createNew": {
        const effectiveChatId = chatId || "sandbox";
        const baseMode = String(payload.starter ?? "minimal").trim();
        const name = String(payload.name ?? "My Custom Template").trim().slice(0, 80) || "My Custom Template";
        const icon = String(payload.icon ?? "\u2728").trim().slice(0, 12) || "\u2728";
        const description = String(payload.description ?? "Custom roleplay tracker template.").trim().slice(0, 400) || "Custom roleplay tracker template.";
        const customList = await this.storage.listCustomTemplates(userId);
        const baseStarter = customList.find((c) => c.id === baseMode) ?? BUILTIN_TEMPLATES.find((b) => b.id === baseMode) ?? BUILTIN_TEMPLATES[0];
        const freshDraft = normalizeImportedTemplate({
          ...structuredClone(baseStarter),
          id: `custom_${slugifyKey(name, "template")}_${Date.now().toString(36).slice(-4)}`,
          name,
          icon,
          description,
          ...payload.promptPosition ? { promptPosition: payload.promptPosition } : {},
          ...payload.promptDepth !== undefined ? { promptDepth: payload.promptDepth } : {},
          stats: baseMode === "empty" ? [] : baseMode === "blank" ? [
            baseStarter.stats.find((s) => s.id === "trust") ?? baseStarter.stats[0]
          ].filter(Boolean) : structuredClone(baseStarter.stats),
          userSelected: true,
          updatedAt: new Date().toISOString()
        }, name);
        const { library, saved: freshTpl } = await this.storage.upsertCustomTemplateInLibrary(userId, freshDraft);
        await this.storage.saveChatTemplate(userId, effectiveChatId, freshTpl);
        await this.storage.saveSettings(userId, { defaultTemplateId: freshTpl.id });
        await this.syncCampaignStatsToTemplate(userId, effectiveChatId, freshTpl, `Created new template "${freshTpl.name}"`);
        await this.broadcastSnapshot(userId, effectiveChatId);
        return { template: freshTpl, customTemplates: library };
      }
      case "template:deleteFromLibrary": {
        const effectiveChatId = chatId || "sandbox";
        const tplId = String(payload.templateId ?? "").trim();
        const library = await this.storage.deleteCustomTemplateFromLibrary(userId, tplId);
        const settings = await this.storage.loadSettings(userId);
        const fallbackTpl = BUILTIN_TEMPLATES[0];
        if (settings.defaultTemplateId === tplId) {
          await this.storage.saveSettings(userId, { defaultTemplateId: fallbackTpl.id });
        }
        const curTpl = await this.storage.loadChatTemplate(userId, effectiveChatId);
        if (curTpl.id === tplId) {
          await this.storage.saveChatTemplate(userId, effectiveChatId, fallbackTpl);
          await this.syncCampaignStatsToTemplate(userId, effectiveChatId, fallbackTpl, `Reverted deleted template "${curTpl.name}" to default`);
        }
        await this.broadcastSnapshot(userId, effectiveChatId);
        return { customTemplates: library };
      }
      case "template:importJson": {
        const effectiveChatId = chatId || "sandbox";
        const parsed = JSON.parse(String(payload.json ?? ""));
        const list = Array.isArray(parsed) ? parsed.map((item) => normalizeImportedTemplate(item)) : [normalizeImportedTemplate(parsed)];
        let library = await this.storage.listCustomTemplates(userId);
        let active = list[0];
        for (const item of list) {
          const res = await this.storage.upsertCustomTemplateInLibrary(userId, item);
          library = res.library;
          active = res.saved;
        }
        await this.storage.saveChatTemplate(userId, effectiveChatId, active);
        await this.storage.saveSettings(userId, { defaultTemplateId: active.id });
        await this.syncCampaignStatsToTemplate(userId, effectiveChatId, active, `Imported template "${active.name}"`);
        await this.broadcastSnapshot(userId, effectiveChatId);
        return { template: active, customTemplates: library };
      }
      case "state:mutate": {
        const effectiveChatId = chatId || "sandbox";
        await this.storage.queue(userId, effectiveChatId, async () => {
          const snap = await this.storage.loadCampaign(userId, effectiveChatId);
          let nextState = structuredClone(snap.state);
          let nextTemplate = structuredClone(snap.template);
          if (payload.templatePatch && typeof payload.templatePatch === "object") {
            const rawPatch = payload.templatePatch;
            nextTemplate = normalizeImportedTemplate({
              ...nextTemplate,
              ...rawPatch,
              ...rawPatch.theme ? {
                theme: {
                  ...nextTemplate.theme,
                  ...rawPatch.theme,
                  ...rawPatch.theme.showSceneChips ? {
                    showSceneChips: {
                      ...nextTemplate.theme.showSceneChips,
                      ...rawPatch.theme.showSceneChips
                    }
                  } : {}
                }
              } : {},
              ...rawPatch.surfaces ? { surfaces: { ...nextTemplate.surfaces, ...rawPatch.surfaces } } : {}
            });
            await this.storage.saveChatTemplate(userId, effectiveChatId, nextTemplate);
            const customLib = await this.storage.listCustomTemplates(userId);
            if (customLib.some((t) => t.id === nextTemplate.id)) {
              await this.storage.upsertCustomTemplateInLibrary(userId, nextTemplate);
            }
            const statRenames = Array.isArray(payload.statRenames) ? payload.statRenames : [];
            this.reconcileStateWithTemplate(nextState, nextTemplate, statRenames);
          }
          if (payload.patch && typeof payload.patch === "object") {
            const reduced = applyTurnPatch(nextState, nextTemplate, payload.patch, { isManualEdit: true });
            nextState = reduced.state;
          }
          if (payload.stateOverride && typeof payload.stateOverride === "object") {
            nextState = {
              ...nextState,
              ...payload.stateOverride
            };
          }
          recomputeDerivedStats(nextTemplate.stats, nextState, nextTemplate.categories ?? []);
          await this.storage.commitCampaign(userId, effectiveChatId, snap.state, nextState, String(payload.reason ?? "Manual stat update"));
        });
        await this.broadcastSnapshot(userId, effectiveChatId);
        return { ok: true };
      }
      case "state:undo": {
        await this.storage.undoLatest(userId, chatId);
        await this.broadcastSnapshot(userId, chatId, session);
        return { ok: true };
      }
      case "state:restoreCheckpoint": {
        await this.storage.restoreCheckpoint(userId, chatId, String(payload.checkpointId ?? ""));
        await this.broadcastSnapshot(userId, chatId, session);
        return { ok: true };
      }
      case "track:manual": {
        await this.tracker.trackTurn(userId, chatId, { manual: true });
        await this.broadcastSnapshot(userId, chatId, session);
        return { ok: true };
      }
      case "track:cancel": {
        this.tracker.cancelInFlight(userId, chatId);
        return { ok: true };
      }
      case "map:travel": {
        const placeId = String(payload.placeId ?? "");
        const fastTravel = payload.fastTravel === true;
        const snap = await this.storage.loadCampaign(userId, chatId);
        const dest = snap.state.places[placeId];
        if (!dest)
          throw new Error("Destination not found.");
        const route = findShortestTravelRoute(snap.state, placeId);
        const mins = route ? route.totalMinutes : dest.travelMinutes || 5;
        if (fastTravel) {
          await this.storage.queue(userId, chatId, async () => {
            const latest = await this.storage.loadCampaign(userId, chatId);
            const reduced = applyTurnPatch(latest.state, latest.template, {
              scene: { location: dest.name, elapsedMinutes: mins }
            }, { isManualEdit: true });
            reduced.state.currentPlaceId = dest.id;
            await this.storage.commitCampaign(userId, chatId, latest.state, reduced.state, `Traveled to ${dest.name}`);
          });
          await this.broadcastSnapshot(userId, chatId, session);
          return { moved: true, destination: dest.name, minutes: mins };
        }
        const routeNames = route ? route.pathIds.map((id) => snap.state.places[id]?.name ?? id).join(" \u2192 ") : dest.name;
        return {
          moved: false,
          draftText: route && route.pathIds.length > 1 ? `I head toward ${dest.name} (${routeNames}).` : `I head to ${dest.name}.`,
          minutes: mins
        };
      }
      case "asset:upload": {
        if (!this.api.permissions.has("images")) {
          throw new Error('Enable the "images" permission to upload portraits or backdrops.');
        }
        const dataUrl = String(payload.dataUrl ?? "");
        const kind = String(payload.kind ?? "portrait");
        const targetId = String(payload.targetId ?? "");
        const variant = String(payload.variant ?? "neutral").trim().toLowerCase() || "neutral";
        const uploaded = await this.api.images.uploadFromDataUrl(dataUrl, {
          owner_chat_id: chatId,
          userId
        });
        await this.storage.queue(userId, chatId, async () => {
          const snap = await this.storage.loadCampaign(userId, chatId);
          const nextState = structuredClone(snap.state);
          if ((kind === "backdrop" || kind === "backdrop_variant") && nextState.places[targetId]) {
            const place = nextState.places[targetId];
            const timeSlot = String(payload.timeSlot ?? "default").trim() || "default";
            const customTag = String(payload.customTag ?? "").trim();
            if (kind === "backdrop" || timeSlot === "default" || !place.backdropUrl) {
              place.backdropImageId = uploaded.id;
              place.backdropUrl = uploaded.url;
            }
            place.backdropVariants ??= [];
            const varId = timeSlot === "custom" && customTag ? `bg_${slugifyKey(customTag, "custom")}` : `bg_${timeSlot}`;
            const existingIdx = place.backdropVariants.findIndex((v) => v.id === varId);
            const entry = {
              id: varId,
              timeSlot,
              customTag,
              imageId: uploaded.id,
              url: uploaded.url,
              pinned: Boolean(payload.pinned)
            };
            if (existingIdx >= 0)
              place.backdropVariants[existingIdx] = entry;
            else
              place.backdropVariants.push(entry);
          } else if (nextState.characters[targetId]) {
            const actor = nextState.characters[targetId];
            if (kind === "sprite_variant") {
              const emotionTag = String(payload.emotionTag ?? "").trim();
              const clothesTag = String(payload.clothesTag ?? "").trim();
              const poseTag = String(payload.poseTag ?? "").trim();
              const label = String(payload.label ?? "").trim() || [emotionTag, clothesTag, poseTag].filter(Boolean).join(" \xB7 ") || "Default Sprite";
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
                pinned: Boolean(payload.pinned)
              });
              if (emotionTag) {
                actor.expressionAssets[emotionTag.toLowerCase()] = {
                  imageId: uploaded.id,
                  url: uploaded.url
                };
              }
              if (!actor.portraitUrl) {
                actor.portraitAssetId = uploaded.id;
                actor.portraitUrl = uploaded.url;
              }
            } else if (kind === "expression") {
              actor.expressionAssets[variant] = {
                imageId: uploaded.id,
                url: uploaded.url
              };
            } else {
              actor.portraitAssetId = uploaded.id;
              actor.portraitUrl = uploaded.url;
            }
          }
          await this.storage.commitCampaign(userId, chatId, snap.state, nextState, `Uploaded ${kind} asset`);
        });
        await this.broadcastSnapshot(userId, chatId, session);
        return { url: uploaded.url, imageId: uploaded.id };
      }
      case "textEditor:open": {
        const res = await this.api.textEditor.open({
          title: String(payload.title ?? "Edit Text"),
          value: String(payload.value ?? ""),
          placeholder: String(payload.placeholder ?? ""),
          userId
        });
        return { text: res.text, cancelled: res.cancelled };
      }
      case "sandbox:test": {
        return this.tracker.runSandboxRuleTest(userId, chatId, {
          statId: typeof payload.statId === "string" ? payload.statId : undefined,
          scenarioText: typeof payload.scenarioText === "string" ? payload.scenarioText : undefined
        });
      }
      case "formula:compile": {
        return this.tracker.compileRuleToLocalFormula(userId, chatId, {
          statLabel: String(payload.statLabel ?? "Stat"),
          ruleText: String(payload.ruleText ?? ""),
          scope: String(payload.scope ?? "character")
        });
      }
      case "copilot:send": {
        const result = await this.tracker.consultCopilot(userId, chatId, String(payload.message ?? "").trim().slice(0, 4000), payload.mode ?? "ask");
        await this.broadcastSnapshot(userId, chatId, session);
        return result;
      }
      case "copilot:acceptProposal": {
        const proposalId = String(payload.proposalId ?? "");
        const prop = this.tracker.getProposal(userId, proposalId);
        if (!prop || prop.chatId !== chatId) {
          throw new Error("Copilot proposal expired or not found.");
        }
        if (prop.templatePatch) {
          const savedTpl = await this.storage.saveChatTemplate(userId, chatId, prop.templatePatch);
          await this.syncCampaignStatsToTemplate(userId, chatId, savedTpl, "Synced Copilot template schema");
        }
        if (prop.statePatch) {
          await this.storage.queue(userId, chatId, async () => {
            const snap = await this.storage.loadCampaign(userId, chatId);
            const tpl = prop.templatePatch ?? snap.template;
            const reduced = applyTurnPatch(snap.state, tpl, prop.statePatch, {
              isManualEdit: true
            });
            await this.storage.commitCampaign(userId, chatId, snap.state, reduced.state, "Applied Copilot proposal");
          });
        }
        this.tracker.deleteProposal(userId, proposalId);
        await this.broadcastSnapshot(userId, chatId, session);
        return { ok: true };
      }
      case "copilot:clear": {
        await this.api.userStorage.setJson(`copilot/${encodeURIComponent(chatId)}.json`, [], { userId });
        await this.broadcastSnapshot(userId, chatId, session);
        return { ok: true };
      }
      case "debug:get": {
        return { record: this.tracker.getDebugRecord(userId, chatId) };
      }
      case "debug:clear": {
        this.tracker.clearDebugRecord(userId, chatId);
        return { ok: true };
      }
      case "tokens:analyze": {
        const effectiveChatId = chatId || "sandbox";
        const [snap, settings] = await Promise.all([
          this.storage.loadCampaign(userId, effectiveChatId),
          this.storage.loadSettings(userId)
        ]);
        const countApproxOrExact = async (text) => {
          if (!text)
            return { tokens: 0, approximate: false };
          if (this.api.tokens?.countText) {
            try {
              const res = await this.api.tokens.countText(text, {
                modelSource: "main",
                ...userId ? { userId } : {}
              });
              return { tokens: res.total_tokens, approximate: Boolean(res.approximate) };
            } catch {}
          }
          return { tokens: Math.ceil(text.length / 4), approximate: true };
        };
        const charBudget = Math.max(400, settings.tokenBudget * 4);
        const budgetedCont = compileNarratorContinuity(snap.state, snap.template, charBudget).text;
        const unbudgetedCont = compileNarratorContinuity(snap.state, snap.template, 40000).text;
        const protocolTxt = settings.extractionMode === "inline_tag" ? compileExtractorPrompt(snap.state, snap.template, "", {
          verbosity: settings.protocolVerbosity ?? "compact"
        }) : "";
        const [contCount, rawContCount, protoCount] = await Promise.all([
          countApproxOrExact(budgetedCont),
          countApproxOrExact(unbudgetedCont),
          countApproxOrExact(protocolTxt)
        ]);
        const statBreakdown = snap.template.stats.filter((s) => s.enabled).map((s) => {
          const ruleChars = settings.extractionMode === "inline_tag" && s.calculationMode !== "local_formula" ? (s.triggerCues?.length ?? 0) + s.id.length + 18 : 0;
          let stateChars = 0;
          if (s.injectInContinuity !== false) {
            if (s.scope === "character") {
              for (const actor of Object.values(snap.state.characters)) {
                const m = actor.meters[s.id];
                if (m?.calibrated)
                  stateChars += s.id.length + String(m.value).length + 3;
              }
            } else {
              const r = snap.state.stats[s.id];
              if (r?.calibrated)
                stateChars += s.id.length + String(r.value).length + 3;
            }
          }
          return {
            id: s.id,
            label: `${s.icon} ${s.label}`,
            scope: s.scope,
            approxTokens: Math.ceil((ruleChars + stateChars) / 4),
            ruleTokens: Math.ceil(ruleChars / 4),
            stateTokens: Math.ceil(stateChars / 4)
          };
        }).sort((a, b) => b.approxTokens - a.approxTokens).slice(0, 8);
        let dossierChars = 0;
        for (const actor of Object.values(snap.state.characters).filter((c) => c.present)) {
          for (const f of snap.template.dossierFields.filter((df) => df.enabled)) {
            const val = resolveCharacterFieldValue(actor, f.id);
            if (val)
              dossierChars += f.id.length + val.length + 4;
          }
        }
        return {
          extractionMode: settings.extractionMode,
          protocolVerbosity: settings.protocolVerbosity ?? "compact",
          tokenBudget: settings.tokenBudget,
          approximate: contCount.approximate || protoCount.approximate,
          continuityTokens: contCount.tokens,
          rawContinuityTokens: rawContCount.tokens,
          protocolTokens: protoCount.tokens,
          totalInjectedTokens: contCount.tokens + protoCount.tokens,
          dossierStateTokens: Math.ceil(dossierChars / 4),
          topStats: statBreakdown
        };
      }
      default:
        throw new Error(`Unknown Lumi Stats RPC action: ${req.type}`);
    }
  }
  start() {
    const releaseTagCap = this.api.frontendCapabilities?.declare("message_tag_interceptor");
    if (releaseTagCap)
      this.disposers.push(releaseTagCap);
    this.storage.loadSettings().then(async () => {
      await this.syncObfuscatorDisplayRegex(undefined);
      if (this.api.permissions.has("chats")) {
        const active = await this.api.chats.getActive(undefined).catch(() => null);
        if (active?.id) {
          this.rememberActiveChat(undefined, active.id);
          await this.storage.loadCampaign(undefined, active.id);
        }
      }
    }).catch(() => {
      return;
    });
    this.disposers.push(this.api.onFrontendMessage((rawPayload, userId, frontendSessionId) => {
      if (!rawPayload || typeof rawPayload !== "object")
        return;
      const req = rawPayload;
      if (req.channel !== LUMI_STATS_CHANNEL || !req.requestId || !req.type)
        return;
      this.handleRpc(req, userId, frontendSessionId).then((data) => {
        const resp = {
          channel: LUMI_STATS_CHANNEL,
          requestId: req.requestId,
          chatId: req.chatId,
          type: "rpc_ack",
          ok: true,
          data
        };
        this.api.sendToFrontend(resp, userId, frontendSessionId ? { frontendSessionId } : undefined);
      }).catch((err) => {
        if (isAbortError(err)) {
          const resp = {
            channel: LUMI_STATS_CHANNEL,
            requestId: req.requestId,
            chatId: req.chatId,
            type: "rpc_ack",
            ok: true,
            data: { cancelled: true }
          };
          this.api.sendToFrontend(resp, userId, frontendSessionId ? { frontendSessionId } : undefined);
          return;
        }
        const msg = err instanceof Error ? err.message : String(err);
        const resp = {
          channel: LUMI_STATS_CHANNEL,
          requestId: req.requestId,
          chatId: req.chatId,
          type: "rpc_ack",
          ok: false,
          error: msg
        };
        this.api.sendToFrontend(resp, userId, frontendSessionId ? { frontendSessionId } : undefined);
      });
    }));
    let disposeInterceptor;
    const ensureInterceptor = () => {
      if (disposeInterceptor || !this.api.permissions.has("interceptor"))
        return;
      disposeInterceptor = this.api.registerInterceptor(async (messages, context) => {
        if (this.stopped)
          return messages;
        const ctxObj = context && typeof context === "object" ? context : {};
        ctxObj.signal?.throwIfAborted();
        const genType = String(ctxObj.generationType ?? "normal").toLowerCase();
        if (genType === "impersonate" || genType === "quiet")
          return messages;
        const chatId = typeof ctxObj.chatId === "string" ? ctxObj.chatId : "";
        if (!chatId)
          return messages;
        const userId = this.resolveUserId(typeof ctxObj.userId === "string" ? ctxObj.userId : undefined, chatId);
        this.rememberActiveChat(userId, chatId);
        const settings = await this.storage.loadSettings(userId);
        if (!settings.injectContinuity && settings.extractionMode !== "inline_tag") {
          return messages;
        }
        const presetMeta = ctxObj.presetMetadata && typeof ctxObj.presetMetadata === "object" ? ctxObj.presetMetadata : undefined;
        const presetDefaultTemplateId = typeof presetMeta?.defaultTemplateId === "string" ? presetMeta.defaultTemplateId : undefined;
        let snap = await this.storage.loadCampaign(userId, chatId, { presetDefaultTemplateId });
        if (genType === "regenerate" || genType === "swipe") {
          const targetId = String(ctxObj.excludeMessageId ?? ctxObj.targetMessageId ?? "").trim() || snap.bindings.at(-1)?.messageId;
          snap = await this.storage.previewRollbackBeforeMessage(userId, chatId, targetId);
        } else if (ctxObj.dryRun !== true) {
          const boundIds = new Set(snap.bindings.map((b) => b.messageId));
          const maxBoundIndex = snap.bindings.reduce((max, b) => Math.max(max, b.messageIndex), -1);
          let stateCursor = structuredClone(snap.state);
          const nextBindings = [...snap.bindings];
          let caughtUp = false;
          for (const m of messages) {
            if (!m || m.role !== "assistant" || typeof m.content !== "string")
              continue;
            const msgMeta = m;
            const srcId = typeof msgMeta.sourceMessageId === "string" ? msgMeta.sourceMessageId.trim() : "";
            if (!srcId || boundIds.has(srcId))
              continue;
            const srcIndex = typeof msgMeta.sourceIndexInChat === "number" ? msgMeta.sourceIndexInChat : Math.max(0, maxBoundIndex + 1);
            if (snap.state.initialized && srcIndex < maxBoundIndex)
              continue;
            const inlinePatch = extractInlineStatsTag(m.content);
            if (!inlinePatch)
              continue;
            const contentHash = await sha256Hex(stripInlineStatsTags(m.content));
            stateCursor = applyTurnPatch(stateCursor, snap.template, inlinePatch, {
              incrementTurn: true
            }).state;
            nextBindings.push({
              messageId: srcId,
              swipeId: 0,
              contentHash,
              messageIndex: srcIndex
            });
            boundIds.add(srcId);
            caughtUp = true;
          }
          if (caughtUp) {
            snap = await this.storage.queue(userId, chatId, () => this.storage.commitCampaign(userId, chatId, snap.state, stateCursor, "Synced inline <lumi-stats> block from chat history", undefined, nextBindings.slice(-120)));
            this.broadcastSnapshot(userId, chatId);
          }
        }
        const cleanTextSegment = (raw) => {
          let txt = stripInlineStatsTags(raw);
          if (settings.cleanBraille && hasBrailleOrWhitespaceArtifacts(txt)) {
            txt = cleanBrailleAndProseWhitespace(txt);
          }
          return txt;
        };
        const cleanedMessages = messages.map((m) => {
          if (!m || m.role === "system")
            return m;
          if (typeof m.content === "string") {
            const txt = cleanTextSegment(m.content);
            return txt !== m.content ? { ...m, content: txt } : m;
          }
          if (Array.isArray(m.content)) {
            let changed = false;
            const nextParts = m.content.map((part) => {
              if (part && part.type === "text" && typeof part.text === "string") {
                const txt = cleanTextSegment(part.text);
                if (txt !== part.text) {
                  changed = true;
                  return { ...part, text: txt };
                }
              }
              return part;
            });
            return changed ? { ...m, content: nextParts } : m;
          }
          return m;
        });
        let charBudget = Math.max(400, settings.tokenBudget * 4);
        let continuity = this.storage.getCompiledContinuity(userId, chatId, snap.revision, snap.state, snap.template, charBudget);
        if (this.api.tokens?.countText && continuity.text) {
          try {
            let measuredTokens = continuity.tokenCount;
            if (measuredTokens === undefined) {
              const countRes = await this.api.tokens.countText(continuity.text, {
                modelSource: "main",
                ...userId ? { userId } : {}
              });
              measuredTokens = countRes.total_tokens;
              continuity.tokenCount = measuredTokens;
            }
            if (measuredTokens > settings.tokenBudget && measuredTokens > 0) {
              const ratio = settings.tokenBudget / measuredTokens;
              charBudget = Math.max(300, Math.floor(continuity.text.length * ratio));
              continuity = this.storage.getCompiledContinuity(userId, chatId, snap.revision, snap.state, snap.template, charBudget);
            }
          } catch {}
        }
        const getMessagePlainText = (m) => {
          if (!m)
            return "";
          if (typeof m.content === "string")
            return m.content;
          if (Array.isArray(m.content)) {
            return m.content.filter((p) => p && p.type === "text" && typeof p.text === "string").map((p) => p.text).join(`
`);
          }
          return "";
        };
        const promptAlreadyHasContinuity = cleanedMessages.some((m) => {
          const text = getMessagePlainText(m);
          if (!text)
            return false;
          return text.includes("[Lumi Stats \xB7") || continuity.text.length > 0 && text.includes(continuity.text);
        });
        const promptAlreadyHasProtocol = cleanedMessages.some((m) => getMessagePlainText(m).includes("<lumi_stats_protocol>"));
        const shouldInjectContinuity = !promptAlreadyHasContinuity && Boolean(snap.state.canonPremise || settings.injectContinuity && continuity.text);
        const recentTextForGating = cleanedMessages.filter((m) => m?.__isChatHistory).slice(-4).map((m) => getMessagePlainText(m)).join(`
`);
        const inlineContract = settings.extractionMode === "inline_tag" && !promptAlreadyHasProtocol ? `Append updated state at the end as <lumi-stats>{...JSON...}</lumi-stats>:
${compileExtractorPrompt(snap.state, snap.template, recentTextForGating, { verbosity: settings.protocolVerbosity ?? "compact", skipContinuityCategoryRules: Boolean(shouldInjectContinuity && settings.injectContinuity && continuity.text) })}` : "";
        const obfSendActive = Boolean(settings.sensitiveObfuscatorEnabled) && settings.obfuscateOnSend !== false && (settings.sensitiveWords?.length ?? 0) > 0;
        const obfWords = settings.sensitiveWords ?? [];
        const useOne = settings.obfuscateVowelsWithOne !== false;
        const applyObfToMessage = (msg) => {
          if (!obfSendActive || !msg)
            return msg;
          if (typeof msg.content === "string") {
            const nextText = obfuscateSensitiveWords(msg.content, obfWords, useOne);
            return nextText !== msg.content ? { ...msg, content: nextText } : msg;
          }
          if (Array.isArray(msg.content)) {
            const nextParts = msg.content.map((part) => part && part.type === "text" && typeof part.text === "string" ? { ...part, text: obfuscateSensitiveWords(part.text, obfWords, useOne) } : part);
            return { ...msg, content: nextParts };
          }
          return msg;
        };
        const markerChar = useOne ? "1" : "*";
        const cipherNoteText = `[Cipher Note: Some input terms use "${markerChar}" in place of vowels (a,e,i,o,u). Read them as normal words. Write your own narration, headers, and dialogue in standard English with normal vowels\u2014never imitate "${markerChar}"-spelling across ordinary prose.]`;
        if (!shouldInjectContinuity && !inlineContract) {
          if (!obfSendActive)
            return cleanedMessages;
          const outObf = cleanedMessages.map(applyObfToMessage);
          if (settings.includeCipherHint === true) {
            outObf.unshift({
              role: "system",
              content: cipherNoteText
            });
          }
          return outObf;
        }
        const cipherHintLine = obfSendActive && settings.includeCipherHint === true ? cipherNoteText : "";
        const storyContinuityRaw = [
          shouldInjectContinuity ? `[Lumi Stats \xB7 Story Continuity \u2014 guide reactions naturally; never quote raw numbers in dialogue]` : "",
          cipherHintLine,
          shouldInjectContinuity && snap.state.canonPremise ? `Canon Premise: ${snap.state.canonPremise}` : "",
          shouldInjectContinuity && settings.injectContinuity ? continuity.text : ""
        ].filter(Boolean).join(`

`);
        const obfuscatedContinuity = obfSendActive ? obfuscateSensitiveWords(storyContinuityRaw, obfWords, useOne) : storyContinuityRaw;
        const finalSystemContent = [inlineContract, obfuscatedContinuity].filter(Boolean).join(`

`);
        const pos = snap.template.promptPosition || "post_history";
        const out = cleanedMessages.map(applyObfToMessage);
        const historyIndices = [];
        for (let i = 0;i < out.length; i++) {
          if (out[i]?.__isChatHistory) {
            historyIndices.push(i);
          }
        }
        let insertIndex = out.length;
        if (pos === "pre_history") {
          insertIndex = historyIndices.length > 0 ? historyIndices[0] : 0;
        } else if (pos === "in_history") {
          const depth = Math.max(0, Math.round(Number(snap.template.promptDepth ?? 1) || 0));
          if (historyIndices.length > 0) {
            if (depth === 0) {
              insertIndex = historyIndices[historyIndices.length - 1] + 1;
            } else if (depth <= historyIndices.length) {
              insertIndex = historyIndices[historyIndices.length - depth];
            } else {
              insertIndex = historyIndices[0];
            }
          } else {
            insertIndex = Math.max(0, out.length - depth);
          }
        } else {
          while (insertIndex > 0 && out[insertIndex - 1]?.role === "assistant") {
            insertIndex--;
          }
        }
        out.splice(insertIndex, 0, { role: "system", content: finalSystemContent });
        return {
          messages: out,
          breakdown: [{ messageIndex: insertIndex, name: "Lumi Stats Continuity" }]
        };
      }, 240);
    };
    ensureInterceptor();
    let disposeContentProc;
    let contentProcRegistered = false;
    const ensureContentProcessor = () => {
      if (contentProcRegistered || !this.api.permissions.has("chat_mutation") || typeof this.api.registerMessageContentProcessor !== "function") {
        return;
      }
      const maybeDisposer = this.api.registerMessageContentProcessor(async (ctx) => {
        if (this.stopped || !this.api.permissions.has("chat_mutation") || typeof ctx?.content !== "string") {
          return;
        }
        const userId = typeof ctx.userId === "string" ? ctx.userId : "__owner__";
        const settings = await this.storage.loadSettings(userId);
        const obfActive = Boolean(settings.sensitiveObfuscatorEnabled) && (settings.sensitiveWords?.length ?? 0) > 0;
        if (!settings.cleanBraille && !obfActive)
          return;
        const raw = ctx.content;
        const hasBraille = settings.cleanBraille && hasBrailleOrWhitespaceArtifacts(raw);
        if (!hasBraille && !obfActive)
          return;
        const transformContent = (input, origin) => {
          let out = hasBraille ? cleanBrailleAndProseWhitespace(input) : input;
          if (obfActive) {
            const words = settings.sensitiveWords ?? [];
            const useOne = settings.obfuscateVowelsWithOne !== false;
            if (origin === "render") {
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
        if (ctx.origin === "render") {
          const cached = this.renderCache.get(userId, ctx.chatId ?? "", ctx.messageId, raw);
          if (cached !== undefined) {
            return cached !== raw ? { content: cached } : undefined;
          }
          const out = transformContent(raw, "render");
          this.renderCache.set(userId, ctx.chatId ?? "", ctx.messageId, raw, out);
          return out !== raw ? { content: out } : undefined;
        }
        if (["create", "update", "swipe_add", "swipe_update"].includes(ctx.origin)) {
          const out = transformContent(raw, ctx.origin);
          return out !== raw ? { content: out } : undefined;
        }
      }, 90);
      if (typeof maybeDisposer === "function") {
        disposeContentProc = maybeDisposer;
      }
      contentProcRegistered = true;
    };
    ensureContentProcessor();
    let disposeWorldInfo;
    let worldInfoRegistered = false;
    const ensureWorldInfoInterceptor = () => {
      if (worldInfoRegistered || !this.api.permissions.has("generation") || typeof this.api.registerWorldInfoInterceptor !== "function") {
        return;
      }
      const maybeDisposer = this.api.registerWorldInfoInterceptor(async (ctx) => {
        if (this.stopped || !this.api.permissions.has("generation") || !ctx.chatId)
          return;
        const userId = this.resolveUserId(ctx.userId, ctx.chatId);
        const settings = await this.storage.loadSettings(userId);
        if (!settings.worldInfoGating)
          return;
        const snap = await this.storage.loadCampaign(userId, ctx.chatId);
        return evaluateWorldInfoStatGates(ctx, snap.state);
      }, 90);
      if (typeof maybeDisposer === "function") {
        disposeWorldInfo = maybeDisposer;
      }
      worldInfoRegistered = true;
    };
    ensureWorldInfoInterceptor();
    try {
      const readSyncForMacro = (ctx) => {
        const o = ctx && typeof ctx === "object" ? ctx : {};
        const env = o.env && typeof o.env === "object" ? o.env : {};
        const envChat = env.chat && typeof env.chat === "object" ? env.chat : {};
        const rawUserId = typeof o.userId === "string" ? o.userId : undefined;
        const fallbackUser = this.resolveUserId(rawUserId);
        const chatId = String(o.chatId ?? o.chat_id ?? envChat.id ?? envChat.chatId ?? this.lastActiveChatByUser.get(rawUserId?.trim() || "__owner__") ?? (fallbackUser ? this.lastActiveChatByUser.get(fallbackUser) : undefined) ?? "").trim();
        const userId = this.resolveUserId(rawUserId, chatId);
        return {
          userId,
          chatId,
          ...this.storage.getStateAndTemplateSync(userId, chatId)
        };
      };
      this.api.registerMacro({
        name: "lumi_stats",
        category: "extension:lumi_stats",
        description: "Grounded Lumi Stats continuity block for the active chat",
        returnType: "string",
        volatile: true,
        handler: (ctx) => {
          const { userId, chatId, state, template, revision } = readSyncForMacro(ctx);
          return this.storage.getCompiledContinuity(userId, chatId, revision, state, template, 6000).text;
        }
      });
      this.api.registerMacro({
        name: "lumi_header",
        category: "extension:lumi_stats",
        description: "Bracketed scene banner [ \uD83D\uDD70\uFE0F Time | \uD83D\uDCC5 Date | \uD83D\uDCCD Location | \uD83C\uDF26\uFE0F Weather ]",
        returnType: "string",
        volatile: true,
        handler: (ctx) => {
          const { state } = readSyncForMacro(ctx);
          return formatSceneBanner(state).formatted;
        }
      });
      this.api.registerMacro({
        name: "lumi_clock",
        category: "extension:lumi_stats",
        description: "Current 12-hour story clock for the active chat",
        returnType: "string",
        volatile: true,
        handler: (ctx) => {
          const { state } = readSyncForMacro(ctx);
          return formatStoryClock(state.elapsedMinutes);
        }
      });
      this.api.registerMacro({
        name: "lumi_stat",
        category: "extension:lumi_stats",
        description: "Read a specific stat or character meter (e.g. {{lumi_stat::composure}} or {{lumi_stat::akane.loyalty}})",
        returnType: "string",
        volatile: true,
        args: [{ name: "key", description: "Stat ID or actor.meter path", required: true }],
        handler: (ctx) => {
          const { state } = readSyncForMacro(ctx);
          const rawArgs = ctx?.args;
          const key = String(Array.isArray(rawArgs) ? rawArgs[0] ?? "" : "").trim();
          if (!key)
            return "";
          if (key.includes(".")) {
            const [actorPart, meterPart] = key.split(".");
            const actorSlug = slugifyKey(actorPart, "");
            const actor = state.characters[actorSlug] ?? Object.values(state.characters).find((c) => slugifyKey(c.name, "") === actorSlug);
            const m = actor?.meters[slugifyKey(meterPart, "")];
            return m !== undefined ? String(m.value) : "";
          }
          const clean = slugifyKey(key, "");
          if (state.stats[clean] !== undefined)
            return String(state.stats[clean].value);
          const firstPresent = Object.values(state.characters).find((c) => c.present);
          const m = firstPresent?.meters[clean];
          return m !== undefined ? String(m.value) : "";
        }
      });
      this.api.registerMacro({
        name: "lumi_var_table",
        category: "extension:lumi_stats",
        description: "Lists all persisted @lumi_stat_* and @lumi_char_* variables for the active chat",
        returnType: "string",
        volatile: true,
        handler: (ctx) => {
          const { state, template } = readSyncForMacro(ctx);
          const flatVars = buildFlatChatVariablesMap(state, template);
          return Object.entries(flatVars).filter(([k]) => k.startsWith("lumi_stat_") || k.startsWith("lumi_char_")).map(([k, v]) => `@${k}: ${v}`).join(`
`);
        }
      });
      this.api.registerMacro({
        name: "lumi_format",
        category: "extension:lumi_stats",
        description: "Compact ~100-token JSON example block for the active Lumi Stats template",
        returnType: "string",
        volatile: true,
        handler: (ctx) => {
          const { userId, state, template } = readSyncForMacro(ctx);
          const verbosity = this.storage.getSettingsSync(userId).protocolVerbosity ?? "compact";
          return `<lumi-stats>
${buildCompactFormatExample(state, template, state.initialized, "", { verbosity })}
</lumi-stats>`;
        }
      });
      this.api.registerMacro({
        name: "lumi_instructions",
        category: "extension:lumi_stats",
        description: "Complete Lumi Stats inline extraction instructions and compact format example",
        returnType: "string",
        volatile: true,
        handler: (ctx) => {
          const { userId, state, template } = readSyncForMacro(ctx);
          const verbosity = this.storage.getSettingsSync(userId).protocolVerbosity ?? "compact";
          return `At the end of your reply, append the updated state wrapped in <lumi-stats>{...JSON...}</lumi-stats>:
${compileExtractorPrompt(state, template, "", { verbosity })}`;
        }
      });
      this.disposers.push(() => {
        for (const name of [
          "lumi_stats",
          "lumi_header",
          "lumi_clock",
          "lumi_stat",
          "lumi_var_table",
          "lumi_format",
          "lumi_instructions"
        ]) {
          this.api.unregisterMacro?.(name);
        }
      });
    } catch {}
    let toolsRegistered = false;
    const syncToolsRegistration = () => {
      if (!this.api.permissions.has("tools")) {
        if (toolsRegistered) {
          this.api.unregisterTool?.("lumi_stats_inspect");
          this.api.unregisterTool?.("lumi_stats_check");
          toolsRegistered = false;
        }
        return;
      }
      if (toolsRegistered)
        return;
      this.api.registerTool({
        name: "lumi_stats_inspect",
        display_name: "Lumi Stats: Inspect Scene & Character Meters",
        description: "Inspects calibrated character meters, attire, goals, and world stats to guide narrative direction.",
        parameters: {
          type: "object",
          properties: {
            focusCharacter: {
              type: "string",
              description: "Optional character name to focus the inspection on"
            }
          }
        },
        council_eligible: true
      });
      this.api.registerTool({
        name: "lumi_stats_check",
        display_name: "Lumi Stats: Roll Stat / Meter Check",
        description: "Performs a percentile check against a tracked stat or character meter and reports the outcome tier.",
        parameters: {
          type: "object",
          properties: {
            statKey: {
              type: "string",
              description: "Stat ID or character.meter key to test"
            },
            difficulty: {
              type: "number",
              description: "Target threshold between 10 and 90 (default 50)"
            }
          },
          required: ["statKey"]
        },
        council_eligible: true
      });
      toolsRegistered = true;
    };
    syncToolsRegistration();
    this.disposers.push(this.api.on("TOOL_INVOCATION", async (payload, eventUserId) => {
      const p = payload;
      const resolvedUser = this.resolveUserId(eventUserId);
      const activeChat = this.api.permissions.has("chats") ? await this.api.chats.getActive(resolvedUser).catch(() => null) : null;
      const chatId = activeChat?.id ?? this.lastActiveChatByUser.get(resolvedUser || "__owner__") ?? "";
      const ownerUser = this.resolveUserId(resolvedUser, chatId);
      const snap = await this.storage.loadCampaign(ownerUser, chatId);
      const directorPrefix = p.councilMember ? `[Council Director ${p.councilMember.name} (${p.councilMember.role || "Analyst"})]
` : "";
      if (p.toolName === "lumi_stats_inspect") {
        const continuity = this.storage.getCompiledContinuity(ownerUser, chatId, snap.revision, snap.state, snap.template, 4000).text;
        return `${directorPrefix}${continuity || "No stats calibrated yet for this chat."}`;
      }
      if (p.toolName === "lumi_stats_check") {
        const statKey = String(p.args?.statKey ?? "").trim();
        const difficulty = Number(p.args?.difficulty ?? 50);
        const schema = snap.template.stats.find((s) => s.id === statKey || slugifyKey(s.label, "") === slugifyKey(statKey, ""));
        const firstPresent = Object.values(snap.state.characters).find((c) => c.present);
        const rawVal = snap.state.stats[statKey]?.value ?? (schema ? firstPresent?.meters[schema.id]?.value : undefined) ?? 50;
        const numVal = typeof rawVal === "number" ? rawVal : 50;
        const anchor = schema ? resolveAnchorLabel(schema.anchors, numVal) : String(numVal);
        const passed = numVal >= difficulty;
        return `${directorPrefix}Stat Check [${schema?.label ?? statKey}]: Current=${numVal} (${anchor}) vs Difficulty=${difficulty} \u2192 ${passed ? "SUCCESS" : "COMPLICATION / PARTIAL"}.`;
      }
      return "Unknown Lumi Stats tool";
    }));
    try {
      this.api.commands.register([
        {
          id: "lumi-sync-turn",
          label: "Lumi Stats: Sync & Calibrate Current Turn",
          description: "Calibrate or update all scene and character stats from recent chat messages",
          keywords: ["lumi", "stats", "sync", "calibrate", "tracker"],
          scope: "chat-idle"
        },
        {
          id: "lumi-undo-turn",
          label: "Lumi Stats: Undo Latest Stat Change",
          description: "Revert Lumi Stats to the previous turn checkpoint",
          keywords: ["lumi", "stats", "undo", "rollback"],
          scope: "chat"
        },
        {
          id: "lumi-open-drawer",
          label: "Lumi Stats: Open Stats Drawer",
          description: "Open the Lumi Stats sidebar drawer tab",
          keywords: ["lumi", "stats", "drawer", "dossier", "map"],
          scope: "global"
        }
      ]);
      this.disposers.push(this.api.commands.onInvoked(async (commandId, ctx) => {
        const ownerUser = this.resolveUserId(ctx?.userId, ctx.chatId);
        if (commandId === "lumi-open-drawer") {
          await this.api.ui.openDrawerTab("lumi-stats", ownerUser ? { userId: ownerUser } : undefined);
          return;
        }
        const toastOpts = ownerUser ? { userId: ownerUser } : undefined;
        if (!ctx.chatId) {
          this.api.toast.warning("Open a chat first to run this Lumi Stats command.", toastOpts);
          return;
        }
        if (commandId === "lumi-sync-turn") {
          this.api.toast.info("Calibrating Lumi Stats for current turn\u2026", toastOpts);
          await this.tracker.trackTurn(ownerUser, ctx.chatId, { manual: true });
          await this.broadcastSnapshot(ownerUser, ctx.chatId);
          this.api.toast.success("Lumi Stats updated.", toastOpts);
        } else if (commandId === "lumi-undo-turn") {
          await this.storage.undoLatest(ownerUser, ctx.chatId);
          await this.broadcastSnapshot(ownerUser, ctx.chatId);
          this.api.toast.info("Reverted latest Lumi Stats change.", toastOpts);
        }
      }));
      this.disposers.push(() => this.api.commands.unregister());
    } catch {}
    try {
      this.api.rpcPool?.handle("state.get", async () => {
        const ownerUser = this.resolveUserId(undefined);
        const active = this.api.permissions.has("chats") ? await this.api.chats.getActive(ownerUser).catch(() => null) : null;
        const chatId = active?.id ?? this.lastActiveChatByUser.get(ownerUser || "__owner__") ?? "";
        if (!chatId)
          return null;
        const resolvedOwner = this.resolveUserId(ownerUser, chatId);
        const snap = await this.storage.loadCampaign(resolvedOwner, chatId);
        return buildChatVariableProjection(snap.state, snap.template);
      }, { requires: [] });
      this.disposers.push(() => {
        this.api.rpcPool?.unregister("state.current");
        this.api.rpcPool?.unregister("state.get");
      });
    } catch {}
    const getChatId = (p) => {
      if (!p || typeof p !== "object")
        return "";
      const o = p;
      const msg = o.message && typeof o.message === "object" ? o.message : undefined;
      return String(o.chatId ?? o.chat_id ?? msg?.chatId ?? "").trim();
    };
    const getMsgId = (p) => {
      if (!p || typeof p !== "object")
        return "";
      const o = p;
      const msg = o.message && typeof o.message === "object" ? o.message : undefined;
      return String(o.messageId ?? o.message_id ?? msg?.id ?? "").trim();
    };
    this.disposers.push(this.api.on("CHARACTER_EDITED", () => {
      invalidateGroundingCache();
    }));
    this.disposers.push(this.api.on("PERSONA_CHANGED", () => {
      invalidateGroundingCache();
    }));
    this.disposers.push(this.api.on("CHAT_SWITCHED", (p, userId) => {
      const chatId = getChatId(p);
      invalidateGroundingCache(chatId || undefined);
      if (chatId) {
        this.rememberActiveChat(userId, chatId);
        const resolvedUser = this.resolveUserId(userId, chatId);
        this.rehydrateChatMessages(resolvedUser, chatId).then(async () => {
          const snap = await this.storage.loadCampaign(resolvedUser, chatId);
          await this.storage.syncNativeLumiverseSurfaces(resolvedUser, chatId, snap.revision, snap.state, snap.template, false);
          await this.broadcastSnapshot(resolvedUser, chatId);
        });
      } else {
        this.clearActiveChat(userId);
        const resolvedUser = this.resolveUserId(userId);
        this.broadcastSnapshot(resolvedUser, "sandbox");
      }
    }));
    this.disposers.push(this.api.on("CHAT_CHANGED", (p) => {
      const chatId = getChatId(p);
      if (chatId)
        this.renderCache.invalidateChat(chatId);
    }));
    let disposeGenEvents = [];
    const syncGenerationSubscriptions = () => {
      for (const fn of disposeGenEvents.splice(0))
        fn();
      if (!this.api.permissions.has("generation"))
        return;
      disposeGenEvents.push(this.api.on("GENERATION_STARTED", (p, userId) => {
        const ev = p ?? {};
        const genType = String(ev.generationType ?? "normal").toLowerCase();
        if (genType === "quiet" || genType === "raw" || genType === "impersonate")
          return;
        const chatId = getChatId(p);
        const genId = String(ev.generationId ?? "");
        if (!chatId || !genId)
          return;
        this.rememberActiveChat(userId, chatId);
        const resolvedUser = this.resolveUserId(userId, chatId);
        this.activeGenerations.set(`${resolvedUser ?? "__owner__"}:${chatId}`, genId);
        this.tracker.cancelInFlight(resolvedUser, chatId);
        if (genType === "regenerate" || genType === "swipe") {
          const targetMsgId = String(ev.targetMessageId ?? "").trim();
          this.storage.queue(resolvedUser, chatId, async () => {
            const snap = await this.storage.loadCampaign(resolvedUser, chatId);
            const rollbackId = targetMsgId || snap.bindings.at(-1)?.messageId;
            if (!rollbackId)
              return null;
            return this.storage.rollbackBeforeMessage(resolvedUser, chatId, {
              targetMessageId: rollbackId
            });
          }).then((rolled) => {
            if (rolled)
              return this.broadcastSnapshot(resolvedUser, chatId);
          }).catch(() => {
            return;
          });
        }
      }));
      disposeGenEvents.push(this.api.on("GENERATION_ENDED", (p, userId) => {
        const chatId = getChatId(p);
        if (!chatId)
          return;
        const ev = p ?? {};
        const genType = String(ev.generationType ?? "normal").toLowerCase();
        if (genType === "quiet" || genType === "raw" || genType === "impersonate")
          return;
        const resolvedUser = this.resolveUserId(userId, chatId);
        this.activeGenerations.delete(`${resolvedUser ?? "__owner__"}:${chatId}`);
        if (ev.error)
          return;
        const msgId = getMsgId(p);
        (async () => {
          const settings = await this.storage.loadSettings(resolvedUser);
          if (!settings.autoTrack)
            return;
          const snap = await this.tracker.trackTurn(resolvedUser, chatId, {
            targetMessageId: msgId || undefined,
            inlineTagContent: typeof ev.content === "string" && extractInlineStatsTag(ev.content) ? ev.content : undefined
          });
          if (snap)
            await this.broadcastSnapshot(resolvedUser, chatId);
        })().catch((err) => {
          if (isAbortError(err))
            return;
          this.emitToUser(resolvedUser, chatId, {
            type: "error",
            message: err instanceof Error ? err.message : String(err)
          });
        });
      }));
      disposeGenEvents.push(this.api.on("GENERATION_STOPPED", (p, userId) => {
        const chatId = getChatId(p);
        if (chatId) {
          const resolvedUser = this.resolveUserId(userId, chatId);
          this.activeGenerations.delete(`${resolvedUser ?? "__owner__"}:${chatId}`);
        }
      }));
    };
    syncGenerationSubscriptions();
    this.disposers.push(this.api.on("MESSAGE_SENT", (p, userId) => {
      const chatId = getChatId(p);
      if (!chatId)
        return;
      this.rememberActiveChat(userId, chatId);
      const resolvedUser = this.resolveUserId(userId, chatId);
      const o = p ?? {};
      const msg = o.message && typeof o.message === "object" ? o.message : o;
      const content = typeof msg.content === "string" ? msg.content : "";
      if (extractInlineStatsTag(content)) {
        this.rehydrateChatMessages(resolvedUser, chatId).then(() => this.broadcastSnapshot(resolvedUser, chatId));
      }
    }));
    for (const evName of ["MESSAGE_EDITED", "MESSAGE_SWIPED", "SWIPE_EDITED", "MESSAGE_DELETED"]) {
      this.disposers.push(this.api.on(evName, (p, userId) => {
        const chatId = getChatId(p);
        if (!chatId)
          return;
        this.renderCache.invalidateChat(chatId);
        const msgId = getMsgId(p);
        if (evName === "MESSAGE_EDITED" && msgId && this.selfEditedMessages.has(`${chatId}:${msgId}`)) {
          this.selfEditedMessages.delete(`${chatId}:${msgId}`);
          return;
        }
        const resolvedUser = this.resolveUserId(userId, chatId);
        if (this.activeGenerations.has(`${resolvedUser ?? "__owner__"}:${chatId}`) && evName !== "MESSAGE_DELETED") {
          return;
        }
        this.tracker.reconcileMessageChange(resolvedUser, chatId, msgId || undefined).then((snap) => {
          if (snap)
            return this.broadcastSnapshot(resolvedUser, chatId);
        }).catch(() => {
          return;
        });
      }));
    }
    if (this.api.permissions.onChanged) {
      this.disposers.push(this.api.permissions.onChanged((detail) => {
        if (detail.permission === "interceptor") {
          disposeInterceptor?.();
          disposeInterceptor = undefined;
          if (detail.granted)
            ensureInterceptor();
        }
        if (detail.permission === "generation") {
          syncGenerationSubscriptions();
          if (!detail.granted) {
            disposeWorldInfo?.();
            disposeWorldInfo = undefined;
            worldInfoRegistered = false;
          } else {
            ensureWorldInfoInterceptor();
          }
        }
        if (detail.permission === "tools") {
          syncToolsRegistration();
        }
        if (detail.permission === "chat_mutation") {
          if (!detail.granted) {
            disposeContentProc?.();
            disposeContentProc = undefined;
            contentProcRegistered = false;
          } else {
            ensureContentProcessor();
          }
        }
        if (detail.permission === "regex_scripts" && detail.granted) {
          this.syncObfuscatorDisplayRegex(undefined);
        }
      }));
    }
    this.api.log.info("Lumi Stats backend initialized.");
    return () => {
      this.stopped = true;
      disposeInterceptor?.();
      disposeContentProc?.();
      disposeWorldInfo?.();
      for (const fn of disposeGenEvents.splice(0))
        fn();
      for (const fn of this.disposers.splice(0))
        fn();
    };
  }
  async syncObfuscatorDisplayRegex(userId) {
    if (!this.api.permissions.has("regex_scripts") || !this.api.regex_scripts)
      return;
    const resolvedUser = this.resolveUserId(userId);
    try {
      const settings = await this.storage.loadSettings(resolvedUser);
      const { data: existingScripts } = await this.api.regex_scripts.list({
        scope: "global",
        target: "display",
        limit: 200,
        ...resolvedUser ? { userId: resolvedUser } : {}
      });
      const owned = existingScripts.filter((s) => s.can_mutate && (s.folder === "Lumi Stats" || s.script_id.startsWith("lumi_stats_obf_")));
      const shouldRestore = Boolean(settings.sensitiveObfuscatorEnabled) && settings.restoreObfuscatedOnRender !== false;
      const words = shouldRestore ? normalizeSensitiveWordsList(settings.sensitiveWords).slice(0, 40) : [];
      const useOne = settings.obfuscateVowelsWithOne !== false;
      const desiredByScriptId = new Map;
      for (const w of words) {
        const spec = buildWordRestoreRegexSpec(w, useOne);
        if (!spec)
          continue;
        const scriptId = `lumi_stats_obf_${slugifyKey(w, "word")}`;
        desiredByScriptId.set(scriptId, spec);
      }
      const ownedByScriptId = new Map(owned.map((s) => [s.script_id, s]));
      for (const existing of owned) {
        if (!desiredByScriptId.has(existing.script_id)) {
          await this.api.regex_scripts.delete(existing.id).catch(() => {
            return;
          });
        }
      }
      for (const [scriptId, spec] of desiredByScriptId.entries()) {
        if (!spec)
          continue;
        const prev = ownedByScriptId.get(scriptId);
        const payload = {
          name: `Lumi Stats: Restore "${spec.word}"`,
          find_regex: spec.findRegex,
          replace_string: spec.replaceString,
          flags: spec.flags,
          placement: ["ai_output", "user_input"],
          scope: "global",
          target: "display",
          substitute_macros: "none",
          disabled: false,
          folder: "Lumi Stats",
          description: `Restores obfuscated "${spec.word}" in chat display without changing stored history.`
        };
        if (prev) {
          const changed = prev.find_regex !== payload.find_regex || prev.replace_string !== payload.replace_string || prev.flags !== payload.flags || prev.disabled !== false;
          if (changed) {
            await this.api.regex_scripts.update(prev.id, payload).catch(() => {
              return;
            });
          }
        } else {
          await this.api.regex_scripts.create({ ...payload, script_id: scriptId }).catch(() => {
            return;
          });
        }
      }
    } catch {}
  }
}

// src/backend.ts
var stop = new LumiStatsService(spindle).start();
function teardown() {
  stop();
}
export {
  teardown
};
