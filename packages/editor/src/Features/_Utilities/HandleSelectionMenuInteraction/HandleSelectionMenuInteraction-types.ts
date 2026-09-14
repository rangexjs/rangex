import type { EditorAPI } from "rich-text-area";
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
