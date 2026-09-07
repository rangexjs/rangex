import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "#engine-links";
import type { HandleEmptyMediaToolbarButtonStateParams } from "./HandleEmptyMediaToolbarButtonState-types";

/**
 * Keeps the media button disabled when the selection is in a context that doesn't allow
 * media insertion.
 */
export const handleEmptyMediaToolbarButtonState = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleEmptyMediaToolbarButtonStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				allowedComponents: [componentsName.emptyMedia],
			});

			configPort.updateState({ canInsert });
		},
	});

	return () => {
		unsubscribe();
	};
};
