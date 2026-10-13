import type {
	createHTMLView,
	SnapshotLimits,
	StoredSnapshot,
} from "@rangex/editor";
import type { HighlightCodeFn } from "@rangex/editor/code-block";

export interface CreateRichTextHTMLViewParams {
	storedSnapshot: StoredSnapshot;
	limits: SnapshotLimits;
	highlightCode?: HighlightCodeFn;
}

export interface CreateRichTextHTMLViewResult
	extends ReturnType<typeof createHTMLView> {}
