import type {
	GetVideoPosterParams,
	GetVideoPosterResult,
	SetVideoPosterParams,
} from "./VideoPoster-types";

export const getVideoPoster = ({
	video,
}: GetVideoPosterParams): GetVideoPosterResult =>
	video.getAttribute("poster") ?? "";

export const setVideoPoster = ({ video, poster }: SetVideoPosterParams) => {
	if (!poster) {
		video.removeAttribute("poster");
		return;
	}

	video.setAttribute("poster", poster);
};
