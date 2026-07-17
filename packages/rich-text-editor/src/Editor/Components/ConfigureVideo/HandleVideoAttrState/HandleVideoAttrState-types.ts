import type { BlockNestedContext, EditorAPI } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";

export interface HandleVideoAttrStateParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	getCurrentBlock: () => BlockNestedContext | null;
}
