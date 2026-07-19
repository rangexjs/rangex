import type { EditorAPI } from "rich-text-area";
import type { LinkPort } from "#ports";

export interface HandleLinkToolbarButtonStateParams {
	linkPort: LinkPort;
	editorAPI: EditorAPI;
}
