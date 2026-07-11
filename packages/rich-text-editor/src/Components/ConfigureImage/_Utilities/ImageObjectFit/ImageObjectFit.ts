import { imageObjectFitAttr } from "../../../../Constants";
import type {
	GetImageObjectFitParams,
	GetImageObjectFitResult,
	SetImageObjectFitParams,
} from "./ImageObjectFit-types";

const objectFitValues: string[] = Object.values(imageObjectFitAttr.value);

const isImageObjectFitValue = (
	value: string,
): value is GetImageObjectFitResult => objectFitValues.includes(value);

/**
 * Reads the current `data-object-fit` off an image's `img` element, falling back
 * to "cover" (and warning) if the attribute is missing or was set to something invalid.
 */
export const getImageObjectFit = ({
	img,
}: GetImageObjectFitParams): GetImageObjectFitResult => {
	const value = img.getAttribute(imageObjectFitAttr.name);

	if (value === null || !isImageObjectFitValue(value)) {
		console.warn(
			"Img has a missing or invalid attribute.",
			imageObjectFitAttr.name,
		);

		return "cover";
	}

	return value;
};

export const setImageObjectFit = ({
	img,
	objectFit,
}: SetImageObjectFitParams) => {
	img.setAttribute(
		imageObjectFitAttr.name,
		imageObjectFitAttr.value[objectFit],
	);
};
