import { componentsName } from "#ports";
import { getBlockAlign } from "../../_Utilities";
import {
	getImageAlt,
	getImageAspectRatio,
	getImageCaption,
	getImageFigure,
	getImageImg,
	getImageObjectFit,
} from "../_Utilities";
import type { HandleImageQuickActionsOverlayAppearanceParams } from "./HandleImageQuickActionsOverlayAppearance-types";

/**
 * Registers the image overlay with {@link OverlayAppearanceHandler}, pushing the block's
 * current alignment into the overlay just before it appears. Returns the registration's
 * `getCurrentBlock`, threaded to every other image handler that needs to know which image
 * block the overlay is currently open over.
 */
export const handleImageQuickActionsOverlayAppearance = ({
	editorPort,
	overlayAppearanceHandler,
	anchorController,
	swapAnchorController,
}: HandleImageQuickActionsOverlayAppearanceParams) => {
	return overlayAppearanceHandler.registerComponent({
		popover: editorPort.quickActionsOverlay.element,
		extraElements: [editorPort.swapCardOverlay.element],
		shouldShow({ blockComponent }) {
			return blockComponent.$$componentName === componentsName.image;
		},
		onShow({ blockComponent }) {
			const { $$parentElement } = blockComponent;

			if (!$$parentElement) {
				throw new Error("ParentElement not supposed to be null.");
			}

			const align = getBlockAlign({ blockComponentLine: $$parentElement });

			const figure = getImageFigure({ blockComponent });
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

			anchorController.show(blockComponent, {
				clear: true,
				position: "absolute",
				top: "calc(anchor(top) + 4px)",
				right: "calc(anchor(right) + 4px)",
			});
		},
		onClose() {
			anchorController.hide();
			swapAnchorController.hide();
		},
	});
};
