import type { EditorAPI } from "rich-text-area";
import type { BlockQuoteEditorPort } from "#adapters";

export interface ConfigureBlockQuoteParams {
	editorPort: BlockQuoteEditorPort;
	editorAPI: EditorAPI;
}
