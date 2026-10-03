import type { createHTMLView, StoredSnapshot } from "@rangex/editor";
import type { HighlightCodeFn } from "@rangex/editor/code-block";

export interface CreateRichTextHTMLViewParams {
	storedSnapshot: StoredSnapshot;
	highlightCode?: HighlightCodeFn;
}

export interface CreateRichTextHTMLViewResult
	extends ReturnType<typeof createHTMLView> {}
