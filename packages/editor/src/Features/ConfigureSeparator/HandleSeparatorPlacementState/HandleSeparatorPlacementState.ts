import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "#engine-links";
import type { HandleSeparatorPlacementStateParams } from "./HandleSeparatorPlacementState-types";

/*
 * Updates the separator toolbar button's enabled state on every selection change, based on
 * whether a separator can be inserted at the current selection.
 */
export const handleSeparatorPlacementState = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleSeparatorPlacementStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				scope: "nearest-multi-line",
				allowedComponents: [componentsName.separator],
			});

			configPort.updateState({ canInsert });
		},
	});

	return () => {
		unsubscribe();
	};
};
