import {
	getVideoElement,
	getVideoFigure,
	setVideoAspectRatio,
} from "../_Utilities";
import type { HandleVideoAspectRatioStateParams } from "./HandleVideoAspectRatioState-types";

/**
 * Wires the popover's aspect-ratio control to the engine. Reads the active video from the
 * shared {@link BlockPopoverAppearanceHandler} — set whenever the popover opens over a new block.
 */
export const handleVideoAspectRatioState = ({
	richTextEditorUI,
	editorAPI,
	getCurrentBlock,
}: HandleVideoAspectRatioStateParams) => {
	const { videoEditPopover } = richTextEditorUI;

	const unsubscribeAspectRatioChange = videoEditPopover.onAspectRatioChange(
		(aspectRatio) => {
			const currentBlock = getCurrentBlock();

			if (!currentBlock) {
				return;
			}

			const figure = getVideoFigure({ blockNestedContext: currentBlock });
			const video = getVideoElement({ figure });

			setVideoAspectRatio({ video, aspectRatio });
			videoEditPopover.updateState({ aspectRatio });

			const snapshotTimeline = editorAPI.getSnapshotTimeline();

			snapshotTimeline.registerSnapshotBoundary();
		},
	);

	return () => {
		unsubscribeAspectRatioChange();
	};
};
