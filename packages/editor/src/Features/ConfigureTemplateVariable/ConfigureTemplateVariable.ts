import { handleCaretMenuOverlayAppearance } from "../_Utilities";
import { getTemplateVariableQuery } from "./_Utilities";
import type { ConfigureTemplateVariableParams } from "./ConfigureTemplateVariable-types";
import { handleTemplateVariableInsertion } from "./HandleTemplateVariableInsertion";
import { handleTemplateVariableSelect } from "./HandleTemplateVariableSelect";
import { handleTemplateVariableToolbarButtonState } from "./HandleTemplateVariableToolbarButtonState";
import { handleTemplateVariableUpdate } from "./HandleTemplateVariableUpdate";

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

	const caretMenuCleanup = handleCaretMenuOverlayAppearance({
		port: configPort,
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
