import {
	componentsName,
	createAnchoredOverlayController,
	createBlockComponentPlacement,
	createComponentLookup,
} from "#engine-links";
import { addERClass } from "#utilities";
import { handleComponentUnwrap } from "../_Utilities";
import type { ConfigureTableParams } from "./ConfigureTable-types";
import { handleTableContextMenuButtonsInteraction } from "./HandleTableContextMenuButtonsInteraction";
import { handleTableContextMenuButtonsState } from "./HandleTableContextMenuButtonsState";
import { handleTableContextMenuVisibility } from "./HandleTableContextMenuVisibility";
import { handleTableInsertion } from "./HandleTableInsertion";
import { handleTablePlacementState } from "./HandleTablePlacementState";

/*
 * Wires up all table feature handlers (insertion, toolbar state, context-menu visibility,
 * button state, and button interactions) and returns their combined cleanup.
 */
export const configureTable = ({
	adapterBus,
	configPort,
	editorAPI,
}: ConfigureTableParams) => {
	const componentLookup = createComponentLookup({ editorAPI });
	const blockComponentPlacement = createBlockComponentPlacement({
		editorAPI,
		adapterBus,
	});

	addERClass(configPort.contextMenuEl, "table-context-menu");

	const anchorController = createAnchoredOverlayController({
		element: configPort.contextMenuEl,
		options: {
			lightDismiss: false,
			closeOnEscape: false,
			onToggle: (open) => configPort.setContextMenu({ open }),
		},
	});

	const placementStateCleanup = handleTablePlacementState({
		configPort,
		editorAPI,
		componentLookup,
		blockComponentPlacement,
	});

	const unwrapCleanup = handleComponentUnwrap({
		port: configPort,
		editorAPI,
		getComponent: () =>
			componentLookup.closestBySelection({
				components: [componentsName.table],
			}),
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
		placementStateCleanup();
		unwrapCleanup();
		contextMenuVisibilityCleanup();
		contextMenuStateCleanup();
		contextMenuInteractionCleanup();
		tableInsertionCleanup();
		anchorController.cleanup();
	};
};
