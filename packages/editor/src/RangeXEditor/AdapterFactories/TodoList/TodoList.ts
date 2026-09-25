import {
	createTodoListAdapter,
	type TodoListSettings,
} from "#adapters/TodoList";
import { configureTodoList } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const TodoList: AdapterFactoryFn<TodoListSettings> = (settings) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createTodoListAdapter(settings, options);

		const cleanup = configureTodoList({
			adapterBus: options.adapterBus,
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.todoList = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
