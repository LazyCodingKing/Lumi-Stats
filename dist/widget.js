function wn(e){let n=e.name.trim().slice(0,80)||"Custom Group";return{id:ie(e.id??n,"cat"),name:n,icon:e.icon?.trim().slice(0,8)||"\uD83D\uDCC1",color:e.color?.trim()||"var(--lumiverse-primary)",enabled:e.enabled!==!1,collapsedByDefault:Boolean(e.collapsedByDefault),showGroupHeaderInHud:e.showGroupHeaderInHud!==!1,promptTriggerMode:e.promptTriggerMode==="conditional"||e.promptTriggerMode==="manual"?e.promptTriggerMode:"always",...Array.isArray(e.promptKeywords)&&e.promptKeywords.length?{promptKeywords:[...new Set(e.promptKeywords.map((s)=>String(s).trim().toLowerCase()).filter(Boolean))].slice(0,32)}:{},...e.aiRule?.trim()?{aiRule:e.aiRule.trim()}:{},...e.localRuleFormula?.trim()?{localRuleFormula:e.localRuleFormula.trim()}:{},injectInContinuity:e.injectInContinuity!==!1,order:Number.isFinite(e.order)?Math.round(Number(e.order)):0}}function ie(e,n="stat"){return String(e??"").trim().toLowerCase().replace(/['’]/g,"").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,64)||n}function ya(e,n,a){let s=n-e;if(s<=0)return[{value:e,label:"Baseline",description:"Default baseline"}];let o=(r)=>Math.round(e+s*r);return[{value:o(0.85),label:"Very High / Peak",description:"Dominant, intense, or near maximum capacity"},{value:o(0.65),label:"High / Strong",description:"Clearly elevated, strong, or well-established"},{value:o(0.45),label:"Moderate / Balanced",description:"Standard working baseline or neutral equilibrium"},{value:o(0.2),label:"Low / Guarded",description:"Mild, strained, or subdued"},{value:e,label:"None / Minimal",description:"Absent, calm baseline, or depleted"}]}function re(e){let n=ie(e.id??e.label,"stat"),a=e.scope??"character",s=e.displayStyle??"auto",r=s==="pill_list"?"tags":(s==="feed_cards"||s==="step_chain"||s==="quote_callout"||s==="key_value"||s==="arc_tracker"||s==="accordion_cards"||s==="matrix_badges"||s==="meter_mini_bars"||s==="stat_pills_grid"||s==="bullet_ledger"||s==="timeline_list"||s==="checklist")&&(!e.kind||e.kind==="meter")?"text":e.kind??"meter",u=Number.isFinite(e.min)?Number(e.min):0,i=Number.isFinite(e.max)?Number(e.max):r==="clock"?6:r==="pips"||r==="hearts"?5:r==="attributes"?20:r==="currency"?99999999:100,d=e.volatility??(a==="character"?"progressive":"momentary"),g=Array.isArray(e.anchors)?e.anchors:[],v=a==="character"?"cast":a==="world"?"world":"stats",M=Boolean(e.pinnedToHeader??e.showIn?.pinnedHeader),h={widget:e.showIn?.widget??!0,inline:e.showIn?.inline??!0,dossier:e.showIn?.dossier??a==="character",pinnedHeader:M};return{id:n,label:e.label.trim().slice(0,80)||n,icon:e.icon?.trim().slice(0,8)||"\uD83D\uDCCA",scope:a,kind:r,min:Math.min(u,i),max:Math.max(u,i),step:Number.isFinite(e.step)&&Number(e.step)>0?Number(e.step):1,defaultValue:e.defaultValue!==void 0?e.defaultValue:r==="boolean"?!1:r==="skill_tree"?"SP: 2 | Basic Focus (Lv.1/5, cost:1, +10% efficiency)":r==="xp_level"?"Lv. 1 | 0/100 XP | Rank E":r==="attributes"?"STR:10, DEX:10, CON:10, INT:10, WIS:10, CHA:10":r==="inventory"?"None":r==="status_fx"?"None":r==="text"||r==="tags"||r==="tier"?e.options?.[0]??"None":Math.max(Math.min(u,i),Math.min(Math.max(u,i),0)),...e.options?.length?{options:e.options}:{},anchors:g,volatility:d,triggerCues:e.triggerCues?.trim()??"",...e.formula?.trim()?{formula:e.formula.trim()}:{},color:e.color?.trim()||"var(--lumiverse-primary)",enabled:e.enabled!==!1,locked:Boolean(e.locked),pinnedToHeader:M,displayStyle:e.displayStyle??"auto",layoutSpan:e.layoutSpan??"auto",showIn:h,tabId:e.tabId?.trim()||v,widgetTabId:e.widgetTabId?.trim()||v,inlineTabId:e.inlineTabId?.trim()||v,dossierTabId:e.dossierTabId?.trim()||"bonds",...Array.isArray(e.extraWidgetTabIds)&&e.extraWidgetTabIds.length?{extraWidgetTabIds:[...new Set(e.extraWidgetTabIds.map(String))]}:{},...Array.isArray(e.extraInlineTabIds)&&e.extraInlineTabIds.length?{extraInlineTabIds:[...new Set(e.extraInlineTabIds.map(String))]}:{},calculationMode:e.calculationMode==="local_formula"||e.calculationMode==="ai_plus_local"||e.calculationMode==="ai"?e.calculationMode:Boolean(e.formula?.trim())?"local_formula":"ai",...e.formulaOutputTemplate?.trim()?{formulaOutputTemplate:e.formulaOutputTemplate.trim()}:{},promptTriggerMode:e.promptTriggerMode==="conditional"||e.promptTriggerMode==="manual"?e.promptTriggerMode:"always",...Array.isArray(e.promptKeywords)&&e.promptKeywords.length?{promptKeywords:[...new Set(e.promptKeywords.map((x)=>String(x).trim().toLowerCase()).filter(Boolean))].slice(0,32)}:{},injectInContinuity:e.injectInContinuity!==!1,...e.categoryId?.trim()?{categoryId:e.categoryId.trim()}:{},...e.alerts?.length?{alerts:e.alerts}:{}}}function xa(){return[{id:"stats",label:"You & Scene",icon:"\uD83D\uDCCA",kind:"stats",enabled:!0,order:0},{id:"cast",label:"Cast",icon:"\uD83D\uDC65",kind:"cast",enabled:!0,order:1},{id:"web",label:"Bond Web",icon:"\uD83D\uDD78️",kind:"web",enabled:!0,order:2},{id:"map",label:"Atlas",icon:"\uD83D\uDDFA️",kind:"map",enabled:!0,order:3},{id:"world",label:"World & Clocks",icon:"\uD83C\uDF0D",kind:"world",enabled:!0,order:4}]}function bs(){return[{id:"stats",label:"Stats",icon:"\uD83D\uDCCA",kind:"stats",enabled:!0,order:0},{id:"cast",label:"Cast",icon:"\uD83D\uDC65",kind:"cast",enabled:!0,order:1},{id:"web",label:"Bond Web",icon:"\uD83D\uDD78️",kind:"web",enabled:!0,order:2},{id:"world",label:"World",icon:"\uD83C\uDF0D",kind:"world",enabled:!0,order:3}]}function vs(){return[{id:"overview",label:"Overview",icon:"✨",kind:"overview",enabled:!0,order:0,showMeters:!0,showFields:!0,showSecrets:!1,showAudit:!1,showNpcBonds:!1},{id:"bonds",label:"Player Bonds",icon:"\uD83D\uDC96",kind:"bonds",enabled:!0,order:1,showMeters:!0,showFields:!1,showSecrets:!1,showAudit:!0,showNpcBonds:!1},{id:"peer_bonds",label:"Peer Bonds (NPC↔NPC)",icon:"\uD83E\uDD1D",kind:"peer_bonds",enabled:!0,order:2,showMeters:!1,showFields:!1,showSecrets:!1,showAudit:!1,showNpcBonds:!0},{id:"loadout",label:"Attire & Loadout",icon:"\uD83D\uDC57",kind:"loadout",enabled:!0,order:3,showMeters:!1,showFields:!0,showSecrets:!1,showAudit:!1,showNpcBonds:!1},{id:"secrets",label:"Secrets & Notes",icon:"\uD83D\uDD75️",kind:"secrets",enabled:!0,order:4,showMeters:!1,showFields:!1,showSecrets:!0,showAudit:!1,showNpcBonds:!1}]}function ys(){return{widgetTabs:xa(),inlineTabs:bs(),dossierTabs:vs(),trackNpcBonds:!0,showRelationshipWeb:!0,customWidgetHtml:"",customInlineHtml:"",customDossierHtml:""}}function rt(){return{trackPlayerAttire:!0,playerAttireLabel:"Your Current Attire / Presentation",playerAttireInstruction:"Update whenever the player character changes clothing, state of dress, or physical presentation.",showPlayerAttireCard:!0,trackPlayerCondition:!0,playerConditionLabel:"Physical / Mental Condition",playerConditionInstruction:"Track physical injuries, fatigue, intoxication, disorientation, or mental state.",showPlayerConditionCard:!0,trackPlayerAction:!1,playerActionLabel:"Latest Notable Action",playerActionInstruction:"Summarize the player character’s most consequential current action.",showPlayerActionCard:!0,trackSceneSummary:!0,sceneSummaryLabel:"Scene Beat Summary",sceneSummaryInstruction:"Concise 1-sentence summary of what just happened in the scene.",showSceneSummaryInWidget:!0,trackPlaces:!0,placesInstruction:"Extract new or visited locations into zones[] (building/district), places[] (room/spot with tags & brief note), and paths[].",trackQuests:!0,questsInstruction:"Track active story goals, deadlines, and sub-objectives; mark completed when resolved.",showQuestsInWidget:!0,trackDispatches:!0,dispatchesInstruction:"Log brief off-screen developments or upcoming hooks for characters not currently in the room.",showDispatchesInWidget:!0,trackNpcConditions:!0,npcConditionsInstruction:"Track short status tags on NPCs (e.g. Flustered, Armed, Injured, Hurried).",trackNpcSecrets:!0,npcSecretsInstruction:"Record discovered clues, hidden motives, or confirmed secrets per NPC.",sceneLocationInstruction:'Current specific spot and broader area formatted cleanly as "Specific Room/Spot, District/Building".',sceneTimeInstruction:'Current in-story clock time (e.g. "08:15 AM" or story-appropriate time-of-day).',sceneDateInstruction:'Current in-story date, day count, or era label (e.g. "Day 1" or "Oct 14, 2002").',sceneWeatherInstruction:'Concise weather and immediate atmosphere (e.g. "Clear", "Light Rain", "Tense Indoors").',sceneTimeFlowInstruction:'Estimate elapsed minutes ("mins") realistically for the actions in this beat.',scenePillLocked:!1,overrides:{}}}function ot(){return[{id:"role_summary",label:"Role & Bond to Player",icon:"\uD83E\uDEAA",placeholder:"e.g. Loyal personal maid, Childhood rival…",instruction:"Concise role and established relationship to the player.",tabId:"overview",displayStyle:"badge",showInHudCast:!1,showInInlineCast:!1,enabled:!0,locked:!1},{id:"demeanor",label:"Current Demeanor & Mood",icon:"\uD83C\uDFAD",placeholder:"e.g. Flustered, Guarded, Warm…",instruction:"Current emotional demeanor and facial expression in the scene.",tabId:"overview",displayStyle:"badge",showInHudCast:!0,showInInlineCast:!1,enabled:!0,locked:!1},{id:"inner_thought",label:"Inner Monologue",icon:"\uD83D\uDCAD",placeholder:"Unspoken internal thought in this moment…",instruction:"Short first-person unspoken thought or internal reaction to the current beat.",tabId:"overview",displayStyle:"quote",showInHudCast:!0,showInInlineCast:!0,enabled:!0,locked:!1},{id:"immediate_goal",label:"Immediate Goal",icon:"\uD83C\uDFAF",placeholder:"What this character is trying to do right now…",instruction:"Immediate objective or intention in the current scene.",tabId:"overview",displayStyle:"card",showInHudCast:!1,showInInlineCast:!1,enabled:!0,locked:!1},{id:"attire_layers",label:"Current Outfit & Presentation",icon:"\uD83D\uDC57",placeholder:"Observed clothing & state of dress",instruction:"Update whenever clothing, state of undress, or physical presentation is described or changed.",tabId:"loadout",displayStyle:"card",showInHudCast:!0,showInInlineCast:!0,enabled:!0,locked:!1},{id:"carried_items",label:"Carried Items & Props",icon:"\uD83C\uDF92",placeholder:"Items in hand or on person",instruction:"Track notable items, tools, or gifts currently held or worn.",tabId:"loadout",displayStyle:"pills",showInHudCast:!1,showInInlineCast:!1,enabled:!0,locked:!1},{id:"bond_dynamic",label:"Relationship Dynamic",icon:"\uD83D\uDD17",placeholder:"Established dynamic with player",instruction:"Summarize the current interpersonal dynamic and power balance with the player.",tabId:"overview",displayStyle:"card",showInHudCast:!1,showInInlineCast:!1,enabled:!0,locked:!1}]}function ke(){return{schema:"lumi-stats-template/v1",id:"universal_companion",name:"Universal Roleplay Companion",icon:"✨",description:"Schema-driven roleplay stats with two-phase calibration for relationships, momentary situational reactions, and world progression.",promptPosition:"post_history",promptDepth:1,theme:{surfaceStyle:"glass",pillStyle:"glass_capsule",frameShape:"rounded",radiusPreset:"balanced",meterStyle:"smooth",castLayout:"roster",glowIntensity:55,glassBlur:!0,widgetWidth:460,widgetHeight:540,pillWidth:420,pillHeight:92,widgetTabsIconOnly:!1,compact:!1,placement:"both_bottom",inlineDefaultExpanded:!1,showSceneChips:{time:!0,date:!0,location:!0,weather:!0,cast:!0,pinnedStats:!0},customCss:""},tabs:xa(),surfaces:ys(),coreTrackers:rt(),categories:[],stats:[re({id:"composure",label:"Composure",icon:"\uD83E\uDDED",scope:"player",kind:"meter",min:0,max:100,defaultValue:85,volatility:"momentary",pinnedToHeader:!0,triggerCues:"85=poised, 55=masking, 30=flustered, 0=shaken; drops on teasing, undress, or pressure.",anchors:[{value:80,label:"Poised & Collected",description:"Calm, confident, and in control"},{value:55,label:"Steady / Masking",description:"Holding it together despite pressure"},{value:30,label:"Flustered / Rattled",description:"Caught off-guard, blushing, or defensive"},{value:0,label:"Shaken / Overwhelmed",description:"Completely flustered or panicking"}]}),re({id:"trust",label:"Trust",icon:"\uD83D\uDEE1️",scope:"character",kind:"meter",min:0,max:100,defaultValue:45,volatility:"progressive",pinnedToHeader:!0,dossierTabId:"bonds",triggerCues:"Calibrate: hostile=15, stranger=45, ally/family=70, confidant=90; shift on honesty/betrayal.",anchors:[{value:85,label:"Trusted Confidant",description:"Unconditional trust and deep confidence"},{value:65,label:"Open & Relying",description:"Clear trust, family familiarity, or proven ally"},{value:40,label:"Neutral / Polite",description:"Standard baseline for unproven acquaintances"},{value:20,label:"Guarded / Wary",description:"Skeptical, cautious, or holding back"},{value:0,label:"Deeply Distrustful",description:"Expects betrayal or actively hostile"}]}),re({id:"loyalty",label:"Loyalty & Devotion",icon:"⚜️",scope:"character",kind:"meter",min:0,max:100,defaultValue:50,volatility:"anchor",dossierTabId:"bonds",triggerCues:"Calibrate: rival=10, peer=45, family=75, sworn retainer/partner=90; shift on oaths/betrayal.",anchors:[{value:85,label:"Fiercely Loyal",description:"Devoted retainer, sworn protector, or deeply committed partner"},{value:65,label:"Dependable Ally",description:"Supportive family member, friend, or companion"},{value:40,label:"Cooperative",description:"Neutral or professional alignment"},{value:15,label:"Self-Interested",description:"Prioritizes own agenda; easily swayed"},{value:0,label:"Unbound / Opposed",description:"No allegiance or actively opposed"}]}),re({id:"affection",label:"Affection & Fondness",icon:"❤️",scope:"character",kind:"meter",min:0,max:100,defaultValue:45,volatility:"progressive",dossierTabId:"bonds",triggerCues:"Calibrate: cold=15, polite=45, fond friend/family=70, loving=90; shift with warmth/coldness.",anchors:[{value:85,label:"Deeply Devoted",description:"Profound love, adoration, or attachment"},{value:65,label:"Warm & Fond",description:"Genuine care, closeness, and affection"},{value:40,label:"Friendly / Neutral",description:"Amiable or neutral baseline"},{value:20,label:"Cold / Distant",description:"Aloof, irritated, or emotionally detached"},{value:0,label:"Averse / Hostile",description:"Dislike, bitterness, or rejection"}]}),re({id:"desire",label:"Desire & Attraction",icon:"\uD83D\uDD25",scope:"character",kind:"meter",min:0,max:100,defaultValue:0,volatility:"momentary",dossierTabId:"bonds",triggerCues:"0=platonic, 30=sparked, 60=intense, 85=consuming; spikes on allure, undress, touch, flirting.",anchors:[{value:80,label:"Consuming",description:"Overwhelming attraction or longing in the scene"},{value:55,label:"Intense",description:"Strong visible attraction, flustered gaze, or magnetic pull"},{value:25,label:"Sparked / Noticeable",description:"Caught off-guard by appearance, proximity, or suggestive beat"},{value:0,label:"Platonic / Dormant",description:"No active romantic or physical tension"}]}),re({id:"arousal",label:"Arousal & Fluster",icon:"\uD83D\uDC93",scope:"character",kind:"meter",min:0,max:100,defaultValue:0,volatility:"momentary",dossierTabId:"bonds",triggerCues:"0=calm, 25=blushing, 55=heated, 85=breathless; spikes on nudity/towel, skin contact, intimacy.",anchors:[{value:80,label:"Breathless / Peak",description:"Heavily aroused or physically overwhelmed"},{value:50,label:"Heated / Flushed",description:"Visibly flustered, racing pulse, or strong physical reaction"},{value:20,label:"Stirred / Blushing",description:"Initial spike from suggestive visual cue, towel, or close contact"},{value:0,label:"Composed",description:"Calm physiological state"}]}),re({id:"world_tension",label:"Scene Tension Clock",icon:"⏱️",scope:"world",kind:"clock",min:0,max:6,defaultValue:0,volatility:"progressive",widgetTabId:"world",inlineTabId:"world",triggerCues:"+1 when suspense, danger, or complications escalate; reduce when resolved."})],dossierFields:ot(),updatedAt:new Date().toISOString()}}var wa=[ke(),{...ke(),id:"romance_slice_of_life",name:"Romance, Chemistry & Wardrobe",icon:"\uD83C\uDF38",description:"Focused on interpersonal chemistry, momentary blush/fluster, desire, devotion, and detailed outfit layers.",theme:{...ke().theme,surfaceStyle:"cozy_vn",pillStyle:"vn_dialogue_bar",accentHue:330,secondaryHue:200},stats:[...ke().stats.filter((e)=>e.id!=="world_tension"),re({id:"chemistry",label:"Spark & Chemistry",icon:"✨",scope:"character",kind:"meter",min:0,max:100,defaultValue:35,color:"#f472b6",volatility:"momentary",pinnedToHeader:!0,dossierTabId:"bonds",triggerCues:"0–100 scale. Rises on playful banter, shared silences, eye contact, and romantic tension; cools on awkwardness."}),re({id:"intimacy_stage",label:"Romantic Tension Clock",icon:"\uD83D\uDC97",scope:"scene",kind:"clock",min:0,max:6,defaultValue:0,color:"#f472b6",volatility:"momentary",widgetTabId:"stats",inlineTabId:"stats",triggerCues:"0–6 segments. Advances as physical proximity, vulnerability, or romantic confession builds in the scene."})]},{...ke(),id:"tactical_adventure",name:"Adventure, Party & World Clocks",icon:"⚔️",description:"Vitality, Resolve, Party Loyalty, Trust, and World Threat Clocks for fantasy or sci-fi campaigns.",stats:[re({id:"vitality",label:"Vitality",icon:"❤️",scope:"player",kind:"meter",min:0,max:100,defaultValue:100,volatility:"momentary",pinnedToHeader:!0,triggerCues:"Drops on injuries, exhaustion, or hazards; restores with medical care or rest."}),re({id:"resolve",label:"Resolve & Energy",icon:"⚡",scope:"player",kind:"meter",min:0,max:100,defaultValue:100,volatility:"momentary",pinnedToHeader:!0,triggerCues:"Spent on strenuous feats, spells, or high-stress confrontations; recovered on rest."}),...ke().stats.filter((e)=>e.scope!=="player")]},{...ke(),id:"mystery_thriller",name:"Investigation & Suspicion Ledger",icon:"\uD83D\uDD75️",description:"Tracks Case Progress, Suspect Alertness, Credibility, Pressure, and discovered clues.",stats:[re({id:"case_progress",label:"Investigation Progress",icon:"\uD83D\uDD0E",scope:"player",kind:"meter",min:0,max:100,defaultValue:0,volatility:"progressive",pinnedToHeader:!0,triggerCues:"Increases as physical clues, motives, and alibi contradictions are uncovered."}),re({id:"suspicion",label:"Suspicion & Guilt",icon:"\uD83D\uDC41️",scope:"character",kind:"meter",min:0,max:100,defaultValue:15,volatility:"progressive",pinnedToHeader:!0,triggerCues:"Calibrate from initial evidence; increase on lies, evasions, or incriminating discoveries."}),re({id:"pressure",label:"Interrogation Pressure",icon:"\uD83D\uDCA2",scope:"character",kind:"clock",min:0,max:6,defaultValue:0,volatility:"momentary",triggerCues:"Advance when cornered with evidence or tough questioning; drops when given breathing room."}),re({id:"alert_clock",label:"Danger / Alert Clock",icon:"\uD83D\uDEA8",scope:"world",kind:"clock",min:0,max:6,defaultValue:0,volatility:"momentary",pinnedToHeader:!0,widgetTabId:"world",inlineTabId:"world",triggerCues:"Advances by +1 when making noise, tipping off suspects, or triggering alarms."})]},{...ke(),id:"litrpg_skill_tree",name:"LitRPG System, Skill Trees & Gear",icon:"⚔️",description:"Full game HUD with HP/MP, XP & Leveling, Skill Points & Interactive Skill Tree, Core Attributes, Buffs/Debuffs, and Rarity Gear.",theme:{...ke().theme,surfaceStyle:"arcane_rpg",frameShape:"ornate",meterStyle:"glow",accentHue:42,secondaryHue:198},stats:[re({id:"hp",label:"Health (HP)",icon:"❤️",scope:"player",kind:"meter",min:0,max:100,defaultValue:100,color:"#f43f5e",volatility:"momentary",pinnedToHeader:!0,triggerCues:"Drops on damage, traps, or exhaustion; recovers via healing, potions, or rest."}),re({id:"mp",label:"Mana / Stamina",icon:"\uD83D\uDCA0",scope:"player",kind:"meter",min:0,max:100,defaultValue:100,color:"#38bdf8",volatility:"momentary",pinnedToHeader:!0,triggerCues:"Spent when casting spells or using active skills; regenerates during recovery."}),re({id:"xp_level",label:"Level & XP",icon:"⭐",scope:"player",kind:"xp_level",defaultValue:"Lv. 1 | 0/100 XP | Rank E",color:"#f59e0b",volatility:"progressive",triggerCues:'Format: "Lv. N | cur/next XP | Rank X". Award XP on victories, discoveries, and milestones; level up when cur >= next.'}),re({id:"gold",label:"Gold Coins",icon:"\uD83E\uDE99",scope:"player",kind:"currency",min:0,max:99999999,defaultValue:100,color:"#f59e0b",volatility:"progressive",triggerCues:"Track player currency/gold. Adjust via +N / -N on purchases, rewards, or loot."}),re({id:"attributes",label:"Core Attributes",icon:"\uD83E\uDDEC",scope:"player",kind:"attributes",min:1,max:30,defaultValue:"STR:10, DEX:10, CON:10, INT:10, WIS:10, CHA:10",color:"#818cf8",layoutSpan:"full",volatility:"anchor",triggerCues:'Comma-separated stats: "STR:N, DEX:N, CON:N, INT:N, WIS:N, CHA:N". Update when training or leveling.'}),re({id:"skill_tree",label:"Skill Tree & SP",icon:"\uD83C\uDF33",scope:"player",kind:"skill_tree",defaultValue:"SP: 2 | Combat Sense (Lv.1/5, cost:1, +10% Eva) ; Arcane Spark (Lv.0/5, cost:1, req:Combat Sense)",color:"#10b981",layoutSpan:"full",volatility:"progressive",triggerCues:'Format: "SP: N | Skill A (Lv.X/Y, cost:1, bonus) ; Skill B (Lv.X/Y, cost:1, req:Skill A)". Grant SP on level-ups or breakthroughs.'}),re({id:"status_fx",label:"Buffs & Debuffs",icon:"⚡",scope:"player",kind:"status_fx",defaultValue:"None",color:"#2dd4bf",layoutSpan:"full",volatility:"momentary",triggerCues:'Prefix buffs with "+" and debuffs with "-" separated by "; ", e.g. "+Barrier (3t) ; -Bleeding (2t)".'}),re({id:"inventory",label:"Gear & Inventory",icon:"\uD83C\uDF92",scope:"player",kind:"inventory",defaultValue:"Traveler Blade [common, equipped] ; Ration x2 [common]",color:"#a78bfa",layoutSpan:"full",volatility:"progressive",triggerCues:'List items separated by "; " with qty & rarity tags, e.g. "Runed Dagger [rare, equipped] ; Potion x3 [common]".'}),...ke().stats.filter((e)=>e.scope==="character"||e.scope==="world")]},{...ke(),id:"persona_social_sim",name:"Stylish Social Sim & Confidants",icon:"\uD83C\uDCCF",description:"High-contrast social sim HUD with Confidant Heart ranks, Social Stats (Charm/Courage/Knowledge), and stylish badges.",theme:{...ke().theme,surfaceStyle:"persona_pop",frameShape:"sharp",meterStyle:"segmented",accentHue:348,secondaryHue:45},stats:[re({id:"social_stats",label:"Social Qualities",icon:"⭐",scope:"player",kind:"attributes",min:1,max:10,defaultValue:"Knowledge:2, Charm:2, Courage:2, Kindness:2, Proficiency:2",color:"#f43f5e",layoutSpan:"full",volatility:"progressive",triggerCues:'Comma-separated 1–10 qualities: "Knowledge:N, Charm:N, Courage:N, Kindness:N, Proficiency:N".'}),re({id:"composure",label:"Cool / Composure",icon:"\uD83C\uDFAD",scope:"player",kind:"meter",min:0,max:100,defaultValue:85,color:"#facc15",volatility:"momentary",pinnedToHeader:!0,triggerCues:"85=stylish, 55=steady, 30=rattled, 0=flustered."}),re({id:"bond_hearts",label:"Confidant Bond Rank",icon:"❤️",scope:"character",kind:"hearts",min:0,max:10,defaultValue:3,color:"#f472b6",volatility:"progressive",pinnedToHeader:!0,triggerCues:"0–10 heart rank. Increases on meaningful hangouts, honesty, or breakthroughs."}),...ke().stats.filter((e)=>e.scope==="character"||e.scope==="world")]}],Vt=[{schema:"lumi-stats-skin/v1",name:"Adaptive Lumiverse Glass",surfaceStyle:"glass",frameShape:"rounded",meterStyle:"smooth",glowIntensity:45,glassBlur:!0,castLayout:"roster"},{schema:"lumi-stats-skin/v1",name:"Arcane Fantasy RPG",surfaceStyle:"arcane_rpg",frameShape:"ornate",meterStyle:"glow",accentHue:42,secondaryHue:198,glowIntensity:70,glassBlur:!0,castLayout:"roster"},{schema:"lumi-stats-skin/v1",name:"Cyber Tactical HUD",surfaceStyle:"cyber_hud",frameShape:"chamfered",meterStyle:"segmented",accentHue:190,secondaryHue:315,glowIntensity:85,glassBlur:!0,castLayout:"roster"},{schema:"lumi-stats-skin/v1",name:"Stylish Social Sim (Pop)",surfaceStyle:"persona_pop",frameShape:"sharp",meterStyle:"segmented",accentHue:348,secondaryHue:48,glowIntensity:60,glassBlur:!1,castLayout:"roster"},{schema:"lumi-stats-skin/v1",name:"Cozy Visual Novel",surfaceStyle:"cozy_vn",frameShape:"rounded",meterStyle:"smooth",accentHue:330,secondaryHue:200,glowIntensity:40,glassBlur:!0,castLayout:"roster"}];function Sa(e){return{schema:"lumi-stats-skin/v1",name:`${e.name} Skin`,surfaceStyle:e.theme.surfaceStyle??"glass",frameShape:e.theme.frameShape??(e.theme.radiusPreset==="sharp"?"sharp":"rounded"),meterStyle:e.theme.meterStyle??"smooth",...e.theme.accentHue!==void 0?{accentHue:e.theme.accentHue}:{},...e.theme.secondaryHue!==void 0?{secondaryHue:e.theme.secondaryHue}:{},glowIntensity:e.theme.glowIntensity??55,glassBlur:e.theme.glassBlur!==!1,compact:Boolean(e.theme.compact),castLayout:e.theme.castLayout??"roster",...e.theme.customCss?{customCss:e.theme.customCss}:{}}}function ka(e){let n=e&&typeof e==="object"?e:{},s=new Set(["glass","soft","sleek","minimal","neon","arcane_rpg","cyber_hud","persona_pop","cozy_vn"]).has(String(n.surfaceStyle))?n.surfaceStyle:"glass",o=n.frameShape==="chamfered"||n.frameShape==="sharp"||n.frameShape==="ornate"?n.frameShape:"rounded",r=n.meterStyle==="segmented"||n.meterStyle==="glow"?n.meterStyle:"smooth",u=n.castLayout==="cards"?"cards":"roster",i=typeof n.accentHue==="number"&&Number.isFinite(n.accentHue)?Math.max(0,Math.min(360,Math.round(n.accentHue))):void 0,d=typeof n.secondaryHue==="number"&&Number.isFinite(n.secondaryHue)?Math.max(0,Math.min(360,Math.round(n.secondaryHue))):void 0,g=typeof n.glowIntensity==="number"&&Number.isFinite(n.glowIntensity)?Math.max(0,Math.min(100,Math.round(n.glowIntensity))):55;return{schema:"lumi-stats-skin/v1",name:String(n.name??"Imported Skin").trim().slice(0,80)||"Imported Skin",surfaceStyle:s,frameShape:o,meterStyle:r,...i!==void 0?{accentHue:i}:{},...d!==void 0?{secondaryHue:d}:{},glowIntensity:g,glassBlur:n.glassBlur!==!1,compact:Boolean(n.compact),castLayout:u,...typeof n.customCss==="string"&&n.customCss.trim()?{customCss:n.customCss.slice(0,8000)}:{}}}function Ca(e){let n={};for(let a of e.stats){if(!a.enabled||a.scope==="character")continue;n[a.id]={id:a.id,scope:a.scope,value:a.defaultValue,calibrated:!1,locked:a.locked}}return{initialized:!1,title:"Uncharted Story",canonPremise:"",turnCount:0,elapsedMinutes:0,scene:{location:"",timeLabel:"08:00 AM",dateLabel:"Day 1",weather:"Clear",beatSummary:""},player:{name:"",attire:"",condition:"Normal",notableAction:""},currentPlaceId:"",stats:n,modifiers:[],characters:{},mapZones:{},places:{},mapPaths:[],quests:{},dispatches:[],auditLog:[]}}var Sn="lumi_stats/v1";var xs={sync:'<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.85 1 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z"/>',trash:'<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',copy:'<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',chevronDown:'<path d="m6 9 6 6 6-6"/>',chevronUp:'<path d="m18 15-6-6-6 6"/>',more:'<circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/><circle cx="5" cy="12" r="1.2"/>',plus:'<path d="M12 5v14"/><path d="M5 12h14"/>',pin:'<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1Z"/>',lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',unlock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',sliders:'<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',stage:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m10 9 5 3-5 3Z"/>',stats:'<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',network:'<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M10.8 7.2 6.2 16.8"/><path d="m13.2 7.2 4.6 9.6"/><path d="M7.5 19h9"/>',map:'<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>',globe:'<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"/>',eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',eyeOff:'<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>',check:'<polyline points="20 6 9 17 4 12"/>',close:'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',volume:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',flask:'<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',resize:'<path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/>',palette:'<circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2Z"/>',sparkles:'<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>'};function kn(e,n=14){let s=document.createElementNS("http://www.w3.org/2000/svg","svg");return s.setAttribute("viewBox","0 0 24 24"),s.setAttribute("width",String(n)),s.setAttribute("height",String(n)),s.setAttribute("fill","none"),s.setAttribute("stroke","currentColor"),s.setAttribute("stroke-width","1.9"),s.setAttribute("stroke-linecap","round"),s.setAttribute("stroke-linejoin","round"),s.setAttribute("aria-hidden","true"),s.classList.add("ls-svg-icon"),s.innerHTML=xs[e],s}var Cn=/(<(?:lumi-stats|lumi-tracker|worldweave|json|style|script|pre|code)\b[\s\S]*?<\/(?:lumi-stats|lumi-tracker|worldweave|json|style|script|pre|code)\s*>|```[\s\S]*?```)/gi;function Ta(e){let n=2166136261;for(let a=0;a<e.length;a++)n^=e.charCodeAt(a),n=Math.imul(n,16777619);return(n>>>0).toString(36)}function jt(e){if(!e||typeof e!=="string")return"";let n=(a)=>{let s=a;return s=s.replace(/[\u2800\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g," "),s=s.replace(/[\u180E\u200B-\u200D\u2060\uFEFF]/g,""),s=s.replace(/^[ \t]+(\*[^\s*]|-[^\s\-]|[^\s\-*#+>0-9`~])/gm,"$1"),s=s.replace(/^[ \t]{4,}(?=[-*+]\s|\d+\.\s|>)/gm,"  "),s=s.replace(/[ \t]+\n/g,`
`),s=s.replace(/([^\n \t])[ \t]{2,}([^\n \t])/g,"$1 $2"),s=s.replace(/\n{3,}/g,`

`),s};return e.split(Cn).map((a,s)=>s%2===1?a:n(a)).join("")}function Ia(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function kt(e){if(!Array.isArray(e))return[];let n=new Set;for(let a of e){let s=String(a??"").trim().toLowerCase();if(s.length>=2&&s.length<=64)n.add(s)}return[...n].sort((a,s)=>s.length-a.length)}function Tn(e,n=!0){let a=n?"1":"*";return e.replace(/[aeiouAEIOU]/g,a)}function Ma(e,n,a=!0){if(!e||typeof e!=="string")return"";let s=kt(n);if(!s.length)return e;let o=new RegExp(`(?<![\\p{L}\\p{N}_])(?:${s.map(Ia).join("|")})(?![\\p{L}\\p{N}_])`,"giu");return e.split(Cn).map((r,u)=>u%2===1?r:r.replace(o,(i)=>Tn(i,a))).join("")}function ws(e,n=!0){let a=String(e??"").trim().toLowerCase();if(a.length<2||!/[aeiou]/i.test(a))return null;let s=[...a],o=s.map((v)=>{if(/[aeiou]/i.test(v))return`[${v}${v.toUpperCase()}1*]`;if(/[a-z]/i.test(v))return`[${v}${v.toUpperCase()}]`;return Ia(v)}),r=s[0],u=/[a-z]/i.test(r)&&!/[aeiou]/i.test(r);if(u)o[0]=`([${r}${r.toUpperCase()}])`;let d=`(?=[\\p{L}\\p{N}*'\\- ]{0,${Math.max(0,s.length-1)}}[1*])`,g=s.length>=4?"(?=[a-zA-Z]{0,10}(?![\\p{L}\\p{N}_]))":"(?![\\p{L}\\p{N}_])";return{word:a,findRegex:`(?<![\\p{L}\\p{N}_])${d}${o.join("")}${g}`,replaceString:u?`$1${a.slice(1)}`:a,flags:u?"gu":"giu"}}function La(e,n,a=!0){if(!e||typeof e!=="string")return"";let s=kt(n);if(!s.length)return e;let o=s.map((u)=>{let i=ws(u,a);if(!i)return null;try{return{word:i.word,regex:new RegExp(i.findRegex,i.flags)}}catch{return null}}).filter((u)=>Boolean(u));if(!o.length)return e;let r=(u,i)=>{let d=u.replace(/[^a-zA-Z]/g,"");if(d.length>1&&d===d.toUpperCase())return i.toUpperCase();if(u[0]&&u[0]===u[0].toUpperCase()&&u[0]!==u[0].toLowerCase())return i.charAt(0).toUpperCase()+i.slice(1);return i};return e.split(Cn).map((u,i)=>{if(i%2===1)return u;let d=u;for(let g of o)d=d.replace(g.regex,(v)=>r(v,g.word));return d}).join("")}var Ss="lumi_stats_tts_cache_v1",it="clips",ks=60,Cs=80;class In{connectionsCache=null;voicesByConnId=new Map;memUrlCache=new Map;inFlightSynth=new Map;dbPromise=null;activeAudio=null;playToken=0;isPlaying=!1;activeSpeakerLabel="";cacheHitCount=0;openDb(){if(this.dbPromise)return this.dbPromise;if(typeof indexedDB>"u")return Promise.resolve(null);return this.dbPromise=new Promise((e)=>{try{let n=indexedDB.open(Ss,1);n.onupgradeneeded=()=>{let a=n.result;if(!a.objectStoreNames.contains(it))a.createObjectStore(it,{keyPath:"key"})},n.onsuccess=()=>e(n.result),n.onerror=()=>e(null)}catch{e(null)}}),this.dbPromise}async listConnections(e=!1){if(this.connectionsCache&&!e)return this.connectionsCache;try{let n=await fetch("/api/v1/tts-connections?limit=25",{credentials:"include"});if(!n.ok)return this.connectionsCache??[];let a=await n.json(),s=Array.isArray(a?.data)?a.data:[];return this.connectionsCache=s.map((o)=>({id:String(o.id??""),name:String(o.name??"TTS Connection"),provider:String(o.provider??""),model:String(o.model??""),voice:String(o.voice??""),is_default:Boolean(o.is_default)})),this.connectionsCache}catch{return this.connectionsCache??[]}}async listVoicesForConnection(e){if(!e)return[];let n=this.voicesByConnId.get(e);if(n)return n;try{let a=await fetch(`/api/v1/tts-connections/${encodeURIComponent(e)}/voices`,{credentials:"include"});if(!a.ok)return[];let s=await a.json(),r=(Array.isArray(s?.voices)?s.voices:Array.isArray(s?.data)?s.data:Array.isArray(s)?s:[]).map((u)=>({id:String(u.id??u.voice_id??u.name??""),name:String(u.name??u.label??u.id??""),...typeof u.gender==="string"?{gender:u.gender}:{}})).filter((u)=>Boolean(u.id));return this.voicesByConnId.set(e,r),r}catch{return[]}}rememberMemUrl(e,n){let a=this.memUrlCache.get(e);if(a&&a!==n&&a.startsWith("blob:"))try{URL.revokeObjectURL(a)}catch{}this.memUrlCache.delete(e);while(this.memUrlCache.size>=ks){let s=this.memUrlCache.keys().next().value;if(!s)break;let o=this.memUrlCache.get(s);if(o?.startsWith("blob:"))try{URL.revokeObjectURL(o)}catch{}this.memUrlCache.delete(s)}this.memUrlCache.set(e,n)}async readFromIdbCache(e){let n=await this.openDb();if(!n)return null;return new Promise((a)=>{try{let o=n.transaction(it,"readonly").objectStore(it).get(e);o.onsuccess=()=>{let r=o.result;a(r?.blob instanceof Blob?r.blob:null)},o.onerror=()=>a(null)}catch{a(null)}})}async writeToIdbCache(e,n){let a=await this.openDb();if(!a)return;await new Promise((s)=>{try{let o=a.transaction(it,"readwrite"),r=o.objectStore(it);r.put({key:e,blob:n,updatedAt:Date.now()});let u=r.count();u.onsuccess=()=>{if(u.result>Cs){let i=r.openCursor();i.onsuccess=()=>{let d=i.result;if(d)d.delete()}}},o.oncomplete=()=>s(),o.onerror=()=>s()}catch{s()}})}async synthesizeSegmentCached(e){let n=await this.listConnections(),a=(e.connectionId?n.find((M)=>M.id===e.connectionId):void 0)??n.find((M)=>M.is_default)??n[0];if(!a?.id)return null;let s=a.id,o=e.model||a.model||"",r=e.voiceId||a.voice||"",u=e.text.trim();if(!u)return null;let i=`tts_${Ta(`${s}|${o}|${r}|${u.toLowerCase()}`)}`,d=this.memUrlCache.get(i);if(d)return this.cacheHitCount++,this.rememberMemUrl(i,d),d;let g=this.inFlightSynth.get(i);if(g)return g;let v=(async()=>{let M=await this.readFromIdbCache(i);if(M){this.cacheHitCount++;let h=URL.createObjectURL(M);return this.rememberMemUrl(i,h),h}try{let h=await fetch("/api/v1/tts/synthesize",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({connectionId:s,...o?{model:o}:{},...r?{voice:r}:{},text:u,outputFormat:"mp3"})});if(!h.ok)return null;let x=await h.blob();if(!x.size)return null;this.writeToIdbCache(i,x);let L=URL.createObjectURL(x);return this.rememberMemUrl(i,L),L}catch{return null}})();this.inFlightSynth.set(i,v);try{return await v}finally{if(this.inFlightSynth.get(i)===v)this.inFlightSynth.delete(i)}}prefetchSegments(e){for(let n of e.slice(0,3))this.synthesizeSegmentCached(n)}stop(){if(this.playToken++,this.activeAudio){try{this.activeAudio.pause(),this.activeAudio.removeAttribute("src")}catch{}this.activeAudio=null}this.isPlaying=!1,this.activeSpeakerLabel=""}async playSegments(e,n){if(this.stop(),!e.length)return n?.(),!1;let a=++this.playToken;this.isPlaying=!0,n?.();let s=e.map((o)=>this.synthesizeSegmentCached(o));for(let o=0;o<e.length;o++){if(this.playToken!==a)return!1;let r=e[o],u=await s[o];if(!u||this.playToken!==a)continue;this.activeSpeakerLabel=r.speakerName,n?.(),await new Promise((i)=>{if(this.playToken!==a){i();return}let d=new Audio(u);d.playbackRate=Math.max(0.5,Math.min(2,r.speed||1)),this.activeAudio=d,d.onended=()=>i(),d.onerror=()=>i(),d.play().catch(()=>i())})}if(this.playToken===a)return this.isPlaying=!1,this.activeSpeakerLabel="",this.activeAudio=null,n?.(),!0;return!1}destroy(){this.stop();for(let e of this.memUrlCache.values())if(e.startsWith("blob:"))try{URL.revokeObjectURL(e)}catch{}this.memUrlCache.clear(),this.inFlightSynth.clear()}}var $a=`
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
`;function t(e,n="",a){let s=document.createElement(e);if(n)s.className=n;if(a!==void 0)s.textContent=a;return s}function R(e,n,a="",s){let o=t("button",a,e);if(o.type="button",s)o.title=s,o.setAttribute("aria-label",s);return o.addEventListener("pointerdown",(r)=>{r.stopPropagation()}),o.addEventListener("click",(r)=>{r.stopPropagation(),n(r)}),o}function Q(e,n,a){let s=t("button",a?.className??"ls-btn-sm ls-btn-icon");if(s.type="button",s.append(kn(e,a?.size??14)),a?.label)s.append(t("span","",a.label));if(a?.title)s.title=a.title,s.setAttribute("aria-label",a.title);return s.addEventListener("pointerdown",(o)=>{o.stopPropagation()}),s.addEventListener("click",(o)=>{o.stopPropagation(),n(o)}),s}class Ve{handles=[];track(e){return this.handles.push(e),e}clear(){for(let e of this.handles.splice(0))try{e.destroy()}catch{}}}var Pa=[".ls-drawer-body",".ls-studio-pane",".ls-studio-preview-pane",".ls-hud-content",".ls-dossier-main"],Ea=0;if(typeof document<"u")document.addEventListener("keydown",(e)=>{if(e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement)Ea=Date.now()},{capture:!0,passive:!0});function Mn(e,n,a){let s=document.activeElement,o=Date.now()-Ea<1200,r=Boolean(document.body.querySelector('.ls-dd-menu[data-ls-dd-open="true"]'))||Boolean(e.querySelector('[aria-expanded="true"], [data-state="open"]'))||s instanceof HTMLElement&&e.contains(s)&&s.tagName==="SELECT";if(a?.deferIfTyping&&(o||r)&&s instanceof HTMLElement&&e.contains(s)&&(s.tagName==="INPUT"||s.tagName==="TEXTAREA")&&s.type!=="checkbox"&&s.type!=="radio"){if(a.onDeferredFlush&&!s.dataset.lsBlurDeferred){s.dataset.lsBlurDeferred="true";let d=null,g=()=>{if(d)clearTimeout(d),d=null;delete s.dataset.lsBlurDeferred,s.removeEventListener("blur",g),a.onDeferredFlush?.()};s.addEventListener("blur",g,{once:!0}),d=setTimeout(g,1250)}return!1}let u=new Map;u.set("__root__",{top:e.scrollTop,left:e.scrollLeft});for(let d of Pa){let g=e.querySelector(d);if(g)u.set(d,{top:g.scrollTop,left:g.scrollLeft})}n();let i=u.get("__root__");if(i)e.scrollTop=i.top,e.scrollLeft=i.left;for(let d of Pa){let g=u.get(d);if(!g)continue;let v=e.querySelector(d);if(v)v.scrollTop=g.top,v.scrollLeft=g.left}return!0}function J(e,n,a,s){let o=s.value,r=[...s.options],u=null,i=null,d=t("div","ls-dd-wrap");if(s.compact)d.dataset.compact="true";let g=t("button","ls-dd-trigger");if(g.type="button",g.setAttribute("aria-haspopup","listbox"),g.setAttribute("aria-expanded","false"),s.ariaLabel)g.setAttribute("aria-label",s.ariaLabel);if(s.title)g.title=s.title;let v=t("span","ls-dd-trigger-label"),M=t("span","ls-dd-caret","▾");g.append(v,M),d.append(g),a.replaceChildren(d);let h=()=>{let T=r.find((A)=>A.value===o);v.textContent=T?.label||s.placeholder||r[0]?.label||"Select…"};h();let x=()=>{if(i)i(),i=null;if(u)u.remove(),u=null;g.setAttribute("aria-expanded","false")},L=()=>{x();for(let _ of[...document.body.querySelectorAll('.ls-dd-menu[data-ls-dd-open="true"]')])_.remove();let T=t("div","ls-dd-menu");T.setAttribute("role","listbox"),T.dataset.lsDdOpen="true";let A=getComputedStyle(g);for(let _ of["--ls-bg","--ls-surface","--ls-text","--ls-muted","--ls-primary","--ls-border","--ls-fill","--ls-fill-hover","--ls-radius","--ls-font"]){let D=A.getPropertyValue(_).trim();if(D)T.style.setProperty(_,D)}let w=t("div","ls-dd-list"),f=null,C=(_="")=>{w.replaceChildren();let D=_.trim().toLowerCase(),H=D?r.filter((F)=>F.label.toLowerCase().includes(D)||F.sublabel&&F.sublabel.toLowerCase().includes(D)||F.value.toLowerCase().includes(D)):r;if(!H.length){let F=t("div","ls-muted","No matching options");F.style.padding="6px 8px",w.append(F);return}for(let F of H){let V=t("button","ls-dd-option");if(V.type="button",V.setAttribute("role","option"),V.setAttribute("aria-selected",String(F.value===o)),F.disabled)V.disabled=!0;if(V.append(t("span","",F.label)),F.sublabel)V.append(t("span","ls-dd-sublabel",F.sublabel));V.addEventListener("pointerdown",(O)=>{O.stopPropagation()}),V.addEventListener("click",(O)=>{O.preventDefault(),O.stopPropagation(),o=F.value,h(),x(),s.onChange(F.value)}),w.append(V)}};if(r.length>=6)f=t("input","ls-dd-search"),f.type="text",f.placeholder=s.searchPlaceholder||"Search…",f.addEventListener("pointerdown",(_)=>_.stopPropagation()),f.addEventListener("input",()=>C(f.value)),T.append(f);C(),T.append(w);let P=document.body.getBoundingClientRect(),S=P.width>0&&document.body.offsetWidth>0?P.width/document.body.offsetWidth:1,y=g.getBoundingClientRect(),m=window.innerWidth/S,p=window.innerHeight/S,l=Math.max(Math.round(y.width/S),190),b=Math.min(280,r.length*34+(f?48:16)),I=p-y.bottom/S,c=I<b+12&&y.top/S>I,k=Math.max(8,Math.min(m-l-8,Math.round(y.left/S)));if(T.style.left=`${k}px`,T.style.width=`${l}px`,c)T.style.bottom=`${Math.max(8,Math.round(p-y.top/S+4))}px`;else T.style.top=`${Math.max(8,Math.round(y.bottom/S+4))}px`;if(document.body.append(T),u=T,g.setAttribute("aria-expanded","true"),f)requestAnimationFrame(()=>f?.focus());let E=(_)=>{let D=_.target;if(!D)return;if(T.contains(D)||g.contains(D))return;x()},B=(_)=>{if(_.key==="Escape")_.stopPropagation(),x(),g.focus()},N=(_)=>{if(_.type==="resize"&&f&&document.activeElement===f)return;if(_.target instanceof Node&&T.contains(_.target))return;x()};window.addEventListener("pointerdown",E,!0),window.addEventListener("keydown",B,!0),window.addEventListener("resize",N,{passive:!0}),window.addEventListener("scroll",N,{capture:!0,passive:!0}),i=()=>{window.removeEventListener("pointerdown",E,!0),window.removeEventListener("keydown",B,!0),window.removeEventListener("resize",N),window.removeEventListener("scroll",N,!0)}};return g.addEventListener("pointerdown",(T)=>{T.stopPropagation()}),g.addEventListener("click",(T)=>{if(T.preventDefault(),T.stopPropagation(),u)x();else L()}),n?.track({destroy:x}),{getValue:()=>o,setValue:(T)=>{o=T,h()},setOptions:(T,A)=>{if(r=[...T],A!==void 0)o=A;if(h(),u)L()}}}function me(e,n,a,s){let o=t("label","ls-toggle-switch");if(s.size==="md")o.dataset.size="md";let r=t("input");if(r.type="checkbox",r.checked=s.checked,r.disabled=Boolean(s.disabled),s.ariaLabel)r.setAttribute("aria-label",s.ariaLabel);r.addEventListener("change",()=>s.onChange(r.checked));let u=t("span","ls-toggle-track");o.append(r,u),a.replaceChildren(o)}function xe(e,n,a,s){let o=t("label","ls-check-row"),r=t("input");r.type="checkbox",r.checked=s.checked,r.disabled=Boolean(s.disabled),r.addEventListener("change",()=>s.onChange(r.checked)),o.append(r,t("span","",s.label)),a.replaceChildren(o)}var Aa=new Map;function fe(e,n,a,s){let o=t("details","ls-accordion"),r=s.persistKey?Aa.get(s.persistKey):void 0;o.open=r!==void 0?r:Boolean(s.defaultExpanded);let u=t("summary","ls-accordion-head"),i=t("span","ls-row");if(s.iconName)i.append(kn(s.iconName,14));i.append(t("strong","",s.title));let d=t("span","ls-row");if(s.badge!==void 0)d.append(t("span","ls-chip",String(s.badge)));d.append(t("span","ls-accordion-chev","▾")),u.append(i,d);let g=t("div","ls-accordion-body ls-stack");return o.append(u,g),o.addEventListener("toggle",()=>{if(s.persistKey)Aa.set(s.persistKey,o.open);s.onToggle?.(o.open)}),a.append(o),g}function Ut(e,n,a,s){let o=async(d,g)=>{if(typeof e.ui?.showContextMenu!=="function")return;let v=a();if(!v.length)return;let M=await e.ui.showContextMenu({position:{x:d,y:g},items:v});if(M.selectedKey)s(M.selectedKey)};n.addEventListener("contextmenu",(d)=>{d.preventDefault(),d.stopPropagation(),o(d.clientX,d.clientY)});let r=null,u=!1,i={x:0,y:0};n.addEventListener("touchstart",(d)=>{u=!1;let g=d.touches[0];if(!g)return;i={x:g.clientX,y:g.clientY},r=setTimeout(()=>{u=!0,navigator.vibrate?.(40),o(g.clientX,g.clientY)},500)},{passive:!0}),n.addEventListener("touchmove",(d)=>{if(!r)return;let g=d.touches[0];if(!g)return;if(Math.abs(g.clientX-i.x)>10||Math.abs(g.clientY-i.y)>10)clearTimeout(r),r=null},{passive:!0}),n.addEventListener("touchend",(d)=>{if(r)clearTimeout(r),r=null;if(u)d.preventDefault(),u=!1})}class _a{ctx;activeModals=new Set;constructor(e){this.ctx=e}hasOpenModals(){return this.activeModals.size>0}open(e,n){if(typeof this.ctx.ui?.showModal!=="function"){console.warn("[LumiStats ModalManager] ctx.ui.showModal is not a function — cannot open modal");return}if(this.activeModals.size>=2)this.activeModals.values().next().value?.dismiss();let a=new Ve;console.log("[LumiStats ModalManager] calling ctx.ui.showModal, title:",e.title);let s=this.ctx.ui.showModal({title:e.title,width:e.width??640,maxHeight:e.maxHeight??760,persistent:e.persistent??!1});return console.log("[LumiStats ModalManager] showModal returned handle:",s,"root connected:",s?.root?.isConnected),this.activeModals.add(s),s.root.classList.add("ls-root"),s.root.style.cssText+=";padding:16px;overflow-y:auto;height:auto;max-height:min(80vh, 740px);",s.onDismiss(()=>{a.clear(),this.activeModals.delete(s)}),n(s.root,()=>s.dismiss(),s,a),s}async confirm(e){if(typeof this.ctx.ui?.showConfirm==="function"){let n=await this.ctx.ui.showConfirm({title:e.title,message:e.message,confirmLabel:e.confirmLabel??"Confirm",variant:e.variant??"warning"});return Boolean(n?.confirmed)}return!1}closeAll(){for(let e of[...this.activeModals])e.dismiss();this.activeModals.clear()}}var Ct=new WeakMap;function Na(e){let n=Ct.get(document);if(n)return n.count++,()=>{if(n.count--,n.count<=0)Ct.delete(document),n.remove()};let a=e.dom.addStyle($a);return Ct.set(document,{count:1,remove:a}),()=>{let s=Ct.get(document);if(!s)return;if(s.count--,s.count<=0)Ct.delete(document),s.remove()}}function Tt(e,n){e.modals.open({title:"✨ Create New Lumi Stats Template",width:520},(a,s,o,r)=>{let u=t("div","ls-grid"),i=t("label","ls-label","Icon Emoji"),d=t("input","ls-input");d.value="✨",i.append(d);let g=t("label","ls-label","Template Name"),v=t("input","ls-input");v.placeholder="e.g. Modern Drama & Chemistry, Dark Fantasy RPG…",v.value="",g.append(v),u.append(i,g);let M=t("label","ls-label","Short Description"),h=t("input","ls-input");h.placeholder="What kind of story or stats does this template track?",M.append(h);let x="universal_companion",L=t("div","ls-label","Starter Stat Blueprint"),T=t("div");L.append(T);let A=e.customTemplates.filter((b)=>!e.builtinTemplates.some((I)=>I.id===b.id)).map((b)=>({value:b.id,label:`${b.icon} ${b.name} (Saved · ${b.stats.length} stats)`}));J(e,r,T,{value:x,ariaLabel:"Starter Stat Blueprint",options:[{value:"empty",label:"\uD83E\uDDF9 Empty Canvas (0 stats — start completely from scratch)"},{value:"blank",label:"\uD83C\uDF31 Clean Minimal Starter (1 Trust meter — build your own)"},...A,...e.builtinTemplates.map((b)=>({value:b.id,label:`${b.icon} ${b.name} (${b.stats.length} stats)`}))],onChange:(b)=>{x=b}});let w="post_history",f=1,C=t("div","ls-label","\uD83E\uDDE0 AI Prompt Placement (Where Lumi State Is Sent)"),P=t("div","ls-row"),S=t("div","ls-row");S.style.display="none";let y=()=>{for(let b of[...P.querySelectorAll("button")])b.setAttribute("aria-current",b.dataset.pos===w?"page":"false");S.style.display=w==="in_history"?"flex":"none"};for(let[b,I]of[["pre_history","⬆️ Before History"],["in_history","\uD83D\uDCAC Within History"],["post_history","⬇️ After History"]]){let c=R(I,()=>{w=b,y()},"ls-btn-sm");c.dataset.pos=b,P.append(c)}let m=t("input","ls-input");m.type="number",m.min="0",m.max="20",m.style.width="76px",m.value=String(f),m.addEventListener("change",()=>{f=Math.max(0,Math.min(20,Math.round(Number(m.value)||0)))}),S.append(t("small","ls-muted","History Depth:"),m),y(),C.append(P,S);let p=t("small","ls-muted");p.style.cssText="color:var(--ls-danger);display:none;";let l=R("✨ Create & Activate Template",()=>{let b=v.value.trim()||"My Custom Template",I=d.value.trim()||"✨",c=h.value.trim()||"Custom roleplay tracker template.";l.disabled=!0,l.textContent="⏳ Creating…",p.style.display="none",e.request("template:createNew",{name:b,icon:I,description:c,starter:x,promptPosition:w,promptDepth:f}).then(()=>{e.notify(`Created & activated "${I} ${b}"!`),s(),n?.()}).catch((k)=>{if(p.textContent=k instanceof Error?k.message:String(k),p.style.display="block",l.isConnected)l.disabled=!1,l.textContent="✨ Create & Activate Template"})},"ls-btn-primary");l.style.marginTop="10px",a.append(u,M,L,C,p,l),requestAnimationFrame(()=>v.focus())})}function lt(e,n){e.modals.open({title:"\uD83C\uDFAD Quick Template, Game Skin & Placement Switcher",width:660,maxHeight:800},(a,s,o)=>{let r=()=>{let{template:i}=e.snapshot,d=[...e.builtinTemplates,...e.customTemplates.filter((y)=>!e.builtinTemplates.some((m)=>m.id===y.id))];a.replaceChildren();let g=t("div","ls-row-between");g.append(t("span","ls-kicker",`Active: ${i.icon} ${i.name}`),t("div","ls-row")),g.lastElementChild.append(R("✨ + New Template",()=>{s(),Tt(e)},"ls-btn-sm ls-btn-primary"),...n?[R("⚙️ Full Studio",()=>{s(),n()},"ls-btn-sm")]:[]),a.append(g);let v=t("div","ls-card");v.append(t("span","ls-kicker","\uD83C\uDFAE 1-Click Game Skin & Placement"));let M=t("div","ls-row");for(let y of Vt){let m=R(y.name,()=>{e.applySkinPack(y)},"ls-btn-sm");if((i.theme.surfaceStyle||"glass")===y.surfaceStyle)m.setAttribute("aria-current","page");M.append(m)}let h=t("div","ls-row");for(let[y,m]of[["both_bottom","✨ HUD + Below Reply"],["both_top","✨ HUD + Above Reply"],["inline_bottom","\uD83D\uDCAC Below Reply Only"],["floating_only","\uD83E\uDE9F Floating HUD Only"]]){let p=R(m,()=>{e.request("state:mutate",{templatePatch:{theme:{...i.theme,placement:y}},reason:"Updated placement mode"})},"ls-btn-sm");if(i.theme.placement===y)p.setAttribute("aria-current","page");h.append(p)}let x=t("div","ls-row");x.append(t("small","ls-muted","Cast Tab:"));for(let[y,m]of[["roster","\uD83D\uDC65 Icon Roster (In Scene / Away)"],["cards","\uD83D\uDDC2️ All Cards Expanded"]]){let p=R(m,()=>{e.request("state:mutate",{templatePatch:{theme:{...i.theme,castLayout:y}},reason:"Updated cast layout mode"})},"ls-btn-sm");if((i.theme.castLayout||"roster")===y)p.setAttribute("aria-current","page");x.append(p)}let L=t("div","ls-row");L.append(t("small","ls-muted","Widget Tabs:"));for(let[y,m]of[[!1,"\uD83C\uDFF7️ Icons + Text"],[!0,"✨ Icons Only"]]){let p=R(m,()=>{e.request("state:mutate",{templatePatch:{theme:{...i.theme,widgetTabsIconOnly:y}},reason:`Set widget tabs to ${y?"icons only":"icons + labels"}`})},"ls-btn-sm");if(Boolean(i.theme.widgetTabsIconOnly)===y)p.setAttribute("aria-current","page");L.append(p)}let T=t("div","ls-row");T.append(t("small","ls-muted","Send State:"));for(let[y,m]of[["pre_history","⬆️ Before History"],["in_history","\uD83D\uDCAC Within History"],["post_history","⬇️ After History"]]){let p=R(m,()=>{e.request("state:mutate",{templatePatch:{promptPosition:y},reason:`Set Lumi State prompt position to ${y}`})},"ls-btn-sm");if((i.promptPosition||"post_history")===y)p.setAttribute("aria-current","page");T.append(p)}if(i.promptPosition==="in_history"){let y=t("input","ls-input");y.type="number",y.min="0",y.max="20",y.title="History depth (messages back from end)",y.style.cssText="width:62px;min-height:27px;padding:2px 6px;font-size:11px;",y.value=String(Math.max(0,Math.round(Number(i.promptDepth??1)||0))),y.addEventListener("change",()=>{let m=Math.max(0,Math.min(20,Math.round(Number(y.value)||0)));e.request("state:mutate",{templatePatch:{promptDepth:m},reason:`Set Lumi State depth to ${m}`})}),T.append(t("small","ls-muted","Depth:"),y)}let A=t("div","ls-row");A.append(t("small","ls-muted","Pill Skin:"));let w=t("div");w.style.minWidth="210px",A.append(w),J(e,void 0,w,{value:i.theme.pillStyle||"glass_capsule",compact:!0,ariaLabel:"Collapsed Pill Skin",options:[{value:"glass_capsule",label:"✨ Frosted Split Capsule (Best)"},{value:"vn_dialogue_bar",label:"\uD83C\uDFAC VN Cinema Strip"},{value:"rpg_status_bar",label:"⚔️ JRPG Party Status Bar"},{value:"persona_ticker",label:"\uD83C\uDCCF Stylish Pop Ticker"},{value:"cyber_telemetry",label:"\uD83D\uDEF8 Cyber Telemetry"},{value:"minimal_floating",label:"☁️ Minimal Ghost Pill"},{value:"neon_edge",label:"⚡ Neon Glow Rail"},{value:"split_deck",label:"\uD83D\uDDC2️ Dual-Deck Card Pill"},{value:"compact_badge",label:"\uD83D\uDCF1 Micro Compact Badge"},{value:"ledger_strip",label:"\uD83D\uDCDC Editorial Case Strip"}],onChange:(y)=>{e.request("state:mutate",{templatePatch:{theme:{...i.theme,pillStyle:y}},reason:`Changed Pill Skin to ${y}`})}}),v.append(M,A,h,x,L,T),a.append(v);let f=d.filter((y)=>!e.builtinTemplates.some((m)=>m.id===y.id)),C=d.filter((y)=>e.builtinTemplates.some((m)=>m.id===y.id)),P=[...f,...C],S=t("div","ls-grid");S.style.marginTop="8px";for(let y of P){let m=y.id===i.id,p=!e.builtinTemplates.some((c)=>c.id===y.id),l=t("div","ls-preset-card");l.dataset.active=String(m);let b=t("div","ls-row-between");b.append(t("strong","",`${y.icon} ${y.name}`),t("span",`ls-chip ${p?"ls-chip-accent":""}`,p?"Saved Custom":"Built-In"));let I=t("div","ls-row");if(m)I.append(t("span","ls-chip ls-chip-accent","✓ Active"));else{let c=R("Activate",()=>{c.disabled=!0,c.textContent="Applying…",e.request("template:apply",{templateId:y.id,template:y}).then(()=>e.notify(`Switched to "${y.name}"`)).catch((k)=>{if(e.notify(k instanceof Error?k.message:String(k),!0),c.isConnected)c.disabled=!1,c.textContent="Activate"})},"ls-btn-sm ls-btn-primary");I.append(c)}I.append(R("\uD83D\uDCCB Duplicate",()=>{e.request("template:duplicate",{sourceTemplateId:y.id,template:y,name:`${y.name} (Custom)`}).then(()=>e.notify(`Duplicated "${y.name}"`)).catch((c)=>e.notify(c instanceof Error?c.message:String(c),!0))},"ls-btn-sm")),l.append(b,t("small","ls-muted",y.description),I),S.append(l)}a.append(S)};r();let u=e.subscribe(r);o.onDismiss(u)})}function Ts(){if(typeof crypto<"u"&&typeof crypto.randomUUID==="function")return crypto.randomUUID();if(typeof crypto<"u"&&typeof crypto.getRandomValues==="function"){let e=new Uint8Array(16);crypto.getRandomValues(e),e[6]=e[6]&15|64,e[8]=e[8]&63|128;let n=Array.from(e,(a)=>a.toString(16).padStart(2,"0")).join("");return`${n.slice(0,8)}-${n.slice(8,12)}-${n.slice(12,16)}-${n.slice(16,20)}-${n.slice(20)}`}return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(e)=>{let n=Math.random()*16|0;return(e==="x"?n:n&3|8).toString(16)})}class Ln{ctx;modals;tts=new In;chatId="";snapshot;settings;customTemplates=[];builtinTemplates=wa;connections=[];recentTurns=[];copilotTurns=[];activeProposal;busy=!1;statusText="";statusError=!1;isGenerationStreaming=!1;isDrawerTabVisible=!0;vnStageOpen=!1;studioOpen=!1;vnShowHudWidget=!0;onToggleVnStage=null;activeDrawerTab="Stats";activeSurfaceTab="stats";activeInlineTab="stats";activeDossierTab="overview";dossierEditMode=!1;webFilterMode="all";activeCopilotMode="ask";inlineExpanded=!1;widgetExpanded=!1;selectedActorId="";openedCastTabs=[];activeCastTabActorId="";selectedPlaceId="";hydratingChat=!1;activeOverlayCleanup=null;onResizeWidgetLive=null;lastThemeAppliedChatId="";customCssEl=null;pendingRpc=new Map;listeners=new Set;statusListeners=new Set;disposers=[];constructor(e){this.ctx=e;this.modals=new _a(e);let n=ke();this.snapshot={schemaVersion:1,chatId:"",revision:0,state:Ca(n),template:n,deltas:{statDeltas:{},characterDeltas:{}},bindings:[],checkpoints:[]},this.disposers.push(e.onBackendMessage((a)=>{if(!a||typeof a!=="object")return;let s=a;if(s.channel!==Sn)return;if(s.type==="rpc_ack"&&typeof s.requestId==="string"){let r=this.pendingRpc.get(s.requestId);if(r){clearTimeout(r.timer),this.pendingRpc.delete(s.requestId);let u=s;if(u.ok)r.resolve(u.data??{});else this.notify(u.error??"Operation failed",!0),r.reject(Error(u.error??"Operation failed"))}return}let o=typeof s.resolvedChatId==="string"&&s.resolvedChatId?s.resolvedChatId:typeof s.chatId==="string"&&s.chatId!=="sandbox"?s.chatId:"";if(!this.chatId&&o)this.chatId=o;if(o&&this.chatId&&o!==this.chatId)return;if(s.type==="snapshot"&&s.snapshot){this.hydratingChat=!1,this.snapshot=s.snapshot;let r=this.snapshot.template.surfaces,u=r.widgetTabs.filter((g)=>g.enabled);if(u.length&&!u.some((g)=>g.id===this.activeSurfaceTab))this.activeSurfaceTab=u[0].id;let i=r.inlineTabs.filter((g)=>g.enabled);if(i.length&&!i.some((g)=>g.id===this.activeInlineTab))this.activeInlineTab=i[0].id;let d=r.dossierTabs.filter((g)=>g.enabled);if(d.length&&!d.some((g)=>g.id===this.activeDossierTab))this.activeDossierTab=d[0].id;if(this.chatId&&this.lastThemeAppliedChatId!==this.chatId)this.lastThemeAppliedChatId=this.chatId,this.inlineExpanded=Boolean(this.snapshot.template.theme.inlineDefaultExpanded);if(this.selectedActorId&&!this.snapshot.state.characters[this.selectedActorId])this.selectedActorId="";if(this.openedCastTabs=this.openedCastTabs.filter((g)=>Boolean(this.snapshot.state.characters[g])),this.activeCastTabActorId&&!this.snapshot.state.characters[this.activeCastTabActorId])this.activeCastTabActorId="";if(this.selectedPlaceId&&!this.snapshot.state.places[this.selectedPlaceId])this.selectedPlaceId="";if(s.settings){if(this.settings=s.settings,typeof this.settings.vnShowHudWidget==="boolean")this.vnShowHudWidget=this.settings.vnShowHudWidget}if(Array.isArray(s.customTemplates))this.customTemplates=s.customTemplates;if(Array.isArray(s.copilotTurns))this.copilotTurns=s.copilotTurns;this.busy=s.busy===!0,this.applyTemplateThemeToDom(),this.emitChange(),this.emitStatusChange()}else if(s.type==="status")this.busy=s.busy===!0,this.statusText=String(s.text??""),this.statusError=!1,this.emitStatusChange();else if(s.type==="error")this.busy=!1,this.notify(String(s.message??"Error"),!0)}))}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}subscribeStatus(e){return this.statusListeners.add(e),()=>this.statusListeners.delete(e)}applySkinPack(e){let n=ka(e),a=this.snapshot.template.theme;this.request("state:mutate",{templatePatch:{theme:{...a,surfaceStyle:n.surfaceStyle,frameShape:n.frameShape,meterStyle:n.meterStyle,accentHue:n.accentHue,secondaryHue:n.secondaryHue,glowIntensity:n.glowIntensity??55,glassBlur:n.glassBlur!==!1,compact:Boolean(n.compact),castLayout:n.castLayout??a.castLayout??"roster",...n.customCss!==void 0?{customCss:n.customCss}:{}}},reason:`Applied visual skin "${n.name}"`}),this.notify(`Applied "${n.name}" visual skin!`)}stampThemeOnElement(e){let n=this.snapshot.template.theme,a=n.surfaceStyle||"glass",s=n.frameShape||(n.radiusPreset==="sharp"?"sharp":"rounded"),o=n.meterStyle||"smooth",r=n.glassBlur!==!1,u=Math.max(0,Math.min(100,Number(n.glowIntensity??55)))/100,i=Boolean(n.compact),d=typeof n.accentHue==="number"&&Number.isFinite(n.accentHue),g=typeof n.secondaryHue==="number"&&Number.isFinite(n.secondaryHue);if(e.dataset.lsStyle=a,e.dataset.lsPill=n.pillStyle||"glass_capsule",e.dataset.lsFrame=s,e.dataset.lsMeter=o,e.dataset.lsBlur=String(r),e.dataset.lsCompact=String(i),e.style.setProperty("--ls-glow",u.toFixed(2)),d)e.style.setProperty("--ls-primary",`hsl(${n.accentHue}, 86%, 62%)`);else e.style.removeProperty("--ls-primary");if(g)e.style.setProperty("--ls-accent",`hsl(${n.secondaryHue}, 82%, 68%)`);else if(d)e.style.setProperty("--ls-accent",`hsl(${(n.accentHue+28)%360}, 82%, 68%)`);else e.style.removeProperty("--ls-accent")}applyTemplateThemeToDom(){if(typeof document>"u")return;let e=this.snapshot.template.theme;for(let a of document.querySelectorAll(".ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay"))this.stampThemeOnElement(a);let n=(e.customCss||"").trim();if(n){let a=n.replace(/@import\b[^;]*;?/gi,"").replace(/url\s*\([^)]*\)/gi,"");if(!this.customCssEl)this.customCssEl=document.createElement("style"),this.customCssEl.dataset.lsCustomCss="true",document.head.append(this.customCssEl);if(this.customCssEl.textContent!==a)this.customCssEl.textContent=a}else if(this.customCssEl)this.customCssEl.remove(),this.customCssEl=null}emitChange(){for(let e of this.listeners)e();this.applyTemplateThemeToDom()}emitStatusChange(){for(let e of this.statusListeners)e()}notify(e,n=!1){this.statusText=e,this.statusError=n,this.emitStatusChange()}request(e,n={}){let a=this.chatId||"sandbox",s=Ts();return new Promise((o,r)=>{let u=setTimeout(()=>{this.pendingRpc.delete(s),r(Error(`RPC timeout waiting for ${e}`))},60000);this.pendingRpc.set(s,{resolve:o,reject:r,timer:u});let i={channel:Sn,requestId:s,chatId:a,type:e,payload:n};this.ctx.sendToBackend(i)})}isActivityForActiveChat(e){let n="";try{n=this.ctx.getActiveChat?.()?.chatId??""}catch{n=""}if(n&&n!==this.chatId)this.refreshActiveChat(n);let a=n||this.chatId;if(!a){if(e&&e!=="sandbox")this.refreshActiveChat(e);return!0}return!e||e===a}async refreshActiveChat(e){let n=typeof e==="string"?e.trim():"";if(!n&&e!==null)try{n=this.ctx.getActiveChat?.()?.chatId??""}catch{n=""}if(n!==this.chatId)this.chatId=n,this.selectedActorId="",this.openedCastTabs=[],this.activeCastTabActorId="",this.selectedPlaceId="",this.activeProposal=void 0;this.hydratingChat=!0;let a=await this.request("snapshot:get").catch(()=>({}));if(this.hydratingChat=!1,typeof a.resolvedChatId==="string"&&a.resolvedChatId&&!this.chatId)this.chatId=a.resolvedChatId;if(Array.isArray(a.connections))this.connections=a.connections;if(Array.isArray(a.recentTurns))this.recentTurns=a.recentTurns;this.emitChange()}toggleVnStage(){this.onToggleVnStage?.()}uploadStageVariantAsset(e){this.ctx.uploads.pickFile({accept:["image/png","image/jpeg","image/webp","image/gif"],multiple:!1,maxSizeBytes:6000000}).then((n)=>{let a=n[0];if(!a)return;let s=32768,o="";for(let r=0;r<a.bytes.length;r+=s)o+=String.fromCharCode(...a.bytes.subarray(r,r+s));this.notify("⏳ Uploading & saving stage asset variant…"),this.request("asset:upload",{dataUrl:`data:${a.mimeType||"image/png"};base64,${btoa(o)}`,...e})}).catch((n)=>this.notify(n instanceof Error?n.message:String(n),!0))}pickAndUploadImage(e,n,a="neutral"){this.ctx.uploads.pickFile({accept:["image/png","image/jpeg","image/webp","image/gif"],multiple:!1,maxSizeBytes:6000000}).then((s)=>{let o=s[0];if(!o)return;let r=32768,u="";for(let i=0;i<o.bytes.length;i+=r)u+=String.fromCharCode(...o.bytes.subarray(i,i+r));this.notify(`⏳ Uploading ${n}…`),this.request("asset:upload",{dataUrl:`data:${o.mimeType||"image/png"};base64,${btoa(u)}`,targetId:e,kind:n,variant:a})}).catch((s)=>this.notify(s instanceof Error?s.message:String(s),!0))}destroy(){if(this.tts.destroy(),this.customCssEl)this.customCssEl.remove(),this.customCssEl=null;if(this.activeOverlayCleanup)this.activeOverlayCleanup(),this.activeOverlayCleanup=null;this.modals.closeAll();for(let e of this.pendingRpc.values())clearTimeout(e.timer);this.pendingRpc.clear();for(let e of this.disposers.splice(0))e();this.listeners.clear(),this.statusListeners.clear()}}function Kt(e){let n={};if(typeof e==="number"&&Number.isFinite(e))return n.value=e,n;let a=String(e??"").trim();if(!a||a==="None")return n;let s=Number(a);if(Number.isFinite(s))n.value=s;let o=/\b([A-Za-z][A-Za-z0-9_]{0,20})\s*[:=]?\s*(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)\b/g,r;while((r=o.exec(a))!==null){let d=r[1],g=Number(r[2]),v=Number(r[3]);if(Number.isFinite(g))n[d]=g,n[`${d}_cur`]=g,n[d.toLowerCase()]=g,n[`${d.toLowerCase()}_cur`]=g;if(Number.isFinite(v))n[`${d}_max`]=v,n[`${d.toLowerCase()}_max`]=v}let u=a.match(/(-?\d+(?:\.\d+)?)\s*%/);if(u){let d=Number(u[1]);if(Number.isFinite(d))n.pct=d}let i=/\b([A-Za-z][A-Za-z0-9_]{0,20})(?:\s*[:=]\s*|\.\s*|\s+|(?=-?\d))(-?\d+(?:\.\d+)?)\b(?!\s*\/)/g;while((r=i.exec(a))!==null){let d=r[1],g=Number(r[2]);if(!Number.isFinite(g))continue;if(n[d]===void 0)n[d]=g;if(n[d.toLowerCase()]===void 0)n[d.toLowerCase()]=g}return n}function Is(e){let n=e.trim();if(!n||n.includes("{{"))return!1;if(/^(?:compute|calculate|format|write|track|update|use)\b/i.test(n))return!0;if(/\.\s+[A-Za-z]+\s+[a-z]+\s+[a-z]+/.test(n))return!0;if(/\b(?:loses|per\s+\d|during|whenever|only\s+if|in\s+this\s+format)\b/i.test(n))return!0;return!1}function je(e,n,a,s){let o=e.trim();if(!o||o.length>1000)return;let r=0,u=0,i=()=>{while(r<o.length&&/\s/.test(o[r]??""))r++},d=()=>{let f=o[r];r++;let C="";while(r<o.length){let P=o[r];if(P==="\\"&&r+1<o.length){C+=o[r+1],r+=2;continue}if(P===f)return r++,C;C+=P,r++}throw Error("Unterminated string literal")},g=(f)=>{if(Object.prototype.hasOwnProperty.call(n,f))return n[f];let C=f.toLowerCase();for(let[S,y]of Object.entries(n))if(S.toLowerCase()===C)return y;let P=a.resolveRef(f);if(P!==void 0&&Number.isFinite(P))return P;return s?.missingRefs.add(f),NaN},v=(f,C)=>{let P=f.toLowerCase();if(P==="round"){if(!C.length)return NaN;let y=10**(C[1]!==void 0&&Number.isFinite(C[1])?Math.max(0,Math.min(6,Math.round(C[1]))):0);return Math.round(C[0]*y)/y}if(P==="floor")return C.length?Math.floor(C[0]):NaN;if(P==="ceil")return C.length?Math.ceil(C[0]):NaN;if(P==="abs")return C.length?Math.abs(C[0]):NaN;if(P==="min")return C.length?Math.min(...C):NaN;if(P==="max")return C.length?Math.max(...C):NaN;if(P==="mod")return C.length>=2&&C[1]!==0?C[0]%C[1]:NaN;if(P==="clamp"){if(C.length<3)return NaN;return Math.max(C[1],Math.min(C[2],C[0]))}if(P==="if"){if(C.length<2)return NaN;let S=C[0];return S!==0&&!Number.isNaN(S)?C[1]:C[2]??0}throw Error(`Unknown function: ${f}`)},M=()=>{if(++u>800)throw Error("Formula complexity limit exceeded");i();let f=o[r];if(f==="+"||f==="-"||f==="!"){r++;let S=M();if(f==="!")return S===0||Number.isNaN(S)?1:0;return f==="-"?-S:S}if(f==="("){r++;let S=w();if(i(),o[r]!==")")throw Error("Unclosed parenthesis");return r++,S}if(f==="["){let S=o.indexOf("]",r+1);if(S<0)throw Error("Unclosed bracket reference");let y=o.slice(r+1,S).trim();r=S+1;let m=a.resolveRef(y);if(m!==void 0&&Number.isFinite(m))return m;return s?.missingRefs.add(y),NaN}let C=o.slice(r).match(/^(?:\d+(?:\.\d+)?|\.\d+)/);if(C)return r+=C[0].length,Number(C[0]);let P=o.slice(r).match(/^[A-Za-z_][A-Za-z0-9_.]*/);if(P){let S=P[0];if(r+=S.length,i(),o[r]==="("){r++,i();let y=S.toLowerCase();if(y==="hascond"||y==="hasflag"){let p=!1;if(o[r]==='"'||o[r]==="'"){let l=d();p=a.hasCond(l),i()}if(o[r]!==")")throw Error(`Expected ) after ${S}`);return r++,p?1:0}if(y==="match"||y==="matches"){let p="",l="";if(o[r]==='"'||o[r]==="'")p=d();else{let b=r;while(r<o.length&&o[r]!==","&&o[r]!==")")r++;let I=o.slice(b,r).trim();p=a.resolveStringRef(I)??String(g(I)||"")}if(i(),o[r]===","){if(r++,i(),o[r]==='"'||o[r]==="'")l=d()}if(i(),o[r]!==")")throw Error("Expected ) after match()");if(r++,!l)return 0;try{return new RegExp(l,"i").test(p)?1:0}catch{return p.toLowerCase().includes(l.toLowerCase())?1:0}}let m=[];if(o[r]!==")")while(!0){if(m.push(w()),i(),o[r]===","){r++;continue}break}if(o[r]!==")")throw Error(`Expected ) in ${S}()`);return r++,v(S,m)}return g(S)}throw Error(`Unexpected character near "${o.slice(r,r+18)}"`)},h=()=>{let f=M();while(!0){i();let C=o[r];if(C!=="*"&&C!=="/"&&C!=="%")return f;r++;let P=M();if((C==="/"||C==="%")&&P===0)return NaN;f=C==="*"?f*P:C==="/"?f/P:f%P}},x=()=>{let f=h();while(!0){i();let C=o[r];if(C!=="+"&&C!=="-")return f;r++;let P=h();f=C==="+"?f+P:f-P}},L=()=>{let f=x();while(!0){i();let C=o.slice(r,r+2),P=o[r],S="";if(C==="<="||C===">="||C==="=="||C==="!=")S=C;else if(P==="<"||P===">")S=P;if(!S)return f;r+=S.length;let y=x();if(S==="<=")f=f<=y?1:0;else if(S===">=")f=f>=y?1:0;else if(S==="==")f=f===y?1:0;else if(S==="!=")f=f!==y?1:0;else if(S==="<")f=f<y?1:0;else f=f>y?1:0}},T=()=>{let f=L();while(!0){if(i(),o.slice(r,r+2)!=="&&")return f;r+=2;let C=L();f=f!==0&&!Number.isNaN(f)&&C!==0&&!Number.isNaN(C)?1:0}},A=()=>{let f=T();while(!0){if(i(),o.slice(r,r+2)!=="||")return f;r+=2;let C=T();f=f!==0&&!Number.isNaN(f)||C!==0&&!Number.isNaN(C)?1:0}},w=()=>{let f=A();if(i(),o[r]!=="?")return f;r++;let C=w();if(i(),o[r]!==":")throw Error('Expected ":" in ternary expression');r++;let P=w();return f!==0&&!Number.isNaN(f)?C:P};try{let f=w();if(i(),r!==o.length){if(s)s.error=`Unexpected character near "${o.slice(r,r+18)}"`;return}if(!Number.isFinite(f))return;return Number(f.toFixed(2))}catch(f){if(s)s.error=f instanceof Error?f.message:String(f);return}}function It(e){let n=e.trim().toLowerCase();return!["","0","false","null","undefined","no","off"].includes(n)}function qt(e){let n=[],a=0,s="";for(let o=0;o<e.length;o++){if(e[o]==="{"&&e[o+1]==="{"){a++,s+="{{",o++;continue}if(e[o]==="}"&&e[o+1]==="}"&&a>0){a--,s+="}}",o++;continue}if(a===0&&e[o]===":"&&e[o+1]===":"){n.push(s),s="",o++;continue}s+=e[o]}return n.push(s),n}function Ba(e,n){let a=0;for(let s=n;s<e.length-1;s++)if(e[s]==="{"&&e[s+1]==="{")a++,s++;else if(e[s]==="}"&&e[s+1]==="}"){if(a--,a===0)return s+2;s++}return-1}function Mt(e,n,a){let s=new RegExp(`^\\{\\{\\s*#?${a}(?:\\s|::|\\}\\})`,"i"),o=new RegExp(`^\\{\\{\\s*\\/${a}\\s*\\}\\}`,"i"),r=1;for(let u=n;u<e.length;u++)if(e[u]==="{"&&e[u+1]==="{"){let i=e.slice(u);if(o.test(i)){if(r--,r===0){let d=e.indexOf("}}",u);return{bodyEnd:u,closeEnd:d+2}}}else if(s.test(i))r++}return null}function Ms(e){let n=[],a="",s=0,o=0,r=null,u=!1;for(let d=0;d<e.length;d++){if(e[d]!=="{"||e[d+1]!=="{")continue;let g=Ba(e,d);if(g<0)continue;let v=e.slice(d+2,g-2).trim();if(/^#?(?:if|unless)\b/i.test(v))s++;else if(/^\/(?:if|unless)\b/i.test(v))s=Math.max(0,s-1);else if(s===0&&/^(?:elseif|elif)\b/i.test(v)){let M=e.slice(o,d);if(r===null)n.push({cond:"__first__",content:M});else n.push({cond:r,content:M});r=v.replace(/^(?:elseif|elif)(?:::|\s+)/i,"").trim(),o=g}else if(s===0&&/^else$/i.test(v)){let M=e.slice(o,d);if(r===null)n.push({cond:"__first__",content:M});else n.push({cond:r,content:M});r=null,u=!0,o=g}d=g-1}let i=e.slice(o);if(u)a=i;else if(r===null)n.push({cond:"__first__",content:i});else n.push({cond:r,content:i});return{branches:n,elseContent:a}}function Ls(e,n,a={},s={}){let o={...s},r={...a},u={missingRefs:new Set},i=0,d=(x)=>{if(Object.prototype.hasOwnProperty.call(r,x))return r[x];let L=x.toLowerCase();for(let[w,f]of Object.entries(r))if(w.toLowerCase()===L)return f;if(Object.prototype.hasOwnProperty.call(o,x))return String(o[x]);for(let[w,f]of Object.entries(o))if(w.toLowerCase()===L)return String(f);let T=n.resolveStringRef(x);if(T!==void 0)return T;let A=n.resolveRef(x);if(A!==void 0)return String(A);return},g=(x)=>{let L=x.trim();if(!L)return!1;let T=L.startsWith("!"),A=T?L.slice(1).trim():L,w=v(A).trim(),f=w.match(/^(.+?)\s*(==|!=|>=|<=|>|<)\s*(.+)$/),C=!1;if(f){let P=f[1].trim(),S=f[2],y=f[3].trim(),m=Number(P),p=Number(y);if(P!==""&&y!==""&&Number.isFinite(m)&&Number.isFinite(p))C=S==="=="?m===p:S==="!="?m!==p:S===">"?m>p:S==="<"?m<p:S===">="?m>=p:m<=p;else C=S==="=="?P===y:S==="!="?P!==y:S===">"?P>y:S==="<"?P<y:S===">="?P>=y:P<=y}else C=It(w);return T?!C:C},v=(x)=>{if(++i>1200)return u.error="Macro work budget exceeded (possible infinite recursion)",x;let L="",T=0;while(T<x.length){if(x[T]!=="{"||x[T+1]!=="{"){L+=x[T++];continue}let A=Ba(x,T);if(A<0){L+=x.slice(T);break}let w=x.slice(T+2,A-2).trim();if(w.startsWith("//")||/^comment::|^note::/i.test(w)){T=A;continue}if(/^#escape$/i.test(w)){let p=Mt(x,A,"escape");if(p){L+=x.slice(A,p.bodyEnd),T=p.closeEnd;continue}}let f=w.match(/^#?(if|unless)(?:::|\s+)([\s\S]+)$/i);if(f){let p=f[1].toLowerCase(),l=f[2].trim(),b=Mt(x,A,p);if(b){let I=x.slice(A,b.bodyEnd),{branches:c,elseContent:k}=Ms(I),E=k;for(let B of c){let N=B.cond==="__first__"?l:B.cond,_=g(N);if(p==="unless"?!_:_){E=B.content;break}}L+=v(E),T=b.closeEnd;continue}}if(/^let(?:::|\s+)/i.test(w)){let p=Mt(x,A,"let");if(p){let l=qt(w.replace(/^let(?:::|\s+)/i,"")),b=new Map,I=new Map;for(let c=0;c+1<l.length;c+=2){let k=v(l[c]).trim(),E=v(l[c+1]);if(!k)continue;b.set(k,Object.prototype.hasOwnProperty.call(r,k)?r[k]:void 0),I.set(k,Object.prototype.hasOwnProperty.call(o,k)?o[k]:void 0),r[k]=E;let B=Number(E);if(E.trim()!==""&&Number.isFinite(B))o[k]=B}L+=v(x.slice(A,p.bodyEnd));for(let[c,k]of b.entries())if(k===void 0)delete r[c];else r[c]=k;for(let[c,k]of I.entries())if(k===void 0)delete o[c];else o[c]=k;T=p.closeEnd;continue}}if(/^#?trim$/i.test(w)){let p=Mt(x,A,"trim");if(p){L+=v(x.slice(A,p.bodyEnd)).trim(),T=p.closeEnd;continue}}if(/^switch::/i.test(w)){let p=qt(w);if(p.length<=2){let l=Mt(x,A,"switch");if(l){let b=v(p[1]??"").trim(),I=x.slice(A,l.bodyEnd),c="",k="",E=/\{\{\s*case::([\s\S]*?)\}\}([\s\S]*?)\{\{\s*\/case\s*\}\}/gi,B;while((B=E.exec(I))!==null)if(qt(B[1]).map((_)=>v(_).trim()).includes(b)){c=B[2];break}if(!c){let N=I.match(/\{\{\s*default\s*\}\}([\s\S]*?)\{\{\s*\/default\s*\}\}/i);if(N)k=N[1]}L+=v(c||k),T=l.closeEnd;continue}}}let C=w.match(/^\.([A-Za-z_][A-Za-z0-9_]*)\s*(=|\+=|-=)\s*([\s\S]+)$/);if(C){let p=C[1],l=C[2],b=v(C[3]).trim(),I=Number(b);if(l==="="){if(r[p]=b,b!==""&&Number.isFinite(I))o[p]=I}else{let c=o[p]??Number(d(p)??0)??0,k=l==="+="?c+(Number.isFinite(I)?I:0):c-(Number.isFinite(I)?I:0);o[p]=k,r[p]=String(k)}T=A;continue}let P=w.match(/^\.([A-Za-z_][A-Za-z0-9_]*)(\+\+|--)$/);if(P){let p=P[1],l=o[p]??Number(d(p)??0)??0,b=P[2]==="++"?l+1:l-1;o[p]=b,r[p]=String(b),L+=String(b),T=A;continue}if(/^[.@$][A-Za-z_][A-Za-z0-9_]*$/.test(w)){let p=w.slice(1),l=d(p);if(l===void 0)u.missingRefs.add(p);else L+=l;T=A;continue}let S=w.includes("::")?qt(w):w.split(/\s+/),y=(S[0]??"").trim().toLowerCase(),m=S.slice(1).map((p)=>v(p));if(y==="space")L+=" ";else if(y==="newline"||y==="nl"||y==="n")L+=`
`;else if(y==="noop")L+="";else if(y==="getvar"||y==="getchatvar"){let p=(m[0]??"").trim(),l=d(p);if(l===void 0)u.missingRefs.add(p);else L+=l}else if(y==="setvar"){let p=(m[0]??"").trim(),l=m[1]??"";if(p){r[p]=l;let b=Number(l);if(l.trim()!==""&&Number.isFinite(b))o[p]=b}}else if(y==="hasvar"||y==="haschatvar"||y==="varexists"){let p=(m[0]??"").trim();L+=d(p)!==void 0?"true":"false"}else if(y==="calc"||y==="math"||y==="evaluate"){let p=m.join("::"),l=je(p,o,n,u);if(l!==void 0)L+=String(l)}else if(y==="round"){let p=Number(m[0]),l=m[1]!==void 0?Math.max(0,Math.min(6,Math.round(Number(m[1])||0))):0;if(Number.isFinite(p))L+=String(Math.round(p*10**l)/10**l)}else if(y==="floor"){let p=Number(m[0]);if(Number.isFinite(p))L+=String(Math.floor(p))}else if(y==="ceil"){let p=Number(m[0]);if(Number.isFinite(p))L+=String(Math.ceil(p))}else if(y==="abs"){let p=Number(m[0]);if(Number.isFinite(p))L+=String(Math.abs(p))}else if(y==="min"){let p=m.map(Number).filter(Number.isFinite);if(p.length)L+=String(Math.min(...p))}else if(y==="max"){let p=m.map(Number).filter(Number.isFinite);if(p.length)L+=String(Math.max(...p))}else if(y==="clamp"){let[p,l,b]=m.map(Number);if(Number.isFinite(p)&&Number.isFinite(l)&&Number.isFinite(b))L+=String(Math.max(l,Math.min(b,p)))}else if(y==="mod"){let p=Number(m[0]),l=Number(m[1]);if(Number.isFinite(p)&&Number.isFinite(l)&&l!==0)L+=String(p%l)}else if(y==="and")L+=m.length&&m.every(It)?"true":"";else if(y==="or")L+=m.some(It)?"true":"";else if(y==="not")L+=!It(m[0]??"")?"true":"";else if(["eq","ne","gt","lt","gte","lte"].includes(y)){let p=m[0]?.trim()??"",l=m[1]?.trim()??"",b=Number(p),I=Number(l),c=p!==""&&l!==""&&Number.isFinite(b)&&Number.isFinite(I),k=!1;if(y==="eq")k=c?b===I:p===l;else if(y==="ne")k=c?b!==I:p!==l;else if(y==="gt")k=c?b>I:p>l;else if(y==="lt")k=c?b<I:p<l;else if(y==="gte")k=c?b>=I:p>=l;else if(y==="lte")k=c?b<=I:p<=l;L+=k?"true":""}else if(y==="empty"||y==="isempty")L+=(m[0]??"")===""?"true":"";else if(y==="blank"||y==="isblank")L+=(m[0]??"").trim()===""?"true":"";else if(y==="default"||y==="fallback"||y==="coalesce")L+=m.find(It)??"";else if(y==="matches"){let[p="",l="",b=""]=m;if(l)try{L+=new RegExp(l,b).test(p)?"true":""}catch{L+=p.toLowerCase().includes(l.toLowerCase())?"true":""}}else if(y==="includes"||y==="contains"||y==="inlist"){let p=(m[0]??"").split(",").map((l)=>l.trim()).filter(Boolean);L+=p.includes((m[1]??"").trim())?"true":""}else if(y==="upper"||y==="uppercase"||y==="toupper")L+=(m[0]??"").toUpperCase();else if(y==="lower"||y==="lowercase"||y==="tolower")L+=(m[0]??"").toLowerCase();else if(y==="len"||y==="length")L+=String((m[0]??"").length);else if(y==="replace")L+=(m[2]??"").split(m[0]??"").join(m[1]??"");else if(y==="split"){let p=(m[0]??"").split(m[1]??","),l=Number(m[2]??0),b=l<0?p.length+l:l;L+=(p[b]??"").trim()}else if(y==="wrap"){let p=m[2]??"";L+=p?`${m[0]??""}${p}${m[1]??""}`:""}else if(y==="switch"){let p=(m[0]??"").trim(),l="";for(let b=1;b+1<m.length;b+=2)if(m[b].trim()===p){l=m[b+1];break}if(!l&&m.length%2===0)l=m[m.length-1];L+=l}else L+=x.slice(T,A);T=A}return L},M=v(e).split(`
`).map((x)=>x.trimEnd()).filter((x)=>x.trim()!=="").join(`
`).trim(),h=Number(M);if(M!==""&&Number.isFinite(h))o.value=h,o.result=h;return{text:M,locals:o,strLocals:r,missingRefs:[...u.missingRefs],error:u.error}}function $s(e,n,a={},s={}){let o=e.trim();if(!o)return{value:void 0,locals:{},missingRefs:[],error:"Formula is empty"};if(o.includes("{{")&&o.includes("}}")){let g=Ls(o,n,a,s);return{value:g.text!==""&&Number.isFinite(Number(g.text))?Number(g.text):g.locals.value,textOutput:g.text||void 0,locals:g.locals,missingRefs:g.missingRefs,error:g.error}}if(Is(o))return{value:void 0,locals:{},missingRefs:[],isProse:!0,error:'Plain-English rule detected — click "Convert to Local Formula" to translate it into math/macro syntax.'};let r={...s},u={missingRefs:new Set},i=o.split(/\r?\n|;/).map((g)=>g.trim()).filter((g)=>Boolean(g)&&!g.startsWith("//")&&!g.startsWith("#"));if(!i.length)return{value:void 0,locals:r,missingRefs:[],error:"Formula is empty"};let d;for(let g of i){let v=g.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([\s\S]+)$/);if(v&&!v[2].startsWith("=")){let M=v[1],h=v[2],x=je(h,r,n,u);if(x===void 0)return{value:void 0,locals:r,missingRefs:[...u.missingRefs],error:u.error};r[M]=x,d=x}else{let M=je(g,r,n,u);if(M===void 0)return{value:void 0,locals:r,missingRefs:[...u.missingRefs],error:u.error};d=M}}if(d!==void 0)r.value=d,r.result=d;return{value:d,locals:r,missingRefs:[...u.missingRefs],error:u.error}}function Pn(e,n,a){let s=(h,x)=>{if(!e.modifiers?.length)return 0;let L=0;for(let T of e.modifiers){if(T.statId!==h)continue;if(x?T.targetActorId===x:!T.targetActorId)L+=Number.isFinite(T.delta)?T.delta:0}return L},o={location:e.scene.location||"",time:e.scene.timeLabel||"",date:e.scene.dateLabel||"",weather:e.scene.weather||"",turn:String(e.turnCount),player_name:e.player.name||"User",player_attire:e.player.attire||"",player_condition:e.player.condition||""},r={turn:e.turnCount,elapsed_minutes:e.elapsedMinutes},u=(h,x)=>{if(typeof x==="number")return!0;if(typeof x!=="string")return!1;if(h.displayStyle==="feed_cards"||h.displayStyle==="quote_callout")return!1;let L=x.trim();if(!L||L==="None")return!1;if(L.includes(`
`)||L.length>110)return!1;return!0};if(a){o.name=a.name,o.conditions=a.conditions.join(", "),o.demeanor=a.demeanor||"",o.attire=a.attire||"";for(let[h,x]of Object.entries(a.fields))if(x)o[h]=x;for(let h of n){if(!h.enabled||h.scope!=="character")continue;let x=a.meters[h.id],L=x?.calibrated?x.value:h.defaultValue;if(o[h.id]=String(L??""),!u(h,L))continue;for(let[T,A]of Object.entries(Kt(L))){let w=T==="value"?h.id:T;if(r[w]===void 0)r[w]=A,o[w]=String(A)}}}else{o.name=e.player.name||"User",o.conditions=e.player.condition||"",o.attire=e.player.attire||"";for(let h of n){if(!h.enabled||h.scope==="character")continue;let x=e.stats[h.id],L=x?.calibrated?x.value:h.defaultValue;if(o[h.id]=String(L??""),!u(h,L))continue;for(let[T,A]of Object.entries(Kt(L))){let w=T==="value"?h.id:T;if(r[w]===void 0)r[w]=A,o[w]=String(A)}}}let i=(h,x,L,T)=>{if(x){let A=Kt(h);if(A[x]!==void 0)return A[x];return A[x.toLowerCase()]}if(typeof h==="number"&&Number.isFinite(h))return h+s(L,T);if(typeof h==="string"){let A=Number(h);if(Number.isFinite(A))return A+s(L,T)}return},d=Object.values(e.characters).find((h)=>h.present);return{ctx:{resolveRef:(h)=>{let x=h.trim();if(!x)return;if(x.startsWith("character:")){let T=x.slice(10).split("."),A=T[0],w=T[1],f=T[2];if(!A||!w)return;let C=e.characters[A];return C?i(C.meters[w]?.value,f,w,C.id):void 0}if(x.startsWith("first_present.")){let T=x.slice(14).split("."),A=T[0];if(!A||!d)return;return i(d.meters[A]?.value,T[1],A,d.id)}if(x.startsWith("self.")){let T=x.slice(5).split("."),A=T[0],w=T[1];if(a){let f=i(a.meters[A]?.value,w,A,a.id);if(f!==void 0)return f}return i(e.stats[A]?.value,w,A)}if(x.includes(".")){let[T,A]=x.split(".",2);if(T&&A){if(a&&a.meters[T]){let w=i(a.meters[T]?.value,A,T,a.id);if(w!==void 0)return w}if(e.stats[T]){let w=i(e.stats[T]?.value,A,T);if(w!==void 0)return w}}}if(a&&a.meters[x]){let T=i(a.meters[x]?.value,void 0,x,a.id);if(T!==void 0)return T}if(e.stats[x]){let T=i(e.stats[x]?.value,void 0,x);if(T!==void 0)return T}if(r[x]!==void 0)return r[x];let L=x.toLowerCase();for(let[T,A]of Object.entries(r))if(T.toLowerCase()===L)return A;return},resolveStringRef:(h)=>{let x=h.trim();if(!x)return;if(Object.prototype.hasOwnProperty.call(o,x))return o[x];let L=x.toLowerCase();for(let[T,A]of Object.entries(o))if(T.toLowerCase()===L)return A;if(a&&a.meters[x]!==void 0)return String(a.meters[x].value);if(e.stats[x]!==void 0)return String(e.stats[x].value);return},hasCond:(h)=>{let x=h.split(/[|,;]+/).map((A)=>A.trim().toLowerCase()).filter(Boolean);if(!x.length)return!1;let L=[];if(a){L.push(...a.conditions,a.demeanor,a.attire);for(let A of Object.values(a.meters))if(typeof A.value==="string")L.push(A.value)}else{L.push(e.player.condition,e.player.attire);for(let A of Object.values(e.stats))if(typeof A.value==="string")L.push(A.value)}let T=L.join(" ").toLowerCase();return x.some((A)=>T.includes(A))}},strVars:o,numVars:r}}function Ps(e,n){let a=e.formulaOutputTemplate?.trim();if(a){let s=!1,o=a.replace(/\{([A-Za-z0-9_]+)\}/g,(r,u)=>{if(n.locals[u]!==void 0)return s=!0,String(n.locals[u]);let i=u.toLowerCase();for(let[d,g]of Object.entries(n.locals))if(d.toLowerCase()===i)return s=!0,String(g);return"—"});return s?o:void 0}if(n.textOutput!==void 0)return n.textOutput;if(n.value===void 0)return;return Math.max(e.min,Math.min(e.max,n.value))}function As(e,n,a,s){let{numVars:o,strVars:r}=Pn(e,n,a==="character"?s:void 0),u={};for(let[i,d]of Object.entries(o))if(!Object.keys(o).some((v)=>v!==i&&v.toLowerCase()===i&&v!==v.toLowerCase()))u[i]=d;return{numTokens:u,strVars:r}}function Da(e,n,a,s){let o=e.formula?.trim()??"",r=e.scope==="character"?s?n.characters[s]:Object.values(n.characters)[0]:void 0,u=r?r.name:n.player.name||"Player",i=As(n,a,e.scope,r);if(!o)return{locals:{},missingRefs:[],availableTokens:i.numTokens,availableStringVars:i.strVars,targetName:u};let{ctx:d,strVars:g,numVars:v}=Pn(n,a,r),M=$s(o,d,g,v),h=Ps(e,M);return{output:h,locals:M.locals,missingRefs:h!==void 0?[]:M.missingRefs,isProse:M.isProse,error:M.error,availableTokens:i.numTokens,availableStringVars:i.strVars,targetName:u}}function Ra(e){let n=[],a=0,s=null,o="";for(let r=0;r<e.length;r++){let u=e[r];if(s){if(o+=u,u==="\\"&&r+1<e.length)o+=e[++r];else if(u===s)s=null;continue}if(u==='"'||u==="'"){s=u,o+=u;continue}if(u==="("||u==="[")a++;else if((u===")"||u==="]")&&a>0)a--;else if(u===","&&a===0){n.push(o.trim()),o="";continue}o+=u}if(o.trim()||n.length)n.push(o.trim());return n}function $n(e){let n=e.trim();if(n.startsWith('"')&&n.endsWith('"')||n.startsWith("'")&&n.endsWith("'"))return n.slice(1,-1);return n}function Es(e,n,a,s){let o=e.localRuleFormula?.trim()??"";if(!o)return{appliedEffects:[]};let r=`category:${e.id}:${s?.id??"player"}`;a.modifiers=(a.modifiers??[]).filter((h)=>h.source!==r);let u=Pn(a,n,s),i={...u.numVars},d={missingRefs:new Set},g=[],v=o.split(/\r?\n|;/).map((h)=>h.trim()).filter((h)=>Boolean(h)&&!h.startsWith("//")&&!h.startsWith("#")),M=(h)=>{let x=h.match(/^if\s*\(([\s\S]+?)\)\s+(mod|set|add)\s*\(([\s\S]+)\)$/i);if(x){let w=je(x[1],i,u.ctx,d);if(w!==void 0&&w!==0&&!Number.isNaN(w))M(`${x[2]}(${x[3]})`);return}let L=h.match(/^mod\s*\(([\s\S]+)\)$/i);if(L){let w=Ra(L[1]);if(w.length<3){d.error="mod() requires (statId, label, deltaExpression)";return}let f=$n(w[0]),C=$n(w[1])||e.name,P=je(w.slice(2).join(","),i,u.ctx,d);if(P===void 0||P===0)return;let y={id:`catmod_${ie(e.id)}_${ie(s?.id??"player")}_${ie(f)}_${ie(C)}`,label:C,statId:f,...s?{targetActorId:s.id}:{},delta:Math.round(P),source:r};a.modifiers.push(y),g.push(`${s?`${s.name} · `:""}${f} ${y.delta>=0?`+${y.delta}`:y.delta} (${C})`);return}let T=h.match(/^(set|add)\s*\(([\s\S]+)\)$/i);if(T){let w=T[1].toLowerCase(),f=Ra(T[2]);if(f.length<2){d.error=`${w}() requires (statId, expression)`;return}let C=$n(f[0]),P=je(f.slice(1).join(","),i,u.ctx,d);if(P===void 0)return;let S=n.find((y)=>y.id===C);if(s&&(S?.scope==="character"||s.meters[C])){let y=s.meters[C];if(y?.locked||S?.locked)return;let m=typeof y?.value==="number"?y.value:0,p=w==="add"?m+P:P,l=S?Math.max(S.min,Math.min(S.max,Math.round(p))):Math.round(p);s.meters[C]={value:l,calibrated:!0,locked:!1,lastReason:`Category rule: ${e.name}`},g.push(`${s.name} · ${C} = ${l}`)}else if(S&&S.scope!=="character"){let y=a.stats[C];if(y?.locked||S.locked)return;let m=typeof y?.value==="number"?y.value:0,p=w==="add"?m+P:P,l=Math.max(S.min,Math.min(S.max,Number(p.toFixed(2))));a.stats[C]={id:C,scope:S.scope,value:l,calibrated:!0,locked:!1,lastReason:`Category rule: ${e.name}`},g.push(`${C} = ${l}`)}return}let A=h.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([\s\S]+)$/);if(A&&!A[2].startsWith("=")){let w=A[1],f=je(A[2],i,u.ctx,d);if(f!==void 0)i[w]=f}};for(let h of v)if(M(h),d.error)break;return{appliedEffects:g,error:d.error}}function Ha(e,n,a,s){let o=structuredClone(n),i=a.filter((d)=>d.enabled&&d.categoryId===e.id).some((d)=>d.scope==="character")||/\bmod\s*\(|\bself\./i.test(e.localRuleFormula??"")?s?o.characters[s]:Object.values(o.characters)[0]:void 0;return Es(e,a,o,i)}function Ue(e,n){if(!e||!e.length)return"";let a=[...e].sort((s,o)=>o.value-s.value);for(let s of a)if(n>=s.value)return s.label;return a.at(-1)?.label??""}function ct(e){let n=Math.max(0,Math.round(e))+480,a=Math.floor(n%1440/60),s=n%60,o=a>=12?"PM":"AM",r=a%12===0?12:a%12;return`${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")} ${o}`}function Fa(e){return`Day ${Math.floor(Math.max(0,e)/1440)+1} · ${ct(e)}`}function Ne(e){let n=Math.floor(Math.max(0,e.elapsedMinutes)/1440)+1,a=e.scene.timeLabel?.trim()||ct(e.elapsedMinutes),s=e.scene.dateLabel?.trim()||`Day ${n}`,o=e.scene.location?.trim()||e.title||"Uncharted Scene",r=e.scene.weather?.trim()||"Clear";return{time:a,date:s,location:o,weather:r,formatted:`[ \uD83D\uDD70️ ${a} | \uD83D\uDCC5 ${s} | \uD83D\uDCCD ${o} | \uD83C\uDF26️ ${r} ]`}}function he(e,n){let a=e.fields[n];if(a&&a.trim())return a.trim();if(n==="role_summary")return e.roleSummary||"";if(n==="demeanor")return e.demeanor||"";if(n==="inner_thought")return e.innerThought||"";if(n==="immediate_goal")return e.immediateGoal||"";if(n==="attire_layers")return e.attire||"";return""}function Lt(e,n){let a=e.dossierFields.find((s)=>s.id===n);return a?a.enabled:!1}function $t(e){if(["text","tags","tier","skill_tree","xp_level","attributes","inventory","status_fx"].includes(e.kind))return!0;if(e.displayStyle&&e.displayStyle!=="auto")return!0;return/\[[^\]]*\]|->|→|\b(?:format|write\s+in|write\s+this|saw\/heard|impulse\s*:)\b/i.test(e.triggerCues)}function Pt(e,n=""){let a=`${e} ${n}`.toLowerCase();if(/\b(?:sister|brother|sibling|mother|mom|father|dad|parent|son|daughter|cousin|aunt|uncle|family|twin|niece|nephew|guardian)\b/.test(a))return"family";if(/\b(?:lover|partner|wife|husband|spouse|fianc[eé]e?|boyfriend|girlfriend|crush|sweetheart|romantic|beloved|infatuat)\b/.test(a))return"romance";if(/\b(?:rival|enemy|nemesis|hostile|antagonist|foe|hatred|bitter|estranged|ex-|ex\b|adversary|suspicious|threat)\b/.test(a))return"rival";if(/\b(?:boss|employer|employee|subordinate|maid|butler|servant|retainer|master|teacher|student|mentor|apprentice|client|doctor|colleague|coworker|captain|commander)\b/.test(a))return"professional";if(/\b(?:friend|best\s+friend|ally|companion|confidant|buddy|comrade|roommate|childhood|pal|trusted|protector)\b/.test(a))return"friend";return"neutral"}var ce="player",Gt="web",Pe={family:{icon:"\uD83D\uDC9B",label:"Family",color:"#f59e0b"},friend:{icon:"\uD83D\uDC99",label:"Friend / Ally",color:"#38bdf8"},romance:{icon:"\uD83E\uDE77",label:"Romance",color:"#f472b6"},rival:{icon:"❤️",label:"Rival / Tense",color:"#f43f5e"},professional:{icon:"\uD83D\uDCBC",label:"Work / Duty",color:"#a78bfa"},neutral:{icon:"⚪",label:"Acquaintance",color:"#94a3b8"}},An=["Best Friend","Protective Sister","Younger Brother","Childhood Friend","Trusted Ally","Romantic Interest","Partner / Lover","Rival","Suspicious Stranger","Employer / Boss","Loyal Retainer"];function _s(e){let n=e.trim().split(/\s+/).filter(Boolean);if(n.length>=2)return`${n[0][0]??""}${n[1][0]??""}`.toUpperCase();return(e.trim().slice(0,2)||"?").toUpperCase()}function dt(e){if(e.bondToPlayer?.label)return{...e.bondToPlayer,category:e.bondToPlayer.category??Pt(e.bondToPlayer.label,e.bondToPlayer.note)};let n=e.fields.bond_dynamic||e.roleSummary||"Acquaintance";return{label:n,category:Pt(n)}}function En(e){if(e.bondFromPlayer?.label)return{...e.bondFromPlayer,category:e.bondFromPlayer.category??Pt(e.bondFromPlayer.label,e.bondFromPlayer.note)};return{label:"Not defined yet",category:"neutral"}}function Wa(e,n){let a=e.snapshot.state.player.name||"You",s=En(n),o=dt(n);e.modals.open({title:`\uD83D\uDD17 Edit Bond: ${a} ⇄ ${n.name}`,width:560},(r,u)=>{let i=t("label","ls-label",`Your Bond to ${n.name} (${a} → ${n.name})`),d=t("input","ls-input");d.placeholder="e.g. Younger Brother, Best Friend, Wary Ally…",d.value=s.label==="Not defined yet"?"":s.label,i.append(d);let g=t("div","ls-row");for(let y of An.slice(0,6))g.append(R(y,()=>{d.value=y},"ls-btn-sm ls-quick-pill"));i.append(g);let v=t("label","ls-label",`Why / Note for ${a} → ${n.name} (Optional)`),M=t("input","ls-input");M.placeholder="e.g. Relies on her for advice…",M.value=s.note??"",v.append(M);let h=t("label","ls-label",`${n.name}'s Bond to You (${n.name} → ${a})`),x=t("input","ls-input");x.placeholder="e.g. Protective Elder Sister, Strict Boss…",x.value=o.label,h.append(x);let L=t("div","ls-row");for(let y of An.slice(0,6))L.append(R(y,()=>{x.value=y},"ls-btn-sm ls-quick-pill"));h.append(L);let T=t("label","ls-label",`Why / Note for ${n.name} → ${a} (Optional)`),A=t("input","ls-input");A.placeholder="e.g. Secretly worries about you…",A.value=o.note??"",T.append(A);let w=o.category??s.category??"neutral",f=t("div","ls-label","Bond Type / Color"),C=t("div","ls-row"),P=()=>{for(let y of[...C.querySelectorAll("button")])y.setAttribute("aria-current",y.dataset.cat===w?"page":"false")};for(let[y,m]of Object.entries(Pe)){let p=R(`${m.icon} ${m.label}`,()=>{w=y,P()},"ls-btn-sm");p.dataset.cat=y,C.append(p)}P(),f.append(C);let S=R("\uD83D\uDCBE Save Two-Way Bond",()=>{let y=d.value.trim(),m=x.value.trim()||n.roleSummary||"Acquaintance";e.request("state:mutate",{patch:{characters:[{id:n.id,name:n.name,roleSummary:m,bondToPlayer:{label:m,...A.value.trim()?{note:A.value.trim()}:{},category:w},...y?{bondFromPlayer:{label:y,...M.value.trim()?{note:M.value.trim()}:{},category:w}}:{}}]},reason:`Updated bond ${a} ⇄ ${n.name}`}),u()},"ls-btn-primary");r.append(i,v,h,T,f,S)})}function qe(e,n,a){let{state:s}=e.snapshot,o=Object.values(s.characters).filter((r)=>r.id!==n.id);e.modals.open({title:a?`\uD83E\uDD1D Edit NPC Bond: ${n.name} ⇄ ${a.toName}`:`➕ Add Bond from ${n.name} to Another NPC`,width:560},(r,u)=>{let i=t("label","ls-label",`Other Character (${n.name} → ?)`),d=t("input","ls-input");if(d.placeholder=o.length?`e.g. ${o.map((m)=>m.name).join(", ")} or another NPC name`:"Enter NPC name…",d.value=a?.toName??(o[0]?.name??""),i.append(d),o.length>0){let m=t("div","ls-row");for(let p of o)m.append(R(`\uD83D\uDC64 ${p.name}`,()=>{d.value=p.name},"ls-btn-sm"));i.append(m)}let g=t("label","ls-label",`${n.name}'s Relation to Them`),v=t("input","ls-input");v.placeholder="e.g. Older Sister, Ex-Fiancé, Rival, Boss…",v.value=a?.label??"",g.append(v);let M=t("div","ls-row");for(let m of An.slice(0,6))M.append(R(m,()=>{v.value=m},"ls-btn-sm ls-quick-pill"));g.append(M);let h=t("label","ls-label","Why / Dynamic Note (Optional)"),x=t("input","ls-input");x.placeholder="e.g. Still bitter about what happened last summer…",x.value=a?.attitude??"",h.append(x);let T=(a?s.characters[a.toId]:o[0])?.peerBonds?.[n.id],A=t("label","ls-label",`Their Relation Back to ${n.name} (Optional)`),w=t("input","ls-input");w.placeholder="e.g. Younger Brother, Loyal Friend…",w.value=T?.label??"",A.append(w);let f=a?.category??Pt(a?.label??"",a?.attitude??""),C=t("div","ls-label","Bond Type / Color"),P=t("div","ls-row"),S=()=>{for(let m of[...P.querySelectorAll("button")])m.setAttribute("aria-current",m.dataset.cat===f?"page":"false")};for(let[m,p]of Object.entries(Pe)){let l=R(`${p.icon} ${p.label}`,()=>{f=m,S()},"ls-btn-sm");l.dataset.cat=m,P.append(l)}S(),C.append(P);let y=R("\uD83D\uDCBE Save NPC Bond",()=>{let m=d.value.trim();if(!m)return;let p=v.value.trim()||"Acquaintance",l=x.value.trim(),b=[{id:n.id,name:n.name,peerBonds:[{target:m,label:p,attitude:l,category:f}]}],I=w.value.trim();if(I)b.push({name:m,peerBonds:[{target:n.name,label:I,attitude:T?.attitude??"",category:f}]});e.request("state:mutate",{patch:{characters:b},reason:`Updated bond ${n.name} ⇄ ${m}`}),u()},"ls-btn-primary");r.append(i,g,h,A,C,y)})}function Zt(e,n){let{state:a}=e.snapshot,s=t("div","ls-stack"),o=Object.values(a.characters),r=a.player.name||"You";if(ce!=="player"&&ce!=="all"&&!a.characters[ce])ce="player";let u=t("div","ls-row-between"),i=t("div","ls-row");i.append(t("span","ls-kicker","Focus:"));let d=R(`\uD83D\uDC64 ${r}`,()=>{ce="player",e.emitChange()},"ls-btn-sm");if(ce==="player")d.setAttribute("aria-current","page");i.append(d);for(let w of o){let f=R(`${w.present?"\uD83D\uDFE2":"⚪"} ${w.name}`,()=>{ce=w.id,e.selectedActorId=w.id,e.emitChange()},"ls-btn-sm");if(ce===w.id)f.setAttribute("aria-current","page");i.append(f)}if(o.length>=2){let w=R("\uD83D\uDD78️ Full Web",()=>{ce="all",e.emitChange()},"ls-btn-sm");if(ce==="all")w.setAttribute("aria-current","page");i.append(w)}let g=t("div","ls-row");if(g.append(R(Gt==="web"?"\uD83D\uDCCB Cards Only":"\uD83D\uDD78️ Show Map",()=>{Gt=Gt==="web"?"cards":"web",e.emitChange()},"ls-btn-sm")),o.length>0){let w=(ce!=="player"&&ce!=="all"?a.characters[ce]:void 0)??(e.selectedActorId?a.characters[e.selectedActorId]:void 0)??o[0];g.append(R("+ Add NPC Bond",()=>qe(e,w),"ls-btn-sm ls-btn-primary"))}if(u.append(i,g),s.append(u),!o.length){let w=t("div","ls-card");return w.append(t("strong","","Bond Web Ready"),t("p","ls-muted","Once characters appear in chat, your two-way relations with them and their relations with each other will appear here.")),s.append(w),s}let v=t("div","ls-web-legend"),M=t("div","ls-row");for(let w of Object.values(Pe)){let f=t("span","ls-web-legend-item"),C=t("span","ls-web-swatch");C.style.background=w.color,f.append(C,document.createTextNode(`${w.icon} ${w.label}`)),M.append(f)}if(v.append(M),s.append(v),Gt==="web"){let w=t("div","ls-bw-stage"),f="http://www.w3.org/2000/svg",C=document.createElementNS("http://www.w3.org/2000/svg","svg");C.setAttribute("viewBox","0 0 100 100"),C.setAttribute("preserveAspectRatio","none"),C.classList.add("ls-bw-svg");let P=[];if(ce==="player")P.push({id:"player",name:r,isPlayer:!0,present:!0,xPct:50,yPct:o.length===1?18:50,color:"#38bdf8"}),o.forEach((p,l)=>{let b=dt(p),I=Pe[b.category??"neutral"],c=50,k=82;if(o.length===1)c=50,k=82;else if(o.length===2)c=l===0?15:85,k=50;else{let E=l/o.length*Math.PI*2-Math.PI/2;c=50+Math.cos(E)*38,k=50+Math.sin(E)*35}P.push({id:p.id,name:p.name,isPlayer:!1,present:p.present,portraitUrl:p.portraitUrl,xPct:Number(c.toFixed(1)),yPct:Number(k.toFixed(1)),color:I.color})});else if(ce!=="all"&&a.characters[ce]){let p=a.characters[ce],l=[{id:"player",name:r,isPlayer:!0,present:!0},...o.filter((b)=>b.id!==p.id).map((b)=>({id:b.id,name:b.name,isPlayer:!1,present:b.present,portraitUrl:b.portraitUrl}))];P.push({id:p.id,name:p.name,isPlayer:!1,present:p.present,portraitUrl:p.portraitUrl,xPct:50,yPct:l.length===1?18:50,color:"#38bdf8"}),l.forEach((b,I)=>{let c=50,k=82;if(l.length===1)c=50,k=82;else if(l.length===2)c=I===0?15:85,k=50;else{let B=I/l.length*Math.PI*2-Math.PI/2;c=50+Math.cos(B)*38,k=50+Math.sin(B)*35}let E=b.isPlayer?dt(p).category??"neutral":p.peerBonds?.[b.id]?.category??a.characters[b.id]?.peerBonds?.[p.id]?.category??"neutral";P.push({id:b.id,name:b.name,isPlayer:b.isPlayer,present:b.present,portraitUrl:b.portraitUrl,xPct:Number(c.toFixed(1)),yPct:Number(k.toFixed(1)),color:Pe[E].color})})}else{let p=[{id:"player",name:r,isPlayer:!0,present:!0,portraitUrl:void 0},...o.map((l)=>({id:l.id,name:l.name,isPlayer:!1,present:l.present,portraitUrl:l.portraitUrl}))];p.forEach((l,b)=>{let I=b/p.length*Math.PI*2-Math.PI/2,c=50+Math.cos(I)*37,k=50+Math.sin(I)*35,E=l.isPlayer?void 0:a.characters[l.id],B=E?dt(E).category??"neutral":"friend";P.push({id:l.id,name:l.name,isPlayer:l.isPlayer,present:l.present,portraitUrl:l.portraitUrl,xPct:Number(c.toFixed(1)),yPct:Number(k.toFixed(1)),color:Pe[B].color})})}let S=new Map(P.map((p)=>[p.id,p])),y=(p,l,b,I,c,k,E=0)=>{let B=(p.xPct+l.xPct)/2,N=(p.yPct+l.yPct)/2,_=l.xPct-p.xPct,D=l.yPct-p.yPct,H=Math.max(1,Math.hypot(_,D)),F=B+-D/H*E,V=N+_/H*E,O=document.createElementNS("http://www.w3.org/2000/svg","path");if(O.setAttribute("d",`M ${p.xPct} ${p.yPct} Q ${F.toFixed(1)} ${V.toFixed(1)} ${l.xPct} ${l.yPct}`),O.setAttribute("fill","none"),O.setAttribute("stroke",b),O.setAttribute("stroke-width","0.8"),O.setAttribute("stroke-opacity","0.82"),C.append(O),I.length>0){let W=0.25*p.xPct+0.5*F+0.25*l.xPct,q=0.25*p.yPct+0.5*V+0.25*l.yPct,z=t("div","ls-bw-edge-pill");z.style.setProperty("--ls-bond-color",b),z.style.left=`${Math.max(15,Math.min(85,W)).toFixed(1)}%`,z.style.top=`${Math.max(14,Math.min(86,q)).toFixed(1)}%`,z.title=c;for(let j of I)z.append(t("span","ls-bw-edge-line",j));z.addEventListener("click",(j)=>{j.stopPropagation(),k()}),w.append(z)}},m=(p,l,b,I)=>{let c=dt(p),k=En(p),E=c.category??k.category??"neutral",B=Pe[E].color,_=[c.label&&c.label!=="Acquaintance"?c.label:k.label!=="Not defined yet"?k.label:c.label],D=`You → ${p.name}: ${k.label}
${p.name} → You: ${c.label}`;y(l,b,B,_,D,()=>Wa(e,p),I?-8:0)};if(ce==="player"){let p=S.get("player");for(let l of o){let b=S.get(l.id);if(b)m(l,p,b,!1)}}else if(ce!=="all"&&a.characters[ce]){let p=a.characters[ce],l=S.get(p.id),b=S.get("player");if(b)m(p,b,l,!1);for(let I of o){if(I.id===p.id)continue;let c=S.get(I.id);if(!c)continue;let k=p.peerBonds?.[I.id],E=I.peerBonds?.[p.id];if(!k&&!E)continue;let B=k?.category??E?.category??"neutral",N=[k?`${p.name} → ${I.name}: ${k.label}`:"",E?`${I.name} → ${p.name}: ${E.label}`:""].filter(Boolean),_=k?.label||E?.label||"Acquaintance";y(l,c,Pe[B].color,[_],N.join(`
`),()=>qe(e,p,k),0)}}else{let p=S.get("player");for(let b of o){let I=S.get(b.id);if(I)m(b,p,I,!0)}let l=new Set;for(let b of o){let I=S.get(b.id);if(!I)continue;for(let c of Object.values(b.peerBonds??{})){let k=S.get(c.toId);if(!k)continue;let E=[b.id,c.toId].sort().join("::");if(l.has(E))continue;l.add(E);let B=a.characters[c.toId]?.peerBonds?.[b.id],N=c.category??B?.category??"neutral",_=[`${b.name} → ${c.toName}: ${c.label}`,...B?[`${c.toName} → ${b.name}: ${B.label}`]:[]];y(I,k,Pe[N].color,[c.label||B?.label||"Peer"],_.join(`
`),()=>qe(e,b,c),16)}}}w.prepend(C);for(let p of P){let l=p.id===ce,b=t("button","ls-bw-node");b.type="button",b.dataset.focal=String(l),b.style.left=`${p.xPct}%`,b.style.top=`${p.yPct}%`,b.style.setProperty("--ls-bond-color",p.color),b.title=`Click to focus ${p.name}'s bonds`;let I=t("div","ls-bw-avatar");if(p.portraitUrl){let c=t("img");c.src=p.portraitUrl,c.alt=p.name,I.append(c)}else I.append(document.createTextNode(p.isPlayer?"\uD83D\uDC64":_s(p.name)));if(!p.isPlayer)I.append(t("span",`ls-roster-dot ${p.present?"is-present":"is-away"}`));b.append(I,t("span","ls-bw-name",p.name)),b.addEventListener("click",()=>{if(ce=p.isPlayer?"player":p.id,!p.isPlayer)e.selectedActorId=p.id;e.emitChange()}),w.append(b)}s.append(w)}let h=ce!=="player"&&ce!=="all"&&a.characters[ce]?[a.characters[ce]]:o,x=t("div","ls-stack");x.append(t("span","ls-kicker",`\uD83D\uDC64 Your Bonds (${r} ⇄ Cast)`));for(let w of h){let f=dt(w),C=En(w),P=f.category??C.category??"neutral",S=Pe[P],y=t("div","ls-bw-pair-card");y.style.setProperty("--ls-bond-color",S.color);let m=t("div","ls-row-between"),p=t("div","ls-row");p.append(t("strong","",`${r} ⇄ ${w.name}`),t("span","ls-bw-cat-chip",`${S.icon} ${S.label}`)),p.lastElementChild.style.setProperty("--ls-bond-color",S.color);let l=t("div","ls-row");l.append(R("✏️ Edit Bond",()=>Wa(e,w),"ls-btn-sm"),R("\uD83E\uDEAA Dossier",()=>n(w.id),"ls-btn-sm ls-btn-primary")),m.append(p,l),y.append(m);let b=t("div","ls-bw-two-col"),I=t("div","ls-bw-dir-box");I.append(t("small","ls-kicker",`Your Bond → ${w.name}`),t("strong","",C.label),...C.note?[t("small","ls-muted",C.note)]:[]);let c=t("div","ls-bw-dir-box");c.append(t("small","ls-kicker",`${w.name}'s Bond → You`),t("strong","",f.label),...f.note?[t("small","ls-muted",f.note)]:[]),b.append(I,c),y.append(b),x.append(y)}s.append(x);let L=[],T=new Set;for(let w of h){for(let[f,C]of Object.entries(w.peerBonds??{})){let P=a.characters[f];if(!P)continue;let S=[w.id,P.id].sort().join("::");if(T.has(S))continue;T.add(S),L.push({a:w,b:P,aToB:C,bToA:P.peerBonds?.[w.id]})}for(let f of o){if(f.id===w.id)continue;let C=f.peerBonds?.[w.id];if(!C)continue;let P=[w.id,f.id].sort().join("::");if(T.has(P))continue;T.add(P),L.push({a:w,b:f,aToB:w.peerBonds?.[f.id],bToA:C})}}let A=t("div","ls-stack");if(A.append(t("span","ls-kicker",`\uD83E\uDD1D Cast Bonds (NPC ⇄ NPC · ${L.length})`)),!L.length)A.append(t("p","ls-muted",'No NPC-to-NPC bonds recorded yet. They appear automatically when characters have an established relation in the story, or click "+ Add NPC Bond" above.'));else for(let w of L){let f=w.aToB?.category??w.bToA?.category??"neutral",C=Pe[f],P=t("div","ls-bw-pair-card");P.style.setProperty("--ls-bond-color",C.color);let S=t("div","ls-row-between"),y=t("div","ls-row");y.append(t("strong","",`${w.a.name} ⇄ ${w.b.name}`),t("span","ls-bw-cat-chip",`${C.icon} ${C.label}`)),y.lastElementChild.style.setProperty("--ls-bond-color",C.color);let m=t("div","ls-row");m.append(R("✏️ Edit Bond",()=>qe(e,w.a,w.aToB),"ls-btn-sm"),R("\uD83D\uDDD1️",()=>{let I=structuredClone(a.characters);if(I[w.a.id]?.peerBonds)delete I[w.a.id].peerBonds[w.b.id];if(I[w.b.id]?.peerBonds)delete I[w.b.id].peerBonds[w.a.id];e.request("state:mutate",{stateOverride:{characters:I},reason:`Removed bond ${w.a.name} ⇄ ${w.b.name}`})},"ls-btn-sm ls-btn-icon ls-btn-danger","Delete NPC bond")),S.append(y,m),P.append(S);let p=t("div","ls-bw-two-col"),l=t("div","ls-bw-dir-box");l.append(t("small","ls-kicker",`${w.a.name} → ${w.b.name}`),t("strong","",w.aToB?.label||"Not defined yet"),...w.aToB?.attitude?[t("small","ls-muted",w.aToB.attitude)]:[]);let b=t("div","ls-bw-dir-box");b.append(t("small","ls-kicker",`${w.b.name} → ${w.a.name}`),t("strong","",w.bToA?.label||"Not defined yet"),...w.bToA?.attitude?[t("small","ls-muted",w.bToA.attitude)]:[]),p.append(l,b),P.append(p),A.append(P)}return s.append(A),s}var Oa=new Map;function Xt(e){let n=e.trim();if(!n.startsWith("{")&&!n.startsWith("["))return null;try{let a=JSON.parse(n);return a&&typeof a==="object"?a:null}catch{return null}}function Ns(e){let n=String(e??"").trim(),a=Xt(n);if(a&&Array.isArray(a.nodes)){let d=Math.max(0,Math.round(Number(a.sp??a.skillPoints??a.points??0)||0)),g=a.nodes.filter((v)=>Boolean(v&&typeof v==="object")).map((v)=>{let M=Math.max(0,Math.round(Number(v.level??0)||0)),h=Math.max(1,Math.round(Number(v.maxLevel??v.max??5)||5));return{name:String(v.name??"Skill").trim(),level:Math.min(h,M),maxLevel:h,cost:Math.max(1,Math.round(Number(v.cost??1)||1)),...typeof v.requires==="string"&&v.requires.trim()?{requires:v.requires.trim()}:{},...typeof v.bonus==="string"&&v.bonus.trim()?{bonus:v.bonus.trim()}:{},unlocked:M>0||v.unlocked===!0}});return{sp:d,nodes:g}}let s=0,o=n,r=n.match(/^(?:SP|Skill\s*Points?|Points?)\s*:\s*(\d+)\s*(?:\||;|\n|$)/i);if(r)s=Math.max(0,Math.round(Number(r[1])||0)),o=n.slice(r[0].length).trim();let u=[],i=o.split(/\s*(?:;|\n|\|)\s*/).map((d)=>d.trim()).filter(Boolean);for(let d of i){let g=d.match(/^([^(\[]+?)\s*(?:\(([^)]+)\)|\[([^\]]+)\])?$/),v=(g?.[1]??d).trim(),M=(g?.[2]??g?.[3]??"").trim();if(!v||/^(?:none|default)$/i.test(v))continue;let h=0,x=5,L=1,T="",A=[];for(let w of M.split(/\s*,\s*/).map((f)=>f.trim()).filter(Boolean)){let f=w.match(/^(?:lv\.?|lvl|rank)?\s*(\d+)\s*(?:\/\s*(\d+))?$/i),C=w.match(/^cost\s*:\s*(\d+)$/i),P=w.match(/^req(?:uires)?\s*:\s*(.+)$/i);if(f){if(h=Math.max(0,Number(f[1])||0),f[2])x=Math.max(1,Number(f[2])||5)}else if(C)L=Math.max(1,Number(C[1])||1);else if(P)T=P[1].trim();else A.push(w)}u.push({name:v,level:Math.min(x,h),maxLevel:x,cost:L,...T?{requires:T}:{},...A.length?{bonus:A.join(", ")}:{},unlocked:h>0})}return{sp:s,nodes:u}}function za(e){let n=e.nodes.map((a)=>{let s=[`Lv.${a.level}/${a.maxLevel}`,`cost:${a.cost}`];if(a.requires)s.push(`req:${a.requires}`);if(a.bonus)s.push(a.bonus);return`${a.name} (${s.join(", ")})`});return`SP: ${e.sp}${n.length?` | ${n.join(" ; ")}`:""}`}function pt(e,n,a,s){let o=Ns(n),r=t("div","ls-rpg-skill-wrap"),u=t("div","ls-row-between"),i=t("span","ls-rpg-sp-badge",`✦ ${o.sp} Skill Point${o.sp===1?"":"s"}`);if(u.append(i),!a&&s){let v=t("div","ls-row");v.append(R("+1 SP",()=>{let M={...o,sp:o.sp+1};s(za(M),`Granted +1 SP to ${e.label}`)},"ls-btn-sm")),u.append(v)}if(r.append(u),!o.nodes.length)return r.append(t("small","ls-muted",'No skill nodes yet. Format: "SP: 2 | Slash (Lv.1/5, cost:1) ; Parry (Lv.0/3, cost:1, req:Slash)"')),r;let d=new Map(o.nodes.map((v)=>[v.name.toLowerCase(),v.level])),g=t("div","ls-rpg-skill-grid");for(let[v,M]of o.nodes.entries()){let h=!M.requires||(d.get(M.requires.toLowerCase())??0)>0,x=M.level>=M.maxLevel,L=!a&&Boolean(s)&&h&&!x&&o.sp>=M.cost,T=t("div","ls-rpg-skill-node");T.dataset.unlocked=String(M.level>0),T.dataset.lockedReq=String(!h),T.dataset.maxed=String(x);let A=t("div","ls-row-between");A.append(t("strong","",`${x?"★ ":M.level>0?"◆ ":"◇ "}${M.name}`),t("span","ls-chip ls-chip-accent",`Lv.${M.level}/${M.maxLevel}`)),T.append(A);let w=t("div","ls-clock-bar");w.style.gridTemplateColumns=`repeat(${Math.min(10,M.maxLevel)}, 1fr)`;for(let f=1;f<=Math.min(10,M.maxLevel);f++)w.append(t("span",`ls-clock-seg${f<=M.level?" is-filled":""}`));if(T.append(w),M.bonus||M.requires){let f=[M.requires?`${h?"✓":"\uD83D\uDD12"} Req: ${M.requires}`:"",M.bonus||""].filter(Boolean);T.append(t("small","ls-muted",f.join(" · ")))}if(!a&&s){let f=t("div","ls-row-between");f.append(t("small","ls-muted",x?"MASTERED":`Cost: ${M.cost} SP`));let C=R(x?"✓ Max":`+ Rank (${M.cost} SP)`,()=>{let P=o.nodes.map((y,m)=>m===v?{...y,level:y.level+1,unlocked:!0}:y),S={sp:Math.max(0,o.sp-M.cost),nodes:P};s(za(S),`Upgraded ${M.name} to Lv.${M.level+1}`)},`ls-btn-sm ${L?"ls-btn-primary":""}`);C.disabled=!L,f.append(C),T.append(f)}g.append(T)}return r.append(g),r}function Rs(e){let n=String(e??"").trim(),a=Xt(n);if(a&&!Array.isArray(a)){let g=Math.max(1,Math.round(Number(a.level??a.lv??1)||1)),v=Math.max(0,Math.round(Number(a.xp??a.current??0)||0)),M=Math.max(1,Math.round(Number(a.nextXp??a.max??g*100)||100));return{level:g,xp:v,nextXp:M,...typeof a.rank==="string"&&a.rank.trim()?{rank:a.rank.trim()}:{}}}let s=n.match(/(?:lv\.?|level)\s*(\d+)/i),o=n.match(/(\d+)\s*\/\s*(\d+)\s*(?:xp)?/i),r=n.match(/(?:rank|tier)\s*[:\-]?\s*([A-Za-z0-9+]+)/i),u=Math.max(1,Number(s?.[1]??1)||1),i=Math.max(0,Number(o?.[1]??(Number(n)||0))||0),d=Math.max(1,Number(o?.[2]??u*100)||100);return{level:u,xp:i,nextXp:d,...r?.[1]?{rank:r[1]}:{}}}function ut(e,n){let a=Rs(n),s=Math.max(0,Math.min(100,Math.round(a.xp/Math.max(1,a.nextXp)*100))),o=t("div","ls-rpg-xp-wrap"),r=t("div","ls-row-between"),u=t("span","ls-rpg-level-crest",`LV. ${a.level}`),i=t("div","ls-row");if(a.rank)i.append(t("span","ls-chip ls-chip-accent",`Rank ${a.rank}`));i.append(t("small","ls-muted",`${a.xp.toLocaleString()} / ${a.nextXp.toLocaleString()} XP (${s}%)`)),r.append(u,i);let d=t("div","ls-bar-track ls-rpg-xp-track"),g=t("div","ls-bar-fill");return g.style.width=`${s}%`,g.style.setProperty("--ls-bar-color",e.color||"var(--ls-primary)"),d.append(g),o.append(r,d),o}function Bs(e,n=20){let a=String(e??"").trim(),s=Xt(a);if(s&&!Array.isArray(s))return Object.entries(s).filter(([,r])=>Number.isFinite(Number(r))).map(([r,u])=>{let i=Number(u);return{name:r,value:i,max:Math.max(n,i)}});let o=[];for(let r of a.split(/[,;\n|]+/).map((u)=>u.trim()).filter(Boolean)){let u=r.match(/^([A-Za-z0-9_ .-]{1,20})\s*[:=]\s*(-?\d+(?:\.\d+)?)(?:\s*\/\s*(\d+))?$/);if(u){let i=Number(u[2]),d=u[3]?Math.max(1,Number(u[3])):Math.max(n,i);o.push({name:u[1].trim(),value:i,max:d})}}return o}function Ds(e,n){let s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.setAttribute("viewBox","0 0 220 190"),s.classList.add("ls-rpg-radar-svg");let o=110,r=96,u=62,i=e.length;for(let v of[0.33,0.66,1]){let M=e.map((x,L)=>{let T=L/i*Math.PI*2-Math.PI/2;return`${(o+Math.cos(T)*u*v).toFixed(1)},${(r+Math.sin(T)*u*v).toFixed(1)}`}),h=document.createElementNS("http://www.w3.org/2000/svg","polygon");h.setAttribute("points",M.join(" ")),h.setAttribute("fill","none"),h.setAttribute("stroke","rgba(148,163,184,0.28)"),h.setAttribute("stroke-width","1"),s.append(h)}let d=[];e.forEach((v,M)=>{let h=M/i*Math.PI*2-Math.PI/2,x=Math.max(0.1,Math.min(1,v.value/Math.max(1,v.max))),L=o+Math.cos(h)*u*x,T=r+Math.sin(h)*u*x;d.push(`${L.toFixed(1)},${T.toFixed(1)}`);let A=document.createElementNS("http://www.w3.org/2000/svg","line");A.setAttribute("x1",String(o)),A.setAttribute("y1",String(r)),A.setAttribute("x2",(o+Math.cos(h)*u).toFixed(1)),A.setAttribute("y2",(r+Math.sin(h)*u).toFixed(1)),A.setAttribute("stroke","rgba(148,163,184,0.22)"),A.setAttribute("stroke-width","1"),s.append(A);let w=document.createElementNS("http://www.w3.org/2000/svg","text");w.setAttribute("x",(o+Math.cos(h)*(u+17)).toFixed(1)),w.setAttribute("y",(r+Math.sin(h)*(u+14)+3).toFixed(1)),w.setAttribute("text-anchor","middle"),w.setAttribute("fill","currentColor"),w.setAttribute("font-size","9.5"),w.setAttribute("font-weight","700"),w.textContent=`${v.name.slice(0,6)} ${v.value}`,s.append(w)});let g=document.createElementNS("http://www.w3.org/2000/svg","polygon");return g.setAttribute("points",d.join(" ")),g.setAttribute("fill",n),g.setAttribute("fill-opacity","0.26"),g.setAttribute("stroke",n),g.setAttribute("stroke-width","2"),s.append(g),s}function mt(e,n,a){let s=Bs(n,e.max>0?e.max:20),o=t("div","ls-stack");if(o.style.gap="6px",!s.length)return o.append(t("small","ls-muted",String(n||"STR:10, DEX:10, INT:10, CHA:10"))),o;let r=`${a}:${e.id}`,u=Oa.get(r)??!1,i=t("div"),d=()=>{if(i.replaceChildren(),u&&s.length>=3){let v=t("div","ls-rpg-radar-box");v.append(Ds(s,e.color||"var(--ls-primary)")),i.append(v);return}let g=t("div","ls-rpg-attr-grid");for(let v of s){let M=t("div","ls-rpg-attr-cell"),h=Math.floor((v.value-10)/2),x=v.max<=30?h>=0?`+${h}`:String(h):"";M.append(t("span","ls-kicker",v.name),t("strong","ls-rpg-attr-val",String(v.value)),...x?[t("small","ls-muted",`(${x})`)]:[]),g.append(M)}i.append(g)};if(s.length>=3){let g=t("div","ls-row-between");g.append(t("small","ls-muted",`${s.length} Core Attributes`),R(u?"⊞ Grid View":"\uD83D\uDD78️ Radar Chart",()=>{u=!u,Oa.set(r,u),d()},"ls-btn-sm")),o.append(g)}return d(),o.append(i),o}function Hs(e){let n=String(e??"").trim(),a=Xt(n);if(Array.isArray(a))return a.filter((o)=>o&&typeof o==="object"&&o.name).map((o)=>({name:String(o.name),qty:Math.max(1,Number(o.qty??o.quantity??1)||1),rarity:Va(String(o.rarity??"common")),equipped:Boolean(o.equipped),...typeof o.note==="string"?{note:o.note}:{}}));let s=[];for(let o of n.split(/\s*(?:;|\n|\|)\s*/).map((r)=>r.trim()).filter(Boolean)){if(/^(?:none|empty)$/i.test(o))continue;let r=o.match(/^([^\[\]()]+?)(?:\s*x(\d+))?\s*(?:\[([^\]]+)\]|\(([^)]+)\))?$/i),u=(r?.[1]??o).trim(),i=Math.max(1,Number(r?.[2]??1)||1),d=(r?.[3]??r?.[4]??"").toLowerCase(),g=/\b(?:equipped|worn|active|main|offhand)\b/.test(d),v=Va(d);s.push({name:u,qty:i,rarity:v,equipped:g})}return s}function Va(e){if(/legendary|mythic|gold/.test(e))return"legendary";if(/epic|violet|purple/.test(e))return"epic";if(/rare|blue/.test(e))return"rare";if(/uncommon|green/.test(e))return"uncommon";return"common"}function ft(e){let n=Hs(e);if(!n.length)return t("small","ls-muted","Bag empty");let a=t("div","ls-rpg-loot-grid");for(let s of n){let o=t("div","ls-rpg-loot-card");o.dataset.rarity=s.rarity;let r=t("div","ls-row-between");if(r.append(t("strong","",`${s.equipped?"⚔️ ":"\uD83C\uDF92 "}${s.name}`),t("span","ls-chip",s.qty>1?`×${s.qty}`:s.rarity.toUpperCase())),o.append(r),s.equipped||s.rarity!=="common")o.append(t("small","ls-muted",[s.equipped?"Equipped":"",s.rarity!=="common"?s.rarity:""].filter(Boolean).join(" · ")));a.append(o)}return a}function Fs(e){let n=String(e??"").trim();if(!n||/^(?:none|normal|healthy|clear)$/i.test(n))return[];let a=[];for(let s of n.split(/\s*(?:;|,|\n|\|)\s*/).map((o)=>o.trim()).filter(Boolean)){let o="neutral",r=s;if(r.startsWith("+"))o="buff",r=r.slice(1).trim();else if(r.startsWith("-"))o="debuff",r=r.slice(1).trim();else if(/\b(?:burn|poison|bleed|stun|curse|tired|fluster|exhaust|wound|fear)\b/i.test(r))o="debuff";else if(/\b(?:shield|haste|bless|focus|regen|guard|inspir|armor|ward)\b/i.test(r))o="buff";let u=r.match(/^(.+?)\s*\(([^)]+)\)$/);a.push({name:(u?.[1]??r).trim(),kind:o,...u?.[2]?{duration:u[2].trim()}:{}})}return a}function ht(e){let n=Fs(e);if(!n.length)return t("small","ls-muted","No active effects");let a=t("div","ls-row");for(let s of n){let o=t("span","ls-rpg-fx-pill",`${s.kind==="buff"?"▲":s.kind==="debuff"?"▼":"●"} ${s.name}${s.duration?` (${s.duration})`:""}`);o.dataset.fxKind=s.kind,a.append(o)}return a}function gt(e,n,a,s,o){let r=Math.max(1,Math.min(10,e.max||5)),u=e.max>10?Math.round(n/Math.max(1,e.max)*r):Math.max(0,Math.min(r,Math.round(n))),i=t("div","ls-row");for(let d=1;d<=r;d++){let g=a&&d<=u,v=R(g?"❤️":"\uD83E\uDD0D",()=>{if(!s&&o){let M=e.max>10?Math.round((d===u?d-1:d)/r*e.max):d===u?d-1:d;o(M)}},"ls-btn-sm ls-btn-icon ls-rpg-heart-btn",`${e.label}: ${d}/${r}`);v.disabled=s||!o,i.append(v)}return i}function bt(e,n,a){let s=Number(n),o=Number.isFinite(s)?s.toLocaleString():String(n),r=t("div","ls-rpg-currency-box");if(r.append(t("strong","ls-rpg-currency-val",`${e.icon} ${o}`)),a!==0)r.append(t("span",`ls-delta ${a>0?"is-pos":"is-neg"}`,a>0?`+${a.toLocaleString()}`:a.toLocaleString()));return r}function Yt(e,n){e.modals.open({title:"\uD83D\uDD0A Multi-Voice TTS Director — Cast & Narrator Voices",width:680,maxHeight:800},(a,s,o,r)=>{let u=async()=>{r.clear(),a.replaceChildren(t("p","ls-muted","⏳ Loading Lumiverse TTS connections & voice catalogs…"));let i=await e.tts.listConnections(),d=e.settings,{state:g}=e.snapshot,v=Object.values(g.characters),M=d?.narratorConnectionId||i.find((p)=>p.is_default)?.id||i[0]?.id||"",h=M?await e.tts.listVoicesForConnection(M):[];a.replaceChildren();let x=t("section","ls-card"),L=t("div","ls-row-between");L.append(t("div","",""),t("span","ls-chip ls-chip-accent",`⚡ Cached Hits: ${e.tts.cacheHitCount} (0 Tokens Re-billed)`)),L.firstElementChild.append(t("span","ls-kicker","2-Tier Memory + IndexedDB Audio Cache"),t("h3","","\uD83C\uDF99️ Narrator & Reading Mode (Token Saver)")),x.append(L);let T=t("div","ls-row"),A=d?.ttsReadMode||"dialogue_only";for(let[p,l]of[["dialogue_only","\uD83D\uDCAC Dialogue Only (Recommended — Saves ~65% TTS Tokens)"],["narration_and_dialogue","\uD83D\uDCD6 Full Audiobook (Narrator + Character Voices)"],["narration_only","\uD83D\uDCDC Narration Only"]]){let b=R(l,()=>{e.request("settings:update",{settings:{ttsReadMode:p}}).then(()=>{u()})},"ls-btn-sm");if(A===p)b.setAttribute("aria-current","page");T.append(b)}if(x.append(T),!i.length){x.append(t("p","ls-muted","No TTS connections found yet. Create a TTS connection in Lumiverse (Connections → TTS Connections, e.g. Kokoro, ElevenLabs, OpenAI, or Google) to enable voice synthesis.")),a.append(x);return}let w=t("div","ls-grid"),f=t("div","ls-label","Narrator TTS Connection"),C=t("div");f.append(C);let P=t("label","ls-label","Narrator Voice ID"),S=t("input","ls-input");if(S.placeholder=h[0]?.id||"Default connection voice…",S.value=d?.narratorVoiceId||"",P.append(S),h.length>0){let p=t("div");p.style.marginTop="4px",P.append(p),J(e,r,p,{value:d?.narratorVoiceId||"",placeholder:"— Pick from connection voices —",ariaLabel:"Narrator Voice Catalog",options:[{value:"",label:"— Pick from connection voices —"},...h.map((l)=>({value:l.id,label:`${l.name} (${l.id})`}))],onChange:(l)=>{if(l)S.value=l}})}J(e,r,C,{value:d?.narratorConnectionId||"",ariaLabel:"Narrator TTS Connection",options:[{value:"",label:"Use Default Lumiverse TTS Connection"},...i.map((p)=>({value:p.id,label:`${p.name} (${p.provider}${p.voice?` · ${p.voice}`:""})`}))],onChange:(p)=>{e.request("settings:update",{settings:{narratorConnectionId:p}}).then(()=>void u())}}),w.append(f,P),x.append(w);let y=t("div","ls-row");y.append(R("\uD83D\uDCBE Save Narrator Voice",()=>{e.request("settings:update",{settings:{narratorVoiceId:S.value.trim()}}),e.notify("Saved Narrator TTS voice.")},"ls-btn-sm ls-btn-primary"),R("▶ Test Narrator",()=>{e.tts.playSegments([{kind:"narration",text:`The scene unfolds in ${g.scene.location||"the story"}.`,speakerName:"Narrator",connectionId:d?.narratorConnectionId||"",voiceId:S.value.trim(),speed:d?.narratorSpeed||1}])},"ls-btn-sm")),x.append(y),a.append(x);let m=t("section","ls-card");if(m.append(t("span","ls-kicker","Per-Character Voice Profiles"),t("h3","",`\uD83D\uDC65 Cast Voices (${v.length} Characters)`),t("p","ls-muted","Assign each character their own distinct voice and speed. Quoted lines spoken by that character automatically route to their voice.")),!v.length)m.append(t("p","ls-muted","No characters in the cast yet."));else{let p=n?[...v.filter((l)=>l.id===n),...v.filter((l)=>l.id!==n)]:v;for(let l of p){let b=t("div","ls-stat-cell");if(l.id===n)b.style.borderColor="var(--ls-primary)";let I=l.ttsVoice??{},c=I.connectionId||M,k=c?await e.tts.listVoicesForConnection(c):h,E=t("div","ls-row-between");E.append(t("strong","",`${l.present?"\uD83D\uDFE2":"⚪"} ${l.name} (${l.roleSummary||"Cast"})`),t("span","ls-chip ls-chip-accent",I.voiceId?`\uD83D\uDD0A ${I.voiceId}`:"Default Voice")),b.append(E);let B=t("div","ls-grid"),N=t("div"),_=t("div"),D=t("input","ls-input");D.placeholder="Voice ID (or pick below)…",D.value=I.voiceId||"";let H=J(e,r,_,{value:I.voiceId||"",ariaLabel:`Voice for ${l.name}`,options:[{value:"",label:"— Select Voice from Catalog —"},...k.map((W)=>({value:W.id,label:`${W.name} (${W.id})`}))],onChange:(W)=>{if(W)D.value=W}}),F=J(e,r,N,{value:I.connectionId||"",ariaLabel:`TTS Connection for ${l.name}`,options:[{value:"",label:"Default TTS Connection"},...i.map((W)=>({value:W.id,label:`${W.name} (${W.provider})`}))],onChange:async(W)=>{let q=await e.tts.listVoicesForConnection(W||M);H.setOptions([{value:"",label:"— Select Voice from Catalog —"},...q.map((z)=>({value:z.id,label:`${z.name} (${z.id})`}))],"")}}),V=t("input","ls-input");V.type="number",V.min="0.5",V.max="2.0",V.step="0.1",V.value=String(I.speed??1),V.title="Playback Speed (0.5x – 2.0x)",B.append(N,D,_,V),b.append(B);let O=t("div","ls-row");O.append(R("\uD83D\uDCBE Save Voice",()=>{let W={connectionId:F.getValue()||void 0,voiceId:D.value.trim()||void 0,speed:Math.max(0.5,Math.min(2,Number(V.value)||1))},q=structuredClone(g.characters);if(q[l.id])q[l.id].ttsVoice=W,e.request("state:mutate",{stateOverride:{characters:q},reason:`Updated TTS voice for ${l.name}`}).then(()=>void u())},"ls-btn-sm ls-btn-primary"),R("▶ Test Voice",()=>{let W=l.innerThought||`Hello, I am ${l.name}.`;e.tts.playSegments([{kind:"dialogue",text:W,speakerName:l.name,actorId:l.id,connectionId:F.getValue()||void 0,voiceId:D.value.trim()||void 0,speed:Math.max(0.5,Math.min(2,Number(V.value)||1))}])},"ls-btn-sm")),b.append(O),m.append(b)}}a.append(m)};u(),o.onDismiss(()=>e.tts.stop())})}var ja={player_attire:{title:"Player Attire / Presentation",defaultIcon:"\uD83D\uDC55",defaultLabel:"Your Current Attire / Presentation",toggleKey:"trackPlayerAttire",labelKey:"playerAttireLabel",instructionKey:"playerAttireInstruction",showCardKey:"showPlayerAttireCard",supportsCardDisplay:!0},player_condition:{title:"Player Physical / Mental Condition",defaultIcon:"\uD83E\uDE7A",defaultLabel:"Physical / Mental Condition",toggleKey:"trackPlayerCondition",labelKey:"playerConditionLabel",instructionKey:"playerConditionInstruction",showCardKey:"showPlayerConditionCard",supportsCardDisplay:!0},player_action:{title:"Player Latest Notable Action",defaultIcon:"⚡",defaultLabel:"Latest Notable Action",toggleKey:"trackPlayerAction",labelKey:"playerActionLabel",instructionKey:"playerActionInstruction",showCardKey:"showPlayerActionCard",supportsCardDisplay:!0},scene_summary:{title:"Scene Beat Summary",defaultIcon:"\uD83D\uDCD6",defaultLabel:"Scene Beat Summary",toggleKey:"trackSceneSummary",labelKey:"sceneSummaryLabel",instructionKey:"sceneSummaryInstruction",showCardKey:"showSceneSummaryInWidget",supportsCardDisplay:!0},places:{title:"Spatial Atlas (Places, Zones & Paths)",defaultIcon:"\uD83D\uDDFA️",defaultLabel:"Spatial Atlas & Locations",toggleKey:"trackPlaces",instructionKey:"placesInstruction",supportsCardDisplay:!1},quests:{title:"Quests & Objectives",defaultIcon:"\uD83C\uDFAF",defaultLabel:"Quests & Objectives",toggleKey:"trackQuests",instructionKey:"questsInstruction",showCardKey:"showQuestsInWidget",supportsCardDisplay:!1},dispatches:{title:"Off-Screen Dispatches",defaultIcon:"\uD83D\uDCE1",defaultLabel:"Off-Screen Dispatches",toggleKey:"trackDispatches",instructionKey:"dispatchesInstruction",showCardKey:"showDispatchesInWidget",supportsCardDisplay:!1},npc_conditions:{title:"NPC Conditions & Status Tags",defaultIcon:"⚡",defaultLabel:"NPC Conditions",toggleKey:"trackNpcConditions",instructionKey:"npcConditionsInstruction",supportsCardDisplay:!1},npc_secrets:{title:"NPC Secrets & Clues",defaultIcon:"\uD83D\uDD75️",defaultLabel:"NPC Secrets & Clues",toggleKey:"trackNpcSecrets",instructionKey:"npcSecretsInstruction",supportsCardDisplay:!1}};function Fe(e,n){let a=rt(),s={...a,...e??{}},o=ja[n],r=s.overrides?.[n]??{},u=s[o.toggleKey]!==!1,i=o.showCardKey?s[o.showCardKey]!==!1:!0,d=r.label||(o.labelKey?String(s[o.labelKey]??""):"")||o.defaultLabel,g=r.instruction??String(s[o.instructionKey]??a[o.instructionKey]??"");return{enabled:u,showCard:i,icon:r.icon||o.defaultIcon,label:d,instruction:g,color:r.color||"var(--lumiverse-primary)",displayStyle:r.displayStyle??"auto",layoutSpan:r.layoutSpan??"full",widgetTabId:r.widgetTabId??(n==="quests"||n==="dispatches"?"world":"stats"),inlineTabId:r.inlineTabId??(n==="quests"||n==="dispatches"?"world":"stats"),pinnedToHeader:Boolean(r.pinnedToHeader),locked:Boolean(r.locked),deleted:Boolean(r.deleted)}}function Ae(e){let n=structuredClone(e.snapshot.template),a=rt(),s={...a,...n.coreTrackers??{}};e.modals.open({title:"\uD83D\uDCCD Customize Scene Pill & AI Prompt Rules (Date, Time, Location, Weather)",width:640,maxHeight:820},(o,r,u,i)=>{let d={...n.theme.showSceneChips},g=Boolean(s.scenePillLocked),v=t("section","ls-card");v.append(t("span","ls-kicker","Visible Pill Chips & Lock"),t("p","ls-muted","Choose which scene tokens appear in the Scene Pill & Header, or lock the pill so AI turns never alter the clock/location."));let M=t("div","ls-grid");for(let[m,p]of[["location","\uD83D\uDCCD Location"],["time","\uD83D\uDD70️ Clock Time"],["date","\uD83D\uDCC5 Date / Era"],["weather","\uD83C\uDF26️ Weather"],["cast","\uD83D\uDC64 Present Cast"],["pinnedStats","\uD83D\uDCCC Pinned Stats"]]){let l=t("div","ls-row-between ls-stat-cell");l.append(t("span","",p));let b=t("div");l.append(b),me(e,i,b,{checked:Boolean(d[m]),ariaLabel:p,onChange:(I)=>{d[m]=I}}),M.append(l)}let h=t("div","ls-row-between ls-stat-cell");h.append(t("span","","\uD83D\uDD12 Lock Scene Pill (Prevent AI from changing Date/Time/Location/Weather)"));let x=t("div");h.append(x),me(e,i,x,{checked:g,ariaLabel:"Lock Scene Pill",onChange:(m)=>{g=m}}),v.append(M,h),o.append(v);let L=t("div");o.append(L);let T=fe(e,i,L,{title:"AI Extraction Prompts for Pill Fields (Location, Time, Date, Weather)",iconName:"sliders",defaultExpanded:!0}),A=(m,p,l)=>{let b=t("div","ls-label"),I=t("div","ls-row-between"),c=t("textarea","ls-input");return c.rows=2,c.value=p,c.placeholder=l,I.append(t("span","",m),R("⛶ Full-Screen",()=>{e.request("textEditor:open",{title:`Scene Pill Prompt: ${m}`,value:c.value,placeholder:l}).then((k)=>{if(!k.cancelled&&typeof k.text==="string")c.value=k.text})},"ls-btn-sm")),b.append(I,c),T.append(b),c},w=A("\uD83D\uDCCD Location Prompt Rule",s.sceneLocationInstruction??a.sceneLocationInstruction??"",'e.g. Format as "Room, Building" or "Landmark, District".'),f=A("\uD83D\uDD70️ Time Prompt Rule",s.sceneTimeInstruction??a.sceneTimeInstruction??"",'e.g. Use 24-hour military clock, or narrative time like "Late Evening".'),C=A("\uD83D\uDCC5 Date / Era Prompt Rule",s.sceneDateInstruction??a.sceneDateInstruction??"",'e.g. Format as "Year 412, Frostfall 14" or "Oct 14, 2002".'),P=A("\uD83C\uDF26️ Weather & Atmosphere Prompt Rule",s.sceneWeatherInstruction??a.sceneWeatherInstruction??"",'e.g. Keep to 2–4 vivid words like "Neon Drizzle" or "Warm Indoor Steam".'),S=A('⏱️ Time Progression ("mins") Prompt Rule',s.sceneTimeFlowInstruction??a.sceneTimeFlowInstruction??"","e.g. Estimate realistic elapsed minutes per turn."),y=t("div","ls-row-between");y.style.marginTop="12px",y.append(R("↺ Reset Default Prompts",()=>{w.value=a.sceneLocationInstruction??"",f.value=a.sceneTimeInstruction??"",C.value=a.sceneDateInstruction??"",P.value=a.sceneWeatherInstruction??"",S.value=a.sceneTimeFlowInstruction??""},"ls-btn-sm"),R("\uD83D\uDCBE Save Scene Pill Config",()=>{let m=structuredClone(e.snapshot.template),p={...a,...m.coreTrackers??{}};e.request("state:mutate",{templatePatch:{theme:{...m.theme,showSceneChips:d},coreTrackers:{...p,scenePillLocked:g,sceneLocationInstruction:w.value.trim(),sceneTimeInstruction:f.value.trim(),sceneDateInstruction:C.value.trim(),sceneWeatherInstruction:P.value.trim(),sceneTimeFlowInstruction:S.value.trim()}},reason:"Updated Scene Pill prompt rules & visibility"}),e.notify("Saved Scene Pill prompt rules."),r()},"ls-btn-primary")),o.append(y)})}function Qt(e,n){let a=structuredClone(e.snapshot.template),s=rt(),o={...s,...a.coreTrackers??{},overrides:{...a.coreTrackers?.overrides??{}}},r=ja[n],u=Fe(o,n);e.modals.open({title:`✏️ Full Edit Built-In Tracker: ${r.title}`,width:640,maxHeight:820},(i,d,g,v)=>{let{enabled:M,showCard:h}=u,x=Boolean(u.locked),L=u.displayStyle??"auto",T=u.layoutSpan??"full",A=u.color||"var(--lumiverse-primary)",w=u.widgetTabId||"stats",f=u.inlineTabId||"stats",C=t("div","ls-grid"),P=t("label","ls-label","Icon"),S=t("input","ls-input");S.value=u.icon||r.defaultIcon,P.append(S);let y=t("label","ls-label","Display Label"),m=t("input","ls-input");m.value=u.label||r.defaultLabel,y.append(m),C.append(P,y),i.append(C);let p=t("div","ls-grid"),l=t("div","ls-row-between ls-stat-cell");l.append(t("span","","✓ Track in AI Prompts"));let b=t("div");if(l.append(b),me(e,v,b,{checked:M,onChange:(G)=>{M=G}}),p.append(l),r.supportsCardDisplay){let G=t("div","ls-row-between ls-stat-cell");G.append(t("span","","\uD83E\uDE9F Show Card in Widget / Inline"));let ee=t("div");G.append(ee),me(e,v,ee,{checked:h,onChange:(te)=>{h=te}}),p.append(G)}let I=t("div","ls-row-between ls-stat-cell");I.append(t("span","","\uD83D\uDD12 Lock Value (Skip AI Updates)"));let c=t("div");I.append(c),me(e,v,c,{checked:x,onChange:(G)=>{x=G}}),p.append(I),i.append(p);let k=t("div");i.append(k);let E=fe(e,v,k,{title:"Display Style, Color & Tab Routing",iconName:"palette",defaultExpanded:!0}),B=t("div","ls-grid"),N=t("div","ls-label","Visual Display Style"),_=t("div");N.append(_),J(e,v,_,{value:L,ariaLabel:"Visual Display Style",options:[{value:"auto",label:"✨ Smart Auto-Detect"},{value:"arc_tracker",label:"\uD83C\uDFAF Multi-Thread / Arc / Quest Cards"},{value:"accordion_cards",label:"\uD83D\uDDC2️ Collapsible Multi-Entry Cards"},{value:"matrix_badges",label:"⚖️ Split / Versus Comparison (Knows vs Blind)"},{value:"meter_mini_bars",label:"\uD83D\uDCCA Multi-Bar Mini Gauges (HP/MP cur/max)"},{value:"stat_pills_grid",label:"\uD83E\uDDEC Compact Stat Badges (Lv / P A I / POW)"},{value:"bullet_ledger",label:"\uD83D\uDCB0 Aligned Bullet & Currency Ledger"},{value:"timeline_list",label:"\uD83D\uDCDC Vertical Event Timeline"},{value:"checklist",label:"☑️ Visual Objectives Checklist"},{value:"feed_cards",label:"\uD83C\uDCCF Structured Flow Cards"},{value:"step_chain",label:"⛓️ Horizontal Step Chain"},{value:"key_value",label:"\uD83D\uDCCB Key–Value Table"},{value:"pill_list",label:"\uD83C\uDFF7️ Tag / Pill List"},{value:"quote_callout",label:"\uD83D\uDCAD Quote Callout Box"}],onChange:(G)=>{L=G}});let D=t("div","ls-label","Card Grid Width"),H=t("div");if(D.append(H),J(e,v,H,{value:T,ariaLabel:"Card Grid Width",options:[{value:"full",label:"↔️ Full Width"},{value:"auto",label:"\uD83D\uDCD0 Auto"},{value:"half",label:"▫ Compact Column"}],onChange:(G)=>{T=G}}),B.append(N,D),E.append(B),r.supportsCardDisplay){let G=t("div","ls-grid"),ee=t("div","ls-label","Widget Tab"),te=t("div");ee.append(te),J(e,v,te,{value:w,ariaLabel:"Widget Tab",options:a.surfaces.widgetTabs.map((ne)=>({value:ne.id,label:`${ne.icon} ${ne.label}`})),onChange:(ne)=>{w=ne}});let X=t("div","ls-label","Inline Ribbon Tab"),ae=t("div");X.append(ae),J(e,v,ae,{value:f,ariaLabel:"Inline Ribbon Tab",options:a.surfaces.inlineTabs.map((ne)=>({value:ne.id,label:`${ne.icon} ${ne.label}`})),onChange:(ne)=>{f=ne}}),G.append(ee,X),E.append(G)}let F=t("div","ls-label","Accent Color"),V=t("div","ls-row"),O=()=>{for(let G of[...V.querySelectorAll(".ls-color-swatch")])G.setAttribute("aria-pressed",String(G.dataset.colorVal===A))};for(let[G,ee,te]of[["var(--lumiverse-primary)","Theme Primary","var(--lumiverse-primary, #38bdf8)"],["#38bdf8","Sky","#38bdf8"],["#f472b6","Rose","#f472b6"],["#f59e0b","Amber","#f59e0b"],["#10b981","Emerald","#10b981"],["#a78bfa","Violet","#a78bfa"],["#f43f5e","Crimson","#f43f5e"]]){let X=R("",()=>{A=G,O()},"ls-color-swatch",ee);X.dataset.colorVal=G,X.style.background=te,V.append(X)}O(),F.append(V),E.append(F);let W=t("div");i.append(W);let q=fe(e,v,W,{title:"AI Extraction Prompt Rule",iconName:"sparkles",defaultExpanded:!0}),z=t("div","ls-row-between"),j=t("textarea","ls-input");j.rows=3,j.value=u.instruction??"",j.placeholder="Tell the AI exactly how and when to extract or format this tracker…",z.append(t("span","ls-muted","Prompt instruction sent to the AI extractor:"),R("⛶ Full-Screen Editor",()=>{e.request("textEditor:open",{title:`Built-In Prompt: ${m.value||r.title}`,value:j.value,placeholder:"Describe formatting, triggers, and when the AI should update this built-in tracker…"}).then((G)=>{if(!G.cancelled&&typeof G.text==="string")j.value=G.text})},"ls-btn-sm")),q.append(z,j);let K=t("div","ls-row-between");K.style.marginTop="12px";let Y=t("div","ls-row");Y.append(R("↺ Reset Default",()=>{S.value=r.defaultIcon,m.value=r.defaultLabel,j.value=String(s[r.instructionKey]??""),A="var(--lumiverse-primary)",L="auto",T="full",O()},"ls-btn-sm"),R("\uD83D\uDDD1️ Delete Built-In",async()=>{if(!await e.modals.confirm({title:`Remove "${r.defaultLabel}"?`,message:`Disable and remove "${r.defaultLabel}" from active tracking and Studio? (You can restore deleted built-ins anytime from Studio.)`,confirmLabel:"Delete",variant:"danger"}))return;let ee=structuredClone(e.snapshot.template),te={...s,...ee.coreTrackers??{},overrides:{...ee.coreTrackers?.overrides??{}}},X={...te,[r.toggleKey]:!1,...r.showCardKey?{[r.showCardKey]:!1}:{},overrides:{...te.overrides??{},[n]:{...te.overrides?.[n]??{},deleted:!0}}};e.request("state:mutate",{templatePatch:{coreTrackers:X},reason:`Deleted built-in tracker "${r.defaultLabel}"`}),e.notify(`Removed "${r.defaultLabel}".`),d()},"ls-btn-sm ls-btn-danger")),K.append(Y,R("\uD83D\uDCBE Save Built-In Tracker",()=>{let G=m.value.trim()||r.defaultLabel,ee=j.value.trim(),te=structuredClone(e.snapshot.template),X={...s,...te.coreTrackers??{},overrides:{...te.coreTrackers?.overrides??{}}},ae={...X,[r.toggleKey]:M,...r.labelKey?{[r.labelKey]:G}:{},[r.instructionKey]:ee,...r.showCardKey?{[r.showCardKey]:h}:{},overrides:{...X.overrides??{},[n]:{icon:S.value.trim()||r.defaultIcon,label:G,instruction:ee,color:A,displayStyle:L,layoutSpan:T,widgetTabId:w,inlineTabId:f,locked:x,deleted:!1}}};e.request("state:mutate",{templatePatch:{coreTrackers:ae},reason:`Customized built-in tracker "${G}"`}),e.notify(`Saved "${G}".`),d()},"ls-btn-primary")),i.append(K)})}var Ke={id:"zone_local",name:"Local Area",kind:"building",icon:"\uD83D\uDDFA️",color:"#38bdf8",description:""};function At(e){let n=new Map;for(let a of e.mapPaths??[]){if(!e.places[a.fromId]||!e.places[a.toId]||a.fromId===a.toId)continue;let[s,o]=[a.fromId,a.toId].sort(),r=`${s}__${o}`;n.set(r,{...a,id:r,fromId:s,toId:o})}for(let a of Object.values(e.places))for(let s of a.connectedIds){if(!e.places[s]||s===a.id)continue;let[o,r]=[a.id,s].sort(),u=`${o}__${r}`;if(!n.has(u)){let i=e.places[s],d=(a.zoneId||"zone_local")===(i.zoneId||"zone_local");n.set(u,{id:u,fromId:o,toId:r,pathType:d?"door":"street",travelMinutes:Math.max(1,i.travelMinutes||a.travelMinutes||5)})}}return[...n.values()]}function vt(e,n){let a=e.currentPlaceId||Object.keys(e.places)[0]||"";if(!a||!e.places[n])return null;if(a===n)return{pathIds:[a],totalMinutes:0};let s=At(e),o=new Map;for(let u of s)(o.get(u.fromId)??o.set(u.fromId,[]).get(u.fromId)).push({to:u.toId,mins:Math.max(1,u.travelMinutes||5),locked:Boolean(u.locked)}),(o.get(u.toId)??o.set(u.toId,[]).get(u.toId)).push({to:u.fromId,mins:Math.max(1,u.travelMinutes||5),locked:Boolean(u.locked)});let r=(u)=>{let i=new Map([[a,0]]),d=new Map,g=new Set;while(!0){let v=null,M=1/0;for(let[h,x]of i.entries())if(!g.has(h)&&x<M)v=h,M=x;if(!v)return null;if(v===n){let h=[v];while(d.has(h[0]))h.unshift(d.get(h[0]));return{pathIds:h,totalMinutes:M}}g.add(v);for(let h of o.get(v)??[]){if(!u&&h.locked)continue;let x=M+h.mins;if(x<(i.get(h.to)??1/0))i.set(h.to,x),d.set(h.to,v)}}};return r(!1)??r(!0)}function Ua(e,n,a){let s=Object.values(e.places);if(!s.length)return{zones:[],nodes:[],edges:[]};let o=e.currentPlaceId||s[0].id,r={...e.mapZones??{}},u=(b)=>{let I=b.zoneId||Ke.id;if(r[I])return r[I];if(I===Ke.id)return r[I]={...Ke,name:e.title&&e.title!=="Uncharted Story"?e.title:"Local Area"},r[I];return r[I]={id:I,name:I.replace(/[_-]+/g," ").replace(/\b\w/g,(c)=>c.toUpperCase()),kind:b.category==="region"?"region":"building",icon:b.category==="region"?"\uD83C\uDFD4️":"\uD83C\uDFDB️",color:"#38bdf8",description:""},r[I]},i=(a?s.filter((b)=>(b.zoneId||Ke.id)===a):s).slice(0,18),d=new Map;for(let b of i){let I=u(b),c=d.get(I.id);if(!c)c={zone:I,places:[]},d.set(I.id,c);c.places.push(b)}let g=[...d.values()],v=g.length,M=1000,h=580,x=22,L=v<=1?1:v<=4?2:3,T=Math.ceil(v/L),A=22,w=Math.floor((M-x*2-A*(L-1))/L),f=Math.floor((h-x*2-A*(T-1))/T),C=n&&n!==o?vt(e,n):null,P=new Set(C?.pathIds??[]),S=Object.values(e.quests).filter((b)=>b.status==="active"),y=[],m=[];g.forEach((b,I)=>{let c=I%L,k=Math.floor(I/L),E=x+c*(w+A),B=x+k*(f+A);y.push({zone:b.zone,x:E,y:B,w,h:f,placeIds:b.places.map((W)=>W.id),containsCurrent:b.places.some((W)=>W.id===o)});let N=b.places.length,_=B+46,D=Math.max(80,f-58),H=E+18,F=Math.max(120,w-36),V=N===1?1:N<=4?2:3,O=Math.ceil(N/V);b.places.forEach((W,q)=>{let z=q%V,j=Math.floor(q/V),K=F/V,Y=D/O,G=Math.round(H+K*(z+0.5)),ee=Math.round(_+Y*(j+0.5)),te=Object.values(e.characters).filter((ae)=>ae.present?W.id===o:ae.locationId===W.id).map((ae)=>({id:ae.id,name:ae.name,portraitUrl:ae.portraitUrl})),X=S.filter((ae)=>`${ae.title} ${ae.summary}`.toLowerCase().includes(W.name.toLowerCase())).length;m.push({place:W,zoneId:b.zone.id,zoneName:b.zone.name,x:G,y:ee,isCurrent:W.id===o,isOnRoute:P.has(W.id),actorsHere:te,activeQuestCount:X})})});let p=new Map(m.map((b)=>[b.place.id,b])),l=[];for(let b of At(e)){let I=p.get(b.fromId),c=p.get(b.toId);if(!I||!c)continue;let k=(I.x+c.x)/2,E=(I.y+c.y)/2,B=c.x-I.x,N=c.y-I.y,_=Math.max(1,Math.hypot(B,N)),D=I.zoneId!==c.zoneId,H=D?26:10,F=Math.round(k+-N/_*H),V=Math.round(E+B/_*H),O=!1;if(C&&C.pathIds.length>1)for(let W=0;W<C.pathIds.length-1;W++){let q=C.pathIds[W],z=C.pathIds[W+1];if(q===I.place.id&&z===c.place.id||q===c.place.id&&z===I.place.id){O=!0;break}}l.push({id:b.id,fromId:I.place.id,toId:c.place.id,x1:I.x,y1:I.y,x2:c.x,y2:c.y,cx:F,cy:V,pathType:b.pathType,label:b.label,travelMinutes:b.travelMinutes,locked:Boolean(b.locked),isOnRoute:O,isCrossZone:D})}return{zones:y,nodes:m,edges:l}}function qa(e,n){let a=Object.values(e.places);if(!a.length)return{hubs:[],edges:[]};let s=e.currentPlaceId||a[0].id,o={...e.mapZones??{}},r=(w)=>{let f=w.zoneId||Ke.id;if(o[f])return o[f];if(f===Ke.id)return o[f]={...Ke,name:e.title&&e.title!=="Uncharted Story"?e.title:"Local Area"},o[f];return o[f]={id:f,name:f.replace(/[_-]+/g," ").replace(/\b\w/g,(C)=>C.toUpperCase()),kind:w.category==="region"?"region":"building",icon:w.category==="region"?"\uD83C\uDFD4️":"\uD83C\uDFDB️",color:"#38bdf8",description:""},o[f]},u=new Map;for(let w of a){let f=r(w),C=u.get(f.id);if(!C)C={zone:f,places:[]},u.set(f.id,C);C.places.push(w)}let i=[...u.values()],d=i.length,g=n&&n!==s?vt(e,n):null,v=new Set(g?.pathIds??[]),M=Object.values(e.quests).filter((w)=>w.status==="active"),h=(w,f)=>{if(f===1)return{x:500,y:180};if(f===2)return{x:w===0?270:730,y:180};if(f===3)return[{x:230,y:118},{x:770,y:118},{x:500,y:252}][w];let C=Math.min(3,Math.ceil(f/2)),P=Math.ceil(f/C),S=w%C,y=Math.floor(w/C),m=C>1?620/(C-1):0,p=P>1?150/(P-1):0,l=y%2===1&&C>1?35:0;return{x:Math.round(190+S*m+l),y:Math.round(105+y*p)}},x=i.map((w,f)=>{let C=h(f,d),P=w.places.map((c)=>c.id),S=new Set(P),y=S.has(s),m=P.some((c)=>v.has(c)),p=Object.values(e.characters).filter((c)=>c.present?y:S.has(c.locationId)).map((c)=>({id:c.id,name:c.name,portraitUrl:c.portraitUrl})),l=M.filter((c)=>w.places.some((k)=>`${c.title} ${c.summary}`.toLowerCase().includes(k.name.toLowerCase()))).length,b=w.places.find((c)=>c.id===s&&c.backdropUrl)?.backdropUrl??w.places.find((c)=>c.backdropUrl)?.backdropUrl,I=0;if(!y){let c=1/0;for(let k of w.places){let E=vt(e,k.id);if(E&&E.totalMinutes<c)c=E.totalMinutes}I=Number.isFinite(c)?c:w.places[0]?.travelMinutes??5}return{zone:w.zone,x:C.x,y:C.y,placeIds:P,containsCurrent:y,isOnRoute:m,...b?{backdropUrl:b}:{},actorsHere:p,activeQuestCount:l,minTravelMinutes:I}}),L=new Map(x.map((w)=>[w.zone.id,w])),T=new Map;for(let w of x)for(let f of w.placeIds)T.set(f,w.zone.id);let A=new Map;for(let w of At(e)){let f=T.get(w.fromId),C=T.get(w.toId);if(!f||!C||f===C)continue;let[P,S]=[f,C].sort(),y=`${P}__${S}`,m=L.get(P),p=L.get(S);if(!m||!p)continue;let l=v.has(w.fromId)&&v.has(w.toId),b=A.get(y);if(b){b.travelMinutes=Math.min(b.travelMinutes,w.travelMinutes),b.locked=b.locked&&Boolean(w.locked),b.isOnRoute=b.isOnRoute||l;continue}let I=(m.x+p.x)/2,c=(m.y+p.y)/2,k=p.x-m.x,E=p.y-m.y,B=Math.max(1,Math.hypot(k,E)),N=Math.round(I+-E/B*24),_=Math.round(c+k/B*24);A.set(y,{id:y,fromZoneId:P,toZoneId:S,x1:m.x,y1:m.y,x2:p.x,y2:p.y,cx:N,cy:_,pathType:w.pathType,travelMinutes:w.travelMinutes,locked:Boolean(w.locked),isOnRoute:l})}return{hubs:x,edges:[...A.values()]}}var Ge="",Jt=!0,_n={door:"\uD83D\uDEAA",hallway:"\uD83D\uDEB6",stairs:"\uD83E\uDE9C",street:"\uD83D\uDEE3️",trail:"\uD83C\uDF3F",transit:"\uD83D\uDE87",portal:"✨"};function Nn(e,n=3){let a=t("div","ls-mz-node-avatars");for(let s of e.slice(0,n)){let o=t("span","ls-mz-mini-av");if(o.title=s.name,s.portraitUrl){let r=t("img");r.src=s.portraitUrl,r.alt=s.name,o.append(r)}else o.textContent=s.name.slice(0,1).toUpperCase();a.append(o)}if(e.length>n)a.append(t("small","ls-muted",`+${e.length-n}`));return a}function en(e){let{state:n}=e.snapshot,a=t("div","ls-stack"),s=Object.values(n.places),o=n.mapZones??{},r=At(n);if(Ge&&!s.some((c)=>(c.zoneId||"zone_local")===Ge))Ge="";let u=t("div","ls-row-between"),i=n.currentPlaceId||s[0]?.id||"",d=e.selectedPlaceId&&n.places[e.selectedPlaceId]?e.selectedPlaceId:i,g=qa(n,d),v=g.hubs.length>1,M=Ge||(!Jt||!v?g.hubs[0]?.zone.id??"":""),h=t("div","ls-row ls-vn-breadcrumb"),x=R(`\uD83C\uDF0D All Zones (${g.hubs.length})`,()=>{Ge="",Jt=!0,e.emitChange()},"ls-btn-sm");if(!M)x.setAttribute("aria-current","page");if(h.append(x),v)for(let c of g.hubs){let k=R(`${c.zone.icon} ${c.zone.name} (${c.placeIds.length})`,()=>{Ge=c.zone.id,Jt=!1,e.emitChange()},"ls-btn-sm");if(M===c.zone.id)k.setAttribute("aria-current","page");h.append(k)}else if(g.hubs[0]){let c=g.hubs[0];h.append(t("span","ls-chip ls-chip-accent",`${c.zone.icon} ${c.zone.name}`))}let L=t("div","ls-row");if(L.append(R("+ Zone",()=>{e.modals.open({title:"Create Map Zone / Building / District",width:460},(c,k,E,B)=>{let N=t("label","ls-label","Zone Name"),_=t("input","ls-input");_.placeholder="e.g. Sakura Manor, Downtown, Orbital Deck B…",N.append(_);let D="building",H=t("div","ls-label","Zone Type"),F=t("div");H.append(F),J(e,B,F,{value:D,ariaLabel:"Zone Type",options:[{value:"building",label:"\uD83C\uDFDB️ Building / Interior"},{value:"district",label:"\uD83C\uDF06 City District"},{value:"region",label:"\uD83C\uDFD4️ Wilderness / Region"},{value:"ship_deck",label:"\uD83D\uDE80 Ship / Station Deck"},{value:"realm",label:"✨ Realm / Dimension"}],onChange:(q)=>{D=q}});let V=t("label","ls-label","Icon"),O=t("input","ls-input");O.value="\uD83C\uDFDB️",V.append(O);let W=R("Create Zone",()=>{let q=_.value.trim();if(!q)return;e.request("state:mutate",{patch:{zones:[{id:ie(q,"zone"),name:q,kind:D,icon:O.value.trim()||"\uD83C\uDFDB️"}]},reason:`Created zone "${q}"`}),k()},"ls-btn-primary");c.append(N,H,V,W)})},"ls-btn-sm"),R("+ Place",()=>{e.modals.open({title:"Add Location Pin",width:480},(c,k)=>{let E=t("label","ls-label","Location Name"),B=t("input","ls-input");E.append(B);let N=t("label","ls-label","Zone / Building / District"),_=t("input","ls-input");_.value=M&&o[M]?.name||n.places[i]?.zoneId&&o[n.places[i].zoneId]?.name||"",_.placeholder="e.g. Second-Floor Apartment",N.append(_);let D=t("label","ls-label","Icon"),H=t("input","ls-input");H.value="\uD83D\uDCCD",D.append(H);let F=t("label","ls-label","Description"),V=t("input","ls-input");F.append(V);let O=R("Add Location",()=>{let W=B.value.trim();if(!W)return;let q=n.places[i]?.name;e.request("state:mutate",{patch:{places:[{id:ie(W,"place"),name:W,zone:_.value.trim()||void 0,icon:H.value.trim()||"\uD83D\uDCCD",description:V.value.trim()||"Connected location.",connectedNames:q?[q]:[]}]},reason:`Added location "${W}"`}),k()},"ls-btn-primary");c.append(E,N,D,F,O)})},"ls-btn-sm ls-btn-primary"),R("Export",()=>{let c={schema:"lumi-stats-map/v1",zones:Object.values(o),places:s,paths:r},k=new Blob([JSON.stringify(c,null,2)],{type:"application/json"}),E=URL.createObjectURL(k),B=document.createElement("a");B.href=E,B.download=`${ie(n.title,"lumi_map")}.lumi-map.json`,document.body.append(B),B.click(),B.remove(),URL.revokeObjectURL(E)},"ls-btn-sm ls-btn-ghost","Export Map JSON"),R("Import",()=>{e.ctx.uploads.pickFile({accept:[".json","application/json"],multiple:!1,maxSizeBytes:1500000}).then((c)=>{let k=c[0];if(!k)return;let E=JSON.parse(new TextDecoder().decode(k.bytes));e.request("state:mutate",{patch:{zones:Array.isArray(E.zones)?E.zones:void 0,places:Array.isArray(E.places)?E.places:void 0,paths:Array.isArray(E.paths)?E.paths:void 0},reason:`Imported map layout from ${k.name}`})})},"ls-btn-sm ls-btn-ghost","Import Map JSON")),u.append(h,L),a.append(u),!s.length){let c=t("div","ls-card");return c.append(t("strong","","No locations mapped yet"),t("p","ls-muted",'Locations, zones, and connecting paths build automatically as scenes progress, or click "+ Zone" / "+ Place" above.')),a.append(c),a}let T=n.places[d]??s[0],A=t("div","ls-card"),w=t("div","ls-vn-atlas-canvas"),f=T.backdropUrl||s.find((c)=>c.id===i&&c.backdropUrl)?.backdropUrl||s.find((c)=>c.backdropUrl)?.backdropUrl;if(f)w.style.backgroundImage=`linear-gradient(rgba(11,17,32,0.72), rgba(11,17,32,0.88)), url(${JSON.stringify(f)})`,w.style.backgroundSize="cover",w.style.backgroundPosition="center";let C="http://www.w3.org/2000/svg",P=document.createElementNS(C,"svg");if(P.setAttribute("preserveAspectRatio","none"),P.style.cssText="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;",!M&&v){P.setAttribute("viewBox","0 0 1000 360");for(let c of g.edges){let k=document.createElementNS(C,"path");k.setAttribute("d",`M ${c.x1} ${c.y1} Q ${c.cx} ${c.cy} ${c.x2} ${c.y2}`),k.setAttribute("fill","none"),k.setAttribute("stroke",c.locked?"var(--ls-danger, #f43f5e)":c.isOnRoute?"var(--ls-primary, #38bdf8)":"rgba(148,163,184,0.55)"),k.setAttribute("stroke-width",c.isOnRoute?"3":"2"),k.setAttribute("stroke-dasharray",c.locked?"5 4":"4 3"),P.append(k);let E=0.25*c.x1+0.5*c.cx+0.25*c.x2,B=0.25*c.y1+0.5*c.cy+0.25*c.y2,N=t("span","ls-mz-edge-pill",`${c.locked?"\uD83D\uDD12 ":_n[c.pathType]||"\uD83D\uDEE3️"} ${c.travelMinutes}m`);N.dataset.route=String(c.isOnRoute),N.style.left=`${(E/1000*100).toFixed(2)}%`,N.style.top=`${(B/360*100).toFixed(2)}%`,w.append(N)}w.append(P);for(let c of g.hubs){let k=R("",()=>{if(Ge=c.zone.id,Jt=!1,c.placeIds[0]&&!c.placeIds.includes(d))e.selectedPlaceId=c.placeIds[0];e.emitChange()},"ls-vn-zone-hub",`Open ${c.zone.name} (${c.placeIds.length} locations)`);if(k.dataset.current=String(c.containsCurrent),k.style.setProperty("--ls-zone-color",c.zone.color||"#38bdf8"),k.style.left=`${(c.x/1000*100).toFixed(2)}%`,k.style.top=`${(c.y/360*100).toFixed(2)}%`,c.backdropUrl)k.style.backgroundImage=`linear-gradient(rgba(11,17,32,0.72), rgba(11,17,32,0.88)), url(${JSON.stringify(c.backdropUrl)})`,k.style.backgroundSize="cover",k.style.backgroundPosition="center";let E=t("div","ls-row");E.append(t("span","",`${c.zone.icon} ${c.zone.name}`));let B=t("div","ls-row");if(c.containsCurrent)B.append(t("span","ls-chip ls-chip-accent","YOU"));else B.append(t("span","ls-chip",`${c.minTravelMinutes}m`));if(B.append(t("span","ls-chip",`${c.placeIds.length} ${c.placeIds.length===1?"spot":"spots"}`)),c.activeQuestCount>0)B.append(t("span","ls-chip","\uD83C\uDFAF"));if(k.append(E,B),c.actorsHere.length>0)k.append(Nn(c.actorsHere,4));w.append(k)}}else{let c=Ua(n,d,M||void 0);P.setAttribute("viewBox","0 0 1000 580");for(let k of c.edges){let E=document.createElementNS(C,"path");if(E.setAttribute("d",`M ${k.x1} ${k.y1} Q ${k.cx} ${k.cy} ${k.x2} ${k.y2}`),E.setAttribute("fill","none"),E.setAttribute("stroke",k.locked?"var(--ls-danger, #f43f5e)":k.isOnRoute?"var(--ls-primary, #38bdf8)":"rgba(148,163,184,0.55)"),E.setAttribute("stroke-width",k.isOnRoute?"3.5":"2"),k.locked||k.isCrossZone||k.pathType==="portal")E.setAttribute("stroke-dasharray",k.pathType==="portal"?"3 4":"6 4");P.append(E);let B=0.25*k.x1+0.5*k.cx+0.25*k.x2,N=0.25*k.y1+0.5*k.cy+0.25*k.y2,_=t("span","ls-mz-edge-pill",`${k.locked?"\uD83D\uDD12 ":_n[k.pathType]||"\uD83D\uDEAA"} ${k.travelMinutes}m`);_.dataset.route=String(k.isOnRoute),_.style.left=`${(B/1000*100).toFixed(2)}%`,_.style.top=`${(N/580*100).toFixed(2)}%`,w.append(_)}w.append(P);for(let k of c.nodes){let E=R("",()=>{e.selectedPlaceId=k.place.id,e.emitChange(),requestAnimationFrame(()=>{A.scrollIntoView({behavior:"smooth",block:"nearest"})})},"ls-mz-node-tile",k.place.name);E.dataset.current=String(k.isCurrent),E.dataset.selected=String(k.place.id===d),E.style.left=`${(k.x/1000*100).toFixed(2)}%`,E.style.top=`${(k.y/580*100).toFixed(2)}%`;let B=k.place.name.length>24?`${k.place.name.slice(0,22)}…`:k.place.name;if(E.append(t("span","ls-mz-node-title",`${k.place.icon||"\uD83D\uDCCD"} ${B}${k.activeQuestCount?" \uD83C\uDFAF":""}`)),k.actorsHere.length>0||k.isCurrent){let N=Nn(k.actorsHere,3);if(k.isCurrent)N.prepend(t("span","ls-chip ls-chip-accent","YOU"));E.append(N)}w.append(E)}}a.append(w);let S=M?s.filter((c)=>(c.zoneId||"zone_local")===M):s,y=t("div","ls-vn-dest-grid");for(let c of S){let k=c.id===i,E=c.id===T.id,B=!k?vt(n,c.id):null,N=Object.values(n.characters).filter((W)=>W.present?c.id===i:W.locationId===c.id).map((W)=>({id:W.id,name:W.name,portraitUrl:W.portraitUrl})),_=t("div","ls-vn-dest-card");_.dataset.current=String(k),_.dataset.selected=String(E),_.addEventListener("click",()=>{e.selectedPlaceId=c.id,e.emitChange()});let D=t("div","ls-vn-dest-thumb");if(c.backdropUrl){let W=t("img");W.src=c.backdropUrl,W.alt=c.name,D.append(W)}else D.textContent=c.icon||"\uD83D\uDCCD";let H=t("div","ls-vn-dest-info"),F=t("div","ls-row");if(F.append(t("strong","",c.name)),k)F.append(t("span","ls-chip ls-chip-accent","Here"));H.append(F);let V=c.zoneId&&o[c.zoneId]?.name||"";if(V)H.append(t("small","ls-muted",V));if(N.length>0)H.append(Nn(N,4));let O=t("div","ls-row");if(!k)O.append(t("span","ls-chip",`${B?.totalMinutes??c.travelMinutes}m`),R("Go",()=>{e.request("map:travel",{placeId:c.id,fastTravel:!0})},"ls-btn-sm ls-btn-primary",`Fast travel to ${c.name}`));_.append(D,H,O),y.append(_)}a.append(y);let m=T.id!==i?vt(n,T.id):null,p=r.filter((c)=>c.fromId===T.id||c.toId===T.id),l=T.zoneId&&o[T.zoneId]?.name||"Local Area",b=t("div","ls-row-between");if(b.append(t("strong","",`${T.icon} ${T.name} · ${l}`),t("span","ls-chip ls-chip-accent",T.id===i?"Current Location":`${m?.totalMinutes??T.travelMinutes}m travel`)),A.append(b,t("p","ls-muted",T.description)),p.length>0){let c=t("div","ls-row");for(let k of p){let E=k.fromId===T.id?k.toId:k.fromId,B=n.places[E]?.name??E;c.append(R(`${k.locked?"\uD83D\uDD12":_n[k.pathType]} ${B} (${k.travelMinutes}m)`,()=>{e.selectedPlaceId=E,e.emitChange()},"ls-btn-sm","Jump inspector to connected place"))}A.append(c)}let I=t("div","ls-row");if(T.id!==i)I.append(R("Copy Travel Action",()=>{e.request("map:travel",{placeId:T.id,fastTravel:!1}).then(async(c)=>{let k=typeof c.draftText==="string"?c.draftText:"";if(!k)return;try{await navigator.clipboard.writeText(k),e.notify(`Copied travel action: "${k}"`)}catch{e.notify(`Travel route: ${k}`)}})},"ls-btn-sm"),R("Fast Travel Here",()=>{e.request("map:travel",{placeId:T.id,fastTravel:!0})},"ls-btn-sm ls-btn-primary"));if(I.append(R("Upload Backdrop",()=>e.pickAndUploadImage(T.id,"backdrop"),"ls-btn-sm"),R("Edit Place",()=>{e.modals.open({title:`Edit Place: ${T.name}`,width:500},(c,k)=>{let E=t("label","ls-label","Location Name"),B=t("input","ls-input");B.value=T.name,E.append(B);let N=t("label","ls-label","Zone / Building / District"),_=t("input","ls-input");_.value=T.zoneId&&o[T.zoneId]?.name||"",N.append(_);let D=t("label","ls-label","Icon"),H=t("input","ls-input");H.value=T.icon||"\uD83C\uDFDB️",D.append(H);let F=t("label","ls-label","Tags (comma-separated, e.g. safe, shop, danger)"),V=t("input","ls-input");V.value=(T.tags??[]).join(", "),F.append(V);let O=t("label","ls-label","Description"),W=t("textarea","ls-input");W.rows=2,W.value=T.description,O.append(W);let q=t("label","ls-label","Default Travel Minutes"),z=t("input","ls-input");z.type="number",z.value=String(T.travelMinutes||5),q.append(z);let j=R("Save Location",()=>{let K=_.value.trim(),Y={...n.mapZones??{}},G=T.zoneId;if(K){if(G=ie(K,"zone"),!Y[G])Y[G]={id:G,name:K,kind:"building",icon:"\uD83C\uDFDB️",color:"#38bdf8",description:""}}let ee=structuredClone(n.places),te=ee[T.id];if(te)te.name=B.value.trim()||te.name,te.zoneId=G,te.icon=H.value.trim()||"\uD83D\uDCCD",te.tags=V.value.split(",").map((X)=>X.trim()).filter(Boolean),te.description=W.value.trim()||te.description,te.travelMinutes=Math.max(1,Number(z.value)||5),e.request("state:mutate",{stateOverride:{places:ee,mapZones:Y},reason:`Edited location "${te.name}"`});k()},"ls-btn-primary");c.append(E,N,D,F,O,q,j)})},"ls-btn-sm")),s.length>1)I.append(R("Delete",()=>{let c=structuredClone(n.places);delete c[T.id];for(let B of Object.values(c))B.connectedIds=B.connectedIds.filter((N)=>N!==T.id);let k=(n.mapPaths??[]).filter((B)=>B.fromId!==T.id&&B.toId!==T.id),E=n.currentPlaceId===T.id?Object.keys(c)[0]??"":n.currentPlaceId;e.selectedPlaceId=E,e.request("state:mutate",{stateOverride:{places:c,mapPaths:k,currentPlaceId:E},reason:`Deleted location "${T.name}"`})},"ls-btn-sm ls-btn-danger"));return A.append(I),a.append(A),a}function Be(e,n,a){let s=n.trim();if(!s)return;let o=()=>{if(!a?.dom?.inject){e.textContent=s.replace(/<[^>]+>/g,"");return}try{a.dom.inject(e,s,"beforeend")}catch{e.textContent=s.replace(/<[^>]+>/g,"")}};if(e.isConnected)o();else queueMicrotask(()=>{if(e.isConnected)o()})}var Ws=/^(?:impulse|inhibition|action|acted|thought|inner\s*thought|saw|heard|saw\/heard|take|observation|trigger|response|result|outcome|cause|effect|before|after|step|status|state|goal|intent|attitude|location|current|current\s*step|next|hook|active\s*plans?|leverage|pivot|reward|risk|verdict|knows\/misreads|knows|blind\s*to|secret\s*stage)$/i;function Ga(e){return e.replace(/\[\s*([^\]\n:]{1,40}?)\s*\]\s*\{\s*([^\}\n]+?)\s*\}/g,"$1: $2").replace(/([A-Za-z][A-Za-z0-9_\/\s-]{1,32})\s*:\s*\[([^\[\]\n]+)\]/g,"$1: $2").replace(/\[\s*([^\]\n:]{1,40}?)\s*\]\s*:\s*\{?\s*([^\]\}\n]+?)\s*\}?(?=\s*(?:->|→|⇒|\||vs\b|$))/gi,"$1: $2")}function we(e){let n=Ga(e).trim();while(n.startsWith("[")&&n.endsWith("]")&&!n.slice(1,-1).includes("[")||n.startsWith("{")&&n.endsWith("}")&&!n.slice(1,-1).includes("{"))n=n.slice(1,-1).trim();return n}function Et(e){let n=Ga(e).trim();if(!n)return[];return n.split(/\r?\n|(?:\s*;\s*)|(?:\s+•\s+)/).map((s)=>we(s.replace(/^[-*•]\s+/,"").trim())).filter(Boolean).map((s)=>{let o=s.split(/\s*(?:->|→|⇒)\s*/).map((i)=>we(i)).filter(Boolean),r;if(o.length>1){let i=o[0],d=i.match(/^([^:\[\]\|]{2,50}):\s*([\s\S]+)$/),g=d?.[1]?.trim()??"",v=/^[^:\[\]]{1,30}:\s*\S/.test(o[1]);if(d&&!Ws.test(g)&&!/\bvs\.?\b/i.test(i)&&!i.includes("|")&&!v)r=g,o[0]=d[2].trim()}let u=o.flatMap((i)=>i.split(/\s*\|\s*/)).map((i)=>we(i)).filter(Boolean);return{...r?{subject:r}:{},steps:u.length?u:[s]}})}function Os(e){let n=we(e);if(!n)return null;let a=n.match(/^([^:->→\[\]]{1,40}):\s*([\s\S]*)$/),s=t("span","ls-step-node");if(a){let o=a[1].trim(),r=we(a[2]??"");if(!r)return null;let u=t("strong","",`${o}: `);u.style.color="var(--ls-primary)",u.style.marginRight="4px",s.append(u,document.createTextNode(r))}else s.textContent=n;return s}function Rn(e,n){let a=0;for(let s of n){let o=s.split(/\s+\bvs\.?\b\s+/i).map((u)=>u.trim()).filter(Boolean),r=[];for(let[u,i]of o.entries()){let d=Os(i);if(d)r.push({chip:d,isVs:u>0})}if(!r.length)continue;if(a>0)e.append(t("span","ls-step-arrow","→"));for(let u of r){if(u.isVs)e.append(t("span","ls-step-arrow","vs"));e.append(u.chip)}a++}}function Xe(e,n="auto"){let a=e.trim();if(!a)return t("span","ls-muted","—");if(n==="quote_callout")return t("div","ls-thought-box",`“${we(a)}”`);if(n==="pill_list"){let u=t("div","ls-row");for(let i of a.split(/[,;\n]|->|→|⇒/).map((d)=>d.trim()).filter(Boolean))u.append(t("span","ls-chip ls-chip-accent",we(i)));return u}if(n==="step_chain"){let u=t("div","ls-step-chain ls-step-strip"),i=a.split(/\r?\n|(?:\s*;\s*)|\s*(?:->|→|⇒)\s*/).map((d)=>d.trim()).filter(Boolean);return Rn(u,i),u}if(n==="key_value"){let u=t("div","ls-kv-grid"),i=a.split(/\r?\n|(?:\s*;\s*)|\s*(?:->|→|⇒)\s*|\s+\bvs\.?\b\s+/i).map((d)=>d.replace(/^[-*•]\s+/,"").trim()).filter(Boolean);for(let[d,g]of i.entries()){let v=we(g),M=v.match(/^([^:]{1,45}):\s*([\s\S]+)$/),h=t("div","ls-kv-row");if(M)h.append(t("span","ls-kv-key",M[1].trim()),t("span","ls-kv-val",we(M[2])));else h.append(t("span","ls-kv-key",`#${d+1}`),t("span","ls-kv-val",v));u.append(h)}return u}if(!/->|→|⇒|\bvs\.?\b|\n|;|\[[^\]]+\]/i.test(a)&&n==="auto"){let u=t("p","",a);return u.style.margin="2px 0 0",u}if(n==="arc_tracker"){let u=a.split(/\r?\n|(?=\[\s*t\d+\b)|(?:\s*;\s*)/i).map((d)=>we(d.replace(/^[-*•]\s+/,"").trim())).filter(Boolean),i=t("div","ls-arc-list");for(let d of u){let g=t("div","ls-arc-card"),v=d.split(/\s*\|\s*/).map((y)=>y.trim()).filter(Boolean),M=v[0]??d,h=d.match(/\b(\d+)\s*\/\s*(\d+)\b/),x=h?Math.max(0,Number(h[1])):null,L=h?Math.max(1,Math.min(12,Number(h[2]))):null,T=d.match(/\b(ACTIVE|DORMANT|PAYOFF|COMPLETE(?:D)?|DONE|RETIRE(?:D)?|URGENT|FAIL(?:ED)?|ADVANCE|CONTINUE|SHIFT|DROP)\b/i),A=T?T[1].toUpperCase():"",w=M.replace(/^t\d+\s*/i,"").replace(/\(\s*([^|)]+?)\s*(?:\|\s*\d+\s*\/\s*\d+\s*)?\)\s*:?/,"$1:").trim(),f="",C=w.indexOf(":");if(C>0&&C<48)f=w.slice(C+1).trim(),w=w.slice(0,C).trim();else w=w.replace(/\s*\|\s*\d+\s*\/\s*\d+/,"").trim();let P=t("div","ls-row-between");P.append(t("strong","ls-arc-title",w||"Active Thread"));let S=t("div","ls-row");if(A){let y=t("span","ls-arc-status",A);y.dataset.arcStatus=A.toLowerCase(),S.append(y)}if(x!==null&&L!==null)S.append(t("span","ls-chip",`${x}/${L}`));if(P.append(S),g.append(P),x!==null&&L!==null){let y=t("div","ls-clock-bar ls-arc-clock");y.style.gridTemplateColumns=`repeat(${L}, 1fr)`;for(let m=1;m<=L;m++)y.append(t("span",`ls-clock-seg${m<=x?" is-filled":""}`));g.append(y)}if(f)g.append(t("p","ls-arc-summary",f));for(let y of v.slice(1)){if(/^\d+\s*\/\s*\d+$/.test(y))continue;let m=we(y),p=m.match(/^([^:]{1,28}):\s*([\s\S]+)$/);if(p){let l=t("div","ls-arc-meta");l.append(t("span","ls-kv-key",`${p[1].trim()}:`),t("span","ls-muted",p[2].trim())),g.append(l)}else g.append(t("small","ls-muted",m))}i.append(g)}return i}if(n==="accordion_cards"){let u=Et(a),i=t("div","ls-feed-list");for(let[d,g]of u.entries()){let v=t("details","ls-stat-acc");if(d===0)v.open=!0;let M=t("summary","ls-stat-acc-head"),h=g.subject||g.steps[0]||`Entry ${d+1}`,x=g.subject?g.steps[0]??"":g.steps[1]??"";M.append(t("strong","",h),...x?[t("small","ls-muted ls-stat-acc-preview",x)]:[]);let L=t("div","ls-stat-acc-body"),T=t("div","ls-step-chain");Rn(T,g.steps),L.append(T),v.append(M,L),i.append(v)}return i}if(n==="matrix_badges"){let u=a.split(/\r?\n|(?:\s*;\s*)/).map((d)=>we(d.replace(/^[-*•]\s+/,"").trim())).filter(Boolean),i=t("div","ls-feed-list");for(let d of u){let g=t("div","ls-matrix-card"),v=d.split(/\s*(?:\bvs\.?\b|\||->|→|⇒)\s*/i).map((L)=>we(L)).filter(Boolean),M=t("div","ls-matrix-cols"),h=v.slice(0,2),x=v.slice(2);for(let L of h){let T=t("div","ls-matrix-cell"),A=L.match(/^([^:]{1,28}):\s*([\s\S]+)$/);if(A)T.append(t("span","ls-kv-key",A[1].trim()),t("span","",we(A[2])));else T.append(t("span","",L));M.append(T)}g.append(M);for(let L of x){let T=t("div","ls-matrix-footer"),A=L.match(/^([^:]{1,28}):\s*([\s\S]+)$/);if(A)T.append(t("span","ls-kv-key",`${A[1].trim()}: `),t("span","",we(A[2])));else T.append(t("span","",L));g.append(T)}i.append(g)}return i}if(n==="meter_mini_bars"){let u=[...a.matchAll(/\b([A-Za-z][A-Za-z0-9_ -]{0,18}?)\s*[:=]?\s*(-?\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\b/g)];if(u.length>0){let i=t("div","ls-minibars-grid");for(let d of u){let g=d[1].trim(),v=Number(d[2]),M=Math.max(1,Number(d[3])),h=Math.max(0,Math.min(100,Math.round(v/M*100))),x=t("div","ls-minibar-cell"),L=t("div","ls-row-between");L.append(t("span","ls-kv-key",g),t("strong","",`${v}/${M}`));let T=t("div","ls-bar-track"),A=t("div","ls-bar-fill");if(A.style.width=`${h}%`,/hp|health|vital|blood/i.test(g))A.style.background="#f43f5e";else if(/mp|mana|ki|energy/i.test(g))A.style.background="#38bdf8";T.append(A),x.append(L,T),i.append(x)}return i}}if(n==="stat_pills_grid"){let u=t("div","ls-statpills-grid"),i=a.split(/\s*(?:\||,|;|\n)\s*/).flatMap((d)=>{let g=d.trim();if(!g)return[];if(/^(?:[A-Za-z]{1,8}\d+\s+)+[A-Za-z]{1,8}\d+$/.test(g))return g.split(/\s+/);return[g]}).filter(Boolean);for(let d of i){let g=t("div","ls-statpill-tile"),v=d.match(/^([A-Za-z][A-Za-z0-9_]{0,12})\s*[:=]?\s*(-?\d+(?:\.\d+)?(?:\/\d+)?(?:\s*\([^)]+\))?)$/);if(v)g.append(t("span","ls-kv-key",v[1].trim()),t("strong","",v[2].trim()));else g.append(t("strong","",d));u.append(g)}return u}if(n==="bullet_ledger"){let u=a.split(/\r?\n|(?:\s*;\s*)|(?:\s+•\s+)/).map((d)=>d.replace(/^[-*•]\s+/,"").trim()).filter(Boolean),i=t("div","ls-ledger-list");for(let d of u){let g=t("div","ls-ledger-row"),v=d.match(/^(.+?)\s*:\s*([$€£¥]?\s*-?\d[\d,]*(?:\.\d+)?.*)$/);if(v)g.append(t("span","",v[1].trim()),t("span","ls-chip ls-chip-accent",v[2].trim()));else g.append(t("span","",d));i.append(g)}return i}if(n==="timeline_list"){let u=a.split(/\r?\n|(?:\s*;\s*)|\s*(?:->|→|⇒)\s*/).map((d)=>we(d.replace(/^[-*•]\s+/,"").trim())).filter(Boolean),i=t("div","ls-timeline-list");for(let d of u){let g=t("div","ls-timeline-item");g.append(t("span","ls-timeline-dot"),t("span","",d)),i.append(g)}return i}if(n==="checklist"){let u=a.split(/\r?\n|(?:\s*;\s*)/).map((d)=>d.replace(/^[-*•]\s+/,"").trim()).filter(Boolean),i=t("div","ls-checklist");for(let d of u){let g=/^(?:\[x\]|✓|✔|done:|completed:)/i.test(d),v=d.replace(/^(?:\[[ xX]\]|✓|✔|○)\s*/,"").trim(),M=t("div","ls-checklist-row");M.dataset.done=String(g),M.append(t("span","ls-checklist-box",g?"✓":""),t("span",g?"ls-muted":"",v)),i.append(M)}return i}let o=Et(a),r=t("div","ls-feed-list");for(let u of o){let i=t("div","ls-feed-card");if(u.subject)i.append(t("div","ls-feed-subject",`\uD83D\uDC64 ${u.subject}`));let d=t("div","ls-step-chain");Rn(d,u.steps),i.append(d),r.append(i)}return r}function De(e,n){let a={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},s=(i)=>i.replace(/[&<>"']/g,(d)=>a[d]),o=Ne(n),r=Object.values(n.characters).find((i)=>i.present)??Object.values(n.characters)[0],u={title:s(n.title),location:s(o.location),time:s(o.time),date:s(o.date),weather:s(o.weather),header:s(o.formatted),player_attire:s(n.player.attire),name:s(r?.name??""),role:s(r?.roleSummary??""),demeanor:s(r?.demeanor??""),attire:s(r?.attire??"")};return e.replace(/\{\{\s*([\w:.-]+)\s*\}\}/g,(i,d)=>{if(d.startsWith("stat:")){let g=d.slice(5),v=n.stats[g]?.value??r?.meters[g]?.value;return v!==void 0?s(String(v)):"—"}return u[d]??""})}function _t(e){let{state:n}=e.snapshot,a=Ne(n);e.modals.open({title:"✏️ Edit Scene Banner & Player Presentation",width:540},(s,o)=>{let r=(A,w,f)=>{let C=t("label","ls-label",A),P=t("input","ls-input");return P.value=w,P.placeholder=f,C.append(P),s.append(C),P},u=r("\uD83D\uDCCD Location & Region",n.scene.location||a.location,"e.g. Master Suite, Estate"),i=r("\uD83D\uDD70️ Time",n.scene.timeLabel||a.time,"e.g. 08:30 PM"),d=r("\uD83D\uDCC5 Date / Era",n.scene.dateLabel||a.date,"e.g. Day 1 · Evening"),g=r("\uD83C\uDF26️ Weather & Atmosphere",n.scene.weather||a.weather,"e.g. Warm Indoor Steam"),v=r("\uD83D\uDC55 Your Current Attire / Presentation",n.player.attire,"e.g. Wearing only a towel after a bath"),M=t("label","ls-label","Scene Beat Summary"),h=t("textarea","ls-input");h.rows=2,h.value=n.scene.beatSummary||"",M.append(h),s.append(M);let x=t("div","ls-row-between"),L=t("div","ls-row");L.append(R("⚙️ Pill Prompts",()=>{o(),Ae(e)},"ls-btn-sm"));for(let[A,w]of[["+15m",15],["+1h",60],["+1d",1440]])L.append(R(A,()=>{e.request("state:mutate",{patch:{scene:{elapsedMinutes:w}},reason:`Advanced clock ${A}`}),o()},"ls-btn-sm"));let T=R("\uD83D\uDCBE Save Scene",()=>{e.request("state:mutate",{patch:{scene:{location:u.value.trim(),timeLabel:i.value.trim(),dateLabel:d.value.trim(),weather:g.value.trim(),beatSummary:h.value.trim()},player:{attire:v.value.trim()}},reason:"Updated scene & player presentation"}),o()},"ls-btn-primary");x.append(L,T),s.append(x)})}function Ze(e,n){e.modals.open({title:"\uD83E\uDDEA Two-Phase Stat Calibration & Reactivity Sandbox",width:660,maxHeight:760},(a,s)=>{let o=t("label","ls-label","Test Scenario / Turn Input (or leave blank to auto-generate)"),r=t("textarea","ls-input");r.rows=2,r.placeholder='e.g. "My loyal maid greets me as I step out of the bath wearing only a towel."',o.append(r);let u=t("div","ls-stack"),i=()=>{u.replaceChildren(t("p","ls-muted","⏳ Evaluating scenario against two-phase calibration rules…")),e.request("sandbox:test",{statId:n,scenarioText:r.value.trim()||void 0}).then((g)=>{u.replaceChildren();let v=t("div","ls-card");v.append(t("span","ls-kicker","\uD83D\uDCD6 Evaluated Beat"),t("p","",String(g.testBeat??""))),u.append(v);let M=Array.isArray(g.auditEntries)?g.auditEntries:[];if(!M.length)u.append(t("p","ls-muted","No stats shifted for this scenario."));else for(let h of M){let x=t("div","ls-stat-cell"),L=t("div","ls-row-between");L.append(t("strong","",`${String(h.statLabel)} (${String(h.op)})`),t("span","ls-chip ls-chip-accent",`${String(h.before??"uncalibrated")} → ${String(h.after)}`)),x.append(L,t("small","ls-muted",String(h.reason??""))),u.append(x)}}).catch((g)=>{u.replaceChildren(t("p","ls-muted",g instanceof Error?g.message:String(g)))})},d=t("div","ls-row-between");d.append(R("▶ Run Sandbox Evaluation",i,"ls-btn-primary"),R("Close",s,"ls-btn-sm")),a.append(o,d,u),i()})}function We(e,n){let a=structuredClone(e.snapshot.template),s=n.scope==="player"?"character":"player",o=s==="character"?"cast":s==="world"?"world":"stats",r=s==="character"?"cast":s==="world"?"world":"stats",u=n.dossierTabId||"bonds";e.modals.open({title:`\uD83D\uDCCB Duplicate Stat: ${n.icon} ${n.label}`,width:540},(i,d,g,v)=>{i.append(t("p","ls-muted",`Copy "${n.label}" (including its style, color, range, anchors, and AI rules) into another scope or tab.`));let M=t("label","ls-label","New Stat Label (Can keep the same label for a different scope)"),h=t("input","ls-input");h.value=n.label,M.append(h);let x=t("div","ls-label","Target Owner Scope"),L=t("div");x.append(L);let T=t("div","ls-grid"),A=t("div","ls-label","\uD83E\uDE9F Target Widget Tab"),w=t("div");A.append(w);let f=t("div","ls-label","\uD83D\uDCAC Target Inline Tab"),C=t("div");f.append(C);let P=t("div","ls-label","\uD83E\uDEAA Target Dossier Tab"),S=t("div");P.append(S),T.append(A,f,P);let y=J(e,v,w,{value:o,ariaLabel:"Target Widget Tab",options:a.surfaces.widgetTabs.map((l)=>({value:l.id,label:`${l.icon} ${l.label}`})),onChange:(l)=>{o=l}}),m=J(e,v,C,{value:r,ariaLabel:"Target Inline Tab",options:a.surfaces.inlineTabs.map((l)=>({value:l.id,label:`${l.icon} ${l.label}`})),onChange:(l)=>{r=l}});J(e,v,S,{value:u,ariaLabel:"Target Dossier Tab",options:a.surfaces.dossierTabs.map((l)=>({value:l.id,label:`${l.icon} ${l.label}`})),onChange:(l)=>{u=l}}),J(e,v,L,{value:s,ariaLabel:"Target Owner Scope",options:[{value:"character",label:"\uD83D\uDC65 Character Meter (Per-NPC in Cast & Dossier)"},{value:"player",label:"\uD83D\uDC64 Player Stat"},{value:"world",label:"\uD83C\uDF0D World State Stat / Clock"},{value:"scene",label:"\uD83C\uDFAD Scene / Thread Stat"}],onChange:(l)=>{s=l;let b=s==="character"?"cast":s==="world"?"world":"stats";o=b,r=b,y.setValue(b),m.setValue(b)}});let p=R("\uD83D\uDCCB Create Duplicate Stat",()=>{let l=h.value.trim()||n.label,b=ie(l,"stat"),I=s==="character"?"char":s,c=a.stats.some((E)=>E.id===b)?`${I}_${b}`:b;if(a.stats.some((E)=>E.id===c))c=`${I}_${b}_${Date.now().toString(36).slice(-3)}`;let k=re({...structuredClone(n),id:c,label:l,scope:s,tabId:o,widgetTabId:o,inlineTabId:r,dossierTabId:u,showIn:{widget:!0,inline:!0,dossier:s==="character",pinnedHeader:!1}});a.stats.push(k),e.request("state:mutate",{templatePatch:{stats:a.stats},reason:`Duplicated "${n.label}" to ${s} (${o})`}),e.notify(`Duplicated "${k.icon} ${k.label}" to ${s}!`),d()},"ls-btn-primary");p.style.marginTop="10px",i.append(M,x,T,p)})}function Ce(e,n="character",a){let s=structuredClone(e.snapshot.template);e.modals.open({title:a?`Edit Stat: ${a.icon} ${a.label}`:"Create Stat or Character Meter",width:660,maxHeight:820},(o,r,u,i)=>{let d=a?.scope??n,g=a?.categoryId??"",v=a?.kind??"meter",M=a?.volatility??(n==="character"?"progressive":"momentary"),h=a?.displayStyle??"auto",x=a?.layoutSpan??"auto",L=a?.color||"var(--lumiverse-primary)",T=a?.widgetTabId??(n==="world"?"world":n==="character"?"cast":"stats"),A=a?.inlineTabId??(n==="world"?"world":n==="character"?"cast":"stats"),w=a?.dossierTabId??"bonds",f=a?.showIn?.widget??!0,C=a?.showIn?.inline??!0,P=a?a.scope==="character"?a.showIn?.dossier??!0:!1:d==="character",S=a?.pinnedToHeader??!1,y=a?.locked??!1,m=t("div");o.append(m);let p=fe(e,i,m,{title:"1. Basics & Value Format",iconName:"stats",defaultExpanded:!0}),l=t("div","ls-grid"),b=t("label","ls-label","Icon"),I=t("input","ls-input");I.value=a?.icon??(n==="character"?"\uD83D\uDC96":"\uD83D\uDCCA"),b.append(I);let c=t("label","ls-label","Stat Name"),k=t("input","ls-input");k.placeholder="e.g. Loyalty, Offscreen NPCs, Threat Clock…",k.value=a?.label??"",c.append(k);let E=t("div","ls-label","Category / Group (Optional)"),B=t("div");E.append(B),J(e,i,B,{value:g,ariaLabel:"Category / Group",options:[{value:"",label:"None (Uncategorized)"},...(s.categories??[]).map((U)=>({value:U.id,label:`${U.icon} ${U.name}`}))],onChange:(U)=>{g=U}}),l.append(b,c,E),p.append(l);let N=t("div","ls-grid"),_=t("div","ls-label","Owner Scope"),D=t("div");_.append(D);let H=t("div","ls-label","Value Format"),F=t("div");H.append(F);let V=t("div","ls-label","Reactivity Profile"),O=t("div");V.append(O),N.append(_,H,V),p.append(N);let W=t("div","ls-grid"),q=t("label","ls-label","Minimum"),z=t("input","ls-input");z.type="number",z.value=String(a?.min??0),q.append(z);let j=t("label","ls-label","Maximum / Segments"),K=t("input","ls-input");K.type="number",K.value=String(a?.max??100),j.append(K);let Y=t("label","ls-label","Starting / Fallback Value"),G=t("input","ls-input");G.value=String(a?.defaultValue??0),Y.append(G),W.append(q,j,Y),p.append(W);let ee=()=>{let U=["meter","clock","pips","number","hearts","currency","attributes"].includes(v)&&h==="auto";W.style.display=U?"":"none"};ee();let te=t("div");o.append(te);let X=fe(e,i,te,{title:"2. Appearance, Visibility & Tabs",iconName:"palette",defaultExpanded:!1}),ae=t("div","ls-grid"),ne=t("div","ls-label","Visual Display Style"),ge=t("div");ne.append(ge);let Se=t("div","ls-label","Card Grid Width"),le=t("div");Se.append(le),ae.append(ne,Se),X.append(ae);let xt=t("div","ls-label","Accent & Bar Color"),et=t("div","ls-row"),ln=[{value:"var(--lumiverse-primary)",label:"Theme Primary",preview:"var(--lumiverse-primary, #38bdf8)"},{value:"#38bdf8",label:"Sky Cyan",preview:"#38bdf8"},{value:"#f472b6",label:"Rose Pink",preview:"#f472b6"},{value:"#f59e0b",label:"Amber Gold",preview:"#f59e0b"},{value:"#10b981",label:"Emerald",preview:"#10b981"},{value:"#a78bfa",label:"Royal Violet",preview:"#a78bfa"},{value:"#f43f5e",label:"Crimson",preview:"#f43f5e"}],cn=()=>{for(let U of[...et.querySelectorAll(".ls-color-swatch")])U.setAttribute("aria-pressed",String(U.dataset.colorVal===L))};for(let U of ln){let Z=R("",()=>{L=U.value,cn()},"ls-color-swatch",U.label);Z.dataset.colorVal=U.value,Z.style.background=U.preview,et.append(Z)}let Oe=t("input");if(Oe.type="color",Oe.title="Custom color",Oe.style.cssText="width:26px;height:22px;border:0;padding:0;background:transparent;cursor:pointer;",L.startsWith("#")&&L.length===7)Oe.value=L;Oe.addEventListener("input",()=>{L=Oe.value,cn()}),et.append(Oe),cn(),xt.append(et),X.append(xt);let jn=t("div","ls-grid"),Un=t("div","ls-label","Floating Widget Tab"),qn=t("div");Un.append(qn);let Kn=t("div","ls-label","Inline Ribbon Tab"),Gn=t("div");Kn.append(Gn);let Zn=t("div","ls-label","Character Dossier Tab"),Xn=t("div");Zn.append(Xn),jn.append(Un,Kn,Zn),X.append(jn);let Yn=t("div","ls-grid"),Qn;for(let[U,Z,pe]of[["Show in Widget",f,(oe)=>{f=oe}],["Show in Inline Ribbon",C,(oe)=>{C=oe}],["Show in Dossier",P,(oe)=>{P=oe}],["Pin to Header / Pill",S,(oe)=>{S=oe}],["Lock Value",y,(oe)=>{y=oe}]]){let oe=t("div");if(U==="Show in Dossier")Qn=oe;xe(e,i,oe,{checked:Z,label:U,onChange:pe}),Yn.append(oe)}X.append(Yn);let Bt=new Set(a?.extraWidgetTabIds??[]),Jn=t("div","ls-label","Also Mirror in Additional Widget Tabs (Optional)"),ea=t("div","ls-row");for(let U of s.surfaces.widgetTabs){let Z=t("div");xe(e,i,Z,{checked:Bt.has(U.id),label:`${U.icon} ${U.label}`,onChange:(pe)=>{if(pe)Bt.add(U.id);else Bt.delete(U.id)}}),ea.append(Z)}Jn.append(ea),X.append(Jn);let be=a?.calculationMode==="ai_plus_local"||a?.calculationMode==="local_formula"?a.calculationMode:Boolean(a?.formula?.trim())&&a?.calculationMode!=="ai"?"local_formula":"ai",Dt=a?.promptTriggerMode??"always",dn=a?.injectInContinuity!==!1,ta=t("div");o.append(ta);let ze=fe(e,i,ta,{title:"3. Calculation Mode, Formula & Token Diet",iconName:"sparkles",badge:be==="local_formula"?"Pure Local":be==="ai_plus_local"?"AI + Local":"AI",defaultExpanded:!0}),pn=t("div","ls-stat-cell");pn.append(t("strong","","Calculation Mode"),t("small","ls-muted",'Use "AI + Local Math" when the AI must set starting values/deltas (e.g. Level & Stats, Vitals). Use "Pure Local" (0 tokens) when computed strictly from other stats (e.g. Eff POW/AGI).'));let na=t("div","ls-row");pn.append(na),ze.append(pn);let un=t("div","ls-label","Prompt Frequency (When AI-Tracked)"),aa=t("div");un.append(aa),ze.append(un);let sa=t("div");xe(e,i,sa,{checked:dn,label:"Include this stat in Story Continuity Prompt (turn off for UI-only scratchpads)",onChange:(U)=>{dn=U}}),ze.append(sa);let mn=t("label","ls-label","Trigger Keywords (comma-separated — only sends rule when seen in recent chat)"),Ht=t("input","ls-input");Ht.placeholder="e.g. cash, money, bank, rent, pay, buy, wallet",Ht.value=(a?.promptKeywords??[]).join(", "),mn.append(Ht),ze.append(mn);let fn=t("div","ls-stack"),ue=t("textarea","ls-input");ue.rows=4,ue.placeholder=`Write math using your stat IDs or auto-extracted tokens (e.g. round((40 + P + Lv * 2) * wound))
Supports: + - * / %, round(), floor(), ceil(), min(), max(), clamp(), if(), hasCond("...")`,ue.value=a?.formula??"";let ra=t("label","ls-label","Output Format Template (optional, e.g. POW {pow} | AGI {agi})"),He=t("input","ls-input");He.placeholder="Leave blank for plain number, or e.g. POW {pow} | AGI {agi}",He.value=a?.formulaOutputTemplate??"",ra.append(He);let Te=t("div","ls-formula-status"),Me=t("strong",""),Ft=t("small","ls-muted");Te.append(Me,Ft);let oa=t("div","ls-label"),Wt=t("div","ls-row-between"),ye=t("textarea","ls-input");ye.rows=3,ye.value=a?.triggerCues??"",ye.placeholder='Write your rule in plain English (used by AI, or click "Convert My Rule to Formula" when Local Toggle is ON)…';let hn=t("div","ls-row"),wt=t("div","ls-row");Te.append(wt);let ms=(U)=>{let Z=ue.selectionStart??ue.value.length,pe=ue.selectionEnd??ue.value.length;ue.value=ue.value.slice(0,Z)+U+ue.value.slice(pe),ue.focus(),ue.setSelectionRange(Z+U.length,Z+U.length),nt()},gn=!1,tt="",bn=(U,Z)=>{if(gn)return;let pe=U.trim();if(!pe){if(be==="ai")be="local_formula";at(),Te.dataset.status="warn",Me.textContent="⚠ Write your plain-English rule in the box below first, then click Convert.",ye.focus();return}if(!ye.value.trim())ye.value=pe;gn=!0;let oe=Z?.textContent??"";if(Z)Z.disabled=!0,Z.textContent="⏳ Converting…";if(be==="ai")be="local_formula";at(),Te.dataset.status="warn",Me.textContent="⏳ Converting your rule to a universal local formula…",wt.replaceChildren(),e.request("formula:compile",{statLabel:k.value.trim()||"Stat",ruleText:pe,scope:d}).then((se)=>{let $e=typeof se.formula==="string"?se.formula.trim():"";if(!$e){Te.dataset.status="error",Me.textContent="✖ AI returned an empty formula. Check your LLM connection in Studio → 6. AI & Connections.";return}if(ue.value=$e,typeof se.outputTemplate==="string")He.value=se.outputTemplate;if(se.suggestedMode==="ai_plus_local"||se.suggestedMode==="local_formula")be=se.suggestedMode;if(tt=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),at(),se.explanation)Ft.textContent=`✓ ${String(se.explanation)} · ${Ft.textContent}`}).catch((se)=>{Te.dataset.status="error",Me.textContent=`✖ Convert Failed: ${se instanceof Error?se.message:String(se)}`}).finally(()=>{if(gn=!1,Z&&Z.isConnected)Z.disabled=!1,Z.textContent=oe})},nt=()=>{let U=re({...a,id:a?.id||ie(k.value||"preview","preview"),label:k.value||"Preview",scope:d,kind:v,calculationMode:"local_formula",formula:ue.value,formulaOutputTemplate:He.value}),Z=Da(U,e.snapshot.state,s.stats,e.selectedActorId);hn.replaceChildren(t("small","ls-muted","Insert Variable:"));let pe=[...Object.keys(Z.availableTokens).slice(0,12),...Z.availableStringVars.conditions!==void 0?["conditions"]:[]];for(let se of pe){let $e=Z.availableTokens[se]!==void 0?String(Z.availableTokens[se]):Z.availableStringVars[se]||'""';hn.append(R(`${se} (${$e.slice(0,16)})`,()=>ms(ue.value.includes("{{")?`{{.${se}}}`:se),"ls-btn-sm ls-quick-pill",`Click to insert ${se}`))}let oe=Object.entries(Z.availableTokens).slice(0,14).map(([se,$e])=>`${se}=${$e}`).join(", ");if(Ft.textContent=oe?`Detected on ${Z.targetName}: ${oe}`:`No numeric tokens detected yet on ${Z.targetName}.`,wt.replaceChildren(),!ue.value.trim()){if(Te.dataset.status="warn",Me.textContent=ye.value.trim()?"⚠ Formula box is empty. Click below to convert your plain-English rule automatically, or type math / {{calc::...}} macros.":"⚠ Enter math lines, Lumiverse {{calc::...}} / {{if::...}} macros, or write a rule below and click Convert.",ye.value.trim()){let se=R("⚡ Convert My Rule to Local Formula",()=>bn(ye.value,se),"ls-btn-sm ls-btn-primary");wt.append(se)}}else if(Z.isProse){Te.dataset.status="warn",Me.textContent="⚠ Plain-English text detected — this box runs math/macro syntax. Click below to convert it automatically:";let se=R("⚡ Convert This Text to Formula",()=>bn(ue.value,se),"ls-btn-sm ls-btn-primary");wt.append(se)}else if(Z.error)Te.dataset.status="error",Me.textContent=`✖ Formula Error: ${Z.error}`;else if(Z.output!==void 0){let se=Object.keys(Z.locals).filter((Le)=>Le!=="value"&&Le!=="result");if(se.length>=2&&!He.value.trim()&&!ue.value.includes("{{"))Te.dataset.status="warn",Me.textContent=`⚠ Result is just "${String(Z.output)}" because Output Format Template is blank. Add e.g. {${se.join("} {")}} above!`;else{Te.dataset.status="ok";let Le=tt?` (Tested ${tt})`:"";Me.textContent=`✓ Working on ${Z.targetName} → Result: ${String(Z.output)}${Le}`}}else if(Z.missingRefs.length>0)Te.dataset.status="warn",Me.textContent=`⚠ Waiting for variables: ${Z.missingRefs.join(", ")}`;else Te.dataset.status="warn",Me.textContent="⚠ Formula evaluated empty — check placeholder names or macro tags."};ue.addEventListener("input",()=>{tt="",nt()}),He.addEventListener("input",()=>{tt="",nt()});let ia=t("div","ls-row-between");ia.append(t("strong","","Local Formula or Lumiverse Macros ({{calc}}, {{if}}, {{round}}, {{matches}})"),R("▶ Run Live Test",()=>{tt=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),nt()},"ls-btn-sm")),fn.append(ia,hn,ue,ra,Te),ze.append(fn);let la=[],at=()=>{for(let pe of la)pe.el.setAttribute("aria-current",pe.id===be?"page":"false");let U=be==="local_formula"||be==="ai_plus_local",Z=be==="ai"||be==="ai_plus_local";if(fn.style.display=U?"":"none",un.style.display=Z?"":"none",mn.style.display=Z&&Dt==="conditional"?"":"none",U)nt()};for(let[U,Z]of[["ai","\uD83E\uDD16 AI Only"],["ai_plus_local","\uD83D\uDD00 AI + Local Math"],["local_formula","⚡ Pure Local (0 tokens)"]]){let pe=R(Z,()=>{be=U,at()},"ls-btn-sm");la.push({id:U,el:pe}),na.append(pe)}J(e,i,aa,{value:Dt,ariaLabel:"Prompt Frequency",options:[{value:"always",label:"Always in Prompt"},{value:"conditional",label:"Only When Keywords Match"},{value:"manual",label:"Manual Sync Only"}],onChange:(U)=>{Dt=U,at()}}),at(),Wt.append(t("span","","Rule / AI Prompt Instructions"),t("div","ls-row"));let ca=R("⚡ Convert My Rule to Local Formula",()=>bn(ye.value,ca),"ls-btn-sm ls-btn-primary");Wt.lastElementChild.append(ca);let vn=J(e,i,ge,{value:h,ariaLabel:"Visual Display Style",options:[{value:"auto",label:"✨ Smart Auto-Detect"},{value:"arc_tracker",label:"\uD83C\uDFAF Multi-Thread / Arc / Quest Cards"},{value:"accordion_cards",label:"\uD83D\uDDC2️ Collapsible Multi-Entry Cards"},{value:"matrix_badges",label:"⚖️ Split / Versus Comparison (Knows vs Blind)"},{value:"meter_mini_bars",label:"\uD83D\uDCCA Multi-Bar Mini Gauges (HP/MP cur/max)"},{value:"stat_pills_grid",label:"\uD83E\uDDEC Compact Stat Badges (Lv / P A I / POW)"},{value:"bullet_ledger",label:"\uD83D\uDCB0 Aligned Bullet & Currency Ledger"},{value:"timeline_list",label:"\uD83D\uDCDC Vertical Event Timeline"},{value:"checklist",label:"☑️ Visual Objectives Checklist"},{value:"feed_cards",label:"\uD83C\uDCCF Structured Flow Cards"},{value:"step_chain",label:"⛓️ Horizontal Step Chain"},{value:"key_value",label:"\uD83D\uDCCB Key–Value Table"},{value:"pill_list",label:"\uD83C\uDFF7️ Tag / Pill List"},{value:"quote_callout",label:"\uD83D\uDCAD Quote Callout Box"}],onChange:(U)=>{h=U;let Z=new Set(["text","tags","tier","skill_tree","xp_level","attributes","inventory","status_fx"]);if(h==="pill_list")v="tags",Ot.setValue("tags");else if(h!=="auto"&&!Z.has(v))v="text",Ot.setValue("text");ee()}}),yn=J(e,i,le,{value:x,ariaLabel:"Card Grid Width",options:[{value:"auto",label:"\uD83D\uDCD0 Auto"},{value:"full",label:"↔️ Always Full Width"},{value:"half",label:"▫ Always Compact Column"}],onChange:(U)=>{x=U}});J(e,i,D,{value:d,ariaLabel:"Owner Scope",options:[{value:"character",label:"\uD83D\uDC65 Character Meter (Per-NPC)"},{value:"player",label:"\uD83D\uDC64 Player Stat"},{value:"world",label:"\uD83C\uDF0D World Stat / Clock"},{value:"scene",label:"\uD83C\uDFAD Scene / Thread Stat"}],onChange:(U)=>{d=U,P=d==="character";let Z=Qn?.querySelector("input");if(Z)Z.checked=P;if(be==="local_formula")nt()}});let Ot=J(e,i,F,{value:v,ariaLabel:"Value Format",options:[{value:"meter",label:"\uD83D\uDCCA Progress Bar / Meter"},{value:"skill_tree",label:"\uD83C\uDF33 Skill Tree & SP"},{value:"xp_level",label:"⭐ XP & Leveling Gauge"},{value:"attributes",label:"\uD83E\uDDEC RPG Attributes + Radar"},{value:"inventory",label:"\uD83C\uDF92 Rarity Inventory"},{value:"status_fx",label:"⚡ Buffs & Debuffs"},{value:"hearts",label:"❤️ Heart Affinity Row"},{value:"currency",label:"\uD83E\uDE99 Currency Counter"},{value:"clock",label:"⏱️ Segmented Clock"},{value:"pips",label:"\uD83C\uDFB2 Resource Pips"},{value:"text",label:"\uD83D\uDCDD Structured Text / Feed"},{value:"tags",label:"\uD83C\uDFF7️ Tag / Pill List"},{value:"tier",label:"\uD83C\uDFC6 Ordered Stage / Rank"},{value:"number",label:"\uD83D\uDD22 Numeric Counter"},{value:"boolean",label:"☑️ Boolean Flag"}],onChange:(U)=>{if(v=U,v==="tags"&&h==="auto")h="pill_list",vn.setValue("pill_list");else if(["meter","clock","pips","number","boolean","skill_tree","xp_level","attributes","inventory","status_fx","hearts","currency"].includes(v)){if(h="auto",vn.setValue("auto"),["skill_tree","attributes","inventory","status_fx"].includes(v))x="full",yn.setValue("full")}if(!a){if(v==="clock")K.value="6";else if(v==="pips"||v==="hearts")K.value="5";else if(v==="attributes")K.value="20";else if(v==="currency")K.value="99999999";else if(v==="meter"&&["5","6"].includes(K.value.trim()))K.value="100"}else if(["clock","pips","hearts"].includes(v)&&Number(K.value)===100)K.value=v==="clock"?"6":"5";if(["text","tags","tier"].includes(v)&&G.value.trim()==="0")G.value="";ee()}});J(e,i,O,{value:M,ariaLabel:"Reactivity Profile",options:[{value:"momentary",label:"⚡ Momentary — Instant reaction"},{value:"progressive",label:"\uD83D\uDCC8 Progressive — Steady evolution"},{value:"anchor",label:"⚓ Anchor — Role/premise baseline"}],onChange:(U)=>{M=U}}),J(e,i,qn,{value:T,ariaLabel:"Floating Widget Tab",options:s.surfaces.widgetTabs.map((U)=>({value:U.id,label:`${U.icon} ${U.label}`})),onChange:(U)=>{T=U}}),J(e,i,Gn,{value:A,ariaLabel:"Inline Ribbon Tab",options:s.surfaces.inlineTabs.map((U)=>({value:U.id,label:`${U.icon} ${U.label}`})),onChange:(U)=>{A=U}}),J(e,i,Xn,{value:w,ariaLabel:"Character Dossier Tab",options:s.surfaces.dossierTabs.map((U)=>({value:U.id,label:`${U.icon} ${U.label}`})),onChange:(U)=>{w=U}}),Wt.lastElementChild.append(R("\uD83C\uDF33 Skill Rule",()=>{v="skill_tree",Ot.setValue("skill_tree"),x="full",yn.setValue("full"),ye.value='Format: "SP: N | Skill A (Lv.X/Y, cost:1, bonus) ; Skill B (Lv.X/Y, cost:1, req:Skill A)". Grant SP on milestones or training.',ee()},"ls-btn-sm"),R("✨ Feed Rule",()=>{v="text",Ot.setValue("text"),h="feed_cards",vn.setValue("feed_cards"),x="full",yn.setValue("full"),ye.value='Format each entry separated by "; " as: "Subject: Current Location -> Action -> Next Hook".',ee()},"ls-btn-sm"),R("⛶ Full-Screen",()=>{e.request("textEditor:open",{title:`AI Prompt Rule: ${k.value||"Stat"}`,value:ye.value,placeholder:"Describe when this stat should calibrate high/low and what situational cues shift it…"}).then((U)=>{if(!U.cancelled&&typeof U.text==="string")ye.value=U.text})},"ls-btn-sm")),oa.append(Wt,ye),ze.append(oa);let da=t("div","ls-label"),pa=t("div","ls-row-between"),st=t("textarea","ls-input");st.rows=2,st.placeholder=`Optional — e.g.
80: High — Description
50: Moderate — Description`,st.value=(a?.anchors??[]).map((U)=>`${U.value}: ${U.label}${U.description&&U.description!==U.label?` — ${U.description}`:""}`).join(`
`),pa.append(t("span","","Scale Anchors (value: Label — Description)"),R("✨ Auto-Fill Anchors",()=>{let U=ya(Number(z.value)||0,Number(K.value)||100,M);st.value=U.map((Z)=>`${Z.value}: ${Z.label} — ${Z.description}`).join(`
`)},"ls-btn-sm")),da.append(pa,st),ze.append(da);let fs=(U)=>{if(!U.trim())return[];let Z=[];for(let pe of U.split(`
`).map((oe)=>oe.trim()).filter(Boolean)){let oe=pe.match(/^(-?\d+(?:\.\d+)?)\s*:\s*([^—\-]+?)(?:\s*[—\-]\s*(.+))?$/);if(oe)Z.push({value:Number(oe[1]),label:oe[2].trim(),description:(oe[3]??oe[2]).trim()})}return Z},ua=R(a?"Save Changes":"Create Stat",()=>{let U=k.value.trim();if(!U)return;let Z=structuredClone(e.snapshot.template),pe=Number(z.value),oe=z.value.trim()!==""&&Number.isFinite(pe)?pe:0,se=Number(K.value),$e=K.value.trim()!==""&&Number.isFinite(se)?se:100,Le=G.value.trim(),ma=Number(Le),fa=v==="boolean"?Le==="true"||Le==="1":["meter","number","clock","pips","hearts","currency"].includes(v)&&h==="auto"?Le!==""&&Number.isFinite(ma)?ma:Math.max(Math.min(oe,$e),Math.min(Math.max(oe,$e),0)):Le&&Le!=="0"?Le:void 0,hs=Ht.value.split(",").map((Ie)=>Ie.trim().toLowerCase()).filter(Boolean),ha=a?.id,xn=[];if(a&&U.toLowerCase()!==a.label.trim().toLowerCase()){let Ie=ie(U,a.id),gs=Z.stats.some((va)=>va.id===Ie&&va.id!==a.id);if(Ie&&Ie!==a.id&&!gs)ha=Ie,xn.push({fromId:a.id,toId:Ie})}let St=re({...a,id:ha,label:U,icon:I.value.trim()||"\uD83D\uDCCA",scope:d,kind:v,volatility:M,displayStyle:h,layoutSpan:x,color:L,min:oe,max:$e,...fa!==void 0?{defaultValue:fa}:{},anchors:fs(st.value),triggerCues:ye.value.trim(),calculationMode:be,formula:be==="local_formula"||be==="ai_plus_local"?ue.value.trim():void 0,formulaOutputTemplate:be==="local_formula"||be==="ai_plus_local"?He.value.trim():void 0,promptTriggerMode:Dt,promptKeywords:hs,injectInContinuity:dn,categoryId:g||void 0,pinnedToHeader:S,locked:y,widgetTabId:T,inlineTabId:A,dossierTabId:w,extraWidgetTabIds:[...Bt].filter((Ie)=>Ie!==T),showIn:{widget:f,inline:C,dossier:P,pinnedHeader:S}}),ga=a?Z.stats.findIndex((Ie)=>Ie.id===a.id):-1,ba=Z.stats.findIndex((Ie)=>Ie.id===St.id);if(ga>=0)Z.stats[ga]=St;else if(ba>=0)Z.stats[ba]=St;else Z.stats.push(St);e.request("state:mutate",{templatePatch:{stats:Z.stats},...xn.length?{statRenames:xn}:{},reason:`Saved stat schema "${St.label}"`}),r()},"ls-btn-primary"),zt=t("div","ls-row-between");if(zt.style.marginTop="12px",a){let U=t("div","ls-row");U.append(R("Duplicate to Another Tab…",()=>{r(),We(e,a)},"ls-btn-sm"),R("\uD83D\uDDD1️ Delete Stat",async()=>{if(!await e.modals.confirm({title:`Delete "${a.label}"?`,message:`Remove "${a.icon} ${a.label}" from the active template and stop tracking it?`,confirmLabel:"Delete",variant:"danger"}))return;let pe=structuredClone(e.snapshot.template);e.request("state:mutate",{templatePatch:{stats:pe.stats.filter((oe)=>oe.id!==a.id)},reason:`Deleted stat "${a.label}"`}),e.notify(`Deleted "${a.icon} ${a.label}".`),r()},"ls-btn-sm ls-btn-danger")),zt.append(U,ua)}else zt.append(t("span"),ua);o.append(zt)})}function Bn(e,n,a,s,o=!1,r=!0){let{state:u,template:i,deltas:d}=e.snapshot,g=t("div","ls-stack");if(r){let f=t("div","ls-row-between");f.append(t("span","ls-kicker",`Active Stats (${n.length})`),t("div","ls-row")),f.lastElementChild.append(Q("flask",()=>Ze(e),{label:"Sandbox",className:"ls-btn-sm ls-btn-ghost",title:"Test stats in AI Sandbox"}),Q("plus",()=>Ce(e,a),{label:"Add Stat",className:"ls-btn-sm ls-btn-primary",title:"Create a new stat or meter"})),g.append(f)}if(!n.length)return g.append(t("p","ls-muted",'No stats assigned here yet. Click "+ Add Stat" or customize tab assignments in Studio.')),g;let v=new Map((i.categories??[]).map((f)=>[f.id,f])),M=n.filter((f)=>{if(!f.categoryId)return!0;let C=v.get(f.categoryId);return!C||C.enabled!==!1}),h=t("div","ls-stat-grid"),x=(f,C,P="set")=>{e.request("state:mutate",{patch:{stats:{[f.id]:{op:P,value:C,reason:"Manual UI adjustment"}}},reason:`Updated ${f.label} to ${String(C)}`})},L=[],T=[...M].sort((f,C)=>{let P=f.categoryId?v.get(f.categoryId)?.order??999:1000,S=C.categoryId?v.get(C.categoryId)?.order??999:1000;return P-S}),A;for(let f of T){let C=f.categoryId?v.get(f.categoryId):void 0;if(C&&C.showGroupHeaderInHud!==!1&&C.id!==A){A=C.id;let W=t("div","ls-hud-cat-head");W.style.borderLeftColor=C.color||"var(--ls-primary)",W.append(t("strong","",`${C.icon} ${C.name}`)),h.append(W)}else if(!C&&A!==void 0)A=void 0;let P=u.stats[f.id],S=Boolean(P?.calibrated),y=P!==void 0?P.value:f.defaultValue,m=Boolean(f.locked||P?.locked),p=d.statDeltas[f.id]??0,l=String(y??""),b=["skill_tree","xp_level","attributes","inventory","status_fx"].includes(f.kind),I=Boolean(f.displayStyle&&f.displayStyle!=="auto"),c=f.kind==="text"||f.kind==="tags"||f.kind==="tier",k=!b&&(I||c||S&&typeof y==="string"&&(l.length>24||/->|→|\n|;/.test(l))),E=/->|→|\n|;/.test(l),B=f.displayStyle==="stat_pills_grid"||f.displayStyle==="meter_mini_bars",N=f.layoutSpan==="full"||f.layoutSpan!=="half"&&(["skill_tree","attributes","inventory","status_fx","xp_level"].includes(f.kind)||I&&!B||k&&(l.length>40||E))?"full":"half",_=t("div","ls-stat-cell");if(_.style.setProperty("--ls-bar-color",f.color||"var(--ls-primary)"),_.dataset.locked=String(m),_.dataset.uncalibrated=String(!S),_.dataset.span=N,P?.lastReason)_.title=`${P.lastReason} (Right-click or long-press for options)`;let D=t("div","ls-row-between"),H=t("div","ls-row");if(H.append(t("strong","",`${f.icon} ${f.label}`)),f.calculationMode==="ai_plus_local")H.append(t("span","ls-chip ls-chip-accent","\uD83D\uDD00 Hybrid"));else if(f.calculationMode==="local_formula"||f.formula)H.append(t("span","ls-chip ls-chip-accent","⚡ Local"));D.append(H);let F=t("div","ls-row");if(p!==0)F.append(t("span",`ls-delta ${p>0?"is-pos":"is-neg"}`,`${p>0?`+${p} ▲`:`${p} ▼`}`));let V="";if(!S&&!b)V="Uncalibrated";else if(f.kind==="clock"||f.kind==="pips")V=`${Number(y)||0}/${f.max}`;else if(f.kind==="boolean")V=y?"✓ Active":"○ Inactive";else if(b||f.kind==="currency"||f.kind==="hearts")V="";else if(k){let W=Et(l).length;V=W>1?`${W} entries`:""}else V=l;let O=t("strong",V?"ls-chip ls-chip-accent":"",V);if(V)F.append(O);if(F.append(Q("edit",()=>Ce(e,f.scope,f),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:`Edit "${f.label}" style, tab & prompt`})),D.append(F),_.append(D),typeof y==="number"&&S&&!k&&f.kind!=="currency"){let W=Ue(f.anchors,y);if(W)_.append(t("small","ls-muted",W))}else if(!S&&!b)_.append(t("small","ls-muted","Calibrates automatically on turn sync"));if(f.kind==="skill_tree")_.append(pt(f,y,m,(W,q)=>{e.request("state:mutate",{patch:{stats:{[f.id]:{op:"set",value:W,reason:q}}},reason:q})}));else if(f.kind==="xp_level")_.append(ut(f,y));else if(f.kind==="attributes")_.append(mt(f,y,`player:${e.chatId}`));else if(f.kind==="inventory")_.append(ft(y));else if(f.kind==="status_fx")_.append(ht(y));else if(f.kind==="hearts")_.append(gt(f,Number(y)||0,S,m,(W)=>x(f,W,"set")));else if(f.kind==="currency")_.append(bt(f,y,p));else if(k&&S&&l&&l!=="None")_.append(Xe(l,f.displayStyle??"auto"));else if(f.kind==="clock"){let W=Math.max(2,Math.min(16,f.max||6)),q=S?Math.max(0,Math.min(W,Math.round(Number(y)||0))):0,z=t("div","ls-clock-bar");z.style.gridTemplateColumns=`repeat(${W}, 1fr)`;for(let j=1;j<=W;j++){let K=t("span",`ls-clock-seg${j<=q?" is-filled":""}`);K.addEventListener("click",()=>x(f,j===q?j-1:j,"set")),z.append(K)}_.append(z)}else if(f.kind==="pips"){let W=Math.max(1,Math.min(12,f.max||5)),q=S?Math.max(0,Math.min(W,Math.round(Number(y)||0))):0,z=t("div","ls-row");for(let j=1;j<=W;j++)z.append(R(j<=q?"◆":"◇",()=>x(f,j===q?j-1:j,"set"),"ls-btn-sm ls-btn-icon"));_.append(z)}else if(!k&&(f.kind==="meter"||f.kind==="number")){let W=typeof y==="number"?y:Number(f.defaultValue)||0,q=Math.max(1,f.max-f.min),z=t("div","ls-bar-track"),j=t("div","ls-bar-fill");if(f.min<0&&f.max>0){z.dataset.bipolar="true";let K=(0-f.min)/q*100;if(W>=0)j.style.marginLeft=`${K.toFixed(1)}%`,j.style.width=`${Math.min(100-K,W/f.max*(100-K)).toFixed(1)}%`;else{let Y=Math.abs(W)/Math.abs(f.min)*K;j.style.marginLeft=`${Math.max(0,K-Y).toFixed(1)}%`,j.style.width=`${Math.min(K,Y).toFixed(1)}%`,j.style.background="var(--ls-danger)"}}else{let K=Math.max(0,Math.min(100,Math.round((W-f.min)/q*100)));j.style.width=`${K}%`}if(z.append(j),_.append(z),o&&s&&e.ctx.components?.mountRangeSlider){let K=t("div");_.append(K);try{s.track(e.ctx.components.mountRangeSlider(K,{min:f.min,max:f.max,step:f.step||1,integer:!0,value:W,disabled:m,onDragValue:(Y)=>{if(Y!==null)O.textContent=String(Y)},onCommit:(Y)=>x(f,Y,"set")}))}catch{}}}Ut(e.ctx,_,()=>[{key:"pin",label:f.pinnedToHeader?"\uD83D\uDCCC Unpin from Header":"\uD83D\uDCCD Pin to Header",active:f.pinnedToHeader},{key:"lock",label:m?"\uD83D\uDD13 Unlock Stat":"\uD83D\uDD12 Lock Stat",active:m},{key:"edit",label:"✏️ Edit Stat Schema, Visual Style & Routing"},{key:"duplicate",label:"\uD83D\uDCCB Duplicate to Another Scope / Tab…"},{key:"test",label:"\uD83E\uDDEA Test in AI Sandbox"},{key:"div",label:"",type:"divider"},{key:"delete",label:"\uD83D\uDDD1️ Delete Stat",danger:!0}],(W)=>{if(W==="pin"){let q=i.stats.map((z)=>z.id===f.id?{...z,pinnedToHeader:!z.pinnedToHeader,showIn:{...z.showIn,pinnedHeader:!z.pinnedToHeader}}:z);e.request("state:mutate",{templatePatch:{stats:q}})}else if(W==="lock"){let q=i.stats.map((z)=>z.id===f.id?{...z,locked:!m}:z);e.request("state:mutate",{templatePatch:{stats:q}})}else if(W==="edit")Ce(e,f.scope,f);else if(W==="duplicate")We(e,f);else if(W==="test")Ze(e,f.id);else if(W==="delete"){let q=i.stats.filter((z)=>z.id!==f.id);e.request("state:mutate",{templatePatch:{stats:q}})}}),L.push({cell:_,spanMode:N,autoSpan:!f.layoutSpan||f.layoutSpan==="auto"}),h.append(_)}let w=0;for(let f=0;f<L.length;f++){let C=L[f];if(C.spanMode==="half"){if(w++,(f===L.length-1||L[f+1].spanMode==="full")&&w%2===1&&C.autoSpan)C.cell.dataset.span="full",w=0}else w=0}return g.append(h),g}var Ka=new Map;function zs(e,n,a,s=!1){let{state:o,deltas:r}=e.snapshot,u=t("div","ls-stack"),i=Object.values(o.characters),d=i.filter((h)=>h.present),g=i.filter((h)=>!h.present),v=d.length>0?d:g,M=d.length>0?g:[];if(!i.length)return u.append(t("p","ls-muted",`${n.map((h)=>`${h.icon} ${h.label}`).join(", ")} will appear here once characters enter the scene.`)),u;for(let h of n){let x=t("div","ls-stat-cell");x.style.setProperty("--ls-bar-color",h.color||"var(--ls-primary)"),x.dataset.span="full";let L=t("div","ls-row-between");L.append(t("strong","",`${h.icon} ${h.label} (Cast)`),R("✏️",()=>Ce(e,"character",h),"ls-btn-sm ls-btn-icon","Customize stat schema & tab")),x.append(L);let T=["skill_tree","xp_level","attributes","inventory","status_fx"].includes(h.kind),A=Boolean(h.displayStyle&&h.displayStyle!=="auto")||["text","tags","tier"].includes(h.kind),w=(C,P)=>{let S=P.meters[h.id],y=Boolean(S?.calibrated),m=y&&S?S.value:h.defaultValue,p=r.characterDeltas[P.id]?.[h.id]??0;if(T||A||h.kind==="boolean"||h.kind==="hearts"||h.kind==="currency"){let H=t("div","ls-cast-mini-meter");H.style.gridColumn="1 / -1";let F=t("div","ls-row-between");if(F.append(t("small","ls-muted",`${P.present?"\uD83D\uDFE2":"⚪"} ${P.name}`),t("small","",y||T?"":"Uncalibrated")),H.append(F),h.kind==="skill_tree")H.append(pt(h,m,Boolean(h.locked||S?.locked),(V,O)=>{e.request("state:mutate",{patch:{characters:[{id:P.id,name:P.name,meters:{[h.id]:{op:"set",value:V,reason:O}}}]},reason:O})}));else if(h.kind==="xp_level")H.append(ut(h,m));else if(h.kind==="attributes")H.append(mt(h,m,`${P.id}:${e.chatId}`));else if(h.kind==="inventory")H.append(ft(m));else if(h.kind==="status_fx")H.append(ht(m));else if(h.kind==="hearts")H.append(gt(h,Number(m)||0,y,Boolean(h.locked||S?.locked)));else if(h.kind==="currency")H.append(bt(h,m,p));else H.append(y?Xe(String(m??""),h.displayStyle??"auto"):t("small","ls-muted","—"));C.append(H);return}let l=y&&typeof m==="number"?m:0,b=Math.max(1,h.max-h.min),I=y?Math.max(0,Math.min(100,Math.round((l-h.min)/b*100))):0,c=y?Ue(h.anchors,l):"",k=t("div","ls-cast-mini-meter");if(c)k.title=`${P.name} · ${h.label}: ${l} (${c})`;let E=t("div","ls-row-between");E.append(t("small","ls-muted",`${P.present?"\uD83D\uDFE2":"⚪"} ${P.name}`));let B=t("div","ls-row");if(p!==0)B.append(t("span",`ls-delta ${p>0?"is-pos":"is-neg"}`,p>0?`+${p}`:String(p)));let N=t("strong","",y?h.kind==="clock"||h.kind==="pips"?`${l}/${h.max}`:String(l):"—");B.append(N),E.append(B);let _=t("div","ls-bar-track"),D=t("div","ls-bar-fill");if(D.style.width=`${I}%`,_.append(D),k.append(E,_),s&&a&&e.ctx.components?.mountRangeSlider){let H=t("div");k.append(H);try{a.track(e.ctx.components.mountRangeSlider(H,{min:h.min,max:h.max,step:h.step||1,integer:!0,value:l,disabled:Boolean(h.locked||S?.locked),onDragValue:(F)=>{if(F!==null)N.textContent=String(F)},onCommit:(F)=>{e.request("state:mutate",{patch:{characters:[{id:P.id,name:P.name,meters:{[h.id]:{op:"set",value:F,reason:"Manual UI adjustment"}}}]},reason:`Updated ${P.name} ${h.label} to ${F}`})}}))}catch{}}C.append(k)},f=t("div","ls-cast-mini-grid");for(let C of v)w(f,C);if(x.append(f),M.length>0){let C=t("details","ls-stat-acc");C.open=Ka.get(h.id)??!1,C.addEventListener("toggle",()=>{Ka.set(h.id,C.open)});let P=t("summary","ls-stat-acc-head");P.append(t("small","ls-muted",`⚪ Away (${M.length}): ${M.map((m)=>m.name).join(", ")}`),t("small","ls-muted","▾"));let S=t("div","ls-stat-acc-body"),y=t("div","ls-cast-mini-grid");for(let m of M)w(y,m);S.append(y),C.append(P,S),x.append(C)}u.append(x)}return u}function tn(e,n,a,s,o=!1){let{template:r}=e.snapshot,u=r.stats.filter((h)=>{if(!h.enabled)return!1;if(n==="widget"&&h.showIn?.widget===!1)return!1;if(n==="inline"&&h.showIn?.inline===!1)return!1;let x=h.scope==="character"?"cast":h.tabId,L=n==="widget"?h.widgetTabId||x:h.inlineTabId||x,T=n==="widget"?h.extraWidgetTabIds:h.extraInlineTabIds;return L===a||Boolean(T?.includes(a))}),i=u.filter((h)=>h.scope!=="character"),d=u.filter((h)=>h.scope==="character"),g=a==="world"?"world":"player",v=t("div","ls-stack"),M=Vs(e,n,a);if(M.childElementCount>0)v.append(M);if(i.length>0||d.length===0&&v.childElementCount===0)v.append(Bn(e,i,g,s,o,!0));if(d.length>0)v.append(zs(e,d,s,o));if(a==="world"){let h=js(e);if(h.childElementCount>0)v.append(h)}return v}function Vs(e,n,a="stats"){let{state:s,template:o}=e.snapshot,r=o.coreTrackers,u=t("div","ls-stat-grid"),i=(d,g,v)=>{let M=Fe(r,d);if(!M.enabled)return;if(n!=="drawer"&&!M.showCard)return;if(n==="widget"&&M.widgetTabId&&M.widgetTabId!==a)return;if(n==="inline"&&M.inlineTabId&&M.inlineTabId!==a)return;let h=t("div","ls-stat-cell");h.style.setProperty("--ls-bar-color",M.color||"var(--ls-primary)"),h.dataset.locked=String(Boolean(M.locked));let x=M.layoutSpan==="half"||M.layoutSpan==="full"?M.layoutSpan:g.length>48||/->|→|\n|;/.test(g)?"full":"half";h.dataset.span=x;let L=t("div","ls-row-between");L.append(t("strong","",`${M.icon||"\uD83D\uDCCA"} ${M.label}`),t("div","ls-row")),L.lastElementChild.append(Q("sliders",()=>Qt(e,d),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:`Full Edit "${M.label}" (Prompt, Style, Tab & Color)`}),Q("edit",()=>_t(e),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:`Edit ${M.label} value`}));let T=M.displayStyle??"auto",A=T!=="auto"||v||/->|→|\n|;/.test(g);h.append(L,A?Xe(g,T):t("p","",g)),u.append(h)};if(s.player.condition&&s.player.condition!=="Normal")i("player_condition",s.player.condition,!0);if(s.player.attire)i("player_attire",s.player.attire,!1);if(s.player.notableAction)i("player_action",s.player.notableAction,!1);if(n!=="drawer"&&s.scene.beatSummary)i("scene_summary",s.scene.beatSummary,!1);return u}function js(e){let{state:n,template:a}=e.snapshot,s=a.coreTrackers,o=t("div","ls-stack"),r=Fe(s,"quests"),u=Fe(s,"dispatches"),i=Object.values(n.quests);if(r.enabled&&!r.deleted&&s?.showQuestsInWidget!==!1&&i.length>0){let d=t("div","ls-stat-cell");d.dataset.span="full",d.append(t("strong","",`${r.icon||"\uD83C\uDFAF"} ${r.label} (${i.filter((g)=>g.status==="active").length})`));for(let g of i){let v=t("div","ls-stack");v.style.gap="3px",v.append(t("small","ls-kicker",`${g.title} (${g.status})`));for(let[M,h]of g.objectives.entries()){let x=t("label","ls-row"),L=t("input");L.type="checkbox",L.checked=h.completed,L.addEventListener("change",()=>{let T=g.objectives.map((w,f)=>f===M?{...w,completed:L.checked}:w),A=T.every((w)=>w.completed);e.request("state:mutate",{patch:{quests:[{id:g.id,title:g.title,status:A?"completed":"active",objectives:T}]}})}),x.append(L,t("small",h.completed?"ls-muted":"",h.text)),v.append(x)}d.append(v)}o.append(d)}if(u.enabled&&!u.deleted&&s?.showDispatchesInWidget!==!1&&n.dispatches.length>0){let d=t("div","ls-stat-cell");d.dataset.span="full",d.append(t("strong","",`${u.icon||"\uD83D\uDCE1"} ${u.label} (${n.dispatches.length})`));for(let g of[...n.dispatches].reverse().slice(0,3)){let v=t("div","ls-bond-dir-box");v.append(t("strong","",`${g.title} · \uD83D\uDCCD ${g.locationName}`),t("small","ls-muted",g.summary)),d.append(v)}o.append(d)}return o}function Us(e){let{theme:n}=e.snapshot.template;e.modals.open({title:"\uD83D\uDCD0 Widget & Pill Size Customizer (Any Extreme)",width:520},(a,s)=>{let o=n.widgetWidth??460,r=n.widgetHeight??540,u=n.pillWidth??420,i=n.pillHeight??92,d=t("div","ls-card");d.append(t("span","ls-kicker","1-Click Widget Size Presets"));let g=t("div","ls-row");for(let[S,y,m]of[["Micro (280×240)",280,240],["Compact (380×420)",380,420],["Standard (460×540)",460,540],["Wide (680×560)",680,560],["Theater (920×720)",920,720],["Extreme Max (1180×860)",1180,860]])g.append(R(S,()=>{o=y,r=m,x.value=String(o),T.value=String(r),e.widgetExpanded=!0,e.onResizeWidgetLive?.(o,r,!0)},"ls-btn-sm"));let v=t("div","ls-row");v.append(t("small","ls-muted","Widget Tabs:"));for(let[S,y]of[[!1,"\uD83C\uDFF7️ Icons + Labels"],[!0,"✨ Icons Only"]]){let m=R(y,()=>{e.request("state:mutate",{templatePatch:{theme:{...e.snapshot.template.theme,widgetTabsIconOnly:S}},reason:`Set widget tabs to ${S?"icons only":"icons + labels"}`})},"ls-btn-sm");if(Boolean(e.snapshot.template.theme.widgetTabsIconOnly)===S)m.setAttribute("aria-current","page");v.append(m)}d.append(g,v);let M=t("div","ls-grid"),h=t("label","ls-label","Expanded Width (240–1200 px)"),x=t("input","ls-input");x.type="number",x.min="240",x.max="1200",x.value=String(o),h.append(x);let L=t("label","ls-label","Expanded Height (180–900 px)"),T=t("input","ls-input");T.type="number",T.min="180",T.max="900",T.value=String(r),L.append(T);let A=t("label","ls-label","Collapsed Pill Width (220–960 px)"),w=t("input","ls-input");w.type="number",w.min="220",w.max="960",w.value=String(u),A.append(w);let f=t("label","ls-label","Collapsed Pill Height (56–220 px)"),C=t("input","ls-input");C.type="number",C.min="56",C.max="220",C.value=String(i),f.append(C),M.append(h,L,A,f);let P=R("\uD83D\uDCBE Apply & Save Dimensions",()=>{let S=Math.max(240,Math.min(1200,Number(x.value)||460)),y=Math.max(180,Math.min(900,Number(T.value)||540)),m=Math.max(220,Math.min(960,Number(w.value)||420)),p=Math.max(56,Math.min(220,Number(C.value)||92));if(e.request("state:mutate",{templatePatch:{theme:{...e.snapshot.template.theme,widgetWidth:S,widgetHeight:y,pillWidth:m,pillHeight:p}},reason:`Resized widget (${S}×${y})`}),e.widgetExpanded)e.onResizeWidgetLive?.(S,y,!1);else e.onResizeWidgetLive?.(m,p,!1);s()},"ls-btn-primary");a.append(d,M,P)})}function Dn(e,n){let{state:a,template:s,deltas:o}=e.snapshot,r=s.theme.showSceneChips,u=Ne(a),i=t("div","ls-game-pill-main");if(r.location&&!n?.omitLocation)i.append(t("span","ls-chip ls-chip-accent",`\uD83D\uDCCD ${u.location}`));if(r.time)i.append(t("span","ls-chip",`\uD83D\uDD70️ ${u.time}`));if(r.date&&u.date)i.append(t("span","ls-chip",`\uD83D\uDCC5 ${u.date}`));if(r.weather&&u.weather&&u.weather!=="Clear")i.append(t("span","ls-chip",`\uD83C\uDF26️ ${u.weather}`));let d=Object.values(a.characters).filter((v)=>v.present);if(r.cast&&d.length>0){let v=t("div","ls-avatar-stack");v.title=`In Scene: ${d.map((M)=>M.name).join(", ")}`;for(let M of d.slice(0,4)){let h=t("span","ls-avatar-stack-item");if(M.portraitUrl){let x=t("img");x.src=M.portraitUrl,x.alt=M.name,h.append(x)}else h.textContent=M.name.slice(0,2).toUpperCase();v.append(h)}i.append(v)}let g=r.pinnedStats?s.stats.filter((v)=>v.enabled&&(v.pinnedToHeader||v.showIn?.pinnedHeader)):[];for(let v of g.slice(0,3)){let M=v.scope==="character",h=d[0]??Object.values(a.characters)[0],x=M?h?.meters[v.id]:a.stats[v.id];if(!x?.calibrated)continue;let L=x.value,T=M?h?o.characterDeltas[h.id]?.[v.id]??0:0:o.statDeltas[v.id]??0;if(typeof L==="number"&&v.kind!=="currency"){let A=t("div","ls-pill-gauge");A.style.setProperty("--ls-bar-color",v.color||"var(--ls-primary)");let w=t("div","ls-pill-gauge-top");w.append(t("span","",`${v.icon} ${M&&h?h.name.split(" ")[0]:v.label}`),t("span","",`${L}${T!==0?T>0?` +${T}`:` ${T}`:""}`));let f=t("div","ls-pill-gauge-track"),C=t("div","ls-bar-fill"),P=Math.max(1,v.max-v.min),S=Math.max(0,Math.min(100,Math.round((L-v.min)/P*100)));C.style.width=`${S}%`,f.append(C),A.append(w,f),i.append(A)}else i.append(t("span","ls-chip",`${v.icon} ${M&&h?`${h.name}: `:""}${String(L)}`))}return i}function yt(e,n,a,s,o,r){let{state:u,template:i}=e.snapshot,d=t("section","ls-hud");e.stampThemeOnElement(d);let g=async(S)=>{let y=()=>lt(e,o);if(typeof e.ctx.ui?.showContextMenu!=="function"){y();return}let{selectedKey:m}=await e.ctx.ui.showContextMenu({position:{x:S.clientX,y:S.clientY},items:[{key:"edit_scene",label:"Edit Scene Values (Location, Time, Date)"},{key:"pill_prompts",label:"Edit Scene Pill AI Prompts & Chips"},{key:"div1",label:"",type:"divider"},{key:"template",label:`Switch Template & Skin (${i.name})`},{key:"resize",label:"Resize Floating Widget"},{key:"studio",label:"Open Full Settings Studio"}]});if(m==="edit_scene")_t(e);else if(m==="pill_prompts")Ae(e);else if(m==="template")lt(e,o);else if(m==="resize")Us(e);else if(m==="studio")o()},v=()=>{let S=t("div","ls-row"),y=Q("sync",()=>void e.request("track:manual"),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:e.busy?"Calibrating…":"Sync & calibrate current turn"});y.disabled=e.busy;let m=Q("stage",()=>e.toggleVnStage(),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:"Launch 2D Visual Novel Stage & Voices"}),p=Q("more",(I)=>void g(I),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:"Scene Pill Prompts, Template Switcher, Resize & Studio"}),l=Q("settings",()=>{console.log("[LumiStats FloatingHud] ⚙️ studio button clicked"),o()},{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:"Open Lumi Stats Studio"}),b=Q(n?"chevronDown":"chevronUp",a,{label:n?"Expand":"Pill",className:"ls-btn-sm ls-btn-primary",title:n?"Expand Floating HUD":"Collapse to Status Pill"});return S.append(y,m,p,l,b),S};if(n){let S=i.theme.pillStyle||"glass_capsule",y=i.theme.showSceneChips,m=Ne(u),p=t("div","ls-hud-pill");p.dataset.pillSkin=S,p.addEventListener("click",(N)=>{if(N.target instanceof Element&&N.target.closest("button"))return;a()});let l=t("div","ls-row-between ls-pill-top-deck"),b=t("span","ls-hud-title-badge"),I=t("span","ls-pill-live-dot"),c=y.location?u.scene.location||u.title||"Lumi Stats":u.title||i.name||"Lumi Stats",k=S==="cyber_telemetry"?`${y.location?"LOC":"HUD"} // ${c.toUpperCase()}`:S==="ledger_strip"&&y.date?`${m.date} · ${c}`:c;b.append(I,t("span","",i.icon||"✨"),t("span","ls-pill-title-text",k));let E=v();E.classList.add("ls-pill-actions"),l.append(b,E),p.append(l);let B=!1;if(S!=="compact_badge"){if(u.initialized){let N=Dn(e,{omitLocation:!0});if(N.childElementCount>0)N.classList.add("ls-pill-bottom-deck"),p.append(N),B=!0}else if(e.chatId){let N=t("div","ls-row ls-pill-bottom-deck");N.append(R("Calibrate World Now",()=>void e.request("track:manual"),"ls-btn-sm ls-btn-primary"),R("Studio",o,"ls-btn-sm")),p.append(N),B=!0}}return p.dataset.emptyDeck=String(!B),d.append(p),d}let M=[...i.surfaces.widgetTabs].filter((S)=>S.enabled&&(S.kind!=="web"||i.surfaces.showRelationshipWeb!==!1)).sort((S,y)=>S.order-y.order),h=M.find((S)=>S.id===e.activeSurfaceTab)??M[0]??{id:"stats",label:"Stats",icon:"\uD83D\uDCCA",kind:"stats",enabled:!0,order:0},x=t("nav","ls-hud-header-bar"),L=t("div","ls-hud-top-row"),T=R(`${i.icon} ${u.scene.location||u.title||"Lumi Stats"}`,()=>Ae(e),"ls-btn-sm ls-btn-ghost ls-hud-title-badge","Click to customize Scene Pill prompt & visible chips");L.append(T,v());let A=Boolean(i.theme.widgetTabsIconOnly),w=t("div","ls-hud-tabs-scroll"),f=(S)=>/[^\w\s]/u.test(S.trim());for(let S of M){let y=S.kind==="cast"?` (${Object.keys(u.characters).length})`:S.kind==="map"?` (${Object.keys(u.places).length})`:"",m=`${S.label}${y}`,p=A&&f(S.icon),l=R(p?S.icon:`${S.icon} ${m}`,()=>{e.activeSurfaceTab=S.id,e.emitChange()},`ls-btn-sm${p?" ls-hud-tab-icon-only":""}`,m);if(S.id===h.id)l.setAttribute("aria-current","page");w.append(l)}x.append(L,w),d.append(x);let C=t("div","ls-hud-content");if(!u.initialized){let S=t("div","ls-card");if(S.append(t("strong","",e.chatId?"Ready to calibrate this story":"Open a chat to begin"),t("p","ls-muted","Send a message for automatic two-phase calibration, or click below to calibrate now:")),e.chatId)S.append(R("✨ Calibrate Stats Now",()=>void e.request("track:manual"),"ls-btn-primary"));return C.append(S),d.append(C),d}if(i.surfaces.customWidgetHtml){let S=t("div","ls-card");C.append(S),Be(S,De(i.surfaces.customWidgetHtml,u),e.ctx)}if(u.modifiers.length>0&&h.kind==="stats"){let S=t("div","ls-row");for(let y of u.modifiers){let m=t("span","ls-rpg-fx-pill",`${y.delta>=0?"▲":"▼"} ${y.label} (${y.delta>=0?`+${y.delta}`:y.delta}${y.remainingTurns?` · ${y.remainingTurns}t`:""})`);m.dataset.fxKind=y.delta>=0?"buff":"debuff",S.append(m)}C.append(S)}if(h.kind==="cast")C.append(nn(e,"widget",h.id,s));else if(h.kind==="web")C.append(Zt(e,s));else if(h.kind==="map")C.append(en(e));else{if(h.customHtml){let S=t("div","ls-card");C.append(S),Be(S,De(h.customHtml,u),e.ctx)}C.append(tn(e,"widget",h.id,r,!1))}d.append(C);let P=t("div","ls-hud-resize-grip","◢");return P.title="Drag to resize widget to any size",P.addEventListener("pointerdown",(S)=>{if(S.button!==0||!e.onResizeWidgetLive)return;S.preventDefault(),S.stopPropagation();let y=d.getBoundingClientRect(),m=y.width>0&&d.offsetWidth>0?y.width/d.offsetWidth:1,{clientX:p,clientY:l}=S,b=d.offsetWidth||(i.theme.widgetWidth??460),I=d.offsetHeight||(i.theme.widgetHeight??540),c=b,k=I;try{P.setPointerCapture(S.pointerId)}catch{}let E=(N)=>{let _=(N.clientX-p)/m,D=(N.clientY-l)/m;c=Math.max(240,Math.min(1200,Math.round(b+_))),k=Math.max(180,Math.min(900,Math.round(I+D))),e.onResizeWidgetLive?.(c,k,!1)},B=(N)=>{P.removeEventListener("pointermove",E),P.removeEventListener("pointerup",B),P.removeEventListener("pointercancel",B);try{P.releasePointerCapture(N.pointerId)}catch{}e.onResizeWidgetLive?.(c,k,!0)};P.addEventListener("pointermove",E),P.addEventListener("pointerup",B),P.addEventListener("pointercancel",B)}),d.append(P),d}var Hn="characters",an="",sn="";function Za(e){let n=(e.scene.timeLabel||ct(e.elapsedMinutes)||"").trim(),a=n.toLowerCase();if(/\b(?:dawn|sunrise|morning|breakfast)\b/.test(a))return"morning";if(/\b(?:noon|midday|afternoon|daytime|lunch)\b/.test(a))return"day";if(/\b(?:dusk|sunset|evening|twilight|dinner)\b/.test(a))return"evening";if(/\b(?:night|midnight|late\s*night|moon)\b/.test(a))return"night";let s=n.match(/(\d{1,2})\s*:\s*(\d{2})\s*(am|pm)?/i);if(s){let u=Number(s[1]),i=s[3]?.toLowerCase();if(i==="pm"&&u<12)u+=12;if(i==="am"&&u===12)u=0;if(u>=5&&u<11)return"morning";if(u>=11&&u<17)return"day";if(u>=17&&u<20)return"evening";return"night"}let o=(Math.max(0,Math.round(e.elapsedMinutes))+480)%1440,r=Math.floor(o/60);if(r>=5&&r<11)return"morning";if(r>=11&&r<17)return"day";if(r>=17&&r<20)return"evening";return"night"}function Xa(e,n){if(!e)return{url:"",matchedLabel:"No Location"};let a=e.backdropVariants??[],s=a.find((d)=>d.pinned&&d.url);if(s)return{url:s.url,matchedLabel:`\uD83D\uDCCC ${s.customTag||s.timeSlot}`};let o=[n.scene.weather,n.scene.timeLabel,n.scene.dateLabel,e.atmosphere].filter(Boolean).join(" ").toLowerCase();for(let d of a)if(d.timeSlot==="custom"&&d.customTag&&d.url){let g=d.customTag.toLowerCase().split(/[,/|\s]+/).filter((v)=>v.length>=2);if(g.length>0&&g.every((v)=>o.includes(v)))return{url:d.url,matchedLabel:`\uD83C\uDFF7️ ${d.customTag}`}}let r=Za(n),u=a.find((d)=>d.timeSlot===r&&d.url);if(u)return{url:u.url,matchedLabel:`\uD83D\uDD70️ ${r}`};let i=a.find((d)=>d.timeSlot==="default"&&d.url);if(i)return{url:i.url,matchedLabel:"Default"};return{url:e.backdropUrl||"",matchedLabel:e.backdropUrl?"Default":"Atmospheric Stage"}}function Fn(e,n){let a=e.trim().toLowerCase(),s=n.trim().toLowerCase();if(!a||!s)return 0;if(s.includes(a))return 2;let o=a.split(/[^a-z0-9]+/).filter((u)=>u.length>=3);if(!o.length)return 0;let r=o.filter((u)=>s.includes(u)).length;return r>0?r/o.length:0}function Ya(e,n=""){let a=e.spriteVariants??[],s=a.find((h)=>h.pinned&&h.url);if(s)return{url:s.url,matchedLabel:`\uD83D\uDCCC ${s.label}`};let o=he(e,"demeanor"),r=he(e,"attire_layers")||e.attire||"",u=String(e.meters.acted?.value??""),d=[he(e,"immediate_goal"),u,n].filter(Boolean).join(" "),g,v=0;for(let h of a){if(!h.url)continue;let x=0,L=0;if(h.clothesTag.trim()){L++;let T=Fn(h.clothesTag,`${r} ${n}`);if(T>0)x+=3.5*T;else x-=1}if(h.emotionTag.trim()){L++;let T=Fn(h.emotionTag,`${o} ${n}`);if(T>0)x+=2.5*T}if(h.poseTag.trim()){L++;let T=Fn(h.poseTag,d);if(T>0)x+=2*T}if(L===0)x=0.1;if(x>v)v=x,g=h}if(g)return{url:g.url,matchedLabel:g.label};let M=(o||"neutral").toLowerCase();if(e.expressionAssets[M]?.url)return{url:e.expressionAssets[M].url,matchedLabel:M};return{url:e.portraitUrl||"",matchedLabel:e.portraitUrl?"Base Sprite":""}}function Qa(e,n){let{state:a}=e.snapshot,s=t("div","ls-stack"),o=n??(()=>e.emitChange()),r=t("div","ls-subnav-pills"),u=Object.values(a.characters),i=Object.values(a.places);for(let[S,y]of[["characters",`\uD83C\uDFAD Character Sprites: Emotion, Clothes & Poses (${u.length})`],["locations",`\uD83C\uDFDE️ Discovered Locations: Time-of-Day & Weather Backdrops (${i.length})`]]){let m=R(y,()=>{Hn=S,o()},"ls-btn-sm");if(Hn===S)m.setAttribute("aria-current","page");r.append(m)}if(s.append(r),Hn==="characters"){let S=(an?a.characters[an]:void 0)??u[0],y=t("div","ls-row-between"),m=t("div","ls-row");for(let j of u){let K=(j.spriteVariants?.length??0)+(j.portraitUrl?1:0),Y=R(`${j.present?"\uD83D\uDFE2":"⚪"} ${j.name} (${K})`,()=>{an=j.id,o()},"ls-btn-sm");if(j.id===S?.id)Y.setAttribute("aria-current","page");m.append(Y)}if(y.append(m,R("+ Add Character",()=>{e.modals.open({title:"➕ Add Character",width:420},(j,K)=>{let Y=t("label","ls-label","Character Name"),G=t("input","ls-input");Y.append(G);let ee=R("➕ Create Character",()=>{let te=G.value.trim();if(!te)return;let X=ie(te,"npc");an=X,e.request("state:mutate",{patch:{characters:[{id:X,name:te,present:!0}]},reason:`Added character "${te}"`}),K()},"ls-btn-primary");j.append(Y,ee)})},"ls-btn-sm ls-btn-primary")),s.append(y),!S){let j=t("div","ls-card");return j.append(t("strong","","No characters in Cast yet"),t("p","ls-muted",'Click "+ Add Character" above or sync a chat turn to start uploading character sprites.')),s.append(j),s}let p=t("section","ls-card"),l=he(S,"demeanor"),b=he(S,"attire_layers")||S.attire;p.append(t("span","ls-kicker",`Upload New Sprite Rule for ${S.name}`),t("h3","",`\uD83D\uDDBC️ Add Sprite by Emotion, Clothes & Pose — ${S.name}`),t("p","ls-muted",'Fill in any combination of Emotion, Clothes/Outfit, and Pose/Action below (leave any box blank if it applies to all), then click "\uD83D\uDDBC️ Upload & Save Sprite". The VN Stage automatically switches to the matching sprite as the story changes!'));let I=t("div","ls-grid"),c=t("label","ls-label","\uD83C\uDFAD Emotion / Mood Tag (Text Box)"),k=t("input","ls-input");k.placeholder="e.g. neutral, happy, flustered, angry, brusque, shy…",k.value=l||"",c.append(k);let E=t("div","ls-row");for(let j of["neutral","happy","flustered","angry","sad","surprised","shy"])E.append(R(j,()=>{k.value=j},"ls-btn-sm ls-quick-pill"));c.append(E);let B=t("label","ls-label","\uD83D\uDC57 Clothes / Outfit Tag (Text Box)"),N=t("input","ls-input");if(N.placeholder="e.g. saree, bath towel, office wear, nightgown, casual…",N.value="",B.append(N),b)B.append(R(`✨ Use Current Outfit ("${b.slice(0,28)}")`,()=>{N.value=b},"ls-btn-sm ls-quick-pill"));let _=t("label","ls-label","\uD83E\uDDCD Pose / Action Tag (Text Box)"),D=t("input","ls-input");D.placeholder="e.g. standing, mopping, crossed arms, holding phone, leaning…",D.value="",_.append(D);let H=t("div","ls-row");for(let j of["standing","crossed arms","leaning in","looking away","sitting"])H.append(R(j,()=>{D.value=j},"ls-btn-sm ls-quick-pill"));_.append(H),I.append(c,B,_),p.append(I);let F=t("div","ls-row-between");F.append(t("small","ls-muted",`Current Live State — Demeanor: "${l||"neutral"}" · Outfit: "${b||"default"}"`),t("div","ls-row")),F.lastElementChild.append(R("\uD83D\uDDBC️ Upload Default / Base Sprite",()=>{e.pickAndUploadImage(S.id,"portrait")},"ls-btn-sm"),R("\uD83D\uDDBC️ Upload & Save Sprite Variant",()=>{e.uploadStageVariantAsset({targetId:S.id,kind:"sprite_variant",emotionTag:k.value.trim(),clothesTag:N.value.trim(),poseTag:D.value.trim()})},"ls-btn-primary")),p.append(F),s.append(p);let V=t("section","ls-card"),O=S.spriteVariants??[],W=Ya(S),q=t("div","ls-row-between");q.append(t("h3","",`\uD83D\uDDC2️ Saved Sprites for ${S.name} (${O.length+(S.portraitUrl?1:0)})`),W.url?t("span","ls-chip ls-chip-accent",`✓ Active on Stage: ${W.matchedLabel}`):t("span","ls-chip","No sprite uploaded yet")),V.append(q);let z=t("div","ls-asset-gallery");if(S.portraitUrl){let j=t("div","ls-asset-card"),K=t("div","ls-asset-thumb"),Y=t("img");Y.src=S.portraitUrl,Y.alt=`${S.name} Base Sprite`,K.append(Y);let G=t("div","ls-stack");G.style.gap="6px",G.append(t("strong","","⭐ Base / Fallback Sprite"),t("small","ls-muted","Used whenever no specific Emotion / Clothes / Pose variant matches."),R("\uD83D\uDD04 Replace Base Sprite",()=>e.pickAndUploadImage(S.id,"portrait"),"ls-btn-sm")),j.append(K,G),z.append(j)}if(O.forEach((j,K)=>{let Y=t("div","ls-asset-card");if(j.pinned)Y.style.borderColor="var(--ls-primary)";let G=t("div","ls-asset-thumb"),ee=t("img");ee.src=j.url,ee.alt=j.label,G.append(ee);let te=t("div","ls-stack");te.style.gap="5px";let X=t("input","ls-input");X.style.minHeight="28px",X.placeholder="Emotion tag (e.g. flustered)…",X.value=j.emotionTag;let ae=t("input","ls-input");ae.style.minHeight="28px",ae.placeholder="Clothes tag (e.g. saree, towel)…",ae.value=j.clothesTag;let ne=t("input","ls-input");ne.style.minHeight="28px",ne.placeholder="Pose tag (e.g. mopping)…",ne.value=j.poseTag;let ge=t("div","ls-row");ge.append(R("\uD83D\uDCBE Save Tags",()=>{let Se=structuredClone(a.characters),le=Se[S.id]?.spriteVariants;if(le&&le[K])le[K].emotionTag=X.value.trim(),le[K].clothesTag=ae.value.trim(),le[K].poseTag=ne.value.trim(),le[K].label=[le[K].emotionTag,le[K].clothesTag,le[K].poseTag].filter(Boolean).join(" · ")||"Default",e.request("state:mutate",{stateOverride:{characters:Se},reason:`Updated sprite tags for ${S.name}`}),e.notify(`Saved tags for ${S.name}'s sprite.`)},"ls-btn-sm ls-btn-primary"),R(j.pinned?"\uD83D\uDCCC Pinned":"\uD83D\uDCCD Pin",()=>{let Se=structuredClone(a.characters),le=Se[S.id]?.spriteVariants??[],xt=!j.pinned;le.forEach((et,ln)=>{et.pinned=ln===K?xt:!1}),e.request("state:mutate",{stateOverride:{characters:Se},reason:`${xt?"Pinned":"Unpinned"} sprite for ${S.name}`})},`ls-btn-sm ${j.pinned?"ls-btn-primary":""}`),R("\uD83D\uDDD1️",()=>{let Se=structuredClone(a.characters);if(Se[S.id]?.spriteVariants)Se[S.id].spriteVariants=Se[S.id].spriteVariants.filter((le)=>le.id!==j.id),e.request("state:mutate",{stateOverride:{characters:Se},reason:`Removed sprite variant from ${S.name}`})},"ls-btn-sm ls-btn-icon ls-btn-danger","Delete sprite variant")),te.append(t("strong","",j.label||"Sprite Variant"),X,ae,ne,ge),Y.append(G,te),z.append(Y)}),z.childElementCount===0)V.append(t("p","ls-muted",`No sprites uploaded for ${S.name} yet. Use the form above to upload sprites for different emotions, outfits, and poses.`));else V.append(z);return s.append(V),s}let d=(sn?a.places[sn]:void 0)??(a.currentPlaceId?a.places[a.currentPlaceId]:void 0)??i[0],g=t("div","ls-row-between"),v=t("div","ls-row");for(let S of i){let y=(S.backdropVariants?.length??0)||(S.backdropUrl?1:0),m=R(`${S.icon||"\uD83D\uDCCD"} ${S.name}${S.id===a.currentPlaceId?" (Here)":""} (${y})`,()=>{sn=S.id,o()},"ls-btn-sm");if(S.id===d?.id)m.setAttribute("aria-current","page");v.append(m)}if(g.append(v,R("+ Add Location",()=>{e.modals.open({title:"➕ Add Location to Atlas",width:440},(S,y)=>{let m=t("label","ls-label","Location Name"),p=t("input","ls-input");m.append(p);let l=t("label","ls-label","Description"),b=t("input","ls-input");l.append(b);let I=R("➕ Create Location",()=>{let c=p.value.trim();if(!c)return;let k=ie(c,"place");sn=k,e.request("state:mutate",{patch:{places:[{id:k,name:c,icon:"\uD83C\uDFDB️",description:b.value.trim()||"Location"}]},reason:`Added location "${c}"`}),y()},"ls-btn-primary");S.append(m,l,I)})},"ls-btn-sm ls-btn-primary")),s.append(g),!d){let S=t("div","ls-card");return S.append(t("strong","","No locations discovered yet"),t("p","ls-muted",'Click "+ Add Location" above or sync a chat turn to start uploading backdrops.')),s.append(S),s}let M=Za(a),h=Xa(d,a),x=t("section","ls-card"),L=t("div","ls-row-between");L.append(t("h3","",`${d.icon||"\uD83D\uDCCD"} ${d.name} — Time-of-Day & Weather Backdrops`),t("span","ls-chip ls-chip-accent",`\uD83D\uDD70️ Current Story Time: ${a.scene.timeLabel||ct(a.elapsedMinutes)} (${M.toUpperCase()})`)),x.append(L,t("p","ls-muted",'Upload backdrops for Morning, Day, Evening, Night, or a custom weather/scene state (e.g. "rainy", "steamy", "lights off"). The VN Stage automatically transitions to the matching backdrop as time passes!'));let T=t("div","ls-grid"),A=[{slot:"default",icon:"\uD83C\uDFDE️",label:"Default (Any Time)",sub:"Fallback when no specific time slot is set"},{slot:"morning",icon:"\uD83C\uDF05",label:"Morning / Dawn",sub:"05:00 AM – 10:59 AM"},{slot:"day",icon:"☀️",label:"Day / Afternoon",sub:"11:00 AM – 04:59 PM"},{slot:"evening",icon:"\uD83C\uDF07",label:"Evening / Sunset",sub:"05:00 PM – 07:59 PM"},{slot:"night",icon:"\uD83C\uDF19",label:"Night / Late Night",sub:"08:00 PM – 04:59 AM"}];for(let S of A){let y=(d.backdropVariants??[]).find((c)=>c.timeSlot===S.slot),m=S.slot==="default"?d.backdropUrl:void 0,p=y?.url||m||"",l=t("div","ls-asset-card");if(M===S.slot||y?.pinned)l.style.borderColor="var(--ls-primary)";if(p){let c=t("div","ls-asset-thumb"),k=t("img");k.src=p,k.alt=`${d.name} ${S.label}`,c.append(k),l.append(c)}let b=t("div","ls-stack");b.style.gap="4px",b.append(t("strong","",`${S.icon} ${S.label}`),t("small","ls-muted",S.sub));let I=t("div","ls-row");if(I.append(R(p?"\uD83D\uDD04 Replace Image":"\uD83D\uDDBC️ Upload Image",()=>{e.uploadStageVariantAsset({targetId:d.id,kind:"backdrop_variant",timeSlot:S.slot})},`ls-btn-sm ${p?"":"ls-btn-primary"}`)),y)I.append(R(y.pinned?"\uD83D\uDCCC Pinned":"\uD83D\uDCCD Pin",()=>{let c=structuredClone(a.places),k=c[d.id]?.backdropVariants??[],E=!y.pinned;k.forEach((B)=>{B.pinned=B.id===y.id?E:!1}),e.request("state:mutate",{stateOverride:{places:c},reason:`${E?"Pinned":"Unpinned"} ${S.label} backdrop for ${d.name}`})},`ls-btn-sm ${y.pinned?"ls-btn-primary":""}`),R("\uD83D\uDDD1️",()=>{let c=structuredClone(a.places),k=c[d.id];if(k?.backdropVariants){if(k.backdropVariants=k.backdropVariants.filter((E)=>E.id!==y.id),S.slot==="default")k.backdropUrl=void 0;e.request("state:mutate",{stateOverride:{places:c},reason:`Removed ${S.label} backdrop from ${d.name}`})}},"ls-btn-sm ls-btn-icon ls-btn-danger"));b.append(I),l.append(b),T.append(l)}x.append(T);let w=t("div","ls-stat-cell");w.append(t("strong","","\uD83C\uDFF7️ Add Custom Time / Weather / State Backdrop Variant"));let f=t("div","ls-row"),C=t("input","ls-input");C.style.flex="1",C.placeholder="Enter custom condition tag (e.g. rainy, steamy, lights off, crowded)…",f.append(C,R("\uD83D\uDDBC️ Upload & Save Custom Variant",()=>{let S=C.value.trim();if(!S){e.notify('Enter a custom tag (e.g. "rainy" or "steamy") before uploading.',!0);return}e.uploadStageVariantAsset({targetId:d.id,kind:"backdrop_variant",timeSlot:"custom",customTag:S})},"ls-btn-primary")),w.append(f);let P=(d.backdropVariants??[]).filter((S)=>S.timeSlot==="custom");if(P.length>0){let S=t("div","ls-asset-gallery");S.style.marginTop="8px";for(let y of P){let m=t("div","ls-asset-card"),p=t("div","ls-asset-thumb"),l=t("img");l.src=y.url,l.alt=y.customTag,p.append(l);let b=t("div","ls-row-between");b.append(t("strong","",`\uD83C\uDFF7️ ${y.customTag}`),t("div","ls-row")),b.lastElementChild.append(R(y.pinned?"\uD83D\uDCCC Pinned":"\uD83D\uDCCD Pin",()=>{let I=structuredClone(a.places),c=I[d.id]?.backdropVariants??[],k=!y.pinned;c.forEach((E)=>{E.pinned=E.id===y.id?k:!1}),e.request("state:mutate",{stateOverride:{places:I},reason:`Pinned "${y.customTag}" backdrop for ${d.name}`})},`ls-btn-sm ${y.pinned?"ls-btn-primary":""}`),R("\uD83D\uDDD1️",()=>{let I=structuredClone(a.places),c=I[d.id];if(c?.backdropVariants)c.backdropVariants=c.backdropVariants.filter((k)=>k.id!==y.id),e.request("state:mutate",{stateOverride:{places:I},reason:`Removed "${y.customTag}" backdrop`})},"ls-btn-sm ls-btn-icon ls-btn-danger")),m.append(p,b),S.append(m)}w.append(S)}if(x.append(w),h.url)x.append(t("small","ls-muted",`✓ Currently active backdrop for ${d.name}: ${h.matchedLabel}`));return s.append(x),s}function Qe(e,n){let s=[...structuredClone(e.snapshot.template).surfaces.dossierTabs].sort((o,r)=>o.order-r.order);e.modals.open({title:n?`✏️ Edit Character Dossier Field: ${n.label}`:"➕ Create Character Dossier Field",width:580},(o,r,u,i)=>{let d=t("div","ls-grid"),g=t("label","ls-label","Field Icon"),v=t("input","ls-input");v.value=n?.icon??"✨",g.append(v);let M=t("label","ls-label","Field Label"),h=t("input","ls-input");h.placeholder="e.g. Immediate Goal, Inner Monologue, Secret Agenda…",h.value=n?.label??"",M.append(h),d.append(g,M),o.append(d);let x=n?.tabId??(s[0]?.id||"overview"),L=n?.displayStyle??"card",T=t("div","ls-grid"),A=t("div","ls-label","\uD83E\uDEAA Target Dossier Tab"),w=t("div");A.append(w);let f=t("div","ls-label","\uD83C\uDFA8 Visual Display Style"),C=t("div");f.append(C),T.append(A,f),o.append(T),J(e,i,w,{value:x,ariaLabel:"Target Dossier Tab",options:s.map((O)=>({value:O.id,label:`${O.icon} ${O.label}`})),onChange:(O)=>{x=O}}),J(e,i,C,{value:L,ariaLabel:"Visual Display Style",options:[{value:"card",label:'\uD83D\uDDC2️ Info Card (supports structured "->" chains)'},{value:"quote",label:"\uD83D\uDCAD Quote / Inner Monologue Box"},{value:"pills",label:"\uD83C\uDFF7️ Tag / Item Pills (comma-separated)"},{value:"badge",label:"\uD83E\uDEAA Portrait Header Badge"}],onChange:(O)=>{L=O}});let P=n?.layoutSpan??"auto",S=n?.color||"var(--lumiverse-primary)",y=n?.enabled??!0,m=n?.showInHudCast??!1,p=n?.showInInlineCast??!1,l=n?.locked??!1,b=t("div","ls-label","Card Grid Width"),I=t("div");b.append(I),o.append(b),J(e,i,I,{value:P,ariaLabel:"Card Grid Width",options:[{value:"auto",label:"\uD83D\uDCD0 Auto"},{value:"full",label:"↔️ Full Width"},{value:"half",label:"▫ Compact Column"}],onChange:(O)=>{P=O}});let c=t("div","ls-label","Accent Color"),k=t("div","ls-row"),E=()=>{for(let O of[...k.querySelectorAll(".ls-color-swatch")])O.setAttribute("aria-pressed",String(O.dataset.colorVal===S))};for(let[O,W,q]of[["var(--lumiverse-primary)","Theme Primary","var(--lumiverse-primary, #38bdf8)"],["#38bdf8","Sky","#38bdf8"],["#f472b6","Rose","#f472b6"],["#f59e0b","Amber","#f59e0b"],["#10b981","Emerald","#10b981"],["#a78bfa","Violet","#a78bfa"]]){let z=R("",()=>{S=O,E()},"ls-color-swatch",W);z.dataset.colorVal=O,z.style.background=q,k.append(z)}E(),c.append(k),o.append(c);let B=t("div","ls-label"),N=t("div","ls-row-between"),_=t("textarea","ls-input");_.rows=3,_.placeholder="Tell the AI when and how to update this field for each character…",_.value=n?.instruction??"",N.append(t("span","","AI Extraction Prompt Instruction"),R("⛶ Full-Screen Editor",()=>{e.request("textEditor:open",{title:`Character Field Prompt: ${h.value||"Field"}`,value:_.value,placeholder:"Describe how the AI should update this character field…"}).then((O)=>{if(!O.cancelled&&typeof O.text==="string")_.value=O.text})},"ls-btn-sm")),B.append(N,_),o.append(B);let D=t("div","ls-grid");for(let[O,W,q]of[["Enabled",y,(z)=>{y=z}],["Show on HUD Cast Card",m,(z)=>{m=z}],["Show on Inline Cast Card",p,(z)=>{p=z}],["Lock Value",l,(z)=>{l=z}]]){let z=t("div");xe(e,i,z,{checked:W,label:O,onChange:q}),D.append(z)}o.append(D);let H=t("div","ls-row-between");H.style.marginTop="12px";let F=t("div","ls-row");if(n)F.append(R("Delete Field",()=>{let O=structuredClone(e.snapshot.template.dossierFields);e.request("state:mutate",{templatePatch:{dossierFields:O.filter((W)=>W.id!==n.id)},reason:`Deleted dossier field "${n.label}"`}),r()},"ls-btn-sm ls-btn-danger"));let V=R(n?"Save Field":"Add Field",()=>{let O=h.value.trim();if(!O)return;let W=structuredClone(e.snapshot.template.dossierFields),q={id:n?.id??ie(O,"field"),label:O,icon:v.value.trim()||"✨",placeholder:n?.placeholder||O,instruction:_.value.trim()||`Update ${O} when established in the scene.`,tabId:x,displayStyle:L,showInHudCast:m,showInInlineCast:p,color:S,layoutSpan:P,enabled:y,locked:l},z=W.findIndex((j)=>j.id===q.id);if(z>=0)W[z]=q;else W.push(q);e.request("state:mutate",{templatePatch:{dossierFields:W},reason:`Saved dossier field "${q.label}"`}),r()},"ls-btn-primary");H.append(F,V),o.append(H)})}function Ja(e,n){let{state:a}=e.snapshot,s=[...a.auditLog].filter((o)=>!n||o.actorId===n).reverse();e.modals.open({title:`\uD83D\uDCC8 Stat Calibration & Shift Audit Log (${s.length})`,width:640,maxHeight:740},(o,r)=>{if(!s.length){o.append(t("p","ls-muted","No stat calibrations or shifts recorded yet."));return}let u=t("div","ls-stack");for(let i of s){let d=t("div","ls-stat-cell"),g=t("div","ls-row-between"),v=t("div","ls-row"),M=i.actorId?a.characters[i.actorId]?.name:void 0;v.append(t("strong","",`${M?`${M} · `:""}${i.statLabel}`),t("span","ls-chip",i.op==="set"?"\uD83C\uDFAF Calibrated / Set":"Δ Shift"),t("span","ls-chip ls-chip-accent",`${String(i.before??"uncalibrated")} → ${String(i.after)}`));let h=t("div","ls-row");if(h.append(t("small","ls-muted",`Turn ${i.turn} · ${Fa(i.minute)}`)),i.before!==null)h.append(R(`↺ Revert to ${String(i.before)}`,()=>{if(i.actorId){let x=a.characters[i.actorId];if(x)e.request("state:mutate",{patch:{characters:[{id:x.id,name:x.name,meters:{[i.statId]:{op:"set",value:i.before,reason:"Reverted from audit log"}}}]},reason:`Reverted ${x.name} ${i.statLabel} to ${String(i.before)}`})}else e.request("state:mutate",{patch:{stats:{[i.statId]:{op:"set",value:i.before,reason:"Reverted from audit log"}}},reason:`Reverted ${i.statLabel} to ${String(i.before)}`});r()},"ls-btn-sm"));if(g.append(v,h),d.append(g),i.reason)d.append(t("small","ls-muted",`Evidence: ${i.reason}`));u.append(d)}o.append(u)})}function Ye(e,n){e.selectedActorId=n,e.modals.open({title:"\uD83E\uDEAA Character Dossier",width:880,maxHeight:820},(a,s,o,r)=>{let u=()=>{r.clear();let d=e.snapshot.state.characters[e.selectedActorId]??Object.values(e.snapshot.state.characters)[0];if(d)o.setTitle(`\uD83E\uDEAA ${d.name} — Character Dossier`);a.replaceChildren(On(e,r))};u();let i=e.subscribe(u);o.onDismiss(i)})}function On(e,n){let{state:a,template:s,deltas:o}=e.snapshot,r=t("div","ls-stack"),u=Object.values(a.characters).sort((m,p)=>Number(p.present)-Number(m.present)),i=(e.selectedActorId?a.characters[e.selectedActorId]:void 0)??u[0],d=t("div","ls-row-between"),g=t("div","ls-row");for(let m of u){let p=R(`${m.present?"\uD83D\uDFE2":"⚪"} ${m.name}`,()=>{e.selectedActorId=m.id,e.emitChange()},"ls-btn-sm");if(m.id===i?.id)p.setAttribute("aria-current","page");g.append(p)}let v=t("div","ls-row");if(i)v.append(R(e.dossierEditMode?"✓ Done Editing":"✏️ Edit Values",()=>{e.dossierEditMode=!e.dossierEditMode,e.emitChange()},`ls-btn-sm ${e.dossierEditMode?"ls-btn-primary":""}`),R(i.ttsVoice?.voiceId?`\uD83D\uDD0A Voice (${i.ttsVoice.voiceId})`:"\uD83D\uDD0A Voice",()=>Yt(e,i.id),"ls-btn-sm",`Assign TTS Voice for ${i.name}`),R("+ Stat",()=>Ce(e,"character"),"ls-btn-sm","Add a character stat or meter"),R("+ Field",()=>Qe(e),"ls-btn-sm","Add a custom field to character dossiers"),R("\uD83D\uDCC8 Audit Log",()=>Ja(e,i.id),"ls-btn-sm"));if(v.append(R("+ Add Character",()=>{e.modals.open({title:"➕ Add Character to Cast",width:460},(m,p)=>{let l=t("label","ls-label","Character Name"),b=t("input","ls-input");l.append(b);let I=t("label","ls-label","Role & Relationship to Player"),c=t("input","ls-input");c.placeholder="e.g. Loyal personal maid, Childhood rival…",I.append(c);let k=t("label","ls-label","Starting Attire"),E=t("input","ls-input");k.append(E);let B=R("➕ Create Character",()=>{let N=b.value.trim();if(!N)return;let _=ie(N,"npc");e.selectedActorId=_,e.request("state:mutate",{patch:{characters:[{id:_,name:N,present:!0,roleSummary:c.value.trim()||"Character",attire:E.value.trim()}]},reason:`Added character "${N}"`}),p()},"ls-btn-primary");m.append(l,I,k,B)})},"ls-btn-sm ls-btn-primary")),d.append(g,v),r.append(d),!i){let m=t("div","ls-card");return m.append(t("strong","","No characters in cast yet"),t("p","ls-muted",'Characters are calibrated automatically on Turn 1, or click "+ Add Character" above.')),r.append(m),r}if(s.surfaces.customDossierHtml){let m=t("div","ls-card");r.append(m),Be(m,De(s.surfaces.customDossierHtml,a),e.ctx)}let M=he(i,"demeanor"),h=he(i,"role_summary"),x=(M||"neutral").toLowerCase(),L=i.expressionAssets[x]?.url??i.portraitUrl,T=Boolean(L||e.dossierEditMode),A=t("article","ls-dossier-shell");if(!T)A.dataset.noPortrait="true";let w=t("div","ls-row");w.append(R(i.present?"\uD83D\uDFE2 In Scene":"⚪ Away",()=>{e.request("state:mutate",{patch:{characters:[{id:i.id,name:i.name,present:!i.present,...!i.present&&a.scene.location?{location:a.scene.location}:{}}]},reason:`Marked ${i.name} as ${!i.present?"In Scene":"Away"}`})},`ls-btn-sm ls-presence-pill ${i.present?"ls-chip-accent":""}`,"Click to toggle In Scene / Away"));for(let m of s.dossierFields.filter((p)=>p.enabled&&p.displayStyle==="badge"&&p.id!=="role_summary")){let p=he(i,m.id);if(p)w.append(t("span","ls-chip",`${m.icon} ${p}`))}if(T){let m=t("aside","ls-dossier-rail"),p=t("div","ls-dossier-portrait");if(L){let b=t("img");b.src=L,b.alt=i.name,p.append(b)}else p.append(t("span","ls-dossier-initial",i.name[0]?.toUpperCase()??"?"));m.append(p);let l=t("div","ls-dossier-overlay");if(l.append(w,t("h2","",i.name)),Lt(s,"role_summary")&&h)l.append(t("div","ls-muted",h));if(e.dossierEditMode){let b=t("div","ls-row");b.append(R("\uD83D\uDDBC️ Portrait",()=>e.pickAndUploadImage(i.id,"portrait"),"ls-btn-sm ls-btn-primary"),R(`\uD83C\uDFAD Expression (${x})`,()=>e.pickAndUploadImage(i.id,"expression",x),"ls-btn-sm",`Upload expression sprite for "${x}" demeanor`),R(i.present?"Mark Off-Screen":"Mark Present",()=>{e.request("state:mutate",{patch:{characters:[{id:i.id,name:i.name,present:!i.present}]},reason:`Toggled presence for ${i.name}`})},"ls-btn-sm")),l.append(b)}m.append(l),A.append(m)}let f=t("div","ls-dossier-main");if(!T){let m=t("header","ls-dossier-compact-hero"),p=t("div","ls-row"),l=t("div","ls-dossier-monogram",i.name.slice(0,2).toUpperCase()),b=t("div");if(b.append(t("h2","",i.name)),Lt(s,"role_summary")&&h)b.append(t("div","ls-muted",h));p.append(l,b);let I=t("div","ls-row");I.append(w,R("\uD83D\uDDBC️ + Portrait",()=>e.pickAndUploadImage(i.id,"portrait"),"ls-btn-sm",`Upload portrait for ${i.name}`)),m.append(p,I),f.append(m)}let C=[...s.surfaces.dossierTabs].filter((m)=>m.enabled).sort((m,p)=>m.order-p.order),P=C.find((m)=>m.id===e.activeDossierTab)??C[0]??{id:"overview",label:"Overview",icon:"✨",kind:"overview",enabled:!0,order:0,showMeters:!0,showFields:!0,showSecrets:!1,showAudit:!1};if(C.length>1){let m=t("div","ls-subnav-pills");for(let p of C){let l=R(`${p.icon} ${p.label}`,()=>{e.activeDossierTab=p.id,e.emitChange()},"ls-btn-sm");if(p.id===P.id)l.setAttribute("aria-current","page");m.append(l)}f.append(m)}if(P.customHtml){let m=t("div","ls-card");f.append(m),Be(m,De(P.customHtml,a),e.ctx)}let S=new Set(C.map((m)=>m.id)),y=C[0]?.id??"overview";if(P.showFields){let m=s.dossierFields.filter((p)=>{if(!p.enabled||p.id==="role_summary"||p.displayStyle==="badge")return!1;return(p.tabId&&S.has(p.tabId)?p.tabId:y)===P.id});if(!e.dossierEditMode){for(let b of m.filter((I)=>I.displayStyle==="quote")){let I=he(i,b.id);if(!I)continue;let c=t("div","ls-thought-box ls-row-between");c.append(t("span","",`${b.icon} “${I}”`),R("✏️",()=>Qe(e,b),"ls-btn-sm ls-btn-icon",`Customize "${b.label}" field`)),f.append(c)}if(P.kind==="overview"&&s.coreTrackers?.trackNpcConditions!==!1&&i.conditions.length>0){let b=t("div","ls-row");for(let I of i.conditions){let c=t("span","ls-rpg-fx-pill",`⚡ ${I}`);c.dataset.fxKind="neutral",b.append(c)}f.append(b)}let p=m.filter((b)=>b.displayStyle!=="quote"),l=t("div","ls-grid");for(let b of p){let I=he(i,b.id);if(!I)continue;let c=t("div","ls-stat-cell");if(b.color)c.style.setProperty("--ls-bar-color",b.color);if(b.layoutSpan&&b.layoutSpan!=="auto")c.dataset.span=b.layoutSpan;let k=t("div","ls-row-between");k.append(t("span","ls-kicker",`${b.icon} ${b.label}`),R("✏️",()=>Qe(e,b),"ls-btn-sm ls-btn-icon",`Customize "${b.label}" field`)),c.append(k,Xe(I,b.displayStyle==="pills"?"pill_list":"auto")),l.append(c)}if(l.childElementCount>0)f.append(l)}else{let p=t("div","ls-card"),l=t("div","ls-row-between");l.append(t("h3","",`✏️ Edit ${i.name}'s Dossier Fields`),R("↺ Restore Default Fields",()=>{e.request("state:mutate",{templatePatch:{dossierFields:ot()},reason:"Restored default dossier fields"})},"ls-btn-sm")),p.append(l);let b=t("div","ls-grid"),I=new Map;for(let N of s.dossierFields.filter((_)=>_.enabled)){let _=t("div","ls-label"),D=t("div","ls-row-between");D.append(t("span","",`${N.icon} ${N.label}`),R("⚙️ Schema",()=>Qe(e,N),"ls-btn-sm",`Edit "${N.label}" schema or delete`));let H=N.displayStyle==="quote"?t("textarea","ls-input"):t("input","ls-input");if(H instanceof HTMLTextAreaElement)H.rows=2;H.value=he(i,N.id),H.placeholder=N.placeholder||N.label,_.append(D,H),b.append(_),I.set(N.id,H)}let c=t("label","ls-label","⚡ Active Conditions (comma-separated)"),k=t("input","ls-input");k.value=i.conditions.join(", "),k.placeholder="e.g. Flustered, Holding Tray, Guarded…",c.append(k);let E=t("label","ls-label","\uD83D\uDCDD Personal Character Notes"),B=t("textarea","ls-input");B.rows=2,B.value=i.notes||"",B.placeholder="Optional notes about this character…",E.append(B),p.append(b,c,E),p.append(R("\uD83D\uDCBE Save Character Details",()=>{let N={...i.fields};for(let[D,H]of I.entries())N[D]=H.value.trim();let _=k.value.split(",").map((D)=>D.trim()).filter(Boolean);e.request("state:mutate",{patch:{characters:[{id:i.id,name:i.name,roleSummary:N.role_summary??i.roleSummary,demeanor:N.demeanor??i.demeanor,attire:N.attire_layers??i.attire,immediateGoal:N.immediate_goal??i.immediateGoal,innerThought:N.inner_thought??i.innerThought,conditions:_,notes:B.value.trim(),fields:N}]},reason:`Updated dossier details for ${i.name}`})},"ls-btn-primary")),f.append(p)}}if(P.showMeters){let m=s.stats.filter((l)=>{if(!l.enabled||l.scope!=="character"||l.showIn?.dossier===!1)return!1;let b=l.dossierTabId||"bonds";return(S.has(b)?b:y)===P.id});if(m.length>0){let l=t("div","ls-stat-grid"),b=o.characterDeltas[i.id]??{},I=(c,k,E)=>{e.request("state:mutate",{patch:{characters:[{id:i.id,name:i.name,meters:{[c]:{op:"set",value:E,reason:"Manual Dossier adjustment"}}}]},reason:`Set ${i.name} ${k} to ${String(E)}`})};for(let c of m){let k=i.meters[c.id],E=Boolean(k?.calibrated),B=E&&k?k.value:c.defaultValue,N=Boolean(c.locked||k?.locked),_=b[c.id]??0,D=String(B??""),H=E&&typeof B==="string"&&(c.displayStyle==="feed_cards"||c.displayStyle==="step_chain"||c.displayStyle==="pill_list"||c.displayStyle==="quote_callout"||D.length>36||/->|→|\n|;/.test(D)),F=t("div","ls-stat-cell");if(F.style.setProperty("--ls-bar-color",c.color||"var(--ls-primary)"),F.dataset.locked=String(N),F.dataset.uncalibrated=String(!E),F.dataset.span=c.layoutSpan==="full"||c.layoutSpan!=="half"&&H?"full":"half",k?.lastReason)F.title=`Evidence: ${k.lastReason}`;let V=t("div","ls-row-between");V.append(t("strong","",`${c.icon} ${c.label}`));let O=t("div","ls-row");if(_!==0)O.append(t("span",`ls-delta ${_>0?"is-pos":"is-neg"}`,`${_>0?`+${_} ▲`:`${_} ▼`}`));let W=!E?"Uncalibrated":c.kind==="clock"||c.kind==="pips"?`${Number(B)||0}/${c.max}`:H?`${Et(D).length} entries`:D,q=t("strong","",W);if(O.append(q,R("✏️",()=>Ce(e,"character",c),"ls-btn-sm ls-btn-icon","Edit stat schema")),V.append(O),F.append(V),E&&typeof B==="number"){let z=Ue(c.anchors,B);if(z)F.append(t("small","ls-muted",z))}else if(!E)F.append(t("small","ls-muted",`Volatility: ${c.volatility} · Calibrates on sync`));if(k?.lastReason&&!H&&k.lastReason!==a.scene.beatSummary&&!/^(?:Scene progression|Manual Dossier adjustment|Manual UI adjustment)$/i.test(k.lastReason))F.append(t("small","ls-muted",`↳ ${k.lastReason}`));if(c.kind==="skill_tree")F.append(pt(c,B,N,(z,j)=>I(c.id,c.label,z)));else if(c.kind==="xp_level")F.append(ut(c,B));else if(c.kind==="attributes")F.append(mt(c,B,`${i.id}:${e.chatId}`));else if(c.kind==="inventory")F.append(ft(B));else if(c.kind==="status_fx")F.append(ht(B));else if(c.kind==="hearts")F.append(gt(c,Number(B)||0,E,N,(z)=>I(c.id,c.label,z)));else if(c.kind==="currency")F.append(bt(c,B,_));else if(E&&H)F.append(Xe(D,c.displayStyle??"auto"));else if(c.kind==="meter"||c.kind==="number"){let z=typeof B==="number"?B:0,j=Math.max(1,c.max-c.min),K=t("div","ls-bar-track"),Y=t("div","ls-bar-fill");if(c.min<0&&c.max>0){K.dataset.bipolar="true";let G=(0-c.min)/j*100;if(z>=0)Y.style.marginLeft=`${G.toFixed(1)}%`,Y.style.width=`${Math.min(100-G,z/c.max*(100-G)).toFixed(1)}%`;else{let ee=Math.abs(z)/Math.abs(c.min)*G;Y.style.marginLeft=`${Math.max(0,G-ee).toFixed(1)}%`,Y.style.width=`${Math.min(G,ee).toFixed(1)}%`,Y.style.background="var(--ls-danger)"}}else{let G=E?Math.max(0,Math.min(100,Math.round((z-c.min)/j*100))):0;Y.style.width=`${G}%`}if(K.append(Y),F.append(K),e.dossierEditMode&&n&&e.ctx.components?.mountRangeSlider){let G=t("div");F.append(G);try{n.track(e.ctx.components.mountRangeSlider(G,{min:c.min,max:c.max,step:c.step||1,integer:!0,value:z,disabled:N,onDragValue:(ee)=>{if(ee!==null)q.textContent=String(ee)},onCommit:(ee)=>I(c.id,c.label,ee)}))}catch{}}}else if(c.kind==="clock"){let z=Math.max(2,Math.min(16,c.max||6)),j=E?Math.max(0,Math.min(z,Math.round(Number(B)||0))):0,K=t("div","ls-clock-bar");K.style.gridTemplateColumns=`repeat(${z}, 1fr)`;for(let Y=1;Y<=z;Y++){let G=t("span",`ls-clock-seg${Y<=j?" is-filled":""}`);G.addEventListener("click",()=>I(c.id,c.label,Y===j?Y-1:Y)),K.append(G)}F.append(K)}Ut(e.ctx,F,()=>[{key:"edit",label:`✏️ Edit "${c.label}" Schema & Style`},{key:"duplicate",label:`\uD83D\uDCCB Duplicate "${c.label}" to Another Scope / Tab…`},{key:"test",label:`\uD83E\uDDEA Test "${c.label}" in Sandbox`},{key:"audit",label:"\uD83D\uDCC8 View Shift History"},{key:"div",label:"",type:"divider"},{key:"delete",label:`\uD83D\uDDD1️ Delete "${c.label}"`,danger:!0}],(z)=>{if(z==="edit")Ce(e,"character",c);else if(z==="duplicate")We(e,c);else if(z==="test")Ze(e,c.id);else if(z==="audit")Ja(e,i.id);else if(z==="delete"){let j=structuredClone(e.snapshot.template);e.request("state:mutate",{templatePatch:{stats:j.stats.filter((K)=>K.id!==c.id)},reason:`Deleted stat "${c.label}"`})}}),l.append(F)}f.append(l)}let p=s.stats.filter((l)=>l.enabled&&l.scope==="player"&&l.showIn?.dossier===!0&&l.dossierTabId===P.id&&P.id!=="bonds");if(p.length>0)f.append(Bn(e,p,"player",n,e.dossierEditMode,!1))}if(P.showNpcBonds||P.kind==="peer_bonds"){let m=t("div","ls-stack"),p=t("div","ls-row-between"),l=Object.values(i.peerBonds??{});if(p.append(t("h3","",`\uD83E\uDD1D ${i.name}'s Standing & Stats Toward Other NPCs (${l.length})`),R("+ Add NPC↔NPC Bond",()=>qe(e,i),"ls-btn-sm ls-btn-primary")),m.append(p),!l.length)m.append(t("p","ls-muted",`No NPC-to-NPC relationships recorded for ${i.name} yet. They populate automatically when multiple NPCs interact, or click "+ Add NPC↔NPC Bond" above.`));else{let b=t("div","ls-stat-grid");for(let I of l){let c=t("div","ls-stat-cell"),k=t("div","ls-row-between");if(k.append(t("strong","",`→ \uD83D\uDC64 ${I.toName}`),t("div","ls-row")),k.lastElementChild.append(t("span","ls-chip ls-chip-accent",I.label),R("✏️",()=>qe(e,i,I),"ls-btn-sm ls-btn-icon","Edit NPC bond"),R("\uD83D\uDDD1️",()=>{let E=structuredClone(i);delete E.peerBonds[I.toId],e.request("state:mutate",{stateOverride:{characters:{...a.characters,[i.id]:E}},reason:`Removed peer bond ${i.name} → ${I.toName}`})},"ls-btn-sm ls-btn-icon ls-btn-danger","Delete NPC bond")),c.append(k),I.attitude)c.append(t("div","ls-thought-box",`“${I.attitude}”`));for(let[E,B]of Object.entries(I.meters)){let N=E.charAt(0).toUpperCase()+E.slice(1),_=t("div","ls-row-between");_.append(t("small","ls-muted",N),t("strong","",`${B}/100`));let D=t("div","ls-bar-track"),H=t("div","ls-bar-fill");H.style.width=`${Math.max(0,Math.min(100,B))}%`,D.append(H),c.append(_,D)}b.append(c)}m.append(b)}f.append(m)}if(P.showSecrets){let m=t("div","ls-stack");if(m.append(t("h3","","\uD83D\uDD75️ Secrets, Clues & Notes")),!i.secrets.length)m.append(t("p","ls-muted","No secrets or discoveries recorded for this character yet."));else for(let p of i.secrets){let l=t("div","ls-stat-cell");l.append(t("strong","",`${p.stage==="confirmed"?"\uD83D\uDD13":"\uD83D\uDD0D"} ${p.title} (${p.stage})`),t("p","ls-muted",p.detail)),m.append(l)}f.append(m)}if(P.showAudit){let m=a.auditLog.filter((p)=>p.actorId===i.id&&typeof p.after==="number"&&(p.before!==null||p.numericDelta!==0)).slice(-8).reverse();if(m.length>0){let p=t("div","ls-stack");p.append(t("span","ls-kicker","\uD83D\uDCC8 Recent Meter Shifts"));let l=t("div","ls-row");for(let b of m){let I=b.numericDelta>0?`+${b.numericDelta}`:String(b.numericDelta),c=t("span",`ls-delta ${b.numericDelta>=0?"is-pos":"is-neg"}`,`${b.statLabel}: ${String(b.before??"—")} → ${String(b.after)}${b.numericDelta!==0?` (${I})`:""}`);if(b.reason&&b.reason!==a.scene.beatSummary)c.title=b.reason;l.append(c)}p.append(l),f.append(p)}}return A.append(f),r.append(A),r}function nn(e,n,a,s){let{state:o,template:r,deltas:u}=e.snapshot,i=t("div","ls-stack"),d=Object.values(o.characters);if(!d.length)return i.append(t("p","ls-muted","Characters appear here as the story introduces them.")),i;let g=n==="widget"?r.surfaces.widgetTabs:r.surfaces.inlineTabs,v=new Set(g.filter((m)=>m.enabled).map((m)=>m.id)),M=r.stats.filter((m)=>{if(!m.enabled||m.scope!=="character")return!1;if(n==="widget"&&m.showIn?.widget===!1)return!1;if(n==="inline"&&m.showIn?.inline===!1)return!1;let p=n==="widget"?m.widgetTabId||"cast":m.inlineTabId||"cast",l=n==="widget"?m.extraWidgetTabIds:m.extraInlineTabIds;return p===a||!v.has(p)||Boolean(l?.includes(a))}),h=r.dossierFields.filter((m)=>n==="widget"?m.enabled&&m.showInHudCast:m.enabled&&m.showInInlineCast),x=new Set(["skill_tree","xp_level","attributes","inventory","status_fx","hearts","currency"]),L=M.filter((m)=>!x.has(m.kind)&&!$t(m)&&m.kind!=="boolean"),T=M.filter((m)=>x.has(m.kind)||$t(m)||m.kind==="boolean"),A=d.filter((m)=>m.present),w=d.filter((m)=>!m.present),f=r.theme.castLayout??"roster",C=t("div","ls-row-between");C.append(t("span","ls-kicker",`\uD83D\uDFE2 In Scene: ${A.length} · ⚪ Away: ${w.length}`),R(f==="roster"?"\uD83D\uDDC2️ All Cards":"\uD83D\uDC65 Icons",()=>{let m=f==="roster"?"cards":"roster";e.request("state:mutate",{templatePatch:{theme:{...r.theme,castLayout:m}},reason:`Switched cast display to ${m}`})},"ls-btn-sm","Toggle between compact character icons and expanded stacked cards")),i.append(C);let P=(m)=>{let p=t("div","ls-card"),l=t("div","ls-row-between"),b=t("div","ls-row"),I=t("div","ls-cast-avatar");if(m.portraitUrl){let _=t("img");_.src=m.portraitUrl,_.alt=m.name,I.append(_)}else I.textContent=m.name.slice(0,2).toUpperCase();let c=t("div");c.append(t("strong","",`${m.present?"\uD83D\uDFE2":"⚪"} ${m.name}`));let k=he(m,"role_summary");if(k){let _=t("div","ls-muted",k);_.style.fontSize="11px",c.append(_)}b.append(I,c);let E=t("div","ls-row"),B=h.find((_)=>_.id==="demeanor"),N=B?he(m,"demeanor"):"";if(N)E.append(t("span","ls-chip",`${B.icon} ${N}`));if(E.append(R(m.present?"\uD83D\uDFE2 In Scene":"⚪ Away",()=>{e.request("state:mutate",{patch:{characters:[{id:m.id,name:m.name,present:!m.present,...!m.present&&o.scene.location?{location:o.scene.location}:{}}]},reason:`Marked ${m.name} as ${!m.present?"In Scene":"Away"}`})},`ls-btn-sm ls-presence-pill ${m.present?"ls-chip-accent":""}`,`Toggle whether ${m.name} is In Scene or Away`),Q("volume",()=>Yt(e,m.id),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:`Assign TTS voice for ${m.name}`}),R("Dossier",()=>s(m.id),"ls-btn-sm ls-btn-primary")),l.append(b,E),p.append(l),r.coreTrackers?.trackNpcConditions!==!1&&m.conditions.length>0){let _=t("div","ls-row");for(let D of m.conditions.slice(0,4)){let H=t("span","ls-rpg-fx-pill",`⚡ ${D}`);H.dataset.fxKind="neutral",_.append(H)}p.append(_)}for(let _ of h.filter((D)=>D.id!=="demeanor"&&D.id!=="role_summary")){let D=he(m,_.id);if(!D)continue;if(_.displayStyle==="quote")p.append(t("div","ls-thought-box",`${_.icon} “${D}”`));else p.append(t("small","ls-muted",`${_.icon} ${D}`))}if(L.length>0){let _=t("div","ls-cast-mini-grid");for(let D of L){let H=m.meters[D.id],F=u.characterDeltas[m.id]?.[D.id]??0,V=H?.calibrated&&typeof H.value==="number"?H.value:0,O=Math.max(1,D.max-D.min),W=H?.calibrated?Math.max(0,Math.min(100,Math.round((V-D.min)/O*100))):0,q=H?.calibrated&&typeof H.value==="number"?Ue(D.anchors,H.value):"",z=t("div","ls-cast-mini-meter");if(z.style.setProperty("--ls-bar-color",D.color||"var(--ls-primary)"),q)z.title=`${D.label}: ${V} (${q})`;let j=t("div","ls-row-between");j.append(t("small","ls-muted",`${D.icon} ${D.label}`));let K=t("div","ls-row");if(F!==0)K.append(t("span",`ls-delta ${F>0?"is-pos":"is-neg"}`,F>0?`+${F}`:String(F)));K.append(t("strong","",H?.calibrated?String(H.value):"—")),j.append(K);let Y=t("div","ls-bar-track"),G=t("div","ls-bar-fill");G.style.width=`${W}%`,Y.append(G),z.append(j,Y),_.append(z)}p.append(_)}for(let _ of T){let D=m.meters[_.id],H=Boolean(D?.calibrated),F=H?D.value:_.defaultValue,V=String(F??"").trim(),O=t("div","ls-stat-cell");if(O.style.setProperty("--ls-bar-color",_.color||"var(--ls-primary)"),O.dataset.uncalibrated=String(!H),O.append(t("small","ls-kicker",`${_.icon} ${_.label}`)),!H&&!x.has(_.kind)){O.append(t("small","ls-muted","Uncalibrated")),p.append(O);continue}if(H&&(!V||V==="None")&&!x.has(_.kind)){O.append(t("small","ls-muted","None")),p.append(O);continue}if(_.kind==="skill_tree")O.append(pt(_,F,Boolean(_.locked||D?.locked),(W,q)=>{e.request("state:mutate",{patch:{characters:[{id:m.id,name:m.name,meters:{[_.id]:{op:"set",value:W,reason:q}}}]},reason:q})}));else if(_.kind==="xp_level")O.append(ut(_,F));else if(_.kind==="attributes")O.append(mt(_,F,`${m.id}:${e.chatId}`));else if(_.kind==="inventory")O.append(ft(F));else if(_.kind==="status_fx")O.append(ht(F));else if(_.kind==="hearts")O.append(gt(_,Number(F)||0,Boolean(D?.calibrated),Boolean(_.locked||D?.locked)));else if(_.kind==="currency")O.append(bt(_,F,u.characterDeltas[m.id]?.[_.id]??0));else O.append(Xe(V,_.displayStyle??"auto"));p.append(O)}return p};if(f==="cards"){for(let m of[...A,...w])i.append(P(m));return i}e.openedCastTabs=e.openedCastTabs.filter((m)=>Boolean(o.characters[m]));let S=e.activeCastTabActorId&&o.characters[e.activeCastTabActorId]?o.characters[e.activeCastTabActorId]:void 0;if(e.openedCastTabs.length>0||S){let m=t("div","ls-cast-tabs-bar"),p=R("← Cast",()=>{e.activeCastTabActorId="",e.emitChange()},"ls-btn-sm","Return to Cast Icons");if(!S)p.setAttribute("aria-current","page");m.append(p);for(let l of e.openedCastTabs){let b=o.characters[l];if(!b)continue;let I=S?.id===b.id,c=t("div","ls-cast-tab-group"),k=R(`${b.present?"\uD83D\uDFE2":"⚪"} ${b.name}`,()=>{e.activeCastTabActorId=b.id,e.selectedActorId=b.id,e.emitChange()},"ls-btn-sm ls-cast-tab-btn",`Inspect ${b.name}`);if(I)k.setAttribute("aria-current","page");let E=R("×",()=>{if(e.openedCastTabs=e.openedCastTabs.filter((B)=>B!==b.id),e.activeCastTabActorId===b.id)e.activeCastTabActorId=e.openedCastTabs.at(-1)??"";e.emitChange()},"ls-btn-sm ls-cast-tab-close",`Close ${b.name} tab`);c.append(k,E),m.append(c)}if(S)return i.replaceChildren(C,m,P(S)),i;i.append(m)}let y=(m,p)=>{if(!p.length)return;let l=t("div","ls-roster-group");l.append(t("small","ls-muted",`${m} (${p.length})`));let b=t("div","ls-roster-grid");for(let I of p){let c=he(I,"demeanor"),k=he(I,"role_summary"),E=t("button","ls-roster-icon-btn");E.type="button",E.title=`${I.name}${k?` — ${k}`:""}${c?` (${c})`:""}`;let B=t("div","ls-roster-avatar");if(I.portraitUrl){let H=t("img");H.src=I.portraitUrl,H.alt=I.name,B.append(H)}else B.append(document.createTextNode(I.name.slice(0,2).toUpperCase()));B.append(t("span",`ls-roster-dot ${I.present?"is-present":"is-away"}`));let N=t("span","ls-roster-name",I.name),_=c||k||"",D=_?t("span","ls-roster-role",_):null;E.append(B,N,...D?[D]:[]),E.addEventListener("click",(H)=>{if(H.stopPropagation(),!e.openedCastTabs.includes(I.id))e.openedCastTabs=[...e.openedCastTabs,I.id];e.activeCastTabActorId=I.id,e.selectedActorId=I.id,e.emitChange()}),b.append(E)}l.append(b),i.append(l)};return y("\uD83D\uDFE2 In Scene",A),y("⚪ Away",w),i}function qs(e){let{state:n,template:a,deltas:s}=e.snapshot,o=a.theme.showSceneChips,r=Ne(n),u=t("div","ls-row");if(o.time)u.append(t("span","ls-chip",`\uD83D\uDD70️ ${r.time}`));if(o.date)u.append(t("span","ls-chip",`\uD83D\uDCC5 ${r.date}`));if(o.location)u.append(t("span","ls-chip ls-chip-accent",`\uD83D\uDCCD ${r.location}`));if(o.weather)u.append(t("span","ls-chip",`\uD83C\uDF26️ ${r.weather}`));if(a.coreTrackers?.trackPlayerAttire!==!1&&n.player.attire)u.append(t("span","ls-chip",`\uD83D\uDC55 You: ${n.player.attire.slice(0,28)}`));if(o.cast){let i=Lt(a,"demeanor");for(let d of Object.values(n.characters).filter((g)=>g.present).slice(0,4)){let g=s.characterDeltas[d.id]??{},v=Object.values(g).find((x)=>x!==0),M=i?he(d,"demeanor"):"",h=t("span","ls-chip",`\uD83D\uDC64 ${d.name}${M?` · ${M}`:""}`);if(v)h.append(t("span",`ls-delta ${v>0?"is-pos":"is-neg"}`,v>0?`+${v}`:String(v)));u.append(h)}}if(o.pinnedStats)for(let i of a.stats.filter((d)=>d.enabled&&(d.pinnedToHeader||d.showIn?.pinnedHeader)))if(i.scope==="character"){let d=Object.values(n.characters).find((h)=>h.present),g=d?.meters[i.id];if(!g?.calibrated)continue;let v=(d?s.characterDeltas[d.id]?.[i.id]:0)??0,M=t("span","ls-chip ls-chip-accent",`${i.icon} ${d.name} ${i.label}: ${String(g.value)}`);if(v!==0)M.append(t("span",`ls-delta ${v>0?"is-pos":"is-neg"}`,v>0?`+${v}`:String(v)));u.append(M)}else{let d=n.stats[i.id];if(!d?.calibrated)continue;let g=s.statDeltas[i.id]??0,v=t("span","ls-chip ls-chip-accent",`${i.icon} ${i.label}: ${String(d.value)}`);if(g!==0)v.append(t("span",`ls-delta ${g>0?"is-pos":"is-neg"}`,g>0?`+${g}`:String(g)));u.append(v)}return u}function es(e,n,a){let{state:s,template:o}=e.snapshot,r=t("div","ls-inline-host");e.stampThemeOnElement(r);let u=t("div","ls-inline-card");if(!e.inlineExpanded){let x=t("div","ls-inline-pill-bar");x.addEventListener("click",()=>{e.inlineExpanded=!0,e.emitChange()});let L=Dn(e);if(L.childElementCount===0)L.append(t("span","ls-chip ls-chip-accent",`${o.icon||"✨"} ${s.title||o.name||"Lumi Stats"}`));return x.append(L,Q("chevronDown",()=>{e.inlineExpanded=!0,e.emitChange()},{label:"Expand",className:"ls-btn-sm ls-btn-primary",title:"Expand Inline Ribbon"})),u.append(x),r.append(u),r}if(o.surfaces.customInlineHtml){let x=t("div","ls-card");u.append(x),Be(x,De(o.surfaces.customInlineHtml,s),e.ctx)}let i=[...o.surfaces.inlineTabs].filter((x)=>x.enabled&&(x.kind!=="web"||o.surfaces.showRelationshipWeb!==!1)).sort((x,L)=>x.order-L.order),d=i.find((x)=>x.id===e.activeInlineTab)??i[0]??{id:"stats",label:"Stats",icon:"\uD83D\uDCCA",kind:"stats",enabled:!0,order:0},g=t("div","ls-row-between"),v=t("div","ls-row");if(i.length>1)for(let x of i){let L=R(`${x.icon} ${x.label}`,()=>{e.activeInlineTab=x.id,e.emitChange()},"ls-btn-sm");if(x.id===d.id)L.setAttribute("aria-current","page");v.append(L)}else v.append(qs(e));let M=async(x)=>{if(typeof e.ctx.ui?.showContextMenu!=="function"){lt(e,a);return}let{selectedKey:L}=await e.ctx.ui.showContextMenu({position:{x:x.clientX,y:x.clientY},items:[{key:"edit_scene",label:"Edit Scene Values"},{key:"pill_prompts",label:"Edit Scene Pill Prompts & Chips"},{key:"template",label:`Switch Template & Skin (${o.name})`}]});if(L==="edit_scene")_t(e);else if(L==="pill_prompts")Ae(e);else if(L==="template")lt(e,a)},h=t("div","ls-row");if(h.append(Q("stage",()=>e.toggleVnStage(),{className:"ls-btn-sm ls-btn-ghost",label:"Stage",title:"Launch 2D Visual Novel Stage"}),Q("more",(x)=>void M(x),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:"Scene Pill, Template & Skin Options"}),Q("settings",a,{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:"Open Settings Studio"}),Q("chevronUp",()=>{e.inlineExpanded=!1,e.emitChange()},{label:"Collapse",className:"ls-btn-sm ls-btn-primary",title:"Collapse Ribbon"})),g.append(v,h),u.append(g),d.kind==="cast")u.append(nn(e,"inline",d.id,n));else if(d.kind==="web")u.append(Zt(e,n));else if(d.kind==="map")u.append(en(e));else{if(d.customHtml){let x=t("div","ls-card");u.append(x),Be(x,De(d.customHtml,s),e.ctx)}u.append(tn(e,"inline",d.id))}return r.append(u),r}var ts='    She⠀stepped⠀forward⠀with⠀a⠀warm⠀smile.⠀"Welcome⠀back."',zn="",ns="She hid the knife before any blood could spill.",as=!1,Re=null;function ss(e,n){let a=e.settings,s=t("div","ls-stack"),o=t("section","ls-card");if(o.append(t("span","ls-kicker","Prose Typography & Unicode Hygiene"),t("h3","","Braille Blank (U+2800) & Whitespace Cleaner"),t("p","ls-muted","Scrubs invisible Braille pattern blanks (U+2800), zero-width joiners, and accidental 4-space code blocks.")),a){let M=t("div","ls-row-between ls-stat-cell");M.append(t("span","","Auto-Clean Braille Blanks & 4-Space Glitches"));let h=t("div");M.append(h),me(e,n,h,{checked:Boolean(a.cleanBraille),ariaLabel:"Auto-Clean Braille Blanks",onChange:(x)=>{e.request("settings:update",{settings:{cleanBraille:x}})}}),o.append(M)}let r=t("div","ls-row-between ls-stat-cell");r.append(t("span","","Retroactively clean all stored messages in the active chat:"),R("Clean Active Chat Now",()=>{e.request("prose:cleanChat").then((M)=>{e.notify(`Cleaned ${Number(M.cleanedCount??0)} of ${Number(M.total??0)} messages.`)})},"ls-btn-sm ls-btn-primary")),o.append(r),s.append(o);let u=t("div");s.append(u);let i=fe(e,n,u,{title:"Live Braille & Indentation Tester",iconName:"flask",defaultExpanded:!1,persistKey:"studio_prose_tester"}),d=t("textarea","ls-input");d.rows=2,d.value=ts;let g=t("div","ls-stat-cell"),v=()=>{ts=d.value,g.textContent=`Normalized Output: ${jt(d.value)}`};if(d.addEventListener("input",v),v(),i.append(d,g),a){let M=t("section","ls-card"),h=(I)=>{e.request("settings:update",{settings:I})},x=kt(a.sensitiveWords),L=a.obfuscateVowelsWithOne!==!1,T=t("div","ls-row-between"),A=t("div");T.append(t("h3","",`Sensitive Word Obfuscator (${x.length} words)`),A),me(e,n,A,{checked:Boolean(a.sensitiveObfuscatorEnabled),ariaLabel:"Enable Sensitive Word Obfuscator",onChange:(I)=>h({sensitiveObfuscatorEnabled:I})}),M.append(T,t("p","ls-muted",'Replaces vowels in chosen words with "1" (e.g., blood → bl11d) when sending prompts, and restores readable words & inflections (e.g., bl11d/bl11dy → blood/bloody) in chat display via Lumiverse display processing (requires "chat_mutation" or "regex_scripts" permission).'));let w=t("div","ls-row"),f=t("input","ls-input");f.style.flex="1",f.placeholder="Type words separated by commas (e.g. blood, kill)…",f.value=zn,f.addEventListener("input",()=>{zn=f.value});let C=()=>{let I=f.value.split(/[\n,;]+/).map((k)=>k.trim().toLowerCase()).filter((k)=>k.length>=2);if(!I.length)return;let c=kt([...x,...I]);zn="",f.value="",h({sensitiveWords:c,...a.sensitiveObfuscatorEnabled?{}:{sensitiveObfuscatorEnabled:!0}})};if(f.addEventListener("keydown",(I)=>{if(I.key==="Enter")I.preventDefault(),C()}),w.append(f,R("Add",C,"ls-btn-sm ls-btn-primary"),...x.length>0?[R("Clear All",()=>h({sensitiveWords:[]}),"ls-btn-sm ls-btn-danger")]:[]),M.append(w),x.length>0){let I=t("div","ls-row");for(let c of x)I.append(R(`${c} → ${Tn(c,L)} ✕`,()=>{h({sensitiveWords:x.filter((k)=>k!==c)})},"ls-btn-sm ls-quick-pill",`Remove "${c}"`));M.append(I)}let P=t("div");M.append(P);let S=fe(e,n,P,{title:"Cipher Rules & Live Preview",iconName:"sliders",defaultExpanded:!1,persistKey:"studio_prose_cipher"}),y=t("div","ls-grid");for(let[I,c,k]of[["obfuscateVowelsWithOne",'Use "1" instead of "*"',!0],["obfuscateOnSend","Obfuscate Prompts Sent to LLM",!0],["restoreObfuscatedOnRender","Restore Words in Chat Display",!0],["obfuscateOnOutput","Obfuscate Saved LLM Output",!1],["includeCipherHint","Explain Cipher Input to LLM (Keep prose normal)",!1]]){let E=t("div","ls-row-between ls-stat-cell");E.append(t("span","",c));let B=t("div");E.append(B),me(e,n,B,{checked:a[I]!==void 0?Boolean(a[I]):k,onChange:(N)=>h({[I]:N})}),y.append(E)}let m=t("input","ls-input");m.value=ns;let p=t("small","ls-muted"),l=t("small","ls-muted"),b=()=>{ns=m.value;let I=Ma(m.value,x,L),c=a.obfuscateOnOutput?I:a.restoreObfuscatedOnRender!==!1?La(I,x,L):I;p.textContent=`Sent to LLM: ${I}`,l.textContent=`Chat Display: ${c}`};m.addEventListener("input",b),b(),S.append(y,m,p,l),s.append(M)}return s}function rs(e,n,a){let s=e.settings,o=t("div","ls-stack");if(!s)return o;if(!e.connections.length&&!as)as=!0,e.refreshActiveChat();let r=t("section","ls-card");r.append(t("h3","","Extraction Mode & Connections"));let u=t("div","ls-row");for(let[c,k]of[["sidecar","Dedicated Sidecar Extractor (Works with Any Preset)"],["inline_tag","Zero-Call Inline <lumi-stats> Tag"]]){let E=R(k,()=>{e.request("settings:update",{settings:{extractionMode:c}})},"ls-btn-sm");if(s.extractionMode===c)E.setAttribute("aria-current","page");u.append(E)}r.append(u);let i=t("div","ls-grid");for(let[c,k]of[["autoTrack","Auto-calibrate after assistant replies"],["injectContinuity","Inject continuity into narrator prompt"],["memoryCortexSync","Sync to Lumiverse Memory Cortex"],["worldInfoGating","Enable [lumi:stat>=value] World Info gates"],["thresholdToasts","Show threshold toast alerts"],["debugInspector","Keep last extractor payload for debug"]]){let E=t("div","ls-row-between ls-stat-cell");E.append(t("span","",k));let B=t("div");E.append(B),me(e,n,B,{checked:Boolean(s[c]),onChange:(N)=>void e.request("settings:update",{settings:{[c]:N}})}),i.append(E)}r.append(i);let d=t("div","ls-grid"),g=t("div","ls-label","Extractor LLM Connection"),v=t("div");g.append(v);let M=t("label","ls-label","Extractor Model Override"),h=t("div");M.append(h),d.append(g,M),r.append(d),J(e,n,v,{value:s.extractorConnectionId||"",ariaLabel:"Extractor LLM Connection",searchPlaceholder:"Search connections…",options:[{value:"",label:"Use Active Lumiverse Default Connection"},...e.connections.map((c)=>({value:c.id,label:`${c.name}${c.model?` (${c.model})`:""}`,...c.provider?{sublabel:c.provider}:{}}))],onChange:(c)=>{e.request("settings:update",{settings:{extractorConnectionId:c}})}});let x=t("input","ls-input");if(x.value=s.extractorModel||"",x.placeholder="Default connection model…",x.addEventListener("change",()=>{e.request("settings:update",{settings:{extractorModel:x.value.trim()}})}),h.append(x),e.ctx.components?.mountModelCombobox)a.push(()=>{if(!h.isConnected)return;try{h.replaceChildren(),n.track(e.ctx.components.mountModelCombobox(h,{value:s.extractorModel||"",connection:s.extractorConnectionId?{kind:"llm",id:s.extractorConnectionId}:{kind:"llm"},appearance:"standard",placeholder:"Default connection model…",onChange:(c)=>{e.request("settings:update",{settings:{extractorModel:c}})}}))}catch{}});let L=t("section","ls-card");L.append(t("span","ls-kicker","Token Economy & Prompt Budget"),t("h3","","Token Diet, Protocol Mode & Live Analyzer"));let T=t("div","ls-grid"),A=t("label","ls-label","Continuity Token Budget (150–4000)"),w=t("input","ls-input");w.type="number",w.min="150",w.max="4000",w.step="50",w.value=String(s.tokenBudget??450),w.addEventListener("change",()=>{let c=Math.max(150,Math.min(4000,Math.round(Number(w.value)||450)));w.value=String(c),e.request("settings:update",{settings:{tokenBudget:c}})}),A.append(w);let f=t("div","ls-label","Extractor Protocol Mode"),C=t("div");f.append(C),J(e,n,C,{value:s.protocolVerbosity??"compact",ariaLabel:"Extractor Protocol Mode",options:[{value:"compact",label:"Compact Delta (Recommended — Saves ~45%)"},{value:"standard",label:"Standard Detailed (Verbose Turn-1 Guides)"}],onChange:(c)=>{e.request("settings:update",{settings:{protocolVerbosity:c}})}});let P=t("label","ls-label","Sidecar History Window (2–12 msgs)"),S=t("input","ls-input");S.type="number",S.min="2",S.max="12",S.value=String(s.sidecarHistoryTurns??4),S.addEventListener("change",()=>{let c=Math.max(2,Math.min(12,Math.round(Number(S.value)||4)));S.value=String(c),e.request("settings:update",{settings:{sidecarHistoryTurns:c}})}),P.append(S);let y=t("label","ls-label","Sidecar Max Chars / Msg (800–6000)"),m=t("input","ls-input");m.type="number",m.min="800",m.max="6000",m.step="250",m.value=String(s.sidecarMaxCharsPerMsg??2500),m.addEventListener("change",()=>{let c=Math.max(800,Math.min(6000,Math.round(Number(m.value)||2500)));m.value=String(c),e.request("settings:update",{settings:{sidecarMaxCharsPerMsg:c}})}),y.append(m),T.append(A,f,P,y),L.append(T);let p=t("div","ls-row");p.append(R("Hide Analytical Fields from Continuity",()=>{let c=new Set(["acted","observation","plan","knowledge","cash_in_hand","cash_in_bank","bottom_underwear","top_underwear","offscreen_npcs"]),k=e.snapshot.template.stats.map((E)=>c.has(E.id)?{...E,injectInContinuity:!1}:E);e.request("state:mutate",{templatePatch:{stats:k},reason:"Moved analytical/secondary stats to UI-only continuity"}).then(()=>e.notify("Analytical fields moved to UI-only (still tracked & visible in panels)."))},"ls-btn-sm","Stops echoing acted, observation, plan, knowledge, cash, underwear, and offscreen_npcs back to the narrator while keeping them in the UI"),R("Auto-Gate Situational Stats",()=>{let c={cash_in_hand:["cash","coin","gold","money","pay","buy","sell","price","wallet","bank"],cash_in_bank:["cash","coin","gold","money","pay","buy","sell","bank","account","asset"],bottom_underwear:["undress","underwear","panties","boxers","towel","bath","strip","naked","skirt","pants"],top_underwear:["undress","underwear","bra","towel","bath","strip","naked","shirt","top"]},k=e.snapshot.template.stats.map((E)=>{if(c[E.id])return{...E,promptTriggerMode:"conditional",promptKeywords:c[E.id]};if((E.id==="eff_pow_agi"||E.id==="char_eff_pow_agi")&&E.formula?.trim())return{...E,calculationMode:"local_formula"};return E});e.request("state:mutate",{templatePatch:{stats:k},reason:"Applied keyword gating & local-formula diet"}).then(()=>e.notify("Applied keyword gating to situational stats."))},"ls-btn-sm","Only sends cash & clothing rules when matching keywords appear in recent chat")),L.append(p);let l=t("div","ls-stat-cell"),b=()=>{if(l.replaceChildren(),!Re){l.append(t("small","ls-muted",'Click "Analyze Current Chat Tokens" to measure exact protocol, continuity, and per-stat token usage.'));return}let c=Re.approximate?" (est.)":"";l.append(t("strong","",`Total Injected: ${Number(Re.totalInjectedTokens??0)} tokens${c} — Protocol: ${Number(Re.protocolTokens??0)} | Continuity: ${Number(Re.continuityTokens??0)} (uncapped: ${Number(Re.rawContinuityTokens??0)}) | Dossier: ~${Number(Re.dossierStateTokens??0)}`));let k=Array.isArray(Re.topStats)?Re.topStats:[];if(k.length>0){let E=t("div","ls-row");for(let B of k)E.append(t("span","ls-chip",`${String(B.label)}: ~${Number(B.approxTokens??0)}t (rule ${Number(B.ruleTokens??0)} + state ${Number(B.stateTokens??0)})`));l.append(E)}};b();let I=R("Analyze Current Chat Tokens",()=>{I.disabled=!0,I.textContent="Counting tokens…",e.request("tokens:analyze").then((c)=>{Re=c,b()}).finally(()=>{if(I.isConnected)I.disabled=!1,I.textContent="Analyze Current Chat Tokens"})},"ls-btn-sm ls-btn-primary");return L.append(I,l),r.append(R("Inspect Last Extractor Payload",()=>{e.request("debug:get").then((c)=>{e.modals.open({title:"Last Extractor JSON Output",width:720,maxHeight:740},(k)=>{let E=t("pre","ls-stat-cell",c.record?JSON.stringify(c.record,null,2):"No debug record captured yet. Enable debug inspection and run a sync.");E.style.whiteSpace="pre-wrap",E.style.overflowWrap="anywhere",k.append(E)})})},"ls-btn-sm")),o.append(r,L),o}function rn(e,n){let a=structuredClone(e.snapshot.template),s=[...a.categories??[]];e.modals.open({title:n?`Edit Category: ${n.icon} ${n.name}`:"Create Stat Category & Group Rule",width:660,maxHeight:840},(o,r,u,i)=>{let d=n?.enabled??!0,g=n?.showGroupHeaderInHud??!0,v=n?.collapsedByDefault??!1,M=n?.injectInContinuity??!0,h=n?.color||"var(--lumiverse-primary)",x=n?.promptTriggerMode??"always",L=new Set(n?a.stats.filter((X)=>X.categoryId===n.id).map((X)=>X.id):[]),T=t("div","ls-grid"),A=t("label","ls-label","Icon"),w=t("input","ls-input");w.value=n?.icon??"\uD83D\uDCC1",A.append(w);let f=t("label","ls-label","Category Name"),C=t("input","ls-input");C.placeholder="e.g. Combat & Power, Romance & Chemistry, Finances…",C.value=n?.name??"",f.append(C),T.append(A,f),o.append(T);let P=t("div","ls-label","Category Accent Color"),S=t("div","ls-row"),y=()=>{for(let X of[...S.querySelectorAll(".ls-color-swatch")])X.setAttribute("aria-pressed",String(X.dataset.colorVal===h))};for(let[X,ae,ne]of[["var(--lumiverse-primary)","Theme Primary","var(--lumiverse-primary, #38bdf8)"],["#38bdf8","Sky","#38bdf8"],["#f472b6","Rose","#f472b6"],["#f59e0b","Amber","#f59e0b"],["#10b981","Emerald","#10b981"],["#a78bfa","Violet","#a78bfa"],["#f43f5e","Crimson","#f43f5e"]]){let ge=R("",()=>{h=X,y()},"ls-color-swatch",ae);ge.dataset.colorVal=X,ge.style.background=ne,S.append(ge)}y(),P.append(S),o.append(P);let m=t("div","ls-row-between ls-stat-cell");m.append(t("strong","","Enable Category & All Stats Inside It"));let p=t("div");m.append(p),me(e,i,p,{checked:d,ariaLabel:"Enable Category",onChange:(X)=>{d=X}}),o.append(m);let l=t("div","ls-grid");for(let[X,ae,ne]of[["Show Category Header in HUD / Drawer",g,(ge)=>{g=ge}],["Collapse Group by Default",v,(ge)=>{v=ge}],["Include Category Stats & AI Rule in Story Continuity",M,(ge)=>{M=ge}]]){let ge=t("div");xe(e,i,ge,{checked:ae,label:X,onChange:ne}),l.append(ge)}o.append(l);let b=t("div");o.append(b);let I=fe(e,i,b,{title:"Shared Category AI Rule & Prompt Trigger",iconName:"sparkles",defaultExpanded:!0,persistKey:"modal_cat_ai_rule"});I.append(t("small","ls-muted","This rule is printed ONCE for the group alongside each member stat’s own individual rule (individual stat rules remain completely untouched)."));let c=t("div","ls-label","Group Prompt Frequency"),k=t("div");c.append(k),I.append(c);let E=t("label","ls-label","Group Trigger Keywords (comma-separated)"),B=t("input","ls-input");B.placeholder="e.g. attack, fight, hit, spell, bleed, dodge",B.value=(n?.promptKeywords??[]).join(", "),E.append(B),I.append(E);let N=()=>{E.style.display=x==="conditional"?"":"none"};N(),J(e,i,k,{value:x,ariaLabel:"Group Prompt Frequency",options:[{value:"always",label:"Always in Prompt"},{value:"conditional",label:"Only When Group Keywords Match"},{value:"manual",label:"Manual Sync Only"}],onChange:(X)=>{x=X,N()}});let _=t("div","ls-label"),D=t("div","ls-row-between"),H=t("textarea","ls-input");H.rows=3,H.value=n?.aiRule??"",H.placeholder="Describe shared delta ranges, combat multipliers, romance pacing, or roleplay behavior for stats in this category…",D.append(t("span","","Shared Category AI / Delta Rule"),R("⛶ Full-Screen Editor",()=>{e.request("textEditor:open",{title:`Category Rule: ${C.value||"Category"}`,value:H.value,placeholder:"Describe shared rules for this stat group…"}).then((X)=>{if(!X.cancelled&&typeof X.text==="string")H.value=X.text})},"ls-btn-sm")),_.append(D,H),I.append(_);let F=t("div");o.append(F);let V=fe(e,i,F,{title:"Local Group Formula & Cross-Stat Modifiers (Optional)",iconName:"sliders",defaultExpanded:Boolean(n?.localRuleFormula),persistKey:"modal_cat_local_rule"});V.append(t("small","ls-muted",'Supports conditional modifiers `mod("stat_id", "Label", delta)` (auto-applies while true and clears when false) and `set("stat_id", expr)` / `if(cond) mod(...)`.'));let O=t("textarea","ls-input");O.rows=3,O.placeholder=`e.g.
mod("composure", "High Arousal", arousal >= 75 ? -10 : 0)
if(HP < HP_max * 0.5) mod("composure", "Wounded", -10)`,O.value=n?.localRuleFormula??"";let W=t("div","ls-formula-status"),q=t("strong","");W.append(q);let z=()=>{let X=wn({...n,id:n?.id,name:C.value.trim()||"Preview Category",localRuleFormula:O.value});if(!O.value.trim()){W.dataset.status="warn",q.textContent="No local group formula set (optional).";return}let ae=Ha(X,e.snapshot.state,a.stats,e.selectedActorId);if(ae.error)W.dataset.status="error",q.textContent=`✖ Error: ${ae.error}`;else if(ae.appliedEffects.length>0)W.dataset.status="ok",q.textContent=`✓ Active Effects: ${ae.appliedEffects.join(" · ")}`;else W.dataset.status="ok",q.textContent="✓ Valid formula (0 active modifiers triggered on current state)."};O.addEventListener("input",z),z(),V.append(O,W,R("▶ Test Group Formula",z,"ls-btn-sm"));let j=t("div");o.append(j);let K=fe(e,i,j,{title:`Member Stats in This Category (${L.size})`,iconName:"stats",defaultExpanded:!0,persistKey:"modal_cat_members"}),Y=t("div","ls-grid");for(let X of a.stats){let ae=t("div");xe(e,i,ae,{checked:L.has(X.id),label:`${X.icon} ${X.label} (${X.scope})`,onChange:(ne)=>{if(ne)L.add(X.id);else L.delete(X.id)}}),Y.append(ae)}K.append(Y);let G=t("div","ls-row-between");G.style.marginTop="12px";let ee=t("div","ls-row");if(n)ee.append(R("Delete Category",()=>{let X=s.filter((ne)=>ne.id!==n.id),ae=a.stats.map((ne)=>ne.categoryId===n.id?{...ne,categoryId:void 0}:ne);e.request("state:mutate",{templatePatch:{categories:X,stats:ae},reason:`Deleted category "${n.name}" (stats preserved)`}),r()},"ls-btn-sm ls-btn-danger"));let te=R(n?"Save Category":"Create Category",()=>{let X=C.value.trim();if(!X)return;let ae=B.value.split(",").map((le)=>le.trim().toLowerCase()).filter(Boolean),ne=wn({...n,id:n?.id,name:X,icon:w.value.trim()||"\uD83D\uDCC1",color:h,enabled:d,showGroupHeaderInHud:g,collapsedByDefault:v,injectInContinuity:M,promptTriggerMode:x,promptKeywords:ae,aiRule:H.value.trim()||void 0,localRuleFormula:O.value.trim()||void 0,order:n?.order??s.length}),ge=s.some((le)=>le.id===ne.id)?s.map((le)=>le.id===ne.id?ne:le):[...s,ne],Se=a.stats.map((le)=>{if(L.has(le.id))return{...le,categoryId:ne.id};if(le.categoryId===ne.id)return{...le,categoryId:void 0};return le});e.request("state:mutate",{templatePatch:{categories:ge,stats:Se},reason:`Saved category "${ne.name}"`}),r()},"ls-btn-primary");G.append(ee,te),o.append(G)})}var de="all",Vn="",os=[{label:"Blush & Fluster",icon:"\uD83D\uDC93",scope:"character",kind:"meter",min:0,max:100,defaultValue:0,volatility:"momentary",triggerCues:"0–100 scale. Spikes immediately on teasing, eye contact, state of undress, or closeness; cools down in calm talk."},{label:"Jealousy & Possessiveness",icon:"\uD83D\uDD25",scope:"character",kind:"meter",min:0,max:100,defaultValue:10,volatility:"momentary",triggerCues:"0–100 scale. Rises when the player praises, flirts with, or prioritizes another rival."},{label:"Respect & Standing",icon:"\uD83D\uDC51",scope:"character",kind:"meter",min:0,max:100,defaultValue:50,volatility:"progressive",triggerCues:"0–100 scale. Rises when the player shows competence, poise, or backbone; drops on weakness."},{label:"Suspicion",icon:"\uD83D\uDD0D",scope:"character",kind:"meter",min:0,max:100,defaultValue:15,volatility:"progressive",triggerCues:"0–100 scale. Increases when catching inconsistencies, secrets, or unusual behavior."},{label:"Stamina & Energy",icon:"⚡",scope:"player",kind:"meter",min:0,max:100,defaultValue:100,volatility:"momentary",triggerCues:"0–100 scale. Spent during physical exertion, combat, or sleepless nights; restored by rest or meals."},{label:"Danger / Event Clock",icon:"⏱️",scope:"world",kind:"clock",min:0,max:6,defaultValue:0,volatility:"progressive",triggerCues:"0–6 segments. Advance by +1 segment as an approaching confrontation, deadline, or alarm draws closer."},{label:"Skill Tree & SP",icon:"\uD83C\uDF33",scope:"player",kind:"skill_tree",min:0,max:100,defaultValue:0,volatility:"progressive",triggerCues:'Format: "SP: N | Skill A (Lv.X/Y, cost:1, bonus) ; Skill B (Lv.X/Y, cost:1, req:Skill A)". Award SP on milestones.'},{label:"Level & XP",icon:"⭐",scope:"player",kind:"xp_level",min:0,max:100,defaultValue:0,volatility:"progressive",triggerCues:'Format: "Lv. N | cur/next XP | Rank X". Award XP on quests/battles; level up when cur >= next.'},{label:"Core Attributes",icon:"\uD83E\uDDEC",scope:"player",kind:"attributes",min:1,max:30,defaultValue:10,volatility:"anchor",triggerCues:'Comma-separated stats: "STR:N, DEX:N, CON:N, INT:N, WIS:N, CHA:N".'},{label:"Gear & Inventory",icon:"\uD83C\uDF92",scope:"player",kind:"inventory",min:0,max:100,defaultValue:0,volatility:"progressive",triggerCues:'Separate items by "; " with qty & rarity tags: "Runed Blade [rare, equipped] ; Potion x3 [common]".'},{label:"Buffs & Debuffs",icon:"⚡",scope:"player",kind:"status_fx",min:0,max:100,defaultValue:0,volatility:"momentary",triggerCues:'Prefix buffs with "+" and debuffs with "-" separated by "; ", e.g. "+Shielded (2t) ; -Exhausted (1t)".'},{label:"Gold / Credits",icon:"\uD83E\uDE99",scope:"player",kind:"currency",min:0,max:99999999,defaultValue:100,volatility:"progressive",triggerCues:"Track currency. Emit +N / -N on rewards, loot, or spending."}],is=[{id:"player_attire",group:"player"},{id:"player_condition",group:"player"},{id:"player_action",group:"player"},{id:"scene_summary",group:"scene_world"},{id:"places",group:"scene_world"},{id:"quests",group:"scene_world"},{id:"dispatches",group:"scene_world"},{id:"npc_conditions",group:"character"},{id:"npc_secrets",group:"character"}];function ls(e,n,a,s,o){let r=t("div","ls-stack"),u=t("div","ls-row-between"),i=t("input","ls-input");i.style.cssText="flex:1 1 220px;min-width:160px;",i.placeholder="Search stats, meters, built-ins, or dossier fields…",i.value=Vn;let d=t("div","ls-row");d.append(Q("flask",()=>Ze(e),{label:"Test Sandbox",className:"ls-btn-sm"}),Q("plus",()=>rn(e),{label:"New Category",className:"ls-btn-sm",title:"Create a custom Stat Category with shared AI/local rules"}),Q("plus",()=>Ce(e,"character"),{label:"New Stat",className:"ls-btn-sm ls-btn-primary"})),u.append(i,d),r.append(u);let g=t("div","ls-subnav-pills");for(let[T,A]of[["all","All Trackers"],["categories",`Categories (${(a.categories??[]).length})`],["character","NPC Meters"],["player","Player Stats"],["scene_world","Scene & World"],["builtin","Built-Ins & Pill"],["dossier","Dossier Fields"]]){let w=R(A,()=>{de=T,o()},"ls-btn-sm");if(de===T)w.setAttribute("aria-current","page");g.append(w)}r.append(g);let v=t("div");r.append(v);let M=fe(e,n,v,{title:"1-Click Quick-Add Popular Stats",iconName:"sparkles",badge:os.length,defaultExpanded:!1,persistKey:"studio_stats_quick_add"}),h=t("div","ls-row");for(let T of os){let A=a.stats.some((f)=>f.id===ie(T.label,"stat")),w=R(`${A?"✓ ":"+ "}${T.icon} ${T.label}`,()=>{let f=re({label:T.label,icon:T.icon,scope:T.scope,kind:T.kind,min:T.min,max:T.max,defaultValue:T.defaultValue,volatility:T.volatility,triggerCues:T.triggerCues});s((C)=>({stats:[...C.stats.filter((P)=>P.id!==f.id),f]}),`Added stat "${f.label}"`),e.notify(`Added "${f.icon} ${f.label}".`)},`ls-btn-sm ls-quick-pill ${A?"ls-chip-accent":""}`,T.triggerCues);h.append(w)}M.append(h);let x=t("div","ls-stack");r.append(x);let L=()=>{x.replaceChildren();let T=Vn.trim().toLowerCase(),A=(l)=>!T||l.toLowerCase().includes(T);if((de==="all"||de==="scene_world"||de==="builtin")&&A("scene pill location time date weather clock")){let l=t("div","ls-stat-row-compact");l.style.borderLeft="3px solid var(--ls-primary)";let b=t("div","ls-row");b.append(t("strong","","\uD83D\uDCCD Scene Pill (Location, Time, Date, Weather)"),t("span","ls-chip ls-chip-accent",a.coreTrackers?.scenePillLocked?"\uD83D\uDD12 Locked":"Built-In Pill"));let I=t("div","ls-row");I.append(R("Full Edit & Prompts",()=>Ae(e),"ls-btn-sm ls-btn-primary")),l.append(b,I),x.append(l)}let w=(l)=>{let b=t("div","ls-stat-row-compact");b.style.borderLeft=`3px solid ${l.color||"var(--ls-primary)"}`;let I=t("div","ls-row");I.style.minWidth="0";let c=t("div");me(e,n,c,{checked:l.enabled,ariaLabel:`Toggle ${l.label}`,onChange:(D)=>{s((H)=>({stats:H.stats.map((F)=>F.id===l.id?{...F,enabled:D}:F)}))}});let E=!$t(l)&&l.kind!=="boolean"?`${l.kind} (${l.min}–${l.max})`:l.kind,B=l.scope==="character"?"NPC":l.scope,N=l.calculationMode==="ai_plus_local"?"\uD83D\uDD00 Hybrid":l.calculationMode==="local_formula"||Boolean(l.formula?.trim())&&l.calculationMode!=="ai"?"⚡ Local":"\uD83E\uDD16 AI";I.append(c,t("strong","",`${l.icon} ${l.label}`),t("span","ls-chip",`${B} · ${E}`),t("span",`ls-chip ${N!=="\uD83E\uDD16 AI"?"ls-chip-accent":""}`,N),...l.promptTriggerMode==="conditional"?[t("span","ls-chip","\uD83D\uDD0D Conditional")]:[],...l.pinnedToHeader?[t("span","ls-chip ls-chip-accent","Pinned")]:[],...l.locked?[t("span","ls-chip","\uD83D\uDD12")]:[]);let _=t("div","ls-row");return _.style.flex="none",_.append(R("Full Edit",()=>Ce(e,l.scope,l),"ls-btn-sm"),Q("trash",()=>{s((D)=>({stats:D.stats.filter((H)=>H.id!==l.id)}),`Deleted stat "${l.label}"`),e.notify(`Deleted "${l.icon} ${l.label}".`)},{className:"ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger",title:`Delete "${l.label}"`}),Q("more",async(D)=>{if(typeof e.ctx.ui?.showContextMenu!=="function"){Ce(e,l.scope,l);return}let{selectedKey:H}=await e.ctx.ui.showContextMenu({position:{x:D.clientX,y:D.clientY},items:[{key:"edit",label:"Full Edit (Style, Tabs & AI Prompt)"},{key:"pin",label:l.pinnedToHeader?"Unpin from Pill":"Pin to Scene Pill",active:l.pinnedToHeader},{key:"lock",label:l.locked?"Unlock Value":"Lock Value",active:l.locked},{key:"duplicate",label:"Duplicate to Another Scope / Tab…"},{key:"test",label:"Test in AI Sandbox"},{key:"div",label:"",type:"divider"},{key:"delete",label:"Delete Stat",danger:!0}]});if(H==="edit")Ce(e,l.scope,l);else if(H==="pin")s((F)=>({stats:F.stats.map((V)=>V.id===l.id?{...V,pinnedToHeader:!V.pinnedToHeader,showIn:{...V.showIn,pinnedHeader:!V.pinnedToHeader}}:V)}));else if(H==="lock")s((F)=>({stats:F.stats.map((V)=>V.id===l.id?{...V,locked:!V.locked}:V)}));else if(H==="duplicate")We(e,l);else if(H==="test")Ze(e,l.id);else if(H==="delete")s((F)=>({stats:F.stats.filter((V)=>V.id!==l.id)}))},{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:"More actions"})),b.append(I,_),b},f=[...a.categories??[]].sort((l,b)=>l.order-b.order),C=new Set(f.map((l)=>l.id)),P=a.stats.filter((l)=>{if(de==="dossier"||de==="builtin")return!1;if(de==="character"&&l.scope!=="character")return!1;if(de==="player"&&l.scope!=="player")return!1;if(de==="scene_world"&&l.scope!=="world"&&l.scope!=="scene")return!1;return A(`${l.label} ${l.id} ${l.kind} ${l.triggerCues}`)});if(de==="categories"&&f.length===0){let l=t("section","ls-card");l.append(t("strong","","No custom categories created yet"),t("p","ls-muted","Group related stats (e.g. Combat & Power, Romance, Finances) to attach shared AI delta rules, group keyword triggers, or cross-stat local modifiers—while keeping each stat’s own rules intact."),R("+ Create First Category",()=>rn(e),"ls-btn-sm ls-btn-primary")),x.append(l)}for(let l of f){let b=P.filter((N)=>N.categoryId===l.id);if(de!=="categories"&&b.length===0&&T)continue;if(de!=="all"&&de!=="categories"&&b.length===0)continue;let I=t("section","ls-card ls-cat-group");I.style.borderLeft=`3px solid ${l.color||"var(--ls-primary)"}`;let c=t("div","ls-row-between"),k=t("div","ls-row"),E=t("div");me(e,n,E,{checked:l.enabled,ariaLabel:`Toggle category ${l.name}`,onChange:(N)=>{s((_)=>({categories:(_.categories??[]).map((D)=>D.id===l.id?{...D,enabled:N}:D)}))}}),k.append(E,t("strong","",`${l.icon} ${l.name}`),t("span","ls-chip",`${b.length} stats`),...l.aiRule?[t("span","ls-chip ls-chip-accent","Shared Rule")]:[],...l.localRuleFormula?[t("span","ls-chip ls-chip-accent","⚡ Local Rule")]:[],...l.promptTriggerMode==="conditional"?[t("span","ls-chip","\uD83D\uDD0D Conditional")]:[]);let B=t("div","ls-row");if(B.append(R("Edit Group & Rules",()=>rn(e,l),"ls-btn-sm")),c.append(k,B),I.append(c),b.length>0){let N=t("div");I.append(N);let _=fe(e,n,N,{title:`Member Stats (${b.length})`,defaultExpanded:!l.collapsedByDefault,persistKey:`studio_cat_${l.id}`});for(let D of b)_.append(w(D))}else I.append(t("small","ls-muted",'No stats assigned to this category yet. Click "Edit Group & Rules" to assign stats.'));x.append(I)}let S=P.filter((l)=>!l.categoryId||!C.has(l.categoryId));if(S.length>0&&de!=="categories"){let l=t("section","ls-card"),b=t("div","ls-row-between");b.append(t("h3","",f.length>0?`Uncategorized Stats (${S.length})`:`Stats & Meters (${S.length})`),t("span","ls-muted","Click Full Edit to customize prompt, category, style & formula")),l.append(b);for(let I of S)l.append(w(I));x.append(l)}let y=is.filter((l)=>Boolean(a.coreTrackers?.overrides?.[l.id]?.deleted)).length,m=is.filter((l)=>{if(de==="dossier")return!1;if(de!=="all"&&de!=="builtin"&&l.group!==de)return!1;let b=Fe(a.coreTrackers,l.id);if(b.deleted)return!1;return A(`${l.id} ${b.label} ${b.instruction}`)});if(m.length>0||y>0&&(de==="all"||de==="builtin")){let l=t("section","ls-card"),b=t("div","ls-row-between"),I=t("div","ls-row");if(y>0)I.append(R(`↺ Restore Deleted (${y})`,()=>{s((E)=>{let B={...E.coreTrackers?.overrides??{}};for(let N of Object.keys(B))if(B[N]?.deleted)B[N]={...B[N],deleted:!1};return{coreTrackers:{...E.coreTrackers??{},overrides:B}}},"Restored deleted built-in trackers")},"ls-btn-sm ls-btn-ghost"));else I.append(t("span","ls-muted","Editable labels, prompts, styles & tabs"));b.append(t("h3","",`Built-In Story Trackers (${m.length})`),I),l.append(b);let c={player_attire:"trackPlayerAttire",player_condition:"trackPlayerCondition",player_action:"trackPlayerAction",scene_summary:"trackSceneSummary",places:"trackPlaces",quests:"trackQuests",dispatches:"trackDispatches",npc_conditions:"trackNpcConditions",npc_secrets:"trackNpcSecrets"},k={player_attire:"showPlayerAttireCard",player_condition:"showPlayerConditionCard",player_action:"showPlayerActionCard",scene_summary:"showSceneSummaryInWidget",quests:"showQuestsInWidget",dispatches:"showDispatchesInWidget"};for(let E of m){let B=Fe(a.coreTrackers,E.id),N=t("div","ls-stat-row-compact");N.style.borderLeft=`3px solid ${B.color||"var(--ls-primary)"}`;let _=t("div","ls-row"),D=t("div");me(e,n,D,{checked:B.enabled,ariaLabel:`Toggle ${B.label}`,onChange:(F)=>{s((V)=>{let O={...V.coreTrackers??{}};return O[c[E.id]]=F,{coreTrackers:O}})}}),_.append(D,t("strong","",`${B.icon||"\uD83D\uDCCA"} ${B.label}`),t("span","ls-chip","Built-In"),...B.locked?[t("span","ls-chip","\uD83D\uDD12")]:[]);let H=t("div","ls-row");H.append(R("Full Edit",()=>Qt(e,E.id),"ls-btn-sm"),Q("trash",()=>{s((F)=>{let V={...F.coreTrackers??{}};V[c[E.id]]=!1;let O=k[E.id];if(O)V[O]=!1;let W=V.overrides??{};return V.overrides={...W,[E.id]:{...W[E.id]??{},deleted:!0}},{coreTrackers:V}},`Deleted built-in tracker "${B.label}"`),e.notify(`Removed "${B.label}".`)},{className:"ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger",title:`Remove "${B.label}"`})),N.append(_,H),l.append(N)}x.append(l)}let p=a.dossierFields.filter((l)=>{if(de!=="all"&&de!=="dossier"&&de!=="character")return!1;return A(`${l.label} ${l.id} ${l.instruction}`)});if(p.length>0||de==="dossier"){let l=t("section","ls-card"),b=t("div","ls-row-between");b.append(t("h3","",`Character Dossier Fields (${p.length})`),t("div","ls-row")),b.lastElementChild.append(R("Restore Defaults",()=>{s({dossierFields:ot()},"Restored default dossier fields")},"ls-btn-sm ls-btn-ghost"),Q("plus",()=>Qe(e),{label:"New Field",className:"ls-btn-sm ls-btn-primary"})),l.append(b);for(let I of p){let c=t("div","ls-stat-row-compact");c.style.borderLeft=`3px solid ${I.color||"var(--ls-primary)"}`;let k=t("div","ls-row"),E=t("div");me(e,n,E,{checked:I.enabled,ariaLabel:`Toggle ${I.label}`,onChange:(N)=>{s((_)=>({dossierFields:_.dossierFields.map((D)=>D.id===I.id?{...D,enabled:N}:D)}))}}),k.append(E,t("strong","",`${I.icon} ${I.label}`),t("span","ls-chip",`Dossier · ${I.displayStyle||"card"}`));let B=t("div","ls-row");B.append(R("Full Edit",()=>Qe(e,I),"ls-btn-sm"),Q("trash",()=>{s((N)=>({dossierFields:N.dossierFields.filter((_)=>_.id!==I.id)}))},{className:"ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger",title:"Delete field"})),c.append(k,B),l.append(c)}x.append(l)}};return i.addEventListener("input",()=>{Vn=i.value,L()}),L(),r}var Nt="tabs";function cs(e,n,a,s,o){let r=t("div","ls-stack"),u=t("div","ls-subnav-pills");for(let[i,d]of[["tabs","1. Widget & Inline Tabs"],["dossier","2. Dossier Tabs"],["matrix","3. Stat Placement Matrix"],["banners","4. Scene Pill & Custom HTML"]]){let g=R(d,()=>{Nt=i,o()},"ls-btn-sm");if(Nt===i)g.setAttribute("aria-current","page");u.append(g)}if(r.append(u),Nt==="tabs"){let i=t("section","ls-card");i.append(t("h3","","Relationship Web & Peer Bonds"));let d=t("div","ls-grid");for(let[v,M]of[["showRelationshipWeb","Enable Relationship Web Tab"],["trackNpcBonds","Track NPC↔NPC Peer Bonds"]]){let h=t("div");xe(e,n,h,{checked:a.surfaces[v]!==!1,label:M,onChange:(x)=>s((L)=>({surfaces:{...L.surfaces,[v]:x}}))}),d.append(h)}i.append(d),r.append(i);let g=(v,M,h)=>{let x=t("section","ls-card");x.append(t("h3","",v));let L=[...h].sort((C,P)=>C.order-P.order),T=(C)=>{s((P)=>{let S=[...P.surfaces[M]].sort((y,m)=>y.order-m.order);return{surfaces:{...P.surfaces,[M]:C(S)}}})};L.forEach((C,P)=>{let S=t("div","ls-stat-row-compact"),y=t("div","ls-row"),m=t("div");me(e,n,m,{checked:C.enabled,ariaLabel:`Toggle ${C.label}`,onChange:(c)=>{T((k)=>k.map((E)=>E.id===C.id?{...E,enabled:c}:E))}});let p=t("input","ls-input");p.style.cssText="width:44px;min-height:28px;padding:2px 6px;",p.value=C.icon,p.addEventListener("change",()=>{let c=p.value.trim()||"\uD83D\uDCCA";T((k)=>k.map((E)=>E.id===C.id?{...E,icon:c}:E))});let l=t("input","ls-input");l.style.cssText="width:130px;min-height:28px;padding:2px 8px;",l.value=C.label,l.addEventListener("change",()=>{let c=l.value.trim()||C.label;T((k)=>k.map((E)=>E.id===C.id?{...E,label:c}:E))});let b=t("div");J(e,n,b,{value:C.kind,compact:!0,ariaLabel:"Surface Tab Kind",options:[{value:"stats",label:"Stats Grid"},{value:"cast",label:"Cast List"},{value:"web",label:"Bond Web"},{value:"map",label:"Spatial Atlas"},{value:"world",label:"World & Clocks"},{value:"custom",label:"Custom Tab"}],onChange:(c)=>{T((k)=>k.map((E)=>E.id===C.id?{...E,kind:c}:E))}}),y.append(m,p,l,b);let I=t("div","ls-row");if(P>0)I.append(R("↑",()=>{T((c)=>{let k=c.findIndex((B)=>B.id===C.id);if(k<=0)return c;let E=[...c];return[E[k-1],E[k]]=[E[k],E[k-1]],E.map((B,N)=>({...B,order:N}))})},"ls-btn-sm ls-btn-icon ls-btn-ghost"));if(P<L.length-1)I.append(R("↓",()=>{T((c)=>{let k=c.findIndex((B)=>B.id===C.id);if(k<0||k>=c.length-1)return c;let E=[...c];return[E[k],E[k+1]]=[E[k+1],E[k]],E.map((B,N)=>({...B,order:N}))})},"ls-btn-sm ls-btn-icon ls-btn-ghost"));if(L.length>1)I.append(Q("trash",()=>T((c)=>c.filter((k)=>k.id!==C.id)),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger",title:"Delete tab"}));S.append(y,I),x.append(S)});let A=t("div","ls-row"),w=t("input","ls-input");w.style.width="50px",w.value="✨";let f=t("input","ls-input");return f.style.flex="1",f.placeholder="New tab name (e.g. Gear, Plans, Clues)…",A.append(w,f,Q("plus",()=>{let C=f.value.trim();if(!C)return;let P=w.value.trim()||"✨";T((S)=>[...S,{id:ie(C,`tab_${S.length+1}`),label:C,icon:P,kind:"custom",enabled:!0,order:S.length}])},{label:"Add Tab",className:"ls-btn-sm ls-btn-primary"})),x.append(A),x};r.append(g("Floating HUD Widget Tabs","widgetTabs",a.surfaces.widgetTabs),g("Inline Message Ribbon Tabs","inlineTabs",a.surfaces.inlineTabs))}else if(Nt==="dossier"){let i=t("section","ls-card");i.append(t("h3","","Character Dossier Tabs"));let d=[...a.surfaces.dossierTabs].sort((h,x)=>h.order-x.order);d.forEach((h,x)=>{let L=t("div","ls-stat-cell"),T=t("div","ls-row-between"),A=t("div","ls-row"),w=(m)=>{s((p)=>{let l=[...p.surfaces.dossierTabs].sort((b,I)=>b.order-I.order);return{surfaces:{...p.surfaces,dossierTabs:m(l)}}})},f=t("div");me(e,n,f,{checked:h.enabled,onChange:(m)=>{w((p)=>p.map((l)=>l.id===h.id?{...l,enabled:m}:l))}});let C=t("input","ls-input");C.style.cssText="width:44px;min-height:28px;padding:2px 6px;",C.value=h.icon,C.addEventListener("change",()=>{let m=C.value.trim()||"\uD83E\uDEAA";w((p)=>p.map((l)=>l.id===h.id?{...l,icon:m}:l))});let P=t("input","ls-input");P.style.cssText="width:150px;min-height:28px;padding:2px 8px;",P.value=h.label,P.addEventListener("change",()=>{let m=P.value.trim()||h.label;w((p)=>p.map((l)=>l.id===h.id?{...l,label:m}:l))}),A.append(f,C,P);let S=t("div","ls-row");if(x>0)S.append(R("↑",()=>{w((m)=>{let p=m.findIndex((b)=>b.id===h.id);if(p<=0)return m;let l=[...m];return[l[p-1],l[p]]=[l[p],l[p-1]],l.map((b,I)=>({...b,order:I}))})},"ls-btn-sm ls-btn-icon ls-btn-ghost"));if(x<d.length-1)S.append(R("↓",()=>{w((m)=>{let p=m.findIndex((b)=>b.id===h.id);if(p<0||p>=m.length-1)return m;let l=[...m];return[l[p],l[p+1]]=[l[p+1],l[p]],l.map((b,I)=>({...b,order:I}))})},"ls-btn-sm ls-btn-icon ls-btn-ghost"));if(d.length>1)S.append(Q("trash",()=>w((m)=>m.filter((p)=>p.id!==h.id)),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger",title:"Delete dossier tab"}));T.append(A,S),L.append(T);let y=t("div","ls-row");for(let[m,p]of[["showMeters","Meters"],["showNpcBonds","Peer Bonds"],["showFields","Fields"],["showSecrets","Secrets"],["showAudit","Audit Log"]]){let l=t("div");xe(e,n,l,{checked:Boolean(h[m]),label:p,onChange:(b)=>{w((I)=>I.map((c)=>c.id===h.id?{...c,[m]:b}:c))}}),y.append(l)}L.append(y),i.append(L)});let g=t("div","ls-row"),v=t("input","ls-input");v.style.width="50px",v.value="⚔️";let M=t("input","ls-input");M.style.flex="1",M.placeholder="New Dossier Tab (e.g. Combat Arts, Wardrobe)…",g.append(v,M,Q("plus",()=>{let h=M.value.trim();if(!h)return;let x=v.value.trim()||"✨";s((L)=>{let T=[...L.surfaces.dossierTabs].sort((w,f)=>w.order-f.order),A={id:ie(h,`dtab_${T.length+1}`),label:h,icon:x,kind:"custom",enabled:!0,order:T.length,showMeters:!0,showFields:!0,showSecrets:!1,showAudit:!1,showNpcBonds:!1};return{surfaces:{...L.surfaces,dossierTabs:[...T,A]}}})},{label:"Add Dossier Tab",className:"ls-btn-sm ls-btn-primary"})),i.append(g),r.append(i)}else if(Nt==="matrix"){let i=t("section","ls-card");i.append(t("h3","","Stat Placement Matrix"),t("p","ls-muted","Choose which surfaces and tabs display each stat."));let d=[...a.surfaces.dossierTabs].sort((g,v)=>g.order-v.order);for(let g of a.stats){let v=t("div","ls-stat-cell"),M=t("div","ls-row-between"),h=t("div","ls-row");h.append(Q("copy",()=>We(e,g),{label:"Duplicate",className:"ls-btn-sm ls-btn-ghost"}),Q("edit",()=>Ce(e,g.scope,g),{label:"Edit",className:"ls-btn-sm"})),M.append(t("strong","",`${g.icon} ${g.label} (${g.scope})`),h),v.append(M);let x=t("div","ls-row");for(let[w,f]of[["widget","Widget"],["inline","Inline"],["dossier","Dossier"],["pinnedHeader","Pill"]]){let C=t("div");xe(e,n,C,{checked:Boolean(g.showIn?.[w]),label:f,onChange:(P)=>{s((S)=>({stats:S.stats.map((y)=>y.id===g.id?{...y,showIn:{...y.showIn,[w]:P},...w==="pinnedHeader"?{pinnedToHeader:P}:{}}:y)}))}}),x.append(C)}let L=t("div");J(e,n,L,{value:g.widgetTabId||(g.scope==="character"?"cast":"stats"),compact:!0,ariaLabel:"Widget Tab",options:a.surfaces.widgetTabs.map((w)=>({value:w.id,label:`Widget: ${w.label}`})),onChange:(w)=>{s((f)=>({stats:f.stats.map((C)=>C.id===g.id?{...C,widgetTabId:w}:C)}))}});let T=t("div");J(e,n,T,{value:g.inlineTabId||(g.scope==="character"?"cast":"stats"),compact:!0,ariaLabel:"Inline Tab",options:a.surfaces.inlineTabs.map((w)=>({value:w.id,label:`Inline: ${w.label}`})),onChange:(w)=>{s((f)=>({stats:f.stats.map((C)=>C.id===g.id?{...C,inlineTabId:w}:C)}))}});let A=t("div");J(e,n,A,{value:g.dossierTabId||"bonds",compact:!0,ariaLabel:"Dossier Tab",options:d.map((w)=>({value:w.id,label:`Dossier: ${w.label}`})),onChange:(w)=>{s((f)=>({stats:f.stats.map((C)=>C.id===g.id?{...C,dossierTabId:w}:C)}))}}),x.append(L,T,A),v.append(x),i.append(v)}r.append(i)}else{let i=t("section","ls-card"),d=t("div","ls-row-between");d.append(t("h3","","Scene Pill Chips & Custom HTML Banners"),R("Edit Scene Pill Prompts",()=>Ae(e),"ls-btn-sm ls-btn-primary")),i.append(d,t("p","ls-muted","Custom banners support {{location}}, {{time}}, {{date}}, {{weather}}, {{player_attire}}, {{name}}, and {{stat:id}}."));let g=t("div","ls-grid");for(let[x,L]of[["time","Time Chip"],["date","Date Chip"],["location","Location Chip"],["weather","Weather Chip"],["cast","Present Cast Chips"],["pinnedStats","Pinned Stat Chips"]]){let T=t("div");xe(e,n,T,{checked:a.theme.showSceneChips[x],label:L,onChange:(A)=>{s((w)=>({theme:{...w.theme,showSceneChips:{...w.theme.showSceneChips,[x]:A}}}))}}),g.append(T)}i.append(g);let v=t("textarea","ls-input");v.rows=2,v.placeholder="Custom Widget HTML Banner…",v.value=a.surfaces.customWidgetHtml||"";let M=t("textarea","ls-input");M.rows=2,M.placeholder="Custom Inline Ribbon HTML Banner…",M.value=a.surfaces.customInlineHtml||"";let h=t("textarea","ls-input");h.rows=2,h.placeholder="Custom Character Dossier HTML Banner…",h.value=a.surfaces.customDossierHtml||"",i.append(v,M,h,R("Apply Custom HTML Banners",()=>{s((x)=>({surfaces:{...x.surfaces,customWidgetHtml:v.value.trim(),customInlineHtml:M.value.trim(),customDossierHtml:h.value.trim()}}))},"ls-btn-sm ls-btn-primary")),r.append(i)}return r}function ds(e,n,a,s,o,r){let{state:u}=e.snapshot,i=t("div","ls-stack"),d=e.customTemplates.filter((N)=>!e.builtinTemplates.some((_)=>_.id===N.id)),g=d.length+e.builtinTemplates.length,v=t("section","ls-card"),M=t("div","ls-row-between"),h=t("div");h.append(t("span","ls-kicker","Template Gallery"),t("h3","",`Saved & Built-In Templates (${g})`));let x=t("div","ls-row");x.append(Q("plus",()=>Tt(e,r),{label:"New Template",className:"ls-btn-sm ls-btn-primary"}),R("Import .json",()=>{e.ctx.uploads.pickFile({accept:[".json","application/json"],multiple:!1,maxSizeBytes:2500000}).then(async(N)=>{let _=N[0];if(!_)return;let D=new TextDecoder().decode(_.bytes);await e.request("template:importJson",{json:D}),e.notify(`Imported & activated template from ${_.name}.`)}).catch((N)=>e.notify(N instanceof Error?N.message:String(N),!0))},"ls-btn-sm")),M.append(h,x),v.append(M);let L=(N,_)=>{let D=N.id===a.id,H=t("div","ls-preset-card");H.dataset.active=String(D);let F=t("div","ls-stack");F.style.gap="5px";let V=t("div","ls-row-between");V.append(t("strong","",`${N.icon} ${N.name}`),t("span",`ls-chip ${_?"ls-chip-accent":""}`,_?"Saved Custom":"Built-In"));let O=t("div","ls-row"),W=N.stats.filter((j)=>j.scope==="character").length,q=N.stats.filter((j)=>j.scope!=="character").length;O.append(t("span","ls-chip",`${W} NPC meters`),t("span","ls-chip",`${q} stats`)),F.append(V,t("p","ls-muted",N.description),O);let z=t("div","ls-row");if(D)z.append(t("span","ls-chip ls-chip-accent","✓ Active"));else{let j=R("Activate",()=>{j.disabled=!0,j.textContent="Applying…",e.request("template:apply",{templateId:N.id,template:N}).then(()=>{e.notify(`Activated "${N.name}"!`)}).catch((K)=>{if(e.notify(K instanceof Error?K.message:String(K),!0),j.isConnected)j.disabled=!1,j.textContent="Activate"})},"ls-btn-sm ls-btn-primary");z.append(j)}if(z.append(Q("copy",()=>o(N),{label:"Copy & Edit",className:"ls-btn-sm",title:"Create an editable copy of this template"})),_)z.append(Q("trash",()=>{e.modals.confirm({title:"Delete Saved Template?",message:`Remove "${N.name}" from your Template Library?`,confirmLabel:"Delete",variant:"danger"}).then((j)=>{if(!j)return;e.request("template:deleteFromLibrary",{templateId:N.id}).then(()=>e.notify(`Deleted "${N.name}" from library.`)).catch((K)=>e.notify(K instanceof Error?K.message:String(K),!0))})},{className:"ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger",title:"Delete from library"}));return H.append(F,z),H};if(v.append(t("span","ls-kicker",`Saved Custom Templates (${d.length})`)),d.length>0){let N=t("div","ls-grid");for(let _ of d)N.append(L(_,!0));v.append(N)}else v.append(t("p","ls-muted",'No saved custom templates yet. Click "+ New Template", "Save to Library", or "Copy & Edit" on any preset below.'));v.append(t("span","ls-kicker",`Built-In Presets (${e.builtinTemplates.length})`));let T=t("div","ls-grid");for(let N of e.builtinTemplates)T.append(L(N,!1));v.append(T),i.append(v);let A=t("section","ls-card");A.append(t("span","ls-kicker","Display & Prompt Placement"),t("h3","","Where Lumi Stats Appears"));let w=t("div","ls-row");for(let[N,_]of[["both_bottom","HUD + Below Reply"],["both_top","HUD + Above Reply"],["inline_bottom","Below Reply Only"],["floating_only","Floating HUD Only"]]){let D=R(_,()=>{s({theme:{...e.snapshot.template.theme,placement:N}})},"ls-btn-sm");if(a.theme.placement===N)D.setAttribute("aria-current","page");w.append(D)}A.append(w);let f=t("div","ls-row");f.append(t("small","ls-muted","AI Prompt Injection:"));for(let[N,_]of[["pre_history","Before History"],["in_history","Within History"],["post_history","After History"]]){let D=R(_,()=>{s({promptPosition:N},`Set prompt position to ${N}`)},"ls-btn-sm");if((a.promptPosition||"post_history")===N)D.setAttribute("aria-current","page");f.append(D)}if(a.promptPosition==="in_history"){let N=Math.max(0,Math.round(Number(a.promptDepth??1)||0)),_=t("input","ls-input");_.type="number",_.min="0",_.max="20",_.style.cssText="width:68px;min-height:26px;padding:2px 6px;",_.value=String(N),_.addEventListener("change",()=>{let D=Math.max(0,Math.min(20,Math.round(Number(_.value)||0)));s({promptDepth:D})}),f.append(t("small","ls-muted","Depth:"),_)}A.append(f),i.append(A);let C=t("div");i.append(C);let P=fe(e,n,C,{title:"Appearance, Skins, Frame Shapes & Widget Size",iconName:"palette",defaultExpanded:!1,persistKey:"studio_templates_skin"}),S=t("div","ls-row");S.append(t("small","ls-muted","1-Click Skins:"));for(let N of Vt){let _=R(N.name,()=>e.applySkinPack(N),"ls-btn-sm");if((a.theme.surfaceStyle||"glass")===N.surfaceStyle)_.setAttribute("aria-current","page");S.append(_)}S.append(R("Import Skin",()=>{e.ctx.uploads.pickFile({accept:[".json","application/json"],multiple:!1,maxSizeBytes:500000}).then((N)=>{let _=N[0];if(!_)return;let D=JSON.parse(new TextDecoder().decode(_.bytes));e.applySkinPack(D)})},"ls-btn-sm ls-btn-ghost"),R("Export Skin",()=>{let N=Sa(a),_=new Blob([JSON.stringify(N,null,2)],{type:"application/json"}),D=URL.createObjectURL(_),H=document.createElement("a");H.href=D,H.download=`${ie(a.name,"lumi_skin")}.lumi-skin.json`,document.body.append(H),H.click(),H.remove(),URL.revokeObjectURL(D)},"ls-btn-sm ls-btn-ghost")),P.append(S);let y=t("div","ls-row-between ls-stat-cell");y.append(t("strong","","Collapsed Pill Skin (10 Designs)"));let m=t("div");m.style.minWidth="230px",y.append(m),J(e,n,m,{value:a.theme.pillStyle||"glass_capsule",ariaLabel:"Collapsed Pill Skin",options:[{value:"glass_capsule",label:"✨ Frosted Split Capsule (Default Best)"},{value:"vn_dialogue_bar",label:"\uD83C\uDFAC VN Cinema Strip"},{value:"rpg_status_bar",label:"⚔️ JRPG Party Status Bar"},{value:"persona_ticker",label:"\uD83C\uDCCF Stylish Pop Ticker"},{value:"cyber_telemetry",label:"\uD83D\uDEF8 Cyber Telemetry"},{value:"minimal_floating",label:"☁️ Minimal Ghost Pill"},{value:"neon_edge",label:"⚡ Neon Glow Rail"},{value:"split_deck",label:"\uD83D\uDDC2️ Dual-Deck Card Pill"},{value:"compact_badge",label:"\uD83D\uDCF1 Micro Compact Badge"},{value:"ledger_strip",label:"\uD83D\uDCDC Editorial Case Strip"}],onChange:(N)=>{s({theme:{...e.snapshot.template.theme,pillStyle:N}})}}),P.append(y);let p=t("div","ls-row");p.append(t("small","ls-muted","Base Surface:"));for(let[N,_]of[["glass","Auto Glass"],["soft","Soft Card"],["sleek","Sleek Dark"],["minimal","Minimal"],["neon","Neon"],["arcane_rpg","Arcane RPG"],["cyber_hud","Cyber HUD"],["persona_pop","Pop Sim"],["cozy_vn","Cozy VN"]]){let D=R(_,()=>{s({theme:{...e.snapshot.template.theme,surfaceStyle:N}})},"ls-btn-sm");if((a.theme.surfaceStyle||"glass")===N)D.setAttribute("aria-current","page");p.append(D)}let l=t("div","ls-row");l.append(t("small","ls-muted","Frame & Bars:"));for(let[N,_]of[["rounded","Rounded"],["chamfered","Angled"],["ornate","Ornate"],["sharp","Sharp"]]){let D=R(_,()=>{s({theme:{...e.snapshot.template.theme,frameShape:N}})},"ls-btn-sm");if((a.theme.frameShape||"rounded")===N)D.setAttribute("aria-current","page");l.append(D)}for(let[N,_]of[["smooth","Gradient Bar"],["segmented","Segmented Bar"],["glow","Neon Glow Bar"]]){let D=R(_,()=>{s({theme:{...e.snapshot.template.theme,meterStyle:N}})},"ls-btn-sm");if((a.theme.meterStyle||"smooth")===N)D.setAttribute("aria-current","page");l.append(D)}let b=t("div","ls-row");b.append(t("small","ls-muted","Accent Color:"));for(let[N,_]of[[void 0,"Theme Default"],[198,"Cyan"],[330,"Rose"],[38,"Gold"],[158,"Emerald"],[262,"Violet"],[350,"Crimson"]]){let D=R(_,()=>{s({theme:{...e.snapshot.template.theme,accentHue:N}})},"ls-btn-sm");if(a.theme.accentHue===N)D.setAttribute("aria-current","page");b.append(D)}let I=t("div","ls-grid"),c=(N,_,D,H,F)=>{let V=t("label","ls-label",N),O=t("input","ls-input");return O.type="number",O.min=String(D),O.max=String(H),O.value=String(_),O.addEventListener("change",()=>{F(Math.max(D,Math.min(H,Number(O.value)||_)))}),V.append(O),V};I.append(c("Widget Width (px)",a.theme.widgetWidth??460,240,1200,(N)=>{let _=e.snapshot.template.theme;if(s({theme:{..._,widgetWidth:N}}),e.widgetExpanded)e.onResizeWidgetLive?.(N,_.widgetHeight??540,!1)}),c("Widget Height (px)",a.theme.widgetHeight??540,180,900,(N)=>{let _=e.snapshot.template.theme;if(s({theme:{..._,widgetHeight:N}}),e.widgetExpanded)e.onResizeWidgetLive?.(_.widgetWidth??460,N,!1)}),c("Pill Width (px)",a.theme.pillWidth??420,220,960,(N)=>{let _=e.snapshot.template.theme;if(s({theme:{..._,pillWidth:N}}),!e.widgetExpanded)e.onResizeWidgetLive?.(N,_.pillHeight??92,!1)}));let k=t("div","ls-grid");for(let[N,_,D]of[["Frosted Glass Blur",a.theme.glassBlur!==!1,(H)=>s({theme:{...e.snapshot.template.theme,glassBlur:H}})],["Compact Card Density",Boolean(a.theme.compact),(H)=>s({theme:{...e.snapshot.template.theme,compact:H}})],["Expand Inline Ribbon by Default",Boolean(a.theme.inlineDefaultExpanded),(H)=>{e.inlineExpanded=H,s({theme:{...e.snapshot.template.theme,inlineDefaultExpanded:H}})}],["Icon-Only Widget Tabs",Boolean(a.theme.widgetTabsIconOnly),(H)=>s({theme:{...e.snapshot.template.theme,widgetTabsIconOnly:H}})],["All Cast Cards Expanded",(a.theme.castLayout||"roster")==="cards",(H)=>s({theme:{...e.snapshot.template.theme,castLayout:H?"cards":"roster"}})]]){let H=t("div");xe(e,n,H,{checked:_,label:N,onChange:D}),k.append(H)}P.append(p,l,b,I,k);let E=t("div");return i.append(E),fe(e,n,E,{title:"Canon Story Premise (Optional Turn-1 Setup)",iconName:"edit",badge:u.canonPremise?"Set":void 0,defaultExpanded:Boolean(u.canonPremise),persistKey:"studio_templates_premise"}).append(t("p","ls-muted",u.canonPremise||"No custom premise set. Lumi Stats automatically calibrates from your Character Card, Persona, and Opening Message on Turn 1."),R("Open Full-Screen Premise Editor",()=>{e.request("textEditor:open",{title:"Canon Story Premise (Lumi Stats)",value:u.canonPremise||"",placeholder:"Write established relationships, roles, or world rules…"}).then((N)=>{if(!N.cancelled&&typeof N.text==="string")e.request("state:mutate",{stateOverride:{canonPremise:N.text.trim()},reason:"Updated canon premise"})})},"ls-btn-sm ls-btn-primary")),i}var Ee="quickstart",Rt="hud",_e=!1,ve=null,on="",Je=null;function Ks(e,n){let a=e.toLowerCase().replace(/[^a-z0-9_-]+/g,"_")||"lumi_stats_template",s=new Blob([JSON.stringify(n,null,2)],{type:"application/json"}),o=URL.createObjectURL(s),r=document.createElement("a");r.href=o,r.download=`${a}.lumi-stats.json`,document.body.append(r),r.click(),r.remove(),URL.revokeObjectURL(o)}function Wn(e){if(Je)Je.cleanup(),Je=null;_e=!1,ve=null,on=e.snapshot.template.id,e.request("snapshot:get").catch(()=>{return});let n=new Ve;if(typeof e.ctx.ui?.mountApp==="function")try{let a=e.ctx.ui.mountApp({className:"ls-studio-mount",position:"app-overlay"});a.setVisible(!0),Gs(e,a,n);return}catch(a){console.warn("[LumiStats Studio] mountApp error, using modal fallback:",a),n.clear()}Zs(e)}function Gs(e,n,a){console.log("[LumiStats Studio] setupAppOverlay: mounting full-window Studio via mountApp"),e.studioOpen=!0,e.emitChange();let s=()=>{if(!Je)return;_e=!1,ve=null;let g=Je;Je=null,e.activeOverlayCleanup=null,e.studioOpen=!1,e.emitChange(),g.cleanup()},o=(g)=>{if(g.key!=="Escape")return;if(g.defaultPrevented||e.modals.hasOpenModals()||document.body.querySelector('.ls-dd-menu[data-ls-dd-open="true"]'))return;s()};window.addEventListener("keydown",o);let r=(g=!1)=>{Mn(n.root,()=>{a.clear();let v=[];n.root.replaceChildren(ps(e,a,s,!0,()=>r(!0),v));for(let M of v)M()},{deferIfTyping:!g,onDeferredFlush:()=>r(!0)})},u=e.subscribe(()=>r(!1)),i=e.subscribeStatus(()=>{let g=n.root.querySelector("[data-ls-studio-status]");if(g)g.textContent=e.statusText,g.style.display=e.statusText?"":"none",g.style.color=e.statusError?"var(--ls-danger)":"var(--ls-muted)"});r(!0),Je={mount:n,cleanup:()=>{window.removeEventListener("keydown",o),u(),i(),a.clear(),n.destroy()}},e.activeOverlayCleanup=s}function Zs(e){e.modals.open({title:"Lumi Stats Studio",width:1360,maxHeight:900},(n,a,s,o)=>{n.style.cssText+=";padding:0;overflow:hidden;display:flex;flex-direction:column;height:85vh;max-height:880px;container-type:inline-size;";let r=(d=!1)=>{Mn(n,()=>{o.clear();let g=[];n.replaceChildren(ps(e,o,a,!1,()=>r(!0),g));for(let v of g)v()},{deferIfTyping:!d,onDeferredFlush:()=>r(!0)})};r(!0);let u=e.subscribe(()=>r(!1)),i=e.subscribeStatus(()=>{let d=n.querySelector("[data-ls-studio-status]");if(d)d.textContent=e.statusText,d.style.display=e.statusText?"":"none",d.style.color=e.statusError?"var(--ls-danger)":"var(--ls-muted)"});s.onDismiss(()=>{_e=!1,ve=null,u(),i()})})}function ps(e,n,a,s,o,r=[]){let{template:u}=e.snapshot,i=structuredClone(u);if(on!==i.id)on=i.id,_e=!1,ve=null;let d=e.builtinTemplates.some((l)=>l.id===i.id),g=(l,b="Updated template")=>{let I=structuredClone(e.snapshot.template),c=typeof l==="function"?l(I):l,k={...c,...c.theme?{theme:{...I.theme,...c.theme}}:{},...c.surfaces?{surfaces:{...I.surfaces,...c.surfaces}}:{}};e.request("state:mutate",{templatePatch:k,reason:b}).catch((E)=>e.notify(E instanceof Error?E.message:String(E),!0))},v=(l,b)=>{let I=b?.trim()||`${l.name} (Custom)`;e.request("template:duplicate",{sourceTemplateId:l.id,template:l,name:I,icon:l.icon,description:l.description}).then((c)=>{let k=c.template??e.snapshot.template;on=k.id,_e=!0,ve={icon:k.icon,name:k.name,description:k.description},e.notify(`Created & activated editable copy "${k.name}"!`),o()}).catch((c)=>e.notify(c instanceof Error?c.message:String(c),!0))},M=t("div",s?"ls-studio-overlay":"ls-studio-overlay ls-studio-in-modal");e.stampThemeOnElement(M);let h=t("header","ls-studio-topbar"),x=t("div","ls-row");x.append(t("span","ls-brand-mark","L"),t("strong","","Lumi Stats Studio"),t("span","ls-chip ls-chip-accent",`${i.icon} ${i.name}`),t("span","ls-chip",d?"Built-In":"Custom"));let L=t("span","ls-chip",e.statusText);if(L.setAttribute("data-ls-studio-status","true"),!e.statusText)L.style.display="none";if(e.statusError)L.style.color="var(--ls-danger)";let T=t("div","ls-row");T.append(L,Q("plus",()=>Tt(e,o),{label:"New",className:"ls-btn-sm",title:"Create a new template"}),R("Save to Library",()=>{let l=e.snapshot.template;e.request("template:saveToLibrary",{name:l.name,icon:l.icon,description:l.description}).then(()=>e.notify(`Saved "${l.name}" to your Template Library.`)).catch((b)=>e.notify(b instanceof Error?b.message:String(b),!0))},"ls-btn-sm ls-btn-primary"),R("Export",()=>Ks(i.name,i),"ls-btn-sm"),Q("close",a,{label:"Close",className:"ls-btn-sm ls-btn-danger",title:"Close Studio (Esc)"})),h.append(x,T),M.append(h);let A=t("div","ls-studio-workspace"),w=t("nav","ls-studio-sidebar"),f=[{id:"quickstart",title:"1. Templates & Look",sub:"Presets, placement & skin"},{id:"stats",title:"2. Stats & Built-Ins",sub:"Meters, Scene Pill & prompts"},{id:"extreme",title:"3. Tabs & Surfaces",sub:"HUD, Inline & Dossier layout"},{id:"stage_assets",title:"4. Stage Sprites",sub:"Sprites & time backdrops"},{id:"prose",title:"5. Prose & Cipher",sub:"Braille cleaner & word cipher"},{id:"engine",title:"6. AI & Connections",sub:"Models, Cortex & debug"}];for(let l of f){let b=t("button","ls-studio-nav-btn");if(b.type="button",Ee===l.id)b.setAttribute("aria-current","page");b.append(t("span","ls-studio-nav-title",l.title),t("span","ls-studio-nav-sub",l.sub)),b.addEventListener("click",()=>{Ee=l.id,o()}),w.append(b)}A.append(w);let C=t("main","ls-studio-pane");if(Ee==="quickstart"||Ee==="stats"||Ee==="extreme"){let l=t("section","ls-hero-banner"),b=t("div","ls-row-between"),I=t("div");I.append(t("span","ls-kicker",d?"Built-In Preset":"Custom Saved Template"),t("h2","",`${i.icon} ${i.name}`),t("p","ls-muted",i.description));let c=t("div","ls-row");if(c.append(Q("copy",()=>v(i),{label:"Duplicate & Edit",className:"ls-btn-sm ls-btn-primary"}),Q("edit",()=>{_e=!_e,ve=_e?{icon:i.icon,name:i.name,description:i.description}:null,o()},{label:_e?"Hide Rename":"Rename",className:"ls-btn-sm"})),b.append(I,c),l.append(b),_e){ve??={icon:i.icon,name:i.name,description:i.description};let k=t("div","ls-grid"),E=t("label","ls-label","Icon Emoji"),B=t("input","ls-input");B.value=ve.icon,B.addEventListener("input",()=>{if(ve)ve.icon=B.value}),E.append(B);let N=t("label","ls-label","Template Name"),_=t("input","ls-input");_.value=ve.name,_.addEventListener("input",()=>{if(ve)ve.name=_.value}),N.append(_);let D=t("label","ls-label","Description"),H=t("input","ls-input");H.value=ve.description,H.addEventListener("input",()=>{if(ve)ve.description=H.value}),D.append(H),k.append(E,N,D);let F=R("Save Template Name & Info",()=>{let V=_.value.trim()||i.name,O=B.value.trim()||"✨",W=H.value.trim()||i.description;F.disabled=!0,F.textContent="Saving…",e.request("template:saveToLibrary",{name:V,icon:O,description:W}).then(()=>{_e=!1,ve=null,e.notify(`Saved template "${V}".`),o()}).catch((q)=>{if(e.notify(q instanceof Error?q.message:String(q),!0),F.isConnected)F.disabled=!1,F.textContent="Save Template Name & Info"})},"ls-btn-sm ls-btn-primary");l.append(k,F)}C.append(l)}if(Ee==="quickstart")C.append(ds(e,n,i,g,v,o));else if(Ee==="stats")C.append(ls(e,n,i,g,o));else if(Ee==="extreme")C.append(cs(e,n,i,g,o));else if(Ee==="stage_assets")C.append(Qa(e,o));else if(Ee==="prose")C.append(ss(e,n));else if(Ee==="engine")C.append(rs(e,n,r));A.append(C);let P=t("aside","ls-studio-preview-pane"),S=t("section","ls-card"),y=t("div","ls-row-between");y.append(t("span","ls-kicker","Live Preview"));let m=t("div","ls-row");for(let[l,b]of[["hud","HUD"],["pill","Pill"],["inline","Inline"],["dossier","Dossier"]]){let I=R(b,()=>{Rt=l,o()},"ls-btn-sm");if(Rt===l)I.setAttribute("aria-current","page");m.append(I)}y.append(m),S.append(y);let p=t("div");if(p.style.marginTop="6px",Rt==="hud")p.style.height="470px",p.append(yt(e,!1,()=>{return},(l)=>Ye(e,l),()=>{return},n));else if(Rt==="pill")p.style.height="104px",p.append(yt(e,!0,()=>{return},(l)=>Ye(e,l),()=>{return},n));else if(Rt==="inline"){let l=e.inlineExpanded;e.inlineExpanded=!0;let b=es(e,(I)=>Ye(e,I),()=>{return});e.inlineExpanded=l,p.append(b)}else{let l=e.dossierEditMode;e.dossierEditMode=!1;let b=On(e,n);e.dossierEditMode=l,p.append(b)}return S.append(p),P.append(S),A.append(P),M.append(A),M}function us(e,n,a,s){try{let o=new Ve,r=n.snapshot.template.theme,u=()=>({w:Math.max(240,Math.min(1200,n.snapshot.template.theme.widgetWidth??460)),h:Math.max(180,Math.min(900,n.snapshot.template.theme.widgetHeight??540))}),i=()=>({w:Math.max(220,Math.min(960,n.snapshot.template.theme.pillWidth??420)),h:Math.max(56,Math.min(220,n.snapshot.template.theme.pillHeight??92))}),d=e.ui.createFloatWidget({width:s?.width??(r.pillWidth??420),height:s?.height??(r.pillHeight??92),chromeless:s?.chromeless??!0,snapToEdge:!0,tooltip:"Lumi Stats HUD",touchScrollMode:"native"});d.root.classList.add("ls-root"),d.root.style.cssText+=";display:flex;flex-direction:column;height:100%;max-height:100%;min-height:0;overflow:hidden;background:transparent;",n.onResizeWidgetLive=(T,A,w)=>{if(d.setSize(T,A),w){let f=n.snapshot.template.theme;n.request("state:mutate",{templatePatch:{theme:n.widgetExpanded?{...f,widgetWidth:T,widgetHeight:A}:{...f,pillWidth:T,pillHeight:A}},reason:`Resized widget to ${T}×${A}`})}};let g=null,v=()=>{if(g)clearTimeout(g),g=null;if(n.widgetExpanded=!n.widgetExpanded,!!n.widgetExpanded){let{w:A,h:w}=u();d.setSize(A,w)}else{let{w:A,h:w}=i();g=setTimeout(()=>{d.setSize(A,w),g=null},180)}h()},M="",h=()=>{o.clear();let T=n.snapshot.template.theme.placement,A=!n.vnStageOpen&&!n.studioOpen&&(T==="floating_only"||T.startsWith("both_"));d.setVisible(A),n.stampThemeOnElement(d.root);let w=yt(n,!n.widgetExpanded,v,(f)=>Ye(n,f),a,o);if(d.root.replaceChildren(w),!n.widgetExpanded&&!g&&A){let f=Boolean(w.querySelector('.ls-hud-pill[data-empty-deck="true"]')),{w:C,h:P}=i(),S=f?Math.min(P,48):P,y=`${C}x${S}`;if(y!==M)M=y,d.setSize(C,S)}else M="";n.applyTemplateThemeToDom()},x=(T)=>{let A=T.detail;if(A?.extensionId&&A.extensionId!=="lumi_stats")return;n.refreshActiveChat(),h()};window.addEventListener("spindle:desktop-widget-returned",x);let L=n.subscribe(h);return h(),()=>{if(window.removeEventListener("spindle:desktop-widget-returned",x),g)clearTimeout(g);n.onResizeWidgetLive=null,L(),o.clear(),d.destroy()}}catch{return}}function Pi(e,n){e.deferReady?.();let a=[];a.push(Na(e));let s=new Ln(e);a.push(()=>s.destroy());let o=us(e,s,()=>Wn(s),n);if(o)a.push(o);return a.push(e.events.on("CHAT_SWITCHED",(r)=>{let u=r&&typeof r==="object"?r:{},i=typeof u.chatId==="string"?u.chatId:null;s.refreshActiveChat(i)})),s.refreshActiveChat(),e.ready?.(),()=>{for(let r of a.reverse())r();e.dom.cleanup()}}export{Pi as setupWidget};
