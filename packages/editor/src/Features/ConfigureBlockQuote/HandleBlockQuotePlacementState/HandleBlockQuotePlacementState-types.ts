import type { EditorAPI } from "rich-text-area";
import type { BlockQuoteConfigPort } from "#adapters/BlockQuote";
import type { BlockComponentPlacement, ComponentLookup } from "#engine-links";

export interface HandleBlockQuotePlacementStateParams {
	configPort: BlockQuoteConfigPort;
	editorAPI: EditorAPI;
	componentLookup: ComponentLookup;
	blockComponentPlacement: BlockComponentPlacement;
}
