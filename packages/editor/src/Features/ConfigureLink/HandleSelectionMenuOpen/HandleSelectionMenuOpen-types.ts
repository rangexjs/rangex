import type { EditorAPI } from "rich-text-area";
import type { LinkConfigPort } from "#adapters/Link";
import type { PopoverOverlayController } from "#engine-links";

export interface HandleSelectionMenuOpenParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
	selectionMenuPopoverController: PopoverOverlayController;
}

export interface OpenAtCaretParams {
	editorAPI: EditorAPI;
	selectionMenuPopoverController: PopoverOverlayController;
}

export interface OpenForWrapParams {
	editorAPI: EditorAPI;
	selectionMenuPopoverController: PopoverOverlayController;
}
