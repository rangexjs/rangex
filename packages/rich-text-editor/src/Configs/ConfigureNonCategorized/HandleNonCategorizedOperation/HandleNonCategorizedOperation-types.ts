import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { EditorAPI } from "rich-text-area";

export interface SetupInitialStatesParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}

export interface HandleNonCategorizedOperationParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
