import type { VnBgTransitionStyle } from '../../shared/types';

const AMBIENT_CACHE_STORAGE_KEY = 'lumi_stats_ambient_light_v1';
const SAMPLE_W = 32;
const SAMPLE_H = 18;
const STRIP_COUNT = 7;

const SPEAKER_COLOR_PALETTE = [
  '#38bdf8',
  '#f472b6',
  '#a78bfa',
  '#34d399',
  '#fb923c',
  '#f87171',
  '#2dd4bf',
  '#e879f9',
  '#facc15',
  '#60a5fa',
];

export interface AmbientLightingState {
  bri: number;
  sat: number;
  rimR: number;
  rimG: number;
  rimB: number;
  rimA: number;
  rimX: number;
}

const NEUTRAL_LIGHTING: AmbientLightingState = {
  bri: 1,
  sat: 1,
  rimR: 255,
  rimG: 255,
  rimB: 255,
  rimA: 0.22,
  rimX: 0,
};

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function escapeCssUrl(url: string): string {
  return String(url || '').replace(/["'()\\]/g, '\\$&');
}

export function getSpeakerAccentColor(speakerName: string): string {
  const key = String(speakerName || '').trim();
  if (!key) return '#38bdf8';
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return SPEAKER_COLOR_PALETTE[(h >>> 0) % SPEAKER_COLOR_PALETTE.length]!;
}

export class LumiStageDirector {
  private lightingMemoryCache = new Map<string, AmbientLightingState>();
  private sampleCanvas: HTMLCanvasElement | null = null;
  private transitionToken = 0;
  private flashTimer: ReturnType<typeof setTimeout> | null = null;
  private pointerMoveListener: ((ev: PointerEvent) => void) | null = null;
  private parallaxState = {
    tx: 0,
    ty: 0,
    x: 0,
    y: 0,
    pushTarget: 0,
    push: 0,
    zoomTarget: 1,
    zoom: 1,
    rafId: 0,
    bound: false,
  };

  constructor() {
    this.restoreLightingCacheFromStorage();
  }

  private restoreLightingCacheFromStorage(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(AMBIENT_CACHE_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, AmbientLightingState>;
      if (parsed && typeof parsed === 'object') {
        for (const [k, v] of Object.entries(parsed)) {
          if (v && typeof v.bri === 'number') {
            this.lightingMemoryCache.set(k, v);
          }
        }
      }
    } catch {
      // Ignore storage read errors
    }
  }

  private saveLightingCacheToStorage(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const entries = [...this.lightingMemoryCache.entries()].slice(-40);
      localStorage.setItem(AMBIENT_CACHE_STORAGE_KEY, JSON.stringify(Object.fromEntries(entries)));
    } catch {
      // Ignore quota errors
    }
  }

  public async sampleAndApplyAmbientLight(
    bgUrl: string,
    stageRoot: HTMLElement | null,
    enabled = true,
  ): Promise<AmbientLightingState> {
    if (!stageRoot || !enabled || !bgUrl) {
      stageRoot?.classList.remove('ls-vn-ambient-on');
      return NEUTRAL_LIGHTING;
    }

    const cached = this.lightingMemoryCache.get(bgUrl);
    if (cached) {
      this.applyLightingToDom(stageRoot, cached);
      return cached;
    }

    const img = await this.loadImageSafe(bgUrl);
    if (!img) {
      stageRoot.classList.remove('ls-vn-ambient-on');
      return NEUTRAL_LIGHTING;
    }

    try {
      if (!this.sampleCanvas) {
        this.sampleCanvas = document.createElement('canvas');
        this.sampleCanvas.width = SAMPLE_W;
        this.sampleCanvas.height = SAMPLE_H;
      }
      const ctx = this.sampleCanvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return NEUTRAL_LIGHTING;
      ctx.drawImage(img, 0, 0, SAMPLE_W, SAMPLE_H);
      const data = ctx.getImageData(0, 0, SAMPLE_W, SAMPLE_H).data;

      const pixels: Array<{ r: number; g: number; b: number; l: number; x: number }> = [];
      let sumL = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]!;
        const g = data[i + 1]!;
        const b = data[i + 2]!;
        const l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        sumL += l;
        const idx = i / 4;
        pixels.push({ r, g, b, l, x: (idx % SAMPLE_W) / (SAMPLE_W - 1) });
      }

      const count = pixels.length;
      pixels.sort((a, b) => b.l - a.l);
      const top = pixels.slice(0, Math.max(1, Math.floor(count * 0.1)));
      let tr = 0;
      let tg = 0;
      let tb = 0;
      let tl = 0;
      let tx = 0;
      for (const p of top) {
        tr += p.r;
        tg += p.g;
        tb += p.b;
        tl += p.l;
        tx += p.x;
      }
      const m = top.length;
      const lum = sumL / count;
      const hi: [number, number, number] = [tr / m, tg / m, tb / m];
      const hiLum = tl / m;
      const hx = tx / m;
      const hiMax = Math.max(hi[0], hi[1], hi[2], 1);
      const rim = hi.map(v => clamp((v / hiMax) * 255 * 1.05 + 20, 0, 255)) as [
        number,
        number,
        number,
      ];
      const rimX = Math.abs(hx - 0.5) < 0.12 ? 0 : hx < 0.5 ? -1 : 1;

      const computed: AmbientLightingState = {
        bri: clamp(0.88 + lum * 0.22, 0.92, 1.06),
        sat: clamp(0.92 + lum * 0.15, 0.92, 1.05),
        rimR: rim[0],
        rimG: rim[1],
        rimB: rim[2],
        rimA: clamp(0.2 + (hiLum - lum) * 1.1, 0.2, 0.8) * 0.55,
        rimX,
      };

      if (this.lightingMemoryCache.size >= 50) {
        const oldest = this.lightingMemoryCache.keys().next().value;
        if (oldest) this.lightingMemoryCache.delete(oldest);
      }
      this.lightingMemoryCache.set(bgUrl, computed);
      this.saveLightingCacheToStorage();
      this.applyLightingToDom(stageRoot, computed);
      return computed;
    } catch {
      stageRoot.classList.remove('ls-vn-ambient-on');
      return NEUTRAL_LIGHTING;
    }
  }

  private applyLightingToDom(stageRoot: HTMLElement, state: AmbientLightingState): void {
    stageRoot.classList.add('ls-vn-ambient-on');
    stageRoot.style.setProperty('--ls-vn-amb-bri', state.bri.toFixed(3));
    stageRoot.style.setProperty('--ls-vn-amb-sat', state.sat.toFixed(3));
    stageRoot.style.setProperty(
      '--ls-vn-rim-color',
      `rgba(${Math.round(state.rimR)}, ${Math.round(state.rimG)}, ${Math.round(state.rimB)}, ${state.rimA.toFixed(3)})`,
    );
    stageRoot.style.setProperty('--ls-vn-rim-x', `${(state.rimX * 4).toFixed(1)}px`);
  }

  private loadImageSafe(url: string): Promise<HTMLImageElement | null> {
    return new Promise(resolve => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      const timer = setTimeout(() => resolve(null), 3500);
      img.onload = () => {
        clearTimeout(timer);
        resolve(img);
      };
      img.onerror = () => {
        clearTimeout(timer);
        resolve(null);
      };
      img.src = url;
    });
  }

  public async playBackgroundTransition(params: {
    stageRoot: HTMLElement;
    prevUrl: string;
    nextUrl: string;
    transition: VnBgTransitionStyle;
    sceneTitle?: string;
    timeLabel?: string;
    forcePreview?: boolean;
  }): Promise<void> {
    const { stageRoot, prevUrl, nextUrl, transition, forcePreview } = params;
    const baseLayer = stageRoot.querySelector<HTMLElement>('.ls-vn-bg-base');
    const frontLayer = stageRoot.querySelector<HTMLElement>('.ls-vn-bg-front');
    const stack = stageRoot.querySelector<HTMLElement>('.ls-vn-bg-stack');
    if (!baseLayer || !frontLayer || !stack) return;

    const fallbackGradient =
      'radial-gradient(circle at 50% 28%, rgba(56, 189, 248, 0.24), rgba(15, 23, 42, 0.92) 62%, #050811 100%)';
    const nextBgCss = nextUrl ? `url("${escapeCssUrl(nextUrl)}")` : fallbackGradient;
    const prevBgCss =
      prevUrl && prevUrl !== nextUrl
        ? `url("${escapeCssUrl(prevUrl)}")`
        : 'radial-gradient(circle at 50% 50%, #090d1a, #03050a 85%)';

    if (!forcePreview && !prevUrl && !nextUrl) {
      baseLayer.style.backgroundImage = fallbackGradient;
      return;
    }
    if (!forcePreview && prevUrl === nextUrl) {
      baseLayer.style.backgroundImage = nextBgCss;
      return;
    }

    const token = ++this.transitionToken;
    baseLayer.style.backgroundImage = prevBgCss;

    if (transition === 'flash') {
      this.flashStage(stageRoot, '#ffffff', 550);
    }

    if (transition === 'black') {
      const curtain = document.createElement('div');
      curtain.className = 'ls-vn-curtain';
      const sub = document.createElement('div');
      sub.className = 'ls-kicker';
      sub.textContent = params.timeLabel || 'SCENE TRANSITION';
      const title = document.createElement('div');
      title.style.cssText = 'font-size:22px;font-weight:800;color:#fff;margin-top:6px;';
      title.textContent = params.sceneTitle || 'Current Scene';
      curtain.append(sub, title);
      stageRoot.append(curtain);
      void curtain.offsetWidth;
      curtain.classList.add('is-active');
      await new Promise(r => setTimeout(r, 440));
      if (this.transitionToken === token) {
        baseLayer.style.backgroundImage = nextBgCss;
      }
      await new Promise(r => setTimeout(r, 480));
      curtain.classList.remove('is-active');
      setTimeout(() => curtain.remove(), 420);
      return;
    }

    if (transition === 'strips') {
      const box = document.createElement('div');
      box.className = 'ls-vn-bg-strips';
      const slant = 3.2;
      for (let i = 0; i < STRIP_COUNT; i++) {
        const y0 = i === 0 ? -10 : (i / STRIP_COUNT) * 100;
        const y1 =
          i === STRIP_COUNT - 1 ? 110 : ((i + 1) / STRIP_COUNT) * 100 + 0.5;
        const strip = document.createElement('div');
        strip.className = 'ls-vn-bg-strip';
        strip.style.backgroundImage = nextBgCss;
        strip.style.setProperty('--strip-from', `${i % 2 ? '' : '-'}115%`);
        strip.style.setProperty('--strip-delay', `${i * 42}ms`);
        strip.style.clipPath = `polygon(-5% ${y0 + slant}%, 105% ${y0 - slant}%, 105% ${y1 - slant}%, -5% ${y1 + slant}%)`;
        box.append(strip);
      }
      stack.append(box);
      void box.offsetWidth;
      box.classList.add('is-active');
      await new Promise(r => setTimeout(r, 820));
      if (this.transitionToken === token) {
        baseLayer.style.backgroundImage = nextBgCss;
      }
      box.remove();
      return;
    }

    stack.dataset.bgTr = transition === 'flash' ? 'cinematic' : transition;
    frontLayer.classList.remove('is-active');
    frontLayer.style.backgroundImage = nextBgCss;
    // Force synchronous reflow while `.is-active` is off (`transition: none`) so start clip-path/opacity latches
    void frontLayer.offsetWidth;
    frontLayer.classList.add('is-active');
    await new Promise(r => setTimeout(r, 820));
    if (this.transitionToken === token) {
      baseLayer.style.backgroundImage = nextBgCss;
      frontLayer.classList.remove('is-active');
    }
  }

  public syncParallaxAndSpeakerPush(
    stageRoot: HTMLElement | null,
    options: { parallaxEnabled: boolean; speakerPushEnabled: boolean },
  ): void {
    if (!stageRoot) return;
    if (options.speakerPushEnabled) {
      const speakerSlot = stageRoot.querySelector<HTMLElement>(
        '.ls-vn-actor-slot[data-active-speaker="true"]',
      );
      if (speakerSlot) {
        const hostRect = stageRoot.getBoundingClientRect();
        const slotRect = speakerSlot.getBoundingClientRect();
        const ratio = hostRect.width
          ? (slotRect.left + slotRect.width / 2 - hostRect.left) / hostRect.width
          : 0.5;
        this.parallaxState.pushTarget = clamp((0.5 - ratio) * 1.8, -1.0, 1.0);
        this.parallaxState.zoomTarget = 1.018;
      } else {
        this.parallaxState.pushTarget = 0;
        this.parallaxState.zoomTarget = 1.0;
      }
    } else {
      this.parallaxState.pushTarget = 0;
      this.parallaxState.zoomTarget = 1.0;
    }

    if (!this.parallaxState.bound && typeof window !== 'undefined') {
      this.parallaxState.bound = true;
      this.pointerMoveListener = (ev: PointerEvent) => {
        const activeRoot = document.querySelector<HTMLElement>('[data-ls-vn-stage-root]');
        if (!activeRoot || activeRoot.offsetParent === null) return;
        const r = activeRoot.getBoundingClientRect();
        if (!r.width || !r.height) return;
        this.parallaxState.tx = clamp(((ev.clientX - r.left) / r.width - 0.5) * 2, -1, 1);
        this.parallaxState.ty = clamp(((ev.clientY - r.top) / r.height - 0.5) * 2, -1, 1);
        this.kickParallaxFrame(options);
      };
      window.addEventListener('pointermove', this.pointerMoveListener, { passive: true });
    }
    this.kickParallaxFrame(options);
  }

  private kickParallaxFrame(options: {
    parallaxEnabled: boolean;
    speakerPushEnabled: boolean;
  }): void {
    if (this.parallaxState.rafId) return;
    const step = () => {
      this.parallaxState.rafId = 0;
      const stageRoot = document.querySelector<HTMLElement>('[data-ls-vn-stage-root]');
      if (!stageRoot) return;
      const tx = options.parallaxEnabled ? this.parallaxState.tx : 0;
      const ty = options.parallaxEnabled ? this.parallaxState.ty : 0;
      this.parallaxState.x += (tx - this.parallaxState.x) * 0.08;
      this.parallaxState.y += (ty - this.parallaxState.y) * 0.08;
      this.parallaxState.push += (this.parallaxState.pushTarget - this.parallaxState.push) * 0.05;
      this.parallaxState.zoom += (this.parallaxState.zoomTarget - this.parallaxState.zoom) * 0.05;

      const { x, y, push, zoom } = this.parallaxState;
      const bgEl = stageRoot.querySelector<HTMLElement>('.ls-vn-bg-stack');
      const charEl = stageRoot.querySelector<HTMLElement>('.ls-vn-actors-layer');
      const fxEl = stageRoot.querySelector<HTMLElement>('.ls-vn-weather-layer');

      if (bgEl) {
        bgEl.style.translate = `${(-x * 1.0 + push * 0.4).toFixed(3)}% ${(-y * 0.75).toFixed(3)}%`;
      }
      if (charEl) {
        charEl.style.translate = `${(-x * 1.5 + push).toFixed(3)}% ${(-y * 0.7).toFixed(3)}%`;
        charEl.style.scale = zoom.toFixed(4);
      }
      if (fxEl) {
        fxEl.style.translate = `${(-x * 2.2 + push * 1.1).toFixed(3)}% ${(-y * 1.2).toFixed(3)}%`;
      }

      const settled =
        Math.abs(tx - this.parallaxState.x) < 0.002 &&
        Math.abs(ty - this.parallaxState.y) < 0.002 &&
        Math.abs(this.parallaxState.pushTarget - this.parallaxState.push) < 0.002;
      if (!settled) {
        this.parallaxState.rafId = requestAnimationFrame(step);
      }
    };
    this.parallaxState.rafId = requestAnimationFrame(step);
  }

  public flashStage(stageRoot: HTMLElement | null, color = '#ffffff', durationMs = 500): void {
    if (!stageRoot) return;
    let flashEl = stageRoot.querySelector<HTMLElement>('.ls-vn-flash');
    if (!flashEl) {
      flashEl = document.createElement('div');
      flashEl.className = 'ls-vn-flash';
      stageRoot.append(flashEl);
    }
    flashEl.style.background = color;
    flashEl.style.opacity = '0.78';
    if (this.flashTimer !== null) clearTimeout(this.flashTimer);
    this.flashTimer = setTimeout(() => {
      this.flashTimer = null;
      if (flashEl) {
        flashEl.style.transition = `opacity ${durationMs}ms ease-out`;
        flashEl.style.opacity = '0';
      }
    }, 60);
  }

  public destroy(): void {
    this.transitionToken++;
    if (this.flashTimer !== null) {
      clearTimeout(this.flashTimer);
      this.flashTimer = null;
    }
    if (this.pointerMoveListener && typeof window !== 'undefined') {
      window.removeEventListener('pointermove', this.pointerMoveListener);
      this.pointerMoveListener = null;
    }
    this.parallaxState.bound = false;
    if (this.parallaxState.rafId) {
      cancelAnimationFrame(this.parallaxState.rafId);
      this.parallaxState.rafId = 0;
    }
    this.sampleCanvas = null;
  }
}
