import type { EditorAPI, InlineNestedContext } from "rich-text-area";
import type { LinkPort } from "#ports";
import type { RichTextEditorUI } from "#ui";

export interface LinkInternals {
	currentLink: InlineNestedContext | null;
}

export interface ConfigureLinkParams {
	richTextEditorUI: RichTextEditorUI;
	linkPort: LinkPort;
	editorAPI: EditorAPI;
}
