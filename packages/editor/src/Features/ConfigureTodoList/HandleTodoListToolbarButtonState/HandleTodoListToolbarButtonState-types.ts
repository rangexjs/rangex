import type { EditorAPI } from "rich-text-area";
import type { TodoListConfigPort } from "#adapters/TodoList";
import type { BlockComponentPlacement } from "#engine-links";

export interface HandleTodoListToolbarButtonStateParams {
	configPort: TodoListConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
