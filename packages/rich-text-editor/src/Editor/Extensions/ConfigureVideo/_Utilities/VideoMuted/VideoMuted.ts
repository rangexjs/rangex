import type {
	GetVideoMutedParams,
	GetVideoMutedResult,
	SetVideoMutedParams,
} from "./VideoMuted-types";

/**
 * `muted` is a native HTML boolean attribute on `<video>` — presence means true,
 * absence means false, the attribute value itself is meaningless.
 */
export const getVideoMuted = ({
	video,
}: GetVideoMutedParams): GetVideoMutedResult => video.hasAttribute("muted");

export const setVideoMuted = ({ video, muted }: SetVideoMutedParams) => {
	if (muted) {
		video.setAttribute("muted", "");
		return;
	}

	video.removeAttribute("muted");
};
