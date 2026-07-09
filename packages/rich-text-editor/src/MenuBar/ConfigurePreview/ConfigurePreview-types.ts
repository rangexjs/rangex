import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { EditorAPI, SnapshotView, StoredSnapshot } from "rich-text-area";

export interface CreateRenderedParams {
	snapshotView: SnapshotView;
}

export interface CreateHTMLParams {
	snapshotView: SnapshotView;
}

export interface CreateJSONParams {
	snapshotView: SnapshotView;
}

export interface CreateSnapshotParams {
	storedSnapshot: StoredSnapshot;
}

export interface CreateHTMLTextParams {
	snapshotView: SnapshotView;
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
