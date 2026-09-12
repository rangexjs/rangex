import {
	createAnchoredOverlayController,
	createBlockComponentPlacement,
} from "#engine-links";
import type { ConfigureTableParams } from "./ConfigureTable-types";
import { handleTableContextMenuButtonsInteraction } from "./HandleTableContextMenuButtonsInteraction";
import { handleTableContextMenuButtonsState } from "./HandleTableContextMenuButtonsState";
import { handleTableContextMenuVisibility } from "./HandleTableContextMenuVisibility";
import { handleTableInsertion } from "./HandleTableInsertion";
import { handleTableToolbarButtonState } from "./HandleTableToolbarButtonState";

export const configureTable = ({
	configPort,
	editorAPI,
}: ConfigureTableParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });

	const anchorController = createAnchoredOverlayController({
		element: configPort.contextMenuEl,
		options: {
			lightDismiss: false,
			closeOnEscape: false,
			onToggle: (open) => configPort.setContextMenu({ open }),
		},
	});

	const toolbarButtonStateCleanup = handleTableToolbarButtonState({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const contextMenuVisibilityCleanup = handleTableContextMenuVisibility({
		editorAPI,
		anchorController,
	});

	const contextMenuStateCleanup = handleTableContextMenuButtonsState({
		configPort,
		editorAPI,
	});

	const contextMenuInteractionCleanup =
		handleTableContextMenuButtonsInteraction({ configPort, editorAPI });

	const tableInsertionCleanup = handleTableInsertion({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	return () => {
		toolbarButtonStateCleanup();
		contextMenuVisibilityCleanup();
		contextMenuStateCleanup();
		contextMenuInteractionCleanup();
		tableInsertionCleanup();
	};
};
