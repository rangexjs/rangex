import type { EditorAPI } from "rich-text-area";
import type { LinkEditorPort } from "#adapters";
import type { AnchoredOverlayController } from "../../../_Utilities";

export interface OpenAtCaretParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
	anchorController: AnchoredOverlayController;
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
	anchorController: AnchoredOverlayController;
}

export interface OpenLinkOverlayParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
	anchorController: AnchoredOverlayController;
}

export interface HandleToolbarLinkClickParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
	anchorController: AnchoredOverlayController;
}
