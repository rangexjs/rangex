import type { EditorAPI } from "rich-text-area";
import type { TodoListConfigPort } from "#adapters/TodoList";

export interface ConfigureTodoListParams {
	configPort: TodoListConfigPort;
	editorAPI: EditorAPI;
}
