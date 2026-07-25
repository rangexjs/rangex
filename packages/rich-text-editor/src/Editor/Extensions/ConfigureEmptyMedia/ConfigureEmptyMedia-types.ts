import type { EditorAPI } from "rich-text-area";
import type { EmptyMediaEditorPort } from "#adapters";

export interface ConfigureEmptyMediaParams {
	editorPort: EmptyMediaEditorPort;
	editorAPI: EditorAPI;
}
