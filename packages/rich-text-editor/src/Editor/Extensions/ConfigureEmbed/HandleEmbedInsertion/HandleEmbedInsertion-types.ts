import type { EditorAPI } from "rich-text-area";
import type { EmbedEditorPort } from "#adapters";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface HandleEmbedInsertionParams {
	editorPort: EmbedEditorPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
