import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "../../../Constants";
import type { HandleListToolbarButtonStateParams } from "./HandleListToolbarButtonState-types";

export const handleListToolbarButtonState = ({
	editorPort,
	editorAPI,
	blockComponentPlacement,
}: HandleListToolbarButtonStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canWrap = blockComponentPlacement.canWrapBySelection({
				allowedComponents: [componentsName.list],
			});

			editorPort.updateState({
				orderedListToolbarButton: { disabled: !canWrap },
				unorderedListToolbarButton: { disabled: !canWrap },
			});
		},
	});

	return () => {
		unsubscribe();
	};
};
