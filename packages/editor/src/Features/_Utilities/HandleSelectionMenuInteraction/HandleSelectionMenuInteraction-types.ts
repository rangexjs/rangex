import type { EditorAPI } from "@rangex/core";

import type { SelectionMenuConfigPort } from "#adapters";
import type { PopoverOverlayController } from "#engine-links";

export interface HandleSelectionMenuInteractionParams {
	configPort: SelectionMenuConfigPort;
	editorAPI: EditorAPI;
	preventHighlight?: boolean;
}

export interface HandleSelectionMenuInteractionResult {
	selectionMenuPopoverController: PopoverOverlayController;
	cleanup(): void;
}
