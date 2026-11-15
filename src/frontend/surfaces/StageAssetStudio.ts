import { formatStoryClock } from '../../shared/formula';
import { resolveCharacterFieldValue } from '../../shared/prompt-compiler';
import { slugifyKey } from '../../shared/templates';
import type {
  CampaignState,
  CharacterRecord,
  CharacterSpriteVariant,
  LocationBackdropVariant,
  LocationTimeSlot,
  MapPlaceNode,
} from '../../shared/types';
import { btn, el, type LumiFrontendController } from '../controller';

let activeAssetStudioSubTab: 'characters' | 'locations' = 'characters';
let selectedStudioCharId = '';
let selectedStudioPlaceId = '';

/**
 * Infers the current time-of-day slot (`morning` | `day` | `evening` | `night`)
 * from `state.scene.timeLabel` or `state.elapsedMinutes`.
 */
export function inferTimeSlotFromScene(
  state: CampaignState,
): 'morning' | 'day' | 'evening' | 'night' {
  const rawLabel = (state.scene.timeLabel || formatStoryClock(state.elapsedMinutes) || '').trim();
  const lower = rawLabel.toLowerCase();

  if (/\b(?:dawn|sunrise|morning|breakfast)\b/.test(lower)) return 'morning';
  if (/\b(?:noon|midday|afternoon|daytime|lunch)\b/.test(lower)) return 'day';
  if (/\b(?:dusk|sunset|evening|twilight|dinner)\b/.test(lower)) return 'evening';
  if (/\b(?:night|midnight|late\s*night|moon)\b/.test(lower)) return 'night';

  const timeMatch = rawLabel.match(/(\d{1,2})\s*:\s*(\d{2})\s*(am|pm)?/i);
  if (timeMatch) {
    let hour = Number(timeMatch[1]);
    const ampm = timeMatch[3]?.toLowerCase();
    if (ampm === 'pm' && hour < 12) hour += 12;
    if (ampm === 'am' && hour === 12) hour = 0;
    if (hour >= 5 && hour < 11) return 'morning';
    if (hour >= 11 && hour < 17) return 'day';
    if (hour >= 17 && hour < 20) return 'evening';
    return 'night';
  }

  const totalMinutes = (Math.max(0, Math.round(state.elapsedMinutes)) + 8 * 60) % 1440;
  const hour24 = Math.floor(totalMinutes / 60);
  if (hour24 >= 5 && hour24 < 11) return 'morning';
  if (hour24 >= 11 && hour24 < 17) return 'day';
  if (hour24 >= 17 && hour24 < 20) return 'evening';
  return 'night';
}

/**
 * Resolves the best backdrop URL for `place` based on:
 * 1. User-pinned variant (`v.pinned`)
 * 2. Custom tag match against `state.scene.weather`, `state.scene.timeLabel`, or `state.scene.beatSummary`
 * 3. Active time-of-day slot (`morning` | `day` | `evening` | `night`)
 * 4. Default variant (`timeSlot === 'default'`) or `place.backdropUrl`
 */
export function resolveBestPlaceBackdropUrl(
  place: MapPlaceNode | undefined,
  state: CampaignState,
): { url: string; matchedLabel: string } {
  if (!place) return { url: '', matchedLabel: 'No Location' };
  const variants = place.backdropVariants ?? [];

  const pinned = variants.find(v => v.pinned && v.url);
  if (pinned) {
    return {
      url: pinned.url,
      matchedLabel: `📌 ${pinned.customTag || pinned.timeSlot}`,
    };
  }

  const contextLower = [
    state.scene.weather,
    state.scene.timeLabel,
    state.scene.dateLabel,
     place.atmosphere,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  for (const v of variants) {
    if (v.timeSlot === 'custom' && v.customTag && v.url) {
      const tagTokens = v.customTag
        .toLowerCase()
        .split(/[,/|\s]+/)
        .filter(t => t.length >= 2);
      if (tagTokens.length > 0 && tagTokens.every(tok => contextLower.includes(tok))) {
        return { url: v.url, matchedLabel: `🏷️ ${v.customTag}` };
      }
    }
  }

  const curSlot = inferTimeSlotFromScene(state);
  const slotMatch = variants.find(v => v.timeSlot === curSlot && v.url);
  if (slotMatch) {
    return { url: slotMatch.url, matchedLabel: `🕰️ ${curSlot}` };
  }

  const defMatch = variants.find(v => v.timeSlot === 'default' && v.url);
  if (defMatch) {
    return { url: defMatch.url, matchedLabel: 'Default' };
  }

  return {
    url: place.backdropUrl || '',
    matchedLabel: place.backdropUrl ? 'Default' : 'Atmospheric Stage',
  };
}

function matchesTagAgainstText(tag: string, targetText: string): number {
  const cleanTag = tag.trim().toLowerCase();
  const cleanTarget = targetText.trim().toLowerCase();
  if (!cleanTag || !cleanTarget) return 0;
  if (cleanTarget.includes(cleanTag)) return 2;
  const words = cleanTag.split(/[^a-z0-9]+/).filter(w => w.length >= 3);
  if (!words.length) return 0;
  const hits = words.filter(w => cleanTarget.includes(w)).length;
  return hits > 0 ? hits / words.length : 0;
}

/**
 * Resolves the best 2D sprite URL for `actor` by scoring all saved `spriteVariants`
 * against live Lumi Stats `attire` (Clothes), `demeanor` (Emotion), and `immediateGoal` / `acted` / `beatText` (Pose).
 */
export function resolveBestCharacterSprite(
  actor: CharacterRecord,
  beatText = '',
): { url: string; matchedLabel: string } {
  const variants = actor.spriteVariants ?? [];
  const pinned = variants.find(v => v.pinned && v.url);
  if (pinned) {
    return { url: pinned.url, matchedLabel: `📌 ${pinned.label}` };
  }

  const liveEmotion = resolveCharacterFieldValue(actor, 'demeanor');
  const liveClothes = resolveCharacterFieldValue(actor, 'attire_layers') || actor.attire || '';
  const liveActed = String(actor.meters['acted']?.value ?? '');
  const liveGoal = resolveCharacterFieldValue(actor, 'immediate_goal');
  const livePoseContext = [liveGoal, liveActed, beatText].filter(Boolean).join(' ');

  let bestVariant: CharacterSpriteVariant | undefined;
  let bestScore = 0;

  for (const v of variants) {
    if (!v.url) continue;
    let score = 0;
    let specifiedTags = 0;

    if (v.clothesTag.trim()) {
      specifiedTags++;
      const cMatch = matchesTagAgainstText(v.clothesTag, `${liveClothes} ${beatText}`);
      if (cMatch > 0) score += 3.5 * cMatch;
      else score -= 1.0;
    }

    if (v.emotionTag.trim()) {
      specifiedTags++;
      const eMatch = matchesTagAgainstText(v.emotionTag, `${liveEmotion} ${beatText}`);
      if (eMatch > 0) score += 2.5 * eMatch;
    }

    if (v.poseTag.trim()) {
      specifiedTags++;
      const pMatch = matchesTagAgainstText(v.poseTag, livePoseContext);
      if (pMatch > 0) score += 2.0 * pMatch;
    }

    // A default untagged sprite variant acts as a baseline fallback (score 0.1)
    if (specifiedTags === 0) {
      score = 0.1;
    }

    if (score > bestScore) {
      bestScore = score;
      bestVariant = v;
    }
  }

  if (bestVariant) {
    return { url: bestVariant.url, matchedLabel: bestVariant.label };
  }

  const emoKey = (liveEmotion || 'neutral').toLowerCase();
  if (actor.expressionAssets[emoKey]?.url) {
    return { url: actor.expressionAssets[emoKey]!.url, matchedLabel: emoKey };
  }

  return {
    url: actor.portraitUrl || '',
    matchedLabel: actor.portraitUrl ? 'Base Sprite' : '',
  };
}

/**
 * Opens the Stage Asset Studio Modal (Locations by Time-of-Day + Character Emotion/Clothes/Pose Sprites).
 */
export function openStageAssetStudioModal(
  ctrl: LumiFrontendController,
  initialSubTab?: 'characters' | 'locations',
  focusTargetId?: string,
): void {
  if (initialSubTab) activeAssetStudioSubTab = initialSubTab;
  if (focusTargetId) {
    if (initialSubTab === 'locations') selectedStudioPlaceId = focusTargetId;
    else selectedStudioCharId = focusTargetId;
  }

  ctrl.modals.open(
    {
      title: '🎨 Stage Visual Studio — Character Sprites (Emotion/Clothes/Pose) & Location Time Backdrops',
      width: 960,
      maxHeight: 840,
    },
    (body, _close, handle) => {
      const redraw = () => {
        body.replaceChildren(renderStageAssetStudioSurface(ctrl, redraw));
      };
      redraw();
      const unsub = ctrl.subscribe(redraw);
      handle.onDismiss(unsub);
    },
  );
}

export function renderStageAssetStudioSurface(
  ctrl: LumiFrontendController,
  onForceRedraw?: () => void,
): HTMLElement {
  const { state } = ctrl.snapshot;
  const wrap = el('div', 'ls-stack');
  const redraw = onForceRedraw ?? (() => ctrl.emitChange());

  // Top Sub-Navigation Bar
  const subNav = el('div', 'ls-subnav-pills');
  const characters = Object.values(state.characters);
  const places = Object.values(state.places);

  for (const [tabId, tabLbl] of [
    ['characters', `🎭 Character Sprites: Emotion, Clothes & Poses (${characters.length})`],
    ['locations', `🏞️ Discovered Locations: Time-of-Day & Weather Backdrops (${places.length})`],
  ] as const) {
    const b = btn(tabLbl, () => {
      activeAssetStudioSubTab = tabId;
      redraw();
    }, 'ls-btn-sm');
    if (activeAssetStudioSubTab === tabId) b.setAttribute('aria-current', 'page');
    subNav.append(b);
  }
  wrap.append(subNav);

  // ══════════════════════════════════════════════════════════════════════════
  // WORKSPACE 1: 🎭 CHARACTER SPRITES (EMOTION + CLOTHES + POSE TEXT BOXES)
  // ══════════════════════════════════════════════════════════════════════════
  if (activeAssetStudioSubTab === 'characters') {
    const activeChar =
      (selectedStudioCharId ? state.characters[selectedStudioCharId] : undefined) ??
      characters[0];

    const charBar = el('div', 'ls-row-between');
    const charPills = el('div', 'ls-row');
    for (const c of characters) {
      const count = (c.spriteVariants?.length ?? 0) + (c.portraitUrl ? 1 : 0);
      const b = btn(
        `${c.present ? '🟢' : '⚪'} ${c.name} (${count})`,
        () => {
          selectedStudioCharId = c.id;
          redraw();
        },
        'ls-btn-sm',
      );
      if (c.id === activeChar?.id) b.setAttribute('aria-current', 'page');
      charPills.append(b);
    }

    charBar.append(
      charPills,
      btn('+ Add Character', () => {
        ctrl.modals.open({ title: '➕ Add Character', width: 420 }, (mBody, close) => {
          const nameWrap = el('label', 'ls-label', 'Character Name');
          const nameInp = el('input', 'ls-input');
          nameWrap.append(nameInp);
          const save = btn('➕ Create Character', () => {
            const name = nameInp.value.trim();
            if (!name) return;
            const id = slugifyKey(name, 'npc');
            selectedStudioCharId = id;
            void ctrl.request('state:mutate', {
              patch: { characters: [{ id, name, present: true }] },
              reason: `Added character "${name}"`,
            });
            close();
          }, 'ls-btn-primary');
          mBody.append(nameWrap, save);
        });
      }, 'ls-btn-sm ls-btn-primary'),
    );
    wrap.append(charBar);

    if (!activeChar) {
      const empty = el('div', 'ls-card');
      empty.append(
        el('strong', '', 'No characters in Cast yet'),
        el('p', 'ls-muted', 'Click "+ Add Character" above or sync a chat turn to start uploading character sprites.'),
      );
      wrap.append(empty);
      return wrap;
    }

    // 1A. Add New Sprite Variant Composer (with Emotion, Clothes & Pose Text Boxes!)
    const composerCard = el('section', 'ls-card');
    const liveEmotion = resolveCharacterFieldValue(activeChar, 'demeanor');
    const liveClothes = resolveCharacterFieldValue(activeChar, 'attire_layers') || activeChar.attire;

    composerCard.append(
      el('span', 'ls-kicker', `Upload New Sprite Rule for ${activeChar.name}`),
      el('h3', '', `🖼️ Add Sprite by Emotion, Clothes & Pose — ${activeChar.name}`),
      el(
        'p',
        'ls-muted',
        'Fill in any combination of Emotion, Clothes/Outfit, and Pose/Action below (leave any box blank if it applies to all), then click "🖼️ Upload & Save Sprite". The VN Stage automatically switches to the matching sprite as the story changes!',
      ),
    );

    const inputGrid = el('div', 'ls-grid');

    const emoWrap = el('label', 'ls-label', '🎭 Emotion / Mood Tag (Text Box)');
    const emoInp = el('input', 'ls-input');
    emoInp.placeholder = 'e.g. neutral, happy, flustered, angry, brusque, shy…';
    emoInp.value = liveEmotion || '';
    emoWrap.append(emoInp);
    const emoQuick = el('div', 'ls-row');
    for (const qEmo of ['neutral', 'happy', 'flustered', 'angry', 'sad', 'surprised', 'shy']) {
      emoQuick.append(
        btn(qEmo, () => {
          emoInp.value = qEmo;
        }, 'ls-btn-sm ls-quick-pill'),
      );
    }
    emoWrap.append(emoQuick);

    const clothesWrap = el('label', 'ls-label', '👗 Clothes / Outfit Tag (Text Box)');
    const clothesInp = el('input', 'ls-input');
    clothesInp.placeholder = 'e.g. saree, bath towel, office wear, nightgown, casual…';
    clothesInp.value = '';
    clothesWrap.append(clothesInp);
    if (liveClothes) {
      clothesWrap.append(
        btn(`✨ Use Current Outfit ("${liveClothes.slice(0, 28)}")`, () => {
          clothesInp.value = liveClothes;
        }, 'ls-btn-sm ls-quick-pill'),
      );
    }

    const poseWrap = el('label', 'ls-label', '🧍 Pose / Action Tag (Text Box)');
    const poseInp = el('input', 'ls-input');
    poseInp.placeholder = 'e.g. standing, mopping, crossed arms, holding phone, leaning…';
    poseInp.value = '';
    poseWrap.append(poseInp);
    const poseQuick = el('div', 'ls-row');
    for (const qPose of ['standing', 'crossed arms', 'leaning in', 'looking away', 'sitting']) {
      poseQuick.append(
        btn(qPose, () => {
          poseInp.value = qPose;
        }, 'ls-btn-sm ls-quick-pill'),
      );
    }
    poseWrap.append(poseQuick);

    inputGrid.append(emoWrap, clothesWrap, poseWrap);
    composerCard.append(inputGrid);

    const uploadRow = el('div', 'ls-row-between');
    uploadRow.append(
      el(
        'small',
        'ls-muted',
        `Current Live State — Demeanor: "${liveEmotion || 'neutral'}" · Outfit: "${liveClothes || 'default'}"`,
      ),
      el('div', 'ls-row'),
    );
    (uploadRow.lastElementChild as HTMLElement).append(
      btn('🖼️ Upload Default / Base Sprite', () => {
        ctrl.pickAndUploadImage(activeChar.id, 'portrait');
      }, 'ls-btn-sm'),
      btn('🖼️ Upload & Save Sprite Variant', () => {
        ctrl.uploadStageVariantAsset({
          targetId: activeChar.id,
          kind: 'sprite_variant',
          emotionTag: emoInp.value.trim(),
          clothesTag: clothesInp.value.trim(),
          poseTag: poseInp.value.trim(),
        });
      }, 'ls-btn-primary'),
    );
    composerCard.append(uploadRow);
    wrap.append(composerCard);

    // 1B. Saved Sprites Gallery for Active Character (Editable Tags + Save + Pin + Delete)
    const galleryCard = el('section', 'ls-card');
    const variants = activeChar.spriteVariants ?? [];
    const resolvedNow = resolveBestCharacterSprite(activeChar);

    const gHead = el('div', 'ls-row-between');
    gHead.append(
      el('h3', '', `🗂️ Saved Sprites for ${activeChar.name} (${variants.length + (activeChar.portraitUrl ? 1 : 0)})`),
      resolvedNow.url
        ? el('span', 'ls-chip ls-chip-accent', `✓ Active on Stage: ${resolvedNow.matchedLabel}`)
        : el('span', 'ls-chip', 'No sprite uploaded yet'),
    );
    galleryCard.append(gHead);

    const galleryGrid = el('div', 'ls-asset-gallery');

    if (activeChar.portraitUrl) {
      const baseBox = el('div', 'ls-asset-card');
      const thumb = el('div', 'ls-asset-thumb');
      const img = el('img');
      img.src = activeChar.portraitUrl;
      img.alt = `${activeChar.name} Base Sprite`;
      thumb.append(img);
      const meta = el('div', 'ls-stack');
      meta.style.gap = '6px';
      meta.append(
        el('strong', '', '⭐ Base / Fallback Sprite'),
        el('small', 'ls-muted', 'Used whenever no specific Emotion / Clothes / Pose variant matches.'),
        btn('🔄 Replace Base Sprite', () => ctrl.pickAndUploadImage(activeChar.id, 'portrait'), 'ls-btn-sm'),
      );
      baseBox.append(thumb, meta);
      galleryGrid.append(baseBox);
    }

    variants.forEach((v, idx) => {
      const box = el('div', 'ls-asset-card');
      if (v.pinned) box.style.borderColor = 'var(--ls-primary)';

      const thumb = el('div', 'ls-asset-thumb');
      const img = el('img');
      img.src = v.url;
      img.alt = v.label;
      thumb.append(img);

      const formCol = el('div', 'ls-stack');
      formCol.style.gap = '5px';

      const eInp = el('input', 'ls-input');
      eInp.style.minHeight = '28px';
      eInp.placeholder = 'Emotion tag (e.g. flustered)…';
      eInp.value = v.emotionTag;

      const cInp = el('input', 'ls-input');
      cInp.style.minHeight = '28px';
      cInp.placeholder = 'Clothes tag (e.g. saree, towel)…';
      cInp.value = v.clothesTag;

      const pInp = el('input', 'ls-input');
      pInp.style.minHeight = '28px';
      pInp.placeholder = 'Pose tag (e.g. mopping)…';
      pInp.value = v.poseTag;

      const actRow = el('div', 'ls-row');
      actRow.append(
        btn('💾 Save Tags', () => {
          const nextChars = structuredClone(state.characters);
          const list = nextChars[activeChar.id]?.spriteVariants;
          if (list && list[idx]) {
            list[idx]!.emotionTag = eInp.value.trim();
            list[idx]!.clothesTag = cInp.value.trim();
            list[idx]!.poseTag = pInp.value.trim();
            list[idx]!.label =
              [list[idx]!.emotionTag, list[idx]!.clothesTag, list[idx]!.poseTag]
                .filter(Boolean)
                .join(' · ') || 'Default';
            void ctrl.request('state:mutate', {
              stateOverride: { characters: nextChars },
              reason: `Updated sprite tags for ${activeChar.name}`,
            });
            ctrl.notify(`Saved tags for ${activeChar.name}'s sprite.`);
          }
        }, 'ls-btn-sm ls-btn-primary'),
        btn(
          v.pinned ? '📌 Pinned' : '📍 Pin',
          () => {
            const nextChars = structuredClone(state.characters);
            const list = nextChars[activeChar.id]?.spriteVariants ?? [];
            const willPin = !v.pinned;
            list.forEach((item, i) => {
              item.pinned = i === idx ? willPin : false;
            });
            void ctrl.request('state:mutate', {
              stateOverride: { characters: nextChars },
              reason: `${willPin ? 'Pinned' : 'Unpinned'} sprite for ${activeChar.name}`,
            });
          },
          `ls-btn-sm ${v.pinned ? 'ls-btn-primary' : ''}`,
        ),
        btn('🗑️', () => {
          const nextChars = structuredClone(state.characters);
          if (nextChars[activeChar.id]?.spriteVariants) {
            nextChars[activeChar.id]!.spriteVariants = nextChars[activeChar.id]!.spriteVariants!.filter(
              item => item.id !== v.id,
            );
            void ctrl.request('state:mutate', {
              stateOverride: { characters: nextChars },
              reason: `Removed sprite variant from ${activeChar.name}`,
            });
          }
        }, 'ls-btn-sm ls-btn-icon ls-btn-danger', 'Delete sprite variant'),
      );

      formCol.append(
        el('strong', '', v.label || 'Sprite Variant'),
        eInp,
        cInp,
        pInp,
        actRow,
      );
      box.append(thumb, formCol);
      galleryGrid.append(box);
    });

    if (galleryGrid.childElementCount === 0) {
      galleryCard.append(
        el('p', 'ls-muted', `No sprites uploaded for ${activeChar.name} yet. Use the form above to upload sprites for different emotions, outfits, and poses.`),
      );
    } else {
      galleryCard.append(galleryGrid);
    }
    wrap.append(galleryCard);
    return wrap;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // WORKSPACE 2: 🏞️ DISCOVERED LOCATIONS (TIME-OF-DAY & CUSTOM BACKDROPS)
  // ══════════════════════════════════════════════════════════════════════════
  const activePlace =
    (selectedStudioPlaceId ? state.places[selectedStudioPlaceId] : undefined) ??
    (state.currentPlaceId ? state.places[state.currentPlaceId] : undefined) ??
    places[0];

  const placeBar = el('div', 'ls-row-between');
  const placePills = el('div', 'ls-row');
  for (const p of places) {
    const count = (p.backdropVariants?.length ?? 0) || (p.backdropUrl ? 1 : 0);
    const b = btn(
      `${p.icon || '📍'} ${p.name}${p.id === state.currentPlaceId ? ' (Here)' : ''} (${count})`,
      () => {
        selectedStudioPlaceId = p.id;
        redraw();
      },
      'ls-btn-sm',
    );
    if (p.id === activePlace?.id) b.setAttribute('aria-current', 'page');
    placePills.append(b);
  }

  placeBar.append(
    placePills,
    btn('+ Add Location', () => {
      ctrl.modals.open({ title: '➕ Add Location to Atlas', width: 440 }, (mBody, close) => {
        const nameWrap = el('label', 'ls-label', 'Location Name');
        const nameInp = el('input', 'ls-input');
        nameWrap.append(nameInp);
        const descWrap = el('label', 'ls-label', 'Description');
        const descInp = el('input', 'ls-input');
        descWrap.append(descInp);
        const save = btn('➕ Create Location', () => {
          const name = nameInp.value.trim();
          if (!name) return;
          const id = slugifyKey(name, 'place');
          selectedStudioPlaceId = id;
          void ctrl.request('state:mutate', {
            patch: {
              places: [{ id, name, icon: '🏛️', description: descInp.value.trim() || 'Location' }],
            },
            reason: `Added location "${name}"`,
          });
          close();
        }, 'ls-btn-primary');
        mBody.append(nameWrap, descWrap, save);
      });
    }, 'ls-btn-sm ls-btn-primary'),
  );
  wrap.append(placeBar);

  if (!activePlace) {
    const empty = el('div', 'ls-card');
    empty.append(
      el('strong', '', 'No locations discovered yet'),
      el('p', 'ls-muted', 'Click "+ Add Location" above or sync a chat turn to start uploading backdrops.'),
    );
    wrap.append(empty);
    return wrap;
  }

  const curTimeSlot = inferTimeSlotFromScene(state);
  const resolvedBg = resolveBestPlaceBackdropUrl(activePlace, state);

  const locComposer = el('section', 'ls-card');
  const locHead = el('div', 'ls-row-between');
  locHead.append(
    el('h3', '', `${activePlace.icon || '📍'} ${activePlace.name} — Time-of-Day & Weather Backdrops`),
    el(
      'span',
      'ls-chip ls-chip-accent',
      `🕰️ Current Story Time: ${state.scene.timeLabel || formatStoryClock(state.elapsedMinutes)} (${curTimeSlot.toUpperCase()})`,
    ),
  );
  locComposer.append(
    locHead,
    el(
      'p',
      'ls-muted',
      'Upload backdrops for Morning, Day, Evening, Night, or a custom weather/scene state (e.g. "rainy", "steamy", "lights off"). The VN Stage automatically transitions to the matching backdrop as time passes!',
    ),
  );

  // Quick 1-Click Time-of-Day Slot Upload Buttons
  const slotGrid = el('div', 'ls-grid');
  const timeSlots: ReadonlyArray<{ slot: LocationTimeSlot; icon: string; label: string; sub: string }> = [
    { slot: 'default', icon: '🏞️', label: 'Default (Any Time)', sub: 'Fallback when no specific time slot is set' },
    { slot: 'morning', icon: '🌅', label: 'Morning / Dawn', sub: '05:00 AM – 10:59 AM' },
    { slot: 'day', icon: '☀️', label: 'Day / Afternoon', sub: '11:00 AM – 04:59 PM' },
    { slot: 'evening', icon: '🌇', label: 'Evening / Sunset', sub: '05:00 PM – 07:59 PM' },
    { slot: 'night', icon: '🌙', label: 'Night / Late Night', sub: '08:00 PM – 04:59 AM' },
  ];

  for (const ts of timeSlots) {
    const existingVar = (activePlace.backdropVariants ?? []).find(v => v.timeSlot === ts.slot);
    const fallbackDefaultUrl = ts.slot === 'default' ? activePlace.backdropUrl : undefined;
    const previewUrl = existingVar?.url || fallbackDefaultUrl || '';

    const cell = el('div', 'ls-asset-card');
    if (curTimeSlot === ts.slot || existingVar?.pinned) {
      cell.style.borderColor = 'var(--ls-primary)';
    }

    if (previewUrl) {
      const thumb = el('div', 'ls-asset-thumb');
      const img = el('img');
      img.src = previewUrl;
      img.alt = `${activePlace.name} ${ts.label}`;
      thumb.append(img);
      cell.append(thumb);
    }

    const info = el('div', 'ls-stack');
    info.style.gap = '4px';
    info.append(
      el('strong', '', `${ts.icon} ${ts.label}`),
      el('small', 'ls-muted', ts.sub),
    );

    const btnRow = el('div', 'ls-row');
    btnRow.append(
      btn(previewUrl ? '🔄 Replace Image' : '🖼️ Upload Image', () => {
        ctrl.uploadStageVariantAsset({
          targetId: activePlace.id,
          kind: 'backdrop_variant',
          timeSlot: ts.slot,
        });
      }, `ls-btn-sm ${previewUrl ? '' : 'ls-btn-primary'}`),
    );
    if (existingVar) {
      btnRow.append(
        btn(
          existingVar.pinned ? '📌 Pinned' : '📍 Pin',
          () => {
            const nextPlaces = structuredClone(state.places);
            const list = nextPlaces[activePlace.id]?.backdropVariants ?? [];
            const willPin = !existingVar.pinned;
            list.forEach(item => {
              item.pinned = item.id === existingVar.id ? willPin : false;
            });
            void ctrl.request('state:mutate', {
              stateOverride: { places: nextPlaces },
              reason: `${willPin ? 'Pinned' : 'Unpinned'} ${ts.label} backdrop for ${activePlace.name}`,
            });
          },
          `ls-btn-sm ${existingVar.pinned ? 'ls-btn-primary' : ''}`,
        ),
        btn('🗑️', () => {
          const nextPlaces = structuredClone(state.places);
          const pl = nextPlaces[activePlace.id];
          if (pl?.backdropVariants) {
            pl.backdropVariants = pl.backdropVariants.filter(item => item.id !== existingVar.id);
            if (ts.slot === 'default') pl.backdropUrl = undefined;
            void ctrl.request('state:mutate', {
              stateOverride: { places: nextPlaces },
              reason: `Removed ${ts.label} backdrop from ${activePlace.name}`,
            });
          }
        }, 'ls-btn-sm ls-btn-icon ls-btn-danger'),
      );
    }
    info.append(btnRow);
    cell.append(info);
    slotGrid.append(cell);
  }
  locComposer.append(slotGrid);

  // Custom Weather / Atmosphere Tag Backdrop Upload Row
  const customBox = el('div', 'ls-stat-cell');
  customBox.append(el('strong', '', '🏷️ Add Custom Time / Weather / State Backdrop Variant'));
  const customRow = el('div', 'ls-row');
  const tagInp = el('input', 'ls-input');
  tagInp.style.flex = '1';
  tagInp.placeholder = 'Enter custom condition tag (e.g. rainy, steamy, lights off, crowded)…';
  customRow.append(
    tagInp,
    btn('🖼️ Upload & Save Custom Variant', () => {
      const customTag = tagInp.value.trim();
      if (!customTag) {
        ctrl.notify('Enter a custom tag (e.g. "rainy" or "steamy") before uploading.', true);
        return;
      }
      ctrl.uploadStageVariantAsset({
        targetId: activePlace.id,
        kind: 'backdrop_variant',
        timeSlot: 'custom',
        customTag,
      });
    }, 'ls-btn-primary'),
  );
  customBox.append(customRow);

  const customVariants = (activePlace.backdropVariants ?? []).filter(v => v.timeSlot === 'custom');
  if (customVariants.length > 0) {
    const customGallery = el('div', 'ls-asset-gallery');
    customGallery.style.marginTop = '8px';
    for (const cv of customVariants) {
      const cCard = el('div', 'ls-asset-card');
      const thumb = el('div', 'ls-asset-thumb');
      const img = el('img');
      img.src = cv.url;
      img.alt = cv.customTag;
      thumb.append(img);
      const cMeta = el('div', 'ls-row-between');
      cMeta.append(
        el('strong', '', `🏷️ ${cv.customTag}`),
        el('div', 'ls-row'),
      );
      (cMeta.lastElementChild as HTMLElement).append(
        btn(cv.pinned ? '📌 Pinned' : '📍 Pin', () => {
          const nextPlaces = structuredClone(state.places);
          const list = nextPlaces[activePlace.id]?.backdropVariants ?? [];
          const willPin = !cv.pinned;
          list.forEach(item => {
            item.pinned = item.id === cv.id ? willPin : false;
          });
          void ctrl.request('state:mutate', {
            stateOverride: { places: nextPlaces },
            reason: `Pinned "${cv.customTag}" backdrop for ${activePlace.name}`,
          });
        }, `ls-btn-sm ${cv.pinned ? 'ls-btn-primary' : ''}`),
        btn('🗑️', () => {
          const nextPlaces = structuredClone(state.places);
          const pl = nextPlaces[activePlace.id];
          if (pl?.backdropVariants) {
            pl.backdropVariants = pl.backdropVariants.filter(item => item.id !== cv.id);
            void ctrl.request('state:mutate', {
              stateOverride: { places: nextPlaces },
              reason: `Removed "${cv.customTag}" backdrop`,
            });
          }
        }, 'ls-btn-sm ls-btn-icon ls-btn-danger'),
      );
      cCard.append(thumb, cMeta);
      customGallery.append(cCard);
    }
    customBox.append(customGallery);
  }

  locComposer.append(customBox);
  if (resolvedBg.url) {
    locComposer.append(
      el('small', 'ls-muted', `✓ Currently active backdrop for ${activePlace.name}: ${resolvedBg.matchedLabel}`),
    );
  }
  wrap.append(locComposer);
  return wrap;
}
