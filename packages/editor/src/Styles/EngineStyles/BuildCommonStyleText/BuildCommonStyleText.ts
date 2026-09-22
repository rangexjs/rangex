import { BlockComponentLine } from "../EditorElements";

/*
 * Concatenates every bucket's common style text (shared by editor and view mode) into one style text.
 */
export const buildCommonStyleText = () => {
	return [BlockComponentLine].join("");
};
