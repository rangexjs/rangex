import type { SnapshotSchema, StoredSnapshot } from "@rangex/editor";

import type { ToolbarButtonsLayout } from "#constants";
import type { Extension } from "#extensions";

import type { ThemeValue } from "../App/EditorContainer";

export interface RichTextEditor {
	readonly editorHost: HTMLDivElement;
	readonly editorStyle: CSSStyleSheet;
	theme: ThemeValue;
	createStoredSnapshot(): StoredSnapshot;
	destroy(): void;
}

export interface CreateRichTextEditorParams {
	licenseKey: string;
	storedSnapshot?: StoredSnapshot;
	snapshotSchema: SnapshotSchema;
	extensions: Extension[];
	toolbarButtonsLayout?: ToolbarButtonsLayout;
	theme?: ThemeValue;
}

export interface CreateRichTextEditorResult extends RichTextEditor {}
