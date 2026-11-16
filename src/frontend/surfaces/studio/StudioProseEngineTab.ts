import {
  cleanBrailleAndProseWhitespace,
  deobfuscateSensitiveWords,
  normalizeSensitiveWordsList,
  obfuscateSensitiveWords,
  obfuscateWordToken,
} from '../../../shared/prose-cleaner';
import {
  btn,
  el,
  mountNativeCollapsible,
  mountNativeSwitch,
  mountThemedSelect,
  type ComponentScope,
  type LumiFrontendController,
} from '../../controller';

let proseTesterSample =
  '    She\u2800stepped\u2800forward\u2800with\u2800a\u2800warm\u2800smile.\u2800"Welcome\u2800back."';
let obfWordDraft = '';
let obfTesterSample = 'She hid the knife before any blood could spill.';
let autoFetchedConnectionsInStudio = false;
let lastTokenAnalysis: Record<string, unknown> | null = null;

export function renderStudioProseTab(
  ctrl: LumiFrontendController,
  compScope: ComponentScope,
): HTMLElement {
  const settings = ctrl.settings;
  const wrap = el('div', 'ls-stack');

  const proseCard = el('section', 'ls-card');
  proseCard.append(
    el('span', 'ls-kicker', 'Prose Typography & Unicode Hygiene'),
    el('h3', '', 'Braille Blank (U+2800) & Whitespace Cleaner'),
    el('p', 'ls-muted', 'Scrubs invisible Braille pattern blanks (U+2800), zero-width joiners, and accidental 4-space code blocks.'),
  );

  if (settings) {
    const toggleRow = el('div', 'ls-row-between ls-stat-cell');
    toggleRow.append(el('span', '', 'Auto-Clean Braille Blanks & 4-Space Glitches'));
    const switchSlot = el('div');
    toggleRow.append(switchSlot);
    mountNativeSwitch(ctrl, compScope, switchSlot, {
      checked: Boolean(settings.cleanBraille),
      ariaLabel: 'Auto-Clean Braille Blanks',
      onChange: checked => {
        void ctrl.request('settings:update', { settings: { cleanBraille: checked } });
      },
    });
    proseCard.append(toggleRow);
  }

  const retroRow = el('div', 'ls-row-between ls-stat-cell');
  retroRow.append(
    el('span', '', 'Retroactively clean all stored messages in the active chat:'),
    btn('Clean Active Chat Now', () => {
      void ctrl.request('prose:cleanChat').then(res => {
        ctrl.notify(`Cleaned ${Number(res.cleanedCount ?? 0)} of ${Number(res.total ?? 0)} messages.`);
      });
    }, 'ls-btn-sm ls-btn-primary'),
  );
  proseCard.append(retroRow);
  wrap.append(proseCard);

  // Collapsible Braille Tester
  const testerHost = el('div');
  wrap.append(testerHost);
  const testerBody = mountNativeCollapsible(ctrl, compScope, testerHost, {
    title: 'Live Braille & Indentation Tester',
    iconName: 'flask',
    defaultExpanded: false,
    persistKey: 'studio_prose_tester',
  });
  const sampleInp = el('textarea', 'ls-input');
  sampleInp.rows = 2;
  sampleInp.value = proseTesterSample;
  const sampleOut = el('div', 'ls-stat-cell');
  const updatePreview = () => {
    proseTesterSample = sampleInp.value;
    sampleOut.textContent = `Normalized Output: ${cleanBrailleAndProseWhitespace(sampleInp.value)}`;
  };
  sampleInp.addEventListener('input', updatePreview);
  updatePreview();
  testerBody.append(sampleInp, sampleOut);

  // Sensitive Word Obfuscator
  if (settings) {
    const obfCard = el('section', 'ls-card');
    const saveObfSetting = (patch: Record<string, unknown>) => {
      void ctrl.request('settings:update', { settings: patch });
    };
    const obfWords = normalizeSensitiveWordsList(settings.sensitiveWords);
    const useOne = settings.obfuscateVowelsWithOne !== false;

    const obfHead = el('div', 'ls-row-between');
    const swSlot = el('div');
    obfHead.append(
      el('h3', '', `Sensitive Word Obfuscator (${obfWords.length} words)`),
      swSlot,
    );
    mountNativeSwitch(ctrl, compScope, swSlot, {
      checked: Boolean(settings.sensitiveObfuscatorEnabled),
      ariaLabel: 'Enable Sensitive Word Obfuscator',
      onChange: on => saveObfSetting({ sensitiveObfuscatorEnabled: on }),
    });
    obfCard.append(
      obfHead,
      el('p', 'ls-muted', 'Replaces vowels in chosen words with "1" (e.g., blood → bl11d) when sending prompts, and restores readable words & inflections (e.g., bl11d/bl11dy → blood/bloody) in chat display via Lumiverse display processing (requires "chat_mutation" or "regex_scripts" permission).'),
    );

    const addRow = el('div', 'ls-row');
    const wordInp = el('input', 'ls-input');
    wordInp.style.flex = '1';
    wordInp.placeholder = 'Type words separated by commas (e.g. blood, kill)…';
    wordInp.value = obfWordDraft;
    wordInp.addEventListener('input', () => {
      obfWordDraft = wordInp.value;
    });

    const addWordsAction = () => {
      const incoming = wordInp.value
        .split(/[\n,;]+/)
        .map(s => s.trim().toLowerCase())
        .filter(s => s.length >= 2);
      if (!incoming.length) return;
      const merged = normalizeSensitiveWordsList([...obfWords, ...incoming]);
      obfWordDraft = '';
      wordInp.value = '';
      saveObfSetting({
        sensitiveWords: merged,
        ...(settings.sensitiveObfuscatorEnabled ? {} : { sensitiveObfuscatorEnabled: true }),
      });
    };

    wordInp.addEventListener('keydown', ev => {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        addWordsAction();
      }
    });
    addRow.append(
      wordInp,
      btn('Add', addWordsAction, 'ls-btn-sm ls-btn-primary'),
      ...(obfWords.length > 0
        ? [btn('Clear All', () => saveObfSetting({ sensitiveWords: [] }), 'ls-btn-sm ls-btn-danger')]
        : []),
    );
    obfCard.append(addRow);

    if (obfWords.length > 0) {
      const chipsRow = el('div', 'ls-row');
      for (const w of obfWords) {
        chipsRow.append(
          btn(`${w} → ${obfuscateWordToken(w, useOne)} ✕`, () => {
            saveObfSetting({ sensitiveWords: obfWords.filter(item => item !== w) });
          }, 'ls-btn-sm ls-quick-pill', `Remove "${w}"`),
        );
      }
      obfCard.append(chipsRow);
    }

    const optHost = el('div');
    obfCard.append(optHost);
    const optBody = mountNativeCollapsible(ctrl, compScope, optHost, {
      title: 'Cipher Rules & Live Preview',
      iconName: 'sliders',
      defaultExpanded: false,
      persistKey: 'studio_prose_cipher',
    });
    const optGrid = el('div', 'ls-grid');
    for (const [key, lbl, defaultVal] of [
      ['obfuscateVowelsWithOne', 'Use "1" instead of "*"', true],
      ['obfuscateOnSend', 'Obfuscate Prompts Sent to LLM', true],
      ['restoreObfuscatedOnRender', 'Restore Words in Chat Display', true],
      ['obfuscateOnOutput', 'Obfuscate Saved LLM Output', false],
      ['includeCipherHint', 'Explain Cipher Input to LLM (Keep prose normal)', false],
    ] as const) {
      const cell = el('div', 'ls-row-between ls-stat-cell');
      cell.append(el('span', '', lbl));
      const s = el('div');
      cell.append(s);
      mountNativeSwitch(ctrl, compScope, s, {
        checked: settings[key] !== undefined ? Boolean(settings[key]) : defaultVal,
        onChange: on => saveObfSetting({ [key]: on }),
      });
      optGrid.append(cell);
    }
    const obfSampleInp = el('input', 'ls-input');
    obfSampleInp.value = obfTesterSample;
    const sentPreview = el('small', 'ls-muted');
    const dispPreview = el('small', 'ls-muted');
    const syncObfPreview = () => {
      obfTesterSample = obfSampleInp.value;
      const sentTxt = obfuscateSensitiveWords(obfSampleInp.value, obfWords, useOne);
      const dispTxt = settings.obfuscateOnOutput
        ? sentTxt
        : settings.restoreObfuscatedOnRender !== false
          ? deobfuscateSensitiveWords(sentTxt, obfWords, useOne)
          : sentTxt;
      sentPreview.textContent = `Sent to LLM: ${sentTxt}`;
      dispPreview.textContent = `Chat Display: ${dispTxt}`;
    };
    obfSampleInp.addEventListener('input', syncObfPreview);
    syncObfPreview();
    optBody.append(optGrid, obfSampleInp, sentPreview, dispPreview);
    wrap.append(obfCard);
  }

  return wrap;
}

export function renderStudioEngineTab(
  ctrl: LumiFrontendController,
  compScope: ComponentScope,
  postMount: Array<() => void>,
): HTMLElement {
  const settings = ctrl.settings;
  const wrap = el('div', 'ls-stack');
  if (!settings) return wrap;

  if (!ctrl.connections.length && !autoFetchedConnectionsInStudio) {
    autoFetchedConnectionsInStudio = true;
    void ctrl.refreshActiveChat();
  }

  const engCard = el('section', 'ls-card');
  engCard.append(el('h3', '', 'Extraction Mode & Connections'));

  const modeRow = el('div', 'ls-row');
  for (const [mVal, mLbl] of [
    ['sidecar', 'Dedicated Sidecar Extractor (Works with Any Preset)'],
    ['inline_tag', 'Zero-Call Inline <lumi-stats> Tag'],
  ] as const) {
    const b = btn(mLbl, () => {
      void ctrl.request('settings:update', { settings: { extractionMode: mVal } });
    }, 'ls-btn-sm');
    if (settings.extractionMode === mVal) b.setAttribute('aria-current', 'page');
    modeRow.append(b);
  }
  engCard.append(modeRow);

  const toggleGrid = el('div', 'ls-grid');
  for (const [key, label] of [
    ['autoTrack', 'Auto-calibrate after assistant replies'],
    ['injectContinuity', 'Inject continuity into narrator prompt'],
    ['splitStaticProtocolForCache', 'Cache-friendly split (static rules before history)'],
    ['memoryCortexSync', 'Sync to Lumiverse Memory Cortex'],
    ['worldInfoGating', 'Enable [lumi:stat>=value] World Info gates'],
    ['thresholdToasts', 'Show threshold toast alerts'],
    ['debugInspector', 'Keep last extractor payload for debug'],
  ] as const) {
    const cell = el('div', 'ls-row-between ls-stat-cell');
    cell.append(el('span', '', label));
    const swSlot = el('div');
    cell.append(swSlot);
    mountNativeSwitch(ctrl, compScope, swSlot, {
      checked: Boolean(settings[key]),
      onChange: on => void ctrl.request('settings:update', { settings: { [key]: on } }),
    });
    toggleGrid.append(cell);
  }
  engCard.append(toggleGrid);

  const connGrid = el('div', 'ls-grid');
  const connWrap = el('div', 'ls-label', 'Extractor LLM Connection');
  const connSlot = el('div');
  connWrap.append(connSlot);

  const modelWrap = el('label', 'ls-label', 'Extractor Model Override');
  const modelSlot = el('div');
  modelWrap.append(modelSlot);
  connGrid.append(connWrap, modelWrap);
  engCard.append(connGrid);

  mountThemedSelect(ctrl, compScope, connSlot, {
    value: settings.extractorConnectionId || '',
    ariaLabel: 'Extractor LLM Connection',
    searchPlaceholder: 'Search connections…',
    options: [
      { value: '', label: 'Use Active Lumiverse Default Connection' },
      ...ctrl.connections.map(c => ({
        value: c.id,
        label: `${c.name}${c.model ? ` (${c.model})` : ''}`,
        ...(c.provider ? { sublabel: c.provider } : {}),
      })),
    ],
    onChange: nextConnId => {
      void ctrl.request('settings:update', { settings: { extractorConnectionId: nextConnId } });
    },
  });

  const mInp = el('input', 'ls-input');
  mInp.value = settings.extractorModel || '';
  mInp.placeholder = 'Default connection model…';
  mInp.addEventListener('change', () => {
    void ctrl.request('settings:update', { settings: { extractorModel: mInp.value.trim() } });
  });
  modelSlot.append(mInp);

  if (ctrl.ctx.components?.mountModelCombobox) {
    postMount.push(() => {
      if (!modelSlot.isConnected) return;
      try {
        modelSlot.replaceChildren();
        compScope.track(
          ctrl.ctx.components.mountModelCombobox(modelSlot, {
            value: settings.extractorModel || '',
            connection: settings.extractorConnectionId
              ? { kind: 'llm', id: settings.extractorConnectionId }
              : { kind: 'llm' },
            appearance: 'standard',
            placeholder: 'Default connection model…',
            onChange: nextModel => {
              void ctrl.request('settings:update', { settings: { extractorModel: nextModel } });
            },
          }),
        );
      } catch {
        // Keep plain input fallback
      }
    });
  }

  // Token Diet & Prompt Budget Controls
  const dietCard = el('section', 'ls-card');
  dietCard.append(
    el('span', 'ls-kicker', 'Token Economy & Prompt Budget'),
    el('h3', '', 'Token Diet, Protocol Mode & Live Analyzer'),
  );

  const dietGrid = el('div', 'ls-grid');
  const budgetWrap = el('label', 'ls-label', 'Continuity Token Budget (150–4000)');
  const budgetInp = el('input', 'ls-input');
  budgetInp.type = 'number';
  budgetInp.min = '150';
  budgetInp.max = '4000';
  budgetInp.step = '50';
  budgetInp.value = String(settings.tokenBudget ?? 450);
  budgetInp.addEventListener('change', () => {
    const val = Math.max(150, Math.min(4000, Math.round(Number(budgetInp.value) || 450)));
    budgetInp.value = String(val);
    void ctrl.request('settings:update', { settings: { tokenBudget: val } });
  });
  budgetWrap.append(budgetInp);

  const verbWrap = el('div', 'ls-label', 'Extractor Protocol Mode');
  const verbSlot = el('div');
  verbWrap.append(verbSlot);
  mountThemedSelect(ctrl, compScope, verbSlot, {
    value: settings.protocolVerbosity ?? 'compact',
    ariaLabel: 'Extractor Protocol Mode',
    options: [
      { value: 'compact', label: 'Compact Delta (Recommended — Saves ~45%)' },
      { value: 'standard', label: 'Standard Detailed (Verbose Turn-1 Guides)' },
    ],
    onChange: v => {
      void ctrl.request('settings:update', { settings: { protocolVerbosity: v } });
    },
  });

  const turnsWrap = el('label', 'ls-label', 'Sidecar History Window (2–12 msgs)');
  const turnsInp = el('input', 'ls-input');
  turnsInp.type = 'number';
  turnsInp.min = '2';
  turnsInp.max = '12';
  turnsInp.value = String(settings.sidecarHistoryTurns ?? 4);
  turnsInp.addEventListener('change', () => {
    const val = Math.max(2, Math.min(12, Math.round(Number(turnsInp.value) || 4)));
    turnsInp.value = String(val);
    void ctrl.request('settings:update', { settings: { sidecarHistoryTurns: val } });
  });
  turnsWrap.append(turnsInp);

  const charsWrap = el('label', 'ls-label', 'Sidecar Max Chars / Msg (800–6000)');
  const charsInp = el('input', 'ls-input');
  charsInp.type = 'number';
  charsInp.min = '800';
  charsInp.max = '6000';
  charsInp.step = '250';
  charsInp.value = String(settings.sidecarMaxCharsPerMsg ?? 2500);
  charsInp.addEventListener('change', () => {
    const val = Math.max(800, Math.min(6000, Math.round(Number(charsInp.value) || 2500)));
    charsInp.value = String(val);
    void ctrl.request('settings:update', { settings: { sidecarMaxCharsPerMsg: val } });
  });
  charsWrap.append(charsInp);

  dietGrid.append(budgetWrap, verbWrap, turnsWrap, charsWrap);
  dietCard.append(dietGrid);

  const quickDietRow = el('div', 'ls-row');
  quickDietRow.append(
    btn(
      'Hide Analytical Fields from Continuity',
      () => {
        const analyticalIds = new Set([
          'acted',
          'observation',
          'plan',
          'knowledge',
          'cash_in_hand',
          'cash_in_bank',
          'bottom_underwear',
          'top_underwear',
          'offscreen_npcs',
        ]);
        const nextStats = ctrl.snapshot.template.stats.map(s =>
          analyticalIds.has(s.id) ? { ...s, injectInContinuity: false } : s,
        );
        void ctrl
          .request('state:mutate', {
            templatePatch: { stats: nextStats },
            reason: 'Moved analytical/secondary stats to UI-only continuity',
          })
          .then(() => ctrl.notify('Analytical fields moved to UI-only (still tracked & visible in panels).'));
      },
      'ls-btn-sm',
      'Stops echoing acted, observation, plan, knowledge, cash, underwear, and offscreen_npcs back to the narrator while keeping them in the UI',
    ),
    btn(
      'Auto-Gate Situational Stats',
      () => {
        const kwMap: Record<string, string[]> = {
          cash_in_hand: ['cash', 'coin', 'gold', 'money', 'pay', 'buy', 'sell', 'price', 'wallet', 'bank'],
          cash_in_bank: ['cash', 'coin', 'gold', 'money', 'pay', 'buy', 'sell', 'bank', 'account', 'asset'],
          bottom_underwear: ['undress', 'underwear', 'panties', 'boxers', 'towel', 'bath', 'strip', 'naked', 'skirt', 'pants'],
          top_underwear: ['undress', 'underwear', 'bra', 'towel', 'bath', 'strip', 'naked', 'shirt', 'top'],
        };
        const nextStats = ctrl.snapshot.template.stats.map(s => {
          if (kwMap[s.id]) {
            return {
              ...s,
              promptTriggerMode: 'conditional' as const,
              promptKeywords: kwMap[s.id],
            };
          }
          if ((s.id === 'eff_pow_agi' || s.id === 'char_eff_pow_agi') && s.formula?.trim()) {
            return { ...s, calculationMode: 'local_formula' as const };
          }
          return s;
        });
        void ctrl
          .request('state:mutate', {
            templatePatch: { stats: nextStats },
            reason: 'Applied keyword gating & local-formula diet',
          })
          .then(() => ctrl.notify('Applied keyword gating to situational stats.'));
      },
      'ls-btn-sm',
      'Only sends cash & clothing rules when matching keywords appear in recent chat',
    ),
  );
  dietCard.append(quickDietRow);

  const analysisBox = el('div', 'ls-stat-cell');
  const renderAnalysis = () => {
    analysisBox.replaceChildren();
    if (!lastTokenAnalysis) {
      analysisBox.append(
        el('small', 'ls-muted', 'Click "Analyze Current Chat Tokens" to measure exact protocol, continuity, and per-stat token usage.'),
      );
      return;
    }
    const approxTag = lastTokenAnalysis.approximate ? ' (est.)' : '';
    analysisBox.append(
      el(
        'strong',
        '',
        `Total Injected: ${Number(lastTokenAnalysis.totalInjectedTokens ?? 0)} tokens${approxTag} — Protocol: ${Number(lastTokenAnalysis.protocolTokens ?? 0)} | Continuity: ${Number(lastTokenAnalysis.continuityTokens ?? 0)} (uncapped: ${Number(lastTokenAnalysis.rawContinuityTokens ?? 0)}) | Dossier: ~${Number(lastTokenAnalysis.dossierStateTokens ?? 0)}`,
      ),
    );
    const topStats = Array.isArray(lastTokenAnalysis.topStats)
      ? (lastTokenAnalysis.topStats as Array<Record<string, unknown>>)
      : [];
    if (topStats.length > 0) {
      const chipRow = el('div', 'ls-row');
      for (const st of topStats) {
        chipRow.append(
          el(
            'span',
            'ls-chip',
            `${String(st.label)}: ~${Number(st.approxTokens ?? 0)}t (rule ${Number(st.ruleTokens ?? 0)} + state ${Number(st.stateTokens ?? 0)})`,
          ),
        );
      }
      analysisBox.append(chipRow);
    }
  };
  renderAnalysis();

  const analyzeBtn = btn('Analyze Current Chat Tokens', () => {
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'Counting tokens…';
    void ctrl
      .request('tokens:analyze')
      .then(res => {
        lastTokenAnalysis = res;
        renderAnalysis();
      })
      .finally(() => {
        if (analyzeBtn.isConnected) {
          analyzeBtn.disabled = false;
          analyzeBtn.textContent = 'Analyze Current Chat Tokens';
        }
      });
  }, 'ls-btn-sm ls-btn-primary');

  dietCard.append(analyzeBtn, analysisBox);

  engCard.append(
    btn('Inspect Last Extractor Payload', () => {
      void ctrl.request('debug:get').then(res => {
        ctrl.modals.open({ title: 'Last Extractor JSON Output', width: 720, maxHeight: 740 }, body => {
          const pre = el(
            'pre',
            'ls-stat-cell',
            res.record
              ? JSON.stringify(res.record, null, 2)
              : 'No debug record captured yet. Enable debug inspection and run a sync.',
          );
          pre.style.whiteSpace = 'pre-wrap';
          pre.style.overflowWrap = 'anywhere';
          body.append(pre);
        });
      });
    }, 'ls-btn-sm'),
  );
  wrap.append(engCard, dietCard);
  return wrap;
}
