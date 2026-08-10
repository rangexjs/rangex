import type { EditorAPI, InlineComponent } from "rich-text-area";
import type { LinkEditorPort } from "#adapters";
import type { PopoverOverlayController } from "../../../_Utilities";
import type { LinkInternals } from "../ConfigureLink-types";

export interface OpenLinkOverlayParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	link: InlineComponent;
	popoverController: PopoverOverlayController;
}

export interface HandleLinkClickParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	popoverController: PopoverOverlayController;
}
