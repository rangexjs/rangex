import type { EditorAPI } from "rich-text-area";
import type { LinkPort } from "#ports";
import type { LinkInternals } from "../ConfigureLink-types";

export interface CloseOnSelectionChangeParams {
	linkPort: LinkPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
}

export interface HandleLinkPopoverCancelParams {
	linkPort: LinkPort;
	internals: LinkInternals;
}

export interface RestoreFocusOnEscapeParams {
	linkPort: LinkPort;
	editorAPI: EditorAPI;
}

export interface OnPopoverCloseParams {
	linkPort: LinkPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
}

export interface HandleLinkPopoverCloseParams {
	linkPort: LinkPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
}
