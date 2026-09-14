import type { EditorAPI } from "rich-text-area";
import type { EmptyMediaConfigPort } from "#adapters/EmptyMedia";
import type { BlockComponentPlacement } from "#engine-links";

export interface HandleEmptyMediaPlacementStateParams {
	configPort: EmptyMediaConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
