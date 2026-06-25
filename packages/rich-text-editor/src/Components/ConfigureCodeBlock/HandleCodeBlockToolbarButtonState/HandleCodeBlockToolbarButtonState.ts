import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "../../../Constants";
import type { HandleCodeBlockToolbarButtonStateParams } from "./HandleCodeBlockToolbarButtonState-types";

export const handleCodeBlockToolbarButtonState = ({
	richTextEditorUI,
	editorAPI,
	blockComponentPlacement,
}: HandleCodeBlockToolbarButtonStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canWrap = blockComponentPlacement.canWrapBySelection({
				allowedComponents: [componentsName.codeBlock],
			});

			richTextEditorUI.updateNodeInsertionButtonState({
				codeBlock: { disabled: !canWrap },
			});
		},
	});

	return () => {
		unsubscribe();
	};
};
