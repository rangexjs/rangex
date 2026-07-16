import { getVideoElement, getVideoFigure, setVideoPoster } from "../_Utilities";
import type { HandleVideoPosterStateParams } from "./HandleVideoPosterState-types";

/**
 * Wires the popover's poster control to the engine. Reads the active video from the
 * shared {@link BlockPopoverAppearanceHandler} — set whenever the popover opens over a new block.
 */
export const handleVideoPosterState = ({
	richTextEditorUI,
	editorAPI,
	getCurrentBlock,
}: HandleVideoPosterStateParams) => {
	const { videoEditPopover } = richTextEditorUI;

	const unsubscribePosterChange = videoEditPopover.onPosterChange((poster) => {
		const currentBlock = getCurrentBlock();

		if (!currentBlock) {
			return;
		}

		const figure = getVideoFigure({ blockNestedContext: currentBlock });
		const video = getVideoElement({ figure });

		setVideoPoster({ video, poster });
		videoEditPopover.updateState({ poster });

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});

	return () => {
		unsubscribePosterChange();
	};
};
