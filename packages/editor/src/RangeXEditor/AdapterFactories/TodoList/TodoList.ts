import { createTodoListAdapter, type TodoListSettings } from "#adapters/TodoList";
import { configureTodoList } from "#features";

import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const TodoList: AdapterFactoryFn<TodoListSettings> = (settings) => {
	return (options, { editor }) => {
		const adapter = createTodoListAdapter(settings, options);

		editor.todoList = adapter.publicPort;

		return {
			configure({ editorAPI }) {
				const cleanup = configureTodoList({
					adapterBus: options.adapterBus,
					configPort: adapter.configPort,
					editorAPI,
				});

				return () => {
					cleanup();
				};
			},
		};
	};
};
