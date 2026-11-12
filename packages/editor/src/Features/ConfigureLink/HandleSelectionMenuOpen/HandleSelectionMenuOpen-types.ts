import type { EditorAPI } from "@rangex/core";

import type { SelectionMenuConfigPort } from "#adapters";
import type { PopoverOverlayController } from "#engine-links";

export interface HandleSelectionMenuOpenParams {
	configPort: SelectionMenuConfigPort;
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
