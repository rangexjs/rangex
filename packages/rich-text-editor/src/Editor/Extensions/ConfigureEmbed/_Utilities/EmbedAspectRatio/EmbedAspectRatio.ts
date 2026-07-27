import { aspectRatioAttr } from "../../../../Constants";
import type {
	EmbedAspectRatioValue,
	GetEmbedAspectRatioParams,
	GetEmbedAspectRatioResult,
	SetEmbedAspectRatioParams,
} from "./EmbedAspectRatio-types";

const aspectRatioValues: string[] = Object.values(aspectRatioAttr.value);

const isEmbedAspectRatioValue = (
	value: string,
): value is EmbedAspectRatioValue => aspectRatioValues.includes(value);

/**
 * Reads the current `data-aspect-ratio` off an embed's `iframe` element, falling back
 * to "auto" (and warning) if the attribute is missing or was set to something invalid.
 */
export const getEmbedAspectRatio = ({
	iframe,
}: GetEmbedAspectRatioParams): GetEmbedAspectRatioResult => {
	const value = iframe.getAttribute(aspectRatioAttr.name);

	if (value === null || !isEmbedAspectRatioValue(value)) {
		console.warn(
			"Iframe has a missing or invalid attribute.",
			aspectRatioAttr.name,
		);

		return "auto";
	}

	return value;
};

export const setEmbedAspectRatio = ({
	iframe,
	aspectRatio,
}: SetEmbedAspectRatioParams) => {
	iframe.setAttribute(aspectRatioAttr.name, aspectRatioAttr.value[aspectRatio]);
};
