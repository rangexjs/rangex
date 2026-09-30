import type {
	createHTMLView,
	HighlightCodeFn,
	StoredSnapshot,
} from "@rangex/editor";

export interface CreateRichTextHTMLViewParams {
	storedSnapshot: StoredSnapshot;
	highlightCode?: HighlightCodeFn;
}

export interface CreateRichTextHTMLViewResult
	extends ReturnType<typeof createHTMLView> {}
