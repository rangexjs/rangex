import type { EditorAPI } from "rich-text-area";
import type { LinkPort } from "#ports";
import type { RichTextEditorUI } from "#ui";

export interface OpenAtCaretParams {
	linkPort: LinkPort;
	editorAPI: EditorAPI;
}

export interface GetDisplayTextInfoParams {
	editorAPI: EditorAPI;
}

export interface GetDisplayTextInfoResult {
	inputValue: string;
	disabled: boolean;
}

export interface OpenForWrapParams {
	linkPort: LinkPort;
	editorAPI: EditorAPI;
}

export interface OpenLinkPopoverParams {
	linkPort: LinkPort;
	editorAPI: EditorAPI;
}

export interface HandleToolbarLinkClickParams {
	richTextEditorUI: RichTextEditorUI;
	linkPort: LinkPort;
	editorAPI: EditorAPI;
}
