import { componentsName } from "#engine-links";
import { getBlockAlign } from "../../_Utilities";
import { getEmbedCaption, getEmbedFigure } from "../_Utilities";
import type { HandleEmbedQuickActionsOverlayAppearanceParams } from "./HandleEmbedQuickActionsOverlayAppearance-types";

/**
 * Registers the embed overlay with {@link OverlayAppearanceHandler}, pushing the block's
 * current alignment into the overlay just before it appears. Returns the registration's
 * `getCurrentBlock`, threaded to every other embed handler that needs to know which embed
 * block the overlay is currently open over.
 */
export const handleEmbedQuickActionsOverlayAppearance = ({
	configPort,
	overlayAppearanceHandler,
	anchorController,
}: HandleEmbedQuickActionsOverlayAppearanceParams) => {
	return overlayAppearanceHandler.registerComponent({
		popover: anchorController.element,
		shouldShow({ blockComponent }) {
			return blockComponent.$$componentName === componentsName.embed;
		},
		onShow({ blockComponent }) {
			anchorController.hide();

			const { $$parentElement } = blockComponent;

			if (!$$parentElement) {
				throw new Error("ParentElement not supposed to be null.");
			}

			const align = getBlockAlign({ blockComponentLine: $$parentElement });

			const figure = getEmbedFigure({ blockComponent });

			const caption = getEmbedCaption({ figure });

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
