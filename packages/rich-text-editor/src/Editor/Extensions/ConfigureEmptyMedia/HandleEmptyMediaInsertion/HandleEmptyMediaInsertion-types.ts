import type { BlockNestedContextLine, EditorAPI } from "rich-text-area";
import type { EmptyMediaEditorPort } from "#adapters";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface CreateEmptyMediaComponentResult
	extends BlockNestedContextLine {}

export interface HandleEmptyMediaInsertionParams {
	editorPort: EmptyMediaEditorPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
