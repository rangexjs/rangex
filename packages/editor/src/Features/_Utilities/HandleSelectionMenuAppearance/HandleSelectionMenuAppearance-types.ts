import type { EditorAPI } from "rich-text-area";
import type { SelectionMenuConfigPort } from "#adapters";
import type { PopoverOverlayController } from "#engine-links";

export interface HandleSelectionMenuAppearanceParams {
	configPort: SelectionMenuConfigPort;
	editorAPI: EditorAPI;
	preventHighlight?: boolean;
}

export interface HandleSelectionMenuAppearanceResult {
	selectionMenuPopoverController: PopoverOverlayController;
	cleanup(): void;
}
