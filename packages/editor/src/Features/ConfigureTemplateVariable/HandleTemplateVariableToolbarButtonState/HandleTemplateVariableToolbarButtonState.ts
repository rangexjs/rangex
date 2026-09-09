import { editorSelectionChangeEventType } from "rich-text-area";
import { ensureNodeRootStorage } from "#engine-links";
import { canInsertTemplateVariable, storageToOptions } from "../_Utilities";
import type { HandleTemplateVariableToolbarButtonStateParams } from "./HandleTemplateVariableToolbarButtonState-types";

export const handleTemplateVariableToolbarButtonState = ({
	configPort,
	editorAPI,
}: HandleTemplateVariableToolbarButtonStateParams) => {
	const { rootEditable } = editorAPI;

	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const selection = editorAPI.getEditorSelection();
			const { fromText } = selection.getBoundaryPoints();

			const canInsert = canInsertTemplateVariable({ fromText });

			const rootStorage = ensureNodeRootStorage({ rootEditable });

			configPort.updateState({
				canInsert,
				options: storageToOptions({ storage: rootStorage.templateVariable }),
			});
		},
	});

	return () => {
		unsubscribe();
	};
};
