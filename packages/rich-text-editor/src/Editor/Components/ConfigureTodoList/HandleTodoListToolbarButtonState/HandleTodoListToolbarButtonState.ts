import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "../../../Constants";
import type { HandleTodoListToolbarButtonStateParams } from "./HandleTodoListToolbarButtonState-types";

export const handleTodoListToolbarButtonState = ({
	richTextEditorUI,
	editorAPI,
	blockComponentPlacement,
}: HandleTodoListToolbarButtonStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canWrap = blockComponentPlacement.canWrapBySelection({
				allowedComponents: [componentsName.todoList],
			});

			richTextEditorUI.updateNodeInsertionButtonState({
				checkboxList: { disabled: !canWrap },
			});
		},
	});

	return () => {
		unsubscribe();
	};
};
