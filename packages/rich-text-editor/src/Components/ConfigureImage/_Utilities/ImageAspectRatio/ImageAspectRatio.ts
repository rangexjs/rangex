import { imageAspectRatioAttr } from "../../../../Constants";
import type {
	GetImageAspectRatioParams,
	GetImageAspectRatioResult,
	ImageAspectRatioValue,
	SetImageAspectRatioParams,
} from "./ImageAspectRatio-types";

const aspectRatioValues: string[] = Object.values(imageAspectRatioAttr.value);

const isImageAspectRatioValue = (
	value: string,
): value is ImageAspectRatioValue => aspectRatioValues.includes(value);

/**
 * Reads the current `data-aspect-ratio` off an image's `img` element, falling back
 * to "auto" (and warning) if the attribute is missing or was set to something invalid.
 */
export const getImageAspectRatio = ({
	img,
}: GetImageAspectRatioParams): GetImageAspectRatioResult => {
	const value = img.getAttribute(imageAspectRatioAttr.name);

	if (value === null || !isImageAspectRatioValue(value)) {
		console.warn(
			"Img has a missing or invalid attribute.",
			imageAspectRatioAttr.name,
		);

		return "auto";
	}

	return value;
};

export const setImageAspectRatio = ({
	img,
	aspectRatio,
}: SetImageAspectRatioParams) => {
	img.setAttribute(
		imageAspectRatioAttr.name,
		imageAspectRatioAttr.value[aspectRatio],
	);
};
