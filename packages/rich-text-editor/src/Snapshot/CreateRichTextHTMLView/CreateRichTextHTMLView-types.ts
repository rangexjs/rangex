import type { createHTMLView as createEditorHTMLView } from "@rangex/editor";
import type { StoredSnapshot } from "rich-text-area";

export interface CreateRichTextHTMLViewParams {
	storedSnapshot: StoredSnapshot;
}

export interface CreateRichTextHTMLViewResult
	extends ReturnType<typeof createEditorHTMLView> {}
