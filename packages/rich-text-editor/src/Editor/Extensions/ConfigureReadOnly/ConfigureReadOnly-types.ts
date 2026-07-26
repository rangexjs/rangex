import type { EditorAPI } from "rich-text-area";
import type { ReadOnlyEditorPort } from "#adapters";

export interface ConfigureReadOnlyParams {
	editorPort: ReadOnlyEditorPort;
	editorAPI: EditorAPI;
}
