import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { EditorAPI, InlineNestedContext } from "rich-text-area";

export interface LinkInternals {
	currentLink: InlineNestedContext | null;
}

export interface ConfigureLinkParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
