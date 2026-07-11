import { componentsName } from "../../../Constants";
import { getImageFigure, getImageImg, setImageObjectFit } from "../_Utilities";
import type { HandleImageObjectFitStateParams } from "./HandleImageObjectFitState-types";

/**
 * Wires the popover's object-fit control to the engine. Reads the active image from the
 * shared {@link BlockPopoverAppearanceHandler} — set whenever the popover opens over a new block.
 */
export const handleImageObjectFitState = ({
	richTextEditorUI,
	editorAPI,
	blockPopoverAppearanceHandler,
}: HandleImageObjectFitStateParams) => {
	const { imagePopover } = richTextEditorUI;

	const unsubscribeObjectFitChange = imagePopover.onObjectFitChange(
		(objectFit) => {
			const currentBlock = blockPopoverAppearanceHandler.getCurrentBlock({
				componentName: componentsName.image,
			});

			if (!currentBlock) {
				return;
			}

			const figure = getImageFigure({ blockNestedContext: currentBlock });
			const img = getImageImg({ figure });

			setImageObjectFit({ img, objectFit });
			imagePopover.updateState({ objectFit });

			const snapshotTimeline = editorAPI.getSnapshotTimeline();

			snapshotTimeline.registerSnapshotBoundary();
		},
	);

	return () => {
		unsubscribeObjectFitChange();
	};
};
