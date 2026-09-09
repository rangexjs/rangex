import type { EditorAPI } from "rich-text-area";
import type { UndoRedoConfigPort } from "#adapters/UndoRedo";

export interface ConfigureUndoRedoParams {
	configPort: UndoRedoConfigPort;
	editorAPI: EditorAPI;
}
