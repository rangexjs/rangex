import type { EditorAPI, InlineNestedContext } from "rich-text-area";
import type { LinkEditorPort } from "#adapters";

export interface LinkInternals {
	currentLink: InlineNestedContext | null;
}

export interface ConfigureLinkParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
}
