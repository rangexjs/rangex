import { componentsName } from "../../../Constants";
import { getImageFigure, getImageImg, setImageAlt } from "../_Utilities";
import type { HandleImageAltTextStateParams } from "./HandleImageAltTextState-types";

/**
 * Wires the popover's alt text control to the engine. Reads the active image from the
 * shared {@link BlockPopoverAppearanceHandler} — set whenever the popover opens over a new block.
 */
export const handleImageAltTextState = ({
	richTextEditorUI,
	editorAPI,
	blockPopoverAppearanceHandler,
}: HandleImageAltTextStateParams) => {
	const { imagePopover } = richTextEditorUI;

	const unsubscribeAltTextChange = imagePopover.onAltTextChange((altText) => {
		const currentBlock = blockPopoverAppearanceHandler.getCurrentBlock({
			componentName: componentsName.image,
		});

		if (!currentBlock) {
			return;
		}

		const figure = getImageFigure({ blockNestedContext: currentBlock });
		const img = getImageImg({ figure });

		setImageAlt({ img, alt: altText });
		imagePopover.updateState({ altText });

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});

	return () => {
		unsubscribeAltTextChange();
	};
};
