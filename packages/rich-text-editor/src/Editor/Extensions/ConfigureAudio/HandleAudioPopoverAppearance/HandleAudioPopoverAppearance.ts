import { componentsName } from "../../../Constants";
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
import type { HandleAudioPopoverAppearanceParams } from "./HandleAudioPopoverAppearance-types";

/**
 * Registers the audio popover with {@link OverlayAppearanceHandler}, pushing the block's
 * current alignment into the popover just before it appears. Returns the registration's
 * `getCurrentBlock`, threaded to every other audio handler that needs to know which audio
 * block the popover is currently open over.
 */
export const handleAudioPopoverAppearance = ({
	editorPort,
	overlayAppearanceHandler,
}: HandleAudioPopoverAppearanceParams) => {
	return overlayAppearanceHandler.registerComponent({
		popover: editorPort.popover.element,
		position: {
			margin: "4px",
			positionArea: "top right",
			top: "100%",
			right: "100%",
		},
		shouldShow({ blockNestedContext }) {
			return blockNestedContext.$$componentName === componentsName.audio;
		},
		onShow({ blockNestedContext }) {
			const { $$parentElement } = blockNestedContext;

			if (!$$parentElement) {
				throw new Error("ParentElement not supposed to be null.");
			}

			const align = getBlockAlign({ blockNestedContextLine: $$parentElement });

			const figure = getAudioFigure({ blockNestedContext });
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

			editorPort.popover.element.hidePopover();
			editorPort.popover.element.showPopover({ source: blockNestedContext });
		},
		onClose() {
			editorPort.popover.element.hidePopover();
		},
	});
};
