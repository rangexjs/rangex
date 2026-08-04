import { componentsName } from "#ports";
import { getBlockAlign } from "../../_Utilities";
import {
	getVideoAspectRatio,
	getVideoAutoplay,
	getVideoCaption,
	getVideoControls,
	getVideoElement,
	getVideoFigure,
	getVideoLoop,
	getVideoMuted,
	getVideoObjectFit,
	getVideoPoster,
	getVideoTitle,
} from "../_Utilities";
import type { HandleVideoQuickActionsOverlayAppearanceParams } from "./HandleVideoQuickActionsOverlayAppearance-types";

/**
 * Registers the video overlay with {@link OverlayAppearanceHandler}, pushing the block's
 * current alignment into the overlay just before it appears. Returns the registration's
 * `getCurrentBlock`, threaded to every other video handler that needs to know which video
 * block the overlay is currently open over.
 */
export const handleVideoQuickActionsOverlayAppearance = ({
	editorPort,
	overlayAppearanceHandler,
	anchorController,
	swapAnchorController,
}: HandleVideoQuickActionsOverlayAppearanceParams) => {
	return overlayAppearanceHandler.registerComponent({
		popover: editorPort.quickActionsOverlay.element,
		extraElements: [editorPort.swapCardOverlay.element],
		position: {},
		shouldShow({ blockComponent }) {
			return blockComponent.$$componentName === componentsName.video;
		},
		onShow({ blockComponent }) {
			const { $$parentElement } = blockComponent;

			if (!$$parentElement) {
				throw new Error("ParentElement not supposed to be null.");
			}

			const align = getBlockAlign({ blockComponentLine: $$parentElement });

			const figure = getVideoFigure({ blockComponent });
			const video = getVideoElement({ figure });

			const objectFit = getVideoObjectFit({ video });
			const aspectRatio = getVideoAspectRatio({ video });
			const caption = getVideoCaption({ figure });
			const poster = getVideoPoster({ video });
			const title = getVideoTitle({ video });
			const controls = getVideoControls({ video });
			const autoplay = getVideoAutoplay({ video });
			const loop = getVideoLoop({ video });
			const muted = getVideoMuted({ video });

			editorPort.updateState({
				align,
				objectFit,
				aspectRatio,
				caption,
				poster,
				title,
				controls,
				autoplay,
				loop,
				muted,
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
