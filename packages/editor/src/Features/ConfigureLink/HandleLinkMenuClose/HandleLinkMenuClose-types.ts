import type { EditorAPI } from "rich-text-area";
import type { LinkConfigPort } from "#adapters/Link";
import type { PopoverOverlayController } from "#engine-links";

export interface CloseOnSelectionChangeParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
	linkMenuPopoverController: PopoverOverlayController;
}

export interface CloseOnLinkRemovalParams {
	editorAPI: EditorAPI;
	linkMenuPopoverController: PopoverOverlayController;
}

export interface HandleLinkMenuCloseParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
	linkMenuPopoverController: PopoverOverlayController;
}
