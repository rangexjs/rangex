import type { EditorAPI } from "@rangex/core";

import type { TodoListConfigPort } from "#adapters/TodoList";
import type { BlockComponentPlacement } from "#engine-links";

export interface HandleTodoListPlacementParams {
	configPort: TodoListConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
