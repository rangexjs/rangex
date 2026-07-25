import type { EditorAPI } from "rich-text-area";
import type { TodoListEditorPort } from "#adapters";

export interface ConfigureTodoListParams {
	editorPort: TodoListEditorPort;
	editorAPI: EditorAPI;
}
