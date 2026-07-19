import type { EditorAPI } from "rich-text-area";
import type { LinkEditorPort } from "#adapters";

export interface OpenAtCaretParams {
	editorPort: LinkEditorPort;
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
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
}

export interface OpenLinkPopoverParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
}

export interface HandleToolbarLinkClickParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
}
