import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "../../../Constants";
import type { HandleTodoListToolbarButtonStateParams } from "./HandleTodoListToolbarButtonState-types";

export const handleTodoListToolbarButtonState = ({
	editorPort,
	editorAPI,
	blockComponentPlacement,
}: HandleTodoListToolbarButtonStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canWrap = blockComponentPlacement.canWrapBySelection({
				allowedComponents: [componentsName.todoList],
			});

			editorPort.updateState({ toolbarButton: { disabled: !canWrap } });
		},
	});

	return () => {
		unsubscribe();
	};
};
