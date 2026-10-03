import type { EditorAPI } from "@rangex/core";
import type { SeparatorConfigPort } from "#adapters/Separator";
import type { BlockComponentPlacement } from "#engine-links";

export interface HandleSeparatorPlacementParams {
	configPort: SeparatorConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
