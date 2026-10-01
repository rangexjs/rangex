import { TodoList as TodoListFactory } from "@rangex/editor/todo-list";
import { toolbarButtonsName } from "#constants";
import { CheckboxListToolbarButton } from "#features";
import type { Extension } from "../_Utilities";

export const TodoList = (
	...adapterSettings: Parameters<typeof TodoListFactory>
): Extension => {
	return {
		createAdapter: () => TodoListFactory(...adapterSettings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.checkboxList]: CheckboxListToolbarButton,
			},
			floatingComponents: [],
		},
	};
};
