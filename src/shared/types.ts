export const LUMI_STATS_CHANNEL = 'lumi_stats/v1';
export const LUMI_CHAT_VAR_JSON = 'lumi_stats';
export const LUMI_CHAT_VAR_HEADER = 'lumi_header';
export const LUMI_CHAT_VAR_CLOCK = 'lumi_clock';
export const LUMI_CHAT_VAR_LOCATION = 'lumi_location';

export type StatScope = 'player' | 'character' | 'world' | 'scene';

export type StatValueKind =
  | 'meter'
  | 'number'
  | 'clock'
  | 'pips'
  | 'tier'
  | 'tags'
  | 'text'
  | 'boolean'
  | 'skill_tree'
  | 'xp_level'
  | 'attributes'
  | 'inventory'
  | 'status_fx'
  | 'hearts'
  | 'currency';

export type StatVolatility = 'momentary' | 'progressive' | 'anchor';

export type StatDisplayStyle =
  | 'auto'
  | 'feed_cards'
  | 'step_chain'
  | 'pill_list'
  | 'quote_callout'
  | 'key_value'
  | 'arc_tracker'
  | 'accordion_cards'
  | 'matrix_badges'
  | 'meter_mini_bars'
  | 'stat_pills_grid'
  | 'bullet_ledger'
  | 'timeline_list'
  | 'checklist';

export type StatLayoutSpan = 'auto' | 'half' | 'full';

export interface StatScaleAnchor {
  value: number;
  label: string;
  description: string;
}

export interface StatThresholdAlert {
  value: number;
  direction: 'above' | 'below';
  message: string;
}

export interface StatSurfaceVisibility {
  widget: boolean;
  inline: boolean;
  dossier: boolean;
  pinnedHeader: boolean;
}

/**
 * Universal, zero-hardcoding definition for ANY stat (Player, Character, World, or Scene),
 * including visual presentation style, grid span, surface visibility, and per-surface tab routing.
 */
export interface StatSchemaDef {
  id: string;
  label: string;
  icon: string;
  scope: StatScope;
  kind: StatValueKind;
  min: number;
  max: number;
  step: number;
  defaultValue: number | string | boolean;
  options?: string[];
  anchors: StatScaleAnchor[];
  volatility: StatVolatility;
  triggerCues: string;
  formula?: string;
  color: string;
  enabled: boolean;
  locked: boolean;
  pinnedToHeader: boolean;
  /** Visual rendering mode for custom text, lists, flow chains (`A -> B -> C`), or meters. */
  displayStyle?: StatDisplayStyle;
  /** Grid column span: `'auto'` (full-width when text is long), `'half'` (1 col), or `'full'` (all cols). */
  layoutSpan?: StatLayoutSpan;
  /** Granular visibility across Widget, Inline Ribbon, Character Dossier, and Pinned Header. */
  showIn: StatSurfaceVisibility;
  /** Target tab ID in the Drawer (`stats` | `world` | custom). */
  tabId: string;
  /** Target tab ID in the Floating HUD Widget. */
  widgetTabId: string;
  /** Target tab ID in the Inline Message Ribbon. */
  inlineTabId: string;
  /** Target tab ID in the Character Dossier (`overview` | `bonds` | `loadout` | `secrets` | custom). */
  dossierTabId: string;
  /** Additional Widget tab IDs where this stat should also appear. */
  extraWidgetTabIds?: string[];
  /** Additional Inline Ribbon tab IDs where this stat should also appear. */
  extraInlineTabIds?: string[];
  /** `'ai'` (LLM only), `'ai_plus_local'` (AI initializes/updates + local formula normalizes), or `'local_formula'` (0 extractor tokens). */
  calculationMode?: 'ai' | 'ai_plus_local' | 'local_formula';
  /** Formatted string template for local_formula output, e.g. `"POW {pow} | AGI {agi}"`. */
  formulaOutputTemplate?: string;
  /** `'always'` (default), `'conditional'` (only when keywords/state match), or `'manual'`. */
  promptTriggerMode?: 'always' | 'conditional' | 'manual';
  /** Keywords that activate a `'conditional'` stat's prompt rule when seen in recent turns. */
  promptKeywords?: string[];
  /** Whether to inject this stat into the narrator continuity prompt (default `true`). */
  injectInContinuity?: boolean;
  /** Optional custom category/group ID (`StatCategoryDef.id`). Individual stat rules remain intact. */
  categoryId?: string;
  alerts?: StatThresholdAlert[];
}

export interface StatCategoryDef {
  id: string;
  name: string;
  icon: string;
  color: string;
  enabled: boolean;
  collapsedByDefault?: boolean;
  showGroupHeaderInHud?: boolean;
  promptTriggerMode?: 'always' | 'conditional' | 'manual';
  promptKeywords?: string[];
  /** Shared AI delta/roleplay rule printed once for this category (alongside each stat's own rule). */
  aiRule?: string;
  /** Optional local cross-stat / modifier rule evaluated after turns & edits. */
  localRuleFormula?: string;
  injectInContinuity?: boolean;
  order: number;
}

export type DossierFieldDisplayStyle = 'card' | 'quote' | 'pills' | 'badge';

export interface DossierFieldDef {
  id: string;
  label: string;
  icon: string;
  placeholder: string;
  instruction: string;
  /** Which Dossier tab renders this field (`overview` | `loadout` | custom). */
  tabId: string;
  /** How this field renders inside the Dossier / Cast cards. */
  displayStyle?: DossierFieldDisplayStyle;
  /** Whether to also show this field on compact HUD Cast cards. */
  showInHudCast?: boolean;
  /** Whether to also show this field on Inline Ribbon Cast cards. */
  showInInlineCast?: boolean;
  color?: string;
  layoutSpan?: StatLayoutSpan;
  enabled: boolean;
  locked: boolean;
}

export type BuiltInTrackerId =
  | 'player_attire'
  | 'player_condition'
  | 'player_action'
  | 'scene_summary'
  | 'places'
  | 'quests'
  | 'dispatches'
  | 'npc_conditions'
  | 'npc_secrets';

export interface BuiltInTrackerConfig {
  icon?: string;
  label?: string;
  instruction?: string;
  color?: string;
  displayStyle?: StatDisplayStyle;
  layoutSpan?: StatLayoutSpan;
  widgetTabId?: string;
  inlineTabId?: string;
  pinnedToHeader?: boolean;
  locked?: boolean;
  deleted?: boolean;
}

export interface CoreTrackersConfig {
  trackPlayerAttire: boolean;
  playerAttireLabel: string;
  playerAttireInstruction: string;
  showPlayerAttireCard?: boolean;
  trackPlayerCondition: boolean;
  playerConditionLabel: string;
  playerConditionInstruction?: string;
  showPlayerConditionCard?: boolean;
  trackPlayerAction?: boolean;
  playerActionLabel?: string;
  playerActionInstruction?: string;
  showPlayerActionCard?: boolean;
  trackSceneSummary: boolean;
  sceneSummaryLabel?: string;
  sceneSummaryInstruction?: string;
  showSceneSummaryInWidget?: boolean;
  trackPlaces: boolean;
  placesInstruction?: string;
  trackQuests: boolean;
  questsInstruction?: string;
  showQuestsInWidget?: boolean;
  trackDispatches?: boolean;
  dispatchesInstruction?: string;
  showDispatchesInWidget?: boolean;
  trackNpcConditions?: boolean;
  npcConditionsInstruction?: string;
  trackNpcSecrets?: boolean;
  npcSecretsInstruction?: string;
  sceneLocationInstruction?: string;
  sceneTimeInstruction?: string;
  sceneDateInstruction?: string;
  sceneWeatherInstruction?: string;
  sceneTimeFlowInstruction?: string;
  scenePillLocked?: boolean;
  overrides?: Partial<Record<BuiltInTrackerId, BuiltInTrackerConfig>>;
}

export interface SurfaceTabConfig {
  id: string;
  label: string;
  icon: string;
  kind: 'stats' | 'cast' | 'web' | 'map' | 'world' | 'custom';
  enabled: boolean;
  order: number;
  customHtml?: string;
}

export interface DossierTabConfig {
  id: string;
  label: string;
  icon: string;
  kind: 'overview' | 'bonds' | 'peer_bonds' | 'loadout' | 'secrets' | 'custom';
  enabled: boolean;
  order: number;
  showMeters: boolean;
  showFields: boolean;
  showSecrets: boolean;
  showAudit: boolean;
  showNpcBonds?: boolean;
  customHtml?: string;
}

export type PlacementMode =
  | 'both_bottom'
  | 'both_top'
  | 'inline_bottom'
  | 'inline_top'
  | 'floating_only';

export type PromptInjectionPosition = 'pre_history' | 'in_history' | 'post_history';

export type SurfaceVisualStyle =
  | 'glass'
  | 'soft'
  | 'sleek'
  | 'minimal'
  | 'neon'
  | 'arcane_rpg'
  | 'cyber_hud'
  | 'persona_pop'
  | 'cozy_vn';

export type PillSkinStyle =
  | 'glass_capsule'
  | 'vn_dialogue_bar'
  | 'rpg_status_bar'
  | 'persona_ticker'
  | 'cyber_telemetry'
  | 'minimal_floating'
  | 'neon_edge'
  | 'split_deck'
  | 'compact_badge'
  | 'ledger_strip';

export type SurfaceFrameShape = 'rounded' | 'chamfered' | 'sharp' | 'ornate';
export type SurfaceRadiusPreset = 'sharp' | 'balanced' | 'pill';
export type MeterVisualStyle = 'smooth' | 'segmented' | 'glow';
export type CastLayoutMode = 'roster' | 'cards';

export interface LumiVisualSkinPack {
  schema: 'lumi-stats-skin/v1';
  name: string;
  surfaceStyle: SurfaceVisualStyle;
  pillStyle?: PillSkinStyle;
  frameShape: SurfaceFrameShape;
  meterStyle: MeterVisualStyle;
  accentHue?: number;
  secondaryHue?: number;
  glowIntensity?: number;
  glassBlur?: boolean;
  compact?: boolean;
  castLayout?: CastLayoutMode;
  customCss?: string;
}

export interface TemplateThemeConfig {
  accentHue?: number;
  secondaryHue?: number;
  surfaceStyle?: SurfaceVisualStyle;
  pillStyle?: PillSkinStyle;
  frameShape?: SurfaceFrameShape;
  radiusPreset?: SurfaceRadiusPreset;
  meterStyle?: MeterVisualStyle;
  castLayout?: CastLayoutMode;
  glowIntensity?: number;
  glassBlur?: boolean;
  widgetWidth?: number;
  widgetHeight?: number;
  pillWidth?: number;
  pillHeight?: number;
  dockSize?: number;
  widgetTabsIconOnly?: boolean;
  compact: boolean;
  placement: PlacementMode;
  inlineDefaultExpanded: boolean;
  showSceneChips: {
    time: boolean;
    date: boolean;
    location: boolean;
    weather: boolean;
    cast: boolean;
    pinnedStats: boolean;
  };
  customCss: string;
}

export interface TemplateSurfacesConfig {
  widgetTabs: SurfaceTabConfig[];
  inlineTabs: SurfaceTabConfig[];
  dossierTabs: DossierTabConfig[];
  trackNpcBonds: boolean;
  showRelationshipWeb: boolean;
  customWidgetHtml: string;
  customInlineHtml: string;
  customDossierHtml: string;
}

export interface LumiStatsTemplate {
  schema: 'lumi-stats-template/v1';
  id: string;
  name: string;
  icon: string;
  description: string;
  userSelected?: boolean;
  promptPosition: PromptInjectionPosition;
  promptDepth: number;
  theme: TemplateThemeConfig;
  tabs: SurfaceTabConfig[];
  surfaces: TemplateSurfacesConfig;
  coreTrackers?: CoreTrackersConfig;
  categories?: StatCategoryDef[];
  stats: StatSchemaDef[];
  dossierFields: DossierFieldDef[];
  updatedAt: string;
}

export interface TimedModifier {
  id: string;
  label: string;
  statId: string;
  targetActorId?: string;
  delta: number;
  remainingMinutes?: number;
  remainingTurns?: number;
  source: string;
}

export interface StatAuditEntry {
  id: string;
  statId: string;
  statLabel: string;
  actorId?: string;
  op: 'set' | 'delta' | 'formula' | 'manual';
  before: number | string | boolean | null;
  after: number | string | boolean;
  numericDelta: number;
  reason: string;
  turn: number;
  minute: number;
  at: string;
}

export interface RuntimeStatValue {
  id: string;
  scope: Exclude<StatScope, 'character'>;
  value: number | string | boolean;
  calibrated: boolean;
  locked: boolean;
  lastReason?: string;
}

export interface CharacterRuntimeMeter {
  value: number | string | boolean;
  calibrated: boolean;
  locked: boolean;
  lastReason?: string;
}

export interface CharacterSecretItem {
  id: string;
  title: string;
  detail: string;
  stage: 'rumor' | 'clue' | 'confirmed';
}

export type BondCategory =
  | 'family'
  | 'friend'
  | 'romance'
  | 'rival'
  | 'professional'
  | 'neutral';

export interface RelationLink {
  label: string;
  note?: string;
  category?: BondCategory;
}

export interface NpcBondRecord {
  fromId: string;
  toId: string;
  toName: string;
  label: string;
  attitude: string;
  category?: BondCategory;
  meters: Record<string, number>;
  updatedTurn: number;
}

export type VnWeatherEffect =
  | 'rain'
  | 'heavy_rain'
  | 'snow'
  | 'sakura'
  | 'fog'
  | 'fireflies'
  | 'embers';

export type VnBgTransitionStyle =
  | 'cinematic'
  | 'wipe'
  | 'iris'
  | 'strips'
  | 'black'
  | 'flash';

export type VnShotMode = 'closeup' | 'waist' | 'full' | 'orbit';

export type VnStageSlotName =
  | 'far-left'
  | 'left'
  | 'center'
  | 'right'
  | 'far-right'
  | 'hidden';

export type TtsReadMode =
  | 'dialogue_only'
  | 'narration_and_dialogue'
  | 'narration_only';

export interface CharacterStageRig {
  scale: number;
  offsetX: number;
  offsetY: number;
  flipX: boolean;
  slot?: VnStageSlotName;
  pinnedSlot?: boolean;
}

export interface CharacterTtsProfile {
  connectionId?: string;
  voiceId?: string;
  model?: string;
  speed?: number;
  muted?: boolean;
}

export interface CharacterSpriteVariant {
  id: string;
  label: string;
  emotionTag: string;
  clothesTag: string;
  poseTag: string;
  imageId: string;
  url: string;
  pinned?: boolean;
}

export type LocationTimeSlot =
  | 'default'
  | 'morning'
  | 'day'
  | 'evening'
  | 'night'
  | 'custom';

export interface LocationBackdropVariant {
  id: string;
  timeSlot: LocationTimeSlot;
  customTag: string;
  imageId: string;
  url: string;
  pinned?: boolean;
}

export interface CharacterRecord {
  id: string;
  name: string;
  aliases: string[];
  roleSummary: string;
  present: boolean;
  locationId: string;
  demeanor: string;
  innerThought: string;
  immediateGoal: string;
  attire: string;
  fields: Record<string, string>;
  meters: Record<string, CharacterRuntimeMeter>;
  bondToPlayer?: RelationLink;
  bondFromPlayer?: RelationLink;
  peerBonds: Record<string, NpcBondRecord>;
  conditions: string[];
  secrets: CharacterSecretItem[];
  portraitAssetId?: string;
  portraitUrl?: string;
  expressionAssets: Record<string, { imageId: string; url: string }>;
  spriteVariants?: CharacterSpriteVariant[];
  stageRig?: CharacterStageRig;
  ttsVoice?: CharacterTtsProfile;
  notes: string;
}

export interface PlayerSceneProfile {
  name: string;
  attire: string;
  condition: string;
  notableAction: string;
}

export type MapZoneKind = 'building' | 'district' | 'region' | 'ship_deck' | 'realm';

export type MapPathKind =
  | 'door'
  | 'hallway'
  | 'stairs'
  | 'street'
  | 'trail'
  | 'transit'
  | 'portal';

export interface MapZoneRecord {
  id: string;
  name: string;
  kind: MapZoneKind;
  icon: string;
  color: string;
  description: string;
}

export interface MapPathEdge {
  id: string;
  fromId: string;
  toId: string;
  pathType: MapPathKind;
  label?: string;
  travelMinutes: number;
  locked?: boolean;
}

export interface MapPlaceNode {
  id: string;
  name: string;
  category: 'interior' | 'venue' | 'region';
  zoneId?: string;
  tags?: string[];
  icon: string;
  description: string;
  connectedIds: string[];
  travelMinutes: number;
  visited: boolean;
  atmosphere: string;
  backdropUrl?: string;
  backdropImageId?: string;
  backdropVariants?: LocationBackdropVariant[];
}

export interface QuestObjectiveItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface QuestRecord {
  id: string;
  title: string;
  summary: string;
  status: 'active' | 'completed' | 'failed';
  objectives: QuestObjectiveItem[];
}

export interface OffscreenDispatch {
  id: string;
  turn: number;
  minute: number;
  title: string;
  actorId?: string;
  locationName: string;
  summary: string;
  futureHook: string;
}

export interface CampaignState {
  initialized: boolean;
  title: string;
  canonPremise: string;
  turnCount: number;
  elapsedMinutes: number;
  scene: {
    location: string;
    timeLabel: string;
    dateLabel: string;
    weather: string;
    beatSummary: string;
  };
  player: PlayerSceneProfile;
  currentPlaceId: string;
  stats: Record<string, RuntimeStatValue>;
  modifiers: TimedModifier[];
  characters: Record<string, CharacterRecord>;
  mapZones?: Record<string, MapZoneRecord>;
  places: Record<string, MapPlaceNode>;
  mapPaths?: MapPathEdge[];
  quests: Record<string, QuestRecord>;
  dispatches: OffscreenDispatch[];
  auditLog: StatAuditEntry[];
}

export interface MessageSourceBinding {
  messageId: string;
  swipeId: number;
  contentHash: string;
  messageIndex: number;
}

export interface TurnDeltaMap {
  statDeltas: Record<string, number>;
  characterDeltas: Record<string, Record<string, number>>;
}

export interface CheckpointRecord {
  id: string;
  revision: number;
  at: string;
  reason: string;
  binding?: MessageSourceBinding;
  before: CampaignState;
  after: CampaignState;
  undone?: boolean;
}

export interface CampaignSnapshot {
  schemaVersion: 1;
  chatId: string;
  revision: number;
  state: CampaignState;
  template: LumiStatsTemplate;
  deltas: TurnDeltaMap;
  bindings: MessageSourceBinding[];
  checkpoints: Array<{
    id: string;
    revision: number;
    at: string;
    reason: string;
    messageId?: string;
    swipeId?: number;
  }>;
}

export interface LumiUserSettings {
  autoTrack: boolean;
  extractionMode: 'sidecar' | 'inline_tag';
  injectContinuity: boolean;
  tokenBudget: number;
  protocolVerbosity?: 'compact' | 'standard';
  sidecarHistoryTurns?: number;
  sidecarMaxCharsPerMsg?: number;
  defaultTemplateId: string;
  extractorConnectionId: string;
  extractorModel: string;
  copilotConnectionId: string;
  copilotModel: string;
  cleanBraille: boolean;
  memoryCortexSync: boolean;
  worldInfoGating: boolean;
  thresholdToasts: boolean;
  debugInspector: boolean;
  ttsEnabled?: boolean;
  ttsAutoPlayInStage?: boolean;
  ttsReadMode?: TtsReadMode;
  narratorConnectionId?: string;
  narratorVoiceId?: string;
  narratorModel?: string;
  narratorSpeed?: number;
  vnShotMode?: VnShotMode;
  vnTransitionStyle?: VnBgTransitionStyle;
  vnWeatherOverride?: VnWeatherEffect | 'clear' | '';
  vnParallaxEnabled?: boolean;
  vnAmbientLightEnabled?: boolean;
  vnShowHudWidget?: boolean;
  sensitiveObfuscatorEnabled?: boolean;
  obfuscateVowelsWithOne?: boolean;
  obfuscateOnSend?: boolean;
  obfuscateOnOutput?: boolean;
  restoreObfuscatedOnRender?: boolean;
  includeCipherHint?: boolean;
  sensitiveWords?: string[];
}

export interface StatPatchInput {
  op?: 'set' | 'delta';
  value: number | string | boolean;
  reason?: string;
}

export interface ExtractedTurnPatch {
  scene?: {
    location?: string;
    timeLabel?: string;
    dateLabel?: string;
    weather?: string;
    elapsedMinutes?: number;
    beatSummary?: string;
  };
  player?: {
    attire?: string;
    condition?: string;
    notableAction?: string;
  };
  stats?: Record<string, StatPatchInput | number | string | boolean>;
  characters?: Array<{
    id?: string;
    name: string;
    aliases?: string[];
    roleSummary?: string;
    present?: boolean;
    location?: string;
    demeanor?: string;
    innerThought?: string;
    immediateGoal?: string;
    attire?: string;
    conditions?: string[];
    fields?: Record<string, string>;
    meters?: Record<string, StatPatchInput | number | string | boolean>;
    bondToPlayer?: string | { label: string; note?: string; category?: BondCategory };
    bondFromPlayer?: string | { label: string; note?: string; category?: BondCategory };
    peerBonds?: Array<{
      target: string;
      label?: string;
      attitude?: string;
      note?: string;
      category?: BondCategory;
      affinity?: number | string;
      trust?: number | string;
      tension?: number | string;
      [meterKey: string]: unknown;
    }>;
    secrets?: Array<{
      id?: string;
      title: string;
      detail: string;
      stage?: 'rumor' | 'clue' | 'confirmed';
    }>;
  }>;
  zones?: Array<{
    id?: string;
    name: string;
    kind?: MapZoneKind;
    icon?: string;
    color?: string;
    description?: string;
  }>;
  places?: Array<{
    id?: string;
    name: string;
    category?: 'interior' | 'venue' | 'region';
    zone?: string;
    zoneId?: string;
    tags?: string[];
    icon?: string;
    description?: string;
    connectedNames?: string[];
    travelMinutes?: number;
    atmosphere?: string;
  }>;
  paths?: Array<{
    from: string;
    to: string;
    type?: MapPathKind;
    pathType?: MapPathKind;
    label?: string;
    mins?: number;
    travelMinutes?: number;
    locked?: boolean;
  }>;
  quests?: Array<{
    id?: string;
    title: string;
    summary?: string;
    status?: 'active' | 'completed' | 'failed';
    objectives?: Array<{ text: string; completed?: boolean }>;
  }>;
  dispatches?: Array<{
    title: string;
    actorName?: string;
    locationName?: string;
    summary: string;
    futureHook?: string;
  }>;
}

export interface CopilotTurnRecord {
  role: 'user' | 'assistant';
  text: string;
  at: string;
}

export interface CopilotProposalRecord {
  id: string;
  chatId: string;
  revision: number;
  summaries: string[];
  statePatch?: ExtractedTurnPatch;
  templatePatch?: LumiStatsTemplate;
}

export interface LumiRpcRequest {
  channel: typeof LUMI_STATS_CHANNEL;
  requestId: string;
  chatId: string;
  type: string;
  payload?: Record<string, unknown>;
}

export interface LumiRpcResponse {
  channel: typeof LUMI_STATS_CHANNEL;
  requestId: string;
  chatId: string;
  type: 'rpc_ack';
  ok: boolean;
  error?: string;
  data?: Record<string, unknown>;
}
