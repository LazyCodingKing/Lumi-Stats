import type {
  SpindleFrontendContext,
  SpindleFrontendWidgetTarget,
} from 'lumiverse-spindle-types';
import {
  ComponentScope,
  type LumiFrontendController,
} from './controller';
import { openCharacterDossierModal } from './surfaces/CastDossier';
import { renderFloatingHudSurface } from './surfaces/FloatingHud';

export function mountFloatingWidget(
  ctx: SpindleFrontendContext,
  ctrl: LumiFrontendController,
  openStudio: () => void,
  widgetTarget?: SpindleFrontendWidgetTarget,
): (() => void) | undefined {
  try {
    const widgetScope = new ComponentScope();
    const initTheme = ctrl.snapshot.template.theme;
    const getExpandedSize = () => ({
      w: Math.max(240, Math.min(1200, ctrl.snapshot.template.theme.widgetWidth ?? 460)),
      h: Math.max(180, Math.min(900, ctrl.snapshot.template.theme.widgetHeight ?? 540)),
    });
    const getPillSize = () => ({
      w: Math.max(220, Math.min(960, ctrl.snapshot.template.theme.pillWidth ?? 420)),
      h: Math.max(56, Math.min(220, ctrl.snapshot.template.theme.pillHeight ?? 92)),
    });

    const floatWidget = ctx.ui.createFloatWidget({
      width: widgetTarget?.width ?? (initTheme.pillWidth ?? 420),
      height: widgetTarget?.height ?? (initTheme.pillHeight ?? 92),
      chromeless: widgetTarget?.chromeless ?? true,
      snapToEdge: true,
      tooltip: 'Lumi Stats HUD',
      touchScrollMode: 'native',
    });
    floatWidget.root.classList.add('ls-root');
    floatWidget.root.style.cssText +=
      ';display:flex;flex-direction:column;height:100%;max-height:100%;min-height:0;overflow:hidden;background:transparent;';

    ctrl.onResizeWidgetLive = (width, height, commit) => {
      floatWidget.setSize(width, height);
      if (commit) {
        const curTheme = ctrl.snapshot.template.theme;
        void ctrl.request('state:mutate', {
          templatePatch: {
            theme: ctrl.widgetExpanded
              ? { ...curTheme, widgetWidth: width, widgetHeight: height }
              : { ...curTheme, pillWidth: width, pillHeight: height },
          },
          reason: `Resized widget to ${width}×${height}`,
        });
      }
    };

    let collapseTimer: ReturnType<typeof setTimeout> | null = null;
    const toggleCompact = () => {
      if (collapseTimer) {
        clearTimeout(collapseTimer);
        collapseTimer = null;
      }
      ctrl.widgetExpanded = !ctrl.widgetExpanded;
      const isCompact = !ctrl.widgetExpanded;
      if (!isCompact) {
        const { w, h } = getExpandedSize();
        floatWidget.setSize(w, h);
      } else {
        const { w, h } = getPillSize();
        collapseTimer = setTimeout(() => {
          floatWidget.setSize(w, h);
          collapseTimer = null;
        }, 180);
      }
      renderWidget();
    };

    let lastAutoPillSizeKey = '';
    const renderWidget = () => {
      widgetScope.clear();
      const placement = ctrl.snapshot.template.theme.placement;
      const visible =
        !ctrl.vnStageOpen &&
        !ctrl.studioOpen &&
        (placement === 'floating_only' || placement.startsWith('both_'));
      floatWidget.setVisible(visible);
      ctrl.stampThemeOnElement(floatWidget.root);
      const hudNode = renderFloatingHudSurface(
        ctrl,
        !ctrl.widgetExpanded,
        toggleCompact,
        actorId => openCharacterDossierModal(ctrl, actorId),
        openStudio,
        widgetScope,
      );
      floatWidget.root.replaceChildren(hudNode);

      if (!ctrl.widgetExpanded && !collapseTimer && visible) {
        const isEmptyDeck = Boolean(hudNode.querySelector('.ls-hud-pill[data-empty-deck="true"]'));
        const { w, h } = getPillSize();
        const effectiveH = isEmptyDeck ? Math.min(h, 48) : h;
        const sizeKey = `${w}x${effectiveH}`;
        if (sizeKey !== lastAutoPillSizeKey) {
          lastAutoPillSizeKey = sizeKey;
          floatWidget.setSize(w, effectiveH);
        }
      } else {
        lastAutoPillSizeKey = '';
      }
      ctrl.applyTemplateThemeToDom();
    };

    const onDesktopWidgetReturned = (ev: Event) => {
      const detail = (ev as CustomEvent<{ extensionId?: string }>).detail;
      if (detail?.extensionId && detail.extensionId !== 'lumi_stats') return;
      void ctrl.refreshActiveChat();
      renderWidget();
    };
    window.addEventListener('spindle:desktop-widget-returned', onDesktopWidgetReturned);

    const unsub = ctrl.subscribe(renderWidget);
    renderWidget();

    return () => {
      window.removeEventListener('spindle:desktop-widget-returned', onDesktopWidgetReturned);
      if (collapseTimer) clearTimeout(collapseTimer);
      ctrl.onResizeWidgetLive = null;
      unsub();
      widgetScope.clear();
      floatWidget.destroy();
    };
  } catch {
    return undefined;
  }
}
