import type { EditorAPI } from "rich-text-area";
import type { ReadOnlyEditorPort } from "#adapters";

export interface HandleReadOnlyToggleParams {
	editorPort: ReadOnlyEditorPort;
	editorAPI: EditorAPI;
}
