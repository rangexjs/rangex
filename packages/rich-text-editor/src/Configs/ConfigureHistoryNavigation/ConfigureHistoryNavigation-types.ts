import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { EditorAPI } from "rich-text-area";

export interface ConfigureHistoryNavigationParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
