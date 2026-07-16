import { objectFitAttr } from "../../../../Constants";
import type {
	GetVideoObjectFitParams,
	GetVideoObjectFitResult,
	SetVideoObjectFitParams,
} from "./VideoObjectFit-types";

const objectFitValues: string[] = Object.values(objectFitAttr.value);

const isVideoObjectFitValue = (
	value: string,
): value is GetVideoObjectFitResult => objectFitValues.includes(value);

/**
 * Reads the current `data-object-fit` off a video's `video` element, falling back
 * to "cover" (and warning) if the attribute is missing or was set to something invalid.
 */
export const getVideoObjectFit = ({
	video,
}: GetVideoObjectFitParams): GetVideoObjectFitResult => {
	const value = video.getAttribute(objectFitAttr.name);

	if (value === null || !isVideoObjectFitValue(value)) {
		console.warn(
			"Video has a missing or invalid attribute.",
			objectFitAttr.name,
		);

		return "cover";
	}

	return value;
};

export const setVideoObjectFit = ({
	video,
	objectFit,
}: SetVideoObjectFitParams) => {
	video.setAttribute(objectFitAttr.name, objectFitAttr.value[objectFit]);
};
