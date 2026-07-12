import { componentsName } from "../../../Constants";
import { getVideoElement, getVideoFigure, setVideoTitle } from "../_Utilities";
import type { HandleVideoTitleStateParams } from "./HandleVideoTitleState-types";

/**
 * Wires the popover's title control to the engine. Reads the active video from the
 * shared {@link BlockPopoverAppearanceHandler} — set whenever the popover opens over a new block.
 */
export const handleVideoTitleState = ({
	richTextEditorUI,
	editorAPI,
	blockPopoverAppearanceHandler,
}: HandleVideoTitleStateParams) => {
	const { videoPopover } = richTextEditorUI;

	const unsubscribeTitleChange = videoPopover.onTitleChange((title) => {
		const currentBlock = blockPopoverAppearanceHandler.getCurrentBlock({
			componentName: componentsName.video,
		});

		if (!currentBlock) {
			return;
		}

		const figure = getVideoFigure({ blockNestedContext: currentBlock });
		const video = getVideoElement({ figure });

		setVideoTitle({ video, title });
		videoPopover.updateState({ title });

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});

	return () => {
		unsubscribeTitleChange();
	};
};
