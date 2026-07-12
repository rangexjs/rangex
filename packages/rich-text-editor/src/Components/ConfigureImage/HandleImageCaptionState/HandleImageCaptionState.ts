import {
	getImageCaption,
	getImageFigure,
	setImageCaptionEnabled,
	setImageCaptionPosition,
} from "../_Utilities";
import type { HandleImageCaptionStateParams } from "./HandleImageCaptionState-types";

/**
 * Wires the popover's caption toggle and position controls to the engine. Reads the
 * active image from the shared {@link BlockPopoverAppearanceHandler} — set whenever the
 * popover opens over a new block.
 */
export const handleImageCaptionState = ({
	richTextEditorUI,
	editorAPI,
	getCurrentBlock,
}: HandleImageCaptionStateParams) => {
	const { imageEditPopover } = richTextEditorUI;

	const unsubscribeCaptionEnabledChange =
		imageEditPopover.onCaptionEnabledChange((enabled) => {
			const currentBlock = getCurrentBlock();

			if (!currentBlock) {
				return;
			}

			const figure = getImageFigure({ blockNestedContext: currentBlock });

			setImageCaptionEnabled({ figure, enabled });
			imageEditPopover.updateState({ caption: getImageCaption({ figure }) });

			const snapshotTimeline = editorAPI.getSnapshotTimeline();

			snapshotTimeline.registerSnapshotBoundary();
		});

	const unsubscribeCaptionPositionChange =
		imageEditPopover.onCaptionPositionChange((position) => {
			const currentBlock = getCurrentBlock();

			if (!currentBlock) {
				return;
			}

			const figure = getImageFigure({ blockNestedContext: currentBlock });

			setImageCaptionPosition({ figure, position });
			imageEditPopover.updateState({ caption: getImageCaption({ figure }) });

			const snapshotTimeline = editorAPI.getSnapshotTimeline();

			snapshotTimeline.registerSnapshotBoundary();
		});

	return () => {
		unsubscribeCaptionEnabledChange();
		unsubscribeCaptionPositionChange();
	};
};
