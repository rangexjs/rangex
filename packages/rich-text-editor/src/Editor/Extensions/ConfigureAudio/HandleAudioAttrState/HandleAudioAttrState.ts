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
 * the appearance handler that registered it — set whenever the popover opens over a new block.
 */
export const handleAudioAttrState = ({
	editorPort,
	editorAPI,
	getCurrentBlock,
}: HandleAudioAttrStateParams) => {
	const unsubscribeAudioAttrChange = editorPort.onAudioAttrChange(
		({ title, controls, autoplay, loop, muted }) => {
			const currentBlock = getCurrentBlock();

			if (!currentBlock) {
				return;
			}

			const figure = getAudioFigure({ blockComponent: currentBlock });
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

			editorPort.updateState({
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
