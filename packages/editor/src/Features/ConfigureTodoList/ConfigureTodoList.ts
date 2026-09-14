import { createBlockComponentPlacement } from "#engine-links";
import type { ConfigureTodoListParams } from "./ConfigureTodoList-types";
import { handleTodoListCheckboxState } from "./HandleTodoListCheckboxState";
import { handleTodoListPlacement } from "./HandleTodoListPlacement";
import { handleTodoListPlacementState } from "./HandleTodoListPlacementState";

/*
 * Wires up the todo list block component: toolbar button state, insert/wrap placement,
 * and checkbox state syncing. Returns a cleanup function that tears down all of it.
 */
export const configureTodoList = ({
	configPort,
	editorAPI,
}: ConfigureTodoListParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });

	const placementStateCleanup = handleTodoListPlacementState({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const placementCleanup = handleTodoListPlacement({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const checkboxStateCleanup = handleTodoListCheckboxState({ editorAPI });

	return () => {
		placementStateCleanup();
		placementCleanup();
		checkboxStateCleanup();
	};
};
