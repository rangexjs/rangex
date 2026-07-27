import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "../../../Constants";
import type { HandleEmptyMediaToolbarButtonStateParams } from "./HandleEmptyMediaToolbarButtonState-types";

/**
 * Keeps the media button disabled when the selection is in a context that doesn't allow
 * media insertion.
 */
export const handleEmptyMediaToolbarButtonState = ({
	editorPort,
	editorAPI,
	blockComponentPlacement,
}: HandleEmptyMediaToolbarButtonStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				allowedComponents: [componentsName.emptyMedia],
			});

			editorPort.updateState({ toolbarButton: { disabled: !canInsert } });
		},
	});

	return () => {
		unsubscribe();
	};
};
