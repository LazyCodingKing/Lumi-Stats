const BRAILLE_OR_EXOTIC_SPACE_RE =
  /[\u2800\u00A0\u1680\u180E\u2000-\u200A\u202F\u205F\u2060\u3000\u200B-\u200D\uFEFF]|^[ \t]{4,}\S/m;

const PROTECTED_BLOCKS_RE =
  /(<(?:lumi-stats|lumi-tracker|worldweave|json|style|script|pre|code)\b[\s\S]*?<\/(?:lumi-stats|lumi-tracker|worldweave|json|style|script|pre|code)\s*>|```[\s\S]*?```)/gi;

export function fnv1a32(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

export function hasBrailleOrWhitespaceArtifacts(raw: string): boolean {
  if (!raw || typeof raw !== 'string') return false;
  return BRAILLE_OR_EXOTIC_SPACE_RE.test(raw);
}

/**
 * Normalizes Braille pattern blanks (U+2800), exotic Unicode spaces, zero-width
 * characters, and accidental 4-space CommonMark code-block indents while keeping
 * `<lumi-stats>`, `<json>`, and fenced code blocks untouched.
 */
export function cleanBrailleAndProseWhitespace(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';

  const normalizeProseSegment = (seg: string): string => {
    let txt = seg;
    // 1. Replace Braille blank (U+2800) and exotic spaces with standard ASCII space
    txt = txt.replace(/[\u2800\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, ' ');
    // 2. Remove invisible zero-width characters
    txt = txt.replace(/[\u180E\u200B-\u200D\u2060\uFEFF]/g, '');
    // 3. Strip 4+ leading spaces on prose paragraphs so Markdown doesn't render them as <pre><code>
    txt = txt.replace(/^[ \t]+(\*[^\s*]|-[^\s\-]|[^\s\-*#+>0-9`~])/gm, '$1');
    txt = txt.replace(/^[ \t]{4,}(?=[-*+]\s|\d+\.\s|>)/gm, '  ');
    // 4. Trim trailing horizontal whitespace and collapse repeated spaces mid-line
    txt = txt.replace(/[ \t]+\n/g, '\n');
    txt = txt.replace(/([^\n \t])[ \t]{2,}([^\n \t])/g, '$1 $2');
    txt = txt.replace(/\n{3,}/g, '\n\n');
    return txt;
  };

  return raw
    .split(PROTECTED_BLOCKS_RE)
    .map((chunk, idx) => (idx % 2 === 1 ? chunk : normalizeProseSegment(chunk)))
    .join('');
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function normalizeSensitiveWordsList(words: readonly string[] | undefined): string[] {
  if (!Array.isArray(words)) return [];
  const unique = new Set<string>();
  for (const w of words) {
    const clean = String(w ?? '').trim().toLowerCase();
    if (clean.length >= 2 && clean.length <= 64) {
      unique.add(clean);
    }
  }
  return [...unique].sort((a, b) => b.length - a.length);
}

export function obfuscateWordToken(word: string, replaceVowelsWith1 = true): string {
  const replacement = replaceVowelsWith1 ? '1' : '*';
  return word.replace(/[aeiouAEIOU]/g, replacement);
}

/**
 * Obfuscates configured sensitive words in natural prose (e.g. `blood` -> `bl11d`)
 * while leaving `<lumi-stats>`, `<json>`, `<style>`, `<script>`, and code blocks intact.
 */
export function obfuscateSensitiveWords(
  raw: string,
  words: readonly string[] | undefined,
  replaceVowelsWith1 = true,
): string {
  if (!raw || typeof raw !== 'string') return '';
  const list = normalizeSensitiveWordsList(words);
  if (!list.length) return raw;

  const pattern = new RegExp(
    `(?<![\\p{L}\\p{N}_])(?:${list.map(escapeRegExp).join('|')})(?![\\p{L}\\p{N}_])`,
    'giu',
  );

  return raw
    .split(PROTECTED_BLOCKS_RE)
    .map((chunk, idx) =>
      idx % 2 === 1
        ? chunk
        : chunk.replace(pattern, match => obfuscateWordToken(match, replaceVowelsWith1)),
    )
    .join('');
}

export interface WordRestoreRegexSpec {
  word: string;
  findRegex: string;
  replaceString: string;
  flags: string;
}

/**
 * Builds a safe regex specification that restores an obfuscated word (e.g. `bl11d`,
 * `Bl11d`, `bl11dy`, `bl1od`, `bl**d`) back to its normal spelling without matching
 * un-obfuscated English words.
 */
export function buildWordRestoreRegexSpec(
  rawWord: string,
  _replaceVowelsWith1 = true,
): WordRestoreRegexSpec | null {
  const word = String(rawWord ?? '').trim().toLowerCase();
  if (word.length < 2 || !/[aeiou]/i.test(word)) return null;

  const chars = [...word];
  const charTokens = chars.map(ch => {
    if (/[aeiou]/i.test(ch)) {
      return `[${ch}${ch.toUpperCase()}1*]`;
    }
    if (/[a-z]/i.test(ch)) {
      return `[${ch}${ch.toUpperCase()}]`;
    }
    return escapeRegExp(ch);
  });

  const firstChar = chars[0]!;
  const startsWithConsonant = /[a-z]/i.test(firstChar) && !/[aeiou]/i.test(firstChar);
  if (startsWithConsonant) {
    charTokens[0] = `([${firstChar}${firstChar.toUpperCase()}])`;
  }

  const maxSpan = Math.max(0, chars.length - 1);
  // Require at least one obfuscation marker (1 or *) within the stem so plain words never match
  const hasMarkerGuard = `(?=[\\p{L}\\p{N}*'\\- ]{0,${maxSpan}}[1*])`;
  // Allow common inflected suffixes (e.g. bl11dy, bl11ds, k1lled, k1lling) on 4+ letter stems
  const trailingBoundary =
    chars.length >= 4
      ? `(?=[a-zA-Z]{0,10}(?![\\p{L}\\p{N}_]))`
      : `(?![\\p{L}\\p{N}_])`;

  return {
    word,
    findRegex: `(?<![\\p{L}\\p{N}_])${hasMarkerGuard}${charTokens.join('')}${trailingBoundary}`,
    replaceString: startsWithConsonant ? `$1${word.slice(1)}` : word,
    flags: startsWithConsonant ? 'gu' : 'giu',
  };
}

/**
 * Restores obfuscated sensitive words (e.g. `bl11d` -> `blood`, `bl11dy` -> `bloody`,
 * `bl1od` -> `blood`) for readable display while preserving original capitalization.
 */
export function deobfuscateSensitiveWords(
  raw: string,
  words: readonly string[] | undefined,
  replaceVowelsWith1 = true,
): string {
  if (!raw || typeof raw !== 'string') return '';
  const list = normalizeSensitiveWordsList(words);
  if (!list.length) return raw;

  const specs = list
    .map(w => {
      const spec = buildWordRestoreRegexSpec(w, replaceVowelsWith1);
      if (!spec) return null;
      try {
        return {
          word: spec.word,
          regex: new RegExp(spec.findRegex, spec.flags),
        };
      } catch {
        return null;
      }
    })
    .filter((item): item is { word: string; regex: RegExp } => Boolean(item));

  if (!specs.length) return raw;

  const matchCase = (matched: string, original: string): string => {
    const letters = matched.replace(/[^a-zA-Z]/g, '');
    if (letters.length > 1 && letters === letters.toUpperCase()) {
      return original.toUpperCase();
    }
    if (matched[0] && matched[0] === matched[0].toUpperCase() && matched[0] !== matched[0].toLowerCase()) {
      return original.charAt(0).toUpperCase() + original.slice(1);
    }
    return original;
  };

  return raw
    .split(PROTECTED_BLOCKS_RE)
    .map((chunk, idx) => {
      if (idx % 2 === 1) return chunk;
      let out = chunk;
      for (const item of specs) {
        out = out.replace(item.regex, matched => matchCase(matched, item.word));
      }
      return out;
    })
    .join('');
}

/**
 * Bounded LRU cache for `registerMessageContentProcessor` (`origin: "render"`)
 * keyed by `(userId, chatId, messageId, fnv1a32(content))` as recommended by Spindle docs.
 */
export class RenderProseCache {
  private map = new Map<string, string>();

  constructor(private maxEntries = 200) {}

  get(userId: string, chatId: string, messageId: string | undefined, content: string): string | undefined {
    const key = `${userId}:${chatId}:${messageId ?? ''}:${fnv1a32(content)}`;
    const cached = this.map.get(key);
    if (cached !== undefined) {
      this.map.delete(key);
      this.map.set(key, cached);
    }
    return cached;
  }

  set(userId: string, chatId: string, messageId: string | undefined, content: string, output: string): void {
    const key = `${userId}:${chatId}:${messageId ?? ''}:${fnv1a32(content)}`;
    if (this.map.size >= this.maxEntries && !this.map.has(key)) {
      const oldest = this.map.keys().next().value;
      if (oldest !== undefined) this.map.delete(oldest);
    }
    this.map.set(key, output);
  }

  invalidateChat(chatId: string): void {
    for (const k of this.map.keys()) {
      if (k.includes(`:${chatId}:`)) this.map.delete(k);
    }
  }

  clear(): void {
    this.map.clear();
  }
}
