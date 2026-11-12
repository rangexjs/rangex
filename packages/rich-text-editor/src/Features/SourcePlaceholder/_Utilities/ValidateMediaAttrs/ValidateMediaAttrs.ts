import { assertNever } from "#utilities";

import type { ValidateMediaAttrsParams } from "./ValidateMediaAttrs-types";

/*
 * Validates the media's attributes by its component's validators. Returns whether they're valid.
 */
export const validateMediaAttrs = ({ editor, detail }: ValidateMediaAttrsParams) => {
	if (detail.type === "image") {
		return !editor.image?.validateDOMAttrs(detail.attrs);
	}

	if (detail.type === "video") {
		return !editor.video?.validateDOMAttrs(detail.attrs);
	}

	if (detail.type === "audio") {
		return !editor.audio?.validateDOMAttrs(detail.attrs);
	}

	if (detail.type === "embed") {
		return !editor.embed?.validateDOMAttrs(detail.attrs);
	}

	return assertNever(detail);
};
