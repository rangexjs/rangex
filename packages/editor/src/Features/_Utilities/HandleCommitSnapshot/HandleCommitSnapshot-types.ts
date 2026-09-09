import type { EditorAPI } from "rich-text-area";
import type { CommitSnapshotConfigPort } from "#adapters";

export interface HandleCommitSnapshotParams {
	port: CommitSnapshotConfigPort;
	editorAPI: EditorAPI;
}
