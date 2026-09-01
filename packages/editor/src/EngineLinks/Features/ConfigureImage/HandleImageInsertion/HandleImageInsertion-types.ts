import type { EditorAPI } from "rich-text-area";
import type { ImageConfigPort } from "#adapters/Image";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface HandleImageInsertionParams {
	configPort: ImageConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
