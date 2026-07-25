import type { EditorAPI } from "rich-text-area";
import type { UndoRedoEditorPort } from "#adapters";

export interface HandleUndoRedoNavigationParams {
	editorPort: UndoRedoEditorPort;
	editorAPI: EditorAPI;
}
