import type { EditorAPI } from "rich-text-area";
import type { TableEditorPort } from "#adapters";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface HandleTableToolbarButtonStateParams {
	editorPort: TableEditorPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
