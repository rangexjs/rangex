import {
	getVideoElement,
	getVideoFigure,
	getVideoPlayback,
	setVideoPlayback,
} from "../_Utilities";
import type { HandleVideoPlaybackStateParams } from "./HandleVideoPlaybackState-types";

/**
 * Wires the popover's playback controls (controls/autoplay/loop/muted) to the engine.
 * The popover only ever emits a partial patch (e.g. turning on autoplay also forces
 * muted, since browsers block unmuted autoplay) — this merges it onto the video's
 * current state before writing it back to the DOM.
 */
export const handleVideoPlaybackState = ({
	richTextEditorUI,
	editorAPI,
	getCurrentBlock,
}: HandleVideoPlaybackStateParams) => {
	const { videoPopover } = richTextEditorUI;

	const unsubscribePlaybackChange = videoPopover.onPlaybackChange((patch) => {
		const currentBlock = getCurrentBlock();

		if (!currentBlock) {
			return;
		}

		const figure = getVideoFigure({ blockNestedContext: currentBlock });
		const video = getVideoElement({ figure });

		const playback = { ...getVideoPlayback({ video }), ...patch };

		setVideoPlayback({ video, playback });
		videoPopover.updateState({ playback: getVideoPlayback({ video }) });

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});

	return () => {
		unsubscribePlaybackChange();
	};
};
