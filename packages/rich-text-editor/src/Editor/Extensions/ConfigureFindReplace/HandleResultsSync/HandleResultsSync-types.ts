import type { EditorAPI } from "rich-text-area";
import type { FindReplaceEditorPort } from "#adapters";

export interface HandleResultsSyncParams {
	editorPort: FindReplaceEditorPort;
	editorAPI: EditorAPI;
}
