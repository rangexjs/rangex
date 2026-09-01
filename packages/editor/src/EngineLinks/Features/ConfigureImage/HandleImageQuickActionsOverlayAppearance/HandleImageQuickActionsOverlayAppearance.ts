import { componentsName } from "../../../Constants";
import { getBlockAlign } from "../../_Utilities";
import { getImageCaption, getImageFigure } from "../_Utilities";
import type { HandleImageQuickActionsOverlayAppearanceParams } from "./HandleImageQuickActionsOverlayAppearance-types";

/**
 * Registers the image overlay with {@link OverlayAppearanceHandler}, pushing the block's
 * current alignment into the overlay just before it appears. Returns the registration's
 * `getCurrentBlock`, threaded to every other image handler that needs to know which image
 * block the overlay is currently open over.
 */
export const handleImageQuickActionsOverlayAppearance = ({
	configPort,
	overlayAppearanceHandler,
	anchorController,
}: HandleImageQuickActionsOverlayAppearanceParams) => {
	return overlayAppearanceHandler.registerComponent({
		popover: configPort.floatingEl,
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

			const caption = getImageCaption({ figure });

			configPort.updateState({ align, caption });

			anchorController.show(blockComponent, {
				clear: true,
				position: "absolute",
				top: "calc(anchor(top) + 4px)",
				right: "calc(anchor(right) + 4px)",
			});
		},
		onClose() {
			anchorController.hide();
		},
	});
};
