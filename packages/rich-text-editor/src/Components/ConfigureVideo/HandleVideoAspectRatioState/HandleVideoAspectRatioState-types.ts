import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { BlockNestedContext, EditorAPI } from "rich-text-area";

export interface HandleVideoAspectRatioStateParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	getCurrentBlock: () => BlockNestedContext | null;
}
