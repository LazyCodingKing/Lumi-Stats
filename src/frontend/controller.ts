import type {
  SpindleCollapsibleSectionHandle,
  SpindleContextMenuItemDef,
  SpindleFrontendContext,
  SpindleModalHandle,
  SpindleSelectOption,
} from 'lumiverse-spindle-types';
import {
  BUILTIN_TEMPLATES,
  BUILTIN_VISUAL_SKINS,
  createDefaultTemplate,
  createEmptyCampaignState,
  normalizeSkinPack,
} from '../shared/templates';
import {
  LUMI_STATS_CHANNEL,
  type CampaignSnapshot,
  type CopilotProposalRecord,
  type CopilotTurnRecord,
  type LumiRpcRequest,
  type LumiRpcResponse,
  type LumiStatsTemplate,
  type LumiUserSettings,
  type LumiVisualSkinPack,
  type PromptInjectionPosition,
} from '../shared/types';
import { svgIcon, svgIconString, type LumiIconName } from './icons';
import { LumiTtsEngine } from './stage/tts-engine';
import { LUMI_STATS_CSS } from './styles';

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = '',
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function btn(
  label: string,
  onClick: (e: MouseEvent) => void,
  className = '',
  title?: string,
): HTMLButtonElement {
  const b = el('button', className, label);
  b.type = 'button';
  if (title) {
    b.title = title;
    b.setAttribute('aria-label', title);
  }
  b.addEventListener('pointerdown', e => {
    e.stopPropagation();
  });
  b.addEventListener('click', e => {
    e.stopPropagation();
    onClick(e);
  });
  return b;
}

export function iconBtn(
  iconName: LumiIconName,
  onClick: (e: MouseEvent) => void,
  options?: { label?: string; className?: string; title?: string; size?: number },
): HTMLButtonElement {
  const b = el('button', options?.className ?? 'ls-btn-sm ls-btn-icon');
  b.type = 'button';
  b.append(svgIcon(iconName, options?.size ?? 14));
  if (options?.label) {
    b.append(el('span', '', options.label));
  }
  if (options?.title) {
    b.title = options.title;
    b.setAttribute('aria-label', options.title);
  }
  b.addEventListener('pointerdown', e => {
    e.stopPropagation();
  });
  b.addEventListener('click', e => {
    e.stopPropagation();
    onClick(e);
  });
  return b;
}

/**
 * Tracks mounted `ctx.components.*` handles inside a placement surface and
 * guarantees `.destroy()` is called before the surface's DOM is replaced or unmounted.
 */
export class ComponentScope {
  private handles: Array<{ destroy(): void }> = [];

  track<T extends { destroy(): void }>(handle: T): T {
    this.handles.push(handle);
    return handle;
  }

  clear(): void {
    for (const h of this.handles.splice(0)) {
      try {
        h.destroy();
      } catch {
        // Ignore already-destroyed component handle
      }
    }
  }
}

const SCROLLABLE_SELECTORS = [
  '.ls-drawer-body',
  '.ls-studio-pane',
  '.ls-studio-preview-pane',
  '.ls-hud-content',
  '.ls-dossier-main',
] as const;

let lastKeystrokeAt = 0;
if (typeof document !== 'undefined') {
  document.addEventListener(
    'keydown',
    e => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        lastKeystrokeAt = Date.now();
      }
    },
    { capture: true, passive: true },
  );
}

/**
 * Preserves scroll positions across `.replaceChildren()` updates and defers
 * full-tree rebuilds only while the user is actively typing (within 1,200ms of a keystroke).
 */
export function preserveScrollAndFocus(
  container: HTMLElement,
  renderFn: () => void,
  options?: { deferIfTyping?: boolean; onDeferredFlush?: () => void },
): boolean {
  const active = document.activeElement;
  const activelyTyping = Date.now() - lastKeystrokeAt < 1200;
  const isOpenSelectOrCombo =
    Boolean(document.body.querySelector('.ls-dd-menu[data-ls-dd-open="true"]')) ||
    Boolean(container.querySelector('[aria-expanded="true"], [data-state="open"]')) ||
    (active instanceof HTMLElement &&
      container.contains(active) &&
      active.tagName === 'SELECT');
  if (
    options?.deferIfTyping &&
    (activelyTyping || isOpenSelectOrCombo) &&
    active instanceof HTMLElement &&
    container.contains(active) &&
    (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA') &&
    (active as HTMLInputElement).type !== 'checkbox' &&
    (active as HTMLInputElement).type !== 'radio'
  ) {
    if (options.onDeferredFlush && !active.dataset.lsBlurDeferred) {
      active.dataset.lsBlurDeferred = 'true';
      active.addEventListener(
        'blur',
        () => {
          delete active.dataset.lsBlurDeferred;
          options.onDeferredFlush?.();
        },
        { once: true },
      );
    }
    return false;
  }

  const savedScrolls = new Map<string, { top: number; left: number }>();
  savedScrolls.set('__root__', { top: container.scrollTop, left: container.scrollLeft });
  for (const sel of SCROLLABLE_SELECTORS) {
    const found = container.querySelector<HTMLElement>(sel);
    if (found) {
      savedScrolls.set(sel, { top: found.scrollTop, left: found.scrollLeft });
    }
  }

  renderFn();

  const rootScroll = savedScrolls.get('__root__');
  if (rootScroll) {
    container.scrollTop = rootScroll.top;
    container.scrollLeft = rootScroll.left;
  }
  for (const sel of SCROLLABLE_SELECTORS) {
    const saved = savedScrolls.get(sel);
    if (!saved) continue;
    const nextEl = container.querySelector<HTMLElement>(sel);
    if (nextEl) {
      nextEl.scrollTop = saved.top;
      nextEl.scrollLeft = saved.left;
    }
  }
  return true;
}

/**
 * Searchable, top-layer portaled dropdown (`z-index: 2147483640`) that stays
 * reliable inside modals, fullscreen Studio overlays, and collapsed accordions.
 */
export function mountThemedSelect(
  _ctrl: LumiFrontendController,
  scope: ComponentScope | undefined,
  target: HTMLElement,
  opts: {
    value: string;
    options: SpindleSelectOption[];
    placeholder?: string;
    searchPlaceholder?: string;
    ariaLabel?: string;
    compact?: boolean;
    title?: string;
    portal?: boolean;
    onChange: (nextValue: string) => void;
  },
): {
  getValue: () => string;
  setValue: (nextValue: string) => void;
  setOptions: (nextOptions: SpindleSelectOption[], nextValue?: string) => void;
} {
  let currentValue = opts.value;
  let currentOptions = [...opts.options];
  let activeMenu: HTMLElement | null = null;
  let detachDocListeners: (() => void) | null = null;

  const wrap = el('div', 'ls-dd-wrap');
  if (opts.compact) wrap.dataset.compact = 'true';

  const trigger = el('button', 'ls-dd-trigger');
  trigger.type = 'button';
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  if (opts.ariaLabel) trigger.setAttribute('aria-label', opts.ariaLabel);
  if (opts.title) trigger.title = opts.title;

  const labelSpan = el('span', 'ls-dd-trigger-label');
  const caret = el('span', 'ls-dd-caret', '▾');
  trigger.append(labelSpan, caret);
  wrap.append(trigger);
  target.replaceChildren(wrap);

  const syncTriggerLabel = () => {
    const matched = currentOptions.find(o => o.value === currentValue);
    labelSpan.textContent =
      matched?.label || opts.placeholder || currentOptions[0]?.label || 'Select…';
  };
  syncTriggerLabel();

  const closeMenu = () => {
    if (detachDocListeners) {
      detachDocListeners();
      detachDocListeners = null;
    }
    if (activeMenu) {
      activeMenu.remove();
      activeMenu = null;
    }
    trigger.setAttribute('aria-expanded', 'false');
  };

  const openMenu = () => {
    closeMenu();
    for (const stale of [...document.body.querySelectorAll('.ls-dd-menu[data-ls-dd-open="true"]')]) {
      stale.remove();
    }

    const menu = el('div', 'ls-dd-menu');
    menu.setAttribute('role', 'listbox');
    menu.dataset.lsDdOpen = 'true';

    const cs = getComputedStyle(trigger);
    for (const v of [
      '--ls-bg',
      '--ls-surface',
      '--ls-text',
      '--ls-muted',
      '--ls-primary',
      '--ls-border',
      '--ls-fill',
      '--ls-fill-hover',
      '--ls-radius',
      '--ls-font',
    ]) {
      const val = cs.getPropertyValue(v).trim();
      if (val) menu.style.setProperty(v, val);
    }

    const listBox = el('div', 'ls-dd-list');
    let searchInp: HTMLInputElement | null = null;

    const renderOptions = (filterText = '') => {
      listBox.replaceChildren();
      const q = filterText.trim().toLowerCase();
      const visible = q
        ? currentOptions.filter(
            o =>
              o.label.toLowerCase().includes(q) ||
              (o.sublabel && o.sublabel.toLowerCase().includes(q)) ||
              o.value.toLowerCase().includes(q),
          )
        : currentOptions;

      if (!visible.length) {
        const emptyMsg = el('div', 'ls-muted', 'No matching options');
        emptyMsg.style.padding = '6px 8px';
        listBox.append(emptyMsg);
        return;
      }

      for (const opt of visible) {
        const itemBtn = el('button', 'ls-dd-option');
        itemBtn.type = 'button';
        itemBtn.setAttribute('role', 'option');
        itemBtn.setAttribute('aria-selected', String(opt.value === currentValue));
        if (opt.disabled) itemBtn.disabled = true;

        itemBtn.append(el('span', '', opt.label));
        if (opt.sublabel) {
          itemBtn.append(el('span', 'ls-dd-sublabel', opt.sublabel));
        }

        itemBtn.addEventListener('pointerdown', e => {
          e.stopPropagation();
        });
        itemBtn.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          currentValue = opt.value;
          syncTriggerLabel();
          closeMenu();
          opts.onChange(opt.value);
        });
        listBox.append(itemBtn);
      }
    };

    if (currentOptions.length >= 6) {
      searchInp = el('input', 'ls-dd-search');
      searchInp.type = 'text';
      searchInp.placeholder = opts.searchPlaceholder || 'Search…';
      searchInp.addEventListener('pointerdown', e => e.stopPropagation());
      searchInp.addEventListener('input', () => renderOptions(searchInp!.value));
      menu.append(searchInp);
    }

    renderOptions();
    menu.append(listBox);

    const bodyRect = document.body.getBoundingClientRect();
    const scale =
      bodyRect.width > 0 && document.body.offsetWidth > 0
        ? bodyRect.width / document.body.offsetWidth
        : 1;
    const tRect = trigger.getBoundingClientRect();
    const vw = window.innerWidth / scale;
    const vh = window.innerHeight / scale;
    const menuWidth = Math.max(Math.round(tRect.width / scale), 190);
    const estHeight = Math.min(280, currentOptions.length * 34 + (searchInp ? 48 : 16));
    const spaceBelow = vh - tRect.bottom / scale;
    const openUpward = spaceBelow < estHeight + 12 && tRect.top / scale > spaceBelow;

    const left = Math.max(8, Math.min(vw - menuWidth - 8, Math.round(tRect.left / scale)));
    menu.style.left = `${left}px`;
    menu.style.width = `${menuWidth}px`;
    if (openUpward) {
      menu.style.bottom = `${Math.max(8, Math.round(vh - tRect.top / scale + 4))}px`;
    } else {
      menu.style.top = `${Math.max(8, Math.round(tRect.bottom / scale + 4))}px`;
    }

    document.body.append(menu);
    activeMenu = menu;
    trigger.setAttribute('aria-expanded', 'true');
    if (searchInp) requestAnimationFrame(() => searchInp?.focus());

    const onDocPointerDown = (ev: Event) => {
      const targetNode = ev.target as Node | null;
      if (!targetNode) return;
      if (menu.contains(targetNode) || trigger.contains(targetNode)) return;
      closeMenu();
    };
    const onDocKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        ev.stopPropagation();
        closeMenu();
        trigger.focus();
      }
    };
    const onScrollOrResize = (ev: Event) => {
      if (ev.type === 'resize' && searchInp && document.activeElement === searchInp) return;
      if (ev.target instanceof Node && menu.contains(ev.target)) return;
      closeMenu();
    };

    window.addEventListener('pointerdown', onDocPointerDown, true);
    window.addEventListener('keydown', onDocKeyDown, true);
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    window.addEventListener('scroll', onScrollOrResize, { capture: true, passive: true });

    detachDocListeners = () => {
      window.removeEventListener('pointerdown', onDocPointerDown, true);
      window.removeEventListener('keydown', onDocKeyDown, true);
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('scroll', onScrollOrResize, true);
    };
  };

  trigger.addEventListener('pointerdown', e => {
    e.stopPropagation();
  });
  trigger.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    if (activeMenu) closeMenu();
    else openMenu();
  });

  scope?.track({ destroy: closeMenu });

  return {
    getValue: () => currentValue,
    setValue: (nextValue: string) => {
      currentValue = nextValue;
      syncTriggerLabel();
    },
    setOptions: (nextOptions: SpindleSelectOption[], nextValue?: string) => {
      currentOptions = [...nextOptions];
      if (nextValue !== undefined) currentValue = nextValue;
      syncTriggerLabel();
      if (activeMenu) openMenu();
    },
  };
}

export function mountNativeSwitch(
  _ctrl: LumiFrontendController,
  _scope: ComponentScope | undefined,
  target: HTMLElement,
  opts: {
    checked: boolean;
    ariaLabel?: string;
    size?: 'sm' | 'md';
    disabled?: boolean;
    onChange: (checked: boolean) => void;
  },
): void {
  const wrap = el('label', 'ls-toggle-switch');
  if (opts.size === 'md') wrap.dataset.size = 'md';
  const chk = el('input');
  chk.type = 'checkbox';
  chk.checked = opts.checked;
  chk.disabled = Boolean(opts.disabled);
  if (opts.ariaLabel) chk.setAttribute('aria-label', opts.ariaLabel);
  chk.addEventListener('change', () => opts.onChange(chk.checked));
  const track = el('span', 'ls-toggle-track');
  wrap.append(chk, track);
  target.replaceChildren(wrap);
}

export function mountNativeCheckbox(
  _ctrl: LumiFrontendController,
  _scope: ComponentScope | undefined,
  target: HTMLElement,
  opts: {
    checked: boolean;
    label: string;
    hint?: string;
    disabled?: boolean;
    onChange: (checked: boolean) => void;
  },
): void {
  const lbl = el('label', 'ls-check-row');
  const chk = el('input');
  chk.type = 'checkbox';
  chk.checked = opts.checked;
  chk.disabled = Boolean(opts.disabled);
  chk.addEventListener('change', () => opts.onChange(chk.checked));
  lbl.append(chk, el('span', '', opts.label));
  target.replaceChildren(lbl);
}

const accordionOpenMemory = new Map<string, boolean>();

export function mountNativeCollapsible(
  _ctrl: LumiFrontendController,
  _scope: ComponentScope | undefined,
  target: HTMLElement,
  opts: {
    title: string;
    iconName?: LumiIconName;
    badge?: string | number;
    defaultExpanded?: boolean;
    persistKey?: string;
    onToggle?: (expanded: boolean) => void;
  },
): HTMLElement {
  const details = el('details', 'ls-accordion');
  const remembered = opts.persistKey ? accordionOpenMemory.get(opts.persistKey) : undefined;
  details.open = remembered !== undefined ? remembered : Boolean(opts.defaultExpanded);
  const summary = el('summary', 'ls-accordion-head');
  const left = el('span', 'ls-row');
  if (opts.iconName) left.append(svgIcon(opts.iconName, 14));
  left.append(el('strong', '', opts.title));
  const right = el('span', 'ls-row');
  if (opts.badge !== undefined) {
    right.append(el('span', 'ls-chip', String(opts.badge)));
  }
  right.append(el('span', 'ls-accordion-chev', '▾'));
  summary.append(left, right);

  const body = el('div', 'ls-accordion-body ls-stack');
  details.append(summary, body);
  details.addEventListener('toggle', () => {
    if (opts.persistKey) accordionOpenMemory.set(opts.persistKey, details.open);
    opts.onToggle?.(details.open);
  });
  target.append(details);
  return body;
}

export function mountNativeBadge(
  ctrl: LumiFrontendController,
  scope: ComponentScope | undefined,
  target: HTMLElement,
  opts: {
    text: string;
    color?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
    size?: 'sm' | 'md' | 'pill';
  },
): void {
  if (typeof ctrl.ctx.components?.mountBadge === 'function') {
    try {
      const handle = ctrl.ctx.components.mountBadge(target, {
        text: opts.text,
        color: opts.color ?? 'neutral',
        size: opts.size ?? 'pill',
      });
      scope?.track(handle);
      return;
    } catch {
      // Fallback below
    }
  }
  target.replaceChildren(
    el('span', `ls-chip ${opts.color === 'primary' ? 'ls-chip-accent' : ''}`, opts.text),
  );
}

/**
 * Binds both right-click (`contextmenu`) and 500ms mobile touch long-press to
 * Lumiverse's native `ctx.ui.showContextMenu()`.
 */
export function bindContextMenuWithLongPress(
  ctx: SpindleFrontendContext,
  target: HTMLElement,
  getItems: () => SpindleContextMenuItemDef[],
  onSelect: (key: string) => void,
): void {
  const openAt = async (x: number, y: number) => {
    if (typeof ctx.ui?.showContextMenu !== 'function') return;
    const items = getItems();
    if (!items.length) return;
    const res = await ctx.ui.showContextMenu({
      position: { x, y },
      items,
    });
    if (res.selectedKey) {
      onSelect(res.selectedKey);
    }
  };

  target.addEventListener('contextmenu', e => {
    e.preventDefault();
    e.stopPropagation();
    void openAt(e.clientX, e.clientY);
  });

  let timer: ReturnType<typeof setTimeout> | null = null;
  let fired = false;
  let startPos = { x: 0, y: 0 };

  target.addEventListener(
    'touchstart',
    e => {
      fired = false;
      const t = e.touches[0];
      if (!t) return;
      startPos = { x: t.clientX, y: t.clientY };
      timer = setTimeout(() => {
        fired = true;
        navigator.vibrate?.(40);
        void openAt(t.clientX, t.clientY);
      }, 500);
    },
    { passive: true },
  );

  target.addEventListener(
    'touchmove',
    e => {
      if (!timer) return;
      const t = e.touches[0];
      if (!t) return;
      if (Math.abs(t.clientX - startPos.x) > 10 || Math.abs(t.clientY - startPos.y) > 10) {
        clearTimeout(timer);
        timer = null;
      }
    },
    { passive: true },
  );

  target.addEventListener('touchend', e => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (fired) {
      e.preventDefault();
      fired = false;
    }
  });
}

export class ModalManager {
  private activeModals = new Set<SpindleModalHandle>();

  constructor(private ctx: SpindleFrontendContext) {}

  hasOpenModals(): boolean {
    return this.activeModals.size > 0;
  }

  open(
    opts: { title: string; width?: number; maxHeight?: number; persistent?: boolean },
    render: (
      body: HTMLElement,
      close: () => void,
      handle: SpindleModalHandle,
      scope: ComponentScope,
    ) => void,
  ): SpindleModalHandle | undefined {
    if (typeof this.ctx.ui?.showModal !== 'function') {
      console.warn('[LumiStats ModalManager] ctx.ui.showModal is not a function — cannot open modal');
      return undefined;
    }
    if (this.activeModals.size >= 2) {
      const oldest = this.activeModals.values().next().value;
      oldest?.dismiss();
    }
    const scope = new ComponentScope();
    console.log('[LumiStats ModalManager] calling ctx.ui.showModal, title:', opts.title);
    const handle = this.ctx.ui.showModal({
      title: opts.title,
      width: opts.width ?? 640,
      maxHeight: opts.maxHeight ?? 760,
      persistent: opts.persistent ?? false,
    });
    console.log('[LumiStats ModalManager] showModal returned handle:', handle, 'root connected:', handle?.root?.isConnected);
    this.activeModals.add(handle);
    handle.root.classList.add('ls-root');
    handle.root.style.cssText += ';padding:16px;overflow-y:auto;height:auto;max-height:min(80vh, 740px);';
    handle.onDismiss(() => {
      scope.clear();
      this.activeModals.delete(handle);
    });
    render(handle.root, () => handle.dismiss(), handle, scope);
    return handle;
  }

  async confirm(opts: {
    title: string;
    message: string;
    confirmLabel?: string;
    variant?: 'info' | 'warning' | 'danger' | 'success';
  }): Promise<boolean> {
    if (typeof this.ctx.ui?.showConfirm === 'function') {
      const res = await this.ctx.ui.showConfirm({
        title: opts.title,
        message: opts.message,
        confirmLabel: opts.confirmLabel ?? 'Confirm',
        variant: opts.variant ?? 'warning',
      });
      return Boolean(res?.confirmed);
    }
    return false;
  }

  closeAll(): void {
    for (const m of [...this.activeModals]) {
      m.dismiss();
    }
    this.activeModals.clear();
  }
}

const styleRefCount = new WeakMap<Document, { count: number; remove: () => void }>();

export function acquireLumiStatsStyles(ctx: SpindleFrontendContext): () => void {
  const existing = styleRefCount.get(document);
  if (existing) {
    existing.count++;
    return () => {
      existing.count--;
      if (existing.count <= 0) {
        styleRefCount.delete(document);
        existing.remove();
      }
    };
  }
  const remove = ctx.dom.addStyle(LUMI_STATS_CSS);
  styleRefCount.set(document, { count: 1, remove });
  return () => {
    const cur = styleRefCount.get(document);
    if (!cur) return;
    cur.count--;
    if (cur.count <= 0) {
      styleRefCount.delete(document);
      cur.remove();
    }
  };
}

export function openCreateTemplateModal(
  ctrl: LumiFrontendController,
  onCreated?: () => void,
): void {
  ctrl.modals.open(
    { title: '✨ Create New Lumi Stats Template', width: 520 },
    (body, close, _handle, modalScope) => {
      const topGrid = el('div', 'ls-grid');
      const iconWrap = el('label', 'ls-label', 'Icon Emoji');
      const iconInp = el('input', 'ls-input');
      iconInp.value = '✨';
      iconWrap.append(iconInp);

      const nameWrap = el('label', 'ls-label', 'Template Name');
      const nameInp = el('input', 'ls-input');
      nameInp.placeholder = 'e.g. Modern Drama & Chemistry, Dark Fantasy RPG…';
      nameInp.value = '';
      nameWrap.append(nameInp);
      topGrid.append(iconWrap, nameWrap);

      const descWrap = el('label', 'ls-label', 'Short Description');
      const descInp = el('input', 'ls-input');
      descInp.placeholder = 'What kind of story or stats does this template track?';
      descWrap.append(descInp);

      let starterMode = 'universal_companion';
      const starterWrap = el('div', 'ls-label', 'Starter Stat Blueprint');
      const starterSlot = el('div');
      starterWrap.append(starterSlot);

      const customStarterOptions = ctrl.customTemplates
        .filter(ct => !ctrl.builtinTemplates.some(bt => bt.id === ct.id))
        .map(ct => ({
          value: ct.id,
          label: `${ct.icon} ${ct.name} (Saved · ${ct.stats.length} stats)`,
        }));

      mountThemedSelect(ctrl, modalScope, starterSlot, {
        value: starterMode,
        ariaLabel: 'Starter Stat Blueprint',
        options: [
          { value: 'empty', label: '🧹 Empty Canvas (0 stats — start completely from scratch)' },
          { value: 'blank', label: '🌱 Clean Minimal Starter (1 Trust meter — build your own)' },
          ...customStarterOptions,
          ...ctrl.builtinTemplates.map(b => ({
            value: b.id,
            label: `${b.icon} ${b.name} (${b.stats.length} stats)`,
          })),
        ],
        onChange: v => {
          starterMode = v;
        },
      });

      let selectedPromptPos: PromptInjectionPosition = 'post_history';
      let selectedPromptDepth = 1;
      const promptWrap = el('div', 'ls-label', '🧠 AI Prompt Placement (Where Lumi State Is Sent)');
      const promptBtnRow = el('div', 'ls-row');
      const depthRow = el('div', 'ls-row');
      depthRow.style.display = 'none';

      const syncPromptPosButtons = () => {
        for (const b of [...promptBtnRow.querySelectorAll<HTMLButtonElement>('button')]) {
          b.setAttribute('aria-current', b.dataset.pos === selectedPromptPos ? 'page' : 'false');
        }
        depthRow.style.display = selectedPromptPos === 'in_history' ? 'flex' : 'none';
      };

      for (const [ppVal, ppLbl] of [
        ['pre_history', '⬆️ Before History'],
        ['in_history', '💬 Within History'],
        ['post_history', '⬇️ After History'],
      ] as const) {
        const b = btn(ppLbl, () => {
          selectedPromptPos = ppVal;
          syncPromptPosButtons();
        }, 'ls-btn-sm');
        b.dataset.pos = ppVal;
        promptBtnRow.append(b);
      }

      const depthInp = el('input', 'ls-input');
      depthInp.type = 'number';
      depthInp.min = '0';
      depthInp.max = '20';
      depthInp.style.width = '76px';
      depthInp.value = String(selectedPromptDepth);
      depthInp.addEventListener('change', () => {
        selectedPromptDepth = Math.max(0, Math.min(20, Math.round(Number(depthInp.value) || 0)));
      });
      depthRow.append(el('small', 'ls-muted', 'History Depth:'), depthInp);
      syncPromptPosButtons();
      promptWrap.append(promptBtnRow, depthRow);

      const errBanner = el('small', 'ls-muted');
      errBanner.style.cssText = 'color:var(--ls-danger);display:none;';

      const createBtn = btn('✨ Create & Activate Template', () => {
        const name = nameInp.value.trim() || 'My Custom Template';
        const icon = iconInp.value.trim() || '✨';
        const description = descInp.value.trim() || 'Custom roleplay tracker template.';
        createBtn.disabled = true;
        createBtn.textContent = '⏳ Creating…';
        errBanner.style.display = 'none';
        void ctrl
          .request('template:createNew', {
            name,
            icon,
            description,
            starter: starterMode,
            promptPosition: selectedPromptPos,
            promptDepth: selectedPromptDepth,
          })
          .then(() => {
            ctrl.notify(`Created & activated "${icon} ${name}"!`);
            close();
            onCreated?.();
          })
          .catch(err => {
            errBanner.textContent = err instanceof Error ? err.message : String(err);
            errBanner.style.display = 'block';
            if (createBtn.isConnected) {
              createBtn.disabled = false;
              createBtn.textContent = '✨ Create & Activate Template';
            }
          });
      }, 'ls-btn-primary');
      createBtn.style.marginTop = '10px';

      body.append(topGrid, descWrap, starterWrap, promptWrap, errBanner, createBtn);
      requestAnimationFrame(() => nameInp.focus());
    },
  );
}

export function openQuickTemplateModal(
  ctrl: LumiFrontendController,
  onOpenStudio?: () => void,
): void {
  ctrl.modals.open(
    { title: '🎭 Quick Template, Game Skin & Placement Switcher', width: 660, maxHeight: 800 },
    (body, close, handle) => {
      const redraw = () => {
        const { template } = ctrl.snapshot;
        const allTemplates = [
          ...ctrl.builtinTemplates,
          ...ctrl.customTemplates.filter(ct => !ctrl.builtinTemplates.some(bt => bt.id === ct.id)),
        ];
        body.replaceChildren();

        const topRow = el('div', 'ls-row-between');
        topRow.append(
          el('span', 'ls-kicker', `Active: ${template.icon} ${template.name}`),
          el('div', 'ls-row'),
        );
        (topRow.lastElementChild as HTMLElement).append(
          btn('✨ + New Template', () => {
            close();
            openCreateTemplateModal(ctrl);
          }, 'ls-btn-sm ls-btn-primary'),
          ...(onOpenStudio
            ? [
                btn('⚙️ Full Studio', () => {
                  close();
                  onOpenStudio();
                }, 'ls-btn-sm'),
              ]
            : []),
        );
        body.append(topRow);

        const placeCard = el('div', 'ls-card');
        placeCard.append(el('span', 'ls-kicker', '🎮 1-Click Game Skin & Placement'));

        const skinRow = el('div', 'ls-row');
        for (const skin of BUILTIN_VISUAL_SKINS) {
          const b = btn(skin.name, () => {
            ctrl.applySkinPack(skin);
          }, 'ls-btn-sm');
          if ((template.theme.surfaceStyle || 'glass') === skin.surfaceStyle) {
            b.setAttribute('aria-current', 'page');
          }
          skinRow.append(b);
        }

        const pRow = el('div', 'ls-row');
        for (const [pVal, pLbl] of [
          ['both_bottom', '✨ HUD + Below Reply'],
          ['both_top', '✨ HUD + Above Reply'],
          ['inline_bottom', '💬 Below Reply Only'],
          ['floating_only', '🪟 Floating HUD Only'],
        ] as const) {
          const b = btn(pLbl, () => {
            void ctrl.request('state:mutate', {
              templatePatch: { theme: { ...template.theme, placement: pVal } },
              reason: 'Updated placement mode',
            });
          }, 'ls-btn-sm');
          if (template.theme.placement === pVal) b.setAttribute('aria-current', 'page');
          pRow.append(b);
        }

        const castRow = el('div', 'ls-row');
        castRow.append(el('small', 'ls-muted', 'Cast Tab:'));
        for (const [cVal, cLbl] of [
          ['roster', '👥 Icon Roster (In Scene / Away)'],
          ['cards', '🗂️ All Cards Expanded'],
        ] as const) {
          const b = btn(cLbl, () => {
            void ctrl.request('state:mutate', {
              templatePatch: { theme: { ...template.theme, castLayout: cVal } },
              reason: 'Updated cast layout mode',
            });
          }, 'ls-btn-sm');
          if ((template.theme.castLayout || 'roster') === cVal) b.setAttribute('aria-current', 'page');
          castRow.append(b);
        }

        const tabsIconRow = el('div', 'ls-row');
        tabsIconRow.append(el('small', 'ls-muted', 'Widget Tabs:'));
        for (const [iconOnlyVal, lbl] of [
          [false, '🏷️ Icons + Text'],
          [true, '✨ Icons Only'],
        ] as const) {
          const b = btn(lbl, () => {
            void ctrl.request('state:mutate', {
              templatePatch: {
                theme: { ...template.theme, widgetTabsIconOnly: iconOnlyVal },
              },
              reason: `Set widget tabs to ${iconOnlyVal ? 'icons only' : 'icons + labels'}`,
            });
          }, 'ls-btn-sm');
          if (Boolean(template.theme.widgetTabsIconOnly) === iconOnlyVal) {
            b.setAttribute('aria-current', 'page');
          }
          tabsIconRow.append(b);
        }

        const promptPosRow = el('div', 'ls-row');
        promptPosRow.append(el('small', 'ls-muted', 'Send State:'));
        for (const [ppVal, ppLbl] of [
          ['pre_history', '⬆️ Before History'],
          ['in_history', '💬 Within History'],
          ['post_history', '⬇️ After History'],
        ] as const) {
          const b = btn(ppLbl, () => {
            void ctrl.request('state:mutate', {
              templatePatch: { promptPosition: ppVal },
              reason: `Set Lumi State prompt position to ${ppVal}`,
            });
          }, 'ls-btn-sm');
          if ((template.promptPosition || 'post_history') === ppVal) {
            b.setAttribute('aria-current', 'page');
          }
          promptPosRow.append(b);
        }
        if (template.promptPosition === 'in_history') {
          const dInp = el('input', 'ls-input');
          dInp.type = 'number';
          dInp.min = '0';
          dInp.max = '20';
          dInp.title = 'History depth (messages back from end)';
          dInp.style.cssText = 'width:62px;min-height:27px;padding:2px 6px;font-size:11px;';
          dInp.value = String(Math.max(0, Math.round(Number(template.promptDepth ?? 1) || 0)));
          dInp.addEventListener('change', () => {
            const nextDepth = Math.max(0, Math.min(20, Math.round(Number(dInp.value) || 0)));
            void ctrl.request('state:mutate', {
              templatePatch: { promptDepth: nextDepth },
              reason: `Set Lumi State depth to ${nextDepth}`,
            });
          });
          promptPosRow.append(el('small', 'ls-muted', 'Depth:'), dInp);
        }

        const pillSkinRow = el('div', 'ls-row');
        pillSkinRow.append(el('small', 'ls-muted', 'Pill Skin:'));
        const pillSkinSlot = el('div');
        pillSkinSlot.style.minWidth = '210px';
        pillSkinRow.append(pillSkinSlot);
        mountThemedSelect(ctrl, undefined, pillSkinSlot, {
          value: template.theme.pillStyle || 'glass_capsule',
          compact: true,
          ariaLabel: 'Collapsed Pill Skin',
          options: [
            { value: 'glass_capsule', label: '✨ Frosted Split Capsule (Best)' },
            { value: 'vn_dialogue_bar', label: '🎬 VN Cinema Strip' },
            { value: 'rpg_status_bar', label: '⚔️ JRPG Party Status Bar' },
            { value: 'persona_ticker', label: '🃏 Stylish Pop Ticker' },
            { value: 'cyber_telemetry', label: '🛸 Cyber Telemetry' },
            { value: 'minimal_floating', label: '☁️ Minimal Ghost Pill' },
            { value: 'neon_edge', label: '⚡ Neon Glow Rail' },
            { value: 'split_deck', label: '🗂️ Dual-Deck Card Pill' },
            { value: 'compact_badge', label: '📱 Micro Compact Badge' },
            { value: 'ledger_strip', label: '📜 Editorial Case Strip' },
          ],
          onChange: nextPill => {
            void ctrl.request('state:mutate', {
              templatePatch: {
                theme: { ...template.theme, pillStyle: nextPill as typeof template.theme.pillStyle },
              },
              reason: `Changed Pill Skin to ${nextPill}`,
            });
          },
        });

        placeCard.append(skinRow, pillSkinRow, pRow, castRow, tabsIconRow, promptPosRow);
        body.append(placeCard);

        const savedCustom = allTemplates.filter(item => !ctrl.builtinTemplates.some(b => b.id === item.id));
        const builtinList = allTemplates.filter(item => ctrl.builtinTemplates.some(b => b.id === item.id));
        const orderedTemplates = [...savedCustom, ...builtinList];

        const list = el('div', 'ls-grid');
        list.style.marginTop = '8px';
        for (const item of orderedTemplates) {
          const isActive = item.id === template.id;
          const isCustom = !ctrl.builtinTemplates.some(b => b.id === item.id);
          const card = el('div', 'ls-preset-card');
          card.dataset.active = String(isActive);
          const head = el('div', 'ls-row-between');
          head.append(
            el('strong', '', `${item.icon} ${item.name}`),
            el('span', `ls-chip ${isCustom ? 'ls-chip-accent' : ''}`, isCustom ? 'Saved Custom' : 'Built-In'),
          );
          const actions = el('div', 'ls-row');
          if (isActive) {
            actions.append(el('span', 'ls-chip ls-chip-accent', '✓ Active'));
          } else {
            const actBtn = btn('Activate', () => {
              actBtn.disabled = true;
              actBtn.textContent = 'Applying…';
              void ctrl
                .request('template:apply', { templateId: item.id, template: item })
                .then(() => ctrl.notify(`Switched to "${item.name}"`))
                .catch(err => {
                  ctrl.notify(err instanceof Error ? err.message : String(err), true);
                  if (actBtn.isConnected) {
                    actBtn.disabled = false;
                    actBtn.textContent = 'Activate';
                  }
                });
            }, 'ls-btn-sm ls-btn-primary');
            actions.append(actBtn);
          }
          actions.append(
            btn('📋 Duplicate', () => {
              void ctrl
                .request('template:duplicate', {
                  sourceTemplateId: item.id,
                  template: item,
                  name: `${item.name} (Custom)`,
                })
                .then(() => ctrl.notify(`Duplicated "${item.name}"`))
                .catch(err => ctrl.notify(err instanceof Error ? err.message : String(err), true));
            }, 'ls-btn-sm'),
          );
          card.append(head, el('small', 'ls-muted', item.description), actions);
          list.append(card);
        }
        body.append(list);
      };
      redraw();
      const unsub = ctrl.subscribe(redraw);
      handle.onDismiss(unsub);
    },
  );
}

export function safeRandomUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6]! & 0x0f) | 0x40;
    bytes[8] = (bytes[8]! & 0x3f) | 0x80;
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export class LumiFrontendController {
  readonly modals: ModalManager;
  readonly tts = new LumiTtsEngine();
  chatId = '';
  snapshot: CampaignSnapshot;
  settings: LumiUserSettings | undefined;
  customTemplates: LumiStatsTemplate[] = [];
  builtinTemplates: LumiStatsTemplate[] = BUILTIN_TEMPLATES;
  connections: Array<{ id: string; name: string; provider?: string; model?: string; is_default?: boolean }> = [];
  recentTurns: Array<{ id: string; role: 'user' | 'assistant'; content: string }> = [];
  copilotTurns: CopilotTurnRecord[] = [];
  activeProposal: CopilotProposalRecord | undefined;
  busy = false;
  statusText = '';
  statusError = false;
  isGenerationStreaming = false;
  isDrawerTabVisible = true;
  vnStageOpen = false;
  studioOpen = false;
  vnShowHudWidget = true;
  onToggleVnStage: (() => void) | null = null;

  activeDrawerTab: 'Stats' | 'Cast' | 'Map' | 'World' | 'Copilot' = 'Stats';
  activeSurfaceTab = 'stats';
  activeInlineTab = 'stats';
  activeDossierTab = 'overview';
  dossierEditMode = false;
  webFilterMode: 'all' | 'player' | 'npc' = 'all';
  activeCopilotMode: 'ask' | 'adjust' | 'architect' = 'ask';
  inlineExpanded = false;
  widgetExpanded = false;
  selectedActorId = '';
  openedCastTabs: string[] = [];
  activeCastTabActorId = '';
  selectedPlaceId = '';
  hydratingChat = false;
  activeOverlayCleanup: (() => void) | null = null;
  onResizeWidgetLive: ((width: number, height: number, commit: boolean) => void) | null = null;
  private lastThemeAppliedChatId = '';
  private customCssEl: HTMLStyleElement | null = null;

  private pendingRpc = new Map<
    string,
    {
      resolve: (data: Record<string, unknown>) => void;
      reject: (err: Error) => void;
      timer: ReturnType<typeof setTimeout>;
    }
  >();
  private listeners = new Set<() => void>();
  private statusListeners = new Set<() => void>();
  private disposers: Array<() => void> = [];

  constructor(readonly ctx: SpindleFrontendContext) {
    this.modals = new ModalManager(ctx);
    const tpl = createDefaultTemplate();
    this.snapshot = {
      schemaVersion: 1,
      chatId: '',
      revision: 0,
      state: createEmptyCampaignState(tpl),
      template: tpl,
      deltas: { statDeltas: {}, characterDeltas: {} },
      bindings: [],
      checkpoints: [],
    };

    this.disposers.push(
      ctx.onBackendMessage(raw => {
        if (!raw || typeof raw !== 'object') return;
        const msg = raw as Record<string, unknown>;
        if (msg.channel !== LUMI_STATS_CHANNEL) return;

        if (msg.type === 'rpc_ack' && typeof msg.requestId === 'string') {
          const pending = this.pendingRpc.get(msg.requestId);
          if (pending) {
            clearTimeout(pending.timer);
            this.pendingRpc.delete(msg.requestId);
            const resp = msg as unknown as LumiRpcResponse;
            if (resp.ok) pending.resolve(resp.data ?? {});
            else {
              this.notify(resp.error ?? 'Operation failed', true);
              pending.reject(new Error(resp.error ?? 'Operation failed'));
            }
          }
          return;
        }

        const incomingChatId =
          typeof msg.resolvedChatId === 'string' && msg.resolvedChatId
            ? msg.resolvedChatId
            : typeof msg.chatId === 'string' && msg.chatId !== 'sandbox'
              ? msg.chatId
              : '';

        if (!this.chatId && incomingChatId) {
          this.chatId = incomingChatId;
        }
        if (incomingChatId && this.chatId && incomingChatId !== this.chatId) return;

        if (msg.type === 'snapshot' && msg.snapshot) {
          this.hydratingChat = false;
          this.snapshot = msg.snapshot as CampaignSnapshot;
          const srf = this.snapshot.template.surfaces;
          const enabledWidget = srf.widgetTabs.filter(t => t.enabled);
          if (enabledWidget.length && !enabledWidget.some(t => t.id === this.activeSurfaceTab)) {
            this.activeSurfaceTab = enabledWidget[0]!.id;
          }
          const enabledInline = srf.inlineTabs.filter(t => t.enabled);
          if (enabledInline.length && !enabledInline.some(t => t.id === this.activeInlineTab)) {
            this.activeInlineTab = enabledInline[0]!.id;
          }
          const enabledDossier = srf.dossierTabs.filter(t => t.enabled);
          if (enabledDossier.length && !enabledDossier.some(t => t.id === this.activeDossierTab)) {
            this.activeDossierTab = enabledDossier[0]!.id;
          }
          if (this.chatId && this.lastThemeAppliedChatId !== this.chatId) {
            this.lastThemeAppliedChatId = this.chatId;
            this.inlineExpanded = Boolean(this.snapshot.template.theme.inlineDefaultExpanded);
          }
          if (this.selectedActorId && !this.snapshot.state.characters[this.selectedActorId]) {
            this.selectedActorId = '';
          }
          this.openedCastTabs = this.openedCastTabs.filter(
            id => Boolean(this.snapshot.state.characters[id]),
          );
          if (
            this.activeCastTabActorId &&
            !this.snapshot.state.characters[this.activeCastTabActorId]
          ) {
            this.activeCastTabActorId = '';
          }
          if (this.selectedPlaceId && !this.snapshot.state.places[this.selectedPlaceId]) {
            this.selectedPlaceId = '';
          }
          if (msg.settings) {
            this.settings = msg.settings as LumiUserSettings;
            if (typeof this.settings.vnShowHudWidget === 'boolean') {
              this.vnShowHudWidget = this.settings.vnShowHudWidget;
            }
          }
          if (Array.isArray(msg.customTemplates)) {
            this.customTemplates = msg.customTemplates as LumiStatsTemplate[];
          }
          if (Array.isArray(msg.copilotTurns)) {
            this.copilotTurns = msg.copilotTurns as CopilotTurnRecord[];
          }
          this.busy = msg.busy === true;
          this.applyTemplateThemeToDom();
          this.emitChange();
          this.emitStatusChange();
        } else if (msg.type === 'status') {
          this.busy = msg.busy === true;
          this.statusText = String(msg.text ?? '');
          this.statusError = false;
          this.emitStatusChange();
        } else if (msg.type === 'error') {
          this.busy = false;
          this.notify(String(msg.message ?? 'Error'), true);
        }
      }),
    );
  }

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  subscribeStatus(fn: () => void): () => void {
    this.statusListeners.add(fn);
    return () => this.statusListeners.delete(fn);
  }

  applySkinPack(rawSkin: unknown): void {
    const skin: LumiVisualSkinPack = normalizeSkinPack(rawSkin);
    const cur = this.snapshot.template.theme;
    void this.request('state:mutate', {
      templatePatch: {
        theme: {
          ...cur,
          surfaceStyle: skin.surfaceStyle,
          frameShape: skin.frameShape,
          meterStyle: skin.meterStyle,
          accentHue: skin.accentHue,
          secondaryHue: skin.secondaryHue,
          glowIntensity: skin.glowIntensity ?? 55,
          glassBlur: skin.glassBlur !== false,
          compact: Boolean(skin.compact),
          castLayout: skin.castLayout ?? cur.castLayout ?? 'roster',
          ...(skin.customCss !== undefined ? { customCss: skin.customCss } : {}),
        },
      },
      reason: `Applied visual skin "${skin.name}"`,
    });
    this.notify(`Applied "${skin.name}" visual skin!`);
  }

  stampThemeOnElement(node: HTMLElement): void {
    const theme = this.snapshot.template.theme;
    const styleMode = theme.surfaceStyle || 'glass';
    const frameShape = theme.frameShape || (theme.radiusPreset === 'sharp' ? 'sharp' : 'rounded');
    const meterStyle = theme.meterStyle || 'smooth';
    const glassBlur = theme.glassBlur !== false;
    const glow = Math.max(0, Math.min(100, Number(theme.glowIntensity ?? 55))) / 100;
    const isCompact = Boolean(theme.compact);
    const hasHue = typeof theme.accentHue === 'number' && Number.isFinite(theme.accentHue);
    const hasSecHue = typeof theme.secondaryHue === 'number' && Number.isFinite(theme.secondaryHue);

    node.dataset.lsStyle = styleMode;
    node.dataset.lsPill = theme.pillStyle || 'glass_capsule';
    node.dataset.lsFrame = frameShape;
    node.dataset.lsMeter = meterStyle;
    node.dataset.lsBlur = String(glassBlur);
    node.dataset.lsCompact = String(isCompact);
    node.style.setProperty('--ls-glow', glow.toFixed(2));
    if (hasHue) {
      node.style.setProperty('--ls-primary', `hsl(${theme.accentHue}, 86%, 62%)`);
    } else {
      node.style.removeProperty('--ls-primary');
    }
    if (hasSecHue) {
      node.style.setProperty('--ls-accent', `hsl(${theme.secondaryHue}, 82%, 68%)`);
    } else if (hasHue) {
      node.style.setProperty('--ls-accent', `hsl(${(theme.accentHue! + 28) % 360}, 82%, 68%)`);
    } else {
      node.style.removeProperty('--ls-accent');
    }
  }

  applyTemplateThemeToDom(): void {
    if (typeof document === 'undefined') return;
    const theme = this.snapshot.template.theme;

    for (const node of document.querySelectorAll<HTMLElement>(
      '.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay',
    )) {
      this.stampThemeOnElement(node);
    }

    const rawCss = (theme.customCss || '').trim();
    if (rawCss) {
      const safeCss = rawCss.replace(/@import\b[^;]*;?/gi, '').replace(/url\s*\([^)]*\)/gi, '');
      if (!this.customCssEl) {
        this.customCssEl = document.createElement('style');
        this.customCssEl.dataset.lsCustomCss = 'true';
        document.head.append(this.customCssEl);
      }
      if (this.customCssEl.textContent !== safeCss) {
        this.customCssEl.textContent = safeCss;
      }
    } else if (this.customCssEl) {
      this.customCssEl.remove();
      this.customCssEl = null;
    }
  }

  emitChange(): void {
    for (const fn of this.listeners) fn();
    this.applyTemplateThemeToDom();
  }

  emitStatusChange(): void {
    for (const fn of this.statusListeners) fn();
  }

  notify(text: string, isError = false): void {
    this.statusText = text;
    this.statusError = isError;
    this.emitStatusChange();
  }

  request(type: string, payload: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
    const effectiveChatId = this.chatId || 'sandbox';
    const requestId = safeRandomUuid();
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingRpc.delete(requestId);
        reject(new Error(`RPC timeout waiting for ${type}`));
      }, 60_000);
      this.pendingRpc.set(requestId, { resolve, reject, timer });
      const req: LumiRpcRequest = {
        channel: LUMI_STATS_CHANNEL,
        requestId,
        chatId: effectiveChatId,
        type,
        payload,
      };
      this.ctx.sendToBackend(req);
    });
  }

  isActivityForActiveChat(activityChatId?: string | null): boolean {
    let hostActive = '';
    try {
      hostActive = this.ctx.getActiveChat?.()?.chatId ?? '';
    } catch {
      hostActive = '';
    }
    if (hostActive && hostActive !== this.chatId) {
      void this.refreshActiveChat(hostActive);
    }
    const effective = hostActive || this.chatId;
    if (!effective) {
      if (activityChatId && activityChatId !== 'sandbox') {
        void this.refreshActiveChat(activityChatId);
      }
      return true;
    }
    return !activityChatId || activityChatId === effective;
  }

  async refreshActiveChat(hintedChatId?: string | null): Promise<void> {
    let active = typeof hintedChatId === 'string' ? hintedChatId.trim() : '';
    if (!active && hintedChatId !== null) {
      try {
        active = this.ctx.getActiveChat?.()?.chatId ?? '';
      } catch {
        active = '';
      }
    }
    if (active !== this.chatId) {
      this.chatId = active;
      this.selectedActorId = '';
      this.openedCastTabs = [];
      this.activeCastTabActorId = '';
      this.selectedPlaceId = '';
      this.activeProposal = undefined;
    }
    this.hydratingChat = true;
    const res = await this.request('snapshot:get').catch(() => ({} as Record<string, unknown>));
    this.hydratingChat = false;
    if (typeof res.resolvedChatId === 'string' && res.resolvedChatId && !this.chatId) {
      this.chatId = res.resolvedChatId;
    }
    if (Array.isArray(res.connections)) {
      this.connections = res.connections as typeof this.connections;
    }
    if (Array.isArray(res.recentTurns)) {
      this.recentTurns = res.recentTurns as typeof this.recentTurns;
    }
    this.emitChange();
  }

  toggleVnStage(): void {
    this.onToggleVnStage?.();
  }

  uploadStageVariantAsset(params: {
    targetId: string;
    kind: 'sprite_variant' | 'backdrop_variant';
    emotionTag?: string;
    clothesTag?: string;
    poseTag?: string;
    timeSlot?: string;
    customTag?: string;
  }): void {
    void this.ctx.uploads
      .pickFile({
        accept: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
        multiple: false,
        maxSizeBytes: 6_000_000,
      })
      .then(files => {
        const file = files[0];
        if (!file) return;
        const chunkSize = 0x8000;
        let binary = '';
        for (let i = 0; i < file.bytes.length; i += chunkSize) {
          binary += String.fromCharCode(...file.bytes.subarray(i, i + chunkSize));
        }
        this.notify('⏳ Uploading & saving stage asset variant…');
        void this.request('asset:upload', {
          dataUrl: `data:${file.mimeType || 'image/png'};base64,${btoa(binary)}`,
          ...params,
        });
      })
      .catch(err => this.notify(err instanceof Error ? err.message : String(err), true));
  }

  pickAndUploadImage(
    targetId: string,
    kind: 'portrait' | 'expression' | 'backdrop',
    variant = 'neutral',
  ): void {
    void this.ctx.uploads
      .pickFile({
        accept: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
        multiple: false,
        maxSizeBytes: 6_000_000,
      })
      .then(files => {
        const file = files[0];
        if (!file) return;
        const chunkSize = 0x8000;
        let binary = '';
        for (let i = 0; i < file.bytes.length; i += chunkSize) {
          binary += String.fromCharCode(...file.bytes.subarray(i, i + chunkSize));
        }
        this.notify(`⏳ Uploading ${kind}…`);
        void this.request('asset:upload', {
          dataUrl: `data:${file.mimeType || 'image/png'};base64,${btoa(binary)}`,
          targetId,
          kind,
          variant,
        });
      })
      .catch(err => this.notify(err instanceof Error ? err.message : String(err), true));
  }

  destroy(): void {
    this.tts.destroy();
    if (this.customCssEl) {
      this.customCssEl.remove();
      this.customCssEl = null;
    }
    if (this.activeOverlayCleanup) {
      this.activeOverlayCleanup();
      this.activeOverlayCleanup = null;
    }
    this.modals.closeAll();
    for (const p of this.pendingRpc.values()) {
      clearTimeout(p.timer);
    }
    this.pendingRpc.clear();
    for (const fn of this.disposers.splice(0)) fn();
    this.listeners.clear();
    this.statusListeners.clear();
  }
}
