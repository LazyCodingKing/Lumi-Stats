import { btn, el, type ComponentScope, type LumiFrontendController } from '../controller';
import { renderStatGridSurface } from './StatGrid';

export function renderWorldSurface(
  ctrl: LumiFrontendController,
  compScope?: ComponentScope,
): HTMLElement {
  const { state } = ctrl.snapshot;
  const wrap = el('div', 'ls-stack');

  const worldStatsCard = el('section', 'ls-card');
  worldStatsCard.append(renderStatGridSurface(ctrl, ['world', 'scene'], compScope, true));
  wrap.append(worldStatsCard);

  // Quests Card
  const quests = Object.values(state.quests);
  const qCard = el('section', 'ls-card');
  const qHead = el('div', 'ls-row-between');
  qHead.append(
    el('h3', '', `🎯 Quests & Objectives (${quests.filter(q => q.status === 'active').length})`),
    btn('+ Add Quest', () => {
      ctrl.modals.open({ title: '➕ Add Quest or Goal', width: 460 }, (body, close) => {
        const tWrap = el('label', 'ls-label', 'Quest Title');
        const tInp = el('input', 'ls-input');
        tWrap.append(tInp);
        const oWrap = el('label', 'ls-label', 'Objectives (one per line)');
        const oInp = el('textarea', 'ls-input');
        oInp.rows = 3;
        oWrap.append(oInp);
        const save = btn('➕ Save Quest', () => {
          const title = tInp.value.trim();
          if (!title) return;
          const objectives = oInp.value
            .split('\n')
            .map(s => s.trim())
            .filter(Boolean)
            .map(text => ({ text, completed: false }));
          void ctrl.request('state:mutate', {
            patch: {
              quests: [{ title, status: 'active', objectives }],
            },
            reason: `Added quest "${title}"`,
          });
          close();
        }, 'ls-btn-primary');
        body.append(tWrap, oWrap, save);
      });
    }, 'ls-btn-sm ls-btn-primary'),
  );
  qCard.append(qHead);

  if (!quests.length) {
    qCard.append(el('p', 'ls-muted', 'No active quests recorded yet.'));
  } else {
    for (const q of quests) {
      const box = el('div', 'ls-stat-cell');
      box.append(el('strong', '', `🎯 ${q.title} (${q.status})`));
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
        row.append(chk, el('span', obj.completed ? 'ls-muted' : '', obj.text));
        box.append(row);
      }
      qCard.append(box);
    }
  }
  wrap.append(qCard);

  // Off-Screen Dispatches Card
  if (state.dispatches.length > 0) {
    const dCard = el('section', 'ls-card');
    dCard.append(el('h3', '', `📡 Meanwhile / Off-Screen Dispatches (${state.dispatches.length})`));
    for (const disp of [...state.dispatches].reverse().slice(0, 6)) {
      const cell = el('div', 'ls-stat-cell');
      const top = el('div', 'ls-row-between');
      top.append(
        el('strong', '', `📡 ${disp.title}`),
        el('span', 'ls-chip', `📍 ${disp.locationName} · Turn ${disp.turn}`),
      );
      cell.append(top, el('p', 'ls-muted', disp.summary));
      if (disp.futureHook) {
        cell.append(el('small', 'ls-muted', `↳ Hook: ${disp.futureHook}`));
      }
      dCard.append(cell);
    }
    wrap.append(dCard);
  }

  return wrap;
}

export function renderCopilotSurface(ctrl: LumiFrontendController): HTMLElement {
  const { checkpoints } = ctrl.snapshot;
  const wrap = el('div', 'ls-stack');

  const topCard = el('section', 'ls-card');
  const head = el('div', 'ls-row-between');
  head.append(
    el('h3', '', '🤖 Lumi Stats Copilot & Schema Architect'),
    btn('🧹 Clear History', () => void ctrl.request('copilot:clear'), 'ls-btn-sm'),
  );
  topCard.append(head);

  const modeRow = el('div', 'ls-row');
  for (const [mId, lbl] of [
    ['ask', '💬 Ask Continuity'],
    ['adjust', '📊 Adjust Stats'],
    ['architect', '✨ Design Custom Stats'],
  ] as const) {
    const b = btn(lbl, () => {
      ctrl.activeCopilotMode = mId;
      ctrl.emitChange();
    }, 'ls-btn-sm');
    if (ctrl.activeCopilotMode === mId) b.setAttribute('aria-pressed', 'true');
    modeRow.append(b);
  }
  topCard.append(modeRow);
  wrap.append(topCard);

  if (ctrl.activeProposal) {
    const prop = ctrl.activeProposal;
    const pCard = el('section', 'ls-card');
    pCard.append(el('h3', '', '📋 Proposed Copilot Changes'));
    for (const s of prop.summaries) {
      pCard.append(el('p', '', `• ${s}`));
    }
    const btns = el('div', 'ls-row');
    btns.append(
      btn('✅ Apply Proposal', () => {
        const id = prop.id;
        ctrl.activeProposal = undefined;
        void ctrl.request('copilot:acceptProposal', { proposalId: id });
      }, 'ls-btn-sm ls-btn-primary'),
      btn('✕ Discard', () => {
        ctrl.activeProposal = undefined;
        ctrl.emitChange();
      }, 'ls-btn-sm'),
    );
    pCard.append(btns);
    wrap.append(pCard);
  }

  const logCard = el('section', 'ls-card');
  logCard.style.maxHeight = '260px';
  logCard.style.overflowY = 'auto';
  if (!ctrl.copilotTurns.length) {
    logCard.append(el('p', 'ls-muted', 'Ask a question or tell Lumi Architect what stats to build below.'));
  } else {
    for (const turn of ctrl.copilotTurns) {
      const cell = el('div', 'ls-stat-cell');
      cell.append(
        el('span', 'ls-kicker', turn.role === 'user' ? 'You' : 'Lumi Architect'),
        el('p', '', turn.text),
      );
      logCard.append(cell);
    }
  }
  wrap.append(logCard);

  const composer = el('section', 'ls-card');
  const area = el('textarea', 'ls-input');
  area.rows = 2;
  area.placeholder = 'e.g. "Add a momentary Blush meter (0-100) and set the maid’s Loyalty to 92"';
  const sendBtn = btn(ctrl.busy ? '⏳ Working…' : 'Send to Copilot ↵', () => {
    const msg = area.value.trim();
    if (!msg || ctrl.busy) return;
    area.value = '';
    void ctrl
      .request('copilot:send', { message: msg, mode: ctrl.activeCopilotMode })
      .then(res => {
        if (res.proposal && typeof res.proposal === 'object') {
          ctrl.activeProposal = res.proposal as typeof ctrl.activeProposal;
          ctrl.emitChange();
        }
      });
  }, 'ls-btn-primary');
  composer.append(area, sendBtn);
  wrap.append(composer);

  // 25-Turn Checkpoint Ring Buffer
  const cpCard = el('details', 'ls-card');
  const sum = el('summary', 'ls-row-between');
  sum.append(
    el('strong', '', `⏪ Turn Checkpoints (${checkpoints.length})`),
    btn('↩ Undo Latest', () => void ctrl.request('state:undo'), 'ls-btn-sm'),
  );
  cpCard.append(sum);
  const cpStack = el('div', 'ls-stack');
  cpStack.style.marginTop = '8px';
  for (const cp of checkpoints.slice(0, 12)) {
    const row = el('div', 'ls-row-between ls-stat-cell');
    row.append(
      el('span', '', `Rev ${cp.revision}: ${cp.reason}`),
      btn('Restore', async () => {
        const ok = await ctrl.modals.confirm({
          title: `Restore Revision ${cp.revision}?`,
          message: `Restore campaign state to Revision ${cp.revision} ("${cp.reason}")?`,
          confirmLabel: 'Restore',
          variant: 'warning',
        });
        if (ok) {
          void ctrl.request('state:restoreCheckpoint', { checkpointId: cp.id });
        }
      }, 'ls-btn-sm'),
    );
    cpStack.append(row);
  }
  cpCard.append(cpStack);
  wrap.append(cpCard);

  return wrap;
}
