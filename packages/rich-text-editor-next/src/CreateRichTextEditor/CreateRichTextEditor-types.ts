import type { StoredSnapshot } from "rich-text-area";
import type { ToolbarButtonsLayout } from "#constants";
import type { Extension } from "#extensions";

export interface RichTextEditor {
	readonly editorHost: HTMLDivElement;
	destroy(): void;
}

export interface CreateRichTextEditorParams {
	storedSnapshot?: StoredSnapshot;
	extensions: Extension[];
	toolbarButtonsLayout?: ToolbarButtonsLayout;
}

export interface CreateRichTextEditorResult extends RichTextEditor {}
