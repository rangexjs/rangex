import { TodoListAdapter } from "#adapters";
import { configureTodoList } from "#editor-extensions";
import { extensionsName, toolbarButtonsName } from "#ports";
import { CheckboxListToolbarButton } from "#ui-extensions";
import { createExtension } from "../_Utilities";

export const TodoList = createExtension({
	name: extensionsName.todoList,
	defaultSettings: {},
	createAdapter: () => new TodoListAdapter(),
	configure: ({ adapter, editorAPI }) =>
		configureTodoList({ editorPort: adapter.editorPort, editorAPI }),
	components: {
		toolbarButtons: {
			[toolbarButtonsName.checkboxList]: CheckboxListToolbarButton,
		},
	},
});
