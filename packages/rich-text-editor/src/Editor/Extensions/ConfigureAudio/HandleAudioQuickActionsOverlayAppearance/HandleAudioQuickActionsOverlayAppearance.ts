import { componentsName } from "#ports";
import { getBlockAlign } from "../../_Utilities";
import {
	getAudioAutoplay,
	getAudioCaption,
	getAudioControls,
	getAudioElement,
	getAudioFigure,
	getAudioLoop,
	getAudioMuted,
	getAudioTitle,
} from "../_Utilities";
import type { HandleAudioQuickActionsOverlayAppearanceParams } from "./HandleAudioQuickActionsOverlayAppearance-types";

/**
 * Registers the audio overlay with {@link OverlayAppearanceHandler}, pushing the block's
 * current alignment into the overlay just before it appears. Returns the registration's
 * `getCurrentBlock`, threaded to every other audio handler that needs to know which audio
 * block the overlay is currently open over.
 */
export const handleAudioQuickActionsOverlayAppearance = ({
	editorPort,
	overlayAppearanceHandler,
	anchorController,
	swapAnchorController,
}: HandleAudioQuickActionsOverlayAppearanceParams) => {
	return overlayAppearanceHandler.registerComponent({
		popover: editorPort.quickActionsOverlay.element,
		extraElements: [editorPort.swapCardOverlay.element],
		position: {},
		shouldShow({ blockComponent }) {
			return blockComponent.$$componentName === componentsName.audio;
		},
		onShow({ blockComponent }) {
			const { $$parentElement } = blockComponent;

			if (!$$parentElement) {
				throw new Error("ParentElement not supposed to be null.");
			}

			const align = getBlockAlign({ blockComponentLine: $$parentElement });

			const figure = getAudioFigure({ blockComponent });
			const audio = getAudioElement({ figure });

			const caption = getAudioCaption({ figure });
			const title = getAudioTitle({ audio });
			const controls = getAudioControls({ audio });
			const autoplay = getAudioAutoplay({ audio });
			const loop = getAudioLoop({ audio });
			const muted = getAudioMuted({ audio });

			editorPort.updateState({
				align,
				caption,
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
