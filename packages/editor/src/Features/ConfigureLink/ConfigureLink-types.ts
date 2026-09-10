import type { EditorAPI, InlineComponent } from "rich-text-area";
import type { LinkConfigPort } from "#adapters/Link";

export interface LinkInternals {
	currentLink: InlineComponent | null;
}

export interface ConfigureLinkParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
}
