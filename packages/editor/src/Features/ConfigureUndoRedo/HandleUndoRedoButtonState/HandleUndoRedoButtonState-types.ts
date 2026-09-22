import type { EditorAPI } from "rich-text-area";
import type { UndoRedoConfigPort } from "#adapters/UndoRedo";

export interface HandleUndoRedoButtonStateParams {
	configPort: UndoRedoConfigPort;
	editorAPI: EditorAPI;
}
