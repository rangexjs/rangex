import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "#engine-links";
import type { HandleTodoListPlacementStateParams } from "./HandleTodoListPlacementState-types";

/*
 * Keeps the todo list toolbar button's insert/wrap availability in sync with the current
 * selection. Returns a cleanup function.
 * Also reports whether the selection is inside the component.
 */
export const handleTodoListPlacementState = ({
	configPort,
	editorAPI,
	componentLookup,
	blockComponentPlacement,
}: HandleTodoListPlacementStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				allowedComponents: [componentsName.todoList],
			});
			const canWrap = blockComponentPlacement.canWrapBySelection({
				allowedComponents: [componentsName.todoList],
			});

			const closestComponent = componentLookup.closestBlockBySelection({
				components: [componentsName.todoList],
			});
			const isActive = closestComponent !== null;

			configPort.updateState({ canInsert, canWrap, isActive });
		},
	});

	return () => {
		unsubscribe();
	};
};
