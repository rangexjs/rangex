import type { EditorAPI } from "rich-text-area";
import type { LinkConfigPort, LinkDisplayText } from "#adapters/Link";
import type { PopoverOverlayController } from "#engine-links";

export interface HandleLinkToolbarClickParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
	popoverController: PopoverOverlayController;
}

export interface OpenAtCaretParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
	popoverController: PopoverOverlayController;
}

export interface OpenForWrapParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
	popoverController: PopoverOverlayController;
}

export interface GetDisplayTextInfoParams {
	editorAPI: EditorAPI;
}

export type GetDisplayTextInfoResult = LinkDisplayText;
