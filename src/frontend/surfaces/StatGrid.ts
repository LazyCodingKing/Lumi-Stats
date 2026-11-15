import type { SpindleFrontendContext } from 'lumiverse-spindle-types';
import {
  formatSceneBanner,
  previewStatFormula,
  resolveAnchorLabel,
} from '../../shared/formula';
import { buildProportionalAnchors, createStatSchema, slugifyKey } from '../../shared/templates';
import type {
  BuiltInTrackerId,
  CampaignState,
  StatDisplayStyle,
  StatLayoutSpan,
  StatScaleAnchor,
  StatSchemaDef,
  StatScope,
  StatValueKind,
  StatVolatility,
} from '../../shared/types';
import {
  bindContextMenuWithLongPress,
  btn,
  el,
  iconBtn,
  mountNativeCheckbox,
  mountNativeCollapsible,
  mountNativeSwitch,
  mountThemedSelect,
  type ComponentScope,
  type LumiFrontendController,
} from '../controller';
import {
  openBuiltinTrackerModal,
  openScenePillEditorModal,
  resolveBuiltInTrackerConfig,
} from './BuiltinTrackerModals';
import {
  renderAttributesWidget,
  renderCurrencyWidget,
  renderHeartsWidget,
  renderInventoryWidget,
  renderSkillTreeWidget,
  renderStatusFxWidget,
  renderXpLevelWidget,
} from './RpgWidgets';

/**
 * Delegates HTML sanitization to Lumiverse's host-side DOMPurify via `ctx.dom.inject()`,
 * eliminating custom HTML allowlist/regex sanitization code.
 */
export function mountSanitizedHtml(
  target: HTMLElement,
  rawHtml: string,
  ctx?: SpindleFrontendContext,
): void {
  const html = rawHtml.trim();
  if (!html) return;
  const runInject = () => {
    if (!ctx?.dom?.inject) {
      target.textContent = html.replace(/<[^>]+>/g, '');
      return;
    }
    try {
      ctx.dom.inject(target, html, 'beforeend');
    } catch {
      target.textContent = html.replace(/<[^>]+>/g, '');
    }
  };
  if (target.isConnected) {
    runInject();
  } else {
    queueMicrotask(() => {
      if (target.isConnected) runInject();
    });
  }
}

export interface ParsedFeedEntry {
  subject?: string;
  steps: string[];
}

const STEP_KEY_RE =
  /^(?:impulse|inhibition|action|acted|thought|inner\s*thought|saw|heard|saw\/heard|take|observation|trigger|response|result|outcome|cause|effect|before|after|step|status|state|goal|intent|attitude|location|current|current\s*step|next|hook|active\s*plans?|leverage|pivot|reward|risk|verdict|knows\/misreads|knows|blind\s*to|secret\s*stage)$/i;

function normalizeBracketKeySyntax(raw: string): string {
  return raw
    // Convert `[Key]{Value}` -> `Key: Value`
    .replace(/\[\s*([^\]\n:]{1,40}?)\s*\]\s*\{\s*([^\}\n]+?)\s*\}/g, '$1: $2')
    // Convert `Key:[Inner...]` (e.g. `Active plans:[S1:... | Pivot:...]`) -> `Key: Inner...`
    .replace(/([A-Za-z][A-Za-z0-9_\/\s-]{1,32})\s*:\s*\[([^\[\]\n]+)\]/g, '$1: $2')
    // Convert `[Key]: {Value}` or `[Key]: Value` -> `Key: Value`
    .replace(/\[\s*([^\]\n:]{1,40}?)\s*\]\s*:\s*\{?\s*([^\]\}\n]+?)\s*\}?(?=\s*(?:->|→|⇒|\||vs\b|$))/gi, '$1: $2');
}

function stripOuterBrackets(s: string): string {
  let t = normalizeBracketKeySyntax(s).trim();
  while (
    (t.startsWith('[') && t.endsWith(']') && !t.slice(1, -1).includes('[')) ||
    (t.startsWith('{') && t.endsWith('}') && !t.slice(1, -1).includes('{'))
  ) {
    t = t.slice(1, -1).trim();
  }
  return t;
}

export function parseStructuredStatText(raw: string): ParsedFeedEntry[] {
  const clean = normalizeBracketKeySyntax(raw).trim();
  if (!clean) return [];
  const rows = clean
    .split(/\r?\n|(?:\s*;\s*)|(?:\s+•\s+)/)
    .map(s => stripOuterBrackets(s.replace(/^[-*•]\s+/, '').trim()))
    .filter(Boolean);

  return rows.map(rowText => {
    const arrowSteps = rowText
      .split(/\s*(?:->|→|⇒)\s*/)
      .map(s => stripOuterBrackets(s))
      .filter(Boolean);

    let subject: string | undefined;
    if (arrowSteps.length > 1) {
      const firstStep = arrowSteps[0]!;
      const firstMatch = firstStep.match(/^([^:\[\]\|]{2,50}):\s*([\s\S]+)$/);
      const keyCandidate = firstMatch?.[1]?.trim() ?? '';
      const secondHasKey = /^[^:\[\]]{1,30}:\s*\S/.test(arrowSteps[1]!);
      if (
        firstMatch &&
        !STEP_KEY_RE.test(keyCandidate) &&
        !/\bvs\.?\b/i.test(firstStep) &&
        !firstStep.includes('|') &&
        !secondHasKey
      ) {
        subject = keyCandidate;
        arrowSteps[0] = firstMatch[2]!.trim();
      }
    }

    const steps = arrowSteps
      .flatMap(step => step.split(/\s*\|\s*/))
      .map(s => stripOuterBrackets(s))
      .filter(Boolean);

    return {
      ...(subject ? { subject } : {}),
      steps: steps.length ? steps : [rowText],
    };
  });
}

function renderKeyValOrTextChip(rawSegment: string): HTMLElement | null {
  const clean = stripOuterBrackets(rawSegment);
  if (!clean) return null;
  const kvMatch = clean.match(/^([^:->→\[\]]{1,40}):\s*([\s\S]*)$/);
  const node = el('span', 'ls-step-node');
  if (kvMatch) {
    const keyLabel = kvMatch[1]!.trim();
    const valText = stripOuterBrackets(kvMatch[2] ?? '');
    if (!valText) return null;
    const keySpan = el('strong', '', `${keyLabel}: `);
    keySpan.style.color = 'var(--ls-primary)';
    keySpan.style.marginRight = '4px';
    node.append(keySpan, document.createTextNode(valText));
  } else {
    node.textContent = clean;
  }
  return node;
}

function appendStepsToChain(chain: HTMLElement, steps: string[]): void {
  let renderedSteps = 0;
  for (const stepStr of steps) {
    const vsParts = stepStr.split(/\s+\bvs\.?\b\s+/i).map(s => s.trim()).filter(Boolean);
    const chips: Array<{ chip: HTMLElement; isVs: boolean }> = [];
    for (const [vIdx, part] of vsParts.entries()) {
      const chip = renderKeyValOrTextChip(part);
      if (chip) chips.push({ chip, isVs: vIdx > 0 });
    }
    if (!chips.length) continue;
    if (renderedSteps > 0) {
      chain.append(el('span', 'ls-step-arrow', '→'));
    }
    for (const item of chips) {
      if (item.isVs) {
        chain.append(el('span', 'ls-step-arrow', 'vs'));
      }
      chain.append(item.chip);
    }
    renderedSteps++;
  }
}

/**
 * Renders 6 visually distinct display styles:
 * - `quote_callout`: Italic left-accented monologue box
 * - `pill_list`: Flex-wrapped accent badge chips
 * - `step_chain`: Compact horizontal pipeline strip (`[Step 1] → [Step 2] → [Step 3]`)
 * - `key_value`: 2-column aligned Key–Value ledger table
 * - `feed_cards`: Stacked bordered sub-cards with subject headers & step pills
 * - `auto`: Smart detection based on delimiters
 */
export function renderStructuredTextStatBody(
  rawText: string,
  displayStyle: StatDisplayStyle = 'auto',
): HTMLElement {
  const text = rawText.trim();
  if (!text) return el('span', 'ls-muted', '—');

  if (displayStyle === 'quote_callout') {
    return el('div', 'ls-thought-box', `“${stripOuterBrackets(text)}”`);
  }

  if (displayStyle === 'pill_list') {
    const row = el('div', 'ls-row');
    for (const item of text.split(/[,;\n]|->|→|⇒/).map(s => s.trim()).filter(Boolean)) {
      row.append(el('span', 'ls-chip ls-chip-accent', stripOuterBrackets(item)));
    }
    return row;
  }

  if (displayStyle === 'step_chain') {
    const chain = el('div', 'ls-step-chain ls-step-strip');
    const allSteps = text
      .split(/\r?\n|(?:\s*;\s*)|\s*(?:->|→|⇒)\s*/)
      .map(s => s.trim())
      .filter(Boolean);
    appendStepsToChain(chain, allSteps);
    return chain;
  }

  if (displayStyle === 'key_value') {
    const kvGrid = el('div', 'ls-kv-grid');
    const segments = text
      .split(/\r?\n|(?:\s*;\s*)|\s*(?:->|→|⇒)\s*|\s+\bvs\.?\b\s+/i)
      .map(s => s.replace(/^[-*•]\s+/, '').trim())
      .filter(Boolean);
    for (const [idx, seg] of segments.entries()) {
      const cleanSeg = stripOuterBrackets(seg);
      const kvMatch = cleanSeg.match(/^([^:]{1,45}):\s*([\s\S]+)$/);
      const row = el('div', 'ls-kv-row');
      if (kvMatch) {
        row.append(
          el('span', 'ls-kv-key', kvMatch[1]!.trim()),
          el('span', 'ls-kv-val', stripOuterBrackets(kvMatch[2]!)),
        );
      } else {
        row.append(
          el('span', 'ls-kv-key', `#${idx + 1}`),
          el('span', 'ls-kv-val', cleanSeg),
        );
      }
      kvGrid.append(row);
    }
    return kvGrid;
  }

  const hasStructure = /->|→|⇒|\bvs\.?\b|\n|;|\[[^\]]+\]/i.test(text);
  if (!hasStructure && displayStyle === 'auto') {
    const p = el('p', '', text);
    p.style.margin = '2px 0 0';
    return p;
  }

  // 1. `arc_tracker`: Multi-Thread / Quest / Arc Cards with auto-detected status & `0/4` progress clocks
  if (displayStyle === 'arc_tracker') {
    const rawItems = text
      .split(/\r?\n|(?=\[\s*t\d+\b)|(?:\s*;\s*)/i)
      .map(s => stripOuterBrackets(s.replace(/^[-*•]\s+/, '').trim()))
      .filter(Boolean);
    const list = el('div', 'ls-arc-list');

    for (const rawItem of rawItems) {
      const card = el('div', 'ls-arc-card');
      const parts = rawItem.split(/\s*\|\s*/).map(p => p.trim()).filter(Boolean);
      const firstPart = parts[0] ?? rawItem;

      // Extract optional progress clock `0/4`, `2/5`, etc.
      const clockMatch = rawItem.match(/\b(\d+)\s*\/\s*(\d+)\b/);
      const curProg = clockMatch ? Math.max(0, Number(clockMatch[1])) : null;
      const maxProg = clockMatch ? Math.max(1, Math.min(12, Number(clockMatch[2]))) : null;

      // Extract status keyword (`ACTIVE`, `DORMANT`, `PAYOFF`, `DONE`, `URGENT`, `RETIRE`, `ADVANCE`, `DROP`)
      const statusMatch = rawItem.match(
        /\b(ACTIVE|DORMANT|PAYOFF|COMPLETE(?:D)?|DONE|RETIRE(?:D)?|URGENT|FAIL(?:ED)?|ADVANCE|CONTINUE|SHIFT|DROP)\b/i,
      );
      const statusLabel = statusMatch ? statusMatch[1]!.toUpperCase() : '';

      // Clean title from `[t1 (Title | 0/4): Hook]` or `Title: Hook`
      let titleText = firstPart
        .replace(/^t\d+\s*/i, '')
        .replace(/\(\s*([^|)]+?)\s*(?:\|\s*\d+\s*\/\s*\d+\s*)?\)\s*:?/, '$1:')
        .trim();
      let summaryText = '';
      const colonIdx = titleText.indexOf(':');
      if (colonIdx > 0 && colonIdx < 48) {
        summaryText = titleText.slice(colonIdx + 1).trim();
        titleText = titleText.slice(0, colonIdx).trim();
      } else {
        titleText = titleText.replace(/\s*\|\s*\d+\s*\/\s*\d+/, '').trim();
      }

      const head = el('div', 'ls-row-between');
      head.append(el('strong', 'ls-arc-title', titleText || 'Active Thread'));
      const badges = el('div', 'ls-row');
      if (statusLabel) {
        const badge = el('span', 'ls-arc-status', statusLabel);
        badge.dataset.arcStatus = statusLabel.toLowerCase();
        badges.append(badge);
      }
      if (curProg !== null && maxProg !== null) {
        badges.append(el('span', 'ls-chip', `${curProg}/${maxProg}`));
      }
      head.append(badges);
      card.append(head);

      if (curProg !== null && maxProg !== null) {
        const clockBar = el('div', 'ls-clock-bar ls-arc-clock');
        clockBar.style.gridTemplateColumns = `repeat(${maxProg}, 1fr)`;
        for (let i = 1; i <= maxProg; i++) {
          clockBar.append(el('span', `ls-clock-seg${i <= curProg ? ' is-filled' : ''}`));
        }
        card.append(clockBar);
      }

      if (summaryText) {
        card.append(el('p', 'ls-arc-summary', summaryText));
      }

      for (const extraPart of parts.slice(1)) {
        if (/^\d+\s*\/\s*\d+$/.test(extraPart)) continue;
        const cleanExtra = stripOuterBrackets(extraPart);
        const kv = cleanExtra.match(/^([^:]{1,28}):\s*([\s\S]+)$/);
        if (kv) {
          const line = el('div', 'ls-arc-meta');
          line.append(
            el('span', 'ls-kv-key', `${kv[1]!.trim()}:`),
            el('span', 'ls-muted', kv[2]!.trim()),
          );
          card.append(line);
        } else {
          card.append(el('small', 'ls-muted', cleanExtra));
        }
      }
      list.append(card);
    }
    return list;
  }

  // 2. `accordion_cards`: Collapsible multi-entry cards (keeps dense feeds compact)
  if (displayStyle === 'accordion_cards') {
    const entries = parseStructuredStatText(text);
    const list = el('div', 'ls-feed-list');
    for (const [idx, entry] of entries.entries()) {
      const det = el('details', 'ls-stat-acc');
      if (idx === 0) det.open = true;
      const sum = el('summary', 'ls-stat-acc-head');
      const title = entry.subject || entry.steps[0] || `Entry ${idx + 1}`;
      const preview = entry.subject ? (entry.steps[0] ?? '') : (entry.steps[1] ?? '');
      sum.append(
        el('strong', '', title),
        ...(preview ? [el('small', 'ls-muted ls-stat-acc-preview', preview)] : []),
      );
      const body = el('div', 'ls-stat-acc-body');
      const chain = el('div', 'ls-step-chain');
      appendStepsToChain(chain, entry.steps);
      body.append(chain);
      det.append(sum, body);
      list.append(det);
    }
    return list;
  }

  // 3. `matrix_badges`: Side-by-side Versus / Split card (`Impulse vs Inhibition`, `Knows vs Blind to`)
  if (displayStyle === 'matrix_badges') {
    const rows = text
      .split(/\r?\n|(?:\s*;\s*)/)
      .map(s => stripOuterBrackets(s.replace(/^[-*•]\s+/, '').trim()))
      .filter(Boolean);
    const list = el('div', 'ls-feed-list');

    for (const row of rows) {
      const box = el('div', 'ls-matrix-card');
      const segs = row
        .split(/\s*(?:\bvs\.?\b|\||->|→|⇒)\s*/i)
        .map(s => stripOuterBrackets(s))
        .filter(Boolean);
      const grid = el('div', 'ls-matrix-cols');
      const mainCols = segs.slice(0, 2);
      const tailCols = segs.slice(2);

      for (const colText of mainCols) {
        const cell = el('div', 'ls-matrix-cell');
        const kv = colText.match(/^([^:]{1,28}):\s*([\s\S]+)$/);
        if (kv) {
          cell.append(el('span', 'ls-kv-key', kv[1]!.trim()), el('span', '', stripOuterBrackets(kv[2]!)));
        } else {
          cell.append(el('span', '', colText));
        }
        grid.append(cell);
      }
      box.append(grid);
      for (const tail of tailCols) {
        const footer = el('div', 'ls-matrix-footer');
        const kv = tail.match(/^([^:]{1,28}):\s*([\s\S]+)$/);
        if (kv) {
          footer.append(el('span', 'ls-kv-key', `${kv[1]!.trim()}: `), el('span', '', stripOuterBrackets(kv[2]!)));
        } else {
          footer.append(el('span', '', tail));
        }
        box.append(footer);
      }
      list.append(box);
    }
    return list;
  }

  // 4. `meter_mini_bars`: Multi-bar mini gauges from any `Label cur/max` pairs (e.g. `HP 190/190 | MP 180/180`)
  if (displayStyle === 'meter_mini_bars') {
    const pairs = [...text.matchAll(/\b([A-Za-z][A-Za-z0-9_ -]{0,18}?)\s*[:=]?\s*(-?\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\b/g)];
    if (pairs.length > 0) {
      const grid = el('div', 'ls-minibars-grid');
      for (const m of pairs) {
        const label = m[1]!.trim();
        const cur = Number(m[2]);
        const max = Math.max(1, Number(m[3]));
        const pct = Math.max(0, Math.min(100, Math.round((cur / max) * 100)));
        const cell = el('div', 'ls-minibar-cell');
        const head = el('div', 'ls-row-between');
        head.append(el('span', 'ls-kv-key', label), el('strong', '', `${cur}/${max}`));
        const track = el('div', 'ls-bar-track');
        const fill = el('div', 'ls-bar-fill');
        fill.style.width = `${pct}%`;
        if (/hp|health|vital|blood/i.test(label)) fill.style.background = '#f43f5e';
        else if (/mp|mana|ki|energy/i.test(label)) fill.style.background = '#38bdf8';
        track.append(fill);
        cell.append(head, track);
        grid.append(cell);
      }
      return grid;
    }
  }

  // 5. `stat_pills_grid`: Compact RPG stat badge tiles (`Lv0 (0%)`, `P46`, `A52`, `I80`, `POW 88`, `AGI 82`)
  if (displayStyle === 'stat_pills_grid') {
    const grid = el('div', 'ls-statpills-grid');
    const tokens = text
      .split(/\s*(?:\||,|;|\n)\s*/)
      .flatMap(chunk => {
        const sub = chunk.trim();
        if (!sub) return [];
        if (/^(?:[A-Za-z]{1,8}\d+\s+)+[A-Za-z]{1,8}\d+$/.test(sub)) {
          return sub.split(/\s+/);
        }
        return [sub];
      })
      .filter(Boolean);

    for (const tok of tokens) {
      const tile = el('div', 'ls-statpill-tile');
      const compactMatch = tok.match(/^([A-Za-z][A-Za-z0-9_]{0,12})\s*[:=]?\s*(-?\d+(?:\.\d+)?(?:\/\d+)?(?:\s*\([^)]+\))?)$/);
      if (compactMatch) {
        tile.append(
          el('span', 'ls-kv-key', compactMatch[1]!.trim()),
          el('strong', '', compactMatch[2]!.trim()),
        );
      } else {
        tile.append(el('strong', '', tok));
      }
      grid.append(tile);
    }
    return grid;
  }

  // 6. `bullet_ledger`: Clean aligned bullet & currency/value ledger (great for `cash_in_bank`, assets, clues)
  if (displayStyle === 'bullet_ledger') {
    const rows = text
      .split(/\r?\n|(?:\s*;\s*)|(?:\s+•\s+)/)
      .map(s => s.replace(/^[-*•]\s+/, '').trim())
      .filter(Boolean);
    const list = el('div', 'ls-ledger-list');
    for (const r of rows) {
      const row = el('div', 'ls-ledger-row');
      const amountMatch = r.match(/^(.+?)\s*:\s*([$€£¥]?\s*-?\d[\d,]*(?:\.\d+)?.*)$/);
      if (amountMatch) {
        row.append(
          el('span', '', amountMatch[1]!.trim()),
          el('span', 'ls-chip ls-chip-accent', amountMatch[2]!.trim()),
        );
      } else {
        row.append(el('span', '', r));
      }
      list.append(row);
    }
    return list;
  }

  // 7. `timeline_list`: Connected vertical event timeline
  if (displayStyle === 'timeline_list') {
    const rows = text
      .split(/\r?\n|(?:\s*;\s*)|\s*(?:->|→|⇒)\s*/)
      .map(s => stripOuterBrackets(s.replace(/^[-*•]\s+/, '').trim()))
      .filter(Boolean);
    const list = el('div', 'ls-timeline-list');
    for (const r of rows) {
      const item = el('div', 'ls-timeline-item');
      item.append(el('span', 'ls-timeline-dot'), el('span', '', r));
      list.append(item);
    }
    return list;
  }

  // 8. `checklist`: Objectives & task list
  if (displayStyle === 'checklist') {
    const rows = text
      .split(/\r?\n|(?:\s*;\s*)/)
      .map(s => s.replace(/^[-*•]\s+/, '').trim())
      .filter(Boolean);
    const list = el('div', 'ls-checklist');
    for (const r of rows) {
      const isDone = /^(?:\[x\]|✓|✔|done:|completed:)/i.test(r);
      const clean = r.replace(/^(?:\[[ xX]\]|✓|✔|○)\s*/, '').trim();
      const row = el('div', 'ls-checklist-row');
      row.dataset.done = String(isDone);
      row.append(
        el('span', 'ls-checklist-box', isDone ? '✓' : ''),
        el('span', isDone ? 'ls-muted' : '', clean),
      );
      list.append(row);
    }
    return list;
  }

  // `feed_cards` (or `auto` when structured delimiters are present)
  const entries = parseStructuredStatText(text);
  const list = el('div', 'ls-feed-list');
  for (const entry of entries) {
    const card = el('div', 'ls-feed-card');
    if (entry.subject) {
      card.append(el('div', 'ls-feed-subject', `👤 ${entry.subject}`));
    }
    const chain = el('div', 'ls-step-chain');
    appendStepsToChain(chain, entry.steps);
    card.append(chain);
    list.append(card);
  }
  return list;
}

export function interpolateBannerTemplate(rawHtml: string, state: CampaignState): string {
  const escMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  const esc = (s: string) => s.replace(/[&<>"']/g, ch => escMap[ch]!);
  const banner = formatSceneBanner(state);
  const firstPresent = Object.values(state.characters).find(c => c.present) ?? Object.values(state.characters)[0];

  const tokens: Record<string, string> = {
    title: esc(state.title),
    location: esc(banner.location),
    time: esc(banner.time),
    date: esc(banner.date),
    weather: esc(banner.weather),
    header: esc(banner.formatted),
    player_attire: esc(state.player.attire),
    name: esc(firstPresent?.name ?? ''),
    role: esc(firstPresent?.roleSummary ?? ''),
    demeanor: esc(firstPresent?.demeanor ?? ''),
    attire: esc(firstPresent?.attire ?? ''),
  };

  return rawHtml.replace(/\{\{\s*([\w:.-]+)\s*\}\}/g, (_m, key: string) => {
    if (key.startsWith('stat:')) {
      const id = key.slice(5);
      const val = state.stats[id]?.value ?? firstPresent?.meters[id]?.value;
      return val !== undefined ? esc(String(val)) : '—';
    }
    return tokens[key] ?? '';
  });
}

export function openSceneBannerModal(ctrl: LumiFrontendController): void {
  const { state } = ctrl.snapshot;
  const banner = formatSceneBanner(state);

  ctrl.modals.open({ title: '✏️ Edit Scene Banner & Player Presentation', width: 540 }, (body, close) => {
    const makeField = (label: string, val: string, placeholder: string) => {
      const wrap = el('label', 'ls-label', label);
      const inp = el('input', 'ls-input');
      inp.value = val;
      inp.placeholder = placeholder;
      wrap.append(inp);
      body.append(wrap);
      return inp;
    };

    const locInp = makeField('📍 Location & Region', state.scene.location || banner.location, 'e.g. Master Suite, Estate');
    const timeInp = makeField('🕰️ Time', state.scene.timeLabel || banner.time, 'e.g. 08:30 PM');
    const dateInp = makeField('📅 Date / Era', state.scene.dateLabel || banner.date, 'e.g. Day 1 · Evening');
    const weatherInp = makeField('🌦️ Weather & Atmosphere', state.scene.weather || banner.weather, 'e.g. Warm Indoor Steam');
    const attireInp = makeField('👕 Your Current Attire / Presentation', state.player.attire, 'e.g. Wearing only a towel after a bath');

    const sumWrap = el('label', 'ls-label', 'Scene Beat Summary');
    const sumInp = el('textarea', 'ls-input');
    sumInp.rows = 2;
    sumInp.value = state.scene.beatSummary || '';
    sumWrap.append(sumInp);
    body.append(sumWrap);

    const actions = el('div', 'ls-row-between');
    const skips = el('div', 'ls-row');
    skips.append(
      btn('⚙️ Pill Prompts', () => {
        close();
        openScenePillEditorModal(ctrl);
      }, 'ls-btn-sm'),
    );
    for (const [lbl, mins] of [['+15m', 15], ['+1h', 60], ['+1d', 1440]] as const) {
      skips.append(
        btn(lbl, () => {
          void ctrl.request('state:mutate', {
            patch: { scene: { elapsedMinutes: mins } },
            reason: `Advanced clock ${lbl}`,
          });
          close();
        }, 'ls-btn-sm'),
      );
    }

    const saveBtn = btn('💾 Save Scene', () => {
      void ctrl.request('state:mutate', {
        patch: {
          scene: {
            location: locInp.value.trim(),
            timeLabel: timeInp.value.trim(),
            dateLabel: dateInp.value.trim(),
            weather: weatherInp.value.trim(),
            beatSummary: sumInp.value.trim(),
          },
          player: {
            attire: attireInp.value.trim(),
          },
        },
        reason: 'Updated scene & player presentation',
      });
      close();
    }, 'ls-btn-primary');

    actions.append(skips, saveBtn);
    body.append(actions);
  });
}

export function openSandboxTesterModal(
  ctrl: LumiFrontendController,
  statId?: string,
): void {
  ctrl.modals.open(
    { title: '🧪 Two-Phase Stat Calibration & Reactivity Sandbox', width: 660, maxHeight: 760 },
    (body, close) => {
      const scenWrap = el('label', 'ls-label', 'Test Scenario / Turn Input (or leave blank to auto-generate)');
      const scenInp = el('textarea', 'ls-input');
      scenInp.rows = 2;
      scenInp.placeholder = 'e.g. "My loyal maid greets me as I step out of the bath wearing only a towel."';
      scenWrap.append(scenInp);

      const resultBox = el('div', 'ls-stack');
      const runTest = () => {
        resultBox.replaceChildren(el('p', 'ls-muted', '⏳ Evaluating scenario against two-phase calibration rules…'));
        void ctrl
          .request('sandbox:test', {
            statId,
            scenarioText: scenInp.value.trim() || undefined,
          })
          .then(res => {
            resultBox.replaceChildren();
            const beatCard = el('div', 'ls-card');
            beatCard.append(
              el('span', 'ls-kicker', '📖 Evaluated Beat'),
              el('p', '', String(res.testBeat ?? '')),
            );
            resultBox.append(beatCard);

            const entries = Array.isArray(res.auditEntries)
              ? (res.auditEntries as Array<Record<string, unknown>>)
              : [];
            if (!entries.length) {
              resultBox.append(el('p', 'ls-muted', 'No stats shifted for this scenario.'));
            } else {
              for (const entry of entries) {
                const row = el('div', 'ls-stat-cell');
                const top = el('div', 'ls-row-between');
                top.append(
                  el('strong', '', `${String(entry.statLabel)} (${String(entry.op)})`),
                  el('span', 'ls-chip ls-chip-accent', `${String(entry.before ?? 'uncalibrated')} → ${String(entry.after)}`),
                );
                row.append(top, el('small', 'ls-muted', String(entry.reason ?? '')));
                resultBox.append(row);
              }
            }
          })
          .catch(err => {
            resultBox.replaceChildren(el('p', 'ls-muted', err instanceof Error ? err.message : String(err)));
          });
      };

      const topBtns = el('div', 'ls-row-between');
      topBtns.append(
        btn('▶ Run Sandbox Evaluation', runTest, 'ls-btn-primary'),
        btn('Close', close, 'ls-btn-sm'),
      );
      body.append(scenWrap, topBtns, resultBox);
      runTest();
    },
  );
}

/**
 * Opens a modal to duplicate/copy an existing stat into another Scope (e.g. Player -> Character)
 * or another Widget/Inline/Dossier Tab with 1 click.
 */
export function openDuplicateStatModal(
  ctrl: LumiFrontendController,
  source: StatSchemaDef,
): void {
  const tpl = structuredClone(ctrl.snapshot.template);
  let targetScope: StatScope = source.scope === 'player' ? 'character' : 'player';
  let targetWTab = (targetScope as string) === 'character' ? 'cast' : (targetScope as string) === 'world' ? 'world' : 'stats';
  let targetITab = (targetScope as string) === 'character' ? 'cast' : (targetScope as string) === 'world' ? 'world' : 'stats';
  let targetDTab = source.dossierTabId || 'bonds';

  ctrl.modals.open(
    {
      title: `📋 Duplicate Stat: ${source.icon} ${source.label}`,
      width: 540,
    },
    (body, close, _handle, modalScope) => {
      body.append(
        el(
          'p',
          'ls-muted',
          `Copy "${source.label}" (including its style, color, range, anchors, and AI rules) into another scope or tab.`,
        ),
      );

      const labelWrap = el('label', 'ls-label', 'New Stat Label (Can keep the same label for a different scope)');
      const labelInp = el('input', 'ls-input');
      labelInp.value = source.label;
      labelWrap.append(labelInp);

      const scopeWrap = el('div', 'ls-label', 'Target Owner Scope');
      const scopeSlot = el('div');
      scopeWrap.append(scopeSlot);

      const tabsGrid = el('div', 'ls-grid');
      const wWrap = el('div', 'ls-label', '🪟 Target Widget Tab');
      const wSlot = el('div');
      wWrap.append(wSlot);

      const iWrap = el('div', 'ls-label', '💬 Target Inline Tab');
      const iSlot = el('div');
      iWrap.append(iSlot);

      const dWrap = el('div', 'ls-label', '🪪 Target Dossier Tab');
      const dSlot = el('div');
      dWrap.append(dSlot);
      tabsGrid.append(wWrap, iWrap, dWrap);

      const wCtrl = mountThemedSelect(ctrl, modalScope, wSlot, {
        value: targetWTab,
        ariaLabel: 'Target Widget Tab',
        options: tpl.surfaces.widgetTabs.map(t => ({ value: t.id, label: `${t.icon} ${t.label}` })),
        onChange: v => {
          targetWTab = v;
        },
      });

      const iCtrl = mountThemedSelect(ctrl, modalScope, iSlot, {
        value: targetITab,
        ariaLabel: 'Target Inline Tab',
        options: tpl.surfaces.inlineTabs.map(t => ({ value: t.id, label: `${t.icon} ${t.label}` })),
        onChange: v => {
          targetITab = v;
        },
      });

      mountThemedSelect(ctrl, modalScope, dSlot, {
        value: targetDTab,
        ariaLabel: 'Target Dossier Tab',
        options: tpl.surfaces.dossierTabs.map(t => ({ value: t.id, label: `${t.icon} ${t.label}` })),
        onChange: v => {
          targetDTab = v;
        },
      });

      mountThemedSelect(ctrl, modalScope, scopeSlot, {
        value: targetScope,
        ariaLabel: 'Target Owner Scope',
        options: [
          { value: 'character', label: '👥 Character Meter (Per-NPC in Cast & Dossier)' },
          { value: 'player', label: '👤 Player Stat' },
          { value: 'world', label: '🌍 World State Stat / Clock' },
          { value: 'scene', label: '🎭 Scene / Thread Stat' },
        ],
        onChange: v => {
          targetScope = v as StatScope;
          const defTab = targetScope === 'character' ? 'cast' : targetScope === 'world' ? 'world' : 'stats';
          targetWTab = defTab;
          targetITab = defTab;
          wCtrl.setValue(defTab);
          iCtrl.setValue(defTab);
        },
      });

      const dupBtn = btn('📋 Create Duplicate Stat', () => {
        const nextLabel = labelInp.value.trim() || source.label;
        const baseSlug = slugifyKey(nextLabel, 'stat');
        const scopePrefix = targetScope === 'character' ? 'char' : targetScope;
        let candidateId = tpl.stats.some(s => s.id === baseSlug)
          ? `${scopePrefix}_${baseSlug}`
          : baseSlug;
        if (tpl.stats.some(s => s.id === candidateId)) {
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
            dossier: targetScope === 'character',
            pinnedHeader: false,
          },
        });

        tpl.stats.push(cloned);
        void ctrl.request('state:mutate', {
          templatePatch: { stats: tpl.stats },
          reason: `Duplicated "${source.label}" to ${targetScope} (${targetWTab})`,
        });
        ctrl.notify(`Duplicated "${cloned.icon} ${cloned.label}" to ${targetScope}!`);
        close();
      }, 'ls-btn-primary');
      dupBtn.style.marginTop = '10px';

      body.append(labelWrap, scopeWrap, tabsGrid, dupBtn);
    },
  );
}

/**
 * Opens the Zero-Hardcoding Stat Schema Editor Modal, including Visual Display Style,
 * Grid Width Span, Surface Visibility (`showIn`), and Target Tab routing.
 */
export function openStatSchemaModal(
  ctrl: LumiFrontendController,
  defaultScope: StatScope = 'character',
  existing?: StatSchemaDef,
): void {
  const tpl = structuredClone(ctrl.snapshot.template);

  ctrl.modals.open(
    {
      title: existing ? `Edit Stat: ${existing.icon} ${existing.label}` : 'Create Stat or Character Meter',
      width: 660,
      maxHeight: 820,
    },
    (body, close, _handle, modalScope) => {
      let selectedScope: StatScope = existing?.scope ?? defaultScope;
      let selectedCategoryId: string = existing?.categoryId ?? '';
      let selectedKind: StatValueKind = existing?.kind ?? 'meter';
      let selectedVol: StatVolatility =
        existing?.volatility ?? (defaultScope === 'character' ? 'progressive' : 'momentary');
      let selectedStyle: StatDisplayStyle = existing?.displayStyle ?? 'auto';
      let selectedSpan: StatLayoutSpan = existing?.layoutSpan ?? 'auto';
      let selectedColor = existing?.color || 'var(--lumiverse-primary)';
      let selectedWTab =
        existing?.widgetTabId ?? (defaultScope === 'world' ? 'world' : defaultScope === 'character' ? 'cast' : 'stats');
      let selectedITab =
        existing?.inlineTabId ?? (defaultScope === 'world' ? 'world' : defaultScope === 'character' ? 'cast' : 'stats');
      let selectedDTab = existing?.dossierTabId ?? 'bonds';
      let showWidget = existing?.showIn?.widget ?? true;
      let showInline = existing?.showIn?.inline ?? true;
      let showDossier = existing
        ? (existing.scope === 'character' ? (existing.showIn?.dossier ?? true) : false)
        : selectedScope === 'character';
      let pinnedToHeader = existing?.pinnedToHeader ?? false;
      let locked = existing?.locked ?? false;

      // ── Section 1: Basics & Format ──
      const basicsHost = el('div');
      body.append(basicsHost);
      const basicsBody = mountNativeCollapsible(ctrl, modalScope, basicsHost, {
        title: '1. Basics & Value Format',
        iconName: 'stats',
        defaultExpanded: true,
      });

      const topGrid = el('div', 'ls-grid');
      const iconWrap = el('label', 'ls-label', 'Icon');
      const iconInp = el('input', 'ls-input');
      iconInp.value = existing?.icon ?? (defaultScope === 'character' ? '💖' : '📊');
      iconWrap.append(iconInp);

      const labelWrap = el('label', 'ls-label', 'Stat Name');
      const labelInp = el('input', 'ls-input');
      labelInp.placeholder = 'e.g. Loyalty, Offscreen NPCs, Threat Clock…';
      labelInp.value = existing?.label ?? '';
      labelWrap.append(labelInp);

      const catWrap = el('div', 'ls-label', 'Category / Group (Optional)');
      const catSlot = el('div');
      catWrap.append(catSlot);
      mountThemedSelect(ctrl, modalScope, catSlot, {
        value: selectedCategoryId,
        ariaLabel: 'Category / Group',
        options: [
          { value: '', label: 'None (Uncategorized)' },
          ...(tpl.categories ?? []).map(c => ({
            value: c.id,
            label: `${c.icon} ${c.name}`,
          })),
        ],
        onChange: v => {
          selectedCategoryId = v;
        },
      });

      topGrid.append(iconWrap, labelWrap, catWrap);
      basicsBody.append(topGrid);

      const metaGrid = el('div', 'ls-grid');
      const scopeWrap = el('div', 'ls-label', 'Owner Scope');
      const scopeSlot = el('div');
      scopeWrap.append(scopeSlot);

      const kindWrap = el('div', 'ls-label', 'Value Format');
      const kindSlot = el('div');
      kindWrap.append(kindSlot);

      const volWrap = el('div', 'ls-label', 'Reactivity Profile');
      const volSlot = el('div');
      volWrap.append(volSlot);

      metaGrid.append(scopeWrap, kindWrap, volWrap);
      basicsBody.append(metaGrid);

      const rangeGrid = el('div', 'ls-grid');
      const minWrap = el('label', 'ls-label', 'Minimum');
      const minInp = el('input', 'ls-input');
      minInp.type = 'number';
      minInp.value = String(existing?.min ?? 0);
      minWrap.append(minInp);

      const maxWrap = el('label', 'ls-label', 'Maximum / Segments');
      const maxInp = el('input', 'ls-input');
      maxInp.type = 'number';
      maxInp.value = String(existing?.max ?? 100);
      maxWrap.append(maxInp);

      const defWrap = el('label', 'ls-label', 'Starting / Fallback Value');
      const defInp = el('input', 'ls-input');
      defInp.value = String(existing?.defaultValue ?? 0);
      defWrap.append(defInp);
      rangeGrid.append(minWrap, maxWrap, defWrap);
      basicsBody.append(rangeGrid);

      const syncRangeVisibility = () => {
        const isNumeric =
          ['meter', 'clock', 'pips', 'number', 'hearts', 'currency', 'attributes'].includes(selectedKind) &&
          selectedStyle === 'auto';
        rangeGrid.style.display = isNumeric ? '' : 'none';
      };
      syncRangeVisibility();

      // ── Section 2: Display Style, Color & Tab Routing ──
      const displayHost = el('div');
      body.append(displayHost);
      const displayBody = mountNativeCollapsible(ctrl, modalScope, displayHost, {
        title: '2. Appearance, Visibility & Tabs',
        iconName: 'palette',
        defaultExpanded: false,
      });

      const styleGrid = el('div', 'ls-grid');
      const styleWrap = el('div', 'ls-label', 'Visual Display Style');
      const styleSlot = el('div');
      styleWrap.append(styleSlot);

      const spanWrap = el('div', 'ls-label', 'Card Grid Width');
      const spanSlot = el('div');
      spanWrap.append(spanSlot);
      styleGrid.append(styleWrap, spanWrap);
      displayBody.append(styleGrid);

      const colorWrap = el('div', 'ls-label', 'Accent & Bar Color');
      const colorRow = el('div', 'ls-row');
      const colorSwatches: Array<{ value: string; label: string; preview: string }> = [
        { value: 'var(--lumiverse-primary)', label: 'Theme Primary', preview: 'var(--lumiverse-primary, #38bdf8)' },
        { value: '#38bdf8', label: 'Sky Cyan', preview: '#38bdf8' },
        { value: '#f472b6', label: 'Rose Pink', preview: '#f472b6' },
        { value: '#f59e0b', label: 'Amber Gold', preview: '#f59e0b' },
        { value: '#10b981', label: 'Emerald', preview: '#10b981' },
        { value: '#a78bfa', label: 'Royal Violet', preview: '#a78bfa' },
        { value: '#f43f5e', label: 'Crimson', preview: '#f43f5e' },
      ];
      const syncColorSwatches = () => {
        for (const child of [...colorRow.querySelectorAll<HTMLButtonElement>('.ls-color-swatch')]) {
          child.setAttribute('aria-pressed', String(child.dataset.colorVal === selectedColor));
        }
      };
      for (const sw of colorSwatches) {
        const b = btn('', () => {
          selectedColor = sw.value;
          syncColorSwatches();
        }, 'ls-color-swatch', sw.label);
        b.dataset.colorVal = sw.value;
        b.style.background = sw.preview;
        colorRow.append(b);
      }
      const customColorInp = el('input');
      customColorInp.type = 'color';
      customColorInp.title = 'Custom color';
      customColorInp.style.cssText = 'width:26px;height:22px;border:0;padding:0;background:transparent;cursor:pointer;';
      if (selectedColor.startsWith('#') && selectedColor.length === 7) {
        customColorInp.value = selectedColor;
      }
      customColorInp.addEventListener('input', () => {
        selectedColor = customColorInp.value;
        syncColorSwatches();
      });
      colorRow.append(customColorInp);
      syncColorSwatches();
      colorWrap.append(colorRow);
      displayBody.append(colorWrap);

      const routingGrid = el('div', 'ls-grid');
      const wTabWrap = el('div', 'ls-label', 'Floating Widget Tab');
      const wTabSlot = el('div');
      wTabWrap.append(wTabSlot);
      const iTabWrap = el('div', 'ls-label', 'Inline Ribbon Tab');
      const iTabSlot = el('div');
      iTabWrap.append(iTabSlot);
      const dTabWrap = el('div', 'ls-label', 'Character Dossier Tab');
      const dTabSlot = el('div');
      dTabWrap.append(dTabSlot);
      routingGrid.append(wTabWrap, iTabWrap, dTabWrap);
      displayBody.append(routingGrid);

      const flagsGrid = el('div', 'ls-grid');
      let dossierCheckboxSlot: HTMLElement | undefined;
      for (const [lbl, initVal, setter] of [
        ['Show in Widget', showWidget, (v: boolean) => { showWidget = v; }],
        ['Show in Inline Ribbon', showInline, (v: boolean) => { showInline = v; }],
        ['Show in Dossier', showDossier, (v: boolean) => { showDossier = v; }],
        ['Pin to Header / Pill', pinnedToHeader, (v: boolean) => { pinnedToHeader = v; }],
        ['Lock Value', locked, (v: boolean) => { locked = v; }],
      ] as const) {
        const slot = el('div');
        if (lbl === 'Show in Dossier') dossierCheckboxSlot = slot;
        mountNativeCheckbox(ctrl, modalScope, slot, {
          checked: initVal,
          label: lbl,
          onChange: setter,
        });
        flagsGrid.append(slot);
      }
      displayBody.append(flagsGrid);

      const extraWTabs = new Set<string>(existing?.extraWidgetTabIds ?? []);
      const extraWrap = el('div', 'ls-label', 'Also Mirror in Additional Widget Tabs (Optional)');
      const extraRow = el('div', 'ls-row');
      for (const wt of tpl.surfaces.widgetTabs) {
        const slot = el('div');
        mountNativeCheckbox(ctrl, modalScope, slot, {
          checked: extraWTabs.has(wt.id),
          label: `${wt.icon} ${wt.label}`,
          onChange: on => {
            if (on) extraWTabs.add(wt.id);
            else extraWTabs.delete(wt.id);
          },
        });
        extraRow.append(slot);
      }
      extraWrap.append(extraRow);
      displayBody.append(extraWrap);

      // ── Section 3: Calculation Mode (AI / Hybrid / Pure Local) & Prompt Diet ──
      let calcMode: 'ai' | 'ai_plus_local' | 'local_formula' =
        existing?.calculationMode === 'ai_plus_local' || existing?.calculationMode === 'local_formula'
          ? existing.calculationMode
          : Boolean(existing?.formula?.trim()) && existing?.calculationMode !== 'ai'
            ? 'local_formula'
            : 'ai';
      let promptTriggerMode: 'always' | 'conditional' | 'manual' =
        existing?.promptTriggerMode ?? 'always';
      let injectInContinuity = existing?.injectInContinuity !== false;

      const aiHost = el('div');
      body.append(aiHost);
      const aiBody = mountNativeCollapsible(ctrl, modalScope, aiHost, {
        title: '3. Calculation Mode, Formula & Token Diet',
        iconName: 'sparkles',
        badge:
          calcMode === 'local_formula'
            ? 'Pure Local'
            : calcMode === 'ai_plus_local'
              ? 'AI + Local'
              : 'AI',
        defaultExpanded: true,
      });

      const modeToggleWrap = el('div', 'ls-stat-cell');
      modeToggleWrap.append(
        el('strong', '', 'Calculation Mode'),
        el('small', 'ls-muted', 'Use "AI + Local Math" when the AI must set starting values/deltas (e.g. Level & Stats, Vitals). Use "Pure Local" (0 tokens) when computed strictly from other stats (e.g. Eff POW/AGI).'),
      );
      const modeBtnRow = el('div', 'ls-row');
      modeToggleWrap.append(modeBtnRow);
      aiBody.append(modeToggleWrap);

      const trigWrap = el('div', 'ls-label', 'Prompt Frequency (When AI-Tracked)');
      const trigSlot = el('div');
      trigWrap.append(trigSlot);
      aiBody.append(trigWrap);

      const contSlot = el('div');
      mountNativeCheckbox(ctrl, modalScope, contSlot, {
        checked: injectInContinuity,
        label: 'Include this stat in Story Continuity Prompt (turn off for UI-only scratchpads)',
        onChange: on => {
          injectInContinuity = on;
        },
      });
      aiBody.append(contSlot);

      const kwWrap = el('label', 'ls-label', 'Trigger Keywords (comma-separated — only sends rule when seen in recent chat)');
      const kwInp = el('input', 'ls-input');
      kwInp.placeholder = 'e.g. cash, money, bank, rent, pay, buy, wallet';
      kwInp.value = (existing?.promptKeywords ?? []).join(', ');
      kwWrap.append(kwInp);
      aiBody.append(kwWrap);

      // Local Formula Workspace + Live Verification Status
      const formulaBox = el('div', 'ls-stack');
      const formulaArea = el('textarea', 'ls-input');
      formulaArea.rows = 4;
      formulaArea.placeholder =
        'Write math using your stat IDs or auto-extracted tokens (e.g. round((40 + P + Lv * 2) * wound))\nSupports: + - * / %, round(), floor(), ceil(), min(), max(), clamp(), if(), hasCond("...")';
      formulaArea.value = existing?.formula ?? '';

      const outTplWrap = el('label', 'ls-label', 'Output Format Template (optional, e.g. POW {pow} | AGI {agi})');
      const outTplInp = el('input', 'ls-input');
      outTplInp.placeholder = 'Leave blank for plain number, or e.g. POW {pow} | AGI {agi}';
      outTplInp.value = existing?.formulaOutputTemplate ?? '';
      outTplWrap.append(outTplInp);

      const statusBox = el('div', 'ls-formula-status');
      const statusMain = el('strong', '');
      const statusTokens = el('small', 'ls-muted');
      statusBox.append(statusMain, statusTokens);

      const cueWrap = el('div', 'ls-label');
      const cueHeader = el('div', 'ls-row-between');
      const cueArea = el('textarea', 'ls-input');
      cueArea.rows = 3;
      cueArea.value = existing?.triggerCues ?? '';
      cueArea.placeholder = 'Write your rule in plain English (used by AI, or click "Convert My Rule to Formula" when Local Toggle is ON)…';

      const dynamicVarsRow = el('div', 'ls-row');
      const statusActionRow = el('div', 'ls-row');
      statusBox.append(statusActionRow);

      const insertTokenAtCursor = (tokenStr: string) => {
        const start = formulaArea.selectionStart ?? formulaArea.value.length;
        const end = formulaArea.selectionEnd ?? formulaArea.value.length;
        formulaArea.value =
          formulaArea.value.slice(0, start) + tokenStr + formulaArea.value.slice(end);
        formulaArea.focus();
        formulaArea.setSelectionRange(start + tokenStr.length, start + tokenStr.length);
        updateFormulaPreview();
      };

      let isConvertingRule = false;
      let lastTestedStamp = '';

      const runConvertRule = (sourceRuleText: string, triggerBtn?: HTMLButtonElement) => {
        if (isConvertingRule) return;
        const cleanRule = sourceRuleText.trim();
        if (!cleanRule) {
          if (calcMode === 'ai') calcMode = 'local_formula';
          syncCalcVisibility();
          statusBox.dataset.status = 'warn';
          statusMain.textContent = '⚠ Write your plain-English rule in the box below first, then click Convert.';
          cueArea.focus();
          return;
        }
        if (!cueArea.value.trim()) cueArea.value = cleanRule;

        isConvertingRule = true;
        const prevLabel = triggerBtn?.textContent ?? '';
        if (triggerBtn) {
          triggerBtn.disabled = true;
          triggerBtn.textContent = '⏳ Converting…';
        }
        if (calcMode === 'ai') calcMode = 'local_formula';
        syncCalcVisibility();
        statusBox.dataset.status = 'warn';
        statusMain.textContent = '⏳ Converting your rule to a universal local formula…';
        statusActionRow.replaceChildren();

        void ctrl
          .request('formula:compile', {
            statLabel: labelInp.value.trim() || 'Stat',
            ruleText: cleanRule,
            scope: selectedScope,
          })
          .then(res => {
            const nextFormula = typeof res.formula === 'string' ? res.formula.trim() : '';
            if (!nextFormula) {
              statusBox.dataset.status = 'error';
              statusMain.textContent = '✖ AI returned an empty formula. Check your LLM connection in Studio → 6. AI & Connections.';
              return;
            }
            formulaArea.value = nextFormula;
            if (typeof res.outputTemplate === 'string') {
              outTplInp.value = res.outputTemplate;
            }
            if (res.suggestedMode === 'ai_plus_local' || res.suggestedMode === 'local_formula') {
              calcMode = res.suggestedMode;
            }
            lastTestedStamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            syncCalcVisibility();
            if (res.explanation) {
              statusTokens.textContent = `✓ ${String(res.explanation)} · ${statusTokens.textContent}`;
            }
          })
          .catch(err => {
            statusBox.dataset.status = 'error';
            statusMain.textContent = `✖ Convert Failed: ${err instanceof Error ? err.message : String(err)}`;
          })
          .finally(() => {
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
          id: existing?.id || slugifyKey(labelInp.value || 'preview', 'preview'),
          label: labelInp.value || 'Preview',
          scope: selectedScope,
          kind: selectedKind,
          calculationMode: 'local_formula',
          formula: formulaArea.value,
          formulaOutputTemplate: outTplInp.value,
        });
        const res = previewStatFormula(draftSchema, ctrl.snapshot.state, tpl.stats, ctrl.selectedActorId);

        dynamicVarsRow.replaceChildren(el('small', 'ls-muted', 'Insert Variable:'));
        const dynamicKeys = [
          ...Object.keys(res.availableTokens).slice(0, 12),
          ...(res.availableStringVars.conditions !== undefined ? ['conditions'] : []),
        ];
        for (const key of dynamicKeys) {
          const valPreview =
            res.availableTokens[key] !== undefined
              ? String(res.availableTokens[key])
              : (res.availableStringVars[key] || '""');
          dynamicVarsRow.append(
            btn(
              `${key} (${valPreview.slice(0, 16)})`,
              () => insertTokenAtCursor(formulaArea.value.includes('{{') ? `{{.${key}}}` : key),
              'ls-btn-sm ls-quick-pill',
              `Click to insert ${key}`,
            ),
          );
        }

        const tokenEntries = Object.entries(res.availableTokens)
          .slice(0, 14)
          .map(([k, v]) => `${k}=${v}`)
          .join(', ');
        statusTokens.textContent = tokenEntries
          ? `Detected on ${res.targetName}: ${tokenEntries}`
          : `No numeric tokens detected yet on ${res.targetName}.`;

        statusActionRow.replaceChildren();

        if (!formulaArea.value.trim()) {
          statusBox.dataset.status = 'warn';
          statusMain.textContent = cueArea.value.trim()
            ? '⚠ Formula box is empty. Click below to convert your plain-English rule automatically, or type math / {{calc::...}} macros.'
            : '⚠ Enter math lines, Lumiverse {{calc::...}} / {{if::...}} macros, or write a rule below and click Convert.';
          if (cueArea.value.trim()) {
            const convBtn = btn(
              '⚡ Convert My Rule to Local Formula',
              () => runConvertRule(cueArea.value, convBtn),
              'ls-btn-sm ls-btn-primary',
            );
            statusActionRow.append(convBtn);
          }
        } else if (res.isProse) {
          statusBox.dataset.status = 'warn';
          statusMain.textContent = '⚠ Plain-English text detected — this box runs math/macro syntax. Click below to convert it automatically:';
          const convBtn = btn(
            '⚡ Convert This Text to Formula',
            () => runConvertRule(formulaArea.value, convBtn),
            'ls-btn-sm ls-btn-primary',
          );
          statusActionRow.append(convBtn);
        } else if (res.error) {
          statusBox.dataset.status = 'error';
          statusMain.textContent = `✖ Formula Error: ${res.error}`;
        } else if (res.output !== undefined) {
          const assignedKeys = Object.keys(res.locals).filter(k => k !== 'value' && k !== 'result');
          const looksLikeMissingTemplate =
            assignedKeys.length >= 2 &&
            !outTplInp.value.trim() &&
            !formulaArea.value.includes('{{');
          if (looksLikeMissingTemplate) {
            statusBox.dataset.status = 'warn';
            statusMain.textContent = `⚠ Result is just "${String(res.output)}" because Output Format Template is blank. Add e.g. {${assignedKeys.join('} {')}} above!`;
          } else {
            statusBox.dataset.status = 'ok';
            const stampSuffix = lastTestedStamp ? ` (Tested ${lastTestedStamp})` : '';
            statusMain.textContent = `✓ Working on ${res.targetName} → Result: ${String(res.output)}${stampSuffix}`;
          }
        } else if (res.missingRefs.length > 0) {
          statusBox.dataset.status = 'warn';
          statusMain.textContent = `⚠ Waiting for variables: ${res.missingRefs.join(', ')}`;
        } else {
          statusBox.dataset.status = 'warn';
          statusMain.textContent = '⚠ Formula evaluated empty — check placeholder names or macro tags.';
        }
      };
      formulaArea.addEventListener('input', () => {
        lastTestedStamp = '';
        updateFormulaPreview();
      });
      outTplInp.addEventListener('input', () => {
        lastTestedStamp = '';
        updateFormulaPreview();
      });

      const formulaHead = el('div', 'ls-row-between');
      formulaHead.append(
        el('strong', '', 'Local Formula or Lumiverse Macros ({{calc}}, {{if}}, {{round}}, {{matches}})'),
        btn(
          '▶ Run Live Test',
          () => {
            lastTestedStamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            updateFormulaPreview();
          },
          'ls-btn-sm',
        ),
      );

      formulaBox.append(
        formulaHead,
        dynamicVarsRow,
        formulaArea,
        outTplWrap,
        statusBox,
      );
      aiBody.append(formulaBox);

      const modeButtons: Array<{ id: 'ai' | 'ai_plus_local' | 'local_formula'; el: HTMLButtonElement }> = [];
      const syncCalcVisibility = () => {
        for (const item of modeButtons) {
          item.el.setAttribute('aria-current', item.id === calcMode ? 'page' : 'false');
        }
        const usesFormula = calcMode === 'local_formula' || calcMode === 'ai_plus_local';
        const usesPrompt = calcMode === 'ai' || calcMode === 'ai_plus_local';
        formulaBox.style.display = usesFormula ? '' : 'none';
        trigWrap.style.display = usesPrompt ? '' : 'none';
        kwWrap.style.display = usesPrompt && promptTriggerMode === 'conditional' ? '' : 'none';
        if (usesFormula) updateFormulaPreview();
      };

      for (const [mId, mLbl] of [
        ['ai', '🤖 AI Only'],
        ['ai_plus_local', '🔀 AI + Local Math'],
        ['local_formula', '⚡ Pure Local (0 tokens)'],
      ] as const) {
        const b = btn(
          mLbl,
          () => {
            calcMode = mId;
            syncCalcVisibility();
          },
          'ls-btn-sm',
        );
        modeButtons.push({ id: mId, el: b });
        modeBtnRow.append(b);
      }

      mountThemedSelect(ctrl, modalScope, trigSlot, {
        value: promptTriggerMode,
        ariaLabel: 'Prompt Frequency',
        options: [
          { value: 'always', label: 'Always in Prompt' },
          { value: 'conditional', label: 'Only When Keywords Match' },
          { value: 'manual', label: 'Manual Sync Only' },
        ],
        onChange: v => {
          promptTriggerMode = v as 'always' | 'conditional' | 'manual';
          syncCalcVisibility();
        },
      });
      syncCalcVisibility();

      cueHeader.append(
        el('span', '', 'Rule / AI Prompt Instructions'),
        el('div', 'ls-row'),
      );
      const cueConvertBtn = btn(
        '⚡ Convert My Rule to Local Formula',
        () => runConvertRule(cueArea.value, cueConvertBtn),
        'ls-btn-sm ls-btn-primary',
      );
      (cueHeader.lastElementChild as HTMLElement).append(cueConvertBtn);
      const styleCtrl = mountThemedSelect(ctrl, modalScope, styleSlot, {
        value: selectedStyle,
        ariaLabel: 'Visual Display Style',
        options: [
          { value: 'auto', label: '✨ Smart Auto-Detect' },
          { value: 'arc_tracker', label: '🎯 Multi-Thread / Arc / Quest Cards' },
          { value: 'accordion_cards', label: '🗂️ Collapsible Multi-Entry Cards' },
          { value: 'matrix_badges', label: '⚖️ Split / Versus Comparison (Knows vs Blind)' },
          { value: 'meter_mini_bars', label: '📊 Multi-Bar Mini Gauges (HP/MP cur/max)' },
          { value: 'stat_pills_grid', label: '🧬 Compact Stat Badges (Lv / P A I / POW)' },
          { value: 'bullet_ledger', label: '💰 Aligned Bullet & Currency Ledger' },
          { value: 'timeline_list', label: '📜 Vertical Event Timeline' },
          { value: 'checklist', label: '☑️ Visual Objectives Checklist' },
          { value: 'feed_cards', label: '🃏 Structured Flow Cards' },
          { value: 'step_chain', label: '⛓️ Horizontal Step Chain' },
          { value: 'key_value', label: '📋 Key–Value Table' },
          { value: 'pill_list', label: '🏷️ Tag / Pill List' },
          { value: 'quote_callout', label: '💭 Quote Callout Box' },
        ],
        onChange: v => {
          selectedStyle = v as StatDisplayStyle;
          if (selectedStyle === 'pill_list') {
            selectedKind = 'tags';
            kindCtrl.setValue('tags');
          } else if (selectedStyle !== 'auto' && !['text', 'tags', 'tier'].includes(selectedKind)) {
            selectedKind = 'text';
            kindCtrl.setValue('text');
          }
          syncRangeVisibility();
        },
      });

      const spanCtrl = mountThemedSelect(ctrl, modalScope, spanSlot, {
        value: selectedSpan,
        ariaLabel: 'Card Grid Width',
        options: [
          { value: 'auto', label: '📐 Auto' },
          { value: 'full', label: '↔️ Always Full Width' },
          { value: 'half', label: '▫ Always Compact Column' },
        ],
        onChange: v => {
          selectedSpan = v as StatLayoutSpan;
        },
      });

      mountThemedSelect(ctrl, modalScope, scopeSlot, {
        value: selectedScope,
        ariaLabel: 'Owner Scope',
        options: [
          { value: 'character', label: '👥 Character Meter (Per-NPC)' },
          { value: 'player', label: '👤 Player Stat' },
          { value: 'world', label: '🌍 World Stat / Clock' },
          { value: 'scene', label: '🎭 Scene / Thread Stat' },
        ],
        onChange: v => {
          selectedScope = v as StatScope;
          showDossier = selectedScope === 'character';
          const chk = dossierCheckboxSlot?.querySelector<HTMLInputElement>('input');
          if (chk) chk.checked = showDossier;
          if (calcMode === 'local_formula') updateFormulaPreview();
        },
      });

      const kindCtrl = mountThemedSelect(ctrl, modalScope, kindSlot, {
        value: selectedKind,
        ariaLabel: 'Value Format',
        options: [
          { value: 'meter', label: '📊 Progress Bar / Meter' },
          { value: 'skill_tree', label: '🌳 Skill Tree & SP' },
          { value: 'xp_level', label: '⭐ XP & Leveling Gauge' },
          { value: 'attributes', label: '🧬 RPG Attributes + Radar' },
          { value: 'inventory', label: '🎒 Rarity Inventory' },
          { value: 'status_fx', label: '⚡ Buffs & Debuffs' },
          { value: 'hearts', label: '❤️ Heart Affinity Row' },
          { value: 'currency', label: '🪙 Currency Counter' },
          { value: 'clock', label: '⏱️ Segmented Clock' },
          { value: 'pips', label: '🎲 Resource Pips' },
          { value: 'text', label: '📝 Structured Text / Feed' },
          { value: 'tags', label: '🏷️ Tag / Pill List' },
          { value: 'tier', label: '🏆 Ordered Stage / Rank' },
          { value: 'number', label: '🔢 Numeric Counter' },
          { value: 'boolean', label: '☑️ Boolean Flag' },
        ],
        onChange: v => {
          selectedKind = v as StatValueKind;
          if (selectedKind === 'tags' && selectedStyle === 'auto') {
            selectedStyle = 'pill_list';
            styleCtrl.setValue('pill_list');
          } else if (
            ['meter', 'clock', 'pips', 'number', 'boolean', 'skill_tree', 'xp_level', 'attributes', 'inventory', 'status_fx', 'hearts', 'currency'].includes(selectedKind)
          ) {
            selectedStyle = 'auto';
            styleCtrl.setValue('auto');
            if (['skill_tree', 'attributes', 'inventory', 'status_fx'].includes(selectedKind)) {
              selectedSpan = 'full';
              spanCtrl.setValue('full');
            }
          }
          syncRangeVisibility();
        },
      });

      mountThemedSelect(ctrl, modalScope, volSlot, {
        value: selectedVol,
        ariaLabel: 'Reactivity Profile',
        options: [
          { value: 'momentary', label: '⚡ Momentary — Instant reaction' },
          { value: 'progressive', label: '📈 Progressive — Steady evolution' },
          { value: 'anchor', label: '⚓ Anchor — Role/premise baseline' },
        ],
        onChange: v => {
          selectedVol = v as StatVolatility;
        },
      });

      mountThemedSelect(ctrl, modalScope, wTabSlot, {
        value: selectedWTab,
        ariaLabel: 'Floating Widget Tab',
        options: tpl.surfaces.widgetTabs.map(t => ({ value: t.id, label: `${t.icon} ${t.label}` })),
        onChange: v => { selectedWTab = v; },
      });

      mountThemedSelect(ctrl, modalScope, iTabSlot, {
        value: selectedITab,
        ariaLabel: 'Inline Ribbon Tab',
        options: tpl.surfaces.inlineTabs.map(t => ({ value: t.id, label: `${t.icon} ${t.label}` })),
        onChange: v => { selectedITab = v; },
      });

      mountThemedSelect(ctrl, modalScope, dTabSlot, {
        value: selectedDTab,
        ariaLabel: 'Character Dossier Tab',
        options: tpl.surfaces.dossierTabs.map(t => ({ value: t.id, label: `${t.icon} ${t.label}` })),
        onChange: v => { selectedDTab = v; },
      });

      (cueHeader.lastElementChild as HTMLElement).append(
        btn('🌳 Skill Rule', () => {
          selectedKind = 'skill_tree';
          kindCtrl.setValue('skill_tree');
          selectedSpan = 'full';
          spanCtrl.setValue('full');
          cueArea.value =
            'Format: "SP: N | Skill A (Lv.X/Y, cost:1, bonus) ; Skill B (Lv.X/Y, cost:1, req:Skill A)". Grant SP on milestones or training.';
          syncRangeVisibility();
        }, 'ls-btn-sm'),
        btn('✨ Feed Rule', () => {
          selectedKind = 'text';
          kindCtrl.setValue('text');
          selectedStyle = 'feed_cards';
          styleCtrl.setValue('feed_cards');
          selectedSpan = 'full';
          spanCtrl.setValue('full');
          cueArea.value =
            'Format each entry separated by "; " as: "Subject: Current Location -> Action -> Next Hook".';
          syncRangeVisibility();
        }, 'ls-btn-sm'),
        btn('⛶ Full-Screen', () => {
          void ctrl
            .request('textEditor:open', {
              title: `AI Prompt Rule: ${labelInp.value || 'Stat'}`,
              value: cueArea.value,
              placeholder: 'Describe when this stat should calibrate high/low and what situational cues shift it…',
            })
            .then(res => {
              if (!res.cancelled && typeof res.text === 'string') {
                cueArea.value = res.text;
              }
            });
        }, 'ls-btn-sm'),
      );
      cueWrap.append(cueHeader, cueArea);
      aiBody.append(cueWrap);

      const anchorsWrap = el('div', 'ls-label');
      const anchorsHeader = el('div', 'ls-row-between');
      const anchorsArea = el('textarea', 'ls-input');
      anchorsArea.rows = 2;
      anchorsArea.placeholder = 'Optional — e.g.\n80: High — Description\n50: Moderate — Description';
      anchorsArea.value = (existing?.anchors ?? [])
        .map(a => `${a.value}: ${a.label}${a.description && a.description !== a.label ? ` — ${a.description}` : ''}`)
        .join('\n');
      anchorsHeader.append(
        el('span', '', 'Scale Anchors (value: Label — Description)'),
        btn('✨ Auto-Fill Anchors', () => {
          const sample = buildProportionalAnchors(
            Number(minInp.value) || 0,
            Number(maxInp.value) || 100,
            selectedVol,
          );
          anchorsArea.value = sample.map(a => `${a.value}: ${a.label} — ${a.description}`).join('\n');
        }, 'ls-btn-sm'),
      );
      anchorsWrap.append(anchorsHeader, anchorsArea);
      aiBody.append(anchorsWrap);

      const parseAnchorsText = (raw: string): StatScaleAnchor[] => {
        if (!raw.trim()) return [];
        const out: StatScaleAnchor[] = [];
        for (const line of raw.split('\n').map(s => s.trim()).filter(Boolean)) {
          const match = line.match(/^(-?\d+(?:\.\d+)?)\s*:\s*([^—\-]+?)(?:\s*[—\-]\s*(.+))?$/);
          if (match) {
            out.push({
              value: Number(match[1]),
              label: match[2]!.trim(),
              description: (match[3] ?? match[2])!.trim(),
            });
          }
        }
        return out;
      };

      const saveBtn = btn(existing ? 'Save Changes' : 'Create Stat', () => {
        const label = labelInp.value.trim();
        if (!label) return;
        const parsedMin = Number(minInp.value);
        const min = minInp.value.trim() !== '' && Number.isFinite(parsedMin) ? parsedMin : 0;
        const parsedMax = Number(maxInp.value);
        const max = maxInp.value.trim() !== '' && Number.isFinite(parsedMax) ? parsedMax : 100;
        const rawDef = defInp.value.trim();
        const parsedDefNum = Number(rawDef);
        const defaultValue: number | string | boolean =
          selectedKind === 'boolean'
            ? rawDef === 'true' || rawDef === '1'
            : ['meter', 'number', 'clock', 'pips', 'hearts', 'currency'].includes(selectedKind) && selectedStyle === 'auto'
              ? rawDef !== '' && Number.isFinite(parsedDefNum)
                ? parsedDefNum
                : Math.max(Math.min(min, max), Math.min(Math.max(min, max), 0))
              : rawDef && rawDef !== '0'
                ? rawDef
                : (undefined as unknown as string);
        const parsedKeywords = kwInp.value
          .split(',')
          .map(k => k.trim().toLowerCase())
          .filter(Boolean);
        const created = createStatSchema({
          ...existing,
          id: existing?.id,
          label,
          icon: iconInp.value.trim() || '📊',
          scope: selectedScope,
          kind: selectedKind,
          volatility: selectedVol,
          displayStyle: selectedStyle,
          layoutSpan: selectedSpan,
          color: selectedColor,
          min,
          max,
          ...(defaultValue !== undefined ? { defaultValue } : {}),
          anchors: parseAnchorsText(anchorsArea.value),
          triggerCues: cueArea.value.trim(),
          calculationMode: calcMode,
          formula:
            calcMode === 'local_formula' || calcMode === 'ai_plus_local'
              ? formulaArea.value.trim()
              : undefined,
          formulaOutputTemplate:
            calcMode === 'local_formula' || calcMode === 'ai_plus_local'
              ? outTplInp.value.trim()
              : undefined,
          promptTriggerMode,
          promptKeywords: parsedKeywords,
          injectInContinuity,
          categoryId: selectedCategoryId || undefined,
          pinnedToHeader,
          locked,
          widgetTabId: selectedWTab,
          inlineTabId: selectedITab,
          dossierTabId: selectedDTab,
          extraWidgetTabIds: [...extraWTabs].filter(id => id !== selectedWTab),
          showIn: {
            widget: showWidget,
            inline: showInline,
            dossier: showDossier,
            pinnedHeader: pinnedToHeader,
          },
        });

        const idx = tpl.stats.findIndex(s => s.id === created.id);
        if (idx >= 0) tpl.stats[idx] = created;
        else tpl.stats.push(created);

        void ctrl.request('state:mutate', {
          templatePatch: { stats: tpl.stats },
          reason: `Saved stat schema "${created.label}"`,
        });
        close();
      }, 'ls-btn-primary');

      const footerRow = el('div', 'ls-row-between');
      footerRow.style.marginTop = '12px';
      if (existing) {
        footerRow.append(
          btn('Duplicate to Another Tab…', () => {
            close();
            openDuplicateStatModal(ctrl, existing);
          }, 'ls-btn-sm'),
          saveBtn,
        );
      } else {
        footerRow.append(el('span'), saveBtn);
      }
      body.append(footerRow);
    },
  );
}

/**
 * Renders a list of non-character `StatSchemaDef` items as interactive cards,
 * including structured multi-entry flow cards (`A -> B -> C`) and full-width spans.
 */
export function renderStatSchemaCards(
  ctrl: LumiFrontendController,
  matchingSchemas: StatSchemaDef[],
  defaultScope: StatScope,
  compScope?: ComponentScope,
  interactiveSliders = false,
  showHeader = true,
): HTMLElement {
  const { state, template, deltas } = ctrl.snapshot;
  const wrap = el('div', 'ls-stack');

  if (showHeader) {
    const head = el('div', 'ls-row-between');
    head.append(
      el('span', 'ls-kicker', `Active Stats (${matchingSchemas.length})`),
      el('div', 'ls-row'),
    );
    (head.lastElementChild as HTMLElement).append(
      iconBtn('flask', () => openSandboxTesterModal(ctrl), {
        label: 'Sandbox',
        className: 'ls-btn-sm ls-btn-ghost',
        title: 'Test stats in AI Sandbox',
      }),
      iconBtn('plus', () => openStatSchemaModal(ctrl, defaultScope), {
        label: 'Add Stat',
        className: 'ls-btn-sm ls-btn-primary',
        title: 'Create a new stat or meter',
      }),
    );
    wrap.append(head);
  }

  if (!matchingSchemas.length) {
    wrap.append(el('p', 'ls-muted', 'No stats assigned here yet. Click "+ Add Stat" or customize tab assignments in Studio.'));
    return wrap;
  }

  const catMap = new Map((template.categories ?? []).map(c => [c.id, c]));
  const visibleSchemas = matchingSchemas.filter(s => {
    if (!s.categoryId) return true;
    const cat = catMap.get(s.categoryId);
    return !cat || cat.enabled !== false;
  });

  const grid = el('div', 'ls-stat-grid');

  const mutateStat = (schema: StatSchemaDef, value: number | string | boolean, op: 'set' | 'delta' = 'set') => {
    void ctrl.request('state:mutate', {
      patch: {
        stats: {
          [schema.id]: { op, value, reason: 'Manual UI adjustment' },
        },
      },
      reason: `Updated ${schema.label} to ${String(value)}`,
    });
  };

  const renderedCells: Array<{ cell: HTMLElement; spanMode: 'full' | 'half'; autoSpan: boolean }> = [];

  const orderedSchemas = [...visibleSchemas].sort((a, b) => {
    const ca = a.categoryId ? (catMap.get(a.categoryId)?.order ?? 999) : 1000;
    const cb = b.categoryId ? (catMap.get(b.categoryId)?.order ?? 999) : 1000;
    return ca - cb;
  });

  let lastRenderedCatId: string | undefined;

  for (const schema of orderedSchemas) {
    const activeCat = schema.categoryId ? catMap.get(schema.categoryId) : undefined;
    if (
      activeCat &&
      activeCat.showGroupHeaderInHud !== false &&
      activeCat.id !== lastRenderedCatId
    ) {
      lastRenderedCatId = activeCat.id;
      const catHeader = el('div', 'ls-hud-cat-head');
      catHeader.style.borderLeftColor = activeCat.color || 'var(--ls-primary)';
      catHeader.append(
        el('strong', '', `${activeCat.icon} ${activeCat.name}`),
      );
      grid.append(catHeader);
    } else if (!activeCat && lastRenderedCatId !== undefined) {
      lastRenderedCatId = undefined;
    }
    const runtime = state.stats[schema.id];
    const isCalibrated = Boolean(runtime?.calibrated);
    const val = runtime !== undefined ? runtime.value : schema.defaultValue;
    const isLocked = Boolean(schema.locked || runtime?.locked);
    const delta = deltas.statDeltas[schema.id] ?? 0;

    const strVal = String(val ?? '');
    const isRpgRichKind = [
      'skill_tree',
      'xp_level',
      'attributes',
      'inventory',
      'status_fx',
    ].includes(schema.kind);
    const hasCustomStyle = Boolean(schema.displayStyle && schema.displayStyle !== 'auto');
    const isTextKind = schema.kind === 'text' || schema.kind === 'tags' || schema.kind === 'tier';
    const isStructuredBodyStat =
      !isRpgRichKind &&
      (hasCustomStyle ||
        isTextKind ||
        (isCalibrated && typeof val === 'string' && (strVal.length > 24 || /->|→|\n|;/.test(strVal))));

    const hasDelimiters = /->|→|\n|;/.test(strVal);
    const compactCustomStyle =
      schema.displayStyle === 'stat_pills_grid' || schema.displayStyle === 'meter_mini_bars';
    const spanMode =
      schema.layoutSpan === 'full' ||
      (schema.layoutSpan !== 'half' &&
        (['skill_tree', 'attributes', 'inventory', 'status_fx', 'xp_level'].includes(schema.kind) ||
          (hasCustomStyle && !compactCustomStyle) ||
          (isStructuredBodyStat && (strVal.length > 40 || hasDelimiters))))
        ? 'full'
        : 'half';

    const cell = el('div', 'ls-stat-cell');
    cell.style.setProperty('--ls-bar-color', schema.color || 'var(--ls-primary)');
    cell.dataset.locked = String(isLocked);
    cell.dataset.uncalibrated = String(!isCalibrated);
    cell.dataset.span = spanMode;
    if (runtime?.lastReason) {
      cell.title = `${runtime.lastReason} (Right-click or long-press for options)`;
    }

    const top = el('div', 'ls-row-between');
    const titleSpan = el('div', 'ls-row');
    titleSpan.append(el('strong', '', `${schema.icon} ${schema.label}`));
    if (schema.calculationMode === 'ai_plus_local') {
      titleSpan.append(el('span', 'ls-chip ls-chip-accent', '🔀 Hybrid'));
    } else if (schema.calculationMode === 'local_formula' || schema.formula) {
      titleSpan.append(el('span', 'ls-chip ls-chip-accent', '⚡ Local'));
    }
    top.append(titleSpan);

    const right = el('div', 'ls-row');
    if (delta !== 0) {
      right.append(
        el(
          'span',
          `ls-delta ${delta > 0 ? 'is-pos' : 'is-neg'}`,
          `${delta > 0 ? `+${delta} ▲` : `${delta} ▼`}`,
        ),
      );
    }

    let headerBadgeText = '';
    if (!isCalibrated && !isRpgRichKind) {
      headerBadgeText = 'Uncalibrated';
    } else if (schema.kind === 'clock' || schema.kind === 'pips') {
      headerBadgeText = `${Number(val) || 0}/${schema.max}`;
    } else if (schema.kind === 'boolean') {
      headerBadgeText = val ? '✓ Active' : '○ Inactive';
    } else if (isRpgRichKind || schema.kind === 'currency' || schema.kind === 'hearts') {
      headerBadgeText = '';
    } else if (isStructuredBodyStat) {
      const parsedCount = parseStructuredStatText(strVal).length;
      headerBadgeText = parsedCount > 1 ? `${parsedCount} entries` : '';
    } else {
      headerBadgeText = strVal;
    }

    const valBadge = el('strong', headerBadgeText ? 'ls-chip ls-chip-accent' : '', headerBadgeText);
    if (headerBadgeText) right.append(valBadge);
    right.append(
      iconBtn('edit', () => openStatSchemaModal(ctrl, schema.scope, schema), {
        className: 'ls-btn-sm ls-btn-icon ls-btn-ghost',
        title: `Edit "${schema.label}" style, tab & prompt`,
      }),
    );
    top.append(right);
    cell.append(top);

    if (typeof val === 'number' && isCalibrated && !isStructuredBodyStat && schema.kind !== 'currency') {
      const anchorLbl = resolveAnchorLabel(schema.anchors, val);
      if (anchorLbl) {
        cell.append(el('small', 'ls-muted', anchorLbl));
      }
    } else if (!isCalibrated && !isRpgRichKind) {
      cell.append(el('small', 'ls-muted', 'Calibrates automatically on turn sync'));
    }

    if (schema.kind === 'skill_tree') {
      cell.append(
        renderSkillTreeWidget(schema, val, isLocked, (nextSerialized, reason) => {
          void ctrl.request('state:mutate', {
            patch: {
              stats: {
                [schema.id]: { op: 'set', value: nextSerialized, reason },
              },
            },
            reason,
          });
        }),
      );
    } else if (schema.kind === 'xp_level') {
      cell.append(renderXpLevelWidget(schema, val));
    } else if (schema.kind === 'attributes') {
      cell.append(renderAttributesWidget(schema, val, `player:${ctrl.chatId}`));
    } else if (schema.kind === 'inventory') {
      cell.append(renderInventoryWidget(val));
    } else if (schema.kind === 'status_fx') {
      cell.append(renderStatusFxWidget(val));
    } else if (schema.kind === 'hearts') {
      cell.append(
        renderHeartsWidget(schema, Number(val) || 0, isCalibrated, isLocked, nextVal =>
          mutateStat(schema, nextVal, 'set'),
        ),
      );
    } else if (schema.kind === 'currency') {
      cell.append(renderCurrencyWidget(schema, val as number | string, delta));
    } else if (isStructuredBodyStat && isCalibrated && strVal && strVal !== 'None') {
      cell.append(renderStructuredTextStatBody(strVal, schema.displayStyle ?? 'auto'));
    } else if (schema.kind === 'clock') {
      const segs = Math.max(2, Math.min(16, schema.max || 6));
      const cur = isCalibrated ? Math.max(0, Math.min(segs, Math.round(Number(val) || 0))) : 0;
      const clockBar = el('div', 'ls-clock-bar');
      clockBar.style.gridTemplateColumns = `repeat(${segs}, 1fr)`;
      for (let i = 1; i <= segs; i++) {
        const seg = el('span', `ls-clock-seg${i <= cur ? ' is-filled' : ''}`);
        seg.addEventListener('click', () => mutateStat(schema, i === cur ? i - 1 : i, 'set'));
        clockBar.append(seg);
      }
      cell.append(clockBar);
    } else if (schema.kind === 'pips') {
      const maxPips = Math.max(1, Math.min(12, schema.max || 5));
      const curPips = isCalibrated ? Math.max(0, Math.min(maxPips, Math.round(Number(val) || 0))) : 0;
      const pipRow = el('div', 'ls-row');
      for (let i = 1; i <= maxPips; i++) {
        pipRow.append(
          btn(
            i <= curPips ? '◆' : '◇',
            () => mutateStat(schema, i === curPips ? i - 1 : i, 'set'),
            'ls-btn-sm ls-btn-icon',
          ),
        );
      }
      cell.append(pipRow);
    } else if (!isStructuredBodyStat && (schema.kind === 'meter' || schema.kind === 'number')) {
      const numVal = typeof val === 'number' ? val : Number(schema.defaultValue) || 0;
      const span = Math.max(1, schema.max - schema.min);
      const track = el('div', 'ls-bar-track');
      const fill = el('div', 'ls-bar-fill');
      if (schema.min < 0 && schema.max > 0) {
        track.dataset.bipolar = 'true';
        const zeroPct = ((0 - schema.min) / span) * 100;
        if (numVal >= 0) {
          fill.style.marginLeft = `${zeroPct.toFixed(1)}%`;
          fill.style.width = `${Math.min(100 - zeroPct, (numVal / schema.max) * (100 - zeroPct)).toFixed(1)}%`;
        } else {
          const wPct = (Math.abs(numVal) / Math.abs(schema.min)) * zeroPct;
          fill.style.marginLeft = `${Math.max(0, zeroPct - wPct).toFixed(1)}%`;
          fill.style.width = `${Math.min(zeroPct, wPct).toFixed(1)}%`;
          fill.style.background = 'var(--ls-danger)';
        }
      } else {
        const pct = Math.max(0, Math.min(100, Math.round(((numVal - schema.min) / span) * 100)));
        fill.style.width = `${pct}%`;
      }
      track.append(fill);
      cell.append(track);

      if (interactiveSliders && compScope && ctrl.ctx.components?.mountRangeSlider) {
        const sliderSlot = el('div');
        cell.append(sliderSlot);
        try {
          compScope.track(
            ctrl.ctx.components.mountRangeSlider(sliderSlot, {
              min: schema.min,
              max: schema.max,
              step: schema.step || 1,
              integer: true,
              value: numVal,
              disabled: isLocked,
              onDragValue: v => {
                if (v !== null) valBadge.textContent = String(v);
              },
              onCommit: v => mutateStat(schema, v, 'set'),
            }),
          );
        } catch {
          // Ignore if detached
        }
      }
    }

    bindContextMenuWithLongPress(
      ctrl.ctx,
      cell,
      () => [
        {
          key: 'pin',
          label: schema.pinnedToHeader ? '📌 Unpin from Header' : '📍 Pin to Header',
          active: schema.pinnedToHeader,
        },
        {
          key: 'lock',
          label: isLocked ? '🔓 Unlock Stat' : '🔒 Lock Stat',
          active: isLocked,
        },
        { key: 'edit', label: '✏️ Edit Stat Schema, Visual Style & Routing' },
        { key: 'duplicate', label: '📋 Duplicate to Another Scope / Tab…' },
        { key: 'test', label: '🧪 Test in AI Sandbox' },
        { key: 'div', label: '', type: 'divider' },
        { key: 'delete', label: '🗑️ Delete Stat', danger: true },
      ],
      selectedKey => {
        if (selectedKey === 'pin') {
          const nextStats = template.stats.map(s =>
            s.id === schema.id
              ? { ...s, pinnedToHeader: !s.pinnedToHeader, showIn: { ...s.showIn, pinnedHeader: !s.pinnedToHeader } }
              : s,
          );
          void ctrl.request('state:mutate', { templatePatch: { stats: nextStats } });
        } else if (selectedKey === 'lock') {
          const nextStats = template.stats.map(s =>
            s.id === schema.id ? { ...s, locked: !isLocked } : s,
          );
          void ctrl.request('state:mutate', { templatePatch: { stats: nextStats } });
        } else if (selectedKey === 'edit') {
          openStatSchemaModal(ctrl, schema.scope, schema);
        } else if (selectedKey === 'duplicate') {
          openDuplicateStatModal(ctrl, schema);
        } else if (selectedKey === 'test') {
          openSandboxTesterModal(ctrl, schema.id);
        } else if (selectedKey === 'delete') {
          const nextStats = template.stats.filter(s => s.id !== schema.id);
          void ctrl.request('state:mutate', { templatePatch: { stats: nextStats } });
        }
      },
    );

    renderedCells.push({
      cell,
      spanMode,
      autoSpan: !schema.layoutSpan || schema.layoutSpan === 'auto',
    });
    grid.append(cell);
  }

  // Prevent 50% empty orphan holes when an auto-span half card sits alone before a full-width card or at the end
  let halfRunCount = 0;
  for (let i = 0; i < renderedCells.length; i++) {
    const item = renderedCells[i]!;
    if (item.spanMode === 'half') {
      halfRunCount++;
      const nextIsFullOrEnd = i === renderedCells.length - 1 || renderedCells[i + 1]!.spanMode === 'full';
      if (nextIsFullOrEnd && halfRunCount % 2 === 1 && item.autoSpan) {
        item.cell.dataset.span = 'full';
        halfRunCount = 0;
      }
    } else {
      halfRunCount = 0;
    }
  }

  wrap.append(grid);
  return wrap;
}

export function renderStatGridSurface(
  ctrl: LumiFrontendController,
  scopeFilter: Array<Exclude<StatScope, 'character'>>,
  compScope?: ComponentScope,
  interactiveSliders = false,
): HTMLElement {
  const { template } = ctrl.snapshot;
  const matching = template.stats.filter(
    s => s.enabled && s.scope !== 'character' && scopeFilter.includes(s.scope),
  );
  return renderStatSchemaCards(ctrl, matching, scopeFilter[0] ?? 'player', compScope, interactiveSliders, true);
}

const crossTabAwayOpen = new Map<string, boolean>();

function renderCrossTabCharacterStats(
  ctrl: LumiFrontendController,
  charSchemas: StatSchemaDef[],
  compScope?: ComponentScope,
  interactiveSliders = false,
): HTMLElement {
  const { state, deltas } = ctrl.snapshot;
  const wrap = el('div', 'ls-stack');
  const allActors = Object.values(state.characters);
  const presentActors = allActors.filter(a => a.present);
  const awayActors = allActors.filter(a => !a.present);
  const primaryActors = presentActors.length > 0 ? presentActors : awayActors;
  const secondaryAwayActors = presentActors.length > 0 ? awayActors : [];

  if (!allActors.length) {
    wrap.append(
      el(
        'p',
        'ls-muted',
        `${charSchemas.map(s => `${s.icon} ${s.label}`).join(', ')} will appear here once characters enter the scene.`,
      ),
    );
    return wrap;
  }

  for (const schema of charSchemas) {
    const card = el('div', 'ls-stat-cell');
    card.style.setProperty('--ls-bar-color', schema.color || 'var(--ls-primary)');
    card.dataset.span = 'full';

    const head = el('div', 'ls-row-between');
    head.append(
      el('strong', '', `${schema.icon} ${schema.label} (Cast)`),
      btn('✏️', () => openStatSchemaModal(ctrl, 'character', schema), 'ls-btn-sm ls-btn-icon', 'Customize stat schema & tab'),
    );
    card.append(head);

    const isRpgRichKind = ['skill_tree', 'xp_level', 'attributes', 'inventory', 'status_fx'].includes(schema.kind);
    const isTextStat =
      Boolean(schema.displayStyle && schema.displayStyle !== 'auto') ||
      ['text', 'tags', 'tier'].includes(schema.kind);

    const appendActorCell = (targetGrid: HTMLElement, actor: (typeof allActors)[number]) => {
      const entry = actor.meters[schema.id];
      const isCalibrated = Boolean(entry?.calibrated);
      const val = isCalibrated && entry ? entry.value : schema.defaultValue;
      const d = deltas.characterDeltas[actor.id]?.[schema.id] ?? 0;

      if (isRpgRichKind || isTextStat || schema.kind === 'boolean' || schema.kind === 'hearts' || schema.kind === 'currency') {
        const sub = el('div', 'ls-cast-mini-meter');
        sub.style.gridColumn = '1 / -1';
        const row = el('div', 'ls-row-between');
        row.append(
          el('small', 'ls-muted', `${actor.present ? '🟢' : '⚪'} ${actor.name}`),
          el('small', '', isCalibrated || isRpgRichKind ? '' : 'Uncalibrated'),
        );
        sub.append(row);

        if (schema.kind === 'skill_tree') {
          sub.append(
            renderSkillTreeWidget(schema, val, Boolean(schema.locked || entry?.locked), (nextSerialized, reason) => {
              void ctrl.request('state:mutate', {
                patch: {
                  characters: [{
                    id: actor.id,
                    name: actor.name,
                    meters: { [schema.id]: { op: 'set', value: nextSerialized, reason } },
                  }],
                },
                reason,
              });
            }),
          );
        } else if (schema.kind === 'xp_level') {
          sub.append(renderXpLevelWidget(schema, val));
        } else if (schema.kind === 'attributes') {
          sub.append(renderAttributesWidget(schema, val, `${actor.id}:${ctrl.chatId}`));
        } else if (schema.kind === 'inventory') {
          sub.append(renderInventoryWidget(val));
        } else if (schema.kind === 'status_fx') {
          sub.append(renderStatusFxWidget(val));
        } else if (schema.kind === 'hearts') {
          sub.append(renderHeartsWidget(schema, Number(val) || 0, isCalibrated, Boolean(schema.locked || entry?.locked)));
        } else if (schema.kind === 'currency') {
          sub.append(renderCurrencyWidget(schema, val as number | string, d));
        } else {
          sub.append(
            isCalibrated
              ? renderStructuredTextStatBody(String(val ?? ''), schema.displayStyle ?? 'auto')
              : el('small', 'ls-muted', '—'),
          );
        }
        targetGrid.append(sub);
        return;
      }

      const numVal = isCalibrated && typeof val === 'number' ? val : 0;
      const span = Math.max(1, schema.max - schema.min);
      const pct = isCalibrated
        ? Math.max(0, Math.min(100, Math.round(((numVal - schema.min) / span) * 100)))
        : 0;
      const tier = isCalibrated ? resolveAnchorLabel(schema.anchors, numVal) : '';

      const mini = el('div', 'ls-cast-mini-meter');
      if (tier) mini.title = `${actor.name} · ${schema.label}: ${numVal} (${tier})`;
      const topRow = el('div', 'ls-row-between');
      topRow.append(el('small', 'ls-muted', `${actor.present ? '🟢' : '⚪'} ${actor.name}`));
      const valCluster = el('div', 'ls-row');
      if (d !== 0) {
        valCluster.append(
          el('span', `ls-delta ${d > 0 ? 'is-pos' : 'is-neg'}`, d > 0 ? `+${d}` : String(d)),
        );
      }
      const valLabel = el(
        'strong',
        '',
        isCalibrated
          ? schema.kind === 'clock' || schema.kind === 'pips'
            ? `${numVal}/${schema.max}`
            : String(numVal)
          : '—',
      );
      valCluster.append(valLabel);
      topRow.append(valCluster);

      const track = el('div', 'ls-bar-track');
      const fill = el('div', 'ls-bar-fill');
      fill.style.width = `${pct}%`;
      track.append(fill);
      mini.append(topRow, track);

      if (interactiveSliders && compScope && ctrl.ctx.components?.mountRangeSlider) {
        const sliderSlot = el('div');
        mini.append(sliderSlot);
        try {
          compScope.track(
            ctrl.ctx.components.mountRangeSlider(sliderSlot, {
              min: schema.min,
              max: schema.max,
              step: schema.step || 1,
              integer: true,
              value: numVal,
              disabled: Boolean(schema.locked || entry?.locked),
              onDragValue: v => {
                if (v !== null) valLabel.textContent = String(v);
              },
              onCommit: v => {
                void ctrl.request('state:mutate', {
                  patch: {
                    characters: [
                      {
                        id: actor.id,
                        name: actor.name,
                        meters: {
                          [schema.id]: { op: 'set', value: v, reason: 'Manual UI adjustment' },
                        },
                      },
                    ],
                  },
                  reason: `Updated ${actor.name} ${schema.label} to ${v}`,
                });
              },
            }),
          );
        } catch {
          // Ignore if detached
        }
      }

      targetGrid.append(mini);
    };

    const grid = el('div', 'ls-cast-mini-grid');
    for (const actor of primaryActors) {
      appendActorCell(grid, actor);
    }
    card.append(grid);

    if (secondaryAwayActors.length > 0) {
      const det = el('details', 'ls-stat-acc');
      det.open = crossTabAwayOpen.get(schema.id) ?? false;
      det.addEventListener('toggle', () => {
        crossTabAwayOpen.set(schema.id, det.open);
      });
      const sum = el('summary', 'ls-stat-acc-head');
      sum.append(
        el('small', 'ls-muted', `⚪ Away (${secondaryAwayActors.length}): ${secondaryAwayActors.map(a => a.name).join(', ')}`),
        el('small', 'ls-muted', '▾'),
      );
      const body = el('div', 'ls-stat-acc-body');
      const awayGrid = el('div', 'ls-cast-mini-grid');
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

export function renderStatsForSurfaceTab(
  ctrl: LumiFrontendController,
  surface: 'widget' | 'inline',
  tabId: string,
  compScope?: ComponentScope,
  interactiveSliders = false,
): HTMLElement {
  const { template } = ctrl.snapshot;
  const matching = template.stats.filter(s => {
    if (!s.enabled) return false;
    if (surface === 'widget' && s.showIn?.widget === false) return false;
    if (surface === 'inline' && s.showIn?.inline === false) return false;
    const fallbackTab = s.scope === 'character' ? 'cast' : s.tabId;
    const assigned =
      surface === 'widget' ? (s.widgetTabId || fallbackTab) : (s.inlineTabId || fallbackTab);
    const extraTabs = surface === 'widget' ? s.extraWidgetTabIds : s.extraInlineTabIds;
    return assigned === tabId || Boolean(extraTabs?.includes(tabId));
  });

  const nonCharMatching = matching.filter(s => s.scope !== 'character');
  const charMatching = matching.filter(s => s.scope === 'character');
  const defaultScope: StatScope = tabId === 'world' ? 'world' : 'player';

  const combined = el('div', 'ls-stack');

  const coreEl = renderCorePlayerAndSceneCards(ctrl, surface, tabId);
  if (coreEl.childElementCount > 0) combined.append(coreEl);

  if (nonCharMatching.length > 0 || (charMatching.length === 0 && combined.childElementCount === 0)) {
    combined.append(
      renderStatSchemaCards(
        ctrl,
        nonCharMatching,
        defaultScope,
        compScope,
        interactiveSliders,
        true,
      ),
    );
  }

  if (charMatching.length > 0) {
    combined.append(
      renderCrossTabCharacterStats(ctrl, charMatching, compScope, interactiveSliders),
    );
  }

  if (tabId === 'world') {
    const worldExtras = renderWorldQuestsAndDispatches(ctrl);
    if (worldExtras.childElementCount > 0) combined.append(worldExtras);
  }

  return combined;
}

/**
 * Renders the built-in Player & Scene core trackers (`player.attire`, `player.condition`,
 * `player.notableAction`, and `scene.beatSummary`) so none of the tracked state is hidden.
 */
export function renderCorePlayerAndSceneCards(
  ctrl: LumiFrontendController,
  surface: 'drawer' | 'widget' | 'inline',
  tabId = 'stats',
): HTMLElement {
  const { state, template } = ctrl.snapshot;
  const core = template.coreTrackers;
  const wrap = el('div', 'ls-stat-grid');

  const addCoreCell = (
    trackerId: BuiltInTrackerId,
    value: string,
    defaultStructured: boolean,
  ) => {
    const cfg = resolveBuiltInTrackerConfig(core, trackerId);
    if (!cfg.enabled) return;
    if (surface !== 'drawer' && !cfg.showCard) return;
    if (surface === 'widget' && cfg.widgetTabId && cfg.widgetTabId !== tabId) return;
    if (surface === 'inline' && cfg.inlineTabId && cfg.inlineTabId !== tabId) return;

    const cell = el('div', 'ls-stat-cell');
    cell.style.setProperty('--ls-bar-color', cfg.color || 'var(--ls-primary)');
    cell.dataset.locked = String(Boolean(cfg.locked));
    const spanMode =
      cfg.layoutSpan === 'half' || cfg.layoutSpan === 'full'
        ? cfg.layoutSpan
        : value.length > 48 || /->|→|\n|;/.test(value)
          ? 'full'
          : 'half';
    cell.dataset.span = spanMode;

    const top = el('div', 'ls-row-between');
    top.append(
      el('strong', '', `${cfg.icon || '📊'} ${cfg.label}`),
      el('div', 'ls-row'),
    );
    (top.lastElementChild as HTMLElement).append(
      iconBtn('sliders', () => openBuiltinTrackerModal(ctrl, trackerId), {
        className: 'ls-btn-sm ls-btn-icon ls-btn-ghost',
        title: `Full Edit "${cfg.label}" (Prompt, Style, Tab & Color)`,
      }),
      iconBtn('edit', () => openSceneBannerModal(ctrl), {
        className: 'ls-btn-sm ls-btn-icon ls-btn-ghost',
        title: `Edit ${cfg.label} value`,
      }),
    );

    const style = cfg.displayStyle ?? 'auto';
    const useStructured = style !== 'auto' || defaultStructured || /->|→|\n|;/.test(value);
    cell.append(
      top,
      useStructured ? renderStructuredTextStatBody(value, style) : el('p', '', value),
    );
    wrap.append(cell);
  };

  if (state.player.condition && state.player.condition !== 'Normal') {
    addCoreCell('player_condition', state.player.condition, true);
  }
  if (state.player.attire) {
    addCoreCell('player_attire', state.player.attire, false);
  }
  if (state.player.notableAction) {
    addCoreCell('player_action', state.player.notableAction, false);
  }
  if (surface !== 'drawer' && state.scene.beatSummary) {
    addCoreCell('scene_summary', state.scene.beatSummary, false);
  }

  return wrap;
}

/**
 * Renders active Quests & Off-Screen Dispatches inside Widget & Inline `World` tabs.
 */
export function renderWorldQuestsAndDispatches(ctrl: LumiFrontendController): HTMLElement {
  const { state, template } = ctrl.snapshot;
  const core = template.coreTrackers;
  const wrap = el('div', 'ls-stack');

  const quests = Object.values(state.quests);
  if (core?.trackQuests !== false && core?.showQuestsInWidget !== false && quests.length > 0) {
    const qCard = el('div', 'ls-stat-cell');
    qCard.dataset.span = 'full';
    qCard.append(el('strong', '', `🎯 Quests & Objectives (${quests.filter(q => q.status === 'active').length})`));
    for (const q of quests) {
      const box = el('div', 'ls-stack');
      box.style.gap = '3px';
      box.append(el('small', 'ls-kicker', `${q.title} (${q.status})`));
      for (const [idx, obj] of q.objectives.entries()) {
        const row = el('label', 'ls-row');
        const chk = el('input');
        chk.type = 'checkbox';
        chk.checked = obj.completed;
        chk.addEventListener('change', () => {
          const nextObjs = q.objectives.map((o, i) => (i === idx ? { ...o, completed: chk.checked } : o));
          const allDone = nextObjs.every(o => o.completed);
          void ctrl.request('state:mutate', {
            patch: {
              quests: [{ id: q.id, title: q.title, status: allDone ? 'completed' : 'active', objectives: nextObjs }],
            },
          });
        });
        row.append(chk, el('small', obj.completed ? 'ls-muted' : '', obj.text));
        box.append(row);
      }
      qCard.append(box);
    }
    wrap.append(qCard);
  }

  if (core?.trackDispatches !== false && core?.showDispatchesInWidget !== false && state.dispatches.length > 0) {
    const dCard = el('div', 'ls-stat-cell');
    dCard.dataset.span = 'full';
    dCard.append(el('strong', '', `📡 Off-Screen Dispatches (${state.dispatches.length})`));
    for (const disp of [...state.dispatches].reverse().slice(0, 3)) {
      const item = el('div', 'ls-bond-dir-box');
      item.append(
        el('strong', '', `${disp.title} · 📍 ${disp.locationName}`),
        el('small', 'ls-muted', disp.summary),
      );
      dCard.append(item);
    }
    wrap.append(dCard);
  }

  return wrap;
}
