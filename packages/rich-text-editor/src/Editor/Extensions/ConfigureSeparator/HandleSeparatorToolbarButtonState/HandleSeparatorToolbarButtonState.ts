import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "#ports";
import type { HandleSeparatorToolbarButtonStateParams } from "./HandleSeparatorToolbarButtonState-types";

export const handleSeparatorToolbarButtonState = ({
	editorPort,
	editorAPI,
	blockComponentPlacement,
}: HandleSeparatorToolbarButtonStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				allowedComponents: [componentsName.separator],
			});

			editorPort.updateState({ toolbarButton: { disabled: !canInsert } });
		},
	});

	return () => {
		unsubscribe();
	};
};
