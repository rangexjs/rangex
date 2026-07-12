import {
	getImageFigure,
	getImageImg,
	setImageAlt,
	setImageAspectRatio,
	setImageObjectFit,
} from "../_Utilities";
import type { HandleImageAttrStateParams } from "./HandleImageAttrState-types";

/**
 * Wires the popover's image attribute controls to the engine. Reads the active image from
 * the shared {@link BlockPopoverAppearanceHandler} — set whenever the popover opens over a
 * new block.
 */
export const handleImageAttrState = ({
	richTextEditorUI,
	editorAPI,
	getCurrentBlock,
}: HandleImageAttrStateParams) => {
	const { imageEditPopover } = richTextEditorUI;

	const unsubscribeImageAttrChange = imageEditPopover.onImageAttrChange(
		({ objectFit, aspectRatio, altText }) => {
			const currentBlock = getCurrentBlock();

			if (!currentBlock) {
				return;
			}

			const figure = getImageFigure({ blockNestedContext: currentBlock });
			const img = getImageImg({ figure });

			if (objectFit !== undefined) {
				setImageObjectFit({ img, objectFit });
			}

			if (aspectRatio !== undefined) {
				setImageAspectRatio({ img, aspectRatio });
			}

			if (altText !== undefined) {
				setImageAlt({ img, alt: altText });
			}

			imageEditPopover.updateState({ objectFit, aspectRatio, altText });

			const snapshotTimeline = editorAPI.getSnapshotTimeline();

			snapshotTimeline.registerSnapshotBoundary();
		},
	);

	return () => {
		unsubscribeImageAttrChange();
	};
};
