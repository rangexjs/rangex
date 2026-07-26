import type { EditorAPI } from "rich-text-area";
import type { FindReplaceEditorPort } from "#adapters";

export interface HandleSearchChangeParams {
	editorPort: FindReplaceEditorPort;
	editorAPI: EditorAPI;
}
