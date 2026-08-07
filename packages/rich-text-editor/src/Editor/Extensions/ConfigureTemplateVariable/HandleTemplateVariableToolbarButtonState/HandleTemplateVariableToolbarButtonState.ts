import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "#ports";
import { getClosestScopedEditable } from "../../../NodeQuery";
import { ensureNodeRootStorage } from "../../../Storage";
import { storageToOptions } from "../_Utilities";
import type { HandleTemplateVariableToolbarButtonStateParams } from "./HandleTemplateVariableToolbarButtonState-types";

export const handleTemplateVariableToolbarButtonState = ({
	editorPort,
	editorAPI,
}: HandleTemplateVariableToolbarButtonStateParams) => {
	const { rootEditable } = editorAPI;

	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const selection = editorAPI.getEditorSelection();
			const { fromText } = selection.getBoundaryPoints();

			const scopedEditable = getClosestScopedEditable({ fromNode: fromText });

			if (!scopedEditable) {
				throw new Error("Expected a ScopedEditable at the selection boundary.");
			}

			const { $$allowedComponents } = scopedEditable;
			const canInsert =
				$$allowedComponents === null ||
				$$allowedComponents.includes(componentsName.templateVariable);

			const rootStorage = ensureNodeRootStorage({ rootEditable });

			editorPort.updateState({
				toolbarButton: {
					disabled: !canInsert,
					options: storageToOptions({ storage: rootStorage.templateVariable }),
				},
			});
		},
	});

	return () => {
		unsubscribe();
	};
};
