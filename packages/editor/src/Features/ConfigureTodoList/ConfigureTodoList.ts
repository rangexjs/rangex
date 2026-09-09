import { createBlockComponentPlacement } from "#engine-links";
import type { ConfigureTodoListParams } from "./ConfigureTodoList-types";
import { handleTodoListCheckboxState } from "./HandleTodoListCheckboxState";
import { handleTodoListPlacement } from "./HandleTodoListPlacement";
import { handleTodoListToolbarButtonState } from "./HandleTodoListToolbarButtonState";

export const configureTodoList = ({
	configPort,
	editorAPI,
}: ConfigureTodoListParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });

	const toolbarButtonStateCleanup = handleTodoListToolbarButtonState({
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
		toolbarButtonStateCleanup();
		placementCleanup();
		checkboxStateCleanup();
	};
};
