import {
  formatSceneBanner,
  formatStoryClock,
  parseStatTokens,
  resolveAnchorLabel,
} from './formula';
import { slugifyKey } from './templates';
import type {
  CampaignState,
  CharacterRecord,
  LumiStatsTemplate,
  StatCategoryDef,
  StatSchemaDef,
} from './types';

export interface StoryGroundingContext {
  characterCard?: {
    name: string;
    description: string;
    personality: string;
    scenario: string;
    firstMessage?: string;
  };
  persona?: {
    name: string;
    description: string;
  };
  openingUserMessage?: string;
}

export function resolveCharacterFieldValue(actor: CharacterRecord, fieldId: string): string {
  const explicit = actor.fields[fieldId];
  if (explicit && explicit.trim()) return explicit.trim();
  if (fieldId === 'role_summary') return actor.roleSummary || '';
  if (fieldId === 'demeanor') return actor.demeanor || '';
  if (fieldId === 'inner_thought') return actor.innerThought || '';
  if (fieldId === 'immediate_goal') return actor.immediateGoal || '';
  if (fieldId === 'attire_layers') return actor.attire || '';
  return '';
}

export function isDossierFieldEnabled(template: LumiStatsTemplate, fieldId: string): boolean {
  const found = template.dossierFields.find(f => f.id === fieldId);
  return found ? found.enabled : false;
}

export function buildFlatChatVariablesMap(
  state: CampaignState,
  template: LumiStatsTemplate,
): Record<string, string> {
  const banner = formatSceneBanner(state);
  const vars: Record<string, string> = {
    lumi_turn: String(state.turnCount),
    lumi_minute: String(state.elapsedMinutes),
    lumi_clock: formatStoryClock(state.elapsedMinutes),
    lumi_header: banner.formatted,
    lumi_location: banner.location,
    lumi_scene_location: banner.location,
    lumi_scene_time: banner.time,
    lumi_scene_date: banner.date,
    lumi_scene_weather: banner.weather,
    lumi_scene_summary: state.scene.beatSummary || '',
    lumi_player_attire: state.player.attire || '',
    lumi_player_condition: state.player.condition || '',
    lumi_player_action: state.player.notableAction || '',
  };

  for (const schema of template.stats.filter(s => s.enabled && s.scope !== 'character')) {
    const rec = state.stats[schema.id];
    const effectiveValue = rec !== undefined ? rec.value : schema.defaultValue;
    vars[`lumi_stat_${schema.id}`] = String(effectiveValue);
  }

  const charSchemas = template.stats.filter(s => s.enabled && s.scope === 'character');
  const enabledFields = template.dossierFields.filter(f => f.enabled);
  for (const [actorId, actor] of Object.entries(state.characters)) {
    vars[`lumi_char_${actorId}_name`] = actor.name;
    vars[`lumi_char_${actorId}_present`] = actor.present ? 'true' : 'false';
    vars[`lumi_char_${actorId}_role`] = resolveCharacterFieldValue(actor, 'role_summary');
    vars[`lumi_char_${actorId}_bond_to_you`] = actor.bondToPlayer?.label || resolveCharacterFieldValue(actor, 'role_summary');
    vars[`lumi_char_${actorId}_your_bond`] = actor.bondFromPlayer?.label || '';
    vars[`lumi_char_${actorId}_demeanor`] = resolveCharacterFieldValue(actor, 'demeanor');
    vars[`lumi_char_${actorId}_attire`] = resolveCharacterFieldValue(actor, 'attire_layers');
    vars[`lumi_char_${actorId}_goal`] = resolveCharacterFieldValue(actor, 'immediate_goal');
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

export function buildLeanSidecarStateSnapshot(
  state: CampaignState,
  template: LumiStatsTemplate,
  recentTranscriptText = '',
): Record<string, unknown> {
  const recentLower = recentTranscriptText.toLowerCase();
  const calibratedStats: Record<string, number | string | boolean> = {};
  const uncalibratedStats: string[] = [];

  for (const s of template.stats) {
    if (!s.enabled || s.scope === 'character') continue;
    const rec = state.stats[s.id];
    if (rec?.calibrated) {
      calibratedStats[s.id] = rec.value;
    } else {
      uncalibratedStats.push(s.id);
    }
  }

  const charSchemas = template.stats.filter(s => s.enabled && s.scope === 'character');
  const enabledFields = template.dossierFields.filter(f => f.enabled);

  const characters = Object.values(state.characters).map(c => {
    const mentionedRecently =
      Boolean(recentLower) &&
      (recentLower.includes(c.name.toLowerCase()) ||
        c.aliases.some(a => a && recentLower.includes(a.toLowerCase())));
    const hasUncalibrated = charSchemas.some(s => !c.meters[s.id]?.calibrated);

    if (!c.present && !mentionedRecently && !hasUncalibrated) {
      const compactOffscreenMeters: Record<string, number | string | boolean> = {};
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
        ...(Object.keys(compactOffscreenMeters).length ? { meters: compactOffscreenMeters } : {}),
      };
    }

    const meters: Record<string, number | string | boolean> = {};
    const uncalibratedMeters: string[] = [];
    for (const s of charSchemas) {
      const m = c.meters[s.id];
      if (m?.calibrated) {
        meters[s.id] = m.value;
      } else {
        uncalibratedMeters.push(s.id);
      }
    }

    const activeFields: Record<string, string> = {};
    for (const f of enabledFields) {
      const val = resolveCharacterFieldValue(c, f.id);
      if (val) activeFields[f.id] = val;
    }

    const peerBonds = Object.values(c.peerBonds ?? {}).map(b => ({
      target: b.toName,
      label: b.label,
      ...(b.attitude ? { attitude: b.attitude } : {}),
      ...b.meters,
    }));

    return {
      id: c.id,
      name: c.name,
      present: c.present,
      ...(c.bondToPlayer ? { bondToPlayer: c.bondToPlayer.label } : {}),
      ...(c.bondFromPlayer ? { bondFromPlayer: c.bondFromPlayer.label } : {}),
      ...(Object.keys(activeFields).length ? { fields: activeFields } : {}),
      meters,
      ...(uncalibratedMeters.length ? { uncalibratedMeters } : {}),
      ...(peerBonds.length ? { peerBonds } : {}),
    };
  });

  return {
    turnCount: state.turnCount,
    elapsedMinutes: state.elapsedMinutes,
    scene: state.scene,
    player: state.player,
    stats: calibratedStats,
    ...(uncalibratedStats.length ? { uncalibratedStats } : {}),
    characters,
  };
}

const DEFAULT_FIELD_IDS = new Set([
  'role_summary',
  'demeanor',
  'inner_thought',
  'immediate_goal',
  'attire_layers',
  'carried_items',
  'bond_dynamic',
]);

export function isTextLikeStat(s: StatSchemaDef): boolean {
  if (
    ['text', 'tags', 'tier', 'skill_tree', 'xp_level', 'attributes', 'inventory', 'status_fx'].includes(
      s.kind,
    )
  ) {
    return true;
  }
  if (s.displayStyle && s.displayStyle !== 'auto') return true;
  return /\[[^\]]*\]|->|→|\b(?:format|write\s+in|write\s+this|saw\/heard|impulse\s*:)\b/i.test(
    s.triggerCues,
  );
}

function compactContinuityTextValue(statId: string, rawVal: string, maxLen: number): string {
  let txt = rawVal.replace(/\s+/g, ' ').trim();
  if (!txt) return txt;
  // Strip verbose conditional prompt scaffolding from plan values in narrator continuity
  if (statId === 'plan' || statId.endsWith('_plan')) {
    txt = txt
      .replace(/\s*→\s*If welcomed\/works:[\s\S]*$/i, '')
      .replace(/\s*\|\s*If declined\/changed:[\s\S]*$/i, '')
      .trim();
  }
  if (txt.length <= maxLen) return txt;
  const sliced = txt.slice(0, maxLen);
  const cut = Math.max(sliced.lastIndexOf(' | '), sliced.lastIndexOf(' '), 0);
  return `${(cut > maxLen * 0.5 ? sliced.slice(0, cut) : sliced).trim()}…`;
}

export function compileNarratorContinuity(
  state: CampaignState,
  template: LumiStatsTemplate,
  charBudget = 2400,
): { text: string; omittedCount: number } {
  const core = template.coreTrackers;
  const trackPlayerAttire = core?.trackPlayerAttire !== false;
  const trackPlayerCondition = core?.trackPlayerCondition !== false;
  const catMap = new Map((template.categories ?? []).map(c => [c.id, c]));
  const isContinuityStatEnabled = (s: StatSchemaDef) => {
    if (!s.enabled || s.injectInContinuity === false) return false;
    if (s.categoryId) {
      const cat = catMap.get(s.categoryId);
      if (cat && (!cat.enabled || cat.injectInContinuity === false)) return false;
    }
    return true;
  };
  const nonCharSchemas = template.stats.filter(
    s => s.scope !== 'character' && isContinuityStatEnabled(s),
  );

  const hasPlayerCondition =
    trackPlayerCondition && Boolean(state.player.condition && state.player.condition !== 'Normal');
  const hasPlayerAttire = trackPlayerAttire && Boolean(state.player.attire);
  const hasCharacters = Object.keys(state.characters).length > 0;
  const hasPlaces = core?.trackPlaces !== false && Object.keys(state.places).length > 0;
  const hasActiveQuests =
    core?.trackQuests !== false && Object.values(state.quests).some(q => q.status === 'active');

  const activeContinuityCategoryRules = [...(template.categories ?? [])]
    .sort((a, b) => a.order - b.order)
    .filter(cat => {
      if (!cat.enabled || cat.injectInContinuity === false || cat.promptTriggerMode === 'manual') {
        return false;
      }
      if (!cat.aiRule?.trim()) return false;
      return template.stats.some(s => s.enabled && s.categoryId === cat.id);
    })
    .map(cat => {
      const members = template.stats
        .filter(s => s.enabled && s.categoryId === cat.id)
        .map(s => s.id);
      const formattedRule = cat.aiRule!.replace(/\n{3,}/g, '\n\n').trim();
      return `[${cat.name}] (governs: ${members.join(', ')}):\n${formattedRule}`;
    });

  const calibratedNonChar = nonCharSchemas.filter(s => state.stats[s.id]?.calibrated);
  if (
    !state.initialized &&
    !hasCharacters &&
    !hasPlaces &&
    !hasActiveQuests &&
    !hasPlayerAttire &&
    !hasPlayerCondition &&
    calibratedNonChar.length === 0 &&
    activeContinuityCategoryRules.length === 0
  ) {
    return { text: '', omittedCount: 0 };
  }

  const buildWithTextCap = (textCap: number, compactMode: boolean): string[] => {
    const playerStatParts: string[] = [];
    const worldStatParts: string[] = [];

    for (const s of calibratedNonChar) {
      const rec = state.stats[s.id]!;
      if (compactMode && (rec.value === 'None' || rec.value === '' || rec.value === 0)) continue;
      const resolvedLabel =
        !compactMode && typeof rec.value === 'number' && s.anchors.length > 0
          ? resolveAnchorLabel(s.anchors, rec.value)
          : '';
      const tier = resolvedLabel ? ` (${resolvedLabel})` : '';
      const formattedVal =
        typeof rec.value === 'string'
          ? compactContinuityTextValue(s.id, rec.value, textCap)
          : String(rec.value);
      const item = `${s.id}=${formattedVal}${s.kind === 'clock' || s.kind === 'pips' ? `/${s.max}` : ''}${tier}`;
      if (s.scope === 'player') playerStatParts.push(item);
      else worldStatParts.push(item);
    }

    const banner = formatSceneBanner(state);
    const outLines: string[] = [`Scene: ${banner.formatted}`];

    const playerParts = [
      hasPlayerAttire ? `attire="${compactContinuityTextValue('attire', state.player.attire, 90)}"` : '',
      hasPlayerCondition ? `state="${compactContinuityTextValue('condition', state.player.condition, 80)}"` : '',
      ...playerStatParts,
    ].filter(Boolean);
    if (playerParts.length > 0) {
      outLines.push(`Player: ${playerParts.join(' | ')}`);
    }

    if (worldStatParts.length > 0) {
      outLines.push(`World: ${worldStatParts.join(' | ')}`);
    }

    if (activeContinuityCategoryRules.length > 0) {
      outLines.push(`Category Directives:\n${activeContinuityCategoryRules.join('\n')}`);
    }

    const charSchemas = template.stats.filter(
      s => s.scope === 'character' && isContinuityStatEnabled(s),
    );
    const enabledFields = template.dossierFields.filter(f => f.enabled);
    const characters = Object.values(state.characters);
    if (characters.length > 0) {
      const presentFirst = [
        ...characters.filter(c => c.present),
        ...characters.filter(c => !c.present),
      ];
      outLines.push(`Cast (${characters.length}):`);
      for (const actor of presentFirst) {
        const peerBonds =
          template.surfaces.trackNpcBonds !== false
            ? Object.values(actor.peerBonds ?? {})
                .map(b => `→${b.toName}(${b.label})`)
                .join(', ')
            : '';

        if (!actor.present) {
          const isTransientSceneStat = (id: string) =>
            id === 'acted' || id === 'observation';
          const compactMeters = charSchemas
            .filter(s => !isTransientSceneStat(s.id))
            .map(s => {
              const m = actor.meters[s.id];
              if (!m?.calibrated) return '';
              if (compactMode && (m.value === 'None' || m.value === '')) return '';
              const valStr =
                typeof m.value === 'string'
                  ? compactContinuityTextValue(s.id, m.value, Math.min(textCap, 90))
                  : String(m.value);
              return `${s.id}=${valStr}`;
            })
            .filter(Boolean)
            .join(', ');
          const roleTxt = resolveCharacterFieldValue(actor, 'role_summary');
          const carriedTxt = resolveCharacterFieldValue(actor, 'carried_items');
          const bondLabel = actor.bondToPlayer?.label?.trim() || '';
          const parts = [
            bondLabel ? `toYou="${bondLabel}"` : '',
            roleTxt && roleTxt.toLowerCase() !== bondLabel.toLowerCase()
              ? `role="${compactContinuityTextValue('role', roleTxt, 50)}"`
              : '',
            carriedTxt && carriedTxt !== 'None'
              ? `items="${compactContinuityTextValue('carried_items', carriedTxt, 60)}"`
              : '',
            compactMeters,
            peerBonds ? `peers=[${peerBonds}]` : '',
          ].filter(Boolean);
          outLines.push(`- ${actor.name} (offscreen)${parts.length ? `: ${parts.join(' | ')}` : ''}`);
          continue;
        }

        const meters = charSchemas
          .map(s => {
            const m = actor.meters[s.id];
            if (!m?.calibrated) return compactMode ? '' : `${s.id}=?`;
            if (compactMode && (m.value === 'None' || m.value === '')) return '';
            const valStr =
              typeof m.value === 'string'
                ? compactContinuityTextValue(s.id, m.value, textCap)
                : String(m.value);
            return `${s.id}=${valStr}`;
          })
          .filter(Boolean)
          .join(', ');

        const planActive =
          charSchemas.some(s => s.id === 'plan' && actor.meters[s.id]?.calibrated);
        const bondLabel = actor.bondToPlayer?.label?.trim() || '';

        const fieldSummary = enabledFields
          .map(f => {
            const val = resolveCharacterFieldValue(actor, f.id);
            if (!val) return '';
            // Deduplicate role_summary if identical to bondToYou, and immediate_goal if plan is active
            if (f.id === 'role_summary' && bondLabel && val.toLowerCase() === bondLabel.toLowerCase()) {
              return '';
            }
            if (compactMode && f.id === 'immediate_goal' && planActive) {
              return '';
            }
            return `${f.id}="${compactContinuityTextValue(f.id, val, Math.min(textCap, 110))}"`;
          })
          .filter(Boolean)
          .join(' | ');

        const bondSummary = [
          bondLabel ? `toYou="${bondLabel}"` : '',
          actor.bondFromPlayer?.label ? `yourBond="${actor.bondFromPlayer.label}"` : '',
        ].filter(Boolean).join(', ');
        const head = `- ${actor.name}${bondSummary ? ` [${bondSummary}]` : ''}${fieldSummary ? `: ${fieldSummary}` : ''}`;
        outLines.push(head);
        if (meters || peerBonds) {
          outLines.push(`  stats: ${[meters, peerBonds ? `peers=[${peerBonds}]` : ''].filter(Boolean).join(' | ')}`);
        }
      }
    }

    if (hasPlaces) {
      const placesList = Object.values(state.places);
      outLines.push(`Places: ${placesList.map(p => p.name).join(', ')}`);
    }

    if (hasActiveQuests) {
      const activeQuests = Object.values(state.quests).filter(q => q.status === 'active');
      outLines.push(`Quests: ${activeQuests.map(q => q.title).join('; ')}`);
    }

    return outLines;
  };

  let lines = buildWithTextCap(220, false);
  if (lines.join('\n').length > charBudget) {
    lines = buildWithTextCap(130, true);
  }
  if (lines.join('\n').length > charBudget) {
    lines = buildWithTextCap(75, true);
  }

  let out = '';
  let omittedCount = 0;
  for (const line of lines) {
    if (out.length + line.length + 1 <= charBudget) {
      out += (out ? '\n' : '') + line;
    } else {
      omittedCount++;
    }
  }

  return { text: out, omittedCount };
}

function isLocallyComputedStat(s: StatSchemaDef): boolean {
  if (s.calculationMode === 'local_formula') return true;
  if (s.calculationMode === 'ai_plus_local' || s.calculationMode === 'ai') return false;
  return Boolean(s.formula?.trim());
}

function checkKeywordsOrVitalsMatch(
  keywords: string[] | undefined,
  statIdsToCheck: string[],
  state: CampaignState,
  recentTranscriptText: string,
): boolean {
  for (const sid of statIdsToCheck) {
    if (/vital|hp|mp/i.test(sid)) {
      const checkVal = (raw: unknown) => {
        const tok = parseStatTokens(raw);
        return (
          (tok.HP !== undefined && tok.HP_max !== undefined && tok.HP < tok.HP_max) ||
          (tok.MP !== undefined && tok.MP_max !== undefined && tok.MP < tok.MP_max)
        );
      };
      if (checkVal(state.stats[sid]?.value)) return true;
      for (const c of Object.values(state.characters)) {
        if (c.present && checkVal(c.meters[sid]?.value)) return true;
      }
    }
  }
  const kws = keywords ?? [];
  if (!kws.length) return true;
  if (!recentTranscriptText.trim()) return !state.initialized;
  const hay = recentTranscriptText.toLowerCase();
  return kws.some(kw => kw && hay.includes(kw.toLowerCase()));
}

function isCategoryPromptActive(
  cat: StatCategoryDef,
  memberStatIds: string[],
  state: CampaignState,
  recentTranscriptText: string,
): boolean {
  if (!cat.enabled) return false;
  if (cat.promptTriggerMode === 'manual') return false;
  if (cat.promptTriggerMode !== 'conditional') return true;
  return checkKeywordsOrVitalsMatch(cat.promptKeywords, memberStatIds, state, recentTranscriptText);
}

function isStatPromptActive(
  s: StatSchemaDef,
  state: CampaignState,
  recentTranscriptText: string,
  categoryMap?: Map<string, StatCategoryDef>,
  allStats?: StatSchemaDef[],
): boolean {
  if (!s.enabled || s.locked || isLocallyComputedStat(s)) return false;
  if (s.categoryId && categoryMap) {
    const cat = categoryMap.get(s.categoryId);
    if (cat) {
      const memberIds = (allStats ?? [])
        .filter(st => st.categoryId === cat.id)
        .map(st => st.id);
      if (!isCategoryPromptActive(cat, memberIds, state, recentTranscriptText)) {
        return false;
      }
    }
  }
  if (s.promptTriggerMode === 'manual') return false;
  if (s.promptTriggerMode !== 'conditional') return true;
  return checkKeywordsOrVitalsMatch(s.promptKeywords, [s.id], state, recentTranscriptText);
}

function sampleValueForSchema(
  s: StatSchemaDef,
  hasPersistedState: boolean,
): number | string | boolean {
  if (s.kind === 'boolean') return Boolean(s.defaultValue);
  if (isTextLikeStat(s)) {
    const defStr = typeof s.defaultValue === 'string' ? s.defaultValue.trim() : '';
    if (
      s.kind === 'skill_tree' &&
      defStr &&
      defStr !== 'None' &&
      defStr !== '0'
    ) {
      return defStr;
    }
    return '...';
  }
  if (hasPersistedState) return '+1';
  return typeof s.defaultValue === 'number' ? s.defaultValue : 50;
}

function hasUncalibratedTarget(state: CampaignState, s: StatSchemaDef): boolean {
  if (!state.initialized) return true;
  if (s.scope === 'character') {
    const presentChars = Object.values(state.characters).filter(c => c.present);
    if (!presentChars.length) return true;
    return presentChars.some(c => !c.meters[s.id]?.calibrated);
  }
  return !state.stats[s.id]?.calibrated;
}

export function buildCompactFormatExample(
  state: CampaignState,
  template: LumiStatsTemplate,
  hasPersistedState = false,
  recentTranscriptText = '',
  options?: { verbosity?: 'compact' | 'standard' },
): string {
  const isCompact = (options?.verbosity ?? 'compact') === 'compact';
  const core = template.coreTrackers;
  const categoryMap = new Map((template.categories ?? []).map(c => [c.id, c]));
  const charSchemas = template.stats.filter(
    s => s.scope === 'character' && isStatPromptActive(s, state, recentTranscriptText, categoryMap, template.stats),
  );
  const otherSchemas = template.stats.filter(
    s => s.scope !== 'character' && isStatPromptActive(s, state, recentTranscriptText, categoryMap, template.stats),
  );
  const flatMeters: Record<string, number | string | boolean> = {};
  for (const s of charSchemas) {
    flatMeters[s.id] = isCompact && hasPersistedState ? (isTextLikeStat(s) ? '...' : '+N') : sampleValueForSchema(s, hasPersistedState);
  }
  const flatStats: Record<string, number | string | boolean> = {};
  for (const s of otherSchemas) {
    flatStats[s.id] = isCompact && hasPersistedState ? (isTextLikeStat(s) ? '...' : '+N') : sampleValueForSchema(s, hasPersistedState);
  }

  const charExample: Record<string, unknown> = {
    name: 'NPC',
    present: true,
    location: 'Spot',
    ...(isCompact && hasPersistedState
      ? {}
      : {
          bondToPlayer: { label: 'Ally', category: 'friend', note: 'Why' },
          bondFromPlayer: { label: 'Friend', category: 'friend', note: 'Why' },
        }),
  };
  for (const f of template.dossierFields.filter(df => df.enabled && !df.locked)) {
    if (f.id === 'role_summary') {
      if (!isCompact || !hasPersistedState) charExample.role = 'Role';
    } else if (f.id === 'demeanor') charExample.demeanor = '...';
    else if (f.id === 'inner_thought') charExample.thought = '...';
    else if (f.id === 'immediate_goal') charExample.goal = '...';
    else if (f.id === 'attire_layers') charExample.attire = '...';
    else charExample[f.id] = '...';
  }
  Object.assign(charExample, flatMeters);
  if (template.surfaces.trackNpcBonds !== false && (!isCompact || !hasPersistedState)) {
    charExample.peerBonds = [
      {
        target: 'NPC2',
        label: 'Relation',
        category: 'family|friend|romance|rival|professional|neutral',
        attitude: 'Why',
      },
    ];
  }

  const ov = core?.overrides ?? {};
  const playerExample: Record<string, string> = {};
  if (core?.trackPlayerAttire !== false && !ov.player_attire?.locked) playerExample.attire = '...';
  if (core?.trackPlayerCondition !== false && !ov.player_condition?.locked) playerExample.condition = '...';
  if (core?.trackPlayerAction && !ov.player_action?.locked) playerExample.notableAction = '...';

  const sceneExample: Record<string, unknown> = {};
  if (!core?.scenePillLocked) {
    sceneExample.location = 'Spot, Area';
    sceneExample.time = '08:05 AM';
    if (!isCompact || !hasPersistedState) {
      sceneExample.date = 'Day 1';
      sceneExample.weather = 'Clear';
    }
    sceneExample.mins = 5;
  }
  if (core?.trackSceneSummary !== false && !ov.scene_summary?.locked) {
    sceneExample.summary = '...';
  }

  const exampleObj: Record<string, unknown> = {
    ...(Object.keys(sceneExample).length ? { scene: sceneExample } : {}),
    ...(Object.keys(playerExample).length ? { player: playerExample } : {}),
    ...(Object.keys(flatStats).length ? { stats: flatStats } : {}),
    characters: [charExample],
  };

  const hasPlacesAlready = Object.keys(state.places).length > 0;
  const movementMentioned =
    !hasPlacesAlready ||
    /\b(?:entered|arrived\s+at|walked\s+(?:into|to)|headed\s+to|stepped\s+(?:into|outside)|moved\s+to|travel(?:ed|ing)\s+to|left\s+for|new\s+location)\b/i.test(
      recentTranscriptText,
    );

  if (core?.trackPlaces !== false && !ov.places?.locked && movementMentioned) {
    exampleObj.zones = [
      { name: 'Zone', kind: 'building|district|region|ship_deck', icon: '🏛️' },
    ];
    exampleObj.places = [
      { name: 'Spot', zone: 'Zone', category: 'interior', icon: '📍', tags: ['safe'], description: '...' },
    ];
    exampleObj.paths = [
      { from: 'A', to: 'B', type: 'door|hallway|stairs|street|trail|portal', mins: 2 },
    ];
  }
  if (core?.trackQuests !== false && !ov.quests?.locked && !hasPersistedState) {
    exampleObj.quests = [
      { title: 'Arc', status: 'active', summary: '...' },
    ];
  }

  return JSON.stringify(exampleObj);
}

function clipAtWordBoundary(text: string, maxLen: number): string {
  const clean = text.replace(/\r?\n+/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  const sliced = clean.slice(0, maxLen);
  const lastSpace = sliced.lastIndexOf(' ');
  return (lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced) + '…';
}

/**
 * Universal, token-lean Extraction Protocol:
 * 1. Skips `local_formula` & `manual` stats (0 extractor tokens).
 * 2. Automatically deduplicates identical Player + NPC rules.
 * 3. Gates `conditional` stats by keyword/state when recent text is supplied.
 * 4. In `'compact'` mode, trims Turn-1 calibration rubrics & boilerplate once state is calibrated.
 */
export function compileExtractorPrompt(
  state: CampaignState,
  template: LumiStatsTemplate,
  recentTranscriptText = '',
  options?: { verbosity?: 'compact' | 'standard'; skipContinuityCategoryRules?: boolean },
): string {
  const isCompact = (options?.verbosity ?? 'compact') === 'compact';
  const core = template.coreTrackers;
  const ov = core?.overrides ?? {};
  const categoryMap = new Map((template.categories ?? []).map(c => [c.id, c]));
  const activeSchemas = template.stats.filter(s =>
    isStatPromptActive(s, state, recentTranscriptText, categoryMap, template.stats),
  );
  const activeIdSet = new Set(activeSchemas.map(s => s.id));

  const categoryRuleLines: string[] = [];
  for (const cat of [...(template.categories ?? [])].sort((a, b) => a.order - b.order)) {
    if (!cat.aiRule?.trim()) continue;
    const catMemberStats = template.stats.filter(s => s.enabled && s.categoryId === cat.id);
    if (!catMemberStats.length) continue;
    if (!isCategoryPromptActive(cat, catMemberStats.map(s => s.id), state, recentTranscriptText)) {
      continue;
    }
    const activeMemberLabels = catMemberStats
      .filter(s => activeIdSet.has(s.id))
      .map(s => s.id);
    if (!activeMemberLabels.length) continue;
    if (options?.skipContinuityCategoryRules && cat.injectInContinuity !== false) {
      categoryRuleLines.push(
        `  • [${cat.name}] (${activeMemberLabels.join(', ')}): Follow the [${cat.name}] directives in Story Continuity above.`,
      );
    } else {
      const formattedRule = cat.aiRule.replace(/\n{3,}/g, '\n\n').trim();
      categoryRuleLines.push(
        `[${cat.name}] (applies to: ${activeMemberLabels.join(', ')}):\n${formattedRule}`,
      );
    }
  }
  const charSchemas = activeSchemas.filter(s => s.scope === 'character');
  const otherSchemas = activeSchemas.filter(s => s.scope !== 'character');
  const enabledFields = template.dossierFields.filter(f => f.enabled && !f.locked);
  const existingChars = Object.values(state.characters);

  const compactNumericTag = (s: StatSchemaDef) => {
    const mode = s.volatility === 'momentary' ? 'mom' : s.volatility === 'anchor' ? 'anc' : 'prog';
    const needsFullCalibration = !isCompact || hasUncalibratedTarget(state, s);
    let cueText = s.triggerCues;
    if (!needsFullCalibration && cueText) {
      // Drop verbose Turn-1 scale calibration examples when targets are already calibrated
      cueText = cueText
        .replace(/0[–-]100\s*scale\.\s*/gi, '')
        .replace(/Calibrate[^.;]*?\([^)]*\)[^.;]*[.;]\s*/gi, '')
        .trim();
    }
    const cueShort = cueText ? clipAtWordBoundary(cueText, needsFullCalibration ? 240 : 110) : '';
    const labelHint = slugifyKey(s.label, '') !== s.id ? ` "${s.label}"` : '';
    return `${s.id}${labelHint}[${s.min}..${s.max},${mode}${cueShort ? `: ${cueShort}` : ''}]`;
  };

  const charNumeric = charSchemas.filter(s => !isTextLikeStat(s) && s.kind !== 'boolean');
  const otherNumeric = otherSchemas.filter(s => !isTextLikeStat(s) && s.kind !== 'boolean');
  const textAndCustomSchemas = [...charSchemas, ...otherSchemas].filter(
    s => isTextLikeStat(s) || s.kind === 'boolean',
  );

  const groupedTextRules: string[] = [];
  const cueGroupMap = new Map<string, { labels: string[]; rule: string }>();
  for (const s of textAndCustomSchemas) {
    const cueClean = s.triggerCues
      ? s.triggerCues.replace(/\r?\n+/g, ' — ').replace(/\s+/g, ' ').trim()
      : 'Concise update';
    const scopeTag = s.scope === 'character' ? 'NPC' : 'stat';
    const labelToken =
      slugifyKey(s.label, '') !== s.id
        ? `"${s.id}"("${s.label}",${scopeTag})`
        : `"${s.id}"(${scopeTag})`;
    const normKey = cueClean.toLowerCase();
    const existingGroup = cueGroupMap.get(normKey);
    if (existingGroup && cueClean.length > 20) {
      existingGroup.labels.push(labelToken);
    } else {
      cueGroupMap.set(normKey, { labels: [labelToken], rule: cueClean });
    }
  }
  for (const grp of cueGroupMap.values()) {
    groupedTextRules.push(`  • ${grp.labels.join(' & ')}: ${grp.rule}`);
  }

  const customDossierFields = enabledFields.filter(f => !DEFAULT_FIELD_IDS.has(f.id));
  const editedDefaultFields = enabledFields.filter(f => DEFAULT_FIELD_IDS.has(f.id));

  const trackedTargets = [
    core?.trackPlayerAttire !== false && !ov.player_attire?.locked ? 'player.attire' : '',
    core?.trackPlayerCondition !== false && !ov.player_condition?.locked ? 'player.condition' : '',
    core?.trackPlayerAction && !ov.player_action?.locked ? 'player.notableAction' : '',
    !core?.scenePillLocked ? 'scene' : '',
    core?.trackPlaces !== false && !ov.places?.locked ? 'places[]' : '',
    core?.trackQuests !== false && !ov.quests?.locked ? 'quests[]' : '',
    core?.trackDispatches !== false && !ov.dispatches?.locked ? 'dispatches[]' : '',
  ].filter(Boolean);

  const resolveCoreInst = (
    id: keyof NonNullable<NonNullable<typeof core>['overrides']>,
    fallback?: string,
  ): string => (ov[id]?.instruction ?? fallback ?? '').trim();

  let coreSection = '';
  if (isCompact && state.initialized) {
    const compactCoreItems: string[] = [];
    if (!core?.scenePillLocked) {
      compactCoreItems.push('scene{location("Spot, Area"),time,date,weather,mins(int)}');
    } else {
      compactCoreItems.push('scene pill LOCKED (omit location/time/date/weather)');
    }
    if (core?.trackSceneSummary !== false && !ov.scene_summary?.locked) compactCoreItems.push('scene.summary(1-sent)');
    if (core?.trackPlayerAttire !== false && !ov.player_attire?.locked) compactCoreItems.push('player.attire');
    if (core?.trackPlayerCondition !== false && !ov.player_condition?.locked) compactCoreItems.push('player.condition');
    if (core?.trackPlayerAction && !ov.player_action?.locked) compactCoreItems.push('player.notableAction');
    if (core?.trackPlaces !== false && !ov.places?.locked) compactCoreItems.push('zones[]/places[]/paths[] on new places');
    if (core?.trackQuests !== false && !ov.quests?.locked) compactCoreItems.push('quests[] on change');
    if (core?.trackDispatches !== false && !ov.dispatches?.locked) compactCoreItems.push('dispatches[] if offscreen');
    if (core?.trackNpcConditions !== false && !ov.npc_conditions?.locked) compactCoreItems.push('characters[].conditions');
    if (core?.trackNpcSecrets !== false && !ov.npc_secrets?.locked) compactCoreItems.push('characters[].secrets');
    coreSection = `Core Keys (update only if changed): ${compactCoreItems.join(' | ')}`;
  } else {
    const scenePillHints = !core?.scenePillLocked
      ? [
          core?.sceneLocationInstruction
            ? `  • "scene.location": ${clipAtWordBoundary(core.sceneLocationInstruction, 200)}`
            : '',
          core?.sceneTimeInstruction
            ? `  • "scene.time": ${clipAtWordBoundary(core.sceneTimeInstruction, 200)}`
            : '',
          core?.sceneDateInstruction
            ? `  • "scene.date": ${clipAtWordBoundary(core.sceneDateInstruction, 200)}`
            : '',
          core?.sceneWeatherInstruction
            ? `  • "scene.weather": ${clipAtWordBoundary(core.sceneWeatherInstruction, 200)}`
            : '',
          core?.sceneTimeFlowInstruction
            ? `  • "scene.mins": ${clipAtWordBoundary(core.sceneTimeFlowInstruction, 200)}`
            : '',
        ].filter(Boolean)
      : ['  • Scene Pill is LOCKED — omit location/time/date/weather.'];

    const corePromptHints = [
      ...scenePillHints,
      core?.trackPlayerAttire !== false && !ov.player_attire?.locked && resolveCoreInst('player_attire', core?.playerAttireInstruction)
        ? `  • "player.attire": ${clipAtWordBoundary(resolveCoreInst('player_attire', core?.playerAttireInstruction), 200)}`
        : '',
      core?.trackPlayerCondition !== false && !ov.player_condition?.locked && resolveCoreInst('player_condition', core?.playerConditionInstruction)
        ? `  • "player.condition": ${clipAtWordBoundary(resolveCoreInst('player_condition', core?.playerConditionInstruction), 200)}`
        : '',
      core?.trackPlayerAction && !ov.player_action?.locked && resolveCoreInst('player_action', core?.playerActionInstruction)
        ? `  • "player.notableAction": ${clipAtWordBoundary(resolveCoreInst('player_action', core?.playerActionInstruction), 200)}`
        : '',
      core?.trackSceneSummary !== false && !ov.scene_summary?.locked && resolveCoreInst('scene_summary', core?.sceneSummaryInstruction)
        ? `  • "scene.summary": ${clipAtWordBoundary(resolveCoreInst('scene_summary', core?.sceneSummaryInstruction), 200)}`
        : '',
      core?.trackPlaces !== false && !ov.places?.locked && resolveCoreInst('places', core?.placesInstruction)
        ? `  • "places[]/zones[]": ${clipAtWordBoundary(resolveCoreInst('places', core?.placesInstruction), 200)}`
        : '',
      core?.trackQuests !== false && !ov.quests?.locked && resolveCoreInst('quests', core?.questsInstruction)
        ? `  • "quests[]": ${clipAtWordBoundary(resolveCoreInst('quests', core?.questsInstruction), 200)}`
        : '',
      core?.trackDispatches !== false && !ov.dispatches?.locked && resolveCoreInst('dispatches', core?.dispatchesInstruction)
        ? `  • "dispatches[]": ${clipAtWordBoundary(resolveCoreInst('dispatches', core?.dispatchesInstruction), 200)}`
        : '',
      core?.trackNpcConditions === false || ov.npc_conditions?.locked
        ? '  • Skip character conditions[].'
        : resolveCoreInst('npc_conditions', core?.npcConditionsInstruction)
          ? `  • "characters[].conditions": ${clipAtWordBoundary(resolveCoreInst('npc_conditions', core?.npcConditionsInstruction), 180)}`
          : '',
      core?.trackNpcSecrets === false || ov.npc_secrets?.locked
        ? '  • Skip character secrets[].'
        : resolveCoreInst('npc_secrets', core?.npcSecretsInstruction)
          ? `  • "characters[].secrets": ${clipAtWordBoundary(resolveCoreInst('npc_secrets', core?.npcSecretsInstruction), 180)}`
          : '',
    ].filter(Boolean);
    coreSection = corePromptHints.length ? `Core & Scene Pill Rules:\n${corePromptHints.join('\n')}` : '';
  }

  let dossierSection = '';
  if (isCompact && state.initialized) {
    const defKeys = editedDefaultFields.map(f => f.id);
    const customHints = customDossierFields.map(f => `"${f.id}" (${clipAtWordBoundary(f.instruction, 140)})`);
    const parts = [
      defKeys.length ? `keys: ${defKeys.join(', ')}` : '',
      ...customHints,
    ].filter(Boolean);
    if (parts.length) {
      dossierSection = `Dossier Fields (omit unchanged): ${parts.join(' | ')}`;
    }
  } else {
    const dossierHints = [
      ...editedDefaultFields.map(f => `"${f.id}" (${clipAtWordBoundary(f.instruction, 130)})`),
      ...customDossierFields.map(f => `"${f.id}" (${clipAtWordBoundary(f.instruction, 160)})`),
    ];
    if (dossierHints.length) {
      dossierSection = `Character Dossier Field Rules:\n  • ${dossierHints.join(' | ')}`;
    }
  }

  return [
    `<lumi_stats_protocol>`,
    `ACTIVE REQUIRED CONTRACT: In EVERY reply, after all prose and preset footers, append one <lumi-stats>{...JSON...}</lumi-stats> block (use hyphenated <lumi-stats>).`,
    `1. CAST: List active/mentioned NPCs in "characters[]" ("present": true if in room, false if offscreen; set "location", "bondToPlayer", "bondFromPlayer" on new/changed bonds). Use "+N"/"-N" deltas for numeric meters; omit unchanged fields.`,
    template.surfaces.trackNpcBonds !== false
      ? `2. PEER BONDS ("peerBonds[]"): For NPC↔NPC relations, set {"target","label","category":"family|friend|romance|rival|professional|neutral","attitude"}.`
      : '',
    `3. UPDATE (${trackedTargets.join(', ')} — use ONLY the exact stat/meter keys listed below; omit any removed or unlisted keys):`,
    categoryRuleLines.length ? `Category Rules:\n${categoryRuleLines.join('\n')}` : '',
    charNumeric.length ? `NPC Meters: ${charNumeric.map(compactNumericTag).join(' | ')}` : '',
    otherNumeric.length ? `Player/World Meters: ${otherNumeric.map(compactNumericTag).join(' | ')}` : '',
    groupedTextRules.length
      ? `Text & Format Stats (follow exact format):\n${groupedTextRules.join('\n')}`
      : '',
    coreSection,
    dossierSection,
    `Append at end (ASCII spaces only; omit unchanged keys):`,
    `<lumi-stats>`,
    buildCompactFormatExample(state, template, existingChars.length > 0, recentTranscriptText, {
      verbosity: options?.verbosity ?? 'compact',
    }),
    `</lumi-stats>`,
    `</lumi_stats_protocol>`,
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildChatVariableProjection(
  state: CampaignState,
  template?: LumiStatsTemplate,
): Record<string, unknown> {
  const banner = formatSceneBanner(state);
  const allowedNonChar = template
    ? new Set(template.stats.filter(s => s.enabled && s.scope !== 'character').map(s => s.id))
    : null;
  const allowedChar = template
    ? new Set(template.stats.filter(s => s.enabled && s.scope === 'character').map(s => s.id))
    : null;

  const statsFlat: Record<string, number | string | boolean> = {};
  for (const [k, v] of Object.entries(state.stats)) {
    if (allowedNonChar && !allowedNonChar.has(k)) continue;
    statsFlat[k] = v.value;
  }

  const actorsFlat: Record<string, Record<string, unknown>> = {};
  for (const [id, char] of Object.entries(state.characters)) {
    const metersFlat: Record<string, number | string | boolean> = {};
    for (const [mk, mv] of Object.entries(char.meters)) {
      if (allowedChar && !allowedChar.has(mk)) continue;
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
      peerBonds: char.peerBonds,
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
      summary: state.scene.beatSummary,
    },
    player: state.player,
    trackers: statsFlat,
    stats: statsFlat,
    actors: actorsFlat,
  };
}
