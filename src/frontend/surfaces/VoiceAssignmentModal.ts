import type { CharacterTtsProfile, TtsReadMode } from '../../shared/types';
import {
  btn,
  el,
  mountThemedSelect,
  type LumiFrontendController,
} from '../controller';

/**
 * Opens the Multi-Voice Cast + Narrator TTS Voice Assignment & Caching Studio Modal.
 * Accessible from both the VN Stage AND any Character Dossier.
 */
export function openVoiceAssignmentModal(
  ctrl: LumiFrontendController,
  focusActorId?: string,
): void {
  ctrl.modals.open(
    {
      title: '🔊 Multi-Voice TTS Director — Cast & Narrator Voices',
      width: 680,
      maxHeight: 800,
    },
    (body, _close, handle, modalScope) => {
      const renderModal = async () => {
        modalScope.clear();
        body.replaceChildren(el('p', 'ls-muted', '⏳ Loading Lumiverse TTS connections & voice catalogs…'));
        const conns = await ctrl.tts.listConnections();
        const settings = ctrl.settings;
        const { state } = ctrl.snapshot;
        const actors = Object.values(state.characters);

        const defaultConnId =
          settings?.narratorConnectionId ||
          conns.find(c => c.is_default)?.id ||
          conns[0]?.id ||
          '';
        const defaultVoices = defaultConnId
          ? await ctrl.tts.listVoicesForConnection(defaultConnId)
          : [];

        body.replaceChildren();

        const topCard = el('section', 'ls-card');
        const headRow = el('div', 'ls-row-between');
        headRow.append(
          el('div', '', ''),
          el('span', 'ls-chip ls-chip-accent', `⚡ Cached Hits: ${ctrl.tts.cacheHitCount} (0 Tokens Re-billed)`),
        );
        (headRow.firstElementChild as HTMLElement).append(
          el('span', 'ls-kicker', '2-Tier Memory + IndexedDB Audio Cache'),
          el('h3', '', '🎙️ Narrator & Reading Mode (Token Saver)'),
        );
        topCard.append(headRow);

        const modeRow = el('div', 'ls-row');
        const curReadMode: TtsReadMode = settings?.ttsReadMode || 'dialogue_only';
        for (const [mId, mLbl] of [
          ['dialogue_only', '💬 Dialogue Only (Recommended — Saves ~65% TTS Tokens)'],
          ['narration_and_dialogue', '📖 Full Audiobook (Narrator + Character Voices)'],
          ['narration_only', '📜 Narration Only'],
        ] as const) {
          const b = btn(mLbl, () => {
            void ctrl.request('settings:update', { settings: { ttsReadMode: mId } }).then(() => {
              void renderModal();
            });
          }, 'ls-btn-sm');
          if (curReadMode === mId) b.setAttribute('aria-current', 'page');
          modeRow.append(b);
        }
        topCard.append(modeRow);

        if (!conns.length) {
          topCard.append(
            el(
              'p',
              'ls-muted',
              'No TTS connections found yet. Create a TTS connection in Lumiverse (Connections → TTS Connections, e.g. Kokoro, ElevenLabs, OpenAI, or Google) to enable voice synthesis.',
            ),
          );
          body.append(topCard);
          return;
        }

        const narGrid = el('div', 'ls-grid');
        const narConnWrap = el('div', 'ls-label', 'Narrator TTS Connection');
        const narConnSlot = el('div');
        narConnWrap.append(narConnSlot);

        const narVoiceWrap = el('label', 'ls-label', 'Narrator Voice ID');
        const narVoiceInp = el('input', 'ls-input');
        narVoiceInp.placeholder = defaultVoices[0]?.id || 'Default connection voice…';
        narVoiceInp.value = settings?.narratorVoiceId || '';
        narVoiceWrap.append(narVoiceInp);

        if (defaultVoices.length > 0) {
          const quickVoiceSlot = el('div');
          quickVoiceSlot.style.marginTop = '4px';
          narVoiceWrap.append(quickVoiceSlot);
          mountThemedSelect(ctrl, modalScope, quickVoiceSlot, {
            value: settings?.narratorVoiceId || '',
            placeholder: '— Pick from connection voices —',
            ariaLabel: 'Narrator Voice Catalog',
            options: [
              { value: '', label: '— Pick from connection voices —' },
              ...defaultVoices.map(v => ({ value: v.id, label: `${v.name} (${v.id})` })),
            ],
            onChange: nextVoice => {
              if (nextVoice) narVoiceInp.value = nextVoice;
            },
          });
        }

        mountThemedSelect(ctrl, modalScope, narConnSlot, {
          value: settings?.narratorConnectionId || '',
          ariaLabel: 'Narrator TTS Connection',
          options: [
            { value: '', label: 'Use Default Lumiverse TTS Connection' },
            ...conns.map(c => ({
              value: c.id,
              label: `${c.name} (${c.provider}${c.voice ? ` · ${c.voice}` : ''})`,
            })),
          ],
          onChange: nextId => {
            void ctrl.request('settings:update', {
              settings: { narratorConnectionId: nextId },
            }).then(() => void renderModal());
          },
        });

        narGrid.append(narConnWrap, narVoiceWrap);
        topCard.append(narGrid);

        const narActionRow = el('div', 'ls-row');
        narActionRow.append(
          btn('💾 Save Narrator Voice', () => {
            void ctrl.request('settings:update', {
              settings: { narratorVoiceId: narVoiceInp.value.trim() },
            });
            ctrl.notify('Saved Narrator TTS voice.');
          }, 'ls-btn-sm ls-btn-primary'),
          btn('▶ Test Narrator', () => {
            void ctrl.tts.playSegments([
              {
                kind: 'narration',
                text: `The scene unfolds in ${state.scene.location || 'the story'}.`,
                speakerName: 'Narrator',
                connectionId: settings?.narratorConnectionId || '',
                voiceId: narVoiceInp.value.trim(),
                speed: settings?.narratorSpeed || 1.0,
              },
            ]);
          }, 'ls-btn-sm'),
        );
        topCard.append(narActionRow);
        body.append(topCard);

        const castCard = el('section', 'ls-card');
        castCard.append(
          el('span', 'ls-kicker', 'Per-Character Voice Profiles'),
          el('h3', '', `👥 Cast Voices (${actors.length} Characters)`),
          el('p', 'ls-muted', 'Assign each character their own distinct voice and speed. Quoted lines spoken by that character automatically route to their voice.'),
        );

        if (!actors.length) {
          castCard.append(el('p', 'ls-muted', 'No characters in the cast yet.'));
        } else {
          const orderedActors = focusActorId
            ? [
                ...actors.filter(a => a.id === focusActorId),
                ...actors.filter(a => a.id !== focusActorId),
              ]
            : actors;

          for (const actor of orderedActors) {
            const cell = el('div', 'ls-stat-cell');
            if (actor.id === focusActorId) {
              cell.style.borderColor = 'var(--ls-primary)';
            }
            const curVoice: CharacterTtsProfile = actor.ttsVoice ?? {};
            const actorConnId = curVoice.connectionId || defaultConnId;
            const actorVoices = actorConnId
              ? await ctrl.tts.listVoicesForConnection(actorConnId)
              : defaultVoices;

            const top = el('div', 'ls-row-between');
            top.append(
              el('strong', '', `${actor.present ? '🟢' : '⚪'} ${actor.name} (${actor.roleSummary || 'Cast'})`),
              el('span', 'ls-chip ls-chip-accent', curVoice.voiceId ? `🔊 ${curVoice.voiceId}` : 'Default Voice'),
            );
            cell.append(top);

            const rowGrid = el('div', 'ls-grid');
            const cSlot = el('div');
            const vSlot = el('div');

            const vInp = el('input', 'ls-input');
            vInp.placeholder = 'Voice ID (or pick below)…';
            vInp.value = curVoice.voiceId || '';

            const vCtrl = mountThemedSelect(ctrl, modalScope, vSlot, {
              value: curVoice.voiceId || '',
              ariaLabel: `Voice for ${actor.name}`,
              options: [
                { value: '', label: '— Select Voice from Catalog —' },
                ...actorVoices.map(v => ({ value: v.id, label: `${v.name} (${v.id})` })),
              ],
              onChange: nextVoice => {
                if (nextVoice) vInp.value = nextVoice;
              },
            });

            const cCtrl = mountThemedSelect(ctrl, modalScope, cSlot, {
              value: curVoice.connectionId || '',
              ariaLabel: `TTS Connection for ${actor.name}`,
              options: [
                { value: '', label: 'Default TTS Connection' },
                ...conns.map(c => ({ value: c.id, label: `${c.name} (${c.provider})` })),
              ],
              onChange: async nextConnId => {
                const nextVoices = await ctrl.tts.listVoicesForConnection(nextConnId || defaultConnId);
                vCtrl.setOptions(
                  [
                    { value: '', label: '— Select Voice from Catalog —' },
                    ...nextVoices.map(v => ({ value: v.id, label: `${v.name} (${v.id})` })),
                  ],
                  '',
                );
              },
            });

            const spdInp = el('input', 'ls-input');
            spdInp.type = 'number';
            spdInp.min = '0.5';
            spdInp.max = '2.0';
            spdInp.step = '0.1';
            spdInp.value = String(curVoice.speed ?? 1.0);
            spdInp.title = 'Playback Speed (0.5x – 2.0x)';

            rowGrid.append(cSlot, vInp, vSlot, spdInp);
            cell.append(rowGrid);

            const btnRow = el('div', 'ls-row');
            btnRow.append(
              btn('💾 Save Voice', () => {
                const nextProfile: CharacterTtsProfile = {
                  connectionId: cCtrl.getValue() || undefined,
                  voiceId: vInp.value.trim() || undefined,
                  speed: Math.max(0.5, Math.min(2.0, Number(spdInp.value) || 1.0)),
                };
                const nextChars = structuredClone(state.characters);
                if (nextChars[actor.id]) {
                  nextChars[actor.id]!.ttsVoice = nextProfile;
                  void ctrl.request('state:mutate', {
                    stateOverride: { characters: nextChars },
                    reason: `Updated TTS voice for ${actor.name}`,
                  }).then(() => void renderModal());
                }
              }, 'ls-btn-sm ls-btn-primary'),
              btn('▶ Test Voice', () => {
                const sampleLine =
                  actor.innerThought ||
                  `Hello, I am ${actor.name}.`;
                void ctrl.tts.playSegments([
                  {
                    kind: 'dialogue',
                    text: sampleLine,
                    speakerName: actor.name,
                    actorId: actor.id,
                    connectionId: cCtrl.getValue() || undefined,
                    voiceId: vInp.value.trim() || undefined,
                    speed: Math.max(0.5, Math.min(2.0, Number(spdInp.value) || 1.0)),
                  },
                ]);
              }, 'ls-btn-sm'),
            );
            cell.append(btnRow);
            castCard.append(cell);
          }
        }
        body.append(castCard);
      };

      void renderModal();
      handle.onDismiss(() => ctrl.tts.stop());
    },
  );
}
