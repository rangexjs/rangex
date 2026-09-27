import type { EditorAPI } from "rich-text-area";
import type { BlockQuoteConfigPort } from "#adapters/BlockQuote";
import type { BlockComponentPlacement } from "#engine-links";

export interface HandleBlockQuotePlacementStateParams {
	configPort: BlockQuoteConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
