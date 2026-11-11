import { componentsName } from "#constants";
import { createBlockComponentPlacement } from "#engine-links";
import { handleComponentUnwrap, handleSelectionComponent } from "../_Utilities";
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
	const blockComponentPlacement = createBlockComponentPlacement({
		editorAPI,
		adapterBus,
	});

	const selectionComponentCleanup = handleSelectionComponent({
		port: configPort,
		editorAPI,
		componentName: componentsName.todoList,
	});

	const placementStateCleanup = handleTodoListPlacementState({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const unwrapCleanup = handleComponentUnwrap({
		port: configPort,
		editorAPI,
		getComponent: () => configPort.currentComponent,
	});

	const placementCleanup = handleTodoListPlacement({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const checkboxStateCleanup = handleTodoListCheckboxState({ editorAPI });

	return () => {
		selectionComponentCleanup();
		placementStateCleanup();
		unwrapCleanup();
		placementCleanup();
		checkboxStateCleanup();
	};
};
