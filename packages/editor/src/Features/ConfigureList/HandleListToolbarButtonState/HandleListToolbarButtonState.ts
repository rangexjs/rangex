import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "#engine-links";
import type { HandleListToolbarButtonStateParams } from "./HandleListToolbarButtonState-types";

/*
 * Updates the list toolbar button's enabled state on every selection change, based on whether
 * a list can be inserted or the selection wrapped in one.
 */
export const handleListToolbarButtonState = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleListToolbarButtonStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				allowedComponents: [componentsName.list],
			});
			const canWrap = blockComponentPlacement.canWrapBySelection({
				allowedComponents: [componentsName.list],
			});

			configPort.updateState({ canInsert, canWrap });
		},
	});

	return () => {
		unsubscribe();
	};
};
