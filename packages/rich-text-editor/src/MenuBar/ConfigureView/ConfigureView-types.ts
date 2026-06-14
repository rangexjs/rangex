import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { EditorAPI } from "rich-text-area";

export interface ConfigureThemeParams {
	richTextEditorUI: RichTextEditorUI;
	
}

export interface ConfigureViewParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
