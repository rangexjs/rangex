import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "../../../Constants";
import type { HandleSeparatorToolbarButtonStateParams } from "./HandleSeparatorToolbarButtonState-types";

export const handleSeparatorToolbarButtonState = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleSeparatorToolbarButtonStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				allowedComponents: [componentsName.separator],
			});

			configPort.updateState({ canInsert });
		},
	});

	return () => {
		unsubscribe();
	};
};
