import type { EditorAPI } from "rich-text-area";
import type { FindReplaceEditorPort } from "#adapters";

export interface ConfigureFindReplaceParams {
	editorPort: FindReplaceEditorPort;
	editorAPI: EditorAPI;
}
