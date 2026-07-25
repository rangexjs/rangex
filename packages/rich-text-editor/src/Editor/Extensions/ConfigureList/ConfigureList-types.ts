import type { EditorAPI } from "rich-text-area";
import type { ListEditorPort } from "#adapters";

export interface ConfigureListParams {
	editorPort: ListEditorPort;
	editorAPI: EditorAPI;
}
