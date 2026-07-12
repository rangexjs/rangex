import { componentsName } from "../../../Constants";
import { getBlockAlign } from "../../_Utilities";
import {
	getImageAlt,
	getImageAspectRatio,
	getImageCaption,
	getImageFigure,
	getImageImg,
	getImageObjectFit,
	isImageEmpty,
} from "../_Utilities";
import type { HandleImageEditPopoverAppearanceParams } from "./HandleImageEditPopoverAppearance-types";

/**
 * Registers the image edit popover with the shared {@link BlockPopoverAppearanceHandler},
 * pushing the block's current alignment into the popover just before it appears. Returns
 * the registration's `getCurrentBlock`, threaded to every other image handler that needs
 * to know which image block the popover is currently open over.
 */
export const handleImageEditPopoverAppearance = ({
	richTextEditorUI,
	blockPopoverAppearanceHandler,
}: HandleImageEditPopoverAppearanceParams) => {
	const { imageEditPopover } = richTextEditorUI;

	return blockPopoverAppearanceHandler.registerComponent({
		popover: imageEditPopover.popover,
		position: {
			margin: "4px",
			positionArea: "top right",
			top: "100%",
			right: "100%",
		},
		canShow({ blockNestedContext }) {
			if (blockNestedContext.$$componentName !== componentsName.image) {
				return false;
			}

			// Empty images have no editable state to show — keep the popover closed.
			// Also strips any flex-basis left over from a resize.
			const figure = getImageFigure({ blockNestedContext });

			if (isImageEmpty({ figure })) {
				blockNestedContext.style.removeProperty("flex-basis");
				return false;
			}

			return true;
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

			imageEditPopover.updateState({
				align,
				objectFit,
				aspectRatio,
				caption,
				altText,
			});
		},
	});
};
