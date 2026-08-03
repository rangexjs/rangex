import type { EditorAPI, InlineComponent } from "rich-text-area";
import type { LinkEditorPort } from "#adapters";

export interface LinkInternals {
	currentLink: InlineComponent | null;
}

export interface ConfigureLinkParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
}
