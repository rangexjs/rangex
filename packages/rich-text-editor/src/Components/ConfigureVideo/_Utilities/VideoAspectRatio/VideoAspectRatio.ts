import { aspectRatioAttr } from "../../../../Constants";
import type {
	GetVideoAspectRatioParams,
	GetVideoAspectRatioResult,
	SetVideoAspectRatioParams,
	VideoAspectRatioValue,
} from "./VideoAspectRatio-types";

const aspectRatioValues: string[] = Object.values(aspectRatioAttr.value);

const isVideoAspectRatioValue = (
	value: string,
): value is VideoAspectRatioValue => aspectRatioValues.includes(value);

/**
 * Reads the current `data-aspect-ratio` off a video's `video` element, falling back
 * to "auto" (and warning) if the attribute is missing or was set to something invalid.
 */
export const getVideoAspectRatio = ({
	video,
}: GetVideoAspectRatioParams): GetVideoAspectRatioResult => {
	const value = video.getAttribute(aspectRatioAttr.name);

	if (value === null || !isVideoAspectRatioValue(value)) {
		console.warn(
			"Video has a missing or invalid attribute.",
			aspectRatioAttr.name,
		);

		return "auto";
	}

	return value;
};

export const setVideoAspectRatio = ({
	video,
	aspectRatio,
}: SetVideoAspectRatioParams) => {
	video.setAttribute(aspectRatioAttr.name, aspectRatioAttr.value[aspectRatio]);
};
