import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "../../../Constants";
import type { HandleImageToolbarButtonStateParams } from "./HandleImageToolbarButtonState-types";

/**
 * Keeps the image button disabled when the selection is in a context that doesn't allow image insertion.
 */
export const handleImageToolbarButtonState = ({
	richTextEditorUI,
	editorAPI,
	blockComponentPlacement,
}: HandleImageToolbarButtonStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				allowedComponents: [componentsName.image],
			});

			richTextEditorUI.updateNodeInsertionButtonState({
				image: { disabled: !canInsert },
			});
		},
	});

	return () => {
		unsubscribe();
	};
};
