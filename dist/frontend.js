// src/shared/prose-cleaner.ts
var PROTECTED_BLOCKS_RE = /(<(?:lumi-stats|lumi-tracker|worldweave|json|style|script|pre|code)\b[\s\S]*?<\/(?:lumi-stats|lumi-tracker|worldweave|json|style|script|pre|code)\s*>|```[\s\S]*?```)/gi;
function fnv1a32(input) {
  let hash = 2166136261;
  for (let i = 0;i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
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
  const cleaned = String(raw ?? "").trim().toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 64);
  return cleaned || fallback;
}
function buildProportionalAnchors(min, max, _volatility) {
  const span = max - min;
  if (span <= 0)
    return [{ value: min, label: "Baseline", description: "Default baseline" }];
  const at = (pct) => Math.round(min + span * pct);
  return [
    { value: at(0.85), label: "Very High / Peak", description: "Dominant, intense, or near maximum capacity" },
    { value: at(0.65), label: "High / Strong", description: "Clearly elevated, strong, or well-established" },
    { value: at(0.45), label: "Moderate / Balanced", description: "Standard working baseline or neutral equilibrium" },
    { value: at(0.2), label: "Low / Guarded", description: "Mild, strained, or subdued" },
    { value: min, label: "None / Minimal", description: "Absent, calm baseline, or depleted" }
  ];
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
    { id: "web", label: "Bond Web", icon: "\uD83D\uDD78️", kind: "web", enabled: true, order: 2 },
    { id: "map", label: "Atlas", icon: "\uD83D\uDDFA️", kind: "map", enabled: true, order: 3 },
    { id: "world", label: "World & Clocks", icon: "\uD83C\uDF0D", kind: "world", enabled: true, order: 4 }
  ];
}
function defaultInlineTabs() {
  return [
    { id: "stats", label: "Stats", icon: "\uD83D\uDCCA", kind: "stats", enabled: true, order: 0 },
    { id: "cast", label: "Cast", icon: "\uD83D\uDC65", kind: "cast", enabled: true, order: 1 },
    { id: "web", label: "Bond Web", icon: "\uD83D\uDD78️", kind: "web", enabled: true, order: 2 },
    { id: "world", label: "World", icon: "\uD83C\uDF0D", kind: "world", enabled: true, order: 3 }
  ];
}
function defaultDossierTabs() {
  return [
    {
      id: "overview",
      label: "Overview",
      icon: "✨",
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
      label: "Peer Bonds (NPC↔NPC)",
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
      icon: "\uD83D\uDD75️",
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
    playerActionInstruction: "Summarize the player character’s most consequential current action.",
    showPlayerActionCard: true,
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
      placeholder: "e.g. Loyal personal maid, Childhood rival…",
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
      placeholder: "e.g. Flustered, Guarded, Warm…",
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
      placeholder: "Unspoken internal thought in this moment…",
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
      placeholder: "What this character is trying to do right now…",
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
    icon: "✨",
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
        icon: "\uD83D\uDEE1️",
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
        icon: "⚜️",
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
        icon: "❤️",
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
        icon: "⏱️",
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
        icon: "✨",
        scope: "character",
        kind: "meter",
        min: 0,
        max: 100,
        defaultValue: 35,
        color: "#f472b6",
        volatility: "momentary",
        pinnedToHeader: true,
        dossierTabId: "bonds",
        triggerCues: "0–100 scale. Rises on playful banter, shared silences, eye contact, and romantic tension; cools on awkwardness."
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
        triggerCues: "0–6 segments. Advances as physical proximity, vulnerability, or romantic confession builds in the scene."
      })
    ]
  },
  {
    ...createDefaultTemplate(),
    id: "tactical_adventure",
    name: "Adventure, Party & World Clocks",
    icon: "⚔️",
    description: "Vitality, Resolve, Party Loyalty, Trust, and World Threat Clocks for fantasy or sci-fi campaigns.",
    stats: [
      createStatSchema({
        id: "vitality",
        label: "Vitality",
        icon: "❤️",
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
        icon: "⚡",
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
    icon: "\uD83D\uDD75️",
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
        icon: "\uD83D\uDC41️",
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
    icon: "⚔️",
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
        icon: "❤️",
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
        icon: "⭐",
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
        icon: "⚡",
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
        icon: "⭐",
        scope: "player",
        kind: "attributes",
        min: 1,
        max: 10,
        defaultValue: "Knowledge:2, Charm:2, Courage:2, Kindness:2, Proficiency:2",
        color: "#f43f5e",
        layoutSpan: "full",
        volatility: "progressive",
        triggerCues: 'Comma-separated 1–10 qualities: "Knowledge:N, Charm:N, Courage:N, Kindness:N, Proficiency:N".'
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
        icon: "❤️",
        scope: "character",
        kind: "hearts",
        min: 0,
        max: 10,
        defaultValue: 3,
        color: "#f472b6",
        volatility: "progressive",
        pinnedToHeader: true,
        triggerCues: "0–10 heart rank. Increases on meaningful hangouts, honesty, or breakthroughs."
      }),
      ...createDefaultTemplate().stats.filter((s) => s.scope === "character" || s.scope === "world")
    ]
  }
];
var BUILTIN_VISUAL_SKINS = [
  {
    schema: "lumi-stats-skin/v1",
    name: "Adaptive Lumiverse Glass",
    surfaceStyle: "glass",
    frameShape: "rounded",
    meterStyle: "smooth",
    glowIntensity: 45,
    glassBlur: true,
    castLayout: "roster"
  },
  {
    schema: "lumi-stats-skin/v1",
    name: "Arcane Fantasy RPG",
    surfaceStyle: "arcane_rpg",
    frameShape: "ornate",
    meterStyle: "glow",
    accentHue: 42,
    secondaryHue: 198,
    glowIntensity: 70,
    glassBlur: true,
    castLayout: "roster"
  },
  {
    schema: "lumi-stats-skin/v1",
    name: "Cyber Tactical HUD",
    surfaceStyle: "cyber_hud",
    frameShape: "chamfered",
    meterStyle: "segmented",
    accentHue: 190,
    secondaryHue: 315,
    glowIntensity: 85,
    glassBlur: true,
    castLayout: "roster"
  },
  {
    schema: "lumi-stats-skin/v1",
    name: "Stylish Social Sim (Pop)",
    surfaceStyle: "persona_pop",
    frameShape: "sharp",
    meterStyle: "segmented",
    accentHue: 348,
    secondaryHue: 48,
    glowIntensity: 60,
    glassBlur: false,
    castLayout: "roster"
  },
  {
    schema: "lumi-stats-skin/v1",
    name: "Cozy Visual Novel",
    surfaceStyle: "cozy_vn",
    frameShape: "rounded",
    meterStyle: "smooth",
    accentHue: 330,
    secondaryHue: 200,
    glowIntensity: 40,
    glassBlur: true,
    castLayout: "roster"
  }
];
function extractSkinPackFromTemplate(tpl) {
  return {
    schema: "lumi-stats-skin/v1",
    name: `${tpl.name} Skin`,
    surfaceStyle: tpl.theme.surfaceStyle ?? "glass",
    frameShape: tpl.theme.frameShape ?? (tpl.theme.radiusPreset === "sharp" ? "sharp" : "rounded"),
    meterStyle: tpl.theme.meterStyle ?? "smooth",
    ...tpl.theme.accentHue !== undefined ? { accentHue: tpl.theme.accentHue } : {},
    ...tpl.theme.secondaryHue !== undefined ? { secondaryHue: tpl.theme.secondaryHue } : {},
    glowIntensity: tpl.theme.glowIntensity ?? 55,
    glassBlur: tpl.theme.glassBlur !== false,
    compact: Boolean(tpl.theme.compact),
    castLayout: tpl.theme.castLayout ?? "roster",
    ...tpl.theme.customCss ? { customCss: tpl.theme.customCss } : {}
  };
}
function normalizeSkinPack(rawInput) {
  const raw = rawInput && typeof rawInput === "object" ? rawInput : {};
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
  const surfaceStyle = validStyles.has(String(raw.surfaceStyle)) ? raw.surfaceStyle : "glass";
  const frameShape = raw.frameShape === "chamfered" || raw.frameShape === "sharp" || raw.frameShape === "ornate" ? raw.frameShape : "rounded";
  const meterStyle = raw.meterStyle === "segmented" || raw.meterStyle === "glow" ? raw.meterStyle : "smooth";
  const castLayout = raw.castLayout === "cards" ? "cards" : "roster";
  const accentHue = typeof raw.accentHue === "number" && Number.isFinite(raw.accentHue) ? Math.max(0, Math.min(360, Math.round(raw.accentHue))) : undefined;
  const secondaryHue = typeof raw.secondaryHue === "number" && Number.isFinite(raw.secondaryHue) ? Math.max(0, Math.min(360, Math.round(raw.secondaryHue))) : undefined;
  const glowIntensity = typeof raw.glowIntensity === "number" && Number.isFinite(raw.glowIntensity) ? Math.max(0, Math.min(100, Math.round(raw.glowIntensity))) : 55;
  return {
    schema: "lumi-stats-skin/v1",
    name: String(raw.name ?? "Imported Skin").trim().slice(0, 80) || "Imported Skin",
    surfaceStyle,
    frameShape,
    meterStyle,
    ...accentHue !== undefined ? { accentHue } : {},
    ...secondaryHue !== undefined ? { secondaryHue } : {},
    glowIntensity,
    glassBlur: raw.glassBlur !== false,
    compact: Boolean(raw.compact),
    castLayout,
    ...typeof raw.customCss === "string" && raw.customCss.trim() ? { customCss: raw.customCss.slice(0, 8000) } : {}
  };
}
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

// src/shared/types.ts
var LUMI_STATS_CHANNEL = "lumi_stats/v1";

// src/frontend/icons.ts
var ICON_PATHS = {
  sync: '<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.85 1 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronUp: '<path d="m18 15-6-6-6 6"/>',
  more: '<circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/><circle cx="5" cy="12" r="1.2"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  pin: '<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1Z"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  unlock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
  sliders: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
  stage: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m10 9 5 3-5 3Z"/>',
  stats: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  network: '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M10.8 7.2 6.2 16.8"/><path d="m13.2 7.2 4.6 9.6"/><path d="M7.5 19h9"/>',
  map: '<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>',
  globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  volume: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
  flask: '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
  resize: '<path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/>',
  palette: '<circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2Z"/>',
  sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>'
};
function svgIcon(name, size = 14) {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.9");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("ls-svg-icon");
  svg.innerHTML = ICON_PATHS[name];
  return svg;
}

// src/frontend/stage/tts-engine.ts
var TTS_DB_NAME = "lumi_stats_tts_cache_v1";
var TTS_STORE_NAME = "clips";
var MAX_MEM_CLIPS = 60;
var MAX_IDB_CLIPS = 80;
function splitBeatIntoVoiceSegments(beatText, beatSpeaker, state, settings) {
  const readMode = settings?.ttsReadMode || "dialogue_only";
  const cleanBeat = String(beatText || "").replace(/^\s*(?:\*\*[^*\n:：]{1,48}\s*[:：]\*\*|[A-Z][\p{L}\p{N}_' -]{1,40}\s*[:：])\s*/mu, "").trim();
  if (!cleanBeat)
    return [];
  const defaultNarratorConn = settings?.narratorConnectionId || "";
  const defaultNarratorVoice = settings?.narratorVoiceId || "";
  const defaultNarratorModel = settings?.narratorModel || "";
  const defaultNarratorSpeed = settings?.narratorSpeed || 1;
  const actorVoice = beatSpeaker.matchedActor?.ttsVoice;
  const charConn = actorVoice?.connectionId || defaultNarratorConn;
  const charVoice = actorVoice?.voiceId || defaultNarratorVoice;
  const charModel = actorVoice?.model || defaultNarratorModel;
  const charSpeed = actorVoice?.speed || 1;
  const quoteRe = /(?:"([^"\n]{1,})"|“([^”\n]{1,})”|「([^」\n]{1,})」|『([^』\n]{1,})』)/g;
  const segments = [];
  let lastIndex = 0;
  let match;
  const pushNarration = (rawText) => {
    if (readMode === "dialogue_only")
      return;
    const stripped = rawText.replace(/\*+/g, "").replace(/\s+/g, " ").trim();
    if (!stripped || stripped.length < 2)
      return;
    segments.push({
      kind: "narration",
      text: stripped,
      speakerName: "Narrator",
      connectionId: defaultNarratorConn,
      voiceId: defaultNarratorVoice,
      model: defaultNarratorModel,
      speed: defaultNarratorSpeed
    });
  };
  const pushDialogue = (rawText) => {
    if (readMode === "narration_only")
      return;
    if (actorVoice?.muted)
      return;
    const stripped = rawText.replace(/\*+/g, "").replace(/\s+/g, " ").trim();
    if (!stripped)
      return;
    segments.push({
      kind: "dialogue",
      text: stripped,
      speakerName: beatSpeaker.speakerName,
      actorId: beatSpeaker.matchedActor?.id,
      connectionId: charConn,
      voiceId: charVoice,
      model: charModel,
      speed: charSpeed
    });
  };
  while ((match = quoteRe.exec(cleanBeat)) !== null) {
    if (match.index > lastIndex) {
      pushNarration(cleanBeat.slice(lastIndex, match.index));
    }
    const quoted = (match[1] ?? match[2] ?? match[3] ?? match[4] ?? "").trim();
    if (quoted) {
      pushDialogue(quoted);
    }
    lastIndex = quoteRe.lastIndex;
  }
  if (lastIndex < cleanBeat.length) {
    const tail = cleanBeat.slice(lastIndex);
    if (segments.length === 0 && !beatSpeaker.isNarrator && beatSpeaker.matchedActor) {
      pushDialogue(tail);
    } else {
      pushNarration(tail);
    }
  }
  return segments;
}

class LumiTtsEngine {
  connectionsCache = null;
  voicesByConnId = new Map;
  memUrlCache = new Map;
  inFlightSynth = new Map;
  dbPromise = null;
  activeAudio = null;
  playToken = 0;
  isPlaying = false;
  activeSpeakerLabel = "";
  cacheHitCount = 0;
  openDb() {
    if (this.dbPromise)
      return this.dbPromise;
    if (typeof indexedDB === "undefined")
      return Promise.resolve(null);
    this.dbPromise = new Promise((resolve) => {
      try {
        const req = indexedDB.open(TTS_DB_NAME, 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(TTS_STORE_NAME)) {
            db.createObjectStore(TTS_STORE_NAME, { keyPath: "key" });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
    return this.dbPromise;
  }
  async listConnections(forceRefresh = false) {
    if (this.connectionsCache && !forceRefresh)
      return this.connectionsCache;
    try {
      const res = await fetch("/api/v1/tts-connections?limit=25", {
        credentials: "include"
      });
      if (!res.ok)
        return this.connectionsCache ?? [];
      const body = await res.json();
      const list = Array.isArray(body?.data) ? body.data : [];
      this.connectionsCache = list.map((c) => ({
        id: String(c.id ?? ""),
        name: String(c.name ?? "TTS Connection"),
        provider: String(c.provider ?? ""),
        model: String(c.model ?? ""),
        voice: String(c.voice ?? ""),
        is_default: Boolean(c.is_default)
      }));
      return this.connectionsCache;
    } catch {
      return this.connectionsCache ?? [];
    }
  }
  async listVoicesForConnection(connectionId) {
    if (!connectionId)
      return [];
    const cached = this.voicesByConnId.get(connectionId);
    if (cached)
      return cached;
    try {
      const res = await fetch(`/api/v1/tts-connections/${encodeURIComponent(connectionId)}/voices`, {
        credentials: "include"
      });
      if (!res.ok)
        return [];
      const body = await res.json();
      const rawList = Array.isArray(body?.voices) ? body.voices : Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];
      const voices = rawList.map((v) => ({
        id: String(v.id ?? v.voice_id ?? v.name ?? ""),
        name: String(v.name ?? v.label ?? v.id ?? ""),
        ...typeof v.gender === "string" ? { gender: v.gender } : {}
      })).filter((v) => Boolean(v.id));
      this.voicesByConnId.set(connectionId, voices);
      return voices;
    } catch {
      return [];
    }
  }
  rememberMemUrl(key, objUrl) {
    const prev = this.memUrlCache.get(key);
    if (prev && prev !== objUrl && prev.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(prev);
      } catch {}
    }
    this.memUrlCache.delete(key);
    while (this.memUrlCache.size >= MAX_MEM_CLIPS) {
      const oldestKey = this.memUrlCache.keys().next().value;
      if (!oldestKey)
        break;
      const oldUrl = this.memUrlCache.get(oldestKey);
      if (oldUrl?.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(oldUrl);
        } catch {}
      }
      this.memUrlCache.delete(oldestKey);
    }
    this.memUrlCache.set(key, objUrl);
  }
  async readFromIdbCache(key) {
    const db = await this.openDb();
    if (!db)
      return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(TTS_STORE_NAME, "readonly");
        const req = tx.objectStore(TTS_STORE_NAME).get(key);
        req.onsuccess = () => {
          const row = req.result;
          resolve(row?.blob instanceof Blob ? row.blob : null);
        };
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }
  async writeToIdbCache(key, blob) {
    const db = await this.openDb();
    if (!db)
      return;
    await new Promise((resolve) => {
      try {
        const tx = db.transaction(TTS_STORE_NAME, "readwrite");
        const store = tx.objectStore(TTS_STORE_NAME);
        store.put({ key, blob, updatedAt: Date.now() });
        const countReq = store.count();
        countReq.onsuccess = () => {
          if (countReq.result > MAX_IDB_CLIPS) {
            const cursorReq = store.openCursor();
            cursorReq.onsuccess = () => {
              const cursor = cursorReq.result;
              if (cursor)
                cursor.delete();
            };
          }
        };
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }
  async synthesizeSegmentCached(segment) {
    const conns = await this.listConnections();
    const matchedConn = (segment.connectionId ? conns.find((c) => c.id === segment.connectionId) : undefined) ?? conns.find((c) => c.is_default) ?? conns[0];
    if (!matchedConn?.id)
      return null;
    const connId = matchedConn.id;
    const model = segment.model || matchedConn.model || "";
    const voice = segment.voiceId || matchedConn.voice || "";
    const cleanText = segment.text.trim();
    if (!cleanText)
      return null;
    const cacheKey = `tts_${fnv1a32(`${connId}|${model}|${voice}|${cleanText.toLowerCase()}`)}`;
    const memHit = this.memUrlCache.get(cacheKey);
    if (memHit) {
      this.cacheHitCount++;
      this.rememberMemUrl(cacheKey, memHit);
      return memHit;
    }
    const pending = this.inFlightSynth.get(cacheKey);
    if (pending)
      return pending;
    const task = (async () => {
      const idbBlob = await this.readFromIdbCache(cacheKey);
      if (idbBlob) {
        this.cacheHitCount++;
        const url = URL.createObjectURL(idbBlob);
        this.rememberMemUrl(cacheKey, url);
        return url;
      }
      try {
        const res = await fetch("/api/v1/tts/synthesize", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            connectionId: connId,
            ...model ? { model } : {},
            ...voice ? { voice } : {},
            text: cleanText,
            outputFormat: "mp3"
          })
        });
        if (!res.ok)
          return null;
        const blob = await res.blob();
        if (!blob.size)
          return null;
        this.writeToIdbCache(cacheKey, blob);
        const url = URL.createObjectURL(blob);
        this.rememberMemUrl(cacheKey, url);
        return url;
      } catch {
        return null;
      }
    })();
    this.inFlightSynth.set(cacheKey, task);
    try {
      return await task;
    } finally {
      if (this.inFlightSynth.get(cacheKey) === task) {
        this.inFlightSynth.delete(cacheKey);
      }
    }
  }
  prefetchSegments(segments) {
    for (const seg of segments.slice(0, 3)) {
      this.synthesizeSegmentCached(seg);
    }
  }
  stop() {
    this.playToken++;
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.removeAttribute("src");
      } catch {}
      this.activeAudio = null;
    }
    this.isPlaying = false;
    this.activeSpeakerLabel = "";
  }
  async playSegments(segments, onStateChange) {
    this.stop();
    if (!segments.length) {
      onStateChange?.();
      return false;
    }
    const myToken = ++this.playToken;
    this.isPlaying = true;
    onStateChange?.();
    const urlPromises = segments.map((seg) => this.synthesizeSegmentCached(seg));
    for (let i = 0;i < segments.length; i++) {
      if (this.playToken !== myToken)
        return false;
      const seg = segments[i];
      const audioUrl = await urlPromises[i];
      if (!audioUrl || this.playToken !== myToken)
        continue;
      this.activeSpeakerLabel = seg.speakerName;
      onStateChange?.();
      await new Promise((resolve) => {
        if (this.playToken !== myToken) {
          resolve();
          return;
        }
        const audio = new Audio(audioUrl);
        audio.playbackRate = Math.max(0.5, Math.min(2, seg.speed || 1));
        this.activeAudio = audio;
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
        audio.play().catch(() => resolve());
      });
    }
    if (this.playToken === myToken) {
      this.isPlaying = false;
      this.activeSpeakerLabel = "";
      this.activeAudio = null;
      onStateChange?.();
      return true;
    }
    return false;
  }
  destroy() {
    this.stop();
    for (const url of this.memUrlCache.values()) {
      if (url.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      }
    }
    this.memUrlCache.clear();
    this.inFlightSynth.clear();
  }
}

// src/frontend/styles.ts
var LUMI_STATS_CSS = `
:where(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) {
  --ls-bg: var(--lumiverse-bg, #0b1120);
  --ls-surface: var(--lumiverse-bg-elevated, #131c31);
  --ls-fill: var(--lumiverse-fill-subtle, rgba(148, 163, 184, 0.06));
  --ls-fill-hover: var(--lumiverse-fill-hover, rgba(148, 163, 184, 0.12));
  --ls-glass: var(--lcs-glass-bg, color-mix(in srgb, var(--ls-surface) 92%, transparent));
  --ls-glass-border: var(--lcs-glass-border, color-mix(in srgb, var(--lumiverse-border, rgba(148, 163, 184, 0.2)) 85%, transparent));
  --ls-blur: var(--lcs-glass-blur, blur(14px));
  --ls-text: var(--lumiverse-text, #f1f5f9);
  --ls-muted: var(--lumiverse-text-muted, #94a3b8);
  --ls-dim: var(--lumiverse-text-dim, #64748b);
  --ls-primary: var(--lumiverse-primary, #38bdf8);
  --ls-accent: var(--lumiverse-accent, #818cf8);
  --ls-border: color-mix(in srgb, var(--lumiverse-border, rgba(148, 163, 184, 0.2)) 78%, transparent);
  --ls-border-hover: var(--lumiverse-border-hover, color-mix(in srgb, var(--ls-primary) 42%, var(--ls-border)));
  --ls-success: var(--lumiverse-success, #10b981);
  --ls-danger: var(--lumiverse-danger, #f43f5e);
  --ls-warning: var(--lumiverse-warning, #f59e0b);
  --ls-radius: var(--lumiverse-radius, 12px);
  --ls-glow: 0.35;
  --ls-fast: var(--lumiverse-transition-fast, 140ms ease);
  --ls-font: var(--lumiverse-font-family, system-ui, -apple-system, sans-serif);
  --ls-mono: var(--lumiverse-font-mono, ui-monospace, monospace);
}

.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay {
  color: var(--ls-text);
  font-family: var(--ls-font);
  font-size: 13px;
  line-height: 1.5;
  box-sizing: border-box;
  isolation: isolate;
}

:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) *,
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) *::before,
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) *::after {
  box-sizing: border-box;
}

.ls-svg-icon {
  flex: none;
  display: inline-block;
  vertical-align: middle;
}

.ls-root {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-height: 100%;
  min-height: 0;
  background: var(--ls-surface);
  overflow: hidden;
  container-type: inline-size;
}

/* Full-Window Studio Overlay */
.ls-studio-overlay {
  position: fixed;
  inset: 0;
  width: var(--app-scaled-viewport-width, 100vw);
  height: var(--app-scaled-viewport-height, 100vh);
  background: radial-gradient(circle at 18% 0%, color-mix(in srgb, var(--ls-primary) 9%, transparent), transparent 48%), color-mix(in srgb, var(--ls-bg) 97%, transparent);
  backdrop-filter: blur(22px);
  z-index: 950;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  container-type: inline-size;
}
.ls-studio-overlay.ls-studio-in-modal {
  position: relative;
  inset: auto;
  width: 100%;
  height: 100%;
  min-height: 0;
  z-index: auto;
}
.ls-studio-topbar {
  flex: none;
  padding: 10px 20px;
  border-bottom: 1px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-surface) 94%, transparent);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.ls-studio-workspace {
  flex: 1 1 0%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
}
@container (min-width: 980px) {
  .ls-studio-workspace {
    display: grid;
    grid-template-columns: 228px minmax(0, 1.45fr) minmax(340px, 0.85fr);
    overflow: hidden;
  }
}
.ls-studio-sidebar {
  flex: none;
  padding: 12px 10px;
  border-bottom: 1px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-bg) 38%, var(--ls-surface));
  display: flex;
  flex-direction: row;
  gap: 5px;
  overflow-x: auto;
}
@container (min-width: 980px) {
  .ls-studio-sidebar {
    flex-direction: column;
    border-bottom: 0;
    border-right: 1px solid var(--ls-border);
    overflow-y: auto;
    overflow-x: hidden;
  }
}
.ls-studio-nav-btn {
  width: 100%;
  justify-content: flex-start !important;
  text-align: left;
  padding: 9px 12px !important;
  border-radius: calc(var(--ls-radius) - 2px) !important;
  border-color: transparent !important;
  background: transparent !important;
  display: flex !important;
  flex-direction: column;
  align-items: flex-start !important;
  gap: 2px !important;
  min-width: 165px;
}
.ls-studio-nav-btn:hover:not(:disabled) {
  background: var(--ls-fill) !important;
}
.ls-studio-nav-btn[aria-current="page"] {
  background: color-mix(in srgb, var(--ls-primary) 14%, transparent) !important;
  border-color: color-mix(in srgb, var(--ls-primary) 38%, transparent) !important;
  color: var(--ls-text) !important;
}
@container (min-width: 980px) {
  .ls-studio-nav-btn {
    min-width: 0;
  }
}
.ls-studio-nav-title {
  font-size: 12.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 7px;
}
.ls-studio-nav-sub {
  font-size: 11px;
  font-weight: 450;
  color: var(--ls-muted);
}
.ls-studio-pane {
  flex: none;
  padding: 18px 20px calc(22px + var(--ls-kb-inset, 0px));
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.ls-studio-preview-pane {
  flex: none;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
@container (min-width: 980px) {
  .ls-studio-pane {
    height: 100%;
    min-height: 0;
    overflow-y: auto;
    scrollbar-width: thin;
  }
  .ls-studio-preview-pane {
    height: 100%;
    min-height: 0;
    overflow-y: auto;
    padding: 18px 18px 18px 0;
    scrollbar-width: thin;
  }
}
.ls-hero-banner {
  padding: 14px 16px;
  border-radius: var(--ls-radius);
  border: 1px solid color-mix(in srgb, var(--ls-primary) 26%, var(--ls-border));
  background: linear-gradient(135deg, color-mix(in srgb, var(--ls-primary) 9%, var(--ls-surface)), var(--ls-surface));
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ls-preset-card {
  padding: 13px 14px;
  border-radius: var(--ls-radius);
  border: 1px solid var(--ls-border);
  background: var(--ls-fill);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  transition: border-color var(--ls-fast), background var(--ls-fast), transform var(--ls-fast);
}
.ls-preset-card:hover {
  border-color: var(--ls-border-hover);
  background: var(--ls-fill-hover);
  transform: translateY(-1px);
}
.ls-preset-card[data-active="true"] {
  border-color: color-mix(in srgb, var(--ls-primary) 65%, var(--ls-border));
  background: color-mix(in srgb, var(--ls-primary) 8%, var(--ls-surface));
}
.ls-subnav-pills {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: calc(var(--ls-radius) - 2px);
  border: 1px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-bg) 42%, var(--ls-surface));
  flex-wrap: wrap;
}
.ls-quick-pill {
  border-style: dashed !important;
  font-size: 11.5px !important;
}

/* Typography */
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) h2 {
  font-size: 17px;
  font-weight: 750;
  letter-spacing: -0.02em;
  margin: 0 0 4px;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) h3 {
  font-size: 13.5px;
  font-weight: 700;
  margin: 0 0 4px;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) p {
  margin: 3px 0;
  overflow-wrap: anywhere;
}
.ls-kicker {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--ls-muted);
}
.ls-muted {
  color: var(--ls-muted);
  font-size: 12px;
}

/* Tactile Controls */
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) :is(button, input, select, textarea) {
  font: inherit;
  color: inherit;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) button {
  min-height: 32px;
  padding: 5px 10px;
  border-radius: calc(var(--ls-radius) - 4px);
  border: 1px solid var(--ls-border);
  background: var(--ls-fill);
  color: var(--ls-text);
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
  transition: background var(--ls-fast), border-color var(--ls-fast), transform var(--ls-fast);
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) button:hover:not(:disabled) {
  background: var(--ls-fill-hover);
  border-color: var(--ls-border-hover);
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) button:active:not(:disabled) {
  transform: translateY(1px);
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) :is(button[aria-current="page"], button[aria-pressed="true"], .ls-btn-primary) {
  background: color-mix(in srgb, var(--ls-primary) 18%, var(--ls-surface));
  color: var(--ls-text);
  border-color: color-mix(in srgb, var(--ls-primary) 58%, var(--ls-border));
  font-weight: 700;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) .ls-btn-primary {
  background: var(--ls-primary);
  color: var(--lumiverse-primary-contrast, #04131d);
  border-color: var(--ls-primary);
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) .ls-btn-sm {
  min-height: 26px;
  padding: 3px 8px;
  font-size: 11px;
  border-radius: 7px;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) .ls-btn-icon {
  min-width: 26px;
  min-height: 26px;
  padding: 4px;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) .ls-btn-ghost {
  background: transparent;
  border-color: transparent;
  color: var(--ls-muted);
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) .ls-btn-ghost:hover:not(:disabled) {
  background: var(--ls-fill-hover);
  color: var(--ls-text);
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) .ls-btn-danger:hover:not(:disabled) {
  border-color: var(--ls-danger);
  color: var(--ls-danger);
}

.ls-input {
  display: block;
  width: 100%;
  min-height: 34px;
  padding: 6px 10px;
  border-radius: calc(var(--ls-radius) - 4px);
  border: 1px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-bg) 55%, var(--ls-surface));
  color: var(--ls-text);
  font-size: 12.5px;
}
.ls-input:focus {
  outline: none;
  border-color: var(--ls-primary);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--ls-primary) 20%, transparent);
}
select.ls-input, .ls-select {
  cursor: pointer;
}
select.ls-input option, .ls-select option {
  background-color: var(--lumiverse-bg-elevated, var(--ls-surface));
  color: var(--ls-text);
}
textarea.ls-input {
  min-height: 68px;
  resize: vertical;
}
.ls-label {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: var(--ls-muted);
  margin-bottom: 10px;
}

/* Layout Containers */
.ls-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.ls-row-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}
.ls-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
  gap: 8px;
}

/* Game Skins, Frame Shapes, Blur & Density */
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-style="sleek"] {
  color-scheme: dark;
  --ls-bg: #080c15;
  --ls-glass: #0d1322;
  --ls-surface: #11192c;
  --ls-text: #f1f5f9;
  --ls-muted: #94a3b8;
  --ls-fill: rgba(255, 255, 255, 0.045);
  --ls-fill-hover: rgba(255, 255, 255, 0.09);
  --ls-glass-border: rgba(148, 163, 184, 0.18);
  --ls-border: rgba(148, 163, 184, 0.16);
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-style="minimal"] {
  --ls-glass: var(--lumiverse-bg, #0b1120);
  --ls-glass-border: var(--lumiverse-border, rgba(148, 163, 184, 0.16));
  --ls-blur: none;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-style="soft"] {
  --ls-glass: var(--lumiverse-bg-elevated, var(--ls-surface));
  --ls-glass-border: color-mix(in srgb, var(--ls-primary) 18%, var(--ls-border));
  --ls-blur: none;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-style="neon"] {
  color-scheme: dark;
  --ls-bg: #050812;
  --ls-glass: rgba(10, 15, 30, 0.92);
  --ls-surface: #0d1428;
  --ls-text: #f8fafc;
  --ls-muted: #94a3b8;
  --ls-glass-border: color-mix(in srgb, var(--ls-primary) 42%, rgba(148, 163, 184, 0.2));
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-style="arcane_rpg"] {
  color-scheme: dark;
  --ls-bg: #0e0c0a;
  --ls-surface: #181411;
  --ls-glass: linear-gradient(160deg, rgba(28, 23, 18, 0.96), rgba(14, 12, 10, 0.96));
  --ls-text: #fef3c7;
  --ls-muted: #d6c5a3;
  --ls-primary: #f59e0b;
  --ls-accent: #38bdf8;
  --ls-fill: rgba(245, 158, 11, 0.06);
  --ls-fill-hover: rgba(245, 158, 11, 0.12);
  --ls-border: rgba(245, 158, 11, 0.2);
  --ls-glass-border: rgba(245, 158, 11, 0.34);
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-style="cyber_hud"] {
  color-scheme: dark;
  --ls-bg: #040814;
  --ls-surface: #091224;
  --ls-glass:
    repeating-linear-gradient(0deg, rgba(56, 189, 248, 0.025) 0 1px, transparent 1px 4px),
    linear-gradient(145deg, rgba(7, 15, 32, 0.94), rgba(4, 9, 20, 0.96));
  --ls-text: #e0f2fe;
  --ls-muted: #7dd3fc;
  --ls-fill: rgba(56, 189, 248, 0.06);
  --ls-fill-hover: rgba(56, 189, 248, 0.13);
  --ls-border: rgba(56, 189, 248, 0.22);
  --ls-glass-border: color-mix(in srgb, var(--ls-primary) 48%, transparent);
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-style="persona_pop"] {
  color-scheme: dark;
  --ls-bg: #0f070a;
  --ls-surface: #1b0c12;
  --ls-glass: linear-gradient(155deg, rgba(28, 11, 18, 0.96), rgba(13, 6, 10, 0.97));
  --ls-text: #fff1f2;
  --ls-muted: #fda4af;
  --ls-primary: #f43f5e;
  --ls-accent: #facc15;
  --ls-fill: rgba(244, 63, 94, 0.08);
  --ls-fill-hover: rgba(244, 63, 94, 0.16);
  --ls-border: rgba(255, 255, 255, 0.18);
  --ls-glass-border: rgba(244, 63, 94, 0.56);
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-style="cozy_vn"] {
  --ls-glass: linear-gradient(160deg, color-mix(in srgb, var(--ls-surface) 94%, var(--ls-primary) 6%), var(--ls-surface));
  --ls-glass-border: color-mix(in srgb, var(--ls-primary) 26%, var(--ls-border));
}

:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-frame="sharp"] {
  --ls-radius: 3px;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-frame="rounded"] {
  --ls-radius: 14px;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-frame="chamfered"] {
  --ls-radius: 4px;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-frame="chamfered"] :is(.ls-hud, .ls-inline-card, .ls-card) {
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-frame="ornate"] :is(.ls-hud, .ls-inline-card, .ls-card) {
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--ls-primary) 20%, transparent),
    0 6px 24px rgba(0, 0, 0, 0.35);
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-blur="false"] {
  --ls-blur: none;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-compact="true"] {
  font-size: 12px;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-compact="true"] .ls-card {
  padding: 9px 11px;
  gap: 6px;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-compact="true"] .ls-stat-cell {
  padding: 7px 9px;
  gap: 4px;
}

.ls-card {
  padding: 12px 14px;
  border-radius: var(--ls-radius);
  border: 1px solid var(--ls-glass-border);
  background: var(--ls-glass);
  backdrop-filter: var(--ls-blur);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Chips & Delta Badges */
.ls-chip {
  display: inline-flex;
  align-items: center;
  gap: 4.5px;
  padding: 2.5px 8.5px;
  border-radius: 999px;
  border: 1px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-fill) 90%, transparent);
  font-size: 11px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  max-width: 240px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ls-chip-accent {
  border-color: color-mix(in srgb, var(--ls-primary) 45%, var(--ls-border));
  background: color-mix(in srgb, var(--ls-primary) 13%, var(--ls-surface));
  color: var(--ls-text);
}
.ls-presence-pill {
  cursor: pointer;
  user-select: none;
}
.ls-delta {
  display: inline-flex;
  align-items: center;
  padding: 1px 6px;
  border-radius: 999px;
  font-size: 10.5px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.ls-delta.is-pos {
  color: var(--ls-success);
  background: color-mix(in srgb, var(--ls-success) 15%, transparent);
}
.ls-delta.is-neg {
  color: var(--ls-danger);
  background: color-mix(in srgb, var(--ls-danger) 15%, transparent);
}

/* Drawer Layout */
.ls-drawer-head {
  padding: 10px 14px;
  border-bottom: 1px solid var(--ls-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex: none;
}
.ls-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 750;
}
.ls-brand-mark {
  width: 24px;
  height: 24px;
  border-radius: 7px;
  background: color-mix(in srgb, var(--ls-primary) 16%, transparent);
  border: 1px solid color-mix(in srgb, var(--ls-primary) 65%, transparent);
  color: var(--ls-primary);
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 800;
}
.ls-drawer-nav {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-bottom: 1px solid var(--ls-border);
  overflow-x: auto;
  scrollbar-width: none;
  flex: none;
}
.ls-drawer-nav::-webkit-scrollbar {
  display: none;
}
.ls-drawer-nav > button {
  flex: 1 0 auto;
  white-space: nowrap;
}
.ls-drawer-body {
  flex: 1 1 0%;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 14px calc(14px + var(--ls-kb-inset, 0px));
  display: flex;
  flex-direction: column;
  gap: 10px;
  scrollbar-width: thin;
}
.ls-status-bar {
  padding: 6px 14px;
  border-top: 1px solid var(--ls-border);
  font-size: 11.5px;
  color: var(--ls-muted);
  flex: none;
}
.ls-status-bar:empty {
  display: none;
}
.ls-status-bar[data-error="true"] {
  color: var(--ls-danger);
}

/* Stat Cells, Compact Rows, Bipolar Bars & Clocks */
.ls-stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 170px), 1fr));
  gap: 8px;
  align-items: start;
}
.ls-stat-cell[data-span="full"] {
  grid-column: 1 / -1;
}
.ls-stat-row-compact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 10px;
  border-radius: calc(var(--ls-radius) - 4px);
  border: 1px solid var(--ls-border);
  background: var(--ls-fill);
  transition: border-color var(--ls-fast), background var(--ls-fast);
}
.ls-stat-row-compact:hover {
  border-color: var(--ls-border-hover);
  background: var(--ls-fill-hover);
}
.ls-feed-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 2px;
}
.ls-feed-card {
  padding: 6px 9px;
  border-radius: 8px;
  border-left: 2px solid color-mix(in srgb, var(--ls-primary) 55%, transparent);
  background: color-mix(in srgb, var(--ls-bg) 38%, transparent);
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.ls-feed-subject {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--ls-primary);
  display: flex;
  align-items: center;
  gap: 5px;
}
.ls-step-chain {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
}
.ls-step-strip {
  padding: 5px 7px;
  border-radius: 7px;
  background: color-mix(in srgb, var(--ls-bg) 30%, transparent);
}
.ls-step-node {
  display: inline-flex;
  align-items: center;
  padding: 2.5px 7.5px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--ls-fill) 115%, transparent);
  font-size: 11.5px;
  line-height: 1.35;
  color: var(--ls-text);
}
.ls-step-node:last-child {
  background: color-mix(in srgb, var(--ls-primary) 13%, var(--ls-surface));
  font-weight: 600;
}
.ls-step-arrow {
  color: var(--ls-muted);
  font-size: 11px;
  font-weight: 700;
  user-select: none;
}
.ls-kv-grid {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 2px;
}
.ls-kv-row {
  display: grid;
  grid-template-columns: minmax(76px, 28%) minmax(0, 1fr);
  gap: 8px;
  align-items: baseline;
  padding: 4px 7px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--ls-bg) 32%, transparent);
}
.ls-kv-key {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--ls-primary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  overflow-wrap: anywhere;
}
.ls-kv-val {
  font-size: 12px;
  color: var(--ls-text);
  overflow-wrap: anywhere;
}
.ls-stat-cell {
  padding: 9px 11px;
  border-radius: calc(var(--ls-radius) - 3px);
  border: 1px solid var(--ls-border);
  border-left: 2.5px solid var(--ls-bar-color, var(--ls-border));
  background: var(--ls-fill);
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 12px;
  transition: border-color var(--ls-fast), background var(--ls-fast);
}
.ls-stat-cell:hover {
  border-color: var(--ls-border-hover);
}
.ls-stat-cell[data-locked="true"] {
  border-style: dashed;
}
.ls-stat-cell[data-uncalibrated="true"] {
  opacity: 0.78;
}
.ls-bar-track {
  position: relative;
  height: 7px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ls-text) 11%, transparent);
  overflow: hidden;
}
.ls-bar-track[data-bipolar="true"]::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1.5px;
  background: color-mix(in srgb, var(--ls-text) 40%, transparent);
}
.ls-bar-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--ls-bar-color, var(--ls-primary)) 82%, #000),
    var(--ls-bar-color, var(--ls-primary))
  );
  transition: width 0.26s cubic-bezier(0.22, 1, 0.36, 1), margin-left 0.26s ease;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-meter="segmented"] .ls-bar-fill {
  background: repeating-linear-gradient(
    90deg,
    var(--ls-bar-color, var(--ls-primary)) 0 9px,
    transparent 9px 11px
  );
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-meter="glow"] .ls-bar-fill {
  background: linear-gradient(
    90deg,
    var(--ls-bar-color, var(--ls-primary)),
    color-mix(in srgb, var(--ls-bar-color, var(--ls-primary)) 60%, #ffffff)
  );
  box-shadow: 0 0 calc(12px * var(--ls-glow, 0.45)) color-mix(in srgb, var(--ls-bar-color, var(--ls-primary)) 70%, transparent);
}
.ls-clock-bar {
  display: grid;
  gap: 4px;
  width: 100%;
}
.ls-clock-seg {
  height: 7px;
  border-radius: 4px;
  background: color-mix(in srgb, var(--ls-text) 13%, transparent);
  cursor: pointer;
  transition: background var(--ls-fast);
}
.ls-clock-seg.is-filled {
  background: var(--ls-primary);
}

/* Inline Message Ribbon & Floating HUD */
.ls-calibrating-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 8px 0 2px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--ls-muted);
  background: color-mix(in srgb, var(--ls-primary) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--ls-primary) 28%, transparent);
  border-radius: 999px;
}
.ls-calibrating-pill::before {
  content: "";
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ls-primary);
  animation: ls-calibrating-pulse 1.2s ease-in-out infinite;
}
@keyframes ls-calibrating-pulse {
  0%, 100% { opacity: 0.35; transform: scale(0.85); }
  50% { opacity: 1; transform: scale(1.12); }
}
.ls-inline-host {
  width: 100%;
  margin: 8px 0 4px;
}
.ls-inline-card {
  border-radius: var(--ls-radius);
  border: 1px solid var(--ls-glass-border);
  border-top: 2px solid color-mix(in srgb, var(--ls-primary) 75%, transparent);
  background: var(--ls-glass);
  backdrop-filter: var(--ls-blur);
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ls-inline-pill-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
  min-height: 34px;
}
.ls-hud {
  position: relative;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--ls-radius);
  border: 1px solid var(--ls-glass-border);
  border-top: 2px solid color-mix(in srgb, var(--ls-primary) 80%, transparent);
  background: var(--ls-glass);
  backdrop-filter: var(--ls-blur);
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.34),
    0 0 calc(20px * var(--ls-glow, 0.35)) color-mix(in srgb, var(--ls-primary) 12%, transparent);
}
.ls-hud-pill {
  padding: 7px 11px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  height: 100%;
  cursor: pointer;
  background: linear-gradient(135deg, color-mix(in srgb, var(--ls-primary) 7%, transparent), transparent 65%);
}
.ls-hud-pill[data-empty-deck="true"] {
  gap: 0;
}
.ls-hud-pill[data-pill-skin="split_deck"][data-empty-deck="true"] .ls-pill-top-deck {
  border-bottom: 0;
}
.ls-game-pill-main {
  display: flex;
  align-items: center;
  gap: 7px;
  flex: 0 0 auto;
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}
.ls-inline-pill-bar > .ls-game-pill-main {
  flex: 1 1 0%;
  width: auto;
}
.ls-game-pill-main::-webkit-scrollbar {
  display: none;
}
.ls-avatar-stack {
  display: inline-flex;
  align-items: center;
  flex: none;
}
.ls-avatar-stack-item {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1.5px solid var(--ls-surface);
  background: color-mix(in srgb, var(--ls-primary) 22%, var(--ls-bg));
  color: var(--ls-text);
  font-size: 9px;
  font-weight: 800;
  display: grid;
  place-items: center;
  overflow: hidden;
  margin-left: -5px;
}
.ls-avatar-stack-item:first-child {
  margin-left: 0;
}
.ls-avatar-stack-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ls-pill-gauge {
  flex: none;
  min-width: 82px;
  max-width: 126px;
  padding: 2.5px 7px;
  border-radius: 7px;
  border: 1px solid color-mix(in srgb, var(--ls-bar-color, var(--ls-primary)) 30%, var(--ls-border));
  background: color-mix(in srgb, var(--ls-bg) 45%, var(--ls-surface));
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ls-pill-gauge-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  font-size: 10px;
  font-weight: 650;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.ls-pill-gauge-track {
  height: 3.5px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ls-text) 13%, transparent);
  overflow: hidden;
}
.ls-hud-header-bar {
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 7px 10px 6px;
  border-bottom: 1px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-bg) 28%, transparent);
}
.ls-hud-top-row,
.ls-pill-top-deck {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap !important;
  gap: 6px;
  min-width: 0;
  width: 100%;
}
.ls-hud-title-badge {
  display: inline-flex;
  align-items: center;
  flex: 1 1 0%;
  gap: 6px;
  font-size: 12px;
  font-weight: 750;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ls-pill-actions,
.ls-hud-top-row > .ls-row {
  flex: none;
  flex-wrap: nowrap !important;
}
.ls-hud-tabs-scroll {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
}
.ls-hud-tabs-scroll::-webkit-scrollbar {
  display: none;
}
.ls-hud-tabs-scroll > button {
  flex: none;
  white-space: nowrap;
}
.ls-hud-tab-icon-only {
  min-width: 32px !important;
  padding: 4px 8px !important;
  font-size: 13px !important;
}
.ls-hud-content {
  flex: 1 1 0%;
  min-height: 0;
  overflow-y: auto;
  padding: 10px 12px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  scrollbar-width: thin;
}
.ls-hud-resize-grip {
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 18px;
  height: 18px;
  z-index: 25;
  cursor: nwse-resize;
  display: grid;
  place-items: center;
  font-size: 11px;
  color: var(--ls-muted);
  opacity: 0.65;
  user-select: none;
  touch-action: none;
  border-radius: 4px;
}
.ls-hud-resize-grip:hover {
  opacity: 1;
  color: var(--ls-primary);
  background: var(--ls-fill-hover);
}
.ls-color-swatch {
  width: 22px;
  height: 22px;
  min-height: 22px !important;
  padding: 0 !important;
  border-radius: 50% !important;
  border: 2px solid var(--ls-border) !important;
}
.ls-color-swatch[aria-pressed="true"] {
  border-color: var(--ls-text) !important;
  box-shadow: 0 0 0 2px var(--ls-primary);
}

/* Cast Icon Roster (In Scene / Away) */
.ls-roster-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ls-roster-strip {
  display: flex;
  align-items: stretch;
  gap: 6px;
  overflow-x: auto;
  padding: 2px 2px 4px;
  scrollbar-width: thin;
}
.ls-roster-icon-btn {
  flex: none;
  min-width: 62px;
  max-width: 80px;
  padding: 6px 8px !important;
  border-radius: calc(var(--ls-radius) - 2px) !important;
  border: 1px solid var(--ls-border) !important;
  background: var(--ls-fill) !important;
  color: var(--ls-text) !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 4px !important;
}
.ls-roster-icon-btn:hover {
  border-color: var(--ls-border-hover) !important;
  background: var(--ls-fill-hover) !important;
  transform: translateY(-1px);
}
.ls-roster-icon-btn[aria-pressed="true"] {
  border-color: color-mix(in srgb, var(--ls-primary) 70%, var(--ls-border)) !important;
  background: color-mix(in srgb, var(--ls-primary) 13%, var(--ls-surface)) !important;
}
.ls-roster-avatar {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--ls-primary) 15%, var(--ls-bg));
  border: 1.5px solid var(--ls-border);
  display: grid;
  place-items: center;
  font-size: 12.5px;
  font-weight: 800;
  color: var(--ls-primary);
}
.ls-roster-icon-btn[aria-pressed="true"] .ls-roster-avatar {
  border-color: var(--ls-primary);
}
.ls-roster-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}
.ls-roster-dot {
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--ls-surface);
}
.ls-roster-dot.is-present {
  background: var(--ls-success);
}
.ls-roster-dot.is-away {
  background: var(--ls-dim);
}
.ls-roster-name {
  font-size: 11px;
  font-weight: 650;
  max-width: 72px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* RPG Mechanics & Game Widgets */
.ls-rpg-skill-wrap,
.ls-rpg-xp-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ls-rpg-sp-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2.5px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 750;
  background: color-mix(in srgb, var(--ls-warning) 16%, transparent);
  border: 1px solid color-mix(in srgb, var(--ls-warning) 40%, var(--ls-border));
}
.ls-rpg-skill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 185px), 1fr));
  gap: 6px;
}
.ls-rpg-skill-node {
  padding: 7px 9px;
  border-radius: 8px;
  border: 1px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-bg) 35%, var(--ls-surface));
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ls-rpg-skill-node[data-unlocked="true"] {
  border-color: color-mix(in srgb, var(--ls-primary) 45%, var(--ls-border));
}
.ls-rpg-skill-node[data-maxed="true"] {
  border-color: color-mix(in srgb, var(--ls-warning) 55%, var(--ls-border));
  background: color-mix(in srgb, var(--ls-warning) 8%, var(--ls-surface));
}
.ls-rpg-skill-node[data-locked-req="true"] {
  opacity: 0.65;
  border-style: dashed;
}
.ls-rpg-level-crest {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
  background: var(--ls-primary);
  color: var(--lumiverse-primary-contrast, #04131d);
}
.ls-rpg-xp-track {
  height: 9px;
}
.ls-rpg-attr-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(72px, 1fr));
  gap: 6px;
}
.ls-rpg-attr-cell {
  padding: 6px 8px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--ls-bg) 35%, var(--ls-surface));
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1px;
}
.ls-rpg-attr-val {
  font-size: 15px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: var(--ls-primary);
}
.ls-rpg-radar-box {
  display: grid;
  place-items: center;
  padding: 4px;
}
.ls-rpg-radar-svg {
  width: 100%;
  max-width: 230px;
  height: auto;
  color: var(--ls-text);
}
.ls-rpg-loot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 165px), 1fr));
  gap: 6px;
}
.ls-rpg-loot-card {
  padding: 6px 8px;
  border-radius: 8px;
  border-left: 2.5px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-bg) 35%, var(--ls-surface));
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ls-rpg-loot-card[data-rarity="uncommon"] { border-left-color: #10b981; }
.ls-rpg-loot-card[data-rarity="rare"] { border-left-color: #38bdf8; }
.ls-rpg-loot-card[data-rarity="epic"] { border-left-color: #a855f7; }
.ls-rpg-loot-card[data-rarity="legendary"] {
  border-left-color: #f59e0b;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), var(--ls-surface));
}
.ls-rpg-fx-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 650;
  border: 1px solid var(--ls-border);
  background: var(--ls-fill);
}
.ls-rpg-fx-pill[data-fx-kind="buff"] {
  border-color: color-mix(in srgb, var(--ls-success) 45%, transparent);
  background: color-mix(in srgb, var(--ls-success) 13%, transparent);
  color: var(--ls-success);
}
.ls-rpg-fx-pill[data-fx-kind="debuff"] {
  border-color: color-mix(in srgb, var(--ls-danger) 45%, transparent);
  background: color-mix(in srgb, var(--ls-danger) 13%, transparent);
  color: var(--ls-danger);
}
.ls-rpg-heart-btn {
  min-width: 24px !important;
  min-height: 24px !important;
  padding: 1px !important;
  border: 0 !important;
  background: transparent !important;
  font-size: 13px !important;
}
.ls-rpg-currency-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 2px;
}
.ls-rpg-currency-val {
  font-size: 14.5px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

/* Showcase Character Dossier & Spatial Map */
.ls-thought-box {
  padding: 8px 11px;
  border-radius: 8px;
  border-left: 2.5px solid var(--ls-primary);
  background: var(--ls-fill);
  font-size: 12px;
  font-style: italic;
}
.ls-dossier-shell {
  display: grid;
  grid-template-columns: 1fr;
  border-radius: var(--ls-radius);
  border: 1px solid var(--ls-border);
  background: var(--ls-surface);
  overflow: hidden;
  min-height: 400px;
}
@container (min-width: 560px) {
  .ls-dossier-shell:not([data-no-portrait="true"]) {
    grid-template-columns: minmax(210px, 33%) minmax(0, 1fr);
  }
}
.ls-dossier-shell[data-no-portrait="true"] {
  min-height: 0;
}
.ls-dossier-compact-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  padding: 11px 13px;
  border-radius: calc(var(--ls-radius) - 2px);
  border: 1px solid color-mix(in srgb, var(--ls-primary) 28%, var(--ls-border));
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--ls-primary) 11%, var(--ls-bg)),
    color-mix(in srgb, var(--ls-surface) 94%, var(--ls-bg))
  );
}
.ls-dossier-compact-hero h2 {
  margin: 0;
  font-size: 16px;
}
.ls-dossier-monogram {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: color-mix(in srgb, var(--ls-primary) 16%, var(--ls-surface));
  border: 1px solid color-mix(in srgb, var(--ls-primary) 45%, var(--ls-border));
  color: var(--ls-primary);
  display: grid;
  place-items: center;
  font-size: 14px;
  font-weight: 800;
  flex: none;
}
.ls-cast-avatar {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: color-mix(in srgb, var(--ls-primary) 14%, var(--ls-bg));
  border: 1px solid color-mix(in srgb, var(--ls-primary) 35%, var(--ls-border));
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 800;
  color: var(--ls-primary);
  overflow: hidden;
  flex: none;
}
.ls-cast-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ls-cast-mini-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 6px;
}
.ls-cast-mini-meter {
  padding: 6px 8px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--ls-bg) 34%, var(--ls-surface));
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ls-dossier-rail {
  position: relative;
  min-height: 290px;
  background: radial-gradient(circle at 50% 25%, color-mix(in srgb, var(--ls-primary) 18%, transparent), transparent 70%), var(--ls-bg);
  border-bottom: 1px solid var(--ls-border);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
}
@container (min-width: 560px) {
  .ls-dossier-rail {
    border-bottom: 0;
    border-right: 1px solid var(--ls-border);
  }
}
.ls-dossier-portrait {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}
.ls-dossier-portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 15%;
}
.ls-dossier-initial {
  font-size: 60px;
  font-weight: 800;
  color: var(--ls-muted);
}
.ls-dossier-overlay {
  position: relative;
  z-index: 2;
  padding: 36px 14px 12px;
  background: linear-gradient(0deg, rgba(8, 12, 21, 0.94) 15%, rgba(8, 12, 21, 0.55) 70%, transparent 100%);
  color: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.ls-dossier-main {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  overflow-y: auto;
}
.ls-map-viewport {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  min-height: 270px;
  border-radius: var(--ls-radius);
  border: 1px solid var(--ls-border);
  background:
    radial-gradient(rgba(148, 163, 184, 0.14) 1px, transparent 1px),
    radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--ls-primary) 8%, transparent), transparent 55%),
    var(--ls-bg);
  background-size: 18px 18px, 100% 100%, 100% 100%;
  overflow: hidden;
  user-select: none;
}
.ls-mz-zone-box {
  position: absolute;
  border-radius: calc(var(--ls-radius) - 2px);
  border: 1px solid color-mix(in srgb, var(--ls-zone-color, var(--ls-border)) 42%, transparent);
  background: color-mix(in srgb, var(--ls-zone-color, var(--ls-surface)) 6%, var(--ls-surface) 86%);
  backdrop-filter: blur(6px);
  z-index: 1;
  overflow: hidden;
}
.ls-mz-zone-box[data-has-current="true"] {
  border-color: color-mix(in srgb, var(--ls-zone-color, var(--ls-primary)) 75%, transparent);
}
.ls-mz-zone-head {
  width: 100%;
  min-height: 26px !important;
  padding: 3px 9px !important;
  border: 0 !important;
  border-bottom: 1px solid color-mix(in srgb, var(--ls-zone-color, var(--ls-border)) 28%, transparent) !important;
  border-radius: 0 !important;
  background: color-mix(in srgb, var(--ls-zone-color, var(--ls-primary)) 12%, transparent) !important;
  color: var(--ls-text) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  cursor: pointer;
}
.ls-mz-node-tile {
  position: absolute;
  transform: translate(-50%, -50%);
  min-width: 96px;
  max-width: 164px;
  padding: 5px 9px !important;
  min-height: 30px !important;
  border-radius: 8px !important;
  border: 1px solid var(--ls-border) !important;
  background: color-mix(in srgb, var(--ls-bg) 82%, var(--ls-surface)) !important;
  color: var(--ls-text) !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 2px !important;
  z-index: 4;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
.ls-mz-node-tile[data-current="true"] {
  border-color: var(--ls-primary) !important;
  background: color-mix(in srgb, var(--ls-primary) 18%, var(--ls-surface)) !important;
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--ls-primary) 28%, transparent), 0 6px 14px rgba(0, 0, 0, 0.38);
}
.ls-mz-node-tile[data-selected="true"]:not([data-current="true"]) {
  border-color: var(--ls-accent) !important;
}
.ls-mz-node-title {
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 148px;
}
.ls-mz-node-avatars {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}
.ls-mz-mini-av {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid var(--ls-primary);
  background: var(--ls-surface);
  font-size: 8px;
  font-weight: 800;
  display: grid;
  place-items: center;
  overflow: hidden;
}
.ls-mz-mini-av img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ls-mz-edge-pill {
  position: absolute;
  transform: translate(-50%, -50%);
  padding: 1px 6px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ls-bg) 92%, var(--ls-surface));
  border: 1px solid var(--ls-border);
  font-size: 9.5px;
  font-weight: 650;
  color: var(--ls-muted);
  white-space: nowrap;
  pointer-events: none;
  z-index: 3;
}
.ls-mz-edge-pill[data-route="true"] {
  border-color: var(--ls-primary);
  color: var(--ls-text);
}
.ls-mz-ft-card {
  padding: 8px 10px;
  border-radius: calc(var(--ls-radius) - 2px);
  border: 1px solid var(--ls-border);
  background: var(--ls-fill);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.ls-mz-ft-card[data-current="true"] {
  border-color: var(--ls-primary);
  background: color-mix(in srgb, var(--ls-primary) 10%, var(--ls-surface));
}
.ls-mz-ft-thumb {
  width: 54px;
  height: 42px;
  border-radius: 7px;
  border: 1px solid var(--ls-border);
  background: var(--ls-bg);
  overflow: hidden;
  display: grid;
  place-items: center;
  flex: none;
  font-size: 18px;
}
.ls-mz-ft-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Visual Novel Affinity Constellation & Bond Web */
.ls-web-legend {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px;
  padding: 5px 9px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--ls-bg) 40%, var(--ls-surface));
  font-size: 10.5px;
}
.ls-web-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--ls-muted);
  font-weight: 600;
}
.ls-web-swatch {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}
.ls-bw-stage {
  position: relative;
  width: 100%;
  min-height: 290px;
  border-radius: var(--ls-radius);
  border: 1px solid var(--ls-border);
  background:
    radial-gradient(circle at 50% 48%, color-mix(in srgb, var(--ls-primary) 10%, transparent), transparent 68%),
    var(--ls-bg);
  overflow: hidden;
  user-select: none;
}
.ls-bw-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.ls-bw-node {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  background: transparent !important;
  border: 0 !important;
  padding: 2px !important;
  cursor: pointer;
  z-index: 4;
}
.ls-bw-node:hover {
  transform: translate(-50%, -50%) scale(1.06) !important;
}
.ls-bw-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--ls-surface);
  border: 2px solid var(--ls-bond-color, var(--ls-border));
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 800;
  color: var(--ls-text);
}
.ls-bw-node[data-focal="true"] .ls-bw-avatar {
  width: 46px;
  height: 46px;
  border-width: 2.5px;
  border-color: var(--ls-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ls-primary) 22%, transparent), 0 6px 16px rgba(0, 0, 0, 0.45);
}
.ls-bw-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}
.ls-bw-name {
  padding: 1.5px 7px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ls-bg) 92%, var(--ls-surface));
  border: 1px solid var(--ls-border);
  font-size: 10.5px;
  font-weight: 700;
  color: var(--ls-text);
  white-space: nowrap;
  max-width: 115px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ls-bw-node[data-focal="true"] .ls-bw-name {
  border-color: var(--ls-primary);
}
.ls-bw-edge-pill {
  position: absolute;
  transform: translate(-50%, -50%);
  padding: 2px 7px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ls-bg) 94%, var(--ls-surface));
  border: 1px solid var(--ls-bond-color, var(--ls-border));
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  font-size: 10px;
  line-height: 1.3;
  color: var(--ls-text);
  z-index: 3;
  max-width: 132px;
  display: flex;
  flex-direction: column;
  gap: 1px;
  cursor: pointer;
}
.ls-bw-edge-pill:hover {
  z-index: 6;
  border-color: var(--ls-primary);
}
.ls-bw-edge-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ls-bw-pair-card {
  padding: 9px 11px;
  border-radius: calc(var(--ls-radius) - 2px);
  border: 1px solid var(--ls-border);
  border-left: 3px solid var(--ls-bond-color, var(--ls-primary));
  background: var(--ls-fill);
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.ls-bw-two-col {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 185px), 1fr));
  gap: 7px;
}
.ls-bw-dir-box {
  padding: 7px 9px;
  border-radius: 7px;
  background: color-mix(in srgb, var(--ls-bg) 34%, var(--ls-surface));
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.ls-bw-cat-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 1.5px 7.5px;
  border-radius: 999px;
  font-size: 10.5px;
  font-weight: 700;
  border: 1px solid color-mix(in srgb, var(--ls-bond-color, var(--ls-border)) 50%, transparent);
  background: color-mix(in srgb, var(--ls-bond-color, var(--ls-primary)) 14%, transparent);
  color: var(--ls-text);
}

/* 2D Visual Novel Fullscreen Stage & Procedural Weather */
.ls-vn-stage {
  position: fixed;
  inset: 0;
  width: var(--app-scaled-viewport-width, 100vw);
  height: var(--app-scaled-viewport-height, 100vh);
  background: radial-gradient(circle at 50% 30%, #172038, #060913 78%);
  color-scheme: dark;
  --ls-bg: #070b14;
  --ls-surface: #0f1626;
  --ls-text: #f8fafc;
  --ls-muted: #94a3b8;
  --ls-glass: rgba(15, 23, 42, 0.85);
  z-index: 940;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  user-select: none;
}
.ls-vn-bg-stack {
  position: absolute;
  inset: -3%;
  z-index: 1;
  pointer-events: none;
  transition: translate 120ms linear;
}
.ls-vn-bg-layer {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: brightness(var(--ls-vn-amb-bri, 0.96)) saturate(var(--ls-vn-amb-sat, 1.02));
}
.ls-vn-bg-base {
  background-image: radial-gradient(circle at 50% 28%, rgba(56, 189, 248, 0.22), rgba(15, 23, 42, 0.92) 62%, #050811 100%);
}
.ls-vn-bg-front {
  opacity: 0;
  transition: none;
}
.ls-vn-bg-stack[data-bg-tr="wipe"] .ls-vn-bg-front {
  opacity: 1;
  clip-path: inset(0 100% 0 0);
}
.ls-vn-bg-stack[data-bg-tr="iris"] .ls-vn-bg-front {
  opacity: 1;
  clip-path: circle(0% at 50% 50%);
}
.ls-vn-bg-front.is-active {
  opacity: 1;
  transition: opacity 760ms ease, clip-path 760ms cubic-bezier(0.22, 1, 0.36, 1);
}
.ls-vn-bg-stack[data-bg-tr="wipe"] .ls-vn-bg-front.is-active {
  clip-path: inset(0 0 0 0);
}
.ls-vn-bg-stack[data-bg-tr="iris"] .ls-vn-bg-front.is-active {
  clip-path: circle(145% at 50% 50%);
}
.ls-vn-bg-strips {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.ls-vn-bg-strip {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transform: translateX(var(--strip-from, -115%));
  transition: transform 680ms cubic-bezier(0.22, 1, 0.36, 1) var(--strip-delay, 0ms);
}
.ls-vn-bg-strips.is-active .ls-vn-bg-strip {
  transform: translateX(0);
}
.ls-vn-curtain {
  position: absolute;
  inset: 0;
  z-index: 80;
  background: #04070f;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 420ms ease;
  pointer-events: none;
}
.ls-vn-curtain.is-active {
  opacity: 1;
}
.ls-vn-flash {
  position: absolute;
  inset: 0;
  z-index: 85;
  pointer-events: none;
  opacity: 0;
}

/* Weather Particle Layers */
.ls-vn-weather-layer {
  position: absolute;
  inset: -4%;
  z-index: 6;
  pointer-events: none;
  overflow: hidden;
}
.ls-vn-rain-wash {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.28), rgba(30, 58, 138, 0.12));
}
.ls-vn-rain-layer {
  position: absolute;
  inset: -18%;
  transform: rotate(var(--tilt, 8deg));
}
.ls-vn-rain-layer > i {
  display: block;
  width: 100%;
  height: calc(100% + var(--th, 400px));
  background-image: var(--tile);
  background-repeat: repeat;
  background-size: var(--tw, 280px) var(--th, 400px);
  animation: ls-vn-rain-fall var(--dur, 0.35s) linear infinite;
}
@keyframes ls-vn-rain-fall {
  from { transform: translate3d(0, calc(-1 * var(--th, 400px)), 0); }
  to { transform: translate3d(0, 0, 0); }
}
.ls-vn-fx-layer {
  position: absolute;
  inset: 0;
}
.ls-vn-pt {
  position: absolute;
  display: block;
  top: -24px;
  width: var(--sz, 8px);
  height: var(--sz, 8px);
  opacity: var(--o, 0.85);
  border-radius: 50%;
  pointer-events: none;
}
.ls-vn-splash {
  height: calc(var(--sz, 16px) * 0.32);
  border: 1.5px solid rgba(226, 232, 240, 0.55);
  background: transparent;
  animation: ls-vn-splash-ring var(--fd, 0.75s) ease-out var(--dl, 0s) infinite;
}
@keyframes ls-vn-splash-ring {
  0% { transform: scale(0.15); opacity: 0.85; }
  100% { transform: scale(1.35); opacity: 0; }
}
.ls-vn-flake {
  background: radial-gradient(circle, #ffffff 35%, rgba(255, 255, 255, 0) 75%);
  animation: ls-vn-fall var(--fd, 10s) linear var(--dl, 0s) infinite;
}
.ls-vn-petal {
  background: radial-gradient(ellipse at 35% 35%, #ffe4ef 22%, #f472b6 78%, transparent 100%);
  border-radius: 68% 22% 68% 22%;
  animation: ls-vn-fall var(--fd, 11s) linear var(--dl, 0s) infinite;
}
.ls-vn-firefly {
  background: radial-gradient(circle, #fef08a 18%, rgba(250, 204, 21, 0.65) 48%, transparent 76%);
  box-shadow: 0 0 12px rgba(250, 204, 21, 0.55);
  animation: ls-vn-blink var(--fd, 3.6s) ease-in-out var(--dl, 0s) infinite alternate;
}
.ls-vn-ember {
  top: auto;
  bottom: -24px;
  background: radial-gradient(circle, #fef08a 20%, #f97316 62%, transparent 80%);
  box-shadow: 0 0 10px rgba(249, 115, 22, 0.55);
  animation: ls-vn-rise var(--fd, 4.5s) ease-in var(--dl, 0s) infinite;
}
.ls-vn-fog-wash {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(148, 163, 184, 0.22) 0%, rgba(148, 163, 184, 0.08) 55%, transparent 100%);
}
.ls-vn-fog-layer {
  position: absolute;
  inset: -10% -25%;
  background:
    radial-gradient(ellipse 45% 28% at 28% 72%, rgba(226, 232, 240, 0.28), transparent 70%),
    radial-gradient(ellipse 50% 32% at 72% 80%, rgba(203, 213, 225, 0.24), transparent 72%);
  animation: ls-vn-fog-drift 14s ease-in-out infinite alternate;
}
.ls-vn-fog-2 {
  animation-duration: 19s;
  animation-direction: alternate-reverse;
  opacity: 0.75;
}
@keyframes ls-vn-fog-drift {
  from { transform: translate3d(-6%, 0, 0) scale(1.02); }
  to { transform: translate3d(6%, -2%, 0) scale(1.08); }
}
@keyframes ls-vn-fall {
  from { transform: translate3d(0, -5vh, 0) rotate(0deg); }
  to { transform: translate3d(var(--dx, -8vw), 108vh, 0) rotate(340deg); }
}
@keyframes ls-vn-rise {
  from { transform: translate3d(0, 4vh, 0) scale(1); opacity: 0.95; }
  to { transform: translate3d(var(--dx, 6vw), -106vh, 0) scale(0.35); opacity: 0; }
}
@keyframes ls-vn-blink {
  0% { opacity: 0.22; transform: translate3d(-10px, 6px, 0) scale(0.75); }
  100% { opacity: 1; transform: translate3d(12px, -18px, 0) scale(1.22); }
}

/* 2D Character Sprite Stage Slots & Emotion Rigs */
.ls-vn-actors-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding: 60px 6% 0;
  pointer-events: none;
  transition: translate 120ms linear, scale 220ms ease;
}
.ls-vn-actors-layer[data-shot-mode="closeup"] .ls-vn-sprite-img {
  max-height: 96vh;
  transform: scale(1.18);
  transform-origin: 50% 22%;
}
.ls-vn-actors-layer[data-shot-mode="full"] .ls-vn-sprite-img {
  max-height: 78vh;
}
.ls-vn-actor-slot {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: auto;
  cursor: grab;
  transition: filter 240ms ease, transform 240ms ease;
}
.ls-vn-actor-slot:active {
  cursor: grabbing;
}
.ls-vn-actor-slot[data-active-speaker="false"] {
  filter: brightness(0.72) saturate(0.85);
}
.ls-vn-actor-slot[data-active-speaker="true"] {
  z-index: 14;
  filter: drop-shadow(var(--ls-vn-rim-x, 0px) 0 18px var(--ls-vn-rim-color, rgba(56, 189, 248, 0.38)));
}
.ls-vn-actor-slot[data-emotion="joy"][data-active-speaker="true"] .ls-vn-avatar-rig {
  animation: ls-vn-emo-joy 0.55s ease;
}
.ls-vn-actor-slot[data-emotion="anger"][data-active-speaker="true"] .ls-vn-avatar-rig {
  animation: ls-vn-emo-anger 0.42s ease;
}
.ls-vn-actor-slot[data-emotion="surprise"][data-active-speaker="true"] .ls-vn-avatar-rig {
  animation: ls-vn-emo-surprise 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes ls-vn-emo-joy {
  0%, 100% { translate: 0 0; }
  45% { translate: 0 -10px; }
}
@keyframes ls-vn-emo-anger {
  0%, 100% { translate: 0 0; }
  25% { translate: -5px 0; }
  75% { translate: 5px 0; }
}
@keyframes ls-vn-emo-surprise {
  0%, 100% { translate: 0 0; }
  35% { translate: 0 -14px; }
}
.ls-vn-gizmo-bar {
  display: flex;
  gap: 4px;
  padding: 4px 6px;
  border-radius: 999px;
  background: rgba(9, 13, 24, 0.85);
  border: 1px solid var(--ls-border);
  margin-bottom: 8px;
  opacity: 0;
  transition: opacity var(--ls-fast);
}
.ls-vn-actor-slot:hover .ls-vn-gizmo-bar,
.ls-vn-actor-slot[data-active-speaker="true"] .ls-vn-gizmo-bar {
  opacity: 1;
}
.ls-vn-sprite-img {
  max-height: 85vh;
  max-width: min(38vw, 460px);
  width: auto;
  height: auto;
  object-fit: contain;
  user-select: none;
}
.ls-vn-placeholder-card {
  width: 200px;
  height: 245px;
  margin-bottom: 180px;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* VN Top HUD, Popovers & Bottom Dialogue Dock */
.ls-vn-top-hud {
  position: relative;
  z-index: 30;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  background: linear-gradient(180deg, rgba(6, 9, 18, 0.84) 0%, rgba(6, 9, 18, 0.4) 72%, transparent 100%);
}
.ls-vn-hud-widget {
  position: fixed;
  top: 64px;
  right: 18px;
  width: min(380px, 92vw);
  height: 92px;
  z-index: 75;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  cursor: grab;
  transition: width 180ms ease, height 180ms ease;
}
.ls-vn-hud-widget:active {
  cursor: grabbing;
}
.ls-vn-hud-widget[data-expanded="true"] {
  width: min(420px, 94vw);
  height: min(500px, calc(100vh - 250px));
}
.ls-vn-popovers {
  position: relative;
  z-index: 80;
  pointer-events: none;
}
.ls-vn-director-popover {
  position: fixed;
  top: 62px;
  right: 18px;
  width: min(340px, 92vw);
  pointer-events: auto;
}
.ls-vn-side-drawer {
  position: fixed;
  top: 62px;
  right: 18px;
  bottom: 215px;
  width: min(440px, 94vw);
  overflow-y: auto;
  pointer-events: auto;
}
.ls-vn-d20-overlay {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(4, 7, 15, 0.55);
  pointer-events: auto;
}
.ls-vn-d20-card {
  width: min(340px, 90vw);
  text-align: center;
  align-items: center;
}
.ls-vn-bottom-dock {
  position: relative;
  z-index: 30;
  width: min(1020px, 95vw);
  margin: auto auto calc(14px + var(--ls-kb-inset, 0px));
}
.ls-vn-dialogue-box {
  padding: 16px 20px 14px;
  border-radius: calc(var(--ls-radius) + 2px);
  border: 1px solid color-mix(in srgb, var(--ls-primary) 35%, var(--ls-border));
  border-top: 2px solid var(--ls-primary);
  background: linear-gradient(180deg, rgba(10, 15, 29, 0.92), rgba(7, 11, 22, 0.96));
  backdrop-filter: blur(18px);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.6);
  cursor: pointer;
}
.ls-vn-speaker-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 800;
  color: #041019;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
}
.ls-vn-prose {
  min-height: 68px;
  max-height: 155px;
  overflow-y: auto;
  margin-top: 10px;
  font-size: 15px;
  line-height: 1.65;
  color: #f8fafc;
  user-select: text;
}
.ls-vn-prose-quote {
  color: #7dd3fc;
  font-weight: 600;
}
.ls-vn-prose-thought {
  color: #cbd5e1;
  font-style: italic;
}
.ls-vn-controls-bar {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--ls-border);
}
.ls-vn-reply-form {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed var(--ls-border);
}

/* Stage Visual Studio Asset Gallery Cards */
.ls-asset-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 245px), 1fr));
  gap: 10px;
}
.ls-asset-card {
  padding: 10px;
  border-radius: calc(var(--ls-radius) - 2px);
  border: 1px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-bg) 38%, var(--ls-surface));
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ls-asset-thumb {
  width: 100%;
  height: 148px;
  border-radius: 8px;
  background: var(--ls-bg);
  border: 1px solid var(--ls-border);
  overflow: hidden;
  display: grid;
  place-items: center;
}
.ls-asset-thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* VN Illustrated Zone Atlas & Destination Cards */
.ls-vn-breadcrumb {
  gap: 5px;
}
.ls-vn-atlas-canvas {
  position: relative;
  width: 100%;
  min-height: 180px;
  aspect-ratio: 16 / 6;
  border-radius: var(--ls-radius);
  border: 1px solid var(--ls-border);
  background:
    radial-gradient(rgba(148, 163, 184, 0.14) 1px, transparent 1px),
    radial-gradient(circle at 30% 25%, color-mix(in srgb, var(--ls-primary) 12%, transparent), transparent 58%),
    var(--ls-bg);
  background-size: 18px 18px, 100% 100%, 100% 100%;
  overflow: hidden;
  user-select: none;
}
.ls-vn-zone-hub {
  position: absolute;
  transform: translate(-50%, -50%);
  min-width: 132px;
  max-width: 210px;
  padding: 8px 12px !important;
  border-radius: calc(var(--ls-radius) - 1px) !important;
  border: 1.5px solid color-mix(in srgb, var(--ls-zone-color, var(--ls-border)) 58%, transparent) !important;
  background: color-mix(in srgb, var(--ls-bg) 82%, var(--ls-surface)) !important;
  color: var(--ls-text) !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 4px !important;
  z-index: 4;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.42);
}
.ls-vn-zone-hub[data-current="true"] {
  border-color: var(--ls-primary) !important;
  box-shadow: 0 0 0 2.5px color-mix(in srgb, var(--ls-primary) 30%, transparent), 0 8px 24px rgba(0, 0, 0, 0.5);
}
.ls-vn-dest-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: 8px;
}
.ls-vn-dest-card {
  padding: 8px 10px;
  border-radius: calc(var(--ls-radius) - 2px);
  border: 1px solid var(--ls-border);
  background: var(--ls-fill);
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: border-color var(--ls-fast), background var(--ls-fast), transform var(--ls-fast);
}
.ls-vn-dest-card:hover {
  border-color: var(--ls-border-hover);
  background: var(--ls-fill-hover);
  transform: translateY(-1px);
}
.ls-vn-dest-card[data-current="true"] {
  border-color: color-mix(in srgb, var(--ls-primary) 68%, var(--ls-border));
  background: color-mix(in srgb, var(--ls-primary) 10%, var(--ls-surface));
}
.ls-vn-dest-card[data-selected="true"]:not([data-current="true"]) {
  border-color: var(--ls-accent);
}
.ls-vn-dest-thumb {
  width: 48px;
  height: 40px;
  border-radius: 7px;
  border: 1px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-bg) 70%, var(--ls-surface));
  overflow: hidden;
  display: grid;
  place-items: center;
  flex: none;
  font-size: 18px;
}
.ls-vn-dest-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ls-vn-dest-info {
  flex: 1 1 0%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ls-vn-dest-info strong {
  font-size: 12px;
  overflow-wrap: anywhere;
}

/* Portaled Searchable Dropdowns (works inside overlays, modals & accordions) */
.ls-dd-wrap {
  position: relative;
  display: inline-flex;
  width: 100%;
  min-width: 0;
}
.ls-dd-wrap[data-compact="true"] {
  width: auto;
}
.ls-dd-trigger {
  width: 100%;
  min-height: 34px;
  padding: 5px 10px !important;
  border-radius: calc(var(--ls-radius, 12px) - 4px) !important;
  border: 1px solid var(--ls-border) !important;
  background: color-mix(in srgb, var(--ls-bg) 55%, var(--ls-surface)) !important;
  color: var(--ls-text) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 8px !important;
  font-size: 12.5px !important;
  font-weight: 600 !important;
  text-align: left;
}
.ls-dd-wrap[data-compact="true"] .ls-dd-trigger {
  min-height: 26px !important;
  padding: 2px 8px !important;
  font-size: 11px !important;
  border-radius: 6px !important;
}
.ls-dd-trigger[aria-expanded="true"] {
  border-color: var(--ls-primary) !important;
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--ls-primary) 22%, transparent);
}
.ls-dd-trigger-label {
  flex: 1 1 0%;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ls-dd-caret {
  flex: none;
  font-size: 10px;
  opacity: 0.72;
}
.ls-dd-menu {
  position: fixed;
  z-index: 2147483640;
  min-width: 185px;
  max-height: 280px;
  display: flex;
  flex-direction: column;
  padding: 6px;
  gap: 4px;
  border-radius: calc(var(--ls-radius, 12px) - 2px);
  border: 1px solid color-mix(in srgb, var(--ls-primary, #38bdf8) 55%, var(--ls-border, rgba(148,163,184,0.3)));
  background: var(--ls-surface, #131c31);
  color: var(--ls-text, #f1f5f9);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.58);
  box-sizing: border-box;
  font-family: var(--ls-font, system-ui, sans-serif);
  font-size: 12.5px;
}
.ls-dd-search {
  width: 100%;
  min-height: 30px;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid var(--ls-border, rgba(148, 163, 184, 0.25));
  background: var(--ls-bg, #0b1120);
  color: var(--ls-text, #f1f5f9);
  font: inherit;
  font-size: 12px;
  outline: none;
}
.ls-dd-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
  max-height: 224px;
  scrollbar-width: thin;
}
.ls-dd-option {
  width: 100%;
  min-height: 30px;
  padding: 5px 9px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--ls-text, #f1f5f9);
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
}
.ls-dd-option:hover:not(:disabled) {
  background: var(--ls-fill-hover, rgba(148, 163, 184, 0.16));
}
.ls-dd-option[aria-selected="true"] {
  background: color-mix(in srgb, var(--ls-primary, #38bdf8) 20%, transparent);
  color: var(--ls-primary, #38bdf8);
  font-weight: 750;
}
.ls-dd-option:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.ls-dd-sublabel {
  font-size: 10.5px;
  opacity: 0.72;
}

/* Synchronous Accordions & Tactile Switches */
.ls-accordion {
  border-radius: var(--ls-radius);
  border: 1px solid var(--ls-border);
  background: var(--ls-fill);
  margin-bottom: 8px;
}
.ls-accordion-head {
  list-style: none;
  padding: 9px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  cursor: pointer;
  font-size: 12.5px;
  user-select: none;
}
.ls-accordion-head::-webkit-details-marker {
  display: none;
}
.ls-accordion-chev {
  font-size: 11px;
  color: var(--ls-muted);
  transition: transform var(--ls-fast);
}
.ls-accordion[open] .ls-accordion-chev {
  transform: rotate(180deg);
}
.ls-accordion-body {
  padding: 0 12px 12px;
  border-top: 1px solid var(--ls-border);
  padding-top: 10px;
}
.ls-toggle-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  flex: none;
}
.ls-toggle-switch input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.ls-toggle-track {
  width: 34px;
  height: 19px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ls-text) 18%, transparent);
  border: 1px solid var(--ls-border);
  position: relative;
  transition: background var(--ls-fast), border-color var(--ls-fast);
}
.ls-toggle-track::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--ls-text);
  transition: transform var(--ls-fast);
}
.ls-toggle-switch input:checked + .ls-toggle-track {
  background: var(--ls-primary);
  border-color: var(--ls-primary);
}
.ls-toggle-switch input:checked + .ls-toggle-track::after {
  transform: translateX(15px);
  background: var(--lumiverse-primary-contrast, #04131d);
}
.ls-check-row {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  cursor: pointer;
  padding: 3px 0;
}
.ls-formula-status {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-bg) 45%, var(--ls-surface));
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ls-formula-status[data-status="ok"] {
  border-color: color-mix(in srgb, var(--ls-success) 55%, var(--ls-border));
}
.ls-formula-status[data-status="warn"] {
  border-color: color-mix(in srgb, var(--ls-warning) 55%, var(--ls-border));
}
.ls-formula-status[data-status="error"] {
  border-color: color-mix(in srgb, var(--ls-danger) 55%, var(--ls-border));
}

/* Cast Icon Mode Grid & Character-Named Tabs */
.ls-roster-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));
  gap: 8px;
}
.ls-roster-grid .ls-roster-icon-btn {
  min-width: 0;
  max-width: none;
  width: 100%;
  padding: 10px 8px !important;
}
.ls-roster-grid .ls-roster-name {
  max-width: 100%;
  font-size: 11.5px;
}
.ls-roster-role {
  font-size: 10px;
  font-weight: 500;
  color: var(--ls-muted);
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ls-cast-tabs-bar {
  display: flex;
  align-items: center;
  gap: 5px;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
}
.ls-cast-tabs-bar::-webkit-scrollbar {
  display: none;
}
.ls-cast-tab-group {
  display: inline-flex;
  align-items: stretch;
  flex: none;
}
.ls-cast-tab-btn {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  white-space: nowrap;
}
.ls-cast-tab-close {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  border-left: 0 !important;
  padding: 2px 6px !important;
  min-width: 22px !important;
  color: var(--ls-muted) !important;
}
.ls-cast-tab-close:hover:not(:disabled) {
  color: var(--ls-danger) !important;
}

/* Custom Stat Category Headers */
.ls-cat-group {
  gap: 8px;
}
.ls-hud-cat-head {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-left: 3px solid var(--ls-primary);
  background: color-mix(in srgb, var(--ls-fill) 85%, transparent);
  border-radius: 6px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ls-muted);
}

/* 10 Floating Pill Skins */
.ls-pill-live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ls-success);
  box-shadow: 0 0 8px var(--ls-success);
  flex: none;
}
.ls-pill-title-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ls-hud-pill[data-pill-skin="glass_capsule"] {
  background: linear-gradient(135deg, color-mix(in srgb, var(--ls-primary) 9%, transparent), color-mix(in srgb, var(--ls-surface) 92%, transparent));
  backdrop-filter: blur(18px);
}
.ls-hud-pill[data-pill-skin="vn_dialogue_bar"] {
  background: linear-gradient(180deg, rgba(10, 15, 29, 0.94), rgba(7, 11, 22, 0.96));
  border-top: 2px solid var(--ls-primary);
}
.ls-hud-pill[data-pill-skin="vn_dialogue_bar"] .ls-pill-title-text {
  letter-spacing: 0.02em;
  font-weight: 800;
}
.ls-hud-pill[data-pill-skin="rpg_status_bar"] {
  background: linear-gradient(160deg, rgba(32, 26, 20, 0.95), rgba(16, 13, 10, 0.97));
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ls-primary) 28%, transparent);
}
.ls-hud-pill[data-pill-skin="persona_ticker"] {
  background: linear-gradient(150deg, color-mix(in srgb, var(--ls-primary) 22%, var(--ls-bg)), var(--ls-bg));
}
.ls-hud-pill[data-pill-skin="persona_ticker"] .ls-hud-title-badge {
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 900;
}
.ls-hud-pill[data-pill-skin="cyber_telemetry"] {
  font-family: var(--ls-mono);
  background:
    repeating-linear-gradient(0deg, rgba(56, 189, 248, 0.03) 0 1px, transparent 1px 4px),
    rgba(4, 10, 22, 0.95);
}
.ls-hud-pill[data-pill-skin="minimal_floating"] {
  background: color-mix(in srgb, var(--ls-surface) 68%, transparent);
  backdrop-filter: blur(12px);
}
.ls-hud-pill[data-pill-skin="minimal_floating"] .ls-pill-actions > button:not(:last-child) {
  opacity: 0;
  transition: opacity var(--ls-fast);
}
.ls-hud-pill[data-pill-skin="minimal_floating"]:hover .ls-pill-actions > button:not(:last-child) {
  opacity: 1;
}
.ls-hud-pill[data-pill-skin="neon_edge"] {
  border-left: 4px solid var(--ls-primary);
  box-shadow: inset 10px 0 24px color-mix(in srgb, var(--ls-primary) 18%, transparent);
}
.ls-hud-pill[data-pill-skin="split_deck"] {
  padding: 0;
  gap: 0;
}
.ls-hud-pill[data-pill-skin="split_deck"] .ls-pill-top-deck {
  padding: 6px 11px;
  background: color-mix(in srgb, var(--ls-primary) 16%, var(--ls-surface));
  border-bottom: 1px solid var(--ls-border);
}
.ls-hud-pill[data-pill-skin="split_deck"] .ls-pill-bottom-deck {
  padding: 6px 11px;
}
.ls-hud-pill[data-pill-skin="compact_badge"] {
  padding: 5px 10px;
}
.ls-hud-pill[data-pill-skin="ledger_strip"] {
  background: color-mix(in srgb, var(--ls-bg) 82%, var(--ls-surface));
  font-family: var(--ls-mono);
}
.ls-hud-pill[data-pill-skin="ledger_strip"] .ls-chip {
  border-radius: 4px;
}

/* 8 New Stat Visual Display Styles */
.ls-arc-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.ls-arc-card {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-bg) 40%, var(--ls-surface));
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.ls-arc-title {
  font-size: 12px;
  font-weight: 750;
}
.ls-arc-status {
  padding: 1.5px 7px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.04em;
  background: color-mix(in srgb, var(--ls-primary) 18%, transparent);
  color: var(--ls-primary);
}
.ls-arc-status[data-arc-status="dormant"],
.ls-arc-status[data-arc-status="retired"],
.ls-arc-status[data-arc-status="drop"] {
  background: var(--ls-fill);
  color: var(--ls-muted);
}
.ls-arc-status[data-arc-status="payoff"],
.ls-arc-status[data-arc-status="done"],
.ls-arc-status[data-arc-status="complete"],
.ls-arc-status[data-arc-status="completed"] {
  background: color-mix(in srgb, var(--ls-success) 18%, transparent);
  color: var(--ls-success);
}
.ls-arc-status[data-arc-status="urgent"],
.ls-arc-status[data-arc-status="fail"],
.ls-arc-status[data-arc-status="failed"] {
  background: color-mix(in srgb, var(--ls-danger) 18%, transparent);
  color: var(--ls-danger);
}
.ls-arc-clock {
  margin: 1px 0;
}
.ls-arc-summary {
  margin: 0 !important;
  font-size: 12px;
}
.ls-arc-meta {
  display: flex;
  gap: 6px;
  align-items: baseline;
  font-size: 11.5px;
}

.ls-stat-acc {
  border-radius: 8px;
  border: 1px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-bg) 38%, var(--ls-surface));
}
.ls-stat-acc-head {
  list-style: none;
  padding: 6px 9px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  cursor: pointer;
  font-size: 12px;
}
.ls-stat-acc-head::-webkit-details-marker {
  display: none;
}
.ls-stat-acc-preview {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 55%;
}
.ls-stat-acc-body {
  padding: 6px 9px 8px;
  border-top: 1px solid var(--ls-border);
}

.ls-matrix-card {
  padding: 7px 9px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--ls-bg) 38%, var(--ls-surface));
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ls-matrix-cols {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 6px;
}
.ls-matrix-cell {
  padding: 6px 8px;
  border-radius: 6px;
  background: var(--ls-fill);
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 11.5px;
}
.ls-matrix-footer {
  padding: 5px 8px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--ls-primary) 10%, transparent);
  font-size: 11.5px;
}

.ls-minibars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 7px;
}
.ls-minibar-cell {
  padding: 6px 8px;
  border-radius: 7px;
  background: color-mix(in srgb, var(--ls-bg) 35%, var(--ls-surface));
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11.5px;
  font-variant-numeric: tabular-nums;
}

.ls-statpills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.ls-statpill-tile {
  padding: 4px 9px;
  border-radius: 7px;
  border: 1px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-bg) 40%, var(--ls-surface));
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-variant-numeric: tabular-nums;
}

.ls-ledger-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ls-ledger-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 5px 8px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--ls-bg) 35%, var(--ls-surface));
  font-size: 12px;
}

.ls-timeline-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 10px;
  border-left: 2px solid color-mix(in srgb, var(--ls-primary) 45%, var(--ls-border));
}
.ls-timeline-item {
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 12px;
}
.ls-timeline-dot {
  position: absolute;
  left: -15px;
  top: 5px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ls-primary);
  border: 2px solid var(--ls-surface);
}

.ls-checklist {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ls-checklist-row {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  padding: 3px 4px;
}
.ls-checklist-box {
  width: 15px;
  height: 15px;
  border-radius: 4px;
  border: 1.5px solid var(--ls-border);
  display: grid;
  place-items: center;
  font-size: 10px;
  font-weight: 800;
  flex: none;
}
.ls-checklist-row[data-done="true"] .ls-checklist-box {
  background: var(--ls-success);
  border-color: var(--ls-success);
  color: #04131d;
}
`;

// src/frontend/controller.ts
function el(tag, className = "", text) {
  const node = document.createElement(tag);
  if (className)
    node.className = className;
  if (text !== undefined)
    node.textContent = text;
  return node;
}
function btn(label, onClick, className = "", title) {
  const b = el("button", className, label);
  b.type = "button";
  if (title) {
    b.title = title;
    b.setAttribute("aria-label", title);
  }
  b.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
  });
  b.addEventListener("click", (e) => {
    e.stopPropagation();
    onClick(e);
  });
  return b;
}
function iconBtn(iconName, onClick, options) {
  const b = el("button", options?.className ?? "ls-btn-sm ls-btn-icon");
  b.type = "button";
  b.append(svgIcon(iconName, options?.size ?? 14));
  if (options?.label) {
    b.append(el("span", "", options.label));
  }
  if (options?.title) {
    b.title = options.title;
    b.setAttribute("aria-label", options.title);
  }
  b.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
  });
  b.addEventListener("click", (e) => {
    e.stopPropagation();
    onClick(e);
  });
  return b;
}

class ComponentScope {
  handles = [];
  track(handle) {
    this.handles.push(handle);
    return handle;
  }
  clear() {
    for (const h of this.handles.splice(0)) {
      try {
        h.destroy();
      } catch {}
    }
  }
}
var SCROLLABLE_SELECTORS = [
  ".ls-drawer-body",
  ".ls-studio-pane",
  ".ls-studio-preview-pane",
  ".ls-hud-content",
  ".ls-dossier-main"
];
var lastKeystrokeAt = 0;
if (typeof document !== "undefined") {
  document.addEventListener("keydown", (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      lastKeystrokeAt = Date.now();
    }
  }, { capture: true, passive: true });
}
function preserveScrollAndFocus(container, renderFn, options) {
  const active = document.activeElement;
  const activelyTyping = Date.now() - lastKeystrokeAt < 1200;
  const isOpenSelectOrCombo = Boolean(document.body.querySelector('.ls-dd-menu[data-ls-dd-open="true"]')) || Boolean(container.querySelector('[aria-expanded="true"], [data-state="open"]')) || active instanceof HTMLElement && container.contains(active) && active.tagName === "SELECT";
  if (options?.deferIfTyping && (activelyTyping || isOpenSelectOrCombo) && active instanceof HTMLElement && container.contains(active) && (active.tagName === "INPUT" || active.tagName === "TEXTAREA") && active.type !== "checkbox" && active.type !== "radio") {
    if (options.onDeferredFlush && !active.dataset.lsBlurDeferred) {
      active.dataset.lsBlurDeferred = "true";
      let timer = null;
      const flush = () => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        delete active.dataset.lsBlurDeferred;
        active.removeEventListener("blur", flush);
        options.onDeferredFlush?.();
      };
      active.addEventListener("blur", flush, { once: true });
      timer = setTimeout(flush, 1250);
    }
    return false;
  }
  const savedScrolls = new Map;
  savedScrolls.set("__root__", { top: container.scrollTop, left: container.scrollLeft });
  for (const sel of SCROLLABLE_SELECTORS) {
    const found = container.querySelector(sel);
    if (found) {
      savedScrolls.set(sel, { top: found.scrollTop, left: found.scrollLeft });
    }
  }
  renderFn();
  const rootScroll = savedScrolls.get("__root__");
  if (rootScroll) {
    container.scrollTop = rootScroll.top;
    container.scrollLeft = rootScroll.left;
  }
  for (const sel of SCROLLABLE_SELECTORS) {
    const saved = savedScrolls.get(sel);
    if (!saved)
      continue;
    const nextEl = container.querySelector(sel);
    if (nextEl) {
      nextEl.scrollTop = saved.top;
      nextEl.scrollLeft = saved.left;
    }
  }
  return true;
}
function mountThemedSelect(_ctrl, scope, target, opts) {
  let currentValue = opts.value;
  let currentOptions = [...opts.options];
  let activeMenu = null;
  let detachDocListeners = null;
  const wrap = el("div", "ls-dd-wrap");
  if (opts.compact)
    wrap.dataset.compact = "true";
  const trigger = el("button", "ls-dd-trigger");
  trigger.type = "button";
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  if (opts.ariaLabel)
    trigger.setAttribute("aria-label", opts.ariaLabel);
  if (opts.title)
    trigger.title = opts.title;
  const labelSpan = el("span", "ls-dd-trigger-label");
  const caret = el("span", "ls-dd-caret", "▾");
  trigger.append(labelSpan, caret);
  wrap.append(trigger);
  target.replaceChildren(wrap);
  const syncTriggerLabel = () => {
    const matched = currentOptions.find((o) => o.value === currentValue);
    labelSpan.textContent = matched?.label || opts.placeholder || currentOptions[0]?.label || "Select…";
  };
  syncTriggerLabel();
  const closeMenu = () => {
    if (detachDocListeners) {
      detachDocListeners();
      detachDocListeners = null;
    }
    if (activeMenu) {
      activeMenu.remove();
      activeMenu = null;
    }
    trigger.setAttribute("aria-expanded", "false");
  };
  const openMenu = () => {
    closeMenu();
    for (const stale of [...document.body.querySelectorAll('.ls-dd-menu[data-ls-dd-open="true"]')]) {
      stale.remove();
    }
    const menu = el("div", "ls-dd-menu");
    menu.setAttribute("role", "listbox");
    menu.dataset.lsDdOpen = "true";
    const cs = getComputedStyle(trigger);
    for (const v of [
      "--ls-bg",
      "--ls-surface",
      "--ls-text",
      "--ls-muted",
      "--ls-primary",
      "--ls-border",
      "--ls-fill",
      "--ls-fill-hover",
      "--ls-radius",
      "--ls-font"
    ]) {
      const val = cs.getPropertyValue(v).trim();
      if (val)
        menu.style.setProperty(v, val);
    }
    const listBox = el("div", "ls-dd-list");
    let searchInp = null;
    const renderOptions = (filterText = "") => {
      listBox.replaceChildren();
      const q = filterText.trim().toLowerCase();
      const visible = q ? currentOptions.filter((o) => o.label.toLowerCase().includes(q) || o.sublabel && o.sublabel.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)) : currentOptions;
      if (!visible.length) {
        const emptyMsg = el("div", "ls-muted", "No matching options");
        emptyMsg.style.padding = "6px 8px";
        listBox.append(emptyMsg);
        return;
      }
      for (const opt of visible) {
        const itemBtn = el("button", "ls-dd-option");
        itemBtn.type = "button";
        itemBtn.setAttribute("role", "option");
        itemBtn.setAttribute("aria-selected", String(opt.value === currentValue));
        if (opt.disabled)
          itemBtn.disabled = true;
        itemBtn.append(el("span", "", opt.label));
        if (opt.sublabel) {
          itemBtn.append(el("span", "ls-dd-sublabel", opt.sublabel));
        }
        itemBtn.addEventListener("pointerdown", (e) => {
          e.stopPropagation();
        });
        itemBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          currentValue = opt.value;
          syncTriggerLabel();
          closeMenu();
          opts.onChange(opt.value);
        });
        listBox.append(itemBtn);
      }
    };
    if (currentOptions.length >= 6) {
      searchInp = el("input", "ls-dd-search");
      searchInp.type = "text";
      searchInp.placeholder = opts.searchPlaceholder || "Search…";
      searchInp.addEventListener("pointerdown", (e) => e.stopPropagation());
      searchInp.addEventListener("input", () => renderOptions(searchInp.value));
      menu.append(searchInp);
    }
    renderOptions();
    menu.append(listBox);
    const bodyRect = document.body.getBoundingClientRect();
    const scale = bodyRect.width > 0 && document.body.offsetWidth > 0 ? bodyRect.width / document.body.offsetWidth : 1;
    const tRect = trigger.getBoundingClientRect();
    const vw = window.innerWidth / scale;
    const vh = window.innerHeight / scale;
    const menuWidth = Math.max(Math.round(tRect.width / scale), 190);
    const estHeight = Math.min(280, currentOptions.length * 34 + (searchInp ? 48 : 16));
    const spaceBelow = vh - tRect.bottom / scale;
    const openUpward = spaceBelow < estHeight + 12 && tRect.top / scale > spaceBelow;
    const left = Math.max(8, Math.min(vw - menuWidth - 8, Math.round(tRect.left / scale)));
    menu.style.left = `${left}px`;
    menu.style.width = `${menuWidth}px`;
    if (openUpward) {
      menu.style.bottom = `${Math.max(8, Math.round(vh - tRect.top / scale + 4))}px`;
    } else {
      menu.style.top = `${Math.max(8, Math.round(tRect.bottom / scale + 4))}px`;
    }
    document.body.append(menu);
    activeMenu = menu;
    trigger.setAttribute("aria-expanded", "true");
    if (searchInp)
      requestAnimationFrame(() => searchInp?.focus());
    const onDocPointerDown = (ev) => {
      const targetNode = ev.target;
      if (!targetNode)
        return;
      if (menu.contains(targetNode) || trigger.contains(targetNode))
        return;
      closeMenu();
    };
    const onDocKeyDown = (ev) => {
      if (ev.key === "Escape") {
        ev.stopPropagation();
        closeMenu();
        trigger.focus();
      }
    };
    const onScrollOrResize = (ev) => {
      if (ev.type === "resize" && searchInp && document.activeElement === searchInp)
        return;
      if (ev.target instanceof Node && menu.contains(ev.target))
        return;
      closeMenu();
    };
    window.addEventListener("pointerdown", onDocPointerDown, true);
    window.addEventListener("keydown", onDocKeyDown, true);
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    window.addEventListener("scroll", onScrollOrResize, { capture: true, passive: true });
    detachDocListeners = () => {
      window.removeEventListener("pointerdown", onDocPointerDown, true);
      window.removeEventListener("keydown", onDocKeyDown, true);
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
  };
  trigger.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
  });
  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (activeMenu)
      closeMenu();
    else
      openMenu();
  });
  scope?.track({ destroy: closeMenu });
  return {
    getValue: () => currentValue,
    setValue: (nextValue) => {
      currentValue = nextValue;
      syncTriggerLabel();
    },
    setOptions: (nextOptions, nextValue) => {
      currentOptions = [...nextOptions];
      if (nextValue !== undefined)
        currentValue = nextValue;
      syncTriggerLabel();
      if (activeMenu)
        openMenu();
    }
  };
}
function mountNativeSwitch(_ctrl, _scope, target, opts) {
  const wrap = el("label", "ls-toggle-switch");
  if (opts.size === "md")
    wrap.dataset.size = "md";
  const chk = el("input");
  chk.type = "checkbox";
  chk.checked = opts.checked;
  chk.disabled = Boolean(opts.disabled);
  if (opts.ariaLabel)
    chk.setAttribute("aria-label", opts.ariaLabel);
  chk.addEventListener("change", () => opts.onChange(chk.checked));
  const track = el("span", "ls-toggle-track");
  wrap.append(chk, track);
  target.replaceChildren(wrap);
}
function mountNativeCheckbox(_ctrl, _scope, target, opts) {
  const lbl = el("label", "ls-check-row");
  const chk = el("input");
  chk.type = "checkbox";
  chk.checked = opts.checked;
  chk.disabled = Boolean(opts.disabled);
  chk.addEventListener("change", () => opts.onChange(chk.checked));
  lbl.append(chk, el("span", "", opts.label));
  target.replaceChildren(lbl);
}
var accordionOpenMemory = new Map;
function mountNativeCollapsible(_ctrl, _scope, target, opts) {
  const details = el("details", "ls-accordion");
  const remembered = opts.persistKey ? accordionOpenMemory.get(opts.persistKey) : undefined;
  details.open = remembered !== undefined ? remembered : Boolean(opts.defaultExpanded);
  const summary = el("summary", "ls-accordion-head");
  const left = el("span", "ls-row");
  if (opts.iconName)
    left.append(svgIcon(opts.iconName, 14));
  left.append(el("strong", "", opts.title));
  const right = el("span", "ls-row");
  if (opts.badge !== undefined) {
    right.append(el("span", "ls-chip", String(opts.badge)));
  }
  right.append(el("span", "ls-accordion-chev", "▾"));
  summary.append(left, right);
  const body = el("div", "ls-accordion-body ls-stack");
  details.append(summary, body);
  details.addEventListener("toggle", () => {
    if (opts.persistKey)
      accordionOpenMemory.set(opts.persistKey, details.open);
    opts.onToggle?.(details.open);
  });
  target.append(details);
  return body;
}
function bindContextMenuWithLongPress(ctx, target, getItems, onSelect) {
  const openAt = async (x, y) => {
    if (typeof ctx.ui?.showContextMenu !== "function")
      return;
    const items = getItems();
    if (!items.length)
      return;
    const res = await ctx.ui.showContextMenu({
      position: { x, y },
      items
    });
    if (res.selectedKey) {
      onSelect(res.selectedKey);
    }
  };
  target.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    e.stopPropagation();
    openAt(e.clientX, e.clientY);
  });
  let timer = null;
  let fired = false;
  let startPos = { x: 0, y: 0 };
  target.addEventListener("touchstart", (e) => {
    fired = false;
    const t = e.touches[0];
    if (!t)
      return;
    startPos = { x: t.clientX, y: t.clientY };
    timer = setTimeout(() => {
      fired = true;
      navigator.vibrate?.(40);
      openAt(t.clientX, t.clientY);
    }, 500);
  }, { passive: true });
  target.addEventListener("touchmove", (e) => {
    if (!timer)
      return;
    const t = e.touches[0];
    if (!t)
      return;
    if (Math.abs(t.clientX - startPos.x) > 10 || Math.abs(t.clientY - startPos.y) > 10) {
      clearTimeout(timer);
      timer = null;
    }
  }, { passive: true });
  target.addEventListener("touchend", (e) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (fired) {
      e.preventDefault();
      fired = false;
    }
  });
}

class ModalManager {
  ctx;
  activeModals = new Set;
  constructor(ctx) {
    this.ctx = ctx;
  }
  hasOpenModals() {
    return this.activeModals.size > 0;
  }
  open(opts, render) {
    if (typeof this.ctx.ui?.showModal !== "function") {
      console.warn("[LumiStats ModalManager] ctx.ui.showModal is not a function — cannot open modal");
      return;
    }
    if (this.activeModals.size >= 2) {
      const oldest = this.activeModals.values().next().value;
      oldest?.dismiss();
    }
    const scope = new ComponentScope;
    console.log("[LumiStats ModalManager] calling ctx.ui.showModal, title:", opts.title);
    const handle = this.ctx.ui.showModal({
      title: opts.title,
      width: opts.width ?? 640,
      maxHeight: opts.maxHeight ?? 760,
      persistent: opts.persistent ?? false
    });
    console.log("[LumiStats ModalManager] showModal returned handle:", handle, "root connected:", handle?.root?.isConnected);
    this.activeModals.add(handle);
    handle.root.classList.add("ls-root");
    handle.root.style.cssText += ";padding:16px;overflow-y:auto;height:auto;max-height:min(80vh, 740px);";
    handle.onDismiss(() => {
      scope.clear();
      this.activeModals.delete(handle);
    });
    render(handle.root, () => handle.dismiss(), handle, scope);
    return handle;
  }
  async confirm(opts) {
    if (typeof this.ctx.ui?.showConfirm === "function") {
      const res = await this.ctx.ui.showConfirm({
        title: opts.title,
        message: opts.message,
        confirmLabel: opts.confirmLabel ?? "Confirm",
        variant: opts.variant ?? "warning"
      });
      return Boolean(res?.confirmed);
    }
    return false;
  }
  closeAll() {
    for (const m of [...this.activeModals]) {
      m.dismiss();
    }
    this.activeModals.clear();
  }
}
var styleRefCount = new WeakMap;
function acquireLumiStatsStyles(ctx) {
  const existing = styleRefCount.get(document);
  if (existing) {
    existing.count++;
    return () => {
      existing.count--;
      if (existing.count <= 0) {
        styleRefCount.delete(document);
        existing.remove();
      }
    };
  }
  const remove = ctx.dom.addStyle(LUMI_STATS_CSS);
  styleRefCount.set(document, { count: 1, remove });
  return () => {
    const cur = styleRefCount.get(document);
    if (!cur)
      return;
    cur.count--;
    if (cur.count <= 0) {
      styleRefCount.delete(document);
      cur.remove();
    }
  };
}
function openCreateTemplateModal(ctrl, onCreated) {
  ctrl.modals.open({ title: "✨ Create New Lumi Stats Template", width: 520 }, (body, close, _handle, modalScope) => {
    const topGrid = el("div", "ls-grid");
    const iconWrap = el("label", "ls-label", "Icon Emoji");
    const iconInp = el("input", "ls-input");
    iconInp.value = "✨";
    iconWrap.append(iconInp);
    const nameWrap = el("label", "ls-label", "Template Name");
    const nameInp = el("input", "ls-input");
    nameInp.placeholder = "e.g. Modern Drama & Chemistry, Dark Fantasy RPG…";
    nameInp.value = "";
    nameWrap.append(nameInp);
    topGrid.append(iconWrap, nameWrap);
    const descWrap = el("label", "ls-label", "Short Description");
    const descInp = el("input", "ls-input");
    descInp.placeholder = "What kind of story or stats does this template track?";
    descWrap.append(descInp);
    let starterMode = "universal_companion";
    const starterWrap = el("div", "ls-label", "Starter Stat Blueprint");
    const starterSlot = el("div");
    starterWrap.append(starterSlot);
    const customStarterOptions = ctrl.customTemplates.filter((ct) => !ctrl.builtinTemplates.some((bt) => bt.id === ct.id)).map((ct) => ({
      value: ct.id,
      label: `${ct.icon} ${ct.name} (Saved · ${ct.stats.length} stats)`
    }));
    mountThemedSelect(ctrl, modalScope, starterSlot, {
      value: starterMode,
      ariaLabel: "Starter Stat Blueprint",
      options: [
        { value: "empty", label: "\uD83E\uDDF9 Empty Canvas (0 stats — start completely from scratch)" },
        { value: "blank", label: "\uD83C\uDF31 Clean Minimal Starter (1 Trust meter — build your own)" },
        ...customStarterOptions,
        ...ctrl.builtinTemplates.map((b) => ({
          value: b.id,
          label: `${b.icon} ${b.name} (${b.stats.length} stats)`
        }))
      ],
      onChange: (v) => {
        starterMode = v;
      }
    });
    let selectedPromptPos = "post_history";
    let selectedPromptDepth = 1;
    const promptWrap = el("div", "ls-label", "\uD83E\uDDE0 AI Prompt Placement (Where Lumi State Is Sent)");
    const promptBtnRow = el("div", "ls-row");
    const depthRow = el("div", "ls-row");
    depthRow.style.display = "none";
    const syncPromptPosButtons = () => {
      for (const b of [...promptBtnRow.querySelectorAll("button")]) {
        b.setAttribute("aria-current", b.dataset.pos === selectedPromptPos ? "page" : "false");
      }
      depthRow.style.display = selectedPromptPos === "in_history" ? "flex" : "none";
    };
    for (const [ppVal, ppLbl] of [
      ["pre_history", "⬆️ Before History"],
      ["in_history", "\uD83D\uDCAC Within History"],
      ["post_history", "⬇️ After History"]
    ]) {
      const b = btn(ppLbl, () => {
        selectedPromptPos = ppVal;
        syncPromptPosButtons();
      }, "ls-btn-sm");
      b.dataset.pos = ppVal;
      promptBtnRow.append(b);
    }
    const depthInp = el("input", "ls-input");
    depthInp.type = "number";
    depthInp.min = "0";
    depthInp.max = "20";
    depthInp.style.width = "76px";
    depthInp.value = String(selectedPromptDepth);
    depthInp.addEventListener("change", () => {
      selectedPromptDepth = Math.max(0, Math.min(20, Math.round(Number(depthInp.value) || 0)));
    });
    depthRow.append(el("small", "ls-muted", "History Depth:"), depthInp);
    syncPromptPosButtons();
    promptWrap.append(promptBtnRow, depthRow);
    const errBanner = el("small", "ls-muted");
    errBanner.style.cssText = "color:var(--ls-danger);display:none;";
    const createBtn = btn("✨ Create & Activate Template", () => {
      const name = nameInp.value.trim() || "My Custom Template";
      const icon = iconInp.value.trim() || "✨";
      const description = descInp.value.trim() || "Custom roleplay tracker template.";
      createBtn.disabled = true;
      createBtn.textContent = "⏳ Creating…";
      errBanner.style.display = "none";
      ctrl.request("template:createNew", {
        name,
        icon,
        description,
        starter: starterMode,
        promptPosition: selectedPromptPos,
        promptDepth: selectedPromptDepth
      }).then(() => {
        ctrl.notify(`Created & activated "${icon} ${name}"!`);
        close();
        onCreated?.();
      }).catch((err) => {
        errBanner.textContent = err instanceof Error ? err.message : String(err);
        errBanner.style.display = "block";
        if (createBtn.isConnected) {
          createBtn.disabled = false;
          createBtn.textContent = "✨ Create & Activate Template";
        }
      });
    }, "ls-btn-primary");
    createBtn.style.marginTop = "10px";
    body.append(topGrid, descWrap, starterWrap, promptWrap, errBanner, createBtn);
    requestAnimationFrame(() => nameInp.focus());
  });
}
function openQuickTemplateModal(ctrl, onOpenStudio) {
  ctrl.modals.open({ title: "\uD83C\uDFAD Quick Template, Game Skin & Placement Switcher", width: 660, maxHeight: 800 }, (body, close, handle) => {
    const redraw = () => {
      const { template } = ctrl.snapshot;
      const allTemplates = [
        ...ctrl.builtinTemplates,
        ...ctrl.customTemplates.filter((ct) => !ctrl.builtinTemplates.some((bt) => bt.id === ct.id))
      ];
      body.replaceChildren();
      const topRow = el("div", "ls-row-between");
      topRow.append(el("span", "ls-kicker", `Active: ${template.icon} ${template.name}`), el("div", "ls-row"));
      topRow.lastElementChild.append(btn("✨ + New Template", () => {
        close();
        openCreateTemplateModal(ctrl);
      }, "ls-btn-sm ls-btn-primary"), ...onOpenStudio ? [
        btn("⚙️ Full Studio", () => {
          close();
          onOpenStudio();
        }, "ls-btn-sm")
      ] : []);
      body.append(topRow);
      const placeCard = el("div", "ls-card");
      placeCard.append(el("span", "ls-kicker", "\uD83C\uDFAE 1-Click Game Skin & Placement"));
      const skinRow = el("div", "ls-row");
      for (const skin of BUILTIN_VISUAL_SKINS) {
        const b = btn(skin.name, () => {
          ctrl.applySkinPack(skin);
        }, "ls-btn-sm");
        if ((template.theme.surfaceStyle || "glass") === skin.surfaceStyle) {
          b.setAttribute("aria-current", "page");
        }
        skinRow.append(b);
      }
      const pRow = el("div", "ls-row");
      for (const [pVal, pLbl] of [
        ["both_bottom", "✨ HUD + Below Reply"],
        ["both_top", "✨ HUD + Above Reply"],
        ["inline_bottom", "\uD83D\uDCAC Below Reply Only"],
        ["floating_only", "\uD83E\uDE9F Floating HUD Only"]
      ]) {
        const b = btn(pLbl, () => {
          ctrl.request("state:mutate", {
            templatePatch: { theme: { ...template.theme, placement: pVal } },
            reason: "Updated placement mode"
          });
        }, "ls-btn-sm");
        if (template.theme.placement === pVal)
          b.setAttribute("aria-current", "page");
        pRow.append(b);
      }
      const castRow = el("div", "ls-row");
      castRow.append(el("small", "ls-muted", "Cast Tab:"));
      for (const [cVal, cLbl] of [
        ["roster", "\uD83D\uDC65 Icon Roster (In Scene / Away)"],
        ["cards", "\uD83D\uDDC2️ All Cards Expanded"]
      ]) {
        const b = btn(cLbl, () => {
          ctrl.request("state:mutate", {
            templatePatch: { theme: { ...template.theme, castLayout: cVal } },
            reason: "Updated cast layout mode"
          });
        }, "ls-btn-sm");
        if ((template.theme.castLayout || "roster") === cVal)
          b.setAttribute("aria-current", "page");
        castRow.append(b);
      }
      const tabsIconRow = el("div", "ls-row");
      tabsIconRow.append(el("small", "ls-muted", "Widget Tabs:"));
      for (const [iconOnlyVal, lbl] of [
        [false, "\uD83C\uDFF7️ Icons + Text"],
        [true, "✨ Icons Only"]
      ]) {
        const b = btn(lbl, () => {
          ctrl.request("state:mutate", {
            templatePatch: {
              theme: { ...template.theme, widgetTabsIconOnly: iconOnlyVal }
            },
            reason: `Set widget tabs to ${iconOnlyVal ? "icons only" : "icons + labels"}`
          });
        }, "ls-btn-sm");
        if (Boolean(template.theme.widgetTabsIconOnly) === iconOnlyVal) {
          b.setAttribute("aria-current", "page");
        }
        tabsIconRow.append(b);
      }
      const promptPosRow = el("div", "ls-row");
      promptPosRow.append(el("small", "ls-muted", "Send State:"));
      for (const [ppVal, ppLbl] of [
        ["pre_history", "⬆️ Before History"],
        ["in_history", "\uD83D\uDCAC Within History"],
        ["post_history", "⬇️ After History"]
      ]) {
        const b = btn(ppLbl, () => {
          ctrl.request("state:mutate", {
            templatePatch: { promptPosition: ppVal },
            reason: `Set Lumi State prompt position to ${ppVal}`
          });
        }, "ls-btn-sm");
        if ((template.promptPosition || "post_history") === ppVal) {
          b.setAttribute("aria-current", "page");
        }
        promptPosRow.append(b);
      }
      if (template.promptPosition === "in_history") {
        const dInp = el("input", "ls-input");
        dInp.type = "number";
        dInp.min = "0";
        dInp.max = "20";
        dInp.title = "History depth (messages back from end)";
        dInp.style.cssText = "width:62px;min-height:27px;padding:2px 6px;font-size:11px;";
        dInp.value = String(Math.max(0, Math.round(Number(template.promptDepth ?? 1) || 0)));
        dInp.addEventListener("change", () => {
          const nextDepth = Math.max(0, Math.min(20, Math.round(Number(dInp.value) || 0)));
          ctrl.request("state:mutate", {
            templatePatch: { promptDepth: nextDepth },
            reason: `Set Lumi State depth to ${nextDepth}`
          });
        });
        promptPosRow.append(el("small", "ls-muted", "Depth:"), dInp);
      }
      const pillSkinRow = el("div", "ls-row");
      pillSkinRow.append(el("small", "ls-muted", "Pill Skin:"));
      const pillSkinSlot = el("div");
      pillSkinSlot.style.minWidth = "210px";
      pillSkinRow.append(pillSkinSlot);
      mountThemedSelect(ctrl, undefined, pillSkinSlot, {
        value: template.theme.pillStyle || "glass_capsule",
        compact: true,
        ariaLabel: "Collapsed Pill Skin",
        options: [
          { value: "glass_capsule", label: "✨ Frosted Split Capsule (Best)" },
          { value: "vn_dialogue_bar", label: "\uD83C\uDFAC VN Cinema Strip" },
          { value: "rpg_status_bar", label: "⚔️ JRPG Party Status Bar" },
          { value: "persona_ticker", label: "\uD83C\uDCCF Stylish Pop Ticker" },
          { value: "cyber_telemetry", label: "\uD83D\uDEF8 Cyber Telemetry" },
          { value: "minimal_floating", label: "☁️ Minimal Ghost Pill" },
          { value: "neon_edge", label: "⚡ Neon Glow Rail" },
          { value: "split_deck", label: "\uD83D\uDDC2️ Dual-Deck Card Pill" },
          { value: "compact_badge", label: "\uD83D\uDCF1 Micro Compact Badge" },
          { value: "ledger_strip", label: "\uD83D\uDCDC Editorial Case Strip" }
        ],
        onChange: (nextPill) => {
          ctrl.request("state:mutate", {
            templatePatch: {
              theme: { ...template.theme, pillStyle: nextPill }
            },
            reason: `Changed Pill Skin to ${nextPill}`
          });
        }
      });
      placeCard.append(skinRow, pillSkinRow, pRow, castRow, tabsIconRow, promptPosRow);
      body.append(placeCard);
      const savedCustom = allTemplates.filter((item) => !ctrl.builtinTemplates.some((b) => b.id === item.id));
      const builtinList = allTemplates.filter((item) => ctrl.builtinTemplates.some((b) => b.id === item.id));
      const orderedTemplates = [...savedCustom, ...builtinList];
      const list = el("div", "ls-grid");
      list.style.marginTop = "8px";
      for (const item of orderedTemplates) {
        const isActive = item.id === template.id;
        const isCustom = !ctrl.builtinTemplates.some((b) => b.id === item.id);
        const card = el("div", "ls-preset-card");
        card.dataset.active = String(isActive);
        const head = el("div", "ls-row-between");
        head.append(el("strong", "", `${item.icon} ${item.name}`), el("span", `ls-chip ${isCustom ? "ls-chip-accent" : ""}`, isCustom ? "Saved Custom" : "Built-In"));
        const actions = el("div", "ls-row");
        if (isActive) {
          actions.append(el("span", "ls-chip ls-chip-accent", "✓ Active"));
        } else {
          const actBtn = btn("Activate", () => {
            actBtn.disabled = true;
            actBtn.textContent = "Applying…";
            ctrl.request("template:apply", { templateId: item.id, template: item }).then(() => ctrl.notify(`Switched to "${item.name}"`)).catch((err) => {
              ctrl.notify(err instanceof Error ? err.message : String(err), true);
              if (actBtn.isConnected) {
                actBtn.disabled = false;
                actBtn.textContent = "Activate";
              }
            });
          }, "ls-btn-sm ls-btn-primary");
          actions.append(actBtn);
        }
        actions.append(btn("\uD83D\uDCCB Duplicate", () => {
          ctrl.request("template:duplicate", {
            sourceTemplateId: item.id,
            template: item,
            name: `${item.name} (Custom)`
          }).then(() => ctrl.notify(`Duplicated "${item.name}"`)).catch((err) => ctrl.notify(err instanceof Error ? err.message : String(err), true));
        }, "ls-btn-sm"));
        card.append(head, el("small", "ls-muted", item.description), actions);
        list.append(card);
      }
      body.append(list);
    };
    redraw();
    const unsub = ctrl.subscribe(redraw);
    handle.onDismiss(unsub);
  });
}
function safeRandomUuid() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = bytes[6] & 15 | 64;
    bytes[8] = bytes[8] & 63 | 128;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}

class LumiFrontendController {
  ctx;
  modals;
  tts = new LumiTtsEngine;
  chatId = "";
  snapshot;
  settings;
  customTemplates = [];
  builtinTemplates = BUILTIN_TEMPLATES;
  connections = [];
  recentTurns = [];
  copilotTurns = [];
  activeProposal;
  busy = false;
  statusText = "";
  statusError = false;
  isGenerationStreaming = false;
  isDrawerTabVisible = true;
  vnStageOpen = false;
  studioOpen = false;
  vnShowHudWidget = true;
  onToggleVnStage = null;
  activeDrawerTab = "Stats";
  activeSurfaceTab = "stats";
  activeInlineTab = "stats";
  activeDossierTab = "overview";
  dossierEditMode = false;
  webFilterMode = "all";
  activeCopilotMode = "ask";
  inlineExpanded = false;
  widgetExpanded = false;
  selectedActorId = "";
  openedCastTabs = [];
  activeCastTabActorId = "";
  selectedPlaceId = "";
  hydratingChat = false;
  activeOverlayCleanup = null;
  onResizeWidgetLive = null;
  lastThemeAppliedChatId = "";
  customCssEl = null;
  pendingRpc = new Map;
  listeners = new Set;
  statusListeners = new Set;
  disposers = [];
  constructor(ctx) {
    this.ctx = ctx;
    this.modals = new ModalManager(ctx);
    const tpl = createDefaultTemplate();
    this.snapshot = {
      schemaVersion: 1,
      chatId: "",
      revision: 0,
      state: createEmptyCampaignState(tpl),
      template: tpl,
      deltas: { statDeltas: {}, characterDeltas: {} },
      bindings: [],
      checkpoints: []
    };
    this.disposers.push(ctx.onBackendMessage((raw) => {
      if (!raw || typeof raw !== "object")
        return;
      const msg = raw;
      if (msg.channel !== LUMI_STATS_CHANNEL)
        return;
      if (msg.type === "rpc_ack" && typeof msg.requestId === "string") {
        const pending = this.pendingRpc.get(msg.requestId);
        if (pending) {
          clearTimeout(pending.timer);
          this.pendingRpc.delete(msg.requestId);
          const resp = msg;
          if (resp.ok)
            pending.resolve(resp.data ?? {});
          else {
            this.notify(resp.error ?? "Operation failed", true);
            pending.reject(new Error(resp.error ?? "Operation failed"));
          }
        }
        return;
      }
      const incomingChatId = typeof msg.resolvedChatId === "string" && msg.resolvedChatId ? msg.resolvedChatId : typeof msg.chatId === "string" && msg.chatId !== "sandbox" ? msg.chatId : "";
      if (!this.chatId && incomingChatId) {
        this.chatId = incomingChatId;
      }
      if (incomingChatId && this.chatId && incomingChatId !== this.chatId)
        return;
      if (msg.type === "snapshot" && msg.snapshot) {
        this.hydratingChat = false;
        this.snapshot = msg.snapshot;
        const srf = this.snapshot.template.surfaces;
        const enabledWidget = srf.widgetTabs.filter((t) => t.enabled);
        if (enabledWidget.length && !enabledWidget.some((t) => t.id === this.activeSurfaceTab)) {
          this.activeSurfaceTab = enabledWidget[0].id;
        }
        const enabledInline = srf.inlineTabs.filter((t) => t.enabled);
        if (enabledInline.length && !enabledInline.some((t) => t.id === this.activeInlineTab)) {
          this.activeInlineTab = enabledInline[0].id;
        }
        const enabledDossier = srf.dossierTabs.filter((t) => t.enabled);
        if (enabledDossier.length && !enabledDossier.some((t) => t.id === this.activeDossierTab)) {
          this.activeDossierTab = enabledDossier[0].id;
        }
        if (this.chatId && this.lastThemeAppliedChatId !== this.chatId) {
          this.lastThemeAppliedChatId = this.chatId;
          this.inlineExpanded = Boolean(this.snapshot.template.theme.inlineDefaultExpanded);
        }
        if (this.selectedActorId && !this.snapshot.state.characters[this.selectedActorId]) {
          this.selectedActorId = "";
        }
        this.openedCastTabs = this.openedCastTabs.filter((id) => Boolean(this.snapshot.state.characters[id]));
        if (this.activeCastTabActorId && !this.snapshot.state.characters[this.activeCastTabActorId]) {
          this.activeCastTabActorId = "";
        }
        if (this.selectedPlaceId && !this.snapshot.state.places[this.selectedPlaceId]) {
          this.selectedPlaceId = "";
        }
        if (msg.settings) {
          this.settings = msg.settings;
          if (typeof this.settings.vnShowHudWidget === "boolean") {
            this.vnShowHudWidget = this.settings.vnShowHudWidget;
          }
        }
        if (Array.isArray(msg.customTemplates)) {
          this.customTemplates = msg.customTemplates;
        }
        if (Array.isArray(msg.copilotTurns)) {
          this.copilotTurns = msg.copilotTurns;
        }
        this.busy = msg.busy === true;
        this.applyTemplateThemeToDom();
        this.emitChange();
        this.emitStatusChange();
      } else if (msg.type === "status") {
        this.busy = msg.busy === true;
        this.statusText = String(msg.text ?? "");
        this.statusError = false;
        this.emitStatusChange();
      } else if (msg.type === "error") {
        this.busy = false;
        this.notify(String(msg.message ?? "Error"), true);
      }
    }));
  }
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  subscribeStatus(fn) {
    this.statusListeners.add(fn);
    return () => this.statusListeners.delete(fn);
  }
  applySkinPack(rawSkin) {
    const skin = normalizeSkinPack(rawSkin);
    const cur = this.snapshot.template.theme;
    this.request("state:mutate", {
      templatePatch: {
        theme: {
          ...cur,
          surfaceStyle: skin.surfaceStyle,
          frameShape: skin.frameShape,
          meterStyle: skin.meterStyle,
          accentHue: skin.accentHue,
          secondaryHue: skin.secondaryHue,
          glowIntensity: skin.glowIntensity ?? 55,
          glassBlur: skin.glassBlur !== false,
          compact: Boolean(skin.compact),
          castLayout: skin.castLayout ?? cur.castLayout ?? "roster",
          ...skin.customCss !== undefined ? { customCss: skin.customCss } : {}
        }
      },
      reason: `Applied visual skin "${skin.name}"`
    });
    this.notify(`Applied "${skin.name}" visual skin!`);
  }
  stampThemeOnElement(node) {
    const theme = this.snapshot.template.theme;
    const styleMode = theme.surfaceStyle || "glass";
    const frameShape = theme.frameShape || (theme.radiusPreset === "sharp" ? "sharp" : "rounded");
    const meterStyle = theme.meterStyle || "smooth";
    const glassBlur = theme.glassBlur !== false;
    const glow = Math.max(0, Math.min(100, Number(theme.glowIntensity ?? 55))) / 100;
    const isCompact = Boolean(theme.compact);
    const hasHue = typeof theme.accentHue === "number" && Number.isFinite(theme.accentHue);
    const hasSecHue = typeof theme.secondaryHue === "number" && Number.isFinite(theme.secondaryHue);
    node.dataset.lsStyle = styleMode;
    node.dataset.lsPill = theme.pillStyle || "glass_capsule";
    node.dataset.lsFrame = frameShape;
    node.dataset.lsMeter = meterStyle;
    node.dataset.lsBlur = String(glassBlur);
    node.dataset.lsCompact = String(isCompact);
    node.style.setProperty("--ls-glow", glow.toFixed(2));
    if (hasHue) {
      node.style.setProperty("--ls-primary", `hsl(${theme.accentHue}, 86%, 62%)`);
    } else {
      node.style.removeProperty("--ls-primary");
    }
    if (hasSecHue) {
      node.style.setProperty("--ls-accent", `hsl(${theme.secondaryHue}, 82%, 68%)`);
    } else if (hasHue) {
      node.style.setProperty("--ls-accent", `hsl(${(theme.accentHue + 28) % 360}, 82%, 68%)`);
    } else {
      node.style.removeProperty("--ls-accent");
    }
  }
  applyTemplateThemeToDom() {
    if (typeof document === "undefined")
      return;
    const theme = this.snapshot.template.theme;
    for (const node of document.querySelectorAll(".ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay")) {
      this.stampThemeOnElement(node);
    }
    const rawCss = (theme.customCss || "").trim();
    if (rawCss) {
      const safeCss = rawCss.replace(/@import\b[^;]*;?/gi, "").replace(/url\s*\([^)]*\)/gi, "");
      if (!this.customCssEl) {
        this.customCssEl = document.createElement("style");
        this.customCssEl.dataset.lsCustomCss = "true";
        document.head.append(this.customCssEl);
      }
      if (this.customCssEl.textContent !== safeCss) {
        this.customCssEl.textContent = safeCss;
      }
    } else if (this.customCssEl) {
      this.customCssEl.remove();
      this.customCssEl = null;
    }
  }
  emitChange() {
    for (const fn of this.listeners)
      fn();
    this.applyTemplateThemeToDom();
  }
  emitStatusChange() {
    for (const fn of this.statusListeners)
      fn();
  }
  notify(text, isError = false) {
    this.statusText = text;
    this.statusError = isError;
    this.emitStatusChange();
  }
  request(type, payload = {}) {
    const effectiveChatId = this.chatId || "sandbox";
    const requestId = safeRandomUuid();
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingRpc.delete(requestId);
        reject(new Error(`RPC timeout waiting for ${type}`));
      }, 60000);
      this.pendingRpc.set(requestId, { resolve, reject, timer });
      const req = {
        channel: LUMI_STATS_CHANNEL,
        requestId,
        chatId: effectiveChatId,
        type,
        payload
      };
      this.ctx.sendToBackend(req);
    });
  }
  isActivityForActiveChat(activityChatId) {
    let hostActive = "";
    try {
      hostActive = this.ctx.getActiveChat?.()?.chatId ?? "";
    } catch {
      hostActive = "";
    }
    if (hostActive && hostActive !== this.chatId) {
      this.refreshActiveChat(hostActive);
    }
    const effective = hostActive || this.chatId;
    if (!effective) {
      if (activityChatId && activityChatId !== "sandbox") {
        this.refreshActiveChat(activityChatId);
      }
      return true;
    }
    return !activityChatId || activityChatId === effective;
  }
  async refreshActiveChat(hintedChatId) {
    let active = typeof hintedChatId === "string" ? hintedChatId.trim() : "";
    if (!active && hintedChatId !== null) {
      try {
        active = this.ctx.getActiveChat?.()?.chatId ?? "";
      } catch {
        active = "";
      }
    }
    if (active !== this.chatId) {
      this.chatId = active;
      this.selectedActorId = "";
      this.openedCastTabs = [];
      this.activeCastTabActorId = "";
      this.selectedPlaceId = "";
      this.activeProposal = undefined;
    }
    this.hydratingChat = true;
    const res = await this.request("snapshot:get").catch(() => ({}));
    this.hydratingChat = false;
    if (typeof res.resolvedChatId === "string" && res.resolvedChatId && !this.chatId) {
      this.chatId = res.resolvedChatId;
    }
    if (Array.isArray(res.connections)) {
      this.connections = res.connections;
    }
    if (Array.isArray(res.recentTurns)) {
      this.recentTurns = res.recentTurns;
    }
    this.emitChange();
  }
  toggleVnStage() {
    this.onToggleVnStage?.();
  }
  uploadStageVariantAsset(params) {
    this.ctx.uploads.pickFile({
      accept: ["image/png", "image/jpeg", "image/webp", "image/gif"],
      multiple: false,
      maxSizeBytes: 6000000
    }).then((files) => {
      const file = files[0];
      if (!file)
        return;
      const chunkSize = 32768;
      let binary = "";
      for (let i = 0;i < file.bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...file.bytes.subarray(i, i + chunkSize));
      }
      this.notify("⏳ Uploading & saving stage asset variant…");
      this.request("asset:upload", {
        dataUrl: `data:${file.mimeType || "image/png"};base64,${btoa(binary)}`,
        ...params
      });
    }).catch((err) => this.notify(err instanceof Error ? err.message : String(err), true));
  }
  pickAndUploadImage(targetId, kind, variant = "neutral") {
    this.ctx.uploads.pickFile({
      accept: ["image/png", "image/jpeg", "image/webp", "image/gif"],
      multiple: false,
      maxSizeBytes: 6000000
    }).then((files) => {
      const file = files[0];
      if (!file)
        return;
      const chunkSize = 32768;
      let binary = "";
      for (let i = 0;i < file.bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...file.bytes.subarray(i, i + chunkSize));
      }
      this.notify(`⏳ Uploading ${kind}…`);
      this.request("asset:upload", {
        dataUrl: `data:${file.mimeType || "image/png"};base64,${btoa(binary)}`,
        targetId,
        kind,
        variant
      });
    }).catch((err) => this.notify(err instanceof Error ? err.message : String(err), true));
  }
  destroy() {
    this.tts.destroy();
    if (this.customCssEl) {
      this.customCssEl.remove();
      this.customCssEl = null;
    }
    if (this.activeOverlayCleanup) {
      this.activeOverlayCleanup();
      this.activeOverlayCleanup = null;
    }
    this.modals.closeAll();
    for (const p of this.pendingRpc.values()) {
      clearTimeout(p.timer);
    }
    this.pendingRpc.clear();
    for (const fn of this.disposers.splice(0))
      fn();
    this.listeners.clear();
    this.statusListeners.clear();
  }
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
      error: 'Plain-English rule detected — click "Convert to Local Formula" to translate it into math/macro syntax.'
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
      return "—";
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
function collectAvailableTokensSummary(state, schemas, scope, actor) {
  const { numVars, strVars } = buildContextResolver(state, schemas, scope === "character" ? actor : undefined);
  const cleanNums = {};
  for (const [k, v] of Object.entries(numVars)) {
    const hasUpperKey = Object.keys(numVars).some((other) => other !== k && other.toLowerCase() === k && other !== other.toLowerCase());
    if (!hasUpperKey)
      cleanNums[k] = v;
  }
  return { numTokens: cleanNums, strVars };
}
function previewStatFormula(schema, state, allSchemas, actorId) {
  const formula = schema.formula?.trim() ?? "";
  const actor = schema.scope === "character" ? actorId ? state.characters[actorId] : Object.values(state.characters)[0] : undefined;
  const targetName = actor ? actor.name : state.player.name || "Player";
  const summary = collectAvailableTokensSummary(state, allSchemas, schema.scope, actor);
  if (!formula) {
    return {
      locals: {},
      missingRefs: [],
      availableTokens: summary.numTokens,
      availableStringVars: summary.strVars,
      targetName
    };
  }
  const { ctx, strVars, numVars } = buildContextResolver(state, allSchemas, actor);
  const res = evaluateFormulaProgram(formula, ctx, strVars, numVars);
  const output = formatFormulaOutput(schema, res);
  return {
    output,
    locals: res.locals,
    missingRefs: output !== undefined ? [] : res.missingRefs,
    isProse: res.isProse,
    error: res.error,
    availableTokens: summary.numTokens,
    availableStringVars: summary.strVars,
    targetName
  };
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
      appliedEffects.push(`${actor ? `${actor.name} · ` : ""}${statId} ${entry.delta >= 0 ? `+${entry.delta}` : entry.delta} (${label})`);
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
        appliedEffects.push(`${actor.name} · ${statId} = ${clamped}`);
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
function previewCategoryFormula(cat, state, schemas, actorId) {
  const cloned = structuredClone(state);
  const memberStats = schemas.filter((s) => s.enabled && s.categoryId === cat.id);
  const hasCharMembers = memberStats.some((s) => s.scope === "character") || /\bmod\s*\(|\bself\./i.test(cat.localRuleFormula ?? "");
  const targetActor = hasCharMembers ? actorId ? cloned.characters[actorId] : Object.values(cloned.characters)[0] : undefined;
  return executeCategoryLocalRuleForScope(cat, schemas, cloned, targetActor);
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
function formatDayAndClock(elapsedMinutes) {
  const day = Math.floor(Math.max(0, elapsedMinutes) / 1440) + 1;
  return `Day ${day} · ${formatStoryClock(elapsedMinutes)}`;
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
    formatted: `[ \uD83D\uDD70️ ${time} | \uD83D\uDCC5 ${date} | \uD83D\uDCCD ${location} | \uD83C\uDF26️ ${weather} ]`
  };
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
function isDossierFieldEnabled(template, fieldId) {
  const found = template.dossierFields.find((f) => f.id === fieldId);
  return found ? found.enabled : false;
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
  return /\[[^\]]*\]|->|→|\b(?:format|write\s+in|write\s+this|saw\/heard|impulse\s*:)\b/i.test(s.triggerCues);
}

// src/shared/state-reducer.ts
function inferBondCategory(label, note = "") {
  const txt = `${label} ${note}`.toLowerCase();
  if (/\b(?:sister|brother|sibling|mother|mom|father|dad|parent|son|daughter|cousin|aunt|uncle|family|twin|niece|nephew|guardian)\b/.test(txt)) {
    return "family";
  }
  if (/\b(?:lover|partner|wife|husband|spouse|fianc[eé]e?|boyfriend|girlfriend|crush|sweetheart|romantic|beloved|infatuat)\b/.test(txt)) {
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

// src/frontend/surfaces/RelationshipWeb.ts
var pivotFocusId = "player";
var bondDisplayMode = "web";
var BOND_CATEGORY_META = {
  family: { icon: "\uD83D\uDC9B", label: "Family", color: "#f59e0b" },
  friend: { icon: "\uD83D\uDC99", label: "Friend / Ally", color: "#38bdf8" },
  romance: { icon: "\uD83E\uDE77", label: "Romance", color: "#f472b6" },
  rival: { icon: "❤️", label: "Rival / Tense", color: "#f43f5e" },
  professional: { icon: "\uD83D\uDCBC", label: "Work / Duty", color: "#a78bfa" },
  neutral: { icon: "⚪", label: "Acquaintance", color: "#94a3b8" }
};
var QUICK_RELATION_CHIPS = [
  "Best Friend",
  "Protective Sister",
  "Younger Brother",
  "Childhood Friend",
  "Trusted Ally",
  "Romantic Interest",
  "Partner / Lover",
  "Rival",
  "Suspicious Stranger",
  "Employer / Boss",
  "Loyal Retainer"
];
function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }
  return (name.trim().slice(0, 2) || "?").toUpperCase();
}
function getNpcToPlayerBond(actor) {
  if (actor.bondToPlayer?.label) {
    return {
      ...actor.bondToPlayer,
      category: actor.bondToPlayer.category ?? inferBondCategory(actor.bondToPlayer.label, actor.bondToPlayer.note)
    };
  }
  const fallback = actor.fields.bond_dynamic || actor.roleSummary || "Acquaintance";
  return {
    label: fallback,
    category: inferBondCategory(fallback)
  };
}
function getPlayerToNpcBond(actor) {
  if (actor.bondFromPlayer?.label) {
    return {
      ...actor.bondFromPlayer,
      category: actor.bondFromPlayer.category ?? inferBondCategory(actor.bondFromPlayer.label, actor.bondFromPlayer.note)
    };
  }
  return {
    label: "Not defined yet",
    category: "neutral"
  };
}
function openPlayerBondEditorModal(ctrl, actor) {
  const youName = ctrl.snapshot.state.player.name || "You";
  const curYouToNpc = getPlayerToNpcBond(actor);
  const curNpcToYou = getNpcToPlayerBond(actor);
  ctrl.modals.open({ title: `\uD83D\uDD17 Edit Bond: ${youName} ⇄ ${actor.name}`, width: 560 }, (body, close) => {
    const youWrap = el("label", "ls-label", `Your Bond to ${actor.name} (${youName} → ${actor.name})`);
    const youInp = el("input", "ls-input");
    youInp.placeholder = `e.g. Younger Brother, Best Friend, Wary Ally…`;
    youInp.value = curYouToNpc.label === "Not defined yet" ? "" : curYouToNpc.label;
    youWrap.append(youInp);
    const youChips = el("div", "ls-row");
    for (const chipTxt of QUICK_RELATION_CHIPS.slice(0, 6)) {
      youChips.append(btn(chipTxt, () => {
        youInp.value = chipTxt;
      }, "ls-btn-sm ls-quick-pill"));
    }
    youWrap.append(youChips);
    const youNoteWrap = el("label", "ls-label", `Why / Note for ${youName} → ${actor.name} (Optional)`);
    const youNoteInp = el("input", "ls-input");
    youNoteInp.placeholder = `e.g. Relies on her for advice…`;
    youNoteInp.value = curYouToNpc.note ?? "";
    youNoteWrap.append(youNoteInp);
    const npcWrap = el("label", "ls-label", `${actor.name}'s Bond to You (${actor.name} → ${youName})`);
    const npcInp = el("input", "ls-input");
    npcInp.placeholder = `e.g. Protective Elder Sister, Strict Boss…`;
    npcInp.value = curNpcToYou.label;
    npcWrap.append(npcInp);
    const npcChips = el("div", "ls-row");
    for (const chipTxt of QUICK_RELATION_CHIPS.slice(0, 6)) {
      npcChips.append(btn(chipTxt, () => {
        npcInp.value = chipTxt;
      }, "ls-btn-sm ls-quick-pill"));
    }
    npcWrap.append(npcChips);
    const npcNoteWrap = el("label", "ls-label", `Why / Note for ${actor.name} → ${youName} (Optional)`);
    const npcNoteInp = el("input", "ls-input");
    npcNoteInp.placeholder = `e.g. Secretly worries about you…`;
    npcNoteInp.value = curNpcToYou.note ?? "";
    npcNoteWrap.append(npcNoteInp);
    let selectedCat = curNpcToYou.category ?? curYouToNpc.category ?? "neutral";
    const catWrap = el("div", "ls-label", "Bond Type / Color");
    const catRow = el("div", "ls-row");
    const syncCat = () => {
      for (const b of [...catRow.querySelectorAll("button")]) {
        b.setAttribute("aria-current", b.dataset.cat === selectedCat ? "page" : "false");
      }
    };
    for (const [catKey, meta] of Object.entries(BOND_CATEGORY_META)) {
      const b = btn(`${meta.icon} ${meta.label}`, () => {
        selectedCat = catKey;
        syncCat();
      }, "ls-btn-sm");
      b.dataset.cat = catKey;
      catRow.append(b);
    }
    syncCat();
    catWrap.append(catRow);
    const saveBtn = btn("\uD83D\uDCBE Save Two-Way Bond", () => {
      const fromLabel = youInp.value.trim();
      const toLabel = npcInp.value.trim() || actor.roleSummary || "Acquaintance";
      ctrl.request("state:mutate", {
        patch: {
          characters: [
            {
              id: actor.id,
              name: actor.name,
              roleSummary: toLabel,
              bondToPlayer: {
                label: toLabel,
                ...npcNoteInp.value.trim() ? { note: npcNoteInp.value.trim() } : {},
                category: selectedCat
              },
              ...fromLabel ? {
                bondFromPlayer: {
                  label: fromLabel,
                  ...youNoteInp.value.trim() ? { note: youNoteInp.value.trim() } : {},
                  category: selectedCat
                }
              } : {}
            }
          ]
        },
        reason: `Updated bond ${youName} ⇄ ${actor.name}`
      });
      close();
    }, "ls-btn-primary");
    body.append(youWrap, youNoteWrap, npcWrap, npcNoteWrap, catWrap, saveBtn);
  });
}
function getTemplateCharBondSchemas(schemas) {
  return schemas.filter((s) => s.enabled && s.scope === "character" && ["meter", "number", "clock", "pips", "hearts", "currency"].includes(s.kind) && !(s.displayStyle && s.displayStyle !== "auto"));
}
function renderDynamicPeerBondMeters(meters, charSchemas) {
  if (!meters)
    return null;
  const schemaMap = new Map(charSchemas.map((s) => [s.id, s]));
  const entries = Object.entries(meters).filter(([k, v]) => {
    const schema = schemaMap.get(k);
    if (!schema || !schema.enabled)
      return false;
    return v !== undefined && v !== "" && v !== "None";
  });
  if (!entries.length)
    return null;
  const grid = el("div", "ls-cast-mini-grid");
  grid.style.marginTop = "4px";
  for (const [mKey, mVal] of entries) {
    const schema = schemaMap.get(mKey);
    const cell = el("div", "ls-cast-mini-meter");
    cell.style.setProperty("--ls-bar-color", schema.color || "var(--ls-primary)");
    const top = el("div", "ls-row-between");
    top.append(el("small", "ls-muted", `${schema.icon} ${schema.label}`), el("strong", "", String(mVal)));
    cell.append(top);
    if (typeof mVal === "number") {
      const span = Math.max(1, schema.max - schema.min);
      const track = el("div", "ls-bar-track");
      const fill = el("div", "ls-bar-fill");
      if (schema.min < 0 && schema.max > 0) {
        track.dataset.bipolar = "true";
        const zeroPct = (0 - schema.min) / span * 100;
        if (mVal >= 0) {
          fill.style.marginLeft = `${zeroPct.toFixed(1)}%`;
          fill.style.width = `${Math.min(100 - zeroPct, mVal / schema.max * (100 - zeroPct)).toFixed(1)}%`;
        } else {
          const wPct = Math.abs(mVal) / Math.abs(schema.min) * zeroPct;
          fill.style.marginLeft = `${Math.max(0, zeroPct - wPct).toFixed(1)}%`;
          fill.style.width = `${Math.min(zeroPct, wPct).toFixed(1)}%`;
          fill.style.background = "var(--ls-danger)";
        }
      } else {
        const pct = Math.max(0, Math.min(100, Math.round((mVal - schema.min) / span * 100)));
        fill.style.width = `${pct}%`;
      }
      track.append(fill);
      cell.append(track);
    }
    grid.append(cell);
  }
  return grid;
}
function openNpcBondEditorModal(ctrl, sourceActor, existingBond) {
  const { state, template } = ctrl.snapshot;
  const otherActors = Object.values(state.characters).filter((c) => c.id !== sourceActor.id);
  const charSchemas = getTemplateCharBondSchemas(template.stats);
  ctrl.modals.open({
    title: existingBond ? `\uD83E\uDD1D Edit NPC Bond: ${sourceActor.name} ⇄ ${existingBond.toName}` : `➕ Add Bond from ${sourceActor.name} to Another NPC`,
    width: 560
  }, (body, close) => {
    const targetWrap = el("label", "ls-label", `Other Character (${sourceActor.name} → ?)`);
    const targetInp = el("input", "ls-input");
    targetInp.placeholder = otherActors.length ? `e.g. ${otherActors.map((a) => a.name).join(", ")} or another NPC name` : "Enter NPC name…";
    targetInp.value = existingBond?.toName ?? (otherActors[0]?.name ?? "");
    targetWrap.append(targetInp);
    if (otherActors.length > 0) {
      const quickRow = el("div", "ls-row");
      for (const peer of otherActors) {
        quickRow.append(btn(`\uD83D\uDC64 ${peer.name}`, () => {
          targetInp.value = peer.name;
        }, "ls-btn-sm"));
      }
      targetWrap.append(quickRow);
    }
    const labelWrap = el("label", "ls-label", `${sourceActor.name}'s Relation to Them`);
    const labelInp = el("input", "ls-input");
    labelInp.placeholder = "e.g. Older Sister, Ex-Fiancé, Rival, Boss…";
    labelInp.value = existingBond?.label ?? "";
    labelWrap.append(labelInp);
    const chipRow = el("div", "ls-row");
    for (const chipTxt of QUICK_RELATION_CHIPS.slice(0, 6)) {
      chipRow.append(btn(chipTxt, () => {
        labelInp.value = chipTxt;
      }, "ls-btn-sm ls-quick-pill"));
    }
    labelWrap.append(chipRow);
    const attWrap = el("label", "ls-label", `Why / Dynamic Note (Optional)`);
    const attInp = el("input", "ls-input");
    attInp.placeholder = "e.g. Still bitter about what happened last summer…";
    attInp.value = existingBond?.attitude ?? "";
    attWrap.append(attInp);
    const peerActor = existingBond ? state.characters[existingBond.toId] : otherActors[0];
    const reverseExisting = peerActor?.peerBonds?.[sourceActor.id];
    const fwdMeterInputs = new Map;
    if (charSchemas.length > 0) {
      const fwdGridWrap = el("div", "ls-label", `${sourceActor.name}'s Stats Toward Them`);
      const fwdGrid = el("div", "ls-grid");
      for (const schema of charSchemas) {
        const curVal = existingBond?.meters?.[schema.id] ?? schema.defaultValue;
        const wrapCell = el("label", "ls-label", `${schema.icon} ${schema.label} (${schema.min}..${schema.max})`);
        const inp = el("input", "ls-input");
        inp.type = "number";
        inp.min = String(schema.min);
        inp.max = String(schema.max);
        inp.step = String(schema.step || 1);
        inp.value = String(typeof curVal === "number" ? curVal : schema.defaultValue);
        wrapCell.append(inp);
        fwdGrid.append(wrapCell);
        fwdMeterInputs.set(schema.id, inp);
      }
      fwdGridWrap.append(fwdGrid);
      body.append(fwdGridWrap);
    }
    const revLabelWrap = el("label", "ls-label", `Their Relation Back to ${sourceActor.name} (Optional)`);
    const revLabelInp = el("input", "ls-input");
    revLabelInp.placeholder = "e.g. Younger Brother, Loyal Friend…";
    revLabelInp.value = reverseExisting?.label ?? "";
    revLabelWrap.append(revLabelInp);
    const revMeterInputs = new Map;
    if (charSchemas.length > 0) {
      const revGridWrap = el("div", "ls-label", `Their Stats Back Toward ${sourceActor.name} (Optional)`);
      const revGrid = el("div", "ls-grid");
      for (const schema of charSchemas) {
        const curVal = reverseExisting?.meters?.[schema.id] ?? schema.defaultValue;
        const wrapCell = el("label", "ls-label", `${schema.icon} ${schema.label} (${schema.min}..${schema.max})`);
        const inp = el("input", "ls-input");
        inp.type = "number";
        inp.min = String(schema.min);
        inp.max = String(schema.max);
        inp.step = String(schema.step || 1);
        inp.value = String(typeof curVal === "number" ? curVal : schema.defaultValue);
        wrapCell.append(inp);
        revGrid.append(wrapCell);
        revMeterInputs.set(schema.id, inp);
      }
      revGridWrap.append(revGrid);
      revLabelWrap.append(revGridWrap);
    }
    let selectedCat = existingBond?.category ?? inferBondCategory(existingBond?.label ?? "", existingBond?.attitude ?? "");
    const catWrap = el("div", "ls-label", "Bond Type / Color");
    const catRow = el("div", "ls-row");
    const syncCat = () => {
      for (const b of [...catRow.querySelectorAll("button")]) {
        b.setAttribute("aria-current", b.dataset.cat === selectedCat ? "page" : "false");
      }
    };
    for (const [catKey, meta] of Object.entries(BOND_CATEGORY_META)) {
      const b = btn(`${meta.icon} ${meta.label}`, () => {
        selectedCat = catKey;
        syncCat();
      }, "ls-btn-sm");
      b.dataset.cat = catKey;
      catRow.append(b);
    }
    syncCat();
    catWrap.append(catRow);
    const saveBtn = btn("\uD83D\uDCBE Save NPC Bond", () => {
      const targetName = targetInp.value.trim();
      if (!targetName)
        return;
      const label = labelInp.value.trim() || "Acquaintance";
      const attitude = attInp.value.trim();
      const fwdMeters = {};
      for (const schema of charSchemas) {
        const raw = Number(fwdMeterInputs.get(schema.id)?.value);
        if (Number.isFinite(raw)) {
          fwdMeters[schema.id] = Math.max(schema.min, Math.min(schema.max, Math.round(raw)));
        }
      }
      const charactersPatch = [
        {
          id: sourceActor.id,
          name: sourceActor.name,
          peerBonds: [{ target: targetName, label, attitude, category: selectedCat, meters: fwdMeters }]
        }
      ];
      const revLabel = revLabelInp.value.trim();
      if (revLabel) {
        const revMeters = {};
        for (const schema of charSchemas) {
          const raw = Number(revMeterInputs.get(schema.id)?.value);
          if (Number.isFinite(raw)) {
            revMeters[schema.id] = Math.max(schema.min, Math.min(schema.max, Math.round(raw)));
          }
        }
        charactersPatch.push({
          name: targetName,
          peerBonds: [
            {
              target: sourceActor.name,
              label: revLabel,
              attitude: reverseExisting?.attitude ?? "",
              category: selectedCat,
              meters: revMeters
            }
          ]
        });
      }
      ctrl.request("state:mutate", {
        patch: { characters: charactersPatch },
        reason: `Updated bond ${sourceActor.name} ⇄ ${targetName}`
      });
      close();
    }, "ls-btn-primary");
    body.append(targetWrap, labelWrap, attWrap, revLabelWrap, catWrap, saveBtn);
  });
}
function renderRelationshipWebSurface(ctrl, onOpenDossier) {
  const { state, template } = ctrl.snapshot;
  const charBondSchemas = getTemplateCharBondSchemas(template.stats);
  const wrap = el("div", "ls-stack");
  const characters = Object.values(state.characters);
  const youName = state.player.name || "You";
  if (pivotFocusId !== "player" && pivotFocusId !== "all" && !state.characters[pivotFocusId]) {
    pivotFocusId = "player";
  }
  const topBar = el("div", "ls-row-between");
  const pivotRow = el("div", "ls-row");
  pivotRow.append(el("span", "ls-kicker", "Focus:"));
  const youBtn = btn(`\uD83D\uDC64 ${youName}`, () => {
    pivotFocusId = "player";
    ctrl.emitChange();
  }, "ls-btn-sm");
  if (pivotFocusId === "player")
    youBtn.setAttribute("aria-current", "page");
  pivotRow.append(youBtn);
  for (const c of characters) {
    const b = btn(`${c.present ? "\uD83D\uDFE2" : "⚪"} ${c.name}`, () => {
      pivotFocusId = c.id;
      ctrl.selectedActorId = c.id;
      ctrl.emitChange();
    }, "ls-btn-sm");
    if (pivotFocusId === c.id)
      b.setAttribute("aria-current", "page");
    pivotRow.append(b);
  }
  if (characters.length >= 2) {
    const allBtn = btn("\uD83D\uDD78️ Full Web", () => {
      pivotFocusId = "all";
      ctrl.emitChange();
    }, "ls-btn-sm");
    if (pivotFocusId === "all")
      allBtn.setAttribute("aria-current", "page");
    pivotRow.append(allBtn);
  }
  const rightBtns = el("div", "ls-row");
  rightBtns.append(btn(bondDisplayMode === "web" ? "\uD83D\uDCCB Cards Only" : "\uD83D\uDD78️ Show Map", () => {
    bondDisplayMode = bondDisplayMode === "web" ? "cards" : "web";
    ctrl.emitChange();
  }, "ls-btn-sm"));
  if (characters.length > 0) {
    const targetForAdd = (pivotFocusId !== "player" && pivotFocusId !== "all" ? state.characters[pivotFocusId] : undefined) ?? (ctrl.selectedActorId ? state.characters[ctrl.selectedActorId] : undefined) ?? characters[0];
    rightBtns.append(btn(`+ Add NPC Bond`, () => openNpcBondEditorModal(ctrl, targetForAdd), "ls-btn-sm ls-btn-primary"));
  }
  topBar.append(pivotRow, rightBtns);
  wrap.append(topBar);
  if (!characters.length) {
    const empty = el("div", "ls-card");
    empty.append(el("strong", "", "Bond Web Ready"), el("p", "ls-muted", "Once characters appear in chat, your two-way relations with them and their relations with each other will appear here."));
    wrap.append(empty);
    return wrap;
  }
  const legendBar = el("div", "ls-web-legend");
  const legendItems = el("div", "ls-row");
  for (const meta of Object.values(BOND_CATEGORY_META)) {
    const item = el("span", "ls-web-legend-item");
    const dot = el("span", "ls-web-swatch");
    dot.style.background = meta.color;
    item.append(dot, document.createTextNode(`${meta.icon} ${meta.label}`));
    legendItems.append(item);
  }
  legendBar.append(legendItems);
  wrap.append(legendBar);
  if (bondDisplayMode === "web") {
    const stage = el("div", "ls-bw-stage");
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.classList.add("ls-bw-svg");
    const nodes = [];
    if (pivotFocusId === "player") {
      nodes.push({
        id: "player",
        name: youName,
        isPlayer: true,
        present: true,
        xPct: 50,
        yPct: characters.length === 1 ? 18 : 50,
        color: "#38bdf8"
      });
      characters.forEach((c, idx) => {
        const npcToYou = getNpcToPlayerBond(c);
        const catMeta = BOND_CATEGORY_META[npcToYou.category ?? "neutral"];
        let xPct = 50;
        let yPct = 82;
        if (characters.length === 1) {
          xPct = 50;
          yPct = 82;
        } else if (characters.length === 2) {
          xPct = idx === 0 ? 15 : 85;
          yPct = 50;
        } else {
          const angle = idx / characters.length * Math.PI * 2 - Math.PI / 2;
          xPct = 50 + Math.cos(angle) * 38;
          yPct = 50 + Math.sin(angle) * 35;
        }
        nodes.push({
          id: c.id,
          name: c.name,
          isPlayer: false,
          present: c.present,
          portraitUrl: c.portraitUrl,
          xPct: Number(xPct.toFixed(1)),
          yPct: Number(yPct.toFixed(1)),
          color: catMeta.color
        });
      });
    } else if (pivotFocusId !== "all" && state.characters[pivotFocusId]) {
      const focal = state.characters[pivotFocusId];
      const others = [
        { id: "player", name: youName, isPlayer: true, present: true },
        ...characters.filter((c) => c.id !== focal.id).map((c) => ({ id: c.id, name: c.name, isPlayer: false, present: c.present, portraitUrl: c.portraitUrl }))
      ];
      nodes.push({
        id: focal.id,
        name: focal.name,
        isPlayer: false,
        present: focal.present,
        portraitUrl: focal.portraitUrl,
        xPct: 50,
        yPct: others.length === 1 ? 18 : 50,
        color: "#38bdf8"
      });
      others.forEach((other, idx) => {
        let xPct = 50;
        let yPct = 82;
        if (others.length === 1) {
          xPct = 50;
          yPct = 82;
        } else if (others.length === 2) {
          xPct = idx === 0 ? 15 : 85;
          yPct = 50;
        } else {
          const angle = idx / others.length * Math.PI * 2 - Math.PI / 2;
          xPct = 50 + Math.cos(angle) * 38;
          yPct = 50 + Math.sin(angle) * 35;
        }
        const cat = other.isPlayer ? getNpcToPlayerBond(focal).category ?? "neutral" : focal.peerBonds?.[other.id]?.category ?? state.characters[other.id]?.peerBonds?.[focal.id]?.category ?? "neutral";
        nodes.push({
          id: other.id,
          name: other.name,
          isPlayer: other.isPlayer,
          present: other.present,
          portraitUrl: other.portraitUrl,
          xPct: Number(xPct.toFixed(1)),
          yPct: Number(yPct.toFixed(1)),
          color: BOND_CATEGORY_META[cat].color
        });
      });
    } else {
      const allRing = [
        { id: "player", name: youName, isPlayer: true, present: true, portraitUrl: undefined },
        ...characters.map((c) => ({
          id: c.id,
          name: c.name,
          isPlayer: false,
          present: c.present,
          portraitUrl: c.portraitUrl
        }))
      ];
      allRing.forEach((item, idx) => {
        const angle = idx / allRing.length * Math.PI * 2 - Math.PI / 2;
        const xPct = 50 + Math.cos(angle) * 37;
        const yPct = 50 + Math.sin(angle) * 35;
        const actor = item.isPlayer ? undefined : state.characters[item.id];
        const cat = actor ? getNpcToPlayerBond(actor).category ?? "neutral" : "friend";
        nodes.push({
          id: item.id,
          name: item.name,
          isPlayer: item.isPlayer,
          present: item.present,
          portraitUrl: item.portraitUrl,
          xPct: Number(xPct.toFixed(1)),
          yPct: Number(yPct.toFixed(1)),
          color: BOND_CATEGORY_META[cat].color
        });
      });
    }
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    const drawRelationLink = (from, to, color, lines, titleHint, onClickPill, curve = 0) => {
      const mx = (from.xPct + to.xPct) / 2;
      const my = (from.yPct + to.yPct) / 2;
      const dx = to.xPct - from.xPct;
      const dy = to.yPct - from.yPct;
      const len = Math.max(1, Math.hypot(dx, dy));
      const cx = mx + -dy / len * curve;
      const cy = my + dx / len * curve;
      const path = document.createElementNS(ns, "path");
      path.setAttribute("d", `M ${from.xPct} ${from.yPct} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${to.xPct} ${to.yPct}`);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", color);
      path.setAttribute("stroke-width", "0.8");
      path.setAttribute("stroke-opacity", "0.82");
      svg.append(path);
      if (lines.length > 0) {
        const qx = 0.25 * from.xPct + 0.5 * cx + 0.25 * to.xPct;
        const qy = 0.25 * from.yPct + 0.5 * cy + 0.25 * to.yPct;
        const pill = el("div", "ls-bw-edge-pill");
        pill.style.setProperty("--ls-bond-color", color);
        pill.style.left = `${Math.max(15, Math.min(85, qx)).toFixed(1)}%`;
        pill.style.top = `${Math.max(14, Math.min(86, qy)).toFixed(1)}%`;
        pill.title = titleHint;
        for (const l of lines) {
          pill.append(el("span", "ls-bw-edge-line", l));
        }
        pill.addEventListener("click", (e) => {
          e.stopPropagation();
          onClickPill();
        });
        stage.append(pill);
      }
    };
    const drawYouNpcPair = (actor, pNode, aNode, compactText) => {
      const npcToYou = getNpcToPlayerBond(actor);
      const youToNpc = getPlayerToNpcBond(actor);
      const cat = npcToYou.category ?? youToNpc.category ?? "neutral";
      const color = BOND_CATEGORY_META[cat].color;
      const summaryLabel = npcToYou.label && npcToYou.label !== "Acquaintance" ? npcToYou.label : youToNpc.label !== "Not defined yet" ? youToNpc.label : npcToYou.label;
      const lines = [summaryLabel];
      const fullHint = `You → ${actor.name}: ${youToNpc.label}
${actor.name} → You: ${npcToYou.label}`;
      drawRelationLink(pNode, aNode, color, lines, fullHint, () => openPlayerBondEditorModal(ctrl, actor), compactText ? -8 : 0);
    };
    if (pivotFocusId === "player") {
      const pNode = nodeMap.get("player");
      for (const actor of characters) {
        const aNode = nodeMap.get(actor.id);
        if (aNode)
          drawYouNpcPair(actor, pNode, aNode, false);
      }
    } else if (pivotFocusId !== "all" && state.characters[pivotFocusId]) {
      const focal = state.characters[pivotFocusId];
      const fNode = nodeMap.get(focal.id);
      const pNode = nodeMap.get("player");
      if (pNode)
        drawYouNpcPair(focal, pNode, fNode, false);
      for (const other of characters) {
        if (other.id === focal.id)
          continue;
        const oNode = nodeMap.get(other.id);
        if (!oNode)
          continue;
        const aToB = focal.peerBonds?.[other.id];
        const bToA = other.peerBonds?.[focal.id];
        if (!aToB && !bToA)
          continue;
        const cat = aToB?.category ?? bToA?.category ?? "neutral";
        const lines = [
          aToB ? `${focal.name} → ${other.name}: ${aToB.label}` : "",
          bToA ? `${other.name} → ${focal.name}: ${bToA.label}` : ""
        ].filter(Boolean);
        const shortPeer = aToB?.label || bToA?.label || "Acquaintance";
        drawRelationLink(fNode, oNode, BOND_CATEGORY_META[cat].color, [shortPeer], lines.join(`
`), () => openNpcBondEditorModal(ctrl, focal, aToB), 0);
      }
    } else {
      const pNode = nodeMap.get("player");
      for (const actor of characters) {
        const aNode = nodeMap.get(actor.id);
        if (aNode)
          drawYouNpcPair(actor, pNode, aNode, true);
      }
      const seenPairs = new Set;
      for (const actor of characters) {
        const aNode = nodeMap.get(actor.id);
        if (!aNode)
          continue;
        for (const bond of Object.values(actor.peerBonds ?? {})) {
          const bNode = nodeMap.get(bond.toId);
          if (!bNode)
            continue;
          const pairKey = [actor.id, bond.toId].sort().join("::");
          if (seenPairs.has(pairKey))
            continue;
          seenPairs.add(pairKey);
          const rev = state.characters[bond.toId]?.peerBonds?.[actor.id];
          const cat = bond.category ?? rev?.category ?? "neutral";
          const hintLines = [
            `${actor.name} → ${bond.toName}: ${bond.label}`,
            ...rev ? [`${bond.toName} → ${actor.name}: ${rev.label}`] : []
          ];
          drawRelationLink(aNode, bNode, BOND_CATEGORY_META[cat].color, [bond.label || rev?.label || "Peer"], hintLines.join(`
`), () => openNpcBondEditorModal(ctrl, actor, bond), 16);
        }
      }
    }
    stage.prepend(svg);
    for (const node of nodes) {
      const isFocal = node.id === pivotFocusId;
      const btnEl = el("button", "ls-bw-node");
      btnEl.type = "button";
      btnEl.dataset.focal = String(isFocal);
      btnEl.style.left = `${node.xPct}%`;
      btnEl.style.top = `${node.yPct}%`;
      btnEl.style.setProperty("--ls-bond-color", node.color);
      btnEl.title = `Click to focus ${node.name}'s bonds`;
      const av = el("div", "ls-bw-avatar");
      if (node.portraitUrl) {
        const img = el("img");
        img.src = node.portraitUrl;
        img.alt = node.name;
        av.append(img);
      } else {
        av.append(document.createTextNode(node.isPlayer ? "\uD83D\uDC64" : getInitials(node.name)));
      }
      if (!node.isPlayer) {
        av.append(el("span", `ls-roster-dot ${node.present ? "is-present" : "is-away"}`));
      }
      btnEl.append(av, el("span", "ls-bw-name", node.name));
      btnEl.addEventListener("click", () => {
        pivotFocusId = node.isPlayer ? "player" : node.id;
        if (!node.isPlayer)
          ctrl.selectedActorId = node.id;
        ctrl.emitChange();
      });
      stage.append(btnEl);
    }
    wrap.append(stage);
  }
  const targetChars = pivotFocusId !== "player" && pivotFocusId !== "all" && state.characters[pivotFocusId] ? [state.characters[pivotFocusId]] : characters;
  const playerSection = el("div", "ls-stack");
  playerSection.append(el("span", "ls-kicker", `\uD83D\uDC64 Your Bonds (${youName} ⇄ Cast)`));
  for (const actor of targetChars) {
    const npcToYou = getNpcToPlayerBond(actor);
    const youToNpc = getPlayerToNpcBond(actor);
    const cat = npcToYou.category ?? youToNpc.category ?? "neutral";
    const meta = BOND_CATEGORY_META[cat];
    const pairCard = el("div", "ls-bw-pair-card");
    pairCard.style.setProperty("--ls-bond-color", meta.color);
    const head = el("div", "ls-row-between");
    const leftTitle = el("div", "ls-row");
    leftTitle.append(el("strong", "", `${youName} ⇄ ${actor.name}`), el("span", "ls-bw-cat-chip", `${meta.icon} ${meta.label}`));
    leftTitle.lastElementChild.style.setProperty("--ls-bond-color", meta.color);
    const rightActs = el("div", "ls-row");
    rightActs.append(btn("✏️ Edit Bond", () => openPlayerBondEditorModal(ctrl, actor), "ls-btn-sm"), btn("\uD83E\uDEAA Dossier", () => onOpenDossier(actor.id), "ls-btn-sm ls-btn-primary"));
    head.append(leftTitle, rightActs);
    pairCard.append(head);
    const twoCol = el("div", "ls-bw-two-col");
    const youBox = el("div", "ls-bw-dir-box");
    youBox.append(el("small", "ls-kicker", `Your Bond → ${actor.name}`), el("strong", "", youToNpc.label), ...youToNpc.note ? [el("small", "ls-muted", youToNpc.note)] : []);
    const npcBox = el("div", "ls-bw-dir-box");
    npcBox.append(el("small", "ls-kicker", `${actor.name}'s Bond → You`), el("strong", "", npcToYou.label), ...npcToYou.note ? [el("small", "ls-muted", npcToYou.note)] : []);
    twoCol.append(youBox, npcBox);
    pairCard.append(twoCol);
    playerSection.append(pairCard);
  }
  wrap.append(playerSection);
  const peerPairs = [];
  const seenPeerPairs = new Set;
  for (const actorA of targetChars) {
    for (const [targetId, bondAB] of Object.entries(actorA.peerBonds ?? {})) {
      const actorB = state.characters[targetId];
      if (!actorB)
        continue;
      const key = [actorA.id, actorB.id].sort().join("::");
      if (seenPeerPairs.has(key))
        continue;
      seenPeerPairs.add(key);
      peerPairs.push({
        a: actorA,
        b: actorB,
        aToB: bondAB,
        bToA: actorB.peerBonds?.[actorA.id]
      });
    }
    for (const other of characters) {
      if (other.id === actorA.id)
        continue;
      const bondBA = other.peerBonds?.[actorA.id];
      if (!bondBA)
        continue;
      const key = [actorA.id, other.id].sort().join("::");
      if (seenPeerPairs.has(key))
        continue;
      seenPeerPairs.add(key);
      peerPairs.push({
        a: actorA,
        b: other,
        aToB: actorA.peerBonds?.[other.id],
        bToA: bondBA
      });
    }
  }
  const npcSection = el("div", "ls-stack");
  npcSection.append(el("span", "ls-kicker", `\uD83E\uDD1D Cast Bonds (NPC ⇄ NPC · ${peerPairs.length})`));
  if (!peerPairs.length) {
    npcSection.append(el("p", "ls-muted", 'No NPC-to-NPC bonds recorded yet. They appear automatically when characters have an established relation in the story, or click "+ Add NPC Bond" above.'));
  } else {
    for (const pair of peerPairs) {
      const cat = pair.aToB?.category ?? pair.bToA?.category ?? "neutral";
      const meta = BOND_CATEGORY_META[cat];
      const pairCard = el("div", "ls-bw-pair-card");
      pairCard.style.setProperty("--ls-bond-color", meta.color);
      const head = el("div", "ls-row-between");
      const leftTitle = el("div", "ls-row");
      leftTitle.append(el("strong", "", `${pair.a.name} ⇄ ${pair.b.name}`), el("span", "ls-bw-cat-chip", `${meta.icon} ${meta.label}`));
      leftTitle.lastElementChild.style.setProperty("--ls-bond-color", meta.color);
      const rightActs = el("div", "ls-row");
      rightActs.append(btn("✏️ Edit Bond", () => openNpcBondEditorModal(ctrl, pair.a, pair.aToB), "ls-btn-sm"), btn("\uD83D\uDDD1️", () => {
        const nextChars = structuredClone(state.characters);
        if (nextChars[pair.a.id]?.peerBonds)
          delete nextChars[pair.a.id].peerBonds[pair.b.id];
        if (nextChars[pair.b.id]?.peerBonds)
          delete nextChars[pair.b.id].peerBonds[pair.a.id];
        ctrl.request("state:mutate", {
          stateOverride: { characters: nextChars },
          reason: `Removed bond ${pair.a.name} ⇄ ${pair.b.name}`
        });
      }, "ls-btn-sm ls-btn-icon ls-btn-danger", "Delete NPC bond"));
      head.append(leftTitle, rightActs);
      pairCard.append(head);
      const twoCol = el("div", "ls-bw-two-col");
      const boxA = el("div", "ls-bw-dir-box");
      boxA.append(el("small", "ls-kicker", `${pair.a.name} → ${pair.b.name}`), el("strong", "", pair.aToB?.label || "Not defined yet"), ...pair.aToB?.attitude ? [el("small", "ls-muted", pair.aToB.attitude)] : []);
      const aMetersEl = renderDynamicPeerBondMeters(pair.aToB?.meters, charBondSchemas);
      if (aMetersEl)
        boxA.append(aMetersEl);
      const boxB = el("div", "ls-bw-dir-box");
      boxB.append(el("small", "ls-kicker", `${pair.b.name} → ${pair.a.name}`), el("strong", "", pair.bToA?.label || "Not defined yet"), ...pair.bToA?.attitude ? [el("small", "ls-muted", pair.bToA.attitude)] : []);
      const bMetersEl = renderDynamicPeerBondMeters(pair.bToA?.meters, charBondSchemas);
      if (bMetersEl)
        boxB.append(bMetersEl);
      twoCol.append(boxA, boxB);
      pairCard.append(twoCol);
      npcSection.append(pairCard);
    }
  }
  wrap.append(npcSection);
  return wrap;
}

// src/frontend/surfaces/RpgWidgets.ts
var radarToggleState = new Map;
function tryParseJsonObj(raw) {
  const s = raw.trim();
  if (!s.startsWith("{") && !s.startsWith("["))
    return null;
  try {
    const parsed = JSON.parse(s);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}
function parseSkillTreeValue(raw) {
  const str = String(raw ?? "").trim();
  const obj = tryParseJsonObj(str);
  if (obj && Array.isArray(obj.nodes)) {
    const sp = Math.max(0, Math.round(Number(obj.sp ?? obj.skillPoints ?? obj.points ?? 0) || 0));
    const nodes = obj.nodes.filter((n) => Boolean(n && typeof n === "object")).map((n) => {
      const level = Math.max(0, Math.round(Number(n.level ?? 0) || 0));
      const maxLevel = Math.max(1, Math.round(Number(n.maxLevel ?? n.max ?? 5) || 5));
      return {
        name: String(n.name ?? "Skill").trim(),
        level: Math.min(maxLevel, level),
        maxLevel,
        cost: Math.max(1, Math.round(Number(n.cost ?? 1) || 1)),
        ...typeof n.requires === "string" && n.requires.trim() ? { requires: n.requires.trim() } : {},
        ...typeof n.bonus === "string" && n.bonus.trim() ? { bonus: n.bonus.trim() } : {},
        unlocked: level > 0 || n.unlocked === true
      };
    });
    return { sp, nodes };
  }
  let sp = 0;
  let body = str;
  const spMatch = str.match(/^(?:SP|Skill\s*Points?|Points?)\s*:\s*(\d+)\s*(?:\||;|\n|$)/i);
  if (spMatch) {
    sp = Math.max(0, Math.round(Number(spMatch[1]) || 0));
    body = str.slice(spMatch[0].length).trim();
  }
  const nodes = [];
  const rawNodes = body.split(/\s*(?:;|\n|\|)\s*/).map((s) => s.trim()).filter(Boolean);
  for (const token of rawNodes) {
    const parenMatch = token.match(/^([^(\[]+?)\s*(?:\(([^)]+)\)|\[([^\]]+)\])?$/);
    const name = (parenMatch?.[1] ?? token).trim();
    const meta = (parenMatch?.[2] ?? parenMatch?.[3] ?? "").trim();
    if (!name || /^(?:none|default)$/i.test(name))
      continue;
    let level = 0;
    let maxLevel = 5;
    let cost = 1;
    let requires = "";
    const extras = [];
    for (const part of meta.split(/\s*,\s*/).map((p) => p.trim()).filter(Boolean)) {
      const lvMatch = part.match(/^(?:lv\.?|lvl|rank)?\s*(\d+)\s*(?:\/\s*(\d+))?$/i);
      const costMatch = part.match(/^cost\s*:\s*(\d+)$/i);
      const reqMatch = part.match(/^req(?:uires)?\s*:\s*(.+)$/i);
      if (lvMatch) {
        level = Math.max(0, Number(lvMatch[1]) || 0);
        if (lvMatch[2])
          maxLevel = Math.max(1, Number(lvMatch[2]) || 5);
      } else if (costMatch) {
        cost = Math.max(1, Number(costMatch[1]) || 1);
      } else if (reqMatch) {
        requires = reqMatch[1].trim();
      } else {
        extras.push(part);
      }
    }
    nodes.push({
      name,
      level: Math.min(maxLevel, level),
      maxLevel,
      cost,
      ...requires ? { requires } : {},
      ...extras.length ? { bonus: extras.join(", ") } : {},
      unlocked: level > 0
    });
  }
  return { sp, nodes };
}
function serializeSkillTreeValue(tree) {
  const parts = tree.nodes.map((n) => {
    const meta = [`Lv.${n.level}/${n.maxLevel}`, `cost:${n.cost}`];
    if (n.requires)
      meta.push(`req:${n.requires}`);
    if (n.bonus)
      meta.push(n.bonus);
    return `${n.name} (${meta.join(", ")})`;
  });
  return `SP: ${tree.sp}${parts.length ? ` | ${parts.join(" ; ")}` : ""}`;
}
function renderSkillTreeWidget(schema, rawVal, locked, onCommitValue) {
  const tree = parseSkillTreeValue(rawVal);
  const wrap = el("div", "ls-rpg-skill-wrap");
  const topBar = el("div", "ls-row-between");
  const spBadge = el("span", "ls-rpg-sp-badge", `✦ ${tree.sp} Skill Point${tree.sp === 1 ? "" : "s"}`);
  topBar.append(spBadge);
  if (!locked && onCommitValue) {
    const quickBtns = el("div", "ls-row");
    quickBtns.append(btn("+1 SP", () => {
      const next = { ...tree, sp: tree.sp + 1 };
      onCommitValue(serializeSkillTreeValue(next), `Granted +1 SP to ${schema.label}`);
    }, "ls-btn-sm"));
    topBar.append(quickBtns);
  }
  wrap.append(topBar);
  if (!tree.nodes.length) {
    wrap.append(el("small", "ls-muted", 'No skill nodes yet. Format: "SP: 2 | Slash (Lv.1/5, cost:1) ; Parry (Lv.0/3, cost:1, req:Slash)"'));
    return wrap;
  }
  const levelByName = new Map(tree.nodes.map((n) => [n.name.toLowerCase(), n.level]));
  const grid = el("div", "ls-rpg-skill-grid");
  for (const [idx, node] of tree.nodes.entries()) {
    const reqMet = !node.requires || (levelByName.get(node.requires.toLowerCase()) ?? 0) > 0;
    const isMaxed = node.level >= node.maxLevel;
    const canUpgrade = !locked && Boolean(onCommitValue) && reqMet && !isMaxed && tree.sp >= node.cost;
    const card = el("div", "ls-rpg-skill-node");
    card.dataset.unlocked = String(node.level > 0);
    card.dataset.lockedReq = String(!reqMet);
    card.dataset.maxed = String(isMaxed);
    const head = el("div", "ls-row-between");
    head.append(el("strong", "", `${isMaxed ? "★ " : node.level > 0 ? "◆ " : "◇ "}${node.name}`), el("span", "ls-chip ls-chip-accent", `Lv.${node.level}/${node.maxLevel}`));
    card.append(head);
    const pipTrack = el("div", "ls-clock-bar");
    pipTrack.style.gridTemplateColumns = `repeat(${Math.min(10, node.maxLevel)}, 1fr)`;
    for (let p = 1;p <= Math.min(10, node.maxLevel); p++) {
      pipTrack.append(el("span", `ls-clock-seg${p <= node.level ? " is-filled" : ""}`));
    }
    card.append(pipTrack);
    if (node.bonus || node.requires) {
      const subBits = [
        node.requires ? `${reqMet ? "✓" : "\uD83D\uDD12"} Req: ${node.requires}` : "",
        node.bonus || ""
      ].filter(Boolean);
      card.append(el("small", "ls-muted", subBits.join(" · ")));
    }
    if (!locked && onCommitValue) {
      const actRow = el("div", "ls-row-between");
      actRow.append(el("small", "ls-muted", isMaxed ? "MASTERED" : `Cost: ${node.cost} SP`));
      const upgradeBtn = btn(isMaxed ? "✓ Max" : `+ Rank (${node.cost} SP)`, () => {
        const nextNodes = tree.nodes.map((n, i) => i === idx ? { ...n, level: n.level + 1, unlocked: true } : n);
        const nextTree = {
          sp: Math.max(0, tree.sp - node.cost),
          nodes: nextNodes
        };
        onCommitValue(serializeSkillTreeValue(nextTree), `Upgraded ${node.name} to Lv.${node.level + 1}`);
      }, `ls-btn-sm ${canUpgrade ? "ls-btn-primary" : ""}`);
      upgradeBtn.disabled = !canUpgrade;
      actRow.append(upgradeBtn);
      card.append(actRow);
    }
    grid.append(card);
  }
  wrap.append(grid);
  return wrap;
}
function parseXpLevelValue(raw) {
  const str = String(raw ?? "").trim();
  const obj = tryParseJsonObj(str);
  if (obj && !Array.isArray(obj)) {
    const level = Math.max(1, Math.round(Number(obj.level ?? obj.lv ?? 1) || 1));
    const xp = Math.max(0, Math.round(Number(obj.xp ?? obj.current ?? 0) || 0));
    const nextXp = Math.max(1, Math.round(Number(obj.nextXp ?? obj.max ?? level * 100) || 100));
    return {
      level,
      xp,
      nextXp,
      ...typeof obj.rank === "string" && obj.rank.trim() ? { rank: obj.rank.trim() } : {}
    };
  }
  const lvMatch = str.match(/(?:lv\.?|level)\s*(\d+)/i);
  const xpMatch = str.match(/(\d+)\s*\/\s*(\d+)\s*(?:xp)?/i);
  const rankMatch = str.match(/(?:rank|tier)\s*[:\-]?\s*([A-Za-z0-9+]+)/i);
  const level = Math.max(1, Number(lvMatch?.[1] ?? 1) || 1);
  const xp = Math.max(0, Number(xpMatch?.[1] ?? (Number(str) || 0)) || 0);
  const nextXp = Math.max(1, Number(xpMatch?.[2] ?? level * 100) || 100);
  return {
    level,
    xp,
    nextXp,
    ...rankMatch?.[1] ? { rank: rankMatch[1] } : {}
  };
}
function renderXpLevelWidget(schema, rawVal) {
  const parsed = parseXpLevelValue(rawVal);
  const pct = Math.max(0, Math.min(100, Math.round(parsed.xp / Math.max(1, parsed.nextXp) * 100)));
  const wrap = el("div", "ls-rpg-xp-wrap");
  const row = el("div", "ls-row-between");
  const crest = el("span", "ls-rpg-level-crest", `LV. ${parsed.level}`);
  const rightMeta = el("div", "ls-row");
  if (parsed.rank) {
    rightMeta.append(el("span", "ls-chip ls-chip-accent", `Rank ${parsed.rank}`));
  }
  rightMeta.append(el("small", "ls-muted", `${parsed.xp.toLocaleString()} / ${parsed.nextXp.toLocaleString()} XP (${pct}%)`));
  row.append(crest, rightMeta);
  const track = el("div", "ls-bar-track ls-rpg-xp-track");
  const fill = el("div", "ls-bar-fill");
  fill.style.width = `${pct}%`;
  fill.style.setProperty("--ls-bar-color", schema.color || "var(--ls-primary)");
  track.append(fill);
  wrap.append(row, track);
  return wrap;
}
function parseAttributesValue(raw, defaultMax = 20) {
  const str = String(raw ?? "").trim();
  const obj = tryParseJsonObj(str);
  if (obj && !Array.isArray(obj)) {
    return Object.entries(obj).filter(([, v]) => Number.isFinite(Number(v))).map(([name, v]) => {
      const val = Number(v);
      return { name, value: val, max: Math.max(defaultMax, val) };
    });
  }
  const out = [];
  for (const part of str.split(/[,;\n|]+/).map((s) => s.trim()).filter(Boolean)) {
    const m = part.match(/^([A-Za-z0-9_ .-]{1,20})\s*[:=]\s*(-?\d+(?:\.\d+)?)(?:\s*\/\s*(\d+))?$/);
    if (m) {
      const val = Number(m[2]);
      const max = m[3] ? Math.max(1, Number(m[3])) : Math.max(defaultMax, val);
      out.push({ name: m[1].trim(), value: val, max });
    }
  }
  return out;
}
function buildAttributesRadarSvg(items, accentColor) {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 220 190");
  svg.classList.add("ls-rpg-radar-svg");
  const cx = 110;
  const cy = 96;
  const radius = 62;
  const n = items.length;
  for (const ringScale of [0.33, 0.66, 1]) {
    const pts = items.map((_, i) => {
      const a = i / n * Math.PI * 2 - Math.PI / 2;
      return `${(cx + Math.cos(a) * radius * ringScale).toFixed(1)},${(cy + Math.sin(a) * radius * ringScale).toFixed(1)}`;
    });
    const poly = document.createElementNS(ns, "polygon");
    poly.setAttribute("points", pts.join(" "));
    poly.setAttribute("fill", "none");
    poly.setAttribute("stroke", "rgba(148,163,184,0.28)");
    poly.setAttribute("stroke-width", "1");
    svg.append(poly);
  }
  const dataPts = [];
  items.forEach((item, i) => {
    const a = i / n * Math.PI * 2 - Math.PI / 2;
    const ratio = Math.max(0.1, Math.min(1, item.value / Math.max(1, item.max)));
    const px = cx + Math.cos(a) * radius * ratio;
    const py = cy + Math.sin(a) * radius * ratio;
    dataPts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
    const axis = document.createElementNS(ns, "line");
    axis.setAttribute("x1", String(cx));
    axis.setAttribute("y1", String(cy));
    axis.setAttribute("x2", (cx + Math.cos(a) * radius).toFixed(1));
    axis.setAttribute("y2", (cy + Math.sin(a) * radius).toFixed(1));
    axis.setAttribute("stroke", "rgba(148,163,184,0.22)");
    axis.setAttribute("stroke-width", "1");
    svg.append(axis);
    const lbl = document.createElementNS(ns, "text");
    lbl.setAttribute("x", (cx + Math.cos(a) * (radius + 17)).toFixed(1));
    lbl.setAttribute("y", (cy + Math.sin(a) * (radius + 14) + 3).toFixed(1));
    lbl.setAttribute("text-anchor", "middle");
    lbl.setAttribute("fill", "currentColor");
    lbl.setAttribute("font-size", "9.5");
    lbl.setAttribute("font-weight", "700");
    lbl.textContent = `${item.name.slice(0, 6)} ${item.value}`;
    svg.append(lbl);
  });
  const area = document.createElementNS(ns, "polygon");
  area.setAttribute("points", dataPts.join(" "));
  area.setAttribute("fill", accentColor);
  area.setAttribute("fill-opacity", "0.26");
  area.setAttribute("stroke", accentColor);
  area.setAttribute("stroke-width", "2");
  svg.append(area);
  return svg;
}
function renderAttributesWidget(schema, rawVal, scopeKey) {
  const items = parseAttributesValue(rawVal, schema.max > 0 ? schema.max : 20);
  const wrap = el("div", "ls-stack");
  wrap.style.gap = "6px";
  if (!items.length) {
    wrap.append(el("small", "ls-muted", String(rawVal || "STR:10, DEX:10, INT:10, CHA:10")));
    return wrap;
  }
  const key = `${scopeKey}:${schema.id}`;
  let showRadar = radarToggleState.get(key) ?? false;
  const bodySlot = el("div");
  const draw = () => {
    bodySlot.replaceChildren();
    if (showRadar && items.length >= 3) {
      const radarWrap = el("div", "ls-rpg-radar-box");
      radarWrap.append(buildAttributesRadarSvg(items, schema.color || "var(--ls-primary)"));
      bodySlot.append(radarWrap);
      return;
    }
    const grid = el("div", "ls-rpg-attr-grid");
    for (const item of items) {
      const box = el("div", "ls-rpg-attr-cell");
      const mod = Math.floor((item.value - 10) / 2);
      const modText = item.max <= 30 ? mod >= 0 ? `+${mod}` : String(mod) : "";
      box.append(el("span", "ls-kicker", item.name), el("strong", "ls-rpg-attr-val", String(item.value)), ...modText ? [el("small", "ls-muted", `(${modText})`)] : []);
      grid.append(box);
    }
    bodySlot.append(grid);
  };
  if (items.length >= 3) {
    const toggleRow = el("div", "ls-row-between");
    toggleRow.append(el("small", "ls-muted", `${items.length} Core Attributes`), btn(showRadar ? "⊞ Grid View" : "\uD83D\uDD78️ Radar Chart", () => {
      showRadar = !showRadar;
      radarToggleState.set(key, showRadar);
      draw();
    }, "ls-btn-sm"));
    wrap.append(toggleRow);
  }
  draw();
  wrap.append(bodySlot);
  return wrap;
}
function parseInventoryValue(raw) {
  const str = String(raw ?? "").trim();
  const obj = tryParseJsonObj(str);
  if (Array.isArray(obj)) {
    return obj.filter((it) => it && typeof it === "object" && it.name).map((it) => ({
      name: String(it.name),
      qty: Math.max(1, Number(it.qty ?? it.quantity ?? 1) || 1),
      rarity: normalizeRarity(String(it.rarity ?? "common")),
      equipped: Boolean(it.equipped),
      ...typeof it.note === "string" ? { note: it.note } : {}
    }));
  }
  const out = [];
  for (const part of str.split(/\s*(?:;|\n|\|)\s*/).map((s) => s.trim()).filter(Boolean)) {
    if (/^(?:none|empty)$/i.test(part))
      continue;
    const bracketMatch = part.match(/^([^\[\]()]+?)(?:\s*x(\d+))?\s*(?:\[([^\]]+)\]|\(([^)]+)\))?$/i);
    const baseName = (bracketMatch?.[1] ?? part).trim();
    const qty = Math.max(1, Number(bracketMatch?.[2] ?? 1) || 1);
    const meta = (bracketMatch?.[3] ?? bracketMatch?.[4] ?? "").toLowerCase();
    const equipped = /\b(?:equipped|worn|active|main|offhand)\b/.test(meta);
    const rarity = normalizeRarity(meta);
    out.push({ name: baseName, qty, rarity, equipped });
  }
  return out;
}
function normalizeRarity(text) {
  if (/legendary|mythic|gold/.test(text))
    return "legendary";
  if (/epic|violet|purple/.test(text))
    return "epic";
  if (/rare|blue/.test(text))
    return "rare";
  if (/uncommon|green/.test(text))
    return "uncommon";
  return "common";
}
function renderInventoryWidget(rawVal) {
  const items = parseInventoryValue(rawVal);
  if (!items.length) {
    return el("small", "ls-muted", "Bag empty");
  }
  const grid = el("div", "ls-rpg-loot-grid");
  for (const item of items) {
    const cell = el("div", "ls-rpg-loot-card");
    cell.dataset.rarity = item.rarity;
    const top = el("div", "ls-row-between");
    top.append(el("strong", "", `${item.equipped ? "⚔️ " : "\uD83C\uDF92 "}${item.name}`), el("span", "ls-chip", item.qty > 1 ? `×${item.qty}` : item.rarity.toUpperCase()));
    cell.append(top);
    if (item.equipped || item.rarity !== "common") {
      cell.append(el("small", "ls-muted", [item.equipped ? "Equipped" : "", item.rarity !== "common" ? item.rarity : ""].filter(Boolean).join(" · ")));
    }
    grid.append(cell);
  }
  return grid;
}
function parseStatusFxValue(raw) {
  const str = String(raw ?? "").trim();
  if (!str || /^(?:none|normal|healthy|clear)$/i.test(str))
    return [];
  const out = [];
  for (const part of str.split(/\s*(?:;|,|\n|\|)\s*/).map((s) => s.trim()).filter(Boolean)) {
    let kind = "neutral";
    let label = part;
    if (label.startsWith("+")) {
      kind = "buff";
      label = label.slice(1).trim();
    } else if (label.startsWith("-")) {
      kind = "debuff";
      label = label.slice(1).trim();
    } else if (/\b(?:burn|poison|bleed|stun|curse|tired|fluster|exhaust|wound|fear)\b/i.test(label)) {
      kind = "debuff";
    } else if (/\b(?:shield|haste|bless|focus|regen|guard|inspir|armor|ward)\b/i.test(label)) {
      kind = "buff";
    }
    const durMatch = label.match(/^(.+?)\s*\(([^)]+)\)$/);
    out.push({
      name: (durMatch?.[1] ?? label).trim(),
      kind,
      ...durMatch?.[2] ? { duration: durMatch[2].trim() } : {}
    });
  }
  return out;
}
function renderStatusFxWidget(rawVal) {
  const fx = parseStatusFxValue(rawVal);
  if (!fx.length) {
    return el("small", "ls-muted", "No active effects");
  }
  const row = el("div", "ls-row");
  for (const item of fx) {
    const pill = el("span", "ls-rpg-fx-pill", `${item.kind === "buff" ? "▲" : item.kind === "debuff" ? "▼" : "●"} ${item.name}${item.duration ? ` (${item.duration})` : ""}`);
    pill.dataset.fxKind = item.kind;
    row.append(pill);
  }
  return row;
}
function renderHeartsWidget(schema, val, isCalibrated, locked, onSet) {
  const maxHearts = Math.max(1, Math.min(10, schema.max || 5));
  const normalized = schema.max > 10 ? Math.round(val / Math.max(1, schema.max) * maxHearts) : Math.max(0, Math.min(maxHearts, Math.round(val)));
  const row = el("div", "ls-row");
  for (let i = 1;i <= maxHearts; i++) {
    const filled = isCalibrated && i <= normalized;
    const b = btn(filled ? "❤️" : "\uD83E\uDD0D", () => {
      if (!locked && onSet) {
        const targetVal = schema.max > 10 ? Math.round((i === normalized ? i - 1 : i) / maxHearts * schema.max) : i === normalized ? i - 1 : i;
        onSet(targetVal);
      }
    }, "ls-btn-sm ls-btn-icon ls-rpg-heart-btn", `${schema.label}: ${i}/${maxHearts}`);
    b.disabled = locked || !onSet;
    row.append(b);
  }
  return row;
}
function renderCurrencyWidget(schema, val, delta) {
  const num = Number(val);
  const formatted = Number.isFinite(num) ? num.toLocaleString() : String(val);
  const row = el("div", "ls-rpg-currency-box");
  row.append(el("strong", "ls-rpg-currency-val", `${schema.icon} ${formatted}`));
  if (delta !== 0) {
    row.append(el("span", `ls-delta ${delta > 0 ? "is-pos" : "is-neg"}`, delta > 0 ? `+${delta.toLocaleString()}` : delta.toLocaleString()));
  }
  return row;
}

// src/frontend/surfaces/VoiceAssignmentModal.ts
function openVoiceAssignmentModal(ctrl, focusActorId) {
  ctrl.modals.open({
    title: "\uD83D\uDD0A Multi-Voice TTS Director — Cast & Narrator Voices",
    width: 680,
    maxHeight: 800
  }, (body, _close, handle, modalScope) => {
    const renderModal = async () => {
      modalScope.clear();
      body.replaceChildren(el("p", "ls-muted", "⏳ Loading Lumiverse TTS connections & voice catalogs…"));
      const conns = await ctrl.tts.listConnections();
      const settings = ctrl.settings;
      const { state } = ctrl.snapshot;
      const actors = Object.values(state.characters);
      const defaultConnId = settings?.narratorConnectionId || conns.find((c) => c.is_default)?.id || conns[0]?.id || "";
      const defaultVoices = defaultConnId ? await ctrl.tts.listVoicesForConnection(defaultConnId) : [];
      body.replaceChildren();
      const topCard = el("section", "ls-card");
      const headRow = el("div", "ls-row-between");
      headRow.append(el("div", "", ""), el("span", "ls-chip ls-chip-accent", `⚡ Cached Hits: ${ctrl.tts.cacheHitCount} (0 Tokens Re-billed)`));
      headRow.firstElementChild.append(el("span", "ls-kicker", "2-Tier Memory + IndexedDB Audio Cache"), el("h3", "", "\uD83C\uDF99️ Narrator & Reading Mode (Token Saver)"));
      topCard.append(headRow);
      const modeRow = el("div", "ls-row");
      const curReadMode = settings?.ttsReadMode || "dialogue_only";
      for (const [mId, mLbl] of [
        ["dialogue_only", "\uD83D\uDCAC Dialogue Only (Recommended — Saves ~65% TTS Tokens)"],
        ["narration_and_dialogue", "\uD83D\uDCD6 Full Audiobook (Narrator + Character Voices)"],
        ["narration_only", "\uD83D\uDCDC Narration Only"]
      ]) {
        const b = btn(mLbl, () => {
          ctrl.request("settings:update", { settings: { ttsReadMode: mId } }).then(() => {
            renderModal();
          });
        }, "ls-btn-sm");
        if (curReadMode === mId)
          b.setAttribute("aria-current", "page");
        modeRow.append(b);
      }
      topCard.append(modeRow);
      if (!conns.length) {
        topCard.append(el("p", "ls-muted", "No TTS connections found yet. Create a TTS connection in Lumiverse (Connections → TTS Connections, e.g. Kokoro, ElevenLabs, OpenAI, or Google) to enable voice synthesis."));
        body.append(topCard);
        return;
      }
      const narGrid = el("div", "ls-grid");
      const narConnWrap = el("div", "ls-label", "Narrator TTS Connection");
      const narConnSlot = el("div");
      narConnWrap.append(narConnSlot);
      const narVoiceWrap = el("label", "ls-label", "Narrator Voice ID");
      const narVoiceInp = el("input", "ls-input");
      narVoiceInp.placeholder = defaultVoices[0]?.id || "Default connection voice…";
      narVoiceInp.value = settings?.narratorVoiceId || "";
      narVoiceWrap.append(narVoiceInp);
      if (defaultVoices.length > 0) {
        const quickVoiceSlot = el("div");
        quickVoiceSlot.style.marginTop = "4px";
        narVoiceWrap.append(quickVoiceSlot);
        mountThemedSelect(ctrl, modalScope, quickVoiceSlot, {
          value: settings?.narratorVoiceId || "",
          placeholder: "— Pick from connection voices —",
          ariaLabel: "Narrator Voice Catalog",
          options: [
            { value: "", label: "— Pick from connection voices —" },
            ...defaultVoices.map((v) => ({ value: v.id, label: `${v.name} (${v.id})` }))
          ],
          onChange: (nextVoice) => {
            if (nextVoice)
              narVoiceInp.value = nextVoice;
          }
        });
      }
      mountThemedSelect(ctrl, modalScope, narConnSlot, {
        value: settings?.narratorConnectionId || "",
        ariaLabel: "Narrator TTS Connection",
        options: [
          { value: "", label: "Use Default Lumiverse TTS Connection" },
          ...conns.map((c) => ({
            value: c.id,
            label: `${c.name} (${c.provider}${c.voice ? ` · ${c.voice}` : ""})`
          }))
        ],
        onChange: (nextId) => {
          ctrl.request("settings:update", {
            settings: { narratorConnectionId: nextId }
          }).then(() => void renderModal());
        }
      });
      narGrid.append(narConnWrap, narVoiceWrap);
      topCard.append(narGrid);
      const narActionRow = el("div", "ls-row");
      narActionRow.append(btn("\uD83D\uDCBE Save Narrator Voice", () => {
        ctrl.request("settings:update", {
          settings: { narratorVoiceId: narVoiceInp.value.trim() }
        });
        ctrl.notify("Saved Narrator TTS voice.");
      }, "ls-btn-sm ls-btn-primary"), btn("▶ Test Narrator", () => {
        ctrl.tts.playSegments([
          {
            kind: "narration",
            text: `The scene unfolds in ${state.scene.location || "the story"}.`,
            speakerName: "Narrator",
            connectionId: settings?.narratorConnectionId || "",
            voiceId: narVoiceInp.value.trim(),
            speed: settings?.narratorSpeed || 1
          }
        ]);
      }, "ls-btn-sm"));
      topCard.append(narActionRow);
      body.append(topCard);
      const castCard = el("section", "ls-card");
      castCard.append(el("span", "ls-kicker", "Per-Character Voice Profiles"), el("h3", "", `\uD83D\uDC65 Cast Voices (${actors.length} Characters)`), el("p", "ls-muted", "Assign each character their own distinct voice and speed. Quoted lines spoken by that character automatically route to their voice."));
      if (!actors.length) {
        castCard.append(el("p", "ls-muted", "No characters in the cast yet."));
      } else {
        const orderedActors = focusActorId ? [
          ...actors.filter((a) => a.id === focusActorId),
          ...actors.filter((a) => a.id !== focusActorId)
        ] : actors;
        for (const actor of orderedActors) {
          const cell = el("div", "ls-stat-cell");
          if (actor.id === focusActorId) {
            cell.style.borderColor = "var(--ls-primary)";
          }
          const curVoice = actor.ttsVoice ?? {};
          const actorConnId = curVoice.connectionId || defaultConnId;
          const actorVoices = actorConnId ? await ctrl.tts.listVoicesForConnection(actorConnId) : defaultVoices;
          const top = el("div", "ls-row-between");
          top.append(el("strong", "", `${actor.present ? "\uD83D\uDFE2" : "⚪"} ${actor.name} (${actor.roleSummary || "Cast"})`), el("span", "ls-chip ls-chip-accent", curVoice.voiceId ? `\uD83D\uDD0A ${curVoice.voiceId}` : "Default Voice"));
          cell.append(top);
          const rowGrid = el("div", "ls-grid");
          const cSlot = el("div");
          const vSlot = el("div");
          const vInp = el("input", "ls-input");
          vInp.placeholder = "Voice ID (or pick below)…";
          vInp.value = curVoice.voiceId || "";
          const vCtrl = mountThemedSelect(ctrl, modalScope, vSlot, {
            value: curVoice.voiceId || "",
            ariaLabel: `Voice for ${actor.name}`,
            options: [
              { value: "", label: "— Select Voice from Catalog —" },
              ...actorVoices.map((v) => ({ value: v.id, label: `${v.name} (${v.id})` }))
            ],
            onChange: (nextVoice) => {
              if (nextVoice)
                vInp.value = nextVoice;
            }
          });
          const cCtrl = mountThemedSelect(ctrl, modalScope, cSlot, {
            value: curVoice.connectionId || "",
            ariaLabel: `TTS Connection for ${actor.name}`,
            options: [
              { value: "", label: "Default TTS Connection" },
              ...conns.map((c) => ({ value: c.id, label: `${c.name} (${c.provider})` }))
            ],
            onChange: async (nextConnId) => {
              const nextVoices = await ctrl.tts.listVoicesForConnection(nextConnId || defaultConnId);
              vCtrl.setOptions([
                { value: "", label: "— Select Voice from Catalog —" },
                ...nextVoices.map((v) => ({ value: v.id, label: `${v.name} (${v.id})` }))
              ], "");
            }
          });
          const spdInp = el("input", "ls-input");
          spdInp.type = "number";
          spdInp.min = "0.5";
          spdInp.max = "2.0";
          spdInp.step = "0.1";
          spdInp.value = String(curVoice.speed ?? 1);
          spdInp.title = "Playback Speed (0.5x – 2.0x)";
          rowGrid.append(cSlot, vInp, vSlot, spdInp);
          cell.append(rowGrid);
          const btnRow = el("div", "ls-row");
          btnRow.append(btn("\uD83D\uDCBE Save Voice", () => {
            const nextProfile = {
              connectionId: cCtrl.getValue() || undefined,
              voiceId: vInp.value.trim() || undefined,
              speed: Math.max(0.5, Math.min(2, Number(spdInp.value) || 1))
            };
            const nextChars = structuredClone(state.characters);
            if (nextChars[actor.id]) {
              nextChars[actor.id].ttsVoice = nextProfile;
              ctrl.request("state:mutate", {
                stateOverride: { characters: nextChars },
                reason: `Updated TTS voice for ${actor.name}`
              }).then(() => void renderModal());
            }
          }, "ls-btn-sm ls-btn-primary"), btn("▶ Test Voice", () => {
            const sampleLine = actor.innerThought || `Hello, I am ${actor.name}.`;
            ctrl.tts.playSegments([
              {
                kind: "dialogue",
                text: sampleLine,
                speakerName: actor.name,
                actorId: actor.id,
                connectionId: cCtrl.getValue() || undefined,
                voiceId: vInp.value.trim() || undefined,
                speed: Math.max(0.5, Math.min(2, Number(spdInp.value) || 1))
              }
            ]);
          }, "ls-btn-sm"));
          cell.append(btnRow);
          castCard.append(cell);
        }
      }
      body.append(castCard);
    };
    renderModal();
    handle.onDismiss(() => ctrl.tts.stop());
  });
}

// src/frontend/surfaces/BuiltinTrackerModals.ts
var BUILTIN_TRACKER_META = {
  player_attire: {
    title: "Player Attire / Presentation",
    defaultIcon: "\uD83D\uDC55",
    defaultLabel: "Your Current Attire / Presentation",
    toggleKey: "trackPlayerAttire",
    labelKey: "playerAttireLabel",
    instructionKey: "playerAttireInstruction",
    showCardKey: "showPlayerAttireCard",
    supportsCardDisplay: true
  },
  player_condition: {
    title: "Player Physical / Mental Condition",
    defaultIcon: "\uD83E\uDE7A",
    defaultLabel: "Physical / Mental Condition",
    toggleKey: "trackPlayerCondition",
    labelKey: "playerConditionLabel",
    instructionKey: "playerConditionInstruction",
    showCardKey: "showPlayerConditionCard",
    supportsCardDisplay: true
  },
  player_action: {
    title: "Player Latest Notable Action",
    defaultIcon: "⚡",
    defaultLabel: "Latest Notable Action",
    toggleKey: "trackPlayerAction",
    labelKey: "playerActionLabel",
    instructionKey: "playerActionInstruction",
    showCardKey: "showPlayerActionCard",
    supportsCardDisplay: true
  },
  scene_summary: {
    title: "Scene Beat Summary",
    defaultIcon: "\uD83D\uDCD6",
    defaultLabel: "Scene Beat Summary",
    toggleKey: "trackSceneSummary",
    labelKey: "sceneSummaryLabel",
    instructionKey: "sceneSummaryInstruction",
    showCardKey: "showSceneSummaryInWidget",
    supportsCardDisplay: true
  },
  places: {
    title: "Spatial Atlas (Places, Zones & Paths)",
    defaultIcon: "\uD83D\uDDFA️",
    defaultLabel: "Spatial Atlas & Locations",
    toggleKey: "trackPlaces",
    instructionKey: "placesInstruction",
    supportsCardDisplay: false
  },
  quests: {
    title: "Quests & Objectives",
    defaultIcon: "\uD83C\uDFAF",
    defaultLabel: "Quests & Objectives",
    toggleKey: "trackQuests",
    instructionKey: "questsInstruction",
    showCardKey: "showQuestsInWidget",
    supportsCardDisplay: false
  },
  dispatches: {
    title: "Off-Screen Dispatches",
    defaultIcon: "\uD83D\uDCE1",
    defaultLabel: "Off-Screen Dispatches",
    toggleKey: "trackDispatches",
    instructionKey: "dispatchesInstruction",
    showCardKey: "showDispatchesInWidget",
    supportsCardDisplay: false
  },
  npc_conditions: {
    title: "NPC Conditions & Status Tags",
    defaultIcon: "⚡",
    defaultLabel: "NPC Conditions",
    toggleKey: "trackNpcConditions",
    instructionKey: "npcConditionsInstruction",
    supportsCardDisplay: false
  },
  npc_secrets: {
    title: "NPC Secrets & Clues",
    defaultIcon: "\uD83D\uDD75️",
    defaultLabel: "NPC Secrets & Clues",
    toggleKey: "trackNpcSecrets",
    instructionKey: "npcSecretsInstruction",
    supportsCardDisplay: false
  }
};
function resolveBuiltInTrackerConfig(core, id) {
  const defaults = defaultCoreTrackersConfig();
  const merged = { ...defaults, ...core ?? {} };
  const meta = BUILTIN_TRACKER_META[id];
  const ov = merged.overrides?.[id] ?? {};
  const enabled = merged[meta.toggleKey] !== false;
  const showCard = meta.showCardKey ? merged[meta.showCardKey] !== false : true;
  const label = ov.label || (meta.labelKey ? String(merged[meta.labelKey] ?? "") : "") || meta.defaultLabel;
  const instruction = ov.instruction ?? String(merged[meta.instructionKey] ?? defaults[meta.instructionKey] ?? "");
  return {
    enabled,
    showCard,
    icon: ov.icon || meta.defaultIcon,
    label,
    instruction,
    color: ov.color || "var(--lumiverse-primary)",
    displayStyle: ov.displayStyle ?? "auto",
    layoutSpan: ov.layoutSpan ?? "full",
    widgetTabId: ov.widgetTabId ?? (id === "quests" || id === "dispatches" ? "world" : "stats"),
    inlineTabId: ov.inlineTabId ?? (id === "quests" || id === "dispatches" ? "world" : "stats"),
    pinnedToHeader: Boolean(ov.pinnedToHeader),
    locked: Boolean(ov.locked),
    deleted: Boolean(ov.deleted)
  };
}
function openScenePillEditorModal(ctrl) {
  const tpl = structuredClone(ctrl.snapshot.template);
  const defaults = defaultCoreTrackersConfig();
  const core = {
    ...defaults,
    ...tpl.coreTrackers ?? {}
  };
  ctrl.modals.open({ title: "\uD83D\uDCCD Customize Scene Pill & AI Prompt Rules (Date, Time, Location, Weather)", width: 640, maxHeight: 820 }, (body, close, _handle, modalScope) => {
    const chips = { ...tpl.theme.showSceneChips };
    let locked = Boolean(core.scenePillLocked);
    const chipCard = el("section", "ls-card");
    chipCard.append(el("span", "ls-kicker", "Visible Pill Chips & Lock"), el("p", "ls-muted", "Choose which scene tokens appear in the Scene Pill & Header, or lock the pill so AI turns never alter the clock/location."));
    const chipGrid = el("div", "ls-grid");
    for (const [key, lbl] of [
      ["location", "\uD83D\uDCCD Location"],
      ["time", "\uD83D\uDD70️ Clock Time"],
      ["date", "\uD83D\uDCC5 Date / Era"],
      ["weather", "\uD83C\uDF26️ Weather"],
      ["cast", "\uD83D\uDC64 Present Cast"],
      ["pinnedStats", "\uD83D\uDCCC Pinned Stats"]
    ]) {
      const row = el("div", "ls-row-between ls-stat-cell");
      row.append(el("span", "", lbl));
      const swSlot = el("div");
      row.append(swSlot);
      mountNativeSwitch(ctrl, modalScope, swSlot, {
        checked: Boolean(chips[key]),
        ariaLabel: lbl,
        onChange: (v) => {
          chips[key] = v;
        }
      });
      chipGrid.append(row);
    }
    const lockRow = el("div", "ls-row-between ls-stat-cell");
    lockRow.append(el("span", "", "\uD83D\uDD12 Lock Scene Pill (Prevent AI from changing Date/Time/Location/Weather)"));
    const lockSlot = el("div");
    lockRow.append(lockSlot);
    mountNativeSwitch(ctrl, modalScope, lockSlot, {
      checked: locked,
      ariaLabel: "Lock Scene Pill",
      onChange: (v) => {
        locked = v;
      }
    });
    chipCard.append(chipGrid, lockRow);
    body.append(chipCard);
    const promptHost = el("div");
    body.append(promptHost);
    const promptBody = mountNativeCollapsible(ctrl, modalScope, promptHost, {
      title: "AI Extraction Prompts for Pill Fields (Location, Time, Date, Weather)",
      iconName: "sliders",
      defaultExpanded: true
    });
    const makePromptField = (label, val, placeholder) => {
      const wrap = el("div", "ls-label");
      const head = el("div", "ls-row-between");
      const area = el("textarea", "ls-input");
      area.rows = 2;
      area.value = val;
      area.placeholder = placeholder;
      head.append(el("span", "", label), btn("⛶ Full-Screen", () => {
        ctrl.request("textEditor:open", {
          title: `Scene Pill Prompt: ${label}`,
          value: area.value,
          placeholder
        }).then((res) => {
          if (!res.cancelled && typeof res.text === "string") {
            area.value = res.text;
          }
        });
      }, "ls-btn-sm"));
      wrap.append(head, area);
      promptBody.append(wrap);
      return area;
    };
    const locArea = makePromptField("\uD83D\uDCCD Location Prompt Rule", core.sceneLocationInstruction ?? defaults.sceneLocationInstruction ?? "", 'e.g. Format as "Room, Building" or "Landmark, District".');
    const timeArea = makePromptField("\uD83D\uDD70️ Time Prompt Rule", core.sceneTimeInstruction ?? defaults.sceneTimeInstruction ?? "", 'e.g. Use 24-hour military clock, or narrative time like "Late Evening".');
    const dateArea = makePromptField("\uD83D\uDCC5 Date / Era Prompt Rule", core.sceneDateInstruction ?? defaults.sceneDateInstruction ?? "", 'e.g. Format as "Year 412, Frostfall 14" or "Oct 14, 2002".');
    const weatherArea = makePromptField("\uD83C\uDF26️ Weather & Atmosphere Prompt Rule", core.sceneWeatherInstruction ?? defaults.sceneWeatherInstruction ?? "", 'e.g. Keep to 2–4 vivid words like "Neon Drizzle" or "Warm Indoor Steam".');
    const flowArea = makePromptField('⏱️ Time Progression ("mins") Prompt Rule', core.sceneTimeFlowInstruction ?? defaults.sceneTimeFlowInstruction ?? "", "e.g. Estimate realistic elapsed minutes per turn.");
    const footer = el("div", "ls-row-between");
    footer.style.marginTop = "12px";
    footer.append(btn("↺ Reset Default Prompts", () => {
      locArea.value = defaults.sceneLocationInstruction ?? "";
      timeArea.value = defaults.sceneTimeInstruction ?? "";
      dateArea.value = defaults.sceneDateInstruction ?? "";
      weatherArea.value = defaults.sceneWeatherInstruction ?? "";
      flowArea.value = defaults.sceneTimeFlowInstruction ?? "";
    }, "ls-btn-sm"), btn("\uD83D\uDCBE Save Scene Pill Config", () => {
      const liveTpl = structuredClone(ctrl.snapshot.template);
      const liveCore = {
        ...defaults,
        ...liveTpl.coreTrackers ?? {}
      };
      ctrl.request("state:mutate", {
        templatePatch: {
          theme: { ...liveTpl.theme, showSceneChips: chips },
          coreTrackers: {
            ...liveCore,
            scenePillLocked: locked,
            sceneLocationInstruction: locArea.value.trim(),
            sceneTimeInstruction: timeArea.value.trim(),
            sceneDateInstruction: dateArea.value.trim(),
            sceneWeatherInstruction: weatherArea.value.trim(),
            sceneTimeFlowInstruction: flowArea.value.trim()
          }
        },
        reason: "Updated Scene Pill prompt rules & visibility"
      });
      ctrl.notify("Saved Scene Pill prompt rules.");
      close();
    }, "ls-btn-primary"));
    body.append(footer);
  });
}
function openBuiltinTrackerModal(ctrl, id) {
  const tpl = structuredClone(ctrl.snapshot.template);
  const defaults = defaultCoreTrackersConfig();
  const core = {
    ...defaults,
    ...tpl.coreTrackers ?? {},
    overrides: { ...tpl.coreTrackers?.overrides ?? {} }
  };
  const meta = BUILTIN_TRACKER_META[id];
  const resolved = resolveBuiltInTrackerConfig(core, id);
  ctrl.modals.open({ title: `✏️ Full Edit Built-In Tracker: ${meta.title}`, width: 640, maxHeight: 820 }, (body, close, _handle, modalScope) => {
    let enabled = resolved.enabled;
    let showCard = resolved.showCard;
    let locked = Boolean(resolved.locked);
    let selectedStyle = resolved.displayStyle ?? "auto";
    let selectedSpan = resolved.layoutSpan ?? "full";
    let selectedColor = resolved.color || "var(--lumiverse-primary)";
    let selectedWTab = resolved.widgetTabId || "stats";
    let selectedITab = resolved.inlineTabId || "stats";
    const topGrid = el("div", "ls-grid");
    const iconWrap = el("label", "ls-label", "Icon");
    const iconInp = el("input", "ls-input");
    iconInp.value = resolved.icon || meta.defaultIcon;
    iconWrap.append(iconInp);
    const labelWrap = el("label", "ls-label", "Display Label");
    const labelInp = el("input", "ls-input");
    labelInp.value = resolved.label || meta.defaultLabel;
    labelWrap.append(labelInp);
    topGrid.append(iconWrap, labelWrap);
    body.append(topGrid);
    const switchGrid = el("div", "ls-grid");
    const enRow = el("div", "ls-row-between ls-stat-cell");
    enRow.append(el("span", "", "✓ Track in AI Prompts"));
    const enSlot = el("div");
    enRow.append(enSlot);
    mountNativeSwitch(ctrl, modalScope, enSlot, {
      checked: enabled,
      onChange: (v) => {
        enabled = v;
      }
    });
    switchGrid.append(enRow);
    if (meta.supportsCardDisplay) {
      const cardRow = el("div", "ls-row-between ls-stat-cell");
      cardRow.append(el("span", "", "\uD83E\uDE9F Show Card in Widget / Inline"));
      const cardSlot = el("div");
      cardRow.append(cardSlot);
      mountNativeSwitch(ctrl, modalScope, cardSlot, {
        checked: showCard,
        onChange: (v) => {
          showCard = v;
        }
      });
      switchGrid.append(cardRow);
    }
    const lockRow = el("div", "ls-row-between ls-stat-cell");
    lockRow.append(el("span", "", "\uD83D\uDD12 Lock Value (Skip AI Updates)"));
    const lockSlot = el("div");
    lockRow.append(lockSlot);
    mountNativeSwitch(ctrl, modalScope, lockSlot, {
      checked: locked,
      onChange: (v) => {
        locked = v;
      }
    });
    switchGrid.append(lockRow);
    body.append(switchGrid);
    const styleHost = el("div");
    body.append(styleHost);
    const styleBody = mountNativeCollapsible(ctrl, modalScope, styleHost, {
      title: "Display Style, Color & Tab Routing",
      iconName: "palette",
      defaultExpanded: true
    });
    const styleGrid = el("div", "ls-grid");
    const sWrap = el("div", "ls-label", "Visual Display Style");
    const sSlot = el("div");
    sWrap.append(sSlot);
    mountThemedSelect(ctrl, modalScope, sSlot, {
      value: selectedStyle,
      ariaLabel: "Visual Display Style",
      options: [
        { value: "auto", label: "✨ Smart Auto-Detect" },
        { value: "arc_tracker", label: "\uD83C\uDFAF Multi-Thread / Arc / Quest Cards" },
        { value: "accordion_cards", label: "\uD83D\uDDC2️ Collapsible Multi-Entry Cards" },
        { value: "matrix_badges", label: "⚖️ Split / Versus Comparison (Knows vs Blind)" },
        { value: "meter_mini_bars", label: "\uD83D\uDCCA Multi-Bar Mini Gauges (HP/MP cur/max)" },
        { value: "stat_pills_grid", label: "\uD83E\uDDEC Compact Stat Badges (Lv / P A I / POW)" },
        { value: "bullet_ledger", label: "\uD83D\uDCB0 Aligned Bullet & Currency Ledger" },
        { value: "timeline_list", label: "\uD83D\uDCDC Vertical Event Timeline" },
        { value: "checklist", label: "☑️ Visual Objectives Checklist" },
        { value: "feed_cards", label: "\uD83C\uDCCF Structured Flow Cards" },
        { value: "step_chain", label: "⛓️ Horizontal Step Chain" },
        { value: "key_value", label: "\uD83D\uDCCB Key–Value Table" },
        { value: "pill_list", label: "\uD83C\uDFF7️ Tag / Pill List" },
        { value: "quote_callout", label: "\uD83D\uDCAD Quote Callout Box" }
      ],
      onChange: (v) => {
        selectedStyle = v;
      }
    });
    const spanWrap = el("div", "ls-label", "Card Grid Width");
    const spanSlot = el("div");
    spanWrap.append(spanSlot);
    mountThemedSelect(ctrl, modalScope, spanSlot, {
      value: selectedSpan,
      ariaLabel: "Card Grid Width",
      options: [
        { value: "full", label: "↔️ Full Width" },
        { value: "auto", label: "\uD83D\uDCD0 Auto" },
        { value: "half", label: "▫ Compact Column" }
      ],
      onChange: (v) => {
        selectedSpan = v;
      }
    });
    styleGrid.append(sWrap, spanWrap);
    styleBody.append(styleGrid);
    if (meta.supportsCardDisplay) {
      const tabGrid = el("div", "ls-grid");
      const wWrap = el("div", "ls-label", "Widget Tab");
      const wSlot = el("div");
      wWrap.append(wSlot);
      mountThemedSelect(ctrl, modalScope, wSlot, {
        value: selectedWTab,
        ariaLabel: "Widget Tab",
        options: tpl.surfaces.widgetTabs.map((t) => ({ value: t.id, label: `${t.icon} ${t.label}` })),
        onChange: (v) => {
          selectedWTab = v;
        }
      });
      const iWrap = el("div", "ls-label", "Inline Ribbon Tab");
      const iSlot = el("div");
      iWrap.append(iSlot);
      mountThemedSelect(ctrl, modalScope, iSlot, {
        value: selectedITab,
        ariaLabel: "Inline Ribbon Tab",
        options: tpl.surfaces.inlineTabs.map((t) => ({ value: t.id, label: `${t.icon} ${t.label}` })),
        onChange: (v) => {
          selectedITab = v;
        }
      });
      tabGrid.append(wWrap, iWrap);
      styleBody.append(tabGrid);
    }
    const colorWrap = el("div", "ls-label", "Accent Color");
    const colorRow = el("div", "ls-row");
    const syncSwatches = () => {
      for (const b of [...colorRow.querySelectorAll(".ls-color-swatch")]) {
        b.setAttribute("aria-pressed", String(b.dataset.colorVal === selectedColor));
      }
    };
    for (const [val, lbl, preview] of [
      ["var(--lumiverse-primary)", "Theme Primary", "var(--lumiverse-primary, #38bdf8)"],
      ["#38bdf8", "Sky", "#38bdf8"],
      ["#f472b6", "Rose", "#f472b6"],
      ["#f59e0b", "Amber", "#f59e0b"],
      ["#10b981", "Emerald", "#10b981"],
      ["#a78bfa", "Violet", "#a78bfa"],
      ["#f43f5e", "Crimson", "#f43f5e"]
    ]) {
      const b = btn("", () => {
        selectedColor = val;
        syncSwatches();
      }, "ls-color-swatch", lbl);
      b.dataset.colorVal = val;
      b.style.background = preview;
      colorRow.append(b);
    }
    syncSwatches();
    colorWrap.append(colorRow);
    styleBody.append(colorWrap);
    const promptHost = el("div");
    body.append(promptHost);
    const promptBody = mountNativeCollapsible(ctrl, modalScope, promptHost, {
      title: "AI Extraction Prompt Rule",
      iconName: "sparkles",
      defaultExpanded: true
    });
    const promptHead = el("div", "ls-row-between");
    const promptArea = el("textarea", "ls-input");
    promptArea.rows = 3;
    promptArea.value = resolved.instruction ?? "";
    promptArea.placeholder = "Tell the AI exactly how and when to extract or format this tracker…";
    promptHead.append(el("span", "ls-muted", "Prompt instruction sent to the AI extractor:"), btn("⛶ Full-Screen Editor", () => {
      ctrl.request("textEditor:open", {
        title: `Built-In Prompt: ${labelInp.value || meta.title}`,
        value: promptArea.value,
        placeholder: "Describe formatting, triggers, and when the AI should update this built-in tracker…"
      }).then((res) => {
        if (!res.cancelled && typeof res.text === "string") {
          promptArea.value = res.text;
        }
      });
    }, "ls-btn-sm"));
    promptBody.append(promptHead, promptArea);
    const footer = el("div", "ls-row-between");
    footer.style.marginTop = "12px";
    const leftBtns = el("div", "ls-row");
    leftBtns.append(btn("↺ Reset Default", () => {
      iconInp.value = meta.defaultIcon;
      labelInp.value = meta.defaultLabel;
      promptArea.value = String(defaults[meta.instructionKey] ?? "");
      selectedColor = "var(--lumiverse-primary)";
      selectedStyle = "auto";
      selectedSpan = "full";
      syncSwatches();
    }, "ls-btn-sm"), btn("\uD83D\uDDD1️ Delete Built-In", async () => {
      const ok = await ctrl.modals.confirm({
        title: `Remove "${meta.defaultLabel}"?`,
        message: `Disable and remove "${meta.defaultLabel}" from active tracking and Studio? (You can restore deleted built-ins anytime from Studio.)`,
        confirmLabel: "Delete",
        variant: "danger"
      });
      if (!ok)
        return;
      const liveTpl = structuredClone(ctrl.snapshot.template);
      const liveCore = {
        ...defaults,
        ...liveTpl.coreTrackers ?? {},
        overrides: { ...liveTpl.coreTrackers?.overrides ?? {} }
      };
      const nextCore = {
        ...liveCore,
        [meta.toggleKey]: false,
        ...meta.showCardKey ? { [meta.showCardKey]: false } : {},
        overrides: {
          ...liveCore.overrides ?? {},
          [id]: {
            ...liveCore.overrides?.[id] ?? {},
            deleted: true
          }
        }
      };
      ctrl.request("state:mutate", {
        templatePatch: { coreTrackers: nextCore },
        reason: `Deleted built-in tracker "${meta.defaultLabel}"`
      });
      ctrl.notify(`Removed "${meta.defaultLabel}".`);
      close();
    }, "ls-btn-sm ls-btn-danger"));
    footer.append(leftBtns, btn("\uD83D\uDCBE Save Built-In Tracker", () => {
      const nextLabel = labelInp.value.trim() || meta.defaultLabel;
      const nextInst = promptArea.value.trim();
      const liveTpl = structuredClone(ctrl.snapshot.template);
      const liveCore = {
        ...defaults,
        ...liveTpl.coreTrackers ?? {},
        overrides: { ...liveTpl.coreTrackers?.overrides ?? {} }
      };
      const nextCore = {
        ...liveCore,
        [meta.toggleKey]: enabled,
        ...meta.labelKey ? { [meta.labelKey]: nextLabel } : {},
        [meta.instructionKey]: nextInst,
        ...meta.showCardKey ? { [meta.showCardKey]: showCard } : {},
        overrides: {
          ...liveCore.overrides ?? {},
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
            deleted: false
          }
        }
      };
      ctrl.request("state:mutate", {
        templatePatch: { coreTrackers: nextCore },
        reason: `Customized built-in tracker "${nextLabel}"`
      });
      ctrl.notify(`Saved "${nextLabel}".`);
      close();
    }, "ls-btn-primary"));
    body.append(footer);
  });
}

// src/shared/map-graph.ts
var DEFAULT_ZONE = {
  id: "zone_local",
  name: "Local Area",
  kind: "building",
  icon: "\uD83D\uDDFA️",
  color: "#38bdf8",
  description: ""
};
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
function buildSpatialMapLayout(state, selectedPlaceId, focusZoneId) {
  const allPlaces = Object.values(state.places);
  if (!allPlaces.length)
    return { zones: [], nodes: [], edges: [] };
  const curId = state.currentPlaceId || allPlaces[0].id;
  const resolvedZones = { ...state.mapZones ?? {} };
  const getZoneForPlace = (p) => {
    const zid = p.zoneId || DEFAULT_ZONE.id;
    if (resolvedZones[zid])
      return resolvedZones[zid];
    if (zid === DEFAULT_ZONE.id) {
      resolvedZones[zid] = {
        ...DEFAULT_ZONE,
        name: state.title && state.title !== "Uncharted Story" ? state.title : "Local Area"
      };
      return resolvedZones[zid];
    }
    resolvedZones[zid] = {
      id: zid,
      name: zid.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      kind: p.category === "region" ? "region" : "building",
      icon: p.category === "region" ? "\uD83C\uDFD4️" : "\uD83C\uDFDB️",
      color: "#38bdf8",
      description: ""
    };
    return resolvedZones[zid];
  };
  const filteredPlaces = (focusZoneId ? allPlaces.filter((p) => (p.zoneId || DEFAULT_ZONE.id) === focusZoneId) : allPlaces).slice(0, 18);
  const byZone = new Map;
  for (const p of filteredPlaces) {
    const z = getZoneForPlace(p);
    let bucket = byZone.get(z.id);
    if (!bucket) {
      bucket = { zone: z, places: [] };
      byZone.set(z.id, bucket);
    }
    bucket.places.push(p);
  }
  const zoneBuckets = [...byZone.values()];
  const zoneCount = zoneBuckets.length;
  const canvasW = 1000;
  const canvasH = 580;
  const pad = 22;
  const cols = zoneCount <= 1 ? 1 : zoneCount <= 4 ? 2 : 3;
  const rows = Math.ceil(zoneCount / cols);
  const gap = 22;
  const boxW = Math.floor((canvasW - pad * 2 - gap * (cols - 1)) / cols);
  const boxH = Math.floor((canvasH - pad * 2 - gap * (rows - 1)) / rows);
  const route = selectedPlaceId && selectedPlaceId !== curId ? findShortestTravelRoute(state, selectedPlaceId) : null;
  const routeSet = new Set(route?.pathIds ?? []);
  const activeQuests = Object.values(state.quests).filter((q) => q.status === "active");
  const zones = [];
  const nodes = [];
  zoneBuckets.forEach((bucket, zIdx) => {
    const col = zIdx % cols;
    const row = Math.floor(zIdx / cols);
    const zx = pad + col * (boxW + gap);
    const zy = pad + row * (boxH + gap);
    zones.push({
      zone: bucket.zone,
      x: zx,
      y: zy,
      w: boxW,
      h: boxH,
      placeIds: bucket.places.map((p) => p.id),
      containsCurrent: bucket.places.some((p) => p.id === curId)
    });
    const pCount = bucket.places.length;
    const innerTop = zy + 46;
    const innerH = Math.max(80, boxH - 58);
    const innerLeft = zx + 18;
    const innerW = Math.max(120, boxW - 36);
    const pCols = pCount === 1 ? 1 : pCount <= 4 ? 2 : 3;
    const pRows = Math.ceil(pCount / pCols);
    bucket.places.forEach((place, pIdx) => {
      const pc = pIdx % pCols;
      const pr = Math.floor(pIdx / pCols);
      const cellW = innerW / pCols;
      const cellH = innerH / pRows;
      const x = Math.round(innerLeft + cellW * (pc + 0.5));
      const y = Math.round(innerTop + cellH * (pr + 0.5));
      const actorsHere = Object.values(state.characters).filter((c) => c.present ? place.id === curId : c.locationId === place.id).map((c) => ({ id: c.id, name: c.name, portraitUrl: c.portraitUrl }));
      const activeQuestCount = activeQuests.filter((q) => `${q.title} ${q.summary}`.toLowerCase().includes(place.name.toLowerCase())).length;
      nodes.push({
        place,
        zoneId: bucket.zone.id,
        zoneName: bucket.zone.name,
        x,
        y,
        isCurrent: place.id === curId,
        isOnRoute: routeSet.has(place.id),
        actorsHere,
        activeQuestCount
      });
    });
  });
  const nodeById = new Map(nodes.map((n) => [n.place.id, n]));
  const edges = [];
  for (const rawEdge of resolveMapPathEdges(state)) {
    const a = nodeById.get(rawEdge.fromId);
    const b = nodeById.get(rawEdge.toId);
    if (!a || !b)
      continue;
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.max(1, Math.hypot(dx, dy));
    const isCrossZone = a.zoneId !== b.zoneId;
    const curve = isCrossZone ? 26 : 10;
    const cx = Math.round(mx + -dy / len * curve);
    const cy = Math.round(my + dx / len * curve);
    let onRoute = false;
    if (route && route.pathIds.length > 1) {
      for (let i = 0;i < route.pathIds.length - 1; i++) {
        const u = route.pathIds[i];
        const v = route.pathIds[i + 1];
        if (u === a.place.id && v === b.place.id || u === b.place.id && v === a.place.id) {
          onRoute = true;
          break;
        }
      }
    }
    edges.push({
      id: rawEdge.id,
      fromId: a.place.id,
      toId: b.place.id,
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
      cx,
      cy,
      pathType: rawEdge.pathType,
      label: rawEdge.label,
      travelMinutes: rawEdge.travelMinutes,
      locked: Boolean(rawEdge.locked),
      isOnRoute: onRoute,
      isCrossZone
    });
  }
  return { zones, nodes, edges };
}
function buildZoneHubLayout(state, selectedPlaceId) {
  const allPlaces = Object.values(state.places);
  if (!allPlaces.length)
    return { hubs: [], edges: [] };
  const curId = state.currentPlaceId || allPlaces[0].id;
  const resolvedZones = { ...state.mapZones ?? {} };
  const getZoneForPlace = (p) => {
    const zid = p.zoneId || DEFAULT_ZONE.id;
    if (resolvedZones[zid])
      return resolvedZones[zid];
    if (zid === DEFAULT_ZONE.id) {
      resolvedZones[zid] = {
        ...DEFAULT_ZONE,
        name: state.title && state.title !== "Uncharted Story" ? state.title : "Local Area"
      };
      return resolvedZones[zid];
    }
    resolvedZones[zid] = {
      id: zid,
      name: zid.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      kind: p.category === "region" ? "region" : "building",
      icon: p.category === "region" ? "\uD83C\uDFD4️" : "\uD83C\uDFDB️",
      color: "#38bdf8",
      description: ""
    };
    return resolvedZones[zid];
  };
  const buckets = new Map;
  for (const p of allPlaces) {
    const z = getZoneForPlace(p);
    let b = buckets.get(z.id);
    if (!b) {
      b = { zone: z, places: [] };
      buckets.set(z.id, b);
    }
    b.places.push(p);
  }
  const bucketList = [...buckets.values()];
  const count = bucketList.length;
  const route = selectedPlaceId && selectedPlaceId !== curId ? findShortestTravelRoute(state, selectedPlaceId) : null;
  const routePlaceSet = new Set(route?.pathIds ?? []);
  const activeQuests = Object.values(state.quests).filter((q) => q.status === "active");
  const coordsForIndex = (idx, total) => {
    if (total === 1)
      return { x: 500, y: 180 };
    if (total === 2)
      return { x: idx === 0 ? 270 : 730, y: 180 };
    if (total === 3) {
      const pts = [
        { x: 230, y: 118 },
        { x: 770, y: 118 },
        { x: 500, y: 252 }
      ];
      return pts[idx];
    }
    const cols = Math.min(3, Math.ceil(total / 2));
    const rows = Math.ceil(total / cols);
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const xStep = cols > 1 ? 620 / (cols - 1) : 0;
    const yStep = rows > 1 ? 150 / (rows - 1) : 0;
    const stagger = row % 2 === 1 && cols > 1 ? 35 : 0;
    return {
      x: Math.round(190 + col * xStep + stagger),
      y: Math.round(105 + row * yStep)
    };
  };
  const hubs = bucketList.map((bucket, idx) => {
    const pos = coordsForIndex(idx, count);
    const placeIds = bucket.places.map((p) => p.id);
    const placeIdSet = new Set(placeIds);
    const containsCurrent = placeIdSet.has(curId);
    const isOnRoute = placeIds.some((pid) => routePlaceSet.has(pid));
    const actorsHere = Object.values(state.characters).filter((c) => c.present ? containsCurrent : placeIdSet.has(c.locationId)).map((c) => ({ id: c.id, name: c.name, portraitUrl: c.portraitUrl }));
    const activeQuestCount = activeQuests.filter((q) => bucket.places.some((p) => `${q.title} ${q.summary}`.toLowerCase().includes(p.name.toLowerCase()))).length;
    const backdropUrl = bucket.places.find((p) => p.id === curId && p.backdropUrl)?.backdropUrl ?? bucket.places.find((p) => p.backdropUrl)?.backdropUrl;
    let minTravelMinutes = 0;
    if (!containsCurrent) {
      let best = Infinity;
      for (const p of bucket.places) {
        const r = findShortestTravelRoute(state, p.id);
        if (r && r.totalMinutes < best)
          best = r.totalMinutes;
      }
      minTravelMinutes = Number.isFinite(best) ? best : bucket.places[0]?.travelMinutes ?? 5;
    }
    return {
      zone: bucket.zone,
      x: pos.x,
      y: pos.y,
      placeIds,
      containsCurrent,
      isOnRoute,
      ...backdropUrl ? { backdropUrl } : {},
      actorsHere,
      activeQuestCount,
      minTravelMinutes
    };
  });
  const hubByZoneId = new Map(hubs.map((h) => [h.zone.id, h]));
  const placeToZoneId = new Map;
  for (const h of hubs) {
    for (const pid of h.placeIds)
      placeToZoneId.set(pid, h.zone.id);
  }
  const edgeMap = new Map;
  for (const rawEdge of resolveMapPathEdges(state)) {
    const zA = placeToZoneId.get(rawEdge.fromId);
    const zB = placeToZoneId.get(rawEdge.toId);
    if (!zA || !zB || zA === zB)
      continue;
    const [u, v] = [zA, zB].sort();
    const key = `${u}__${v}`;
    const hubA = hubByZoneId.get(u);
    const hubB = hubByZoneId.get(v);
    if (!hubA || !hubB)
      continue;
    const isRouteEdge = routePlaceSet.has(rawEdge.fromId) && routePlaceSet.has(rawEdge.toId);
    const existing = edgeMap.get(key);
    if (existing) {
      existing.travelMinutes = Math.min(existing.travelMinutes, rawEdge.travelMinutes);
      existing.locked = existing.locked && Boolean(rawEdge.locked);
      existing.isOnRoute = existing.isOnRoute || isRouteEdge;
      continue;
    }
    const mx = (hubA.x + hubB.x) / 2;
    const my = (hubA.y + hubB.y) / 2;
    const dx = hubB.x - hubA.x;
    const dy = hubB.y - hubA.y;
    const len = Math.max(1, Math.hypot(dx, dy));
    const cx = Math.round(mx + -dy / len * 24);
    const cy = Math.round(my + dx / len * 24);
    edgeMap.set(key, {
      id: key,
      fromZoneId: u,
      toZoneId: v,
      x1: hubA.x,
      y1: hubA.y,
      x2: hubB.x,
      y2: hubB.y,
      cx,
      cy,
      pathType: rawEdge.pathType,
      travelMinutes: rawEdge.travelMinutes,
      locked: Boolean(rawEdge.locked),
      isOnRoute: isRouteEdge
    });
  }
  return { hubs, edges: [...edgeMap.values()] };
}

// src/frontend/surfaces/SpatialMap.ts
var focusedZoneId = "";
var showOverviewMode = true;
var PATH_ICON = {
  door: "\uD83D\uDEAA",
  hallway: "\uD83D\uDEB6",
  stairs: "\uD83E\uDE9C",
  street: "\uD83D\uDEE3️",
  trail: "\uD83C\uDF3F",
  transit: "\uD83D\uDE87",
  portal: "✨"
};
function renderAvatarBadges(actors, maxShown = 3) {
  const row = el("div", "ls-mz-node-avatars");
  for (const actor of actors.slice(0, maxShown)) {
    const av = el("span", "ls-mz-mini-av");
    av.title = actor.name;
    if (actor.portraitUrl) {
      const img = el("img");
      img.src = actor.portraitUrl;
      img.alt = actor.name;
      av.append(img);
    } else {
      av.textContent = actor.name.slice(0, 1).toUpperCase();
    }
    row.append(av);
  }
  if (actors.length > maxShown) {
    row.append(el("small", "ls-muted", `+${actors.length - maxShown}`));
  }
  return row;
}
function renderSpatialMapSurface(ctrl) {
  const { state } = ctrl.snapshot;
  const wrap = el("div", "ls-stack");
  const places = Object.values(state.places);
  const zonesMap = state.mapZones ?? {};
  const allEdges = resolveMapPathEdges(state);
  if (focusedZoneId && !places.some((p) => (p.zoneId || "zone_local") === focusedZoneId)) {
    focusedZoneId = "";
  }
  const topRow = el("div", "ls-row-between");
  const curId = state.currentPlaceId || places[0]?.id || "";
  const inspectedId = ctrl.selectedPlaceId && state.places[ctrl.selectedPlaceId] ? ctrl.selectedPlaceId : curId;
  const hubLayout = buildZoneHubLayout(state, inspectedId);
  const hasMultipleZones = hubLayout.hubs.length > 1;
  const effectiveZoneId = focusedZoneId || (!showOverviewMode || !hasMultipleZones ? hubLayout.hubs[0]?.zone.id ?? "" : "");
  const breadcrumbRow = el("div", "ls-row ls-vn-breadcrumb");
  const allBtn = btn(`\uD83C\uDF0D All Zones (${hubLayout.hubs.length})`, () => {
    focusedZoneId = "";
    showOverviewMode = true;
    ctrl.emitChange();
  }, "ls-btn-sm");
  if (!effectiveZoneId)
    allBtn.setAttribute("aria-current", "page");
  breadcrumbRow.append(allBtn);
  if (hasMultipleZones) {
    for (const hub of hubLayout.hubs) {
      const zb = btn(`${hub.zone.icon} ${hub.zone.name} (${hub.placeIds.length})`, () => {
        focusedZoneId = hub.zone.id;
        showOverviewMode = false;
        ctrl.emitChange();
      }, "ls-btn-sm");
      if (effectiveZoneId === hub.zone.id)
        zb.setAttribute("aria-current", "page");
      breadcrumbRow.append(zb);
    }
  } else if (hubLayout.hubs[0]) {
    const onlyHub = hubLayout.hubs[0];
    breadcrumbRow.append(el("span", "ls-chip ls-chip-accent", `${onlyHub.zone.icon} ${onlyHub.zone.name}`));
  }
  const rightControls = el("div", "ls-row");
  rightControls.append(btn("+ Zone", () => {
    ctrl.modals.open({ title: "Create Map Zone / Building / District", width: 460 }, (body, close, _handle, modalScope) => {
      const nameWrap = el("label", "ls-label", "Zone Name");
      const nameInp = el("input", "ls-input");
      nameInp.placeholder = "e.g. Sakura Manor, Downtown, Orbital Deck B…";
      nameWrap.append(nameInp);
      let selectedZoneKind = "building";
      const kindWrap = el("div", "ls-label", "Zone Type");
      const kindSlot = el("div");
      kindWrap.append(kindSlot);
      mountThemedSelect(ctrl, modalScope, kindSlot, {
        value: selectedZoneKind,
        ariaLabel: "Zone Type",
        options: [
          { value: "building", label: "\uD83C\uDFDB️ Building / Interior" },
          { value: "district", label: "\uD83C\uDF06 City District" },
          { value: "region", label: "\uD83C\uDFD4️ Wilderness / Region" },
          { value: "ship_deck", label: "\uD83D\uDE80 Ship / Station Deck" },
          { value: "realm", label: "✨ Realm / Dimension" }
        ],
        onChange: (v) => {
          selectedZoneKind = v;
        }
      });
      const iconWrap = el("label", "ls-label", "Icon");
      const iconInp = el("input", "ls-input");
      iconInp.value = "\uD83C\uDFDB️";
      iconWrap.append(iconInp);
      const saveBtn = btn("Create Zone", () => {
        const name = nameInp.value.trim();
        if (!name)
          return;
        ctrl.request("state:mutate", {
          patch: {
            zones: [
              {
                id: slugifyKey(name, "zone"),
                name,
                kind: selectedZoneKind,
                icon: iconInp.value.trim() || "\uD83C\uDFDB️"
              }
            ]
          },
          reason: `Created zone "${name}"`
        });
        close();
      }, "ls-btn-primary");
      body.append(nameWrap, kindWrap, iconWrap, saveBtn);
    });
  }, "ls-btn-sm"), btn("+ Place", () => {
    ctrl.modals.open({ title: "Add Location Pin", width: 480 }, (body, close) => {
      const nameWrap = el("label", "ls-label", "Location Name");
      const nameInp = el("input", "ls-input");
      nameWrap.append(nameInp);
      const zoneWrap = el("label", "ls-label", "Zone / Building / District");
      const zoneInp = el("input", "ls-input");
      zoneInp.value = effectiveZoneId && zonesMap[effectiveZoneId]?.name || state.places[curId]?.zoneId && zonesMap[state.places[curId].zoneId]?.name || "";
      zoneInp.placeholder = "e.g. Second-Floor Apartment";
      zoneWrap.append(zoneInp);
      const iconWrap = el("label", "ls-label", "Icon");
      const iconInp = el("input", "ls-input");
      iconInp.value = "\uD83D\uDCCD";
      iconWrap.append(iconInp);
      const descWrap = el("label", "ls-label", "Description");
      const descInp = el("input", "ls-input");
      descWrap.append(descInp);
      const saveBtn = btn("Add Location", () => {
        const name = nameInp.value.trim();
        if (!name)
          return;
        const curName = state.places[curId]?.name;
        ctrl.request("state:mutate", {
          patch: {
            places: [
              {
                id: slugifyKey(name, "place"),
                name,
                zone: zoneInp.value.trim() || undefined,
                icon: iconInp.value.trim() || "\uD83D\uDCCD",
                description: descInp.value.trim() || "Connected location.",
                connectedNames: curName ? [curName] : []
              }
            ]
          },
          reason: `Added location "${name}"`
        });
        close();
      }, "ls-btn-primary");
      body.append(nameWrap, zoneWrap, iconWrap, descWrap, saveBtn);
    });
  }, "ls-btn-sm ls-btn-primary"), btn("Export", () => {
    const mapPack = {
      schema: "lumi-stats-map/v1",
      zones: Object.values(zonesMap),
      places,
      paths: allEdges
    };
    const blob = new Blob([JSON.stringify(mapPack, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugifyKey(state.title, "lumi_map")}.lumi-map.json`;
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, "ls-btn-sm ls-btn-ghost", "Export Map JSON"), btn("Import", () => {
    ctrl.ctx.uploads.pickFile({ accept: [".json", "application/json"], multiple: false, maxSizeBytes: 1500000 }).then((files) => {
      const f = files[0];
      if (!f)
        return;
      const parsed = JSON.parse(new TextDecoder().decode(f.bytes));
      ctrl.request("state:mutate", {
        patch: {
          zones: Array.isArray(parsed.zones) ? parsed.zones : undefined,
          places: Array.isArray(parsed.places) ? parsed.places : undefined,
          paths: Array.isArray(parsed.paths) ? parsed.paths : undefined
        },
        reason: `Imported map layout from ${f.name}`
      });
    });
  }, "ls-btn-sm ls-btn-ghost", "Import Map JSON"));
  topRow.append(breadcrumbRow, rightControls);
  wrap.append(topRow);
  if (!places.length) {
    const empty = el("div", "ls-card");
    empty.append(el("strong", "", "No locations mapped yet"), el("p", "ls-muted", 'Locations, zones, and connecting paths build automatically as scenes progress, or click "+ Zone" / "+ Place" above.'));
    wrap.append(empty);
    return wrap;
  }
  const inspectedPlace = state.places[inspectedId] ?? places[0];
  const inspector = el("div", "ls-card");
  const canvas = el("div", "ls-vn-atlas-canvas");
  const activeBackdrop = inspectedPlace.backdropUrl || places.find((p) => p.id === curId && p.backdropUrl)?.backdropUrl || places.find((p) => p.backdropUrl)?.backdropUrl;
  if (activeBackdrop) {
    canvas.style.backgroundImage = `linear-gradient(rgba(11,17,32,0.72), rgba(11,17,32,0.88)), url(${JSON.stringify(activeBackdrop)})`;
    canvas.style.backgroundSize = "cover";
    canvas.style.backgroundPosition = "center";
  }
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;";
  if (!effectiveZoneId && hasMultipleZones) {
    svg.setAttribute("viewBox", "0 0 1000 360");
    for (const edge of hubLayout.edges) {
      const path = document.createElementNS(ns, "path");
      path.setAttribute("d", `M ${edge.x1} ${edge.y1} Q ${edge.cx} ${edge.cy} ${edge.x2} ${edge.y2}`);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", edge.locked ? "var(--ls-danger, #f43f5e)" : edge.isOnRoute ? "var(--ls-primary, #38bdf8)" : "rgba(148,163,184,0.55)");
      path.setAttribute("stroke-width", edge.isOnRoute ? "3" : "2");
      path.setAttribute("stroke-dasharray", edge.locked ? "5 4" : "4 3");
      svg.append(path);
      const midX = 0.25 * edge.x1 + 0.5 * edge.cx + 0.25 * edge.x2;
      const midY = 0.25 * edge.y1 + 0.5 * edge.cy + 0.25 * edge.y2;
      const ePill = el("span", "ls-mz-edge-pill", `${edge.locked ? "\uD83D\uDD12 " : PATH_ICON[edge.pathType] || "\uD83D\uDEE3️"} ${edge.travelMinutes}m`);
      ePill.dataset.route = String(edge.isOnRoute);
      ePill.style.left = `${(midX / 1000 * 100).toFixed(2)}%`;
      ePill.style.top = `${(midY / 360 * 100).toFixed(2)}%`;
      canvas.append(ePill);
    }
    canvas.append(svg);
    for (const hub of hubLayout.hubs) {
      const hubBtn = btn("", () => {
        focusedZoneId = hub.zone.id;
        showOverviewMode = false;
        if (hub.placeIds[0] && !hub.placeIds.includes(inspectedId)) {
          ctrl.selectedPlaceId = hub.placeIds[0];
        }
        ctrl.emitChange();
      }, "ls-vn-zone-hub", `Open ${hub.zone.name} (${hub.placeIds.length} locations)`);
      hubBtn.dataset.current = String(hub.containsCurrent);
      hubBtn.style.setProperty("--ls-zone-color", hub.zone.color || "#38bdf8");
      hubBtn.style.left = `${(hub.x / 1000 * 100).toFixed(2)}%`;
      hubBtn.style.top = `${(hub.y / 360 * 100).toFixed(2)}%`;
      if (hub.backdropUrl) {
        hubBtn.style.backgroundImage = `linear-gradient(rgba(11,17,32,0.72), rgba(11,17,32,0.88)), url(${JSON.stringify(hub.backdropUrl)})`;
        hubBtn.style.backgroundSize = "cover";
        hubBtn.style.backgroundPosition = "center";
      }
      const topMeta = el("div", "ls-row");
      topMeta.append(el("span", "", `${hub.zone.icon} ${hub.zone.name}`));
      const subMeta = el("div", "ls-row");
      if (hub.containsCurrent) {
        subMeta.append(el("span", "ls-chip ls-chip-accent", "YOU"));
      } else {
        subMeta.append(el("span", "ls-chip", `${hub.minTravelMinutes}m`));
      }
      subMeta.append(el("span", "ls-chip", `${hub.placeIds.length} ${hub.placeIds.length === 1 ? "spot" : "spots"}`));
      if (hub.activeQuestCount > 0) {
        subMeta.append(el("span", "ls-chip", "\uD83C\uDFAF"));
      }
      hubBtn.append(topMeta, subMeta);
      if (hub.actorsHere.length > 0) {
        hubBtn.append(renderAvatarBadges(hub.actorsHere, 4));
      }
      canvas.append(hubBtn);
    }
  } else {
    const zoneLayout = buildSpatialMapLayout(state, inspectedId, effectiveZoneId || undefined);
    svg.setAttribute("viewBox", "0 0 1000 580");
    for (const edge of zoneLayout.edges) {
      const path = document.createElementNS(ns, "path");
      path.setAttribute("d", `M ${edge.x1} ${edge.y1} Q ${edge.cx} ${edge.cy} ${edge.x2} ${edge.y2}`);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", edge.locked ? "var(--ls-danger, #f43f5e)" : edge.isOnRoute ? "var(--ls-primary, #38bdf8)" : "rgba(148,163,184,0.55)");
      path.setAttribute("stroke-width", edge.isOnRoute ? "3.5" : "2");
      if (edge.locked || edge.isCrossZone || edge.pathType === "portal") {
        path.setAttribute("stroke-dasharray", edge.pathType === "portal" ? "3 4" : "6 4");
      }
      svg.append(path);
      const midX = 0.25 * edge.x1 + 0.5 * edge.cx + 0.25 * edge.x2;
      const midY = 0.25 * edge.y1 + 0.5 * edge.cy + 0.25 * edge.y2;
      const ePill = el("span", "ls-mz-edge-pill", `${edge.locked ? "\uD83D\uDD12 " : PATH_ICON[edge.pathType] || "\uD83D\uDEAA"} ${edge.travelMinutes}m`);
      ePill.dataset.route = String(edge.isOnRoute);
      ePill.style.left = `${(midX / 1000 * 100).toFixed(2)}%`;
      ePill.style.top = `${(midY / 580 * 100).toFixed(2)}%`;
      canvas.append(ePill);
    }
    canvas.append(svg);
    for (const node of zoneLayout.nodes) {
      const tile = btn("", () => {
        ctrl.selectedPlaceId = node.place.id;
        ctrl.emitChange();
        requestAnimationFrame(() => {
          inspector.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
      }, "ls-mz-node-tile", node.place.name);
      tile.dataset.current = String(node.isCurrent);
      tile.dataset.selected = String(node.place.id === inspectedId);
      tile.style.left = `${(node.x / 1000 * 100).toFixed(2)}%`;
      tile.style.top = `${(node.y / 580 * 100).toFixed(2)}%`;
      const shortName = node.place.name.length > 24 ? `${node.place.name.slice(0, 22)}…` : node.place.name;
      tile.append(el("span", "ls-mz-node-title", `${node.place.icon || "\uD83D\uDCCD"} ${shortName}${node.activeQuestCount ? " \uD83C\uDFAF" : ""}`));
      if (node.actorsHere.length > 0 || node.isCurrent) {
        const avRow = renderAvatarBadges(node.actorsHere, 3);
        if (node.isCurrent) {
          avRow.prepend(el("span", "ls-chip ls-chip-accent", "YOU"));
        }
        tile.append(avRow);
      }
      canvas.append(tile);
    }
  }
  wrap.append(canvas);
  const visiblePlaces = effectiveZoneId ? places.filter((p) => (p.zoneId || "zone_local") === effectiveZoneId) : places;
  const destGrid = el("div", "ls-vn-dest-grid");
  for (const p of visiblePlaces) {
    const isCurrent = p.id === curId;
    const isInspected = p.id === inspectedPlace.id;
    const route = !isCurrent ? findShortestTravelRoute(state, p.id) : null;
    const actorsAtPlace = Object.values(state.characters).filter((c) => c.present ? p.id === curId : c.locationId === p.id).map((c) => ({ id: c.id, name: c.name, portraitUrl: c.portraitUrl }));
    const card = el("div", "ls-vn-dest-card");
    card.dataset.current = String(isCurrent);
    card.dataset.selected = String(isInspected);
    card.addEventListener("click", () => {
      ctrl.selectedPlaceId = p.id;
      ctrl.emitChange();
    });
    const thumb = el("div", "ls-vn-dest-thumb");
    if (p.backdropUrl) {
      const img = el("img");
      img.src = p.backdropUrl;
      img.alt = p.name;
      thumb.append(img);
    } else {
      thumb.textContent = p.icon || "\uD83D\uDCCD";
    }
    const info = el("div", "ls-vn-dest-info");
    const titleLine = el("div", "ls-row");
    titleLine.append(el("strong", "", p.name));
    if (isCurrent)
      titleLine.append(el("span", "ls-chip ls-chip-accent", "Here"));
    info.append(titleLine);
    const zName = p.zoneId && zonesMap[p.zoneId]?.name || "";
    if (zName) {
      info.append(el("small", "ls-muted", zName));
    }
    if (actorsAtPlace.length > 0) {
      info.append(renderAvatarBadges(actorsAtPlace, 4));
    }
    const rightSide = el("div", "ls-row");
    if (!isCurrent) {
      rightSide.append(el("span", "ls-chip", `${route?.totalMinutes ?? p.travelMinutes}m`), btn("Go", () => {
        ctrl.request("map:travel", { placeId: p.id, fastTravel: true });
      }, "ls-btn-sm ls-btn-primary", `Fast travel to ${p.name}`));
    }
    card.append(thumb, info, rightSide);
    destGrid.append(card);
  }
  wrap.append(destGrid);
  const route = inspectedPlace.id !== curId ? findShortestTravelRoute(state, inspectedPlace.id) : null;
  const placeEdges = allEdges.filter((e) => e.fromId === inspectedPlace.id || e.toId === inspectedPlace.id);
  const inspectedZoneName = inspectedPlace.zoneId && zonesMap[inspectedPlace.zoneId]?.name || "Local Area";
  const head = el("div", "ls-row-between");
  head.append(el("strong", "", `${inspectedPlace.icon} ${inspectedPlace.name} · ${inspectedZoneName}`), el("span", "ls-chip ls-chip-accent", inspectedPlace.id === curId ? "Current Location" : `${route?.totalMinutes ?? inspectedPlace.travelMinutes}m travel`));
  inspector.append(head, el("p", "ls-muted", inspectedPlace.description));
  if (placeEdges.length > 0) {
    const pathRow = el("div", "ls-row");
    for (const edge of placeEdges) {
      const peerId = edge.fromId === inspectedPlace.id ? edge.toId : edge.fromId;
      const peerName = state.places[peerId]?.name ?? peerId;
      pathRow.append(btn(`${edge.locked ? "\uD83D\uDD12" : PATH_ICON[edge.pathType]} ${peerName} (${edge.travelMinutes}m)`, () => {
        ctrl.selectedPlaceId = peerId;
        ctrl.emitChange();
      }, "ls-btn-sm", "Jump inspector to connected place"));
    }
    inspector.append(pathRow);
  }
  const btnRow = el("div", "ls-row");
  if (inspectedPlace.id !== curId) {
    btnRow.append(btn("Copy Travel Action", () => {
      ctrl.request("map:travel", { placeId: inspectedPlace.id, fastTravel: false }).then(async (res) => {
        const text = typeof res.draftText === "string" ? res.draftText : "";
        if (!text)
          return;
        try {
          await navigator.clipboard.writeText(text);
          ctrl.notify(`Copied travel action: "${text}"`);
        } catch {
          ctrl.notify(`Travel route: ${text}`);
        }
      });
    }, "ls-btn-sm"), btn("Fast Travel Here", () => {
      ctrl.request("map:travel", { placeId: inspectedPlace.id, fastTravel: true });
    }, "ls-btn-sm ls-btn-primary"));
  }
  btnRow.append(btn("Upload Backdrop", () => ctrl.pickAndUploadImage(inspectedPlace.id, "backdrop"), "ls-btn-sm"), btn("Edit Place", () => {
    ctrl.modals.open({ title: `Edit Place: ${inspectedPlace.name}`, width: 500 }, (body, close) => {
      const nameWrap = el("label", "ls-label", "Location Name");
      const nameInp = el("input", "ls-input");
      nameInp.value = inspectedPlace.name;
      nameWrap.append(nameInp);
      const zoneWrap = el("label", "ls-label", "Zone / Building / District");
      const zoneInp = el("input", "ls-input");
      zoneInp.value = inspectedPlace.zoneId && zonesMap[inspectedPlace.zoneId]?.name || "";
      zoneWrap.append(zoneInp);
      const iconWrap = el("label", "ls-label", "Icon");
      const iconInp = el("input", "ls-input");
      iconInp.value = inspectedPlace.icon || "\uD83C\uDFDB️";
      iconWrap.append(iconInp);
      const tagsWrap = el("label", "ls-label", "Tags (comma-separated, e.g. safe, shop, danger)");
      const tagsInp = el("input", "ls-input");
      tagsInp.value = (inspectedPlace.tags ?? []).join(", ");
      tagsWrap.append(tagsInp);
      const descWrap = el("label", "ls-label", "Description");
      const descInp = el("textarea", "ls-input");
      descInp.rows = 2;
      descInp.value = inspectedPlace.description;
      descWrap.append(descInp);
      const minsWrap = el("label", "ls-label", "Default Travel Minutes");
      const minsInp = el("input", "ls-input");
      minsInp.type = "number";
      minsInp.value = String(inspectedPlace.travelMinutes || 5);
      minsWrap.append(minsInp);
      const saveBtn = btn("Save Location", () => {
        const zName = zoneInp.value.trim();
        const nextZones = { ...state.mapZones ?? {} };
        let nextZoneId = inspectedPlace.zoneId;
        if (zName) {
          nextZoneId = slugifyKey(zName, "zone");
          if (!nextZones[nextZoneId]) {
            nextZones[nextZoneId] = {
              id: nextZoneId,
              name: zName,
              kind: "building",
              icon: "\uD83C\uDFDB️",
              color: "#38bdf8",
              description: ""
            };
          }
        }
        const nextPlaces = structuredClone(state.places);
        const target = nextPlaces[inspectedPlace.id];
        if (target) {
          target.name = nameInp.value.trim() || target.name;
          target.zoneId = nextZoneId;
          target.icon = iconInp.value.trim() || "\uD83D\uDCCD";
          target.tags = tagsInp.value.split(",").map((s) => s.trim()).filter(Boolean);
          target.description = descInp.value.trim() || target.description;
          target.travelMinutes = Math.max(1, Number(minsInp.value) || 5);
          ctrl.request("state:mutate", {
            stateOverride: { places: nextPlaces, mapZones: nextZones },
            reason: `Edited location "${target.name}"`
          });
        }
        close();
      }, "ls-btn-primary");
      body.append(nameWrap, zoneWrap, iconWrap, tagsWrap, descWrap, minsWrap, saveBtn);
    });
  }, "ls-btn-sm"));
  if (places.length > 1) {
    btnRow.append(btn("Delete", () => {
      const nextPlaces = structuredClone(state.places);
      delete nextPlaces[inspectedPlace.id];
      for (const p of Object.values(nextPlaces)) {
        p.connectedIds = p.connectedIds.filter((cid) => cid !== inspectedPlace.id);
      }
      const nextPaths = (state.mapPaths ?? []).filter((e) => e.fromId !== inspectedPlace.id && e.toId !== inspectedPlace.id);
      const nextCurId = state.currentPlaceId === inspectedPlace.id ? Object.keys(nextPlaces)[0] ?? "" : state.currentPlaceId;
      ctrl.selectedPlaceId = nextCurId;
      ctrl.request("state:mutate", {
        stateOverride: { places: nextPlaces, mapPaths: nextPaths, currentPlaceId: nextCurId },
        reason: `Deleted location "${inspectedPlace.name}"`
      });
    }, "ls-btn-sm ls-btn-danger"));
  }
  inspector.append(btnRow);
  wrap.append(inspector);
  return wrap;
}

// src/frontend/surfaces/StatGrid.ts
function mountSanitizedHtml(target, rawHtml, ctx) {
  const html = rawHtml.trim();
  if (!html)
    return;
  const runInject = () => {
    if (!ctx?.dom?.inject) {
      target.textContent = html.replace(/<[^>]+>/g, "");
      return;
    }
    try {
      ctx.dom.inject(target, html, "beforeend");
    } catch {
      target.textContent = html.replace(/<[^>]+>/g, "");
    }
  };
  if (target.isConnected) {
    runInject();
  } else {
    queueMicrotask(() => {
      if (target.isConnected)
        runInject();
    });
  }
}
var STEP_KEY_RE = /^(?:impulse|inhibition|action|acted|thought|inner\s*thought|saw|heard|saw\/heard|take|observation|trigger|response|result|outcome|cause|effect|before|after|step|status|state|goal|intent|attitude|location|current|current\s*step|next|hook|active\s*plans?|leverage|pivot|reward|risk|verdict|knows\/misreads|knows|blind\s*to|secret\s*stage)$/i;
function normalizeBracketKeySyntax(raw) {
  return raw.replace(/\[\s*([^\]\n:]{1,40}?)\s*\]\s*\{\s*([^\}\n]+?)\s*\}/g, "$1: $2").replace(/([A-Za-z][A-Za-z0-9_\/\s-]{1,32})\s*:\s*\[([^\[\]\n]+)\]/g, "$1: $2").replace(/\[\s*([^\]\n:]{1,40}?)\s*\]\s*:\s*\{?\s*([^\]\}\n]+?)\s*\}?(?=\s*(?:->|→|⇒|\||vs\b|$))/gi, "$1: $2");
}
function stripOuterBrackets(s) {
  let t = normalizeBracketKeySyntax(s).trim();
  while (t.startsWith("[") && t.endsWith("]") && !t.slice(1, -1).includes("[") || t.startsWith("{") && t.endsWith("}") && !t.slice(1, -1).includes("{")) {
    t = t.slice(1, -1).trim();
  }
  return t;
}
function parseStructuredStatText(raw) {
  const clean = normalizeBracketKeySyntax(raw).trim();
  if (!clean)
    return [];
  const rows = clean.split(/\r?\n|(?:\s*;\s*)|(?:\s+•\s+)/).map((s) => stripOuterBrackets(s.replace(/^[-*•]\s+/, "").trim())).filter(Boolean);
  return rows.map((rowText) => {
    const arrowSteps = rowText.split(/\s*(?:->|→|⇒)\s*/).map((s) => stripOuterBrackets(s)).filter(Boolean);
    let subject;
    if (arrowSteps.length > 1) {
      const firstStep = arrowSteps[0];
      const firstMatch = firstStep.match(/^([^:\[\]\|]{2,50}):\s*([\s\S]+)$/);
      const keyCandidate = firstMatch?.[1]?.trim() ?? "";
      const secondHasKey = /^[^:\[\]]{1,30}:\s*\S/.test(arrowSteps[1]);
      if (firstMatch && !STEP_KEY_RE.test(keyCandidate) && !/\bvs\.?\b/i.test(firstStep) && !firstStep.includes("|") && !secondHasKey) {
        subject = keyCandidate;
        arrowSteps[0] = firstMatch[2].trim();
      }
    }
    const steps = arrowSteps.flatMap((step) => step.split(/\s*\|\s*/)).map((s) => stripOuterBrackets(s)).filter(Boolean);
    return {
      ...subject ? { subject } : {},
      steps: steps.length ? steps : [rowText]
    };
  });
}
function renderKeyValOrTextChip(rawSegment) {
  const clean = stripOuterBrackets(rawSegment);
  if (!clean)
    return null;
  const kvMatch = clean.match(/^([^:->→\[\]]{1,40}):\s*([\s\S]*)$/);
  const node = el("span", "ls-step-node");
  if (kvMatch) {
    const keyLabel = kvMatch[1].trim();
    const valText = stripOuterBrackets(kvMatch[2] ?? "");
    if (!valText)
      return null;
    const keySpan = el("strong", "", `${keyLabel}: `);
    keySpan.style.color = "var(--ls-primary)";
    keySpan.style.marginRight = "4px";
    node.append(keySpan, document.createTextNode(valText));
  } else {
    node.textContent = clean;
  }
  return node;
}
function appendStepsToChain(chain, steps) {
  let renderedSteps = 0;
  for (const stepStr of steps) {
    const vsParts = stepStr.split(/\s+\bvs\.?\b\s+/i).map((s) => s.trim()).filter(Boolean);
    const chips = [];
    for (const [vIdx, part] of vsParts.entries()) {
      const chip = renderKeyValOrTextChip(part);
      if (chip)
        chips.push({ chip, isVs: vIdx > 0 });
    }
    if (!chips.length)
      continue;
    if (renderedSteps > 0) {
      chain.append(el("span", "ls-step-arrow", "→"));
    }
    for (const item of chips) {
      if (item.isVs) {
        chain.append(el("span", "ls-step-arrow", "vs"));
      }
      chain.append(item.chip);
    }
    renderedSteps++;
  }
}
function renderStructuredTextStatBody(rawText, displayStyle = "auto") {
  const text = rawText.trim();
  if (!text)
    return el("span", "ls-muted", "—");
  if (displayStyle === "quote_callout") {
    return el("div", "ls-thought-box", `“${stripOuterBrackets(text)}”`);
  }
  if (displayStyle === "pill_list") {
    const row = el("div", "ls-row");
    for (const item of text.split(/[,;\n]|->|→|⇒/).map((s) => s.trim()).filter(Boolean)) {
      row.append(el("span", "ls-chip ls-chip-accent", stripOuterBrackets(item)));
    }
    return row;
  }
  if (displayStyle === "step_chain") {
    const chain = el("div", "ls-step-chain ls-step-strip");
    const allSteps = text.split(/\r?\n|(?:\s*;\s*)|\s*(?:->|→|⇒)\s*/).map((s) => s.trim()).filter(Boolean);
    appendStepsToChain(chain, allSteps);
    return chain;
  }
  if (displayStyle === "key_value") {
    const kvGrid = el("div", "ls-kv-grid");
    const segments = text.split(/\r?\n|(?:\s*;\s*)|\s*(?:->|→|⇒)\s*|\s+\bvs\.?\b\s+/i).map((s) => s.replace(/^[-*•]\s+/, "").trim()).filter(Boolean);
    for (const [idx, seg] of segments.entries()) {
      const cleanSeg = stripOuterBrackets(seg);
      const kvMatch = cleanSeg.match(/^([^:]{1,45}):\s*([\s\S]+)$/);
      const row = el("div", "ls-kv-row");
      if (kvMatch) {
        row.append(el("span", "ls-kv-key", kvMatch[1].trim()), el("span", "ls-kv-val", stripOuterBrackets(kvMatch[2])));
      } else {
        row.append(el("span", "ls-kv-key", `#${idx + 1}`), el("span", "ls-kv-val", cleanSeg));
      }
      kvGrid.append(row);
    }
    return kvGrid;
  }
  const hasStructure = /->|→|⇒|\bvs\.?\b|\n|;|\[[^\]]+\]/i.test(text);
  if (!hasStructure && displayStyle === "auto") {
    const p = el("p", "", text);
    p.style.margin = "2px 0 0";
    return p;
  }
  if (displayStyle === "arc_tracker") {
    const rawItems = text.split(/\r?\n|(?=\[\s*t\d+\b)|(?:\s*;\s*)/i).map((s) => stripOuterBrackets(s.replace(/^[-*•]\s+/, "").trim())).filter(Boolean);
    const list = el("div", "ls-arc-list");
    for (const rawItem of rawItems) {
      const card = el("div", "ls-arc-card");
      const parts = rawItem.split(/\s*\|\s*/).map((p) => p.trim()).filter(Boolean);
      const firstPart = parts[0] ?? rawItem;
      const clockMatch = rawItem.match(/\b(\d+)\s*\/\s*(\d+)\b/);
      const curProg = clockMatch ? Math.max(0, Number(clockMatch[1])) : null;
      const maxProg = clockMatch ? Math.max(1, Math.min(12, Number(clockMatch[2]))) : null;
      const statusMatch = rawItem.match(/\b(ACTIVE|DORMANT|PAYOFF|COMPLETE(?:D)?|DONE|RETIRE(?:D)?|URGENT|FAIL(?:ED)?|ADVANCE|CONTINUE|SHIFT|DROP)\b/i);
      const statusLabel = statusMatch ? statusMatch[1].toUpperCase() : "";
      let titleText = firstPart.replace(/^t\d+\s*/i, "").replace(/\(\s*([^|)]+?)\s*(?:\|\s*\d+\s*\/\s*\d+\s*)?\)\s*:?/, "$1:").trim();
      let summaryText = "";
      const colonIdx = titleText.indexOf(":");
      if (colonIdx > 0 && colonIdx < 48) {
        summaryText = titleText.slice(colonIdx + 1).trim();
        titleText = titleText.slice(0, colonIdx).trim();
      } else {
        titleText = titleText.replace(/\s*\|\s*\d+\s*\/\s*\d+/, "").trim();
      }
      const head = el("div", "ls-row-between");
      head.append(el("strong", "ls-arc-title", titleText || "Active Thread"));
      const badges = el("div", "ls-row");
      if (statusLabel) {
        const badge = el("span", "ls-arc-status", statusLabel);
        badge.dataset.arcStatus = statusLabel.toLowerCase();
        badges.append(badge);
      }
      if (curProg !== null && maxProg !== null) {
        badges.append(el("span", "ls-chip", `${curProg}/${maxProg}`));
      }
      head.append(badges);
      card.append(head);
      if (curProg !== null && maxProg !== null) {
        const clockBar = el("div", "ls-clock-bar ls-arc-clock");
        clockBar.style.gridTemplateColumns = `repeat(${maxProg}, 1fr)`;
        for (let i = 1;i <= maxProg; i++) {
          clockBar.append(el("span", `ls-clock-seg${i <= curProg ? " is-filled" : ""}`));
        }
        card.append(clockBar);
      }
      if (summaryText) {
        card.append(el("p", "ls-arc-summary", summaryText));
      }
      for (const extraPart of parts.slice(1)) {
        if (/^\d+\s*\/\s*\d+$/.test(extraPart))
          continue;
        const cleanExtra = stripOuterBrackets(extraPart);
        const kv = cleanExtra.match(/^([^:]{1,28}):\s*([\s\S]+)$/);
        if (kv) {
          const line = el("div", "ls-arc-meta");
          line.append(el("span", "ls-kv-key", `${kv[1].trim()}:`), el("span", "ls-muted", kv[2].trim()));
          card.append(line);
        } else {
          card.append(el("small", "ls-muted", cleanExtra));
        }
      }
      list.append(card);
    }
    return list;
  }
  if (displayStyle === "accordion_cards") {
    const entries = parseStructuredStatText(text);
    const list = el("div", "ls-feed-list");
    for (const [idx, entry] of entries.entries()) {
      const det = el("details", "ls-stat-acc");
      if (idx === 0)
        det.open = true;
      const sum = el("summary", "ls-stat-acc-head");
      const title = entry.subject || entry.steps[0] || `Entry ${idx + 1}`;
      const preview = entry.subject ? entry.steps[0] ?? "" : entry.steps[1] ?? "";
      sum.append(el("strong", "", title), ...preview ? [el("small", "ls-muted ls-stat-acc-preview", preview)] : []);
      const body = el("div", "ls-stat-acc-body");
      const chain = el("div", "ls-step-chain");
      appendStepsToChain(chain, entry.steps);
      body.append(chain);
      det.append(sum, body);
      list.append(det);
    }
    return list;
  }
  if (displayStyle === "matrix_badges") {
    const rows = text.split(/\r?\n|(?:\s*;\s*)/).map((s) => stripOuterBrackets(s.replace(/^[-*•]\s+/, "").trim())).filter(Boolean);
    const list = el("div", "ls-feed-list");
    for (const row of rows) {
      const box = el("div", "ls-matrix-card");
      const segs = row.split(/\s*(?:\bvs\.?\b|\||->|→|⇒)\s*/i).map((s) => stripOuterBrackets(s)).filter(Boolean);
      const grid = el("div", "ls-matrix-cols");
      const mainCols = segs.slice(0, 2);
      const tailCols = segs.slice(2);
      for (const colText of mainCols) {
        const cell = el("div", "ls-matrix-cell");
        const kv = colText.match(/^([^:]{1,28}):\s*([\s\S]+)$/);
        if (kv) {
          cell.append(el("span", "ls-kv-key", kv[1].trim()), el("span", "", stripOuterBrackets(kv[2])));
        } else {
          cell.append(el("span", "", colText));
        }
        grid.append(cell);
      }
      box.append(grid);
      for (const tail of tailCols) {
        const footer = el("div", "ls-matrix-footer");
        const kv = tail.match(/^([^:]{1,28}):\s*([\s\S]+)$/);
        if (kv) {
          footer.append(el("span", "ls-kv-key", `${kv[1].trim()}: `), el("span", "", stripOuterBrackets(kv[2])));
        } else {
          footer.append(el("span", "", tail));
        }
        box.append(footer);
      }
      list.append(box);
    }
    return list;
  }
  if (displayStyle === "meter_mini_bars") {
    const pairs = [...text.matchAll(/\b([A-Za-z][A-Za-z0-9_ -]{0,18}?)\s*[:=]?\s*(-?\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\b/g)];
    if (pairs.length > 0) {
      const grid = el("div", "ls-minibars-grid");
      for (const m of pairs) {
        const label = m[1].trim();
        const cur = Number(m[2]);
        const max = Math.max(1, Number(m[3]));
        const pct = Math.max(0, Math.min(100, Math.round(cur / max * 100)));
        const cell = el("div", "ls-minibar-cell");
        const head = el("div", "ls-row-between");
        head.append(el("span", "ls-kv-key", label), el("strong", "", `${cur}/${max}`));
        const track = el("div", "ls-bar-track");
        const fill = el("div", "ls-bar-fill");
        fill.style.width = `${pct}%`;
        if (/hp|health|vital|blood/i.test(label))
          fill.style.background = "#f43f5e";
        else if (/mp|mana|ki|energy/i.test(label))
          fill.style.background = "#38bdf8";
        track.append(fill);
        cell.append(head, track);
        grid.append(cell);
      }
      return grid;
    }
  }
  if (displayStyle === "stat_pills_grid") {
    const grid = el("div", "ls-statpills-grid");
    const tokens = text.split(/\s*(?:\||,|;|\n)\s*/).flatMap((chunk) => {
      const sub = chunk.trim();
      if (!sub)
        return [];
      if (/^(?:[A-Za-z]{1,8}\d+\s+)+[A-Za-z]{1,8}\d+$/.test(sub)) {
        return sub.split(/\s+/);
      }
      return [sub];
    }).filter(Boolean);
    for (const tok of tokens) {
      const tile = el("div", "ls-statpill-tile");
      const compactMatch = tok.match(/^([A-Za-z][A-Za-z0-9_]{0,12})\s*[:=]?\s*(-?\d+(?:\.\d+)?(?:\/\d+)?(?:\s*\([^)]+\))?)$/);
      if (compactMatch) {
        tile.append(el("span", "ls-kv-key", compactMatch[1].trim()), el("strong", "", compactMatch[2].trim()));
      } else {
        tile.append(el("strong", "", tok));
      }
      grid.append(tile);
    }
    return grid;
  }
  if (displayStyle === "bullet_ledger") {
    const rows = text.split(/\r?\n|(?:\s*;\s*)|(?:\s+•\s+)/).map((s) => s.replace(/^[-*•]\s+/, "").trim()).filter(Boolean);
    const list = el("div", "ls-ledger-list");
    for (const r of rows) {
      const row = el("div", "ls-ledger-row");
      const amountMatch = r.match(/^(.+?)\s*:\s*([$€£¥]?\s*-?\d[\d,]*(?:\.\d+)?.*)$/);
      if (amountMatch) {
        row.append(el("span", "", amountMatch[1].trim()), el("span", "ls-chip ls-chip-accent", amountMatch[2].trim()));
      } else {
        row.append(el("span", "", r));
      }
      list.append(row);
    }
    return list;
  }
  if (displayStyle === "timeline_list") {
    const rows = text.split(/\r?\n|(?:\s*;\s*)|\s*(?:->|→|⇒)\s*/).map((s) => stripOuterBrackets(s.replace(/^[-*•]\s+/, "").trim())).filter(Boolean);
    const list = el("div", "ls-timeline-list");
    for (const r of rows) {
      const item = el("div", "ls-timeline-item");
      item.append(el("span", "ls-timeline-dot"), el("span", "", r));
      list.append(item);
    }
    return list;
  }
  if (displayStyle === "checklist") {
    const rows = text.split(/\r?\n|(?:\s*;\s*)/).map((s) => s.replace(/^[-*•]\s+/, "").trim()).filter(Boolean);
    const list = el("div", "ls-checklist");
    for (const r of rows) {
      const isDone = /^(?:\[x\]|✓|✔|done:|completed:)/i.test(r);
      const clean = r.replace(/^(?:\[[ xX]\]|✓|✔|○)\s*/, "").trim();
      const row = el("div", "ls-checklist-row");
      row.dataset.done = String(isDone);
      row.append(el("span", "ls-checklist-box", isDone ? "✓" : ""), el("span", isDone ? "ls-muted" : "", clean));
      list.append(row);
    }
    return list;
  }
  const entries = parseStructuredStatText(text);
  const list = el("div", "ls-feed-list");
  for (const entry of entries) {
    const card = el("div", "ls-feed-card");
    if (entry.subject) {
      card.append(el("div", "ls-feed-subject", `\uD83D\uDC64 ${entry.subject}`));
    }
    const chain = el("div", "ls-step-chain");
    appendStepsToChain(chain, entry.steps);
    card.append(chain);
    list.append(card);
  }
  return list;
}
function interpolateBannerTemplate(rawHtml, state) {
  const escMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  const esc = (s) => s.replace(/[&<>"']/g, (ch) => escMap[ch]);
  const banner = formatSceneBanner(state);
  const firstPresent = Object.values(state.characters).find((c) => c.present) ?? Object.values(state.characters)[0];
  const tokens = {
    title: esc(state.title),
    location: esc(banner.location),
    time: esc(banner.time),
    date: esc(banner.date),
    weather: esc(banner.weather),
    header: esc(banner.formatted),
    player_attire: esc(state.player.attire),
    name: esc(firstPresent?.name ?? ""),
    role: esc(firstPresent?.roleSummary ?? ""),
    demeanor: esc(firstPresent?.demeanor ?? ""),
    attire: esc(firstPresent?.attire ?? "")
  };
  return rawHtml.replace(/\{\{\s*([\w:.-]+)\s*\}\}/g, (_m, key) => {
    if (key.startsWith("stat:")) {
      const id = key.slice(5);
      const val = state.stats[id]?.value ?? firstPresent?.meters[id]?.value;
      return val !== undefined ? esc(String(val)) : "—";
    }
    return tokens[key] ?? "";
  });
}
function openSceneBannerModal(ctrl) {
  const { state } = ctrl.snapshot;
  const banner = formatSceneBanner(state);
  ctrl.modals.open({ title: "✏️ Edit Scene Banner & Player Presentation", width: 540 }, (body, close) => {
    const makeField = (label, val, placeholder) => {
      const wrap = el("label", "ls-label", label);
      const inp = el("input", "ls-input");
      inp.value = val;
      inp.placeholder = placeholder;
      wrap.append(inp);
      body.append(wrap);
      return inp;
    };
    const locInp = makeField("\uD83D\uDCCD Location & Region", state.scene.location || banner.location, "e.g. Master Suite, Estate");
    const timeInp = makeField("\uD83D\uDD70️ Time", state.scene.timeLabel || banner.time, "e.g. 08:30 PM");
    const dateInp = makeField("\uD83D\uDCC5 Date / Era", state.scene.dateLabel || banner.date, "e.g. Day 1 · Evening");
    const weatherInp = makeField("\uD83C\uDF26️ Weather & Atmosphere", state.scene.weather || banner.weather, "e.g. Warm Indoor Steam");
    const attireInp = makeField("\uD83D\uDC55 Your Current Attire / Presentation", state.player.attire, "e.g. Wearing only a towel after a bath");
    const sumWrap = el("label", "ls-label", "Scene Beat Summary");
    const sumInp = el("textarea", "ls-input");
    sumInp.rows = 2;
    sumInp.value = state.scene.beatSummary || "";
    sumWrap.append(sumInp);
    body.append(sumWrap);
    const actions = el("div", "ls-row-between");
    const skips = el("div", "ls-row");
    skips.append(btn("⚙️ Pill Prompts", () => {
      close();
      openScenePillEditorModal(ctrl);
    }, "ls-btn-sm"));
    for (const [lbl, mins] of [["+15m", 15], ["+1h", 60], ["+1d", 1440]]) {
      skips.append(btn(lbl, () => {
        ctrl.request("state:mutate", {
          patch: { scene: { elapsedMinutes: mins } },
          reason: `Advanced clock ${lbl}`
        });
        close();
      }, "ls-btn-sm"));
    }
    const saveBtn = btn("\uD83D\uDCBE Save Scene", () => {
      ctrl.request("state:mutate", {
        patch: {
          scene: {
            location: locInp.value.trim(),
            timeLabel: timeInp.value.trim(),
            dateLabel: dateInp.value.trim(),
            weather: weatherInp.value.trim(),
            beatSummary: sumInp.value.trim()
          },
          player: {
            attire: attireInp.value.trim()
          }
        },
        reason: "Updated scene & player presentation"
      });
      close();
    }, "ls-btn-primary");
    actions.append(skips, saveBtn);
    body.append(actions);
  });
}
function openSandboxTesterModal(ctrl, statId) {
  ctrl.modals.open({ title: "\uD83E\uDDEA Two-Phase Stat Calibration & Reactivity Sandbox", width: 660, maxHeight: 760 }, (body, close) => {
    const scenWrap = el("label", "ls-label", "Test Scenario / Turn Input (or leave blank to auto-generate)");
    const scenInp = el("textarea", "ls-input");
    scenInp.rows = 2;
    scenInp.placeholder = 'e.g. "My loyal maid greets me as I step out of the bath wearing only a towel."';
    scenWrap.append(scenInp);
    const resultBox = el("div", "ls-stack");
    const runTest = () => {
      resultBox.replaceChildren(el("p", "ls-muted", "⏳ Evaluating scenario against two-phase calibration rules…"));
      ctrl.request("sandbox:test", {
        statId,
        scenarioText: scenInp.value.trim() || undefined
      }).then((res) => {
        resultBox.replaceChildren();
        const beatCard = el("div", "ls-card");
        beatCard.append(el("span", "ls-kicker", "\uD83D\uDCD6 Evaluated Beat"), el("p", "", String(res.testBeat ?? "")));
        resultBox.append(beatCard);
        const entries = Array.isArray(res.auditEntries) ? res.auditEntries : [];
        if (!entries.length) {
          resultBox.append(el("p", "ls-muted", "No stats shifted for this scenario."));
        } else {
          for (const entry of entries) {
            const row = el("div", "ls-stat-cell");
            const top = el("div", "ls-row-between");
            top.append(el("strong", "", `${String(entry.statLabel)} (${String(entry.op)})`), el("span", "ls-chip ls-chip-accent", `${String(entry.before ?? "uncalibrated")} → ${String(entry.after)}`));
            row.append(top, el("small", "ls-muted", String(entry.reason ?? "")));
            resultBox.append(row);
          }
        }
      }).catch((err) => {
        resultBox.replaceChildren(el("p", "ls-muted", err instanceof Error ? err.message : String(err)));
      });
    };
    const topBtns = el("div", "ls-row-between");
    topBtns.append(btn("▶ Run Sandbox Evaluation", runTest, "ls-btn-primary"), btn("Close", close, "ls-btn-sm"));
    body.append(scenWrap, topBtns, resultBox);
    runTest();
  });
}
function openDuplicateStatModal(ctrl, source) {
  const tpl = structuredClone(ctrl.snapshot.template);
  let targetScope = source.scope === "player" ? "character" : "player";
  let targetWTab = targetScope === "character" ? "cast" : targetScope === "world" ? "world" : "stats";
  let targetITab = targetScope === "character" ? "cast" : targetScope === "world" ? "world" : "stats";
  let targetDTab = source.dossierTabId || "bonds";
  ctrl.modals.open({
    title: `\uD83D\uDCCB Duplicate Stat: ${source.icon} ${source.label}`,
    width: 540
  }, (body, close, _handle, modalScope) => {
    body.append(el("p", "ls-muted", `Copy "${source.label}" (including its style, color, range, anchors, and AI rules) into another scope or tab.`));
    const labelWrap = el("label", "ls-label", "New Stat Label (Can keep the same label for a different scope)");
    const labelInp = el("input", "ls-input");
    labelInp.value = source.label;
    labelWrap.append(labelInp);
    const scopeWrap = el("div", "ls-label", "Target Owner Scope");
    const scopeSlot = el("div");
    scopeWrap.append(scopeSlot);
    const tabsGrid = el("div", "ls-grid");
    const wWrap = el("div", "ls-label", "\uD83E\uDE9F Target Widget Tab");
    const wSlot = el("div");
    wWrap.append(wSlot);
    const iWrap = el("div", "ls-label", "\uD83D\uDCAC Target Inline Tab");
    const iSlot = el("div");
    iWrap.append(iSlot);
    const dWrap = el("div", "ls-label", "\uD83E\uDEAA Target Dossier Tab");
    const dSlot = el("div");
    dWrap.append(dSlot);
    tabsGrid.append(wWrap, iWrap, dWrap);
    const wCtrl = mountThemedSelect(ctrl, modalScope, wSlot, {
      value: targetWTab,
      ariaLabel: "Target Widget Tab",
      options: tpl.surfaces.widgetTabs.map((t) => ({ value: t.id, label: `${t.icon} ${t.label}` })),
      onChange: (v) => {
        targetWTab = v;
      }
    });
    const iCtrl = mountThemedSelect(ctrl, modalScope, iSlot, {
      value: targetITab,
      ariaLabel: "Target Inline Tab",
      options: tpl.surfaces.inlineTabs.map((t) => ({ value: t.id, label: `${t.icon} ${t.label}` })),
      onChange: (v) => {
        targetITab = v;
      }
    });
    mountThemedSelect(ctrl, modalScope, dSlot, {
      value: targetDTab,
      ariaLabel: "Target Dossier Tab",
      options: tpl.surfaces.dossierTabs.map((t) => ({ value: t.id, label: `${t.icon} ${t.label}` })),
      onChange: (v) => {
        targetDTab = v;
      }
    });
    mountThemedSelect(ctrl, modalScope, scopeSlot, {
      value: targetScope,
      ariaLabel: "Target Owner Scope",
      options: [
        { value: "character", label: "\uD83D\uDC65 Character Meter (Per-NPC in Cast & Dossier)" },
        { value: "player", label: "\uD83D\uDC64 Player Stat" },
        { value: "world", label: "\uD83C\uDF0D World State Stat / Clock" },
        { value: "scene", label: "\uD83C\uDFAD Scene / Thread Stat" }
      ],
      onChange: (v) => {
        targetScope = v;
        const defTab = targetScope === "character" ? "cast" : targetScope === "world" ? "world" : "stats";
        targetWTab = defTab;
        targetITab = defTab;
        wCtrl.setValue(defTab);
        iCtrl.setValue(defTab);
      }
    });
    const dupBtn = btn("\uD83D\uDCCB Create Duplicate Stat", () => {
      const nextLabel = labelInp.value.trim() || source.label;
      const baseSlug = slugifyKey(nextLabel, "stat");
      const scopePrefix = targetScope === "character" ? "char" : targetScope;
      let candidateId = tpl.stats.some((s) => s.id === baseSlug) ? `${scopePrefix}_${baseSlug}` : baseSlug;
      if (tpl.stats.some((s) => s.id === candidateId)) {
        candidateId = `${scopePrefix}_${baseSlug}_${Date.now().toString(36).slice(-3)}`;
      }
      const cloned = createStatSchema({
        ...structuredClone(source),
        id: candidateId,
        label: nextLabel,
        scope: targetScope,
        tabId: targetWTab,
        widgetTabId: targetWTab,
        inlineTabId: targetITab,
        dossierTabId: targetDTab,
        showIn: {
          widget: true,
          inline: true,
          dossier: targetScope === "character",
          pinnedHeader: false
        }
      });
      tpl.stats.push(cloned);
      ctrl.request("state:mutate", {
        templatePatch: { stats: tpl.stats },
        reason: `Duplicated "${source.label}" to ${targetScope} (${targetWTab})`
      });
      ctrl.notify(`Duplicated "${cloned.icon} ${cloned.label}" to ${targetScope}!`);
      close();
    }, "ls-btn-primary");
    dupBtn.style.marginTop = "10px";
    body.append(labelWrap, scopeWrap, tabsGrid, dupBtn);
  });
}
function openStatSchemaModal(ctrl, defaultScope = "character", existing) {
  const tpl = structuredClone(ctrl.snapshot.template);
  ctrl.modals.open({
    title: existing ? `Edit Stat: ${existing.icon} ${existing.label}` : "Create Stat or Character Meter",
    width: 660,
    maxHeight: 820
  }, (body, close, _handle, modalScope) => {
    let selectedScope = existing?.scope ?? defaultScope;
    let selectedCategoryId = existing?.categoryId ?? "";
    let selectedKind = existing?.kind ?? "meter";
    let selectedVol = existing?.volatility ?? (defaultScope === "character" ? "progressive" : "momentary");
    let selectedStyle = existing?.displayStyle ?? "auto";
    let selectedSpan = existing?.layoutSpan ?? "auto";
    let selectedColor = existing?.color || "var(--lumiverse-primary)";
    let selectedWTab = existing?.widgetTabId ?? (defaultScope === "world" ? "world" : defaultScope === "character" ? "cast" : "stats");
    let selectedITab = existing?.inlineTabId ?? (defaultScope === "world" ? "world" : defaultScope === "character" ? "cast" : "stats");
    let selectedDTab = existing?.dossierTabId ?? "bonds";
    let showWidget = existing?.showIn?.widget ?? true;
    let showInline = existing?.showIn?.inline ?? true;
    let showDossier = existing ? existing.scope === "character" ? existing.showIn?.dossier ?? true : false : selectedScope === "character";
    let pinnedToHeader = existing?.pinnedToHeader ?? false;
    let locked = existing?.locked ?? false;
    const basicsHost = el("div");
    body.append(basicsHost);
    const basicsBody = mountNativeCollapsible(ctrl, modalScope, basicsHost, {
      title: "1. Basics & Value Format",
      iconName: "stats",
      defaultExpanded: true
    });
    const topGrid = el("div", "ls-grid");
    const iconWrap = el("label", "ls-label", "Icon");
    const iconInp = el("input", "ls-input");
    iconInp.value = existing?.icon ?? (defaultScope === "character" ? "\uD83D\uDC96" : "\uD83D\uDCCA");
    iconWrap.append(iconInp);
    const labelWrap = el("label", "ls-label", "Stat Name");
    const labelInp = el("input", "ls-input");
    labelInp.placeholder = "e.g. Loyalty, Offscreen NPCs, Threat Clock…";
    labelInp.value = existing?.label ?? "";
    labelWrap.append(labelInp);
    const catWrap = el("div", "ls-label", "Category / Group (Optional)");
    const catSlot = el("div");
    catWrap.append(catSlot);
    mountThemedSelect(ctrl, modalScope, catSlot, {
      value: selectedCategoryId,
      ariaLabel: "Category / Group",
      options: [
        { value: "", label: "None (Uncategorized)" },
        ...(tpl.categories ?? []).map((c) => ({
          value: c.id,
          label: `${c.icon} ${c.name}`
        }))
      ],
      onChange: (v) => {
        selectedCategoryId = v;
      }
    });
    topGrid.append(iconWrap, labelWrap, catWrap);
    basicsBody.append(topGrid);
    const metaGrid = el("div", "ls-grid");
    const scopeWrap = el("div", "ls-label", "Owner Scope");
    const scopeSlot = el("div");
    scopeWrap.append(scopeSlot);
    const kindWrap = el("div", "ls-label", "Value Format");
    const kindSlot = el("div");
    kindWrap.append(kindSlot);
    const volWrap = el("div", "ls-label", "Reactivity Profile");
    const volSlot = el("div");
    volWrap.append(volSlot);
    metaGrid.append(scopeWrap, kindWrap, volWrap);
    basicsBody.append(metaGrid);
    const rangeGrid = el("div", "ls-grid");
    const minWrap = el("label", "ls-label", "Minimum");
    const minInp = el("input", "ls-input");
    minInp.type = "number";
    minInp.value = String(existing?.min ?? 0);
    minWrap.append(minInp);
    const maxWrap = el("label", "ls-label", "Maximum / Segments");
    const maxInp = el("input", "ls-input");
    maxInp.type = "number";
    maxInp.value = String(existing?.max ?? 100);
    maxWrap.append(maxInp);
    const defWrap = el("label", "ls-label", "Starting / Fallback Value");
    const defInp = el("input", "ls-input");
    defInp.value = String(existing?.defaultValue ?? 0);
    defWrap.append(defInp);
    rangeGrid.append(minWrap, maxWrap, defWrap);
    basicsBody.append(rangeGrid);
    const syncRangeVisibility = () => {
      const isNumeric = ["meter", "clock", "pips", "number", "hearts", "currency", "attributes"].includes(selectedKind) && selectedStyle === "auto";
      rangeGrid.style.display = isNumeric ? "" : "none";
    };
    syncRangeVisibility();
    const displayHost = el("div");
    body.append(displayHost);
    const displayBody = mountNativeCollapsible(ctrl, modalScope, displayHost, {
      title: "2. Appearance, Visibility & Tabs",
      iconName: "palette",
      defaultExpanded: false
    });
    const styleGrid = el("div", "ls-grid");
    const styleWrap = el("div", "ls-label", "Visual Display Style");
    const styleSlot = el("div");
    styleWrap.append(styleSlot);
    const spanWrap = el("div", "ls-label", "Card Grid Width");
    const spanSlot = el("div");
    spanWrap.append(spanSlot);
    styleGrid.append(styleWrap, spanWrap);
    displayBody.append(styleGrid);
    const colorWrap = el("div", "ls-label", "Accent & Bar Color");
    const colorRow = el("div", "ls-row");
    const colorSwatches = [
      { value: "var(--lumiverse-primary)", label: "Theme Primary", preview: "var(--lumiverse-primary, #38bdf8)" },
      { value: "#38bdf8", label: "Sky Cyan", preview: "#38bdf8" },
      { value: "#f472b6", label: "Rose Pink", preview: "#f472b6" },
      { value: "#f59e0b", label: "Amber Gold", preview: "#f59e0b" },
      { value: "#10b981", label: "Emerald", preview: "#10b981" },
      { value: "#a78bfa", label: "Royal Violet", preview: "#a78bfa" },
      { value: "#f43f5e", label: "Crimson", preview: "#f43f5e" }
    ];
    const syncColorSwatches = () => {
      for (const child of [...colorRow.querySelectorAll(".ls-color-swatch")]) {
        child.setAttribute("aria-pressed", String(child.dataset.colorVal === selectedColor));
      }
    };
    for (const sw of colorSwatches) {
      const b = btn("", () => {
        selectedColor = sw.value;
        syncColorSwatches();
      }, "ls-color-swatch", sw.label);
      b.dataset.colorVal = sw.value;
      b.style.background = sw.preview;
      colorRow.append(b);
    }
    const customColorInp = el("input");
    customColorInp.type = "color";
    customColorInp.title = "Custom color";
    customColorInp.style.cssText = "width:26px;height:22px;border:0;padding:0;background:transparent;cursor:pointer;";
    if (selectedColor.startsWith("#") && selectedColor.length === 7) {
      customColorInp.value = selectedColor;
    }
    customColorInp.addEventListener("input", () => {
      selectedColor = customColorInp.value;
      syncColorSwatches();
    });
    colorRow.append(customColorInp);
    syncColorSwatches();
    colorWrap.append(colorRow);
    displayBody.append(colorWrap);
    const routingGrid = el("div", "ls-grid");
    const wTabWrap = el("div", "ls-label", "Floating Widget Tab");
    const wTabSlot = el("div");
    wTabWrap.append(wTabSlot);
    const iTabWrap = el("div", "ls-label", "Inline Ribbon Tab");
    const iTabSlot = el("div");
    iTabWrap.append(iTabSlot);
    const dTabWrap = el("div", "ls-label", "Character Dossier Tab");
    const dTabSlot = el("div");
    dTabWrap.append(dTabSlot);
    routingGrid.append(wTabWrap, iTabWrap, dTabWrap);
    displayBody.append(routingGrid);
    const flagsGrid = el("div", "ls-grid");
    let dossierCheckboxSlot;
    for (const [lbl, initVal, setter] of [
      ["Show in Widget", showWidget, (v) => {
        showWidget = v;
      }],
      ["Show in Inline Ribbon", showInline, (v) => {
        showInline = v;
      }],
      ["Show in Dossier", showDossier, (v) => {
        showDossier = v;
      }],
      ["Pin to Header / Pill", pinnedToHeader, (v) => {
        pinnedToHeader = v;
      }],
      ["Lock Value", locked, (v) => {
        locked = v;
      }]
    ]) {
      const slot = el("div");
      if (lbl === "Show in Dossier")
        dossierCheckboxSlot = slot;
      mountNativeCheckbox(ctrl, modalScope, slot, {
        checked: initVal,
        label: lbl,
        onChange: setter
      });
      flagsGrid.append(slot);
    }
    displayBody.append(flagsGrid);
    const extraWTabs = new Set(existing?.extraWidgetTabIds ?? []);
    const extraWrap = el("div", "ls-label", "Also Mirror in Additional Widget Tabs (Optional)");
    const extraRow = el("div", "ls-row");
    for (const wt of tpl.surfaces.widgetTabs) {
      const slot = el("div");
      mountNativeCheckbox(ctrl, modalScope, slot, {
        checked: extraWTabs.has(wt.id),
        label: `${wt.icon} ${wt.label}`,
        onChange: (on) => {
          if (on)
            extraWTabs.add(wt.id);
          else
            extraWTabs.delete(wt.id);
        }
      });
      extraRow.append(slot);
    }
    extraWrap.append(extraRow);
    displayBody.append(extraWrap);
    let calcMode = existing?.calculationMode === "ai_plus_local" || existing?.calculationMode === "local_formula" ? existing.calculationMode : Boolean(existing?.formula?.trim()) && existing?.calculationMode !== "ai" ? "local_formula" : "ai";
    let promptTriggerMode = existing?.promptTriggerMode ?? "always";
    let injectInContinuity = existing?.injectInContinuity !== false;
    const aiHost = el("div");
    body.append(aiHost);
    const aiBody = mountNativeCollapsible(ctrl, modalScope, aiHost, {
      title: "3. Calculation Mode, Formula & Token Diet",
      iconName: "sparkles",
      badge: calcMode === "local_formula" ? "Pure Local" : calcMode === "ai_plus_local" ? "AI + Local" : "AI",
      defaultExpanded: true
    });
    const modeToggleWrap = el("div", "ls-stat-cell");
    modeToggleWrap.append(el("strong", "", "Calculation Mode"), el("small", "ls-muted", 'Use "AI + Local Math" when the AI must set starting values/deltas (e.g. Level & Stats, Vitals). Use "Pure Local" (0 tokens) when computed strictly from other stats (e.g. Eff POW/AGI).'));
    const modeBtnRow = el("div", "ls-row");
    modeToggleWrap.append(modeBtnRow);
    aiBody.append(modeToggleWrap);
    const trigWrap = el("div", "ls-label", "Prompt Frequency (When AI-Tracked)");
    const trigSlot = el("div");
    trigWrap.append(trigSlot);
    aiBody.append(trigWrap);
    const contSlot = el("div");
    mountNativeCheckbox(ctrl, modalScope, contSlot, {
      checked: injectInContinuity,
      label: "Include this stat in Story Continuity Prompt (turn off for UI-only scratchpads)",
      onChange: (on) => {
        injectInContinuity = on;
      }
    });
    aiBody.append(contSlot);
    const kwWrap = el("label", "ls-label", "Trigger Keywords (comma-separated — only sends rule when seen in recent chat)");
    const kwInp = el("input", "ls-input");
    kwInp.placeholder = "e.g. cash, money, bank, rent, pay, buy, wallet";
    kwInp.value = (existing?.promptKeywords ?? []).join(", ");
    kwWrap.append(kwInp);
    aiBody.append(kwWrap);
    const formulaBox = el("div", "ls-stack");
    const formulaArea = el("textarea", "ls-input");
    formulaArea.rows = 4;
    formulaArea.placeholder = `Write math using your stat IDs or auto-extracted tokens (e.g. round((40 + P + Lv * 2) * wound))
Supports: + - * / %, round(), floor(), ceil(), min(), max(), clamp(), if(), hasCond("...")`;
    formulaArea.value = existing?.formula ?? "";
    const outTplWrap = el("label", "ls-label", "Output Format Template (optional, e.g. POW {pow} | AGI {agi})");
    const outTplInp = el("input", "ls-input");
    outTplInp.placeholder = "Leave blank for plain number, or e.g. POW {pow} | AGI {agi}";
    outTplInp.value = existing?.formulaOutputTemplate ?? "";
    outTplWrap.append(outTplInp);
    const statusBox = el("div", "ls-formula-status");
    const statusMain = el("strong", "");
    const statusTokens = el("small", "ls-muted");
    statusBox.append(statusMain, statusTokens);
    const cueWrap = el("div", "ls-label");
    const cueHeader = el("div", "ls-row-between");
    const cueArea = el("textarea", "ls-input");
    cueArea.rows = 3;
    cueArea.value = existing?.triggerCues ?? "";
    cueArea.placeholder = 'Write your rule in plain English (used by AI, or click "Convert My Rule to Formula" when Local Toggle is ON)…';
    const dynamicVarsRow = el("div", "ls-row");
    const statusActionRow = el("div", "ls-row");
    statusBox.append(statusActionRow);
    const insertTokenAtCursor = (tokenStr) => {
      const start = formulaArea.selectionStart ?? formulaArea.value.length;
      const end = formulaArea.selectionEnd ?? formulaArea.value.length;
      formulaArea.value = formulaArea.value.slice(0, start) + tokenStr + formulaArea.value.slice(end);
      formulaArea.focus();
      formulaArea.setSelectionRange(start + tokenStr.length, start + tokenStr.length);
      updateFormulaPreview();
    };
    let isConvertingRule = false;
    let lastTestedStamp = "";
    const runConvertRule = (sourceRuleText, triggerBtn) => {
      if (isConvertingRule)
        return;
      const cleanRule = sourceRuleText.trim();
      if (!cleanRule) {
        if (calcMode === "ai")
          calcMode = "local_formula";
        syncCalcVisibility();
        statusBox.dataset.status = "warn";
        statusMain.textContent = "⚠ Write your plain-English rule in the box below first, then click Convert.";
        cueArea.focus();
        return;
      }
      if (!cueArea.value.trim())
        cueArea.value = cleanRule;
      isConvertingRule = true;
      const prevLabel = triggerBtn?.textContent ?? "";
      if (triggerBtn) {
        triggerBtn.disabled = true;
        triggerBtn.textContent = "⏳ Converting…";
      }
      if (calcMode === "ai")
        calcMode = "local_formula";
      syncCalcVisibility();
      statusBox.dataset.status = "warn";
      statusMain.textContent = "⏳ Converting your rule to a universal local formula…";
      statusActionRow.replaceChildren();
      ctrl.request("formula:compile", {
        statLabel: labelInp.value.trim() || "Stat",
        ruleText: cleanRule,
        scope: selectedScope
      }).then((res) => {
        const nextFormula = typeof res.formula === "string" ? res.formula.trim() : "";
        if (!nextFormula) {
          statusBox.dataset.status = "error";
          statusMain.textContent = "✖ AI returned an empty formula. Check your LLM connection in Studio → 6. AI & Connections.";
          return;
        }
        formulaArea.value = nextFormula;
        if (typeof res.outputTemplate === "string") {
          outTplInp.value = res.outputTemplate;
        }
        if (res.suggestedMode === "ai_plus_local" || res.suggestedMode === "local_formula") {
          calcMode = res.suggestedMode;
        }
        lastTestedStamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        syncCalcVisibility();
        if (res.explanation) {
          statusTokens.textContent = `✓ ${String(res.explanation)} · ${statusTokens.textContent}`;
        }
      }).catch((err) => {
        statusBox.dataset.status = "error";
        statusMain.textContent = `✖ Convert Failed: ${err instanceof Error ? err.message : String(err)}`;
      }).finally(() => {
        isConvertingRule = false;
        if (triggerBtn && triggerBtn.isConnected) {
          triggerBtn.disabled = false;
          triggerBtn.textContent = prevLabel;
        }
      });
    };
    const updateFormulaPreview = () => {
      const draftSchema = createStatSchema({
        ...existing,
        id: existing?.id || slugifyKey(labelInp.value || "preview", "preview"),
        label: labelInp.value || "Preview",
        scope: selectedScope,
        kind: selectedKind,
        calculationMode: "local_formula",
        formula: formulaArea.value,
        formulaOutputTemplate: outTplInp.value
      });
      const res = previewStatFormula(draftSchema, ctrl.snapshot.state, tpl.stats, ctrl.selectedActorId);
      dynamicVarsRow.replaceChildren(el("small", "ls-muted", "Insert Variable:"));
      const dynamicKeys = [
        ...Object.keys(res.availableTokens).slice(0, 12),
        ...res.availableStringVars.conditions !== undefined ? ["conditions"] : []
      ];
      for (const key of dynamicKeys) {
        const valPreview = res.availableTokens[key] !== undefined ? String(res.availableTokens[key]) : res.availableStringVars[key] || '""';
        dynamicVarsRow.append(btn(`${key} (${valPreview.slice(0, 16)})`, () => insertTokenAtCursor(formulaArea.value.includes("{{") ? `{{.${key}}}` : key), "ls-btn-sm ls-quick-pill", `Click to insert ${key}`));
      }
      const tokenEntries = Object.entries(res.availableTokens).slice(0, 14).map(([k, v]) => `${k}=${v}`).join(", ");
      statusTokens.textContent = tokenEntries ? `Detected on ${res.targetName}: ${tokenEntries}` : `No numeric tokens detected yet on ${res.targetName}.`;
      statusActionRow.replaceChildren();
      if (!formulaArea.value.trim()) {
        statusBox.dataset.status = "warn";
        statusMain.textContent = cueArea.value.trim() ? "⚠ Formula box is empty. Click below to convert your plain-English rule automatically, or type math / {{calc::...}} macros." : "⚠ Enter math lines, Lumiverse {{calc::...}} / {{if::...}} macros, or write a rule below and click Convert.";
        if (cueArea.value.trim()) {
          const convBtn = btn("⚡ Convert My Rule to Local Formula", () => runConvertRule(cueArea.value, convBtn), "ls-btn-sm ls-btn-primary");
          statusActionRow.append(convBtn);
        }
      } else if (res.isProse) {
        statusBox.dataset.status = "warn";
        statusMain.textContent = "⚠ Plain-English text detected — this box runs math/macro syntax. Click below to convert it automatically:";
        const convBtn = btn("⚡ Convert This Text to Formula", () => runConvertRule(formulaArea.value, convBtn), "ls-btn-sm ls-btn-primary");
        statusActionRow.append(convBtn);
      } else if (res.error) {
        statusBox.dataset.status = "error";
        statusMain.textContent = `✖ Formula Error: ${res.error}`;
      } else if (res.output !== undefined) {
        const assignedKeys = Object.keys(res.locals).filter((k) => k !== "value" && k !== "result");
        const looksLikeMissingTemplate = assignedKeys.length >= 2 && !outTplInp.value.trim() && !formulaArea.value.includes("{{");
        if (looksLikeMissingTemplate) {
          statusBox.dataset.status = "warn";
          statusMain.textContent = `⚠ Result is just "${String(res.output)}" because Output Format Template is blank. Add e.g. {${assignedKeys.join("} {")}} above!`;
        } else {
          statusBox.dataset.status = "ok";
          const stampSuffix = lastTestedStamp ? ` (Tested ${lastTestedStamp})` : "";
          statusMain.textContent = `✓ Working on ${res.targetName} → Result: ${String(res.output)}${stampSuffix}`;
        }
      } else if (res.missingRefs.length > 0) {
        statusBox.dataset.status = "warn";
        statusMain.textContent = `⚠ Waiting for variables: ${res.missingRefs.join(", ")}`;
      } else {
        statusBox.dataset.status = "warn";
        statusMain.textContent = "⚠ Formula evaluated empty — check placeholder names or macro tags.";
      }
    };
    formulaArea.addEventListener("input", () => {
      lastTestedStamp = "";
      updateFormulaPreview();
    });
    outTplInp.addEventListener("input", () => {
      lastTestedStamp = "";
      updateFormulaPreview();
    });
    const formulaHead = el("div", "ls-row-between");
    formulaHead.append(el("strong", "", "Local Formula or Lumiverse Macros ({{calc}}, {{if}}, {{round}}, {{matches}})"), btn("▶ Run Live Test", () => {
      lastTestedStamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      updateFormulaPreview();
    }, "ls-btn-sm"));
    formulaBox.append(formulaHead, dynamicVarsRow, formulaArea, outTplWrap, statusBox);
    aiBody.append(formulaBox);
    const modeButtons = [];
    const syncCalcVisibility = () => {
      for (const item of modeButtons) {
        item.el.setAttribute("aria-current", item.id === calcMode ? "page" : "false");
      }
      const usesFormula = calcMode === "local_formula" || calcMode === "ai_plus_local";
      const usesPrompt = calcMode === "ai" || calcMode === "ai_plus_local";
      formulaBox.style.display = usesFormula ? "" : "none";
      trigWrap.style.display = usesPrompt ? "" : "none";
      kwWrap.style.display = usesPrompt && promptTriggerMode === "conditional" ? "" : "none";
      if (usesFormula)
        updateFormulaPreview();
    };
    for (const [mId, mLbl] of [
      ["ai", "\uD83E\uDD16 AI Only"],
      ["ai_plus_local", "\uD83D\uDD00 AI + Local Math"],
      ["local_formula", "⚡ Pure Local (0 tokens)"]
    ]) {
      const b = btn(mLbl, () => {
        calcMode = mId;
        syncCalcVisibility();
      }, "ls-btn-sm");
      modeButtons.push({ id: mId, el: b });
      modeBtnRow.append(b);
    }
    mountThemedSelect(ctrl, modalScope, trigSlot, {
      value: promptTriggerMode,
      ariaLabel: "Prompt Frequency",
      options: [
        { value: "always", label: "Always in Prompt" },
        { value: "conditional", label: "Only When Keywords Match" },
        { value: "manual", label: "Manual Sync Only" }
      ],
      onChange: (v) => {
        promptTriggerMode = v;
        syncCalcVisibility();
      }
    });
    syncCalcVisibility();
    cueHeader.append(el("span", "", "Rule / AI Prompt Instructions"), el("div", "ls-row"));
    const cueConvertBtn = btn("⚡ Convert My Rule to Local Formula", () => runConvertRule(cueArea.value, cueConvertBtn), "ls-btn-sm ls-btn-primary");
    cueHeader.lastElementChild.append(cueConvertBtn);
    const styleCtrl = mountThemedSelect(ctrl, modalScope, styleSlot, {
      value: selectedStyle,
      ariaLabel: "Visual Display Style",
      options: [
        { value: "auto", label: "✨ Smart Auto-Detect" },
        { value: "arc_tracker", label: "\uD83C\uDFAF Multi-Thread / Arc / Quest Cards" },
        { value: "accordion_cards", label: "\uD83D\uDDC2️ Collapsible Multi-Entry Cards" },
        { value: "matrix_badges", label: "⚖️ Split / Versus Comparison (Knows vs Blind)" },
        { value: "meter_mini_bars", label: "\uD83D\uDCCA Multi-Bar Mini Gauges (HP/MP cur/max)" },
        { value: "stat_pills_grid", label: "\uD83E\uDDEC Compact Stat Badges (Lv / P A I / POW)" },
        { value: "bullet_ledger", label: "\uD83D\uDCB0 Aligned Bullet & Currency Ledger" },
        { value: "timeline_list", label: "\uD83D\uDCDC Vertical Event Timeline" },
        { value: "checklist", label: "☑️ Visual Objectives Checklist" },
        { value: "feed_cards", label: "\uD83C\uDCCF Structured Flow Cards" },
        { value: "step_chain", label: "⛓️ Horizontal Step Chain" },
        { value: "key_value", label: "\uD83D\uDCCB Key–Value Table" },
        { value: "pill_list", label: "\uD83C\uDFF7️ Tag / Pill List" },
        { value: "quote_callout", label: "\uD83D\uDCAD Quote Callout Box" }
      ],
      onChange: (v) => {
        selectedStyle = v;
        const preserveKinds = new Set([
          "text",
          "tags",
          "tier",
          "skill_tree",
          "xp_level",
          "attributes",
          "inventory",
          "status_fx"
        ]);
        if (selectedStyle === "pill_list") {
          selectedKind = "tags";
          kindCtrl.setValue("tags");
        } else if (selectedStyle !== "auto" && !preserveKinds.has(selectedKind)) {
          selectedKind = "text";
          kindCtrl.setValue("text");
        }
        syncRangeVisibility();
      }
    });
    const spanCtrl = mountThemedSelect(ctrl, modalScope, spanSlot, {
      value: selectedSpan,
      ariaLabel: "Card Grid Width",
      options: [
        { value: "auto", label: "\uD83D\uDCD0 Auto" },
        { value: "full", label: "↔️ Always Full Width" },
        { value: "half", label: "▫ Always Compact Column" }
      ],
      onChange: (v) => {
        selectedSpan = v;
      }
    });
    mountThemedSelect(ctrl, modalScope, scopeSlot, {
      value: selectedScope,
      ariaLabel: "Owner Scope",
      options: [
        { value: "character", label: "\uD83D\uDC65 Character Meter (Per-NPC)" },
        { value: "player", label: "\uD83D\uDC64 Player Stat" },
        { value: "world", label: "\uD83C\uDF0D World Stat / Clock" },
        { value: "scene", label: "\uD83C\uDFAD Scene / Thread Stat" }
      ],
      onChange: (v) => {
        selectedScope = v;
        showDossier = selectedScope === "character";
        const chk = dossierCheckboxSlot?.querySelector("input");
        if (chk)
          chk.checked = showDossier;
        if (calcMode === "local_formula")
          updateFormulaPreview();
      }
    });
    const kindCtrl = mountThemedSelect(ctrl, modalScope, kindSlot, {
      value: selectedKind,
      ariaLabel: "Value Format",
      options: [
        { value: "meter", label: "\uD83D\uDCCA Progress Bar / Meter" },
        { value: "skill_tree", label: "\uD83C\uDF33 Skill Tree & SP" },
        { value: "xp_level", label: "⭐ XP & Leveling Gauge" },
        { value: "attributes", label: "\uD83E\uDDEC RPG Attributes + Radar" },
        { value: "inventory", label: "\uD83C\uDF92 Rarity Inventory" },
        { value: "status_fx", label: "⚡ Buffs & Debuffs" },
        { value: "hearts", label: "❤️ Heart Affinity Row" },
        { value: "currency", label: "\uD83E\uDE99 Currency Counter" },
        { value: "clock", label: "⏱️ Segmented Clock" },
        { value: "pips", label: "\uD83C\uDFB2 Resource Pips" },
        { value: "text", label: "\uD83D\uDCDD Structured Text / Feed" },
        { value: "tags", label: "\uD83C\uDFF7️ Tag / Pill List" },
        { value: "tier", label: "\uD83C\uDFC6 Ordered Stage / Rank" },
        { value: "number", label: "\uD83D\uDD22 Numeric Counter" },
        { value: "boolean", label: "☑️ Boolean Flag" }
      ],
      onChange: (v) => {
        selectedKind = v;
        if (selectedKind === "tags" && selectedStyle === "auto") {
          selectedStyle = "pill_list";
          styleCtrl.setValue("pill_list");
        } else if (["meter", "clock", "pips", "number", "boolean", "skill_tree", "xp_level", "attributes", "inventory", "status_fx", "hearts", "currency"].includes(selectedKind)) {
          selectedStyle = "auto";
          styleCtrl.setValue("auto");
          if (["skill_tree", "attributes", "inventory", "status_fx"].includes(selectedKind)) {
            selectedSpan = "full";
            spanCtrl.setValue("full");
          }
        }
        if (!existing) {
          if (selectedKind === "clock")
            maxInp.value = "6";
          else if (selectedKind === "pips" || selectedKind === "hearts")
            maxInp.value = "5";
          else if (selectedKind === "attributes")
            maxInp.value = "20";
          else if (selectedKind === "currency")
            maxInp.value = "99999999";
          else if (selectedKind === "meter" && ["5", "6"].includes(maxInp.value.trim()))
            maxInp.value = "100";
        } else if (["clock", "pips", "hearts"].includes(selectedKind) && Number(maxInp.value) === 100) {
          maxInp.value = selectedKind === "clock" ? "6" : "5";
        }
        if (["text", "tags", "tier"].includes(selectedKind) && defInp.value.trim() === "0") {
          defInp.value = "";
        }
        syncRangeVisibility();
      }
    });
    mountThemedSelect(ctrl, modalScope, volSlot, {
      value: selectedVol,
      ariaLabel: "Reactivity Profile",
      options: [
        { value: "momentary", label: "⚡ Momentary — Instant reaction" },
        { value: "progressive", label: "\uD83D\uDCC8 Progressive — Steady evolution" },
        { value: "anchor", label: "⚓ Anchor — Role/premise baseline" }
      ],
      onChange: (v) => {
        selectedVol = v;
      }
    });
    mountThemedSelect(ctrl, modalScope, wTabSlot, {
      value: selectedWTab,
      ariaLabel: "Floating Widget Tab",
      options: tpl.surfaces.widgetTabs.map((t) => ({ value: t.id, label: `${t.icon} ${t.label}` })),
      onChange: (v) => {
        selectedWTab = v;
      }
    });
    mountThemedSelect(ctrl, modalScope, iTabSlot, {
      value: selectedITab,
      ariaLabel: "Inline Ribbon Tab",
      options: tpl.surfaces.inlineTabs.map((t) => ({ value: t.id, label: `${t.icon} ${t.label}` })),
      onChange: (v) => {
        selectedITab = v;
      }
    });
    mountThemedSelect(ctrl, modalScope, dTabSlot, {
      value: selectedDTab,
      ariaLabel: "Character Dossier Tab",
      options: tpl.surfaces.dossierTabs.map((t) => ({ value: t.id, label: `${t.icon} ${t.label}` })),
      onChange: (v) => {
        selectedDTab = v;
      }
    });
    cueHeader.lastElementChild.append(btn("\uD83C\uDF33 Skill Rule", () => {
      selectedKind = "skill_tree";
      kindCtrl.setValue("skill_tree");
      selectedSpan = "full";
      spanCtrl.setValue("full");
      cueArea.value = 'Format: "SP: N | Skill A (Lv.X/Y, cost:1, bonus) ; Skill B (Lv.X/Y, cost:1, req:Skill A)". Grant SP on milestones or training.';
      syncRangeVisibility();
    }, "ls-btn-sm"), btn("✨ Feed Rule", () => {
      selectedKind = "text";
      kindCtrl.setValue("text");
      selectedStyle = "feed_cards";
      styleCtrl.setValue("feed_cards");
      selectedSpan = "full";
      spanCtrl.setValue("full");
      cueArea.value = 'Format each entry separated by "; " as: "Subject: Current Location -> Action -> Next Hook".';
      syncRangeVisibility();
    }, "ls-btn-sm"), btn("⛶ Full-Screen", () => {
      ctrl.request("textEditor:open", {
        title: `AI Prompt Rule: ${labelInp.value || "Stat"}`,
        value: cueArea.value,
        placeholder: "Describe when this stat should calibrate high/low and what situational cues shift it…"
      }).then((res) => {
        if (!res.cancelled && typeof res.text === "string") {
          cueArea.value = res.text;
        }
      });
    }, "ls-btn-sm"));
    cueWrap.append(cueHeader, cueArea);
    aiBody.append(cueWrap);
    const anchorsWrap = el("div", "ls-label");
    const anchorsHeader = el("div", "ls-row-between");
    const anchorsArea = el("textarea", "ls-input");
    anchorsArea.rows = 2;
    anchorsArea.placeholder = `Optional — e.g.
80: High — Description
50: Moderate — Description`;
    anchorsArea.value = (existing?.anchors ?? []).map((a) => `${a.value}: ${a.label}${a.description && a.description !== a.label ? ` — ${a.description}` : ""}`).join(`
`);
    anchorsHeader.append(el("span", "", "Scale Anchors (value: Label — Description)"), btn("✨ Auto-Fill Anchors", () => {
      const sample = buildProportionalAnchors(Number(minInp.value) || 0, Number(maxInp.value) || 100, selectedVol);
      anchorsArea.value = sample.map((a) => `${a.value}: ${a.label} — ${a.description}`).join(`
`);
    }, "ls-btn-sm"));
    anchorsWrap.append(anchorsHeader, anchorsArea);
    aiBody.append(anchorsWrap);
    const parseAnchorsText = (raw) => {
      if (!raw.trim())
        return [];
      const out = [];
      for (const line of raw.split(`
`).map((s) => s.trim()).filter(Boolean)) {
        const match = line.match(/^(-?\d+(?:\.\d+)?)\s*:\s*([^—\-]+?)(?:\s*[—\-]\s*(.+))?$/);
        if (match) {
          out.push({
            value: Number(match[1]),
            label: match[2].trim(),
            description: (match[3] ?? match[2]).trim()
          });
        }
      }
      return out;
    };
    const saveBtn = btn(existing ? "Save Changes" : "Create Stat", () => {
      const label = labelInp.value.trim();
      if (!label)
        return;
      const liveTpl = structuredClone(ctrl.snapshot.template);
      const parsedMin = Number(minInp.value);
      const min = minInp.value.trim() !== "" && Number.isFinite(parsedMin) ? parsedMin : 0;
      const parsedMax = Number(maxInp.value);
      const max = maxInp.value.trim() !== "" && Number.isFinite(parsedMax) ? parsedMax : 100;
      const rawDef = defInp.value.trim();
      const parsedDefNum = Number(rawDef);
      const defaultValue = selectedKind === "boolean" ? rawDef === "true" || rawDef === "1" : ["meter", "number", "clock", "pips", "hearts", "currency"].includes(selectedKind) && selectedStyle === "auto" ? rawDef !== "" && Number.isFinite(parsedDefNum) ? parsedDefNum : Math.max(Math.min(min, max), Math.min(Math.max(min, max), 0)) : rawDef && rawDef !== "0" ? rawDef : undefined;
      const parsedKeywords = kwInp.value.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean);
      let nextId = existing?.id;
      const statRenames = [];
      if (existing && label.toLowerCase() !== existing.label.trim().toLowerCase()) {
        const candidateId = slugifyKey(label, existing.id);
        const idTaken = liveTpl.stats.some((s) => s.id === candidateId && s.id !== existing.id);
        if (candidateId && candidateId !== existing.id && !idTaken) {
          nextId = candidateId;
          statRenames.push({ fromId: existing.id, toId: candidateId });
        }
      }
      const created = createStatSchema({
        ...existing,
        id: nextId,
        label,
        icon: iconInp.value.trim() || "\uD83D\uDCCA",
        scope: selectedScope,
        kind: selectedKind,
        volatility: selectedVol,
        displayStyle: selectedStyle,
        layoutSpan: selectedSpan,
        color: selectedColor,
        min,
        max,
        ...defaultValue !== undefined ? { defaultValue } : {},
        anchors: parseAnchorsText(anchorsArea.value),
        triggerCues: cueArea.value.trim(),
        calculationMode: calcMode,
        formula: calcMode === "local_formula" || calcMode === "ai_plus_local" ? formulaArea.value.trim() : undefined,
        formulaOutputTemplate: calcMode === "local_formula" || calcMode === "ai_plus_local" ? outTplInp.value.trim() : undefined,
        promptTriggerMode,
        promptKeywords: parsedKeywords,
        injectInContinuity,
        categoryId: selectedCategoryId || undefined,
        pinnedToHeader,
        locked,
        widgetTabId: selectedWTab,
        inlineTabId: selectedITab,
        dossierTabId: selectedDTab,
        extraWidgetTabIds: [...extraWTabs].filter((id) => id !== selectedWTab),
        showIn: {
          widget: showWidget,
          inline: showInline,
          dossier: showDossier,
          pinnedHeader: pinnedToHeader
        }
      });
      const oldIdx = existing ? liveTpl.stats.findIndex((s) => s.id === existing.id) : -1;
      const newIdx = liveTpl.stats.findIndex((s) => s.id === created.id);
      if (oldIdx >= 0)
        liveTpl.stats[oldIdx] = created;
      else if (newIdx >= 0)
        liveTpl.stats[newIdx] = created;
      else
        liveTpl.stats.push(created);
      ctrl.request("state:mutate", {
        templatePatch: { stats: liveTpl.stats },
        ...statRenames.length ? { statRenames } : {},
        reason: `Saved stat schema "${created.label}"`
      });
      close();
    }, "ls-btn-primary");
    const footerRow = el("div", "ls-row-between");
    footerRow.style.marginTop = "12px";
    if (existing) {
      const leftActions = el("div", "ls-row");
      leftActions.append(btn("Duplicate to Another Tab…", () => {
        close();
        openDuplicateStatModal(ctrl, existing);
      }, "ls-btn-sm"), btn("\uD83D\uDDD1️ Delete Stat", async () => {
        const ok = await ctrl.modals.confirm({
          title: `Delete "${existing.label}"?`,
          message: `Remove "${existing.icon} ${existing.label}" from the active template and stop tracking it?`,
          confirmLabel: "Delete",
          variant: "danger"
        });
        if (!ok)
          return;
        const liveTpl = structuredClone(ctrl.snapshot.template);
        ctrl.request("state:mutate", {
          templatePatch: { stats: liveTpl.stats.filter((s) => s.id !== existing.id) },
          reason: `Deleted stat "${existing.label}"`
        });
        ctrl.notify(`Deleted "${existing.icon} ${existing.label}".`);
        close();
      }, "ls-btn-sm ls-btn-danger"));
      footerRow.append(leftActions, saveBtn);
    } else {
      footerRow.append(el("span"), saveBtn);
    }
    body.append(footerRow);
  });
}
function renderStatSchemaCards(ctrl, matchingSchemas, defaultScope, compScope, interactiveSliders = false, showHeader = true) {
  const { state, template, deltas } = ctrl.snapshot;
  const wrap = el("div", "ls-stack");
  if (showHeader) {
    const head = el("div", "ls-row-between");
    head.append(el("span", "ls-kicker", `Active Stats (${matchingSchemas.length})`), el("div", "ls-row"));
    head.lastElementChild.append(iconBtn("flask", () => openSandboxTesterModal(ctrl), {
      label: "Sandbox",
      className: "ls-btn-sm ls-btn-ghost",
      title: "Test stats in AI Sandbox"
    }), iconBtn("plus", () => openStatSchemaModal(ctrl, defaultScope), {
      label: "Add Stat",
      className: "ls-btn-sm ls-btn-primary",
      title: "Create a new stat or meter"
    }));
    wrap.append(head);
  }
  if (!matchingSchemas.length) {
    wrap.append(el("p", "ls-muted", 'No stats assigned here yet. Click "+ Add Stat" or customize tab assignments in Studio.'));
    return wrap;
  }
  const catMap = new Map((template.categories ?? []).map((c) => [c.id, c]));
  const visibleSchemas = matchingSchemas.filter((s) => {
    if (!s.categoryId)
      return true;
    const cat = catMap.get(s.categoryId);
    return !cat || cat.enabled !== false;
  });
  const grid = el("div", "ls-stat-grid");
  const mutateStat = (schema, value, op = "set") => {
    ctrl.request("state:mutate", {
      patch: {
        stats: {
          [schema.id]: { op, value, reason: "Manual UI adjustment" }
        }
      },
      reason: `Updated ${schema.label} to ${String(value)}`
    });
  };
  const renderedCells = [];
  const orderedSchemas = [...visibleSchemas].sort((a, b) => {
    const ca = a.categoryId ? catMap.get(a.categoryId)?.order ?? 999 : 1000;
    const cb = b.categoryId ? catMap.get(b.categoryId)?.order ?? 999 : 1000;
    return ca - cb;
  });
  let lastRenderedCatId;
  for (const schema of orderedSchemas) {
    const activeCat = schema.categoryId ? catMap.get(schema.categoryId) : undefined;
    if (activeCat && activeCat.showGroupHeaderInHud !== false && activeCat.id !== lastRenderedCatId) {
      lastRenderedCatId = activeCat.id;
      const catHeader = el("div", "ls-hud-cat-head");
      catHeader.style.borderLeftColor = activeCat.color || "var(--ls-primary)";
      catHeader.append(el("strong", "", `${activeCat.icon} ${activeCat.name}`));
      grid.append(catHeader);
    } else if (!activeCat && lastRenderedCatId !== undefined) {
      lastRenderedCatId = undefined;
    }
    const runtime = state.stats[schema.id];
    const isCalibrated = Boolean(runtime?.calibrated);
    const val = runtime !== undefined ? runtime.value : schema.defaultValue;
    const isLocked = Boolean(schema.locked || runtime?.locked);
    const delta = deltas.statDeltas[schema.id] ?? 0;
    const strVal = String(val ?? "");
    const isRpgRichKind = [
      "skill_tree",
      "xp_level",
      "attributes",
      "inventory",
      "status_fx"
    ].includes(schema.kind);
    const hasCustomStyle = Boolean(schema.displayStyle && schema.displayStyle !== "auto");
    const isTextKind = schema.kind === "text" || schema.kind === "tags" || schema.kind === "tier";
    const isStructuredBodyStat = !isRpgRichKind && (hasCustomStyle || isTextKind || isCalibrated && typeof val === "string" && (strVal.length > 24 || /->|→|\n|;/.test(strVal)));
    const hasDelimiters = /->|→|\n|;/.test(strVal);
    const compactCustomStyle = schema.displayStyle === "stat_pills_grid" || schema.displayStyle === "meter_mini_bars";
    const spanMode = schema.layoutSpan === "full" || schema.layoutSpan !== "half" && (["skill_tree", "attributes", "inventory", "status_fx", "xp_level"].includes(schema.kind) || hasCustomStyle && !compactCustomStyle || isStructuredBodyStat && (strVal.length > 40 || hasDelimiters)) ? "full" : "half";
    const cell = el("div", "ls-stat-cell");
    cell.style.setProperty("--ls-bar-color", schema.color || "var(--ls-primary)");
    cell.dataset.locked = String(isLocked);
    cell.dataset.uncalibrated = String(!isCalibrated);
    cell.dataset.span = spanMode;
    if (runtime?.lastReason) {
      cell.title = `${runtime.lastReason} (Right-click or long-press for options)`;
    }
    const top = el("div", "ls-row-between");
    const titleSpan = el("div", "ls-row");
    titleSpan.append(el("strong", "", `${schema.icon} ${schema.label}`));
    if (schema.calculationMode === "ai_plus_local") {
      titleSpan.append(el("span", "ls-chip ls-chip-accent", "\uD83D\uDD00 Hybrid"));
    } else if (schema.calculationMode === "local_formula" || schema.formula) {
      titleSpan.append(el("span", "ls-chip ls-chip-accent", "⚡ Local"));
    }
    top.append(titleSpan);
    const right = el("div", "ls-row");
    if (delta !== 0) {
      right.append(el("span", `ls-delta ${delta > 0 ? "is-pos" : "is-neg"}`, `${delta > 0 ? `+${delta} ▲` : `${delta} ▼`}`));
    }
    let headerBadgeText = "";
    if (!isCalibrated && !isRpgRichKind) {
      headerBadgeText = "Uncalibrated";
    } else if (schema.kind === "clock" || schema.kind === "pips") {
      headerBadgeText = `${Number(val) || 0}/${schema.max}`;
    } else if (schema.kind === "boolean") {
      headerBadgeText = val ? "✓ Active" : "○ Inactive";
    } else if (isRpgRichKind || schema.kind === "currency" || schema.kind === "hearts") {
      headerBadgeText = "";
    } else if (isStructuredBodyStat) {
      const parsedCount = parseStructuredStatText(strVal).length;
      headerBadgeText = parsedCount > 1 ? `${parsedCount} entries` : "";
    } else {
      headerBadgeText = strVal;
    }
    const valBadge = el("strong", headerBadgeText ? "ls-chip ls-chip-accent" : "", headerBadgeText);
    if (headerBadgeText)
      right.append(valBadge);
    right.append(iconBtn("edit", () => openStatSchemaModal(ctrl, schema.scope, schema), {
      className: "ls-btn-sm ls-btn-icon ls-btn-ghost",
      title: `Edit "${schema.label}" style, tab & prompt`
    }));
    top.append(right);
    cell.append(top);
    if (typeof val === "number" && isCalibrated && !isStructuredBodyStat && schema.kind !== "currency") {
      const anchorLbl = resolveAnchorLabel(schema.anchors, val);
      if (anchorLbl) {
        cell.append(el("small", "ls-muted", anchorLbl));
      }
    } else if (!isCalibrated && !isRpgRichKind) {
      cell.append(el("small", "ls-muted", "Calibrates automatically on turn sync"));
    }
    if (schema.kind === "skill_tree") {
      cell.append(renderSkillTreeWidget(schema, val, isLocked, (nextSerialized, reason) => {
        ctrl.request("state:mutate", {
          patch: {
            stats: {
              [schema.id]: { op: "set", value: nextSerialized, reason }
            }
          },
          reason
        });
      }));
    } else if (schema.kind === "xp_level") {
      cell.append(renderXpLevelWidget(schema, val));
    } else if (schema.kind === "attributes") {
      cell.append(renderAttributesWidget(schema, val, `player:${ctrl.chatId}`));
    } else if (schema.kind === "inventory") {
      cell.append(renderInventoryWidget(val));
    } else if (schema.kind === "status_fx") {
      cell.append(renderStatusFxWidget(val));
    } else if (schema.kind === "hearts") {
      cell.append(renderHeartsWidget(schema, Number(val) || 0, isCalibrated, isLocked, (nextVal) => mutateStat(schema, nextVal, "set")));
    } else if (schema.kind === "currency") {
      cell.append(renderCurrencyWidget(schema, val, delta));
    } else if (isStructuredBodyStat && isCalibrated && strVal && strVal !== "None") {
      cell.append(renderStructuredTextStatBody(strVal, schema.displayStyle ?? "auto"));
    } else if (schema.kind === "clock") {
      const segs = Math.max(2, Math.min(16, schema.max || 6));
      const cur = isCalibrated ? Math.max(0, Math.min(segs, Math.round(Number(val) || 0))) : 0;
      const clockBar = el("div", "ls-clock-bar");
      clockBar.style.gridTemplateColumns = `repeat(${segs}, 1fr)`;
      for (let i = 1;i <= segs; i++) {
        const seg = el("span", `ls-clock-seg${i <= cur ? " is-filled" : ""}`);
        seg.addEventListener("click", () => mutateStat(schema, i === cur ? i - 1 : i, "set"));
        clockBar.append(seg);
      }
      cell.append(clockBar);
    } else if (schema.kind === "pips") {
      const maxPips = Math.max(1, Math.min(12, schema.max || 5));
      const curPips = isCalibrated ? Math.max(0, Math.min(maxPips, Math.round(Number(val) || 0))) : 0;
      const pipRow = el("div", "ls-row");
      for (let i = 1;i <= maxPips; i++) {
        pipRow.append(btn(i <= curPips ? "◆" : "◇", () => mutateStat(schema, i === curPips ? i - 1 : i, "set"), "ls-btn-sm ls-btn-icon"));
      }
      cell.append(pipRow);
    } else if (!isStructuredBodyStat && (schema.kind === "meter" || schema.kind === "number")) {
      const numVal = typeof val === "number" ? val : Number(schema.defaultValue) || 0;
      const span = Math.max(1, schema.max - schema.min);
      const track = el("div", "ls-bar-track");
      const fill = el("div", "ls-bar-fill");
      if (schema.min < 0 && schema.max > 0) {
        track.dataset.bipolar = "true";
        const zeroPct = (0 - schema.min) / span * 100;
        if (numVal >= 0) {
          fill.style.marginLeft = `${zeroPct.toFixed(1)}%`;
          fill.style.width = `${Math.min(100 - zeroPct, numVal / schema.max * (100 - zeroPct)).toFixed(1)}%`;
        } else {
          const wPct = Math.abs(numVal) / Math.abs(schema.min) * zeroPct;
          fill.style.marginLeft = `${Math.max(0, zeroPct - wPct).toFixed(1)}%`;
          fill.style.width = `${Math.min(zeroPct, wPct).toFixed(1)}%`;
          fill.style.background = "var(--ls-danger)";
        }
      } else {
        const pct = Math.max(0, Math.min(100, Math.round((numVal - schema.min) / span * 100)));
        fill.style.width = `${pct}%`;
      }
      track.append(fill);
      cell.append(track);
      if (interactiveSliders && compScope && ctrl.ctx.components?.mountRangeSlider) {
        const sliderSlot = el("div");
        cell.append(sliderSlot);
        try {
          compScope.track(ctrl.ctx.components.mountRangeSlider(sliderSlot, {
            min: schema.min,
            max: schema.max,
            step: schema.step || 1,
            integer: true,
            value: numVal,
            disabled: isLocked,
            onDragValue: (v) => {
              if (v !== null)
                valBadge.textContent = String(v);
            },
            onCommit: (v) => mutateStat(schema, v, "set")
          }));
        } catch {}
      }
    }
    bindContextMenuWithLongPress(ctrl.ctx, cell, () => [
      {
        key: "pin",
        label: schema.pinnedToHeader ? "\uD83D\uDCCC Unpin from Header" : "\uD83D\uDCCD Pin to Header",
        active: schema.pinnedToHeader
      },
      {
        key: "lock",
        label: isLocked ? "\uD83D\uDD13 Unlock Stat" : "\uD83D\uDD12 Lock Stat",
        active: isLocked
      },
      { key: "edit", label: "✏️ Edit Stat Schema, Visual Style & Routing" },
      { key: "duplicate", label: "\uD83D\uDCCB Duplicate to Another Scope / Tab…" },
      { key: "test", label: "\uD83E\uDDEA Test in AI Sandbox" },
      { key: "div", label: "", type: "divider" },
      { key: "delete", label: "\uD83D\uDDD1️ Delete Stat", danger: true }
    ], (selectedKey) => {
      if (selectedKey === "pin") {
        const nextStats = template.stats.map((s) => s.id === schema.id ? { ...s, pinnedToHeader: !s.pinnedToHeader, showIn: { ...s.showIn, pinnedHeader: !s.pinnedToHeader } } : s);
        ctrl.request("state:mutate", { templatePatch: { stats: nextStats } });
      } else if (selectedKey === "lock") {
        const nextStats = template.stats.map((s) => s.id === schema.id ? { ...s, locked: !isLocked } : s);
        ctrl.request("state:mutate", { templatePatch: { stats: nextStats } });
      } else if (selectedKey === "edit") {
        openStatSchemaModal(ctrl, schema.scope, schema);
      } else if (selectedKey === "duplicate") {
        openDuplicateStatModal(ctrl, schema);
      } else if (selectedKey === "test") {
        openSandboxTesterModal(ctrl, schema.id);
      } else if (selectedKey === "delete") {
        const nextStats = template.stats.filter((s) => s.id !== schema.id);
        ctrl.request("state:mutate", { templatePatch: { stats: nextStats } });
      }
    });
    renderedCells.push({
      cell,
      spanMode,
      autoSpan: !schema.layoutSpan || schema.layoutSpan === "auto"
    });
    grid.append(cell);
  }
  let halfRunCount = 0;
  for (let i = 0;i < renderedCells.length; i++) {
    const item = renderedCells[i];
    if (item.spanMode === "half") {
      halfRunCount++;
      const nextIsFullOrEnd = i === renderedCells.length - 1 || renderedCells[i + 1].spanMode === "full";
      if (nextIsFullOrEnd && halfRunCount % 2 === 1 && item.autoSpan) {
        item.cell.dataset.span = "full";
        halfRunCount = 0;
      }
    } else {
      halfRunCount = 0;
    }
  }
  wrap.append(grid);
  return wrap;
}
function renderStatGridSurface(ctrl, scopeFilter, compScope, interactiveSliders = false) {
  const { template } = ctrl.snapshot;
  const matching = template.stats.filter((s) => s.enabled && s.scope !== "character" && scopeFilter.includes(s.scope));
  return renderStatSchemaCards(ctrl, matching, scopeFilter[0] ?? "player", compScope, interactiveSliders, true);
}
var crossTabAwayOpen = new Map;
function renderCrossTabCharacterStats(ctrl, charSchemas, compScope, interactiveSliders = false) {
  const { state, deltas } = ctrl.snapshot;
  const wrap = el("div", "ls-stack");
  const allActors = Object.values(state.characters);
  const presentActors = allActors.filter((a) => a.present);
  const awayActors = allActors.filter((a) => !a.present);
  const primaryActors = presentActors.length > 0 ? presentActors : awayActors;
  const secondaryAwayActors = presentActors.length > 0 ? awayActors : [];
  if (!allActors.length) {
    wrap.append(el("p", "ls-muted", `${charSchemas.map((s) => `${s.icon} ${s.label}`).join(", ")} will appear here once characters enter the scene.`));
    return wrap;
  }
  for (const schema of charSchemas) {
    const card = el("div", "ls-stat-cell");
    card.style.setProperty("--ls-bar-color", schema.color || "var(--ls-primary)");
    card.dataset.span = "full";
    const head = el("div", "ls-row-between");
    head.append(el("strong", "", `${schema.icon} ${schema.label} (Cast)`), btn("✏️", () => openStatSchemaModal(ctrl, "character", schema), "ls-btn-sm ls-btn-icon", "Customize stat schema & tab"));
    card.append(head);
    const isRpgRichKind = ["skill_tree", "xp_level", "attributes", "inventory", "status_fx"].includes(schema.kind);
    const isTextStat = Boolean(schema.displayStyle && schema.displayStyle !== "auto") || ["text", "tags", "tier"].includes(schema.kind);
    const appendActorCell = (targetGrid, actor) => {
      const entry = actor.meters[schema.id];
      const isCalibrated = Boolean(entry?.calibrated);
      const val = isCalibrated && entry ? entry.value : schema.defaultValue;
      const d = deltas.characterDeltas[actor.id]?.[schema.id] ?? 0;
      if (isRpgRichKind || isTextStat || schema.kind === "boolean" || schema.kind === "hearts" || schema.kind === "currency") {
        const sub = el("div", "ls-cast-mini-meter");
        sub.style.gridColumn = "1 / -1";
        const row = el("div", "ls-row-between");
        row.append(el("small", "ls-muted", `${actor.present ? "\uD83D\uDFE2" : "⚪"} ${actor.name}`), el("small", "", isCalibrated || isRpgRichKind ? "" : "Uncalibrated"));
        sub.append(row);
        if (schema.kind === "skill_tree") {
          sub.append(renderSkillTreeWidget(schema, val, Boolean(schema.locked || entry?.locked), (nextSerialized, reason) => {
            ctrl.request("state:mutate", {
              patch: {
                characters: [{
                  id: actor.id,
                  name: actor.name,
                  meters: { [schema.id]: { op: "set", value: nextSerialized, reason } }
                }]
              },
              reason
            });
          }));
        } else if (schema.kind === "xp_level") {
          sub.append(renderXpLevelWidget(schema, val));
        } else if (schema.kind === "attributes") {
          sub.append(renderAttributesWidget(schema, val, `${actor.id}:${ctrl.chatId}`));
        } else if (schema.kind === "inventory") {
          sub.append(renderInventoryWidget(val));
        } else if (schema.kind === "status_fx") {
          sub.append(renderStatusFxWidget(val));
        } else if (schema.kind === "hearts") {
          sub.append(renderHeartsWidget(schema, Number(val) || 0, isCalibrated, Boolean(schema.locked || entry?.locked)));
        } else if (schema.kind === "currency") {
          sub.append(renderCurrencyWidget(schema, val, d));
        } else {
          sub.append(isCalibrated ? renderStructuredTextStatBody(String(val ?? ""), schema.displayStyle ?? "auto") : el("small", "ls-muted", "—"));
        }
        targetGrid.append(sub);
        return;
      }
      const numVal = isCalibrated && typeof val === "number" ? val : 0;
      const span = Math.max(1, schema.max - schema.min);
      const pct = isCalibrated ? Math.max(0, Math.min(100, Math.round((numVal - schema.min) / span * 100))) : 0;
      const tier = isCalibrated ? resolveAnchorLabel(schema.anchors, numVal) : "";
      const mini = el("div", "ls-cast-mini-meter");
      if (tier)
        mini.title = `${actor.name} · ${schema.label}: ${numVal} (${tier})`;
      const topRow = el("div", "ls-row-between");
      topRow.append(el("small", "ls-muted", `${actor.present ? "\uD83D\uDFE2" : "⚪"} ${actor.name}`));
      const valCluster = el("div", "ls-row");
      if (d !== 0) {
        valCluster.append(el("span", `ls-delta ${d > 0 ? "is-pos" : "is-neg"}`, d > 0 ? `+${d}` : String(d)));
      }
      const valLabel = el("strong", "", isCalibrated ? schema.kind === "clock" || schema.kind === "pips" ? `${numVal}/${schema.max}` : String(numVal) : "—");
      valCluster.append(valLabel);
      topRow.append(valCluster);
      const track = el("div", "ls-bar-track");
      const fill = el("div", "ls-bar-fill");
      fill.style.width = `${pct}%`;
      track.append(fill);
      mini.append(topRow, track);
      if (interactiveSliders && compScope && ctrl.ctx.components?.mountRangeSlider) {
        const sliderSlot = el("div");
        mini.append(sliderSlot);
        try {
          compScope.track(ctrl.ctx.components.mountRangeSlider(sliderSlot, {
            min: schema.min,
            max: schema.max,
            step: schema.step || 1,
            integer: true,
            value: numVal,
            disabled: Boolean(schema.locked || entry?.locked),
            onDragValue: (v) => {
              if (v !== null)
                valLabel.textContent = String(v);
            },
            onCommit: (v) => {
              ctrl.request("state:mutate", {
                patch: {
                  characters: [
                    {
                      id: actor.id,
                      name: actor.name,
                      meters: {
                        [schema.id]: { op: "set", value: v, reason: "Manual UI adjustment" }
                      }
                    }
                  ]
                },
                reason: `Updated ${actor.name} ${schema.label} to ${v}`
              });
            }
          }));
        } catch {}
      }
      targetGrid.append(mini);
    };
    const grid = el("div", "ls-cast-mini-grid");
    for (const actor of primaryActors) {
      appendActorCell(grid, actor);
    }
    card.append(grid);
    if (secondaryAwayActors.length > 0) {
      const det = el("details", "ls-stat-acc");
      det.open = crossTabAwayOpen.get(schema.id) ?? false;
      det.addEventListener("toggle", () => {
        crossTabAwayOpen.set(schema.id, det.open);
      });
      const sum = el("summary", "ls-stat-acc-head");
      sum.append(el("small", "ls-muted", `⚪ Away (${secondaryAwayActors.length}): ${secondaryAwayActors.map((a) => a.name).join(", ")}`), el("small", "ls-muted", "▾"));
      const body = el("div", "ls-stat-acc-body");
      const awayGrid = el("div", "ls-cast-mini-grid");
      for (const awayActor of secondaryAwayActors) {
        appendActorCell(awayGrid, awayActor);
      }
      body.append(awayGrid);
      det.append(sum, body);
      card.append(det);
    }
    wrap.append(card);
  }
  return wrap;
}
function renderStatsForSurfaceTab(ctrl, surface, tabId, compScope, interactiveSliders = false) {
  const { template } = ctrl.snapshot;
  const matching = template.stats.filter((s) => {
    if (!s.enabled)
      return false;
    if (surface === "widget" && s.showIn?.widget === false)
      return false;
    if (surface === "inline" && s.showIn?.inline === false)
      return false;
    const fallbackTab = s.scope === "character" ? "cast" : s.tabId;
    const assigned = surface === "widget" ? s.widgetTabId || fallbackTab : s.inlineTabId || fallbackTab;
    const extraTabs = surface === "widget" ? s.extraWidgetTabIds : s.extraInlineTabIds;
    return assigned === tabId || Boolean(extraTabs?.includes(tabId));
  });
  const nonCharMatching = matching.filter((s) => s.scope !== "character");
  const charMatching = matching.filter((s) => s.scope === "character");
  const defaultScope = tabId === "world" ? "world" : "player";
  const combined = el("div", "ls-stack");
  const coreEl = renderCorePlayerAndSceneCards(ctrl, surface, tabId);
  if (coreEl.childElementCount > 0)
    combined.append(coreEl);
  if (nonCharMatching.length > 0 || charMatching.length === 0 && combined.childElementCount === 0) {
    combined.append(renderStatSchemaCards(ctrl, nonCharMatching, defaultScope, compScope, interactiveSliders, true));
  }
  if (charMatching.length > 0) {
    combined.append(renderCrossTabCharacterStats(ctrl, charMatching, compScope, interactiveSliders));
  }
  if (tabId === "world") {
    const worldExtras = renderWorldQuestsAndDispatches(ctrl);
    if (worldExtras.childElementCount > 0)
      combined.append(worldExtras);
  }
  return combined;
}
function renderCorePlayerAndSceneCards(ctrl, surface, tabId = "stats") {
  const { state, template } = ctrl.snapshot;
  const core = template.coreTrackers;
  const wrap = el("div", "ls-stat-grid");
  const addCoreCell = (trackerId, value, defaultStructured) => {
    const cfg = resolveBuiltInTrackerConfig(core, trackerId);
    if (!cfg.enabled)
      return;
    if (surface !== "drawer" && !cfg.showCard)
      return;
    if (surface === "widget" && cfg.widgetTabId && cfg.widgetTabId !== tabId)
      return;
    if (surface === "inline" && cfg.inlineTabId && cfg.inlineTabId !== tabId)
      return;
    const cell = el("div", "ls-stat-cell");
    cell.style.setProperty("--ls-bar-color", cfg.color || "var(--ls-primary)");
    cell.dataset.locked = String(Boolean(cfg.locked));
    const spanMode = cfg.layoutSpan === "half" || cfg.layoutSpan === "full" ? cfg.layoutSpan : value.length > 48 || /->|→|\n|;/.test(value) ? "full" : "half";
    cell.dataset.span = spanMode;
    const top = el("div", "ls-row-between");
    top.append(el("strong", "", `${cfg.icon || "\uD83D\uDCCA"} ${cfg.label}`), el("div", "ls-row"));
    top.lastElementChild.append(iconBtn("sliders", () => openBuiltinTrackerModal(ctrl, trackerId), {
      className: "ls-btn-sm ls-btn-icon ls-btn-ghost",
      title: `Full Edit "${cfg.label}" (Prompt, Style, Tab & Color)`
    }), iconBtn("edit", () => openSceneBannerModal(ctrl), {
      className: "ls-btn-sm ls-btn-icon ls-btn-ghost",
      title: `Edit ${cfg.label} value`
    }));
    const style = cfg.displayStyle ?? "auto";
    const useStructured = style !== "auto" || defaultStructured || /->|→|\n|;/.test(value);
    cell.append(top, useStructured ? renderStructuredTextStatBody(value, style) : el("p", "", value));
    wrap.append(cell);
  };
  if (state.player.condition && state.player.condition !== "Normal") {
    addCoreCell("player_condition", state.player.condition, true);
  }
  if (state.player.attire) {
    addCoreCell("player_attire", state.player.attire, false);
  }
  if (state.player.notableAction) {
    addCoreCell("player_action", state.player.notableAction, false);
  }
  if (surface !== "drawer" && state.scene.beatSummary) {
    addCoreCell("scene_summary", state.scene.beatSummary, false);
  }
  return wrap;
}
function renderWorldQuestsAndDispatches(ctrl) {
  const { state, template } = ctrl.snapshot;
  const core = template.coreTrackers;
  const wrap = el("div", "ls-stack");
  const qCfg = resolveBuiltInTrackerConfig(core, "quests");
  const dCfg = resolveBuiltInTrackerConfig(core, "dispatches");
  const quests = Object.values(state.quests);
  if (qCfg.enabled && !qCfg.deleted && core?.showQuestsInWidget !== false && quests.length > 0) {
    const qCard = el("div", "ls-stat-cell");
    qCard.dataset.span = "full";
    qCard.append(el("strong", "", `${qCfg.icon || "\uD83C\uDFAF"} ${qCfg.label} (${quests.filter((q) => q.status === "active").length})`));
    for (const q of quests) {
      const box = el("div", "ls-stack");
      box.style.gap = "3px";
      box.append(el("small", "ls-kicker", `${q.title} (${q.status})`));
      for (const [idx, obj] of q.objectives.entries()) {
        const row = el("label", "ls-row");
        const chk = el("input");
        chk.type = "checkbox";
        chk.checked = obj.completed;
        chk.addEventListener("change", () => {
          const nextObjs = q.objectives.map((o, i) => i === idx ? { ...o, completed: chk.checked } : o);
          const allDone = nextObjs.every((o) => o.completed);
          ctrl.request("state:mutate", {
            patch: {
              quests: [{ id: q.id, title: q.title, status: allDone ? "completed" : "active", objectives: nextObjs }]
            }
          });
        });
        row.append(chk, el("small", obj.completed ? "ls-muted" : "", obj.text));
        box.append(row);
      }
      qCard.append(box);
    }
    wrap.append(qCard);
  }
  if (dCfg.enabled && !dCfg.deleted && core?.showDispatchesInWidget !== false && state.dispatches.length > 0) {
    const dCard = el("div", "ls-stat-cell");
    dCard.dataset.span = "full";
    dCard.append(el("strong", "", `${dCfg.icon || "\uD83D\uDCE1"} ${dCfg.label} (${state.dispatches.length})`));
    for (const disp of [...state.dispatches].reverse().slice(0, 3)) {
      const item = el("div", "ls-bond-dir-box");
      item.append(el("strong", "", `${disp.title} · \uD83D\uDCCD ${disp.locationName}`), el("small", "ls-muted", disp.summary));
      dCard.append(item);
    }
    wrap.append(dCard);
  }
  return wrap;
}

// src/frontend/surfaces/FloatingHud.ts
function openWidgetResizeModal(ctrl) {
  const { theme } = ctrl.snapshot.template;
  ctrl.modals.open({ title: "\uD83D\uDCD0 Widget & Pill Size Customizer (Any Extreme)", width: 520 }, (body, close) => {
    let w = theme.widgetWidth ?? 460;
    let h = theme.widgetHeight ?? 540;
    let pw = theme.pillWidth ?? 420;
    let ph = theme.pillHeight ?? 92;
    const presetsCard = el("div", "ls-card");
    presetsCard.append(el("span", "ls-kicker", "1-Click Widget Size Presets"));
    const pRow = el("div", "ls-row");
    for (const [lbl, pwVal, phVal] of [
      ["Micro (280×240)", 280, 240],
      ["Compact (380×420)", 380, 420],
      ["Standard (460×540)", 460, 540],
      ["Wide (680×560)", 680, 560],
      ["Theater (920×720)", 920, 720],
      ["Extreme Max (1180×860)", 1180, 860]
    ]) {
      pRow.append(btn(lbl, () => {
        w = pwVal;
        h = phVal;
        wInp.value = String(w);
        hInp.value = String(h);
        ctrl.widgetExpanded = true;
        ctrl.onResizeWidgetLive?.(w, h, true);
      }, "ls-btn-sm"));
    }
    const tabsModeRow = el("div", "ls-row");
    tabsModeRow.append(el("small", "ls-muted", "Widget Tabs:"));
    for (const [iconOnlyVal, lbl] of [
      [false, "\uD83C\uDFF7️ Icons + Labels"],
      [true, "✨ Icons Only"]
    ]) {
      const b = btn(lbl, () => {
        ctrl.request("state:mutate", {
          templatePatch: {
            theme: { ...ctrl.snapshot.template.theme, widgetTabsIconOnly: iconOnlyVal }
          },
          reason: `Set widget tabs to ${iconOnlyVal ? "icons only" : "icons + labels"}`
        });
      }, "ls-btn-sm");
      if (Boolean(ctrl.snapshot.template.theme.widgetTabsIconOnly) === iconOnlyVal) {
        b.setAttribute("aria-current", "page");
      }
      tabsModeRow.append(b);
    }
    presetsCard.append(pRow, tabsModeRow);
    const grid = el("div", "ls-grid");
    const wWrap = el("label", "ls-label", "Expanded Width (240–1200 px)");
    const wInp = el("input", "ls-input");
    wInp.type = "number";
    wInp.min = "240";
    wInp.max = "1200";
    wInp.value = String(w);
    wWrap.append(wInp);
    const hWrap = el("label", "ls-label", "Expanded Height (180–900 px)");
    const hInp = el("input", "ls-input");
    hInp.type = "number";
    hInp.min = "180";
    hInp.max = "900";
    hInp.value = String(h);
    hWrap.append(hInp);
    const pwWrap = el("label", "ls-label", "Collapsed Pill Width (220–960 px)");
    const pwInp = el("input", "ls-input");
    pwInp.type = "number";
    pwInp.min = "220";
    pwInp.max = "960";
    pwInp.value = String(pw);
    pwWrap.append(pwInp);
    const phWrap = el("label", "ls-label", "Collapsed Pill Height (56–220 px)");
    const phInp = el("input", "ls-input");
    phInp.type = "number";
    phInp.min = "56";
    phInp.max = "220";
    phInp.value = String(ph);
    phWrap.append(phInp);
    grid.append(wWrap, hWrap, pwWrap, phWrap);
    const applyBtn = btn("\uD83D\uDCBE Apply & Save Dimensions", () => {
      const nextW = Math.max(240, Math.min(1200, Number(wInp.value) || 460));
      const nextH = Math.max(180, Math.min(900, Number(hInp.value) || 540));
      const nextPW = Math.max(220, Math.min(960, Number(pwInp.value) || 420));
      const nextPH = Math.max(56, Math.min(220, Number(phInp.value) || 92));
      ctrl.request("state:mutate", {
        templatePatch: {
          theme: {
            ...ctrl.snapshot.template.theme,
            widgetWidth: nextW,
            widgetHeight: nextH,
            pillWidth: nextPW,
            pillHeight: nextPH
          }
        },
        reason: `Resized widget (${nextW}×${nextH})`
      });
      if (ctrl.widgetExpanded) {
        ctrl.onResizeWidgetLive?.(nextW, nextH, false);
      } else {
        ctrl.onResizeWidgetLive?.(nextPW, nextPH, false);
      }
      close();
    }, "ls-btn-primary");
    body.append(presetsCard, grid, applyBtn);
  });
}
function buildGameStatusPillStrip(ctrl, options) {
  const { state, template, deltas } = ctrl.snapshot;
  const show = template.theme.showSceneChips;
  const banner = formatSceneBanner(state);
  const main = el("div", "ls-game-pill-main");
  if (show.location && !options?.omitLocation) {
    main.append(el("span", "ls-chip ls-chip-accent", `\uD83D\uDCCD ${banner.location}`));
  }
  if (show.time) {
    main.append(el("span", "ls-chip", `\uD83D\uDD70️ ${banner.time}`));
  }
  if (show.date && banner.date) {
    main.append(el("span", "ls-chip", `\uD83D\uDCC5 ${banner.date}`));
  }
  if (show.weather && banner.weather && banner.weather !== "Clear") {
    main.append(el("span", "ls-chip", `\uD83C\uDF26️ ${banner.weather}`));
  }
  const presentActors = Object.values(state.characters).filter((c) => c.present);
  if (show.cast && presentActors.length > 0) {
    const stack = el("div", "ls-avatar-stack");
    stack.title = `In Scene: ${presentActors.map((a) => a.name).join(", ")}`;
    for (const actor of presentActors.slice(0, 4)) {
      const item = el("span", "ls-avatar-stack-item");
      if (actor.portraitUrl) {
        const img = el("img");
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
  const pinnedSchemas = show.pinnedStats ? template.stats.filter((s) => s.enabled && (s.pinnedToHeader || s.showIn?.pinnedHeader)) : [];
  for (const schema of pinnedSchemas.slice(0, 3)) {
    const isChar = schema.scope === "character";
    const firstPresent = presentActors[0] ?? Object.values(state.characters)[0];
    const runtime = isChar ? firstPresent?.meters[schema.id] : state.stats[schema.id];
    if (!runtime?.calibrated)
      continue;
    const val = runtime.value;
    const d = isChar ? firstPresent ? deltas.characterDeltas[firstPresent.id]?.[schema.id] ?? 0 : 0 : deltas.statDeltas[schema.id] ?? 0;
    if (typeof val === "number" && schema.kind !== "currency") {
      const gauge = el("div", "ls-pill-gauge");
      gauge.style.setProperty("--ls-bar-color", schema.color || "var(--ls-primary)");
      const top = el("div", "ls-pill-gauge-top");
      top.append(el("span", "", `${schema.icon} ${isChar && firstPresent ? firstPresent.name.split(" ")[0] : schema.label}`), el("span", "", `${val}${d !== 0 ? d > 0 ? ` +${d}` : ` ${d}` : ""}`));
      const track = el("div", "ls-pill-gauge-track");
      const fill = el("div", "ls-bar-fill");
      const span = Math.max(1, schema.max - schema.min);
      const pct = Math.max(0, Math.min(100, Math.round((val - schema.min) / span * 100)));
      fill.style.width = `${pct}%`;
      track.append(fill);
      gauge.append(top, track);
      main.append(gauge);
    } else {
      main.append(el("span", "ls-chip", `${schema.icon} ${isChar && firstPresent ? `${firstPresent.name}: ` : ""}${String(val)}`));
    }
  }
  return main;
}
function renderFloatingHudSurface(ctrl, compact, onToggleCompact, onOpenDossier, onOpenStudio, compScope) {
  const { state, template } = ctrl.snapshot;
  const hud = el("section", "ls-hud");
  ctrl.stampThemeOnElement(hud);
  const openHudMenu = async (e) => {
    const fallback = () => openQuickTemplateModal(ctrl, onOpenStudio);
    if (typeof ctrl.ctx.ui?.showContextMenu !== "function") {
      fallback();
      return;
    }
    const { selectedKey } = await ctrl.ctx.ui.showContextMenu({
      position: { x: e.clientX, y: e.clientY },
      items: [
        { key: "edit_scene", label: "Edit Scene Values (Location, Time, Date)" },
        { key: "pill_prompts", label: "Edit Scene Pill AI Prompts & Chips" },
        { key: "div1", label: "", type: "divider" },
        { key: "template", label: `Switch Template & Skin (${template.name})` },
        { key: "resize", label: "Resize Floating Widget" },
        { key: "studio", label: "Open Full Settings Studio" }
      ]
    });
    if (selectedKey === "edit_scene")
      openSceneBannerModal(ctrl);
    else if (selectedKey === "pill_prompts")
      openScenePillEditorModal(ctrl);
    else if (selectedKey === "template")
      openQuickTemplateModal(ctrl, onOpenStudio);
    else if (selectedKey === "resize")
      openWidgetResizeModal(ctrl);
    else if (selectedKey === "studio")
      onOpenStudio();
  };
  const buildActionCluster = () => {
    const row = el("div", "ls-row");
    const syncBtn = iconBtn("sync", () => void ctrl.request("track:manual"), {
      className: "ls-btn-sm ls-btn-icon ls-btn-ghost",
      title: ctrl.busy ? "Calibrating…" : "Sync & calibrate current turn"
    });
    syncBtn.disabled = ctrl.busy;
    const stageBtn = iconBtn("stage", () => ctrl.toggleVnStage(), {
      className: "ls-btn-sm ls-btn-icon ls-btn-ghost",
      title: "Launch 2D Visual Novel Stage & Voices"
    });
    const moreBtn = iconBtn("more", (e) => void openHudMenu(e), {
      className: "ls-btn-sm ls-btn-icon ls-btn-ghost",
      title: "Scene Pill Prompts, Template Switcher, Resize & Studio"
    });
    const studioBtn = iconBtn("settings", () => {
      console.log("[LumiStats FloatingHud] ⚙️ studio button clicked");
      onOpenStudio();
    }, {
      className: "ls-btn-sm ls-btn-icon ls-btn-ghost",
      title: "Open Lumi Stats Studio"
    });
    const toggleBtn = iconBtn(compact ? "chevronDown" : "chevronUp", onToggleCompact, {
      label: compact ? "Expand" : "Pill",
      className: "ls-btn-sm ls-btn-primary",
      title: compact ? "Expand Floating HUD" : "Collapse to Status Pill"
    });
    row.append(syncBtn, stageBtn, moreBtn, studioBtn, toggleBtn);
    return row;
  };
  if (compact) {
    const pillSkin = template.theme.pillStyle || "glass_capsule";
    const show = template.theme.showSceneChips;
    const banner = formatSceneBanner(state);
    const pill = el("div", "ls-hud-pill");
    pill.dataset.pillSkin = pillSkin;
    pill.addEventListener("click", (e) => {
      if (e.target instanceof Element && e.target.closest("button"))
        return;
      onToggleCompact();
    });
    const topRow = el("div", "ls-row-between ls-pill-top-deck");
    const titleBadge = el("span", "ls-hud-title-badge");
    const liveDot = el("span", "ls-pill-live-dot");
    const baseLabel = show.location ? state.scene.location || state.title || "Lumi Stats" : state.title || template.name || "Lumi Stats";
    const titleText = pillSkin === "cyber_telemetry" ? `${show.location ? "LOC" : "HUD"} // ${baseLabel.toUpperCase()}` : pillSkin === "ledger_strip" && show.date ? `${banner.date} · ${baseLabel}` : baseLabel;
    titleBadge.append(liveDot, el("span", "", template.icon || "✨"), el("span", "ls-pill-title-text", titleText));
    const actionsEl = buildActionCluster();
    actionsEl.classList.add("ls-pill-actions");
    topRow.append(titleBadge, actionsEl);
    pill.append(topRow);
    let hasBottomDeck = false;
    if (pillSkin !== "compact_badge") {
      if (state.initialized) {
        const strip = buildGameStatusPillStrip(ctrl, { omitLocation: true });
        if (strip.childElementCount > 0) {
          strip.classList.add("ls-pill-bottom-deck");
          pill.append(strip);
          hasBottomDeck = true;
        }
      } else if (ctrl.chatId) {
        const bootRow = el("div", "ls-row ls-pill-bottom-deck");
        bootRow.append(btn("Calibrate World Now", () => void ctrl.request("track:manual"), "ls-btn-sm ls-btn-primary"), btn("Studio", onOpenStudio, "ls-btn-sm"));
        pill.append(bootRow);
        hasBottomDeck = true;
      }
    }
    pill.dataset.emptyDeck = String(!hasBottomDeck);
    hud.append(pill);
    return hud;
  }
  const enabledTabs = [...template.surfaces.widgetTabs].filter((t) => t.enabled && (t.kind !== "web" || template.surfaces.showRelationshipWeb !== false)).sort((a, b) => a.order - b.order);
  const activeTab = enabledTabs.find((t) => t.id === ctrl.activeSurfaceTab) ?? enabledTabs[0] ?? {
    id: "stats",
    label: "Stats",
    icon: "\uD83D\uDCCA",
    kind: "stats",
    enabled: true,
    order: 0
  };
  const headerBar = el("nav", "ls-hud-header-bar");
  const topMetaRow = el("div", "ls-hud-top-row");
  const titleBtn = btn(`${template.icon} ${state.scene.location || state.title || "Lumi Stats"}`, () => openScenePillEditorModal(ctrl), "ls-btn-sm ls-btn-ghost ls-hud-title-badge", "Click to customize Scene Pill prompt & visible chips");
  topMetaRow.append(titleBtn, buildActionCluster());
  const iconOnlyTabs = Boolean(template.theme.widgetTabsIconOnly);
  const tabsRow = el("div", "ls-hud-tabs-scroll");
  const hasRealEmojiOrSymbol = (s) => /[^\w\s]/u.test(s.trim());
  for (const tab of enabledTabs) {
    const countSuffix = tab.kind === "cast" ? ` (${Object.keys(state.characters).length})` : tab.kind === "map" ? ` (${Object.keys(state.places).length})` : "";
    const fullLabel = `${tab.label}${countSuffix}`;
    const showIconOnly = iconOnlyTabs && hasRealEmojiOrSymbol(tab.icon);
    const b = btn(showIconOnly ? tab.icon : `${tab.icon} ${fullLabel}`, () => {
      ctrl.activeSurfaceTab = tab.id;
      ctrl.emitChange();
    }, `ls-btn-sm${showIconOnly ? " ls-hud-tab-icon-only" : ""}`, fullLabel);
    if (tab.id === activeTab.id)
      b.setAttribute("aria-current", "page");
    tabsRow.append(b);
  }
  headerBar.append(topMetaRow, tabsRow);
  hud.append(headerBar);
  const content = el("div", "ls-hud-content");
  if (!state.initialized) {
    const empty = el("div", "ls-card");
    empty.append(el("strong", "", ctrl.chatId ? "Ready to calibrate this story" : "Open a chat to begin"), el("p", "ls-muted", "Send a message for automatic two-phase calibration, or click below to calibrate now:"));
    if (ctrl.chatId) {
      empty.append(btn("✨ Calibrate Stats Now", () => void ctrl.request("track:manual"), "ls-btn-primary"));
    }
    content.append(empty);
    hud.append(content);
    return hud;
  }
  if (template.surfaces.customWidgetHtml) {
    const customBanner = el("div", "ls-card");
    content.append(customBanner);
    mountSanitizedHtml(customBanner, interpolateBannerTemplate(template.surfaces.customWidgetHtml, state), ctrl.ctx);
  }
  if (state.modifiers.length > 0 && activeTab.kind === "stats") {
    const modRow = el("div", "ls-row");
    for (const mod of state.modifiers) {
      const fx = el("span", "ls-rpg-fx-pill", `${mod.delta >= 0 ? "▲" : "▼"} ${mod.label} (${mod.delta >= 0 ? `+${mod.delta}` : mod.delta}${mod.remainingTurns ? ` · ${mod.remainingTurns}t` : ""})`);
      fx.dataset.fxKind = mod.delta >= 0 ? "buff" : "debuff";
      modRow.append(fx);
    }
    content.append(modRow);
  }
  if (activeTab.kind === "cast") {
    content.append(renderSurfaceCastRoster(ctrl, "widget", activeTab.id, onOpenDossier));
  } else if (activeTab.kind === "web") {
    content.append(renderRelationshipWebSurface(ctrl, onOpenDossier));
  } else if (activeTab.kind === "map") {
    content.append(renderSpatialMapSurface(ctrl));
  } else {
    if (activeTab.customHtml) {
      const box = el("div", "ls-card");
      content.append(box);
      mountSanitizedHtml(box, interpolateBannerTemplate(activeTab.customHtml, state), ctrl.ctx);
    }
    content.append(renderStatsForSurfaceTab(ctrl, "widget", activeTab.id, compScope, false));
  }
  hud.append(content);
  const resizeGrip = el("div", "ls-hud-resize-grip", "◢");
  resizeGrip.title = "Drag to resize widget to any size";
  resizeGrip.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || !ctrl.onResizeWidgetLive)
      return;
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
    } catch {}
    const onMove = (me) => {
      const dx = (me.clientX - startX) / uiScale;
      const dy = (me.clientY - startY) / uiScale;
      curW = Math.max(240, Math.min(1200, Math.round(startW + dx)));
      curH = Math.max(180, Math.min(900, Math.round(startH + dy)));
      ctrl.onResizeWidgetLive?.(curW, curH, false);
    };
    const onUp = (ue) => {
      resizeGrip.removeEventListener("pointermove", onMove);
      resizeGrip.removeEventListener("pointerup", onUp);
      resizeGrip.removeEventListener("pointercancel", onUp);
      try {
        resizeGrip.releasePointerCapture(ue.pointerId);
      } catch {}
      ctrl.onResizeWidgetLive?.(curW, curH, true);
    };
    resizeGrip.addEventListener("pointermove", onMove);
    resizeGrip.addEventListener("pointerup", onUp);
    resizeGrip.addEventListener("pointercancel", onUp);
  });
  hud.append(resizeGrip);
  return hud;
}

// src/frontend/surfaces/InlineRibbon.ts
function renderSceneHeaderChips(ctrl) {
  const { state, template, deltas } = ctrl.snapshot;
  const show = template.theme.showSceneChips;
  const banner = formatSceneBanner(state);
  const row = el("div", "ls-row");
  if (show.time)
    row.append(el("span", "ls-chip", `\uD83D\uDD70️ ${banner.time}`));
  if (show.date)
    row.append(el("span", "ls-chip", `\uD83D\uDCC5 ${banner.date}`));
  if (show.location)
    row.append(el("span", "ls-chip ls-chip-accent", `\uD83D\uDCCD ${banner.location}`));
  if (show.weather)
    row.append(el("span", "ls-chip", `\uD83C\uDF26️ ${banner.weather}`));
  if (template.coreTrackers?.trackPlayerAttire !== false && state.player.attire) {
    row.append(el("span", "ls-chip", `\uD83D\uDC55 You: ${state.player.attire.slice(0, 28)}`));
  }
  if (show.cast) {
    const showDem = isDossierFieldEnabled(template, "demeanor");
    for (const actor of Object.values(state.characters).filter((c) => c.present).slice(0, 4)) {
      const charDeltas = deltas.characterDeltas[actor.id] ?? {};
      const firstShift = Object.values(charDeltas).find((v) => v !== 0);
      const demVal = showDem ? resolveCharacterFieldValue(actor, "demeanor") : "";
      const chip = el("span", "ls-chip", `\uD83D\uDC64 ${actor.name}${demVal ? ` · ${demVal}` : ""}`);
      if (firstShift) {
        chip.append(el("span", `ls-delta ${firstShift > 0 ? "is-pos" : "is-neg"}`, firstShift > 0 ? `+${firstShift}` : String(firstShift)));
      }
      row.append(chip);
    }
  }
  if (show.pinnedStats) {
    for (const schema of template.stats.filter((s) => s.enabled && (s.pinnedToHeader || s.showIn?.pinnedHeader))) {
      if (schema.scope === "character") {
        const firstPresent = Object.values(state.characters).find((c) => c.present);
        const meter = firstPresent?.meters[schema.id];
        if (!meter?.calibrated)
          continue;
        const d = (firstPresent ? deltas.characterDeltas[firstPresent.id]?.[schema.id] : 0) ?? 0;
        const chip = el("span", "ls-chip ls-chip-accent", `${schema.icon} ${firstPresent.name} ${schema.label}: ${String(meter.value)}`);
        if (d !== 0) {
          chip.append(el("span", `ls-delta ${d > 0 ? "is-pos" : "is-neg"}`, d > 0 ? `+${d}` : String(d)));
        }
        row.append(chip);
      } else {
        const runtime = state.stats[schema.id];
        if (!runtime?.calibrated)
          continue;
        const d = deltas.statDeltas[schema.id] ?? 0;
        const chip = el("span", "ls-chip ls-chip-accent", `${schema.icon} ${schema.label}: ${String(runtime.value)}`);
        if (d !== 0) {
          chip.append(el("span", `ls-delta ${d > 0 ? "is-pos" : "is-neg"}`, d > 0 ? `+${d}` : String(d)));
        }
        row.append(chip);
      }
    }
  }
  return row;
}
function renderInlineRibbonCard(ctrl, onOpenDossier, onOpenStudio) {
  const { state, template } = ctrl.snapshot;
  const host = el("div", "ls-inline-host");
  ctrl.stampThemeOnElement(host);
  const card = el("div", "ls-inline-card");
  if (!ctrl.inlineExpanded) {
    const pillBar = el("div", "ls-inline-pill-bar");
    pillBar.addEventListener("click", () => {
      ctrl.inlineExpanded = true;
      ctrl.emitChange();
    });
    const strip = buildGameStatusPillStrip(ctrl);
    if (strip.childElementCount === 0) {
      strip.append(el("span", "ls-chip ls-chip-accent", `${template.icon || "✨"} ${state.title || template.name || "Lumi Stats"}`));
    }
    pillBar.append(strip, iconBtn("chevronDown", () => {
      ctrl.inlineExpanded = true;
      ctrl.emitChange();
    }, { label: "Expand", className: "ls-btn-sm ls-btn-primary", title: "Expand Inline Ribbon" }));
    card.append(pillBar);
    host.append(card);
    return host;
  }
  if (template.surfaces.customInlineHtml) {
    const customBanner = el("div", "ls-card");
    card.append(customBanner);
    mountSanitizedHtml(customBanner, interpolateBannerTemplate(template.surfaces.customInlineHtml, state), ctrl.ctx);
  }
  const enabledTabs = [...template.surfaces.inlineTabs].filter((t) => t.enabled && (t.kind !== "web" || template.surfaces.showRelationshipWeb !== false)).sort((a, b) => a.order - b.order);
  const activeTab = enabledTabs.find((t) => t.id === ctrl.activeInlineTab) ?? enabledTabs[0] ?? {
    id: "stats",
    label: "Stats",
    icon: "\uD83D\uDCCA",
    kind: "stats",
    enabled: true,
    order: 0
  };
  const topBar = el("div", "ls-row-between");
  const leftCluster = el("div", "ls-row");
  if (enabledTabs.length > 1) {
    for (const tab of enabledTabs) {
      const b = btn(`${tab.icon} ${tab.label}`, () => {
        ctrl.activeInlineTab = tab.id;
        ctrl.emitChange();
      }, "ls-btn-sm");
      if (tab.id === activeTab.id)
        b.setAttribute("aria-current", "page");
      leftCluster.append(b);
    }
  } else {
    leftCluster.append(renderSceneHeaderChips(ctrl));
  }
  const openInlineMore = async (e) => {
    if (typeof ctrl.ctx.ui?.showContextMenu !== "function") {
      openQuickTemplateModal(ctrl, onOpenStudio);
      return;
    }
    const { selectedKey } = await ctrl.ctx.ui.showContextMenu({
      position: { x: e.clientX, y: e.clientY },
      items: [
        { key: "edit_scene", label: "Edit Scene Values" },
        { key: "pill_prompts", label: "Edit Scene Pill Prompts & Chips" },
        { key: "template", label: `Switch Template & Skin (${template.name})` }
      ]
    });
    if (selectedKey === "edit_scene")
      openSceneBannerModal(ctrl);
    else if (selectedKey === "pill_prompts")
      openScenePillEditorModal(ctrl);
    else if (selectedKey === "template")
      openQuickTemplateModal(ctrl, onOpenStudio);
  };
  const rightCluster = el("div", "ls-row");
  rightCluster.append(iconBtn("stage", () => ctrl.toggleVnStage(), {
    className: "ls-btn-sm ls-btn-ghost",
    label: "Stage",
    title: "Launch 2D Visual Novel Stage"
  }), iconBtn("more", (e) => void openInlineMore(e), {
    className: "ls-btn-sm ls-btn-icon ls-btn-ghost",
    title: "Scene Pill, Template & Skin Options"
  }), iconBtn("settings", onOpenStudio, {
    className: "ls-btn-sm ls-btn-icon ls-btn-ghost",
    title: "Open Settings Studio"
  }), iconBtn("chevronUp", () => {
    ctrl.inlineExpanded = false;
    ctrl.emitChange();
  }, { label: "Collapse", className: "ls-btn-sm ls-btn-primary", title: "Collapse Ribbon" }));
  topBar.append(leftCluster, rightCluster);
  card.append(topBar);
  if (activeTab.kind === "cast") {
    card.append(renderSurfaceCastRoster(ctrl, "inline", activeTab.id, onOpenDossier));
  } else if (activeTab.kind === "web") {
    card.append(renderRelationshipWebSurface(ctrl, onOpenDossier));
  } else if (activeTab.kind === "map") {
    card.append(renderSpatialMapSurface(ctrl));
  } else {
    if (activeTab.customHtml) {
      const box = el("div", "ls-card");
      card.append(box);
      mountSanitizedHtml(box, interpolateBannerTemplate(activeTab.customHtml, state), ctrl.ctx);
    }
    card.append(renderStatsForSurfaceTab(ctrl, "inline", activeTab.id));
  }
  host.append(card);
  return host;
}

class InlineRibbonManager {
  ctrl;
  activeMount;
  busyMount;
  retryTimer = null;
  retryAttempts = 0;
  constructor(ctrl) {
    this.ctrl = ctrl;
  }
  clearRetryTimer() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
  }
  clearBusyIndicator() {
    if (!this.busyMount)
      return;
    this.ctrl.ctx.dom.uninject(this.busyMount.wrapper);
    this.busyMount = undefined;
  }
  clear() {
    this.clearRetryTimer();
    this.retryAttempts = 0;
    this.clearBusyIndicator();
    if (!this.activeMount)
      return;
    this.ctrl.ctx.dom.uninject(this.activeMount.wrapper);
    this.activeMount = undefined;
  }
  sync(onOpenDossier, onOpenStudio) {
    const { state, template, revision } = this.ctrl.snapshot;
    if (template.theme.placement === "floating_only") {
      this.clear();
      return;
    }
    const mountedList = this.ctrl.ctx.dom.listMessageElements?.() ?? [];
    const latestId = this.ctrl.ctx.messages.getLatestMessageId() ?? this.ctrl.snapshot.bindings.at(-1)?.messageId ?? mountedList.at(-1)?.messageId;
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
    const messageNode = this.ctrl.ctx.dom.findMessageElement(latestId) ?? mountedList.at(-1)?.element ?? null;
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
        const wrapper = this.ctrl.ctx.dom.inject(bubbleNode, '<div class="ls-calibrating-pill" role="status" aria-live="polite">Calibrating Lumi Stats…</div>', "beforeend");
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
    const pos = template.theme.placement === "inline_top" || template.theme.placement === "both_top" ? "afterbegin" : "beforeend";
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
      this.ctrl.openedCastTabs.join(","),
      this.ctrl.selectedPlaceId,
      this.ctrl.webFilterMode
    ].join(":");
    if (this.activeMount && this.activeMount.messageId === latestId && this.activeMount.pos === pos && this.activeMount.wrapper.isConnected && this.activeMount.renderSig === renderSig) {
      return;
    }
    if (this.activeMount && (this.activeMount.messageId !== latestId || this.activeMount.pos !== pos)) {
      this.ctrl.ctx.dom.uninject(this.activeMount.wrapper);
      this.activeMount = undefined;
    }
    const cardNode = renderInlineRibbonCard(this.ctrl, onOpenDossier, onOpenStudio);
    if (this.activeMount && this.activeMount.wrapper.isConnected) {
      this.activeMount.wrapper.replaceChildren(cardNode);
      this.activeMount.renderSig = renderSig;
      return;
    }
    const wrapper = this.ctrl.ctx.dom.inject(bubbleNode, '<div class="ls-inline-slot"></div>', pos);
    wrapper.replaceChildren(cardNode);
    this.activeMount = { messageId: latestId, wrapper, pos, renderSig };
  }
}

// src/frontend/surfaces/StageAssetStudio.ts
var activeAssetStudioSubTab = "characters";
var selectedStudioCharId = "";
var selectedStudioPlaceId = "";
function inferTimeSlotFromScene(state) {
  const rawLabel = (state.scene.timeLabel || formatStoryClock(state.elapsedMinutes) || "").trim();
  const lower = rawLabel.toLowerCase();
  if (/\b(?:dawn|sunrise|morning|breakfast)\b/.test(lower))
    return "morning";
  if (/\b(?:noon|midday|afternoon|daytime|lunch)\b/.test(lower))
    return "day";
  if (/\b(?:dusk|sunset|evening|twilight|dinner)\b/.test(lower))
    return "evening";
  if (/\b(?:night|midnight|late\s*night|moon)\b/.test(lower))
    return "night";
  const timeMatch = rawLabel.match(/(\d{1,2})\s*:\s*(\d{2})\s*(am|pm)?/i);
  if (timeMatch) {
    let hour = Number(timeMatch[1]);
    const ampm = timeMatch[3]?.toLowerCase();
    if (ampm === "pm" && hour < 12)
      hour += 12;
    if (ampm === "am" && hour === 12)
      hour = 0;
    if (hour >= 5 && hour < 11)
      return "morning";
    if (hour >= 11 && hour < 17)
      return "day";
    if (hour >= 17 && hour < 20)
      return "evening";
    return "night";
  }
  const totalMinutes = (Math.max(0, Math.round(state.elapsedMinutes)) + 8 * 60) % 1440;
  const hour24 = Math.floor(totalMinutes / 60);
  if (hour24 >= 5 && hour24 < 11)
    return "morning";
  if (hour24 >= 11 && hour24 < 17)
    return "day";
  if (hour24 >= 17 && hour24 < 20)
    return "evening";
  return "night";
}
function resolveBestPlaceBackdropUrl(place, state) {
  if (!place)
    return { url: "", matchedLabel: "No Location" };
  const variants = place.backdropVariants ?? [];
  const pinned = variants.find((v) => v.pinned && v.url);
  if (pinned) {
    return {
      url: pinned.url,
      matchedLabel: `\uD83D\uDCCC ${pinned.customTag || pinned.timeSlot}`
    };
  }
  const contextLower = [
    state.scene.weather,
    state.scene.timeLabel,
    state.scene.dateLabel,
    place.atmosphere
  ].filter(Boolean).join(" ").toLowerCase();
  for (const v of variants) {
    if (v.timeSlot === "custom" && v.customTag && v.url) {
      const tagTokens = v.customTag.toLowerCase().split(/[,/|\s]+/).filter((t) => t.length >= 2);
      if (tagTokens.length > 0 && tagTokens.every((tok) => contextLower.includes(tok))) {
        return { url: v.url, matchedLabel: `\uD83C\uDFF7️ ${v.customTag}` };
      }
    }
  }
  const curSlot = inferTimeSlotFromScene(state);
  const slotMatch = variants.find((v) => v.timeSlot === curSlot && v.url);
  if (slotMatch) {
    return { url: slotMatch.url, matchedLabel: `\uD83D\uDD70️ ${curSlot}` };
  }
  const defMatch = variants.find((v) => v.timeSlot === "default" && v.url);
  if (defMatch) {
    return { url: defMatch.url, matchedLabel: "Default" };
  }
  return {
    url: place.backdropUrl || "",
    matchedLabel: place.backdropUrl ? "Default" : "Atmospheric Stage"
  };
}
function matchesTagAgainstText(tag, targetText) {
  const cleanTag = tag.trim().toLowerCase();
  const cleanTarget = targetText.trim().toLowerCase();
  if (!cleanTag || !cleanTarget)
    return 0;
  if (cleanTarget.includes(cleanTag))
    return 2;
  const words = cleanTag.split(/[^a-z0-9]+/).filter((w) => w.length >= 3);
  if (!words.length)
    return 0;
  const hits = words.filter((w) => cleanTarget.includes(w)).length;
  return hits > 0 ? hits / words.length : 0;
}
function resolveBestCharacterSprite(actor, beatText = "") {
  const variants = actor.spriteVariants ?? [];
  const pinned = variants.find((v) => v.pinned && v.url);
  if (pinned) {
    return { url: pinned.url, matchedLabel: `\uD83D\uDCCC ${pinned.label}` };
  }
  const liveEmotion = resolveCharacterFieldValue(actor, "demeanor");
  const liveClothes = resolveCharacterFieldValue(actor, "attire_layers") || actor.attire || "";
  const liveActed = String(actor.meters["acted"]?.value ?? "");
  const liveGoal = resolveCharacterFieldValue(actor, "immediate_goal");
  const livePoseContext = [liveGoal, liveActed, beatText].filter(Boolean).join(" ");
  let bestVariant;
  let bestScore = 0;
  for (const v of variants) {
    if (!v.url)
      continue;
    let score = 0;
    let specifiedTags = 0;
    if (v.clothesTag.trim()) {
      specifiedTags++;
      const cMatch = matchesTagAgainstText(v.clothesTag, `${liveClothes} ${beatText}`);
      if (cMatch > 0)
        score += 3.5 * cMatch;
      else
        score -= 1;
    }
    if (v.emotionTag.trim()) {
      specifiedTags++;
      const eMatch = matchesTagAgainstText(v.emotionTag, `${liveEmotion} ${beatText}`);
      if (eMatch > 0)
        score += 2.5 * eMatch;
    }
    if (v.poseTag.trim()) {
      specifiedTags++;
      const pMatch = matchesTagAgainstText(v.poseTag, livePoseContext);
      if (pMatch > 0)
        score += 2 * pMatch;
    }
    if (specifiedTags === 0) {
      score = 0.1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestVariant = v;
    }
  }
  if (bestVariant) {
    return { url: bestVariant.url, matchedLabel: bestVariant.label };
  }
  const emoKey = (liveEmotion || "neutral").toLowerCase();
  if (actor.expressionAssets[emoKey]?.url) {
    return { url: actor.expressionAssets[emoKey].url, matchedLabel: emoKey };
  }
  return {
    url: actor.portraitUrl || "",
    matchedLabel: actor.portraitUrl ? "Base Sprite" : ""
  };
}
function openStageAssetStudioModal(ctrl, initialSubTab, focusTargetId) {
  if (initialSubTab)
    activeAssetStudioSubTab = initialSubTab;
  if (focusTargetId) {
    if (initialSubTab === "locations")
      selectedStudioPlaceId = focusTargetId;
    else
      selectedStudioCharId = focusTargetId;
  }
  ctrl.modals.open({
    title: "\uD83C\uDFA8 Stage Visual Studio — Character Sprites (Emotion/Clothes/Pose) & Location Time Backdrops",
    width: 960,
    maxHeight: 840
  }, (body, _close, handle) => {
    const redraw = () => {
      body.replaceChildren(renderStageAssetStudioSurface(ctrl, redraw));
    };
    redraw();
    const unsub = ctrl.subscribe(redraw);
    handle.onDismiss(unsub);
  });
}
function renderStageAssetStudioSurface(ctrl, onForceRedraw) {
  const { state } = ctrl.snapshot;
  const wrap = el("div", "ls-stack");
  const redraw = onForceRedraw ?? (() => ctrl.emitChange());
  const subNav = el("div", "ls-subnav-pills");
  const characters = Object.values(state.characters);
  const places = Object.values(state.places);
  for (const [tabId, tabLbl] of [
    ["characters", `\uD83C\uDFAD Character Sprites: Emotion, Clothes & Poses (${characters.length})`],
    ["locations", `\uD83C\uDFDE️ Discovered Locations: Time-of-Day & Weather Backdrops (${places.length})`]
  ]) {
    const b = btn(tabLbl, () => {
      activeAssetStudioSubTab = tabId;
      redraw();
    }, "ls-btn-sm");
    if (activeAssetStudioSubTab === tabId)
      b.setAttribute("aria-current", "page");
    subNav.append(b);
  }
  wrap.append(subNav);
  if (activeAssetStudioSubTab === "characters") {
    const activeChar = (selectedStudioCharId ? state.characters[selectedStudioCharId] : undefined) ?? characters[0];
    const charBar = el("div", "ls-row-between");
    const charPills = el("div", "ls-row");
    for (const c of characters) {
      const count = (c.spriteVariants?.length ?? 0) + (c.portraitUrl ? 1 : 0);
      const b = btn(`${c.present ? "\uD83D\uDFE2" : "⚪"} ${c.name} (${count})`, () => {
        selectedStudioCharId = c.id;
        redraw();
      }, "ls-btn-sm");
      if (c.id === activeChar?.id)
        b.setAttribute("aria-current", "page");
      charPills.append(b);
    }
    charBar.append(charPills, btn("+ Add Character", () => {
      ctrl.modals.open({ title: "➕ Add Character", width: 420 }, (mBody, close) => {
        const nameWrap = el("label", "ls-label", "Character Name");
        const nameInp = el("input", "ls-input");
        nameWrap.append(nameInp);
        const save = btn("➕ Create Character", () => {
          const name = nameInp.value.trim();
          if (!name)
            return;
          const id = slugifyKey(name, "npc");
          selectedStudioCharId = id;
          ctrl.request("state:mutate", {
            patch: { characters: [{ id, name, present: true }] },
            reason: `Added character "${name}"`
          });
          close();
        }, "ls-btn-primary");
        mBody.append(nameWrap, save);
      });
    }, "ls-btn-sm ls-btn-primary"));
    wrap.append(charBar);
    if (!activeChar) {
      const empty = el("div", "ls-card");
      empty.append(el("strong", "", "No characters in Cast yet"), el("p", "ls-muted", 'Click "+ Add Character" above or sync a chat turn to start uploading character sprites.'));
      wrap.append(empty);
      return wrap;
    }
    const composerCard = el("section", "ls-card");
    const liveEmotion = resolveCharacterFieldValue(activeChar, "demeanor");
    const liveClothes = resolveCharacterFieldValue(activeChar, "attire_layers") || activeChar.attire;
    composerCard.append(el("span", "ls-kicker", `Upload New Sprite Rule for ${activeChar.name}`), el("h3", "", `\uD83D\uDDBC️ Add Sprite by Emotion, Clothes & Pose — ${activeChar.name}`), el("p", "ls-muted", 'Fill in any combination of Emotion, Clothes/Outfit, and Pose/Action below (leave any box blank if it applies to all), then click "\uD83D\uDDBC️ Upload & Save Sprite". The VN Stage automatically switches to the matching sprite as the story changes!'));
    const inputGrid = el("div", "ls-grid");
    const emoWrap = el("label", "ls-label", "\uD83C\uDFAD Emotion / Mood Tag (Text Box)");
    const emoInp = el("input", "ls-input");
    emoInp.placeholder = "e.g. neutral, happy, flustered, angry, brusque, shy…";
    emoInp.value = liveEmotion || "";
    emoWrap.append(emoInp);
    const emoQuick = el("div", "ls-row");
    for (const qEmo of ["neutral", "happy", "flustered", "angry", "sad", "surprised", "shy"]) {
      emoQuick.append(btn(qEmo, () => {
        emoInp.value = qEmo;
      }, "ls-btn-sm ls-quick-pill"));
    }
    emoWrap.append(emoQuick);
    const clothesWrap = el("label", "ls-label", "\uD83D\uDC57 Clothes / Outfit Tag (Text Box)");
    const clothesInp = el("input", "ls-input");
    clothesInp.placeholder = "e.g. saree, bath towel, office wear, nightgown, casual…";
    clothesInp.value = "";
    clothesWrap.append(clothesInp);
    if (liveClothes) {
      clothesWrap.append(btn(`✨ Use Current Outfit ("${liveClothes.slice(0, 28)}")`, () => {
        clothesInp.value = liveClothes;
      }, "ls-btn-sm ls-quick-pill"));
    }
    const poseWrap = el("label", "ls-label", "\uD83E\uDDCD Pose / Action Tag (Text Box)");
    const poseInp = el("input", "ls-input");
    poseInp.placeholder = "e.g. standing, mopping, crossed arms, holding phone, leaning…";
    poseInp.value = "";
    poseWrap.append(poseInp);
    const poseQuick = el("div", "ls-row");
    for (const qPose of ["standing", "crossed arms", "leaning in", "looking away", "sitting"]) {
      poseQuick.append(btn(qPose, () => {
        poseInp.value = qPose;
      }, "ls-btn-sm ls-quick-pill"));
    }
    poseWrap.append(poseQuick);
    inputGrid.append(emoWrap, clothesWrap, poseWrap);
    composerCard.append(inputGrid);
    const uploadRow = el("div", "ls-row-between");
    uploadRow.append(el("small", "ls-muted", `Current Live State — Demeanor: "${liveEmotion || "neutral"}" · Outfit: "${liveClothes || "default"}"`), el("div", "ls-row"));
    uploadRow.lastElementChild.append(btn("\uD83D\uDDBC️ Upload Default / Base Sprite", () => {
      ctrl.pickAndUploadImage(activeChar.id, "portrait");
    }, "ls-btn-sm"), btn("\uD83D\uDDBC️ Upload & Save Sprite Variant", () => {
      ctrl.uploadStageVariantAsset({
        targetId: activeChar.id,
        kind: "sprite_variant",
        emotionTag: emoInp.value.trim(),
        clothesTag: clothesInp.value.trim(),
        poseTag: poseInp.value.trim()
      });
    }, "ls-btn-primary"));
    composerCard.append(uploadRow);
    wrap.append(composerCard);
    const galleryCard = el("section", "ls-card");
    const variants = activeChar.spriteVariants ?? [];
    const resolvedNow = resolveBestCharacterSprite(activeChar);
    const gHead = el("div", "ls-row-between");
    gHead.append(el("h3", "", `\uD83D\uDDC2️ Saved Sprites for ${activeChar.name} (${variants.length + (activeChar.portraitUrl ? 1 : 0)})`), resolvedNow.url ? el("span", "ls-chip ls-chip-accent", `✓ Active on Stage: ${resolvedNow.matchedLabel}`) : el("span", "ls-chip", "No sprite uploaded yet"));
    galleryCard.append(gHead);
    const galleryGrid = el("div", "ls-asset-gallery");
    if (activeChar.portraitUrl) {
      const baseBox = el("div", "ls-asset-card");
      const thumb = el("div", "ls-asset-thumb");
      const img = el("img");
      img.src = activeChar.portraitUrl;
      img.alt = `${activeChar.name} Base Sprite`;
      thumb.append(img);
      const meta = el("div", "ls-stack");
      meta.style.gap = "6px";
      meta.append(el("strong", "", "⭐ Base / Fallback Sprite"), el("small", "ls-muted", "Used whenever no specific Emotion / Clothes / Pose variant matches."), btn("\uD83D\uDD04 Replace Base Sprite", () => ctrl.pickAndUploadImage(activeChar.id, "portrait"), "ls-btn-sm"));
      baseBox.append(thumb, meta);
      galleryGrid.append(baseBox);
    }
    variants.forEach((v, idx) => {
      const box = el("div", "ls-asset-card");
      if (v.pinned)
        box.style.borderColor = "var(--ls-primary)";
      const thumb = el("div", "ls-asset-thumb");
      const img = el("img");
      img.src = v.url;
      img.alt = v.label;
      thumb.append(img);
      const formCol = el("div", "ls-stack");
      formCol.style.gap = "5px";
      const eInp = el("input", "ls-input");
      eInp.style.minHeight = "28px";
      eInp.placeholder = "Emotion tag (e.g. flustered)…";
      eInp.value = v.emotionTag;
      const cInp = el("input", "ls-input");
      cInp.style.minHeight = "28px";
      cInp.placeholder = "Clothes tag (e.g. saree, towel)…";
      cInp.value = v.clothesTag;
      const pInp = el("input", "ls-input");
      pInp.style.minHeight = "28px";
      pInp.placeholder = "Pose tag (e.g. mopping)…";
      pInp.value = v.poseTag;
      const actRow = el("div", "ls-row");
      actRow.append(btn("\uD83D\uDCBE Save Tags", () => {
        const nextChars = structuredClone(state.characters);
        const list = nextChars[activeChar.id]?.spriteVariants;
        if (list && list[idx]) {
          list[idx].emotionTag = eInp.value.trim();
          list[idx].clothesTag = cInp.value.trim();
          list[idx].poseTag = pInp.value.trim();
          list[idx].label = [list[idx].emotionTag, list[idx].clothesTag, list[idx].poseTag].filter(Boolean).join(" · ") || "Default";
          ctrl.request("state:mutate", {
            stateOverride: { characters: nextChars },
            reason: `Updated sprite tags for ${activeChar.name}`
          });
          ctrl.notify(`Saved tags for ${activeChar.name}'s sprite.`);
        }
      }, "ls-btn-sm ls-btn-primary"), btn(v.pinned ? "\uD83D\uDCCC Pinned" : "\uD83D\uDCCD Pin", () => {
        const nextChars = structuredClone(state.characters);
        const list = nextChars[activeChar.id]?.spriteVariants ?? [];
        const willPin = !v.pinned;
        list.forEach((item, i) => {
          item.pinned = i === idx ? willPin : false;
        });
        ctrl.request("state:mutate", {
          stateOverride: { characters: nextChars },
          reason: `${willPin ? "Pinned" : "Unpinned"} sprite for ${activeChar.name}`
        });
      }, `ls-btn-sm ${v.pinned ? "ls-btn-primary" : ""}`), btn("\uD83D\uDDD1️", () => {
        const nextChars = structuredClone(state.characters);
        if (nextChars[activeChar.id]?.spriteVariants) {
          nextChars[activeChar.id].spriteVariants = nextChars[activeChar.id].spriteVariants.filter((item) => item.id !== v.id);
          ctrl.request("state:mutate", {
            stateOverride: { characters: nextChars },
            reason: `Removed sprite variant from ${activeChar.name}`
          });
        }
      }, "ls-btn-sm ls-btn-icon ls-btn-danger", "Delete sprite variant"));
      formCol.append(el("strong", "", v.label || "Sprite Variant"), eInp, cInp, pInp, actRow);
      box.append(thumb, formCol);
      galleryGrid.append(box);
    });
    if (galleryGrid.childElementCount === 0) {
      galleryCard.append(el("p", "ls-muted", `No sprites uploaded for ${activeChar.name} yet. Use the form above to upload sprites for different emotions, outfits, and poses.`));
    } else {
      galleryCard.append(galleryGrid);
    }
    wrap.append(galleryCard);
    return wrap;
  }
  const activePlace = (selectedStudioPlaceId ? state.places[selectedStudioPlaceId] : undefined) ?? (state.currentPlaceId ? state.places[state.currentPlaceId] : undefined) ?? places[0];
  const placeBar = el("div", "ls-row-between");
  const placePills = el("div", "ls-row");
  for (const p of places) {
    const count = (p.backdropVariants?.length ?? 0) || (p.backdropUrl ? 1 : 0);
    const b = btn(`${p.icon || "\uD83D\uDCCD"} ${p.name}${p.id === state.currentPlaceId ? " (Here)" : ""} (${count})`, () => {
      selectedStudioPlaceId = p.id;
      redraw();
    }, "ls-btn-sm");
    if (p.id === activePlace?.id)
      b.setAttribute("aria-current", "page");
    placePills.append(b);
  }
  placeBar.append(placePills, btn("+ Add Location", () => {
    ctrl.modals.open({ title: "➕ Add Location to Atlas", width: 440 }, (mBody, close) => {
      const nameWrap = el("label", "ls-label", "Location Name");
      const nameInp = el("input", "ls-input");
      nameWrap.append(nameInp);
      const descWrap = el("label", "ls-label", "Description");
      const descInp = el("input", "ls-input");
      descWrap.append(descInp);
      const save = btn("➕ Create Location", () => {
        const name = nameInp.value.trim();
        if (!name)
          return;
        const id = slugifyKey(name, "place");
        selectedStudioPlaceId = id;
        ctrl.request("state:mutate", {
          patch: {
            places: [{ id, name, icon: "\uD83C\uDFDB️", description: descInp.value.trim() || "Location" }]
          },
          reason: `Added location "${name}"`
        });
        close();
      }, "ls-btn-primary");
      mBody.append(nameWrap, descWrap, save);
    });
  }, "ls-btn-sm ls-btn-primary"));
  wrap.append(placeBar);
  if (!activePlace) {
    const empty = el("div", "ls-card");
    empty.append(el("strong", "", "No locations discovered yet"), el("p", "ls-muted", 'Click "+ Add Location" above or sync a chat turn to start uploading backdrops.'));
    wrap.append(empty);
    return wrap;
  }
  const curTimeSlot = inferTimeSlotFromScene(state);
  const resolvedBg = resolveBestPlaceBackdropUrl(activePlace, state);
  const locComposer = el("section", "ls-card");
  const locHead = el("div", "ls-row-between");
  locHead.append(el("h3", "", `${activePlace.icon || "\uD83D\uDCCD"} ${activePlace.name} — Time-of-Day & Weather Backdrops`), el("span", "ls-chip ls-chip-accent", `\uD83D\uDD70️ Current Story Time: ${state.scene.timeLabel || formatStoryClock(state.elapsedMinutes)} (${curTimeSlot.toUpperCase()})`));
  locComposer.append(locHead, el("p", "ls-muted", 'Upload backdrops for Morning, Day, Evening, Night, or a custom weather/scene state (e.g. "rainy", "steamy", "lights off"). The VN Stage automatically transitions to the matching backdrop as time passes!'));
  const slotGrid = el("div", "ls-grid");
  const timeSlots = [
    { slot: "default", icon: "\uD83C\uDFDE️", label: "Default (Any Time)", sub: "Fallback when no specific time slot is set" },
    { slot: "morning", icon: "\uD83C\uDF05", label: "Morning / Dawn", sub: "05:00 AM – 10:59 AM" },
    { slot: "day", icon: "☀️", label: "Day / Afternoon", sub: "11:00 AM – 04:59 PM" },
    { slot: "evening", icon: "\uD83C\uDF07", label: "Evening / Sunset", sub: "05:00 PM – 07:59 PM" },
    { slot: "night", icon: "\uD83C\uDF19", label: "Night / Late Night", sub: "08:00 PM – 04:59 AM" }
  ];
  for (const ts of timeSlots) {
    const existingVar = (activePlace.backdropVariants ?? []).find((v) => v.timeSlot === ts.slot);
    const fallbackDefaultUrl = ts.slot === "default" ? activePlace.backdropUrl : undefined;
    const previewUrl = existingVar?.url || fallbackDefaultUrl || "";
    const cell = el("div", "ls-asset-card");
    if (curTimeSlot === ts.slot || existingVar?.pinned) {
      cell.style.borderColor = "var(--ls-primary)";
    }
    if (previewUrl) {
      const thumb = el("div", "ls-asset-thumb");
      const img = el("img");
      img.src = previewUrl;
      img.alt = `${activePlace.name} ${ts.label}`;
      thumb.append(img);
      cell.append(thumb);
    }
    const info = el("div", "ls-stack");
    info.style.gap = "4px";
    info.append(el("strong", "", `${ts.icon} ${ts.label}`), el("small", "ls-muted", ts.sub));
    const btnRow = el("div", "ls-row");
    btnRow.append(btn(previewUrl ? "\uD83D\uDD04 Replace Image" : "\uD83D\uDDBC️ Upload Image", () => {
      ctrl.uploadStageVariantAsset({
        targetId: activePlace.id,
        kind: "backdrop_variant",
        timeSlot: ts.slot
      });
    }, `ls-btn-sm ${previewUrl ? "" : "ls-btn-primary"}`));
    if (existingVar) {
      btnRow.append(btn(existingVar.pinned ? "\uD83D\uDCCC Pinned" : "\uD83D\uDCCD Pin", () => {
        const nextPlaces = structuredClone(state.places);
        const list = nextPlaces[activePlace.id]?.backdropVariants ?? [];
        const willPin = !existingVar.pinned;
        list.forEach((item) => {
          item.pinned = item.id === existingVar.id ? willPin : false;
        });
        ctrl.request("state:mutate", {
          stateOverride: { places: nextPlaces },
          reason: `${willPin ? "Pinned" : "Unpinned"} ${ts.label} backdrop for ${activePlace.name}`
        });
      }, `ls-btn-sm ${existingVar.pinned ? "ls-btn-primary" : ""}`), btn("\uD83D\uDDD1️", () => {
        const nextPlaces = structuredClone(state.places);
        const pl = nextPlaces[activePlace.id];
        if (pl?.backdropVariants) {
          pl.backdropVariants = pl.backdropVariants.filter((item) => item.id !== existingVar.id);
          if (ts.slot === "default")
            pl.backdropUrl = undefined;
          ctrl.request("state:mutate", {
            stateOverride: { places: nextPlaces },
            reason: `Removed ${ts.label} backdrop from ${activePlace.name}`
          });
        }
      }, "ls-btn-sm ls-btn-icon ls-btn-danger"));
    }
    info.append(btnRow);
    cell.append(info);
    slotGrid.append(cell);
  }
  locComposer.append(slotGrid);
  const customBox = el("div", "ls-stat-cell");
  customBox.append(el("strong", "", "\uD83C\uDFF7️ Add Custom Time / Weather / State Backdrop Variant"));
  const customRow = el("div", "ls-row");
  const tagInp = el("input", "ls-input");
  tagInp.style.flex = "1";
  tagInp.placeholder = "Enter custom condition tag (e.g. rainy, steamy, lights off, crowded)…";
  customRow.append(tagInp, btn("\uD83D\uDDBC️ Upload & Save Custom Variant", () => {
    const customTag = tagInp.value.trim();
    if (!customTag) {
      ctrl.notify('Enter a custom tag (e.g. "rainy" or "steamy") before uploading.', true);
      return;
    }
    ctrl.uploadStageVariantAsset({
      targetId: activePlace.id,
      kind: "backdrop_variant",
      timeSlot: "custom",
      customTag
    });
  }, "ls-btn-primary"));
  customBox.append(customRow);
  const customVariants = (activePlace.backdropVariants ?? []).filter((v) => v.timeSlot === "custom");
  if (customVariants.length > 0) {
    const customGallery = el("div", "ls-asset-gallery");
    customGallery.style.marginTop = "8px";
    for (const cv of customVariants) {
      const cCard = el("div", "ls-asset-card");
      const thumb = el("div", "ls-asset-thumb");
      const img = el("img");
      img.src = cv.url;
      img.alt = cv.customTag;
      thumb.append(img);
      const cMeta = el("div", "ls-row-between");
      cMeta.append(el("strong", "", `\uD83C\uDFF7️ ${cv.customTag}`), el("div", "ls-row"));
      cMeta.lastElementChild.append(btn(cv.pinned ? "\uD83D\uDCCC Pinned" : "\uD83D\uDCCD Pin", () => {
        const nextPlaces = structuredClone(state.places);
        const list = nextPlaces[activePlace.id]?.backdropVariants ?? [];
        const willPin = !cv.pinned;
        list.forEach((item) => {
          item.pinned = item.id === cv.id ? willPin : false;
        });
        ctrl.request("state:mutate", {
          stateOverride: { places: nextPlaces },
          reason: `Pinned "${cv.customTag}" backdrop for ${activePlace.name}`
        });
      }, `ls-btn-sm ${cv.pinned ? "ls-btn-primary" : ""}`), btn("\uD83D\uDDD1️", () => {
        const nextPlaces = structuredClone(state.places);
        const pl = nextPlaces[activePlace.id];
        if (pl?.backdropVariants) {
          pl.backdropVariants = pl.backdropVariants.filter((item) => item.id !== cv.id);
          ctrl.request("state:mutate", {
            stateOverride: { places: nextPlaces },
            reason: `Removed "${cv.customTag}" backdrop`
          });
        }
      }, "ls-btn-sm ls-btn-icon ls-btn-danger"));
      cCard.append(thumb, cMeta);
      customGallery.append(cCard);
    }
    customBox.append(customGallery);
  }
  locComposer.append(customBox);
  if (resolvedBg.url) {
    locComposer.append(el("small", "ls-muted", `✓ Currently active backdrop for ${activePlace.name}: ${resolvedBg.matchedLabel}`));
  }
  wrap.append(locComposer);
  return wrap;
}

// src/frontend/surfaces/studio/StudioProseEngineTab.ts
var proseTesterSample = '    She⠀stepped⠀forward⠀with⠀a⠀warm⠀smile.⠀"Welcome⠀back."';
var obfWordDraft = "";
var obfTesterSample = "She hid the knife before any blood could spill.";
var autoFetchedConnectionsInStudio = false;
var lastTokenAnalysis = null;
function renderStudioProseTab(ctrl, compScope) {
  const settings = ctrl.settings;
  const wrap = el("div", "ls-stack");
  const proseCard = el("section", "ls-card");
  proseCard.append(el("span", "ls-kicker", "Prose Typography & Unicode Hygiene"), el("h3", "", "Braille Blank (U+2800) & Whitespace Cleaner"), el("p", "ls-muted", "Scrubs invisible Braille pattern blanks (U+2800), zero-width joiners, and accidental 4-space code blocks."));
  if (settings) {
    const toggleRow = el("div", "ls-row-between ls-stat-cell");
    toggleRow.append(el("span", "", "Auto-Clean Braille Blanks & 4-Space Glitches"));
    const switchSlot = el("div");
    toggleRow.append(switchSlot);
    mountNativeSwitch(ctrl, compScope, switchSlot, {
      checked: Boolean(settings.cleanBraille),
      ariaLabel: "Auto-Clean Braille Blanks",
      onChange: (checked) => {
        ctrl.request("settings:update", { settings: { cleanBraille: checked } });
      }
    });
    proseCard.append(toggleRow);
  }
  const retroRow = el("div", "ls-row-between ls-stat-cell");
  retroRow.append(el("span", "", "Retroactively clean all stored messages in the active chat:"), btn("Clean Active Chat Now", () => {
    ctrl.request("prose:cleanChat").then((res) => {
      ctrl.notify(`Cleaned ${Number(res.cleanedCount ?? 0)} of ${Number(res.total ?? 0)} messages.`);
    });
  }, "ls-btn-sm ls-btn-primary"));
  proseCard.append(retroRow);
  wrap.append(proseCard);
  const testerHost = el("div");
  wrap.append(testerHost);
  const testerBody = mountNativeCollapsible(ctrl, compScope, testerHost, {
    title: "Live Braille & Indentation Tester",
    iconName: "flask",
    defaultExpanded: false,
    persistKey: "studio_prose_tester"
  });
  const sampleInp = el("textarea", "ls-input");
  sampleInp.rows = 2;
  sampleInp.value = proseTesterSample;
  const sampleOut = el("div", "ls-stat-cell");
  const updatePreview = () => {
    proseTesterSample = sampleInp.value;
    sampleOut.textContent = `Normalized Output: ${cleanBrailleAndProseWhitespace(sampleInp.value)}`;
  };
  sampleInp.addEventListener("input", updatePreview);
  updatePreview();
  testerBody.append(sampleInp, sampleOut);
  if (settings) {
    const obfCard = el("section", "ls-card");
    const saveObfSetting = (patch) => {
      ctrl.request("settings:update", { settings: patch });
    };
    const obfWords = normalizeSensitiveWordsList(settings.sensitiveWords);
    const useOne = settings.obfuscateVowelsWithOne !== false;
    const obfHead = el("div", "ls-row-between");
    const swSlot = el("div");
    obfHead.append(el("h3", "", `Sensitive Word Obfuscator (${obfWords.length} words)`), swSlot);
    mountNativeSwitch(ctrl, compScope, swSlot, {
      checked: Boolean(settings.sensitiveObfuscatorEnabled),
      ariaLabel: "Enable Sensitive Word Obfuscator",
      onChange: (on) => saveObfSetting({ sensitiveObfuscatorEnabled: on })
    });
    obfCard.append(obfHead, el("p", "ls-muted", 'Replaces vowels in chosen words with "1" (e.g., blood → bl11d) when sending prompts, and restores readable words & inflections (e.g., bl11d/bl11dy → blood/bloody) in chat display via Lumiverse display processing (requires "chat_mutation" or "regex_scripts" permission).'));
    const addRow = el("div", "ls-row");
    const wordInp = el("input", "ls-input");
    wordInp.style.flex = "1";
    wordInp.placeholder = "Type words separated by commas (e.g. blood, kill)…";
    wordInp.value = obfWordDraft;
    wordInp.addEventListener("input", () => {
      obfWordDraft = wordInp.value;
    });
    const addWordsAction = () => {
      const incoming = wordInp.value.split(/[\n,;]+/).map((s) => s.trim().toLowerCase()).filter((s) => s.length >= 2);
      if (!incoming.length)
        return;
      const merged = normalizeSensitiveWordsList([...obfWords, ...incoming]);
      obfWordDraft = "";
      wordInp.value = "";
      saveObfSetting({
        sensitiveWords: merged,
        ...settings.sensitiveObfuscatorEnabled ? {} : { sensitiveObfuscatorEnabled: true }
      });
    };
    wordInp.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        addWordsAction();
      }
    });
    addRow.append(wordInp, btn("Add", addWordsAction, "ls-btn-sm ls-btn-primary"), ...obfWords.length > 0 ? [btn("Clear All", () => saveObfSetting({ sensitiveWords: [] }), "ls-btn-sm ls-btn-danger")] : []);
    obfCard.append(addRow);
    if (obfWords.length > 0) {
      const chipsRow = el("div", "ls-row");
      for (const w of obfWords) {
        chipsRow.append(btn(`${w} → ${obfuscateWordToken(w, useOne)} ✕`, () => {
          saveObfSetting({ sensitiveWords: obfWords.filter((item) => item !== w) });
        }, "ls-btn-sm ls-quick-pill", `Remove "${w}"`));
      }
      obfCard.append(chipsRow);
    }
    const optHost = el("div");
    obfCard.append(optHost);
    const optBody = mountNativeCollapsible(ctrl, compScope, optHost, {
      title: "Cipher Rules & Live Preview",
      iconName: "sliders",
      defaultExpanded: false,
      persistKey: "studio_prose_cipher"
    });
    const optGrid = el("div", "ls-grid");
    for (const [key, lbl, defaultVal] of [
      ["obfuscateVowelsWithOne", 'Use "1" instead of "*"', true],
      ["obfuscateOnSend", "Obfuscate Prompts Sent to LLM", true],
      ["restoreObfuscatedOnRender", "Restore Words in Chat Display", true],
      ["obfuscateOnOutput", "Obfuscate Saved LLM Output", false],
      ["includeCipherHint", "Explain Cipher Input to LLM (Keep prose normal)", false]
    ]) {
      const cell = el("div", "ls-row-between ls-stat-cell");
      cell.append(el("span", "", lbl));
      const s = el("div");
      cell.append(s);
      mountNativeSwitch(ctrl, compScope, s, {
        checked: settings[key] !== undefined ? Boolean(settings[key]) : defaultVal,
        onChange: (on) => saveObfSetting({ [key]: on })
      });
      optGrid.append(cell);
    }
    const obfSampleInp = el("input", "ls-input");
    obfSampleInp.value = obfTesterSample;
    const sentPreview = el("small", "ls-muted");
    const dispPreview = el("small", "ls-muted");
    const syncObfPreview = () => {
      obfTesterSample = obfSampleInp.value;
      const sentTxt = obfuscateSensitiveWords(obfSampleInp.value, obfWords, useOne);
      const dispTxt = settings.obfuscateOnOutput ? sentTxt : settings.restoreObfuscatedOnRender !== false ? deobfuscateSensitiveWords(sentTxt, obfWords, useOne) : sentTxt;
      sentPreview.textContent = `Sent to LLM: ${sentTxt}`;
      dispPreview.textContent = `Chat Display: ${dispTxt}`;
    };
    obfSampleInp.addEventListener("input", syncObfPreview);
    syncObfPreview();
    optBody.append(optGrid, obfSampleInp, sentPreview, dispPreview);
    wrap.append(obfCard);
  }
  return wrap;
}
function renderStudioEngineTab(ctrl, compScope, postMount) {
  const settings = ctrl.settings;
  const wrap = el("div", "ls-stack");
  if (!settings)
    return wrap;
  if (!ctrl.connections.length && !autoFetchedConnectionsInStudio) {
    autoFetchedConnectionsInStudio = true;
    ctrl.refreshActiveChat();
  }
  const engCard = el("section", "ls-card");
  engCard.append(el("h3", "", "Extraction Mode & Connections"));
  const modeRow = el("div", "ls-row");
  for (const [mVal, mLbl] of [
    ["sidecar", "Dedicated Sidecar Extractor (Works with Any Preset)"],
    ["inline_tag", "Zero-Call Inline <lumi-stats> Tag"]
  ]) {
    const b = btn(mLbl, () => {
      ctrl.request("settings:update", { settings: { extractionMode: mVal } });
    }, "ls-btn-sm");
    if (settings.extractionMode === mVal)
      b.setAttribute("aria-current", "page");
    modeRow.append(b);
  }
  engCard.append(modeRow);
  const toggleGrid = el("div", "ls-grid");
  for (const [key, label] of [
    ["autoTrack", "Auto-calibrate after assistant replies"],
    ["injectContinuity", "Inject continuity into narrator prompt"],
    ["splitStaticProtocolForCache", "Cache-friendly split (static rules before history)"],
    ["memoryCortexSync", "Sync to Lumiverse Memory Cortex"],
    ["worldInfoGating", "Enable [lumi:stat>=value] World Info gates"],
    ["thresholdToasts", "Show threshold toast alerts"],
    ["debugInspector", "Keep last extractor payload for debug"]
  ]) {
    const cell = el("div", "ls-row-between ls-stat-cell");
    cell.append(el("span", "", label));
    const swSlot = el("div");
    cell.append(swSlot);
    mountNativeSwitch(ctrl, compScope, swSlot, {
      checked: Boolean(settings[key]),
      onChange: (on) => void ctrl.request("settings:update", { settings: { [key]: on } })
    });
    toggleGrid.append(cell);
  }
  engCard.append(toggleGrid);
  const connGrid = el("div", "ls-grid");
  const connWrap = el("div", "ls-label", "Extractor LLM Connection");
  const connSlot = el("div");
  connWrap.append(connSlot);
  const modelWrap = el("label", "ls-label", "Extractor Model Override");
  const modelSlot = el("div");
  modelWrap.append(modelSlot);
  connGrid.append(connWrap, modelWrap);
  engCard.append(connGrid);
  mountThemedSelect(ctrl, compScope, connSlot, {
    value: settings.extractorConnectionId || "",
    ariaLabel: "Extractor LLM Connection",
    searchPlaceholder: "Search connections…",
    options: [
      { value: "", label: "Use Active Lumiverse Default Connection" },
      ...ctrl.connections.map((c) => ({
        value: c.id,
        label: `${c.name}${c.model ? ` (${c.model})` : ""}`,
        ...c.provider ? { sublabel: c.provider } : {}
      }))
    ],
    onChange: (nextConnId) => {
      ctrl.request("settings:update", { settings: { extractorConnectionId: nextConnId } });
    }
  });
  const mInp = el("input", "ls-input");
  mInp.value = settings.extractorModel || "";
  mInp.placeholder = "Default connection model…";
  mInp.addEventListener("change", () => {
    ctrl.request("settings:update", { settings: { extractorModel: mInp.value.trim() } });
  });
  modelSlot.append(mInp);
  if (ctrl.ctx.components?.mountModelCombobox) {
    postMount.push(() => {
      if (!modelSlot.isConnected)
        return;
      try {
        modelSlot.replaceChildren();
        compScope.track(ctrl.ctx.components.mountModelCombobox(modelSlot, {
          value: settings.extractorModel || "",
          connection: settings.extractorConnectionId ? { kind: "llm", id: settings.extractorConnectionId } : { kind: "llm" },
          appearance: "standard",
          placeholder: "Default connection model…",
          onChange: (nextModel) => {
            ctrl.request("settings:update", { settings: { extractorModel: nextModel } });
          }
        }));
      } catch {}
    });
  }
  const dietCard = el("section", "ls-card");
  dietCard.append(el("span", "ls-kicker", "Token Economy & Prompt Budget"), el("h3", "", "Token Diet, Protocol Mode & Live Analyzer"));
  const dietGrid = el("div", "ls-grid");
  const budgetWrap = el("label", "ls-label", "Continuity Token Budget (150–4000)");
  const budgetInp = el("input", "ls-input");
  budgetInp.type = "number";
  budgetInp.min = "150";
  budgetInp.max = "4000";
  budgetInp.step = "50";
  budgetInp.value = String(settings.tokenBudget ?? 450);
  budgetInp.addEventListener("change", () => {
    const val = Math.max(150, Math.min(4000, Math.round(Number(budgetInp.value) || 450)));
    budgetInp.value = String(val);
    ctrl.request("settings:update", { settings: { tokenBudget: val } });
  });
  budgetWrap.append(budgetInp);
  const verbWrap = el("div", "ls-label", "Extractor Protocol Mode");
  const verbSlot = el("div");
  verbWrap.append(verbSlot);
  mountThemedSelect(ctrl, compScope, verbSlot, {
    value: settings.protocolVerbosity ?? "compact",
    ariaLabel: "Extractor Protocol Mode",
    options: [
      { value: "compact", label: "Compact Delta (Recommended — Saves ~45%)" },
      { value: "standard", label: "Standard Detailed (Verbose Turn-1 Guides)" }
    ],
    onChange: (v) => {
      ctrl.request("settings:update", { settings: { protocolVerbosity: v } });
    }
  });
  const turnsWrap = el("label", "ls-label", "Sidecar History Window (2–12 msgs)");
  const turnsInp = el("input", "ls-input");
  turnsInp.type = "number";
  turnsInp.min = "2";
  turnsInp.max = "12";
  turnsInp.value = String(settings.sidecarHistoryTurns ?? 4);
  turnsInp.addEventListener("change", () => {
    const val = Math.max(2, Math.min(12, Math.round(Number(turnsInp.value) || 4)));
    turnsInp.value = String(val);
    ctrl.request("settings:update", { settings: { sidecarHistoryTurns: val } });
  });
  turnsWrap.append(turnsInp);
  const charsWrap = el("label", "ls-label", "Sidecar Max Chars / Msg (800–6000)");
  const charsInp = el("input", "ls-input");
  charsInp.type = "number";
  charsInp.min = "800";
  charsInp.max = "6000";
  charsInp.step = "250";
  charsInp.value = String(settings.sidecarMaxCharsPerMsg ?? 2500);
  charsInp.addEventListener("change", () => {
    const val = Math.max(800, Math.min(6000, Math.round(Number(charsInp.value) || 2500)));
    charsInp.value = String(val);
    ctrl.request("settings:update", { settings: { sidecarMaxCharsPerMsg: val } });
  });
  charsWrap.append(charsInp);
  dietGrid.append(budgetWrap, verbWrap, turnsWrap, charsWrap);
  dietCard.append(dietGrid);
  const quickDietRow = el("div", "ls-row");
  quickDietRow.append(btn("Hide Analytical Fields from Continuity", () => {
    const analyticalIds = new Set([
      "acted",
      "observation",
      "plan",
      "knowledge",
      "cash_in_hand",
      "cash_in_bank",
      "bottom_underwear",
      "top_underwear",
      "offscreen_npcs"
    ]);
    const nextStats = ctrl.snapshot.template.stats.map((s) => analyticalIds.has(s.id) ? { ...s, injectInContinuity: false } : s);
    ctrl.request("state:mutate", {
      templatePatch: { stats: nextStats },
      reason: "Moved analytical/secondary stats to UI-only continuity"
    }).then(() => ctrl.notify("Analytical fields moved to UI-only (still tracked & visible in panels)."));
  }, "ls-btn-sm", "Stops echoing acted, observation, plan, knowledge, cash, underwear, and offscreen_npcs back to the narrator while keeping them in the UI"), btn("Auto-Gate Situational Stats", () => {
    const kwMap = {
      cash_in_hand: ["cash", "coin", "gold", "money", "pay", "buy", "sell", "price", "wallet", "bank"],
      cash_in_bank: ["cash", "coin", "gold", "money", "pay", "buy", "sell", "bank", "account", "asset"],
      bottom_underwear: ["undress", "underwear", "panties", "boxers", "towel", "bath", "strip", "naked", "skirt", "pants"],
      top_underwear: ["undress", "underwear", "bra", "towel", "bath", "strip", "naked", "shirt", "top"]
    };
    const nextStats = ctrl.snapshot.template.stats.map((s) => {
      if (kwMap[s.id]) {
        return {
          ...s,
          promptTriggerMode: "conditional",
          promptKeywords: kwMap[s.id]
        };
      }
      if ((s.id === "eff_pow_agi" || s.id === "char_eff_pow_agi") && s.formula?.trim()) {
        return { ...s, calculationMode: "local_formula" };
      }
      return s;
    });
    ctrl.request("state:mutate", {
      templatePatch: { stats: nextStats },
      reason: "Applied keyword gating & local-formula diet"
    }).then(() => ctrl.notify("Applied keyword gating to situational stats."));
  }, "ls-btn-sm", "Only sends cash & clothing rules when matching keywords appear in recent chat"));
  dietCard.append(quickDietRow);
  const analysisBox = el("div", "ls-stat-cell");
  const renderAnalysis = () => {
    analysisBox.replaceChildren();
    if (!lastTokenAnalysis) {
      analysisBox.append(el("small", "ls-muted", 'Click "Analyze Current Chat Tokens" to measure exact protocol, continuity, and per-stat token usage.'));
      return;
    }
    const approxTag = lastTokenAnalysis.approximate ? " (est.)" : "";
    analysisBox.append(el("strong", "", `Total Injected: ${Number(lastTokenAnalysis.totalInjectedTokens ?? 0)} tokens${approxTag} — Protocol: ${Number(lastTokenAnalysis.protocolTokens ?? 0)} | Continuity: ${Number(lastTokenAnalysis.continuityTokens ?? 0)} (uncapped: ${Number(lastTokenAnalysis.rawContinuityTokens ?? 0)}) | Dossier: ~${Number(lastTokenAnalysis.dossierStateTokens ?? 0)}`));
    const topStats = Array.isArray(lastTokenAnalysis.topStats) ? lastTokenAnalysis.topStats : [];
    if (topStats.length > 0) {
      const chipRow = el("div", "ls-row");
      for (const st of topStats) {
        chipRow.append(el("span", "ls-chip", `${String(st.label)}: ~${Number(st.approxTokens ?? 0)}t (rule ${Number(st.ruleTokens ?? 0)} + state ${Number(st.stateTokens ?? 0)})`));
      }
      analysisBox.append(chipRow);
    }
  };
  renderAnalysis();
  const analyzeBtn = btn("Analyze Current Chat Tokens", () => {
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = "Counting tokens…";
    ctrl.request("tokens:analyze").then((res) => {
      lastTokenAnalysis = res;
      renderAnalysis();
    }).finally(() => {
      if (analyzeBtn.isConnected) {
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = "Analyze Current Chat Tokens";
      }
    });
  }, "ls-btn-sm ls-btn-primary");
  dietCard.append(analyzeBtn, analysisBox);
  engCard.append(btn("Inspect Last Extractor Payload", () => {
    ctrl.request("debug:get").then((res) => {
      ctrl.modals.open({ title: "Last Extractor JSON Output", width: 720, maxHeight: 740 }, (body) => {
        const pre = el("pre", "ls-stat-cell", res.record ? JSON.stringify(res.record, null, 2) : "No debug record captured yet. Enable debug inspection and run a sync.");
        pre.style.whiteSpace = "pre-wrap";
        pre.style.overflowWrap = "anywhere";
        body.append(pre);
      });
    });
  }, "ls-btn-sm"));
  wrap.append(engCard, dietCard);
  return wrap;
}

// src/frontend/surfaces/CategoryModals.ts
function openStatCategoryModal(ctrl, existing) {
  const tpl = structuredClone(ctrl.snapshot.template);
  const existingCats = [...tpl.categories ?? []];
  ctrl.modals.open({
    title: existing ? `Edit Category: ${existing.icon} ${existing.name}` : "Create Stat Category & Group Rule",
    width: 660,
    maxHeight: 840
  }, (body, close, _handle, modalScope) => {
    let enabled = existing?.enabled ?? true;
    let showGroupHeaderInHud = existing?.showGroupHeaderInHud ?? true;
    let collapsedByDefault = existing?.collapsedByDefault ?? false;
    let injectInContinuity = existing?.injectInContinuity ?? true;
    let selectedColor = existing?.color || "var(--lumiverse-primary)";
    let promptTriggerMode = existing?.promptTriggerMode ?? "always";
    const memberIds = new Set(existing ? tpl.stats.filter((s) => s.categoryId === existing.id).map((s) => s.id) : []);
    const topGrid = el("div", "ls-grid");
    const iconWrap = el("label", "ls-label", "Icon");
    const iconInp = el("input", "ls-input");
    iconInp.value = existing?.icon ?? "\uD83D\uDCC1";
    iconWrap.append(iconInp);
    const nameWrap = el("label", "ls-label", "Category Name");
    const nameInp = el("input", "ls-input");
    nameInp.placeholder = "e.g. Combat & Power, Romance & Chemistry, Finances…";
    nameInp.value = existing?.name ?? "";
    nameWrap.append(nameInp);
    topGrid.append(iconWrap, nameWrap);
    body.append(topGrid);
    const colorWrap = el("div", "ls-label", "Category Accent Color");
    const colorRow = el("div", "ls-row");
    const syncSwatches = () => {
      for (const b of [...colorRow.querySelectorAll(".ls-color-swatch")]) {
        b.setAttribute("aria-pressed", String(b.dataset.colorVal === selectedColor));
      }
    };
    for (const [val, lbl, preview] of [
      ["var(--lumiverse-primary)", "Theme Primary", "var(--lumiverse-primary, #38bdf8)"],
      ["#38bdf8", "Sky", "#38bdf8"],
      ["#f472b6", "Rose", "#f472b6"],
      ["#f59e0b", "Amber", "#f59e0b"],
      ["#10b981", "Emerald", "#10b981"],
      ["#a78bfa", "Violet", "#a78bfa"],
      ["#f43f5e", "Crimson", "#f43f5e"]
    ]) {
      const b = btn("", () => {
        selectedColor = val;
        syncSwatches();
      }, "ls-color-swatch", lbl);
      b.dataset.colorVal = val;
      b.style.background = preview;
      colorRow.append(b);
    }
    syncSwatches();
    colorWrap.append(colorRow);
    body.append(colorWrap);
    const toggleRow = el("div", "ls-row-between ls-stat-cell");
    toggleRow.append(el("strong", "", "Enable Category & All Stats Inside It"));
    const swSlot = el("div");
    toggleRow.append(swSlot);
    mountNativeSwitch(ctrl, modalScope, swSlot, {
      checked: enabled,
      ariaLabel: "Enable Category",
      onChange: (v) => {
        enabled = v;
      }
    });
    body.append(toggleRow);
    const flagsGrid = el("div", "ls-grid");
    for (const [lbl, initVal, setter] of [
      ["Show Category Header in HUD / Drawer", showGroupHeaderInHud, (v) => {
        showGroupHeaderInHud = v;
      }],
      ["Collapse Group by Default", collapsedByDefault, (v) => {
        collapsedByDefault = v;
      }],
      ["Include Category Stats & AI Rule in Story Continuity", injectInContinuity, (v) => {
        injectInContinuity = v;
      }]
    ]) {
      const slot = el("div");
      mountNativeCheckbox(ctrl, modalScope, slot, {
        checked: initVal,
        label: lbl,
        onChange: setter
      });
      flagsGrid.append(slot);
    }
    body.append(flagsGrid);
    const ruleHost = el("div");
    body.append(ruleHost);
    const ruleBody = mountNativeCollapsible(ctrl, modalScope, ruleHost, {
      title: "Shared Category AI Rule & Prompt Trigger",
      iconName: "sparkles",
      defaultExpanded: true,
      persistKey: "modal_cat_ai_rule"
    });
    ruleBody.append(el("small", "ls-muted", "This rule is printed ONCE for the group alongside each member stat’s own individual rule (individual stat rules remain completely untouched)."));
    const trigWrap = el("div", "ls-label", "Group Prompt Frequency");
    const trigSlot = el("div");
    trigWrap.append(trigSlot);
    ruleBody.append(trigWrap);
    const kwWrap = el("label", "ls-label", "Group Trigger Keywords (comma-separated)");
    const kwInp = el("input", "ls-input");
    kwInp.placeholder = "e.g. attack, fight, hit, spell, bleed, dodge";
    kwInp.value = (existing?.promptKeywords ?? []).join(", ");
    kwWrap.append(kwInp);
    ruleBody.append(kwWrap);
    const syncKwVis = () => {
      kwWrap.style.display = promptTriggerMode === "conditional" ? "" : "none";
    };
    syncKwVis();
    mountThemedSelect(ctrl, modalScope, trigSlot, {
      value: promptTriggerMode,
      ariaLabel: "Group Prompt Frequency",
      options: [
        { value: "always", label: "Always in Prompt" },
        { value: "conditional", label: "Only When Group Keywords Match" },
        { value: "manual", label: "Manual Sync Only" }
      ],
      onChange: (v) => {
        promptTriggerMode = v;
        syncKwVis();
      }
    });
    const aiRuleWrap = el("div", "ls-label");
    const aiRuleHead = el("div", "ls-row-between");
    const aiRuleArea = el("textarea", "ls-input");
    aiRuleArea.rows = 3;
    aiRuleArea.value = existing?.aiRule ?? "";
    aiRuleArea.placeholder = "Describe shared delta ranges, combat multipliers, romance pacing, or roleplay behavior for stats in this category…";
    aiRuleHead.append(el("span", "", "Shared Category AI / Delta Rule"), btn("⛶ Full-Screen Editor", () => {
      ctrl.request("textEditor:open", {
        title: `Category Rule: ${nameInp.value || "Category"}`,
        value: aiRuleArea.value,
        placeholder: "Describe shared rules for this stat group…"
      }).then((res) => {
        if (!res.cancelled && typeof res.text === "string") {
          aiRuleArea.value = res.text;
        }
      });
    }, "ls-btn-sm"));
    aiRuleWrap.append(aiRuleHead, aiRuleArea);
    ruleBody.append(aiRuleWrap);
    const localHost = el("div");
    body.append(localHost);
    const localBody = mountNativeCollapsible(ctrl, modalScope, localHost, {
      title: "Local Group Formula & Cross-Stat Modifiers (Optional)",
      iconName: "sliders",
      defaultExpanded: Boolean(existing?.localRuleFormula),
      persistKey: "modal_cat_local_rule"
    });
    localBody.append(el("small", "ls-muted", 'Supports conditional modifiers `mod("stat_id", "Label", delta)` (auto-applies while true and clears when false) and `set("stat_id", expr)` / `if(cond) mod(...)`.'));
    const localArea = el("textarea", "ls-input");
    localArea.rows = 3;
    localArea.placeholder = `e.g.
mod("composure", "High Arousal", arousal >= 75 ? -10 : 0)
if(HP < HP_max * 0.5) mod("composure", "Wounded", -10)`;
    localArea.value = existing?.localRuleFormula ?? "";
    const localStatus = el("div", "ls-formula-status");
    const localStatusMain = el("strong", "");
    localStatus.append(localStatusMain);
    const testLocalCategoryRule = () => {
      const draftCat = createStatCategory({
        ...existing,
        id: existing?.id,
        name: nameInp.value.trim() || "Preview Category",
        localRuleFormula: localArea.value
      });
      if (!localArea.value.trim()) {
        localStatus.dataset.status = "warn";
        localStatusMain.textContent = "No local group formula set (optional).";
        return;
      }
      const res = previewCategoryFormula(draftCat, ctrl.snapshot.state, tpl.stats, ctrl.selectedActorId);
      if (res.error) {
        localStatus.dataset.status = "error";
        localStatusMain.textContent = `✖ Error: ${res.error}`;
      } else if (res.appliedEffects.length > 0) {
        localStatus.dataset.status = "ok";
        localStatusMain.textContent = `✓ Active Effects: ${res.appliedEffects.join(" · ")}`;
      } else {
        localStatus.dataset.status = "ok";
        localStatusMain.textContent = "✓ Valid formula (0 active modifiers triggered on current state).";
      }
    };
    localArea.addEventListener("input", testLocalCategoryRule);
    testLocalCategoryRule();
    localBody.append(localArea, localStatus, btn("▶ Test Group Formula", testLocalCategoryRule, "ls-btn-sm"));
    const membersHost = el("div");
    body.append(membersHost);
    const membersBody = mountNativeCollapsible(ctrl, modalScope, membersHost, {
      title: `Member Stats in This Category (${memberIds.size})`,
      iconName: "stats",
      defaultExpanded: true,
      persistKey: "modal_cat_members"
    });
    const memGrid = el("div", "ls-grid");
    for (const s of tpl.stats) {
      const slot = el("div");
      mountNativeCheckbox(ctrl, modalScope, slot, {
        checked: memberIds.has(s.id),
        label: `${s.icon} ${s.label} (${s.scope})`,
        onChange: (on) => {
          if (on)
            memberIds.add(s.id);
          else
            memberIds.delete(s.id);
        }
      });
      memGrid.append(slot);
    }
    membersBody.append(memGrid);
    const footer = el("div", "ls-row-between");
    footer.style.marginTop = "12px";
    const leftBtns = el("div", "ls-row");
    if (existing) {
      leftBtns.append(btn("Delete Category", () => {
        const nextCats = existingCats.filter((c) => c.id !== existing.id);
        const nextStats = tpl.stats.map((s) => s.categoryId === existing.id ? { ...s, categoryId: undefined } : s);
        ctrl.request("state:mutate", {
          templatePatch: { categories: nextCats, stats: nextStats },
          reason: `Deleted category "${existing.name}" (stats preserved)`
        });
        close();
      }, "ls-btn-sm ls-btn-danger"));
    }
    const saveBtn = btn(existing ? "Save Category" : "Create Category", () => {
      const name = nameInp.value.trim();
      if (!name)
        return;
      const parsedKws = kwInp.value.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean);
      const created = createStatCategory({
        ...existing,
        id: existing?.id,
        name,
        icon: iconInp.value.trim() || "\uD83D\uDCC1",
        color: selectedColor,
        enabled,
        showGroupHeaderInHud,
        collapsedByDefault,
        injectInContinuity,
        promptTriggerMode,
        promptKeywords: parsedKws,
        aiRule: aiRuleArea.value.trim() || undefined,
        localRuleFormula: localArea.value.trim() || undefined,
        order: existing?.order ?? existingCats.length
      });
      const nextCats = existingCats.some((c) => c.id === created.id) ? existingCats.map((c) => c.id === created.id ? created : c) : [...existingCats, created];
      const nextStats = tpl.stats.map((s) => {
        if (memberIds.has(s.id))
          return { ...s, categoryId: created.id };
        if (s.categoryId === created.id)
          return { ...s, categoryId: undefined };
        return s;
      });
      ctrl.request("state:mutate", {
        templatePatch: { categories: nextCats, stats: nextStats },
        reason: `Saved category "${created.name}"`
      });
      close();
    }, "ls-btn-primary");
    footer.append(leftBtns, saveBtn);
    body.append(footer);
  });
}

// src/frontend/surfaces/studio/StudioStatsTab.ts
var activeStatsFilter = "all";
var statsSearchQuery = "";
var QUICK_ADD_STAT_PRESETS = [
  {
    label: "Blush & Fluster",
    icon: "\uD83D\uDC93",
    scope: "character",
    kind: "meter",
    min: 0,
    max: 100,
    defaultValue: 0,
    volatility: "momentary",
    triggerCues: "0–100 scale. Spikes immediately on teasing, eye contact, state of undress, or closeness; cools down in calm talk."
  },
  {
    label: "Jealousy & Possessiveness",
    icon: "\uD83D\uDD25",
    scope: "character",
    kind: "meter",
    min: 0,
    max: 100,
    defaultValue: 10,
    volatility: "momentary",
    triggerCues: "0–100 scale. Rises when the player praises, flirts with, or prioritizes another rival."
  },
  {
    label: "Respect & Standing",
    icon: "\uD83D\uDC51",
    scope: "character",
    kind: "meter",
    min: 0,
    max: 100,
    defaultValue: 50,
    volatility: "progressive",
    triggerCues: "0–100 scale. Rises when the player shows competence, poise, or backbone; drops on weakness."
  },
  {
    label: "Suspicion",
    icon: "\uD83D\uDD0D",
    scope: "character",
    kind: "meter",
    min: 0,
    max: 100,
    defaultValue: 15,
    volatility: "progressive",
    triggerCues: "0–100 scale. Increases when catching inconsistencies, secrets, or unusual behavior."
  },
  {
    label: "Stamina & Energy",
    icon: "⚡",
    scope: "player",
    kind: "meter",
    min: 0,
    max: 100,
    defaultValue: 100,
    volatility: "momentary",
    triggerCues: "0–100 scale. Spent during physical exertion, combat, or sleepless nights; restored by rest or meals."
  },
  {
    label: "Danger / Event Clock",
    icon: "⏱️",
    scope: "world",
    kind: "clock",
    min: 0,
    max: 6,
    defaultValue: 0,
    volatility: "progressive",
    triggerCues: "0–6 segments. Advance by +1 segment as an approaching confrontation, deadline, or alarm draws closer."
  },
  {
    label: "Skill Tree & SP",
    icon: "\uD83C\uDF33",
    scope: "player",
    kind: "skill_tree",
    min: 0,
    max: 100,
    defaultValue: 0,
    volatility: "progressive",
    triggerCues: 'Format: "SP: N | Skill A (Lv.X/Y, cost:1, bonus) ; Skill B (Lv.X/Y, cost:1, req:Skill A)". Award SP on milestones.'
  },
  {
    label: "Level & XP",
    icon: "⭐",
    scope: "player",
    kind: "xp_level",
    min: 0,
    max: 100,
    defaultValue: 0,
    volatility: "progressive",
    triggerCues: 'Format: "Lv. N | cur/next XP | Rank X". Award XP on quests/battles; level up when cur >= next.'
  },
  {
    label: "Core Attributes",
    icon: "\uD83E\uDDEC",
    scope: "player",
    kind: "attributes",
    min: 1,
    max: 30,
    defaultValue: 10,
    volatility: "anchor",
    triggerCues: 'Comma-separated stats: "STR:N, DEX:N, CON:N, INT:N, WIS:N, CHA:N".'
  },
  {
    label: "Gear & Inventory",
    icon: "\uD83C\uDF92",
    scope: "player",
    kind: "inventory",
    min: 0,
    max: 100,
    defaultValue: 0,
    volatility: "progressive",
    triggerCues: 'Separate items by "; " with qty & rarity tags: "Runed Blade [rare, equipped] ; Potion x3 [common]".'
  },
  {
    label: "Buffs & Debuffs",
    icon: "⚡",
    scope: "player",
    kind: "status_fx",
    min: 0,
    max: 100,
    defaultValue: 0,
    volatility: "momentary",
    triggerCues: 'Prefix buffs with "+" and debuffs with "-" separated by "; ", e.g. "+Shielded (2t) ; -Exhausted (1t)".'
  },
  {
    label: "Gold / Credits",
    icon: "\uD83E\uDE99",
    scope: "player",
    kind: "currency",
    min: 0,
    max: 99999999,
    defaultValue: 100,
    volatility: "progressive",
    triggerCues: "Track currency. Emit +N / -N on rewards, loot, or spending."
  }
];
var BUILTIN_IDS = [
  { id: "player_attire", group: "player" },
  { id: "player_condition", group: "player" },
  { id: "player_action", group: "player" },
  { id: "scene_summary", group: "scene_world" },
  { id: "places", group: "scene_world" },
  { id: "quests", group: "scene_world" },
  { id: "dispatches", group: "scene_world" },
  { id: "npc_conditions", group: "character" },
  { id: "npc_secrets", group: "character" }
];
function renderStudioStatsTab(ctrl, compScope, tpl, saveTemplatePatch, forceRedraw) {
  const wrap = el("div", "ls-stack");
  const topBar = el("div", "ls-row-between");
  const searchInp = el("input", "ls-input");
  searchInp.style.cssText = "flex:1 1 220px;min-width:160px;";
  searchInp.placeholder = "Search stats, meters, built-ins, or dossier fields…";
  searchInp.value = statsSearchQuery;
  const actionCluster = el("div", "ls-row");
  actionCluster.append(iconBtn("flask", () => openSandboxTesterModal(ctrl), {
    label: "Test Sandbox",
    className: "ls-btn-sm"
  }), iconBtn("plus", () => openStatCategoryModal(ctrl), {
    label: "New Category",
    className: "ls-btn-sm",
    title: "Create a custom Stat Category with shared AI/local rules"
  }), iconBtn("plus", () => openStatSchemaModal(ctrl, "character"), {
    label: "New Stat",
    className: "ls-btn-sm ls-btn-primary"
  }));
  topBar.append(searchInp, actionCluster);
  wrap.append(topBar);
  const filterRow = el("div", "ls-subnav-pills");
  for (const [fId, fLbl] of [
    ["all", "All Trackers"],
    ["categories", `Categories (${(tpl.categories ?? []).length})`],
    ["character", "NPC Meters"],
    ["player", "Player Stats"],
    ["scene_world", "Scene & World"],
    ["builtin", "Built-Ins & Pill"],
    ["dossier", "Dossier Fields"]
  ]) {
    const b = btn(fLbl, () => {
      activeStatsFilter = fId;
      forceRedraw();
    }, "ls-btn-sm");
    if (activeStatsFilter === fId)
      b.setAttribute("aria-current", "page");
    filterRow.append(b);
  }
  wrap.append(filterRow);
  const quickHost = el("div");
  wrap.append(quickHost);
  const quickBody = mountNativeCollapsible(ctrl, compScope, quickHost, {
    title: "1-Click Quick-Add Popular Stats",
    iconName: "sparkles",
    badge: QUICK_ADD_STAT_PRESETS.length,
    defaultExpanded: false,
    persistKey: "studio_stats_quick_add"
  });
  const quickRow = el("div", "ls-row");
  for (const item of QUICK_ADD_STAT_PRESETS) {
    const exists = tpl.stats.some((s) => s.id === slugifyKey(item.label, "stat"));
    const b = btn(`${exists ? "✓ " : "+ "}${item.icon} ${item.label}`, () => {
      const created = createStatSchema({
        label: item.label,
        icon: item.icon,
        scope: item.scope,
        kind: item.kind,
        min: item.min,
        max: item.max,
        defaultValue: item.defaultValue,
        volatility: item.volatility,
        triggerCues: item.triggerCues
      });
      saveTemplatePatch((live) => ({ stats: [...live.stats.filter((s) => s.id !== created.id), created] }), `Added stat "${created.label}"`);
      ctrl.notify(`Added "${created.icon} ${created.label}".`);
    }, `ls-btn-sm ls-quick-pill ${exists ? "ls-chip-accent" : ""}`, item.triggerCues);
    quickRow.append(b);
  }
  quickBody.append(quickRow);
  const listHost = el("div", "ls-stack");
  wrap.append(listHost);
  const renderFilteredLists = () => {
    listHost.replaceChildren();
    const q = statsSearchQuery.trim().toLowerCase();
    const matchesQuery = (text) => !q || text.toLowerCase().includes(q);
    if ((activeStatsFilter === "all" || activeStatsFilter === "scene_world" || activeStatsFilter === "builtin") && matchesQuery("scene pill location time date weather clock")) {
      const pillRow = el("div", "ls-stat-row-compact");
      pillRow.style.borderLeft = "3px solid var(--ls-primary)";
      const left = el("div", "ls-row");
      left.append(el("strong", "", "\uD83D\uDCCD Scene Pill (Location, Time, Date, Weather)"), el("span", "ls-chip ls-chip-accent", tpl.coreTrackers?.scenePillLocked ? "\uD83D\uDD12 Locked" : "Built-In Pill"));
      const right = el("div", "ls-row");
      right.append(btn("Full Edit & Prompts", () => openScenePillEditorModal(ctrl), "ls-btn-sm ls-btn-primary"));
      pillRow.append(left, right);
      listHost.append(pillRow);
    }
    const renderCompactStatRow = (schema) => {
      const row = el("div", "ls-stat-row-compact");
      row.style.borderLeft = `3px solid ${schema.color || "var(--ls-primary)"}`;
      const left = el("div", "ls-row");
      left.style.minWidth = "0";
      const swSlot = el("div");
      mountNativeSwitch(ctrl, compScope, swSlot, {
        checked: schema.enabled,
        ariaLabel: `Toggle ${schema.label}`,
        onChange: (on) => {
          saveTemplatePatch((live) => ({
            stats: live.stats.map((s) => s.id === schema.id ? { ...s, enabled: on } : s)
          }));
        }
      });
      const showRange = !isTextLikeStat(schema) && schema.kind !== "boolean";
      const typeLabel = showRange ? `${schema.kind} (${schema.min}–${schema.max})` : schema.kind;
      const scopeLabel = schema.scope === "character" ? "NPC" : schema.scope;
      const modeBadge = schema.calculationMode === "ai_plus_local" ? "\uD83D\uDD00 Hybrid" : schema.calculationMode === "local_formula" || Boolean(schema.formula?.trim()) && schema.calculationMode !== "ai" ? "⚡ Local" : "\uD83E\uDD16 AI";
      left.append(swSlot, el("strong", "", `${schema.icon} ${schema.label}`), el("span", "ls-chip", `${scopeLabel} · ${typeLabel}`), el("span", `ls-chip ${modeBadge !== "\uD83E\uDD16 AI" ? "ls-chip-accent" : ""}`, modeBadge), ...schema.promptTriggerMode === "conditional" ? [el("span", "ls-chip", "\uD83D\uDD0D Conditional")] : [], ...schema.pinnedToHeader ? [el("span", "ls-chip ls-chip-accent", "Pinned")] : [], ...schema.locked ? [el("span", "ls-chip", "\uD83D\uDD12")] : []);
      const right = el("div", "ls-row");
      right.style.flex = "none";
      right.append(btn("Full Edit", () => openStatSchemaModal(ctrl, schema.scope, schema), "ls-btn-sm"), iconBtn("trash", () => {
        saveTemplatePatch((live) => ({
          stats: live.stats.filter((s) => s.id !== schema.id)
        }), `Deleted stat "${schema.label}"`);
        ctrl.notify(`Deleted "${schema.icon} ${schema.label}".`);
      }, {
        className: "ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger",
        title: `Delete "${schema.label}"`
      }), iconBtn("more", async (e) => {
        if (typeof ctrl.ctx.ui?.showContextMenu !== "function") {
          openStatSchemaModal(ctrl, schema.scope, schema);
          return;
        }
        const { selectedKey } = await ctrl.ctx.ui.showContextMenu({
          position: { x: e.clientX, y: e.clientY },
          items: [
            { key: "edit", label: "Full Edit (Style, Tabs & AI Prompt)" },
            { key: "pin", label: schema.pinnedToHeader ? "Unpin from Pill" : "Pin to Scene Pill", active: schema.pinnedToHeader },
            { key: "lock", label: schema.locked ? "Unlock Value" : "Lock Value", active: schema.locked },
            { key: "duplicate", label: "Duplicate to Another Scope / Tab…" },
            { key: "test", label: "Test in AI Sandbox" },
            { key: "div", label: "", type: "divider" },
            { key: "delete", label: "Delete Stat", danger: true }
          ]
        });
        if (selectedKey === "edit")
          openStatSchemaModal(ctrl, schema.scope, schema);
        else if (selectedKey === "pin") {
          saveTemplatePatch((live) => ({
            stats: live.stats.map((s) => s.id === schema.id ? {
              ...s,
              pinnedToHeader: !s.pinnedToHeader,
              showIn: { ...s.showIn, pinnedHeader: !s.pinnedToHeader }
            } : s)
          }));
        } else if (selectedKey === "lock") {
          saveTemplatePatch((live) => ({
            stats: live.stats.map((s) => s.id === schema.id ? { ...s, locked: !s.locked } : s)
          }));
        } else if (selectedKey === "duplicate") {
          openDuplicateStatModal(ctrl, schema);
        } else if (selectedKey === "test") {
          openSandboxTesterModal(ctrl, schema.id);
        } else if (selectedKey === "delete") {
          saveTemplatePatch((live) => ({
            stats: live.stats.filter((s) => s.id !== schema.id)
          }));
        }
      }, { className: "ls-btn-sm ls-btn-icon ls-btn-ghost", title: "More actions" }));
      row.append(left, right);
      return row;
    };
    const definedCategories = [...tpl.categories ?? []].sort((a, b) => a.order - b.order);
    const categoryIdSet = new Set(definedCategories.map((c) => c.id));
    const filteredStats = tpl.stats.filter((s) => {
      if (activeStatsFilter === "dossier" || activeStatsFilter === "builtin")
        return false;
      if (activeStatsFilter === "character" && s.scope !== "character")
        return false;
      if (activeStatsFilter === "player" && s.scope !== "player")
        return false;
      if (activeStatsFilter === "scene_world" && s.scope !== "world" && s.scope !== "scene")
        return false;
      return matchesQuery(`${s.label} ${s.id} ${s.kind} ${s.triggerCues}`);
    });
    if (activeStatsFilter === "categories" && definedCategories.length === 0) {
      const emptyCat = el("section", "ls-card");
      emptyCat.append(el("strong", "", "No custom categories created yet"), el("p", "ls-muted", "Group related stats (e.g. Combat & Power, Romance, Finances) to attach shared AI delta rules, group keyword triggers, or cross-stat local modifiers—while keeping each stat’s own rules intact."), btn("+ Create First Category", () => openStatCategoryModal(ctrl), "ls-btn-sm ls-btn-primary"));
      listHost.append(emptyCat);
    }
    for (const cat of definedCategories) {
      const members = filteredStats.filter((s) => s.categoryId === cat.id);
      if (activeStatsFilter !== "categories" && members.length === 0 && q)
        continue;
      if (activeStatsFilter !== "all" && activeStatsFilter !== "categories" && members.length === 0) {
        continue;
      }
      const catCard = el("section", "ls-card ls-cat-group");
      catCard.style.borderLeft = `3px solid ${cat.color || "var(--ls-primary)"}`;
      const catHead = el("div", "ls-row-between");
      const catLeft = el("div", "ls-row");
      const catSwSlot = el("div");
      mountNativeSwitch(ctrl, compScope, catSwSlot, {
        checked: cat.enabled,
        ariaLabel: `Toggle category ${cat.name}`,
        onChange: (on) => {
          saveTemplatePatch((live) => ({
            categories: (live.categories ?? []).map((c) => c.id === cat.id ? { ...c, enabled: on } : c)
          }));
        }
      });
      catLeft.append(catSwSlot, el("strong", "", `${cat.icon} ${cat.name}`), el("span", "ls-chip", `${members.length} stats`), ...cat.aiRule ? [el("span", "ls-chip ls-chip-accent", "Shared Rule")] : [], ...cat.localRuleFormula ? [el("span", "ls-chip ls-chip-accent", "⚡ Local Rule")] : [], ...cat.promptTriggerMode === "conditional" ? [el("span", "ls-chip", "\uD83D\uDD0D Conditional")] : []);
      const catRight = el("div", "ls-row");
      catRight.append(btn("Edit Group & Rules", () => openStatCategoryModal(ctrl, cat), "ls-btn-sm"));
      catHead.append(catLeft, catRight);
      catCard.append(catHead);
      if (members.length > 0) {
        const catHost = el("div");
        catCard.append(catHost);
        const catBody = mountNativeCollapsible(ctrl, compScope, catHost, {
          title: `Member Stats (${members.length})`,
          defaultExpanded: !cat.collapsedByDefault,
          persistKey: `studio_cat_${cat.id}`
        });
        for (const s of members) {
          catBody.append(renderCompactStatRow(s));
        }
      } else {
        catCard.append(el("small", "ls-muted", 'No stats assigned to this category yet. Click "Edit Group & Rules" to assign stats.'));
      }
      listHost.append(catCard);
    }
    const uncategorizedStats = filteredStats.filter((s) => !s.categoryId || !categoryIdSet.has(s.categoryId));
    if (uncategorizedStats.length > 0 && activeStatsFilter !== "categories") {
      const statCard = el("section", "ls-card");
      const sHead = el("div", "ls-row-between");
      sHead.append(el("h3", "", definedCategories.length > 0 ? `Uncategorized Stats (${uncategorizedStats.length})` : `Stats & Meters (${uncategorizedStats.length})`), el("span", "ls-muted", "Click Full Edit to customize prompt, category, style & formula"));
      statCard.append(sHead);
      for (const s of uncategorizedStats) {
        statCard.append(renderCompactStatRow(s));
      }
      listHost.append(statCard);
    }
    const deletedBuiltinsCount = BUILTIN_IDS.filter((item) => Boolean(tpl.coreTrackers?.overrides?.[item.id]?.deleted)).length;
    const filteredBuiltins = BUILTIN_IDS.filter((item) => {
      if (activeStatsFilter === "dossier")
        return false;
      if (activeStatsFilter !== "all" && activeStatsFilter !== "builtin" && item.group !== activeStatsFilter) {
        return false;
      }
      const cfg = resolveBuiltInTrackerConfig(tpl.coreTrackers, item.id);
      if (cfg.deleted)
        return false;
      return matchesQuery(`${item.id} ${cfg.label} ${cfg.instruction}`);
    });
    if (filteredBuiltins.length > 0 || deletedBuiltinsCount > 0 && (activeStatsFilter === "all" || activeStatsFilter === "builtin")) {
      const builtCard = el("section", "ls-card");
      const builtHead = el("div", "ls-row-between");
      const builtRightHead = el("div", "ls-row");
      if (deletedBuiltinsCount > 0) {
        builtRightHead.append(btn(`↺ Restore Deleted (${deletedBuiltinsCount})`, () => {
          saveTemplatePatch((live) => {
            const nextOverrides = { ...live.coreTrackers?.overrides ?? {} };
            for (const k of Object.keys(nextOverrides)) {
              if (nextOverrides[k]?.deleted) {
                nextOverrides[k] = { ...nextOverrides[k], deleted: false };
              }
            }
            return {
              coreTrackers: {
                ...live.coreTrackers ?? {},
                overrides: nextOverrides
              }
            };
          }, "Restored deleted built-in trackers");
        }, "ls-btn-sm ls-btn-ghost"));
      } else {
        builtRightHead.append(el("span", "ls-muted", "Editable labels, prompts, styles & tabs"));
      }
      builtHead.append(el("h3", "", `Built-In Story Trackers (${filteredBuiltins.length})`), builtRightHead);
      builtCard.append(builtHead);
      const toggleMap = {
        player_attire: "trackPlayerAttire",
        player_condition: "trackPlayerCondition",
        player_action: "trackPlayerAction",
        scene_summary: "trackSceneSummary",
        places: "trackPlaces",
        quests: "trackQuests",
        dispatches: "trackDispatches",
        npc_conditions: "trackNpcConditions",
        npc_secrets: "trackNpcSecrets"
      };
      const showCardMap = {
        player_attire: "showPlayerAttireCard",
        player_condition: "showPlayerConditionCard",
        player_action: "showPlayerActionCard",
        scene_summary: "showSceneSummaryInWidget",
        quests: "showQuestsInWidget",
        dispatches: "showDispatchesInWidget"
      };
      for (const item of filteredBuiltins) {
        const cfg = resolveBuiltInTrackerConfig(tpl.coreTrackers, item.id);
        const row = el("div", "ls-stat-row-compact");
        row.style.borderLeft = `3px solid ${cfg.color || "var(--ls-primary)"}`;
        const left = el("div", "ls-row");
        const swSlot = el("div");
        mountNativeSwitch(ctrl, compScope, swSlot, {
          checked: cfg.enabled,
          ariaLabel: `Toggle ${cfg.label}`,
          onChange: (on) => {
            saveTemplatePatch((live) => {
              const core = { ...live.coreTrackers ?? {} };
              core[toggleMap[item.id]] = on;
              return { coreTrackers: core };
            });
          }
        });
        left.append(swSlot, el("strong", "", `${cfg.icon || "\uD83D\uDCCA"} ${cfg.label}`), el("span", "ls-chip", "Built-In"), ...cfg.locked ? [el("span", "ls-chip", "\uD83D\uDD12")] : []);
        const right = el("div", "ls-row");
        right.append(btn("Full Edit", () => openBuiltinTrackerModal(ctrl, item.id), "ls-btn-sm"), iconBtn("trash", () => {
          saveTemplatePatch((live) => {
            const core = { ...live.coreTrackers ?? {} };
            core[toggleMap[item.id]] = false;
            const cardKey = showCardMap[item.id];
            if (cardKey)
              core[cardKey] = false;
            const prevOv = core.overrides ?? {};
            core.overrides = {
              ...prevOv,
              [item.id]: {
                ...prevOv[item.id] ?? {},
                deleted: true
              }
            };
            return { coreTrackers: core };
          }, `Deleted built-in tracker "${cfg.label}"`);
          ctrl.notify(`Removed "${cfg.label}".`);
        }, {
          className: "ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger",
          title: `Remove "${cfg.label}"`
        }));
        row.append(left, right);
        builtCard.append(row);
      }
      listHost.append(builtCard);
    }
    const filteredFields = tpl.dossierFields.filter((f) => {
      if (activeStatsFilter !== "all" && activeStatsFilter !== "dossier" && activeStatsFilter !== "character") {
        return false;
      }
      return matchesQuery(`${f.label} ${f.id} ${f.instruction}`);
    });
    if (filteredFields.length > 0 || activeStatsFilter === "dossier") {
      const dfCard = el("section", "ls-card");
      const dfHead = el("div", "ls-row-between");
      dfHead.append(el("h3", "", `Character Dossier Fields (${filteredFields.length})`), el("div", "ls-row"));
      dfHead.lastElementChild.append(btn("Restore Defaults", () => {
        saveTemplatePatch({ dossierFields: defaultDossierFields() }, "Restored default dossier fields");
      }, "ls-btn-sm ls-btn-ghost"), iconBtn("plus", () => openDossierFieldModal(ctrl), {
        label: "New Field",
        className: "ls-btn-sm ls-btn-primary"
      }));
      dfCard.append(dfHead);
      for (const field of filteredFields) {
        const row = el("div", "ls-stat-row-compact");
        row.style.borderLeft = `3px solid ${field.color || "var(--ls-primary)"}`;
        const left = el("div", "ls-row");
        const swSlot = el("div");
        mountNativeSwitch(ctrl, compScope, swSlot, {
          checked: field.enabled,
          ariaLabel: `Toggle ${field.label}`,
          onChange: (on) => {
            saveTemplatePatch((live) => ({
              dossierFields: live.dossierFields.map((x) => x.id === field.id ? { ...x, enabled: on } : x)
            }));
          }
        });
        left.append(swSlot, el("strong", "", `${field.icon} ${field.label}`), el("span", "ls-chip", `Dossier · ${field.displayStyle || "card"}`));
        const right = el("div", "ls-row");
        right.append(btn("Full Edit", () => openDossierFieldModal(ctrl, field), "ls-btn-sm"), iconBtn("trash", () => {
          saveTemplatePatch((live) => ({
            dossierFields: live.dossierFields.filter((x) => x.id !== field.id)
          }));
        }, { className: "ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger", title: "Delete field" }));
        row.append(left, right);
        dfCard.append(row);
      }
      listHost.append(dfCard);
    }
  };
  searchInp.addEventListener("input", () => {
    statsSearchQuery = searchInp.value;
    renderFilteredLists();
  });
  renderFilteredLists();
  return wrap;
}

// src/frontend/surfaces/studio/StudioSurfacesTab.ts
var activeExtremeSubTab = "tabs";
function renderStudioSurfacesTab(ctrl, compScope, tpl, saveTemplatePatch, forceRedraw) {
  const wrap = el("div", "ls-stack");
  const subNav = el("div", "ls-subnav-pills");
  for (const [sId, sLbl] of [
    ["tabs", "1. Widget & Inline Tabs"],
    ["dossier", "2. Dossier Tabs"],
    ["matrix", "3. Stat Placement Matrix"],
    ["banners", "4. Scene Pill & Custom HTML"]
  ]) {
    const b = btn(sLbl, () => {
      activeExtremeSubTab = sId;
      forceRedraw();
    }, "ls-btn-sm");
    if (activeExtremeSubTab === sId)
      b.setAttribute("aria-current", "page");
    subNav.append(b);
  }
  wrap.append(subNav);
  if (activeExtremeSubTab === "tabs") {
    const featureCard = el("section", "ls-card");
    featureCard.append(el("h3", "", "Relationship Web & Peer Bonds"));
    const featureGrid = el("div", "ls-grid");
    for (const [fKey, fLbl] of [
      ["showRelationshipWeb", "Enable Relationship Web Tab"],
      ["trackNpcBonds", "Track NPC↔NPC Peer Bonds"]
    ]) {
      const slot = el("div");
      mountNativeCheckbox(ctrl, compScope, slot, {
        checked: tpl.surfaces[fKey] !== false,
        label: fLbl,
        onChange: (on) => saveTemplatePatch((live) => ({ surfaces: { ...live.surfaces, [fKey]: on } }))
      });
      featureGrid.append(slot);
    }
    featureCard.append(featureGrid);
    wrap.append(featureCard);
    const buildSurfaceTabEditor = (title, surfaceKey, tabs) => {
      const card = el("section", "ls-card");
      card.append(el("h3", "", title));
      const sorted = [...tabs].sort((a, b) => a.order - b.order);
      const commitTabs = (updater) => {
        saveTemplatePatch((live) => {
          const curSorted = [...live.surfaces[surfaceKey]].sort((a, b) => a.order - b.order);
          return {
            surfaces: {
              ...live.surfaces,
              [surfaceKey]: updater(curSorted)
            }
          };
        });
      };
      sorted.forEach((tab, idx) => {
        const row = el("div", "ls-stat-row-compact");
        const left = el("div", "ls-row");
        const swSlot = el("div");
        mountNativeSwitch(ctrl, compScope, swSlot, {
          checked: tab.enabled,
          ariaLabel: `Toggle ${tab.label}`,
          onChange: (on) => {
            commitTabs((liveTabs) => liveTabs.map((t) => t.id === tab.id ? { ...t, enabled: on } : t));
          }
        });
        const iconInp = el("input", "ls-input");
        iconInp.style.cssText = "width:44px;min-height:28px;padding:2px 6px;";
        iconInp.value = tab.icon;
        iconInp.addEventListener("change", () => {
          const nextIcon = iconInp.value.trim() || "\uD83D\uDCCA";
          commitTabs((liveTabs) => liveTabs.map((t) => t.id === tab.id ? { ...t, icon: nextIcon } : t));
        });
        const lblInp = el("input", "ls-input");
        lblInp.style.cssText = "width:130px;min-height:28px;padding:2px 8px;";
        lblInp.value = tab.label;
        lblInp.addEventListener("change", () => {
          const nextLabel = lblInp.value.trim() || tab.label;
          commitTabs((liveTabs) => liveTabs.map((t) => t.id === tab.id ? { ...t, label: nextLabel } : t));
        });
        const kindSlot = el("div");
        mountThemedSelect(ctrl, compScope, kindSlot, {
          value: tab.kind,
          compact: true,
          ariaLabel: "Surface Tab Kind",
          options: [
            { value: "stats", label: "Stats Grid" },
            { value: "cast", label: "Cast List" },
            { value: "web", label: "Bond Web" },
            { value: "map", label: "Spatial Atlas" },
            { value: "world", label: "World & Clocks" },
            { value: "custom", label: "Custom Tab" }
          ],
          onChange: (nextKind) => {
            commitTabs((liveTabs) => liveTabs.map((t) => t.id === tab.id ? { ...t, kind: nextKind } : t));
          }
        });
        left.append(swSlot, iconInp, lblInp, kindSlot);
        const right = el("div", "ls-row");
        if (idx > 0) {
          right.append(btn("↑", () => {
            commitTabs((liveTabs) => {
              const curIdx = liveTabs.findIndex((t) => t.id === tab.id);
              if (curIdx <= 0)
                return liveTabs;
              const nextList = [...liveTabs];
              [nextList[curIdx - 1], nextList[curIdx]] = [nextList[curIdx], nextList[curIdx - 1]];
              return nextList.map((t, i) => ({ ...t, order: i }));
            });
          }, "ls-btn-sm ls-btn-icon ls-btn-ghost"));
        }
        if (idx < sorted.length - 1) {
          right.append(btn("↓", () => {
            commitTabs((liveTabs) => {
              const curIdx = liveTabs.findIndex((t) => t.id === tab.id);
              if (curIdx < 0 || curIdx >= liveTabs.length - 1)
                return liveTabs;
              const nextList = [...liveTabs];
              [nextList[curIdx], nextList[curIdx + 1]] = [nextList[curIdx + 1], nextList[curIdx]];
              return nextList.map((t, i) => ({ ...t, order: i }));
            });
          }, "ls-btn-sm ls-btn-icon ls-btn-ghost"));
        }
        if (sorted.length > 1) {
          right.append(iconBtn("trash", () => commitTabs((liveTabs) => liveTabs.filter((t) => t.id !== tab.id)), {
            className: "ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger",
            title: "Delete tab"
          }));
        }
        row.append(left, right);
        card.append(row);
      });
      const addRow = el("div", "ls-row");
      const newIcon = el("input", "ls-input");
      newIcon.style.width = "50px";
      newIcon.value = "✨";
      const newLbl = el("input", "ls-input");
      newLbl.style.flex = "1";
      newLbl.placeholder = "New tab name (e.g. Gear, Plans, Clues)…";
      addRow.append(newIcon, newLbl, iconBtn("plus", () => {
        const lbl = newLbl.value.trim();
        if (!lbl)
          return;
        const icon = newIcon.value.trim() || "✨";
        commitTabs((liveTabs) => [
          ...liveTabs,
          {
            id: slugifyKey(lbl, `tab_${liveTabs.length + 1}`),
            label: lbl,
            icon,
            kind: "custom",
            enabled: true,
            order: liveTabs.length
          }
        ]);
      }, { label: "Add Tab", className: "ls-btn-sm ls-btn-primary" }));
      card.append(addRow);
      return card;
    };
    wrap.append(buildSurfaceTabEditor("Floating HUD Widget Tabs", "widgetTabs", tpl.surfaces.widgetTabs), buildSurfaceTabEditor("Inline Message Ribbon Tabs", "inlineTabs", tpl.surfaces.inlineTabs));
  } else if (activeExtremeSubTab === "dossier") {
    const dosCard = el("section", "ls-card");
    dosCard.append(el("h3", "", "Character Dossier Tabs"));
    const sortedDos = [...tpl.surfaces.dossierTabs].sort((a, b) => a.order - b.order);
    sortedDos.forEach((dTab, idx) => {
      const box = el("div", "ls-stat-cell");
      const top = el("div", "ls-row-between");
      const left = el("div", "ls-row");
      const commitDosTabs = (updater) => {
        saveTemplatePatch((live) => {
          const curSorted = [...live.surfaces.dossierTabs].sort((a, b) => a.order - b.order);
          return {
            surfaces: {
              ...live.surfaces,
              dossierTabs: updater(curSorted)
            }
          };
        });
      };
      const swSlot = el("div");
      mountNativeSwitch(ctrl, compScope, swSlot, {
        checked: dTab.enabled,
        onChange: (on) => {
          commitDosTabs((liveTabs) => liveTabs.map((x) => x.id === dTab.id ? { ...x, enabled: on } : x));
        }
      });
      const icInp = el("input", "ls-input");
      icInp.style.cssText = "width:44px;min-height:28px;padding:2px 6px;";
      icInp.value = dTab.icon;
      icInp.addEventListener("change", () => {
        const nextIcon = icInp.value.trim() || "\uD83E\uDEAA";
        commitDosTabs((liveTabs) => liveTabs.map((x) => x.id === dTab.id ? { ...x, icon: nextIcon } : x));
      });
      const lbInp = el("input", "ls-input");
      lbInp.style.cssText = "width:150px;min-height:28px;padding:2px 8px;";
      lbInp.value = dTab.label;
      lbInp.addEventListener("change", () => {
        const nextLabel = lbInp.value.trim() || dTab.label;
        commitDosTabs((liveTabs) => liveTabs.map((x) => x.id === dTab.id ? { ...x, label: nextLabel } : x));
      });
      left.append(swSlot, icInp, lbInp);
      const right = el("div", "ls-row");
      if (idx > 0) {
        right.append(btn("↑", () => {
          commitDosTabs((liveTabs) => {
            const curIdx = liveTabs.findIndex((x) => x.id === dTab.id);
            if (curIdx <= 0)
              return liveTabs;
            const nextList = [...liveTabs];
            [nextList[curIdx - 1], nextList[curIdx]] = [nextList[curIdx], nextList[curIdx - 1]];
            return nextList.map((t, i) => ({ ...t, order: i }));
          });
        }, "ls-btn-sm ls-btn-icon ls-btn-ghost"));
      }
      if (idx < sortedDos.length - 1) {
        right.append(btn("↓", () => {
          commitDosTabs((liveTabs) => {
            const curIdx = liveTabs.findIndex((x) => x.id === dTab.id);
            if (curIdx < 0 || curIdx >= liveTabs.length - 1)
              return liveTabs;
            const nextList = [...liveTabs];
            [nextList[curIdx], nextList[curIdx + 1]] = [nextList[curIdx + 1], nextList[curIdx]];
            return nextList.map((t, i) => ({ ...t, order: i }));
          });
        }, "ls-btn-sm ls-btn-icon ls-btn-ghost"));
      }
      if (sortedDos.length > 1) {
        right.append(iconBtn("trash", () => commitDosTabs((liveTabs) => liveTabs.filter((x) => x.id !== dTab.id)), { className: "ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger", title: "Delete dossier tab" }));
      }
      top.append(left, right);
      box.append(top);
      const secRow = el("div", "ls-row");
      for (const [prop, lbl] of [
        ["showMeters", "Meters"],
        ["showNpcBonds", "Peer Bonds"],
        ["showFields", "Fields"],
        ["showSecrets", "Secrets"],
        ["showAudit", "Audit Log"]
      ]) {
        const slot = el("div");
        mountNativeCheckbox(ctrl, compScope, slot, {
          checked: Boolean(dTab[prop]),
          label: lbl,
          onChange: (on) => {
            commitDosTabs((liveTabs) => liveTabs.map((x) => x.id === dTab.id ? { ...x, [prop]: on } : x));
          }
        });
        secRow.append(slot);
      }
      box.append(secRow);
      dosCard.append(box);
    });
    const addDosRow = el("div", "ls-row");
    const newDosIcon = el("input", "ls-input");
    newDosIcon.style.width = "50px";
    newDosIcon.value = "⚔️";
    const newDosLbl = el("input", "ls-input");
    newDosLbl.style.flex = "1";
    newDosLbl.placeholder = "New Dossier Tab (e.g. Combat Arts, Wardrobe)…";
    addDosRow.append(newDosIcon, newDosLbl, iconBtn("plus", () => {
      const lbl = newDosLbl.value.trim();
      if (!lbl)
        return;
      const icon = newDosIcon.value.trim() || "✨";
      saveTemplatePatch((live) => {
        const curDos = [...live.surfaces.dossierTabs].sort((a, b) => a.order - b.order);
        const created = {
          id: slugifyKey(lbl, `dtab_${curDos.length + 1}`),
          label: lbl,
          icon,
          kind: "custom",
          enabled: true,
          order: curDos.length,
          showMeters: true,
          showFields: true,
          showSecrets: false,
          showAudit: false,
          showNpcBonds: false
        };
        return { surfaces: { ...live.surfaces, dossierTabs: [...curDos, created] } };
      });
    }, { label: "Add Dossier Tab", className: "ls-btn-sm ls-btn-primary" }));
    dosCard.append(addDosRow);
    wrap.append(dosCard);
  } else if (activeExtremeSubTab === "matrix") {
    const matrixCard = el("section", "ls-card");
    matrixCard.append(el("h3", "", "Stat Placement Matrix"), el("p", "ls-muted", "Choose which surfaces and tabs display each stat."));
    const sortedDos = [...tpl.surfaces.dossierTabs].sort((a, b) => a.order - b.order);
    for (const s of tpl.stats) {
      const mRow = el("div", "ls-stat-cell");
      const top = el("div", "ls-row-between");
      const actBtns = el("div", "ls-row");
      actBtns.append(iconBtn("copy", () => openDuplicateStatModal(ctrl, s), {
        label: "Duplicate",
        className: "ls-btn-sm ls-btn-ghost"
      }), iconBtn("edit", () => openStatSchemaModal(ctrl, s.scope, s), {
        label: "Edit",
        className: "ls-btn-sm"
      }));
      top.append(el("strong", "", `${s.icon} ${s.label} (${s.scope})`), actBtns);
      mRow.append(top);
      const visCluster = el("div", "ls-row");
      for (const [vKey, vLbl] of [
        ["widget", "Widget"],
        ["inline", "Inline"],
        ["dossier", "Dossier"],
        ["pinnedHeader", "Pill"]
      ]) {
        const slot = el("div");
        mountNativeCheckbox(ctrl, compScope, slot, {
          checked: Boolean(s.showIn?.[vKey]),
          label: vLbl,
          onChange: (on) => {
            saveTemplatePatch((live) => ({
              stats: live.stats.map((st) => st.id === s.id ? {
                ...st,
                showIn: { ...st.showIn, [vKey]: on },
                ...vKey === "pinnedHeader" ? { pinnedToHeader: on } : {}
              } : st)
            }));
          }
        });
        visCluster.append(slot);
      }
      const wSlot = el("div");
      mountThemedSelect(ctrl, compScope, wSlot, {
        value: s.widgetTabId || (s.scope === "character" ? "cast" : "stats"),
        compact: true,
        ariaLabel: "Widget Tab",
        options: tpl.surfaces.widgetTabs.map((wt) => ({ value: wt.id, label: `Widget: ${wt.label}` })),
        onChange: (nextW) => {
          saveTemplatePatch((live) => ({
            stats: live.stats.map((st) => st.id === s.id ? { ...st, widgetTabId: nextW } : st)
          }));
        }
      });
      const iSlot = el("div");
      mountThemedSelect(ctrl, compScope, iSlot, {
        value: s.inlineTabId || (s.scope === "character" ? "cast" : "stats"),
        compact: true,
        ariaLabel: "Inline Tab",
        options: tpl.surfaces.inlineTabs.map((it) => ({ value: it.id, label: `Inline: ${it.label}` })),
        onChange: (nextI) => {
          saveTemplatePatch((live) => ({
            stats: live.stats.map((st) => st.id === s.id ? { ...st, inlineTabId: nextI } : st)
          }));
        }
      });
      const dSlot = el("div");
      mountThemedSelect(ctrl, compScope, dSlot, {
        value: s.dossierTabId || "bonds",
        compact: true,
        ariaLabel: "Dossier Tab",
        options: sortedDos.map((dt) => ({ value: dt.id, label: `Dossier: ${dt.label}` })),
        onChange: (nextD) => {
          saveTemplatePatch((live) => ({
            stats: live.stats.map((st) => st.id === s.id ? { ...st, dossierTabId: nextD } : st)
          }));
        }
      });
      visCluster.append(wSlot, iSlot, dSlot);
      mRow.append(visCluster);
      matrixCard.append(mRow);
    }
    wrap.append(matrixCard);
  } else {
    const htmlCard = el("section", "ls-card");
    const head = el("div", "ls-row-between");
    head.append(el("h3", "", "Scene Pill Chips & Custom HTML Banners"), btn("Edit Scene Pill Prompts", () => openScenePillEditorModal(ctrl), "ls-btn-sm ls-btn-primary"));
    htmlCard.append(head, el("p", "ls-muted", "Custom banners support {{location}}, {{time}}, {{date}}, {{weather}}, {{player_attire}}, {{name}}, and {{stat:id}}."));
    const chipsGrid = el("div", "ls-grid");
    for (const [k, lbl] of [
      ["time", "Time Chip"],
      ["date", "Date Chip"],
      ["location", "Location Chip"],
      ["weather", "Weather Chip"],
      ["cast", "Present Cast Chips"],
      ["pinnedStats", "Pinned Stat Chips"]
    ]) {
      const slot = el("div");
      mountNativeCheckbox(ctrl, compScope, slot, {
        checked: tpl.theme.showSceneChips[k],
        label: lbl,
        onChange: (on) => {
          saveTemplatePatch((live) => ({
            theme: {
              ...live.theme,
              showSceneChips: { ...live.theme.showSceneChips, [k]: on }
            }
          }));
        }
      });
      chipsGrid.append(slot);
    }
    htmlCard.append(chipsGrid);
    const wHtml = el("textarea", "ls-input");
    wHtml.rows = 2;
    wHtml.placeholder = "Custom Widget HTML Banner…";
    wHtml.value = tpl.surfaces.customWidgetHtml || "";
    const iHtml = el("textarea", "ls-input");
    iHtml.rows = 2;
    iHtml.placeholder = "Custom Inline Ribbon HTML Banner…";
    iHtml.value = tpl.surfaces.customInlineHtml || "";
    const dHtml = el("textarea", "ls-input");
    dHtml.rows = 2;
    dHtml.placeholder = "Custom Character Dossier HTML Banner…";
    dHtml.value = tpl.surfaces.customDossierHtml || "";
    htmlCard.append(wHtml, iHtml, dHtml, btn("Apply Custom HTML Banners", () => {
      saveTemplatePatch((live) => ({
        surfaces: {
          ...live.surfaces,
          customWidgetHtml: wHtml.value.trim(),
          customInlineHtml: iHtml.value.trim(),
          customDossierHtml: dHtml.value.trim()
        }
      }));
    }, "ls-btn-sm ls-btn-primary"));
    wrap.append(htmlCard);
  }
  return wrap;
}

// src/frontend/surfaces/studio/StudioTemplatesTab.ts
function renderStudioTemplatesTab(ctrl, compScope, tpl, saveTemplatePatch, duplicateAndEditTemplate, forceRedraw) {
  const { state } = ctrl.snapshot;
  const wrap = el("div", "ls-stack");
  const savedCustomTemplates = ctrl.customTemplates.filter((ct) => !ctrl.builtinTemplates.some((bt) => bt.id === ct.id));
  const allTemplatesCount = savedCustomTemplates.length + ctrl.builtinTemplates.length;
  const libCard = el("section", "ls-card");
  const libHead = el("div", "ls-row-between");
  const libTitle = el("div");
  libTitle.append(el("span", "ls-kicker", "Template Gallery"), el("h3", "", `Saved & Built-In Templates (${allTemplatesCount})`));
  const libRightBtns = el("div", "ls-row");
  libRightBtns.append(iconBtn("plus", () => openCreateTemplateModal(ctrl, forceRedraw), {
    label: "New Template",
    className: "ls-btn-sm ls-btn-primary"
  }), btn("Import .json", () => {
    ctrl.ctx.uploads.pickFile({ accept: [".json", "application/json"], multiple: false, maxSizeBytes: 2500000 }).then(async (files) => {
      const f = files[0];
      if (!f)
        return;
      const json = new TextDecoder().decode(f.bytes);
      await ctrl.request("template:importJson", { json });
      ctrl.notify(`Imported & activated template from ${f.name}.`);
    }).catch((err) => ctrl.notify(err instanceof Error ? err.message : String(err), true));
  }, "ls-btn-sm"));
  libHead.append(libTitle, libRightBtns);
  libCard.append(libHead);
  const renderPresetCard = (preset, isCustom) => {
    const isActive = preset.id === tpl.id;
    const card = el("div", "ls-preset-card");
    card.dataset.active = String(isActive);
    const topInfo = el("div", "ls-stack");
    topInfo.style.gap = "5px";
    const titleRow = el("div", "ls-row-between");
    titleRow.append(el("strong", "", `${preset.icon} ${preset.name}`), el("span", `ls-chip ${isCustom ? "ls-chip-accent" : ""}`, isCustom ? "Saved Custom" : "Built-In"));
    const badgeRow = el("div", "ls-row");
    const charCount = preset.stats.filter((s) => s.scope === "character").length;
    const otherCount = preset.stats.filter((s) => s.scope !== "character").length;
    badgeRow.append(el("span", "ls-chip", `${charCount} NPC meters`), el("span", "ls-chip", `${otherCount} stats`));
    topInfo.append(titleRow, el("p", "ls-muted", preset.description), badgeRow);
    const btnBar = el("div", "ls-row");
    if (isActive) {
      btnBar.append(el("span", "ls-chip ls-chip-accent", "✓ Active"));
    } else {
      const actBtn = btn("Activate", () => {
        actBtn.disabled = true;
        actBtn.textContent = "Applying…";
        ctrl.request("template:apply", { templateId: preset.id, template: preset }).then(() => {
          ctrl.notify(`Activated "${preset.name}"!`);
        }).catch((err) => {
          ctrl.notify(err instanceof Error ? err.message : String(err), true);
          if (actBtn.isConnected) {
            actBtn.disabled = false;
            actBtn.textContent = "Activate";
          }
        });
      }, "ls-btn-sm ls-btn-primary");
      btnBar.append(actBtn);
    }
    btnBar.append(iconBtn("copy", () => duplicateAndEditTemplate(preset), {
      label: "Copy & Edit",
      className: "ls-btn-sm",
      title: "Create an editable copy of this template"
    }));
    if (isCustom) {
      btnBar.append(iconBtn("trash", () => {
        ctrl.modals.confirm({
          title: "Delete Saved Template?",
          message: `Remove "${preset.name}" from your Template Library?`,
          confirmLabel: "Delete",
          variant: "danger"
        }).then((confirmed) => {
          if (!confirmed)
            return;
          ctrl.request("template:deleteFromLibrary", { templateId: preset.id }).then(() => ctrl.notify(`Deleted "${preset.name}" from library.`)).catch((err) => ctrl.notify(err instanceof Error ? err.message : String(err), true));
        });
      }, {
        className: "ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger",
        title: "Delete from library"
      }));
    }
    card.append(topInfo, btnBar);
    return card;
  };
  libCard.append(el("span", "ls-kicker", `Saved Custom Templates (${savedCustomTemplates.length})`));
  if (savedCustomTemplates.length > 0) {
    const customGrid = el("div", "ls-grid");
    for (const preset of savedCustomTemplates) {
      customGrid.append(renderPresetCard(preset, true));
    }
    libCard.append(customGrid);
  } else {
    libCard.append(el("p", "ls-muted", 'No saved custom templates yet. Click "+ New Template", "Save to Library", or "Copy & Edit" on any preset below.'));
  }
  libCard.append(el("span", "ls-kicker", `Built-In Presets (${ctrl.builtinTemplates.length})`));
  const builtinGrid = el("div", "ls-grid");
  for (const preset of ctrl.builtinTemplates) {
    builtinGrid.append(renderPresetCard(preset, false));
  }
  libCard.append(builtinGrid);
  wrap.append(libCard);
  const placeCard = el("section", "ls-card");
  placeCard.append(el("span", "ls-kicker", "Display & Prompt Placement"), el("h3", "", "Where Lumi Stats Appears"));
  const placementRow = el("div", "ls-row");
  for (const [pVal, pLbl] of [
    ["both_bottom", "HUD + Below Reply"],
    ["both_top", "HUD + Above Reply"],
    ["inline_bottom", "Below Reply Only"],
    ["floating_only", "Floating HUD Only"]
  ]) {
    const b = btn(pLbl, () => {
      saveTemplatePatch({
        theme: { ...ctrl.snapshot.template.theme, placement: pVal }
      });
    }, "ls-btn-sm");
    if (tpl.theme.placement === pVal)
      b.setAttribute("aria-current", "page");
    placementRow.append(b);
  }
  placeCard.append(placementRow);
  const promptPosRow = el("div", "ls-row");
  promptPosRow.append(el("small", "ls-muted", "AI Prompt Injection:"));
  for (const [ppVal, ppLbl] of [
    ["pre_history", "Before History"],
    ["in_history", "Within History"],
    ["post_history", "After History"]
  ]) {
    const b = btn(ppLbl, () => {
      saveTemplatePatch({ promptPosition: ppVal }, `Set prompt position to ${ppVal}`);
    }, "ls-btn-sm");
    if ((tpl.promptPosition || "post_history") === ppVal) {
      b.setAttribute("aria-current", "page");
    }
    promptPosRow.append(b);
  }
  if (tpl.promptPosition === "in_history") {
    const curDepth = Math.max(0, Math.round(Number(tpl.promptDepth ?? 1) || 0));
    const depthInp = el("input", "ls-input");
    depthInp.type = "number";
    depthInp.min = "0";
    depthInp.max = "20";
    depthInp.style.cssText = "width:68px;min-height:26px;padding:2px 6px;";
    depthInp.value = String(curDepth);
    depthInp.addEventListener("change", () => {
      const nextDepth = Math.max(0, Math.min(20, Math.round(Number(depthInp.value) || 0)));
      saveTemplatePatch({ promptDepth: nextDepth });
    });
    promptPosRow.append(el("small", "ls-muted", "Depth:"), depthInp);
  }
  placeCard.append(promptPosRow);
  wrap.append(placeCard);
  const skinHost = el("div");
  wrap.append(skinHost);
  const skinBody = mountNativeCollapsible(ctrl, compScope, skinHost, {
    title: "Appearance, Skins, Frame Shapes & Widget Size",
    iconName: "palette",
    defaultExpanded: false,
    persistKey: "studio_templates_skin"
  });
  const skinPackRow = el("div", "ls-row");
  skinPackRow.append(el("small", "ls-muted", "1-Click Skins:"));
  for (const skin of BUILTIN_VISUAL_SKINS) {
    const b = btn(skin.name, () => ctrl.applySkinPack(skin), "ls-btn-sm");
    if ((tpl.theme.surfaceStyle || "glass") === skin.surfaceStyle)
      b.setAttribute("aria-current", "page");
    skinPackRow.append(b);
  }
  skinPackRow.append(btn("Import Skin", () => {
    ctrl.ctx.uploads.pickFile({ accept: [".json", "application/json"], multiple: false, maxSizeBytes: 500000 }).then((files) => {
      const f = files[0];
      if (!f)
        return;
      const parsed = JSON.parse(new TextDecoder().decode(f.bytes));
      ctrl.applySkinPack(parsed);
    });
  }, "ls-btn-sm ls-btn-ghost"), btn("Export Skin", () => {
    const pack = extractSkinPackFromTemplate(tpl);
    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugifyKey(tpl.name, "lumi_skin")}.lumi-skin.json`;
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, "ls-btn-sm ls-btn-ghost"));
  skinBody.append(skinPackRow);
  const pillSkinWrap = el("div", "ls-row-between ls-stat-cell");
  pillSkinWrap.append(el("strong", "", "Collapsed Pill Skin (10 Designs)"));
  const pillSkinSlot = el("div");
  pillSkinSlot.style.minWidth = "230px";
  pillSkinWrap.append(pillSkinSlot);
  mountThemedSelect(ctrl, compScope, pillSkinSlot, {
    value: tpl.theme.pillStyle || "glass_capsule",
    ariaLabel: "Collapsed Pill Skin",
    options: [
      { value: "glass_capsule", label: "✨ Frosted Split Capsule (Default Best)" },
      { value: "vn_dialogue_bar", label: "\uD83C\uDFAC VN Cinema Strip" },
      { value: "rpg_status_bar", label: "⚔️ JRPG Party Status Bar" },
      { value: "persona_ticker", label: "\uD83C\uDCCF Stylish Pop Ticker" },
      { value: "cyber_telemetry", label: "\uD83D\uDEF8 Cyber Telemetry" },
      { value: "minimal_floating", label: "☁️ Minimal Ghost Pill" },
      { value: "neon_edge", label: "⚡ Neon Glow Rail" },
      { value: "split_deck", label: "\uD83D\uDDC2️ Dual-Deck Card Pill" },
      { value: "compact_badge", label: "\uD83D\uDCF1 Micro Compact Badge" },
      { value: "ledger_strip", label: "\uD83D\uDCDC Editorial Case Strip" }
    ],
    onChange: (nextPill) => {
      saveTemplatePatch({
        theme: { ...ctrl.snapshot.template.theme, pillStyle: nextPill }
      });
    }
  });
  skinBody.append(pillSkinWrap);
  const styleRow = el("div", "ls-row");
  styleRow.append(el("small", "ls-muted", "Base Surface:"));
  for (const [sVal, sLbl] of [
    ["glass", "Auto Glass"],
    ["soft", "Soft Card"],
    ["sleek", "Sleek Dark"],
    ["minimal", "Minimal"],
    ["neon", "Neon"],
    ["arcane_rpg", "Arcane RPG"],
    ["cyber_hud", "Cyber HUD"],
    ["persona_pop", "Pop Sim"],
    ["cozy_vn", "Cozy VN"]
  ]) {
    const b = btn(sLbl, () => {
      saveTemplatePatch({ theme: { ...ctrl.snapshot.template.theme, surfaceStyle: sVal } });
    }, "ls-btn-sm");
    if ((tpl.theme.surfaceStyle || "glass") === sVal)
      b.setAttribute("aria-current", "page");
    styleRow.append(b);
  }
  const frameRow = el("div", "ls-row");
  frameRow.append(el("small", "ls-muted", "Frame & Bars:"));
  for (const [fVal, fLbl] of [
    ["rounded", "Rounded"],
    ["chamfered", "Angled"],
    ["ornate", "Ornate"],
    ["sharp", "Sharp"]
  ]) {
    const b = btn(fLbl, () => {
      saveTemplatePatch({ theme: { ...ctrl.snapshot.template.theme, frameShape: fVal } });
    }, "ls-btn-sm");
    if ((tpl.theme.frameShape || "rounded") === fVal)
      b.setAttribute("aria-current", "page");
    frameRow.append(b);
  }
  for (const [mVal, mLbl] of [
    ["smooth", "Gradient Bar"],
    ["segmented", "Segmented Bar"],
    ["glow", "Neon Glow Bar"]
  ]) {
    const b = btn(mLbl, () => {
      saveTemplatePatch({ theme: { ...ctrl.snapshot.template.theme, meterStyle: mVal } });
    }, "ls-btn-sm");
    if ((tpl.theme.meterStyle || "smooth") === mVal)
      b.setAttribute("aria-current", "page");
    frameRow.append(b);
  }
  const hueRow = el("div", "ls-row");
  hueRow.append(el("small", "ls-muted", "Accent Color:"));
  for (const [hueVal, hueLbl] of [
    [undefined, "Theme Default"],
    [198, "Cyan"],
    [330, "Rose"],
    [38, "Gold"],
    [158, "Emerald"],
    [262, "Violet"],
    [350, "Crimson"]
  ]) {
    const b = btn(hueLbl, () => {
      saveTemplatePatch({ theme: { ...ctrl.snapshot.template.theme, accentHue: hueVal } });
    }, "ls-btn-sm");
    if (tpl.theme.accentHue === hueVal)
      b.setAttribute("aria-current", "page");
    hueRow.append(b);
  }
  const sizeGrid = el("div", "ls-grid");
  const makeSizeInput = (label, val, min, max, onSave) => {
    const w = el("label", "ls-label", label);
    const inp = el("input", "ls-input");
    inp.type = "number";
    inp.min = String(min);
    inp.max = String(max);
    inp.value = String(val);
    inp.addEventListener("change", () => {
      onSave(Math.max(min, Math.min(max, Number(inp.value) || val)));
    });
    w.append(inp);
    return w;
  };
  sizeGrid.append(makeSizeInput("Widget Width (px)", tpl.theme.widgetWidth ?? 460, 240, 1200, (val) => {
    const liveTheme = ctrl.snapshot.template.theme;
    saveTemplatePatch({ theme: { ...liveTheme, widgetWidth: val } });
    if (ctrl.widgetExpanded)
      ctrl.onResizeWidgetLive?.(val, liveTheme.widgetHeight ?? 540, false);
  }), makeSizeInput("Widget Height (px)", tpl.theme.widgetHeight ?? 540, 180, 900, (val) => {
    const liveTheme = ctrl.snapshot.template.theme;
    saveTemplatePatch({ theme: { ...liveTheme, widgetHeight: val } });
    if (ctrl.widgetExpanded)
      ctrl.onResizeWidgetLive?.(liveTheme.widgetWidth ?? 460, val, false);
  }), makeSizeInput("Pill Width (px)", tpl.theme.pillWidth ?? 420, 220, 960, (val) => {
    const liveTheme = ctrl.snapshot.template.theme;
    saveTemplatePatch({ theme: { ...liveTheme, pillWidth: val } });
    if (!ctrl.widgetExpanded)
      ctrl.onResizeWidgetLive?.(val, liveTheme.pillHeight ?? 92, false);
  }));
  const densityGrid = el("div", "ls-grid");
  for (const [lbl, checked, onChange] of [
    [
      "Frosted Glass Blur",
      tpl.theme.glassBlur !== false,
      (v) => saveTemplatePatch({ theme: { ...ctrl.snapshot.template.theme, glassBlur: v } })
    ],
    [
      "Compact Card Density",
      Boolean(tpl.theme.compact),
      (v) => saveTemplatePatch({ theme: { ...ctrl.snapshot.template.theme, compact: v } })
    ],
    [
      "Expand Inline Ribbon by Default",
      Boolean(tpl.theme.inlineDefaultExpanded),
      (v) => {
        ctrl.inlineExpanded = v;
        saveTemplatePatch({ theme: { ...ctrl.snapshot.template.theme, inlineDefaultExpanded: v } });
      }
    ],
    [
      "Icon-Only Widget Tabs",
      Boolean(tpl.theme.widgetTabsIconOnly),
      (v) => saveTemplatePatch({ theme: { ...ctrl.snapshot.template.theme, widgetTabsIconOnly: v } })
    ],
    [
      "All Cast Cards Expanded",
      (tpl.theme.castLayout || "roster") === "cards",
      (v) => saveTemplatePatch({ theme: { ...ctrl.snapshot.template.theme, castLayout: v ? "cards" : "roster" } })
    ]
  ]) {
    const slot = el("div");
    mountNativeCheckbox(ctrl, compScope, slot, { checked, label: lbl, onChange });
    densityGrid.append(slot);
  }
  skinBody.append(styleRow, frameRow, hueRow, sizeGrid, densityGrid);
  const premiseHost = el("div");
  wrap.append(premiseHost);
  const premiseBody = mountNativeCollapsible(ctrl, compScope, premiseHost, {
    title: "Canon Story Premise (Optional Turn-1 Setup)",
    iconName: "edit",
    badge: state.canonPremise ? "Set" : undefined,
    defaultExpanded: Boolean(state.canonPremise),
    persistKey: "studio_templates_premise"
  });
  premiseBody.append(el("p", "ls-muted", state.canonPremise || "No custom premise set. Lumi Stats automatically calibrates from your Character Card, Persona, and Opening Message on Turn 1."), btn("Open Full-Screen Premise Editor", () => {
    ctrl.request("textEditor:open", {
      title: "Canon Story Premise (Lumi Stats)",
      value: state.canonPremise || "",
      placeholder: "Write established relationships, roles, or world rules…"
    }).then((res) => {
      if (!res.cancelled && typeof res.text === "string") {
        ctrl.request("state:mutate", {
          stateOverride: { canonPremise: res.text.trim() },
          reason: "Updated canon premise"
        });
      }
    });
  }, "ls-btn-sm ls-btn-primary"));
  return wrap;
}

// src/frontend/surfaces/SettingsStudio.ts
var activeStudioTab = "quickstart";
var activePreviewMode = "hud";
var editingTemplateIdentity = false;
var identityDraft = null;
var identityTemplateId = "";
var activeAppOverlay = null;
function downloadTemplateJson(name, data) {
  const slug = name.toLowerCase().replace(/[^a-z0-9_-]+/g, "_") || "lumi_stats_template";
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug}.lumi-stats.json`;
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
function openSettingsStudioModal(ctrl) {
  if (activeAppOverlay) {
    activeAppOverlay.cleanup();
    activeAppOverlay = null;
  }
  editingTemplateIdentity = false;
  identityDraft = null;
  identityTemplateId = ctrl.snapshot.template.id;
  ctrl.request("snapshot:get").catch(() => {
    return;
  });
  const compScope = new ComponentScope;
  if (typeof ctrl.ctx.ui?.mountApp === "function") {
    try {
      const mount = ctrl.ctx.ui.mountApp({
        className: "ls-studio-mount",
        position: "app-overlay"
      });
      mount.setVisible(true);
      setupAppOverlay(ctrl, mount, compScope);
      return;
    } catch (err) {
      console.warn("[LumiStats Studio] mountApp error, using modal fallback:", err);
      compScope.clear();
    }
  }
  openViaModal(ctrl);
}
function setupAppOverlay(ctrl, mount, compScope) {
  console.log("[LumiStats Studio] setupAppOverlay: mounting full-window Studio via mountApp");
  ctrl.studioOpen = true;
  ctrl.emitChange();
  const closeOverlay = () => {
    if (!activeAppOverlay)
      return;
    editingTemplateIdentity = false;
    identityDraft = null;
    const ref = activeAppOverlay;
    activeAppOverlay = null;
    ctrl.activeOverlayCleanup = null;
    ctrl.studioOpen = false;
    ctrl.emitChange();
    ref.cleanup();
  };
  const onKeyDown = (e) => {
    if (e.key !== "Escape")
      return;
    if (e.defaultPrevented || ctrl.modals.hasOpenModals() || document.body.querySelector('.ls-dd-menu[data-ls-dd-open="true"]')) {
      return;
    }
    closeOverlay();
  };
  window.addEventListener("keydown", onKeyDown);
  const redraw = (force = false) => {
    preserveScrollAndFocus(mount.root, () => {
      compScope.clear();
      const postMount = [];
      mount.root.replaceChildren(renderFullWindowStudio(ctrl, compScope, closeOverlay, true, () => redraw(true), postMount));
      for (const fn of postMount)
        fn();
    }, {
      deferIfTyping: !force,
      onDeferredFlush: () => redraw(true)
    });
  };
  const unsub = ctrl.subscribe(() => redraw(false));
  const unsubStatus = ctrl.subscribeStatus(() => {
    const pill = mount.root.querySelector("[data-ls-studio-status]");
    if (pill) {
      pill.textContent = ctrl.statusText;
      pill.style.display = ctrl.statusText ? "" : "none";
      pill.style.color = ctrl.statusError ? "var(--ls-danger)" : "var(--ls-muted)";
    }
  });
  redraw(true);
  const cleanupFn = () => {
    window.removeEventListener("keydown", onKeyDown);
    unsub();
    unsubStatus();
    compScope.clear();
    mount.destroy();
  };
  activeAppOverlay = { mount, cleanup: cleanupFn };
  ctrl.activeOverlayCleanup = closeOverlay;
}
function openViaModal(ctrl) {
  ctrl.modals.open({ title: "Lumi Stats Studio", width: 1360, maxHeight: 900 }, (body, close, handle, modalScope) => {
    body.style.cssText += ";padding:0;overflow:hidden;display:flex;flex-direction:column;height:85vh;max-height:880px;container-type:inline-size;";
    const redraw = (force = false) => {
      preserveScrollAndFocus(body, () => {
        modalScope.clear();
        const postMount = [];
        body.replaceChildren(renderFullWindowStudio(ctrl, modalScope, close, false, () => redraw(true), postMount));
        for (const fn of postMount)
          fn();
      }, {
        deferIfTyping: !force,
        onDeferredFlush: () => redraw(true)
      });
    };
    redraw(true);
    const unsub = ctrl.subscribe(() => redraw(false));
    const unsubStatus = ctrl.subscribeStatus(() => {
      const pill = body.querySelector("[data-ls-studio-status]");
      if (pill) {
        pill.textContent = ctrl.statusText;
        pill.style.display = ctrl.statusText ? "" : "none";
        pill.style.color = ctrl.statusError ? "var(--ls-danger)" : "var(--ls-muted)";
      }
    });
    handle.onDismiss(() => {
      editingTemplateIdentity = false;
      identityDraft = null;
      unsub();
      unsubStatus();
    });
  });
}
function renderFullWindowStudio(ctrl, compScope, onClose, isFullscreenOverlay, forceRedraw, postMount = []) {
  const { template } = ctrl.snapshot;
  const tpl = structuredClone(template);
  if (identityTemplateId !== tpl.id) {
    identityTemplateId = tpl.id;
    editingTemplateIdentity = false;
    identityDraft = null;
  }
  const isBuiltin = ctrl.builtinTemplates.some((b) => b.id === tpl.id);
  const saveTemplatePatch = (patchOrUpdater, reason = "Updated template") => {
    const liveTpl = structuredClone(ctrl.snapshot.template);
    const patch = typeof patchOrUpdater === "function" ? patchOrUpdater(liveTpl) : patchOrUpdater;
    const mergedPatch = {
      ...patch,
      ...patch.theme ? { theme: { ...liveTpl.theme, ...patch.theme } } : {},
      ...patch.surfaces ? { surfaces: { ...liveTpl.surfaces, ...patch.surfaces } } : {}
    };
    ctrl.request("state:mutate", { templatePatch: mergedPatch, reason }).catch((err) => ctrl.notify(err instanceof Error ? err.message : String(err), true));
  };
  const duplicateAndEditTemplate = (sourceTpl, customName) => {
    const targetName = customName?.trim() || `${sourceTpl.name} (Custom)`;
    ctrl.request("template:duplicate", {
      sourceTemplateId: sourceTpl.id,
      template: sourceTpl,
      name: targetName,
      icon: sourceTpl.icon,
      description: sourceTpl.description
    }).then((res) => {
      const created = res.template ?? ctrl.snapshot.template;
      identityTemplateId = created.id;
      editingTemplateIdentity = true;
      identityDraft = {
        icon: created.icon,
        name: created.name,
        description: created.description
      };
      ctrl.notify(`Created & activated editable copy "${created.name}"!`);
      forceRedraw();
    }).catch((err) => ctrl.notify(err instanceof Error ? err.message : String(err), true));
  };
  const container = el("div", isFullscreenOverlay ? "ls-studio-overlay" : "ls-studio-overlay ls-studio-in-modal");
  ctrl.stampThemeOnElement(container);
  const topBar = el("header", "ls-studio-topbar");
  const brandRow = el("div", "ls-row");
  brandRow.append(el("span", "ls-brand-mark", "L"), el("strong", "", "Lumi Stats Studio"), el("span", "ls-chip ls-chip-accent", `${tpl.icon} ${tpl.name}`), el("span", "ls-chip", isBuiltin ? "Built-In" : "Custom"));
  const studioStatusPill = el("span", "ls-chip", ctrl.statusText);
  studioStatusPill.setAttribute("data-ls-studio-status", "true");
  if (!ctrl.statusText)
    studioStatusPill.style.display = "none";
  if (ctrl.statusError)
    studioStatusPill.style.color = "var(--ls-danger)";
  const topActions = el("div", "ls-row");
  topActions.append(studioStatusPill, iconBtn("plus", () => openCreateTemplateModal(ctrl, forceRedraw), {
    label: "New",
    className: "ls-btn-sm",
    title: "Create a new template"
  }), btn("Save to Library", () => {
    const live = ctrl.snapshot.template;
    ctrl.request("template:saveToLibrary", {
      name: live.name,
      icon: live.icon,
      description: live.description
    }).then(() => ctrl.notify(`Saved "${live.name}" to your Template Library.`)).catch((err) => ctrl.notify(err instanceof Error ? err.message : String(err), true));
  }, "ls-btn-sm ls-btn-primary"), btn("Export", () => downloadTemplateJson(tpl.name, tpl), "ls-btn-sm"), iconBtn("close", onClose, {
    label: "Close",
    className: "ls-btn-sm ls-btn-danger",
    title: "Close Studio (Esc)"
  }));
  topBar.append(brandRow, topActions);
  container.append(topBar);
  const workspace = el("div", "ls-studio-workspace");
  const sidebar = el("nav", "ls-studio-sidebar");
  const navItems = [
    { id: "quickstart", title: "1. Templates & Look", sub: "Presets, placement & skin" },
    { id: "stats", title: "2. Stats & Built-Ins", sub: "Meters, Scene Pill & prompts" },
    { id: "extreme", title: "3. Tabs & Surfaces", sub: "HUD, Inline & Dossier layout" },
    { id: "stage_assets", title: "4. Stage Sprites", sub: "Sprites & time backdrops" },
    { id: "prose", title: "5. Prose & Cipher", sub: "Braille cleaner & word cipher" },
    { id: "engine", title: "6. AI & Connections", sub: "Models, Cortex & debug" }
  ];
  for (const item of navItems) {
    const b = el("button", "ls-studio-nav-btn");
    b.type = "button";
    if (activeStudioTab === item.id)
      b.setAttribute("aria-current", "page");
    b.append(el("span", "ls-studio-nav-title", item.title), el("span", "ls-studio-nav-sub", item.sub));
    b.addEventListener("click", () => {
      activeStudioTab = item.id;
      forceRedraw();
    });
    sidebar.append(b);
  }
  workspace.append(sidebar);
  const centerPane = el("main", "ls-studio-pane");
  if (activeStudioTab === "quickstart" || activeStudioTab === "stats" || activeStudioTab === "extreme") {
    const hero = el("section", "ls-hero-banner");
    const heroTop = el("div", "ls-row-between");
    const heroTitleCol = el("div");
    heroTitleCol.append(el("span", "ls-kicker", isBuiltin ? "Built-In Preset" : "Custom Saved Template"), el("h2", "", `${tpl.icon} ${tpl.name}`), el("p", "ls-muted", tpl.description));
    const heroBtns = el("div", "ls-row");
    heroBtns.append(iconBtn("copy", () => duplicateAndEditTemplate(tpl), {
      label: "Duplicate & Edit",
      className: "ls-btn-sm ls-btn-primary"
    }), iconBtn("edit", () => {
      editingTemplateIdentity = !editingTemplateIdentity;
      identityDraft = editingTemplateIdentity ? { icon: tpl.icon, name: tpl.name, description: tpl.description } : null;
      forceRedraw();
    }, {
      label: editingTemplateIdentity ? "Hide Rename" : "Rename",
      className: "ls-btn-sm"
    }));
    heroTop.append(heroTitleCol, heroBtns);
    hero.append(heroTop);
    if (editingTemplateIdentity) {
      identityDraft ??= { icon: tpl.icon, name: tpl.name, description: tpl.description };
      const idGrid = el("div", "ls-grid");
      const icWrap = el("label", "ls-label", "Icon Emoji");
      const icInp = el("input", "ls-input");
      icInp.value = identityDraft.icon;
      icInp.addEventListener("input", () => {
        if (identityDraft)
          identityDraft.icon = icInp.value;
      });
      icWrap.append(icInp);
      const nmWrap = el("label", "ls-label", "Template Name");
      const nmInp = el("input", "ls-input");
      nmInp.value = identityDraft.name;
      nmInp.addEventListener("input", () => {
        if (identityDraft)
          identityDraft.name = nmInp.value;
      });
      nmWrap.append(nmInp);
      const dsWrap = el("label", "ls-label", "Description");
      const dsInp = el("input", "ls-input");
      dsInp.value = identityDraft.description;
      dsInp.addEventListener("input", () => {
        if (identityDraft)
          identityDraft.description = dsInp.value;
      });
      dsWrap.append(dsInp);
      idGrid.append(icWrap, nmWrap, dsWrap);
      const saveInfoBtn = btn("Save Template Name & Info", () => {
        const nextName = nmInp.value.trim() || tpl.name;
        const nextIcon = icInp.value.trim() || "✨";
        const nextDesc = dsInp.value.trim() || tpl.description;
        saveInfoBtn.disabled = true;
        saveInfoBtn.textContent = "Saving…";
        ctrl.request("template:saveToLibrary", {
          name: nextName,
          icon: nextIcon,
          description: nextDesc
        }).then(() => {
          editingTemplateIdentity = false;
          identityDraft = null;
          ctrl.notify(`Saved template "${nextName}".`);
          forceRedraw();
        }).catch((err) => {
          ctrl.notify(err instanceof Error ? err.message : String(err), true);
          if (saveInfoBtn.isConnected) {
            saveInfoBtn.disabled = false;
            saveInfoBtn.textContent = "Save Template Name & Info";
          }
        });
      }, "ls-btn-sm ls-btn-primary");
      hero.append(idGrid, saveInfoBtn);
    }
    centerPane.append(hero);
  }
  if (activeStudioTab === "quickstart") {
    centerPane.append(renderStudioTemplatesTab(ctrl, compScope, tpl, saveTemplatePatch, duplicateAndEditTemplate, forceRedraw));
  } else if (activeStudioTab === "stats") {
    centerPane.append(renderStudioStatsTab(ctrl, compScope, tpl, saveTemplatePatch, forceRedraw));
  } else if (activeStudioTab === "extreme") {
    centerPane.append(renderStudioSurfacesTab(ctrl, compScope, tpl, saveTemplatePatch, forceRedraw));
  } else if (activeStudioTab === "stage_assets") {
    centerPane.append(renderStageAssetStudioSurface(ctrl, forceRedraw));
  } else if (activeStudioTab === "prose") {
    centerPane.append(renderStudioProseTab(ctrl, compScope));
  } else if (activeStudioTab === "engine") {
    centerPane.append(renderStudioEngineTab(ctrl, compScope, postMount));
  }
  workspace.append(centerPane);
  const previewPane = el("aside", "ls-studio-preview-pane");
  const previewCard = el("section", "ls-card");
  const prevHead = el("div", "ls-row-between");
  prevHead.append(el("span", "ls-kicker", "Live Preview"));
  const prevModes = el("div", "ls-row");
  for (const [mId, mLbl] of [
    ["hud", "HUD"],
    ["pill", "Pill"],
    ["inline", "Inline"],
    ["dossier", "Dossier"]
  ]) {
    const b = btn(mLbl, () => {
      activePreviewMode = mId;
      forceRedraw();
    }, "ls-btn-sm");
    if (activePreviewMode === mId)
      b.setAttribute("aria-current", "page");
    prevModes.append(b);
  }
  prevHead.append(prevModes);
  previewCard.append(prevHead);
  const previewStage = el("div");
  previewStage.style.marginTop = "6px";
  if (activePreviewMode === "hud") {
    previewStage.style.height = "470px";
    previewStage.append(renderFloatingHudSurface(ctrl, false, () => {
      return;
    }, (actorId) => openCharacterDossierModal(ctrl, actorId), () => {
      return;
    }, compScope));
  } else if (activePreviewMode === "pill") {
    previewStage.style.height = "104px";
    previewStage.append(renderFloatingHudSurface(ctrl, true, () => {
      return;
    }, (actorId) => openCharacterDossierModal(ctrl, actorId), () => {
      return;
    }, compScope));
  } else if (activePreviewMode === "inline") {
    const prevExpanded = ctrl.inlineExpanded;
    ctrl.inlineExpanded = true;
    const inlineEl = renderInlineRibbonCard(ctrl, (actorId) => openCharacterDossierModal(ctrl, actorId), () => {
      return;
    });
    ctrl.inlineExpanded = prevExpanded;
    previewStage.append(inlineEl);
  } else {
    const prevEdit = ctrl.dossierEditMode;
    ctrl.dossierEditMode = false;
    const dossierEl = renderCastDossierSurface(ctrl, compScope);
    ctrl.dossierEditMode = prevEdit;
    previewStage.append(dossierEl);
  }
  previewCard.append(previewStage);
  previewPane.append(previewCard);
  workspace.append(previewPane);
  container.append(workspace);
  return container;
}

// src/frontend/stage/procedural-particles.ts
function svgDataUri(body, width, height) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${body}</svg>`;
  return `url('data:image/svg+xml,${encodeURIComponent(svg)}')`;
}
function pseudo(seed, index, min, max) {
  let h = (Math.imul(seed ^ 2654435769, 2246822507) ^ Math.imul(index + 1663821227, 3266489909)) >>> 0;
  h ^= h >>> 16;
  h = Math.imul(h, 2146121005) >>> 0;
  h ^= h >>> 15;
  h = Math.imul(h, 2221713035) >>> 0;
  h = (h ^ h >>> 16) >>> 0;
  const v = h / 4294967295;
  return min + v * (max - min);
}
function strat(seed, index, count, min, max) {
  const jitter = pseudo(seed, index, 0.06, 0.94);
  return min + (index + jitter) / count * (max - min);
}
function n(value, digits = 1) {
  return Number(value.toFixed(digits)).toString();
}
function vars(entries) {
  return Object.entries(entries).map(([k, v]) => `${k}:${v}`).join(";");
}
function inferWeatherEffect(weather, explicit) {
  if (explicit === "clear")
    return null;
  if (explicit)
    return explicit;
  if (!weather)
    return null;
  const w = weather.toLowerCase();
  if (/\b(?:storm|downpour|thunder|tempest|torrential|monsoon)\b/.test(w)) {
    return "heavy_rain";
  }
  if (/\b(?:rain|drizzle|shower)\b/.test(w))
    return "rain";
  if (/\b(?:snow|blizzard|flurr|frost)\b/.test(w))
    return "snow";
  if (/\b(?:sakura|blossom|petal)\b/.test(w))
    return "sakura";
  if (/\b(?:fog|mist|haze|steam)\b/.test(w))
    return "fog";
  if (/\b(?:ember|ash|cinder|spark)\b/.test(w))
    return "embers";
  if (/\b(?:firefl|starlight)\b/.test(w))
    return "fireflies";
  return null;
}
function generateWeatherParticlesHtml(effect, compact = false) {
  switch (effect) {
    case "rain":
      return generateRainMarkup(false, compact);
    case "heavy_rain":
      return generateRainMarkup(true, compact);
    case "snow":
      return generateSnowMarkup(compact);
    case "sakura":
      return generateSakuraMarkup(compact);
    case "fog":
      return generateFogMarkup();
    case "fireflies":
      return generateFirefliesMarkup(compact);
    case "embers":
      return generateEmbersMarkup(compact);
    default:
      return "";
  }
}
function rainTile(spec) {
  const rects = [];
  const gradients = [];
  spec.groups.forEach((group, g) => {
    const seed = spec.seed + g * 10;
    gradients.push(`<linearGradient id="g${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${group.color}" stop-opacity="0"/><stop offset=".7" stop-color="${group.color}" stop-opacity=".55"/><stop offset="1" stop-color="${group.color}" stop-opacity="1"/></linearGradient>`);
    for (let i = 0;i < group.count; i++) {
      const x = strat(seed, i, group.count, group.width, spec.w - group.width);
      const y = pseudo(seed + 1, i, 0, spec.h);
      const len = pseudo(seed + 2, i, group.len[0], group.len[1]);
      const alpha = pseudo(seed + 3, i, group.alpha[0], group.alpha[1]);
      const rect = (top) => `<rect x="${n(x - group.width / 2)}" y="${n(top)}" width="${n(group.width, 2)}" height="${n(len)}" rx="${n(group.width / 2, 2)}" fill="url(#g${g})" opacity="${n(alpha, 2)}"/>`;
      rects.push(rect(y));
      if (y + len > spec.h)
        rects.push(rect(y - spec.h));
    }
  });
  const filter = spec.blur ? `<filter id="b" x="-50%" y="-5%" width="200%" height="110%"><feGaussianBlur stdDeviation="${spec.blur}"/></filter>` : "";
  const body = spec.blur ? `<g filter="url(#b)">${rects.join("")}</g>` : rects.join("");
  return svgDataUri(`<defs>${gradients.join("")}${filter}</defs>${body}`, spec.w, spec.h);
}
function rainLayer(spec, tilt) {
  const style = vars({
    "--tile": rainTile(spec),
    "--tw": `${spec.w}px`,
    "--th": `${spec.h}px`,
    "--dur": `${n(spec.h / spec.speed, 3)}s`,
    "--tilt": `${tilt}deg`
  });
  return `<div class="ls-vn-rain-layer ${spec.cls}" style="${style}"><i></i></div>`;
}
function generateRainMarkup(heavy, compact = false) {
  const prefix = heavy ? "ls-vn-heavy-rain" : "ls-vn-rain";
  const tilt = heavy ? 13 : 8;
  const scaleFactor = compact ? 0.5 : 1;
  const layers = [
    {
      cls: `${prefix}-bg`,
      seed: heavy ? 201 : 101,
      w: 280,
      h: 400,
      speed: heavy ? 1500 : 1150,
      groups: [
        {
          count: Math.max(8, Math.round((heavy ? 36 : 22) * scaleFactor)),
          len: [12, 26],
          width: 1,
          alpha: [0.22, 0.42],
          color: "#b4c8e2"
        },
        {
          count: Math.max(5, Math.round((heavy ? 20 : 12) * scaleFactor)),
          len: [30, 54],
          width: 1.4,
          alpha: [0.38, 0.62],
          color: "#c9dbf2"
        }
      ]
    },
    {
      cls: `${prefix}-fg`,
      seed: heavy ? 221 : 121,
      w: 430,
      h: 520,
      speed: heavy ? 2600 : 2100,
      blur: 0.7,
      groups: [
        {
          count: Math.max(3, Math.round((heavy ? 8 : 5) * scaleFactor)),
          len: [70, 125],
          width: 2.2,
          alpha: [0.4, 0.64],
          color: "#e6f0ff"
        }
      ]
    }
  ];
  const splashCount = compact ? 6 : heavy ? 16 : 10;
  const splashes = [];
  for (let i = 0;i < splashCount; i++) {
    const dur = pseudo(305, i, 0.55, 0.95);
    splashes.push(`<i class="ls-vn-pt ls-vn-splash" style="${vars({
      left: `${n(strat(301, i, splashCount, 3, 97))}%`,
      top: `${n(pseudo(302, i, 76, 96))}%`,
      "--sz": `${n(pseudo(303, i, 12, heavy ? 26 : 18))}px`,
      "--fd": `${n(dur, 2)}s`,
      "--dl": `${n(-pseudo(304, i, 0, dur), 2)}s`
    })}"></i>`);
  }
  return `<div class="ls-vn-rain-wash"></div>${layers.map((l) => rainLayer(l, tilt)).join("")}<div class="ls-vn-fx-layer">${splashes.join("")}</div>`;
}
function fallingParticle(cls, layer, i, extra = {}) {
  const fall = pseudo(layer.seed + 2, i, layer.fall[0], layer.fall[1]);
  return `<i class="ls-vn-pt ${cls}" style="${vars({
    left: `${n(strat(layer.seed, i, layer.count, 1, 99))}%`,
    "--y": `${n(pseudo(layer.seed + 1, i, 0, 92))}vh`,
    "--sz": `${n(pseudo(layer.seed + 3, i, layer.size[0], layer.size[1]))}px`,
    "--o": n(pseudo(layer.seed + 5, i, layer.opacity[0], layer.opacity[1]), 2),
    "--fd": `${n(fall, 2)}s`,
    "--dl": `${n(-pseudo(layer.seed + 6, i, 0, fall), 2)}s`,
    "--dx": `${n(pseudo(layer.seed + 8, i, -12, 8))}vw`,
    ...extra
  })}"></i>`;
}
function generateSnowMarkup(compact = false) {
  const mult = compact ? 0.4 : 1;
  const far = {
    cls: "ls-vn-snow-bg",
    seed: 10,
    count: Math.max(8, Math.round(36 * mult)),
    size: [3.5, 6],
    fall: [11, 16],
    opacity: [0.55, 0.85]
  };
  const mid = {
    cls: "ls-vn-snow-mg",
    seed: 20,
    count: Math.max(6, Math.round(22 * mult)),
    size: [7, 12],
    fall: [7.5, 10.5],
    opacity: [0.75, 0.95]
  };
  const build = (layer) => {
    const out = [];
    for (let i = 0;i < layer.count; i++)
      out.push(fallingParticle("ls-vn-flake", layer, i));
    return `<div class="ls-vn-fx-layer ${layer.cls}">${out.join("")}</div>`;
  };
  return `${build(far)}${build(mid)}`;
}
function generateSakuraMarkup(compact = false) {
  const mult = compact ? 0.4 : 1;
  const layer = {
    cls: "ls-vn-sakura",
    seed: 45,
    count: Math.max(8, Math.round(26 * mult)),
    size: [10, 17],
    fall: [9, 14],
    opacity: [0.68, 0.95]
  };
  const out = [];
  for (let i = 0;i < layer.count; i++) {
    out.push(fallingParticle("ls-vn-petal", layer, i, {
      "--dx": `${n(pseudo(layer.seed + 8, i, -20, -6))}vw`
    }));
  }
  return `<div class="ls-vn-fx-layer ${layer.cls}">${out.join("")}</div>`;
}
function generateFirefliesMarkup(compact = false) {
  const count = compact ? 10 : 22;
  const flies = [];
  for (let i = 0;i < count; i++) {
    const dur = pseudo(57, i, 2.8, 5.2);
    flies.push(`<i class="ls-vn-pt ls-vn-firefly" style="${vars({
      left: `${n(strat(50, i, count, 3, 97))}%`,
      top: `${n(pseudo(51, i, 14, 88))}%`,
      "--sz": `${n(pseudo(52, i, 10, 22))}px`,
      "--fd": `${n(dur, 2)}s`,
      "--dl": `${n(-pseudo(54, i, 0, dur), 2)}s`
    })}"></i>`);
  }
  return `<div class="ls-vn-fx-layer">${flies.join("")}</div>`;
}
function generateEmbersMarkup(compact = false) {
  const count = compact ? 12 : 30;
  const sparks = [];
  for (let i = 0;i < count; i++) {
    const rise = pseudo(63, i, 3.4, 6.4);
    sparks.push(`<i class="ls-vn-pt ls-vn-ember" style="${vars({
      left: `${n(strat(60, i, count, 2, 98))}%`,
      "--sz": `${n(pseudo(61, i, 5, 11))}px`,
      "--fd": `${n(rise, 2)}s`,
      "--dl": `${n(-pseudo(62, i, 0, rise), 2)}s`,
      "--dx": `${n(pseudo(65, i, -5, 9))}vw`
    })}"></i>`);
  }
  return `<div class="ls-vn-fx-layer">${sparks.join("")}</div>`;
}
function generateFogMarkup() {
  return `<div class="ls-vn-fog-wash"></div><div class="ls-vn-fog-layer ls-vn-fog-1"></div><div class="ls-vn-fog-layer ls-vn-fog-2"></div>`;
}

// src/frontend/stage/stage-director.ts
var AMBIENT_CACHE_STORAGE_KEY = "lumi_stats_ambient_light_v1";
var SAMPLE_W = 32;
var SAMPLE_H = 18;
var STRIP_COUNT = 7;
var SPEAKER_COLOR_PALETTE = [
  "#38bdf8",
  "#f472b6",
  "#a78bfa",
  "#34d399",
  "#fb923c",
  "#f87171",
  "#2dd4bf",
  "#e879f9",
  "#facc15",
  "#60a5fa"
];
var NEUTRAL_LIGHTING = {
  bri: 1,
  sat: 1,
  rimR: 255,
  rimG: 255,
  rimB: 255,
  rimA: 0.22,
  rimX: 0
};
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
function escapeCssUrl(url) {
  return String(url || "").replace(/["'()\\]/g, "\\$&");
}
function getSpeakerAccentColor(speakerName) {
  const key = String(speakerName || "").trim();
  if (!key)
    return "#38bdf8";
  let h = 2166136261;
  for (let i = 0;i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return SPEAKER_COLOR_PALETTE[(h >>> 0) % SPEAKER_COLOR_PALETTE.length];
}

class LumiStageDirector {
  lightingMemoryCache = new Map;
  sampleCanvas = null;
  transitionToken = 0;
  flashTimer = null;
  pointerMoveListener = null;
  parallaxState = {
    tx: 0,
    ty: 0,
    x: 0,
    y: 0,
    pushTarget: 0,
    push: 0,
    zoomTarget: 1,
    zoom: 1,
    rafId: 0,
    bound: false
  };
  constructor() {
    this.restoreLightingCacheFromStorage();
  }
  restoreLightingCacheFromStorage() {
    if (typeof localStorage === "undefined")
      return;
    try {
      const raw = localStorage.getItem(AMBIENT_CACHE_STORAGE_KEY);
      if (!raw)
        return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        for (const [k, v] of Object.entries(parsed)) {
          if (v && typeof v.bri === "number") {
            this.lightingMemoryCache.set(k, v);
          }
        }
      }
    } catch {}
  }
  saveLightingCacheToStorage() {
    if (typeof localStorage === "undefined")
      return;
    try {
      const entries = [...this.lightingMemoryCache.entries()].slice(-40);
      localStorage.setItem(AMBIENT_CACHE_STORAGE_KEY, JSON.stringify(Object.fromEntries(entries)));
    } catch {}
  }
  async sampleAndApplyAmbientLight(bgUrl, stageRoot, enabled = true) {
    if (!stageRoot || !enabled || !bgUrl) {
      stageRoot?.classList.remove("ls-vn-ambient-on");
      return NEUTRAL_LIGHTING;
    }
    const cached = this.lightingMemoryCache.get(bgUrl);
    if (cached) {
      this.applyLightingToDom(stageRoot, cached);
      return cached;
    }
    const img = await this.loadImageSafe(bgUrl);
    if (!img) {
      stageRoot.classList.remove("ls-vn-ambient-on");
      return NEUTRAL_LIGHTING;
    }
    try {
      if (!this.sampleCanvas) {
        this.sampleCanvas = document.createElement("canvas");
        this.sampleCanvas.width = SAMPLE_W;
        this.sampleCanvas.height = SAMPLE_H;
      }
      const ctx = this.sampleCanvas.getContext("2d", { willReadFrequently: true });
      if (!ctx)
        return NEUTRAL_LIGHTING;
      ctx.drawImage(img, 0, 0, SAMPLE_W, SAMPLE_H);
      const data = ctx.getImageData(0, 0, SAMPLE_W, SAMPLE_H).data;
      const pixels = [];
      let sumL = 0;
      for (let i = 0;i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        sumL += l;
        const idx = i / 4;
        pixels.push({ r, g, b, l, x: idx % SAMPLE_W / (SAMPLE_W - 1) });
      }
      const count = pixels.length;
      pixels.sort((a, b) => b.l - a.l);
      const top = pixels.slice(0, Math.max(1, Math.floor(count * 0.1)));
      let tr = 0;
      let tg = 0;
      let tb = 0;
      let tl = 0;
      let tx = 0;
      for (const p of top) {
        tr += p.r;
        tg += p.g;
        tb += p.b;
        tl += p.l;
        tx += p.x;
      }
      const m = top.length;
      const lum = sumL / count;
      const hi = [tr / m, tg / m, tb / m];
      const hiLum = tl / m;
      const hx = tx / m;
      const hiMax = Math.max(hi[0], hi[1], hi[2], 1);
      const rim = hi.map((v) => clamp(v / hiMax * 255 * 1.05 + 20, 0, 255));
      const rimX = Math.abs(hx - 0.5) < 0.12 ? 0 : hx < 0.5 ? -1 : 1;
      const computed = {
        bri: clamp(0.88 + lum * 0.22, 0.92, 1.06),
        sat: clamp(0.92 + lum * 0.15, 0.92, 1.05),
        rimR: rim[0],
        rimG: rim[1],
        rimB: rim[2],
        rimA: clamp(0.2 + (hiLum - lum) * 1.1, 0.2, 0.8) * 0.55,
        rimX
      };
      if (this.lightingMemoryCache.size >= 50) {
        const oldest = this.lightingMemoryCache.keys().next().value;
        if (oldest)
          this.lightingMemoryCache.delete(oldest);
      }
      this.lightingMemoryCache.set(bgUrl, computed);
      this.saveLightingCacheToStorage();
      this.applyLightingToDom(stageRoot, computed);
      return computed;
    } catch {
      stageRoot.classList.remove("ls-vn-ambient-on");
      return NEUTRAL_LIGHTING;
    }
  }
  applyLightingToDom(stageRoot, state) {
    stageRoot.classList.add("ls-vn-ambient-on");
    stageRoot.style.setProperty("--ls-vn-amb-bri", state.bri.toFixed(3));
    stageRoot.style.setProperty("--ls-vn-amb-sat", state.sat.toFixed(3));
    stageRoot.style.setProperty("--ls-vn-rim-color", `rgba(${Math.round(state.rimR)}, ${Math.round(state.rimG)}, ${Math.round(state.rimB)}, ${state.rimA.toFixed(3)})`);
    stageRoot.style.setProperty("--ls-vn-rim-x", `${(state.rimX * 4).toFixed(1)}px`);
  }
  loadImageSafe(url) {
    return new Promise((resolve) => {
      const img = new Image;
      img.crossOrigin = "anonymous";
      const timer = setTimeout(() => resolve(null), 3500);
      img.onload = () => {
        clearTimeout(timer);
        resolve(img);
      };
      img.onerror = () => {
        clearTimeout(timer);
        resolve(null);
      };
      img.src = url;
    });
  }
  async playBackgroundTransition(params) {
    const { stageRoot, prevUrl, nextUrl, transition, forcePreview } = params;
    const baseLayer = stageRoot.querySelector(".ls-vn-bg-base");
    const frontLayer = stageRoot.querySelector(".ls-vn-bg-front");
    const stack = stageRoot.querySelector(".ls-vn-bg-stack");
    if (!baseLayer || !frontLayer || !stack)
      return;
    const fallbackGradient = "radial-gradient(circle at 50% 28%, rgba(56, 189, 248, 0.24), rgba(15, 23, 42, 0.92) 62%, #050811 100%)";
    const nextBgCss = nextUrl ? `url("${escapeCssUrl(nextUrl)}")` : fallbackGradient;
    const prevBgCss = prevUrl && prevUrl !== nextUrl ? `url("${escapeCssUrl(prevUrl)}")` : "radial-gradient(circle at 50% 50%, #090d1a, #03050a 85%)";
    if (!forcePreview && !prevUrl && !nextUrl) {
      baseLayer.style.backgroundImage = fallbackGradient;
      return;
    }
    if (!forcePreview && prevUrl === nextUrl) {
      baseLayer.style.backgroundImage = nextBgCss;
      return;
    }
    const token = ++this.transitionToken;
    baseLayer.style.backgroundImage = prevBgCss;
    if (transition === "flash") {
      this.flashStage(stageRoot, "#ffffff", 550);
    }
    if (transition === "black") {
      const curtain = document.createElement("div");
      curtain.className = "ls-vn-curtain";
      const sub = document.createElement("div");
      sub.className = "ls-kicker";
      sub.textContent = params.timeLabel || "SCENE TRANSITION";
      const title = document.createElement("div");
      title.style.cssText = "font-size:22px;font-weight:800;color:#fff;margin-top:6px;";
      title.textContent = params.sceneTitle || "Current Scene";
      curtain.append(sub, title);
      stageRoot.append(curtain);
      curtain.offsetWidth;
      curtain.classList.add("is-active");
      await new Promise((r) => setTimeout(r, 440));
      if (this.transitionToken === token) {
        baseLayer.style.backgroundImage = nextBgCss;
      }
      await new Promise((r) => setTimeout(r, 480));
      curtain.classList.remove("is-active");
      setTimeout(() => curtain.remove(), 420);
      return;
    }
    if (transition === "strips") {
      const box = document.createElement("div");
      box.className = "ls-vn-bg-strips";
      const slant = 3.2;
      for (let i = 0;i < STRIP_COUNT; i++) {
        const y0 = i === 0 ? -10 : i / STRIP_COUNT * 100;
        const y1 = i === STRIP_COUNT - 1 ? 110 : (i + 1) / STRIP_COUNT * 100 + 0.5;
        const strip = document.createElement("div");
        strip.className = "ls-vn-bg-strip";
        strip.style.backgroundImage = nextBgCss;
        strip.style.setProperty("--strip-from", `${i % 2 ? "" : "-"}115%`);
        strip.style.setProperty("--strip-delay", `${i * 42}ms`);
        strip.style.clipPath = `polygon(-5% ${y0 + slant}%, 105% ${y0 - slant}%, 105% ${y1 - slant}%, -5% ${y1 + slant}%)`;
        box.append(strip);
      }
      stack.append(box);
      box.offsetWidth;
      box.classList.add("is-active");
      await new Promise((r) => setTimeout(r, 820));
      if (this.transitionToken === token) {
        baseLayer.style.backgroundImage = nextBgCss;
      }
      box.remove();
      return;
    }
    stack.dataset.bgTr = transition === "flash" ? "cinematic" : transition;
    frontLayer.classList.remove("is-active");
    frontLayer.style.backgroundImage = nextBgCss;
    frontLayer.offsetWidth;
    frontLayer.classList.add("is-active");
    await new Promise((r) => setTimeout(r, 820));
    if (this.transitionToken === token) {
      baseLayer.style.backgroundImage = nextBgCss;
      frontLayer.classList.remove("is-active");
    }
  }
  syncParallaxAndSpeakerPush(stageRoot, options) {
    if (!stageRoot)
      return;
    if (options.speakerPushEnabled) {
      const speakerSlot = stageRoot.querySelector('.ls-vn-actor-slot[data-active-speaker="true"]');
      if (speakerSlot) {
        const hostRect = stageRoot.getBoundingClientRect();
        const slotRect = speakerSlot.getBoundingClientRect();
        const ratio = hostRect.width ? (slotRect.left + slotRect.width / 2 - hostRect.left) / hostRect.width : 0.5;
        this.parallaxState.pushTarget = clamp((0.5 - ratio) * 1.8, -1, 1);
        this.parallaxState.zoomTarget = 1.018;
      } else {
        this.parallaxState.pushTarget = 0;
        this.parallaxState.zoomTarget = 1;
      }
    } else {
      this.parallaxState.pushTarget = 0;
      this.parallaxState.zoomTarget = 1;
    }
    if (!this.parallaxState.bound && typeof window !== "undefined") {
      this.parallaxState.bound = true;
      this.pointerMoveListener = (ev) => {
        const activeRoot = document.querySelector("[data-ls-vn-stage-root]");
        if (!activeRoot || activeRoot.offsetParent === null)
          return;
        const r = activeRoot.getBoundingClientRect();
        if (!r.width || !r.height)
          return;
        this.parallaxState.tx = clamp(((ev.clientX - r.left) / r.width - 0.5) * 2, -1, 1);
        this.parallaxState.ty = clamp(((ev.clientY - r.top) / r.height - 0.5) * 2, -1, 1);
        this.kickParallaxFrame(options);
      };
      window.addEventListener("pointermove", this.pointerMoveListener, { passive: true });
    }
    this.kickParallaxFrame(options);
  }
  kickParallaxFrame(options) {
    if (this.parallaxState.rafId)
      return;
    const step = () => {
      this.parallaxState.rafId = 0;
      const stageRoot = document.querySelector("[data-ls-vn-stage-root]");
      if (!stageRoot)
        return;
      const tx = options.parallaxEnabled ? this.parallaxState.tx : 0;
      const ty = options.parallaxEnabled ? this.parallaxState.ty : 0;
      this.parallaxState.x += (tx - this.parallaxState.x) * 0.08;
      this.parallaxState.y += (ty - this.parallaxState.y) * 0.08;
      this.parallaxState.push += (this.parallaxState.pushTarget - this.parallaxState.push) * 0.05;
      this.parallaxState.zoom += (this.parallaxState.zoomTarget - this.parallaxState.zoom) * 0.05;
      const { x, y, push, zoom } = this.parallaxState;
      const bgEl = stageRoot.querySelector(".ls-vn-bg-stack");
      const charEl = stageRoot.querySelector(".ls-vn-actors-layer");
      const fxEl = stageRoot.querySelector(".ls-vn-weather-layer");
      if (bgEl) {
        bgEl.style.translate = `${(-x * 1 + push * 0.4).toFixed(3)}% ${(-y * 0.75).toFixed(3)}%`;
      }
      if (charEl) {
        charEl.style.translate = `${(-x * 1.5 + push).toFixed(3)}% ${(-y * 0.7).toFixed(3)}%`;
        charEl.style.scale = zoom.toFixed(4);
      }
      if (fxEl) {
        fxEl.style.translate = `${(-x * 2.2 + push * 1.1).toFixed(3)}% ${(-y * 1.2).toFixed(3)}%`;
      }
      const settled = Math.abs(tx - this.parallaxState.x) < 0.002 && Math.abs(ty - this.parallaxState.y) < 0.002 && Math.abs(this.parallaxState.pushTarget - this.parallaxState.push) < 0.002;
      if (!settled) {
        this.parallaxState.rafId = requestAnimationFrame(step);
      }
    };
    this.parallaxState.rafId = requestAnimationFrame(step);
  }
  flashStage(stageRoot, color = "#ffffff", durationMs = 500) {
    if (!stageRoot)
      return;
    let flashEl = stageRoot.querySelector(".ls-vn-flash");
    if (!flashEl) {
      flashEl = document.createElement("div");
      flashEl.className = "ls-vn-flash";
      stageRoot.append(flashEl);
    }
    flashEl.style.background = color;
    flashEl.style.opacity = "0.78";
    if (this.flashTimer !== null)
      clearTimeout(this.flashTimer);
    this.flashTimer = setTimeout(() => {
      this.flashTimer = null;
      if (flashEl) {
        flashEl.style.transition = `opacity ${durationMs}ms ease-out`;
        flashEl.style.opacity = "0";
      }
    }, 60);
  }
  destroy() {
    this.transitionToken++;
    if (this.flashTimer !== null) {
      clearTimeout(this.flashTimer);
      this.flashTimer = null;
    }
    if (this.pointerMoveListener && typeof window !== "undefined") {
      window.removeEventListener("pointermove", this.pointerMoveListener);
      this.pointerMoveListener = null;
    }
    this.parallaxState.bound = false;
    if (this.parallaxState.rafId) {
      cancelAnimationFrame(this.parallaxState.rafId);
      this.parallaxState.rafId = 0;
    }
    this.sampleCanvas = null;
  }
}

// src/frontend/surfaces/VnStage.ts
var DEFAULT_STAGE_RIG = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  flipX: false
};
function splitTurnIntoVnBeats(rawText) {
  const cleaned = cleanBrailleAndProseWhitespace(rawText).trim();
  if (!cleaned)
    return ["…"];
  const rawParagraphs = cleaned.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const paragraphs = [];
  for (const p of rawParagraphs) {
    if (paragraphs.length > 0 && (paragraphs[paragraphs.length - 1].length < 110 || p.length < 110) && paragraphs[paragraphs.length - 1].length + 2 + p.length <= 340) {
      paragraphs[paragraphs.length - 1] += `

${p}`;
    } else {
      paragraphs.push(p);
    }
  }
  const beats = [];
  for (const p of paragraphs) {
    if (p.length <= 340) {
      beats.push(p);
      continue;
    }
    const sents = p.match(/[^.!?。！？\n]+[.!?。！？]+(?:["”」』*]+)?|[^.!?。！？\n]+$/g) || [p];
    let cur = "";
    for (const s of sents) {
      const trimmed = s.trim();
      if (!trimmed)
        continue;
      if (!cur)
        cur = trimmed;
      else if (cur.length + 1 + trimmed.length <= 340) {
        cur = `${cur} ${trimmed}`;
      } else {
        beats.push(cur);
        cur = trimmed;
      }
    }
    if (cur)
      beats.push(cur);
  }
  return beats.length > 0 ? beats : [cleaned];
}
function resolveVnBeatSpeaker(beatText, turnRole, state) {
  if (turnRole === "user") {
    return {
      speakerName: state.player.name || "You",
      isNarrator: false,
      matchedActor: null
    };
  }
  const text = String(beatText || "").trim();
  const allActors = Object.values(state.characters);
  const presentActors = allActors.filter((c) => c.present);
  const candidates = presentActors.length > 0 ? presentActors : allActors;
  const findActorByName = (label) => {
    const low = label.trim().toLowerCase();
    if (!low)
      return null;
    for (const actor of candidates) {
      if (actor.name.toLowerCase() === low)
        return actor;
      const firstWord = actor.name.split(/\s+/)[0]?.toLowerCase();
      if (firstWord && firstWord.length >= 2 && firstWord === low)
        return actor;
      if (actor.aliases?.some((a) => a.trim().toLowerCase() === low))
        return actor;
    }
    return null;
  };
  const prefixMatch = text.match(/^\s*(?:\*\*([^*\n:：]{1,48})\s*[:：]\*\*|\*\*([^*\n:：]{1,48})\*\*\s*[:：]|([A-Z][\p{L}\p{N}_' -]{1,40})\s*[:：])\s*/mu);
  const prefixName = (prefixMatch?.[1] || prefixMatch?.[2] || prefixMatch?.[3] || "").trim();
  if (prefixName) {
    if (/^(?:narrator|narration|gm|dm|system|scene)$/i.test(prefixName)) {
      return { speakerName: "Narrator", isNarrator: true, matchedActor: null };
    }
    const matched = findActorByName(prefixName);
    if (matched) {
      return { speakerName: matched.name, isNarrator: false, matchedActor: matched };
    }
  }
  const hasQuotes = /(?:"[^"\n]{1,}"|“[^”\n]{1,}”|「[^」\n]{1,}」|『[^』\n]{1,}』)/.test(text);
  if (!hasQuotes) {
    return { speakerName: "Narrator", isNarrator: true, matchedActor: null };
  }
  const outsideQuotes = text.replace(/(?:"[^"]*"|“[^”]*”|「[^」]*」|『[^』]*』)/g, " ").toLowerCase();
  const mentioned = candidates.filter((actor) => {
    const tokens = [
      actor.name.toLowerCase(),
      actor.name.split(/\s+/)[0]?.toLowerCase() || "",
      ...(actor.aliases || []).map((a) => a.toLowerCase())
    ].filter((t) => t.length >= 2);
    return tokens.some((tok) => {
      const esc = tok.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`\\b${esc}\\b`, "i").test(outsideQuotes);
    });
  });
  if (mentioned.length >= 1) {
    const ranked = [...mentioned].sort((a, b) => {
      const aFirst = a.name.split(/\s+/)[0].toLowerCase();
      const bFirst = b.name.split(/\s+/)[0].toLowerCase();
      return outsideQuotes.indexOf(aFirst) - outsideQuotes.indexOf(bFirst);
    });
    return {
      speakerName: ranked[0].name,
      isNarrator: false,
      matchedActor: ranked[0]
    };
  }
  if (presentActors.length === 1) {
    return {
      speakerName: presentActors[0].name,
      isNarrator: false,
      matchedActor: presentActors[0]
    };
  }
  return { speakerName: "Narrator", isNarrator: true, matchedActor: null };
}
function mapDemeanorToStageEmotion(demeanor) {
  const e = String(demeanor || "neutral").toLowerCase();
  if (/\b(?:joy|warm|happy|excited|amused|smiling|cheerful)\b/.test(e))
    return "joy";
  if (/\b(?:angry|furious|hostile|annoyed|irritated|brusque|stern)\b/.test(e))
    return "anger";
  if (/\b(?:sad|grieving|lonely|hurt|melancholy)\b/.test(e))
    return "sadness";
  if (/\b(?:afraid|surprised|shocked|startled|tense|hurried)\b/.test(e))
    return "surprise";
  if (/\b(?:embarrassed|shy|flustered|blushing|heated)\b/.test(e))
    return "embarrassment";
  if (/\b(?:curious|suspicious|conflicted|calculating|expectant)\b/.test(e))
    return "curiosity";
  return "neutral";
}
function renderFormattedBeatDom(beatText) {
  const frag = document.createDocumentFragment();
  const clean = beatText.trim();
  const tokenRe = /("[^"\n]+"|“[^”\n]+”|「[^」\n]+」|『[^』\n]+』|\*[^*\n]+\*)/g;
  let lastIdx = 0;
  let match;
  while ((match = tokenRe.exec(clean)) !== null) {
    if (match.index > lastIdx) {
      frag.append(document.createTextNode(clean.slice(lastIdx, match.index)));
    }
    const token = match[0];
    if (token.startsWith("*") && token.endsWith("*")) {
      const em = el("em", "ls-vn-prose-thought", token.slice(1, -1));
      frag.append(em);
    } else {
      const q = el("span", "ls-vn-prose-quote", token);
      frag.append(q);
    }
    lastIdx = tokenRe.lastIndex;
  }
  if (lastIdx < clean.length) {
    frag.append(document.createTextNode(clean.slice(lastIdx)));
  }
  return frag;
}

class LumiVnStage {
  ctrl;
  activeTurnIndex = -1;
  activeBeatIndex = 0;
  beatPaginationEnabled = true;
  uiHidden = false;
  directorOpen = false;
  thoughtPeekOpen = false;
  composerOpen = false;
  isAutoPlay = false;
  isRecordingStt = false;
  activeCheckResult = null;
  director = new LumiStageDirector;
  stageHudScope = new ComponentScope;
  portalMount = null;
  fallbackModal = null;
  stageRoot = null;
  bgStackEl = null;
  weatherLayerEl = null;
  actorsLayerEl = null;
  topHudEl = null;
  hudWidgetEl = null;
  popoversEl = null;
  bottomDockEl = null;
  hudWidgetPos = null;
  lastRenderedBgUrl = null;
  lastRenderedWeather = undefined;
  lastTurnSig = "";
  lastTurnsCount = 0;
  lastBeatSig = "";
  lastAutoSpokenBeatSig = "";
  typewriterTimer = null;
  isTypewriterRunning = false;
  autoPlayTimer = null;
  sttSession = null;
  constructor(ctrl) {
    this.ctrl = ctrl;
  }
  open() {
    this.ctrl.vnStageOpen = true;
    this.lastAutoSpokenBeatSig = "";
    this.ctrl.emitChange();
    this.ensureMounted();
    this.sync();
    this.ctrl.refreshActiveChat().then(() => {
      if (!this.ctrl.vnStageOpen)
        return;
      this.ensureMounted();
      this.sync();
    });
  }
  close() {
    this.ctrl.vnStageOpen = false;
    this.stopTypewriter();
    this.ctrl.tts.stop();
    if (this.autoPlayTimer) {
      clearTimeout(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
    this.isAutoPlay = false;
    if (this.sttSession) {
      try {
        this.sttSession.cancel();
      } catch {}
      this.sttSession = null;
      this.isRecordingStt = false;
    }
    this.director.destroy();
    if (this.portalMount) {
      this.portalMount.setVisible(false);
    }
    if (this.fallbackModal) {
      this.fallbackModal.dismiss();
      this.fallbackModal = null;
    }
    this.ctrl.emitChange();
  }
  ensureMounted() {
    if (this.stageRoot && this.stageRoot.isConnected) {
      this.portalMount?.setVisible(true);
      return;
    }
    let hostRoot = null;
    if (!this.portalMount && typeof this.ctrl.ctx.ui?.mountApp === "function") {
      try {
        this.portalMount = this.ctrl.ctx.ui.mountApp({
          className: "ls-vn-portal",
          position: "app-overlay"
        });
      } catch {
        this.portalMount = null;
      }
    }
    if (this.portalMount) {
      this.portalMount.setVisible(true);
      hostRoot = this.portalMount.root;
    } else {
      this.fallbackModal = this.ctrl.modals.open({ title: "\uD83C\uDFAD Lumi Stats — 2D Visual Novel Stage", width: 1360, maxHeight: 880 }, (body, _close, handle) => {
        body.style.padding = "0";
        handle.onDismiss(() => {
          this.ctrl.vnStageOpen = false;
          this.stageRoot = null;
        });
      }) ?? null;
      hostRoot = this.fallbackModal?.root ?? null;
    }
    if (!hostRoot)
      return;
    const shell = el("div", "ls-vn-stage ls-root");
    shell.setAttribute("data-ls-vn-stage-root", "true");
    shell.tabIndex = 0;
    const bgStack = el("div", "ls-vn-bg-stack");
    bgStack.append(el("div", "ls-vn-bg-layer ls-vn-bg-base"), el("div", "ls-vn-bg-layer ls-vn-bg-front"));
    const weatherLayer = el("div", "ls-vn-weather-layer");
    const actorsLayer = el("div", "ls-vn-actors-layer");
    const topHud = el("header", "ls-vn-top-hud");
    const hudWidget = el("aside", "ls-vn-hud-widget");
    const popovers = el("div", "ls-vn-popovers");
    const bottomDock = el("div", "ls-vn-bottom-dock");
    this.bindStageHudDrag(hudWidget);
    shell.append(bgStack, weatherLayer, actorsLayer, topHud, hudWidget, popovers, bottomDock);
    hostRoot.replaceChildren(shell);
    this.stageRoot = shell;
    this.bgStackEl = bgStack;
    this.weatherLayerEl = weatherLayer;
    this.actorsLayerEl = actorsLayer;
    this.topHudEl = topHud;
    this.hudWidgetEl = hudWidget;
    this.popoversEl = popovers;
    this.bottomDockEl = bottomDock;
    this.lastRenderedBgUrl = null;
    this.lastRenderedWeather = undefined;
    shell.addEventListener("keydown", (ev) => {
      const target = ev.target;
      if (ev.key !== "Escape" && target?.closest("input, textarea, select, button")) {
        return;
      }
      if (ev.key === "Escape") {
        ev.preventDefault();
        this.close();
      } else if (ev.key === "h" || ev.key === "H") {
        ev.preventDefault();
        this.uiHidden = !this.uiHidden;
        this.sync();
      } else if (ev.key === " " || ev.key === "ArrowRight") {
        ev.preventDefault();
        this.advanceBeatOrTurn();
      } else if (ev.key === "ArrowLeft") {
        ev.preventDefault();
        this.stepBackBeatOrTurn();
      }
    });
  }
  bindStageHudDrag(widgetEl) {
    widgetEl.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || e.target?.closest("button, input, select, textarea, a, .ls-hud-content")) {
        return;
      }
      const rect = widgetEl.getBoundingClientRect();
      const uiScale = rect.width > 0 && widgetEl.offsetWidth > 0 ? rect.width / widgetEl.offsetWidth : 1;
      const startX = e.clientX;
      const startY = e.clientY;
      const origX = this.hudWidgetPos?.x ?? widgetEl.offsetLeft;
      const origY = this.hudWidgetPos?.y ?? widgetEl.offsetTop;
      try {
        widgetEl.setPointerCapture(e.pointerId);
      } catch {}
      const onMove = (me) => {
        const dx = (me.clientX - startX) / uiScale;
        const dy = (me.clientY - startY) / uiScale;
        const maxX = Math.max(12, (this.stageRoot?.clientWidth ?? window.innerWidth) - widgetEl.offsetWidth - 12);
        const maxY = Math.max(12, (this.stageRoot?.clientHeight ?? window.innerHeight) - widgetEl.offsetHeight - 12);
        const nx = Math.max(12, Math.min(maxX, Math.round(origX + dx)));
        const ny = Math.max(12, Math.min(maxY, Math.round(origY + dy)));
        this.hudWidgetPos = { x: nx, y: ny };
        widgetEl.style.right = "auto";
        widgetEl.style.left = `${nx}px`;
        widgetEl.style.top = `${ny}px`;
      };
      const onUp = (ue) => {
        widgetEl.removeEventListener("pointermove", onMove);
        widgetEl.removeEventListener("pointerup", onUp);
        widgetEl.removeEventListener("pointercancel", onUp);
        try {
          widgetEl.releasePointerCapture(ue.pointerId);
        } catch {}
      };
      widgetEl.addEventListener("pointermove", onMove);
      widgetEl.addEventListener("pointerup", onUp);
      widgetEl.addEventListener("pointercancel", onUp);
    });
  }
  syncStageHudWidget() {
    if (!this.hudWidgetEl)
      return;
    this.stageHudScope.clear();
    const showHudWidget = !this.uiHidden && (this.ctrl.settings?.vnShowHudWidget !== undefined ? Boolean(this.ctrl.settings.vnShowHudWidget) : this.ctrl.vnShowHudWidget);
    if (!showHudWidget) {
      this.hudWidgetEl.style.display = "none";
      this.hudWidgetEl.replaceChildren();
      return;
    }
    this.hudWidgetEl.style.display = "flex";
    this.hudWidgetEl.dataset.expanded = String(this.ctrl.widgetExpanded);
    if (this.hudWidgetPos) {
      this.hudWidgetEl.style.right = "auto";
      this.hudWidgetEl.style.left = `${this.hudWidgetPos.x}px`;
      this.hudWidgetEl.style.top = `${this.hudWidgetPos.y}px`;
    }
    const hudDom = renderFloatingHudSurface(this.ctrl, !this.ctrl.widgetExpanded, () => {
      this.ctrl.widgetExpanded = !this.ctrl.widgetExpanded;
      this.syncStageHudWidget();
    }, (actorId) => openCharacterDossierModal(this.ctrl, actorId), () => openSettingsStudioModal(this.ctrl), this.stageHudScope);
    this.hudWidgetEl.replaceChildren(hudDom);
  }
  getTurnsList() {
    if (this.ctrl.recentTurns.length > 0)
      return this.ctrl.recentTurns;
    const { state } = this.ctrl.snapshot;
    return [
      {
        id: "scene_summary",
        role: "assistant",
        content: state.scene.beatSummary || `*Scene ready at ${state.scene.location || state.title || "the current location"}.*`
      }
    ];
  }
  stopTypewriter(flushFullText) {
    if (this.typewriterTimer) {
      clearInterval(this.typewriterTimer);
      this.typewriterTimer = null;
    }
    if (this.isTypewriterRunning && flushFullText && this.bottomDockEl) {
      const proseEl = this.bottomDockEl.querySelector("[data-ls-vn-prose]");
      if (proseEl) {
        proseEl.replaceChildren(renderFormattedBeatDom(flushFullText));
      }
    }
    this.isTypewriterRunning = false;
  }
  runTypewriter(proseEl, beatText) {
    this.stopTypewriter();
    const prefersReduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !this.beatPaginationEnabled || beatText.length > 350) {
      proseEl.replaceChildren(renderFormattedBeatDom(beatText));
      return;
    }
    this.isTypewriterRunning = true;
    let idx = 0;
    const step = Math.max(1, Math.ceil(beatText.length / 40));
    proseEl.textContent = "";
    this.typewriterTimer = setInterval(() => {
      idx += step;
      if (idx >= beatText.length) {
        this.stopTypewriter(beatText);
        return;
      }
      proseEl.textContent = beatText.slice(0, idx);
    }, 18);
  }
  advanceBeatOrTurn() {
    const turns = this.getTurnsList();
    const turnIdx = this.activeTurnIndex >= 0 && this.activeTurnIndex < turns.length ? this.activeTurnIndex : turns.length - 1;
    const curTurn = turns[turnIdx];
    const beats = this.beatPaginationEnabled ? splitTurnIntoVnBeats(curTurn.content) : [curTurn.content];
    const curBeatText = beats[this.activeBeatIndex] ?? curTurn.content;
    if (this.isTypewriterRunning) {
      this.stopTypewriter(curBeatText);
      return;
    }
    if (this.beatPaginationEnabled && this.activeBeatIndex + 1 < beats.length) {
      this.activeBeatIndex++;
      this.sync();
    } else if (turnIdx + 1 < turns.length) {
      this.activeTurnIndex = turnIdx + 1;
      this.activeBeatIndex = 0;
      this.sync();
    } else {
      this.isAutoPlay = false;
      if (this.autoPlayTimer) {
        clearTimeout(this.autoPlayTimer);
        this.autoPlayTimer = null;
      }
      this.composerOpen = true;
      this.sync();
    }
  }
  stepBackBeatOrTurn() {
    this.stopTypewriter();
    const turns = this.getTurnsList();
    const turnIdx = this.activeTurnIndex >= 0 && this.activeTurnIndex < turns.length ? this.activeTurnIndex : turns.length - 1;
    if (this.beatPaginationEnabled && this.activeBeatIndex > 0) {
      this.activeBeatIndex--;
      this.sync();
    } else if (turnIdx > 0) {
      this.activeTurnIndex = turnIdx - 1;
      this.activeBeatIndex = 0;
      this.sync();
    }
  }
  speakCurrentBeat(fromAutoAdvance = false) {
    if (this.autoPlayTimer) {
      clearTimeout(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
    const { state } = this.ctrl.snapshot;
    const turns = this.getTurnsList();
    const turnIdx = this.activeTurnIndex >= 0 && this.activeTurnIndex < turns.length ? this.activeTurnIndex : turns.length - 1;
    const curTurn = turns[turnIdx];
    const beats = this.beatPaginationEnabled ? splitTurnIntoVnBeats(curTurn.content) : [curTurn.content];
    const beatText = beats[this.activeBeatIndex] ?? curTurn.content;
    const speakerInfo = resolveVnBeatSpeaker(beatText, curTurn.role, state);
    let segments = splitBeatIntoVoiceSegments(beatText, speakerInfo, state, this.ctrl.settings);
    if (!segments.length) {
      segments = splitBeatIntoVoiceSegments(beatText, speakerInfo, state, this.ctrl.settings ? { ...this.ctrl.settings, ttsReadMode: "narration_and_dialogue" } : undefined);
    }
    const nextBeatText = beats[this.activeBeatIndex + 1];
    if (nextBeatText) {
      const nextSpeaker = resolveVnBeatSpeaker(nextBeatText, curTurn.role, state);
      const nextSegs = splitBeatIntoVoiceSegments(nextBeatText, nextSpeaker, state, this.ctrl.settings);
      this.ctrl.tts.prefetchSegments(nextSegs);
    }
    this.ctrl.tts.playSegments(segments, () => this.syncDialogueDockOnly()).then((completed) => {
      if (completed && this.isAutoPlay && this.ctrl.vnStageOpen) {
        if (this.autoPlayTimer)
          clearTimeout(this.autoPlayTimer);
        this.autoPlayTimer = setTimeout(() => this.advanceBeatOrTurn(), 550);
      }
    });
  }
  sync() {
    if (!this.ctrl.vnStageOpen) {
      if (this.portalMount)
        this.portalMount.setVisible(false);
      return;
    }
    this.ensureMounted();
    if (!this.stageRoot)
      return;
    this.ctrl.applyTemplateThemeToDom();
    const { state } = this.ctrl.snapshot;
    const settings = this.ctrl.settings;
    const currentPlace = state.places[state.currentPlaceId] ?? Object.values(state.places)[0];
    const resolvedBg = resolveBestPlaceBackdropUrl(currentPlace, state);
    const bgUrl = resolvedBg.url;
    if (bgUrl !== this.lastRenderedBgUrl && this.stageRoot) {
      const prevUrl = this.lastRenderedBgUrl ?? "";
      const isInitialMount = this.lastRenderedBgUrl === null;
      this.lastRenderedBgUrl = bgUrl;
      this.director.playBackgroundTransition({
        stageRoot: this.stageRoot,
        prevUrl,
        nextUrl: bgUrl,
        transition: settings?.vnTransitionStyle || "cinematic",
        sceneTitle: currentPlace?.name || state.scene.location || state.title,
        timeLabel: state.scene.timeLabel,
        forcePreview: !isInitialMount
      });
      if (bgUrl && settings?.vnAmbientLightEnabled !== false) {
        this.director.sampleAndApplyAmbientLight(bgUrl, this.stageRoot, true);
      }
    }
    const activeWeather = inferWeatherEffect(state.scene.weather, settings?.vnWeatherOverride);
    if (activeWeather !== this.lastRenderedWeather && this.weatherLayerEl) {
      this.lastRenderedWeather = activeWeather;
      this.weatherLayerEl.className = `ls-vn-weather-layer${activeWeather ? ` ls-vn-weather-${activeWeather}` : ""}`;
      this.weatherLayerEl.innerHTML = activeWeather ? generateWeatherParticlesHtml(activeWeather, false) : "";
    }
    const turns = this.getTurnsList();
    const wasAtLatest = this.lastTurnsCount > 0 && this.activeTurnIndex === this.lastTurnsCount - 1;
    if (this.activeTurnIndex < 0 || this.activeTurnIndex >= turns.length || wasAtLatest && turns.length > this.lastTurnsCount) {
      this.activeTurnIndex = turns.length - 1;
    }
    this.lastTurnsCount = turns.length;
    const currentTurn = turns[this.activeTurnIndex];
    const turnSig = `${this.ctrl.chatId}:${currentTurn.id}:${this.activeTurnIndex}:${currentTurn.content.length}`;
    if (turnSig !== this.lastTurnSig) {
      this.lastTurnSig = turnSig;
      this.activeBeatIndex = 0;
    }
    const beats = this.beatPaginationEnabled ? splitTurnIntoVnBeats(currentTurn.content) : [currentTurn.content];
    if (this.activeBeatIndex >= beats.length) {
      this.activeBeatIndex = Math.max(0, beats.length - 1);
    }
    const beatText = beats[this.activeBeatIndex] ?? currentTurn.content;
    const speakerInfo = resolveVnBeatSpeaker(beatText, currentTurn.role, state);
    this.syncActorsLayer(state, speakerInfo, beatText);
    this.syncTopHudAndPopovers(state);
    this.syncStageHudWidget();
    this.syncDialogueDockOnly(turns, currentTurn, beats, beatText, speakerInfo);
    const currentBeatSig = `${turnSig}:${this.activeBeatIndex}:${this.beatPaginationEnabled}`;
    const autoTtsOn = settings?.ttsAutoPlayInStage !== false;
    if (autoTtsOn && currentBeatSig !== this.lastAutoSpokenBeatSig && beatText.trim().length > 1) {
      this.lastAutoSpokenBeatSig = currentBeatSig;
      this.speakCurrentBeat(true);
    }
    this.director.syncParallaxAndSpeakerPush(this.stageRoot, {
      parallaxEnabled: settings?.vnParallaxEnabled !== false,
      speakerPushEnabled: true
    });
    if (this.isAutoPlay && !this.ctrl.tts.isPlaying && (this.activeBeatIndex + 1 < beats.length || this.activeTurnIndex + 1 < turns.length)) {
      if (this.autoPlayTimer)
        clearTimeout(this.autoPlayTimer);
      this.autoPlayTimer = setTimeout(() => {
        if (!this.ctrl.tts.isPlaying && this.isAutoPlay) {
          this.advanceBeatOrTurn();
        }
      }, 3200);
    }
  }
  syncActorsLayer(state, speakerInfo, beatText = "") {
    if (!this.actorsLayerEl)
      return;
    const shotMode = this.ctrl.settings?.vnShotMode || "waist";
    this.actorsLayerEl.dataset.shotMode = shotMode;
    const allChars = Object.values(state.characters);
    const hasSprite = (c) => {
      return Boolean(resolveBestCharacterSprite(c, beatText).url);
    };
    const presentWithSprites = allChars.filter((c) => c.present && hasSprite(c));
    const anyWithSprites = allChars.filter(hasSprite);
    const stageCast = (presentWithSprites.length > 0 ? presentWithSprites : anyWithSprites).slice(0, 4);
    const slotOrder = stageCast.length <= 1 ? ["center"] : stageCast.length === 2 ? ["left", "right"] : ["left", "center", "right", "far-right"];
    const activeIds = new Set(stageCast.map((c) => c.id));
    for (const child of [...this.actorsLayerEl.children]) {
      const cid = child.dataset.actorId;
      if (!cid || !activeIds.has(cid)) {
        child.remove();
      }
    }
    stageCast.forEach((actor, idx) => {
      let slotEl = this.actorsLayerEl.querySelector(`.ls-vn-actor-slot[data-actor-id="${CSS.escape(actor.id)}"]`);
      if (!slotEl) {
        slotEl = this.createActorSlotDom(actor);
        this.actorsLayerEl.append(slotEl);
      }
      const rig = { ...DEFAULT_STAGE_RIG, ...actor.stageRig ?? {} };
      const slotName = rig.pinnedSlot && rig.slot && rig.slot !== "hidden" ? rig.slot : slotOrder[idx % slotOrder.length];
      const isSpeaking = !speakerInfo.isNarrator && (speakerInfo.matchedActor?.id === actor.id || speakerInfo.speakerName.toLowerCase() === actor.name.toLowerCase());
      const demeanorVal = resolveCharacterFieldValue(actor, "demeanor");
      const resolvedSprite = resolveBestCharacterSprite(actor, beatText);
      const spriteUrl = resolvedSprite.url;
      slotEl.dataset.slot = slotName;
      slotEl.dataset.activeSpeaker = String(isSpeaking);
      slotEl.dataset.emotion = mapDemeanorToStageEmotion(demeanorVal);
      const gizmoBar = slotEl.querySelector(".ls-vn-gizmo-bar");
      if (gizmoBar) {
        gizmoBar.style.display = this.uiHidden ? "none" : "";
      }
      const rigEl = slotEl.querySelector(".ls-vn-avatar-rig");
      if (rigEl) {
        const flipMul = rig.flipX ? -1 : 1;
        rigEl.style.transform = `translate(${rig.offsetX}px, ${-rig.offsetY}px) scale(${(rig.scale * flipMul).toFixed(2)}, ${rig.scale.toFixed(2)})`;
        const existingImg = rigEl.querySelector("img.ls-vn-sprite-img");
        if (spriteUrl) {
          if (existingImg) {
            if (existingImg.getAttribute("src") !== spriteUrl) {
              existingImg.src = spriteUrl;
            }
          } else {
            const img = el("img", "ls-vn-sprite-img");
            img.src = spriteUrl;
            img.alt = actor.name;
            img.draggable = false;
            rigEl.replaceChildren(img);
          }
        } else {
          rigEl.replaceChildren();
        }
      }
    });
  }
  createActorSlotDom(actor) {
    const slotEl = el("div", "ls-vn-actor-slot");
    slotEl.dataset.actorId = actor.id;
    const gizmoBar = el("div", "ls-vn-gizmo-bar");
    const mutateRig = (updater) => {
      const latestActor = this.ctrl.snapshot.state.characters[actor.id];
      if (!latestActor)
        return;
      const nextRig = updater({ ...DEFAULT_STAGE_RIG, ...latestActor.stageRig ?? {} });
      const nextChars = structuredClone(this.ctrl.snapshot.state.characters);
      nextChars[actor.id].stageRig = nextRig;
      this.ctrl.request("state:mutate", {
        stateOverride: { characters: nextChars },
        reason: `Adjusted 2D stage rig for ${actor.name}`
      });
    };
    gizmoBar.append(btn("\uD83E\uDEAA", () => openCharacterDossierModal(this.ctrl, actor.id), "ls-btn-sm ls-btn-icon", "Open Character Dossier"), btn("\uD83D\uDD0A", () => openVoiceAssignmentModal(this.ctrl, actor.id), "ls-btn-sm ls-btn-icon", `Assign TTS Voice for ${actor.name}`), btn("\uD83D\uDDBC️", () => this.ctrl.pickAndUploadImage(actor.id, "portrait"), "ls-btn-sm ls-btn-icon", "Upload 2D Character Sprite"), btn("＋", () => mutateRig((r) => ({ ...r, scale: Number(Math.min(2.4, r.scale + 0.12).toFixed(2)) })), "ls-btn-sm ls-btn-icon", "Scale Up"), btn("－", () => mutateRig((r) => ({ ...r, scale: Number(Math.max(0.45, r.scale - 0.12).toFixed(2)) })), "ls-btn-sm ls-btn-icon", "Scale Down"), btn("⇄", () => mutateRig((r) => ({ ...r, flipX: !r.flipX })), "ls-btn-sm ls-btn-icon", "Flip Horizontally"), btn("↺", () => mutateRig(() => ({ ...DEFAULT_STAGE_RIG })), "ls-btn-sm ls-btn-icon", "Reset Position & Scale"));
    const rigEl = el("div", "ls-vn-avatar-rig");
    slotEl.append(gizmoBar, rigEl);
    slotEl.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || e.target?.closest("button"))
        return;
      const rect = slotEl.getBoundingClientRect();
      const uiScale = rect.width > 0 && slotEl.offsetWidth > 0 ? rect.width / slotEl.offsetWidth : 1;
      const latestActor = this.ctrl.snapshot.state.characters[actor.id];
      const curRig = { ...DEFAULT_STAGE_RIG, ...latestActor?.stageRig ?? {} };
      const startX = e.clientX;
      const startY = e.clientY;
      let nextX = curRig.offsetX;
      let nextY = curRig.offsetY;
      let moved = false;
      try {
        slotEl.setPointerCapture(e.pointerId);
      } catch {}
      const onMove = (me) => {
        const dx = (me.clientX - startX) / uiScale;
        const dy = (me.clientY - startY) / uiScale;
        if (!moved && Math.hypot(dx, dy) > 4)
          moved = true;
        if (!moved)
          return;
        nextX = Math.round(curRig.offsetX + dx);
        nextY = Math.round(curRig.offsetY - dy);
        const flipMul = curRig.flipX ? -1 : 1;
        rigEl.style.transform = `translate(${nextX}px, ${-nextY}px) scale(${(curRig.scale * flipMul).toFixed(2)}, ${curRig.scale.toFixed(2)})`;
      };
      const onUp = (ue) => {
        slotEl.removeEventListener("pointermove", onMove);
        slotEl.removeEventListener("pointerup", onUp);
        slotEl.removeEventListener("pointercancel", onUp);
        try {
          slotEl.releasePointerCapture(ue.pointerId);
        } catch {}
        if (moved) {
          mutateRig((r) => ({ ...r, offsetX: nextX, offsetY: nextY }));
        }
      };
      slotEl.addEventListener("pointermove", onMove);
      slotEl.addEventListener("pointerup", onUp);
      slotEl.addEventListener("pointercancel", onUp);
    });
    return slotEl;
  }
  syncTopHudAndPopovers(state) {
    if (!this.topHudEl || !this.popoversEl)
      return;
    this.topHudEl.replaceChildren();
    this.popoversEl.replaceChildren();
    if (this.uiHidden) {
      const restoreWrap = el("div");
      restoreWrap.style.cssText = "margin-left:auto;pointer-events:auto;";
      restoreWrap.append(btn("\uD83D\uDC41️ Show Stage UI (H)", () => {
        this.uiHidden = false;
        this.sync();
      }, "ls-btn-sm ls-btn-primary"));
      this.topHudEl.append(restoreWrap);
      return;
    }
    const banner = formatSceneBanner(state);
    const leftRow = el("div", "ls-row");
    leftRow.append(el("span", "ls-chip ls-chip-accent", `\uD83D\uDCCD ${banner.location}`), el("span", "ls-chip", `\uD83D\uDD70️ ${banner.time} · ${banner.date}`), el("span", "ls-chip", `\uD83C\uDF26️ ${banner.weather}`));
    const { deltas, template } = this.ctrl.snapshot;
    for (const [statId, deltaVal] of Object.entries(deltas.statDeltas)) {
      if (deltaVal === 0)
        continue;
      const schema = template.stats.find((s) => s.id === statId);
      if (schema) {
        leftRow.append(el("span", `ls-delta ${deltaVal > 0 ? "is-pos" : "is-neg"}`, `${schema.icon} ${schema.label} ${deltaVal > 0 ? `+${deltaVal} ▲` : `${deltaVal} ▼`}`));
      }
    }
    const showHudWidget = this.ctrl.settings?.vnShowHudWidget !== undefined ? Boolean(this.ctrl.settings.vnShowHudWidget) : this.ctrl.vnShowHudWidget;
    const rightRow = el("div", "ls-row");
    rightRow.append(btn("\uD83C\uDFA8 Studio (Sprites & Locations)", () => openStageAssetStudioModal(this.ctrl, "characters"), "ls-btn-sm ls-btn-primary", "Open Stage Visual Studio: Upload Character Emotion/Clothes/Pose Sprites & Location Time-of-Day Backdrops"), btn(showHudWidget ? "\uD83E\uDE9F Widget: ON" : "\uD83E\uDE9F Widget: OFF", () => {
      const next = !showHudWidget;
      this.ctrl.vnShowHudWidget = next;
      if (this.ctrl.settings)
        this.ctrl.settings.vnShowHudWidget = next;
      this.ctrl.emitChange();
      this.ctrl.request("settings:update", {
        settings: { vnShowHudWidget: next }
      });
    }, `ls-btn-sm ${showHudWidget ? "ls-btn-primary" : ""}`, "Show or hide the Floating HUD Widget over the VN Stage"), btn("\uD83D\uDD0A Voices & TTS", () => openVoiceAssignmentModal(this.ctrl), "ls-btn-sm", "Assign Per-Character & Narrator TTS Voices"), btn("\uD83C\uDFA5 Camera & FX", () => {
      this.directorOpen = !this.directorOpen;
      this.sync();
    }, `ls-btn-sm ${this.directorOpen ? "ls-btn-primary" : ""}`), btn("\uD83D\uDC41️ Hide UI", () => {
      this.uiHidden = true;
      this.sync();
    }, "ls-btn-sm", "Hide UI (Shortcut: H)"), btn("\uD83D\uDEAA Exit Stage", () => this.close(), "ls-btn-sm", "Exit VN Stage (Esc)"));
    this.topHudEl.append(leftRow, rightRow);
    if (this.directorOpen) {
      const settings = this.ctrl.settings;
      const panel = el("div", "ls-card ls-vn-director-popover");
      const head = el("div", "ls-row-between");
      head.append(el("span", "ls-kicker", "\uD83C\uDFA5 2D Camera, Sprites, Weather & Transitions"), btn("✕", () => {
        this.directorOpen = false;
        this.sync();
      }, "ls-btn-sm ls-btn-icon"));
      panel.append(head);
      const castList = Object.values(state.characters);
      if (castList.length > 0) {
        panel.append(el("small", "ls-muted", "Cast 2D Sprites (Click to Upload / Replace):"));
        const spriteRow = el("div", "ls-row");
        for (const c of castList) {
          spriteRow.append(btn(`${c.portraitUrl ? "\uD83D\uDDBC️" : "➕"} ${c.name}`, () => this.ctrl.pickAndUploadImage(c.id, "portrait"), `ls-btn-sm ${c.portraitUrl ? "ls-chip-accent" : ""}`, `Upload 2D Stage Sprite for ${c.name}`));
        }
        panel.append(spriteRow);
      }
      panel.append(el("small", "ls-muted", "Camera Shot Framing:"));
      const shotRow = el("div", "ls-row");
      for (const [sId, sLbl] of [
        ["closeup", "\uD83D\uDD0D Close-Up"],
        ["waist", "\uD83E\uDDCD Waist Shot"],
        ["full", "\uD83D\uDDBC️ Full Body"],
        ["orbit", "\uD83C\uDF00 Slow Orbit"]
      ]) {
        const b = btn(sLbl, () => {
          if (this.ctrl.settings)
            this.ctrl.settings.vnShotMode = sId;
          this.sync();
          this.ctrl.request("settings:update", { settings: { vnShotMode: sId } });
        }, "ls-btn-sm");
        if ((settings?.vnShotMode || "waist") === sId)
          b.setAttribute("aria-current", "page");
        shotRow.append(b);
      }
      panel.append(shotRow);
      panel.append(el("small", "ls-muted", "Weather Particle Overlay:"));
      const weatherRow = el("div", "ls-row");
      for (const [wId, wLbl] of [
        ["", "✨ Auto"],
        ["clear", "☀️ Clear"],
        ["rain", "\uD83C\uDF27️ Rain"],
        ["heavy_rain", "⛈️ Storm"],
        ["snow", "❄️ Snow"],
        ["sakura", "\uD83C\uDF38 Sakura"],
        ["fog", "\uD83C\uDF2B️ Fog"],
        ["fireflies", "✨ Fireflies"],
        ["embers", "\uD83D\uDD25 Embers"]
      ]) {
        const b = btn(wLbl, () => {
          if (this.ctrl.settings)
            this.ctrl.settings.vnWeatherOverride = wId;
          this.sync();
          this.ctrl.request("settings:update", { settings: { vnWeatherOverride: wId } });
        }, "ls-btn-sm");
        if ((settings?.vnWeatherOverride ?? "") === wId)
          b.setAttribute("aria-current", "page");
        weatherRow.append(b);
      }
      panel.append(weatherRow);
      panel.append(el("small", "ls-muted", "Backdrop Transition Style (Click to Preview):"));
      const trRow = el("div", "ls-row");
      for (const [tId, tLbl] of [
        ["cinematic", "\uD83C\uDFAC Cinematic"],
        ["wipe", "➡️ Wipe"],
        ["iris", "⭕ Iris"],
        ["strips", "\uD83C\uDF9E️ Strips"],
        ["black", "⬛ Curtain"],
        ["flash", "⚡ Flash"]
      ]) {
        const b = btn(tLbl, () => {
          if (this.ctrl.settings)
            this.ctrl.settings.vnTransitionStyle = tId;
          this.syncTopHudAndPopovers(state);
          if (this.stageRoot) {
            const currentPlace = state.places[state.currentPlaceId] ?? Object.values(state.places)[0];
            const curBg = currentPlace?.backdropUrl || "";
            this.director.playBackgroundTransition({
              stageRoot: this.stageRoot,
              prevUrl: curBg,
              nextUrl: curBg,
              transition: tId,
              sceneTitle: currentPlace?.name || state.scene.location || state.title,
              timeLabel: state.scene.timeLabel,
              forcePreview: true
            });
          }
          this.ctrl.request("settings:update", { settings: { vnTransitionStyle: tId } });
        }, "ls-btn-sm");
        if ((settings?.vnTransitionStyle || "cinematic") === tId)
          b.setAttribute("aria-current", "page");
        trRow.append(b);
      }
      panel.append(trRow);
      this.popoversEl.append(panel);
    }
    if (this.activeCheckResult) {
      const res = this.activeCheckResult;
      const overlay = el("div", "ls-vn-d20-overlay");
      const card = el("div", "ls-card ls-vn-d20-card");
      card.append(el("span", "ls-kicker", `\uD83C\uDFB2 Lumi Stat Check · ${res.statLabel}`), el("div", "", `${res.roll}`));
      card.lastElementChild.style.cssText = `font-size:40px;font-weight:900;color:${res.passed ? "var(--ls-success)" : "var(--ls-danger)"};`;
      card.append(el("p", "ls-muted", `Stat ${res.statVal} + Roll ${res.roll} vs DC ${res.dc} → ${res.passed ? "SUCCESS" : "COMPLICATION"}`));
      const actRow = el("div", "ls-row");
      actRow.style.justifyContent = "center";
      actRow.append(btn("Insert into Reply ↵", () => {
        const tag = `[\uD83C\uDFB2 ${res.statLabel} Check: ${res.roll} (Stat ${res.statVal}) vs DC ${res.dc} — ${res.passed ? "SUCCESS" : "COMPLICATION"}]`;
        this.activeCheckResult = null;
        this.composerOpen = true;
        this.sync();
        const inp = this.bottomDockEl?.querySelector("[data-ls-vn-reply-input]");
        if (inp) {
          inp.value = `${inp.value ? `${inp.value} ` : ""}${tag}`;
          inp.focus();
        }
      }, "ls-btn-sm ls-btn-primary"), btn("Dismiss", () => {
        this.activeCheckResult = null;
        this.sync();
      }, "ls-btn-sm"));
      card.append(actRow);
      overlay.append(card);
      this.popoversEl.append(overlay);
    }
  }
  syncDialogueDockOnly(turnsArg, currentTurnArg, beatsArg, beatTextArg, speakerInfoArg) {
    if (!this.bottomDockEl)
      return;
    if (this.uiHidden) {
      this.bottomDockEl.replaceChildren();
      return;
    }
    const { state, template } = this.ctrl.snapshot;
    const turns = turnsArg ?? this.getTurnsList();
    const turnIdx = this.activeTurnIndex >= 0 && this.activeTurnIndex < turns.length ? this.activeTurnIndex : turns.length - 1;
    const currentTurn = currentTurnArg ?? turns[turnIdx];
    const beats = beatsArg ?? (this.beatPaginationEnabled ? splitTurnIntoVnBeats(currentTurn.content) : [currentTurn.content]);
    const beatText = beatTextArg ?? beats[this.activeBeatIndex] ?? currentTurn.content;
    const speakerInfo = speakerInfoArg ?? resolveVnBeatSpeaker(beatText, currentTurn.role, state);
    const beatSig = `${this.ctrl.chatId}:${currentTurn.id}:${turnIdx}:${this.activeBeatIndex}:${this.beatPaginationEnabled}:${beatText.length}`;
    const beatChanged = beatSig !== this.lastBeatSig;
    this.lastBeatSig = beatSig;
    const existingInputVal = this.bottomDockEl.querySelector("[data-ls-vn-reply-input]")?.value ?? "";
    this.bottomDockEl.replaceChildren();
    const matchedActor = speakerInfo.matchedActor;
    const innerThought = matchedActor ? resolveCharacterFieldValue(matchedActor, "inner_thought") : "";
    if (matchedActor && innerThought && this.thoughtPeekOpen) {
      const thoughtBar = el("div", "ls-thought-box ls-row-between");
      thoughtBar.style.marginBottom = "8px";
      thoughtBar.append(el("span", "", `\uD83D\uDCAD ${matchedActor.name}'s Inner Monologue: “${innerThought}”`), btn("\uD83D\uDD0A Speak Thought", () => {
        this.ctrl.tts.playSegments([
          {
            kind: "dialogue",
            text: innerThought,
            speakerName: matchedActor.name,
            actorId: matchedActor.id,
            connectionId: matchedActor.ttsVoice?.connectionId,
            voiceId: matchedActor.ttsVoice?.voiceId,
            speed: matchedActor.ttsVoice?.speed || 1
          }
        ], () => this.syncDialogueDockOnly());
      }, "ls-btn-sm"));
      this.bottomDockEl.append(thoughtBar);
    }
    const box = el("div", "ls-vn-dialogue-box");
    box.addEventListener("click", (e) => {
      if (e.target?.closest("button, input, form, select"))
        return;
      const sel = typeof window !== "undefined" ? window.getSelection()?.toString() : "";
      if (sel && sel.length > 0)
        return;
      this.advanceBeatOrTurn();
    });
    const headRow = el("div", "ls-row-between");
    const leftBadges = el("div", "ls-row");
    const speakerBadge = el("span", "ls-vn-speaker-badge", `${currentTurn.role === "user" ? "\uD83E\uDDD1" : speakerInfo.isNarrator ? "\uD83D\uDCD6" : "\uD83C\uDFAD"} ${speakerInfo.speakerName}`);
    speakerBadge.style.background = getSpeakerAccentColor(speakerInfo.speakerName);
    leftBadges.append(speakerBadge);
    if (matchedActor) {
      const dem = resolveCharacterFieldValue(matchedActor, "demeanor");
      if (dem)
        leftBadges.append(el("span", "ls-chip", `\uD83C\uDFAD ${dem}`));
      if (innerThought) {
        leftBadges.append(btn(this.thoughtPeekOpen ? "\uD83D\uDCAD Hide Thought" : "\uD83D\uDCAD Inner Thought", () => {
          this.thoughtPeekOpen = !this.thoughtPeekOpen;
          this.syncDialogueDockOnly();
        }, `ls-btn-sm ${this.thoughtPeekOpen ? "ls-btn-primary" : ""}`));
      }
    }
    if (this.ctrl.tts.isPlaying && this.ctrl.tts.activeSpeakerLabel) {
      leftBadges.append(el("span", "ls-chip ls-chip-accent", `\uD83D\uDD0A Speaking: ${this.ctrl.tts.activeSpeakerLabel}`));
    }
    const counterSpan = el("small", "ls-muted", `Beat ${this.activeBeatIndex + 1}/${beats.length} · Turn ${turnIdx + 1}/${turns.length}`);
    headRow.append(leftBadges, counterSpan);
    box.append(headRow);
    const proseBox = el("div", "ls-vn-prose");
    const proseSpan = el("span");
    proseSpan.setAttribute("data-ls-vn-prose", "true");
    proseBox.append(proseSpan);
    box.append(proseBox);
    if (beatChanged) {
      this.runTypewriter(proseSpan, beatText);
    } else {
      proseSpan.replaceChildren(renderFormattedBeatDom(beatText));
    }
    const controlsBar = el("div", "ls-row-between ls-vn-controls-bar");
    const navCluster = el("div", "ls-row");
    const prevBtn = btn("◀ PREV", () => this.stepBackBeatOrTurn(), "ls-btn-sm");
    prevBtn.disabled = turnIdx === 0 && this.activeBeatIndex === 0;
    const nextBtn = btn("NEXT ▶", () => this.advanceBeatOrTurn(), "ls-btn-sm ls-btn-primary");
    nextBtn.disabled = turnIdx + 1 >= turns.length && this.activeBeatIndex + 1 >= beats.length;
    const modeBtn = btn(this.beatPaginationEnabled ? `\uD83D\uDCD6 VN (${this.activeBeatIndex + 1}/${beats.length})` : "\uD83D\uDCDC Full Turn", () => {
      this.beatPaginationEnabled = !this.beatPaginationEnabled;
      this.activeBeatIndex = 0;
      this.sync();
    }, `ls-btn-sm ${this.beatPaginationEnabled ? "ls-btn-primary" : ""}`);
    const backlogBtn = btn("\uD83D\uDCDC Backlog", () => {
      this.ctrl.modals.open({ title: `\uD83D\uDCDC Scene Transcript & Turn Backlog (${turns.length})`, width: 620, maxHeight: 700 }, (mBody, close) => {
        const stack = el("div", "ls-stack");
        turns.forEach((t, idx) => {
          const sp = resolveVnBeatSpeaker(t.content, t.role, state);
          const row = el("div", "ls-stat-cell");
          row.style.cursor = "pointer";
          if (idx === turnIdx)
            row.style.borderColor = "var(--ls-primary)";
          const rTop = el("div", "ls-row-between");
          rTop.append(el("strong", "", `${t.role === "user" ? "\uD83E\uDDD1" : "\uD83C\uDFAD"} ${sp.speakerName}`), el("span", "ls-chip", `Turn #${idx + 1}${idx === turnIdx ? " · Active" : ""}`));
          row.append(rTop, el("p", "ls-muted", t.content.slice(0, 260) + (t.content.length > 260 ? "…" : "")));
          row.addEventListener("click", () => {
            this.activeTurnIndex = idx;
            this.activeBeatIndex = 0;
            close();
            this.sync();
          });
          stack.append(row);
        });
        mBody.append(stack);
      });
    }, "ls-btn-sm");
    const autoBtn = btn("▶ Auto", () => {
      this.isAutoPlay = !this.isAutoPlay;
      if (!this.isAutoPlay && this.autoPlayTimer) {
        clearTimeout(this.autoPlayTimer);
        this.autoPlayTimer = null;
      }
      this.sync();
    }, `ls-btn-sm ${this.isAutoPlay ? "ls-btn-primary" : ""}`);
    const skipBtn = btn(this.ctrl.tts.isPlaying ? "⏭️ Skip Voice" : "⏭️ Skip", () => {
      if (this.ctrl.tts.isPlaying) {
        this.ctrl.tts.stop();
        this.syncDialogueDockOnly();
      } else {
        this.advanceBeatOrTurn();
      }
    }, `ls-btn-sm ${this.ctrl.tts.isPlaying ? "ls-btn-primary" : ""}`, this.ctrl.tts.isPlaying ? "Skip current TTS voice playback" : "Skip to next beat");
    const replayVoiceBtn = btn("↺", () => this.speakCurrentBeat(false), "ls-btn-sm ls-btn-icon", "Replay voice for current beat");
    const isAutoTtsEnabled = this.ctrl.settings?.ttsAutoPlayInStage !== false;
    const autoVoiceToggle = btn(isAutoTtsEnabled ? "\uD83D\uDD0A Auto-TTS: ON" : "\uD83D\uDD08 Auto-TTS: OFF", () => {
      const nextVal = !isAutoTtsEnabled;
      if (this.ctrl.settings)
        this.ctrl.settings.ttsAutoPlayInStage = nextVal;
      if (!nextVal) {
        this.ctrl.tts.stop();
      } else {
        this.lastAutoSpokenBeatSig = "";
      }
      this.sync();
      this.ctrl.request("settings:update", {
        settings: { ttsAutoPlayInStage: nextVal }
      });
    }, `ls-btn-sm ${isAutoTtsEnabled ? "ls-btn-primary" : ""}`, "Automatically speak each beat as you advance or open the stage");
    const checkBtn = btn("\uD83C\uDFB2 Stat Check", () => {
      const charMeters = template.stats.filter((s) => s.enabled && s.scope === "character" && s.kind === "meter");
      const playerMeters = template.stats.filter((s) => s.enabled && s.scope === "player" && s.kind === "meter");
      const pickedSchema = matchedActor && charMeters[0] || playerMeters[0] || template.stats[0];
      const rawVal = (matchedActor && pickedSchema ? matchedActor.meters[pickedSchema.id]?.value : undefined) ?? (pickedSchema ? state.stats[pickedSchema.id]?.value : undefined) ?? 50;
      const statVal = typeof rawVal === "number" ? rawVal : 50;
      let d20 = 10;
      if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
        const arr = new Uint32Array(1);
        crypto.getRandomValues(arr);
        d20 = arr[0] % 20 + 1;
      } else {
        d20 = Math.floor(Math.random() * 20) + 1;
      }
      const bonus = Math.round((statVal - 50) / 10);
      const total = Math.max(1, d20 + bonus);
      const dc = 12;
      this.activeCheckResult = {
        statLabel: pickedSchema ? `${pickedSchema.icon} ${pickedSchema.label}` : "Composure",
        statVal,
        roll: total,
        dc,
        passed: total >= dc
      };
      this.syncTopHudAndPopovers(state);
    }, "ls-btn-sm");
    navCluster.append(prevBtn, nextBtn, skipBtn, replayVoiceBtn, modeBtn, backlogBtn, autoBtn, autoVoiceToggle, checkBtn);
    const rightCluster = el("div", "ls-row");
    if (this.ctrl.ctx.stt && (this.ctrl.ctx.host?.capabilities?.["speech-to-text-v1"] ?? 0) >= 1) {
      rightCluster.append(btn(this.isRecordingStt ? "\uD83C\uDF99️ Listening…" : "\uD83C\uDF99️ Mic", () => this.toggleSttDictation(), `ls-btn-sm ${this.isRecordingStt ? "ls-btn-primary" : ""}`));
    }
    rightCluster.append(btn(this.composerOpen ? "✍️ Hide Reply" : "✍️ Reply", () => {
      this.composerOpen = !this.composerOpen;
      this.syncDialogueDockOnly();
    }, `ls-btn-sm ${this.composerOpen ? "ls-btn-primary" : ""}`));
    controlsBar.append(navCluster, rightCluster);
    box.append(controlsBar);
    if (this.composerOpen) {
      const form = el("form", "ls-row ls-vn-reply-form");
      const inp = el("input", "ls-input");
      inp.setAttribute("data-ls-vn-reply-input", "true");
      inp.style.flex = "1";
      inp.placeholder = "Write your dialogue or action and press Enter…";
      inp.value = existingInputVal;
      const sendBtn = btn("Send Reply ↵", () => {
        return;
      }, "ls-btn-primary");
      sendBtn.type = "submit";
      form.append(inp, sendBtn);
      form.addEventListener("submit", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const text = inp.value.trim();
        if (!text)
          return;
        inp.value = "";
        this.composerOpen = false;
        this.ctrl.notify("⏳ Sending reply & generating next scene beat…");
        this.ctrl.request("vn:sendReply", { text });
      });
      box.append(form);
    }
    this.bottomDockEl.append(box);
  }
  toggleSttDictation() {
    const stt = this.ctrl.ctx.stt;
    if (!stt)
      return;
    if (this.isRecordingStt && this.sttSession) {
      this.sttSession.stop().catch(() => {
        return;
      });
      return;
    }
    try {
      this.isRecordingStt = true;
      this.composerOpen = true;
      this.syncDialogueDockOnly();
      const session = stt.start({ continuous: true, interimResults: true });
      this.sttSession = session;
      session.result.then(({ text }) => {
        this.isRecordingStt = false;
        this.sttSession = null;
        this.syncDialogueDockOnly();
        const inp = this.bottomDockEl?.querySelector("[data-ls-vn-reply-input]");
        if (inp && text?.trim()) {
          inp.value = `${inp.value ? `${inp.value} ` : ""}${text.trim()}`;
          inp.focus();
        }
      }).catch(() => {
        this.isRecordingStt = false;
        this.sttSession = null;
        this.syncDialogueDockOnly();
      });
    } catch {
      this.isRecordingStt = false;
      this.syncDialogueDockOnly();
    }
  }
  destroy() {
    this.stageHudScope.clear();
    this.close();
    this.portalMount?.destroy();
    this.portalMount = null;
  }
}

// src/frontend/surfaces/CastDossier.ts
function openDossierFieldModal(ctrl, existing) {
  const tpl = structuredClone(ctrl.snapshot.template);
  const sortedDos = [...tpl.surfaces.dossierTabs].sort((a, b) => a.order - b.order);
  ctrl.modals.open({
    title: existing ? `✏️ Edit Character Dossier Field: ${existing.label}` : "➕ Create Character Dossier Field",
    width: 580
  }, (body, close, _handle, modalScope) => {
    const topGrid = el("div", "ls-grid");
    const iconWrap = el("label", "ls-label", "Field Icon");
    const iconInp = el("input", "ls-input");
    iconInp.value = existing?.icon ?? "✨";
    iconWrap.append(iconInp);
    const labelWrap = el("label", "ls-label", "Field Label");
    const labelInp = el("input", "ls-input");
    labelInp.placeholder = "e.g. Immediate Goal, Inner Monologue, Secret Agenda…";
    labelInp.value = existing?.label ?? "";
    labelWrap.append(labelInp);
    topGrid.append(iconWrap, labelWrap);
    body.append(topGrid);
    let selectedTabId = existing?.tabId ?? (sortedDos[0]?.id || "overview");
    let selectedStyle = existing?.displayStyle ?? "card";
    const styleGrid = el("div", "ls-grid");
    const tabWrap = el("div", "ls-label", "\uD83E\uDEAA Target Dossier Tab");
    const tabSlot = el("div");
    tabWrap.append(tabSlot);
    const styleWrap = el("div", "ls-label", "\uD83C\uDFA8 Visual Display Style");
    const styleSlot = el("div");
    styleWrap.append(styleSlot);
    styleGrid.append(tabWrap, styleWrap);
    body.append(styleGrid);
    mountThemedSelect(ctrl, modalScope, tabSlot, {
      value: selectedTabId,
      ariaLabel: "Target Dossier Tab",
      options: sortedDos.map((dt) => ({ value: dt.id, label: `${dt.icon} ${dt.label}` })),
      onChange: (v) => {
        selectedTabId = v;
      }
    });
    mountThemedSelect(ctrl, modalScope, styleSlot, {
      value: selectedStyle,
      ariaLabel: "Visual Display Style",
      options: [
        { value: "card", label: '\uD83D\uDDC2️ Info Card (supports structured "->" chains)' },
        { value: "quote", label: "\uD83D\uDCAD Quote / Inner Monologue Box" },
        { value: "pills", label: "\uD83C\uDFF7️ Tag / Item Pills (comma-separated)" },
        { value: "badge", label: "\uD83E\uDEAA Portrait Header Badge" }
      ],
      onChange: (v) => {
        selectedStyle = v;
      }
    });
    let selectedSpan = existing?.layoutSpan ?? "auto";
    let selectedColor = existing?.color || "var(--lumiverse-primary)";
    let enabled = existing?.enabled ?? true;
    let showInHudCast = existing?.showInHudCast ?? false;
    let showInInlineCast = existing?.showInInlineCast ?? false;
    let locked = existing?.locked ?? false;
    const spanWrap = el("div", "ls-label", "Card Grid Width");
    const spanSlot = el("div");
    spanWrap.append(spanSlot);
    body.append(spanWrap);
    mountThemedSelect(ctrl, modalScope, spanSlot, {
      value: selectedSpan,
      ariaLabel: "Card Grid Width",
      options: [
        { value: "auto", label: "\uD83D\uDCD0 Auto" },
        { value: "full", label: "↔️ Full Width" },
        { value: "half", label: "▫ Compact Column" }
      ],
      onChange: (v) => {
        selectedSpan = v;
      }
    });
    const colorWrap = el("div", "ls-label", "Accent Color");
    const colorRow = el("div", "ls-row");
    const syncSwatches = () => {
      for (const b of [...colorRow.querySelectorAll(".ls-color-swatch")]) {
        b.setAttribute("aria-pressed", String(b.dataset.colorVal === selectedColor));
      }
    };
    for (const [val, lbl, preview] of [
      ["var(--lumiverse-primary)", "Theme Primary", "var(--lumiverse-primary, #38bdf8)"],
      ["#38bdf8", "Sky", "#38bdf8"],
      ["#f472b6", "Rose", "#f472b6"],
      ["#f59e0b", "Amber", "#f59e0b"],
      ["#10b981", "Emerald", "#10b981"],
      ["#a78bfa", "Violet", "#a78bfa"]
    ]) {
      const b = btn("", () => {
        selectedColor = val;
        syncSwatches();
      }, "ls-color-swatch", lbl);
      b.dataset.colorVal = val;
      b.style.background = preview;
      colorRow.append(b);
    }
    syncSwatches();
    colorWrap.append(colorRow);
    body.append(colorWrap);
    const instWrap = el("div", "ls-label");
    const instHead = el("div", "ls-row-between");
    const instInp = el("textarea", "ls-input");
    instInp.rows = 3;
    instInp.placeholder = "Tell the AI when and how to update this field for each character…";
    instInp.value = existing?.instruction ?? "";
    instHead.append(el("span", "", "AI Extraction Prompt Instruction"), btn("⛶ Full-Screen Editor", () => {
      ctrl.request("textEditor:open", {
        title: `Character Field Prompt: ${labelInp.value || "Field"}`,
        value: instInp.value,
        placeholder: "Describe how the AI should update this character field…"
      }).then((res) => {
        if (!res.cancelled && typeof res.text === "string") {
          instInp.value = res.text;
        }
      });
    }, "ls-btn-sm"));
    instWrap.append(instHead, instInp);
    body.append(instWrap);
    const flagsGrid = el("div", "ls-grid");
    for (const [lbl, initVal, setter] of [
      ["Enabled", enabled, (v) => {
        enabled = v;
      }],
      ["Show on HUD Cast Card", showInHudCast, (v) => {
        showInHudCast = v;
      }],
      ["Show on Inline Cast Card", showInInlineCast, (v) => {
        showInInlineCast = v;
      }],
      ["Lock Value", locked, (v) => {
        locked = v;
      }]
    ]) {
      const slot = el("div");
      mountNativeCheckbox(ctrl, modalScope, slot, {
        checked: initVal,
        label: lbl,
        onChange: setter
      });
      flagsGrid.append(slot);
    }
    body.append(flagsGrid);
    const btnRow = el("div", "ls-row-between");
    btnRow.style.marginTop = "12px";
    const leftBtns = el("div", "ls-row");
    if (existing) {
      leftBtns.append(btn("Delete Field", () => {
        const liveFields = structuredClone(ctrl.snapshot.template.dossierFields);
        ctrl.request("state:mutate", {
          templatePatch: {
            dossierFields: liveFields.filter((f) => f.id !== existing.id)
          },
          reason: `Deleted dossier field "${existing.label}"`
        });
        close();
      }, "ls-btn-sm ls-btn-danger"));
    }
    const saveBtn = btn(existing ? "Save Field" : "Add Field", () => {
      const label = labelInp.value.trim();
      if (!label)
        return;
      const liveFields = structuredClone(ctrl.snapshot.template.dossierFields);
      const updated = {
        id: existing?.id ?? slugifyKey(label, "field"),
        label,
        icon: iconInp.value.trim() || "✨",
        placeholder: existing?.placeholder || label,
        instruction: instInp.value.trim() || `Update ${label} when established in the scene.`,
        tabId: selectedTabId,
        displayStyle: selectedStyle,
        showInHudCast,
        showInInlineCast,
        color: selectedColor,
        layoutSpan: selectedSpan,
        enabled,
        locked
      };
      const idx = liveFields.findIndex((f) => f.id === updated.id);
      if (idx >= 0)
        liveFields[idx] = updated;
      else
        liveFields.push(updated);
      ctrl.request("state:mutate", {
        templatePatch: { dossierFields: liveFields },
        reason: `Saved dossier field "${updated.label}"`
      });
      close();
    }, "ls-btn-primary");
    btnRow.append(leftBtns, saveBtn);
    body.append(btnRow);
  });
}
function openAuditLogModal(ctrl, actorId) {
  const { state } = ctrl.snapshot;
  const entries = [...state.auditLog].filter((a) => !actorId || a.actorId === actorId).reverse();
  ctrl.modals.open({ title: `\uD83D\uDCC8 Stat Calibration & Shift Audit Log (${entries.length})`, width: 640, maxHeight: 740 }, (body, close) => {
    if (!entries.length) {
      body.append(el("p", "ls-muted", "No stat calibrations or shifts recorded yet."));
      return;
    }
    const list = el("div", "ls-stack");
    for (const item of entries) {
      const card = el("div", "ls-stat-cell");
      const top = el("div", "ls-row-between");
      const left = el("div", "ls-row");
      const actorName = item.actorId ? state.characters[item.actorId]?.name : undefined;
      left.append(el("strong", "", `${actorName ? `${actorName} · ` : ""}${item.statLabel}`), el("span", "ls-chip", item.op === "set" ? "\uD83C\uDFAF Calibrated / Set" : "Δ Shift"), el("span", "ls-chip ls-chip-accent", `${String(item.before ?? "uncalibrated")} → ${String(item.after)}`));
      const right = el("div", "ls-row");
      right.append(el("small", "ls-muted", `Turn ${item.turn} · ${formatDayAndClock(item.minute)}`));
      if (item.before !== null) {
        right.append(btn(`↺ Revert to ${String(item.before)}`, () => {
          if (item.actorId) {
            const actor = state.characters[item.actorId];
            if (actor) {
              ctrl.request("state:mutate", {
                patch: {
                  characters: [
                    {
                      id: actor.id,
                      name: actor.name,
                      meters: {
                        [item.statId]: { op: "set", value: item.before, reason: "Reverted from audit log" }
                      }
                    }
                  ]
                },
                reason: `Reverted ${actor.name} ${item.statLabel} to ${String(item.before)}`
              });
            }
          } else {
            ctrl.request("state:mutate", {
              patch: {
                stats: {
                  [item.statId]: { op: "set", value: item.before, reason: "Reverted from audit log" }
                }
              },
              reason: `Reverted ${item.statLabel} to ${String(item.before)}`
            });
          }
          close();
        }, "ls-btn-sm"));
      }
      top.append(left, right);
      card.append(top);
      if (item.reason) {
        card.append(el("small", "ls-muted", `Evidence: ${item.reason}`));
      }
      list.append(card);
    }
    body.append(list);
  });
}
function openCharacterDossierModal(ctrl, actorId) {
  ctrl.selectedActorId = actorId;
  ctrl.modals.open({ title: "\uD83E\uDEAA Character Dossier", width: 880, maxHeight: 820 }, (body, _close, handle, modalScope) => {
    const redraw = () => {
      modalScope.clear();
      const actor = ctrl.snapshot.state.characters[ctrl.selectedActorId] ?? Object.values(ctrl.snapshot.state.characters)[0];
      if (actor)
        handle.setTitle(`\uD83E\uDEAA ${actor.name} — Character Dossier`);
      body.replaceChildren(renderCastDossierSurface(ctrl, modalScope));
    };
    redraw();
    const unsub = ctrl.subscribe(redraw);
    handle.onDismiss(unsub);
  });
}
function renderCastDossierSurface(ctrl, compScope) {
  const { state, template, deltas } = ctrl.snapshot;
  const wrap = el("div", "ls-stack");
  const actors = Object.values(state.characters).sort((a, b) => Number(b.present) - Number(a.present));
  const activeActor = (ctrl.selectedActorId ? state.characters[ctrl.selectedActorId] : undefined) ?? actors[0];
  const rosterBar = el("div", "ls-row-between");
  const pills = el("div", "ls-row");
  for (const peer of actors) {
    const b = btn(`${peer.present ? "\uD83D\uDFE2" : "⚪"} ${peer.name}`, () => {
      ctrl.selectedActorId = peer.id;
      ctrl.emitChange();
    }, "ls-btn-sm");
    if (peer.id === activeActor?.id)
      b.setAttribute("aria-current", "page");
    pills.append(b);
  }
  const actions = el("div", "ls-row");
  if (activeActor) {
    actions.append(btn(ctrl.dossierEditMode ? "✓ Done Editing" : "✏️ Edit Values", () => {
      ctrl.dossierEditMode = !ctrl.dossierEditMode;
      ctrl.emitChange();
    }, `ls-btn-sm ${ctrl.dossierEditMode ? "ls-btn-primary" : ""}`), btn(activeActor.ttsVoice?.voiceId ? `\uD83D\uDD0A Voice (${activeActor.ttsVoice.voiceId})` : "\uD83D\uDD0A Voice", () => openVoiceAssignmentModal(ctrl, activeActor.id), "ls-btn-sm", `Assign TTS Voice for ${activeActor.name}`), btn("+ Stat", () => openStatSchemaModal(ctrl, "character"), "ls-btn-sm", "Add a character stat or meter"), btn("+ Field", () => openDossierFieldModal(ctrl), "ls-btn-sm", "Add a custom field to character dossiers"), btn("\uD83D\uDCC8 Audit Log", () => openAuditLogModal(ctrl, activeActor.id), "ls-btn-sm"));
  }
  actions.append(btn("+ Add Character", () => {
    ctrl.modals.open({ title: "➕ Add Character to Cast", width: 460 }, (mBody, close) => {
      const nameWrap = el("label", "ls-label", "Character Name");
      const nameInp = el("input", "ls-input");
      nameWrap.append(nameInp);
      const roleWrap = el("label", "ls-label", "Role & Relationship to Player");
      const roleInp = el("input", "ls-input");
      roleInp.placeholder = "e.g. Loyal personal maid, Childhood rival…";
      roleWrap.append(roleInp);
      const attireWrap = el("label", "ls-label", "Starting Attire");
      const attireInp = el("input", "ls-input");
      attireWrap.append(attireInp);
      const saveBtn = btn("➕ Create Character", () => {
        const name = nameInp.value.trim();
        if (!name)
          return;
        const id = slugifyKey(name, "npc");
        ctrl.selectedActorId = id;
        ctrl.request("state:mutate", {
          patch: {
            characters: [
              {
                id,
                name,
                present: true,
                roleSummary: roleInp.value.trim() || "Character",
                attire: attireInp.value.trim()
              }
            ]
          },
          reason: `Added character "${name}"`
        });
        close();
      }, "ls-btn-primary");
      mBody.append(nameWrap, roleWrap, attireWrap, saveBtn);
    });
  }, "ls-btn-sm ls-btn-primary"));
  rosterBar.append(pills, actions);
  wrap.append(rosterBar);
  if (!activeActor) {
    const empty = el("div", "ls-card");
    empty.append(el("strong", "", "No characters in cast yet"), el("p", "ls-muted", 'Characters are calibrated automatically on Turn 1, or click "+ Add Character" above.'));
    wrap.append(empty);
    return wrap;
  }
  if (template.surfaces.customDossierHtml) {
    const customBanner = el("div", "ls-card");
    wrap.append(customBanner);
    mountSanitizedHtml(customBanner, interpolateBannerTemplate(template.surfaces.customDossierHtml, state), ctrl.ctx);
  }
  const demeanorVal = resolveCharacterFieldValue(activeActor, "demeanor");
  const roleVal = resolveCharacterFieldValue(activeActor, "role_summary");
  const emotionKey = (demeanorVal || "neutral").toLowerCase();
  const exprUrl = activeActor.expressionAssets[emotionKey]?.url ?? activeActor.portraitUrl;
  const showFullRail = Boolean(exprUrl || ctrl.dossierEditMode);
  const shell = el("article", "ls-dossier-shell");
  if (!showFullRail) {
    shell.dataset.noPortrait = "true";
  }
  const statusChips = el("div", "ls-row");
  statusChips.append(btn(activeActor.present ? "\uD83D\uDFE2 In Scene" : "⚪ Away", () => {
    ctrl.request("state:mutate", {
      patch: {
        characters: [
          {
            id: activeActor.id,
            name: activeActor.name,
            present: !activeActor.present,
            ...!activeActor.present && state.scene.location ? { location: state.scene.location } : {}
          }
        ]
      },
      reason: `Marked ${activeActor.name} as ${!activeActor.present ? "In Scene" : "Away"}`
    });
  }, `ls-btn-sm ls-presence-pill ${activeActor.present ? "ls-chip-accent" : ""}`, "Click to toggle In Scene / Away"));
  for (const bf of template.dossierFields.filter((f) => f.enabled && f.displayStyle === "badge" && f.id !== "role_summary")) {
    const bVal = resolveCharacterFieldValue(activeActor, bf.id);
    if (bVal) {
      statusChips.append(el("span", "ls-chip", `${bf.icon} ${bVal}`));
    }
  }
  if (showFullRail) {
    const rail = el("aside", "ls-dossier-rail");
    const portraitBox = el("div", "ls-dossier-portrait");
    if (exprUrl) {
      const img = el("img");
      img.src = exprUrl;
      img.alt = activeActor.name;
      portraitBox.append(img);
    } else {
      portraitBox.append(el("span", "ls-dossier-initial", activeActor.name[0]?.toUpperCase() ?? "?"));
    }
    rail.append(portraitBox);
    const overlay = el("div", "ls-dossier-overlay");
    overlay.append(statusChips, el("h2", "", activeActor.name));
    if (isDossierFieldEnabled(template, "role_summary") && roleVal) {
      overlay.append(el("div", "ls-muted", roleVal));
    }
    if (ctrl.dossierEditMode) {
      const railBtns = el("div", "ls-row");
      railBtns.append(btn("\uD83D\uDDBC️ Portrait", () => ctrl.pickAndUploadImage(activeActor.id, "portrait"), "ls-btn-sm ls-btn-primary"), btn(`\uD83C\uDFAD Expression (${emotionKey})`, () => ctrl.pickAndUploadImage(activeActor.id, "expression", emotionKey), "ls-btn-sm", `Upload expression sprite for "${emotionKey}" demeanor`), btn(activeActor.present ? "Mark Off-Screen" : "Mark Present", () => {
        ctrl.request("state:mutate", {
          patch: {
            characters: [{ id: activeActor.id, name: activeActor.name, present: !activeActor.present }]
          },
          reason: `Toggled presence for ${activeActor.name}`
        });
      }, "ls-btn-sm"));
      overlay.append(railBtns);
    }
    rail.append(overlay);
    shell.append(rail);
  }
  const main = el("div", "ls-dossier-main");
  if (!showFullRail) {
    const heroHeader = el("header", "ls-dossier-compact-hero");
    const leftIdentity = el("div", "ls-row");
    const monogram = el("div", "ls-dossier-monogram", activeActor.name.slice(0, 2).toUpperCase());
    const titleStack = el("div");
    titleStack.append(el("h2", "", activeActor.name));
    if (isDossierFieldEnabled(template, "role_summary") && roleVal) {
      titleStack.append(el("div", "ls-muted", roleVal));
    }
    leftIdentity.append(monogram, titleStack);
    const rightMeta = el("div", "ls-row");
    rightMeta.append(statusChips, btn("\uD83D\uDDBC️ + Portrait", () => ctrl.pickAndUploadImage(activeActor.id, "portrait"), "ls-btn-sm", `Upload portrait for ${activeActor.name}`));
    heroHeader.append(leftIdentity, rightMeta);
    main.append(heroHeader);
  }
  const enabledDosTabs = [...template.surfaces.dossierTabs].filter((t) => t.enabled).sort((a, b) => a.order - b.order);
  const currentTab = enabledDosTabs.find((t) => t.id === ctrl.activeDossierTab) ?? enabledDosTabs[0] ?? {
    id: "overview",
    label: "Overview",
    icon: "✨",
    kind: "overview",
    enabled: true,
    order: 0,
    showMeters: true,
    showFields: true,
    showSecrets: false,
    showAudit: false
  };
  if (enabledDosTabs.length > 1) {
    const tabStrip = el("div", "ls-subnav-pills");
    for (const dt of enabledDosTabs) {
      const b = btn(`${dt.icon} ${dt.label}`, () => {
        ctrl.activeDossierTab = dt.id;
        ctrl.emitChange();
      }, "ls-btn-sm");
      if (dt.id === currentTab.id)
        b.setAttribute("aria-current", "page");
      tabStrip.append(b);
    }
    main.append(tabStrip);
  }
  if (currentTab.customHtml) {
    const customBox = el("div", "ls-card");
    main.append(customBox);
    mountSanitizedHtml(customBox, interpolateBannerTemplate(currentTab.customHtml, state), ctrl.ctx);
  }
  const enabledDosTabIds = new Set(enabledDosTabs.map((t) => t.id));
  const fallbackDosTabId = enabledDosTabs[0]?.id ?? "overview";
  if (currentTab.showFields) {
    const tabFields = template.dossierFields.filter((f) => {
      if (!f.enabled || f.id === "role_summary" || f.displayStyle === "badge")
        return false;
      const targetTab = f.tabId && enabledDosTabIds.has(f.tabId) ? f.tabId : fallbackDosTabId;
      return targetTab === currentTab.id;
    });
    if (!ctrl.dossierEditMode) {
      for (const qf of tabFields.filter((f) => f.displayStyle === "quote")) {
        const val = resolveCharacterFieldValue(activeActor, qf.id);
        if (!val)
          continue;
        const quoteRow = el("div", "ls-thought-box ls-row-between");
        quoteRow.append(el("span", "", `${qf.icon} “${val}”`), btn("✏️", () => openDossierFieldModal(ctrl, qf), "ls-btn-sm ls-btn-icon", `Customize "${qf.label}" field`));
        main.append(quoteRow);
      }
      if (currentTab.kind === "overview" && template.coreTrackers?.trackNpcConditions !== false && activeActor.conditions.length > 0) {
        const condRow = el("div", "ls-row");
        for (const c of activeActor.conditions) {
          const pill = el("span", "ls-rpg-fx-pill", `⚡ ${c}`);
          pill.dataset.fxKind = "neutral";
          condRow.append(pill);
        }
        main.append(condRow);
      }
      const cardFields = tabFields.filter((f) => f.displayStyle !== "quote");
      const infoGrid = el("div", "ls-grid");
      for (const f of cardFields) {
        const val = resolveCharacterFieldValue(activeActor, f.id);
        if (!val)
          continue;
        const cell = el("div", "ls-stat-cell");
        if (f.color)
          cell.style.setProperty("--ls-bar-color", f.color);
        if (f.layoutSpan && f.layoutSpan !== "auto")
          cell.dataset.span = f.layoutSpan;
        const headRow = el("div", "ls-row-between");
        headRow.append(el("span", "ls-kicker", `${f.icon} ${f.label}`), btn("✏️", () => openDossierFieldModal(ctrl, f), "ls-btn-sm ls-btn-icon", `Customize "${f.label}" field`));
        cell.append(headRow, renderStructuredTextStatBody(val, f.displayStyle === "pills" ? "pill_list" : "auto"));
        infoGrid.append(cell);
      }
      if (infoGrid.childElementCount > 0)
        main.append(infoGrid);
    } else {
      const editCard = el("div", "ls-card");
      const editHead = el("div", "ls-row-between");
      editHead.append(el("h3", "", `✏️ Edit ${activeActor.name}'s Dossier Fields`), btn("↺ Restore Default Fields", () => {
        ctrl.request("state:mutate", {
          templatePatch: { dossierFields: defaultDossierFields() },
          reason: "Restored default dossier fields"
        });
      }, "ls-btn-sm"));
      editCard.append(editHead);
      const editGrid = el("div", "ls-grid");
      const fieldInputs = new Map;
      for (const f of template.dossierFields.filter((df) => df.enabled)) {
        const wrap = el("div", "ls-label");
        const labelRow = el("div", "ls-row-between");
        labelRow.append(el("span", "", `${f.icon} ${f.label}`), btn("⚙️ Schema", () => openDossierFieldModal(ctrl, f), "ls-btn-sm", `Edit "${f.label}" schema or delete`));
        const inp = f.displayStyle === "quote" ? el("textarea", "ls-input") : el("input", "ls-input");
        if (inp instanceof HTMLTextAreaElement)
          inp.rows = 2;
        inp.value = resolveCharacterFieldValue(activeActor, f.id);
        inp.placeholder = f.placeholder || f.label;
        wrap.append(labelRow, inp);
        editGrid.append(wrap);
        fieldInputs.set(f.id, inp);
      }
      const condWrap = el("label", "ls-label", "⚡ Active Conditions (comma-separated)");
      const condInp = el("input", "ls-input");
      condInp.value = activeActor.conditions.join(", ");
      condInp.placeholder = "e.g. Flustered, Holding Tray, Guarded…";
      condWrap.append(condInp);
      const notesWrap = el("label", "ls-label", "\uD83D\uDCDD Personal Character Notes");
      const notesInp = el("textarea", "ls-input");
      notesInp.rows = 2;
      notesInp.value = activeActor.notes || "";
      notesInp.placeholder = "Optional notes about this character…";
      notesWrap.append(notesInp);
      editCard.append(editGrid, condWrap, notesWrap);
      editCard.append(btn("\uD83D\uDCBE Save Character Details", () => {
        const fields = { ...activeActor.fields };
        for (const [k, inp] of fieldInputs.entries()) {
          fields[k] = inp.value.trim();
        }
        const nextConditions = condInp.value.split(",").map((s) => s.trim()).filter(Boolean);
        ctrl.request("state:mutate", {
          patch: {
            characters: [
              {
                id: activeActor.id,
                name: activeActor.name,
                roleSummary: fields.role_summary ?? activeActor.roleSummary,
                demeanor: fields.demeanor ?? activeActor.demeanor,
                attire: fields.attire_layers ?? activeActor.attire,
                immediateGoal: fields.immediate_goal ?? activeActor.immediateGoal,
                innerThought: fields.inner_thought ?? activeActor.innerThought,
                conditions: nextConditions,
                notes: notesInp.value.trim(),
                fields
              }
            ]
          },
          reason: `Updated dossier details for ${activeActor.name}`
        });
      }, "ls-btn-primary"));
      main.append(editCard);
    }
  }
  if (currentTab.showMeters) {
    const charSchemas = template.stats.filter((s) => {
      if (!s.enabled || s.scope !== "character" || s.showIn?.dossier === false)
        return false;
      const assigned = s.dossierTabId || "bonds";
      const targetTab = enabledDosTabIds.has(assigned) ? assigned : fallbackDosTabId;
      return targetTab === currentTab.id;
    });
    if (charSchemas.length > 0) {
      const metersGrid = el("div", "ls-stat-grid");
      const charDeltas = deltas.characterDeltas[activeActor.id] ?? {};
      const mutateCharMeter = (statId, statLabel, value) => {
        ctrl.request("state:mutate", {
          patch: {
            characters: [
              {
                id: activeActor.id,
                name: activeActor.name,
                meters: {
                  [statId]: { op: "set", value, reason: "Manual Dossier adjustment" }
                }
              }
            ]
          },
          reason: `Set ${activeActor.name} ${statLabel} to ${String(value)}`
        });
      };
      for (const schema of charSchemas) {
        const entry = activeActor.meters[schema.id];
        const isCalibrated = Boolean(entry?.calibrated);
        const val = isCalibrated && entry ? entry.value : schema.defaultValue;
        const isLocked = Boolean(schema.locked || entry?.locked);
        const delta = charDeltas[schema.id] ?? 0;
        const strVal = String(val ?? "");
        const isLongText = isCalibrated && typeof val === "string" && (schema.displayStyle === "feed_cards" || schema.displayStyle === "step_chain" || schema.displayStyle === "pill_list" || schema.displayStyle === "quote_callout" || strVal.length > 36 || /->|→|\n|;/.test(strVal));
        const cell = el("div", "ls-stat-cell");
        cell.style.setProperty("--ls-bar-color", schema.color || "var(--ls-primary)");
        cell.dataset.locked = String(isLocked);
        cell.dataset.uncalibrated = String(!isCalibrated);
        cell.dataset.span = schema.layoutSpan === "full" || schema.layoutSpan !== "half" && isLongText ? "full" : "half";
        if (entry?.lastReason) {
          cell.title = `Evidence: ${entry.lastReason}`;
        }
        const top = el("div", "ls-row-between");
        top.append(el("strong", "", `${schema.icon} ${schema.label}`));
        const right = el("div", "ls-row");
        if (delta !== 0) {
          right.append(el("span", `ls-delta ${delta > 0 ? "is-pos" : "is-neg"}`, `${delta > 0 ? `+${delta} ▲` : `${delta} ▼`}`));
        }
        const valText = !isCalibrated ? "Uncalibrated" : schema.kind === "clock" || schema.kind === "pips" ? `${Number(val) || 0}/${schema.max}` : isLongText ? `${parseStructuredStatText(strVal).length} entries` : strVal;
        const valBadge = el("strong", "", valText);
        right.append(valBadge, btn("✏️", () => openStatSchemaModal(ctrl, "character", schema), "ls-btn-sm ls-btn-icon", "Edit stat schema"));
        top.append(right);
        cell.append(top);
        if (isCalibrated && typeof val === "number") {
          const anchorLbl = resolveAnchorLabel(schema.anchors, val);
          if (anchorLbl) {
            cell.append(el("small", "ls-muted", anchorLbl));
          }
        } else if (!isCalibrated) {
          cell.append(el("small", "ls-muted", `Volatility: ${schema.volatility} · Calibrates on sync`));
        }
        if (entry?.lastReason && !isLongText && entry.lastReason !== state.scene.beatSummary && !/^(?:Scene progression|Manual Dossier adjustment|Manual UI adjustment)$/i.test(entry.lastReason)) {
          cell.append(el("small", "ls-muted", `↳ ${entry.lastReason}`));
        }
        if (schema.kind === "skill_tree") {
          cell.append(renderSkillTreeWidget(schema, val, isLocked, (nextSerialized, reason) => mutateCharMeter(schema.id, schema.label, nextSerialized)));
        } else if (schema.kind === "xp_level") {
          cell.append(renderXpLevelWidget(schema, val));
        } else if (schema.kind === "attributes") {
          cell.append(renderAttributesWidget(schema, val, `${activeActor.id}:${ctrl.chatId}`));
        } else if (schema.kind === "inventory") {
          cell.append(renderInventoryWidget(val));
        } else if (schema.kind === "status_fx") {
          cell.append(renderStatusFxWidget(val));
        } else if (schema.kind === "hearts") {
          cell.append(renderHeartsWidget(schema, Number(val) || 0, isCalibrated, isLocked, (nextVal) => mutateCharMeter(schema.id, schema.label, nextVal)));
        } else if (schema.kind === "currency") {
          cell.append(renderCurrencyWidget(schema, val, delta));
        } else if (isCalibrated && isLongText) {
          cell.append(renderStructuredTextStatBody(strVal, schema.displayStyle ?? "auto"));
        } else if (schema.kind === "meter" || schema.kind === "number") {
          const numVal = typeof val === "number" ? val : 0;
          const span = Math.max(1, schema.max - schema.min);
          const track = el("div", "ls-bar-track");
          const fill = el("div", "ls-bar-fill");
          if (schema.min < 0 && schema.max > 0) {
            track.dataset.bipolar = "true";
            const zeroPct = (0 - schema.min) / span * 100;
            if (numVal >= 0) {
              fill.style.marginLeft = `${zeroPct.toFixed(1)}%`;
              fill.style.width = `${Math.min(100 - zeroPct, numVal / schema.max * (100 - zeroPct)).toFixed(1)}%`;
            } else {
              const wPct = Math.abs(numVal) / Math.abs(schema.min) * zeroPct;
              fill.style.marginLeft = `${Math.max(0, zeroPct - wPct).toFixed(1)}%`;
              fill.style.width = `${Math.min(zeroPct, wPct).toFixed(1)}%`;
              fill.style.background = "var(--ls-danger)";
            }
          } else {
            const pct = isCalibrated ? Math.max(0, Math.min(100, Math.round((numVal - schema.min) / span * 100))) : 0;
            fill.style.width = `${pct}%`;
          }
          track.append(fill);
          cell.append(track);
          if (ctrl.dossierEditMode && compScope && ctrl.ctx.components?.mountRangeSlider) {
            const sliderSlot = el("div");
            cell.append(sliderSlot);
            try {
              compScope.track(ctrl.ctx.components.mountRangeSlider(sliderSlot, {
                min: schema.min,
                max: schema.max,
                step: schema.step || 1,
                integer: true,
                value: numVal,
                disabled: isLocked,
                onDragValue: (v) => {
                  if (v !== null)
                    valBadge.textContent = String(v);
                },
                onCommit: (v) => mutateCharMeter(schema.id, schema.label, v)
              }));
            } catch {}
          }
        } else if (schema.kind === "clock") {
          const segs = Math.max(2, Math.min(16, schema.max || 6));
          const cur = isCalibrated ? Math.max(0, Math.min(segs, Math.round(Number(val) || 0))) : 0;
          const clockBar = el("div", "ls-clock-bar");
          clockBar.style.gridTemplateColumns = `repeat(${segs}, 1fr)`;
          for (let i = 1;i <= segs; i++) {
            const seg = el("span", `ls-clock-seg${i <= cur ? " is-filled" : ""}`);
            seg.addEventListener("click", () => mutateCharMeter(schema.id, schema.label, i === cur ? i - 1 : i));
            clockBar.append(seg);
          }
          cell.append(clockBar);
        }
        bindContextMenuWithLongPress(ctrl.ctx, cell, () => [
          { key: "edit", label: `✏️ Edit "${schema.label}" Schema & Style` },
          { key: "duplicate", label: `\uD83D\uDCCB Duplicate "${schema.label}" to Another Scope / Tab…` },
          { key: "test", label: `\uD83E\uDDEA Test "${schema.label}" in Sandbox` },
          { key: "audit", label: `\uD83D\uDCC8 View Shift History` },
          { key: "div", label: "", type: "divider" },
          { key: "delete", label: `\uD83D\uDDD1️ Delete "${schema.label}"`, danger: true }
        ], (selectedKey) => {
          if (selectedKey === "edit")
            openStatSchemaModal(ctrl, "character", schema);
          else if (selectedKey === "duplicate")
            openDuplicateStatModal(ctrl, schema);
          else if (selectedKey === "test")
            openSandboxTesterModal(ctrl, schema.id);
          else if (selectedKey === "audit")
            openAuditLogModal(ctrl, activeActor.id);
          else if (selectedKey === "delete") {
            const liveTpl = structuredClone(ctrl.snapshot.template);
            ctrl.request("state:mutate", {
              templatePatch: { stats: liveTpl.stats.filter((s) => s.id !== schema.id) },
              reason: `Deleted stat "${schema.label}"`
            });
          }
        });
        metersGrid.append(cell);
      }
      main.append(metersGrid);
    }
    const dossierSharedStats = template.stats.filter((s) => s.enabled && s.scope === "player" && s.showIn?.dossier === true && s.dossierTabId === currentTab.id && currentTab.id !== "bonds");
    if (dossierSharedStats.length > 0) {
      main.append(renderStatSchemaCards(ctrl, dossierSharedStats, "player", compScope, ctrl.dossierEditMode, false));
    }
  }
  if (currentTab.showNpcBonds || currentTab.kind === "peer_bonds") {
    const peerCard = el("div", "ls-stack");
    const pHead = el("div", "ls-row-between");
    const bonds = Object.values(activeActor.peerBonds ?? {});
    pHead.append(el("h3", "", `\uD83E\uDD1D ${activeActor.name}'s Standing & Stats Toward Other NPCs (${bonds.length})`), btn("+ Add NPC↔NPC Bond", () => openNpcBondEditorModal(ctrl, activeActor), "ls-btn-sm ls-btn-primary"));
    peerCard.append(pHead);
    if (!bonds.length) {
      peerCard.append(el("p", "ls-muted", `No NPC-to-NPC relationships recorded for ${activeActor.name} yet. They populate automatically when multiple NPCs interact, or click "+ Add NPC↔NPC Bond" above.`));
    } else {
      const grid = el("div", "ls-stat-grid");
      for (const bond of bonds) {
        const cell = el("div", "ls-stat-cell");
        const top = el("div", "ls-row-between");
        top.append(el("strong", "", `→ \uD83D\uDC64 ${bond.toName}`), el("div", "ls-row"));
        top.lastElementChild.append(el("span", "ls-chip ls-chip-accent", bond.label), btn("✏️", () => openNpcBondEditorModal(ctrl, activeActor, bond), "ls-btn-sm ls-btn-icon", "Edit NPC bond"), btn("\uD83D\uDDD1️", () => {
          const nextChar = structuredClone(activeActor);
          delete nextChar.peerBonds[bond.toId];
          ctrl.request("state:mutate", {
            stateOverride: {
              characters: {
                ...state.characters,
                [activeActor.id]: nextChar
              }
            },
            reason: `Removed peer bond ${activeActor.name} → ${bond.toName}`
          });
        }, "ls-btn-sm ls-btn-icon ls-btn-danger", "Delete NPC bond"));
        cell.append(top);
        if (bond.attitude) {
          cell.append(el("div", "ls-thought-box", `“${bond.attitude}”`));
        }
        for (const [mKey, mVal] of Object.entries(bond.meters)) {
          const schema = template.stats.find((s) => s.id === mKey && s.scope === "character");
          if (schema && !schema.enabled)
            continue;
          const mLabel = schema ? `${schema.icon} ${schema.label}` : mKey;
          const mRow = el("div", "ls-row-between");
          mRow.append(el("small", "ls-muted", mLabel), el("strong", "", String(mVal)));
          cell.append(mRow);
          if (typeof mVal === "number") {
            const min = schema?.min ?? 0;
            const max = schema?.max ?? 100;
            const span = Math.max(1, max - min);
            const track = el("div", "ls-bar-track");
            const fill = el("div", "ls-bar-fill");
            if (schema?.color)
              fill.style.setProperty("--ls-bar-color", schema.color);
            if (min < 0 && max > 0) {
              track.dataset.bipolar = "true";
              const zeroPct = (0 - min) / span * 100;
              if (mVal >= 0) {
                fill.style.marginLeft = `${zeroPct.toFixed(1)}%`;
                fill.style.width = `${Math.min(100 - zeroPct, mVal / max * (100 - zeroPct)).toFixed(1)}%`;
              } else {
                const wPct = Math.abs(mVal) / Math.abs(min) * zeroPct;
                fill.style.marginLeft = `${Math.max(0, zeroPct - wPct).toFixed(1)}%`;
                fill.style.width = `${Math.min(zeroPct, wPct).toFixed(1)}%`;
                fill.style.background = "var(--ls-danger)";
              }
            } else {
              const pct = Math.max(0, Math.min(100, Math.round((mVal - min) / span * 100)));
              fill.style.width = `${pct}%`;
            }
            track.append(fill);
            cell.append(track);
          }
        }
        grid.append(cell);
      }
      peerCard.append(grid);
    }
    main.append(peerCard);
  }
  if (currentTab.showSecrets) {
    const secCard = el("div", "ls-stack");
    secCard.append(el("h3", "", "\uD83D\uDD75️ Secrets, Clues & Notes"));
    if (!activeActor.secrets.length) {
      secCard.append(el("p", "ls-muted", "No secrets or discoveries recorded for this character yet."));
    } else {
      for (const s of activeActor.secrets) {
        const cell = el("div", "ls-stat-cell");
        cell.append(el("strong", "", `${s.stage === "confirmed" ? "\uD83D\uDD13" : "\uD83D\uDD0D"} ${s.title} (${s.stage})`), el("p", "ls-muted", s.detail));
        secCard.append(cell);
      }
    }
    main.append(secCard);
  }
  if (currentTab.showAudit) {
    const recent = state.auditLog.filter((a) => a.actorId === activeActor.id && typeof a.after === "number" && (a.before !== null || a.numericDelta !== 0)).slice(-8).reverse();
    if (recent.length > 0) {
      const auditBox = el("div", "ls-stack");
      auditBox.append(el("span", "ls-kicker", "\uD83D\uDCC8 Recent Meter Shifts"));
      const row = el("div", "ls-row");
      for (const r of recent) {
        const sign = r.numericDelta > 0 ? `+${r.numericDelta}` : String(r.numericDelta);
        const chip = el("span", `ls-delta ${r.numericDelta >= 0 ? "is-pos" : "is-neg"}`, `${r.statLabel}: ${String(r.before ?? "—")} → ${String(r.after)}${r.numericDelta !== 0 ? ` (${sign})` : ""}`);
        if (r.reason && r.reason !== state.scene.beatSummary) {
          chip.title = r.reason;
        }
        row.append(chip);
      }
      auditBox.append(row);
      main.append(auditBox);
    }
  }
  shell.append(main);
  wrap.append(shell);
  return wrap;
}
function renderSurfaceCastRoster(ctrl, surface, tabId, onOpenDossier) {
  const { state, template, deltas } = ctrl.snapshot;
  const wrap = el("div", "ls-stack");
  const actors = Object.values(state.characters);
  if (!actors.length) {
    wrap.append(el("p", "ls-muted", "Characters appear here as the story introduces them."));
    return wrap;
  }
  const surfaceTabs = surface === "widget" ? template.surfaces.widgetTabs : template.surfaces.inlineTabs;
  const enabledTabIds = new Set(surfaceTabs.filter((t) => t.enabled).map((t) => t.id));
  const charSchemas = template.stats.filter((s) => {
    if (!s.enabled || s.scope !== "character")
      return false;
    if (surface === "widget" && s.showIn?.widget === false)
      return false;
    if (surface === "inline" && s.showIn?.inline === false)
      return false;
    const assigned = surface === "widget" ? s.widgetTabId || "cast" : s.inlineTabId || "cast";
    const extraTabs = surface === "widget" ? s.extraWidgetTabIds : s.extraInlineTabIds;
    return assigned === tabId || !enabledTabIds.has(assigned) || Boolean(extraTabs?.includes(tabId));
  });
  const surfaceFields = template.dossierFields.filter((f) => surface === "widget" ? f.enabled && f.showInHudCast : f.enabled && f.showInInlineCast);
  const rpgRichKinds = new Set(["skill_tree", "xp_level", "attributes", "inventory", "status_fx", "hearts", "currency"]);
  const numericCharSchemas = charSchemas.filter((s) => !rpgRichKinds.has(s.kind) && !isTextLikeStat(s) && s.kind !== "boolean");
  const richOrTextCharSchemas = charSchemas.filter((s) => rpgRichKinds.has(s.kind) || isTextLikeStat(s) || s.kind === "boolean");
  const presentActors = actors.filter((a) => a.present);
  const awayActors = actors.filter((a) => !a.present);
  const castLayout = template.theme.castLayout ?? "roster";
  const headerBar = el("div", "ls-row-between");
  headerBar.append(el("span", "ls-kicker", `\uD83D\uDFE2 In Scene: ${presentActors.length} · ⚪ Away: ${awayActors.length}`), btn(castLayout === "roster" ? "\uD83D\uDDC2️ All Cards" : "\uD83D\uDC65 Icons", () => {
    const nextLayout = castLayout === "roster" ? "cards" : "roster";
    ctrl.request("state:mutate", {
      templatePatch: {
        theme: { ...template.theme, castLayout: nextLayout }
      },
      reason: `Switched cast display to ${nextLayout}`
    });
  }, "ls-btn-sm", "Toggle between compact character icons and expanded stacked cards"));
  wrap.append(headerBar);
  const renderActorCard = (actor) => {
    const card = el("div", "ls-card");
    const head = el("div", "ls-row-between");
    const leftId = el("div", "ls-row");
    const av = el("div", "ls-cast-avatar");
    if (actor.portraitUrl) {
      const img = el("img");
      img.src = actor.portraitUrl;
      img.alt = actor.name;
      av.append(img);
    } else {
      av.textContent = actor.name.slice(0, 2).toUpperCase();
    }
    const nameStack = el("div");
    nameStack.append(el("strong", "", `${actor.present ? "\uD83D\uDFE2" : "⚪"} ${actor.name}`));
    const roleVal = resolveCharacterFieldValue(actor, "role_summary");
    if (roleVal) {
      const roleSub = el("div", "ls-muted", roleVal);
      roleSub.style.fontSize = "11px";
      nameStack.append(roleSub);
    }
    leftId.append(av, nameStack);
    const rightActions = el("div", "ls-row");
    const demField = surfaceFields.find((f) => f.id === "demeanor");
    const demVal = demField ? resolveCharacterFieldValue(actor, "demeanor") : "";
    if (demVal) {
      rightActions.append(el("span", "ls-chip", `${demField.icon} ${demVal}`));
    }
    rightActions.append(btn(actor.present ? "\uD83D\uDFE2 In Scene" : "⚪ Away", () => {
      ctrl.request("state:mutate", {
        patch: {
          characters: [
            {
              id: actor.id,
              name: actor.name,
              present: !actor.present,
              ...!actor.present && state.scene.location ? { location: state.scene.location } : {}
            }
          ]
        },
        reason: `Marked ${actor.name} as ${!actor.present ? "In Scene" : "Away"}`
      });
    }, `ls-btn-sm ls-presence-pill ${actor.present ? "ls-chip-accent" : ""}`, `Toggle whether ${actor.name} is In Scene or Away`), iconBtn("volume", () => openVoiceAssignmentModal(ctrl, actor.id), {
      className: "ls-btn-sm ls-btn-icon ls-btn-ghost",
      title: `Assign TTS voice for ${actor.name}`
    }), btn("Dossier", () => onOpenDossier(actor.id), "ls-btn-sm ls-btn-primary"));
    head.append(leftId, rightActions);
    card.append(head);
    if (template.coreTrackers?.trackNpcConditions !== false && actor.conditions.length > 0) {
      const condRow = el("div", "ls-row");
      for (const c of actor.conditions.slice(0, 4)) {
        const pill = el("span", "ls-rpg-fx-pill", `⚡ ${c}`);
        pill.dataset.fxKind = "neutral";
        condRow.append(pill);
      }
      card.append(condRow);
    }
    for (const f of surfaceFields.filter((hf) => hf.id !== "demeanor" && hf.id !== "role_summary")) {
      const val = resolveCharacterFieldValue(actor, f.id);
      if (!val)
        continue;
      if (f.displayStyle === "quote") {
        card.append(el("div", "ls-thought-box", `${f.icon} “${val}”`));
      } else {
        card.append(el("small", "ls-muted", `${f.icon} ${val}`));
      }
    }
    if (numericCharSchemas.length > 0) {
      const miniGrid = el("div", "ls-cast-mini-grid");
      for (const schema of numericCharSchemas) {
        const m = actor.meters[schema.id];
        const d = deltas.characterDeltas[actor.id]?.[schema.id] ?? 0;
        const numVal = m?.calibrated && typeof m.value === "number" ? m.value : 0;
        const span = Math.max(1, schema.max - schema.min);
        const pct = m?.calibrated ? Math.max(0, Math.min(100, Math.round((numVal - schema.min) / span * 100))) : 0;
        const tier = m?.calibrated && typeof m.value === "number" ? resolveAnchorLabel(schema.anchors, m.value) : "";
        const mini = el("div", "ls-cast-mini-meter");
        mini.style.setProperty("--ls-bar-color", schema.color || "var(--ls-primary)");
        if (tier)
          mini.title = `${schema.label}: ${numVal} (${tier})`;
        const topRow = el("div", "ls-row-between");
        topRow.append(el("small", "ls-muted", `${schema.icon} ${schema.label}`));
        const valCluster = el("div", "ls-row");
        if (d !== 0) {
          valCluster.append(el("span", `ls-delta ${d > 0 ? "is-pos" : "is-neg"}`, d > 0 ? `+${d}` : String(d)));
        }
        valCluster.append(el("strong", "", m?.calibrated ? String(m.value) : "—"));
        topRow.append(valCluster);
        const track = el("div", "ls-bar-track");
        const fill = el("div", "ls-bar-fill");
        fill.style.width = `${pct}%`;
        track.append(fill);
        mini.append(topRow, track);
        miniGrid.append(mini);
      }
      card.append(miniGrid);
    }
    for (const schema of richOrTextCharSchemas) {
      const m = actor.meters[schema.id];
      const isCalibrated = Boolean(m?.calibrated);
      const val = isCalibrated ? m.value : schema.defaultValue;
      const strVal = String(val ?? "").trim();
      const block = el("div", "ls-stat-cell");
      block.style.setProperty("--ls-bar-color", schema.color || "var(--ls-primary)");
      block.dataset.uncalibrated = String(!isCalibrated);
      block.append(el("small", "ls-kicker", `${schema.icon} ${schema.label}`));
      if (!isCalibrated && !rpgRichKinds.has(schema.kind)) {
        block.append(el("small", "ls-muted", "Uncalibrated"));
        card.append(block);
        continue;
      }
      if (isCalibrated && (!strVal || strVal === "None") && !rpgRichKinds.has(schema.kind)) {
        block.append(el("small", "ls-muted", "None"));
        card.append(block);
        continue;
      }
      if (schema.kind === "skill_tree") {
        block.append(renderSkillTreeWidget(schema, val, Boolean(schema.locked || m?.locked), (nextSerialized, reason) => {
          ctrl.request("state:mutate", {
            patch: {
              characters: [{
                id: actor.id,
                name: actor.name,
                meters: { [schema.id]: { op: "set", value: nextSerialized, reason } }
              }]
            },
            reason
          });
        }));
      } else if (schema.kind === "xp_level") {
        block.append(renderXpLevelWidget(schema, val));
      } else if (schema.kind === "attributes") {
        block.append(renderAttributesWidget(schema, val, `${actor.id}:${ctrl.chatId}`));
      } else if (schema.kind === "inventory") {
        block.append(renderInventoryWidget(val));
      } else if (schema.kind === "status_fx") {
        block.append(renderStatusFxWidget(val));
      } else if (schema.kind === "hearts") {
        block.append(renderHeartsWidget(schema, Number(val) || 0, Boolean(m?.calibrated), Boolean(schema.locked || m?.locked)));
      } else if (schema.kind === "currency") {
        block.append(renderCurrencyWidget(schema, val, deltas.characterDeltas[actor.id]?.[schema.id] ?? 0));
      } else {
        block.append(renderStructuredTextStatBody(strVal, schema.displayStyle ?? "auto"));
      }
      card.append(block);
    }
    return card;
  };
  if (castLayout === "cards") {
    for (const actor of [...presentActors, ...awayActors]) {
      wrap.append(renderActorCard(actor));
    }
    return wrap;
  }
  ctrl.openedCastTabs = ctrl.openedCastTabs.filter((id) => Boolean(state.characters[id]));
  const activeTabActor = ctrl.activeCastTabActorId && state.characters[ctrl.activeCastTabActorId] ? state.characters[ctrl.activeCastTabActorId] : undefined;
  if (ctrl.openedCastTabs.length > 0 || activeTabActor) {
    const tabBar = el("div", "ls-cast-tabs-bar");
    const backBtn = btn("← Cast", () => {
      ctrl.activeCastTabActorId = "";
      ctrl.emitChange();
    }, "ls-btn-sm", "Return to Cast Icons");
    if (!activeTabActor)
      backBtn.setAttribute("aria-current", "page");
    tabBar.append(backBtn);
    for (const tabId of ctrl.openedCastTabs) {
      const tabActor = state.characters[tabId];
      if (!tabActor)
        continue;
      const isActiveTab = activeTabActor?.id === tabActor.id;
      const group = el("div", "ls-cast-tab-group");
      const tabBtn = btn(`${tabActor.present ? "\uD83D\uDFE2" : "⚪"} ${tabActor.name}`, () => {
        ctrl.activeCastTabActorId = tabActor.id;
        ctrl.selectedActorId = tabActor.id;
        ctrl.emitChange();
      }, "ls-btn-sm ls-cast-tab-btn", `Inspect ${tabActor.name}`);
      if (isActiveTab)
        tabBtn.setAttribute("aria-current", "page");
      const closeTabBtn = btn("×", () => {
        ctrl.openedCastTabs = ctrl.openedCastTabs.filter((id) => id !== tabActor.id);
        if (ctrl.activeCastTabActorId === tabActor.id) {
          ctrl.activeCastTabActorId = ctrl.openedCastTabs.at(-1) ?? "";
        }
        ctrl.emitChange();
      }, "ls-btn-sm ls-cast-tab-close", `Close ${tabActor.name} tab`);
      group.append(tabBtn, closeTabBtn);
      tabBar.append(group);
    }
    if (activeTabActor) {
      wrap.replaceChildren(headerBar, tabBar, renderActorCard(activeTabActor));
      return wrap;
    }
    wrap.append(tabBar);
  }
  const renderIconGroup = (label, groupActors) => {
    if (!groupActors.length)
      return;
    const groupWrap = el("div", "ls-roster-group");
    groupWrap.append(el("small", "ls-muted", `${label} (${groupActors.length})`));
    const grid = el("div", "ls-roster-grid");
    for (const actor of groupActors) {
      const demeanor = resolveCharacterFieldValue(actor, "demeanor");
      const roleShort = resolveCharacterFieldValue(actor, "role_summary");
      const tileBtn = el("button", "ls-roster-icon-btn");
      tileBtn.type = "button";
      tileBtn.title = `${actor.name}${roleShort ? ` — ${roleShort}` : ""}${demeanor ? ` (${demeanor})` : ""}`;
      const avatar = el("div", "ls-roster-avatar");
      if (actor.portraitUrl) {
        const img = el("img");
        img.src = actor.portraitUrl;
        img.alt = actor.name;
        avatar.append(img);
      } else {
        avatar.append(document.createTextNode(actor.name.slice(0, 2).toUpperCase()));
      }
      avatar.append(el("span", `ls-roster-dot ${actor.present ? "is-present" : "is-away"}`));
      const nameEl = el("span", "ls-roster-name", actor.name);
      const subText = demeanor || roleShort || "";
      const subEl = subText ? el("span", "ls-roster-role", subText) : null;
      tileBtn.append(avatar, nameEl, ...subEl ? [subEl] : []);
      tileBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!ctrl.openedCastTabs.includes(actor.id)) {
          ctrl.openedCastTabs = [...ctrl.openedCastTabs, actor.id];
        }
        ctrl.activeCastTabActorId = actor.id;
        ctrl.selectedActorId = actor.id;
        ctrl.emitChange();
      });
      grid.append(tileBtn);
    }
    groupWrap.append(grid);
    wrap.append(groupWrap);
  };
  renderIconGroup("\uD83D\uDFE2 In Scene", presentActors);
  renderIconGroup("⚪ Away", awayActors);
  return wrap;
}

// src/frontend/surfaces/WorldAndCopilot.ts
function renderWorldSurface(ctrl, compScope) {
  const { state, template } = ctrl.snapshot;
  const wrap = el("div", "ls-stack");
  const qCfg = resolveBuiltInTrackerConfig(template.coreTrackers, "quests");
  const dCfg = resolveBuiltInTrackerConfig(template.coreTrackers, "dispatches");
  const worldStatsCard = el("section", "ls-card");
  worldStatsCard.append(renderStatGridSurface(ctrl, ["world", "scene"], compScope, true));
  wrap.append(worldStatsCard);
  if (qCfg.enabled && !qCfg.deleted) {
    const quests = Object.values(state.quests);
    const qCard = el("section", "ls-card");
    const qHead = el("div", "ls-row-between");
    qHead.append(el("h3", "", `${qCfg.icon || "\uD83C\uDFAF"} ${qCfg.label} (${quests.filter((q) => q.status === "active").length})`), btn("+ Add Quest", () => {
      ctrl.modals.open({ title: "➕ Add Quest or Goal", width: 460 }, (body, close) => {
        const tWrap = el("label", "ls-label", "Quest Title");
        const tInp = el("input", "ls-input");
        tWrap.append(tInp);
        const oWrap = el("label", "ls-label", "Objectives (one per line)");
        const oInp = el("textarea", "ls-input");
        oInp.rows = 3;
        oWrap.append(oInp);
        const save = btn("➕ Save Quest", () => {
          const title = tInp.value.trim();
          if (!title)
            return;
          const objectives = oInp.value.split(`
`).map((s) => s.trim()).filter(Boolean).map((text) => ({ text, completed: false }));
          ctrl.request("state:mutate", {
            patch: {
              quests: [{ title, status: "active", objectives }]
            },
            reason: `Added quest "${title}"`
          });
          close();
        }, "ls-btn-primary");
        body.append(tWrap, oWrap, save);
      });
    }, "ls-btn-sm ls-btn-primary"));
    qCard.append(qHead);
    if (!quests.length) {
      qCard.append(el("p", "ls-muted", "No active quests recorded yet."));
    } else {
      for (const q of quests) {
        const box = el("div", "ls-stat-cell");
        box.append(el("strong", "", `\uD83C\uDFAF ${q.title} (${q.status})`));
        for (const [idx, obj] of q.objectives.entries()) {
          const row = el("label", "ls-row");
          const chk = el("input");
          chk.type = "checkbox";
          chk.checked = obj.completed;
          chk.addEventListener("change", () => {
            const nextObjs = q.objectives.map((o, i) => i === idx ? { ...o, completed: chk.checked } : o);
            const allDone = nextObjs.every((o) => o.completed);
            ctrl.request("state:mutate", {
              patch: {
                quests: [{ id: q.id, title: q.title, status: allDone ? "completed" : "active", objectives: nextObjs }]
              }
            });
          });
          row.append(chk, el("span", obj.completed ? "ls-muted" : "", obj.text));
          box.append(row);
        }
        qCard.append(box);
      }
    }
    wrap.append(qCard);
  }
  if (dCfg.enabled && !dCfg.deleted && state.dispatches.length > 0) {
    const dCard = el("section", "ls-card");
    dCard.append(el("h3", "", `${dCfg.icon || "\uD83D\uDCE1"} ${dCfg.label} (${state.dispatches.length})`));
    for (const disp of [...state.dispatches].reverse().slice(0, 6)) {
      const cell = el("div", "ls-stat-cell");
      const top = el("div", "ls-row-between");
      top.append(el("strong", "", `\uD83D\uDCE1 ${disp.title}`), el("span", "ls-chip", `\uD83D\uDCCD ${disp.locationName} · Turn ${disp.turn}`));
      cell.append(top, el("p", "ls-muted", disp.summary));
      if (disp.futureHook) {
        cell.append(el("small", "ls-muted", `↳ Hook: ${disp.futureHook}`));
      }
      dCard.append(cell);
    }
    wrap.append(dCard);
  }
  return wrap;
}
function renderCopilotSurface(ctrl) {
  const { checkpoints } = ctrl.snapshot;
  const wrap = el("div", "ls-stack");
  const topCard = el("section", "ls-card");
  const head = el("div", "ls-row-between");
  head.append(el("h3", "", "\uD83E\uDD16 Lumi Stats Copilot & Schema Architect"), btn("\uD83E\uDDF9 Clear History", () => void ctrl.request("copilot:clear"), "ls-btn-sm"));
  topCard.append(head);
  const modeRow = el("div", "ls-row");
  for (const [mId, lbl] of [
    ["ask", "\uD83D\uDCAC Ask Continuity"],
    ["adjust", "\uD83D\uDCCA Adjust Stats"],
    ["architect", "✨ Design Custom Stats"]
  ]) {
    const b = btn(lbl, () => {
      ctrl.activeCopilotMode = mId;
      ctrl.emitChange();
    }, "ls-btn-sm");
    if (ctrl.activeCopilotMode === mId)
      b.setAttribute("aria-pressed", "true");
    modeRow.append(b);
  }
  topCard.append(modeRow);
  wrap.append(topCard);
  if (ctrl.activeProposal) {
    const prop = ctrl.activeProposal;
    const pCard = el("section", "ls-card");
    pCard.append(el("h3", "", "\uD83D\uDCCB Proposed Copilot Changes"));
    for (const s of prop.summaries) {
      pCard.append(el("p", "", `• ${s}`));
    }
    const btns = el("div", "ls-row");
    btns.append(btn("✅ Apply Proposal", () => {
      const id = prop.id;
      ctrl.activeProposal = undefined;
      ctrl.request("copilot:acceptProposal", { proposalId: id });
    }, "ls-btn-sm ls-btn-primary"), btn("✕ Discard", () => {
      ctrl.activeProposal = undefined;
      ctrl.emitChange();
    }, "ls-btn-sm"));
    pCard.append(btns);
    wrap.append(pCard);
  }
  const logCard = el("section", "ls-card");
  logCard.style.maxHeight = "260px";
  logCard.style.overflowY = "auto";
  if (!ctrl.copilotTurns.length) {
    logCard.append(el("p", "ls-muted", "Ask a question or tell Lumi Architect what stats to build below."));
  } else {
    for (const turn of ctrl.copilotTurns) {
      const cell = el("div", "ls-stat-cell");
      cell.append(el("span", "ls-kicker", turn.role === "user" ? "You" : "Lumi Architect"), el("p", "", turn.text));
      logCard.append(cell);
    }
  }
  wrap.append(logCard);
  const composer = el("section", "ls-card");
  const area = el("textarea", "ls-input");
  area.rows = 2;
  area.placeholder = 'e.g. "Add a momentary Blush meter (0-100) and set the maid’s Loyalty to 92"';
  const sendBtn = btn(ctrl.busy ? "⏳ Working…" : "Send to Copilot ↵", () => {
    const msg = area.value.trim();
    if (!msg || ctrl.busy)
      return;
    area.value = "";
    ctrl.request("copilot:send", { message: msg, mode: ctrl.activeCopilotMode }).then((res) => {
      if (res.proposal && typeof res.proposal === "object") {
        ctrl.activeProposal = res.proposal;
        ctrl.emitChange();
      }
    });
  }, "ls-btn-primary");
  composer.append(area, sendBtn);
  wrap.append(composer);
  const cpCard = el("details", "ls-card");
  const sum = el("summary", "ls-row-between");
  sum.append(el("strong", "", `⏪ Turn Checkpoints (${checkpoints.length})`), btn("↩ Undo Latest", () => void ctrl.request("state:undo"), "ls-btn-sm"));
  cpCard.append(sum);
  const cpStack = el("div", "ls-stack");
  cpStack.style.marginTop = "8px";
  for (const cp of checkpoints.slice(0, 12)) {
    const row = el("div", "ls-row-between ls-stat-cell");
    row.append(el("span", "", `Rev ${cp.revision}: ${cp.reason}`), btn("Restore", async () => {
      const ok = await ctrl.modals.confirm({
        title: `Restore Revision ${cp.revision}?`,
        message: `Restore campaign state to Revision ${cp.revision} ("${cp.reason}")?`,
        confirmLabel: "Restore",
        variant: "warning"
      });
      if (ok) {
        ctrl.request("state:restoreCheckpoint", { checkpointId: cp.id });
      }
    }, "ls-btn-sm"));
    cpStack.append(row);
  }
  cpCard.append(cpStack);
  wrap.append(cpCard);
  return wrap;
}

// src/frontend/widget-mount.ts
function mountFloatingWidget(ctx, ctrl, openStudio, widgetTarget) {
  try {
    const widgetScope = new ComponentScope;
    const initTheme = ctrl.snapshot.template.theme;
    const getExpandedSize = () => ({
      w: Math.max(240, Math.min(1200, ctrl.snapshot.template.theme.widgetWidth ?? 460)),
      h: Math.max(180, Math.min(900, ctrl.snapshot.template.theme.widgetHeight ?? 540))
    });
    const getPillSize = () => ({
      w: Math.max(220, Math.min(960, ctrl.snapshot.template.theme.pillWidth ?? 420)),
      h: Math.max(56, Math.min(220, ctrl.snapshot.template.theme.pillHeight ?? 92))
    });
    const floatWidget = ctx.ui.createFloatWidget({
      width: widgetTarget?.width ?? (initTheme.pillWidth ?? 420),
      height: widgetTarget?.height ?? (initTheme.pillHeight ?? 92),
      chromeless: widgetTarget?.chromeless ?? true,
      snapToEdge: true,
      tooltip: "Lumi Stats HUD",
      touchScrollMode: "native"
    });
    floatWidget.root.classList.add("ls-root");
    floatWidget.root.style.cssText += ";display:flex;flex-direction:column;height:100%;max-height:100%;min-height:0;overflow:hidden;background:transparent;";
    ctrl.onResizeWidgetLive = (width, height, commit) => {
      floatWidget.setSize(width, height);
      if (commit) {
        const curTheme = ctrl.snapshot.template.theme;
        ctrl.request("state:mutate", {
          templatePatch: {
            theme: ctrl.widgetExpanded ? { ...curTheme, widgetWidth: width, widgetHeight: height } : { ...curTheme, pillWidth: width, pillHeight: height }
          },
          reason: `Resized widget to ${width}×${height}`
        });
      }
    };
    let collapseTimer = null;
    const toggleCompact = () => {
      if (collapseTimer) {
        clearTimeout(collapseTimer);
        collapseTimer = null;
      }
      ctrl.widgetExpanded = !ctrl.widgetExpanded;
      const isCompact = !ctrl.widgetExpanded;
      if (!isCompact) {
        const { w, h } = getExpandedSize();
        floatWidget.setSize(w, h);
      } else {
        const { w, h } = getPillSize();
        collapseTimer = setTimeout(() => {
          floatWidget.setSize(w, h);
          collapseTimer = null;
        }, 180);
      }
      renderWidget();
    };
    let lastAutoPillSizeKey = "";
    const renderWidget = () => {
      widgetScope.clear();
      const placement = ctrl.snapshot.template.theme.placement;
      const visible = !ctrl.vnStageOpen && !ctrl.studioOpen && (placement === "floating_only" || placement.startsWith("both_"));
      floatWidget.setVisible(visible);
      ctrl.stampThemeOnElement(floatWidget.root);
      const hudNode = renderFloatingHudSurface(ctrl, !ctrl.widgetExpanded, toggleCompact, (actorId) => openCharacterDossierModal(ctrl, actorId), openStudio, widgetScope);
      floatWidget.root.replaceChildren(hudNode);
      if (!ctrl.widgetExpanded && !collapseTimer && visible) {
        const isEmptyDeck = Boolean(hudNode.querySelector('.ls-hud-pill[data-empty-deck="true"]'));
        const { w, h } = getPillSize();
        const effectiveH = isEmptyDeck ? Math.min(h, 48) : h;
        const sizeKey = `${w}x${effectiveH}`;
        if (sizeKey !== lastAutoPillSizeKey) {
          lastAutoPillSizeKey = sizeKey;
          floatWidget.setSize(w, effectiveH);
        }
      } else {
        lastAutoPillSizeKey = "";
      }
      ctrl.applyTemplateThemeToDom();
    };
    const onDesktopWidgetReturned = (ev) => {
      const detail = ev.detail;
      if (detail?.extensionId && detail.extensionId !== "lumi_stats")
        return;
      ctrl.refreshActiveChat();
      renderWidget();
    };
    window.addEventListener("spindle:desktop-widget-returned", onDesktopWidgetReturned);
    const unsub = ctrl.subscribe(renderWidget);
    renderWidget();
    return () => {
      window.removeEventListener("spindle:desktop-widget-returned", onDesktopWidgetReturned);
      if (collapseTimer)
        clearTimeout(collapseTimer);
      ctrl.onResizeWidgetLive = null;
      unsub();
      widgetScope.clear();
      floatWidget.destroy();
    };
  } catch {
    return;
  }
}

// src/frontend.ts
function mountLumiStats(ctx) {
  ctx.deferReady?.();
  const cleanup = [];
  cleanup.push(acquireLumiStatsStyles(ctx));
  const ctrl = new LumiFrontendController(ctx);
  cleanup.push(() => ctrl.destroy());
  const vnStage = new LumiVnStage(ctrl);
  cleanup.push(() => vnStage.destroy());
  ctrl.onToggleVnStage = () => {
    if (ctrl.vnStageOpen)
      vnStage.close();
    else
      vnStage.open();
  };
  const openStudio = () => openSettingsStudioModal(ctrl);
  const inlineManager = new InlineRibbonManager(ctrl);
  cleanup.push(() => inlineManager.clear());
  const stopWidget = mountFloatingWidget(ctx, ctrl, openStudio);
  if (stopWidget)
    cleanup.push(stopWidget);
  const drawerScope = new ComponentScope;
  cleanup.push(() => drawerScope.clear());
  const tab = ctx.ui.registerDrawerTab({
    id: "lumi-stats",
    title: "Lumi Stats",
    shortName: "Stats",
    description: "Two-phase grounded roleplay stats, character dossiers, spatial map & Copilot",
    keywords: ["lumi", "stats", "tracker", "dossier", "meters", "map"]
  });
  cleanup.push(() => tab.destroy());
  const root = el("div", "ls-root");
  const head = el("header", "ls-drawer-head");
  const nav = el("nav", "ls-drawer-nav");
  const body = el("main", "ls-drawer-body");
  const statusBar = el("div", "ls-status-bar");
  statusBar.setAttribute("role", "status");
  statusBar.setAttribute("aria-live", "polite");
  root.append(head, nav, body, statusBar);
  tab.root.style.cssText += ";display:flex;flex-direction:column;height:100%;max-height:100%;min-height:0;overflow:hidden;";
  tab.root.append(root);
  let drawerDirty = false;
  const renderDrawer = (force = false) => {
    if (!ctrl.isGenerationStreaming) {
      inlineManager.sync((actorId) => openCharacterDossierModal(ctrl, actorId), openStudio);
    }
    if (!force && !ctrl.isDrawerTabVisible) {
      drawerDirty = true;
      return;
    }
    preserveScrollAndFocus(root, () => {
      drawerDirty = false;
      drawerScope.clear();
      const { state } = ctrl.snapshot;
      head.replaceChildren();
      const brand = el("div", "ls-brand");
      brand.append(el("span", "ls-brand-mark", "L"), document.createTextNode("Lumi Stats"));
      const headBtns = el("div", "ls-row");
      headBtns.append(btn("↻ Sync", () => void ctrl.request("track:manual"), "ls-btn-sm", "Calibrate & update stats now"), btn("\uD83C\uDFAC VN Stage", () => ctrl.toggleVnStage(), "ls-btn-sm", "Launch 2D Visual Novel Stage"), btn("\uD83D\uDD0A Voices", () => openVoiceAssignmentModal(ctrl), "ls-btn-sm", "Configure Cast & Narrator TTS Voices"), btn(`${ctrl.snapshot.template.icon || "\uD83C\uDFAD"} Template`, () => openQuickTemplateModal(ctrl, openStudio), "ls-btn-sm", "Switch or create a Lumi Stats template"), btn("⚙️ Studio", openStudio, "ls-btn-sm ls-btn-primary"));
      head.append(brand, headBtns);
      nav.replaceChildren();
      for (const [id, label] of [
        ["Stats", "\uD83D\uDCCA Stats"],
        ["Cast", `\uD83D\uDC65 Cast (${Object.keys(state.characters).length})`],
        ["Map", `\uD83D\uDDFA️ Atlas (${Object.keys(state.places).length})`],
        ["World", "\uD83C\uDF0D World"],
        ["Copilot", "\uD83E\uDD16 Copilot"]
      ]) {
        const b = btn(label, () => {
          ctrl.activeDrawerTab = id;
          renderDrawer(true);
        }, "ls-btn-sm");
        if (ctrl.activeDrawerTab === id)
          b.setAttribute("aria-current", "page");
        nav.append(b);
      }
      body.replaceChildren();
      if (!ctrl.chatId) {
        const empty = el("div", "ls-card");
        empty.append(el("strong", "", "Open a chat to begin"), el("p", "ls-muted", "Lumi Stats calibrates initial baselines from the Character Card, Persona, and Opening Message, and tracks turn-by-turn changes automatically."));
        body.append(empty);
      } else if (ctrl.activeDrawerTab === "Stats") {
        const sceneCard = el("section", "ls-card");
        const topRow = el("div", "ls-row-between");
        topRow.append(renderSceneHeaderChips(ctrl), btn("✏️ Edit Scene", () => openSceneBannerModal(ctrl), "ls-btn-sm"));
        sceneCard.append(topRow);
        const coreTrackers = ctrl.snapshot.template.coreTrackers;
        if (state.scene.beatSummary && coreTrackers?.trackSceneSummary !== false && !coreTrackers?.overrides?.scene_summary?.deleted) {
          sceneCard.append(el("p", "ls-muted", state.scene.beatSummary));
        }
        body.append(sceneCard);
        const playerStatsCard = el("section", "ls-card");
        const corePlayerEl = renderCorePlayerAndSceneCards(ctrl, "drawer");
        if (corePlayerEl.childElementCount > 0) {
          playerStatsCard.append(corePlayerEl);
        }
        playerStatsCard.append(renderStatGridSurface(ctrl, ["player"], drawerScope, true));
        body.append(playerStatsCard);
      } else if (ctrl.activeDrawerTab === "Cast") {
        body.append(renderCastDossierSurface(ctrl, drawerScope));
      } else if (ctrl.activeDrawerTab === "Map") {
        body.append(renderSpatialMapSurface(ctrl));
      } else if (ctrl.activeDrawerTab === "World") {
        body.append(renderWorldSurface(ctrl, drawerScope));
      } else if (ctrl.activeDrawerTab === "Copilot") {
        body.append(renderCopilotSurface(ctrl));
      }
      statusBar.textContent = ctrl.statusText;
      statusBar.dataset.error = String(ctrl.statusError);
    }, {
      deferIfTyping: !force,
      onDeferredFlush: () => renderDrawer(true)
    });
  };
  if (typeof tab.onActivate === "function") {
    cleanup.push(tab.onActivate(() => {
      ctrl.isDrawerTabVisible = true;
      if (drawerDirty)
        renderDrawer(true);
    }));
  }
  if (ctx.ui?.events) {
    if (typeof ctx.ui.events.onDrawerChange === "function") {
      cleanup.push(ctx.ui.events.onDrawerChange(({ open, tabId }) => {
        const isMine = Boolean(open && tabId && (tabId === tab.tabId || tabId.endsWith("lumi-stats")));
        ctrl.isDrawerTabVisible = isMine;
        if (isMine && drawerDirty) {
          renderDrawer(true);
        }
      }));
    }
    if (typeof ctx.ui.events.onKeyboardChange === "function") {
      const applyKeyboardInset = (insetBottom) => {
        const px = `${Math.max(0, Math.round(insetBottom || 0))}px`;
        root.style.setProperty("--ls-kb-inset", px);
        document.documentElement.style.setProperty("--ls-kb-inset", px);
      };
      try {
        const initialKb = ctx.ui.events.getKeyboardState?.();
        if (initialKb)
          applyKeyboardInset(initialKb.insetBottom);
      } catch {}
      cleanup.push(ctx.ui.events.onKeyboardChange((kbState) => {
        applyKeyboardInset(kbState.visible ? kbState.insetBottom : 0);
      }));
    }
  }
  let lastBusyState = ctrl.busy;
  cleanup.push(ctrl.subscribe(() => {
    renderDrawer(false);
    if (ctrl.vnStageOpen) {
      vnStage.sync();
    }
  }));
  cleanup.push(ctrl.subscribeStatus(() => {
    statusBar.textContent = ctrl.statusText;
    statusBar.dataset.error = String(ctrl.statusError);
    if (ctrl.busy !== lastBusyState) {
      lastBusyState = ctrl.busy;
      if (!ctrl.isGenerationStreaming) {
        inlineManager.sync((actorId) => openCharacterDossierModal(ctrl, actorId), openStudio);
      }
    }
  }));
  if (typeof ctx.ui?.registerInputBarAction === "function") {
    try {
      const syncAction = ctx.ui.registerInputBarAction({
        id: "lumi-stats-sync",
        label: "↻ Calibrate / Sync Lumi Stats",
        enabled: true
      });
      const unsubSync = syncAction.onClick(() => {
        ctrl.request("track:manual");
      });
      const studioAction = ctx.ui.registerInputBarAction({
        id: "lumi-stats-studio",
        label: "⚙️ Open Lumi Stats Studio",
        enabled: true
      });
      const unsubStudio = studioAction.onClick(openStudio);
      const vnAction = ctx.ui.registerInputBarAction({
        id: "lumi-stats-vn-stage",
        label: "\uD83C\uDFAC Toggle Lumi 2D Visual Novel Stage",
        enabled: true
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
    } catch {}
  }
  if (typeof ctx.ui?.registerCharacterEditorTab === "function" && ctx.ui.characterEditor) {
    try {
      const charTab = ctx.ui.registerCharacterEditorTab({
        id: "lumi-stats-card-binding",
        title: "Lumi Stats"
      });
      charTab.root.classList.add("ls-root");
      charTab.root.style.padding = "14px";
      const renderCharEditorTab = () => {
        const state = ctx.ui.characterEditor.getState();
        charTab.root.replaceChildren();
        if (!state.open || !state.characterId)
          return;
        const bound = state.extensions?.lumi_stats;
        const card = el("div", "ls-card");
        card.append(el("h3", "", "\uD83D\uDCCA Character-Bound Lumi Stats Template"), el("p", "ls-muted", bound?.template?.name ? `Currently bound template: "${bound.template.name}". New chats with this character will automatically load this schema.` : "No template bound to this character card yet."));
        const btnRow = el("div", "ls-row");
        btnRow.append(btn("\uD83D\uDCCC Bind Current Active Template to Character", () => {
          ctx.ui.characterEditor.updateExtensions((ext) => ({
            ...ext,
            lumi_stats: {
              template: ctrl.snapshot.template
            }
          }), { immediate: true });
        }, "ls-btn-sm ls-btn-primary"));
        if (bound?.template) {
          btnRow.append(btn("\uD83D\uDDD1️ Unbind Template", () => {
            ctx.ui.characterEditor.updateExtensions((ext) => {
              const next = { ...ext };
              delete next.lumi_stats;
              return next;
            }, { immediate: true });
          }, "ls-btn-sm ls-btn-danger"));
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
    } catch {}
  }
  if (typeof ctx.ui?.registerPresetEditorTab === "function" && ctx.ui.presetEditor?.extension) {
    try {
      const presetTab = ctx.ui.registerPresetEditorTab({
        id: "lumi-stats-preset",
        title: "Lumi Stats"
      });
      presetTab.root.classList.add("ls-root");
      presetTab.root.style.padding = "14px";
      const renderPresetTab = () => {
        const ext = ctx.ui.presetEditor.extension;
        const st = ext.getState();
        presetTab.root.replaceChildren();
        const card = el("div", "ls-card");
        card.append(el("h3", "", "✨ Lumi Stats Preset Macros & Variable Paths"), el("p", "ls-muted", "Use these zero-RPC macros anywhere inside your Loom Preset blocks:"), el("pre", "ls-stat-cell", [
          "{{lumi_stats}}                                    — Full grounded continuity block",
          "{{lumi_header}}                                   — [ \uD83D\uDD70️ Time | \uD83D\uDCC5 Date | \uD83D\uDCCD Location | \uD83C\uDF26️ Weather ]",
          "{{lumi_stat::composure}}                          — Single stat or actor.meter value",
          "{{getchatvarkey::lumi_stats::stats.composure}}    — Native JSON chat variable read",
          "{{getchatvarkey::lumi_stats::actors.rem.meters.loyalty}}"
        ].join(`
`)));
        if (st.presetId) {
          card.append(btn("\uD83D\uDCCC Save Default Template ID to Preset Metadata", () => {
            ext.updateMetadata((cur) => ({
              ...cur && typeof cur === "object" ? cur : {},
              defaultTemplateId: ctrl.snapshot.template.id
            }), { immediate: true });
          }, "ls-btn-sm ls-btn-primary"));
        }
        presetTab.root.append(card);
      };
      const unsubPreset = ctx.ui.presetEditor.extension.onChange(renderPresetTab);
      renderPresetTab();
      cleanup.push(() => {
        unsubPreset();
        presetTab.destroy();
      });
    } catch {}
  }
  cleanup.push(ctx.events.on("CHAT_SWITCHED", (payload) => {
    const obj = payload && typeof payload === "object" ? payload : {};
    const nextChatId = typeof obj.chatId === "string" ? obj.chatId : null;
    ctrl.isGenerationStreaming = false;
    inlineManager.clear();
    ctrl.refreshActiveChat(nextChatId);
  }));
  cleanup.push(ctx.events.on("GENERATION_STARTED", (payload) => {
    const obj = payload && typeof payload === "object" ? payload : {};
    const msgChatId = typeof obj.chatId === "string" ? obj.chatId : null;
    if (ctrl.isActivityForActiveChat(msgChatId)) {
      ctrl.isGenerationStreaming = true;
    }
  }));
  const seenInterceptSigs = new Set;
  const inFlightInterceptSigs = new Set;
  let pendingTagRetry = null;
  let pendingRetryTimer = null;
  cleanup.push(() => {
    if (pendingRetryTimer) {
      clearTimeout(pendingRetryTimer);
      pendingRetryTimer = null;
    }
  });
  const dispatchTagIntercept = (item) => {
    if (seenInterceptSigs.has(item.sig) || inFlightInterceptSigs.has(item.sig))
      return;
    if (ctrl.hydratingChat) {
      pendingTagRetry = item;
      return;
    }
    const latestId = ctx.messages?.getLatestMessageId?.() ?? null;
    if (!latestId || item.messageId !== latestId) {
      pendingTagRetry = item;
      return;
    }
    inFlightInterceptSigs.add(item.sig);
    ctrl.request("tag:intercepted", {
      messageId: item.messageId,
      content: item.content
    }).then((res) => {
      if (res?.ok === true) {
        if (seenInterceptSigs.size >= 60) {
          const oldest = seenInterceptSigs.values().next().value;
          if (oldest !== undefined)
            seenInterceptSigs.delete(oldest);
        }
        seenInterceptSigs.add(item.sig);
        if (pendingTagRetry?.sig === item.sig)
          pendingTagRetry = null;
      } else if (item.attempts < 3) {
        pendingTagRetry = { ...item, attempts: item.attempts + 1 };
        if (pendingRetryTimer)
          clearTimeout(pendingRetryTimer);
        pendingRetryTimer = setTimeout(() => {
          pendingRetryTimer = null;
          if (pendingTagRetry)
            dispatchTagIntercept(pendingTagRetry);
        }, 400);
      }
    }).catch(() => {
      if (item.attempts < 3) {
        pendingTagRetry = { ...item, attempts: item.attempts + 1 };
      }
    }).finally(() => {
      inFlightInterceptSigs.delete(item.sig);
    });
  };
  for (const endEvent of ["GENERATION_ENDED", "GENERATION_STOPPED"]) {
    cleanup.push(ctx.events.on(endEvent, (payload) => {
      const obj = payload && typeof payload === "object" ? payload : {};
      const msgChatId = typeof obj.chatId === "string" ? obj.chatId : null;
      if (!ctrl.isActivityForActiveChat(msgChatId))
        return;
      ctrl.isGenerationStreaming = false;
      if (pendingTagRetry && ctrl.isActivityForActiveChat(pendingTagRetry.chatId)) {
        dispatchTagIntercept(pendingTagRetry);
      }
      if (ctrl.vnStageOpen) {
        ctrl.refreshActiveChat(ctrl.chatId);
      }
      inlineManager.sync((actorId) => openCharacterDossierModal(ctrl, actorId), openStudio);
    }));
  }
  cleanup.push(ctx.events.on("CHARACTER_MESSAGE_RENDERED", (payload) => {
    const obj = payload && typeof payload === "object" ? payload : {};
    const msgChatId = typeof obj.chatId === "string" ? obj.chatId : null;
    if (!ctrl.isActivityForActiveChat(msgChatId) || ctrl.isGenerationStreaming)
      return;
    if (pendingTagRetry && ctrl.isActivityForActiveChat(pendingTagRetry.chatId)) {
      dispatchTagIntercept(pendingTagRetry);
    }
    inlineManager.sync((actorId) => openCharacterDossierModal(ctrl, actorId), openStudio);
  }));
  if (ctx.messages?.registerTagInterceptor) {
    for (const tagName of ["lumi-stats", "lumi_stats", "lumi-tracker", "worldweave", "tracker"]) {
      cleanup.push(ctx.messages.registerTagInterceptor({ tagName, removeFromMessage: true }, (payload) => {
        if (payload.isStreaming)
          return;
        const payloadChatId = payload.chatId || null;
        if (!ctrl.isActivityForActiveChat(payloadChatId))
          return;
        if (!payload.messageId)
          return;
        const content = typeof payload.content === "string" ? payload.content.trim() : "";
        if (!content)
          return;
        const sig = `${payloadChatId ?? ctrl.chatId}:${payload.messageId}:${fnv1a32(content)}`;
        if (seenInterceptSigs.has(sig))
          return;
        dispatchTagIntercept({
          chatId: payloadChatId,
          messageId: payload.messageId,
          content,
          sig,
          attempts: 0
        });
      }));
    }
  }
  renderDrawer(true);
  ctx.ready?.();
  ctrl.refreshActiveChat();
  return () => {
    for (const fn of cleanup.reverse())
      fn();
    ctx.dom.cleanup();
  };
}
function setup(ctx) {
  return mountLumiStats(ctx);
}
export {
  mountLumiStats,
  setup
};
