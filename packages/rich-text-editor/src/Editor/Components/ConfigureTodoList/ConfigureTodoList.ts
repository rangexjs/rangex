import type { ConfigureTodoListParams } from "./ConfigureTodoList-types";
import { handleTodoListCheckboxState } from "./HandleTodoListCheckboxState";
import { handleTodoListInsertion } from "./HandleTodoListInsertion";
import { handleTodoListToolbarButtonState } from "./HandleTodoListToolbarButtonState";

export const configureTodoList = ({
	richTextEditorUI,
	editorAPI,
	blockComponentPlacement,
}: ConfigureTodoListParams) => {
	const toolbarButtonStateCleanup = handleTodoListToolbarButtonState({
		richTextEditorUI,
		editorAPI,
		blockComponentPlacement,
	});

	const insertionCleanup = handleTodoListInsertion({
		richTextEditorUI,
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
