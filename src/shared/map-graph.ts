import type {
  CampaignState,
  MapPathEdge,
  MapPathKind,
  MapPlaceNode,
  MapZoneRecord,
} from './types';

export interface LayoutMapNode {
  place: MapPlaceNode;
  zoneId: string;
  zoneName: string;
  x: number;
  y: number;
  isCurrent: boolean;
  isOnRoute: boolean;
  actorsHere: Array<{ id: string; name: string; portraitUrl?: string }>;
  activeQuestCount: number;
}

export interface LayoutMapEdge {
  id: string;
  fromId: string;
  toId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  cx: number;
  cy: number;
  pathType: MapPathKind;
  label?: string;
  travelMinutes: number;
  locked: boolean;
  isOnRoute: boolean;
  isCrossZone: boolean;
}

export interface LayoutZoneCluster {
  zone: MapZoneRecord;
  x: number;
  y: number;
  w: number;
  h: number;
  placeIds: string[];
  containsCurrent: boolean;
}

const DEFAULT_ZONE: MapZoneRecord = {
  id: 'zone_local',
  name: 'Local Area',
  kind: 'building',
  icon: '🗺️',
  color: '#38bdf8',
  description: '',
};

/**
 * Resolves unified `MapPathEdge[]` from explicit `state.mapPaths` plus legacy `connectedIds`.
 */
export function resolveMapPathEdges(state: CampaignState): MapPathEdge[] {
  const byId = new Map<string, MapPathEdge>();
  for (const edge of state.mapPaths ?? []) {
    if (!state.places[edge.fromId] || !state.places[edge.toId] || edge.fromId === edge.toId) continue;
    const [a, b] = [edge.fromId, edge.toId].sort();
    const id = `${a}__${b}`;
    byId.set(id, { ...edge, id, fromId: a!, toId: b! });
  }

  for (const place of Object.values(state.places)) {
    for (const cid of place.connectedIds) {
      if (!state.places[cid] || cid === place.id) continue;
      const [a, b] = [place.id, cid].sort();
      const id = `${a}__${b}`;
      if (!byId.has(id)) {
        const peer = state.places[cid]!;
        const sameZone = (place.zoneId || 'zone_local') === (peer.zoneId || 'zone_local');
        byId.set(id, {
          id,
          fromId: a!,
          toId: b!,
          pathType: sameZone ? 'door' : 'street',
          travelMinutes: Math.max(1, peer.travelMinutes || place.travelMinutes || 5),
        });
      }
    }
  }
  return [...byId.values()];
}

/**
 * Finds the shortest travel route using Dijkstra's algorithm over `resolveMapPathEdges()`,
 * preferring unlocked paths when available.
 */
export function findShortestTravelRoute(
  state: CampaignState,
  destinationId: string,
): { pathIds: string[]; totalMinutes: number } | null {
  const startId = state.currentPlaceId || Object.keys(state.places)[0] || '';
  if (!startId || !state.places[destinationId]) return null;
  if (startId === destinationId) return { pathIds: [startId], totalMinutes: 0 };

  const edges = resolveMapPathEdges(state);
  const adj = new Map<string, Array<{ to: string; mins: number; locked: boolean }>>();
  for (const e of edges) {
    (adj.get(e.fromId) ?? adj.set(e.fromId, []).get(e.fromId)!).push({
      to: e.toId,
      mins: Math.max(1, e.travelMinutes || 5),
      locked: Boolean(e.locked),
    });
    (adj.get(e.toId) ?? adj.set(e.toId, []).get(e.toId)!).push({
      to: e.fromId,
      mins: Math.max(1, e.travelMinutes || 5),
      locked: Boolean(e.locked),
    });
  }

  const runSearch = (allowLocked: boolean) => {
    const dist = new Map<string, number>([[startId, 0]]);
    const prev = new Map<string, string>();
    const visited = new Set<string>();

    while (true) {
      let bestId: string | null = null;
      let bestCost = Infinity;
      for (const [id, cost] of dist.entries()) {
        if (!visited.has(id) && cost < bestCost) {
          bestId = id;
          bestCost = cost;
        }
      }
      if (!bestId) return null;
      if (bestId === destinationId) {
        const pathIds = [bestId];
        while (prev.has(pathIds[0]!)) {
          pathIds.unshift(prev.get(pathIds[0]!)!);
        }
        return { pathIds, totalMinutes: bestCost };
      }
      visited.add(bestId);
      for (const step of adj.get(bestId) ?? []) {
        if (!allowLocked && step.locked) continue;
        const nextCost = bestCost + step.mins;
        if (nextCost < (dist.get(step.to) ?? Infinity)) {
          dist.set(step.to, nextCost);
          prev.set(step.to, bestId);
        }
      }
    }
  };

  return runSearch(false) ?? runSearch(true);
}

/**
 * Computes a Zone-Clustered Blueprint Map on an 1000x580 canvas, grouping rooms inside
 * their Zone containers (or zooming into `focusZoneId` when drilled down).
 */
export function buildSpatialMapLayout(
  state: CampaignState,
  selectedPlaceId?: string,
  focusZoneId?: string,
): {
  zones: LayoutZoneCluster[];
  nodes: LayoutMapNode[];
  edges: LayoutMapEdge[];
} {
  const allPlaces = Object.values(state.places);
  if (!allPlaces.length) return { zones: [], nodes: [], edges: [] };

  const curId = state.currentPlaceId || allPlaces[0]!.id;
  const resolvedZones: Record<string, MapZoneRecord> = { ...(state.mapZones ?? {}) };

  const getZoneForPlace = (p: MapPlaceNode): MapZoneRecord => {
    const zid = p.zoneId || DEFAULT_ZONE.id;
    if (resolvedZones[zid]) return resolvedZones[zid]!;
    if (zid === DEFAULT_ZONE.id) {
      resolvedZones[zid] = {
        ...DEFAULT_ZONE,
        name: state.title && state.title !== 'Uncharted Story' ? state.title : 'Local Area',
      };
      return resolvedZones[zid]!;
    }
    resolvedZones[zid] = {
      id: zid,
      name: zid.replace(/[_-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      kind: p.category === 'region' ? 'region' : 'building',
      icon: p.category === 'region' ? '🏔️' : '🏛️',
      color: '#38bdf8',
      description: '',
    };
    return resolvedZones[zid]!;
  };

  const filteredPlaces = (
    focusZoneId
      ? allPlaces.filter(p => (p.zoneId || DEFAULT_ZONE.id) === focusZoneId)
      : allPlaces
  ).slice(0, 18);

  const byZone = new Map<string, { zone: MapZoneRecord; places: MapPlaceNode[] }>();
  for (const p of filteredPlaces) {
    const z = getZoneForPlace(p);
    let bucket = byZone.get(z.id);
    if (!bucket) {
      bucket = { zone: z, places: [] };
      byZone.set(z.id, bucket);
    }
    bucket.places.push(p);
  }

  const zoneBuckets = [...byZone.values()];
  const zoneCount = zoneBuckets.length;
  const canvasW = 1000;
  const canvasH = 580;
  const pad = 22;

  const cols = zoneCount <= 1 ? 1 : zoneCount <= 4 ? 2 : 3;
  const rows = Math.ceil(zoneCount / cols);
  const gap = 22;
  const boxW = Math.floor((canvasW - pad * 2 - gap * (cols - 1)) / cols);
  const boxH = Math.floor((canvasH - pad * 2 - gap * (rows - 1)) / rows);

  const route =
    selectedPlaceId && selectedPlaceId !== curId
      ? findShortestTravelRoute(state, selectedPlaceId)
      : null;
  const routeSet = new Set(route?.pathIds ?? []);

  const activeQuests = Object.values(state.quests).filter(q => q.status === 'active');

  const zones: LayoutZoneCluster[] = [];
  const nodes: LayoutMapNode[] = [];

  zoneBuckets.forEach((bucket, zIdx) => {
    const col = zIdx % cols;
    const row = Math.floor(zIdx / cols);
    const zx = pad + col * (boxW + gap);
    const zy = pad + row * (boxH + gap);

    zones.push({
      zone: bucket.zone,
      x: zx,
      y: zy,
      w: boxW,
      h: boxH,
      placeIds: bucket.places.map(p => p.id),
      containsCurrent: bucket.places.some(p => p.id === curId),
    });

    const pCount = bucket.places.length;
    const innerTop = zy + 46;
    const innerH = Math.max(80, boxH - 58);
    const innerLeft = zx + 18;
    const innerW = Math.max(120, boxW - 36);
    const pCols = pCount === 1 ? 1 : pCount <= 4 ? 2 : 3;
    const pRows = Math.ceil(pCount / pCols);

    bucket.places.forEach((place, pIdx) => {
      const pc = pIdx % pCols;
      const pr = Math.floor(pIdx / pCols);
      const cellW = innerW / pCols;
      const cellH = innerH / pRows;
      const x = Math.round(innerLeft + cellW * (pc + 0.5));
      const y = Math.round(innerTop + cellH * (pr + 0.5));

      const actorsHere = Object.values(state.characters)
        .filter(c => (c.present ? place.id === curId : c.locationId === place.id))
        .map(c => ({ id: c.id, name: c.name, portraitUrl: c.portraitUrl }));

      const activeQuestCount = activeQuests.filter(q =>
        `${q.title} ${q.summary}`.toLowerCase().includes(place.name.toLowerCase()),
      ).length;

      nodes.push({
        place,
        zoneId: bucket.zone.id,
        zoneName: bucket.zone.name,
        x,
        y,
        isCurrent: place.id === curId,
        isOnRoute: routeSet.has(place.id),
        actorsHere,
        activeQuestCount,
      });
    });
  });

  const nodeById = new Map(nodes.map(n => [n.place.id, n]));
  const edges: LayoutMapEdge[] = [];

  for (const rawEdge of resolveMapPathEdges(state)) {
    const a = nodeById.get(rawEdge.fromId);
    const b = nodeById.get(rawEdge.toId);
    if (!a || !b) continue;

    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.max(1, Math.hypot(dx, dy));
    const isCrossZone = a.zoneId !== b.zoneId;
    const curve = isCrossZone ? 26 : 10;
    const cx = Math.round(mx + (-dy / len) * curve);
    const cy = Math.round(my + (dx / len) * curve);

    let onRoute = false;
    if (route && route.pathIds.length > 1) {
      for (let i = 0; i < route.pathIds.length - 1; i++) {
        const u = route.pathIds[i]!;
        const v = route.pathIds[i + 1]!;
        if ((u === a.place.id && v === b.place.id) || (u === b.place.id && v === a.place.id)) {
          onRoute = true;
          break;
        }
      }
    }

    edges.push({
      id: rawEdge.id,
      fromId: a.place.id,
      toId: b.place.id,
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
      cx,
      cy,
      pathType: rawEdge.pathType,
      label: rawEdge.label,
      travelMinutes: rawEdge.travelMinutes,
      locked: Boolean(rawEdge.locked),
      isOnRoute: onRoute,
      isCrossZone,
    });
  }

  return { zones, nodes, edges };
}

export interface ZoneHubNode {
  zone: MapZoneRecord;
  x: number;
  y: number;
  placeIds: string[];
  containsCurrent: boolean;
  isOnRoute: boolean;
  backdropUrl?: string;
  actorsHere: Array<{ id: string; name: string; portraitUrl?: string }>;
  activeQuestCount: number;
  minTravelMinutes: number;
}

export interface ZoneHubEdge {
  id: string;
  fromZoneId: string;
  toZoneId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  cx: number;
  cy: number;
  pathType: MapPathKind;
  travelMinutes: number;
  locked: boolean;
  isOnRoute: boolean;
}

/**
 * Computes a clean Visual Novel Zone-Hub graph (`1000x360` viewBox) for the `All Zones`
 * overview, replacing nested empty boxes with illustrated hub pins and inter-zone transit lines.
 */
export function buildZoneHubLayout(
  state: CampaignState,
  selectedPlaceId?: string,
): {
  hubs: ZoneHubNode[];
  edges: ZoneHubEdge[];
} {
  const allPlaces = Object.values(state.places);
  if (!allPlaces.length) return { hubs: [], edges: [] };

  const curId = state.currentPlaceId || allPlaces[0]!.id;
  const resolvedZones: Record<string, MapZoneRecord> = { ...(state.mapZones ?? {}) };

  const getZoneForPlace = (p: MapPlaceNode): MapZoneRecord => {
    const zid = p.zoneId || DEFAULT_ZONE.id;
    if (resolvedZones[zid]) return resolvedZones[zid]!;
    if (zid === DEFAULT_ZONE.id) {
      resolvedZones[zid] = {
        ...DEFAULT_ZONE,
        name: state.title && state.title !== 'Uncharted Story' ? state.title : 'Local Area',
      };
      return resolvedZones[zid]!;
    }
    resolvedZones[zid] = {
      id: zid,
      name: zid.replace(/[_-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      kind: p.category === 'region' ? 'region' : 'building',
      icon: p.category === 'region' ? '🏔️' : '🏛️',
      color: '#38bdf8',
      description: '',
    };
    return resolvedZones[zid]!;
  };

  const buckets = new Map<string, { zone: MapZoneRecord; places: MapPlaceNode[] }>();
  for (const p of allPlaces) {
    const z = getZoneForPlace(p);
    let b = buckets.get(z.id);
    if (!b) {
      b = { zone: z, places: [] };
      buckets.set(z.id, b);
    }
    b.places.push(p);
  }

  const bucketList = [...buckets.values()];
  const count = bucketList.length;
  const route =
    selectedPlaceId && selectedPlaceId !== curId
      ? findShortestTravelRoute(state, selectedPlaceId)
      : null;
  const routePlaceSet = new Set(route?.pathIds ?? []);
  const activeQuests = Object.values(state.quests).filter(q => q.status === 'active');

  const coordsForIndex = (idx: number, total: number): { x: number; y: number } => {
    if (total === 1) return { x: 500, y: 180 };
    if (total === 2) return { x: idx === 0 ? 270 : 730, y: 180 };
    if (total === 3) {
      const pts = [
        { x: 230, y: 118 },
        { x: 770, y: 118 },
        { x: 500, y: 252 },
      ];
      return pts[idx]!;
    }
    const cols = Math.min(3, Math.ceil(total / 2));
    const rows = Math.ceil(total / cols);
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const xStep = cols > 1 ? 620 / (cols - 1) : 0;
    const yStep = rows > 1 ? 150 / (rows - 1) : 0;
    const stagger = row % 2 === 1 && cols > 1 ? 35 : 0;
    return {
      x: Math.round(190 + col * xStep + stagger),
      y: Math.round(105 + row * yStep),
    };
  };

  const hubs: ZoneHubNode[] = bucketList.map((bucket, idx) => {
    const pos = coordsForIndex(idx, count);
    const placeIds = bucket.places.map(p => p.id);
    const placeIdSet = new Set(placeIds);
    const containsCurrent = placeIdSet.has(curId);
    const isOnRoute = placeIds.some(pid => routePlaceSet.has(pid));

    const actorsHere = Object.values(state.characters)
      .filter(c => (c.present ? containsCurrent : placeIdSet.has(c.locationId)))
      .map(c => ({ id: c.id, name: c.name, portraitUrl: c.portraitUrl }));

    const activeQuestCount = activeQuests.filter(q =>
      bucket.places.some(p =>
        `${q.title} ${q.summary}`.toLowerCase().includes(p.name.toLowerCase()),
      ),
    ).length;

    const backdropUrl =
      bucket.places.find(p => p.id === curId && p.backdropUrl)?.backdropUrl ??
      bucket.places.find(p => p.backdropUrl)?.backdropUrl;

    let minTravelMinutes = 0;
    if (!containsCurrent) {
      let best = Infinity;
      for (const p of bucket.places) {
        const r = findShortestTravelRoute(state, p.id);
        if (r && r.totalMinutes < best) best = r.totalMinutes;
      }
      minTravelMinutes = Number.isFinite(best) ? best : (bucket.places[0]?.travelMinutes ?? 5);
    }

    return {
      zone: bucket.zone,
      x: pos.x,
      y: pos.y,
      placeIds,
      containsCurrent,
      isOnRoute,
      ...(backdropUrl ? { backdropUrl } : {}),
      actorsHere,
      activeQuestCount,
      minTravelMinutes,
    };
  });

  const hubByZoneId = new Map(hubs.map(h => [h.zone.id, h]));
  const placeToZoneId = new Map<string, string>();
  for (const h of hubs) {
    for (const pid of h.placeIds) placeToZoneId.set(pid, h.zone.id);
  }

  const edgeMap = new Map<string, ZoneHubEdge>();
  for (const rawEdge of resolveMapPathEdges(state)) {
    const zA = placeToZoneId.get(rawEdge.fromId);
    const zB = placeToZoneId.get(rawEdge.toId);
    if (!zA || !zB || zA === zB) continue;
    const [u, v] = [zA, zB].sort();
    const key = `${u}__${v}`;
    const hubA = hubByZoneId.get(u!);
    const hubB = hubByZoneId.get(v!);
    if (!hubA || !hubB) continue;

    const isRouteEdge =
      routePlaceSet.has(rawEdge.fromId) && routePlaceSet.has(rawEdge.toId);
    const existing = edgeMap.get(key);
    if (existing) {
      existing.travelMinutes = Math.min(existing.travelMinutes, rawEdge.travelMinutes);
      existing.locked = existing.locked && Boolean(rawEdge.locked);
      existing.isOnRoute = existing.isOnRoute || isRouteEdge;
      continue;
    }

    const mx = (hubA.x + hubB.x) / 2;
    const my = (hubA.y + hubB.y) / 2;
    const dx = hubB.x - hubA.x;
    const dy = hubB.y - hubA.y;
    const len = Math.max(1, Math.hypot(dx, dy));
    const cx = Math.round(mx + (-dy / len) * 24);
    const cy = Math.round(my + (dx / len) * 24);

    edgeMap.set(key, {
      id: key,
      fromZoneId: u!,
      toZoneId: v!,
      x1: hubA.x,
      y1: hubA.y,
      x2: hubB.x,
      y2: hubB.y,
      cx,
      cy,
      pathType: rawEdge.pathType,
      travelMinutes: rawEdge.travelMinutes,
      locked: Boolean(rawEdge.locked),
      isOnRoute: isRouteEdge,
    });
  }

  return { hubs, edges: [...edgeMap.values()] };
}
