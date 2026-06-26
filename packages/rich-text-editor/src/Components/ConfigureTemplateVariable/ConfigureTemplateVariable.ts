import type { ConfigureTemplateVariableParams } from "./ConfigureTemplateVariable-types";
import { handleTemplateVariableInsertion } from "./HandleTemplateVariableInsertion";
import { handleTemplateVariableToolbarButtonState } from "./HandleTemplateVariableToolbarButtonState";
import { handleTemplateVariableUpdate } from "./HandleTemplateVariableUpdate";

export const configureTemplateVariable = ({
	richTextEditorUI,
	editorAPI,
}: ConfigureTemplateVariableParams) => {
	const toolbarButtonStateCleanup = handleTemplateVariableToolbarButtonState({
		richTextEditorUI,
		editorAPI,
	});

	const insertionCleanup = handleTemplateVariableInsertion({
		richTextEditorUI,
		editorAPI,
	});

	const updateCleanup = handleTemplateVariableUpdate({
		richTextEditorUI,
		editorAPI,
	});

	return () => {
		toolbarButtonStateCleanup();
		insertionCleanup();
		updateCleanup();
	};
};
