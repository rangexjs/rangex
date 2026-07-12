import { componentsName } from "../../../Constants";
import {
	getVideoCaption,
	getVideoFigure,
	setVideoCaptionEnabled,
	setVideoCaptionPosition,
} from "../_Utilities";
import type { HandleVideoCaptionStateParams } from "./HandleVideoCaptionState-types";

/**
 * Wires the popover's caption toggle and position controls to the engine. Reads the
 * active video from the shared {@link BlockPopoverAppearanceHandler} — set whenever the
 * popover opens over a new block.
 */
export const handleVideoCaptionState = ({
	richTextEditorUI,
	editorAPI,
	blockPopoverAppearanceHandler,
}: HandleVideoCaptionStateParams) => {
	const { videoPopover } = richTextEditorUI;

	const unsubscribeCaptionEnabledChange = videoPopover.onCaptionEnabledChange(
		(enabled) => {
			const currentBlock = blockPopoverAppearanceHandler.getCurrentBlock({
				componentName: componentsName.video,
			});

			if (!currentBlock) {
				return;
			}

			const figure = getVideoFigure({ blockNestedContext: currentBlock });

			setVideoCaptionEnabled({ figure, enabled });
			videoPopover.updateState({ caption: getVideoCaption({ figure }) });

			const snapshotTimeline = editorAPI.getSnapshotTimeline();

			snapshotTimeline.registerSnapshotBoundary();
		},
	);

	const unsubscribeCaptionPositionChange = videoPopover.onCaptionPositionChange(
		(position) => {
			const currentBlock = blockPopoverAppearanceHandler.getCurrentBlock({
				componentName: componentsName.video,
			});

			if (!currentBlock) {
				return;
			}

			const figure = getVideoFigure({ blockNestedContext: currentBlock });

			setVideoCaptionPosition({ figure, position });
			videoPopover.updateState({ caption: getVideoCaption({ figure }) });

			const snapshotTimeline = editorAPI.getSnapshotTimeline();

			snapshotTimeline.registerSnapshotBoundary();
		},
	);

	return () => {
		unsubscribeCaptionEnabledChange();
		unsubscribeCaptionPositionChange();
	};
};
