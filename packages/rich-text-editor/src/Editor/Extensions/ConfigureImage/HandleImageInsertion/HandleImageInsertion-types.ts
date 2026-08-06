import type { EditorAPI } from "rich-text-area";
import type { ImageEditorPort } from "#adapters";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface HandleImageInsertionParams {
	editorPort: ImageEditorPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
