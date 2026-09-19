import type { EditorAPI } from "rich-text-area";
import type { TableConfigPort } from "#adapters/Table";
import type { BlockComponentPlacement, ComponentLookup } from "#engine-links";

export interface HandleTablePlacementStateParams {
	configPort: TableConfigPort;
	editorAPI: EditorAPI;
	componentLookup: ComponentLookup;
	blockComponentPlacement: BlockComponentPlacement;
}
