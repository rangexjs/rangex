import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "#engine-links";
import type { HandleSeparatorToolbarButtonStateParams } from "./HandleSeparatorToolbarButtonState-types";

/*
 * Updates the separator toolbar button's enabled state on every selection change, based on
 * whether a separator can be inserted at the current selection.
 */
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
