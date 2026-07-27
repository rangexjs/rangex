import type { EditorAPI } from "rich-text-area";
import type { UndoRedoEditorPort } from "#adapters";

export interface HandleUndoRedoButtonStateParams {
	editorPort: UndoRedoEditorPort;
	editorAPI: EditorAPI;
}
