import type {
  SpindleAPI,
  WorldInfoInterceptorCtxDTO,
  WorldInfoInterceptorResultDTO,
} from 'lumiverse-spindle-types';
import type { StoryGroundingContext } from '../shared/prompt-compiler';
import { stripInlineStatsTags } from '../shared/state-reducer';
import { slugifyKey } from '../shared/templates';
import type { CampaignState, LumiStatsTemplate } from '../shared/types';

async function runWithConcurrency<T>(
  items: readonly T[],
  limit: number,
  worker: (item: T) => Promise<void>,
): Promise<void> {
  if (!items.length) return;
  let index = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const current = items[index++]!;
      await worker(current);
    }
  });
  await Promise.all(runners);
}

interface CachedGroundingRecord {
  at: number;
  ctx: StoryGroundingContext;
}

const GROUNDING_CACHE_TTL_MS = 60_000;
const groundingCache = new Map<string, CachedGroundingRecord>();

export function invalidateGroundingCache(chatId?: string): void {
  if (!chatId) {
    groundingCache.clear();
    return;
  }
  for (const key of groundingCache.keys()) {
    if (key.includes(`:${chatId}:`)) {
      groundingCache.delete(key);
    }
  }
}

/**
 * Reads live Character Card, Active Persona, and early user messages so Turn-1
 * calibration has the full canon premise without stale copies.
 * When `options.compact` is true (Turns 2+), omits the full greeting and opening message
 * to save sidecar tokens, and uses a bounded 60s TTL cache to avoid redundant RPCs.
 */
export async function readAuthoritativeGrounding(
  api: SpindleAPI,
  userId: string | undefined,
  chatId: string,
  options?: { compact?: boolean },
): Promise<StoryGroundingContext> {
  const ctx: StoryGroundingContext = {};
  if (!chatId || chatId === 'sandbox') return ctx;
  const compact = options?.compact === true;
  const cacheKey = `${userId?.trim() || '__owner__'}:${chatId}:${compact ? '1' : '0'}`;
  const cached = groundingCache.get(cacheKey);
  if (cached && Date.now() - cached.at < GROUNDING_CACHE_TTL_MS) {
    return structuredClone(cached.ctx);
  }

  if (api.permissions.has('chats') && api.permissions.has('characters')) {
    try {
      const chat = await (api.chats.get as (id: string, u?: string) => Promise<{ character_id?: string } | null>)(chatId, userId);
      const card = chat?.character_id
        ? await (api.characters.get as (id: string, u?: string) => Promise<Record<string, unknown> | null>)(chat.character_id, userId)
        : null;
      if (card) {
        ctx.characterCard = {
          name: String(card.name ?? ''),
          description: String(card.description ?? '').slice(0, compact ? 1200 : 4000),
          personality: String(card.personality ?? '').slice(0, compact ? 800 : 2000),
          scenario: String(card.scenario ?? '').slice(0, compact ? 1000 : 2500),
          ...(compact ? {} : { firstMessage: String(card.first_mes ?? '').slice(0, 3000) }),
        };
      }
    } catch {
      // Ignore if character card is inaccessible
    }
  }

  if (api.permissions.has('personas')) {
    try {
      const persona = await (api.personas.getActive as (u?: string) => Promise<Record<string, unknown> | null>)(userId);
      if (persona) {
        ctx.persona = {
          name: String(persona.name ?? ''),
          description: String(persona.description ?? '').slice(0, compact ? 900 : 2500),
        };
      }
    } catch {
      // Ignore if persona lookup fails
    }
  }

  if (!compact && api.permissions.has('chat_mutation')) {
    try {
      const messages = await api.chat.getMessages(chatId);
      const firstUser = messages.find(m => m.role === 'user' && m.content.trim().length > 0);
      if (firstUser) {
        ctx.openingUserMessage = stripInlineStatsTags(firstUser.content).slice(0, 4000);
      }
    } catch {
      // Ignore if messages cannot be read
    }
  }

  if (groundingCache.size >= 40 && !groundingCache.has(cacheKey)) {
    const oldest = groundingCache.keys().next().value;
    if (oldest !== undefined) groundingCache.delete(oldest);
  }
  groundingCache.set(cacheKey, { at: Date.now(), ctx: structuredClone(ctx) });
  return ctx;
}

/**
 * Syncs tracked Characters, Locations, and Relationship Meters into Lumiverse's
 * native Memory Cortex (`spindle.memories.*`) when `memoryCortexSync` is enabled.
 * Only syncs dirty/touched entities per turn using bounded concurrency (max 4).
 */
export async function syncStateToMemoryCortex(
  api: SpindleAPI,
  userId: string | undefined,
  chatId: string,
  state: CampaignState,
  template: LumiStatsTemplate,
  options?: { touchedCharacterIds?: string[]; touchedPlaceIds?: string[] },
): Promise<void> {
  if (!chatId || chatId === 'sandbox' || !api.permissions.has('memories') || !api.memories) {
    return;
  }

  const memories = api.memories;
  const charFilter = options?.touchedCharacterIds
    ? new Set(options.touchedCharacterIds)
    : null;
  const placeFilter = options?.touchedPlaceIds
    ? new Set(options.touchedPlaceIds)
    : null;

  const targetActors = Object.values(state.characters).filter(
    a => !charFilter || charFilter.has(a.id),
  );
  const targetPlaces = Object.values(state.places).filter(
    p => p.visited && (!placeFilter || placeFilter.has(p.id)),
  );

  if (!targetActors.length && !targetPlaces.length) return;

  try {
    // 1. Upsert player entity if we are syncing character relations
    const playerName = state.player.name || 'Player';
    if (targetActors.length > 0) {
      await memories.entities.upsert(
        chatId,
        { name: playerName, type: 'character', aliases: ['User', 'Protagonist'], confidence: 0.95 },
        { userId },
      );
    }

    const charSchemas = template.stats.filter(s => s.scope === 'character' && s.enabled);

    // 2. Upsert dirty characters, their facts, and relations with bounded concurrency
    await runWithConcurrency(targetActors, 4, async actor => {
      const entity = await memories.entities.upsert(
        chatId,
        {
          name: actor.name,
          type: 'character',
          aliases: actor.aliases,
          confidence: 0.92,
        },
        { userId },
      );

      const facts: string[] = [];
      if (actor.roleSummary) facts.push(`Role: ${actor.roleSummary}`);
      if (actor.attire) facts.push(`Current attire: ${actor.attire}`);
      if (actor.immediateGoal) facts.push(`Current goal: ${actor.immediateGoal}`);
      for (const sec of actor.secrets.filter(s => s.stage === 'confirmed')) {
        facts.push(`${sec.title}: ${sec.detail}`);
      }
      if (facts.length > 0) {
        await memories.entities.addFacts(entity.id, facts.slice(0, 8), userId);
      }

      const meterSummary: string[] = [];
      let totalNormalized = 0;
      let count = 0;
      for (const schema of charSchemas) {
        const m = actor.meters[schema.id];
        if (m?.calibrated && typeof m.value === 'number') {
          meterSummary.push(`${schema.label}: ${m.value}`);
          const span = Math.max(1, schema.max - schema.min);
          const norm = ((m.value - schema.min) / span) * 2 - 1;
          totalNormalized += norm;
          count++;
        }
      }
      if (meterSummary.length > 0) {
        const sentiment = count > 0 ? Number((totalNormalized / count).toFixed(2)) : 0;
        const relType =
          sentiment >= 0.25 ? 'ally' : sentiment <= -0.25 ? 'rival' : 'custom';
        await memories.relations.upsert(
          chatId,
          {
            source: actor.name,
            target: playerName,
            type: relType,
            label: meterSummary.slice(0, 4).join(', '),
            sentiment: Math.max(-1, Math.min(1, sentiment)),
          },
          { userId },
        );
      }
    });

    // 3. Upsert dirty visited locations with bounded concurrency
    await runWithConcurrency(targetPlaces, 4, async place => {
      await memories.entities.upsert(
        chatId,
        {
          name: place.name,
          type: 'location',
          aliases: [],
          confidence: 0.9,
        },
        { userId },
      );
    });
  } catch {
    // Non-fatal background sync
  }
}

/**
 * Evaluates World Info stat gates declared in entry comments or `entry.extensions.lumi_stats`.
 * Syntax supported in entry `comment`:
 * - `[lumi:vitality<30]`
 * - `[lumi:akane.trust>=50]`
 * - `[lumi:location=sakura_courtyard]`
 */
export function evaluateWorldInfoStatGates(
  ctx: WorldInfoInterceptorCtxDTO,
  state: CampaignState,
): WorldInfoInterceptorResultDTO | void {
  const disabled: string[] = [];
  const forced: string[] = [];
  const ruleRe = /\[lumi:([a-zA-Z0-9_.-]+)\s*(>=|<=|==|!=|>|<|=)\s*([^\]]+)\]/gi;

  const resolveLeftValue = (path: string): number | string | boolean | undefined => {
    const clean = path.trim();
    if (clean === 'location') return slugifyKey(state.scene.location, '');
    if (clean === 'turn') return state.turnCount;
    if (clean.includes('.')) {
      const [actorSlug, meterKey] = clean.split('.');
      const actor =
        state.characters[actorSlug!] ??
        Object.values(state.characters).find(c => slugifyKey(c.name, '') === slugifyKey(actorSlug, ''));
      return actor?.meters[meterKey!]?.value;
    }
    if (state.stats[clean] !== undefined) {
      return state.stats[clean]!.value;
    }
    const firstPresent = Object.values(state.characters).find(c => c.present);
    return firstPresent?.meters[clean]?.value;
  };

  const compare = (actual: number | string | boolean | undefined, op: string, rawTarget: string): boolean => {
    if (actual === undefined) return false;
    const targetTrimmed = rawTarget.trim();
    const actualNum = typeof actual === 'number' ? actual : Number(actual);
    const targetNum = Number(targetTrimmed);

    if (Number.isFinite(actualNum) && Number.isFinite(targetNum)) {
      if (op === '>=') return actualNum >= targetNum;
      if (op === '<=') return actualNum <= targetNum;
      if (op === '>') return actualNum > targetNum;
      if (op === '<') return actualNum < targetNum;
      if (op === '!=') return actualNum !== targetNum;
      return actualNum === targetNum;
    }

    const aStr = slugifyKey(String(actual), '');
    const tStr = slugifyKey(targetTrimmed, '');
    return op === '!=' ? aStr !== tStr : aStr.includes(tStr) || aStr === tStr;
  };

  for (const entry of ctx.entries) {
    const comment = entry.comment || '';
    const matches = [...comment.matchAll(ruleRe)];
    if (!matches.length) continue;

    const allPassed = matches.every(m => compare(resolveLeftValue(m[1]!), m[2]!, m[3]!));
    if (!allPassed) {
      disabled.push(entry.id);
    } else if (comment.includes('[lumi:force]')) {
      forced.push(entry.id);
    }
  }

  if (!disabled.length && !forced.length) return undefined;
  return {
    ...(disabled.length ? { disabled } : {}),
    ...(forced.length ? { forced } : {}),
  };
}
