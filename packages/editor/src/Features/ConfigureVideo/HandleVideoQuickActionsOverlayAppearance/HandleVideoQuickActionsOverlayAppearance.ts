import { componentsName } from "#engine-links";
import { getBlockAlign } from "../../_Utilities";
import { getVideoCaption, getVideoFigure } from "../_Utilities";
import type { HandleVideoQuickActionsOverlayAppearanceParams } from "./HandleVideoQuickActionsOverlayAppearance-types";

/**
 * Registers the video overlay with {@link OverlayAppearanceHandler}, pushing the block's
 * current alignment into the overlay just before it appears. Returns the registration's
 * `getCurrentBlock`, threaded to every other video handler that needs to know which video
 * block the overlay is currently open over.
 */
export const handleVideoQuickActionsOverlayAppearance = ({
	configPort,
	overlayAppearanceHandler,
	anchorController,
}: HandleVideoQuickActionsOverlayAppearanceParams) => {
	return overlayAppearanceHandler.registerComponent({
		popover: anchorController.element,
		shouldShow({ blockComponent }) {
			return blockComponent.$$componentName === componentsName.video;
		},
		onShow({ blockComponent }) {
			anchorController.hide();

			const { $$parentElement } = blockComponent;

			if (!$$parentElement) {
				throw new Error("ParentElement not supposed to be null.");
			}

			const align = getBlockAlign({ blockComponentLine: $$parentElement });

			const figure = getVideoFigure({ blockComponent });

			const caption = getVideoCaption({ figure });

			configPort.setAlign(align);

			configPort.setCaption(caption);

			configPort.setCurrentBlock(blockComponent);

			anchorController.show(blockComponent, {
				clear: true,
				position: "absolute",
				top: "calc(anchor(top) + 4px)",
				right: "calc(anchor(right) + 4px)",
			});
		},
		onClose() {
			anchorController.hide();

			configPort.setCurrentBlock(null);
		},
	});
};
