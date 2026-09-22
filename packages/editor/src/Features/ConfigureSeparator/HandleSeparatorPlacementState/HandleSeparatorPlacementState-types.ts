import type { EditorAPI } from "rich-text-area";
import type { SeparatorConfigPort } from "#adapters/Separator";
import type { BlockComponentPlacement } from "#engine-links";

export interface HandleSeparatorPlacementStateParams {
	configPort: SeparatorConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
