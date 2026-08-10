import type { EditorAPI } from "rich-text-area";
import type { LinkEditorPort } from "#adapters";
import type { PopoverOverlayController } from "../../../_Utilities";
import type { LinkInternals } from "../ConfigureLink-types";

export interface CloseOverlayParams {
	internals: LinkInternals;
	editorAPI: EditorAPI;
	popoverController: PopoverOverlayController;
	hideImmediately: boolean;
}

export interface CloseOnSelectionChangeParams {
	editorAPI: EditorAPI;
	internals: LinkInternals;
	popoverController: PopoverOverlayController;
}

export interface HandleOverlayUnwrapParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	popoverController: PopoverOverlayController;
}

export interface HandleOverlayCancelParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	popoverController: PopoverOverlayController;
}

export interface HandleOverlayCloseParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	popoverController: PopoverOverlayController;
}
