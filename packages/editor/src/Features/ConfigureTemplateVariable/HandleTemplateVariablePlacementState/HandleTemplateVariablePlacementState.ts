import { editorSelectionChangeEventType } from "rich-text-area";
import { ensureNodeRootStorage } from "#engine-links";
import { canInsertTemplateVariable, storageToOptions } from "../_Utilities";
import type { HandleTemplateVariablePlacementStateParams } from "./HandleTemplateVariablePlacementState-types";

/*
 * Subscribes to selection changes and keeps the toolbar button's state in sync: whether a
 * template variable can be inserted, and the current stored option values. Returns a cleanup
 * function.
 */
export const handleTemplateVariablePlacementState = ({
	configPort,
	editorAPI,
}: HandleTemplateVariablePlacementStateParams) => {
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
