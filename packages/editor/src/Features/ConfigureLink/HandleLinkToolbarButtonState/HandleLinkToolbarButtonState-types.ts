import type { EditorAPI } from "rich-text-area";
import type { LinkConfigPort } from "#adapters/Link";

export interface HandleLinkToolbarButtonStateParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
}
