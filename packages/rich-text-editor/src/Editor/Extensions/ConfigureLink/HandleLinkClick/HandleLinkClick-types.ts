import type { EditorAPI, InlineNestedContext } from "rich-text-area";
import type { LinkEditorPort } from "#adapters";
import type { LinkInternals } from "../ConfigureLink-types";

export interface OpenLinkPopoverParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	link: InlineNestedContext;
}

export interface HandleLinkClickParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
}
