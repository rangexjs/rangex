import type { EditorAPI } from "rich-text-area";
import type { TableEditorPort } from "#adapters";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface HandleTableInsertionParams {
	editorPort: TableEditorPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
