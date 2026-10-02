import type { StoredSnapshot } from "@rangex/editor";
import type { ToolbarButtonsLayout } from "#constants";
import type { Extension } from "#extensions";

export interface RichTextEditor {
	readonly editorHost: HTMLDivElement;
	createStoredSnapshot(): StoredSnapshot;
	destroy(): void;
}

export interface CreateRichTextEditorParams {
	licenseKey: string;
	storedSnapshot?: StoredSnapshot;
	extensions: Extension[];
	toolbarButtonsLayout?: ToolbarButtonsLayout;
}

export interface CreateRichTextEditorResult extends RichTextEditor {}
