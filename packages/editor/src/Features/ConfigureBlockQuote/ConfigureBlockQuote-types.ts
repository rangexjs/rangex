import type { EditorAPI } from "rich-text-area";
import type { BlockQuoteConfigPort } from "#adapters/BlockQuote";

export interface ConfigureBlockQuoteParams {
	configPort: BlockQuoteConfigPort;
	editorAPI: EditorAPI;
}
