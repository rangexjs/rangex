import type { EditorAPI } from "rich-text-area";
import type { ListConfigPort } from "#adapters/List";
import type { BlockComponentPlacement, ComponentLookup } from "#engine-links";

export interface HandleListPlacementStateParams {
	configPort: ListConfigPort;
	editorAPI: EditorAPI;
	componentLookup: ComponentLookup;
	blockComponentPlacement: BlockComponentPlacement;
}
