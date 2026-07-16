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
	getCurrentBlock,
}: HandleVideoCaptionStateParams) => {
	const { videoEditPopover } = richTextEditorUI;

	const unsubscribeCaptionEnabledChange =
		videoEditPopover.onCaptionEnabledChange((enabled) => {
			const currentBlock = getCurrentBlock();

			if (!currentBlock) {
				return;
			}

			const figure = getVideoFigure({ blockNestedContext: currentBlock });

			setVideoCaptionEnabled({ figure, enabled });
			videoEditPopover.updateState({ caption: getVideoCaption({ figure }) });

			const snapshotTimeline = editorAPI.getSnapshotTimeline();

			snapshotTimeline.registerSnapshotBoundary();
		});

	const unsubscribeCaptionPositionChange =
		videoEditPopover.onCaptionPositionChange((position) => {
			const currentBlock = getCurrentBlock();

			if (!currentBlock) {
				return;
			}

			const figure = getVideoFigure({ blockNestedContext: currentBlock });

			setVideoCaptionPosition({ figure, position });
			videoEditPopover.updateState({ caption: getVideoCaption({ figure }) });

			const snapshotTimeline = editorAPI.getSnapshotTimeline();

			snapshotTimeline.registerSnapshotBoundary();
		});

	return () => {
		unsubscribeCaptionEnabledChange();
		unsubscribeCaptionPositionChange();
	};
};
