import type { EditorAPI } from "rich-text-area";
import type { TodoListEditorPort } from "#adapters";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface HandleTodoListToolbarButtonStateParams {
	editorPort: TodoListEditorPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
