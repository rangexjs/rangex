import type { EditorAPI, InlineNestedContext } from "rich-text-area";
import type { LinkPort } from "#ports";
import type { LinkInternals } from "../ConfigureLink-types";

export interface OpenLinkPopoverParams {
	linkPort: LinkPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	link: InlineNestedContext;
}

export interface HandleLinkClickParams {
	linkPort: LinkPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
}
