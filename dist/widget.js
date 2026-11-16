function wn(t){let n=t.name.trim().slice(0,80)||"Custom Group";return{id:ie(t.id??n,"cat"),name:n,icon:t.icon?.trim().slice(0,8)||"\uD83D\uDCC1",color:t.color?.trim()||"var(--lumiverse-primary)",enabled:t.enabled!==!1,collapsedByDefault:Boolean(t.collapsedByDefault),showGroupHeaderInHud:t.showGroupHeaderInHud!==!1,promptTriggerMode:t.promptTriggerMode==="conditional"||t.promptTriggerMode==="manual"?t.promptTriggerMode:"always",...Array.isArray(t.promptKeywords)&&t.promptKeywords.length?{promptKeywords:[...new Set(t.promptKeywords.map((s)=>String(s).trim().toLowerCase()).filter(Boolean))].slice(0,32)}:{},...t.aiRule?.trim()?{aiRule:t.aiRule.trim()}:{},...t.localRuleFormula?.trim()?{localRuleFormula:t.localRuleFormula.trim()}:{},injectInContinuity:t.injectInContinuity!==!1,order:Number.isFinite(t.order)?Math.round(Number(t.order)):0}}function ie(t,n="stat"){return String(t??"").trim().toLowerCase().replace(/['’]/g,"").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,64)||n}function xa(t,n,a){let s=n-t;if(s<=0)return[{value:t,label:"Baseline",description:"Default baseline"}];let i=(r)=>Math.round(t+s*r);return[{value:i(0.85),label:"Very High / Peak",description:"Dominant, intense, or near maximum capacity"},{value:i(0.65),label:"High / Strong",description:"Clearly elevated, strong, or well-established"},{value:i(0.45),label:"Moderate / Balanced",description:"Standard working baseline or neutral equilibrium"},{value:i(0.2),label:"Low / Guarded",description:"Mild, strained, or subdued"},{value:t,label:"None / Minimal",description:"Absent, calm baseline, or depleted"}]}function re(t){let n=ie(t.id??t.label,"stat"),a=t.scope??"character",s=t.displayStyle??"auto",r=s==="pill_list"?"tags":(s==="feed_cards"||s==="step_chain"||s==="quote_callout"||s==="key_value"||s==="arc_tracker"||s==="accordion_cards"||s==="matrix_badges"||s==="meter_mini_bars"||s==="stat_pills_grid"||s==="bullet_ledger"||s==="timeline_list"||s==="checklist")&&(!t.kind||t.kind==="meter")?"text":t.kind??"meter",d=Number.isFinite(t.min)?Number(t.min):0,o=Number.isFinite(t.max)?Number(t.max):r==="clock"?6:r==="pips"||r==="hearts"?5:r==="attributes"?20:r==="currency"?99999999:100,c=t.volatility??(a==="character"?"progressive":"momentary"),f=Array.isArray(t.anchors)?t.anchors:[],b=a==="character"?"cast":a==="world"?"world":"stats",M=Boolean(t.pinnedToHeader??t.showIn?.pinnedHeader),m={widget:t.showIn?.widget??!0,inline:t.showIn?.inline??!0,dossier:t.showIn?.dossier??a==="character",pinnedHeader:M};return{id:n,label:t.label.trim().slice(0,80)||n,icon:t.icon?.trim().slice(0,8)||"\uD83D\uDCCA",scope:a,kind:r,min:Math.min(d,o),max:Math.max(d,o),step:Number.isFinite(t.step)&&Number(t.step)>0?Number(t.step):1,defaultValue:t.defaultValue!==void 0?t.defaultValue:r==="boolean"?!1:r==="skill_tree"?"SP: 2 | Basic Focus (Lv.1/5, cost:1, +10% efficiency)":r==="xp_level"?"Lv. 1 | 0/100 XP | Rank E":r==="attributes"?"STR:10, DEX:10, CON:10, INT:10, WIS:10, CHA:10":r==="inventory"?"None":r==="status_fx"?"None":r==="text"||r==="tags"||r==="tier"?t.options?.[0]??"None":Math.max(Math.min(d,o),Math.min(Math.max(d,o),0)),...t.options?.length?{options:t.options}:{},anchors:f,volatility:c,triggerCues:t.triggerCues?.trim()??"",...t.formula?.trim()?{formula:t.formula.trim()}:{},color:t.color?.trim()||"var(--lumiverse-primary)",enabled:t.enabled!==!1,locked:Boolean(t.locked),pinnedToHeader:M,displayStyle:t.displayStyle??"auto",layoutSpan:t.layoutSpan??"auto",showIn:m,tabId:t.tabId?.trim()||b,widgetTabId:t.widgetTabId?.trim()||b,inlineTabId:t.inlineTabId?.trim()||b,dossierTabId:t.dossierTabId?.trim()||"bonds",...Array.isArray(t.extraWidgetTabIds)&&t.extraWidgetTabIds.length?{extraWidgetTabIds:[...new Set(t.extraWidgetTabIds.map(String))]}:{},...Array.isArray(t.extraInlineTabIds)&&t.extraInlineTabIds.length?{extraInlineTabIds:[...new Set(t.extraInlineTabIds.map(String))]}:{},calculationMode:t.calculationMode==="local_formula"||t.calculationMode==="ai_plus_local"||t.calculationMode==="ai"?t.calculationMode:Boolean(t.formula?.trim())?"local_formula":"ai",...t.formulaOutputTemplate?.trim()?{formulaOutputTemplate:t.formulaOutputTemplate.trim()}:{},promptTriggerMode:t.promptTriggerMode==="conditional"||t.promptTriggerMode==="manual"?t.promptTriggerMode:"always",...Array.isArray(t.promptKeywords)&&t.promptKeywords.length?{promptKeywords:[...new Set(t.promptKeywords.map((S)=>String(S).trim().toLowerCase()).filter(Boolean))].slice(0,32)}:{},injectInContinuity:t.injectInContinuity!==!1,...t.categoryId?.trim()?{categoryId:t.categoryId.trim()}:{},...t.alerts?.length?{alerts:t.alerts}:{}}}function wa(){return[{id:"stats",label:"You & Scene",icon:"\uD83D\uDCCA",kind:"stats",enabled:!0,order:0},{id:"cast",label:"Cast",icon:"\uD83D\uDC65",kind:"cast",enabled:!0,order:1},{id:"web",label:"Bond Web",icon:"\uD83D\uDD78️",kind:"web",enabled:!0,order:2},{id:"map",label:"Atlas",icon:"\uD83D\uDDFA️",kind:"map",enabled:!0,order:3},{id:"world",label:"World & Clocks",icon:"\uD83C\uDF0D",kind:"world",enabled:!0,order:4}]}function ys(){return[{id:"stats",label:"Stats",icon:"\uD83D\uDCCA",kind:"stats",enabled:!0,order:0},{id:"cast",label:"Cast",icon:"\uD83D\uDC65",kind:"cast",enabled:!0,order:1},{id:"web",label:"Bond Web",icon:"\uD83D\uDD78️",kind:"web",enabled:!0,order:2},{id:"world",label:"World",icon:"\uD83C\uDF0D",kind:"world",enabled:!0,order:3}]}function xs(){return[{id:"overview",label:"Overview",icon:"✨",kind:"overview",enabled:!0,order:0,showMeters:!0,showFields:!0,showSecrets:!1,showAudit:!1,showNpcBonds:!1},{id:"bonds",label:"Player Bonds",icon:"\uD83D\uDC96",kind:"bonds",enabled:!0,order:1,showMeters:!0,showFields:!1,showSecrets:!1,showAudit:!0,showNpcBonds:!1},{id:"peer_bonds",label:"Peer Bonds (NPC↔NPC)",icon:"\uD83E\uDD1D",kind:"peer_bonds",enabled:!0,order:2,showMeters:!1,showFields:!1,showSecrets:!1,showAudit:!1,showNpcBonds:!0},{id:"loadout",label:"Attire & Loadout",icon:"\uD83D\uDC57",kind:"loadout",enabled:!0,order:3,showMeters:!1,showFields:!0,showSecrets:!1,showAudit:!1,showNpcBonds:!1},{id:"secrets",label:"Secrets & Notes",icon:"\uD83D\uDD75️",kind:"secrets",enabled:!0,order:4,showMeters:!1,showFields:!1,showSecrets:!0,showAudit:!1,showNpcBonds:!1}]}function ws(){return{widgetTabs:wa(),inlineTabs:ys(),dossierTabs:xs(),trackNpcBonds:!0,showRelationshipWeb:!0,customWidgetHtml:"",customInlineHtml:"",customDossierHtml:""}}function rt(){return{trackPlayerAttire:!0,playerAttireLabel:"Your Current Attire / Presentation",playerAttireInstruction:"Update whenever the player character changes clothing, state of dress, or physical presentation.",showPlayerAttireCard:!0,trackPlayerCondition:!0,playerConditionLabel:"Physical / Mental Condition",playerConditionInstruction:"Track physical injuries, fatigue, intoxication, disorientation, or mental state.",showPlayerConditionCard:!0,trackPlayerAction:!1,playerActionLabel:"Latest Notable Action",playerActionInstruction:"Summarize the player character’s most consequential current action.",showPlayerActionCard:!0,trackSceneSummary:!0,sceneSummaryLabel:"Scene Beat Summary",sceneSummaryInstruction:"Concise 1-sentence summary of what just happened in the scene.",showSceneSummaryInWidget:!0,trackPlaces:!0,placesInstruction:"Extract new or visited locations into zones[] (building/district), places[] (room/spot with tags & brief note), and paths[].",trackQuests:!0,questsInstruction:"Track active story goals, deadlines, and sub-objectives; mark completed when resolved.",showQuestsInWidget:!0,trackDispatches:!0,dispatchesInstruction:"Log brief off-screen developments or upcoming hooks for characters not currently in the room.",showDispatchesInWidget:!0,trackNpcConditions:!0,npcConditionsInstruction:"Track short status tags on NPCs (e.g. Flustered, Armed, Injured, Hurried).",trackNpcSecrets:!0,npcSecretsInstruction:"Record discovered clues, hidden motives, or confirmed secrets per NPC.",sceneLocationInstruction:'Current specific spot and broader area formatted cleanly as "Specific Room/Spot, District/Building".',sceneTimeInstruction:'Current in-story clock time (e.g. "08:15 AM" or story-appropriate time-of-day).',sceneDateInstruction:'Current in-story date, day count, or era label (e.g. "Day 1" or "Oct 14, 2002").',sceneWeatherInstruction:'Concise weather and immediate atmosphere (e.g. "Clear", "Light Rain", "Tense Indoors").',sceneTimeFlowInstruction:'Estimate elapsed minutes ("mins") realistically for the actions in this beat.',scenePillLocked:!1,overrides:{}}}function ot(){return[{id:"role_summary",label:"Role & Bond to Player",icon:"\uD83E\uDEAA",placeholder:"e.g. Loyal personal maid, Childhood rival…",instruction:"Concise role and established relationship to the player.",tabId:"overview",displayStyle:"badge",showInHudCast:!1,showInInlineCast:!1,enabled:!0,locked:!1},{id:"demeanor",label:"Current Demeanor & Mood",icon:"\uD83C\uDFAD",placeholder:"e.g. Flustered, Guarded, Warm…",instruction:"Current emotional demeanor and facial expression in the scene.",tabId:"overview",displayStyle:"badge",showInHudCast:!0,showInInlineCast:!1,enabled:!0,locked:!1},{id:"inner_thought",label:"Inner Monologue",icon:"\uD83D\uDCAD",placeholder:"Unspoken internal thought in this moment…",instruction:"Short first-person unspoken thought or internal reaction to the current beat.",tabId:"overview",displayStyle:"quote",showInHudCast:!0,showInInlineCast:!0,enabled:!0,locked:!1},{id:"immediate_goal",label:"Immediate Goal",icon:"\uD83C\uDFAF",placeholder:"What this character is trying to do right now…",instruction:"Immediate objective or intention in the current scene.",tabId:"overview",displayStyle:"card",showInHudCast:!1,showInInlineCast:!1,enabled:!0,locked:!1},{id:"attire_layers",label:"Current Outfit & Presentation",icon:"\uD83D\uDC57",placeholder:"Observed clothing & state of dress",instruction:"Update whenever clothing, state of undress, or physical presentation is described or changed.",tabId:"loadout",displayStyle:"card",showInHudCast:!0,showInInlineCast:!0,enabled:!0,locked:!1},{id:"carried_items",label:"Carried Items & Props",icon:"\uD83C\uDF92",placeholder:"Items in hand or on person",instruction:"Track notable items, tools, or gifts currently held or worn.",tabId:"loadout",displayStyle:"pills",showInHudCast:!1,showInInlineCast:!1,enabled:!0,locked:!1},{id:"bond_dynamic",label:"Relationship Dynamic",icon:"\uD83D\uDD17",placeholder:"Established dynamic with player",instruction:"Summarize the current interpersonal dynamic and power balance with the player.",tabId:"overview",displayStyle:"card",showInHudCast:!1,showInInlineCast:!1,enabled:!0,locked:!1}]}function ke(){return{schema:"lumi-stats-template/v1",id:"universal_companion",name:"Universal Roleplay Companion",icon:"✨",description:"Schema-driven roleplay stats with two-phase calibration for relationships, momentary situational reactions, and world progression.",promptPosition:"post_history",promptDepth:1,theme:{surfaceStyle:"glass",pillStyle:"glass_capsule",frameShape:"rounded",radiusPreset:"balanced",meterStyle:"smooth",castLayout:"roster",glowIntensity:55,glassBlur:!0,widgetWidth:460,widgetHeight:540,pillWidth:420,pillHeight:92,widgetTabsIconOnly:!1,compact:!1,placement:"both_bottom",inlineDefaultExpanded:!1,showSceneChips:{time:!0,date:!0,location:!0,weather:!0,cast:!0,pinnedStats:!0},customCss:""},tabs:wa(),surfaces:ws(),coreTrackers:rt(),categories:[],stats:[re({id:"composure",label:"Composure",icon:"\uD83E\uDDED",scope:"player",kind:"meter",min:0,max:100,defaultValue:85,volatility:"momentary",pinnedToHeader:!0,triggerCues:"85=poised, 55=masking, 30=flustered, 0=shaken; drops on teasing, undress, or pressure.",anchors:[{value:80,label:"Poised & Collected",description:"Calm, confident, and in control"},{value:55,label:"Steady / Masking",description:"Holding it together despite pressure"},{value:30,label:"Flustered / Rattled",description:"Caught off-guard, blushing, or defensive"},{value:0,label:"Shaken / Overwhelmed",description:"Completely flustered or panicking"}]}),re({id:"trust",label:"Trust",icon:"\uD83D\uDEE1️",scope:"character",kind:"meter",min:0,max:100,defaultValue:45,volatility:"progressive",pinnedToHeader:!0,dossierTabId:"bonds",triggerCues:"Calibrate: hostile=15, stranger=45, ally/family=70, confidant=90; shift on honesty/betrayal.",anchors:[{value:85,label:"Trusted Confidant",description:"Unconditional trust and deep confidence"},{value:65,label:"Open & Relying",description:"Clear trust, family familiarity, or proven ally"},{value:40,label:"Neutral / Polite",description:"Standard baseline for unproven acquaintances"},{value:20,label:"Guarded / Wary",description:"Skeptical, cautious, or holding back"},{value:0,label:"Deeply Distrustful",description:"Expects betrayal or actively hostile"}]}),re({id:"loyalty",label:"Loyalty & Devotion",icon:"⚜️",scope:"character",kind:"meter",min:0,max:100,defaultValue:50,volatility:"anchor",dossierTabId:"bonds",triggerCues:"Calibrate: rival=10, peer=45, family=75, sworn retainer/partner=90; shift on oaths/betrayal.",anchors:[{value:85,label:"Fiercely Loyal",description:"Devoted retainer, sworn protector, or deeply committed partner"},{value:65,label:"Dependable Ally",description:"Supportive family member, friend, or companion"},{value:40,label:"Cooperative",description:"Neutral or professional alignment"},{value:15,label:"Self-Interested",description:"Prioritizes own agenda; easily swayed"},{value:0,label:"Unbound / Opposed",description:"No allegiance or actively opposed"}]}),re({id:"affection",label:"Affection & Fondness",icon:"❤️",scope:"character",kind:"meter",min:0,max:100,defaultValue:45,volatility:"progressive",dossierTabId:"bonds",triggerCues:"Calibrate: cold=15, polite=45, fond friend/family=70, loving=90; shift with warmth/coldness.",anchors:[{value:85,label:"Deeply Devoted",description:"Profound love, adoration, or attachment"},{value:65,label:"Warm & Fond",description:"Genuine care, closeness, and affection"},{value:40,label:"Friendly / Neutral",description:"Amiable or neutral baseline"},{value:20,label:"Cold / Distant",description:"Aloof, irritated, or emotionally detached"},{value:0,label:"Averse / Hostile",description:"Dislike, bitterness, or rejection"}]}),re({id:"desire",label:"Desire & Attraction",icon:"\uD83D\uDD25",scope:"character",kind:"meter",min:0,max:100,defaultValue:0,volatility:"momentary",dossierTabId:"bonds",triggerCues:"0=platonic, 30=sparked, 60=intense, 85=consuming; spikes on allure, undress, touch, flirting.",anchors:[{value:80,label:"Consuming",description:"Overwhelming attraction or longing in the scene"},{value:55,label:"Intense",description:"Strong visible attraction, flustered gaze, or magnetic pull"},{value:25,label:"Sparked / Noticeable",description:"Caught off-guard by appearance, proximity, or suggestive beat"},{value:0,label:"Platonic / Dormant",description:"No active romantic or physical tension"}]}),re({id:"arousal",label:"Arousal & Fluster",icon:"\uD83D\uDC93",scope:"character",kind:"meter",min:0,max:100,defaultValue:0,volatility:"momentary",dossierTabId:"bonds",triggerCues:"0=calm, 25=blushing, 55=heated, 85=breathless; spikes on nudity/towel, skin contact, intimacy.",anchors:[{value:80,label:"Breathless / Peak",description:"Heavily aroused or physically overwhelmed"},{value:50,label:"Heated / Flushed",description:"Visibly flustered, racing pulse, or strong physical reaction"},{value:20,label:"Stirred / Blushing",description:"Initial spike from suggestive visual cue, towel, or close contact"},{value:0,label:"Composed",description:"Calm physiological state"}]}),re({id:"world_tension",label:"Scene Tension Clock",icon:"⏱️",scope:"world",kind:"clock",min:0,max:6,defaultValue:0,volatility:"progressive",widgetTabId:"world",inlineTabId:"world",triggerCues:"+1 when suspense, danger, or complications escalate; reduce when resolved."})],dossierFields:ot(),updatedAt:new Date().toISOString()}}var Sa=[ke(),{...ke(),id:"romance_slice_of_life",name:"Romance, Chemistry & Wardrobe",icon:"\uD83C\uDF38",description:"Focused on interpersonal chemistry, momentary blush/fluster, desire, devotion, and detailed outfit layers.",theme:{...ke().theme,surfaceStyle:"cozy_vn",pillStyle:"vn_dialogue_bar",accentHue:330,secondaryHue:200},stats:[...ke().stats.filter((t)=>t.id!=="world_tension"),re({id:"chemistry",label:"Spark & Chemistry",icon:"✨",scope:"character",kind:"meter",min:0,max:100,defaultValue:35,color:"#f472b6",volatility:"momentary",pinnedToHeader:!0,dossierTabId:"bonds",triggerCues:"0–100 scale. Rises on playful banter, shared silences, eye contact, and romantic tension; cools on awkwardness."}),re({id:"intimacy_stage",label:"Romantic Tension Clock",icon:"\uD83D\uDC97",scope:"scene",kind:"clock",min:0,max:6,defaultValue:0,color:"#f472b6",volatility:"momentary",widgetTabId:"stats",inlineTabId:"stats",triggerCues:"0–6 segments. Advances as physical proximity, vulnerability, or romantic confession builds in the scene."})]},{...ke(),id:"tactical_adventure",name:"Adventure, Party & World Clocks",icon:"⚔️",description:"Vitality, Resolve, Party Loyalty, Trust, and World Threat Clocks for fantasy or sci-fi campaigns.",stats:[re({id:"vitality",label:"Vitality",icon:"❤️",scope:"player",kind:"meter",min:0,max:100,defaultValue:100,volatility:"momentary",pinnedToHeader:!0,triggerCues:"Drops on injuries, exhaustion, or hazards; restores with medical care or rest."}),re({id:"resolve",label:"Resolve & Energy",icon:"⚡",scope:"player",kind:"meter",min:0,max:100,defaultValue:100,volatility:"momentary",pinnedToHeader:!0,triggerCues:"Spent on strenuous feats, spells, or high-stress confrontations; recovered on rest."}),...ke().stats.filter((t)=>t.scope!=="player")]},{...ke(),id:"mystery_thriller",name:"Investigation & Suspicion Ledger",icon:"\uD83D\uDD75️",description:"Tracks Case Progress, Suspect Alertness, Credibility, Pressure, and discovered clues.",stats:[re({id:"case_progress",label:"Investigation Progress",icon:"\uD83D\uDD0E",scope:"player",kind:"meter",min:0,max:100,defaultValue:0,volatility:"progressive",pinnedToHeader:!0,triggerCues:"Increases as physical clues, motives, and alibi contradictions are uncovered."}),re({id:"suspicion",label:"Suspicion & Guilt",icon:"\uD83D\uDC41️",scope:"character",kind:"meter",min:0,max:100,defaultValue:15,volatility:"progressive",pinnedToHeader:!0,triggerCues:"Calibrate from initial evidence; increase on lies, evasions, or incriminating discoveries."}),re({id:"pressure",label:"Interrogation Pressure",icon:"\uD83D\uDCA2",scope:"character",kind:"clock",min:0,max:6,defaultValue:0,volatility:"momentary",triggerCues:"Advance when cornered with evidence or tough questioning; drops when given breathing room."}),re({id:"alert_clock",label:"Danger / Alert Clock",icon:"\uD83D\uDEA8",scope:"world",kind:"clock",min:0,max:6,defaultValue:0,volatility:"momentary",pinnedToHeader:!0,widgetTabId:"world",inlineTabId:"world",triggerCues:"Advances by +1 when making noise, tipping off suspects, or triggering alarms."})]},{...ke(),id:"litrpg_skill_tree",name:"LitRPG System, Skill Trees & Gear",icon:"⚔️",description:"Full game HUD with HP/MP, XP & Leveling, Skill Points & Interactive Skill Tree, Core Attributes, Buffs/Debuffs, and Rarity Gear.",theme:{...ke().theme,surfaceStyle:"arcane_rpg",frameShape:"ornate",meterStyle:"glow",accentHue:42,secondaryHue:198},stats:[re({id:"hp",label:"Health (HP)",icon:"❤️",scope:"player",kind:"meter",min:0,max:100,defaultValue:100,color:"#f43f5e",volatility:"momentary",pinnedToHeader:!0,triggerCues:"Drops on damage, traps, or exhaustion; recovers via healing, potions, or rest."}),re({id:"mp",label:"Mana / Stamina",icon:"\uD83D\uDCA0",scope:"player",kind:"meter",min:0,max:100,defaultValue:100,color:"#38bdf8",volatility:"momentary",pinnedToHeader:!0,triggerCues:"Spent when casting spells or using active skills; regenerates during recovery."}),re({id:"xp_level",label:"Level & XP",icon:"⭐",scope:"player",kind:"xp_level",defaultValue:"Lv. 1 | 0/100 XP | Rank E",color:"#f59e0b",volatility:"progressive",triggerCues:'Format: "Lv. N | cur/next XP | Rank X". Award XP on victories, discoveries, and milestones; level up when cur >= next.'}),re({id:"gold",label:"Gold Coins",icon:"\uD83E\uDE99",scope:"player",kind:"currency",min:0,max:99999999,defaultValue:100,color:"#f59e0b",volatility:"progressive",triggerCues:"Track player currency/gold. Adjust via +N / -N on purchases, rewards, or loot."}),re({id:"attributes",label:"Core Attributes",icon:"\uD83E\uDDEC",scope:"player",kind:"attributes",min:1,max:30,defaultValue:"STR:10, DEX:10, CON:10, INT:10, WIS:10, CHA:10",color:"#818cf8",layoutSpan:"full",volatility:"anchor",triggerCues:'Comma-separated stats: "STR:N, DEX:N, CON:N, INT:N, WIS:N, CHA:N". Update when training or leveling.'}),re({id:"skill_tree",label:"Skill Tree & SP",icon:"\uD83C\uDF33",scope:"player",kind:"skill_tree",defaultValue:"SP: 2 | Combat Sense (Lv.1/5, cost:1, +10% Eva) ; Arcane Spark (Lv.0/5, cost:1, req:Combat Sense)",color:"#10b981",layoutSpan:"full",volatility:"progressive",triggerCues:'Format: "SP: N | Skill A (Lv.X/Y, cost:1, bonus) ; Skill B (Lv.X/Y, cost:1, req:Skill A)". Grant SP on level-ups or breakthroughs.'}),re({id:"status_fx",label:"Buffs & Debuffs",icon:"⚡",scope:"player",kind:"status_fx",defaultValue:"None",color:"#2dd4bf",layoutSpan:"full",volatility:"momentary",triggerCues:'Prefix buffs with "+" and debuffs with "-" separated by "; ", e.g. "+Barrier (3t) ; -Bleeding (2t)".'}),re({id:"inventory",label:"Gear & Inventory",icon:"\uD83C\uDF92",scope:"player",kind:"inventory",defaultValue:"Traveler Blade [common, equipped] ; Ration x2 [common]",color:"#a78bfa",layoutSpan:"full",volatility:"progressive",triggerCues:'List items separated by "; " with qty & rarity tags, e.g. "Runed Dagger [rare, equipped] ; Potion x3 [common]".'}),...ke().stats.filter((t)=>t.scope==="character"||t.scope==="world")]},{...ke(),id:"persona_social_sim",name:"Stylish Social Sim & Confidants",icon:"\uD83C\uDCCF",description:"High-contrast social sim HUD with Confidant Heart ranks, Social Stats (Charm/Courage/Knowledge), and stylish badges.",theme:{...ke().theme,surfaceStyle:"persona_pop",frameShape:"sharp",meterStyle:"segmented",accentHue:348,secondaryHue:45},stats:[re({id:"social_stats",label:"Social Qualities",icon:"⭐",scope:"player",kind:"attributes",min:1,max:10,defaultValue:"Knowledge:2, Charm:2, Courage:2, Kindness:2, Proficiency:2",color:"#f43f5e",layoutSpan:"full",volatility:"progressive",triggerCues:'Comma-separated 1–10 qualities: "Knowledge:N, Charm:N, Courage:N, Kindness:N, Proficiency:N".'}),re({id:"composure",label:"Cool / Composure",icon:"\uD83C\uDFAD",scope:"player",kind:"meter",min:0,max:100,defaultValue:85,color:"#facc15",volatility:"momentary",pinnedToHeader:!0,triggerCues:"85=stylish, 55=steady, 30=rattled, 0=flustered."}),re({id:"bond_hearts",label:"Confidant Bond Rank",icon:"❤️",scope:"character",kind:"hearts",min:0,max:10,defaultValue:3,color:"#f472b6",volatility:"progressive",pinnedToHeader:!0,triggerCues:"0–10 heart rank. Increases on meaningful hangouts, honesty, or breakthroughs."}),...ke().stats.filter((t)=>t.scope==="character"||t.scope==="world")]}],zt=[{schema:"lumi-stats-skin/v1",name:"Adaptive Lumiverse Glass",surfaceStyle:"glass",frameShape:"rounded",meterStyle:"smooth",glowIntensity:45,glassBlur:!0,castLayout:"roster"},{schema:"lumi-stats-skin/v1",name:"Arcane Fantasy RPG",surfaceStyle:"arcane_rpg",frameShape:"ornate",meterStyle:"glow",accentHue:42,secondaryHue:198,glowIntensity:70,glassBlur:!0,castLayout:"roster"},{schema:"lumi-stats-skin/v1",name:"Cyber Tactical HUD",surfaceStyle:"cyber_hud",frameShape:"chamfered",meterStyle:"segmented",accentHue:190,secondaryHue:315,glowIntensity:85,glassBlur:!0,castLayout:"roster"},{schema:"lumi-stats-skin/v1",name:"Stylish Social Sim (Pop)",surfaceStyle:"persona_pop",frameShape:"sharp",meterStyle:"segmented",accentHue:348,secondaryHue:48,glowIntensity:60,glassBlur:!1,castLayout:"roster"},{schema:"lumi-stats-skin/v1",name:"Cozy Visual Novel",surfaceStyle:"cozy_vn",frameShape:"rounded",meterStyle:"smooth",accentHue:330,secondaryHue:200,glowIntensity:40,glassBlur:!0,castLayout:"roster"}];function ka(t){return{schema:"lumi-stats-skin/v1",name:`${t.name} Skin`,surfaceStyle:t.theme.surfaceStyle??"glass",frameShape:t.theme.frameShape??(t.theme.radiusPreset==="sharp"?"sharp":"rounded"),meterStyle:t.theme.meterStyle??"smooth",...t.theme.accentHue!==void 0?{accentHue:t.theme.accentHue}:{},...t.theme.secondaryHue!==void 0?{secondaryHue:t.theme.secondaryHue}:{},glowIntensity:t.theme.glowIntensity??55,glassBlur:t.theme.glassBlur!==!1,compact:Boolean(t.theme.compact),castLayout:t.theme.castLayout??"roster",...t.theme.customCss?{customCss:t.theme.customCss}:{}}}function Ca(t){let n=t&&typeof t==="object"?t:{},s=new Set(["glass","soft","sleek","minimal","neon","arcane_rpg","cyber_hud","persona_pop","cozy_vn"]).has(String(n.surfaceStyle))?n.surfaceStyle:"glass",i=n.frameShape==="chamfered"||n.frameShape==="sharp"||n.frameShape==="ornate"?n.frameShape:"rounded",r=n.meterStyle==="segmented"||n.meterStyle==="glow"?n.meterStyle:"smooth",d=n.castLayout==="cards"?"cards":"roster",o=typeof n.accentHue==="number"&&Number.isFinite(n.accentHue)?Math.max(0,Math.min(360,Math.round(n.accentHue))):void 0,c=typeof n.secondaryHue==="number"&&Number.isFinite(n.secondaryHue)?Math.max(0,Math.min(360,Math.round(n.secondaryHue))):void 0,f=typeof n.glowIntensity==="number"&&Number.isFinite(n.glowIntensity)?Math.max(0,Math.min(100,Math.round(n.glowIntensity))):55;return{schema:"lumi-stats-skin/v1",name:String(n.name??"Imported Skin").trim().slice(0,80)||"Imported Skin",surfaceStyle:s,frameShape:i,meterStyle:r,...o!==void 0?{accentHue:o}:{},...c!==void 0?{secondaryHue:c}:{},glowIntensity:f,glassBlur:n.glassBlur!==!1,compact:Boolean(n.compact),castLayout:d,...typeof n.customCss==="string"&&n.customCss.trim()?{customCss:n.customCss.slice(0,8000)}:{}}}function Ta(t){let n={};for(let a of t.stats){if(!a.enabled||a.scope==="character")continue;n[a.id]={id:a.id,scope:a.scope,value:a.defaultValue,calibrated:!1,locked:a.locked}}return{initialized:!1,title:"Uncharted Story",canonPremise:"",turnCount:0,elapsedMinutes:0,scene:{location:"",timeLabel:"08:00 AM",dateLabel:"Day 1",weather:"Clear",beatSummary:""},player:{name:"",attire:"",condition:"Normal",notableAction:""},currentPlaceId:"",stats:n,modifiers:[],characters:{},mapZones:{},places:{},mapPaths:[],quests:{},dispatches:[],auditLog:[]}}var Sn="lumi_stats/v1";var Ss={sync:'<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.85 1 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z"/>',trash:'<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',copy:'<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',chevronDown:'<path d="m6 9 6 6 6-6"/>',chevronUp:'<path d="m18 15-6-6-6 6"/>',more:'<circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/><circle cx="5" cy="12" r="1.2"/>',plus:'<path d="M12 5v14"/><path d="M5 12h14"/>',pin:'<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1Z"/>',lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',unlock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',sliders:'<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',stage:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m10 9 5 3-5 3Z"/>',stats:'<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',network:'<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M10.8 7.2 6.2 16.8"/><path d="m13.2 7.2 4.6 9.6"/><path d="M7.5 19h9"/>',map:'<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>',globe:'<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"/>',eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',eyeOff:'<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>',check:'<polyline points="20 6 9 17 4 12"/>',close:'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',volume:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',flask:'<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',resize:'<path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/>',palette:'<circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2Z"/>',sparkles:'<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>'};function kn(t,n=14){let s=document.createElementNS("http://www.w3.org/2000/svg","svg");return s.setAttribute("viewBox","0 0 24 24"),s.setAttribute("width",String(n)),s.setAttribute("height",String(n)),s.setAttribute("fill","none"),s.setAttribute("stroke","currentColor"),s.setAttribute("stroke-width","1.9"),s.setAttribute("stroke-linecap","round"),s.setAttribute("stroke-linejoin","round"),s.setAttribute("aria-hidden","true"),s.classList.add("ls-svg-icon"),s.innerHTML=Ss[t],s}var Cn=/(<(?:lumi-stats|lumi-tracker|worldweave|json|style|script|pre|code)\b[\s\S]*?<\/(?:lumi-stats|lumi-tracker|worldweave|json|style|script|pre|code)\s*>|```[\s\S]*?```)/gi;function Ia(t){let n=2166136261;for(let a=0;a<t.length;a++)n^=t.charCodeAt(a),n=Math.imul(n,16777619);return(n>>>0).toString(36)}function jt(t){if(!t||typeof t!=="string")return"";let n=(a)=>{let s=a;return s=s.replace(/[\u2800\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g," "),s=s.replace(/[\u180E\u200B-\u200D\u2060\uFEFF]/g,""),s=s.replace(/^[ \t]+(\*[^\s*]|-[^\s\-]|[^\s\-*#+>0-9`~])/gm,"$1"),s=s.replace(/^[ \t]{4,}(?=[-*+]\s|\d+\.\s|>)/gm,"  "),s=s.replace(/[ \t]+\n/g,`
`),s=s.replace(/([^\n \t])[ \t]{2,}([^\n \t])/g,"$1 $2"),s=s.replace(/\n{3,}/g,`

`),s};return t.split(Cn).map((a,s)=>s%2===1?a:n(a)).join("")}function Ma(t){return t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function kt(t){if(!Array.isArray(t))return[];let n=new Set;for(let a of t){let s=String(a??"").trim().toLowerCase();if(s.length>=2&&s.length<=64)n.add(s)}return[...n].sort((a,s)=>s.length-a.length)}function Tn(t,n=!0){let a=n?"1":"*";return t.replace(/[aeiouAEIOU]/g,a)}function $a(t,n,a=!0){if(!t||typeof t!=="string")return"";let s=kt(n);if(!s.length)return t;let i=new RegExp(`(?<![\\p{L}\\p{N}_])(?:${s.map(Ma).join("|")})(?![\\p{L}\\p{N}_])`,"giu");return t.split(Cn).map((r,d)=>d%2===1?r:r.replace(i,(o)=>Tn(o,a))).join("")}function ks(t,n=!0){let a=String(t??"").trim().toLowerCase();if(a.length<2||!/[aeiou]/i.test(a))return null;let s=[...a],i=s.map((b)=>{if(/[aeiou]/i.test(b))return`[${b}${b.toUpperCase()}1*]`;if(/[a-z]/i.test(b))return`[${b}${b.toUpperCase()}]`;return Ma(b)}),r=s[0],d=/[a-z]/i.test(r)&&!/[aeiou]/i.test(r);if(d)i[0]=`([${r}${r.toUpperCase()}])`;let c=`(?=[\\p{L}\\p{N}*'\\- ]{0,${Math.max(0,s.length-1)}}[1*])`,f=s.length>=4?"(?=[a-zA-Z]{0,10}(?![\\p{L}\\p{N}_]))":"(?![\\p{L}\\p{N}_])";return{word:a,findRegex:`(?<![\\p{L}\\p{N}_])${c}${i.join("")}${f}`,replaceString:d?`$1${a.slice(1)}`:a,flags:d?"gu":"giu"}}function In(t,n,a=!0){if(!t||typeof t!=="string")return"";let s=kt(n);if(!s.length)return t;let i=s.map((d)=>{let o=ks(d,a);if(!o)return null;try{return{word:o.word,regex:new RegExp(o.findRegex,o.flags)}}catch{return null}}).filter((d)=>Boolean(d));if(!i.length)return t;let r=(d,o)=>{let c=d.replace(/[^a-zA-Z]/g,"");if(c.length>1&&c===c.toUpperCase())return o.toUpperCase();if(d[0]&&d[0]===d[0].toUpperCase()&&d[0]!==d[0].toLowerCase())return o.charAt(0).toUpperCase()+o.slice(1);return o};return t.split(Cn).map((d,o)=>{if(o%2===1)return d;let c=d;for(let f of i)c=c.replace(f.regex,(b)=>r(b,f.word));return c}).join("")}var Cs="lumi_stats_tts_cache_v1",it="clips",Ts=60,Is=80;class Mn{connectionsCache=null;voicesByConnId=new Map;memUrlCache=new Map;inFlightSynth=new Map;dbPromise=null;activeAudio=null;playToken=0;isPlaying=!1;activeSpeakerLabel="";cacheHitCount=0;openDb(){if(this.dbPromise)return this.dbPromise;if(typeof indexedDB>"u")return Promise.resolve(null);return this.dbPromise=new Promise((t)=>{try{let n=indexedDB.open(Cs,1);n.onupgradeneeded=()=>{let a=n.result;if(!a.objectStoreNames.contains(it))a.createObjectStore(it,{keyPath:"key"})},n.onsuccess=()=>t(n.result),n.onerror=()=>t(null)}catch{t(null)}}),this.dbPromise}async listConnections(t=!1){if(this.connectionsCache&&!t)return this.connectionsCache;try{let n=await fetch("/api/v1/tts-connections?limit=25",{credentials:"include"});if(!n.ok)return this.connectionsCache??[];let a=await n.json(),s=Array.isArray(a?.data)?a.data:[];return this.connectionsCache=s.map((i)=>({id:String(i.id??""),name:String(i.name??"TTS Connection"),provider:String(i.provider??""),model:String(i.model??""),voice:String(i.voice??""),is_default:Boolean(i.is_default)})),this.connectionsCache}catch{return this.connectionsCache??[]}}async listVoicesForConnection(t){if(!t)return[];let n=this.voicesByConnId.get(t);if(n)return n;try{let a=await fetch(`/api/v1/tts-connections/${encodeURIComponent(t)}/voices`,{credentials:"include"});if(!a.ok)return[];let s=await a.json(),r=(Array.isArray(s?.voices)?s.voices:Array.isArray(s?.data)?s.data:Array.isArray(s)?s:[]).map((d)=>({id:String(d.id??d.voice_id??d.name??""),name:String(d.name??d.label??d.id??""),...typeof d.gender==="string"?{gender:d.gender}:{}})).filter((d)=>Boolean(d.id));return this.voicesByConnId.set(t,r),r}catch{return[]}}rememberMemUrl(t,n){let a=this.memUrlCache.get(t);if(a&&a!==n&&a.startsWith("blob:"))try{URL.revokeObjectURL(a)}catch{}this.memUrlCache.delete(t);while(this.memUrlCache.size>=Ts){let s=this.memUrlCache.keys().next().value;if(!s)break;let i=this.memUrlCache.get(s);if(i?.startsWith("blob:"))try{URL.revokeObjectURL(i)}catch{}this.memUrlCache.delete(s)}this.memUrlCache.set(t,n)}async readFromIdbCache(t){let n=await this.openDb();if(!n)return null;return new Promise((a)=>{try{let i=n.transaction(it,"readonly").objectStore(it).get(t);i.onsuccess=()=>{let r=i.result;a(r?.blob instanceof Blob?r.blob:null)},i.onerror=()=>a(null)}catch{a(null)}})}async writeToIdbCache(t,n){let a=await this.openDb();if(!a)return;await new Promise((s)=>{try{let i=a.transaction(it,"readwrite"),r=i.objectStore(it);r.put({key:t,blob:n,updatedAt:Date.now()});let d=r.count();d.onsuccess=()=>{if(d.result>Is){let o=r.openCursor();o.onsuccess=()=>{let c=o.result;if(c)c.delete()}}},i.oncomplete=()=>s(),i.onerror=()=>s()}catch{s()}})}async synthesizeSegmentCached(t){let n=await this.listConnections(),a=(t.connectionId?n.find((M)=>M.id===t.connectionId):void 0)??n.find((M)=>M.is_default)??n[0];if(!a?.id)return null;let s=a.id,i=t.model||a.model||"",r=t.voiceId||a.voice||"",d=t.text.trim();if(!d)return null;let o=`tts_${Ia(`${s}|${i}|${r}|${d.toLowerCase()}`)}`,c=this.memUrlCache.get(o);if(c)return this.cacheHitCount++,this.rememberMemUrl(o,c),c;let f=this.inFlightSynth.get(o);if(f)return f;let b=(async()=>{let M=await this.readFromIdbCache(o);if(M){this.cacheHitCount++;let m=URL.createObjectURL(M);return this.rememberMemUrl(o,m),m}try{let m=await fetch("/api/v1/tts/synthesize",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({connectionId:s,...i?{model:i}:{},...r?{voice:r}:{},text:d,outputFormat:"mp3"})});if(!m.ok)return null;let S=await m.blob();if(!S.size)return null;this.writeToIdbCache(o,S);let L=URL.createObjectURL(S);return this.rememberMemUrl(o,L),L}catch{return null}})();this.inFlightSynth.set(o,b);try{return await b}finally{if(this.inFlightSynth.get(o)===b)this.inFlightSynth.delete(o)}}prefetchSegments(t){for(let n of t.slice(0,3))this.synthesizeSegmentCached(n)}stop(){if(this.playToken++,this.activeAudio){try{this.activeAudio.pause(),this.activeAudio.removeAttribute("src")}catch{}this.activeAudio=null}this.isPlaying=!1,this.activeSpeakerLabel=""}async playSegments(t,n){if(this.stop(),!t.length)return n?.(),!1;let a=++this.playToken;this.isPlaying=!0,n?.();let s=t.map((i)=>this.synthesizeSegmentCached(i));for(let i=0;i<t.length;i++){if(this.playToken!==a)return!1;let r=t[i],d=await s[i];if(!d||this.playToken!==a)continue;this.activeSpeakerLabel=r.speakerName,n?.(),await new Promise((o)=>{if(this.playToken!==a){o();return}let c=new Audio(d);c.playbackRate=Math.max(0.5,Math.min(2,r.speed||1)),this.activeAudio=c,c.onended=()=>o(),c.onerror=()=>o(),c.play().catch(()=>o())})}if(this.playToken===a)return this.isPlaying=!1,this.activeSpeakerLabel="",this.activeAudio=null,n?.(),!0;return!1}destroy(){this.stop();for(let t of this.memUrlCache.values())if(t.startsWith("blob:"))try{URL.revokeObjectURL(t)}catch{}this.memUrlCache.clear(),this.inFlightSynth.clear()}}var La=`
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
`;function e(t,n="",a){let s=document.createElement(t);if(n)s.className=n;if(a!==void 0)s.textContent=a;return s}function B(t,n,a="",s){let i=e("button",a,t);if(i.type="button",s)i.title=s,i.setAttribute("aria-label",s);return i.addEventListener("pointerdown",(r)=>{r.stopPropagation()}),i.addEventListener("click",(r)=>{r.stopPropagation(),n(r)}),i}function Q(t,n,a){let s=e("button",a?.className??"ls-btn-sm ls-btn-icon");if(s.type="button",s.append(kn(t,a?.size??14)),a?.label)s.append(e("span","",a.label));if(a?.title)s.title=a.title,s.setAttribute("aria-label",a.title);return s.addEventListener("pointerdown",(i)=>{i.stopPropagation()}),s.addEventListener("click",(i)=>{i.stopPropagation(),n(i)}),s}class ze{handles=[];track(t){return this.handles.push(t),t}clear(){for(let t of this.handles.splice(0))try{t.destroy()}catch{}}}var Pa=[".ls-drawer-body",".ls-studio-pane",".ls-studio-preview-pane",".ls-hud-content",".ls-dossier-main"],Ea=0;if(typeof document<"u")document.addEventListener("keydown",(t)=>{if(t.target instanceof HTMLInputElement||t.target instanceof HTMLTextAreaElement)Ea=Date.now()},{capture:!0,passive:!0});function $n(t,n,a){let s=document.activeElement,i=Date.now()-Ea<1200,r=Boolean(document.body.querySelector('.ls-dd-menu[data-ls-dd-open="true"]'))||Boolean(t.querySelector('[aria-expanded="true"], [data-state="open"]'))||s instanceof HTMLElement&&t.contains(s)&&s.tagName==="SELECT";if(a?.deferIfTyping&&(i||r)&&s instanceof HTMLElement&&t.contains(s)&&(s.tagName==="INPUT"||s.tagName==="TEXTAREA")&&s.type!=="checkbox"&&s.type!=="radio"){if(a.onDeferredFlush&&!s.dataset.lsBlurDeferred){s.dataset.lsBlurDeferred="true";let c=null,f=()=>{if(c)clearTimeout(c),c=null;delete s.dataset.lsBlurDeferred,s.removeEventListener("blur",f),a.onDeferredFlush?.()};s.addEventListener("blur",f,{once:!0}),c=setTimeout(f,1250)}return!1}let d=new Map;d.set("__root__",{top:t.scrollTop,left:t.scrollLeft});for(let c of Pa){let f=t.querySelector(c);if(f)d.set(c,{top:f.scrollTop,left:f.scrollLeft})}n();let o=d.get("__root__");if(o)t.scrollTop=o.top,t.scrollLeft=o.left;for(let c of Pa){let f=d.get(c);if(!f)continue;let b=t.querySelector(c);if(b)b.scrollTop=f.top,b.scrollLeft=f.left}return!0}function J(t,n,a,s){let i=s.value,r=[...s.options],d=null,o=null,c=e("div","ls-dd-wrap");if(s.compact)c.dataset.compact="true";let f=e("button","ls-dd-trigger");if(f.type="button",f.setAttribute("aria-haspopup","listbox"),f.setAttribute("aria-expanded","false"),s.ariaLabel)f.setAttribute("aria-label",s.ariaLabel);if(s.title)f.title=s.title;let b=e("span","ls-dd-trigger-label"),M=e("span","ls-dd-caret","▾");f.append(b,M),c.append(f),a.replaceChildren(c);let m=()=>{let T=r.find((N)=>N.value===i);b.textContent=T?.label||s.placeholder||r[0]?.label||"Select…"};m();let S=()=>{if(o)o(),o=null;if(d)d.remove(),d=null;f.setAttribute("aria-expanded","false")},L=()=>{S();for(let E of[...document.body.querySelectorAll('.ls-dd-menu[data-ls-dd-open="true"]')])E.remove();let T=e("div","ls-dd-menu");T.setAttribute("role","listbox"),T.dataset.lsDdOpen="true";let N=getComputedStyle(f);for(let E of["--ls-bg","--ls-surface","--ls-text","--ls-muted","--ls-primary","--ls-border","--ls-fill","--ls-fill-hover","--ls-radius","--ls-font"]){let D=N.getPropertyValue(E).trim();if(D)T.style.setProperty(E,D)}let I=e("div","ls-dd-list"),v=null,x=(E="")=>{I.replaceChildren();let D=E.trim().toLowerCase(),F=D?r.filter((W)=>W.label.toLowerCase().includes(D)||W.sublabel&&W.sublabel.toLowerCase().includes(D)||W.value.toLowerCase().includes(D)):r;if(!F.length){let W=e("div","ls-muted","No matching options");W.style.padding="6px 8px",I.append(W);return}for(let W of F){let V=e("button","ls-dd-option");if(V.type="button",V.setAttribute("role","option"),V.setAttribute("aria-selected",String(W.value===i)),W.disabled)V.disabled=!0;if(V.append(e("span","",W.label)),W.sublabel)V.append(e("span","ls-dd-sublabel",W.sublabel));V.addEventListener("pointerdown",(O)=>{O.stopPropagation()}),V.addEventListener("click",(O)=>{O.preventDefault(),O.stopPropagation(),i=W.value,m(),S(),s.onChange(W.value)}),I.append(V)}};if(r.length>=6)v=e("input","ls-dd-search"),v.type="text",v.placeholder=s.searchPlaceholder||"Search…",v.addEventListener("pointerdown",(E)=>E.stopPropagation()),v.addEventListener("input",()=>x(v.value)),T.append(v);x(),T.append(I);let _=document.body.getBoundingClientRect(),k=_.width>0&&document.body.offsetWidth>0?_.width/document.body.offsetWidth:1,y=f.getBoundingClientRect(),u=window.innerWidth/k,g=window.innerHeight/k,p=Math.max(Math.round(y.width/k),190),h=Math.min(280,r.length*34+(v?48:16)),C=g-y.bottom/k,l=C<h+12&&y.top/k>C,w=Math.max(8,Math.min(u-p-8,Math.round(y.left/k)));if(T.style.left=`${w}px`,T.style.width=`${p}px`,l)T.style.bottom=`${Math.max(8,Math.round(g-y.top/k+4))}px`;else T.style.top=`${Math.max(8,Math.round(y.bottom/k+4))}px`;if(document.body.append(T),d=T,f.setAttribute("aria-expanded","true"),v)requestAnimationFrame(()=>v?.focus());let P=(E)=>{let D=E.target;if(!D)return;if(T.contains(D)||f.contains(D))return;S()},R=(E)=>{if(E.key==="Escape")E.stopPropagation(),S(),f.focus()},A=(E)=>{if(E.type==="resize"&&v&&document.activeElement===v)return;if(E.target instanceof Node&&T.contains(E.target))return;S()};window.addEventListener("pointerdown",P,!0),window.addEventListener("keydown",R,!0),window.addEventListener("resize",A,{passive:!0}),window.addEventListener("scroll",A,{capture:!0,passive:!0}),o=()=>{window.removeEventListener("pointerdown",P,!0),window.removeEventListener("keydown",R,!0),window.removeEventListener("resize",A),window.removeEventListener("scroll",A,!0)}};return f.addEventListener("pointerdown",(T)=>{T.stopPropagation()}),f.addEventListener("click",(T)=>{if(T.preventDefault(),T.stopPropagation(),d)S();else L()}),n?.track({destroy:S}),{getValue:()=>i,setValue:(T)=>{i=T,m()},setOptions:(T,N)=>{if(r=[...T],N!==void 0)i=N;if(m(),d)L()}}}function me(t,n,a,s){let i=e("label","ls-toggle-switch");if(s.size==="md")i.dataset.size="md";let r=e("input");if(r.type="checkbox",r.checked=s.checked,r.disabled=Boolean(s.disabled),s.ariaLabel)r.setAttribute("aria-label",s.ariaLabel);r.addEventListener("change",()=>s.onChange(r.checked));let d=e("span","ls-toggle-track");i.append(r,d),a.replaceChildren(i)}function xe(t,n,a,s){let i=e("label","ls-check-row"),r=e("input");r.type="checkbox",r.checked=s.checked,r.disabled=Boolean(s.disabled),r.addEventListener("change",()=>s.onChange(r.checked)),i.append(r,e("span","",s.label)),a.replaceChildren(i)}var Aa=new Map;function fe(t,n,a,s){let i=e("details","ls-accordion"),r=s.persistKey?Aa.get(s.persistKey):void 0;i.open=r!==void 0?r:Boolean(s.defaultExpanded);let d=e("summary","ls-accordion-head"),o=e("span","ls-row");if(s.iconName)o.append(kn(s.iconName,14));o.append(e("strong","",s.title));let c=e("span","ls-row");if(s.badge!==void 0)c.append(e("span","ls-chip",String(s.badge)));c.append(e("span","ls-accordion-chev","▾")),d.append(o,c);let f=e("div","ls-accordion-body ls-stack");return i.append(d,f),i.addEventListener("toggle",()=>{if(s.persistKey)Aa.set(s.persistKey,i.open);s.onToggle?.(i.open)}),a.append(i),f}function Ut(t,n,a,s){let i=async(c,f)=>{if(typeof t.ui?.showContextMenu!=="function")return;let b=a();if(!b.length)return;let M=await t.ui.showContextMenu({position:{x:c,y:f},items:b});if(M.selectedKey)s(M.selectedKey)};n.addEventListener("contextmenu",(c)=>{c.preventDefault(),c.stopPropagation(),i(c.clientX,c.clientY)});let r=null,d=!1,o={x:0,y:0};n.addEventListener("touchstart",(c)=>{d=!1;let f=c.touches[0];if(!f)return;o={x:f.clientX,y:f.clientY},r=setTimeout(()=>{d=!0,navigator.vibrate?.(40),i(f.clientX,f.clientY)},500)},{passive:!0}),n.addEventListener("touchmove",(c)=>{if(!r)return;let f=c.touches[0];if(!f)return;if(Math.abs(f.clientX-o.x)>10||Math.abs(f.clientY-o.y)>10)clearTimeout(r),r=null},{passive:!0}),n.addEventListener("touchend",(c)=>{if(r)clearTimeout(r),r=null;if(d)c.preventDefault(),d=!1})}class _a{ctx;activeModals=new Set;constructor(t){this.ctx=t}hasOpenModals(){return this.activeModals.size>0}open(t,n){if(typeof this.ctx.ui?.showModal!=="function"){console.warn("[LumiStats ModalManager] ctx.ui.showModal is not a function — cannot open modal");return}if(this.activeModals.size>=2)this.activeModals.values().next().value?.dismiss();let a=new ze;console.log("[LumiStats ModalManager] calling ctx.ui.showModal, title:",t.title);let s=this.ctx.ui.showModal({title:t.title,width:t.width??640,maxHeight:t.maxHeight??760,persistent:t.persistent??!1});return console.log("[LumiStats ModalManager] showModal returned handle:",s,"root connected:",s?.root?.isConnected),this.activeModals.add(s),s.root.classList.add("ls-root"),s.root.style.cssText+=";padding:16px;overflow-y:auto;height:auto;max-height:min(80vh, 740px);",s.onDismiss(()=>{a.clear(),this.activeModals.delete(s)}),n(s.root,()=>s.dismiss(),s,a),s}async confirm(t){if(typeof this.ctx.ui?.showConfirm==="function"){let n=await this.ctx.ui.showConfirm({title:t.title,message:t.message,confirmLabel:t.confirmLabel??"Confirm",variant:t.variant??"warning"});return Boolean(n?.confirmed)}return!1}closeAll(){for(let t of[...this.activeModals])t.dismiss();this.activeModals.clear()}}var Ct=new WeakMap;function Na(t){let n=Ct.get(document);if(n)return n.count++,()=>{if(n.count--,n.count<=0)Ct.delete(document),n.remove()};let a=t.dom.addStyle(La);return Ct.set(document,{count:1,remove:a}),()=>{let s=Ct.get(document);if(!s)return;if(s.count--,s.count<=0)Ct.delete(document),s.remove()}}function Tt(t,n){t.modals.open({title:"✨ Create New Lumi Stats Template",width:520},(a,s,i,r)=>{let d=e("div","ls-grid"),o=e("label","ls-label","Icon Emoji"),c=e("input","ls-input");c.value="✨",o.append(c);let f=e("label","ls-label","Template Name"),b=e("input","ls-input");b.placeholder="e.g. Modern Drama & Chemistry, Dark Fantasy RPG…",b.value="",f.append(b),d.append(o,f);let M=e("label","ls-label","Short Description"),m=e("input","ls-input");m.placeholder="What kind of story or stats does this template track?",M.append(m);let S="universal_companion",L=e("div","ls-label","Starter Stat Blueprint"),T=e("div");L.append(T);let N=t.customTemplates.filter((h)=>!t.builtinTemplates.some((C)=>C.id===h.id)).map((h)=>({value:h.id,label:`${h.icon} ${h.name} (Saved · ${h.stats.length} stats)`}));J(t,r,T,{value:S,ariaLabel:"Starter Stat Blueprint",options:[{value:"empty",label:"\uD83E\uDDF9 Empty Canvas (0 stats — start completely from scratch)"},{value:"blank",label:"\uD83C\uDF31 Clean Minimal Starter (1 Trust meter — build your own)"},...N,...t.builtinTemplates.map((h)=>({value:h.id,label:`${h.icon} ${h.name} (${h.stats.length} stats)`}))],onChange:(h)=>{S=h}});let I="post_history",v=1,x=e("div","ls-label","\uD83E\uDDE0 AI Prompt Placement (Where Lumi State Is Sent)"),_=e("div","ls-row"),k=e("div","ls-row");k.style.display="none";let y=()=>{for(let h of[..._.querySelectorAll("button")])h.setAttribute("aria-current",h.dataset.pos===I?"page":"false");k.style.display=I==="in_history"?"flex":"none"};for(let[h,C]of[["pre_history","⬆️ Before History"],["in_history","\uD83D\uDCAC Within History"],["post_history","⬇️ After History"]]){let l=B(C,()=>{I=h,y()},"ls-btn-sm");l.dataset.pos=h,_.append(l)}let u=e("input","ls-input");u.type="number",u.min="0",u.max="20",u.style.width="76px",u.value=String(v),u.addEventListener("change",()=>{v=Math.max(0,Math.min(20,Math.round(Number(u.value)||0)))}),k.append(e("small","ls-muted","History Depth:"),u),y(),x.append(_,k);let g=e("small","ls-muted");g.style.cssText="color:var(--ls-danger);display:none;";let p=B("✨ Create & Activate Template",()=>{let h=b.value.trim()||"My Custom Template",C=c.value.trim()||"✨",l=m.value.trim()||"Custom roleplay tracker template.";p.disabled=!0,p.textContent="⏳ Creating…",g.style.display="none",t.request("template:createNew",{name:h,icon:C,description:l,starter:S,promptPosition:I,promptDepth:v}).then(()=>{t.notify(`Created & activated "${C} ${h}"!`),s(),n?.()}).catch((w)=>{if(g.textContent=w instanceof Error?w.message:String(w),g.style.display="block",p.isConnected)p.disabled=!1,p.textContent="✨ Create & Activate Template"})},"ls-btn-primary");p.style.marginTop="10px",a.append(d,M,L,x,g,p),requestAnimationFrame(()=>b.focus())})}function lt(t,n){t.modals.open({title:"\uD83C\uDFAD Quick Template, Game Skin & Placement Switcher",width:660,maxHeight:800},(a,s,i)=>{let r=()=>{let{template:o}=t.snapshot,c=[...t.builtinTemplates,...t.customTemplates.filter((y)=>!t.builtinTemplates.some((u)=>u.id===y.id))];a.replaceChildren();let f=e("div","ls-row-between");f.append(e("span","ls-kicker",`Active: ${o.icon} ${o.name}`),e("div","ls-row")),f.lastElementChild.append(B("✨ + New Template",()=>{s(),Tt(t)},"ls-btn-sm ls-btn-primary"),...n?[B("⚙️ Full Studio",()=>{s(),n()},"ls-btn-sm")]:[]),a.append(f);let b=e("div","ls-card");b.append(e("span","ls-kicker","\uD83C\uDFAE 1-Click Game Skin & Placement"));let M=e("div","ls-row");for(let y of zt){let u=B(y.name,()=>{t.applySkinPack(y)},"ls-btn-sm");if((o.theme.surfaceStyle||"glass")===y.surfaceStyle)u.setAttribute("aria-current","page");M.append(u)}let m=e("div","ls-row");for(let[y,u]of[["both_bottom","✨ HUD + Below Reply"],["both_top","✨ HUD + Above Reply"],["inline_bottom","\uD83D\uDCAC Below Reply Only"],["floating_only","\uD83E\uDE9F Floating HUD Only"]]){let g=B(u,()=>{t.request("state:mutate",{templatePatch:{theme:{...o.theme,placement:y}},reason:"Updated placement mode"})},"ls-btn-sm");if(o.theme.placement===y)g.setAttribute("aria-current","page");m.append(g)}let S=e("div","ls-row");S.append(e("small","ls-muted","Cast Tab:"));for(let[y,u]of[["roster","\uD83D\uDC65 Icon Roster (In Scene / Away)"],["cards","\uD83D\uDDC2️ All Cards Expanded"]]){let g=B(u,()=>{t.request("state:mutate",{templatePatch:{theme:{...o.theme,castLayout:y}},reason:"Updated cast layout mode"})},"ls-btn-sm");if((o.theme.castLayout||"roster")===y)g.setAttribute("aria-current","page");S.append(g)}let L=e("div","ls-row");L.append(e("small","ls-muted","Widget Tabs:"));for(let[y,u]of[[!1,"\uD83C\uDFF7️ Icons + Text"],[!0,"✨ Icons Only"]]){let g=B(u,()=>{t.request("state:mutate",{templatePatch:{theme:{...o.theme,widgetTabsIconOnly:y}},reason:`Set widget tabs to ${y?"icons only":"icons + labels"}`})},"ls-btn-sm");if(Boolean(o.theme.widgetTabsIconOnly)===y)g.setAttribute("aria-current","page");L.append(g)}let T=e("div","ls-row");T.append(e("small","ls-muted","Send State:"));for(let[y,u]of[["pre_history","⬆️ Before History"],["in_history","\uD83D\uDCAC Within History"],["post_history","⬇️ After History"]]){let g=B(u,()=>{t.request("state:mutate",{templatePatch:{promptPosition:y},reason:`Set Lumi State prompt position to ${y}`})},"ls-btn-sm");if((o.promptPosition||"post_history")===y)g.setAttribute("aria-current","page");T.append(g)}if(o.promptPosition==="in_history"){let y=e("input","ls-input");y.type="number",y.min="0",y.max="20",y.title="History depth (messages back from end)",y.style.cssText="width:62px;min-height:27px;padding:2px 6px;font-size:11px;",y.value=String(Math.max(0,Math.round(Number(o.promptDepth??1)||0))),y.addEventListener("change",()=>{let u=Math.max(0,Math.min(20,Math.round(Number(y.value)||0)));t.request("state:mutate",{templatePatch:{promptDepth:u},reason:`Set Lumi State depth to ${u}`})}),T.append(e("small","ls-muted","Depth:"),y)}let N=e("div","ls-row");N.append(e("small","ls-muted","Pill Skin:"));let I=e("div");I.style.minWidth="210px",N.append(I),J(t,void 0,I,{value:o.theme.pillStyle||"glass_capsule",compact:!0,ariaLabel:"Collapsed Pill Skin",options:[{value:"glass_capsule",label:"✨ Frosted Split Capsule (Best)"},{value:"vn_dialogue_bar",label:"\uD83C\uDFAC VN Cinema Strip"},{value:"rpg_status_bar",label:"⚔️ JRPG Party Status Bar"},{value:"persona_ticker",label:"\uD83C\uDCCF Stylish Pop Ticker"},{value:"cyber_telemetry",label:"\uD83D\uDEF8 Cyber Telemetry"},{value:"minimal_floating",label:"☁️ Minimal Ghost Pill"},{value:"neon_edge",label:"⚡ Neon Glow Rail"},{value:"split_deck",label:"\uD83D\uDDC2️ Dual-Deck Card Pill"},{value:"compact_badge",label:"\uD83D\uDCF1 Micro Compact Badge"},{value:"ledger_strip",label:"\uD83D\uDCDC Editorial Case Strip"}],onChange:(y)=>{t.request("state:mutate",{templatePatch:{theme:{...o.theme,pillStyle:y}},reason:`Changed Pill Skin to ${y}`})}}),b.append(M,N,m,S,L,T),a.append(b);let v=c.filter((y)=>!t.builtinTemplates.some((u)=>u.id===y.id)),x=c.filter((y)=>t.builtinTemplates.some((u)=>u.id===y.id)),_=[...v,...x],k=e("div","ls-grid");k.style.marginTop="8px";for(let y of _){let u=y.id===o.id,g=!t.builtinTemplates.some((l)=>l.id===y.id),p=e("div","ls-preset-card");p.dataset.active=String(u);let h=e("div","ls-row-between");h.append(e("strong","",`${y.icon} ${y.name}`),e("span",`ls-chip ${g?"ls-chip-accent":""}`,g?"Saved Custom":"Built-In"));let C=e("div","ls-row");if(u)C.append(e("span","ls-chip ls-chip-accent","✓ Active"));else{let l=B("Activate",()=>{l.disabled=!0,l.textContent="Applying…",t.request("template:apply",{templateId:y.id,template:y}).then(()=>t.notify(`Switched to "${y.name}"`)).catch((w)=>{if(t.notify(w instanceof Error?w.message:String(w),!0),l.isConnected)l.disabled=!1,l.textContent="Activate"})},"ls-btn-sm ls-btn-primary");C.append(l)}C.append(B("\uD83D\uDCCB Duplicate",()=>{t.request("template:duplicate",{sourceTemplateId:y.id,template:y,name:`${y.name} (Custom)`}).then(()=>t.notify(`Duplicated "${y.name}"`)).catch((l)=>t.notify(l instanceof Error?l.message:String(l),!0))},"ls-btn-sm")),p.append(h,e("small","ls-muted",y.description),C),k.append(p)}a.append(k)};r();let d=t.subscribe(r);i.onDismiss(d)})}function Ms(){if(typeof crypto<"u"&&typeof crypto.randomUUID==="function")return crypto.randomUUID();if(typeof crypto<"u"&&typeof crypto.getRandomValues==="function"){let t=new Uint8Array(16);crypto.getRandomValues(t),t[6]=t[6]&15|64,t[8]=t[8]&63|128;let n=Array.from(t,(a)=>a.toString(16).padStart(2,"0")).join("");return`${n.slice(0,8)}-${n.slice(8,12)}-${n.slice(12,16)}-${n.slice(16,20)}-${n.slice(20)}`}return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(t)=>{let n=Math.random()*16|0;return(t==="x"?n:n&3|8).toString(16)})}class Ln{ctx;modals;tts=new Mn;chatId="";snapshot;settings;customTemplates=[];builtinTemplates=Sa;connections=[];recentTurns=[];copilotTurns=[];activeProposal;busy=!1;statusText="";statusError=!1;isGenerationStreaming=!1;isDrawerTabVisible=!0;vnStageOpen=!1;studioOpen=!1;vnShowHudWidget=!0;onToggleVnStage=null;activeDrawerTab="Stats";activeSurfaceTab="stats";activeInlineTab="stats";activeDossierTab="overview";dossierEditMode=!1;webFilterMode="all";activeCopilotMode="ask";inlineExpanded=!1;widgetExpanded=!1;selectedActorId="";openedCastTabs=[];activeCastTabActorId="";selectedPlaceId="";hydratingChat=!1;activeOverlayCleanup=null;onResizeWidgetLive=null;lastThemeAppliedChatId="";customCssEl=null;pendingRpc=new Map;listeners=new Set;statusListeners=new Set;disposers=[];constructor(t){this.ctx=t;this.modals=new _a(t);let n=ke();this.snapshot={schemaVersion:1,chatId:"",revision:0,state:Ta(n),template:n,deltas:{statDeltas:{},characterDeltas:{}},bindings:[],checkpoints:[]},this.disposers.push(t.onBackendMessage((a)=>{if(!a||typeof a!=="object")return;let s=a;if(s.channel!==Sn)return;if(s.type==="rpc_ack"&&typeof s.requestId==="string"){let r=this.pendingRpc.get(s.requestId);if(r){clearTimeout(r.timer),this.pendingRpc.delete(s.requestId);let d=s;if(d.ok)r.resolve(d.data??{});else this.notify(d.error??"Operation failed",!0),r.reject(Error(d.error??"Operation failed"))}return}let i=typeof s.resolvedChatId==="string"&&s.resolvedChatId?s.resolvedChatId:typeof s.chatId==="string"&&s.chatId!=="sandbox"?s.chatId:"";if(!this.chatId&&i)this.chatId=i;if(i&&this.chatId&&i!==this.chatId)return;if(s.type==="snapshot"&&s.snapshot){this.hydratingChat=!1,this.snapshot=s.snapshot;let r=this.snapshot.template.surfaces,d=r.widgetTabs.filter((f)=>f.enabled);if(d.length&&!d.some((f)=>f.id===this.activeSurfaceTab))this.activeSurfaceTab=d[0].id;let o=r.inlineTabs.filter((f)=>f.enabled);if(o.length&&!o.some((f)=>f.id===this.activeInlineTab))this.activeInlineTab=o[0].id;let c=r.dossierTabs.filter((f)=>f.enabled);if(c.length&&!c.some((f)=>f.id===this.activeDossierTab))this.activeDossierTab=c[0].id;if(this.chatId&&this.lastThemeAppliedChatId!==this.chatId)this.lastThemeAppliedChatId=this.chatId,this.inlineExpanded=Boolean(this.snapshot.template.theme.inlineDefaultExpanded);if(this.selectedActorId&&!this.snapshot.state.characters[this.selectedActorId])this.selectedActorId="";if(this.openedCastTabs=this.openedCastTabs.filter((f)=>Boolean(this.snapshot.state.characters[f])),this.activeCastTabActorId&&!this.snapshot.state.characters[this.activeCastTabActorId])this.activeCastTabActorId="";if(this.selectedPlaceId&&!this.snapshot.state.places[this.selectedPlaceId])this.selectedPlaceId="";if(s.settings){if(this.settings=s.settings,typeof this.settings.vnShowHudWidget==="boolean")this.vnShowHudWidget=this.settings.vnShowHudWidget}if(Array.isArray(s.customTemplates))this.customTemplates=s.customTemplates;if(Array.isArray(s.copilotTurns))this.copilotTurns=s.copilotTurns;this.busy=s.busy===!0,this.applyTemplateThemeToDom(),this.emitChange(),this.emitStatusChange()}else if(s.type==="status")this.busy=s.busy===!0,this.statusText=String(s.text??""),this.statusError=!1,this.emitStatusChange();else if(s.type==="error")this.busy=!1,this.notify(String(s.message??"Error"),!0)}))}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}subscribeStatus(t){return this.statusListeners.add(t),()=>this.statusListeners.delete(t)}applySkinPack(t){let n=Ca(t),a=this.snapshot.template.theme;this.request("state:mutate",{templatePatch:{theme:{...a,surfaceStyle:n.surfaceStyle,frameShape:n.frameShape,meterStyle:n.meterStyle,accentHue:n.accentHue,secondaryHue:n.secondaryHue,glowIntensity:n.glowIntensity??55,glassBlur:n.glassBlur!==!1,compact:Boolean(n.compact),castLayout:n.castLayout??a.castLayout??"roster",...n.customCss!==void 0?{customCss:n.customCss}:{}}},reason:`Applied visual skin "${n.name}"`}),this.notify(`Applied "${n.name}" visual skin!`)}stampThemeOnElement(t){let n=this.snapshot.template.theme,a=n.surfaceStyle||"glass",s=n.frameShape||(n.radiusPreset==="sharp"?"sharp":"rounded"),i=n.meterStyle||"smooth",r=n.glassBlur!==!1,d=Math.max(0,Math.min(100,Number(n.glowIntensity??55)))/100,o=Boolean(n.compact),c=typeof n.accentHue==="number"&&Number.isFinite(n.accentHue),f=typeof n.secondaryHue==="number"&&Number.isFinite(n.secondaryHue);if(t.dataset.lsStyle=a,t.dataset.lsPill=n.pillStyle||"glass_capsule",t.dataset.lsFrame=s,t.dataset.lsMeter=i,t.dataset.lsBlur=String(r),t.dataset.lsCompact=String(o),t.style.setProperty("--ls-glow",d.toFixed(2)),c)t.style.setProperty("--ls-primary",`hsl(${n.accentHue}, 86%, 62%)`);else t.style.removeProperty("--ls-primary");if(f)t.style.setProperty("--ls-accent",`hsl(${n.secondaryHue}, 82%, 68%)`);else if(c)t.style.setProperty("--ls-accent",`hsl(${(n.accentHue+28)%360}, 82%, 68%)`);else t.style.removeProperty("--ls-accent")}applyTemplateThemeToDom(){if(typeof document>"u")return;let t=this.snapshot.template.theme;for(let a of document.querySelectorAll(".ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay"))this.stampThemeOnElement(a);let n=(t.customCss||"").trim();if(n){let a=n.replace(/@import\b[^;]*;?/gi,"").replace(/url\s*\([^)]*\)/gi,"");if(!this.customCssEl)this.customCssEl=document.createElement("style"),this.customCssEl.dataset.lsCustomCss="true",document.head.append(this.customCssEl);if(this.customCssEl.textContent!==a)this.customCssEl.textContent=a}else if(this.customCssEl)this.customCssEl.remove(),this.customCssEl=null}emitChange(){for(let t of this.listeners)t();this.applyTemplateThemeToDom()}emitStatusChange(){for(let t of this.statusListeners)t()}notify(t,n=!1){this.statusText=t,this.statusError=n,this.emitStatusChange()}request(t,n={}){let a=this.chatId||"sandbox",s=Ms();return new Promise((i,r)=>{let d=setTimeout(()=>{this.pendingRpc.delete(s),r(Error(`RPC timeout waiting for ${t}`))},60000);this.pendingRpc.set(s,{resolve:i,reject:r,timer:d});let o={channel:Sn,requestId:s,chatId:a,type:t,payload:n};this.ctx.sendToBackend(o)})}isActivityForActiveChat(t){let n="";try{n=this.ctx.getActiveChat?.()?.chatId??""}catch{n=""}if(n&&n!==this.chatId)this.refreshActiveChat(n);let a=n||this.chatId;if(!a){if(t&&t!=="sandbox")this.refreshActiveChat(t);return!0}return!t||t===a}async refreshActiveChat(t){let n=typeof t==="string"?t.trim():"";if(!n&&t!==null)try{n=this.ctx.getActiveChat?.()?.chatId??""}catch{n=""}if(n!==this.chatId)this.chatId=n,this.selectedActorId="",this.openedCastTabs=[],this.activeCastTabActorId="",this.selectedPlaceId="",this.activeProposal=void 0;this.hydratingChat=!0;let a=await this.request("snapshot:get").catch(()=>({}));if(this.hydratingChat=!1,typeof a.resolvedChatId==="string"&&a.resolvedChatId&&!this.chatId)this.chatId=a.resolvedChatId;if(Array.isArray(a.connections))this.connections=a.connections;if(Array.isArray(a.recentTurns))this.recentTurns=a.recentTurns;this.emitChange()}toggleVnStage(){this.onToggleVnStage?.()}uploadStageVariantAsset(t){this.ctx.uploads.pickFile({accept:["image/png","image/jpeg","image/webp","image/gif"],multiple:!1,maxSizeBytes:6000000}).then((n)=>{let a=n[0];if(!a)return;let s=32768,i="";for(let r=0;r<a.bytes.length;r+=s)i+=String.fromCharCode(...a.bytes.subarray(r,r+s));this.notify("⏳ Uploading & saving stage asset variant…"),this.request("asset:upload",{dataUrl:`data:${a.mimeType||"image/png"};base64,${btoa(i)}`,...t})}).catch((n)=>this.notify(n instanceof Error?n.message:String(n),!0))}pickAndUploadImage(t,n,a="neutral"){this.ctx.uploads.pickFile({accept:["image/png","image/jpeg","image/webp","image/gif"],multiple:!1,maxSizeBytes:6000000}).then((s)=>{let i=s[0];if(!i)return;let r=32768,d="";for(let o=0;o<i.bytes.length;o+=r)d+=String.fromCharCode(...i.bytes.subarray(o,o+r));this.notify(`⏳ Uploading ${n}…`),this.request("asset:upload",{dataUrl:`data:${i.mimeType||"image/png"};base64,${btoa(d)}`,targetId:t,kind:n,variant:a})}).catch((s)=>this.notify(s instanceof Error?s.message:String(s),!0))}destroy(){if(this.tts.destroy(),this.customCssEl)this.customCssEl.remove(),this.customCssEl=null;if(this.activeOverlayCleanup)this.activeOverlayCleanup(),this.activeOverlayCleanup=null;this.modals.closeAll();for(let t of this.pendingRpc.values())clearTimeout(t.timer);this.pendingRpc.clear();for(let t of this.disposers.splice(0))t();this.listeners.clear(),this.statusListeners.clear()}}function Kt(t){let n={};if(typeof t==="number"&&Number.isFinite(t))return n.value=t,n;let a=String(t??"").trim();if(!a||a==="None")return n;let s=Number(a);if(Number.isFinite(s))n.value=s;let i=/\b([A-Za-z][A-Za-z0-9_]{0,20})\s*[:=]?\s*(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)\b/g,r;while((r=i.exec(a))!==null){let c=r[1],f=Number(r[2]),b=Number(r[3]);if(Number.isFinite(f))n[c]=f,n[`${c}_cur`]=f,n[c.toLowerCase()]=f,n[`${c.toLowerCase()}_cur`]=f;if(Number.isFinite(b))n[`${c}_max`]=b,n[`${c.toLowerCase()}_max`]=b}let d=a.match(/(-?\d+(?:\.\d+)?)\s*%/);if(d){let c=Number(d[1]);if(Number.isFinite(c))n.pct=c}let o=/\b([A-Za-z][A-Za-z0-9_]{0,20})(?:\s*[:=]\s*|\.\s*|\s+|(?=-?\d))(-?\d+(?:\.\d+)?)\b(?!\s*\/)/g;while((r=o.exec(a))!==null){let c=r[1],f=Number(r[2]);if(!Number.isFinite(f))continue;if(n[c]===void 0)n[c]=f;if(n[c.toLowerCase()]===void 0)n[c.toLowerCase()]=f}return n}function $s(t){let n=t.trim();if(!n||n.includes("{{"))return!1;if(/^(?:compute|calculate|format|write|track|update|use)\b/i.test(n))return!0;if(/\.\s+[A-Za-z]+\s+[a-z]+\s+[a-z]+/.test(n))return!0;if(/\b(?:loses|per\s+\d|during|whenever|only\s+if|in\s+this\s+format)\b/i.test(n))return!0;return!1}function je(t,n,a,s){let i=t.trim();if(!i||i.length>1000)return;let r=0,d=0,o=()=>{while(r<i.length&&/\s/.test(i[r]??""))r++},c=()=>{let v=i[r];r++;let x="";while(r<i.length){let _=i[r];if(_==="\\"&&r+1<i.length){x+=i[r+1],r+=2;continue}if(_===v)return r++,x;x+=_,r++}throw Error("Unterminated string literal")},f=(v)=>{if(Object.prototype.hasOwnProperty.call(n,v))return n[v];let x=v.toLowerCase();for(let[k,y]of Object.entries(n))if(k.toLowerCase()===x)return y;let _=a.resolveRef(v);if(_!==void 0&&Number.isFinite(_))return _;return s?.missingRefs.add(v),NaN},b=(v,x)=>{let _=v.toLowerCase();if(_==="round"){if(!x.length)return NaN;let y=10**(x[1]!==void 0&&Number.isFinite(x[1])?Math.max(0,Math.min(6,Math.round(x[1]))):0);return Math.round(x[0]*y)/y}if(_==="floor")return x.length?Math.floor(x[0]):NaN;if(_==="ceil")return x.length?Math.ceil(x[0]):NaN;if(_==="abs")return x.length?Math.abs(x[0]):NaN;if(_==="min")return x.length?Math.min(...x):NaN;if(_==="max")return x.length?Math.max(...x):NaN;if(_==="mod")return x.length>=2&&x[1]!==0?x[0]%x[1]:NaN;if(_==="clamp"){if(x.length<3)return NaN;return Math.max(x[1],Math.min(x[2],x[0]))}if(_==="if"){if(x.length<2)return NaN;let k=x[0];return k!==0&&!Number.isNaN(k)?x[1]:x[2]??0}throw Error(`Unknown function: ${v}`)},M=()=>{if(++d>800)throw Error("Formula complexity limit exceeded");o();let v=i[r];if(v==="+"||v==="-"||v==="!"){r++;let k=M();if(v==="!")return k===0||Number.isNaN(k)?1:0;return v==="-"?-k:k}if(v==="("){r++;let k=I();if(o(),i[r]!==")")throw Error("Unclosed parenthesis");return r++,k}if(v==="["){let k=i.indexOf("]",r+1);if(k<0)throw Error("Unclosed bracket reference");let y=i.slice(r+1,k).trim();r=k+1;let u=a.resolveRef(y);if(u!==void 0&&Number.isFinite(u))return u;return s?.missingRefs.add(y),NaN}let x=i.slice(r).match(/^(?:\d+(?:\.\d+)?|\.\d+)/);if(x)return r+=x[0].length,Number(x[0]);let _=i.slice(r).match(/^[A-Za-z_][A-Za-z0-9_.]*/);if(_){let k=_[0];if(r+=k.length,o(),i[r]==="("){r++,o();let y=k.toLowerCase();if(y==="hascond"||y==="hasflag"){let g=!1;if(i[r]==='"'||i[r]==="'"){let p=c();g=a.hasCond(p),o()}if(i[r]!==")")throw Error(`Expected ) after ${k}`);return r++,g?1:0}if(y==="match"||y==="matches"){let g="",p="";if(i[r]==='"'||i[r]==="'")g=c();else{let h=r;while(r<i.length&&i[r]!==","&&i[r]!==")")r++;let C=i.slice(h,r).trim();g=a.resolveStringRef(C)??String(f(C)||"")}if(o(),i[r]===","){if(r++,o(),i[r]==='"'||i[r]==="'")p=c()}if(o(),i[r]!==")")throw Error("Expected ) after match()");if(r++,!p)return 0;try{return new RegExp(p,"i").test(g)?1:0}catch{return g.toLowerCase().includes(p.toLowerCase())?1:0}}let u=[];if(i[r]!==")")while(!0){if(u.push(I()),o(),i[r]===","){r++;continue}break}if(i[r]!==")")throw Error(`Expected ) in ${k}()`);return r++,b(k,u)}return f(k)}throw Error(`Unexpected character near "${i.slice(r,r+18)}"`)},m=()=>{let v=M();while(!0){o();let x=i[r];if(x!=="*"&&x!=="/"&&x!=="%")return v;r++;let _=M();if((x==="/"||x==="%")&&_===0)return NaN;v=x==="*"?v*_:x==="/"?v/_:v%_}},S=()=>{let v=m();while(!0){o();let x=i[r];if(x!=="+"&&x!=="-")return v;r++;let _=m();v=x==="+"?v+_:v-_}},L=()=>{let v=S();while(!0){o();let x=i.slice(r,r+2),_=i[r],k="";if(x==="<="||x===">="||x==="=="||x==="!=")k=x;else if(_==="<"||_===">")k=_;if(!k)return v;r+=k.length;let y=S();if(k==="<=")v=v<=y?1:0;else if(k===">=")v=v>=y?1:0;else if(k==="==")v=v===y?1:0;else if(k==="!=")v=v!==y?1:0;else if(k==="<")v=v<y?1:0;else v=v>y?1:0}},T=()=>{let v=L();while(!0){if(o(),i.slice(r,r+2)!=="&&")return v;r+=2;let x=L();v=v!==0&&!Number.isNaN(v)&&x!==0&&!Number.isNaN(x)?1:0}},N=()=>{let v=T();while(!0){if(o(),i.slice(r,r+2)!=="||")return v;r+=2;let x=T();v=v!==0&&!Number.isNaN(v)||x!==0&&!Number.isNaN(x)?1:0}},I=()=>{let v=N();if(o(),i[r]!=="?")return v;r++;let x=I();if(o(),i[r]!==":")throw Error('Expected ":" in ternary expression');r++;let _=I();return v!==0&&!Number.isNaN(v)?x:_};try{let v=I();if(o(),r!==i.length){if(s)s.error=`Unexpected character near "${i.slice(r,r+18)}"`;return}if(!Number.isFinite(v))return;return Number(v.toFixed(2))}catch(v){if(s)s.error=v instanceof Error?v.message:String(v);return}}function It(t){let n=t.trim().toLowerCase();return!["","0","false","null","undefined","no","off"].includes(n)}function qt(t){let n=[],a=0,s="";for(let i=0;i<t.length;i++){if(t[i]==="{"&&t[i+1]==="{"){a++,s+="{{",i++;continue}if(t[i]==="}"&&t[i+1]==="}"&&a>0){a--,s+="}}",i++;continue}if(a===0&&t[i]===":"&&t[i+1]===":"){n.push(s),s="",i++;continue}s+=t[i]}return n.push(s),n}function Ba(t,n){let a=0;for(let s=n;s<t.length-1;s++)if(t[s]==="{"&&t[s+1]==="{")a++,s++;else if(t[s]==="}"&&t[s+1]==="}"){if(a--,a===0)return s+2;s++}return-1}function Mt(t,n,a){let s=new RegExp(`^\\{\\{\\s*#?${a}(?:\\s|::|\\}\\})`,"i"),i=new RegExp(`^\\{\\{\\s*\\/${a}\\s*\\}\\}`,"i"),r=1;for(let d=n;d<t.length;d++)if(t[d]==="{"&&t[d+1]==="{"){let o=t.slice(d);if(i.test(o)){if(r--,r===0){let c=t.indexOf("}}",d);return{bodyEnd:d,closeEnd:c+2}}}else if(s.test(o))r++}return null}function Ls(t){let n=[],a="",s=0,i=0,r=null,d=!1;for(let c=0;c<t.length;c++){if(t[c]!=="{"||t[c+1]!=="{")continue;let f=Ba(t,c);if(f<0)continue;let b=t.slice(c+2,f-2).trim();if(/^#?(?:if|unless)\b/i.test(b))s++;else if(/^\/(?:if|unless)\b/i.test(b))s=Math.max(0,s-1);else if(s===0&&/^(?:elseif|elif)\b/i.test(b)){let M=t.slice(i,c);if(r===null)n.push({cond:"__first__",content:M});else n.push({cond:r,content:M});r=b.replace(/^(?:elseif|elif)(?:::|\s+)/i,"").trim(),i=f}else if(s===0&&/^else$/i.test(b)){let M=t.slice(i,c);if(r===null)n.push({cond:"__first__",content:M});else n.push({cond:r,content:M});r=null,d=!0,i=f}c=f-1}let o=t.slice(i);if(d)a=o;else if(r===null)n.push({cond:"__first__",content:o});else n.push({cond:r,content:o});return{branches:n,elseContent:a}}function Ps(t,n,a={},s={}){let i={...s},r={...a},d={missingRefs:new Set},o=0,c=(S)=>{if(Object.prototype.hasOwnProperty.call(r,S))return r[S];let L=S.toLowerCase();for(let[I,v]of Object.entries(r))if(I.toLowerCase()===L)return v;if(Object.prototype.hasOwnProperty.call(i,S))return String(i[S]);for(let[I,v]of Object.entries(i))if(I.toLowerCase()===L)return String(v);let T=n.resolveStringRef(S);if(T!==void 0)return T;let N=n.resolveRef(S);if(N!==void 0)return String(N);return},f=(S)=>{let L=S.trim();if(!L)return!1;let T=L.startsWith("!"),N=T?L.slice(1).trim():L,I=b(N).trim(),v=I.match(/^(.+?)\s*(==|!=|>=|<=|>|<)\s*(.+)$/),x=!1;if(v){let _=v[1].trim(),k=v[2],y=v[3].trim(),u=Number(_),g=Number(y);if(_!==""&&y!==""&&Number.isFinite(u)&&Number.isFinite(g))x=k==="=="?u===g:k==="!="?u!==g:k===">"?u>g:k==="<"?u<g:k===">="?u>=g:u<=g;else x=k==="=="?_===y:k==="!="?_!==y:k===">"?_>y:k==="<"?_<y:k===">="?_>=y:_<=y}else x=It(I);return T?!x:x},b=(S)=>{if(++o>1200)return d.error="Macro work budget exceeded (possible infinite recursion)",S;let L="",T=0;while(T<S.length){if(S[T]!=="{"||S[T+1]!=="{"){L+=S[T++];continue}let N=Ba(S,T);if(N<0){L+=S.slice(T);break}let I=S.slice(T+2,N-2).trim();if(I.startsWith("//")||/^comment::|^note::/i.test(I)){T=N;continue}if(/^#escape$/i.test(I)){let g=Mt(S,N,"escape");if(g){L+=S.slice(N,g.bodyEnd),T=g.closeEnd;continue}}let v=I.match(/^#?(if|unless)(?:::|\s+)([\s\S]+)$/i);if(v){let g=v[1].toLowerCase(),p=v[2].trim(),h=Mt(S,N,g);if(h){let C=S.slice(N,h.bodyEnd),{branches:l,elseContent:w}=Ls(C),P=w;for(let R of l){let A=R.cond==="__first__"?p:R.cond,E=f(A);if(g==="unless"?!E:E){P=R.content;break}}L+=b(P),T=h.closeEnd;continue}}if(/^let(?:::|\s+)/i.test(I)){let g=Mt(S,N,"let");if(g){let p=qt(I.replace(/^let(?:::|\s+)/i,"")),h=new Map,C=new Map;for(let l=0;l+1<p.length;l+=2){let w=b(p[l]).trim(),P=b(p[l+1]);if(!w)continue;h.set(w,Object.prototype.hasOwnProperty.call(r,w)?r[w]:void 0),C.set(w,Object.prototype.hasOwnProperty.call(i,w)?i[w]:void 0),r[w]=P;let R=Number(P);if(P.trim()!==""&&Number.isFinite(R))i[w]=R}L+=b(S.slice(N,g.bodyEnd));for(let[l,w]of h.entries())if(w===void 0)delete r[l];else r[l]=w;for(let[l,w]of C.entries())if(w===void 0)delete i[l];else i[l]=w;T=g.closeEnd;continue}}if(/^#?trim$/i.test(I)){let g=Mt(S,N,"trim");if(g){L+=b(S.slice(N,g.bodyEnd)).trim(),T=g.closeEnd;continue}}if(/^switch::/i.test(I)){let g=qt(I);if(g.length<=2){let p=Mt(S,N,"switch");if(p){let h=b(g[1]??"").trim(),C=S.slice(N,p.bodyEnd),l="",w="",P=/\{\{\s*case::([\s\S]*?)\}\}([\s\S]*?)\{\{\s*\/case\s*\}\}/gi,R;while((R=P.exec(C))!==null)if(qt(R[1]).map((E)=>b(E).trim()).includes(h)){l=R[2];break}if(!l){let A=C.match(/\{\{\s*default\s*\}\}([\s\S]*?)\{\{\s*\/default\s*\}\}/i);if(A)w=A[1]}L+=b(l||w),T=p.closeEnd;continue}}}let x=I.match(/^\.([A-Za-z_][A-Za-z0-9_]*)\s*(=|\+=|-=)\s*([\s\S]+)$/);if(x){let g=x[1],p=x[2],h=b(x[3]).trim(),C=Number(h);if(p==="="){if(r[g]=h,h!==""&&Number.isFinite(C))i[g]=C}else{let l=i[g]??Number(c(g)??0)??0,w=p==="+="?l+(Number.isFinite(C)?C:0):l-(Number.isFinite(C)?C:0);i[g]=w,r[g]=String(w)}T=N;continue}let _=I.match(/^\.([A-Za-z_][A-Za-z0-9_]*)(\+\+|--)$/);if(_){let g=_[1],p=i[g]??Number(c(g)??0)??0,h=_[2]==="++"?p+1:p-1;i[g]=h,r[g]=String(h),L+=String(h),T=N;continue}if(/^[.@$][A-Za-z_][A-Za-z0-9_]*$/.test(I)){let g=I.slice(1),p=c(g);if(p===void 0)d.missingRefs.add(g);else L+=p;T=N;continue}let k=I.includes("::")?qt(I):I.split(/\s+/),y=(k[0]??"").trim().toLowerCase(),u=k.slice(1).map((g)=>b(g));if(y==="space")L+=" ";else if(y==="newline"||y==="nl"||y==="n")L+=`
`;else if(y==="noop")L+="";else if(y==="getvar"||y==="getchatvar"){let g=(u[0]??"").trim(),p=c(g);if(p===void 0)d.missingRefs.add(g);else L+=p}else if(y==="setvar"){let g=(u[0]??"").trim(),p=u[1]??"";if(g){r[g]=p;let h=Number(p);if(p.trim()!==""&&Number.isFinite(h))i[g]=h}}else if(y==="hasvar"||y==="haschatvar"||y==="varexists"){let g=(u[0]??"").trim();L+=c(g)!==void 0?"true":"false"}else if(y==="calc"||y==="math"||y==="evaluate"){let g=u.join("::"),p=je(g,i,n,d);if(p!==void 0)L+=String(p)}else if(y==="round"){let g=Number(u[0]),p=u[1]!==void 0?Math.max(0,Math.min(6,Math.round(Number(u[1])||0))):0;if(Number.isFinite(g))L+=String(Math.round(g*10**p)/10**p)}else if(y==="floor"){let g=Number(u[0]);if(Number.isFinite(g))L+=String(Math.floor(g))}else if(y==="ceil"){let g=Number(u[0]);if(Number.isFinite(g))L+=String(Math.ceil(g))}else if(y==="abs"){let g=Number(u[0]);if(Number.isFinite(g))L+=String(Math.abs(g))}else if(y==="min"){let g=u.map(Number).filter(Number.isFinite);if(g.length)L+=String(Math.min(...g))}else if(y==="max"){let g=u.map(Number).filter(Number.isFinite);if(g.length)L+=String(Math.max(...g))}else if(y==="clamp"){let[g,p,h]=u.map(Number);if(Number.isFinite(g)&&Number.isFinite(p)&&Number.isFinite(h))L+=String(Math.max(p,Math.min(h,g)))}else if(y==="mod"){let g=Number(u[0]),p=Number(u[1]);if(Number.isFinite(g)&&Number.isFinite(p)&&p!==0)L+=String(g%p)}else if(y==="and")L+=u.length&&u.every(It)?"true":"";else if(y==="or")L+=u.some(It)?"true":"";else if(y==="not")L+=!It(u[0]??"")?"true":"";else if(["eq","ne","gt","lt","gte","lte"].includes(y)){let g=u[0]?.trim()??"",p=u[1]?.trim()??"",h=Number(g),C=Number(p),l=g!==""&&p!==""&&Number.isFinite(h)&&Number.isFinite(C),w=!1;if(y==="eq")w=l?h===C:g===p;else if(y==="ne")w=l?h!==C:g!==p;else if(y==="gt")w=l?h>C:g>p;else if(y==="lt")w=l?h<C:g<p;else if(y==="gte")w=l?h>=C:g>=p;else if(y==="lte")w=l?h<=C:g<=p;L+=w?"true":""}else if(y==="empty"||y==="isempty")L+=(u[0]??"")===""?"true":"";else if(y==="blank"||y==="isblank")L+=(u[0]??"").trim()===""?"true":"";else if(y==="default"||y==="fallback"||y==="coalesce")L+=u.find(It)??"";else if(y==="matches"){let[g="",p="",h=""]=u;if(p)try{L+=new RegExp(p,h).test(g)?"true":""}catch{L+=g.toLowerCase().includes(p.toLowerCase())?"true":""}}else if(y==="includes"||y==="contains"||y==="inlist"){let g=(u[0]??"").split(",").map((p)=>p.trim()).filter(Boolean);L+=g.includes((u[1]??"").trim())?"true":""}else if(y==="upper"||y==="uppercase"||y==="toupper")L+=(u[0]??"").toUpperCase();else if(y==="lower"||y==="lowercase"||y==="tolower")L+=(u[0]??"").toLowerCase();else if(y==="len"||y==="length")L+=String((u[0]??"").length);else if(y==="replace")L+=(u[2]??"").split(u[0]??"").join(u[1]??"");else if(y==="split"){let g=(u[0]??"").split(u[1]??","),p=Number(u[2]??0),h=p<0?g.length+p:p;L+=(g[h]??"").trim()}else if(y==="wrap"){let g=u[2]??"";L+=g?`${u[0]??""}${g}${u[1]??""}`:""}else if(y==="switch"){let g=(u[0]??"").trim(),p="";for(let h=1;h+1<u.length;h+=2)if(u[h].trim()===g){p=u[h+1];break}if(!p&&u.length%2===0)p=u[u.length-1];L+=p}else L+=S.slice(T,N);T=N}return L},M=b(t).split(`
`).map((S)=>S.trimEnd()).filter((S)=>S.trim()!=="").join(`
`).trim(),m=Number(M);if(M!==""&&Number.isFinite(m))i.value=m,i.result=m;return{text:M,locals:i,strLocals:r,missingRefs:[...d.missingRefs],error:d.error}}function As(t,n,a={},s={}){let i=t.trim();if(!i)return{value:void 0,locals:{},missingRefs:[],error:"Formula is empty"};if(i.includes("{{")&&i.includes("}}")){let f=Ps(i,n,a,s);return{value:f.text!==""&&Number.isFinite(Number(f.text))?Number(f.text):f.locals.value,textOutput:f.text||void 0,locals:f.locals,missingRefs:f.missingRefs,error:f.error}}if($s(i))return{value:void 0,locals:{},missingRefs:[],isProse:!0,error:'Plain-English rule detected — click "Convert to Local Formula" to translate it into math/macro syntax.'};let r={...s},d={missingRefs:new Set},o=i.split(/\r?\n|;/).map((f)=>f.trim()).filter((f)=>Boolean(f)&&!f.startsWith("//")&&!f.startsWith("#"));if(!o.length)return{value:void 0,locals:r,missingRefs:[],error:"Formula is empty"};let c;for(let f of o){let b=f.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([\s\S]+)$/);if(b&&!b[2].startsWith("=")){let M=b[1],m=b[2],S=je(m,r,n,d);if(S===void 0)return{value:void 0,locals:r,missingRefs:[...d.missingRefs],error:d.error};r[M]=S,c=S}else{let M=je(f,r,n,d);if(M===void 0)return{value:void 0,locals:r,missingRefs:[...d.missingRefs],error:d.error};c=M}}if(c!==void 0)r.value=c,r.result=c;return{value:c,locals:r,missingRefs:[...d.missingRefs],error:d.error}}function An(t,n,a){let s=(m,S)=>{if(!t.modifiers?.length)return 0;let L=0;for(let T of t.modifiers){if(T.statId!==m)continue;if(S?T.targetActorId===S:!T.targetActorId)L+=Number.isFinite(T.delta)?T.delta:0}return L},i={location:t.scene.location||"",time:t.scene.timeLabel||"",date:t.scene.dateLabel||"",weather:t.scene.weather||"",turn:String(t.turnCount),player_name:t.player.name||"User",player_attire:t.player.attire||"",player_condition:t.player.condition||""},r={turn:t.turnCount,elapsed_minutes:t.elapsedMinutes},d=(m,S)=>{if(typeof S==="number")return!0;if(typeof S!=="string")return!1;if(m.displayStyle==="feed_cards"||m.displayStyle==="quote_callout")return!1;let L=S.trim();if(!L||L==="None")return!1;if(L.includes(`
`)||L.length>110)return!1;return!0};if(a){i.name=a.name,i.conditions=a.conditions.join(", "),i.demeanor=a.demeanor||"",i.attire=a.attire||"";for(let[m,S]of Object.entries(a.fields))if(S)i[m]=S;for(let m of n){if(!m.enabled||m.scope!=="character")continue;let S=a.meters[m.id],L=S?.calibrated?S.value:m.defaultValue;if(i[m.id]=String(L??""),!d(m,L))continue;for(let[T,N]of Object.entries(Kt(L))){let I=T==="value"?m.id:T;if(r[I]===void 0)r[I]=N,i[I]=String(N)}}}else{i.name=t.player.name||"User",i.conditions=t.player.condition||"",i.attire=t.player.attire||"";for(let m of n){if(!m.enabled||m.scope==="character")continue;let S=t.stats[m.id],L=S?.calibrated?S.value:m.defaultValue;if(i[m.id]=String(L??""),!d(m,L))continue;for(let[T,N]of Object.entries(Kt(L))){let I=T==="value"?m.id:T;if(r[I]===void 0)r[I]=N,i[I]=String(N)}}}let o=(m,S,L,T)=>{if(S){let N=Kt(m);if(N[S]!==void 0)return N[S];return N[S.toLowerCase()]}if(typeof m==="number"&&Number.isFinite(m))return m+s(L,T);if(typeof m==="string"){let N=Number(m);if(Number.isFinite(N))return N+s(L,T)}return},c=Object.values(t.characters).find((m)=>m.present);return{ctx:{resolveRef:(m)=>{let S=m.trim();if(!S)return;if(S.startsWith("character:")){let T=S.slice(10).split("."),N=T[0],I=T[1],v=T[2];if(!N||!I)return;let x=t.characters[N];return x?o(x.meters[I]?.value,v,I,x.id):void 0}if(S.startsWith("first_present.")){let T=S.slice(14).split("."),N=T[0];if(!N||!c)return;return o(c.meters[N]?.value,T[1],N,c.id)}if(S.startsWith("self.")){let T=S.slice(5).split("."),N=T[0],I=T[1];if(a){let v=o(a.meters[N]?.value,I,N,a.id);if(v!==void 0)return v}return o(t.stats[N]?.value,I,N)}if(S.includes(".")){let[T,N]=S.split(".",2);if(T&&N){if(a&&a.meters[T]){let I=o(a.meters[T]?.value,N,T,a.id);if(I!==void 0)return I}if(t.stats[T]){let I=o(t.stats[T]?.value,N,T);if(I!==void 0)return I}}}if(a&&a.meters[S]){let T=o(a.meters[S]?.value,void 0,S,a.id);if(T!==void 0)return T}if(t.stats[S]){let T=o(t.stats[S]?.value,void 0,S);if(T!==void 0)return T}if(r[S]!==void 0)return r[S];let L=S.toLowerCase();for(let[T,N]of Object.entries(r))if(T.toLowerCase()===L)return N;return},resolveStringRef:(m)=>{let S=m.trim();if(!S)return;if(Object.prototype.hasOwnProperty.call(i,S))return i[S];let L=S.toLowerCase();for(let[T,N]of Object.entries(i))if(T.toLowerCase()===L)return N;if(a&&a.meters[S]!==void 0)return String(a.meters[S].value);if(t.stats[S]!==void 0)return String(t.stats[S].value);return},hasCond:(m)=>{let S=m.split(/[|,;]+/).map((N)=>N.trim().toLowerCase()).filter(Boolean);if(!S.length)return!1;let L=[];if(a){L.push(...a.conditions,a.demeanor,a.attire);for(let N of Object.values(a.meters))if(typeof N.value==="string")L.push(N.value)}else{L.push(t.player.condition,t.player.attire);for(let N of Object.values(t.stats))if(typeof N.value==="string")L.push(N.value)}let T=L.join(" ").toLowerCase();return S.some((N)=>T.includes(N))}},strVars:i,numVars:r}}function Es(t,n){let a=t.formulaOutputTemplate?.trim();if(a){let s=!1,i=a.replace(/\{([A-Za-z0-9_]+)\}/g,(r,d)=>{if(n.locals[d]!==void 0)return s=!0,String(n.locals[d]);let o=d.toLowerCase();for(let[c,f]of Object.entries(n.locals))if(c.toLowerCase()===o)return s=!0,String(f);return"—"});return s?i:void 0}if(n.textOutput!==void 0)return n.textOutput;if(n.value===void 0)return;return Math.max(t.min,Math.min(t.max,n.value))}function _s(t,n,a,s){let{numVars:i,strVars:r}=An(t,n,a==="character"?s:void 0),d={};for(let[o,c]of Object.entries(i))if(!Object.keys(i).some((b)=>b!==o&&b.toLowerCase()===o&&b!==b.toLowerCase()))d[o]=c;return{numTokens:d,strVars:r}}function Da(t,n,a,s){let i=t.formula?.trim()??"",r=t.scope==="character"?s?n.characters[s]:Object.values(n.characters)[0]:void 0,d=r?r.name:n.player.name||"Player",o=_s(n,a,t.scope,r);if(!i)return{locals:{},missingRefs:[],availableTokens:o.numTokens,availableStringVars:o.strVars,targetName:d};let{ctx:c,strVars:f,numVars:b}=An(n,a,r),M=As(i,c,f,b),m=Es(t,M);return{output:m,locals:M.locals,missingRefs:m!==void 0?[]:M.missingRefs,isProse:M.isProse,error:M.error,availableTokens:o.numTokens,availableStringVars:o.strVars,targetName:d}}function Ra(t){let n=[],a=0,s=null,i="";for(let r=0;r<t.length;r++){let d=t[r];if(s){if(i+=d,d==="\\"&&r+1<t.length)i+=t[++r];else if(d===s)s=null;continue}if(d==='"'||d==="'"){s=d,i+=d;continue}if(d==="("||d==="[")a++;else if((d===")"||d==="]")&&a>0)a--;else if(d===","&&a===0){n.push(i.trim()),i="";continue}i+=d}if(i.trim()||n.length)n.push(i.trim());return n}function Pn(t){let n=t.trim();if(n.startsWith('"')&&n.endsWith('"')||n.startsWith("'")&&n.endsWith("'"))return n.slice(1,-1);return n}function Ns(t,n,a,s){let i=t.localRuleFormula?.trim()??"";if(!i)return{appliedEffects:[]};let r=`category:${t.id}:${s?.id??"player"}`;a.modifiers=(a.modifiers??[]).filter((m)=>m.source!==r);let d=An(a,n,s),o={...d.numVars},c={missingRefs:new Set},f=[],b=i.split(/\r?\n|;/).map((m)=>m.trim()).filter((m)=>Boolean(m)&&!m.startsWith("//")&&!m.startsWith("#")),M=(m)=>{let S=m.match(/^if\s*\(([\s\S]+?)\)\s+(mod|set|add)\s*\(([\s\S]+)\)$/i);if(S){let I=je(S[1],o,d.ctx,c);if(I!==void 0&&I!==0&&!Number.isNaN(I))M(`${S[2]}(${S[3]})`);return}let L=m.match(/^mod\s*\(([\s\S]+)\)$/i);if(L){let I=Ra(L[1]);if(I.length<3){c.error="mod() requires (statId, label, deltaExpression)";return}let v=Pn(I[0]),x=Pn(I[1])||t.name,_=je(I.slice(2).join(","),o,d.ctx,c);if(_===void 0||_===0)return;let y={id:`catmod_${ie(t.id)}_${ie(s?.id??"player")}_${ie(v)}_${ie(x)}`,label:x,statId:v,...s?{targetActorId:s.id}:{},delta:Math.round(_),source:r};a.modifiers.push(y),f.push(`${s?`${s.name} · `:""}${v} ${y.delta>=0?`+${y.delta}`:y.delta} (${x})`);return}let T=m.match(/^(set|add)\s*\(([\s\S]+)\)$/i);if(T){let I=T[1].toLowerCase(),v=Ra(T[2]);if(v.length<2){c.error=`${I}() requires (statId, expression)`;return}let x=Pn(v[0]),_=je(v.slice(1).join(","),o,d.ctx,c);if(_===void 0)return;let k=n.find((y)=>y.id===x);if(s&&(k?.scope==="character"||s.meters[x])){let y=s.meters[x];if(y?.locked||k?.locked)return;let u=typeof y?.value==="number"?y.value:0,g=I==="add"?u+_:_,p=k?Math.max(k.min,Math.min(k.max,Math.round(g))):Math.round(g);s.meters[x]={value:p,calibrated:!0,locked:!1,lastReason:`Category rule: ${t.name}`},f.push(`${s.name} · ${x} = ${p}`)}else if(k&&k.scope!=="character"){let y=a.stats[x];if(y?.locked||k.locked)return;let u=typeof y?.value==="number"?y.value:0,g=I==="add"?u+_:_,p=Math.max(k.min,Math.min(k.max,Number(g.toFixed(2))));a.stats[x]={id:x,scope:k.scope,value:p,calibrated:!0,locked:!1,lastReason:`Category rule: ${t.name}`},f.push(`${x} = ${p}`)}return}let N=m.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([\s\S]+)$/);if(N&&!N[2].startsWith("=")){let I=N[1],v=je(N[2],o,d.ctx,c);if(v!==void 0)o[I]=v}};for(let m of b)if(M(m),c.error)break;return{appliedEffects:f,error:c.error}}function Fa(t,n,a,s){let i=structuredClone(n),o=a.filter((c)=>c.enabled&&c.categoryId===t.id).some((c)=>c.scope==="character")||/\bmod\s*\(|\bself\./i.test(t.localRuleFormula??"")?s?i.characters[s]:Object.values(i.characters)[0]:void 0;return Ns(t,a,i,o)}function Ue(t,n){if(!t||!t.length)return"";let a=[...t].sort((s,i)=>i.value-s.value);for(let s of a)if(n>=s.value)return s.label;return a.at(-1)?.label??""}function ct(t){let n=Math.max(0,Math.round(t))+480,a=Math.floor(n%1440/60),s=n%60,i=a>=12?"PM":"AM",r=a%12===0?12:a%12;return`${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")} ${i}`}function Ha(t){return`Day ${Math.floor(Math.max(0,t)/1440)+1} · ${ct(t)}`}function Ne(t){let n=Math.floor(Math.max(0,t.elapsedMinutes)/1440)+1,a=t.scene.timeLabel?.trim()||ct(t.elapsedMinutes),s=t.scene.dateLabel?.trim()||`Day ${n}`,i=t.scene.location?.trim()||t.title||"Uncharted Scene",r=t.scene.weather?.trim()||"Clear";return{time:a,date:s,location:i,weather:r,formatted:`[ \uD83D\uDD70️ ${a} | \uD83D\uDCC5 ${s} | \uD83D\uDCCD ${i} | \uD83C\uDF26️ ${r} ]`}}function he(t,n){let a=t.fields[n];if(a&&a.trim())return a.trim();if(n==="role_summary")return t.roleSummary||"";if(n==="demeanor")return t.demeanor||"";if(n==="inner_thought")return t.innerThought||"";if(n==="immediate_goal")return t.immediateGoal||"";if(n==="attire_layers")return t.attire||"";return""}function $t(t,n){let a=t.dossierFields.find((s)=>s.id===n);return a?a.enabled:!1}function Lt(t){if(["text","tags","tier","skill_tree","xp_level","attributes","inventory","status_fx"].includes(t.kind))return!0;if(t.displayStyle&&t.displayStyle!=="auto")return!0;return/\[[^\]]*\]|->|→|\b(?:format|write\s+in|write\s+this|saw\/heard|impulse\s*:)\b/i.test(t.triggerCues)}function Pt(t,n=""){let a=`${t} ${n}`.toLowerCase();if(/\b(?:sister|brother|sibling|mother|mom|father|dad|parent|son|daughter|cousin|aunt|uncle|family|twin|niece|nephew|guardian)\b/.test(a))return"family";if(/\b(?:lover|partner|wife|husband|spouse|fianc[eé]e?|boyfriend|girlfriend|crush|sweetheart|romantic|beloved|infatuat)\b/.test(a))return"romance";if(/\b(?:rival|enemy|nemesis|hostile|antagonist|foe|hatred|bitter|estranged|ex-|ex\b|adversary|suspicious|threat)\b/.test(a))return"rival";if(/\b(?:boss|employer|employee|subordinate|maid|butler|servant|retainer|master|teacher|student|mentor|apprentice|client|doctor|colleague|coworker|captain|commander)\b/.test(a))return"professional";if(/\b(?:friend|best\s+friend|ally|companion|confidant|buddy|comrade|roommate|childhood|pal|trusted|protector)\b/.test(a))return"friend";return"neutral"}var ce="player",Gt="web",Pe={family:{icon:"\uD83D\uDC9B",label:"Family",color:"#f59e0b"},friend:{icon:"\uD83D\uDC99",label:"Friend / Ally",color:"#38bdf8"},romance:{icon:"\uD83E\uDE77",label:"Romance",color:"#f472b6"},rival:{icon:"❤️",label:"Rival / Tense",color:"#f43f5e"},professional:{icon:"\uD83D\uDCBC",label:"Work / Duty",color:"#a78bfa"},neutral:{icon:"⚪",label:"Acquaintance",color:"#94a3b8"}},En=["Best Friend","Protective Sister","Younger Brother","Childhood Friend","Trusted Ally","Romantic Interest","Partner / Lover","Rival","Suspicious Stranger","Employer / Boss","Loyal Retainer"];function Rs(t){let n=t.trim().split(/\s+/).filter(Boolean);if(n.length>=2)return`${n[0][0]??""}${n[1][0]??""}`.toUpperCase();return(t.trim().slice(0,2)||"?").toUpperCase()}function dt(t){if(t.bondToPlayer?.label)return{...t.bondToPlayer,category:t.bondToPlayer.category??Pt(t.bondToPlayer.label,t.bondToPlayer.note)};let n=t.fields.bond_dynamic||t.roleSummary||"Acquaintance";return{label:n,category:Pt(n)}}function _n(t){if(t.bondFromPlayer?.label)return{...t.bondFromPlayer,category:t.bondFromPlayer.category??Pt(t.bondFromPlayer.label,t.bondFromPlayer.note)};return{label:"Not defined yet",category:"neutral"}}function Wa(t,n){let a=t.snapshot.state.player.name||"You",s=_n(n),i=dt(n);t.modals.open({title:`\uD83D\uDD17 Edit Bond: ${a} ⇄ ${n.name}`,width:560},(r,d)=>{let o=e("label","ls-label",`Your Bond to ${n.name} (${a} → ${n.name})`),c=e("input","ls-input");c.placeholder="e.g. Younger Brother, Best Friend, Wary Ally…",c.value=s.label==="Not defined yet"?"":s.label,o.append(c);let f=e("div","ls-row");for(let y of En.slice(0,6))f.append(B(y,()=>{c.value=y},"ls-btn-sm ls-quick-pill"));o.append(f);let b=e("label","ls-label",`Why / Note for ${a} → ${n.name} (Optional)`),M=e("input","ls-input");M.placeholder="e.g. Relies on her for advice…",M.value=s.note??"",b.append(M);let m=e("label","ls-label",`${n.name}'s Bond to You (${n.name} → ${a})`),S=e("input","ls-input");S.placeholder="e.g. Protective Elder Sister, Strict Boss…",S.value=i.label,m.append(S);let L=e("div","ls-row");for(let y of En.slice(0,6))L.append(B(y,()=>{S.value=y},"ls-btn-sm ls-quick-pill"));m.append(L);let T=e("label","ls-label",`Why / Note for ${n.name} → ${a} (Optional)`),N=e("input","ls-input");N.placeholder="e.g. Secretly worries about you…",N.value=i.note??"",T.append(N);let I=i.category??s.category??"neutral",v=e("div","ls-label","Bond Type / Color"),x=e("div","ls-row"),_=()=>{for(let y of[...x.querySelectorAll("button")])y.setAttribute("aria-current",y.dataset.cat===I?"page":"false")};for(let[y,u]of Object.entries(Pe)){let g=B(`${u.icon} ${u.label}`,()=>{I=y,_()},"ls-btn-sm");g.dataset.cat=y,x.append(g)}_(),v.append(x);let k=B("\uD83D\uDCBE Save Two-Way Bond",()=>{let y=c.value.trim(),u=S.value.trim()||n.roleSummary||"Acquaintance";t.request("state:mutate",{patch:{characters:[{id:n.id,name:n.name,roleSummary:u,bondToPlayer:{label:u,...N.value.trim()?{note:N.value.trim()}:{},category:I},...y?{bondFromPlayer:{label:y,...M.value.trim()?{note:M.value.trim()}:{},category:I}}:{}}]},reason:`Updated bond ${a} ⇄ ${n.name}`}),d()},"ls-btn-primary");r.append(o,b,m,T,v,k)})}function Va(t){return t.filter((n)=>n.enabled&&n.scope==="character"&&["meter","number","clock","pips","hearts","currency"].includes(n.kind)&&!(n.displayStyle&&n.displayStyle!=="auto"))}function Oa(t,n){if(!t)return null;let a=new Map(n.map((r)=>[r.id,r])),s=Object.entries(t).filter(([r,d])=>{let o=a.get(r);if(!o||!o.enabled)return!1;return d!==void 0&&d!==""&&d!=="None"});if(!s.length)return null;let i=e("div","ls-cast-mini-grid");i.style.marginTop="4px";for(let[r,d]of s){let o=a.get(r),c=e("div","ls-cast-mini-meter");c.style.setProperty("--ls-bar-color",o.color||"var(--ls-primary)");let f=e("div","ls-row-between");if(f.append(e("small","ls-muted",`${o.icon} ${o.label}`),e("strong","",String(d))),c.append(f),typeof d==="number"){let b=Math.max(1,o.max-o.min),M=e("div","ls-bar-track"),m=e("div","ls-bar-fill");if(o.min<0&&o.max>0){M.dataset.bipolar="true";let S=(0-o.min)/b*100;if(d>=0)m.style.marginLeft=`${S.toFixed(1)}%`,m.style.width=`${Math.min(100-S,d/o.max*(100-S)).toFixed(1)}%`;else{let L=Math.abs(d)/Math.abs(o.min)*S;m.style.marginLeft=`${Math.max(0,S-L).toFixed(1)}%`,m.style.width=`${Math.min(S,L).toFixed(1)}%`,m.style.background="var(--ls-danger)"}}else{let S=Math.max(0,Math.min(100,Math.round((d-o.min)/b*100)));m.style.width=`${S}%`}M.append(m),c.append(M)}i.append(c)}return i}function qe(t,n,a){let{state:s,template:i}=t.snapshot,r=Object.values(s.characters).filter((o)=>o.id!==n.id),d=Va(i.stats);t.modals.open({title:a?`\uD83E\uDD1D Edit NPC Bond: ${n.name} ⇄ ${a.toName}`:`➕ Add Bond from ${n.name} to Another NPC`,width:560},(o,c)=>{let f=e("label","ls-label",`Other Character (${n.name} → ?)`),b=e("input","ls-input");if(b.placeholder=r.length?`e.g. ${r.map((C)=>C.name).join(", ")} or another NPC name`:"Enter NPC name…",b.value=a?.toName??(r[0]?.name??""),f.append(b),r.length>0){let C=e("div","ls-row");for(let l of r)C.append(B(`\uD83D\uDC64 ${l.name}`,()=>{b.value=l.name},"ls-btn-sm"));f.append(C)}let M=e("label","ls-label",`${n.name}'s Relation to Them`),m=e("input","ls-input");m.placeholder="e.g. Older Sister, Ex-Fiancé, Rival, Boss…",m.value=a?.label??"",M.append(m);let S=e("div","ls-row");for(let C of En.slice(0,6))S.append(B(C,()=>{m.value=C},"ls-btn-sm ls-quick-pill"));M.append(S);let L=e("label","ls-label","Why / Dynamic Note (Optional)"),T=e("input","ls-input");T.placeholder="e.g. Still bitter about what happened last summer…",T.value=a?.attitude??"",L.append(T);let I=(a?s.characters[a.toId]:r[0])?.peerBonds?.[n.id],v=new Map;if(d.length>0){let C=e("div","ls-label",`${n.name}'s Stats Toward Them`),l=e("div","ls-grid");for(let w of d){let P=a?.meters?.[w.id]??w.defaultValue,R=e("label","ls-label",`${w.icon} ${w.label} (${w.min}..${w.max})`),A=e("input","ls-input");A.type="number",A.min=String(w.min),A.max=String(w.max),A.step=String(w.step||1),A.value=String(typeof P==="number"?P:w.defaultValue),R.append(A),l.append(R),v.set(w.id,A)}C.append(l),o.append(C)}let x=e("label","ls-label",`Their Relation Back to ${n.name} (Optional)`),_=e("input","ls-input");_.placeholder="e.g. Younger Brother, Loyal Friend…",_.value=I?.label??"",x.append(_);let k=new Map;if(d.length>0){let C=e("div","ls-label",`Their Stats Back Toward ${n.name} (Optional)`),l=e("div","ls-grid");for(let w of d){let P=I?.meters?.[w.id]??w.defaultValue,R=e("label","ls-label",`${w.icon} ${w.label} (${w.min}..${w.max})`),A=e("input","ls-input");A.type="number",A.min=String(w.min),A.max=String(w.max),A.step=String(w.step||1),A.value=String(typeof P==="number"?P:w.defaultValue),R.append(A),l.append(R),k.set(w.id,A)}C.append(l),x.append(C)}let y=a?.category??Pt(a?.label??"",a?.attitude??""),u=e("div","ls-label","Bond Type / Color"),g=e("div","ls-row"),p=()=>{for(let C of[...g.querySelectorAll("button")])C.setAttribute("aria-current",C.dataset.cat===y?"page":"false")};for(let[C,l]of Object.entries(Pe)){let w=B(`${l.icon} ${l.label}`,()=>{y=C,p()},"ls-btn-sm");w.dataset.cat=C,g.append(w)}p(),u.append(g);let h=B("\uD83D\uDCBE Save NPC Bond",()=>{let C=b.value.trim();if(!C)return;let l=m.value.trim()||"Acquaintance",w=T.value.trim(),P={};for(let E of d){let D=Number(v.get(E.id)?.value);if(Number.isFinite(D))P[E.id]=Math.max(E.min,Math.min(E.max,Math.round(D)))}let R=[{id:n.id,name:n.name,peerBonds:[{target:C,label:l,attitude:w,category:y,meters:P}]}],A=_.value.trim();if(A){let E={};for(let D of d){let F=Number(k.get(D.id)?.value);if(Number.isFinite(F))E[D.id]=Math.max(D.min,Math.min(D.max,Math.round(F)))}R.push({name:C,peerBonds:[{target:n.name,label:A,attitude:I?.attitude??"",category:y,meters:E}]})}t.request("state:mutate",{patch:{characters:R},reason:`Updated bond ${n.name} ⇄ ${C}`}),c()},"ls-btn-primary");o.append(f,M,L,x,u,h)})}function Zt(t,n){let{state:a,template:s}=t.snapshot,i=Va(s.stats),r=e("div","ls-stack"),d=Object.values(a.characters),o=a.player.name||"You";if(ce!=="player"&&ce!=="all"&&!a.characters[ce])ce="player";let c=e("div","ls-row-between"),f=e("div","ls-row");f.append(e("span","ls-kicker","Focus:"));let b=B(`\uD83D\uDC64 ${o}`,()=>{ce="player",t.emitChange()},"ls-btn-sm");if(ce==="player")b.setAttribute("aria-current","page");f.append(b);for(let x of d){let _=B(`${x.present?"\uD83D\uDFE2":"⚪"} ${x.name}`,()=>{ce=x.id,t.selectedActorId=x.id,t.emitChange()},"ls-btn-sm");if(ce===x.id)_.setAttribute("aria-current","page");f.append(_)}if(d.length>=2){let x=B("\uD83D\uDD78️ Full Web",()=>{ce="all",t.emitChange()},"ls-btn-sm");if(ce==="all")x.setAttribute("aria-current","page");f.append(x)}let M=e("div","ls-row");if(M.append(B(Gt==="web"?"\uD83D\uDCCB Cards Only":"\uD83D\uDD78️ Show Map",()=>{Gt=Gt==="web"?"cards":"web",t.emitChange()},"ls-btn-sm")),d.length>0){let x=(ce!=="player"&&ce!=="all"?a.characters[ce]:void 0)??(t.selectedActorId?a.characters[t.selectedActorId]:void 0)??d[0];M.append(B("+ Add NPC Bond",()=>qe(t,x),"ls-btn-sm ls-btn-primary"))}if(c.append(f,M),r.append(c),!d.length){let x=e("div","ls-card");return x.append(e("strong","","Bond Web Ready"),e("p","ls-muted","Once characters appear in chat, your two-way relations with them and their relations with each other will appear here.")),r.append(x),r}let m=e("div","ls-web-legend"),S=e("div","ls-row");for(let x of Object.values(Pe)){let _=e("span","ls-web-legend-item"),k=e("span","ls-web-swatch");k.style.background=x.color,_.append(k,document.createTextNode(`${x.icon} ${x.label}`)),S.append(_)}if(m.append(S),r.append(m),Gt==="web"){let x=e("div","ls-bw-stage"),_="http://www.w3.org/2000/svg",k=document.createElementNS("http://www.w3.org/2000/svg","svg");k.setAttribute("viewBox","0 0 100 100"),k.setAttribute("preserveAspectRatio","none"),k.classList.add("ls-bw-svg");let y=[];if(ce==="player")y.push({id:"player",name:o,isPlayer:!0,present:!0,xPct:50,yPct:d.length===1?18:50,color:"#38bdf8"}),d.forEach((h,C)=>{let l=dt(h),w=Pe[l.category??"neutral"],P=50,R=82;if(d.length===1)P=50,R=82;else if(d.length===2)P=C===0?15:85,R=50;else{let A=C/d.length*Math.PI*2-Math.PI/2;P=50+Math.cos(A)*38,R=50+Math.sin(A)*35}y.push({id:h.id,name:h.name,isPlayer:!1,present:h.present,portraitUrl:h.portraitUrl,xPct:Number(P.toFixed(1)),yPct:Number(R.toFixed(1)),color:w.color})});else if(ce!=="all"&&a.characters[ce]){let h=a.characters[ce],C=[{id:"player",name:o,isPlayer:!0,present:!0},...d.filter((l)=>l.id!==h.id).map((l)=>({id:l.id,name:l.name,isPlayer:!1,present:l.present,portraitUrl:l.portraitUrl}))];y.push({id:h.id,name:h.name,isPlayer:!1,present:h.present,portraitUrl:h.portraitUrl,xPct:50,yPct:C.length===1?18:50,color:"#38bdf8"}),C.forEach((l,w)=>{let P=50,R=82;if(C.length===1)P=50,R=82;else if(C.length===2)P=w===0?15:85,R=50;else{let E=w/C.length*Math.PI*2-Math.PI/2;P=50+Math.cos(E)*38,R=50+Math.sin(E)*35}let A=l.isPlayer?dt(h).category??"neutral":h.peerBonds?.[l.id]?.category??a.characters[l.id]?.peerBonds?.[h.id]?.category??"neutral";y.push({id:l.id,name:l.name,isPlayer:l.isPlayer,present:l.present,portraitUrl:l.portraitUrl,xPct:Number(P.toFixed(1)),yPct:Number(R.toFixed(1)),color:Pe[A].color})})}else{let h=[{id:"player",name:o,isPlayer:!0,present:!0,portraitUrl:void 0},...d.map((C)=>({id:C.id,name:C.name,isPlayer:!1,present:C.present,portraitUrl:C.portraitUrl}))];h.forEach((C,l)=>{let w=l/h.length*Math.PI*2-Math.PI/2,P=50+Math.cos(w)*37,R=50+Math.sin(w)*35,A=C.isPlayer?void 0:a.characters[C.id],E=A?dt(A).category??"neutral":"friend";y.push({id:C.id,name:C.name,isPlayer:C.isPlayer,present:C.present,portraitUrl:C.portraitUrl,xPct:Number(P.toFixed(1)),yPct:Number(R.toFixed(1)),color:Pe[E].color})})}let u=new Map(y.map((h)=>[h.id,h])),g=(h,C,l,w,P,R,A=0)=>{let E=(h.xPct+C.xPct)/2,D=(h.yPct+C.yPct)/2,F=C.xPct-h.xPct,W=C.yPct-h.yPct,V=Math.max(1,Math.hypot(F,W)),O=E+-W/V*A,H=D+F/V*A,U=document.createElementNS("http://www.w3.org/2000/svg","path");if(U.setAttribute("d",`M ${h.xPct} ${h.yPct} Q ${O.toFixed(1)} ${H.toFixed(1)} ${C.xPct} ${C.yPct}`),U.setAttribute("fill","none"),U.setAttribute("stroke",l),U.setAttribute("stroke-width","0.8"),U.setAttribute("stroke-opacity","0.82"),k.append(U),w.length>0){let z=0.25*h.xPct+0.5*O+0.25*C.xPct,j=0.25*h.yPct+0.5*H+0.25*C.yPct,K=e("div","ls-bw-edge-pill");K.style.setProperty("--ls-bond-color",l),K.style.left=`${Math.max(15,Math.min(85,z)).toFixed(1)}%`,K.style.top=`${Math.max(14,Math.min(86,j)).toFixed(1)}%`,K.title=P;for(let Y of w)K.append(e("span","ls-bw-edge-line",Y));K.addEventListener("click",(Y)=>{Y.stopPropagation(),R()}),x.append(K)}},p=(h,C,l,w)=>{let P=dt(h),R=_n(h),A=P.category??R.category??"neutral",E=Pe[A].color,F=[P.label&&P.label!=="Acquaintance"?P.label:R.label!=="Not defined yet"?R.label:P.label],W=`You → ${h.name}: ${R.label}
${h.name} → You: ${P.label}`;g(C,l,E,F,W,()=>Wa(t,h),w?-8:0)};if(ce==="player"){let h=u.get("player");for(let C of d){let l=u.get(C.id);if(l)p(C,h,l,!1)}}else if(ce!=="all"&&a.characters[ce]){let h=a.characters[ce],C=u.get(h.id),l=u.get("player");if(l)p(h,l,C,!1);for(let w of d){if(w.id===h.id)continue;let P=u.get(w.id);if(!P)continue;let R=h.peerBonds?.[w.id],A=w.peerBonds?.[h.id];if(!R&&!A)continue;let E=R?.category??A?.category??"neutral",D=[R?`${h.name} → ${w.name}: ${R.label}`:"",A?`${w.name} → ${h.name}: ${A.label}`:""].filter(Boolean),F=R?.label||A?.label||"Acquaintance";g(C,P,Pe[E].color,[F],D.join(`
`),()=>qe(t,h,R),0)}}else{let h=u.get("player");for(let l of d){let w=u.get(l.id);if(w)p(l,h,w,!0)}let C=new Set;for(let l of d){let w=u.get(l.id);if(!w)continue;for(let P of Object.values(l.peerBonds??{})){let R=u.get(P.toId);if(!R)continue;let A=[l.id,P.toId].sort().join("::");if(C.has(A))continue;C.add(A);let E=a.characters[P.toId]?.peerBonds?.[l.id],D=P.category??E?.category??"neutral",F=[`${l.name} → ${P.toName}: ${P.label}`,...E?[`${P.toName} → ${l.name}: ${E.label}`]:[]];g(w,R,Pe[D].color,[P.label||E?.label||"Peer"],F.join(`
`),()=>qe(t,l,P),16)}}}x.prepend(k);for(let h of y){let C=h.id===ce,l=e("button","ls-bw-node");l.type="button",l.dataset.focal=String(C),l.style.left=`${h.xPct}%`,l.style.top=`${h.yPct}%`,l.style.setProperty("--ls-bond-color",h.color),l.title=`Click to focus ${h.name}'s bonds`;let w=e("div","ls-bw-avatar");if(h.portraitUrl){let P=e("img");P.src=h.portraitUrl,P.alt=h.name,w.append(P)}else w.append(document.createTextNode(h.isPlayer?"\uD83D\uDC64":Rs(h.name)));if(!h.isPlayer)w.append(e("span",`ls-roster-dot ${h.present?"is-present":"is-away"}`));l.append(w,e("span","ls-bw-name",h.name)),l.addEventListener("click",()=>{if(ce=h.isPlayer?"player":h.id,!h.isPlayer)t.selectedActorId=h.id;t.emitChange()}),x.append(l)}r.append(x)}let L=ce!=="player"&&ce!=="all"&&a.characters[ce]?[a.characters[ce]]:d,T=e("div","ls-stack");T.append(e("span","ls-kicker",`\uD83D\uDC64 Your Bonds (${o} ⇄ Cast)`));for(let x of L){let _=dt(x),k=_n(x),y=_.category??k.category??"neutral",u=Pe[y],g=e("div","ls-bw-pair-card");g.style.setProperty("--ls-bond-color",u.color);let p=e("div","ls-row-between"),h=e("div","ls-row");h.append(e("strong","",`${o} ⇄ ${x.name}`),e("span","ls-bw-cat-chip",`${u.icon} ${u.label}`)),h.lastElementChild.style.setProperty("--ls-bond-color",u.color);let C=e("div","ls-row");C.append(B("✏️ Edit Bond",()=>Wa(t,x),"ls-btn-sm"),B("\uD83E\uDEAA Dossier",()=>n(x.id),"ls-btn-sm ls-btn-primary")),p.append(h,C),g.append(p);let l=e("div","ls-bw-two-col"),w=e("div","ls-bw-dir-box");w.append(e("small","ls-kicker",`Your Bond → ${x.name}`),e("strong","",k.label),...k.note?[e("small","ls-muted",k.note)]:[]);let P=e("div","ls-bw-dir-box");P.append(e("small","ls-kicker",`${x.name}'s Bond → You`),e("strong","",_.label),..._.note?[e("small","ls-muted",_.note)]:[]),l.append(w,P),g.append(l),T.append(g)}r.append(T);let N=[],I=new Set;for(let x of L){for(let[_,k]of Object.entries(x.peerBonds??{})){let y=a.characters[_];if(!y)continue;let u=[x.id,y.id].sort().join("::");if(I.has(u))continue;I.add(u),N.push({a:x,b:y,aToB:k,bToA:y.peerBonds?.[x.id]})}for(let _ of d){if(_.id===x.id)continue;let k=_.peerBonds?.[x.id];if(!k)continue;let y=[x.id,_.id].sort().join("::");if(I.has(y))continue;I.add(y),N.push({a:x,b:_,aToB:x.peerBonds?.[_.id],bToA:k})}}let v=e("div","ls-stack");if(v.append(e("span","ls-kicker",`\uD83E\uDD1D Cast Bonds (NPC ⇄ NPC · ${N.length})`)),!N.length)v.append(e("p","ls-muted",'No NPC-to-NPC bonds recorded yet. They appear automatically when characters have an established relation in the story, or click "+ Add NPC Bond" above.'));else for(let x of N){let _=x.aToB?.category??x.bToA?.category??"neutral",k=Pe[_],y=e("div","ls-bw-pair-card");y.style.setProperty("--ls-bond-color",k.color);let u=e("div","ls-row-between"),g=e("div","ls-row");g.append(e("strong","",`${x.a.name} ⇄ ${x.b.name}`),e("span","ls-bw-cat-chip",`${k.icon} ${k.label}`)),g.lastElementChild.style.setProperty("--ls-bond-color",k.color);let p=e("div","ls-row");p.append(B("✏️ Edit Bond",()=>qe(t,x.a,x.aToB),"ls-btn-sm"),B("\uD83D\uDDD1️",()=>{let R=structuredClone(a.characters);if(R[x.a.id]?.peerBonds)delete R[x.a.id].peerBonds[x.b.id];if(R[x.b.id]?.peerBonds)delete R[x.b.id].peerBonds[x.a.id];t.request("state:mutate",{stateOverride:{characters:R},reason:`Removed bond ${x.a.name} ⇄ ${x.b.name}`})},"ls-btn-sm ls-btn-icon ls-btn-danger","Delete NPC bond")),u.append(g,p),y.append(u);let h=e("div","ls-bw-two-col"),C=e("div","ls-bw-dir-box");C.append(e("small","ls-kicker",`${x.a.name} → ${x.b.name}`),e("strong","",x.aToB?.label||"Not defined yet"),...x.aToB?.attitude?[e("small","ls-muted",x.aToB.attitude)]:[]);let l=Oa(x.aToB?.meters,i);if(l)C.append(l);let w=e("div","ls-bw-dir-box");w.append(e("small","ls-kicker",`${x.b.name} → ${x.a.name}`),e("strong","",x.bToA?.label||"Not defined yet"),...x.bToA?.attitude?[e("small","ls-muted",x.bToA.attitude)]:[]);let P=Oa(x.bToA?.meters,i);if(P)w.append(P);h.append(C,w),y.append(h),v.append(y)}return r.append(v),r}var za=new Map;function Xt(t){let n=t.trim();if(!n.startsWith("{")&&!n.startsWith("["))return null;try{let a=JSON.parse(n);return a&&typeof a==="object"?a:null}catch{return null}}function Bs(t){let n=String(t??"").trim(),a=Xt(n);if(a&&Array.isArray(a.nodes)){let c=Math.max(0,Math.round(Number(a.sp??a.skillPoints??a.points??0)||0)),f=a.nodes.filter((b)=>Boolean(b&&typeof b==="object")).map((b)=>{let M=Math.max(0,Math.round(Number(b.level??0)||0)),m=Math.max(1,Math.round(Number(b.maxLevel??b.max??5)||5));return{name:String(b.name??"Skill").trim(),level:Math.min(m,M),maxLevel:m,cost:Math.max(1,Math.round(Number(b.cost??1)||1)),...typeof b.requires==="string"&&b.requires.trim()?{requires:b.requires.trim()}:{},...typeof b.bonus==="string"&&b.bonus.trim()?{bonus:b.bonus.trim()}:{},unlocked:M>0||b.unlocked===!0}});return{sp:c,nodes:f}}let s=0,i=n,r=n.match(/^(?:SP|Skill\s*Points?|Points?)\s*:\s*(\d+)\s*(?:\||;|\n|$)/i);if(r)s=Math.max(0,Math.round(Number(r[1])||0)),i=n.slice(r[0].length).trim();let d=[],o=i.split(/\s*(?:;|\n|\|)\s*/).map((c)=>c.trim()).filter(Boolean);for(let c of o){let f=c.match(/^([^(\[]+?)\s*(?:\(([^)]+)\)|\[([^\]]+)\])?$/),b=(f?.[1]??c).trim(),M=(f?.[2]??f?.[3]??"").trim();if(!b||/^(?:none|default)$/i.test(b))continue;let m=0,S=5,L=1,T="",N=[];for(let I of M.split(/\s*,\s*/).map((v)=>v.trim()).filter(Boolean)){let v=I.match(/^(?:lv\.?|lvl|rank)?\s*(\d+)\s*(?:\/\s*(\d+))?$/i),x=I.match(/^cost\s*:\s*(\d+)$/i),_=I.match(/^req(?:uires)?\s*:\s*(.+)$/i);if(v){if(m=Math.max(0,Number(v[1])||0),v[2])S=Math.max(1,Number(v[2])||5)}else if(x)L=Math.max(1,Number(x[1])||1);else if(_)T=_[1].trim();else N.push(I)}d.push({name:b,level:Math.min(S,m),maxLevel:S,cost:L,...T?{requires:T}:{},...N.length?{bonus:N.join(", ")}:{},unlocked:m>0})}return{sp:s,nodes:d}}function ja(t){let n=t.nodes.map((a)=>{let s=[`Lv.${a.level}/${a.maxLevel}`,`cost:${a.cost}`];if(a.requires)s.push(`req:${a.requires}`);if(a.bonus)s.push(a.bonus);return`${a.name} (${s.join(", ")})`});return`SP: ${t.sp}${n.length?` | ${n.join(" ; ")}`:""}`}function pt(t,n,a,s){let i=Bs(n),r=e("div","ls-rpg-skill-wrap"),d=e("div","ls-row-between"),o=e("span","ls-rpg-sp-badge",`✦ ${i.sp} Skill Point${i.sp===1?"":"s"}`);if(d.append(o),!a&&s){let b=e("div","ls-row");b.append(B("+1 SP",()=>{let M={...i,sp:i.sp+1};s(ja(M),`Granted +1 SP to ${t.label}`)},"ls-btn-sm")),d.append(b)}if(r.append(d),!i.nodes.length)return r.append(e("small","ls-muted",'No skill nodes yet. Format: "SP: 2 | Slash (Lv.1/5, cost:1) ; Parry (Lv.0/3, cost:1, req:Slash)"')),r;let c=new Map(i.nodes.map((b)=>[b.name.toLowerCase(),b.level])),f=e("div","ls-rpg-skill-grid");for(let[b,M]of i.nodes.entries()){let m=!M.requires||(c.get(M.requires.toLowerCase())??0)>0,S=M.level>=M.maxLevel,L=!a&&Boolean(s)&&m&&!S&&i.sp>=M.cost,T=e("div","ls-rpg-skill-node");T.dataset.unlocked=String(M.level>0),T.dataset.lockedReq=String(!m),T.dataset.maxed=String(S);let N=e("div","ls-row-between");N.append(e("strong","",`${S?"★ ":M.level>0?"◆ ":"◇ "}${M.name}`),e("span","ls-chip ls-chip-accent",`Lv.${M.level}/${M.maxLevel}`)),T.append(N);let I=e("div","ls-clock-bar");I.style.gridTemplateColumns=`repeat(${Math.min(10,M.maxLevel)}, 1fr)`;for(let v=1;v<=Math.min(10,M.maxLevel);v++)I.append(e("span",`ls-clock-seg${v<=M.level?" is-filled":""}`));if(T.append(I),M.bonus||M.requires){let v=[M.requires?`${m?"✓":"\uD83D\uDD12"} Req: ${M.requires}`:"",M.bonus||""].filter(Boolean);T.append(e("small","ls-muted",v.join(" · ")))}if(!a&&s){let v=e("div","ls-row-between");v.append(e("small","ls-muted",S?"MASTERED":`Cost: ${M.cost} SP`));let x=B(S?"✓ Max":`+ Rank (${M.cost} SP)`,()=>{let _=i.nodes.map((y,u)=>u===b?{...y,level:y.level+1,unlocked:!0}:y),k={sp:Math.max(0,i.sp-M.cost),nodes:_};s(ja(k),`Upgraded ${M.name} to Lv.${M.level+1}`)},`ls-btn-sm ${L?"ls-btn-primary":""}`);x.disabled=!L,v.append(x),T.append(v)}f.append(T)}return r.append(f),r}function Ds(t){let n=String(t??"").trim(),a=Xt(n);if(a&&!Array.isArray(a)){let f=Math.max(1,Math.round(Number(a.level??a.lv??1)||1)),b=Math.max(0,Math.round(Number(a.xp??a.current??0)||0)),M=Math.max(1,Math.round(Number(a.nextXp??a.max??f*100)||100));return{level:f,xp:b,nextXp:M,...typeof a.rank==="string"&&a.rank.trim()?{rank:a.rank.trim()}:{}}}let s=n.match(/(?:lv\.?|level)\s*(\d+)/i),i=n.match(/(\d+)\s*\/\s*(\d+)\s*(?:xp)?/i),r=n.match(/(?:rank|tier)\s*[:\-]?\s*([A-Za-z0-9+]+)/i),d=Math.max(1,Number(s?.[1]??1)||1),o=Math.max(0,Number(i?.[1]??(Number(n)||0))||0),c=Math.max(1,Number(i?.[2]??d*100)||100);return{level:d,xp:o,nextXp:c,...r?.[1]?{rank:r[1]}:{}}}function ut(t,n){let a=Ds(n),s=Math.max(0,Math.min(100,Math.round(a.xp/Math.max(1,a.nextXp)*100))),i=e("div","ls-rpg-xp-wrap"),r=e("div","ls-row-between"),d=e("span","ls-rpg-level-crest",`LV. ${a.level}`),o=e("div","ls-row");if(a.rank)o.append(e("span","ls-chip ls-chip-accent",`Rank ${a.rank}`));o.append(e("small","ls-muted",`${a.xp.toLocaleString()} / ${a.nextXp.toLocaleString()} XP (${s}%)`)),r.append(d,o);let c=e("div","ls-bar-track ls-rpg-xp-track"),f=e("div","ls-bar-fill");return f.style.width=`${s}%`,f.style.setProperty("--ls-bar-color",t.color||"var(--ls-primary)"),c.append(f),i.append(r,c),i}function Fs(t,n=20){let a=String(t??"").trim(),s=Xt(a);if(s&&!Array.isArray(s))return Object.entries(s).filter(([,r])=>Number.isFinite(Number(r))).map(([r,d])=>{let o=Number(d);return{name:r,value:o,max:Math.max(n,o)}});let i=[];for(let r of a.split(/[,;\n|]+/).map((d)=>d.trim()).filter(Boolean)){let d=r.match(/^([A-Za-z0-9_ .-]{1,20})\s*[:=]\s*(-?\d+(?:\.\d+)?)(?:\s*\/\s*(\d+))?$/);if(d){let o=Number(d[2]),c=d[3]?Math.max(1,Number(d[3])):Math.max(n,o);i.push({name:d[1].trim(),value:o,max:c})}}return i}function Hs(t,n){let s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.setAttribute("viewBox","0 0 220 190"),s.classList.add("ls-rpg-radar-svg");let i=110,r=96,d=62,o=t.length;for(let b of[0.33,0.66,1]){let M=t.map((S,L)=>{let T=L/o*Math.PI*2-Math.PI/2;return`${(i+Math.cos(T)*d*b).toFixed(1)},${(r+Math.sin(T)*d*b).toFixed(1)}`}),m=document.createElementNS("http://www.w3.org/2000/svg","polygon");m.setAttribute("points",M.join(" ")),m.setAttribute("fill","none"),m.setAttribute("stroke","rgba(148,163,184,0.28)"),m.setAttribute("stroke-width","1"),s.append(m)}let c=[];t.forEach((b,M)=>{let m=M/o*Math.PI*2-Math.PI/2,S=Math.max(0.1,Math.min(1,b.value/Math.max(1,b.max))),L=i+Math.cos(m)*d*S,T=r+Math.sin(m)*d*S;c.push(`${L.toFixed(1)},${T.toFixed(1)}`);let N=document.createElementNS("http://www.w3.org/2000/svg","line");N.setAttribute("x1",String(i)),N.setAttribute("y1",String(r)),N.setAttribute("x2",(i+Math.cos(m)*d).toFixed(1)),N.setAttribute("y2",(r+Math.sin(m)*d).toFixed(1)),N.setAttribute("stroke","rgba(148,163,184,0.22)"),N.setAttribute("stroke-width","1"),s.append(N);let I=document.createElementNS("http://www.w3.org/2000/svg","text");I.setAttribute("x",(i+Math.cos(m)*(d+17)).toFixed(1)),I.setAttribute("y",(r+Math.sin(m)*(d+14)+3).toFixed(1)),I.setAttribute("text-anchor","middle"),I.setAttribute("fill","currentColor"),I.setAttribute("font-size","9.5"),I.setAttribute("font-weight","700"),I.textContent=`${b.name.slice(0,6)} ${b.value}`,s.append(I)});let f=document.createElementNS("http://www.w3.org/2000/svg","polygon");return f.setAttribute("points",c.join(" ")),f.setAttribute("fill",n),f.setAttribute("fill-opacity","0.26"),f.setAttribute("stroke",n),f.setAttribute("stroke-width","2"),s.append(f),s}function mt(t,n,a){let s=Fs(n,t.max>0?t.max:20),i=e("div","ls-stack");if(i.style.gap="6px",!s.length)return i.append(e("small","ls-muted",String(n||"STR:10, DEX:10, INT:10, CHA:10"))),i;let r=`${a}:${t.id}`,d=za.get(r)??!1,o=e("div"),c=()=>{if(o.replaceChildren(),d&&s.length>=3){let b=e("div","ls-rpg-radar-box");b.append(Hs(s,t.color||"var(--ls-primary)")),o.append(b);return}let f=e("div","ls-rpg-attr-grid");for(let b of s){let M=e("div","ls-rpg-attr-cell"),m=Math.floor((b.value-10)/2),S=b.max<=30?m>=0?`+${m}`:String(m):"";M.append(e("span","ls-kicker",b.name),e("strong","ls-rpg-attr-val",String(b.value)),...S?[e("small","ls-muted",`(${S})`)]:[]),f.append(M)}o.append(f)};if(s.length>=3){let f=e("div","ls-row-between");f.append(e("small","ls-muted",`${s.length} Core Attributes`),B(d?"⊞ Grid View":"\uD83D\uDD78️ Radar Chart",()=>{d=!d,za.set(r,d),c()},"ls-btn-sm")),i.append(f)}return c(),i.append(o),i}function Ws(t){let n=String(t??"").trim(),a=Xt(n);if(Array.isArray(a))return a.filter((i)=>i&&typeof i==="object"&&i.name).map((i)=>({name:String(i.name),qty:Math.max(1,Number(i.qty??i.quantity??1)||1),rarity:Ua(String(i.rarity??"common")),equipped:Boolean(i.equipped),...typeof i.note==="string"?{note:i.note}:{}}));let s=[];for(let i of n.split(/\s*(?:;|\n|\|)\s*/).map((r)=>r.trim()).filter(Boolean)){if(/^(?:none|empty)$/i.test(i))continue;let r=i.match(/^([^\[\]()]+?)(?:\s*x(\d+))?\s*(?:\[([^\]]+)\]|\(([^)]+)\))?$/i),d=(r?.[1]??i).trim(),o=Math.max(1,Number(r?.[2]??1)||1),c=(r?.[3]??r?.[4]??"").toLowerCase(),f=/\b(?:equipped|worn|active|main|offhand)\b/.test(c),b=Ua(c);s.push({name:d,qty:o,rarity:b,equipped:f})}return s}function Ua(t){if(/legendary|mythic|gold/.test(t))return"legendary";if(/epic|violet|purple/.test(t))return"epic";if(/rare|blue/.test(t))return"rare";if(/uncommon|green/.test(t))return"uncommon";return"common"}function ft(t){let n=Ws(t);if(!n.length)return e("small","ls-muted","Bag empty");let a=e("div","ls-rpg-loot-grid");for(let s of n){let i=e("div","ls-rpg-loot-card");i.dataset.rarity=s.rarity;let r=e("div","ls-row-between");if(r.append(e("strong","",`${s.equipped?"⚔️ ":"\uD83C\uDF92 "}${s.name}`),e("span","ls-chip",s.qty>1?`×${s.qty}`:s.rarity.toUpperCase())),i.append(r),s.equipped||s.rarity!=="common")i.append(e("small","ls-muted",[s.equipped?"Equipped":"",s.rarity!=="common"?s.rarity:""].filter(Boolean).join(" · ")));a.append(i)}return a}function Os(t){let n=String(t??"").trim();if(!n||/^(?:none|normal|healthy|clear)$/i.test(n))return[];let a=[];for(let s of n.split(/\s*(?:;|,|\n|\|)\s*/).map((i)=>i.trim()).filter(Boolean)){let i="neutral",r=s;if(r.startsWith("+"))i="buff",r=r.slice(1).trim();else if(r.startsWith("-"))i="debuff",r=r.slice(1).trim();else if(/\b(?:burn|poison|bleed|stun|curse|tired|fluster|exhaust|wound|fear)\b/i.test(r))i="debuff";else if(/\b(?:shield|haste|bless|focus|regen|guard|inspir|armor|ward)\b/i.test(r))i="buff";let d=r.match(/^(.+?)\s*\(([^)]+)\)$/);a.push({name:(d?.[1]??r).trim(),kind:i,...d?.[2]?{duration:d[2].trim()}:{}})}return a}function ht(t){let n=Os(t);if(!n.length)return e("small","ls-muted","No active effects");let a=e("div","ls-row");for(let s of n){let i=e("span","ls-rpg-fx-pill",`${s.kind==="buff"?"▲":s.kind==="debuff"?"▼":"●"} ${s.name}${s.duration?` (${s.duration})`:""}`);i.dataset.fxKind=s.kind,a.append(i)}return a}function gt(t,n,a,s,i){let r=Math.max(1,Math.min(10,t.max||5)),d=t.max>10?Math.round(n/Math.max(1,t.max)*r):Math.max(0,Math.min(r,Math.round(n))),o=e("div","ls-row");for(let c=1;c<=r;c++){let f=a&&c<=d,b=B(f?"❤️":"\uD83E\uDD0D",()=>{if(!s&&i){let M=t.max>10?Math.round((c===d?c-1:c)/r*t.max):c===d?c-1:c;i(M)}},"ls-btn-sm ls-btn-icon ls-rpg-heart-btn",`${t.label}: ${c}/${r}`);b.disabled=s||!i,o.append(b)}return o}function bt(t,n,a){let s=Number(n),i=Number.isFinite(s)?s.toLocaleString():String(n),r=e("div","ls-rpg-currency-box");if(r.append(e("strong","ls-rpg-currency-val",`${t.icon} ${i}`)),a!==0)r.append(e("span",`ls-delta ${a>0?"is-pos":"is-neg"}`,a>0?`+${a.toLocaleString()}`:a.toLocaleString()));return r}function Yt(t,n){t.modals.open({title:"\uD83D\uDD0A Multi-Voice TTS Director — Cast & Narrator Voices",width:680,maxHeight:800},(a,s,i,r)=>{let d=async()=>{r.clear(),a.replaceChildren(e("p","ls-muted","⏳ Loading Lumiverse TTS connections & voice catalogs…"));let o=await t.tts.listConnections(),c=t.settings,{state:f}=t.snapshot,b=Object.values(f.characters),M=c?.narratorConnectionId||o.find((g)=>g.is_default)?.id||o[0]?.id||"",m=M?await t.tts.listVoicesForConnection(M):[];a.replaceChildren();let S=e("section","ls-card"),L=e("div","ls-row-between");L.append(e("div","",""),e("span","ls-chip ls-chip-accent",`⚡ Cached Hits: ${t.tts.cacheHitCount} (0 Tokens Re-billed)`)),L.firstElementChild.append(e("span","ls-kicker","2-Tier Memory + IndexedDB Audio Cache"),e("h3","","\uD83C\uDF99️ Narrator & Reading Mode (Token Saver)")),S.append(L);let T=e("div","ls-row"),N=c?.ttsReadMode||"dialogue_only";for(let[g,p]of[["dialogue_only","\uD83D\uDCAC Dialogue Only (Recommended — Saves ~65% TTS Tokens)"],["narration_and_dialogue","\uD83D\uDCD6 Full Audiobook (Narrator + Character Voices)"],["narration_only","\uD83D\uDCDC Narration Only"]]){let h=B(p,()=>{t.request("settings:update",{settings:{ttsReadMode:g}}).then(()=>{d()})},"ls-btn-sm");if(N===g)h.setAttribute("aria-current","page");T.append(h)}if(S.append(T),!o.length){S.append(e("p","ls-muted","No TTS connections found yet. Create a TTS connection in Lumiverse (Connections → TTS Connections, e.g. Kokoro, ElevenLabs, OpenAI, or Google) to enable voice synthesis.")),a.append(S);return}let I=e("div","ls-grid"),v=e("div","ls-label","Narrator TTS Connection"),x=e("div");v.append(x);let _=e("label","ls-label","Narrator Voice ID"),k=e("input","ls-input");if(k.placeholder=m[0]?.id||"Default connection voice…",k.value=c?.narratorVoiceId||"",_.append(k),m.length>0){let g=e("div");g.style.marginTop="4px",_.append(g),J(t,r,g,{value:c?.narratorVoiceId||"",placeholder:"— Pick from connection voices —",ariaLabel:"Narrator Voice Catalog",options:[{value:"",label:"— Pick from connection voices —"},...m.map((p)=>({value:p.id,label:`${p.name} (${p.id})`}))],onChange:(p)=>{if(p)k.value=p}})}J(t,r,x,{value:c?.narratorConnectionId||"",ariaLabel:"Narrator TTS Connection",options:[{value:"",label:"Use Default Lumiverse TTS Connection"},...o.map((g)=>({value:g.id,label:`${g.name} (${g.provider}${g.voice?` · ${g.voice}`:""})`}))],onChange:(g)=>{t.request("settings:update",{settings:{narratorConnectionId:g}}).then(()=>void d())}}),I.append(v,_),S.append(I);let y=e("div","ls-row");y.append(B("\uD83D\uDCBE Save Narrator Voice",()=>{t.request("settings:update",{settings:{narratorVoiceId:k.value.trim()}}),t.notify("Saved Narrator TTS voice.")},"ls-btn-sm ls-btn-primary"),B("▶ Test Narrator",()=>{t.tts.playSegments([{kind:"narration",text:`The scene unfolds in ${f.scene.location||"the story"}.`,speakerName:"Narrator",connectionId:c?.narratorConnectionId||"",voiceId:k.value.trim(),speed:c?.narratorSpeed||1}])},"ls-btn-sm")),S.append(y),a.append(S);let u=e("section","ls-card");if(u.append(e("span","ls-kicker","Per-Character Voice Profiles"),e("h3","",`\uD83D\uDC65 Cast Voices (${b.length} Characters)`),e("p","ls-muted","Assign each character their own distinct voice and speed. Quoted lines spoken by that character automatically route to their voice.")),!b.length)u.append(e("p","ls-muted","No characters in the cast yet."));else{let g=n?[...b.filter((p)=>p.id===n),...b.filter((p)=>p.id!==n)]:b;for(let p of g){let h=e("div","ls-stat-cell");if(p.id===n)h.style.borderColor="var(--ls-primary)";let C=p.ttsVoice??{},l=C.connectionId||M,w=l?await t.tts.listVoicesForConnection(l):m,P=e("div","ls-row-between");P.append(e("strong","",`${p.present?"\uD83D\uDFE2":"⚪"} ${p.name} (${p.roleSummary||"Cast"})`),e("span","ls-chip ls-chip-accent",C.voiceId?`\uD83D\uDD0A ${C.voiceId}`:"Default Voice")),h.append(P);let R=e("div","ls-grid"),A=e("div"),E=e("div"),D=e("input","ls-input");D.placeholder="Voice ID (or pick below)…",D.value=C.voiceId||"";let F=J(t,r,E,{value:C.voiceId||"",ariaLabel:`Voice for ${p.name}`,options:[{value:"",label:"— Select Voice from Catalog —"},...w.map((H)=>({value:H.id,label:`${H.name} (${H.id})`}))],onChange:(H)=>{if(H)D.value=H}}),W=J(t,r,A,{value:C.connectionId||"",ariaLabel:`TTS Connection for ${p.name}`,options:[{value:"",label:"Default TTS Connection"},...o.map((H)=>({value:H.id,label:`${H.name} (${H.provider})`}))],onChange:async(H)=>{let U=await t.tts.listVoicesForConnection(H||M);F.setOptions([{value:"",label:"— Select Voice from Catalog —"},...U.map((z)=>({value:z.id,label:`${z.name} (${z.id})`}))],"")}}),V=e("input","ls-input");V.type="number",V.min="0.5",V.max="2.0",V.step="0.1",V.value=String(C.speed??1),V.title="Playback Speed (0.5x – 2.0x)",R.append(A,D,E,V),h.append(R);let O=e("div","ls-row");O.append(B("\uD83D\uDCBE Save Voice",()=>{let H={connectionId:W.getValue()||void 0,voiceId:D.value.trim()||void 0,speed:Math.max(0.5,Math.min(2,Number(V.value)||1))},U=structuredClone(f.characters);if(U[p.id])U[p.id].ttsVoice=H,t.request("state:mutate",{stateOverride:{characters:U},reason:`Updated TTS voice for ${p.name}`}).then(()=>void d())},"ls-btn-sm ls-btn-primary"),B("▶ Test Voice",()=>{let H=p.innerThought||`Hello, I am ${p.name}.`;t.tts.playSegments([{kind:"dialogue",text:H,speakerName:p.name,actorId:p.id,connectionId:W.getValue()||void 0,voiceId:D.value.trim()||void 0,speed:Math.max(0.5,Math.min(2,Number(V.value)||1))}])},"ls-btn-sm")),h.append(O),u.append(h)}}a.append(u)};d(),i.onDismiss(()=>t.tts.stop())})}var qa={player_attire:{title:"Player Attire / Presentation",defaultIcon:"\uD83D\uDC55",defaultLabel:"Your Current Attire / Presentation",toggleKey:"trackPlayerAttire",labelKey:"playerAttireLabel",instructionKey:"playerAttireInstruction",showCardKey:"showPlayerAttireCard",supportsCardDisplay:!0},player_condition:{title:"Player Physical / Mental Condition",defaultIcon:"\uD83E\uDE7A",defaultLabel:"Physical / Mental Condition",toggleKey:"trackPlayerCondition",labelKey:"playerConditionLabel",instructionKey:"playerConditionInstruction",showCardKey:"showPlayerConditionCard",supportsCardDisplay:!0},player_action:{title:"Player Latest Notable Action",defaultIcon:"⚡",defaultLabel:"Latest Notable Action",toggleKey:"trackPlayerAction",labelKey:"playerActionLabel",instructionKey:"playerActionInstruction",showCardKey:"showPlayerActionCard",supportsCardDisplay:!0},scene_summary:{title:"Scene Beat Summary",defaultIcon:"\uD83D\uDCD6",defaultLabel:"Scene Beat Summary",toggleKey:"trackSceneSummary",labelKey:"sceneSummaryLabel",instructionKey:"sceneSummaryInstruction",showCardKey:"showSceneSummaryInWidget",supportsCardDisplay:!0},places:{title:"Spatial Atlas (Places, Zones & Paths)",defaultIcon:"\uD83D\uDDFA️",defaultLabel:"Spatial Atlas & Locations",toggleKey:"trackPlaces",instructionKey:"placesInstruction",supportsCardDisplay:!1},quests:{title:"Quests & Objectives",defaultIcon:"\uD83C\uDFAF",defaultLabel:"Quests & Objectives",toggleKey:"trackQuests",instructionKey:"questsInstruction",showCardKey:"showQuestsInWidget",supportsCardDisplay:!1},dispatches:{title:"Off-Screen Dispatches",defaultIcon:"\uD83D\uDCE1",defaultLabel:"Off-Screen Dispatches",toggleKey:"trackDispatches",instructionKey:"dispatchesInstruction",showCardKey:"showDispatchesInWidget",supportsCardDisplay:!1},npc_conditions:{title:"NPC Conditions & Status Tags",defaultIcon:"⚡",defaultLabel:"NPC Conditions",toggleKey:"trackNpcConditions",instructionKey:"npcConditionsInstruction",supportsCardDisplay:!1},npc_secrets:{title:"NPC Secrets & Clues",defaultIcon:"\uD83D\uDD75️",defaultLabel:"NPC Secrets & Clues",toggleKey:"trackNpcSecrets",instructionKey:"npcSecretsInstruction",supportsCardDisplay:!1}};function He(t,n){let a=rt(),s={...a,...t??{}},i=qa[n],r=s.overrides?.[n]??{},d=s[i.toggleKey]!==!1,o=i.showCardKey?s[i.showCardKey]!==!1:!0,c=r.label||(i.labelKey?String(s[i.labelKey]??""):"")||i.defaultLabel,f=r.instruction??String(s[i.instructionKey]??a[i.instructionKey]??"");return{enabled:d,showCard:o,icon:r.icon||i.defaultIcon,label:c,instruction:f,color:r.color||"var(--lumiverse-primary)",displayStyle:r.displayStyle??"auto",layoutSpan:r.layoutSpan??"full",widgetTabId:r.widgetTabId??(n==="quests"||n==="dispatches"?"world":"stats"),inlineTabId:r.inlineTabId??(n==="quests"||n==="dispatches"?"world":"stats"),pinnedToHeader:Boolean(r.pinnedToHeader),locked:Boolean(r.locked),deleted:Boolean(r.deleted)}}function Ae(t){let n=structuredClone(t.snapshot.template),a=rt(),s={...a,...n.coreTrackers??{}};t.modals.open({title:"\uD83D\uDCCD Customize Scene Pill & AI Prompt Rules (Date, Time, Location, Weather)",width:640,maxHeight:820},(i,r,d,o)=>{let c={...n.theme.showSceneChips},f=Boolean(s.scenePillLocked),b=e("section","ls-card");b.append(e("span","ls-kicker","Visible Pill Chips & Lock"),e("p","ls-muted","Choose which scene tokens appear in the Scene Pill & Header, or lock the pill so AI turns never alter the clock/location."));let M=e("div","ls-grid");for(let[u,g]of[["location","\uD83D\uDCCD Location"],["time","\uD83D\uDD70️ Clock Time"],["date","\uD83D\uDCC5 Date / Era"],["weather","\uD83C\uDF26️ Weather"],["cast","\uD83D\uDC64 Present Cast"],["pinnedStats","\uD83D\uDCCC Pinned Stats"]]){let p=e("div","ls-row-between ls-stat-cell");p.append(e("span","",g));let h=e("div");p.append(h),me(t,o,h,{checked:Boolean(c[u]),ariaLabel:g,onChange:(C)=>{c[u]=C}}),M.append(p)}let m=e("div","ls-row-between ls-stat-cell");m.append(e("span","","\uD83D\uDD12 Lock Scene Pill (Prevent AI from changing Date/Time/Location/Weather)"));let S=e("div");m.append(S),me(t,o,S,{checked:f,ariaLabel:"Lock Scene Pill",onChange:(u)=>{f=u}}),b.append(M,m),i.append(b);let L=e("div");i.append(L);let T=fe(t,o,L,{title:"AI Extraction Prompts for Pill Fields (Location, Time, Date, Weather)",iconName:"sliders",defaultExpanded:!0}),N=(u,g,p)=>{let h=e("div","ls-label"),C=e("div","ls-row-between"),l=e("textarea","ls-input");return l.rows=2,l.value=g,l.placeholder=p,C.append(e("span","",u),B("⛶ Full-Screen",()=>{t.request("textEditor:open",{title:`Scene Pill Prompt: ${u}`,value:l.value,placeholder:p}).then((w)=>{if(!w.cancelled&&typeof w.text==="string")l.value=w.text})},"ls-btn-sm")),h.append(C,l),T.append(h),l},I=N("\uD83D\uDCCD Location Prompt Rule",s.sceneLocationInstruction??a.sceneLocationInstruction??"",'e.g. Format as "Room, Building" or "Landmark, District".'),v=N("\uD83D\uDD70️ Time Prompt Rule",s.sceneTimeInstruction??a.sceneTimeInstruction??"",'e.g. Use 24-hour military clock, or narrative time like "Late Evening".'),x=N("\uD83D\uDCC5 Date / Era Prompt Rule",s.sceneDateInstruction??a.sceneDateInstruction??"",'e.g. Format as "Year 412, Frostfall 14" or "Oct 14, 2002".'),_=N("\uD83C\uDF26️ Weather & Atmosphere Prompt Rule",s.sceneWeatherInstruction??a.sceneWeatherInstruction??"",'e.g. Keep to 2–4 vivid words like "Neon Drizzle" or "Warm Indoor Steam".'),k=N('⏱️ Time Progression ("mins") Prompt Rule',s.sceneTimeFlowInstruction??a.sceneTimeFlowInstruction??"","e.g. Estimate realistic elapsed minutes per turn."),y=e("div","ls-row-between");y.style.marginTop="12px",y.append(B("↺ Reset Default Prompts",()=>{I.value=a.sceneLocationInstruction??"",v.value=a.sceneTimeInstruction??"",x.value=a.sceneDateInstruction??"",_.value=a.sceneWeatherInstruction??"",k.value=a.sceneTimeFlowInstruction??""},"ls-btn-sm"),B("\uD83D\uDCBE Save Scene Pill Config",()=>{let u=structuredClone(t.snapshot.template),g={...a,...u.coreTrackers??{}};t.request("state:mutate",{templatePatch:{theme:{...u.theme,showSceneChips:c},coreTrackers:{...g,scenePillLocked:f,sceneLocationInstruction:I.value.trim(),sceneTimeInstruction:v.value.trim(),sceneDateInstruction:x.value.trim(),sceneWeatherInstruction:_.value.trim(),sceneTimeFlowInstruction:k.value.trim()}},reason:"Updated Scene Pill prompt rules & visibility"}),t.notify("Saved Scene Pill prompt rules."),r()},"ls-btn-primary")),i.append(y)})}function Qt(t,n){let a=structuredClone(t.snapshot.template),s=rt(),i={...s,...a.coreTrackers??{},overrides:{...a.coreTrackers?.overrides??{}}},r=qa[n],d=He(i,n);t.modals.open({title:`✏️ Full Edit Built-In Tracker: ${r.title}`,width:640,maxHeight:820},(o,c,f,b)=>{let{enabled:M,showCard:m}=d,S=Boolean(d.locked),L=d.displayStyle??"auto",T=d.layoutSpan??"full",N=d.color||"var(--lumiverse-primary)",I=d.widgetTabId||"stats",v=d.inlineTabId||"stats",x=e("div","ls-grid"),_=e("label","ls-label","Icon"),k=e("input","ls-input");k.value=d.icon||r.defaultIcon,_.append(k);let y=e("label","ls-label","Display Label"),u=e("input","ls-input");u.value=d.label||r.defaultLabel,y.append(u),x.append(_,y),o.append(x);let g=e("div","ls-grid"),p=e("div","ls-row-between ls-stat-cell");p.append(e("span","","✓ Track in AI Prompts"));let h=e("div");if(p.append(h),me(t,b,h,{checked:M,onChange:(G)=>{M=G}}),g.append(p),r.supportsCardDisplay){let G=e("div","ls-row-between ls-stat-cell");G.append(e("span","","\uD83E\uDE9F Show Card in Widget / Inline"));let ee=e("div");G.append(ee),me(t,b,ee,{checked:m,onChange:(te)=>{m=te}}),g.append(G)}let C=e("div","ls-row-between ls-stat-cell");C.append(e("span","","\uD83D\uDD12 Lock Value (Skip AI Updates)"));let l=e("div");C.append(l),me(t,b,l,{checked:S,onChange:(G)=>{S=G}}),g.append(C),o.append(g);let w=e("div");o.append(w);let P=fe(t,b,w,{title:"Display Style, Color & Tab Routing",iconName:"palette",defaultExpanded:!0}),R=e("div","ls-grid"),A=e("div","ls-label","Visual Display Style"),E=e("div");A.append(E),J(t,b,E,{value:L,ariaLabel:"Visual Display Style",options:[{value:"auto",label:"✨ Smart Auto-Detect"},{value:"arc_tracker",label:"\uD83C\uDFAF Multi-Thread / Arc / Quest Cards"},{value:"accordion_cards",label:"\uD83D\uDDC2️ Collapsible Multi-Entry Cards"},{value:"matrix_badges",label:"⚖️ Split / Versus Comparison (Knows vs Blind)"},{value:"meter_mini_bars",label:"\uD83D\uDCCA Multi-Bar Mini Gauges (HP/MP cur/max)"},{value:"stat_pills_grid",label:"\uD83E\uDDEC Compact Stat Badges (Lv / P A I / POW)"},{value:"bullet_ledger",label:"\uD83D\uDCB0 Aligned Bullet & Currency Ledger"},{value:"timeline_list",label:"\uD83D\uDCDC Vertical Event Timeline"},{value:"checklist",label:"☑️ Visual Objectives Checklist"},{value:"feed_cards",label:"\uD83C\uDCCF Structured Flow Cards"},{value:"step_chain",label:"⛓️ Horizontal Step Chain"},{value:"key_value",label:"\uD83D\uDCCB Key–Value Table"},{value:"pill_list",label:"\uD83C\uDFF7️ Tag / Pill List"},{value:"quote_callout",label:"\uD83D\uDCAD Quote Callout Box"}],onChange:(G)=>{L=G}});let D=e("div","ls-label","Card Grid Width"),F=e("div");if(D.append(F),J(t,b,F,{value:T,ariaLabel:"Card Grid Width",options:[{value:"full",label:"↔️ Full Width"},{value:"auto",label:"\uD83D\uDCD0 Auto"},{value:"half",label:"▫ Compact Column"}],onChange:(G)=>{T=G}}),R.append(A,D),P.append(R),r.supportsCardDisplay){let G=e("div","ls-grid"),ee=e("div","ls-label","Widget Tab"),te=e("div");ee.append(te),J(t,b,te,{value:I,ariaLabel:"Widget Tab",options:a.surfaces.widgetTabs.map((ne)=>({value:ne.id,label:`${ne.icon} ${ne.label}`})),onChange:(ne)=>{I=ne}});let X=e("div","ls-label","Inline Ribbon Tab"),ae=e("div");X.append(ae),J(t,b,ae,{value:v,ariaLabel:"Inline Ribbon Tab",options:a.surfaces.inlineTabs.map((ne)=>({value:ne.id,label:`${ne.icon} ${ne.label}`})),onChange:(ne)=>{v=ne}}),G.append(ee,X),P.append(G)}let W=e("div","ls-label","Accent Color"),V=e("div","ls-row"),O=()=>{for(let G of[...V.querySelectorAll(".ls-color-swatch")])G.setAttribute("aria-pressed",String(G.dataset.colorVal===N))};for(let[G,ee,te]of[["var(--lumiverse-primary)","Theme Primary","var(--lumiverse-primary, #38bdf8)"],["#38bdf8","Sky","#38bdf8"],["#f472b6","Rose","#f472b6"],["#f59e0b","Amber","#f59e0b"],["#10b981","Emerald","#10b981"],["#a78bfa","Violet","#a78bfa"],["#f43f5e","Crimson","#f43f5e"]]){let X=B("",()=>{N=G,O()},"ls-color-swatch",ee);X.dataset.colorVal=G,X.style.background=te,V.append(X)}O(),W.append(V),P.append(W);let H=e("div");o.append(H);let U=fe(t,b,H,{title:"AI Extraction Prompt Rule",iconName:"sparkles",defaultExpanded:!0}),z=e("div","ls-row-between"),j=e("textarea","ls-input");j.rows=3,j.value=d.instruction??"",j.placeholder="Tell the AI exactly how and when to extract or format this tracker…",z.append(e("span","ls-muted","Prompt instruction sent to the AI extractor:"),B("⛶ Full-Screen Editor",()=>{t.request("textEditor:open",{title:`Built-In Prompt: ${u.value||r.title}`,value:j.value,placeholder:"Describe formatting, triggers, and when the AI should update this built-in tracker…"}).then((G)=>{if(!G.cancelled&&typeof G.text==="string")j.value=G.text})},"ls-btn-sm")),U.append(z,j);let K=e("div","ls-row-between");K.style.marginTop="12px";let Y=e("div","ls-row");Y.append(B("↺ Reset Default",()=>{k.value=r.defaultIcon,u.value=r.defaultLabel,j.value=String(s[r.instructionKey]??""),N="var(--lumiverse-primary)",L="auto",T="full",O()},"ls-btn-sm"),B("\uD83D\uDDD1️ Delete Built-In",async()=>{if(!await t.modals.confirm({title:`Remove "${r.defaultLabel}"?`,message:`Disable and remove "${r.defaultLabel}" from active tracking and Studio? (You can restore deleted built-ins anytime from Studio.)`,confirmLabel:"Delete",variant:"danger"}))return;let ee=structuredClone(t.snapshot.template),te={...s,...ee.coreTrackers??{},overrides:{...ee.coreTrackers?.overrides??{}}},X={...te,[r.toggleKey]:!1,...r.showCardKey?{[r.showCardKey]:!1}:{},overrides:{...te.overrides??{},[n]:{...te.overrides?.[n]??{},deleted:!0}}};t.request("state:mutate",{templatePatch:{coreTrackers:X},reason:`Deleted built-in tracker "${r.defaultLabel}"`}),t.notify(`Removed "${r.defaultLabel}".`),c()},"ls-btn-sm ls-btn-danger")),K.append(Y,B("\uD83D\uDCBE Save Built-In Tracker",()=>{let G=u.value.trim()||r.defaultLabel,ee=j.value.trim(),te=structuredClone(t.snapshot.template),X={...s,...te.coreTrackers??{},overrides:{...te.coreTrackers?.overrides??{}}},ae={...X,[r.toggleKey]:M,...r.labelKey?{[r.labelKey]:G}:{},[r.instructionKey]:ee,...r.showCardKey?{[r.showCardKey]:m}:{},overrides:{...X.overrides??{},[n]:{icon:k.value.trim()||r.defaultIcon,label:G,instruction:ee,color:N,displayStyle:L,layoutSpan:T,widgetTabId:I,inlineTabId:v,locked:S,deleted:!1}}};t.request("state:mutate",{templatePatch:{coreTrackers:ae},reason:`Customized built-in tracker "${G}"`}),t.notify(`Saved "${G}".`),c()},"ls-btn-primary")),o.append(K)})}var Ke={id:"zone_local",name:"Local Area",kind:"building",icon:"\uD83D\uDDFA️",color:"#38bdf8",description:""};function At(t){let n=new Map;for(let a of t.mapPaths??[]){if(!t.places[a.fromId]||!t.places[a.toId]||a.fromId===a.toId)continue;let[s,i]=[a.fromId,a.toId].sort(),r=`${s}__${i}`;n.set(r,{...a,id:r,fromId:s,toId:i})}for(let a of Object.values(t.places))for(let s of a.connectedIds){if(!t.places[s]||s===a.id)continue;let[i,r]=[a.id,s].sort(),d=`${i}__${r}`;if(!n.has(d)){let o=t.places[s],c=(a.zoneId||"zone_local")===(o.zoneId||"zone_local");n.set(d,{id:d,fromId:i,toId:r,pathType:c?"door":"street",travelMinutes:Math.max(1,o.travelMinutes||a.travelMinutes||5)})}}return[...n.values()]}function vt(t,n){let a=t.currentPlaceId||Object.keys(t.places)[0]||"";if(!a||!t.places[n])return null;if(a===n)return{pathIds:[a],totalMinutes:0};let s=At(t),i=new Map;for(let d of s)(i.get(d.fromId)??i.set(d.fromId,[]).get(d.fromId)).push({to:d.toId,mins:Math.max(1,d.travelMinutes||5),locked:Boolean(d.locked)}),(i.get(d.toId)??i.set(d.toId,[]).get(d.toId)).push({to:d.fromId,mins:Math.max(1,d.travelMinutes||5),locked:Boolean(d.locked)});let r=(d)=>{let o=new Map([[a,0]]),c=new Map,f=new Set;while(!0){let b=null,M=1/0;for(let[m,S]of o.entries())if(!f.has(m)&&S<M)b=m,M=S;if(!b)return null;if(b===n){let m=[b];while(c.has(m[0]))m.unshift(c.get(m[0]));return{pathIds:m,totalMinutes:M}}f.add(b);for(let m of i.get(b)??[]){if(!d&&m.locked)continue;let S=M+m.mins;if(S<(o.get(m.to)??1/0))o.set(m.to,S),c.set(m.to,b)}}};return r(!1)??r(!0)}function Ka(t,n,a){let s=Object.values(t.places);if(!s.length)return{zones:[],nodes:[],edges:[]};let i=t.currentPlaceId||s[0].id,r={...t.mapZones??{}},d=(h)=>{let C=h.zoneId||Ke.id;if(r[C])return r[C];if(C===Ke.id)return r[C]={...Ke,name:t.title&&t.title!=="Uncharted Story"?t.title:"Local Area"},r[C];return r[C]={id:C,name:C.replace(/[_-]+/g," ").replace(/\b\w/g,(l)=>l.toUpperCase()),kind:h.category==="region"?"region":"building",icon:h.category==="region"?"\uD83C\uDFD4️":"\uD83C\uDFDB️",color:"#38bdf8",description:""},r[C]},o=(a?s.filter((h)=>(h.zoneId||Ke.id)===a):s).slice(0,18),c=new Map;for(let h of o){let C=d(h),l=c.get(C.id);if(!l)l={zone:C,places:[]},c.set(C.id,l);l.places.push(h)}let f=[...c.values()],b=f.length,M=1000,m=580,S=22,L=b<=1?1:b<=4?2:3,T=Math.ceil(b/L),N=22,I=Math.floor((M-S*2-N*(L-1))/L),v=Math.floor((m-S*2-N*(T-1))/T),x=n&&n!==i?vt(t,n):null,_=new Set(x?.pathIds??[]),k=Object.values(t.quests).filter((h)=>h.status==="active"),y=[],u=[];f.forEach((h,C)=>{let l=C%L,w=Math.floor(C/L),P=S+l*(I+N),R=S+w*(v+N);y.push({zone:h.zone,x:P,y:R,w:I,h:v,placeIds:h.places.map((H)=>H.id),containsCurrent:h.places.some((H)=>H.id===i)});let A=h.places.length,E=R+46,D=Math.max(80,v-58),F=P+18,W=Math.max(120,I-36),V=A===1?1:A<=4?2:3,O=Math.ceil(A/V);h.places.forEach((H,U)=>{let z=U%V,j=Math.floor(U/V),K=W/V,Y=D/O,G=Math.round(F+K*(z+0.5)),ee=Math.round(E+Y*(j+0.5)),te=Object.values(t.characters).filter((ae)=>ae.present?H.id===i:ae.locationId===H.id).map((ae)=>({id:ae.id,name:ae.name,portraitUrl:ae.portraitUrl})),X=k.filter((ae)=>`${ae.title} ${ae.summary}`.toLowerCase().includes(H.name.toLowerCase())).length;u.push({place:H,zoneId:h.zone.id,zoneName:h.zone.name,x:G,y:ee,isCurrent:H.id===i,isOnRoute:_.has(H.id),actorsHere:te,activeQuestCount:X})})});let g=new Map(u.map((h)=>[h.place.id,h])),p=[];for(let h of At(t)){let C=g.get(h.fromId),l=g.get(h.toId);if(!C||!l)continue;let w=(C.x+l.x)/2,P=(C.y+l.y)/2,R=l.x-C.x,A=l.y-C.y,E=Math.max(1,Math.hypot(R,A)),D=C.zoneId!==l.zoneId,F=D?26:10,W=Math.round(w+-A/E*F),V=Math.round(P+R/E*F),O=!1;if(x&&x.pathIds.length>1)for(let H=0;H<x.pathIds.length-1;H++){let U=x.pathIds[H],z=x.pathIds[H+1];if(U===C.place.id&&z===l.place.id||U===l.place.id&&z===C.place.id){O=!0;break}}p.push({id:h.id,fromId:C.place.id,toId:l.place.id,x1:C.x,y1:C.y,x2:l.x,y2:l.y,cx:W,cy:V,pathType:h.pathType,label:h.label,travelMinutes:h.travelMinutes,locked:Boolean(h.locked),isOnRoute:O,isCrossZone:D})}return{zones:y,nodes:u,edges:p}}function Ga(t,n){let a=Object.values(t.places);if(!a.length)return{hubs:[],edges:[]};let s=t.currentPlaceId||a[0].id,i={...t.mapZones??{}},r=(I)=>{let v=I.zoneId||Ke.id;if(i[v])return i[v];if(v===Ke.id)return i[v]={...Ke,name:t.title&&t.title!=="Uncharted Story"?t.title:"Local Area"},i[v];return i[v]={id:v,name:v.replace(/[_-]+/g," ").replace(/\b\w/g,(x)=>x.toUpperCase()),kind:I.category==="region"?"region":"building",icon:I.category==="region"?"\uD83C\uDFD4️":"\uD83C\uDFDB️",color:"#38bdf8",description:""},i[v]},d=new Map;for(let I of a){let v=r(I),x=d.get(v.id);if(!x)x={zone:v,places:[]},d.set(v.id,x);x.places.push(I)}let o=[...d.values()],c=o.length,f=n&&n!==s?vt(t,n):null,b=new Set(f?.pathIds??[]),M=Object.values(t.quests).filter((I)=>I.status==="active"),m=(I,v)=>{if(v===1)return{x:500,y:180};if(v===2)return{x:I===0?270:730,y:180};if(v===3)return[{x:230,y:118},{x:770,y:118},{x:500,y:252}][I];let x=Math.min(3,Math.ceil(v/2)),_=Math.ceil(v/x),k=I%x,y=Math.floor(I/x),u=x>1?620/(x-1):0,g=_>1?150/(_-1):0,p=y%2===1&&x>1?35:0;return{x:Math.round(190+k*u+p),y:Math.round(105+y*g)}},S=o.map((I,v)=>{let x=m(v,c),_=I.places.map((l)=>l.id),k=new Set(_),y=k.has(s),u=_.some((l)=>b.has(l)),g=Object.values(t.characters).filter((l)=>l.present?y:k.has(l.locationId)).map((l)=>({id:l.id,name:l.name,portraitUrl:l.portraitUrl})),p=M.filter((l)=>I.places.some((w)=>`${l.title} ${l.summary}`.toLowerCase().includes(w.name.toLowerCase()))).length,h=I.places.find((l)=>l.id===s&&l.backdropUrl)?.backdropUrl??I.places.find((l)=>l.backdropUrl)?.backdropUrl,C=0;if(!y){let l=1/0;for(let w of I.places){let P=vt(t,w.id);if(P&&P.totalMinutes<l)l=P.totalMinutes}C=Number.isFinite(l)?l:I.places[0]?.travelMinutes??5}return{zone:I.zone,x:x.x,y:x.y,placeIds:_,containsCurrent:y,isOnRoute:u,...h?{backdropUrl:h}:{},actorsHere:g,activeQuestCount:p,minTravelMinutes:C}}),L=new Map(S.map((I)=>[I.zone.id,I])),T=new Map;for(let I of S)for(let v of I.placeIds)T.set(v,I.zone.id);let N=new Map;for(let I of At(t)){let v=T.get(I.fromId),x=T.get(I.toId);if(!v||!x||v===x)continue;let[_,k]=[v,x].sort(),y=`${_}__${k}`,u=L.get(_),g=L.get(k);if(!u||!g)continue;let p=b.has(I.fromId)&&b.has(I.toId),h=N.get(y);if(h){h.travelMinutes=Math.min(h.travelMinutes,I.travelMinutes),h.locked=h.locked&&Boolean(I.locked),h.isOnRoute=h.isOnRoute||p;continue}let C=(u.x+g.x)/2,l=(u.y+g.y)/2,w=g.x-u.x,P=g.y-u.y,R=Math.max(1,Math.hypot(w,P)),A=Math.round(C+-P/R*24),E=Math.round(l+w/R*24);N.set(y,{id:y,fromZoneId:_,toZoneId:k,x1:u.x,y1:u.y,x2:g.x,y2:g.y,cx:A,cy:E,pathType:I.pathType,travelMinutes:I.travelMinutes,locked:Boolean(I.locked),isOnRoute:p})}return{hubs:S,edges:[...N.values()]}}var Ge="",Jt=!0,Nn={door:"\uD83D\uDEAA",hallway:"\uD83D\uDEB6",stairs:"\uD83E\uDE9C",street:"\uD83D\uDEE3️",trail:"\uD83C\uDF3F",transit:"\uD83D\uDE87",portal:"✨"};function Rn(t,n=3){let a=e("div","ls-mz-node-avatars");for(let s of t.slice(0,n)){let i=e("span","ls-mz-mini-av");if(i.title=s.name,s.portraitUrl){let r=e("img");r.src=s.portraitUrl,r.alt=s.name,i.append(r)}else i.textContent=s.name.slice(0,1).toUpperCase();a.append(i)}if(t.length>n)a.append(e("small","ls-muted",`+${t.length-n}`));return a}function en(t){let{state:n}=t.snapshot,a=e("div","ls-stack"),s=Object.values(n.places),i=n.mapZones??{},r=At(n);if(Ge&&!s.some((l)=>(l.zoneId||"zone_local")===Ge))Ge="";let d=e("div","ls-row-between"),o=n.currentPlaceId||s[0]?.id||"",c=t.selectedPlaceId&&n.places[t.selectedPlaceId]?t.selectedPlaceId:o,f=Ga(n,c),b=f.hubs.length>1,M=Ge||(!Jt||!b?f.hubs[0]?.zone.id??"":""),m=e("div","ls-row ls-vn-breadcrumb"),S=B(`\uD83C\uDF0D All Zones (${f.hubs.length})`,()=>{Ge="",Jt=!0,t.emitChange()},"ls-btn-sm");if(!M)S.setAttribute("aria-current","page");if(m.append(S),b)for(let l of f.hubs){let w=B(`${l.zone.icon} ${l.zone.name} (${l.placeIds.length})`,()=>{Ge=l.zone.id,Jt=!1,t.emitChange()},"ls-btn-sm");if(M===l.zone.id)w.setAttribute("aria-current","page");m.append(w)}else if(f.hubs[0]){let l=f.hubs[0];m.append(e("span","ls-chip ls-chip-accent",`${l.zone.icon} ${l.zone.name}`))}let L=e("div","ls-row");if(L.append(B("+ Zone",()=>{t.modals.open({title:"Create Map Zone / Building / District",width:460},(l,w,P,R)=>{let A=e("label","ls-label","Zone Name"),E=e("input","ls-input");E.placeholder="e.g. Sakura Manor, Downtown, Orbital Deck B…",A.append(E);let D="building",F=e("div","ls-label","Zone Type"),W=e("div");F.append(W),J(t,R,W,{value:D,ariaLabel:"Zone Type",options:[{value:"building",label:"\uD83C\uDFDB️ Building / Interior"},{value:"district",label:"\uD83C\uDF06 City District"},{value:"region",label:"\uD83C\uDFD4️ Wilderness / Region"},{value:"ship_deck",label:"\uD83D\uDE80 Ship / Station Deck"},{value:"realm",label:"✨ Realm / Dimension"}],onChange:(U)=>{D=U}});let V=e("label","ls-label","Icon"),O=e("input","ls-input");O.value="\uD83C\uDFDB️",V.append(O);let H=B("Create Zone",()=>{let U=E.value.trim();if(!U)return;t.request("state:mutate",{patch:{zones:[{id:ie(U,"zone"),name:U,kind:D,icon:O.value.trim()||"\uD83C\uDFDB️"}]},reason:`Created zone "${U}"`}),w()},"ls-btn-primary");l.append(A,F,V,H)})},"ls-btn-sm"),B("+ Place",()=>{t.modals.open({title:"Add Location Pin",width:480},(l,w)=>{let P=e("label","ls-label","Location Name"),R=e("input","ls-input");P.append(R);let A=e("label","ls-label","Zone / Building / District"),E=e("input","ls-input");E.value=M&&i[M]?.name||n.places[o]?.zoneId&&i[n.places[o].zoneId]?.name||"",E.placeholder="e.g. Second-Floor Apartment",A.append(E);let D=e("label","ls-label","Icon"),F=e("input","ls-input");F.value="\uD83D\uDCCD",D.append(F);let W=e("label","ls-label","Description"),V=e("input","ls-input");W.append(V);let O=B("Add Location",()=>{let H=R.value.trim();if(!H)return;let U=n.places[o]?.name;t.request("state:mutate",{patch:{places:[{id:ie(H,"place"),name:H,zone:E.value.trim()||void 0,icon:F.value.trim()||"\uD83D\uDCCD",description:V.value.trim()||"Connected location.",connectedNames:U?[U]:[]}]},reason:`Added location "${H}"`}),w()},"ls-btn-primary");l.append(P,A,D,W,O)})},"ls-btn-sm ls-btn-primary"),B("Export",()=>{let l={schema:"lumi-stats-map/v1",zones:Object.values(i),places:s,paths:r},w=new Blob([JSON.stringify(l,null,2)],{type:"application/json"}),P=URL.createObjectURL(w),R=document.createElement("a");R.href=P,R.download=`${ie(n.title,"lumi_map")}.lumi-map.json`,document.body.append(R),R.click(),R.remove(),URL.revokeObjectURL(P)},"ls-btn-sm ls-btn-ghost","Export Map JSON"),B("Import",()=>{t.ctx.uploads.pickFile({accept:[".json","application/json"],multiple:!1,maxSizeBytes:1500000}).then((l)=>{let w=l[0];if(!w)return;let P=JSON.parse(new TextDecoder().decode(w.bytes));t.request("state:mutate",{patch:{zones:Array.isArray(P.zones)?P.zones:void 0,places:Array.isArray(P.places)?P.places:void 0,paths:Array.isArray(P.paths)?P.paths:void 0},reason:`Imported map layout from ${w.name}`})})},"ls-btn-sm ls-btn-ghost","Import Map JSON")),d.append(m,L),a.append(d),!s.length){let l=e("div","ls-card");return l.append(e("strong","","No locations mapped yet"),e("p","ls-muted",'Locations, zones, and connecting paths build automatically as scenes progress, or click "+ Zone" / "+ Place" above.')),a.append(l),a}let T=n.places[c]??s[0],N=e("div","ls-card"),I=e("div","ls-vn-atlas-canvas"),v=T.backdropUrl||s.find((l)=>l.id===o&&l.backdropUrl)?.backdropUrl||s.find((l)=>l.backdropUrl)?.backdropUrl;if(v)I.style.backgroundImage=`linear-gradient(rgba(11,17,32,0.72), rgba(11,17,32,0.88)), url(${JSON.stringify(v)})`,I.style.backgroundSize="cover",I.style.backgroundPosition="center";let x="http://www.w3.org/2000/svg",_=document.createElementNS(x,"svg");if(_.setAttribute("preserveAspectRatio","none"),_.style.cssText="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;",!M&&b){_.setAttribute("viewBox","0 0 1000 360");for(let l of f.edges){let w=document.createElementNS(x,"path");w.setAttribute("d",`M ${l.x1} ${l.y1} Q ${l.cx} ${l.cy} ${l.x2} ${l.y2}`),w.setAttribute("fill","none"),w.setAttribute("stroke",l.locked?"var(--ls-danger, #f43f5e)":l.isOnRoute?"var(--ls-primary, #38bdf8)":"rgba(148,163,184,0.55)"),w.setAttribute("stroke-width",l.isOnRoute?"3":"2"),w.setAttribute("stroke-dasharray",l.locked?"5 4":"4 3"),_.append(w);let P=0.25*l.x1+0.5*l.cx+0.25*l.x2,R=0.25*l.y1+0.5*l.cy+0.25*l.y2,A=e("span","ls-mz-edge-pill",`${l.locked?"\uD83D\uDD12 ":Nn[l.pathType]||"\uD83D\uDEE3️"} ${l.travelMinutes}m`);A.dataset.route=String(l.isOnRoute),A.style.left=`${(P/1000*100).toFixed(2)}%`,A.style.top=`${(R/360*100).toFixed(2)}%`,I.append(A)}I.append(_);for(let l of f.hubs){let w=B("",()=>{if(Ge=l.zone.id,Jt=!1,l.placeIds[0]&&!l.placeIds.includes(c))t.selectedPlaceId=l.placeIds[0];t.emitChange()},"ls-vn-zone-hub",`Open ${l.zone.name} (${l.placeIds.length} locations)`);if(w.dataset.current=String(l.containsCurrent),w.style.setProperty("--ls-zone-color",l.zone.color||"#38bdf8"),w.style.left=`${(l.x/1000*100).toFixed(2)}%`,w.style.top=`${(l.y/360*100).toFixed(2)}%`,l.backdropUrl)w.style.backgroundImage=`linear-gradient(rgba(11,17,32,0.72), rgba(11,17,32,0.88)), url(${JSON.stringify(l.backdropUrl)})`,w.style.backgroundSize="cover",w.style.backgroundPosition="center";let P=e("div","ls-row");P.append(e("span","",`${l.zone.icon} ${l.zone.name}`));let R=e("div","ls-row");if(l.containsCurrent)R.append(e("span","ls-chip ls-chip-accent","YOU"));else R.append(e("span","ls-chip",`${l.minTravelMinutes}m`));if(R.append(e("span","ls-chip",`${l.placeIds.length} ${l.placeIds.length===1?"spot":"spots"}`)),l.activeQuestCount>0)R.append(e("span","ls-chip","\uD83C\uDFAF"));if(w.append(P,R),l.actorsHere.length>0)w.append(Rn(l.actorsHere,4));I.append(w)}}else{let l=Ka(n,c,M||void 0);_.setAttribute("viewBox","0 0 1000 580");for(let w of l.edges){let P=document.createElementNS(x,"path");if(P.setAttribute("d",`M ${w.x1} ${w.y1} Q ${w.cx} ${w.cy} ${w.x2} ${w.y2}`),P.setAttribute("fill","none"),P.setAttribute("stroke",w.locked?"var(--ls-danger, #f43f5e)":w.isOnRoute?"var(--ls-primary, #38bdf8)":"rgba(148,163,184,0.55)"),P.setAttribute("stroke-width",w.isOnRoute?"3.5":"2"),w.locked||w.isCrossZone||w.pathType==="portal")P.setAttribute("stroke-dasharray",w.pathType==="portal"?"3 4":"6 4");_.append(P);let R=0.25*w.x1+0.5*w.cx+0.25*w.x2,A=0.25*w.y1+0.5*w.cy+0.25*w.y2,E=e("span","ls-mz-edge-pill",`${w.locked?"\uD83D\uDD12 ":Nn[w.pathType]||"\uD83D\uDEAA"} ${w.travelMinutes}m`);E.dataset.route=String(w.isOnRoute),E.style.left=`${(R/1000*100).toFixed(2)}%`,E.style.top=`${(A/580*100).toFixed(2)}%`,I.append(E)}I.append(_);for(let w of l.nodes){let P=B("",()=>{t.selectedPlaceId=w.place.id,t.emitChange(),requestAnimationFrame(()=>{N.scrollIntoView({behavior:"smooth",block:"nearest"})})},"ls-mz-node-tile",w.place.name);P.dataset.current=String(w.isCurrent),P.dataset.selected=String(w.place.id===c),P.style.left=`${(w.x/1000*100).toFixed(2)}%`,P.style.top=`${(w.y/580*100).toFixed(2)}%`;let R=w.place.name.length>24?`${w.place.name.slice(0,22)}…`:w.place.name;if(P.append(e("span","ls-mz-node-title",`${w.place.icon||"\uD83D\uDCCD"} ${R}${w.activeQuestCount?" \uD83C\uDFAF":""}`)),w.actorsHere.length>0||w.isCurrent){let A=Rn(w.actorsHere,3);if(w.isCurrent)A.prepend(e("span","ls-chip ls-chip-accent","YOU"));P.append(A)}I.append(P)}}a.append(I);let k=M?s.filter((l)=>(l.zoneId||"zone_local")===M):s,y=e("div","ls-vn-dest-grid");for(let l of k){let w=l.id===o,P=l.id===T.id,R=!w?vt(n,l.id):null,A=Object.values(n.characters).filter((H)=>H.present?l.id===o:H.locationId===l.id).map((H)=>({id:H.id,name:H.name,portraitUrl:H.portraitUrl})),E=e("div","ls-vn-dest-card");E.dataset.current=String(w),E.dataset.selected=String(P),E.addEventListener("click",()=>{t.selectedPlaceId=l.id,t.emitChange()});let D=e("div","ls-vn-dest-thumb");if(l.backdropUrl){let H=e("img");H.src=l.backdropUrl,H.alt=l.name,D.append(H)}else D.textContent=l.icon||"\uD83D\uDCCD";let F=e("div","ls-vn-dest-info"),W=e("div","ls-row");if(W.append(e("strong","",l.name)),w)W.append(e("span","ls-chip ls-chip-accent","Here"));F.append(W);let V=l.zoneId&&i[l.zoneId]?.name||"";if(V)F.append(e("small","ls-muted",V));if(A.length>0)F.append(Rn(A,4));let O=e("div","ls-row");if(!w)O.append(e("span","ls-chip",`${R?.totalMinutes??l.travelMinutes}m`),B("Go",()=>{t.request("map:travel",{placeId:l.id,fastTravel:!0})},"ls-btn-sm ls-btn-primary",`Fast travel to ${l.name}`));E.append(D,F,O),y.append(E)}a.append(y);let u=T.id!==o?vt(n,T.id):null,g=r.filter((l)=>l.fromId===T.id||l.toId===T.id),p=T.zoneId&&i[T.zoneId]?.name||"Local Area",h=e("div","ls-row-between");if(h.append(e("strong","",`${T.icon} ${T.name} · ${p}`),e("span","ls-chip ls-chip-accent",T.id===o?"Current Location":`${u?.totalMinutes??T.travelMinutes}m travel`)),N.append(h,e("p","ls-muted",T.description)),g.length>0){let l=e("div","ls-row");for(let w of g){let P=w.fromId===T.id?w.toId:w.fromId,R=n.places[P]?.name??P;l.append(B(`${w.locked?"\uD83D\uDD12":Nn[w.pathType]} ${R} (${w.travelMinutes}m)`,()=>{t.selectedPlaceId=P,t.emitChange()},"ls-btn-sm","Jump inspector to connected place"))}N.append(l)}let C=e("div","ls-row");if(T.id!==o)C.append(B("Copy Travel Action",()=>{t.request("map:travel",{placeId:T.id,fastTravel:!1}).then(async(l)=>{let w=typeof l.draftText==="string"?l.draftText:"";if(!w)return;try{await navigator.clipboard.writeText(w),t.notify(`Copied travel action: "${w}"`)}catch{t.notify(`Travel route: ${w}`)}})},"ls-btn-sm"),B("Fast Travel Here",()=>{t.request("map:travel",{placeId:T.id,fastTravel:!0})},"ls-btn-sm ls-btn-primary"));if(C.append(B("Upload Backdrop",()=>t.pickAndUploadImage(T.id,"backdrop"),"ls-btn-sm"),B("Edit Place",()=>{t.modals.open({title:`Edit Place: ${T.name}`,width:500},(l,w)=>{let P=e("label","ls-label","Location Name"),R=e("input","ls-input");R.value=T.name,P.append(R);let A=e("label","ls-label","Zone / Building / District"),E=e("input","ls-input");E.value=T.zoneId&&i[T.zoneId]?.name||"",A.append(E);let D=e("label","ls-label","Icon"),F=e("input","ls-input");F.value=T.icon||"\uD83C\uDFDB️",D.append(F);let W=e("label","ls-label","Tags (comma-separated, e.g. safe, shop, danger)"),V=e("input","ls-input");V.value=(T.tags??[]).join(", "),W.append(V);let O=e("label","ls-label","Description"),H=e("textarea","ls-input");H.rows=2,H.value=T.description,O.append(H);let U=e("label","ls-label","Default Travel Minutes"),z=e("input","ls-input");z.type="number",z.value=String(T.travelMinutes||5),U.append(z);let j=B("Save Location",()=>{let K=E.value.trim(),Y={...n.mapZones??{}},G=T.zoneId;if(K){if(G=ie(K,"zone"),!Y[G])Y[G]={id:G,name:K,kind:"building",icon:"\uD83C\uDFDB️",color:"#38bdf8",description:""}}let ee=structuredClone(n.places),te=ee[T.id];if(te)te.name=R.value.trim()||te.name,te.zoneId=G,te.icon=F.value.trim()||"\uD83D\uDCCD",te.tags=V.value.split(",").map((X)=>X.trim()).filter(Boolean),te.description=H.value.trim()||te.description,te.travelMinutes=Math.max(1,Number(z.value)||5),t.request("state:mutate",{stateOverride:{places:ee,mapZones:Y},reason:`Edited location "${te.name}"`});w()},"ls-btn-primary");l.append(P,A,D,W,O,U,j)})},"ls-btn-sm")),s.length>1)C.append(B("Delete",()=>{let l=structuredClone(n.places);delete l[T.id];for(let R of Object.values(l))R.connectedIds=R.connectedIds.filter((A)=>A!==T.id);let w=(n.mapPaths??[]).filter((R)=>R.fromId!==T.id&&R.toId!==T.id),P=n.currentPlaceId===T.id?Object.keys(l)[0]??"":n.currentPlaceId;t.selectedPlaceId=P,t.request("state:mutate",{stateOverride:{places:l,mapPaths:w,currentPlaceId:P},reason:`Deleted location "${T.name}"`})},"ls-btn-sm ls-btn-danger"));return N.append(C),a.append(N),a}function Be(t,n,a){let s=n.trim();if(!s)return;let i=()=>{if(!a?.dom?.inject){t.textContent=s.replace(/<[^>]+>/g,"");return}try{a.dom.inject(t,s,"beforeend")}catch{t.textContent=s.replace(/<[^>]+>/g,"")}};if(t.isConnected)i();else queueMicrotask(()=>{if(t.isConnected)i()})}var Vs=/^(?:impulse|inhibition|action|acted|thought|inner\s*thought|saw|heard|saw\/heard|take|observation|trigger|response|result|outcome|cause|effect|before|after|step|status|state|goal|intent|attitude|location|current|current\s*step|next|hook|active\s*plans?|leverage|pivot|reward|risk|verdict|knows\/misreads|knows|blind\s*to|secret\s*stage)$/i;function Xa(t){return t.replace(/\[\s*([^\]\n:]{1,40}?)\s*\]\s*\{\s*([^\}\n]+?)\s*\}/g,"$1: $2").replace(/([A-Za-z][A-Za-z0-9_\/\s-]{1,32})\s*:\s*\[([^\[\]\n]+)\]/g,"$1: $2").replace(/\[\s*([^\]\n:]{1,40}?)\s*\]\s*:\s*\{?\s*([^\]\}\n]+?)\s*\}?(?=\s*(?:->|→|⇒|\||vs\b|$))/gi,"$1: $2")}function we(t){let n=Xa(t).trim();while(n.startsWith("[")&&n.endsWith("]")&&!n.slice(1,-1).includes("[")||n.startsWith("{")&&n.endsWith("}")&&!n.slice(1,-1).includes("{"))n=n.slice(1,-1).trim();return n}function Et(t){let n=Xa(t).trim();if(!n)return[];return n.split(/\r?\n|(?:\s*;\s*)|(?:\s+•\s+)/).map((s)=>we(s.replace(/^[-*•]\s+/,"").trim())).filter(Boolean).map((s)=>{let i=s.split(/\s*(?:->|→|⇒)\s*/).map((o)=>we(o)).filter(Boolean),r;if(i.length>1){let o=i[0],c=o.match(/^([^:\[\]\|]{2,50}):\s*([\s\S]+)$/),f=c?.[1]?.trim()??"",b=/^[^:\[\]]{1,30}:\s*\S/.test(i[1]);if(c&&!Vs.test(f)&&!/\bvs\.?\b/i.test(o)&&!o.includes("|")&&!b)r=f,i[0]=c[2].trim()}let d=i.flatMap((o)=>o.split(/\s*\|\s*/)).map((o)=>we(o)).filter(Boolean);return{...r?{subject:r}:{},steps:d.length?d:[s]}})}function zs(t){let n=we(t);if(!n)return null;let a=n.match(/^([^:->→\[\]]{1,40}):\s*([\s\S]*)$/),s=e("span","ls-step-node");if(a){let i=a[1].trim(),r=we(a[2]??"");if(!r)return null;let d=e("strong","",`${i}: `);d.style.color="var(--ls-primary)",d.style.marginRight="4px",s.append(d,document.createTextNode(r))}else s.textContent=n;return s}function Bn(t,n){let a=0;for(let s of n){let i=s.split(/\s+\bvs\.?\b\s+/i).map((d)=>d.trim()).filter(Boolean),r=[];for(let[d,o]of i.entries()){let c=zs(o);if(c)r.push({chip:c,isVs:d>0})}if(!r.length)continue;if(a>0)t.append(e("span","ls-step-arrow","→"));for(let d of r){if(d.isVs)t.append(e("span","ls-step-arrow","vs"));t.append(d.chip)}a++}}function Xe(t,n="auto"){let a=t.trim();if(!a)return e("span","ls-muted","—");if(n==="quote_callout")return e("div","ls-thought-box",`“${we(a)}”`);if(n==="pill_list"){let d=e("div","ls-row");for(let o of a.split(/[,;\n]|->|→|⇒/).map((c)=>c.trim()).filter(Boolean))d.append(e("span","ls-chip ls-chip-accent",we(o)));return d}if(n==="step_chain"){let d=e("div","ls-step-chain ls-step-strip"),o=a.split(/\r?\n|(?:\s*;\s*)|\s*(?:->|→|⇒)\s*/).map((c)=>c.trim()).filter(Boolean);return Bn(d,o),d}if(n==="key_value"){let d=e("div","ls-kv-grid"),o=a.split(/\r?\n|(?:\s*;\s*)|\s*(?:->|→|⇒)\s*|\s+\bvs\.?\b\s+/i).map((c)=>c.replace(/^[-*•]\s+/,"").trim()).filter(Boolean);for(let[c,f]of o.entries()){let b=we(f),M=b.match(/^([^:]{1,45}):\s*([\s\S]+)$/),m=e("div","ls-kv-row");if(M)m.append(e("span","ls-kv-key",M[1].trim()),e("span","ls-kv-val",we(M[2])));else m.append(e("span","ls-kv-key",`#${c+1}`),e("span","ls-kv-val",b));d.append(m)}return d}if(!/->|→|⇒|\bvs\.?\b|\n|;|\[[^\]]+\]/i.test(a)&&n==="auto"){let d=e("p","",a);return d.style.margin="2px 0 0",d}if(n==="arc_tracker"){let d=a.split(/\r?\n|(?=\[\s*t\d+\b)|(?:\s*;\s*)/i).map((c)=>we(c.replace(/^[-*•]\s+/,"").trim())).filter(Boolean),o=e("div","ls-arc-list");for(let c of d){let f=e("div","ls-arc-card"),b=c.split(/\s*\|\s*/).map((y)=>y.trim()).filter(Boolean),M=b[0]??c,m=c.match(/\b(\d+)\s*\/\s*(\d+)\b/),S=m?Math.max(0,Number(m[1])):null,L=m?Math.max(1,Math.min(12,Number(m[2]))):null,T=c.match(/\b(ACTIVE|DORMANT|PAYOFF|COMPLETE(?:D)?|DONE|RETIRE(?:D)?|URGENT|FAIL(?:ED)?|ADVANCE|CONTINUE|SHIFT|DROP)\b/i),N=T?T[1].toUpperCase():"",I=M.replace(/^t\d+\s*/i,"").replace(/\(\s*([^|)]+?)\s*(?:\|\s*\d+\s*\/\s*\d+\s*)?\)\s*:?/,"$1:").trim(),v="",x=I.indexOf(":");if(x>0&&x<48)v=I.slice(x+1).trim(),I=I.slice(0,x).trim();else I=I.replace(/\s*\|\s*\d+\s*\/\s*\d+/,"").trim();let _=e("div","ls-row-between");_.append(e("strong","ls-arc-title",I||"Active Thread"));let k=e("div","ls-row");if(N){let y=e("span","ls-arc-status",N);y.dataset.arcStatus=N.toLowerCase(),k.append(y)}if(S!==null&&L!==null)k.append(e("span","ls-chip",`${S}/${L}`));if(_.append(k),f.append(_),S!==null&&L!==null){let y=e("div","ls-clock-bar ls-arc-clock");y.style.gridTemplateColumns=`repeat(${L}, 1fr)`;for(let u=1;u<=L;u++)y.append(e("span",`ls-clock-seg${u<=S?" is-filled":""}`));f.append(y)}if(v)f.append(e("p","ls-arc-summary",v));for(let y of b.slice(1)){if(/^\d+\s*\/\s*\d+$/.test(y))continue;let u=we(y),g=u.match(/^([^:]{1,28}):\s*([\s\S]+)$/);if(g){let p=e("div","ls-arc-meta");p.append(e("span","ls-kv-key",`${g[1].trim()}:`),e("span","ls-muted",g[2].trim())),f.append(p)}else f.append(e("small","ls-muted",u))}o.append(f)}return o}if(n==="accordion_cards"){let d=Et(a),o=e("div","ls-feed-list");for(let[c,f]of d.entries()){let b=e("details","ls-stat-acc");if(c===0)b.open=!0;let M=e("summary","ls-stat-acc-head"),m=f.subject||f.steps[0]||`Entry ${c+1}`,S=f.subject?f.steps[0]??"":f.steps[1]??"";M.append(e("strong","",m),...S?[e("small","ls-muted ls-stat-acc-preview",S)]:[]);let L=e("div","ls-stat-acc-body"),T=e("div","ls-step-chain");Bn(T,f.steps),L.append(T),b.append(M,L),o.append(b)}return o}if(n==="matrix_badges"){let d=a.split(/\r?\n|(?:\s*;\s*)/).map((c)=>we(c.replace(/^[-*•]\s+/,"").trim())).filter(Boolean),o=e("div","ls-feed-list");for(let c of d){let f=e("div","ls-matrix-card"),b=c.split(/\s*(?:\bvs\.?\b|\||->|→|⇒)\s*/i).map((L)=>we(L)).filter(Boolean),M=e("div","ls-matrix-cols"),m=b.slice(0,2),S=b.slice(2);for(let L of m){let T=e("div","ls-matrix-cell"),N=L.match(/^([^:]{1,28}):\s*([\s\S]+)$/);if(N)T.append(e("span","ls-kv-key",N[1].trim()),e("span","",we(N[2])));else T.append(e("span","",L));M.append(T)}f.append(M);for(let L of S){let T=e("div","ls-matrix-footer"),N=L.match(/^([^:]{1,28}):\s*([\s\S]+)$/);if(N)T.append(e("span","ls-kv-key",`${N[1].trim()}: `),e("span","",we(N[2])));else T.append(e("span","",L));f.append(T)}o.append(f)}return o}if(n==="meter_mini_bars"){let d=[...a.matchAll(/\b([A-Za-z][A-Za-z0-9_ -]{0,18}?)\s*[:=]?\s*(-?\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\b/g)];if(d.length>0){let o=e("div","ls-minibars-grid");for(let c of d){let f=c[1].trim(),b=Number(c[2]),M=Math.max(1,Number(c[3])),m=Math.max(0,Math.min(100,Math.round(b/M*100))),S=e("div","ls-minibar-cell"),L=e("div","ls-row-between");L.append(e("span","ls-kv-key",f),e("strong","",`${b}/${M}`));let T=e("div","ls-bar-track"),N=e("div","ls-bar-fill");if(N.style.width=`${m}%`,/hp|health|vital|blood/i.test(f))N.style.background="#f43f5e";else if(/mp|mana|ki|energy/i.test(f))N.style.background="#38bdf8";T.append(N),S.append(L,T),o.append(S)}return o}}if(n==="stat_pills_grid"){let d=e("div","ls-statpills-grid"),o=a.split(/\s*(?:\||,|;|\n)\s*/).flatMap((c)=>{let f=c.trim();if(!f)return[];if(/^(?:[A-Za-z]{1,8}\d+\s+)+[A-Za-z]{1,8}\d+$/.test(f))return f.split(/\s+/);return[f]}).filter(Boolean);for(let c of o){let f=e("div","ls-statpill-tile"),b=c.match(/^([A-Za-z][A-Za-z0-9_]{0,12})\s*[:=]?\s*(-?\d+(?:\.\d+)?(?:\/\d+)?(?:\s*\([^)]+\))?)$/);if(b)f.append(e("span","ls-kv-key",b[1].trim()),e("strong","",b[2].trim()));else f.append(e("strong","",c));d.append(f)}return d}if(n==="bullet_ledger"){let d=a.split(/\r?\n|(?:\s*;\s*)|(?:\s+•\s+)/).map((c)=>c.replace(/^[-*•]\s+/,"").trim()).filter(Boolean),o=e("div","ls-ledger-list");for(let c of d){let f=e("div","ls-ledger-row"),b=c.match(/^(.+?)\s*:\s*([$€£¥]?\s*-?\d[\d,]*(?:\.\d+)?.*)$/);if(b)f.append(e("span","",b[1].trim()),e("span","ls-chip ls-chip-accent",b[2].trim()));else f.append(e("span","",c));o.append(f)}return o}if(n==="timeline_list"){let d=a.split(/\r?\n|(?:\s*;\s*)|\s*(?:->|→|⇒)\s*/).map((c)=>we(c.replace(/^[-*•]\s+/,"").trim())).filter(Boolean),o=e("div","ls-timeline-list");for(let c of d){let f=e("div","ls-timeline-item");f.append(e("span","ls-timeline-dot"),e("span","",c)),o.append(f)}return o}if(n==="checklist"){let d=a.split(/\r?\n|(?:\s*;\s*)/).map((c)=>c.replace(/^[-*•]\s+/,"").trim()).filter(Boolean),o=e("div","ls-checklist");for(let c of d){let f=/^(?:\[x\]|✓|✔|done:|completed:)/i.test(c),b=c.replace(/^(?:\[[ xX]\]|✓|✔|○)\s*/,"").trim(),M=e("div","ls-checklist-row");M.dataset.done=String(f),M.append(e("span","ls-checklist-box",f?"✓":""),e("span",f?"ls-muted":"",b)),o.append(M)}return o}let i=Et(a),r=e("div","ls-feed-list");for(let d of i){let o=e("div","ls-feed-card");if(d.subject)o.append(e("div","ls-feed-subject",`\uD83D\uDC64 ${d.subject}`));let c=e("div","ls-step-chain");Bn(c,d.steps),o.append(c),r.append(o)}return r}function De(t,n){let a={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},s=(o)=>o.replace(/[&<>"']/g,(c)=>a[c]),i=Ne(n),r=Object.values(n.characters).find((o)=>o.present)??Object.values(n.characters)[0],d={title:s(n.title),location:s(i.location),time:s(i.time),date:s(i.date),weather:s(i.weather),header:s(i.formatted),player_attire:s(n.player.attire),name:s(r?.name??""),role:s(r?.roleSummary??""),demeanor:s(r?.demeanor??""),attire:s(r?.attire??"")};return t.replace(/\{\{\s*([\w:.-]+)\s*\}\}/g,(o,c)=>{if(c.startsWith("stat:")){let f=c.slice(5),b=n.stats[f]?.value??r?.meters[f]?.value;return b!==void 0?s(String(b)):"—"}return d[c]??""})}function _t(t){let{state:n}=t.snapshot,a=Ne(n);t.modals.open({title:"✏️ Edit Scene Banner & Player Presentation",width:540},(s,i)=>{let r=(N,I,v)=>{let x=e("label","ls-label",N),_=e("input","ls-input");return _.value=I,_.placeholder=v,x.append(_),s.append(x),_},d=r("\uD83D\uDCCD Location & Region",n.scene.location||a.location,"e.g. Master Suite, Estate"),o=r("\uD83D\uDD70️ Time",n.scene.timeLabel||a.time,"e.g. 08:30 PM"),c=r("\uD83D\uDCC5 Date / Era",n.scene.dateLabel||a.date,"e.g. Day 1 · Evening"),f=r("\uD83C\uDF26️ Weather & Atmosphere",n.scene.weather||a.weather,"e.g. Warm Indoor Steam"),b=r("\uD83D\uDC55 Your Current Attire / Presentation",n.player.attire,"e.g. Wearing only a towel after a bath"),M=e("label","ls-label","Scene Beat Summary"),m=e("textarea","ls-input");m.rows=2,m.value=n.scene.beatSummary||"",M.append(m),s.append(M);let S=e("div","ls-row-between"),L=e("div","ls-row");L.append(B("⚙️ Pill Prompts",()=>{i(),Ae(t)},"ls-btn-sm"));for(let[N,I]of[["+15m",15],["+1h",60],["+1d",1440]])L.append(B(N,()=>{t.request("state:mutate",{patch:{scene:{elapsedMinutes:I}},reason:`Advanced clock ${N}`}),i()},"ls-btn-sm"));let T=B("\uD83D\uDCBE Save Scene",()=>{t.request("state:mutate",{patch:{scene:{location:d.value.trim(),timeLabel:o.value.trim(),dateLabel:c.value.trim(),weather:f.value.trim(),beatSummary:m.value.trim()},player:{attire:b.value.trim()}},reason:"Updated scene & player presentation"}),i()},"ls-btn-primary");S.append(L,T),s.append(S)})}function Ze(t,n){t.modals.open({title:"\uD83E\uDDEA Two-Phase Stat Calibration & Reactivity Sandbox",width:660,maxHeight:760},(a,s)=>{let i=e("label","ls-label","Test Scenario / Turn Input (or leave blank to auto-generate)"),r=e("textarea","ls-input");r.rows=2,r.placeholder='e.g. "My loyal maid greets me as I step out of the bath wearing only a towel."',i.append(r);let d=e("div","ls-stack"),o=()=>{d.replaceChildren(e("p","ls-muted","⏳ Evaluating scenario against two-phase calibration rules…")),t.request("sandbox:test",{statId:n,scenarioText:r.value.trim()||void 0}).then((f)=>{d.replaceChildren();let b=e("div","ls-card");b.append(e("span","ls-kicker","\uD83D\uDCD6 Evaluated Beat"),e("p","",String(f.testBeat??""))),d.append(b);let M=Array.isArray(f.auditEntries)?f.auditEntries:[];if(!M.length)d.append(e("p","ls-muted","No stats shifted for this scenario."));else for(let m of M){let S=e("div","ls-stat-cell"),L=e("div","ls-row-between");L.append(e("strong","",`${String(m.statLabel)} (${String(m.op)})`),e("span","ls-chip ls-chip-accent",`${String(m.before??"uncalibrated")} → ${String(m.after)}`)),S.append(L,e("small","ls-muted",String(m.reason??""))),d.append(S)}}).catch((f)=>{d.replaceChildren(e("p","ls-muted",f instanceof Error?f.message:String(f)))})},c=e("div","ls-row-between");c.append(B("▶ Run Sandbox Evaluation",o,"ls-btn-primary"),B("Close",s,"ls-btn-sm")),a.append(i,c,d),o()})}function We(t,n){let a=structuredClone(t.snapshot.template),s=n.scope==="player"?"character":"player",i=s==="character"?"cast":s==="world"?"world":"stats",r=s==="character"?"cast":s==="world"?"world":"stats",d=n.dossierTabId||"bonds";t.modals.open({title:`\uD83D\uDCCB Duplicate Stat: ${n.icon} ${n.label}`,width:540},(o,c,f,b)=>{o.append(e("p","ls-muted",`Copy "${n.label}" (including its style, color, range, anchors, and AI rules) into another scope or tab.`));let M=e("label","ls-label","New Stat Label (Can keep the same label for a different scope)"),m=e("input","ls-input");m.value=n.label,M.append(m);let S=e("div","ls-label","Target Owner Scope"),L=e("div");S.append(L);let T=e("div","ls-grid"),N=e("div","ls-label","\uD83E\uDE9F Target Widget Tab"),I=e("div");N.append(I);let v=e("div","ls-label","\uD83D\uDCAC Target Inline Tab"),x=e("div");v.append(x);let _=e("div","ls-label","\uD83E\uDEAA Target Dossier Tab"),k=e("div");_.append(k),T.append(N,v,_);let y=J(t,b,I,{value:i,ariaLabel:"Target Widget Tab",options:a.surfaces.widgetTabs.map((p)=>({value:p.id,label:`${p.icon} ${p.label}`})),onChange:(p)=>{i=p}}),u=J(t,b,x,{value:r,ariaLabel:"Target Inline Tab",options:a.surfaces.inlineTabs.map((p)=>({value:p.id,label:`${p.icon} ${p.label}`})),onChange:(p)=>{r=p}});J(t,b,k,{value:d,ariaLabel:"Target Dossier Tab",options:a.surfaces.dossierTabs.map((p)=>({value:p.id,label:`${p.icon} ${p.label}`})),onChange:(p)=>{d=p}}),J(t,b,L,{value:s,ariaLabel:"Target Owner Scope",options:[{value:"character",label:"\uD83D\uDC65 Character Meter (Per-NPC in Cast & Dossier)"},{value:"player",label:"\uD83D\uDC64 Player Stat"},{value:"world",label:"\uD83C\uDF0D World State Stat / Clock"},{value:"scene",label:"\uD83C\uDFAD Scene / Thread Stat"}],onChange:(p)=>{s=p;let h=s==="character"?"cast":s==="world"?"world":"stats";i=h,r=h,y.setValue(h),u.setValue(h)}});let g=B("\uD83D\uDCCB Create Duplicate Stat",()=>{let p=m.value.trim()||n.label,h=ie(p,"stat"),C=s==="character"?"char":s,l=a.stats.some((P)=>P.id===h)?`${C}_${h}`:h;if(a.stats.some((P)=>P.id===l))l=`${C}_${h}_${Date.now().toString(36).slice(-3)}`;let w=re({...structuredClone(n),id:l,label:p,scope:s,tabId:i,widgetTabId:i,inlineTabId:r,dossierTabId:d,showIn:{widget:!0,inline:!0,dossier:s==="character",pinnedHeader:!1}});a.stats.push(w),t.request("state:mutate",{templatePatch:{stats:a.stats},reason:`Duplicated "${n.label}" to ${s} (${i})`}),t.notify(`Duplicated "${w.icon} ${w.label}" to ${s}!`),c()},"ls-btn-primary");g.style.marginTop="10px",o.append(M,S,T,g)})}function Ce(t,n="character",a){let s=structuredClone(t.snapshot.template);t.modals.open({title:a?`Edit Stat: ${a.icon} ${a.label}`:"Create Stat or Character Meter",width:660,maxHeight:820},(i,r,d,o)=>{let c=a?.scope??n,f=a?.categoryId??"",b=a?.kind??"meter",M=a?.volatility??(n==="character"?"progressive":"momentary"),m=a?.displayStyle??"auto",S=a?.layoutSpan??"auto",L=a?.color||"var(--lumiverse-primary)",T=a?.widgetTabId??(n==="world"?"world":n==="character"?"cast":"stats"),N=a?.inlineTabId??(n==="world"?"world":n==="character"?"cast":"stats"),I=a?.dossierTabId??"bonds",v=a?.showIn?.widget??!0,x=a?.showIn?.inline??!0,_=a?a.scope==="character"?a.showIn?.dossier??!0:!1:c==="character",k=a?.pinnedToHeader??!1,y=a?.locked??!1,u=e("div");i.append(u);let g=fe(t,o,u,{title:"1. Basics & Value Format",iconName:"stats",defaultExpanded:!0}),p=e("div","ls-grid"),h=e("label","ls-label","Icon"),C=e("input","ls-input");C.value=a?.icon??(n==="character"?"\uD83D\uDC96":"\uD83D\uDCCA"),h.append(C);let l=e("label","ls-label","Stat Name"),w=e("input","ls-input");w.placeholder="e.g. Loyalty, Offscreen NPCs, Threat Clock…",w.value=a?.label??"",l.append(w);let P=e("div","ls-label","Category / Group (Optional)"),R=e("div");P.append(R),J(t,o,R,{value:f,ariaLabel:"Category / Group",options:[{value:"",label:"None (Uncategorized)"},...(s.categories??[]).map((q)=>({value:q.id,label:`${q.icon} ${q.name}`}))],onChange:(q)=>{f=q}}),p.append(h,l,P),g.append(p);let A=e("div","ls-grid"),E=e("div","ls-label","Owner Scope"),D=e("div");E.append(D);let F=e("div","ls-label","Value Format"),W=e("div");F.append(W);let V=e("div","ls-label","Reactivity Profile"),O=e("div");V.append(O),A.append(E,F,V),g.append(A);let H=e("div","ls-grid"),U=e("label","ls-label","Minimum"),z=e("input","ls-input");z.type="number",z.value=String(a?.min??0),U.append(z);let j=e("label","ls-label","Maximum / Segments"),K=e("input","ls-input");K.type="number",K.value=String(a?.max??100),j.append(K);let Y=e("label","ls-label","Starting / Fallback Value"),G=e("input","ls-input");G.value=String(a?.defaultValue??0),Y.append(G),H.append(U,j,Y),g.append(H);let ee=()=>{let q=["meter","clock","pips","number","hearts","currency","attributes"].includes(b)&&m==="auto";H.style.display=q?"":"none"};ee();let te=e("div");i.append(te);let X=fe(t,o,te,{title:"2. Appearance, Visibility & Tabs",iconName:"palette",defaultExpanded:!1}),ae=e("div","ls-grid"),ne=e("div","ls-label","Visual Display Style"),ge=e("div");ne.append(ge);let Se=e("div","ls-label","Card Grid Width"),le=e("div");Se.append(le),ae.append(ne,Se),X.append(ae);let xt=e("div","ls-label","Accent & Bar Color"),et=e("div","ls-row"),ln=[{value:"var(--lumiverse-primary)",label:"Theme Primary",preview:"var(--lumiverse-primary, #38bdf8)"},{value:"#38bdf8",label:"Sky Cyan",preview:"#38bdf8"},{value:"#f472b6",label:"Rose Pink",preview:"#f472b6"},{value:"#f59e0b",label:"Amber Gold",preview:"#f59e0b"},{value:"#10b981",label:"Emerald",preview:"#10b981"},{value:"#a78bfa",label:"Royal Violet",preview:"#a78bfa"},{value:"#f43f5e",label:"Crimson",preview:"#f43f5e"}],cn=()=>{for(let q of[...et.querySelectorAll(".ls-color-swatch")])q.setAttribute("aria-pressed",String(q.dataset.colorVal===L))};for(let q of ln){let Z=B("",()=>{L=q.value,cn()},"ls-color-swatch",q.label);Z.dataset.colorVal=q.value,Z.style.background=q.preview,et.append(Z)}let Oe=e("input");if(Oe.type="color",Oe.title="Custom color",Oe.style.cssText="width:26px;height:22px;border:0;padding:0;background:transparent;cursor:pointer;",L.startsWith("#")&&L.length===7)Oe.value=L;Oe.addEventListener("input",()=>{L=Oe.value,cn()}),et.append(Oe),cn(),xt.append(et),X.append(xt);let Un=e("div","ls-grid"),qn=e("div","ls-label","Floating Widget Tab"),Kn=e("div");qn.append(Kn);let Gn=e("div","ls-label","Inline Ribbon Tab"),Zn=e("div");Gn.append(Zn);let Xn=e("div","ls-label","Character Dossier Tab"),Yn=e("div");Xn.append(Yn),Un.append(qn,Gn,Xn),X.append(Un);let Qn=e("div","ls-grid"),Jn;for(let[q,Z,pe]of[["Show in Widget",v,(oe)=>{v=oe}],["Show in Inline Ribbon",x,(oe)=>{x=oe}],["Show in Dossier",_,(oe)=>{_=oe}],["Pin to Header / Pill",k,(oe)=>{k=oe}],["Lock Value",y,(oe)=>{y=oe}]]){let oe=e("div");if(q==="Show in Dossier")Jn=oe;xe(t,o,oe,{checked:Z,label:q,onChange:pe}),Qn.append(oe)}X.append(Qn);let Bt=new Set(a?.extraWidgetTabIds??[]),ea=e("div","ls-label","Also Mirror in Additional Widget Tabs (Optional)"),ta=e("div","ls-row");for(let q of s.surfaces.widgetTabs){let Z=e("div");xe(t,o,Z,{checked:Bt.has(q.id),label:`${q.icon} ${q.label}`,onChange:(pe)=>{if(pe)Bt.add(q.id);else Bt.delete(q.id)}}),ta.append(Z)}ea.append(ta),X.append(ea);let be=a?.calculationMode==="ai_plus_local"||a?.calculationMode==="local_formula"?a.calculationMode:Boolean(a?.formula?.trim())&&a?.calculationMode!=="ai"?"local_formula":"ai",Dt=a?.promptTriggerMode??"always",dn=a?.injectInContinuity!==!1,na=e("div");i.append(na);let Ve=fe(t,o,na,{title:"3. Calculation Mode, Formula & Token Diet",iconName:"sparkles",badge:be==="local_formula"?"Pure Local":be==="ai_plus_local"?"AI + Local":"AI",defaultExpanded:!0}),pn=e("div","ls-stat-cell");pn.append(e("strong","","Calculation Mode"),e("small","ls-muted",'Use "AI + Local Math" when the AI must set starting values/deltas (e.g. Level & Stats, Vitals). Use "Pure Local" (0 tokens) when computed strictly from other stats (e.g. Eff POW/AGI).'));let aa=e("div","ls-row");pn.append(aa),Ve.append(pn);let un=e("div","ls-label","Prompt Frequency (When AI-Tracked)"),sa=e("div");un.append(sa),Ve.append(un);let ra=e("div");xe(t,o,ra,{checked:dn,label:"Include this stat in Story Continuity Prompt (turn off for UI-only scratchpads)",onChange:(q)=>{dn=q}}),Ve.append(ra);let mn=e("label","ls-label","Trigger Keywords (comma-separated — only sends rule when seen in recent chat)"),Ft=e("input","ls-input");Ft.placeholder="e.g. cash, money, bank, rent, pay, buy, wallet",Ft.value=(a?.promptKeywords??[]).join(", "),mn.append(Ft),Ve.append(mn);let fn=e("div","ls-stack"),ue=e("textarea","ls-input");ue.rows=4,ue.placeholder=`Write math using your stat IDs or auto-extracted tokens (e.g. round((40 + P + Lv * 2) * wound))
Supports: + - * / %, round(), floor(), ceil(), min(), max(), clamp(), if(), hasCond("...")`,ue.value=a?.formula??"";let oa=e("label","ls-label","Output Format Template (optional, e.g. POW {pow} | AGI {agi})"),Fe=e("input","ls-input");Fe.placeholder="Leave blank for plain number, or e.g. POW {pow} | AGI {agi}",Fe.value=a?.formulaOutputTemplate??"",oa.append(Fe);let Te=e("div","ls-formula-status"),Me=e("strong",""),Ht=e("small","ls-muted");Te.append(Me,Ht);let ia=e("div","ls-label"),Wt=e("div","ls-row-between"),ye=e("textarea","ls-input");ye.rows=3,ye.value=a?.triggerCues??"",ye.placeholder='Write your rule in plain English (used by AI, or click "Convert My Rule to Formula" when Local Toggle is ON)…';let hn=e("div","ls-row"),wt=e("div","ls-row");Te.append(wt);let hs=(q)=>{let Z=ue.selectionStart??ue.value.length,pe=ue.selectionEnd??ue.value.length;ue.value=ue.value.slice(0,Z)+q+ue.value.slice(pe),ue.focus(),ue.setSelectionRange(Z+q.length,Z+q.length),nt()},gn=!1,tt="",bn=(q,Z)=>{if(gn)return;let pe=q.trim();if(!pe){if(be==="ai")be="local_formula";at(),Te.dataset.status="warn",Me.textContent="⚠ Write your plain-English rule in the box below first, then click Convert.",ye.focus();return}if(!ye.value.trim())ye.value=pe;gn=!0;let oe=Z?.textContent??"";if(Z)Z.disabled=!0,Z.textContent="⏳ Converting…";if(be==="ai")be="local_formula";at(),Te.dataset.status="warn",Me.textContent="⏳ Converting your rule to a universal local formula…",wt.replaceChildren(),t.request("formula:compile",{statLabel:w.value.trim()||"Stat",ruleText:pe,scope:c}).then((se)=>{let Le=typeof se.formula==="string"?se.formula.trim():"";if(!Le){Te.dataset.status="error",Me.textContent="✖ AI returned an empty formula. Check your LLM connection in Studio → 6. AI & Connections.";return}if(ue.value=Le,typeof se.outputTemplate==="string")Fe.value=se.outputTemplate;if(se.suggestedMode==="ai_plus_local"||se.suggestedMode==="local_formula")be=se.suggestedMode;if(tt=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),at(),se.explanation)Ht.textContent=`✓ ${String(se.explanation)} · ${Ht.textContent}`}).catch((se)=>{Te.dataset.status="error",Me.textContent=`✖ Convert Failed: ${se instanceof Error?se.message:String(se)}`}).finally(()=>{if(gn=!1,Z&&Z.isConnected)Z.disabled=!1,Z.textContent=oe})},nt=()=>{let q=re({...a,id:a?.id||ie(w.value||"preview","preview"),label:w.value||"Preview",scope:c,kind:b,calculationMode:"local_formula",formula:ue.value,formulaOutputTemplate:Fe.value}),Z=Da(q,t.snapshot.state,s.stats,t.selectedActorId);hn.replaceChildren(e("small","ls-muted","Insert Variable:"));let pe=[...Object.keys(Z.availableTokens).slice(0,12),...Z.availableStringVars.conditions!==void 0?["conditions"]:[]];for(let se of pe){let Le=Z.availableTokens[se]!==void 0?String(Z.availableTokens[se]):Z.availableStringVars[se]||'""';hn.append(B(`${se} (${Le.slice(0,16)})`,()=>hs(ue.value.includes("{{")?`{{.${se}}}`:se),"ls-btn-sm ls-quick-pill",`Click to insert ${se}`))}let oe=Object.entries(Z.availableTokens).slice(0,14).map(([se,Le])=>`${se}=${Le}`).join(", ");if(Ht.textContent=oe?`Detected on ${Z.targetName}: ${oe}`:`No numeric tokens detected yet on ${Z.targetName}.`,wt.replaceChildren(),!ue.value.trim()){if(Te.dataset.status="warn",Me.textContent=ye.value.trim()?"⚠ Formula box is empty. Click below to convert your plain-English rule automatically, or type math / {{calc::...}} macros.":"⚠ Enter math lines, Lumiverse {{calc::...}} / {{if::...}} macros, or write a rule below and click Convert.",ye.value.trim()){let se=B("⚡ Convert My Rule to Local Formula",()=>bn(ye.value,se),"ls-btn-sm ls-btn-primary");wt.append(se)}}else if(Z.isProse){Te.dataset.status="warn",Me.textContent="⚠ Plain-English text detected — this box runs math/macro syntax. Click below to convert it automatically:";let se=B("⚡ Convert This Text to Formula",()=>bn(ue.value,se),"ls-btn-sm ls-btn-primary");wt.append(se)}else if(Z.error)Te.dataset.status="error",Me.textContent=`✖ Formula Error: ${Z.error}`;else if(Z.output!==void 0){let se=Object.keys(Z.locals).filter(($e)=>$e!=="value"&&$e!=="result");if(se.length>=2&&!Fe.value.trim()&&!ue.value.includes("{{"))Te.dataset.status="warn",Me.textContent=`⚠ Result is just "${String(Z.output)}" because Output Format Template is blank. Add e.g. {${se.join("} {")}} above!`;else{Te.dataset.status="ok";let $e=tt?` (Tested ${tt})`:"";Me.textContent=`✓ Working on ${Z.targetName} → Result: ${String(Z.output)}${$e}`}}else if(Z.missingRefs.length>0)Te.dataset.status="warn",Me.textContent=`⚠ Waiting for variables: ${Z.missingRefs.join(", ")}`;else Te.dataset.status="warn",Me.textContent="⚠ Formula evaluated empty — check placeholder names or macro tags."};ue.addEventListener("input",()=>{tt="",nt()}),Fe.addEventListener("input",()=>{tt="",nt()});let la=e("div","ls-row-between");la.append(e("strong","","Local Formula or Lumiverse Macros ({{calc}}, {{if}}, {{round}}, {{matches}})"),B("▶ Run Live Test",()=>{tt=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),nt()},"ls-btn-sm")),fn.append(la,hn,ue,oa,Te),Ve.append(fn);let ca=[],at=()=>{for(let pe of ca)pe.el.setAttribute("aria-current",pe.id===be?"page":"false");let q=be==="local_formula"||be==="ai_plus_local",Z=be==="ai"||be==="ai_plus_local";if(fn.style.display=q?"":"none",un.style.display=Z?"":"none",mn.style.display=Z&&Dt==="conditional"?"":"none",q)nt()};for(let[q,Z]of[["ai","\uD83E\uDD16 AI Only"],["ai_plus_local","\uD83D\uDD00 AI + Local Math"],["local_formula","⚡ Pure Local (0 tokens)"]]){let pe=B(Z,()=>{be=q,at()},"ls-btn-sm");ca.push({id:q,el:pe}),aa.append(pe)}J(t,o,sa,{value:Dt,ariaLabel:"Prompt Frequency",options:[{value:"always",label:"Always in Prompt"},{value:"conditional",label:"Only When Keywords Match"},{value:"manual",label:"Manual Sync Only"}],onChange:(q)=>{Dt=q,at()}}),at(),Wt.append(e("span","","Rule / AI Prompt Instructions"),e("div","ls-row"));let da=B("⚡ Convert My Rule to Local Formula",()=>bn(ye.value,da),"ls-btn-sm ls-btn-primary");Wt.lastElementChild.append(da);let vn=J(t,o,ge,{value:m,ariaLabel:"Visual Display Style",options:[{value:"auto",label:"✨ Smart Auto-Detect"},{value:"arc_tracker",label:"\uD83C\uDFAF Multi-Thread / Arc / Quest Cards"},{value:"accordion_cards",label:"\uD83D\uDDC2️ Collapsible Multi-Entry Cards"},{value:"matrix_badges",label:"⚖️ Split / Versus Comparison (Knows vs Blind)"},{value:"meter_mini_bars",label:"\uD83D\uDCCA Multi-Bar Mini Gauges (HP/MP cur/max)"},{value:"stat_pills_grid",label:"\uD83E\uDDEC Compact Stat Badges (Lv / P A I / POW)"},{value:"bullet_ledger",label:"\uD83D\uDCB0 Aligned Bullet & Currency Ledger"},{value:"timeline_list",label:"\uD83D\uDCDC Vertical Event Timeline"},{value:"checklist",label:"☑️ Visual Objectives Checklist"},{value:"feed_cards",label:"\uD83C\uDCCF Structured Flow Cards"},{value:"step_chain",label:"⛓️ Horizontal Step Chain"},{value:"key_value",label:"\uD83D\uDCCB Key–Value Table"},{value:"pill_list",label:"\uD83C\uDFF7️ Tag / Pill List"},{value:"quote_callout",label:"\uD83D\uDCAD Quote Callout Box"}],onChange:(q)=>{m=q;let Z=new Set(["text","tags","tier","skill_tree","xp_level","attributes","inventory","status_fx"]);if(m==="pill_list")b="tags",Ot.setValue("tags");else if(m!=="auto"&&!Z.has(b))b="text",Ot.setValue("text");ee()}}),yn=J(t,o,le,{value:S,ariaLabel:"Card Grid Width",options:[{value:"auto",label:"\uD83D\uDCD0 Auto"},{value:"full",label:"↔️ Always Full Width"},{value:"half",label:"▫ Always Compact Column"}],onChange:(q)=>{S=q}});J(t,o,D,{value:c,ariaLabel:"Owner Scope",options:[{value:"character",label:"\uD83D\uDC65 Character Meter (Per-NPC)"},{value:"player",label:"\uD83D\uDC64 Player Stat"},{value:"world",label:"\uD83C\uDF0D World Stat / Clock"},{value:"scene",label:"\uD83C\uDFAD Scene / Thread Stat"}],onChange:(q)=>{c=q,_=c==="character";let Z=Jn?.querySelector("input");if(Z)Z.checked=_;if(be==="local_formula")nt()}});let Ot=J(t,o,W,{value:b,ariaLabel:"Value Format",options:[{value:"meter",label:"\uD83D\uDCCA Progress Bar / Meter"},{value:"skill_tree",label:"\uD83C\uDF33 Skill Tree & SP"},{value:"xp_level",label:"⭐ XP & Leveling Gauge"},{value:"attributes",label:"\uD83E\uDDEC RPG Attributes + Radar"},{value:"inventory",label:"\uD83C\uDF92 Rarity Inventory"},{value:"status_fx",label:"⚡ Buffs & Debuffs"},{value:"hearts",label:"❤️ Heart Affinity Row"},{value:"currency",label:"\uD83E\uDE99 Currency Counter"},{value:"clock",label:"⏱️ Segmented Clock"},{value:"pips",label:"\uD83C\uDFB2 Resource Pips"},{value:"text",label:"\uD83D\uDCDD Structured Text / Feed"},{value:"tags",label:"\uD83C\uDFF7️ Tag / Pill List"},{value:"tier",label:"\uD83C\uDFC6 Ordered Stage / Rank"},{value:"number",label:"\uD83D\uDD22 Numeric Counter"},{value:"boolean",label:"☑️ Boolean Flag"}],onChange:(q)=>{if(b=q,b==="tags"&&m==="auto")m="pill_list",vn.setValue("pill_list");else if(["meter","clock","pips","number","boolean","skill_tree","xp_level","attributes","inventory","status_fx","hearts","currency"].includes(b)){if(m="auto",vn.setValue("auto"),["skill_tree","attributes","inventory","status_fx"].includes(b))S="full",yn.setValue("full")}if(!a){if(b==="clock")K.value="6";else if(b==="pips"||b==="hearts")K.value="5";else if(b==="attributes")K.value="20";else if(b==="currency")K.value="99999999";else if(b==="meter"&&["5","6"].includes(K.value.trim()))K.value="100"}else if(["clock","pips","hearts"].includes(b)&&Number(K.value)===100)K.value=b==="clock"?"6":"5";if(["text","tags","tier"].includes(b)&&G.value.trim()==="0")G.value="";ee()}});J(t,o,O,{value:M,ariaLabel:"Reactivity Profile",options:[{value:"momentary",label:"⚡ Momentary — Instant reaction"},{value:"progressive",label:"\uD83D\uDCC8 Progressive — Steady evolution"},{value:"anchor",label:"⚓ Anchor — Role/premise baseline"}],onChange:(q)=>{M=q}}),J(t,o,Kn,{value:T,ariaLabel:"Floating Widget Tab",options:s.surfaces.widgetTabs.map((q)=>({value:q.id,label:`${q.icon} ${q.label}`})),onChange:(q)=>{T=q}}),J(t,o,Zn,{value:N,ariaLabel:"Inline Ribbon Tab",options:s.surfaces.inlineTabs.map((q)=>({value:q.id,label:`${q.icon} ${q.label}`})),onChange:(q)=>{N=q}}),J(t,o,Yn,{value:I,ariaLabel:"Character Dossier Tab",options:s.surfaces.dossierTabs.map((q)=>({value:q.id,label:`${q.icon} ${q.label}`})),onChange:(q)=>{I=q}}),Wt.lastElementChild.append(B("\uD83C\uDF33 Skill Rule",()=>{b="skill_tree",Ot.setValue("skill_tree"),S="full",yn.setValue("full"),ye.value='Format: "SP: N | Skill A (Lv.X/Y, cost:1, bonus) ; Skill B (Lv.X/Y, cost:1, req:Skill A)". Grant SP on milestones or training.',ee()},"ls-btn-sm"),B("✨ Feed Rule",()=>{b="text",Ot.setValue("text"),m="feed_cards",vn.setValue("feed_cards"),S="full",yn.setValue("full"),ye.value='Format each entry separated by "; " as: "Subject: Current Location -> Action -> Next Hook".',ee()},"ls-btn-sm"),B("⛶ Full-Screen",()=>{t.request("textEditor:open",{title:`AI Prompt Rule: ${w.value||"Stat"}`,value:ye.value,placeholder:"Describe when this stat should calibrate high/low and what situational cues shift it…"}).then((q)=>{if(!q.cancelled&&typeof q.text==="string")ye.value=q.text})},"ls-btn-sm")),ia.append(Wt,ye),Ve.append(ia);let pa=e("div","ls-label"),ua=e("div","ls-row-between"),st=e("textarea","ls-input");st.rows=2,st.placeholder=`Optional — e.g.
80: High — Description
50: Moderate — Description`,st.value=(a?.anchors??[]).map((q)=>`${q.value}: ${q.label}${q.description&&q.description!==q.label?` — ${q.description}`:""}`).join(`
`),ua.append(e("span","","Scale Anchors (value: Label — Description)"),B("✨ Auto-Fill Anchors",()=>{let q=xa(Number(z.value)||0,Number(K.value)||100,M);st.value=q.map((Z)=>`${Z.value}: ${Z.label} — ${Z.description}`).join(`
`)},"ls-btn-sm")),pa.append(ua,st),Ve.append(pa);let gs=(q)=>{if(!q.trim())return[];let Z=[];for(let pe of q.split(`
`).map((oe)=>oe.trim()).filter(Boolean)){let oe=pe.match(/^(-?\d+(?:\.\d+)?)\s*:\s*([^—\-]+?)(?:\s*[—\-]\s*(.+))?$/);if(oe)Z.push({value:Number(oe[1]),label:oe[2].trim(),description:(oe[3]??oe[2]).trim()})}return Z},ma=B(a?"Save Changes":"Create Stat",()=>{let q=w.value.trim();if(!q)return;let Z=structuredClone(t.snapshot.template),pe=Number(z.value),oe=z.value.trim()!==""&&Number.isFinite(pe)?pe:0,se=Number(K.value),Le=K.value.trim()!==""&&Number.isFinite(se)?se:100,$e=G.value.trim(),fa=Number($e),ha=b==="boolean"?$e==="true"||$e==="1":["meter","number","clock","pips","hearts","currency"].includes(b)&&m==="auto"?$e!==""&&Number.isFinite(fa)?fa:Math.max(Math.min(oe,Le),Math.min(Math.max(oe,Le),0)):$e&&$e!=="0"?$e:void 0,bs=Ft.value.split(",").map((Ie)=>Ie.trim().toLowerCase()).filter(Boolean),ga=a?.id,xn=[];if(a&&q.toLowerCase()!==a.label.trim().toLowerCase()){let Ie=ie(q,a.id),vs=Z.stats.some((ya)=>ya.id===Ie&&ya.id!==a.id);if(Ie&&Ie!==a.id&&!vs)ga=Ie,xn.push({fromId:a.id,toId:Ie})}let St=re({...a,id:ga,label:q,icon:C.value.trim()||"\uD83D\uDCCA",scope:c,kind:b,volatility:M,displayStyle:m,layoutSpan:S,color:L,min:oe,max:Le,...ha!==void 0?{defaultValue:ha}:{},anchors:gs(st.value),triggerCues:ye.value.trim(),calculationMode:be,formula:be==="local_formula"||be==="ai_plus_local"?ue.value.trim():void 0,formulaOutputTemplate:be==="local_formula"||be==="ai_plus_local"?Fe.value.trim():void 0,promptTriggerMode:Dt,promptKeywords:bs,injectInContinuity:dn,categoryId:f||void 0,pinnedToHeader:k,locked:y,widgetTabId:T,inlineTabId:N,dossierTabId:I,extraWidgetTabIds:[...Bt].filter((Ie)=>Ie!==T),showIn:{widget:v,inline:x,dossier:_,pinnedHeader:k}}),ba=a?Z.stats.findIndex((Ie)=>Ie.id===a.id):-1,va=Z.stats.findIndex((Ie)=>Ie.id===St.id);if(ba>=0)Z.stats[ba]=St;else if(va>=0)Z.stats[va]=St;else Z.stats.push(St);t.request("state:mutate",{templatePatch:{stats:Z.stats},...xn.length?{statRenames:xn}:{},reason:`Saved stat schema "${St.label}"`}),r()},"ls-btn-primary"),Vt=e("div","ls-row-between");if(Vt.style.marginTop="12px",a){let q=e("div","ls-row");q.append(B("Duplicate to Another Tab…",()=>{r(),We(t,a)},"ls-btn-sm"),B("\uD83D\uDDD1️ Delete Stat",async()=>{if(!await t.modals.confirm({title:`Delete "${a.label}"?`,message:`Remove "${a.icon} ${a.label}" from the active template and stop tracking it?`,confirmLabel:"Delete",variant:"danger"}))return;let pe=structuredClone(t.snapshot.template);t.request("state:mutate",{templatePatch:{stats:pe.stats.filter((oe)=>oe.id!==a.id)},reason:`Deleted stat "${a.label}"`}),t.notify(`Deleted "${a.icon} ${a.label}".`),r()},"ls-btn-sm ls-btn-danger")),Vt.append(q,ma)}else Vt.append(e("span"),ma);i.append(Vt)})}function Dn(t,n,a,s,i=!1,r=!0){let{state:d,template:o,deltas:c}=t.snapshot,f=e("div","ls-stack");if(r){let v=e("div","ls-row-between");v.append(e("span","ls-kicker",`Active Stats (${n.length})`),e("div","ls-row")),v.lastElementChild.append(Q("flask",()=>Ze(t),{label:"Sandbox",className:"ls-btn-sm ls-btn-ghost",title:"Test stats in AI Sandbox"}),Q("plus",()=>Ce(t,a),{label:"Add Stat",className:"ls-btn-sm ls-btn-primary",title:"Create a new stat or meter"})),f.append(v)}if(!n.length)return f.append(e("p","ls-muted",'No stats assigned here yet. Click "+ Add Stat" or customize tab assignments in Studio.')),f;let b=new Map((o.categories??[]).map((v)=>[v.id,v])),M=n.filter((v)=>{if(!v.categoryId)return!0;let x=b.get(v.categoryId);return!x||x.enabled!==!1}),m=e("div","ls-stat-grid"),S=(v,x,_="set")=>{t.request("state:mutate",{patch:{stats:{[v.id]:{op:_,value:x,reason:"Manual UI adjustment"}}},reason:`Updated ${v.label} to ${String(x)}`})},L=[],T=[...M].sort((v,x)=>{let _=v.categoryId?b.get(v.categoryId)?.order??999:1000,k=x.categoryId?b.get(x.categoryId)?.order??999:1000;return _-k}),N;for(let v of T){let x=v.categoryId?b.get(v.categoryId):void 0;if(x&&x.showGroupHeaderInHud!==!1&&x.id!==N){N=x.id;let H=e("div","ls-hud-cat-head");H.style.borderLeftColor=x.color||"var(--ls-primary)",H.append(e("strong","",`${x.icon} ${x.name}`)),m.append(H)}else if(!x&&N!==void 0)N=void 0;let _=d.stats[v.id],k=Boolean(_?.calibrated),y=_!==void 0?_.value:v.defaultValue,u=Boolean(v.locked||_?.locked),g=c.statDeltas[v.id]??0,p=String(y??""),h=["skill_tree","xp_level","attributes","inventory","status_fx"].includes(v.kind),C=Boolean(v.displayStyle&&v.displayStyle!=="auto"),l=v.kind==="text"||v.kind==="tags"||v.kind==="tier",w=!h&&(C||l||k&&typeof y==="string"&&(p.length>24||/->|→|\n|;/.test(p))),P=/->|→|\n|;/.test(p),R=v.displayStyle==="stat_pills_grid"||v.displayStyle==="meter_mini_bars",A=v.layoutSpan==="full"||v.layoutSpan!=="half"&&(["skill_tree","attributes","inventory","status_fx","xp_level"].includes(v.kind)||C&&!R||w&&(p.length>40||P))?"full":"half",E=e("div","ls-stat-cell");if(E.style.setProperty("--ls-bar-color",v.color||"var(--ls-primary)"),E.dataset.locked=String(u),E.dataset.uncalibrated=String(!k),E.dataset.span=A,_?.lastReason)E.title=`${_.lastReason} (Right-click or long-press for options)`;let D=e("div","ls-row-between"),F=e("div","ls-row");if(F.append(e("strong","",`${v.icon} ${v.label}`)),v.calculationMode==="ai_plus_local")F.append(e("span","ls-chip ls-chip-accent","\uD83D\uDD00 Hybrid"));else if(v.calculationMode==="local_formula"||v.formula)F.append(e("span","ls-chip ls-chip-accent","⚡ Local"));D.append(F);let W=e("div","ls-row");if(g!==0)W.append(e("span",`ls-delta ${g>0?"is-pos":"is-neg"}`,`${g>0?`+${g} ▲`:`${g} ▼`}`));let V="";if(!k&&!h)V="Uncalibrated";else if(v.kind==="clock"||v.kind==="pips")V=`${Number(y)||0}/${v.max}`;else if(v.kind==="boolean")V=y?"✓ Active":"○ Inactive";else if(h||v.kind==="currency"||v.kind==="hearts")V="";else if(w){let H=Et(p).length;V=H>1?`${H} entries`:""}else V=p;let O=e("strong",V?"ls-chip ls-chip-accent":"",V);if(V)W.append(O);if(W.append(Q("edit",()=>Ce(t,v.scope,v),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:`Edit "${v.label}" style, tab & prompt`})),D.append(W),E.append(D),typeof y==="number"&&k&&!w&&v.kind!=="currency"){let H=Ue(v.anchors,y);if(H)E.append(e("small","ls-muted",H))}else if(!k&&!h)E.append(e("small","ls-muted","Calibrates automatically on turn sync"));if(v.kind==="skill_tree")E.append(pt(v,y,u,(H,U)=>{t.request("state:mutate",{patch:{stats:{[v.id]:{op:"set",value:H,reason:U}}},reason:U})}));else if(v.kind==="xp_level")E.append(ut(v,y));else if(v.kind==="attributes")E.append(mt(v,y,`player:${t.chatId}`));else if(v.kind==="inventory")E.append(ft(y));else if(v.kind==="status_fx")E.append(ht(y));else if(v.kind==="hearts")E.append(gt(v,Number(y)||0,k,u,(H)=>S(v,H,"set")));else if(v.kind==="currency")E.append(bt(v,y,g));else if(w&&k&&p&&p!=="None")E.append(Xe(p,v.displayStyle??"auto"));else if(v.kind==="clock"){let H=Math.max(2,Math.min(16,v.max||6)),U=k?Math.max(0,Math.min(H,Math.round(Number(y)||0))):0,z=e("div","ls-clock-bar");z.style.gridTemplateColumns=`repeat(${H}, 1fr)`;for(let j=1;j<=H;j++){let K=e("span",`ls-clock-seg${j<=U?" is-filled":""}`);K.addEventListener("click",()=>S(v,j===U?j-1:j,"set")),z.append(K)}E.append(z)}else if(v.kind==="pips"){let H=Math.max(1,Math.min(12,v.max||5)),U=k?Math.max(0,Math.min(H,Math.round(Number(y)||0))):0,z=e("div","ls-row");for(let j=1;j<=H;j++)z.append(B(j<=U?"◆":"◇",()=>S(v,j===U?j-1:j,"set"),"ls-btn-sm ls-btn-icon"));E.append(z)}else if(!w&&(v.kind==="meter"||v.kind==="number")){let H=typeof y==="number"?y:Number(v.defaultValue)||0,U=Math.max(1,v.max-v.min),z=e("div","ls-bar-track"),j=e("div","ls-bar-fill");if(v.min<0&&v.max>0){z.dataset.bipolar="true";let K=(0-v.min)/U*100;if(H>=0)j.style.marginLeft=`${K.toFixed(1)}%`,j.style.width=`${Math.min(100-K,H/v.max*(100-K)).toFixed(1)}%`;else{let Y=Math.abs(H)/Math.abs(v.min)*K;j.style.marginLeft=`${Math.max(0,K-Y).toFixed(1)}%`,j.style.width=`${Math.min(K,Y).toFixed(1)}%`,j.style.background="var(--ls-danger)"}}else{let K=Math.max(0,Math.min(100,Math.round((H-v.min)/U*100)));j.style.width=`${K}%`}if(z.append(j),E.append(z),i&&s&&t.ctx.components?.mountRangeSlider){let K=e("div");E.append(K);try{s.track(t.ctx.components.mountRangeSlider(K,{min:v.min,max:v.max,step:v.step||1,integer:!0,value:H,disabled:u,onDragValue:(Y)=>{if(Y!==null)O.textContent=String(Y)},onCommit:(Y)=>S(v,Y,"set")}))}catch{}}}Ut(t.ctx,E,()=>[{key:"pin",label:v.pinnedToHeader?"\uD83D\uDCCC Unpin from Header":"\uD83D\uDCCD Pin to Header",active:v.pinnedToHeader},{key:"lock",label:u?"\uD83D\uDD13 Unlock Stat":"\uD83D\uDD12 Lock Stat",active:u},{key:"edit",label:"✏️ Edit Stat Schema, Visual Style & Routing"},{key:"duplicate",label:"\uD83D\uDCCB Duplicate to Another Scope / Tab…"},{key:"test",label:"\uD83E\uDDEA Test in AI Sandbox"},{key:"div",label:"",type:"divider"},{key:"delete",label:"\uD83D\uDDD1️ Delete Stat",danger:!0}],(H)=>{if(H==="pin"){let U=o.stats.map((z)=>z.id===v.id?{...z,pinnedToHeader:!z.pinnedToHeader,showIn:{...z.showIn,pinnedHeader:!z.pinnedToHeader}}:z);t.request("state:mutate",{templatePatch:{stats:U}})}else if(H==="lock"){let U=o.stats.map((z)=>z.id===v.id?{...z,locked:!u}:z);t.request("state:mutate",{templatePatch:{stats:U}})}else if(H==="edit")Ce(t,v.scope,v);else if(H==="duplicate")We(t,v);else if(H==="test")Ze(t,v.id);else if(H==="delete"){let U=o.stats.filter((z)=>z.id!==v.id);t.request("state:mutate",{templatePatch:{stats:U}})}}),L.push({cell:E,spanMode:A,autoSpan:!v.layoutSpan||v.layoutSpan==="auto"}),m.append(E)}let I=0;for(let v=0;v<L.length;v++){let x=L[v];if(x.spanMode==="half"){if(I++,(v===L.length-1||L[v+1].spanMode==="full")&&I%2===1&&x.autoSpan)x.cell.dataset.span="full",I=0}else I=0}return f.append(m),f}var Za=new Map;function js(t,n,a,s=!1){let{state:i,deltas:r}=t.snapshot,d=e("div","ls-stack"),o=Object.values(i.characters),c=o.filter((m)=>m.present),f=o.filter((m)=>!m.present),b=c.length>0?c:f,M=c.length>0?f:[];if(!o.length)return d.append(e("p","ls-muted",`${n.map((m)=>`${m.icon} ${m.label}`).join(", ")} will appear here once characters enter the scene.`)),d;for(let m of n){let S=e("div","ls-stat-cell");S.style.setProperty("--ls-bar-color",m.color||"var(--ls-primary)"),S.dataset.span="full";let L=e("div","ls-row-between");L.append(e("strong","",`${m.icon} ${m.label} (Cast)`),B("✏️",()=>Ce(t,"character",m),"ls-btn-sm ls-btn-icon","Customize stat schema & tab")),S.append(L);let T=["skill_tree","xp_level","attributes","inventory","status_fx"].includes(m.kind),N=Boolean(m.displayStyle&&m.displayStyle!=="auto")||["text","tags","tier"].includes(m.kind),I=(x,_)=>{let k=_.meters[m.id],y=Boolean(k?.calibrated),u=y&&k?k.value:m.defaultValue,g=r.characterDeltas[_.id]?.[m.id]??0;if(T||N||m.kind==="boolean"||m.kind==="hearts"||m.kind==="currency"){let F=e("div","ls-cast-mini-meter");F.style.gridColumn="1 / -1";let W=e("div","ls-row-between");if(W.append(e("small","ls-muted",`${_.present?"\uD83D\uDFE2":"⚪"} ${_.name}`),e("small","",y||T?"":"Uncalibrated")),F.append(W),m.kind==="skill_tree")F.append(pt(m,u,Boolean(m.locked||k?.locked),(V,O)=>{t.request("state:mutate",{patch:{characters:[{id:_.id,name:_.name,meters:{[m.id]:{op:"set",value:V,reason:O}}}]},reason:O})}));else if(m.kind==="xp_level")F.append(ut(m,u));else if(m.kind==="attributes")F.append(mt(m,u,`${_.id}:${t.chatId}`));else if(m.kind==="inventory")F.append(ft(u));else if(m.kind==="status_fx")F.append(ht(u));else if(m.kind==="hearts")F.append(gt(m,Number(u)||0,y,Boolean(m.locked||k?.locked)));else if(m.kind==="currency")F.append(bt(m,u,g));else F.append(y?Xe(String(u??""),m.displayStyle??"auto"):e("small","ls-muted","—"));x.append(F);return}let p=y&&typeof u==="number"?u:0,h=Math.max(1,m.max-m.min),C=y?Math.max(0,Math.min(100,Math.round((p-m.min)/h*100))):0,l=y?Ue(m.anchors,p):"",w=e("div","ls-cast-mini-meter");if(l)w.title=`${_.name} · ${m.label}: ${p} (${l})`;let P=e("div","ls-row-between");P.append(e("small","ls-muted",`${_.present?"\uD83D\uDFE2":"⚪"} ${_.name}`));let R=e("div","ls-row");if(g!==0)R.append(e("span",`ls-delta ${g>0?"is-pos":"is-neg"}`,g>0?`+${g}`:String(g)));let A=e("strong","",y?m.kind==="clock"||m.kind==="pips"?`${p}/${m.max}`:String(p):"—");R.append(A),P.append(R);let E=e("div","ls-bar-track"),D=e("div","ls-bar-fill");if(D.style.width=`${C}%`,E.append(D),w.append(P,E),s&&a&&t.ctx.components?.mountRangeSlider){let F=e("div");w.append(F);try{a.track(t.ctx.components.mountRangeSlider(F,{min:m.min,max:m.max,step:m.step||1,integer:!0,value:p,disabled:Boolean(m.locked||k?.locked),onDragValue:(W)=>{if(W!==null)A.textContent=String(W)},onCommit:(W)=>{t.request("state:mutate",{patch:{characters:[{id:_.id,name:_.name,meters:{[m.id]:{op:"set",value:W,reason:"Manual UI adjustment"}}}]},reason:`Updated ${_.name} ${m.label} to ${W}`})}}))}catch{}}x.append(w)},v=e("div","ls-cast-mini-grid");for(let x of b)I(v,x);if(S.append(v),M.length>0){let x=e("details","ls-stat-acc");x.open=Za.get(m.id)??!1,x.addEventListener("toggle",()=>{Za.set(m.id,x.open)});let _=e("summary","ls-stat-acc-head");_.append(e("small","ls-muted",`⚪ Away (${M.length}): ${M.map((u)=>u.name).join(", ")}`),e("small","ls-muted","▾"));let k=e("div","ls-stat-acc-body"),y=e("div","ls-cast-mini-grid");for(let u of M)I(y,u);k.append(y),x.append(_,k),S.append(x)}d.append(S)}return d}function tn(t,n,a,s,i=!1){let{template:r}=t.snapshot,d=r.stats.filter((m)=>{if(!m.enabled)return!1;if(n==="widget"&&m.showIn?.widget===!1)return!1;if(n==="inline"&&m.showIn?.inline===!1)return!1;let S=m.scope==="character"?"cast":m.tabId,L=n==="widget"?m.widgetTabId||S:m.inlineTabId||S,T=n==="widget"?m.extraWidgetTabIds:m.extraInlineTabIds;return L===a||Boolean(T?.includes(a))}),o=d.filter((m)=>m.scope!=="character"),c=d.filter((m)=>m.scope==="character"),f=a==="world"?"world":"player",b=e("div","ls-stack"),M=Us(t,n,a);if(M.childElementCount>0)b.append(M);if(o.length>0||c.length===0&&b.childElementCount===0)b.append(Dn(t,o,f,s,i,!0));if(c.length>0)b.append(js(t,c,s,i));if(a==="world"){let m=qs(t);if(m.childElementCount>0)b.append(m)}return b}function Us(t,n,a="stats"){let{state:s,template:i}=t.snapshot,r=i.coreTrackers,d=e("div","ls-stat-grid"),o=(c,f,b)=>{let M=He(r,c);if(!M.enabled)return;if(n!=="drawer"&&!M.showCard)return;if(n==="widget"&&M.widgetTabId&&M.widgetTabId!==a)return;if(n==="inline"&&M.inlineTabId&&M.inlineTabId!==a)return;let m=e("div","ls-stat-cell");m.style.setProperty("--ls-bar-color",M.color||"var(--ls-primary)"),m.dataset.locked=String(Boolean(M.locked));let S=M.layoutSpan==="half"||M.layoutSpan==="full"?M.layoutSpan:f.length>48||/->|→|\n|;/.test(f)?"full":"half";m.dataset.span=S;let L=e("div","ls-row-between");L.append(e("strong","",`${M.icon||"\uD83D\uDCCA"} ${M.label}`),e("div","ls-row")),L.lastElementChild.append(Q("sliders",()=>Qt(t,c),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:`Full Edit "${M.label}" (Prompt, Style, Tab & Color)`}),Q("edit",()=>_t(t),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:`Edit ${M.label} value`}));let T=M.displayStyle??"auto",N=T!=="auto"||b||/->|→|\n|;/.test(f);m.append(L,N?Xe(f,T):e("p","",f)),d.append(m)};if(s.player.condition&&s.player.condition!=="Normal")o("player_condition",s.player.condition,!0);if(s.player.attire)o("player_attire",s.player.attire,!1);if(s.player.notableAction)o("player_action",s.player.notableAction,!1);if(n!=="drawer"&&s.scene.beatSummary)o("scene_summary",s.scene.beatSummary,!1);return d}function qs(t){let{state:n,template:a}=t.snapshot,s=a.coreTrackers,i=e("div","ls-stack"),r=He(s,"quests"),d=He(s,"dispatches"),o=Object.values(n.quests);if(r.enabled&&!r.deleted&&s?.showQuestsInWidget!==!1&&o.length>0){let c=e("div","ls-stat-cell");c.dataset.span="full",c.append(e("strong","",`${r.icon||"\uD83C\uDFAF"} ${r.label} (${o.filter((f)=>f.status==="active").length})`));for(let f of o){let b=e("div","ls-stack");b.style.gap="3px",b.append(e("small","ls-kicker",`${f.title} (${f.status})`));for(let[M,m]of f.objectives.entries()){let S=e("label","ls-row"),L=e("input");L.type="checkbox",L.checked=m.completed,L.addEventListener("change",()=>{let T=f.objectives.map((I,v)=>v===M?{...I,completed:L.checked}:I),N=T.every((I)=>I.completed);t.request("state:mutate",{patch:{quests:[{id:f.id,title:f.title,status:N?"completed":"active",objectives:T}]}})}),S.append(L,e("small",m.completed?"ls-muted":"",m.text)),b.append(S)}c.append(b)}i.append(c)}if(d.enabled&&!d.deleted&&s?.showDispatchesInWidget!==!1&&n.dispatches.length>0){let c=e("div","ls-stat-cell");c.dataset.span="full",c.append(e("strong","",`${d.icon||"\uD83D\uDCE1"} ${d.label} (${n.dispatches.length})`));for(let f of[...n.dispatches].reverse().slice(0,3)){let b=e("div","ls-bond-dir-box");b.append(e("strong","",`${f.title} · \uD83D\uDCCD ${f.locationName}`),e("small","ls-muted",f.summary)),c.append(b)}i.append(c)}return i}function Ks(t){let{theme:n}=t.snapshot.template;t.modals.open({title:"\uD83D\uDCD0 Widget & Pill Size Customizer (Any Extreme)",width:520},(a,s)=>{let i=n.widgetWidth??460,r=n.widgetHeight??540,d=n.pillWidth??420,o=n.pillHeight??92,c=e("div","ls-card");c.append(e("span","ls-kicker","1-Click Widget Size Presets"));let f=e("div","ls-row");for(let[k,y,u]of[["Micro (280×240)",280,240],["Compact (380×420)",380,420],["Standard (460×540)",460,540],["Wide (680×560)",680,560],["Theater (920×720)",920,720],["Extreme Max (1180×860)",1180,860]])f.append(B(k,()=>{i=y,r=u,S.value=String(i),T.value=String(r),t.widgetExpanded=!0,t.onResizeWidgetLive?.(i,r,!0)},"ls-btn-sm"));let b=e("div","ls-row");b.append(e("small","ls-muted","Widget Tabs:"));for(let[k,y]of[[!1,"\uD83C\uDFF7️ Icons + Labels"],[!0,"✨ Icons Only"]]){let u=B(y,()=>{t.request("state:mutate",{templatePatch:{theme:{...t.snapshot.template.theme,widgetTabsIconOnly:k}},reason:`Set widget tabs to ${k?"icons only":"icons + labels"}`})},"ls-btn-sm");if(Boolean(t.snapshot.template.theme.widgetTabsIconOnly)===k)u.setAttribute("aria-current","page");b.append(u)}c.append(f,b);let M=e("div","ls-grid"),m=e("label","ls-label","Expanded Width (240–1200 px)"),S=e("input","ls-input");S.type="number",S.min="240",S.max="1200",S.value=String(i),m.append(S);let L=e("label","ls-label","Expanded Height (180–900 px)"),T=e("input","ls-input");T.type="number",T.min="180",T.max="900",T.value=String(r),L.append(T);let N=e("label","ls-label","Collapsed Pill Width (220–960 px)"),I=e("input","ls-input");I.type="number",I.min="220",I.max="960",I.value=String(d),N.append(I);let v=e("label","ls-label","Collapsed Pill Height (56–220 px)"),x=e("input","ls-input");x.type="number",x.min="56",x.max="220",x.value=String(o),v.append(x),M.append(m,L,N,v);let _=B("\uD83D\uDCBE Apply & Save Dimensions",()=>{let k=Math.max(240,Math.min(1200,Number(S.value)||460)),y=Math.max(180,Math.min(900,Number(T.value)||540)),u=Math.max(220,Math.min(960,Number(I.value)||420)),g=Math.max(56,Math.min(220,Number(x.value)||92));if(t.request("state:mutate",{templatePatch:{theme:{...t.snapshot.template.theme,widgetWidth:k,widgetHeight:y,pillWidth:u,pillHeight:g}},reason:`Resized widget (${k}×${y})`}),t.widgetExpanded)t.onResizeWidgetLive?.(k,y,!1);else t.onResizeWidgetLive?.(u,g,!1);s()},"ls-btn-primary");a.append(c,M,_)})}function Fn(t,n){let{state:a,template:s,deltas:i}=t.snapshot,r=s.theme.showSceneChips,d=Ne(a),o=e("div","ls-game-pill-main");if(r.location&&!n?.omitLocation)o.append(e("span","ls-chip ls-chip-accent",`\uD83D\uDCCD ${d.location}`));if(r.time)o.append(e("span","ls-chip",`\uD83D\uDD70️ ${d.time}`));if(r.date&&d.date)o.append(e("span","ls-chip",`\uD83D\uDCC5 ${d.date}`));if(r.weather&&d.weather&&d.weather!=="Clear")o.append(e("span","ls-chip",`\uD83C\uDF26️ ${d.weather}`));let c=Object.values(a.characters).filter((b)=>b.present);if(r.cast&&c.length>0){let b=e("div","ls-avatar-stack");b.title=`In Scene: ${c.map((M)=>M.name).join(", ")}`;for(let M of c.slice(0,4)){let m=e("span","ls-avatar-stack-item");if(M.portraitUrl){let S=e("img");S.src=M.portraitUrl,S.alt=M.name,m.append(S)}else m.textContent=M.name.slice(0,2).toUpperCase();b.append(m)}o.append(b)}let f=r.pinnedStats?s.stats.filter((b)=>b.enabled&&(b.pinnedToHeader||b.showIn?.pinnedHeader)):[];for(let b of f.slice(0,3)){let M=b.scope==="character",m=c[0]??Object.values(a.characters)[0],S=M?m?.meters[b.id]:a.stats[b.id];if(!S?.calibrated)continue;let L=S.value,T=M?m?i.characterDeltas[m.id]?.[b.id]??0:0:i.statDeltas[b.id]??0;if(typeof L==="number"&&b.kind!=="currency"){let N=e("div","ls-pill-gauge");N.style.setProperty("--ls-bar-color",b.color||"var(--ls-primary)");let I=e("div","ls-pill-gauge-top");I.append(e("span","",`${b.icon} ${M&&m?m.name.split(" ")[0]:b.label}`),e("span","",`${L}${T!==0?T>0?` +${T}`:` ${T}`:""}`));let v=e("div","ls-pill-gauge-track"),x=e("div","ls-bar-fill"),_=Math.max(1,b.max-b.min),k=Math.max(0,Math.min(100,Math.round((L-b.min)/_*100)));x.style.width=`${k}%`,v.append(x),N.append(I,v),o.append(N)}else o.append(e("span","ls-chip",`${b.icon} ${M&&m?`${m.name}: `:""}${String(L)}`))}return o}function yt(t,n,a,s,i,r){let{state:d,template:o}=t.snapshot,c=e("section","ls-hud");t.stampThemeOnElement(c);let f=async(k)=>{let y=()=>lt(t,i);if(typeof t.ctx.ui?.showContextMenu!=="function"){y();return}let{selectedKey:u}=await t.ctx.ui.showContextMenu({position:{x:k.clientX,y:k.clientY},items:[{key:"edit_scene",label:"Edit Scene Values (Location, Time, Date)"},{key:"pill_prompts",label:"Edit Scene Pill AI Prompts & Chips"},{key:"div1",label:"",type:"divider"},{key:"template",label:`Switch Template & Skin (${o.name})`},{key:"resize",label:"Resize Floating Widget"},{key:"studio",label:"Open Full Settings Studio"}]});if(u==="edit_scene")_t(t);else if(u==="pill_prompts")Ae(t);else if(u==="template")lt(t,i);else if(u==="resize")Ks(t);else if(u==="studio")i()},b=()=>{let k=e("div","ls-row"),y=Q("sync",()=>void t.request("track:manual"),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:t.busy?"Calibrating…":"Sync & calibrate current turn"});y.disabled=t.busy;let u=Q("stage",()=>t.toggleVnStage(),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:"Launch 2D Visual Novel Stage & Voices"}),g=Q("more",(C)=>void f(C),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:"Scene Pill Prompts, Template Switcher, Resize & Studio"}),p=Q("settings",()=>{console.log("[LumiStats FloatingHud] ⚙️ studio button clicked"),i()},{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:"Open Lumi Stats Studio"}),h=Q(n?"chevronDown":"chevronUp",a,{label:n?"Expand":"Pill",className:"ls-btn-sm ls-btn-primary",title:n?"Expand Floating HUD":"Collapse to Status Pill"});return k.append(y,u,g,p,h),k};if(n){let k=o.theme.pillStyle||"glass_capsule",y=o.theme.showSceneChips,u=Ne(d),g=e("div","ls-hud-pill");g.dataset.pillSkin=k,g.addEventListener("click",(A)=>{if(A.target instanceof Element&&A.target.closest("button"))return;a()});let p=e("div","ls-row-between ls-pill-top-deck"),h=e("span","ls-hud-title-badge"),C=e("span","ls-pill-live-dot"),l=y.location?d.scene.location||d.title||"Lumi Stats":d.title||o.name||"Lumi Stats",w=k==="cyber_telemetry"?`${y.location?"LOC":"HUD"} // ${l.toUpperCase()}`:k==="ledger_strip"&&y.date?`${u.date} · ${l}`:l;h.append(C,e("span","",o.icon||"✨"),e("span","ls-pill-title-text",w));let P=b();P.classList.add("ls-pill-actions"),p.append(h,P),g.append(p);let R=!1;if(k!=="compact_badge"){if(d.initialized){let A=Fn(t,{omitLocation:!0});if(A.childElementCount>0)A.classList.add("ls-pill-bottom-deck"),g.append(A),R=!0}else if(t.chatId){let A=e("div","ls-row ls-pill-bottom-deck");A.append(B("Calibrate World Now",()=>void t.request("track:manual"),"ls-btn-sm ls-btn-primary"),B("Studio",i,"ls-btn-sm")),g.append(A),R=!0}}return g.dataset.emptyDeck=String(!R),c.append(g),c}let M=[...o.surfaces.widgetTabs].filter((k)=>k.enabled&&(k.kind!=="web"||o.surfaces.showRelationshipWeb!==!1)).sort((k,y)=>k.order-y.order),m=M.find((k)=>k.id===t.activeSurfaceTab)??M[0]??{id:"stats",label:"Stats",icon:"\uD83D\uDCCA",kind:"stats",enabled:!0,order:0},S=e("nav","ls-hud-header-bar"),L=e("div","ls-hud-top-row"),T=B(`${o.icon} ${d.scene.location||d.title||"Lumi Stats"}`,()=>Ae(t),"ls-btn-sm ls-btn-ghost ls-hud-title-badge","Click to customize Scene Pill prompt & visible chips");L.append(T,b());let N=Boolean(o.theme.widgetTabsIconOnly),I=e("div","ls-hud-tabs-scroll"),v=(k)=>/[^\w\s]/u.test(k.trim());for(let k of M){let y=k.kind==="cast"?` (${Object.keys(d.characters).length})`:k.kind==="map"?` (${Object.keys(d.places).length})`:"",u=`${k.label}${y}`,g=N&&v(k.icon),p=B(g?k.icon:`${k.icon} ${u}`,()=>{t.activeSurfaceTab=k.id,t.emitChange()},`ls-btn-sm${g?" ls-hud-tab-icon-only":""}`,u);if(k.id===m.id)p.setAttribute("aria-current","page");I.append(p)}S.append(L,I),c.append(S);let x=e("div","ls-hud-content");if(!d.initialized){let k=e("div","ls-card");if(k.append(e("strong","",t.chatId?"Ready to calibrate this story":"Open a chat to begin"),e("p","ls-muted","Send a message for automatic two-phase calibration, or click below to calibrate now:")),t.chatId)k.append(B("✨ Calibrate Stats Now",()=>void t.request("track:manual"),"ls-btn-primary"));return x.append(k),c.append(x),c}if(o.surfaces.customWidgetHtml){let k=e("div","ls-card");x.append(k),Be(k,De(o.surfaces.customWidgetHtml,d),t.ctx)}if(d.modifiers.length>0&&m.kind==="stats"){let k=e("div","ls-row");for(let y of d.modifiers){let u=e("span","ls-rpg-fx-pill",`${y.delta>=0?"▲":"▼"} ${y.label} (${y.delta>=0?`+${y.delta}`:y.delta}${y.remainingTurns?` · ${y.remainingTurns}t`:""})`);u.dataset.fxKind=y.delta>=0?"buff":"debuff",k.append(u)}x.append(k)}if(m.kind==="cast")x.append(nn(t,"widget",m.id,s));else if(m.kind==="web")x.append(Zt(t,s));else if(m.kind==="map")x.append(en(t));else{if(m.customHtml){let k=e("div","ls-card");x.append(k),Be(k,De(m.customHtml,d),t.ctx)}x.append(tn(t,"widget",m.id,r,!1))}c.append(x);let _=e("div","ls-hud-resize-grip","◢");return _.title="Drag to resize widget to any size",_.addEventListener("pointerdown",(k)=>{if(k.button!==0||!t.onResizeWidgetLive)return;k.preventDefault(),k.stopPropagation();let y=c.getBoundingClientRect(),u=y.width>0&&c.offsetWidth>0?y.width/c.offsetWidth:1,{clientX:g,clientY:p}=k,h=c.offsetWidth||(o.theme.widgetWidth??460),C=c.offsetHeight||(o.theme.widgetHeight??540),l=h,w=C;try{_.setPointerCapture(k.pointerId)}catch{}let P=(A)=>{let E=(A.clientX-g)/u,D=(A.clientY-p)/u;l=Math.max(240,Math.min(1200,Math.round(h+E))),w=Math.max(180,Math.min(900,Math.round(C+D))),t.onResizeWidgetLive?.(l,w,!1)},R=(A)=>{_.removeEventListener("pointermove",P),_.removeEventListener("pointerup",R),_.removeEventListener("pointercancel",R);try{_.releasePointerCapture(A.pointerId)}catch{}t.onResizeWidgetLive?.(l,w,!0)};_.addEventListener("pointermove",P),_.addEventListener("pointerup",R),_.addEventListener("pointercancel",R)}),c.append(_),c}var Hn="characters",an="",sn="";function Ya(t){let n=(t.scene.timeLabel||ct(t.elapsedMinutes)||"").trim(),a=n.toLowerCase();if(/\b(?:dawn|sunrise|morning|breakfast)\b/.test(a))return"morning";if(/\b(?:noon|midday|afternoon|daytime|lunch)\b/.test(a))return"day";if(/\b(?:dusk|sunset|evening|twilight|dinner)\b/.test(a))return"evening";if(/\b(?:night|midnight|late\s*night|moon)\b/.test(a))return"night";let s=n.match(/(\d{1,2})\s*:\s*(\d{2})\s*(am|pm)?/i);if(s){let d=Number(s[1]),o=s[3]?.toLowerCase();if(o==="pm"&&d<12)d+=12;if(o==="am"&&d===12)d=0;if(d>=5&&d<11)return"morning";if(d>=11&&d<17)return"day";if(d>=17&&d<20)return"evening";return"night"}let i=(Math.max(0,Math.round(t.elapsedMinutes))+480)%1440,r=Math.floor(i/60);if(r>=5&&r<11)return"morning";if(r>=11&&r<17)return"day";if(r>=17&&r<20)return"evening";return"night"}function Qa(t,n){if(!t)return{url:"",matchedLabel:"No Location"};let a=t.backdropVariants??[],s=a.find((c)=>c.pinned&&c.url);if(s)return{url:s.url,matchedLabel:`\uD83D\uDCCC ${s.customTag||s.timeSlot}`};let i=[n.scene.weather,n.scene.timeLabel,n.scene.dateLabel,t.atmosphere].filter(Boolean).join(" ").toLowerCase();for(let c of a)if(c.timeSlot==="custom"&&c.customTag&&c.url){let f=c.customTag.toLowerCase().split(/[,/|\s]+/).filter((b)=>b.length>=2);if(f.length>0&&f.every((b)=>i.includes(b)))return{url:c.url,matchedLabel:`\uD83C\uDFF7️ ${c.customTag}`}}let r=Ya(n),d=a.find((c)=>c.timeSlot===r&&c.url);if(d)return{url:d.url,matchedLabel:`\uD83D\uDD70️ ${r}`};let o=a.find((c)=>c.timeSlot==="default"&&c.url);if(o)return{url:o.url,matchedLabel:"Default"};return{url:t.backdropUrl||"",matchedLabel:t.backdropUrl?"Default":"Atmospheric Stage"}}function Wn(t,n){let a=t.trim().toLowerCase(),s=n.trim().toLowerCase();if(!a||!s)return 0;if(s.includes(a))return 2;let i=a.split(/[^a-z0-9]+/).filter((d)=>d.length>=3);if(!i.length)return 0;let r=i.filter((d)=>s.includes(d)).length;return r>0?r/i.length:0}function Ja(t,n=""){let a=t.spriteVariants??[],s=a.find((m)=>m.pinned&&m.url);if(s)return{url:s.url,matchedLabel:`\uD83D\uDCCC ${s.label}`};let i=he(t,"demeanor"),r=he(t,"attire_layers")||t.attire||"",d=String(t.meters.acted?.value??""),c=[he(t,"immediate_goal"),d,n].filter(Boolean).join(" "),f,b=0;for(let m of a){if(!m.url)continue;let S=0,L=0;if(m.clothesTag.trim()){L++;let T=Wn(m.clothesTag,`${r} ${n}`);if(T>0)S+=3.5*T;else S-=1}if(m.emotionTag.trim()){L++;let T=Wn(m.emotionTag,`${i} ${n}`);if(T>0)S+=2.5*T}if(m.poseTag.trim()){L++;let T=Wn(m.poseTag,c);if(T>0)S+=2*T}if(L===0)S=0.1;if(S>b)b=S,f=m}if(f)return{url:f.url,matchedLabel:f.label};let M=(i||"neutral").toLowerCase();if(t.expressionAssets[M]?.url)return{url:t.expressionAssets[M].url,matchedLabel:M};return{url:t.portraitUrl||"",matchedLabel:t.portraitUrl?"Base Sprite":""}}function es(t,n){let{state:a}=t.snapshot,s=e("div","ls-stack"),i=n??(()=>t.emitChange()),r=e("div","ls-subnav-pills"),d=Object.values(a.characters),o=Object.values(a.places);for(let[k,y]of[["characters",`\uD83C\uDFAD Character Sprites: Emotion, Clothes & Poses (${d.length})`],["locations",`\uD83C\uDFDE️ Discovered Locations: Time-of-Day & Weather Backdrops (${o.length})`]]){let u=B(y,()=>{Hn=k,i()},"ls-btn-sm");if(Hn===k)u.setAttribute("aria-current","page");r.append(u)}if(s.append(r),Hn==="characters"){let k=(an?a.characters[an]:void 0)??d[0],y=e("div","ls-row-between"),u=e("div","ls-row");for(let j of d){let K=(j.spriteVariants?.length??0)+(j.portraitUrl?1:0),Y=B(`${j.present?"\uD83D\uDFE2":"⚪"} ${j.name} (${K})`,()=>{an=j.id,i()},"ls-btn-sm");if(j.id===k?.id)Y.setAttribute("aria-current","page");u.append(Y)}if(y.append(u,B("+ Add Character",()=>{t.modals.open({title:"➕ Add Character",width:420},(j,K)=>{let Y=e("label","ls-label","Character Name"),G=e("input","ls-input");Y.append(G);let ee=B("➕ Create Character",()=>{let te=G.value.trim();if(!te)return;let X=ie(te,"npc");an=X,t.request("state:mutate",{patch:{characters:[{id:X,name:te,present:!0}]},reason:`Added character "${te}"`}),K()},"ls-btn-primary");j.append(Y,ee)})},"ls-btn-sm ls-btn-primary")),s.append(y),!k){let j=e("div","ls-card");return j.append(e("strong","","No characters in Cast yet"),e("p","ls-muted",'Click "+ Add Character" above or sync a chat turn to start uploading character sprites.')),s.append(j),s}let g=e("section","ls-card"),p=he(k,"demeanor"),h=he(k,"attire_layers")||k.attire;g.append(e("span","ls-kicker",`Upload New Sprite Rule for ${k.name}`),e("h3","",`\uD83D\uDDBC️ Add Sprite by Emotion, Clothes & Pose — ${k.name}`),e("p","ls-muted",'Fill in any combination of Emotion, Clothes/Outfit, and Pose/Action below (leave any box blank if it applies to all), then click "\uD83D\uDDBC️ Upload & Save Sprite". The VN Stage automatically switches to the matching sprite as the story changes!'));let C=e("div","ls-grid"),l=e("label","ls-label","\uD83C\uDFAD Emotion / Mood Tag (Text Box)"),w=e("input","ls-input");w.placeholder="e.g. neutral, happy, flustered, angry, brusque, shy…",w.value=p||"",l.append(w);let P=e("div","ls-row");for(let j of["neutral","happy","flustered","angry","sad","surprised","shy"])P.append(B(j,()=>{w.value=j},"ls-btn-sm ls-quick-pill"));l.append(P);let R=e("label","ls-label","\uD83D\uDC57 Clothes / Outfit Tag (Text Box)"),A=e("input","ls-input");if(A.placeholder="e.g. saree, bath towel, office wear, nightgown, casual…",A.value="",R.append(A),h)R.append(B(`✨ Use Current Outfit ("${h.slice(0,28)}")`,()=>{A.value=h},"ls-btn-sm ls-quick-pill"));let E=e("label","ls-label","\uD83E\uDDCD Pose / Action Tag (Text Box)"),D=e("input","ls-input");D.placeholder="e.g. standing, mopping, crossed arms, holding phone, leaning…",D.value="",E.append(D);let F=e("div","ls-row");for(let j of["standing","crossed arms","leaning in","looking away","sitting"])F.append(B(j,()=>{D.value=j},"ls-btn-sm ls-quick-pill"));E.append(F),C.append(l,R,E),g.append(C);let W=e("div","ls-row-between");W.append(e("small","ls-muted",`Current Live State — Demeanor: "${p||"neutral"}" · Outfit: "${h||"default"}"`),e("div","ls-row")),W.lastElementChild.append(B("\uD83D\uDDBC️ Upload Default / Base Sprite",()=>{t.pickAndUploadImage(k.id,"portrait")},"ls-btn-sm"),B("\uD83D\uDDBC️ Upload & Save Sprite Variant",()=>{t.uploadStageVariantAsset({targetId:k.id,kind:"sprite_variant",emotionTag:w.value.trim(),clothesTag:A.value.trim(),poseTag:D.value.trim()})},"ls-btn-primary")),g.append(W),s.append(g);let V=e("section","ls-card"),O=k.spriteVariants??[],H=Ja(k),U=e("div","ls-row-between");U.append(e("h3","",`\uD83D\uDDC2️ Saved Sprites for ${k.name} (${O.length+(k.portraitUrl?1:0)})`),H.url?e("span","ls-chip ls-chip-accent",`✓ Active on Stage: ${H.matchedLabel}`):e("span","ls-chip","No sprite uploaded yet")),V.append(U);let z=e("div","ls-asset-gallery");if(k.portraitUrl){let j=e("div","ls-asset-card"),K=e("div","ls-asset-thumb"),Y=e("img");Y.src=k.portraitUrl,Y.alt=`${k.name} Base Sprite`,K.append(Y);let G=e("div","ls-stack");G.style.gap="6px",G.append(e("strong","","⭐ Base / Fallback Sprite"),e("small","ls-muted","Used whenever no specific Emotion / Clothes / Pose variant matches."),B("\uD83D\uDD04 Replace Base Sprite",()=>t.pickAndUploadImage(k.id,"portrait"),"ls-btn-sm")),j.append(K,G),z.append(j)}if(O.forEach((j,K)=>{let Y=e("div","ls-asset-card");if(j.pinned)Y.style.borderColor="var(--ls-primary)";let G=e("div","ls-asset-thumb"),ee=e("img");ee.src=j.url,ee.alt=j.label,G.append(ee);let te=e("div","ls-stack");te.style.gap="5px";let X=e("input","ls-input");X.style.minHeight="28px",X.placeholder="Emotion tag (e.g. flustered)…",X.value=j.emotionTag;let ae=e("input","ls-input");ae.style.minHeight="28px",ae.placeholder="Clothes tag (e.g. saree, towel)…",ae.value=j.clothesTag;let ne=e("input","ls-input");ne.style.minHeight="28px",ne.placeholder="Pose tag (e.g. mopping)…",ne.value=j.poseTag;let ge=e("div","ls-row");ge.append(B("\uD83D\uDCBE Save Tags",()=>{let Se=structuredClone(a.characters),le=Se[k.id]?.spriteVariants;if(le&&le[K])le[K].emotionTag=X.value.trim(),le[K].clothesTag=ae.value.trim(),le[K].poseTag=ne.value.trim(),le[K].label=[le[K].emotionTag,le[K].clothesTag,le[K].poseTag].filter(Boolean).join(" · ")||"Default",t.request("state:mutate",{stateOverride:{characters:Se},reason:`Updated sprite tags for ${k.name}`}),t.notify(`Saved tags for ${k.name}'s sprite.`)},"ls-btn-sm ls-btn-primary"),B(j.pinned?"\uD83D\uDCCC Pinned":"\uD83D\uDCCD Pin",()=>{let Se=structuredClone(a.characters),le=Se[k.id]?.spriteVariants??[],xt=!j.pinned;le.forEach((et,ln)=>{et.pinned=ln===K?xt:!1}),t.request("state:mutate",{stateOverride:{characters:Se},reason:`${xt?"Pinned":"Unpinned"} sprite for ${k.name}`})},`ls-btn-sm ${j.pinned?"ls-btn-primary":""}`),B("\uD83D\uDDD1️",()=>{let Se=structuredClone(a.characters);if(Se[k.id]?.spriteVariants)Se[k.id].spriteVariants=Se[k.id].spriteVariants.filter((le)=>le.id!==j.id),t.request("state:mutate",{stateOverride:{characters:Se},reason:`Removed sprite variant from ${k.name}`})},"ls-btn-sm ls-btn-icon ls-btn-danger","Delete sprite variant")),te.append(e("strong","",j.label||"Sprite Variant"),X,ae,ne,ge),Y.append(G,te),z.append(Y)}),z.childElementCount===0)V.append(e("p","ls-muted",`No sprites uploaded for ${k.name} yet. Use the form above to upload sprites for different emotions, outfits, and poses.`));else V.append(z);return s.append(V),s}let c=(sn?a.places[sn]:void 0)??(a.currentPlaceId?a.places[a.currentPlaceId]:void 0)??o[0],f=e("div","ls-row-between"),b=e("div","ls-row");for(let k of o){let y=(k.backdropVariants?.length??0)||(k.backdropUrl?1:0),u=B(`${k.icon||"\uD83D\uDCCD"} ${k.name}${k.id===a.currentPlaceId?" (Here)":""} (${y})`,()=>{sn=k.id,i()},"ls-btn-sm");if(k.id===c?.id)u.setAttribute("aria-current","page");b.append(u)}if(f.append(b,B("+ Add Location",()=>{t.modals.open({title:"➕ Add Location to Atlas",width:440},(k,y)=>{let u=e("label","ls-label","Location Name"),g=e("input","ls-input");u.append(g);let p=e("label","ls-label","Description"),h=e("input","ls-input");p.append(h);let C=B("➕ Create Location",()=>{let l=g.value.trim();if(!l)return;let w=ie(l,"place");sn=w,t.request("state:mutate",{patch:{places:[{id:w,name:l,icon:"\uD83C\uDFDB️",description:h.value.trim()||"Location"}]},reason:`Added location "${l}"`}),y()},"ls-btn-primary");k.append(u,p,C)})},"ls-btn-sm ls-btn-primary")),s.append(f),!c){let k=e("div","ls-card");return k.append(e("strong","","No locations discovered yet"),e("p","ls-muted",'Click "+ Add Location" above or sync a chat turn to start uploading backdrops.')),s.append(k),s}let M=Ya(a),m=Qa(c,a),S=e("section","ls-card"),L=e("div","ls-row-between");L.append(e("h3","",`${c.icon||"\uD83D\uDCCD"} ${c.name} — Time-of-Day & Weather Backdrops`),e("span","ls-chip ls-chip-accent",`\uD83D\uDD70️ Current Story Time: ${a.scene.timeLabel||ct(a.elapsedMinutes)} (${M.toUpperCase()})`)),S.append(L,e("p","ls-muted",'Upload backdrops for Morning, Day, Evening, Night, or a custom weather/scene state (e.g. "rainy", "steamy", "lights off"). The VN Stage automatically transitions to the matching backdrop as time passes!'));let T=e("div","ls-grid"),N=[{slot:"default",icon:"\uD83C\uDFDE️",label:"Default (Any Time)",sub:"Fallback when no specific time slot is set"},{slot:"morning",icon:"\uD83C\uDF05",label:"Morning / Dawn",sub:"05:00 AM – 10:59 AM"},{slot:"day",icon:"☀️",label:"Day / Afternoon",sub:"11:00 AM – 04:59 PM"},{slot:"evening",icon:"\uD83C\uDF07",label:"Evening / Sunset",sub:"05:00 PM – 07:59 PM"},{slot:"night",icon:"\uD83C\uDF19",label:"Night / Late Night",sub:"08:00 PM – 04:59 AM"}];for(let k of N){let y=(c.backdropVariants??[]).find((l)=>l.timeSlot===k.slot),u=k.slot==="default"?c.backdropUrl:void 0,g=y?.url||u||"",p=e("div","ls-asset-card");if(M===k.slot||y?.pinned)p.style.borderColor="var(--ls-primary)";if(g){let l=e("div","ls-asset-thumb"),w=e("img");w.src=g,w.alt=`${c.name} ${k.label}`,l.append(w),p.append(l)}let h=e("div","ls-stack");h.style.gap="4px",h.append(e("strong","",`${k.icon} ${k.label}`),e("small","ls-muted",k.sub));let C=e("div","ls-row");if(C.append(B(g?"\uD83D\uDD04 Replace Image":"\uD83D\uDDBC️ Upload Image",()=>{t.uploadStageVariantAsset({targetId:c.id,kind:"backdrop_variant",timeSlot:k.slot})},`ls-btn-sm ${g?"":"ls-btn-primary"}`)),y)C.append(B(y.pinned?"\uD83D\uDCCC Pinned":"\uD83D\uDCCD Pin",()=>{let l=structuredClone(a.places),w=l[c.id]?.backdropVariants??[],P=!y.pinned;w.forEach((R)=>{R.pinned=R.id===y.id?P:!1}),t.request("state:mutate",{stateOverride:{places:l},reason:`${P?"Pinned":"Unpinned"} ${k.label} backdrop for ${c.name}`})},`ls-btn-sm ${y.pinned?"ls-btn-primary":""}`),B("\uD83D\uDDD1️",()=>{let l=structuredClone(a.places),w=l[c.id];if(w?.backdropVariants){if(w.backdropVariants=w.backdropVariants.filter((P)=>P.id!==y.id),k.slot==="default")w.backdropUrl=void 0;t.request("state:mutate",{stateOverride:{places:l},reason:`Removed ${k.label} backdrop from ${c.name}`})}},"ls-btn-sm ls-btn-icon ls-btn-danger"));h.append(C),p.append(h),T.append(p)}S.append(T);let I=e("div","ls-stat-cell");I.append(e("strong","","\uD83C\uDFF7️ Add Custom Time / Weather / State Backdrop Variant"));let v=e("div","ls-row"),x=e("input","ls-input");x.style.flex="1",x.placeholder="Enter custom condition tag (e.g. rainy, steamy, lights off, crowded)…",v.append(x,B("\uD83D\uDDBC️ Upload & Save Custom Variant",()=>{let k=x.value.trim();if(!k){t.notify('Enter a custom tag (e.g. "rainy" or "steamy") before uploading.',!0);return}t.uploadStageVariantAsset({targetId:c.id,kind:"backdrop_variant",timeSlot:"custom",customTag:k})},"ls-btn-primary")),I.append(v);let _=(c.backdropVariants??[]).filter((k)=>k.timeSlot==="custom");if(_.length>0){let k=e("div","ls-asset-gallery");k.style.marginTop="8px";for(let y of _){let u=e("div","ls-asset-card"),g=e("div","ls-asset-thumb"),p=e("img");p.src=y.url,p.alt=y.customTag,g.append(p);let h=e("div","ls-row-between");h.append(e("strong","",`\uD83C\uDFF7️ ${y.customTag}`),e("div","ls-row")),h.lastElementChild.append(B(y.pinned?"\uD83D\uDCCC Pinned":"\uD83D\uDCCD Pin",()=>{let C=structuredClone(a.places),l=C[c.id]?.backdropVariants??[],w=!y.pinned;l.forEach((P)=>{P.pinned=P.id===y.id?w:!1}),t.request("state:mutate",{stateOverride:{places:C},reason:`Pinned "${y.customTag}" backdrop for ${c.name}`})},`ls-btn-sm ${y.pinned?"ls-btn-primary":""}`),B("\uD83D\uDDD1️",()=>{let C=structuredClone(a.places),l=C[c.id];if(l?.backdropVariants)l.backdropVariants=l.backdropVariants.filter((w)=>w.id!==y.id),t.request("state:mutate",{stateOverride:{places:C},reason:`Removed "${y.customTag}" backdrop`})},"ls-btn-sm ls-btn-icon ls-btn-danger")),u.append(g,h),k.append(u)}I.append(k)}if(S.append(I),m.url)S.append(e("small","ls-muted",`✓ Currently active backdrop for ${c.name}: ${m.matchedLabel}`));return s.append(S),s}function Qe(t,n){let s=[...structuredClone(t.snapshot.template).surfaces.dossierTabs].sort((i,r)=>i.order-r.order);t.modals.open({title:n?`✏️ Edit Character Dossier Field: ${n.label}`:"➕ Create Character Dossier Field",width:580},(i,r,d,o)=>{let c=e("div","ls-grid"),f=e("label","ls-label","Field Icon"),b=e("input","ls-input");b.value=n?.icon??"✨",f.append(b);let M=e("label","ls-label","Field Label"),m=e("input","ls-input");m.placeholder="e.g. Immediate Goal, Inner Monologue, Secret Agenda…",m.value=n?.label??"",M.append(m),c.append(f,M),i.append(c);let S=n?.tabId??(s[0]?.id||"overview"),L=n?.displayStyle??"card",T=e("div","ls-grid"),N=e("div","ls-label","\uD83E\uDEAA Target Dossier Tab"),I=e("div");N.append(I);let v=e("div","ls-label","\uD83C\uDFA8 Visual Display Style"),x=e("div");v.append(x),T.append(N,v),i.append(T),J(t,o,I,{value:S,ariaLabel:"Target Dossier Tab",options:s.map((O)=>({value:O.id,label:`${O.icon} ${O.label}`})),onChange:(O)=>{S=O}}),J(t,o,x,{value:L,ariaLabel:"Visual Display Style",options:[{value:"card",label:'\uD83D\uDDC2️ Info Card (supports structured "->" chains)'},{value:"quote",label:"\uD83D\uDCAD Quote / Inner Monologue Box"},{value:"pills",label:"\uD83C\uDFF7️ Tag / Item Pills (comma-separated)"},{value:"badge",label:"\uD83E\uDEAA Portrait Header Badge"}],onChange:(O)=>{L=O}});let _=n?.layoutSpan??"auto",k=n?.color||"var(--lumiverse-primary)",y=n?.enabled??!0,u=n?.showInHudCast??!1,g=n?.showInInlineCast??!1,p=n?.locked??!1,h=e("div","ls-label","Card Grid Width"),C=e("div");h.append(C),i.append(h),J(t,o,C,{value:_,ariaLabel:"Card Grid Width",options:[{value:"auto",label:"\uD83D\uDCD0 Auto"},{value:"full",label:"↔️ Full Width"},{value:"half",label:"▫ Compact Column"}],onChange:(O)=>{_=O}});let l=e("div","ls-label","Accent Color"),w=e("div","ls-row"),P=()=>{for(let O of[...w.querySelectorAll(".ls-color-swatch")])O.setAttribute("aria-pressed",String(O.dataset.colorVal===k))};for(let[O,H,U]of[["var(--lumiverse-primary)","Theme Primary","var(--lumiverse-primary, #38bdf8)"],["#38bdf8","Sky","#38bdf8"],["#f472b6","Rose","#f472b6"],["#f59e0b","Amber","#f59e0b"],["#10b981","Emerald","#10b981"],["#a78bfa","Violet","#a78bfa"]]){let z=B("",()=>{k=O,P()},"ls-color-swatch",H);z.dataset.colorVal=O,z.style.background=U,w.append(z)}P(),l.append(w),i.append(l);let R=e("div","ls-label"),A=e("div","ls-row-between"),E=e("textarea","ls-input");E.rows=3,E.placeholder="Tell the AI when and how to update this field for each character…",E.value=n?.instruction??"",A.append(e("span","","AI Extraction Prompt Instruction"),B("⛶ Full-Screen Editor",()=>{t.request("textEditor:open",{title:`Character Field Prompt: ${m.value||"Field"}`,value:E.value,placeholder:"Describe how the AI should update this character field…"}).then((O)=>{if(!O.cancelled&&typeof O.text==="string")E.value=O.text})},"ls-btn-sm")),R.append(A,E),i.append(R);let D=e("div","ls-grid");for(let[O,H,U]of[["Enabled",y,(z)=>{y=z}],["Show on HUD Cast Card",u,(z)=>{u=z}],["Show on Inline Cast Card",g,(z)=>{g=z}],["Lock Value",p,(z)=>{p=z}]]){let z=e("div");xe(t,o,z,{checked:H,label:O,onChange:U}),D.append(z)}i.append(D);let F=e("div","ls-row-between");F.style.marginTop="12px";let W=e("div","ls-row");if(n)W.append(B("Delete Field",()=>{let O=structuredClone(t.snapshot.template.dossierFields);t.request("state:mutate",{templatePatch:{dossierFields:O.filter((H)=>H.id!==n.id)},reason:`Deleted dossier field "${n.label}"`}),r()},"ls-btn-sm ls-btn-danger"));let V=B(n?"Save Field":"Add Field",()=>{let O=m.value.trim();if(!O)return;let H=structuredClone(t.snapshot.template.dossierFields),U={id:n?.id??ie(O,"field"),label:O,icon:b.value.trim()||"✨",placeholder:n?.placeholder||O,instruction:E.value.trim()||`Update ${O} when established in the scene.`,tabId:S,displayStyle:L,showInHudCast:u,showInInlineCast:g,color:k,layoutSpan:_,enabled:y,locked:p},z=H.findIndex((j)=>j.id===U.id);if(z>=0)H[z]=U;else H.push(U);t.request("state:mutate",{templatePatch:{dossierFields:H},reason:`Saved dossier field "${U.label}"`}),r()},"ls-btn-primary");F.append(W,V),i.append(F)})}function ts(t,n){let{state:a}=t.snapshot,s=[...a.auditLog].filter((i)=>!n||i.actorId===n).reverse();t.modals.open({title:`\uD83D\uDCC8 Stat Calibration & Shift Audit Log (${s.length})`,width:640,maxHeight:740},(i,r)=>{if(!s.length){i.append(e("p","ls-muted","No stat calibrations or shifts recorded yet."));return}let d=e("div","ls-stack");for(let o of s){let c=e("div","ls-stat-cell"),f=e("div","ls-row-between"),b=e("div","ls-row"),M=o.actorId?a.characters[o.actorId]?.name:void 0;b.append(e("strong","",`${M?`${M} · `:""}${o.statLabel}`),e("span","ls-chip",o.op==="set"?"\uD83C\uDFAF Calibrated / Set":"Δ Shift"),e("span","ls-chip ls-chip-accent",`${String(o.before??"uncalibrated")} → ${String(o.after)}`));let m=e("div","ls-row");if(m.append(e("small","ls-muted",`Turn ${o.turn} · ${Ha(o.minute)}`)),o.before!==null)m.append(B(`↺ Revert to ${String(o.before)}`,()=>{if(o.actorId){let S=a.characters[o.actorId];if(S)t.request("state:mutate",{patch:{characters:[{id:S.id,name:S.name,meters:{[o.statId]:{op:"set",value:o.before,reason:"Reverted from audit log"}}}]},reason:`Reverted ${S.name} ${o.statLabel} to ${String(o.before)}`})}else t.request("state:mutate",{patch:{stats:{[o.statId]:{op:"set",value:o.before,reason:"Reverted from audit log"}}},reason:`Reverted ${o.statLabel} to ${String(o.before)}`});r()},"ls-btn-sm"));if(f.append(b,m),c.append(f),o.reason)c.append(e("small","ls-muted",`Evidence: ${o.reason}`));d.append(c)}i.append(d)})}function Ye(t,n){t.selectedActorId=n,t.modals.open({title:"\uD83E\uDEAA Character Dossier",width:880,maxHeight:820},(a,s,i,r)=>{let d=()=>{r.clear();let c=t.snapshot.state.characters[t.selectedActorId]??Object.values(t.snapshot.state.characters)[0];if(c)i.setTitle(`\uD83E\uDEAA ${c.name} — Character Dossier`);a.replaceChildren(Vn(t,r))};d();let o=t.subscribe(d);i.onDismiss(o)})}function Vn(t,n){let{state:a,template:s,deltas:i}=t.snapshot,r=e("div","ls-stack"),d=Object.values(a.characters).sort((u,g)=>Number(g.present)-Number(u.present)),o=(t.selectedActorId?a.characters[t.selectedActorId]:void 0)??d[0],c=e("div","ls-row-between"),f=e("div","ls-row");for(let u of d){let g=B(`${u.present?"\uD83D\uDFE2":"⚪"} ${u.name}`,()=>{t.selectedActorId=u.id,t.emitChange()},"ls-btn-sm");if(u.id===o?.id)g.setAttribute("aria-current","page");f.append(g)}let b=e("div","ls-row");if(o)b.append(B(t.dossierEditMode?"✓ Done Editing":"✏️ Edit Values",()=>{t.dossierEditMode=!t.dossierEditMode,t.emitChange()},`ls-btn-sm ${t.dossierEditMode?"ls-btn-primary":""}`),B(o.ttsVoice?.voiceId?`\uD83D\uDD0A Voice (${o.ttsVoice.voiceId})`:"\uD83D\uDD0A Voice",()=>Yt(t,o.id),"ls-btn-sm",`Assign TTS Voice for ${o.name}`),B("+ Stat",()=>Ce(t,"character"),"ls-btn-sm","Add a character stat or meter"),B("+ Field",()=>Qe(t),"ls-btn-sm","Add a custom field to character dossiers"),B("\uD83D\uDCC8 Audit Log",()=>ts(t,o.id),"ls-btn-sm"));if(b.append(B("+ Add Character",()=>{t.modals.open({title:"➕ Add Character to Cast",width:460},(u,g)=>{let p=e("label","ls-label","Character Name"),h=e("input","ls-input");p.append(h);let C=e("label","ls-label","Role & Relationship to Player"),l=e("input","ls-input");l.placeholder="e.g. Loyal personal maid, Childhood rival…",C.append(l);let w=e("label","ls-label","Starting Attire"),P=e("input","ls-input");w.append(P);let R=B("➕ Create Character",()=>{let A=h.value.trim();if(!A)return;let E=ie(A,"npc");t.selectedActorId=E,t.request("state:mutate",{patch:{characters:[{id:E,name:A,present:!0,roleSummary:l.value.trim()||"Character",attire:P.value.trim()}]},reason:`Added character "${A}"`}),g()},"ls-btn-primary");u.append(p,C,w,R)})},"ls-btn-sm ls-btn-primary")),c.append(f,b),r.append(c),!o){let u=e("div","ls-card");return u.append(e("strong","","No characters in cast yet"),e("p","ls-muted",'Characters are calibrated automatically on Turn 1, or click "+ Add Character" above.')),r.append(u),r}if(s.surfaces.customDossierHtml){let u=e("div","ls-card");r.append(u),Be(u,De(s.surfaces.customDossierHtml,a),t.ctx)}let M=he(o,"demeanor"),m=he(o,"role_summary"),S=(M||"neutral").toLowerCase(),L=o.expressionAssets[S]?.url??o.portraitUrl,T=Boolean(L||t.dossierEditMode),N=e("article","ls-dossier-shell");if(!T)N.dataset.noPortrait="true";let I=e("div","ls-row");I.append(B(o.present?"\uD83D\uDFE2 In Scene":"⚪ Away",()=>{t.request("state:mutate",{patch:{characters:[{id:o.id,name:o.name,present:!o.present,...!o.present&&a.scene.location?{location:a.scene.location}:{}}]},reason:`Marked ${o.name} as ${!o.present?"In Scene":"Away"}`})},`ls-btn-sm ls-presence-pill ${o.present?"ls-chip-accent":""}`,"Click to toggle In Scene / Away"));for(let u of s.dossierFields.filter((g)=>g.enabled&&g.displayStyle==="badge"&&g.id!=="role_summary")){let g=he(o,u.id);if(g)I.append(e("span","ls-chip",`${u.icon} ${g}`))}if(T){let u=e("aside","ls-dossier-rail"),g=e("div","ls-dossier-portrait");if(L){let h=e("img");h.src=L,h.alt=o.name,g.append(h)}else g.append(e("span","ls-dossier-initial",o.name[0]?.toUpperCase()??"?"));u.append(g);let p=e("div","ls-dossier-overlay");if(p.append(I,e("h2","",o.name)),$t(s,"role_summary")&&m)p.append(e("div","ls-muted",m));if(t.dossierEditMode){let h=e("div","ls-row");h.append(B("\uD83D\uDDBC️ Portrait",()=>t.pickAndUploadImage(o.id,"portrait"),"ls-btn-sm ls-btn-primary"),B(`\uD83C\uDFAD Expression (${S})`,()=>t.pickAndUploadImage(o.id,"expression",S),"ls-btn-sm",`Upload expression sprite for "${S}" demeanor`),B(o.present?"Mark Off-Screen":"Mark Present",()=>{t.request("state:mutate",{patch:{characters:[{id:o.id,name:o.name,present:!o.present}]},reason:`Toggled presence for ${o.name}`})},"ls-btn-sm")),p.append(h)}u.append(p),N.append(u)}let v=e("div","ls-dossier-main");if(!T){let u=e("header","ls-dossier-compact-hero"),g=e("div","ls-row"),p=e("div","ls-dossier-monogram",o.name.slice(0,2).toUpperCase()),h=e("div");if(h.append(e("h2","",o.name)),$t(s,"role_summary")&&m)h.append(e("div","ls-muted",m));g.append(p,h);let C=e("div","ls-row");C.append(I,B("\uD83D\uDDBC️ + Portrait",()=>t.pickAndUploadImage(o.id,"portrait"),"ls-btn-sm",`Upload portrait for ${o.name}`)),u.append(g,C),v.append(u)}let x=[...s.surfaces.dossierTabs].filter((u)=>u.enabled).sort((u,g)=>u.order-g.order),_=x.find((u)=>u.id===t.activeDossierTab)??x[0]??{id:"overview",label:"Overview",icon:"✨",kind:"overview",enabled:!0,order:0,showMeters:!0,showFields:!0,showSecrets:!1,showAudit:!1};if(x.length>1){let u=e("div","ls-subnav-pills");for(let g of x){let p=B(`${g.icon} ${g.label}`,()=>{t.activeDossierTab=g.id,t.emitChange()},"ls-btn-sm");if(g.id===_.id)p.setAttribute("aria-current","page");u.append(p)}v.append(u)}if(_.customHtml){let u=e("div","ls-card");v.append(u),Be(u,De(_.customHtml,a),t.ctx)}let k=new Set(x.map((u)=>u.id)),y=x[0]?.id??"overview";if(_.showFields){let u=s.dossierFields.filter((g)=>{if(!g.enabled||g.id==="role_summary"||g.displayStyle==="badge")return!1;return(g.tabId&&k.has(g.tabId)?g.tabId:y)===_.id});if(!t.dossierEditMode){for(let h of u.filter((C)=>C.displayStyle==="quote")){let C=he(o,h.id);if(!C)continue;let l=e("div","ls-thought-box ls-row-between");l.append(e("span","",`${h.icon} “${C}”`),B("✏️",()=>Qe(t,h),"ls-btn-sm ls-btn-icon",`Customize "${h.label}" field`)),v.append(l)}if(_.kind==="overview"&&s.coreTrackers?.trackNpcConditions!==!1&&o.conditions.length>0){let h=e("div","ls-row");for(let C of o.conditions){let l=e("span","ls-rpg-fx-pill",`⚡ ${C}`);l.dataset.fxKind="neutral",h.append(l)}v.append(h)}let g=u.filter((h)=>h.displayStyle!=="quote"),p=e("div","ls-grid");for(let h of g){let C=he(o,h.id);if(!C)continue;let l=e("div","ls-stat-cell");if(h.color)l.style.setProperty("--ls-bar-color",h.color);if(h.layoutSpan&&h.layoutSpan!=="auto")l.dataset.span=h.layoutSpan;let w=e("div","ls-row-between");w.append(e("span","ls-kicker",`${h.icon} ${h.label}`),B("✏️",()=>Qe(t,h),"ls-btn-sm ls-btn-icon",`Customize "${h.label}" field`)),l.append(w,Xe(C,h.displayStyle==="pills"?"pill_list":"auto")),p.append(l)}if(p.childElementCount>0)v.append(p)}else{let g=e("div","ls-card"),p=e("div","ls-row-between");p.append(e("h3","",`✏️ Edit ${o.name}'s Dossier Fields`),B("↺ Restore Default Fields",()=>{t.request("state:mutate",{templatePatch:{dossierFields:ot()},reason:"Restored default dossier fields"})},"ls-btn-sm")),g.append(p);let h=e("div","ls-grid"),C=new Map;for(let A of s.dossierFields.filter((E)=>E.enabled)){let E=e("div","ls-label"),D=e("div","ls-row-between");D.append(e("span","",`${A.icon} ${A.label}`),B("⚙️ Schema",()=>Qe(t,A),"ls-btn-sm",`Edit "${A.label}" schema or delete`));let F=A.displayStyle==="quote"?e("textarea","ls-input"):e("input","ls-input");if(F instanceof HTMLTextAreaElement)F.rows=2;F.value=he(o,A.id),F.placeholder=A.placeholder||A.label,E.append(D,F),h.append(E),C.set(A.id,F)}let l=e("label","ls-label","⚡ Active Conditions (comma-separated)"),w=e("input","ls-input");w.value=o.conditions.join(", "),w.placeholder="e.g. Flustered, Holding Tray, Guarded…",l.append(w);let P=e("label","ls-label","\uD83D\uDCDD Personal Character Notes"),R=e("textarea","ls-input");R.rows=2,R.value=o.notes||"",R.placeholder="Optional notes about this character…",P.append(R),g.append(h,l,P),g.append(B("\uD83D\uDCBE Save Character Details",()=>{let A={...o.fields};for(let[D,F]of C.entries())A[D]=F.value.trim();let E=w.value.split(",").map((D)=>D.trim()).filter(Boolean);t.request("state:mutate",{patch:{characters:[{id:o.id,name:o.name,roleSummary:A.role_summary??o.roleSummary,demeanor:A.demeanor??o.demeanor,attire:A.attire_layers??o.attire,immediateGoal:A.immediate_goal??o.immediateGoal,innerThought:A.inner_thought??o.innerThought,conditions:E,notes:R.value.trim(),fields:A}]},reason:`Updated dossier details for ${o.name}`})},"ls-btn-primary")),v.append(g)}}if(_.showMeters){let u=s.stats.filter((p)=>{if(!p.enabled||p.scope!=="character"||p.showIn?.dossier===!1)return!1;let h=p.dossierTabId||"bonds";return(k.has(h)?h:y)===_.id});if(u.length>0){let p=e("div","ls-stat-grid"),h=i.characterDeltas[o.id]??{},C=(l,w,P)=>{t.request("state:mutate",{patch:{characters:[{id:o.id,name:o.name,meters:{[l]:{op:"set",value:P,reason:"Manual Dossier adjustment"}}}]},reason:`Set ${o.name} ${w} to ${String(P)}`})};for(let l of u){let w=o.meters[l.id],P=Boolean(w?.calibrated),R=P&&w?w.value:l.defaultValue,A=Boolean(l.locked||w?.locked),E=h[l.id]??0,D=String(R??""),F=P&&typeof R==="string"&&(l.displayStyle==="feed_cards"||l.displayStyle==="step_chain"||l.displayStyle==="pill_list"||l.displayStyle==="quote_callout"||D.length>36||/->|→|\n|;/.test(D)),W=e("div","ls-stat-cell");if(W.style.setProperty("--ls-bar-color",l.color||"var(--ls-primary)"),W.dataset.locked=String(A),W.dataset.uncalibrated=String(!P),W.dataset.span=l.layoutSpan==="full"||l.layoutSpan!=="half"&&F?"full":"half",w?.lastReason)W.title=`Evidence: ${w.lastReason}`;let V=e("div","ls-row-between");V.append(e("strong","",`${l.icon} ${l.label}`));let O=e("div","ls-row");if(E!==0)O.append(e("span",`ls-delta ${E>0?"is-pos":"is-neg"}`,`${E>0?`+${E} ▲`:`${E} ▼`}`));let H=!P?"Uncalibrated":l.kind==="clock"||l.kind==="pips"?`${Number(R)||0}/${l.max}`:F?`${Et(D).length} entries`:D,U=e("strong","",H);if(O.append(U,B("✏️",()=>Ce(t,"character",l),"ls-btn-sm ls-btn-icon","Edit stat schema")),V.append(O),W.append(V),P&&typeof R==="number"){let z=Ue(l.anchors,R);if(z)W.append(e("small","ls-muted",z))}else if(!P)W.append(e("small","ls-muted",`Volatility: ${l.volatility} · Calibrates on sync`));if(w?.lastReason&&!F&&w.lastReason!==a.scene.beatSummary&&!/^(?:Scene progression|Manual Dossier adjustment|Manual UI adjustment)$/i.test(w.lastReason))W.append(e("small","ls-muted",`↳ ${w.lastReason}`));if(l.kind==="skill_tree")W.append(pt(l,R,A,(z,j)=>C(l.id,l.label,z)));else if(l.kind==="xp_level")W.append(ut(l,R));else if(l.kind==="attributes")W.append(mt(l,R,`${o.id}:${t.chatId}`));else if(l.kind==="inventory")W.append(ft(R));else if(l.kind==="status_fx")W.append(ht(R));else if(l.kind==="hearts")W.append(gt(l,Number(R)||0,P,A,(z)=>C(l.id,l.label,z)));else if(l.kind==="currency")W.append(bt(l,R,E));else if(P&&F)W.append(Xe(D,l.displayStyle??"auto"));else if(l.kind==="meter"||l.kind==="number"){let z=typeof R==="number"?R:0,j=Math.max(1,l.max-l.min),K=e("div","ls-bar-track"),Y=e("div","ls-bar-fill");if(l.min<0&&l.max>0){K.dataset.bipolar="true";let G=(0-l.min)/j*100;if(z>=0)Y.style.marginLeft=`${G.toFixed(1)}%`,Y.style.width=`${Math.min(100-G,z/l.max*(100-G)).toFixed(1)}%`;else{let ee=Math.abs(z)/Math.abs(l.min)*G;Y.style.marginLeft=`${Math.max(0,G-ee).toFixed(1)}%`,Y.style.width=`${Math.min(G,ee).toFixed(1)}%`,Y.style.background="var(--ls-danger)"}}else{let G=P?Math.max(0,Math.min(100,Math.round((z-l.min)/j*100))):0;Y.style.width=`${G}%`}if(K.append(Y),W.append(K),t.dossierEditMode&&n&&t.ctx.components?.mountRangeSlider){let G=e("div");W.append(G);try{n.track(t.ctx.components.mountRangeSlider(G,{min:l.min,max:l.max,step:l.step||1,integer:!0,value:z,disabled:A,onDragValue:(ee)=>{if(ee!==null)U.textContent=String(ee)},onCommit:(ee)=>C(l.id,l.label,ee)}))}catch{}}}else if(l.kind==="clock"){let z=Math.max(2,Math.min(16,l.max||6)),j=P?Math.max(0,Math.min(z,Math.round(Number(R)||0))):0,K=e("div","ls-clock-bar");K.style.gridTemplateColumns=`repeat(${z}, 1fr)`;for(let Y=1;Y<=z;Y++){let G=e("span",`ls-clock-seg${Y<=j?" is-filled":""}`);G.addEventListener("click",()=>C(l.id,l.label,Y===j?Y-1:Y)),K.append(G)}W.append(K)}Ut(t.ctx,W,()=>[{key:"edit",label:`✏️ Edit "${l.label}" Schema & Style`},{key:"duplicate",label:`\uD83D\uDCCB Duplicate "${l.label}" to Another Scope / Tab…`},{key:"test",label:`\uD83E\uDDEA Test "${l.label}" in Sandbox`},{key:"audit",label:"\uD83D\uDCC8 View Shift History"},{key:"div",label:"",type:"divider"},{key:"delete",label:`\uD83D\uDDD1️ Delete "${l.label}"`,danger:!0}],(z)=>{if(z==="edit")Ce(t,"character",l);else if(z==="duplicate")We(t,l);else if(z==="test")Ze(t,l.id);else if(z==="audit")ts(t,o.id);else if(z==="delete"){let j=structuredClone(t.snapshot.template);t.request("state:mutate",{templatePatch:{stats:j.stats.filter((K)=>K.id!==l.id)},reason:`Deleted stat "${l.label}"`})}}),p.append(W)}v.append(p)}let g=s.stats.filter((p)=>p.enabled&&p.scope==="player"&&p.showIn?.dossier===!0&&p.dossierTabId===_.id&&_.id!=="bonds");if(g.length>0)v.append(Dn(t,g,"player",n,t.dossierEditMode,!1))}if(_.showNpcBonds||_.kind==="peer_bonds"){let u=e("div","ls-stack"),g=e("div","ls-row-between"),p=Object.values(o.peerBonds??{});if(g.append(e("h3","",`\uD83E\uDD1D ${o.name}'s Standing & Stats Toward Other NPCs (${p.length})`),B("+ Add NPC↔NPC Bond",()=>qe(t,o),"ls-btn-sm ls-btn-primary")),u.append(g),!p.length)u.append(e("p","ls-muted",`No NPC-to-NPC relationships recorded for ${o.name} yet. They populate automatically when multiple NPCs interact, or click "+ Add NPC↔NPC Bond" above.`));else{let h=e("div","ls-stat-grid");for(let C of p){let l=e("div","ls-stat-cell"),w=e("div","ls-row-between");if(w.append(e("strong","",`→ \uD83D\uDC64 ${C.toName}`),e("div","ls-row")),w.lastElementChild.append(e("span","ls-chip ls-chip-accent",C.label),B("✏️",()=>qe(t,o,C),"ls-btn-sm ls-btn-icon","Edit NPC bond"),B("\uD83D\uDDD1️",()=>{let P=structuredClone(o);delete P.peerBonds[C.toId],t.request("state:mutate",{stateOverride:{characters:{...a.characters,[o.id]:P}},reason:`Removed peer bond ${o.name} → ${C.toName}`})},"ls-btn-sm ls-btn-icon ls-btn-danger","Delete NPC bond")),l.append(w),C.attitude)l.append(e("div","ls-thought-box",`“${C.attitude}”`));for(let[P,R]of Object.entries(C.meters)){let A=s.stats.find((F)=>F.id===P&&F.scope==="character");if(A&&!A.enabled)continue;let E=A?`${A.icon} ${A.label}`:P,D=e("div","ls-row-between");if(D.append(e("small","ls-muted",E),e("strong","",String(R))),l.append(D),typeof R==="number"){let F=A?.min??0,W=A?.max??100,V=Math.max(1,W-F),O=e("div","ls-bar-track"),H=e("div","ls-bar-fill");if(A?.color)H.style.setProperty("--ls-bar-color",A.color);if(F<0&&W>0){O.dataset.bipolar="true";let U=(0-F)/V*100;if(R>=0)H.style.marginLeft=`${U.toFixed(1)}%`,H.style.width=`${Math.min(100-U,R/W*(100-U)).toFixed(1)}%`;else{let z=Math.abs(R)/Math.abs(F)*U;H.style.marginLeft=`${Math.max(0,U-z).toFixed(1)}%`,H.style.width=`${Math.min(U,z).toFixed(1)}%`,H.style.background="var(--ls-danger)"}}else{let U=Math.max(0,Math.min(100,Math.round((R-F)/V*100)));H.style.width=`${U}%`}O.append(H),l.append(O)}}h.append(l)}u.append(h)}v.append(u)}if(_.showSecrets){let u=e("div","ls-stack");if(u.append(e("h3","","\uD83D\uDD75️ Secrets, Clues & Notes")),!o.secrets.length)u.append(e("p","ls-muted","No secrets or discoveries recorded for this character yet."));else for(let g of o.secrets){let p=e("div","ls-stat-cell");p.append(e("strong","",`${g.stage==="confirmed"?"\uD83D\uDD13":"\uD83D\uDD0D"} ${g.title} (${g.stage})`),e("p","ls-muted",g.detail)),u.append(p)}v.append(u)}if(_.showAudit){let u=a.auditLog.filter((g)=>g.actorId===o.id&&typeof g.after==="number"&&(g.before!==null||g.numericDelta!==0)).slice(-8).reverse();if(u.length>0){let g=e("div","ls-stack");g.append(e("span","ls-kicker","\uD83D\uDCC8 Recent Meter Shifts"));let p=e("div","ls-row");for(let h of u){let C=h.numericDelta>0?`+${h.numericDelta}`:String(h.numericDelta),l=e("span",`ls-delta ${h.numericDelta>=0?"is-pos":"is-neg"}`,`${h.statLabel}: ${String(h.before??"—")} → ${String(h.after)}${h.numericDelta!==0?` (${C})`:""}`);if(h.reason&&h.reason!==a.scene.beatSummary)l.title=h.reason;p.append(l)}g.append(p),v.append(g)}}return N.append(v),r.append(N),r}function nn(t,n,a,s){let{state:i,template:r,deltas:d}=t.snapshot,o=e("div","ls-stack"),c=Object.values(i.characters);if(!c.length)return o.append(e("p","ls-muted","Characters appear here as the story introduces them.")),o;let f=n==="widget"?r.surfaces.widgetTabs:r.surfaces.inlineTabs,b=new Set(f.filter((u)=>u.enabled).map((u)=>u.id)),M=r.stats.filter((u)=>{if(!u.enabled||u.scope!=="character")return!1;if(n==="widget"&&u.showIn?.widget===!1)return!1;if(n==="inline"&&u.showIn?.inline===!1)return!1;let g=n==="widget"?u.widgetTabId||"cast":u.inlineTabId||"cast",p=n==="widget"?u.extraWidgetTabIds:u.extraInlineTabIds;return g===a||!b.has(g)||Boolean(p?.includes(a))}),m=r.dossierFields.filter((u)=>n==="widget"?u.enabled&&u.showInHudCast:u.enabled&&u.showInInlineCast),S=new Set(["skill_tree","xp_level","attributes","inventory","status_fx","hearts","currency"]),L=M.filter((u)=>!S.has(u.kind)&&!Lt(u)&&u.kind!=="boolean"),T=M.filter((u)=>S.has(u.kind)||Lt(u)||u.kind==="boolean"),N=c.filter((u)=>u.present),I=c.filter((u)=>!u.present),v=r.theme.castLayout??"roster",x=e("div","ls-row-between");x.append(e("span","ls-kicker",`\uD83D\uDFE2 In Scene: ${N.length} · ⚪ Away: ${I.length}`),B(v==="roster"?"\uD83D\uDDC2️ All Cards":"\uD83D\uDC65 Icons",()=>{let u=v==="roster"?"cards":"roster";t.request("state:mutate",{templatePatch:{theme:{...r.theme,castLayout:u}},reason:`Switched cast display to ${u}`})},"ls-btn-sm","Toggle between compact character icons and expanded stacked cards")),o.append(x);let _=(u)=>{let g=e("div","ls-card"),p=e("div","ls-row-between"),h=e("div","ls-row"),C=e("div","ls-cast-avatar");if(u.portraitUrl){let E=e("img");E.src=u.portraitUrl,E.alt=u.name,C.append(E)}else C.textContent=u.name.slice(0,2).toUpperCase();let l=e("div");l.append(e("strong","",`${u.present?"\uD83D\uDFE2":"⚪"} ${u.name}`));let w=he(u,"role_summary");if(w){let E=e("div","ls-muted",w);E.style.fontSize="11px",l.append(E)}h.append(C,l);let P=e("div","ls-row"),R=m.find((E)=>E.id==="demeanor"),A=R?he(u,"demeanor"):"";if(A)P.append(e("span","ls-chip",`${R.icon} ${A}`));if(P.append(B(u.present?"\uD83D\uDFE2 In Scene":"⚪ Away",()=>{t.request("state:mutate",{patch:{characters:[{id:u.id,name:u.name,present:!u.present,...!u.present&&i.scene.location?{location:i.scene.location}:{}}]},reason:`Marked ${u.name} as ${!u.present?"In Scene":"Away"}`})},`ls-btn-sm ls-presence-pill ${u.present?"ls-chip-accent":""}`,`Toggle whether ${u.name} is In Scene or Away`),Q("volume",()=>Yt(t,u.id),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:`Assign TTS voice for ${u.name}`}),B("Dossier",()=>s(u.id),"ls-btn-sm ls-btn-primary")),p.append(h,P),g.append(p),r.coreTrackers?.trackNpcConditions!==!1&&u.conditions.length>0){let E=e("div","ls-row");for(let D of u.conditions.slice(0,4)){let F=e("span","ls-rpg-fx-pill",`⚡ ${D}`);F.dataset.fxKind="neutral",E.append(F)}g.append(E)}for(let E of m.filter((D)=>D.id!=="demeanor"&&D.id!=="role_summary")){let D=he(u,E.id);if(!D)continue;if(E.displayStyle==="quote")g.append(e("div","ls-thought-box",`${E.icon} “${D}”`));else g.append(e("small","ls-muted",`${E.icon} ${D}`))}if(L.length>0){let E=e("div","ls-cast-mini-grid");for(let D of L){let F=u.meters[D.id],W=d.characterDeltas[u.id]?.[D.id]??0,V=F?.calibrated&&typeof F.value==="number"?F.value:0,O=Math.max(1,D.max-D.min),H=F?.calibrated?Math.max(0,Math.min(100,Math.round((V-D.min)/O*100))):0,U=F?.calibrated&&typeof F.value==="number"?Ue(D.anchors,F.value):"",z=e("div","ls-cast-mini-meter");if(z.style.setProperty("--ls-bar-color",D.color||"var(--ls-primary)"),U)z.title=`${D.label}: ${V} (${U})`;let j=e("div","ls-row-between");j.append(e("small","ls-muted",`${D.icon} ${D.label}`));let K=e("div","ls-row");if(W!==0)K.append(e("span",`ls-delta ${W>0?"is-pos":"is-neg"}`,W>0?`+${W}`:String(W)));K.append(e("strong","",F?.calibrated?String(F.value):"—")),j.append(K);let Y=e("div","ls-bar-track"),G=e("div","ls-bar-fill");G.style.width=`${H}%`,Y.append(G),z.append(j,Y),E.append(z)}g.append(E)}for(let E of T){let D=u.meters[E.id],F=Boolean(D?.calibrated),W=F?D.value:E.defaultValue,V=String(W??"").trim(),O=e("div","ls-stat-cell");if(O.style.setProperty("--ls-bar-color",E.color||"var(--ls-primary)"),O.dataset.uncalibrated=String(!F),O.append(e("small","ls-kicker",`${E.icon} ${E.label}`)),!F&&!S.has(E.kind)){O.append(e("small","ls-muted","Uncalibrated")),g.append(O);continue}if(F&&(!V||V==="None")&&!S.has(E.kind)){O.append(e("small","ls-muted","None")),g.append(O);continue}if(E.kind==="skill_tree")O.append(pt(E,W,Boolean(E.locked||D?.locked),(H,U)=>{t.request("state:mutate",{patch:{characters:[{id:u.id,name:u.name,meters:{[E.id]:{op:"set",value:H,reason:U}}}]},reason:U})}));else if(E.kind==="xp_level")O.append(ut(E,W));else if(E.kind==="attributes")O.append(mt(E,W,`${u.id}:${t.chatId}`));else if(E.kind==="inventory")O.append(ft(W));else if(E.kind==="status_fx")O.append(ht(W));else if(E.kind==="hearts")O.append(gt(E,Number(W)||0,Boolean(D?.calibrated),Boolean(E.locked||D?.locked)));else if(E.kind==="currency")O.append(bt(E,W,d.characterDeltas[u.id]?.[E.id]??0));else O.append(Xe(V,E.displayStyle??"auto"));g.append(O)}return g};if(v==="cards"){for(let u of[...N,...I])o.append(_(u));return o}t.openedCastTabs=t.openedCastTabs.filter((u)=>Boolean(i.characters[u]));let k=t.activeCastTabActorId&&i.characters[t.activeCastTabActorId]?i.characters[t.activeCastTabActorId]:void 0;if(t.openedCastTabs.length>0||k){let u=e("div","ls-cast-tabs-bar"),g=B("← Cast",()=>{t.activeCastTabActorId="",t.emitChange()},"ls-btn-sm","Return to Cast Icons");if(!k)g.setAttribute("aria-current","page");u.append(g);for(let p of t.openedCastTabs){let h=i.characters[p];if(!h)continue;let C=k?.id===h.id,l=e("div","ls-cast-tab-group"),w=B(`${h.present?"\uD83D\uDFE2":"⚪"} ${h.name}`,()=>{t.activeCastTabActorId=h.id,t.selectedActorId=h.id,t.emitChange()},"ls-btn-sm ls-cast-tab-btn",`Inspect ${h.name}`);if(C)w.setAttribute("aria-current","page");let P=B("×",()=>{if(t.openedCastTabs=t.openedCastTabs.filter((R)=>R!==h.id),t.activeCastTabActorId===h.id)t.activeCastTabActorId=t.openedCastTabs.at(-1)??"";t.emitChange()},"ls-btn-sm ls-cast-tab-close",`Close ${h.name} tab`);l.append(w,P),u.append(l)}if(k)return o.replaceChildren(x,u,_(k)),o;o.append(u)}let y=(u,g)=>{if(!g.length)return;let p=e("div","ls-roster-group");p.append(e("small","ls-muted",`${u} (${g.length})`));let h=e("div","ls-roster-grid");for(let C of g){let l=he(C,"demeanor"),w=he(C,"role_summary"),P=e("button","ls-roster-icon-btn");P.type="button",P.title=`${C.name}${w?` — ${w}`:""}${l?` (${l})`:""}`;let R=e("div","ls-roster-avatar");if(C.portraitUrl){let F=e("img");F.src=C.portraitUrl,F.alt=C.name,R.append(F)}else R.append(document.createTextNode(C.name.slice(0,2).toUpperCase()));R.append(e("span",`ls-roster-dot ${C.present?"is-present":"is-away"}`));let A=e("span","ls-roster-name",C.name),E=l||w||"",D=E?e("span","ls-roster-role",E):null;P.append(R,A,...D?[D]:[]),P.addEventListener("click",(F)=>{if(F.stopPropagation(),!t.openedCastTabs.includes(C.id))t.openedCastTabs=[...t.openedCastTabs,C.id];t.activeCastTabActorId=C.id,t.selectedActorId=C.id,t.emitChange()}),h.append(P)}p.append(h),o.append(p)};return y("\uD83D\uDFE2 In Scene",N),y("⚪ Away",I),o}function Gs(t){let{state:n,template:a,deltas:s}=t.snapshot,i=a.theme.showSceneChips,r=Ne(n),d=e("div","ls-row");if(i.time)d.append(e("span","ls-chip",`\uD83D\uDD70️ ${r.time}`));if(i.date)d.append(e("span","ls-chip",`\uD83D\uDCC5 ${r.date}`));if(i.location)d.append(e("span","ls-chip ls-chip-accent",`\uD83D\uDCCD ${r.location}`));if(i.weather)d.append(e("span","ls-chip",`\uD83C\uDF26️ ${r.weather}`));if(a.coreTrackers?.trackPlayerAttire!==!1&&n.player.attire)d.append(e("span","ls-chip",`\uD83D\uDC55 You: ${n.player.attire.slice(0,28)}`));if(i.cast){let o=$t(a,"demeanor");for(let c of Object.values(n.characters).filter((f)=>f.present).slice(0,4)){let f=s.characterDeltas[c.id]??{},b=Object.values(f).find((S)=>S!==0),M=o?he(c,"demeanor"):"",m=e("span","ls-chip",`\uD83D\uDC64 ${c.name}${M?` · ${M}`:""}`);if(b)m.append(e("span",`ls-delta ${b>0?"is-pos":"is-neg"}`,b>0?`+${b}`:String(b)));d.append(m)}}if(i.pinnedStats)for(let o of a.stats.filter((c)=>c.enabled&&(c.pinnedToHeader||c.showIn?.pinnedHeader)))if(o.scope==="character"){let c=Object.values(n.characters).find((m)=>m.present),f=c?.meters[o.id];if(!f?.calibrated)continue;let b=(c?s.characterDeltas[c.id]?.[o.id]:0)??0,M=e("span","ls-chip ls-chip-accent",`${o.icon} ${c.name} ${o.label}: ${String(f.value)}`);if(b!==0)M.append(e("span",`ls-delta ${b>0?"is-pos":"is-neg"}`,b>0?`+${b}`:String(b)));d.append(M)}else{let c=n.stats[o.id];if(!c?.calibrated)continue;let f=s.statDeltas[o.id]??0,b=e("span","ls-chip ls-chip-accent",`${o.icon} ${o.label}: ${String(c.value)}`);if(f!==0)b.append(e("span",`ls-delta ${f>0?"is-pos":"is-neg"}`,f>0?`+${f}`:String(f)));d.append(b)}return d}function ns(t,n,a){let{state:s,template:i}=t.snapshot,r=e("div","ls-inline-host");t.stampThemeOnElement(r);let d=e("div","ls-inline-card");if(!t.inlineExpanded){let S=e("div","ls-inline-pill-bar");S.addEventListener("click",()=>{t.inlineExpanded=!0,t.emitChange()});let L=Fn(t);if(L.childElementCount===0)L.append(e("span","ls-chip ls-chip-accent",`${i.icon||"✨"} ${s.title||i.name||"Lumi Stats"}`));return S.append(L,Q("chevronDown",()=>{t.inlineExpanded=!0,t.emitChange()},{label:"Expand",className:"ls-btn-sm ls-btn-primary",title:"Expand Inline Ribbon"})),d.append(S),r.append(d),r}if(i.surfaces.customInlineHtml){let S=e("div","ls-card");d.append(S),Be(S,De(i.surfaces.customInlineHtml,s),t.ctx)}let o=[...i.surfaces.inlineTabs].filter((S)=>S.enabled&&(S.kind!=="web"||i.surfaces.showRelationshipWeb!==!1)).sort((S,L)=>S.order-L.order),c=o.find((S)=>S.id===t.activeInlineTab)??o[0]??{id:"stats",label:"Stats",icon:"\uD83D\uDCCA",kind:"stats",enabled:!0,order:0},f=e("div","ls-row-between"),b=e("div","ls-row");if(o.length>1)for(let S of o){let L=B(`${S.icon} ${S.label}`,()=>{t.activeInlineTab=S.id,t.emitChange()},"ls-btn-sm");if(S.id===c.id)L.setAttribute("aria-current","page");b.append(L)}else b.append(Gs(t));let M=async(S)=>{if(typeof t.ctx.ui?.showContextMenu!=="function"){lt(t,a);return}let{selectedKey:L}=await t.ctx.ui.showContextMenu({position:{x:S.clientX,y:S.clientY},items:[{key:"edit_scene",label:"Edit Scene Values"},{key:"pill_prompts",label:"Edit Scene Pill Prompts & Chips"},{key:"template",label:`Switch Template & Skin (${i.name})`}]});if(L==="edit_scene")_t(t);else if(L==="pill_prompts")Ae(t);else if(L==="template")lt(t,a)},m=e("div","ls-row");if(m.append(Q("stage",()=>t.toggleVnStage(),{className:"ls-btn-sm ls-btn-ghost",label:"Stage",title:"Launch 2D Visual Novel Stage"}),Q("more",(S)=>void M(S),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:"Scene Pill, Template & Skin Options"}),Q("settings",a,{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:"Open Settings Studio"}),Q("chevronUp",()=>{t.inlineExpanded=!1,t.emitChange()},{label:"Collapse",className:"ls-btn-sm ls-btn-primary",title:"Collapse Ribbon"})),f.append(b,m),d.append(f),c.kind==="cast")d.append(nn(t,"inline",c.id,n));else if(c.kind==="web")d.append(Zt(t,n));else if(c.kind==="map")d.append(en(t));else{if(c.customHtml){let S=e("div","ls-card");d.append(S),Be(S,De(c.customHtml,s),t.ctx)}d.append(tn(t,"inline",c.id))}return r.append(d),r}var as='    She⠀stepped⠀forward⠀with⠀a⠀warm⠀smile.⠀"Welcome⠀back."',zn="",ss="She hid the knife before any blood could spill.",rs=!1,Re=null;function os(t,n){let a=t.settings,s=e("div","ls-stack"),i=e("section","ls-card");if(i.append(e("span","ls-kicker","Prose Typography & Unicode Hygiene"),e("h3","","Braille Blank (U+2800) & Whitespace Cleaner"),e("p","ls-muted","Scrubs invisible Braille pattern blanks (U+2800), zero-width joiners, and accidental 4-space code blocks.")),a){let M=e("div","ls-row-between ls-stat-cell");M.append(e("span","","Auto-Clean Braille Blanks & 4-Space Glitches"));let m=e("div");M.append(m),me(t,n,m,{checked:Boolean(a.cleanBraille),ariaLabel:"Auto-Clean Braille Blanks",onChange:(S)=>{t.request("settings:update",{settings:{cleanBraille:S}})}}),i.append(M)}let r=e("div","ls-row-between ls-stat-cell");r.append(e("span","","Retroactively clean all stored messages in the active chat:"),B("Clean Active Chat Now",()=>{t.request("prose:cleanChat").then((M)=>{t.notify(`Cleaned ${Number(M.cleanedCount??0)} of ${Number(M.total??0)} messages.`)})},"ls-btn-sm ls-btn-primary")),i.append(r),s.append(i);let d=e("div");s.append(d);let o=fe(t,n,d,{title:"Live Braille & Indentation Tester",iconName:"flask",defaultExpanded:!1,persistKey:"studio_prose_tester"}),c=e("textarea","ls-input");c.rows=2,c.value=as;let f=e("div","ls-stat-cell"),b=()=>{as=c.value,f.textContent=`Normalized Output: ${jt(c.value)}`};if(c.addEventListener("input",b),b(),o.append(c,f),a){let M=e("section","ls-card"),m=(C)=>{t.request("settings:update",{settings:C})},S=kt(a.sensitiveWords),L=a.obfuscateVowelsWithOne!==!1,T=e("div","ls-row-between"),N=e("div");T.append(e("h3","",`Sensitive Word Obfuscator (${S.length} words)`),N),me(t,n,N,{checked:Boolean(a.sensitiveObfuscatorEnabled),ariaLabel:"Enable Sensitive Word Obfuscator",onChange:(C)=>m({sensitiveObfuscatorEnabled:C})}),M.append(T,e("p","ls-muted",'Replaces vowels in chosen words with "1" (e.g., blood → bl11d) when sending prompts, and restores readable words & inflections (e.g., bl11d/bl11dy → blood/bloody) in chat display via Lumiverse display processing (requires "chat_mutation" or "regex_scripts" permission).'));let I=e("div","ls-row"),v=e("input","ls-input");v.style.flex="1",v.placeholder="Type words separated by commas (e.g. blood, kill)…",v.value=zn,v.addEventListener("input",()=>{zn=v.value});let x=()=>{let C=v.value.split(/[\n,;]+/).map((w)=>w.trim().toLowerCase()).filter((w)=>w.length>=2);if(!C.length)return;let l=kt([...S,...C]);zn="",v.value="",m({sensitiveWords:l,...a.sensitiveObfuscatorEnabled?{}:{sensitiveObfuscatorEnabled:!0}})};if(v.addEventListener("keydown",(C)=>{if(C.key==="Enter")C.preventDefault(),x()}),I.append(v,B("Add",x,"ls-btn-sm ls-btn-primary"),...S.length>0?[B("Clear All",()=>m({sensitiveWords:[]}),"ls-btn-sm ls-btn-danger")]:[]),M.append(I),S.length>0){let C=e("div","ls-row");for(let l of S)C.append(B(`${l} → ${Tn(l,L)} ✕`,()=>{m({sensitiveWords:S.filter((w)=>w!==l)})},"ls-btn-sm ls-quick-pill",`Remove "${l}"`));M.append(C)}let _=e("div");M.append(_);let k=fe(t,n,_,{title:"Cipher Rules & Live Preview",iconName:"sliders",defaultExpanded:!1,persistKey:"studio_prose_cipher"}),y=e("div","ls-grid");for(let[C,l,w]of[["obfuscateVowelsWithOne",'Use "1" instead of "*"',!0],["obfuscateOnSend","Obfuscate Prompts Sent to LLM",!0],["restoreObfuscatedOnRender","Restore Words in Chat Display",!0],["obfuscateOnOutput","Obfuscate Saved LLM Output",!1],["includeCipherHint","Explain Cipher Input to LLM (Keep prose normal)",!1]]){let P=e("div","ls-row-between ls-stat-cell");P.append(e("span","",l));let R=e("div");P.append(R),me(t,n,R,{checked:a[C]!==void 0?Boolean(a[C]):w,onChange:(A)=>m({[C]:A})}),y.append(P)}let u=e("input","ls-input");u.value=ss;let g=e("small","ls-muted"),p=e("small","ls-muted"),h=()=>{ss=u.value;let C=$a(u.value,S,L),l=a.obfuscateOnOutput?C:a.restoreObfuscatedOnRender!==!1?In(C,S,L):C;g.textContent=`Sent to LLM: ${C}`,p.textContent=`Chat Display: ${l}`};u.addEventListener("input",h),h(),k.append(y,u,g,p),s.append(M)}return s}function is(t,n,a){let s=t.settings,i=e("div","ls-stack");if(!s)return i;if(!t.connections.length&&!rs)rs=!0,t.refreshActiveChat();let r=e("section","ls-card");r.append(e("h3","","Extraction Mode & Connections"));let d=e("div","ls-row");for(let[l,w]of[["sidecar","Dedicated Sidecar Extractor (Works with Any Preset)"],["inline_tag","Zero-Call Inline <lumi-stats> Tag"]]){let P=B(w,()=>{t.request("settings:update",{settings:{extractionMode:l}})},"ls-btn-sm");if(s.extractionMode===l)P.setAttribute("aria-current","page");d.append(P)}r.append(d);let o=e("div","ls-grid");for(let[l,w]of[["autoTrack","Auto-calibrate after assistant replies"],["injectContinuity","Inject continuity into narrator prompt"],["splitStaticProtocolForCache","Cache-friendly split (static rules before history)"],["memoryCortexSync","Sync to Lumiverse Memory Cortex"],["worldInfoGating","Enable [lumi:stat>=value] World Info gates"],["thresholdToasts","Show threshold toast alerts"],["debugInspector","Keep last extractor payload for debug"]]){let P=e("div","ls-row-between ls-stat-cell");P.append(e("span","",w));let R=e("div");P.append(R),me(t,n,R,{checked:Boolean(s[l]),onChange:(A)=>void t.request("settings:update",{settings:{[l]:A}})}),o.append(P)}r.append(o);let c=e("div","ls-grid"),f=e("div","ls-label","Extractor LLM Connection"),b=e("div");f.append(b);let M=e("label","ls-label","Extractor Model Override"),m=e("div");M.append(m),c.append(f,M),r.append(c),J(t,n,b,{value:s.extractorConnectionId||"",ariaLabel:"Extractor LLM Connection",searchPlaceholder:"Search connections…",options:[{value:"",label:"Use Active Lumiverse Default Connection"},...t.connections.map((l)=>({value:l.id,label:`${l.name}${l.model?` (${l.model})`:""}`,...l.provider?{sublabel:l.provider}:{}}))],onChange:(l)=>{t.request("settings:update",{settings:{extractorConnectionId:l}})}});let S=e("input","ls-input");if(S.value=s.extractorModel||"",S.placeholder="Default connection model…",S.addEventListener("change",()=>{t.request("settings:update",{settings:{extractorModel:S.value.trim()}})}),m.append(S),t.ctx.components?.mountModelCombobox)a.push(()=>{if(!m.isConnected)return;try{m.replaceChildren(),n.track(t.ctx.components.mountModelCombobox(m,{value:s.extractorModel||"",connection:s.extractorConnectionId?{kind:"llm",id:s.extractorConnectionId}:{kind:"llm"},appearance:"standard",placeholder:"Default connection model…",onChange:(l)=>{t.request("settings:update",{settings:{extractorModel:l}})}}))}catch{}});let L=e("section","ls-card");L.append(e("span","ls-kicker","Token Economy & Prompt Budget"),e("h3","","Token Diet, Protocol Mode & Live Analyzer"));let T=e("div","ls-grid"),N=e("label","ls-label","Continuity Token Budget (150–4000)"),I=e("input","ls-input");I.type="number",I.min="150",I.max="4000",I.step="50",I.value=String(s.tokenBudget??450),I.addEventListener("change",()=>{let l=Math.max(150,Math.min(4000,Math.round(Number(I.value)||450)));I.value=String(l),t.request("settings:update",{settings:{tokenBudget:l}})}),N.append(I);let v=e("div","ls-label","Extractor Protocol Mode"),x=e("div");v.append(x),J(t,n,x,{value:s.protocolVerbosity??"compact",ariaLabel:"Extractor Protocol Mode",options:[{value:"compact",label:"Compact Delta (Recommended — Saves ~45%)"},{value:"standard",label:"Standard Detailed (Verbose Turn-1 Guides)"}],onChange:(l)=>{t.request("settings:update",{settings:{protocolVerbosity:l}})}});let _=e("label","ls-label","Sidecar History Window (2–12 msgs)"),k=e("input","ls-input");k.type="number",k.min="2",k.max="12",k.value=String(s.sidecarHistoryTurns??4),k.addEventListener("change",()=>{let l=Math.max(2,Math.min(12,Math.round(Number(k.value)||4)));k.value=String(l),t.request("settings:update",{settings:{sidecarHistoryTurns:l}})}),_.append(k);let y=e("label","ls-label","Sidecar Max Chars / Msg (800–6000)"),u=e("input","ls-input");u.type="number",u.min="800",u.max="6000",u.step="250",u.value=String(s.sidecarMaxCharsPerMsg??2500),u.addEventListener("change",()=>{let l=Math.max(800,Math.min(6000,Math.round(Number(u.value)||2500)));u.value=String(l),t.request("settings:update",{settings:{sidecarMaxCharsPerMsg:l}})}),y.append(u),T.append(N,v,_,y),L.append(T);let g=e("div","ls-row");g.append(B("Hide Analytical Fields from Continuity",()=>{let l=new Set(["acted","observation","plan","knowledge","cash_in_hand","cash_in_bank","bottom_underwear","top_underwear","offscreen_npcs"]),w=t.snapshot.template.stats.map((P)=>l.has(P.id)?{...P,injectInContinuity:!1}:P);t.request("state:mutate",{templatePatch:{stats:w},reason:"Moved analytical/secondary stats to UI-only continuity"}).then(()=>t.notify("Analytical fields moved to UI-only (still tracked & visible in panels)."))},"ls-btn-sm","Stops echoing acted, observation, plan, knowledge, cash, underwear, and offscreen_npcs back to the narrator while keeping them in the UI"),B("Auto-Gate Situational Stats",()=>{let l={cash_in_hand:["cash","coin","gold","money","pay","buy","sell","price","wallet","bank"],cash_in_bank:["cash","coin","gold","money","pay","buy","sell","bank","account","asset"],bottom_underwear:["undress","underwear","panties","boxers","towel","bath","strip","naked","skirt","pants"],top_underwear:["undress","underwear","bra","towel","bath","strip","naked","shirt","top"]},w=t.snapshot.template.stats.map((P)=>{if(l[P.id])return{...P,promptTriggerMode:"conditional",promptKeywords:l[P.id]};if((P.id==="eff_pow_agi"||P.id==="char_eff_pow_agi")&&P.formula?.trim())return{...P,calculationMode:"local_formula"};return P});t.request("state:mutate",{templatePatch:{stats:w},reason:"Applied keyword gating & local-formula diet"}).then(()=>t.notify("Applied keyword gating to situational stats."))},"ls-btn-sm","Only sends cash & clothing rules when matching keywords appear in recent chat")),L.append(g);let p=e("div","ls-stat-cell"),h=()=>{if(p.replaceChildren(),!Re){p.append(e("small","ls-muted",'Click "Analyze Current Chat Tokens" to measure exact protocol, continuity, and per-stat token usage.'));return}let l=Re.approximate?" (est.)":"";p.append(e("strong","",`Total Injected: ${Number(Re.totalInjectedTokens??0)} tokens${l} — Protocol: ${Number(Re.protocolTokens??0)} | Continuity: ${Number(Re.continuityTokens??0)} (uncapped: ${Number(Re.rawContinuityTokens??0)}) | Dossier: ~${Number(Re.dossierStateTokens??0)}`));let w=Array.isArray(Re.topStats)?Re.topStats:[];if(w.length>0){let P=e("div","ls-row");for(let R of w)P.append(e("span","ls-chip",`${String(R.label)}: ~${Number(R.approxTokens??0)}t (rule ${Number(R.ruleTokens??0)} + state ${Number(R.stateTokens??0)})`));p.append(P)}};h();let C=B("Analyze Current Chat Tokens",()=>{C.disabled=!0,C.textContent="Counting tokens…",t.request("tokens:analyze").then((l)=>{Re=l,h()}).finally(()=>{if(C.isConnected)C.disabled=!1,C.textContent="Analyze Current Chat Tokens"})},"ls-btn-sm ls-btn-primary");return L.append(C,p),r.append(B("Inspect Last Extractor Payload",()=>{t.request("debug:get").then((l)=>{t.modals.open({title:"Last Extractor JSON Output",width:720,maxHeight:740},(w)=>{let P=e("pre","ls-stat-cell",l.record?JSON.stringify(l.record,null,2):"No debug record captured yet. Enable debug inspection and run a sync.");P.style.whiteSpace="pre-wrap",P.style.overflowWrap="anywhere",w.append(P)})})},"ls-btn-sm")),i.append(r,L),i}function rn(t,n){let a=structuredClone(t.snapshot.template),s=[...a.categories??[]];t.modals.open({title:n?`Edit Category: ${n.icon} ${n.name}`:"Create Stat Category & Group Rule",width:660,maxHeight:840},(i,r,d,o)=>{let c=n?.enabled??!0,f=n?.showGroupHeaderInHud??!0,b=n?.collapsedByDefault??!1,M=n?.injectInContinuity??!0,m=n?.color||"var(--lumiverse-primary)",S=n?.promptTriggerMode??"always",L=new Set(n?a.stats.filter((X)=>X.categoryId===n.id).map((X)=>X.id):[]),T=e("div","ls-grid"),N=e("label","ls-label","Icon"),I=e("input","ls-input");I.value=n?.icon??"\uD83D\uDCC1",N.append(I);let v=e("label","ls-label","Category Name"),x=e("input","ls-input");x.placeholder="e.g. Combat & Power, Romance & Chemistry, Finances…",x.value=n?.name??"",v.append(x),T.append(N,v),i.append(T);let _=e("div","ls-label","Category Accent Color"),k=e("div","ls-row"),y=()=>{for(let X of[...k.querySelectorAll(".ls-color-swatch")])X.setAttribute("aria-pressed",String(X.dataset.colorVal===m))};for(let[X,ae,ne]of[["var(--lumiverse-primary)","Theme Primary","var(--lumiverse-primary, #38bdf8)"],["#38bdf8","Sky","#38bdf8"],["#f472b6","Rose","#f472b6"],["#f59e0b","Amber","#f59e0b"],["#10b981","Emerald","#10b981"],["#a78bfa","Violet","#a78bfa"],["#f43f5e","Crimson","#f43f5e"]]){let ge=B("",()=>{m=X,y()},"ls-color-swatch",ae);ge.dataset.colorVal=X,ge.style.background=ne,k.append(ge)}y(),_.append(k),i.append(_);let u=e("div","ls-row-between ls-stat-cell");u.append(e("strong","","Enable Category & All Stats Inside It"));let g=e("div");u.append(g),me(t,o,g,{checked:c,ariaLabel:"Enable Category",onChange:(X)=>{c=X}}),i.append(u);let p=e("div","ls-grid");for(let[X,ae,ne]of[["Show Category Header in HUD / Drawer",f,(ge)=>{f=ge}],["Collapse Group by Default",b,(ge)=>{b=ge}],["Include Category Stats & AI Rule in Story Continuity",M,(ge)=>{M=ge}]]){let ge=e("div");xe(t,o,ge,{checked:ae,label:X,onChange:ne}),p.append(ge)}i.append(p);let h=e("div");i.append(h);let C=fe(t,o,h,{title:"Shared Category AI Rule & Prompt Trigger",iconName:"sparkles",defaultExpanded:!0,persistKey:"modal_cat_ai_rule"});C.append(e("small","ls-muted","This rule is printed ONCE for the group alongside each member stat’s own individual rule (individual stat rules remain completely untouched)."));let l=e("div","ls-label","Group Prompt Frequency"),w=e("div");l.append(w),C.append(l);let P=e("label","ls-label","Group Trigger Keywords (comma-separated)"),R=e("input","ls-input");R.placeholder="e.g. attack, fight, hit, spell, bleed, dodge",R.value=(n?.promptKeywords??[]).join(", "),P.append(R),C.append(P);let A=()=>{P.style.display=S==="conditional"?"":"none"};A(),J(t,o,w,{value:S,ariaLabel:"Group Prompt Frequency",options:[{value:"always",label:"Always in Prompt"},{value:"conditional",label:"Only When Group Keywords Match"},{value:"manual",label:"Manual Sync Only"}],onChange:(X)=>{S=X,A()}});let E=e("div","ls-label"),D=e("div","ls-row-between"),F=e("textarea","ls-input");F.rows=3,F.value=n?.aiRule??"",F.placeholder="Describe shared delta ranges, combat multipliers, romance pacing, or roleplay behavior for stats in this category…",D.append(e("span","","Shared Category AI / Delta Rule"),B("⛶ Full-Screen Editor",()=>{t.request("textEditor:open",{title:`Category Rule: ${x.value||"Category"}`,value:F.value,placeholder:"Describe shared rules for this stat group…"}).then((X)=>{if(!X.cancelled&&typeof X.text==="string")F.value=X.text})},"ls-btn-sm")),E.append(D,F),C.append(E);let W=e("div");i.append(W);let V=fe(t,o,W,{title:"Local Group Formula & Cross-Stat Modifiers (Optional)",iconName:"sliders",defaultExpanded:Boolean(n?.localRuleFormula),persistKey:"modal_cat_local_rule"});V.append(e("small","ls-muted",'Supports conditional modifiers `mod("stat_id", "Label", delta)` (auto-applies while true and clears when false) and `set("stat_id", expr)` / `if(cond) mod(...)`.'));let O=e("textarea","ls-input");O.rows=3,O.placeholder=`e.g.
mod("composure", "High Arousal", arousal >= 75 ? -10 : 0)
if(HP < HP_max * 0.5) mod("composure", "Wounded", -10)`,O.value=n?.localRuleFormula??"";let H=e("div","ls-formula-status"),U=e("strong","");H.append(U);let z=()=>{let X=wn({...n,id:n?.id,name:x.value.trim()||"Preview Category",localRuleFormula:O.value});if(!O.value.trim()){H.dataset.status="warn",U.textContent="No local group formula set (optional).";return}let ae=Fa(X,t.snapshot.state,a.stats,t.selectedActorId);if(ae.error)H.dataset.status="error",U.textContent=`✖ Error: ${ae.error}`;else if(ae.appliedEffects.length>0)H.dataset.status="ok",U.textContent=`✓ Active Effects: ${ae.appliedEffects.join(" · ")}`;else H.dataset.status="ok",U.textContent="✓ Valid formula (0 active modifiers triggered on current state)."};O.addEventListener("input",z),z(),V.append(O,H,B("▶ Test Group Formula",z,"ls-btn-sm"));let j=e("div");i.append(j);let K=fe(t,o,j,{title:`Member Stats in This Category (${L.size})`,iconName:"stats",defaultExpanded:!0,persistKey:"modal_cat_members"}),Y=e("div","ls-grid");for(let X of a.stats){let ae=e("div");xe(t,o,ae,{checked:L.has(X.id),label:`${X.icon} ${X.label} (${X.scope})`,onChange:(ne)=>{if(ne)L.add(X.id);else L.delete(X.id)}}),Y.append(ae)}K.append(Y);let G=e("div","ls-row-between");G.style.marginTop="12px";let ee=e("div","ls-row");if(n)ee.append(B("Delete Category",()=>{let X=s.filter((ne)=>ne.id!==n.id),ae=a.stats.map((ne)=>ne.categoryId===n.id?{...ne,categoryId:void 0}:ne);t.request("state:mutate",{templatePatch:{categories:X,stats:ae},reason:`Deleted category "${n.name}" (stats preserved)`}),r()},"ls-btn-sm ls-btn-danger"));let te=B(n?"Save Category":"Create Category",()=>{let X=x.value.trim();if(!X)return;let ae=R.value.split(",").map((le)=>le.trim().toLowerCase()).filter(Boolean),ne=wn({...n,id:n?.id,name:X,icon:I.value.trim()||"\uD83D\uDCC1",color:m,enabled:c,showGroupHeaderInHud:f,collapsedByDefault:b,injectInContinuity:M,promptTriggerMode:S,promptKeywords:ae,aiRule:F.value.trim()||void 0,localRuleFormula:O.value.trim()||void 0,order:n?.order??s.length}),ge=s.some((le)=>le.id===ne.id)?s.map((le)=>le.id===ne.id?ne:le):[...s,ne],Se=a.stats.map((le)=>{if(L.has(le.id))return{...le,categoryId:ne.id};if(le.categoryId===ne.id)return{...le,categoryId:void 0};return le});t.request("state:mutate",{templatePatch:{categories:ge,stats:Se},reason:`Saved category "${ne.name}"`}),r()},"ls-btn-primary");G.append(ee,te),i.append(G)})}var de="all",jn="",ls=[{label:"Blush & Fluster",icon:"\uD83D\uDC93",scope:"character",kind:"meter",min:0,max:100,defaultValue:0,volatility:"momentary",triggerCues:"0–100 scale. Spikes immediately on teasing, eye contact, state of undress, or closeness; cools down in calm talk."},{label:"Jealousy & Possessiveness",icon:"\uD83D\uDD25",scope:"character",kind:"meter",min:0,max:100,defaultValue:10,volatility:"momentary",triggerCues:"0–100 scale. Rises when the player praises, flirts with, or prioritizes another rival."},{label:"Respect & Standing",icon:"\uD83D\uDC51",scope:"character",kind:"meter",min:0,max:100,defaultValue:50,volatility:"progressive",triggerCues:"0–100 scale. Rises when the player shows competence, poise, or backbone; drops on weakness."},{label:"Suspicion",icon:"\uD83D\uDD0D",scope:"character",kind:"meter",min:0,max:100,defaultValue:15,volatility:"progressive",triggerCues:"0–100 scale. Increases when catching inconsistencies, secrets, or unusual behavior."},{label:"Stamina & Energy",icon:"⚡",scope:"player",kind:"meter",min:0,max:100,defaultValue:100,volatility:"momentary",triggerCues:"0–100 scale. Spent during physical exertion, combat, or sleepless nights; restored by rest or meals."},{label:"Danger / Event Clock",icon:"⏱️",scope:"world",kind:"clock",min:0,max:6,defaultValue:0,volatility:"progressive",triggerCues:"0–6 segments. Advance by +1 segment as an approaching confrontation, deadline, or alarm draws closer."},{label:"Skill Tree & SP",icon:"\uD83C\uDF33",scope:"player",kind:"skill_tree",min:0,max:100,defaultValue:0,volatility:"progressive",triggerCues:'Format: "SP: N | Skill A (Lv.X/Y, cost:1, bonus) ; Skill B (Lv.X/Y, cost:1, req:Skill A)". Award SP on milestones.'},{label:"Level & XP",icon:"⭐",scope:"player",kind:"xp_level",min:0,max:100,defaultValue:0,volatility:"progressive",triggerCues:'Format: "Lv. N | cur/next XP | Rank X". Award XP on quests/battles; level up when cur >= next.'},{label:"Core Attributes",icon:"\uD83E\uDDEC",scope:"player",kind:"attributes",min:1,max:30,defaultValue:10,volatility:"anchor",triggerCues:'Comma-separated stats: "STR:N, DEX:N, CON:N, INT:N, WIS:N, CHA:N".'},{label:"Gear & Inventory",icon:"\uD83C\uDF92",scope:"player",kind:"inventory",min:0,max:100,defaultValue:0,volatility:"progressive",triggerCues:'Separate items by "; " with qty & rarity tags: "Runed Blade [rare, equipped] ; Potion x3 [common]".'},{label:"Buffs & Debuffs",icon:"⚡",scope:"player",kind:"status_fx",min:0,max:100,defaultValue:0,volatility:"momentary",triggerCues:'Prefix buffs with "+" and debuffs with "-" separated by "; ", e.g. "+Shielded (2t) ; -Exhausted (1t)".'},{label:"Gold / Credits",icon:"\uD83E\uDE99",scope:"player",kind:"currency",min:0,max:99999999,defaultValue:100,volatility:"progressive",triggerCues:"Track currency. Emit +N / -N on rewards, loot, or spending."}],cs=[{id:"player_attire",group:"player"},{id:"player_condition",group:"player"},{id:"player_action",group:"player"},{id:"scene_summary",group:"scene_world"},{id:"places",group:"scene_world"},{id:"quests",group:"scene_world"},{id:"dispatches",group:"scene_world"},{id:"npc_conditions",group:"character"},{id:"npc_secrets",group:"character"}];function ds(t,n,a,s,i){let r=e("div","ls-stack"),d=e("div","ls-row-between"),o=e("input","ls-input");o.style.cssText="flex:1 1 220px;min-width:160px;",o.placeholder="Search stats, meters, built-ins, or dossier fields…",o.value=jn;let c=e("div","ls-row");c.append(Q("flask",()=>Ze(t),{label:"Test Sandbox",className:"ls-btn-sm"}),Q("plus",()=>rn(t),{label:"New Category",className:"ls-btn-sm",title:"Create a custom Stat Category with shared AI/local rules"}),Q("plus",()=>Ce(t,"character"),{label:"New Stat",className:"ls-btn-sm ls-btn-primary"})),d.append(o,c),r.append(d);let f=e("div","ls-subnav-pills");for(let[T,N]of[["all","All Trackers"],["categories",`Categories (${(a.categories??[]).length})`],["character","NPC Meters"],["player","Player Stats"],["scene_world","Scene & World"],["builtin","Built-Ins & Pill"],["dossier","Dossier Fields"]]){let I=B(N,()=>{de=T,i()},"ls-btn-sm");if(de===T)I.setAttribute("aria-current","page");f.append(I)}r.append(f);let b=e("div");r.append(b);let M=fe(t,n,b,{title:"1-Click Quick-Add Popular Stats",iconName:"sparkles",badge:ls.length,defaultExpanded:!1,persistKey:"studio_stats_quick_add"}),m=e("div","ls-row");for(let T of ls){let N=a.stats.some((v)=>v.id===ie(T.label,"stat")),I=B(`${N?"✓ ":"+ "}${T.icon} ${T.label}`,()=>{let v=re({label:T.label,icon:T.icon,scope:T.scope,kind:T.kind,min:T.min,max:T.max,defaultValue:T.defaultValue,volatility:T.volatility,triggerCues:T.triggerCues});s((x)=>({stats:[...x.stats.filter((_)=>_.id!==v.id),v]}),`Added stat "${v.label}"`),t.notify(`Added "${v.icon} ${v.label}".`)},`ls-btn-sm ls-quick-pill ${N?"ls-chip-accent":""}`,T.triggerCues);m.append(I)}M.append(m);let S=e("div","ls-stack");r.append(S);let L=()=>{S.replaceChildren();let T=jn.trim().toLowerCase(),N=(p)=>!T||p.toLowerCase().includes(T);if((de==="all"||de==="scene_world"||de==="builtin")&&N("scene pill location time date weather clock")){let p=e("div","ls-stat-row-compact");p.style.borderLeft="3px solid var(--ls-primary)";let h=e("div","ls-row");h.append(e("strong","","\uD83D\uDCCD Scene Pill (Location, Time, Date, Weather)"),e("span","ls-chip ls-chip-accent",a.coreTrackers?.scenePillLocked?"\uD83D\uDD12 Locked":"Built-In Pill"));let C=e("div","ls-row");C.append(B("Full Edit & Prompts",()=>Ae(t),"ls-btn-sm ls-btn-primary")),p.append(h,C),S.append(p)}let I=(p)=>{let h=e("div","ls-stat-row-compact");h.style.borderLeft=`3px solid ${p.color||"var(--ls-primary)"}`;let C=e("div","ls-row");C.style.minWidth="0";let l=e("div");me(t,n,l,{checked:p.enabled,ariaLabel:`Toggle ${p.label}`,onChange:(D)=>{s((F)=>({stats:F.stats.map((W)=>W.id===p.id?{...W,enabled:D}:W)}))}});let P=!Lt(p)&&p.kind!=="boolean"?`${p.kind} (${p.min}–${p.max})`:p.kind,R=p.scope==="character"?"NPC":p.scope,A=p.calculationMode==="ai_plus_local"?"\uD83D\uDD00 Hybrid":p.calculationMode==="local_formula"||Boolean(p.formula?.trim())&&p.calculationMode!=="ai"?"⚡ Local":"\uD83E\uDD16 AI";C.append(l,e("strong","",`${p.icon} ${p.label}`),e("span","ls-chip",`${R} · ${P}`),e("span",`ls-chip ${A!=="\uD83E\uDD16 AI"?"ls-chip-accent":""}`,A),...p.promptTriggerMode==="conditional"?[e("span","ls-chip","\uD83D\uDD0D Conditional")]:[],...p.pinnedToHeader?[e("span","ls-chip ls-chip-accent","Pinned")]:[],...p.locked?[e("span","ls-chip","\uD83D\uDD12")]:[]);let E=e("div","ls-row");return E.style.flex="none",E.append(B("Full Edit",()=>Ce(t,p.scope,p),"ls-btn-sm"),Q("trash",()=>{s((D)=>({stats:D.stats.filter((F)=>F.id!==p.id)}),`Deleted stat "${p.label}"`),t.notify(`Deleted "${p.icon} ${p.label}".`)},{className:"ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger",title:`Delete "${p.label}"`}),Q("more",async(D)=>{if(typeof t.ctx.ui?.showContextMenu!=="function"){Ce(t,p.scope,p);return}let{selectedKey:F}=await t.ctx.ui.showContextMenu({position:{x:D.clientX,y:D.clientY},items:[{key:"edit",label:"Full Edit (Style, Tabs & AI Prompt)"},{key:"pin",label:p.pinnedToHeader?"Unpin from Pill":"Pin to Scene Pill",active:p.pinnedToHeader},{key:"lock",label:p.locked?"Unlock Value":"Lock Value",active:p.locked},{key:"duplicate",label:"Duplicate to Another Scope / Tab…"},{key:"test",label:"Test in AI Sandbox"},{key:"div",label:"",type:"divider"},{key:"delete",label:"Delete Stat",danger:!0}]});if(F==="edit")Ce(t,p.scope,p);else if(F==="pin")s((W)=>({stats:W.stats.map((V)=>V.id===p.id?{...V,pinnedToHeader:!V.pinnedToHeader,showIn:{...V.showIn,pinnedHeader:!V.pinnedToHeader}}:V)}));else if(F==="lock")s((W)=>({stats:W.stats.map((V)=>V.id===p.id?{...V,locked:!V.locked}:V)}));else if(F==="duplicate")We(t,p);else if(F==="test")Ze(t,p.id);else if(F==="delete")s((W)=>({stats:W.stats.filter((V)=>V.id!==p.id)}))},{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:"More actions"})),h.append(C,E),h},v=[...a.categories??[]].sort((p,h)=>p.order-h.order),x=new Set(v.map((p)=>p.id)),_=a.stats.filter((p)=>{if(de==="dossier"||de==="builtin")return!1;if(de==="character"&&p.scope!=="character")return!1;if(de==="player"&&p.scope!=="player")return!1;if(de==="scene_world"&&p.scope!=="world"&&p.scope!=="scene")return!1;return N(`${p.label} ${p.id} ${p.kind} ${p.triggerCues}`)});if(de==="categories"&&v.length===0){let p=e("section","ls-card");p.append(e("strong","","No custom categories created yet"),e("p","ls-muted","Group related stats (e.g. Combat & Power, Romance, Finances) to attach shared AI delta rules, group keyword triggers, or cross-stat local modifiers—while keeping each stat’s own rules intact."),B("+ Create First Category",()=>rn(t),"ls-btn-sm ls-btn-primary")),S.append(p)}for(let p of v){let h=_.filter((A)=>A.categoryId===p.id);if(de!=="categories"&&h.length===0&&T)continue;if(de!=="all"&&de!=="categories"&&h.length===0)continue;let C=e("section","ls-card ls-cat-group");C.style.borderLeft=`3px solid ${p.color||"var(--ls-primary)"}`;let l=e("div","ls-row-between"),w=e("div","ls-row"),P=e("div");me(t,n,P,{checked:p.enabled,ariaLabel:`Toggle category ${p.name}`,onChange:(A)=>{s((E)=>({categories:(E.categories??[]).map((D)=>D.id===p.id?{...D,enabled:A}:D)}))}}),w.append(P,e("strong","",`${p.icon} ${p.name}`),e("span","ls-chip",`${h.length} stats`),...p.aiRule?[e("span","ls-chip ls-chip-accent","Shared Rule")]:[],...p.localRuleFormula?[e("span","ls-chip ls-chip-accent","⚡ Local Rule")]:[],...p.promptTriggerMode==="conditional"?[e("span","ls-chip","\uD83D\uDD0D Conditional")]:[]);let R=e("div","ls-row");if(R.append(B("Edit Group & Rules",()=>rn(t,p),"ls-btn-sm")),l.append(w,R),C.append(l),h.length>0){let A=e("div");C.append(A);let E=fe(t,n,A,{title:`Member Stats (${h.length})`,defaultExpanded:!p.collapsedByDefault,persistKey:`studio_cat_${p.id}`});for(let D of h)E.append(I(D))}else C.append(e("small","ls-muted",'No stats assigned to this category yet. Click "Edit Group & Rules" to assign stats.'));S.append(C)}let k=_.filter((p)=>!p.categoryId||!x.has(p.categoryId));if(k.length>0&&de!=="categories"){let p=e("section","ls-card"),h=e("div","ls-row-between");h.append(e("h3","",v.length>0?`Uncategorized Stats (${k.length})`:`Stats & Meters (${k.length})`),e("span","ls-muted","Click Full Edit to customize prompt, category, style & formula")),p.append(h);for(let C of k)p.append(I(C));S.append(p)}let y=cs.filter((p)=>Boolean(a.coreTrackers?.overrides?.[p.id]?.deleted)).length,u=cs.filter((p)=>{if(de==="dossier")return!1;if(de!=="all"&&de!=="builtin"&&p.group!==de)return!1;let h=He(a.coreTrackers,p.id);if(h.deleted)return!1;return N(`${p.id} ${h.label} ${h.instruction}`)});if(u.length>0||y>0&&(de==="all"||de==="builtin")){let p=e("section","ls-card"),h=e("div","ls-row-between"),C=e("div","ls-row");if(y>0)C.append(B(`↺ Restore Deleted (${y})`,()=>{s((P)=>{let R={...P.coreTrackers?.overrides??{}};for(let A of Object.keys(R))if(R[A]?.deleted)R[A]={...R[A],deleted:!1};return{coreTrackers:{...P.coreTrackers??{},overrides:R}}},"Restored deleted built-in trackers")},"ls-btn-sm ls-btn-ghost"));else C.append(e("span","ls-muted","Editable labels, prompts, styles & tabs"));h.append(e("h3","",`Built-In Story Trackers (${u.length})`),C),p.append(h);let l={player_attire:"trackPlayerAttire",player_condition:"trackPlayerCondition",player_action:"trackPlayerAction",scene_summary:"trackSceneSummary",places:"trackPlaces",quests:"trackQuests",dispatches:"trackDispatches",npc_conditions:"trackNpcConditions",npc_secrets:"trackNpcSecrets"},w={player_attire:"showPlayerAttireCard",player_condition:"showPlayerConditionCard",player_action:"showPlayerActionCard",scene_summary:"showSceneSummaryInWidget",quests:"showQuestsInWidget",dispatches:"showDispatchesInWidget"};for(let P of u){let R=He(a.coreTrackers,P.id),A=e("div","ls-stat-row-compact");A.style.borderLeft=`3px solid ${R.color||"var(--ls-primary)"}`;let E=e("div","ls-row"),D=e("div");me(t,n,D,{checked:R.enabled,ariaLabel:`Toggle ${R.label}`,onChange:(W)=>{s((V)=>{let O={...V.coreTrackers??{}};return O[l[P.id]]=W,{coreTrackers:O}})}}),E.append(D,e("strong","",`${R.icon||"\uD83D\uDCCA"} ${R.label}`),e("span","ls-chip","Built-In"),...R.locked?[e("span","ls-chip","\uD83D\uDD12")]:[]);let F=e("div","ls-row");F.append(B("Full Edit",()=>Qt(t,P.id),"ls-btn-sm"),Q("trash",()=>{s((W)=>{let V={...W.coreTrackers??{}};V[l[P.id]]=!1;let O=w[P.id];if(O)V[O]=!1;let H=V.overrides??{};return V.overrides={...H,[P.id]:{...H[P.id]??{},deleted:!0}},{coreTrackers:V}},`Deleted built-in tracker "${R.label}"`),t.notify(`Removed "${R.label}".`)},{className:"ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger",title:`Remove "${R.label}"`})),A.append(E,F),p.append(A)}S.append(p)}let g=a.dossierFields.filter((p)=>{if(de!=="all"&&de!=="dossier"&&de!=="character")return!1;return N(`${p.label} ${p.id} ${p.instruction}`)});if(g.length>0||de==="dossier"){let p=e("section","ls-card"),h=e("div","ls-row-between");h.append(e("h3","",`Character Dossier Fields (${g.length})`),e("div","ls-row")),h.lastElementChild.append(B("Restore Defaults",()=>{s({dossierFields:ot()},"Restored default dossier fields")},"ls-btn-sm ls-btn-ghost"),Q("plus",()=>Qe(t),{label:"New Field",className:"ls-btn-sm ls-btn-primary"})),p.append(h);for(let C of g){let l=e("div","ls-stat-row-compact");l.style.borderLeft=`3px solid ${C.color||"var(--ls-primary)"}`;let w=e("div","ls-row"),P=e("div");me(t,n,P,{checked:C.enabled,ariaLabel:`Toggle ${C.label}`,onChange:(A)=>{s((E)=>({dossierFields:E.dossierFields.map((D)=>D.id===C.id?{...D,enabled:A}:D)}))}}),w.append(P,e("strong","",`${C.icon} ${C.label}`),e("span","ls-chip",`Dossier · ${C.displayStyle||"card"}`));let R=e("div","ls-row");R.append(B("Full Edit",()=>Qe(t,C),"ls-btn-sm"),Q("trash",()=>{s((A)=>({dossierFields:A.dossierFields.filter((E)=>E.id!==C.id)}))},{className:"ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger",title:"Delete field"})),l.append(w,R),p.append(l)}S.append(p)}};return o.addEventListener("input",()=>{jn=o.value,L()}),L(),r}var Nt="tabs";function ps(t,n,a,s,i){let r=e("div","ls-stack"),d=e("div","ls-subnav-pills");for(let[o,c]of[["tabs","1. Widget & Inline Tabs"],["dossier","2. Dossier Tabs"],["matrix","3. Stat Placement Matrix"],["banners","4. Scene Pill & Custom HTML"]]){let f=B(c,()=>{Nt=o,i()},"ls-btn-sm");if(Nt===o)f.setAttribute("aria-current","page");d.append(f)}if(r.append(d),Nt==="tabs"){let o=e("section","ls-card");o.append(e("h3","","Relationship Web & Peer Bonds"));let c=e("div","ls-grid");for(let[b,M]of[["showRelationshipWeb","Enable Relationship Web Tab"],["trackNpcBonds","Track NPC↔NPC Peer Bonds"]]){let m=e("div");xe(t,n,m,{checked:a.surfaces[b]!==!1,label:M,onChange:(S)=>s((L)=>({surfaces:{...L.surfaces,[b]:S}}))}),c.append(m)}o.append(c),r.append(o);let f=(b,M,m)=>{let S=e("section","ls-card");S.append(e("h3","",b));let L=[...m].sort((x,_)=>x.order-_.order),T=(x)=>{s((_)=>{let k=[..._.surfaces[M]].sort((y,u)=>y.order-u.order);return{surfaces:{..._.surfaces,[M]:x(k)}}})};L.forEach((x,_)=>{let k=e("div","ls-stat-row-compact"),y=e("div","ls-row"),u=e("div");me(t,n,u,{checked:x.enabled,ariaLabel:`Toggle ${x.label}`,onChange:(l)=>{T((w)=>w.map((P)=>P.id===x.id?{...P,enabled:l}:P))}});let g=e("input","ls-input");g.style.cssText="width:44px;min-height:28px;padding:2px 6px;",g.value=x.icon,g.addEventListener("change",()=>{let l=g.value.trim()||"\uD83D\uDCCA";T((w)=>w.map((P)=>P.id===x.id?{...P,icon:l}:P))});let p=e("input","ls-input");p.style.cssText="width:130px;min-height:28px;padding:2px 8px;",p.value=x.label,p.addEventListener("change",()=>{let l=p.value.trim()||x.label;T((w)=>w.map((P)=>P.id===x.id?{...P,label:l}:P))});let h=e("div");J(t,n,h,{value:x.kind,compact:!0,ariaLabel:"Surface Tab Kind",options:[{value:"stats",label:"Stats Grid"},{value:"cast",label:"Cast List"},{value:"web",label:"Bond Web"},{value:"map",label:"Spatial Atlas"},{value:"world",label:"World & Clocks"},{value:"custom",label:"Custom Tab"}],onChange:(l)=>{T((w)=>w.map((P)=>P.id===x.id?{...P,kind:l}:P))}}),y.append(u,g,p,h);let C=e("div","ls-row");if(_>0)C.append(B("↑",()=>{T((l)=>{let w=l.findIndex((R)=>R.id===x.id);if(w<=0)return l;let P=[...l];return[P[w-1],P[w]]=[P[w],P[w-1]],P.map((R,A)=>({...R,order:A}))})},"ls-btn-sm ls-btn-icon ls-btn-ghost"));if(_<L.length-1)C.append(B("↓",()=>{T((l)=>{let w=l.findIndex((R)=>R.id===x.id);if(w<0||w>=l.length-1)return l;let P=[...l];return[P[w],P[w+1]]=[P[w+1],P[w]],P.map((R,A)=>({...R,order:A}))})},"ls-btn-sm ls-btn-icon ls-btn-ghost"));if(L.length>1)C.append(Q("trash",()=>T((l)=>l.filter((w)=>w.id!==x.id)),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger",title:"Delete tab"}));k.append(y,C),S.append(k)});let N=e("div","ls-row"),I=e("input","ls-input");I.style.width="50px",I.value="✨";let v=e("input","ls-input");return v.style.flex="1",v.placeholder="New tab name (e.g. Gear, Plans, Clues)…",N.append(I,v,Q("plus",()=>{let x=v.value.trim();if(!x)return;let _=I.value.trim()||"✨";T((k)=>[...k,{id:ie(x,`tab_${k.length+1}`),label:x,icon:_,kind:"custom",enabled:!0,order:k.length}])},{label:"Add Tab",className:"ls-btn-sm ls-btn-primary"})),S.append(N),S};r.append(f("Floating HUD Widget Tabs","widgetTabs",a.surfaces.widgetTabs),f("Inline Message Ribbon Tabs","inlineTabs",a.surfaces.inlineTabs))}else if(Nt==="dossier"){let o=e("section","ls-card");o.append(e("h3","","Character Dossier Tabs"));let c=[...a.surfaces.dossierTabs].sort((m,S)=>m.order-S.order);c.forEach((m,S)=>{let L=e("div","ls-stat-cell"),T=e("div","ls-row-between"),N=e("div","ls-row"),I=(u)=>{s((g)=>{let p=[...g.surfaces.dossierTabs].sort((h,C)=>h.order-C.order);return{surfaces:{...g.surfaces,dossierTabs:u(p)}}})},v=e("div");me(t,n,v,{checked:m.enabled,onChange:(u)=>{I((g)=>g.map((p)=>p.id===m.id?{...p,enabled:u}:p))}});let x=e("input","ls-input");x.style.cssText="width:44px;min-height:28px;padding:2px 6px;",x.value=m.icon,x.addEventListener("change",()=>{let u=x.value.trim()||"\uD83E\uDEAA";I((g)=>g.map((p)=>p.id===m.id?{...p,icon:u}:p))});let _=e("input","ls-input");_.style.cssText="width:150px;min-height:28px;padding:2px 8px;",_.value=m.label,_.addEventListener("change",()=>{let u=_.value.trim()||m.label;I((g)=>g.map((p)=>p.id===m.id?{...p,label:u}:p))}),N.append(v,x,_);let k=e("div","ls-row");if(S>0)k.append(B("↑",()=>{I((u)=>{let g=u.findIndex((h)=>h.id===m.id);if(g<=0)return u;let p=[...u];return[p[g-1],p[g]]=[p[g],p[g-1]],p.map((h,C)=>({...h,order:C}))})},"ls-btn-sm ls-btn-icon ls-btn-ghost"));if(S<c.length-1)k.append(B("↓",()=>{I((u)=>{let g=u.findIndex((h)=>h.id===m.id);if(g<0||g>=u.length-1)return u;let p=[...u];return[p[g],p[g+1]]=[p[g+1],p[g]],p.map((h,C)=>({...h,order:C}))})},"ls-btn-sm ls-btn-icon ls-btn-ghost"));if(c.length>1)k.append(Q("trash",()=>I((u)=>u.filter((g)=>g.id!==m.id)),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger",title:"Delete dossier tab"}));T.append(N,k),L.append(T);let y=e("div","ls-row");for(let[u,g]of[["showMeters","Meters"],["showNpcBonds","Peer Bonds"],["showFields","Fields"],["showSecrets","Secrets"],["showAudit","Audit Log"]]){let p=e("div");xe(t,n,p,{checked:Boolean(m[u]),label:g,onChange:(h)=>{I((C)=>C.map((l)=>l.id===m.id?{...l,[u]:h}:l))}}),y.append(p)}L.append(y),o.append(L)});let f=e("div","ls-row"),b=e("input","ls-input");b.style.width="50px",b.value="⚔️";let M=e("input","ls-input");M.style.flex="1",M.placeholder="New Dossier Tab (e.g. Combat Arts, Wardrobe)…",f.append(b,M,Q("plus",()=>{let m=M.value.trim();if(!m)return;let S=b.value.trim()||"✨";s((L)=>{let T=[...L.surfaces.dossierTabs].sort((I,v)=>I.order-v.order),N={id:ie(m,`dtab_${T.length+1}`),label:m,icon:S,kind:"custom",enabled:!0,order:T.length,showMeters:!0,showFields:!0,showSecrets:!1,showAudit:!1,showNpcBonds:!1};return{surfaces:{...L.surfaces,dossierTabs:[...T,N]}}})},{label:"Add Dossier Tab",className:"ls-btn-sm ls-btn-primary"})),o.append(f),r.append(o)}else if(Nt==="matrix"){let o=e("section","ls-card");o.append(e("h3","","Stat Placement Matrix"),e("p","ls-muted","Choose which surfaces and tabs display each stat."));let c=[...a.surfaces.dossierTabs].sort((f,b)=>f.order-b.order);for(let f of a.stats){let b=e("div","ls-stat-cell"),M=e("div","ls-row-between"),m=e("div","ls-row");m.append(Q("copy",()=>We(t,f),{label:"Duplicate",className:"ls-btn-sm ls-btn-ghost"}),Q("edit",()=>Ce(t,f.scope,f),{label:"Edit",className:"ls-btn-sm"})),M.append(e("strong","",`${f.icon} ${f.label} (${f.scope})`),m),b.append(M);let S=e("div","ls-row");for(let[I,v]of[["widget","Widget"],["inline","Inline"],["dossier","Dossier"],["pinnedHeader","Pill"]]){let x=e("div");xe(t,n,x,{checked:Boolean(f.showIn?.[I]),label:v,onChange:(_)=>{s((k)=>({stats:k.stats.map((y)=>y.id===f.id?{...y,showIn:{...y.showIn,[I]:_},...I==="pinnedHeader"?{pinnedToHeader:_}:{}}:y)}))}}),S.append(x)}let L=e("div");J(t,n,L,{value:f.widgetTabId||(f.scope==="character"?"cast":"stats"),compact:!0,ariaLabel:"Widget Tab",options:a.surfaces.widgetTabs.map((I)=>({value:I.id,label:`Widget: ${I.label}`})),onChange:(I)=>{s((v)=>({stats:v.stats.map((x)=>x.id===f.id?{...x,widgetTabId:I}:x)}))}});let T=e("div");J(t,n,T,{value:f.inlineTabId||(f.scope==="character"?"cast":"stats"),compact:!0,ariaLabel:"Inline Tab",options:a.surfaces.inlineTabs.map((I)=>({value:I.id,label:`Inline: ${I.label}`})),onChange:(I)=>{s((v)=>({stats:v.stats.map((x)=>x.id===f.id?{...x,inlineTabId:I}:x)}))}});let N=e("div");J(t,n,N,{value:f.dossierTabId||"bonds",compact:!0,ariaLabel:"Dossier Tab",options:c.map((I)=>({value:I.id,label:`Dossier: ${I.label}`})),onChange:(I)=>{s((v)=>({stats:v.stats.map((x)=>x.id===f.id?{...x,dossierTabId:I}:x)}))}}),S.append(L,T,N),b.append(S),o.append(b)}r.append(o)}else{let o=e("section","ls-card"),c=e("div","ls-row-between");c.append(e("h3","","Scene Pill Chips & Custom HTML Banners"),B("Edit Scene Pill Prompts",()=>Ae(t),"ls-btn-sm ls-btn-primary")),o.append(c,e("p","ls-muted","Custom banners support {{location}}, {{time}}, {{date}}, {{weather}}, {{player_attire}}, {{name}}, and {{stat:id}}."));let f=e("div","ls-grid");for(let[S,L]of[["time","Time Chip"],["date","Date Chip"],["location","Location Chip"],["weather","Weather Chip"],["cast","Present Cast Chips"],["pinnedStats","Pinned Stat Chips"]]){let T=e("div");xe(t,n,T,{checked:a.theme.showSceneChips[S],label:L,onChange:(N)=>{s((I)=>({theme:{...I.theme,showSceneChips:{...I.theme.showSceneChips,[S]:N}}}))}}),f.append(T)}o.append(f);let b=e("textarea","ls-input");b.rows=2,b.placeholder="Custom Widget HTML Banner…",b.value=a.surfaces.customWidgetHtml||"";let M=e("textarea","ls-input");M.rows=2,M.placeholder="Custom Inline Ribbon HTML Banner…",M.value=a.surfaces.customInlineHtml||"";let m=e("textarea","ls-input");m.rows=2,m.placeholder="Custom Character Dossier HTML Banner…",m.value=a.surfaces.customDossierHtml||"",o.append(b,M,m,B("Apply Custom HTML Banners",()=>{s((S)=>({surfaces:{...S.surfaces,customWidgetHtml:b.value.trim(),customInlineHtml:M.value.trim(),customDossierHtml:m.value.trim()}}))},"ls-btn-sm ls-btn-primary")),r.append(o)}return r}function us(t,n,a,s,i,r){let{state:d}=t.snapshot,o=e("div","ls-stack"),c=t.customTemplates.filter((A)=>!t.builtinTemplates.some((E)=>E.id===A.id)),f=c.length+t.builtinTemplates.length,b=e("section","ls-card"),M=e("div","ls-row-between"),m=e("div");m.append(e("span","ls-kicker","Template Gallery"),e("h3","",`Saved & Built-In Templates (${f})`));let S=e("div","ls-row");S.append(Q("plus",()=>Tt(t,r),{label:"New Template",className:"ls-btn-sm ls-btn-primary"}),B("Import .json",()=>{t.ctx.uploads.pickFile({accept:[".json","application/json"],multiple:!1,maxSizeBytes:2500000}).then(async(A)=>{let E=A[0];if(!E)return;let D=new TextDecoder().decode(E.bytes);await t.request("template:importJson",{json:D}),t.notify(`Imported & activated template from ${E.name}.`)}).catch((A)=>t.notify(A instanceof Error?A.message:String(A),!0))},"ls-btn-sm")),M.append(m,S),b.append(M);let L=(A,E)=>{let D=A.id===a.id,F=e("div","ls-preset-card");F.dataset.active=String(D);let W=e("div","ls-stack");W.style.gap="5px";let V=e("div","ls-row-between");V.append(e("strong","",`${A.icon} ${A.name}`),e("span",`ls-chip ${E?"ls-chip-accent":""}`,E?"Saved Custom":"Built-In"));let O=e("div","ls-row"),H=A.stats.filter((j)=>j.scope==="character").length,U=A.stats.filter((j)=>j.scope!=="character").length;O.append(e("span","ls-chip",`${H} NPC meters`),e("span","ls-chip",`${U} stats`)),W.append(V,e("p","ls-muted",A.description),O);let z=e("div","ls-row");if(D)z.append(e("span","ls-chip ls-chip-accent","✓ Active"));else{let j=B("Activate",()=>{j.disabled=!0,j.textContent="Applying…",t.request("template:apply",{templateId:A.id,template:A}).then(()=>{t.notify(`Activated "${A.name}"!`)}).catch((K)=>{if(t.notify(K instanceof Error?K.message:String(K),!0),j.isConnected)j.disabled=!1,j.textContent="Activate"})},"ls-btn-sm ls-btn-primary");z.append(j)}if(z.append(Q("copy",()=>i(A),{label:"Copy & Edit",className:"ls-btn-sm",title:"Create an editable copy of this template"})),E)z.append(Q("trash",()=>{t.modals.confirm({title:"Delete Saved Template?",message:`Remove "${A.name}" from your Template Library?`,confirmLabel:"Delete",variant:"danger"}).then((j)=>{if(!j)return;t.request("template:deleteFromLibrary",{templateId:A.id}).then(()=>t.notify(`Deleted "${A.name}" from library.`)).catch((K)=>t.notify(K instanceof Error?K.message:String(K),!0))})},{className:"ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger",title:"Delete from library"}));return F.append(W,z),F};if(b.append(e("span","ls-kicker",`Saved Custom Templates (${c.length})`)),c.length>0){let A=e("div","ls-grid");for(let E of c)A.append(L(E,!0));b.append(A)}else b.append(e("p","ls-muted",'No saved custom templates yet. Click "+ New Template", "Save to Library", or "Copy & Edit" on any preset below.'));b.append(e("span","ls-kicker",`Built-In Presets (${t.builtinTemplates.length})`));let T=e("div","ls-grid");for(let A of t.builtinTemplates)T.append(L(A,!1));b.append(T),o.append(b);let N=e("section","ls-card");N.append(e("span","ls-kicker","Display & Prompt Placement"),e("h3","","Where Lumi Stats Appears"));let I=e("div","ls-row");for(let[A,E]of[["both_bottom","HUD + Below Reply"],["both_top","HUD + Above Reply"],["inline_bottom","Below Reply Only"],["floating_only","Floating HUD Only"]]){let D=B(E,()=>{s({theme:{...t.snapshot.template.theme,placement:A}})},"ls-btn-sm");if(a.theme.placement===A)D.setAttribute("aria-current","page");I.append(D)}N.append(I);let v=e("div","ls-row");v.append(e("small","ls-muted","AI Prompt Injection:"));for(let[A,E]of[["pre_history","Before History"],["in_history","Within History"],["post_history","After History"]]){let D=B(E,()=>{s({promptPosition:A},`Set prompt position to ${A}`)},"ls-btn-sm");if((a.promptPosition||"post_history")===A)D.setAttribute("aria-current","page");v.append(D)}if(a.promptPosition==="in_history"){let A=Math.max(0,Math.round(Number(a.promptDepth??1)||0)),E=e("input","ls-input");E.type="number",E.min="0",E.max="20",E.style.cssText="width:68px;min-height:26px;padding:2px 6px;",E.value=String(A),E.addEventListener("change",()=>{let D=Math.max(0,Math.min(20,Math.round(Number(E.value)||0)));s({promptDepth:D})}),v.append(e("small","ls-muted","Depth:"),E)}N.append(v),o.append(N);let x=e("div");o.append(x);let _=fe(t,n,x,{title:"Appearance, Skins, Frame Shapes & Widget Size",iconName:"palette",defaultExpanded:!1,persistKey:"studio_templates_skin"}),k=e("div","ls-row");k.append(e("small","ls-muted","1-Click Skins:"));for(let A of zt){let E=B(A.name,()=>t.applySkinPack(A),"ls-btn-sm");if((a.theme.surfaceStyle||"glass")===A.surfaceStyle)E.setAttribute("aria-current","page");k.append(E)}k.append(B("Import Skin",()=>{t.ctx.uploads.pickFile({accept:[".json","application/json"],multiple:!1,maxSizeBytes:500000}).then((A)=>{let E=A[0];if(!E)return;let D=JSON.parse(new TextDecoder().decode(E.bytes));t.applySkinPack(D)})},"ls-btn-sm ls-btn-ghost"),B("Export Skin",()=>{let A=ka(a),E=new Blob([JSON.stringify(A,null,2)],{type:"application/json"}),D=URL.createObjectURL(E),F=document.createElement("a");F.href=D,F.download=`${ie(a.name,"lumi_skin")}.lumi-skin.json`,document.body.append(F),F.click(),F.remove(),URL.revokeObjectURL(D)},"ls-btn-sm ls-btn-ghost")),_.append(k);let y=e("div","ls-row-between ls-stat-cell");y.append(e("strong","","Collapsed Pill Skin (10 Designs)"));let u=e("div");u.style.minWidth="230px",y.append(u),J(t,n,u,{value:a.theme.pillStyle||"glass_capsule",ariaLabel:"Collapsed Pill Skin",options:[{value:"glass_capsule",label:"✨ Frosted Split Capsule (Default Best)"},{value:"vn_dialogue_bar",label:"\uD83C\uDFAC VN Cinema Strip"},{value:"rpg_status_bar",label:"⚔️ JRPG Party Status Bar"},{value:"persona_ticker",label:"\uD83C\uDCCF Stylish Pop Ticker"},{value:"cyber_telemetry",label:"\uD83D\uDEF8 Cyber Telemetry"},{value:"minimal_floating",label:"☁️ Minimal Ghost Pill"},{value:"neon_edge",label:"⚡ Neon Glow Rail"},{value:"split_deck",label:"\uD83D\uDDC2️ Dual-Deck Card Pill"},{value:"compact_badge",label:"\uD83D\uDCF1 Micro Compact Badge"},{value:"ledger_strip",label:"\uD83D\uDCDC Editorial Case Strip"}],onChange:(A)=>{s({theme:{...t.snapshot.template.theme,pillStyle:A}})}}),_.append(y);let g=e("div","ls-row");g.append(e("small","ls-muted","Base Surface:"));for(let[A,E]of[["glass","Auto Glass"],["soft","Soft Card"],["sleek","Sleek Dark"],["minimal","Minimal"],["neon","Neon"],["arcane_rpg","Arcane RPG"],["cyber_hud","Cyber HUD"],["persona_pop","Pop Sim"],["cozy_vn","Cozy VN"]]){let D=B(E,()=>{s({theme:{...t.snapshot.template.theme,surfaceStyle:A}})},"ls-btn-sm");if((a.theme.surfaceStyle||"glass")===A)D.setAttribute("aria-current","page");g.append(D)}let p=e("div","ls-row");p.append(e("small","ls-muted","Frame & Bars:"));for(let[A,E]of[["rounded","Rounded"],["chamfered","Angled"],["ornate","Ornate"],["sharp","Sharp"]]){let D=B(E,()=>{s({theme:{...t.snapshot.template.theme,frameShape:A}})},"ls-btn-sm");if((a.theme.frameShape||"rounded")===A)D.setAttribute("aria-current","page");p.append(D)}for(let[A,E]of[["smooth","Gradient Bar"],["segmented","Segmented Bar"],["glow","Neon Glow Bar"]]){let D=B(E,()=>{s({theme:{...t.snapshot.template.theme,meterStyle:A}})},"ls-btn-sm");if((a.theme.meterStyle||"smooth")===A)D.setAttribute("aria-current","page");p.append(D)}let h=e("div","ls-row");h.append(e("small","ls-muted","Accent Color:"));for(let[A,E]of[[void 0,"Theme Default"],[198,"Cyan"],[330,"Rose"],[38,"Gold"],[158,"Emerald"],[262,"Violet"],[350,"Crimson"]]){let D=B(E,()=>{s({theme:{...t.snapshot.template.theme,accentHue:A}})},"ls-btn-sm");if(a.theme.accentHue===A)D.setAttribute("aria-current","page");h.append(D)}let C=e("div","ls-grid"),l=(A,E,D,F,W)=>{let V=e("label","ls-label",A),O=e("input","ls-input");return O.type="number",O.min=String(D),O.max=String(F),O.value=String(E),O.addEventListener("change",()=>{W(Math.max(D,Math.min(F,Number(O.value)||E)))}),V.append(O),V};C.append(l("Widget Width (px)",a.theme.widgetWidth??460,240,1200,(A)=>{let E=t.snapshot.template.theme;if(s({theme:{...E,widgetWidth:A}}),t.widgetExpanded)t.onResizeWidgetLive?.(A,E.widgetHeight??540,!1)}),l("Widget Height (px)",a.theme.widgetHeight??540,180,900,(A)=>{let E=t.snapshot.template.theme;if(s({theme:{...E,widgetHeight:A}}),t.widgetExpanded)t.onResizeWidgetLive?.(E.widgetWidth??460,A,!1)}),l("Pill Width (px)",a.theme.pillWidth??420,220,960,(A)=>{let E=t.snapshot.template.theme;if(s({theme:{...E,pillWidth:A}}),!t.widgetExpanded)t.onResizeWidgetLive?.(A,E.pillHeight??92,!1)}));let w=e("div","ls-grid");for(let[A,E,D]of[["Frosted Glass Blur",a.theme.glassBlur!==!1,(F)=>s({theme:{...t.snapshot.template.theme,glassBlur:F}})],["Compact Card Density",Boolean(a.theme.compact),(F)=>s({theme:{...t.snapshot.template.theme,compact:F}})],["Expand Inline Ribbon by Default",Boolean(a.theme.inlineDefaultExpanded),(F)=>{t.inlineExpanded=F,s({theme:{...t.snapshot.template.theme,inlineDefaultExpanded:F}})}],["Icon-Only Widget Tabs",Boolean(a.theme.widgetTabsIconOnly),(F)=>s({theme:{...t.snapshot.template.theme,widgetTabsIconOnly:F}})],["All Cast Cards Expanded",(a.theme.castLayout||"roster")==="cards",(F)=>s({theme:{...t.snapshot.template.theme,castLayout:F?"cards":"roster"}})]]){let F=e("div");xe(t,n,F,{checked:E,label:A,onChange:D}),w.append(F)}_.append(g,p,h,C,w);let P=e("div");return o.append(P),fe(t,n,P,{title:"Canon Story Premise (Optional Turn-1 Setup)",iconName:"edit",badge:d.canonPremise?"Set":void 0,defaultExpanded:Boolean(d.canonPremise),persistKey:"studio_templates_premise"}).append(e("p","ls-muted",d.canonPremise||"No custom premise set. Lumi Stats automatically calibrates from your Character Card, Persona, and Opening Message on Turn 1."),B("Open Full-Screen Premise Editor",()=>{t.request("textEditor:open",{title:"Canon Story Premise (Lumi Stats)",value:d.canonPremise||"",placeholder:"Write established relationships, roles, or world rules…"}).then((A)=>{if(!A.cancelled&&typeof A.text==="string")t.request("state:mutate",{stateOverride:{canonPremise:A.text.trim()},reason:"Updated canon premise"})})},"ls-btn-sm ls-btn-primary")),o}var Ee="quickstart",Rt="hud",_e=!1,ve=null,on="",Je=null;function Zs(t,n){let a=t.toLowerCase().replace(/[^a-z0-9_-]+/g,"_")||"lumi_stats_template",s=new Blob([JSON.stringify(n,null,2)],{type:"application/json"}),i=URL.createObjectURL(s),r=document.createElement("a");r.href=i,r.download=`${a}.lumi-stats.json`,document.body.append(r),r.click(),r.remove(),URL.revokeObjectURL(i)}function On(t){if(Je)Je.cleanup(),Je=null;_e=!1,ve=null,on=t.snapshot.template.id,t.request("snapshot:get").catch(()=>{return});let n=new ze;if(typeof t.ctx.ui?.mountApp==="function")try{let a=t.ctx.ui.mountApp({className:"ls-studio-mount",position:"app-overlay"});a.setVisible(!0),Xs(t,a,n);return}catch(a){console.warn("[LumiStats Studio] mountApp error, using modal fallback:",a),n.clear()}Ys(t)}function Xs(t,n,a){console.log("[LumiStats Studio] setupAppOverlay: mounting full-window Studio via mountApp"),t.studioOpen=!0,t.emitChange();let s=()=>{if(!Je)return;_e=!1,ve=null;let f=Je;Je=null,t.activeOverlayCleanup=null,t.studioOpen=!1,t.emitChange(),f.cleanup()},i=(f)=>{if(f.key!=="Escape")return;if(f.defaultPrevented||t.modals.hasOpenModals()||document.body.querySelector('.ls-dd-menu[data-ls-dd-open="true"]'))return;s()};window.addEventListener("keydown",i);let r=(f=!1)=>{$n(n.root,()=>{a.clear();let b=[];n.root.replaceChildren(ms(t,a,s,!0,()=>r(!0),b));for(let M of b)M()},{deferIfTyping:!f,onDeferredFlush:()=>r(!0)})},d=t.subscribe(()=>r(!1)),o=t.subscribeStatus(()=>{let f=n.root.querySelector("[data-ls-studio-status]");if(f)f.textContent=t.statusText,f.style.display=t.statusText?"":"none",f.style.color=t.statusError?"var(--ls-danger)":"var(--ls-muted)"});r(!0),Je={mount:n,cleanup:()=>{window.removeEventListener("keydown",i),d(),o(),a.clear(),n.destroy()}},t.activeOverlayCleanup=s}function Ys(t){t.modals.open({title:"Lumi Stats Studio",width:1360,maxHeight:900},(n,a,s,i)=>{n.style.cssText+=";padding:0;overflow:hidden;display:flex;flex-direction:column;height:85vh;max-height:880px;container-type:inline-size;";let r=(c=!1)=>{$n(n,()=>{i.clear();let f=[];n.replaceChildren(ms(t,i,a,!1,()=>r(!0),f));for(let b of f)b()},{deferIfTyping:!c,onDeferredFlush:()=>r(!0)})};r(!0);let d=t.subscribe(()=>r(!1)),o=t.subscribeStatus(()=>{let c=n.querySelector("[data-ls-studio-status]");if(c)c.textContent=t.statusText,c.style.display=t.statusText?"":"none",c.style.color=t.statusError?"var(--ls-danger)":"var(--ls-muted)"});s.onDismiss(()=>{_e=!1,ve=null,d(),o()})})}function ms(t,n,a,s,i,r=[]){let{template:d}=t.snapshot,o=structuredClone(d);if(on!==o.id)on=o.id,_e=!1,ve=null;let c=t.builtinTemplates.some((p)=>p.id===o.id),f=(p,h="Updated template")=>{let C=structuredClone(t.snapshot.template),l=typeof p==="function"?p(C):p,w={...l,...l.theme?{theme:{...C.theme,...l.theme}}:{},...l.surfaces?{surfaces:{...C.surfaces,...l.surfaces}}:{}};t.request("state:mutate",{templatePatch:w,reason:h}).catch((P)=>t.notify(P instanceof Error?P.message:String(P),!0))},b=(p,h)=>{let C=h?.trim()||`${p.name} (Custom)`;t.request("template:duplicate",{sourceTemplateId:p.id,template:p,name:C,icon:p.icon,description:p.description}).then((l)=>{let w=l.template??t.snapshot.template;on=w.id,_e=!0,ve={icon:w.icon,name:w.name,description:w.description},t.notify(`Created & activated editable copy "${w.name}"!`),i()}).catch((l)=>t.notify(l instanceof Error?l.message:String(l),!0))},M=e("div",s?"ls-studio-overlay":"ls-studio-overlay ls-studio-in-modal");t.stampThemeOnElement(M);let m=e("header","ls-studio-topbar"),S=e("div","ls-row");S.append(e("span","ls-brand-mark","L"),e("strong","","Lumi Stats Studio"),e("span","ls-chip ls-chip-accent",`${o.icon} ${o.name}`),e("span","ls-chip",c?"Built-In":"Custom"));let L=e("span","ls-chip",t.statusText);if(L.setAttribute("data-ls-studio-status","true"),!t.statusText)L.style.display="none";if(t.statusError)L.style.color="var(--ls-danger)";let T=e("div","ls-row");T.append(L,Q("plus",()=>Tt(t,i),{label:"New",className:"ls-btn-sm",title:"Create a new template"}),B("Save to Library",()=>{let p=t.snapshot.template;t.request("template:saveToLibrary",{name:p.name,icon:p.icon,description:p.description}).then(()=>t.notify(`Saved "${p.name}" to your Template Library.`)).catch((h)=>t.notify(h instanceof Error?h.message:String(h),!0))},"ls-btn-sm ls-btn-primary"),B("Export",()=>Zs(o.name,o),"ls-btn-sm"),Q("close",a,{label:"Close",className:"ls-btn-sm ls-btn-danger",title:"Close Studio (Esc)"})),m.append(S,T),M.append(m);let N=e("div","ls-studio-workspace"),I=e("nav","ls-studio-sidebar"),v=[{id:"quickstart",title:"1. Templates & Look",sub:"Presets, placement & skin"},{id:"stats",title:"2. Stats & Built-Ins",sub:"Meters, Scene Pill & prompts"},{id:"extreme",title:"3. Tabs & Surfaces",sub:"HUD, Inline & Dossier layout"},{id:"stage_assets",title:"4. Stage Sprites",sub:"Sprites & time backdrops"},{id:"prose",title:"5. Prose & Cipher",sub:"Braille cleaner & word cipher"},{id:"engine",title:"6. AI & Connections",sub:"Models, Cortex & debug"}];for(let p of v){let h=e("button","ls-studio-nav-btn");if(h.type="button",Ee===p.id)h.setAttribute("aria-current","page");h.append(e("span","ls-studio-nav-title",p.title),e("span","ls-studio-nav-sub",p.sub)),h.addEventListener("click",()=>{Ee=p.id,i()}),I.append(h)}N.append(I);let x=e("main","ls-studio-pane");if(Ee==="quickstart"||Ee==="stats"||Ee==="extreme"){let p=e("section","ls-hero-banner"),h=e("div","ls-row-between"),C=e("div");C.append(e("span","ls-kicker",c?"Built-In Preset":"Custom Saved Template"),e("h2","",`${o.icon} ${o.name}`),e("p","ls-muted",o.description));let l=e("div","ls-row");if(l.append(Q("copy",()=>b(o),{label:"Duplicate & Edit",className:"ls-btn-sm ls-btn-primary"}),Q("edit",()=>{_e=!_e,ve=_e?{icon:o.icon,name:o.name,description:o.description}:null,i()},{label:_e?"Hide Rename":"Rename",className:"ls-btn-sm"})),h.append(C,l),p.append(h),_e){ve??={icon:o.icon,name:o.name,description:o.description};let w=e("div","ls-grid"),P=e("label","ls-label","Icon Emoji"),R=e("input","ls-input");R.value=ve.icon,R.addEventListener("input",()=>{if(ve)ve.icon=R.value}),P.append(R);let A=e("label","ls-label","Template Name"),E=e("input","ls-input");E.value=ve.name,E.addEventListener("input",()=>{if(ve)ve.name=E.value}),A.append(E);let D=e("label","ls-label","Description"),F=e("input","ls-input");F.value=ve.description,F.addEventListener("input",()=>{if(ve)ve.description=F.value}),D.append(F),w.append(P,A,D);let W=B("Save Template Name & Info",()=>{let V=E.value.trim()||o.name,O=R.value.trim()||"✨",H=F.value.trim()||o.description;W.disabled=!0,W.textContent="Saving…",t.request("template:saveToLibrary",{name:V,icon:O,description:H}).then(()=>{_e=!1,ve=null,t.notify(`Saved template "${V}".`),i()}).catch((U)=>{if(t.notify(U instanceof Error?U.message:String(U),!0),W.isConnected)W.disabled=!1,W.textContent="Save Template Name & Info"})},"ls-btn-sm ls-btn-primary");p.append(w,W)}x.append(p)}if(Ee==="quickstart")x.append(us(t,n,o,f,b,i));else if(Ee==="stats")x.append(ds(t,n,o,f,i));else if(Ee==="extreme")x.append(ps(t,n,o,f,i));else if(Ee==="stage_assets")x.append(es(t,i));else if(Ee==="prose")x.append(os(t,n));else if(Ee==="engine")x.append(is(t,n,r));N.append(x);let _=e("aside","ls-studio-preview-pane"),k=e("section","ls-card"),y=e("div","ls-row-between");y.append(e("span","ls-kicker","Live Preview"));let u=e("div","ls-row");for(let[p,h]of[["hud","HUD"],["pill","Pill"],["inline","Inline"],["dossier","Dossier"]]){let C=B(h,()=>{Rt=p,i()},"ls-btn-sm");if(Rt===p)C.setAttribute("aria-current","page");u.append(C)}y.append(u),k.append(y);let g=e("div");if(g.style.marginTop="6px",Rt==="hud")g.style.height="470px",g.append(yt(t,!1,()=>{return},(p)=>Ye(t,p),()=>{return},n));else if(Rt==="pill")g.style.height="104px",g.append(yt(t,!0,()=>{return},(p)=>Ye(t,p),()=>{return},n));else if(Rt==="inline"){let p=t.inlineExpanded;t.inlineExpanded=!0;let h=ns(t,(C)=>Ye(t,C),()=>{return});t.inlineExpanded=p,g.append(h)}else{let p=t.dossierEditMode;t.dossierEditMode=!1;let h=Vn(t,n);t.dossierEditMode=p,g.append(h)}return k.append(g),_.append(k),N.append(_),M.append(N),M}function fs(t,n,a,s){try{let i=new ze,r=n.snapshot.template.theme,d=()=>({w:Math.max(240,Math.min(1200,n.snapshot.template.theme.widgetWidth??460)),h:Math.max(180,Math.min(900,n.snapshot.template.theme.widgetHeight??540))}),o=()=>({w:Math.max(220,Math.min(960,n.snapshot.template.theme.pillWidth??420)),h:Math.max(56,Math.min(220,n.snapshot.template.theme.pillHeight??92))}),c=t.ui.createFloatWidget({width:s?.width??(r.pillWidth??420),height:s?.height??(r.pillHeight??92),chromeless:s?.chromeless??!0,snapToEdge:!0,tooltip:"Lumi Stats HUD",touchScrollMode:"native"});c.root.classList.add("ls-root"),c.root.style.cssText+=";display:flex;flex-direction:column;height:100%;max-height:100%;min-height:0;overflow:hidden;background:transparent;",n.onResizeWidgetLive=(T,N,I)=>{if(c.setSize(T,N),I){let v=n.snapshot.template.theme;n.request("state:mutate",{templatePatch:{theme:n.widgetExpanded?{...v,widgetWidth:T,widgetHeight:N}:{...v,pillWidth:T,pillHeight:N}},reason:`Resized widget to ${T}×${N}`})}};let f=null,b=()=>{if(f)clearTimeout(f),f=null;if(n.widgetExpanded=!n.widgetExpanded,!!n.widgetExpanded){let{w:N,h:I}=d();c.setSize(N,I)}else{let{w:N,h:I}=o();f=setTimeout(()=>{c.setSize(N,I),f=null},180)}m()},M="",m=()=>{i.clear();let T=n.snapshot.template.theme.placement,N=!n.vnStageOpen&&!n.studioOpen&&(T==="floating_only"||T.startsWith("both_"));c.setVisible(N),n.stampThemeOnElement(c.root);let I=yt(n,!n.widgetExpanded,b,(v)=>Ye(n,v),a,i);if(c.root.replaceChildren(I),!n.widgetExpanded&&!f&&N){let v=Boolean(I.querySelector('.ls-hud-pill[data-empty-deck="true"]')),{w:x,h:_}=o(),k=v?Math.min(_,48):_,y=`${x}x${k}`;if(y!==M)M=y,c.setSize(x,k)}else M="";n.applyTemplateThemeToDom()},S=(T)=>{let N=T.detail;if(N?.extensionId&&N.extensionId!=="lumi_stats")return;n.refreshActiveChat(),m()};window.addEventListener("spindle:desktop-widget-returned",S);let L=n.subscribe(m);return m(),()=>{if(window.removeEventListener("spindle:desktop-widget-returned",S),f)clearTimeout(f);n.onResizeWidgetLive=null,L(),i.clear(),c.destroy()}}catch{return}}function Ei(t,n){t.deferReady?.();let a=[];a.push(Na(t));let s=new Ln(t);a.push(()=>s.destroy());let i=fs(t,s,()=>On(s),n);if(i)a.push(i);return a.push(t.events.on("CHAT_SWITCHED",(r)=>{let d=r&&typeof r==="object"?r:{},o=typeof d.chatId==="string"?d.chatId:null;s.refreshActiveChat(o)})),s.refreshActiveChat(),t.ready?.(),()=>{for(let r of a.reverse())r();t.dom.cleanup()}}export{Ei as setupWidget};
