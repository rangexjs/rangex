import type { EditorAPI } from "rich-text-area";
import type { EmptyMediaEditorPort } from "#adapters";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface HandleEmptyMediaInsertionParams {
	editorPort: EmptyMediaEditorPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
