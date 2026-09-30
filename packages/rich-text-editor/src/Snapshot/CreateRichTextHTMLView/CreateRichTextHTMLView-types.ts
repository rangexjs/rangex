import type { createHTMLView, HighlightCodeFn } from "@rangex/editor";
import type { StoredSnapshot } from "rich-text-area";

export interface CreateRichTextHTMLViewParams {
	storedSnapshot: StoredSnapshot;
	highlightCode?: HighlightCodeFn;
}

export interface CreateRichTextHTMLViewResult
	extends ReturnType<typeof createHTMLView> {}
