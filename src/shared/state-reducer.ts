import { recomputeDerivedStats } from './formula';
import { cleanBrailleAndProseWhitespace, deobfuscateSensitiveWords } from './prose-cleaner';
import { createStatSchema, slugifyKey } from './templates';
import type {
  BondCategory,
  BuiltInTrackerConfig,
  BuiltInTrackerId,
  CampaignState,
  CharacterRecord,
  ExtractedTurnPatch,
  LumiStatsTemplate,
  MapPathEdge,
  MapPathKind,
  MapZoneKind,
  RelationLink,
  StatAuditEntry,
  StatPatchInput,
  StatSchemaDef,
  TurnDeltaMap,
} from './types';

function scrubUnicodeSpacesForJson(raw: string): string {
  return raw
    .replace(/[\u2800\u00A0\u1680\u180E\u2000-\u200A\u202F\u205F\u2060\u3000]/g, ' ')
    .replace(/[\u200B-\u200D\uFEFF]/g, '');
}

function sanitizeJsonControlCharsAndComments(raw: string): string {
  let out = '';
  let inString = false;
  let escaped = false;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i]!;
    if (inString) {
      if (escaped) {
        out += ch;
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        out += ch;
        escaped = true;
        continue;
      }
      if (ch === '"') {
        out += ch;
        inString = false;
        continue;
      }
      if (ch === '\n') {
        out += '\\n';
        continue;
      }
      if (ch === '\r') {
        if (raw[i + 1] !== '\n') out += '\\r';
        continue;
      }
      if (ch === '\t') {
        out += '\\t';
        continue;
      }
      if (ch.charCodeAt(0) < 0x20) {
        continue;
      }
      out += ch;
      continue;
    }

    if (ch === '/' && raw[i + 1] === '/') {
      const nl = raw.indexOf('\n', i + 2);
      if (nl < 0) break;
      i = nl - 1;
      continue;
    }
    if (ch === '"') inString = true;
    out += ch;
  }
  return out;
}

function closeTruncatedJson(raw: string): string {
  const s = scrubUnicodeSpacesForJson(raw).trim();
  if (!s.startsWith('{') && !s.startsWith('[')) return s;
  const stack: string[] = [];
  let inString = false;
  let escaped = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]!;
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
    } else if (ch === '"') {
      inString = true;
    } else if (ch === '{') {
      stack.push('}');
    } else if (ch === '[') {
      stack.push(']');
    } else if ((ch === '}' || ch === ']') && stack.at(-1) === ch) {
      stack.pop();
    }
  }
  if (!inString && !stack.length) return s;
  let out = s;
  if (inString) {
    if (escaped) out = out.slice(0, -1);
    out += '"';
  }
  out = out.replace(/:\s*(?:t(?:r(?:u)?)?|f(?:a(?:l(?:s)?)?)?|n(?:u(?:l)?)?|-?\d+\.)\s*$/i, ': null');
  out = out.replace(/[,:\s]+$/, '');
  if (/\{\s*"[^"]*"\s*$|,\s*"[^"]*"\s*$/.test(out) && stack.at(-1) === '}') {
    out += ': null';
  }
  while (stack.length) out += stack.pop()!;
  return out;
}

/**
 * Parses JSON emitted by an LLM, scrubbing Braille blanks (`U+2800`), exotic spaces,
 * literal newlines inside strings, and JS-style comments so `JSON.parse` succeeds reliably.
 */
export function parseExtractedJson(rawText: string): ExtractedTurnPatch {
  const unicodeCleaned = scrubUnicodeSpacesForJson(rawText);
  const stripped = unicodeCleaned
    .replace(/<(?:think|thinking|reasoning|analysis|scratchpad)\b[^>]*>[\s\S]*?<\/(?:think|thinking|reasoning|analysis|scratchpad)\s*>/gi, '')
    .trim();
  if (!stripped) throw new Error('Empty response from extractor model.');

  const pushWithBraceSlice = (list: string[], block: string | undefined) => {
    const t = block?.trim();
    if (!t) return;
    list.push(t);
    const fb = t.indexOf('{');
    const lb = t.lastIndexOf('}');
    if (fb >= 0) {
      list.push(lb > fb ? t.slice(fb, lb + 1) : t.slice(fb));
    }
  };

  const candidates: string[] = [];
  const tagMatch = stripped.match(/<(?:lumi-stats|lumi_stats|lumi-tracker|worldweave|tracker)\b[^>]*>([\s\S]*?)(?:<\/(?:lumi-stats|lumi_stats|lumi-tracker|worldweave|tracker)>|$)/i);
  pushWithBraceSlice(candidates, tagMatch?.[1]);

  const fenceMatch = stripped.match(/```(?:json|lumi-stats|lumi_stats|lumi-tracker|tracker|sim)?\s*([\s\S]*?)\s*```/i);
  pushWithBraceSlice(candidates, fenceMatch?.[1]);

  pushWithBraceSlice(candidates, stripped);

  let lastErr: unknown;
  for (const cand of candidates) {
    const cleanCand = sanitizeJsonControlCharsAndComments(scrubUnicodeSpacesForJson(cand));
    const preserveSignedPlus = cleanCand.replace(
      /(:\s*)\+\s*(\d+(?:\.\d+)?)(?=\s*[,}\]\r\n])/g,
      '$1"+$2"',
    );
    const removeTrailingCommas = preserveSignedPlus.replace(
      /("(?:\\.|[^"\\])*")|,(\s*[}\]])/g,
      (_m, quoted: string | undefined, closing: string) => (quoted ? quoted : closing),
    );
    for (const attempt of [
      cleanCand,
      preserveSignedPlus,
      removeTrailingCommas,
      closeTruncatedJson(removeTrailingCommas),
    ]) {
      try {
        const parsed = JSON.parse(attempt) as unknown;
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return parsed as ExtractedTurnPatch;
        }
      } catch (err) {
        lastErr = err;
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('Failed to parse extractor JSON output.');
}

export function extractInlineStatsTag(rawMessage: string): ExtractedTurnPatch | null {
  if (!rawMessage) return null;
  const blocks: string[] = [];
  const tagRe = /<(lumi-stats|lumi_stats|lumi-tracker|worldweave|tracker)\b[^>]*>([\s\S]*?)(?:<\/\1\s*>|$)/gi;
  let match: RegExpExecArray | null;
  while ((match = tagRe.exec(rawMessage)) !== null) {
    if (match[2]?.trim()) blocks.push(match[2].trim());
  }
  const fenceRe = /```[ \t]*(?:lumi-stats|lumi_stats|lumi-tracker|tracker|sim)\b[^\n]*\r?\n([\s\S]*?)(?:```|$)/gi;
  while ((match = fenceRe.exec(rawMessage)) !== null) {
    if (match[1]?.trim()) blocks.push(match[1].trim());
  }
  for (let i = blocks.length - 1; i >= 0; i--) {
    try {
      return parseExtractedJson(blocks[i]!);
    } catch {
      // Try earlier block if the last one was malformed
    }
  }
  return null;
}

export function stripInlineStatsTags(rawMessage: string): string {
  return rawMessage
    .replace(/<(lumi-stats|lumi_stats|lumi-tracker|worldweave|tracker)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
    .replace(/<(lumi-stats|lumi_stats|lumi-tracker|worldweave|tracker)\b[^>]*>[\s\S]*$/gi, '')
    .replace(/```[ \t]*(?:lumi-stats|lumi_stats|lumi-tracker|tracker|sim)\b[^\n]*\r?\n[\s\S]*?(?:```|$)/gi, '')
    .trim();
}

interface NormalizedMutation {
  op: 'set' | 'delta';
  value: number | string | boolean;
  reason?: string;
}

function cleanStringValue(val: string): string {
  return cleanBrailleAndProseWhitespace(val).trim();
}

function toTitleCaseWords(text: string): string {
  return text.replace(/(^|[\s\-'])([a-z])/g, (_m, sep: string, ch: string) => sep + ch.toUpperCase());
}

function normalizeDisplayLabel(raw: string, fromIdSlug = false): string {
  let txt = cleanStringValue(raw);
  if (!txt) return '';
  if (fromIdSlug) {
    txt = txt.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
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

function pickBetterCasedLabel(
  existing: string | undefined,
  incoming: string,
  fromIdSlug = false,
): string {
  const normalizedIncoming = normalizeDisplayLabel(incoming, fromIdSlug);
  const cur = existing?.trim() ?? '';
  if (!cur) return normalizedIncoming;
  if (!normalizedIncoming) return cur;

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

export function inferBondCategory(label: string, note = ''): BondCategory {
  const txt = `${label} ${note}`.toLowerCase();
  if (/\b(?:rival|enemy|nemesis|hostile|antagonist|foe|hatred|bitter|estranged|ex-|ex\b|breakup|broken\s+up|betray|furious|resent|adversary|suspicious|threat)\b/.test(txt)) {
    return 'rival';
  }
  if (/\b(?:sister|brother|sibling|mother|mom|father|dad|parent|son|daughter|cousin|aunt|uncle|family|twin|niece|nephew|guardian)\b/.test(txt)) {
    return 'family';
  }
  if (/\b(?:lover|partner|wife|husband|spouse|fianc[eé]e?|boyfriend|girlfriend|crush|sweetheart|romantic|beloved|infatuat)\b/.test(txt)) {
    return 'romance';
  }
  if (/\b(?:boss|employer|employee|subordinate|maid|butler|servant|retainer|master|teacher|student|mentor|apprentice|client|doctor|colleague|coworker|captain|commander)\b/.test(txt)) {
    return 'professional';
  }
  if (/\b(?:friend|best\s+friend|ally|companion|confidant|buddy|comrade|roommate|childhood|pal|trusted|protector)\b/.test(txt)) {
    return 'friend';
  }
  return 'neutral';
}

function normalizeRelationLink(
  raw: unknown,
  fallback?: RelationLink,
): RelationLink | undefined {
  if (!raw) return fallback;
  if (typeof raw === 'string') {
    const label = cleanStringValue(raw).slice(0, 140);
    if (!label) return fallback;
    return {
      label,
      ...(fallback?.note ? { note: fallback.note } : {}),
      category: inferBondCategory(label, fallback?.note ?? ''),
    };
  }
  if (typeof raw === 'object' && !Array.isArray(raw)) {
    const o = raw as Record<string, unknown>;
    const label = cleanStringValue(String(o.label ?? o.relation ?? o.bond ?? fallback?.label ?? '')).slice(0, 140);
    const note = cleanStringValue(String(o.note ?? o.attitude ?? o.reason ?? fallback?.note ?? '')).slice(0, 260);
    if (!label && !note) return fallback;
    const validCat = new Set(['family', 'friend', 'romance', 'rival', 'professional', 'neutral']);
    const explicitCat = typeof o.category === 'string' && validCat.has(o.category)
      ? (o.category as BondCategory)
      : undefined;
    return {
      label: label || fallback?.label || 'Acquaintance',
      ...(note ? { note } : {}),
      category: explicitCat ?? inferBondCategory(label || fallback?.label || '', note),
    };
  }
  return fallback;
}

function isNumericCharacterMeterSchema(s: StatSchemaDef): boolean {
  return (
    s.enabled &&
    s.scope === 'character' &&
    ['meter', 'number', 'clock', 'pips', 'hearts', 'currency'].includes(s.kind) &&
    !(s.displayStyle && s.displayStyle !== 'auto')
  );
}

function seedPeerBondMetersFromTemplate(
  meters: Record<string, number | string | boolean>,
  template: LumiStatsTemplate,
): Record<string, number | string | boolean> {
  const activeCharIds = new Set(
    template.stats.filter(s => s.enabled && s.scope === 'character').map(s => s.id),
  );
  const out: Record<string, number | string | boolean> = {};
  for (const [k, v] of Object.entries(meters)) {
    if (activeCharIds.has(k)) out[k] = v;
  }
  for (const schema of template.stats) {
    if (!isNumericCharacterMeterSchema(schema)) continue;
    if (out[schema.id] === undefined) {
      const def =
        typeof schema.defaultValue === 'number' && Number.isFinite(schema.defaultValue)
          ? schema.defaultValue
          : schema.min;
      out[schema.id] = Math.max(schema.min, Math.min(schema.max, Math.round(def)));
    }
  }
  return out;
}

function parseNumericStringMutation(
  trimmed: string,
  explicitOp: 'set' | 'delta',
  reason?: string,
): NormalizedMutation | null {
  if (!trimmed || trimmed === '∅') return null;

  const signedExact = trimmed.match(/^([+-])\s*(\d+(?:\.\d+)?)\s*%?$/);
  if (signedExact) {
    const num = Number(`${signedExact[1]}${signedExact[2]}`);
    return Number.isFinite(num) ? { op: 'delta', value: num, reason } : null;
  }

  const signedWithNote = trimmed.match(
    /^([+-])\s*(\d+(?:\.\d+)?)\s*%?(?:\s*[\(\[—–\-:]\s*([^)\]]+)\)?)$/,
  );
  if (signedWithNote) {
    const num = Number(`${signedWithNote[1]}${signedWithNote[2]}`);
    const inlineReason = cleanStringValue(signedWithNote[3] ?? '');
    return Number.isFinite(num)
      ? { op: 'delta', value: num, reason: reason || inlineReason || undefined }
      : null;
  }

  const fractionMatch = trimmed.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*\d+(?:\.\d+)?$/);
  if (fractionMatch) {
    const num = Number(fractionMatch[1]);
    return Number.isFinite(num) ? { op: 'set', value: num, reason } : null;
  }

  const plainNum = Number(trimmed);
  if (Number.isFinite(plainNum)) {
    return { op: explicitOp, value: plainNum, reason };
  }

  const numWithNote = trimmed.match(
    /^(-?\d+(?:\.\d+)?)\s*%?(?:\s*[\(\[—–\-]\s*([^)\]]+)\)?)$/,
  );
  if (numWithNote) {
    const num = Number(numWithNote[1]);
    const inlineReason = cleanStringValue(numWithNote[2] ?? '');
    return Number.isFinite(num)
      ? { op: explicitOp, value: num, reason: reason || inlineReason || undefined }
      : null;
  }

  return null;
}

function normalizeStatMutation(
  rawInput: unknown,
  _alreadyCalibrated: boolean,
  isNumericTarget = false,
): NormalizedMutation | null {
  if (rawInput === null || rawInput === undefined) return null;

  if (Array.isArray(rawInput)) {
    const joined = rawInput
      .map(item =>
        typeof item === 'object' && item !== null
          ? Object.entries(item as Record<string, unknown>)
              .map(([k, v]) => `${k}: ${String(v)}`)
              .join(' -> ')
          : String(item),
      )
      .filter(Boolean)
      .join('\n');
    return joined ? { op: 'set', value: cleanStringValue(joined) } : null;
  }

  if (typeof rawInput === 'object' && !Array.isArray(rawInput)) {
    const obj = rawInput as StatPatchInput;
    if (obj.value === undefined || obj.value === null) {
      if ('op' in obj) return null;
      return { op: 'set', value: JSON.stringify(rawInput) };
    }
    const rawVal = obj.value;
    const explicitOp = obj.op === 'delta' ? 'delta' : 'set';
    const rawReasonStr = typeof obj.reason === 'string' ? cleanStringValue(obj.reason) : '';
    const cleanedReason =
      rawReasonStr && !/^(?:manual ui adjustment|manual dossier adjustment|scene progression)$/i.test(rawReasonStr)
        ? rawReasonStr
        : undefined;

    if (typeof rawVal === 'string') {
      const trimmed = cleanStringValue(rawVal);
      if (!trimmed || trimmed === '∅') return null;
      const numericParsed = parseNumericStringMutation(trimmed, explicitOp, cleanedReason);
      if (numericParsed) return numericParsed;
      if (isNumericTarget) return null;
      return { op: 'set', value: trimmed, reason: cleanedReason };
    }
    return { op: explicitOp, value: rawVal, reason: cleanedReason };
  }

  if (typeof rawInput === 'string') {
    const trimmed = cleanStringValue(rawInput);
    if (!trimmed || trimmed === '∅') return null;
    const numericParsed = parseNumericStringMutation(trimmed, 'set');
    if (numericParsed) return numericParsed;
    if (isNumericTarget) return null;
    return { op: 'set', value: trimmed };
  }

  if (typeof rawInput === 'number') {
    if (!Number.isFinite(rawInput)) return null;
    return { op: 'set', value: rawInput };
  }

  if (typeof rawInput === 'boolean') {
    return { op: 'set', value: rawInput };
  }

  return null;
}

function matchStatSchema(
  schemas: StatSchemaDef[],
  rawKey: string,
  scopeFilter?: 'character' | 'non_character',
): StatSchemaDef | undefined {
  const slug = slugifyKey(rawKey, '');
  return schemas.find(s => {
    if (scopeFilter === 'character' && s.scope !== 'character') return false;
    if (scopeFilter === 'non_character' && s.scope === 'character') return false;
    return (
      s.id === rawKey ||
      slugifyKey(s.id, '') === slug ||
      slugifyKey(s.label, '') === slug
    );
  });
}

export interface ReduceTurnResult {
  state: CampaignState;
  deltas: TurnDeltaMap;
  triggeredAlerts: string[];
  touchedCharacterIds: string[];
  touchedPlaceIds: string[];
}

export function applyTurnPatch(
  before: CampaignState,
  template: LumiStatsTemplate,
  patch: ExtractedTurnPatch,
  options: {
    isManualEdit?: boolean;
    incrementTurn?: boolean;
    obfuscationConfig?: { words?: string[]; useOne?: boolean };
  } = {},
): ReduceTurnResult {
  const next = structuredClone(before);
  const bypassLocks = options.isManualEdit === true;
  const canonicalizeLabel = (raw: string): string => {
    const cleaned = cleanStringValue(raw);
    const words = options.obfuscationConfig?.words;
    if (!cleaned || !words?.length) return cleaned;
    return deobfuscateSensitiveWords(
      cleaned,
      words,
      options.obfuscationConfig?.useOne !== false,
    );
  };
  const triggeredAlerts: string[] = [];
  const statDeltas: Record<string, number> = {};
  const characterDeltas: Record<string, Record<string, number>> = {};
  const touchedCharacterSet = new Set<string>();
  const touchedPlaceSet = new Set<string>();

  if (options.incrementTurn) {
    next.turnCount = (next.turnCount || 0) + 1;
  }

  const rawPatchObj = patch as unknown as Record<string, unknown>;
  const sceneSource =
    (patch.scene && typeof patch.scene === 'object' ? (patch.scene as Record<string, unknown>) : undefined) ??
    (rawPatchObj.worldData && typeof rawPatchObj.worldData === 'object' ? (rawPatchObj.worldData as Record<string, unknown>) : undefined);

  const rawElapsed = Number(
    patch.scene?.elapsedMinutes ?? sceneSource?.elapsedMinutes ?? sceneSource?.mins ?? 0,
  );
  const effectiveElapsed =
    Number.isFinite(rawElapsed) && rawElapsed > 0 && rawElapsed <= 10080
      ? Math.round(rawElapsed)
      : 0;
  if (effectiveElapsed > 0) {
    next.elapsedMinutes += effectiveElapsed;
  }

  const coreCfg = template.coreTrackers;
  const coreOv: Partial<Record<BuiltInTrackerId, BuiltInTrackerConfig>> = coreCfg?.overrides ?? {};
  const isBuiltinWritable = (
    id: BuiltInTrackerId,
    enabledFlag: boolean,
  ) => {
    const ov = coreOv[id];
    return bypassLocks || (enabledFlag && !ov?.locked && !ov?.deleted);
  };

  const pillLocked = !bypassLocks && Boolean(coreCfg?.scenePillLocked);
  if (sceneSource) {
    const loc = String(sceneSource.location ?? '').trim();
    const time = String(sceneSource.timeLabel ?? sceneSource.time ?? sceneSource.current_time ?? '').trim();
    const date = String(sceneSource.dateLabel ?? sceneSource.date ?? sceneSource.current_date ?? '').trim();
    const weather = String(sceneSource.weather ?? '').trim();
    const summary = String(sceneSource.beatSummary ?? sceneSource.summary ?? '').trim();

    if (!pillLocked) {
      if (loc) next.scene.location = canonicalizeLabel(loc);
      if (time) next.scene.timeLabel = cleanStringValue(time);
      if (date) next.scene.dateLabel = cleanStringValue(date);
      if (weather) next.scene.weather = cleanStringValue(weather);
    }
    if (summary && isBuiltinWritable('scene_summary', coreCfg?.trackSceneSummary !== false)) {
      next.scene.beatSummary = cleanStringValue(summary);
    }
    if (loc || summary || time || date) {
      next.initialized = true;
    }
    if ((!next.title || next.title === 'Uncharted Story') && next.scene.location) {
      next.title = next.scene.location.split(',')[0]?.trim() || next.scene.location;
    }
  }

  const extraStatBags: Array<Record<string, unknown>> = [];
  if (patch.player && typeof patch.player === 'object') {
    const pObj = patch.player as Record<string, unknown>;
    const condText = pObj.condition ?? pObj.state;
    const actionText = pObj.notableAction ?? pObj.action ?? pObj.notable_action;
    if (
      typeof pObj.attire === 'string' &&
      pObj.attire.trim() &&
      isBuiltinWritable('player_attire', coreCfg?.trackPlayerAttire !== false)
    ) {
      next.player.attire = cleanStringValue(pObj.attire);
    }
    if (
      typeof condText === 'string' &&
      condText.trim() &&
      isBuiltinWritable('player_condition', coreCfg?.trackPlayerCondition !== false)
    ) {
      next.player.condition = cleanStringValue(condText);
    }
    if (
      typeof actionText === 'string' &&
      actionText.trim() &&
      isBuiltinWritable('player_action', Boolean(coreCfg?.trackPlayerAction))
    ) {
      next.player.notableAction = cleanStringValue(actionText);
    }
    const playerStatCandidates: Record<string, unknown> = {};
    for (const [pk, pv] of Object.entries(pObj)) {
      if (
        !['attire', 'condition', 'state', 'notableAction', 'notable_action', 'action', 'name'].includes(pk) &&
        pv !== undefined
      ) {
        playerStatCandidates[pk] = pv;
      }
    }
    if (Object.keys(playerStatCandidates).length > 0) extraStatBags.push(playerStatCandidates);
  }
  if (rawPatchObj.world && typeof rawPatchObj.world === 'object' && !Array.isArray(rawPatchObj.world)) {
    extraStatBags.push(rawPatchObj.world as Record<string, unknown>);
  }

  if (options.incrementTurn || effectiveElapsed > 0) {
    next.modifiers = next.modifiers.filter(mod => {
      if (mod.remainingTurns !== undefined && options.incrementTurn) {
        mod.remainingTurns -= 1;
        if (mod.remainingTurns <= 0) return false;
      }
      if (mod.remainingMinutes !== undefined && effectiveElapsed > 0) {
        mod.remainingMinutes -= effectiveElapsed;
        if (mod.remainingMinutes <= 0) return false;
      }
      return true;
    });
  }

  const defaultReason = next.scene.beatSummary || 'Scene progression';

  const checkThresholdAlerts = (
    schema: StatSchemaDef,
    prevVal: number | undefined,
    nextVal: number,
    ownerLabel?: string,
  ) => {
    if (!schema.alerts?.length) return;
    for (const alert of schema.alerts) {
      const crossedAbove =
        alert.direction === 'above' &&
        (prevVal === undefined || prevVal < alert.value) &&
        nextVal >= alert.value;
      const crossedBelow =
        alert.direction === 'below' &&
        (prevVal === undefined || prevVal > alert.value) &&
        nextVal <= alert.value;
      if (crossedAbove || crossedBelow) {
        const prefix = ownerLabel ? `${ownerLabel} · ` : '';
        triggeredAlerts.push(`${schema.icon} ${prefix}${alert.message}`);
      }
    }
  };

  const applyNonCharStat = (schema: StatSchemaDef, rawMutation: StatPatchInput | number | string | boolean) => {
    const existing = next.stats[schema.id];
    if (!bypassLocks && (schema.locked || existing?.locked)) return;

    const isTextStyle =
      Boolean(schema.displayStyle && schema.displayStyle !== 'auto') ||
      ['text', 'tags', 'tier', 'skill_tree', 'xp_level', 'attributes', 'inventory', 'status_fx'].includes(schema.kind);
    const isNumericStat =
      !isTextStyle && ['meter', 'number', 'clock', 'pips', 'hearts', 'currency'].includes(schema.kind);

    const wasCalibrated = Boolean(existing?.calibrated);
    const mutation = normalizeStatMutation(rawMutation, wasCalibrated, isNumericStat);
    if (!mutation) return;

    const prevValue = existing?.calibrated ? existing.value : null;
    let finalValue: number | string | boolean;
    let numericDelta = 0;

    if (isNumericStat && Number.isFinite(Number(mutation.value))) {
      const rawNum = Number(mutation.value);
      if (!Number.isFinite(rawNum)) return;
      const existingParsed =
        typeof existing?.value === 'number'
          ? existing.value
          : typeof existing?.value === 'string'
            ? parseNumericStringMutation(existing.value, 'set')?.value
            : undefined;
      const baseNum =
        wasCalibrated && typeof existingParsed === 'number'
          ? existingParsed
          : typeof schema.defaultValue === 'number'
            ? schema.defaultValue
            : schema.min;
      const isIntKind = ['clock', 'pips', 'hearts', 'currency'].includes(schema.kind);

      if (mutation.op === 'delta') {
        if (wasCalibrated && rawNum === 0) return;
        const computed = baseNum + rawNum;
        finalValue = Math.max(
          schema.min,
          Math.min(schema.max, isIntKind ? Math.round(computed) : Number(computed.toFixed(2))),
        );
      } else {
        finalValue = Math.max(
          schema.min,
          Math.min(schema.max, isIntKind ? Math.round(rawNum) : Number(rawNum.toFixed(2))),
        );
      }
      numericDelta =
        typeof prevValue === 'number'
          ? Number((finalValue - prevValue).toFixed(2))
          : Number((finalValue - baseNum).toFixed(2));
      checkThresholdAlerts(schema, typeof prevValue === 'number' ? prevValue : undefined, finalValue);
    } else if (schema.kind === 'boolean') {
      finalValue = mutation.value === true || mutation.value === 1 || String(mutation.value).toLowerCase() === 'true';
    } else {
      finalValue = cleanStringValue(String(mutation.value)).slice(0, 4000);
    }

    next.stats[schema.id] = {
      id: schema.id,
      scope: schema.scope === 'character' ? 'player' : schema.scope,
      value: finalValue,
      calibrated: true,
      locked: Boolean(existing?.locked || schema.locked),
      ...(mutation.reason
        ? { lastReason: mutation.reason }
        : existing?.lastReason && existing.lastReason !== next.scene.beatSummary
          ? { lastReason: existing.lastReason }
          : {}),
    };

    if (numericDelta !== 0) {
      statDeltas[schema.id] = numericDelta;
    }

    if (prevValue !== finalValue) {
      const audit: StatAuditEntry = {
        id: `aud_${schema.id}_${next.turnCount}_${next.auditLog.length + 1}`,
        statId: schema.id,
        statLabel: `${schema.icon} ${schema.label}`,
        op: bypassLocks ? 'manual' : mutation.op,
        before: prevValue,
        after: finalValue,
        numericDelta,
        reason: mutation.reason || defaultReason,
        turn: next.turnCount,
        minute: next.elapsedMinutes,
        at: new Date().toISOString(),
      };
      next.auditLog.push(audit);
      if (next.auditLog.length > 200) next.auditLog.shift();
    }
  };

  const applyCharMeter = (
    char: CharacterRecord,
    schema: StatSchemaDef,
    rawMutation: StatPatchInput | number | string | boolean,
  ) => {
    const existing = char.meters[schema.id];
    if (!bypassLocks && (schema.locked || existing?.locked)) return;

    const isCharTextStyle =
      Boolean(schema.displayStyle && schema.displayStyle !== 'auto') ||
      ['text', 'tags', 'tier', 'skill_tree', 'xp_level', 'attributes', 'inventory', 'status_fx'].includes(schema.kind);
    const isCharNumeric =
      !isCharTextStyle && ['meter', 'number', 'clock', 'pips', 'hearts', 'currency'].includes(schema.kind);

    const wasCalibrated = Boolean(existing?.calibrated);
    const mutation = normalizeStatMutation(rawMutation, wasCalibrated, isCharNumeric);
    if (!mutation) return;

    const prevValue = wasCalibrated && existing ? existing.value : null;
    let finalValue: number | string | boolean;
    let numericDelta = 0;

    if (isCharNumeric && Number.isFinite(Number(mutation.value))) {
      const rawNum = Number(mutation.value);
      const existingParsed =
        typeof existing?.value === 'number'
          ? existing.value
          : typeof existing?.value === 'string'
            ? parseNumericStringMutation(existing.value, 'set')?.value
            : undefined;
      const baseNum =
        wasCalibrated && typeof existingParsed === 'number'
          ? existingParsed
          : typeof schema.defaultValue === 'number'
            ? schema.defaultValue
            : schema.min;

      if (mutation.op === 'delta') {
        if (wasCalibrated && rawNum === 0) return;
        const computed = baseNum + rawNum;
        finalValue = Math.max(schema.min, Math.min(schema.max, Math.round(computed)));
      } else {
        finalValue = Math.max(schema.min, Math.min(schema.max, Math.round(rawNum)));
      }
      numericDelta =
        typeof prevValue === 'number'
          ? finalValue - prevValue
          : finalValue - (typeof schema.defaultValue === 'number' ? schema.defaultValue : schema.min);
      checkThresholdAlerts(schema, typeof prevValue === 'number' ? prevValue : undefined, finalValue, char.name);
    } else if (schema.kind === 'boolean') {
      finalValue = mutation.value === true || mutation.value === 1 || String(mutation.value).toLowerCase() === 'true';
    } else {
      finalValue = cleanStringValue(String(mutation.value)).slice(0, 4000);
    }

    char.meters[schema.id] = {
      value: finalValue,
      calibrated: true,
      locked: Boolean(existing?.locked || schema.locked),
      ...(mutation.reason
        ? { lastReason: mutation.reason }
        : existing?.lastReason && existing.lastReason !== next.scene.beatSummary
          ? { lastReason: existing.lastReason }
          : {}),
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
        op: bypassLocks ? 'manual' : mutation.op,
        before: prevValue,
        after: finalValue,
        numericDelta,
        reason: mutation.reason || defaultReason,
        turn: next.turnCount,
        minute: next.elapsedMinutes,
        at: new Date().toISOString(),
      });
      if (next.auditLog.length > 200) next.auditLog.shift();
    }
  };

  const findExistingCharacter = (
    rawId: unknown,
    rawName: string,
  ): CharacterRecord | undefined => {
    const cleanName = cleanStringValue(rawName);
    const idSlug = rawId ? slugifyKey(rawId, '') : '';
    const nameSlug = cleanName ? slugifyKey(cleanName, '') : '';
    const lowName = cleanName.toLowerCase();

    if (idSlug && next.characters[idSlug]) return next.characters[idSlug];
    if (nameSlug && next.characters[nameSlug]) return next.characters[nameSlug];

    const all = Object.values(next.characters);
    return all.find(
      c =>
        c.name.toLowerCase() === lowName ||
        c.aliases.some(a => a.toLowerCase() === lowName),
    );
  };

  const parsePresenceFlag = (val: unknown): boolean | undefined => {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'number') return val !== 0;
    if (typeof val === 'string') {
      const low = val.trim().toLowerCase();
      if (['true', 'yes', '1', 'present', 'in_scene', 'in scene', 'here'].includes(low)) {
        return true;
      }
      if (['false', 'no', '0', 'away', 'offscreen', 'off-screen', 'absent', 'left'].includes(low)) {
        return false;
      }
    }
    return undefined;
  };

  const sceneLocPrimary = (next.scene.location || '').split(',')[0]?.trim().toLowerCase() || '';
  const explicitlyPresentCharIds = new Set<string>();
  const explicitlyAbsentCharIds = new Set<string>();

  if (Array.isArray(patch.characters)) {
    for (const rawChar of patch.characters) {
      if (!rawChar || typeof rawChar !== 'object') continue;
      const rawExplicitName =
        typeof rawChar.name === 'string' ? canonicalizeLabel(rawChar.name) : '';
      const fromIdFallback = !rawExplicitName;
      const rawCandidate = rawExplicitName || canonicalizeLabel(String(rawChar.id ?? ''));
      const name = normalizeDisplayLabel(rawCandidate, fromIdFallback);
      if (!name) continue;
      const slug = slugifyKey(rawChar.id ?? name, 'npc');
      if (slug === 'player') continue;

      const existing = findExistingCharacter(rawChar.id, name);
      const charId = existing?.id ?? slug;
      touchedCharacterSet.add(charId);

      const rawCharRec = rawChar as Record<string, unknown>;
      const parsedPresent = parsePresenceFlag(rawCharRec.present);
      const charLocText = cleanStringValue(String(rawCharRec.location ?? rawCharRec.locationId ?? ''));
      const charLocLow = charLocText.toLowerCase();
      const charLocMatchesScene = Boolean(
        charLocLow &&
          sceneLocPrimary &&
          (charLocLow === sceneLocPrimary ||
            charLocLow.includes(sceneLocPrimary) ||
            sceneLocPrimary.includes(charLocLow)),
      );
      const charLocIsExplicitlyAway = Boolean(
        charLocLow &&
          (/\b(?:away|offscreen|off-screen|elsewhere|outside|hallway|downstairs|upstairs)\b/.test(charLocLow) ||
            (sceneLocPrimary && !charLocMatchesScene)),
      );

      const char: CharacterRecord = existing ?? {
        id: charId,
        name,
        aliases: [],
        roleSummary: cleanStringValue(rawChar.roleSummary ?? 'Story Character'),
        present: parsedPresent !== undefined ? parsedPresent : !charLocIsExplicitlyAway,
        locationId: next.currentPlaceId,
        demeanor: '',
        innerThought: '',
        immediateGoal: '',
        attire: '',
        fields: {},
        meters: {},
        peerBonds: {},
        conditions: [],
        secrets: [],
        expressionAssets: {},
        notes: '',
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
      } else if (charLocIsExplicitlyAway) {
        char.present = false;
      } else if (
        existing &&
        !existing.present &&
        existing.demeanor === 'Unseen' &&
        !charLocIsExplicitlyAway
      ) {
        char.present = true;
      }

      if (char.present) explicitlyPresentCharIds.add(charId);
      else explicitlyAbsentCharIds.add(charId);

      if (charLocText) {
        const matchedPlace =
          next.places[slugifyKey(charLocText, '')] ??
          Object.values(next.places).find(p => p.name.toLowerCase() === charLocLow);
        char.locationId = matchedPlace ? matchedPlace.id : slugifyKey(charLocText, char.locationId || '');
      }

      const unwrapFieldText = (raw: unknown): string => {
        if (raw === null || raw === undefined) return '';
        if (typeof raw === 'string') {
          const cleaned = cleanStringValue(raw);
          return /^(?:none|n\/a|\?|∅|unchanged)$/i.test(cleaned) ? '' : cleaned;
        }
        if (Array.isArray(raw)) {
          return raw.map(unwrapFieldText).filter(Boolean).join('; ');
        }
        if (typeof raw === 'object' && 'value' in (raw as Record<string, unknown>)) {
          return unwrapFieldText((raw as StatPatchInput).value);
        }
        return '';
      };

      const DOSSIER_KEY_ALIASES: Record<string, string> = {
        role: 'role_summary',
        rolesummary: 'role_summary',
        role_summary: 'role_summary',
        relationshipstatus: 'role_summary',
        emotion: 'demeanor',
        mood: 'demeanor',
        thought: 'inner_thought',
        thoughts: 'inner_thought',
        innerthought: 'inner_thought',
        inner_thought: 'inner_thought',
        internal_thought: 'inner_thought',
        internalthought: 'inner_thought',
        inner_monologue: 'inner_thought',
        innermonologue: 'inner_thought',
        monologue: 'inner_thought',
        goal: 'immediate_goal',
        immediategoal: 'immediate_goal',
        immediate_goal: 'immediate_goal',
        aim: 'immediate_goal',
        attire: 'attire_layers',
        attire_layers: 'attire_layers',
        clothing: 'attire_layers',
        outfit: 'attire_layers',
      };

      const roleVal = unwrapFieldText(
        rawChar.roleSummary ?? rawCharRec.role_summary ?? rawCharRec.role ?? rawCharRec.relationshipStatus,
      );
      const demVal = unwrapFieldText(rawChar.demeanor ?? rawCharRec.emotion ?? rawCharRec.mood);
      const thoughtVal = unwrapFieldText(
        rawChar.innerThought ??
          rawCharRec.inner_thought ??
          rawCharRec.thought ??
          rawCharRec.thoughts ??
          rawCharRec.internal_thought ??
          rawCharRec.internalThought ??
          rawCharRec.inner_monologue ??
          rawCharRec.innerMonologue ??
          rawCharRec.monologue,
      );
      const goalVal = unwrapFieldText(
        rawChar.immediateGoal ?? rawCharRec.immediate_goal ?? rawCharRec.goal ?? rawCharRec.aim,
      );
      const attireVal = unwrapFieldText(
        rawChar.attire ?? rawCharRec.attire_layers ?? rawCharRec.clothing ?? rawCharRec.outfit,
      );

      const isDossierFieldAllowed = (fid: string) => {
        if (bypassLocks) return true;
        const found = template.dossierFields.find(f => f.id === fid);
        return Boolean(found && found.enabled && !found.locked);
      };

      const assignDossierField = (targetKey: string, val: string) => {
        const cleaned = cleanStringValue(val).slice(0, 1000);
        if (!cleaned) return;
        char.fields[targetKey] = cleaned;
        if (targetKey === 'role_summary') char.roleSummary = cleaned;
        else if (targetKey === 'demeanor') char.demeanor = cleaned;
        else if (targetKey === 'inner_thought') char.innerThought = cleaned;
        else if (targetKey === 'immediate_goal') char.immediateGoal = cleaned;
        else if (targetKey === 'attire_layers') char.attire = cleaned;
      };

      if (roleVal && isDossierFieldAllowed('role_summary')) assignDossierField('role_summary', roleVal);
      if (demVal && isDossierFieldAllowed('demeanor')) assignDossierField('demeanor', demVal);
      if (thoughtVal && isDossierFieldAllowed('inner_thought')) assignDossierField('inner_thought', thoughtVal);
      if (goalVal && isDossierFieldAllowed('immediate_goal')) assignDossierField('immediate_goal', goalVal);
      if (attireVal && isDossierFieldAllowed('attire_layers')) assignDossierField('attire_layers', attireVal);
      if (Array.isArray(rawChar.aliases)) {
        char.aliases = [...new Set([...char.aliases, ...rawChar.aliases.map(a => cleanStringValue(String(a)))])].slice(0, 12);
      }
      if (
        Array.isArray(rawChar.conditions) &&
        isBuiltinWritable('npc_conditions', coreCfg?.trackNpcConditions !== false)
      ) {
        char.conditions = rawChar.conditions.map(c => cleanStringValue(String(c))).filter(Boolean).slice(0, 10);
      }
      if (typeof rawCharRec.notes === 'string') {
        char.notes = cleanStringValue(rawCharRec.notes).slice(0, 2000);
      }

      const resolveDossierKey = (rawKey: string) => {
        const aliasKey = DOSSIER_KEY_ALIASES[rawKey.toLowerCase()] ?? DOSSIER_KEY_ALIASES[slugifyKey(rawKey, '')];
        const lookupKey = aliasKey ?? rawKey;
        const matchedField = template.dossierFields.find(
          f => f.id === lookupKey || slugifyKey(f.label, '') === slugifyKey(rawKey, ''),
        );
        return { matchedField, targetKey: matchedField?.id ?? aliasKey ?? slugifyKey(rawKey, 'field') };
      };

      if (rawChar.fields && typeof rawChar.fields === 'object') {
        for (const [fk, fv] of Object.entries(rawChar.fields)) {
          const textVal = unwrapFieldText(fv);
          if (!textVal) continue;
          const { matchedField, targetKey } = resolveDossierKey(fk);
          if (!bypassLocks && matchedField?.locked) continue;
          assignDossierField(targetKey, textVal);
        }
      }

      const rawToPlayer =
        rawChar.bondToPlayer ??
        rawCharRec.npcToUser ??
        rawCharRec.relationToPlayer ??
        (roleVal && !char.bondToPlayer ? roleVal : undefined);
      const nextToPlayer = normalizeRelationLink(rawToPlayer, char.bondToPlayer);
      if (nextToPlayer) char.bondToPlayer = nextToPlayer;

      const rawFromPlayer =
        rawChar.bondFromPlayer ??
        rawCharRec.userToNpc ??
        rawCharRec.playerBond;
      const nextFromPlayer = normalizeRelationLink(rawFromPlayer, char.bondFromPlayer);
      if (nextFromPlayer) char.bondFromPlayer = nextFromPlayer;

      const RESERVED_CHAR_KEYS = new Set([
        'id', 'name', 'aliases', 'present', 'role', 'role_summary', 'roleSummary', 'relationshipStatus',
        'demeanor', 'emotion', 'mood', 'innerThought', 'inner_thought', 'thought', 'thoughts',
        'internal_thought', 'internalThought', 'inner_monologue', 'innerMonologue', 'monologue',
        'immediateGoal', 'immediate_goal', 'goal', 'aim', 'attire', 'attire_layers', 'clothing', 'outfit',
        'location', 'locationId', 'conditions', 'fields', 'meters', 'stats', 'peerBonds', 'npcBonds',
        'bonds', 'secrets', 'notes', 'bondToPlayer', 'bondFromPlayer', 'npcToUser', 'userToNpc',
        'relationToPlayer', 'playerBond',
      ]);
      const combinedMeters: Record<string, StatPatchInput | number | string | boolean> = {};
      if (rawCharRec.stats && typeof rawCharRec.stats === 'object' && !Array.isArray(rawCharRec.stats)) {
        Object.assign(combinedMeters, rawCharRec.stats);
      }
      if (rawChar.meters && typeof rawChar.meters === 'object') {
        Object.assign(combinedMeters, rawChar.meters);
      }
      for (const [ck, cv] of Object.entries(rawCharRec)) {
        if (RESERVED_CHAR_KEYS.has(ck) || cv === null || cv === undefined) continue;
        if (typeof cv === 'number' || typeof cv === 'boolean' || typeof cv === 'string') {
          const { matchedField } = resolveDossierKey(ck);
          if (matchedField && typeof cv === 'string') {
            const textVal = unwrapFieldText(cv);
            if (textVal && (bypassLocks || !matchedField.locked)) assignDossierField(matchedField.id, textVal);
          } else {
            combinedMeters[ck] = cv;
          }
        }
      }

      for (const [mk, mv] of Object.entries(combinedMeters)) {
        const schema = matchStatSchema(template.stats, mk, 'character');
        if (!schema) {
          const { matchedField } = resolveDossierKey(mk);
          const textVal = unwrapFieldText(mv);
          if (matchedField && textVal && (bypassLocks || !matchedField.locked)) {
            assignDossierField(matchedField.id, textVal);
          }
          continue;
        }
        applyCharMeter(char, schema, mv);
      }

      const rawBondsList = Array.isArray(rawChar.peerBonds)
        ? rawChar.peerBonds
        : Array.isArray(rawCharRec.npcBonds)
          ? (rawCharRec.npcBonds as unknown[])
          : Array.isArray(rawCharRec.bonds)
            ? (rawCharRec.bonds as unknown[])
            : [];

      for (const rawBond of rawBondsList) {
        if (!rawBond || typeof rawBond !== 'object') continue;
        const bObj = rawBond as Record<string, unknown>;
        const targetName = cleanStringValue(String(bObj.target ?? bObj.toName ?? bObj.name ?? bObj.to ?? ''));
        if (!targetName) continue;
        const matchedPeer = findExistingCharacter(bObj.toId, targetName);
        const targetSlug = matchedPeer?.id ?? slugifyKey(bObj.toId ?? targetName, 'npc');
        const resolvedTargetName = matchedPeer
          ? pickBetterCasedLabel(matchedPeer.name, targetName, false)
          : normalizeDisplayLabel(targetName, false);
        const playerSlug = slugifyKey(next.player.name || 'player', 'player');
        if (
          !targetSlug ||
          targetSlug === charId ||
          targetSlug === 'player' ||
          targetSlug === 'user' ||
          (next.player.name && targetSlug === playerSlug)
        ) {
          continue;
        }

        const prevBond = char.peerBonds[targetSlug];
        const nextMeters: Record<string, number | string | boolean> = {
          ...(prevBond?.meters ?? {}),
        };

        const resolveSchemaBondValue = (
          schema: StatSchemaDef,
          rawV: unknown,
          prevVal: number | string | boolean | undefined,
        ): number | string | boolean | undefined => {
          if (rawV === null || rawV === undefined) return undefined;
          const unwrapped =
            typeof rawV === 'object' && !Array.isArray(rawV) && 'value' in (rawV as Record<string, unknown>)
              ? (rawV as StatPatchInput).value
              : rawV;
          const explicitDelta =
            typeof rawV === 'object' && !Array.isArray(rawV) && (rawV as StatPatchInput).op === 'delta';

          if (isNumericCharacterMeterSchema(schema)) {
            const baseNum =
              typeof prevVal === 'number' && Number.isFinite(prevVal)
                ? prevVal
                : typeof schema.defaultValue === 'number' && Number.isFinite(schema.defaultValue)
                  ? schema.defaultValue
                  : schema.min;

            if (typeof unwrapped === 'number' && Number.isFinite(unwrapped)) {
              const target = explicitDelta ? baseNum + unwrapped : unwrapped;
              return Math.max(schema.min, Math.min(schema.max, Math.round(target)));
            }
            if (typeof unwrapped === 'string') {
              const t = cleanStringValue(unwrapped);
              const signed = t.match(/^([+-])\s*(\d+(?:\.\d+)?)$/);
              if (signed) {
                const delta = Number(`${signed[1]}${signed[2]}`);
                return Math.max(schema.min, Math.min(schema.max, Math.round(baseNum + delta)));
              }
              const plain = Number(t);
              if (Number.isFinite(plain)) {
                const target = explicitDelta ? baseNum + plain : plain;
                return Math.max(schema.min, Math.min(schema.max, Math.round(target)));
              }
            }
            return undefined;
          }

          if (schema.kind === 'boolean') {
            return unwrapped === true || unwrapped === 1 || String(unwrapped).toLowerCase() === 'true';
          }
          const txt = cleanStringValue(String(unwrapped)).slice(0, 1000);
          return txt || undefined;
        };

        const applyBondEntry = (rawKey: string, rawVal: unknown) => {
          const schema = matchStatSchema(template.stats, rawKey, 'character');
          if (!schema || !schema.enabled) return;
          const resolved = resolveSchemaBondValue(schema, rawVal, nextMeters[schema.id]);
          if (resolved !== undefined) {
            nextMeters[schema.id] = resolved;
          }
        };

        const RESERVED_BOND_KEYS = new Set([
          'target', 'to', 'toId', 'toName', 'name', 'label', 'relation', 'category',
          'attitude', 'note', 'thought', 'dynamic', 'meters', 'stats',
        ]);
        if (bObj.meters && typeof bObj.meters === 'object' && !Array.isArray(bObj.meters)) {
          for (const [mk, mv] of Object.entries(bObj.meters as Record<string, unknown>)) {
            applyBondEntry(mk, mv);
          }
        }
        if (bObj.stats && typeof bObj.stats === 'object' && !Array.isArray(bObj.stats)) {
          for (const [mk, mv] of Object.entries(bObj.stats as Record<string, unknown>)) {
            applyBondEntry(mk, mv);
          }
        }
        for (const [bk, bv] of Object.entries(bObj)) {
          if (RESERVED_BOND_KEYS.has(bk)) continue;
          applyBondEntry(bk, bv);
        }

        const resolvedLabel = cleanStringValue(
          String(bObj.label ?? bObj.relation ?? bObj.dynamic ?? prevBond?.label ?? 'Acquaintance'),
        );
        const resolvedAttitude = cleanStringValue(
          String(bObj.attitude ?? bObj.note ?? bObj.thought ?? prevBond?.attitude ?? ''),
        );
        const validCat = new Set(['family', 'friend', 'romance', 'rival', 'professional', 'neutral']);
        const labelChanged = Boolean(prevBond && resolvedLabel !== prevBond.label);
        const attitudeChanged = Boolean(prevBond && resolvedAttitude !== prevBond.attitude);
        const inferredCat = inferBondCategory(resolvedLabel, resolvedAttitude);
        const resolvedCategory =
          typeof bObj.category === 'string' && validCat.has(bObj.category)
            ? (bObj.category as BondCategory)
            : labelChanged || attitudeChanged
              ? (inferredCat !== 'neutral' ? inferredCat : (prevBond?.category ?? 'neutral'))
              : (prevBond?.category ?? inferredCat);

        char.peerBonds[targetSlug] = {
          fromId: charId,
          toId: targetSlug,
          toName: resolvedTargetName,
          label: resolvedLabel,
          attitude: resolvedAttitude,
          category: resolvedCategory,
          meters: seedPeerBondMetersFromTemplate(nextMeters, template),
          updatedTurn: next.turnCount,
        };

        if (!next.characters[targetSlug]) {
          const stubMeters: CharacterRecord['meters'] = {};
          for (const schema of template.stats.filter(s => s.enabled && s.scope === 'character')) {
            stubMeters[schema.id] = {
              value: schema.defaultValue,
              calibrated: false,
              locked: schema.locked,
            };
          }
          next.characters[targetSlug] = {
            id: targetSlug,
            name: resolvedTargetName,
            aliases: [],
            roleSummary: cleanStringValue(String(bObj.label ?? 'Mentioned Character')),
            present: false,
            locationId: '',
            demeanor: 'Unseen',
            innerThought: '',
            immediateGoal: '',
            attire: '',
            fields: {},
            meters: stubMeters,
            peerBonds: {},
            conditions: [],
            secrets: [],
            expressionAssets: {},
            notes: '',
          };
          touchedCharacterSet.add(targetSlug);
        }
      }

      for (const schema of template.stats.filter(s => s.enabled && s.scope === 'character')) {
        if (!char.meters[schema.id]) {
          char.meters[schema.id] = {
            value: schema.defaultValue,
            calibrated: false,
            locked: schema.locked,
          };
        }
      }

      if (
        Array.isArray(rawChar.secrets) &&
        isBuiltinWritable('npc_secrets', coreCfg?.trackNpcSecrets !== false)
      ) {
        for (const sec of rawChar.secrets) {
          if (!sec?.title?.trim()) continue;
          const sid = slugifyKey(sec.id ?? sec.title, 'sec');
          const stage: 'rumor' | 'clue' | 'confirmed' =
            sec.stage === 'confirmed' || sec.stage === 'clue' ? sec.stage : 'rumor';
          const idx = char.secrets.findIndex(s => s.id === sid);
          const item = {
            id: sid,
            title: cleanStringValue(sec.title),
            detail: cleanStringValue(String(sec.detail ?? '')),
            stage,
          };
          if (idx >= 0) char.secrets[idx] = item;
          else char.secrets.push(item);
        }
      }

      next.characters[charId] = char;
      next.initialized = true;
    }
  }

  // Ensure existing NPC↔NPC peer bonds have category & template-defined character meters normalized (no hardcoded stats)
  if (template.surfaces.trackNpcBonds !== false) {
    const castList = Object.values(next.characters);
    for (const charA of castList) {
      charA.peerBonds ??= {};
      for (const bondAB of Object.values(charA.peerBonds)) {
        bondAB.category ??= inferBondCategory(bondAB.label, bondAB.attitude);
        bondAB.meters = seedPeerBondMetersFromTemplate(bondAB.meters ?? {}, template);
      }
    }
  }

  const mergedStatsBag: Record<string, StatPatchInput | number | string | boolean> = {};
  for (const bag of extraStatBags) {
    Object.assign(mergedStatsBag, bag as Record<string, StatPatchInput | number | string | boolean>);
  }
  if (patch.stats && typeof patch.stats === 'object') {
    Object.assign(mergedStatsBag, patch.stats);
  }
  if (Object.keys(mergedStatsBag).length > 0) {
    for (const [sk, sv] of Object.entries(mergedStatsBag)) {
      const nonCharSchema = matchStatSchema(template.stats, sk, 'non_character');
      if (nonCharSchema) {
        applyNonCharStat(nonCharSchema, sv);
        continue;
      }
      const charSchema = matchStatSchema(template.stats, sk, 'character');
      if (charSchema) {
        const presentChars = Object.values(next.characters).filter(c => c.present);
        const targets = presentChars.length ? presentChars : Object.values(next.characters).slice(0, 1);
        for (const target of targets) {
          applyCharMeter(target, charSchema, sv);
        }
        continue;
      }
      if (bypassLocks) {
        const label = sk
          .replace(/[_-]+/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());
        const adopted = createStatSchema({
          id: slugifyKey(sk, 'stat'),
          label,
          scope: 'player',
          kind: typeof sv === 'boolean' ? 'boolean' : typeof sv === 'string' && Number.isNaN(Number(sv)) ? 'text' : 'meter',
          min: 0,
          max: 100,
          volatility: 'progressive',
        });
        applyNonCharStat(adopted, sv);
      }
    }
  }

  next.mapZones ??= {};
  next.mapPaths ??= [];

  const ZONE_PALETTE = ['#38bdf8', '#f59e0b', '#10b981', '#a78bfa', '#f472b6', '#2dd4bf'];
  const VALID_ZONE_KINDS = new Set<MapZoneKind>(['building', 'district', 'region', 'ship_deck', 'realm']);
  const VALID_PATH_KINDS = new Set<MapPathKind>(['door', 'hallway', 'stairs', 'street', 'trail', 'transit', 'portal']);

  const ensureZone = (
    rawZoneName: string,
    opts?: { id?: string; kind?: MapZoneKind; icon?: string; color?: string; description?: string },
  ): string => {
    const cleanName = normalizeDisplayLabel(rawZoneName, false);
    const zid = slugifyKey(opts?.id ?? cleanName, 'zone_main');
    const existing = next.mapZones![zid];
    const kind: MapZoneKind =
      opts?.kind && VALID_ZONE_KINDS.has(opts.kind)
        ? opts.kind
        : existing?.kind ??
          (/\b(?:ship|deck|bay|bridge|station)\b/i.test(cleanName)
            ? 'ship_deck'
            : /\b(?:district|quarter|ward|city|town|market)\b/i.test(cleanName)
              ? 'district'
              : /\b(?:forest|valley|realm|kingdom|wild|coast)\b/i.test(cleanName)
                ? 'region'
                : 'building');
    const defaultIcon =
      kind === 'ship_deck' ? '🚀' : kind === 'district' ? '🌆' : kind === 'region' ? '🏔️' : kind === 'realm' ? '✨' : '🏛️';
    next.mapZones![zid] = {
      id: zid,
      name: existing
        ? pickBetterCasedLabel(existing.name, rawZoneName, false)
        : (cleanName || 'Local Area'),
      kind,
      icon: opts?.icon?.trim().slice(0, 8) || existing?.icon || defaultIcon,
      color:
        opts?.color?.trim() ||
        existing?.color ||
        ZONE_PALETTE[Object.keys(next.mapZones!).length % ZONE_PALETTE.length]!,
      description: opts?.description?.trim()
        ? cleanStringValue(opts.description)
        : existing?.description || '',
    };
    return zid;
  };

  const upsertPathEdge = (raw: {
    fromId: string;
    toId: string;
    pathType?: MapPathKind;
    label?: string;
    travelMinutes?: number;
    locked?: boolean;
  }) => {
    if (!raw.fromId || !raw.toId || raw.fromId === raw.toId) return;
    if (!next.places[raw.fromId] || !next.places[raw.toId]) return;
    const [a, b] = [raw.fromId, raw.toId].sort();
    const edgeId = `${a}__${b}`;
    const existingIdx = next.mapPaths!.findIndex(e => e.id === edgeId);
    const prev = existingIdx >= 0 ? next.mapPaths![existingIdx] : undefined;
    const pType: MapPathKind =
      raw.pathType && VALID_PATH_KINDS.has(raw.pathType)
        ? raw.pathType
        : prev?.pathType ??
          (next.places[raw.fromId]!.zoneId === next.places[raw.toId]!.zoneId ? 'door' : 'street');
    const edge: MapPathEdge = {
      id: edgeId,
      fromId: a!,
      toId: b!,
      pathType: pType,
      ...(raw.label?.trim() ? { label: cleanStringValue(raw.label) } : prev?.label ? { label: prev.label } : {}),
      travelMinutes: Math.max(1, Math.round(Number(raw.travelMinutes ?? prev?.travelMinutes ?? next.places[raw.toId]!.travelMinutes ?? 5))),
      ...(raw.locked !== undefined ? { locked: Boolean(raw.locked) } : prev?.locked ? { locked: prev.locked } : {}),
    };
    if (existingIdx >= 0) next.mapPaths![existingIdx] = edge;
    else next.mapPaths!.push(edge);

    if (!next.places[raw.fromId]!.connectedIds.includes(raw.toId)) {
      next.places[raw.fromId]!.connectedIds.push(raw.toId);
    }
    if (!next.places[raw.toId]!.connectedIds.includes(raw.fromId)) {
      next.places[raw.toId]!.connectedIds.push(raw.fromId);
    }
  };

  const placesWritable = isBuiltinWritable('places', coreCfg?.trackPlaces !== false);

  if (placesWritable && Array.isArray(patch.zones)) {
    for (const rz of patch.zones) {
      if (!rz?.name?.trim()) continue;
      ensureZone(rz.name, {
        id: rz.id,
        kind: rz.kind,
        icon: rz.icon,
        color: rz.color,
        description: rz.description,
      });
    }
  }

  const matchOrCreatePlaceId = (rawPlaceName: string, explicitId?: unknown): string => {
    const canonical = canonicalizeLabel(rawPlaceName);
    const low = canonical.toLowerCase();
    const byName = Object.values(next.places).find(
      p => p.name.toLowerCase() === low || canonicalizeLabel(p.name).toLowerCase() === low,
    );
    if (byName) return byName.id;
    return slugifyKey(explicitId ?? canonical, 'place');
  };

  if (placesWritable && next.scene.location) {
    const locParts = canonicalizeLabel(next.scene.location)
      .split(/\s*(?:,|—|–|\|)\s*/)
      .map(s => s.trim())
      .filter(Boolean);
    const primaryName = normalizeDisplayLabel(locParts[0] || next.scene.location, false);
    const secondaryZoneName = locParts[1] || '';
    const placeId = matchOrCreatePlaceId(primaryName);
    const prevPlaceId = next.currentPlaceId;
    const inferredZoneId = secondaryZoneName
      ? ensureZone(secondaryZoneName)
      : next.places[placeId]?.zoneId ?? (prevPlaceId ? next.places[prevPlaceId]?.zoneId : undefined);

    if (!next.places[placeId]) {
      next.places[placeId] = {
        id: placeId,
        name: primaryName,
        category: 'interior',
        ...(inferredZoneId ? { zoneId: inferredZoneId } : {}),
        icon: '📍',
        description: next.scene.beatSummary || 'Current scene location.',
        connectedIds: prevPlaceId && prevPlaceId !== placeId ? [prevPlaceId] : [],
        travelMinutes: 5,
        visited: true,
        atmosphere: next.scene.weather,
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
    const locationChanged = Boolean(prevPlaceId && prevPlaceId !== placeId);
    next.currentPlaceId = placeId;
    for (const actor of Object.values(next.characters)) {
      if (!actor.present) continue;
      if (!locationChanged || explicitlyPresentCharIds.has(actor.id)) {
        actor.locationId = placeId;
      } else if (!explicitlyAbsentCharIds.has(actor.id)) {
        // Room changed and this NPC was not reported in the new room
        actor.present = false;
      }
    }
  }

  if (placesWritable && Array.isArray(patch.places)) {
    for (const rp of patch.places) {
      if (!rp?.name?.trim()) continue;
      const canonicalPlaceName = canonicalizeLabel(rp.name);
      const pid = matchOrCreatePlaceId(canonicalPlaceName, rp.id);
      const existing = next.places[pid];
      const cleanName = pickBetterCasedLabel(existing?.name, canonicalPlaceName, false);

      let resolvedZoneId = rp.zoneId?.trim() || existing?.zoneId;
      if (rp.zone?.trim()) {
        resolvedZoneId = ensureZone(rp.zone, { id: rp.zoneId });
      } else if (!resolvedZoneId && next.currentPlaceId && next.places[next.currentPlaceId]?.zoneId) {
        resolvedZoneId = next.places[next.currentPlaceId]!.zoneId;
      }

      const rawConns = (rp.connectedNames ?? [])
        .map(n => {
          const cleanConn = cleanStringValue(String(n));
          const byName = Object.values(next.places).find(
            p => p.name.toLowerCase() === cleanConn.toLowerCase(),
          );
          return byName ? byName.id : slugifyKey(cleanConn, '');
        })
        .filter(cid => cid && cid !== pid);
      if (rawConns.length === 0 && next.currentPlaceId && next.currentPlaceId !== pid && !Array.isArray(patch.paths)) {
        rawConns.push(next.currentPlaceId);
      }

      const mergedConns = [...new Set([...(existing?.connectedIds ?? []), ...rawConns])];
      const cleanedTags = Array.isArray(rp.tags)
        ? [...new Set(rp.tags.map(t => cleanStringValue(String(t))).filter(Boolean))].slice(0, 6)
        : existing?.tags;

      next.places[pid] = {
        id: pid,
        name: cleanName,
        category: rp.category ?? existing?.category ?? 'venue',
        ...(resolvedZoneId ? { zoneId: resolvedZoneId } : {}),
        ...(cleanedTags?.length ? { tags: cleanedTags } : {}),
        icon: rp.icon?.trim().slice(0, 8) || existing?.icon || '🏛️',
        description: rp.description?.trim() ? cleanStringValue(rp.description) : (existing?.description || 'Known location.'),
        connectedIds: mergedConns,
        travelMinutes: Number(rp.travelMinutes ?? existing?.travelMinutes ?? 5),
        visited: existing?.visited ?? (pid === next.currentPlaceId),
        atmosphere: rp.atmosphere?.trim() ? cleanStringValue(rp.atmosphere) : (existing?.atmosphere || next.scene.weather),
        backdropUrl: existing?.backdropUrl,
        backdropImageId: existing?.backdropImageId,
        backdropVariants: existing?.backdropVariants,
      };
      touchedPlaceSet.add(pid);
      for (const cid of mergedConns) {
        if (next.places[cid]) {
          upsertPathEdge({ fromId: pid, toId: cid, travelMinutes: next.places[pid]!.travelMinutes });
        }
      }
    }
  }

  if (placesWritable && Array.isArray(patch.paths)) {
    const resolvePlaceByRef = (ref: string): string => {
      const clean = cleanStringValue(ref);
      const byExact = next.places[clean];
      if (byExact) return byExact.id;
      const byName = Object.values(next.places).find(p => p.name.toLowerCase() === clean.toLowerCase());
      return byName ? byName.id : slugifyKey(clean, '');
    };
    for (const edgeInput of patch.paths) {
      if (!edgeInput?.from || !edgeInput?.to) continue;
      const fromId = resolvePlaceByRef(edgeInput.from);
      const toId = resolvePlaceByRef(edgeInput.to);
      upsertPathEdge({
        fromId,
        toId,
        pathType: edgeInput.pathType ?? edgeInput.type,
        label: edgeInput.label,
        travelMinutes: edgeInput.travelMinutes ?? edgeInput.mins,
        locked: edgeInput.locked,
      });
    }
  }

  // Keep connectedIds & mapPaths consistent across all places
  const placeIds = Object.keys(next.places);
  const anchorPlaceId = next.currentPlaceId || placeIds[0] || '';
  if (anchorPlaceId && next.places[anchorPlaceId]) {
    for (const p of Object.values(next.places)) {
      p.connectedIds = p.connectedIds.filter(cid => cid !== p.id && Boolean(next.places[cid]));
      if (p.id !== anchorPlaceId && p.connectedIds.length === 0) {
        upsertPathEdge({ fromId: anchorPlaceId, toId: p.id, travelMinutes: p.travelMinutes });
      }
      for (const cid of p.connectedIds) {
        upsertPathEdge({ fromId: p.id, toId: cid, travelMinutes: p.travelMinutes });
      }
    }
  }

  if (
    Array.isArray(patch.quests) &&
    isBuiltinWritable('quests', coreCfg?.trackQuests !== false)
  ) {
    for (const rq of patch.quests) {
      if (!rq?.title?.trim()) continue;
      const qid = slugifyKey(rq.id ?? rq.title, 'quest');
      const existing = next.quests[qid];
      const cleanTitle = pickBetterCasedLabel(existing?.title, rq.title, false);
      next.quests[qid] = {
        id: qid,
        title: cleanTitle,
        summary: rq.summary?.trim() ? cleanStringValue(rq.summary) : (existing?.summary || cleanTitle),
        status: rq.status ?? existing?.status ?? 'active',
        objectives: Array.isArray(rq.objectives)
          ? rq.objectives.map((o, i) => ({
              id: `obj_${i + 1}`,
              text: cleanStringValue(String(o.text ?? '')),
              completed: Boolean(o.completed),
            }))
          : (existing?.objectives ?? [{ id: 'obj_1', text: cleanTitle, completed: false }]),
      };
    }
  }

  if (
    Array.isArray(patch.dispatches) &&
    isBuiltinWritable('dispatches', coreCfg?.trackDispatches !== false)
  ) {
    for (const rd of patch.dispatches) {
      if (!rd?.summary?.trim()) continue;
      next.dispatches.push({
        id: `disp_${next.turnCount}_${next.dispatches.length + 1}`,
        turn: next.turnCount,
        minute: next.elapsedMinutes,
        title: rd.title?.trim() ? cleanStringValue(rd.title) : 'Meanwhile…',
        locationName: rd.locationName?.trim() ? cleanStringValue(rd.locationName) : 'Elsewhere',
        summary: cleanStringValue(rd.summary),
        futureHook: rd.futureHook?.trim() ? cleanStringValue(rd.futureHook) : '',
      });
      if (next.dispatches.length > 30) next.dispatches.shift();
    }
  }

  // Two-way sync between Built-In `scene_presence` (or `stats.present`) and `actor.present`
  const corePresenceEnabled =
    bypassLocks ||
    (template.coreTrackers?.trackScenePresence !== false &&
      !template.coreTrackers?.overrides?.scene_presence?.locked);
  const rawScenePresence =
    sceneSource?.present ??
    sceneSource?.presence ??
    mergedStatsBag.present ??
    mergedStatsBag.scene_presence;
  const rawSceneAway = sceneSource?.away;
  const unwrapText = (val: unknown): string => {
    if (typeof val === 'string') return val;
    if (Array.isArray(val)) return val.map(String).join(', ');
    if (val && typeof val === 'object' && 'value' in (val as Record<string, unknown>)) {
      return unwrapText((val as StatPatchInput).value);
    }
    return '';
  };

  let combinedPresenceText = unwrapText(rawScenePresence).trim();
  const extraAwayText = unwrapText(rawSceneAway).trim();
  if (extraAwayText && !/\baway\s*:/i.test(combinedPresenceText)) {
    combinedPresenceText = `${combinedPresenceText ? `${combinedPresenceText}, ` : ''}Away: [${extraAwayText}]`;
  }

  if (corePresenceEnabled && combinedPresenceText) {
    const parseNameBucket = (segment: string): string[] =>
      segment
        .replace(/^\[|\]$/g, '')
        .split(/[,;|]/)
        .map(s => s.replace(/\s*\([^)]*\)\s*$/g, '').trim())
        .filter(s => s.length > 0 && !/^(?:none|empty|user|player|you)$/i.test(s));

    const presMatch = combinedPresenceText.match(
      /present\s*:\s*(?:\[([^\]]*)\]|([^|\n]+?)(?=(?:\s*,?\s*away\s*:|\s*\||$)))/i,
    );
    const awayMatch = combinedPresenceText.match(/away\s*:\s*(?:\[([^\]]*)\]|([^|\n]+))/i);
    const presList = presMatch
      ? parseNameBucket(presMatch[1] ?? presMatch[2] ?? '')
      : !awayMatch
        ? parseNameBucket(combinedPresenceText)
        : [];
    const awayList = awayMatch ? parseNameBucket(awayMatch[1] ?? awayMatch[2] ?? '') : [];

    const playerLow = (next.player.name || '').trim().toLowerCase();
    const resolveActorByToken = (tok: string): CharacterRecord | undefined => {
      const low = tok.toLowerCase();
      if (!low || low === playerLow) return undefined;
      return Object.values(next.characters).find(
        c =>
          c.name.toLowerCase() === low ||
          c.id === slugifyKey(low, '') ||
          c.aliases.some(a => a.toLowerCase() === low),
      );
    };

    const presentMatchedIds = new Set<string>();
    for (const tok of presList) {
      const actor = resolveActorByToken(tok);
      if (actor && !explicitlyAbsentCharIds.has(actor.id)) {
        actor.present = true;
        if (next.currentPlaceId) actor.locationId = next.currentPlaceId;
        presentMatchedIds.add(actor.id);
      }
    }
    for (const tok of awayList) {
      const actor = resolveActorByToken(tok);
      if (actor && !explicitlyPresentCharIds.has(actor.id)) {
        actor.present = false;
      }
    }
    if ((presMatch || presList.length > 0) && presList.length > 0 && !awayMatch) {
      for (const actor of Object.values(next.characters)) {
        if (actor.present && !presentMatchedIds.has(actor.id) && !explicitlyPresentCharIds.has(actor.id)) {
          actor.present = false;
        }
      }
    }
  }

  if (Object.keys(next.characters).length > 0) {
    const presentNames = Object.values(next.characters).filter(c => c.present).map(c => c.name);
    const awayNames = Object.values(next.characters).filter(c => !c.present).map(c => c.name);
    const formattedPresence = `Present: [${presentNames.join(', ')}], Away: [${awayNames.join(', ')}]`;
    if (corePresenceEnabled) {
      next.scene.presence = formattedPresence;
    }
    const customPresSchema = template.stats.find(
      s => s.enabled && (s.id === 'present' || s.id === 'scene_presence'),
    );
    if (customPresSchema && !customPresSchema.locked && !next.stats[customPresSchema.id]?.locked) {
      next.stats[customPresSchema.id] = {
        id: customPresSchema.id,
        scope: customPresSchema.scope === 'character' ? 'scene' : customPresSchema.scope,
        value: formattedPresence,
        calibrated: true,
        locked: false,
      };
    }
  }

  recomputeDerivedStats(template.stats, next, template.categories ?? []);

  return {
    state: next,
    deltas: { statDeltas, characterDeltas },
    triggeredAlerts,
    touchedCharacterIds: [...touchedCharacterSet],
    touchedPlaceIds: [...touchedPlaceSet],
  };
}

export function diffCampaignStates(before: CampaignState, after: CampaignState): TurnDeltaMap {
  const statDeltas: Record<string, number> = {};
  const characterDeltas: Record<string, Record<string, number>> = {};

  for (const [id, cur] of Object.entries(after.stats)) {
    const prev = before.stats[id];
    if (typeof cur.value === 'number') {
      const base = typeof prev?.value === 'number' ? prev.value : 0;
      const d = Number((cur.value - base).toFixed(2));
      if (d !== 0) statDeltas[id] = d;
    }
  }

  for (const [cid, char] of Object.entries(after.characters)) {
    const prevChar = before.characters[cid];
    for (const [mk, mv] of Object.entries(char.meters)) {
      if (typeof mv.value === 'number') {
        const prevVal =
          prevChar?.meters[mk]?.calibrated && typeof prevChar.meters[mk]?.value === 'number'
            ? (prevChar.meters[mk]!.value as number)
            : 0;
        const d = Math.round(mv.value - prevVal);
        if (d !== 0) {
          (characterDeltas[cid] ??= {})[mk] = d;
        }
      }
    }
  }

  return { statDeltas, characterDeltas };
}
