import type { EditorAPI } from "rich-text-area";
import type { TodoListConfigPort } from "#adapters/TodoList";
import type { BlockComponentPlacement, ComponentLookup } from "#engine-links";

export interface HandleTodoListPlacementStateParams {
	configPort: TodoListConfigPort;
	editorAPI: EditorAPI;
	componentLookup: ComponentLookup;
	blockComponentPlacement: BlockComponentPlacement;
}
