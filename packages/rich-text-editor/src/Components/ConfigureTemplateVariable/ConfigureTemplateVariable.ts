import type { ConfigureTemplateVariableParams } from "./ConfigureTemplateVariable-types";
import { handleTemplateVariableInsertion } from "./HandleTemplateVariableInsertion";
import { handleTemplateVariablePopoverAppearance } from "./HandleTemplateVariablePopoverAppearance";
import { handleTemplateVariablePopoverClose } from "./HandleTemplateVariablePopoverClose";
import { handleTemplateVariablePopoverInsertion } from "./HandleTemplateVariablePopoverInsertion";
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

	const popoverInsertionCleanup = handleTemplateVariablePopoverInsertion({
		richTextEditorUI,
		editorAPI,
	});

	// Close must be subscribed before appearance — both listen to selection changes and close must fire first
	const popoverCloseCleanup = handleTemplateVariablePopoverClose({
		richTextEditorUI,
		editorAPI,
	});

	const popoverAppearanceCleanup = handleTemplateVariablePopoverAppearance({
		richTextEditorUI,
		editorAPI,
	});

	return () => {
		toolbarButtonStateCleanup();
		insertionCleanup();
		updateCleanup();
		popoverInsertionCleanup();
		popoverCloseCleanup();
		popoverAppearanceCleanup();
	};
};
