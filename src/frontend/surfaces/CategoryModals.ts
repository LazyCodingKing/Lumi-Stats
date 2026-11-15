import { previewCategoryFormula } from '../../shared/formula';
import { createStatCategory } from '../../shared/templates';
import type { StatCategoryDef } from '../../shared/types';
import {
  btn,
  el,
  mountNativeCheckbox,
  mountNativeCollapsible,
  mountNativeSwitch,
  mountThemedSelect,
  type LumiFrontendController,
} from '../controller';

export function openStatCategoryModal(
  ctrl: LumiFrontendController,
  existing?: StatCategoryDef,
): void {
  const tpl = structuredClone(ctrl.snapshot.template);
  const existingCats = [...(tpl.categories ?? [])];

  ctrl.modals.open(
    {
      title: existing
        ? `Edit Category: ${existing.icon} ${existing.name}`
        : 'Create Stat Category & Group Rule',
      width: 660,
      maxHeight: 840,
    },
    (body, close, _handle, modalScope) => {
      let enabled = existing?.enabled ?? true;
      let showGroupHeaderInHud = existing?.showGroupHeaderInHud ?? true;
      let collapsedByDefault = existing?.collapsedByDefault ?? false;
      let injectInContinuity = existing?.injectInContinuity ?? true;
      let selectedColor = existing?.color || 'var(--lumiverse-primary)';
      let promptTriggerMode: 'always' | 'conditional' | 'manual' =
        existing?.promptTriggerMode ?? 'always';
      const memberIds = new Set<string>(
        existing
          ? tpl.stats.filter(s => s.categoryId === existing.id).map(s => s.id)
          : [],
      );

      // 1. Category Identity & Flags
      const topGrid = el('div', 'ls-grid');
      const iconWrap = el('label', 'ls-label', 'Icon');
      const iconInp = el('input', 'ls-input');
      iconInp.value = existing?.icon ?? '📁';
      iconWrap.append(iconInp);

      const nameWrap = el('label', 'ls-label', 'Category Name');
      const nameInp = el('input', 'ls-input');
      nameInp.placeholder = 'e.g. Combat & Power, Romance & Chemistry, Finances…';
      nameInp.value = existing?.name ?? '';
      nameWrap.append(nameInp);
      topGrid.append(iconWrap, nameWrap);
      body.append(topGrid);

      const colorWrap = el('div', 'ls-label', 'Category Accent Color');
      const colorRow = el('div', 'ls-row');
      const syncSwatches = () => {
        for (const b of [...colorRow.querySelectorAll<HTMLButtonElement>('.ls-color-swatch')]) {
          b.setAttribute('aria-pressed', String(b.dataset.colorVal === selectedColor));
        }
      };
      for (const [val, lbl, preview] of [
        ['var(--lumiverse-primary)', 'Theme Primary', 'var(--lumiverse-primary, #38bdf8)'],
        ['#38bdf8', 'Sky', '#38bdf8'],
        ['#f472b6', 'Rose', '#f472b6'],
        ['#f59e0b', 'Amber', '#f59e0b'],
        ['#10b981', 'Emerald', '#10b981'],
        ['#a78bfa', 'Violet', '#a78bfa'],
        ['#f43f5e', 'Crimson', '#f43f5e'],
      ] as const) {
        const b = btn('', () => {
          selectedColor = val;
          syncSwatches();
        }, 'ls-color-swatch', lbl);
        b.dataset.colorVal = val;
        b.style.background = preview;
        colorRow.append(b);
      }
      syncSwatches();
      colorWrap.append(colorRow);
      body.append(colorWrap);

      const toggleRow = el('div', 'ls-row-between ls-stat-cell');
      toggleRow.append(el('strong', '', 'Enable Category & All Stats Inside It'));
      const swSlot = el('div');
      toggleRow.append(swSlot);
      mountNativeSwitch(ctrl, modalScope, swSlot, {
        checked: enabled,
        ariaLabel: 'Enable Category',
        onChange: v => {
          enabled = v;
        },
      });
      body.append(toggleRow);

      const flagsGrid = el('div', 'ls-grid');
      for (const [lbl, initVal, setter] of [
        ['Show Category Header in HUD / Drawer', showGroupHeaderInHud, (v: boolean) => { showGroupHeaderInHud = v; }],
        ['Collapse Group by Default', collapsedByDefault, (v: boolean) => { collapsedByDefault = v; }],
        ['Include Category Stats & AI Rule in Story Continuity', injectInContinuity, (v: boolean) => { injectInContinuity = v; }],
      ] as const) {
        const slot = el('div');
        mountNativeCheckbox(ctrl, modalScope, slot, {
          checked: initVal,
          label: lbl,
          onChange: setter,
        });
        flagsGrid.append(slot);
      }
      body.append(flagsGrid);

      // 2. Shared Group AI Rule & Conditional Trigger
      const ruleHost = el('div');
      body.append(ruleHost);
      const ruleBody = mountNativeCollapsible(ctrl, modalScope, ruleHost, {
        title: 'Shared Category AI Rule & Prompt Trigger',
        iconName: 'sparkles',
        defaultExpanded: true,
        persistKey: 'modal_cat_ai_rule',
      });

      ruleBody.append(
        el(
          'small',
          'ls-muted',
          'This rule is printed ONCE for the group alongside each member stat’s own individual rule (individual stat rules remain completely untouched).',
        ),
      );

      const trigWrap = el('div', 'ls-label', 'Group Prompt Frequency');
      const trigSlot = el('div');
      trigWrap.append(trigSlot);
      ruleBody.append(trigWrap);

      const kwWrap = el('label', 'ls-label', 'Group Trigger Keywords (comma-separated)');
      const kwInp = el('input', 'ls-input');
      kwInp.placeholder = 'e.g. attack, fight, hit, spell, bleed, dodge';
      kwInp.value = (existing?.promptKeywords ?? []).join(', ');
      kwWrap.append(kwInp);
      ruleBody.append(kwWrap);

      const syncKwVis = () => {
        kwWrap.style.display = promptTriggerMode === 'conditional' ? '' : 'none';
      };
      syncKwVis();

      mountThemedSelect(ctrl, modalScope, trigSlot, {
        value: promptTriggerMode,
        ariaLabel: 'Group Prompt Frequency',
        options: [
          { value: 'always', label: 'Always in Prompt' },
          { value: 'conditional', label: 'Only When Group Keywords Match' },
          { value: 'manual', label: 'Manual Sync Only' },
        ],
        onChange: v => {
          promptTriggerMode = v as typeof promptTriggerMode;
          syncKwVis();
        },
      });

      const aiRuleWrap = el('div', 'ls-label');
      const aiRuleHead = el('div', 'ls-row-between');
      const aiRuleArea = el('textarea', 'ls-input');
      aiRuleArea.rows = 3;
      aiRuleArea.value = existing?.aiRule ?? '';
      aiRuleArea.placeholder =
        'Describe shared delta ranges, combat multipliers, romance pacing, or roleplay behavior for stats in this category…';
      aiRuleHead.append(
        el('span', '', 'Shared Category AI / Delta Rule'),
        btn('⛶ Full-Screen Editor', () => {
          void ctrl
            .request('textEditor:open', {
              title: `Category Rule: ${nameInp.value || 'Category'}`,
              value: aiRuleArea.value,
              placeholder: 'Describe shared rules for this stat group…',
            })
            .then(res => {
              if (!res.cancelled && typeof res.text === 'string') {
                aiRuleArea.value = res.text;
              }
            });
        }, 'ls-btn-sm'),
      );
      aiRuleWrap.append(aiRuleHead, aiRuleArea);
      ruleBody.append(aiRuleWrap);

      // 3. Optional Local Cross-Stat / Modifier Formula
      const localHost = el('div');
      body.append(localHost);
      const localBody = mountNativeCollapsible(ctrl, modalScope, localHost, {
        title: 'Local Group Formula & Cross-Stat Modifiers (Optional)',
        iconName: 'sliders',
        defaultExpanded: Boolean(existing?.localRuleFormula),
        persistKey: 'modal_cat_local_rule',
      });

      localBody.append(
        el(
          'small',
          'ls-muted',
          'Supports conditional modifiers `mod("stat_id", "Label", delta)` (auto-applies while true and clears when false) and `set("stat_id", expr)` / `if(cond) mod(...)`.',
        ),
      );
      const localArea = el('textarea', 'ls-input');
      localArea.rows = 3;
      localArea.placeholder =
        'e.g.\nmod("composure", "High Arousal", arousal >= 75 ? -10 : 0)\nif(HP < HP_max * 0.5) mod("composure", "Wounded", -10)';
      localArea.value = existing?.localRuleFormula ?? '';

      const localStatus = el('div', 'ls-formula-status');
      const localStatusMain = el('strong', '');
      localStatus.append(localStatusMain);

      const testLocalCategoryRule = () => {
        const draftCat = createStatCategory({
          ...existing,
          id: existing?.id,
          name: nameInp.value.trim() || 'Preview Category',
          localRuleFormula: localArea.value,
        });
        if (!localArea.value.trim()) {
          localStatus.dataset.status = 'warn';
          localStatusMain.textContent = 'No local group formula set (optional).';
          return;
        }
        const res = previewCategoryFormula(draftCat, ctrl.snapshot.state, tpl.stats, ctrl.selectedActorId);
        if (res.error) {
          localStatus.dataset.status = 'error';
          localStatusMain.textContent = `✖ Error: ${res.error}`;
        } else if (res.appliedEffects.length > 0) {
          localStatus.dataset.status = 'ok';
          localStatusMain.textContent = `✓ Active Effects: ${res.appliedEffects.join(' · ')}`;
        } else {
          localStatus.dataset.status = 'ok';
          localStatusMain.textContent = '✓ Valid formula (0 active modifiers triggered on current state).';
        }
      };
      localArea.addEventListener('input', testLocalCategoryRule);
      testLocalCategoryRule();

      localBody.append(
        localArea,
        localStatus,
        btn('▶ Test Group Formula', testLocalCategoryRule, 'ls-btn-sm'),
      );

      // 4. Member Stats Assignment
      const membersHost = el('div');
      body.append(membersHost);
      const membersBody = mountNativeCollapsible(ctrl, modalScope, membersHost, {
        title: `Member Stats in This Category (${memberIds.size})`,
        iconName: 'stats',
        defaultExpanded: true,
        persistKey: 'modal_cat_members',
      });

      const memGrid = el('div', 'ls-grid');
      for (const s of tpl.stats) {
        const slot = el('div');
        mountNativeCheckbox(ctrl, modalScope, slot, {
          checked: memberIds.has(s.id),
          label: `${s.icon} ${s.label} (${s.scope})`,
          onChange: on => {
            if (on) memberIds.add(s.id);
            else memberIds.delete(s.id);
          },
        });
        memGrid.append(slot);
      }
      membersBody.append(memGrid);

      // Footer Actions
      const footer = el('div', 'ls-row-between');
      footer.style.marginTop = '12px';
      const leftBtns = el('div', 'ls-row');
      if (existing) {
        leftBtns.append(
          btn('Delete Category', () => {
            const nextCats = existingCats.filter(c => c.id !== existing.id);
            const nextStats = tpl.stats.map(s =>
              s.categoryId === existing.id ? { ...s, categoryId: undefined } : s,
            );
            void ctrl.request('state:mutate', {
              templatePatch: { categories: nextCats, stats: nextStats },
              reason: `Deleted category "${existing.name}" (stats preserved)`,
            });
            close();
          }, 'ls-btn-sm ls-btn-danger'),
        );
      }

      const saveBtn = btn(existing ? 'Save Category' : 'Create Category', () => {
        const name = nameInp.value.trim();
        if (!name) return;
        const parsedKws = kwInp.value
          .split(',')
          .map(k => k.trim().toLowerCase())
          .filter(Boolean);
        const created = createStatCategory({
          ...existing,
          id: existing?.id,
          name,
          icon: iconInp.value.trim() || '📁',
          color: selectedColor,
          enabled,
          showGroupHeaderInHud,
          collapsedByDefault,
          injectInContinuity,
          promptTriggerMode,
          promptKeywords: parsedKws,
          aiRule: aiRuleArea.value.trim() || undefined,
          localRuleFormula: localArea.value.trim() || undefined,
          order: existing?.order ?? existingCats.length,
        });

        const nextCats = existingCats.some(c => c.id === created.id)
          ? existingCats.map(c => (c.id === created.id ? created : c))
          : [...existingCats, created];
        const nextStats = tpl.stats.map(s => {
          if (memberIds.has(s.id)) return { ...s, categoryId: created.id };
          if (s.categoryId === created.id) return { ...s, categoryId: undefined };
          return s;
        });

        void ctrl.request('state:mutate', {
          templatePatch: { categories: nextCats, stats: nextStats },
          reason: `Saved category "${created.name}"`,
        });
        close();
      }, 'ls-btn-primary');

      footer.append(leftBtns, saveBtn);
      body.append(footer);
    },
  );
}
