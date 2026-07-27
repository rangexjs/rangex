import type { ConfigureTemplateVariableParams } from "./ConfigureTemplateVariable-types";
import { handleTemplateVariableInsertion } from "./HandleTemplateVariableInsertion";
import { handleTemplateVariablePopoverAppearance } from "./HandleTemplateVariablePopoverAppearance";
import { handleTemplateVariablePopoverClose } from "./HandleTemplateVariablePopoverClose";
import { handleTemplateVariablePopoverInsertion } from "./HandleTemplateVariablePopoverInsertion";
import { handleTemplateVariableToolbarButtonState } from "./HandleTemplateVariableToolbarButtonState";
import { handleTemplateVariableUpdate } from "./HandleTemplateVariableUpdate";

export const configureTemplateVariable = ({
	editorPort,
	editorAPI,
}: ConfigureTemplateVariableParams) => {
	const toolbarButtonStateCleanup = handleTemplateVariableToolbarButtonState({
		editorPort,
		editorAPI,
	});

	const insertionCleanup = handleTemplateVariableInsertion({
		editorPort,
		editorAPI,
	});

	const updateCleanup = handleTemplateVariableUpdate({
		editorPort,
		editorAPI,
	});

	const popoverInsertionCleanup = handleTemplateVariablePopoverInsertion({
		editorPort,
		editorAPI,
	});

	// Close must be subscribed before appearance — both listen to selection changes and close must fire first
	const popoverCloseCleanup = handleTemplateVariablePopoverClose({
		editorPort,
		editorAPI,
	});

	const popoverAppearanceCleanup = handleTemplateVariablePopoverAppearance({
		editorPort,
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
