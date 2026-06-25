import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { EditorAPI } from "rich-text-area";

export interface HandleHistoryNavigationParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
