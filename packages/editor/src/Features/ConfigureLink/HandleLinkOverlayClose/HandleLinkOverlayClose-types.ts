import type { EditorAPI } from "rich-text-area";
import type { LinkConfigPort } from "#adapters/Link";
import type { PopoverOverlayController } from "#engine-links";
import type { LinkInternals } from "../ConfigureLink-types";

export interface HandleLinkOverlayCloseParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	popoverController: PopoverOverlayController;
}

export interface CloseOverlayParams {
	editorAPI: EditorAPI;
	internals: LinkInternals;
	popoverController: PopoverOverlayController;
}

export interface CloseOnSelectionChangeParams {
	editorAPI: EditorAPI;
	internals: LinkInternals;
	popoverController: PopoverOverlayController;
}

export interface HandleLinkOverlayUnwrapParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	popoverController: PopoverOverlayController;
}

export interface HandleLinkOverlayCancelParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	popoverController: PopoverOverlayController;
}
