import type { EditorAPI } from "rich-text-area";
import type { LinkPopover, RichTextEditorUI } from "#ui";

export interface OpenAtCaretParams {
	linkPopover: LinkPopover;
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
	linkPopover: LinkPopover;
	editorAPI: EditorAPI;
}

export interface OpenLinkPopoverParams {
	linkPopover: LinkPopover;
	editorAPI: EditorAPI;
}

export interface HandleToolbarLinkClickParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
