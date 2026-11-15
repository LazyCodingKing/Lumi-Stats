import type {
  SpindleFrontendContext,
  SpindleFrontendWidgetTarget,
} from 'lumiverse-spindle-types';
import {
  LumiFrontendController,
  acquireLumiStatsStyles,
} from './frontend/controller';
import { openSettingsStudioModal } from './frontend/surfaces/SettingsStudio';
import { mountFloatingWidget } from './frontend/widget-mount';

export function setupWidget(
  ctx: SpindleFrontendContext,
  target: SpindleFrontendWidgetTarget,
): () => void {
  ctx.deferReady?.();

  const cleanup: Array<() => void> = [];
  cleanup.push(acquireLumiStatsStyles(ctx));

  const ctrl = new LumiFrontendController(ctx);
  cleanup.push(() => ctrl.destroy());

  const stopWidget = mountFloatingWidget(
    ctx,
    ctrl,
    () => openSettingsStudioModal(ctrl),
    target,
  );
  if (stopWidget) cleanup.push(stopWidget);

  cleanup.push(
    ctx.events.on('CHAT_SWITCHED', (payload: unknown) => {
      const obj = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};
      const nextChatId = typeof obj.chatId === 'string' ? obj.chatId : null;
      void ctrl.refreshActiveChat(nextChatId);
    }),
  );

  void ctrl.refreshActiveChat();
  ctx.ready?.();

  return () => {
    for (const fn of cleanup.reverse()) fn();
    ctx.dom.cleanup();
  };
}
