import type {
	GetVideoLoopParams,
	GetVideoLoopResult,
	SetVideoLoopParams,
} from "./VideoLoop-types";

/**
 * `loop` is a native HTML boolean attribute on `<video>` — presence means true,
 * absence means false, the attribute value itself is meaningless.
 */
export const getVideoLoop = ({
	video,
}: GetVideoLoopParams): GetVideoLoopResult => video.hasAttribute("loop");

export const setVideoLoop = ({ video, loop }: SetVideoLoopParams) => {
	if (loop) {
		video.setAttribute("loop", "");
		return;
	}

	video.removeAttribute("loop");
};
