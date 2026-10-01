import { TodoList as TodoListFactory } from "@rangex/editor/todo-list";
import { toolbarButtonsName } from "#constants";
import { CheckboxListToolbarButton } from "#features";
import type { Extension } from "../_Utilities";
import type { TodoListExtensionSettings } from "./TodoList-types";

export const TodoList = (settings: TodoListExtensionSettings): Extension => {
	return {
		createAdapter: () => TodoListFactory(settings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.checkboxList]: CheckboxListToolbarButton,
			},
			floatingComponents: [],
		},
	};
};
