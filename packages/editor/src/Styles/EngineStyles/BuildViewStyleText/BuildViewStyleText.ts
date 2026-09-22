import { buildCommonStyleText } from "../BuildCommonStyleText";

/*
 * Builds the style text for rendered snapshot output: the common style text plus the caller's own styles.
 */
export const buildViewStyleText = (styles: string) => {
	const common = buildCommonStyleText();

	return [common, styles].join("");
};
