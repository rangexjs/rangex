import { TodoListAdapter } from "#adapters";
import { configureTodoList } from "#editor-extensions";
import { toolbarButtonsName } from "#ports";
import { CheckboxListToolbarButton } from "#ui-extensions";
import { createExtension } from "../_Utilities";

export const TodoList = createExtension<typeof TodoListAdapter>({
	defaultSettings: {},
	createAdapter: (settings, options) => new TodoListAdapter(settings, options),
	configure: ({ adapter, editorAPI }) =>
		configureTodoList({ editorPort: adapter.editorPort, editorAPI }),
	components: {
		toolbarButtons: {
			[toolbarButtonsName.checkboxList]: CheckboxListToolbarButton,
		},
	},
});
