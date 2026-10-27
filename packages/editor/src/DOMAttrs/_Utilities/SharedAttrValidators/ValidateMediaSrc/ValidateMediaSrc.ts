import type { ValidateAttrFn } from "../../DOMAttrs-types";

/*
 * A media src (e.g. a video's or an iframe's) is valid if it isn't empty and it's at most 4096 characters long. Whether
 * it's a safe URL is the Sanitizer's job. An invalid one is rejected: the media has no src to fall back to.
 */
export const validateMediaSrc: ValidateAttrFn<string> = ({ value }) => {
	const maxSrcLength = 4096;

	if (value.trim() === "") {
		return { kind: "reject", reason: "must not be empty" };
	}

	if (value.length > maxSrcLength) {
		return {
			kind: "reject",
			reason: `must be at most ${maxSrcLength} characters long`,
		};
	}

	return null;
};
