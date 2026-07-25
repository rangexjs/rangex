import { editorSelectionChangeEventType } from "rich-text-area";
import { ensureNodeRootStorage } from "../../../_Utilities";
import { componentsName } from "../../../Constants";
import { getClosestScopedEditable } from "../../../NodeQuery";
import { storageToOptions } from "../_Utilities";
import { ensureTemplateVariableRootStorage } from "../TemplateVariableStorage";
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
			const storage = ensureTemplateVariableRootStorage({ rootStorage });

			editorPort.updateState({
				toolbarButton: {
					disabled: !canInsert,
					options: storageToOptions({ storage }),
				},
			});
		},
	});

	return () => {
		unsubscribe();
	};
};
