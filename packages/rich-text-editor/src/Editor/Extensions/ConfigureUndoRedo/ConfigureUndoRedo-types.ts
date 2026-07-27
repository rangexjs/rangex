import type { EditorAPI } from "rich-text-area";
import type { UndoRedoEditorPort } from "#adapters";

export interface ConfigureUndoRedoParams {
	editorPort: UndoRedoEditorPort;
	editorAPI: EditorAPI;
}
