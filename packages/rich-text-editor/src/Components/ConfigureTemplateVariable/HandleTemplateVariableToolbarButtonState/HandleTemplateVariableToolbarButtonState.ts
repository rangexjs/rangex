import { editorSelectionChangeEventType } from "rich-text-area";
import { ensureRootEditableStorage } from "../../../_Utilities";
import { componentsName } from "../../../Constants";
import { getClosestScopedEditable } from "../../../NodeQuery";
import { storageToOptions } from "../_Utilities";
import { ensureTemplateVariableStorage } from "../TemplateVariableStorage";
import type { HandleTemplateVariableToolbarButtonStateParams } from "./HandleTemplateVariableToolbarButtonState-types";

export const handleTemplateVariableToolbarButtonState = ({
	richTextEditorUI,
	editorAPI,
}: HandleTemplateVariableToolbarButtonStateParams) => {
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

			const rootEditableStorage = ensureRootEditableStorage({
				rootEditable: editorAPI.rootEditable,
			});
			const storage = ensureTemplateVariableStorage({ rootEditableStorage });

			richTextEditorUI.updateNodeInsertionButtonState({
				templateVariable: {
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
