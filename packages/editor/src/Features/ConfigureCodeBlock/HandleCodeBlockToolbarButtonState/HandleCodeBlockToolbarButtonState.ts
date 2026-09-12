import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "#engine-links";
import type { HandleCodeBlockToolbarButtonStateParams } from "./HandleCodeBlockToolbarButtonState-types";

/*
 * Keeps the code block toolbar button's insert/wrap availability in sync with the current
 * selection. Returns a cleanup function.
 */
export const handleCodeBlockToolbarButtonState = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleCodeBlockToolbarButtonStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				allowedComponents: [componentsName.codeBlock],
			});
			const canWrap = blockComponentPlacement.canWrapBySelection({
				allowedComponents: [componentsName.codeBlock],
			});

			configPort.updateState({ canInsert, canWrap });
		},
	});

	return () => {
		unsubscribe();
	};
};
