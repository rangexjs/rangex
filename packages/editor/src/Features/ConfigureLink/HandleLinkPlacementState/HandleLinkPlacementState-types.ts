import type { EditorAPI } from "rich-text-area";
import type { LinkConfigPort } from "#adapters/Link";
import type { ComponentLookup } from "#engine-links";

export interface HandleLinkPlacementStateParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
	componentLookup: ComponentLookup;
}
