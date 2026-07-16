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
import type { HandleAudioEditPopoverAppearanceParams } from "./HandleAudioEditPopoverAppearance-types";

/**
 * Registers the audio edit popover with the shared {@link BlockPopoverAppearanceHandler},
 * pushing the block's current alignment into the popover just before it appears. Returns
 * the registration's `getCurrentBlock`, threaded to every other audio handler that needs
 * to know which audio block the popover is currently open over.
 */
export const handleAudioEditPopoverAppearance = ({
	richTextEditorUI,
	blockPopoverAppearanceHandler,
}: HandleAudioEditPopoverAppearanceParams) => {
	const { audioEditPopover } = richTextEditorUI;

	return blockPopoverAppearanceHandler.registerComponent({
		popover: audioEditPopover.popover,
		position: {
			margin: "4px",
			positionArea: "top right",
			top: "100%",
			right: "100%",
		},
		canShow({ blockNestedContext }) {
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

			audioEditPopover.updateState({
				align,
				caption,
				title,
				controls,
				autoplay,
				loop,
				muted,
			});
		},
	});
};
