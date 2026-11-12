import type { GetCSSTextParams, GetCSSTextResult } from "./GetCSSText-types";

const div = document.createElement("div");

const { style } = div;

/**
 * Converts the CSSDeclarations to a CSSText.
 */
export const getCSSText = (declarations: GetCSSTextParams): GetCSSTextResult => {
	Object.assign(style, declarations);

	const { cssText } = style;

	style.cssText = "";

	return cssText;
};
