import type { EditorAPI } from "rich-text-area";
import type { ListConfigPort } from "#adapters/List";
import type { BlockComponentPlacement } from "#engine-links";

export interface HandleListPlacementParams {
	configPort: ListConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
