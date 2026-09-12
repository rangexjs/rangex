import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "#engine-links";
import type { HandleTodoListToolbarButtonStateParams } from "./HandleTodoListToolbarButtonState-types";

/*
 * Keeps the todo list toolbar button's insert/wrap availability in sync with the current
 * selection. Returns a cleanup function.
 */
export const handleTodoListToolbarButtonState = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleTodoListToolbarButtonStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				allowedComponents: [componentsName.todoList],
			});
			const canWrap = blockComponentPlacement.canWrapBySelection({
				allowedComponents: [componentsName.todoList],
			});

			configPort.updateState({ canInsert, canWrap });
		},
	});

	return () => {
		unsubscribe();
	};
};
