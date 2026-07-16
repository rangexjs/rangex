import { getVideoElement, getVideoFigure, setVideoTitle } from "../_Utilities";
import type { HandleVideoTitleStateParams } from "./HandleVideoTitleState-types";

/**
 * Wires the popover's title control to the engine. Reads the active video from the
 * shared {@link BlockPopoverAppearanceHandler} — set whenever the popover opens over a new block.
 */
export const handleVideoTitleState = ({
	richTextEditorUI,
	editorAPI,
	getCurrentBlock,
}: HandleVideoTitleStateParams) => {
	const { videoEditPopover } = richTextEditorUI;

	const unsubscribeTitleChange = videoEditPopover.onTitleChange((title) => {
		const currentBlock = getCurrentBlock();

		if (!currentBlock) {
			return;
		}

		const figure = getVideoFigure({ blockNestedContext: currentBlock });
		const video = getVideoElement({ figure });

		setVideoTitle({ video, title });
		videoEditPopover.updateState({ title });

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});

	return () => {
		unsubscribeTitleChange();
	};
};
