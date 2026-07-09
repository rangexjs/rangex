import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { EditorAPI } from "rich-text-area";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface HandleImageToolbarButtonStateParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
