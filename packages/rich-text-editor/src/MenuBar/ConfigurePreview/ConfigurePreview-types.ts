import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { EditorAPI, SnapshotView, StoredSnapshot } from "rich-text-area";
import type { CreateHTMLFromSnapshotViewResult } from "./CreateHTMLFromSnapshotView";

export interface CreateRenderedParams
	extends CreateHTMLFromSnapshotViewResult {}

export interface CreateHTMLParams extends CreateHTMLFromSnapshotViewResult {}

export interface CreateJSONParams {
	snapshotView: SnapshotView;
}

export interface CreateSnapshotParams {
	storedSnapshot: StoredSnapshot;
}

export interface CreateHTMLTextParams {
	style: HTMLStyleElement;
	rootElement: HTMLElement;
}

export interface CreateJSONTextParams {
	snapshotView: SnapshotView;
}

export interface CreateSnapshotTextParams {
	storedSnapshot: StoredSnapshot;
}

export interface CreatePreviewContentParams {
	editorAPI: EditorAPI;
}

export interface ConfigurePreviewParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
