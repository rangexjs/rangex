import { createBlockComponentPlacement } from "../../BlockComponentPlacement";
import type { ConfigureTodoListParams } from "./ConfigureTodoList-types";
import { handleTodoListCheckboxState } from "./HandleTodoListCheckboxState";
import { handleTodoListInsertion } from "./HandleTodoListInsertion";
import { handleTodoListToolbarButtonState } from "./HandleTodoListToolbarButtonState";

export const configureTodoList = ({
	editorPort,
	editorAPI,
}: ConfigureTodoListParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });

	const toolbarButtonStateCleanup = handleTodoListToolbarButtonState({
		editorPort,
		editorAPI,
		blockComponentPlacement,
	});

	const insertionCleanup = handleTodoListInsertion({
		editorPort,
		editorAPI,
		blockComponentPlacement,
	});

	const checkboxStateCleanup = handleTodoListCheckboxState({ editorAPI });

	return () => {
		toolbarButtonStateCleanup();
		insertionCleanup();
		checkboxStateCleanup();
	};
};
