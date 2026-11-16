import type { SpindleAppMountHandle } from 'lumiverse-spindle-types';
import type { LumiStatsTemplate } from '../../shared/types';
import {
  ComponentScope,
  btn,
  el,
  iconBtn,
  openCreateTemplateModal,
  preserveScrollAndFocus,
  type LumiFrontendController,
} from '../controller';
import { openCharacterDossierModal, renderCastDossierSurface } from './CastDossier';
import { renderFloatingHudSurface } from './FloatingHud';
import { renderInlineRibbonCard } from './InlineRibbon';
import { renderStageAssetStudioSurface } from './StageAssetStudio';
import {
  renderStudioEngineTab,
  renderStudioProseTab,
} from './studio/StudioProseEngineTab';
import { renderStudioStatsTab } from './studio/StudioStatsTab';
import { renderStudioSurfacesTab } from './studio/StudioSurfacesTab';
import { renderStudioTemplatesTab } from './studio/StudioTemplatesTab';

type StudioTabId = 'quickstart' | 'stats' | 'extreme' | 'stage_assets' | 'prose' | 'engine';

let activeStudioTab: StudioTabId = 'quickstart';
let activePreviewMode: 'hud' | 'pill' | 'inline' | 'dossier' = 'hud';
let editingTemplateIdentity = false;
let identityDraft: { icon: string; name: string; description: string } | null = null;
let identityTemplateId = '';
let activeAppOverlay: { mount: SpindleAppMountHandle; cleanup: () => void } | null = null;

function downloadTemplateJson(name: string, data: unknown): void {
  const slug = name.toLowerCase().replace(/[^a-z0-9_-]+/g, '_') || 'lumi_stats_template';
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slug}.lumi-stats.json`;
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function openSettingsStudioModal(ctrl: LumiFrontendController): void {
  if (activeAppOverlay) {
    activeAppOverlay.cleanup();
    activeAppOverlay = null;
  }
  editingTemplateIdentity = false;
  identityDraft = null;
  identityTemplateId = ctrl.snapshot.template.id;
  void ctrl.request('snapshot:get').catch(() => undefined);

  const compScope = new ComponentScope();

  if (typeof ctrl.ctx.ui?.mountApp === 'function') {
    try {
      const mount = ctrl.ctx.ui.mountApp({
        className: 'ls-studio-mount',
        position: 'app-overlay',
      });
      mount.setVisible(true);
      setupAppOverlay(ctrl, mount, compScope);
      return;
    } catch (err) {
      console.warn('[LumiStats Studio] mountApp error, using modal fallback:', err);
      compScope.clear();
    }
  }

  openViaModal(ctrl);
}

function setupAppOverlay(
  ctrl: LumiFrontendController,
  mount: SpindleAppMountHandle,
  compScope: ComponentScope,
): void {
  console.log('[LumiStats Studio] setupAppOverlay: mounting full-window Studio via mountApp');
  ctrl.studioOpen = true;
  ctrl.emitChange();

  const closeOverlay = () => {
    if (!activeAppOverlay) return;
    editingTemplateIdentity = false;
    identityDraft = null;
    const ref = activeAppOverlay;
    activeAppOverlay = null;
    ctrl.activeOverlayCleanup = null;
    ctrl.studioOpen = false;
    ctrl.emitChange();
    ref.cleanup();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Escape') return;
    if (
      e.defaultPrevented ||
      ctrl.modals.hasOpenModals() ||
      document.body.querySelector('.ls-dd-menu[data-ls-dd-open="true"]')
    ) {
      return;
    }
    closeOverlay();
  };
  window.addEventListener('keydown', onKeyDown);

  const redraw = (force = false) => {
    preserveScrollAndFocus(
      mount.root,
      () => {
        compScope.clear();
        const postMount: Array<() => void> = [];
        mount.root.replaceChildren(
          renderFullWindowStudio(ctrl, compScope, closeOverlay, true, () => redraw(true), postMount),
        );
        for (const fn of postMount) fn();
      },
      {
        deferIfTyping: !force,
        onDeferredFlush: () => redraw(true),
      },
    );
  };

  const unsub = ctrl.subscribe(() => redraw(false));
  const unsubStatus = ctrl.subscribeStatus(() => {
    const pill = mount.root.querySelector<HTMLElement>('[data-ls-studio-status]');
    if (pill) {
      pill.textContent = ctrl.statusText;
      pill.style.display = ctrl.statusText ? '' : 'none';
      pill.style.color = ctrl.statusError ? 'var(--ls-danger)' : 'var(--ls-muted)';
    }
  });
  redraw(true);

  const cleanupFn = () => {
    window.removeEventListener('keydown', onKeyDown);
    unsub();
    unsubStatus();
    compScope.clear();
    mount.destroy();
  };

  activeAppOverlay = { mount, cleanup: cleanupFn };
  ctrl.activeOverlayCleanup = closeOverlay;
}

function openViaModal(ctrl: LumiFrontendController): void {
  ctrl.modals.open(
    { title: 'Lumi Stats Studio', width: 1360, maxHeight: 900 },
    (body, close, handle, modalScope) => {
      body.style.cssText += ';padding:0;overflow:hidden;display:flex;flex-direction:column;height:85vh;max-height:880px;container-type:inline-size;';
      const redraw = (force = false) => {
        preserveScrollAndFocus(
          body,
          () => {
            modalScope.clear();
            const postMount: Array<() => void> = [];
            body.replaceChildren(
              renderFullWindowStudio(ctrl, modalScope, close, false, () => redraw(true), postMount),
            );
            for (const fn of postMount) fn();
          },
          {
            deferIfTyping: !force,
            onDeferredFlush: () => redraw(true),
          },
        );
      };
      redraw(true);
      const unsub = ctrl.subscribe(() => redraw(false));
      const unsubStatus = ctrl.subscribeStatus(() => {
        const pill = body.querySelector<HTMLElement>('[data-ls-studio-status]');
        if (pill) {
          pill.textContent = ctrl.statusText;
          pill.style.display = ctrl.statusText ? '' : 'none';
          pill.style.color = ctrl.statusError ? 'var(--ls-danger)' : 'var(--ls-muted)';
        }
      });
      handle.onDismiss(() => {
        editingTemplateIdentity = false;
        identityDraft = null;
        unsub();
        unsubStatus();
      });
    },
  );
}

function renderFullWindowStudio(
  ctrl: LumiFrontendController,
  compScope: ComponentScope,
  onClose: () => void,
  isFullscreenOverlay: boolean,
  forceRedraw: () => void,
  postMount: Array<() => void> = [],
): HTMLElement {
  const { template } = ctrl.snapshot;
  const tpl = structuredClone(template);
  if (identityTemplateId !== tpl.id) {
    identityTemplateId = tpl.id;
    editingTemplateIdentity = false;
    identityDraft = null;
  }
  const isBuiltin = ctrl.builtinTemplates.some(b => b.id === tpl.id);

  const saveTemplatePatch = (
    patchOrUpdater:
      | Partial<LumiStatsTemplate>
      | ((live: LumiStatsTemplate) => Partial<LumiStatsTemplate>),
    reason = 'Updated template',
  ) => {
    const liveTpl = structuredClone(ctrl.snapshot.template);
    const patch = typeof patchOrUpdater === 'function' ? patchOrUpdater(liveTpl) : patchOrUpdater;
    const mergedPatch: Partial<LumiStatsTemplate> = {
      ...patch,
      ...(patch.theme
        ? { theme: { ...liveTpl.theme, ...patch.theme } }
        : {}),
      ...(patch.surfaces
        ? { surfaces: { ...liveTpl.surfaces, ...patch.surfaces } }
        : {}),
    };
    void ctrl
      .request('state:mutate', { templatePatch: mergedPatch, reason })
      .catch(err => ctrl.notify(err instanceof Error ? err.message : String(err), true));
  };

  const duplicateAndEditTemplate = (sourceTpl: LumiStatsTemplate, customName?: string) => {
    const targetName = customName?.trim() || `${sourceTpl.name} (Custom)`;
    void ctrl
      .request('template:duplicate', {
        sourceTemplateId: sourceTpl.id,
        template: sourceTpl,
        name: targetName,
        icon: sourceTpl.icon,
        description: sourceTpl.description,
      })
      .then(res => {
        const created = (res.template as LumiStatsTemplate | undefined) ?? ctrl.snapshot.template;
        identityTemplateId = created.id;
        editingTemplateIdentity = true;
        identityDraft = {
          icon: created.icon,
          name: created.name,
          description: created.description,
        };
        ctrl.notify(`Created & activated editable copy "${created.name}"!`);
        forceRedraw();
      })
      .catch(err => ctrl.notify(err instanceof Error ? err.message : String(err), true));
  };

  const container = el('div', isFullscreenOverlay ? 'ls-studio-overlay' : 'ls-studio-overlay ls-studio-in-modal');
  ctrl.stampThemeOnElement(container);

  // ── 1. Top Studio Header Bar ──
  const topBar = el('header', 'ls-studio-topbar');
  const brandRow = el('div', 'ls-row');
  brandRow.append(
    el('span', 'ls-brand-mark', 'L'),
    el('strong', '', 'Lumi Stats Studio'),
    el('span', 'ls-chip ls-chip-accent', `${tpl.icon} ${tpl.name}`),
    el('span', 'ls-chip', isBuiltin ? 'Built-In' : 'Custom'),
  );

  const studioStatusPill = el('span', 'ls-chip', ctrl.statusText);
  studioStatusPill.setAttribute('data-ls-studio-status', 'true');
  if (!ctrl.statusText) studioStatusPill.style.display = 'none';
  if (ctrl.statusError) studioStatusPill.style.color = 'var(--ls-danger)';

  const topActions = el('div', 'ls-row');
  topActions.append(
    studioStatusPill,
    iconBtn('plus', () => openCreateTemplateModal(ctrl, forceRedraw), {
      label: 'New',
      className: 'ls-btn-sm',
      title: 'Create a new template',
    }),
    btn('Save to Library', () => {
      const live = ctrl.snapshot.template;
      void ctrl
        .request('template:saveToLibrary', {
          name: live.name,
          icon: live.icon,
          description: live.description,
        })
        .then(() => ctrl.notify(`Saved "${live.name}" to your Template Library.`))
        .catch(err => ctrl.notify(err instanceof Error ? err.message : String(err), true));
    }, 'ls-btn-sm ls-btn-primary'),
    btn('Export', () => downloadTemplateJson(tpl.name, tpl), 'ls-btn-sm'),
    iconBtn('close', onClose, {
      label: 'Close',
      className: 'ls-btn-sm ls-btn-danger',
      title: 'Close Studio (Esc)',
    }),
  );
  topBar.append(brandRow, topActions);
  container.append(topBar);

  // ── 2. Three-Zone Studio Workspace ──
  const workspace = el('div', 'ls-studio-workspace');

  const sidebar = el('nav', 'ls-studio-sidebar');
  const navItems: ReadonlyArray<{ id: StudioTabId; title: string; sub: string }> = [
    { id: 'quickstart', title: '1. Templates & Look', sub: 'Presets, placement & skin' },
    { id: 'stats', title: '2. Stats & Built-Ins', sub: 'Meters, Scene Pill & prompts' },
    { id: 'extreme', title: '3. Tabs & Surfaces', sub: 'HUD, Inline & Dossier layout' },
    { id: 'stage_assets', title: '4. Stage Sprites', sub: 'Sprites & time backdrops' },
    { id: 'prose', title: '5. Prose & Cipher', sub: 'Braille cleaner & word cipher' },
    { id: 'engine', title: '6. AI & Connections', sub: 'Models, Cortex & debug' },
  ];

  for (const item of navItems) {
    const b = el('button', 'ls-studio-nav-btn');
    b.type = 'button';
    if (activeStudioTab === item.id) b.setAttribute('aria-current', 'page');
    b.append(
      el('span', 'ls-studio-nav-title', item.title),
      el('span', 'ls-studio-nav-sub', item.sub),
    );
    b.addEventListener('click', () => {
      activeStudioTab = item.id;
      forceRedraw();
    });
    sidebar.append(b);
  }
  workspace.append(sidebar);

  const centerPane = el('main', 'ls-studio-pane');

  if (activeStudioTab === 'quickstart' || activeStudioTab === 'stats' || activeStudioTab === 'extreme') {
    const hero = el('section', 'ls-hero-banner');
    const heroTop = el('div', 'ls-row-between');
    const heroTitleCol = el('div');
    heroTitleCol.append(
      el('span', 'ls-kicker', isBuiltin ? 'Built-In Preset' : 'Custom Saved Template'),
      el('h2', '', `${tpl.icon} ${tpl.name}`),
      el('p', 'ls-muted', tpl.description),
    );

    const heroBtns = el('div', 'ls-row');
    heroBtns.append(
      iconBtn('copy', () => duplicateAndEditTemplate(tpl), {
        label: 'Duplicate & Edit',
        className: 'ls-btn-sm ls-btn-primary',
      }),
      iconBtn(
        'edit',
        () => {
          editingTemplateIdentity = !editingTemplateIdentity;
          identityDraft = editingTemplateIdentity
            ? { icon: tpl.icon, name: tpl.name, description: tpl.description }
            : null;
          forceRedraw();
        },
        {
          label: editingTemplateIdentity ? 'Hide Rename' : 'Rename',
          className: 'ls-btn-sm',
        },
      ),
    );
    heroTop.append(heroTitleCol, heroBtns);
    hero.append(heroTop);

    if (editingTemplateIdentity) {
      identityDraft ??= { icon: tpl.icon, name: tpl.name, description: tpl.description };
      const idGrid = el('div', 'ls-grid');
      const icWrap = el('label', 'ls-label', 'Icon Emoji');
      const icInp = el('input', 'ls-input');
      icInp.value = identityDraft.icon;
      icInp.addEventListener('input', () => {
        if (identityDraft) identityDraft.icon = icInp.value;
      });
      icWrap.append(icInp);

      const nmWrap = el('label', 'ls-label', 'Template Name');
      const nmInp = el('input', 'ls-input');
      nmInp.value = identityDraft.name;
      nmInp.addEventListener('input', () => {
        if (identityDraft) identityDraft.name = nmInp.value;
      });
      nmWrap.append(nmInp);

      const dsWrap = el('label', 'ls-label', 'Description');
      const dsInp = el('input', 'ls-input');
      dsInp.value = identityDraft.description;
      dsInp.addEventListener('input', () => {
        if (identityDraft) identityDraft.description = dsInp.value;
      });
      dsWrap.append(dsInp);
      idGrid.append(icWrap, nmWrap, dsWrap);

      const saveInfoBtn = btn('Save Template Name & Info', () => {
        const nextName = nmInp.value.trim() || tpl.name;
        const nextIcon = icInp.value.trim() || '✨';
        const nextDesc = dsInp.value.trim() || tpl.description;
        saveInfoBtn.disabled = true;
        saveInfoBtn.textContent = 'Saving…';
        void ctrl
          .request('template:saveToLibrary', {
            name: nextName,
            icon: nextIcon,
            description: nextDesc,
          })
          .then(() => {
            editingTemplateIdentity = false;
            identityDraft = null;
            ctrl.notify(`Saved template "${nextName}".`);
            forceRedraw();
          })
          .catch(err => {
            ctrl.notify(err instanceof Error ? err.message : String(err), true);
            if (saveInfoBtn.isConnected) {
              saveInfoBtn.disabled = false;
              saveInfoBtn.textContent = 'Save Template Name & Info';
            }
          });
      }, 'ls-btn-sm ls-btn-primary');
      hero.append(idGrid, saveInfoBtn);
    }
    centerPane.append(hero);
  }

  if (activeStudioTab === 'quickstart') {
    centerPane.append(
      renderStudioTemplatesTab(
        ctrl,
        compScope,
        tpl,
        saveTemplatePatch,
        duplicateAndEditTemplate,
        forceRedraw,
      ),
    );
  } else if (activeStudioTab === 'stats') {
    centerPane.append(
      renderStudioStatsTab(ctrl, compScope, tpl, saveTemplatePatch, forceRedraw),
    );
  } else if (activeStudioTab === 'extreme') {
    centerPane.append(
      renderStudioSurfacesTab(ctrl, compScope, tpl, saveTemplatePatch, forceRedraw),
    );
  } else if (activeStudioTab === 'stage_assets') {
    centerPane.append(renderStageAssetStudioSurface(ctrl, forceRedraw));
  } else if (activeStudioTab === 'prose') {
    centerPane.append(renderStudioProseTab(ctrl, compScope));
  } else if (activeStudioTab === 'engine') {
    centerPane.append(renderStudioEngineTab(ctrl, compScope, postMount));
  }

  workspace.append(centerPane);

  // ── Zone C: Sticky Live Interactive Surface Preview ──
  const previewPane = el('aside', 'ls-studio-preview-pane');
  const previewCard = el('section', 'ls-card');
  const prevHead = el('div', 'ls-row-between');
  prevHead.append(el('span', 'ls-kicker', 'Live Preview'));
  const prevModes = el('div', 'ls-row');
  for (const [mId, mLbl] of [
    ['hud', 'HUD'],
    ['pill', 'Pill'],
    ['inline', 'Inline'],
    ['dossier', 'Dossier'],
  ] as const) {
    const b = btn(mLbl, () => {
      activePreviewMode = mId;
      forceRedraw();
    }, 'ls-btn-sm');
    if (activePreviewMode === mId) b.setAttribute('aria-current', 'page');
    prevModes.append(b);
  }
  prevHead.append(prevModes);
  previewCard.append(prevHead);

  const previewStage = el('div');
  previewStage.style.marginTop = '6px';
  if (activePreviewMode === 'hud') {
    previewStage.style.height = '470px';
    previewStage.append(
      renderFloatingHudSurface(
        ctrl,
        false,
        () => undefined,
        actorId => openCharacterDossierModal(ctrl, actorId),
        () => undefined,
        compScope,
      ),
    );
  } else if (activePreviewMode === 'pill') {
    previewStage.style.height = '104px';
    previewStage.append(
      renderFloatingHudSurface(
        ctrl,
        true,
        () => undefined,
        actorId => openCharacterDossierModal(ctrl, actorId),
        () => undefined,
        compScope,
      ),
    );
  } else if (activePreviewMode === 'inline') {
    const prevExpanded = ctrl.inlineExpanded;
    ctrl.inlineExpanded = true;
    const inlineEl = renderInlineRibbonCard(
      ctrl,
      actorId => openCharacterDossierModal(ctrl, actorId),
      () => undefined,
    );
    ctrl.inlineExpanded = prevExpanded;
    previewStage.append(inlineEl);
  } else {
    const prevEdit = ctrl.dossierEditMode;
    ctrl.dossierEditMode = false;
    const dossierEl = renderCastDossierSurface(ctrl, compScope);
    ctrl.dossierEditMode = prevEdit;
    previewStage.append(dossierEl);
  }
  previewCard.append(previewStage);
  previewPane.append(previewCard);
  workspace.append(previewPane);

  container.append(workspace);
  return container;
}
