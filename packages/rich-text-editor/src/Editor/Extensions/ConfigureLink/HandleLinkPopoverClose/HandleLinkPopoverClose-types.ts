import type { EditorAPI } from "rich-text-area";
import type { LinkEditorPort } from "#adapters";
import type { LinkInternals } from "../ConfigureLink-types";

export interface ClosePopoverParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
}

export interface CloseOnSelectionChangeParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
}

export interface HandleLinkPopoverCancelParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
}

export interface RestoreFocusOnEscapeParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
}

export interface HandleLinkPopoverCloseParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
}
