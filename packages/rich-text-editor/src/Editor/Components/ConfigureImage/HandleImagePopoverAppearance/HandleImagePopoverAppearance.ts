import { componentsName } from "../../../Constants";
import { getBlockAlign } from "../../_Utilities";
import {
	getImageAlt,
	getImageAspectRatio,
	getImageCaption,
	getImageFigure,
	getImageImg,
	getImageObjectFit,
} from "../_Utilities";
import type { HandleImagePopoverAppearanceParams } from "./HandleImagePopoverAppearance-types";

/**
 * Registers the image popover with the shared {@link BlockPopoverAppearanceHandler},
 * pushing the block's current alignment into the popover just before it appears. Returns
 * the registration's `getCurrentBlock`, threaded to every other image handler that needs
 * to know which image block the popover is currently open over.
 */
export const handleImagePopoverAppearance = ({
	richTextEditorUI,
	blockPopoverAppearanceHandler,
}: HandleImagePopoverAppearanceParams) => {
	const { imagePopover } = richTextEditorUI;

	return blockPopoverAppearanceHandler.registerComponent({
		popover: imagePopover.popover,
		position: {
			margin: "4px",
			positionArea: "top right",
			top: "100%",
			right: "100%",
		},
		canShow({ blockNestedContext }) {
			return blockNestedContext.$$componentName === componentsName.image;
		},
		onShow({ blockNestedContext }) {
			const { $$parentElement } = blockNestedContext;

			if (!$$parentElement) {
				throw new Error("ParentElement not supposed to be null.");
			}

			const align = getBlockAlign({ blockNestedContextLine: $$parentElement });

			const figure = getImageFigure({ blockNestedContext });
			const img = getImageImg({ figure });

			const objectFit = getImageObjectFit({ img });
			const aspectRatio = getImageAspectRatio({ img });
			const caption = getImageCaption({ figure });
			const altText = getImageAlt({ img });

			imagePopover.updateState({
				align,
				objectFit,
				aspectRatio,
				caption,
				altText,
			});
		},
	});
};
