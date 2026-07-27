import type { EditorAPI } from "rich-text-area";
import type { ListEditorPort } from "#adapters";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface HandleListToolbarButtonStateParams {
	editorPort: ListEditorPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
