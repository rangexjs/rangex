import type { EditorNodeView, GlyphFormatterView } from "rich-text-area";
import type {
	StorageMap,
	ToDOMResult,
} from "../../CreateHTMLFromSnapshotView-types";

export interface CreateGlyphFormatterHTMLParams {
	glyphFormatterView: GlyphFormatterView;
	toDOM: (node: EditorNodeView) => ToDOMResult;
	storageMap: StorageMap;
}

export type CreateGlyphFormatterHTMLResult = HTMLElement;
