import { createAnchoredOverlayController } from "../../_Utilities";
import { createBlockComponentPlacement } from "../../BlockComponentPlacement";
import type { ConfigureTableParams } from "./ConfigureTable-types";
import { handleTableInsertion } from "./HandleTableInsertion";
import { handleTableQuickActionsButtonsInteraction } from "./HandleTableQuickActionsButtonsInteraction";
import { handleTableQuickActionsButtonsState } from "./HandleTableQuickActionsButtonsState";
import { handleTableQuickActionsButtonVisibility } from "./HandleTableQuickActionsButtonVisibility";
import { handleTableToolbarButtonState } from "./HandleTableToolbarButtonState";

export const configureTable = ({
	editorPort,
	editorAPI,
}: ConfigureTableParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });

	editorPort.anchoredOverlay.mount();

	const anchorController = createAnchoredOverlayController({
		element: editorPort.anchoredOverlay.element,
		options: {
			onToggle: (isOpen) => editorPort.updateState({ isOpen }),
		},
	});

	const toolbarButtonStateCleanup = handleTableToolbarButtonState({
		editorPort,
		editorAPI,
		blockComponentPlacement,
	});

	const quickActionsVisibilityCleanup = handleTableQuickActionsButtonVisibility(
		{
			editorAPI,
			anchorController,
		},
	);

	const quickActionsStateCleanup = handleTableQuickActionsButtonsState({
		editorPort,
		editorAPI,
	});

	const quickActionsInteractionCleanup =
		handleTableQuickActionsButtonsInteraction({ editorPort, editorAPI });

	const tableInsertionCleanup = handleTableInsertion({
		editorPort,
		editorAPI,
		blockComponentPlacement,
	});

	return () => {
		editorPort.anchoredOverlay.unmount();

		toolbarButtonStateCleanup();
		quickActionsVisibilityCleanup();
		quickActionsStateCleanup();
		quickActionsInteractionCleanup();
		tableInsertionCleanup();
	};
};
