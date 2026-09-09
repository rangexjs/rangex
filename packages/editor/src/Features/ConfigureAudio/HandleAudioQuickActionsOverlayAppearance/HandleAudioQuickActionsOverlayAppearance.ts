import { componentsName } from "#engine-links";
import { getBlockAlign } from "../../_Utilities";
import { getAudioCaption, getAudioFigure } from "../_Utilities";
import type { HandleAudioQuickActionsOverlayAppearanceParams } from "./HandleAudioQuickActionsOverlayAppearance-types";

/**
 * Registers the audio overlay with {@link OverlayAppearanceHandler}, pushing the block's
 * current alignment into the overlay just before it appears. Returns the registration's
 * `getCurrentBlock`, threaded to every other audio handler that needs to know which audio
 * block the overlay is currently open over.
 */
export const handleAudioQuickActionsOverlayAppearance = ({
	configPort,
	overlayAppearanceHandler,
	anchorController,
}: HandleAudioQuickActionsOverlayAppearanceParams) => {
	return overlayAppearanceHandler.registerComponent({
		popover: anchorController.element,
		shouldShow({ blockComponent }) {
			return blockComponent.$$componentName === componentsName.audio;
		},
		onShow({ blockComponent }) {
			anchorController.hide();

			const { $$parentElement } = blockComponent;

			if (!$$parentElement) {
				throw new Error("ParentElement not supposed to be null.");
			}

			const align = getBlockAlign({ blockComponentLine: $$parentElement });

			const figure = getAudioFigure({ blockComponent });

			const caption = getAudioCaption({ figure });

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
