import type {
	LinkPopover,
	RichTextEditorUI,
} from "@rangex/rich-text-editor-ui";
import type { EditorAPI } from "rich-text-area";

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
