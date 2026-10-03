import type { EditorAPI } from "@rangex/core";
import type { UndoRedoConfigPort } from "#adapters/UndoRedo";

export interface HandleUndoRedoNavigationParams {
	configPort: UndoRedoConfigPort;
	editorAPI: EditorAPI;
}
