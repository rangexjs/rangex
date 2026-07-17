import { componentsName } from "../../../Constants";
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
import type { HandleVideoPopoverAppearanceParams } from "./HandleVideoPopoverAppearance-types";

/**
 * Registers the video popover with the shared {@link BlockPopoverAppearanceHandler},
 * pushing the block's current alignment into the popover just before it appears. Returns
 * the registration's `getCurrentBlock`, threaded to every other video handler that needs
 * to know which video block the popover is currently open over.
 */
export const handleVideoPopoverAppearance = ({
	richTextEditorUI,
	blockPopoverAppearanceHandler,
}: HandleVideoPopoverAppearanceParams) => {
	const { videoPopover } = richTextEditorUI;

	return blockPopoverAppearanceHandler.registerComponent({
		popover: videoPopover.popover,
		position: {
			margin: "4px",
			positionArea: "top right",
			top: "100%",
			right: "100%",
		},
		canShow({ blockNestedContext }) {
			return blockNestedContext.$$componentName === componentsName.video;
		},
		onShow({ blockNestedContext }) {
			const { $$parentElement } = blockNestedContext;

			if (!$$parentElement) {
				throw new Error("ParentElement not supposed to be null.");
			}

			const align = getBlockAlign({ blockNestedContextLine: $$parentElement });

			const figure = getVideoFigure({ blockNestedContext });
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

			videoPopover.updateState({
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
		},
	});
};
