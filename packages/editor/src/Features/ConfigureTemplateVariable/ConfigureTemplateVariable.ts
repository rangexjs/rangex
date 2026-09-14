import { handleCaretMenuAppearance } from "../_Utilities";
import { getTemplateVariableQuery } from "./_Utilities";
import type { ConfigureTemplateVariableParams } from "./ConfigureTemplateVariable-types";
import { handleTemplateVariableInsertion } from "./HandleTemplateVariableInsertion";
import { handleTemplateVariableSelect } from "./HandleTemplateVariableSelect";
import { handleTemplateVariableToolbarButtonState } from "./HandleTemplateVariableToolbarButtonState";
import { handleTemplateVariableUpdate } from "./HandleTemplateVariableUpdate";

/*
 * Wires up the template variable feature: toolbar button state, insertion, value updates,
 * caret-menu selection, and the caret menu's appearance while typing a {{query. Returns a
 * cleanup function.
 */
export const configureTemplateVariable = ({
	configPort,
	editorAPI,
}: ConfigureTemplateVariableParams) => {
	const toolbarButtonStateCleanup = handleTemplateVariableToolbarButtonState({
		configPort,
		editorAPI,
	});

	const insertionCleanup = handleTemplateVariableInsertion({
		configPort,
		editorAPI,
	});

	const updateCleanup = handleTemplateVariableUpdate({
		configPort,
		editorAPI,
	});

	const selectCleanup = handleTemplateVariableSelect({
		configPort,
		editorAPI,
	});

	const caretMenuCleanup = handleCaretMenuAppearance({
		port: configPort.caretMenu,
		editorAPI,
		getQuery: getTemplateVariableQuery,
		onQuery(query) {
			configPort.updateState({ query });
			return !!configPort.filteredItems.length;
		},
	});

	return () => {
		toolbarButtonStateCleanup();
		insertionCleanup();
		updateCleanup();
		selectCleanup();
		caretMenuCleanup();
	};
};
