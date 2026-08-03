import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "#ports";
import type { HandleCodeBlockToolbarButtonStateParams } from "./HandleCodeBlockToolbarButtonState-types";

export const handleCodeBlockToolbarButtonState = ({
	editorPort,
	editorAPI,
	blockComponentPlacement,
}: HandleCodeBlockToolbarButtonStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canWrap = blockComponentPlacement.canWrapBySelection({
				allowedComponents: [componentsName.codeBlock],
			});

			editorPort.updateState({ toolbarButton: { disabled: !canWrap } });
		},
	});

	return () => {
		unsubscribe();
	};
};
