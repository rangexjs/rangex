import type { EditorAPI } from "@rangex/core";
import type { UndoRedoConfigPort } from "#adapters/UndoRedo";

export interface HandleUndoRedoButtonStateParams {
	configPort: UndoRedoConfigPort;
	editorAPI: EditorAPI;
}
