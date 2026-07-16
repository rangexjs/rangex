import {
	getAudioElement,
	getAudioFigure,
	setAudioAutoplay,
	setAudioControls,
	setAudioLoop,
	setAudioMuted,
	setAudioTitle,
} from "../_Utilities";
import type { HandleAudioAttrStateParams } from "./HandleAudioAttrState-types";

/**
 * Wires the popover's audio attribute controls to the engine. Reads the active audio from
 * the shared {@link BlockPopoverAppearanceHandler} — set whenever the popover opens over a
 * new block.
 */
export const handleAudioAttrState = ({
	richTextEditorUI,
	editorAPI,
	getCurrentBlock,
}: HandleAudioAttrStateParams) => {
	const { audioEditPopover } = richTextEditorUI;

	const unsubscribeAudioAttrChange = audioEditPopover.onAudioAttrChange(
		({ title, controls, autoplay, loop, muted }) => {
			const currentBlock = getCurrentBlock();

			if (!currentBlock) {
				return;
			}

			const figure = getAudioFigure({ blockNestedContext: currentBlock });
			const audio = getAudioElement({ figure });

			if (title !== undefined) {
				setAudioTitle({ audio, title });
			}

			if (controls !== undefined) {
				setAudioControls({ audio, controls });
			}

			if (autoplay !== undefined) {
				setAudioAutoplay({ audio, autoplay });
			}

			if (loop !== undefined) {
				setAudioLoop({ audio, loop });
			}

			if (muted !== undefined) {
				setAudioMuted({ audio, muted });
			}

			audioEditPopover.updateState({
				title,
				controls,
				autoplay,
				loop,
				muted,
			});

			const snapshotTimeline = editorAPI.getSnapshotTimeline();

			snapshotTimeline.registerSnapshotBoundary();
		},
	);

	return () => {
		unsubscribeAudioAttrChange();
	};
};
