function wn(t){let n=t.name.trim().slice(0,80)||"Custom Group";return{id:le(t.id??n,"cat"),name:n,icon:t.icon?.trim().slice(0,8)||"\uD83D\uDCC1",color:t.color?.trim()||"var(--lumiverse-primary)",enabled:t.enabled!==!1,collapsedByDefault:Boolean(t.collapsedByDefault),showGroupHeaderInHud:t.showGroupHeaderInHud!==!1,promptTriggerMode:t.promptTriggerMode==="conditional"||t.promptTriggerMode==="manual"?t.promptTriggerMode:"always",...Array.isArray(t.promptKeywords)&&t.promptKeywords.length?{promptKeywords:[...new Set(t.promptKeywords.map((a)=>String(a).trim().toLowerCase()).filter(Boolean))].slice(0,32)}:{},...t.aiRule?.trim()?{aiRule:t.aiRule.trim()}:{},...t.localRuleFormula?.trim()?{localRuleFormula:t.localRuleFormula.trim()}:{},injectInContinuity:t.injectInContinuity!==!1,order:Number.isFinite(t.order)?Math.round(Number(t.order)):0}}function le(t,n="stat"){return String(t??"").trim().toLowerCase().replace(/['’]/g,"").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,64)||n}function xs(t,n,s){let a=n-t;if(a<=0)return[{value:t,label:"Baseline",description:"Default baseline"}];let i=(r)=>Math.round(t+a*r);return[{value:i(0.85),label:"Very High / Peak",description:"Dominant, intense, or near maximum capacity"},{value:i(0.65),label:"High / Strong",description:"Clearly elevated, strong, or well-established"},{value:i(0.45),label:"Moderate / Balanced",description:"Standard working baseline or neutral equilibrium"},{value:i(0.2),label:"Low / Guarded",description:"Mild, strained, or subdued"},{value:t,label:"None / Minimal",description:"Absent, calm baseline, or depleted"}]}function re(t){let n=le(t.id??t.label,"stat"),s=t.scope??"character",a=t.displayStyle??"auto",r=a==="pill_list"?"tags":(a==="feed_cards"||a==="step_chain"||a==="quote_callout"||a==="key_value"||a==="arc_tracker"||a==="accordion_cards"||a==="matrix_badges"||a==="meter_mini_bars"||a==="stat_pills_grid"||a==="bullet_ledger"||a==="timeline_list"||a==="checklist")&&(!t.kind||t.kind==="meter")?"text":t.kind??"meter",d=Number.isFinite(t.min)?Number(t.min):0,o=Number.isFinite(t.max)?Number(t.max):r==="clock"?6:r==="pips"||r==="hearts"?5:r==="attributes"?20:r==="currency"?99999999:100,c=t.volatility??(s==="character"?"progressive":"momentary"),f=Array.isArray(t.anchors)?t.anchors:[],y=s==="character"?"cast":s==="world"?"world":"stats",P=Boolean(t.pinnedToHeader??t.showIn?.pinnedHeader),m={widget:t.showIn?.widget??!0,inline:t.showIn?.inline??!0,dossier:t.showIn?.dossier??s==="character",pinnedHeader:P};return{id:n,label:t.label.trim().slice(0,80)||n,icon:t.icon?.trim().slice(0,8)||"\uD83D\uDCCA",scope:s,kind:r,min:Math.min(d,o),max:Math.max(d,o),step:Number.isFinite(t.step)&&Number(t.step)>0?Number(t.step):1,defaultValue:t.defaultValue!==void 0?t.defaultValue:r==="boolean"?!1:r==="skill_tree"?"SP: 2 | Basic Focus (Lv.1/5, cost:1, +10% efficiency)":r==="xp_level"?"Lv. 1 | 0/100 XP | Rank E":r==="attributes"?"STR:10, DEX:10, CON:10, INT:10, WIS:10, CHA:10":r==="inventory"?"None":r==="status_fx"?"None":r==="text"||r==="tags"||r==="tier"?t.options?.[0]??"None":Math.max(Math.min(d,o),Math.min(Math.max(d,o),0)),...t.options?.length?{options:t.options}:{},anchors:f,volatility:c,triggerCues:t.triggerCues?.trim()??"",...t.formula?.trim()?{formula:t.formula.trim()}:{},color:t.color?.trim()||"var(--lumiverse-primary)",enabled:t.enabled!==!1,locked:Boolean(t.locked),pinnedToHeader:P,displayStyle:t.displayStyle??"auto",layoutSpan:t.layoutSpan??"auto",showIn:m,tabId:t.tabId?.trim()||y,widgetTabId:t.widgetTabId?.trim()||y,inlineTabId:t.inlineTabId?.trim()||y,dossierTabId:t.dossierTabId?.trim()||"bonds",...Array.isArray(t.extraWidgetTabIds)&&t.extraWidgetTabIds.length?{extraWidgetTabIds:[...new Set(t.extraWidgetTabIds.map(String))]}:{},...Array.isArray(t.extraInlineTabIds)&&t.extraInlineTabIds.length?{extraInlineTabIds:[...new Set(t.extraInlineTabIds.map(String))]}:{},calculationMode:t.calculationMode==="local_formula"||t.calculationMode==="ai_plus_local"||t.calculationMode==="ai"?t.calculationMode:Boolean(t.formula?.trim())?"local_formula":"ai",...t.formulaOutputTemplate?.trim()?{formulaOutputTemplate:t.formulaOutputTemplate.trim()}:{},promptTriggerMode:t.promptTriggerMode==="conditional"||t.promptTriggerMode==="manual"?t.promptTriggerMode:"always",...Array.isArray(t.promptKeywords)&&t.promptKeywords.length?{promptKeywords:[...new Set(t.promptKeywords.map((S)=>String(S).trim().toLowerCase()).filter(Boolean))].slice(0,32)}:{},injectInContinuity:t.injectInContinuity!==!1,...t.categoryId?.trim()?{categoryId:t.categoryId.trim()}:{},...t.alerts?.length?{alerts:t.alerts}:{}}}function ws(){return[{id:"stats",label:"You & Scene",icon:"\uD83D\uDCCA",kind:"stats",enabled:!0,order:0},{id:"cast",label:"Cast",icon:"\uD83D\uDC65",kind:"cast",enabled:!0,order:1},{id:"web",label:"Bond Web",icon:"\uD83D\uDD78️",kind:"web",enabled:!0,order:2},{id:"map",label:"Atlas",icon:"\uD83D\uDDFA️",kind:"map",enabled:!0,order:3},{id:"world",label:"World & Clocks",icon:"\uD83C\uDF0D",kind:"world",enabled:!0,order:4}]}function ya(){return[{id:"stats",label:"Stats",icon:"\uD83D\uDCCA",kind:"stats",enabled:!0,order:0},{id:"cast",label:"Cast",icon:"\uD83D\uDC65",kind:"cast",enabled:!0,order:1},{id:"web",label:"Bond Web",icon:"\uD83D\uDD78️",kind:"web",enabled:!0,order:2},{id:"world",label:"World",icon:"\uD83C\uDF0D",kind:"world",enabled:!0,order:3}]}function xa(){return[{id:"overview",label:"Overview",icon:"✨",kind:"overview",enabled:!0,order:0,showMeters:!0,showFields:!0,showSecrets:!1,showAudit:!1,showNpcBonds:!1},{id:"bonds",label:"Player Bonds",icon:"\uD83D\uDC96",kind:"bonds",enabled:!0,order:1,showMeters:!0,showFields:!1,showSecrets:!1,showAudit:!0,showNpcBonds:!1},{id:"peer_bonds",label:"Peer Bonds (NPC↔NPC)",icon:"\uD83E\uDD1D",kind:"peer_bonds",enabled:!0,order:2,showMeters:!1,showFields:!1,showSecrets:!1,showAudit:!1,showNpcBonds:!0},{id:"loadout",label:"Attire & Loadout",icon:"\uD83D\uDC57",kind:"loadout",enabled:!0,order:3,showMeters:!1,showFields:!0,showSecrets:!1,showAudit:!1,showNpcBonds:!1},{id:"secrets",label:"Secrets & Notes",icon:"\uD83D\uDD75️",kind:"secrets",enabled:!0,order:4,showMeters:!1,showFields:!1,showSecrets:!0,showAudit:!1,showNpcBonds:!1}]}function wa(){return{widgetTabs:ws(),inlineTabs:ya(),dossierTabs:xa(),trackNpcBonds:!0,showRelationshipWeb:!0,customWidgetHtml:"",customInlineHtml:"",customDossierHtml:""}}function rt(){return{trackPlayerAttire:!0,playerAttireLabel:"Your Current Attire / Presentation",playerAttireInstruction:"Update whenever the player character changes clothing, state of dress, or physical presentation.",showPlayerAttireCard:!0,trackPlayerCondition:!0,playerConditionLabel:"Physical / Mental Condition",playerConditionInstruction:"Track physical injuries, fatigue, intoxication, disorientation, or mental state.",showPlayerConditionCard:!0,trackPlayerAction:!1,playerActionLabel:"Latest Notable Action",playerActionInstruction:"Summarize the player character’s most consequential current action.",showPlayerActionCard:!0,trackSceneSummary:!0,sceneSummaryLabel:"Scene Beat Summary",sceneSummaryInstruction:"Concise 1-sentence summary of what just happened in the scene.",showSceneSummaryInWidget:!0,trackScenePresence:!0,scenePresenceLabel:"Present & Away",scenePresenceInstruction:"Format: Present: [List NPCs present in the scene], Away: [List NPCs away/offscreen]. Update EVERY turn whenever anyone enters, leaves, or the scene moves to a new location.",showScenePresenceCard:!0,trackPlaces:!0,placesInstruction:"Extract new or visited locations into zones[] (building/district), places[] (room/spot with tags & brief note), and paths[].",trackQuests:!0,questsInstruction:"Track active story goals, deadlines, and sub-objectives; mark completed when resolved.",showQuestsInWidget:!0,trackDispatches:!0,dispatchesInstruction:"Log brief off-screen developments or upcoming hooks for characters not currently in the room.",showDispatchesInWidget:!0,trackNpcConditions:!0,npcConditionsInstruction:"Track short status tags on NPCs (e.g. Flustered, Armed, Injured, Hurried).",trackNpcSecrets:!0,npcSecretsInstruction:"Record discovered clues, hidden motives, or confirmed secrets per NPC.",sceneLocationInstruction:'Current specific spot and broader area formatted cleanly as "Specific Room/Spot, District/Building".',sceneTimeInstruction:'Current in-story clock time (e.g. "08:15 AM" or story-appropriate time-of-day).',sceneDateInstruction:'Current in-story date, day count, or era label (e.g. "Day 1" or "Oct 14, 2002").',sceneWeatherInstruction:'Concise weather and immediate atmosphere (e.g. "Clear", "Light Rain", "Tense Indoors").',sceneTimeFlowInstruction:'Estimate elapsed minutes ("mins") realistically for the actions in this beat.',scenePillLocked:!1,overrides:{scene_presence:{pinnedToHeader:!0}}}}function St(){return[{id:"role_summary",label:"Role & Bond to Player",icon:"\uD83E\uDEAA",placeholder:"e.g. Loyal personal maid, Childhood rival…",instruction:"Concise role and established relationship to the player.",tabId:"overview",displayStyle:"badge",showInHudCast:!1,showInInlineCast:!1,enabled:!0,locked:!1},{id:"demeanor",label:"Current Demeanor & Mood",icon:"\uD83C\uDFAD",placeholder:"e.g. Flustered, Guarded, Warm…",instruction:"Current emotional demeanor and facial expression in the scene.",tabId:"overview",displayStyle:"badge",showInHudCast:!0,showInInlineCast:!1,enabled:!0,locked:!1},{id:"inner_thought",label:"Inner Monologue",icon:"\uD83D\uDCAD",placeholder:"Unspoken internal thought in this moment…",instruction:"Short first-person unspoken thought or internal reaction to the current beat.",tabId:"overview",displayStyle:"quote",showInHudCast:!0,showInInlineCast:!0,enabled:!0,locked:!1},{id:"immediate_goal",label:"Immediate Goal",icon:"\uD83C\uDFAF",placeholder:"What this character is trying to do right now…",instruction:"Immediate objective or intention in the current scene.",tabId:"overview",displayStyle:"card",showInHudCast:!1,showInInlineCast:!1,enabled:!0,locked:!1},{id:"attire_layers",label:"Current Outfit & Presentation",icon:"\uD83D\uDC57",placeholder:"Observed clothing & state of dress",instruction:"Update whenever clothing, state of undress, or physical presentation is described or changed.",tabId:"loadout",displayStyle:"card",showInHudCast:!0,showInInlineCast:!0,enabled:!0,locked:!1},{id:"carried_items",label:"Carried Items & Props",icon:"\uD83C\uDF92",placeholder:"Items in hand or on person",instruction:"Track notable items, tools, or gifts currently held or worn.",tabId:"loadout",displayStyle:"pills",showInHudCast:!1,showInInlineCast:!1,enabled:!0,locked:!1},{id:"bond_dynamic",label:"Relationship Dynamic",icon:"\uD83D\uDD17",placeholder:"Established dynamic with player",instruction:"Summarize the current interpersonal dynamic and power balance with the player.",tabId:"overview",displayStyle:"card",showInHudCast:!1,showInInlineCast:!1,enabled:!0,locked:!1}]}function ke(){return{schema:"lumi-stats-template/v1",id:"universal_companion",name:"Universal Roleplay Companion",icon:"✨",description:"Schema-driven roleplay stats with two-phase calibration for relationships, momentary situational reactions, and world progression.",promptPosition:"post_history",promptDepth:1,theme:{surfaceStyle:"glass",pillStyle:"glass_capsule",frameShape:"rounded",radiusPreset:"balanced",meterStyle:"smooth",castLayout:"roster",glowIntensity:55,glassBlur:!0,widgetWidth:460,widgetHeight:540,pillWidth:420,pillHeight:92,widgetTabsIconOnly:!1,compact:!1,placement:"both_bottom",inlineDefaultExpanded:!1,showSceneChips:{time:!0,date:!0,location:!0,weather:!0,cast:!0,pinnedStats:!0},customCss:""},tabs:ws(),surfaces:wa(),coreTrackers:rt(),categories:[],stats:[re({id:"composure",label:"Composure",icon:"\uD83E\uDDED",scope:"player",kind:"meter",min:0,max:100,defaultValue:85,volatility:"momentary",pinnedToHeader:!0,triggerCues:"85=poised, 55=masking, 30=flustered, 0=shaken; drops on teasing, undress, or pressure.",anchors:[{value:80,label:"Poised & Collected",description:"Calm, confident, and in control"},{value:55,label:"Steady / Masking",description:"Holding it together despite pressure"},{value:30,label:"Flustered / Rattled",description:"Caught off-guard, blushing, or defensive"},{value:0,label:"Shaken / Overwhelmed",description:"Completely flustered or panicking"}]}),re({id:"trust",label:"Trust",icon:"\uD83D\uDEE1️",scope:"character",kind:"meter",min:0,max:100,defaultValue:45,volatility:"progressive",pinnedToHeader:!0,dossierTabId:"bonds",triggerCues:"Calibrate: hostile=15, stranger=45, ally/family=70, confidant=90; shift on honesty/betrayal.",anchors:[{value:85,label:"Trusted Confidant",description:"Unconditional trust and deep confidence"},{value:65,label:"Open & Relying",description:"Clear trust, family familiarity, or proven ally"},{value:40,label:"Neutral / Polite",description:"Standard baseline for unproven acquaintances"},{value:20,label:"Guarded / Wary",description:"Skeptical, cautious, or holding back"},{value:0,label:"Deeply Distrustful",description:"Expects betrayal or actively hostile"}]}),re({id:"loyalty",label:"Loyalty & Devotion",icon:"⚜️",scope:"character",kind:"meter",min:0,max:100,defaultValue:50,volatility:"anchor",dossierTabId:"bonds",triggerCues:"Calibrate: rival=10, peer=45, family=75, sworn retainer/partner=90; shift on oaths/betrayal.",anchors:[{value:85,label:"Fiercely Loyal",description:"Devoted retainer, sworn protector, or deeply committed partner"},{value:65,label:"Dependable Ally",description:"Supportive family member, friend, or companion"},{value:40,label:"Cooperative",description:"Neutral or professional alignment"},{value:15,label:"Self-Interested",description:"Prioritizes own agenda; easily swayed"},{value:0,label:"Unbound / Opposed",description:"No allegiance or actively opposed"}]}),re({id:"affection",label:"Affection & Fondness",icon:"❤️",scope:"character",kind:"meter",min:0,max:100,defaultValue:45,volatility:"progressive",dossierTabId:"bonds",triggerCues:"Calibrate: cold=15, polite=45, fond friend/family=70, loving=90; shift with warmth/coldness.",anchors:[{value:85,label:"Deeply Devoted",description:"Profound love, adoration, or attachment"},{value:65,label:"Warm & Fond",description:"Genuine care, closeness, and affection"},{value:40,label:"Friendly / Neutral",description:"Amiable or neutral baseline"},{value:20,label:"Cold / Distant",description:"Aloof, irritated, or emotionally detached"},{value:0,label:"Averse / Hostile",description:"Dislike, bitterness, or rejection"}]}),re({id:"desire",label:"Desire & Attraction",icon:"\uD83D\uDD25",scope:"character",kind:"meter",min:0,max:100,defaultValue:0,volatility:"momentary",dossierTabId:"bonds",triggerCues:"0=platonic, 30=sparked, 60=intense, 85=consuming; spikes on allure, undress, touch, flirting.",anchors:[{value:80,label:"Consuming",description:"Overwhelming attraction or longing in the scene"},{value:55,label:"Intense",description:"Strong visible attraction, flustered gaze, or magnetic pull"},{value:25,label:"Sparked / Noticeable",description:"Caught off-guard by appearance, proximity, or suggestive beat"},{value:0,label:"Platonic / Dormant",description:"No active romantic or physical tension"}]}),re({id:"arousal",label:"Arousal & Fluster",icon:"\uD83D\uDC93",scope:"character",kind:"meter",min:0,max:100,defaultValue:0,volatility:"momentary",dossierTabId:"bonds",triggerCues:"0=calm, 25=blushing, 55=heated, 85=breathless; spikes on nudity/towel, skin contact, intimacy.",anchors:[{value:80,label:"Breathless / Peak",description:"Heavily aroused or physically overwhelmed"},{value:50,label:"Heated / Flushed",description:"Visibly flustered, racing pulse, or strong physical reaction"},{value:20,label:"Stirred / Blushing",description:"Initial spike from suggestive visual cue, towel, or close contact"},{value:0,label:"Composed",description:"Calm physiological state"}]}),re({id:"present",label:"Present & Away",icon:"\uD83D\uDC65",scope:"scene",kind:"text",defaultValue:"Present: [], Away: []",volatility:"momentary",pinnedToHeader:!0,triggerCues:"Format: Present: [List NPCs present in the scene], Away: [List NPCs away/offscreen]. Update EVERY turn whenever anyone enters, leaves, or the scene moves to a new location."}),re({id:"world_tension",label:"Scene Tension Clock",icon:"⏱️",scope:"world",kind:"clock",min:0,max:6,defaultValue:0,volatility:"progressive",widgetTabId:"world",inlineTabId:"world",triggerCues:"+1 when suspense, danger, or complications escalate; reduce when resolved."})],dossierFields:St(),updatedAt:new Date().toISOString()}}var Ss=[ke(),{...ke(),id:"romance_slice_of_life",name:"Romance, Chemistry & Wardrobe",icon:"\uD83C\uDF38",description:"Focused on interpersonal chemistry, momentary blush/fluster, desire, devotion, and detailed outfit layers.",theme:{...ke().theme,surfaceStyle:"cozy_vn",pillStyle:"vn_dialogue_bar",accentHue:330,secondaryHue:200},stats:[...ke().stats.filter((t)=>t.id!=="world_tension"),re({id:"chemistry",label:"Spark & Chemistry",icon:"✨",scope:"character",kind:"meter",min:0,max:100,defaultValue:35,color:"#f472b6",volatility:"momentary",pinnedToHeader:!0,dossierTabId:"bonds",triggerCues:"0–100 scale. Rises on playful banter, shared silences, eye contact, and romantic tension; cools on awkwardness."}),re({id:"intimacy_stage",label:"Romantic Tension Clock",icon:"\uD83D\uDC97",scope:"scene",kind:"clock",min:0,max:6,defaultValue:0,color:"#f472b6",volatility:"momentary",widgetTabId:"stats",inlineTabId:"stats",triggerCues:"0–6 segments. Advances as physical proximity, vulnerability, or romantic confession builds in the scene."})]},{...ke(),id:"tactical_adventure",name:"Adventure, Party & World Clocks",icon:"⚔️",description:"Vitality, Resolve, Party Loyalty, Trust, and World Threat Clocks for fantasy or sci-fi campaigns.",stats:[re({id:"vitality",label:"Vitality",icon:"❤️",scope:"player",kind:"meter",min:0,max:100,defaultValue:100,volatility:"momentary",pinnedToHeader:!0,triggerCues:"Drops on injuries, exhaustion, or hazards; restores with medical care or rest."}),re({id:"resolve",label:"Resolve & Energy",icon:"⚡",scope:"player",kind:"meter",min:0,max:100,defaultValue:100,volatility:"momentary",pinnedToHeader:!0,triggerCues:"Spent on strenuous feats, spells, or high-stress confrontations; recovered on rest."}),...ke().stats.filter((t)=>t.scope!=="player")]},{...ke(),id:"mystery_thriller",name:"Investigation & Suspicion Ledger",icon:"\uD83D\uDD75️",description:"Tracks Case Progress, Suspect Alertness, Credibility, Pressure, and discovered clues.",stats:[re({id:"case_progress",label:"Investigation Progress",icon:"\uD83D\uDD0E",scope:"player",kind:"meter",min:0,max:100,defaultValue:0,volatility:"progressive",pinnedToHeader:!0,triggerCues:"Increases as physical clues, motives, and alibi contradictions are uncovered."}),re({id:"suspicion",label:"Suspicion & Guilt",icon:"\uD83D\uDC41️",scope:"character",kind:"meter",min:0,max:100,defaultValue:15,volatility:"progressive",pinnedToHeader:!0,triggerCues:"Calibrate from initial evidence; increase on lies, evasions, or incriminating discoveries."}),re({id:"pressure",label:"Interrogation Pressure",icon:"\uD83D\uDCA2",scope:"character",kind:"clock",min:0,max:6,defaultValue:0,volatility:"momentary",triggerCues:"Advance when cornered with evidence or tough questioning; drops when given breathing room."}),re({id:"alert_clock",label:"Danger / Alert Clock",icon:"\uD83D\uDEA8",scope:"world",kind:"clock",min:0,max:6,defaultValue:0,volatility:"momentary",pinnedToHeader:!0,widgetTabId:"world",inlineTabId:"world",triggerCues:"Advances by +1 when making noise, tipping off suspects, or triggering alarms."})]},{...ke(),id:"litrpg_skill_tree",name:"LitRPG System, Skill Trees & Gear",icon:"⚔️",description:"Full game HUD with HP/MP, XP & Leveling, Skill Points & Interactive Skill Tree, Core Attributes, Buffs/Debuffs, and Rarity Gear.",theme:{...ke().theme,surfaceStyle:"arcane_rpg",frameShape:"ornate",meterStyle:"glow",accentHue:42,secondaryHue:198},stats:[re({id:"hp",label:"Health (HP)",icon:"❤️",scope:"player",kind:"meter",min:0,max:100,defaultValue:100,color:"#f43f5e",volatility:"momentary",pinnedToHeader:!0,triggerCues:"Drops on damage, traps, or exhaustion; recovers via healing, potions, or rest."}),re({id:"mp",label:"Mana / Stamina",icon:"\uD83D\uDCA0",scope:"player",kind:"meter",min:0,max:100,defaultValue:100,color:"#38bdf8",volatility:"momentary",pinnedToHeader:!0,triggerCues:"Spent when casting spells or using active skills; regenerates during recovery."}),re({id:"xp_level",label:"Level & XP",icon:"⭐",scope:"player",kind:"xp_level",defaultValue:"Lv. 1 | 0/100 XP | Rank E",color:"#f59e0b",volatility:"progressive",triggerCues:'Format: "Lv. N | cur/next XP | Rank X". Award XP on victories, discoveries, and milestones; level up when cur >= next.'}),re({id:"gold",label:"Gold Coins",icon:"\uD83E\uDE99",scope:"player",kind:"currency",min:0,max:99999999,defaultValue:100,color:"#f59e0b",volatility:"progressive",triggerCues:"Track player currency/gold. Adjust via +N / -N on purchases, rewards, or loot."}),re({id:"attributes",label:"Core Attributes",icon:"\uD83E\uDDEC",scope:"player",kind:"attributes",min:1,max:30,defaultValue:"STR:10, DEX:10, CON:10, INT:10, WIS:10, CHA:10",color:"#818cf8",layoutSpan:"full",volatility:"anchor",triggerCues:'Comma-separated stats: "STR:N, DEX:N, CON:N, INT:N, WIS:N, CHA:N". Update when training or leveling.'}),re({id:"skill_tree",label:"Skill Tree & SP",icon:"\uD83C\uDF33",scope:"player",kind:"skill_tree",defaultValue:"SP: 2 | Combat Sense (Lv.1/5, cost:1, +10% Eva) ; Arcane Spark (Lv.0/5, cost:1, req:Combat Sense)",color:"#10b981",layoutSpan:"full",volatility:"progressive",triggerCues:'Format: "SP: N | Skill A (Lv.X/Y, cost:1, bonus) ; Skill B (Lv.X/Y, cost:1, req:Skill A)". Grant SP on level-ups or breakthroughs.'}),re({id:"status_fx",label:"Buffs & Debuffs",icon:"⚡",scope:"player",kind:"status_fx",defaultValue:"None",color:"#2dd4bf",layoutSpan:"full",volatility:"momentary",triggerCues:'Prefix buffs with "+" and debuffs with "-" separated by "; ", e.g. "+Barrier (3t) ; -Bleeding (2t)".'}),re({id:"inventory",label:"Gear & Inventory",icon:"\uD83C\uDF92",scope:"player",kind:"inventory",defaultValue:"Traveler Blade [common, equipped] ; Ration x2 [common]",color:"#a78bfa",layoutSpan:"full",volatility:"progressive",triggerCues:'List items separated by "; " with qty & rarity tags, e.g. "Runed Dagger [rare, equipped] ; Potion x3 [common]".'}),...ke().stats.filter((t)=>t.scope==="character"||t.scope==="world")]},{...ke(),id:"persona_social_sim",name:"Stylish Social Sim & Confidants",icon:"\uD83C\uDCCF",description:"High-contrast social sim HUD with Confidant Heart ranks, Social Stats (Charm/Courage/Knowledge), and stylish badges.",theme:{...ke().theme,surfaceStyle:"persona_pop",frameShape:"sharp",meterStyle:"segmented",accentHue:348,secondaryHue:45},stats:[re({id:"social_stats",label:"Social Qualities",icon:"⭐",scope:"player",kind:"attributes",min:1,max:10,defaultValue:"Knowledge:2, Charm:2, Courage:2, Kindness:2, Proficiency:2",color:"#f43f5e",layoutSpan:"full",volatility:"progressive",triggerCues:'Comma-separated 1–10 qualities: "Knowledge:N, Charm:N, Courage:N, Kindness:N, Proficiency:N".'}),re({id:"composure",label:"Cool / Composure",icon:"\uD83C\uDFAD",scope:"player",kind:"meter",min:0,max:100,defaultValue:85,color:"#facc15",volatility:"momentary",pinnedToHeader:!0,triggerCues:"85=stylish, 55=steady, 30=rattled, 0=flustered."}),re({id:"bond_hearts",label:"Confidant Bond Rank",icon:"❤️",scope:"character",kind:"hearts",min:0,max:10,defaultValue:3,color:"#f472b6",volatility:"progressive",pinnedToHeader:!0,triggerCues:"0–10 heart rank. Increases on meaningful hangouts, honesty, or breakthroughs."}),...ke().stats.filter((t)=>t.scope==="character"||t.scope==="world")]}],zt=[{schema:"lumi-stats-skin/v1",name:"Adaptive Lumiverse Glass",surfaceStyle:"glass",frameShape:"rounded",meterStyle:"smooth",glowIntensity:45,glassBlur:!0,castLayout:"roster"},{schema:"lumi-stats-skin/v1",name:"Arcane Fantasy RPG",surfaceStyle:"arcane_rpg",frameShape:"ornate",meterStyle:"glow",accentHue:42,secondaryHue:198,glowIntensity:70,glassBlur:!0,castLayout:"roster"},{schema:"lumi-stats-skin/v1",name:"Cyber Tactical HUD",surfaceStyle:"cyber_hud",frameShape:"chamfered",meterStyle:"segmented",accentHue:190,secondaryHue:315,glowIntensity:85,glassBlur:!0,castLayout:"roster"},{schema:"lumi-stats-skin/v1",name:"Stylish Social Sim (Pop)",surfaceStyle:"persona_pop",frameShape:"sharp",meterStyle:"segmented",accentHue:348,secondaryHue:48,glowIntensity:60,glassBlur:!1,castLayout:"roster"},{schema:"lumi-stats-skin/v1",name:"Cozy Visual Novel",surfaceStyle:"cozy_vn",frameShape:"rounded",meterStyle:"smooth",accentHue:330,secondaryHue:200,glowIntensity:40,glassBlur:!0,castLayout:"roster"}];function ks(t){return{schema:"lumi-stats-skin/v1",name:`${t.name} Skin`,surfaceStyle:t.theme.surfaceStyle??"glass",frameShape:t.theme.frameShape??(t.theme.radiusPreset==="sharp"?"sharp":"rounded"),meterStyle:t.theme.meterStyle??"smooth",...t.theme.accentHue!==void 0?{accentHue:t.theme.accentHue}:{},...t.theme.secondaryHue!==void 0?{secondaryHue:t.theme.secondaryHue}:{},glowIntensity:t.theme.glowIntensity??55,glassBlur:t.theme.glassBlur!==!1,compact:Boolean(t.theme.compact),castLayout:t.theme.castLayout??"roster",...t.theme.customCss?{customCss:t.theme.customCss}:{}}}function Cs(t){let n=t&&typeof t==="object"?t:{},a=new Set(["glass","soft","sleek","minimal","neon","arcane_rpg","cyber_hud","persona_pop","cozy_vn"]).has(String(n.surfaceStyle))?n.surfaceStyle:"glass",i=n.frameShape==="chamfered"||n.frameShape==="sharp"||n.frameShape==="ornate"?n.frameShape:"rounded",r=n.meterStyle==="segmented"||n.meterStyle==="glow"?n.meterStyle:"smooth",d=n.castLayout==="cards"?"cards":"roster",o=typeof n.accentHue==="number"&&Number.isFinite(n.accentHue)?Math.max(0,Math.min(360,Math.round(n.accentHue))):void 0,c=typeof n.secondaryHue==="number"&&Number.isFinite(n.secondaryHue)?Math.max(0,Math.min(360,Math.round(n.secondaryHue))):void 0,f=typeof n.glowIntensity==="number"&&Number.isFinite(n.glowIntensity)?Math.max(0,Math.min(100,Math.round(n.glowIntensity))):55;return{schema:"lumi-stats-skin/v1",name:String(n.name??"Imported Skin").trim().slice(0,80)||"Imported Skin",surfaceStyle:a,frameShape:i,meterStyle:r,...o!==void 0?{accentHue:o}:{},...c!==void 0?{secondaryHue:c}:{},glowIntensity:f,glassBlur:n.glassBlur!==!1,compact:Boolean(n.compact),castLayout:d,...typeof n.customCss==="string"&&n.customCss.trim()?{customCss:n.customCss.slice(0,8000)}:{}}}function Ts(t){let n={};for(let s of t.stats){if(!s.enabled||s.scope==="character")continue;n[s.id]={id:s.id,scope:s.scope,value:s.defaultValue,calibrated:!1,locked:s.locked}}return{initialized:!1,title:"Uncharted Story",canonPremise:"",turnCount:0,elapsedMinutes:0,scene:{location:"",timeLabel:"08:00 AM",dateLabel:"Day 1",weather:"Clear",beatSummary:""},player:{name:"",attire:"",condition:"Normal",notableAction:""},currentPlaceId:"",stats:n,modifiers:[],characters:{},mapZones:{},places:{},mapPaths:[],quests:{},dispatches:[],auditLog:[]}}var Sn="lumi_stats/v1";var Sa={sync:'<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.85 1 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z"/>',trash:'<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',copy:'<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',chevronDown:'<path d="m6 9 6 6 6-6"/>',chevronUp:'<path d="m18 15-6-6-6 6"/>',more:'<circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/><circle cx="5" cy="12" r="1.2"/>',plus:'<path d="M12 5v14"/><path d="M5 12h14"/>',pin:'<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1Z"/>',lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',unlock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',sliders:'<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',stage:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m10 9 5 3-5 3Z"/>',stats:'<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',network:'<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M10.8 7.2 6.2 16.8"/><path d="m13.2 7.2 4.6 9.6"/><path d="M7.5 19h9"/>',map:'<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>',globe:'<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"/>',eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',eyeOff:'<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>',check:'<polyline points="20 6 9 17 4 12"/>',close:'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',volume:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',flask:'<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',resize:'<path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/>',palette:'<circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2Z"/>',sparkles:'<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>'};function kn(t,n=14){let a=document.createElementNS("http://www.w3.org/2000/svg","svg");return a.setAttribute("viewBox","0 0 24 24"),a.setAttribute("width",String(n)),a.setAttribute("height",String(n)),a.setAttribute("fill","none"),a.setAttribute("stroke","currentColor"),a.setAttribute("stroke-width","1.9"),a.setAttribute("stroke-linecap","round"),a.setAttribute("stroke-linejoin","round"),a.setAttribute("aria-hidden","true"),a.classList.add("ls-svg-icon"),a.innerHTML=Sa[t],a}var Cn=/(<(?:lumi-stats|lumi-tracker|worldweave|json|style|script|pre|code)\b[\s\S]*?<\/(?:lumi-stats|lumi-tracker|worldweave|json|style|script|pre|code)\s*>|```[\s\S]*?```)/gi;function Is(t){let n=2166136261;for(let s=0;s<t.length;s++)n^=t.charCodeAt(s),n=Math.imul(n,16777619);return(n>>>0).toString(36)}function jt(t){if(!t||typeof t!=="string")return"";let n=(s)=>{let a=s;return a=a.replace(/[\u2800\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g," "),a=a.replace(/[\u180E\u200B-\u200D\u2060\uFEFF]/g,""),a=a.replace(/^[ \t]+(\*[^\s*]|-[^\s\-]|[^\s\-*#+>0-9`~])/gm,"$1"),a=a.replace(/^[ \t]{4,}(?=[-*+]\s|\d+\.\s|>)/gm,"  "),a=a.replace(/[ \t]+\n/g,`
`),a=a.replace(/([^\n \t])[ \t]{2,}([^\n \t])/g,"$1 $2"),a=a.replace(/\n{3,}/g,`

`),a};return t.split(Cn).map((s,a)=>a%2===1?s:n(s)).join("")}function Ms(t){return t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function kt(t){if(!Array.isArray(t))return[];let n=new Set;for(let s of t){let a=String(s??"").trim().toLowerCase();if(a.length>=2&&a.length<=64)n.add(a)}return[...n].sort((s,a)=>a.length-s.length)}function Tn(t,n=!0){let s=n?"1":"*";return t.replace(/[aeiouAEIOU]/g,s)}function $s(t,n,s=!0){if(!t||typeof t!=="string")return"";let a=kt(n);if(!a.length)return t;let i=new RegExp(`(?<![\\p{L}\\p{N}_])(?:${a.map(Ms).join("|")})(?![\\p{L}\\p{N}_])`,"giu");return t.split(Cn).map((r,d)=>d%2===1?r:r.replace(i,(o)=>Tn(o,s))).join("")}function ka(t,n=!0){let s=String(t??"").trim().toLowerCase();if(s.length<2||!/[aeiou]/i.test(s))return null;let a=[...s],i=a.map((y)=>{if(/[aeiou]/i.test(y))return`[${y}${y.toUpperCase()}1*]`;if(/[a-z]/i.test(y))return`[${y}${y.toUpperCase()}]`;return Ms(y)}),r=a[0],d=/[a-z]/i.test(r)&&!/[aeiou]/i.test(r);if(d)i[0]=`([${r}${r.toUpperCase()}])`;let c=`(?=[\\p{L}\\p{N}*'\\- ]{0,${Math.max(0,a.length-1)}}[1*])`,f=a.length>=4?"(?=[a-zA-Z]{0,10}(?![\\p{L}\\p{N}_]))":"(?![\\p{L}\\p{N}_])";return{word:s,findRegex:`(?<![\\p{L}\\p{N}_])${c}${i.join("")}${f}`,replaceString:d?`$1${s.slice(1)}`:s,flags:d?"gu":"giu"}}function In(t,n,s=!0){if(!t||typeof t!=="string")return"";let a=kt(n);if(!a.length)return t;let i=a.map((d)=>{let o=ka(d,s);if(!o)return null;try{return{word:o.word,regex:new RegExp(o.findRegex,o.flags)}}catch{return null}}).filter((d)=>Boolean(d));if(!i.length)return t;let r=(d,o)=>{let c=d.replace(/[^a-zA-Z]/g,"");if(c.length>1&&c===c.toUpperCase())return o.toUpperCase();if(d[0]&&d[0]===d[0].toUpperCase()&&d[0]!==d[0].toLowerCase())return o.charAt(0).toUpperCase()+o.slice(1);return o};return t.split(Cn).map((d,o)=>{if(o%2===1)return d;let c=d;for(let f of i)c=c.replace(f.regex,(y)=>r(y,f.word));return c}).join("")}var Ca="lumi_stats_tts_cache_v1",ot="clips",Ta=60,Ia=80;class Mn{connectionsCache=null;voicesByConnId=new Map;memUrlCache=new Map;inFlightSynth=new Map;dbPromise=null;activeAudio=null;playToken=0;isPlaying=!1;activeSpeakerLabel="";cacheHitCount=0;openDb(){if(this.dbPromise)return this.dbPromise;if(typeof indexedDB>"u")return Promise.resolve(null);return this.dbPromise=new Promise((t)=>{try{let n=indexedDB.open(Ca,1);n.onupgradeneeded=()=>{let s=n.result;if(!s.objectStoreNames.contains(ot))s.createObjectStore(ot,{keyPath:"key"})},n.onsuccess=()=>t(n.result),n.onerror=()=>t(null)}catch{t(null)}}),this.dbPromise}async listConnections(t=!1){if(this.connectionsCache&&!t)return this.connectionsCache;try{let n=await fetch("/api/v1/tts-connections?limit=25",{credentials:"include"});if(!n.ok)return this.connectionsCache??[];let s=await n.json(),a=Array.isArray(s?.data)?s.data:[];return this.connectionsCache=a.map((i)=>({id:String(i.id??""),name:String(i.name??"TTS Connection"),provider:String(i.provider??""),model:String(i.model??""),voice:String(i.voice??""),is_default:Boolean(i.is_default)})),this.connectionsCache}catch{return this.connectionsCache??[]}}async listVoicesForConnection(t){if(!t)return[];let n=this.voicesByConnId.get(t);if(n)return n;try{let s=await fetch(`/api/v1/tts-connections/${encodeURIComponent(t)}/voices`,{credentials:"include"});if(!s.ok)return[];let a=await s.json(),r=(Array.isArray(a?.voices)?a.voices:Array.isArray(a?.data)?a.data:Array.isArray(a)?a:[]).map((d)=>({id:String(d.id??d.voice_id??d.name??""),name:String(d.name??d.label??d.id??""),...typeof d.gender==="string"?{gender:d.gender}:{}})).filter((d)=>Boolean(d.id));return this.voicesByConnId.set(t,r),r}catch{return[]}}rememberMemUrl(t,n){let s=this.memUrlCache.get(t);if(s&&s!==n&&s.startsWith("blob:"))try{URL.revokeObjectURL(s)}catch{}this.memUrlCache.delete(t);while(this.memUrlCache.size>=Ta){let a=this.memUrlCache.keys().next().value;if(!a)break;let i=this.memUrlCache.get(a);if(i?.startsWith("blob:"))try{URL.revokeObjectURL(i)}catch{}this.memUrlCache.delete(a)}this.memUrlCache.set(t,n)}async readFromIdbCache(t){let n=await this.openDb();if(!n)return null;return new Promise((s)=>{try{let i=n.transaction(ot,"readonly").objectStore(ot).get(t);i.onsuccess=()=>{let r=i.result;s(r?.blob instanceof Blob?r.blob:null)},i.onerror=()=>s(null)}catch{s(null)}})}async writeToIdbCache(t,n){let s=await this.openDb();if(!s)return;await new Promise((a)=>{try{let i=s.transaction(ot,"readwrite"),r=i.objectStore(ot);r.put({key:t,blob:n,updatedAt:Date.now()});let d=r.count();d.onsuccess=()=>{if(d.result>Ia){let o=r.openCursor();o.onsuccess=()=>{let c=o.result;if(c)c.delete()}}},i.oncomplete=()=>a(),i.onerror=()=>a()}catch{a()}})}async synthesizeSegmentCached(t){let n=await this.listConnections(),s=(t.connectionId?n.find((P)=>P.id===t.connectionId):void 0)??n.find((P)=>P.is_default)??n[0];if(!s?.id)return null;let a=s.id,i=t.model||s.model||"",r=t.voiceId||s.voice||"",d=t.text.trim();if(!d)return null;let o=`tts_${Is(`${a}|${i}|${r}|${d.toLowerCase()}`)}`,c=this.memUrlCache.get(o);if(c)return this.cacheHitCount++,this.rememberMemUrl(o,c),c;let f=this.inFlightSynth.get(o);if(f)return f;let y=(async()=>{let P=await this.readFromIdbCache(o);if(P){this.cacheHitCount++;let m=URL.createObjectURL(P);return this.rememberMemUrl(o,m),m}try{let m=await fetch("/api/v1/tts/synthesize",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({connectionId:a,...i?{model:i}:{},...r?{voice:r}:{},text:d,outputFormat:"mp3"})});if(!m.ok)return null;let S=await m.blob();if(!S.size)return null;this.writeToIdbCache(o,S);let L=URL.createObjectURL(S);return this.rememberMemUrl(o,L),L}catch{return null}})();this.inFlightSynth.set(o,y);try{return await y}finally{if(this.inFlightSynth.get(o)===y)this.inFlightSynth.delete(o)}}prefetchSegments(t){for(let n of t.slice(0,3))this.synthesizeSegmentCached(n)}stop(){if(this.playToken++,this.activeAudio){try{this.activeAudio.pause(),this.activeAudio.removeAttribute("src")}catch{}this.activeAudio=null}this.isPlaying=!1,this.activeSpeakerLabel=""}async playSegments(t,n){if(this.stop(),!t.length)return n?.(),!1;let s=++this.playToken;this.isPlaying=!0,n?.();let a=t.map((i)=>this.synthesizeSegmentCached(i));for(let i=0;i<t.length;i++){if(this.playToken!==s)return!1;let r=t[i],d=await a[i];if(!d||this.playToken!==s)continue;this.activeSpeakerLabel=r.speakerName,n?.(),await new Promise((o)=>{if(this.playToken!==s){o();return}let c=new Audio(d);c.playbackRate=Math.max(0.5,Math.min(2,r.speed||1)),this.activeAudio=c,c.onended=()=>o(),c.onerror=()=>o(),c.play().catch(()=>o())})}if(this.playToken===s)return this.isPlaying=!1,this.activeSpeakerLabel="",this.activeAudio=null,n?.(),!0;return!1}destroy(){this.stop();for(let t of this.memUrlCache.values())if(t.startsWith("blob:"))try{URL.revokeObjectURL(t)}catch{}this.memUrlCache.clear(),this.inFlightSynth.clear()}}var Ls=`
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
`;function e(t,n="",s){let a=document.createElement(t);if(n)a.className=n;if(s!==void 0)a.textContent=s;return a}function B(t,n,s="",a){let i=e("button",s,t);if(i.type="button",a)i.title=a,i.setAttribute("aria-label",a);return i.addEventListener("pointerdown",(r)=>{r.stopPropagation()}),i.addEventListener("click",(r)=>{r.stopPropagation(),n(r)}),i}function ee(t,n,s){let a=e("button",s?.className??"ls-btn-sm ls-btn-icon");if(a.type="button",a.append(kn(t,s?.size??14)),s?.label)a.append(e("span","",s.label));if(s?.title)a.title=s.title,a.setAttribute("aria-label",s.title);return a.addEventListener("pointerdown",(i)=>{i.stopPropagation()}),a.addEventListener("click",(i)=>{i.stopPropagation(),n(i)}),a}class ze{handles=[];track(t){return this.handles.push(t),t}clear(){for(let t of this.handles.splice(0))try{t.destroy()}catch{}}}var Ps=[".ls-drawer-body",".ls-studio-pane",".ls-studio-preview-pane",".ls-hud-content",".ls-dossier-main"],_s=0;if(typeof document<"u")document.addEventListener("keydown",(t)=>{if(t.target instanceof HTMLInputElement||t.target instanceof HTMLTextAreaElement)_s=Date.now()},{capture:!0,passive:!0});function $n(t,n,s){let a=document.activeElement,i=Date.now()-_s<1200,r=Boolean(document.body.querySelector('.ls-dd-menu[data-ls-dd-open="true"]'))||Boolean(t.querySelector('[aria-expanded="true"], [data-state="open"]'))||a instanceof HTMLElement&&t.contains(a)&&a.tagName==="SELECT";if(s?.deferIfTyping&&(i||r)&&a instanceof HTMLElement&&t.contains(a)&&(a.tagName==="INPUT"||a.tagName==="TEXTAREA")&&a.type!=="checkbox"&&a.type!=="radio"){if(s.onDeferredFlush&&!a.dataset.lsBlurDeferred){a.dataset.lsBlurDeferred="true";let c=null,f=()=>{if(c)clearTimeout(c),c=null;delete a.dataset.lsBlurDeferred,a.removeEventListener("blur",f),s.onDeferredFlush?.()};a.addEventListener("blur",f,{once:!0}),c=setTimeout(f,1250)}return!1}let d=new Map;d.set("__root__",{top:t.scrollTop,left:t.scrollLeft});for(let c of Ps){let f=t.querySelector(c);if(f)d.set(c,{top:f.scrollTop,left:f.scrollLeft})}n();let o=d.get("__root__");if(o)t.scrollTop=o.top,t.scrollLeft=o.left;for(let c of Ps){let f=d.get(c);if(!f)continue;let y=t.querySelector(c);if(y)y.scrollTop=f.top,y.scrollLeft=f.left}return!0}function te(t,n,s,a){let i=a.value,r=[...a.options],d=null,o=null,c=e("div","ls-dd-wrap");if(a.compact)c.dataset.compact="true";let f=e("button","ls-dd-trigger");if(f.type="button",f.setAttribute("aria-haspopup","listbox"),f.setAttribute("aria-expanded","false"),a.ariaLabel)f.setAttribute("aria-label",a.ariaLabel);if(a.title)f.title=a.title;let y=e("span","ls-dd-trigger-label"),P=e("span","ls-dd-caret","▾");f.append(y,P),c.append(f),s.replaceChildren(c);let m=()=>{let k=r.find((_)=>_.value===i);y.textContent=k?.label||a.placeholder||r[0]?.label||"Select…"};m();let S=()=>{if(o)o(),o=null;if(d)d.remove(),d=null;f.setAttribute("aria-expanded","false")},L=()=>{S();for(let E of[...document.body.querySelectorAll('.ls-dd-menu[data-ls-dd-open="true"]')])E.remove();let k=e("div","ls-dd-menu");k.setAttribute("role","listbox"),k.dataset.lsDdOpen="true";let _=getComputedStyle(f);for(let E of["--ls-bg","--ls-surface","--ls-text","--ls-muted","--ls-primary","--ls-border","--ls-fill","--ls-fill-hover","--ls-radius","--ls-font"]){let D=_.getPropertyValue(E).trim();if(D)k.style.setProperty(E,D)}let I=e("div","ls-dd-list"),b=null,x=(E="")=>{I.replaceChildren();let D=E.trim().toLowerCase(),F=D?r.filter((O)=>O.label.toLowerCase().includes(D)||O.sublabel&&O.sublabel.toLowerCase().includes(D)||O.value.toLowerCase().includes(D)):r;if(!F.length){let O=e("div","ls-muted","No matching options");O.style.padding="6px 8px",I.append(O);return}for(let O of F){let V=e("button","ls-dd-option");if(V.type="button",V.setAttribute("role","option"),V.setAttribute("aria-selected",String(O.value===i)),O.disabled)V.disabled=!0;if(V.append(e("span","",O.label)),O.sublabel)V.append(e("span","ls-dd-sublabel",O.sublabel));V.addEventListener("pointerdown",(W)=>{W.stopPropagation()}),V.addEventListener("click",(W)=>{W.preventDefault(),W.stopPropagation(),i=O.value,m(),S(),a.onChange(O.value)}),I.append(V)}};if(r.length>=6)b=e("input","ls-dd-search"),b.type="text",b.placeholder=a.searchPlaceholder||"Search…",b.addEventListener("pointerdown",(E)=>E.stopPropagation()),b.addEventListener("input",()=>x(b.value)),k.append(b);x(),k.append(I);let N=document.body.getBoundingClientRect(),C=N.width>0&&document.body.offsetWidth>0?N.width/document.body.offsetWidth:1,v=f.getBoundingClientRect(),u=window.innerWidth/C,g=window.innerHeight/C,p=Math.max(Math.round(v.width/C),190),h=Math.min(280,r.length*34+(b?48:16)),T=g-v.bottom/C,l=T<h+12&&v.top/C>T,w=Math.max(8,Math.min(u-p-8,Math.round(v.left/C)));if(k.style.left=`${w}px`,k.style.width=`${p}px`,l)k.style.bottom=`${Math.max(8,Math.round(g-v.top/C+4))}px`;else k.style.top=`${Math.max(8,Math.round(v.bottom/C+4))}px`;if(document.body.append(k),d=k,f.setAttribute("aria-expanded","true"),b)requestAnimationFrame(()=>b?.focus());let M=(E)=>{let D=E.target;if(!D)return;if(k.contains(D)||f.contains(D))return;S()},R=(E)=>{if(E.key==="Escape")E.stopPropagation(),S(),f.focus()},A=(E)=>{if(E.type==="resize"&&b&&document.activeElement===b)return;if(E.target instanceof Node&&k.contains(E.target))return;S()};window.addEventListener("pointerdown",M,!0),window.addEventListener("keydown",R,!0),window.addEventListener("resize",A,{passive:!0}),window.addEventListener("scroll",A,{capture:!0,passive:!0}),o=()=>{window.removeEventListener("pointerdown",M,!0),window.removeEventListener("keydown",R,!0),window.removeEventListener("resize",A),window.removeEventListener("scroll",A,!0)}};return f.addEventListener("pointerdown",(k)=>{k.stopPropagation()}),f.addEventListener("click",(k)=>{if(k.preventDefault(),k.stopPropagation(),d)S();else L()}),n?.track({destroy:S}),{getValue:()=>i,setValue:(k)=>{i=k,m()},setOptions:(k,_)=>{if(r=[...k],_!==void 0)i=_;if(m(),d)L()}}}function me(t,n,s,a){let i=e("label","ls-toggle-switch");if(a.size==="md")i.dataset.size="md";let r=e("input");if(r.type="checkbox",r.checked=a.checked,r.disabled=Boolean(a.disabled),a.ariaLabel)r.setAttribute("aria-label",a.ariaLabel);r.addEventListener("change",()=>a.onChange(r.checked));let d=e("span","ls-toggle-track");i.append(r,d),s.replaceChildren(i)}function xe(t,n,s,a){let i=e("label","ls-check-row"),r=e("input");r.type="checkbox",r.checked=a.checked,r.disabled=Boolean(a.disabled),r.addEventListener("change",()=>a.onChange(r.checked)),i.append(r,e("span","",a.label)),s.replaceChildren(i)}var As=new Map;function he(t,n,s,a){let i=e("details","ls-accordion"),r=a.persistKey?As.get(a.persistKey):void 0;i.open=r!==void 0?r:Boolean(a.defaultExpanded);let d=e("summary","ls-accordion-head"),o=e("span","ls-row");if(a.iconName)o.append(kn(a.iconName,14));o.append(e("strong","",a.title));let c=e("span","ls-row");if(a.badge!==void 0)c.append(e("span","ls-chip",String(a.badge)));c.append(e("span","ls-accordion-chev","▾")),d.append(o,c);let f=e("div","ls-accordion-body ls-stack");return i.append(d,f),i.addEventListener("toggle",()=>{if(a.persistKey)As.set(a.persistKey,i.open);a.onToggle?.(i.open)}),s.append(i),f}function Ut(t,n,s,a){let i=async(c,f)=>{if(typeof t.ui?.showContextMenu!=="function")return;let y=s();if(!y.length)return;let P=await t.ui.showContextMenu({position:{x:c,y:f},items:y});if(P.selectedKey)a(P.selectedKey)};n.addEventListener("contextmenu",(c)=>{c.preventDefault(),c.stopPropagation(),i(c.clientX,c.clientY)});let r=null,d=!1,o={x:0,y:0};n.addEventListener("touchstart",(c)=>{d=!1;let f=c.touches[0];if(!f)return;o={x:f.clientX,y:f.clientY},r=setTimeout(()=>{d=!0,navigator.vibrate?.(40),i(f.clientX,f.clientY)},500)},{passive:!0}),n.addEventListener("touchmove",(c)=>{if(!r)return;let f=c.touches[0];if(!f)return;if(Math.abs(f.clientX-o.x)>10||Math.abs(f.clientY-o.y)>10)clearTimeout(r),r=null},{passive:!0}),n.addEventListener("touchend",(c)=>{if(r)clearTimeout(r),r=null;if(d)c.preventDefault(),d=!1})}class Es{ctx;activeModals=new Set;constructor(t){this.ctx=t}hasOpenModals(){return this.activeModals.size>0}open(t,n){if(typeof this.ctx.ui?.showModal!=="function"){console.warn("[LumiStats ModalManager] ctx.ui.showModal is not a function — cannot open modal");return}if(this.activeModals.size>=2)this.activeModals.values().next().value?.dismiss();let s=new ze;console.log("[LumiStats ModalManager] calling ctx.ui.showModal, title:",t.title);let a=this.ctx.ui.showModal({title:t.title,width:t.width??640,maxHeight:t.maxHeight??760,persistent:t.persistent??!1});return console.log("[LumiStats ModalManager] showModal returned handle:",a,"root connected:",a?.root?.isConnected),this.activeModals.add(a),a.root.classList.add("ls-root"),a.root.style.cssText+=";padding:16px;overflow-y:auto;height:auto;max-height:min(80vh, 740px);",a.onDismiss(()=>{s.clear(),this.activeModals.delete(a)}),n(a.root,()=>a.dismiss(),a,s),a}async confirm(t){if(typeof this.ctx.ui?.showConfirm==="function"){let n=await this.ctx.ui.showConfirm({title:t.title,message:t.message,confirmLabel:t.confirmLabel??"Confirm",variant:t.variant??"warning"});return Boolean(n?.confirmed)}return!1}closeAll(){for(let t of[...this.activeModals])t.dismiss();this.activeModals.clear()}}var Ct=new WeakMap;function Ns(t){let n=Ct.get(document);if(n)return n.count++,()=>{if(n.count--,n.count<=0)Ct.delete(document),n.remove()};let s=t.dom.addStyle(Ls);return Ct.set(document,{count:1,remove:s}),()=>{let a=Ct.get(document);if(!a)return;if(a.count--,a.count<=0)Ct.delete(document),a.remove()}}function Tt(t,n){t.modals.open({title:"✨ Create New Lumi Stats Template",width:520},(s,a,i,r)=>{let d=e("div","ls-grid"),o=e("label","ls-label","Icon Emoji"),c=e("input","ls-input");c.value="✨",o.append(c);let f=e("label","ls-label","Template Name"),y=e("input","ls-input");y.placeholder="e.g. Modern Drama & Chemistry, Dark Fantasy RPG…",y.value="",f.append(y),d.append(o,f);let P=e("label","ls-label","Short Description"),m=e("input","ls-input");m.placeholder="What kind of story or stats does this template track?",P.append(m);let S="universal_companion",L=e("div","ls-label","Starter Stat Blueprint"),k=e("div");L.append(k);let _=t.customTemplates.filter((h)=>!t.builtinTemplates.some((T)=>T.id===h.id)).map((h)=>({value:h.id,label:`${h.icon} ${h.name} (Saved · ${h.stats.length} stats)`}));te(t,r,k,{value:S,ariaLabel:"Starter Stat Blueprint",options:[{value:"empty",label:"\uD83E\uDDF9 Empty Canvas (0 stats — start completely from scratch)"},{value:"blank",label:"\uD83C\uDF31 Clean Minimal Starter (1 Trust meter — build your own)"},..._,...t.builtinTemplates.map((h)=>({value:h.id,label:`${h.icon} ${h.name} (${h.stats.length} stats)`}))],onChange:(h)=>{S=h}});let I="post_history",b=1,x=e("div","ls-label","\uD83E\uDDE0 AI Prompt Placement (Where Lumi State Is Sent)"),N=e("div","ls-row"),C=e("div","ls-row");C.style.display="none";let v=()=>{for(let h of[...N.querySelectorAll("button")])h.setAttribute("aria-current",h.dataset.pos===I?"page":"false");C.style.display=I==="in_history"?"flex":"none"};for(let[h,T]of[["pre_history","⬆️ Before History"],["in_history","\uD83D\uDCAC Within History"],["post_history","⬇️ After History"]]){let l=B(T,()=>{I=h,v()},"ls-btn-sm");l.dataset.pos=h,N.append(l)}let u=e("input","ls-input");u.type="number",u.min="0",u.max="20",u.style.width="76px",u.value=String(b),u.addEventListener("change",()=>{b=Math.max(0,Math.min(20,Math.round(Number(u.value)||0)))}),C.append(e("small","ls-muted","History Depth:"),u),v(),x.append(N,C);let g=e("small","ls-muted");g.style.cssText="color:var(--ls-danger);display:none;";let p=B("✨ Create & Activate Template",()=>{let h=y.value.trim()||"My Custom Template",T=c.value.trim()||"✨",l=m.value.trim()||"Custom roleplay tracker template.";p.disabled=!0,p.textContent="⏳ Creating…",g.style.display="none",t.request("template:createNew",{name:h,icon:T,description:l,starter:S,promptPosition:I,promptDepth:b}).then(()=>{t.notify(`Created & activated "${T} ${h}"!`),a(),n?.()}).catch((w)=>{if(g.textContent=w instanceof Error?w.message:String(w),g.style.display="block",p.isConnected)p.disabled=!1,p.textContent="✨ Create & Activate Template"})},"ls-btn-primary");p.style.marginTop="10px",s.append(d,P,L,x,g,p),requestAnimationFrame(()=>y.focus())})}function it(t,n){t.modals.open({title:"\uD83C\uDFAD Quick Template, Game Skin & Placement Switcher",width:660,maxHeight:800},(s,a,i)=>{let r=()=>{let{template:o}=t.snapshot,c=[...t.builtinTemplates,...t.customTemplates.filter((v)=>!t.builtinTemplates.some((u)=>u.id===v.id))];s.replaceChildren();let f=e("div","ls-row-between");f.append(e("span","ls-kicker",`Active: ${o.icon} ${o.name}`),e("div","ls-row")),f.lastElementChild.append(B("✨ + New Template",()=>{a(),Tt(t)},"ls-btn-sm ls-btn-primary"),...n?[B("⚙️ Full Studio",()=>{a(),n()},"ls-btn-sm")]:[]),s.append(f);let y=e("div","ls-card");y.append(e("span","ls-kicker","\uD83C\uDFAE 1-Click Game Skin & Placement"));let P=e("div","ls-row");for(let v of zt){let u=B(v.name,()=>{t.applySkinPack(v)},"ls-btn-sm");if((o.theme.surfaceStyle||"glass")===v.surfaceStyle)u.setAttribute("aria-current","page");P.append(u)}let m=e("div","ls-row");for(let[v,u]of[["both_bottom","✨ HUD + Below Reply"],["both_top","✨ HUD + Above Reply"],["inline_bottom","\uD83D\uDCAC Below Reply Only"],["floating_only","\uD83E\uDE9F Floating HUD Only"]]){let g=B(u,()=>{t.request("state:mutate",{templatePatch:{theme:{...o.theme,placement:v}},reason:"Updated placement mode"})},"ls-btn-sm");if(o.theme.placement===v)g.setAttribute("aria-current","page");m.append(g)}let S=e("div","ls-row");S.append(e("small","ls-muted","Cast Tab:"));for(let[v,u]of[["roster","\uD83D\uDC65 Icon Roster (In Scene / Away)"],["cards","\uD83D\uDDC2️ All Cards Expanded"]]){let g=B(u,()=>{t.request("state:mutate",{templatePatch:{theme:{...o.theme,castLayout:v}},reason:"Updated cast layout mode"})},"ls-btn-sm");if((o.theme.castLayout||"roster")===v)g.setAttribute("aria-current","page");S.append(g)}let L=e("div","ls-row");L.append(e("small","ls-muted","Widget Tabs:"));for(let[v,u]of[[!1,"\uD83C\uDFF7️ Icons + Text"],[!0,"✨ Icons Only"]]){let g=B(u,()=>{t.request("state:mutate",{templatePatch:{theme:{...o.theme,widgetTabsIconOnly:v}},reason:`Set widget tabs to ${v?"icons only":"icons + labels"}`})},"ls-btn-sm");if(Boolean(o.theme.widgetTabsIconOnly)===v)g.setAttribute("aria-current","page");L.append(g)}let k=e("div","ls-row");k.append(e("small","ls-muted","Send State:"));for(let[v,u]of[["pre_history","⬆️ Before History"],["in_history","\uD83D\uDCAC Within History"],["post_history","⬇️ After History"]]){let g=B(u,()=>{t.request("state:mutate",{templatePatch:{promptPosition:v},reason:`Set Lumi State prompt position to ${v}`})},"ls-btn-sm");if((o.promptPosition||"post_history")===v)g.setAttribute("aria-current","page");k.append(g)}if(o.promptPosition==="in_history"){let v=e("input","ls-input");v.type="number",v.min="0",v.max="20",v.title="History depth (messages back from end)",v.style.cssText="width:62px;min-height:27px;padding:2px 6px;font-size:11px;",v.value=String(Math.max(0,Math.round(Number(o.promptDepth??1)||0))),v.addEventListener("change",()=>{let u=Math.max(0,Math.min(20,Math.round(Number(v.value)||0)));t.request("state:mutate",{templatePatch:{promptDepth:u},reason:`Set Lumi State depth to ${u}`})}),k.append(e("small","ls-muted","Depth:"),v)}let _=e("div","ls-row");_.append(e("small","ls-muted","Pill Skin:"));let I=e("div");I.style.minWidth="210px",_.append(I),te(t,void 0,I,{value:o.theme.pillStyle||"glass_capsule",compact:!0,ariaLabel:"Collapsed Pill Skin",options:[{value:"glass_capsule",label:"✨ Frosted Split Capsule (Best)"},{value:"vn_dialogue_bar",label:"\uD83C\uDFAC VN Cinema Strip"},{value:"rpg_status_bar",label:"⚔️ JRPG Party Status Bar"},{value:"persona_ticker",label:"\uD83C\uDCCF Stylish Pop Ticker"},{value:"cyber_telemetry",label:"\uD83D\uDEF8 Cyber Telemetry"},{value:"minimal_floating",label:"☁️ Minimal Ghost Pill"},{value:"neon_edge",label:"⚡ Neon Glow Rail"},{value:"split_deck",label:"\uD83D\uDDC2️ Dual-Deck Card Pill"},{value:"compact_badge",label:"\uD83D\uDCF1 Micro Compact Badge"},{value:"ledger_strip",label:"\uD83D\uDCDC Editorial Case Strip"}],onChange:(v)=>{t.request("state:mutate",{templatePatch:{theme:{...o.theme,pillStyle:v}},reason:`Changed Pill Skin to ${v}`})}}),y.append(P,_,m,S,L,k),s.append(y);let b=c.filter((v)=>!t.builtinTemplates.some((u)=>u.id===v.id)),x=c.filter((v)=>t.builtinTemplates.some((u)=>u.id===v.id)),N=[...b,...x],C=e("div","ls-grid");C.style.marginTop="8px";for(let v of N){let u=v.id===o.id,g=!t.builtinTemplates.some((l)=>l.id===v.id),p=e("div","ls-preset-card");p.dataset.active=String(u);let h=e("div","ls-row-between");h.append(e("strong","",`${v.icon} ${v.name}`),e("span",`ls-chip ${g?"ls-chip-accent":""}`,g?"Saved Custom":"Built-In"));let T=e("div","ls-row");if(u)T.append(e("span","ls-chip ls-chip-accent","✓ Active"));else{let l=B("Activate",()=>{l.disabled=!0,l.textContent="Applying…",t.request("template:apply",{templateId:v.id,template:v}).then(()=>t.notify(`Switched to "${v.name}"`)).catch((w)=>{if(t.notify(w instanceof Error?w.message:String(w),!0),l.isConnected)l.disabled=!1,l.textContent="Activate"})},"ls-btn-sm ls-btn-primary");T.append(l)}T.append(B("\uD83D\uDCCB Duplicate",()=>{t.request("template:duplicate",{sourceTemplateId:v.id,template:v,name:`${v.name} (Custom)`}).then(()=>t.notify(`Duplicated "${v.name}"`)).catch((l)=>t.notify(l instanceof Error?l.message:String(l),!0))},"ls-btn-sm")),p.append(h,e("small","ls-muted",v.description),T),C.append(p)}s.append(C)};r();let d=t.subscribe(r);i.onDismiss(d)})}function Ma(){if(typeof crypto<"u"&&typeof crypto.randomUUID==="function")return crypto.randomUUID();if(typeof crypto<"u"&&typeof crypto.getRandomValues==="function"){let t=new Uint8Array(16);crypto.getRandomValues(t),t[6]=t[6]&15|64,t[8]=t[8]&63|128;let n=Array.from(t,(s)=>s.toString(16).padStart(2,"0")).join("");return`${n.slice(0,8)}-${n.slice(8,12)}-${n.slice(12,16)}-${n.slice(16,20)}-${n.slice(20)}`}return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(t)=>{let n=Math.random()*16|0;return(t==="x"?n:n&3|8).toString(16)})}class Ln{ctx;modals;tts=new Mn;chatId="";snapshot;settings;customTemplates=[];builtinTemplates=Ss;connections=[];recentTurns=[];copilotTurns=[];activeProposal;busy=!1;statusText="";statusError=!1;isGenerationStreaming=!1;isDrawerTabVisible=!0;vnStageOpen=!1;studioOpen=!1;vnShowHudWidget=!0;onToggleVnStage=null;activeDrawerTab="Stats";activeSurfaceTab="stats";activeInlineTab="stats";activeDossierTab="overview";dossierEditMode=!1;webFilterMode="all";activeCopilotMode="ask";inlineExpanded=!1;widgetExpanded=!1;selectedActorId="";openedCastTabs=[];activeCastTabActorId="";selectedPlaceId="";hydratingChat=!1;activeOverlayCleanup=null;onResizeWidgetLive=null;lastThemeAppliedChatId="";customCssEl=null;pendingRpc=new Map;listeners=new Set;statusListeners=new Set;disposers=[];constructor(t){this.ctx=t;this.modals=new Es(t);let n=ke();this.snapshot={schemaVersion:1,chatId:"",revision:0,state:Ts(n),template:n,deltas:{statDeltas:{},characterDeltas:{}},bindings:[],checkpoints:[]},this.disposers.push(t.onBackendMessage((s)=>{if(!s||typeof s!=="object")return;let a=s;if(a.channel!==Sn)return;if(a.type==="rpc_ack"&&typeof a.requestId==="string"){let r=this.pendingRpc.get(a.requestId);if(r){clearTimeout(r.timer),this.pendingRpc.delete(a.requestId);let d=a;if(d.ok)r.resolve(d.data??{});else this.notify(d.error??"Operation failed",!0),r.reject(Error(d.error??"Operation failed"))}return}let i=typeof a.resolvedChatId==="string"&&a.resolvedChatId?a.resolvedChatId:typeof a.chatId==="string"&&a.chatId!=="sandbox"?a.chatId:"";if(!this.chatId&&i)this.chatId=i;if(i&&this.chatId&&i!==this.chatId)return;if(a.type==="snapshot"&&a.snapshot){this.hydratingChat=!1,this.snapshot=a.snapshot;let r=this.snapshot.template.surfaces,d=r.widgetTabs.filter((f)=>f.enabled);if(d.length&&!d.some((f)=>f.id===this.activeSurfaceTab))this.activeSurfaceTab=d[0].id;let o=r.inlineTabs.filter((f)=>f.enabled);if(o.length&&!o.some((f)=>f.id===this.activeInlineTab))this.activeInlineTab=o[0].id;let c=r.dossierTabs.filter((f)=>f.enabled);if(c.length&&!c.some((f)=>f.id===this.activeDossierTab))this.activeDossierTab=c[0].id;if(this.chatId&&this.lastThemeAppliedChatId!==this.chatId)this.lastThemeAppliedChatId=this.chatId,this.inlineExpanded=Boolean(this.snapshot.template.theme.inlineDefaultExpanded);if(this.selectedActorId&&!this.snapshot.state.characters[this.selectedActorId])this.selectedActorId="";if(this.openedCastTabs=this.openedCastTabs.filter((f)=>Boolean(this.snapshot.state.characters[f])),this.activeCastTabActorId&&!this.snapshot.state.characters[this.activeCastTabActorId])this.activeCastTabActorId="";if(this.selectedPlaceId&&!this.snapshot.state.places[this.selectedPlaceId])this.selectedPlaceId="";if(a.settings){if(this.settings=a.settings,typeof this.settings.vnShowHudWidget==="boolean")this.vnShowHudWidget=this.settings.vnShowHudWidget}if(Array.isArray(a.customTemplates))this.customTemplates=a.customTemplates;if(Array.isArray(a.copilotTurns))this.copilotTurns=a.copilotTurns;this.busy=a.busy===!0,this.applyTemplateThemeToDom(),this.emitChange(),this.emitStatusChange()}else if(a.type==="status")this.busy=a.busy===!0,this.statusText=String(a.text??""),this.statusError=!1,this.emitStatusChange();else if(a.type==="error")this.busy=!1,this.notify(String(a.message??"Error"),!0)}))}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}subscribeStatus(t){return this.statusListeners.add(t),()=>this.statusListeners.delete(t)}applySkinPack(t){let n=Cs(t),s=this.snapshot.template.theme;this.request("state:mutate",{templatePatch:{theme:{...s,surfaceStyle:n.surfaceStyle,frameShape:n.frameShape,meterStyle:n.meterStyle,accentHue:n.accentHue,secondaryHue:n.secondaryHue,glowIntensity:n.glowIntensity??55,glassBlur:n.glassBlur!==!1,compact:Boolean(n.compact),castLayout:n.castLayout??s.castLayout??"roster",...n.customCss!==void 0?{customCss:n.customCss}:{}}},reason:`Applied visual skin "${n.name}"`}),this.notify(`Applied "${n.name}" visual skin!`)}stampThemeOnElement(t){let n=this.snapshot.template.theme,s=n.surfaceStyle||"glass",a=n.frameShape||(n.radiusPreset==="sharp"?"sharp":"rounded"),i=n.meterStyle||"smooth",r=n.glassBlur!==!1,d=Math.max(0,Math.min(100,Number(n.glowIntensity??55)))/100,o=Boolean(n.compact),c=typeof n.accentHue==="number"&&Number.isFinite(n.accentHue),f=typeof n.secondaryHue==="number"&&Number.isFinite(n.secondaryHue);if(t.dataset.lsStyle=s,t.dataset.lsPill=n.pillStyle||"glass_capsule",t.dataset.lsFrame=a,t.dataset.lsMeter=i,t.dataset.lsBlur=String(r),t.dataset.lsCompact=String(o),t.style.setProperty("--ls-glow",d.toFixed(2)),c)t.style.setProperty("--ls-primary",`hsl(${n.accentHue}, 86%, 62%)`);else t.style.removeProperty("--ls-primary");if(f)t.style.setProperty("--ls-accent",`hsl(${n.secondaryHue}, 82%, 68%)`);else if(c)t.style.setProperty("--ls-accent",`hsl(${(n.accentHue+28)%360}, 82%, 68%)`);else t.style.removeProperty("--ls-accent")}applyTemplateThemeToDom(){if(typeof document>"u")return;let t=this.snapshot.template.theme;for(let s of document.querySelectorAll(".ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay"))this.stampThemeOnElement(s);let n=(t.customCss||"").trim();if(n){let s=n.replace(/@import\b[^;]*;?/gi,"").replace(/url\s*\([^)]*\)/gi,"");if(!this.customCssEl)this.customCssEl=document.createElement("style"),this.customCssEl.dataset.lsCustomCss="true",document.head.append(this.customCssEl);if(this.customCssEl.textContent!==s)this.customCssEl.textContent=s}else if(this.customCssEl)this.customCssEl.remove(),this.customCssEl=null}emitChange(){for(let t of this.listeners)t();this.applyTemplateThemeToDom()}emitStatusChange(){for(let t of this.statusListeners)t()}notify(t,n=!1){this.statusText=t,this.statusError=n,this.emitStatusChange()}request(t,n={}){let s=this.chatId||"sandbox",a=Ma();return new Promise((i,r)=>{let d=setTimeout(()=>{this.pendingRpc.delete(a),r(Error(`RPC timeout waiting for ${t}`))},60000);this.pendingRpc.set(a,{resolve:i,reject:r,timer:d});let o={channel:Sn,requestId:a,chatId:s,type:t,payload:n};this.ctx.sendToBackend(o)})}isActivityForActiveChat(t){let n="";try{n=this.ctx.getActiveChat?.()?.chatId??""}catch{n=""}if(n&&n!==this.chatId)this.refreshActiveChat(n);let s=n||this.chatId;if(!s){if(t&&t!=="sandbox")this.refreshActiveChat(t);return!0}return!t||t===s}async refreshActiveChat(t){let n=typeof t==="string"?t.trim():"";if(!n&&t!==null)try{n=this.ctx.getActiveChat?.()?.chatId??""}catch{n=""}if(n!==this.chatId)this.chatId=n,this.selectedActorId="",this.openedCastTabs=[],this.activeCastTabActorId="",this.selectedPlaceId="",this.activeProposal=void 0;this.hydratingChat=!0;let s=await this.request("snapshot:get").catch(()=>({}));if(this.hydratingChat=!1,typeof s.resolvedChatId==="string"&&s.resolvedChatId&&!this.chatId)this.chatId=s.resolvedChatId;if(Array.isArray(s.connections))this.connections=s.connections;if(Array.isArray(s.recentTurns))this.recentTurns=s.recentTurns;this.emitChange()}toggleVnStage(){this.onToggleVnStage?.()}uploadStageVariantAsset(t){this.ctx.uploads.pickFile({accept:["image/png","image/jpeg","image/webp","image/gif"],multiple:!1,maxSizeBytes:6000000}).then((n)=>{let s=n[0];if(!s)return;let a=32768,i="";for(let r=0;r<s.bytes.length;r+=a)i+=String.fromCharCode(...s.bytes.subarray(r,r+a));this.notify("⏳ Uploading & saving stage asset variant…"),this.request("asset:upload",{dataUrl:`data:${s.mimeType||"image/png"};base64,${btoa(i)}`,...t})}).catch((n)=>this.notify(n instanceof Error?n.message:String(n),!0))}pickAndUploadImage(t,n,s="neutral"){this.ctx.uploads.pickFile({accept:["image/png","image/jpeg","image/webp","image/gif"],multiple:!1,maxSizeBytes:6000000}).then((a)=>{let i=a[0];if(!i)return;let r=32768,d="";for(let o=0;o<i.bytes.length;o+=r)d+=String.fromCharCode(...i.bytes.subarray(o,o+r));this.notify(`⏳ Uploading ${n}…`),this.request("asset:upload",{dataUrl:`data:${i.mimeType||"image/png"};base64,${btoa(d)}`,targetId:t,kind:n,variant:s})}).catch((a)=>this.notify(a instanceof Error?a.message:String(a),!0))}destroy(){if(this.tts.destroy(),this.customCssEl)this.customCssEl.remove(),this.customCssEl=null;if(this.activeOverlayCleanup)this.activeOverlayCleanup(),this.activeOverlayCleanup=null;this.modals.closeAll();for(let t of this.pendingRpc.values())clearTimeout(t.timer);this.pendingRpc.clear();for(let t of this.disposers.splice(0))t();this.listeners.clear(),this.statusListeners.clear()}}function Kt(t){let n={};if(typeof t==="number"&&Number.isFinite(t))return n.value=t,n;let s=String(t??"").trim();if(!s||s==="None")return n;let a=Number(s);if(Number.isFinite(a))n.value=a;let i=/\b([A-Za-z][A-Za-z0-9_]{0,20})\s*[:=]?\s*(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)\b/g,r;while((r=i.exec(s))!==null){let c=r[1],f=Number(r[2]),y=Number(r[3]);if(Number.isFinite(f))n[c]=f,n[`${c}_cur`]=f,n[c.toLowerCase()]=f,n[`${c.toLowerCase()}_cur`]=f;if(Number.isFinite(y))n[`${c}_max`]=y,n[`${c.toLowerCase()}_max`]=y}let d=s.match(/(-?\d+(?:\.\d+)?)\s*%/);if(d){let c=Number(d[1]);if(Number.isFinite(c))n.pct=c}let o=/\b([A-Za-z][A-Za-z0-9_]{0,20})(?:\s*[:=]\s*|\.\s*|\s+|(?=-?\d))(-?\d+(?:\.\d+)?)\b(?!\s*\/)/g;while((r=o.exec(s))!==null){let c=r[1],f=Number(r[2]);if(!Number.isFinite(f))continue;if(n[c]===void 0)n[c]=f;if(n[c.toLowerCase()]===void 0)n[c.toLowerCase()]=f}return n}function $a(t){let n=t.trim();if(!n||n.includes("{{"))return!1;if(/^(?:compute|calculate|format|write|track|update|use)\b/i.test(n))return!0;if(/\.\s+[A-Za-z]+\s+[a-z]+\s+[a-z]+/.test(n))return!0;if(/\b(?:loses|per\s+\d|during|whenever|only\s+if|in\s+this\s+format)\b/i.test(n))return!0;return!1}function je(t,n,s,a){let i=t.trim();if(!i||i.length>1000)return;let r=0,d=0,o=()=>{while(r<i.length&&/\s/.test(i[r]??""))r++},c=()=>{let b=i[r];r++;let x="";while(r<i.length){let N=i[r];if(N==="\\"&&r+1<i.length){x+=i[r+1],r+=2;continue}if(N===b)return r++,x;x+=N,r++}throw Error("Unterminated string literal")},f=(b)=>{if(Object.prototype.hasOwnProperty.call(n,b))return n[b];let x=b.toLowerCase();for(let[C,v]of Object.entries(n))if(C.toLowerCase()===x)return v;let N=s.resolveRef(b);if(N!==void 0&&Number.isFinite(N))return N;return a?.missingRefs.add(b),NaN},y=(b,x)=>{let N=b.toLowerCase();if(N==="round"){if(!x.length)return NaN;let v=10**(x[1]!==void 0&&Number.isFinite(x[1])?Math.max(0,Math.min(6,Math.round(x[1]))):0);return Math.round(x[0]*v)/v}if(N==="floor")return x.length?Math.floor(x[0]):NaN;if(N==="ceil")return x.length?Math.ceil(x[0]):NaN;if(N==="abs")return x.length?Math.abs(x[0]):NaN;if(N==="min")return x.length?Math.min(...x):NaN;if(N==="max")return x.length?Math.max(...x):NaN;if(N==="mod")return x.length>=2&&x[1]!==0?x[0]%x[1]:NaN;if(N==="clamp"){if(x.length<3)return NaN;return Math.max(x[1],Math.min(x[2],x[0]))}if(N==="if"){if(x.length<2)return NaN;let C=x[0];return C!==0&&!Number.isNaN(C)?x[1]:x[2]??0}throw Error(`Unknown function: ${b}`)},P=()=>{if(++d>800)throw Error("Formula complexity limit exceeded");o();let b=i[r];if(b==="+"||b==="-"||b==="!"){r++;let C=P();if(b==="!")return C===0||Number.isNaN(C)?1:0;return b==="-"?-C:C}if(b==="("){r++;let C=I();if(o(),i[r]!==")")throw Error("Unclosed parenthesis");return r++,C}if(b==="["){let C=i.indexOf("]",r+1);if(C<0)throw Error("Unclosed bracket reference");let v=i.slice(r+1,C).trim();r=C+1;let u=s.resolveRef(v);if(u!==void 0&&Number.isFinite(u))return u;return a?.missingRefs.add(v),NaN}let x=i.slice(r).match(/^(?:\d+(?:\.\d+)?|\.\d+)/);if(x)return r+=x[0].length,Number(x[0]);let N=i.slice(r).match(/^[A-Za-z_][A-Za-z0-9_.]*/);if(N){let C=N[0];if(r+=C.length,o(),i[r]==="("){r++,o();let v=C.toLowerCase();if(v==="hascond"||v==="hasflag"){let g=!1;if(i[r]==='"'||i[r]==="'"){let p=c();g=s.hasCond(p),o()}if(i[r]!==")")throw Error(`Expected ) after ${C}`);return r++,g?1:0}if(v==="match"||v==="matches"){let g="",p="";if(i[r]==='"'||i[r]==="'")g=c();else{let h=r;while(r<i.length&&i[r]!==","&&i[r]!==")")r++;let T=i.slice(h,r).trim();g=s.resolveStringRef(T)??String(f(T)||"")}if(o(),i[r]===","){if(r++,o(),i[r]==='"'||i[r]==="'")p=c()}if(o(),i[r]!==")")throw Error("Expected ) after match()");if(r++,!p)return 0;try{return new RegExp(p,"i").test(g)?1:0}catch{return g.toLowerCase().includes(p.toLowerCase())?1:0}}let u=[];if(i[r]!==")")while(!0){if(u.push(I()),o(),i[r]===","){r++;continue}break}if(i[r]!==")")throw Error(`Expected ) in ${C}()`);return r++,y(C,u)}return f(C)}throw Error(`Unexpected character near "${i.slice(r,r+18)}"`)},m=()=>{let b=P();while(!0){o();let x=i[r];if(x!=="*"&&x!=="/"&&x!=="%")return b;r++;let N=P();if((x==="/"||x==="%")&&N===0)return NaN;b=x==="*"?b*N:x==="/"?b/N:b%N}},S=()=>{let b=m();while(!0){o();let x=i[r];if(x!=="+"&&x!=="-")return b;r++;let N=m();b=x==="+"?b+N:b-N}},L=()=>{let b=S();while(!0){o();let x=i.slice(r,r+2),N=i[r],C="";if(x==="<="||x===">="||x==="=="||x==="!=")C=x;else if(N==="<"||N===">")C=N;if(!C)return b;r+=C.length;let v=S();if(C==="<=")b=b<=v?1:0;else if(C===">=")b=b>=v?1:0;else if(C==="==")b=b===v?1:0;else if(C==="!=")b=b!==v?1:0;else if(C==="<")b=b<v?1:0;else b=b>v?1:0}},k=()=>{let b=L();while(!0){if(o(),i.slice(r,r+2)!=="&&")return b;r+=2;let x=L();b=b!==0&&!Number.isNaN(b)&&x!==0&&!Number.isNaN(x)?1:0}},_=()=>{let b=k();while(!0){if(o(),i.slice(r,r+2)!=="||")return b;r+=2;let x=k();b=b!==0&&!Number.isNaN(b)||x!==0&&!Number.isNaN(x)?1:0}},I=()=>{let b=_();if(o(),i[r]!=="?")return b;r++;let x=I();if(o(),i[r]!==":")throw Error('Expected ":" in ternary expression');r++;let N=I();return b!==0&&!Number.isNaN(b)?x:N};try{let b=I();if(o(),r!==i.length){if(a)a.error=`Unexpected character near "${i.slice(r,r+18)}"`;return}if(!Number.isFinite(b))return;return Number(b.toFixed(2))}catch(b){if(a)a.error=b instanceof Error?b.message:String(b);return}}function It(t){let n=t.trim().toLowerCase();return!["","0","false","null","undefined","no","off"].includes(n)}function qt(t){let n=[],s=0,a="";for(let i=0;i<t.length;i++){if(t[i]==="{"&&t[i+1]==="{"){s++,a+="{{",i++;continue}if(t[i]==="}"&&t[i+1]==="}"&&s>0){s--,a+="}}",i++;continue}if(s===0&&t[i]===":"&&t[i+1]===":"){n.push(a),a="",i++;continue}a+=t[i]}return n.push(a),n}function Bs(t,n){let s=0;for(let a=n;a<t.length-1;a++)if(t[a]==="{"&&t[a+1]==="{")s++,a++;else if(t[a]==="}"&&t[a+1]==="}"){if(s--,s===0)return a+2;a++}return-1}function Mt(t,n,s){let a=new RegExp(`^\\{\\{\\s*#?${s}(?:\\s|::|\\}\\})`,"i"),i=new RegExp(`^\\{\\{\\s*\\/${s}\\s*\\}\\}`,"i"),r=1;for(let d=n;d<t.length;d++)if(t[d]==="{"&&t[d+1]==="{"){let o=t.slice(d);if(i.test(o)){if(r--,r===0){let c=t.indexOf("}}",d);return{bodyEnd:d,closeEnd:c+2}}}else if(a.test(o))r++}return null}function La(t){let n=[],s="",a=0,i=0,r=null,d=!1;for(let c=0;c<t.length;c++){if(t[c]!=="{"||t[c+1]!=="{")continue;let f=Bs(t,c);if(f<0)continue;let y=t.slice(c+2,f-2).trim();if(/^#?(?:if|unless)\b/i.test(y))a++;else if(/^\/(?:if|unless)\b/i.test(y))a=Math.max(0,a-1);else if(a===0&&/^(?:elseif|elif)\b/i.test(y)){let P=t.slice(i,c);if(r===null)n.push({cond:"__first__",content:P});else n.push({cond:r,content:P});r=y.replace(/^(?:elseif|elif)(?:::|\s+)/i,"").trim(),i=f}else if(a===0&&/^else$/i.test(y)){let P=t.slice(i,c);if(r===null)n.push({cond:"__first__",content:P});else n.push({cond:r,content:P});r=null,d=!0,i=f}c=f-1}let o=t.slice(i);if(d)s=o;else if(r===null)n.push({cond:"__first__",content:o});else n.push({cond:r,content:o});return{branches:n,elseContent:s}}function Pa(t,n,s={},a={}){let i={...a},r={...s},d={missingRefs:new Set},o=0,c=(S)=>{if(Object.prototype.hasOwnProperty.call(r,S))return r[S];let L=S.toLowerCase();for(let[I,b]of Object.entries(r))if(I.toLowerCase()===L)return b;if(Object.prototype.hasOwnProperty.call(i,S))return String(i[S]);for(let[I,b]of Object.entries(i))if(I.toLowerCase()===L)return String(b);let k=n.resolveStringRef(S);if(k!==void 0)return k;let _=n.resolveRef(S);if(_!==void 0)return String(_);return},f=(S)=>{let L=S.trim();if(!L)return!1;let k=L.startsWith("!"),_=k?L.slice(1).trim():L,I=y(_).trim(),b=I.match(/^(.+?)\s*(==|!=|>=|<=|>|<)\s*(.+)$/),x=!1;if(b){let N=b[1].trim(),C=b[2],v=b[3].trim(),u=Number(N),g=Number(v);if(N!==""&&v!==""&&Number.isFinite(u)&&Number.isFinite(g))x=C==="=="?u===g:C==="!="?u!==g:C===">"?u>g:C==="<"?u<g:C===">="?u>=g:u<=g;else x=C==="=="?N===v:C==="!="?N!==v:C===">"?N>v:C==="<"?N<v:C===">="?N>=v:N<=v}else x=It(I);return k?!x:x},y=(S)=>{if(++o>1200)return d.error="Macro work budget exceeded (possible infinite recursion)",S;let L="",k=0;while(k<S.length){if(S[k]!=="{"||S[k+1]!=="{"){L+=S[k++];continue}let _=Bs(S,k);if(_<0){L+=S.slice(k);break}let I=S.slice(k+2,_-2).trim();if(I.startsWith("//")||/^comment::|^note::/i.test(I)){k=_;continue}if(/^#escape$/i.test(I)){let g=Mt(S,_,"escape");if(g){L+=S.slice(_,g.bodyEnd),k=g.closeEnd;continue}}let b=I.match(/^#?(if|unless)(?:::|\s+)([\s\S]+)$/i);if(b){let g=b[1].toLowerCase(),p=b[2].trim(),h=Mt(S,_,g);if(h){let T=S.slice(_,h.bodyEnd),{branches:l,elseContent:w}=La(T),M=w;for(let R of l){let A=R.cond==="__first__"?p:R.cond,E=f(A);if(g==="unless"?!E:E){M=R.content;break}}L+=y(M),k=h.closeEnd;continue}}if(/^let(?:::|\s+)/i.test(I)){let g=Mt(S,_,"let");if(g){let p=qt(I.replace(/^let(?:::|\s+)/i,"")),h=new Map,T=new Map;for(let l=0;l+1<p.length;l+=2){let w=y(p[l]).trim(),M=y(p[l+1]);if(!w)continue;h.set(w,Object.prototype.hasOwnProperty.call(r,w)?r[w]:void 0),T.set(w,Object.prototype.hasOwnProperty.call(i,w)?i[w]:void 0),r[w]=M;let R=Number(M);if(M.trim()!==""&&Number.isFinite(R))i[w]=R}L+=y(S.slice(_,g.bodyEnd));for(let[l,w]of h.entries())if(w===void 0)delete r[l];else r[l]=w;for(let[l,w]of T.entries())if(w===void 0)delete i[l];else i[l]=w;k=g.closeEnd;continue}}if(/^#?trim$/i.test(I)){let g=Mt(S,_,"trim");if(g){L+=y(S.slice(_,g.bodyEnd)).trim(),k=g.closeEnd;continue}}if(/^switch::/i.test(I)){let g=qt(I);if(g.length<=2){let p=Mt(S,_,"switch");if(p){let h=y(g[1]??"").trim(),T=S.slice(_,p.bodyEnd),l="",w="",M=/\{\{\s*case::([\s\S]*?)\}\}([\s\S]*?)\{\{\s*\/case\s*\}\}/gi,R;while((R=M.exec(T))!==null)if(qt(R[1]).map((E)=>y(E).trim()).includes(h)){l=R[2];break}if(!l){let A=T.match(/\{\{\s*default\s*\}\}([\s\S]*?)\{\{\s*\/default\s*\}\}/i);if(A)w=A[1]}L+=y(l||w),k=p.closeEnd;continue}}}let x=I.match(/^\.([A-Za-z_][A-Za-z0-9_]*)\s*(=|\+=|-=)\s*([\s\S]+)$/);if(x){let g=x[1],p=x[2],h=y(x[3]).trim(),T=Number(h);if(p==="="){if(r[g]=h,h!==""&&Number.isFinite(T))i[g]=T}else{let l=i[g]??Number(c(g)??0)??0,w=p==="+="?l+(Number.isFinite(T)?T:0):l-(Number.isFinite(T)?T:0);i[g]=w,r[g]=String(w)}k=_;continue}let N=I.match(/^\.([A-Za-z_][A-Za-z0-9_]*)(\+\+|--)$/);if(N){let g=N[1],p=i[g]??Number(c(g)??0)??0,h=N[2]==="++"?p+1:p-1;i[g]=h,r[g]=String(h),L+=String(h),k=_;continue}if(/^[.@$][A-Za-z_][A-Za-z0-9_]*$/.test(I)){let g=I.slice(1),p=c(g);if(p===void 0)d.missingRefs.add(g);else L+=p;k=_;continue}let C=I.includes("::")?qt(I):I.split(/\s+/),v=(C[0]??"").trim().toLowerCase(),u=C.slice(1).map((g)=>y(g));if(v==="space")L+=" ";else if(v==="newline"||v==="nl"||v==="n")L+=`
`;else if(v==="noop")L+="";else if(v==="getvar"||v==="getchatvar"){let g=(u[0]??"").trim(),p=c(g);if(p===void 0)d.missingRefs.add(g);else L+=p}else if(v==="setvar"){let g=(u[0]??"").trim(),p=u[1]??"";if(g){r[g]=p;let h=Number(p);if(p.trim()!==""&&Number.isFinite(h))i[g]=h}}else if(v==="hasvar"||v==="haschatvar"||v==="varexists"){let g=(u[0]??"").trim();L+=c(g)!==void 0?"true":"false"}else if(v==="calc"||v==="math"||v==="evaluate"){let g=u.join("::"),p=je(g,i,n,d);if(p!==void 0)L+=String(p)}else if(v==="round"){let g=Number(u[0]),p=u[1]!==void 0?Math.max(0,Math.min(6,Math.round(Number(u[1])||0))):0;if(Number.isFinite(g))L+=String(Math.round(g*10**p)/10**p)}else if(v==="floor"){let g=Number(u[0]);if(Number.isFinite(g))L+=String(Math.floor(g))}else if(v==="ceil"){let g=Number(u[0]);if(Number.isFinite(g))L+=String(Math.ceil(g))}else if(v==="abs"){let g=Number(u[0]);if(Number.isFinite(g))L+=String(Math.abs(g))}else if(v==="min"){let g=u.map(Number).filter(Number.isFinite);if(g.length)L+=String(Math.min(...g))}else if(v==="max"){let g=u.map(Number).filter(Number.isFinite);if(g.length)L+=String(Math.max(...g))}else if(v==="clamp"){let[g,p,h]=u.map(Number);if(Number.isFinite(g)&&Number.isFinite(p)&&Number.isFinite(h))L+=String(Math.max(p,Math.min(h,g)))}else if(v==="mod"){let g=Number(u[0]),p=Number(u[1]);if(Number.isFinite(g)&&Number.isFinite(p)&&p!==0)L+=String(g%p)}else if(v==="and")L+=u.length&&u.every(It)?"true":"";else if(v==="or")L+=u.some(It)?"true":"";else if(v==="not")L+=!It(u[0]??"")?"true":"";else if(["eq","ne","gt","lt","gte","lte"].includes(v)){let g=u[0]?.trim()??"",p=u[1]?.trim()??"",h=Number(g),T=Number(p),l=g!==""&&p!==""&&Number.isFinite(h)&&Number.isFinite(T),w=!1;if(v==="eq")w=l?h===T:g===p;else if(v==="ne")w=l?h!==T:g!==p;else if(v==="gt")w=l?h>T:g>p;else if(v==="lt")w=l?h<T:g<p;else if(v==="gte")w=l?h>=T:g>=p;else if(v==="lte")w=l?h<=T:g<=p;L+=w?"true":""}else if(v==="empty"||v==="isempty")L+=(u[0]??"")===""?"true":"";else if(v==="blank"||v==="isblank")L+=(u[0]??"").trim()===""?"true":"";else if(v==="default"||v==="fallback"||v==="coalesce")L+=u.find(It)??"";else if(v==="matches"){let[g="",p="",h=""]=u;if(p)try{L+=new RegExp(p,h).test(g)?"true":""}catch{L+=g.toLowerCase().includes(p.toLowerCase())?"true":""}}else if(v==="includes"||v==="contains"||v==="inlist"){let g=(u[0]??"").split(",").map((p)=>p.trim()).filter(Boolean);L+=g.includes((u[1]??"").trim())?"true":""}else if(v==="upper"||v==="uppercase"||v==="toupper")L+=(u[0]??"").toUpperCase();else if(v==="lower"||v==="lowercase"||v==="tolower")L+=(u[0]??"").toLowerCase();else if(v==="len"||v==="length")L+=String((u[0]??"").length);else if(v==="replace")L+=(u[2]??"").split(u[0]??"").join(u[1]??"");else if(v==="split"){let g=(u[0]??"").split(u[1]??","),p=Number(u[2]??0),h=p<0?g.length+p:p;L+=(g[h]??"").trim()}else if(v==="wrap"){let g=u[2]??"";L+=g?`${u[0]??""}${g}${u[1]??""}`:""}else if(v==="switch"){let g=(u[0]??"").trim(),p="";for(let h=1;h+1<u.length;h+=2)if(u[h].trim()===g){p=u[h+1];break}if(!p&&u.length%2===0)p=u[u.length-1];L+=p}else L+=S.slice(k,_);k=_}return L},P=y(t).split(`
`).map((S)=>S.trimEnd()).filter((S)=>S.trim()!=="").join(`
`).trim(),m=Number(P);if(P!==""&&Number.isFinite(m))i.value=m,i.result=m;return{text:P,locals:i,strLocals:r,missingRefs:[...d.missingRefs],error:d.error}}function Aa(t,n,s={},a={}){let i=t.trim();if(!i)return{value:void 0,locals:{},missingRefs:[],error:"Formula is empty"};if(i.includes("{{")&&i.includes("}}")){let f=Pa(i,n,s,a);return{value:f.text!==""&&Number.isFinite(Number(f.text))?Number(f.text):f.locals.value,textOutput:f.text||void 0,locals:f.locals,missingRefs:f.missingRefs,error:f.error}}if($a(i))return{value:void 0,locals:{},missingRefs:[],isProse:!0,error:'Plain-English rule detected — click "Convert to Local Formula" to translate it into math/macro syntax.'};let r={...a},d={missingRefs:new Set},o=i.split(/\r?\n|;/).map((f)=>f.trim()).filter((f)=>Boolean(f)&&!f.startsWith("//")&&!f.startsWith("#"));if(!o.length)return{value:void 0,locals:r,missingRefs:[],error:"Formula is empty"};let c;for(let f of o){let y=f.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([\s\S]+)$/);if(y&&!y[2].startsWith("=")){let P=y[1],m=y[2],S=je(m,r,n,d);if(S===void 0)return{value:void 0,locals:r,missingRefs:[...d.missingRefs],error:d.error};r[P]=S,c=S}else{let P=je(f,r,n,d);if(P===void 0)return{value:void 0,locals:r,missingRefs:[...d.missingRefs],error:d.error};c=P}}if(c!==void 0)r.value=c,r.result=c;return{value:c,locals:r,missingRefs:[...d.missingRefs],error:d.error}}function An(t,n,s){let a=(m,S)=>{if(!t.modifiers?.length)return 0;let L=0;for(let k of t.modifiers){if(k.statId!==m)continue;if(S?k.targetActorId===S:!k.targetActorId)L+=Number.isFinite(k.delta)?k.delta:0}return L},i={location:t.scene.location||"",time:t.scene.timeLabel||"",date:t.scene.dateLabel||"",weather:t.scene.weather||"",turn:String(t.turnCount),player_name:t.player.name||"User",player_attire:t.player.attire||"",player_condition:t.player.condition||""},r={turn:t.turnCount,elapsed_minutes:t.elapsedMinutes},d=(m,S)=>{if(typeof S==="number")return!0;if(typeof S!=="string")return!1;if(m.displayStyle==="feed_cards"||m.displayStyle==="quote_callout")return!1;let L=S.trim();if(!L||L==="None")return!1;if(L.includes(`
`)||L.length>110)return!1;return!0};if(s){i.name=s.name,i.conditions=s.conditions.join(", "),i.demeanor=s.demeanor||"",i.attire=s.attire||"";for(let[m,S]of Object.entries(s.fields))if(S)i[m]=S;for(let m of n){if(!m.enabled||m.scope!=="character")continue;let S=s.meters[m.id],L=S?.calibrated?S.value:m.defaultValue;if(i[m.id]=String(L??""),!d(m,L))continue;for(let[k,_]of Object.entries(Kt(L))){let I=k==="value"?m.id:k;if(r[I]===void 0)r[I]=_,i[I]=String(_)}}}else{i.name=t.player.name||"User",i.conditions=t.player.condition||"",i.attire=t.player.attire||"";for(let m of n){if(!m.enabled||m.scope==="character")continue;let S=t.stats[m.id],L=S?.calibrated?S.value:m.defaultValue;if(i[m.id]=String(L??""),!d(m,L))continue;for(let[k,_]of Object.entries(Kt(L))){let I=k==="value"?m.id:k;if(r[I]===void 0)r[I]=_,i[I]=String(_)}}}let o=(m,S,L,k)=>{if(S){let _=Kt(m);if(_[S]!==void 0)return _[S];return _[S.toLowerCase()]}if(typeof m==="number"&&Number.isFinite(m))return m+a(L,k);if(typeof m==="string"){let _=Number(m);if(Number.isFinite(_))return _+a(L,k)}return},c=Object.values(t.characters).find((m)=>m.present);return{ctx:{resolveRef:(m)=>{let S=m.trim();if(!S)return;if(S.startsWith("character:")){let k=S.slice(10).split("."),_=k[0],I=k[1],b=k[2];if(!_||!I)return;let x=t.characters[_];return x?o(x.meters[I]?.value,b,I,x.id):void 0}if(S.startsWith("first_present.")){let k=S.slice(14).split("."),_=k[0];if(!_||!c)return;return o(c.meters[_]?.value,k[1],_,c.id)}if(S.startsWith("self.")){let k=S.slice(5).split("."),_=k[0],I=k[1];if(s){let b=o(s.meters[_]?.value,I,_,s.id);if(b!==void 0)return b}return o(t.stats[_]?.value,I,_)}if(S.includes(".")){let[k,_]=S.split(".",2);if(k&&_){if(s&&s.meters[k]){let I=o(s.meters[k]?.value,_,k,s.id);if(I!==void 0)return I}if(t.stats[k]){let I=o(t.stats[k]?.value,_,k);if(I!==void 0)return I}}}if(s&&s.meters[S]){let k=o(s.meters[S]?.value,void 0,S,s.id);if(k!==void 0)return k}if(t.stats[S]){let k=o(t.stats[S]?.value,void 0,S);if(k!==void 0)return k}if(r[S]!==void 0)return r[S];let L=S.toLowerCase();for(let[k,_]of Object.entries(r))if(k.toLowerCase()===L)return _;return},resolveStringRef:(m)=>{let S=m.trim();if(!S)return;if(Object.prototype.hasOwnProperty.call(i,S))return i[S];let L=S.toLowerCase();for(let[k,_]of Object.entries(i))if(k.toLowerCase()===L)return _;if(s&&s.meters[S]!==void 0)return String(s.meters[S].value);if(t.stats[S]!==void 0)return String(t.stats[S].value);return},hasCond:(m)=>{let S=m.split(/[|,;]+/).map((_)=>_.trim().toLowerCase()).filter(Boolean);if(!S.length)return!1;let L=[];if(s){L.push(...s.conditions,s.demeanor,s.attire);for(let _ of Object.values(s.meters))if(typeof _.value==="string")L.push(_.value)}else{L.push(t.player.condition,t.player.attire);for(let _ of Object.values(t.stats))if(typeof _.value==="string")L.push(_.value)}let k=L.join(" ").toLowerCase();return S.some((_)=>k.includes(_))}},strVars:i,numVars:r}}function _a(t,n){let s=t.formulaOutputTemplate?.trim();if(s){let a=!1,i=s.replace(/\{([A-Za-z0-9_]+)\}/g,(r,d)=>{if(n.locals[d]!==void 0)return a=!0,String(n.locals[d]);let o=d.toLowerCase();for(let[c,f]of Object.entries(n.locals))if(c.toLowerCase()===o)return a=!0,String(f);return"—"});return a?i:void 0}if(n.textOutput!==void 0)return n.textOutput;if(n.value===void 0)return;return Math.max(t.min,Math.min(t.max,n.value))}function Ea(t,n,s,a){let{numVars:i,strVars:r}=An(t,n,s==="character"?a:void 0),d={};for(let[o,c]of Object.entries(i))if(!Object.keys(i).some((y)=>y!==o&&y.toLowerCase()===o&&y!==y.toLowerCase()))d[o]=c;return{numTokens:d,strVars:r}}function Ds(t,n,s,a){let i=t.formula?.trim()??"",r=t.scope==="character"?a?n.characters[a]:Object.values(n.characters)[0]:void 0,d=r?r.name:n.player.name||"Player",o=Ea(n,s,t.scope,r);if(!i)return{locals:{},missingRefs:[],availableTokens:o.numTokens,availableStringVars:o.strVars,targetName:d};let{ctx:c,strVars:f,numVars:y}=An(n,s,r),P=Aa(i,c,f,y),m=_a(t,P);return{output:m,locals:P.locals,missingRefs:m!==void 0?[]:P.missingRefs,isProse:P.isProse,error:P.error,availableTokens:o.numTokens,availableStringVars:o.strVars,targetName:d}}function Rs(t){let n=[],s=0,a=null,i="";for(let r=0;r<t.length;r++){let d=t[r];if(a){if(i+=d,d==="\\"&&r+1<t.length)i+=t[++r];else if(d===a)a=null;continue}if(d==='"'||d==="'"){a=d,i+=d;continue}if(d==="("||d==="[")s++;else if((d===")"||d==="]")&&s>0)s--;else if(d===","&&s===0){n.push(i.trim()),i="";continue}i+=d}if(i.trim()||n.length)n.push(i.trim());return n}function Pn(t){let n=t.trim();if(n.startsWith('"')&&n.endsWith('"')||n.startsWith("'")&&n.endsWith("'"))return n.slice(1,-1);return n}function Na(t,n,s,a){let i=t.localRuleFormula?.trim()??"";if(!i)return{appliedEffects:[]};let r=`category:${t.id}:${a?.id??"player"}`;s.modifiers=(s.modifiers??[]).filter((m)=>m.source!==r);let d=An(s,n,a),o={...d.numVars},c={missingRefs:new Set},f=[],y=i.split(/\r?\n|;/).map((m)=>m.trim()).filter((m)=>Boolean(m)&&!m.startsWith("//")&&!m.startsWith("#")),P=(m)=>{let S=m.match(/^if\s*\(([\s\S]+?)\)\s+(mod|set|add)\s*\(([\s\S]+)\)$/i);if(S){let I=je(S[1],o,d.ctx,c);if(I!==void 0&&I!==0&&!Number.isNaN(I))P(`${S[2]}(${S[3]})`);return}let L=m.match(/^mod\s*\(([\s\S]+)\)$/i);if(L){let I=Rs(L[1]);if(I.length<3){c.error="mod() requires (statId, label, deltaExpression)";return}let b=Pn(I[0]),x=Pn(I[1])||t.name,N=je(I.slice(2).join(","),o,d.ctx,c);if(N===void 0||N===0)return;let v={id:`catmod_${le(t.id)}_${le(a?.id??"player")}_${le(b)}_${le(x)}`,label:x,statId:b,...a?{targetActorId:a.id}:{},delta:Math.round(N),source:r};s.modifiers.push(v),f.push(`${a?`${a.name} · `:""}${b} ${v.delta>=0?`+${v.delta}`:v.delta} (${x})`);return}let k=m.match(/^(set|add)\s*\(([\s\S]+)\)$/i);if(k){let I=k[1].toLowerCase(),b=Rs(k[2]);if(b.length<2){c.error=`${I}() requires (statId, expression)`;return}let x=Pn(b[0]),N=je(b.slice(1).join(","),o,d.ctx,c);if(N===void 0)return;let C=n.find((v)=>v.id===x);if(a&&(C?.scope==="character"||a.meters[x])){let v=a.meters[x];if(v?.locked||C?.locked)return;let u=typeof v?.value==="number"?v.value:0,g=I==="add"?u+N:N,p=C?Math.max(C.min,Math.min(C.max,Math.round(g))):Math.round(g);a.meters[x]={value:p,calibrated:!0,locked:!1,lastReason:`Category rule: ${t.name}`},f.push(`${a.name} · ${x} = ${p}`)}else if(C&&C.scope!=="character"){let v=s.stats[x];if(v?.locked||C.locked)return;let u=typeof v?.value==="number"?v.value:0,g=I==="add"?u+N:N,p=Math.max(C.min,Math.min(C.max,Number(g.toFixed(2))));s.stats[x]={id:x,scope:C.scope,value:p,calibrated:!0,locked:!1,lastReason:`Category rule: ${t.name}`},f.push(`${x} = ${p}`)}return}let _=m.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([\s\S]+)$/);if(_&&!_[2].startsWith("=")){let I=_[1],b=je(_[2],o,d.ctx,c);if(b!==void 0)o[I]=b}};for(let m of y)if(P(m),c.error)break;return{appliedEffects:f,error:c.error}}function Fs(t,n,s,a){let i=structuredClone(n),o=s.filter((c)=>c.enabled&&c.categoryId===t.id).some((c)=>c.scope==="character")||/\bmod\s*\(|\bself\./i.test(t.localRuleFormula??"")?a?i.characters[a]:Object.values(i.characters)[0]:void 0;return Na(t,s,i,o)}function Ue(t,n){if(!t||!t.length)return"";let s=[...t].sort((a,i)=>i.value-a.value);for(let a of s)if(n>=a.value)return a.label;return s.at(-1)?.label??""}function lt(t){let n=Math.max(0,Math.round(t))+480,s=Math.floor(n%1440/60),a=n%60,i=s>=12?"PM":"AM",r=s%12===0?12:s%12;return`${String(r).padStart(2,"0")}:${String(a).padStart(2,"0")} ${i}`}function Hs(t){return`Day ${Math.floor(Math.max(0,t)/1440)+1} · ${lt(t)}`}function Ne(t){let n=Math.floor(Math.max(0,t.elapsedMinutes)/1440)+1,s=t.scene.timeLabel?.trim()||lt(t.elapsedMinutes),a=t.scene.dateLabel?.trim()||`Day ${n}`,i=t.scene.location?.trim()||t.title||"Uncharted Scene",r=t.scene.weather?.trim()||"Clear";return{time:s,date:a,location:i,weather:r,formatted:`[ \uD83D\uDD70️ ${s} | \uD83D\uDCC5 ${a} | \uD83D\uDCCD ${i} | \uD83C\uDF26️ ${r} ]`}}function ge(t,n){let s=t.fields[n];if(s&&s.trim())return s.trim();if(n==="role_summary")return t.roleSummary||"";if(n==="demeanor")return t.demeanor||"";if(n==="inner_thought")return t.innerThought||"";if(n==="immediate_goal")return t.immediateGoal||"";if(n==="attire_layers")return t.attire||"";return""}function $t(t,n){let s=t.dossierFields.find((a)=>a.id===n);return s?s.enabled:!1}function Lt(t){if(["text","tags","tier","skill_tree","xp_level","attributes","inventory","status_fx"].includes(t.kind))return!0;if(t.displayStyle&&t.displayStyle!=="auto")return!0;return/\[[^\]]*\]|->|→|\b(?:format|write\s+in|write\s+this|saw\/heard|impulse\s*:)\b/i.test(t.triggerCues)}function Pt(t,n=""){let s=`${t} ${n}`.toLowerCase();if(/\b(?:rival|enemy|nemesis|hostile|antagonist|foe|hatred|bitter|estranged|ex-|ex\b|breakup|broken\s+up|betray|furious|resent|adversary|suspicious|threat)\b/.test(s))return"rival";if(/\b(?:sister|brother|sibling|mother|mom|father|dad|parent|son|daughter|cousin|aunt|uncle|family|twin|niece|nephew|guardian)\b/.test(s))return"family";if(/\b(?:lover|partner|wife|husband|spouse|fianc[eé]e?|boyfriend|girlfriend|crush|sweetheart|romantic|beloved|infatuat)\b/.test(s))return"romance";if(/\b(?:boss|employer|employee|subordinate|maid|butler|servant|retainer|master|teacher|student|mentor|apprentice|client|doctor|colleague|coworker|captain|commander)\b/.test(s))return"professional";if(/\b(?:friend|best\s+friend|ally|companion|confidant|buddy|comrade|roommate|childhood|pal|trusted|protector)\b/.test(s))return"friend";return"neutral"}var de="player",Gt="web",Pe={family:{icon:"\uD83D\uDC9B",label:"Family",color:"#f59e0b"},friend:{icon:"\uD83D\uDC99",label:"Friend / Ally",color:"#38bdf8"},romance:{icon:"\uD83E\uDE77",label:"Romance",color:"#f472b6"},rival:{icon:"❤️",label:"Rival / Tense",color:"#f43f5e"},professional:{icon:"\uD83D\uDCBC",label:"Work / Duty",color:"#a78bfa"},neutral:{icon:"⚪",label:"Acquaintance",color:"#94a3b8"}},_n=["Best Friend","Protective Sister","Younger Brother","Childhood Friend","Trusted Ally","Romantic Interest","Partner / Lover","Rival","Suspicious Stranger","Employer / Boss","Loyal Retainer"];function Ra(t){let n=t.trim().split(/\s+/).filter(Boolean);if(n.length>=2)return`${n[0][0]??""}${n[1][0]??""}`.toUpperCase();return(t.trim().slice(0,2)||"?").toUpperCase()}function ct(t){if(t.bondToPlayer?.label)return{...t.bondToPlayer,category:t.bondToPlayer.category??Pt(t.bondToPlayer.label,t.bondToPlayer.note)};let n=t.fields.bond_dynamic||t.roleSummary||"Acquaintance";return{label:n,category:Pt(n)}}function En(t){if(t.bondFromPlayer?.label)return{...t.bondFromPlayer,category:t.bondFromPlayer.category??Pt(t.bondFromPlayer.label,t.bondFromPlayer.note)};return{label:"Not defined yet",category:"neutral"}}function Os(t,n){let s=t.snapshot.state.player.name||"You",a=En(n),i=ct(n);t.modals.open({title:`\uD83D\uDD17 Edit Bond: ${s} ⇄ ${n.name}`,width:560},(r,d)=>{let o=e("label","ls-label",`Your Bond to ${n.name} (${s} → ${n.name})`),c=e("input","ls-input");c.placeholder="e.g. Younger Brother, Best Friend, Wary Ally…",c.value=a.label==="Not defined yet"?"":a.label,o.append(c);let f=e("div","ls-row");for(let v of _n.slice(0,6))f.append(B(v,()=>{c.value=v},"ls-btn-sm ls-quick-pill"));o.append(f);let y=e("label","ls-label",`Why / Note for ${s} → ${n.name} (Optional)`),P=e("input","ls-input");P.placeholder="e.g. Relies on her for advice…",P.value=a.note??"",y.append(P);let m=e("label","ls-label",`${n.name}'s Bond to You (${n.name} → ${s})`),S=e("input","ls-input");S.placeholder="e.g. Protective Elder Sister, Strict Boss…",S.value=i.label,m.append(S);let L=e("div","ls-row");for(let v of _n.slice(0,6))L.append(B(v,()=>{S.value=v},"ls-btn-sm ls-quick-pill"));m.append(L);let k=e("label","ls-label",`Why / Note for ${n.name} → ${s} (Optional)`),_=e("input","ls-input");_.placeholder="e.g. Secretly worries about you…",_.value=i.note??"",k.append(_);let I=i.category??a.category??"neutral",b=e("div","ls-label","Bond Type / Color"),x=e("div","ls-row"),N=()=>{for(let v of[...x.querySelectorAll("button")])v.setAttribute("aria-current",v.dataset.cat===I?"page":"false")};for(let[v,u]of Object.entries(Pe)){let g=B(`${u.icon} ${u.label}`,()=>{I=v,N()},"ls-btn-sm");g.dataset.cat=v,x.append(g)}N(),b.append(x);let C=B("\uD83D\uDCBE Save Two-Way Bond",()=>{let v=c.value.trim(),u=S.value.trim()||n.roleSummary||"Acquaintance";t.request("state:mutate",{patch:{characters:[{id:n.id,name:n.name,roleSummary:u,bondToPlayer:{label:u,..._.value.trim()?{note:_.value.trim()}:{},category:I},...v?{bondFromPlayer:{label:v,...P.value.trim()?{note:P.value.trim()}:{},category:I}}:{}}]},reason:`Updated bond ${s} ⇄ ${n.name}`}),d()},"ls-btn-primary");r.append(o,y,m,k,b,C)})}function Vs(t){return t.filter((n)=>n.enabled&&n.scope==="character"&&["meter","number","clock","pips","hearts","currency"].includes(n.kind)&&!(n.displayStyle&&n.displayStyle!=="auto"))}function Ws(t,n){if(!t)return null;let s=new Map(n.map((r)=>[r.id,r])),a=Object.entries(t).filter(([r,d])=>{let o=s.get(r);if(!o||!o.enabled)return!1;return d!==void 0&&d!==""&&d!=="None"});if(!a.length)return null;let i=e("div","ls-cast-mini-grid");i.style.marginTop="4px";for(let[r,d]of a){let o=s.get(r),c=e("div","ls-cast-mini-meter");c.style.setProperty("--ls-bar-color",o.color||"var(--ls-primary)");let f=e("div","ls-row-between");if(f.append(e("small","ls-muted",`${o.icon} ${o.label}`),e("strong","",String(d))),c.append(f),typeof d==="number"){let y=Math.max(1,o.max-o.min),P=e("div","ls-bar-track"),m=e("div","ls-bar-fill");if(o.min<0&&o.max>0){P.dataset.bipolar="true";let S=(0-o.min)/y*100;if(d>=0)m.style.marginLeft=`${S.toFixed(1)}%`,m.style.width=`${Math.min(100-S,d/o.max*(100-S)).toFixed(1)}%`;else{let L=Math.abs(d)/Math.abs(o.min)*S;m.style.marginLeft=`${Math.max(0,S-L).toFixed(1)}%`,m.style.width=`${Math.min(S,L).toFixed(1)}%`,m.style.background="var(--ls-danger)"}}else{let S=Math.max(0,Math.min(100,Math.round((d-o.min)/y*100)));m.style.width=`${S}%`}P.append(m),c.append(P)}i.append(c)}return i}function qe(t,n,s){let{state:a,template:i}=t.snapshot,r=Object.values(a.characters).filter((o)=>o.id!==n.id),d=Vs(i.stats);t.modals.open({title:s?`\uD83E\uDD1D Edit NPC Bond: ${n.name} ⇄ ${s.toName}`:`➕ Add Bond from ${n.name} to Another NPC`,width:560},(o,c)=>{let f=e("label","ls-label",`Other Character (${n.name} → ?)`),y=e("input","ls-input");if(y.placeholder=r.length?`e.g. ${r.map((T)=>T.name).join(", ")} or another NPC name`:"Enter NPC name…",y.value=s?.toName??(r[0]?.name??""),f.append(y),r.length>0){let T=e("div","ls-row");for(let l of r)T.append(B(`\uD83D\uDC64 ${l.name}`,()=>{y.value=l.name},"ls-btn-sm"));f.append(T)}let P=e("label","ls-label",`${n.name}'s Relation to Them`),m=e("input","ls-input");m.placeholder="e.g. Older Sister, Ex-Fiancé, Rival, Boss…",m.value=s?.label??"",P.append(m);let S=e("div","ls-row");for(let T of _n.slice(0,6))S.append(B(T,()=>{m.value=T},"ls-btn-sm ls-quick-pill"));P.append(S);let L=e("label","ls-label","Why / Dynamic Note (Optional)"),k=e("input","ls-input");k.placeholder="e.g. Still bitter about what happened last summer…",k.value=s?.attitude??"",L.append(k);let I=(s?a.characters[s.toId]:r[0])?.peerBonds?.[n.id],b=new Map;if(d.length>0){let T=e("div","ls-label",`${n.name}'s Stats Toward Them`),l=e("div","ls-grid");for(let w of d){let M=s?.meters?.[w.id]??w.defaultValue,R=e("label","ls-label",`${w.icon} ${w.label} (${w.min}..${w.max})`),A=e("input","ls-input");A.type="number",A.min=String(w.min),A.max=String(w.max),A.step=String(w.step||1),A.value=String(typeof M==="number"?M:w.defaultValue),R.append(A),l.append(R),b.set(w.id,A)}T.append(l),o.append(T)}let x=e("label","ls-label",`Their Relation Back to ${n.name} (Optional)`),N=e("input","ls-input");N.placeholder="e.g. Younger Brother, Loyal Friend…",N.value=I?.label??"",x.append(N);let C=new Map;if(d.length>0){let T=e("div","ls-label",`Their Stats Back Toward ${n.name} (Optional)`),l=e("div","ls-grid");for(let w of d){let M=I?.meters?.[w.id]??w.defaultValue,R=e("label","ls-label",`${w.icon} ${w.label} (${w.min}..${w.max})`),A=e("input","ls-input");A.type="number",A.min=String(w.min),A.max=String(w.max),A.step=String(w.step||1),A.value=String(typeof M==="number"?M:w.defaultValue),R.append(A),l.append(R),C.set(w.id,A)}T.append(l),x.append(T)}let v=s?.category??Pt(s?.label??"",s?.attitude??""),u=e("div","ls-label","Bond Type / Color"),g=e("div","ls-row"),p=()=>{for(let T of[...g.querySelectorAll("button")])T.setAttribute("aria-current",T.dataset.cat===v?"page":"false")};for(let[T,l]of Object.entries(Pe)){let w=B(`${l.icon} ${l.label}`,()=>{v=T,p()},"ls-btn-sm");w.dataset.cat=T,g.append(w)}p(),u.append(g);let h=B("\uD83D\uDCBE Save NPC Bond",()=>{let T=y.value.trim();if(!T)return;let l=m.value.trim()||"Acquaintance",w=k.value.trim(),M={};for(let E of d){let D=Number(b.get(E.id)?.value);if(Number.isFinite(D))M[E.id]=Math.max(E.min,Math.min(E.max,Math.round(D)))}let R=[{id:n.id,name:n.name,peerBonds:[{target:T,label:l,attitude:w,category:v,meters:M}]}],A=N.value.trim();if(A){let E={};for(let D of d){let F=Number(C.get(D.id)?.value);if(Number.isFinite(F))E[D.id]=Math.max(D.min,Math.min(D.max,Math.round(F)))}R.push({name:T,peerBonds:[{target:n.name,label:A,attitude:I?.attitude??"",category:v,meters:E}]})}t.request("state:mutate",{patch:{characters:R},reason:`Updated bond ${n.name} ⇄ ${T}`}),c()},"ls-btn-primary");o.append(f,P,L,x,u,h)})}function Zt(t,n){let{state:s,template:a}=t.snapshot,i=Vs(a.stats),r=e("div","ls-stack"),d=Object.values(s.characters),o=s.player.name||"You";if(de!=="player"&&de!=="all"&&!s.characters[de])de="player";let c=e("div","ls-row-between"),f=e("div","ls-row");f.append(e("span","ls-kicker","Focus:"));let y=B(`\uD83D\uDC64 ${o}`,()=>{de="player",t.emitChange()},"ls-btn-sm");if(de==="player")y.setAttribute("aria-current","page");f.append(y);for(let x of d){let N=B(`${x.present?"\uD83D\uDFE2":"⚪"} ${x.name}`,()=>{de=x.id,t.selectedActorId=x.id,t.emitChange()},"ls-btn-sm");if(de===x.id)N.setAttribute("aria-current","page");f.append(N)}if(d.length>=2){let x=B("\uD83D\uDD78️ Full Web",()=>{de="all",t.emitChange()},"ls-btn-sm");if(de==="all")x.setAttribute("aria-current","page");f.append(x)}let P=e("div","ls-row");if(P.append(B(Gt==="web"?"\uD83D\uDCCB Cards Only":"\uD83D\uDD78️ Show Map",()=>{Gt=Gt==="web"?"cards":"web",t.emitChange()},"ls-btn-sm")),d.length>0){let x=(de!=="player"&&de!=="all"?s.characters[de]:void 0)??(t.selectedActorId?s.characters[t.selectedActorId]:void 0)??d[0];P.append(B("+ Add NPC Bond",()=>qe(t,x),"ls-btn-sm ls-btn-primary"))}if(c.append(f,P),r.append(c),!d.length){let x=e("div","ls-card");return x.append(e("strong","","Bond Web Ready"),e("p","ls-muted","Once characters appear in chat, your two-way relations with them and their relations with each other will appear here.")),r.append(x),r}let m=e("div","ls-web-legend"),S=e("div","ls-row");for(let x of Object.values(Pe)){let N=e("span","ls-web-legend-item"),C=e("span","ls-web-swatch");C.style.background=x.color,N.append(C,document.createTextNode(`${x.icon} ${x.label}`)),S.append(N)}if(m.append(S),r.append(m),Gt==="web"){let x=e("div","ls-bw-stage"),N="http://www.w3.org/2000/svg",C=document.createElementNS("http://www.w3.org/2000/svg","svg");C.setAttribute("viewBox","0 0 100 100"),C.setAttribute("preserveAspectRatio","none"),C.classList.add("ls-bw-svg");let v=[];if(de==="player")v.push({id:"player",name:o,isPlayer:!0,present:!0,xPct:50,yPct:d.length===1?18:50,color:"#38bdf8"}),d.forEach((h,T)=>{let l=ct(h),w=Pe[l.category??"neutral"],M=50,R=82;if(d.length===1)M=50,R=82;else if(d.length===2)M=T===0?15:85,R=50;else{let A=T/d.length*Math.PI*2-Math.PI/2;M=50+Math.cos(A)*38,R=50+Math.sin(A)*35}v.push({id:h.id,name:h.name,isPlayer:!1,present:h.present,portraitUrl:h.portraitUrl,xPct:Number(M.toFixed(1)),yPct:Number(R.toFixed(1)),color:w.color})});else if(de!=="all"&&s.characters[de]){let h=s.characters[de],T=[{id:"player",name:o,isPlayer:!0,present:!0},...d.filter((l)=>l.id!==h.id).map((l)=>({id:l.id,name:l.name,isPlayer:!1,present:l.present,portraitUrl:l.portraitUrl}))];v.push({id:h.id,name:h.name,isPlayer:!1,present:h.present,portraitUrl:h.portraitUrl,xPct:50,yPct:T.length===1?18:50,color:"#38bdf8"}),T.forEach((l,w)=>{let M=50,R=82;if(T.length===1)M=50,R=82;else if(T.length===2)M=w===0?15:85,R=50;else{let E=w/T.length*Math.PI*2-Math.PI/2;M=50+Math.cos(E)*38,R=50+Math.sin(E)*35}let A=l.isPlayer?ct(h).category??"neutral":h.peerBonds?.[l.id]?.category??s.characters[l.id]?.peerBonds?.[h.id]?.category??"neutral";v.push({id:l.id,name:l.name,isPlayer:l.isPlayer,present:l.present,portraitUrl:l.portraitUrl,xPct:Number(M.toFixed(1)),yPct:Number(R.toFixed(1)),color:Pe[A].color})})}else{let h=[{id:"player",name:o,isPlayer:!0,present:!0,portraitUrl:void 0},...d.map((T)=>({id:T.id,name:T.name,isPlayer:!1,present:T.present,portraitUrl:T.portraitUrl}))];h.forEach((T,l)=>{let w=l/h.length*Math.PI*2-Math.PI/2,M=50+Math.cos(w)*37,R=50+Math.sin(w)*35,A=T.isPlayer?void 0:s.characters[T.id],E=A?ct(A).category??"neutral":"friend";v.push({id:T.id,name:T.name,isPlayer:T.isPlayer,present:T.present,portraitUrl:T.portraitUrl,xPct:Number(M.toFixed(1)),yPct:Number(R.toFixed(1)),color:Pe[E].color})})}let u=new Map(v.map((h)=>[h.id,h])),g=(h,T,l,w,M,R,A=0)=>{let E=(h.xPct+T.xPct)/2,D=(h.yPct+T.yPct)/2,F=T.xPct-h.xPct,O=T.yPct-h.yPct,V=Math.max(1,Math.hypot(F,O)),W=E+-O/V*A,H=D+F/V*A,j=document.createElementNS("http://www.w3.org/2000/svg","path");if(j.setAttribute("d",`M ${h.xPct} ${h.yPct} Q ${W.toFixed(1)} ${H.toFixed(1)} ${T.xPct} ${T.yPct}`),j.setAttribute("fill","none"),j.setAttribute("stroke",l),j.setAttribute("stroke-width","0.8"),j.setAttribute("stroke-opacity","0.82"),C.append(j),w.length>0){let z=0.25*h.xPct+0.5*W+0.25*T.xPct,U=0.25*h.yPct+0.5*H+0.25*T.yPct,K=e("div","ls-bw-edge-pill");K.style.setProperty("--ls-bond-color",l),K.style.left=`${Math.max(15,Math.min(85,z)).toFixed(1)}%`,K.style.top=`${Math.max(14,Math.min(86,U)).toFixed(1)}%`,K.title=M;for(let X of w)K.append(e("span","ls-bw-edge-line",X));K.addEventListener("click",(X)=>{X.stopPropagation(),R()}),x.append(K)}},p=(h,T,l,w)=>{let M=ct(h),R=En(h),A=M.category??R.category??"neutral",E=Pe[A].color,F=[M.label&&M.label!=="Acquaintance"?M.label:R.label!=="Not defined yet"?R.label:M.label],O=`You → ${h.name}: ${R.label}
${h.name} → You: ${M.label}`;g(T,l,E,F,O,()=>Os(t,h),w?-8:0)};if(de==="player"){let h=u.get("player");for(let T of d){let l=u.get(T.id);if(l)p(T,h,l,!1)}}else if(de!=="all"&&s.characters[de]){let h=s.characters[de],T=u.get(h.id),l=u.get("player");if(l)p(h,l,T,!1);for(let w of d){if(w.id===h.id)continue;let M=u.get(w.id);if(!M)continue;let R=h.peerBonds?.[w.id],A=w.peerBonds?.[h.id];if(!R&&!A)continue;let E=R?.category??A?.category??"neutral",D=[R?`${h.name} → ${w.name}: ${R.label}`:"",A?`${w.name} → ${h.name}: ${A.label}`:""].filter(Boolean),F=R?.label||A?.label||"Acquaintance";g(T,M,Pe[E].color,[F],D.join(`
`),()=>qe(t,h,R),0)}}else{let h=u.get("player");for(let l of d){let w=u.get(l.id);if(w)p(l,h,w,!0)}let T=new Set;for(let l of d){let w=u.get(l.id);if(!w)continue;for(let M of Object.values(l.peerBonds??{})){let R=u.get(M.toId);if(!R)continue;let A=[l.id,M.toId].sort().join("::");if(T.has(A))continue;T.add(A);let E=s.characters[M.toId]?.peerBonds?.[l.id],D=M.category??E?.category??"neutral",F=[`${l.name} → ${M.toName}: ${M.label}`,...E?[`${M.toName} → ${l.name}: ${E.label}`]:[]];g(w,R,Pe[D].color,[M.label||E?.label||"Peer"],F.join(`
`),()=>qe(t,l,M),16)}}}x.prepend(C);for(let h of v){let T=h.id===de,l=e("button","ls-bw-node");l.type="button",l.dataset.focal=String(T),l.style.left=`${h.xPct}%`,l.style.top=`${h.yPct}%`,l.style.setProperty("--ls-bond-color",h.color),l.title=`Click to focus ${h.name}'s bonds`;let w=e("div","ls-bw-avatar");if(h.portraitUrl){let M=e("img");M.src=h.portraitUrl,M.alt=h.name,w.append(M)}else w.append(document.createTextNode(h.isPlayer?"\uD83D\uDC64":Ra(h.name)));if(!h.isPlayer)w.append(e("span",`ls-roster-dot ${h.present?"is-present":"is-away"}`));l.append(w,e("span","ls-bw-name",h.name)),l.addEventListener("click",()=>{if(de=h.isPlayer?"player":h.id,!h.isPlayer)t.selectedActorId=h.id;t.emitChange()}),x.append(l)}r.append(x)}let L=de!=="player"&&de!=="all"&&s.characters[de]?[s.characters[de]]:d,k=e("div","ls-stack");k.append(e("span","ls-kicker",`\uD83D\uDC64 Your Bonds (${o} ⇄ Cast)`));for(let x of L){let N=ct(x),C=En(x),v=N.category??C.category??"neutral",u=Pe[v],g=e("div","ls-bw-pair-card");g.style.setProperty("--ls-bond-color",u.color);let p=e("div","ls-row-between"),h=e("div","ls-row");h.append(e("strong","",`${o} ⇄ ${x.name}`),e("span","ls-bw-cat-chip",`${u.icon} ${u.label}`)),h.lastElementChild.style.setProperty("--ls-bond-color",u.color);let T=e("div","ls-row");T.append(B("✏️ Edit Bond",()=>Os(t,x),"ls-btn-sm"),B("\uD83E\uDEAA Dossier",()=>n(x.id),"ls-btn-sm ls-btn-primary")),p.append(h,T),g.append(p);let l=e("div","ls-bw-two-col"),w=e("div","ls-bw-dir-box");w.append(e("small","ls-kicker",`Your Bond → ${x.name}`),e("strong","",C.label),...C.note?[e("small","ls-muted",C.note)]:[]);let M=e("div","ls-bw-dir-box");M.append(e("small","ls-kicker",`${x.name}'s Bond → You`),e("strong","",N.label),...N.note?[e("small","ls-muted",N.note)]:[]),l.append(w,M),g.append(l),k.append(g)}r.append(k);let _=[],I=new Set;for(let x of L){for(let[N,C]of Object.entries(x.peerBonds??{})){let v=s.characters[N];if(!v)continue;let u=[x.id,v.id].sort().join("::");if(I.has(u))continue;I.add(u),_.push({a:x,b:v,aToB:C,bToA:v.peerBonds?.[x.id]})}for(let N of d){if(N.id===x.id)continue;let C=N.peerBonds?.[x.id];if(!C)continue;let v=[x.id,N.id].sort().join("::");if(I.has(v))continue;I.add(v),_.push({a:x,b:N,aToB:x.peerBonds?.[N.id],bToA:C})}}let b=e("div","ls-stack");if(b.append(e("span","ls-kicker",`\uD83E\uDD1D Cast Bonds (NPC ⇄ NPC · ${_.length})`)),!_.length)b.append(e("p","ls-muted",'No NPC-to-NPC bonds recorded yet. They appear automatically when characters have an established relation in the story, or click "+ Add NPC Bond" above.'));else for(let x of _){let N=x.aToB?.category??x.bToA?.category??"neutral",C=Pe[N],v=e("div","ls-bw-pair-card");v.style.setProperty("--ls-bond-color",C.color);let u=e("div","ls-row-between"),g=e("div","ls-row");g.append(e("strong","",`${x.a.name} ⇄ ${x.b.name}`),e("span","ls-bw-cat-chip",`${C.icon} ${C.label}`)),g.lastElementChild.style.setProperty("--ls-bond-color",C.color);let p=e("div","ls-row");p.append(B("✏️ Edit Bond",()=>qe(t,x.a,x.aToB),"ls-btn-sm"),B("\uD83D\uDDD1️",()=>{let R=structuredClone(s.characters);if(R[x.a.id]?.peerBonds)delete R[x.a.id].peerBonds[x.b.id];if(R[x.b.id]?.peerBonds)delete R[x.b.id].peerBonds[x.a.id];t.request("state:mutate",{stateOverride:{characters:R},reason:`Removed bond ${x.a.name} ⇄ ${x.b.name}`})},"ls-btn-sm ls-btn-icon ls-btn-danger","Delete NPC bond")),u.append(g,p),v.append(u);let h=e("div","ls-bw-two-col"),T=e("div","ls-bw-dir-box");T.append(e("small","ls-kicker",`${x.a.name} → ${x.b.name}`),e("strong","",x.aToB?.label||"Not defined yet"),...x.aToB?.attitude?[e("small","ls-muted",x.aToB.attitude)]:[]);let l=Ws(x.aToB?.meters,i);if(l)T.append(l);let w=e("div","ls-bw-dir-box");w.append(e("small","ls-kicker",`${x.b.name} → ${x.a.name}`),e("strong","",x.bToA?.label||"Not defined yet"),...x.bToA?.attitude?[e("small","ls-muted",x.bToA.attitude)]:[]);let M=Ws(x.bToA?.meters,i);if(M)w.append(M);h.append(T,w),v.append(h),b.append(v)}return r.append(b),r}var zs=new Map;function Xt(t){let n=t.trim();if(!n.startsWith("{")&&!n.startsWith("["))return null;try{let s=JSON.parse(n);return s&&typeof s==="object"?s:null}catch{return null}}function Ba(t){let n=String(t??"").trim(),s=Xt(n);if(s&&Array.isArray(s.nodes)){let c=Math.max(0,Math.round(Number(s.sp??s.skillPoints??s.points??0)||0)),f=s.nodes.filter((y)=>Boolean(y&&typeof y==="object")).map((y)=>{let P=Math.max(0,Math.round(Number(y.level??0)||0)),m=Math.max(1,Math.round(Number(y.maxLevel??y.max??5)||5));return{name:String(y.name??"Skill").trim(),level:Math.min(m,P),maxLevel:m,cost:Math.max(1,Math.round(Number(y.cost??1)||1)),...typeof y.requires==="string"&&y.requires.trim()?{requires:y.requires.trim()}:{},...typeof y.bonus==="string"&&y.bonus.trim()?{bonus:y.bonus.trim()}:{},unlocked:P>0||y.unlocked===!0}});return{sp:c,nodes:f}}let a=0,i=n,r=n.match(/^(?:SP|Skill\s*Points?|Points?)\s*:\s*(\d+)\s*(?:\||;|\n|$)/i);if(r)a=Math.max(0,Math.round(Number(r[1])||0)),i=n.slice(r[0].length).trim();let d=[],o=i.split(/\s*(?:;|\n|\|)\s*/).map((c)=>c.trim()).filter(Boolean);for(let c of o){let f=c.match(/^([^(\[]+?)\s*(?:\(([^)]+)\)|\[([^\]]+)\])?$/),y=(f?.[1]??c).trim(),P=(f?.[2]??f?.[3]??"").trim();if(!y||/^(?:none|default)$/i.test(y))continue;let m=0,S=5,L=1,k="",_=[];for(let I of P.split(/\s*,\s*/).map((b)=>b.trim()).filter(Boolean)){let b=I.match(/^(?:lv\.?|lvl|rank)?\s*(\d+)\s*(?:\/\s*(\d+))?$/i),x=I.match(/^cost\s*:\s*(\d+)$/i),N=I.match(/^req(?:uires)?\s*:\s*(.+)$/i);if(b){if(m=Math.max(0,Number(b[1])||0),b[2])S=Math.max(1,Number(b[2])||5)}else if(x)L=Math.max(1,Number(x[1])||1);else if(N)k=N[1].trim();else _.push(I)}d.push({name:y,level:Math.min(S,m),maxLevel:S,cost:L,...k?{requires:k}:{},..._.length?{bonus:_.join(", ")}:{},unlocked:m>0})}return{sp:a,nodes:d}}function js(t){let n=t.nodes.map((s)=>{let a=[`Lv.${s.level}/${s.maxLevel}`,`cost:${s.cost}`];if(s.requires)a.push(`req:${s.requires}`);if(s.bonus)a.push(s.bonus);return`${s.name} (${a.join(", ")})`});return`SP: ${t.sp}${n.length?` | ${n.join(" ; ")}`:""}`}function dt(t,n,s,a){let i=Ba(n),r=e("div","ls-rpg-skill-wrap"),d=e("div","ls-row-between"),o=e("span","ls-rpg-sp-badge",`✦ ${i.sp} Skill Point${i.sp===1?"":"s"}`);if(d.append(o),!s&&a){let y=e("div","ls-row");y.append(B("+1 SP",()=>{let P={...i,sp:i.sp+1};a(js(P),`Granted +1 SP to ${t.label}`)},"ls-btn-sm")),d.append(y)}if(r.append(d),!i.nodes.length)return r.append(e("small","ls-muted",'No skill nodes yet. Format: "SP: 2 | Slash (Lv.1/5, cost:1) ; Parry (Lv.0/3, cost:1, req:Slash)"')),r;let c=new Map(i.nodes.map((y)=>[y.name.toLowerCase(),y.level])),f=e("div","ls-rpg-skill-grid");for(let[y,P]of i.nodes.entries()){let m=!P.requires||(c.get(P.requires.toLowerCase())??0)>0,S=P.level>=P.maxLevel,L=!s&&Boolean(a)&&m&&!S&&i.sp>=P.cost,k=e("div","ls-rpg-skill-node");k.dataset.unlocked=String(P.level>0),k.dataset.lockedReq=String(!m),k.dataset.maxed=String(S);let _=e("div","ls-row-between");_.append(e("strong","",`${S?"★ ":P.level>0?"◆ ":"◇ "}${P.name}`),e("span","ls-chip ls-chip-accent",`Lv.${P.level}/${P.maxLevel}`)),k.append(_);let I=e("div","ls-clock-bar");I.style.gridTemplateColumns=`repeat(${Math.min(10,P.maxLevel)}, 1fr)`;for(let b=1;b<=Math.min(10,P.maxLevel);b++)I.append(e("span",`ls-clock-seg${b<=P.level?" is-filled":""}`));if(k.append(I),P.bonus||P.requires){let b=[P.requires?`${m?"✓":"\uD83D\uDD12"} Req: ${P.requires}`:"",P.bonus||""].filter(Boolean);k.append(e("small","ls-muted",b.join(" · ")))}if(!s&&a){let b=e("div","ls-row-between");b.append(e("small","ls-muted",S?"MASTERED":`Cost: ${P.cost} SP`));let x=B(S?"✓ Max":`+ Rank (${P.cost} SP)`,()=>{let N=i.nodes.map((v,u)=>u===y?{...v,level:v.level+1,unlocked:!0}:v),C={sp:Math.max(0,i.sp-P.cost),nodes:N};a(js(C),`Upgraded ${P.name} to Lv.${P.level+1}`)},`ls-btn-sm ${L?"ls-btn-primary":""}`);x.disabled=!L,b.append(x),k.append(b)}f.append(k)}return r.append(f),r}function Da(t){let n=String(t??"").trim(),s=Xt(n);if(s&&!Array.isArray(s)){let f=Math.max(1,Math.round(Number(s.level??s.lv??1)||1)),y=Math.max(0,Math.round(Number(s.xp??s.current??0)||0)),P=Math.max(1,Math.round(Number(s.nextXp??s.max??f*100)||100));return{level:f,xp:y,nextXp:P,...typeof s.rank==="string"&&s.rank.trim()?{rank:s.rank.trim()}:{}}}let a=n.match(/(?:lv\.?|level)\s*(\d+)/i),i=n.match(/(\d+)\s*\/\s*(\d+)\s*(?:xp)?/i),r=n.match(/(?:rank|tier)\s*[:\-]?\s*([A-Za-z0-9+]+)/i),d=Math.max(1,Number(a?.[1]??1)||1),o=Math.max(0,Number(i?.[1]??(Number(n)||0))||0),c=Math.max(1,Number(i?.[2]??d*100)||100);return{level:d,xp:o,nextXp:c,...r?.[1]?{rank:r[1]}:{}}}function pt(t,n){let s=Da(n),a=Math.max(0,Math.min(100,Math.round(s.xp/Math.max(1,s.nextXp)*100))),i=e("div","ls-rpg-xp-wrap"),r=e("div","ls-row-between"),d=e("span","ls-rpg-level-crest",`LV. ${s.level}`),o=e("div","ls-row");if(s.rank)o.append(e("span","ls-chip ls-chip-accent",`Rank ${s.rank}`));o.append(e("small","ls-muted",`${s.xp.toLocaleString()} / ${s.nextXp.toLocaleString()} XP (${a}%)`)),r.append(d,o);let c=e("div","ls-bar-track ls-rpg-xp-track"),f=e("div","ls-bar-fill");return f.style.width=`${a}%`,f.style.setProperty("--ls-bar-color",t.color||"var(--ls-primary)"),c.append(f),i.append(r,c),i}function Fa(t,n=20){let s=String(t??"").trim(),a=Xt(s);if(a&&!Array.isArray(a))return Object.entries(a).filter(([,r])=>Number.isFinite(Number(r))).map(([r,d])=>{let o=Number(d);return{name:r,value:o,max:Math.max(n,o)}});let i=[];for(let r of s.split(/[,;\n|]+/).map((d)=>d.trim()).filter(Boolean)){let d=r.match(/^([A-Za-z0-9_ .-]{1,20})\s*[:=]\s*(-?\d+(?:\.\d+)?)(?:\s*\/\s*(\d+))?$/);if(d){let o=Number(d[2]),c=d[3]?Math.max(1,Number(d[3])):Math.max(n,o);i.push({name:d[1].trim(),value:o,max:c})}}return i}function Ha(t,n){let a=document.createElementNS("http://www.w3.org/2000/svg","svg");a.setAttribute("viewBox","0 0 220 190"),a.classList.add("ls-rpg-radar-svg");let i=110,r=96,d=62,o=t.length;for(let y of[0.33,0.66,1]){let P=t.map((S,L)=>{let k=L/o*Math.PI*2-Math.PI/2;return`${(i+Math.cos(k)*d*y).toFixed(1)},${(r+Math.sin(k)*d*y).toFixed(1)}`}),m=document.createElementNS("http://www.w3.org/2000/svg","polygon");m.setAttribute("points",P.join(" ")),m.setAttribute("fill","none"),m.setAttribute("stroke","rgba(148,163,184,0.28)"),m.setAttribute("stroke-width","1"),a.append(m)}let c=[];t.forEach((y,P)=>{let m=P/o*Math.PI*2-Math.PI/2,S=Math.max(0.1,Math.min(1,y.value/Math.max(1,y.max))),L=i+Math.cos(m)*d*S,k=r+Math.sin(m)*d*S;c.push(`${L.toFixed(1)},${k.toFixed(1)}`);let _=document.createElementNS("http://www.w3.org/2000/svg","line");_.setAttribute("x1",String(i)),_.setAttribute("y1",String(r)),_.setAttribute("x2",(i+Math.cos(m)*d).toFixed(1)),_.setAttribute("y2",(r+Math.sin(m)*d).toFixed(1)),_.setAttribute("stroke","rgba(148,163,184,0.22)"),_.setAttribute("stroke-width","1"),a.append(_);let I=document.createElementNS("http://www.w3.org/2000/svg","text");I.setAttribute("x",(i+Math.cos(m)*(d+17)).toFixed(1)),I.setAttribute("y",(r+Math.sin(m)*(d+14)+3).toFixed(1)),I.setAttribute("text-anchor","middle"),I.setAttribute("fill","currentColor"),I.setAttribute("font-size","9.5"),I.setAttribute("font-weight","700"),I.textContent=`${y.name.slice(0,6)} ${y.value}`,a.append(I)});let f=document.createElementNS("http://www.w3.org/2000/svg","polygon");return f.setAttribute("points",c.join(" ")),f.setAttribute("fill",n),f.setAttribute("fill-opacity","0.26"),f.setAttribute("stroke",n),f.setAttribute("stroke-width","2"),a.append(f),a}function ut(t,n,s){let a=Fa(n,t.max>0?t.max:20),i=e("div","ls-stack");if(i.style.gap="6px",!a.length)return i.append(e("small","ls-muted",String(n||"STR:10, DEX:10, INT:10, CHA:10"))),i;let r=`${s}:${t.id}`,d=zs.get(r)??!1,o=e("div"),c=()=>{if(o.replaceChildren(),d&&a.length>=3){let y=e("div","ls-rpg-radar-box");y.append(Ha(a,t.color||"var(--ls-primary)")),o.append(y);return}let f=e("div","ls-rpg-attr-grid");for(let y of a){let P=e("div","ls-rpg-attr-cell"),m=Math.floor((y.value-10)/2),S=y.max<=30?m>=0?`+${m}`:String(m):"";P.append(e("span","ls-kicker",y.name),e("strong","ls-rpg-attr-val",String(y.value)),...S?[e("small","ls-muted",`(${S})`)]:[]),f.append(P)}o.append(f)};if(a.length>=3){let f=e("div","ls-row-between");f.append(e("small","ls-muted",`${a.length} Core Attributes`),B(d?"⊞ Grid View":"\uD83D\uDD78️ Radar Chart",()=>{d=!d,zs.set(r,d),c()},"ls-btn-sm")),i.append(f)}return c(),i.append(o),i}function Oa(t){let n=String(t??"").trim(),s=Xt(n);if(Array.isArray(s))return s.filter((i)=>i&&typeof i==="object"&&i.name).map((i)=>({name:String(i.name),qty:Math.max(1,Number(i.qty??i.quantity??1)||1),rarity:Us(String(i.rarity??"common")),equipped:Boolean(i.equipped),...typeof i.note==="string"?{note:i.note}:{}}));let a=[];for(let i of n.split(/\s*(?:;|\n|\|)\s*/).map((r)=>r.trim()).filter(Boolean)){if(/^(?:none|empty)$/i.test(i))continue;let r=i.match(/^([^\[\]()]+?)(?:\s*x(\d+))?\s*(?:\[([^\]]+)\]|\(([^)]+)\))?$/i),d=(r?.[1]??i).trim(),o=Math.max(1,Number(r?.[2]??1)||1),c=(r?.[3]??r?.[4]??"").toLowerCase(),f=/\b(?:equipped|worn|active|main|offhand)\b/.test(c),y=Us(c);a.push({name:d,qty:o,rarity:y,equipped:f})}return a}function Us(t){if(/legendary|mythic|gold/.test(t))return"legendary";if(/epic|violet|purple/.test(t))return"epic";if(/rare|blue/.test(t))return"rare";if(/uncommon|green/.test(t))return"uncommon";return"common"}function mt(t){let n=Oa(t);if(!n.length)return e("small","ls-muted","Bag empty");let s=e("div","ls-rpg-loot-grid");for(let a of n){let i=e("div","ls-rpg-loot-card");i.dataset.rarity=a.rarity;let r=e("div","ls-row-between");if(r.append(e("strong","",`${a.equipped?"⚔️ ":"\uD83C\uDF92 "}${a.name}`),e("span","ls-chip",a.qty>1?`×${a.qty}`:a.rarity.toUpperCase())),i.append(r),a.equipped||a.rarity!=="common")i.append(e("small","ls-muted",[a.equipped?"Equipped":"",a.rarity!=="common"?a.rarity:""].filter(Boolean).join(" · ")));s.append(i)}return s}function Wa(t){let n=String(t??"").trim();if(!n||/^(?:none|normal|healthy|clear)$/i.test(n))return[];let s=[];for(let a of n.split(/\s*(?:;|,|\n|\|)\s*/).map((i)=>i.trim()).filter(Boolean)){let i="neutral",r=a;if(r.startsWith("+"))i="buff",r=r.slice(1).trim();else if(r.startsWith("-"))i="debuff",r=r.slice(1).trim();else if(/\b(?:burn|poison|bleed|stun|curse|tired|fluster|exhaust|wound|fear)\b/i.test(r))i="debuff";else if(/\b(?:shield|haste|bless|focus|regen|guard|inspir|armor|ward)\b/i.test(r))i="buff";let d=r.match(/^(.+?)\s*\(([^)]+)\)$/);s.push({name:(d?.[1]??r).trim(),kind:i,...d?.[2]?{duration:d[2].trim()}:{}})}return s}function ft(t){let n=Wa(t);if(!n.length)return e("small","ls-muted","No active effects");let s=e("div","ls-row");for(let a of n){let i=e("span","ls-rpg-fx-pill",`${a.kind==="buff"?"▲":a.kind==="debuff"?"▼":"●"} ${a.name}${a.duration?` (${a.duration})`:""}`);i.dataset.fxKind=a.kind,s.append(i)}return s}function ht(t,n,s,a,i){let r=Math.max(1,Math.min(10,t.max||5)),d=t.max>10?Math.round(n/Math.max(1,t.max)*r):Math.max(0,Math.min(r,Math.round(n))),o=e("div","ls-row");for(let c=1;c<=r;c++){let f=s&&c<=d,y=B(f?"❤️":"\uD83E\uDD0D",()=>{if(!a&&i){let P=t.max>10?Math.round((c===d?c-1:c)/r*t.max):c===d?c-1:c;i(P)}},"ls-btn-sm ls-btn-icon ls-rpg-heart-btn",`${t.label}: ${c}/${r}`);y.disabled=a||!i,o.append(y)}return o}function gt(t,n,s){let a=Number(n),i=Number.isFinite(a)?a.toLocaleString():String(n),r=e("div","ls-rpg-currency-box");if(r.append(e("strong","ls-rpg-currency-val",`${t.icon} ${i}`)),s!==0)r.append(e("span",`ls-delta ${s>0?"is-pos":"is-neg"}`,s>0?`+${s.toLocaleString()}`:s.toLocaleString()));return r}function Yt(t,n){t.modals.open({title:"\uD83D\uDD0A Multi-Voice TTS Director — Cast & Narrator Voices",width:680,maxHeight:800},(s,a,i,r)=>{let d=async()=>{r.clear(),s.replaceChildren(e("p","ls-muted","⏳ Loading Lumiverse TTS connections & voice catalogs…"));let o=await t.tts.listConnections(),c=t.settings,{state:f}=t.snapshot,y=Object.values(f.characters),P=c?.narratorConnectionId||o.find((g)=>g.is_default)?.id||o[0]?.id||"",m=P?await t.tts.listVoicesForConnection(P):[];s.replaceChildren();let S=e("section","ls-card"),L=e("div","ls-row-between");L.append(e("div","",""),e("span","ls-chip ls-chip-accent",`⚡ Cached Hits: ${t.tts.cacheHitCount} (0 Tokens Re-billed)`)),L.firstElementChild.append(e("span","ls-kicker","2-Tier Memory + IndexedDB Audio Cache"),e("h3","","\uD83C\uDF99️ Narrator & Reading Mode (Token Saver)")),S.append(L);let k=e("div","ls-row"),_=c?.ttsReadMode||"dialogue_only";for(let[g,p]of[["dialogue_only","\uD83D\uDCAC Dialogue Only (Recommended — Saves ~65% TTS Tokens)"],["narration_and_dialogue","\uD83D\uDCD6 Full Audiobook (Narrator + Character Voices)"],["narration_only","\uD83D\uDCDC Narration Only"]]){let h=B(p,()=>{t.request("settings:update",{settings:{ttsReadMode:g}}).then(()=>{d()})},"ls-btn-sm");if(_===g)h.setAttribute("aria-current","page");k.append(h)}if(S.append(k),!o.length){S.append(e("p","ls-muted","No TTS connections found yet. Create a TTS connection in Lumiverse (Connections → TTS Connections, e.g. Kokoro, ElevenLabs, OpenAI, or Google) to enable voice synthesis.")),s.append(S);return}let I=e("div","ls-grid"),b=e("div","ls-label","Narrator TTS Connection"),x=e("div");b.append(x);let N=e("label","ls-label","Narrator Voice ID"),C=e("input","ls-input");if(C.placeholder=m[0]?.id||"Default connection voice…",C.value=c?.narratorVoiceId||"",N.append(C),m.length>0){let g=e("div");g.style.marginTop="4px",N.append(g),te(t,r,g,{value:c?.narratorVoiceId||"",placeholder:"— Pick from connection voices —",ariaLabel:"Narrator Voice Catalog",options:[{value:"",label:"— Pick from connection voices —"},...m.map((p)=>({value:p.id,label:`${p.name} (${p.id})`}))],onChange:(p)=>{if(p)C.value=p}})}te(t,r,x,{value:c?.narratorConnectionId||"",ariaLabel:"Narrator TTS Connection",options:[{value:"",label:"Use Default Lumiverse TTS Connection"},...o.map((g)=>({value:g.id,label:`${g.name} (${g.provider}${g.voice?` · ${g.voice}`:""})`}))],onChange:(g)=>{t.request("settings:update",{settings:{narratorConnectionId:g}}).then(()=>void d())}}),I.append(b,N),S.append(I);let v=e("div","ls-row");v.append(B("\uD83D\uDCBE Save Narrator Voice",()=>{t.request("settings:update",{settings:{narratorVoiceId:C.value.trim()}}),t.notify("Saved Narrator TTS voice.")},"ls-btn-sm ls-btn-primary"),B("▶ Test Narrator",()=>{t.tts.playSegments([{kind:"narration",text:`The scene unfolds in ${f.scene.location||"the story"}.`,speakerName:"Narrator",connectionId:c?.narratorConnectionId||"",voiceId:C.value.trim(),speed:c?.narratorSpeed||1}])},"ls-btn-sm")),S.append(v),s.append(S);let u=e("section","ls-card");if(u.append(e("span","ls-kicker","Per-Character Voice Profiles"),e("h3","",`\uD83D\uDC65 Cast Voices (${y.length} Characters)`),e("p","ls-muted","Assign each character their own distinct voice and speed. Quoted lines spoken by that character automatically route to their voice.")),!y.length)u.append(e("p","ls-muted","No characters in the cast yet."));else{let g=n?[...y.filter((p)=>p.id===n),...y.filter((p)=>p.id!==n)]:y;for(let p of g){let h=e("div","ls-stat-cell");if(p.id===n)h.style.borderColor="var(--ls-primary)";let T=p.ttsVoice??{},l=T.connectionId||P,w=l?await t.tts.listVoicesForConnection(l):m,M=e("div","ls-row-between");M.append(e("strong","",`${p.present?"\uD83D\uDFE2":"⚪"} ${p.name} (${p.roleSummary||"Cast"})`),e("span","ls-chip ls-chip-accent",T.voiceId?`\uD83D\uDD0A ${T.voiceId}`:"Default Voice")),h.append(M);let R=e("div","ls-grid"),A=e("div"),E=e("div"),D=e("input","ls-input");D.placeholder="Voice ID (or pick below)…",D.value=T.voiceId||"";let F=te(t,r,E,{value:T.voiceId||"",ariaLabel:`Voice for ${p.name}`,options:[{value:"",label:"— Select Voice from Catalog —"},...w.map((H)=>({value:H.id,label:`${H.name} (${H.id})`}))],onChange:(H)=>{if(H)D.value=H}}),O=te(t,r,A,{value:T.connectionId||"",ariaLabel:`TTS Connection for ${p.name}`,options:[{value:"",label:"Default TTS Connection"},...o.map((H)=>({value:H.id,label:`${H.name} (${H.provider})`}))],onChange:async(H)=>{let j=await t.tts.listVoicesForConnection(H||P);F.setOptions([{value:"",label:"— Select Voice from Catalog —"},...j.map((z)=>({value:z.id,label:`${z.name} (${z.id})`}))],"")}}),V=e("input","ls-input");V.type="number",V.min="0.5",V.max="2.0",V.step="0.1",V.value=String(T.speed??1),V.title="Playback Speed (0.5x – 2.0x)",R.append(A,D,E,V),h.append(R);let W=e("div","ls-row");W.append(B("\uD83D\uDCBE Save Voice",()=>{let H={connectionId:O.getValue()||void 0,voiceId:D.value.trim()||void 0,speed:Math.max(0.5,Math.min(2,Number(V.value)||1))},j=structuredClone(f.characters);if(j[p.id])j[p.id].ttsVoice=H,t.request("state:mutate",{stateOverride:{characters:j},reason:`Updated TTS voice for ${p.name}`}).then(()=>void d())},"ls-btn-sm ls-btn-primary"),B("▶ Test Voice",()=>{let H=p.innerThought||`Hello, I am ${p.name}.`;t.tts.playSegments([{kind:"dialogue",text:H,speakerName:p.name,actorId:p.id,connectionId:O.getValue()||void 0,voiceId:D.value.trim()||void 0,speed:Math.max(0.5,Math.min(2,Number(V.value)||1))}])},"ls-btn-sm")),h.append(W),u.append(h)}}s.append(u)};d(),i.onDismiss(()=>t.tts.stop())})}var qs={player_attire:{title:"Player Attire / Presentation",defaultIcon:"\uD83D\uDC55",defaultLabel:"Your Current Attire / Presentation",toggleKey:"trackPlayerAttire",labelKey:"playerAttireLabel",instructionKey:"playerAttireInstruction",showCardKey:"showPlayerAttireCard",supportsCardDisplay:!0},player_condition:{title:"Player Physical / Mental Condition",defaultIcon:"\uD83E\uDE7A",defaultLabel:"Physical / Mental Condition",toggleKey:"trackPlayerCondition",labelKey:"playerConditionLabel",instructionKey:"playerConditionInstruction",showCardKey:"showPlayerConditionCard",supportsCardDisplay:!0},player_action:{title:"Player Latest Notable Action",defaultIcon:"⚡",defaultLabel:"Latest Notable Action",toggleKey:"trackPlayerAction",labelKey:"playerActionLabel",instructionKey:"playerActionInstruction",showCardKey:"showPlayerActionCard",supportsCardDisplay:!0},scene_summary:{title:"Scene Beat Summary",defaultIcon:"\uD83D\uDCD6",defaultLabel:"Scene Beat Summary",toggleKey:"trackSceneSummary",labelKey:"sceneSummaryLabel",instructionKey:"sceneSummaryInstruction",showCardKey:"showSceneSummaryInWidget",supportsCardDisplay:!0},scene_presence:{title:"Scene Present & Away Roster",defaultIcon:"\uD83D\uDC65",defaultLabel:"Present & Away",toggleKey:"trackScenePresence",labelKey:"scenePresenceLabel",instructionKey:"scenePresenceInstruction",showCardKey:"showScenePresenceCard",supportsCardDisplay:!0},places:{title:"Spatial Atlas (Places, Zones & Paths)",defaultIcon:"\uD83D\uDDFA️",defaultLabel:"Spatial Atlas & Locations",toggleKey:"trackPlaces",instructionKey:"placesInstruction",supportsCardDisplay:!1},quests:{title:"Quests & Objectives",defaultIcon:"\uD83C\uDFAF",defaultLabel:"Quests & Objectives",toggleKey:"trackQuests",instructionKey:"questsInstruction",showCardKey:"showQuestsInWidget",supportsCardDisplay:!1},dispatches:{title:"Off-Screen Dispatches",defaultIcon:"\uD83D\uDCE1",defaultLabel:"Off-Screen Dispatches",toggleKey:"trackDispatches",instructionKey:"dispatchesInstruction",showCardKey:"showDispatchesInWidget",supportsCardDisplay:!1},npc_conditions:{title:"NPC Conditions & Status Tags",defaultIcon:"⚡",defaultLabel:"NPC Conditions",toggleKey:"trackNpcConditions",instructionKey:"npcConditionsInstruction",supportsCardDisplay:!1},npc_secrets:{title:"NPC Secrets & Clues",defaultIcon:"\uD83D\uDD75️",defaultLabel:"NPC Secrets & Clues",toggleKey:"trackNpcSecrets",instructionKey:"npcSecretsInstruction",supportsCardDisplay:!1}};function Re(t,n){let s=rt(),a={...s,...t??{}},i=qs[n],r=a.overrides?.[n]??{},d=a[i.toggleKey]!==!1,o=i.showCardKey?a[i.showCardKey]!==!1:!0,c=r.label||(i.labelKey?String(a[i.labelKey]??""):"")||i.defaultLabel,f=r.instruction??String(a[i.instructionKey]??s[i.instructionKey]??"");return{enabled:d,showCard:o,icon:r.icon||i.defaultIcon,label:c,instruction:f,color:r.color||"var(--lumiverse-primary)",displayStyle:r.displayStyle??"auto",layoutSpan:r.layoutSpan??"full",widgetTabId:r.widgetTabId??(n==="quests"||n==="dispatches"?"world":"stats"),inlineTabId:r.inlineTabId??(n==="quests"||n==="dispatches"?"world":"stats"),pinnedToHeader:r.pinnedToHeader!==void 0?Boolean(r.pinnedToHeader):n==="scene_presence",locked:Boolean(r.locked),deleted:Boolean(r.deleted)}}function Ae(t){let n=structuredClone(t.snapshot.template),s=rt(),a={...s,...n.coreTrackers??{}};t.modals.open({title:"\uD83D\uDCCD Customize Scene Pill & AI Prompt Rules (Date, Time, Location, Weather)",width:640,maxHeight:820},(i,r,d,o)=>{let c={...n.theme.showSceneChips},f=Boolean(a.scenePillLocked),y=e("section","ls-card");y.append(e("span","ls-kicker","Visible Pill Chips & Lock"),e("p","ls-muted","Choose which scene tokens appear in the Scene Pill & Header, or lock the pill so AI turns never alter the clock/location."));let P=e("div","ls-grid");for(let[u,g]of[["location","\uD83D\uDCCD Location"],["time","\uD83D\uDD70️ Clock Time"],["date","\uD83D\uDCC5 Date / Era"],["weather","\uD83C\uDF26️ Weather"],["cast","\uD83D\uDC64 Present Cast"],["pinnedStats","\uD83D\uDCCC Pinned Stats"]]){let p=e("div","ls-row-between ls-stat-cell");p.append(e("span","",g));let h=e("div");p.append(h),me(t,o,h,{checked:Boolean(c[u]),ariaLabel:g,onChange:(T)=>{c[u]=T}}),P.append(p)}let m=e("div","ls-row-between ls-stat-cell");m.append(e("span","","\uD83D\uDD12 Lock Scene Pill (Prevent AI from changing Date/Time/Location/Weather)"));let S=e("div");m.append(S),me(t,o,S,{checked:f,ariaLabel:"Lock Scene Pill",onChange:(u)=>{f=u}}),y.append(P,m),i.append(y);let L=e("div");i.append(L);let k=he(t,o,L,{title:"AI Extraction Prompts for Pill Fields (Location, Time, Date, Weather)",iconName:"sliders",defaultExpanded:!0}),_=(u,g,p)=>{let h=e("div","ls-label"),T=e("div","ls-row-between"),l=e("textarea","ls-input");return l.rows=2,l.value=g,l.placeholder=p,T.append(e("span","",u),B("⛶ Full-Screen",()=>{t.request("textEditor:open",{title:`Scene Pill Prompt: ${u}`,value:l.value,placeholder:p}).then((w)=>{if(!w.cancelled&&typeof w.text==="string")l.value=w.text})},"ls-btn-sm")),h.append(T,l),k.append(h),l},I=_("\uD83D\uDCCD Location Prompt Rule",a.sceneLocationInstruction??s.sceneLocationInstruction??"",'e.g. Format as "Room, Building" or "Landmark, District".'),b=_("\uD83D\uDD70️ Time Prompt Rule",a.sceneTimeInstruction??s.sceneTimeInstruction??"",'e.g. Use 24-hour military clock, or narrative time like "Late Evening".'),x=_("\uD83D\uDCC5 Date / Era Prompt Rule",a.sceneDateInstruction??s.sceneDateInstruction??"",'e.g. Format as "Year 412, Frostfall 14" or "Oct 14, 2002".'),N=_("\uD83C\uDF26️ Weather & Atmosphere Prompt Rule",a.sceneWeatherInstruction??s.sceneWeatherInstruction??"",'e.g. Keep to 2–4 vivid words like "Neon Drizzle" or "Warm Indoor Steam".'),C=_('⏱️ Time Progression ("mins") Prompt Rule',a.sceneTimeFlowInstruction??s.sceneTimeFlowInstruction??"","e.g. Estimate realistic elapsed minutes per turn."),v=e("div","ls-row-between");v.style.marginTop="12px",v.append(B("↺ Reset Default Prompts",()=>{I.value=s.sceneLocationInstruction??"",b.value=s.sceneTimeInstruction??"",x.value=s.sceneDateInstruction??"",N.value=s.sceneWeatherInstruction??"",C.value=s.sceneTimeFlowInstruction??""},"ls-btn-sm"),B("\uD83D\uDCBE Save Scene Pill Config",()=>{let u=structuredClone(t.snapshot.template),g={...s,...u.coreTrackers??{}};t.request("state:mutate",{templatePatch:{theme:{...u.theme,showSceneChips:c},coreTrackers:{...g,scenePillLocked:f,sceneLocationInstruction:I.value.trim(),sceneTimeInstruction:b.value.trim(),sceneDateInstruction:x.value.trim(),sceneWeatherInstruction:N.value.trim(),sceneTimeFlowInstruction:C.value.trim()}},reason:"Updated Scene Pill prompt rules & visibility"}),t.notify("Saved Scene Pill prompt rules."),r()},"ls-btn-primary")),i.append(v)})}function Qt(t,n){let s=structuredClone(t.snapshot.template),a=rt(),i={...a,...s.coreTrackers??{},overrides:{...s.coreTrackers?.overrides??{}}},r=qs[n],d=Re(i,n);t.modals.open({title:`✏️ Full Edit Built-In Tracker: ${r.title}`,width:640,maxHeight:820},(o,c,f,y)=>{let{enabled:P,showCard:m}=d,S=Boolean(d.pinnedToHeader),L=Boolean(d.locked),k=d.displayStyle??"auto",_=d.layoutSpan??"full",I=d.color||"var(--lumiverse-primary)",b=d.widgetTabId||"stats",x=d.inlineTabId||"stats",N=e("div","ls-grid"),C=e("label","ls-label","Icon"),v=e("input","ls-input");v.value=d.icon||r.defaultIcon,C.append(v);let u=e("label","ls-label","Display Label"),g=e("input","ls-input");g.value=d.label||r.defaultLabel,u.append(g),N.append(C,u),o.append(N);let p=e("div","ls-grid"),h=e("div","ls-row-between ls-stat-cell");h.append(e("span","","✓ Track in AI Prompts"));let T=e("div");if(h.append(T),me(t,y,T,{checked:P,onChange:(Y)=>{P=Y}}),p.append(h),r.supportsCardDisplay){let Y=e("div","ls-row-between ls-stat-cell");Y.append(e("span","","\uD83E\uDE9F Show Card in Widget / Inline"));let ne=e("div");Y.append(ne),me(t,y,ne,{checked:m,onChange:(se)=>{m=se}}),p.append(Y);let G=e("div","ls-row-between ls-stat-cell");G.append(e("span","","\uD83D\uDCCC Pin to Scene Pill"));let Q=e("div");G.append(Q),me(t,y,Q,{checked:S,onChange:(se)=>{S=se}}),p.append(G)}let l=e("div","ls-row-between ls-stat-cell");l.append(e("span","","\uD83D\uDD12 Lock Value (Skip AI Updates)"));let w=e("div");l.append(w),me(t,y,w,{checked:L,onChange:(Y)=>{L=Y}}),p.append(l),o.append(p);let M=e("div");o.append(M);let R=he(t,y,M,{title:"Display Style, Color & Tab Routing",iconName:"palette",defaultExpanded:!0}),A=e("div","ls-grid"),E=e("div","ls-label","Visual Display Style"),D=e("div");E.append(D),te(t,y,D,{value:k,ariaLabel:"Visual Display Style",options:[{value:"auto",label:"✨ Smart Auto-Detect"},{value:"arc_tracker",label:"\uD83C\uDFAF Multi-Thread / Arc / Quest Cards"},{value:"accordion_cards",label:"\uD83D\uDDC2️ Collapsible Multi-Entry Cards"},{value:"matrix_badges",label:"⚖️ Split / Versus Comparison (Knows vs Blind)"},{value:"meter_mini_bars",label:"\uD83D\uDCCA Multi-Bar Mini Gauges (HP/MP cur/max)"},{value:"stat_pills_grid",label:"\uD83E\uDDEC Compact Stat Badges (Lv / P A I / POW)"},{value:"bullet_ledger",label:"\uD83D\uDCB0 Aligned Bullet & Currency Ledger"},{value:"timeline_list",label:"\uD83D\uDCDC Vertical Event Timeline"},{value:"checklist",label:"☑️ Visual Objectives Checklist"},{value:"feed_cards",label:"\uD83C\uDCCF Structured Flow Cards"},{value:"step_chain",label:"⛓️ Horizontal Step Chain"},{value:"key_value",label:"\uD83D\uDCCB Key–Value Table"},{value:"pill_list",label:"\uD83C\uDFF7️ Tag / Pill List"},{value:"quote_callout",label:"\uD83D\uDCAD Quote Callout Box"}],onChange:(Y)=>{k=Y}});let F=e("div","ls-label","Card Grid Width"),O=e("div");if(F.append(O),te(t,y,O,{value:_,ariaLabel:"Card Grid Width",options:[{value:"full",label:"↔️ Full Width"},{value:"auto",label:"\uD83D\uDCD0 Auto"},{value:"half",label:"▫ Compact Column"}],onChange:(Y)=>{_=Y}}),A.append(E,F),R.append(A),r.supportsCardDisplay){let Y=e("div","ls-grid"),ne=e("div","ls-label","Widget Tab"),G=e("div");ne.append(G),te(t,y,G,{value:b,ariaLabel:"Widget Tab",options:s.surfaces.widgetTabs.map((oe)=>({value:oe.id,label:`${oe.icon} ${oe.label}`})),onChange:(oe)=>{b=oe}});let Q=e("div","ls-label","Inline Ribbon Tab"),se=e("div");Q.append(se),te(t,y,se,{value:x,ariaLabel:"Inline Ribbon Tab",options:s.surfaces.inlineTabs.map((oe)=>({value:oe.id,label:`${oe.icon} ${oe.label}`})),onChange:(oe)=>{x=oe}}),Y.append(ne,Q),R.append(Y)}let V=e("div","ls-label","Accent Color"),W=e("div","ls-row"),H=()=>{for(let Y of[...W.querySelectorAll(".ls-color-swatch")])Y.setAttribute("aria-pressed",String(Y.dataset.colorVal===I))};for(let[Y,ne,G]of[["var(--lumiverse-primary)","Theme Primary","var(--lumiverse-primary, #38bdf8)"],["#38bdf8","Sky","#38bdf8"],["#f472b6","Rose","#f472b6"],["#f59e0b","Amber","#f59e0b"],["#10b981","Emerald","#10b981"],["#a78bfa","Violet","#a78bfa"],["#f43f5e","Crimson","#f43f5e"]]){let Q=B("",()=>{I=Y,H()},"ls-color-swatch",ne);Q.dataset.colorVal=Y,Q.style.background=G,W.append(Q)}H(),V.append(W),R.append(V);let j=e("div");o.append(j);let z=he(t,y,j,{title:"AI Extraction Prompt Rule",iconName:"sparkles",defaultExpanded:!0}),U=e("div","ls-row-between"),K=e("textarea","ls-input");K.rows=3,K.value=d.instruction??"",K.placeholder="Tell the AI exactly how and when to extract or format this tracker…",U.append(e("span","ls-muted","Prompt instruction sent to the AI extractor:"),B("⛶ Full-Screen Editor",()=>{t.request("textEditor:open",{title:`Built-In Prompt: ${g.value||r.title}`,value:K.value,placeholder:"Describe formatting, triggers, and when the AI should update this built-in tracker…"}).then((Y)=>{if(!Y.cancelled&&typeof Y.text==="string")K.value=Y.text})},"ls-btn-sm")),z.append(U,K);let X=e("div","ls-row-between");X.style.marginTop="12px";let J=e("div","ls-row");J.append(B("↺ Reset Default",()=>{v.value=r.defaultIcon,g.value=r.defaultLabel,K.value=String(a[r.instructionKey]??""),I="var(--lumiverse-primary)",k="auto",_="full",H()},"ls-btn-sm"),B("\uD83D\uDDD1️ Delete Built-In",async()=>{if(!await t.modals.confirm({title:`Remove "${r.defaultLabel}"?`,message:`Disable and remove "${r.defaultLabel}" from active tracking and Studio? (You can restore deleted built-ins anytime from Studio.)`,confirmLabel:"Delete",variant:"danger"}))return;let ne=structuredClone(t.snapshot.template),G={...a,...ne.coreTrackers??{},overrides:{...ne.coreTrackers?.overrides??{}}},Q={...G,[r.toggleKey]:!1,...r.showCardKey?{[r.showCardKey]:!1}:{},overrides:{...G.overrides??{},[n]:{...G.overrides?.[n]??{},deleted:!0}}};t.request("state:mutate",{templatePatch:{coreTrackers:Q},reason:`Deleted built-in tracker "${r.defaultLabel}"`}),t.notify(`Removed "${r.defaultLabel}".`),c()},"ls-btn-sm ls-btn-danger")),X.append(J,B("\uD83D\uDCBE Save Built-In Tracker",()=>{let Y=g.value.trim()||r.defaultLabel,ne=K.value.trim(),G=structuredClone(t.snapshot.template),Q={...a,...G.coreTrackers??{},overrides:{...G.coreTrackers?.overrides??{}}},se={...Q,[r.toggleKey]:P,...r.labelKey?{[r.labelKey]:Y}:{},[r.instructionKey]:ne,...r.showCardKey?{[r.showCardKey]:m}:{},overrides:{...Q.overrides??{},[n]:{icon:v.value.trim()||r.defaultIcon,label:Y,instruction:ne,color:I,displayStyle:k,layoutSpan:_,widgetTabId:b,inlineTabId:x,pinnedToHeader:S,locked:L,deleted:!1}}};t.request("state:mutate",{templatePatch:{coreTrackers:se},reason:`Customized built-in tracker "${Y}"`}),t.notify(`Saved "${Y}".`),c()},"ls-btn-primary")),o.append(X)})}var Ke={id:"zone_local",name:"Local Area",kind:"building",icon:"\uD83D\uDDFA️",color:"#38bdf8",description:""};function At(t){let n=new Map;for(let s of t.mapPaths??[]){if(!t.places[s.fromId]||!t.places[s.toId]||s.fromId===s.toId)continue;let[a,i]=[s.fromId,s.toId].sort(),r=`${a}__${i}`;n.set(r,{...s,id:r,fromId:a,toId:i})}for(let s of Object.values(t.places))for(let a of s.connectedIds){if(!t.places[a]||a===s.id)continue;let[i,r]=[s.id,a].sort(),d=`${i}__${r}`;if(!n.has(d)){let o=t.places[a],c=(s.zoneId||"zone_local")===(o.zoneId||"zone_local");n.set(d,{id:d,fromId:i,toId:r,pathType:c?"door":"street",travelMinutes:Math.max(1,o.travelMinutes||s.travelMinutes||5)})}}return[...n.values()]}function bt(t,n){let s=t.currentPlaceId||Object.keys(t.places)[0]||"";if(!s||!t.places[n])return null;if(s===n)return{pathIds:[s],totalMinutes:0};let a=At(t),i=new Map;for(let d of a)(i.get(d.fromId)??i.set(d.fromId,[]).get(d.fromId)).push({to:d.toId,mins:Math.max(1,d.travelMinutes||5),locked:Boolean(d.locked)}),(i.get(d.toId)??i.set(d.toId,[]).get(d.toId)).push({to:d.fromId,mins:Math.max(1,d.travelMinutes||5),locked:Boolean(d.locked)});let r=(d)=>{let o=new Map([[s,0]]),c=new Map,f=new Set;while(!0){let y=null,P=1/0;for(let[m,S]of o.entries())if(!f.has(m)&&S<P)y=m,P=S;if(!y)return null;if(y===n){let m=[y];while(c.has(m[0]))m.unshift(c.get(m[0]));return{pathIds:m,totalMinutes:P}}f.add(y);for(let m of i.get(y)??[]){if(!d&&m.locked)continue;let S=P+m.mins;if(S<(o.get(m.to)??1/0))o.set(m.to,S),c.set(m.to,y)}}};return r(!1)??r(!0)}function Ks(t,n,s){let a=Object.values(t.places);if(!a.length)return{zones:[],nodes:[],edges:[]};let i=t.currentPlaceId||a[0].id,r={...t.mapZones??{}},d=(h)=>{let T=h.zoneId||Ke.id;if(r[T])return r[T];if(T===Ke.id)return r[T]={...Ke,name:t.title&&t.title!=="Uncharted Story"?t.title:"Local Area"},r[T];return r[T]={id:T,name:T.replace(/[_-]+/g," ").replace(/\b\w/g,(l)=>l.toUpperCase()),kind:h.category==="region"?"region":"building",icon:h.category==="region"?"\uD83C\uDFD4️":"\uD83C\uDFDB️",color:"#38bdf8",description:""},r[T]},o=(s?a.filter((h)=>(h.zoneId||Ke.id)===s):a).slice(0,18),c=new Map;for(let h of o){let T=d(h),l=c.get(T.id);if(!l)l={zone:T,places:[]},c.set(T.id,l);l.places.push(h)}let f=[...c.values()],y=f.length,P=1000,m=580,S=22,L=y<=1?1:y<=4?2:3,k=Math.ceil(y/L),_=22,I=Math.floor((P-S*2-_*(L-1))/L),b=Math.floor((m-S*2-_*(k-1))/k),x=n&&n!==i?bt(t,n):null,N=new Set(x?.pathIds??[]),C=Object.values(t.quests).filter((h)=>h.status==="active"),v=[],u=[];f.forEach((h,T)=>{let l=T%L,w=Math.floor(T/L),M=S+l*(I+_),R=S+w*(b+_);v.push({zone:h.zone,x:M,y:R,w:I,h:b,placeIds:h.places.map((H)=>H.id),containsCurrent:h.places.some((H)=>H.id===i)});let A=h.places.length,E=R+46,D=Math.max(80,b-58),F=M+18,O=Math.max(120,I-36),V=A===1?1:A<=4?2:3,W=Math.ceil(A/V);h.places.forEach((H,j)=>{let z=j%V,U=Math.floor(j/V),K=O/V,X=D/W,J=Math.round(F+K*(z+0.5)),Y=Math.round(E+X*(U+0.5)),ne=Object.values(t.characters).filter((Q)=>Q.present?H.id===i:Q.locationId===H.id).map((Q)=>({id:Q.id,name:Q.name,portraitUrl:Q.portraitUrl})),G=C.filter((Q)=>`${Q.title} ${Q.summary}`.toLowerCase().includes(H.name.toLowerCase())).length;u.push({place:H,zoneId:h.zone.id,zoneName:h.zone.name,x:J,y:Y,isCurrent:H.id===i,isOnRoute:N.has(H.id),actorsHere:ne,activeQuestCount:G})})});let g=new Map(u.map((h)=>[h.place.id,h])),p=[];for(let h of At(t)){let T=g.get(h.fromId),l=g.get(h.toId);if(!T||!l)continue;let w=(T.x+l.x)/2,M=(T.y+l.y)/2,R=l.x-T.x,A=l.y-T.y,E=Math.max(1,Math.hypot(R,A)),D=T.zoneId!==l.zoneId,F=D?26:10,O=Math.round(w+-A/E*F),V=Math.round(M+R/E*F),W=!1;if(x&&x.pathIds.length>1)for(let H=0;H<x.pathIds.length-1;H++){let j=x.pathIds[H],z=x.pathIds[H+1];if(j===T.place.id&&z===l.place.id||j===l.place.id&&z===T.place.id){W=!0;break}}p.push({id:h.id,fromId:T.place.id,toId:l.place.id,x1:T.x,y1:T.y,x2:l.x,y2:l.y,cx:O,cy:V,pathType:h.pathType,label:h.label,travelMinutes:h.travelMinutes,locked:Boolean(h.locked),isOnRoute:W,isCrossZone:D})}return{zones:v,nodes:u,edges:p}}function Gs(t,n){let s=Object.values(t.places);if(!s.length)return{hubs:[],edges:[]};let a=t.currentPlaceId||s[0].id,i={...t.mapZones??{}},r=(I)=>{let b=I.zoneId||Ke.id;if(i[b])return i[b];if(b===Ke.id)return i[b]={...Ke,name:t.title&&t.title!=="Uncharted Story"?t.title:"Local Area"},i[b];return i[b]={id:b,name:b.replace(/[_-]+/g," ").replace(/\b\w/g,(x)=>x.toUpperCase()),kind:I.category==="region"?"region":"building",icon:I.category==="region"?"\uD83C\uDFD4️":"\uD83C\uDFDB️",color:"#38bdf8",description:""},i[b]},d=new Map;for(let I of s){let b=r(I),x=d.get(b.id);if(!x)x={zone:b,places:[]},d.set(b.id,x);x.places.push(I)}let o=[...d.values()],c=o.length,f=n&&n!==a?bt(t,n):null,y=new Set(f?.pathIds??[]),P=Object.values(t.quests).filter((I)=>I.status==="active"),m=(I,b)=>{if(b===1)return{x:500,y:180};if(b===2)return{x:I===0?270:730,y:180};if(b===3)return[{x:230,y:118},{x:770,y:118},{x:500,y:252}][I];let x=Math.min(3,Math.ceil(b/2)),N=Math.ceil(b/x),C=I%x,v=Math.floor(I/x),u=x>1?620/(x-1):0,g=N>1?150/(N-1):0,p=v%2===1&&x>1?35:0;return{x:Math.round(190+C*u+p),y:Math.round(105+v*g)}},S=o.map((I,b)=>{let x=m(b,c),N=I.places.map((l)=>l.id),C=new Set(N),v=C.has(a),u=N.some((l)=>y.has(l)),g=Object.values(t.characters).filter((l)=>l.present?v:C.has(l.locationId)).map((l)=>({id:l.id,name:l.name,portraitUrl:l.portraitUrl})),p=P.filter((l)=>I.places.some((w)=>`${l.title} ${l.summary}`.toLowerCase().includes(w.name.toLowerCase()))).length,h=I.places.find((l)=>l.id===a&&l.backdropUrl)?.backdropUrl??I.places.find((l)=>l.backdropUrl)?.backdropUrl,T=0;if(!v){let l=1/0;for(let w of I.places){let M=bt(t,w.id);if(M&&M.totalMinutes<l)l=M.totalMinutes}T=Number.isFinite(l)?l:I.places[0]?.travelMinutes??5}return{zone:I.zone,x:x.x,y:x.y,placeIds:N,containsCurrent:v,isOnRoute:u,...h?{backdropUrl:h}:{},actorsHere:g,activeQuestCount:p,minTravelMinutes:T}}),L=new Map(S.map((I)=>[I.zone.id,I])),k=new Map;for(let I of S)for(let b of I.placeIds)k.set(b,I.zone.id);let _=new Map;for(let I of At(t)){let b=k.get(I.fromId),x=k.get(I.toId);if(!b||!x||b===x)continue;let[N,C]=[b,x].sort(),v=`${N}__${C}`,u=L.get(N),g=L.get(C);if(!u||!g)continue;let p=y.has(I.fromId)&&y.has(I.toId),h=_.get(v);if(h){h.travelMinutes=Math.min(h.travelMinutes,I.travelMinutes),h.locked=h.locked&&Boolean(I.locked),h.isOnRoute=h.isOnRoute||p;continue}let T=(u.x+g.x)/2,l=(u.y+g.y)/2,w=g.x-u.x,M=g.y-u.y,R=Math.max(1,Math.hypot(w,M)),A=Math.round(T+-M/R*24),E=Math.round(l+w/R*24);_.set(v,{id:v,fromZoneId:N,toZoneId:C,x1:u.x,y1:u.y,x2:g.x,y2:g.y,cx:A,cy:E,pathType:I.pathType,travelMinutes:I.travelMinutes,locked:Boolean(I.locked),isOnRoute:p})}return{hubs:S,edges:[..._.values()]}}var Ge="",Jt=!0,Nn={door:"\uD83D\uDEAA",hallway:"\uD83D\uDEB6",stairs:"\uD83E\uDE9C",street:"\uD83D\uDEE3️",trail:"\uD83C\uDF3F",transit:"\uD83D\uDE87",portal:"✨"};function Rn(t,n=3){let s=e("div","ls-mz-node-avatars");for(let a of t.slice(0,n)){let i=e("span","ls-mz-mini-av");if(i.title=a.name,a.portraitUrl){let r=e("img");r.src=a.portraitUrl,r.alt=a.name,i.append(r)}else i.textContent=a.name.slice(0,1).toUpperCase();s.append(i)}if(t.length>n)s.append(e("small","ls-muted",`+${t.length-n}`));return s}function en(t){let{state:n}=t.snapshot,s=e("div","ls-stack"),a=Object.values(n.places),i=n.mapZones??{},r=At(n);if(Ge&&!a.some((l)=>(l.zoneId||"zone_local")===Ge))Ge="";let d=e("div","ls-row-between"),o=n.currentPlaceId||a[0]?.id||"",c=t.selectedPlaceId&&n.places[t.selectedPlaceId]?t.selectedPlaceId:o,f=Gs(n,c),y=f.hubs.length>1,P=Ge||(!Jt||!y?f.hubs[0]?.zone.id??"":""),m=e("div","ls-row ls-vn-breadcrumb"),S=B(`\uD83C\uDF0D All Zones (${f.hubs.length})`,()=>{Ge="",Jt=!0,t.emitChange()},"ls-btn-sm");if(!P)S.setAttribute("aria-current","page");if(m.append(S),y)for(let l of f.hubs){let w=B(`${l.zone.icon} ${l.zone.name} (${l.placeIds.length})`,()=>{Ge=l.zone.id,Jt=!1,t.emitChange()},"ls-btn-sm");if(P===l.zone.id)w.setAttribute("aria-current","page");m.append(w)}else if(f.hubs[0]){let l=f.hubs[0];m.append(e("span","ls-chip ls-chip-accent",`${l.zone.icon} ${l.zone.name}`))}let L=e("div","ls-row");if(L.append(B("+ Zone",()=>{t.modals.open({title:"Create Map Zone / Building / District",width:460},(l,w,M,R)=>{let A=e("label","ls-label","Zone Name"),E=e("input","ls-input");E.placeholder="e.g. Sakura Manor, Downtown, Orbital Deck B…",A.append(E);let D="building",F=e("div","ls-label","Zone Type"),O=e("div");F.append(O),te(t,R,O,{value:D,ariaLabel:"Zone Type",options:[{value:"building",label:"\uD83C\uDFDB️ Building / Interior"},{value:"district",label:"\uD83C\uDF06 City District"},{value:"region",label:"\uD83C\uDFD4️ Wilderness / Region"},{value:"ship_deck",label:"\uD83D\uDE80 Ship / Station Deck"},{value:"realm",label:"✨ Realm / Dimension"}],onChange:(j)=>{D=j}});let V=e("label","ls-label","Icon"),W=e("input","ls-input");W.value="\uD83C\uDFDB️",V.append(W);let H=B("Create Zone",()=>{let j=E.value.trim();if(!j)return;t.request("state:mutate",{patch:{zones:[{id:le(j,"zone"),name:j,kind:D,icon:W.value.trim()||"\uD83C\uDFDB️"}]},reason:`Created zone "${j}"`}),w()},"ls-btn-primary");l.append(A,F,V,H)})},"ls-btn-sm"),B("+ Place",()=>{t.modals.open({title:"Add Location Pin",width:480},(l,w)=>{let M=e("label","ls-label","Location Name"),R=e("input","ls-input");M.append(R);let A=e("label","ls-label","Zone / Building / District"),E=e("input","ls-input");E.value=P&&i[P]?.name||n.places[o]?.zoneId&&i[n.places[o].zoneId]?.name||"",E.placeholder="e.g. Second-Floor Apartment",A.append(E);let D=e("label","ls-label","Icon"),F=e("input","ls-input");F.value="\uD83D\uDCCD",D.append(F);let O=e("label","ls-label","Description"),V=e("input","ls-input");O.append(V);let W=B("Add Location",()=>{let H=R.value.trim();if(!H)return;let j=n.places[o]?.name;t.request("state:mutate",{patch:{places:[{id:le(H,"place"),name:H,zone:E.value.trim()||void 0,icon:F.value.trim()||"\uD83D\uDCCD",description:V.value.trim()||"Connected location.",connectedNames:j?[j]:[]}]},reason:`Added location "${H}"`}),w()},"ls-btn-primary");l.append(M,A,D,O,W)})},"ls-btn-sm ls-btn-primary"),B("Export",()=>{let l={schema:"lumi-stats-map/v1",zones:Object.values(i),places:a,paths:r},w=new Blob([JSON.stringify(l,null,2)],{type:"application/json"}),M=URL.createObjectURL(w),R=document.createElement("a");R.href=M,R.download=`${le(n.title,"lumi_map")}.lumi-map.json`,document.body.append(R),R.click(),R.remove(),URL.revokeObjectURL(M)},"ls-btn-sm ls-btn-ghost","Export Map JSON"),B("Import",()=>{t.ctx.uploads.pickFile({accept:[".json","application/json"],multiple:!1,maxSizeBytes:1500000}).then((l)=>{let w=l[0];if(!w)return;let M=JSON.parse(new TextDecoder().decode(w.bytes));t.request("state:mutate",{patch:{zones:Array.isArray(M.zones)?M.zones:void 0,places:Array.isArray(M.places)?M.places:void 0,paths:Array.isArray(M.paths)?M.paths:void 0},reason:`Imported map layout from ${w.name}`})})},"ls-btn-sm ls-btn-ghost","Import Map JSON")),d.append(m,L),s.append(d),!a.length){let l=e("div","ls-card");return l.append(e("strong","","No locations mapped yet"),e("p","ls-muted",'Locations, zones, and connecting paths build automatically as scenes progress, or click "+ Zone" / "+ Place" above.')),s.append(l),s}let k=n.places[c]??a[0],_=e("div","ls-card"),I=e("div","ls-vn-atlas-canvas"),b=k.backdropUrl||a.find((l)=>l.id===o&&l.backdropUrl)?.backdropUrl||a.find((l)=>l.backdropUrl)?.backdropUrl;if(b)I.style.backgroundImage=`linear-gradient(rgba(11,17,32,0.72), rgba(11,17,32,0.88)), url(${JSON.stringify(b)})`,I.style.backgroundSize="cover",I.style.backgroundPosition="center";let x="http://www.w3.org/2000/svg",N=document.createElementNS(x,"svg");if(N.setAttribute("preserveAspectRatio","none"),N.style.cssText="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;",!P&&y){N.setAttribute("viewBox","0 0 1000 360");for(let l of f.edges){let w=document.createElementNS(x,"path");w.setAttribute("d",`M ${l.x1} ${l.y1} Q ${l.cx} ${l.cy} ${l.x2} ${l.y2}`),w.setAttribute("fill","none"),w.setAttribute("stroke",l.locked?"var(--ls-danger, #f43f5e)":l.isOnRoute?"var(--ls-primary, #38bdf8)":"rgba(148,163,184,0.55)"),w.setAttribute("stroke-width",l.isOnRoute?"3":"2"),w.setAttribute("stroke-dasharray",l.locked?"5 4":"4 3"),N.append(w);let M=0.25*l.x1+0.5*l.cx+0.25*l.x2,R=0.25*l.y1+0.5*l.cy+0.25*l.y2,A=e("span","ls-mz-edge-pill",`${l.locked?"\uD83D\uDD12 ":Nn[l.pathType]||"\uD83D\uDEE3️"} ${l.travelMinutes}m`);A.dataset.route=String(l.isOnRoute),A.style.left=`${(M/1000*100).toFixed(2)}%`,A.style.top=`${(R/360*100).toFixed(2)}%`,I.append(A)}I.append(N);for(let l of f.hubs){let w=B("",()=>{if(Ge=l.zone.id,Jt=!1,l.placeIds[0]&&!l.placeIds.includes(c))t.selectedPlaceId=l.placeIds[0];t.emitChange()},"ls-vn-zone-hub",`Open ${l.zone.name} (${l.placeIds.length} locations)`);if(w.dataset.current=String(l.containsCurrent),w.style.setProperty("--ls-zone-color",l.zone.color||"#38bdf8"),w.style.left=`${(l.x/1000*100).toFixed(2)}%`,w.style.top=`${(l.y/360*100).toFixed(2)}%`,l.backdropUrl)w.style.backgroundImage=`linear-gradient(rgba(11,17,32,0.72), rgba(11,17,32,0.88)), url(${JSON.stringify(l.backdropUrl)})`,w.style.backgroundSize="cover",w.style.backgroundPosition="center";let M=e("div","ls-row");M.append(e("span","",`${l.zone.icon} ${l.zone.name}`));let R=e("div","ls-row");if(l.containsCurrent)R.append(e("span","ls-chip ls-chip-accent","YOU"));else R.append(e("span","ls-chip",`${l.minTravelMinutes}m`));if(R.append(e("span","ls-chip",`${l.placeIds.length} ${l.placeIds.length===1?"spot":"spots"}`)),l.activeQuestCount>0)R.append(e("span","ls-chip","\uD83C\uDFAF"));if(w.append(M,R),l.actorsHere.length>0)w.append(Rn(l.actorsHere,4));I.append(w)}}else{let l=Ks(n,c,P||void 0);N.setAttribute("viewBox","0 0 1000 580");for(let w of l.edges){let M=document.createElementNS(x,"path");if(M.setAttribute("d",`M ${w.x1} ${w.y1} Q ${w.cx} ${w.cy} ${w.x2} ${w.y2}`),M.setAttribute("fill","none"),M.setAttribute("stroke",w.locked?"var(--ls-danger, #f43f5e)":w.isOnRoute?"var(--ls-primary, #38bdf8)":"rgba(148,163,184,0.55)"),M.setAttribute("stroke-width",w.isOnRoute?"3.5":"2"),w.locked||w.isCrossZone||w.pathType==="portal")M.setAttribute("stroke-dasharray",w.pathType==="portal"?"3 4":"6 4");N.append(M);let R=0.25*w.x1+0.5*w.cx+0.25*w.x2,A=0.25*w.y1+0.5*w.cy+0.25*w.y2,E=e("span","ls-mz-edge-pill",`${w.locked?"\uD83D\uDD12 ":Nn[w.pathType]||"\uD83D\uDEAA"} ${w.travelMinutes}m`);E.dataset.route=String(w.isOnRoute),E.style.left=`${(R/1000*100).toFixed(2)}%`,E.style.top=`${(A/580*100).toFixed(2)}%`,I.append(E)}I.append(N);for(let w of l.nodes){let M=B("",()=>{t.selectedPlaceId=w.place.id,t.emitChange(),requestAnimationFrame(()=>{_.scrollIntoView({behavior:"smooth",block:"nearest"})})},"ls-mz-node-tile",w.place.name);M.dataset.current=String(w.isCurrent),M.dataset.selected=String(w.place.id===c),M.style.left=`${(w.x/1000*100).toFixed(2)}%`,M.style.top=`${(w.y/580*100).toFixed(2)}%`;let R=w.place.name.length>24?`${w.place.name.slice(0,22)}…`:w.place.name;if(M.append(e("span","ls-mz-node-title",`${w.place.icon||"\uD83D\uDCCD"} ${R}${w.activeQuestCount?" \uD83C\uDFAF":""}`)),w.actorsHere.length>0||w.isCurrent){let A=Rn(w.actorsHere,3);if(w.isCurrent)A.prepend(e("span","ls-chip ls-chip-accent","YOU"));M.append(A)}I.append(M)}}s.append(I);let C=P?a.filter((l)=>(l.zoneId||"zone_local")===P):a,v=e("div","ls-vn-dest-grid");for(let l of C){let w=l.id===o,M=l.id===k.id,R=!w?bt(n,l.id):null,A=Object.values(n.characters).filter((H)=>H.present?l.id===o:H.locationId===l.id).map((H)=>({id:H.id,name:H.name,portraitUrl:H.portraitUrl})),E=e("div","ls-vn-dest-card");E.dataset.current=String(w),E.dataset.selected=String(M),E.addEventListener("click",()=>{t.selectedPlaceId=l.id,t.emitChange()});let D=e("div","ls-vn-dest-thumb");if(l.backdropUrl){let H=e("img");H.src=l.backdropUrl,H.alt=l.name,D.append(H)}else D.textContent=l.icon||"\uD83D\uDCCD";let F=e("div","ls-vn-dest-info"),O=e("div","ls-row");if(O.append(e("strong","",l.name)),w)O.append(e("span","ls-chip ls-chip-accent","Here"));F.append(O);let V=l.zoneId&&i[l.zoneId]?.name||"";if(V)F.append(e("small","ls-muted",V));if(A.length>0)F.append(Rn(A,4));let W=e("div","ls-row");if(!w)W.append(e("span","ls-chip",`${R?.totalMinutes??l.travelMinutes}m`),B("Go",()=>{t.request("map:travel",{placeId:l.id,fastTravel:!0})},"ls-btn-sm ls-btn-primary",`Fast travel to ${l.name}`));E.append(D,F,W),v.append(E)}s.append(v);let u=k.id!==o?bt(n,k.id):null,g=r.filter((l)=>l.fromId===k.id||l.toId===k.id),p=k.zoneId&&i[k.zoneId]?.name||"Local Area",h=e("div","ls-row-between");if(h.append(e("strong","",`${k.icon} ${k.name} · ${p}`),e("span","ls-chip ls-chip-accent",k.id===o?"Current Location":`${u?.totalMinutes??k.travelMinutes}m travel`)),_.append(h,e("p","ls-muted",k.description)),g.length>0){let l=e("div","ls-row");for(let w of g){let M=w.fromId===k.id?w.toId:w.fromId,R=n.places[M]?.name??M;l.append(B(`${w.locked?"\uD83D\uDD12":Nn[w.pathType]} ${R} (${w.travelMinutes}m)`,()=>{t.selectedPlaceId=M,t.emitChange()},"ls-btn-sm","Jump inspector to connected place"))}_.append(l)}let T=e("div","ls-row");if(k.id!==o)T.append(B("Copy Travel Action",()=>{t.request("map:travel",{placeId:k.id,fastTravel:!1}).then(async(l)=>{let w=typeof l.draftText==="string"?l.draftText:"";if(!w)return;try{await navigator.clipboard.writeText(w),t.notify(`Copied travel action: "${w}"`)}catch{t.notify(`Travel route: ${w}`)}})},"ls-btn-sm"),B("Fast Travel Here",()=>{t.request("map:travel",{placeId:k.id,fastTravel:!0})},"ls-btn-sm ls-btn-primary"));if(T.append(B("Upload Backdrop",()=>t.pickAndUploadImage(k.id,"backdrop"),"ls-btn-sm"),B("Edit Place",()=>{t.modals.open({title:`Edit Place: ${k.name}`,width:500},(l,w)=>{let M=e("label","ls-label","Location Name"),R=e("input","ls-input");R.value=k.name,M.append(R);let A=e("label","ls-label","Zone / Building / District"),E=e("input","ls-input");E.value=k.zoneId&&i[k.zoneId]?.name||"",A.append(E);let D=e("label","ls-label","Icon"),F=e("input","ls-input");F.value=k.icon||"\uD83C\uDFDB️",D.append(F);let O=e("label","ls-label","Tags (comma-separated, e.g. safe, shop, danger)"),V=e("input","ls-input");V.value=(k.tags??[]).join(", "),O.append(V);let W=e("label","ls-label","Description"),H=e("textarea","ls-input");H.rows=2,H.value=k.description,W.append(H);let j=e("label","ls-label","Default Travel Minutes"),z=e("input","ls-input");z.type="number",z.value=String(k.travelMinutes||5),j.append(z);let U=B("Save Location",()=>{let K=E.value.trim(),X={...n.mapZones??{}},J=k.zoneId;if(K){if(J=le(K,"zone"),!X[J])X[J]={id:J,name:K,kind:"building",icon:"\uD83C\uDFDB️",color:"#38bdf8",description:""}}let Y=structuredClone(n.places),ne=Y[k.id];if(ne)ne.name=R.value.trim()||ne.name,ne.zoneId=J,ne.icon=F.value.trim()||"\uD83D\uDCCD",ne.tags=V.value.split(",").map((G)=>G.trim()).filter(Boolean),ne.description=H.value.trim()||ne.description,ne.travelMinutes=Math.max(1,Number(z.value)||5),t.request("state:mutate",{stateOverride:{places:Y,mapZones:X},reason:`Edited location "${ne.name}"`});w()},"ls-btn-primary");l.append(M,A,D,O,W,j,U)})},"ls-btn-sm")),a.length>1)T.append(B("Delete",()=>{let l=structuredClone(n.places);delete l[k.id];for(let R of Object.values(l))R.connectedIds=R.connectedIds.filter((A)=>A!==k.id);let w=(n.mapPaths??[]).filter((R)=>R.fromId!==k.id&&R.toId!==k.id),M=n.currentPlaceId===k.id?Object.keys(l)[0]??"":n.currentPlaceId;t.selectedPlaceId=M,t.request("state:mutate",{stateOverride:{places:l,mapPaths:w,currentPlaceId:M},reason:`Deleted location "${k.name}"`})},"ls-btn-sm ls-btn-danger"));return _.append(T),s.append(_),s}function De(t,n,s){let a=n.trim();if(!a)return;let i=()=>{if(!s?.dom?.inject){t.textContent=a.replace(/<[^>]+>/g,"");return}try{s.dom.inject(t,a,"beforeend")}catch{t.textContent=a.replace(/<[^>]+>/g,"")}};if(t.isConnected)i();else queueMicrotask(()=>{if(t.isConnected)i()})}var Va=/^(?:impulse|inhibition|action|acted|thought|inner\s*thought|saw|heard|saw\/heard|take|observation|trigger|response|result|outcome|cause|effect|before|after|step|status|state|goal|intent|attitude|location|current|current\s*step|next|hook|active\s*plans?|leverage|pivot|reward|risk|verdict|knows\/misreads|knows|blind\s*to|secret\s*stage)$/i;function Xs(t){return t.replace(/\[\s*([^\]\n:]{1,40}?)\s*\]\s*\{\s*([^\}\n]+?)\s*\}/g,"$1: $2").replace(/([A-Za-z][A-Za-z0-9_\/\s-]{1,32})\s*:\s*\[([^\[\]\n]+)\]/g,"$1: $2").replace(/\[\s*([^\]\n:]{1,40}?)\s*\]\s*:\s*\{?\s*([^\]\}\n]+?)\s*\}?(?=\s*(?:->|→|⇒|\||vs\b|$))/gi,"$1: $2")}function we(t){let n=Xs(t).trim();while(n.startsWith("[")&&n.endsWith("]")&&!n.slice(1,-1).includes("[")||n.startsWith("{")&&n.endsWith("}")&&!n.slice(1,-1).includes("{"))n=n.slice(1,-1).trim();return n}function _t(t){let n=Xs(t).trim();if(!n)return[];return n.split(/\r?\n|(?:\s*;\s*)|(?:\s+•\s+)/).map((a)=>we(a.replace(/^[-*•]\s+/,"").trim())).filter(Boolean).map((a)=>{let i=a.split(/\s*(?:->|→|⇒)\s*/).map((o)=>we(o)).filter(Boolean),r;if(i.length>1){let o=i[0],c=o.match(/^([^:\[\]\|]{2,50}):\s*([\s\S]+)$/),f=c?.[1]?.trim()??"",y=/^[^:\[\]]{1,30}:\s*\S/.test(i[1]);if(c&&!Va.test(f)&&!/\bvs\.?\b/i.test(o)&&!o.includes("|")&&!y)r=f,i[0]=c[2].trim()}let d=i.flatMap((o)=>o.split(/\s*\|\s*/)).map((o)=>we(o)).filter(Boolean);return{...r?{subject:r}:{},steps:d.length?d:[a]}})}function za(t){let n=we(t);if(!n)return null;let s=n.match(/^([^:->→\[\]]{1,40}):\s*([\s\S]*)$/),a=e("span","ls-step-node");if(s){let i=s[1].trim(),r=we(s[2]??"");if(!r)return null;let d=e("strong","",`${i}: `);d.style.color="var(--ls-primary)",d.style.marginRight="4px",a.append(d,document.createTextNode(r))}else a.textContent=n;return a}function Bn(t,n){let s=0;for(let a of n){let i=a.split(/\s+\bvs\.?\b\s+/i).map((d)=>d.trim()).filter(Boolean),r=[];for(let[d,o]of i.entries()){let c=za(o);if(c)r.push({chip:c,isVs:d>0})}if(!r.length)continue;if(s>0)t.append(e("span","ls-step-arrow","→"));for(let d of r){if(d.isVs)t.append(e("span","ls-step-arrow","vs"));t.append(d.chip)}s++}}function Xe(t,n="auto"){let s=t.trim();if(!s)return e("span","ls-muted","—");if(n==="quote_callout")return e("div","ls-thought-box",`“${we(s)}”`);if(n==="pill_list"){let d=e("div","ls-row");for(let o of s.split(/[,;\n]|->|→|⇒/).map((c)=>c.trim()).filter(Boolean))d.append(e("span","ls-chip ls-chip-accent",we(o)));return d}if(n==="step_chain"){let d=e("div","ls-step-chain ls-step-strip"),o=s.split(/\r?\n|(?:\s*;\s*)|\s*(?:->|→|⇒)\s*/).map((c)=>c.trim()).filter(Boolean);return Bn(d,o),d}if(n==="key_value"){let d=e("div","ls-kv-grid"),o=s.split(/\r?\n|(?:\s*;\s*)|\s*(?:->|→|⇒)\s*|\s+\bvs\.?\b\s+/i).map((c)=>c.replace(/^[-*•]\s+/,"").trim()).filter(Boolean);for(let[c,f]of o.entries()){let y=we(f),P=y.match(/^([^:]{1,45}):\s*([\s\S]+)$/),m=e("div","ls-kv-row");if(P)m.append(e("span","ls-kv-key",P[1].trim()),e("span","ls-kv-val",we(P[2])));else m.append(e("span","ls-kv-key",`#${c+1}`),e("span","ls-kv-val",y));d.append(m)}return d}if(!/->|→|⇒|\bvs\.?\b|\n|;|\[[^\]]+\]/i.test(s)&&n==="auto"){let d=e("p","",s);return d.style.margin="2px 0 0",d}if(n==="arc_tracker"){let d=s.split(/\r?\n|(?=\[\s*t\d+\b)|(?:\s*;\s*)/i).map((c)=>we(c.replace(/^[-*•]\s+/,"").trim())).filter(Boolean),o=e("div","ls-arc-list");for(let c of d){let f=e("div","ls-arc-card"),y=c.split(/\s*\|\s*/).map((v)=>v.trim()).filter(Boolean),P=y[0]??c,m=c.match(/\b(\d+)\s*\/\s*(\d+)\b/),S=m?Math.max(0,Number(m[1])):null,L=m?Math.max(1,Math.min(12,Number(m[2]))):null,k=c.match(/\b(ACTIVE|DORMANT|PAYOFF|COMPLETE(?:D)?|DONE|RETIRE(?:D)?|URGENT|FAIL(?:ED)?|ADVANCE|CONTINUE|SHIFT|DROP)\b/i),_=k?k[1].toUpperCase():"",I=P.replace(/^t\d+\s*/i,"").replace(/\(\s*([^|)]+?)\s*(?:\|\s*\d+\s*\/\s*\d+\s*)?\)\s*:?/,"$1:").trim(),b="",x=I.indexOf(":");if(x>0&&x<48)b=I.slice(x+1).trim(),I=I.slice(0,x).trim();else I=I.replace(/\s*\|\s*\d+\s*\/\s*\d+/,"").trim();let N=e("div","ls-row-between");N.append(e("strong","ls-arc-title",I||"Active Thread"));let C=e("div","ls-row");if(_){let v=e("span","ls-arc-status",_);v.dataset.arcStatus=_.toLowerCase(),C.append(v)}if(S!==null&&L!==null)C.append(e("span","ls-chip",`${S}/${L}`));if(N.append(C),f.append(N),S!==null&&L!==null){let v=e("div","ls-clock-bar ls-arc-clock");v.style.gridTemplateColumns=`repeat(${L}, 1fr)`;for(let u=1;u<=L;u++)v.append(e("span",`ls-clock-seg${u<=S?" is-filled":""}`));f.append(v)}if(b)f.append(e("p","ls-arc-summary",b));for(let v of y.slice(1)){if(/^\d+\s*\/\s*\d+$/.test(v))continue;let u=we(v),g=u.match(/^([^:]{1,28}):\s*([\s\S]+)$/);if(g){let p=e("div","ls-arc-meta");p.append(e("span","ls-kv-key",`${g[1].trim()}:`),e("span","ls-muted",g[2].trim())),f.append(p)}else f.append(e("small","ls-muted",u))}o.append(f)}return o}if(n==="accordion_cards"){let d=_t(s),o=e("div","ls-feed-list");for(let[c,f]of d.entries()){let y=e("details","ls-stat-acc");if(c===0)y.open=!0;let P=e("summary","ls-stat-acc-head"),m=f.subject||f.steps[0]||`Entry ${c+1}`,S=f.subject?f.steps[0]??"":f.steps[1]??"";P.append(e("strong","",m),...S?[e("small","ls-muted ls-stat-acc-preview",S)]:[]);let L=e("div","ls-stat-acc-body"),k=e("div","ls-step-chain");Bn(k,f.steps),L.append(k),y.append(P,L),o.append(y)}return o}if(n==="matrix_badges"){let d=s.split(/\r?\n|(?:\s*;\s*)/).map((c)=>we(c.replace(/^[-*•]\s+/,"").trim())).filter(Boolean),o=e("div","ls-feed-list");for(let c of d){let f=e("div","ls-matrix-card"),y=c.split(/\s*(?:\bvs\.?\b|\||->|→|⇒)\s*/i).map((L)=>we(L)).filter(Boolean),P=e("div","ls-matrix-cols"),m=y.slice(0,2),S=y.slice(2);for(let L of m){let k=e("div","ls-matrix-cell"),_=L.match(/^([^:]{1,28}):\s*([\s\S]+)$/);if(_)k.append(e("span","ls-kv-key",_[1].trim()),e("span","",we(_[2])));else k.append(e("span","",L));P.append(k)}f.append(P);for(let L of S){let k=e("div","ls-matrix-footer"),_=L.match(/^([^:]{1,28}):\s*([\s\S]+)$/);if(_)k.append(e("span","ls-kv-key",`${_[1].trim()}: `),e("span","",we(_[2])));else k.append(e("span","",L));f.append(k)}o.append(f)}return o}if(n==="meter_mini_bars"){let d=[...s.matchAll(/\b([A-Za-z][A-Za-z0-9_ -]{0,18}?)\s*[:=]?\s*(-?\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\b/g)];if(d.length>0){let o=e("div","ls-minibars-grid");for(let c of d){let f=c[1].trim(),y=Number(c[2]),P=Math.max(1,Number(c[3])),m=Math.max(0,Math.min(100,Math.round(y/P*100))),S=e("div","ls-minibar-cell"),L=e("div","ls-row-between");L.append(e("span","ls-kv-key",f),e("strong","",`${y}/${P}`));let k=e("div","ls-bar-track"),_=e("div","ls-bar-fill");if(_.style.width=`${m}%`,/hp|health|vital|blood/i.test(f))_.style.background="#f43f5e";else if(/mp|mana|ki|energy/i.test(f))_.style.background="#38bdf8";k.append(_),S.append(L,k),o.append(S)}return o}}if(n==="stat_pills_grid"){let d=e("div","ls-statpills-grid"),o=s.split(/\s*(?:\||,|;|\n)\s*/).flatMap((c)=>{let f=c.trim();if(!f)return[];if(/^(?:[A-Za-z]{1,8}\d+\s+)+[A-Za-z]{1,8}\d+$/.test(f))return f.split(/\s+/);return[f]}).filter(Boolean);for(let c of o){let f=e("div","ls-statpill-tile"),y=c.match(/^([A-Za-z][A-Za-z0-9_]{0,12})\s*[:=]?\s*(-?\d+(?:\.\d+)?(?:\/\d+)?(?:\s*\([^)]+\))?)$/);if(y)f.append(e("span","ls-kv-key",y[1].trim()),e("strong","",y[2].trim()));else f.append(e("strong","",c));d.append(f)}return d}if(n==="bullet_ledger"){let d=s.split(/\r?\n|(?:\s*;\s*)|(?:\s+•\s+)/).map((c)=>c.replace(/^[-*•]\s+/,"").trim()).filter(Boolean),o=e("div","ls-ledger-list");for(let c of d){let f=e("div","ls-ledger-row"),y=c.match(/^(.+?)\s*:\s*([$€£¥]?\s*-?\d[\d,]*(?:\.\d+)?.*)$/);if(y)f.append(e("span","",y[1].trim()),e("span","ls-chip ls-chip-accent",y[2].trim()));else f.append(e("span","",c));o.append(f)}return o}if(n==="timeline_list"){let d=s.split(/\r?\n|(?:\s*;\s*)|\s*(?:->|→|⇒)\s*/).map((c)=>we(c.replace(/^[-*•]\s+/,"").trim())).filter(Boolean),o=e("div","ls-timeline-list");for(let c of d){let f=e("div","ls-timeline-item");f.append(e("span","ls-timeline-dot"),e("span","",c)),o.append(f)}return o}if(n==="checklist"){let d=s.split(/\r?\n|(?:\s*;\s*)/).map((c)=>c.replace(/^[-*•]\s+/,"").trim()).filter(Boolean),o=e("div","ls-checklist");for(let c of d){let f=/^(?:\[x\]|✓|✔|done:|completed:)/i.test(c),y=c.replace(/^(?:\[[ xX]\]|✓|✔|○)\s*/,"").trim(),P=e("div","ls-checklist-row");P.dataset.done=String(f),P.append(e("span","ls-checklist-box",f?"✓":""),e("span",f?"ls-muted":"",y)),o.append(P)}return o}let i=_t(s),r=e("div","ls-feed-list");for(let d of i){let o=e("div","ls-feed-card");if(d.subject)o.append(e("div","ls-feed-subject",`\uD83D\uDC64 ${d.subject}`));let c=e("div","ls-step-chain");Bn(c,d.steps),o.append(c),r.append(o)}return r}function Fe(t,n){let s={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},a=(o)=>o.replace(/[&<>"']/g,(c)=>s[c]),i=Ne(n),r=Object.values(n.characters).find((o)=>o.present)??Object.values(n.characters)[0],d={title:a(n.title),location:a(i.location),time:a(i.time),date:a(i.date),weather:a(i.weather),header:a(i.formatted),player_attire:a(n.player.attire),name:a(r?.name??""),role:a(r?.roleSummary??""),demeanor:a(r?.demeanor??""),attire:a(r?.attire??"")};return t.replace(/\{\{\s*([\w:.-]+)\s*\}\}/g,(o,c)=>{if(c.startsWith("stat:")){let f=c.slice(5),y=n.stats[f]?.value??r?.meters[f]?.value;return y!==void 0?a(String(y)):"—"}return d[c]??""})}function Et(t){let{state:n}=t.snapshot,s=Ne(n);t.modals.open({title:"✏️ Edit Scene Banner & Player Presentation",width:540},(a,i)=>{let r=(_,I,b)=>{let x=e("label","ls-label",_),N=e("input","ls-input");return N.value=I,N.placeholder=b,x.append(N),a.append(x),N},d=r("\uD83D\uDCCD Location & Region",n.scene.location||s.location,"e.g. Master Suite, Estate"),o=r("\uD83D\uDD70️ Time",n.scene.timeLabel||s.time,"e.g. 08:30 PM"),c=r("\uD83D\uDCC5 Date / Era",n.scene.dateLabel||s.date,"e.g. Day 1 · Evening"),f=r("\uD83C\uDF26️ Weather & Atmosphere",n.scene.weather||s.weather,"e.g. Warm Indoor Steam"),y=r("\uD83D\uDC55 Your Current Attire / Presentation",n.player.attire,"e.g. Wearing only a towel after a bath"),P=e("label","ls-label","Scene Beat Summary"),m=e("textarea","ls-input");m.rows=2,m.value=n.scene.beatSummary||"",P.append(m),a.append(P);let S=e("div","ls-row-between"),L=e("div","ls-row");L.append(B("⚙️ Pill Prompts",()=>{i(),Ae(t)},"ls-btn-sm"));for(let[_,I]of[["+15m",15],["+1h",60],["+1d",1440]])L.append(B(_,()=>{t.request("state:mutate",{patch:{scene:{elapsedMinutes:I}},reason:`Advanced clock ${_}`}),i()},"ls-btn-sm"));let k=B("\uD83D\uDCBE Save Scene",()=>{t.request("state:mutate",{patch:{scene:{location:d.value.trim(),timeLabel:o.value.trim(),dateLabel:c.value.trim(),weather:f.value.trim(),beatSummary:m.value.trim()},player:{attire:y.value.trim()}},reason:"Updated scene & player presentation"}),i()},"ls-btn-primary");S.append(L,k),a.append(S)})}function Ze(t,n){t.modals.open({title:"\uD83E\uDDEA Two-Phase Stat Calibration & Reactivity Sandbox",width:660,maxHeight:760},(s,a)=>{let i=e("label","ls-label","Test Scenario / Turn Input (or leave blank to auto-generate)"),r=e("textarea","ls-input");r.rows=2,r.placeholder='e.g. "My loyal maid greets me as I step out of the bath wearing only a towel."',i.append(r);let d=e("div","ls-stack"),o=()=>{d.replaceChildren(e("p","ls-muted","⏳ Evaluating scenario against two-phase calibration rules…")),t.request("sandbox:test",{statId:n,scenarioText:r.value.trim()||void 0}).then((f)=>{d.replaceChildren();let y=e("div","ls-card");y.append(e("span","ls-kicker","\uD83D\uDCD6 Evaluated Beat"),e("p","",String(f.testBeat??""))),d.append(y);let P=Array.isArray(f.auditEntries)?f.auditEntries:[];if(!P.length)d.append(e("p","ls-muted","No stats shifted for this scenario."));else for(let m of P){let S=e("div","ls-stat-cell"),L=e("div","ls-row-between");L.append(e("strong","",`${String(m.statLabel)} (${String(m.op)})`),e("span","ls-chip ls-chip-accent",`${String(m.before??"uncalibrated")} → ${String(m.after)}`)),S.append(L,e("small","ls-muted",String(m.reason??""))),d.append(S)}}).catch((f)=>{d.replaceChildren(e("p","ls-muted",f instanceof Error?f.message:String(f)))})},c=e("div","ls-row-between");c.append(B("▶ Run Sandbox Evaluation",o,"ls-btn-primary"),B("Close",a,"ls-btn-sm")),s.append(i,c,d),o()})}function Oe(t,n){let s=structuredClone(t.snapshot.template),a=n.scope==="player"?"character":"player",i=a==="character"?"cast":a==="world"?"world":"stats",r=a==="character"?"cast":a==="world"?"world":"stats",d=n.dossierTabId||"bonds";t.modals.open({title:`\uD83D\uDCCB Duplicate Stat: ${n.icon} ${n.label}`,width:540},(o,c,f,y)=>{o.append(e("p","ls-muted",`Copy "${n.label}" (including its style, color, range, anchors, and AI rules) into another scope or tab.`));let P=e("label","ls-label","New Stat Label (Can keep the same label for a different scope)"),m=e("input","ls-input");m.value=n.label,P.append(m);let S=e("div","ls-label","Target Owner Scope"),L=e("div");S.append(L);let k=e("div","ls-grid"),_=e("div","ls-label","\uD83E\uDE9F Target Widget Tab"),I=e("div");_.append(I);let b=e("div","ls-label","\uD83D\uDCAC Target Inline Tab"),x=e("div");b.append(x);let N=e("div","ls-label","\uD83E\uDEAA Target Dossier Tab"),C=e("div");N.append(C),k.append(_,b,N);let v=te(t,y,I,{value:i,ariaLabel:"Target Widget Tab",options:s.surfaces.widgetTabs.map((p)=>({value:p.id,label:`${p.icon} ${p.label}`})),onChange:(p)=>{i=p}}),u=te(t,y,x,{value:r,ariaLabel:"Target Inline Tab",options:s.surfaces.inlineTabs.map((p)=>({value:p.id,label:`${p.icon} ${p.label}`})),onChange:(p)=>{r=p}});te(t,y,C,{value:d,ariaLabel:"Target Dossier Tab",options:s.surfaces.dossierTabs.map((p)=>({value:p.id,label:`${p.icon} ${p.label}`})),onChange:(p)=>{d=p}}),te(t,y,L,{value:a,ariaLabel:"Target Owner Scope",options:[{value:"character",label:"\uD83D\uDC65 Character Meter (Per-NPC in Cast & Dossier)"},{value:"player",label:"\uD83D\uDC64 Player Stat"},{value:"world",label:"\uD83C\uDF0D World State Stat / Clock"},{value:"scene",label:"\uD83C\uDFAD Scene / Thread Stat"}],onChange:(p)=>{a=p;let h=a==="character"?"cast":a==="world"?"world":"stats";i=h,r=h,v.setValue(h),u.setValue(h)}});let g=B("\uD83D\uDCCB Create Duplicate Stat",()=>{let p=m.value.trim()||n.label,h=le(p,"stat"),T=a==="character"?"char":a,l=s.stats.some((M)=>M.id===h)?`${T}_${h}`:h;if(s.stats.some((M)=>M.id===l))l=`${T}_${h}_${Date.now().toString(36).slice(-3)}`;let w=re({...structuredClone(n),id:l,label:p,scope:a,tabId:i,widgetTabId:i,inlineTabId:r,dossierTabId:d,showIn:{widget:!0,inline:!0,dossier:a==="character",pinnedHeader:!1}});s.stats.push(w),t.request("state:mutate",{templatePatch:{stats:s.stats},reason:`Duplicated "${n.label}" to ${a} (${i})`}),t.notify(`Duplicated "${w.icon} ${w.label}" to ${a}!`),c()},"ls-btn-primary");g.style.marginTop="10px",o.append(P,S,k,g)})}function Ce(t,n="character",s){let a=structuredClone(t.snapshot.template);t.modals.open({title:s?`Edit Stat: ${s.icon} ${s.label}`:"Create Stat or Character Meter",width:660,maxHeight:820},(i,r,d,o)=>{let c=s?.scope??n,f=s?.categoryId??"",y=s?.kind??"meter",P=s?.volatility??(n==="character"?"progressive":"momentary"),m=s?.displayStyle??"auto",S=s?.layoutSpan??"auto",L=s?.color||"var(--lumiverse-primary)",k=s?.widgetTabId??(n==="world"?"world":n==="character"?"cast":"stats"),_=s?.inlineTabId??(n==="world"?"world":n==="character"?"cast":"stats"),I=s?.dossierTabId??"bonds",b=s?.showIn?.widget??!0,x=s?.showIn?.inline??!0,N=s?s.scope==="character"?s.showIn?.dossier??!0:!1:c==="character",C=s?.pinnedToHeader??!1,v=s?.locked??!1,u=e("div");i.append(u);let g=he(t,o,u,{title:"1. Basics & Value Format",iconName:"stats",defaultExpanded:!0}),p=e("div","ls-grid"),h=e("label","ls-label","Icon"),T=e("input","ls-input");T.value=s?.icon??(n==="character"?"\uD83D\uDC96":"\uD83D\uDCCA"),h.append(T);let l=e("label","ls-label","Stat Name"),w=e("input","ls-input");w.placeholder="e.g. Loyalty, Offscreen NPCs, Threat Clock…",w.value=s?.label??"",l.append(w);let M=e("div","ls-label","Category / Group (Optional)"),R=e("div");M.append(R),te(t,o,R,{value:f,ariaLabel:"Category / Group",options:[{value:"",label:"None (Uncategorized)"},...(a.categories??[]).map((q)=>({value:q.id,label:`${q.icon} ${q.name}`}))],onChange:(q)=>{f=q}}),p.append(h,l,M),g.append(p);let A=e("div","ls-grid"),E=e("div","ls-label","Owner Scope"),D=e("div");E.append(D);let F=e("div","ls-label","Value Format"),O=e("div");F.append(O);let V=e("div","ls-label","Reactivity Profile"),W=e("div");V.append(W),A.append(E,F,V),g.append(A);let H=e("div","ls-grid"),j=e("label","ls-label","Minimum"),z=e("input","ls-input");z.type="number",z.value=String(s?.min??0),j.append(z);let U=e("label","ls-label","Maximum / Segments"),K=e("input","ls-input");K.type="number",K.value=String(s?.max??100),U.append(K);let X=e("label","ls-label","Starting / Fallback Value"),J=e("input","ls-input");J.value=String(s?.defaultValue??0),X.append(J),H.append(j,U,X),g.append(H);let Y=()=>{let q=["meter","clock","pips","number","hearts","currency","attributes"].includes(y)&&m==="auto";H.style.display=q?"":"none"};Y();let ne=e("div");i.append(ne);let G=he(t,o,ne,{title:"2. Appearance, Visibility & Tabs",iconName:"palette",defaultExpanded:!1}),Q=e("div","ls-grid"),se=e("div","ls-label","Visual Display Style"),oe=e("div");se.append(oe);let Se=e("div","ls-label","Card Grid Width"),ce=e("div");Se.append(ce),Q.append(se,Se),G.append(Q);let yt=e("div","ls-label","Accent & Bar Color"),et=e("div","ls-row"),ln=[{value:"var(--lumiverse-primary)",label:"Theme Primary",preview:"var(--lumiverse-primary, #38bdf8)"},{value:"#38bdf8",label:"Sky Cyan",preview:"#38bdf8"},{value:"#f472b6",label:"Rose Pink",preview:"#f472b6"},{value:"#f59e0b",label:"Amber Gold",preview:"#f59e0b"},{value:"#10b981",label:"Emerald",preview:"#10b981"},{value:"#a78bfa",label:"Royal Violet",preview:"#a78bfa"},{value:"#f43f5e",label:"Crimson",preview:"#f43f5e"}],cn=()=>{for(let q of[...et.querySelectorAll(".ls-color-swatch")])q.setAttribute("aria-pressed",String(q.dataset.colorVal===L))};for(let q of ln){let Z=B("",()=>{L=q.value,cn()},"ls-color-swatch",q.label);Z.dataset.colorVal=q.value,Z.style.background=q.preview,et.append(Z)}let We=e("input");if(We.type="color",We.title="Custom color",We.style.cssText="width:26px;height:22px;border:0;padding:0;background:transparent;cursor:pointer;",L.startsWith("#")&&L.length===7)We.value=L;We.addEventListener("input",()=>{L=We.value,cn()}),et.append(We),cn(),yt.append(et),G.append(yt);let Un=e("div","ls-grid"),qn=e("div","ls-label","Floating Widget Tab"),Kn=e("div");qn.append(Kn);let Gn=e("div","ls-label","Inline Ribbon Tab"),Zn=e("div");Gn.append(Zn);let Xn=e("div","ls-label","Character Dossier Tab"),Yn=e("div");Xn.append(Yn),Un.append(qn,Gn,Xn),G.append(Un);let Qn=e("div","ls-grid"),Jn;for(let[q,Z,ue]of[["Show in Widget",b,(ie)=>{b=ie}],["Show in Inline Ribbon",x,(ie)=>{x=ie}],["Show in Dossier",N,(ie)=>{N=ie}],["Pin to Header / Pill",C,(ie)=>{C=ie}],["Lock Value",v,(ie)=>{v=ie}]]){let ie=e("div");if(q==="Show in Dossier")Jn=ie;xe(t,o,ie,{checked:Z,label:q,onChange:ue}),Qn.append(ie)}G.append(Qn);let Bt=new Set(s?.extraWidgetTabIds??[]),es=e("div","ls-label","Also Mirror in Additional Widget Tabs (Optional)"),ts=e("div","ls-row");for(let q of a.surfaces.widgetTabs){let Z=e("div");xe(t,o,Z,{checked:Bt.has(q.id),label:`${q.icon} ${q.label}`,onChange:(ue)=>{if(ue)Bt.add(q.id);else Bt.delete(q.id)}}),ts.append(Z)}es.append(ts),G.append(es);let be=s?.calculationMode==="ai_plus_local"||s?.calculationMode==="local_formula"?s.calculationMode:Boolean(s?.formula?.trim())&&s?.calculationMode!=="ai"?"local_formula":"ai",Dt=s?.promptTriggerMode??"always",dn=s?.injectInContinuity!==!1,ns=e("div");i.append(ns);let Ve=he(t,o,ns,{title:"3. Calculation Mode, Formula & Token Diet",iconName:"sparkles",badge:be==="local_formula"?"Pure Local":be==="ai_plus_local"?"AI + Local":"AI",defaultExpanded:!0}),pn=e("div","ls-stat-cell");pn.append(e("strong","","Calculation Mode"),e("small","ls-muted",'Use "AI + Local Math" when the AI must set starting values/deltas (e.g. Level & Stats, Vitals). Use "Pure Local" (0 tokens) when computed strictly from other stats (e.g. Eff POW/AGI).'));let ss=e("div","ls-row");pn.append(ss),Ve.append(pn);let un=e("div","ls-label","Prompt Frequency (When AI-Tracked)"),as=e("div");un.append(as),Ve.append(un);let rs=e("div");xe(t,o,rs,{checked:dn,label:"Include this stat in Story Continuity Prompt (turn off for UI-only scratchpads)",onChange:(q)=>{dn=q}}),Ve.append(rs);let mn=e("label","ls-label","Trigger Keywords (comma-separated — only sends rule when seen in recent chat)"),Ft=e("input","ls-input");Ft.placeholder="e.g. cash, money, bank, rent, pay, buy, wallet",Ft.value=(s?.promptKeywords??[]).join(", "),mn.append(Ft),Ve.append(mn);let fn=e("div","ls-stack"),fe=e("textarea","ls-input");fe.rows=4,fe.placeholder=`Write math using your stat IDs or auto-extracted tokens (e.g. round((40 + P + Lv * 2) * wound))
Supports: + - * / %, round(), floor(), ceil(), min(), max(), clamp(), if(), hasCond("...")`,fe.value=s?.formula??"";let os=e("label","ls-label","Output Format Template (optional, e.g. POW {pow} | AGI {agi})"),He=e("input","ls-input");He.placeholder="Leave blank for plain number, or e.g. POW {pow} | AGI {agi}",He.value=s?.formulaOutputTemplate??"",os.append(He);let Te=e("div","ls-formula-status"),Me=e("strong",""),Ht=e("small","ls-muted");Te.append(Me,Ht);let is=e("div","ls-label"),Ot=e("div","ls-row-between"),ye=e("textarea","ls-input");ye.rows=3,ye.value=s?.triggerCues??"",ye.placeholder='Write your rule in plain English (used by AI, or click "Convert My Rule to Formula" when Local Toggle is ON)…';let hn=e("div","ls-row"),xt=e("div","ls-row");Te.append(xt);let ha=(q)=>{let Z=fe.selectionStart??fe.value.length,ue=fe.selectionEnd??fe.value.length;fe.value=fe.value.slice(0,Z)+q+fe.value.slice(ue),fe.focus(),fe.setSelectionRange(Z+q.length,Z+q.length),nt()},gn=!1,tt="",bn=(q,Z)=>{if(gn)return;let ue=q.trim();if(!ue){if(be==="ai")be="local_formula";st(),Te.dataset.status="warn",Me.textContent="⚠ Write your plain-English rule in the box below first, then click Convert.",ye.focus();return}if(!ye.value.trim())ye.value=ue;gn=!0;let ie=Z?.textContent??"";if(Z)Z.disabled=!0,Z.textContent="⏳ Converting…";if(be==="ai")be="local_formula";st(),Te.dataset.status="warn",Me.textContent="⏳ Converting your rule to a universal local formula…",xt.replaceChildren(),t.request("formula:compile",{statLabel:w.value.trim()||"Stat",ruleText:ue,scope:c}).then((ae)=>{let Le=typeof ae.formula==="string"?ae.formula.trim():"";if(!Le){Te.dataset.status="error",Me.textContent="✖ AI returned an empty formula. Check your LLM connection in Studio → 6. AI & Connections.";return}if(fe.value=Le,typeof ae.outputTemplate==="string")He.value=ae.outputTemplate;if(ae.suggestedMode==="ai_plus_local"||ae.suggestedMode==="local_formula")be=ae.suggestedMode;if(tt=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),st(),ae.explanation)Ht.textContent=`✓ ${String(ae.explanation)} · ${Ht.textContent}`}).catch((ae)=>{Te.dataset.status="error",Me.textContent=`✖ Convert Failed: ${ae instanceof Error?ae.message:String(ae)}`}).finally(()=>{if(gn=!1,Z&&Z.isConnected)Z.disabled=!1,Z.textContent=ie})},nt=()=>{let q=re({...s,id:s?.id||le(w.value||"preview","preview"),label:w.value||"Preview",scope:c,kind:y,calculationMode:"local_formula",formula:fe.value,formulaOutputTemplate:He.value}),Z=Ds(q,t.snapshot.state,a.stats,t.selectedActorId);hn.replaceChildren(e("small","ls-muted","Insert Variable:"));let ue=[...Object.keys(Z.availableTokens).slice(0,12),...Z.availableStringVars.conditions!==void 0?["conditions"]:[]];for(let ae of ue){let Le=Z.availableTokens[ae]!==void 0?String(Z.availableTokens[ae]):Z.availableStringVars[ae]||'""';hn.append(B(`${ae} (${Le.slice(0,16)})`,()=>ha(fe.value.includes("{{")?`{{.${ae}}}`:ae),"ls-btn-sm ls-quick-pill",`Click to insert ${ae}`))}let ie=Object.entries(Z.availableTokens).slice(0,14).map(([ae,Le])=>`${ae}=${Le}`).join(", ");if(Ht.textContent=ie?`Detected on ${Z.targetName}: ${ie}`:`No numeric tokens detected yet on ${Z.targetName}.`,xt.replaceChildren(),!fe.value.trim()){if(Te.dataset.status="warn",Me.textContent=ye.value.trim()?"⚠ Formula box is empty. Click below to convert your plain-English rule automatically, or type math / {{calc::...}} macros.":"⚠ Enter math lines, Lumiverse {{calc::...}} / {{if::...}} macros, or write a rule below and click Convert.",ye.value.trim()){let ae=B("⚡ Convert My Rule to Local Formula",()=>bn(ye.value,ae),"ls-btn-sm ls-btn-primary");xt.append(ae)}}else if(Z.isProse){Te.dataset.status="warn",Me.textContent="⚠ Plain-English text detected — this box runs math/macro syntax. Click below to convert it automatically:";let ae=B("⚡ Convert This Text to Formula",()=>bn(fe.value,ae),"ls-btn-sm ls-btn-primary");xt.append(ae)}else if(Z.error)Te.dataset.status="error",Me.textContent=`✖ Formula Error: ${Z.error}`;else if(Z.output!==void 0){let ae=Object.keys(Z.locals).filter(($e)=>$e!=="value"&&$e!=="result");if(ae.length>=2&&!He.value.trim()&&!fe.value.includes("{{"))Te.dataset.status="warn",Me.textContent=`⚠ Result is just "${String(Z.output)}" because Output Format Template is blank. Add e.g. {${ae.join("} {")}} above!`;else{Te.dataset.status="ok";let $e=tt?` (Tested ${tt})`:"";Me.textContent=`✓ Working on ${Z.targetName} → Result: ${String(Z.output)}${$e}`}}else if(Z.missingRefs.length>0)Te.dataset.status="warn",Me.textContent=`⚠ Waiting for variables: ${Z.missingRefs.join(", ")}`;else Te.dataset.status="warn",Me.textContent="⚠ Formula evaluated empty — check placeholder names or macro tags."};fe.addEventListener("input",()=>{tt="",nt()}),He.addEventListener("input",()=>{tt="",nt()});let ls=e("div","ls-row-between");ls.append(e("strong","","Local Formula or Lumiverse Macros ({{calc}}, {{if}}, {{round}}, {{matches}})"),B("▶ Run Live Test",()=>{tt=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),nt()},"ls-btn-sm")),fn.append(ls,hn,fe,os,Te),Ve.append(fn);let cs=[],st=()=>{for(let ue of cs)ue.el.setAttribute("aria-current",ue.id===be?"page":"false");let q=be==="local_formula"||be==="ai_plus_local",Z=be==="ai"||be==="ai_plus_local";if(fn.style.display=q?"":"none",un.style.display=Z?"":"none",mn.style.display=Z&&Dt==="conditional"?"":"none",q)nt()};for(let[q,Z]of[["ai","\uD83E\uDD16 AI Only"],["ai_plus_local","\uD83D\uDD00 AI + Local Math"],["local_formula","⚡ Pure Local (0 tokens)"]]){let ue=B(Z,()=>{be=q,st()},"ls-btn-sm");cs.push({id:q,el:ue}),ss.append(ue)}te(t,o,as,{value:Dt,ariaLabel:"Prompt Frequency",options:[{value:"always",label:"Always in Prompt"},{value:"conditional",label:"Only When Keywords Match"},{value:"manual",label:"Manual Sync Only"}],onChange:(q)=>{Dt=q,st()}}),st(),Ot.append(e("span","","Rule / AI Prompt Instructions"),e("div","ls-row"));let ds=B("⚡ Convert My Rule to Local Formula",()=>bn(ye.value,ds),"ls-btn-sm ls-btn-primary");Ot.lastElementChild.append(ds);let vn=te(t,o,oe,{value:m,ariaLabel:"Visual Display Style",options:[{value:"auto",label:"✨ Smart Auto-Detect"},{value:"arc_tracker",label:"\uD83C\uDFAF Multi-Thread / Arc / Quest Cards"},{value:"accordion_cards",label:"\uD83D\uDDC2️ Collapsible Multi-Entry Cards"},{value:"matrix_badges",label:"⚖️ Split / Versus Comparison (Knows vs Blind)"},{value:"meter_mini_bars",label:"\uD83D\uDCCA Multi-Bar Mini Gauges (HP/MP cur/max)"},{value:"stat_pills_grid",label:"\uD83E\uDDEC Compact Stat Badges (Lv / P A I / POW)"},{value:"bullet_ledger",label:"\uD83D\uDCB0 Aligned Bullet & Currency Ledger"},{value:"timeline_list",label:"\uD83D\uDCDC Vertical Event Timeline"},{value:"checklist",label:"☑️ Visual Objectives Checklist"},{value:"feed_cards",label:"\uD83C\uDCCF Structured Flow Cards"},{value:"step_chain",label:"⛓️ Horizontal Step Chain"},{value:"key_value",label:"\uD83D\uDCCB Key–Value Table"},{value:"pill_list",label:"\uD83C\uDFF7️ Tag / Pill List"},{value:"quote_callout",label:"\uD83D\uDCAD Quote Callout Box"}],onChange:(q)=>{m=q;let Z=new Set(["text","tags","tier","skill_tree","xp_level","attributes","inventory","status_fx"]);if(m==="pill_list")y="tags",Wt.setValue("tags");else if(m!=="auto"&&!Z.has(y))y="text",Wt.setValue("text");Y()}}),yn=te(t,o,ce,{value:S,ariaLabel:"Card Grid Width",options:[{value:"auto",label:"\uD83D\uDCD0 Auto"},{value:"full",label:"↔️ Always Full Width"},{value:"half",label:"▫ Always Compact Column"}],onChange:(q)=>{S=q}});te(t,o,D,{value:c,ariaLabel:"Owner Scope",options:[{value:"character",label:"\uD83D\uDC65 Character Meter (Per-NPC)"},{value:"player",label:"\uD83D\uDC64 Player Stat"},{value:"world",label:"\uD83C\uDF0D World Stat / Clock"},{value:"scene",label:"\uD83C\uDFAD Scene / Thread Stat"}],onChange:(q)=>{c=q,N=c==="character";let Z=Jn?.querySelector("input");if(Z)Z.checked=N;if(be==="local_formula")nt()}});let Wt=te(t,o,O,{value:y,ariaLabel:"Value Format",options:[{value:"meter",label:"\uD83D\uDCCA Progress Bar / Meter"},{value:"skill_tree",label:"\uD83C\uDF33 Skill Tree & SP"},{value:"xp_level",label:"⭐ XP & Leveling Gauge"},{value:"attributes",label:"\uD83E\uDDEC RPG Attributes + Radar"},{value:"inventory",label:"\uD83C\uDF92 Rarity Inventory"},{value:"status_fx",label:"⚡ Buffs & Debuffs"},{value:"hearts",label:"❤️ Heart Affinity Row"},{value:"currency",label:"\uD83E\uDE99 Currency Counter"},{value:"clock",label:"⏱️ Segmented Clock"},{value:"pips",label:"\uD83C\uDFB2 Resource Pips"},{value:"text",label:"\uD83D\uDCDD Structured Text / Feed"},{value:"tags",label:"\uD83C\uDFF7️ Tag / Pill List"},{value:"tier",label:"\uD83C\uDFC6 Ordered Stage / Rank"},{value:"number",label:"\uD83D\uDD22 Numeric Counter"},{value:"boolean",label:"☑️ Boolean Flag"}],onChange:(q)=>{if(y=q,y==="tags"&&m==="auto")m="pill_list",vn.setValue("pill_list");else if(["meter","clock","pips","number","boolean","skill_tree","xp_level","attributes","inventory","status_fx","hearts","currency"].includes(y)){if(m="auto",vn.setValue("auto"),["skill_tree","attributes","inventory","status_fx"].includes(y))S="full",yn.setValue("full")}if(!s){if(y==="clock")K.value="6";else if(y==="pips"||y==="hearts")K.value="5";else if(y==="attributes")K.value="20";else if(y==="currency")K.value="99999999";else if(y==="meter"&&["5","6"].includes(K.value.trim()))K.value="100"}else if(["clock","pips","hearts"].includes(y)&&Number(K.value)===100)K.value=y==="clock"?"6":"5";if(["text","tags","tier"].includes(y)&&J.value.trim()==="0")J.value="";Y()}});te(t,o,W,{value:P,ariaLabel:"Reactivity Profile",options:[{value:"momentary",label:"⚡ Momentary — Instant reaction"},{value:"progressive",label:"\uD83D\uDCC8 Progressive — Steady evolution"},{value:"anchor",label:"⚓ Anchor — Role/premise baseline"}],onChange:(q)=>{P=q}}),te(t,o,Kn,{value:k,ariaLabel:"Floating Widget Tab",options:a.surfaces.widgetTabs.map((q)=>({value:q.id,label:`${q.icon} ${q.label}`})),onChange:(q)=>{k=q}}),te(t,o,Zn,{value:_,ariaLabel:"Inline Ribbon Tab",options:a.surfaces.inlineTabs.map((q)=>({value:q.id,label:`${q.icon} ${q.label}`})),onChange:(q)=>{_=q}}),te(t,o,Yn,{value:I,ariaLabel:"Character Dossier Tab",options:a.surfaces.dossierTabs.map((q)=>({value:q.id,label:`${q.icon} ${q.label}`})),onChange:(q)=>{I=q}}),Ot.lastElementChild.append(B("\uD83C\uDF33 Skill Rule",()=>{y="skill_tree",Wt.setValue("skill_tree"),S="full",yn.setValue("full"),ye.value='Format: "SP: N | Skill A (Lv.X/Y, cost:1, bonus) ; Skill B (Lv.X/Y, cost:1, req:Skill A)". Grant SP on milestones or training.',Y()},"ls-btn-sm"),B("✨ Feed Rule",()=>{y="text",Wt.setValue("text"),m="feed_cards",vn.setValue("feed_cards"),S="full",yn.setValue("full"),ye.value='Format each entry separated by "; " as: "Subject: Current Location -> Action -> Next Hook".',Y()},"ls-btn-sm"),B("⛶ Full-Screen",()=>{t.request("textEditor:open",{title:`AI Prompt Rule: ${w.value||"Stat"}`,value:ye.value,placeholder:"Describe when this stat should calibrate high/low and what situational cues shift it…"}).then((q)=>{if(!q.cancelled&&typeof q.text==="string")ye.value=q.text})},"ls-btn-sm")),is.append(Ot,ye),Ve.append(is);let ps=e("div","ls-label"),us=e("div","ls-row-between"),at=e("textarea","ls-input");at.rows=2,at.placeholder=`Optional — e.g.
80: High — Description
50: Moderate — Description`,at.value=(s?.anchors??[]).map((q)=>`${q.value}: ${q.label}${q.description&&q.description!==q.label?` — ${q.description}`:""}`).join(`
`),us.append(e("span","","Scale Anchors (value: Label — Description)"),B("✨ Auto-Fill Anchors",()=>{let q=xs(Number(z.value)||0,Number(K.value)||100,P);at.value=q.map((Z)=>`${Z.value}: ${Z.label} — ${Z.description}`).join(`
`)},"ls-btn-sm")),ps.append(us,at),Ve.append(ps);let ga=(q)=>{if(!q.trim())return[];let Z=[];for(let ue of q.split(`
`).map((ie)=>ie.trim()).filter(Boolean)){let ie=ue.match(/^(-?\d+(?:\.\d+)?)\s*:\s*([^—\-]+?)(?:\s*[—\-]\s*(.+))?$/);if(ie)Z.push({value:Number(ie[1]),label:ie[2].trim(),description:(ie[3]??ie[2]).trim()})}return Z},ms=B(s?"Save Changes":"Create Stat",()=>{let q=w.value.trim();if(!q)return;let Z=structuredClone(t.snapshot.template),ue=Number(z.value),ie=z.value.trim()!==""&&Number.isFinite(ue)?ue:0,ae=Number(K.value),Le=K.value.trim()!==""&&Number.isFinite(ae)?ae:100,$e=J.value.trim(),fs=Number($e),hs=y==="boolean"?$e==="true"||$e==="1":["meter","number","clock","pips","hearts","currency"].includes(y)&&m==="auto"?$e!==""&&Number.isFinite(fs)?fs:Math.max(Math.min(ie,Le),Math.min(Math.max(ie,Le),0)):$e&&$e!=="0"?$e:void 0,ba=Ft.value.split(",").map((Ie)=>Ie.trim().toLowerCase()).filter(Boolean),gs=s?.id,xn=[];if(s&&q.toLowerCase()!==s.label.trim().toLowerCase()){let Ie=le(q,s.id),va=Z.stats.some((ys)=>ys.id===Ie&&ys.id!==s.id);if(Ie&&Ie!==s.id&&!va)gs=Ie,xn.push({fromId:s.id,toId:Ie})}let wt=re({...s,id:gs,label:q,icon:T.value.trim()||"\uD83D\uDCCA",scope:c,kind:y,volatility:P,displayStyle:m,layoutSpan:S,color:L,min:ie,max:Le,...hs!==void 0?{defaultValue:hs}:{},anchors:ga(at.value),triggerCues:ye.value.trim(),calculationMode:be,formula:be==="local_formula"||be==="ai_plus_local"?fe.value.trim():void 0,formulaOutputTemplate:be==="local_formula"||be==="ai_plus_local"?He.value.trim():void 0,promptTriggerMode:Dt,promptKeywords:ba,injectInContinuity:dn,categoryId:f||void 0,pinnedToHeader:C,locked:v,widgetTabId:k,inlineTabId:_,dossierTabId:I,extraWidgetTabIds:[...Bt].filter((Ie)=>Ie!==k),showIn:{widget:b,inline:x,dossier:N,pinnedHeader:C}}),bs=s?Z.stats.findIndex((Ie)=>Ie.id===s.id):-1,vs=Z.stats.findIndex((Ie)=>Ie.id===wt.id);if(bs>=0)Z.stats[bs]=wt;else if(vs>=0)Z.stats[vs]=wt;else Z.stats.push(wt);t.request("state:mutate",{templatePatch:{stats:Z.stats},...xn.length?{statRenames:xn}:{},reason:`Saved stat schema "${wt.label}"`}),r()},"ls-btn-primary"),Vt=e("div","ls-row-between");if(Vt.style.marginTop="12px",s){let q=e("div","ls-row");q.append(B("Duplicate to Another Tab…",()=>{r(),Oe(t,s)},"ls-btn-sm"),B("\uD83D\uDDD1️ Delete Stat",async()=>{if(!await t.modals.confirm({title:`Delete "${s.label}"?`,message:`Remove "${s.icon} ${s.label}" from the active template and stop tracking it?`,confirmLabel:"Delete",variant:"danger"}))return;let ue=structuredClone(t.snapshot.template);t.request("state:mutate",{templatePatch:{stats:ue.stats.filter((ie)=>ie.id!==s.id)},reason:`Deleted stat "${s.label}"`}),t.notify(`Deleted "${s.icon} ${s.label}".`),r()},"ls-btn-sm ls-btn-danger")),Vt.append(q,ms)}else Vt.append(e("span"),ms);i.append(Vt)})}function Dn(t,n,s,a,i=!1,r=!0){let{state:d,template:o,deltas:c}=t.snapshot,f=e("div","ls-stack");if(r){let b=e("div","ls-row-between");b.append(e("span","ls-kicker",`Active Stats (${n.length})`),e("div","ls-row")),b.lastElementChild.append(ee("flask",()=>Ze(t),{label:"Sandbox",className:"ls-btn-sm ls-btn-ghost",title:"Test stats in AI Sandbox"}),ee("plus",()=>Ce(t,s),{label:"Add Stat",className:"ls-btn-sm ls-btn-primary",title:"Create a new stat or meter"})),f.append(b)}if(!n.length)return f.append(e("p","ls-muted",'No stats assigned here yet. Click "+ Add Stat" or customize tab assignments in Studio.')),f;let y=new Map((o.categories??[]).map((b)=>[b.id,b])),P=n.filter((b)=>{if(!b.categoryId)return!0;let x=y.get(b.categoryId);return!x||x.enabled!==!1}),m=e("div","ls-stat-grid"),S=(b,x,N="set")=>{t.request("state:mutate",{patch:{stats:{[b.id]:{op:N,value:x,reason:"Manual UI adjustment"}}},reason:`Updated ${b.label} to ${String(x)}`})},L=[],k=[...P].sort((b,x)=>{let N=b.categoryId?y.get(b.categoryId)?.order??999:1000,C=x.categoryId?y.get(x.categoryId)?.order??999:1000;return N-C}),_;for(let b of k){let x=b.categoryId?y.get(b.categoryId):void 0;if(x&&x.showGroupHeaderInHud!==!1&&x.id!==_){_=x.id;let H=e("div","ls-hud-cat-head");H.style.borderLeftColor=x.color||"var(--ls-primary)",H.append(e("strong","",`${x.icon} ${x.name}`)),m.append(H)}else if(!x&&_!==void 0)_=void 0;let N=d.stats[b.id],C=Boolean(N?.calibrated),v=N!==void 0?N.value:b.defaultValue,u=Boolean(b.locked||N?.locked),g=c.statDeltas[b.id]??0,p=String(v??""),h=["skill_tree","xp_level","attributes","inventory","status_fx"].includes(b.kind),T=Boolean(b.displayStyle&&b.displayStyle!=="auto"),l=b.kind==="text"||b.kind==="tags"||b.kind==="tier",w=!h&&(T||l||C&&typeof v==="string"&&(p.length>24||/->|→|\n|;/.test(p))),M=/->|→|\n|;/.test(p),R=b.displayStyle==="stat_pills_grid"||b.displayStyle==="meter_mini_bars",A=b.layoutSpan==="full"||b.layoutSpan!=="half"&&(["skill_tree","attributes","inventory","status_fx","xp_level"].includes(b.kind)||T&&!R||w&&(p.length>40||M))?"full":"half",E=e("div","ls-stat-cell");if(E.style.setProperty("--ls-bar-color",b.color||"var(--ls-primary)"),E.dataset.locked=String(u),E.dataset.uncalibrated=String(!C),E.dataset.span=A,N?.lastReason)E.title=`${N.lastReason} (Right-click or long-press for options)`;let D=e("div","ls-row-between"),F=e("div","ls-row");if(F.append(e("strong","",`${b.icon} ${b.label}`)),b.calculationMode==="ai_plus_local")F.append(e("span","ls-chip ls-chip-accent","\uD83D\uDD00 Hybrid"));else if(b.calculationMode==="local_formula"||b.formula)F.append(e("span","ls-chip ls-chip-accent","⚡ Local"));D.append(F);let O=e("div","ls-row");if(g!==0)O.append(e("span",`ls-delta ${g>0?"is-pos":"is-neg"}`,`${g>0?`+${g} ▲`:`${g} ▼`}`));let V="";if(!C&&!h)V="Uncalibrated";else if(b.kind==="clock"||b.kind==="pips")V=`${Number(v)||0}/${b.max}`;else if(b.kind==="boolean")V=v?"✓ Active":"○ Inactive";else if(h||b.kind==="currency"||b.kind==="hearts")V="";else if(w){let H=_t(p).length;V=H>1?`${H} entries`:""}else V=p;let W=e("strong",V?"ls-chip ls-chip-accent":"",V);if(V)O.append(W);if(O.append(ee("edit",()=>Ce(t,b.scope,b),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:`Edit "${b.label}" style, tab & prompt`})),D.append(O),E.append(D),typeof v==="number"&&C&&!w&&b.kind!=="currency"){let H=Ue(b.anchors,v);if(H)E.append(e("small","ls-muted",H))}else if(!C&&!h)E.append(e("small","ls-muted","Calibrates automatically on turn sync"));if(b.kind==="skill_tree")E.append(dt(b,v,u,(H,j)=>{t.request("state:mutate",{patch:{stats:{[b.id]:{op:"set",value:H,reason:j}}},reason:j})}));else if(b.kind==="xp_level")E.append(pt(b,v));else if(b.kind==="attributes")E.append(ut(b,v,`player:${t.chatId}`));else if(b.kind==="inventory")E.append(mt(v));else if(b.kind==="status_fx")E.append(ft(v));else if(b.kind==="hearts")E.append(ht(b,Number(v)||0,C,u,(H)=>S(b,H,"set")));else if(b.kind==="currency")E.append(gt(b,v,g));else if(w&&C&&p&&p!=="None")E.append(Xe(p,b.displayStyle??"auto"));else if(b.kind==="clock"){let H=Math.max(2,Math.min(16,b.max||6)),j=C?Math.max(0,Math.min(H,Math.round(Number(v)||0))):0,z=e("div","ls-clock-bar");z.style.gridTemplateColumns=`repeat(${H}, 1fr)`;for(let U=1;U<=H;U++){let K=e("span",`ls-clock-seg${U<=j?" is-filled":""}`);K.addEventListener("click",()=>S(b,U===j?U-1:U,"set")),z.append(K)}E.append(z)}else if(b.kind==="pips"){let H=Math.max(1,Math.min(12,b.max||5)),j=C?Math.max(0,Math.min(H,Math.round(Number(v)||0))):0,z=e("div","ls-row");for(let U=1;U<=H;U++)z.append(B(U<=j?"◆":"◇",()=>S(b,U===j?U-1:U,"set"),"ls-btn-sm ls-btn-icon"));E.append(z)}else if(!w&&(b.kind==="meter"||b.kind==="number")){let H=typeof v==="number"?v:Number(b.defaultValue)||0,j=Math.max(1,b.max-b.min),z=e("div","ls-bar-track"),U=e("div","ls-bar-fill");if(b.min<0&&b.max>0){z.dataset.bipolar="true";let K=(0-b.min)/j*100;if(H>=0)U.style.marginLeft=`${K.toFixed(1)}%`,U.style.width=`${Math.min(100-K,H/b.max*(100-K)).toFixed(1)}%`;else{let X=Math.abs(H)/Math.abs(b.min)*K;U.style.marginLeft=`${Math.max(0,K-X).toFixed(1)}%`,U.style.width=`${Math.min(K,X).toFixed(1)}%`,U.style.background="var(--ls-danger)"}}else{let K=Math.max(0,Math.min(100,Math.round((H-b.min)/j*100)));U.style.width=`${K}%`}if(z.append(U),E.append(z),i&&a&&t.ctx.components?.mountRangeSlider){let K=e("div");E.append(K);try{a.track(t.ctx.components.mountRangeSlider(K,{min:b.min,max:b.max,step:b.step||1,integer:!0,value:H,disabled:u,onDragValue:(X)=>{if(X!==null)W.textContent=String(X)},onCommit:(X)=>S(b,X,"set")}))}catch{}}}Ut(t.ctx,E,()=>[{key:"pin",label:b.pinnedToHeader?"\uD83D\uDCCC Unpin from Header":"\uD83D\uDCCD Pin to Header",active:b.pinnedToHeader},{key:"lock",label:u?"\uD83D\uDD13 Unlock Stat":"\uD83D\uDD12 Lock Stat",active:u},{key:"edit",label:"✏️ Edit Stat Schema, Visual Style & Routing"},{key:"duplicate",label:"\uD83D\uDCCB Duplicate to Another Scope / Tab…"},{key:"test",label:"\uD83E\uDDEA Test in AI Sandbox"},{key:"div",label:"",type:"divider"},{key:"delete",label:"\uD83D\uDDD1️ Delete Stat",danger:!0}],(H)=>{if(H==="pin"){let j=o.stats.map((z)=>z.id===b.id?{...z,pinnedToHeader:!z.pinnedToHeader,showIn:{...z.showIn,pinnedHeader:!z.pinnedToHeader}}:z);t.request("state:mutate",{templatePatch:{stats:j}})}else if(H==="lock"){let j=o.stats.map((z)=>z.id===b.id?{...z,locked:!u}:z);t.request("state:mutate",{templatePatch:{stats:j}})}else if(H==="edit")Ce(t,b.scope,b);else if(H==="duplicate")Oe(t,b);else if(H==="test")Ze(t,b.id);else if(H==="delete"){let j=o.stats.filter((z)=>z.id!==b.id);t.request("state:mutate",{templatePatch:{stats:j}})}}),L.push({cell:E,spanMode:A,autoSpan:!b.layoutSpan||b.layoutSpan==="auto"}),m.append(E)}let I=0;for(let b=0;b<L.length;b++){let x=L[b];if(x.spanMode==="half"){if(I++,(b===L.length-1||L[b+1].spanMode==="full")&&I%2===1&&x.autoSpan)x.cell.dataset.span="full",I=0}else I=0}return f.append(m),f}var Zs=new Map;function ja(t,n,s,a=!1){let{state:i,deltas:r}=t.snapshot,d=e("div","ls-stack"),o=Object.values(i.characters),c=o.filter((m)=>m.present),f=o.filter((m)=>!m.present),y=c.length>0?c:f,P=c.length>0?f:[];if(!o.length)return d.append(e("p","ls-muted",`${n.map((m)=>`${m.icon} ${m.label}`).join(", ")} will appear here once characters enter the scene.`)),d;for(let m of n){let S=e("div","ls-stat-cell");S.style.setProperty("--ls-bar-color",m.color||"var(--ls-primary)"),S.dataset.span="full";let L=e("div","ls-row-between");L.append(e("strong","",`${m.icon} ${m.label} (Cast)`),B("✏️",()=>Ce(t,"character",m),"ls-btn-sm ls-btn-icon","Customize stat schema & tab")),S.append(L);let k=["skill_tree","xp_level","attributes","inventory","status_fx"].includes(m.kind),_=Boolean(m.displayStyle&&m.displayStyle!=="auto")||["text","tags","tier"].includes(m.kind),I=(x,N)=>{let C=N.meters[m.id],v=Boolean(C?.calibrated),u=v&&C?C.value:m.defaultValue,g=r.characterDeltas[N.id]?.[m.id]??0;if(k||_||m.kind==="boolean"||m.kind==="hearts"||m.kind==="currency"){let F=e("div","ls-cast-mini-meter");F.style.gridColumn="1 / -1";let O=e("div","ls-row-between");if(O.append(e("small","ls-muted",`${N.present?"\uD83D\uDFE2":"⚪"} ${N.name}`),e("small","",v||k?"":"Uncalibrated")),F.append(O),m.kind==="skill_tree")F.append(dt(m,u,Boolean(m.locked||C?.locked),(V,W)=>{t.request("state:mutate",{patch:{characters:[{id:N.id,name:N.name,meters:{[m.id]:{op:"set",value:V,reason:W}}}]},reason:W})}));else if(m.kind==="xp_level")F.append(pt(m,u));else if(m.kind==="attributes")F.append(ut(m,u,`${N.id}:${t.chatId}`));else if(m.kind==="inventory")F.append(mt(u));else if(m.kind==="status_fx")F.append(ft(u));else if(m.kind==="hearts")F.append(ht(m,Number(u)||0,v,Boolean(m.locked||C?.locked)));else if(m.kind==="currency")F.append(gt(m,u,g));else F.append(v?Xe(String(u??""),m.displayStyle??"auto"):e("small","ls-muted","—"));x.append(F);return}let p=v&&typeof u==="number"?u:0,h=Math.max(1,m.max-m.min),T=v?Math.max(0,Math.min(100,Math.round((p-m.min)/h*100))):0,l=v?Ue(m.anchors,p):"",w=e("div","ls-cast-mini-meter");if(l)w.title=`${N.name} · ${m.label}: ${p} (${l})`;let M=e("div","ls-row-between");M.append(e("small","ls-muted",`${N.present?"\uD83D\uDFE2":"⚪"} ${N.name}`));let R=e("div","ls-row");if(g!==0)R.append(e("span",`ls-delta ${g>0?"is-pos":"is-neg"}`,g>0?`+${g}`:String(g)));let A=e("strong","",v?m.kind==="clock"||m.kind==="pips"?`${p}/${m.max}`:String(p):"—");R.append(A),M.append(R);let E=e("div","ls-bar-track"),D=e("div","ls-bar-fill");if(D.style.width=`${T}%`,E.append(D),w.append(M,E),a&&s&&t.ctx.components?.mountRangeSlider){let F=e("div");w.append(F);try{s.track(t.ctx.components.mountRangeSlider(F,{min:m.min,max:m.max,step:m.step||1,integer:!0,value:p,disabled:Boolean(m.locked||C?.locked),onDragValue:(O)=>{if(O!==null)A.textContent=String(O)},onCommit:(O)=>{t.request("state:mutate",{patch:{characters:[{id:N.id,name:N.name,meters:{[m.id]:{op:"set",value:O,reason:"Manual UI adjustment"}}}]},reason:`Updated ${N.name} ${m.label} to ${O}`})}}))}catch{}}x.append(w)},b=e("div","ls-cast-mini-grid");for(let x of y)I(b,x);if(S.append(b),P.length>0){let x=e("details","ls-stat-acc");x.open=Zs.get(m.id)??!1,x.addEventListener("toggle",()=>{Zs.set(m.id,x.open)});let N=e("summary","ls-stat-acc-head");N.append(e("small","ls-muted",`⚪ Away (${P.length}): ${P.map((u)=>u.name).join(", ")}`),e("small","ls-muted","▾"));let C=e("div","ls-stat-acc-body"),v=e("div","ls-cast-mini-grid");for(let u of P)I(v,u);C.append(v),x.append(N,C),S.append(x)}d.append(S)}return d}function tn(t,n,s,a,i=!1){let{template:r}=t.snapshot,d=r.stats.filter((m)=>{if(!m.enabled)return!1;if(n==="widget"&&m.showIn?.widget===!1)return!1;if(n==="inline"&&m.showIn?.inline===!1)return!1;let S=m.scope==="character"?"cast":m.tabId,L=n==="widget"?m.widgetTabId||S:m.inlineTabId||S,k=n==="widget"?m.extraWidgetTabIds:m.extraInlineTabIds;return L===s||Boolean(k?.includes(s))}),o=d.filter((m)=>m.scope!=="character"),c=d.filter((m)=>m.scope==="character"),f=s==="world"?"world":"player",y=e("div","ls-stack"),P=Ua(t,n,s);if(P.childElementCount>0)y.append(P);if(o.length>0||c.length===0&&y.childElementCount===0)y.append(Dn(t,o,f,a,i,!0));if(c.length>0)y.append(ja(t,c,a,i));if(s==="world"){let m=qa(t);if(m.childElementCount>0)y.append(m)}return y}function Ua(t,n,s="stats"){let{state:a,template:i}=t.snapshot,r=i.coreTrackers,d=e("div","ls-stat-grid"),o=(f,y,P)=>{let m=Re(r,f);if(!m.enabled)return;if(n!=="drawer"&&!m.showCard)return;if(n==="widget"&&m.widgetTabId&&m.widgetTabId!==s)return;if(n==="inline"&&m.inlineTabId&&m.inlineTabId!==s)return;let S=e("div","ls-stat-cell");S.style.setProperty("--ls-bar-color",m.color||"var(--ls-primary)"),S.dataset.locked=String(Boolean(m.locked));let L=m.layoutSpan==="half"||m.layoutSpan==="full"?m.layoutSpan:y.length>48||/->|→|\n|;/.test(y)?"full":"half";S.dataset.span=L;let k=e("div","ls-row-between");k.append(e("strong","",`${m.icon||"\uD83D\uDCCA"} ${m.label}`),e("div","ls-row")),k.lastElementChild.append(ee("sliders",()=>Qt(t,f),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:`Full Edit "${m.label}" (Prompt, Style, Tab & Color)`}),ee("edit",()=>Et(t),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:`Edit ${m.label} value`}));let _=m.displayStyle??"auto",I=_!=="auto"||P||/->|→|\n|;/.test(y);S.append(k,I?Xe(y,_):e("p","",y)),d.append(S)};if(a.player.condition&&a.player.condition!=="Normal")o("player_condition",a.player.condition,!0);if(a.player.attire)o("player_attire",a.player.attire,!1);if(a.player.notableAction)o("player_action",a.player.notableAction,!1);if(n!=="drawer"&&a.scene.beatSummary)o("scene_summary",a.scene.beatSummary,!1);let c=Object.values(a.characters);if(c.length>0||a.scene.presence){let f=a.scene.presence||`Present: [${c.filter((y)=>y.present).map((y)=>y.name).join(", ")}], Away: [${c.filter((y)=>!y.present).map((y)=>y.name).join(", ")}]`;o("scene_presence",f,!1)}return d}function qa(t){let{state:n,template:s}=t.snapshot,a=s.coreTrackers,i=e("div","ls-stack"),r=Re(a,"quests"),d=Re(a,"dispatches"),o=Object.values(n.quests);if(r.enabled&&!r.deleted&&a?.showQuestsInWidget!==!1&&o.length>0){let c=e("div","ls-stat-cell");c.dataset.span="full",c.append(e("strong","",`${r.icon||"\uD83C\uDFAF"} ${r.label} (${o.filter((f)=>f.status==="active").length})`));for(let f of o){let y=e("div","ls-stack");y.style.gap="3px",y.append(e("small","ls-kicker",`${f.title} (${f.status})`));for(let[P,m]of f.objectives.entries()){let S=e("label","ls-row"),L=e("input");L.type="checkbox",L.checked=m.completed,L.addEventListener("change",()=>{let k=f.objectives.map((I,b)=>b===P?{...I,completed:L.checked}:I),_=k.every((I)=>I.completed);t.request("state:mutate",{patch:{quests:[{id:f.id,title:f.title,status:_?"completed":"active",objectives:k}]}})}),S.append(L,e("small",m.completed?"ls-muted":"",m.text)),y.append(S)}c.append(y)}i.append(c)}if(d.enabled&&!d.deleted&&a?.showDispatchesInWidget!==!1&&n.dispatches.length>0){let c=e("div","ls-stat-cell");c.dataset.span="full",c.append(e("strong","",`${d.icon||"\uD83D\uDCE1"} ${d.label} (${n.dispatches.length})`));for(let f of[...n.dispatches].reverse().slice(0,3)){let y=e("div","ls-bond-dir-box");y.append(e("strong","",`${f.title} · \uD83D\uDCCD ${f.locationName}`),e("small","ls-muted",f.summary)),c.append(y)}i.append(c)}return i}function Ka(t){let{theme:n}=t.snapshot.template;t.modals.open({title:"\uD83D\uDCD0 Widget & Pill Size Customizer (Any Extreme)",width:520},(s,a)=>{let i=n.widgetWidth??460,r=n.widgetHeight??540,d=n.pillWidth??420,o=n.pillHeight??92,c=e("div","ls-card");c.append(e("span","ls-kicker","1-Click Widget Size Presets"));let f=e("div","ls-row");for(let[C,v,u]of[["Micro (280×240)",280,240],["Compact (380×420)",380,420],["Standard (460×540)",460,540],["Wide (680×560)",680,560],["Theater (920×720)",920,720],["Extreme Max (1180×860)",1180,860]])f.append(B(C,()=>{i=v,r=u,S.value=String(i),k.value=String(r),t.widgetExpanded=!0,t.onResizeWidgetLive?.(i,r,!0)},"ls-btn-sm"));let y=e("div","ls-row");y.append(e("small","ls-muted","Widget Tabs:"));for(let[C,v]of[[!1,"\uD83C\uDFF7️ Icons + Labels"],[!0,"✨ Icons Only"]]){let u=B(v,()=>{t.request("state:mutate",{templatePatch:{theme:{...t.snapshot.template.theme,widgetTabsIconOnly:C}},reason:`Set widget tabs to ${C?"icons only":"icons + labels"}`})},"ls-btn-sm");if(Boolean(t.snapshot.template.theme.widgetTabsIconOnly)===C)u.setAttribute("aria-current","page");y.append(u)}c.append(f,y);let P=e("div","ls-grid"),m=e("label","ls-label","Expanded Width (240–1200 px)"),S=e("input","ls-input");S.type="number",S.min="240",S.max="1200",S.value=String(i),m.append(S);let L=e("label","ls-label","Expanded Height (180–900 px)"),k=e("input","ls-input");k.type="number",k.min="180",k.max="900",k.value=String(r),L.append(k);let _=e("label","ls-label","Collapsed Pill Width (220–960 px)"),I=e("input","ls-input");I.type="number",I.min="220",I.max="960",I.value=String(d),_.append(I);let b=e("label","ls-label","Collapsed Pill Height (56–220 px)"),x=e("input","ls-input");x.type="number",x.min="56",x.max="220",x.value=String(o),b.append(x),P.append(m,L,_,b);let N=B("\uD83D\uDCBE Apply & Save Dimensions",()=>{let C=Math.max(240,Math.min(1200,Number(S.value)||460)),v=Math.max(180,Math.min(900,Number(k.value)||540)),u=Math.max(220,Math.min(960,Number(I.value)||420)),g=Math.max(56,Math.min(220,Number(x.value)||92));if(t.request("state:mutate",{templatePatch:{theme:{...t.snapshot.template.theme,widgetWidth:C,widgetHeight:v,pillWidth:u,pillHeight:g}},reason:`Resized widget (${C}×${v})`}),t.widgetExpanded)t.onResizeWidgetLive?.(C,v,!1);else t.onResizeWidgetLive?.(u,g,!1);a()},"ls-btn-primary");s.append(c,P,N)})}function Fn(t,n){let{state:s,template:a,deltas:i}=t.snapshot,r=a.theme.showSceneChips,d=Ne(s),o=e("div","ls-game-pill-main");if(r.location&&!n?.omitLocation)o.append(e("span","ls-chip ls-chip-accent",`\uD83D\uDCCD ${d.location}`));if(r.time)o.append(e("span","ls-chip",`\uD83D\uDD70️ ${d.time}`));if(r.date&&d.date)o.append(e("span","ls-chip",`\uD83D\uDCC5 ${d.date}`));if(r.weather&&d.weather&&d.weather!=="Clear")o.append(e("span","ls-chip",`\uD83C\uDF26️ ${d.weather}`));let c=Object.values(s.characters),f=c.filter((k)=>k.present),y=Re(a.coreTrackers,"scene_presence");if(r.pinnedStats&&y.enabled&&y.pinnedToHeader&&(c.length>0||s.scene.presence)){let k=s.scene.presence||`Present: [${f.map((I)=>I.name).join(", ")}], Away: [${c.filter((I)=>!I.present).map((I)=>I.name).join(", ")}]`,_=e("span","ls-chip",`${y.icon||"\uD83D\uDC65"} ${k}`);_.title=k,o.append(_)}if(r.cast&&f.length>0){let k=e("div","ls-avatar-stack");k.title=`In Scene: ${f.map((_)=>_.name).join(", ")}`;for(let _ of f.slice(0,4)){let I=e("span","ls-avatar-stack-item");if(_.portraitUrl){let b=e("img");b.src=_.portraitUrl,b.alt=_.name,I.append(b)}else I.textContent=_.name.slice(0,2).toUpperCase();k.append(I)}o.append(k)}let P=r.pinnedStats?a.stats.filter((k)=>k.enabled&&(k.pinnedToHeader||k.showIn?.pinnedHeader)):[],m=P.find((k)=>k.id==="present"||k.id==="scene_presence"),S=P.filter((k)=>k.id!=="present"&&k.id!=="scene_presence").slice(0,3),L=m?[m,...S]:S;for(let k of L){let _=k.scope==="character",I=f[0]??Object.values(s.characters)[0],b=_?I?.meters[k.id]:s.stats[k.id],x=k.id==="present"||k.id==="scene_presence",N=Object.values(s.characters);if(!b?.calibrated&&!(x&&N.length>0))continue;let C=x&&N.length>0&&!b?.calibrated?`Present: [${f.map((u)=>u.name).join(", ")}], Away: [${N.filter((u)=>!u.present).map((u)=>u.name).join(", ")}]`:b.value,v=_?I?i.characterDeltas[I.id]?.[k.id]??0:0:i.statDeltas[k.id]??0;if(typeof C==="number"&&k.kind!=="currency"){let u=e("div","ls-pill-gauge");u.style.setProperty("--ls-bar-color",k.color||"var(--ls-primary)");let g=e("div","ls-pill-gauge-top");g.append(e("span","",`${k.icon} ${_&&I?I.name.split(" ")[0]:k.label}`),e("span","",`${C}${v!==0?v>0?` +${v}`:` ${v}`:""}`));let p=e("div","ls-pill-gauge-track"),h=e("div","ls-bar-fill"),T=Math.max(1,k.max-k.min),l=Math.max(0,Math.min(100,Math.round((C-k.min)/T*100)));h.style.width=`${l}%`,p.append(h),u.append(g,p),o.append(u)}else o.append(e("span","ls-chip",`${k.icon} ${_&&I?`${I.name}: `:""}${String(C)}`))}return o}function vt(t,n,s,a,i,r){let{state:d,template:o}=t.snapshot,c=e("section","ls-hud");t.stampThemeOnElement(c);let f=async(C)=>{let v=()=>it(t,i);if(typeof t.ctx.ui?.showContextMenu!=="function"){v();return}let{selectedKey:u}=await t.ctx.ui.showContextMenu({position:{x:C.clientX,y:C.clientY},items:[{key:"edit_scene",label:"Edit Scene Values (Location, Time, Date)"},{key:"pill_prompts",label:"Edit Scene Pill AI Prompts & Chips"},{key:"div1",label:"",type:"divider"},{key:"template",label:`Switch Template & Skin (${o.name})`},{key:"resize",label:"Resize Floating Widget"},{key:"studio",label:"Open Full Settings Studio"}]});if(u==="edit_scene")Et(t);else if(u==="pill_prompts")Ae(t);else if(u==="template")it(t,i);else if(u==="resize")Ka(t);else if(u==="studio")i()},y=()=>{let C=e("div","ls-row"),v=ee("sync",()=>void t.request("track:manual"),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:t.busy?"Calibrating…":"Sync & calibrate current turn"});v.disabled=t.busy;let u=ee("stage",()=>t.toggleVnStage(),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:"Launch 2D Visual Novel Stage & Voices"}),g=ee("more",(T)=>void f(T),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:"Scene Pill Prompts, Template Switcher, Resize & Studio"}),p=ee("settings",()=>{console.log("[LumiStats FloatingHud] ⚙️ studio button clicked"),i()},{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:"Open Lumi Stats Studio"}),h=ee(n?"chevronDown":"chevronUp",s,{label:n?"Expand":"Pill",className:"ls-btn-sm ls-btn-primary",title:n?"Expand Floating HUD":"Collapse to Status Pill"});return C.append(v,u,g,p,h),C};if(n){let C=o.theme.pillStyle||"glass_capsule",v=o.theme.showSceneChips,u=Ne(d),g=e("div","ls-hud-pill");g.dataset.pillSkin=C,g.addEventListener("click",(A)=>{if(A.target instanceof Element&&A.target.closest("button"))return;s()});let p=e("div","ls-row-between ls-pill-top-deck"),h=e("span","ls-hud-title-badge"),T=e("span","ls-pill-live-dot"),l=v.location?d.scene.location||d.title||"Lumi Stats":d.title||o.name||"Lumi Stats",w=C==="cyber_telemetry"?`${v.location?"LOC":"HUD"} // ${l.toUpperCase()}`:C==="ledger_strip"&&v.date?`${u.date} · ${l}`:l;h.append(T,e("span","",o.icon||"✨"),e("span","ls-pill-title-text",w));let M=y();M.classList.add("ls-pill-actions"),p.append(h,M),g.append(p);let R=!1;if(C!=="compact_badge"){if(d.initialized){let A=Fn(t,{omitLocation:!0});if(A.childElementCount>0)A.classList.add("ls-pill-bottom-deck"),g.append(A),R=!0}else if(t.chatId){let A=e("div","ls-row ls-pill-bottom-deck");A.append(B("Calibrate World Now",()=>void t.request("track:manual"),"ls-btn-sm ls-btn-primary"),B("Studio",i,"ls-btn-sm")),g.append(A),R=!0}}return g.dataset.emptyDeck=String(!R),c.append(g),c}let P=[...o.surfaces.widgetTabs].filter((C)=>C.enabled&&(C.kind!=="web"||o.surfaces.showRelationshipWeb!==!1)).sort((C,v)=>C.order-v.order),m=P.find((C)=>C.id===t.activeSurfaceTab)??P[0]??{id:"stats",label:"Stats",icon:"\uD83D\uDCCA",kind:"stats",enabled:!0,order:0},S=e("nav","ls-hud-header-bar"),L=e("div","ls-hud-top-row"),k=B(`${o.icon} ${d.scene.location||d.title||"Lumi Stats"}`,()=>Ae(t),"ls-btn-sm ls-btn-ghost ls-hud-title-badge","Click to customize Scene Pill prompt & visible chips");L.append(k,y());let _=Boolean(o.theme.widgetTabsIconOnly),I=e("div","ls-hud-tabs-scroll"),b=(C)=>/[^\w\s]/u.test(C.trim());for(let C of P){let v=C.kind==="cast"?` (${Object.keys(d.characters).length})`:C.kind==="map"?` (${Object.keys(d.places).length})`:"",u=`${C.label}${v}`,g=_&&b(C.icon),p=B(g?C.icon:`${C.icon} ${u}`,()=>{t.activeSurfaceTab=C.id,t.emitChange()},`ls-btn-sm${g?" ls-hud-tab-icon-only":""}`,u);if(C.id===m.id)p.setAttribute("aria-current","page");I.append(p)}S.append(L,I),c.append(S);let x=e("div","ls-hud-content");if(!d.initialized){let C=e("div","ls-card");if(C.append(e("strong","",t.chatId?"Ready to calibrate this story":"Open a chat to begin"),e("p","ls-muted","Send a message for automatic two-phase calibration, or click below to calibrate now:")),t.chatId)C.append(B("✨ Calibrate Stats Now",()=>void t.request("track:manual"),"ls-btn-primary"));return x.append(C),c.append(x),c}if(o.surfaces.customWidgetHtml){let C=e("div","ls-card");x.append(C),De(C,Fe(o.surfaces.customWidgetHtml,d),t.ctx)}if(d.modifiers.length>0&&m.kind==="stats"){let C=e("div","ls-row");for(let v of d.modifiers){let u=e("span","ls-rpg-fx-pill",`${v.delta>=0?"▲":"▼"} ${v.label} (${v.delta>=0?`+${v.delta}`:v.delta}${v.remainingTurns?` · ${v.remainingTurns}t`:""})`);u.dataset.fxKind=v.delta>=0?"buff":"debuff",C.append(u)}x.append(C)}if(m.kind==="cast")x.append(nn(t,"widget",m.id,a));else if(m.kind==="web")x.append(Zt(t,a));else if(m.kind==="map")x.append(en(t));else{if(m.customHtml){let C=e("div","ls-card");x.append(C),De(C,Fe(m.customHtml,d),t.ctx)}x.append(tn(t,"widget",m.id,r,!1))}c.append(x);let N=e("div","ls-hud-resize-grip","◢");return N.title="Drag to resize widget to any size",N.addEventListener("pointerdown",(C)=>{if(C.button!==0||!t.onResizeWidgetLive)return;C.preventDefault(),C.stopPropagation();let v=c.getBoundingClientRect(),u=v.width>0&&c.offsetWidth>0?v.width/c.offsetWidth:1,{clientX:g,clientY:p}=C,h=c.offsetWidth||(o.theme.widgetWidth??460),T=c.offsetHeight||(o.theme.widgetHeight??540),l=h,w=T;try{N.setPointerCapture(C.pointerId)}catch{}let M=(A)=>{let E=(A.clientX-g)/u,D=(A.clientY-p)/u;l=Math.max(240,Math.min(1200,Math.round(h+E))),w=Math.max(180,Math.min(900,Math.round(T+D))),t.onResizeWidgetLive?.(l,w,!1)},R=(A)=>{N.removeEventListener("pointermove",M),N.removeEventListener("pointerup",R),N.removeEventListener("pointercancel",R);try{N.releasePointerCapture(A.pointerId)}catch{}t.onResizeWidgetLive?.(l,w,!0)};N.addEventListener("pointermove",M),N.addEventListener("pointerup",R),N.addEventListener("pointercancel",R)}),c.append(N),c}var Hn="characters",sn="",an="";function Ys(t){let n=(t.scene.timeLabel||lt(t.elapsedMinutes)||"").trim(),s=n.toLowerCase();if(/\b(?:dawn|sunrise|morning|breakfast)\b/.test(s))return"morning";if(/\b(?:noon|midday|afternoon|daytime|lunch)\b/.test(s))return"day";if(/\b(?:dusk|sunset|evening|twilight|dinner)\b/.test(s))return"evening";if(/\b(?:night|midnight|late\s*night|moon)\b/.test(s))return"night";let a=n.match(/(\d{1,2})\s*:\s*(\d{2})\s*(am|pm)?/i);if(a){let d=Number(a[1]),o=a[3]?.toLowerCase();if(o==="pm"&&d<12)d+=12;if(o==="am"&&d===12)d=0;if(d>=5&&d<11)return"morning";if(d>=11&&d<17)return"day";if(d>=17&&d<20)return"evening";return"night"}let i=(Math.max(0,Math.round(t.elapsedMinutes))+480)%1440,r=Math.floor(i/60);if(r>=5&&r<11)return"morning";if(r>=11&&r<17)return"day";if(r>=17&&r<20)return"evening";return"night"}function Qs(t,n){if(!t)return{url:"",matchedLabel:"No Location"};let s=t.backdropVariants??[],a=s.find((c)=>c.pinned&&c.url);if(a)return{url:a.url,matchedLabel:`\uD83D\uDCCC ${a.customTag||a.timeSlot}`};let i=[n.scene.weather,n.scene.timeLabel,n.scene.dateLabel,t.atmosphere].filter(Boolean).join(" ").toLowerCase();for(let c of s)if(c.timeSlot==="custom"&&c.customTag&&c.url){let f=c.customTag.toLowerCase().split(/[,/|\s]+/).filter((y)=>y.length>=2);if(f.length>0&&f.every((y)=>i.includes(y)))return{url:c.url,matchedLabel:`\uD83C\uDFF7️ ${c.customTag}`}}let r=Ys(n),d=s.find((c)=>c.timeSlot===r&&c.url);if(d)return{url:d.url,matchedLabel:`\uD83D\uDD70️ ${r}`};let o=s.find((c)=>c.timeSlot==="default"&&c.url);if(o)return{url:o.url,matchedLabel:"Default"};return{url:t.backdropUrl||"",matchedLabel:t.backdropUrl?"Default":"Atmospheric Stage"}}function On(t,n){let s=t.trim().toLowerCase(),a=n.trim().toLowerCase();if(!s||!a)return 0;if(a.includes(s))return 2;let i=s.split(/[^a-z0-9]+/).filter((d)=>d.length>=3);if(!i.length)return 0;let r=i.filter((d)=>a.includes(d)).length;return r>0?r/i.length:0}function Js(t,n=""){let s=t.spriteVariants??[],a=s.find((m)=>m.pinned&&m.url);if(a)return{url:a.url,matchedLabel:`\uD83D\uDCCC ${a.label}`};let i=ge(t,"demeanor"),r=ge(t,"attire_layers")||t.attire||"",d=String(t.meters.acted?.value??""),c=[ge(t,"immediate_goal"),d,n].filter(Boolean).join(" "),f,y=0;for(let m of s){if(!m.url)continue;let S=0,L=0;if(m.clothesTag.trim()){L++;let k=On(m.clothesTag,`${r} ${n}`);if(k>0)S+=3.5*k;else S-=1}if(m.emotionTag.trim()){L++;let k=On(m.emotionTag,`${i} ${n}`);if(k>0)S+=2.5*k}if(m.poseTag.trim()){L++;let k=On(m.poseTag,c);if(k>0)S+=2*k}if(L===0)S=0.1;if(S>y)y=S,f=m}if(f)return{url:f.url,matchedLabel:f.label};let P=(i||"neutral").toLowerCase();if(t.expressionAssets[P]?.url)return{url:t.expressionAssets[P].url,matchedLabel:P};return{url:t.portraitUrl||"",matchedLabel:t.portraitUrl?"Base Sprite":""}}function ea(t,n){let{state:s}=t.snapshot,a=e("div","ls-stack"),i=n??(()=>t.emitChange()),r=e("div","ls-subnav-pills"),d=Object.values(s.characters),o=Object.values(s.places);for(let[C,v]of[["characters",`\uD83C\uDFAD Character Sprites: Emotion, Clothes & Poses (${d.length})`],["locations",`\uD83C\uDFDE️ Discovered Locations: Time-of-Day & Weather Backdrops (${o.length})`]]){let u=B(v,()=>{Hn=C,i()},"ls-btn-sm");if(Hn===C)u.setAttribute("aria-current","page");r.append(u)}if(a.append(r),Hn==="characters"){let C=(sn?s.characters[sn]:void 0)??d[0],v=e("div","ls-row-between"),u=e("div","ls-row");for(let U of d){let K=(U.spriteVariants?.length??0)+(U.portraitUrl?1:0),X=B(`${U.present?"\uD83D\uDFE2":"⚪"} ${U.name} (${K})`,()=>{sn=U.id,i()},"ls-btn-sm");if(U.id===C?.id)X.setAttribute("aria-current","page");u.append(X)}if(v.append(u,B("+ Add Character",()=>{t.modals.open({title:"➕ Add Character",width:420},(U,K)=>{let X=e("label","ls-label","Character Name"),J=e("input","ls-input");X.append(J);let Y=B("➕ Create Character",()=>{let ne=J.value.trim();if(!ne)return;let G=le(ne,"npc");sn=G,t.request("state:mutate",{patch:{characters:[{id:G,name:ne,present:!0}]},reason:`Added character "${ne}"`}),K()},"ls-btn-primary");U.append(X,Y)})},"ls-btn-sm ls-btn-primary")),a.append(v),!C){let U=e("div","ls-card");return U.append(e("strong","","No characters in Cast yet"),e("p","ls-muted",'Click "+ Add Character" above or sync a chat turn to start uploading character sprites.')),a.append(U),a}let g=e("section","ls-card"),p=ge(C,"demeanor"),h=ge(C,"attire_layers")||C.attire;g.append(e("span","ls-kicker",`Upload New Sprite Rule for ${C.name}`),e("h3","",`\uD83D\uDDBC️ Add Sprite by Emotion, Clothes & Pose — ${C.name}`),e("p","ls-muted",'Fill in any combination of Emotion, Clothes/Outfit, and Pose/Action below (leave any box blank if it applies to all), then click "\uD83D\uDDBC️ Upload & Save Sprite". The VN Stage automatically switches to the matching sprite as the story changes!'));let T=e("div","ls-grid"),l=e("label","ls-label","\uD83C\uDFAD Emotion / Mood Tag (Text Box)"),w=e("input","ls-input");w.placeholder="e.g. neutral, happy, flustered, angry, brusque, shy…",w.value=p||"",l.append(w);let M=e("div","ls-row");for(let U of["neutral","happy","flustered","angry","sad","surprised","shy"])M.append(B(U,()=>{w.value=U},"ls-btn-sm ls-quick-pill"));l.append(M);let R=e("label","ls-label","\uD83D\uDC57 Clothes / Outfit Tag (Text Box)"),A=e("input","ls-input");if(A.placeholder="e.g. saree, bath towel, office wear, nightgown, casual…",A.value="",R.append(A),h)R.append(B(`✨ Use Current Outfit ("${h.slice(0,28)}")`,()=>{A.value=h},"ls-btn-sm ls-quick-pill"));let E=e("label","ls-label","\uD83E\uDDCD Pose / Action Tag (Text Box)"),D=e("input","ls-input");D.placeholder="e.g. standing, mopping, crossed arms, holding phone, leaning…",D.value="",E.append(D);let F=e("div","ls-row");for(let U of["standing","crossed arms","leaning in","looking away","sitting"])F.append(B(U,()=>{D.value=U},"ls-btn-sm ls-quick-pill"));E.append(F),T.append(l,R,E),g.append(T);let O=e("div","ls-row-between");O.append(e("small","ls-muted",`Current Live State — Demeanor: "${p||"neutral"}" · Outfit: "${h||"default"}"`),e("div","ls-row")),O.lastElementChild.append(B("\uD83D\uDDBC️ Upload Default / Base Sprite",()=>{t.pickAndUploadImage(C.id,"portrait")},"ls-btn-sm"),B("\uD83D\uDDBC️ Upload & Save Sprite Variant",()=>{t.uploadStageVariantAsset({targetId:C.id,kind:"sprite_variant",emotionTag:w.value.trim(),clothesTag:A.value.trim(),poseTag:D.value.trim()})},"ls-btn-primary")),g.append(O),a.append(g);let V=e("section","ls-card"),W=C.spriteVariants??[],H=Js(C),j=e("div","ls-row-between");j.append(e("h3","",`\uD83D\uDDC2️ Saved Sprites for ${C.name} (${W.length+(C.portraitUrl?1:0)})`),H.url?e("span","ls-chip ls-chip-accent",`✓ Active on Stage: ${H.matchedLabel}`):e("span","ls-chip","No sprite uploaded yet")),V.append(j);let z=e("div","ls-asset-gallery");if(C.portraitUrl){let U=e("div","ls-asset-card"),K=e("div","ls-asset-thumb"),X=e("img");X.src=C.portraitUrl,X.alt=`${C.name} Base Sprite`,K.append(X);let J=e("div","ls-stack");J.style.gap="6px",J.append(e("strong","","⭐ Base / Fallback Sprite"),e("small","ls-muted","Used whenever no specific Emotion / Clothes / Pose variant matches."),B("\uD83D\uDD04 Replace Base Sprite",()=>t.pickAndUploadImage(C.id,"portrait"),"ls-btn-sm")),U.append(K,J),z.append(U)}if(W.forEach((U,K)=>{let X=e("div","ls-asset-card");if(U.pinned)X.style.borderColor="var(--ls-primary)";let J=e("div","ls-asset-thumb"),Y=e("img");Y.src=U.url,Y.alt=U.label,J.append(Y);let ne=e("div","ls-stack");ne.style.gap="5px";let G=e("input","ls-input");G.style.minHeight="28px",G.placeholder="Emotion tag (e.g. flustered)…",G.value=U.emotionTag;let Q=e("input","ls-input");Q.style.minHeight="28px",Q.placeholder="Clothes tag (e.g. saree, towel)…",Q.value=U.clothesTag;let se=e("input","ls-input");se.style.minHeight="28px",se.placeholder="Pose tag (e.g. mopping)…",se.value=U.poseTag;let oe=e("div","ls-row");oe.append(B("\uD83D\uDCBE Save Tags",()=>{let Se=structuredClone(s.characters),ce=Se[C.id]?.spriteVariants;if(ce&&ce[K])ce[K].emotionTag=G.value.trim(),ce[K].clothesTag=Q.value.trim(),ce[K].poseTag=se.value.trim(),ce[K].label=[ce[K].emotionTag,ce[K].clothesTag,ce[K].poseTag].filter(Boolean).join(" · ")||"Default",t.request("state:mutate",{stateOverride:{characters:Se},reason:`Updated sprite tags for ${C.name}`}),t.notify(`Saved tags for ${C.name}'s sprite.`)},"ls-btn-sm ls-btn-primary"),B(U.pinned?"\uD83D\uDCCC Pinned":"\uD83D\uDCCD Pin",()=>{let Se=structuredClone(s.characters),ce=Se[C.id]?.spriteVariants??[],yt=!U.pinned;ce.forEach((et,ln)=>{et.pinned=ln===K?yt:!1}),t.request("state:mutate",{stateOverride:{characters:Se},reason:`${yt?"Pinned":"Unpinned"} sprite for ${C.name}`})},`ls-btn-sm ${U.pinned?"ls-btn-primary":""}`),B("\uD83D\uDDD1️",()=>{let Se=structuredClone(s.characters);if(Se[C.id]?.spriteVariants)Se[C.id].spriteVariants=Se[C.id].spriteVariants.filter((ce)=>ce.id!==U.id),t.request("state:mutate",{stateOverride:{characters:Se},reason:`Removed sprite variant from ${C.name}`})},"ls-btn-sm ls-btn-icon ls-btn-danger","Delete sprite variant")),ne.append(e("strong","",U.label||"Sprite Variant"),G,Q,se,oe),X.append(J,ne),z.append(X)}),z.childElementCount===0)V.append(e("p","ls-muted",`No sprites uploaded for ${C.name} yet. Use the form above to upload sprites for different emotions, outfits, and poses.`));else V.append(z);return a.append(V),a}let c=(an?s.places[an]:void 0)??(s.currentPlaceId?s.places[s.currentPlaceId]:void 0)??o[0],f=e("div","ls-row-between"),y=e("div","ls-row");for(let C of o){let v=(C.backdropVariants?.length??0)||(C.backdropUrl?1:0),u=B(`${C.icon||"\uD83D\uDCCD"} ${C.name}${C.id===s.currentPlaceId?" (Here)":""} (${v})`,()=>{an=C.id,i()},"ls-btn-sm");if(C.id===c?.id)u.setAttribute("aria-current","page");y.append(u)}if(f.append(y,B("+ Add Location",()=>{t.modals.open({title:"➕ Add Location to Atlas",width:440},(C,v)=>{let u=e("label","ls-label","Location Name"),g=e("input","ls-input");u.append(g);let p=e("label","ls-label","Description"),h=e("input","ls-input");p.append(h);let T=B("➕ Create Location",()=>{let l=g.value.trim();if(!l)return;let w=le(l,"place");an=w,t.request("state:mutate",{patch:{places:[{id:w,name:l,icon:"\uD83C\uDFDB️",description:h.value.trim()||"Location"}]},reason:`Added location "${l}"`}),v()},"ls-btn-primary");C.append(u,p,T)})},"ls-btn-sm ls-btn-primary")),a.append(f),!c){let C=e("div","ls-card");return C.append(e("strong","","No locations discovered yet"),e("p","ls-muted",'Click "+ Add Location" above or sync a chat turn to start uploading backdrops.')),a.append(C),a}let P=Ys(s),m=Qs(c,s),S=e("section","ls-card"),L=e("div","ls-row-between");L.append(e("h3","",`${c.icon||"\uD83D\uDCCD"} ${c.name} — Time-of-Day & Weather Backdrops`),e("span","ls-chip ls-chip-accent",`\uD83D\uDD70️ Current Story Time: ${s.scene.timeLabel||lt(s.elapsedMinutes)} (${P.toUpperCase()})`)),S.append(L,e("p","ls-muted",'Upload backdrops for Morning, Day, Evening, Night, or a custom weather/scene state (e.g. "rainy", "steamy", "lights off"). The VN Stage automatically transitions to the matching backdrop as time passes!'));let k=e("div","ls-grid"),_=[{slot:"default",icon:"\uD83C\uDFDE️",label:"Default (Any Time)",sub:"Fallback when no specific time slot is set"},{slot:"morning",icon:"\uD83C\uDF05",label:"Morning / Dawn",sub:"05:00 AM – 10:59 AM"},{slot:"day",icon:"☀️",label:"Day / Afternoon",sub:"11:00 AM – 04:59 PM"},{slot:"evening",icon:"\uD83C\uDF07",label:"Evening / Sunset",sub:"05:00 PM – 07:59 PM"},{slot:"night",icon:"\uD83C\uDF19",label:"Night / Late Night",sub:"08:00 PM – 04:59 AM"}];for(let C of _){let v=(c.backdropVariants??[]).find((l)=>l.timeSlot===C.slot),u=C.slot==="default"?c.backdropUrl:void 0,g=v?.url||u||"",p=e("div","ls-asset-card");if(P===C.slot||v?.pinned)p.style.borderColor="var(--ls-primary)";if(g){let l=e("div","ls-asset-thumb"),w=e("img");w.src=g,w.alt=`${c.name} ${C.label}`,l.append(w),p.append(l)}let h=e("div","ls-stack");h.style.gap="4px",h.append(e("strong","",`${C.icon} ${C.label}`),e("small","ls-muted",C.sub));let T=e("div","ls-row");if(T.append(B(g?"\uD83D\uDD04 Replace Image":"\uD83D\uDDBC️ Upload Image",()=>{t.uploadStageVariantAsset({targetId:c.id,kind:"backdrop_variant",timeSlot:C.slot})},`ls-btn-sm ${g?"":"ls-btn-primary"}`)),v)T.append(B(v.pinned?"\uD83D\uDCCC Pinned":"\uD83D\uDCCD Pin",()=>{let l=structuredClone(s.places),w=l[c.id]?.backdropVariants??[],M=!v.pinned;w.forEach((R)=>{R.pinned=R.id===v.id?M:!1}),t.request("state:mutate",{stateOverride:{places:l},reason:`${M?"Pinned":"Unpinned"} ${C.label} backdrop for ${c.name}`})},`ls-btn-sm ${v.pinned?"ls-btn-primary":""}`),B("\uD83D\uDDD1️",()=>{let l=structuredClone(s.places),w=l[c.id];if(w?.backdropVariants){if(w.backdropVariants=w.backdropVariants.filter((M)=>M.id!==v.id),C.slot==="default")w.backdropUrl=void 0;t.request("state:mutate",{stateOverride:{places:l},reason:`Removed ${C.label} backdrop from ${c.name}`})}},"ls-btn-sm ls-btn-icon ls-btn-danger"));h.append(T),p.append(h),k.append(p)}S.append(k);let I=e("div","ls-stat-cell");I.append(e("strong","","\uD83C\uDFF7️ Add Custom Time / Weather / State Backdrop Variant"));let b=e("div","ls-row"),x=e("input","ls-input");x.style.flex="1",x.placeholder="Enter custom condition tag (e.g. rainy, steamy, lights off, crowded)…",b.append(x,B("\uD83D\uDDBC️ Upload & Save Custom Variant",()=>{let C=x.value.trim();if(!C){t.notify('Enter a custom tag (e.g. "rainy" or "steamy") before uploading.',!0);return}t.uploadStageVariantAsset({targetId:c.id,kind:"backdrop_variant",timeSlot:"custom",customTag:C})},"ls-btn-primary")),I.append(b);let N=(c.backdropVariants??[]).filter((C)=>C.timeSlot==="custom");if(N.length>0){let C=e("div","ls-asset-gallery");C.style.marginTop="8px";for(let v of N){let u=e("div","ls-asset-card"),g=e("div","ls-asset-thumb"),p=e("img");p.src=v.url,p.alt=v.customTag,g.append(p);let h=e("div","ls-row-between");h.append(e("strong","",`\uD83C\uDFF7️ ${v.customTag}`),e("div","ls-row")),h.lastElementChild.append(B(v.pinned?"\uD83D\uDCCC Pinned":"\uD83D\uDCCD Pin",()=>{let T=structuredClone(s.places),l=T[c.id]?.backdropVariants??[],w=!v.pinned;l.forEach((M)=>{M.pinned=M.id===v.id?w:!1}),t.request("state:mutate",{stateOverride:{places:T},reason:`Pinned "${v.customTag}" backdrop for ${c.name}`})},`ls-btn-sm ${v.pinned?"ls-btn-primary":""}`),B("\uD83D\uDDD1️",()=>{let T=structuredClone(s.places),l=T[c.id];if(l?.backdropVariants)l.backdropVariants=l.backdropVariants.filter((w)=>w.id!==v.id),t.request("state:mutate",{stateOverride:{places:T},reason:`Removed "${v.customTag}" backdrop`})},"ls-btn-sm ls-btn-icon ls-btn-danger")),u.append(g,h),C.append(u)}I.append(C)}if(S.append(I),m.url)S.append(e("small","ls-muted",`✓ Currently active backdrop for ${c.name}: ${m.matchedLabel}`));return a.append(S),a}function Qe(t,n){let a=[...structuredClone(t.snapshot.template).surfaces.dossierTabs].sort((i,r)=>i.order-r.order);t.modals.open({title:n?`✏️ Edit Character Dossier Field: ${n.label}`:"➕ Create Character Dossier Field",width:580},(i,r,d,o)=>{let c=e("div","ls-grid"),f=e("label","ls-label","Field Icon"),y=e("input","ls-input");y.value=n?.icon??"✨",f.append(y);let P=e("label","ls-label","Field Label"),m=e("input","ls-input");m.placeholder="e.g. Immediate Goal, Inner Monologue, Secret Agenda…",m.value=n?.label??"",P.append(m),c.append(f,P),i.append(c);let S=n?.tabId??(a[0]?.id||"overview"),L=n?.displayStyle??"card",k=e("div","ls-grid"),_=e("div","ls-label","\uD83E\uDEAA Target Dossier Tab"),I=e("div");_.append(I);let b=e("div","ls-label","\uD83C\uDFA8 Visual Display Style"),x=e("div");b.append(x),k.append(_,b),i.append(k),te(t,o,I,{value:S,ariaLabel:"Target Dossier Tab",options:a.map((W)=>({value:W.id,label:`${W.icon} ${W.label}`})),onChange:(W)=>{S=W}}),te(t,o,x,{value:L,ariaLabel:"Visual Display Style",options:[{value:"card",label:'\uD83D\uDDC2️ Info Card (supports structured "->" chains)'},{value:"quote",label:"\uD83D\uDCAD Quote / Inner Monologue Box"},{value:"pills",label:"\uD83C\uDFF7️ Tag / Item Pills (comma-separated)"},{value:"badge",label:"\uD83E\uDEAA Portrait Header Badge"}],onChange:(W)=>{L=W}});let N=n?.layoutSpan??"auto",C=n?.color||"var(--lumiverse-primary)",v=n?.enabled??!0,u=n?.showInHudCast??!1,g=n?.showInInlineCast??!1,p=n?.locked??!1,h=e("div","ls-label","Card Grid Width"),T=e("div");h.append(T),i.append(h),te(t,o,T,{value:N,ariaLabel:"Card Grid Width",options:[{value:"auto",label:"\uD83D\uDCD0 Auto"},{value:"full",label:"↔️ Full Width"},{value:"half",label:"▫ Compact Column"}],onChange:(W)=>{N=W}});let l=e("div","ls-label","Accent Color"),w=e("div","ls-row"),M=()=>{for(let W of[...w.querySelectorAll(".ls-color-swatch")])W.setAttribute("aria-pressed",String(W.dataset.colorVal===C))};for(let[W,H,j]of[["var(--lumiverse-primary)","Theme Primary","var(--lumiverse-primary, #38bdf8)"],["#38bdf8","Sky","#38bdf8"],["#f472b6","Rose","#f472b6"],["#f59e0b","Amber","#f59e0b"],["#10b981","Emerald","#10b981"],["#a78bfa","Violet","#a78bfa"]]){let z=B("",()=>{C=W,M()},"ls-color-swatch",H);z.dataset.colorVal=W,z.style.background=j,w.append(z)}M(),l.append(w),i.append(l);let R=e("div","ls-label"),A=e("div","ls-row-between"),E=e("textarea","ls-input");E.rows=3,E.placeholder="Tell the AI when and how to update this field for each character…",E.value=n?.instruction??"",A.append(e("span","","AI Extraction Prompt Instruction"),B("⛶ Full-Screen Editor",()=>{t.request("textEditor:open",{title:`Character Field Prompt: ${m.value||"Field"}`,value:E.value,placeholder:"Describe how the AI should update this character field…"}).then((W)=>{if(!W.cancelled&&typeof W.text==="string")E.value=W.text})},"ls-btn-sm")),R.append(A,E),i.append(R);let D=e("div","ls-grid");for(let[W,H,j]of[["Enabled",v,(z)=>{v=z}],["Show on HUD Cast Card",u,(z)=>{u=z}],["Show on Inline Cast Card",g,(z)=>{g=z}],["Lock Value",p,(z)=>{p=z}]]){let z=e("div");xe(t,o,z,{checked:H,label:W,onChange:j}),D.append(z)}i.append(D);let F=e("div","ls-row-between");F.style.marginTop="12px";let O=e("div","ls-row");if(n)O.append(B("Delete Field",()=>{let W=structuredClone(t.snapshot.template.dossierFields);t.request("state:mutate",{templatePatch:{dossierFields:W.filter((H)=>H.id!==n.id)},reason:`Deleted dossier field "${n.label}"`}),r()},"ls-btn-sm ls-btn-danger"));let V=B(n?"Save Field":"Add Field",()=>{let W=m.value.trim();if(!W)return;let H=structuredClone(t.snapshot.template.dossierFields),j={id:n?.id??le(W,"field"),label:W,icon:y.value.trim()||"✨",placeholder:n?.placeholder||W,instruction:E.value.trim()||`Update ${W} when established in the scene.`,tabId:S,displayStyle:L,showInHudCast:u,showInInlineCast:g,color:C,layoutSpan:N,enabled:v,locked:p},z=H.findIndex((U)=>U.id===j.id);if(z>=0)H[z]=j;else H.push(j);t.request("state:mutate",{templatePatch:{dossierFields:H},reason:`Saved dossier field "${j.label}"`}),r()},"ls-btn-primary");F.append(O,V),i.append(F)})}function ta(t,n){let{state:s}=t.snapshot,a=[...s.auditLog].filter((i)=>!n||i.actorId===n).reverse();t.modals.open({title:`\uD83D\uDCC8 Stat Calibration & Shift Audit Log (${a.length})`,width:640,maxHeight:740},(i,r)=>{if(!a.length){i.append(e("p","ls-muted","No stat calibrations or shifts recorded yet."));return}let d=e("div","ls-stack");for(let o of a){let c=e("div","ls-stat-cell"),f=e("div","ls-row-between"),y=e("div","ls-row"),P=o.actorId?s.characters[o.actorId]?.name:void 0;y.append(e("strong","",`${P?`${P} · `:""}${o.statLabel}`),e("span","ls-chip",o.op==="set"?"\uD83C\uDFAF Calibrated / Set":"Δ Shift"),e("span","ls-chip ls-chip-accent",`${String(o.before??"uncalibrated")} → ${String(o.after)}`));let m=e("div","ls-row");if(m.append(e("small","ls-muted",`Turn ${o.turn} · ${Hs(o.minute)}`)),o.before!==null)m.append(B(`↺ Revert to ${String(o.before)}`,()=>{if(o.actorId){let S=s.characters[o.actorId];if(S)t.request("state:mutate",{patch:{characters:[{id:S.id,name:S.name,meters:{[o.statId]:{op:"set",value:o.before,reason:"Reverted from audit log"}}}]},reason:`Reverted ${S.name} ${o.statLabel} to ${String(o.before)}`})}else t.request("state:mutate",{patch:{stats:{[o.statId]:{op:"set",value:o.before,reason:"Reverted from audit log"}}},reason:`Reverted ${o.statLabel} to ${String(o.before)}`});r()},"ls-btn-sm"));if(f.append(y,m),c.append(f),o.reason)c.append(e("small","ls-muted",`Evidence: ${o.reason}`));d.append(c)}i.append(d)})}function Ye(t,n){t.selectedActorId=n,t.modals.open({title:"\uD83E\uDEAA Character Dossier",width:880,maxHeight:820},(s,a,i,r)=>{let d=()=>{r.clear();let c=t.snapshot.state.characters[t.selectedActorId]??Object.values(t.snapshot.state.characters)[0];if(c)i.setTitle(`\uD83E\uDEAA ${c.name} — Character Dossier`);s.replaceChildren(Vn(t,r))};d();let o=t.subscribe(d);i.onDismiss(o)})}function Vn(t,n){let{state:s,template:a,deltas:i}=t.snapshot,r=e("div","ls-stack"),d=Object.values(s.characters).sort((u,g)=>Number(g.present)-Number(u.present)),o=(t.selectedActorId?s.characters[t.selectedActorId]:void 0)??d[0],c=e("div","ls-row-between"),f=e("div","ls-row");for(let u of d){let g=B(`${u.present?"\uD83D\uDFE2":"⚪"} ${u.name}`,()=>{t.selectedActorId=u.id,t.emitChange()},"ls-btn-sm");if(u.id===o?.id)g.setAttribute("aria-current","page");f.append(g)}let y=e("div","ls-row");if(o)y.append(B(t.dossierEditMode?"✓ Done Editing":"✏️ Edit Values",()=>{t.dossierEditMode=!t.dossierEditMode,t.emitChange()},`ls-btn-sm ${t.dossierEditMode?"ls-btn-primary":""}`),B(o.ttsVoice?.voiceId?`\uD83D\uDD0A Voice (${o.ttsVoice.voiceId})`:"\uD83D\uDD0A Voice",()=>Yt(t,o.id),"ls-btn-sm",`Assign TTS Voice for ${o.name}`),B("+ Stat",()=>Ce(t,"character"),"ls-btn-sm","Add a character stat or meter"),B("+ Field",()=>Qe(t),"ls-btn-sm","Add a custom field to character dossiers"),B("\uD83D\uDCC8 Audit Log",()=>ta(t,o.id),"ls-btn-sm"));if(y.append(B("+ Add Character",()=>{t.modals.open({title:"➕ Add Character to Cast",width:460},(u,g)=>{let p=e("label","ls-label","Character Name"),h=e("input","ls-input");p.append(h);let T=e("label","ls-label","Role & Relationship to Player"),l=e("input","ls-input");l.placeholder="e.g. Loyal personal maid, Childhood rival…",T.append(l);let w=e("label","ls-label","Starting Attire"),M=e("input","ls-input");w.append(M);let R=B("➕ Create Character",()=>{let A=h.value.trim();if(!A)return;let E=le(A,"npc");t.selectedActorId=E,t.request("state:mutate",{patch:{characters:[{id:E,name:A,present:!0,roleSummary:l.value.trim()||"Character",attire:M.value.trim()}]},reason:`Added character "${A}"`}),g()},"ls-btn-primary");u.append(p,T,w,R)})},"ls-btn-sm ls-btn-primary")),c.append(f,y),r.append(c),!o){let u=e("div","ls-card");return u.append(e("strong","","No characters in cast yet"),e("p","ls-muted",'Characters are calibrated automatically on Turn 1, or click "+ Add Character" above.')),r.append(u),r}if(a.surfaces.customDossierHtml){let u=e("div","ls-card");r.append(u),De(u,Fe(a.surfaces.customDossierHtml,s),t.ctx)}let P=ge(o,"demeanor"),m=ge(o,"role_summary"),S=(P||"neutral").toLowerCase(),L=o.expressionAssets[S]?.url??o.portraitUrl,k=Boolean(L||t.dossierEditMode),_=e("article","ls-dossier-shell");if(!k)_.dataset.noPortrait="true";let I=e("div","ls-row");I.append(B(o.present?"\uD83D\uDFE2 In Scene":"⚪ Away",()=>{t.request("state:mutate",{patch:{characters:[{id:o.id,name:o.name,present:!o.present,...!o.present&&s.scene.location?{location:s.scene.location}:{}}]},reason:`Marked ${o.name} as ${!o.present?"In Scene":"Away"}`})},`ls-btn-sm ls-presence-pill ${o.present?"ls-chip-accent":""}`,"Click to toggle In Scene / Away"));for(let u of a.dossierFields.filter((g)=>g.enabled&&g.displayStyle==="badge"&&g.id!=="role_summary")){let g=ge(o,u.id);if(g)I.append(e("span","ls-chip",`${u.icon} ${g}`))}if(k){let u=e("aside","ls-dossier-rail"),g=e("div","ls-dossier-portrait");if(L){let h=e("img");h.src=L,h.alt=o.name,g.append(h)}else g.append(e("span","ls-dossier-initial",o.name[0]?.toUpperCase()??"?"));u.append(g);let p=e("div","ls-dossier-overlay");if(p.append(I,e("h2","",o.name)),$t(a,"role_summary")&&m)p.append(e("div","ls-muted",m));if(t.dossierEditMode){let h=e("div","ls-row");h.append(B("\uD83D\uDDBC️ Portrait",()=>t.pickAndUploadImage(o.id,"portrait"),"ls-btn-sm ls-btn-primary"),B(`\uD83C\uDFAD Expression (${S})`,()=>t.pickAndUploadImage(o.id,"expression",S),"ls-btn-sm",`Upload expression sprite for "${S}" demeanor`),B(o.present?"Mark Off-Screen":"Mark Present",()=>{t.request("state:mutate",{patch:{characters:[{id:o.id,name:o.name,present:!o.present}]},reason:`Toggled presence for ${o.name}`})},"ls-btn-sm")),p.append(h)}u.append(p),_.append(u)}let b=e("div","ls-dossier-main");if(!k){let u=e("header","ls-dossier-compact-hero"),g=e("div","ls-row"),p=e("div","ls-dossier-monogram",o.name.slice(0,2).toUpperCase()),h=e("div");if(h.append(e("h2","",o.name)),$t(a,"role_summary")&&m)h.append(e("div","ls-muted",m));g.append(p,h);let T=e("div","ls-row");T.append(I,B("\uD83D\uDDBC️ + Portrait",()=>t.pickAndUploadImage(o.id,"portrait"),"ls-btn-sm",`Upload portrait for ${o.name}`)),u.append(g,T),b.append(u)}let x=[...a.surfaces.dossierTabs].filter((u)=>u.enabled).sort((u,g)=>u.order-g.order),N=x.find((u)=>u.id===t.activeDossierTab)??x[0]??{id:"overview",label:"Overview",icon:"✨",kind:"overview",enabled:!0,order:0,showMeters:!0,showFields:!0,showSecrets:!1,showAudit:!1};if(x.length>1){let u=e("div","ls-subnav-pills");for(let g of x){let p=B(`${g.icon} ${g.label}`,()=>{t.activeDossierTab=g.id,t.emitChange()},"ls-btn-sm");if(g.id===N.id)p.setAttribute("aria-current","page");u.append(p)}b.append(u)}if(N.customHtml){let u=e("div","ls-card");b.append(u),De(u,Fe(N.customHtml,s),t.ctx)}let C=new Set(x.map((u)=>u.id)),v=x[0]?.id??"overview";if(N.showFields){let u=a.dossierFields.filter((g)=>{if(!g.enabled||g.id==="role_summary"||g.displayStyle==="badge")return!1;return(g.tabId&&C.has(g.tabId)?g.tabId:v)===N.id});if(!t.dossierEditMode){for(let h of u.filter((T)=>T.displayStyle==="quote")){let T=ge(o,h.id);if(!T)continue;let l=e("div","ls-thought-box ls-row-between");l.append(e("span","",`${h.icon} “${T}”`),B("✏️",()=>Qe(t,h),"ls-btn-sm ls-btn-icon",`Customize "${h.label}" field`)),b.append(l)}if(N.kind==="overview"&&a.coreTrackers?.trackNpcConditions!==!1&&o.conditions.length>0){let h=e("div","ls-row");for(let T of o.conditions){let l=e("span","ls-rpg-fx-pill",`⚡ ${T}`);l.dataset.fxKind="neutral",h.append(l)}b.append(h)}let g=u.filter((h)=>h.displayStyle!=="quote"),p=e("div","ls-grid");for(let h of g){let T=ge(o,h.id);if(!T)continue;let l=e("div","ls-stat-cell");if(h.color)l.style.setProperty("--ls-bar-color",h.color);if(h.layoutSpan&&h.layoutSpan!=="auto")l.dataset.span=h.layoutSpan;let w=e("div","ls-row-between");w.append(e("span","ls-kicker",`${h.icon} ${h.label}`),B("✏️",()=>Qe(t,h),"ls-btn-sm ls-btn-icon",`Customize "${h.label}" field`)),l.append(w,Xe(T,h.displayStyle==="pills"?"pill_list":"auto")),p.append(l)}if(p.childElementCount>0)b.append(p)}else{let g=e("div","ls-card"),p=e("div","ls-row-between");p.append(e("h3","",`✏️ Edit ${o.name}'s Dossier Fields`),B("↺ Restore Default Fields",()=>{t.request("state:mutate",{templatePatch:{dossierFields:St()},reason:"Restored default dossier fields"})},"ls-btn-sm")),g.append(p);let h=e("div","ls-grid"),T=new Map;for(let A of a.dossierFields.filter((E)=>E.enabled)){let E=e("div","ls-label"),D=e("div","ls-row-between");D.append(e("span","",`${A.icon} ${A.label}`),B("⚙️ Schema",()=>Qe(t,A),"ls-btn-sm",`Edit "${A.label}" schema or delete`));let F=A.displayStyle==="quote"?e("textarea","ls-input"):e("input","ls-input");if(F instanceof HTMLTextAreaElement)F.rows=2;F.value=ge(o,A.id),F.placeholder=A.placeholder||A.label,E.append(D,F),h.append(E),T.set(A.id,F)}let l=e("label","ls-label","⚡ Active Conditions (comma-separated)"),w=e("input","ls-input");w.value=o.conditions.join(", "),w.placeholder="e.g. Flustered, Holding Tray, Guarded…",l.append(w);let M=e("label","ls-label","\uD83D\uDCDD Personal Character Notes"),R=e("textarea","ls-input");R.rows=2,R.value=o.notes||"",R.placeholder="Optional notes about this character…",M.append(R),g.append(h,l,M),g.append(B("\uD83D\uDCBE Save Character Details",()=>{let A={...o.fields};for(let[D,F]of T.entries())A[D]=F.value.trim();let E=w.value.split(",").map((D)=>D.trim()).filter(Boolean);t.request("state:mutate",{patch:{characters:[{id:o.id,name:o.name,roleSummary:A.role_summary??o.roleSummary,demeanor:A.demeanor??o.demeanor,attire:A.attire_layers??o.attire,immediateGoal:A.immediate_goal??o.immediateGoal,innerThought:A.inner_thought??o.innerThought,conditions:E,notes:R.value.trim(),fields:A}]},reason:`Updated dossier details for ${o.name}`})},"ls-btn-primary")),b.append(g)}}if(N.showMeters){let u=a.stats.filter((p)=>{if(!p.enabled||p.scope!=="character"||p.showIn?.dossier===!1)return!1;let h=p.dossierTabId||"bonds";return(C.has(h)?h:v)===N.id});if(u.length>0){let p=e("div","ls-stat-grid"),h=i.characterDeltas[o.id]??{},T=(l,w,M)=>{t.request("state:mutate",{patch:{characters:[{id:o.id,name:o.name,meters:{[l]:{op:"set",value:M,reason:"Manual Dossier adjustment"}}}]},reason:`Set ${o.name} ${w} to ${String(M)}`})};for(let l of u){let w=o.meters[l.id],M=Boolean(w?.calibrated),R=M&&w?w.value:l.defaultValue,A=Boolean(l.locked||w?.locked),E=h[l.id]??0,D=String(R??""),F=M&&typeof R==="string"&&(l.displayStyle==="feed_cards"||l.displayStyle==="step_chain"||l.displayStyle==="pill_list"||l.displayStyle==="quote_callout"||D.length>36||/->|→|\n|;/.test(D)),O=e("div","ls-stat-cell");if(O.style.setProperty("--ls-bar-color",l.color||"var(--ls-primary)"),O.dataset.locked=String(A),O.dataset.uncalibrated=String(!M),O.dataset.span=l.layoutSpan==="full"||l.layoutSpan!=="half"&&F?"full":"half",w?.lastReason)O.title=`Evidence: ${w.lastReason}`;let V=e("div","ls-row-between");V.append(e("strong","",`${l.icon} ${l.label}`));let W=e("div","ls-row");if(E!==0)W.append(e("span",`ls-delta ${E>0?"is-pos":"is-neg"}`,`${E>0?`+${E} ▲`:`${E} ▼`}`));let H=!M?"Uncalibrated":l.kind==="clock"||l.kind==="pips"?`${Number(R)||0}/${l.max}`:F?`${_t(D).length} entries`:D,j=e("strong","",H);if(W.append(j,B("✏️",()=>Ce(t,"character",l),"ls-btn-sm ls-btn-icon","Edit stat schema")),V.append(W),O.append(V),M&&typeof R==="number"){let z=Ue(l.anchors,R);if(z)O.append(e("small","ls-muted",z))}else if(!M)O.append(e("small","ls-muted",`Volatility: ${l.volatility} · Calibrates on sync`));if(w?.lastReason&&!F&&w.lastReason!==s.scene.beatSummary&&!/^(?:Scene progression|Manual Dossier adjustment|Manual UI adjustment)$/i.test(w.lastReason))O.append(e("small","ls-muted",`↳ ${w.lastReason}`));if(l.kind==="skill_tree")O.append(dt(l,R,A,(z,U)=>T(l.id,l.label,z)));else if(l.kind==="xp_level")O.append(pt(l,R));else if(l.kind==="attributes")O.append(ut(l,R,`${o.id}:${t.chatId}`));else if(l.kind==="inventory")O.append(mt(R));else if(l.kind==="status_fx")O.append(ft(R));else if(l.kind==="hearts")O.append(ht(l,Number(R)||0,M,A,(z)=>T(l.id,l.label,z)));else if(l.kind==="currency")O.append(gt(l,R,E));else if(M&&F)O.append(Xe(D,l.displayStyle??"auto"));else if(l.kind==="meter"||l.kind==="number"){let z=typeof R==="number"?R:0,U=Math.max(1,l.max-l.min),K=e("div","ls-bar-track"),X=e("div","ls-bar-fill");if(l.min<0&&l.max>0){K.dataset.bipolar="true";let J=(0-l.min)/U*100;if(z>=0)X.style.marginLeft=`${J.toFixed(1)}%`,X.style.width=`${Math.min(100-J,z/l.max*(100-J)).toFixed(1)}%`;else{let Y=Math.abs(z)/Math.abs(l.min)*J;X.style.marginLeft=`${Math.max(0,J-Y).toFixed(1)}%`,X.style.width=`${Math.min(J,Y).toFixed(1)}%`,X.style.background="var(--ls-danger)"}}else{let J=M?Math.max(0,Math.min(100,Math.round((z-l.min)/U*100))):0;X.style.width=`${J}%`}if(K.append(X),O.append(K),t.dossierEditMode&&n&&t.ctx.components?.mountRangeSlider){let J=e("div");O.append(J);try{n.track(t.ctx.components.mountRangeSlider(J,{min:l.min,max:l.max,step:l.step||1,integer:!0,value:z,disabled:A,onDragValue:(Y)=>{if(Y!==null)j.textContent=String(Y)},onCommit:(Y)=>T(l.id,l.label,Y)}))}catch{}}}else if(l.kind==="clock"){let z=Math.max(2,Math.min(16,l.max||6)),U=M?Math.max(0,Math.min(z,Math.round(Number(R)||0))):0,K=e("div","ls-clock-bar");K.style.gridTemplateColumns=`repeat(${z}, 1fr)`;for(let X=1;X<=z;X++){let J=e("span",`ls-clock-seg${X<=U?" is-filled":""}`);J.addEventListener("click",()=>T(l.id,l.label,X===U?X-1:X)),K.append(J)}O.append(K)}Ut(t.ctx,O,()=>[{key:"edit",label:`✏️ Edit "${l.label}" Schema & Style`},{key:"duplicate",label:`\uD83D\uDCCB Duplicate "${l.label}" to Another Scope / Tab…`},{key:"test",label:`\uD83E\uDDEA Test "${l.label}" in Sandbox`},{key:"audit",label:"\uD83D\uDCC8 View Shift History"},{key:"div",label:"",type:"divider"},{key:"delete",label:`\uD83D\uDDD1️ Delete "${l.label}"`,danger:!0}],(z)=>{if(z==="edit")Ce(t,"character",l);else if(z==="duplicate")Oe(t,l);else if(z==="test")Ze(t,l.id);else if(z==="audit")ta(t,o.id);else if(z==="delete"){let U=structuredClone(t.snapshot.template);t.request("state:mutate",{templatePatch:{stats:U.stats.filter((K)=>K.id!==l.id)},reason:`Deleted stat "${l.label}"`})}}),p.append(O)}b.append(p)}let g=a.stats.filter((p)=>p.enabled&&p.scope==="player"&&p.showIn?.dossier===!0&&p.dossierTabId===N.id&&N.id!=="bonds");if(g.length>0)b.append(Dn(t,g,"player",n,t.dossierEditMode,!1))}if(N.showNpcBonds||N.kind==="peer_bonds"){let u=e("div","ls-stack"),g=e("div","ls-row-between"),p=Object.values(o.peerBonds??{});if(g.append(e("h3","",`\uD83E\uDD1D ${o.name}'s Standing & Stats Toward Other NPCs (${p.length})`),B("+ Add NPC↔NPC Bond",()=>qe(t,o),"ls-btn-sm ls-btn-primary")),u.append(g),!p.length)u.append(e("p","ls-muted",`No NPC-to-NPC relationships recorded for ${o.name} yet. They populate automatically when multiple NPCs interact, or click "+ Add NPC↔NPC Bond" above.`));else{let h=e("div","ls-stat-grid");for(let T of p){let l=e("div","ls-stat-cell"),w=e("div","ls-row-between");if(w.append(e("strong","",`→ \uD83D\uDC64 ${T.toName}`),e("div","ls-row")),w.lastElementChild.append(e("span","ls-chip ls-chip-accent",T.label),B("✏️",()=>qe(t,o,T),"ls-btn-sm ls-btn-icon","Edit NPC bond"),B("\uD83D\uDDD1️",()=>{let M=structuredClone(o);delete M.peerBonds[T.toId],t.request("state:mutate",{stateOverride:{characters:{...s.characters,[o.id]:M}},reason:`Removed peer bond ${o.name} → ${T.toName}`})},"ls-btn-sm ls-btn-icon ls-btn-danger","Delete NPC bond")),l.append(w),T.attitude)l.append(e("div","ls-thought-box",`“${T.attitude}”`));for(let[M,R]of Object.entries(T.meters)){let A=a.stats.find((F)=>F.id===M&&F.scope==="character");if(A&&!A.enabled)continue;let E=A?`${A.icon} ${A.label}`:M,D=e("div","ls-row-between");if(D.append(e("small","ls-muted",E),e("strong","",String(R))),l.append(D),typeof R==="number"){let F=A?.min??0,O=A?.max??100,V=Math.max(1,O-F),W=e("div","ls-bar-track"),H=e("div","ls-bar-fill");if(A?.color)H.style.setProperty("--ls-bar-color",A.color);if(F<0&&O>0){W.dataset.bipolar="true";let j=(0-F)/V*100;if(R>=0)H.style.marginLeft=`${j.toFixed(1)}%`,H.style.width=`${Math.min(100-j,R/O*(100-j)).toFixed(1)}%`;else{let z=Math.abs(R)/Math.abs(F)*j;H.style.marginLeft=`${Math.max(0,j-z).toFixed(1)}%`,H.style.width=`${Math.min(j,z).toFixed(1)}%`,H.style.background="var(--ls-danger)"}}else{let j=Math.max(0,Math.min(100,Math.round((R-F)/V*100)));H.style.width=`${j}%`}W.append(H),l.append(W)}}h.append(l)}u.append(h)}b.append(u)}if(N.showSecrets){let u=e("div","ls-stack");if(u.append(e("h3","","\uD83D\uDD75️ Secrets, Clues & Notes")),!o.secrets.length)u.append(e("p","ls-muted","No secrets or discoveries recorded for this character yet."));else for(let g of o.secrets){let p=e("div","ls-stat-cell");p.append(e("strong","",`${g.stage==="confirmed"?"\uD83D\uDD13":"\uD83D\uDD0D"} ${g.title} (${g.stage})`),e("p","ls-muted",g.detail)),u.append(p)}b.append(u)}if(N.showAudit){let u=s.auditLog.filter((g)=>g.actorId===o.id&&typeof g.after==="number"&&(g.before!==null||g.numericDelta!==0)).slice(-8).reverse();if(u.length>0){let g=e("div","ls-stack");g.append(e("span","ls-kicker","\uD83D\uDCC8 Recent Meter Shifts"));let p=e("div","ls-row");for(let h of u){let T=h.numericDelta>0?`+${h.numericDelta}`:String(h.numericDelta),l=e("span",`ls-delta ${h.numericDelta>=0?"is-pos":"is-neg"}`,`${h.statLabel}: ${String(h.before??"—")} → ${String(h.after)}${h.numericDelta!==0?` (${T})`:""}`);if(h.reason&&h.reason!==s.scene.beatSummary)l.title=h.reason;p.append(l)}g.append(p),b.append(g)}}return _.append(b),r.append(_),r}function nn(t,n,s,a){let{state:i,template:r,deltas:d}=t.snapshot,o=e("div","ls-stack"),c=Object.values(i.characters);if(!c.length)return o.append(e("p","ls-muted","Characters appear here as the story introduces them.")),o;let f=n==="widget"?r.surfaces.widgetTabs:r.surfaces.inlineTabs,y=new Set(f.filter((u)=>u.enabled).map((u)=>u.id)),P=r.stats.filter((u)=>{if(!u.enabled||u.scope!=="character")return!1;if(n==="widget"&&u.showIn?.widget===!1)return!1;if(n==="inline"&&u.showIn?.inline===!1)return!1;let g=n==="widget"?u.widgetTabId||"cast":u.inlineTabId||"cast",p=n==="widget"?u.extraWidgetTabIds:u.extraInlineTabIds;return g===s||!y.has(g)||Boolean(p?.includes(s))}),m=r.dossierFields.filter((u)=>n==="widget"?u.enabled&&u.showInHudCast:u.enabled&&u.showInInlineCast),S=new Set(["skill_tree","xp_level","attributes","inventory","status_fx","hearts","currency"]),L=P.filter((u)=>!S.has(u.kind)&&!Lt(u)&&u.kind!=="boolean"),k=P.filter((u)=>S.has(u.kind)||Lt(u)||u.kind==="boolean"),_=c.filter((u)=>u.present),I=c.filter((u)=>!u.present),b=r.theme.castLayout??"roster",x=e("div","ls-row-between");x.append(e("span","ls-kicker",`\uD83D\uDFE2 In Scene: ${_.length} · ⚪ Away: ${I.length}`),B(b==="roster"?"\uD83D\uDDC2️ All Cards":"\uD83D\uDC65 Icons",()=>{let u=b==="roster"?"cards":"roster";t.request("state:mutate",{templatePatch:{theme:{...r.theme,castLayout:u}},reason:`Switched cast display to ${u}`})},"ls-btn-sm","Toggle between compact character icons and expanded stacked cards")),o.append(x);let N=(u)=>{let g=e("div","ls-card"),p=e("div","ls-row-between"),h=e("div","ls-row"),T=e("div","ls-cast-avatar");if(u.portraitUrl){let E=e("img");E.src=u.portraitUrl,E.alt=u.name,T.append(E)}else T.textContent=u.name.slice(0,2).toUpperCase();let l=e("div");l.append(e("strong","",`${u.present?"\uD83D\uDFE2":"⚪"} ${u.name}`));let w=ge(u,"role_summary");if(w){let E=e("div","ls-muted",w);E.style.fontSize="11px",l.append(E)}h.append(T,l);let M=e("div","ls-row"),R=m.find((E)=>E.id==="demeanor"),A=R?ge(u,"demeanor"):"";if(A)M.append(e("span","ls-chip",`${R.icon} ${A}`));if(M.append(B(u.present?"\uD83D\uDFE2 In Scene":"⚪ Away",()=>{t.request("state:mutate",{patch:{characters:[{id:u.id,name:u.name,present:!u.present,...!u.present&&i.scene.location?{location:i.scene.location}:{}}]},reason:`Marked ${u.name} as ${!u.present?"In Scene":"Away"}`})},`ls-btn-sm ls-presence-pill ${u.present?"ls-chip-accent":""}`,`Toggle whether ${u.name} is In Scene or Away`),ee("volume",()=>Yt(t,u.id),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:`Assign TTS voice for ${u.name}`}),B("Dossier",()=>a(u.id),"ls-btn-sm ls-btn-primary")),p.append(h,M),g.append(p),r.coreTrackers?.trackNpcConditions!==!1&&u.conditions.length>0){let E=e("div","ls-row");for(let D of u.conditions.slice(0,4)){let F=e("span","ls-rpg-fx-pill",`⚡ ${D}`);F.dataset.fxKind="neutral",E.append(F)}g.append(E)}for(let E of m.filter((D)=>D.id!=="demeanor"&&D.id!=="role_summary")){let D=ge(u,E.id);if(!D)continue;if(E.displayStyle==="quote")g.append(e("div","ls-thought-box",`${E.icon} “${D}”`));else g.append(e("small","ls-muted",`${E.icon} ${D}`))}if(L.length>0){let E=e("div","ls-cast-mini-grid");for(let D of L){let F=u.meters[D.id],O=d.characterDeltas[u.id]?.[D.id]??0,V=F?.calibrated&&typeof F.value==="number"?F.value:0,W=Math.max(1,D.max-D.min),H=F?.calibrated?Math.max(0,Math.min(100,Math.round((V-D.min)/W*100))):0,j=F?.calibrated&&typeof F.value==="number"?Ue(D.anchors,F.value):"",z=e("div","ls-cast-mini-meter");if(z.style.setProperty("--ls-bar-color",D.color||"var(--ls-primary)"),j)z.title=`${D.label}: ${V} (${j})`;let U=e("div","ls-row-between");U.append(e("small","ls-muted",`${D.icon} ${D.label}`));let K=e("div","ls-row");if(O!==0)K.append(e("span",`ls-delta ${O>0?"is-pos":"is-neg"}`,O>0?`+${O}`:String(O)));K.append(e("strong","",F?.calibrated?String(F.value):"—")),U.append(K);let X=e("div","ls-bar-track"),J=e("div","ls-bar-fill");J.style.width=`${H}%`,X.append(J),z.append(U,X),E.append(z)}g.append(E)}for(let E of k){let D=u.meters[E.id],F=Boolean(D?.calibrated),O=F?D.value:E.defaultValue,V=String(O??"").trim(),W=e("div","ls-stat-cell");if(W.style.setProperty("--ls-bar-color",E.color||"var(--ls-primary)"),W.dataset.uncalibrated=String(!F),W.append(e("small","ls-kicker",`${E.icon} ${E.label}`)),!F&&!S.has(E.kind)){W.append(e("small","ls-muted","Uncalibrated")),g.append(W);continue}if(F&&(!V||V==="None")&&!S.has(E.kind)){W.append(e("small","ls-muted","None")),g.append(W);continue}if(E.kind==="skill_tree")W.append(dt(E,O,Boolean(E.locked||D?.locked),(H,j)=>{t.request("state:mutate",{patch:{characters:[{id:u.id,name:u.name,meters:{[E.id]:{op:"set",value:H,reason:j}}}]},reason:j})}));else if(E.kind==="xp_level")W.append(pt(E,O));else if(E.kind==="attributes")W.append(ut(E,O,`${u.id}:${t.chatId}`));else if(E.kind==="inventory")W.append(mt(O));else if(E.kind==="status_fx")W.append(ft(O));else if(E.kind==="hearts")W.append(ht(E,Number(O)||0,Boolean(D?.calibrated),Boolean(E.locked||D?.locked)));else if(E.kind==="currency")W.append(gt(E,O,d.characterDeltas[u.id]?.[E.id]??0));else W.append(Xe(V,E.displayStyle??"auto"));g.append(W)}return g};if(b==="cards"){for(let u of[..._,...I])o.append(N(u));return o}t.openedCastTabs=t.openedCastTabs.filter((u)=>Boolean(i.characters[u]));let C=t.activeCastTabActorId&&i.characters[t.activeCastTabActorId]?i.characters[t.activeCastTabActorId]:void 0;if(t.openedCastTabs.length>0||C){let u=e("div","ls-cast-tabs-bar"),g=B("← Cast",()=>{t.activeCastTabActorId="",t.emitChange()},"ls-btn-sm","Return to Cast Icons");if(!C)g.setAttribute("aria-current","page");u.append(g);for(let p of t.openedCastTabs){let h=i.characters[p];if(!h)continue;let T=C?.id===h.id,l=e("div","ls-cast-tab-group"),w=B(`${h.present?"\uD83D\uDFE2":"⚪"} ${h.name}`,()=>{t.activeCastTabActorId=h.id,t.selectedActorId=h.id,t.emitChange()},"ls-btn-sm ls-cast-tab-btn",`Inspect ${h.name}`);if(T)w.setAttribute("aria-current","page");let M=B("×",()=>{if(t.openedCastTabs=t.openedCastTabs.filter((R)=>R!==h.id),t.activeCastTabActorId===h.id)t.activeCastTabActorId=t.openedCastTabs.at(-1)??"";t.emitChange()},"ls-btn-sm ls-cast-tab-close",`Close ${h.name} tab`);l.append(w,M),u.append(l)}if(C)return o.replaceChildren(x,u,N(C)),o;o.append(u)}let v=(u,g)=>{if(!g.length)return;let p=e("div","ls-roster-group");p.append(e("small","ls-muted",`${u} (${g.length})`));let h=e("div","ls-roster-grid");for(let T of g){let l=ge(T,"demeanor"),w=ge(T,"role_summary"),M=e("button","ls-roster-icon-btn");M.type="button",M.title=`${T.name}${w?` — ${w}`:""}${l?` (${l})`:""}`;let R=e("div","ls-roster-avatar");if(T.portraitUrl){let F=e("img");F.src=T.portraitUrl,F.alt=T.name,R.append(F)}else R.append(document.createTextNode(T.name.slice(0,2).toUpperCase()));R.append(e("span",`ls-roster-dot ${T.present?"is-present":"is-away"}`));let A=e("span","ls-roster-name",T.name),E=l||w||"",D=E?e("span","ls-roster-role",E):null;M.append(R,A,...D?[D]:[]),M.addEventListener("click",(F)=>{if(F.stopPropagation(),!t.openedCastTabs.includes(T.id))t.openedCastTabs=[...t.openedCastTabs,T.id];t.activeCastTabActorId=T.id,t.selectedActorId=T.id,t.emitChange()}),h.append(M)}p.append(h),o.append(p)};return v("\uD83D\uDFE2 In Scene",_),v("⚪ Away",I),o}function Ga(t){let{state:n,template:s,deltas:a}=t.snapshot,i=s.theme.showSceneChips,r=Ne(n),d=e("div","ls-row");if(i.time)d.append(e("span","ls-chip",`\uD83D\uDD70️ ${r.time}`));if(i.date)d.append(e("span","ls-chip",`\uD83D\uDCC5 ${r.date}`));if(i.location)d.append(e("span","ls-chip ls-chip-accent",`\uD83D\uDCCD ${r.location}`));if(i.weather)d.append(e("span","ls-chip",`\uD83C\uDF26️ ${r.weather}`));if(s.coreTrackers?.trackPlayerAttire!==!1&&n.player.attire)d.append(e("span","ls-chip",`\uD83D\uDC55 You: ${n.player.attire.slice(0,28)}`));if(i.cast){let o=$t(s,"demeanor");for(let c of Object.values(n.characters).filter((f)=>f.present).slice(0,4)){let f=a.characterDeltas[c.id]??{},y=Object.values(f).find((S)=>S!==0),P=o?ge(c,"demeanor"):"",m=e("span","ls-chip",`\uD83D\uDC64 ${c.name}${P?` · ${P}`:""}`);if(y)m.append(e("span",`ls-delta ${y>0?"is-pos":"is-neg"}`,y>0?`+${y}`:String(y)));d.append(m)}}if(i.pinnedStats)for(let o of s.stats.filter((c)=>c.enabled&&(c.pinnedToHeader||c.showIn?.pinnedHeader)))if(o.scope==="character"){let c=Object.values(n.characters).find((m)=>m.present),f=c?.meters[o.id];if(!f?.calibrated)continue;let y=(c?a.characterDeltas[c.id]?.[o.id]:0)??0,P=e("span","ls-chip ls-chip-accent",`${o.icon} ${c.name} ${o.label}: ${String(f.value)}`);if(y!==0)P.append(e("span",`ls-delta ${y>0?"is-pos":"is-neg"}`,y>0?`+${y}`:String(y)));d.append(P)}else{let c=n.stats[o.id];if(!c?.calibrated)continue;let f=a.statDeltas[o.id]??0,y=e("span","ls-chip ls-chip-accent",`${o.icon} ${o.label}: ${String(c.value)}`);if(f!==0)y.append(e("span",`ls-delta ${f>0?"is-pos":"is-neg"}`,f>0?`+${f}`:String(f)));d.append(y)}return d}function na(t,n,s){let{state:a,template:i}=t.snapshot,r=e("div","ls-inline-host");t.stampThemeOnElement(r);let d=e("div","ls-inline-card");if(!t.inlineExpanded){let S=e("div","ls-inline-pill-bar");S.addEventListener("click",()=>{t.inlineExpanded=!0,t.emitChange()});let L=Fn(t);if(L.childElementCount===0)L.append(e("span","ls-chip ls-chip-accent",`${i.icon||"✨"} ${a.title||i.name||"Lumi Stats"}`));return S.append(L,ee("chevronDown",()=>{t.inlineExpanded=!0,t.emitChange()},{label:"Expand",className:"ls-btn-sm ls-btn-primary",title:"Expand Inline Ribbon"})),d.append(S),r.append(d),r}if(i.surfaces.customInlineHtml){let S=e("div","ls-card");d.append(S),De(S,Fe(i.surfaces.customInlineHtml,a),t.ctx)}let o=[...i.surfaces.inlineTabs].filter((S)=>S.enabled&&(S.kind!=="web"||i.surfaces.showRelationshipWeb!==!1)).sort((S,L)=>S.order-L.order),c=o.find((S)=>S.id===t.activeInlineTab)??o[0]??{id:"stats",label:"Stats",icon:"\uD83D\uDCCA",kind:"stats",enabled:!0,order:0},f=e("div","ls-row-between"),y=e("div","ls-row");if(o.length>1)for(let S of o){let L=B(`${S.icon} ${S.label}`,()=>{t.activeInlineTab=S.id,t.emitChange()},"ls-btn-sm");if(S.id===c.id)L.setAttribute("aria-current","page");y.append(L)}else y.append(Ga(t));let P=async(S)=>{if(typeof t.ctx.ui?.showContextMenu!=="function"){it(t,s);return}let{selectedKey:L}=await t.ctx.ui.showContextMenu({position:{x:S.clientX,y:S.clientY},items:[{key:"edit_scene",label:"Edit Scene Values"},{key:"pill_prompts",label:"Edit Scene Pill Prompts & Chips"},{key:"template",label:`Switch Template & Skin (${i.name})`}]});if(L==="edit_scene")Et(t);else if(L==="pill_prompts")Ae(t);else if(L==="template")it(t,s)},m=e("div","ls-row");if(m.append(ee("stage",()=>t.toggleVnStage(),{className:"ls-btn-sm ls-btn-ghost",label:"Stage",title:"Launch 2D Visual Novel Stage"}),ee("more",(S)=>void P(S),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:"Scene Pill, Template & Skin Options"}),ee("settings",s,{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:"Open Settings Studio"}),ee("chevronUp",()=>{t.inlineExpanded=!1,t.emitChange()},{label:"Collapse",className:"ls-btn-sm ls-btn-primary",title:"Collapse Ribbon"})),f.append(y,m),d.append(f),c.kind==="cast")d.append(nn(t,"inline",c.id,n));else if(c.kind==="web")d.append(Zt(t,n));else if(c.kind==="map")d.append(en(t));else{if(c.customHtml){let S=e("div","ls-card");d.append(S),De(S,Fe(c.customHtml,a),t.ctx)}d.append(tn(t,"inline",c.id))}return r.append(d),r}var sa='    She⠀stepped⠀forward⠀with⠀a⠀warm⠀smile.⠀"Welcome⠀back."',zn="",aa="She hid the knife before any blood could spill.",ra=!1,Be=null;function oa(t,n){let s=t.settings,a=e("div","ls-stack"),i=e("section","ls-card");if(i.append(e("span","ls-kicker","Prose Typography & Unicode Hygiene"),e("h3","","Braille Blank (U+2800) & Whitespace Cleaner"),e("p","ls-muted","Scrubs invisible Braille pattern blanks (U+2800), zero-width joiners, and accidental 4-space code blocks.")),s){let P=e("div","ls-row-between ls-stat-cell");P.append(e("span","","Auto-Clean Braille Blanks & 4-Space Glitches"));let m=e("div");P.append(m),me(t,n,m,{checked:Boolean(s.cleanBraille),ariaLabel:"Auto-Clean Braille Blanks",onChange:(S)=>{t.request("settings:update",{settings:{cleanBraille:S}})}}),i.append(P)}let r=e("div","ls-row-between ls-stat-cell");r.append(e("span","","Retroactively clean all stored messages in the active chat:"),B("Clean Active Chat Now",()=>{t.request("prose:cleanChat").then((P)=>{t.notify(`Cleaned ${Number(P.cleanedCount??0)} of ${Number(P.total??0)} messages.`)})},"ls-btn-sm ls-btn-primary")),i.append(r),a.append(i);let d=e("div");a.append(d);let o=he(t,n,d,{title:"Live Braille & Indentation Tester",iconName:"flask",defaultExpanded:!1,persistKey:"studio_prose_tester"}),c=e("textarea","ls-input");c.rows=2,c.value=sa;let f=e("div","ls-stat-cell"),y=()=>{sa=c.value,f.textContent=`Normalized Output: ${jt(c.value)}`};if(c.addEventListener("input",y),y(),o.append(c,f),s){let P=e("section","ls-card"),m=(T)=>{t.request("settings:update",{settings:T})},S=kt(s.sensitiveWords),L=s.obfuscateVowelsWithOne!==!1,k=e("div","ls-row-between"),_=e("div");k.append(e("h3","",`Sensitive Word Obfuscator (${S.length} words)`),_),me(t,n,_,{checked:Boolean(s.sensitiveObfuscatorEnabled),ariaLabel:"Enable Sensitive Word Obfuscator",onChange:(T)=>m({sensitiveObfuscatorEnabled:T})}),P.append(k,e("p","ls-muted",'Replaces vowels in chosen words with "1" (e.g., blood → bl11d) when sending prompts, and restores readable words & inflections (e.g., bl11d/bl11dy → blood/bloody) in chat display via Lumiverse display processing (requires "chat_mutation" or "regex_scripts" permission).'));let I=e("div","ls-row"),b=e("input","ls-input");b.style.flex="1",b.placeholder="Type words separated by commas (e.g. blood, kill)…",b.value=zn,b.addEventListener("input",()=>{zn=b.value});let x=()=>{let T=b.value.split(/[\n,;]+/).map((w)=>w.trim().toLowerCase()).filter((w)=>w.length>=2);if(!T.length)return;let l=kt([...S,...T]);zn="",b.value="",m({sensitiveWords:l,...s.sensitiveObfuscatorEnabled?{}:{sensitiveObfuscatorEnabled:!0}})};if(b.addEventListener("keydown",(T)=>{if(T.key==="Enter")T.preventDefault(),x()}),I.append(b,B("Add",x,"ls-btn-sm ls-btn-primary"),...S.length>0?[B("Clear All",()=>m({sensitiveWords:[]}),"ls-btn-sm ls-btn-danger")]:[]),P.append(I),S.length>0){let T=e("div","ls-row");for(let l of S)T.append(B(`${l} → ${Tn(l,L)} ✕`,()=>{m({sensitiveWords:S.filter((w)=>w!==l)})},"ls-btn-sm ls-quick-pill",`Remove "${l}"`));P.append(T)}let N=e("div");P.append(N);let C=he(t,n,N,{title:"Cipher Rules & Live Preview",iconName:"sliders",defaultExpanded:!1,persistKey:"studio_prose_cipher"}),v=e("div","ls-grid");for(let[T,l,w]of[["obfuscateVowelsWithOne",'Use "1" instead of "*"',!0],["obfuscateOnSend","Obfuscate Prompts Sent to LLM",!0],["restoreObfuscatedOnRender","Restore Words in Chat Display",!0],["obfuscateOnOutput","Obfuscate Saved LLM Output",!1],["includeCipherHint","Explain Cipher Input to LLM (Keep prose normal)",!1]]){let M=e("div","ls-row-between ls-stat-cell");M.append(e("span","",l));let R=e("div");M.append(R),me(t,n,R,{checked:s[T]!==void 0?Boolean(s[T]):w,onChange:(A)=>m({[T]:A})}),v.append(M)}let u=e("input","ls-input");u.value=aa;let g=e("small","ls-muted"),p=e("small","ls-muted"),h=()=>{aa=u.value;let T=$s(u.value,S,L),l=s.obfuscateOnOutput?T:s.restoreObfuscatedOnRender!==!1?In(T,S,L):T;g.textContent=`Sent to LLM: ${T}`,p.textContent=`Chat Display: ${l}`};u.addEventListener("input",h),h(),C.append(v,u,g,p),a.append(P)}return a}function ia(t,n,s){let a=t.settings,i=e("div","ls-stack");if(!a)return i;if(!t.connections.length&&!ra)ra=!0,t.refreshActiveChat();let r=e("section","ls-card");r.append(e("h3","","Extraction Mode & Connections"));let d=e("div","ls-row");for(let[l,w]of[["sidecar","Dedicated Sidecar Extractor (Works with Any Preset)"],["inline_tag","Zero-Call Inline <lumi-stats> Tag"]]){let M=B(w,()=>{t.request("settings:update",{settings:{extractionMode:l}})},"ls-btn-sm");if(a.extractionMode===l)M.setAttribute("aria-current","page");d.append(M)}r.append(d);let o=e("div","ls-grid");for(let[l,w]of[["autoTrack","Auto-calibrate after assistant replies"],["injectContinuity","Inject continuity into narrator prompt"],["splitStaticProtocolForCache","Cache-friendly split (static rules before history)"],["memoryCortexSync","Sync to Lumiverse Memory Cortex"],["worldInfoGating","Enable [lumi:stat>=value] World Info gates"],["thresholdToasts","Show threshold toast alerts"],["debugInspector","Keep last extractor payload for debug"]]){let M=e("div","ls-row-between ls-stat-cell");M.append(e("span","",w));let R=e("div");M.append(R),me(t,n,R,{checked:Boolean(a[l]),onChange:(A)=>void t.request("settings:update",{settings:{[l]:A}})}),o.append(M)}r.append(o);let c=e("div","ls-grid"),f=e("div","ls-label","Extractor LLM Connection"),y=e("div");f.append(y);let P=e("label","ls-label","Extractor Model Override"),m=e("div");P.append(m),c.append(f,P),r.append(c),te(t,n,y,{value:a.extractorConnectionId||"",ariaLabel:"Extractor LLM Connection",searchPlaceholder:"Search connections…",options:[{value:"",label:"Use Active Lumiverse Default Connection"},...t.connections.map((l)=>({value:l.id,label:`${l.name}${l.model?` (${l.model})`:""}`,...l.provider?{sublabel:l.provider}:{}}))],onChange:(l)=>{t.request("settings:update",{settings:{extractorConnectionId:l}})}});let S=e("input","ls-input");if(S.value=a.extractorModel||"",S.placeholder="Default connection model…",S.addEventListener("change",()=>{t.request("settings:update",{settings:{extractorModel:S.value.trim()}})}),m.append(S),t.ctx.components?.mountModelCombobox)s.push(()=>{if(!m.isConnected)return;try{m.replaceChildren(),n.track(t.ctx.components.mountModelCombobox(m,{value:a.extractorModel||"",connection:a.extractorConnectionId?{kind:"llm",id:a.extractorConnectionId}:{kind:"llm"},appearance:"standard",placeholder:"Default connection model…",onChange:(l)=>{t.request("settings:update",{settings:{extractorModel:l}})}}))}catch{}});let L=e("section","ls-card");L.append(e("span","ls-kicker","Token Economy & Prompt Budget"),e("h3","","Token Diet, Protocol Mode & Live Analyzer"));let k=e("div","ls-grid"),_=e("label","ls-label","Continuity Token Budget (150–4000)"),I=e("input","ls-input");I.type="number",I.min="150",I.max="4000",I.step="50",I.value=String(a.tokenBudget??450),I.addEventListener("change",()=>{let l=Math.max(150,Math.min(4000,Math.round(Number(I.value)||450)));I.value=String(l),t.request("settings:update",{settings:{tokenBudget:l}})}),_.append(I);let b=e("div","ls-label","Extractor Protocol Mode"),x=e("div");b.append(x),te(t,n,x,{value:a.protocolVerbosity??"compact",ariaLabel:"Extractor Protocol Mode",options:[{value:"compact",label:"Compact Delta (Recommended — Saves ~45%)"},{value:"standard",label:"Standard Detailed (Verbose Turn-1 Guides)"}],onChange:(l)=>{t.request("settings:update",{settings:{protocolVerbosity:l}})}});let N=e("label","ls-label","Sidecar History Window (2–12 msgs)"),C=e("input","ls-input");C.type="number",C.min="2",C.max="12",C.value=String(a.sidecarHistoryTurns??4),C.addEventListener("change",()=>{let l=Math.max(2,Math.min(12,Math.round(Number(C.value)||4)));C.value=String(l),t.request("settings:update",{settings:{sidecarHistoryTurns:l}})}),N.append(C);let v=e("label","ls-label","Sidecar Max Chars / Msg (800–6000)"),u=e("input","ls-input");u.type="number",u.min="800",u.max="6000",u.step="250",u.value=String(a.sidecarMaxCharsPerMsg??2500),u.addEventListener("change",()=>{let l=Math.max(800,Math.min(6000,Math.round(Number(u.value)||2500)));u.value=String(l),t.request("settings:update",{settings:{sidecarMaxCharsPerMsg:l}})}),v.append(u),k.append(_,b,N,v),L.append(k);let g=e("div","ls-row");g.append(B("Hide Analytical Fields from Continuity",()=>{let l=new Set(["acted","observation","plan","knowledge","cash_in_hand","cash_in_bank","bottom_underwear","top_underwear","offscreen_npcs"]),w=t.snapshot.template.stats.map((M)=>l.has(M.id)?{...M,injectInContinuity:!1}:M);t.request("state:mutate",{templatePatch:{stats:w},reason:"Moved analytical/secondary stats to UI-only continuity"}).then(()=>t.notify("Analytical fields moved to UI-only (still tracked & visible in panels)."))},"ls-btn-sm","Stops echoing acted, observation, plan, knowledge, cash, underwear, and offscreen_npcs back to the narrator while keeping them in the UI"),B("Auto-Gate Situational Stats",()=>{let l={cash_in_hand:["cash","coin","gold","money","pay","buy","sell","price","wallet","bank"],cash_in_bank:["cash","coin","gold","money","pay","buy","sell","bank","account","asset"],bottom_underwear:["undress","underwear","panties","boxers","towel","bath","strip","naked","skirt","pants"],top_underwear:["undress","underwear","bra","towel","bath","strip","naked","shirt","top"]},w=t.snapshot.template.stats.map((M)=>{if(l[M.id])return{...M,promptTriggerMode:"conditional",promptKeywords:l[M.id]};if((M.id==="eff_pow_agi"||M.id==="char_eff_pow_agi")&&M.formula?.trim())return{...M,calculationMode:"local_formula"};return M});t.request("state:mutate",{templatePatch:{stats:w},reason:"Applied keyword gating & local-formula diet"}).then(()=>t.notify("Applied keyword gating to situational stats."))},"ls-btn-sm","Only sends cash & clothing rules when matching keywords appear in recent chat")),L.append(g);let p=e("div","ls-stat-cell"),h=()=>{if(p.replaceChildren(),!Be){p.append(e("small","ls-muted",'Click "Analyze Current Chat Tokens" to measure exact protocol, continuity, and per-stat token usage.'));return}let l=Be.approximate?" (est.)":"";p.append(e("strong","",`Total Injected: ${Number(Be.totalInjectedTokens??0)} tokens${l} — Protocol: ${Number(Be.protocolTokens??0)} | Continuity: ${Number(Be.continuityTokens??0)} (uncapped: ${Number(Be.rawContinuityTokens??0)}) | Dossier: ~${Number(Be.dossierStateTokens??0)}`));let w=Array.isArray(Be.topStats)?Be.topStats:[];if(w.length>0){let M=e("div","ls-row");for(let R of w)M.append(e("span","ls-chip",`${String(R.label)}: ~${Number(R.approxTokens??0)}t (rule ${Number(R.ruleTokens??0)} + state ${Number(R.stateTokens??0)})`));p.append(M)}};h();let T=B("Analyze Current Chat Tokens",()=>{T.disabled=!0,T.textContent="Counting tokens…",t.request("tokens:analyze").then((l)=>{Be=l,h()}).finally(()=>{if(T.isConnected)T.disabled=!1,T.textContent="Analyze Current Chat Tokens"})},"ls-btn-sm ls-btn-primary");return L.append(T,p),r.append(B("Inspect Last Extractor Payload",()=>{t.request("debug:get").then((l)=>{t.modals.open({title:"Last Extractor JSON Output",width:720,maxHeight:740},(w)=>{let M=e("pre","ls-stat-cell",l.record?JSON.stringify(l.record,null,2):"No debug record captured yet. Enable debug inspection and run a sync.");M.style.whiteSpace="pre-wrap",M.style.overflowWrap="anywhere",w.append(M)})})},"ls-btn-sm")),i.append(r,L),i}function rn(t,n){let s=structuredClone(t.snapshot.template),a=[...s.categories??[]];t.modals.open({title:n?`Edit Category: ${n.icon} ${n.name}`:"Create Stat Category & Group Rule",width:660,maxHeight:840},(i,r,d,o)=>{let c=n?.enabled??!0,f=n?.showGroupHeaderInHud??!0,y=n?.collapsedByDefault??!1,P=n?.injectInContinuity??!0,m=n?.color||"var(--lumiverse-primary)",S=n?.promptTriggerMode??"always",L=new Set(n?s.stats.filter((G)=>G.categoryId===n.id).map((G)=>G.id):[]),k=e("div","ls-grid"),_=e("label","ls-label","Icon"),I=e("input","ls-input");I.value=n?.icon??"\uD83D\uDCC1",_.append(I);let b=e("label","ls-label","Category Name"),x=e("input","ls-input");x.placeholder="e.g. Combat & Power, Romance & Chemistry, Finances…",x.value=n?.name??"",b.append(x),k.append(_,b),i.append(k);let N=e("div","ls-label","Category Accent Color"),C=e("div","ls-row"),v=()=>{for(let G of[...C.querySelectorAll(".ls-color-swatch")])G.setAttribute("aria-pressed",String(G.dataset.colorVal===m))};for(let[G,Q,se]of[["var(--lumiverse-primary)","Theme Primary","var(--lumiverse-primary, #38bdf8)"],["#38bdf8","Sky","#38bdf8"],["#f472b6","Rose","#f472b6"],["#f59e0b","Amber","#f59e0b"],["#10b981","Emerald","#10b981"],["#a78bfa","Violet","#a78bfa"],["#f43f5e","Crimson","#f43f5e"]]){let oe=B("",()=>{m=G,v()},"ls-color-swatch",Q);oe.dataset.colorVal=G,oe.style.background=se,C.append(oe)}v(),N.append(C),i.append(N);let u=e("div","ls-row-between ls-stat-cell");u.append(e("strong","","Enable Category & All Stats Inside It"));let g=e("div");u.append(g),me(t,o,g,{checked:c,ariaLabel:"Enable Category",onChange:(G)=>{c=G}}),i.append(u);let p=e("div","ls-grid");for(let[G,Q,se]of[["Show Category Header in HUD / Drawer",f,(oe)=>{f=oe}],["Collapse Group by Default",y,(oe)=>{y=oe}],["Include Category Stats & AI Rule in Story Continuity",P,(oe)=>{P=oe}]]){let oe=e("div");xe(t,o,oe,{checked:Q,label:G,onChange:se}),p.append(oe)}i.append(p);let h=e("div");i.append(h);let T=he(t,o,h,{title:"Shared Category AI Rule & Prompt Trigger",iconName:"sparkles",defaultExpanded:!0,persistKey:"modal_cat_ai_rule"});T.append(e("small","ls-muted","This rule is printed ONCE for the group alongside each member stat’s own individual rule (individual stat rules remain completely untouched)."));let l=e("div","ls-label","Group Prompt Frequency"),w=e("div");l.append(w),T.append(l);let M=e("label","ls-label","Group Trigger Keywords (comma-separated)"),R=e("input","ls-input");R.placeholder="e.g. attack, fight, hit, spell, bleed, dodge",R.value=(n?.promptKeywords??[]).join(", "),M.append(R),T.append(M);let A=()=>{M.style.display=S==="conditional"?"":"none"};A(),te(t,o,w,{value:S,ariaLabel:"Group Prompt Frequency",options:[{value:"always",label:"Always in Prompt"},{value:"conditional",label:"Only When Group Keywords Match"},{value:"manual",label:"Manual Sync Only"}],onChange:(G)=>{S=G,A()}});let E=e("div","ls-label"),D=e("div","ls-row-between"),F=e("textarea","ls-input");F.rows=3,F.value=n?.aiRule??"",F.placeholder="Describe shared delta ranges, combat multipliers, romance pacing, or roleplay behavior for stats in this category…",D.append(e("span","","Shared Category AI / Delta Rule"),B("⛶ Full-Screen Editor",()=>{t.request("textEditor:open",{title:`Category Rule: ${x.value||"Category"}`,value:F.value,placeholder:"Describe shared rules for this stat group…"}).then((G)=>{if(!G.cancelled&&typeof G.text==="string")F.value=G.text})},"ls-btn-sm")),E.append(D,F),T.append(E);let O=e("div");i.append(O);let V=he(t,o,O,{title:"Local Group Formula & Cross-Stat Modifiers (Optional)",iconName:"sliders",defaultExpanded:Boolean(n?.localRuleFormula),persistKey:"modal_cat_local_rule"});V.append(e("small","ls-muted",'Supports conditional modifiers `mod("stat_id", "Label", delta)` (auto-applies while true and clears when false) and `set("stat_id", expr)` / `if(cond) mod(...)`.'));let W=e("textarea","ls-input");W.rows=3,W.placeholder=`e.g.
mod("composure", "High Arousal", arousal >= 75 ? -10 : 0)
if(HP < HP_max * 0.5) mod("composure", "Wounded", -10)`,W.value=n?.localRuleFormula??"";let H=e("div","ls-formula-status"),j=e("strong","");H.append(j);let z=()=>{let G=wn({...n,id:n?.id,name:x.value.trim()||"Preview Category",localRuleFormula:W.value});if(!W.value.trim()){H.dataset.status="warn",j.textContent="No local group formula set (optional).";return}let Q=Fs(G,t.snapshot.state,s.stats,t.selectedActorId);if(Q.error)H.dataset.status="error",j.textContent=`✖ Error: ${Q.error}`;else if(Q.appliedEffects.length>0)H.dataset.status="ok",j.textContent=`✓ Active Effects: ${Q.appliedEffects.join(" · ")}`;else H.dataset.status="ok",j.textContent="✓ Valid formula (0 active modifiers triggered on current state)."};W.addEventListener("input",z),z(),V.append(W,H,B("▶ Test Group Formula",z,"ls-btn-sm"));let U=e("div");i.append(U);let K=he(t,o,U,{title:`Member Stats in This Category (${L.size})`,iconName:"stats",defaultExpanded:!0,persistKey:"modal_cat_members"}),X=e("div","ls-grid");for(let G of s.stats){let Q=e("div");xe(t,o,Q,{checked:L.has(G.id),label:`${G.icon} ${G.label} (${G.scope})`,onChange:(se)=>{if(se)L.add(G.id);else L.delete(G.id)}}),X.append(Q)}K.append(X);let J=e("div","ls-row-between");J.style.marginTop="12px";let Y=e("div","ls-row");if(n)Y.append(B("Delete Category",()=>{let G=a.filter((se)=>se.id!==n.id),Q=s.stats.map((se)=>se.categoryId===n.id?{...se,categoryId:void 0}:se);t.request("state:mutate",{templatePatch:{categories:G,stats:Q},reason:`Deleted category "${n.name}" (stats preserved)`}),r()},"ls-btn-sm ls-btn-danger"));let ne=B(n?"Save Category":"Create Category",()=>{let G=x.value.trim();if(!G)return;let Q=R.value.split(",").map((ce)=>ce.trim().toLowerCase()).filter(Boolean),se=wn({...n,id:n?.id,name:G,icon:I.value.trim()||"\uD83D\uDCC1",color:m,enabled:c,showGroupHeaderInHud:f,collapsedByDefault:y,injectInContinuity:P,promptTriggerMode:S,promptKeywords:Q,aiRule:F.value.trim()||void 0,localRuleFormula:W.value.trim()||void 0,order:n?.order??a.length}),oe=a.some((ce)=>ce.id===se.id)?a.map((ce)=>ce.id===se.id?se:ce):[...a,se],Se=s.stats.map((ce)=>{if(L.has(ce.id))return{...ce,categoryId:se.id};if(ce.categoryId===se.id)return{...ce,categoryId:void 0};return ce});t.request("state:mutate",{templatePatch:{categories:oe,stats:Se},reason:`Saved category "${se.name}"`}),r()},"ls-btn-primary");J.append(Y,ne),i.append(J)})}var pe="all",jn="",la=[{id:"present",label:"Present & Away",icon:"\uD83D\uDC65",scope:"scene",kind:"text",min:0,max:100,defaultValue:"Present: [], Away: []",volatility:"momentary",pinnedToHeader:!0,triggerCues:"Format: Present: [List NPCs present in the scene], Away: [List NPCs away/offscreen]. Update EVERY turn whenever anyone enters, leaves, or the scene moves to a new location."},{label:"Blush & Fluster",icon:"\uD83D\uDC93",scope:"character",kind:"meter",min:0,max:100,defaultValue:0,volatility:"momentary",triggerCues:"0–100 scale. Spikes immediately on teasing, eye contact, state of undress, or closeness; cools down in calm talk."},{label:"Jealousy & Possessiveness",icon:"\uD83D\uDD25",scope:"character",kind:"meter",min:0,max:100,defaultValue:10,volatility:"momentary",triggerCues:"0–100 scale. Rises when the player praises, flirts with, or prioritizes another rival."},{label:"Respect & Standing",icon:"\uD83D\uDC51",scope:"character",kind:"meter",min:0,max:100,defaultValue:50,volatility:"progressive",triggerCues:"0–100 scale. Rises when the player shows competence, poise, or backbone; drops on weakness."},{label:"Suspicion",icon:"\uD83D\uDD0D",scope:"character",kind:"meter",min:0,max:100,defaultValue:15,volatility:"progressive",triggerCues:"0–100 scale. Increases when catching inconsistencies, secrets, or unusual behavior."},{label:"Stamina & Energy",icon:"⚡",scope:"player",kind:"meter",min:0,max:100,defaultValue:100,volatility:"momentary",triggerCues:"0–100 scale. Spent during physical exertion, combat, or sleepless nights; restored by rest or meals."},{label:"Danger / Event Clock",icon:"⏱️",scope:"world",kind:"clock",min:0,max:6,defaultValue:0,volatility:"progressive",triggerCues:"0–6 segments. Advance by +1 segment as an approaching confrontation, deadline, or alarm draws closer."},{label:"Skill Tree & SP",icon:"\uD83C\uDF33",scope:"player",kind:"skill_tree",min:0,max:100,defaultValue:0,volatility:"progressive",triggerCues:'Format: "SP: N | Skill A (Lv.X/Y, cost:1, bonus) ; Skill B (Lv.X/Y, cost:1, req:Skill A)". Award SP on milestones.'},{label:"Level & XP",icon:"⭐",scope:"player",kind:"xp_level",min:0,max:100,defaultValue:0,volatility:"progressive",triggerCues:'Format: "Lv. N | cur/next XP | Rank X". Award XP on quests/battles; level up when cur >= next.'},{label:"Core Attributes",icon:"\uD83E\uDDEC",scope:"player",kind:"attributes",min:1,max:30,defaultValue:10,volatility:"anchor",triggerCues:'Comma-separated stats: "STR:N, DEX:N, CON:N, INT:N, WIS:N, CHA:N".'},{label:"Gear & Inventory",icon:"\uD83C\uDF92",scope:"player",kind:"inventory",min:0,max:100,defaultValue:0,volatility:"progressive",triggerCues:'Separate items by "; " with qty & rarity tags: "Runed Blade [rare, equipped] ; Potion x3 [common]".'},{label:"Buffs & Debuffs",icon:"⚡",scope:"player",kind:"status_fx",min:0,max:100,defaultValue:0,volatility:"momentary",triggerCues:'Prefix buffs with "+" and debuffs with "-" separated by "; ", e.g. "+Shielded (2t) ; -Exhausted (1t)".'},{label:"Gold / Credits",icon:"\uD83E\uDE99",scope:"player",kind:"currency",min:0,max:99999999,defaultValue:100,volatility:"progressive",triggerCues:"Track currency. Emit +N / -N on rewards, loot, or spending."}],ca=[{id:"player_attire",group:"player"},{id:"player_condition",group:"player"},{id:"player_action",group:"player"},{id:"scene_summary",group:"scene_world"},{id:"scene_presence",group:"scene_world"},{id:"places",group:"scene_world"},{id:"quests",group:"scene_world"},{id:"dispatches",group:"scene_world"},{id:"npc_conditions",group:"character"},{id:"npc_secrets",group:"character"}];function da(t,n,s,a,i){let r=e("div","ls-stack"),d=e("div","ls-row-between"),o=e("input","ls-input");o.style.cssText="flex:1 1 220px;min-width:160px;",o.placeholder="Search stats, meters, built-ins, or dossier fields…",o.value=jn;let c=e("div","ls-row");c.append(ee("flask",()=>Ze(t),{label:"Test Sandbox",className:"ls-btn-sm"}),ee("plus",()=>rn(t),{label:"New Category",className:"ls-btn-sm",title:"Create a custom Stat Category with shared AI/local rules"}),ee("plus",()=>Ce(t,"character"),{label:"New Stat",className:"ls-btn-sm ls-btn-primary"})),d.append(o,c),r.append(d);let f=e("div","ls-subnav-pills");for(let[k,_]of[["all","All Trackers"],["categories",`Categories (${(s.categories??[]).length})`],["character","NPC Meters"],["player","Player Stats"],["scene_world","Scene & World"],["builtin","Built-Ins & Pill"],["dossier","Dossier Fields"]]){let I=B(_,()=>{pe=k,i()},"ls-btn-sm");if(pe===k)I.setAttribute("aria-current","page");f.append(I)}r.append(f);let y=e("div");r.append(y);let P=he(t,n,y,{title:"1-Click Quick-Add Popular Stats",iconName:"sparkles",badge:la.length,defaultExpanded:!1,persistKey:"studio_stats_quick_add"}),m=e("div","ls-row");for(let k of la){let _=k.id??le(k.label,"stat"),I=s.stats.some((x)=>x.id===_),b=B(`${I?"✓ ":"+ "}${k.icon} ${k.label}`,()=>{let x=re({...k.id?{id:k.id}:{},label:k.label,icon:k.icon,scope:k.scope,kind:k.kind,min:k.min,max:k.max,defaultValue:k.defaultValue,volatility:k.volatility,...k.pinnedToHeader?{pinnedToHeader:!0}:{},triggerCues:k.triggerCues});a((N)=>({stats:[...N.stats.filter((C)=>C.id!==x.id),x]}),`Added stat "${x.label}"`),t.notify(`Added "${x.icon} ${x.label}".`)},`ls-btn-sm ls-quick-pill ${I?"ls-chip-accent":""}`,k.triggerCues);m.append(b)}P.append(m);let S=e("div","ls-stack");r.append(S);let L=()=>{S.replaceChildren();let k=jn.trim().toLowerCase(),_=(p)=>!k||p.toLowerCase().includes(k);if((pe==="all"||pe==="scene_world"||pe==="builtin")&&_("scene pill location time date weather clock")){let p=e("div","ls-stat-row-compact");p.style.borderLeft="3px solid var(--ls-primary)";let h=e("div","ls-row");h.append(e("strong","","\uD83D\uDCCD Scene Pill (Location, Time, Date, Weather)"),e("span","ls-chip ls-chip-accent",s.coreTrackers?.scenePillLocked?"\uD83D\uDD12 Locked":"Built-In Pill"));let T=e("div","ls-row");T.append(B("Full Edit & Prompts",()=>Ae(t),"ls-btn-sm ls-btn-primary")),p.append(h,T),S.append(p)}let I=(p)=>{let h=e("div","ls-stat-row-compact");h.style.borderLeft=`3px solid ${p.color||"var(--ls-primary)"}`;let T=e("div","ls-row");T.style.minWidth="0";let l=e("div");me(t,n,l,{checked:p.enabled,ariaLabel:`Toggle ${p.label}`,onChange:(D)=>{a((F)=>({stats:F.stats.map((O)=>O.id===p.id?{...O,enabled:D}:O)}))}});let M=!Lt(p)&&p.kind!=="boolean"?`${p.kind} (${p.min}–${p.max})`:p.kind,R=p.scope==="character"?"NPC":p.scope,A=p.calculationMode==="ai_plus_local"?"\uD83D\uDD00 Hybrid":p.calculationMode==="local_formula"||Boolean(p.formula?.trim())&&p.calculationMode!=="ai"?"⚡ Local":"\uD83E\uDD16 AI";T.append(l,e("strong","",`${p.icon} ${p.label}`),e("span","ls-chip",`${R} · ${M}`),e("span",`ls-chip ${A!=="\uD83E\uDD16 AI"?"ls-chip-accent":""}`,A),...p.promptTriggerMode==="conditional"?[e("span","ls-chip","\uD83D\uDD0D Conditional")]:[],...p.pinnedToHeader?[e("span","ls-chip ls-chip-accent","Pinned")]:[],...p.locked?[e("span","ls-chip","\uD83D\uDD12")]:[]);let E=e("div","ls-row");return E.style.flex="none",E.append(B("Full Edit",()=>Ce(t,p.scope,p),"ls-btn-sm"),ee("trash",()=>{a((D)=>({stats:D.stats.filter((F)=>F.id!==p.id)}),`Deleted stat "${p.label}"`),t.notify(`Deleted "${p.icon} ${p.label}".`)},{className:"ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger",title:`Delete "${p.label}"`}),ee("more",async(D)=>{if(typeof t.ctx.ui?.showContextMenu!=="function"){Ce(t,p.scope,p);return}let{selectedKey:F}=await t.ctx.ui.showContextMenu({position:{x:D.clientX,y:D.clientY},items:[{key:"edit",label:"Full Edit (Style, Tabs & AI Prompt)"},{key:"pin",label:p.pinnedToHeader?"Unpin from Pill":"Pin to Scene Pill",active:p.pinnedToHeader},{key:"lock",label:p.locked?"Unlock Value":"Lock Value",active:p.locked},{key:"duplicate",label:"Duplicate to Another Scope / Tab…"},{key:"test",label:"Test in AI Sandbox"},{key:"div",label:"",type:"divider"},{key:"delete",label:"Delete Stat",danger:!0}]});if(F==="edit")Ce(t,p.scope,p);else if(F==="pin")a((O)=>({stats:O.stats.map((V)=>V.id===p.id?{...V,pinnedToHeader:!V.pinnedToHeader,showIn:{...V.showIn,pinnedHeader:!V.pinnedToHeader}}:V)}));else if(F==="lock")a((O)=>({stats:O.stats.map((V)=>V.id===p.id?{...V,locked:!V.locked}:V)}));else if(F==="duplicate")Oe(t,p);else if(F==="test")Ze(t,p.id);else if(F==="delete")a((O)=>({stats:O.stats.filter((V)=>V.id!==p.id)}))},{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:"More actions"})),h.append(T,E),h},b=[...s.categories??[]].sort((p,h)=>p.order-h.order),x=new Set(b.map((p)=>p.id)),N=s.stats.filter((p)=>{if(pe==="dossier"||pe==="builtin")return!1;if(pe==="character"&&p.scope!=="character")return!1;if(pe==="player"&&p.scope!=="player")return!1;if(pe==="scene_world"&&p.scope!=="world"&&p.scope!=="scene")return!1;return _(`${p.label} ${p.id} ${p.kind} ${p.triggerCues}`)});if(pe==="categories"&&b.length===0){let p=e("section","ls-card");p.append(e("strong","","No custom categories created yet"),e("p","ls-muted","Group related stats (e.g. Combat & Power, Romance, Finances) to attach shared AI delta rules, group keyword triggers, or cross-stat local modifiers—while keeping each stat’s own rules intact."),B("+ Create First Category",()=>rn(t),"ls-btn-sm ls-btn-primary")),S.append(p)}for(let p of b){let h=N.filter((A)=>A.categoryId===p.id);if(pe!=="categories"&&h.length===0&&k)continue;if(pe!=="all"&&pe!=="categories"&&h.length===0)continue;let T=e("section","ls-card ls-cat-group");T.style.borderLeft=`3px solid ${p.color||"var(--ls-primary)"}`;let l=e("div","ls-row-between"),w=e("div","ls-row"),M=e("div");me(t,n,M,{checked:p.enabled,ariaLabel:`Toggle category ${p.name}`,onChange:(A)=>{a((E)=>({categories:(E.categories??[]).map((D)=>D.id===p.id?{...D,enabled:A}:D)}))}}),w.append(M,e("strong","",`${p.icon} ${p.name}`),e("span","ls-chip",`${h.length} stats`),...p.aiRule?[e("span","ls-chip ls-chip-accent","Shared Rule")]:[],...p.localRuleFormula?[e("span","ls-chip ls-chip-accent","⚡ Local Rule")]:[],...p.promptTriggerMode==="conditional"?[e("span","ls-chip","\uD83D\uDD0D Conditional")]:[]);let R=e("div","ls-row");if(R.append(B("Edit Group & Rules",()=>rn(t,p),"ls-btn-sm")),l.append(w,R),T.append(l),h.length>0){let A=e("div");T.append(A);let E=he(t,n,A,{title:`Member Stats (${h.length})`,defaultExpanded:!p.collapsedByDefault,persistKey:`studio_cat_${p.id}`});for(let D of h)E.append(I(D))}else T.append(e("small","ls-muted",'No stats assigned to this category yet. Click "Edit Group & Rules" to assign stats.'));S.append(T)}let C=N.filter((p)=>!p.categoryId||!x.has(p.categoryId));if(C.length>0&&pe!=="categories"){let p=e("section","ls-card"),h=e("div","ls-row-between");h.append(e("h3","",b.length>0?`Uncategorized Stats (${C.length})`:`Stats & Meters (${C.length})`),e("span","ls-muted","Click Full Edit to customize prompt, category, style & formula")),p.append(h);for(let T of C)p.append(I(T));S.append(p)}let v=ca.filter((p)=>Boolean(s.coreTrackers?.overrides?.[p.id]?.deleted)).length,u=ca.filter((p)=>{if(pe==="dossier")return!1;if(pe!=="all"&&pe!=="builtin"&&p.group!==pe)return!1;let h=Re(s.coreTrackers,p.id);if(h.deleted)return!1;return _(`${p.id} ${h.label} ${h.instruction}`)});if(u.length>0||v>0&&(pe==="all"||pe==="builtin")){let p=e("section","ls-card"),h=e("div","ls-row-between"),T=e("div","ls-row");if(v>0)T.append(B(`↺ Restore Deleted (${v})`,()=>{a((M)=>{let R={...M.coreTrackers?.overrides??{}};for(let A of Object.keys(R))if(R[A]?.deleted)R[A]={...R[A],deleted:!1};return{coreTrackers:{...M.coreTrackers??{},overrides:R}}},"Restored deleted built-in trackers")},"ls-btn-sm ls-btn-ghost"));else T.append(e("span","ls-muted","Editable labels, prompts, styles & tabs"));h.append(e("h3","",`Built-In Story Trackers (${u.length})`),T),p.append(h);let l={player_attire:"trackPlayerAttire",player_condition:"trackPlayerCondition",player_action:"trackPlayerAction",scene_summary:"trackSceneSummary",scene_presence:"trackScenePresence",places:"trackPlaces",quests:"trackQuests",dispatches:"trackDispatches",npc_conditions:"trackNpcConditions",npc_secrets:"trackNpcSecrets"},w={player_attire:"showPlayerAttireCard",player_condition:"showPlayerConditionCard",player_action:"showPlayerActionCard",scene_summary:"showSceneSummaryInWidget",quests:"showQuestsInWidget",dispatches:"showDispatchesInWidget"};for(let M of u){let R=Re(s.coreTrackers,M.id),A=e("div","ls-stat-row-compact");A.style.borderLeft=`3px solid ${R.color||"var(--ls-primary)"}`;let E=e("div","ls-row"),D=e("div");me(t,n,D,{checked:R.enabled,ariaLabel:`Toggle ${R.label}`,onChange:(O)=>{a((V)=>{let W={...V.coreTrackers??{}};return W[l[M.id]]=O,{coreTrackers:W}})}}),E.append(D,e("strong","",`${R.icon||"\uD83D\uDCCA"} ${R.label}`),e("span","ls-chip","Built-In"),...R.locked?[e("span","ls-chip","\uD83D\uDD12")]:[]);let F=e("div","ls-row");F.append(B("Full Edit",()=>Qt(t,M.id),"ls-btn-sm"),ee("trash",()=>{a((O)=>{let V={...O.coreTrackers??{}};V[l[M.id]]=!1;let W=w[M.id];if(W)V[W]=!1;let H=V.overrides??{};return V.overrides={...H,[M.id]:{...H[M.id]??{},deleted:!0}},{coreTrackers:V}},`Deleted built-in tracker "${R.label}"`),t.notify(`Removed "${R.label}".`)},{className:"ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger",title:`Remove "${R.label}"`})),A.append(E,F),p.append(A)}S.append(p)}let g=s.dossierFields.filter((p)=>{if(pe!=="all"&&pe!=="dossier"&&pe!=="character")return!1;return _(`${p.label} ${p.id} ${p.instruction}`)});if(g.length>0||pe==="dossier"){let p=e("section","ls-card"),h=e("div","ls-row-between");h.append(e("h3","",`Character Dossier Fields (${g.length})`),e("div","ls-row")),h.lastElementChild.append(B("Restore Defaults",()=>{a({dossierFields:St()},"Restored default dossier fields")},"ls-btn-sm ls-btn-ghost"),ee("plus",()=>Qe(t),{label:"New Field",className:"ls-btn-sm ls-btn-primary"})),p.append(h);for(let T of g){let l=e("div","ls-stat-row-compact");l.style.borderLeft=`3px solid ${T.color||"var(--ls-primary)"}`;let w=e("div","ls-row"),M=e("div");me(t,n,M,{checked:T.enabled,ariaLabel:`Toggle ${T.label}`,onChange:(A)=>{a((E)=>({dossierFields:E.dossierFields.map((D)=>D.id===T.id?{...D,enabled:A}:D)}))}}),w.append(M,e("strong","",`${T.icon} ${T.label}`),e("span","ls-chip",`Dossier · ${T.displayStyle||"card"}`));let R=e("div","ls-row");R.append(B("Full Edit",()=>Qe(t,T),"ls-btn-sm"),ee("trash",()=>{a((A)=>({dossierFields:A.dossierFields.filter((E)=>E.id!==T.id)}))},{className:"ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger",title:"Delete field"})),l.append(w,R),p.append(l)}S.append(p)}};return o.addEventListener("input",()=>{jn=o.value,L()}),L(),r}var Nt="tabs";function pa(t,n,s,a,i){let r=e("div","ls-stack"),d=e("div","ls-subnav-pills");for(let[o,c]of[["tabs","1. Widget & Inline Tabs"],["dossier","2. Dossier Tabs"],["matrix","3. Stat Placement Matrix"],["banners","4. Scene Pill & Custom HTML"]]){let f=B(c,()=>{Nt=o,i()},"ls-btn-sm");if(Nt===o)f.setAttribute("aria-current","page");d.append(f)}if(r.append(d),Nt==="tabs"){let o=e("section","ls-card");o.append(e("h3","","Relationship Web & Peer Bonds"));let c=e("div","ls-grid");for(let[y,P]of[["showRelationshipWeb","Enable Relationship Web Tab"],["trackNpcBonds","Track NPC↔NPC Peer Bonds"]]){let m=e("div");xe(t,n,m,{checked:s.surfaces[y]!==!1,label:P,onChange:(S)=>a((L)=>({surfaces:{...L.surfaces,[y]:S}}))}),c.append(m)}o.append(c),r.append(o);let f=(y,P,m)=>{let S=e("section","ls-card");S.append(e("h3","",y));let L=[...m].sort((x,N)=>x.order-N.order),k=(x)=>{a((N)=>{let C=[...N.surfaces[P]].sort((v,u)=>v.order-u.order);return{surfaces:{...N.surfaces,[P]:x(C)}}})};L.forEach((x,N)=>{let C=e("div","ls-stat-row-compact"),v=e("div","ls-row"),u=e("div");me(t,n,u,{checked:x.enabled,ariaLabel:`Toggle ${x.label}`,onChange:(l)=>{k((w)=>w.map((M)=>M.id===x.id?{...M,enabled:l}:M))}});let g=e("input","ls-input");g.style.cssText="width:44px;min-height:28px;padding:2px 6px;",g.value=x.icon,g.addEventListener("change",()=>{let l=g.value.trim()||"\uD83D\uDCCA";k((w)=>w.map((M)=>M.id===x.id?{...M,icon:l}:M))});let p=e("input","ls-input");p.style.cssText="width:130px;min-height:28px;padding:2px 8px;",p.value=x.label,p.addEventListener("change",()=>{let l=p.value.trim()||x.label;k((w)=>w.map((M)=>M.id===x.id?{...M,label:l}:M))});let h=e("div");te(t,n,h,{value:x.kind,compact:!0,ariaLabel:"Surface Tab Kind",options:[{value:"stats",label:"Stats Grid"},{value:"cast",label:"Cast List"},{value:"web",label:"Bond Web"},{value:"map",label:"Spatial Atlas"},{value:"world",label:"World & Clocks"},{value:"custom",label:"Custom Tab"}],onChange:(l)=>{k((w)=>w.map((M)=>M.id===x.id?{...M,kind:l}:M))}}),v.append(u,g,p,h);let T=e("div","ls-row");if(N>0)T.append(B("↑",()=>{k((l)=>{let w=l.findIndex((R)=>R.id===x.id);if(w<=0)return l;let M=[...l];return[M[w-1],M[w]]=[M[w],M[w-1]],M.map((R,A)=>({...R,order:A}))})},"ls-btn-sm ls-btn-icon ls-btn-ghost"));if(N<L.length-1)T.append(B("↓",()=>{k((l)=>{let w=l.findIndex((R)=>R.id===x.id);if(w<0||w>=l.length-1)return l;let M=[...l];return[M[w],M[w+1]]=[M[w+1],M[w]],M.map((R,A)=>({...R,order:A}))})},"ls-btn-sm ls-btn-icon ls-btn-ghost"));if(L.length>1)T.append(ee("trash",()=>k((l)=>l.filter((w)=>w.id!==x.id)),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger",title:"Delete tab"}));C.append(v,T),S.append(C)});let _=e("div","ls-row"),I=e("input","ls-input");I.style.width="50px",I.value="✨";let b=e("input","ls-input");return b.style.flex="1",b.placeholder="New tab name (e.g. Gear, Plans, Clues)…",_.append(I,b,ee("plus",()=>{let x=b.value.trim();if(!x)return;let N=I.value.trim()||"✨";k((C)=>[...C,{id:le(x,`tab_${C.length+1}`),label:x,icon:N,kind:"custom",enabled:!0,order:C.length}])},{label:"Add Tab",className:"ls-btn-sm ls-btn-primary"})),S.append(_),S};r.append(f("Floating HUD Widget Tabs","widgetTabs",s.surfaces.widgetTabs),f("Inline Message Ribbon Tabs","inlineTabs",s.surfaces.inlineTabs))}else if(Nt==="dossier"){let o=e("section","ls-card");o.append(e("h3","","Character Dossier Tabs"));let c=[...s.surfaces.dossierTabs].sort((m,S)=>m.order-S.order);c.forEach((m,S)=>{let L=e("div","ls-stat-cell"),k=e("div","ls-row-between"),_=e("div","ls-row"),I=(u)=>{a((g)=>{let p=[...g.surfaces.dossierTabs].sort((h,T)=>h.order-T.order);return{surfaces:{...g.surfaces,dossierTabs:u(p)}}})},b=e("div");me(t,n,b,{checked:m.enabled,onChange:(u)=>{I((g)=>g.map((p)=>p.id===m.id?{...p,enabled:u}:p))}});let x=e("input","ls-input");x.style.cssText="width:44px;min-height:28px;padding:2px 6px;",x.value=m.icon,x.addEventListener("change",()=>{let u=x.value.trim()||"\uD83E\uDEAA";I((g)=>g.map((p)=>p.id===m.id?{...p,icon:u}:p))});let N=e("input","ls-input");N.style.cssText="width:150px;min-height:28px;padding:2px 8px;",N.value=m.label,N.addEventListener("change",()=>{let u=N.value.trim()||m.label;I((g)=>g.map((p)=>p.id===m.id?{...p,label:u}:p))}),_.append(b,x,N);let C=e("div","ls-row");if(S>0)C.append(B("↑",()=>{I((u)=>{let g=u.findIndex((h)=>h.id===m.id);if(g<=0)return u;let p=[...u];return[p[g-1],p[g]]=[p[g],p[g-1]],p.map((h,T)=>({...h,order:T}))})},"ls-btn-sm ls-btn-icon ls-btn-ghost"));if(S<c.length-1)C.append(B("↓",()=>{I((u)=>{let g=u.findIndex((h)=>h.id===m.id);if(g<0||g>=u.length-1)return u;let p=[...u];return[p[g],p[g+1]]=[p[g+1],p[g]],p.map((h,T)=>({...h,order:T}))})},"ls-btn-sm ls-btn-icon ls-btn-ghost"));if(c.length>1)C.append(ee("trash",()=>I((u)=>u.filter((g)=>g.id!==m.id)),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger",title:"Delete dossier tab"}));k.append(_,C),L.append(k);let v=e("div","ls-row");for(let[u,g]of[["showMeters","Meters"],["showNpcBonds","Peer Bonds"],["showFields","Fields"],["showSecrets","Secrets"],["showAudit","Audit Log"]]){let p=e("div");xe(t,n,p,{checked:Boolean(m[u]),label:g,onChange:(h)=>{I((T)=>T.map((l)=>l.id===m.id?{...l,[u]:h}:l))}}),v.append(p)}L.append(v),o.append(L)});let f=e("div","ls-row"),y=e("input","ls-input");y.style.width="50px",y.value="⚔️";let P=e("input","ls-input");P.style.flex="1",P.placeholder="New Dossier Tab (e.g. Combat Arts, Wardrobe)…",f.append(y,P,ee("plus",()=>{let m=P.value.trim();if(!m)return;let S=y.value.trim()||"✨";a((L)=>{let k=[...L.surfaces.dossierTabs].sort((I,b)=>I.order-b.order),_={id:le(m,`dtab_${k.length+1}`),label:m,icon:S,kind:"custom",enabled:!0,order:k.length,showMeters:!0,showFields:!0,showSecrets:!1,showAudit:!1,showNpcBonds:!1};return{surfaces:{...L.surfaces,dossierTabs:[...k,_]}}})},{label:"Add Dossier Tab",className:"ls-btn-sm ls-btn-primary"})),o.append(f),r.append(o)}else if(Nt==="matrix"){let o=e("section","ls-card");o.append(e("h3","","Stat Placement Matrix"),e("p","ls-muted","Choose which surfaces and tabs display each stat."));let c=[...s.surfaces.dossierTabs].sort((f,y)=>f.order-y.order);for(let f of s.stats){let y=e("div","ls-stat-cell"),P=e("div","ls-row-between"),m=e("div","ls-row");m.append(ee("copy",()=>Oe(t,f),{label:"Duplicate",className:"ls-btn-sm ls-btn-ghost"}),ee("edit",()=>Ce(t,f.scope,f),{label:"Edit",className:"ls-btn-sm"})),P.append(e("strong","",`${f.icon} ${f.label} (${f.scope})`),m),y.append(P);let S=e("div","ls-row");for(let[I,b]of[["widget","Widget"],["inline","Inline"],["dossier","Dossier"],["pinnedHeader","Pill"]]){let x=e("div");xe(t,n,x,{checked:Boolean(f.showIn?.[I]),label:b,onChange:(N)=>{a((C)=>({stats:C.stats.map((v)=>v.id===f.id?{...v,showIn:{...v.showIn,[I]:N},...I==="pinnedHeader"?{pinnedToHeader:N}:{}}:v)}))}}),S.append(x)}let L=e("div");te(t,n,L,{value:f.widgetTabId||(f.scope==="character"?"cast":"stats"),compact:!0,ariaLabel:"Widget Tab",options:s.surfaces.widgetTabs.map((I)=>({value:I.id,label:`Widget: ${I.label}`})),onChange:(I)=>{a((b)=>({stats:b.stats.map((x)=>x.id===f.id?{...x,widgetTabId:I}:x)}))}});let k=e("div");te(t,n,k,{value:f.inlineTabId||(f.scope==="character"?"cast":"stats"),compact:!0,ariaLabel:"Inline Tab",options:s.surfaces.inlineTabs.map((I)=>({value:I.id,label:`Inline: ${I.label}`})),onChange:(I)=>{a((b)=>({stats:b.stats.map((x)=>x.id===f.id?{...x,inlineTabId:I}:x)}))}});let _=e("div");te(t,n,_,{value:f.dossierTabId||"bonds",compact:!0,ariaLabel:"Dossier Tab",options:c.map((I)=>({value:I.id,label:`Dossier: ${I.label}`})),onChange:(I)=>{a((b)=>({stats:b.stats.map((x)=>x.id===f.id?{...x,dossierTabId:I}:x)}))}}),S.append(L,k,_),y.append(S),o.append(y)}r.append(o)}else{let o=e("section","ls-card"),c=e("div","ls-row-between");c.append(e("h3","","Scene Pill Chips & Custom HTML Banners"),B("Edit Scene Pill Prompts",()=>Ae(t),"ls-btn-sm ls-btn-primary")),o.append(c,e("p","ls-muted","Custom banners support {{location}}, {{time}}, {{date}}, {{weather}}, {{player_attire}}, {{name}}, and {{stat:id}}."));let f=e("div","ls-grid");for(let[S,L]of[["time","Time Chip"],["date","Date Chip"],["location","Location Chip"],["weather","Weather Chip"],["cast","Present Cast Chips"],["pinnedStats","Pinned Stat Chips"]]){let k=e("div");xe(t,n,k,{checked:s.theme.showSceneChips[S],label:L,onChange:(_)=>{a((I)=>({theme:{...I.theme,showSceneChips:{...I.theme.showSceneChips,[S]:_}}}))}}),f.append(k)}o.append(f);let y=e("textarea","ls-input");y.rows=2,y.placeholder="Custom Widget HTML Banner…",y.value=s.surfaces.customWidgetHtml||"";let P=e("textarea","ls-input");P.rows=2,P.placeholder="Custom Inline Ribbon HTML Banner…",P.value=s.surfaces.customInlineHtml||"";let m=e("textarea","ls-input");m.rows=2,m.placeholder="Custom Character Dossier HTML Banner…",m.value=s.surfaces.customDossierHtml||"",o.append(y,P,m,B("Apply Custom HTML Banners",()=>{a((S)=>({surfaces:{...S.surfaces,customWidgetHtml:y.value.trim(),customInlineHtml:P.value.trim(),customDossierHtml:m.value.trim()}}))},"ls-btn-sm ls-btn-primary")),r.append(o)}return r}function ua(t,n,s,a,i,r){let{state:d}=t.snapshot,o=e("div","ls-stack"),c=t.customTemplates.filter((A)=>!t.builtinTemplates.some((E)=>E.id===A.id)),f=c.length+t.builtinTemplates.length,y=e("section","ls-card"),P=e("div","ls-row-between"),m=e("div");m.append(e("span","ls-kicker","Template Gallery"),e("h3","",`Saved & Built-In Templates (${f})`));let S=e("div","ls-row");S.append(ee("plus",()=>Tt(t,r),{label:"New Template",className:"ls-btn-sm ls-btn-primary"}),B("Import .json",()=>{t.ctx.uploads.pickFile({accept:[".json","application/json"],multiple:!1,maxSizeBytes:2500000}).then(async(A)=>{let E=A[0];if(!E)return;let D=new TextDecoder().decode(E.bytes);await t.request("template:importJson",{json:D}),t.notify(`Imported & activated template from ${E.name}.`)}).catch((A)=>t.notify(A instanceof Error?A.message:String(A),!0))},"ls-btn-sm")),P.append(m,S),y.append(P);let L=(A,E)=>{let D=A.id===s.id,F=e("div","ls-preset-card");F.dataset.active=String(D);let O=e("div","ls-stack");O.style.gap="5px";let V=e("div","ls-row-between");V.append(e("strong","",`${A.icon} ${A.name}`),e("span",`ls-chip ${E?"ls-chip-accent":""}`,E?"Saved Custom":"Built-In"));let W=e("div","ls-row"),H=A.stats.filter((U)=>U.scope==="character").length,j=A.stats.filter((U)=>U.scope!=="character").length;W.append(e("span","ls-chip",`${H} NPC meters`),e("span","ls-chip",`${j} stats`)),O.append(V,e("p","ls-muted",A.description),W);let z=e("div","ls-row");if(D)z.append(e("span","ls-chip ls-chip-accent","✓ Active"));else{let U=B("Activate",()=>{U.disabled=!0,U.textContent="Applying…",t.request("template:apply",{templateId:A.id,template:A}).then(()=>{t.notify(`Activated "${A.name}"!`)}).catch((K)=>{if(t.notify(K instanceof Error?K.message:String(K),!0),U.isConnected)U.disabled=!1,U.textContent="Activate"})},"ls-btn-sm ls-btn-primary");z.append(U)}if(z.append(ee("copy",()=>i(A),{label:"Copy & Edit",className:"ls-btn-sm",title:"Create an editable copy of this template"})),E)z.append(ee("trash",()=>{t.modals.confirm({title:"Delete Saved Template?",message:`Remove "${A.name}" from your Template Library?`,confirmLabel:"Delete",variant:"danger"}).then((U)=>{if(!U)return;t.request("template:deleteFromLibrary",{templateId:A.id}).then(()=>t.notify(`Deleted "${A.name}" from library.`)).catch((K)=>t.notify(K instanceof Error?K.message:String(K),!0))})},{className:"ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger",title:"Delete from library"}));return F.append(O,z),F};if(y.append(e("span","ls-kicker",`Saved Custom Templates (${c.length})`)),c.length>0){let A=e("div","ls-grid");for(let E of c)A.append(L(E,!0));y.append(A)}else y.append(e("p","ls-muted",'No saved custom templates yet. Click "+ New Template", "Save to Library", or "Copy & Edit" on any preset below.'));y.append(e("span","ls-kicker",`Built-In Presets (${t.builtinTemplates.length})`));let k=e("div","ls-grid");for(let A of t.builtinTemplates)k.append(L(A,!1));y.append(k),o.append(y);let _=e("section","ls-card");_.append(e("span","ls-kicker","Display & Prompt Placement"),e("h3","","Where Lumi Stats Appears"));let I=e("div","ls-row");for(let[A,E]of[["both_bottom","HUD + Below Reply"],["both_top","HUD + Above Reply"],["inline_bottom","Below Reply Only"],["floating_only","Floating HUD Only"]]){let D=B(E,()=>{a({theme:{...t.snapshot.template.theme,placement:A}})},"ls-btn-sm");if(s.theme.placement===A)D.setAttribute("aria-current","page");I.append(D)}_.append(I);let b=e("div","ls-row");b.append(e("small","ls-muted","AI Prompt Injection:"));for(let[A,E]of[["pre_history","Before History"],["in_history","Within History"],["post_history","After History"]]){let D=B(E,()=>{a({promptPosition:A},`Set prompt position to ${A}`)},"ls-btn-sm");if((s.promptPosition||"post_history")===A)D.setAttribute("aria-current","page");b.append(D)}if(s.promptPosition==="in_history"){let A=Math.max(0,Math.round(Number(s.promptDepth??1)||0)),E=e("input","ls-input");E.type="number",E.min="0",E.max="20",E.style.cssText="width:68px;min-height:26px;padding:2px 6px;",E.value=String(A),E.addEventListener("change",()=>{let D=Math.max(0,Math.min(20,Math.round(Number(E.value)||0)));a({promptDepth:D})}),b.append(e("small","ls-muted","Depth:"),E)}_.append(b),o.append(_);let x=e("div");o.append(x);let N=he(t,n,x,{title:"Appearance, Skins, Frame Shapes & Widget Size",iconName:"palette",defaultExpanded:!1,persistKey:"studio_templates_skin"}),C=e("div","ls-row");C.append(e("small","ls-muted","1-Click Skins:"));for(let A of zt){let E=B(A.name,()=>t.applySkinPack(A),"ls-btn-sm");if((s.theme.surfaceStyle||"glass")===A.surfaceStyle)E.setAttribute("aria-current","page");C.append(E)}C.append(B("Import Skin",()=>{t.ctx.uploads.pickFile({accept:[".json","application/json"],multiple:!1,maxSizeBytes:500000}).then((A)=>{let E=A[0];if(!E)return;let D=JSON.parse(new TextDecoder().decode(E.bytes));t.applySkinPack(D)})},"ls-btn-sm ls-btn-ghost"),B("Export Skin",()=>{let A=ks(s),E=new Blob([JSON.stringify(A,null,2)],{type:"application/json"}),D=URL.createObjectURL(E),F=document.createElement("a");F.href=D,F.download=`${le(s.name,"lumi_skin")}.lumi-skin.json`,document.body.append(F),F.click(),F.remove(),URL.revokeObjectURL(D)},"ls-btn-sm ls-btn-ghost")),N.append(C);let v=e("div","ls-row-between ls-stat-cell");v.append(e("strong","","Collapsed Pill Skin (10 Designs)"));let u=e("div");u.style.minWidth="230px",v.append(u),te(t,n,u,{value:s.theme.pillStyle||"glass_capsule",ariaLabel:"Collapsed Pill Skin",options:[{value:"glass_capsule",label:"✨ Frosted Split Capsule (Default Best)"},{value:"vn_dialogue_bar",label:"\uD83C\uDFAC VN Cinema Strip"},{value:"rpg_status_bar",label:"⚔️ JRPG Party Status Bar"},{value:"persona_ticker",label:"\uD83C\uDCCF Stylish Pop Ticker"},{value:"cyber_telemetry",label:"\uD83D\uDEF8 Cyber Telemetry"},{value:"minimal_floating",label:"☁️ Minimal Ghost Pill"},{value:"neon_edge",label:"⚡ Neon Glow Rail"},{value:"split_deck",label:"\uD83D\uDDC2️ Dual-Deck Card Pill"},{value:"compact_badge",label:"\uD83D\uDCF1 Micro Compact Badge"},{value:"ledger_strip",label:"\uD83D\uDCDC Editorial Case Strip"}],onChange:(A)=>{a({theme:{...t.snapshot.template.theme,pillStyle:A}})}}),N.append(v);let g=e("div","ls-row");g.append(e("small","ls-muted","Base Surface:"));for(let[A,E]of[["glass","Auto Glass"],["soft","Soft Card"],["sleek","Sleek Dark"],["minimal","Minimal"],["neon","Neon"],["arcane_rpg","Arcane RPG"],["cyber_hud","Cyber HUD"],["persona_pop","Pop Sim"],["cozy_vn","Cozy VN"]]){let D=B(E,()=>{a({theme:{...t.snapshot.template.theme,surfaceStyle:A}})},"ls-btn-sm");if((s.theme.surfaceStyle||"glass")===A)D.setAttribute("aria-current","page");g.append(D)}let p=e("div","ls-row");p.append(e("small","ls-muted","Frame & Bars:"));for(let[A,E]of[["rounded","Rounded"],["chamfered","Angled"],["ornate","Ornate"],["sharp","Sharp"]]){let D=B(E,()=>{a({theme:{...t.snapshot.template.theme,frameShape:A}})},"ls-btn-sm");if((s.theme.frameShape||"rounded")===A)D.setAttribute("aria-current","page");p.append(D)}for(let[A,E]of[["smooth","Gradient Bar"],["segmented","Segmented Bar"],["glow","Neon Glow Bar"]]){let D=B(E,()=>{a({theme:{...t.snapshot.template.theme,meterStyle:A}})},"ls-btn-sm");if((s.theme.meterStyle||"smooth")===A)D.setAttribute("aria-current","page");p.append(D)}let h=e("div","ls-row");h.append(e("small","ls-muted","Accent Color:"));for(let[A,E]of[[void 0,"Theme Default"],[198,"Cyan"],[330,"Rose"],[38,"Gold"],[158,"Emerald"],[262,"Violet"],[350,"Crimson"]]){let D=B(E,()=>{a({theme:{...t.snapshot.template.theme,accentHue:A}})},"ls-btn-sm");if(s.theme.accentHue===A)D.setAttribute("aria-current","page");h.append(D)}let T=e("div","ls-grid"),l=(A,E,D,F,O)=>{let V=e("label","ls-label",A),W=e("input","ls-input");return W.type="number",W.min=String(D),W.max=String(F),W.value=String(E),W.addEventListener("change",()=>{O(Math.max(D,Math.min(F,Number(W.value)||E)))}),V.append(W),V};T.append(l("Widget Width (px)",s.theme.widgetWidth??460,240,1200,(A)=>{let E=t.snapshot.template.theme;if(a({theme:{...E,widgetWidth:A}}),t.widgetExpanded)t.onResizeWidgetLive?.(A,E.widgetHeight??540,!1)}),l("Widget Height (px)",s.theme.widgetHeight??540,180,900,(A)=>{let E=t.snapshot.template.theme;if(a({theme:{...E,widgetHeight:A}}),t.widgetExpanded)t.onResizeWidgetLive?.(E.widgetWidth??460,A,!1)}),l("Pill Width (px)",s.theme.pillWidth??420,220,960,(A)=>{let E=t.snapshot.template.theme;if(a({theme:{...E,pillWidth:A}}),!t.widgetExpanded)t.onResizeWidgetLive?.(A,E.pillHeight??92,!1)}));let w=e("div","ls-grid");for(let[A,E,D]of[["Frosted Glass Blur",s.theme.glassBlur!==!1,(F)=>a({theme:{...t.snapshot.template.theme,glassBlur:F}})],["Compact Card Density",Boolean(s.theme.compact),(F)=>a({theme:{...t.snapshot.template.theme,compact:F}})],["Expand Inline Ribbon by Default",Boolean(s.theme.inlineDefaultExpanded),(F)=>{t.inlineExpanded=F,a({theme:{...t.snapshot.template.theme,inlineDefaultExpanded:F}})}],["Icon-Only Widget Tabs",Boolean(s.theme.widgetTabsIconOnly),(F)=>a({theme:{...t.snapshot.template.theme,widgetTabsIconOnly:F}})],["All Cast Cards Expanded",(s.theme.castLayout||"roster")==="cards",(F)=>a({theme:{...t.snapshot.template.theme,castLayout:F?"cards":"roster"}})]]){let F=e("div");xe(t,n,F,{checked:E,label:A,onChange:D}),w.append(F)}N.append(g,p,h,T,w);let M=e("div");return o.append(M),he(t,n,M,{title:"Canon Story Premise (Optional Turn-1 Setup)",iconName:"edit",badge:d.canonPremise?"Set":void 0,defaultExpanded:Boolean(d.canonPremise),persistKey:"studio_templates_premise"}).append(e("p","ls-muted",d.canonPremise||"No custom premise set. Lumi Stats automatically calibrates from your Character Card, Persona, and Opening Message on Turn 1."),B("Open Full-Screen Premise Editor",()=>{t.request("textEditor:open",{title:"Canon Story Premise (Lumi Stats)",value:d.canonPremise||"",placeholder:"Write established relationships, roles, or world rules…"}).then((A)=>{if(!A.cancelled&&typeof A.text==="string")t.request("state:mutate",{stateOverride:{canonPremise:A.text.trim()},reason:"Updated canon premise"})})},"ls-btn-sm ls-btn-primary")),o}var _e="quickstart",Rt="hud",Ee=!1,ve=null,on="",Je=null;function Za(t,n){let s=t.toLowerCase().replace(/[^a-z0-9_-]+/g,"_")||"lumi_stats_template",a=new Blob([JSON.stringify(n,null,2)],{type:"application/json"}),i=URL.createObjectURL(a),r=document.createElement("a");r.href=i,r.download=`${s}.lumi-stats.json`,document.body.append(r),r.click(),r.remove(),URL.revokeObjectURL(i)}function Wn(t){if(Je)Je.cleanup(),Je=null;Ee=!1,ve=null,on=t.snapshot.template.id,t.request("snapshot:get").catch(()=>{return});let n=new ze;if(typeof t.ctx.ui?.mountApp==="function")try{let s=t.ctx.ui.mountApp({className:"ls-studio-mount",position:"app-overlay"});s.setVisible(!0),Xa(t,s,n);return}catch(s){console.warn("[LumiStats Studio] mountApp error, using modal fallback:",s),n.clear()}Ya(t)}function Xa(t,n,s){console.log("[LumiStats Studio] setupAppOverlay: mounting full-window Studio via mountApp"),t.studioOpen=!0,t.emitChange();let a=()=>{if(!Je)return;Ee=!1,ve=null;let f=Je;Je=null,t.activeOverlayCleanup=null,t.studioOpen=!1,t.emitChange(),f.cleanup()},i=(f)=>{if(f.key!=="Escape")return;if(f.defaultPrevented||t.modals.hasOpenModals()||document.body.querySelector('.ls-dd-menu[data-ls-dd-open="true"]'))return;a()};window.addEventListener("keydown",i);let r=(f=!1)=>{$n(n.root,()=>{s.clear();let y=[];n.root.replaceChildren(ma(t,s,a,!0,()=>r(!0),y));for(let P of y)P()},{deferIfTyping:!f,onDeferredFlush:()=>r(!0)})},d=t.subscribe(()=>r(!1)),o=t.subscribeStatus(()=>{let f=n.root.querySelector("[data-ls-studio-status]");if(f)f.textContent=t.statusText,f.style.display=t.statusText?"":"none",f.style.color=t.statusError?"var(--ls-danger)":"var(--ls-muted)"});r(!0),Je={mount:n,cleanup:()=>{window.removeEventListener("keydown",i),d(),o(),s.clear(),n.destroy()}},t.activeOverlayCleanup=a}function Ya(t){t.modals.open({title:"Lumi Stats Studio",width:1360,maxHeight:900},(n,s,a,i)=>{n.style.cssText+=";padding:0;overflow:hidden;display:flex;flex-direction:column;height:85vh;max-height:880px;container-type:inline-size;";let r=(c=!1)=>{$n(n,()=>{i.clear();let f=[];n.replaceChildren(ma(t,i,s,!1,()=>r(!0),f));for(let y of f)y()},{deferIfTyping:!c,onDeferredFlush:()=>r(!0)})};r(!0);let d=t.subscribe(()=>r(!1)),o=t.subscribeStatus(()=>{let c=n.querySelector("[data-ls-studio-status]");if(c)c.textContent=t.statusText,c.style.display=t.statusText?"":"none",c.style.color=t.statusError?"var(--ls-danger)":"var(--ls-muted)"});a.onDismiss(()=>{Ee=!1,ve=null,d(),o()})})}function ma(t,n,s,a,i,r=[]){let{template:d}=t.snapshot,o=structuredClone(d);if(on!==o.id)on=o.id,Ee=!1,ve=null;let c=t.builtinTemplates.some((p)=>p.id===o.id),f=(p,h="Updated template")=>{let T=structuredClone(t.snapshot.template),l=typeof p==="function"?p(T):p,w={...l,...l.theme?{theme:{...T.theme,...l.theme}}:{},...l.surfaces?{surfaces:{...T.surfaces,...l.surfaces}}:{}};t.request("state:mutate",{templatePatch:w,reason:h}).catch((M)=>t.notify(M instanceof Error?M.message:String(M),!0))},y=(p,h)=>{let T=h?.trim()||`${p.name} (Custom)`;t.request("template:duplicate",{sourceTemplateId:p.id,template:p,name:T,icon:p.icon,description:p.description}).then((l)=>{let w=l.template??t.snapshot.template;on=w.id,Ee=!0,ve={icon:w.icon,name:w.name,description:w.description},t.notify(`Created & activated editable copy "${w.name}"!`),i()}).catch((l)=>t.notify(l instanceof Error?l.message:String(l),!0))},P=e("div",a?"ls-studio-overlay":"ls-studio-overlay ls-studio-in-modal");t.stampThemeOnElement(P);let m=e("header","ls-studio-topbar"),S=e("div","ls-row");S.append(e("span","ls-brand-mark","L"),e("strong","","Lumi Stats Studio"),e("span","ls-chip ls-chip-accent",`${o.icon} ${o.name}`),e("span","ls-chip",c?"Built-In":"Custom"));let L=e("span","ls-chip",t.statusText);if(L.setAttribute("data-ls-studio-status","true"),!t.statusText)L.style.display="none";if(t.statusError)L.style.color="var(--ls-danger)";let k=e("div","ls-row");k.append(L,ee("plus",()=>Tt(t,i),{label:"New",className:"ls-btn-sm",title:"Create a new template"}),B("Save to Library",()=>{let p=t.snapshot.template;t.request("template:saveToLibrary",{name:p.name,icon:p.icon,description:p.description}).then(()=>t.notify(`Saved "${p.name}" to your Template Library.`)).catch((h)=>t.notify(h instanceof Error?h.message:String(h),!0))},"ls-btn-sm ls-btn-primary"),B("Export",()=>Za(o.name,o),"ls-btn-sm"),ee("close",s,{label:"Close",className:"ls-btn-sm ls-btn-danger",title:"Close Studio (Esc)"})),m.append(S,k),P.append(m);let _=e("div","ls-studio-workspace"),I=e("nav","ls-studio-sidebar"),b=[{id:"quickstart",title:"1. Templates & Look",sub:"Presets, placement & skin"},{id:"stats",title:"2. Stats & Built-Ins",sub:"Meters, Scene Pill & prompts"},{id:"extreme",title:"3. Tabs & Surfaces",sub:"HUD, Inline & Dossier layout"},{id:"stage_assets",title:"4. Stage Sprites",sub:"Sprites & time backdrops"},{id:"prose",title:"5. Prose & Cipher",sub:"Braille cleaner & word cipher"},{id:"engine",title:"6. AI & Connections",sub:"Models, Cortex & debug"}];for(let p of b){let h=e("button","ls-studio-nav-btn");if(h.type="button",_e===p.id)h.setAttribute("aria-current","page");h.append(e("span","ls-studio-nav-title",p.title),e("span","ls-studio-nav-sub",p.sub)),h.addEventListener("click",()=>{_e=p.id,i()}),I.append(h)}_.append(I);let x=e("main","ls-studio-pane");if(_e==="quickstart"||_e==="stats"||_e==="extreme"){let p=e("section","ls-hero-banner"),h=e("div","ls-row-between"),T=e("div");T.append(e("span","ls-kicker",c?"Built-In Preset":"Custom Saved Template"),e("h2","",`${o.icon} ${o.name}`),e("p","ls-muted",o.description));let l=e("div","ls-row");if(l.append(ee("copy",()=>y(o),{label:"Duplicate & Edit",className:"ls-btn-sm ls-btn-primary"}),ee("edit",()=>{Ee=!Ee,ve=Ee?{icon:o.icon,name:o.name,description:o.description}:null,i()},{label:Ee?"Hide Rename":"Rename",className:"ls-btn-sm"})),h.append(T,l),p.append(h),Ee){ve??={icon:o.icon,name:o.name,description:o.description};let w=e("div","ls-grid"),M=e("label","ls-label","Icon Emoji"),R=e("input","ls-input");R.value=ve.icon,R.addEventListener("input",()=>{if(ve)ve.icon=R.value}),M.append(R);let A=e("label","ls-label","Template Name"),E=e("input","ls-input");E.value=ve.name,E.addEventListener("input",()=>{if(ve)ve.name=E.value}),A.append(E);let D=e("label","ls-label","Description"),F=e("input","ls-input");F.value=ve.description,F.addEventListener("input",()=>{if(ve)ve.description=F.value}),D.append(F),w.append(M,A,D);let O=B("Save Template Name & Info",()=>{let V=E.value.trim()||o.name,W=R.value.trim()||"✨",H=F.value.trim()||o.description;O.disabled=!0,O.textContent="Saving…",t.request("template:saveToLibrary",{name:V,icon:W,description:H}).then(()=>{Ee=!1,ve=null,t.notify(`Saved template "${V}".`),i()}).catch((j)=>{if(t.notify(j instanceof Error?j.message:String(j),!0),O.isConnected)O.disabled=!1,O.textContent="Save Template Name & Info"})},"ls-btn-sm ls-btn-primary");p.append(w,O)}x.append(p)}if(_e==="quickstart")x.append(ua(t,n,o,f,y,i));else if(_e==="stats")x.append(da(t,n,o,f,i));else if(_e==="extreme")x.append(pa(t,n,o,f,i));else if(_e==="stage_assets")x.append(ea(t,i));else if(_e==="prose")x.append(oa(t,n));else if(_e==="engine")x.append(ia(t,n,r));_.append(x);let N=e("aside","ls-studio-preview-pane"),C=e("section","ls-card"),v=e("div","ls-row-between");v.append(e("span","ls-kicker","Live Preview"));let u=e("div","ls-row");for(let[p,h]of[["hud","HUD"],["pill","Pill"],["inline","Inline"],["dossier","Dossier"]]){let T=B(h,()=>{Rt=p,i()},"ls-btn-sm");if(Rt===p)T.setAttribute("aria-current","page");u.append(T)}v.append(u),C.append(v);let g=e("div");if(g.style.marginTop="6px",Rt==="hud")g.style.height="470px",g.append(vt(t,!1,()=>{return},(p)=>Ye(t,p),()=>{return},n));else if(Rt==="pill")g.style.height="104px",g.append(vt(t,!0,()=>{return},(p)=>Ye(t,p),()=>{return},n));else if(Rt==="inline"){let p=t.inlineExpanded;t.inlineExpanded=!0;let h=na(t,(T)=>Ye(t,T),()=>{return});t.inlineExpanded=p,g.append(h)}else{let p=t.dossierEditMode;t.dossierEditMode=!1;let h=Vn(t,n);t.dossierEditMode=p,g.append(h)}return C.append(g),N.append(C),_.append(N),P.append(_),P}function fa(t,n,s,a){try{let i=new ze,r=n.snapshot.template.theme,d=()=>({w:Math.max(240,Math.min(1200,n.snapshot.template.theme.widgetWidth??460)),h:Math.max(180,Math.min(900,n.snapshot.template.theme.widgetHeight??540))}),o=()=>({w:Math.max(220,Math.min(960,n.snapshot.template.theme.pillWidth??420)),h:Math.max(56,Math.min(220,n.snapshot.template.theme.pillHeight??92))}),c=t.ui.createFloatWidget({width:a?.width??(r.pillWidth??420),height:a?.height??(r.pillHeight??92),chromeless:a?.chromeless??!0,snapToEdge:!0,tooltip:"Lumi Stats HUD",touchScrollMode:"native"});c.root.classList.add("ls-root"),c.root.style.cssText+=";display:flex;flex-direction:column;height:100%;max-height:100%;min-height:0;overflow:hidden;background:transparent;",n.onResizeWidgetLive=(k,_,I)=>{if(c.setSize(k,_),I){let b=n.snapshot.template.theme;n.request("state:mutate",{templatePatch:{theme:n.widgetExpanded?{...b,widgetWidth:k,widgetHeight:_}:{...b,pillWidth:k,pillHeight:_}},reason:`Resized widget to ${k}×${_}`})}};let f=null,y=()=>{if(f)clearTimeout(f),f=null;if(n.widgetExpanded=!n.widgetExpanded,!!n.widgetExpanded){let{w:_,h:I}=d();c.setSize(_,I)}else{let{w:_,h:I}=o();f=setTimeout(()=>{c.setSize(_,I),f=null},180)}m()},P="",m=()=>{i.clear();let k=n.snapshot.template.theme.placement,_=!n.vnStageOpen&&!n.studioOpen&&(k==="floating_only"||k.startsWith("both_"));c.setVisible(_),n.stampThemeOnElement(c.root);let I=vt(n,!n.widgetExpanded,y,(b)=>Ye(n,b),s,i);if(c.root.replaceChildren(I),!n.widgetExpanded&&!f&&_){let b=Boolean(I.querySelector('.ls-hud-pill[data-empty-deck="true"]')),{w:x,h:N}=o(),C=b?Math.min(N,48):N,v=`${x}x${C}`;if(v!==P)P=v,c.setSize(x,C)}else P="";n.applyTemplateThemeToDom()},S=(k)=>{let _=k.detail;if(_?.extensionId&&_.extensionId!=="lumi_stats")return;n.refreshActiveChat(),m()};window.addEventListener("spindle:desktop-widget-returned",S);let L=n.subscribe(m);return m(),()=>{if(window.removeEventListener("spindle:desktop-widget-returned",S),f)clearTimeout(f);n.onResizeWidgetLive=null,L(),i.clear(),c.destroy()}}catch{return}}function Ei(t,n){t.deferReady?.();let s=[];s.push(Ns(t));let a=new Ln(t);s.push(()=>a.destroy());let i=fa(t,a,()=>Wn(a),n);if(i)s.push(i);return s.push(t.events.on("CHAT_SWITCHED",(r)=>{let d=r&&typeof r==="object"?r:{},o=typeof d.chatId==="string"?d.chatId:null;a.refreshActiveChat(o)})),a.refreshActiveChat(),t.ready?.(),()=>{for(let r of s.reverse())r();t.dom.cleanup()}}export{Ei as setupWidget};
