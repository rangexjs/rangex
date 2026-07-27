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
 * Registers the image popover with {@link OverlayAppearanceHandler}, pushing the block's
 * current alignment into the popover just before it appears. Returns the registration's
 * `getCurrentBlock`, threaded to every other image handler that needs to know which image
 * block the popover is currently open over.
 */
export const handleImagePopoverAppearance = ({
	editorPort,
	overlayAppearanceHandler,
}: HandleImagePopoverAppearanceParams) => {
	return overlayAppearanceHandler.registerComponent({
		popover: editorPort.popover.element,
		position: {
			margin: "4px",
			positionArea: "top right",
			top: "100%",
			right: "100%",
		},
		shouldShow({ blockNestedContext }) {
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

			editorPort.updateState({
				align,
				objectFit,
				aspectRatio,
				caption,
				altText,
			});

			editorPort.popover.element.hidePopover();
			editorPort.popover.element.showPopover({ source: blockNestedContext });
		},
		onClose() {
			editorPort.popover.element.hidePopover();
		},
	});
};
