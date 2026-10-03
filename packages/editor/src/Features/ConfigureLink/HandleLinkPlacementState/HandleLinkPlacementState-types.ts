import type { EditorAPI } from "@rangex/core";
import type { LinkConfigPort } from "#adapters/Link";

export interface HandleLinkPlacementStateParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
}
