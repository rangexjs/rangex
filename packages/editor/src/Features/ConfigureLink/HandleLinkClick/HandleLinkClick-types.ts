import type { EditorAPI, InlineComponent } from "rich-text-area";
import type { LinkConfigPort } from "#adapters/Link";
import type { PopoverOverlayController } from "#engine-links";
import type { LinkInternals } from "../ConfigureLink-types";

export interface HandleLinkClickParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	popoverController: PopoverOverlayController;
}

export interface OpenLinkOverlayParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	link: InlineComponent;
	popoverController: PopoverOverlayController;
}
