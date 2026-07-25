import type { BlockNestedContextLine, EditorAPI } from "rich-text-area";
import type { TodoListEditorPort } from "#adapters";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface CreateTodoListLineResult extends BlockNestedContextLine {}

export interface HandleTodoListInsertionParams {
	editorPort: TodoListEditorPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
