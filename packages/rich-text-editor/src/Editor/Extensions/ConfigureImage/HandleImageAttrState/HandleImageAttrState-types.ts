import type { BlockComponent, EditorAPI } from "rich-text-area";
import type { ImageEditorPort } from "#adapters";

export interface HandleImageAttrStateParams {
	editorPort: ImageEditorPort;
	editorAPI: EditorAPI;
	getCurrentBlock: () => BlockComponent | null;
}
