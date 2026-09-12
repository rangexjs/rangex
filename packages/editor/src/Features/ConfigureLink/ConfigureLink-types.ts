import type { EditorAPI } from "rich-text-area";
import type { LinkConfigPort } from "#adapters/Link";

export interface ConfigureLinkParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
}
