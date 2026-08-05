import { componentsName } from "#ports";
import { getBlockAlign } from "../../_Utilities";
import {
	getEmbedAspectRatio,
	getEmbedCaption,
	getEmbedFigure,
	getEmbedIframe,
	getEmbedTitle,
} from "../_Utilities";
import type { HandleEmbedQuickActionsOverlayAppearanceParams } from "./HandleEmbedQuickActionsOverlayAppearance-types";

/**
 * Registers the embed overlay with {@link OverlayAppearanceHandler}, pushing the block's
 * current alignment into the overlay just before it appears. Returns the registration's
 * `getCurrentBlock`, threaded to every other embed handler that needs to know which embed
 * block the overlay is currently open over.
 */
export const handleEmbedQuickActionsOverlayAppearance = ({
	editorPort,
	overlayAppearanceHandler,
	anchorController,
	swapAnchorController,
}: HandleEmbedQuickActionsOverlayAppearanceParams) => {
	return overlayAppearanceHandler.registerComponent({
		popover: editorPort.quickActionsOverlay.element,
		extraElements: [editorPort.swapCardOverlay.element],
		shouldShow({ blockComponent }) {
			return blockComponent.$$componentName === componentsName.embed;
		},
		onShow({ blockComponent }) {
			const { $$parentElement } = blockComponent;

			if (!$$parentElement) {
				throw new Error("ParentElement not supposed to be null.");
			}

			const align = getBlockAlign({ blockComponentLine: $$parentElement });

			const figure = getEmbedFigure({ blockComponent });
			const iframe = getEmbedIframe({ figure });

			const aspectRatio = getEmbedAspectRatio({ iframe });
			const caption = getEmbedCaption({ figure });
			const title = getEmbedTitle({ iframe });

			editorPort.updateState({
				align,
				aspectRatio,
				caption,
				title,
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
