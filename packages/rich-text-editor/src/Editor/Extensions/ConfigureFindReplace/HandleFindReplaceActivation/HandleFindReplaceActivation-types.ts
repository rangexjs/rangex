import type { EditorAPI } from "rich-text-area";
import type { FindReplaceEditorPort } from "#adapters";

export interface HandleFindReplaceActivationParams {
	editorPort: FindReplaceEditorPort;
	editorAPI: EditorAPI;
}
