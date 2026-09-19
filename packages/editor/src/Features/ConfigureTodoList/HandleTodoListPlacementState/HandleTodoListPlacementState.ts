import { componentsName } from "#engine-links";
import { handleComponentPlacementState } from "../../_Utilities";
import type { HandleTodoListPlacementStateParams } from "./HandleTodoListPlacementState-types";

/*
 * Keeps the todo list toolbar button's insert/wrap availability and active state in sync with the current selection and the editor
 * content. Returns a cleanup function.
 */
export const handleTodoListPlacementState = ({
	configPort,
	editorAPI,
	componentLookup,
	blockComponentPlacement,
}: HandleTodoListPlacementStateParams) => {
	return handleComponentPlacementState({
		editorAPI,
		updateState: () => {
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
};
