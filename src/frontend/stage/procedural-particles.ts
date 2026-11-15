import type { VnWeatherEffect } from '../../shared/types';

function svgDataUri(body: string, width: number, height: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${body}</svg>`;
  return `url('data:image/svg+xml,${encodeURIComponent(svg)}')`;
}

function pseudo(seed: number, index: number, min: number, max: number): number {
  let h =
    (Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b) ^
      Math.imul(index + 0x632be5ab, 0xc2b2ae35)) >>>
    0;
  h ^= h >>> 16;
  h = Math.imul(h, 0x7feb352d) >>> 0;
  h ^= h >>> 15;
  h = Math.imul(h, 0x846ca68b) >>> 0;
  h = (h ^ (h >>> 16)) >>> 0;
  const v = h / 0xffffffff;
  return min + v * (max - min);
}

function strat(
  seed: number,
  index: number,
  count: number,
  min: number,
  max: number,
): number {
  const jitter = pseudo(seed, index, 0.06, 0.94);
  return min + ((index + jitter) / count) * (max - min);
}

function n(value: number, digits = 1): string {
  return Number(value.toFixed(digits)).toString();
}

function vars(entries: Record<string, string>): string {
  return Object.entries(entries)
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
}

export function inferWeatherEffect(
  weather: string | null | undefined,
  explicit?: VnWeatherEffect | 'clear' | '' | null,
): VnWeatherEffect | null {
  if (explicit === 'clear') return null;
  if (explicit) return explicit;
  if (!weather) return null;
  const w = weather.toLowerCase();
  if (/\b(?:storm|downpour|thunder|tempest|torrential|monsoon)\b/.test(w)) {
    return 'heavy_rain';
  }
  if (/\b(?:rain|drizzle|shower)\b/.test(w)) return 'rain';
  if (/\b(?:snow|blizzard|flurr|frost)\b/.test(w)) return 'snow';
  if (/\b(?:sakura|blossom|petal)\b/.test(w)) return 'sakura';
  if (/\b(?:fog|mist|haze|steam)\b/.test(w)) return 'fog';
  if (/\b(?:ember|ash|cinder|spark)\b/.test(w)) return 'embers';
  if (/\b(?:firefl|starlight)\b/.test(w)) return 'fireflies';
  return null;
}

export function generateWeatherParticlesHtml(
  effect: VnWeatherEffect,
  compact = false,
): string {
  switch (effect) {
    case 'rain':
      return generateRainMarkup(false, compact);
    case 'heavy_rain':
      return generateRainMarkup(true, compact);
    case 'snow':
      return generateSnowMarkup(compact);
    case 'sakura':
      return generateSakuraMarkup(compact);
    case 'fog':
      return generateFogMarkup();
    case 'fireflies':
      return generateFirefliesMarkup(compact);
    case 'embers':
      return generateEmbersMarkup(compact);
    default:
      return '';
  }
}

interface StreakGroup {
  count: number;
  len: [number, number];
  width: number;
  alpha: [number, number];
  color: string;
}

interface RainLayerSpec {
  cls: string;
  seed: number;
  w: number;
  h: number;
  speed: number;
  blur?: number;
  groups: StreakGroup[];
}

function rainTile(spec: RainLayerSpec): string {
  const rects: string[] = [];
  const gradients: string[] = [];
  spec.groups.forEach((group, g) => {
    const seed = spec.seed + g * 10;
    gradients.push(
      `<linearGradient id="g${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${group.color}" stop-opacity="0"/><stop offset=".7" stop-color="${group.color}" stop-opacity=".55"/><stop offset="1" stop-color="${group.color}" stop-opacity="1"/></linearGradient>`,
    );
    for (let i = 0; i < group.count; i++) {
      const x = strat(seed, i, group.count, group.width, spec.w - group.width);
      const y = pseudo(seed + 1, i, 0, spec.h);
      const len = pseudo(seed + 2, i, group.len[0], group.len[1]);
      const alpha = pseudo(seed + 3, i, group.alpha[0], group.alpha[1]);
      const rect = (top: number) =>
        `<rect x="${n(x - group.width / 2)}" y="${n(top)}" width="${n(group.width, 2)}" height="${n(len)}" rx="${n(group.width / 2, 2)}" fill="url(#g${g})" opacity="${n(alpha, 2)}"/>`;
      rects.push(rect(y));
      if (y + len > spec.h) rects.push(rect(y - spec.h));
    }
  });
  const filter = spec.blur
    ? `<filter id="b" x="-50%" y="-5%" width="200%" height="110%"><feGaussianBlur stdDeviation="${spec.blur}"/></filter>`
    : '';
  const body = spec.blur ? `<g filter="url(#b)">${rects.join('')}</g>` : rects.join('');
  return svgDataUri(`<defs>${gradients.join('')}${filter}</defs>${body}`, spec.w, spec.h);
}

function rainLayer(spec: RainLayerSpec, tilt: number): string {
  const style = vars({
    '--tile': rainTile(spec),
    '--tw': `${spec.w}px`,
    '--th': `${spec.h}px`,
    '--dur': `${n(spec.h / spec.speed, 3)}s`,
    '--tilt': `${tilt}deg`,
  });
  return `<div class="ls-vn-rain-layer ${spec.cls}" style="${style}"><i></i></div>`;
}

function generateRainMarkup(heavy: boolean, compact = false): string {
  const prefix = heavy ? 'ls-vn-heavy-rain' : 'ls-vn-rain';
  const tilt = heavy ? 13 : 8;
  const scaleFactor = compact ? 0.5 : 1;
  const layers: RainLayerSpec[] = [
    {
      cls: `${prefix}-bg`,
      seed: heavy ? 201 : 101,
      w: 280,
      h: 400,
      speed: heavy ? 1500 : 1150,
      groups: [
        {
          count: Math.max(8, Math.round((heavy ? 36 : 22) * scaleFactor)),
          len: [12, 26],
          width: 1,
          alpha: [0.22, 0.42],
          color: '#b4c8e2',
        },
        {
          count: Math.max(5, Math.round((heavy ? 20 : 12) * scaleFactor)),
          len: [30, 54],
          width: 1.4,
          alpha: [0.38, 0.62],
          color: '#c9dbf2',
        },
      ],
    },
    {
      cls: `${prefix}-fg`,
      seed: heavy ? 221 : 121,
      w: 430,
      h: 520,
      speed: heavy ? 2600 : 2100,
      blur: 0.7,
      groups: [
        {
          count: Math.max(3, Math.round((heavy ? 8 : 5) * scaleFactor)),
          len: [70, 125],
          width: 2.2,
          alpha: [0.4, 0.64],
          color: '#e6f0ff',
        },
      ],
    },
  ];
  const splashCount = compact ? 6 : heavy ? 16 : 10;
  const splashes: string[] = [];
  for (let i = 0; i < splashCount; i++) {
    const dur = pseudo(305, i, 0.55, 0.95);
    splashes.push(
      `<i class="ls-vn-pt ls-vn-splash" style="${vars({
        left: `${n(strat(301, i, splashCount, 3, 97))}%`,
        top: `${n(pseudo(302, i, 76, 96))}%`,
        '--sz': `${n(pseudo(303, i, 12, heavy ? 26 : 18))}px`,
        '--fd': `${n(dur, 2)}s`,
        '--dl': `${n(-pseudo(304, i, 0, dur), 2)}s`,
      })}"></i>`,
    );
  }

  return `<div class="ls-vn-rain-wash"></div>${layers.map(l => rainLayer(l, tilt)).join('')}<div class="ls-vn-fx-layer">${splashes.join('')}</div>`;
}

interface FallLayer {
  cls: string;
  seed: number;
  count: number;
  size: [number, number];
  fall: [number, number];
  opacity: [number, number];
}

function fallingParticle(
  cls: string,
  layer: FallLayer,
  i: number,
  extra: Record<string, string> = {},
): string {
  const fall = pseudo(layer.seed + 2, i, layer.fall[0], layer.fall[1]);
  return `<i class="ls-vn-pt ${cls}" style="${vars({
    left: `${n(strat(layer.seed, i, layer.count, 1, 99))}%`,
    '--y': `${n(pseudo(layer.seed + 1, i, 0, 92))}vh`,
    '--sz': `${n(pseudo(layer.seed + 3, i, layer.size[0], layer.size[1]))}px`,
    '--o': n(pseudo(layer.seed + 5, i, layer.opacity[0], layer.opacity[1]), 2),
    '--fd': `${n(fall, 2)}s`,
    '--dl': `${n(-pseudo(layer.seed + 6, i, 0, fall), 2)}s`,
    '--dx': `${n(pseudo(layer.seed + 8, i, -12, 8))}vw`,
    ...extra,
  })}"></i>`;
}

function generateSnowMarkup(compact = false): string {
  const mult = compact ? 0.4 : 1;
  const far: FallLayer = {
    cls: 'ls-vn-snow-bg',
    seed: 10,
    count: Math.max(8, Math.round(36 * mult)),
    size: [3.5, 6],
    fall: [11, 16],
    opacity: [0.55, 0.85],
  };
  const mid: FallLayer = {
    cls: 'ls-vn-snow-mg',
    seed: 20,
    count: Math.max(6, Math.round(22 * mult)),
    size: [7, 12],
    fall: [7.5, 10.5],
    opacity: [0.75, 0.95],
  };
  const build = (layer: FallLayer) => {
    const out: string[] = [];
    for (let i = 0; i < layer.count; i++) out.push(fallingParticle('ls-vn-flake', layer, i));
    return `<div class="ls-vn-fx-layer ${layer.cls}">${out.join('')}</div>`;
  };
  return `${build(far)}${build(mid)}`;
}

function generateSakuraMarkup(compact = false): string {
  const mult = compact ? 0.4 : 1;
  const layer: FallLayer = {
    cls: 'ls-vn-sakura',
    seed: 45,
    count: Math.max(8, Math.round(26 * mult)),
    size: [10, 17],
    fall: [9, 14],
    opacity: [0.68, 0.95],
  };
  const out: string[] = [];
  for (let i = 0; i < layer.count; i++) {
    out.push(
      fallingParticle('ls-vn-petal', layer, i, {
        '--dx': `${n(pseudo(layer.seed + 8, i, -20, -6))}vw`,
      }),
    );
  }
  return `<div class="ls-vn-fx-layer ${layer.cls}">${out.join('')}</div>`;
}

function generateFirefliesMarkup(compact = false): string {
  const count = compact ? 10 : 22;
  const flies: string[] = [];
  for (let i = 0; i < count; i++) {
    const dur = pseudo(57, i, 2.8, 5.2);
    flies.push(
      `<i class="ls-vn-pt ls-vn-firefly" style="${vars({
        left: `${n(strat(50, i, count, 3, 97))}%`,
        top: `${n(pseudo(51, i, 14, 88))}%`,
        '--sz': `${n(pseudo(52, i, 10, 22))}px`,
        '--fd': `${n(dur, 2)}s`,
        '--dl': `${n(-pseudo(54, i, 0, dur), 2)}s`,
      })}"></i>`,
    );
  }
  return `<div class="ls-vn-fx-layer">${flies.join('')}</div>`;
}

function generateEmbersMarkup(compact = false): string {
  const count = compact ? 12 : 30;
  const sparks: string[] = [];
  for (let i = 0; i < count; i++) {
    const rise = pseudo(63, i, 3.4, 6.4);
    sparks.push(
      `<i class="ls-vn-pt ls-vn-ember" style="${vars({
        left: `${n(strat(60, i, count, 2, 98))}%`,
        '--sz': `${n(pseudo(61, i, 5, 11))}px`,
        '--fd': `${n(rise, 2)}s`,
        '--dl': `${n(-pseudo(62, i, 0, rise), 2)}s`,
        '--dx': `${n(pseudo(65, i, -5, 9))}vw`,
      })}"></i>`,
    );
  }
  return `<div class="ls-vn-fx-layer">${sparks.join('')}</div>`;
}

function generateFogMarkup(): string {
  return `<div class="ls-vn-fog-wash"></div><div class="ls-vn-fog-layer ls-vn-fog-1"></div><div class="ls-vn-fog-layer ls-vn-fog-2"></div>`;
}
