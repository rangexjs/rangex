import { componentsName } from "../../../Constants";
import {
	getImageFigure,
	getImageImg,
	setImageAspectRatio,
} from "../_Utilities";
import type { HandleImageAspectRatioStateParams } from "./HandleImageAspectRatioState-types";

/**
 * Wires the popover's aspect-ratio control to the engine. Reads the active image from the
 * shared {@link BlockPopoverAppearanceHandler} — set whenever the popover opens over a new block.
 */
export const handleImageAspectRatioState = ({
	richTextEditorUI,
	editorAPI,
	blockPopoverAppearanceHandler,
}: HandleImageAspectRatioStateParams) => {
	const { imagePopover } = richTextEditorUI;

	const unsubscribeAspectRatioChange = imagePopover.onAspectRatioChange(
		(aspectRatio) => {
			const currentBlock = blockPopoverAppearanceHandler.getCurrentBlock({
				componentName: componentsName.image,
			});

			if (!currentBlock) {
				return;
			}

			const figure = getImageFigure({ blockNestedContext: currentBlock });
			const img = getImageImg({ figure });

			setImageAspectRatio({ img, aspectRatio });
			imagePopover.updateState({ aspectRatio });

			const snapshotTimeline = editorAPI.getSnapshotTimeline();

			snapshotTimeline.registerSnapshotBoundary();
		},
	);

	return () => {
		unsubscribeAspectRatioChange();
	};
};
