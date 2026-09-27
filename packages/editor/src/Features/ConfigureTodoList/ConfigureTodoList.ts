import {
	componentsName,
	createBlockComponentPlacement,
	createComponentLookup,
} from "#engine-links";
import { handleComponentUnwrap } from "../_Utilities";
import type { ConfigureTodoListParams } from "./ConfigureTodoList-types";
import { handleTodoListCheckboxState } from "./HandleTodoListCheckboxState";
import { handleTodoListPlacement } from "./HandleTodoListPlacement";
import { handleTodoListPlacementState } from "./HandleTodoListPlacementState";

/*
 * Wires up the todo list block component: toolbar button state, insert/wrap placement,
 * and checkbox state syncing. Returns a cleanup function that tears down all of it.
 */
export const configureTodoList = ({
	adapterBus,
	configPort,
	editorAPI,
}: ConfigureTodoListParams) => {
	const componentLookup = createComponentLookup({ editorAPI });
	const blockComponentPlacement = createBlockComponentPlacement({
		editorAPI,
		adapterBus,
	});

	const placementStateCleanup = handleTodoListPlacementState({
		configPort,
		editorAPI,
		componentLookup,
		blockComponentPlacement,
	});

	const unwrapCleanup = handleComponentUnwrap({
		port: configPort,
		editorAPI,
		getComponent: () =>
			componentLookup.closestBySelection({
				components: [componentsName.todoList],
			}),
	});

	const placementCleanup = handleTodoListPlacement({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const checkboxStateCleanup = handleTodoListCheckboxState({ editorAPI });

	return () => {
		placementStateCleanup();
		unwrapCleanup();
		placementCleanup();
		checkboxStateCleanup();
	};
};
