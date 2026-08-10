import type { EditorAPI } from "rich-text-area";
import type { SeparatorEditorPort } from "#adapters";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface HandleSeparatorToolbarButtonStateParams {
	editorPort: SeparatorEditorPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
