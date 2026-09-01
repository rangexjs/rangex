import type { EditorAPI } from "rich-text-area";
import type { EmptyMediaConfigPort } from "#adapters";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface HandleEmptyMediaInsertionParams {
	configPort: EmptyMediaConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
