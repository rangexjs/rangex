import { buildCommonStyleText } from "../BuildCommonStyleText";

/*
 * Builds the custom style text applied to a live editor: the common style text plus the caller's own styles.
 */
export const buildEditorStyleText = (styles: string) => {
	const common = buildCommonStyleText();

	return [common, styles].join("");
};
