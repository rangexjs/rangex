import type { EditorNodeView, GlyphFormatterView } from "rich-text-area";
import type { ToDOMResult } from "../../CreateHTMLFromSnapshotView-types";

export interface CreateGlyphFormatterHTMLParams {
	glyphFormatterView: GlyphFormatterView;
	toDOM: (node: EditorNodeView) => ToDOMResult;
}

export type CreateGlyphFormatterHTMLResult = HTMLElement;
