import type { EditorAPI } from "rich-text-area";
import type { LinkEditorPort } from "#adapters";

export interface HandleLinkToolbarButtonStateParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
}
