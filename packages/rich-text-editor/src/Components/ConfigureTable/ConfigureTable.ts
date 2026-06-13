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
	handleTableToolbarButtonState({
		richTextEditorUI,
		editorAPI,
		blockComponentPlacement,
	});

	handleTableQuickActionsButtonVisibility({ richTextEditorUI, editorAPI });

	handleTableQuickActionsButtonsState({ richTextEditorUI, editorAPI });

	handleTableQuickActionsButtonsInteraction({ richTextEditorUI, editorAPI });

	handleTableInsertion({
		richTextEditorUI,
		editorAPI,
		blockComponentPlacement,
	});
};
