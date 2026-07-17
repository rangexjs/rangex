import type { EditorAPI } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface HandleListToolbarButtonStateParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
