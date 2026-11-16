function wn(t){let n=t.name.trim().slice(0,80)||"Custom Group";return{id:re(t.id??n,"cat"),name:n,icon:t.icon?.trim().slice(0,8)||"\uD83D\uDCC1",color:t.color?.trim()||"var(--lumiverse-primary)",enabled:t.enabled!==!1,collapsedByDefault:Boolean(t.collapsedByDefault),showGroupHeaderInHud:t.showGroupHeaderInHud!==!1,promptTriggerMode:t.promptTriggerMode==="conditional"||t.promptTriggerMode==="manual"?t.promptTriggerMode:"always",...Array.isArray(t.promptKeywords)&&t.promptKeywords.length?{promptKeywords:[...new Set(t.promptKeywords.map((s)=>String(s).trim().toLowerCase()).filter(Boolean))].slice(0,32)}:{},...t.aiRule?.trim()?{aiRule:t.aiRule.trim()}:{},...t.localRuleFormula?.trim()?{localRuleFormula:t.localRuleFormula.trim()}:{},injectInContinuity:t.injectInContinuity!==!1,order:Number.isFinite(t.order)?Math.round(Number(t.order)):0}}function re(t,n="stat"){return String(t??"").trim().toLowerCase().replace(/['’]/g,"").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,64)||n}function ya(t,n,a){let s=n-t;if(s<=0)return[{value:t,label:"Baseline",description:"Default baseline"}];let o=(i)=>Math.round(t+s*i);return[{value:o(0.85),label:"Very High / Peak",description:"Dominant, intense, or near maximum capacity"},{value:o(0.65),label:"High / Strong",description:"Clearly elevated, strong, or well-established"},{value:o(0.45),label:"Moderate / Balanced",description:"Standard working baseline or neutral equilibrium"},{value:o(0.2),label:"Low / Guarded",description:"Mild, strained, or subdued"},{value:t,label:"None / Minimal",description:"Absent, calm baseline, or depleted"}]}function se(t){let n=re(t.id??t.label,"stat"),a=t.scope??"character",s=t.displayStyle??"auto",i=s==="pill_list"?"tags":(s==="feed_cards"||s==="step_chain"||s==="quote_callout"||s==="key_value"||s==="arc_tracker"||s==="accordion_cards"||s==="matrix_badges"||s==="meter_mini_bars"||s==="stat_pills_grid"||s==="bullet_ledger"||s==="timeline_list"||s==="checklist")&&(!t.kind||t.kind==="meter")?"text":t.kind??"meter",p=Number.isFinite(t.min)?Number(t.min):0,r=Number.isFinite(t.max)?Number(t.max):i==="clock"?6:i==="pips"||i==="hearts"?5:i==="attributes"?20:i==="currency"?99999999:100,d=t.volatility??(a==="character"?"progressive":"momentary"),g=Array.isArray(t.anchors)?t.anchors:[],v=a==="character"?"cast":a==="world"?"world":"stats",M=Boolean(t.pinnedToHeader??t.showIn?.pinnedHeader),f={widget:t.showIn?.widget??!0,inline:t.showIn?.inline??!0,dossier:t.showIn?.dossier??a==="character",pinnedHeader:M};return{id:n,label:t.label.trim().slice(0,80)||n,icon:t.icon?.trim().slice(0,8)||"\uD83D\uDCCA",scope:a,kind:i,min:Math.min(p,r),max:Math.max(p,r),step:Number.isFinite(t.step)&&Number(t.step)>0?Number(t.step):1,defaultValue:t.defaultValue!==void 0?t.defaultValue:i==="boolean"?!1:i==="skill_tree"?"SP: 2 | Basic Focus (Lv.1/5, cost:1, +10% efficiency)":i==="xp_level"?"Lv. 1 | 0/100 XP | Rank E":i==="attributes"?"STR:10, DEX:10, CON:10, INT:10, WIS:10, CHA:10":i==="inventory"?"None":i==="status_fx"?"None":i==="text"||i==="tags"||i==="tier"?t.options?.[0]??"None":Math.max(Math.min(p,r),Math.min(Math.max(p,r),0)),...t.options?.length?{options:t.options}:{},anchors:g,volatility:d,triggerCues:t.triggerCues?.trim()??"",...t.formula?.trim()?{formula:t.formula.trim()}:{},color:t.color?.trim()||"var(--lumiverse-primary)",enabled:t.enabled!==!1,locked:Boolean(t.locked),pinnedToHeader:M,displayStyle:t.displayStyle??"auto",layoutSpan:t.layoutSpan??"auto",showIn:f,tabId:t.tabId?.trim()||v,widgetTabId:t.widgetTabId?.trim()||v,inlineTabId:t.inlineTabId?.trim()||v,dossierTabId:t.dossierTabId?.trim()||"bonds",...Array.isArray(t.extraWidgetTabIds)&&t.extraWidgetTabIds.length?{extraWidgetTabIds:[...new Set(t.extraWidgetTabIds.map(String))]}:{},...Array.isArray(t.extraInlineTabIds)&&t.extraInlineTabIds.length?{extraInlineTabIds:[...new Set(t.extraInlineTabIds.map(String))]}:{},calculationMode:t.calculationMode==="local_formula"||t.calculationMode==="ai_plus_local"||t.calculationMode==="ai"?t.calculationMode:Boolean(t.formula?.trim())?"local_formula":"ai",...t.formulaOutputTemplate?.trim()?{formulaOutputTemplate:t.formulaOutputTemplate.trim()}:{},promptTriggerMode:t.promptTriggerMode==="conditional"||t.promptTriggerMode==="manual"?t.promptTriggerMode:"always",...Array.isArray(t.promptKeywords)&&t.promptKeywords.length?{promptKeywords:[...new Set(t.promptKeywords.map((x)=>String(x).trim().toLowerCase()).filter(Boolean))].slice(0,32)}:{},injectInContinuity:t.injectInContinuity!==!1,...t.categoryId?.trim()?{categoryId:t.categoryId.trim()}:{},...t.alerts?.length?{alerts:t.alerts}:{}}}function xa(){return[{id:"stats",label:"You & Scene",icon:"\uD83D\uDCCA",kind:"stats",enabled:!0,order:0},{id:"cast",label:"Cast",icon:"\uD83D\uDC65",kind:"cast",enabled:!0,order:1},{id:"web",label:"Bond Web",icon:"\uD83D\uDD78️",kind:"web",enabled:!0,order:2},{id:"map",label:"Atlas",icon:"\uD83D\uDDFA️",kind:"map",enabled:!0,order:3},{id:"world",label:"World & Clocks",icon:"\uD83C\uDF0D",kind:"world",enabled:!0,order:4}]}function gs(){return[{id:"stats",label:"Stats",icon:"\uD83D\uDCCA",kind:"stats",enabled:!0,order:0},{id:"cast",label:"Cast",icon:"\uD83D\uDC65",kind:"cast",enabled:!0,order:1},{id:"web",label:"Bond Web",icon:"\uD83D\uDD78️",kind:"web",enabled:!0,order:2},{id:"world",label:"World",icon:"\uD83C\uDF0D",kind:"world",enabled:!0,order:3}]}function bs(){return[{id:"overview",label:"Overview",icon:"✨",kind:"overview",enabled:!0,order:0,showMeters:!0,showFields:!0,showSecrets:!1,showAudit:!1,showNpcBonds:!1},{id:"bonds",label:"Player Bonds",icon:"\uD83D\uDC96",kind:"bonds",enabled:!0,order:1,showMeters:!0,showFields:!1,showSecrets:!1,showAudit:!0,showNpcBonds:!1},{id:"peer_bonds",label:"Peer Bonds (NPC↔NPC)",icon:"\uD83E\uDD1D",kind:"peer_bonds",enabled:!0,order:2,showMeters:!1,showFields:!1,showSecrets:!1,showAudit:!1,showNpcBonds:!0},{id:"loadout",label:"Attire & Loadout",icon:"\uD83D\uDC57",kind:"loadout",enabled:!0,order:3,showMeters:!1,showFields:!0,showSecrets:!1,showAudit:!1,showNpcBonds:!1},{id:"secrets",label:"Secrets & Notes",icon:"\uD83D\uDD75️",kind:"secrets",enabled:!0,order:4,showMeters:!1,showFields:!1,showSecrets:!0,showAudit:!1,showNpcBonds:!1}]}function vs(){return{widgetTabs:xa(),inlineTabs:gs(),dossierTabs:bs(),trackNpcBonds:!0,showRelationshipWeb:!0,customWidgetHtml:"",customInlineHtml:"",customDossierHtml:""}}function wt(){return{trackPlayerAttire:!0,playerAttireLabel:"Your Current Attire / Presentation",playerAttireInstruction:"Update whenever the player character changes clothing, state of dress, or physical presentation.",showPlayerAttireCard:!0,trackPlayerCondition:!0,playerConditionLabel:"Physical / Mental Condition",playerConditionInstruction:"Track physical injuries, fatigue, intoxication, disorientation, or mental state.",showPlayerConditionCard:!0,trackPlayerAction:!1,playerActionLabel:"Latest Notable Action",playerActionInstruction:"Summarize the player character’s most consequential current action.",trackSceneSummary:!0,sceneSummaryLabel:"Scene Beat Summary",sceneSummaryInstruction:"Concise 1-sentence summary of what just happened in the scene.",showSceneSummaryInWidget:!0,trackPlaces:!0,placesInstruction:"Extract new or visited locations into zones[] (building/district), places[] (room/spot with tags & brief note), and paths[].",trackQuests:!0,questsInstruction:"Track active story goals, deadlines, and sub-objectives; mark completed when resolved.",showQuestsInWidget:!0,trackDispatches:!0,dispatchesInstruction:"Log brief off-screen developments or upcoming hooks for characters not currently in the room.",showDispatchesInWidget:!0,trackNpcConditions:!0,npcConditionsInstruction:"Track short status tags on NPCs (e.g. Flustered, Armed, Injured, Hurried).",trackNpcSecrets:!0,npcSecretsInstruction:"Record discovered clues, hidden motives, or confirmed secrets per NPC.",sceneLocationInstruction:'Current specific spot and broader area formatted cleanly as "Specific Room/Spot, District/Building".',sceneTimeInstruction:'Current in-story clock time (e.g. "08:15 AM" or story-appropriate time-of-day).',sceneDateInstruction:'Current in-story date, day count, or era label (e.g. "Day 1" or "Oct 14, 2002").',sceneWeatherInstruction:'Concise weather and immediate atmosphere (e.g. "Clear", "Light Rain", "Tense Indoors").',sceneTimeFlowInstruction:'Estimate elapsed minutes ("mins") realistically for the actions in this beat.',scenePillLocked:!1,overrides:{}}}function St(){return[{id:"role_summary",label:"Role & Bond to Player",icon:"\uD83E\uDEAA",placeholder:"e.g. Loyal personal maid, Childhood rival…",instruction:"Concise role and established relationship to the player.",tabId:"overview",displayStyle:"badge",showInHudCast:!1,showInInlineCast:!1,enabled:!0,locked:!1},{id:"demeanor",label:"Current Demeanor & Mood",icon:"\uD83C\uDFAD",placeholder:"e.g. Flustered, Guarded, Warm…",instruction:"Current emotional demeanor and facial expression in the scene.",tabId:"overview",displayStyle:"badge",showInHudCast:!0,showInInlineCast:!1,enabled:!0,locked:!1},{id:"inner_thought",label:"Inner Monologue",icon:"\uD83D\uDCAD",placeholder:"Unspoken internal thought in this moment…",instruction:"Short first-person unspoken thought or internal reaction to the current beat.",tabId:"overview",displayStyle:"quote",showInHudCast:!0,showInInlineCast:!0,enabled:!0,locked:!1},{id:"immediate_goal",label:"Immediate Goal",icon:"\uD83C\uDFAF",placeholder:"What this character is trying to do right now…",instruction:"Immediate objective or intention in the current scene.",tabId:"overview",displayStyle:"card",showInHudCast:!1,showInInlineCast:!1,enabled:!0,locked:!1},{id:"attire_layers",label:"Current Outfit & Presentation",icon:"\uD83D\uDC57",placeholder:"Observed clothing & state of dress",instruction:"Update whenever clothing, state of undress, or physical presentation is described or changed.",tabId:"loadout",displayStyle:"card",showInHudCast:!0,showInInlineCast:!0,enabled:!0,locked:!1},{id:"carried_items",label:"Carried Items & Props",icon:"\uD83C\uDF92",placeholder:"Items in hand or on person",instruction:"Track notable items, tools, or gifts currently held or worn.",tabId:"loadout",displayStyle:"pills",showInHudCast:!1,showInInlineCast:!1,enabled:!0,locked:!1},{id:"bond_dynamic",label:"Relationship Dynamic",icon:"\uD83D\uDD17",placeholder:"Established dynamic with player",instruction:"Summarize the current interpersonal dynamic and power balance with the player.",tabId:"overview",displayStyle:"card",showInHudCast:!1,showInInlineCast:!1,enabled:!0,locked:!1}]}function ke(){return{schema:"lumi-stats-template/v1",id:"universal_companion",name:"Universal Roleplay Companion",icon:"✨",description:"Schema-driven roleplay stats with two-phase calibration for relationships, momentary situational reactions, and world progression.",promptPosition:"post_history",promptDepth:1,theme:{surfaceStyle:"glass",pillStyle:"glass_capsule",frameShape:"rounded",radiusPreset:"balanced",meterStyle:"smooth",castLayout:"roster",glowIntensity:55,glassBlur:!0,widgetWidth:460,widgetHeight:540,pillWidth:420,pillHeight:92,widgetTabsIconOnly:!1,compact:!1,placement:"both_bottom",inlineDefaultExpanded:!1,showSceneChips:{time:!0,date:!0,location:!0,weather:!0,cast:!0,pinnedStats:!0},customCss:""},tabs:xa(),surfaces:vs(),coreTrackers:wt(),categories:[],stats:[se({id:"composure",label:"Composure",icon:"\uD83E\uDDED",scope:"player",kind:"meter",min:0,max:100,defaultValue:85,volatility:"momentary",pinnedToHeader:!0,triggerCues:"85=poised, 55=masking, 30=flustered, 0=shaken; drops on teasing, undress, or pressure.",anchors:[{value:80,label:"Poised & Collected",description:"Calm, confident, and in control"},{value:55,label:"Steady / Masking",description:"Holding it together despite pressure"},{value:30,label:"Flustered / Rattled",description:"Caught off-guard, blushing, or defensive"},{value:0,label:"Shaken / Overwhelmed",description:"Completely flustered or panicking"}]}),se({id:"trust",label:"Trust",icon:"\uD83D\uDEE1️",scope:"character",kind:"meter",min:0,max:100,defaultValue:45,volatility:"progressive",pinnedToHeader:!0,dossierTabId:"bonds",triggerCues:"Calibrate: hostile=15, stranger=45, ally/family=70, confidant=90; shift on honesty/betrayal.",anchors:[{value:85,label:"Trusted Confidant",description:"Unconditional trust and deep confidence"},{value:65,label:"Open & Relying",description:"Clear trust, family familiarity, or proven ally"},{value:40,label:"Neutral / Polite",description:"Standard baseline for unproven acquaintances"},{value:20,label:"Guarded / Wary",description:"Skeptical, cautious, or holding back"},{value:0,label:"Deeply Distrustful",description:"Expects betrayal or actively hostile"}]}),se({id:"loyalty",label:"Loyalty & Devotion",icon:"⚜️",scope:"character",kind:"meter",min:0,max:100,defaultValue:50,volatility:"anchor",dossierTabId:"bonds",triggerCues:"Calibrate: rival=10, peer=45, family=75, sworn retainer/partner=90; shift on oaths/betrayal.",anchors:[{value:85,label:"Fiercely Loyal",description:"Devoted retainer, sworn protector, or deeply committed partner"},{value:65,label:"Dependable Ally",description:"Supportive family member, friend, or companion"},{value:40,label:"Cooperative",description:"Neutral or professional alignment"},{value:15,label:"Self-Interested",description:"Prioritizes own agenda; easily swayed"},{value:0,label:"Unbound / Opposed",description:"No allegiance or actively opposed"}]}),se({id:"affection",label:"Affection & Fondness",icon:"❤️",scope:"character",kind:"meter",min:0,max:100,defaultValue:45,volatility:"progressive",dossierTabId:"bonds",triggerCues:"Calibrate: cold=15, polite=45, fond friend/family=70, loving=90; shift with warmth/coldness.",anchors:[{value:85,label:"Deeply Devoted",description:"Profound love, adoration, or attachment"},{value:65,label:"Warm & Fond",description:"Genuine care, closeness, and affection"},{value:40,label:"Friendly / Neutral",description:"Amiable or neutral baseline"},{value:20,label:"Cold / Distant",description:"Aloof, irritated, or emotionally detached"},{value:0,label:"Averse / Hostile",description:"Dislike, bitterness, or rejection"}]}),se({id:"desire",label:"Desire & Attraction",icon:"\uD83D\uDD25",scope:"character",kind:"meter",min:0,max:100,defaultValue:0,volatility:"momentary",dossierTabId:"bonds",triggerCues:"0=platonic, 30=sparked, 60=intense, 85=consuming; spikes on allure, undress, touch, flirting.",anchors:[{value:80,label:"Consuming",description:"Overwhelming attraction or longing in the scene"},{value:55,label:"Intense",description:"Strong visible attraction, flustered gaze, or magnetic pull"},{value:25,label:"Sparked / Noticeable",description:"Caught off-guard by appearance, proximity, or suggestive beat"},{value:0,label:"Platonic / Dormant",description:"No active romantic or physical tension"}]}),se({id:"arousal",label:"Arousal & Fluster",icon:"\uD83D\uDC93",scope:"character",kind:"meter",min:0,max:100,defaultValue:0,volatility:"momentary",dossierTabId:"bonds",triggerCues:"0=calm, 25=blushing, 55=heated, 85=breathless; spikes on nudity/towel, skin contact, intimacy.",anchors:[{value:80,label:"Breathless / Peak",description:"Heavily aroused or physically overwhelmed"},{value:50,label:"Heated / Flushed",description:"Visibly flustered, racing pulse, or strong physical reaction"},{value:20,label:"Stirred / Blushing",description:"Initial spike from suggestive visual cue, towel, or close contact"},{value:0,label:"Composed",description:"Calm physiological state"}]}),se({id:"world_tension",label:"Scene Tension Clock",icon:"⏱️",scope:"world",kind:"clock",min:0,max:6,defaultValue:0,volatility:"progressive",widgetTabId:"world",inlineTabId:"world",triggerCues:"+1 when suspense, danger, or complications escalate; reduce when resolved."})],dossierFields:St(),updatedAt:new Date().toISOString()}}var wa=[ke(),{...ke(),id:"romance_slice_of_life",name:"Romance, Chemistry & Wardrobe",icon:"\uD83C\uDF38",description:"Focused on interpersonal chemistry, momentary blush/fluster, desire, devotion, and detailed outfit layers.",theme:{...ke().theme,surfaceStyle:"cozy_vn",pillStyle:"vn_dialogue_bar",accentHue:330,secondaryHue:200},stats:[...ke().stats.filter((t)=>t.id!=="world_tension"),se({id:"chemistry",label:"Spark & Chemistry",icon:"✨",scope:"character",kind:"meter",min:0,max:100,defaultValue:35,color:"#f472b6",volatility:"momentary",pinnedToHeader:!0,dossierTabId:"bonds",triggerCues:"0–100 scale. Rises on playful banter, shared silences, eye contact, and romantic tension; cools on awkwardness."}),se({id:"intimacy_stage",label:"Romantic Tension Clock",icon:"\uD83D\uDC97",scope:"scene",kind:"clock",min:0,max:6,defaultValue:0,color:"#f472b6",volatility:"momentary",widgetTabId:"stats",inlineTabId:"stats",triggerCues:"0–6 segments. Advances as physical proximity, vulnerability, or romantic confession builds in the scene."})]},{...ke(),id:"tactical_adventure",name:"Adventure, Party & World Clocks",icon:"⚔️",description:"Vitality, Resolve, Party Loyalty, Trust, and World Threat Clocks for fantasy or sci-fi campaigns.",stats:[se({id:"vitality",label:"Vitality",icon:"❤️",scope:"player",kind:"meter",min:0,max:100,defaultValue:100,volatility:"momentary",pinnedToHeader:!0,triggerCues:"Drops on injuries, exhaustion, or hazards; restores with medical care or rest."}),se({id:"resolve",label:"Resolve & Energy",icon:"⚡",scope:"player",kind:"meter",min:0,max:100,defaultValue:100,volatility:"momentary",pinnedToHeader:!0,triggerCues:"Spent on strenuous feats, spells, or high-stress confrontations; recovered on rest."}),...ke().stats.filter((t)=>t.scope!=="player")]},{...ke(),id:"mystery_thriller",name:"Investigation & Suspicion Ledger",icon:"\uD83D\uDD75️",description:"Tracks Case Progress, Suspect Alertness, Credibility, Pressure, and discovered clues.",stats:[se({id:"case_progress",label:"Investigation Progress",icon:"\uD83D\uDD0E",scope:"player",kind:"meter",min:0,max:100,defaultValue:0,volatility:"progressive",pinnedToHeader:!0,triggerCues:"Increases as physical clues, motives, and alibi contradictions are uncovered."}),se({id:"suspicion",label:"Suspicion & Guilt",icon:"\uD83D\uDC41️",scope:"character",kind:"meter",min:0,max:100,defaultValue:15,volatility:"progressive",pinnedToHeader:!0,triggerCues:"Calibrate from initial evidence; increase on lies, evasions, or incriminating discoveries."}),se({id:"pressure",label:"Interrogation Pressure",icon:"\uD83D\uDCA2",scope:"character",kind:"clock",min:0,max:6,defaultValue:0,volatility:"momentary",triggerCues:"Advance when cornered with evidence or tough questioning; drops when given breathing room."}),se({id:"alert_clock",label:"Danger / Alert Clock",icon:"\uD83D\uDEA8",scope:"world",kind:"clock",min:0,max:6,defaultValue:0,volatility:"momentary",pinnedToHeader:!0,widgetTabId:"world",inlineTabId:"world",triggerCues:"Advances by +1 when making noise, tipping off suspects, or triggering alarms."})]},{...ke(),id:"litrpg_skill_tree",name:"LitRPG System, Skill Trees & Gear",icon:"⚔️",description:"Full game HUD with HP/MP, XP & Leveling, Skill Points & Interactive Skill Tree, Core Attributes, Buffs/Debuffs, and Rarity Gear.",theme:{...ke().theme,surfaceStyle:"arcane_rpg",frameShape:"ornate",meterStyle:"glow",accentHue:42,secondaryHue:198},stats:[se({id:"hp",label:"Health (HP)",icon:"❤️",scope:"player",kind:"meter",min:0,max:100,defaultValue:100,color:"#f43f5e",volatility:"momentary",pinnedToHeader:!0,triggerCues:"Drops on damage, traps, or exhaustion; recovers via healing, potions, or rest."}),se({id:"mp",label:"Mana / Stamina",icon:"\uD83D\uDCA0",scope:"player",kind:"meter",min:0,max:100,defaultValue:100,color:"#38bdf8",volatility:"momentary",pinnedToHeader:!0,triggerCues:"Spent when casting spells or using active skills; regenerates during recovery."}),se({id:"xp_level",label:"Level & XP",icon:"⭐",scope:"player",kind:"xp_level",defaultValue:"Lv. 1 | 0/100 XP | Rank E",color:"#f59e0b",volatility:"progressive",triggerCues:'Format: "Lv. N | cur/next XP | Rank X". Award XP on victories, discoveries, and milestones; level up when cur >= next.'}),se({id:"gold",label:"Gold Coins",icon:"\uD83E\uDE99",scope:"player",kind:"currency",min:0,max:99999999,defaultValue:100,color:"#f59e0b",volatility:"progressive",triggerCues:"Track player currency/gold. Adjust via +N / -N on purchases, rewards, or loot."}),se({id:"attributes",label:"Core Attributes",icon:"\uD83E\uDDEC",scope:"player",kind:"attributes",min:1,max:30,defaultValue:"STR:10, DEX:10, CON:10, INT:10, WIS:10, CHA:10",color:"#818cf8",layoutSpan:"full",volatility:"anchor",triggerCues:'Comma-separated stats: "STR:N, DEX:N, CON:N, INT:N, WIS:N, CHA:N". Update when training or leveling.'}),se({id:"skill_tree",label:"Skill Tree & SP",icon:"\uD83C\uDF33",scope:"player",kind:"skill_tree",defaultValue:"SP: 2 | Combat Sense (Lv.1/5, cost:1, +10% Eva) ; Arcane Spark (Lv.0/5, cost:1, req:Combat Sense)",color:"#10b981",layoutSpan:"full",volatility:"progressive",triggerCues:'Format: "SP: N | Skill A (Lv.X/Y, cost:1, bonus) ; Skill B (Lv.X/Y, cost:1, req:Skill A)". Grant SP on level-ups or breakthroughs.'}),se({id:"status_fx",label:"Buffs & Debuffs",icon:"⚡",scope:"player",kind:"status_fx",defaultValue:"None",color:"#2dd4bf",layoutSpan:"full",volatility:"momentary",triggerCues:'Prefix buffs with "+" and debuffs with "-" separated by "; ", e.g. "+Barrier (3t) ; -Bleeding (2t)".'}),se({id:"inventory",label:"Gear & Inventory",icon:"\uD83C\uDF92",scope:"player",kind:"inventory",defaultValue:"Traveler Blade [common, equipped] ; Ration x2 [common]",color:"#a78bfa",layoutSpan:"full",volatility:"progressive",triggerCues:'List items separated by "; " with qty & rarity tags, e.g. "Runed Dagger [rare, equipped] ; Potion x3 [common]".'}),...ke().stats.filter((t)=>t.scope==="character"||t.scope==="world")]},{...ke(),id:"persona_social_sim",name:"Stylish Social Sim & Confidants",icon:"\uD83C\uDCCF",description:"High-contrast social sim HUD with Confidant Heart ranks, Social Stats (Charm/Courage/Knowledge), and stylish badges.",theme:{...ke().theme,surfaceStyle:"persona_pop",frameShape:"sharp",meterStyle:"segmented",accentHue:348,secondaryHue:45},stats:[se({id:"social_stats",label:"Social Qualities",icon:"⭐",scope:"player",kind:"attributes",min:1,max:10,defaultValue:"Knowledge:2, Charm:2, Courage:2, Kindness:2, Proficiency:2",color:"#f43f5e",layoutSpan:"full",volatility:"progressive",triggerCues:'Comma-separated 1–10 qualities: "Knowledge:N, Charm:N, Courage:N, Kindness:N, Proficiency:N".'}),se({id:"composure",label:"Cool / Composure",icon:"\uD83C\uDFAD",scope:"player",kind:"meter",min:0,max:100,defaultValue:85,color:"#facc15",volatility:"momentary",pinnedToHeader:!0,triggerCues:"85=stylish, 55=steady, 30=rattled, 0=flustered."}),se({id:"bond_hearts",label:"Confidant Bond Rank",icon:"❤️",scope:"character",kind:"hearts",min:0,max:10,defaultValue:3,color:"#f472b6",volatility:"progressive",pinnedToHeader:!0,triggerCues:"0–10 heart rank. Increases on meaningful hangouts, honesty, or breakthroughs."}),...ke().stats.filter((t)=>t.scope==="character"||t.scope==="world")]}],Vt=[{schema:"lumi-stats-skin/v1",name:"Adaptive Lumiverse Glass",surfaceStyle:"glass",frameShape:"rounded",meterStyle:"smooth",glowIntensity:45,glassBlur:!0,castLayout:"roster"},{schema:"lumi-stats-skin/v1",name:"Arcane Fantasy RPG",surfaceStyle:"arcane_rpg",frameShape:"ornate",meterStyle:"glow",accentHue:42,secondaryHue:198,glowIntensity:70,glassBlur:!0,castLayout:"roster"},{schema:"lumi-stats-skin/v1",name:"Cyber Tactical HUD",surfaceStyle:"cyber_hud",frameShape:"chamfered",meterStyle:"segmented",accentHue:190,secondaryHue:315,glowIntensity:85,glassBlur:!0,castLayout:"roster"},{schema:"lumi-stats-skin/v1",name:"Stylish Social Sim (Pop)",surfaceStyle:"persona_pop",frameShape:"sharp",meterStyle:"segmented",accentHue:348,secondaryHue:48,glowIntensity:60,glassBlur:!1,castLayout:"roster"},{schema:"lumi-stats-skin/v1",name:"Cozy Visual Novel",surfaceStyle:"cozy_vn",frameShape:"rounded",meterStyle:"smooth",accentHue:330,secondaryHue:200,glowIntensity:40,glassBlur:!0,castLayout:"roster"}];function Sa(t){return{schema:"lumi-stats-skin/v1",name:`${t.name} Skin`,surfaceStyle:t.theme.surfaceStyle??"glass",frameShape:t.theme.frameShape??(t.theme.radiusPreset==="sharp"?"sharp":"rounded"),meterStyle:t.theme.meterStyle??"smooth",...t.theme.accentHue!==void 0?{accentHue:t.theme.accentHue}:{},...t.theme.secondaryHue!==void 0?{secondaryHue:t.theme.secondaryHue}:{},glowIntensity:t.theme.glowIntensity??55,glassBlur:t.theme.glassBlur!==!1,compact:Boolean(t.theme.compact),castLayout:t.theme.castLayout??"roster",...t.theme.customCss?{customCss:t.theme.customCss}:{}}}function ka(t){let n=t&&typeof t==="object"?t:{},s=new Set(["glass","soft","sleek","minimal","neon","arcane_rpg","cyber_hud","persona_pop","cozy_vn"]).has(String(n.surfaceStyle))?n.surfaceStyle:"glass",o=n.frameShape==="chamfered"||n.frameShape==="sharp"||n.frameShape==="ornate"?n.frameShape:"rounded",i=n.meterStyle==="segmented"||n.meterStyle==="glow"?n.meterStyle:"smooth",p=n.castLayout==="cards"?"cards":"roster",r=typeof n.accentHue==="number"&&Number.isFinite(n.accentHue)?Math.max(0,Math.min(360,Math.round(n.accentHue))):void 0,d=typeof n.secondaryHue==="number"&&Number.isFinite(n.secondaryHue)?Math.max(0,Math.min(360,Math.round(n.secondaryHue))):void 0,g=typeof n.glowIntensity==="number"&&Number.isFinite(n.glowIntensity)?Math.max(0,Math.min(100,Math.round(n.glowIntensity))):55;return{schema:"lumi-stats-skin/v1",name:String(n.name??"Imported Skin").trim().slice(0,80)||"Imported Skin",surfaceStyle:s,frameShape:o,meterStyle:i,...r!==void 0?{accentHue:r}:{},...d!==void 0?{secondaryHue:d}:{},glowIntensity:g,glassBlur:n.glassBlur!==!1,compact:Boolean(n.compact),castLayout:p,...typeof n.customCss==="string"&&n.customCss.trim()?{customCss:n.customCss.slice(0,8000)}:{}}}function Ca(t){let n={};for(let a of t.stats){if(!a.enabled||a.scope==="character")continue;n[a.id]={id:a.id,scope:a.scope,value:a.defaultValue,calibrated:!1,locked:a.locked}}return{initialized:!1,title:"Uncharted Story",canonPremise:"",turnCount:0,elapsedMinutes:0,scene:{location:"",timeLabel:"08:00 AM",dateLabel:"Day 1",weather:"Clear",beatSummary:""},player:{name:"",attire:"",condition:"Normal",notableAction:""},currentPlaceId:"",stats:n,modifiers:[],characters:{},mapZones:{},places:{},mapPaths:[],quests:{},dispatches:[],auditLog:[]}}var Sn="lumi_stats/v1";var ys={sync:'<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.85 1 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z"/>',trash:'<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',copy:'<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',chevronDown:'<path d="m6 9 6 6 6-6"/>',chevronUp:'<path d="m18 15-6-6-6 6"/>',more:'<circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/><circle cx="5" cy="12" r="1.2"/>',plus:'<path d="M12 5v14"/><path d="M5 12h14"/>',pin:'<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1Z"/>',lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',unlock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',sliders:'<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',stage:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m10 9 5 3-5 3Z"/>',stats:'<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',network:'<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M10.8 7.2 6.2 16.8"/><path d="m13.2 7.2 4.6 9.6"/><path d="M7.5 19h9"/>',map:'<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>',globe:'<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"/>',eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',eyeOff:'<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>',check:'<polyline points="20 6 9 17 4 12"/>',close:'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',volume:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',flask:'<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',resize:'<path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/>',palette:'<circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2Z"/>',sparkles:'<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>'};function kn(t,n=14){let s=document.createElementNS("http://www.w3.org/2000/svg","svg");return s.setAttribute("viewBox","0 0 24 24"),s.setAttribute("width",String(n)),s.setAttribute("height",String(n)),s.setAttribute("fill","none"),s.setAttribute("stroke","currentColor"),s.setAttribute("stroke-width","1.9"),s.setAttribute("stroke-linecap","round"),s.setAttribute("stroke-linejoin","round"),s.setAttribute("aria-hidden","true"),s.classList.add("ls-svg-icon"),s.innerHTML=ys[t],s}var Cn=/(<(?:lumi-stats|lumi-tracker|worldweave|json|style|script|pre|code)\b[\s\S]*?<\/(?:lumi-stats|lumi-tracker|worldweave|json|style|script|pre|code)\s*>|```[\s\S]*?```)/gi;function Ta(t){let n=2166136261;for(let a=0;a<t.length;a++)n^=t.charCodeAt(a),n=Math.imul(n,16777619);return(n>>>0).toString(36)}function jt(t){if(!t||typeof t!=="string")return"";let n=(a)=>{let s=a;return s=s.replace(/[\u2800\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g," "),s=s.replace(/[\u180E\u200B-\u200D\u2060\uFEFF]/g,""),s=s.replace(/^[ \t]+(\*[^\s*]|-[^\s\-]|[^\s\-*#+>0-9`~])/gm,"$1"),s=s.replace(/^[ \t]{4,}(?=[-*+]\s|\d+\.\s|>)/gm,"  "),s=s.replace(/[ \t]+\n/g,`
`),s=s.replace(/([^\n \t])[ \t]{2,}([^\n \t])/g,"$1 $2"),s=s.replace(/\n{3,}/g,`

`),s};return t.split(Cn).map((a,s)=>s%2===1?a:n(a)).join("")}function Ia(t){return t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function kt(t){if(!Array.isArray(t))return[];let n=new Set;for(let a of t){let s=String(a??"").trim().toLowerCase();if(s.length>=2&&s.length<=64)n.add(s)}return[...n].sort((a,s)=>s.length-a.length)}function Tn(t,n=!0){let a=n?"1":"*";return t.replace(/[aeiouAEIOU]/g,a)}function Ma(t,n,a=!0){if(!t||typeof t!=="string")return"";let s=kt(n);if(!s.length)return t;let o=new RegExp(`(?<![\\p{L}\\p{N}_])(?:${s.map(Ia).join("|")})(?![\\p{L}\\p{N}_])`,"giu");return t.split(Cn).map((i,p)=>p%2===1?i:i.replace(o,(r)=>Tn(r,a))).join("")}function xs(t,n=!0){let a=String(t??"").trim().toLowerCase();if(a.length<2||!/[aeiou]/i.test(a))return null;let s=[...a],o=s.map((v)=>{if(/[aeiou]/i.test(v))return`[${v}${v.toUpperCase()}1*]`;if(/[a-z]/i.test(v))return`[${v}${v.toUpperCase()}]`;return Ia(v)}),i=s[0],p=/[a-z]/i.test(i)&&!/[aeiou]/i.test(i);if(p)o[0]=`([${i}${i.toUpperCase()}])`;let d=`(?=[\\p{L}\\p{N}*'\\- ]{0,${Math.max(0,s.length-1)}}[1*])`,g=s.length>=4?"(?=[a-zA-Z]{0,10}(?![\\p{L}\\p{N}_]))":"(?![\\p{L}\\p{N}_])";return{word:a,findRegex:`(?<![\\p{L}\\p{N}_])${d}${o.join("")}${g}`,replaceString:p?`$1${a.slice(1)}`:a,flags:p?"gu":"giu"}}function La(t,n,a=!0){if(!t||typeof t!=="string")return"";let s=kt(n);if(!s.length)return t;let o=s.map((p)=>{let r=xs(p,a);if(!r)return null;try{return{word:r.word,regex:new RegExp(r.findRegex,r.flags)}}catch{return null}}).filter((p)=>Boolean(p));if(!o.length)return t;let i=(p,r)=>{let d=p.replace(/[^a-zA-Z]/g,"");if(d.length>1&&d===d.toUpperCase())return r.toUpperCase();if(p[0]&&p[0]===p[0].toUpperCase()&&p[0]!==p[0].toLowerCase())return r.charAt(0).toUpperCase()+r.slice(1);return r};return t.split(Cn).map((p,r)=>{if(r%2===1)return p;let d=p;for(let g of o)d=d.replace(g.regex,(v)=>i(v,g.word));return d}).join("")}var ws="lumi_stats_tts_cache_v1",st="clips",Ss=60,ks=80;class In{connectionsCache=null;voicesByConnId=new Map;memUrlCache=new Map;inFlightSynth=new Map;dbPromise=null;activeAudio=null;playToken=0;isPlaying=!1;activeSpeakerLabel="";cacheHitCount=0;openDb(){if(this.dbPromise)return this.dbPromise;if(typeof indexedDB>"u")return Promise.resolve(null);return this.dbPromise=new Promise((t)=>{try{let n=indexedDB.open(ws,1);n.onupgradeneeded=()=>{let a=n.result;if(!a.objectStoreNames.contains(st))a.createObjectStore(st,{keyPath:"key"})},n.onsuccess=()=>t(n.result),n.onerror=()=>t(null)}catch{t(null)}}),this.dbPromise}async listConnections(t=!1){if(this.connectionsCache&&!t)return this.connectionsCache;try{let n=await fetch("/api/v1/tts-connections?limit=25",{credentials:"include"});if(!n.ok)return this.connectionsCache??[];let a=await n.json(),s=Array.isArray(a?.data)?a.data:[];return this.connectionsCache=s.map((o)=>({id:String(o.id??""),name:String(o.name??"TTS Connection"),provider:String(o.provider??""),model:String(o.model??""),voice:String(o.voice??""),is_default:Boolean(o.is_default)})),this.connectionsCache}catch{return this.connectionsCache??[]}}async listVoicesForConnection(t){if(!t)return[];let n=this.voicesByConnId.get(t);if(n)return n;try{let a=await fetch(`/api/v1/tts-connections/${encodeURIComponent(t)}/voices`,{credentials:"include"});if(!a.ok)return[];let s=await a.json(),i=(Array.isArray(s?.voices)?s.voices:Array.isArray(s?.data)?s.data:Array.isArray(s)?s:[]).map((p)=>({id:String(p.id??p.voice_id??p.name??""),name:String(p.name??p.label??p.id??""),...typeof p.gender==="string"?{gender:p.gender}:{}})).filter((p)=>Boolean(p.id));return this.voicesByConnId.set(t,i),i}catch{return[]}}rememberMemUrl(t,n){let a=this.memUrlCache.get(t);if(a&&a!==n&&a.startsWith("blob:"))try{URL.revokeObjectURL(a)}catch{}this.memUrlCache.delete(t);while(this.memUrlCache.size>=Ss){let s=this.memUrlCache.keys().next().value;if(!s)break;let o=this.memUrlCache.get(s);if(o?.startsWith("blob:"))try{URL.revokeObjectURL(o)}catch{}this.memUrlCache.delete(s)}this.memUrlCache.set(t,n)}async readFromIdbCache(t){let n=await this.openDb();if(!n)return null;return new Promise((a)=>{try{let o=n.transaction(st,"readonly").objectStore(st).get(t);o.onsuccess=()=>{let i=o.result;a(i?.blob instanceof Blob?i.blob:null)},o.onerror=()=>a(null)}catch{a(null)}})}async writeToIdbCache(t,n){let a=await this.openDb();if(!a)return;await new Promise((s)=>{try{let o=a.transaction(st,"readwrite"),i=o.objectStore(st);i.put({key:t,blob:n,updatedAt:Date.now()});let p=i.count();p.onsuccess=()=>{if(p.result>ks){let r=i.openCursor();r.onsuccess=()=>{let d=r.result;if(d)d.delete()}}},o.oncomplete=()=>s(),o.onerror=()=>s()}catch{s()}})}async synthesizeSegmentCached(t){let n=await this.listConnections(),a=(t.connectionId?n.find((M)=>M.id===t.connectionId):void 0)??n.find((M)=>M.is_default)??n[0];if(!a?.id)return null;let s=a.id,o=t.model||a.model||"",i=t.voiceId||a.voice||"",p=t.text.trim();if(!p)return null;let r=`tts_${Ta(`${s}|${o}|${i}|${p.toLowerCase()}`)}`,d=this.memUrlCache.get(r);if(d)return this.cacheHitCount++,this.rememberMemUrl(r,d),d;let g=this.inFlightSynth.get(r);if(g)return g;let v=(async()=>{let M=await this.readFromIdbCache(r);if(M){this.cacheHitCount++;let f=URL.createObjectURL(M);return this.rememberMemUrl(r,f),f}try{let f=await fetch("/api/v1/tts/synthesize",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({connectionId:s,...o?{model:o}:{},...i?{voice:i}:{},text:p,outputFormat:"mp3"})});if(!f.ok)return null;let x=await f.blob();if(!x.size)return null;this.writeToIdbCache(r,x);let L=URL.createObjectURL(x);return this.rememberMemUrl(r,L),L}catch{return null}})();this.inFlightSynth.set(r,v);try{return await v}finally{if(this.inFlightSynth.get(r)===v)this.inFlightSynth.delete(r)}}prefetchSegments(t){for(let n of t.slice(0,3))this.synthesizeSegmentCached(n)}stop(){if(this.playToken++,this.activeAudio){try{this.activeAudio.pause(),this.activeAudio.removeAttribute("src")}catch{}this.activeAudio=null}this.isPlaying=!1,this.activeSpeakerLabel=""}async playSegments(t,n){if(this.stop(),!t.length)return n?.(),!1;let a=++this.playToken;this.isPlaying=!0,n?.();let s=t.map((o)=>this.synthesizeSegmentCached(o));for(let o=0;o<t.length;o++){if(this.playToken!==a)return!1;let i=t[o],p=await s[o];if(!p||this.playToken!==a)continue;this.activeSpeakerLabel=i.speakerName,n?.(),await new Promise((r)=>{if(this.playToken!==a){r();return}let d=new Audio(p);d.playbackRate=Math.max(0.5,Math.min(2,i.speed||1)),this.activeAudio=d,d.onended=()=>r(),d.onerror=()=>r(),d.play().catch(()=>r())})}if(this.playToken===a)return this.isPlaying=!1,this.activeSpeakerLabel="",this.activeAudio=null,n?.(),!0;return!1}destroy(){this.stop();for(let t of this.memUrlCache.values())if(t.startsWith("blob:"))try{URL.revokeObjectURL(t)}catch{}this.memUrlCache.clear(),this.inFlightSynth.clear()}}var $a=`
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
`;function e(t,n="",a){let s=document.createElement(t);if(n)s.className=n;if(a!==void 0)s.textContent=a;return s}function N(t,n,a="",s){let o=e("button",a,t);if(o.type="button",s)o.title=s,o.setAttribute("aria-label",s);return o.addEventListener("pointerdown",(i)=>{i.stopPropagation()}),o.addEventListener("click",(i)=>{i.stopPropagation(),n(i)}),o}function ee(t,n,a){let s=e("button",a?.className??"ls-btn-sm ls-btn-icon");if(s.type="button",s.append(kn(t,a?.size??14)),a?.label)s.append(e("span","",a.label));if(a?.title)s.title=a.title,s.setAttribute("aria-label",a.title);return s.addEventListener("pointerdown",(o)=>{o.stopPropagation()}),s.addEventListener("click",(o)=>{o.stopPropagation(),n(o)}),s}class ze{handles=[];track(t){return this.handles.push(t),t}clear(){for(let t of this.handles.splice(0))try{t.destroy()}catch{}}}var Pa=[".ls-drawer-body",".ls-studio-pane",".ls-studio-preview-pane",".ls-hud-content",".ls-dossier-main"],Ea=0;if(typeof document<"u")document.addEventListener("keydown",(t)=>{if(t.target instanceof HTMLInputElement||t.target instanceof HTMLTextAreaElement)Ea=Date.now()},{capture:!0,passive:!0});function Mn(t,n,a){let s=document.activeElement,o=Date.now()-Ea<1200,i=Boolean(document.body.querySelector('.ls-dd-menu[data-ls-dd-open="true"]'))||Boolean(t.querySelector('[aria-expanded="true"], [data-state="open"]'))||s instanceof HTMLElement&&t.contains(s)&&s.tagName==="SELECT";if(a?.deferIfTyping&&(o||i)&&s instanceof HTMLElement&&t.contains(s)&&(s.tagName==="INPUT"||s.tagName==="TEXTAREA")&&s.type!=="checkbox"&&s.type!=="radio"){if(a.onDeferredFlush&&!s.dataset.lsBlurDeferred){s.dataset.lsBlurDeferred="true";let d=null,g=()=>{if(d)clearTimeout(d),d=null;delete s.dataset.lsBlurDeferred,s.removeEventListener("blur",g),a.onDeferredFlush?.()};s.addEventListener("blur",g,{once:!0}),d=setTimeout(g,1250)}return!1}let p=new Map;p.set("__root__",{top:t.scrollTop,left:t.scrollLeft});for(let d of Pa){let g=t.querySelector(d);if(g)p.set(d,{top:g.scrollTop,left:g.scrollLeft})}n();let r=p.get("__root__");if(r)t.scrollTop=r.top,t.scrollLeft=r.left;for(let d of Pa){let g=p.get(d);if(!g)continue;let v=t.querySelector(d);if(v)v.scrollTop=g.top,v.scrollLeft=g.left}return!0}function J(t,n,a,s){let o=s.value,i=[...s.options],p=null,r=null,d=e("div","ls-dd-wrap");if(s.compact)d.dataset.compact="true";let g=e("button","ls-dd-trigger");if(g.type="button",g.setAttribute("aria-haspopup","listbox"),g.setAttribute("aria-expanded","false"),s.ariaLabel)g.setAttribute("aria-label",s.ariaLabel);if(s.title)g.title=s.title;let v=e("span","ls-dd-trigger-label"),M=e("span","ls-dd-caret","▾");g.append(v,M),d.append(g),a.replaceChildren(d);let f=()=>{let T=i.find((A)=>A.value===o);v.textContent=T?.label||s.placeholder||i[0]?.label||"Select…"};f();let x=()=>{if(r)r(),r=null;if(p)p.remove(),p=null;g.setAttribute("aria-expanded","false")},L=()=>{x();for(let E of[...document.body.querySelectorAll('.ls-dd-menu[data-ls-dd-open="true"]')])E.remove();let T=e("div","ls-dd-menu");T.setAttribute("role","listbox"),T.dataset.lsDdOpen="true";let A=getComputedStyle(g);for(let E of["--ls-bg","--ls-surface","--ls-text","--ls-muted","--ls-primary","--ls-border","--ls-fill","--ls-fill-hover","--ls-radius","--ls-font"]){let D=A.getPropertyValue(E).trim();if(D)T.style.setProperty(E,D)}let w=e("div","ls-dd-list"),h=null,C=(E="")=>{w.replaceChildren();let D=E.trim().toLowerCase(),H=D?i.filter((F)=>F.label.toLowerCase().includes(D)||F.sublabel&&F.sublabel.toLowerCase().includes(D)||F.value.toLowerCase().includes(D)):i;if(!H.length){let F=e("div","ls-muted","No matching options");F.style.padding="6px 8px",w.append(F);return}for(let F of H){let j=e("button","ls-dd-option");if(j.type="button",j.setAttribute("role","option"),j.setAttribute("aria-selected",String(F.value===o)),F.disabled)j.disabled=!0;if(j.append(e("span","",F.label)),F.sublabel)j.append(e("span","ls-dd-sublabel",F.sublabel));j.addEventListener("pointerdown",(O)=>{O.stopPropagation()}),j.addEventListener("click",(O)=>{O.preventDefault(),O.stopPropagation(),o=F.value,f(),x(),s.onChange(F.value)}),w.append(j)}};if(i.length>=6)h=e("input","ls-dd-search"),h.type="text",h.placeholder=s.searchPlaceholder||"Search…",h.addEventListener("pointerdown",(E)=>E.stopPropagation()),h.addEventListener("input",()=>C(h.value)),T.append(h);C(),T.append(w);let P=document.body.getBoundingClientRect(),S=P.width>0&&document.body.offsetWidth>0?P.width/document.body.offsetWidth:1,y=g.getBoundingClientRect(),u=window.innerWidth/S,l=window.innerHeight/S,m=Math.max(Math.round(y.width/S),190),b=Math.min(280,i.length*34+(h?48:16)),I=l-y.bottom/S,c=I<b+12&&y.top/S>I,k=Math.max(8,Math.min(u-m-8,Math.round(y.left/S)));if(T.style.left=`${k}px`,T.style.width=`${m}px`,c)T.style.bottom=`${Math.max(8,Math.round(l-y.top/S+4))}px`;else T.style.top=`${Math.max(8,Math.round(y.bottom/S+4))}px`;if(document.body.append(T),p=T,g.setAttribute("aria-expanded","true"),h)requestAnimationFrame(()=>h?.focus());let _=(E)=>{let D=E.target;if(!D)return;if(T.contains(D)||g.contains(D))return;x()},B=(E)=>{if(E.key==="Escape")E.stopPropagation(),x(),g.focus()},R=(E)=>{if(E.type==="resize"&&h&&document.activeElement===h)return;if(E.target instanceof Node&&T.contains(E.target))return;x()};window.addEventListener("pointerdown",_,!0),window.addEventListener("keydown",B,!0),window.addEventListener("resize",R,{passive:!0}),window.addEventListener("scroll",R,{capture:!0,passive:!0}),r=()=>{window.removeEventListener("pointerdown",_,!0),window.removeEventListener("keydown",B,!0),window.removeEventListener("resize",R),window.removeEventListener("scroll",R,!0)}};return g.addEventListener("pointerdown",(T)=>{T.stopPropagation()}),g.addEventListener("click",(T)=>{if(T.preventDefault(),T.stopPropagation(),p)x();else L()}),n?.track({destroy:x}),{getValue:()=>o,setValue:(T)=>{o=T,f()},setOptions:(T,A)=>{if(i=[...T],A!==void 0)o=A;if(f(),p)L()}}}function me(t,n,a,s){let o=e("label","ls-toggle-switch");if(s.size==="md")o.dataset.size="md";let i=e("input");if(i.type="checkbox",i.checked=s.checked,i.disabled=Boolean(s.disabled),s.ariaLabel)i.setAttribute("aria-label",s.ariaLabel);i.addEventListener("change",()=>s.onChange(i.checked));let p=e("span","ls-toggle-track");o.append(i,p),a.replaceChildren(o)}function xe(t,n,a,s){let o=e("label","ls-check-row"),i=e("input");i.type="checkbox",i.checked=s.checked,i.disabled=Boolean(s.disabled),i.addEventListener("change",()=>s.onChange(i.checked)),o.append(i,e("span","",s.label)),a.replaceChildren(o)}var Aa=new Map;function fe(t,n,a,s){let o=e("details","ls-accordion"),i=s.persistKey?Aa.get(s.persistKey):void 0;o.open=i!==void 0?i:Boolean(s.defaultExpanded);let p=e("summary","ls-accordion-head"),r=e("span","ls-row");if(s.iconName)r.append(kn(s.iconName,14));r.append(e("strong","",s.title));let d=e("span","ls-row");if(s.badge!==void 0)d.append(e("span","ls-chip",String(s.badge)));d.append(e("span","ls-accordion-chev","▾")),p.append(r,d);let g=e("div","ls-accordion-body ls-stack");return o.append(p,g),o.addEventListener("toggle",()=>{if(s.persistKey)Aa.set(s.persistKey,o.open);s.onToggle?.(o.open)}),a.append(o),g}function Ut(t,n,a,s){let o=async(d,g)=>{if(typeof t.ui?.showContextMenu!=="function")return;let v=a();if(!v.length)return;let M=await t.ui.showContextMenu({position:{x:d,y:g},items:v});if(M.selectedKey)s(M.selectedKey)};n.addEventListener("contextmenu",(d)=>{d.preventDefault(),d.stopPropagation(),o(d.clientX,d.clientY)});let i=null,p=!1,r={x:0,y:0};n.addEventListener("touchstart",(d)=>{p=!1;let g=d.touches[0];if(!g)return;r={x:g.clientX,y:g.clientY},i=setTimeout(()=>{p=!0,navigator.vibrate?.(40),o(g.clientX,g.clientY)},500)},{passive:!0}),n.addEventListener("touchmove",(d)=>{if(!i)return;let g=d.touches[0];if(!g)return;if(Math.abs(g.clientX-r.x)>10||Math.abs(g.clientY-r.y)>10)clearTimeout(i),i=null},{passive:!0}),n.addEventListener("touchend",(d)=>{if(i)clearTimeout(i),i=null;if(p)d.preventDefault(),p=!1})}class _a{ctx;activeModals=new Set;constructor(t){this.ctx=t}hasOpenModals(){return this.activeModals.size>0}open(t,n){if(typeof this.ctx.ui?.showModal!=="function"){console.warn("[LumiStats ModalManager] ctx.ui.showModal is not a function — cannot open modal");return}if(this.activeModals.size>=2)this.activeModals.values().next().value?.dismiss();let a=new ze;console.log("[LumiStats ModalManager] calling ctx.ui.showModal, title:",t.title);let s=this.ctx.ui.showModal({title:t.title,width:t.width??640,maxHeight:t.maxHeight??760,persistent:t.persistent??!1});return console.log("[LumiStats ModalManager] showModal returned handle:",s,"root connected:",s?.root?.isConnected),this.activeModals.add(s),s.root.classList.add("ls-root"),s.root.style.cssText+=";padding:16px;overflow-y:auto;height:auto;max-height:min(80vh, 740px);",s.onDismiss(()=>{a.clear(),this.activeModals.delete(s)}),n(s.root,()=>s.dismiss(),s,a),s}async confirm(t){if(typeof this.ctx.ui?.showConfirm==="function"){let n=await this.ctx.ui.showConfirm({title:t.title,message:t.message,confirmLabel:t.confirmLabel??"Confirm",variant:t.variant??"warning"});return Boolean(n?.confirmed)}return!1}closeAll(){for(let t of[...this.activeModals])t.dismiss();this.activeModals.clear()}}var Ct=new WeakMap;function Ra(t){let n=Ct.get(document);if(n)return n.count++,()=>{if(n.count--,n.count<=0)Ct.delete(document),n.remove()};let a=t.dom.addStyle($a);return Ct.set(document,{count:1,remove:a}),()=>{let s=Ct.get(document);if(!s)return;if(s.count--,s.count<=0)Ct.delete(document),s.remove()}}function Tt(t,n){t.modals.open({title:"✨ Create New Lumi Stats Template",width:520},(a,s,o,i)=>{let p=e("div","ls-grid"),r=e("label","ls-label","Icon Emoji"),d=e("input","ls-input");d.value="✨",r.append(d);let g=e("label","ls-label","Template Name"),v=e("input","ls-input");v.placeholder="e.g. Modern Drama & Chemistry, Dark Fantasy RPG…",v.value="",g.append(v),p.append(r,g);let M=e("label","ls-label","Short Description"),f=e("input","ls-input");f.placeholder="What kind of story or stats does this template track?",M.append(f);let x="universal_companion",L=e("div","ls-label","Starter Stat Blueprint"),T=e("div");L.append(T);let A=t.customTemplates.filter((b)=>!t.builtinTemplates.some((I)=>I.id===b.id)).map((b)=>({value:b.id,label:`${b.icon} ${b.name} (Saved · ${b.stats.length} stats)`}));J(t,i,T,{value:x,ariaLabel:"Starter Stat Blueprint",options:[{value:"empty",label:"\uD83E\uDDF9 Empty Canvas (0 stats — start completely from scratch)"},{value:"blank",label:"\uD83C\uDF31 Clean Minimal Starter (1 Trust meter — build your own)"},...A,...t.builtinTemplates.map((b)=>({value:b.id,label:`${b.icon} ${b.name} (${b.stats.length} stats)`}))],onChange:(b)=>{x=b}});let w="post_history",h=1,C=e("div","ls-label","\uD83E\uDDE0 AI Prompt Placement (Where Lumi State Is Sent)"),P=e("div","ls-row"),S=e("div","ls-row");S.style.display="none";let y=()=>{for(let b of[...P.querySelectorAll("button")])b.setAttribute("aria-current",b.dataset.pos===w?"page":"false");S.style.display=w==="in_history"?"flex":"none"};for(let[b,I]of[["pre_history","⬆️ Before History"],["in_history","\uD83D\uDCAC Within History"],["post_history","⬇️ After History"]]){let c=N(I,()=>{w=b,y()},"ls-btn-sm");c.dataset.pos=b,P.append(c)}let u=e("input","ls-input");u.type="number",u.min="0",u.max="20",u.style.width="76px",u.value=String(h),u.addEventListener("change",()=>{h=Math.max(0,Math.min(20,Math.round(Number(u.value)||0)))}),S.append(e("small","ls-muted","History Depth:"),u),y(),C.append(P,S);let l=e("small","ls-muted");l.style.cssText="color:var(--ls-danger);display:none;";let m=N("✨ Create & Activate Template",()=>{let b=v.value.trim()||"My Custom Template",I=d.value.trim()||"✨",c=f.value.trim()||"Custom roleplay tracker template.";m.disabled=!0,m.textContent="⏳ Creating…",l.style.display="none",t.request("template:createNew",{name:b,icon:I,description:c,starter:x,promptPosition:w,promptDepth:h}).then(()=>{t.notify(`Created & activated "${I} ${b}"!`),s(),n?.()}).catch((k)=>{if(l.textContent=k instanceof Error?k.message:String(k),l.style.display="block",m.isConnected)m.disabled=!1,m.textContent="✨ Create & Activate Template"})},"ls-btn-primary");m.style.marginTop="10px",a.append(p,M,L,C,l,m),requestAnimationFrame(()=>v.focus())})}function rt(t,n){t.modals.open({title:"\uD83C\uDFAD Quick Template, Game Skin & Placement Switcher",width:660,maxHeight:800},(a,s,o)=>{let i=()=>{let{template:r}=t.snapshot,d=[...t.builtinTemplates,...t.customTemplates.filter((y)=>!t.builtinTemplates.some((u)=>u.id===y.id))];a.replaceChildren();let g=e("div","ls-row-between");g.append(e("span","ls-kicker",`Active: ${r.icon} ${r.name}`),e("div","ls-row")),g.lastElementChild.append(N("✨ + New Template",()=>{s(),Tt(t)},"ls-btn-sm ls-btn-primary"),...n?[N("⚙️ Full Studio",()=>{s(),n()},"ls-btn-sm")]:[]),a.append(g);let v=e("div","ls-card");v.append(e("span","ls-kicker","\uD83C\uDFAE 1-Click Game Skin & Placement"));let M=e("div","ls-row");for(let y of Vt){let u=N(y.name,()=>{t.applySkinPack(y)},"ls-btn-sm");if((r.theme.surfaceStyle||"glass")===y.surfaceStyle)u.setAttribute("aria-current","page");M.append(u)}let f=e("div","ls-row");for(let[y,u]of[["both_bottom","✨ HUD + Below Reply"],["both_top","✨ HUD + Above Reply"],["inline_bottom","\uD83D\uDCAC Below Reply Only"],["floating_only","\uD83E\uDE9F Floating HUD Only"]]){let l=N(u,()=>{t.request("state:mutate",{templatePatch:{theme:{...r.theme,placement:y}},reason:"Updated placement mode"})},"ls-btn-sm");if(r.theme.placement===y)l.setAttribute("aria-current","page");f.append(l)}let x=e("div","ls-row");x.append(e("small","ls-muted","Cast Tab:"));for(let[y,u]of[["roster","\uD83D\uDC65 Icon Roster (In Scene / Away)"],["cards","\uD83D\uDDC2️ All Cards Expanded"]]){let l=N(u,()=>{t.request("state:mutate",{templatePatch:{theme:{...r.theme,castLayout:y}},reason:"Updated cast layout mode"})},"ls-btn-sm");if((r.theme.castLayout||"roster")===y)l.setAttribute("aria-current","page");x.append(l)}let L=e("div","ls-row");L.append(e("small","ls-muted","Widget Tabs:"));for(let[y,u]of[[!1,"\uD83C\uDFF7️ Icons + Text"],[!0,"✨ Icons Only"]]){let l=N(u,()=>{t.request("state:mutate",{templatePatch:{theme:{...r.theme,widgetTabsIconOnly:y}},reason:`Set widget tabs to ${y?"icons only":"icons + labels"}`})},"ls-btn-sm");if(Boolean(r.theme.widgetTabsIconOnly)===y)l.setAttribute("aria-current","page");L.append(l)}let T=e("div","ls-row");T.append(e("small","ls-muted","Send State:"));for(let[y,u]of[["pre_history","⬆️ Before History"],["in_history","\uD83D\uDCAC Within History"],["post_history","⬇️ After History"]]){let l=N(u,()=>{t.request("state:mutate",{templatePatch:{promptPosition:y},reason:`Set Lumi State prompt position to ${y}`})},"ls-btn-sm");if((r.promptPosition||"post_history")===y)l.setAttribute("aria-current","page");T.append(l)}if(r.promptPosition==="in_history"){let y=e("input","ls-input");y.type="number",y.min="0",y.max="20",y.title="History depth (messages back from end)",y.style.cssText="width:62px;min-height:27px;padding:2px 6px;font-size:11px;",y.value=String(Math.max(0,Math.round(Number(r.promptDepth??1)||0))),y.addEventListener("change",()=>{let u=Math.max(0,Math.min(20,Math.round(Number(y.value)||0)));t.request("state:mutate",{templatePatch:{promptDepth:u},reason:`Set Lumi State depth to ${u}`})}),T.append(e("small","ls-muted","Depth:"),y)}let A=e("div","ls-row");A.append(e("small","ls-muted","Pill Skin:"));let w=e("div");w.style.minWidth="210px",A.append(w),J(t,void 0,w,{value:r.theme.pillStyle||"glass_capsule",compact:!0,ariaLabel:"Collapsed Pill Skin",options:[{value:"glass_capsule",label:"✨ Frosted Split Capsule (Best)"},{value:"vn_dialogue_bar",label:"\uD83C\uDFAC VN Cinema Strip"},{value:"rpg_status_bar",label:"⚔️ JRPG Party Status Bar"},{value:"persona_ticker",label:"\uD83C\uDCCF Stylish Pop Ticker"},{value:"cyber_telemetry",label:"\uD83D\uDEF8 Cyber Telemetry"},{value:"minimal_floating",label:"☁️ Minimal Ghost Pill"},{value:"neon_edge",label:"⚡ Neon Glow Rail"},{value:"split_deck",label:"\uD83D\uDDC2️ Dual-Deck Card Pill"},{value:"compact_badge",label:"\uD83D\uDCF1 Micro Compact Badge"},{value:"ledger_strip",label:"\uD83D\uDCDC Editorial Case Strip"}],onChange:(y)=>{t.request("state:mutate",{templatePatch:{theme:{...r.theme,pillStyle:y}},reason:`Changed Pill Skin to ${y}`})}}),v.append(M,A,f,x,L,T),a.append(v);let h=d.filter((y)=>!t.builtinTemplates.some((u)=>u.id===y.id)),C=d.filter((y)=>t.builtinTemplates.some((u)=>u.id===y.id)),P=[...h,...C],S=e("div","ls-grid");S.style.marginTop="8px";for(let y of P){let u=y.id===r.id,l=!t.builtinTemplates.some((c)=>c.id===y.id),m=e("div","ls-preset-card");m.dataset.active=String(u);let b=e("div","ls-row-between");b.append(e("strong","",`${y.icon} ${y.name}`),e("span",`ls-chip ${l?"ls-chip-accent":""}`,l?"Saved Custom":"Built-In"));let I=e("div","ls-row");if(u)I.append(e("span","ls-chip ls-chip-accent","✓ Active"));else{let c=N("Activate",()=>{c.disabled=!0,c.textContent="Applying…",t.request("template:apply",{templateId:y.id,template:y}).then(()=>t.notify(`Switched to "${y.name}"`)).catch((k)=>{if(t.notify(k instanceof Error?k.message:String(k),!0),c.isConnected)c.disabled=!1,c.textContent="Activate"})},"ls-btn-sm ls-btn-primary");I.append(c)}I.append(N("\uD83D\uDCCB Duplicate",()=>{t.request("template:duplicate",{sourceTemplateId:y.id,template:y,name:`${y.name} (Custom)`}).then(()=>t.notify(`Duplicated "${y.name}"`)).catch((c)=>t.notify(c instanceof Error?c.message:String(c),!0))},"ls-btn-sm")),m.append(b,e("small","ls-muted",y.description),I),S.append(m)}a.append(S)};i();let p=t.subscribe(i);o.onDismiss(p)})}function Cs(){if(typeof crypto<"u"&&typeof crypto.randomUUID==="function")return crypto.randomUUID();if(typeof crypto<"u"&&typeof crypto.getRandomValues==="function"){let t=new Uint8Array(16);crypto.getRandomValues(t),t[6]=t[6]&15|64,t[8]=t[8]&63|128;let n=Array.from(t,(a)=>a.toString(16).padStart(2,"0")).join("");return`${n.slice(0,8)}-${n.slice(8,12)}-${n.slice(12,16)}-${n.slice(16,20)}-${n.slice(20)}`}return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(t)=>{let n=Math.random()*16|0;return(t==="x"?n:n&3|8).toString(16)})}class Ln{ctx;modals;tts=new In;chatId="";snapshot;settings;customTemplates=[];builtinTemplates=wa;connections=[];recentTurns=[];copilotTurns=[];activeProposal;busy=!1;statusText="";statusError=!1;isGenerationStreaming=!1;isDrawerTabVisible=!0;vnStageOpen=!1;studioOpen=!1;vnShowHudWidget=!0;onToggleVnStage=null;activeDrawerTab="Stats";activeSurfaceTab="stats";activeInlineTab="stats";activeDossierTab="overview";dossierEditMode=!1;webFilterMode="all";activeCopilotMode="ask";inlineExpanded=!1;widgetExpanded=!1;selectedActorId="";openedCastTabs=[];activeCastTabActorId="";selectedPlaceId="";hydratingChat=!1;activeOverlayCleanup=null;onResizeWidgetLive=null;lastThemeAppliedChatId="";customCssEl=null;pendingRpc=new Map;listeners=new Set;statusListeners=new Set;disposers=[];constructor(t){this.ctx=t;this.modals=new _a(t);let n=ke();this.snapshot={schemaVersion:1,chatId:"",revision:0,state:Ca(n),template:n,deltas:{statDeltas:{},characterDeltas:{}},bindings:[],checkpoints:[]},this.disposers.push(t.onBackendMessage((a)=>{if(!a||typeof a!=="object")return;let s=a;if(s.channel!==Sn)return;if(s.type==="rpc_ack"&&typeof s.requestId==="string"){let i=this.pendingRpc.get(s.requestId);if(i){clearTimeout(i.timer),this.pendingRpc.delete(s.requestId);let p=s;if(p.ok)i.resolve(p.data??{});else this.notify(p.error??"Operation failed",!0),i.reject(Error(p.error??"Operation failed"))}return}let o=typeof s.resolvedChatId==="string"&&s.resolvedChatId?s.resolvedChatId:typeof s.chatId==="string"&&s.chatId!=="sandbox"?s.chatId:"";if(!this.chatId&&o)this.chatId=o;if(o&&this.chatId&&o!==this.chatId)return;if(s.type==="snapshot"&&s.snapshot){this.hydratingChat=!1,this.snapshot=s.snapshot;let i=this.snapshot.template.surfaces,p=i.widgetTabs.filter((g)=>g.enabled);if(p.length&&!p.some((g)=>g.id===this.activeSurfaceTab))this.activeSurfaceTab=p[0].id;let r=i.inlineTabs.filter((g)=>g.enabled);if(r.length&&!r.some((g)=>g.id===this.activeInlineTab))this.activeInlineTab=r[0].id;let d=i.dossierTabs.filter((g)=>g.enabled);if(d.length&&!d.some((g)=>g.id===this.activeDossierTab))this.activeDossierTab=d[0].id;if(this.chatId&&this.lastThemeAppliedChatId!==this.chatId)this.lastThemeAppliedChatId=this.chatId,this.inlineExpanded=Boolean(this.snapshot.template.theme.inlineDefaultExpanded);if(this.selectedActorId&&!this.snapshot.state.characters[this.selectedActorId])this.selectedActorId="";if(this.openedCastTabs=this.openedCastTabs.filter((g)=>Boolean(this.snapshot.state.characters[g])),this.activeCastTabActorId&&!this.snapshot.state.characters[this.activeCastTabActorId])this.activeCastTabActorId="";if(this.selectedPlaceId&&!this.snapshot.state.places[this.selectedPlaceId])this.selectedPlaceId="";if(s.settings){if(this.settings=s.settings,typeof this.settings.vnShowHudWidget==="boolean")this.vnShowHudWidget=this.settings.vnShowHudWidget}if(Array.isArray(s.customTemplates))this.customTemplates=s.customTemplates;if(Array.isArray(s.copilotTurns))this.copilotTurns=s.copilotTurns;this.busy=s.busy===!0,this.applyTemplateThemeToDom(),this.emitChange(),this.emitStatusChange()}else if(s.type==="status")this.busy=s.busy===!0,this.statusText=String(s.text??""),this.statusError=!1,this.emitStatusChange();else if(s.type==="error")this.busy=!1,this.notify(String(s.message??"Error"),!0)}))}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}subscribeStatus(t){return this.statusListeners.add(t),()=>this.statusListeners.delete(t)}applySkinPack(t){let n=ka(t),a=this.snapshot.template.theme;this.request("state:mutate",{templatePatch:{theme:{...a,surfaceStyle:n.surfaceStyle,frameShape:n.frameShape,meterStyle:n.meterStyle,accentHue:n.accentHue,secondaryHue:n.secondaryHue,glowIntensity:n.glowIntensity??55,glassBlur:n.glassBlur!==!1,compact:Boolean(n.compact),castLayout:n.castLayout??a.castLayout??"roster",...n.customCss!==void 0?{customCss:n.customCss}:{}}},reason:`Applied visual skin "${n.name}"`}),this.notify(`Applied "${n.name}" visual skin!`)}stampThemeOnElement(t){let n=this.snapshot.template.theme,a=n.surfaceStyle||"glass",s=n.frameShape||(n.radiusPreset==="sharp"?"sharp":"rounded"),o=n.meterStyle||"smooth",i=n.glassBlur!==!1,p=Math.max(0,Math.min(100,Number(n.glowIntensity??55)))/100,r=Boolean(n.compact),d=typeof n.accentHue==="number"&&Number.isFinite(n.accentHue),g=typeof n.secondaryHue==="number"&&Number.isFinite(n.secondaryHue);if(t.dataset.lsStyle=a,t.dataset.lsPill=n.pillStyle||"glass_capsule",t.dataset.lsFrame=s,t.dataset.lsMeter=o,t.dataset.lsBlur=String(i),t.dataset.lsCompact=String(r),t.style.setProperty("--ls-glow",p.toFixed(2)),d)t.style.setProperty("--ls-primary",`hsl(${n.accentHue}, 86%, 62%)`);else t.style.removeProperty("--ls-primary");if(g)t.style.setProperty("--ls-accent",`hsl(${n.secondaryHue}, 82%, 68%)`);else if(d)t.style.setProperty("--ls-accent",`hsl(${(n.accentHue+28)%360}, 82%, 68%)`);else t.style.removeProperty("--ls-accent")}applyTemplateThemeToDom(){if(typeof document>"u")return;let t=this.snapshot.template.theme;for(let a of document.querySelectorAll(".ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay"))this.stampThemeOnElement(a);let n=(t.customCss||"").trim();if(n){let a=n.replace(/@import\b[^;]*;?/gi,"").replace(/url\s*\([^)]*\)/gi,"");if(!this.customCssEl)this.customCssEl=document.createElement("style"),this.customCssEl.dataset.lsCustomCss="true",document.head.append(this.customCssEl);if(this.customCssEl.textContent!==a)this.customCssEl.textContent=a}else if(this.customCssEl)this.customCssEl.remove(),this.customCssEl=null}emitChange(){for(let t of this.listeners)t();this.applyTemplateThemeToDom()}emitStatusChange(){for(let t of this.statusListeners)t()}notify(t,n=!1){this.statusText=t,this.statusError=n,this.emitStatusChange()}request(t,n={}){let a=this.chatId||"sandbox",s=Cs();return new Promise((o,i)=>{let p=setTimeout(()=>{this.pendingRpc.delete(s),i(Error(`RPC timeout waiting for ${t}`))},60000);this.pendingRpc.set(s,{resolve:o,reject:i,timer:p});let r={channel:Sn,requestId:s,chatId:a,type:t,payload:n};this.ctx.sendToBackend(r)})}isActivityForActiveChat(t){let n="";try{n=this.ctx.getActiveChat?.()?.chatId??""}catch{n=""}if(n&&n!==this.chatId)this.refreshActiveChat(n);let a=n||this.chatId;if(!a){if(t&&t!=="sandbox")this.refreshActiveChat(t);return!0}return!t||t===a}async refreshActiveChat(t){let n=typeof t==="string"?t.trim():"";if(!n&&t!==null)try{n=this.ctx.getActiveChat?.()?.chatId??""}catch{n=""}if(n!==this.chatId)this.chatId=n,this.selectedActorId="",this.openedCastTabs=[],this.activeCastTabActorId="",this.selectedPlaceId="",this.activeProposal=void 0;this.hydratingChat=!0;let a=await this.request("snapshot:get").catch(()=>({}));if(this.hydratingChat=!1,typeof a.resolvedChatId==="string"&&a.resolvedChatId&&!this.chatId)this.chatId=a.resolvedChatId;if(Array.isArray(a.connections))this.connections=a.connections;if(Array.isArray(a.recentTurns))this.recentTurns=a.recentTurns;this.emitChange()}toggleVnStage(){this.onToggleVnStage?.()}uploadStageVariantAsset(t){this.ctx.uploads.pickFile({accept:["image/png","image/jpeg","image/webp","image/gif"],multiple:!1,maxSizeBytes:6000000}).then((n)=>{let a=n[0];if(!a)return;let s=32768,o="";for(let i=0;i<a.bytes.length;i+=s)o+=String.fromCharCode(...a.bytes.subarray(i,i+s));this.notify("⏳ Uploading & saving stage asset variant…"),this.request("asset:upload",{dataUrl:`data:${a.mimeType||"image/png"};base64,${btoa(o)}`,...t})}).catch((n)=>this.notify(n instanceof Error?n.message:String(n),!0))}pickAndUploadImage(t,n,a="neutral"){this.ctx.uploads.pickFile({accept:["image/png","image/jpeg","image/webp","image/gif"],multiple:!1,maxSizeBytes:6000000}).then((s)=>{let o=s[0];if(!o)return;let i=32768,p="";for(let r=0;r<o.bytes.length;r+=i)p+=String.fromCharCode(...o.bytes.subarray(r,r+i));this.notify(`⏳ Uploading ${n}…`),this.request("asset:upload",{dataUrl:`data:${o.mimeType||"image/png"};base64,${btoa(p)}`,targetId:t,kind:n,variant:a})}).catch((s)=>this.notify(s instanceof Error?s.message:String(s),!0))}destroy(){if(this.tts.destroy(),this.customCssEl)this.customCssEl.remove(),this.customCssEl=null;if(this.activeOverlayCleanup)this.activeOverlayCleanup(),this.activeOverlayCleanup=null;this.modals.closeAll();for(let t of this.pendingRpc.values())clearTimeout(t.timer);this.pendingRpc.clear();for(let t of this.disposers.splice(0))t();this.listeners.clear(),this.statusListeners.clear()}}function Kt(t){let n={};if(typeof t==="number"&&Number.isFinite(t))return n.value=t,n;let a=String(t??"").trim();if(!a||a==="None")return n;let s=Number(a);if(Number.isFinite(s))n.value=s;let o=/\b([A-Za-z][A-Za-z0-9_]{0,20})\s*[:=]?\s*(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)\b/g,i;while((i=o.exec(a))!==null){let d=i[1],g=Number(i[2]),v=Number(i[3]);if(Number.isFinite(g))n[d]=g,n[`${d}_cur`]=g,n[d.toLowerCase()]=g,n[`${d.toLowerCase()}_cur`]=g;if(Number.isFinite(v))n[`${d}_max`]=v,n[`${d.toLowerCase()}_max`]=v}let p=a.match(/(-?\d+(?:\.\d+)?)\s*%/);if(p){let d=Number(p[1]);if(Number.isFinite(d))n.pct=d}let r=/\b([A-Za-z][A-Za-z0-9_]{0,20})(?:\s*[:=]\s*|\.\s*|\s+|(?=-?\d))(-?\d+(?:\.\d+)?)\b(?!\s*\/)/g;while((i=r.exec(a))!==null){let d=i[1],g=Number(i[2]);if(!Number.isFinite(g))continue;if(n[d]===void 0)n[d]=g;if(n[d.toLowerCase()]===void 0)n[d.toLowerCase()]=g}return n}function Ts(t){let n=t.trim();if(!n||n.includes("{{"))return!1;if(/^(?:compute|calculate|format|write|track|update|use)\b/i.test(n))return!0;if(/\.\s+[A-Za-z]+\s+[a-z]+\s+[a-z]+/.test(n))return!0;if(/\b(?:loses|per\s+\d|during|whenever|only\s+if|in\s+this\s+format)\b/i.test(n))return!0;return!1}function Ve(t,n,a,s){let o=t.trim();if(!o||o.length>1000)return;let i=0,p=0,r=()=>{while(i<o.length&&/\s/.test(o[i]??""))i++},d=()=>{let h=o[i];i++;let C="";while(i<o.length){let P=o[i];if(P==="\\"&&i+1<o.length){C+=o[i+1],i+=2;continue}if(P===h)return i++,C;C+=P,i++}throw Error("Unterminated string literal")},g=(h)=>{if(Object.prototype.hasOwnProperty.call(n,h))return n[h];let C=h.toLowerCase();for(let[S,y]of Object.entries(n))if(S.toLowerCase()===C)return y;let P=a.resolveRef(h);if(P!==void 0&&Number.isFinite(P))return P;return s?.missingRefs.add(h),NaN},v=(h,C)=>{let P=h.toLowerCase();if(P==="round"){if(!C.length)return NaN;let y=10**(C[1]!==void 0&&Number.isFinite(C[1])?Math.max(0,Math.min(6,Math.round(C[1]))):0);return Math.round(C[0]*y)/y}if(P==="floor")return C.length?Math.floor(C[0]):NaN;if(P==="ceil")return C.length?Math.ceil(C[0]):NaN;if(P==="abs")return C.length?Math.abs(C[0]):NaN;if(P==="min")return C.length?Math.min(...C):NaN;if(P==="max")return C.length?Math.max(...C):NaN;if(P==="mod")return C.length>=2&&C[1]!==0?C[0]%C[1]:NaN;if(P==="clamp"){if(C.length<3)return NaN;return Math.max(C[1],Math.min(C[2],C[0]))}if(P==="if"){if(C.length<2)return NaN;let S=C[0];return S!==0&&!Number.isNaN(S)?C[1]:C[2]??0}throw Error(`Unknown function: ${h}`)},M=()=>{if(++p>800)throw Error("Formula complexity limit exceeded");r();let h=o[i];if(h==="+"||h==="-"||h==="!"){i++;let S=M();if(h==="!")return S===0||Number.isNaN(S)?1:0;return h==="-"?-S:S}if(h==="("){i++;let S=w();if(r(),o[i]!==")")throw Error("Unclosed parenthesis");return i++,S}if(h==="["){let S=o.indexOf("]",i+1);if(S<0)throw Error("Unclosed bracket reference");let y=o.slice(i+1,S).trim();i=S+1;let u=a.resolveRef(y);if(u!==void 0&&Number.isFinite(u))return u;return s?.missingRefs.add(y),NaN}let C=o.slice(i).match(/^(?:\d+(?:\.\d+)?|\.\d+)/);if(C)return i+=C[0].length,Number(C[0]);let P=o.slice(i).match(/^[A-Za-z_][A-Za-z0-9_.]*/);if(P){let S=P[0];if(i+=S.length,r(),o[i]==="("){i++,r();let y=S.toLowerCase();if(y==="hascond"||y==="hasflag"){let l=!1;if(o[i]==='"'||o[i]==="'"){let m=d();l=a.hasCond(m),r()}if(o[i]!==")")throw Error(`Expected ) after ${S}`);return i++,l?1:0}if(y==="match"||y==="matches"){let l="",m="";if(o[i]==='"'||o[i]==="'")l=d();else{let b=i;while(i<o.length&&o[i]!==","&&o[i]!==")")i++;let I=o.slice(b,i).trim();l=a.resolveStringRef(I)??String(g(I)||"")}if(r(),o[i]===","){if(i++,r(),o[i]==='"'||o[i]==="'")m=d()}if(r(),o[i]!==")")throw Error("Expected ) after match()");if(i++,!m)return 0;try{return new RegExp(m,"i").test(l)?1:0}catch{return l.toLowerCase().includes(m.toLowerCase())?1:0}}let u=[];if(o[i]!==")")while(!0){if(u.push(w()),r(),o[i]===","){i++;continue}break}if(o[i]!==")")throw Error(`Expected ) in ${S}()`);return i++,v(S,u)}return g(S)}throw Error(`Unexpected character near "${o.slice(i,i+18)}"`)},f=()=>{let h=M();while(!0){r();let C=o[i];if(C!=="*"&&C!=="/"&&C!=="%")return h;i++;let P=M();if((C==="/"||C==="%")&&P===0)return NaN;h=C==="*"?h*P:C==="/"?h/P:h%P}},x=()=>{let h=f();while(!0){r();let C=o[i];if(C!=="+"&&C!=="-")return h;i++;let P=f();h=C==="+"?h+P:h-P}},L=()=>{let h=x();while(!0){r();let C=o.slice(i,i+2),P=o[i],S="";if(C==="<="||C===">="||C==="=="||C==="!=")S=C;else if(P==="<"||P===">")S=P;if(!S)return h;i+=S.length;let y=x();if(S==="<=")h=h<=y?1:0;else if(S===">=")h=h>=y?1:0;else if(S==="==")h=h===y?1:0;else if(S==="!=")h=h!==y?1:0;else if(S==="<")h=h<y?1:0;else h=h>y?1:0}},T=()=>{let h=L();while(!0){if(r(),o.slice(i,i+2)!=="&&")return h;i+=2;let C=L();h=h!==0&&!Number.isNaN(h)&&C!==0&&!Number.isNaN(C)?1:0}},A=()=>{let h=T();while(!0){if(r(),o.slice(i,i+2)!=="||")return h;i+=2;let C=T();h=h!==0&&!Number.isNaN(h)||C!==0&&!Number.isNaN(C)?1:0}},w=()=>{let h=A();if(r(),o[i]!=="?")return h;i++;let C=w();if(r(),o[i]!==":")throw Error('Expected ":" in ternary expression');i++;let P=w();return h!==0&&!Number.isNaN(h)?C:P};try{let h=w();if(r(),i!==o.length){if(s)s.error=`Unexpected character near "${o.slice(i,i+18)}"`;return}if(!Number.isFinite(h))return;return Number(h.toFixed(2))}catch(h){if(s)s.error=h instanceof Error?h.message:String(h);return}}function It(t){let n=t.trim().toLowerCase();return!["","0","false","null","undefined","no","off"].includes(n)}function qt(t){let n=[],a=0,s="";for(let o=0;o<t.length;o++){if(t[o]==="{"&&t[o+1]==="{"){a++,s+="{{",o++;continue}if(t[o]==="}"&&t[o+1]==="}"&&a>0){a--,s+="}}",o++;continue}if(a===0&&t[o]===":"&&t[o+1]===":"){n.push(s),s="",o++;continue}s+=t[o]}return n.push(s),n}function Ba(t,n){let a=0;for(let s=n;s<t.length-1;s++)if(t[s]==="{"&&t[s+1]==="{")a++,s++;else if(t[s]==="}"&&t[s+1]==="}"){if(a--,a===0)return s+2;s++}return-1}function Mt(t,n,a){let s=new RegExp(`^\\{\\{\\s*#?${a}(?:\\s|::|\\}\\})`,"i"),o=new RegExp(`^\\{\\{\\s*\\/${a}\\s*\\}\\}`,"i"),i=1;for(let p=n;p<t.length;p++)if(t[p]==="{"&&t[p+1]==="{"){let r=t.slice(p);if(o.test(r)){if(i--,i===0){let d=t.indexOf("}}",p);return{bodyEnd:p,closeEnd:d+2}}}else if(s.test(r))i++}return null}function Is(t){let n=[],a="",s=0,o=0,i=null,p=!1;for(let d=0;d<t.length;d++){if(t[d]!=="{"||t[d+1]!=="{")continue;let g=Ba(t,d);if(g<0)continue;let v=t.slice(d+2,g-2).trim();if(/^#?(?:if|unless)\b/i.test(v))s++;else if(/^\/(?:if|unless)\b/i.test(v))s=Math.max(0,s-1);else if(s===0&&/^(?:elseif|elif)\b/i.test(v)){let M=t.slice(o,d);if(i===null)n.push({cond:"__first__",content:M});else n.push({cond:i,content:M});i=v.replace(/^(?:elseif|elif)(?:::|\s+)/i,"").trim(),o=g}else if(s===0&&/^else$/i.test(v)){let M=t.slice(o,d);if(i===null)n.push({cond:"__first__",content:M});else n.push({cond:i,content:M});i=null,p=!0,o=g}d=g-1}let r=t.slice(o);if(p)a=r;else if(i===null)n.push({cond:"__first__",content:r});else n.push({cond:i,content:r});return{branches:n,elseContent:a}}function Ms(t,n,a={},s={}){let o={...s},i={...a},p={missingRefs:new Set},r=0,d=(x)=>{if(Object.prototype.hasOwnProperty.call(i,x))return i[x];let L=x.toLowerCase();for(let[w,h]of Object.entries(i))if(w.toLowerCase()===L)return h;if(Object.prototype.hasOwnProperty.call(o,x))return String(o[x]);for(let[w,h]of Object.entries(o))if(w.toLowerCase()===L)return String(h);let T=n.resolveStringRef(x);if(T!==void 0)return T;let A=n.resolveRef(x);if(A!==void 0)return String(A);return},g=(x)=>{let L=x.trim();if(!L)return!1;let T=L.startsWith("!"),A=T?L.slice(1).trim():L,w=v(A).trim(),h=w.match(/^(.+?)\s*(==|!=|>=|<=|>|<)\s*(.+)$/),C=!1;if(h){let P=h[1].trim(),S=h[2],y=h[3].trim(),u=Number(P),l=Number(y);if(P!==""&&y!==""&&Number.isFinite(u)&&Number.isFinite(l))C=S==="=="?u===l:S==="!="?u!==l:S===">"?u>l:S==="<"?u<l:S===">="?u>=l:u<=l;else C=S==="=="?P===y:S==="!="?P!==y:S===">"?P>y:S==="<"?P<y:S===">="?P>=y:P<=y}else C=It(w);return T?!C:C},v=(x)=>{if(++r>1200)return p.error="Macro work budget exceeded (possible infinite recursion)",x;let L="",T=0;while(T<x.length){if(x[T]!=="{"||x[T+1]!=="{"){L+=x[T++];continue}let A=Ba(x,T);if(A<0){L+=x.slice(T);break}let w=x.slice(T+2,A-2).trim();if(w.startsWith("//")||/^comment::|^note::/i.test(w)){T=A;continue}if(/^#escape$/i.test(w)){let l=Mt(x,A,"escape");if(l){L+=x.slice(A,l.bodyEnd),T=l.closeEnd;continue}}let h=w.match(/^#?(if|unless)(?:::|\s+)([\s\S]+)$/i);if(h){let l=h[1].toLowerCase(),m=h[2].trim(),b=Mt(x,A,l);if(b){let I=x.slice(A,b.bodyEnd),{branches:c,elseContent:k}=Is(I),_=k;for(let B of c){let R=B.cond==="__first__"?m:B.cond,E=g(R);if(l==="unless"?!E:E){_=B.content;break}}L+=v(_),T=b.closeEnd;continue}}if(/^let(?:::|\s+)/i.test(w)){let l=Mt(x,A,"let");if(l){let m=qt(w.replace(/^let(?:::|\s+)/i,"")),b=new Map,I=new Map;for(let c=0;c+1<m.length;c+=2){let k=v(m[c]).trim(),_=v(m[c+1]);if(!k)continue;b.set(k,Object.prototype.hasOwnProperty.call(i,k)?i[k]:void 0),I.set(k,Object.prototype.hasOwnProperty.call(o,k)?o[k]:void 0),i[k]=_;let B=Number(_);if(_.trim()!==""&&Number.isFinite(B))o[k]=B}L+=v(x.slice(A,l.bodyEnd));for(let[c,k]of b.entries())if(k===void 0)delete i[c];else i[c]=k;for(let[c,k]of I.entries())if(k===void 0)delete o[c];else o[c]=k;T=l.closeEnd;continue}}if(/^#?trim$/i.test(w)){let l=Mt(x,A,"trim");if(l){L+=v(x.slice(A,l.bodyEnd)).trim(),T=l.closeEnd;continue}}if(/^switch::/i.test(w)){let l=qt(w);if(l.length<=2){let m=Mt(x,A,"switch");if(m){let b=v(l[1]??"").trim(),I=x.slice(A,m.bodyEnd),c="",k="",_=/\{\{\s*case::([\s\S]*?)\}\}([\s\S]*?)\{\{\s*\/case\s*\}\}/gi,B;while((B=_.exec(I))!==null)if(qt(B[1]).map((E)=>v(E).trim()).includes(b)){c=B[2];break}if(!c){let R=I.match(/\{\{\s*default\s*\}\}([\s\S]*?)\{\{\s*\/default\s*\}\}/i);if(R)k=R[1]}L+=v(c||k),T=m.closeEnd;continue}}}let C=w.match(/^\.([A-Za-z_][A-Za-z0-9_]*)\s*(=|\+=|-=)\s*([\s\S]+)$/);if(C){let l=C[1],m=C[2],b=v(C[3]).trim(),I=Number(b);if(m==="="){if(i[l]=b,b!==""&&Number.isFinite(I))o[l]=I}else{let c=o[l]??Number(d(l)??0)??0,k=m==="+="?c+(Number.isFinite(I)?I:0):c-(Number.isFinite(I)?I:0);o[l]=k,i[l]=String(k)}T=A;continue}let P=w.match(/^\.([A-Za-z_][A-Za-z0-9_]*)(\+\+|--)$/);if(P){let l=P[1],m=o[l]??Number(d(l)??0)??0,b=P[2]==="++"?m+1:m-1;o[l]=b,i[l]=String(b),L+=String(b),T=A;continue}if(/^[.@$][A-Za-z_][A-Za-z0-9_]*$/.test(w)){let l=w.slice(1),m=d(l);if(m===void 0)p.missingRefs.add(l);else L+=m;T=A;continue}let S=w.includes("::")?qt(w):w.split(/\s+/),y=(S[0]??"").trim().toLowerCase(),u=S.slice(1).map((l)=>v(l));if(y==="space")L+=" ";else if(y==="newline"||y==="nl"||y==="n")L+=`
`;else if(y==="noop")L+="";else if(y==="getvar"||y==="getchatvar"){let l=(u[0]??"").trim(),m=d(l);if(m===void 0)p.missingRefs.add(l);else L+=m}else if(y==="setvar"){let l=(u[0]??"").trim(),m=u[1]??"";if(l){i[l]=m;let b=Number(m);if(m.trim()!==""&&Number.isFinite(b))o[l]=b}}else if(y==="hasvar"||y==="haschatvar"||y==="varexists"){let l=(u[0]??"").trim();L+=d(l)!==void 0?"true":"false"}else if(y==="calc"||y==="math"||y==="evaluate"){let l=u.join("::"),m=Ve(l,o,n,p);if(m!==void 0)L+=String(m)}else if(y==="round"){let l=Number(u[0]),m=u[1]!==void 0?Math.max(0,Math.min(6,Math.round(Number(u[1])||0))):0;if(Number.isFinite(l))L+=String(Math.round(l*10**m)/10**m)}else if(y==="floor"){let l=Number(u[0]);if(Number.isFinite(l))L+=String(Math.floor(l))}else if(y==="ceil"){let l=Number(u[0]);if(Number.isFinite(l))L+=String(Math.ceil(l))}else if(y==="abs"){let l=Number(u[0]);if(Number.isFinite(l))L+=String(Math.abs(l))}else if(y==="min"){let l=u.map(Number).filter(Number.isFinite);if(l.length)L+=String(Math.min(...l))}else if(y==="max"){let l=u.map(Number).filter(Number.isFinite);if(l.length)L+=String(Math.max(...l))}else if(y==="clamp"){let[l,m,b]=u.map(Number);if(Number.isFinite(l)&&Number.isFinite(m)&&Number.isFinite(b))L+=String(Math.max(m,Math.min(b,l)))}else if(y==="mod"){let l=Number(u[0]),m=Number(u[1]);if(Number.isFinite(l)&&Number.isFinite(m)&&m!==0)L+=String(l%m)}else if(y==="and")L+=u.length&&u.every(It)?"true":"";else if(y==="or")L+=u.some(It)?"true":"";else if(y==="not")L+=!It(u[0]??"")?"true":"";else if(["eq","ne","gt","lt","gte","lte"].includes(y)){let l=u[0]?.trim()??"",m=u[1]?.trim()??"",b=Number(l),I=Number(m),c=l!==""&&m!==""&&Number.isFinite(b)&&Number.isFinite(I),k=!1;if(y==="eq")k=c?b===I:l===m;else if(y==="ne")k=c?b!==I:l!==m;else if(y==="gt")k=c?b>I:l>m;else if(y==="lt")k=c?b<I:l<m;else if(y==="gte")k=c?b>=I:l>=m;else if(y==="lte")k=c?b<=I:l<=m;L+=k?"true":""}else if(y==="empty"||y==="isempty")L+=(u[0]??"")===""?"true":"";else if(y==="blank"||y==="isblank")L+=(u[0]??"").trim()===""?"true":"";else if(y==="default"||y==="fallback"||y==="coalesce")L+=u.find(It)??"";else if(y==="matches"){let[l="",m="",b=""]=u;if(m)try{L+=new RegExp(m,b).test(l)?"true":""}catch{L+=l.toLowerCase().includes(m.toLowerCase())?"true":""}}else if(y==="includes"||y==="contains"||y==="inlist"){let l=(u[0]??"").split(",").map((m)=>m.trim()).filter(Boolean);L+=l.includes((u[1]??"").trim())?"true":""}else if(y==="upper"||y==="uppercase"||y==="toupper")L+=(u[0]??"").toUpperCase();else if(y==="lower"||y==="lowercase"||y==="tolower")L+=(u[0]??"").toLowerCase();else if(y==="len"||y==="length")L+=String((u[0]??"").length);else if(y==="replace")L+=(u[2]??"").split(u[0]??"").join(u[1]??"");else if(y==="split"){let l=(u[0]??"").split(u[1]??","),m=Number(u[2]??0),b=m<0?l.length+m:m;L+=(l[b]??"").trim()}else if(y==="wrap"){let l=u[2]??"";L+=l?`${u[0]??""}${l}${u[1]??""}`:""}else if(y==="switch"){let l=(u[0]??"").trim(),m="";for(let b=1;b+1<u.length;b+=2)if(u[b].trim()===l){m=u[b+1];break}if(!m&&u.length%2===0)m=u[u.length-1];L+=m}else L+=x.slice(T,A);T=A}return L},M=v(t).split(`
`).map((x)=>x.trimEnd()).filter((x)=>x.trim()!=="").join(`
`).trim(),f=Number(M);if(M!==""&&Number.isFinite(f))o.value=f,o.result=f;return{text:M,locals:o,strLocals:i,missingRefs:[...p.missingRefs],error:p.error}}function Ls(t,n,a={},s={}){let o=t.trim();if(!o)return{value:void 0,locals:{},missingRefs:[],error:"Formula is empty"};if(o.includes("{{")&&o.includes("}}")){let g=Ms(o,n,a,s);return{value:g.text!==""&&Number.isFinite(Number(g.text))?Number(g.text):g.locals.value,textOutput:g.text||void 0,locals:g.locals,missingRefs:g.missingRefs,error:g.error}}if(Ts(o))return{value:void 0,locals:{},missingRefs:[],isProse:!0,error:'Plain-English rule detected — click "Convert to Local Formula" to translate it into math/macro syntax.'};let i={...s},p={missingRefs:new Set},r=o.split(/\r?\n|;/).map((g)=>g.trim()).filter((g)=>Boolean(g)&&!g.startsWith("//")&&!g.startsWith("#"));if(!r.length)return{value:void 0,locals:i,missingRefs:[],error:"Formula is empty"};let d;for(let g of r){let v=g.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([\s\S]+)$/);if(v&&!v[2].startsWith("=")){let M=v[1],f=v[2],x=Ve(f,i,n,p);if(x===void 0)return{value:void 0,locals:i,missingRefs:[...p.missingRefs],error:p.error};i[M]=x,d=x}else{let M=Ve(g,i,n,p);if(M===void 0)return{value:void 0,locals:i,missingRefs:[...p.missingRefs],error:p.error};d=M}}if(d!==void 0)i.value=d,i.result=d;return{value:d,locals:i,missingRefs:[...p.missingRefs],error:p.error}}function Pn(t,n,a){let s=(f,x)=>{if(!t.modifiers?.length)return 0;let L=0;for(let T of t.modifiers){if(T.statId!==f)continue;if(x?T.targetActorId===x:!T.targetActorId)L+=Number.isFinite(T.delta)?T.delta:0}return L},o={location:t.scene.location||"",time:t.scene.timeLabel||"",date:t.scene.dateLabel||"",weather:t.scene.weather||"",turn:String(t.turnCount),player_name:t.player.name||"User",player_attire:t.player.attire||"",player_condition:t.player.condition||""},i={turn:t.turnCount,elapsed_minutes:t.elapsedMinutes},p=(f,x)=>{if(typeof x==="number")return!0;if(typeof x!=="string")return!1;if(f.displayStyle==="feed_cards"||f.displayStyle==="quote_callout")return!1;let L=x.trim();if(!L||L==="None")return!1;if(L.includes(`
`)||L.length>110)return!1;return!0};if(a){o.name=a.name,o.conditions=a.conditions.join(", "),o.demeanor=a.demeanor||"",o.attire=a.attire||"";for(let[f,x]of Object.entries(a.fields))if(x)o[f]=x;for(let f of n){if(!f.enabled||f.scope!=="character")continue;let x=a.meters[f.id],L=x?.calibrated?x.value:f.defaultValue;if(o[f.id]=String(L??""),!p(f,L))continue;for(let[T,A]of Object.entries(Kt(L))){let w=T==="value"?f.id:T;if(i[w]===void 0)i[w]=A,o[w]=String(A)}}}else{o.name=t.player.name||"User",o.conditions=t.player.condition||"",o.attire=t.player.attire||"";for(let f of n){if(!f.enabled||f.scope==="character")continue;let x=t.stats[f.id],L=x?.calibrated?x.value:f.defaultValue;if(o[f.id]=String(L??""),!p(f,L))continue;for(let[T,A]of Object.entries(Kt(L))){let w=T==="value"?f.id:T;if(i[w]===void 0)i[w]=A,o[w]=String(A)}}}let r=(f,x,L,T)=>{if(x){let A=Kt(f);if(A[x]!==void 0)return A[x];return A[x.toLowerCase()]}if(typeof f==="number"&&Number.isFinite(f))return f+s(L,T);if(typeof f==="string"){let A=Number(f);if(Number.isFinite(A))return A+s(L,T)}return},d=Object.values(t.characters).find((f)=>f.present);return{ctx:{resolveRef:(f)=>{let x=f.trim();if(!x)return;if(x.startsWith("character:")){let T=x.slice(10).split("."),A=T[0],w=T[1],h=T[2];if(!A||!w)return;let C=t.characters[A];return C?r(C.meters[w]?.value,h,w,C.id):void 0}if(x.startsWith("first_present.")){let T=x.slice(14).split("."),A=T[0];if(!A||!d)return;return r(d.meters[A]?.value,T[1],A,d.id)}if(x.startsWith("self.")){let T=x.slice(5).split("."),A=T[0],w=T[1];if(a){let h=r(a.meters[A]?.value,w,A,a.id);if(h!==void 0)return h}return r(t.stats[A]?.value,w,A)}if(x.includes(".")){let[T,A]=x.split(".",2);if(T&&A){if(a&&a.meters[T]){let w=r(a.meters[T]?.value,A,T,a.id);if(w!==void 0)return w}if(t.stats[T]){let w=r(t.stats[T]?.value,A,T);if(w!==void 0)return w}}}if(a&&a.meters[x]){let T=r(a.meters[x]?.value,void 0,x,a.id);if(T!==void 0)return T}if(t.stats[x]){let T=r(t.stats[x]?.value,void 0,x);if(T!==void 0)return T}if(i[x]!==void 0)return i[x];let L=x.toLowerCase();for(let[T,A]of Object.entries(i))if(T.toLowerCase()===L)return A;return},resolveStringRef:(f)=>{let x=f.trim();if(!x)return;if(Object.prototype.hasOwnProperty.call(o,x))return o[x];let L=x.toLowerCase();for(let[T,A]of Object.entries(o))if(T.toLowerCase()===L)return A;if(a&&a.meters[x]!==void 0)return String(a.meters[x].value);if(t.stats[x]!==void 0)return String(t.stats[x].value);return},hasCond:(f)=>{let x=f.split(/[|,;]+/).map((A)=>A.trim().toLowerCase()).filter(Boolean);if(!x.length)return!1;let L=[];if(a){L.push(...a.conditions,a.demeanor,a.attire);for(let A of Object.values(a.meters))if(typeof A.value==="string")L.push(A.value)}else{L.push(t.player.condition,t.player.attire);for(let A of Object.values(t.stats))if(typeof A.value==="string")L.push(A.value)}let T=L.join(" ").toLowerCase();return x.some((A)=>T.includes(A))}},strVars:o,numVars:i}}function $s(t,n){let a=t.formulaOutputTemplate?.trim();if(a){let s=!1,o=a.replace(/\{([A-Za-z0-9_]+)\}/g,(i,p)=>{if(n.locals[p]!==void 0)return s=!0,String(n.locals[p]);let r=p.toLowerCase();for(let[d,g]of Object.entries(n.locals))if(d.toLowerCase()===r)return s=!0,String(g);return"—"});return s?o:void 0}if(n.textOutput!==void 0)return n.textOutput;if(n.value===void 0)return;return Math.max(t.min,Math.min(t.max,n.value))}function Ps(t,n,a,s){let{numVars:o,strVars:i}=Pn(t,n,a==="character"?s:void 0),p={};for(let[r,d]of Object.entries(o))if(!Object.keys(o).some((v)=>v!==r&&v.toLowerCase()===r&&v!==v.toLowerCase()))p[r]=d;return{numTokens:p,strVars:i}}function Da(t,n,a,s){let o=t.formula?.trim()??"",i=t.scope==="character"?s?n.characters[s]:Object.values(n.characters)[0]:void 0,p=i?i.name:n.player.name||"Player",r=Ps(n,a,t.scope,i);if(!o)return{locals:{},missingRefs:[],availableTokens:r.numTokens,availableStringVars:r.strVars,targetName:p};let{ctx:d,strVars:g,numVars:v}=Pn(n,a,i),M=Ls(o,d,g,v),f=$s(t,M);return{output:f,locals:M.locals,missingRefs:f!==void 0?[]:M.missingRefs,isProse:M.isProse,error:M.error,availableTokens:r.numTokens,availableStringVars:r.strVars,targetName:p}}function Na(t){let n=[],a=0,s=null,o="";for(let i=0;i<t.length;i++){let p=t[i];if(s){if(o+=p,p==="\\"&&i+1<t.length)o+=t[++i];else if(p===s)s=null;continue}if(p==='"'||p==="'"){s=p,o+=p;continue}if(p==="("||p==="[")a++;else if((p===")"||p==="]")&&a>0)a--;else if(p===","&&a===0){n.push(o.trim()),o="";continue}o+=p}if(o.trim()||n.length)n.push(o.trim());return n}function $n(t){let n=t.trim();if(n.startsWith('"')&&n.endsWith('"')||n.startsWith("'")&&n.endsWith("'"))return n.slice(1,-1);return n}function As(t,n,a,s){let o=t.localRuleFormula?.trim()??"";if(!o)return{appliedEffects:[]};let i=`category:${t.id}:${s?.id??"player"}`;a.modifiers=(a.modifiers??[]).filter((f)=>f.source!==i);let p=Pn(a,n,s),r={...p.numVars},d={missingRefs:new Set},g=[],v=o.split(/\r?\n|;/).map((f)=>f.trim()).filter((f)=>Boolean(f)&&!f.startsWith("//")&&!f.startsWith("#")),M=(f)=>{let x=f.match(/^if\s*\(([\s\S]+?)\)\s+(mod|set|add)\s*\(([\s\S]+)\)$/i);if(x){let w=Ve(x[1],r,p.ctx,d);if(w!==void 0&&w!==0&&!Number.isNaN(w))M(`${x[2]}(${x[3]})`);return}let L=f.match(/^mod\s*\(([\s\S]+)\)$/i);if(L){let w=Na(L[1]);if(w.length<3){d.error="mod() requires (statId, label, deltaExpression)";return}let h=$n(w[0]),C=$n(w[1])||t.name,P=Ve(w.slice(2).join(","),r,p.ctx,d);if(P===void 0||P===0)return;let y={id:`catmod_${re(t.id)}_${re(s?.id??"player")}_${re(h)}_${re(C)}`,label:C,statId:h,...s?{targetActorId:s.id}:{},delta:Math.round(P),source:i};a.modifiers.push(y),g.push(`${s?`${s.name} · `:""}${h} ${y.delta>=0?`+${y.delta}`:y.delta} (${C})`);return}let T=f.match(/^(set|add)\s*\(([\s\S]+)\)$/i);if(T){let w=T[1].toLowerCase(),h=Na(T[2]);if(h.length<2){d.error=`${w}() requires (statId, expression)`;return}let C=$n(h[0]),P=Ve(h.slice(1).join(","),r,p.ctx,d);if(P===void 0)return;let S=n.find((y)=>y.id===C);if(s&&(S?.scope==="character"||s.meters[C])){let y=s.meters[C];if(y?.locked||S?.locked)return;let u=typeof y?.value==="number"?y.value:0,l=w==="add"?u+P:P,m=S?Math.max(S.min,Math.min(S.max,Math.round(l))):Math.round(l);s.meters[C]={value:m,calibrated:!0,locked:!1,lastReason:`Category rule: ${t.name}`},g.push(`${s.name} · ${C} = ${m}`)}else if(S&&S.scope!=="character"){let y=a.stats[C];if(y?.locked||S.locked)return;let u=typeof y?.value==="number"?y.value:0,l=w==="add"?u+P:P,m=Math.max(S.min,Math.min(S.max,Number(l.toFixed(2))));a.stats[C]={id:C,scope:S.scope,value:m,calibrated:!0,locked:!1,lastReason:`Category rule: ${t.name}`},g.push(`${C} = ${m}`)}return}let A=f.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([\s\S]+)$/);if(A&&!A[2].startsWith("=")){let w=A[1],h=Ve(A[2],r,p.ctx,d);if(h!==void 0)r[w]=h}};for(let f of v)if(M(f),d.error)break;return{appliedEffects:g,error:d.error}}function Ha(t,n,a,s){let o=structuredClone(n),r=a.filter((d)=>d.enabled&&d.categoryId===t.id).some((d)=>d.scope==="character")||/\bmod\s*\(|\bself\./i.test(t.localRuleFormula??"")?s?o.characters[s]:Object.values(o.characters)[0]:void 0;return As(t,a,o,r)}function je(t,n){if(!t||!t.length)return"";let a=[...t].sort((s,o)=>o.value-s.value);for(let s of a)if(n>=s.value)return s.label;return a.at(-1)?.label??""}function ot(t){let n=Math.max(0,Math.round(t))+480,a=Math.floor(n%1440/60),s=n%60,o=a>=12?"PM":"AM",i=a%12===0?12:a%12;return`${String(i).padStart(2,"0")}:${String(s).padStart(2,"0")} ${o}`}function Fa(t){return`Day ${Math.floor(Math.max(0,t)/1440)+1} · ${ot(t)}`}function Re(t){let n=Math.floor(Math.max(0,t.elapsedMinutes)/1440)+1,a=t.scene.timeLabel?.trim()||ot(t.elapsedMinutes),s=t.scene.dateLabel?.trim()||`Day ${n}`,o=t.scene.location?.trim()||t.title||"Uncharted Scene",i=t.scene.weather?.trim()||"Clear";return{time:a,date:s,location:o,weather:i,formatted:`[ \uD83D\uDD70️ ${a} | \uD83D\uDCC5 ${s} | \uD83D\uDCCD ${o} | \uD83C\uDF26️ ${i} ]`}}function he(t,n){let a=t.fields[n];if(a&&a.trim())return a.trim();if(n==="role_summary")return t.roleSummary||"";if(n==="demeanor")return t.demeanor||"";if(n==="inner_thought")return t.innerThought||"";if(n==="immediate_goal")return t.immediateGoal||"";if(n==="attire_layers")return t.attire||"";return""}function Lt(t,n){let a=t.dossierFields.find((s)=>s.id===n);return a?a.enabled:!1}function $t(t){if(["text","tags","tier","skill_tree","xp_level","attributes","inventory","status_fx"].includes(t.kind))return!0;if(t.displayStyle&&t.displayStyle!=="auto")return!0;return/\[[^\]]*\]|->|→|\b(?:format|write\s+in|write\s+this|saw\/heard|impulse\s*:)\b/i.test(t.triggerCues)}function Pt(t,n=""){let a=`${t} ${n}`.toLowerCase();if(/\b(?:sister|brother|sibling|mother|mom|father|dad|parent|son|daughter|cousin|aunt|uncle|family|twin|niece|nephew|guardian)\b/.test(a))return"family";if(/\b(?:lover|partner|wife|husband|spouse|fianc[eé]e?|boyfriend|girlfriend|crush|sweetheart|romantic|beloved|infatuat)\b/.test(a))return"romance";if(/\b(?:rival|enemy|nemesis|hostile|antagonist|foe|hatred|bitter|estranged|ex-|ex\b|adversary|suspicious|threat)\b/.test(a))return"rival";if(/\b(?:boss|employer|employee|subordinate|maid|butler|servant|retainer|master|teacher|student|mentor|apprentice|client|doctor|colleague|coworker|captain|commander)\b/.test(a))return"professional";if(/\b(?:friend|best\s+friend|ally|companion|confidant|buddy|comrade|roommate|childhood|pal|trusted|protector)\b/.test(a))return"friend";return"neutral"}var ce="player",Gt="web",Pe={family:{icon:"\uD83D\uDC9B",label:"Family",color:"#f59e0b"},friend:{icon:"\uD83D\uDC99",label:"Friend / Ally",color:"#38bdf8"},romance:{icon:"\uD83E\uDE77",label:"Romance",color:"#f472b6"},rival:{icon:"❤️",label:"Rival / Tense",color:"#f43f5e"},professional:{icon:"\uD83D\uDCBC",label:"Work / Duty",color:"#a78bfa"},neutral:{icon:"⚪",label:"Acquaintance",color:"#94a3b8"}},An=["Best Friend","Protective Sister","Younger Brother","Childhood Friend","Trusted Ally","Romantic Interest","Partner / Lover","Rival","Suspicious Stranger","Employer / Boss","Loyal Retainer"];function Es(t){let n=t.trim().split(/\s+/).filter(Boolean);if(n.length>=2)return`${n[0][0]??""}${n[1][0]??""}`.toUpperCase();return(t.trim().slice(0,2)||"?").toUpperCase()}function it(t){if(t.bondToPlayer?.label)return{...t.bondToPlayer,category:t.bondToPlayer.category??Pt(t.bondToPlayer.label,t.bondToPlayer.note)};let n=t.fields.bond_dynamic||t.roleSummary||"Acquaintance";return{label:n,category:Pt(n)}}function En(t){if(t.bondFromPlayer?.label)return{...t.bondFromPlayer,category:t.bondFromPlayer.category??Pt(t.bondFromPlayer.label,t.bondFromPlayer.note)};return{label:"Not defined yet",category:"neutral"}}function Wa(t,n){let a=t.snapshot.state.player.name||"You",s=En(n),o=it(n);t.modals.open({title:`\uD83D\uDD17 Edit Bond: ${a} ⇄ ${n.name}`,width:560},(i,p)=>{let r=e("label","ls-label",`Your Bond to ${n.name} (${a} → ${n.name})`),d=e("input","ls-input");d.placeholder="e.g. Younger Brother, Best Friend, Wary Ally…",d.value=s.label==="Not defined yet"?"":s.label,r.append(d);let g=e("div","ls-row");for(let y of An.slice(0,6))g.append(N(y,()=>{d.value=y},"ls-btn-sm ls-quick-pill"));r.append(g);let v=e("label","ls-label",`Why / Note for ${a} → ${n.name} (Optional)`),M=e("input","ls-input");M.placeholder="e.g. Relies on her for advice…",M.value=s.note??"",v.append(M);let f=e("label","ls-label",`${n.name}'s Bond to You (${n.name} → ${a})`),x=e("input","ls-input");x.placeholder="e.g. Protective Elder Sister, Strict Boss…",x.value=o.label,f.append(x);let L=e("div","ls-row");for(let y of An.slice(0,6))L.append(N(y,()=>{x.value=y},"ls-btn-sm ls-quick-pill"));f.append(L);let T=e("label","ls-label",`Why / Note for ${n.name} → ${a} (Optional)`),A=e("input","ls-input");A.placeholder="e.g. Secretly worries about you…",A.value=o.note??"",T.append(A);let w=o.category??s.category??"neutral",h=e("div","ls-label","Bond Type / Color"),C=e("div","ls-row"),P=()=>{for(let y of[...C.querySelectorAll("button")])y.setAttribute("aria-current",y.dataset.cat===w?"page":"false")};for(let[y,u]of Object.entries(Pe)){let l=N(`${u.icon} ${u.label}`,()=>{w=y,P()},"ls-btn-sm");l.dataset.cat=y,C.append(l)}P(),h.append(C);let S=N("\uD83D\uDCBE Save Two-Way Bond",()=>{let y=d.value.trim(),u=x.value.trim()||n.roleSummary||"Acquaintance";t.request("state:mutate",{patch:{characters:[{id:n.id,name:n.name,roleSummary:u,bondToPlayer:{label:u,...A.value.trim()?{note:A.value.trim()}:{},category:w},...y?{bondFromPlayer:{label:y,...M.value.trim()?{note:M.value.trim()}:{},category:w}}:{}}]},reason:`Updated bond ${a} ⇄ ${n.name}`}),p()},"ls-btn-primary");i.append(r,v,f,T,h,S)})}function Ue(t,n,a){let{state:s}=t.snapshot,o=Object.values(s.characters).filter((i)=>i.id!==n.id);t.modals.open({title:a?`\uD83E\uDD1D Edit NPC Bond: ${n.name} ⇄ ${a.toName}`:`➕ Add Bond from ${n.name} to Another NPC`,width:560},(i,p)=>{let r=e("label","ls-label",`Other Character (${n.name} → ?)`),d=e("input","ls-input");if(d.placeholder=o.length?`e.g. ${o.map((u)=>u.name).join(", ")} or another NPC name`:"Enter NPC name…",d.value=a?.toName??(o[0]?.name??""),r.append(d),o.length>0){let u=e("div","ls-row");for(let l of o)u.append(N(`\uD83D\uDC64 ${l.name}`,()=>{d.value=l.name},"ls-btn-sm"));r.append(u)}let g=e("label","ls-label",`${n.name}'s Relation to Them`),v=e("input","ls-input");v.placeholder="e.g. Older Sister, Ex-Fiancé, Rival, Boss…",v.value=a?.label??"",g.append(v);let M=e("div","ls-row");for(let u of An.slice(0,6))M.append(N(u,()=>{v.value=u},"ls-btn-sm ls-quick-pill"));g.append(M);let f=e("label","ls-label","Why / Dynamic Note (Optional)"),x=e("input","ls-input");x.placeholder="e.g. Still bitter about what happened last summer…",x.value=a?.attitude??"",f.append(x);let T=(a?s.characters[a.toId]:o[0])?.peerBonds?.[n.id],A=e("label","ls-label",`Their Relation Back to ${n.name} (Optional)`),w=e("input","ls-input");w.placeholder="e.g. Younger Brother, Loyal Friend…",w.value=T?.label??"",A.append(w);let h=a?.category??Pt(a?.label??"",a?.attitude??""),C=e("div","ls-label","Bond Type / Color"),P=e("div","ls-row"),S=()=>{for(let u of[...P.querySelectorAll("button")])u.setAttribute("aria-current",u.dataset.cat===h?"page":"false")};for(let[u,l]of Object.entries(Pe)){let m=N(`${l.icon} ${l.label}`,()=>{h=u,S()},"ls-btn-sm");m.dataset.cat=u,P.append(m)}S(),C.append(P);let y=N("\uD83D\uDCBE Save NPC Bond",()=>{let u=d.value.trim();if(!u)return;let l=v.value.trim()||"Acquaintance",m=x.value.trim(),b=[{id:n.id,name:n.name,peerBonds:[{target:u,label:l,attitude:m,category:h}]}],I=w.value.trim();if(I)b.push({name:u,peerBonds:[{target:n.name,label:I,attitude:T?.attitude??"",category:h}]});t.request("state:mutate",{patch:{characters:b},reason:`Updated bond ${n.name} ⇄ ${u}`}),p()},"ls-btn-primary");i.append(r,g,f,A,C,y)})}function Zt(t,n){let{state:a}=t.snapshot,s=e("div","ls-stack"),o=Object.values(a.characters),i=a.player.name||"You";if(ce!=="player"&&ce!=="all"&&!a.characters[ce])ce="player";let p=e("div","ls-row-between"),r=e("div","ls-row");r.append(e("span","ls-kicker","Focus:"));let d=N(`\uD83D\uDC64 ${i}`,()=>{ce="player",t.emitChange()},"ls-btn-sm");if(ce==="player")d.setAttribute("aria-current","page");r.append(d);for(let w of o){let h=N(`${w.present?"\uD83D\uDFE2":"⚪"} ${w.name}`,()=>{ce=w.id,t.selectedActorId=w.id,t.emitChange()},"ls-btn-sm");if(ce===w.id)h.setAttribute("aria-current","page");r.append(h)}if(o.length>=2){let w=N("\uD83D\uDD78️ Full Web",()=>{ce="all",t.emitChange()},"ls-btn-sm");if(ce==="all")w.setAttribute("aria-current","page");r.append(w)}let g=e("div","ls-row");if(g.append(N(Gt==="web"?"\uD83D\uDCCB Cards Only":"\uD83D\uDD78️ Show Map",()=>{Gt=Gt==="web"?"cards":"web",t.emitChange()},"ls-btn-sm")),o.length>0){let w=(ce!=="player"&&ce!=="all"?a.characters[ce]:void 0)??(t.selectedActorId?a.characters[t.selectedActorId]:void 0)??o[0];g.append(N("+ Add NPC Bond",()=>Ue(t,w),"ls-btn-sm ls-btn-primary"))}if(p.append(r,g),s.append(p),!o.length){let w=e("div","ls-card");return w.append(e("strong","","Bond Web Ready"),e("p","ls-muted","Once characters appear in chat, your two-way relations with them and their relations with each other will appear here.")),s.append(w),s}let v=e("div","ls-web-legend"),M=e("div","ls-row");for(let w of Object.values(Pe)){let h=e("span","ls-web-legend-item"),C=e("span","ls-web-swatch");C.style.background=w.color,h.append(C,document.createTextNode(`${w.icon} ${w.label}`)),M.append(h)}if(v.append(M),s.append(v),Gt==="web"){let w=e("div","ls-bw-stage"),h="http://www.w3.org/2000/svg",C=document.createElementNS("http://www.w3.org/2000/svg","svg");C.setAttribute("viewBox","0 0 100 100"),C.setAttribute("preserveAspectRatio","none"),C.classList.add("ls-bw-svg");let P=[];if(ce==="player")P.push({id:"player",name:i,isPlayer:!0,present:!0,xPct:50,yPct:o.length===1?18:50,color:"#38bdf8"}),o.forEach((l,m)=>{let b=it(l),I=Pe[b.category??"neutral"],c=50,k=82;if(o.length===1)c=50,k=82;else if(o.length===2)c=m===0?15:85,k=50;else{let _=m/o.length*Math.PI*2-Math.PI/2;c=50+Math.cos(_)*38,k=50+Math.sin(_)*35}P.push({id:l.id,name:l.name,isPlayer:!1,present:l.present,portraitUrl:l.portraitUrl,xPct:Number(c.toFixed(1)),yPct:Number(k.toFixed(1)),color:I.color})});else if(ce!=="all"&&a.characters[ce]){let l=a.characters[ce],m=[{id:"player",name:i,isPlayer:!0,present:!0},...o.filter((b)=>b.id!==l.id).map((b)=>({id:b.id,name:b.name,isPlayer:!1,present:b.present,portraitUrl:b.portraitUrl}))];P.push({id:l.id,name:l.name,isPlayer:!1,present:l.present,portraitUrl:l.portraitUrl,xPct:50,yPct:m.length===1?18:50,color:"#38bdf8"}),m.forEach((b,I)=>{let c=50,k=82;if(m.length===1)c=50,k=82;else if(m.length===2)c=I===0?15:85,k=50;else{let B=I/m.length*Math.PI*2-Math.PI/2;c=50+Math.cos(B)*38,k=50+Math.sin(B)*35}let _=b.isPlayer?it(l).category??"neutral":l.peerBonds?.[b.id]?.category??a.characters[b.id]?.peerBonds?.[l.id]?.category??"neutral";P.push({id:b.id,name:b.name,isPlayer:b.isPlayer,present:b.present,portraitUrl:b.portraitUrl,xPct:Number(c.toFixed(1)),yPct:Number(k.toFixed(1)),color:Pe[_].color})})}else{let l=[{id:"player",name:i,isPlayer:!0,present:!0,portraitUrl:void 0},...o.map((m)=>({id:m.id,name:m.name,isPlayer:!1,present:m.present,portraitUrl:m.portraitUrl}))];l.forEach((m,b)=>{let I=b/l.length*Math.PI*2-Math.PI/2,c=50+Math.cos(I)*37,k=50+Math.sin(I)*35,_=m.isPlayer?void 0:a.characters[m.id],B=_?it(_).category??"neutral":"friend";P.push({id:m.id,name:m.name,isPlayer:m.isPlayer,present:m.present,portraitUrl:m.portraitUrl,xPct:Number(c.toFixed(1)),yPct:Number(k.toFixed(1)),color:Pe[B].color})})}let S=new Map(P.map((l)=>[l.id,l])),y=(l,m,b,I,c,k,_=0)=>{let B=(l.xPct+m.xPct)/2,R=(l.yPct+m.yPct)/2,E=m.xPct-l.xPct,D=m.yPct-l.yPct,H=Math.max(1,Math.hypot(E,D)),F=B+-D/H*_,j=R+E/H*_,O=document.createElementNS("http://www.w3.org/2000/svg","path");if(O.setAttribute("d",`M ${l.xPct} ${l.yPct} Q ${F.toFixed(1)} ${j.toFixed(1)} ${m.xPct} ${m.yPct}`),O.setAttribute("fill","none"),O.setAttribute("stroke",b),O.setAttribute("stroke-width","0.8"),O.setAttribute("stroke-opacity","0.82"),C.append(O),I.length>0){let W=0.25*l.xPct+0.5*F+0.25*m.xPct,K=0.25*l.yPct+0.5*j+0.25*m.yPct,z=e("div","ls-bw-edge-pill");z.style.setProperty("--ls-bond-color",b),z.style.left=`${Math.max(15,Math.min(85,W)).toFixed(1)}%`,z.style.top=`${Math.max(14,Math.min(86,K)).toFixed(1)}%`,z.title=c;for(let V of I)z.append(e("span","ls-bw-edge-line",V));z.addEventListener("click",(V)=>{V.stopPropagation(),k()}),w.append(z)}},u=(l,m,b,I)=>{let c=it(l),k=En(l),_=c.category??k.category??"neutral",B=Pe[_].color,E=[c.label&&c.label!=="Acquaintance"?c.label:k.label!=="Not defined yet"?k.label:c.label],D=`You → ${l.name}: ${k.label}
${l.name} → You: ${c.label}`;y(m,b,B,E,D,()=>Wa(t,l),I?-8:0)};if(ce==="player"){let l=S.get("player");for(let m of o){let b=S.get(m.id);if(b)u(m,l,b,!1)}}else if(ce!=="all"&&a.characters[ce]){let l=a.characters[ce],m=S.get(l.id),b=S.get("player");if(b)u(l,b,m,!1);for(let I of o){if(I.id===l.id)continue;let c=S.get(I.id);if(!c)continue;let k=l.peerBonds?.[I.id],_=I.peerBonds?.[l.id];if(!k&&!_)continue;let B=k?.category??_?.category??"neutral",R=[k?`${l.name} → ${I.name}: ${k.label}`:"",_?`${I.name} → ${l.name}: ${_.label}`:""].filter(Boolean),E=k?.label||_?.label||"Acquaintance";y(m,c,Pe[B].color,[E],R.join(`
`),()=>Ue(t,l,k),0)}}else{let l=S.get("player");for(let b of o){let I=S.get(b.id);if(I)u(b,l,I,!0)}let m=new Set;for(let b of o){let I=S.get(b.id);if(!I)continue;for(let c of Object.values(b.peerBonds??{})){let k=S.get(c.toId);if(!k)continue;let _=[b.id,c.toId].sort().join("::");if(m.has(_))continue;m.add(_);let B=a.characters[c.toId]?.peerBonds?.[b.id],R=c.category??B?.category??"neutral",E=[`${b.name} → ${c.toName}: ${c.label}`,...B?[`${c.toName} → ${b.name}: ${B.label}`]:[]];y(I,k,Pe[R].color,[c.label||B?.label||"Peer"],E.join(`
`),()=>Ue(t,b,c),16)}}}w.prepend(C);for(let l of P){let m=l.id===ce,b=e("button","ls-bw-node");b.type="button",b.dataset.focal=String(m),b.style.left=`${l.xPct}%`,b.style.top=`${l.yPct}%`,b.style.setProperty("--ls-bond-color",l.color),b.title=`Click to focus ${l.name}'s bonds`;let I=e("div","ls-bw-avatar");if(l.portraitUrl){let c=e("img");c.src=l.portraitUrl,c.alt=l.name,I.append(c)}else I.append(document.createTextNode(l.isPlayer?"\uD83D\uDC64":Es(l.name)));if(!l.isPlayer)I.append(e("span",`ls-roster-dot ${l.present?"is-present":"is-away"}`));b.append(I,e("span","ls-bw-name",l.name)),b.addEventListener("click",()=>{if(ce=l.isPlayer?"player":l.id,!l.isPlayer)t.selectedActorId=l.id;t.emitChange()}),w.append(b)}s.append(w)}let f=ce!=="player"&&ce!=="all"&&a.characters[ce]?[a.characters[ce]]:o,x=e("div","ls-stack");x.append(e("span","ls-kicker",`\uD83D\uDC64 Your Bonds (${i} ⇄ Cast)`));for(let w of f){let h=it(w),C=En(w),P=h.category??C.category??"neutral",S=Pe[P],y=e("div","ls-bw-pair-card");y.style.setProperty("--ls-bond-color",S.color);let u=e("div","ls-row-between"),l=e("div","ls-row");l.append(e("strong","",`${i} ⇄ ${w.name}`),e("span","ls-bw-cat-chip",`${S.icon} ${S.label}`)),l.lastElementChild.style.setProperty("--ls-bond-color",S.color);let m=e("div","ls-row");m.append(N("✏️ Edit Bond",()=>Wa(t,w),"ls-btn-sm"),N("\uD83E\uDEAA Dossier",()=>n(w.id),"ls-btn-sm ls-btn-primary")),u.append(l,m),y.append(u);let b=e("div","ls-bw-two-col"),I=e("div","ls-bw-dir-box");I.append(e("small","ls-kicker",`Your Bond → ${w.name}`),e("strong","",C.label),...C.note?[e("small","ls-muted",C.note)]:[]);let c=e("div","ls-bw-dir-box");c.append(e("small","ls-kicker",`${w.name}'s Bond → You`),e("strong","",h.label),...h.note?[e("small","ls-muted",h.note)]:[]),b.append(I,c),y.append(b),x.append(y)}s.append(x);let L=[],T=new Set;for(let w of f){for(let[h,C]of Object.entries(w.peerBonds??{})){let P=a.characters[h];if(!P)continue;let S=[w.id,P.id].sort().join("::");if(T.has(S))continue;T.add(S),L.push({a:w,b:P,aToB:C,bToA:P.peerBonds?.[w.id]})}for(let h of o){if(h.id===w.id)continue;let C=h.peerBonds?.[w.id];if(!C)continue;let P=[w.id,h.id].sort().join("::");if(T.has(P))continue;T.add(P),L.push({a:w,b:h,aToB:w.peerBonds?.[h.id],bToA:C})}}let A=e("div","ls-stack");if(A.append(e("span","ls-kicker",`\uD83E\uDD1D Cast Bonds (NPC ⇄ NPC · ${L.length})`)),!L.length)A.append(e("p","ls-muted",'No NPC-to-NPC bonds recorded yet. They appear automatically when characters have an established relation in the story, or click "+ Add NPC Bond" above.'));else for(let w of L){let h=w.aToB?.category??w.bToA?.category??"neutral",C=Pe[h],P=e("div","ls-bw-pair-card");P.style.setProperty("--ls-bond-color",C.color);let S=e("div","ls-row-between"),y=e("div","ls-row");y.append(e("strong","",`${w.a.name} ⇄ ${w.b.name}`),e("span","ls-bw-cat-chip",`${C.icon} ${C.label}`)),y.lastElementChild.style.setProperty("--ls-bond-color",C.color);let u=e("div","ls-row");u.append(N("✏️ Edit Bond",()=>Ue(t,w.a,w.aToB),"ls-btn-sm"),N("\uD83D\uDDD1️",()=>{let I=structuredClone(a.characters);if(I[w.a.id]?.peerBonds)delete I[w.a.id].peerBonds[w.b.id];if(I[w.b.id]?.peerBonds)delete I[w.b.id].peerBonds[w.a.id];t.request("state:mutate",{stateOverride:{characters:I},reason:`Removed bond ${w.a.name} ⇄ ${w.b.name}`})},"ls-btn-sm ls-btn-icon ls-btn-danger","Delete NPC bond")),S.append(y,u),P.append(S);let l=e("div","ls-bw-two-col"),m=e("div","ls-bw-dir-box");m.append(e("small","ls-kicker",`${w.a.name} → ${w.b.name}`),e("strong","",w.aToB?.label||"Not defined yet"),...w.aToB?.attitude?[e("small","ls-muted",w.aToB.attitude)]:[]);let b=e("div","ls-bw-dir-box");b.append(e("small","ls-kicker",`${w.b.name} → ${w.a.name}`),e("strong","",w.bToA?.label||"Not defined yet"),...w.bToA?.attitude?[e("small","ls-muted",w.bToA.attitude)]:[]),l.append(m,b),P.append(l),A.append(P)}return s.append(A),s}var Oa=new Map;function Xt(t){let n=t.trim();if(!n.startsWith("{")&&!n.startsWith("["))return null;try{let a=JSON.parse(n);return a&&typeof a==="object"?a:null}catch{return null}}function _s(t){let n=String(t??"").trim(),a=Xt(n);if(a&&Array.isArray(a.nodes)){let d=Math.max(0,Math.round(Number(a.sp??a.skillPoints??a.points??0)||0)),g=a.nodes.filter((v)=>Boolean(v&&typeof v==="object")).map((v)=>{let M=Math.max(0,Math.round(Number(v.level??0)||0)),f=Math.max(1,Math.round(Number(v.maxLevel??v.max??5)||5));return{name:String(v.name??"Skill").trim(),level:Math.min(f,M),maxLevel:f,cost:Math.max(1,Math.round(Number(v.cost??1)||1)),...typeof v.requires==="string"&&v.requires.trim()?{requires:v.requires.trim()}:{},...typeof v.bonus==="string"&&v.bonus.trim()?{bonus:v.bonus.trim()}:{},unlocked:M>0||v.unlocked===!0}});return{sp:d,nodes:g}}let s=0,o=n,i=n.match(/^(?:SP|Skill\s*Points?|Points?)\s*:\s*(\d+)\s*(?:\||;|\n|$)/i);if(i)s=Math.max(0,Math.round(Number(i[1])||0)),o=n.slice(i[0].length).trim();let p=[],r=o.split(/\s*(?:;|\n|\|)\s*/).map((d)=>d.trim()).filter(Boolean);for(let d of r){let g=d.match(/^([^(\[]+?)\s*(?:\(([^)]+)\)|\[([^\]]+)\])?$/),v=(g?.[1]??d).trim(),M=(g?.[2]??g?.[3]??"").trim();if(!v||/^(?:none|default)$/i.test(v))continue;let f=0,x=5,L=1,T="",A=[];for(let w of M.split(/\s*,\s*/).map((h)=>h.trim()).filter(Boolean)){let h=w.match(/^(?:lv\.?|lvl|rank)?\s*(\d+)\s*(?:\/\s*(\d+))?$/i),C=w.match(/^cost\s*:\s*(\d+)$/i),P=w.match(/^req(?:uires)?\s*:\s*(.+)$/i);if(h){if(f=Math.max(0,Number(h[1])||0),h[2])x=Math.max(1,Number(h[2])||5)}else if(C)L=Math.max(1,Number(C[1])||1);else if(P)T=P[1].trim();else A.push(w)}p.push({name:v,level:Math.min(x,f),maxLevel:x,cost:L,...T?{requires:T}:{},...A.length?{bonus:A.join(", ")}:{},unlocked:f>0})}return{sp:s,nodes:p}}function za(t){let n=t.nodes.map((a)=>{let s=[`Lv.${a.level}/${a.maxLevel}`,`cost:${a.cost}`];if(a.requires)s.push(`req:${a.requires}`);if(a.bonus)s.push(a.bonus);return`${a.name} (${s.join(", ")})`});return`SP: ${t.sp}${n.length?` | ${n.join(" ; ")}`:""}`}function lt(t,n,a,s){let o=_s(n),i=e("div","ls-rpg-skill-wrap"),p=e("div","ls-row-between"),r=e("span","ls-rpg-sp-badge",`✦ ${o.sp} Skill Point${o.sp===1?"":"s"}`);if(p.append(r),!a&&s){let v=e("div","ls-row");v.append(N("+1 SP",()=>{let M={...o,sp:o.sp+1};s(za(M),`Granted +1 SP to ${t.label}`)},"ls-btn-sm")),p.append(v)}if(i.append(p),!o.nodes.length)return i.append(e("small","ls-muted",'No skill nodes yet. Format: "SP: 2 | Slash (Lv.1/5, cost:1) ; Parry (Lv.0/3, cost:1, req:Slash)"')),i;let d=new Map(o.nodes.map((v)=>[v.name.toLowerCase(),v.level])),g=e("div","ls-rpg-skill-grid");for(let[v,M]of o.nodes.entries()){let f=!M.requires||(d.get(M.requires.toLowerCase())??0)>0,x=M.level>=M.maxLevel,L=!a&&Boolean(s)&&f&&!x&&o.sp>=M.cost,T=e("div","ls-rpg-skill-node");T.dataset.unlocked=String(M.level>0),T.dataset.lockedReq=String(!f),T.dataset.maxed=String(x);let A=e("div","ls-row-between");A.append(e("strong","",`${x?"★ ":M.level>0?"◆ ":"◇ "}${M.name}`),e("span","ls-chip ls-chip-accent",`Lv.${M.level}/${M.maxLevel}`)),T.append(A);let w=e("div","ls-clock-bar");w.style.gridTemplateColumns=`repeat(${Math.min(10,M.maxLevel)}, 1fr)`;for(let h=1;h<=Math.min(10,M.maxLevel);h++)w.append(e("span",`ls-clock-seg${h<=M.level?" is-filled":""}`));if(T.append(w),M.bonus||M.requires){let h=[M.requires?`${f?"✓":"\uD83D\uDD12"} Req: ${M.requires}`:"",M.bonus||""].filter(Boolean);T.append(e("small","ls-muted",h.join(" · ")))}if(!a&&s){let h=e("div","ls-row-between");h.append(e("small","ls-muted",x?"MASTERED":`Cost: ${M.cost} SP`));let C=N(x?"✓ Max":`+ Rank (${M.cost} SP)`,()=>{let P=o.nodes.map((y,u)=>u===v?{...y,level:y.level+1,unlocked:!0}:y),S={sp:Math.max(0,o.sp-M.cost),nodes:P};s(za(S),`Upgraded ${M.name} to Lv.${M.level+1}`)},`ls-btn-sm ${L?"ls-btn-primary":""}`);C.disabled=!L,h.append(C),T.append(h)}g.append(T)}return i.append(g),i}function Rs(t){let n=String(t??"").trim(),a=Xt(n);if(a&&!Array.isArray(a)){let g=Math.max(1,Math.round(Number(a.level??a.lv??1)||1)),v=Math.max(0,Math.round(Number(a.xp??a.current??0)||0)),M=Math.max(1,Math.round(Number(a.nextXp??a.max??g*100)||100));return{level:g,xp:v,nextXp:M,...typeof a.rank==="string"&&a.rank.trim()?{rank:a.rank.trim()}:{}}}let s=n.match(/(?:lv\.?|level)\s*(\d+)/i),o=n.match(/(\d+)\s*\/\s*(\d+)\s*(?:xp)?/i),i=n.match(/(?:rank|tier)\s*[:\-]?\s*([A-Za-z0-9+]+)/i),p=Math.max(1,Number(s?.[1]??1)||1),r=Math.max(0,Number(o?.[1]??(Number(n)||0))||0),d=Math.max(1,Number(o?.[2]??p*100)||100);return{level:p,xp:r,nextXp:d,...i?.[1]?{rank:i[1]}:{}}}function ct(t,n){let a=Rs(n),s=Math.max(0,Math.min(100,Math.round(a.xp/Math.max(1,a.nextXp)*100))),o=e("div","ls-rpg-xp-wrap"),i=e("div","ls-row-between"),p=e("span","ls-rpg-level-crest",`LV. ${a.level}`),r=e("div","ls-row");if(a.rank)r.append(e("span","ls-chip ls-chip-accent",`Rank ${a.rank}`));r.append(e("small","ls-muted",`${a.xp.toLocaleString()} / ${a.nextXp.toLocaleString()} XP (${s}%)`)),i.append(p,r);let d=e("div","ls-bar-track ls-rpg-xp-track"),g=e("div","ls-bar-fill");return g.style.width=`${s}%`,g.style.setProperty("--ls-bar-color",t.color||"var(--ls-primary)"),d.append(g),o.append(i,d),o}function Ns(t,n=20){let a=String(t??"").trim(),s=Xt(a);if(s&&!Array.isArray(s))return Object.entries(s).filter(([,i])=>Number.isFinite(Number(i))).map(([i,p])=>{let r=Number(p);return{name:i,value:r,max:Math.max(n,r)}});let o=[];for(let i of a.split(/[,;\n|]+/).map((p)=>p.trim()).filter(Boolean)){let p=i.match(/^([A-Za-z0-9_ .-]{1,20})\s*[:=]\s*(-?\d+(?:\.\d+)?)(?:\s*\/\s*(\d+))?$/);if(p){let r=Number(p[2]),d=p[3]?Math.max(1,Number(p[3])):Math.max(n,r);o.push({name:p[1].trim(),value:r,max:d})}}return o}function Bs(t,n){let s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.setAttribute("viewBox","0 0 220 190"),s.classList.add("ls-rpg-radar-svg");let o=110,i=96,p=62,r=t.length;for(let v of[0.33,0.66,1]){let M=t.map((x,L)=>{let T=L/r*Math.PI*2-Math.PI/2;return`${(o+Math.cos(T)*p*v).toFixed(1)},${(i+Math.sin(T)*p*v).toFixed(1)}`}),f=document.createElementNS("http://www.w3.org/2000/svg","polygon");f.setAttribute("points",M.join(" ")),f.setAttribute("fill","none"),f.setAttribute("stroke","rgba(148,163,184,0.28)"),f.setAttribute("stroke-width","1"),s.append(f)}let d=[];t.forEach((v,M)=>{let f=M/r*Math.PI*2-Math.PI/2,x=Math.max(0.1,Math.min(1,v.value/Math.max(1,v.max))),L=o+Math.cos(f)*p*x,T=i+Math.sin(f)*p*x;d.push(`${L.toFixed(1)},${T.toFixed(1)}`);let A=document.createElementNS("http://www.w3.org/2000/svg","line");A.setAttribute("x1",String(o)),A.setAttribute("y1",String(i)),A.setAttribute("x2",(o+Math.cos(f)*p).toFixed(1)),A.setAttribute("y2",(i+Math.sin(f)*p).toFixed(1)),A.setAttribute("stroke","rgba(148,163,184,0.22)"),A.setAttribute("stroke-width","1"),s.append(A);let w=document.createElementNS("http://www.w3.org/2000/svg","text");w.setAttribute("x",(o+Math.cos(f)*(p+17)).toFixed(1)),w.setAttribute("y",(i+Math.sin(f)*(p+14)+3).toFixed(1)),w.setAttribute("text-anchor","middle"),w.setAttribute("fill","currentColor"),w.setAttribute("font-size","9.5"),w.setAttribute("font-weight","700"),w.textContent=`${v.name.slice(0,6)} ${v.value}`,s.append(w)});let g=document.createElementNS("http://www.w3.org/2000/svg","polygon");return g.setAttribute("points",d.join(" ")),g.setAttribute("fill",n),g.setAttribute("fill-opacity","0.26"),g.setAttribute("stroke",n),g.setAttribute("stroke-width","2"),s.append(g),s}function dt(t,n,a){let s=Ns(n,t.max>0?t.max:20),o=e("div","ls-stack");if(o.style.gap="6px",!s.length)return o.append(e("small","ls-muted",String(n||"STR:10, DEX:10, INT:10, CHA:10"))),o;let i=`${a}:${t.id}`,p=Oa.get(i)??!1,r=e("div"),d=()=>{if(r.replaceChildren(),p&&s.length>=3){let v=e("div","ls-rpg-radar-box");v.append(Bs(s,t.color||"var(--ls-primary)")),r.append(v);return}let g=e("div","ls-rpg-attr-grid");for(let v of s){let M=e("div","ls-rpg-attr-cell"),f=Math.floor((v.value-10)/2),x=v.max<=30?f>=0?`+${f}`:String(f):"";M.append(e("span","ls-kicker",v.name),e("strong","ls-rpg-attr-val",String(v.value)),...x?[e("small","ls-muted",`(${x})`)]:[]),g.append(M)}r.append(g)};if(s.length>=3){let g=e("div","ls-row-between");g.append(e("small","ls-muted",`${s.length} Core Attributes`),N(p?"⊞ Grid View":"\uD83D\uDD78️ Radar Chart",()=>{p=!p,Oa.set(i,p),d()},"ls-btn-sm")),o.append(g)}return d(),o.append(r),o}function Ds(t){let n=String(t??"").trim(),a=Xt(n);if(Array.isArray(a))return a.filter((o)=>o&&typeof o==="object"&&o.name).map((o)=>({name:String(o.name),qty:Math.max(1,Number(o.qty??o.quantity??1)||1),rarity:Va(String(o.rarity??"common")),equipped:Boolean(o.equipped),...typeof o.note==="string"?{note:o.note}:{}}));let s=[];for(let o of n.split(/\s*(?:;|\n|\|)\s*/).map((i)=>i.trim()).filter(Boolean)){if(/^(?:none|empty)$/i.test(o))continue;let i=o.match(/^([^\[\]()]+?)(?:\s*x(\d+))?\s*(?:\[([^\]]+)\]|\(([^)]+)\))?$/i),p=(i?.[1]??o).trim(),r=Math.max(1,Number(i?.[2]??1)||1),d=(i?.[3]??i?.[4]??"").toLowerCase(),g=/\b(?:equipped|worn|active|main|offhand)\b/.test(d),v=Va(d);s.push({name:p,qty:r,rarity:v,equipped:g})}return s}function Va(t){if(/legendary|mythic|gold/.test(t))return"legendary";if(/epic|violet|purple/.test(t))return"epic";if(/rare|blue/.test(t))return"rare";if(/uncommon|green/.test(t))return"uncommon";return"common"}function pt(t){let n=Ds(t);if(!n.length)return e("small","ls-muted","Bag empty");let a=e("div","ls-rpg-loot-grid");for(let s of n){let o=e("div","ls-rpg-loot-card");o.dataset.rarity=s.rarity;let i=e("div","ls-row-between");if(i.append(e("strong","",`${s.equipped?"⚔️ ":"\uD83C\uDF92 "}${s.name}`),e("span","ls-chip",s.qty>1?`×${s.qty}`:s.rarity.toUpperCase())),o.append(i),s.equipped||s.rarity!=="common")o.append(e("small","ls-muted",[s.equipped?"Equipped":"",s.rarity!=="common"?s.rarity:""].filter(Boolean).join(" · ")));a.append(o)}return a}function Hs(t){let n=String(t??"").trim();if(!n||/^(?:none|normal|healthy|clear)$/i.test(n))return[];let a=[];for(let s of n.split(/\s*(?:;|,|\n|\|)\s*/).map((o)=>o.trim()).filter(Boolean)){let o="neutral",i=s;if(i.startsWith("+"))o="buff",i=i.slice(1).trim();else if(i.startsWith("-"))o="debuff",i=i.slice(1).trim();else if(/\b(?:burn|poison|bleed|stun|curse|tired|fluster|exhaust|wound|fear)\b/i.test(i))o="debuff";else if(/\b(?:shield|haste|bless|focus|regen|guard|inspir|armor|ward)\b/i.test(i))o="buff";let p=i.match(/^(.+?)\s*\(([^)]+)\)$/);a.push({name:(p?.[1]??i).trim(),kind:o,...p?.[2]?{duration:p[2].trim()}:{}})}return a}function ut(t){let n=Hs(t);if(!n.length)return e("small","ls-muted","No active effects");let a=e("div","ls-row");for(let s of n){let o=e("span","ls-rpg-fx-pill",`${s.kind==="buff"?"▲":s.kind==="debuff"?"▼":"●"} ${s.name}${s.duration?` (${s.duration})`:""}`);o.dataset.fxKind=s.kind,a.append(o)}return a}function mt(t,n,a,s,o){let i=Math.max(1,Math.min(10,t.max||5)),p=t.max>10?Math.round(n/Math.max(1,t.max)*i):Math.max(0,Math.min(i,Math.round(n))),r=e("div","ls-row");for(let d=1;d<=i;d++){let g=a&&d<=p,v=N(g?"❤️":"\uD83E\uDD0D",()=>{if(!s&&o){let M=t.max>10?Math.round((d===p?d-1:d)/i*t.max):d===p?d-1:d;o(M)}},"ls-btn-sm ls-btn-icon ls-rpg-heart-btn",`${t.label}: ${d}/${i}`);v.disabled=s||!o,r.append(v)}return r}function ft(t,n,a){let s=Number(n),o=Number.isFinite(s)?s.toLocaleString():String(n),i=e("div","ls-rpg-currency-box");if(i.append(e("strong","ls-rpg-currency-val",`${t.icon} ${o}`)),a!==0)i.append(e("span",`ls-delta ${a>0?"is-pos":"is-neg"}`,a>0?`+${a.toLocaleString()}`:a.toLocaleString()));return i}function Yt(t,n){t.modals.open({title:"\uD83D\uDD0A Multi-Voice TTS Director — Cast & Narrator Voices",width:680,maxHeight:800},(a,s,o,i)=>{let p=async()=>{i.clear(),a.replaceChildren(e("p","ls-muted","⏳ Loading Lumiverse TTS connections & voice catalogs…"));let r=await t.tts.listConnections(),d=t.settings,{state:g}=t.snapshot,v=Object.values(g.characters),M=d?.narratorConnectionId||r.find((l)=>l.is_default)?.id||r[0]?.id||"",f=M?await t.tts.listVoicesForConnection(M):[];a.replaceChildren();let x=e("section","ls-card"),L=e("div","ls-row-between");L.append(e("div","",""),e("span","ls-chip ls-chip-accent",`⚡ Cached Hits: ${t.tts.cacheHitCount} (0 Tokens Re-billed)`)),L.firstElementChild.append(e("span","ls-kicker","2-Tier Memory + IndexedDB Audio Cache"),e("h3","","\uD83C\uDF99️ Narrator & Reading Mode (Token Saver)")),x.append(L);let T=e("div","ls-row"),A=d?.ttsReadMode||"dialogue_only";for(let[l,m]of[["dialogue_only","\uD83D\uDCAC Dialogue Only (Recommended — Saves ~65% TTS Tokens)"],["narration_and_dialogue","\uD83D\uDCD6 Full Audiobook (Narrator + Character Voices)"],["narration_only","\uD83D\uDCDC Narration Only"]]){let b=N(m,()=>{t.request("settings:update",{settings:{ttsReadMode:l}}).then(()=>{p()})},"ls-btn-sm");if(A===l)b.setAttribute("aria-current","page");T.append(b)}if(x.append(T),!r.length){x.append(e("p","ls-muted","No TTS connections found yet. Create a TTS connection in Lumiverse (Connections → TTS Connections, e.g. Kokoro, ElevenLabs, OpenAI, or Google) to enable voice synthesis.")),a.append(x);return}let w=e("div","ls-grid"),h=e("div","ls-label","Narrator TTS Connection"),C=e("div");h.append(C);let P=e("label","ls-label","Narrator Voice ID"),S=e("input","ls-input");if(S.placeholder=f[0]?.id||"Default connection voice…",S.value=d?.narratorVoiceId||"",P.append(S),f.length>0){let l=e("div");l.style.marginTop="4px",P.append(l),J(t,i,l,{value:d?.narratorVoiceId||"",placeholder:"— Pick from connection voices —",ariaLabel:"Narrator Voice Catalog",options:[{value:"",label:"— Pick from connection voices —"},...f.map((m)=>({value:m.id,label:`${m.name} (${m.id})`}))],onChange:(m)=>{if(m)S.value=m}})}J(t,i,C,{value:d?.narratorConnectionId||"",ariaLabel:"Narrator TTS Connection",options:[{value:"",label:"Use Default Lumiverse TTS Connection"},...r.map((l)=>({value:l.id,label:`${l.name} (${l.provider}${l.voice?` · ${l.voice}`:""})`}))],onChange:(l)=>{t.request("settings:update",{settings:{narratorConnectionId:l}}).then(()=>void p())}}),w.append(h,P),x.append(w);let y=e("div","ls-row");y.append(N("\uD83D\uDCBE Save Narrator Voice",()=>{t.request("settings:update",{settings:{narratorVoiceId:S.value.trim()}}),t.notify("Saved Narrator TTS voice.")},"ls-btn-sm ls-btn-primary"),N("▶ Test Narrator",()=>{t.tts.playSegments([{kind:"narration",text:`The scene unfolds in ${g.scene.location||"the story"}.`,speakerName:"Narrator",connectionId:d?.narratorConnectionId||"",voiceId:S.value.trim(),speed:d?.narratorSpeed||1}])},"ls-btn-sm")),x.append(y),a.append(x);let u=e("section","ls-card");if(u.append(e("span","ls-kicker","Per-Character Voice Profiles"),e("h3","",`\uD83D\uDC65 Cast Voices (${v.length} Characters)`),e("p","ls-muted","Assign each character their own distinct voice and speed. Quoted lines spoken by that character automatically route to their voice.")),!v.length)u.append(e("p","ls-muted","No characters in the cast yet."));else{let l=n?[...v.filter((m)=>m.id===n),...v.filter((m)=>m.id!==n)]:v;for(let m of l){let b=e("div","ls-stat-cell");if(m.id===n)b.style.borderColor="var(--ls-primary)";let I=m.ttsVoice??{},c=I.connectionId||M,k=c?await t.tts.listVoicesForConnection(c):f,_=e("div","ls-row-between");_.append(e("strong","",`${m.present?"\uD83D\uDFE2":"⚪"} ${m.name} (${m.roleSummary||"Cast"})`),e("span","ls-chip ls-chip-accent",I.voiceId?`\uD83D\uDD0A ${I.voiceId}`:"Default Voice")),b.append(_);let B=e("div","ls-grid"),R=e("div"),E=e("div"),D=e("input","ls-input");D.placeholder="Voice ID (or pick below)…",D.value=I.voiceId||"";let H=J(t,i,E,{value:I.voiceId||"",ariaLabel:`Voice for ${m.name}`,options:[{value:"",label:"— Select Voice from Catalog —"},...k.map((W)=>({value:W.id,label:`${W.name} (${W.id})`}))],onChange:(W)=>{if(W)D.value=W}}),F=J(t,i,R,{value:I.connectionId||"",ariaLabel:`TTS Connection for ${m.name}`,options:[{value:"",label:"Default TTS Connection"},...r.map((W)=>({value:W.id,label:`${W.name} (${W.provider})`}))],onChange:async(W)=>{let K=await t.tts.listVoicesForConnection(W||M);H.setOptions([{value:"",label:"— Select Voice from Catalog —"},...K.map((z)=>({value:z.id,label:`${z.name} (${z.id})`}))],"")}}),j=e("input","ls-input");j.type="number",j.min="0.5",j.max="2.0",j.step="0.1",j.value=String(I.speed??1),j.title="Playback Speed (0.5x – 2.0x)",B.append(R,D,E,j),b.append(B);let O=e("div","ls-row");O.append(N("\uD83D\uDCBE Save Voice",()=>{let W={connectionId:F.getValue()||void 0,voiceId:D.value.trim()||void 0,speed:Math.max(0.5,Math.min(2,Number(j.value)||1))},K=structuredClone(g.characters);if(K[m.id])K[m.id].ttsVoice=W,t.request("state:mutate",{stateOverride:{characters:K},reason:`Updated TTS voice for ${m.name}`}).then(()=>void p())},"ls-btn-sm ls-btn-primary"),N("▶ Test Voice",()=>{let W=m.innerThought||`Hello, I am ${m.name}.`;t.tts.playSegments([{kind:"dialogue",text:W,speakerName:m.name,actorId:m.id,connectionId:F.getValue()||void 0,voiceId:D.value.trim()||void 0,speed:Math.max(0.5,Math.min(2,Number(j.value)||1))}])},"ls-btn-sm")),b.append(O),u.append(b)}}a.append(u)};p(),o.onDismiss(()=>t.tts.stop())})}var ja={player_attire:{title:"Player Attire / Presentation",defaultIcon:"\uD83D\uDC55",defaultLabel:"Your Current Attire / Presentation",toggleKey:"trackPlayerAttire",labelKey:"playerAttireLabel",instructionKey:"playerAttireInstruction",showCardKey:"showPlayerAttireCard",supportsCardDisplay:!0},player_condition:{title:"Player Physical / Mental Condition",defaultIcon:"\uD83E\uDE7A",defaultLabel:"Physical / Mental Condition",toggleKey:"trackPlayerCondition",labelKey:"playerConditionLabel",instructionKey:"playerConditionInstruction",showCardKey:"showPlayerConditionCard",supportsCardDisplay:!0},player_action:{title:"Player Latest Notable Action",defaultIcon:"⚡",defaultLabel:"Latest Notable Action",toggleKey:"trackPlayerAction",labelKey:"playerActionLabel",instructionKey:"playerActionInstruction",supportsCardDisplay:!0},scene_summary:{title:"Scene Beat Summary",defaultIcon:"\uD83D\uDCD6",defaultLabel:"Scene Beat Summary",toggleKey:"trackSceneSummary",labelKey:"sceneSummaryLabel",instructionKey:"sceneSummaryInstruction",showCardKey:"showSceneSummaryInWidget",supportsCardDisplay:!0},places:{title:"Spatial Atlas (Places, Zones & Paths)",defaultIcon:"\uD83D\uDDFA️",defaultLabel:"Spatial Atlas & Locations",toggleKey:"trackPlaces",instructionKey:"placesInstruction",supportsCardDisplay:!1},quests:{title:"Quests & Objectives",defaultIcon:"\uD83C\uDFAF",defaultLabel:"Quests & Objectives",toggleKey:"trackQuests",instructionKey:"questsInstruction",showCardKey:"showQuestsInWidget",supportsCardDisplay:!1},dispatches:{title:"Off-Screen Dispatches",defaultIcon:"\uD83D\uDCE1",defaultLabel:"Off-Screen Dispatches",toggleKey:"trackDispatches",instructionKey:"dispatchesInstruction",showCardKey:"showDispatchesInWidget",supportsCardDisplay:!1},npc_conditions:{title:"NPC Conditions & Status Tags",defaultIcon:"⚡",defaultLabel:"NPC Conditions",toggleKey:"trackNpcConditions",instructionKey:"npcConditionsInstruction",supportsCardDisplay:!1},npc_secrets:{title:"NPC Secrets & Clues",defaultIcon:"\uD83D\uDD75️",defaultLabel:"NPC Secrets & Clues",toggleKey:"trackNpcSecrets",instructionKey:"npcSecretsInstruction",supportsCardDisplay:!1}};function ht(t,n){let a=wt(),s={...a,...t??{}},o=ja[n],i=s.overrides?.[n]??{},p=s[o.toggleKey]!==!1,r=o.showCardKey?s[o.showCardKey]!==!1:!0,d=i.label||(o.labelKey?String(s[o.labelKey]??""):"")||o.defaultLabel,g=i.instruction??String(s[o.instructionKey]??a[o.instructionKey]??"");return{enabled:p,showCard:r,icon:i.icon||o.defaultIcon,label:d,instruction:g,color:i.color||"var(--lumiverse-primary)",displayStyle:i.displayStyle??"auto",layoutSpan:i.layoutSpan??"full",widgetTabId:i.widgetTabId??(n==="quests"||n==="dispatches"?"world":"stats"),inlineTabId:i.inlineTabId??(n==="quests"||n==="dispatches"?"world":"stats"),pinnedToHeader:Boolean(i.pinnedToHeader),locked:Boolean(i.locked)}}function Ae(t){let n=structuredClone(t.snapshot.template),a=wt(),s={...a,...n.coreTrackers??{}};t.modals.open({title:"\uD83D\uDCCD Customize Scene Pill & AI Prompt Rules (Date, Time, Location, Weather)",width:640,maxHeight:820},(o,i,p,r)=>{let d={...n.theme.showSceneChips},g=Boolean(s.scenePillLocked),v=e("section","ls-card");v.append(e("span","ls-kicker","Visible Pill Chips & Lock"),e("p","ls-muted","Choose which scene tokens appear in the Scene Pill & Header, or lock the pill so AI turns never alter the clock/location."));let M=e("div","ls-grid");for(let[u,l]of[["location","\uD83D\uDCCD Location"],["time","\uD83D\uDD70️ Clock Time"],["date","\uD83D\uDCC5 Date / Era"],["weather","\uD83C\uDF26️ Weather"],["cast","\uD83D\uDC64 Present Cast"],["pinnedStats","\uD83D\uDCCC Pinned Stats"]]){let m=e("div","ls-row-between ls-stat-cell");m.append(e("span","",l));let b=e("div");m.append(b),me(t,r,b,{checked:Boolean(d[u]),ariaLabel:l,onChange:(I)=>{d[u]=I}}),M.append(m)}let f=e("div","ls-row-between ls-stat-cell");f.append(e("span","","\uD83D\uDD12 Lock Scene Pill (Prevent AI from changing Date/Time/Location/Weather)"));let x=e("div");f.append(x),me(t,r,x,{checked:g,ariaLabel:"Lock Scene Pill",onChange:(u)=>{g=u}}),v.append(M,f),o.append(v);let L=e("div");o.append(L);let T=fe(t,r,L,{title:"AI Extraction Prompts for Pill Fields (Location, Time, Date, Weather)",iconName:"sliders",defaultExpanded:!0}),A=(u,l,m)=>{let b=e("div","ls-label"),I=e("div","ls-row-between"),c=e("textarea","ls-input");return c.rows=2,c.value=l,c.placeholder=m,I.append(e("span","",u),N("⛶ Full-Screen",()=>{t.request("textEditor:open",{title:`Scene Pill Prompt: ${u}`,value:c.value,placeholder:m}).then((k)=>{if(!k.cancelled&&typeof k.text==="string")c.value=k.text})},"ls-btn-sm")),b.append(I,c),T.append(b),c},w=A("\uD83D\uDCCD Location Prompt Rule",s.sceneLocationInstruction??a.sceneLocationInstruction??"",'e.g. Format as "Room, Building" or "Landmark, District".'),h=A("\uD83D\uDD70️ Time Prompt Rule",s.sceneTimeInstruction??a.sceneTimeInstruction??"",'e.g. Use 24-hour military clock, or narrative time like "Late Evening".'),C=A("\uD83D\uDCC5 Date / Era Prompt Rule",s.sceneDateInstruction??a.sceneDateInstruction??"",'e.g. Format as "Year 412, Frostfall 14" or "Oct 14, 2002".'),P=A("\uD83C\uDF26️ Weather & Atmosphere Prompt Rule",s.sceneWeatherInstruction??a.sceneWeatherInstruction??"",'e.g. Keep to 2–4 vivid words like "Neon Drizzle" or "Warm Indoor Steam".'),S=A('⏱️ Time Progression ("mins") Prompt Rule',s.sceneTimeFlowInstruction??a.sceneTimeFlowInstruction??"","e.g. Estimate realistic elapsed minutes per turn."),y=e("div","ls-row-between");y.style.marginTop="12px",y.append(N("↺ Reset Default Prompts",()=>{w.value=a.sceneLocationInstruction??"",h.value=a.sceneTimeInstruction??"",C.value=a.sceneDateInstruction??"",P.value=a.sceneWeatherInstruction??"",S.value=a.sceneTimeFlowInstruction??""},"ls-btn-sm"),N("\uD83D\uDCBE Save Scene Pill Config",()=>{t.request("state:mutate",{templatePatch:{theme:{...n.theme,showSceneChips:d},coreTrackers:{...s,scenePillLocked:g,sceneLocationInstruction:w.value.trim(),sceneTimeInstruction:h.value.trim(),sceneDateInstruction:C.value.trim(),sceneWeatherInstruction:P.value.trim(),sceneTimeFlowInstruction:S.value.trim()}},reason:"Updated Scene Pill prompt rules & visibility"}),t.notify("Saved Scene Pill prompt rules."),i()},"ls-btn-primary")),o.append(y)})}function Qt(t,n){let a=structuredClone(t.snapshot.template),s=wt(),o={...s,...a.coreTrackers??{},overrides:{...a.coreTrackers?.overrides??{}}},i=ja[n],p=ht(o,n);t.modals.open({title:`✏️ Full Edit Built-In Tracker: ${i.title}`,width:640,maxHeight:820},(r,d,g,v)=>{let{enabled:M,showCard:f}=p,x=Boolean(p.locked),L=p.displayStyle??"auto",T=p.layoutSpan??"full",A=p.color||"var(--lumiverse-primary)",w=p.widgetTabId||"stats",h=p.inlineTabId||"stats",C=e("div","ls-grid"),P=e("label","ls-label","Icon"),S=e("input","ls-input");S.value=p.icon||i.defaultIcon,P.append(S);let y=e("label","ls-label","Display Label"),u=e("input","ls-input");u.value=p.label||i.defaultLabel,y.append(u),C.append(P,y),r.append(C);let l=e("div","ls-grid"),m=e("div","ls-row-between ls-stat-cell");m.append(e("span","","✓ Track in AI Prompts"));let b=e("div");if(m.append(b),me(t,v,b,{checked:M,onChange:(q)=>{M=q}}),l.append(m),i.supportsCardDisplay){let q=e("div","ls-row-between ls-stat-cell");q.append(e("span","","\uD83E\uDE9F Show Card in Widget / Inline"));let X=e("div");q.append(X),me(t,v,X,{checked:f,onChange:(te)=>{f=te}}),l.append(q)}let I=e("div","ls-row-between ls-stat-cell");I.append(e("span","","\uD83D\uDD12 Lock Value (Skip AI Updates)"));let c=e("div");I.append(c),me(t,v,c,{checked:x,onChange:(q)=>{x=q}}),l.append(I),r.append(l);let k=e("div");r.append(k);let _=fe(t,v,k,{title:"Display Style, Color & Tab Routing",iconName:"palette",defaultExpanded:!0}),B=e("div","ls-grid"),R=e("div","ls-label","Visual Display Style"),E=e("div");R.append(E),J(t,v,E,{value:L,ariaLabel:"Visual Display Style",options:[{value:"auto",label:"✨ Smart Auto-Detect"},{value:"arc_tracker",label:"\uD83C\uDFAF Multi-Thread / Arc / Quest Cards"},{value:"accordion_cards",label:"\uD83D\uDDC2️ Collapsible Multi-Entry Cards"},{value:"matrix_badges",label:"⚖️ Split / Versus Comparison (Knows vs Blind)"},{value:"meter_mini_bars",label:"\uD83D\uDCCA Multi-Bar Mini Gauges (HP/MP cur/max)"},{value:"stat_pills_grid",label:"\uD83E\uDDEC Compact Stat Badges (Lv / P A I / POW)"},{value:"bullet_ledger",label:"\uD83D\uDCB0 Aligned Bullet & Currency Ledger"},{value:"timeline_list",label:"\uD83D\uDCDC Vertical Event Timeline"},{value:"checklist",label:"☑️ Visual Objectives Checklist"},{value:"feed_cards",label:"\uD83C\uDCCF Structured Flow Cards"},{value:"step_chain",label:"⛓️ Horizontal Step Chain"},{value:"key_value",label:"\uD83D\uDCCB Key–Value Table"},{value:"pill_list",label:"\uD83C\uDFF7️ Tag / Pill List"},{value:"quote_callout",label:"\uD83D\uDCAD Quote Callout Box"}],onChange:(q)=>{L=q}});let D=e("div","ls-label","Card Grid Width"),H=e("div");if(D.append(H),J(t,v,H,{value:T,ariaLabel:"Card Grid Width",options:[{value:"full",label:"↔️ Full Width"},{value:"auto",label:"\uD83D\uDCD0 Auto"},{value:"half",label:"▫ Compact Column"}],onChange:(q)=>{T=q}}),B.append(R,D),_.append(B),i.supportsCardDisplay){let q=e("div","ls-grid"),X=e("div","ls-label","Widget Tab"),te=e("div");X.append(te),J(t,v,te,{value:w,ariaLabel:"Widget Tab",options:a.surfaces.widgetTabs.map((Q)=>({value:Q.id,label:`${Q.icon} ${Q.label}`})),onChange:(Q)=>{w=Q}});let ae=e("div","ls-label","Inline Ribbon Tab"),Y=e("div");ae.append(Y),J(t,v,Y,{value:h,ariaLabel:"Inline Ribbon Tab",options:a.surfaces.inlineTabs.map((Q)=>({value:Q.id,label:`${Q.icon} ${Q.label}`})),onChange:(Q)=>{h=Q}}),q.append(X,ae),_.append(q)}let F=e("div","ls-label","Accent Color"),j=e("div","ls-row"),O=()=>{for(let q of[...j.querySelectorAll(".ls-color-swatch")])q.setAttribute("aria-pressed",String(q.dataset.colorVal===A))};for(let[q,X,te]of[["var(--lumiverse-primary)","Theme Primary","var(--lumiverse-primary, #38bdf8)"],["#38bdf8","Sky","#38bdf8"],["#f472b6","Rose","#f472b6"],["#f59e0b","Amber","#f59e0b"],["#10b981","Emerald","#10b981"],["#a78bfa","Violet","#a78bfa"],["#f43f5e","Crimson","#f43f5e"]]){let ae=N("",()=>{A=q,O()},"ls-color-swatch",X);ae.dataset.colorVal=q,ae.style.background=te,j.append(ae)}O(),F.append(j),_.append(F);let W=e("div");r.append(W);let K=fe(t,v,W,{title:"AI Extraction Prompt Rule",iconName:"sparkles",defaultExpanded:!0}),z=e("div","ls-row-between"),V=e("textarea","ls-input");V.rows=3,V.value=p.instruction??"",V.placeholder="Tell the AI exactly how and when to extract or format this tracker…",z.append(e("span","ls-muted","Prompt instruction sent to the AI extractor:"),N("⛶ Full-Screen Editor",()=>{t.request("textEditor:open",{title:`Built-In Prompt: ${u.value||i.title}`,value:V.value,placeholder:"Describe formatting, triggers, and when the AI should update this built-in tracker…"}).then((q)=>{if(!q.cancelled&&typeof q.text==="string")V.value=q.text})},"ls-btn-sm")),K.append(z,V);let G=e("div","ls-row-between");G.style.marginTop="12px",G.append(N("↺ Reset Default",()=>{S.value=i.defaultIcon,u.value=i.defaultLabel,V.value=String(s[i.instructionKey]??""),A="var(--lumiverse-primary)",L="auto",T="full",O()},"ls-btn-sm"),N("\uD83D\uDCBE Save Built-In Tracker",()=>{let q=u.value.trim()||i.defaultLabel,X=V.value.trim(),te={...o,[i.toggleKey]:M,...i.labelKey?{[i.labelKey]:q}:{},[i.instructionKey]:X,...i.showCardKey?{[i.showCardKey]:f}:{},overrides:{...o.overrides??{},[n]:{icon:S.value.trim()||i.defaultIcon,label:q,instruction:X,color:A,displayStyle:L,layoutSpan:T,widgetTabId:w,inlineTabId:h,locked:x}}};t.request("state:mutate",{templatePatch:{coreTrackers:te},reason:`Customized built-in tracker "${q}"`}),t.notify(`Saved "${q}".`),d()},"ls-btn-primary")),r.append(G)})}var qe={id:"zone_local",name:"Local Area",kind:"building",icon:"\uD83D\uDDFA️",color:"#38bdf8",description:""};function At(t){let n=new Map;for(let a of t.mapPaths??[]){if(!t.places[a.fromId]||!t.places[a.toId]||a.fromId===a.toId)continue;let[s,o]=[a.fromId,a.toId].sort(),i=`${s}__${o}`;n.set(i,{...a,id:i,fromId:s,toId:o})}for(let a of Object.values(t.places))for(let s of a.connectedIds){if(!t.places[s]||s===a.id)continue;let[o,i]=[a.id,s].sort(),p=`${o}__${i}`;if(!n.has(p)){let r=t.places[s],d=(a.zoneId||"zone_local")===(r.zoneId||"zone_local");n.set(p,{id:p,fromId:o,toId:i,pathType:d?"door":"street",travelMinutes:Math.max(1,r.travelMinutes||a.travelMinutes||5)})}}return[...n.values()]}function gt(t,n){let a=t.currentPlaceId||Object.keys(t.places)[0]||"";if(!a||!t.places[n])return null;if(a===n)return{pathIds:[a],totalMinutes:0};let s=At(t),o=new Map;for(let p of s)(o.get(p.fromId)??o.set(p.fromId,[]).get(p.fromId)).push({to:p.toId,mins:Math.max(1,p.travelMinutes||5),locked:Boolean(p.locked)}),(o.get(p.toId)??o.set(p.toId,[]).get(p.toId)).push({to:p.fromId,mins:Math.max(1,p.travelMinutes||5),locked:Boolean(p.locked)});let i=(p)=>{let r=new Map([[a,0]]),d=new Map,g=new Set;while(!0){let v=null,M=1/0;for(let[f,x]of r.entries())if(!g.has(f)&&x<M)v=f,M=x;if(!v)return null;if(v===n){let f=[v];while(d.has(f[0]))f.unshift(d.get(f[0]));return{pathIds:f,totalMinutes:M}}g.add(v);for(let f of o.get(v)??[]){if(!p&&f.locked)continue;let x=M+f.mins;if(x<(r.get(f.to)??1/0))r.set(f.to,x),d.set(f.to,v)}}};return i(!1)??i(!0)}function Ua(t,n,a){let s=Object.values(t.places);if(!s.length)return{zones:[],nodes:[],edges:[]};let o=t.currentPlaceId||s[0].id,i={...t.mapZones??{}},p=(b)=>{let I=b.zoneId||qe.id;if(i[I])return i[I];if(I===qe.id)return i[I]={...qe,name:t.title&&t.title!=="Uncharted Story"?t.title:"Local Area"},i[I];return i[I]={id:I,name:I.replace(/[_-]+/g," ").replace(/\b\w/g,(c)=>c.toUpperCase()),kind:b.category==="region"?"region":"building",icon:b.category==="region"?"\uD83C\uDFD4️":"\uD83C\uDFDB️",color:"#38bdf8",description:""},i[I]},r=(a?s.filter((b)=>(b.zoneId||qe.id)===a):s).slice(0,18),d=new Map;for(let b of r){let I=p(b),c=d.get(I.id);if(!c)c={zone:I,places:[]},d.set(I.id,c);c.places.push(b)}let g=[...d.values()],v=g.length,M=1000,f=580,x=22,L=v<=1?1:v<=4?2:3,T=Math.ceil(v/L),A=22,w=Math.floor((M-x*2-A*(L-1))/L),h=Math.floor((f-x*2-A*(T-1))/T),C=n&&n!==o?gt(t,n):null,P=new Set(C?.pathIds??[]),S=Object.values(t.quests).filter((b)=>b.status==="active"),y=[],u=[];g.forEach((b,I)=>{let c=I%L,k=Math.floor(I/L),_=x+c*(w+A),B=x+k*(h+A);y.push({zone:b.zone,x:_,y:B,w,h,placeIds:b.places.map((W)=>W.id),containsCurrent:b.places.some((W)=>W.id===o)});let R=b.places.length,E=B+46,D=Math.max(80,h-58),H=_+18,F=Math.max(120,w-36),j=R===1?1:R<=4?2:3,O=Math.ceil(R/j);b.places.forEach((W,K)=>{let z=K%j,V=Math.floor(K/j),G=F/j,q=D/O,X=Math.round(H+G*(z+0.5)),te=Math.round(E+q*(V+0.5)),ae=Object.values(t.characters).filter((Q)=>Q.present?W.id===o:Q.locationId===W.id).map((Q)=>({id:Q.id,name:Q.name,portraitUrl:Q.portraitUrl})),Y=S.filter((Q)=>`${Q.title} ${Q.summary}`.toLowerCase().includes(W.name.toLowerCase())).length;u.push({place:W,zoneId:b.zone.id,zoneName:b.zone.name,x:X,y:te,isCurrent:W.id===o,isOnRoute:P.has(W.id),actorsHere:ae,activeQuestCount:Y})})});let l=new Map(u.map((b)=>[b.place.id,b])),m=[];for(let b of At(t)){let I=l.get(b.fromId),c=l.get(b.toId);if(!I||!c)continue;let k=(I.x+c.x)/2,_=(I.y+c.y)/2,B=c.x-I.x,R=c.y-I.y,E=Math.max(1,Math.hypot(B,R)),D=I.zoneId!==c.zoneId,H=D?26:10,F=Math.round(k+-R/E*H),j=Math.round(_+B/E*H),O=!1;if(C&&C.pathIds.length>1)for(let W=0;W<C.pathIds.length-1;W++){let K=C.pathIds[W],z=C.pathIds[W+1];if(K===I.place.id&&z===c.place.id||K===c.place.id&&z===I.place.id){O=!0;break}}m.push({id:b.id,fromId:I.place.id,toId:c.place.id,x1:I.x,y1:I.y,x2:c.x,y2:c.y,cx:F,cy:j,pathType:b.pathType,label:b.label,travelMinutes:b.travelMinutes,locked:Boolean(b.locked),isOnRoute:O,isCrossZone:D})}return{zones:y,nodes:u,edges:m}}function qa(t,n){let a=Object.values(t.places);if(!a.length)return{hubs:[],edges:[]};let s=t.currentPlaceId||a[0].id,o={...t.mapZones??{}},i=(w)=>{let h=w.zoneId||qe.id;if(o[h])return o[h];if(h===qe.id)return o[h]={...qe,name:t.title&&t.title!=="Uncharted Story"?t.title:"Local Area"},o[h];return o[h]={id:h,name:h.replace(/[_-]+/g," ").replace(/\b\w/g,(C)=>C.toUpperCase()),kind:w.category==="region"?"region":"building",icon:w.category==="region"?"\uD83C\uDFD4️":"\uD83C\uDFDB️",color:"#38bdf8",description:""},o[h]},p=new Map;for(let w of a){let h=i(w),C=p.get(h.id);if(!C)C={zone:h,places:[]},p.set(h.id,C);C.places.push(w)}let r=[...p.values()],d=r.length,g=n&&n!==s?gt(t,n):null,v=new Set(g?.pathIds??[]),M=Object.values(t.quests).filter((w)=>w.status==="active"),f=(w,h)=>{if(h===1)return{x:500,y:180};if(h===2)return{x:w===0?270:730,y:180};if(h===3)return[{x:230,y:118},{x:770,y:118},{x:500,y:252}][w];let C=Math.min(3,Math.ceil(h/2)),P=Math.ceil(h/C),S=w%C,y=Math.floor(w/C),u=C>1?620/(C-1):0,l=P>1?150/(P-1):0,m=y%2===1&&C>1?35:0;return{x:Math.round(190+S*u+m),y:Math.round(105+y*l)}},x=r.map((w,h)=>{let C=f(h,d),P=w.places.map((c)=>c.id),S=new Set(P),y=S.has(s),u=P.some((c)=>v.has(c)),l=Object.values(t.characters).filter((c)=>c.present?y:S.has(c.locationId)).map((c)=>({id:c.id,name:c.name,portraitUrl:c.portraitUrl})),m=M.filter((c)=>w.places.some((k)=>`${c.title} ${c.summary}`.toLowerCase().includes(k.name.toLowerCase()))).length,b=w.places.find((c)=>c.id===s&&c.backdropUrl)?.backdropUrl??w.places.find((c)=>c.backdropUrl)?.backdropUrl,I=0;if(!y){let c=1/0;for(let k of w.places){let _=gt(t,k.id);if(_&&_.totalMinutes<c)c=_.totalMinutes}I=Number.isFinite(c)?c:w.places[0]?.travelMinutes??5}return{zone:w.zone,x:C.x,y:C.y,placeIds:P,containsCurrent:y,isOnRoute:u,...b?{backdropUrl:b}:{},actorsHere:l,activeQuestCount:m,minTravelMinutes:I}}),L=new Map(x.map((w)=>[w.zone.id,w])),T=new Map;for(let w of x)for(let h of w.placeIds)T.set(h,w.zone.id);let A=new Map;for(let w of At(t)){let h=T.get(w.fromId),C=T.get(w.toId);if(!h||!C||h===C)continue;let[P,S]=[h,C].sort(),y=`${P}__${S}`,u=L.get(P),l=L.get(S);if(!u||!l)continue;let m=v.has(w.fromId)&&v.has(w.toId),b=A.get(y);if(b){b.travelMinutes=Math.min(b.travelMinutes,w.travelMinutes),b.locked=b.locked&&Boolean(w.locked),b.isOnRoute=b.isOnRoute||m;continue}let I=(u.x+l.x)/2,c=(u.y+l.y)/2,k=l.x-u.x,_=l.y-u.y,B=Math.max(1,Math.hypot(k,_)),R=Math.round(I+-_/B*24),E=Math.round(c+k/B*24);A.set(y,{id:y,fromZoneId:P,toZoneId:S,x1:u.x,y1:u.y,x2:l.x,y2:l.y,cx:R,cy:E,pathType:w.pathType,travelMinutes:w.travelMinutes,locked:Boolean(w.locked),isOnRoute:m})}return{hubs:x,edges:[...A.values()]}}var Ke="",Jt=!0,_n={door:"\uD83D\uDEAA",hallway:"\uD83D\uDEB6",stairs:"\uD83E\uDE9C",street:"\uD83D\uDEE3️",trail:"\uD83C\uDF3F",transit:"\uD83D\uDE87",portal:"✨"};function Rn(t,n=3){let a=e("div","ls-mz-node-avatars");for(let s of t.slice(0,n)){let o=e("span","ls-mz-mini-av");if(o.title=s.name,s.portraitUrl){let i=e("img");i.src=s.portraitUrl,i.alt=s.name,o.append(i)}else o.textContent=s.name.slice(0,1).toUpperCase();a.append(o)}if(t.length>n)a.append(e("small","ls-muted",`+${t.length-n}`));return a}function en(t){let{state:n}=t.snapshot,a=e("div","ls-stack"),s=Object.values(n.places),o=n.mapZones??{},i=At(n);if(Ke&&!s.some((c)=>(c.zoneId||"zone_local")===Ke))Ke="";let p=e("div","ls-row-between"),r=n.currentPlaceId||s[0]?.id||"",d=t.selectedPlaceId&&n.places[t.selectedPlaceId]?t.selectedPlaceId:r,g=qa(n,d),v=g.hubs.length>1,M=Ke||(!Jt||!v?g.hubs[0]?.zone.id??"":""),f=e("div","ls-row ls-vn-breadcrumb"),x=N(`\uD83C\uDF0D All Zones (${g.hubs.length})`,()=>{Ke="",Jt=!0,t.emitChange()},"ls-btn-sm");if(!M)x.setAttribute("aria-current","page");if(f.append(x),v)for(let c of g.hubs){let k=N(`${c.zone.icon} ${c.zone.name} (${c.placeIds.length})`,()=>{Ke=c.zone.id,Jt=!1,t.emitChange()},"ls-btn-sm");if(M===c.zone.id)k.setAttribute("aria-current","page");f.append(k)}else if(g.hubs[0]){let c=g.hubs[0];f.append(e("span","ls-chip ls-chip-accent",`${c.zone.icon} ${c.zone.name}`))}let L=e("div","ls-row");if(L.append(N("+ Zone",()=>{t.modals.open({title:"Create Map Zone / Building / District",width:460},(c,k,_,B)=>{let R=e("label","ls-label","Zone Name"),E=e("input","ls-input");E.placeholder="e.g. Sakura Manor, Downtown, Orbital Deck B…",R.append(E);let D="building",H=e("div","ls-label","Zone Type"),F=e("div");H.append(F),J(t,B,F,{value:D,ariaLabel:"Zone Type",options:[{value:"building",label:"\uD83C\uDFDB️ Building / Interior"},{value:"district",label:"\uD83C\uDF06 City District"},{value:"region",label:"\uD83C\uDFD4️ Wilderness / Region"},{value:"ship_deck",label:"\uD83D\uDE80 Ship / Station Deck"},{value:"realm",label:"✨ Realm / Dimension"}],onChange:(K)=>{D=K}});let j=e("label","ls-label","Icon"),O=e("input","ls-input");O.value="\uD83C\uDFDB️",j.append(O);let W=N("Create Zone",()=>{let K=E.value.trim();if(!K)return;t.request("state:mutate",{patch:{zones:[{id:re(K,"zone"),name:K,kind:D,icon:O.value.trim()||"\uD83C\uDFDB️"}]},reason:`Created zone "${K}"`}),k()},"ls-btn-primary");c.append(R,H,j,W)})},"ls-btn-sm"),N("+ Place",()=>{t.modals.open({title:"Add Location Pin",width:480},(c,k)=>{let _=e("label","ls-label","Location Name"),B=e("input","ls-input");_.append(B);let R=e("label","ls-label","Zone / Building / District"),E=e("input","ls-input");E.value=M&&o[M]?.name||n.places[r]?.zoneId&&o[n.places[r].zoneId]?.name||"",E.placeholder="e.g. Second-Floor Apartment",R.append(E);let D=e("label","ls-label","Icon"),H=e("input","ls-input");H.value="\uD83D\uDCCD",D.append(H);let F=e("label","ls-label","Description"),j=e("input","ls-input");F.append(j);let O=N("Add Location",()=>{let W=B.value.trim();if(!W)return;let K=n.places[r]?.name;t.request("state:mutate",{patch:{places:[{id:re(W,"place"),name:W,zone:E.value.trim()||void 0,icon:H.value.trim()||"\uD83D\uDCCD",description:j.value.trim()||"Connected location.",connectedNames:K?[K]:[]}]},reason:`Added location "${W}"`}),k()},"ls-btn-primary");c.append(_,R,D,F,O)})},"ls-btn-sm ls-btn-primary"),N("Export",()=>{let c={schema:"lumi-stats-map/v1",zones:Object.values(o),places:s,paths:i},k=new Blob([JSON.stringify(c,null,2)],{type:"application/json"}),_=URL.createObjectURL(k),B=document.createElement("a");B.href=_,B.download=`${re(n.title,"lumi_map")}.lumi-map.json`,document.body.append(B),B.click(),B.remove(),URL.revokeObjectURL(_)},"ls-btn-sm ls-btn-ghost","Export Map JSON"),N("Import",()=>{t.ctx.uploads.pickFile({accept:[".json","application/json"],multiple:!1,maxSizeBytes:1500000}).then((c)=>{let k=c[0];if(!k)return;let _=JSON.parse(new TextDecoder().decode(k.bytes));t.request("state:mutate",{patch:{zones:Array.isArray(_.zones)?_.zones:void 0,places:Array.isArray(_.places)?_.places:void 0,paths:Array.isArray(_.paths)?_.paths:void 0},reason:`Imported map layout from ${k.name}`})})},"ls-btn-sm ls-btn-ghost","Import Map JSON")),p.append(f,L),a.append(p),!s.length){let c=e("div","ls-card");return c.append(e("strong","","No locations mapped yet"),e("p","ls-muted",'Locations, zones, and connecting paths build automatically as scenes progress, or click "+ Zone" / "+ Place" above.')),a.append(c),a}let T=n.places[d]??s[0],A=e("div","ls-card"),w=e("div","ls-vn-atlas-canvas"),h=T.backdropUrl||s.find((c)=>c.id===r&&c.backdropUrl)?.backdropUrl||s.find((c)=>c.backdropUrl)?.backdropUrl;if(h)w.style.backgroundImage=`linear-gradient(rgba(11,17,32,0.72), rgba(11,17,32,0.88)), url(${JSON.stringify(h)})`,w.style.backgroundSize="cover",w.style.backgroundPosition="center";let C="http://www.w3.org/2000/svg",P=document.createElementNS(C,"svg");if(P.setAttribute("preserveAspectRatio","none"),P.style.cssText="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;",!M&&v){P.setAttribute("viewBox","0 0 1000 360");for(let c of g.edges){let k=document.createElementNS(C,"path");k.setAttribute("d",`M ${c.x1} ${c.y1} Q ${c.cx} ${c.cy} ${c.x2} ${c.y2}`),k.setAttribute("fill","none"),k.setAttribute("stroke",c.locked?"var(--ls-danger, #f43f5e)":c.isOnRoute?"var(--ls-primary, #38bdf8)":"rgba(148,163,184,0.55)"),k.setAttribute("stroke-width",c.isOnRoute?"3":"2"),k.setAttribute("stroke-dasharray",c.locked?"5 4":"4 3"),P.append(k);let _=0.25*c.x1+0.5*c.cx+0.25*c.x2,B=0.25*c.y1+0.5*c.cy+0.25*c.y2,R=e("span","ls-mz-edge-pill",`${c.locked?"\uD83D\uDD12 ":_n[c.pathType]||"\uD83D\uDEE3️"} ${c.travelMinutes}m`);R.dataset.route=String(c.isOnRoute),R.style.left=`${(_/1000*100).toFixed(2)}%`,R.style.top=`${(B/360*100).toFixed(2)}%`,w.append(R)}w.append(P);for(let c of g.hubs){let k=N("",()=>{if(Ke=c.zone.id,Jt=!1,c.placeIds[0]&&!c.placeIds.includes(d))t.selectedPlaceId=c.placeIds[0];t.emitChange()},"ls-vn-zone-hub",`Open ${c.zone.name} (${c.placeIds.length} locations)`);if(k.dataset.current=String(c.containsCurrent),k.style.setProperty("--ls-zone-color",c.zone.color||"#38bdf8"),k.style.left=`${(c.x/1000*100).toFixed(2)}%`,k.style.top=`${(c.y/360*100).toFixed(2)}%`,c.backdropUrl)k.style.backgroundImage=`linear-gradient(rgba(11,17,32,0.72), rgba(11,17,32,0.88)), url(${JSON.stringify(c.backdropUrl)})`,k.style.backgroundSize="cover",k.style.backgroundPosition="center";let _=e("div","ls-row");_.append(e("span","",`${c.zone.icon} ${c.zone.name}`));let B=e("div","ls-row");if(c.containsCurrent)B.append(e("span","ls-chip ls-chip-accent","YOU"));else B.append(e("span","ls-chip",`${c.minTravelMinutes}m`));if(B.append(e("span","ls-chip",`${c.placeIds.length} ${c.placeIds.length===1?"spot":"spots"}`)),c.activeQuestCount>0)B.append(e("span","ls-chip","\uD83C\uDFAF"));if(k.append(_,B),c.actorsHere.length>0)k.append(Rn(c.actorsHere,4));w.append(k)}}else{let c=Ua(n,d,M||void 0);P.setAttribute("viewBox","0 0 1000 580");for(let k of c.edges){let _=document.createElementNS(C,"path");if(_.setAttribute("d",`M ${k.x1} ${k.y1} Q ${k.cx} ${k.cy} ${k.x2} ${k.y2}`),_.setAttribute("fill","none"),_.setAttribute("stroke",k.locked?"var(--ls-danger, #f43f5e)":k.isOnRoute?"var(--ls-primary, #38bdf8)":"rgba(148,163,184,0.55)"),_.setAttribute("stroke-width",k.isOnRoute?"3.5":"2"),k.locked||k.isCrossZone||k.pathType==="portal")_.setAttribute("stroke-dasharray",k.pathType==="portal"?"3 4":"6 4");P.append(_);let B=0.25*k.x1+0.5*k.cx+0.25*k.x2,R=0.25*k.y1+0.5*k.cy+0.25*k.y2,E=e("span","ls-mz-edge-pill",`${k.locked?"\uD83D\uDD12 ":_n[k.pathType]||"\uD83D\uDEAA"} ${k.travelMinutes}m`);E.dataset.route=String(k.isOnRoute),E.style.left=`${(B/1000*100).toFixed(2)}%`,E.style.top=`${(R/580*100).toFixed(2)}%`,w.append(E)}w.append(P);for(let k of c.nodes){let _=N("",()=>{t.selectedPlaceId=k.place.id,t.emitChange(),requestAnimationFrame(()=>{A.scrollIntoView({behavior:"smooth",block:"nearest"})})},"ls-mz-node-tile",k.place.name);_.dataset.current=String(k.isCurrent),_.dataset.selected=String(k.place.id===d),_.style.left=`${(k.x/1000*100).toFixed(2)}%`,_.style.top=`${(k.y/580*100).toFixed(2)}%`;let B=k.place.name.length>24?`${k.place.name.slice(0,22)}…`:k.place.name;if(_.append(e("span","ls-mz-node-title",`${k.place.icon||"\uD83D\uDCCD"} ${B}${k.activeQuestCount?" \uD83C\uDFAF":""}`)),k.actorsHere.length>0||k.isCurrent){let R=Rn(k.actorsHere,3);if(k.isCurrent)R.prepend(e("span","ls-chip ls-chip-accent","YOU"));_.append(R)}w.append(_)}}a.append(w);let S=M?s.filter((c)=>(c.zoneId||"zone_local")===M):s,y=e("div","ls-vn-dest-grid");for(let c of S){let k=c.id===r,_=c.id===T.id,B=!k?gt(n,c.id):null,R=Object.values(n.characters).filter((W)=>W.present?c.id===r:W.locationId===c.id).map((W)=>({id:W.id,name:W.name,portraitUrl:W.portraitUrl})),E=e("div","ls-vn-dest-card");E.dataset.current=String(k),E.dataset.selected=String(_),E.addEventListener("click",()=>{t.selectedPlaceId=c.id,t.emitChange()});let D=e("div","ls-vn-dest-thumb");if(c.backdropUrl){let W=e("img");W.src=c.backdropUrl,W.alt=c.name,D.append(W)}else D.textContent=c.icon||"\uD83D\uDCCD";let H=e("div","ls-vn-dest-info"),F=e("div","ls-row");if(F.append(e("strong","",c.name)),k)F.append(e("span","ls-chip ls-chip-accent","Here"));H.append(F);let j=c.zoneId&&o[c.zoneId]?.name||"";if(j)H.append(e("small","ls-muted",j));if(R.length>0)H.append(Rn(R,4));let O=e("div","ls-row");if(!k)O.append(e("span","ls-chip",`${B?.totalMinutes??c.travelMinutes}m`),N("Go",()=>{t.request("map:travel",{placeId:c.id,fastTravel:!0})},"ls-btn-sm ls-btn-primary",`Fast travel to ${c.name}`));E.append(D,H,O),y.append(E)}a.append(y);let u=T.id!==r?gt(n,T.id):null,l=i.filter((c)=>c.fromId===T.id||c.toId===T.id),m=T.zoneId&&o[T.zoneId]?.name||"Local Area",b=e("div","ls-row-between");if(b.append(e("strong","",`${T.icon} ${T.name} · ${m}`),e("span","ls-chip ls-chip-accent",T.id===r?"Current Location":`${u?.totalMinutes??T.travelMinutes}m travel`)),A.append(b,e("p","ls-muted",T.description)),l.length>0){let c=e("div","ls-row");for(let k of l){let _=k.fromId===T.id?k.toId:k.fromId,B=n.places[_]?.name??_;c.append(N(`${k.locked?"\uD83D\uDD12":_n[k.pathType]} ${B} (${k.travelMinutes}m)`,()=>{t.selectedPlaceId=_,t.emitChange()},"ls-btn-sm","Jump inspector to connected place"))}A.append(c)}let I=e("div","ls-row");if(T.id!==r)I.append(N("Copy Travel Action",()=>{t.request("map:travel",{placeId:T.id,fastTravel:!1}).then(async(c)=>{let k=typeof c.draftText==="string"?c.draftText:"";if(!k)return;try{await navigator.clipboard.writeText(k),t.notify(`Copied travel action: "${k}"`)}catch{t.notify(`Travel route: ${k}`)}})},"ls-btn-sm"),N("Fast Travel Here",()=>{t.request("map:travel",{placeId:T.id,fastTravel:!0})},"ls-btn-sm ls-btn-primary"));if(I.append(N("Upload Backdrop",()=>t.pickAndUploadImage(T.id,"backdrop"),"ls-btn-sm"),N("Edit Place",()=>{t.modals.open({title:`Edit Place: ${T.name}`,width:500},(c,k)=>{let _=e("label","ls-label","Location Name"),B=e("input","ls-input");B.value=T.name,_.append(B);let R=e("label","ls-label","Zone / Building / District"),E=e("input","ls-input");E.value=T.zoneId&&o[T.zoneId]?.name||"",R.append(E);let D=e("label","ls-label","Icon"),H=e("input","ls-input");H.value=T.icon||"\uD83C\uDFDB️",D.append(H);let F=e("label","ls-label","Tags (comma-separated, e.g. safe, shop, danger)"),j=e("input","ls-input");j.value=(T.tags??[]).join(", "),F.append(j);let O=e("label","ls-label","Description"),W=e("textarea","ls-input");W.rows=2,W.value=T.description,O.append(W);let K=e("label","ls-label","Default Travel Minutes"),z=e("input","ls-input");z.type="number",z.value=String(T.travelMinutes||5),K.append(z);let V=N("Save Location",()=>{let G=E.value.trim(),q={...n.mapZones??{}},X=T.zoneId;if(G){if(X=re(G,"zone"),!q[X])q[X]={id:X,name:G,kind:"building",icon:"\uD83C\uDFDB️",color:"#38bdf8",description:""}}let te=structuredClone(n.places),ae=te[T.id];if(ae)ae.name=B.value.trim()||ae.name,ae.zoneId=X,ae.icon=H.value.trim()||"\uD83D\uDCCD",ae.tags=j.value.split(",").map((Y)=>Y.trim()).filter(Boolean),ae.description=W.value.trim()||ae.description,ae.travelMinutes=Math.max(1,Number(z.value)||5),t.request("state:mutate",{stateOverride:{places:te,mapZones:q},reason:`Edited location "${ae.name}"`});k()},"ls-btn-primary");c.append(_,R,D,F,O,K,V)})},"ls-btn-sm")),s.length>1)I.append(N("Delete",()=>{let c=structuredClone(n.places);delete c[T.id];for(let B of Object.values(c))B.connectedIds=B.connectedIds.filter((R)=>R!==T.id);let k=(n.mapPaths??[]).filter((B)=>B.fromId!==T.id&&B.toId!==T.id),_=n.currentPlaceId===T.id?Object.keys(c)[0]??"":n.currentPlaceId;t.selectedPlaceId=_,t.request("state:mutate",{stateOverride:{places:c,mapPaths:k,currentPlaceId:_},reason:`Deleted location "${T.name}"`})},"ls-btn-sm ls-btn-danger"));return A.append(I),a.append(A),a}function Be(t,n,a){let s=n.trim();if(!s)return;let o=()=>{if(!a?.dom?.inject){t.textContent=s.replace(/<[^>]+>/g,"");return}try{a.dom.inject(t,s,"beforeend")}catch{t.textContent=s.replace(/<[^>]+>/g,"")}};if(t.isConnected)o();else queueMicrotask(()=>{if(t.isConnected)o()})}var Fs=/^(?:impulse|inhibition|action|acted|thought|inner\s*thought|saw|heard|saw\/heard|take|observation|trigger|response|result|outcome|cause|effect|before|after|step|status|state|goal|intent|attitude|location|current|current\s*step|next|hook|active\s*plans?|leverage|pivot|reward|risk|verdict|knows\/misreads|knows|blind\s*to|secret\s*stage)$/i;function Ga(t){return t.replace(/\[\s*([^\]\n:]{1,40}?)\s*\]\s*\{\s*([^\}\n]+?)\s*\}/g,"$1: $2").replace(/([A-Za-z][A-Za-z0-9_\/\s-]{1,32})\s*:\s*\[([^\[\]\n]+)\]/g,"$1: $2").replace(/\[\s*([^\]\n:]{1,40}?)\s*\]\s*:\s*\{?\s*([^\]\}\n]+?)\s*\}?(?=\s*(?:->|→|⇒|\||vs\b|$))/gi,"$1: $2")}function we(t){let n=Ga(t).trim();while(n.startsWith("[")&&n.endsWith("]")&&!n.slice(1,-1).includes("[")||n.startsWith("{")&&n.endsWith("}")&&!n.slice(1,-1).includes("{"))n=n.slice(1,-1).trim();return n}function Et(t){let n=Ga(t).trim();if(!n)return[];return n.split(/\r?\n|(?:\s*;\s*)|(?:\s+•\s+)/).map((s)=>we(s.replace(/^[-*•]\s+/,"").trim())).filter(Boolean).map((s)=>{let o=s.split(/\s*(?:->|→|⇒)\s*/).map((r)=>we(r)).filter(Boolean),i;if(o.length>1){let r=o[0],d=r.match(/^([^:\[\]\|]{2,50}):\s*([\s\S]+)$/),g=d?.[1]?.trim()??"",v=/^[^:\[\]]{1,30}:\s*\S/.test(o[1]);if(d&&!Fs.test(g)&&!/\bvs\.?\b/i.test(r)&&!r.includes("|")&&!v)i=g,o[0]=d[2].trim()}let p=o.flatMap((r)=>r.split(/\s*\|\s*/)).map((r)=>we(r)).filter(Boolean);return{...i?{subject:i}:{},steps:p.length?p:[s]}})}function Ws(t){let n=we(t);if(!n)return null;let a=n.match(/^([^:->→\[\]]{1,40}):\s*([\s\S]*)$/),s=e("span","ls-step-node");if(a){let o=a[1].trim(),i=we(a[2]??"");if(!i)return null;let p=e("strong","",`${o}: `);p.style.color="var(--ls-primary)",p.style.marginRight="4px",s.append(p,document.createTextNode(i))}else s.textContent=n;return s}function Nn(t,n){let a=0;for(let s of n){let o=s.split(/\s+\bvs\.?\b\s+/i).map((p)=>p.trim()).filter(Boolean),i=[];for(let[p,r]of o.entries()){let d=Ws(r);if(d)i.push({chip:d,isVs:p>0})}if(!i.length)continue;if(a>0)t.append(e("span","ls-step-arrow","→"));for(let p of i){if(p.isVs)t.append(e("span","ls-step-arrow","vs"));t.append(p.chip)}a++}}function Ze(t,n="auto"){let a=t.trim();if(!a)return e("span","ls-muted","—");if(n==="quote_callout")return e("div","ls-thought-box",`“${we(a)}”`);if(n==="pill_list"){let p=e("div","ls-row");for(let r of a.split(/[,;\n]|->|→|⇒/).map((d)=>d.trim()).filter(Boolean))p.append(e("span","ls-chip ls-chip-accent",we(r)));return p}if(n==="step_chain"){let p=e("div","ls-step-chain ls-step-strip"),r=a.split(/\r?\n|(?:\s*;\s*)|\s*(?:->|→|⇒)\s*/).map((d)=>d.trim()).filter(Boolean);return Nn(p,r),p}if(n==="key_value"){let p=e("div","ls-kv-grid"),r=a.split(/\r?\n|(?:\s*;\s*)|\s*(?:->|→|⇒)\s*|\s+\bvs\.?\b\s+/i).map((d)=>d.replace(/^[-*•]\s+/,"").trim()).filter(Boolean);for(let[d,g]of r.entries()){let v=we(g),M=v.match(/^([^:]{1,45}):\s*([\s\S]+)$/),f=e("div","ls-kv-row");if(M)f.append(e("span","ls-kv-key",M[1].trim()),e("span","ls-kv-val",we(M[2])));else f.append(e("span","ls-kv-key",`#${d+1}`),e("span","ls-kv-val",v));p.append(f)}return p}if(!/->|→|⇒|\bvs\.?\b|\n|;|\[[^\]]+\]/i.test(a)&&n==="auto"){let p=e("p","",a);return p.style.margin="2px 0 0",p}if(n==="arc_tracker"){let p=a.split(/\r?\n|(?=\[\s*t\d+\b)|(?:\s*;\s*)/i).map((d)=>we(d.replace(/^[-*•]\s+/,"").trim())).filter(Boolean),r=e("div","ls-arc-list");for(let d of p){let g=e("div","ls-arc-card"),v=d.split(/\s*\|\s*/).map((y)=>y.trim()).filter(Boolean),M=v[0]??d,f=d.match(/\b(\d+)\s*\/\s*(\d+)\b/),x=f?Math.max(0,Number(f[1])):null,L=f?Math.max(1,Math.min(12,Number(f[2]))):null,T=d.match(/\b(ACTIVE|DORMANT|PAYOFF|COMPLETE(?:D)?|DONE|RETIRE(?:D)?|URGENT|FAIL(?:ED)?|ADVANCE|CONTINUE|SHIFT|DROP)\b/i),A=T?T[1].toUpperCase():"",w=M.replace(/^t\d+\s*/i,"").replace(/\(\s*([^|)]+?)\s*(?:\|\s*\d+\s*\/\s*\d+\s*)?\)\s*:?/,"$1:").trim(),h="",C=w.indexOf(":");if(C>0&&C<48)h=w.slice(C+1).trim(),w=w.slice(0,C).trim();else w=w.replace(/\s*\|\s*\d+\s*\/\s*\d+/,"").trim();let P=e("div","ls-row-between");P.append(e("strong","ls-arc-title",w||"Active Thread"));let S=e("div","ls-row");if(A){let y=e("span","ls-arc-status",A);y.dataset.arcStatus=A.toLowerCase(),S.append(y)}if(x!==null&&L!==null)S.append(e("span","ls-chip",`${x}/${L}`));if(P.append(S),g.append(P),x!==null&&L!==null){let y=e("div","ls-clock-bar ls-arc-clock");y.style.gridTemplateColumns=`repeat(${L}, 1fr)`;for(let u=1;u<=L;u++)y.append(e("span",`ls-clock-seg${u<=x?" is-filled":""}`));g.append(y)}if(h)g.append(e("p","ls-arc-summary",h));for(let y of v.slice(1)){if(/^\d+\s*\/\s*\d+$/.test(y))continue;let u=we(y),l=u.match(/^([^:]{1,28}):\s*([\s\S]+)$/);if(l){let m=e("div","ls-arc-meta");m.append(e("span","ls-kv-key",`${l[1].trim()}:`),e("span","ls-muted",l[2].trim())),g.append(m)}else g.append(e("small","ls-muted",u))}r.append(g)}return r}if(n==="accordion_cards"){let p=Et(a),r=e("div","ls-feed-list");for(let[d,g]of p.entries()){let v=e("details","ls-stat-acc");if(d===0)v.open=!0;let M=e("summary","ls-stat-acc-head"),f=g.subject||g.steps[0]||`Entry ${d+1}`,x=g.subject?g.steps[0]??"":g.steps[1]??"";M.append(e("strong","",f),...x?[e("small","ls-muted ls-stat-acc-preview",x)]:[]);let L=e("div","ls-stat-acc-body"),T=e("div","ls-step-chain");Nn(T,g.steps),L.append(T),v.append(M,L),r.append(v)}return r}if(n==="matrix_badges"){let p=a.split(/\r?\n|(?:\s*;\s*)/).map((d)=>we(d.replace(/^[-*•]\s+/,"").trim())).filter(Boolean),r=e("div","ls-feed-list");for(let d of p){let g=e("div","ls-matrix-card"),v=d.split(/\s*(?:\bvs\.?\b|\||->|→|⇒)\s*/i).map((L)=>we(L)).filter(Boolean),M=e("div","ls-matrix-cols"),f=v.slice(0,2),x=v.slice(2);for(let L of f){let T=e("div","ls-matrix-cell"),A=L.match(/^([^:]{1,28}):\s*([\s\S]+)$/);if(A)T.append(e("span","ls-kv-key",A[1].trim()),e("span","",we(A[2])));else T.append(e("span","",L));M.append(T)}g.append(M);for(let L of x){let T=e("div","ls-matrix-footer"),A=L.match(/^([^:]{1,28}):\s*([\s\S]+)$/);if(A)T.append(e("span","ls-kv-key",`${A[1].trim()}: `),e("span","",we(A[2])));else T.append(e("span","",L));g.append(T)}r.append(g)}return r}if(n==="meter_mini_bars"){let p=[...a.matchAll(/\b([A-Za-z][A-Za-z0-9_ -]{0,18}?)\s*[:=]?\s*(-?\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\b/g)];if(p.length>0){let r=e("div","ls-minibars-grid");for(let d of p){let g=d[1].trim(),v=Number(d[2]),M=Math.max(1,Number(d[3])),f=Math.max(0,Math.min(100,Math.round(v/M*100))),x=e("div","ls-minibar-cell"),L=e("div","ls-row-between");L.append(e("span","ls-kv-key",g),e("strong","",`${v}/${M}`));let T=e("div","ls-bar-track"),A=e("div","ls-bar-fill");if(A.style.width=`${f}%`,/hp|health|vital|blood/i.test(g))A.style.background="#f43f5e";else if(/mp|mana|ki|energy/i.test(g))A.style.background="#38bdf8";T.append(A),x.append(L,T),r.append(x)}return r}}if(n==="stat_pills_grid"){let p=e("div","ls-statpills-grid"),r=a.split(/\s*(?:\||,|;|\n)\s*/).flatMap((d)=>{let g=d.trim();if(!g)return[];if(/^(?:[A-Za-z]{1,8}\d+\s+)+[A-Za-z]{1,8}\d+$/.test(g))return g.split(/\s+/);return[g]}).filter(Boolean);for(let d of r){let g=e("div","ls-statpill-tile"),v=d.match(/^([A-Za-z][A-Za-z0-9_]{0,12})\s*[:=]?\s*(-?\d+(?:\.\d+)?(?:\/\d+)?(?:\s*\([^)]+\))?)$/);if(v)g.append(e("span","ls-kv-key",v[1].trim()),e("strong","",v[2].trim()));else g.append(e("strong","",d));p.append(g)}return p}if(n==="bullet_ledger"){let p=a.split(/\r?\n|(?:\s*;\s*)|(?:\s+•\s+)/).map((d)=>d.replace(/^[-*•]\s+/,"").trim()).filter(Boolean),r=e("div","ls-ledger-list");for(let d of p){let g=e("div","ls-ledger-row"),v=d.match(/^(.+?)\s*:\s*([$€£¥]?\s*-?\d[\d,]*(?:\.\d+)?.*)$/);if(v)g.append(e("span","",v[1].trim()),e("span","ls-chip ls-chip-accent",v[2].trim()));else g.append(e("span","",d));r.append(g)}return r}if(n==="timeline_list"){let p=a.split(/\r?\n|(?:\s*;\s*)|\s*(?:->|→|⇒)\s*/).map((d)=>we(d.replace(/^[-*•]\s+/,"").trim())).filter(Boolean),r=e("div","ls-timeline-list");for(let d of p){let g=e("div","ls-timeline-item");g.append(e("span","ls-timeline-dot"),e("span","",d)),r.append(g)}return r}if(n==="checklist"){let p=a.split(/\r?\n|(?:\s*;\s*)/).map((d)=>d.replace(/^[-*•]\s+/,"").trim()).filter(Boolean),r=e("div","ls-checklist");for(let d of p){let g=/^(?:\[x\]|✓|✔|done:|completed:)/i.test(d),v=d.replace(/^(?:\[[ xX]\]|✓|✔|○)\s*/,"").trim(),M=e("div","ls-checklist-row");M.dataset.done=String(g),M.append(e("span","ls-checklist-box",g?"✓":""),e("span",g?"ls-muted":"",v)),r.append(M)}return r}let o=Et(a),i=e("div","ls-feed-list");for(let p of o){let r=e("div","ls-feed-card");if(p.subject)r.append(e("div","ls-feed-subject",`\uD83D\uDC64 ${p.subject}`));let d=e("div","ls-step-chain");Nn(d,p.steps),r.append(d),i.append(r)}return i}function De(t,n){let a={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},s=(r)=>r.replace(/[&<>"']/g,(d)=>a[d]),o=Re(n),i=Object.values(n.characters).find((r)=>r.present)??Object.values(n.characters)[0],p={title:s(n.title),location:s(o.location),time:s(o.time),date:s(o.date),weather:s(o.weather),header:s(o.formatted),player_attire:s(n.player.attire),name:s(i?.name??""),role:s(i?.roleSummary??""),demeanor:s(i?.demeanor??""),attire:s(i?.attire??"")};return t.replace(/\{\{\s*([\w:.-]+)\s*\}\}/g,(r,d)=>{if(d.startsWith("stat:")){let g=d.slice(5),v=n.stats[g]?.value??i?.meters[g]?.value;return v!==void 0?s(String(v)):"—"}return p[d]??""})}function _t(t){let{state:n}=t.snapshot,a=Re(n);t.modals.open({title:"✏️ Edit Scene Banner & Player Presentation",width:540},(s,o)=>{let i=(A,w,h)=>{let C=e("label","ls-label",A),P=e("input","ls-input");return P.value=w,P.placeholder=h,C.append(P),s.append(C),P},p=i("\uD83D\uDCCD Location & Region",n.scene.location||a.location,"e.g. Master Suite, Estate"),r=i("\uD83D\uDD70️ Time",n.scene.timeLabel||a.time,"e.g. 08:30 PM"),d=i("\uD83D\uDCC5 Date / Era",n.scene.dateLabel||a.date,"e.g. Day 1 · Evening"),g=i("\uD83C\uDF26️ Weather & Atmosphere",n.scene.weather||a.weather,"e.g. Warm Indoor Steam"),v=i("\uD83D\uDC55 Your Current Attire / Presentation",n.player.attire,"e.g. Wearing only a towel after a bath"),M=e("label","ls-label","Scene Beat Summary"),f=e("textarea","ls-input");f.rows=2,f.value=n.scene.beatSummary||"",M.append(f),s.append(M);let x=e("div","ls-row-between"),L=e("div","ls-row");L.append(N("⚙️ Pill Prompts",()=>{o(),Ae(t)},"ls-btn-sm"));for(let[A,w]of[["+15m",15],["+1h",60],["+1d",1440]])L.append(N(A,()=>{t.request("state:mutate",{patch:{scene:{elapsedMinutes:w}},reason:`Advanced clock ${A}`}),o()},"ls-btn-sm"));let T=N("\uD83D\uDCBE Save Scene",()=>{t.request("state:mutate",{patch:{scene:{location:p.value.trim(),timeLabel:r.value.trim(),dateLabel:d.value.trim(),weather:g.value.trim(),beatSummary:f.value.trim()},player:{attire:v.value.trim()}},reason:"Updated scene & player presentation"}),o()},"ls-btn-primary");x.append(L,T),s.append(x)})}function Ge(t,n){t.modals.open({title:"\uD83E\uDDEA Two-Phase Stat Calibration & Reactivity Sandbox",width:660,maxHeight:760},(a,s)=>{let o=e("label","ls-label","Test Scenario / Turn Input (or leave blank to auto-generate)"),i=e("textarea","ls-input");i.rows=2,i.placeholder='e.g. "My loyal maid greets me as I step out of the bath wearing only a towel."',o.append(i);let p=e("div","ls-stack"),r=()=>{p.replaceChildren(e("p","ls-muted","⏳ Evaluating scenario against two-phase calibration rules…")),t.request("sandbox:test",{statId:n,scenarioText:i.value.trim()||void 0}).then((g)=>{p.replaceChildren();let v=e("div","ls-card");v.append(e("span","ls-kicker","\uD83D\uDCD6 Evaluated Beat"),e("p","",String(g.testBeat??""))),p.append(v);let M=Array.isArray(g.auditEntries)?g.auditEntries:[];if(!M.length)p.append(e("p","ls-muted","No stats shifted for this scenario."));else for(let f of M){let x=e("div","ls-stat-cell"),L=e("div","ls-row-between");L.append(e("strong","",`${String(f.statLabel)} (${String(f.op)})`),e("span","ls-chip ls-chip-accent",`${String(f.before??"uncalibrated")} → ${String(f.after)}`)),x.append(L,e("small","ls-muted",String(f.reason??""))),p.append(x)}}).catch((g)=>{p.replaceChildren(e("p","ls-muted",g instanceof Error?g.message:String(g)))})},d=e("div","ls-row-between");d.append(N("▶ Run Sandbox Evaluation",r,"ls-btn-primary"),N("Close",s,"ls-btn-sm")),a.append(o,d,p),r()})}function Fe(t,n){let a=structuredClone(t.snapshot.template),s=n.scope==="player"?"character":"player",o=s==="character"?"cast":s==="world"?"world":"stats",i=s==="character"?"cast":s==="world"?"world":"stats",p=n.dossierTabId||"bonds";t.modals.open({title:`\uD83D\uDCCB Duplicate Stat: ${n.icon} ${n.label}`,width:540},(r,d,g,v)=>{r.append(e("p","ls-muted",`Copy "${n.label}" (including its style, color, range, anchors, and AI rules) into another scope or tab.`));let M=e("label","ls-label","New Stat Label (Can keep the same label for a different scope)"),f=e("input","ls-input");f.value=n.label,M.append(f);let x=e("div","ls-label","Target Owner Scope"),L=e("div");x.append(L);let T=e("div","ls-grid"),A=e("div","ls-label","\uD83E\uDE9F Target Widget Tab"),w=e("div");A.append(w);let h=e("div","ls-label","\uD83D\uDCAC Target Inline Tab"),C=e("div");h.append(C);let P=e("div","ls-label","\uD83E\uDEAA Target Dossier Tab"),S=e("div");P.append(S),T.append(A,h,P);let y=J(t,v,w,{value:o,ariaLabel:"Target Widget Tab",options:a.surfaces.widgetTabs.map((m)=>({value:m.id,label:`${m.icon} ${m.label}`})),onChange:(m)=>{o=m}}),u=J(t,v,C,{value:i,ariaLabel:"Target Inline Tab",options:a.surfaces.inlineTabs.map((m)=>({value:m.id,label:`${m.icon} ${m.label}`})),onChange:(m)=>{i=m}});J(t,v,S,{value:p,ariaLabel:"Target Dossier Tab",options:a.surfaces.dossierTabs.map((m)=>({value:m.id,label:`${m.icon} ${m.label}`})),onChange:(m)=>{p=m}}),J(t,v,L,{value:s,ariaLabel:"Target Owner Scope",options:[{value:"character",label:"\uD83D\uDC65 Character Meter (Per-NPC in Cast & Dossier)"},{value:"player",label:"\uD83D\uDC64 Player Stat"},{value:"world",label:"\uD83C\uDF0D World State Stat / Clock"},{value:"scene",label:"\uD83C\uDFAD Scene / Thread Stat"}],onChange:(m)=>{s=m;let b=s==="character"?"cast":s==="world"?"world":"stats";o=b,i=b,y.setValue(b),u.setValue(b)}});let l=N("\uD83D\uDCCB Create Duplicate Stat",()=>{let m=f.value.trim()||n.label,b=re(m,"stat"),I=s==="character"?"char":s,c=a.stats.some((_)=>_.id===b)?`${I}_${b}`:b;if(a.stats.some((_)=>_.id===c))c=`${I}_${b}_${Date.now().toString(36).slice(-3)}`;let k=se({...structuredClone(n),id:c,label:m,scope:s,tabId:o,widgetTabId:o,inlineTabId:i,dossierTabId:p,showIn:{widget:!0,inline:!0,dossier:s==="character",pinnedHeader:!1}});a.stats.push(k),t.request("state:mutate",{templatePatch:{stats:a.stats},reason:`Duplicated "${n.label}" to ${s} (${o})`}),t.notify(`Duplicated "${k.icon} ${k.label}" to ${s}!`),d()},"ls-btn-primary");l.style.marginTop="10px",r.append(M,x,T,l)})}function Ce(t,n="character",a){let s=structuredClone(t.snapshot.template);t.modals.open({title:a?`Edit Stat: ${a.icon} ${a.label}`:"Create Stat or Character Meter",width:660,maxHeight:820},(o,i,p,r)=>{let d=a?.scope??n,g=a?.categoryId??"",v=a?.kind??"meter",M=a?.volatility??(n==="character"?"progressive":"momentary"),f=a?.displayStyle??"auto",x=a?.layoutSpan??"auto",L=a?.color||"var(--lumiverse-primary)",T=a?.widgetTabId??(n==="world"?"world":n==="character"?"cast":"stats"),A=a?.inlineTabId??(n==="world"?"world":n==="character"?"cast":"stats"),w=a?.dossierTabId??"bonds",h=a?.showIn?.widget??!0,C=a?.showIn?.inline??!0,P=a?a.scope==="character"?a.showIn?.dossier??!0:!1:d==="character",S=a?.pinnedToHeader??!1,y=a?.locked??!1,u=e("div");o.append(u);let l=fe(t,r,u,{title:"1. Basics & Value Format",iconName:"stats",defaultExpanded:!0}),m=e("div","ls-grid"),b=e("label","ls-label","Icon"),I=e("input","ls-input");I.value=a?.icon??(n==="character"?"\uD83D\uDC96":"\uD83D\uDCCA"),b.append(I);let c=e("label","ls-label","Stat Name"),k=e("input","ls-input");k.placeholder="e.g. Loyalty, Offscreen NPCs, Threat Clock…",k.value=a?.label??"",c.append(k);let _=e("div","ls-label","Category / Group (Optional)"),B=e("div");_.append(B),J(t,r,B,{value:g,ariaLabel:"Category / Group",options:[{value:"",label:"None (Uncategorized)"},...(s.categories??[]).map((U)=>({value:U.id,label:`${U.icon} ${U.name}`}))],onChange:(U)=>{g=U}}),m.append(b,c,_),l.append(m);let R=e("div","ls-grid"),E=e("div","ls-label","Owner Scope"),D=e("div");E.append(D);let H=e("div","ls-label","Value Format"),F=e("div");H.append(F);let j=e("div","ls-label","Reactivity Profile"),O=e("div");j.append(O),R.append(E,H,j),l.append(R);let W=e("div","ls-grid"),K=e("label","ls-label","Minimum"),z=e("input","ls-input");z.type="number",z.value=String(a?.min??0),K.append(z);let V=e("label","ls-label","Maximum / Segments"),G=e("input","ls-input");G.type="number",G.value=String(a?.max??100),V.append(G);let q=e("label","ls-label","Starting / Fallback Value"),X=e("input","ls-input");X.value=String(a?.defaultValue??0),q.append(X),W.append(K,V,q),l.append(W);let te=()=>{let U=["meter","clock","pips","number","hearts","currency","attributes"].includes(v)&&f==="auto";W.style.display=U?"":"none"};te();let ae=e("div");o.append(ae);let Y=fe(t,r,ae,{title:"2. Appearance, Visibility & Tabs",iconName:"palette",defaultExpanded:!1}),Q=e("div","ls-grid"),le=e("div","ls-label","Visual Display Style"),ge=e("div");le.append(ge);let Se=e("div","ls-label","Card Grid Width"),ie=e("div");Se.append(ie),Q.append(le,Se),Y.append(Q);let vt=e("div","ls-label","Accent & Bar Color"),Je=e("div","ls-row"),ln=[{value:"var(--lumiverse-primary)",label:"Theme Primary",preview:"var(--lumiverse-primary, #38bdf8)"},{value:"#38bdf8",label:"Sky Cyan",preview:"#38bdf8"},{value:"#f472b6",label:"Rose Pink",preview:"#f472b6"},{value:"#f59e0b",label:"Amber Gold",preview:"#f59e0b"},{value:"#10b981",label:"Emerald",preview:"#10b981"},{value:"#a78bfa",label:"Royal Violet",preview:"#a78bfa"},{value:"#f43f5e",label:"Crimson",preview:"#f43f5e"}],cn=()=>{for(let U of[...Je.querySelectorAll(".ls-color-swatch")])U.setAttribute("aria-pressed",String(U.dataset.colorVal===L))};for(let U of ln){let Z=N("",()=>{L=U.value,cn()},"ls-color-swatch",U.label);Z.dataset.colorVal=U.value,Z.style.background=U.preview,Je.append(Z)}let We=e("input");if(We.type="color",We.title="Custom color",We.style.cssText="width:26px;height:22px;border:0;padding:0;background:transparent;cursor:pointer;",L.startsWith("#")&&L.length===7)We.value=L;We.addEventListener("input",()=>{L=We.value,cn()}),Je.append(We),cn(),vt.append(Je),Y.append(vt);let jn=e("div","ls-grid"),Un=e("div","ls-label","Floating Widget Tab"),qn=e("div");Un.append(qn);let Kn=e("div","ls-label","Inline Ribbon Tab"),Gn=e("div");Kn.append(Gn);let Zn=e("div","ls-label","Character Dossier Tab"),Xn=e("div");Zn.append(Xn),jn.append(Un,Kn,Zn),Y.append(jn);let Yn=e("div","ls-grid"),Qn;for(let[U,Z,pe]of[["Show in Widget",h,(oe)=>{h=oe}],["Show in Inline Ribbon",C,(oe)=>{C=oe}],["Show in Dossier",P,(oe)=>{P=oe}],["Pin to Header / Pill",S,(oe)=>{S=oe}],["Lock Value",y,(oe)=>{y=oe}]]){let oe=e("div");if(U==="Show in Dossier")Qn=oe;xe(t,r,oe,{checked:Z,label:U,onChange:pe}),Yn.append(oe)}Y.append(Yn);let Bt=new Set(a?.extraWidgetTabIds??[]),Jn=e("div","ls-label","Also Mirror in Additional Widget Tabs (Optional)"),ea=e("div","ls-row");for(let U of s.surfaces.widgetTabs){let Z=e("div");xe(t,r,Z,{checked:Bt.has(U.id),label:`${U.icon} ${U.label}`,onChange:(pe)=>{if(pe)Bt.add(U.id);else Bt.delete(U.id)}}),ea.append(Z)}Jn.append(ea),Y.append(Jn);let be=a?.calculationMode==="ai_plus_local"||a?.calculationMode==="local_formula"?a.calculationMode:Boolean(a?.formula?.trim())&&a?.calculationMode!=="ai"?"local_formula":"ai",Dt=a?.promptTriggerMode??"always",dn=a?.injectInContinuity!==!1,ta=e("div");o.append(ta);let Oe=fe(t,r,ta,{title:"3. Calculation Mode, Formula & Token Diet",iconName:"sparkles",badge:be==="local_formula"?"Pure Local":be==="ai_plus_local"?"AI + Local":"AI",defaultExpanded:!0}),pn=e("div","ls-stat-cell");pn.append(e("strong","","Calculation Mode"),e("small","ls-muted",'Use "AI + Local Math" when the AI must set starting values/deltas (e.g. Level & Stats, Vitals). Use "Pure Local" (0 tokens) when computed strictly from other stats (e.g. Eff POW/AGI).'));let na=e("div","ls-row");pn.append(na),Oe.append(pn);let un=e("div","ls-label","Prompt Frequency (When AI-Tracked)"),aa=e("div");un.append(aa),Oe.append(un);let sa=e("div");xe(t,r,sa,{checked:dn,label:"Include this stat in Story Continuity Prompt (turn off for UI-only scratchpads)",onChange:(U)=>{dn=U}}),Oe.append(sa);let mn=e("label","ls-label","Trigger Keywords (comma-separated — only sends rule when seen in recent chat)"),Ht=e("input","ls-input");Ht.placeholder="e.g. cash, money, bank, rent, pay, buy, wallet",Ht.value=(a?.promptKeywords??[]).join(", "),mn.append(Ht),Oe.append(mn);let fn=e("div","ls-stack"),ue=e("textarea","ls-input");ue.rows=4,ue.placeholder=`Write math using your stat IDs or auto-extracted tokens (e.g. round((40 + P + Lv * 2) * wound))
Supports: + - * / %, round(), floor(), ceil(), min(), max(), clamp(), if(), hasCond("...")`,ue.value=a?.formula??"";let ra=e("label","ls-label","Output Format Template (optional, e.g. POW {pow} | AGI {agi})"),He=e("input","ls-input");He.placeholder="Leave blank for plain number, or e.g. POW {pow} | AGI {agi}",He.value=a?.formulaOutputTemplate??"",ra.append(He);let Te=e("div","ls-formula-status"),Me=e("strong",""),Ft=e("small","ls-muted");Te.append(Me,Ft);let oa=e("div","ls-label"),Wt=e("div","ls-row-between"),ye=e("textarea","ls-input");ye.rows=3,ye.value=a?.triggerCues??"",ye.placeholder='Write your rule in plain English (used by AI, or click "Convert My Rule to Formula" when Local Toggle is ON)…';let hn=e("div","ls-row"),yt=e("div","ls-row");Te.append(yt);let us=(U)=>{let Z=ue.selectionStart??ue.value.length,pe=ue.selectionEnd??ue.value.length;ue.value=ue.value.slice(0,Z)+U+ue.value.slice(pe),ue.focus(),ue.setSelectionRange(Z+U.length,Z+U.length),tt()},gn=!1,et="",bn=(U,Z)=>{if(gn)return;let pe=U.trim();if(!pe){if(be==="ai")be="local_formula";nt(),Te.dataset.status="warn",Me.textContent="⚠ Write your plain-English rule in the box below first, then click Convert.",ye.focus();return}if(!ye.value.trim())ye.value=pe;gn=!0;let oe=Z?.textContent??"";if(Z)Z.disabled=!0,Z.textContent="⏳ Converting…";if(be==="ai")be="local_formula";nt(),Te.dataset.status="warn",Me.textContent="⏳ Converting your rule to a universal local formula…",yt.replaceChildren(),t.request("formula:compile",{statLabel:k.value.trim()||"Stat",ruleText:pe,scope:d}).then((ne)=>{let $e=typeof ne.formula==="string"?ne.formula.trim():"";if(!$e){Te.dataset.status="error",Me.textContent="✖ AI returned an empty formula. Check your LLM connection in Studio → 6. AI & Connections.";return}if(ue.value=$e,typeof ne.outputTemplate==="string")He.value=ne.outputTemplate;if(ne.suggestedMode==="ai_plus_local"||ne.suggestedMode==="local_formula")be=ne.suggestedMode;if(et=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),nt(),ne.explanation)Ft.textContent=`✓ ${String(ne.explanation)} · ${Ft.textContent}`}).catch((ne)=>{Te.dataset.status="error",Me.textContent=`✖ Convert Failed: ${ne instanceof Error?ne.message:String(ne)}`}).finally(()=>{if(gn=!1,Z&&Z.isConnected)Z.disabled=!1,Z.textContent=oe})},tt=()=>{let U=se({...a,id:a?.id||re(k.value||"preview","preview"),label:k.value||"Preview",scope:d,kind:v,calculationMode:"local_formula",formula:ue.value,formulaOutputTemplate:He.value}),Z=Da(U,t.snapshot.state,s.stats,t.selectedActorId);hn.replaceChildren(e("small","ls-muted","Insert Variable:"));let pe=[...Object.keys(Z.availableTokens).slice(0,12),...Z.availableStringVars.conditions!==void 0?["conditions"]:[]];for(let ne of pe){let $e=Z.availableTokens[ne]!==void 0?String(Z.availableTokens[ne]):Z.availableStringVars[ne]||'""';hn.append(N(`${ne} (${$e.slice(0,16)})`,()=>us(ue.value.includes("{{")?`{{.${ne}}}`:ne),"ls-btn-sm ls-quick-pill",`Click to insert ${ne}`))}let oe=Object.entries(Z.availableTokens).slice(0,14).map(([ne,$e])=>`${ne}=${$e}`).join(", ");if(Ft.textContent=oe?`Detected on ${Z.targetName}: ${oe}`:`No numeric tokens detected yet on ${Z.targetName}.`,yt.replaceChildren(),!ue.value.trim()){if(Te.dataset.status="warn",Me.textContent=ye.value.trim()?"⚠ Formula box is empty. Click below to convert your plain-English rule automatically, or type math / {{calc::...}} macros.":"⚠ Enter math lines, Lumiverse {{calc::...}} / {{if::...}} macros, or write a rule below and click Convert.",ye.value.trim()){let ne=N("⚡ Convert My Rule to Local Formula",()=>bn(ye.value,ne),"ls-btn-sm ls-btn-primary");yt.append(ne)}}else if(Z.isProse){Te.dataset.status="warn",Me.textContent="⚠ Plain-English text detected — this box runs math/macro syntax. Click below to convert it automatically:";let ne=N("⚡ Convert This Text to Formula",()=>bn(ue.value,ne),"ls-btn-sm ls-btn-primary");yt.append(ne)}else if(Z.error)Te.dataset.status="error",Me.textContent=`✖ Formula Error: ${Z.error}`;else if(Z.output!==void 0){let ne=Object.keys(Z.locals).filter((Le)=>Le!=="value"&&Le!=="result");if(ne.length>=2&&!He.value.trim()&&!ue.value.includes("{{"))Te.dataset.status="warn",Me.textContent=`⚠ Result is just "${String(Z.output)}" because Output Format Template is blank. Add e.g. {${ne.join("} {")}} above!`;else{Te.dataset.status="ok";let Le=et?` (Tested ${et})`:"";Me.textContent=`✓ Working on ${Z.targetName} → Result: ${String(Z.output)}${Le}`}}else if(Z.missingRefs.length>0)Te.dataset.status="warn",Me.textContent=`⚠ Waiting for variables: ${Z.missingRefs.join(", ")}`;else Te.dataset.status="warn",Me.textContent="⚠ Formula evaluated empty — check placeholder names or macro tags."};ue.addEventListener("input",()=>{et="",tt()}),He.addEventListener("input",()=>{et="",tt()});let ia=e("div","ls-row-between");ia.append(e("strong","","Local Formula or Lumiverse Macros ({{calc}}, {{if}}, {{round}}, {{matches}})"),N("▶ Run Live Test",()=>{et=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),tt()},"ls-btn-sm")),fn.append(ia,hn,ue,ra,Te),Oe.append(fn);let la=[],nt=()=>{for(let pe of la)pe.el.setAttribute("aria-current",pe.id===be?"page":"false");let U=be==="local_formula"||be==="ai_plus_local",Z=be==="ai"||be==="ai_plus_local";if(fn.style.display=U?"":"none",un.style.display=Z?"":"none",mn.style.display=Z&&Dt==="conditional"?"":"none",U)tt()};for(let[U,Z]of[["ai","\uD83E\uDD16 AI Only"],["ai_plus_local","\uD83D\uDD00 AI + Local Math"],["local_formula","⚡ Pure Local (0 tokens)"]]){let pe=N(Z,()=>{be=U,nt()},"ls-btn-sm");la.push({id:U,el:pe}),na.append(pe)}J(t,r,aa,{value:Dt,ariaLabel:"Prompt Frequency",options:[{value:"always",label:"Always in Prompt"},{value:"conditional",label:"Only When Keywords Match"},{value:"manual",label:"Manual Sync Only"}],onChange:(U)=>{Dt=U,nt()}}),nt(),Wt.append(e("span","","Rule / AI Prompt Instructions"),e("div","ls-row"));let ca=N("⚡ Convert My Rule to Local Formula",()=>bn(ye.value,ca),"ls-btn-sm ls-btn-primary");Wt.lastElementChild.append(ca);let vn=J(t,r,ge,{value:f,ariaLabel:"Visual Display Style",options:[{value:"auto",label:"✨ Smart Auto-Detect"},{value:"arc_tracker",label:"\uD83C\uDFAF Multi-Thread / Arc / Quest Cards"},{value:"accordion_cards",label:"\uD83D\uDDC2️ Collapsible Multi-Entry Cards"},{value:"matrix_badges",label:"⚖️ Split / Versus Comparison (Knows vs Blind)"},{value:"meter_mini_bars",label:"\uD83D\uDCCA Multi-Bar Mini Gauges (HP/MP cur/max)"},{value:"stat_pills_grid",label:"\uD83E\uDDEC Compact Stat Badges (Lv / P A I / POW)"},{value:"bullet_ledger",label:"\uD83D\uDCB0 Aligned Bullet & Currency Ledger"},{value:"timeline_list",label:"\uD83D\uDCDC Vertical Event Timeline"},{value:"checklist",label:"☑️ Visual Objectives Checklist"},{value:"feed_cards",label:"\uD83C\uDCCF Structured Flow Cards"},{value:"step_chain",label:"⛓️ Horizontal Step Chain"},{value:"key_value",label:"\uD83D\uDCCB Key–Value Table"},{value:"pill_list",label:"\uD83C\uDFF7️ Tag / Pill List"},{value:"quote_callout",label:"\uD83D\uDCAD Quote Callout Box"}],onChange:(U)=>{f=U;let Z=new Set(["text","tags","tier","skill_tree","xp_level","attributes","inventory","status_fx"]);if(f==="pill_list")v="tags",Ot.setValue("tags");else if(f!=="auto"&&!Z.has(v))v="text",Ot.setValue("text");te()}}),yn=J(t,r,ie,{value:x,ariaLabel:"Card Grid Width",options:[{value:"auto",label:"\uD83D\uDCD0 Auto"},{value:"full",label:"↔️ Always Full Width"},{value:"half",label:"▫ Always Compact Column"}],onChange:(U)=>{x=U}});J(t,r,D,{value:d,ariaLabel:"Owner Scope",options:[{value:"character",label:"\uD83D\uDC65 Character Meter (Per-NPC)"},{value:"player",label:"\uD83D\uDC64 Player Stat"},{value:"world",label:"\uD83C\uDF0D World Stat / Clock"},{value:"scene",label:"\uD83C\uDFAD Scene / Thread Stat"}],onChange:(U)=>{d=U,P=d==="character";let Z=Qn?.querySelector("input");if(Z)Z.checked=P;if(be==="local_formula")tt()}});let Ot=J(t,r,F,{value:v,ariaLabel:"Value Format",options:[{value:"meter",label:"\uD83D\uDCCA Progress Bar / Meter"},{value:"skill_tree",label:"\uD83C\uDF33 Skill Tree & SP"},{value:"xp_level",label:"⭐ XP & Leveling Gauge"},{value:"attributes",label:"\uD83E\uDDEC RPG Attributes + Radar"},{value:"inventory",label:"\uD83C\uDF92 Rarity Inventory"},{value:"status_fx",label:"⚡ Buffs & Debuffs"},{value:"hearts",label:"❤️ Heart Affinity Row"},{value:"currency",label:"\uD83E\uDE99 Currency Counter"},{value:"clock",label:"⏱️ Segmented Clock"},{value:"pips",label:"\uD83C\uDFB2 Resource Pips"},{value:"text",label:"\uD83D\uDCDD Structured Text / Feed"},{value:"tags",label:"\uD83C\uDFF7️ Tag / Pill List"},{value:"tier",label:"\uD83C\uDFC6 Ordered Stage / Rank"},{value:"number",label:"\uD83D\uDD22 Numeric Counter"},{value:"boolean",label:"☑️ Boolean Flag"}],onChange:(U)=>{if(v=U,v==="tags"&&f==="auto")f="pill_list",vn.setValue("pill_list");else if(["meter","clock","pips","number","boolean","skill_tree","xp_level","attributes","inventory","status_fx","hearts","currency"].includes(v)){if(f="auto",vn.setValue("auto"),["skill_tree","attributes","inventory","status_fx"].includes(v))x="full",yn.setValue("full")}if(["text","tags","tier"].includes(v)&&X.value.trim()==="0")X.value="";te()}});J(t,r,O,{value:M,ariaLabel:"Reactivity Profile",options:[{value:"momentary",label:"⚡ Momentary — Instant reaction"},{value:"progressive",label:"\uD83D\uDCC8 Progressive — Steady evolution"},{value:"anchor",label:"⚓ Anchor — Role/premise baseline"}],onChange:(U)=>{M=U}}),J(t,r,qn,{value:T,ariaLabel:"Floating Widget Tab",options:s.surfaces.widgetTabs.map((U)=>({value:U.id,label:`${U.icon} ${U.label}`})),onChange:(U)=>{T=U}}),J(t,r,Gn,{value:A,ariaLabel:"Inline Ribbon Tab",options:s.surfaces.inlineTabs.map((U)=>({value:U.id,label:`${U.icon} ${U.label}`})),onChange:(U)=>{A=U}}),J(t,r,Xn,{value:w,ariaLabel:"Character Dossier Tab",options:s.surfaces.dossierTabs.map((U)=>({value:U.id,label:`${U.icon} ${U.label}`})),onChange:(U)=>{w=U}}),Wt.lastElementChild.append(N("\uD83C\uDF33 Skill Rule",()=>{v="skill_tree",Ot.setValue("skill_tree"),x="full",yn.setValue("full"),ye.value='Format: "SP: N | Skill A (Lv.X/Y, cost:1, bonus) ; Skill B (Lv.X/Y, cost:1, req:Skill A)". Grant SP on milestones or training.',te()},"ls-btn-sm"),N("✨ Feed Rule",()=>{v="text",Ot.setValue("text"),f="feed_cards",vn.setValue("feed_cards"),x="full",yn.setValue("full"),ye.value='Format each entry separated by "; " as: "Subject: Current Location -> Action -> Next Hook".',te()},"ls-btn-sm"),N("⛶ Full-Screen",()=>{t.request("textEditor:open",{title:`AI Prompt Rule: ${k.value||"Stat"}`,value:ye.value,placeholder:"Describe when this stat should calibrate high/low and what situational cues shift it…"}).then((U)=>{if(!U.cancelled&&typeof U.text==="string")ye.value=U.text})},"ls-btn-sm")),oa.append(Wt,ye),Oe.append(oa);let da=e("div","ls-label"),pa=e("div","ls-row-between"),at=e("textarea","ls-input");at.rows=2,at.placeholder=`Optional — e.g.
80: High — Description
50: Moderate — Description`,at.value=(a?.anchors??[]).map((U)=>`${U.value}: ${U.label}${U.description&&U.description!==U.label?` — ${U.description}`:""}`).join(`
`),pa.append(e("span","","Scale Anchors (value: Label — Description)"),N("✨ Auto-Fill Anchors",()=>{let U=ya(Number(z.value)||0,Number(G.value)||100,M);at.value=U.map((Z)=>`${Z.value}: ${Z.label} — ${Z.description}`).join(`
`)},"ls-btn-sm")),da.append(pa,at),Oe.append(da);let ms=(U)=>{if(!U.trim())return[];let Z=[];for(let pe of U.split(`
`).map((oe)=>oe.trim()).filter(Boolean)){let oe=pe.match(/^(-?\d+(?:\.\d+)?)\s*:\s*([^—\-]+?)(?:\s*[—\-]\s*(.+))?$/);if(oe)Z.push({value:Number(oe[1]),label:oe[2].trim(),description:(oe[3]??oe[2]).trim()})}return Z},ua=N(a?"Save Changes":"Create Stat",()=>{let U=k.value.trim();if(!U)return;let Z=structuredClone(t.snapshot.template),pe=Number(z.value),oe=z.value.trim()!==""&&Number.isFinite(pe)?pe:0,ne=Number(G.value),$e=G.value.trim()!==""&&Number.isFinite(ne)?ne:100,Le=X.value.trim(),ma=Number(Le),fa=v==="boolean"?Le==="true"||Le==="1":["meter","number","clock","pips","hearts","currency"].includes(v)&&f==="auto"?Le!==""&&Number.isFinite(ma)?ma:Math.max(Math.min(oe,$e),Math.min(Math.max(oe,$e),0)):Le&&Le!=="0"?Le:void 0,fs=Ht.value.split(",").map((Ie)=>Ie.trim().toLowerCase()).filter(Boolean),ha=a?.id,xn=[];if(a&&U.toLowerCase()!==a.label.trim().toLowerCase()){let Ie=re(U,a.id),hs=Z.stats.some((va)=>va.id===Ie&&va.id!==a.id);if(Ie&&Ie!==a.id&&!hs)ha=Ie,xn.push({fromId:a.id,toId:Ie})}let xt=se({...a,id:ha,label:U,icon:I.value.trim()||"\uD83D\uDCCA",scope:d,kind:v,volatility:M,displayStyle:f,layoutSpan:x,color:L,min:oe,max:$e,...fa!==void 0?{defaultValue:fa}:{},anchors:ms(at.value),triggerCues:ye.value.trim(),calculationMode:be,formula:be==="local_formula"||be==="ai_plus_local"?ue.value.trim():void 0,formulaOutputTemplate:be==="local_formula"||be==="ai_plus_local"?He.value.trim():void 0,promptTriggerMode:Dt,promptKeywords:fs,injectInContinuity:dn,categoryId:g||void 0,pinnedToHeader:S,locked:y,widgetTabId:T,inlineTabId:A,dossierTabId:w,extraWidgetTabIds:[...Bt].filter((Ie)=>Ie!==T),showIn:{widget:h,inline:C,dossier:P,pinnedHeader:S}}),ga=a?Z.stats.findIndex((Ie)=>Ie.id===a.id):-1,ba=Z.stats.findIndex((Ie)=>Ie.id===xt.id);if(ga>=0)Z.stats[ga]=xt;else if(ba>=0)Z.stats[ba]=xt;else Z.stats.push(xt);t.request("state:mutate",{templatePatch:{stats:Z.stats},...xn.length?{statRenames:xn}:{},reason:`Saved stat schema "${xt.label}"`}),i()},"ls-btn-primary"),zt=e("div","ls-row-between");if(zt.style.marginTop="12px",a)zt.append(N("Duplicate to Another Tab…",()=>{i(),Fe(t,a)},"ls-btn-sm"),ua);else zt.append(e("span"),ua);o.append(zt)})}function Bn(t,n,a,s,o=!1,i=!0){let{state:p,template:r,deltas:d}=t.snapshot,g=e("div","ls-stack");if(i){let h=e("div","ls-row-between");h.append(e("span","ls-kicker",`Active Stats (${n.length})`),e("div","ls-row")),h.lastElementChild.append(ee("flask",()=>Ge(t),{label:"Sandbox",className:"ls-btn-sm ls-btn-ghost",title:"Test stats in AI Sandbox"}),ee("plus",()=>Ce(t,a),{label:"Add Stat",className:"ls-btn-sm ls-btn-primary",title:"Create a new stat or meter"})),g.append(h)}if(!n.length)return g.append(e("p","ls-muted",'No stats assigned here yet. Click "+ Add Stat" or customize tab assignments in Studio.')),g;let v=new Map((r.categories??[]).map((h)=>[h.id,h])),M=n.filter((h)=>{if(!h.categoryId)return!0;let C=v.get(h.categoryId);return!C||C.enabled!==!1}),f=e("div","ls-stat-grid"),x=(h,C,P="set")=>{t.request("state:mutate",{patch:{stats:{[h.id]:{op:P,value:C,reason:"Manual UI adjustment"}}},reason:`Updated ${h.label} to ${String(C)}`})},L=[],T=[...M].sort((h,C)=>{let P=h.categoryId?v.get(h.categoryId)?.order??999:1000,S=C.categoryId?v.get(C.categoryId)?.order??999:1000;return P-S}),A;for(let h of T){let C=h.categoryId?v.get(h.categoryId):void 0;if(C&&C.showGroupHeaderInHud!==!1&&C.id!==A){A=C.id;let W=e("div","ls-hud-cat-head");W.style.borderLeftColor=C.color||"var(--ls-primary)",W.append(e("strong","",`${C.icon} ${C.name}`)),f.append(W)}else if(!C&&A!==void 0)A=void 0;let P=p.stats[h.id],S=Boolean(P?.calibrated),y=P!==void 0?P.value:h.defaultValue,u=Boolean(h.locked||P?.locked),l=d.statDeltas[h.id]??0,m=String(y??""),b=["skill_tree","xp_level","attributes","inventory","status_fx"].includes(h.kind),I=Boolean(h.displayStyle&&h.displayStyle!=="auto"),c=h.kind==="text"||h.kind==="tags"||h.kind==="tier",k=!b&&(I||c||S&&typeof y==="string"&&(m.length>24||/->|→|\n|;/.test(m))),_=/->|→|\n|;/.test(m),B=h.displayStyle==="stat_pills_grid"||h.displayStyle==="meter_mini_bars",R=h.layoutSpan==="full"||h.layoutSpan!=="half"&&(["skill_tree","attributes","inventory","status_fx","xp_level"].includes(h.kind)||I&&!B||k&&(m.length>40||_))?"full":"half",E=e("div","ls-stat-cell");if(E.style.setProperty("--ls-bar-color",h.color||"var(--ls-primary)"),E.dataset.locked=String(u),E.dataset.uncalibrated=String(!S),E.dataset.span=R,P?.lastReason)E.title=`${P.lastReason} (Right-click or long-press for options)`;let D=e("div","ls-row-between"),H=e("div","ls-row");if(H.append(e("strong","",`${h.icon} ${h.label}`)),h.calculationMode==="ai_plus_local")H.append(e("span","ls-chip ls-chip-accent","\uD83D\uDD00 Hybrid"));else if(h.calculationMode==="local_formula"||h.formula)H.append(e("span","ls-chip ls-chip-accent","⚡ Local"));D.append(H);let F=e("div","ls-row");if(l!==0)F.append(e("span",`ls-delta ${l>0?"is-pos":"is-neg"}`,`${l>0?`+${l} ▲`:`${l} ▼`}`));let j="";if(!S&&!b)j="Uncalibrated";else if(h.kind==="clock"||h.kind==="pips")j=`${Number(y)||0}/${h.max}`;else if(h.kind==="boolean")j=y?"✓ Active":"○ Inactive";else if(b||h.kind==="currency"||h.kind==="hearts")j="";else if(k){let W=Et(m).length;j=W>1?`${W} entries`:""}else j=m;let O=e("strong",j?"ls-chip ls-chip-accent":"",j);if(j)F.append(O);if(F.append(ee("edit",()=>Ce(t,h.scope,h),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:`Edit "${h.label}" style, tab & prompt`})),D.append(F),E.append(D),typeof y==="number"&&S&&!k&&h.kind!=="currency"){let W=je(h.anchors,y);if(W)E.append(e("small","ls-muted",W))}else if(!S&&!b)E.append(e("small","ls-muted","Calibrates automatically on turn sync"));if(h.kind==="skill_tree")E.append(lt(h,y,u,(W,K)=>{t.request("state:mutate",{patch:{stats:{[h.id]:{op:"set",value:W,reason:K}}},reason:K})}));else if(h.kind==="xp_level")E.append(ct(h,y));else if(h.kind==="attributes")E.append(dt(h,y,`player:${t.chatId}`));else if(h.kind==="inventory")E.append(pt(y));else if(h.kind==="status_fx")E.append(ut(y));else if(h.kind==="hearts")E.append(mt(h,Number(y)||0,S,u,(W)=>x(h,W,"set")));else if(h.kind==="currency")E.append(ft(h,y,l));else if(k&&S&&m&&m!=="None")E.append(Ze(m,h.displayStyle??"auto"));else if(h.kind==="clock"){let W=Math.max(2,Math.min(16,h.max||6)),K=S?Math.max(0,Math.min(W,Math.round(Number(y)||0))):0,z=e("div","ls-clock-bar");z.style.gridTemplateColumns=`repeat(${W}, 1fr)`;for(let V=1;V<=W;V++){let G=e("span",`ls-clock-seg${V<=K?" is-filled":""}`);G.addEventListener("click",()=>x(h,V===K?V-1:V,"set")),z.append(G)}E.append(z)}else if(h.kind==="pips"){let W=Math.max(1,Math.min(12,h.max||5)),K=S?Math.max(0,Math.min(W,Math.round(Number(y)||0))):0,z=e("div","ls-row");for(let V=1;V<=W;V++)z.append(N(V<=K?"◆":"◇",()=>x(h,V===K?V-1:V,"set"),"ls-btn-sm ls-btn-icon"));E.append(z)}else if(!k&&(h.kind==="meter"||h.kind==="number")){let W=typeof y==="number"?y:Number(h.defaultValue)||0,K=Math.max(1,h.max-h.min),z=e("div","ls-bar-track"),V=e("div","ls-bar-fill");if(h.min<0&&h.max>0){z.dataset.bipolar="true";let G=(0-h.min)/K*100;if(W>=0)V.style.marginLeft=`${G.toFixed(1)}%`,V.style.width=`${Math.min(100-G,W/h.max*(100-G)).toFixed(1)}%`;else{let q=Math.abs(W)/Math.abs(h.min)*G;V.style.marginLeft=`${Math.max(0,G-q).toFixed(1)}%`,V.style.width=`${Math.min(G,q).toFixed(1)}%`,V.style.background="var(--ls-danger)"}}else{let G=Math.max(0,Math.min(100,Math.round((W-h.min)/K*100)));V.style.width=`${G}%`}if(z.append(V),E.append(z),o&&s&&t.ctx.components?.mountRangeSlider){let G=e("div");E.append(G);try{s.track(t.ctx.components.mountRangeSlider(G,{min:h.min,max:h.max,step:h.step||1,integer:!0,value:W,disabled:u,onDragValue:(q)=>{if(q!==null)O.textContent=String(q)},onCommit:(q)=>x(h,q,"set")}))}catch{}}}Ut(t.ctx,E,()=>[{key:"pin",label:h.pinnedToHeader?"\uD83D\uDCCC Unpin from Header":"\uD83D\uDCCD Pin to Header",active:h.pinnedToHeader},{key:"lock",label:u?"\uD83D\uDD13 Unlock Stat":"\uD83D\uDD12 Lock Stat",active:u},{key:"edit",label:"✏️ Edit Stat Schema, Visual Style & Routing"},{key:"duplicate",label:"\uD83D\uDCCB Duplicate to Another Scope / Tab…"},{key:"test",label:"\uD83E\uDDEA Test in AI Sandbox"},{key:"div",label:"",type:"divider"},{key:"delete",label:"\uD83D\uDDD1️ Delete Stat",danger:!0}],(W)=>{if(W==="pin"){let K=r.stats.map((z)=>z.id===h.id?{...z,pinnedToHeader:!z.pinnedToHeader,showIn:{...z.showIn,pinnedHeader:!z.pinnedToHeader}}:z);t.request("state:mutate",{templatePatch:{stats:K}})}else if(W==="lock"){let K=r.stats.map((z)=>z.id===h.id?{...z,locked:!u}:z);t.request("state:mutate",{templatePatch:{stats:K}})}else if(W==="edit")Ce(t,h.scope,h);else if(W==="duplicate")Fe(t,h);else if(W==="test")Ge(t,h.id);else if(W==="delete"){let K=r.stats.filter((z)=>z.id!==h.id);t.request("state:mutate",{templatePatch:{stats:K}})}}),L.push({cell:E,spanMode:R,autoSpan:!h.layoutSpan||h.layoutSpan==="auto"}),f.append(E)}let w=0;for(let h=0;h<L.length;h++){let C=L[h];if(C.spanMode==="half"){if(w++,(h===L.length-1||L[h+1].spanMode==="full")&&w%2===1&&C.autoSpan)C.cell.dataset.span="full",w=0}else w=0}return g.append(f),g}var Ka=new Map;function Os(t,n,a,s=!1){let{state:o,deltas:i}=t.snapshot,p=e("div","ls-stack"),r=Object.values(o.characters),d=r.filter((f)=>f.present),g=r.filter((f)=>!f.present),v=d.length>0?d:g,M=d.length>0?g:[];if(!r.length)return p.append(e("p","ls-muted",`${n.map((f)=>`${f.icon} ${f.label}`).join(", ")} will appear here once characters enter the scene.`)),p;for(let f of n){let x=e("div","ls-stat-cell");x.style.setProperty("--ls-bar-color",f.color||"var(--ls-primary)"),x.dataset.span="full";let L=e("div","ls-row-between");L.append(e("strong","",`${f.icon} ${f.label} (Cast)`),N("✏️",()=>Ce(t,"character",f),"ls-btn-sm ls-btn-icon","Customize stat schema & tab")),x.append(L);let T=["skill_tree","xp_level","attributes","inventory","status_fx"].includes(f.kind),A=Boolean(f.displayStyle&&f.displayStyle!=="auto")||["text","tags","tier"].includes(f.kind),w=(C,P)=>{let S=P.meters[f.id],y=Boolean(S?.calibrated),u=y&&S?S.value:f.defaultValue,l=i.characterDeltas[P.id]?.[f.id]??0;if(T||A||f.kind==="boolean"||f.kind==="hearts"||f.kind==="currency"){let H=e("div","ls-cast-mini-meter");H.style.gridColumn="1 / -1";let F=e("div","ls-row-between");if(F.append(e("small","ls-muted",`${P.present?"\uD83D\uDFE2":"⚪"} ${P.name}`),e("small","",y||T?"":"Uncalibrated")),H.append(F),f.kind==="skill_tree")H.append(lt(f,u,Boolean(f.locked||S?.locked),(j,O)=>{t.request("state:mutate",{patch:{characters:[{id:P.id,name:P.name,meters:{[f.id]:{op:"set",value:j,reason:O}}}]},reason:O})}));else if(f.kind==="xp_level")H.append(ct(f,u));else if(f.kind==="attributes")H.append(dt(f,u,`${P.id}:${t.chatId}`));else if(f.kind==="inventory")H.append(pt(u));else if(f.kind==="status_fx")H.append(ut(u));else if(f.kind==="hearts")H.append(mt(f,Number(u)||0,y,Boolean(f.locked||S?.locked)));else if(f.kind==="currency")H.append(ft(f,u,l));else H.append(y?Ze(String(u??""),f.displayStyle??"auto"):e("small","ls-muted","—"));C.append(H);return}let m=y&&typeof u==="number"?u:0,b=Math.max(1,f.max-f.min),I=y?Math.max(0,Math.min(100,Math.round((m-f.min)/b*100))):0,c=y?je(f.anchors,m):"",k=e("div","ls-cast-mini-meter");if(c)k.title=`${P.name} · ${f.label}: ${m} (${c})`;let _=e("div","ls-row-between");_.append(e("small","ls-muted",`${P.present?"\uD83D\uDFE2":"⚪"} ${P.name}`));let B=e("div","ls-row");if(l!==0)B.append(e("span",`ls-delta ${l>0?"is-pos":"is-neg"}`,l>0?`+${l}`:String(l)));let R=e("strong","",y?f.kind==="clock"||f.kind==="pips"?`${m}/${f.max}`:String(m):"—");B.append(R),_.append(B);let E=e("div","ls-bar-track"),D=e("div","ls-bar-fill");if(D.style.width=`${I}%`,E.append(D),k.append(_,E),s&&a&&t.ctx.components?.mountRangeSlider){let H=e("div");k.append(H);try{a.track(t.ctx.components.mountRangeSlider(H,{min:f.min,max:f.max,step:f.step||1,integer:!0,value:m,disabled:Boolean(f.locked||S?.locked),onDragValue:(F)=>{if(F!==null)R.textContent=String(F)},onCommit:(F)=>{t.request("state:mutate",{patch:{characters:[{id:P.id,name:P.name,meters:{[f.id]:{op:"set",value:F,reason:"Manual UI adjustment"}}}]},reason:`Updated ${P.name} ${f.label} to ${F}`})}}))}catch{}}C.append(k)},h=e("div","ls-cast-mini-grid");for(let C of v)w(h,C);if(x.append(h),M.length>0){let C=e("details","ls-stat-acc");C.open=Ka.get(f.id)??!1,C.addEventListener("toggle",()=>{Ka.set(f.id,C.open)});let P=e("summary","ls-stat-acc-head");P.append(e("small","ls-muted",`⚪ Away (${M.length}): ${M.map((u)=>u.name).join(", ")}`),e("small","ls-muted","▾"));let S=e("div","ls-stat-acc-body"),y=e("div","ls-cast-mini-grid");for(let u of M)w(y,u);S.append(y),C.append(P,S),x.append(C)}p.append(x)}return p}function tn(t,n,a,s,o=!1){let{template:i}=t.snapshot,p=i.stats.filter((f)=>{if(!f.enabled)return!1;if(n==="widget"&&f.showIn?.widget===!1)return!1;if(n==="inline"&&f.showIn?.inline===!1)return!1;let x=f.scope==="character"?"cast":f.tabId,L=n==="widget"?f.widgetTabId||x:f.inlineTabId||x,T=n==="widget"?f.extraWidgetTabIds:f.extraInlineTabIds;return L===a||Boolean(T?.includes(a))}),r=p.filter((f)=>f.scope!=="character"),d=p.filter((f)=>f.scope==="character"),g=a==="world"?"world":"player",v=e("div","ls-stack"),M=zs(t,n,a);if(M.childElementCount>0)v.append(M);if(r.length>0||d.length===0&&v.childElementCount===0)v.append(Bn(t,r,g,s,o,!0));if(d.length>0)v.append(Os(t,d,s,o));if(a==="world"){let f=Vs(t);if(f.childElementCount>0)v.append(f)}return v}function zs(t,n,a="stats"){let{state:s,template:o}=t.snapshot,i=o.coreTrackers,p=e("div","ls-stat-grid"),r=(d,g,v)=>{let M=ht(i,d);if(!M.enabled)return;if(n!=="drawer"&&!M.showCard)return;if(n==="widget"&&M.widgetTabId&&M.widgetTabId!==a)return;if(n==="inline"&&M.inlineTabId&&M.inlineTabId!==a)return;let f=e("div","ls-stat-cell");f.style.setProperty("--ls-bar-color",M.color||"var(--ls-primary)"),f.dataset.locked=String(Boolean(M.locked));let x=M.layoutSpan==="half"||M.layoutSpan==="full"?M.layoutSpan:g.length>48||/->|→|\n|;/.test(g)?"full":"half";f.dataset.span=x;let L=e("div","ls-row-between");L.append(e("strong","",`${M.icon||"\uD83D\uDCCA"} ${M.label}`),e("div","ls-row")),L.lastElementChild.append(ee("sliders",()=>Qt(t,d),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:`Full Edit "${M.label}" (Prompt, Style, Tab & Color)`}),ee("edit",()=>_t(t),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:`Edit ${M.label} value`}));let T=M.displayStyle??"auto",A=T!=="auto"||v||/->|→|\n|;/.test(g);f.append(L,A?Ze(g,T):e("p","",g)),p.append(f)};if(s.player.condition&&s.player.condition!=="Normal")r("player_condition",s.player.condition,!0);if(s.player.attire)r("player_attire",s.player.attire,!1);if(s.player.notableAction)r("player_action",s.player.notableAction,!1);if(n!=="drawer"&&s.scene.beatSummary)r("scene_summary",s.scene.beatSummary,!1);return p}function Vs(t){let{state:n,template:a}=t.snapshot,s=a.coreTrackers,o=e("div","ls-stack"),i=Object.values(n.quests);if(s?.trackQuests!==!1&&s?.showQuestsInWidget!==!1&&i.length>0){let p=e("div","ls-stat-cell");p.dataset.span="full",p.append(e("strong","",`\uD83C\uDFAF Quests & Objectives (${i.filter((r)=>r.status==="active").length})`));for(let r of i){let d=e("div","ls-stack");d.style.gap="3px",d.append(e("small","ls-kicker",`${r.title} (${r.status})`));for(let[g,v]of r.objectives.entries()){let M=e("label","ls-row"),f=e("input");f.type="checkbox",f.checked=v.completed,f.addEventListener("change",()=>{let x=r.objectives.map((T,A)=>A===g?{...T,completed:f.checked}:T),L=x.every((T)=>T.completed);t.request("state:mutate",{patch:{quests:[{id:r.id,title:r.title,status:L?"completed":"active",objectives:x}]}})}),M.append(f,e("small",v.completed?"ls-muted":"",v.text)),d.append(M)}p.append(d)}o.append(p)}if(s?.trackDispatches!==!1&&s?.showDispatchesInWidget!==!1&&n.dispatches.length>0){let p=e("div","ls-stat-cell");p.dataset.span="full",p.append(e("strong","",`\uD83D\uDCE1 Off-Screen Dispatches (${n.dispatches.length})`));for(let r of[...n.dispatches].reverse().slice(0,3)){let d=e("div","ls-bond-dir-box");d.append(e("strong","",`${r.title} · \uD83D\uDCCD ${r.locationName}`),e("small","ls-muted",r.summary)),p.append(d)}o.append(p)}return o}function js(t){let{theme:n}=t.snapshot.template;t.modals.open({title:"\uD83D\uDCD0 Widget & Pill Size Customizer (Any Extreme)",width:520},(a,s)=>{let o=n.widgetWidth??460,i=n.widgetHeight??540,p=n.pillWidth??420,r=n.pillHeight??92,d=e("div","ls-card");d.append(e("span","ls-kicker","1-Click Widget Size Presets"));let g=e("div","ls-row");for(let[S,y,u]of[["Micro (280×240)",280,240],["Compact (380×420)",380,420],["Standard (460×540)",460,540],["Wide (680×560)",680,560],["Theater (920×720)",920,720],["Extreme Max (1180×860)",1180,860]])g.append(N(S,()=>{o=y,i=u,x.value=String(o),T.value=String(i),t.widgetExpanded=!0,t.onResizeWidgetLive?.(o,i,!0)},"ls-btn-sm"));let v=e("div","ls-row");v.append(e("small","ls-muted","Widget Tabs:"));for(let[S,y]of[[!1,"\uD83C\uDFF7️ Icons + Labels"],[!0,"✨ Icons Only"]]){let u=N(y,()=>{t.request("state:mutate",{templatePatch:{theme:{...t.snapshot.template.theme,widgetTabsIconOnly:S}},reason:`Set widget tabs to ${S?"icons only":"icons + labels"}`})},"ls-btn-sm");if(Boolean(t.snapshot.template.theme.widgetTabsIconOnly)===S)u.setAttribute("aria-current","page");v.append(u)}d.append(g,v);let M=e("div","ls-grid"),f=e("label","ls-label","Expanded Width (240–1200 px)"),x=e("input","ls-input");x.type="number",x.min="240",x.max="1200",x.value=String(o),f.append(x);let L=e("label","ls-label","Expanded Height (180–900 px)"),T=e("input","ls-input");T.type="number",T.min="180",T.max="900",T.value=String(i),L.append(T);let A=e("label","ls-label","Collapsed Pill Width (220–960 px)"),w=e("input","ls-input");w.type="number",w.min="220",w.max="960",w.value=String(p),A.append(w);let h=e("label","ls-label","Collapsed Pill Height (56–220 px)"),C=e("input","ls-input");C.type="number",C.min="56",C.max="220",C.value=String(r),h.append(C),M.append(f,L,A,h);let P=N("\uD83D\uDCBE Apply & Save Dimensions",()=>{let S=Math.max(240,Math.min(1200,Number(x.value)||460)),y=Math.max(180,Math.min(900,Number(T.value)||540)),u=Math.max(220,Math.min(960,Number(w.value)||420)),l=Math.max(56,Math.min(220,Number(C.value)||92));if(t.request("state:mutate",{templatePatch:{theme:{...t.snapshot.template.theme,widgetWidth:S,widgetHeight:y,pillWidth:u,pillHeight:l}},reason:`Resized widget (${S}×${y})`}),t.widgetExpanded)t.onResizeWidgetLive?.(S,y,!1);else t.onResizeWidgetLive?.(u,l,!1);s()},"ls-btn-primary");a.append(d,M,P)})}function Dn(t,n){let{state:a,template:s,deltas:o}=t.snapshot,i=s.theme.showSceneChips,p=Re(a),r=e("div","ls-game-pill-main");if(i.location&&!n?.omitLocation)r.append(e("span","ls-chip ls-chip-accent",`\uD83D\uDCCD ${p.location}`));if(i.time)r.append(e("span","ls-chip",`\uD83D\uDD70️ ${p.time}`));if(i.date&&p.date)r.append(e("span","ls-chip",`\uD83D\uDCC5 ${p.date}`));if(i.weather&&p.weather&&p.weather!=="Clear")r.append(e("span","ls-chip",`\uD83C\uDF26️ ${p.weather}`));let d=Object.values(a.characters).filter((v)=>v.present);if(i.cast&&d.length>0){let v=e("div","ls-avatar-stack");v.title=`In Scene: ${d.map((M)=>M.name).join(", ")}`;for(let M of d.slice(0,4)){let f=e("span","ls-avatar-stack-item");if(M.portraitUrl){let x=e("img");x.src=M.portraitUrl,x.alt=M.name,f.append(x)}else f.textContent=M.name.slice(0,2).toUpperCase();v.append(f)}r.append(v)}let g=i.pinnedStats?s.stats.filter((v)=>v.enabled&&(v.pinnedToHeader||v.showIn?.pinnedHeader)):[];for(let v of g.slice(0,3)){let M=v.scope==="character",f=d[0]??Object.values(a.characters)[0],x=M?f?.meters[v.id]:a.stats[v.id];if(!x?.calibrated)continue;let L=x.value,T=M?f?o.characterDeltas[f.id]?.[v.id]??0:0:o.statDeltas[v.id]??0;if(typeof L==="number"&&v.kind!=="currency"){let A=e("div","ls-pill-gauge");A.style.setProperty("--ls-bar-color",v.color||"var(--ls-primary)");let w=e("div","ls-pill-gauge-top");w.append(e("span","",`${v.icon} ${M&&f?f.name.split(" ")[0]:v.label}`),e("span","",`${L}${T!==0?T>0?` +${T}`:` ${T}`:""}`));let h=e("div","ls-pill-gauge-track"),C=e("div","ls-bar-fill"),P=Math.max(1,v.max-v.min),S=Math.max(0,Math.min(100,Math.round((L-v.min)/P*100)));C.style.width=`${S}%`,h.append(C),A.append(w,h),r.append(A)}else r.append(e("span","ls-chip",`${v.icon} ${M&&f?`${f.name}: `:""}${String(L)}`))}return r}function bt(t,n,a,s,o,i){let{state:p,template:r}=t.snapshot,d=e("section","ls-hud");t.stampThemeOnElement(d);let g=async(S)=>{let y=()=>rt(t,o);if(typeof t.ctx.ui?.showContextMenu!=="function"){y();return}let{selectedKey:u}=await t.ctx.ui.showContextMenu({position:{x:S.clientX,y:S.clientY},items:[{key:"edit_scene",label:"Edit Scene Values (Location, Time, Date)"},{key:"pill_prompts",label:"Edit Scene Pill AI Prompts & Chips"},{key:"div1",label:"",type:"divider"},{key:"template",label:`Switch Template & Skin (${r.name})`},{key:"resize",label:"Resize Floating Widget"},{key:"studio",label:"Open Full Settings Studio"}]});if(u==="edit_scene")_t(t);else if(u==="pill_prompts")Ae(t);else if(u==="template")rt(t,o);else if(u==="resize")js(t);else if(u==="studio")o()},v=()=>{let S=e("div","ls-row"),y=ee("sync",()=>void t.request("track:manual"),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:t.busy?"Calibrating…":"Sync & calibrate current turn"});y.disabled=t.busy;let u=ee("stage",()=>t.toggleVnStage(),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:"Launch 2D Visual Novel Stage & Voices"}),l=ee("more",(I)=>void g(I),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:"Scene Pill Prompts, Template Switcher, Resize & Studio"}),m=ee("settings",()=>{console.log("[LumiStats FloatingHud] ⚙️ studio button clicked"),o()},{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:"Open Lumi Stats Studio"}),b=ee(n?"chevronDown":"chevronUp",a,{label:n?"Expand":"Pill",className:"ls-btn-sm ls-btn-primary",title:n?"Expand Floating HUD":"Collapse to Status Pill"});return S.append(y,u,l,m,b),S};if(n){let S=r.theme.pillStyle||"glass_capsule",y=r.theme.showSceneChips,u=Re(p),l=e("div","ls-hud-pill");l.dataset.pillSkin=S,l.addEventListener("click",(R)=>{if(R.target instanceof Element&&R.target.closest("button"))return;a()});let m=e("div","ls-row-between ls-pill-top-deck"),b=e("span","ls-hud-title-badge"),I=e("span","ls-pill-live-dot"),c=y.location?p.scene.location||p.title||"Lumi Stats":p.title||r.name||"Lumi Stats",k=S==="cyber_telemetry"?`${y.location?"LOC":"HUD"} // ${c.toUpperCase()}`:S==="ledger_strip"&&y.date?`${u.date} · ${c}`:c;b.append(I,e("span","",r.icon||"✨"),e("span","ls-pill-title-text",k));let _=v();_.classList.add("ls-pill-actions"),m.append(b,_),l.append(m);let B=!1;if(S!=="compact_badge"){if(p.initialized){let R=Dn(t,{omitLocation:!0});if(R.childElementCount>0)R.classList.add("ls-pill-bottom-deck"),l.append(R),B=!0}else if(t.chatId){let R=e("div","ls-row ls-pill-bottom-deck");R.append(N("Calibrate World Now",()=>void t.request("track:manual"),"ls-btn-sm ls-btn-primary"),N("Studio",o,"ls-btn-sm")),l.append(R),B=!0}}return l.dataset.emptyDeck=String(!B),d.append(l),d}let M=[...r.surfaces.widgetTabs].filter((S)=>S.enabled&&(S.kind!=="web"||r.surfaces.showRelationshipWeb!==!1)).sort((S,y)=>S.order-y.order),f=M.find((S)=>S.id===t.activeSurfaceTab)??M[0]??{id:"stats",label:"Stats",icon:"\uD83D\uDCCA",kind:"stats",enabled:!0,order:0},x=e("nav","ls-hud-header-bar"),L=e("div","ls-hud-top-row"),T=N(`${r.icon} ${p.scene.location||p.title||"Lumi Stats"}`,()=>Ae(t),"ls-btn-sm ls-btn-ghost ls-hud-title-badge","Click to customize Scene Pill prompt & visible chips");L.append(T,v());let A=Boolean(r.theme.widgetTabsIconOnly),w=e("div","ls-hud-tabs-scroll"),h=(S)=>/[^\w\s]/u.test(S.trim());for(let S of M){let y=S.kind==="cast"?` (${Object.keys(p.characters).length})`:S.kind==="map"?` (${Object.keys(p.places).length})`:"",u=`${S.label}${y}`,l=A&&h(S.icon),m=N(l?S.icon:`${S.icon} ${u}`,()=>{t.activeSurfaceTab=S.id,t.emitChange()},`ls-btn-sm${l?" ls-hud-tab-icon-only":""}`,u);if(S.id===f.id)m.setAttribute("aria-current","page");w.append(m)}x.append(L,w),d.append(x);let C=e("div","ls-hud-content");if(!p.initialized){let S=e("div","ls-card");if(S.append(e("strong","",t.chatId?"Ready to calibrate this story":"Open a chat to begin"),e("p","ls-muted","Send a message for automatic two-phase calibration, or click below to calibrate now:")),t.chatId)S.append(N("✨ Calibrate Stats Now",()=>void t.request("track:manual"),"ls-btn-primary"));return C.append(S),d.append(C),d}if(r.surfaces.customWidgetHtml){let S=e("div","ls-card");C.append(S),Be(S,De(r.surfaces.customWidgetHtml,p),t.ctx)}if(p.modifiers.length>0&&f.kind==="stats"){let S=e("div","ls-row");for(let y of p.modifiers){let u=e("span","ls-rpg-fx-pill",`${y.delta>=0?"▲":"▼"} ${y.label} (${y.delta>=0?`+${y.delta}`:y.delta}${y.remainingTurns?` · ${y.remainingTurns}t`:""})`);u.dataset.fxKind=y.delta>=0?"buff":"debuff",S.append(u)}C.append(S)}if(f.kind==="cast")C.append(nn(t,"widget",f.id,s));else if(f.kind==="web")C.append(Zt(t,s));else if(f.kind==="map")C.append(en(t));else{if(f.customHtml){let S=e("div","ls-card");C.append(S),Be(S,De(f.customHtml,p),t.ctx)}C.append(tn(t,"widget",f.id,i,!1))}d.append(C);let P=e("div","ls-hud-resize-grip","◢");return P.title="Drag to resize widget to any size",P.addEventListener("pointerdown",(S)=>{if(S.button!==0||!t.onResizeWidgetLive)return;S.preventDefault(),S.stopPropagation();let y=d.getBoundingClientRect(),u=y.width>0&&d.offsetWidth>0?y.width/d.offsetWidth:1,{clientX:l,clientY:m}=S,b=d.offsetWidth||(r.theme.widgetWidth??460),I=d.offsetHeight||(r.theme.widgetHeight??540),c=b,k=I;try{P.setPointerCapture(S.pointerId)}catch{}let _=(R)=>{let E=(R.clientX-l)/u,D=(R.clientY-m)/u;c=Math.max(240,Math.min(1200,Math.round(b+E))),k=Math.max(180,Math.min(900,Math.round(I+D))),t.onResizeWidgetLive?.(c,k,!1)},B=(R)=>{P.removeEventListener("pointermove",_),P.removeEventListener("pointerup",B),P.removeEventListener("pointercancel",B);try{P.releasePointerCapture(R.pointerId)}catch{}t.onResizeWidgetLive?.(c,k,!0)};P.addEventListener("pointermove",_),P.addEventListener("pointerup",B),P.addEventListener("pointercancel",B)}),d.append(P),d}var Hn="characters",an="",sn="";function Za(t){let n=(t.scene.timeLabel||ot(t.elapsedMinutes)||"").trim(),a=n.toLowerCase();if(/\b(?:dawn|sunrise|morning|breakfast)\b/.test(a))return"morning";if(/\b(?:noon|midday|afternoon|daytime|lunch)\b/.test(a))return"day";if(/\b(?:dusk|sunset|evening|twilight|dinner)\b/.test(a))return"evening";if(/\b(?:night|midnight|late\s*night|moon)\b/.test(a))return"night";let s=n.match(/(\d{1,2})\s*:\s*(\d{2})\s*(am|pm)?/i);if(s){let p=Number(s[1]),r=s[3]?.toLowerCase();if(r==="pm"&&p<12)p+=12;if(r==="am"&&p===12)p=0;if(p>=5&&p<11)return"morning";if(p>=11&&p<17)return"day";if(p>=17&&p<20)return"evening";return"night"}let o=(Math.max(0,Math.round(t.elapsedMinutes))+480)%1440,i=Math.floor(o/60);if(i>=5&&i<11)return"morning";if(i>=11&&i<17)return"day";if(i>=17&&i<20)return"evening";return"night"}function Xa(t,n){if(!t)return{url:"",matchedLabel:"No Location"};let a=t.backdropVariants??[],s=a.find((d)=>d.pinned&&d.url);if(s)return{url:s.url,matchedLabel:`\uD83D\uDCCC ${s.customTag||s.timeSlot}`};let o=[n.scene.weather,n.scene.timeLabel,n.scene.dateLabel,t.atmosphere].filter(Boolean).join(" ").toLowerCase();for(let d of a)if(d.timeSlot==="custom"&&d.customTag&&d.url){let g=d.customTag.toLowerCase().split(/[,/|\s]+/).filter((v)=>v.length>=2);if(g.length>0&&g.every((v)=>o.includes(v)))return{url:d.url,matchedLabel:`\uD83C\uDFF7️ ${d.customTag}`}}let i=Za(n),p=a.find((d)=>d.timeSlot===i&&d.url);if(p)return{url:p.url,matchedLabel:`\uD83D\uDD70️ ${i}`};let r=a.find((d)=>d.timeSlot==="default"&&d.url);if(r)return{url:r.url,matchedLabel:"Default"};return{url:t.backdropUrl||"",matchedLabel:t.backdropUrl?"Default":"Atmospheric Stage"}}function Fn(t,n){let a=t.trim().toLowerCase(),s=n.trim().toLowerCase();if(!a||!s)return 0;if(s.includes(a))return 2;let o=a.split(/[^a-z0-9]+/).filter((p)=>p.length>=3);if(!o.length)return 0;let i=o.filter((p)=>s.includes(p)).length;return i>0?i/o.length:0}function Ya(t,n=""){let a=t.spriteVariants??[],s=a.find((f)=>f.pinned&&f.url);if(s)return{url:s.url,matchedLabel:`\uD83D\uDCCC ${s.label}`};let o=he(t,"demeanor"),i=he(t,"attire_layers")||t.attire||"",p=String(t.meters.acted?.value??""),d=[he(t,"immediate_goal"),p,n].filter(Boolean).join(" "),g,v=0;for(let f of a){if(!f.url)continue;let x=0,L=0;if(f.clothesTag.trim()){L++;let T=Fn(f.clothesTag,`${i} ${n}`);if(T>0)x+=3.5*T;else x-=1}if(f.emotionTag.trim()){L++;let T=Fn(f.emotionTag,`${o} ${n}`);if(T>0)x+=2.5*T}if(f.poseTag.trim()){L++;let T=Fn(f.poseTag,d);if(T>0)x+=2*T}if(L===0)x=0.1;if(x>v)v=x,g=f}if(g)return{url:g.url,matchedLabel:g.label};let M=(o||"neutral").toLowerCase();if(t.expressionAssets[M]?.url)return{url:t.expressionAssets[M].url,matchedLabel:M};return{url:t.portraitUrl||"",matchedLabel:t.portraitUrl?"Base Sprite":""}}function Qa(t,n){let{state:a}=t.snapshot,s=e("div","ls-stack"),o=n??(()=>t.emitChange()),i=e("div","ls-subnav-pills"),p=Object.values(a.characters),r=Object.values(a.places);for(let[S,y]of[["characters",`\uD83C\uDFAD Character Sprites: Emotion, Clothes & Poses (${p.length})`],["locations",`\uD83C\uDFDE️ Discovered Locations: Time-of-Day & Weather Backdrops (${r.length})`]]){let u=N(y,()=>{Hn=S,o()},"ls-btn-sm");if(Hn===S)u.setAttribute("aria-current","page");i.append(u)}if(s.append(i),Hn==="characters"){let S=(an?a.characters[an]:void 0)??p[0],y=e("div","ls-row-between"),u=e("div","ls-row");for(let V of p){let G=(V.spriteVariants?.length??0)+(V.portraitUrl?1:0),q=N(`${V.present?"\uD83D\uDFE2":"⚪"} ${V.name} (${G})`,()=>{an=V.id,o()},"ls-btn-sm");if(V.id===S?.id)q.setAttribute("aria-current","page");u.append(q)}if(y.append(u,N("+ Add Character",()=>{t.modals.open({title:"➕ Add Character",width:420},(V,G)=>{let q=e("label","ls-label","Character Name"),X=e("input","ls-input");q.append(X);let te=N("➕ Create Character",()=>{let ae=X.value.trim();if(!ae)return;let Y=re(ae,"npc");an=Y,t.request("state:mutate",{patch:{characters:[{id:Y,name:ae,present:!0}]},reason:`Added character "${ae}"`}),G()},"ls-btn-primary");V.append(q,te)})},"ls-btn-sm ls-btn-primary")),s.append(y),!S){let V=e("div","ls-card");return V.append(e("strong","","No characters in Cast yet"),e("p","ls-muted",'Click "+ Add Character" above or sync a chat turn to start uploading character sprites.')),s.append(V),s}let l=e("section","ls-card"),m=he(S,"demeanor"),b=he(S,"attire_layers")||S.attire;l.append(e("span","ls-kicker",`Upload New Sprite Rule for ${S.name}`),e("h3","",`\uD83D\uDDBC️ Add Sprite by Emotion, Clothes & Pose — ${S.name}`),e("p","ls-muted",'Fill in any combination of Emotion, Clothes/Outfit, and Pose/Action below (leave any box blank if it applies to all), then click "\uD83D\uDDBC️ Upload & Save Sprite". The VN Stage automatically switches to the matching sprite as the story changes!'));let I=e("div","ls-grid"),c=e("label","ls-label","\uD83C\uDFAD Emotion / Mood Tag (Text Box)"),k=e("input","ls-input");k.placeholder="e.g. neutral, happy, flustered, angry, brusque, shy…",k.value=m||"",c.append(k);let _=e("div","ls-row");for(let V of["neutral","happy","flustered","angry","sad","surprised","shy"])_.append(N(V,()=>{k.value=V},"ls-btn-sm ls-quick-pill"));c.append(_);let B=e("label","ls-label","\uD83D\uDC57 Clothes / Outfit Tag (Text Box)"),R=e("input","ls-input");if(R.placeholder="e.g. saree, bath towel, office wear, nightgown, casual…",R.value="",B.append(R),b)B.append(N(`✨ Use Current Outfit ("${b.slice(0,28)}")`,()=>{R.value=b},"ls-btn-sm ls-quick-pill"));let E=e("label","ls-label","\uD83E\uDDCD Pose / Action Tag (Text Box)"),D=e("input","ls-input");D.placeholder="e.g. standing, mopping, crossed arms, holding phone, leaning…",D.value="",E.append(D);let H=e("div","ls-row");for(let V of["standing","crossed arms","leaning in","looking away","sitting"])H.append(N(V,()=>{D.value=V},"ls-btn-sm ls-quick-pill"));E.append(H),I.append(c,B,E),l.append(I);let F=e("div","ls-row-between");F.append(e("small","ls-muted",`Current Live State — Demeanor: "${m||"neutral"}" · Outfit: "${b||"default"}"`),e("div","ls-row")),F.lastElementChild.append(N("\uD83D\uDDBC️ Upload Default / Base Sprite",()=>{t.pickAndUploadImage(S.id,"portrait")},"ls-btn-sm"),N("\uD83D\uDDBC️ Upload & Save Sprite Variant",()=>{t.uploadStageVariantAsset({targetId:S.id,kind:"sprite_variant",emotionTag:k.value.trim(),clothesTag:R.value.trim(),poseTag:D.value.trim()})},"ls-btn-primary")),l.append(F),s.append(l);let j=e("section","ls-card"),O=S.spriteVariants??[],W=Ya(S),K=e("div","ls-row-between");K.append(e("h3","",`\uD83D\uDDC2️ Saved Sprites for ${S.name} (${O.length+(S.portraitUrl?1:0)})`),W.url?e("span","ls-chip ls-chip-accent",`✓ Active on Stage: ${W.matchedLabel}`):e("span","ls-chip","No sprite uploaded yet")),j.append(K);let z=e("div","ls-asset-gallery");if(S.portraitUrl){let V=e("div","ls-asset-card"),G=e("div","ls-asset-thumb"),q=e("img");q.src=S.portraitUrl,q.alt=`${S.name} Base Sprite`,G.append(q);let X=e("div","ls-stack");X.style.gap="6px",X.append(e("strong","","⭐ Base / Fallback Sprite"),e("small","ls-muted","Used whenever no specific Emotion / Clothes / Pose variant matches."),N("\uD83D\uDD04 Replace Base Sprite",()=>t.pickAndUploadImage(S.id,"portrait"),"ls-btn-sm")),V.append(G,X),z.append(V)}if(O.forEach((V,G)=>{let q=e("div","ls-asset-card");if(V.pinned)q.style.borderColor="var(--ls-primary)";let X=e("div","ls-asset-thumb"),te=e("img");te.src=V.url,te.alt=V.label,X.append(te);let ae=e("div","ls-stack");ae.style.gap="5px";let Y=e("input","ls-input");Y.style.minHeight="28px",Y.placeholder="Emotion tag (e.g. flustered)…",Y.value=V.emotionTag;let Q=e("input","ls-input");Q.style.minHeight="28px",Q.placeholder="Clothes tag (e.g. saree, towel)…",Q.value=V.clothesTag;let le=e("input","ls-input");le.style.minHeight="28px",le.placeholder="Pose tag (e.g. mopping)…",le.value=V.poseTag;let ge=e("div","ls-row");ge.append(N("\uD83D\uDCBE Save Tags",()=>{let Se=structuredClone(a.characters),ie=Se[S.id]?.spriteVariants;if(ie&&ie[G])ie[G].emotionTag=Y.value.trim(),ie[G].clothesTag=Q.value.trim(),ie[G].poseTag=le.value.trim(),ie[G].label=[ie[G].emotionTag,ie[G].clothesTag,ie[G].poseTag].filter(Boolean).join(" · ")||"Default",t.request("state:mutate",{stateOverride:{characters:Se},reason:`Updated sprite tags for ${S.name}`}),t.notify(`Saved tags for ${S.name}'s sprite.`)},"ls-btn-sm ls-btn-primary"),N(V.pinned?"\uD83D\uDCCC Pinned":"\uD83D\uDCCD Pin",()=>{let Se=structuredClone(a.characters),ie=Se[S.id]?.spriteVariants??[],vt=!V.pinned;ie.forEach((Je,ln)=>{Je.pinned=ln===G?vt:!1}),t.request("state:mutate",{stateOverride:{characters:Se},reason:`${vt?"Pinned":"Unpinned"} sprite for ${S.name}`})},`ls-btn-sm ${V.pinned?"ls-btn-primary":""}`),N("\uD83D\uDDD1️",()=>{let Se=structuredClone(a.characters);if(Se[S.id]?.spriteVariants)Se[S.id].spriteVariants=Se[S.id].spriteVariants.filter((ie)=>ie.id!==V.id),t.request("state:mutate",{stateOverride:{characters:Se},reason:`Removed sprite variant from ${S.name}`})},"ls-btn-sm ls-btn-icon ls-btn-danger","Delete sprite variant")),ae.append(e("strong","",V.label||"Sprite Variant"),Y,Q,le,ge),q.append(X,ae),z.append(q)}),z.childElementCount===0)j.append(e("p","ls-muted",`No sprites uploaded for ${S.name} yet. Use the form above to upload sprites for different emotions, outfits, and poses.`));else j.append(z);return s.append(j),s}let d=(sn?a.places[sn]:void 0)??(a.currentPlaceId?a.places[a.currentPlaceId]:void 0)??r[0],g=e("div","ls-row-between"),v=e("div","ls-row");for(let S of r){let y=(S.backdropVariants?.length??0)||(S.backdropUrl?1:0),u=N(`${S.icon||"\uD83D\uDCCD"} ${S.name}${S.id===a.currentPlaceId?" (Here)":""} (${y})`,()=>{sn=S.id,o()},"ls-btn-sm");if(S.id===d?.id)u.setAttribute("aria-current","page");v.append(u)}if(g.append(v,N("+ Add Location",()=>{t.modals.open({title:"➕ Add Location to Atlas",width:440},(S,y)=>{let u=e("label","ls-label","Location Name"),l=e("input","ls-input");u.append(l);let m=e("label","ls-label","Description"),b=e("input","ls-input");m.append(b);let I=N("➕ Create Location",()=>{let c=l.value.trim();if(!c)return;let k=re(c,"place");sn=k,t.request("state:mutate",{patch:{places:[{id:k,name:c,icon:"\uD83C\uDFDB️",description:b.value.trim()||"Location"}]},reason:`Added location "${c}"`}),y()},"ls-btn-primary");S.append(u,m,I)})},"ls-btn-sm ls-btn-primary")),s.append(g),!d){let S=e("div","ls-card");return S.append(e("strong","","No locations discovered yet"),e("p","ls-muted",'Click "+ Add Location" above or sync a chat turn to start uploading backdrops.')),s.append(S),s}let M=Za(a),f=Xa(d,a),x=e("section","ls-card"),L=e("div","ls-row-between");L.append(e("h3","",`${d.icon||"\uD83D\uDCCD"} ${d.name} — Time-of-Day & Weather Backdrops`),e("span","ls-chip ls-chip-accent",`\uD83D\uDD70️ Current Story Time: ${a.scene.timeLabel||ot(a.elapsedMinutes)} (${M.toUpperCase()})`)),x.append(L,e("p","ls-muted",'Upload backdrops for Morning, Day, Evening, Night, or a custom weather/scene state (e.g. "rainy", "steamy", "lights off"). The VN Stage automatically transitions to the matching backdrop as time passes!'));let T=e("div","ls-grid"),A=[{slot:"default",icon:"\uD83C\uDFDE️",label:"Default (Any Time)",sub:"Fallback when no specific time slot is set"},{slot:"morning",icon:"\uD83C\uDF05",label:"Morning / Dawn",sub:"05:00 AM – 10:59 AM"},{slot:"day",icon:"☀️",label:"Day / Afternoon",sub:"11:00 AM – 04:59 PM"},{slot:"evening",icon:"\uD83C\uDF07",label:"Evening / Sunset",sub:"05:00 PM – 07:59 PM"},{slot:"night",icon:"\uD83C\uDF19",label:"Night / Late Night",sub:"08:00 PM – 04:59 AM"}];for(let S of A){let y=(d.backdropVariants??[]).find((c)=>c.timeSlot===S.slot),u=S.slot==="default"?d.backdropUrl:void 0,l=y?.url||u||"",m=e("div","ls-asset-card");if(M===S.slot||y?.pinned)m.style.borderColor="var(--ls-primary)";if(l){let c=e("div","ls-asset-thumb"),k=e("img");k.src=l,k.alt=`${d.name} ${S.label}`,c.append(k),m.append(c)}let b=e("div","ls-stack");b.style.gap="4px",b.append(e("strong","",`${S.icon} ${S.label}`),e("small","ls-muted",S.sub));let I=e("div","ls-row");if(I.append(N(l?"\uD83D\uDD04 Replace Image":"\uD83D\uDDBC️ Upload Image",()=>{t.uploadStageVariantAsset({targetId:d.id,kind:"backdrop_variant",timeSlot:S.slot})},`ls-btn-sm ${l?"":"ls-btn-primary"}`)),y)I.append(N(y.pinned?"\uD83D\uDCCC Pinned":"\uD83D\uDCCD Pin",()=>{let c=structuredClone(a.places),k=c[d.id]?.backdropVariants??[],_=!y.pinned;k.forEach((B)=>{B.pinned=B.id===y.id?_:!1}),t.request("state:mutate",{stateOverride:{places:c},reason:`${_?"Pinned":"Unpinned"} ${S.label} backdrop for ${d.name}`})},`ls-btn-sm ${y.pinned?"ls-btn-primary":""}`),N("\uD83D\uDDD1️",()=>{let c=structuredClone(a.places),k=c[d.id];if(k?.backdropVariants){if(k.backdropVariants=k.backdropVariants.filter((_)=>_.id!==y.id),S.slot==="default")k.backdropUrl=void 0;t.request("state:mutate",{stateOverride:{places:c},reason:`Removed ${S.label} backdrop from ${d.name}`})}},"ls-btn-sm ls-btn-icon ls-btn-danger"));b.append(I),m.append(b),T.append(m)}x.append(T);let w=e("div","ls-stat-cell");w.append(e("strong","","\uD83C\uDFF7️ Add Custom Time / Weather / State Backdrop Variant"));let h=e("div","ls-row"),C=e("input","ls-input");C.style.flex="1",C.placeholder="Enter custom condition tag (e.g. rainy, steamy, lights off, crowded)…",h.append(C,N("\uD83D\uDDBC️ Upload & Save Custom Variant",()=>{let S=C.value.trim();if(!S){t.notify('Enter a custom tag (e.g. "rainy" or "steamy") before uploading.',!0);return}t.uploadStageVariantAsset({targetId:d.id,kind:"backdrop_variant",timeSlot:"custom",customTag:S})},"ls-btn-primary")),w.append(h);let P=(d.backdropVariants??[]).filter((S)=>S.timeSlot==="custom");if(P.length>0){let S=e("div","ls-asset-gallery");S.style.marginTop="8px";for(let y of P){let u=e("div","ls-asset-card"),l=e("div","ls-asset-thumb"),m=e("img");m.src=y.url,m.alt=y.customTag,l.append(m);let b=e("div","ls-row-between");b.append(e("strong","",`\uD83C\uDFF7️ ${y.customTag}`),e("div","ls-row")),b.lastElementChild.append(N(y.pinned?"\uD83D\uDCCC Pinned":"\uD83D\uDCCD Pin",()=>{let I=structuredClone(a.places),c=I[d.id]?.backdropVariants??[],k=!y.pinned;c.forEach((_)=>{_.pinned=_.id===y.id?k:!1}),t.request("state:mutate",{stateOverride:{places:I},reason:`Pinned "${y.customTag}" backdrop for ${d.name}`})},`ls-btn-sm ${y.pinned?"ls-btn-primary":""}`),N("\uD83D\uDDD1️",()=>{let I=structuredClone(a.places),c=I[d.id];if(c?.backdropVariants)c.backdropVariants=c.backdropVariants.filter((k)=>k.id!==y.id),t.request("state:mutate",{stateOverride:{places:I},reason:`Removed "${y.customTag}" backdrop`})},"ls-btn-sm ls-btn-icon ls-btn-danger")),u.append(l,b),S.append(u)}w.append(S)}if(x.append(w),f.url)x.append(e("small","ls-muted",`✓ Currently active backdrop for ${d.name}: ${f.matchedLabel}`));return s.append(x),s}function Ye(t,n){let a=structuredClone(t.snapshot.template),s=[...a.surfaces.dossierTabs].sort((o,i)=>o.order-i.order);t.modals.open({title:n?`✏️ Edit Character Dossier Field: ${n.label}`:"➕ Create Character Dossier Field",width:580},(o,i,p,r)=>{let d=e("div","ls-grid"),g=e("label","ls-label","Field Icon"),v=e("input","ls-input");v.value=n?.icon??"✨",g.append(v);let M=e("label","ls-label","Field Label"),f=e("input","ls-input");f.placeholder="e.g. Immediate Goal, Inner Monologue, Secret Agenda…",f.value=n?.label??"",M.append(f),d.append(g,M),o.append(d);let x=n?.tabId??(s[0]?.id||"overview"),L=n?.displayStyle??"card",T=e("div","ls-grid"),A=e("div","ls-label","\uD83E\uDEAA Target Dossier Tab"),w=e("div");A.append(w);let h=e("div","ls-label","\uD83C\uDFA8 Visual Display Style"),C=e("div");h.append(C),T.append(A,h),o.append(T),J(t,r,w,{value:x,ariaLabel:"Target Dossier Tab",options:s.map((O)=>({value:O.id,label:`${O.icon} ${O.label}`})),onChange:(O)=>{x=O}}),J(t,r,C,{value:L,ariaLabel:"Visual Display Style",options:[{value:"card",label:'\uD83D\uDDC2️ Info Card (supports structured "->" chains)'},{value:"quote",label:"\uD83D\uDCAD Quote / Inner Monologue Box"},{value:"pills",label:"\uD83C\uDFF7️ Tag / Item Pills (comma-separated)"},{value:"badge",label:"\uD83E\uDEAA Portrait Header Badge"}],onChange:(O)=>{L=O}});let P=n?.layoutSpan??"auto",S=n?.color||"var(--lumiverse-primary)",y=n?.enabled??!0,u=n?.showInHudCast??!1,l=n?.showInInlineCast??!1,m=n?.locked??!1,b=e("div","ls-label","Card Grid Width"),I=e("div");b.append(I),o.append(b),J(t,r,I,{value:P,ariaLabel:"Card Grid Width",options:[{value:"auto",label:"\uD83D\uDCD0 Auto"},{value:"full",label:"↔️ Full Width"},{value:"half",label:"▫ Compact Column"}],onChange:(O)=>{P=O}});let c=e("div","ls-label","Accent Color"),k=e("div","ls-row"),_=()=>{for(let O of[...k.querySelectorAll(".ls-color-swatch")])O.setAttribute("aria-pressed",String(O.dataset.colorVal===S))};for(let[O,W,K]of[["var(--lumiverse-primary)","Theme Primary","var(--lumiverse-primary, #38bdf8)"],["#38bdf8","Sky","#38bdf8"],["#f472b6","Rose","#f472b6"],["#f59e0b","Amber","#f59e0b"],["#10b981","Emerald","#10b981"],["#a78bfa","Violet","#a78bfa"]]){let z=N("",()=>{S=O,_()},"ls-color-swatch",W);z.dataset.colorVal=O,z.style.background=K,k.append(z)}_(),c.append(k),o.append(c);let B=e("div","ls-label"),R=e("div","ls-row-between"),E=e("textarea","ls-input");E.rows=3,E.placeholder="Tell the AI when and how to update this field for each character…",E.value=n?.instruction??"",R.append(e("span","","AI Extraction Prompt Instruction"),N("⛶ Full-Screen Editor",()=>{t.request("textEditor:open",{title:`Character Field Prompt: ${f.value||"Field"}`,value:E.value,placeholder:"Describe how the AI should update this character field…"}).then((O)=>{if(!O.cancelled&&typeof O.text==="string")E.value=O.text})},"ls-btn-sm")),B.append(R,E),o.append(B);let D=e("div","ls-grid");for(let[O,W,K]of[["Enabled",y,(z)=>{y=z}],["Show on HUD Cast Card",u,(z)=>{u=z}],["Show on Inline Cast Card",l,(z)=>{l=z}],["Lock Value",m,(z)=>{m=z}]]){let z=e("div");xe(t,r,z,{checked:W,label:O,onChange:K}),D.append(z)}o.append(D);let H=e("div","ls-row-between");H.style.marginTop="12px";let F=e("div","ls-row");if(n)F.append(N("Delete Field",()=>{t.request("state:mutate",{templatePatch:{dossierFields:a.dossierFields.filter((O)=>O.id!==n.id)},reason:`Deleted dossier field "${n.label}"`}),i()},"ls-btn-sm ls-btn-danger"));let j=N(n?"Save Field":"Add Field",()=>{let O=f.value.trim();if(!O)return;let W={id:n?.id??re(O,"field"),label:O,icon:v.value.trim()||"✨",placeholder:n?.placeholder||O,instruction:E.value.trim()||`Update ${O} when established in the scene.`,tabId:x,displayStyle:L,showInHudCast:u,showInInlineCast:l,color:S,layoutSpan:P,enabled:y,locked:m},K=a.dossierFields.findIndex((z)=>z.id===W.id);if(K>=0)a.dossierFields[K]=W;else a.dossierFields.push(W);t.request("state:mutate",{templatePatch:{dossierFields:a.dossierFields},reason:`Saved dossier field "${W.label}"`}),i()},"ls-btn-primary");H.append(F,j),o.append(H)})}function Ja(t,n){let{state:a}=t.snapshot,s=[...a.auditLog].filter((o)=>!n||o.actorId===n).reverse();t.modals.open({title:`\uD83D\uDCC8 Stat Calibration & Shift Audit Log (${s.length})`,width:640,maxHeight:740},(o,i)=>{if(!s.length){o.append(e("p","ls-muted","No stat calibrations or shifts recorded yet."));return}let p=e("div","ls-stack");for(let r of s){let d=e("div","ls-stat-cell"),g=e("div","ls-row-between"),v=e("div","ls-row"),M=r.actorId?a.characters[r.actorId]?.name:void 0;v.append(e("strong","",`${M?`${M} · `:""}${r.statLabel}`),e("span","ls-chip",r.op==="set"?"\uD83C\uDFAF Calibrated / Set":"Δ Shift"),e("span","ls-chip ls-chip-accent",`${String(r.before??"uncalibrated")} → ${String(r.after)}`));let f=e("div","ls-row");if(f.append(e("small","ls-muted",`Turn ${r.turn} · ${Fa(r.minute)}`)),r.before!==null)f.append(N(`↺ Revert to ${String(r.before)}`,()=>{if(r.actorId){let x=a.characters[r.actorId];if(x)t.request("state:mutate",{patch:{characters:[{id:x.id,name:x.name,meters:{[r.statId]:{op:"set",value:r.before,reason:"Reverted from audit log"}}}]},reason:`Reverted ${x.name} ${r.statLabel} to ${String(r.before)}`})}else t.request("state:mutate",{patch:{stats:{[r.statId]:{op:"set",value:r.before,reason:"Reverted from audit log"}}},reason:`Reverted ${r.statLabel} to ${String(r.before)}`});i()},"ls-btn-sm"));if(g.append(v,f),d.append(g),r.reason)d.append(e("small","ls-muted",`Evidence: ${r.reason}`));p.append(d)}o.append(p)})}function Xe(t,n){t.selectedActorId=n,t.modals.open({title:"\uD83E\uDEAA Character Dossier",width:880,maxHeight:820},(a,s,o,i)=>{let p=()=>{i.clear();let d=t.snapshot.state.characters[t.selectedActorId]??Object.values(t.snapshot.state.characters)[0];if(d)o.setTitle(`\uD83E\uDEAA ${d.name} — Character Dossier`);a.replaceChildren(On(t,i))};p();let r=t.subscribe(p);o.onDismiss(r)})}function On(t,n){let{state:a,template:s,deltas:o}=t.snapshot,i=e("div","ls-stack"),p=Object.values(a.characters).sort((u,l)=>Number(l.present)-Number(u.present)),r=(t.selectedActorId?a.characters[t.selectedActorId]:void 0)??p[0],d=e("div","ls-row-between"),g=e("div","ls-row");for(let u of p){let l=N(`${u.present?"\uD83D\uDFE2":"⚪"} ${u.name}`,()=>{t.selectedActorId=u.id,t.emitChange()},"ls-btn-sm");if(u.id===r?.id)l.setAttribute("aria-current","page");g.append(l)}let v=e("div","ls-row");if(r)v.append(N(t.dossierEditMode?"✓ Done Editing":"✏️ Edit Values",()=>{t.dossierEditMode=!t.dossierEditMode,t.emitChange()},`ls-btn-sm ${t.dossierEditMode?"ls-btn-primary":""}`),N(r.ttsVoice?.voiceId?`\uD83D\uDD0A Voice (${r.ttsVoice.voiceId})`:"\uD83D\uDD0A Voice",()=>Yt(t,r.id),"ls-btn-sm",`Assign TTS Voice for ${r.name}`),N("+ Stat",()=>Ce(t,"character"),"ls-btn-sm","Add a character stat or meter"),N("+ Field",()=>Ye(t),"ls-btn-sm","Add a custom field to character dossiers"),N("\uD83D\uDCC8 Audit Log",()=>Ja(t,r.id),"ls-btn-sm"));if(v.append(N("+ Add Character",()=>{t.modals.open({title:"➕ Add Character to Cast",width:460},(u,l)=>{let m=e("label","ls-label","Character Name"),b=e("input","ls-input");m.append(b);let I=e("label","ls-label","Role & Relationship to Player"),c=e("input","ls-input");c.placeholder="e.g. Loyal personal maid, Childhood rival…",I.append(c);let k=e("label","ls-label","Starting Attire"),_=e("input","ls-input");k.append(_);let B=N("➕ Create Character",()=>{let R=b.value.trim();if(!R)return;let E=re(R,"npc");t.selectedActorId=E,t.request("state:mutate",{patch:{characters:[{id:E,name:R,present:!0,roleSummary:c.value.trim()||"Character",attire:_.value.trim()}]},reason:`Added character "${R}"`}),l()},"ls-btn-primary");u.append(m,I,k,B)})},"ls-btn-sm ls-btn-primary")),d.append(g,v),i.append(d),!r){let u=e("div","ls-card");return u.append(e("strong","","No characters in cast yet"),e("p","ls-muted",'Characters are calibrated automatically on Turn 1, or click "+ Add Character" above.')),i.append(u),i}if(s.surfaces.customDossierHtml){let u=e("div","ls-card");i.append(u),Be(u,De(s.surfaces.customDossierHtml,a),t.ctx)}let M=he(r,"demeanor"),f=he(r,"role_summary"),x=(M||"neutral").toLowerCase(),L=r.expressionAssets[x]?.url??r.portraitUrl,T=Boolean(L||t.dossierEditMode),A=e("article","ls-dossier-shell");if(!T)A.dataset.noPortrait="true";let w=e("div","ls-row");w.append(N(r.present?"\uD83D\uDFE2 In Scene":"⚪ Away",()=>{t.request("state:mutate",{patch:{characters:[{id:r.id,name:r.name,present:!r.present,...!r.present&&a.scene.location?{location:a.scene.location}:{}}]},reason:`Marked ${r.name} as ${!r.present?"In Scene":"Away"}`})},`ls-btn-sm ls-presence-pill ${r.present?"ls-chip-accent":""}`,"Click to toggle In Scene / Away"));for(let u of s.dossierFields.filter((l)=>l.enabled&&l.displayStyle==="badge"&&l.id!=="role_summary")){let l=he(r,u.id);if(l)w.append(e("span","ls-chip",`${u.icon} ${l}`))}if(T){let u=e("aside","ls-dossier-rail"),l=e("div","ls-dossier-portrait");if(L){let b=e("img");b.src=L,b.alt=r.name,l.append(b)}else l.append(e("span","ls-dossier-initial",r.name[0]?.toUpperCase()??"?"));u.append(l);let m=e("div","ls-dossier-overlay");if(m.append(w,e("h2","",r.name)),Lt(s,"role_summary")&&f)m.append(e("div","ls-muted",f));if(t.dossierEditMode){let b=e("div","ls-row");b.append(N("\uD83D\uDDBC️ Portrait",()=>t.pickAndUploadImage(r.id,"portrait"),"ls-btn-sm ls-btn-primary"),N(`\uD83C\uDFAD Expression (${x})`,()=>t.pickAndUploadImage(r.id,"expression",x),"ls-btn-sm",`Upload expression sprite for "${x}" demeanor`),N(r.present?"Mark Off-Screen":"Mark Present",()=>{t.request("state:mutate",{patch:{characters:[{id:r.id,name:r.name,present:!r.present}]},reason:`Toggled presence for ${r.name}`})},"ls-btn-sm")),m.append(b)}u.append(m),A.append(u)}let h=e("div","ls-dossier-main");if(!T){let u=e("header","ls-dossier-compact-hero"),l=e("div","ls-row"),m=e("div","ls-dossier-monogram",r.name.slice(0,2).toUpperCase()),b=e("div");if(b.append(e("h2","",r.name)),Lt(s,"role_summary")&&f)b.append(e("div","ls-muted",f));l.append(m,b);let I=e("div","ls-row");I.append(w,N("\uD83D\uDDBC️ + Portrait",()=>t.pickAndUploadImage(r.id,"portrait"),"ls-btn-sm",`Upload portrait for ${r.name}`)),u.append(l,I),h.append(u)}let C=[...s.surfaces.dossierTabs].filter((u)=>u.enabled).sort((u,l)=>u.order-l.order),P=C.find((u)=>u.id===t.activeDossierTab)??C[0]??{id:"overview",label:"Overview",icon:"✨",kind:"overview",enabled:!0,order:0,showMeters:!0,showFields:!0,showSecrets:!1,showAudit:!1};if(C.length>1){let u=e("div","ls-subnav-pills");for(let l of C){let m=N(`${l.icon} ${l.label}`,()=>{t.activeDossierTab=l.id,t.emitChange()},"ls-btn-sm");if(l.id===P.id)m.setAttribute("aria-current","page");u.append(m)}h.append(u)}if(P.customHtml){let u=e("div","ls-card");h.append(u),Be(u,De(P.customHtml,a),t.ctx)}let S=new Set(C.map((u)=>u.id)),y=C[0]?.id??"overview";if(P.showFields){let u=s.dossierFields.filter((l)=>{if(!l.enabled||l.id==="role_summary"||l.displayStyle==="badge")return!1;return(l.tabId&&S.has(l.tabId)?l.tabId:y)===P.id});if(!t.dossierEditMode){for(let b of u.filter((I)=>I.displayStyle==="quote")){let I=he(r,b.id);if(!I)continue;let c=e("div","ls-thought-box ls-row-between");c.append(e("span","",`${b.icon} “${I}”`),N("✏️",()=>Ye(t,b),"ls-btn-sm ls-btn-icon",`Customize "${b.label}" field`)),h.append(c)}if(P.kind==="overview"&&s.coreTrackers?.trackNpcConditions!==!1&&r.conditions.length>0){let b=e("div","ls-row");for(let I of r.conditions){let c=e("span","ls-rpg-fx-pill",`⚡ ${I}`);c.dataset.fxKind="neutral",b.append(c)}h.append(b)}let l=u.filter((b)=>b.displayStyle!=="quote"),m=e("div","ls-grid");for(let b of l){let I=he(r,b.id);if(!I)continue;let c=e("div","ls-stat-cell"),k=e("div","ls-row-between");k.append(e("span","ls-kicker",`${b.icon} ${b.label}`),N("✏️",()=>Ye(t,b),"ls-btn-sm ls-btn-icon",`Customize "${b.label}" field`)),c.append(k,Ze(I,b.displayStyle==="pills"?"pill_list":"auto")),m.append(c)}if(m.childElementCount>0)h.append(m)}else{let l=e("div","ls-card"),m=e("div","ls-row-between");m.append(e("h3","",`✏️ Edit ${r.name}'s Dossier Fields`),N("↺ Restore Default Fields",()=>{t.request("state:mutate",{templatePatch:{dossierFields:St()},reason:"Restored default dossier fields"})},"ls-btn-sm")),l.append(m);let b=e("div","ls-grid"),I=new Map;for(let R of s.dossierFields.filter((E)=>E.enabled)){let E=e("div","ls-label"),D=e("div","ls-row-between");D.append(e("span","",`${R.icon} ${R.label}`),N("⚙️ Schema",()=>Ye(t,R),"ls-btn-sm",`Edit "${R.label}" schema or delete`));let H=R.displayStyle==="quote"?e("textarea","ls-input"):e("input","ls-input");if(H instanceof HTMLTextAreaElement)H.rows=2;H.value=he(r,R.id),H.placeholder=R.placeholder||R.label,E.append(D,H),b.append(E),I.set(R.id,H)}let c=e("label","ls-label","⚡ Active Conditions (comma-separated)"),k=e("input","ls-input");k.value=r.conditions.join(", "),k.placeholder="e.g. Flustered, Holding Tray, Guarded…",c.append(k);let _=e("label","ls-label","\uD83D\uDCDD Personal Character Notes"),B=e("textarea","ls-input");B.rows=2,B.value=r.notes||"",B.placeholder="Optional notes about this character…",_.append(B),l.append(b,c,_),l.append(N("\uD83D\uDCBE Save Character Details",()=>{let R={...r.fields};for(let[D,H]of I.entries())R[D]=H.value.trim();let E=k.value.split(",").map((D)=>D.trim()).filter(Boolean);t.request("state:mutate",{patch:{characters:[{id:r.id,name:r.name,roleSummary:R.role_summary??r.roleSummary,demeanor:R.demeanor??r.demeanor,attire:R.attire_layers??r.attire,immediateGoal:R.immediate_goal??r.immediateGoal,innerThought:R.inner_thought??r.innerThought,conditions:E,notes:B.value.trim(),fields:R}]},reason:`Updated dossier details for ${r.name}`})},"ls-btn-primary")),h.append(l)}}if(P.showMeters){let u=s.stats.filter((m)=>{if(!m.enabled||m.scope!=="character"||m.showIn?.dossier===!1)return!1;let b=m.dossierTabId||"bonds";return(S.has(b)?b:y)===P.id});if(u.length>0){let m=e("div","ls-stat-grid"),b=o.characterDeltas[r.id]??{},I=(c,k,_)=>{t.request("state:mutate",{patch:{characters:[{id:r.id,name:r.name,meters:{[c]:{op:"set",value:_,reason:"Manual Dossier adjustment"}}}]},reason:`Set ${r.name} ${k} to ${String(_)}`})};for(let c of u){let k=r.meters[c.id],_=Boolean(k?.calibrated),B=_&&k?k.value:c.defaultValue,R=Boolean(c.locked||k?.locked),E=b[c.id]??0,D=String(B??""),H=_&&typeof B==="string"&&(c.displayStyle==="feed_cards"||c.displayStyle==="step_chain"||c.displayStyle==="pill_list"||c.displayStyle==="quote_callout"||D.length>36||/->|→|\n|;/.test(D)),F=e("div","ls-stat-cell");if(F.style.setProperty("--ls-bar-color",c.color||"var(--ls-primary)"),F.dataset.locked=String(R),F.dataset.uncalibrated=String(!_),F.dataset.span=c.layoutSpan==="full"||c.layoutSpan!=="half"&&H?"full":"half",k?.lastReason)F.title=`Evidence: ${k.lastReason}`;let j=e("div","ls-row-between");j.append(e("strong","",`${c.icon} ${c.label}`));let O=e("div","ls-row");if(E!==0)O.append(e("span",`ls-delta ${E>0?"is-pos":"is-neg"}`,`${E>0?`+${E} ▲`:`${E} ▼`}`));let W=!_?"Uncalibrated":c.kind==="clock"||c.kind==="pips"?`${Number(B)||0}/${c.max}`:H?`${Et(D).length} entries`:D,K=e("strong","",W);if(O.append(K,N("✏️",()=>Ce(t,"character",c),"ls-btn-sm ls-btn-icon","Edit stat schema")),j.append(O),F.append(j),_&&typeof B==="number"){let z=je(c.anchors,B);if(z)F.append(e("small","ls-muted",z))}else if(!_)F.append(e("small","ls-muted",`Volatility: ${c.volatility} · Calibrates on sync`));if(k?.lastReason&&!H&&k.lastReason!==a.scene.beatSummary&&!/^(?:Scene progression|Manual Dossier adjustment|Manual UI adjustment)$/i.test(k.lastReason))F.append(e("small","ls-muted",`↳ ${k.lastReason}`));if(c.kind==="skill_tree")F.append(lt(c,B,R,(z,V)=>I(c.id,c.label,z)));else if(c.kind==="xp_level")F.append(ct(c,B));else if(c.kind==="attributes")F.append(dt(c,B,`${r.id}:${t.chatId}`));else if(c.kind==="inventory")F.append(pt(B));else if(c.kind==="status_fx")F.append(ut(B));else if(c.kind==="hearts")F.append(mt(c,Number(B)||0,_,R,(z)=>I(c.id,c.label,z)));else if(c.kind==="currency")F.append(ft(c,B,E));else if(_&&H)F.append(Ze(D,c.displayStyle??"auto"));else if(c.kind==="meter"||c.kind==="number"){let z=typeof B==="number"?B:0,V=Math.max(1,c.max-c.min),G=e("div","ls-bar-track"),q=e("div","ls-bar-fill");if(c.min<0&&c.max>0){G.dataset.bipolar="true";let X=(0-c.min)/V*100;if(z>=0)q.style.marginLeft=`${X.toFixed(1)}%`,q.style.width=`${Math.min(100-X,z/c.max*(100-X)).toFixed(1)}%`;else{let te=Math.abs(z)/Math.abs(c.min)*X;q.style.marginLeft=`${Math.max(0,X-te).toFixed(1)}%`,q.style.width=`${Math.min(X,te).toFixed(1)}%`,q.style.background="var(--ls-danger)"}}else{let X=_?Math.max(0,Math.min(100,Math.round((z-c.min)/V*100))):0;q.style.width=`${X}%`}if(G.append(q),F.append(G),t.dossierEditMode&&n&&t.ctx.components?.mountRangeSlider){let X=e("div");F.append(X);try{n.track(t.ctx.components.mountRangeSlider(X,{min:c.min,max:c.max,step:c.step||1,integer:!0,value:z,disabled:R,onDragValue:(te)=>{if(te!==null)K.textContent=String(te)},onCommit:(te)=>I(c.id,c.label,te)}))}catch{}}}else if(c.kind==="clock"){let z=Math.max(2,Math.min(16,c.max||6)),V=_?Math.max(0,Math.min(z,Math.round(Number(B)||0))):0,G=e("div","ls-clock-bar");G.style.gridTemplateColumns=`repeat(${z}, 1fr)`;for(let q=1;q<=z;q++){let X=e("span",`ls-clock-seg${q<=V?" is-filled":""}`);X.addEventListener("click",()=>I(c.id,c.label,q===V?q-1:q)),G.append(X)}F.append(G)}Ut(t.ctx,F,()=>[{key:"edit",label:`✏️ Edit "${c.label}" Schema & Style`},{key:"duplicate",label:`\uD83D\uDCCB Duplicate "${c.label}" to Another Scope / Tab…`},{key:"test",label:`\uD83E\uDDEA Test "${c.label}" in Sandbox`},{key:"audit",label:"\uD83D\uDCC8 View Shift History"}],(z)=>{if(z==="edit")Ce(t,"character",c);else if(z==="duplicate")Fe(t,c);else if(z==="test")Ge(t,c.id);else if(z==="audit")Ja(t,r.id)}),m.append(F)}h.append(m)}let l=s.stats.filter((m)=>m.enabled&&m.scope==="player"&&m.showIn?.dossier===!0&&m.dossierTabId===P.id&&P.id!=="bonds");if(l.length>0)h.append(Bn(t,l,"player",n,t.dossierEditMode,!1))}if(P.showNpcBonds||P.kind==="peer_bonds"){let u=e("div","ls-stack"),l=e("div","ls-row-between"),m=Object.values(r.peerBonds??{});if(l.append(e("h3","",`\uD83E\uDD1D ${r.name}'s Standing & Stats Toward Other NPCs (${m.length})`),N("+ Add NPC↔NPC Bond",()=>Ue(t,r),"ls-btn-sm ls-btn-primary")),u.append(l),!m.length)u.append(e("p","ls-muted",`No NPC-to-NPC relationships recorded for ${r.name} yet. They populate automatically when multiple NPCs interact, or click "+ Add NPC↔NPC Bond" above.`));else{let b=e("div","ls-stat-grid");for(let I of m){let c=e("div","ls-stat-cell"),k=e("div","ls-row-between");if(k.append(e("strong","",`→ \uD83D\uDC64 ${I.toName}`),e("div","ls-row")),k.lastElementChild.append(e("span","ls-chip ls-chip-accent",I.label),N("✏️",()=>Ue(t,r,I),"ls-btn-sm ls-btn-icon","Edit NPC bond"),N("\uD83D\uDDD1️",()=>{let _=structuredClone(r);delete _.peerBonds[I.toId],t.request("state:mutate",{stateOverride:{characters:{...a.characters,[r.id]:_}},reason:`Removed peer bond ${r.name} → ${I.toName}`})},"ls-btn-sm ls-btn-icon ls-btn-danger","Delete NPC bond")),c.append(k),I.attitude)c.append(e("div","ls-thought-box",`“${I.attitude}”`));for(let[_,B]of Object.entries(I.meters)){let R=_.charAt(0).toUpperCase()+_.slice(1),E=e("div","ls-row-between");E.append(e("small","ls-muted",R),e("strong","",`${B}/100`));let D=e("div","ls-bar-track"),H=e("div","ls-bar-fill");H.style.width=`${Math.max(0,Math.min(100,B))}%`,D.append(H),c.append(E,D)}b.append(c)}u.append(b)}h.append(u)}if(P.showSecrets){let u=e("div","ls-stack");if(u.append(e("h3","","\uD83D\uDD75️ Secrets, Clues & Notes")),!r.secrets.length)u.append(e("p","ls-muted","No secrets or discoveries recorded for this character yet."));else for(let l of r.secrets){let m=e("div","ls-stat-cell");m.append(e("strong","",`${l.stage==="confirmed"?"\uD83D\uDD13":"\uD83D\uDD0D"} ${l.title} (${l.stage})`),e("p","ls-muted",l.detail)),u.append(m)}h.append(u)}if(P.showAudit){let u=a.auditLog.filter((l)=>l.actorId===r.id&&typeof l.after==="number"&&(l.before!==null||l.numericDelta!==0)).slice(-8).reverse();if(u.length>0){let l=e("div","ls-stack");l.append(e("span","ls-kicker","\uD83D\uDCC8 Recent Meter Shifts"));let m=e("div","ls-row");for(let b of u){let I=b.numericDelta>0?`+${b.numericDelta}`:String(b.numericDelta),c=e("span",`ls-delta ${b.numericDelta>=0?"is-pos":"is-neg"}`,`${b.statLabel}: ${String(b.before??"—")} → ${String(b.after)}${b.numericDelta!==0?` (${I})`:""}`);if(b.reason&&b.reason!==a.scene.beatSummary)c.title=b.reason;m.append(c)}l.append(m),h.append(l)}}return A.append(h),i.append(A),i}function nn(t,n,a,s){let{state:o,template:i,deltas:p}=t.snapshot,r=e("div","ls-stack"),d=Object.values(o.characters);if(!d.length)return r.append(e("p","ls-muted","Characters appear here as the story introduces them.")),r;let g=n==="widget"?i.surfaces.widgetTabs:i.surfaces.inlineTabs,v=new Set(g.filter((u)=>u.enabled).map((u)=>u.id)),M=i.stats.filter((u)=>{if(!u.enabled||u.scope!=="character")return!1;if(n==="widget"&&u.showIn?.widget===!1)return!1;if(n==="inline"&&u.showIn?.inline===!1)return!1;let l=n==="widget"?u.widgetTabId||"cast":u.inlineTabId||"cast",m=n==="widget"?u.extraWidgetTabIds:u.extraInlineTabIds;return l===a||!v.has(l)||Boolean(m?.includes(a))}),f=i.dossierFields.filter((u)=>n==="widget"?u.enabled&&u.showInHudCast:u.enabled&&u.showInInlineCast),x=new Set(["skill_tree","xp_level","attributes","inventory","status_fx","hearts","currency"]),L=M.filter((u)=>!x.has(u.kind)&&!$t(u)&&u.kind!=="boolean"),T=M.filter((u)=>x.has(u.kind)||$t(u)||u.kind==="boolean"),A=d.filter((u)=>u.present),w=d.filter((u)=>!u.present),h=i.theme.castLayout??"roster",C=e("div","ls-row-between");C.append(e("span","ls-kicker",`\uD83D\uDFE2 In Scene: ${A.length} · ⚪ Away: ${w.length}`),N(h==="roster"?"\uD83D\uDDC2️ All Cards":"\uD83D\uDC65 Icons",()=>{let u=h==="roster"?"cards":"roster";t.request("state:mutate",{templatePatch:{theme:{...i.theme,castLayout:u}},reason:`Switched cast display to ${u}`})},"ls-btn-sm","Toggle between compact character icons and expanded stacked cards")),r.append(C);let P=(u)=>{let l=e("div","ls-card"),m=e("div","ls-row-between"),b=e("div","ls-row"),I=e("div","ls-cast-avatar");if(u.portraitUrl){let E=e("img");E.src=u.portraitUrl,E.alt=u.name,I.append(E)}else I.textContent=u.name.slice(0,2).toUpperCase();let c=e("div");c.append(e("strong","",`${u.present?"\uD83D\uDFE2":"⚪"} ${u.name}`));let k=he(u,"role_summary");if(k){let E=e("div","ls-muted",k);E.style.fontSize="11px",c.append(E)}b.append(I,c);let _=e("div","ls-row"),B=f.find((E)=>E.id==="demeanor"),R=B?he(u,"demeanor"):"";if(R)_.append(e("span","ls-chip",`${B.icon} ${R}`));if(_.append(N(u.present?"\uD83D\uDFE2 In Scene":"⚪ Away",()=>{t.request("state:mutate",{patch:{characters:[{id:u.id,name:u.name,present:!u.present,...!u.present&&o.scene.location?{location:o.scene.location}:{}}]},reason:`Marked ${u.name} as ${!u.present?"In Scene":"Away"}`})},`ls-btn-sm ls-presence-pill ${u.present?"ls-chip-accent":""}`,`Toggle whether ${u.name} is In Scene or Away`),ee("volume",()=>Yt(t,u.id),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:`Assign TTS voice for ${u.name}`}),N("Dossier",()=>s(u.id),"ls-btn-sm ls-btn-primary")),m.append(b,_),l.append(m),i.coreTrackers?.trackNpcConditions!==!1&&u.conditions.length>0){let E=e("div","ls-row");for(let D of u.conditions.slice(0,4)){let H=e("span","ls-rpg-fx-pill",`⚡ ${D}`);H.dataset.fxKind="neutral",E.append(H)}l.append(E)}for(let E of f.filter((D)=>D.id!=="demeanor"&&D.id!=="role_summary")){let D=he(u,E.id);if(!D)continue;if(E.displayStyle==="quote")l.append(e("div","ls-thought-box",`${E.icon} “${D}”`));else l.append(e("small","ls-muted",`${E.icon} ${D}`))}if(L.length>0){let E=e("div","ls-cast-mini-grid");for(let D of L){let H=u.meters[D.id],F=p.characterDeltas[u.id]?.[D.id]??0,j=H?.calibrated&&typeof H.value==="number"?H.value:0,O=Math.max(1,D.max-D.min),W=H?.calibrated?Math.max(0,Math.min(100,Math.round((j-D.min)/O*100))):0,K=H?.calibrated&&typeof H.value==="number"?je(D.anchors,H.value):"",z=e("div","ls-cast-mini-meter");if(z.style.setProperty("--ls-bar-color",D.color||"var(--ls-primary)"),K)z.title=`${D.label}: ${j} (${K})`;let V=e("div","ls-row-between");V.append(e("small","ls-muted",`${D.icon} ${D.label}`));let G=e("div","ls-row");if(F!==0)G.append(e("span",`ls-delta ${F>0?"is-pos":"is-neg"}`,F>0?`+${F}`:String(F)));G.append(e("strong","",H?.calibrated?String(H.value):"—")),V.append(G);let q=e("div","ls-bar-track"),X=e("div","ls-bar-fill");X.style.width=`${W}%`,q.append(X),z.append(V,q),E.append(z)}l.append(E)}for(let E of T){let D=u.meters[E.id],H=Boolean(D?.calibrated),F=H?D.value:E.defaultValue,j=String(F??"").trim(),O=e("div","ls-stat-cell");if(O.style.setProperty("--ls-bar-color",E.color||"var(--ls-primary)"),O.dataset.uncalibrated=String(!H),O.append(e("small","ls-kicker",`${E.icon} ${E.label}`)),!H&&!x.has(E.kind)){O.append(e("small","ls-muted","Uncalibrated")),l.append(O);continue}if(H&&(!j||j==="None")&&!x.has(E.kind)){O.append(e("small","ls-muted","None")),l.append(O);continue}if(E.kind==="skill_tree")O.append(lt(E,F,Boolean(E.locked||D?.locked),(W,K)=>{t.request("state:mutate",{patch:{characters:[{id:u.id,name:u.name,meters:{[E.id]:{op:"set",value:W,reason:K}}}]},reason:K})}));else if(E.kind==="xp_level")O.append(ct(E,F));else if(E.kind==="attributes")O.append(dt(E,F,`${u.id}:${t.chatId}`));else if(E.kind==="inventory")O.append(pt(F));else if(E.kind==="status_fx")O.append(ut(F));else if(E.kind==="hearts")O.append(mt(E,Number(F)||0,Boolean(D?.calibrated),Boolean(E.locked||D?.locked)));else if(E.kind==="currency")O.append(ft(E,F,p.characterDeltas[u.id]?.[E.id]??0));else O.append(Ze(j,E.displayStyle??"auto"));l.append(O)}return l};if(h==="cards"){for(let u of[...A,...w])r.append(P(u));return r}t.openedCastTabs=t.openedCastTabs.filter((u)=>Boolean(o.characters[u]));let S=t.activeCastTabActorId&&o.characters[t.activeCastTabActorId]?o.characters[t.activeCastTabActorId]:void 0;if(t.openedCastTabs.length>0||S){let u=e("div","ls-cast-tabs-bar"),l=N("← Cast",()=>{t.activeCastTabActorId="",t.emitChange()},"ls-btn-sm","Return to Cast Icons");if(!S)l.setAttribute("aria-current","page");u.append(l);for(let m of t.openedCastTabs){let b=o.characters[m];if(!b)continue;let I=S?.id===b.id,c=e("div","ls-cast-tab-group"),k=N(`${b.present?"\uD83D\uDFE2":"⚪"} ${b.name}`,()=>{t.activeCastTabActorId=b.id,t.selectedActorId=b.id,t.emitChange()},"ls-btn-sm ls-cast-tab-btn",`Inspect ${b.name}`);if(I)k.setAttribute("aria-current","page");let _=N("×",()=>{if(t.openedCastTabs=t.openedCastTabs.filter((B)=>B!==b.id),t.activeCastTabActorId===b.id)t.activeCastTabActorId=t.openedCastTabs.at(-1)??"";t.emitChange()},"ls-btn-sm ls-cast-tab-close",`Close ${b.name} tab`);c.append(k,_),u.append(c)}if(S)return r.replaceChildren(C,u,P(S)),r;r.append(u)}let y=(u,l)=>{if(!l.length)return;let m=e("div","ls-roster-group");m.append(e("small","ls-muted",`${u} (${l.length})`));let b=e("div","ls-roster-grid");for(let I of l){let c=he(I,"demeanor"),k=he(I,"role_summary"),_=e("button","ls-roster-icon-btn");_.type="button",_.title=`${I.name}${k?` — ${k}`:""}${c?` (${c})`:""}`;let B=e("div","ls-roster-avatar");if(I.portraitUrl){let H=e("img");H.src=I.portraitUrl,H.alt=I.name,B.append(H)}else B.append(document.createTextNode(I.name.slice(0,2).toUpperCase()));B.append(e("span",`ls-roster-dot ${I.present?"is-present":"is-away"}`));let R=e("span","ls-roster-name",I.name),E=c||k||"",D=E?e("span","ls-roster-role",E):null;_.append(B,R,...D?[D]:[]),_.addEventListener("click",(H)=>{if(H.stopPropagation(),!t.openedCastTabs.includes(I.id))t.openedCastTabs=[...t.openedCastTabs,I.id];t.activeCastTabActorId=I.id,t.selectedActorId=I.id,t.emitChange()}),b.append(_)}m.append(b),r.append(m)};return y("\uD83D\uDFE2 In Scene",A),y("⚪ Away",w),r}function Us(t){let{state:n,template:a,deltas:s}=t.snapshot,o=a.theme.showSceneChips,i=Re(n),p=e("div","ls-row");if(o.time)p.append(e("span","ls-chip",`\uD83D\uDD70️ ${i.time}`));if(o.date)p.append(e("span","ls-chip",`\uD83D\uDCC5 ${i.date}`));if(o.location)p.append(e("span","ls-chip ls-chip-accent",`\uD83D\uDCCD ${i.location}`));if(o.weather)p.append(e("span","ls-chip",`\uD83C\uDF26️ ${i.weather}`));if(a.coreTrackers?.trackPlayerAttire!==!1&&n.player.attire)p.append(e("span","ls-chip",`\uD83D\uDC55 You: ${n.player.attire.slice(0,28)}`));if(o.cast){let r=Lt(a,"demeanor");for(let d of Object.values(n.characters).filter((g)=>g.present).slice(0,4)){let g=s.characterDeltas[d.id]??{},v=Object.values(g).find((x)=>x!==0),M=r?he(d,"demeanor"):"",f=e("span","ls-chip",`\uD83D\uDC64 ${d.name}${M?` · ${M}`:""}`);if(v)f.append(e("span",`ls-delta ${v>0?"is-pos":"is-neg"}`,v>0?`+${v}`:String(v)));p.append(f)}}if(o.pinnedStats)for(let r of a.stats.filter((d)=>d.enabled&&(d.pinnedToHeader||d.showIn?.pinnedHeader)))if(r.scope==="character"){let d=Object.values(n.characters).find((f)=>f.present),g=d?.meters[r.id];if(!g?.calibrated)continue;let v=(d?s.characterDeltas[d.id]?.[r.id]:0)??0,M=e("span","ls-chip ls-chip-accent",`${r.icon} ${d.name} ${r.label}: ${String(g.value)}`);if(v!==0)M.append(e("span",`ls-delta ${v>0?"is-pos":"is-neg"}`,v>0?`+${v}`:String(v)));p.append(M)}else{let d=n.stats[r.id];if(!d?.calibrated)continue;let g=s.statDeltas[r.id]??0,v=e("span","ls-chip ls-chip-accent",`${r.icon} ${r.label}: ${String(d.value)}`);if(g!==0)v.append(e("span",`ls-delta ${g>0?"is-pos":"is-neg"}`,g>0?`+${g}`:String(g)));p.append(v)}return p}function es(t,n,a){let{state:s,template:o}=t.snapshot,i=e("div","ls-inline-host");t.stampThemeOnElement(i);let p=e("div","ls-inline-card");if(!t.inlineExpanded){let x=e("div","ls-inline-pill-bar");x.addEventListener("click",()=>{t.inlineExpanded=!0,t.emitChange()});let L=Dn(t);if(L.childElementCount===0)L.append(e("span","ls-chip ls-chip-accent",`${o.icon||"✨"} ${s.title||o.name||"Lumi Stats"}`));return x.append(L,ee("chevronDown",()=>{t.inlineExpanded=!0,t.emitChange()},{label:"Expand",className:"ls-btn-sm ls-btn-primary",title:"Expand Inline Ribbon"})),p.append(x),i.append(p),i}if(o.surfaces.customInlineHtml){let x=e("div","ls-card");p.append(x),Be(x,De(o.surfaces.customInlineHtml,s),t.ctx)}let r=[...o.surfaces.inlineTabs].filter((x)=>x.enabled&&(x.kind!=="web"||o.surfaces.showRelationshipWeb!==!1)).sort((x,L)=>x.order-L.order),d=r.find((x)=>x.id===t.activeInlineTab)??r[0]??{id:"stats",label:"Stats",icon:"\uD83D\uDCCA",kind:"stats",enabled:!0,order:0},g=e("div","ls-row-between"),v=e("div","ls-row");if(r.length>1)for(let x of r){let L=N(`${x.icon} ${x.label}`,()=>{t.activeInlineTab=x.id,t.emitChange()},"ls-btn-sm");if(x.id===d.id)L.setAttribute("aria-current","page");v.append(L)}else v.append(Us(t));let M=async(x)=>{if(typeof t.ctx.ui?.showContextMenu!=="function"){rt(t,a);return}let{selectedKey:L}=await t.ctx.ui.showContextMenu({position:{x:x.clientX,y:x.clientY},items:[{key:"edit_scene",label:"Edit Scene Values"},{key:"pill_prompts",label:"Edit Scene Pill Prompts & Chips"},{key:"template",label:`Switch Template & Skin (${o.name})`}]});if(L==="edit_scene")_t(t);else if(L==="pill_prompts")Ae(t);else if(L==="template")rt(t,a)},f=e("div","ls-row");if(f.append(ee("stage",()=>t.toggleVnStage(),{className:"ls-btn-sm ls-btn-ghost",label:"Stage",title:"Launch 2D Visual Novel Stage"}),ee("more",(x)=>void M(x),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:"Scene Pill, Template & Skin Options"}),ee("settings",a,{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:"Open Settings Studio"}),ee("chevronUp",()=>{t.inlineExpanded=!1,t.emitChange()},{label:"Collapse",className:"ls-btn-sm ls-btn-primary",title:"Collapse Ribbon"})),g.append(v,f),p.append(g),d.kind==="cast")p.append(nn(t,"inline",d.id,n));else if(d.kind==="web")p.append(Zt(t,n));else if(d.kind==="map")p.append(en(t));else{if(d.customHtml){let x=e("div","ls-card");p.append(x),Be(x,De(d.customHtml,s),t.ctx)}p.append(tn(t,"inline",d.id))}return i.append(p),i}var ts='    She⠀stepped⠀forward⠀with⠀a⠀warm⠀smile.⠀"Welcome⠀back."',zn="",ns="She hid the knife before any blood could spill.",as=!1,Ne=null;function ss(t,n){let a=t.settings,s=e("div","ls-stack"),o=e("section","ls-card");if(o.append(e("span","ls-kicker","Prose Typography & Unicode Hygiene"),e("h3","","Braille Blank (U+2800) & Whitespace Cleaner"),e("p","ls-muted","Scrubs invisible Braille pattern blanks (U+2800), zero-width joiners, and accidental 4-space code blocks.")),a){let M=e("div","ls-row-between ls-stat-cell");M.append(e("span","","Auto-Clean Braille Blanks & 4-Space Glitches"));let f=e("div");M.append(f),me(t,n,f,{checked:Boolean(a.cleanBraille),ariaLabel:"Auto-Clean Braille Blanks",onChange:(x)=>{t.request("settings:update",{settings:{cleanBraille:x}})}}),o.append(M)}let i=e("div","ls-row-between ls-stat-cell");i.append(e("span","","Retroactively clean all stored messages in the active chat:"),N("Clean Active Chat Now",()=>{t.request("prose:cleanChat").then((M)=>{t.notify(`Cleaned ${Number(M.cleanedCount??0)} of ${Number(M.total??0)} messages.`)})},"ls-btn-sm ls-btn-primary")),o.append(i),s.append(o);let p=e("div");s.append(p);let r=fe(t,n,p,{title:"Live Braille & Indentation Tester",iconName:"flask",defaultExpanded:!1,persistKey:"studio_prose_tester"}),d=e("textarea","ls-input");d.rows=2,d.value=ts;let g=e("div","ls-stat-cell"),v=()=>{ts=d.value,g.textContent=`Normalized Output: ${jt(d.value)}`};if(d.addEventListener("input",v),v(),r.append(d,g),a){let M=e("section","ls-card"),f=(I)=>{t.request("settings:update",{settings:I})},x=kt(a.sensitiveWords),L=a.obfuscateVowelsWithOne!==!1,T=e("div","ls-row-between"),A=e("div");T.append(e("h3","",`Sensitive Word Obfuscator (${x.length} words)`),A),me(t,n,A,{checked:Boolean(a.sensitiveObfuscatorEnabled),ariaLabel:"Enable Sensitive Word Obfuscator",onChange:(I)=>f({sensitiveObfuscatorEnabled:I})}),M.append(T,e("p","ls-muted",'Replaces vowels in chosen words with "1" (e.g., blood → bl11d) when sending prompts, and restores readable words & inflections (e.g., bl11d/bl11dy → blood/bloody) in chat display via Lumiverse display processing (requires "chat_mutation" or "regex_scripts" permission).'));let w=e("div","ls-row"),h=e("input","ls-input");h.style.flex="1",h.placeholder="Type words separated by commas (e.g. blood, kill)…",h.value=zn,h.addEventListener("input",()=>{zn=h.value});let C=()=>{let I=h.value.split(/[\n,;]+/).map((k)=>k.trim().toLowerCase()).filter((k)=>k.length>=2);if(!I.length)return;let c=kt([...x,...I]);zn="",h.value="",f({sensitiveWords:c,...a.sensitiveObfuscatorEnabled?{}:{sensitiveObfuscatorEnabled:!0}})};if(h.addEventListener("keydown",(I)=>{if(I.key==="Enter")I.preventDefault(),C()}),w.append(h,N("Add",C,"ls-btn-sm ls-btn-primary"),...x.length>0?[N("Clear All",()=>f({sensitiveWords:[]}),"ls-btn-sm ls-btn-danger")]:[]),M.append(w),x.length>0){let I=e("div","ls-row");for(let c of x)I.append(N(`${c} → ${Tn(c,L)} ✕`,()=>{f({sensitiveWords:x.filter((k)=>k!==c)})},"ls-btn-sm ls-quick-pill",`Remove "${c}"`));M.append(I)}let P=e("div");M.append(P);let S=fe(t,n,P,{title:"Cipher Rules & Live Preview",iconName:"sliders",defaultExpanded:!1,persistKey:"studio_prose_cipher"}),y=e("div","ls-grid");for(let[I,c,k]of[["obfuscateVowelsWithOne",'Use "1" instead of "*"',!0],["obfuscateOnSend","Obfuscate Prompts Sent to LLM",!0],["restoreObfuscatedOnRender","Restore Words in Chat Display",!0],["obfuscateOnOutput","Obfuscate Saved LLM Output",!1],["includeCipherHint","Explain Cipher Input to LLM (Keep prose normal)",!1]]){let _=e("div","ls-row-between ls-stat-cell");_.append(e("span","",c));let B=e("div");_.append(B),me(t,n,B,{checked:a[I]!==void 0?Boolean(a[I]):k,onChange:(R)=>f({[I]:R})}),y.append(_)}let u=e("input","ls-input");u.value=ns;let l=e("small","ls-muted"),m=e("small","ls-muted"),b=()=>{ns=u.value;let I=Ma(u.value,x,L),c=a.obfuscateOnOutput?I:a.restoreObfuscatedOnRender!==!1?La(I,x,L):I;l.textContent=`Sent to LLM: ${I}`,m.textContent=`Chat Display: ${c}`};u.addEventListener("input",b),b(),S.append(y,u,l,m),s.append(M)}return s}function rs(t,n,a){let s=t.settings,o=e("div","ls-stack");if(!s)return o;if(!t.connections.length&&!as)as=!0,t.refreshActiveChat();let i=e("section","ls-card");i.append(e("h3","","Extraction Mode & Connections"));let p=e("div","ls-row");for(let[c,k]of[["sidecar","Dedicated Sidecar Extractor (Works with Any Preset)"],["inline_tag","Zero-Call Inline <lumi-stats> Tag"]]){let _=N(k,()=>{t.request("settings:update",{settings:{extractionMode:c}})},"ls-btn-sm");if(s.extractionMode===c)_.setAttribute("aria-current","page");p.append(_)}i.append(p);let r=e("div","ls-grid");for(let[c,k]of[["autoTrack","Auto-calibrate after assistant replies"],["injectContinuity","Inject continuity into narrator prompt"],["memoryCortexSync","Sync to Lumiverse Memory Cortex"],["worldInfoGating","Enable [lumi:stat>=value] World Info gates"],["thresholdToasts","Show threshold toast alerts"],["debugInspector","Keep last extractor payload for debug"]]){let _=e("div","ls-row-between ls-stat-cell");_.append(e("span","",k));let B=e("div");_.append(B),me(t,n,B,{checked:Boolean(s[c]),onChange:(R)=>void t.request("settings:update",{settings:{[c]:R}})}),r.append(_)}i.append(r);let d=e("div","ls-grid"),g=e("div","ls-label","Extractor LLM Connection"),v=e("div");g.append(v);let M=e("label","ls-label","Extractor Model Override"),f=e("div");M.append(f),d.append(g,M),i.append(d),J(t,n,v,{value:s.extractorConnectionId||"",ariaLabel:"Extractor LLM Connection",searchPlaceholder:"Search connections…",options:[{value:"",label:"Use Active Lumiverse Default Connection"},...t.connections.map((c)=>({value:c.id,label:`${c.name}${c.model?` (${c.model})`:""}`,...c.provider?{sublabel:c.provider}:{}}))],onChange:(c)=>{t.request("settings:update",{settings:{extractorConnectionId:c}})}});let x=e("input","ls-input");if(x.value=s.extractorModel||"",x.placeholder="Default connection model…",x.addEventListener("change",()=>{t.request("settings:update",{settings:{extractorModel:x.value.trim()}})}),f.append(x),t.ctx.components?.mountModelCombobox)a.push(()=>{if(!f.isConnected)return;try{f.replaceChildren(),n.track(t.ctx.components.mountModelCombobox(f,{value:s.extractorModel||"",connection:s.extractorConnectionId?{kind:"llm",id:s.extractorConnectionId}:{kind:"llm"},appearance:"standard",placeholder:"Default connection model…",onChange:(c)=>{t.request("settings:update",{settings:{extractorModel:c}})}}))}catch{}});let L=e("section","ls-card");L.append(e("span","ls-kicker","Token Economy & Prompt Budget"),e("h3","","Token Diet, Protocol Mode & Live Analyzer"));let T=e("div","ls-grid"),A=e("label","ls-label","Continuity Token Budget (150–4000)"),w=e("input","ls-input");w.type="number",w.min="150",w.max="4000",w.step="50",w.value=String(s.tokenBudget??450),w.addEventListener("change",()=>{let c=Math.max(150,Math.min(4000,Math.round(Number(w.value)||450)));w.value=String(c),t.request("settings:update",{settings:{tokenBudget:c}})}),A.append(w);let h=e("div","ls-label","Extractor Protocol Mode"),C=e("div");h.append(C),J(t,n,C,{value:s.protocolVerbosity??"compact",ariaLabel:"Extractor Protocol Mode",options:[{value:"compact",label:"Compact Delta (Recommended — Saves ~45%)"},{value:"standard",label:"Standard Detailed (Verbose Turn-1 Guides)"}],onChange:(c)=>{t.request("settings:update",{settings:{protocolVerbosity:c}})}});let P=e("label","ls-label","Sidecar History Window (2–12 msgs)"),S=e("input","ls-input");S.type="number",S.min="2",S.max="12",S.value=String(s.sidecarHistoryTurns??4),S.addEventListener("change",()=>{let c=Math.max(2,Math.min(12,Math.round(Number(S.value)||4)));S.value=String(c),t.request("settings:update",{settings:{sidecarHistoryTurns:c}})}),P.append(S);let y=e("label","ls-label","Sidecar Max Chars / Msg (800–6000)"),u=e("input","ls-input");u.type="number",u.min="800",u.max="6000",u.step="250",u.value=String(s.sidecarMaxCharsPerMsg??2500),u.addEventListener("change",()=>{let c=Math.max(800,Math.min(6000,Math.round(Number(u.value)||2500)));u.value=String(c),t.request("settings:update",{settings:{sidecarMaxCharsPerMsg:c}})}),y.append(u),T.append(A,h,P,y),L.append(T);let l=e("div","ls-row");l.append(N("Hide Analytical Fields from Continuity",()=>{let c=new Set(["acted","observation","plan","knowledge","cash_in_hand","cash_in_bank","bottom_underwear","top_underwear","offscreen_npcs"]),k=t.snapshot.template.stats.map((_)=>c.has(_.id)?{..._,injectInContinuity:!1}:_);t.request("state:mutate",{templatePatch:{stats:k},reason:"Moved analytical/secondary stats to UI-only continuity"}).then(()=>t.notify("Analytical fields moved to UI-only (still tracked & visible in panels)."))},"ls-btn-sm","Stops echoing acted, observation, plan, knowledge, cash, underwear, and offscreen_npcs back to the narrator while keeping them in the UI"),N("Auto-Gate Situational Stats",()=>{let c={cash_in_hand:["cash","coin","gold","money","pay","buy","sell","price","wallet","bank"],cash_in_bank:["cash","coin","gold","money","pay","buy","sell","bank","account","asset"],bottom_underwear:["undress","underwear","panties","boxers","towel","bath","strip","naked","skirt","pants"],top_underwear:["undress","underwear","bra","towel","bath","strip","naked","shirt","top"]},k=t.snapshot.template.stats.map((_)=>{if(c[_.id])return{..._,promptTriggerMode:"conditional",promptKeywords:c[_.id]};if((_.id==="eff_pow_agi"||_.id==="char_eff_pow_agi")&&_.formula?.trim())return{..._,calculationMode:"local_formula"};return _});t.request("state:mutate",{templatePatch:{stats:k},reason:"Applied keyword gating & local-formula diet"}).then(()=>t.notify("Applied keyword gating to situational stats."))},"ls-btn-sm","Only sends cash & clothing rules when matching keywords appear in recent chat")),L.append(l);let m=e("div","ls-stat-cell"),b=()=>{if(m.replaceChildren(),!Ne){m.append(e("small","ls-muted",'Click "Analyze Current Chat Tokens" to measure exact protocol, continuity, and per-stat token usage.'));return}let c=Ne.approximate?" (est.)":"";m.append(e("strong","",`Total Injected: ${Number(Ne.totalInjectedTokens??0)} tokens${c} — Protocol: ${Number(Ne.protocolTokens??0)} | Continuity: ${Number(Ne.continuityTokens??0)} (uncapped: ${Number(Ne.rawContinuityTokens??0)}) | Dossier: ~${Number(Ne.dossierStateTokens??0)}`));let k=Array.isArray(Ne.topStats)?Ne.topStats:[];if(k.length>0){let _=e("div","ls-row");for(let B of k)_.append(e("span","ls-chip",`${String(B.label)}: ~${Number(B.approxTokens??0)}t (rule ${Number(B.ruleTokens??0)} + state ${Number(B.stateTokens??0)})`));m.append(_)}};b();let I=N("Analyze Current Chat Tokens",()=>{I.disabled=!0,I.textContent="Counting tokens…",t.request("tokens:analyze").then((c)=>{Ne=c,b()}).finally(()=>{if(I.isConnected)I.disabled=!1,I.textContent="Analyze Current Chat Tokens"})},"ls-btn-sm ls-btn-primary");return L.append(I,m),i.append(N("Inspect Last Extractor Payload",()=>{t.request("debug:get").then((c)=>{t.modals.open({title:"Last Extractor JSON Output",width:720,maxHeight:740},(k)=>{let _=e("pre","ls-stat-cell",c.record?JSON.stringify(c.record,null,2):"No debug record captured yet. Enable debug inspection and run a sync.");_.style.whiteSpace="pre-wrap",_.style.overflowWrap="anywhere",k.append(_)})})},"ls-btn-sm")),o.append(i,L),o}function rn(t,n){let a=structuredClone(t.snapshot.template),s=[...a.categories??[]];t.modals.open({title:n?`Edit Category: ${n.icon} ${n.name}`:"Create Stat Category & Group Rule",width:660,maxHeight:840},(o,i,p,r)=>{let d=n?.enabled??!0,g=n?.showGroupHeaderInHud??!0,v=n?.collapsedByDefault??!1,M=n?.injectInContinuity??!0,f=n?.color||"var(--lumiverse-primary)",x=n?.promptTriggerMode??"always",L=new Set(n?a.stats.filter((Y)=>Y.categoryId===n.id).map((Y)=>Y.id):[]),T=e("div","ls-grid"),A=e("label","ls-label","Icon"),w=e("input","ls-input");w.value=n?.icon??"\uD83D\uDCC1",A.append(w);let h=e("label","ls-label","Category Name"),C=e("input","ls-input");C.placeholder="e.g. Combat & Power, Romance & Chemistry, Finances…",C.value=n?.name??"",h.append(C),T.append(A,h),o.append(T);let P=e("div","ls-label","Category Accent Color"),S=e("div","ls-row"),y=()=>{for(let Y of[...S.querySelectorAll(".ls-color-swatch")])Y.setAttribute("aria-pressed",String(Y.dataset.colorVal===f))};for(let[Y,Q,le]of[["var(--lumiverse-primary)","Theme Primary","var(--lumiverse-primary, #38bdf8)"],["#38bdf8","Sky","#38bdf8"],["#f472b6","Rose","#f472b6"],["#f59e0b","Amber","#f59e0b"],["#10b981","Emerald","#10b981"],["#a78bfa","Violet","#a78bfa"],["#f43f5e","Crimson","#f43f5e"]]){let ge=N("",()=>{f=Y,y()},"ls-color-swatch",Q);ge.dataset.colorVal=Y,ge.style.background=le,S.append(ge)}y(),P.append(S),o.append(P);let u=e("div","ls-row-between ls-stat-cell");u.append(e("strong","","Enable Category & All Stats Inside It"));let l=e("div");u.append(l),me(t,r,l,{checked:d,ariaLabel:"Enable Category",onChange:(Y)=>{d=Y}}),o.append(u);let m=e("div","ls-grid");for(let[Y,Q,le]of[["Show Category Header in HUD / Drawer",g,(ge)=>{g=ge}],["Collapse Group by Default",v,(ge)=>{v=ge}],["Include Category Stats & AI Rule in Story Continuity",M,(ge)=>{M=ge}]]){let ge=e("div");xe(t,r,ge,{checked:Q,label:Y,onChange:le}),m.append(ge)}o.append(m);let b=e("div");o.append(b);let I=fe(t,r,b,{title:"Shared Category AI Rule & Prompt Trigger",iconName:"sparkles",defaultExpanded:!0,persistKey:"modal_cat_ai_rule"});I.append(e("small","ls-muted","This rule is printed ONCE for the group alongside each member stat’s own individual rule (individual stat rules remain completely untouched)."));let c=e("div","ls-label","Group Prompt Frequency"),k=e("div");c.append(k),I.append(c);let _=e("label","ls-label","Group Trigger Keywords (comma-separated)"),B=e("input","ls-input");B.placeholder="e.g. attack, fight, hit, spell, bleed, dodge",B.value=(n?.promptKeywords??[]).join(", "),_.append(B),I.append(_);let R=()=>{_.style.display=x==="conditional"?"":"none"};R(),J(t,r,k,{value:x,ariaLabel:"Group Prompt Frequency",options:[{value:"always",label:"Always in Prompt"},{value:"conditional",label:"Only When Group Keywords Match"},{value:"manual",label:"Manual Sync Only"}],onChange:(Y)=>{x=Y,R()}});let E=e("div","ls-label"),D=e("div","ls-row-between"),H=e("textarea","ls-input");H.rows=3,H.value=n?.aiRule??"",H.placeholder="Describe shared delta ranges, combat multipliers, romance pacing, or roleplay behavior for stats in this category…",D.append(e("span","","Shared Category AI / Delta Rule"),N("⛶ Full-Screen Editor",()=>{t.request("textEditor:open",{title:`Category Rule: ${C.value||"Category"}`,value:H.value,placeholder:"Describe shared rules for this stat group…"}).then((Y)=>{if(!Y.cancelled&&typeof Y.text==="string")H.value=Y.text})},"ls-btn-sm")),E.append(D,H),I.append(E);let F=e("div");o.append(F);let j=fe(t,r,F,{title:"Local Group Formula & Cross-Stat Modifiers (Optional)",iconName:"sliders",defaultExpanded:Boolean(n?.localRuleFormula),persistKey:"modal_cat_local_rule"});j.append(e("small","ls-muted",'Supports conditional modifiers `mod("stat_id", "Label", delta)` (auto-applies while true and clears when false) and `set("stat_id", expr)` / `if(cond) mod(...)`.'));let O=e("textarea","ls-input");O.rows=3,O.placeholder=`e.g.
mod("composure", "High Arousal", arousal >= 75 ? -10 : 0)
if(HP < HP_max * 0.5) mod("composure", "Wounded", -10)`,O.value=n?.localRuleFormula??"";let W=e("div","ls-formula-status"),K=e("strong","");W.append(K);let z=()=>{let Y=wn({...n,id:n?.id,name:C.value.trim()||"Preview Category",localRuleFormula:O.value});if(!O.value.trim()){W.dataset.status="warn",K.textContent="No local group formula set (optional).";return}let Q=Ha(Y,t.snapshot.state,a.stats,t.selectedActorId);if(Q.error)W.dataset.status="error",K.textContent=`✖ Error: ${Q.error}`;else if(Q.appliedEffects.length>0)W.dataset.status="ok",K.textContent=`✓ Active Effects: ${Q.appliedEffects.join(" · ")}`;else W.dataset.status="ok",K.textContent="✓ Valid formula (0 active modifiers triggered on current state)."};O.addEventListener("input",z),z(),j.append(O,W,N("▶ Test Group Formula",z,"ls-btn-sm"));let V=e("div");o.append(V);let G=fe(t,r,V,{title:`Member Stats in This Category (${L.size})`,iconName:"stats",defaultExpanded:!0,persistKey:"modal_cat_members"}),q=e("div","ls-grid");for(let Y of a.stats){let Q=e("div");xe(t,r,Q,{checked:L.has(Y.id),label:`${Y.icon} ${Y.label} (${Y.scope})`,onChange:(le)=>{if(le)L.add(Y.id);else L.delete(Y.id)}}),q.append(Q)}G.append(q);let X=e("div","ls-row-between");X.style.marginTop="12px";let te=e("div","ls-row");if(n)te.append(N("Delete Category",()=>{let Y=s.filter((le)=>le.id!==n.id),Q=a.stats.map((le)=>le.categoryId===n.id?{...le,categoryId:void 0}:le);t.request("state:mutate",{templatePatch:{categories:Y,stats:Q},reason:`Deleted category "${n.name}" (stats preserved)`}),i()},"ls-btn-sm ls-btn-danger"));let ae=N(n?"Save Category":"Create Category",()=>{let Y=C.value.trim();if(!Y)return;let Q=B.value.split(",").map((ie)=>ie.trim().toLowerCase()).filter(Boolean),le=wn({...n,id:n?.id,name:Y,icon:w.value.trim()||"\uD83D\uDCC1",color:f,enabled:d,showGroupHeaderInHud:g,collapsedByDefault:v,injectInContinuity:M,promptTriggerMode:x,promptKeywords:Q,aiRule:H.value.trim()||void 0,localRuleFormula:O.value.trim()||void 0,order:n?.order??s.length}),ge=s.some((ie)=>ie.id===le.id)?s.map((ie)=>ie.id===le.id?le:ie):[...s,le],Se=a.stats.map((ie)=>{if(L.has(ie.id))return{...ie,categoryId:le.id};if(ie.categoryId===le.id)return{...ie,categoryId:void 0};return ie});t.request("state:mutate",{templatePatch:{categories:ge,stats:Se},reason:`Saved category "${le.name}"`}),i()},"ls-btn-primary");X.append(te,ae),o.append(X)})}var de="all",Vn="",os=[{label:"Blush & Fluster",icon:"\uD83D\uDC93",scope:"character",kind:"meter",min:0,max:100,defaultValue:0,volatility:"momentary",triggerCues:"0–100 scale. Spikes immediately on teasing, eye contact, state of undress, or closeness; cools down in calm talk."},{label:"Jealousy & Possessiveness",icon:"\uD83D\uDD25",scope:"character",kind:"meter",min:0,max:100,defaultValue:10,volatility:"momentary",triggerCues:"0–100 scale. Rises when the player praises, flirts with, or prioritizes another rival."},{label:"Respect & Standing",icon:"\uD83D\uDC51",scope:"character",kind:"meter",min:0,max:100,defaultValue:50,volatility:"progressive",triggerCues:"0–100 scale. Rises when the player shows competence, poise, or backbone; drops on weakness."},{label:"Suspicion",icon:"\uD83D\uDD0D",scope:"character",kind:"meter",min:0,max:100,defaultValue:15,volatility:"progressive",triggerCues:"0–100 scale. Increases when catching inconsistencies, secrets, or unusual behavior."},{label:"Stamina & Energy",icon:"⚡",scope:"player",kind:"meter",min:0,max:100,defaultValue:100,volatility:"momentary",triggerCues:"0–100 scale. Spent during physical exertion, combat, or sleepless nights; restored by rest or meals."},{label:"Danger / Event Clock",icon:"⏱️",scope:"world",kind:"clock",min:0,max:6,defaultValue:0,volatility:"progressive",triggerCues:"0–6 segments. Advance by +1 segment as an approaching confrontation, deadline, or alarm draws closer."},{label:"Skill Tree & SP",icon:"\uD83C\uDF33",scope:"player",kind:"skill_tree",min:0,max:100,defaultValue:0,volatility:"progressive",triggerCues:'Format: "SP: N | Skill A (Lv.X/Y, cost:1, bonus) ; Skill B (Lv.X/Y, cost:1, req:Skill A)". Award SP on milestones.'},{label:"Level & XP",icon:"⭐",scope:"player",kind:"xp_level",min:0,max:100,defaultValue:0,volatility:"progressive",triggerCues:'Format: "Lv. N | cur/next XP | Rank X". Award XP on quests/battles; level up when cur >= next.'},{label:"Core Attributes",icon:"\uD83E\uDDEC",scope:"player",kind:"attributes",min:1,max:30,defaultValue:10,volatility:"anchor",triggerCues:'Comma-separated stats: "STR:N, DEX:N, CON:N, INT:N, WIS:N, CHA:N".'},{label:"Gear & Inventory",icon:"\uD83C\uDF92",scope:"player",kind:"inventory",min:0,max:100,defaultValue:0,volatility:"progressive",triggerCues:'Separate items by "; " with qty & rarity tags: "Runed Blade [rare, equipped] ; Potion x3 [common]".'},{label:"Buffs & Debuffs",icon:"⚡",scope:"player",kind:"status_fx",min:0,max:100,defaultValue:0,volatility:"momentary",triggerCues:'Prefix buffs with "+" and debuffs with "-" separated by "; ", e.g. "+Shielded (2t) ; -Exhausted (1t)".'},{label:"Gold / Credits",icon:"\uD83E\uDE99",scope:"player",kind:"currency",min:0,max:99999999,defaultValue:100,volatility:"progressive",triggerCues:"Track currency. Emit +N / -N on rewards, loot, or spending."}],qs=[{id:"player_attire",group:"player"},{id:"player_condition",group:"player"},{id:"player_action",group:"player"},{id:"scene_summary",group:"scene_world"},{id:"places",group:"scene_world"},{id:"quests",group:"scene_world"},{id:"dispatches",group:"scene_world"},{id:"npc_conditions",group:"character"},{id:"npc_secrets",group:"character"}];function is(t,n,a,s,o){let i=e("div","ls-stack"),p=e("div","ls-row-between"),r=e("input","ls-input");r.style.cssText="flex:1 1 220px;min-width:160px;",r.placeholder="Search stats, meters, built-ins, or dossier fields…",r.value=Vn;let d=e("div","ls-row");d.append(ee("flask",()=>Ge(t),{label:"Test Sandbox",className:"ls-btn-sm"}),ee("plus",()=>rn(t),{label:"New Category",className:"ls-btn-sm",title:"Create a custom Stat Category with shared AI/local rules"}),ee("plus",()=>Ce(t,"character"),{label:"New Stat",className:"ls-btn-sm ls-btn-primary"})),p.append(r,d),i.append(p);let g=e("div","ls-subnav-pills");for(let[T,A]of[["all","All Trackers"],["categories",`Categories (${(a.categories??[]).length})`],["character","NPC Meters"],["player","Player Stats"],["scene_world","Scene & World"],["builtin","Built-Ins & Pill"],["dossier","Dossier Fields"]]){let w=N(A,()=>{de=T,o()},"ls-btn-sm");if(de===T)w.setAttribute("aria-current","page");g.append(w)}i.append(g);let v=e("div");i.append(v);let M=fe(t,n,v,{title:"1-Click Quick-Add Popular Stats",iconName:"sparkles",badge:os.length,defaultExpanded:!1,persistKey:"studio_stats_quick_add"}),f=e("div","ls-row");for(let T of os){let A=a.stats.some((h)=>h.id===re(T.label,"stat")),w=N(`${A?"✓ ":"+ "}${T.icon} ${T.label}`,()=>{let h=se({label:T.label,icon:T.icon,scope:T.scope,kind:T.kind,min:T.min,max:T.max,defaultValue:T.defaultValue,volatility:T.volatility,triggerCues:T.triggerCues});s((C)=>({stats:[...C.stats.filter((P)=>P.id!==h.id),h]}),`Added stat "${h.label}"`),t.notify(`Added "${h.icon} ${h.label}".`)},`ls-btn-sm ls-quick-pill ${A?"ls-chip-accent":""}`,T.triggerCues);f.append(w)}M.append(f);let x=e("div","ls-stack");i.append(x);let L=()=>{x.replaceChildren();let T=Vn.trim().toLowerCase(),A=(l)=>!T||l.toLowerCase().includes(T);if((de==="all"||de==="scene_world"||de==="builtin")&&A("scene pill location time date weather clock")){let l=e("div","ls-stat-row-compact");l.style.borderLeft="3px solid var(--ls-primary)";let m=e("div","ls-row");m.append(e("strong","","\uD83D\uDCCD Scene Pill (Location, Time, Date, Weather)"),e("span","ls-chip ls-chip-accent",a.coreTrackers?.scenePillLocked?"\uD83D\uDD12 Locked":"Built-In Pill"));let b=e("div","ls-row");b.append(N("Full Edit & Prompts",()=>Ae(t),"ls-btn-sm ls-btn-primary")),l.append(m,b),x.append(l)}let w=(l)=>{let m=e("div","ls-stat-row-compact");m.style.borderLeft=`3px solid ${l.color||"var(--ls-primary)"}`;let b=e("div","ls-row");b.style.minWidth="0";let I=e("div");me(t,n,I,{checked:l.enabled,ariaLabel:`Toggle ${l.label}`,onChange:(E)=>{s((D)=>({stats:D.stats.map((H)=>H.id===l.id?{...H,enabled:E}:H)}))}});let k=!$t(l)&&l.kind!=="boolean"?`${l.kind} (${l.min}–${l.max})`:l.kind,_=l.scope==="character"?"NPC":l.scope,B=l.calculationMode==="ai_plus_local"?"\uD83D\uDD00 Hybrid":l.calculationMode==="local_formula"||Boolean(l.formula?.trim())&&l.calculationMode!=="ai"?"⚡ Local":"\uD83E\uDD16 AI";b.append(I,e("strong","",`${l.icon} ${l.label}`),e("span","ls-chip",`${_} · ${k}`),e("span",`ls-chip ${B!=="\uD83E\uDD16 AI"?"ls-chip-accent":""}`,B),...l.promptTriggerMode==="conditional"?[e("span","ls-chip","\uD83D\uDD0D Conditional")]:[],...l.pinnedToHeader?[e("span","ls-chip ls-chip-accent","Pinned")]:[],...l.locked?[e("span","ls-chip","\uD83D\uDD12")]:[]);let R=e("div","ls-row");return R.style.flex="none",R.append(N("Full Edit",()=>Ce(t,l.scope,l),"ls-btn-sm"),ee("more",async(E)=>{if(typeof t.ctx.ui?.showContextMenu!=="function"){Ce(t,l.scope,l);return}let{selectedKey:D}=await t.ctx.ui.showContextMenu({position:{x:E.clientX,y:E.clientY},items:[{key:"edit",label:"Full Edit (Style, Tabs & AI Prompt)"},{key:"pin",label:l.pinnedToHeader?"Unpin from Pill":"Pin to Scene Pill",active:l.pinnedToHeader},{key:"lock",label:l.locked?"Unlock Value":"Lock Value",active:l.locked},{key:"duplicate",label:"Duplicate to Another Scope / Tab…"},{key:"test",label:"Test in AI Sandbox"},{key:"div",label:"",type:"divider"},{key:"delete",label:"Delete Stat",danger:!0}]});if(D==="edit")Ce(t,l.scope,l);else if(D==="pin")s((H)=>({stats:H.stats.map((F)=>F.id===l.id?{...F,pinnedToHeader:!F.pinnedToHeader,showIn:{...F.showIn,pinnedHeader:!F.pinnedToHeader}}:F)}));else if(D==="lock")s((H)=>({stats:H.stats.map((F)=>F.id===l.id?{...F,locked:!F.locked}:F)}));else if(D==="duplicate")Fe(t,l);else if(D==="test")Ge(t,l.id);else if(D==="delete")s((H)=>({stats:H.stats.filter((F)=>F.id!==l.id)}))},{className:"ls-btn-sm ls-btn-icon ls-btn-ghost",title:"More actions"})),m.append(b,R),m},h=[...a.categories??[]].sort((l,m)=>l.order-m.order),C=new Set(h.map((l)=>l.id)),P=a.stats.filter((l)=>{if(de==="dossier"||de==="builtin")return!1;if(de==="character"&&l.scope!=="character")return!1;if(de==="player"&&l.scope!=="player")return!1;if(de==="scene_world"&&l.scope!=="world"&&l.scope!=="scene")return!1;return A(`${l.label} ${l.id} ${l.kind} ${l.triggerCues}`)});if(de==="categories"&&h.length===0){let l=e("section","ls-card");l.append(e("strong","","No custom categories created yet"),e("p","ls-muted","Group related stats (e.g. Combat & Power, Romance, Finances) to attach shared AI delta rules, group keyword triggers, or cross-stat local modifiers—while keeping each stat’s own rules intact."),N("+ Create First Category",()=>rn(t),"ls-btn-sm ls-btn-primary")),x.append(l)}for(let l of h){let m=P.filter((B)=>B.categoryId===l.id);if(de!=="categories"&&m.length===0&&T)continue;if(de!=="all"&&de!=="categories"&&m.length===0)continue;let b=e("section","ls-card ls-cat-group");b.style.borderLeft=`3px solid ${l.color||"var(--ls-primary)"}`;let I=e("div","ls-row-between"),c=e("div","ls-row"),k=e("div");me(t,n,k,{checked:l.enabled,ariaLabel:`Toggle category ${l.name}`,onChange:(B)=>{s((R)=>({categories:(R.categories??[]).map((E)=>E.id===l.id?{...E,enabled:B}:E)}))}}),c.append(k,e("strong","",`${l.icon} ${l.name}`),e("span","ls-chip",`${m.length} stats`),...l.aiRule?[e("span","ls-chip ls-chip-accent","Shared Rule")]:[],...l.localRuleFormula?[e("span","ls-chip ls-chip-accent","⚡ Local Rule")]:[],...l.promptTriggerMode==="conditional"?[e("span","ls-chip","\uD83D\uDD0D Conditional")]:[]);let _=e("div","ls-row");if(_.append(N("Edit Group & Rules",()=>rn(t,l),"ls-btn-sm")),I.append(c,_),b.append(I),m.length>0){let B=e("div");b.append(B);let R=fe(t,n,B,{title:`Member Stats (${m.length})`,defaultExpanded:!l.collapsedByDefault,persistKey:`studio_cat_${l.id}`});for(let E of m)R.append(w(E))}else b.append(e("small","ls-muted",'No stats assigned to this category yet. Click "Edit Group & Rules" to assign stats.'));x.append(b)}let S=P.filter((l)=>!l.categoryId||!C.has(l.categoryId));if(S.length>0&&de!=="categories"){let l=e("section","ls-card"),m=e("div","ls-row-between");m.append(e("h3","",h.length>0?`Uncategorized Stats (${S.length})`:`Stats & Meters (${S.length})`),e("span","ls-muted","Click Full Edit to customize prompt, category, style & formula")),l.append(m);for(let b of S)l.append(w(b));x.append(l)}let y=qs.filter((l)=>{if(de==="dossier")return!1;if(de!=="all"&&de!=="builtin"&&l.group!==de)return!1;let m=ht(a.coreTrackers,l.id);return A(`${l.id} ${m.label} ${m.instruction}`)});if(y.length>0){let l=e("section","ls-card");l.append(e("div","ls-row-between")),l.firstElementChild.append(e("h3","",`Built-In Story Trackers (${y.length})`),e("span","ls-muted","Editable labels, prompts, styles & tabs"));for(let m of y){let b=ht(a.coreTrackers,m.id),I=e("div","ls-stat-row-compact");I.style.borderLeft=`3px solid ${b.color||"var(--ls-primary)"}`;let c=e("div","ls-row"),k=e("div");me(t,n,k,{checked:b.enabled,ariaLabel:`Toggle ${b.label}`,onChange:(B)=>{let R={player_attire:"trackPlayerAttire",player_condition:"trackPlayerCondition",player_action:"trackPlayerAction",scene_summary:"trackSceneSummary",places:"trackPlaces",quests:"trackQuests",dispatches:"trackDispatches",npc_conditions:"trackNpcConditions",npc_secrets:"trackNpcSecrets"};s((E)=>{let D={...E.coreTrackers??{}};return D[R[m.id]]=B,{coreTrackers:D}})}}),c.append(k,e("strong","",`${b.icon||"\uD83D\uDCCA"} ${b.label}`),e("span","ls-chip","Built-In"),...b.locked?[e("span","ls-chip","\uD83D\uDD12")]:[]);let _=e("div","ls-row");_.append(N("Full Edit",()=>Qt(t,m.id),"ls-btn-sm")),I.append(c,_),l.append(I)}x.append(l)}let u=a.dossierFields.filter((l)=>{if(de!=="all"&&de!=="dossier"&&de!=="character")return!1;return A(`${l.label} ${l.id} ${l.instruction}`)});if(u.length>0||de==="dossier"){let l=e("section","ls-card"),m=e("div","ls-row-between");m.append(e("h3","",`Character Dossier Fields (${u.length})`),e("div","ls-row")),m.lastElementChild.append(N("Restore Defaults",()=>{s({dossierFields:St()},"Restored default dossier fields")},"ls-btn-sm ls-btn-ghost"),ee("plus",()=>Ye(t),{label:"New Field",className:"ls-btn-sm ls-btn-primary"})),l.append(m);for(let b of u){let I=e("div","ls-stat-row-compact");I.style.borderLeft=`3px solid ${b.color||"var(--ls-primary)"}`;let c=e("div","ls-row"),k=e("div");me(t,n,k,{checked:b.enabled,ariaLabel:`Toggle ${b.label}`,onChange:(B)=>{s((R)=>({dossierFields:R.dossierFields.map((E)=>E.id===b.id?{...E,enabled:B}:E)}))}}),c.append(k,e("strong","",`${b.icon} ${b.label}`),e("span","ls-chip",`Dossier · ${b.displayStyle||"card"}`));let _=e("div","ls-row");_.append(N("Full Edit",()=>Ye(t,b),"ls-btn-sm"),ee("trash",()=>{s((B)=>({dossierFields:B.dossierFields.filter((R)=>R.id!==b.id)}))},{className:"ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger",title:"Delete field"})),I.append(c,_),l.append(I)}x.append(l)}};return r.addEventListener("input",()=>{Vn=r.value,L()}),L(),i}var Rt="tabs";function ls(t,n,a,s,o){let i=e("div","ls-stack"),p=e("div","ls-subnav-pills");for(let[r,d]of[["tabs","1. Widget & Inline Tabs"],["dossier","2. Dossier Tabs"],["matrix","3. Stat Placement Matrix"],["banners","4. Scene Pill & Custom HTML"]]){let g=N(d,()=>{Rt=r,o()},"ls-btn-sm");if(Rt===r)g.setAttribute("aria-current","page");p.append(g)}if(i.append(p),Rt==="tabs"){let r=e("section","ls-card");r.append(e("h3","","Relationship Web & Peer Bonds"));let d=e("div","ls-grid");for(let[v,M]of[["showRelationshipWeb","Enable Relationship Web Tab"],["trackNpcBonds","Track NPC↔NPC Peer Bonds"]]){let f=e("div");xe(t,n,f,{checked:a.surfaces[v]!==!1,label:M,onChange:(x)=>s((L)=>({surfaces:{...L.surfaces,[v]:x}}))}),d.append(f)}r.append(d),i.append(r);let g=(v,M,f)=>{let x=e("section","ls-card");x.append(e("h3","",v));let L=[...f].sort((C,P)=>C.order-P.order),T=(C)=>{s((P)=>{let S=[...P.surfaces[M]].sort((y,u)=>y.order-u.order);return{surfaces:{...P.surfaces,[M]:C(S)}}})};L.forEach((C,P)=>{let S=e("div","ls-stat-row-compact"),y=e("div","ls-row"),u=e("div");me(t,n,u,{checked:C.enabled,ariaLabel:`Toggle ${C.label}`,onChange:(c)=>{T((k)=>k.map((_)=>_.id===C.id?{..._,enabled:c}:_))}});let l=e("input","ls-input");l.style.cssText="width:44px;min-height:28px;padding:2px 6px;",l.value=C.icon,l.addEventListener("change",()=>{let c=l.value.trim()||"\uD83D\uDCCA";T((k)=>k.map((_)=>_.id===C.id?{..._,icon:c}:_))});let m=e("input","ls-input");m.style.cssText="width:130px;min-height:28px;padding:2px 8px;",m.value=C.label,m.addEventListener("change",()=>{let c=m.value.trim()||C.label;T((k)=>k.map((_)=>_.id===C.id?{..._,label:c}:_))});let b=e("div");J(t,n,b,{value:C.kind,compact:!0,ariaLabel:"Surface Tab Kind",options:[{value:"stats",label:"Stats Grid"},{value:"cast",label:"Cast List"},{value:"web",label:"Bond Web"},{value:"map",label:"Spatial Atlas"},{value:"world",label:"World & Clocks"},{value:"custom",label:"Custom Tab"}],onChange:(c)=>{T((k)=>k.map((_)=>_.id===C.id?{..._,kind:c}:_))}}),y.append(u,l,m,b);let I=e("div","ls-row");if(P>0)I.append(N("↑",()=>{T((c)=>{let k=c.findIndex((B)=>B.id===C.id);if(k<=0)return c;let _=[...c];return[_[k-1],_[k]]=[_[k],_[k-1]],_.map((B,R)=>({...B,order:R}))})},"ls-btn-sm ls-btn-icon ls-btn-ghost"));if(P<L.length-1)I.append(N("↓",()=>{T((c)=>{let k=c.findIndex((B)=>B.id===C.id);if(k<0||k>=c.length-1)return c;let _=[...c];return[_[k],_[k+1]]=[_[k+1],_[k]],_.map((B,R)=>({...B,order:R}))})},"ls-btn-sm ls-btn-icon ls-btn-ghost"));if(L.length>1)I.append(ee("trash",()=>T((c)=>c.filter((k)=>k.id!==C.id)),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger",title:"Delete tab"}));S.append(y,I),x.append(S)});let A=e("div","ls-row"),w=e("input","ls-input");w.style.width="50px",w.value="✨";let h=e("input","ls-input");return h.style.flex="1",h.placeholder="New tab name (e.g. Gear, Plans, Clues)…",A.append(w,h,ee("plus",()=>{let C=h.value.trim();if(!C)return;let P=w.value.trim()||"✨";T((S)=>[...S,{id:re(C,`tab_${S.length+1}`),label:C,icon:P,kind:"custom",enabled:!0,order:S.length}])},{label:"Add Tab",className:"ls-btn-sm ls-btn-primary"})),x.append(A),x};i.append(g("Floating HUD Widget Tabs","widgetTabs",a.surfaces.widgetTabs),g("Inline Message Ribbon Tabs","inlineTabs",a.surfaces.inlineTabs))}else if(Rt==="dossier"){let r=e("section","ls-card");r.append(e("h3","","Character Dossier Tabs"));let d=[...a.surfaces.dossierTabs].sort((f,x)=>f.order-x.order);d.forEach((f,x)=>{let L=e("div","ls-stat-cell"),T=e("div","ls-row-between"),A=e("div","ls-row"),w=(u)=>{s((l)=>{let m=[...l.surfaces.dossierTabs].sort((b,I)=>b.order-I.order);return{surfaces:{...l.surfaces,dossierTabs:u(m)}}})},h=e("div");me(t,n,h,{checked:f.enabled,onChange:(u)=>{w((l)=>l.map((m)=>m.id===f.id?{...m,enabled:u}:m))}});let C=e("input","ls-input");C.style.cssText="width:44px;min-height:28px;padding:2px 6px;",C.value=f.icon,C.addEventListener("change",()=>{let u=C.value.trim()||"\uD83E\uDEAA";w((l)=>l.map((m)=>m.id===f.id?{...m,icon:u}:m))});let P=e("input","ls-input");P.style.cssText="width:150px;min-height:28px;padding:2px 8px;",P.value=f.label,P.addEventListener("change",()=>{let u=P.value.trim()||f.label;w((l)=>l.map((m)=>m.id===f.id?{...m,label:u}:m))}),A.append(h,C,P);let S=e("div","ls-row");if(x>0)S.append(N("↑",()=>{w((u)=>{let l=u.findIndex((b)=>b.id===f.id);if(l<=0)return u;let m=[...u];return[m[l-1],m[l]]=[m[l],m[l-1]],m.map((b,I)=>({...b,order:I}))})},"ls-btn-sm ls-btn-icon ls-btn-ghost"));if(x<d.length-1)S.append(N("↓",()=>{w((u)=>{let l=u.findIndex((b)=>b.id===f.id);if(l<0||l>=u.length-1)return u;let m=[...u];return[m[l],m[l+1]]=[m[l+1],m[l]],m.map((b,I)=>({...b,order:I}))})},"ls-btn-sm ls-btn-icon ls-btn-ghost"));if(d.length>1)S.append(ee("trash",()=>w((u)=>u.filter((l)=>l.id!==f.id)),{className:"ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger",title:"Delete dossier tab"}));T.append(A,S),L.append(T);let y=e("div","ls-row");for(let[u,l]of[["showMeters","Meters"],["showNpcBonds","Peer Bonds"],["showFields","Fields"],["showSecrets","Secrets"],["showAudit","Audit Log"]]){let m=e("div");xe(t,n,m,{checked:Boolean(f[u]),label:l,onChange:(b)=>{w((I)=>I.map((c)=>c.id===f.id?{...c,[u]:b}:c))}}),y.append(m)}L.append(y),r.append(L)});let g=e("div","ls-row"),v=e("input","ls-input");v.style.width="50px",v.value="⚔️";let M=e("input","ls-input");M.style.flex="1",M.placeholder="New Dossier Tab (e.g. Combat Arts, Wardrobe)…",g.append(v,M,ee("plus",()=>{let f=M.value.trim();if(!f)return;let x=v.value.trim()||"✨";s((L)=>{let T=[...L.surfaces.dossierTabs].sort((w,h)=>w.order-h.order),A={id:re(f,`dtab_${T.length+1}`),label:f,icon:x,kind:"custom",enabled:!0,order:T.length,showMeters:!0,showFields:!0,showSecrets:!1,showAudit:!1,showNpcBonds:!1};return{surfaces:{...L.surfaces,dossierTabs:[...T,A]}}})},{label:"Add Dossier Tab",className:"ls-btn-sm ls-btn-primary"})),r.append(g),i.append(r)}else if(Rt==="matrix"){let r=e("section","ls-card");r.append(e("h3","","Stat Placement Matrix"),e("p","ls-muted","Choose which surfaces and tabs display each stat."));let d=[...a.surfaces.dossierTabs].sort((g,v)=>g.order-v.order);for(let g of a.stats){let v=e("div","ls-stat-cell"),M=e("div","ls-row-between"),f=e("div","ls-row");f.append(ee("copy",()=>Fe(t,g),{label:"Duplicate",className:"ls-btn-sm ls-btn-ghost"}),ee("edit",()=>Ce(t,g.scope,g),{label:"Edit",className:"ls-btn-sm"})),M.append(e("strong","",`${g.icon} ${g.label} (${g.scope})`),f),v.append(M);let x=e("div","ls-row");for(let[w,h]of[["widget","Widget"],["inline","Inline"],["dossier","Dossier"],["pinnedHeader","Pill"]]){let C=e("div");xe(t,n,C,{checked:Boolean(g.showIn?.[w]),label:h,onChange:(P)=>{s((S)=>({stats:S.stats.map((y)=>y.id===g.id?{...y,showIn:{...y.showIn,[w]:P},...w==="pinnedHeader"?{pinnedToHeader:P}:{}}:y)}))}}),x.append(C)}let L=e("div");J(t,n,L,{value:g.widgetTabId||(g.scope==="character"?"cast":"stats"),compact:!0,ariaLabel:"Widget Tab",options:a.surfaces.widgetTabs.map((w)=>({value:w.id,label:`Widget: ${w.label}`})),onChange:(w)=>{s((h)=>({stats:h.stats.map((C)=>C.id===g.id?{...C,widgetTabId:w}:C)}))}});let T=e("div");J(t,n,T,{value:g.inlineTabId||(g.scope==="character"?"cast":"stats"),compact:!0,ariaLabel:"Inline Tab",options:a.surfaces.inlineTabs.map((w)=>({value:w.id,label:`Inline: ${w.label}`})),onChange:(w)=>{s((h)=>({stats:h.stats.map((C)=>C.id===g.id?{...C,inlineTabId:w}:C)}))}});let A=e("div");J(t,n,A,{value:g.dossierTabId||"bonds",compact:!0,ariaLabel:"Dossier Tab",options:d.map((w)=>({value:w.id,label:`Dossier: ${w.label}`})),onChange:(w)=>{s((h)=>({stats:h.stats.map((C)=>C.id===g.id?{...C,dossierTabId:w}:C)}))}}),x.append(L,T,A),v.append(x),r.append(v)}i.append(r)}else{let r=e("section","ls-card"),d=e("div","ls-row-between");d.append(e("h3","","Scene Pill Chips & Custom HTML Banners"),N("Edit Scene Pill Prompts",()=>Ae(t),"ls-btn-sm ls-btn-primary")),r.append(d,e("p","ls-muted","Custom banners support {{location}}, {{time}}, {{date}}, {{weather}}, {{player_attire}}, {{name}}, and {{stat:id}}."));let g=e("div","ls-grid");for(let[x,L]of[["time","Time Chip"],["date","Date Chip"],["location","Location Chip"],["weather","Weather Chip"],["cast","Present Cast Chips"],["pinnedStats","Pinned Stat Chips"]]){let T=e("div");xe(t,n,T,{checked:a.theme.showSceneChips[x],label:L,onChange:(A)=>{s((w)=>({theme:{...w.theme,showSceneChips:{...w.theme.showSceneChips,[x]:A}}}))}}),g.append(T)}r.append(g);let v=e("textarea","ls-input");v.rows=2,v.placeholder="Custom Widget HTML Banner…",v.value=a.surfaces.customWidgetHtml||"";let M=e("textarea","ls-input");M.rows=2,M.placeholder="Custom Inline Ribbon HTML Banner…",M.value=a.surfaces.customInlineHtml||"";let f=e("textarea","ls-input");f.rows=2,f.placeholder="Custom Character Dossier HTML Banner…",f.value=a.surfaces.customDossierHtml||"",r.append(v,M,f,N("Apply Custom HTML Banners",()=>{s((x)=>({surfaces:{...x.surfaces,customWidgetHtml:v.value.trim(),customInlineHtml:M.value.trim(),customDossierHtml:f.value.trim()}}))},"ls-btn-sm ls-btn-primary")),i.append(r)}return i}function cs(t,n,a,s,o,i){let{state:p}=t.snapshot,r=e("div","ls-stack"),d=t.customTemplates.filter((R)=>!t.builtinTemplates.some((E)=>E.id===R.id)),g=d.length+t.builtinTemplates.length,v=e("section","ls-card"),M=e("div","ls-row-between"),f=e("div");f.append(e("span","ls-kicker","Template Gallery"),e("h3","",`Saved & Built-In Templates (${g})`));let x=e("div","ls-row");x.append(ee("plus",()=>Tt(t,i),{label:"New Template",className:"ls-btn-sm ls-btn-primary"}),N("Import .json",()=>{t.ctx.uploads.pickFile({accept:[".json","application/json"],multiple:!1,maxSizeBytes:2500000}).then(async(R)=>{let E=R[0];if(!E)return;let D=new TextDecoder().decode(E.bytes);await t.request("template:importJson",{json:D}),t.notify(`Imported & activated template from ${E.name}.`)}).catch((R)=>t.notify(R instanceof Error?R.message:String(R),!0))},"ls-btn-sm")),M.append(f,x),v.append(M);let L=(R,E)=>{let D=R.id===a.id,H=e("div","ls-preset-card");H.dataset.active=String(D);let F=e("div","ls-stack");F.style.gap="5px";let j=e("div","ls-row-between");j.append(e("strong","",`${R.icon} ${R.name}`),e("span",`ls-chip ${E?"ls-chip-accent":""}`,E?"Saved Custom":"Built-In"));let O=e("div","ls-row"),W=R.stats.filter((V)=>V.scope==="character").length,K=R.stats.filter((V)=>V.scope!=="character").length;O.append(e("span","ls-chip",`${W} NPC meters`),e("span","ls-chip",`${K} stats`)),F.append(j,e("p","ls-muted",R.description),O);let z=e("div","ls-row");if(D)z.append(e("span","ls-chip ls-chip-accent","✓ Active"));else{let V=N("Activate",()=>{V.disabled=!0,V.textContent="Applying…",t.request("template:apply",{templateId:R.id,template:R}).then(()=>{t.notify(`Activated "${R.name}"!`)}).catch((G)=>{if(t.notify(G instanceof Error?G.message:String(G),!0),V.isConnected)V.disabled=!1,V.textContent="Activate"})},"ls-btn-sm ls-btn-primary");z.append(V)}if(z.append(ee("copy",()=>o(R),{label:"Copy & Edit",className:"ls-btn-sm",title:"Create an editable copy of this template"})),E)z.append(ee("trash",()=>{t.modals.confirm({title:"Delete Saved Template?",message:`Remove "${R.name}" from your Template Library?`,confirmLabel:"Delete",variant:"danger"}).then((V)=>{if(!V)return;t.request("template:deleteFromLibrary",{templateId:R.id}).then(()=>t.notify(`Deleted "${R.name}" from library.`)).catch((G)=>t.notify(G instanceof Error?G.message:String(G),!0))})},{className:"ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger",title:"Delete from library"}));return H.append(F,z),H};if(v.append(e("span","ls-kicker",`Saved Custom Templates (${d.length})`)),d.length>0){let R=e("div","ls-grid");for(let E of d)R.append(L(E,!0));v.append(R)}else v.append(e("p","ls-muted",'No saved custom templates yet. Click "+ New Template", "Save to Library", or "Copy & Edit" on any preset below.'));v.append(e("span","ls-kicker",`Built-In Presets (${t.builtinTemplates.length})`));let T=e("div","ls-grid");for(let R of t.builtinTemplates)T.append(L(R,!1));v.append(T),r.append(v);let A=e("section","ls-card");A.append(e("span","ls-kicker","Display & Prompt Placement"),e("h3","","Where Lumi Stats Appears"));let w=e("div","ls-row");for(let[R,E]of[["both_bottom","HUD + Below Reply"],["both_top","HUD + Above Reply"],["inline_bottom","Below Reply Only"],["floating_only","Floating HUD Only"]]){let D=N(E,()=>{s({theme:{...t.snapshot.template.theme,placement:R}})},"ls-btn-sm");if(a.theme.placement===R)D.setAttribute("aria-current","page");w.append(D)}A.append(w);let h=e("div","ls-row");h.append(e("small","ls-muted","AI Prompt Injection:"));for(let[R,E]of[["pre_history","Before History"],["in_history","Within History"],["post_history","After History"]]){let D=N(E,()=>{s({promptPosition:R},`Set prompt position to ${R}`)},"ls-btn-sm");if((a.promptPosition||"post_history")===R)D.setAttribute("aria-current","page");h.append(D)}if(a.promptPosition==="in_history"){let R=Math.max(0,Math.round(Number(a.promptDepth??1)||0)),E=e("input","ls-input");E.type="number",E.min="0",E.max="20",E.style.cssText="width:68px;min-height:26px;padding:2px 6px;",E.value=String(R),E.addEventListener("change",()=>{let D=Math.max(0,Math.min(20,Math.round(Number(E.value)||0)));s({promptDepth:D})}),h.append(e("small","ls-muted","Depth:"),E)}A.append(h),r.append(A);let C=e("div");r.append(C);let P=fe(t,n,C,{title:"Appearance, Skins, Frame Shapes & Widget Size",iconName:"palette",defaultExpanded:!1,persistKey:"studio_templates_skin"}),S=e("div","ls-row");S.append(e("small","ls-muted","1-Click Skins:"));for(let R of Vt){let E=N(R.name,()=>t.applySkinPack(R),"ls-btn-sm");if((a.theme.surfaceStyle||"glass")===R.surfaceStyle)E.setAttribute("aria-current","page");S.append(E)}S.append(N("Import Skin",()=>{t.ctx.uploads.pickFile({accept:[".json","application/json"],multiple:!1,maxSizeBytes:500000}).then((R)=>{let E=R[0];if(!E)return;let D=JSON.parse(new TextDecoder().decode(E.bytes));t.applySkinPack(D)})},"ls-btn-sm ls-btn-ghost"),N("Export Skin",()=>{let R=Sa(a),E=new Blob([JSON.stringify(R,null,2)],{type:"application/json"}),D=URL.createObjectURL(E),H=document.createElement("a");H.href=D,H.download=`${re(a.name,"lumi_skin")}.lumi-skin.json`,document.body.append(H),H.click(),H.remove(),URL.revokeObjectURL(D)},"ls-btn-sm ls-btn-ghost")),P.append(S);let y=e("div","ls-row-between ls-stat-cell");y.append(e("strong","","Collapsed Pill Skin (10 Designs)"));let u=e("div");u.style.minWidth="230px",y.append(u),J(t,n,u,{value:a.theme.pillStyle||"glass_capsule",ariaLabel:"Collapsed Pill Skin",options:[{value:"glass_capsule",label:"✨ Frosted Split Capsule (Default Best)"},{value:"vn_dialogue_bar",label:"\uD83C\uDFAC VN Cinema Strip"},{value:"rpg_status_bar",label:"⚔️ JRPG Party Status Bar"},{value:"persona_ticker",label:"\uD83C\uDCCF Stylish Pop Ticker"},{value:"cyber_telemetry",label:"\uD83D\uDEF8 Cyber Telemetry"},{value:"minimal_floating",label:"☁️ Minimal Ghost Pill"},{value:"neon_edge",label:"⚡ Neon Glow Rail"},{value:"split_deck",label:"\uD83D\uDDC2️ Dual-Deck Card Pill"},{value:"compact_badge",label:"\uD83D\uDCF1 Micro Compact Badge"},{value:"ledger_strip",label:"\uD83D\uDCDC Editorial Case Strip"}],onChange:(R)=>{s({theme:{...t.snapshot.template.theme,pillStyle:R}})}}),P.append(y);let l=e("div","ls-row");l.append(e("small","ls-muted","Base Surface:"));for(let[R,E]of[["glass","Auto Glass"],["soft","Soft Card"],["sleek","Sleek Dark"],["minimal","Minimal"],["neon","Neon"],["arcane_rpg","Arcane RPG"],["cyber_hud","Cyber HUD"],["persona_pop","Pop Sim"],["cozy_vn","Cozy VN"]]){let D=N(E,()=>{s({theme:{...t.snapshot.template.theme,surfaceStyle:R}})},"ls-btn-sm");if((a.theme.surfaceStyle||"glass")===R)D.setAttribute("aria-current","page");l.append(D)}let m=e("div","ls-row");m.append(e("small","ls-muted","Frame & Bars:"));for(let[R,E]of[["rounded","Rounded"],["chamfered","Angled"],["ornate","Ornate"],["sharp","Sharp"]]){let D=N(E,()=>{s({theme:{...t.snapshot.template.theme,frameShape:R}})},"ls-btn-sm");if((a.theme.frameShape||"rounded")===R)D.setAttribute("aria-current","page");m.append(D)}for(let[R,E]of[["smooth","Gradient Bar"],["segmented","Segmented Bar"],["glow","Neon Glow Bar"]]){let D=N(E,()=>{s({theme:{...t.snapshot.template.theme,meterStyle:R}})},"ls-btn-sm");if((a.theme.meterStyle||"smooth")===R)D.setAttribute("aria-current","page");m.append(D)}let b=e("div","ls-row");b.append(e("small","ls-muted","Accent Color:"));for(let[R,E]of[[void 0,"Theme Default"],[198,"Cyan"],[330,"Rose"],[38,"Gold"],[158,"Emerald"],[262,"Violet"],[350,"Crimson"]]){let D=N(E,()=>{s({theme:{...t.snapshot.template.theme,accentHue:R}})},"ls-btn-sm");if(a.theme.accentHue===R)D.setAttribute("aria-current","page");b.append(D)}let I=e("div","ls-grid"),c=(R,E,D,H,F)=>{let j=e("label","ls-label",R),O=e("input","ls-input");return O.type="number",O.min=String(D),O.max=String(H),O.value=String(E),O.addEventListener("change",()=>{F(Math.max(D,Math.min(H,Number(O.value)||E)))}),j.append(O),j};I.append(c("Widget Width (px)",a.theme.widgetWidth??460,240,1200,(R)=>{let E=t.snapshot.template.theme;if(s({theme:{...E,widgetWidth:R}}),t.widgetExpanded)t.onResizeWidgetLive?.(R,E.widgetHeight??540,!1)}),c("Widget Height (px)",a.theme.widgetHeight??540,180,900,(R)=>{let E=t.snapshot.template.theme;if(s({theme:{...E,widgetHeight:R}}),t.widgetExpanded)t.onResizeWidgetLive?.(E.widgetWidth??460,R,!1)}),c("Pill Width (px)",a.theme.pillWidth??420,220,960,(R)=>{let E=t.snapshot.template.theme;if(s({theme:{...E,pillWidth:R}}),!t.widgetExpanded)t.onResizeWidgetLive?.(R,E.pillHeight??92,!1)}));let k=e("div","ls-grid");for(let[R,E,D]of[["Frosted Glass Blur",a.theme.glassBlur!==!1,(H)=>s({theme:{...t.snapshot.template.theme,glassBlur:H}})],["Compact Card Density",Boolean(a.theme.compact),(H)=>s({theme:{...t.snapshot.template.theme,compact:H}})],["Expand Inline Ribbon by Default",Boolean(a.theme.inlineDefaultExpanded),(H)=>{t.inlineExpanded=H,s({theme:{...t.snapshot.template.theme,inlineDefaultExpanded:H}})}],["Icon-Only Widget Tabs",Boolean(a.theme.widgetTabsIconOnly),(H)=>s({theme:{...t.snapshot.template.theme,widgetTabsIconOnly:H}})],["All Cast Cards Expanded",(a.theme.castLayout||"roster")==="cards",(H)=>s({theme:{...t.snapshot.template.theme,castLayout:H?"cards":"roster"}})]]){let H=e("div");xe(t,n,H,{checked:E,label:R,onChange:D}),k.append(H)}P.append(l,m,b,I,k);let _=e("div");return r.append(_),fe(t,n,_,{title:"Canon Story Premise (Optional Turn-1 Setup)",iconName:"edit",badge:p.canonPremise?"Set":void 0,defaultExpanded:Boolean(p.canonPremise),persistKey:"studio_templates_premise"}).append(e("p","ls-muted",p.canonPremise||"No custom premise set. Lumi Stats automatically calibrates from your Character Card, Persona, and Opening Message on Turn 1."),N("Open Full-Screen Premise Editor",()=>{t.request("textEditor:open",{title:"Canon Story Premise (Lumi Stats)",value:p.canonPremise||"",placeholder:"Write established relationships, roles, or world rules…"}).then((R)=>{if(!R.cancelled&&typeof R.text==="string")t.request("state:mutate",{stateOverride:{canonPremise:R.text.trim()},reason:"Updated canon premise"})})},"ls-btn-sm ls-btn-primary")),r}var Ee="quickstart",Nt="hud",_e=!1,ve=null,on="",Qe=null;function Ks(t,n){let a=t.toLowerCase().replace(/[^a-z0-9_-]+/g,"_")||"lumi_stats_template",s=new Blob([JSON.stringify(n,null,2)],{type:"application/json"}),o=URL.createObjectURL(s),i=document.createElement("a");i.href=o,i.download=`${a}.lumi-stats.json`,document.body.append(i),i.click(),i.remove(),URL.revokeObjectURL(o)}function Wn(t){if(Qe)Qe.cleanup(),Qe=null;_e=!1,ve=null,on=t.snapshot.template.id,t.request("snapshot:get").catch(()=>{return});let n=new ze;if(typeof t.ctx.ui?.mountApp==="function")try{let a=t.ctx.ui.mountApp({className:"ls-studio-mount",position:"app-overlay"});a.setVisible(!0),Gs(t,a,n);return}catch(a){console.warn("[LumiStats Studio] mountApp error, using modal fallback:",a),n.clear()}Zs(t)}function Gs(t,n,a){console.log("[LumiStats Studio] setupAppOverlay: mounting full-window Studio via mountApp"),t.studioOpen=!0,t.emitChange();let s=()=>{if(!Qe)return;_e=!1,ve=null;let g=Qe;Qe=null,t.activeOverlayCleanup=null,t.studioOpen=!1,t.emitChange(),g.cleanup()},o=(g)=>{if(g.key!=="Escape")return;if(g.defaultPrevented||t.modals.hasOpenModals()||document.body.querySelector('.ls-dd-menu[data-ls-dd-open="true"]'))return;s()};window.addEventListener("keydown",o);let i=(g=!1)=>{Mn(n.root,()=>{a.clear();let v=[];n.root.replaceChildren(ds(t,a,s,!0,()=>i(!0),v));for(let M of v)M()},{deferIfTyping:!g,onDeferredFlush:()=>i(!0)})},p=t.subscribe(()=>i(!1)),r=t.subscribeStatus(()=>{let g=n.root.querySelector("[data-ls-studio-status]");if(g)g.textContent=t.statusText,g.style.display=t.statusText?"":"none",g.style.color=t.statusError?"var(--ls-danger)":"var(--ls-muted)"});i(!0),Qe={mount:n,cleanup:()=>{window.removeEventListener("keydown",o),p(),r(),a.clear(),n.destroy()}},t.activeOverlayCleanup=s}function Zs(t){t.modals.open({title:"Lumi Stats Studio",width:1360,maxHeight:900},(n,a,s,o)=>{n.style.cssText+=";padding:0;overflow:hidden;display:flex;flex-direction:column;height:85vh;max-height:880px;container-type:inline-size;";let i=(d=!1)=>{Mn(n,()=>{o.clear();let g=[];n.replaceChildren(ds(t,o,a,!1,()=>i(!0),g));for(let v of g)v()},{deferIfTyping:!d,onDeferredFlush:()=>i(!0)})};i(!0);let p=t.subscribe(()=>i(!1)),r=t.subscribeStatus(()=>{let d=n.querySelector("[data-ls-studio-status]");if(d)d.textContent=t.statusText,d.style.display=t.statusText?"":"none",d.style.color=t.statusError?"var(--ls-danger)":"var(--ls-muted)"});s.onDismiss(()=>{_e=!1,ve=null,p(),r()})})}function ds(t,n,a,s,o,i=[]){let{template:p}=t.snapshot,r=structuredClone(p);if(on!==r.id)on=r.id,_e=!1,ve=null;let d=t.builtinTemplates.some((m)=>m.id===r.id),g=(m,b="Updated template")=>{let I=structuredClone(t.snapshot.template),c=typeof m==="function"?m(I):m,k={...c,...c.theme?{theme:{...I.theme,...c.theme}}:{},...c.surfaces?{surfaces:{...I.surfaces,...c.surfaces}}:{}};t.request("state:mutate",{templatePatch:k,reason:b}).catch((_)=>t.notify(_ instanceof Error?_.message:String(_),!0))},v=(m,b)=>{let I=b?.trim()||`${m.name} (Custom)`;t.request("template:duplicate",{sourceTemplateId:m.id,template:m,name:I,icon:m.icon,description:m.description}).then((c)=>{let k=c.template??t.snapshot.template;on=k.id,_e=!0,ve={icon:k.icon,name:k.name,description:k.description},t.notify(`Created & activated editable copy "${k.name}"!`),o()}).catch((c)=>t.notify(c instanceof Error?c.message:String(c),!0))},M=e("div",s?"ls-studio-overlay":"ls-studio-overlay ls-studio-in-modal");t.stampThemeOnElement(M);let f=e("header","ls-studio-topbar"),x=e("div","ls-row");x.append(e("span","ls-brand-mark","L"),e("strong","","Lumi Stats Studio"),e("span","ls-chip ls-chip-accent",`${r.icon} ${r.name}`),e("span","ls-chip",d?"Built-In":"Custom"));let L=e("span","ls-chip",t.statusText);if(L.setAttribute("data-ls-studio-status","true"),!t.statusText)L.style.display="none";if(t.statusError)L.style.color="var(--ls-danger)";let T=e("div","ls-row");T.append(L,ee("plus",()=>Tt(t,o),{label:"New",className:"ls-btn-sm",title:"Create a new template"}),N("Save to Library",()=>{let m=t.snapshot.template;t.request("template:saveToLibrary",{name:m.name,icon:m.icon,description:m.description}).then(()=>t.notify(`Saved "${m.name}" to your Template Library.`)).catch((b)=>t.notify(b instanceof Error?b.message:String(b),!0))},"ls-btn-sm ls-btn-primary"),N("Export",()=>Ks(r.name,r),"ls-btn-sm"),ee("close",a,{label:"Close",className:"ls-btn-sm ls-btn-danger",title:"Close Studio (Esc)"})),f.append(x,T),M.append(f);let A=e("div","ls-studio-workspace"),w=e("nav","ls-studio-sidebar"),h=[{id:"quickstart",title:"1. Templates & Look",sub:"Presets, placement & skin"},{id:"stats",title:"2. Stats & Built-Ins",sub:"Meters, Scene Pill & prompts"},{id:"extreme",title:"3. Tabs & Surfaces",sub:"HUD, Inline & Dossier layout"},{id:"stage_assets",title:"4. Stage Sprites",sub:"Sprites & time backdrops"},{id:"prose",title:"5. Prose & Cipher",sub:"Braille cleaner & word cipher"},{id:"engine",title:"6. AI & Connections",sub:"Models, Cortex & debug"}];for(let m of h){let b=e("button","ls-studio-nav-btn");if(b.type="button",Ee===m.id)b.setAttribute("aria-current","page");b.append(e("span","ls-studio-nav-title",m.title),e("span","ls-studio-nav-sub",m.sub)),b.addEventListener("click",()=>{Ee=m.id,o()}),w.append(b)}A.append(w);let C=e("main","ls-studio-pane");if(Ee==="quickstart"||Ee==="stats"||Ee==="extreme"){let m=e("section","ls-hero-banner"),b=e("div","ls-row-between"),I=e("div");I.append(e("span","ls-kicker",d?"Built-In Preset":"Custom Saved Template"),e("h2","",`${r.icon} ${r.name}`),e("p","ls-muted",r.description));let c=e("div","ls-row");if(c.append(ee("copy",()=>v(r),{label:"Duplicate & Edit",className:"ls-btn-sm ls-btn-primary"}),ee("edit",()=>{_e=!_e,ve=_e?{icon:r.icon,name:r.name,description:r.description}:null,o()},{label:_e?"Hide Rename":"Rename",className:"ls-btn-sm"})),b.append(I,c),m.append(b),_e){ve??={icon:r.icon,name:r.name,description:r.description};let k=e("div","ls-grid"),_=e("label","ls-label","Icon Emoji"),B=e("input","ls-input");B.value=ve.icon,B.addEventListener("input",()=>{if(ve)ve.icon=B.value}),_.append(B);let R=e("label","ls-label","Template Name"),E=e("input","ls-input");E.value=ve.name,E.addEventListener("input",()=>{if(ve)ve.name=E.value}),R.append(E);let D=e("label","ls-label","Description"),H=e("input","ls-input");H.value=ve.description,H.addEventListener("input",()=>{if(ve)ve.description=H.value}),D.append(H),k.append(_,R,D);let F=N("Save Template Name & Info",()=>{let j=E.value.trim()||r.name,O=B.value.trim()||"✨",W=H.value.trim()||r.description;F.disabled=!0,F.textContent="Saving…",t.request("template:saveToLibrary",{name:j,icon:O,description:W}).then(()=>{_e=!1,ve=null,t.notify(`Saved template "${j}".`),o()}).catch((K)=>{if(t.notify(K instanceof Error?K.message:String(K),!0),F.isConnected)F.disabled=!1,F.textContent="Save Template Name & Info"})},"ls-btn-sm ls-btn-primary");m.append(k,F)}C.append(m)}if(Ee==="quickstart")C.append(cs(t,n,r,g,v,o));else if(Ee==="stats")C.append(is(t,n,r,g,o));else if(Ee==="extreme")C.append(ls(t,n,r,g,o));else if(Ee==="stage_assets")C.append(Qa(t,o));else if(Ee==="prose")C.append(ss(t,n));else if(Ee==="engine")C.append(rs(t,n,i));A.append(C);let P=e("aside","ls-studio-preview-pane"),S=e("section","ls-card"),y=e("div","ls-row-between");y.append(e("span","ls-kicker","Live Preview"));let u=e("div","ls-row");for(let[m,b]of[["hud","HUD"],["pill","Pill"],["inline","Inline"],["dossier","Dossier"]]){let I=N(b,()=>{Nt=m,o()},"ls-btn-sm");if(Nt===m)I.setAttribute("aria-current","page");u.append(I)}y.append(u),S.append(y);let l=e("div");if(l.style.marginTop="6px",Nt==="hud")l.style.height="470px",l.append(bt(t,!1,()=>{return},(m)=>Xe(t,m),()=>{return},n));else if(Nt==="pill")l.style.height="104px",l.append(bt(t,!0,()=>{return},(m)=>Xe(t,m),()=>{return},n));else if(Nt==="inline"){let m=t.inlineExpanded;t.inlineExpanded=!0;let b=es(t,(I)=>Xe(t,I),()=>{return});t.inlineExpanded=m,l.append(b)}else{let m=t.dossierEditMode;t.dossierEditMode=!1;let b=On(t,n);t.dossierEditMode=m,l.append(b)}return S.append(l),P.append(S),A.append(P),M.append(A),M}function ps(t,n,a,s){try{let o=new ze,i=n.snapshot.template.theme,p=()=>({w:Math.max(240,Math.min(1200,n.snapshot.template.theme.widgetWidth??460)),h:Math.max(180,Math.min(900,n.snapshot.template.theme.widgetHeight??540))}),r=()=>({w:Math.max(220,Math.min(960,n.snapshot.template.theme.pillWidth??420)),h:Math.max(56,Math.min(220,n.snapshot.template.theme.pillHeight??92))}),d=t.ui.createFloatWidget({width:s?.width??(i.pillWidth??420),height:s?.height??(i.pillHeight??92),chromeless:s?.chromeless??!0,snapToEdge:!0,tooltip:"Lumi Stats HUD",touchScrollMode:"native"});d.root.classList.add("ls-root"),d.root.style.cssText+=";display:flex;flex-direction:column;height:100%;max-height:100%;min-height:0;overflow:hidden;background:transparent;",n.onResizeWidgetLive=(T,A,w)=>{if(d.setSize(T,A),w){let h=n.snapshot.template.theme;n.request("state:mutate",{templatePatch:{theme:n.widgetExpanded?{...h,widgetWidth:T,widgetHeight:A}:{...h,pillWidth:T,pillHeight:A}},reason:`Resized widget to ${T}×${A}`})}};let g=null,v=()=>{if(g)clearTimeout(g),g=null;if(n.widgetExpanded=!n.widgetExpanded,!!n.widgetExpanded){let{w:A,h:w}=p();d.setSize(A,w)}else{let{w:A,h:w}=r();g=setTimeout(()=>{d.setSize(A,w),g=null},180)}f()},M="",f=()=>{o.clear();let T=n.snapshot.template.theme.placement,A=!n.vnStageOpen&&!n.studioOpen&&(T==="floating_only"||T.startsWith("both_"));d.setVisible(A),n.stampThemeOnElement(d.root);let w=bt(n,!n.widgetExpanded,v,(h)=>Xe(n,h),a,o);if(d.root.replaceChildren(w),!n.widgetExpanded&&!g&&A){let h=Boolean(w.querySelector('.ls-hud-pill[data-empty-deck="true"]')),{w:C,h:P}=r(),S=h?Math.min(P,48):P,y=`${C}x${S}`;if(y!==M)M=y,d.setSize(C,S)}else M="";n.applyTemplateThemeToDom()},x=(T)=>{let A=T.detail;if(A?.extensionId&&A.extensionId!=="lumi_stats")return;n.refreshActiveChat(),f()};window.addEventListener("spindle:desktop-widget-returned",x);let L=n.subscribe(f);return f(),()=>{if(window.removeEventListener("spindle:desktop-widget-returned",x),g)clearTimeout(g);n.onResizeWidgetLive=null,L(),o.clear(),d.destroy()}}catch{return}}function Pi(t,n){t.deferReady?.();let a=[];a.push(Ra(t));let s=new Ln(t);a.push(()=>s.destroy());let o=ps(t,s,()=>Wn(s),n);if(o)a.push(o);return a.push(t.events.on("CHAT_SWITCHED",(i)=>{let p=i&&typeof i==="object"?i:{},r=typeof p.chatId==="string"?p.chatId:null;s.refreshActiveChat(r)})),s.refreshActiveChat(),t.ready?.(),()=>{for(let i of a.reverse())i();t.dom.cleanup()}}export{Pi as setupWidget};
