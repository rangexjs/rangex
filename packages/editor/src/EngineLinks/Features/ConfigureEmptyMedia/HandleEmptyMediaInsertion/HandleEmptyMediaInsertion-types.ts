import type { EditorAPI } from "rich-text-area";
import type { EmptyMediaConfigPort } from "#adapters/EmptyMedia";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface HandleEmptyMediaInsertionParams {
	configPort: EmptyMediaConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
