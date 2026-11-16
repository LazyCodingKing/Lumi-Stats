import { inferBondCategory } from '../../shared/state-reducer';
import type {
  BondCategory,
  CharacterRecord,
  NpcBondRecord,
  RelationLink,
  StatSchemaDef,
} from '../../shared/types';
import { btn, el, type LumiFrontendController } from '../controller';

let pivotFocusId: 'player' | 'all' | string = 'player';
let bondDisplayMode: 'web' | 'cards' = 'web';

const BOND_CATEGORY_META: Record<
  BondCategory,
  { icon: string; label: string; color: string }
> = {
  family: { icon: '💛', label: 'Family', color: '#f59e0b' },
  friend: { icon: '💙', label: 'Friend / Ally', color: '#38bdf8' },
  romance: { icon: '🩷', label: 'Romance', color: '#f472b6' },
  rival: { icon: '❤️', label: 'Rival / Tense', color: '#f43f5e' },
  professional: { icon: '💼', label: 'Work / Duty', color: '#a78bfa' },
  neutral: { icon: '⚪', label: 'Acquaintance', color: '#94a3b8' },
};

const QUICK_RELATION_CHIPS = [
  'Best Friend',
  'Protective Sister',
  'Younger Brother',
  'Childhood Friend',
  'Trusted Ally',
  'Romantic Interest',
  'Partner / Lover',
  'Rival',
  'Suspicious Stranger',
  'Employer / Boss',
  'Loyal Retainer',
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase();
  }
  return (name.trim().slice(0, 2) || '?').toUpperCase();
}

function getNpcToPlayerBond(actor: CharacterRecord): RelationLink {
  if (actor.bondToPlayer?.label) {
    return {
      ...actor.bondToPlayer,
      category: actor.bondToPlayer.category ?? inferBondCategory(actor.bondToPlayer.label, actor.bondToPlayer.note),
    };
  }
  const fallback = actor.fields.bond_dynamic || actor.roleSummary || 'Acquaintance';
  return {
    label: fallback,
    category: inferBondCategory(fallback),
  };
}

function getPlayerToNpcBond(actor: CharacterRecord): RelationLink {
  if (actor.bondFromPlayer?.label) {
    return {
      ...actor.bondFromPlayer,
      category: actor.bondFromPlayer.category ?? inferBondCategory(actor.bondFromPlayer.label, actor.bondFromPlayer.note),
    };
  }
  return {
    label: 'Not defined yet',
    category: 'neutral',
  };
}

/**
 * Beginner-friendly modal to edit BOTH directions of `You ⇄ [NPC]` bonds
 * (your bond to them AND their bond to you) using real relation names.
 */
export function openPlayerBondEditorModal(
  ctrl: LumiFrontendController,
  actor: CharacterRecord,
): void {
  const youName = ctrl.snapshot.state.player.name || 'You';
  const curYouToNpc = getPlayerToNpcBond(actor);
  const curNpcToYou = getNpcToPlayerBond(actor);

  ctrl.modals.open(
    { title: `🔗 Edit Bond: ${youName} ⇄ ${actor.name}`, width: 560 },
    (body, close) => {
      const youWrap = el('label', 'ls-label', `Your Bond to ${actor.name} (${youName} → ${actor.name})`);
      const youInp = el('input', 'ls-input');
      youInp.placeholder = `e.g. Younger Brother, Best Friend, Wary Ally…`;
      youInp.value = curYouToNpc.label === 'Not defined yet' ? '' : curYouToNpc.label;
      youWrap.append(youInp);

      const youChips = el('div', 'ls-row');
      for (const chipTxt of QUICK_RELATION_CHIPS.slice(0, 6)) {
        youChips.append(
          btn(chipTxt, () => {
            youInp.value = chipTxt;
          }, 'ls-btn-sm ls-quick-pill'),
        );
      }
      youWrap.append(youChips);

      const youNoteWrap = el('label', 'ls-label', `Why / Note for ${youName} → ${actor.name} (Optional)`);
      const youNoteInp = el('input', 'ls-input');
      youNoteInp.placeholder = `e.g. Relies on her for advice…`;
      youNoteInp.value = curYouToNpc.note ?? '';
      youNoteWrap.append(youNoteInp);

      const npcWrap = el('label', 'ls-label', `${actor.name}'s Bond to You (${actor.name} → ${youName})`);
      const npcInp = el('input', 'ls-input');
      npcInp.placeholder = `e.g. Protective Elder Sister, Strict Boss…`;
      npcInp.value = curNpcToYou.label;
      npcWrap.append(npcInp);

      const npcChips = el('div', 'ls-row');
      for (const chipTxt of QUICK_RELATION_CHIPS.slice(0, 6)) {
        npcChips.append(
          btn(chipTxt, () => {
            npcInp.value = chipTxt;
          }, 'ls-btn-sm ls-quick-pill'),
        );
      }
      npcWrap.append(npcChips);

      const npcNoteWrap = el('label', 'ls-label', `Why / Note for ${actor.name} → ${youName} (Optional)`);
      const npcNoteInp = el('input', 'ls-input');
      npcNoteInp.placeholder = `e.g. Secretly worries about you…`;
      npcNoteInp.value = curNpcToYou.note ?? '';
      npcNoteWrap.append(npcNoteInp);

      let selectedCat: BondCategory =
        curNpcToYou.category ?? curYouToNpc.category ?? 'neutral';
      const catWrap = el('div', 'ls-label', 'Bond Type / Color');
      const catRow = el('div', 'ls-row');
      const syncCat = () => {
        for (const b of [...catRow.querySelectorAll<HTMLButtonElement>('button')]) {
          b.setAttribute('aria-current', b.dataset.cat === selectedCat ? 'page' : 'false');
        }
      };
      for (const [catKey, meta] of Object.entries(BOND_CATEGORY_META) as Array<
        [BondCategory, { icon: string; label: string; color: string }]
      >) {
        const b = btn(`${meta.icon} ${meta.label}`, () => {
          selectedCat = catKey;
          syncCat();
        }, 'ls-btn-sm');
        b.dataset.cat = catKey;
        catRow.append(b);
      }
      syncCat();
      catWrap.append(catRow);

      const saveBtn = btn('💾 Save Two-Way Bond', () => {
        const fromLabel = youInp.value.trim();
        const toLabel = npcInp.value.trim() || actor.roleSummary || 'Acquaintance';
        void ctrl.request('state:mutate', {
          patch: {
            characters: [
              {
                id: actor.id,
                name: actor.name,
                roleSummary: toLabel,
                bondToPlayer: {
                  label: toLabel,
                  ...(npcNoteInp.value.trim() ? { note: npcNoteInp.value.trim() } : {}),
                  category: selectedCat,
                },
                ...(fromLabel
                  ? {
                      bondFromPlayer: {
                        label: fromLabel,
                        ...(youNoteInp.value.trim() ? { note: youNoteInp.value.trim() } : {}),
                        category: selectedCat,
                      },
                    }
                  : {}),
              },
            ],
          },
          reason: `Updated bond ${youName} ⇄ ${actor.name}`,
        });
        close();
      }, 'ls-btn-primary');

      body.append(youWrap, youNoteWrap, npcWrap, npcNoteWrap, catWrap, saveBtn);
    },
  );
}

/**
 * Keeps the exported signature `openNpcBondEditorModal(ctrl, sourceActor, existingBond)`
 * for CastDossier compatibility while editing real relation names & categories.
 */
function getTemplateCharBondSchemas(schemas: StatSchemaDef[]): StatSchemaDef[] {
  return schemas.filter(
    s =>
      s.enabled &&
      s.scope === 'character' &&
      ['meter', 'number', 'clock', 'pips', 'hearts', 'currency'].includes(s.kind) &&
      !(s.displayStyle && s.displayStyle !== 'auto'),
  );
}

function renderDynamicPeerBondMeters(
  meters: Record<string, number | string | boolean> | undefined,
  charSchemas: StatSchemaDef[],
): HTMLElement | null {
  if (!meters) return null;
  const schemaMap = new Map(charSchemas.map(s => [s.id, s]));
  const entries = Object.entries(meters).filter(([k, v]) => {
    const schema = schemaMap.get(k);
    if (!schema || !schema.enabled) return false;
    return v !== undefined && v !== '' && v !== 'None';
  });
  if (!entries.length) return null;

  const grid = el('div', 'ls-cast-mini-grid');
  grid.style.marginTop = '4px';
  for (const [mKey, mVal] of entries) {
    const schema = schemaMap.get(mKey)!;
    const cell = el('div', 'ls-cast-mini-meter');
    cell.style.setProperty('--ls-bar-color', schema.color || 'var(--ls-primary)');
    const top = el('div', 'ls-row-between');
    top.append(
      el('small', 'ls-muted', `${schema.icon} ${schema.label}`),
      el('strong', '', String(mVal)),
    );
    cell.append(top);

    if (typeof mVal === 'number') {
      const span = Math.max(1, schema.max - schema.min);
      const track = el('div', 'ls-bar-track');
      const fill = el('div', 'ls-bar-fill');
      if (schema.min < 0 && schema.max > 0) {
        track.dataset.bipolar = 'true';
        const zeroPct = ((0 - schema.min) / span) * 100;
        if (mVal >= 0) {
          fill.style.marginLeft = `${zeroPct.toFixed(1)}%`;
          fill.style.width = `${Math.min(100 - zeroPct, (mVal / schema.max) * (100 - zeroPct)).toFixed(1)}%`;
        } else {
          const wPct = (Math.abs(mVal) / Math.abs(schema.min)) * zeroPct;
          fill.style.marginLeft = `${Math.max(0, zeroPct - wPct).toFixed(1)}%`;
          fill.style.width = `${Math.min(zeroPct, wPct).toFixed(1)}%`;
          fill.style.background = 'var(--ls-danger)';
        }
      } else {
        const pct = Math.max(0, Math.min(100, Math.round(((mVal - schema.min) / span) * 100)));
        fill.style.width = `${pct}%`;
      }
      track.append(fill);
      cell.append(track);
    }
    grid.append(cell);
  }
  return grid;
}

export function openNpcBondEditorModal(
  ctrl: LumiFrontendController,
  sourceActor: CharacterRecord,
  existingBond?: NpcBondRecord,
): void {
  const { state, template } = ctrl.snapshot;
  const otherActors = Object.values(state.characters).filter(c => c.id !== sourceActor.id);
  const charSchemas = getTemplateCharBondSchemas(template.stats);

  ctrl.modals.open(
    {
      title: existingBond
        ? `🤝 Edit NPC Bond: ${sourceActor.name} ⇄ ${existingBond.toName}`
        : `➕ Add Bond from ${sourceActor.name} to Another NPC`,
      width: 560,
    },
    (body, close) => {
      const targetWrap = el('label', 'ls-label', `Other Character (${sourceActor.name} → ?)`);
      const targetInp = el('input', 'ls-input');
      targetInp.placeholder = otherActors.length
        ? `e.g. ${otherActors.map(a => a.name).join(', ')} or another NPC name`
        : 'Enter NPC name…';
      targetInp.value = existingBond?.toName ?? (otherActors[0]?.name ?? '');
      targetWrap.append(targetInp);

      if (otherActors.length > 0) {
        const quickRow = el('div', 'ls-row');
        for (const peer of otherActors) {
          quickRow.append(
            btn(`👤 ${peer.name}`, () => {
              targetInp.value = peer.name;
            }, 'ls-btn-sm'),
          );
        }
        targetWrap.append(quickRow);
      }

      const labelWrap = el('label', 'ls-label', `${sourceActor.name}'s Relation to Them`);
      const labelInp = el('input', 'ls-input');
      labelInp.placeholder = 'e.g. Older Sister, Ex-Fiancé, Rival, Boss…';
      labelInp.value = existingBond?.label ?? '';
      labelWrap.append(labelInp);

      const chipRow = el('div', 'ls-row');
      for (const chipTxt of QUICK_RELATION_CHIPS.slice(0, 6)) {
        chipRow.append(
          btn(chipTxt, () => {
            labelInp.value = chipTxt;
          }, 'ls-btn-sm ls-quick-pill'),
        );
      }
      labelWrap.append(chipRow);

      const attWrap = el('label', 'ls-label', `Why / Dynamic Note (Optional)`);
      const attInp = el('input', 'ls-input');
      attInp.placeholder = 'e.g. Still bitter about what happened last summer…';
      attInp.value = existingBond?.attitude ?? '';
      attWrap.append(attInp);

      const peerActor = existingBond ? state.characters[existingBond.toId] : otherActors[0];
      const reverseExisting = peerActor?.peerBonds?.[sourceActor.id];

      const fwdMeterInputs = new Map<string, HTMLInputElement>();
      if (charSchemas.length > 0) {
        const fwdGridWrap = el('div', 'ls-label', `${sourceActor.name}'s Stats Toward Them`);
        const fwdGrid = el('div', 'ls-grid');
        for (const schema of charSchemas) {
          const curVal = existingBond?.meters?.[schema.id] ?? schema.defaultValue;
          const wrapCell = el('label', 'ls-label', `${schema.icon} ${schema.label} (${schema.min}..${schema.max})`);
          const inp = el('input', 'ls-input');
          inp.type = 'number';
          inp.min = String(schema.min);
          inp.max = String(schema.max);
          inp.step = String(schema.step || 1);
          inp.value = String(typeof curVal === 'number' ? curVal : schema.defaultValue);
          wrapCell.append(inp);
          fwdGrid.append(wrapCell);
          fwdMeterInputs.set(schema.id, inp);
        }
        fwdGridWrap.append(fwdGrid);
        body.append(fwdGridWrap);
      }

      const revLabelWrap = el('label', 'ls-label', `Their Relation Back to ${sourceActor.name} (Optional)`);
      const revLabelInp = el('input', 'ls-input');
      revLabelInp.placeholder = 'e.g. Younger Brother, Loyal Friend…';
      revLabelInp.value = reverseExisting?.label ?? '';
      revLabelWrap.append(revLabelInp);

      const revMeterInputs = new Map<string, HTMLInputElement>();
      if (charSchemas.length > 0) {
        const revGridWrap = el('div', 'ls-label', `Their Stats Back Toward ${sourceActor.name} (Optional)`);
        const revGrid = el('div', 'ls-grid');
        for (const schema of charSchemas) {
          const curVal = reverseExisting?.meters?.[schema.id] ?? schema.defaultValue;
          const wrapCell = el('label', 'ls-label', `${schema.icon} ${schema.label} (${schema.min}..${schema.max})`);
          const inp = el('input', 'ls-input');
          inp.type = 'number';
          inp.min = String(schema.min);
          inp.max = String(schema.max);
          inp.step = String(schema.step || 1);
          inp.value = String(typeof curVal === 'number' ? curVal : schema.defaultValue);
          wrapCell.append(inp);
          revGrid.append(wrapCell);
          revMeterInputs.set(schema.id, inp);
        }
        revGridWrap.append(revGrid);
        revLabelWrap.append(revGridWrap);
      }

      let selectedCat: BondCategory =
        existingBond?.category ??
        inferBondCategory(existingBond?.label ?? '', existingBond?.attitude ?? '');
      const catWrap = el('div', 'ls-label', 'Bond Type / Color');
      const catRow = el('div', 'ls-row');
      const syncCat = () => {
        for (const b of [...catRow.querySelectorAll<HTMLButtonElement>('button')]) {
          b.setAttribute('aria-current', b.dataset.cat === selectedCat ? 'page' : 'false');
        }
      };
      for (const [catKey, meta] of Object.entries(BOND_CATEGORY_META) as Array<
        [BondCategory, { icon: string; label: string; color: string }]
      >) {
        const b = btn(`${meta.icon} ${meta.label}`, () => {
          selectedCat = catKey;
          syncCat();
        }, 'ls-btn-sm');
        b.dataset.cat = catKey;
        catRow.append(b);
      }
      syncCat();
      catWrap.append(catRow);

      const saveBtn = btn('💾 Save NPC Bond', () => {
        const targetName = targetInp.value.trim();
        if (!targetName) return;
        const label = labelInp.value.trim() || 'Acquaintance';
        const attitude = attInp.value.trim();
        const fwdMeters: Record<string, number> = {};
        for (const schema of charSchemas) {
          const raw = Number(fwdMeterInputs.get(schema.id)?.value);
          if (Number.isFinite(raw)) {
            fwdMeters[schema.id] = Math.max(schema.min, Math.min(schema.max, Math.round(raw)));
          }
        }
        const charactersPatch: Array<{
          id?: string;
          name: string;
          peerBonds: Array<{
            target: string;
            label: string;
            attitude: string;
            category: BondCategory;
            meters?: Record<string, number>;
          }>;
        }> = [
          {
            id: sourceActor.id,
            name: sourceActor.name,
            peerBonds: [{ target: targetName, label, attitude, category: selectedCat, meters: fwdMeters }],
          },
        ];

        const revLabel = revLabelInp.value.trim();
        if (revLabel) {
          const revMeters: Record<string, number> = {};
          for (const schema of charSchemas) {
            const raw = Number(revMeterInputs.get(schema.id)?.value);
            if (Number.isFinite(raw)) {
              revMeters[schema.id] = Math.max(schema.min, Math.min(schema.max, Math.round(raw)));
            }
          }
          charactersPatch.push({
            name: targetName,
            peerBonds: [
              {
                target: sourceActor.name,
                label: revLabel,
                attitude: reverseExisting?.attitude ?? '',
                category: selectedCat,
                meters: revMeters,
              },
            ],
          });
        }

        void ctrl.request('state:mutate', {
          patch: { characters: charactersPatch },
          reason: `Updated bond ${sourceActor.name} ⇄ ${targetName}`,
        });
        close();
      }, 'ls-btn-primary');

      body.append(targetWrap, labelWrap, attWrap, revLabelWrap, catWrap, saveBtn);
    },
  );
}

/**
 * Rebuilt Beginner-Friendly Bond Web:
 * - Shows actual relationship names (`You → NPC` & `NPC → You`, plus `NPC A ↔ NPC B`), NEVER raw affection numbers.
 * - Click **You** or **any NPC** in the Pivot Bar to re-center the visual web on their two-way bonds, or view **Full Cast Web**.
 * - Includes clean **Two-Way Bond Cards** below the graph so every relationship is unmistakable.
 */
export function renderRelationshipWebSurface(
  ctrl: LumiFrontendController,
  onOpenDossier: (actorId: string) => void,
): HTMLElement {
  const { state, template } = ctrl.snapshot;
  const charBondSchemas = getTemplateCharBondSchemas(template.stats);
  const wrap = el('div', 'ls-stack');
  const characters = Object.values(state.characters);
  const youName = state.player.name || 'You';

  if (pivotFocusId !== 'player' && pivotFocusId !== 'all' && !state.characters[pivotFocusId]) {
    pivotFocusId = 'player';
  }

  // 1. Top Pivot Bar + View Switcher
  const topBar = el('div', 'ls-row-between');
  const pivotRow = el('div', 'ls-row');
  pivotRow.append(el('span', 'ls-kicker', 'Focus:'));

  const youBtn = btn(`👤 ${youName}`, () => {
    pivotFocusId = 'player';
    ctrl.emitChange();
  }, 'ls-btn-sm');
  if (pivotFocusId === 'player') youBtn.setAttribute('aria-current', 'page');
  pivotRow.append(youBtn);

  for (const c of characters) {
    const b = btn(`${c.present ? '🟢' : '⚪'} ${c.name}`, () => {
      pivotFocusId = c.id;
      ctrl.selectedActorId = c.id;
      ctrl.emitChange();
    }, 'ls-btn-sm');
    if (pivotFocusId === c.id) b.setAttribute('aria-current', 'page');
    pivotRow.append(b);
  }

  if (characters.length >= 2) {
    const allBtn = btn('🕸️ Full Web', () => {
      pivotFocusId = 'all';
      ctrl.emitChange();
    }, 'ls-btn-sm');
    if (pivotFocusId === 'all') allBtn.setAttribute('aria-current', 'page');
    pivotRow.append(allBtn);
  }

  const rightBtns = el('div', 'ls-row');
  rightBtns.append(
    btn(
      bondDisplayMode === 'web' ? '📋 Cards Only' : '🕸️ Show Map',
      () => {
        bondDisplayMode = bondDisplayMode === 'web' ? 'cards' : 'web';
        ctrl.emitChange();
      },
      'ls-btn-sm',
    ),
  );
  if (characters.length > 0) {
    const targetForAdd =
      (pivotFocusId !== 'player' && pivotFocusId !== 'all' ? state.characters[pivotFocusId] : undefined) ??
      (ctrl.selectedActorId ? state.characters[ctrl.selectedActorId] : undefined) ??
      characters[0]!;
    rightBtns.append(
      btn(`+ Add NPC Bond`, () => openNpcBondEditorModal(ctrl, targetForAdd), 'ls-btn-sm ls-btn-primary'),
    );
  }
  topBar.append(pivotRow, rightBtns);
  wrap.append(topBar);

  if (!characters.length) {
    const empty = el('div', 'ls-card');
    empty.append(
      el('strong', '', 'Bond Web Ready'),
      el('p', 'ls-muted', 'Once characters appear in chat, your two-way relations with them and their relations with each other will appear here.'),
    );
    wrap.append(empty);
    return wrap;
  }

  // 2. Plain-English Category Legend (No numeric scores)
  const legendBar = el('div', 'ls-web-legend');
  const legendItems = el('div', 'ls-row');
  for (const meta of Object.values(BOND_CATEGORY_META)) {
    const item = el('span', 'ls-web-legend-item');
    const dot = el('span', 'ls-web-swatch');
    dot.style.background = meta.color;
    item.append(dot, document.createTextNode(`${meta.icon} ${meta.label}`));
    legendItems.append(item);
  }
  legendBar.append(legendItems);
  wrap.append(legendBar);

  // 3. Visual Relation-First Pivot Web
  if (bondDisplayMode === 'web') {
    interface WebNode {
      id: string;
      name: string;
      isPlayer: boolean;
      present: boolean;
      portraitUrl?: string;
      xPct: number;
      yPct: number;
      color: string;
    }

    const stage = el('div', 'ls-bw-stage');
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.classList.add('ls-bw-svg');

    const nodes: WebNode[] = [];

    if (pivotFocusId === 'player') {
      nodes.push({
        id: 'player',
        name: youName,
        isPlayer: true,
        present: true,
        xPct: 50,
        yPct: characters.length === 1 ? 18 : 50,
        color: '#38bdf8',
      });
      characters.forEach((c, idx) => {
        const npcToYou = getNpcToPlayerBond(c);
        const catMeta = BOND_CATEGORY_META[npcToYou.category ?? 'neutral'];
        let xPct = 50;
        let yPct = 82;
        if (characters.length === 1) {
          xPct = 50;
          yPct = 82;
        } else if (characters.length === 2) {
          xPct = idx === 0 ? 15 : 85;
          yPct = 50;
        } else {
          const angle = (idx / characters.length) * Math.PI * 2 - Math.PI / 2;
          xPct = 50 + Math.cos(angle) * 38;
          yPct = 50 + Math.sin(angle) * 35;
        }
        nodes.push({
          id: c.id,
          name: c.name,
          isPlayer: false,
          present: c.present,
          portraitUrl: c.portraitUrl,
          xPct: Number(xPct.toFixed(1)),
          yPct: Number(yPct.toFixed(1)),
          color: catMeta.color,
        });
      });
    } else if (pivotFocusId !== 'all' && state.characters[pivotFocusId]) {
      const focal = state.characters[pivotFocusId]!;
      const others: Array<{ id: string; name: string; isPlayer: boolean; present: boolean; portraitUrl?: string }> = [
        { id: 'player', name: youName, isPlayer: true, present: true },
        ...characters
          .filter(c => c.id !== focal.id)
          .map(c => ({ id: c.id, name: c.name, isPlayer: false, present: c.present, portraitUrl: c.portraitUrl })),
      ];
      nodes.push({
        id: focal.id,
        name: focal.name,
        isPlayer: false,
        present: focal.present,
        portraitUrl: focal.portraitUrl,
        xPct: 50,
        yPct: others.length === 1 ? 18 : 50,
        color: '#38bdf8',
      });
      others.forEach((other, idx) => {
        let xPct = 50;
        let yPct = 82;
        if (others.length === 1) {
          xPct = 50;
          yPct = 82;
        } else if (others.length === 2) {
          xPct = idx === 0 ? 15 : 85;
          yPct = 50;
        } else {
          const angle = (idx / others.length) * Math.PI * 2 - Math.PI / 2;
          xPct = 50 + Math.cos(angle) * 38;
          yPct = 50 + Math.sin(angle) * 35;
        }
        const cat = other.isPlayer
          ? getNpcToPlayerBond(focal).category ?? 'neutral'
          : focal.peerBonds?.[other.id]?.category ?? state.characters[other.id]?.peerBonds?.[focal.id]?.category ?? 'neutral';
        nodes.push({
          id: other.id,
          name: other.name,
          isPlayer: other.isPlayer,
          present: other.present,
          portraitUrl: other.portraitUrl,
          xPct: Number(xPct.toFixed(1)),
          yPct: Number(yPct.toFixed(1)),
          color: BOND_CATEGORY_META[cat].color,
        });
      });
    } else {
      const allRing = [
        { id: 'player', name: youName, isPlayer: true, present: true, portraitUrl: undefined },
        ...characters.map(c => ({
          id: c.id,
          name: c.name,
          isPlayer: false,
          present: c.present,
          portraitUrl: c.portraitUrl,
        })),
      ];
      allRing.forEach((item, idx) => {
        const angle = (idx / allRing.length) * Math.PI * 2 - Math.PI / 2;
        const xPct = 50 + Math.cos(angle) * 37;
        const yPct = 50 + Math.sin(angle) * 35;
        const actor = item.isPlayer ? undefined : state.characters[item.id];
        const cat = actor ? getNpcToPlayerBond(actor).category ?? 'neutral' : 'friend';
        nodes.push({
          id: item.id,
          name: item.name,
          isPlayer: item.isPlayer,
          present: item.present,
          portraitUrl: item.portraitUrl,
          xPct: Number(xPct.toFixed(1)),
          yPct: Number(yPct.toFixed(1)),
          color: BOND_CATEGORY_META[cat].color,
        });
      });
    }

    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    const drawRelationLink = (
      from: WebNode,
      to: WebNode,
      color: string,
      lines: string[],
      titleHint: string,
      onClickPill: () => void,
      curve = 0,
    ) => {
      const mx = (from.xPct + to.xPct) / 2;
      const my = (from.yPct + to.yPct) / 2;
      const dx = to.xPct - from.xPct;
      const dy = to.yPct - from.yPct;
      const len = Math.max(1, Math.hypot(dx, dy));
      const cx = mx + (-dy / len) * curve;
      const cy = my + (dx / len) * curve;

      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', `M ${from.xPct} ${from.yPct} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${to.xPct} ${to.yPct}`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', color);
      path.setAttribute('stroke-width', '0.8');
      path.setAttribute('stroke-opacity', '0.82');
      svg.append(path);

      if (lines.length > 0) {
        // True quadratic Bezier midpoint at t=0.5 prevents overlap with node circles
        const qx = 0.25 * from.xPct + 0.5 * cx + 0.25 * to.xPct;
        const qy = 0.25 * from.yPct + 0.5 * cy + 0.25 * to.yPct;
        const pill = el('div', 'ls-bw-edge-pill');
        pill.style.setProperty('--ls-bond-color', color);
        pill.style.left = `${Math.max(15, Math.min(85, qx)).toFixed(1)}%`;
        pill.style.top = `${Math.max(14, Math.min(86, qy)).toFixed(1)}%`;
        pill.title = titleHint;
        for (const l of lines) {
          pill.append(el('span', 'ls-bw-edge-line', l));
        }
        pill.addEventListener('click', e => {
          e.stopPropagation();
          onClickPill();
        });
        stage.append(pill);
      }
    };

    const drawYouNpcPair = (actor: CharacterRecord, pNode: WebNode, aNode: WebNode, compactText: boolean) => {
      const npcToYou = getNpcToPlayerBond(actor);
      const youToNpc = getPlayerToNpcBond(actor);
      const cat = npcToYou.category ?? youToNpc.category ?? 'neutral';
      const color = BOND_CATEGORY_META[cat].color;
      const summaryLabel =
        npcToYou.label && npcToYou.label !== 'Acquaintance'
          ? npcToYou.label
          : youToNpc.label !== 'Not defined yet'
            ? youToNpc.label
            : npcToYou.label;
      const lines = [summaryLabel];
      const fullHint = `You → ${actor.name}: ${youToNpc.label}\n${actor.name} → You: ${npcToYou.label}`;
      drawRelationLink(
        pNode,
        aNode,
        color,
        lines,
        fullHint,
        () => openPlayerBondEditorModal(ctrl, actor),
        compactText ? -8 : 0,
      );
    };

    if (pivotFocusId === 'player') {
      const pNode = nodeMap.get('player')!;
      for (const actor of characters) {
        const aNode = nodeMap.get(actor.id);
        if (aNode) drawYouNpcPair(actor, pNode, aNode, false);
      }
    } else if (pivotFocusId !== 'all' && state.characters[pivotFocusId]) {
      const focal = state.characters[pivotFocusId]!;
      const fNode = nodeMap.get(focal.id)!;
      const pNode = nodeMap.get('player');
      if (pNode) drawYouNpcPair(focal, pNode, fNode, false);

      for (const other of characters) {
        if (other.id === focal.id) continue;
        const oNode = nodeMap.get(other.id);
        if (!oNode) continue;
        const aToB = focal.peerBonds?.[other.id];
        const bToA = other.peerBonds?.[focal.id];
        if (!aToB && !bToA) continue;
        const cat = aToB?.category ?? bToA?.category ?? 'neutral';
        const lines = [
          aToB ? `${focal.name} → ${other.name}: ${aToB.label}` : '',
          bToA ? `${other.name} → ${focal.name}: ${bToA.label}` : '',
        ].filter(Boolean);
        const shortPeer = aToB?.label || bToA?.label || 'Acquaintance';
        drawRelationLink(
          fNode,
          oNode,
          BOND_CATEGORY_META[cat].color,
          [shortPeer],
          lines.join('\n'),
          () => openNpcBondEditorModal(ctrl, focal, aToB),
          0,
        );
      }
    } else {
      const pNode = nodeMap.get('player')!;
      for (const actor of characters) {
        const aNode = nodeMap.get(actor.id);
        if (aNode) drawYouNpcPair(actor, pNode, aNode, true);
      }
      const seenPairs = new Set<string>();
      for (const actor of characters) {
        const aNode = nodeMap.get(actor.id);
        if (!aNode) continue;
        for (const bond of Object.values(actor.peerBonds ?? {})) {
          const bNode = nodeMap.get(bond.toId);
          if (!bNode) continue;
          const pairKey = [actor.id, bond.toId].sort().join('::');
          if (seenPairs.has(pairKey)) continue;
          seenPairs.add(pairKey);
          const rev = state.characters[bond.toId]?.peerBonds?.[actor.id];
          const cat = bond.category ?? rev?.category ?? 'neutral';
          const hintLines = [
            `${actor.name} → ${bond.toName}: ${bond.label}`,
            ...(rev ? [`${bond.toName} → ${actor.name}: ${rev.label}`] : []),
          ];
          drawRelationLink(
            aNode,
            bNode,
            BOND_CATEGORY_META[cat].color,
            [bond.label || rev?.label || 'Peer'],
            hintLines.join('\n'),
            () => openNpcBondEditorModal(ctrl, actor, bond),
            16,
          );
        }
      }
    }

    stage.prepend(svg);

    for (const node of nodes) {
      const isFocal = node.id === pivotFocusId;
      const btnEl = el('button', 'ls-bw-node');
      btnEl.type = 'button';
      btnEl.dataset.focal = String(isFocal);
      btnEl.style.left = `${node.xPct}%`;
      btnEl.style.top = `${node.yPct}%`;
      btnEl.style.setProperty('--ls-bond-color', node.color);
      btnEl.title = `Click to focus ${node.name}'s bonds`;

      const av = el('div', 'ls-bw-avatar');
      if (node.portraitUrl) {
        const img = el('img');
        img.src = node.portraitUrl;
        img.alt = node.name;
        av.append(img);
      } else {
        av.append(document.createTextNode(node.isPlayer ? '👤' : getInitials(node.name)));
      }
      if (!node.isPlayer) {
        av.append(el('span', `ls-roster-dot ${node.present ? 'is-present' : 'is-away'}`));
      }

      btnEl.append(av, el('span', 'ls-bw-name', node.name));
      btnEl.addEventListener('click', () => {
        pivotFocusId = node.isPlayer ? 'player' : node.id;
        if (!node.isPlayer) ctrl.selectedActorId = node.id;
        ctrl.emitChange();
      });
      stage.append(btnEl);
    }

    wrap.append(stage);
  }

  // 4. Easy-to-Read Two-Way Bond Cards (`You ⇄ NPC` and `NPC A ⇄ NPC B`)
  const targetChars =
    pivotFocusId !== 'player' && pivotFocusId !== 'all' && state.characters[pivotFocusId]
      ? [state.characters[pivotFocusId]!]
      : characters;

  // 4A. Your Two-Way Bonds with Each Character (`You ⇄ NPC`)
  const playerSection = el('div', 'ls-stack');
  playerSection.append(el('span', 'ls-kicker', `👤 Your Bonds (${youName} ⇄ Cast)`));

  for (const actor of targetChars) {
    const npcToYou = getNpcToPlayerBond(actor);
    const youToNpc = getPlayerToNpcBond(actor);
    const cat = npcToYou.category ?? youToNpc.category ?? 'neutral';
    const meta = BOND_CATEGORY_META[cat];

    const pairCard = el('div', 'ls-bw-pair-card');
    pairCard.style.setProperty('--ls-bond-color', meta.color);

    const head = el('div', 'ls-row-between');
    const leftTitle = el('div', 'ls-row');
    leftTitle.append(
      el('strong', '', `${youName} ⇄ ${actor.name}`),
      el('span', 'ls-bw-cat-chip', `${meta.icon} ${meta.label}`),
    );
    (leftTitle.lastElementChild as HTMLElement).style.setProperty('--ls-bond-color', meta.color);

    const rightActs = el('div', 'ls-row');
    rightActs.append(
      btn('✏️ Edit Bond', () => openPlayerBondEditorModal(ctrl, actor), 'ls-btn-sm'),
      btn('🪪 Dossier', () => onOpenDossier(actor.id), 'ls-btn-sm ls-btn-primary'),
    );
    head.append(leftTitle, rightActs);
    pairCard.append(head);

    const twoCol = el('div', 'ls-bw-two-col');

    const youBox = el('div', 'ls-bw-dir-box');
    youBox.append(
      el('small', 'ls-kicker', `Your Bond → ${actor.name}`),
      el('strong', '', youToNpc.label),
      ...(youToNpc.note ? [el('small', 'ls-muted', youToNpc.note)] : []),
    );

    const npcBox = el('div', 'ls-bw-dir-box');
    npcBox.append(
      el('small', 'ls-kicker', `${actor.name}'s Bond → You`),
      el('strong', '', npcToYou.label),
      ...(npcToYou.note ? [el('small', 'ls-muted', npcToYou.note)] : []),
    );

    twoCol.append(youBox, npcBox);
    pairCard.append(twoCol);
    playerSection.append(pairCard);
  }
  wrap.append(playerSection);

  // 4B. Mutual NPC ↔ NPC Bonds (`NPC A ⇄ NPC B`)
  const peerPairs: Array<{ a: CharacterRecord; b: CharacterRecord; aToB?: NpcBondRecord; bToA?: NpcBondRecord }> = [];
  const seenPeerPairs = new Set<string>();

  for (const actorA of targetChars) {
    for (const [targetId, bondAB] of Object.entries(actorA.peerBonds ?? {})) {
      const actorB = state.characters[targetId];
      if (!actorB) continue;
      const key = [actorA.id, actorB.id].sort().join('::');
      if (seenPeerPairs.has(key)) continue;
      seenPeerPairs.add(key);
      peerPairs.push({
        a: actorA,
        b: actorB,
        aToB: bondAB,
        bToA: actorB.peerBonds?.[actorA.id],
      });
    }
    for (const other of characters) {
      if (other.id === actorA.id) continue;
      const bondBA = other.peerBonds?.[actorA.id];
      if (!bondBA) continue;
      const key = [actorA.id, other.id].sort().join('::');
      if (seenPeerPairs.has(key)) continue;
      seenPeerPairs.add(key);
      peerPairs.push({
        a: actorA,
        b: other,
        aToB: actorA.peerBonds?.[other.id],
        bToA: bondBA,
      });
    }
  }

  const npcSection = el('div', 'ls-stack');
  npcSection.append(el('span', 'ls-kicker', `🤝 Cast Bonds (NPC ⇄ NPC · ${peerPairs.length})`));

  if (!peerPairs.length) {
    npcSection.append(
      el(
        'p',
        'ls-muted',
        'No NPC-to-NPC bonds recorded yet. They appear automatically when characters have an established relation in the story, or click "+ Add NPC Bond" above.',
      ),
    );
  } else {
    for (const pair of peerPairs) {
      const cat = pair.aToB?.category ?? pair.bToA?.category ?? 'neutral';
      const meta = BOND_CATEGORY_META[cat];

      const pairCard = el('div', 'ls-bw-pair-card');
      pairCard.style.setProperty('--ls-bond-color', meta.color);

      const head = el('div', 'ls-row-between');
      const leftTitle = el('div', 'ls-row');
      leftTitle.append(
        el('strong', '', `${pair.a.name} ⇄ ${pair.b.name}`),
        el('span', 'ls-bw-cat-chip', `${meta.icon} ${meta.label}`),
      );
      (leftTitle.lastElementChild as HTMLElement).style.setProperty('--ls-bond-color', meta.color);

      const rightActs = el('div', 'ls-row');
      rightActs.append(
        btn('✏️ Edit Bond', () => openNpcBondEditorModal(ctrl, pair.a, pair.aToB), 'ls-btn-sm'),
        btn('🗑️', () => {
          const nextChars = structuredClone(state.characters);
          if (nextChars[pair.a.id]?.peerBonds) delete nextChars[pair.a.id]!.peerBonds[pair.b.id];
          if (nextChars[pair.b.id]?.peerBonds) delete nextChars[pair.b.id]!.peerBonds[pair.a.id];
          void ctrl.request('state:mutate', {
            stateOverride: { characters: nextChars },
            reason: `Removed bond ${pair.a.name} ⇄ ${pair.b.name}`,
          });
        }, 'ls-btn-sm ls-btn-icon ls-btn-danger', 'Delete NPC bond'),
      );
      head.append(leftTitle, rightActs);
      pairCard.append(head);

      const twoCol = el('div', 'ls-bw-two-col');
      const boxA = el('div', 'ls-bw-dir-box');
      boxA.append(
        el('small', 'ls-kicker', `${pair.a.name} → ${pair.b.name}`),
        el('strong', '', pair.aToB?.label || 'Not defined yet'),
        ...(pair.aToB?.attitude ? [el('small', 'ls-muted', pair.aToB.attitude)] : []),
      );
      const aMetersEl = renderDynamicPeerBondMeters(pair.aToB?.meters, charBondSchemas);
      if (aMetersEl) boxA.append(aMetersEl);

      const boxB = el('div', 'ls-bw-dir-box');
      boxB.append(
        el('small', 'ls-kicker', `${pair.b.name} → ${pair.a.name}`),
        el('strong', '', pair.bToA?.label || 'Not defined yet'),
        ...(pair.bToA?.attitude ? [el('small', 'ls-muted', pair.bToA.attitude)] : []),
      );
      const bMetersEl = renderDynamicPeerBondMeters(pair.bToA?.meters, charBondSchemas);
      if (bMetersEl) boxB.append(bMetersEl);

      twoCol.append(boxA, boxB);
      pairCard.append(twoCol);
      npcSection.append(pairCard);
    }
  }
  wrap.append(npcSection);

  return wrap;
}
