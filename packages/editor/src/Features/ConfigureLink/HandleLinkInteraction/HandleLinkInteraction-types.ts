import type { EditorAPI } from "@rangex/core";
import type { LinkConfigPort } from "#adapters/Link";
import type { PopoverOverlayController } from "#engine-links";

export interface OpenLinkMenuParams {
	configPort: LinkConfigPort;
	linkMenuPopoverController: PopoverOverlayController;
}

export interface RegisterClickParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
	linkMenuPopoverController: PopoverOverlayController;
}

export interface RegisterSelectionInParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
	linkMenuPopoverController: PopoverOverlayController;
}

export interface HandleLinkInteractionParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
	linkMenuPopoverController: PopoverOverlayController;
}
