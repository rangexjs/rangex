import { buildCommonStyleText } from "../BuildCommonStyleText";
import { GlyphFormatterEditor } from "../EditorElements";

/*
 * Builds the custom style text applied to a live editor: the common style text, the editor-only styles, plus the
 * caller's own styles.
 */
export const buildEditorStyleText = (styles: string) => {
	const common = buildCommonStyleText();

	return [common, GlyphFormatterEditor, styles].join("");
};
