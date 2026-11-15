import { slugifyKey } from '../../../shared/templates';
import type {
  DossierTabConfig,
  LumiStatsTemplate,
  SurfaceTabConfig,
} from '../../../shared/types';
import {
  btn,
  el,
  iconBtn,
  mountNativeCheckbox,
  mountNativeSwitch,
  mountThemedSelect,
  type ComponentScope,
  type LumiFrontendController,
} from '../../controller';
import { openScenePillEditorModal } from '../BuiltinTrackerModals';
import { openDuplicateStatModal, openStatSchemaModal } from '../StatGrid';

type ExtremeSubTabId = 'tabs' | 'dossier' | 'matrix' | 'banners';
let activeExtremeSubTab: ExtremeSubTabId = 'tabs';

export function renderStudioSurfacesTab(
  ctrl: LumiFrontendController,
  compScope: ComponentScope,
  tpl: LumiStatsTemplate,
  saveTemplatePatch: (patch: Partial<LumiStatsTemplate>, reason?: string) => void,
  forceRedraw: () => void,
): HTMLElement {
  const wrap = el('div', 'ls-stack');

  const subNav = el('div', 'ls-subnav-pills');
  for (const [sId, sLbl] of [
    ['tabs', '1. Widget & Inline Tabs'],
    ['dossier', '2. Dossier Tabs'],
    ['matrix', '3. Stat Placement Matrix'],
    ['banners', '4. Scene Pill & Custom HTML'],
  ] as const) {
    const b = btn(sLbl, () => {
      activeExtremeSubTab = sId;
      forceRedraw();
    }, 'ls-btn-sm');
    if (activeExtremeSubTab === sId) b.setAttribute('aria-current', 'page');
    subNav.append(b);
  }
  wrap.append(subNav);

  if (activeExtremeSubTab === 'tabs') {
    const featureCard = el('section', 'ls-card');
    featureCard.append(el('h3', '', 'Relationship Web & Peer Bonds'));
    const featureGrid = el('div', 'ls-grid');
    for (const [fKey, fLbl] of [
      ['showRelationshipWeb', 'Enable Relationship Web Tab'],
      ['trackNpcBonds', 'Track NPC↔NPC Peer Bonds'],
    ] as const) {
      const slot = el('div');
      mountNativeCheckbox(ctrl, compScope, slot, {
        checked: tpl.surfaces[fKey] !== false,
        label: fLbl,
        onChange: on => saveTemplatePatch({ surfaces: { ...tpl.surfaces, [fKey]: on } }),
      });
      featureGrid.append(slot);
    }
    featureCard.append(featureGrid);
    wrap.append(featureCard);

    const buildSurfaceTabEditor = (
      title: string,
      tabs: SurfaceTabConfig[],
      onCommit: (nextTabs: SurfaceTabConfig[]) => void,
    ): HTMLElement => {
      const card = el('section', 'ls-card');
      card.append(el('h3', '', title));
      const sorted = [...tabs].sort((a, b) => a.order - b.order);

      sorted.forEach((tab, idx) => {
        const row = el('div', 'ls-stat-row-compact');
        const left = el('div', 'ls-row');
        const swSlot = el('div');
        mountNativeSwitch(ctrl, compScope, swSlot, {
          checked: tab.enabled,
          ariaLabel: `Toggle ${tab.label}`,
          onChange: on => {
            tab.enabled = on;
            onCommit(sorted);
          },
        });

        const iconInp = el('input', 'ls-input');
        iconInp.style.cssText = 'width:44px;min-height:28px;padding:2px 6px;';
        iconInp.value = tab.icon;
        iconInp.addEventListener('change', () => {
          tab.icon = iconInp.value.trim() || '📊';
          onCommit(sorted);
        });

        const lblInp = el('input', 'ls-input');
        lblInp.style.cssText = 'width:130px;min-height:28px;padding:2px 8px;';
        lblInp.value = tab.label;
        lblInp.addEventListener('change', () => {
          tab.label = lblInp.value.trim() || tab.label;
          onCommit(sorted);
        });

        const kindSlot = el('div');
        mountThemedSelect(ctrl, compScope, kindSlot, {
          value: tab.kind,
          compact: true,
          ariaLabel: 'Surface Tab Kind',
          options: [
            { value: 'stats', label: 'Stats Grid' },
            { value: 'cast', label: 'Cast List' },
            { value: 'web', label: 'Bond Web' },
            { value: 'map', label: 'Spatial Atlas' },
            { value: 'world', label: 'World & Clocks' },
            { value: 'custom', label: 'Custom Tab' },
          ],
          onChange: nextKind => {
            tab.kind = nextKind as SurfaceTabConfig['kind'];
            onCommit(sorted);
          },
        });

        left.append(swSlot, iconInp, lblInp, kindSlot);

        const right = el('div', 'ls-row');
        if (idx > 0) {
          right.append(
            btn('↑', () => {
              const nextList = [...sorted];
              [nextList[idx - 1], nextList[idx]] = [nextList[idx]!, nextList[idx - 1]!];
              nextList.forEach((t, i) => { t.order = i; });
              onCommit(nextList);
            }, 'ls-btn-sm ls-btn-icon ls-btn-ghost'),
          );
        }
        if (idx < sorted.length - 1) {
          right.append(
            btn('↓', () => {
              const nextList = [...sorted];
              [nextList[idx], nextList[idx + 1]] = [nextList[idx + 1]!, nextList[idx]!];
              nextList.forEach((t, i) => { t.order = i; });
              onCommit(nextList);
            }, 'ls-btn-sm ls-btn-icon ls-btn-ghost'),
          );
        }
        if (sorted.length > 1) {
          right.append(
            iconBtn('trash', () => onCommit(sorted.filter(t => t.id !== tab.id)), {
              className: 'ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger',
              title: 'Delete tab',
            }),
          );
        }
        row.append(left, right);
        card.append(row);
      });

      const addRow = el('div', 'ls-row');
      const newIcon = el('input', 'ls-input');
      newIcon.style.width = '50px';
      newIcon.value = '✨';
      const newLbl = el('input', 'ls-input');
      newLbl.style.flex = '1';
      newLbl.placeholder = 'New tab name (e.g. Gear, Plans, Clues)…';
      addRow.append(
        newIcon,
        newLbl,
        iconBtn(
          'plus',
          () => {
            const lbl = newLbl.value.trim();
            if (!lbl) return;
            sorted.push({
              id: slugifyKey(lbl, `tab_${sorted.length + 1}`),
              label: lbl,
              icon: newIcon.value.trim() || '✨',
              kind: 'custom',
              enabled: true,
              order: sorted.length,
            });
            onCommit(sorted);
          },
          { label: 'Add Tab', className: 'ls-btn-sm ls-btn-primary' },
        ),
      );
      card.append(addRow);
      return card;
    };

    wrap.append(
      buildSurfaceTabEditor('Floating HUD Widget Tabs', tpl.surfaces.widgetTabs, nextTabs =>
        saveTemplatePatch({ surfaces: { ...tpl.surfaces, widgetTabs: nextTabs } }),
      ),
      buildSurfaceTabEditor('Inline Message Ribbon Tabs', tpl.surfaces.inlineTabs, nextTabs =>
        saveTemplatePatch({ surfaces: { ...tpl.surfaces, inlineTabs: nextTabs } }),
      ),
    );
  } else if (activeExtremeSubTab === 'dossier') {
    const dosCard = el('section', 'ls-card');
    dosCard.append(el('h3', '', 'Character Dossier Tabs'));
    const sortedDos = [...tpl.surfaces.dossierTabs].sort((a, b) => a.order - b.order);

    sortedDos.forEach((dTab, idx) => {
      const box = el('div', 'ls-stat-cell');
      const top = el('div', 'ls-row-between');
      const left = el('div', 'ls-row');
      const swSlot = el('div');
      mountNativeSwitch(ctrl, compScope, swSlot, {
        checked: dTab.enabled,
        onChange: on => {
          dTab.enabled = on;
          saveTemplatePatch({ surfaces: { ...tpl.surfaces, dossierTabs: sortedDos } });
        },
      });
      const icInp = el('input', 'ls-input');
      icInp.style.cssText = 'width:44px;min-height:28px;padding:2px 6px;';
      icInp.value = dTab.icon;
      icInp.addEventListener('change', () => {
        dTab.icon = icInp.value.trim() || '🪪';
        saveTemplatePatch({ surfaces: { ...tpl.surfaces, dossierTabs: sortedDos } });
      });
      const lbInp = el('input', 'ls-input');
      lbInp.style.cssText = 'width:150px;min-height:28px;padding:2px 8px;';
      lbInp.value = dTab.label;
      lbInp.addEventListener('change', () => {
        dTab.label = lbInp.value.trim() || dTab.label;
        saveTemplatePatch({ surfaces: { ...tpl.surfaces, dossierTabs: sortedDos } });
      });
      left.append(swSlot, icInp, lbInp);

      const right = el('div', 'ls-row');
      if (idx > 0) {
        right.append(
          btn('↑', () => {
            const nextList = [...sortedDos];
            [nextList[idx - 1], nextList[idx]] = [nextList[idx]!, nextList[idx - 1]!];
            nextList.forEach((t, i) => { t.order = i; });
            saveTemplatePatch({ surfaces: { ...tpl.surfaces, dossierTabs: nextList } });
          }, 'ls-btn-sm ls-btn-icon ls-btn-ghost'),
        );
      }
      if (idx < sortedDos.length - 1) {
        right.append(
          btn('↓', () => {
            const nextList = [...sortedDos];
            [nextList[idx], nextList[idx + 1]] = [nextList[idx + 1]!, nextList[idx]!];
            nextList.forEach((t, i) => { t.order = i; });
            saveTemplatePatch({ surfaces: { ...tpl.surfaces, dossierTabs: nextList } });
          }, 'ls-btn-sm ls-btn-icon ls-btn-ghost'),
        );
      }
      if (sortedDos.length > 1) {
        right.append(
          iconBtn(
            'trash',
            () => {
              saveTemplatePatch({
                surfaces: { ...tpl.surfaces, dossierTabs: sortedDos.filter(x => x.id !== dTab.id) },
              });
            },
            { className: 'ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger', title: 'Delete dossier tab' },
          ),
        );
      }
      top.append(left, right);
      box.append(top);

      const secRow = el('div', 'ls-row');
      for (const [prop, lbl] of [
        ['showMeters', 'Meters'],
        ['showNpcBonds', 'Peer Bonds'],
        ['showFields', 'Fields'],
        ['showSecrets', 'Secrets'],
        ['showAudit', 'Audit Log'],
      ] as const) {
        const slot = el('div');
        mountNativeCheckbox(ctrl, compScope, slot, {
          checked: Boolean(dTab[prop]),
          label: lbl,
          onChange: on => {
            dTab[prop] = on;
            saveTemplatePatch({ surfaces: { ...tpl.surfaces, dossierTabs: sortedDos } });
          },
        });
        secRow.append(slot);
      }
      box.append(secRow);
      dosCard.append(box);
    });

    const addDosRow = el('div', 'ls-row');
    const newDosIcon = el('input', 'ls-input');
    newDosIcon.style.width = '50px';
    newDosIcon.value = '⚔️';
    const newDosLbl = el('input', 'ls-input');
    newDosLbl.style.flex = '1';
    newDosLbl.placeholder = 'New Dossier Tab (e.g. Combat Arts, Wardrobe)…';
    addDosRow.append(
      newDosIcon,
      newDosLbl,
      iconBtn(
        'plus',
        () => {
          const lbl = newDosLbl.value.trim();
          if (!lbl) return;
          const created: DossierTabConfig = {
            id: slugifyKey(lbl, `dtab_${sortedDos.length + 1}`),
            label: lbl,
            icon: newDosIcon.value.trim() || '✨',
            kind: 'custom',
            enabled: true,
            order: sortedDos.length,
            showMeters: true,
            showFields: true,
            showSecrets: false,
            showAudit: false,
            showNpcBonds: false,
          };
          saveTemplatePatch({ surfaces: { ...tpl.surfaces, dossierTabs: [...sortedDos, created] } });
        },
        { label: 'Add Dossier Tab', className: 'ls-btn-sm ls-btn-primary' },
      ),
    );
    dosCard.append(addDosRow);
    wrap.append(dosCard);
  } else if (activeExtremeSubTab === 'matrix') {
    const matrixCard = el('section', 'ls-card');
    matrixCard.append(
      el('h3', '', 'Stat Placement Matrix'),
      el('p', 'ls-muted', 'Choose which surfaces and tabs display each stat.'),
    );
    const sortedDos = [...tpl.surfaces.dossierTabs].sort((a, b) => a.order - b.order);

    for (const s of tpl.stats) {
      const mRow = el('div', 'ls-stat-cell');
      const top = el('div', 'ls-row-between');
      const actBtns = el('div', 'ls-row');
      actBtns.append(
        iconBtn('copy', () => openDuplicateStatModal(ctrl, s), {
          label: 'Duplicate',
          className: 'ls-btn-sm ls-btn-ghost',
        }),
        iconBtn('edit', () => openStatSchemaModal(ctrl, s.scope, s), {
          label: 'Edit',
          className: 'ls-btn-sm',
        }),
      );
      top.append(el('strong', '', `${s.icon} ${s.label} (${s.scope})`), actBtns);
      mRow.append(top);

      const visCluster = el('div', 'ls-row');
      for (const [vKey, vLbl] of [
        ['widget', 'Widget'],
        ['inline', 'Inline'],
        ['dossier', 'Dossier'],
        ['pinnedHeader', 'Pill'],
      ] as const) {
        const slot = el('div');
        mountNativeCheckbox(ctrl, compScope, slot, {
          checked: Boolean(s.showIn?.[vKey]),
          label: vLbl,
          onChange: on => {
            s.showIn = { ...s.showIn, [vKey]: on };
            if (vKey === 'pinnedHeader') s.pinnedToHeader = on;
            saveTemplatePatch({ stats: tpl.stats });
          },
        });
        visCluster.append(slot);
      }

      const wSlot = el('div');
      mountThemedSelect(ctrl, compScope, wSlot, {
        value: s.widgetTabId || (s.scope === 'character' ? 'cast' : 'stats'),
        compact: true,
        ariaLabel: 'Widget Tab',
        options: tpl.surfaces.widgetTabs.map(wt => ({ value: wt.id, label: `Widget: ${wt.label}` })),
        onChange: nextW => {
          s.widgetTabId = nextW;
          saveTemplatePatch({ stats: tpl.stats });
        },
      });

      const iSlot = el('div');
      mountThemedSelect(ctrl, compScope, iSlot, {
        value: s.inlineTabId || (s.scope === 'character' ? 'cast' : 'stats'),
        compact: true,
        ariaLabel: 'Inline Tab',
        options: tpl.surfaces.inlineTabs.map(it => ({ value: it.id, label: `Inline: ${it.label}` })),
        onChange: nextI => {
          s.inlineTabId = nextI;
          saveTemplatePatch({ stats: tpl.stats });
        },
      });

      const dSlot = el('div');
      mountThemedSelect(ctrl, compScope, dSlot, {
        value: s.dossierTabId || 'bonds',
        compact: true,
        ariaLabel: 'Dossier Tab',
        options: sortedDos.map(dt => ({ value: dt.id, label: `Dossier: ${dt.label}` })),
        onChange: nextD => {
          s.dossierTabId = nextD;
          saveTemplatePatch({ stats: tpl.stats });
        },
      });

      visCluster.append(wSlot, iSlot, dSlot);
      mRow.append(visCluster);
      matrixCard.append(mRow);
    }
    wrap.append(matrixCard);
  } else {
    const htmlCard = el('section', 'ls-card');
    const head = el('div', 'ls-row-between');
    head.append(
      el('h3', '', 'Scene Pill Chips & Custom HTML Banners'),
      btn('Edit Scene Pill Prompts', () => openScenePillEditorModal(ctrl), 'ls-btn-sm ls-btn-primary'),
    );
    htmlCard.append(
      head,
      el('p', 'ls-muted', 'Custom banners support {{location}}, {{time}}, {{date}}, {{weather}}, {{player_attire}}, {{name}}, and {{stat:id}}.'),
    );

    const chipsGrid = el('div', 'ls-grid');
    for (const [k, lbl] of [
      ['time', 'Time Chip'],
      ['date', 'Date Chip'],
      ['location', 'Location Chip'],
      ['weather', 'Weather Chip'],
      ['cast', 'Present Cast Chips'],
      ['pinnedStats', 'Pinned Stat Chips'],
    ] as const) {
      const slot = el('div');
      mountNativeCheckbox(ctrl, compScope, slot, {
        checked: tpl.theme.showSceneChips[k],
        label: lbl,
        onChange: on => {
          tpl.theme.showSceneChips[k] = on;
          saveTemplatePatch({ theme: tpl.theme });
        },
      });
      chipsGrid.append(slot);
    }
    htmlCard.append(chipsGrid);

    const wHtml = el('textarea', 'ls-input');
    wHtml.rows = 2;
    wHtml.placeholder = 'Custom Widget HTML Banner…';
    wHtml.value = tpl.surfaces.customWidgetHtml || '';

    const iHtml = el('textarea', 'ls-input');
    iHtml.rows = 2;
    iHtml.placeholder = 'Custom Inline Ribbon HTML Banner…';
    iHtml.value = tpl.surfaces.customInlineHtml || '';

    const dHtml = el('textarea', 'ls-input');
    dHtml.rows = 2;
    dHtml.placeholder = 'Custom Character Dossier HTML Banner…';
    dHtml.value = tpl.surfaces.customDossierHtml || '';

    htmlCard.append(
      wHtml,
      iHtml,
      dHtml,
      btn('Apply Custom HTML Banners', () => {
        saveTemplatePatch({
          surfaces: {
            ...tpl.surfaces,
            customWidgetHtml: wHtml.value.trim(),
            customInlineHtml: iHtml.value.trim(),
            customDossierHtml: dHtml.value.trim(),
          },
        });
      }, 'ls-btn-sm ls-btn-primary'),
    );
    wrap.append(htmlCard);
  }

  return wrap;
}
