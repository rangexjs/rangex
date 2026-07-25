import type {
	GetVideoControlsParams,
	GetVideoControlsResult,
	SetVideoControlsParams,
} from "./VideoControls-types";

/**
 * `controls` is a native HTML boolean attribute on `<video>` — presence means true,
 * absence means false, the attribute value itself is meaningless.
 */
export const getVideoControls = ({
	video,
}: GetVideoControlsParams): GetVideoControlsResult =>
	video.hasAttribute("controls");

export const setVideoControls = ({
	video,
	controls,
}: SetVideoControlsParams) => {
	if (controls) {
		video.setAttribute("controls", "");
		return;
	}

	video.removeAttribute("controls");
};
