import type { EditorAPI } from "rich-text-area";
import type { LinkEditorPort } from "#adapters";
import type { AnchoredOverlayController } from "../../../_Utilities";
import type { LinkInternals } from "../ConfigureLink-types";

export interface CloseOverlayParams {
	internals: LinkInternals;
	editorAPI: EditorAPI;
	anchorController: AnchoredOverlayController;
}

export interface CloseOnSelectionChangeParams {
	editorAPI: EditorAPI;
	internals: LinkInternals;
	anchorController: AnchoredOverlayController;
}

export interface HandleLinkOverlayCancelParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	anchorController: AnchoredOverlayController;
}

export interface RestoreFocusOnEscapeParams {
	editorAPI: EditorAPI;
	internals: LinkInternals;
	anchorController: AnchoredOverlayController;
}

export interface HandleLinkOverlayCloseParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	anchorController: AnchoredOverlayController;
}
