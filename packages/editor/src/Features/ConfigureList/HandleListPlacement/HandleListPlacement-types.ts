import type { EditorAPI } from "@rangex/core";
import type { ListConfigPort } from "#adapters/List";
import type { BlockComponentPlacement } from "#engine-links";

export interface HandleListPlacementParams {
	configPort: ListConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
