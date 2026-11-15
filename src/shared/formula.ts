import { slugifyKey } from './templates';
import type {
  CampaignState,
  CharacterRecord,
  StatCategoryDef,
  StatScaleAnchor,
  StatSchemaDef,
  TimedModifier,
} from './types';

export interface FormulaEvalContext {
  resolveRef: (ref: string) => number | undefined;
  resolveStringRef: (ref: string) => string | undefined;
  hasCond: (pattern: string) => boolean;
}

/**
 * Generically extracts numeric tokens from ANY formatted stat string without
 * hardcoding game-specific field names:
 * - `"Lv0 (0%) | P46 A52 I80"` -> `{ Lv: 0, pct: 0, P: 46, A: 52, I: 80 }`
 * - `"HP 190/190 | MP 180/180"` -> `{ HP: 190, HP_cur: 190, HP_max: 190, MP: 180, MP_cur: 180, MP_max: 180 }`
 * - `"STR:16, DEX:14"` -> `{ STR: 16, DEX: 14 }`
 */
export function parseStatTokens(rawValue: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (typeof rawValue === 'number' && Number.isFinite(rawValue)) {
    out.value = rawValue;
    return out;
  }
  const text = String(rawValue ?? '').trim();
  if (!text || text === 'None') return out;

  const plainNum = Number(text);
  if (Number.isFinite(plainNum)) {
    out.value = plainNum;
  }

  // 1. Slash pairs like `HP 190/190`, `Stress 2/4`
  const slashRe = /\b([A-Za-z][A-Za-z0-9_]{0,20})\s*[:=]?\s*(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)\b/g;
  let m: RegExpExecArray | null;
  while ((m = slashRe.exec(text)) !== null) {
    const key = m[1]!;
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

  // 2. Percent token like `(25%)` or `25%`
  const pctMatch = text.match(/(-?\d+(?:\.\d+)?)\s*%/);
  if (pctMatch) {
    const pct = Number(pctMatch[1]);
    if (Number.isFinite(pct)) {
      out.pct = pct;
    }
  }

  // 3. Key-value pairs like `P46`, `A52`, `I80`, `Lv0`, `Lv. 4`, `STR:16`, `Tier 2`
  const kvRe = /\b([A-Za-z][A-Za-z0-9_]{0,20})(?:\s*[:=]\s*|\.\s*|\s+|(?=-?\d))(-?\d+(?:\.\d+)?)\b(?!\s*\/)/g;
  while ((m = kvRe.exec(text)) !== null) {
    const key = m[1]!;
    const num = Number(m[2]);
    if (!Number.isFinite(num)) continue;
    if (out[key] === undefined) out[key] = num;
    if (out[key.toLowerCase()] === undefined) out[key.toLowerCase()] = num;
  }

  return out;
}

/**
 * Detects when a user pasted an English description instead of math or `{{...}}` macro syntax.
 */
export function looksLikeEnglishProse(raw: string): boolean {
  const s = raw.trim();
  if (!s || s.includes('{{')) return false;
  if (/^(?:compute|calculate|format|write|track|update|use)\b/i.test(s)) return true;
  if (/\.\s+[A-Za-z]+\s+[a-z]+\s+[a-z]+/.test(s)) return true;
  if (/\b(?:loses|per\s+\d|during|whenever|only\s+if|in\s+this\s+format)\b/i.test(s)) return true;
  return false;
}

function evaluateSingleExpression(
  exprSrc: string,
  locals: Record<string, number>,
  ctx: FormulaEvalContext,
  diagnostics?: { missingRefs: Set<string>; error?: string },
): number | undefined {
  const src = exprSrc.trim();
  if (!src || src.length > 1000) return undefined;

  let pos = 0;
  let steps = 0;

  const skipWhitespace = () => {
    while (pos < src.length && /\s/.test(src[pos] ?? '')) pos++;
  };

  const readStringLiteral = (): string => {
    const quote = src[pos];
    pos++;
    let out = '';
    while (pos < src.length) {
      const ch = src[pos]!;
      if (ch === '\\' && pos + 1 < src.length) {
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
    throw new Error('Unterminated string literal');
  };

  const resolveIdentifier = (name: string): number => {
    if (Object.prototype.hasOwnProperty.call(locals, name)) return locals[name]!;
    const low = name.toLowerCase();
    for (const [k, v] of Object.entries(locals)) {
      if (k.toLowerCase() === low) return v;
    }
    const viaRef = ctx.resolveRef(name);
    if (viaRef !== undefined && Number.isFinite(viaRef)) return viaRef;
    diagnostics?.missingRefs.add(name);
    return NaN;
  };

  const callBuiltinFn = (name: string, args: number[]): number => {
    const fn = name.toLowerCase();
    if (fn === 'round') {
      if (!args.length) return NaN;
      const dec = args[1] !== undefined && Number.isFinite(args[1]) ? Math.max(0, Math.min(6, Math.round(args[1]))) : 0;
      const factor = 10 ** dec;
      return Math.round(args[0]! * factor) / factor;
    }
    if (fn === 'floor') return args.length ? Math.floor(args[0]!) : NaN;
    if (fn === 'ceil') return args.length ? Math.ceil(args[0]!) : NaN;
    if (fn === 'abs') return args.length ? Math.abs(args[0]!) : NaN;
    if (fn === 'min') return args.length ? Math.min(...args) : NaN;
    if (fn === 'max') return args.length ? Math.max(...args) : NaN;
    if (fn === 'mod') return args.length >= 2 && args[1] !== 0 ? args[0]! % args[1]! : NaN;
    if (fn === 'clamp') {
      if (args.length < 3) return NaN;
      return Math.max(args[1]!, Math.min(args[2]!, args[0]!));
    }
    if (fn === 'if') {
      if (args.length < 2) return NaN;
      const cond = args[0]!;
      return cond !== 0 && !Number.isNaN(cond) ? args[1]! : (args[2] ?? 0);
    }
    throw new Error(`Unknown function: ${name}`);
  };

  const parsePrimary = (): number => {
    if (++steps > 800) throw new Error('Formula complexity limit exceeded');
    skipWhitespace();
    const ch = src[pos];
    if (ch === '+' || ch === '-' || ch === '!') {
      pos++;
      const operand = parsePrimary();
      if (ch === '!') return operand === 0 || Number.isNaN(operand) ? 1 : 0;
      return ch === '-' ? -operand : operand;
    }
    if (ch === '(') {
      pos++;
      const inner = parseTernary();
      skipWhitespace();
      if (src[pos] !== ')') throw new Error('Unclosed parenthesis');
      pos++;
      return inner;
    }
    if (ch === '[') {
      const closeIdx = src.indexOf(']', pos + 1);
      if (closeIdx < 0) throw new Error('Unclosed bracket reference');
      const refKey = src.slice(pos + 1, closeIdx).trim();
      pos = closeIdx + 1;
      const val = ctx.resolveRef(refKey);
      if (val !== undefined && Number.isFinite(val)) return val;
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
      if (src[pos] === '(') {
        pos++;
        skipWhitespace();
        const fnLow = ident.toLowerCase();
        if (fnLow === 'hascond' || fnLow === 'hasflag') {
          let matched = false;
          if (src[pos] === '"' || src[pos] === "'") {
            const pattern = readStringLiteral();
            matched = ctx.hasCond(pattern);
            skipWhitespace();
          }
          if (src[pos] !== ')') throw new Error(`Expected ) after ${ident}`);
          pos++;
          return matched ? 1 : 0;
        }
        if (fnLow === 'match' || fnLow === 'matches') {
          let targetStr = '';
          let patStr = '';
          if (src[pos] === '"' || src[pos] === "'") {
            targetStr = readStringLiteral();
          } else {
            const refStart = pos;
            while (pos < src.length && src[pos] !== ',' && src[pos] !== ')') pos++;
            const key = src.slice(refStart, pos).trim();
            targetStr = ctx.resolveStringRef(key) ?? String(resolveIdentifier(key) || '');
          }
          skipWhitespace();
          if (src[pos] === ',') {
            pos++;
            skipWhitespace();
            if (src[pos] === '"' || src[pos] === "'") {
              patStr = readStringLiteral();
            }
          }
          skipWhitespace();
          if (src[pos] !== ')') throw new Error('Expected ) after match()');
          pos++;
          if (!patStr) return 0;
          try {
            return new RegExp(patStr, 'i').test(targetStr) ? 1 : 0;
          } catch {
            return targetStr.toLowerCase().includes(patStr.toLowerCase()) ? 1 : 0;
          }
        }

        const args: number[] = [];
        if (src[pos] !== ')') {
          while (true) {
            args.push(parseTernary());
            skipWhitespace();
            if (src[pos] === ',') {
              pos++;
              continue;
            }
            break;
          }
        }
        if (src[pos] !== ')') throw new Error(`Expected ) in ${ident}()`);
        pos++;
        return callBuiltinFn(ident, args);
      }
      return resolveIdentifier(ident);
    }
    throw new Error(`Unexpected character near "${src.slice(pos, pos + 18)}"`);
  };

  const parseMultiplicative = (): number => {
    let left = parsePrimary();
    while (true) {
      skipWhitespace();
      const op = src[pos];
      if (op !== '*' && op !== '/' && op !== '%') return left;
      pos++;
      const right = parsePrimary();
      if ((op === '/' || op === '%') && right === 0) return NaN;
      left = op === '*' ? left * right : op === '/' ? left / right : left % right;
    }
  };

  const parseAdditive = (): number => {
    let left = parseMultiplicative();
    while (true) {
      skipWhitespace();
      const op = src[pos];
      if (op !== '+' && op !== '-') return left;
      pos++;
      const right = parseMultiplicative();
      left = op === '+' ? left + right : left - right;
    }
  };

  const parseComparison = (): number => {
    let left = parseAdditive();
    while (true) {
      skipWhitespace();
      const two = src.slice(pos, pos + 2);
      const one = src[pos];
      let op = '';
      if (two === '<=' || two === '>=' || two === '==' || two === '!=') op = two;
      else if (one === '<' || one === '>') op = one;
      if (!op) return left;
      pos += op.length;
      const right = parseAdditive();
      if (op === '<=') left = left <= right ? 1 : 0;
      else if (op === '>=') left = left >= right ? 1 : 0;
      else if (op === '==') left = left === right ? 1 : 0;
      else if (op === '!=') left = left !== right ? 1 : 0;
      else if (op === '<') left = left < right ? 1 : 0;
      else left = left > right ? 1 : 0;
    }
  };

  const parseAnd = (): number => {
    let left = parseComparison();
    while (true) {
      skipWhitespace();
      if (src.slice(pos, pos + 2) !== '&&') return left;
      pos += 2;
      const right = parseComparison();
      left = left !== 0 && !Number.isNaN(left) && right !== 0 && !Number.isNaN(right) ? 1 : 0;
    }
  };

  const parseOr = (): number => {
    let left = parseAnd();
    while (true) {
      skipWhitespace();
      if (src.slice(pos, pos + 2) !== '||') return left;
      pos += 2;
      const right = parseAnd();
      left = (left !== 0 && !Number.isNaN(left)) || (right !== 0 && !Number.isNaN(right)) ? 1 : 0;
    }
  };

  const parseTernary = (): number => {
    const cond = parseOr();
    skipWhitespace();
    if (src[pos] !== '?') return cond;
    pos++;
    const trueVal = parseTernary();
    skipWhitespace();
    if (src[pos] !== ':') throw new Error('Expected ":" in ternary expression');
    pos++;
    const falseVal = parseTernary();
    return cond !== 0 && !Number.isNaN(cond) ? trueVal : falseVal;
  };

  try {
    const out = parseTernary();
    skipWhitespace();
    if (pos !== src.length) {
      if (diagnostics) diagnostics.error = `Unexpected character near "${src.slice(pos, pos + 18)}"`;
      return undefined;
    }
    if (!Number.isFinite(out)) return undefined;
    return Number(out.toFixed(2));
  } catch (err) {
    if (diagnostics) {
      diagnostics.error = err instanceof Error ? err.message : String(err);
    }
    return undefined;
  }
}

function isMacroTruthy(raw: string): boolean {
  const s = raw.trim().toLowerCase();
  return !['', '0', 'false', 'null', 'undefined', 'no', 'off'].includes(s);
}

function splitMacroArgs(rawBody: string): string[] {
  const args: string[] = [];
  let depth = 0;
  let cur = '';
  for (let i = 0; i < rawBody.length; i++) {
    if (rawBody[i] === '{' && rawBody[i + 1] === '{') {
      depth++;
      cur += '{{';
      i++;
      continue;
    }
    if (rawBody[i] === '}' && rawBody[i + 1] === '}' && depth > 0) {
      depth--;
      cur += '}}';
      i++;
      continue;
    }
    if (depth === 0 && rawBody[i] === ':' && rawBody[i + 1] === ':') {
      args.push(cur);
      cur = '';
      i++;
      continue;
    }
    cur += rawBody[i]!;
  }
  args.push(cur);
  return args;
}

function findMatchingTagEnd(
  src: string,
  startIdx: number,
): number {
  let depth = 0;
  for (let i = startIdx; i < src.length - 1; i++) {
    if (src[i] === '{' && src[i + 1] === '{') {
      depth++;
      i++;
    } else if (src[i] === '}' && src[i + 1] === '}') {
      depth--;
      if (depth === 0) return i + 2;
      i++;
    }
  }
  return -1;
}

function findScopedClose(
  src: string,
  bodyStart: number,
  tagName: string,
): { bodyEnd: number; closeEnd: number } | null {
  const openRe = new RegExp(`^\\{\\{\\s*#?${tagName}(?:\\s|::|\\}\\})`, 'i');
  const closeRe = new RegExp(`^\\{\\{\\s*\\/${tagName}\\s*\\}\\}`, 'i');
  let depth = 1;
  for (let i = bodyStart; i < src.length; i++) {
    if (src[i] === '{' && src[i + 1] === '{') {
      const slice = src.slice(i);
      if (closeRe.test(slice)) {
        depth--;
        if (depth === 0) {
          const endIdx = src.indexOf('}}', i);
          return { bodyEnd: i, closeEnd: endIdx + 2 };
        }
      } else if (openRe.test(slice)) {
        depth++;
      }
    }
  }
  return null;
}

function splitTopLevelIfBranches(
  body: string,
): { branches: Array<{ cond: string; content: string }>; elseContent: string } {
  const branches: Array<{ cond: string; content: string }> = [];
  let elseContent = '';
  let depth = 0;
  let curStart = 0;
  let pendingCond: string | null = null;
  let inElse = false;

  for (let i = 0; i < body.length; i++) {
    if (body[i] !== '{' || body[i + 1] !== '{') continue;
    const tagEnd = findMatchingTagEnd(body, i);
    if (tagEnd < 0) continue;
    const inner = body.slice(i + 2, tagEnd - 2).trim();
    if (/^#?(?:if|unless)\b/i.test(inner)) {
      depth++;
    } else if (/^\/(?:if|unless)\b/i.test(inner)) {
      depth = Math.max(0, depth - 1);
    } else if (depth === 0 && /^(?:elseif|elif)\b/i.test(inner)) {
      const chunk = body.slice(curStart, i);
      if (pendingCond === null) branches.push({ cond: '__first__', content: chunk });
      else branches.push({ cond: pendingCond, content: chunk });
      const rest = inner.replace(/^(?:elseif|elif)(?:::|\s+)/i, '').trim();
      pendingCond = rest;
      curStart = tagEnd;
    } else if (depth === 0 && /^else$/i.test(inner)) {
      const chunk = body.slice(curStart, i);
      if (pendingCond === null) branches.push({ cond: '__first__', content: chunk });
      else branches.push({ cond: pendingCond, content: chunk });
      pendingCond = null;
      inElse = true;
      curStart = tagEnd;
    }
    i = tagEnd - 1;
  }

  const tail = body.slice(curStart);
  if (inElse) elseContent = tail;
  else if (pendingCond === null) branches.push({ cond: '__first__', content: tail });
  else branches.push({ cond: pendingCond, content: tail });

  return { branches, elseContent };
}

/**
 * Evaluates Lumiverse-compatible Macro syntax (`{{calc}}`, `{{if}}`, `{{round}}`,
 * `{{matches}}`, `{{.var}}`, `{{.var = ...}}`, `{{switch}}`, `{{let}}`, etc.)
 * synchronously in both browser preview and backend reducer.
 */
export function evaluateMacroTemplate(
  template: string,
  ctx: FormulaEvalContext,
  initialStrLocals: Record<string, string> = {},
  initialNumLocals: Record<string, number> = {},
): {
  text: string;
  locals: Record<string, number>;
  strLocals: Record<string, string>;
  missingRefs: string[];
  error?: string;
} {
  const numLocals: Record<string, number> = { ...initialNumLocals };
  const strLocals: Record<string, string> = { ...initialStrLocals };
  const diagnostics: { missingRefs: Set<string>; error?: string } = {
    missingRefs: new Set<string>(),
  };
  let workSteps = 0;

  const readLocalStr = (key: string): string | undefined => {
    if (Object.prototype.hasOwnProperty.call(strLocals, key)) return strLocals[key];
    const low = key.toLowerCase();
    for (const [k, v] of Object.entries(strLocals)) {
      if (k.toLowerCase() === low) return v;
    }
    if (Object.prototype.hasOwnProperty.call(numLocals, key)) return String(numLocals[key]);
    for (const [k, v] of Object.entries(numLocals)) {
      if (k.toLowerCase() === low) return String(v);
    }
    const strRef = ctx.resolveStringRef(key);
    if (strRef !== undefined) return strRef;
    const numRef = ctx.resolveRef(key);
    if (numRef !== undefined) return String(numRef);
    return undefined;
  };

  const evalConditionStr = (rawCond: string): boolean => {
    const trimmed = rawCond.trim();
    if (!trimmed) return false;
    const negated = trimmed.startsWith('!');
    const body = negated ? trimmed.slice(1).trim() : trimmed;
    const resolved = evalPass(body).trim();
    const cmpMatch = resolved.match(/^(.+?)\s*(==|!=|>=|<=|>|<)\s*(.+)$/);
    let result = false;
    if (cmpMatch) {
      const l = cmpMatch[1]!.trim();
      const op = cmpMatch[2]!;
      const r = cmpMatch[3]!.trim();
      const ln = Number(l);
      const rn = Number(r);
      if (l !== '' && r !== '' && Number.isFinite(ln) && Number.isFinite(rn)) {
        result =
          op === '==' ? ln === rn
            : op === '!=' ? ln !== rn
              : op === '>' ? ln > rn
                : op === '<' ? ln < rn
                  : op === '>=' ? ln >= rn
                    : ln <= rn;
      } else {
        result =
          op === '==' ? l === r
            : op === '!=' ? l !== r
              : op === '>' ? l > r
                : op === '<' ? l < r
                  : op === '>=' ? l >= r
                    : l <= r;
      }
    } else {
      result = isMacroTruthy(resolved);
    }
    return negated ? !result : result;
  };

  const evalPass = (input: string): string => {
    if (++workSteps > 1200) {
      diagnostics.error = 'Macro work budget exceeded (possible infinite recursion)';
      return input;
    }
    let out = '';
    let i = 0;

    while (i < input.length) {
      if (input[i] !== '{' || input[i + 1] !== '{') {
        out += input[i++];
        continue;
      }
      const tagEnd = findMatchingTagEnd(input, i);
      if (tagEnd < 0) {
        out += input.slice(i);
        break;
      }
      const rawInner = input.slice(i + 2, tagEnd - 2).trim();

      // Comments
      if (rawInner.startsWith('//') || /^comment::|^note::/i.test(rawInner)) {
        i = tagEnd;
        continue;
      }

      // Scoped {{#escape}}...{{/escape}}
      if (/^#escape$/i.test(rawInner)) {
        const closed = findScopedClose(input, tagEnd, 'escape');
        if (closed) {
          out += input.slice(tagEnd, closed.bodyEnd);
          i = closed.closeEnd;
          continue;
        }
      }

      // Scoped {{if...}} / {{unless...}}
      const ifMatch = rawInner.match(/^#?(if|unless)(?:::|\s+)([\s\S]+)$/i);
      if (ifMatch) {
        const tagKind = ifMatch[1]!.toLowerCase();
        const firstCond = ifMatch[2]!.trim();
        const closed = findScopedClose(input, tagEnd, tagKind);
        if (closed) {
          const body = input.slice(tagEnd, closed.bodyEnd);
          const { branches, elseContent } = splitTopLevelIfBranches(body);
          let chosen = elseContent;
          for (const br of branches) {
            const c = br.cond === '__first__' ? firstCond : br.cond;
            const passed = evalConditionStr(c);
            if (tagKind === 'unless' ? !passed : passed) {
              chosen = br.content;
              break;
            }
          }
          out += evalPass(chosen);
          i = closed.closeEnd;
          continue;
        }
      }

      // Scoped {{let::k1::v1...}}...{{/let}}
      if (/^let(?:::|\s+)/i.test(rawInner)) {
        const closed = findScopedClose(input, tagEnd, 'let');
        if (closed) {
          const parts = splitMacroArgs(rawInner.replace(/^let(?:::|\s+)/i, ''));
          const prevStr = new Map<string, string | undefined>();
          const prevNum = new Map<string, number | undefined>();
          for (let p = 0; p + 1 < parts.length; p += 2) {
            const k = evalPass(parts[p]!).trim();
            const v = evalPass(parts[p + 1]!);
            if (!k) continue;
            prevStr.set(k, Object.prototype.hasOwnProperty.call(strLocals, k) ? strLocals[k] : undefined);
            prevNum.set(k, Object.prototype.hasOwnProperty.call(numLocals, k) ? numLocals[k] : undefined);
            strLocals[k] = v;
            const nv = Number(v);
            if (v.trim() !== '' && Number.isFinite(nv)) numLocals[k] = nv;
          }
          out += evalPass(input.slice(tagEnd, closed.bodyEnd));
          for (const [k, oldV] of prevStr.entries()) {
            if (oldV === undefined) delete strLocals[k];
            else strLocals[k] = oldV;
          }
          for (const [k, oldN] of prevNum.entries()) {
            if (oldN === undefined) delete numLocals[k];
            else numLocals[k] = oldN;
          }
          i = closed.closeEnd;
          continue;
        }
      }

      // Scoped {{trim}}...{{/trim}}
      if (/^#?trim$/i.test(rawInner)) {
        const closed = findScopedClose(input, tagEnd, 'trim');
        if (closed) {
          out += evalPass(input.slice(tagEnd, closed.bodyEnd)).trim();
          i = closed.closeEnd;
          continue;
        }
      }

      // Scoped {{switch::val}}...{{/switch}}
      if (/^switch::/i.test(rawInner)) {
        const parts = splitMacroArgs(rawInner);
        if (parts.length <= 2) {
          const closed = findScopedClose(input, tagEnd, 'switch');
          if (closed) {
            const targetVal = evalPass(parts[1] ?? '').trim();
            const swBody = input.slice(tagEnd, closed.bodyEnd);
            let matchedText = '';
            let defaultText = '';
            const caseRe = /\{\{\s*case::([\s\S]*?)\}\}([\s\S]*?)\{\{\s*\/case\s*\}\}/gi;
            let cm: RegExpExecArray | null;
            while ((cm = caseRe.exec(swBody)) !== null) {
              const caseOpts = splitMacroArgs(cm[1]!).map(o => evalPass(o).trim());
              if (caseOpts.includes(targetVal)) {
                matchedText = cm[2]!;
                break;
              }
            }
            if (!matchedText) {
              const defMatch = swBody.match(/\{\{\s*default\s*\}\}([\s\S]*?)\{\{\s*\/default\s*\}\}/i);
              if (defMatch) defaultText = defMatch[1]!;
            }
            out += evalPass(matchedText || defaultText);
            i = closed.closeEnd;
            continue;
          }
        }
      }

      // Variable Shorthand: {{.name = expr}}, {{.name += n}}, {{.name++}}, {{.name}}
      const assignShort = rawInner.match(/^\.([A-Za-z_][A-Za-z0-9_]*)\s*(=|\+=|-=)\s*([\s\S]+)$/);
      if (assignShort) {
        const vName = assignShort[1]!;
        const op = assignShort[2]!;
        const rhs = evalPass(assignShort[3]!).trim();
        const rhsNum = Number(rhs);
        if (op === '=') {
          strLocals[vName] = rhs;
          if (rhs !== '' && Number.isFinite(rhsNum)) numLocals[vName] = rhsNum;
        } else {
          const cur = numLocals[vName] ?? Number(readLocalStr(vName) ?? 0) ?? 0;
          const next = op === '+=' ? cur + (Number.isFinite(rhsNum) ? rhsNum : 0) : cur - (Number.isFinite(rhsNum) ? rhsNum : 0);
          numLocals[vName] = next;
          strLocals[vName] = String(next);
        }
        i = tagEnd;
        continue;
      }

      const incShort = rawInner.match(/^\.([A-Za-z_][A-Za-z0-9_]*)(\+\+|--)$/);
      if (incShort) {
        const vName = incShort[1]!;
        const cur = numLocals[vName] ?? Number(readLocalStr(vName) ?? 0) ?? 0;
        const next = incShort[2] === '++' ? cur + 1 : cur - 1;
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

      // Built-in Macro Dispatch (`::` or space-delimited)
      const parts = rawInner.includes('::')
        ? splitMacroArgs(rawInner)
        : rawInner.split(/\s+/);
      const name = (parts[0] ?? '').trim().toLowerCase();
      const args = parts.slice(1).map(a => evalPass(a));

      if (name === 'space') out += ' ';
      else if (name === 'newline' || name === 'nl' || name === 'n') out += '\n';
      else if (name === 'noop') out += '';
      else if (name === 'getvar' || name === 'getchatvar') {
        const key = (args[0] ?? '').trim();
        const val = readLocalStr(key);
        if (val === undefined) diagnostics.missingRefs.add(key);
        else out += val;
      } else if (name === 'setvar') {
        const key = (args[0] ?? '').trim();
        const val = args[1] ?? '';
        if (key) {
          strLocals[key] = val;
          const nv = Number(val);
          if (val.trim() !== '' && Number.isFinite(nv)) numLocals[key] = nv;
        }
      } else if (name === 'hasvar' || name === 'haschatvar' || name === 'varexists') {
        const key = (args[0] ?? '').trim();
        out += readLocalStr(key) !== undefined ? 'true' : 'false';
      } else if (name === 'calc' || name === 'math' || name === 'evaluate') {
        const expr = args.join('::');
        const val = evaluateSingleExpression(expr, numLocals, ctx, diagnostics);
        if (val !== undefined) out += String(val);
      } else if (name === 'round') {
        const n = Number(args[0]);
        const d = args[1] !== undefined ? Math.max(0, Math.min(6, Math.round(Number(args[1]) || 0))) : 0;
        if (Number.isFinite(n)) out += String(Math.round(n * 10 ** d) / 10 ** d);
      } else if (name === 'floor') {
        const n = Number(args[0]);
        if (Number.isFinite(n)) out += String(Math.floor(n));
      } else if (name === 'ceil') {
        const n = Number(args[0]);
        if (Number.isFinite(n)) out += String(Math.ceil(n));
      } else if (name === 'abs') {
        const n = Number(args[0]);
        if (Number.isFinite(n)) out += String(Math.abs(n));
      } else if (name === 'min') {
        const nums = args.map(Number).filter(Number.isFinite);
        if (nums.length) out += String(Math.min(...nums));
      } else if (name === 'max') {
        const nums = args.map(Number).filter(Number.isFinite);
        if (nums.length) out += String(Math.max(...nums));
      } else if (name === 'clamp') {
        const [v, lo, hi] = args.map(Number);
        if (Number.isFinite(v) && Number.isFinite(lo) && Number.isFinite(hi)) {
          out += String(Math.max(lo!, Math.min(hi!, v!)));
        }
      } else if (name === 'mod') {
        const a = Number(args[0]);
        const b = Number(args[1]);
        if (Number.isFinite(a) && Number.isFinite(b) && b !== 0) out += String(a % b);
      } else if (name === 'and') {
        out += args.length && args.every(isMacroTruthy) ? 'true' : '';
      } else if (name === 'or') {
        out += args.some(isMacroTruthy) ? 'true' : '';
      } else if (name === 'not') {
        out += !isMacroTruthy(args[0] ?? '') ? 'true' : '';
      } else if (['eq', 'ne', 'gt', 'lt', 'gte', 'lte'].includes(name)) {
        const a = args[0]?.trim() ?? '';
        const b = args[1]?.trim() ?? '';
        const an = Number(a);
        const bn = Number(b);
        const isNum = a !== '' && b !== '' && Number.isFinite(an) && Number.isFinite(bn);
        let ok = false;
        if (name === 'eq') ok = isNum ? an === bn : a === b;
        else if (name === 'ne') ok = isNum ? an !== bn : a !== b;
        else if (name === 'gt') ok = isNum ? an > bn : a > b;
        else if (name === 'lt') ok = isNum ? an < bn : a < b;
        else if (name === 'gte') ok = isNum ? an >= bn : a >= b;
        else if (name === 'lte') ok = isNum ? an <= bn : a <= b;
        out += ok ? 'true' : '';
      } else if (name === 'empty' || name === 'isempty') {
        out += (args[0] ?? '') === '' ? 'true' : '';
      } else if (name === 'blank' || name === 'isblank') {
        out += (args[0] ?? '').trim() === '' ? 'true' : '';
      } else if (name === 'default' || name === 'fallback' || name === 'coalesce') {
        out += args.find(isMacroTruthy) ?? '';
      } else if (name === 'matches') {
        const [txt = '', pat = '', flags = ''] = args;
        if (pat) {
          try {
            out += new RegExp(pat, flags).test(txt) ? 'true' : '';
          } catch {
            out += txt.toLowerCase().includes(pat.toLowerCase()) ? 'true' : '';
          }
        }
      } else if (name === 'includes' || name === 'contains' || name === 'inlist') {
        const list = (args[0] ?? '').split(',').map(x => x.trim()).filter(Boolean);
        out += list.includes((args[1] ?? '').trim()) ? 'true' : '';
      } else if (name === 'upper' || name === 'uppercase' || name === 'toupper') {
        out += (args[0] ?? '').toUpperCase();
      } else if (name === 'lower' || name === 'lowercase' || name === 'tolower') {
        out += (args[0] ?? '').toLowerCase();
      } else if (name === 'len' || name === 'length') {
        out += String((args[0] ?? '').length);
      } else if (name === 'replace') {
        out += (args[2] ?? '').split(args[0] ?? '').join(args[1] ?? '');
      } else if (name === 'split') {
        const items = (args[0] ?? '').split(args[1] ?? ',');
        const idx = Number(args[2] ?? 0);
        const norm = idx < 0 ? items.length + idx : idx;
        out += (items[norm] ?? '').trim();
      } else if (name === 'wrap') {
        const content = args[2] ?? '';
        out += content ? `${args[0] ?? ''}${content}${args[1] ?? ''}` : '';
      } else if (name === 'switch') {
        const targetVal = (args[0] ?? '').trim();
        let matched = '';
        for (let k = 1; k + 1 < args.length; k += 2) {
          if (args[k]!.trim() === targetVal) {
            matched = args[k + 1]!;
            break;
          }
        }
        if (!matched && args.length % 2 === 0) {
          matched = args[args.length - 1]!;
        }
        out += matched;
      } else {
        out += input.slice(i, tagEnd);
      }
      i = tagEnd;
    }

    return out;
  };

  const rendered = evalPass(template)
    .split('\n')
    .map(l => l.trimEnd())
    .filter(l => l.trim() !== '')
    .join('\n')
    .trim();

  const maybeNum = Number(rendered);
  if (rendered !== '' && Number.isFinite(maybeNum)) {
    numLocals.value = maybeNum;
    numLocals.result = maybeNum;
  }

  return {
    text: rendered,
    locals: numLocals,
    strLocals,
    missingRefs: [...diagnostics.missingRefs],
    error: diagnostics.error,
  };
}

/**
 * Evaluates single-line or multi-line sandboxed expressions (`a = ...; b = ...`),
 * Lumiverse macro templates (`{{calc}}`, `{{if}}`, `{{.var}}`), and detects plain English prose.
 */
export function evaluateFormulaProgram(
  program: string,
  ctx: FormulaEvalContext,
  initialStrLocals: Record<string, string> = {},
  initialNumLocals: Record<string, number> = {},
): {
  value: number | undefined;
  textOutput?: string;
  locals: Record<string, number>;
  missingRefs: string[];
  isProse?: boolean;
  error?: string;
} {
  const trimmed = program.trim();
  if (!trimmed) {
    return { value: undefined, locals: {}, missingRefs: [], error: 'Formula is empty' };
  }

  // 1. Lumiverse Macro Template Path (`{{...}}`)
  if (trimmed.includes('{{') && trimmed.includes('}}')) {
    const macroRes = evaluateMacroTemplate(trimmed, ctx, initialStrLocals, initialNumLocals);
    const numVal =
      macroRes.text !== '' && Number.isFinite(Number(macroRes.text))
        ? Number(macroRes.text)
        : macroRes.locals.value;
    return {
      value: numVal,
      textOutput: macroRes.text || undefined,
      locals: macroRes.locals,
      missingRefs: macroRes.missingRefs,
      error: macroRes.error,
    };
  }

  // 2. Plain-English Prose Guard
  if (looksLikeEnglishProse(trimmed)) {
    return {
      value: undefined,
      locals: {},
      missingRefs: [],
      isProse: true,
      error: 'Plain-English rule detected — click "Convert to Local Formula" to translate it into math/macro syntax.',
    };
  }

  // 3. Clean Multi-Line Math Program
  const locals: Record<string, number> = { ...initialNumLocals };
  const diagnostics: { missingRefs: Set<string>; error?: string } = {
    missingRefs: new Set<string>(),
  };
  const lines = trimmed
    .split(/\r?\n|;/)
    .map(s => s.trim())
    .filter(s => Boolean(s) && !s.startsWith('//') && !s.startsWith('#'));

  if (!lines.length) {
    return { value: undefined, locals, missingRefs: [], error: 'Formula is empty' };
  }

  let lastValue: number | undefined;
  for (const line of lines) {
    const assignMatch = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([\s\S]+)$/);
    if (assignMatch && !assignMatch[2]!.startsWith('=')) {
      const varName = assignMatch[1]!;
      const expr = assignMatch[2]!;
      const val = evaluateSingleExpression(expr, locals, ctx, diagnostics);
      if (val === undefined) {
        return {
          value: undefined,
          locals,
          missingRefs: [...diagnostics.missingRefs],
          error: diagnostics.error,
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
          error: diagnostics.error,
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
    error: diagnostics.error,
  };
}

/**
 * Legacy single-expression entry point preserved for backwards compatibility.
 */
export function evaluateStatFormula(
  formula: string,
  resolveRef: (ref: string) => number | undefined,
): number | undefined {
  return evaluateFormulaProgram(formula, {
    resolveRef,
    resolveStringRef: () => undefined,
    hasCond: () => false,
  }).value;
}

function buildContextResolver(
  state: CampaignState,
  schemas: StatSchemaDef[],
  actor?: CharacterRecord,
): {
  ctx: FormulaEvalContext;
  strVars: Record<string, string>;
  numVars: Record<string, number>;
} {
  const sumModifierDelta = (statId: string, actorId?: string): number => {
    if (!state.modifiers?.length) return 0;
    let total = 0;
    for (const mod of state.modifiers) {
      if (mod.statId !== statId) continue;
      if (actorId ? mod.targetActorId === actorId : !mod.targetActorId) {
        total += Number.isFinite(mod.delta) ? mod.delta : 0;
      }
    }
    return total;
  };

  const strVars: Record<string, string> = {
    location: state.scene.location || '',
    time: state.scene.timeLabel || '',
    date: state.scene.dateLabel || '',
    weather: state.scene.weather || '',
    turn: String(state.turnCount),
    player_name: state.player.name || 'User',
    player_attire: state.player.attire || '',
    player_condition: state.player.condition || '',
  };
  const numVars: Record<string, number> = {
    turn: state.turnCount,
    elapsed_minutes: state.elapsedMinutes,
  };

  const isCompactTokenSource = (s: StatSchemaDef, rawVal: unknown): boolean => {
    if (typeof rawVal === 'number') return true;
    if (typeof rawVal !== 'string') return false;
    if (s.displayStyle === 'feed_cards' || s.displayStyle === 'quote_callout') return false;
    const trimmed = rawVal.trim();
    if (!trimmed || trimmed === 'None') return false;
    if (trimmed.includes('\n') || trimmed.length > 110) return false;
    return true;
  };

  // Seed dynamic variables from active scope's stats & tokens (zero hardcoding; ignores long prose feeds)
  if (actor) {
    strVars.name = actor.name;
    strVars.conditions = actor.conditions.join(', ');
    strVars.demeanor = actor.demeanor || '';
    strVars.attire = actor.attire || '';
    for (const [fk, fv] of Object.entries(actor.fields)) {
      if (fv) strVars[fk] = fv;
    }
    for (const s of schemas) {
      if (!s.enabled || s.scope !== 'character') continue;
      const m = actor.meters[s.id];
      const srcVal = m?.calibrated ? m.value : s.defaultValue;
      strVars[s.id] = String(srcVal ?? '');
      if (!isCompactTokenSource(s, srcVal)) continue;
      for (const [tk, tv] of Object.entries(parseStatTokens(srcVal))) {
        const key = tk === 'value' ? s.id : tk;
        if (numVars[key] === undefined) {
          numVars[key] = tv;
          strVars[key] = String(tv);
        }
      }
    }
  } else {
    strVars.name = state.player.name || 'User';
    strVars.conditions = state.player.condition || '';
    strVars.attire = state.player.attire || '';
    for (const s of schemas) {
      if (!s.enabled || s.scope === 'character') continue;
      const r = state.stats[s.id];
      const srcVal = r?.calibrated ? r.value : s.defaultValue;
      strVars[s.id] = String(srcVal ?? '');
      if (!isCompactTokenSource(s, srcVal)) continue;
      for (const [tk, tv] of Object.entries(parseStatTokens(srcVal))) {
        const key = tk === 'value' ? s.id : tk;
        if (numVars[key] === undefined) {
          numVars[key] = tv;
          strVars[key] = String(tv);
        }
      }
    }
  }

  const resolveFromRuntimeValue = (
    rawVal: unknown,
    subKey: string | undefined,
    statId: string,
    actorId?: string,
  ): number | undefined => {
    if (subKey) {
      const tokens = parseStatTokens(rawVal);
      if (tokens[subKey] !== undefined) return tokens[subKey];
      return tokens[subKey.toLowerCase()];
    }
    if (typeof rawVal === 'number' && Number.isFinite(rawVal)) {
      return rawVal + sumModifierDelta(statId, actorId);
    }
    if (typeof rawVal === 'string') {
      const num = Number(rawVal);
      if (Number.isFinite(num)) return num + sumModifierDelta(statId, actorId);
    }
    return undefined;
  };

  const firstPresentActor = Object.values(state.characters).find(c => c.present);

  const resolveStringRef = (rawRef: string): string | undefined => {
    const clean = rawRef.trim();
    if (!clean) return undefined;
    if (Object.prototype.hasOwnProperty.call(strVars, clean)) return strVars[clean];
    const low = clean.toLowerCase();
    for (const [k, v] of Object.entries(strVars)) {
      if (k.toLowerCase() === low) return v;
    }
    if (actor && actor.meters[clean] !== undefined) return String(actor.meters[clean]!.value);
    if (state.stats[clean] !== undefined) return String(state.stats[clean]!.value);
    return undefined;
  };

  const resolveRef = (rawRef: string): number | undefined => {
    const clean = rawRef.trim();
    if (!clean) return undefined;

    if (clean.startsWith('character:')) {
      const parts = clean.slice(10).split('.');
      const actorPart = parts[0];
      const rest = parts[1];
      const third = parts[2];
      if (!actorPart || !rest) return undefined;
      const target = state.characters[actorPart];
      return target
        ? resolveFromRuntimeValue(target.meters[rest]?.value, third, rest, target.id)
        : undefined;
    }

    if (clean.startsWith('first_present.')) {
      const parts = clean.slice('first_present.'.length).split('.');
      const meterId = parts[0];
      if (!meterId || !firstPresentActor) return undefined;
      return resolveFromRuntimeValue(
        firstPresentActor.meters[meterId]?.value,
        parts[1],
        meterId,
        firstPresentActor.id,
      );
    }

    if (clean.startsWith('self.')) {
      const parts = clean.slice(5).split('.');
      const key = parts[0]!;
      const subKey = parts[1];
      if (actor) {
        const val = resolveFromRuntimeValue(actor.meters[key]?.value, subKey, key, actor.id);
        if (val !== undefined) return val;
      }
      return resolveFromRuntimeValue(state.stats[key]?.value, subKey, key);
    }

    if (clean.includes('.')) {
      const [statId, subKey] = clean.split('.', 2);
      if (statId && subKey) {
        if (actor && actor.meters[statId]) {
          const val = resolveFromRuntimeValue(actor.meters[statId]?.value, subKey, statId, actor.id);
          if (val !== undefined) return val;
        }
        if (state.stats[statId]) {
          const val = resolveFromRuntimeValue(state.stats[statId]?.value, subKey, statId);
          if (val !== undefined) return val;
        }
      }
    }

    if (actor && actor.meters[clean]) {
      const val = resolveFromRuntimeValue(actor.meters[clean]?.value, undefined, clean, actor.id);
      if (val !== undefined) return val;
    }
    if (state.stats[clean]) {
      const val = resolveFromRuntimeValue(state.stats[clean]?.value, undefined, clean);
      if (val !== undefined) return val;
    }

    if (numVars[clean] !== undefined) return numVars[clean];
    const lowClean = clean.toLowerCase();
    for (const [k, v] of Object.entries(numVars)) {
      if (k.toLowerCase() === lowClean) return v;
    }
    return undefined;
  };

  const hasCond = (pattern: string): boolean => {
    const terms = pattern
      .split(/[|,;]+/)
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);
    if (!terms.length) return false;

    const haystackParts: string[] = [];
    if (actor) {
      haystackParts.push(...actor.conditions, actor.demeanor, actor.attire);
      for (const m of Object.values(actor.meters)) {
        if (typeof m.value === 'string') haystackParts.push(m.value);
      }
    } else {
      haystackParts.push(state.player.condition, state.player.attire);
      for (const s of Object.values(state.stats)) {
        if (typeof s.value === 'string') haystackParts.push(s.value);
      }
    }
    const haystack = haystackParts.join(' ').toLowerCase();
    return terms.some(t => haystack.includes(t));
  };

  return {
    ctx: { resolveRef, resolveStringRef, hasCond },
    strVars,
    numVars,
  };
}

export function formatFormulaOutput(
  schema: StatSchemaDef,
  evalResult: { value: number | undefined; textOutput?: string; locals: Record<string, number> },
): number | string | undefined {
  const tpl = schema.formulaOutputTemplate?.trim();
  if (tpl) {
    let anyReplaced = false;
    const formatted = tpl.replace(/\{([A-Za-z0-9_]+)\}/g, (_m, key: string) => {
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
      return '—';
    });
    return anyReplaced ? formatted : undefined;
  }
  if (evalResult.textOutput !== undefined) {
    return evalResult.textOutput;
  }
  if (evalResult.value === undefined) return undefined;
  return Math.max(schema.min, Math.min(schema.max, evalResult.value));
}

export function collectAvailableTokensSummary(
  state: CampaignState,
  schemas: StatSchemaDef[],
  scope: StatSchemaDef['scope'],
  actor?: CharacterRecord,
): { numTokens: Record<string, number>; strVars: Record<string, string> } {
  const { numVars, strVars } = buildContextResolver(
    state,
    schemas,
    scope === 'character' ? actor : undefined,
  );
  // Keep primary casing over duplicate lowercase aliases in summary display
  const cleanNums: Record<string, number> = {};
  for (const [k, v] of Object.entries(numVars)) {
    const hasUpperKey = Object.keys(numVars).some(
      other => other !== k && other.toLowerCase() === k && other !== other.toLowerCase(),
    );
    if (!hasUpperKey) cleanNums[k] = v;
  }
  return { numTokens: cleanNums, strVars };
}

export function previewStatFormula(
  schema: StatSchemaDef,
  state: CampaignState,
  allSchemas: StatSchemaDef[],
  actorId?: string,
): {
  output?: number | string;
  locals: Record<string, number>;
  missingRefs: string[];
  isProse?: boolean;
  error?: string;
  availableTokens: Record<string, number>;
  availableStringVars: Record<string, string>;
  targetName: string;
} {
  const formula = schema.formula?.trim() ?? '';
  const actor =
    schema.scope === 'character'
      ? (actorId ? state.characters[actorId] : Object.values(state.characters)[0])
      : undefined;
  const targetName = actor ? actor.name : (state.player.name || 'Player');
  const summary = collectAvailableTokensSummary(state, allSchemas, schema.scope, actor);

  if (!formula) {
    return {
      locals: {},
      missingRefs: [],
      availableTokens: summary.numTokens,
      availableStringVars: summary.strVars,
      targetName,
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
    targetName,
  };
}

function splitTopLevelCallArgs(rawArgs: string): string[] {
  const args: string[] = [];
  let depth = 0;
  let quote: string | null = null;
  let cur = '';
  for (let i = 0; i < rawArgs.length; i++) {
    const ch = rawArgs[i]!;
    if (quote) {
      cur += ch;
      if (ch === '\\' && i + 1 < rawArgs.length) {
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
    if (ch === '(' || ch === '[') depth++;
    else if ((ch === ')' || ch === ']') && depth > 0) depth--;
    else if (ch === ',' && depth === 0) {
      args.push(cur.trim());
      cur = '';
      continue;
    }
    cur += ch;
  }
  if (cur.trim() || args.length) args.push(cur.trim());
  return args;
}

function unquoteStringArg(raw: string): string {
  const t = raw.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1);
  }
  return t;
}

/**
 * Evaluates a category's `localRuleFormula` for Player or a specific Character.
 * Supports:
 * - Variable assignments: `hp_pct = HP / max(1, HP_max)`
 * - Stateful conditional modifiers: `mod("composure", "High Arousal", arousal >= 75 ? -10 : 0)`
 * - Direct stat updates: `set("stat_id", expr)` or `if(cond) mod(...)` / `if(cond) set(...)`
 */
function executeCategoryLocalRuleForScope(
  cat: StatCategoryDef,
  schemas: StatSchemaDef[],
  state: CampaignState,
  actor?: CharacterRecord,
): { appliedEffects: string[]; error?: string } {
  const program = cat.localRuleFormula?.trim() ?? '';
  if (!program) return { appliedEffects: [] };

  const sourceKey = `category:${cat.id}:${actor?.id ?? 'player'}`;
  // Clear prior modifiers owned by this category/entity so inactive conditions auto-revert cleanly
  state.modifiers = (state.modifiers ?? []).filter(m => m.source !== sourceKey);

  const env = buildContextResolver(state, schemas, actor);
  const locals: Record<string, number> = { ...env.numVars };
  const diagnostics: { missingRefs: Set<string>; error?: string } = {
    missingRefs: new Set<string>(),
  };
  const appliedEffects: string[] = [];

  const rawLines = program
    .split(/\r?\n|;/)
    .map(s => s.trim())
    .filter(s => Boolean(s) && !s.startsWith('//') && !s.startsWith('#'));

  const runStatement = (stmt: string): void => {
    const ifAction = stmt.match(/^if\s*\(([\s\S]+?)\)\s+(mod|set|add)\s*\(([\s\S]+)\)$/i);
    if (ifAction) {
      const condVal = evaluateSingleExpression(ifAction[1]!, locals, env.ctx, diagnostics);
      if (condVal !== undefined && condVal !== 0 && !Number.isNaN(condVal)) {
        runStatement(`${ifAction[2]}(${ifAction[3]})`);
      }
      return;
    }

    const modMatch = stmt.match(/^mod\s*\(([\s\S]+)\)$/i);
    if (modMatch) {
      const args = splitTopLevelCallArgs(modMatch[1]!);
      if (args.length < 3) {
        diagnostics.error = 'mod() requires (statId, label, deltaExpression)';
        return;
      }
      const statId = unquoteStringArg(args[0]!);
      const label = unquoteStringArg(args[1]!) || cat.name;
      const deltaVal = evaluateSingleExpression(args.slice(2).join(','), locals, env.ctx, diagnostics);
      if (deltaVal === undefined || deltaVal === 0) return;

      const modId = `catmod_${slugifyKey(cat.id)}_${slugifyKey(actor?.id ?? 'player')}_${slugifyKey(statId)}_${slugifyKey(label)}`;
      const entry: TimedModifier = {
        id: modId,
        label,
        statId,
        ...(actor ? { targetActorId: actor.id } : {}),
        delta: Math.round(deltaVal),
        source: sourceKey,
      };
      state.modifiers.push(entry);
      appliedEffects.push(`${actor ? `${actor.name} · ` : ''}${statId} ${entry.delta >= 0 ? `+${entry.delta}` : entry.delta} (${label})`);
      return;
    }

    const setMatch = stmt.match(/^(set|add)\s*\(([\s\S]+)\)$/i);
    if (setMatch) {
      const action = setMatch[1]!.toLowerCase();
      const args = splitTopLevelCallArgs(setMatch[2]!);
      if (args.length < 2) {
        diagnostics.error = `${action}() requires (statId, expression)`;
        return;
      }
      const statId = unquoteStringArg(args[0]!);
      const val = evaluateSingleExpression(args.slice(1).join(','), locals, env.ctx, diagnostics);
      if (val === undefined) return;
      const targetSchema = schemas.find(s => s.id === statId);
      if (actor && (targetSchema?.scope === 'character' || actor.meters[statId])) {
        const cur = actor.meters[statId];
        if (cur?.locked || targetSchema?.locked) return;
        const base = typeof cur?.value === 'number' ? cur.value : 0;
        const rawNext = action === 'add' ? base + val : val;
        const clamped = targetSchema
          ? Math.max(targetSchema.min, Math.min(targetSchema.max, Math.round(rawNext)))
          : Math.round(rawNext);
        actor.meters[statId] = {
          value: clamped,
          calibrated: true,
          locked: false,
          lastReason: `Category rule: ${cat.name}`,
        };
        appliedEffects.push(`${actor.name} · ${statId} = ${clamped}`);
      } else if (targetSchema && targetSchema.scope !== 'character') {
        const cur = state.stats[statId];
        if (cur?.locked || targetSchema.locked) return;
        const base = typeof cur?.value === 'number' ? cur.value : 0;
        const rawNext = action === 'add' ? base + val : val;
        const clamped = Math.max(targetSchema.min, Math.min(targetSchema.max, Number(rawNext.toFixed(2))));
        state.stats[statId] = {
          id: statId,
          scope: targetSchema.scope,
          value: clamped,
          calibrated: true,
          locked: false,
          lastReason: `Category rule: ${cat.name}`,
        };
        appliedEffects.push(`${statId} = ${clamped}`);
      }
      return;
    }

    const assignMatch = stmt.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([\s\S]+)$/);
    if (assignMatch && !assignMatch[2]!.startsWith('=')) {
      const varName = assignMatch[1]!;
      const val = evaluateSingleExpression(assignMatch[2]!, locals, env.ctx, diagnostics);
      if (val !== undefined) locals[varName] = val;
    }
  };

  for (const line of rawLines) {
    runStatement(line);
    if (diagnostics.error) break;
  }

  return { appliedEffects, error: diagnostics.error };
}

export function previewCategoryFormula(
  cat: StatCategoryDef,
  state: CampaignState,
  schemas: StatSchemaDef[],
  actorId?: string,
): { appliedEffects: string[]; error?: string } {
  const cloned = structuredClone(state);
  const memberStats = schemas.filter(s => s.enabled && s.categoryId === cat.id);
  const hasCharMembers = memberStats.some(s => s.scope === 'character') || /\bmod\s*\(|\bself\./i.test(cat.localRuleFormula ?? '');
  const targetActor = hasCharMembers
    ? (actorId ? cloned.characters[actorId] : Object.values(cloned.characters)[0])
    : undefined;
  return executeCategoryLocalRuleForScope(cat, schemas, cloned, targetActor);
}

/**
 * Evaluates derived and hybrid (`ai_plus_local`) stat formulas AND category-level
 * `localRuleFormula` rules across both Player/World/Scene AND Character scopes.
 */
export function recomputeDerivedStats(
  schemas: StatSchemaDef[],
  state: CampaignState,
  categories: StatCategoryDef[] = [],
): void {
  const derivedDefs = schemas.filter(
    s =>
      s.enabled &&
      s.calculationMode !== 'ai' &&
      Boolean(s.formula?.trim()),
  );
  if (!derivedDefs.length) return;

  const maxPasses = Math.min(8, derivedDefs.length + 2);
  for (let pass = 0; pass < maxPasses; pass++) {
    let changed = false;

    const nonCharEnv = buildContextResolver(state, schemas);
    for (const def of derivedDefs) {
      if (def.scope === 'character' || !def.formula) continue;
      const current = state.stats[def.id];
      if (current?.locked || def.locked) continue;

      const evalRes = evaluateFormulaProgram(
        def.formula,
        nonCharEnv.ctx,
        nonCharEnv.strVars,
        nonCharEnv.numVars,
      );
      const formatted = formatFormulaOutput(def, evalRes);
      if (formatted === undefined) continue;

      if (!current?.calibrated || current.value !== formatted) {
        changed = true;
      }
      state.stats[def.id] = {
        id: def.id,
        scope: def.scope,
        value: formatted,
        calibrated: true,
        locked: false,
        lastReason:
          def.calculationMode === 'ai_plus_local'
            ? `AI + Local Math (${slugifyKey(def.id, 'formula')})`
            : `Computed locally (${slugifyKey(def.id, 'formula')})`,
      };
    }

    const charDerived = derivedDefs.filter(d => d.scope === 'character');
    if (charDerived.length > 0) {
      for (const actor of Object.values(state.characters)) {
        const actorEnv = buildContextResolver(state, schemas, actor);
        for (const def of charDerived) {
          if (!def.formula) continue;
          const current = actor.meters[def.id];
          if (current?.locked || def.locked) continue;

          const evalRes = evaluateFormulaProgram(
            def.formula,
            actorEnv.ctx,
            actorEnv.strVars,
            actorEnv.numVars,
          );
          const formatted = formatFormulaOutput(def, evalRes);
          if (formatted === undefined) continue;

          if (!current?.calibrated || current.value !== formatted) {
            changed = true;
          }
          actor.meters[def.id] = {
            value: formatted,
            calibrated: true,
            locked: false,
            lastReason:
              def.calculationMode === 'ai_plus_local'
                ? `AI + Local Math (${slugifyKey(def.id, 'formula')})`
                : `Computed locally (${slugifyKey(def.id, 'formula')})`,
          };
        }
      }
    }

    if (!changed) break;
  }

  // Evaluate Category-level local cross-stat rules & conditional modifiers
  const activeFormulaCats = categories.filter(
    c => c.enabled && Boolean(c.localRuleFormula?.trim()),
  );
  if (activeFormulaCats.length > 0) {
    for (const cat of activeFormulaCats) {
      const memberStats = schemas.filter(s => s.enabled && s.categoryId === cat.id);
      const hasCharMembers =
        memberStats.some(s => s.scope === 'character') ||
        /\bself\.|character:/.test(cat.localRuleFormula ?? '');
      const hasPlayerMembers =
        memberStats.some(s => s.scope !== 'character') || memberStats.length === 0 || !hasCharMembers;

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

/**
 * Resolves the human-readable scale anchor label for any numeric stat value.
 */
export function resolveAnchorLabel(
  anchors: StatScaleAnchor[] | undefined,
  value: number,
): string {
  if (!anchors || !anchors.length) return '';
  const sorted = [...anchors].sort((a, b) => b.value - a.value);
  for (const anchor of sorted) {
    if (value >= anchor.value) return anchor.label;
  }
  return sorted.at(-1)?.label ?? '';
}

export function formatStoryClock(elapsedMinutes: number): string {
  const totalMinutes = Math.max(0, Math.round(elapsedMinutes)) + 8 * 60;
  const hours24 = Math.floor((totalMinutes % 1440) / 60);
  const mins = totalMinutes % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${String(hours12).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${period}`;
}

export function formatDayAndClock(elapsedMinutes: number): string {
  const day = Math.floor(Math.max(0, elapsedMinutes) / 1440) + 1;
  return `Day ${day} · ${formatStoryClock(elapsedMinutes)}`;
}

export function formatSceneBanner(state: CampaignState): {
  time: string;
  date: string;
  location: string;
  weather: string;
  formatted: string;
} {
  const day = Math.floor(Math.max(0, state.elapsedMinutes) / 1440) + 1;
  const time = state.scene.timeLabel?.trim() || formatStoryClock(state.elapsedMinutes);
  const date = state.scene.dateLabel?.trim() || `Day ${day}`;
  const location = state.scene.location?.trim() || state.title || 'Uncharted Scene';
  const weather = state.scene.weather?.trim() || 'Clear';
  return {
    time,
    date,
    location,
    weather,
    formatted: `[ 🕰️ ${time} | 📅 ${date} | 📍 ${location} | 🌦️ ${weather} ]`,
  };
}
