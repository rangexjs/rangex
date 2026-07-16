import type {
	GetVideoAutoplayParams,
	GetVideoAutoplayResult,
	SetVideoAutoplayParams,
} from "./VideoAutoplay-types";

/**
 * `autoplay` is a native HTML boolean attribute on `<video>` — presence means true,
 * absence means false, the attribute value itself is meaningless.
 */
export const getVideoAutoplay = ({
	video,
}: GetVideoAutoplayParams): GetVideoAutoplayResult =>
	video.hasAttribute("autoplay");

export const setVideoAutoplay = ({
	video,
	autoplay,
}: SetVideoAutoplayParams) => {
	if (autoplay) {
		video.setAttribute("autoplay", "");
		return;
	}

	video.removeAttribute("autoplay");
};
