import {
  buildSpatialMapLayout,
  buildZoneHubLayout,
  findShortestTravelRoute,
  resolveMapPathEdges,
} from '../../shared/map-graph';
import { slugifyKey } from '../../shared/templates';
import type { MapPathKind, MapZoneKind, MapZoneRecord } from '../../shared/types';
import { btn, el, mountThemedSelect, type LumiFrontendController } from '../controller';

let focusedZoneId = '';
let showOverviewMode = true;

const PATH_ICON: Record<MapPathKind, string> = {
  door: '🚪',
  hallway: '🚶',
  stairs: '🪜',
  street: '🛣️',
  trail: '🌿',
  transit: '🚇',
  portal: '✨',
};

function renderAvatarBadges(
  actors: Array<{ id: string; name: string; portraitUrl?: string }>,
  maxShown = 3,
): HTMLElement {
  const row = el('div', 'ls-mz-node-avatars');
  for (const actor of actors.slice(0, maxShown)) {
    const av = el('span', 'ls-mz-mini-av');
    av.title = actor.name;
    if (actor.portraitUrl) {
      const img = el('img');
      img.src = actor.portraitUrl;
      img.alt = actor.name;
      av.append(img);
    } else {
      av.textContent = actor.name.slice(0, 1).toUpperCase();
    }
    row.append(av);
  }
  if (actors.length > maxShown) {
    row.append(el('small', 'ls-muted', `+${actors.length - maxShown}`));
  }
  return row;
}

export function renderSpatialMapSurface(ctrl: LumiFrontendController): HTMLElement {
  const { state } = ctrl.snapshot;
  const wrap = el('div', 'ls-stack');
  const places = Object.values(state.places);
  const zonesMap = state.mapZones ?? {};
  const allEdges = resolveMapPathEdges(state);

  if (focusedZoneId && !places.some(p => (p.zoneId || 'zone_local') === focusedZoneId)) {
    focusedZoneId = '';
  }

  // 1. Top Breadcrumb & Atlas Actions Bar
  const topRow = el('div', 'ls-row-between');
  const curId = state.currentPlaceId || places[0]?.id || '';
  const inspectedId =
    ctrl.selectedPlaceId && state.places[ctrl.selectedPlaceId] ? ctrl.selectedPlaceId : curId;
  const hubLayout = buildZoneHubLayout(state, inspectedId);
  const hasMultipleZones = hubLayout.hubs.length > 1;
  const effectiveZoneId =
    focusedZoneId || (!showOverviewMode || !hasMultipleZones ? (hubLayout.hubs[0]?.zone.id ?? '') : '');

  const breadcrumbRow = el('div', 'ls-row ls-vn-breadcrumb');
  const allBtn = btn(
    `🌍 All Zones (${hubLayout.hubs.length})`,
    () => {
      focusedZoneId = '';
      showOverviewMode = true;
      ctrl.emitChange();
    },
    'ls-btn-sm',
  );
  if (!effectiveZoneId) allBtn.setAttribute('aria-current', 'page');
  breadcrumbRow.append(allBtn);

  if (hasMultipleZones) {
    for (const hub of hubLayout.hubs) {
      const zb = btn(
        `${hub.zone.icon} ${hub.zone.name} (${hub.placeIds.length})`,
        () => {
          focusedZoneId = hub.zone.id;
          showOverviewMode = false;
          ctrl.emitChange();
        },
        'ls-btn-sm',
      );
      if (effectiveZoneId === hub.zone.id) zb.setAttribute('aria-current', 'page');
      breadcrumbRow.append(zb);
    }
  } else if (hubLayout.hubs[0]) {
    const onlyHub = hubLayout.hubs[0];
    breadcrumbRow.append(
      el('span', 'ls-chip ls-chip-accent', `${onlyHub.zone.icon} ${onlyHub.zone.name}`),
    );
  }

  const rightControls = el('div', 'ls-row');
  rightControls.append(
    btn(
      '+ Zone',
      () => {
        ctrl.modals.open(
          { title: 'Create Map Zone / Building / District', width: 460 },
          (body, close, _handle, modalScope) => {
            const nameWrap = el('label', 'ls-label', 'Zone Name');
            const nameInp = el('input', 'ls-input');
            nameInp.placeholder = 'e.g. Sakura Manor, Downtown, Orbital Deck B…';
            nameWrap.append(nameInp);

            let selectedZoneKind: MapZoneKind = 'building';
            const kindWrap = el('div', 'ls-label', 'Zone Type');
            const kindSlot = el('div');
            kindWrap.append(kindSlot);
            mountThemedSelect(ctrl, modalScope, kindSlot, {
              value: selectedZoneKind,
              ariaLabel: 'Zone Type',
              options: [
                { value: 'building', label: '🏛️ Building / Interior' },
                { value: 'district', label: '🌆 City District' },
                { value: 'region', label: '🏔️ Wilderness / Region' },
                { value: 'ship_deck', label: '🚀 Ship / Station Deck' },
                { value: 'realm', label: '✨ Realm / Dimension' },
              ],
              onChange: v => {
                selectedZoneKind = v as MapZoneKind;
              },
            });

            const iconWrap = el('label', 'ls-label', 'Icon');
            const iconInp = el('input', 'ls-input');
            iconInp.value = '🏛️';
            iconWrap.append(iconInp);

            const saveBtn = btn('Create Zone', () => {
              const name = nameInp.value.trim();
              if (!name) return;
              void ctrl.request('state:mutate', {
                patch: {
                  zones: [
                    {
                      id: slugifyKey(name, 'zone'),
                      name,
                      kind: selectedZoneKind,
                      icon: iconInp.value.trim() || '🏛️',
                    },
                  ],
                },
                reason: `Created zone "${name}"`,
              });
              close();
            }, 'ls-btn-primary');
            body.append(nameWrap, kindWrap, iconWrap, saveBtn);
          },
        );
      },
      'ls-btn-sm',
    ),
    btn(
      '+ Place',
      () => {
        ctrl.modals.open({ title: 'Add Location Pin', width: 480 }, (body, close) => {
          const nameWrap = el('label', 'ls-label', 'Location Name');
          const nameInp = el('input', 'ls-input');
          nameWrap.append(nameInp);

          const zoneWrap = el('label', 'ls-label', 'Zone / Building / District');
          const zoneInp = el('input', 'ls-input');
          zoneInp.value =
            (effectiveZoneId && zonesMap[effectiveZoneId]?.name) ||
            (state.places[curId]?.zoneId && zonesMap[state.places[curId]!.zoneId!]?.name) ||
            '';
          zoneInp.placeholder = 'e.g. Second-Floor Apartment';
          zoneWrap.append(zoneInp);

          const iconWrap = el('label', 'ls-label', 'Icon');
          const iconInp = el('input', 'ls-input');
          iconInp.value = '📍';
          iconWrap.append(iconInp);

          const descWrap = el('label', 'ls-label', 'Description');
          const descInp = el('input', 'ls-input');
          descWrap.append(descInp);

          const saveBtn = btn('Add Location', () => {
            const name = nameInp.value.trim();
            if (!name) return;
            const curName = state.places[curId]?.name;
            void ctrl.request('state:mutate', {
              patch: {
                places: [
                  {
                    id: slugifyKey(name, 'place'),
                    name,
                    zone: zoneInp.value.trim() || undefined,
                    icon: iconInp.value.trim() || '📍',
                    description: descInp.value.trim() || 'Connected location.',
                    connectedNames: curName ? [curName] : [],
                  },
                ],
              },
              reason: `Added location "${name}"`,
            });
            close();
          }, 'ls-btn-primary');
          body.append(nameWrap, zoneWrap, iconWrap, descWrap, saveBtn);
        });
      },
      'ls-btn-sm ls-btn-primary',
    ),
    btn(
      'Export',
      () => {
        const mapPack = {
          schema: 'lumi-stats-map/v1',
          zones: Object.values(zonesMap),
          places,
          paths: allEdges,
        };
        const blob = new Blob([JSON.stringify(mapPack, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${slugifyKey(state.title, 'lumi_map')}.lumi-map.json`;
        document.body.append(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      },
      'ls-btn-sm ls-btn-ghost',
      'Export Map JSON',
    ),
    btn(
      'Import',
      () => {
        void ctrl.ctx.uploads
          .pickFile({ accept: ['.json', 'application/json'], multiple: false, maxSizeBytes: 1_500_000 })
          .then(files => {
            const f = files[0];
            if (!f) return;
            const parsed = JSON.parse(new TextDecoder().decode(f.bytes)) as Record<string, unknown>;
            void ctrl.request('state:mutate', {
              patch: {
                zones: Array.isArray(parsed.zones) ? parsed.zones : undefined,
                places: Array.isArray(parsed.places) ? parsed.places : undefined,
                paths: Array.isArray(parsed.paths) ? parsed.paths : undefined,
              },
              reason: `Imported map layout from ${f.name}`,
            });
          });
      },
      'ls-btn-sm ls-btn-ghost',
      'Import Map JSON',
    ),
  );
  topRow.append(breadcrumbRow, rightControls);
  wrap.append(topRow);

  if (!places.length) {
    const empty = el('div', 'ls-card');
    empty.append(
      el('strong', '', 'No locations mapped yet'),
      el('p', 'ls-muted', 'Locations, zones, and connecting paths build automatically as scenes progress, or click "+ Zone" / "+ Place" above.'),
    );
    wrap.append(empty);
    return wrap;
  }

  const inspectedPlace = state.places[inspectedId] ?? places[0]!;
  const inspector = el('div', 'ls-card');

  // 2. VN Illustrated Interactive Atlas Canvas (Hub View OR Inside-Zone Transit View)
  const canvas = el('div', 'ls-vn-atlas-canvas');
  const activeBackdrop =
    inspectedPlace.backdropUrl ||
    places.find(p => p.id === curId && p.backdropUrl)?.backdropUrl ||
    places.find(p => p.backdropUrl)?.backdropUrl;
  if (activeBackdrop) {
    canvas.style.backgroundImage = `linear-gradient(rgba(11,17,32,0.72), rgba(11,17,32,0.88)), url(${JSON.stringify(activeBackdrop)})`;
    canvas.style.backgroundSize = 'cover';
    canvas.style.backgroundPosition = 'center';
  }

  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;';

  if (!effectiveZoneId && hasMultipleZones) {
    // ── MODE A: All Zones Visual Novel Hub Map (No giant empty boxes!) ──
    svg.setAttribute('viewBox', '0 0 1000 360');
    for (const edge of hubLayout.edges) {
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', `M ${edge.x1} ${edge.y1} Q ${edge.cx} ${edge.cy} ${edge.x2} ${edge.y2}`);
      path.setAttribute('fill', 'none');
      path.setAttribute(
        'stroke',
        edge.locked
          ? 'var(--ls-danger, #f43f5e)'
          : edge.isOnRoute
            ? 'var(--ls-primary, #38bdf8)'
            : 'rgba(148,163,184,0.55)',
      );
      path.setAttribute('stroke-width', edge.isOnRoute ? '3' : '2');
      path.setAttribute('stroke-dasharray', edge.locked ? '5 4' : '4 3');
      svg.append(path);

      const midX = 0.25 * edge.x1 + 0.5 * edge.cx + 0.25 * edge.x2;
      const midY = 0.25 * edge.y1 + 0.5 * edge.cy + 0.25 * edge.y2;
      const ePill = el(
        'span',
        'ls-mz-edge-pill',
        `${edge.locked ? '🔒 ' : PATH_ICON[edge.pathType] || '🛣️'} ${edge.travelMinutes}m`,
      );
      ePill.dataset.route = String(edge.isOnRoute);
      ePill.style.left = `${((midX / 1000) * 100).toFixed(2)}%`;
      ePill.style.top = `${((midY / 360) * 100).toFixed(2)}%`;
      canvas.append(ePill);
    }
    canvas.append(svg);

    for (const hub of hubLayout.hubs) {
      const hubBtn = btn(
        '',
        () => {
          focusedZoneId = hub.zone.id;
          showOverviewMode = false;
          if (hub.placeIds[0] && !hub.placeIds.includes(inspectedId)) {
            ctrl.selectedPlaceId = hub.placeIds[0];
          }
          ctrl.emitChange();
        },
        'ls-vn-zone-hub',
        `Open ${hub.zone.name} (${hub.placeIds.length} locations)`,
      );
      hubBtn.dataset.current = String(hub.containsCurrent);
      hubBtn.style.setProperty('--ls-zone-color', hub.zone.color || '#38bdf8');
      hubBtn.style.left = `${((hub.x / 1000) * 100).toFixed(2)}%`;
      hubBtn.style.top = `${((hub.y / 360) * 100).toFixed(2)}%`;

      if (hub.backdropUrl) {
        hubBtn.style.backgroundImage = `linear-gradient(rgba(11,17,32,0.72), rgba(11,17,32,0.88)), url(${JSON.stringify(hub.backdropUrl)})`;
        hubBtn.style.backgroundSize = 'cover';
        hubBtn.style.backgroundPosition = 'center';
      }

      const topMeta = el('div', 'ls-row');
      topMeta.append(
        el('span', '', `${hub.zone.icon} ${hub.zone.name}`),
      );
      const subMeta = el('div', 'ls-row');
      if (hub.containsCurrent) {
        subMeta.append(el('span', 'ls-chip ls-chip-accent', 'YOU'));
      } else {
        subMeta.append(el('span', 'ls-chip', `${hub.minTravelMinutes}m`));
      }
      subMeta.append(el('span', 'ls-chip', `${hub.placeIds.length} ${hub.placeIds.length === 1 ? 'spot' : 'spots'}`));
      if (hub.activeQuestCount > 0) {
        subMeta.append(el('span', 'ls-chip', '🎯'));
      }
      hubBtn.append(topMeta, subMeta);
      if (hub.actorsHere.length > 0) {
        hubBtn.append(renderAvatarBadges(hub.actorsHere, 4));
      }
      canvas.append(hubBtn);
    }
  } else {
    // ── MODE B: Inside-Zone / Local Area Transit Constellation ──
    const zoneLayout = buildSpatialMapLayout(state, inspectedId, effectiveZoneId || undefined);
    svg.setAttribute('viewBox', '0 0 1000 580');

    for (const edge of zoneLayout.edges) {
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', `M ${edge.x1} ${edge.y1} Q ${edge.cx} ${edge.cy} ${edge.x2} ${edge.y2}`);
      path.setAttribute('fill', 'none');
      path.setAttribute(
        'stroke',
        edge.locked
          ? 'var(--ls-danger, #f43f5e)'
          : edge.isOnRoute
            ? 'var(--ls-primary, #38bdf8)'
            : 'rgba(148,163,184,0.55)',
      );
      path.setAttribute('stroke-width', edge.isOnRoute ? '3.5' : '2');
      if (edge.locked || edge.isCrossZone || edge.pathType === 'portal') {
        path.setAttribute('stroke-dasharray', edge.pathType === 'portal' ? '3 4' : '6 4');
      }
      svg.append(path);

      const midX = 0.25 * edge.x1 + 0.5 * edge.cx + 0.25 * edge.x2;
      const midY = 0.25 * edge.y1 + 0.5 * edge.cy + 0.25 * edge.y2;
      const ePill = el(
        'span',
        'ls-mz-edge-pill',
        `${edge.locked ? '🔒 ' : PATH_ICON[edge.pathType] || '🚪'} ${edge.travelMinutes}m`,
      );
      ePill.dataset.route = String(edge.isOnRoute);
      ePill.style.left = `${((midX / 1000) * 100).toFixed(2)}%`;
      ePill.style.top = `${((midY / 580) * 100).toFixed(2)}%`;
      canvas.append(ePill);
    }
    canvas.append(svg);

    for (const node of zoneLayout.nodes) {
      const tile = btn(
        '',
        () => {
          ctrl.selectedPlaceId = node.place.id;
          ctrl.emitChange();
          requestAnimationFrame(() => {
            inspector.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          });
        },
        'ls-mz-node-tile',
        node.place.name,
      );
      tile.dataset.current = String(node.isCurrent);
      tile.dataset.selected = String(node.place.id === inspectedId);
      tile.style.left = `${((node.x / 1000) * 100).toFixed(2)}%`;
      tile.style.top = `${((node.y / 580) * 100).toFixed(2)}%`;

      const shortName =
        node.place.name.length > 24 ? `${node.place.name.slice(0, 22)}…` : node.place.name;
      tile.append(
        el(
          'span',
          'ls-mz-node-title',
          `${node.place.icon || '📍'} ${shortName}${node.activeQuestCount ? ' 🎯' : ''}`,
        ),
      );
      if (node.actorsHere.length > 0 || node.isCurrent) {
        const avRow = renderAvatarBadges(node.actorsHere, 3);
        if (node.isCurrent) {
          avRow.prepend(el('span', 'ls-chip ls-chip-accent', 'YOU'));
        }
        tile.append(avRow);
      }
      canvas.append(tile);
    }
  }
  wrap.append(canvas);

  // 3. VN Destination Cards Grid (Full untruncated names, backdrop thumbs & 1-click Go)
  const visiblePlaces = effectiveZoneId
    ? places.filter(p => (p.zoneId || 'zone_local') === effectiveZoneId)
    : places;

  const destGrid = el('div', 'ls-vn-dest-grid');
  for (const p of visiblePlaces) {
    const isCurrent = p.id === curId;
    const isInspected = p.id === inspectedPlace.id;
    const route = !isCurrent ? findShortestTravelRoute(state, p.id) : null;
    const actorsAtPlace = Object.values(state.characters)
      .filter(c => (c.present ? p.id === curId : c.locationId === p.id))
      .map(c => ({ id: c.id, name: c.name, portraitUrl: c.portraitUrl }));

    const card = el('div', 'ls-vn-dest-card');
    card.dataset.current = String(isCurrent);
    card.dataset.selected = String(isInspected);
    card.addEventListener('click', () => {
      ctrl.selectedPlaceId = p.id;
      ctrl.emitChange();
    });

    const thumb = el('div', 'ls-vn-dest-thumb');
    if (p.backdropUrl) {
      const img = el('img');
      img.src = p.backdropUrl;
      img.alt = p.name;
      thumb.append(img);
    } else {
      thumb.textContent = p.icon || '📍';
    }

    const info = el('div', 'ls-vn-dest-info');
    const titleLine = el('div', 'ls-row');
    titleLine.append(el('strong', '', p.name));
    if (isCurrent) titleLine.append(el('span', 'ls-chip ls-chip-accent', 'Here'));
    info.append(titleLine);

    const zName = (p.zoneId && zonesMap[p.zoneId]?.name) || '';
    if (zName) {
      info.append(el('small', 'ls-muted', zName));
    }
    if (actorsAtPlace.length > 0) {
      info.append(renderAvatarBadges(actorsAtPlace, 4));
    }

    const rightSide = el('div', 'ls-row');
    if (!isCurrent) {
      rightSide.append(
        el('span', 'ls-chip', `${route?.totalMinutes ?? p.travelMinutes}m`),
        btn(
          'Go',
          () => {
            void ctrl.request('map:travel', { placeId: p.id, fastTravel: true });
          },
          'ls-btn-sm ls-btn-primary',
          `Fast travel to ${p.name}`,
        ),
      );
    }

    card.append(thumb, info, rightSide);
    destGrid.append(card);
  }
  wrap.append(destGrid);

  // 4. Selected Location Inspector & Connected Exits
  const route = inspectedPlace.id !== curId ? findShortestTravelRoute(state, inspectedPlace.id) : null;
  const placeEdges = allEdges.filter(
    e => e.fromId === inspectedPlace.id || e.toId === inspectedPlace.id,
  );
  const inspectedZoneName =
    (inspectedPlace.zoneId && zonesMap[inspectedPlace.zoneId]?.name) || 'Local Area';

  const head = el('div', 'ls-row-between');
  head.append(
    el('strong', '', `${inspectedPlace.icon} ${inspectedPlace.name} · ${inspectedZoneName}`),
    el(
      'span',
      'ls-chip ls-chip-accent',
      inspectedPlace.id === curId
        ? 'Current Location'
        : `${route?.totalMinutes ?? inspectedPlace.travelMinutes}m travel`,
    ),
  );
  inspector.append(head, el('p', 'ls-muted', inspectedPlace.description));

  if (placeEdges.length > 0) {
    const pathRow = el('div', 'ls-row');
    for (const edge of placeEdges) {
      const peerId = edge.fromId === inspectedPlace.id ? edge.toId : edge.fromId;
      const peerName = state.places[peerId]?.name ?? peerId;
      pathRow.append(
        btn(
          `${edge.locked ? '🔒' : PATH_ICON[edge.pathType]} ${peerName} (${edge.travelMinutes}m)`,
          () => {
            ctrl.selectedPlaceId = peerId;
            ctrl.emitChange();
          },
          'ls-btn-sm',
          'Jump inspector to connected place',
        ),
      );
    }
    inspector.append(pathRow);
  }

  const btnRow = el('div', 'ls-row');
  if (inspectedPlace.id !== curId) {
    btnRow.append(
      btn(
        'Copy Travel Action',
        () => {
          void ctrl
            .request('map:travel', { placeId: inspectedPlace.id, fastTravel: false })
            .then(async res => {
              const text = typeof res.draftText === 'string' ? res.draftText : '';
              if (!text) return;
              try {
                await navigator.clipboard.writeText(text);
                ctrl.notify(`Copied travel action: "${text}"`);
              } catch {
                ctrl.notify(`Travel route: ${text}`);
              }
            });
        },
        'ls-btn-sm',
      ),
      btn(
        'Fast Travel Here',
        () => {
          void ctrl.request('map:travel', { placeId: inspectedPlace.id, fastTravel: true });
        },
        'ls-btn-sm ls-btn-primary',
      ),
    );
  }
  btnRow.append(
    btn('Upload Backdrop', () => ctrl.pickAndUploadImage(inspectedPlace.id, 'backdrop'), 'ls-btn-sm'),
    btn(
      'Edit Place',
      () => {
        ctrl.modals.open({ title: `Edit Place: ${inspectedPlace.name}`, width: 500 }, (body, close) => {
          const nameWrap = el('label', 'ls-label', 'Location Name');
          const nameInp = el('input', 'ls-input');
          nameInp.value = inspectedPlace.name;
          nameWrap.append(nameInp);

          const zoneWrap = el('label', 'ls-label', 'Zone / Building / District');
          const zoneInp = el('input', 'ls-input');
          zoneInp.value = (inspectedPlace.zoneId && zonesMap[inspectedPlace.zoneId]?.name) || '';
          zoneWrap.append(zoneInp);

          const iconWrap = el('label', 'ls-label', 'Icon');
          const iconInp = el('input', 'ls-input');
          iconInp.value = inspectedPlace.icon || '🏛️';
          iconWrap.append(iconInp);

          const tagsWrap = el('label', 'ls-label', 'Tags (comma-separated, e.g. safe, shop, danger)');
          const tagsInp = el('input', 'ls-input');
          tagsInp.value = (inspectedPlace.tags ?? []).join(', ');
          tagsWrap.append(tagsInp);

          const descWrap = el('label', 'ls-label', 'Description');
          const descInp = el('textarea', 'ls-input');
          descInp.rows = 2;
          descInp.value = inspectedPlace.description;
          descWrap.append(descInp);

          const minsWrap = el('label', 'ls-label', 'Default Travel Minutes');
          const minsInp = el('input', 'ls-input');
          minsInp.type = 'number';
          minsInp.value = String(inspectedPlace.travelMinutes || 5);
          minsWrap.append(minsInp);

          const saveBtn = btn('Save Location', () => {
            const zName = zoneInp.value.trim();
            const nextZones: Record<string, MapZoneRecord> = { ...(state.mapZones ?? {}) };
            let nextZoneId = inspectedPlace.zoneId;
            if (zName) {
              nextZoneId = slugifyKey(zName, 'zone');
              if (!nextZones[nextZoneId]) {
                nextZones[nextZoneId] = {
                  id: nextZoneId,
                  name: zName,
                  kind: 'building',
                  icon: '🏛️',
                  color: '#38bdf8',
                  description: '',
                };
              }
            }
            const nextPlaces = structuredClone(state.places);
            const target = nextPlaces[inspectedPlace.id];
            if (target) {
              target.name = nameInp.value.trim() || target.name;
              target.zoneId = nextZoneId;
              target.icon = iconInp.value.trim() || '📍';
              target.tags = tagsInp.value.split(',').map(s => s.trim()).filter(Boolean);
              target.description = descInp.value.trim() || target.description;
              target.travelMinutes = Math.max(1, Number(minsInp.value) || 5);
              void ctrl.request('state:mutate', {
                stateOverride: { places: nextPlaces, mapZones: nextZones },
                reason: `Edited location "${target.name}"`,
              });
            }
            close();
          }, 'ls-btn-primary');
          body.append(nameWrap, zoneWrap, iconWrap, tagsWrap, descWrap, minsWrap, saveBtn);
        });
      },
      'ls-btn-sm',
    ),
  );

  if (places.length > 1) {
    btnRow.append(
      btn(
        'Delete',
        () => {
          const nextPlaces = structuredClone(state.places);
          delete nextPlaces[inspectedPlace.id];
          for (const p of Object.values(nextPlaces)) {
            p.connectedIds = p.connectedIds.filter(cid => cid !== inspectedPlace.id);
          }
          const nextPaths = (state.mapPaths ?? []).filter(
            e => e.fromId !== inspectedPlace.id && e.toId !== inspectedPlace.id,
          );
          const nextCurId =
            state.currentPlaceId === inspectedPlace.id
              ? (Object.keys(nextPlaces)[0] ?? '')
              : state.currentPlaceId;
          ctrl.selectedPlaceId = nextCurId;
          void ctrl.request('state:mutate', {
            stateOverride: { places: nextPlaces, mapPaths: nextPaths, currentPlaceId: nextCurId },
            reason: `Deleted location "${inspectedPlace.name}"`,
          });
        },
        'ls-btn-sm ls-btn-danger',
      ),
    );
  }
  inspector.append(btnRow);
  wrap.append(inspector);

  return wrap;
}
