import type { StatSchemaDef } from '../../shared/types';
import { btn, el } from '../controller';

export interface SkillNodeItem {
  name: string;
  level: number;
  maxLevel: number;
  cost: number;
  requires?: string;
  bonus?: string;
  unlocked: boolean;
}

export interface ParsedSkillTree {
  sp: number;
  nodes: SkillNodeItem[];
}

export interface ParsedXpLevel {
  level: number;
  xp: number;
  nextXp: number;
  rank?: string;
}

export interface ParsedAttributeItem {
  name: string;
  value: number;
  max: number;
}

export interface ParsedInventoryItem {
  name: string;
  qty: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  equipped: boolean;
  note?: string;
}

export interface ParsedStatusEffect {
  name: string;
  kind: 'buff' | 'debuff' | 'neutral';
  duration?: string;
}

const radarToggleState = new Map<string, boolean>();

function tryParseJsonObj(raw: string): Record<string, unknown> | null {
  const s = raw.trim();
  if (!s.startsWith('{') && !s.startsWith('[')) return null;
  try {
    const parsed = JSON.parse(s) as unknown;
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/**
 * Parses either JSON or compact text like:
 * `SP: 3 | Sword Mastery (Lv.2/5, cost:1, +15% dmg) ; Shadow Step (Lv.0/3, cost:1, req:Sword Mastery)`
 */
export function parseSkillTreeValue(raw: unknown): ParsedSkillTree {
  const str = String(raw ?? '').trim();
  const obj = tryParseJsonObj(str);
  if (obj && Array.isArray(obj.nodes)) {
    const sp = Math.max(0, Math.round(Number(obj.sp ?? obj.skillPoints ?? obj.points ?? 0) || 0));
    const nodes: SkillNodeItem[] = obj.nodes
      .filter((n): n is Record<string, unknown> => Boolean(n && typeof n === 'object'))
      .map(n => {
        const level = Math.max(0, Math.round(Number(n.level ?? 0) || 0));
        const maxLevel = Math.max(1, Math.round(Number(n.maxLevel ?? n.max ?? 5) || 5));
        return {
          name: String(n.name ?? 'Skill').trim(),
          level: Math.min(maxLevel, level),
          maxLevel,
          cost: Math.max(1, Math.round(Number(n.cost ?? 1) || 1)),
          ...(typeof n.requires === 'string' && n.requires.trim() ? { requires: n.requires.trim() } : {}),
          ...(typeof n.bonus === 'string' && n.bonus.trim() ? { bonus: n.bonus.trim() } : {}),
          unlocked: level > 0 || n.unlocked === true,
        };
      });
    return { sp, nodes };
  }

  let sp = 0;
  let body = str;
  const spMatch = str.match(/^(?:SP|Skill\s*Points?|Points?)\s*:\s*(\d+)\s*(?:\||;|\n|$)/i);
  if (spMatch) {
    sp = Math.max(0, Math.round(Number(spMatch[1]) || 0));
    body = str.slice(spMatch[0].length).trim();
  }

  const nodes: SkillNodeItem[] = [];
  const rawNodes = body
    .split(/\s*(?:;|\n|\|)\s*/)
    .map(s => s.trim())
    .filter(Boolean);

  for (const token of rawNodes) {
    const parenMatch = token.match(/^([^(\[]+?)\s*(?:\(([^)]+)\)|\[([^\]]+)\])?$/);
    const name = (parenMatch?.[1] ?? token).trim();
    const meta = (parenMatch?.[2] ?? parenMatch?.[3] ?? '').trim();
    if (!name || /^(?:none|default)$/i.test(name)) continue;

    let level = 0;
    let maxLevel = 5;
    let cost = 1;
    let requires = '';
    const extras: string[] = [];

    for (const part of meta.split(/\s*,\s*/).map(p => p.trim()).filter(Boolean)) {
      const lvMatch = part.match(/^(?:lv\.?|lvl|rank)?\s*(\d+)\s*(?:\/\s*(\d+))?$/i);
      const costMatch = part.match(/^cost\s*:\s*(\d+)$/i);
      const reqMatch = part.match(/^req(?:uires)?\s*:\s*(.+)$/i);
      if (lvMatch) {
        level = Math.max(0, Number(lvMatch[1]) || 0);
        if (lvMatch[2]) maxLevel = Math.max(1, Number(lvMatch[2]) || 5);
      } else if (costMatch) {
        cost = Math.max(1, Number(costMatch[1]) || 1);
      } else if (reqMatch) {
        requires = reqMatch[1]!.trim();
      } else {
        extras.push(part);
      }
    }

    nodes.push({
      name,
      level: Math.min(maxLevel, level),
      maxLevel,
      cost,
      ...(requires ? { requires } : {}),
      ...(extras.length ? { bonus: extras.join(', ') } : {}),
      unlocked: level > 0,
    });
  }

  return { sp, nodes };
}

export function serializeSkillTreeValue(tree: ParsedSkillTree): string {
  const parts = tree.nodes.map(n => {
    const meta = [`Lv.${n.level}/${n.maxLevel}`, `cost:${n.cost}`];
    if (n.requires) meta.push(`req:${n.requires}`);
    if (n.bonus) meta.push(n.bonus);
    return `${n.name} (${meta.join(', ')})`;
  });
  return `SP: ${tree.sp}${parts.length ? ` | ${parts.join(' ; ')}` : ''}`;
}

export function renderSkillTreeWidget(
  schema: StatSchemaDef,
  rawVal: unknown,
  locked: boolean,
  onCommitValue?: (nextSerialized: string, reason: string) => void,
): HTMLElement {
  const tree = parseSkillTreeValue(rawVal);
  const wrap = el('div', 'ls-rpg-skill-wrap');

  const topBar = el('div', 'ls-row-between');
  const spBadge = el('span', 'ls-rpg-sp-badge', `✦ ${tree.sp} Skill Point${tree.sp === 1 ? '' : 's'}`);
  topBar.append(spBadge);

  if (!locked && onCommitValue) {
    const quickBtns = el('div', 'ls-row');
    quickBtns.append(
      btn('+1 SP', () => {
        const next = { ...tree, sp: tree.sp + 1 };
        onCommitValue(serializeSkillTreeValue(next), `Granted +1 SP to ${schema.label}`);
      }, 'ls-btn-sm'),
    );
    topBar.append(quickBtns);
  }
  wrap.append(topBar);

  if (!tree.nodes.length) {
    wrap.append(
      el(
        'small',
        'ls-muted',
        'No skill nodes yet. Format: "SP: 2 | Slash (Lv.1/5, cost:1) ; Parry (Lv.0/3, cost:1, req:Slash)"',
      ),
    );
    return wrap;
  }

  const levelByName = new Map(tree.nodes.map(n => [n.name.toLowerCase(), n.level]));
  const grid = el('div', 'ls-rpg-skill-grid');

  for (const [idx, node] of tree.nodes.entries()) {
    const reqMet = !node.requires || (levelByName.get(node.requires.toLowerCase()) ?? 0) > 0;
    const isMaxed = node.level >= node.maxLevel;
    const canUpgrade = !locked && Boolean(onCommitValue) && reqMet && !isMaxed && tree.sp >= node.cost;

    const card = el('div', 'ls-rpg-skill-node');
    card.dataset.unlocked = String(node.level > 0);
    card.dataset.lockedReq = String(!reqMet);
    card.dataset.maxed = String(isMaxed);

    const head = el('div', 'ls-row-between');
    head.append(
      el('strong', '', `${isMaxed ? '★ ' : node.level > 0 ? '◆ ' : '◇ '}${node.name}`),
      el('span', 'ls-chip ls-chip-accent', `Lv.${node.level}/${node.maxLevel}`),
    );
    card.append(head);

    const pipTrack = el('div', 'ls-clock-bar');
    pipTrack.style.gridTemplateColumns = `repeat(${Math.min(10, node.maxLevel)}, 1fr)`;
    for (let p = 1; p <= Math.min(10, node.maxLevel); p++) {
      pipTrack.append(el('span', `ls-clock-seg${p <= node.level ? ' is-filled' : ''}`));
    }
    card.append(pipTrack);

    if (node.bonus || node.requires) {
      const subBits = [
        node.requires ? `${reqMet ? '✓' : '🔒'} Req: ${node.requires}` : '',
        node.bonus || '',
      ].filter(Boolean);
      card.append(el('small', 'ls-muted', subBits.join(' · ')));
    }

    if (!locked && onCommitValue) {
      const actRow = el('div', 'ls-row-between');
      actRow.append(el('small', 'ls-muted', isMaxed ? 'MASTERED' : `Cost: ${node.cost} SP`));
      const upgradeBtn = btn(
        isMaxed ? '✓ Max' : `+ Rank (${node.cost} SP)`,
        () => {
          const nextNodes = tree.nodes.map((n, i) =>
            i === idx ? { ...n, level: n.level + 1, unlocked: true } : n,
          );
          const nextTree: ParsedSkillTree = {
            sp: Math.max(0, tree.sp - node.cost),
            nodes: nextNodes,
          };
          onCommitValue(
            serializeSkillTreeValue(nextTree),
            `Upgraded ${node.name} to Lv.${node.level + 1}`,
          );
        },
        `ls-btn-sm ${canUpgrade ? 'ls-btn-primary' : ''}`,
      );
      upgradeBtn.disabled = !canUpgrade;
      actRow.append(upgradeBtn);
      card.append(actRow);
    }

    grid.append(card);
  }

  wrap.append(grid);
  return wrap;
}

/**
 * Parses `Lv. 4 | 320/500 XP | Rank B` or `{ level, xp, nextXp, rank }`
 */
export function parseXpLevelValue(raw: unknown): ParsedXpLevel {
  const str = String(raw ?? '').trim();
  const obj = tryParseJsonObj(str);
  if (obj && !Array.isArray(obj)) {
    const level = Math.max(1, Math.round(Number(obj.level ?? obj.lv ?? 1) || 1));
    const xp = Math.max(0, Math.round(Number(obj.xp ?? obj.current ?? 0) || 0));
    const nextXp = Math.max(1, Math.round(Number(obj.nextXp ?? obj.max ?? level * 100) || 100));
    return {
      level,
      xp,
      nextXp,
      ...(typeof obj.rank === 'string' && obj.rank.trim() ? { rank: obj.rank.trim() } : {}),
    };
  }

  const lvMatch = str.match(/(?:lv\.?|level)\s*(\d+)/i);
  const xpMatch = str.match(/(\d+)\s*\/\s*(\d+)\s*(?:xp)?/i);
  const rankMatch = str.match(/(?:rank|tier)\s*[:\-]?\s*([A-Za-z0-9+]+)/i);
  const level = Math.max(1, Number(lvMatch?.[1] ?? 1) || 1);
  const xp = Math.max(0, Number(xpMatch?.[1] ?? (Number(str) || 0)) || 0);
  const nextXp = Math.max(1, Number(xpMatch?.[2] ?? level * 100) || 100);
  return {
    level,
    xp,
    nextXp,
    ...(rankMatch?.[1] ? { rank: rankMatch[1] } : {}),
  };
}

export function renderXpLevelWidget(schema: StatSchemaDef, rawVal: unknown): HTMLElement {
  const parsed = parseXpLevelValue(rawVal);
  const pct = Math.max(0, Math.min(100, Math.round((parsed.xp / Math.max(1, parsed.nextXp)) * 100)));

  const wrap = el('div', 'ls-rpg-xp-wrap');
  const row = el('div', 'ls-row-between');
  const crest = el('span', 'ls-rpg-level-crest', `LV. ${parsed.level}`);
  const rightMeta = el('div', 'ls-row');
  if (parsed.rank) {
    rightMeta.append(el('span', 'ls-chip ls-chip-accent', `Rank ${parsed.rank}`));
  }
  rightMeta.append(el('small', 'ls-muted', `${parsed.xp.toLocaleString()} / ${parsed.nextXp.toLocaleString()} XP (${pct}%)`));
  row.append(crest, rightMeta);

  const track = el('div', 'ls-bar-track ls-rpg-xp-track');
  const fill = el('div', 'ls-bar-fill');
  fill.style.width = `${pct}%`;
  fill.style.setProperty('--ls-bar-color', schema.color || 'var(--ls-primary)');
  track.append(fill);

  wrap.append(row, track);
  return wrap;
}

/**
 * Parses `STR:16, DEX:14, CON:12, INT:15, WIS:10, CHA:18` or `{ STR: 16, ... }`
 */
export function parseAttributesValue(raw: unknown, defaultMax = 20): ParsedAttributeItem[] {
  const str = String(raw ?? '').trim();
  const obj = tryParseJsonObj(str);
  if (obj && !Array.isArray(obj)) {
    return Object.entries(obj)
      .filter(([, v]) => Number.isFinite(Number(v)))
      .map(([name, v]) => {
        const val = Number(v);
        return { name, value: val, max: Math.max(defaultMax, val) };
      });
  }

  const out: ParsedAttributeItem[] = [];
  for (const part of str.split(/[,;\n|]+/).map(s => s.trim()).filter(Boolean)) {
    const m = part.match(/^([A-Za-z0-9_ .-]{1,20})\s*[:=]\s*(-?\d+(?:\.\d+)?)(?:\s*\/\s*(\d+))?$/);
    if (m) {
      const val = Number(m[2]);
      const max = m[3] ? Math.max(1, Number(m[3])) : Math.max(defaultMax, val);
      out.push({ name: m[1]!.trim(), value: val, max });
    }
  }
  return out;
}

function buildAttributesRadarSvg(items: ParsedAttributeItem[], accentColor: string): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 220 190');
  svg.classList.add('ls-rpg-radar-svg');

  const cx = 110;
  const cy = 96;
  const radius = 62;
  const n = items.length;

  for (const ringScale of [0.33, 0.66, 1.0]) {
    const pts = items.map((_, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      return `${(cx + Math.cos(a) * radius * ringScale).toFixed(1)},${(cy + Math.sin(a) * radius * ringScale).toFixed(1)}`;
    });
    const poly = document.createElementNS(ns, 'polygon');
    poly.setAttribute('points', pts.join(' '));
    poly.setAttribute('fill', 'none');
    poly.setAttribute('stroke', 'rgba(148,163,184,0.28)');
    poly.setAttribute('stroke-width', '1');
    svg.append(poly);
  }

  const dataPts: string[] = [];
  items.forEach((item, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const ratio = Math.max(0.1, Math.min(1, item.value / Math.max(1, item.max)));
    const px = cx + Math.cos(a) * radius * ratio;
    const py = cy + Math.sin(a) * radius * ratio;
    dataPts.push(`${px.toFixed(1)},${py.toFixed(1)}`);

    const axis = document.createElementNS(ns, 'line');
    axis.setAttribute('x1', String(cx));
    axis.setAttribute('y1', String(cy));
    axis.setAttribute('x2', (cx + Math.cos(a) * radius).toFixed(1));
    axis.setAttribute('y2', (cy + Math.sin(a) * radius).toFixed(1));
    axis.setAttribute('stroke', 'rgba(148,163,184,0.22)');
    axis.setAttribute('stroke-width', '1');
    svg.append(axis);

    const lbl = document.createElementNS(ns, 'text');
    lbl.setAttribute('x', (cx + Math.cos(a) * (radius + 17)).toFixed(1));
    lbl.setAttribute('y', (cy + Math.sin(a) * (radius + 14) + 3).toFixed(1));
    lbl.setAttribute('text-anchor', 'middle');
    lbl.setAttribute('fill', 'currentColor');
    lbl.setAttribute('font-size', '9.5');
    lbl.setAttribute('font-weight', '700');
    lbl.textContent = `${item.name.slice(0, 6)} ${item.value}`;
    svg.append(lbl);
  });

  const area = document.createElementNS(ns, 'polygon');
  area.setAttribute('points', dataPts.join(' '));
  area.setAttribute('fill', accentColor);
  area.setAttribute('fill-opacity', '0.26');
  area.setAttribute('stroke', accentColor);
  area.setAttribute('stroke-width', '2');
  svg.append(area);

  return svg;
}

export function renderAttributesWidget(
  schema: StatSchemaDef,
  rawVal: unknown,
  scopeKey: string,
): HTMLElement {
  const items = parseAttributesValue(rawVal, schema.max > 0 ? schema.max : 20);
  const wrap = el('div', 'ls-stack');
  wrap.style.gap = '6px';

  if (!items.length) {
    wrap.append(el('small', 'ls-muted', String(rawVal || 'STR:10, DEX:10, INT:10, CHA:10')));
    return wrap;
  }

  const key = `${scopeKey}:${schema.id}`;
  let showRadar = radarToggleState.get(key) ?? false;
  const bodySlot = el('div');

  const draw = () => {
    bodySlot.replaceChildren();
    if (showRadar && items.length >= 3) {
      const radarWrap = el('div', 'ls-rpg-radar-box');
      radarWrap.append(buildAttributesRadarSvg(items, schema.color || 'var(--ls-primary)'));
      bodySlot.append(radarWrap);
      return;
    }

    const grid = el('div', 'ls-rpg-attr-grid');
    for (const item of items) {
      const box = el('div', 'ls-rpg-attr-cell');
      const mod = Math.floor((item.value - 10) / 2);
      const modText = item.max <= 30 ? (mod >= 0 ? `+${mod}` : String(mod)) : '';
      box.append(
        el('span', 'ls-kicker', item.name),
        el('strong', 'ls-rpg-attr-val', String(item.value)),
        ...(modText ? [el('small', 'ls-muted', `(${modText})`)] : []),
      );
      grid.append(box);
    }
    bodySlot.append(grid);
  };

  if (items.length >= 3) {
    const toggleRow = el('div', 'ls-row-between');
    toggleRow.append(
      el('small', 'ls-muted', `${items.length} Core Attributes`),
      btn(showRadar ? '⊞ Grid View' : '🕸️ Radar Chart', () => {
        showRadar = !showRadar;
        radarToggleState.set(key, showRadar);
        draw();
      }, 'ls-btn-sm'),
    );
    wrap.append(toggleRow);
  }

  draw();
  wrap.append(bodySlot);
  return wrap;
}

/**
 * Parses `Iron Blade [rare, equipped] ; Healing Potion x3 [common]`
 */
export function parseInventoryValue(raw: unknown): ParsedInventoryItem[] {
  const str = String(raw ?? '').trim();
  const obj = tryParseJsonObj(str);
  if (Array.isArray(obj)) {
    return (obj as Array<Record<string, unknown>>)
      .filter(it => it && typeof it === 'object' && it.name)
      .map(it => ({
        name: String(it.name),
        qty: Math.max(1, Number(it.qty ?? it.quantity ?? 1) || 1),
        rarity: normalizeRarity(String(it.rarity ?? 'common')),
        equipped: Boolean(it.equipped),
        ...(typeof it.note === 'string' ? { note: it.note } : {}),
      }));
  }

  const out: ParsedInventoryItem[] = [];
  for (const part of str.split(/\s*(?:;|\n|\|)\s*/).map(s => s.trim()).filter(Boolean)) {
    if (/^(?:none|empty)$/i.test(part)) continue;
    const bracketMatch = part.match(/^([^\[\]()]+?)(?:\s*x(\d+))?\s*(?:\[([^\]]+)\]|\(([^)]+)\))?$/i);
    const baseName = (bracketMatch?.[1] ?? part).trim();
    const qty = Math.max(1, Number(bracketMatch?.[2] ?? 1) || 1);
    const meta = (bracketMatch?.[3] ?? bracketMatch?.[4] ?? '').toLowerCase();
    const equipped = /\b(?:equipped|worn|active|main|offhand)\b/.test(meta);
    const rarity = normalizeRarity(meta);
    out.push({ name: baseName, qty, rarity, equipped });
  }
  return out;
}

function normalizeRarity(text: string): ParsedInventoryItem['rarity'] {
  if (/legendary|mythic|gold/.test(text)) return 'legendary';
  if (/epic|violet|purple/.test(text)) return 'epic';
  if (/rare|blue/.test(text)) return 'rare';
  if (/uncommon|green/.test(text)) return 'uncommon';
  return 'common';
}

export function renderInventoryWidget(rawVal: unknown): HTMLElement {
  const items = parseInventoryValue(rawVal);
  if (!items.length) {
    return el('small', 'ls-muted', 'Bag empty');
  }
  const grid = el('div', 'ls-rpg-loot-grid');
  for (const item of items) {
    const cell = el('div', 'ls-rpg-loot-card');
    cell.dataset.rarity = item.rarity;
    const top = el('div', 'ls-row-between');
    top.append(
      el('strong', '', `${item.equipped ? '⚔️ ' : '🎒 '}${item.name}`),
      el('span', 'ls-chip', item.qty > 1 ? `×${item.qty}` : item.rarity.toUpperCase()),
    );
    cell.append(top);
    if (item.equipped || item.rarity !== 'common') {
      cell.append(
        el(
          'small',
          'ls-muted',
          [item.equipped ? 'Equipped' : '', item.rarity !== 'common' ? item.rarity : '']
            .filter(Boolean)
            .join(' · '),
        ),
      );
    }
    grid.append(cell);
  }
  return grid;
}

/**
 * Parses `+Shielded (2t) ; -Burn (3t) ; Poisoned`
 */
export function parseStatusFxValue(raw: unknown): ParsedStatusEffect[] {
  const str = String(raw ?? '').trim();
  if (!str || /^(?:none|normal|healthy|clear)$/i.test(str)) return [];
  const out: ParsedStatusEffect[] = [];
  for (const part of str.split(/\s*(?:;|,|\n|\|)\s*/).map(s => s.trim()).filter(Boolean)) {
    let kind: ParsedStatusEffect['kind'] = 'neutral';
    let label = part;
    if (label.startsWith('+')) {
      kind = 'buff';
      label = label.slice(1).trim();
    } else if (label.startsWith('-')) {
      kind = 'debuff';
      label = label.slice(1).trim();
    } else if (/\b(?:burn|poison|bleed|stun|curse|tired|fluster|exhaust|wound|fear)\b/i.test(label)) {
      kind = 'debuff';
    } else if (/\b(?:shield|haste|bless|focus|regen|guard|inspir|armor|ward)\b/i.test(label)) {
      kind = 'buff';
    }
    const durMatch = label.match(/^(.+?)\s*\(([^)]+)\)$/);
    out.push({
      name: (durMatch?.[1] ?? label).trim(),
      kind,
      ...(durMatch?.[2] ? { duration: durMatch[2].trim() } : {}),
    });
  }
  return out;
}

export function renderStatusFxWidget(rawVal: unknown): HTMLElement {
  const fx = parseStatusFxValue(rawVal);
  if (!fx.length) {
    return el('small', 'ls-muted', 'No active effects');
  }
  const row = el('div', 'ls-row');
  for (const item of fx) {
    const pill = el(
      'span',
      'ls-rpg-fx-pill',
      `${item.kind === 'buff' ? '▲' : item.kind === 'debuff' ? '▼' : '●'} ${item.name}${item.duration ? ` (${item.duration})` : ''}`,
    );
    pill.dataset.fxKind = item.kind;
    row.append(pill);
  }
  return row;
}

export function renderHeartsWidget(
  schema: StatSchemaDef,
  val: number,
  isCalibrated: boolean,
  locked: boolean,
  onSet?: (nextVal: number) => void,
): HTMLElement {
  const maxHearts = Math.max(1, Math.min(10, schema.max || 5));
  const normalized =
    schema.max > 10
      ? Math.round((val / Math.max(1, schema.max)) * maxHearts)
      : Math.max(0, Math.min(maxHearts, Math.round(val)));

  const row = el('div', 'ls-row');
  for (let i = 1; i <= maxHearts; i++) {
    const filled = isCalibrated && i <= normalized;
    const b = btn(
      filled ? '❤️' : '🤍',
      () => {
        if (!locked && onSet) {
          const targetVal =
            schema.max > 10 ? Math.round(((i === normalized ? i - 1 : i) / maxHearts) * schema.max) : i === normalized ? i - 1 : i;
          onSet(targetVal);
        }
      },
      'ls-btn-sm ls-btn-icon ls-rpg-heart-btn',
      `${schema.label}: ${i}/${maxHearts}`,
    );
    b.disabled = locked || !onSet;
    row.append(b);
  }
  return row;
}

export function renderCurrencyWidget(
  schema: StatSchemaDef,
  val: number | string,
  delta: number,
): HTMLElement {
  const num = Number(val);
  const formatted = Number.isFinite(num) ? num.toLocaleString() : String(val);
  const row = el('div', 'ls-rpg-currency-box');
  row.append(el('strong', 'ls-rpg-currency-val', `${schema.icon} ${formatted}`));
  if (delta !== 0) {
    row.append(
      el(
        'span',
        `ls-delta ${delta > 0 ? 'is-pos' : 'is-neg'}`,
        delta > 0 ? `+${delta.toLocaleString()}` : delta.toLocaleString(),
      ),
    );
  }
  return row;
}
