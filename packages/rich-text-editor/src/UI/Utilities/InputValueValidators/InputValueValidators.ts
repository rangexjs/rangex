import type {
	GetPercentageFromInputProps,
	GetPercentageFromInputReturn,
	GetPixelFromInputProps,
	GetPixelFromInputReturn,
} from "./InputValueValidators-types";

/**
 * Gets the value from the input if it's a valid pixel value.
 * The input is a valid pixel value if its only a number, or the number ends with a "px".
 * E.g: 100, 0, 15px
 */
export const getPixelFromInput = ({
	input,
}: GetPixelFromInputProps): GetPixelFromInputReturn => {
	const regex = /(?<pixel>\d+)(px)?$/;

	const match = input.match(regex);

	if (!match?.groups) {
		return null;
	}

	if (!("pixel" in match.groups)) {
		return null;
	}

	const { pixel } = match.groups;

	return +pixel;
};

/**
 * Gets the value from the input if it's a valid percentage value.
 * The input is a valid percentage value if the number end with a "%".
 * If the value less then 0 or higher than 100, it will be adjusted.
 * E.g: 5%, 10%, 100%, 120%
 */
export const getPercentageFromInput = ({
	input,
}: GetPercentageFromInputProps): GetPercentageFromInputReturn => {
	const regex = /(?<percentage>\d+)%$/;

	const match = input.match(regex);

	if (!match?.groups) {
		return null;
	}

	if (!("percentage" in match.groups)) {
		return null;
	}

	const { percentage } = match.groups;

	return Math.min(100, Math.max(0, +percentage));
};
