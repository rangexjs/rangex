import type { EditorAPI, InlineNestedContext } from "rich-text-area";
import type { LinkPort } from "#ports";

export interface LinkInternals {
	currentLink: InlineNestedContext | null;
}

export interface ConfigureLinkParams {
	linkPort: LinkPort;
	editorAPI: EditorAPI;
}
