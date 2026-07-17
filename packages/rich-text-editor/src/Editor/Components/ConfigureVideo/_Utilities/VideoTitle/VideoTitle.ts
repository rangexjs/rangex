import type {
	GetVideoTitleParams,
	GetVideoTitleResult,
	SetVideoTitleParams,
} from "./VideoTitle-types";

/**
 * The accessible description lives in `aria-label`, since `<video>` has no dedicated
 * text-alternative attribute.
 */
export const getVideoTitle = ({
	video,
}: GetVideoTitleParams): GetVideoTitleResult =>
	video.getAttribute("aria-label") ?? "";

export const setVideoTitle = ({ video, title }: SetVideoTitleParams) => {
	video.setAttribute("aria-label", title);
};
