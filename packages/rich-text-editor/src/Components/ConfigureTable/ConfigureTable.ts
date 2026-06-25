import type { ConfigureTableParams } from "./ConfigureTable-types";
import { handleTableInsertion } from "./HandleTableInsertion";
import { handleTableQuickActionsButtonsInteraction } from "./HandleTableQuickActionsButtonsInteraction";
import { handleTableQuickActionsButtonsState } from "./HandleTableQuickActionsButtonsState";
import { handleTableQuickActionsButtonVisibility } from "./HandleTableQuickActionsButtonVisibility";
import { handleTableToolbarButtonState } from "./HandleTableToolbarButtonState";

export const configureTable = ({
	richTextEditorUI,
	editorAPI,
	blockComponentPlacement,
}: ConfigureTableParams) => {
	const toolbarButtonStateCleanup = handleTableToolbarButtonState({
		richTextEditorUI,
		editorAPI,
		blockComponentPlacement,
	});

	const quickActionsVisibilityCleanup = handleTableQuickActionsButtonVisibility(
		{
			richTextEditorUI,
			editorAPI,
		},
	);

	const quickActionsStateCleanup = handleTableQuickActionsButtonsState({
		richTextEditorUI,
		editorAPI,
	});

	const quickActionsInteractionCleanup =
		handleTableQuickActionsButtonsInteraction({ richTextEditorUI, editorAPI });

	const tableInsertionCleanup = handleTableInsertion({
		richTextEditorUI,
		editorAPI,
		blockComponentPlacement,
	});

	return () => {
		toolbarButtonStateCleanup();
		quickActionsVisibilityCleanup();
		quickActionsStateCleanup();
		quickActionsInteractionCleanup();
		tableInsertionCleanup();
	};
};
