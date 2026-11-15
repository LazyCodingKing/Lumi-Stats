import { formatDayAndClock, resolveAnchorLabel } from '../../shared/formula';
import {
  isDossierFieldEnabled,
  isTextLikeStat,
  resolveCharacterFieldValue,
} from '../../shared/prompt-compiler';
import { defaultDossierFields, slugifyKey } from '../../shared/templates';
import type {
  CharacterRecord,
  DossierFieldDef,
  DossierFieldDisplayStyle,
} from '../../shared/types';
import {
  bindContextMenuWithLongPress,
  btn,
  el,
  iconBtn,
  mountNativeCheckbox,
  mountThemedSelect,
  type ComponentScope,
  type LumiFrontendController,
} from '../controller';
import { openNpcBondEditorModal } from './RelationshipWeb';
import {
  renderAttributesWidget,
  renderCurrencyWidget,
  renderHeartsWidget,
  renderInventoryWidget,
  renderSkillTreeWidget,
  renderStatusFxWidget,
  renderXpLevelWidget,
} from './RpgWidgets';
import { openVoiceAssignmentModal } from './VnStage';
import {
  interpolateBannerTemplate,
  mountSanitizedHtml,
  openDuplicateStatModal,
  openSandboxTesterModal,
  openStatSchemaModal,
  parseStructuredStatText,
  renderStatSchemaCards,
  renderStructuredTextStatBody,
} from './StatGrid';

/**
 * Opens a modal to create or edit any Character Dossier Field (including built-ins
 * like Immediate Goal, Inner Monologue, Attire, Demeanor, and Role Summary).
 */
export function openDossierFieldModal(
  ctrl: LumiFrontendController,
  existing?: DossierFieldDef,
): void {
  const tpl = structuredClone(ctrl.snapshot.template);
  const sortedDos = [...tpl.surfaces.dossierTabs].sort((a, b) => a.order - b.order);

  ctrl.modals.open(
    {
      title: existing
        ? `✏️ Edit Character Dossier Field: ${existing.label}`
        : '➕ Create Character Dossier Field',
      width: 580,
    },
    (body, close, _handle, modalScope) => {
      const topGrid = el('div', 'ls-grid');
      const iconWrap = el('label', 'ls-label', 'Field Icon');
      const iconInp = el('input', 'ls-input');
      iconInp.value = existing?.icon ?? '✨';
      iconWrap.append(iconInp);

      const labelWrap = el('label', 'ls-label', 'Field Label');
      const labelInp = el('input', 'ls-input');
      labelInp.placeholder = 'e.g. Immediate Goal, Inner Monologue, Secret Agenda…';
      labelInp.value = existing?.label ?? '';
      labelWrap.append(labelInp);
      topGrid.append(iconWrap, labelWrap);
      body.append(topGrid);

      let selectedTabId = existing?.tabId ?? (sortedDos[0]?.id || 'overview');
      let selectedStyle: DossierFieldDisplayStyle = existing?.displayStyle ?? 'card';

      const styleGrid = el('div', 'ls-grid');
      const tabWrap = el('div', 'ls-label', '🪪 Target Dossier Tab');
      const tabSlot = el('div');
      tabWrap.append(tabSlot);

      const styleWrap = el('div', 'ls-label', '🎨 Visual Display Style');
      const styleSlot = el('div');
      styleWrap.append(styleSlot);

      styleGrid.append(tabWrap, styleWrap);
      body.append(styleGrid);

      mountThemedSelect(ctrl, modalScope, tabSlot, {
        value: selectedTabId,
        ariaLabel: 'Target Dossier Tab',
        options: sortedDos.map(dt => ({ value: dt.id, label: `${dt.icon} ${dt.label}` })),
        onChange: v => {
          selectedTabId = v;
        },
      });

      mountThemedSelect(ctrl, modalScope, styleSlot, {
        value: selectedStyle,
        ariaLabel: 'Visual Display Style',
        options: [
          { value: 'card', label: '🗂️ Info Card (supports structured "->" chains)' },
          { value: 'quote', label: '💭 Quote / Inner Monologue Box' },
          { value: 'pills', label: '🏷️ Tag / Item Pills (comma-separated)' },
          { value: 'badge', label: '🪪 Portrait Header Badge' },
        ],
        onChange: v => {
          selectedStyle = v as DossierFieldDisplayStyle;
        },
      });

      let selectedSpan = existing?.layoutSpan ?? 'auto';
      let selectedColor = existing?.color || 'var(--lumiverse-primary)';
      let enabled = existing?.enabled ?? true;
      let showInHudCast = existing?.showInHudCast ?? false;
      let showInInlineCast = existing?.showInInlineCast ?? false;
      let locked = existing?.locked ?? false;

      const spanWrap = el('div', 'ls-label', 'Card Grid Width');
      const spanSlot = el('div');
      spanWrap.append(spanSlot);
      body.append(spanWrap);
      mountThemedSelect(ctrl, modalScope, spanSlot, {
        value: selectedSpan,
        ariaLabel: 'Card Grid Width',
        options: [
          { value: 'auto', label: '📐 Auto' },
          { value: 'full', label: '↔️ Full Width' },
          { value: 'half', label: '▫ Compact Column' },
        ],
        onChange: v => {
          selectedSpan = v as typeof selectedSpan;
        },
      });

      const colorWrap = el('div', 'ls-label', 'Accent Color');
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

      const instWrap = el('div', 'ls-label');
      const instHead = el('div', 'ls-row-between');
      const instInp = el('textarea', 'ls-input');
      instInp.rows = 3;
      instInp.placeholder = 'Tell the AI when and how to update this field for each character…';
      instInp.value = existing?.instruction ?? '';
      instHead.append(
        el('span', '', 'AI Extraction Prompt Instruction'),
        btn('⛶ Full-Screen Editor', () => {
          void ctrl
            .request('textEditor:open', {
              title: `Character Field Prompt: ${labelInp.value || 'Field'}`,
              value: instInp.value,
              placeholder: 'Describe how the AI should update this character field…',
            })
            .then(res => {
              if (!res.cancelled && typeof res.text === 'string') {
                instInp.value = res.text;
              }
            });
        }, 'ls-btn-sm'),
      );
      instWrap.append(instHead, instInp);
      body.append(instWrap);

      const flagsGrid = el('div', 'ls-grid');
      for (const [lbl, initVal, setter] of [
        ['Enabled', enabled, (v: boolean) => { enabled = v; }],
        ['Show on HUD Cast Card', showInHudCast, (v: boolean) => { showInHudCast = v; }],
        ['Show on Inline Cast Card', showInInlineCast, (v: boolean) => { showInInlineCast = v; }],
        ['Lock Value', locked, (v: boolean) => { locked = v; }],
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

      const btnRow = el('div', 'ls-row-between');
      btnRow.style.marginTop = '12px';

      const leftBtns = el('div', 'ls-row');
      if (existing) {
        leftBtns.append(
          btn('Delete Field', () => {
            void ctrl.request('state:mutate', {
              templatePatch: {
                dossierFields: tpl.dossierFields.filter(f => f.id !== existing.id),
              },
              reason: `Deleted dossier field "${existing.label}"`,
            });
            close();
          }, 'ls-btn-sm ls-btn-danger'),
        );
      }

      const saveBtn = btn(existing ? 'Save Field' : 'Add Field', () => {
        const label = labelInp.value.trim();
        if (!label) return;
        const updated: DossierFieldDef = {
          id: existing?.id ?? slugifyKey(label, 'field'),
          label,
          icon: iconInp.value.trim() || '✨',
          placeholder: existing?.placeholder || label,
          instruction: instInp.value.trim() || `Update ${label} when established in the scene.`,
          tabId: selectedTabId,
          displayStyle: selectedStyle,
          showInHudCast,
          showInInlineCast,
          color: selectedColor,
          layoutSpan: selectedSpan,
          enabled,
          locked,
        };
        const idx = tpl.dossierFields.findIndex(f => f.id === updated.id);
        if (idx >= 0) tpl.dossierFields[idx] = updated;
        else tpl.dossierFields.push(updated);

        void ctrl.request('state:mutate', {
          templatePatch: { dossierFields: tpl.dossierFields },
          reason: `Saved dossier field "${updated.label}"`,
        });
        close();
      }, 'ls-btn-primary');

      btnRow.append(leftBtns, saveBtn);
      body.append(btnRow);
    },
  );
}

export function openAuditLogModal(
  ctrl: LumiFrontendController,
  actorId?: string,
): void {
  const { state } = ctrl.snapshot;
  const entries = [...state.auditLog]
    .filter(a => !actorId || a.actorId === actorId)
    .reverse();

  ctrl.modals.open(
    { title: `📈 Stat Calibration & Shift Audit Log (${entries.length})`, width: 640, maxHeight: 740 },
    (body, close) => {
      if (!entries.length) {
        body.append(el('p', 'ls-muted', 'No stat calibrations or shifts recorded yet.'));
        return;
      }

      const list = el('div', 'ls-stack');
      for (const item of entries) {
        const card = el('div', 'ls-stat-cell');
        const top = el('div', 'ls-row-between');
        const left = el('div', 'ls-row');
        const actorName = item.actorId ? state.characters[item.actorId]?.name : undefined;
        left.append(
          el('strong', '', `${actorName ? `${actorName} · ` : ''}${item.statLabel}`),
          el('span', 'ls-chip', item.op === 'set' ? '🎯 Calibrated / Set' : 'Δ Shift'),
          el('span', 'ls-chip ls-chip-accent', `${String(item.before ?? 'uncalibrated')} → ${String(item.after)}`),
        );

        const right = el('div', 'ls-row');
        right.append(el('small', 'ls-muted', `Turn ${item.turn} · ${formatDayAndClock(item.minute)}`));
        if (item.before !== null) {
          right.append(
            btn(`↺ Revert to ${String(item.before)}`, () => {
              if (item.actorId) {
                const actor = state.characters[item.actorId];
                if (actor) {
                  void ctrl.request('state:mutate', {
                    patch: {
                      characters: [
                        {
                          id: actor.id,
                          name: actor.name,
                          meters: {
                            [item.statId]: { op: 'set', value: item.before!, reason: 'Reverted from audit log' },
                          },
                        },
                      ],
                    },
                    reason: `Reverted ${actor.name} ${item.statLabel} to ${String(item.before)}`,
                  });
                }
              } else {
                void ctrl.request('state:mutate', {
                  patch: {
                    stats: {
                      [item.statId]: { op: 'set', value: item.before!, reason: 'Reverted from audit log' },
                    },
                  },
                  reason: `Reverted ${item.statLabel} to ${String(item.before)}`,
                });
              }
              close();
            }, 'ls-btn-sm'),
          );
        }
        top.append(left, right);
        card.append(top);
        if (item.reason) {
          card.append(el('small', 'ls-muted', `Evidence: ${item.reason}`));
        }
        list.append(card);
      }
      body.append(list);
    },
  );
}

export function openCharacterDossierModal(
  ctrl: LumiFrontendController,
  actorId: string,
): void {
  ctrl.selectedActorId = actorId;
  ctrl.modals.open(
    { title: '🪪 Character Dossier', width: 880, maxHeight: 820 },
    (body, _close, handle, modalScope) => {
      const redraw = () => {
        modalScope.clear();
        const actor =
          ctrl.snapshot.state.characters[ctrl.selectedActorId] ??
          Object.values(ctrl.snapshot.state.characters)[0];
        if (actor) handle.setTitle(`🪪 ${actor.name} — Character Dossier`);
        body.replaceChildren(renderCastDossierSurface(ctrl, modalScope));
      };
      redraw();
      const unsub = ctrl.subscribe(redraw);
      handle.onDismiss(unsub);
    },
  );
}

export function renderCastDossierSurface(
  ctrl: LumiFrontendController,
  compScope?: ComponentScope,
): HTMLElement {
  const { state, template, deltas } = ctrl.snapshot;
  const wrap = el('div', 'ls-stack');

  const actors = Object.values(state.characters).sort(
    (a, b) => Number(b.present) - Number(a.present),
  );
  const activeActor: CharacterRecord | undefined =
    (ctrl.selectedActorId ? state.characters[ctrl.selectedActorId] : undefined) ?? actors[0];

  const rosterBar = el('div', 'ls-row-between');
  const pills = el('div', 'ls-row');
  for (const peer of actors) {
    const b = btn(
      `${peer.present ? '🟢' : '⚪'} ${peer.name}`,
      () => {
        ctrl.selectedActorId = peer.id;
        ctrl.emitChange();
      },
      'ls-btn-sm',
    );
    if (peer.id === activeActor?.id) b.setAttribute('aria-current', 'page');
    pills.append(b);
  }

  const actions = el('div', 'ls-row');
  if (activeActor) {
    actions.append(
      btn(
        ctrl.dossierEditMode ? '✓ Done Editing' : '✏️ Edit Values',
        () => {
          ctrl.dossierEditMode = !ctrl.dossierEditMode;
          ctrl.emitChange();
        },
        `ls-btn-sm ${ctrl.dossierEditMode ? 'ls-btn-primary' : ''}`,
      ),
      btn(
        activeActor.ttsVoice?.voiceId ? `🔊 Voice (${activeActor.ttsVoice.voiceId})` : '🔊 Voice',
        () => openVoiceAssignmentModal(ctrl, activeActor.id),
        'ls-btn-sm',
        `Assign TTS Voice for ${activeActor.name}`,
      ),
      btn('+ Stat', () => openStatSchemaModal(ctrl, 'character'), 'ls-btn-sm', 'Add a character stat or meter'),
      btn('+ Field', () => openDossierFieldModal(ctrl), 'ls-btn-sm', 'Add a custom field to character dossiers'),
      btn('📈 Audit Log', () => openAuditLogModal(ctrl, activeActor.id), 'ls-btn-sm'),
    );
  }
  actions.append(
    btn('+ Add Character', () => {
      ctrl.modals.open({ title: '➕ Add Character to Cast', width: 460 }, (mBody, close) => {
        const nameWrap = el('label', 'ls-label', 'Character Name');
        const nameInp = el('input', 'ls-input');
        nameWrap.append(nameInp);

        const roleWrap = el('label', 'ls-label', 'Role & Relationship to Player');
        const roleInp = el('input', 'ls-input');
        roleInp.placeholder = 'e.g. Loyal personal maid, Childhood rival…';
        roleWrap.append(roleInp);

        const attireWrap = el('label', 'ls-label', 'Starting Attire');
        const attireInp = el('input', 'ls-input');
        attireWrap.append(attireInp);

        const saveBtn = btn('➕ Create Character', () => {
          const name = nameInp.value.trim();
          if (!name) return;
          const id = slugifyKey(name, 'npc');
          ctrl.selectedActorId = id;
          void ctrl.request('state:mutate', {
            patch: {
              characters: [
                {
                  id,
                  name,
                  present: true,
                  roleSummary: roleInp.value.trim() || 'Character',
                  attire: attireInp.value.trim(),
                },
              ],
            },
            reason: `Added character "${name}"`,
          });
          close();
        }, 'ls-btn-primary');
        mBody.append(nameWrap, roleWrap, attireWrap, saveBtn);
      });
    }, 'ls-btn-sm ls-btn-primary'),
  );
  rosterBar.append(pills, actions);
  wrap.append(rosterBar);

  if (!activeActor) {
    const empty = el('div', 'ls-card');
    empty.append(
      el('strong', '', 'No characters in cast yet'),
      el('p', 'ls-muted', 'Characters are calibrated automatically on Turn 1, or click "+ Add Character" above.'),
    );
    wrap.append(empty);
    return wrap;
  }

  if (template.surfaces.customDossierHtml) {
    const customBanner = el('div', 'ls-card');
    wrap.append(customBanner);
    mountSanitizedHtml(
      customBanner,
      interpolateBannerTemplate(template.surfaces.customDossierHtml, state),
      ctrl.ctx,
    );
  }

  const demeanorVal = resolveCharacterFieldValue(activeActor, 'demeanor');
  const roleVal = resolveCharacterFieldValue(activeActor, 'role_summary');
  const emotionKey = (demeanorVal || 'neutral').toLowerCase();
  const exprUrl = activeActor.expressionAssets[emotionKey]?.url ?? activeActor.portraitUrl;
  const showFullRail = Boolean(exprUrl || ctrl.dossierEditMode);

  const shell = el('article', 'ls-dossier-shell');
  if (!showFullRail) {
    shell.dataset.noPortrait = 'true';
  }

  const statusChips = el('div', 'ls-row');
  statusChips.append(
    btn(
      activeActor.present ? '🟢 In Scene' : '⚪ Away',
      () => {
        void ctrl.request('state:mutate', {
          patch: {
            characters: [
              {
                id: activeActor.id,
                name: activeActor.name,
                present: !activeActor.present,
                ...( !activeActor.present && state.scene.location ? { location: state.scene.location } : {} ),
              },
            ],
          },
          reason: `Marked ${activeActor.name} as ${!activeActor.present ? 'In Scene' : 'Away'}`,
        });
      },
      `ls-btn-sm ls-presence-pill ${activeActor.present ? 'ls-chip-accent' : ''}`,
      'Click to toggle In Scene / Away',
    ),
  );
  for (const bf of template.dossierFields.filter(
    f => f.enabled && f.displayStyle === 'badge' && f.id !== 'role_summary',
  )) {
    const bVal = resolveCharacterFieldValue(activeActor, bf.id);
    if (bVal) {
      statusChips.append(el('span', 'ls-chip', `${bf.icon} ${bVal}`));
    }
  }

  if (showFullRail) {
    // Full Portrait Rail when character has an uploaded portrait or user is editing
    const rail = el('aside', 'ls-dossier-rail');
    const portraitBox = el('div', 'ls-dossier-portrait');
    if (exprUrl) {
      const img = el('img');
      img.src = exprUrl;
      img.alt = activeActor.name;
      portraitBox.append(img);
    } else {
      portraitBox.append(el('span', 'ls-dossier-initial', activeActor.name[0]?.toUpperCase() ?? '?'));
    }
    rail.append(portraitBox);

    const overlay = el('div', 'ls-dossier-overlay');
    overlay.append(statusChips, el('h2', '', activeActor.name));
    if (isDossierFieldEnabled(template, 'role_summary') && roleVal) {
      overlay.append(el('div', 'ls-muted', roleVal));
    }

    if (ctrl.dossierEditMode) {
      const railBtns = el('div', 'ls-row');
      railBtns.append(
        btn('🖼️ Portrait', () => ctrl.pickAndUploadImage(activeActor.id, 'portrait'), 'ls-btn-sm ls-btn-primary'),
        btn(
          `🎭 Expression (${emotionKey})`,
          () => ctrl.pickAndUploadImage(activeActor.id, 'expression', emotionKey),
          'ls-btn-sm',
          `Upload expression sprite for "${emotionKey}" demeanor`,
        ),
        btn(
          activeActor.present ? 'Mark Off-Screen' : 'Mark Present',
          () => {
            void ctrl.request('state:mutate', {
              patch: {
                characters: [{ id: activeActor.id, name: activeActor.name, present: !activeActor.present }],
              },
              reason: `Toggled presence for ${activeActor.name}`,
            });
          },
          'ls-btn-sm',
        ),
      );
      overlay.append(railBtns);
    }
    rail.append(overlay);
    shell.append(rail);
  }

  // Right / Main Column — Driven 100% by `template.surfaces.dossierTabs` and `template.dossierFields`
  const main = el('div', 'ls-dossier-main');

  if (!showFullRail) {
    // Sleek Character Identity Hero Banner instead of a barren 35% empty gray column
    const heroHeader = el('header', 'ls-dossier-compact-hero');
    const leftIdentity = el('div', 'ls-row');
    const monogram = el('div', 'ls-dossier-monogram', activeActor.name.slice(0, 2).toUpperCase());
    const titleStack = el('div');
    titleStack.append(el('h2', '', activeActor.name));
    if (isDossierFieldEnabled(template, 'role_summary') && roleVal) {
      titleStack.append(el('div', 'ls-muted', roleVal));
    }
    leftIdentity.append(monogram, titleStack);

    const rightMeta = el('div', 'ls-row');
    rightMeta.append(
      statusChips,
      btn(
        '🖼️ + Portrait',
        () => ctrl.pickAndUploadImage(activeActor.id, 'portrait'),
        'ls-btn-sm',
        `Upload portrait for ${activeActor.name}`,
      ),
    );
    heroHeader.append(leftIdentity, rightMeta);
    main.append(heroHeader);
  }

  const enabledDosTabs = [...template.surfaces.dossierTabs]
    .filter(t => t.enabled)
    .sort((a, b) => a.order - b.order);
  const currentTab =
    enabledDosTabs.find(t => t.id === ctrl.activeDossierTab) ??
    enabledDosTabs[0] ?? {
      id: 'overview',
      label: 'Overview',
      icon: '✨',
      kind: 'overview' as const,
      enabled: true,
      order: 0,
      showMeters: true,
      showFields: true,
      showSecrets: false,
      showAudit: false,
    };

  if (enabledDosTabs.length > 1) {
    const tabStrip = el('div', 'ls-subnav-pills');
    for (const dt of enabledDosTabs) {
      const b = btn(`${dt.icon} ${dt.label}`, () => {
        ctrl.activeDossierTab = dt.id;
        ctrl.emitChange();
      }, 'ls-btn-sm');
      if (dt.id === currentTab.id) b.setAttribute('aria-current', 'page');
      tabStrip.append(b);
    }
    main.append(tabStrip);
  }

  if (currentTab.customHtml) {
    const customBox = el('div', 'ls-card');
    main.append(customBox);
    mountSanitizedHtml(customBox, interpolateBannerTemplate(currentTab.customHtml, state), ctrl.ctx);
  }

  const enabledDosTabIds = new Set(enabledDosTabs.map(t => t.id));
  const fallbackDosTabId = enabledDosTabs[0]?.id ?? 'overview';

  // 1. Dossier Fields (`showFields`) — strictly routed by `f.tabId`
  if (currentTab.showFields) {
    const tabFields = template.dossierFields.filter(f => {
      if (!f.enabled || f.id === 'role_summary' || f.displayStyle === 'badge') return false;
      const targetTab = f.tabId && enabledDosTabIds.has(f.tabId) ? f.tabId : fallbackDosTabId;
      return targetTab === currentTab.id;
    });

    if (!ctrl.dossierEditMode) {
      for (const qf of tabFields.filter(f => f.displayStyle === 'quote')) {
        const val = resolveCharacterFieldValue(activeActor, qf.id);
        if (!val) continue;
        const quoteRow = el('div', 'ls-thought-box ls-row-between');
        quoteRow.append(
          el('span', '', `${qf.icon} “${val}”`),
          btn('✏️', () => openDossierFieldModal(ctrl, qf), 'ls-btn-sm ls-btn-icon', `Customize "${qf.label}" field`),
        );
        main.append(quoteRow);
      }

      if (
        currentTab.kind === 'overview' &&
        template.coreTrackers?.trackNpcConditions !== false &&
        activeActor.conditions.length > 0
      ) {
        const condRow = el('div', 'ls-row');
        for (const c of activeActor.conditions) {
          const pill = el('span', 'ls-rpg-fx-pill', `⚡ ${c}`);
          pill.dataset.fxKind = 'neutral';
          condRow.append(pill);
        }
        main.append(condRow);
      }

      const cardFields = tabFields.filter(f => f.displayStyle !== 'quote');
      const infoGrid = el('div', 'ls-grid');
      for (const f of cardFields) {
        const val = resolveCharacterFieldValue(activeActor, f.id);
        if (!val) continue;
        const cell = el('div', 'ls-stat-cell');
        const headRow = el('div', 'ls-row-between');
        headRow.append(
          el('span', 'ls-kicker', `${f.icon} ${f.label}`),
          btn('✏️', () => openDossierFieldModal(ctrl, f), 'ls-btn-sm ls-btn-icon', `Customize "${f.label}" field`),
        );
        cell.append(
          headRow,
          renderStructuredTextStatBody(
            val,
            f.displayStyle === 'pills' ? 'pill_list' : 'auto',
          ),
        );
        infoGrid.append(cell);
      }
      if (infoGrid.childElementCount > 0) main.append(infoGrid);
    } else {
      const editCard = el('div', 'ls-card');
      const editHead = el('div', 'ls-row-between');
      editHead.append(
        el('h3', '', `✏️ Edit ${activeActor.name}'s Dossier Fields`),
        btn('↺ Restore Default Fields', () => {
          void ctrl.request('state:mutate', {
            templatePatch: { dossierFields: defaultDossierFields() },
            reason: 'Restored default dossier fields',
          });
        }, 'ls-btn-sm'),
      );
      editCard.append(editHead);

      const editGrid = el('div', 'ls-grid');
      const fieldInputs = new Map<string, HTMLInputElement | HTMLTextAreaElement>();

      for (const f of template.dossierFields.filter(df => df.enabled)) {
        const wrap = el('div', 'ls-label');
        const labelRow = el('div', 'ls-row-between');
        labelRow.append(
          el('span', '', `${f.icon} ${f.label}`),
          btn('⚙️ Schema', () => openDossierFieldModal(ctrl, f), 'ls-btn-sm', `Edit "${f.label}" schema or delete`),
        );
        const inp =
          f.displayStyle === 'quote'
            ? el('textarea', 'ls-input')
            : el('input', 'ls-input');
        if (inp instanceof HTMLTextAreaElement) inp.rows = 2;
        inp.value = resolveCharacterFieldValue(activeActor, f.id);
        inp.placeholder = f.placeholder || f.label;
        wrap.append(labelRow, inp);
        editGrid.append(wrap);
        fieldInputs.set(f.id, inp);
      }
      const condWrap = el('label', 'ls-label', '⚡ Active Conditions (comma-separated)');
      const condInp = el('input', 'ls-input');
      condInp.value = activeActor.conditions.join(', ');
      condInp.placeholder = 'e.g. Flustered, Holding Tray, Guarded…';
      condWrap.append(condInp);

      const notesWrap = el('label', 'ls-label', '📝 Personal Character Notes');
      const notesInp = el('textarea', 'ls-input');
      notesInp.rows = 2;
      notesInp.value = activeActor.notes || '';
      notesInp.placeholder = 'Optional notes about this character…';
      notesWrap.append(notesInp);

      editCard.append(editGrid, condWrap, notesWrap);

      editCard.append(
        btn('💾 Save Character Details', () => {
          const fields: Record<string, string> = { ...activeActor.fields };
          for (const [k, inp] of fieldInputs.entries()) {
            fields[k] = inp.value.trim();
          }
          const nextConditions = condInp.value
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
          void ctrl.request('state:mutate', {
            patch: {
              characters: [
                {
                  id: activeActor.id,
                  name: activeActor.name,
                  roleSummary: fields.role_summary ?? activeActor.roleSummary,
                  demeanor: fields.demeanor ?? activeActor.demeanor,
                  attire: fields.attire_layers ?? activeActor.attire,
                  immediateGoal: fields.immediate_goal ?? activeActor.immediateGoal,
                  innerThought: fields.inner_thought ?? activeActor.innerThought,
                  conditions: nextConditions,
                  notes: notesInp.value.trim(),
                  fields,
                } as Record<string, unknown> & { name: string },
              ],
            },
            reason: `Updated dossier details for ${activeActor.name}`,
          });
        }, 'ls-btn-primary'),
      );
      main.append(editCard);
    }
  }

  // 2. Character Meters & Dossier-Enabled Stats (`showMeters`) — strictly routed by `s.dossierTabId`
  if (currentTab.showMeters) {
    const charSchemas = template.stats.filter(s => {
      if (!s.enabled || s.scope !== 'character' || s.showIn?.dossier === false) return false;
      const assigned = s.dossierTabId || 'bonds';
      const targetTab = enabledDosTabIds.has(assigned) ? assigned : fallbackDosTabId;
      return targetTab === currentTab.id;
    });

    if (charSchemas.length > 0) {
      const metersGrid = el('div', 'ls-stat-grid');
      const charDeltas = deltas.characterDeltas[activeActor.id] ?? {};

      const mutateCharMeter = (statId: string, statLabel: string, value: number | string | boolean) => {
        void ctrl.request('state:mutate', {
          patch: {
            characters: [
              {
                id: activeActor.id,
                name: activeActor.name,
                meters: {
                  [statId]: { op: 'set', value, reason: 'Manual Dossier adjustment' },
                },
              },
            ],
          },
          reason: `Set ${activeActor.name} ${statLabel} to ${String(value)}`,
        });
      };

      for (const schema of charSchemas) {
        const entry = activeActor.meters[schema.id];
        const isCalibrated = Boolean(entry?.calibrated);
        const val = isCalibrated && entry ? entry.value : schema.defaultValue;
        const isLocked = Boolean(schema.locked || entry?.locked);
        const delta = charDeltas[schema.id] ?? 0;

        const strVal = String(val ?? '');
        const isLongText =
          isCalibrated &&
          typeof val === 'string' &&
          (schema.displayStyle === 'feed_cards' ||
            schema.displayStyle === 'step_chain' ||
            schema.displayStyle === 'pill_list' ||
            schema.displayStyle === 'quote_callout' ||
            strVal.length > 36 ||
            /->|→|\n|;/.test(strVal));

        const cell = el('div', 'ls-stat-cell');
        cell.style.setProperty('--ls-bar-color', schema.color || 'var(--ls-primary)');
        cell.dataset.locked = String(isLocked);
        cell.dataset.uncalibrated = String(!isCalibrated);
        cell.dataset.span =
          schema.layoutSpan === 'full' || (schema.layoutSpan !== 'half' && isLongText)
            ? 'full'
            : 'half';
        if (entry?.lastReason) {
          cell.title = `Evidence: ${entry.lastReason}`;
        }

        const top = el('div', 'ls-row-between');
        top.append(el('strong', '', `${schema.icon} ${schema.label}`));

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
        const valText = !isCalibrated
          ? 'Uncalibrated'
          : schema.kind === 'clock' || schema.kind === 'pips'
            ? `${Number(val) || 0}/${schema.max}`
            : isLongText
              ? `${parseStructuredStatText(strVal).length} entries`
              : strVal;
        const valBadge = el('strong', '', valText);
        right.append(
          valBadge,
          btn('✏️', () => openStatSchemaModal(ctrl, 'character', schema), 'ls-btn-sm ls-btn-icon', 'Edit stat schema'),
        );
        top.append(right);
        cell.append(top);

        if (isCalibrated && typeof val === 'number') {
          const anchorLbl = resolveAnchorLabel(schema.anchors, val);
          if (anchorLbl) {
            cell.append(el('small', 'ls-muted', anchorLbl));
          }
        } else if (!isCalibrated) {
          cell.append(el('small', 'ls-muted', `Volatility: ${schema.volatility} · Calibrates on sync`));
        }

        if (
          entry?.lastReason &&
          !isLongText &&
          entry.lastReason !== state.scene.beatSummary &&
          !/^(?:Scene progression|Manual Dossier adjustment|Manual UI adjustment)$/i.test(entry.lastReason)
        ) {
          cell.append(el('small', 'ls-muted', `↳ ${entry.lastReason}`));
        }

        if (schema.kind === 'skill_tree') {
          cell.append(
            renderSkillTreeWidget(schema, val, isLocked, (nextSerialized, reason) =>
              mutateCharMeter(schema.id, schema.label, nextSerialized),
            ),
          );
        } else if (schema.kind === 'xp_level') {
          cell.append(renderXpLevelWidget(schema, val));
        } else if (schema.kind === 'attributes') {
          cell.append(renderAttributesWidget(schema, val, `${activeActor.id}:${ctrl.chatId}`));
        } else if (schema.kind === 'inventory') {
          cell.append(renderInventoryWidget(val));
        } else if (schema.kind === 'status_fx') {
          cell.append(renderStatusFxWidget(val));
        } else if (schema.kind === 'hearts') {
          cell.append(
            renderHeartsWidget(schema, Number(val) || 0, isCalibrated, isLocked, nextVal =>
              mutateCharMeter(schema.id, schema.label, nextVal),
            ),
          );
        } else if (schema.kind === 'currency') {
          cell.append(renderCurrencyWidget(schema, val as number | string, delta));
        } else if (isCalibrated && isLongText) {
          cell.append(renderStructuredTextStatBody(strVal, schema.displayStyle ?? 'auto'));
        } else if (schema.kind === 'meter' || schema.kind === 'number') {
          const numVal = typeof val === 'number' ? val : 0;
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
            const pct = isCalibrated
              ? Math.max(0, Math.min(100, Math.round(((numVal - schema.min) / span) * 100)))
              : 0;
            fill.style.width = `${pct}%`;
          }
          track.append(fill);
          cell.append(track);

          if (ctrl.dossierEditMode && compScope && ctrl.ctx.components?.mountRangeSlider) {
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
                  onCommit: v => mutateCharMeter(schema.id, schema.label, v),
                }),
              );
            } catch {
              // Ignore if detached
            }
          }
        } else if (schema.kind === 'clock') {
          const segs = Math.max(2, Math.min(16, schema.max || 6));
          const cur = isCalibrated ? Math.max(0, Math.min(segs, Math.round(Number(val) || 0))) : 0;
          const clockBar = el('div', 'ls-clock-bar');
          clockBar.style.gridTemplateColumns = `repeat(${segs}, 1fr)`;
          for (let i = 1; i <= segs; i++) {
            const seg = el('span', `ls-clock-seg${i <= cur ? ' is-filled' : ''}`);
            seg.addEventListener('click', () => mutateCharMeter(schema.id, schema.label, i === cur ? i - 1 : i));
            clockBar.append(seg);
          }
          cell.append(clockBar);
        }

        bindContextMenuWithLongPress(
          ctrl.ctx,
          cell,
          () => [
            { key: 'edit', label: `✏️ Edit "${schema.label}" Schema & Style` },
            { key: 'duplicate', label: `📋 Duplicate "${schema.label}" to Another Scope / Tab…` },
            { key: 'test', label: `🧪 Test "${schema.label}" in Sandbox` },
            { key: 'audit', label: `📈 View Shift History` },
          ],
          selectedKey => {
            if (selectedKey === 'edit') openStatSchemaModal(ctrl, 'character', schema);
            else if (selectedKey === 'duplicate') openDuplicateStatModal(ctrl, schema);
            else if (selectedKey === 'test') openSandboxTesterModal(ctrl, schema.id);
            else if (selectedKey === 'audit') openAuditLogModal(ctrl, activeActor.id);
          },
        );

        metersGrid.append(cell);
      }
      main.append(metersGrid);
    }

    const dossierSharedStats = template.stats.filter(
      s =>
        s.enabled &&
        s.scope === 'player' &&
        s.showIn?.dossier === true &&
        s.dossierTabId === currentTab.id &&
        currentTab.id !== 'bonds',
    );
    if (dossierSharedStats.length > 0) {
      main.append(renderStatSchemaCards(ctrl, dossierSharedStats, 'player', compScope, ctrl.dossierEditMode, false));
    }
  }

  // 2B. NPC-to-NPC Peer Bonds (`showNpcBonds` or `kind === 'peer_bonds'`)
  if (currentTab.showNpcBonds || currentTab.kind === 'peer_bonds') {
    const peerCard = el('div', 'ls-stack');
    const pHead = el('div', 'ls-row-between');
    const bonds = Object.values(activeActor.peerBonds ?? {});
    pHead.append(
      el('h3', '', `🤝 ${activeActor.name}'s Standing & Stats Toward Other NPCs (${bonds.length})`),
      btn('+ Add NPC↔NPC Bond', () => openNpcBondEditorModal(ctrl, activeActor), 'ls-btn-sm ls-btn-primary'),
    );
    peerCard.append(pHead);

    if (!bonds.length) {
      peerCard.append(
        el(
          'p',
          'ls-muted',
          `No NPC-to-NPC relationships recorded for ${activeActor.name} yet. They populate automatically when multiple NPCs interact, or click "+ Add NPC↔NPC Bond" above.`,
        ),
      );
    } else {
      const grid = el('div', 'ls-stat-grid');
      for (const bond of bonds) {
        const cell = el('div', 'ls-stat-cell');
        const top = el('div', 'ls-row-between');
        top.append(
          el('strong', '', `→ 👤 ${bond.toName}`),
          el('div', 'ls-row'),
        );
        (top.lastElementChild as HTMLElement).append(
          el('span', 'ls-chip ls-chip-accent', bond.label),
          btn('✏️', () => openNpcBondEditorModal(ctrl, activeActor, bond), 'ls-btn-sm ls-btn-icon', 'Edit NPC bond'),
          btn('🗑️', () => {
            const nextChar = structuredClone(activeActor);
            delete nextChar.peerBonds[bond.toId];
            void ctrl.request('state:mutate', {
              stateOverride: {
                characters: {
                  ...state.characters,
                  [activeActor.id]: nextChar,
                },
              },
              reason: `Removed peer bond ${activeActor.name} → ${bond.toName}`,
            });
          }, 'ls-btn-sm ls-btn-icon ls-btn-danger', 'Delete NPC bond'),
        );
        cell.append(top);
        if (bond.attitude) {
          cell.append(el('div', 'ls-thought-box', `“${bond.attitude}”`));
        }
        for (const [mKey, mVal] of Object.entries(bond.meters)) {
          const mLabel = mKey.charAt(0).toUpperCase() + mKey.slice(1);
          const mRow = el('div', 'ls-row-between');
          mRow.append(el('small', 'ls-muted', mLabel), el('strong', '', `${mVal}/100`));
          const track = el('div', 'ls-bar-track');
          const fill = el('div', 'ls-bar-fill');
          fill.style.width = `${Math.max(0, Math.min(100, mVal))}%`;
          track.append(fill);
          cell.append(mRow, track);
        }
        grid.append(cell);
      }
      peerCard.append(grid);
    }
    main.append(peerCard);
  }

  // 3. Secrets & Discoveries (`showSecrets`)
  if (currentTab.showSecrets) {
    const secCard = el('div', 'ls-stack');
    secCard.append(el('h3', '', '🕵️ Secrets, Clues & Notes'));
    if (!activeActor.secrets.length) {
      secCard.append(el('p', 'ls-muted', 'No secrets or discoveries recorded for this character yet.'));
    } else {
      for (const s of activeActor.secrets) {
        const cell = el('div', 'ls-stat-cell');
        cell.append(
          el('strong', '', `${s.stage === 'confirmed' ? '🔓' : '🔍'} ${s.title} (${s.stage})`),
          el('p', 'ls-muted', s.detail),
        );
        secCard.append(cell);
      }
    }
    main.append(secCard);
  }

  // 4. Recent Stat Audit Preview (`showAudit`) — only numeric/short shifts so 300-char text logs never bloat pills
  if (currentTab.showAudit) {
    const recent = state.auditLog
      .filter(
        a =>
          a.actorId === activeActor.id &&
          typeof a.after === 'number' &&
          (a.before !== null || a.numericDelta !== 0),
      )
      .slice(-8)
      .reverse();
    if (recent.length > 0) {
      const auditBox = el('div', 'ls-stack');
      auditBox.append(el('span', 'ls-kicker', '📈 Recent Meter Shifts'));
      const row = el('div', 'ls-row');
      for (const r of recent) {
        const sign = r.numericDelta > 0 ? `+${r.numericDelta}` : String(r.numericDelta);
        const chip = el(
          'span',
          `ls-delta ${r.numericDelta >= 0 ? 'is-pos' : 'is-neg'}`,
          `${r.statLabel}: ${String(r.before ?? '—')} → ${String(r.after)}${r.numericDelta !== 0 ? ` (${sign})` : ''}`,
        );
        if (r.reason && r.reason !== state.scene.beatSummary) {
          chip.title = r.reason;
        }
        row.append(chip);
      }
      auditBox.append(row);
      main.append(auditBox);
    }
  }

  shell.append(main);
  wrap.append(shell);
  return wrap;
}

/**
 * Shared Cast surface for both Floating HUD Widget and Inline Message Ribbon.
 * Supports:
 * - Tab-routed character stats (stats moved to `stats`/`world`/custom tabs won't duplicate here)
 * - `'roster'` mode: Separate `In Scene` & `Away` avatar icon strips; click any icon to inspect below
 * - `'cards'` mode: Stacked cards for all characters
 */
export function renderSurfaceCastRoster(
  ctrl: LumiFrontendController,
  surface: 'widget' | 'inline',
  tabId: string,
  onOpenDossier: (actorId: string) => void,
): HTMLElement {
  const { state, template, deltas } = ctrl.snapshot;
  const wrap = el('div', 'ls-stack');
  const actors = Object.values(state.characters);

  if (!actors.length) {
    wrap.append(el('p', 'ls-muted', 'Characters appear here as the story introduces them.'));
    return wrap;
  }

  const surfaceTabs =
    surface === 'widget' ? template.surfaces.widgetTabs : template.surfaces.inlineTabs;
  const enabledTabIds = new Set(surfaceTabs.filter(t => t.enabled).map(t => t.id));
  const charSchemas = template.stats.filter(s => {
    if (!s.enabled || s.scope !== 'character') return false;
    if (surface === 'widget' && s.showIn?.widget === false) return false;
    if (surface === 'inline' && s.showIn?.inline === false) return false;
    const assigned =
      surface === 'widget' ? (s.widgetTabId || 'cast') : (s.inlineTabId || 'cast');
    const extraTabs = surface === 'widget' ? s.extraWidgetTabIds : s.extraInlineTabIds;
    return assigned === tabId || !enabledTabIds.has(assigned) || Boolean(extraTabs?.includes(tabId));
  });

  const surfaceFields = template.dossierFields.filter(f =>
    surface === 'widget' ? (f.enabled && f.showInHudCast) : (f.enabled && f.showInInlineCast),
  );
  const rpgRichKinds = new Set(['skill_tree', 'xp_level', 'attributes', 'inventory', 'status_fx', 'hearts', 'currency']);
  const numericCharSchemas = charSchemas.filter(
    s => !rpgRichKinds.has(s.kind) && !isTextLikeStat(s) && s.kind !== 'boolean',
  );
  const richOrTextCharSchemas = charSchemas.filter(
    s => rpgRichKinds.has(s.kind) || isTextLikeStat(s) || s.kind === 'boolean',
  );

  const presentActors = actors.filter(a => a.present);
  const awayActors = actors.filter(a => !a.present);
  const castLayout = template.theme.castLayout ?? 'roster';

  const headerBar = el('div', 'ls-row-between');
  headerBar.append(
    el('span', 'ls-kicker', `🟢 In Scene: ${presentActors.length} · ⚪ Away: ${awayActors.length}`),
    btn(
      castLayout === 'roster' ? '🗂️ All Cards' : '👥 Icons',
      () => {
        const nextLayout = castLayout === 'roster' ? 'cards' : 'roster';
        void ctrl.request('state:mutate', {
          templatePatch: {
            theme: { ...template.theme, castLayout: nextLayout },
          },
          reason: `Switched cast display to ${nextLayout}`,
        });
      },
      'ls-btn-sm',
      'Toggle between compact character icons and expanded stacked cards',
    ),
  );
  wrap.append(headerBar);

  const renderActorCard = (actor: CharacterRecord): HTMLElement => {
    const card = el('div', 'ls-card');
    const head = el('div', 'ls-row-between');
    const leftId = el('div', 'ls-row');
    const av = el('div', 'ls-cast-avatar');
    if (actor.portraitUrl) {
      const img = el('img');
      img.src = actor.portraitUrl;
      img.alt = actor.name;
      av.append(img);
    } else {
      av.textContent = actor.name.slice(0, 2).toUpperCase();
    }
    const nameStack = el('div');
    nameStack.append(el('strong', '', `${actor.present ? '🟢' : '⚪'} ${actor.name}`));
    const roleVal = resolveCharacterFieldValue(actor, 'role_summary');
    if (roleVal) {
      const roleSub = el('div', 'ls-muted', roleVal);
      roleSub.style.fontSize = '11px';
      nameStack.append(roleSub);
    }
    leftId.append(av, nameStack);

    const rightActions = el('div', 'ls-row');
    const demField = surfaceFields.find(f => f.id === 'demeanor');
    const demVal = demField ? resolveCharacterFieldValue(actor, 'demeanor') : '';
    if (demVal) {
      rightActions.append(el('span', 'ls-chip', `${demField!.icon} ${demVal}`));
    }
    rightActions.append(
      btn(
        actor.present ? '🟢 In Scene' : '⚪ Away',
        () => {
          void ctrl.request('state:mutate', {
            patch: {
              characters: [
                {
                  id: actor.id,
                  name: actor.name,
                  present: !actor.present,
                  ...(!actor.present && state.scene.location ? { location: state.scene.location } : {}),
                },
              ],
            },
            reason: `Marked ${actor.name} as ${!actor.present ? 'In Scene' : 'Away'}`,
          });
        },
        `ls-btn-sm ls-presence-pill ${actor.present ? 'ls-chip-accent' : ''}`,
        `Toggle whether ${actor.name} is In Scene or Away`,
      ),
      iconBtn('volume', () => openVoiceAssignmentModal(ctrl, actor.id), {
        className: 'ls-btn-sm ls-btn-icon ls-btn-ghost',
        title: `Assign TTS voice for ${actor.name}`,
      }),
      btn('Dossier', () => onOpenDossier(actor.id), 'ls-btn-sm ls-btn-primary'),
    );
    head.append(leftId, rightActions);
    card.append(head);

    if (template.coreTrackers?.trackNpcConditions !== false && actor.conditions.length > 0) {
      const condRow = el('div', 'ls-row');
      for (const c of actor.conditions.slice(0, 4)) {
        const pill = el('span', 'ls-rpg-fx-pill', `⚡ ${c}`);
        pill.dataset.fxKind = 'neutral';
        condRow.append(pill);
      }
      card.append(condRow);
    }

    for (const f of surfaceFields.filter(hf => hf.id !== 'demeanor' && hf.id !== 'role_summary')) {
      const val = resolveCharacterFieldValue(actor, f.id);
      if (!val) continue;
      if (f.displayStyle === 'quote') {
        card.append(el('div', 'ls-thought-box', `${f.icon} “${val}”`));
      } else {
        card.append(el('small', 'ls-muted', `${f.icon} ${val}`));
      }
    }

    if (numericCharSchemas.length > 0) {
      const miniGrid = el('div', 'ls-cast-mini-grid');
      for (const schema of numericCharSchemas) {
        const m = actor.meters[schema.id];
        const d = deltas.characterDeltas[actor.id]?.[schema.id] ?? 0;
        const numVal = m?.calibrated && typeof m.value === 'number' ? m.value : 0;
        const span = Math.max(1, schema.max - schema.min);
        const pct = m?.calibrated
          ? Math.max(0, Math.min(100, Math.round(((numVal - schema.min) / span) * 100)))
          : 0;
        const tier =
          m?.calibrated && typeof m.value === 'number'
            ? resolveAnchorLabel(schema.anchors, m.value)
            : '';

        const mini = el('div', 'ls-cast-mini-meter');
        mini.style.setProperty('--ls-bar-color', schema.color || 'var(--ls-primary)');
        if (tier) mini.title = `${schema.label}: ${numVal} (${tier})`;
        const topRow = el('div', 'ls-row-between');
        topRow.append(el('small', 'ls-muted', `${schema.icon} ${schema.label}`));
        const valCluster = el('div', 'ls-row');
        if (d !== 0) {
          valCluster.append(
            el('span', `ls-delta ${d > 0 ? 'is-pos' : 'is-neg'}`, d > 0 ? `+${d}` : String(d)),
          );
        }
        valCluster.append(el('strong', '', m?.calibrated ? String(m.value) : '—'));
        topRow.append(valCluster);

        const track = el('div', 'ls-bar-track');
        const fill = el('div', 'ls-bar-fill');
        fill.style.width = `${pct}%`;
        track.append(fill);
        mini.append(topRow, track);
        miniGrid.append(mini);
      }
      card.append(miniGrid);
    }

    for (const schema of richOrTextCharSchemas) {
      const m = actor.meters[schema.id];
      const isCalibrated = Boolean(m?.calibrated);
      const val = isCalibrated ? m!.value : schema.defaultValue;
      const strVal = String(val ?? '').trim();

      const block = el('div', 'ls-stat-cell');
      block.style.setProperty('--ls-bar-color', schema.color || 'var(--ls-primary)');
      block.dataset.uncalibrated = String(!isCalibrated);
      block.append(el('small', 'ls-kicker', `${schema.icon} ${schema.label}`));

      if (!isCalibrated && !rpgRichKinds.has(schema.kind)) {
        block.append(el('small', 'ls-muted', 'Uncalibrated'));
        card.append(block);
        continue;
      }
      if (isCalibrated && (!strVal || strVal === 'None') && !rpgRichKinds.has(schema.kind)) {
        block.append(el('small', 'ls-muted', 'None'));
        card.append(block);
        continue;
      }

      if (schema.kind === 'skill_tree') {
        block.append(
          renderSkillTreeWidget(schema, val, Boolean(schema.locked || m?.locked), (nextSerialized, reason) => {
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
        block.append(renderXpLevelWidget(schema, val));
      } else if (schema.kind === 'attributes') {
        block.append(renderAttributesWidget(schema, val, `${actor.id}:${ctrl.chatId}`));
      } else if (schema.kind === 'inventory') {
        block.append(renderInventoryWidget(val));
      } else if (schema.kind === 'status_fx') {
        block.append(renderStatusFxWidget(val));
      } else if (schema.kind === 'hearts') {
        block.append(renderHeartsWidget(schema, Number(val) || 0, Boolean(m?.calibrated), Boolean(schema.locked || m?.locked)));
      } else if (schema.kind === 'currency') {
        block.append(renderCurrencyWidget(schema, val as number | string, deltas.characterDeltas[actor.id]?.[schema.id] ?? 0));
      } else {
        block.append(renderStructuredTextStatBody(strVal, schema.displayStyle ?? 'auto'));
      }
      card.append(block);
    }

    return card;
  };

  if (castLayout === 'cards') {
    for (const actor of [...presentActors, ...awayActors]) {
      wrap.append(renderActorCard(actor));
    }
    return wrap;
  }

  // `'roster'` (Icon Mode): Show ONLY the icon grid until a character is clicked,
  // then switch into a dedicated tab named after that character.
  ctrl.openedCastTabs = ctrl.openedCastTabs.filter(id => Boolean(state.characters[id]));
  const activeTabActor =
    ctrl.activeCastTabActorId && state.characters[ctrl.activeCastTabActorId]
      ? state.characters[ctrl.activeCastTabActorId]
      : undefined;

  if (ctrl.openedCastTabs.length > 0 || activeTabActor) {
    const tabBar = el('div', 'ls-cast-tabs-bar');
    const backBtn = btn(
      '← Cast',
      () => {
        ctrl.activeCastTabActorId = '';
        ctrl.emitChange();
      },
      'ls-btn-sm',
      'Return to Cast Icons',
    );
    if (!activeTabActor) backBtn.setAttribute('aria-current', 'page');
    tabBar.append(backBtn);

    for (const tabId of ctrl.openedCastTabs) {
      const tabActor = state.characters[tabId];
      if (!tabActor) continue;
      const isActiveTab = activeTabActor?.id === tabActor.id;
      const group = el('div', 'ls-cast-tab-group');
      const tabBtn = btn(
        `${tabActor.present ? '🟢' : '⚪'} ${tabActor.name}`,
        () => {
          ctrl.activeCastTabActorId = tabActor.id;
          ctrl.selectedActorId = tabActor.id;
          ctrl.emitChange();
        },
        'ls-btn-sm ls-cast-tab-btn',
        `Inspect ${tabActor.name}`,
      );
      if (isActiveTab) tabBtn.setAttribute('aria-current', 'page');

      const closeTabBtn = btn(
        '×',
        () => {
          ctrl.openedCastTabs = ctrl.openedCastTabs.filter(id => id !== tabActor.id);
          if (ctrl.activeCastTabActorId === tabActor.id) {
            ctrl.activeCastTabActorId = ctrl.openedCastTabs.at(-1) ?? '';
          }
          ctrl.emitChange();
        },
        'ls-btn-sm ls-cast-tab-close',
        `Close ${tabActor.name} tab`,
      );
      group.append(tabBtn, closeTabBtn);
      tabBar.append(group);
    }

    if (activeTabActor) {
      wrap.replaceChildren(headerBar, tabBar, renderActorCard(activeTabActor));
      return wrap;
    }
    wrap.append(tabBar);
  }

  const renderIconGroup = (label: string, groupActors: CharacterRecord[]) => {
    if (!groupActors.length) return;
    const groupWrap = el('div', 'ls-roster-group');
    groupWrap.append(el('small', 'ls-muted', `${label} (${groupActors.length})`));
    const grid = el('div', 'ls-roster-grid');

    for (const actor of groupActors) {
      const demeanor = resolveCharacterFieldValue(actor, 'demeanor');
      const roleShort = resolveCharacterFieldValue(actor, 'role_summary');
      const tileBtn = el('button', 'ls-roster-icon-btn');
      tileBtn.type = 'button';
      tileBtn.title = `${actor.name}${roleShort ? ` — ${roleShort}` : ''}${demeanor ? ` (${demeanor})` : ''}`;

      const avatar = el('div', 'ls-roster-avatar');
      if (actor.portraitUrl) {
        const img = el('img');
        img.src = actor.portraitUrl;
        img.alt = actor.name;
        avatar.append(img);
      } else {
        avatar.append(document.createTextNode(actor.name.slice(0, 2).toUpperCase()));
      }
      avatar.append(el('span', `ls-roster-dot ${actor.present ? 'is-present' : 'is-away'}`));

      const nameEl = el('span', 'ls-roster-name', actor.name);
      const subText = demeanor || roleShort || '';
      const subEl = subText ? el('span', 'ls-roster-role', subText) : null;

      tileBtn.append(avatar, nameEl, ...(subEl ? [subEl] : []));
      tileBtn.addEventListener('click', e => {
        e.stopPropagation();
        if (!ctrl.openedCastTabs.includes(actor.id)) {
          ctrl.openedCastTabs = [...ctrl.openedCastTabs, actor.id];
        }
        ctrl.activeCastTabActorId = actor.id;
        ctrl.selectedActorId = actor.id;
        ctrl.emitChange();
      });
      grid.append(tileBtn);
    }

    groupWrap.append(grid);
    wrap.append(groupWrap);
  };

  renderIconGroup('🟢 In Scene', presentActors);
  renderIconGroup('⚪ Away', awayActors);
  return wrap;
}
