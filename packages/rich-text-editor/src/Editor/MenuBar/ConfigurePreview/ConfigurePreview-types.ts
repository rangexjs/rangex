import type { EditorAPI, SnapshotView, StoredSnapshot } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";

export interface CreateRenderedParams {
	snapshotView: SnapshotView;
}

export interface CreateHTMLParams {
	snapshotView: SnapshotView;
}

export interface CreateSnapshotViewParams {
	snapshotView: SnapshotView;
}

export interface CreateStoredSnapshotParams {
	storedSnapshot: StoredSnapshot;
}

export interface CreateHTMLTextParams {
	snapshotView: SnapshotView;
}

export interface CreateSnapshotViewTextParams {
	snapshotView: SnapshotView;
}

export interface CreateStoredSnapshotTextParams {
	storedSnapshot: StoredSnapshot;
}

export interface CreatePreviewContentParams {
	editorAPI: EditorAPI;
}

export interface ConfigurePreviewParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
