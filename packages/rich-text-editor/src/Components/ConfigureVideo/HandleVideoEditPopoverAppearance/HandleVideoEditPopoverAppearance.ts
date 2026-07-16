import { componentsName } from "../../../Constants";
import { getBlockAlign } from "../../_Utilities";
import {
	getVideoAspectRatio,
	getVideoCaption,
	getVideoElement,
	getVideoFigure,
	getVideoObjectFit,
	getVideoPlayback,
	getVideoPoster,
	getVideoTitle,
} from "../_Utilities";
import type { HandleVideoEditPopoverAppearanceParams } from "./HandleVideoEditPopoverAppearance-types";

/**
 * Registers the video edit popover with the shared {@link BlockPopoverAppearanceHandler},
 * pushing the block's current alignment into the popover just before it appears. Returns
 * the registration's `getCurrentBlock`, threaded to every other video handler that needs
 * to know which video block the popover is currently open over.
 */
export const handleVideoEditPopoverAppearance = ({
	richTextEditorUI,
	blockPopoverAppearanceHandler,
}: HandleVideoEditPopoverAppearanceParams) => {
	const { videoEditPopover } = richTextEditorUI;

	return blockPopoverAppearanceHandler.registerComponent({
		popover: videoEditPopover.popover,
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
			const playback = getVideoPlayback({ video });
			const poster = getVideoPoster({ video });
			const title = getVideoTitle({ video });

			videoEditPopover.updateState({
				align,
				objectFit,
				aspectRatio,
				caption,
				playback,
				poster,
				title,
			});
		},
	});
};
