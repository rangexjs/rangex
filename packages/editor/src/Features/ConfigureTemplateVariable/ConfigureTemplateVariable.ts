import {
	handleCaretMenuAppearance,
	handleComponentUnwrap,
} from "../_Utilities";
import { getTemplateVariableQuery } from "./_Utilities";
import type { ConfigureTemplateVariableParams } from "./ConfigureTemplateVariable-types";
import { handleTemplateVariableInsertion } from "./HandleTemplateVariableInsertion";
import { handleTemplateVariablePlacementState } from "./HandleTemplateVariablePlacementState";
import { handleTemplateVariableSelect } from "./HandleTemplateVariableSelect";
import { handleTemplateVariableUpdate } from "./HandleTemplateVariableUpdate";

/*
 * Wires up the template variable feature: toolbar button state, insertion, value updates,
 * caret-menu selection, unwrapping, and the caret menu's appearance while typing a {{query.
 * Returns a cleanup function.
 */
export const configureTemplateVariable = ({
	configPort,
	editorAPI,
}: ConfigureTemplateVariableParams) => {
	const placementStateCleanup = handleTemplateVariablePlacementState({
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

	const unwrapCleanup = handleComponentUnwrap({
		port: configPort,
		editorAPI,
		// TODO: resolve the component once template variable unwrapping is wired up
		getComponent: () => null,
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
		placementStateCleanup();
		insertionCleanup();
		updateCleanup();
		selectCleanup();
		unwrapCleanup();
		caretMenuCleanup();
	};
};
