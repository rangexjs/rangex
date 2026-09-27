import { componentsName } from "#engine-links";
import { handleComponentPlacementState } from "../../_Utilities";
import type { HandleTodoListPlacementStateParams } from "./HandleTodoListPlacementState-types";

/*
 * Keeps the todo list toolbar button's insert/wrap availability in sync with the current selection and the editor
 * content. Returns a cleanup function.
 */
export const handleTodoListPlacementState = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleTodoListPlacementStateParams) => {
	return handleComponentPlacementState({
		editorAPI,
		updateState: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				scope: "nearest-multi-line",
				allowedComponents: [componentsName.todoList],
			});
			const canWrap = blockComponentPlacement.canWrapBySelection({
				scope: "nearest-multi-line",
				allowedComponents: [componentsName.todoList],
			});

			configPort.updateState({ canInsert, canWrap });
		},
	});
};
