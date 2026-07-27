import type { EditorAPI } from "rich-text-area";
import type { FindReplaceEditorPort } from "#adapters";

export interface HandleNavigateToIndexParams {
	editorPort: FindReplaceEditorPort;
	editorAPI: EditorAPI;
}
