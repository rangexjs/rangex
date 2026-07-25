import type { EditorAPI } from "rich-text-area";
import type { ImageEditorPort } from "#adapters";

export interface HandleImageInsertionParams {
	editorPort: ImageEditorPort;
	editorAPI: EditorAPI;
}
