import {
	getVideoElement,
	getVideoFigure,
	setVideoAspectRatio,
	setVideoAutoplay,
	setVideoControls,
	setVideoLoop,
	setVideoMuted,
	setVideoObjectFit,
	setVideoPoster,
	setVideoTitle,
} from "../_Utilities";
import type { HandleVideoAttrStateParams } from "./HandleVideoAttrState-types";

/**
 * Wires the popover's video attribute controls to the engine. Reads the active video from
 * the shared {@link BlockPopoverAppearanceHandler} — set whenever the popover opens over a
 * new block.
 */
export const handleVideoAttrState = ({
	richTextEditorUI,
	editorAPI,
	getCurrentBlock,
}: HandleVideoAttrStateParams) => {
	const { videoEditPopover } = richTextEditorUI;

	const unsubscribeVideoAttrChange = videoEditPopover.onVideoAttrChange(
		({
			objectFit,
			aspectRatio,
			title,
			poster,
			controls,
			autoplay,
			loop,
			muted,
		}) => {
			const currentBlock = getCurrentBlock();

			if (!currentBlock) {
				return;
			}

			const figure = getVideoFigure({ blockNestedContext: currentBlock });
			const video = getVideoElement({ figure });

			if (objectFit !== undefined) {
				setVideoObjectFit({ video, objectFit });
			}

			if (aspectRatio !== undefined) {
				setVideoAspectRatio({ video, aspectRatio });
			}

			if (title !== undefined) {
				setVideoTitle({ video, title });
			}

			if (poster !== undefined) {
				setVideoPoster({ video, poster });
			}

			if (controls !== undefined) {
				setVideoControls({ video, controls });
			}

			if (autoplay !== undefined) {
				setVideoAutoplay({ video, autoplay });
			}

			if (loop !== undefined) {
				setVideoLoop({ video, loop });
			}

			if (muted !== undefined) {
				setVideoMuted({ video, muted });
			}

			videoEditPopover.updateState({
				objectFit,
				aspectRatio,
				title,
				poster,
				controls,
				autoplay,
				loop,
				muted,
			});

			const snapshotTimeline = editorAPI.getSnapshotTimeline();

			snapshotTimeline.registerSnapshotBoundary();
		},
	);

	return () => {
		unsubscribeVideoAttrChange();
	};
};
