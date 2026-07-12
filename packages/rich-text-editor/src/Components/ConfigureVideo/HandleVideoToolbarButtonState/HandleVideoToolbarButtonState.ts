import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "../../../Constants";
import type { HandleVideoToolbarButtonStateParams } from "./HandleVideoToolbarButtonState-types";

/**
 * Keeps the video button disabled when the selection is in a context that doesn't allow video insertion.
 */
export const handleVideoToolbarButtonState = ({
	richTextEditorUI,
	editorAPI,
	blockComponentPlacement,
}: HandleVideoToolbarButtonStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				allowedComponents: [componentsName.video],
			});

			richTextEditorUI.updateNodeInsertionButtonState({
				video: { disabled: !canInsert },
			});
		},
	});

	return () => {
		unsubscribe();
	};
};
