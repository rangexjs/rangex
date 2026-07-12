import { componentsName } from "../../../Constants";
import {
	getVideoElement,
	getVideoFigure,
	setVideoObjectFit,
} from "../_Utilities";
import type { HandleVideoObjectFitStateParams } from "./HandleVideoObjectFitState-types";

/**
 * Wires the popover's object-fit control to the engine. Reads the active video from the
 * shared {@link BlockPopoverAppearanceHandler} — set whenever the popover opens over a new block.
 */
export const handleVideoObjectFitState = ({
	richTextEditorUI,
	editorAPI,
	blockPopoverAppearanceHandler,
}: HandleVideoObjectFitStateParams) => {
	const { videoPopover } = richTextEditorUI;

	const unsubscribeObjectFitChange = videoPopover.onObjectFitChange(
		(objectFit) => {
			const currentBlock = blockPopoverAppearanceHandler.getCurrentBlock({
				componentName: componentsName.video,
			});

			if (!currentBlock) {
				return;
			}

			const figure = getVideoFigure({ blockNestedContext: currentBlock });
			const video = getVideoElement({ figure });

			setVideoObjectFit({ video, objectFit });
			videoPopover.updateState({ objectFit });

			const snapshotTimeline = editorAPI.getSnapshotTimeline();

			snapshotTimeline.registerSnapshotBoundary();
		},
	);

	return () => {
		unsubscribeObjectFitChange();
	};
};
