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
  saveTemplatePatch: (
    patch:
      | Partial<LumiStatsTemplate>
      | ((live: LumiStatsTemplate) => Partial<LumiStatsTemplate>),
    reason?: string,
  ) => void,
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
        onChange: on => saveTemplatePatch(live => ({ surfaces: { ...live.surfaces, [fKey]: on } })),
      });
      featureGrid.append(slot);
    }
    featureCard.append(featureGrid);
    wrap.append(featureCard);

    const buildSurfaceTabEditor = (
      title: string,
      surfaceKey: 'widgetTabs' | 'inlineTabs',
      tabs: SurfaceTabConfig[],
    ): HTMLElement => {
      const card = el('section', 'ls-card');
      card.append(el('h3', '', title));
      const sorted = [...tabs].sort((a, b) => a.order - b.order);
      const commitTabs = (updater: (liveTabs: SurfaceTabConfig[]) => SurfaceTabConfig[]) => {
        saveTemplatePatch(live => {
          const curSorted = [...live.surfaces[surfaceKey]].sort((a, b) => a.order - b.order);
          return {
            surfaces: {
              ...live.surfaces,
              [surfaceKey]: updater(curSorted),
            },
          };
        });
      };

      sorted.forEach((tab, idx) => {
        const row = el('div', 'ls-stat-row-compact');
        const left = el('div', 'ls-row');
        const swSlot = el('div');
        mountNativeSwitch(ctrl, compScope, swSlot, {
          checked: tab.enabled,
          ariaLabel: `Toggle ${tab.label}`,
          onChange: on => {
            commitTabs(liveTabs => liveTabs.map(t => (t.id === tab.id ? { ...t, enabled: on } : t)));
          },
        });

        const iconInp = el('input', 'ls-input');
        iconInp.style.cssText = 'width:44px;min-height:28px;padding:2px 6px;';
        iconInp.value = tab.icon;
        iconInp.addEventListener('change', () => {
          const nextIcon = iconInp.value.trim() || '📊';
          commitTabs(liveTabs => liveTabs.map(t => (t.id === tab.id ? { ...t, icon: nextIcon } : t)));
        });

        const lblInp = el('input', 'ls-input');
        lblInp.style.cssText = 'width:130px;min-height:28px;padding:2px 8px;';
        lblInp.value = tab.label;
        lblInp.addEventListener('change', () => {
          const nextLabel = lblInp.value.trim() || tab.label;
          commitTabs(liveTabs => liveTabs.map(t => (t.id === tab.id ? { ...t, label: nextLabel } : t)));
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
            commitTabs(liveTabs =>
              liveTabs.map(t =>
                t.id === tab.id ? { ...t, kind: nextKind as SurfaceTabConfig['kind'] } : t,
              ),
            );
          },
        });

        left.append(swSlot, iconInp, lblInp, kindSlot);

        const right = el('div', 'ls-row');
        if (idx > 0) {
          right.append(
            btn('↑', () => {
              commitTabs(liveTabs => {
                const curIdx = liveTabs.findIndex(t => t.id === tab.id);
                if (curIdx <= 0) return liveTabs;
                const nextList = [...liveTabs];
                [nextList[curIdx - 1], nextList[curIdx]] = [nextList[curIdx]!, nextList[curIdx - 1]!];
                return nextList.map((t, i) => ({ ...t, order: i }));
              });
            }, 'ls-btn-sm ls-btn-icon ls-btn-ghost'),
          );
        }
        if (idx < sorted.length - 1) {
          right.append(
            btn('↓', () => {
              commitTabs(liveTabs => {
                const curIdx = liveTabs.findIndex(t => t.id === tab.id);
                if (curIdx < 0 || curIdx >= liveTabs.length - 1) return liveTabs;
                const nextList = [...liveTabs];
                [nextList[curIdx], nextList[curIdx + 1]] = [nextList[curIdx + 1]!, nextList[curIdx]!];
                return nextList.map((t, i) => ({ ...t, order: i }));
              });
            }, 'ls-btn-sm ls-btn-icon ls-btn-ghost'),
          );
        }
        if (sorted.length > 1) {
          right.append(
            iconBtn(
              'trash',
              () => commitTabs(liveTabs => liveTabs.filter(t => t.id !== tab.id)),
              {
                className: 'ls-btn-sm ls-btn-icon ls-btn-ghost ls-btn-danger',
                title: 'Delete tab',
              },
            ),
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
            const icon = newIcon.value.trim() || '✨';
            commitTabs(liveTabs => [
              ...liveTabs,
              {
                id: slugifyKey(lbl, `tab_${liveTabs.length + 1}`),
                label: lbl,
                icon,
                kind: 'custom',
                enabled: true,
                order: liveTabs.length,
              },
            ]);
          },
          { label: 'Add Tab', className: 'ls-btn-sm ls-btn-primary' },
        ),
      );
      card.append(addRow);
      return card;
    };

    wrap.append(
      buildSurfaceTabEditor('Floating HUD Widget Tabs', 'widgetTabs', tpl.surfaces.widgetTabs),
      buildSurfaceTabEditor('Inline Message Ribbon Tabs', 'inlineTabs', tpl.surfaces.inlineTabs),
    );
  } else if (activeExtremeSubTab === 'dossier') {
    const dosCard = el('section', 'ls-card');
    dosCard.append(el('h3', '', 'Character Dossier Tabs'));
    const sortedDos = [...tpl.surfaces.dossierTabs].sort((a, b) => a.order - b.order);

    sortedDos.forEach((dTab, idx) => {
      const box = el('div', 'ls-stat-cell');
      const top = el('div', 'ls-row-between');
      const left = el('div', 'ls-row');
      const commitDosTabs = (updater: (liveTabs: DossierTabConfig[]) => DossierTabConfig[]) => {
        saveTemplatePatch(live => {
          const curSorted = [...live.surfaces.dossierTabs].sort((a, b) => a.order - b.order);
          return {
            surfaces: {
              ...live.surfaces,
              dossierTabs: updater(curSorted),
            },
          };
        });
      };

      const swSlot = el('div');
      mountNativeSwitch(ctrl, compScope, swSlot, {
        checked: dTab.enabled,
        onChange: on => {
          commitDosTabs(liveTabs => liveTabs.map(x => (x.id === dTab.id ? { ...x, enabled: on } : x)));
        },
      });
      const icInp = el('input', 'ls-input');
      icInp.style.cssText = 'width:44px;min-height:28px;padding:2px 6px;';
      icInp.value = dTab.icon;
      icInp.addEventListener('change', () => {
        const nextIcon = icInp.value.trim() || '🪪';
        commitDosTabs(liveTabs => liveTabs.map(x => (x.id === dTab.id ? { ...x, icon: nextIcon } : x)));
      });
      const lbInp = el('input', 'ls-input');
      lbInp.style.cssText = 'width:150px;min-height:28px;padding:2px 8px;';
      lbInp.value = dTab.label;
      lbInp.addEventListener('change', () => {
        const nextLabel = lbInp.value.trim() || dTab.label;
        commitDosTabs(liveTabs => liveTabs.map(x => (x.id === dTab.id ? { ...x, label: nextLabel } : x)));
      });
      left.append(swSlot, icInp, lbInp);

      const right = el('div', 'ls-row');
      if (idx > 0) {
        right.append(
          btn('↑', () => {
            commitDosTabs(liveTabs => {
              const curIdx = liveTabs.findIndex(x => x.id === dTab.id);
              if (curIdx <= 0) return liveTabs;
              const nextList = [...liveTabs];
              [nextList[curIdx - 1], nextList[curIdx]] = [nextList[curIdx]!, nextList[curIdx - 1]!];
              return nextList.map((t, i) => ({ ...t, order: i }));
            });
          }, 'ls-btn-sm ls-btn-icon ls-btn-ghost'),
        );
      }
      if (idx < sortedDos.length - 1) {
        right.append(
          btn('↓', () => {
            commitDosTabs(liveTabs => {
              const curIdx = liveTabs.findIndex(x => x.id === dTab.id);
              if (curIdx < 0 || curIdx >= liveTabs.length - 1) return liveTabs;
              const nextList = [...liveTabs];
              [nextList[curIdx], nextList[curIdx + 1]] = [nextList[curIdx + 1]!, nextList[curIdx]!];
              return nextList.map((t, i) => ({ ...t, order: i }));
            });
          }, 'ls-btn-sm ls-btn-icon ls-btn-ghost'),
        );
      }
      if (sortedDos.length > 1) {
        right.append(
          iconBtn(
            'trash',
            () => commitDosTabs(liveTabs => liveTabs.filter(x => x.id !== dTab.id)),
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
            commitDosTabs(liveTabs =>
              liveTabs.map(x => (x.id === dTab.id ? { ...x, [prop]: on } : x)),
            );
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
          const icon = newDosIcon.value.trim() || '✨';
          saveTemplatePatch(live => {
            const curDos = [...live.surfaces.dossierTabs].sort((a, b) => a.order - b.order);
            const created: DossierTabConfig = {
              id: slugifyKey(lbl, `dtab_${curDos.length + 1}`),
              label: lbl,
              icon,
              kind: 'custom',
              enabled: true,
              order: curDos.length,
              showMeters: true,
              showFields: true,
              showSecrets: false,
              showAudit: false,
              showNpcBonds: false,
            };
            return { surfaces: { ...live.surfaces, dossierTabs: [...curDos, created] } };
          });
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
            saveTemplatePatch(live => ({
              stats: live.stats.map(st =>
                st.id === s.id
                  ? {
                      ...st,
                      showIn: { ...st.showIn, [vKey]: on },
                      ...(vKey === 'pinnedHeader' ? { pinnedToHeader: on } : {}),
                    }
                  : st,
              ),
            }));
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
          saveTemplatePatch(live => ({
            stats: live.stats.map(st => (st.id === s.id ? { ...st, widgetTabId: nextW } : st)),
          }));
        },
      });

      const iSlot = el('div');
      mountThemedSelect(ctrl, compScope, iSlot, {
        value: s.inlineTabId || (s.scope === 'character' ? 'cast' : 'stats'),
        compact: true,
        ariaLabel: 'Inline Tab',
        options: tpl.surfaces.inlineTabs.map(it => ({ value: it.id, label: `Inline: ${it.label}` })),
        onChange: nextI => {
          saveTemplatePatch(live => ({
            stats: live.stats.map(st => (st.id === s.id ? { ...st, inlineTabId: nextI } : st)),
          }));
        },
      });

      const dSlot = el('div');
      mountThemedSelect(ctrl, compScope, dSlot, {
        value: s.dossierTabId || 'bonds',
        compact: true,
        ariaLabel: 'Dossier Tab',
        options: sortedDos.map(dt => ({ value: dt.id, label: `Dossier: ${dt.label}` })),
        onChange: nextD => {
          saveTemplatePatch(live => ({
            stats: live.stats.map(st => (st.id === s.id ? { ...st, dossierTabId: nextD } : st)),
          }));
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
          saveTemplatePatch(live => ({
            theme: {
              ...live.theme,
              showSceneChips: { ...live.theme.showSceneChips, [k]: on },
            },
          }));
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
        saveTemplatePatch(live => ({
          surfaces: {
            ...live.surfaces,
            customWidgetHtml: wHtml.value.trim(),
            customInlineHtml: iHtml.value.trim(),
            customDossierHtml: dHtml.value.trim(),
          },
        }));
      }, 'ls-btn-sm ls-btn-primary'),
    );
    wrap.append(htmlCard);
  }

  return wrap;
}
