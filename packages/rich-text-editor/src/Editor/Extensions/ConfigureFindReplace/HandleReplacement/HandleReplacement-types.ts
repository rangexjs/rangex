import type { EditorAPI } from "rich-text-area";
import type { FindReplaceEditorPort } from "#adapters";

export interface HandleReplacementParams {
	editorPort: FindReplaceEditorPort;
	editorAPI: EditorAPI;
}
