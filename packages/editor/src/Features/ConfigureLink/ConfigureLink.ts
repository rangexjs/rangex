import { createPopoverOverlayController } from "#engine-links";
import {
	handleComponentUnwrap,
	handleSelectionMenuInteraction,
} from "../_Utilities";
import type { ConfigureLinkParams } from "./ConfigureLink-types";
import { handleDisplayTextRegistration } from "./HandleDisplayTextRegistration";
import { handleLinkInsertion } from "./HandleLinkInsertion";
import { handleLinkInteraction } from "./HandleLinkInteraction";
import { handleLinkMenuClose } from "./HandleLinkMenuClose";
import { handleLinkModification } from "./HandleLinkModification";
import { handleLinkPlacementState } from "./HandleLinkPlacementState";
import { handleSelectionMenuOpen } from "./HandleSelectionMenuOpen";

/*
 * Wires up the link feature: selection menu appearance, display text, placement state, menu
 * open/close, interaction tracking, insertion, modification, and unwrap handling. Returns a
 * cleanup function that tears down all of it.
 */
export const configureLink = ({
	configPort,
	editorAPI,
}: ConfigureLinkParams) => {
	const {
		selectionMenuPopoverController,
		cleanup: selectionMenuInteractionCleanup,
	} = handleSelectionMenuInteraction({
		configPort: configPort.selectionMenu,
		editorAPI,
	});

	const linkMenuPopoverController = createPopoverOverlayController({
		element: configPort.linkMenuEl,
		options: {
			lightDismiss: true,
			closeOnEscape: true,
			onToggle: () => {
				configPort.notifyLinkMenuToggle();
			},
			onEscape: () => {
				editorAPI.focus();
			},
		},
	});

	handleDisplayTextRegistration({ configPort, editorAPI });

	const placementStateCleanup = handleLinkPlacementState({
		configPort,
		editorAPI,
	});

	const menuOpenCleanup = handleSelectionMenuOpen({
		configPort: configPort.selectionMenu,
		editorAPI,
		selectionMenuPopoverController,
	});

	const linkInteractionCleanup = handleLinkInteraction({
		configPort,
		editorAPI,
		linkMenuPopoverController,
	});

	const insertionCleanup = handleLinkInsertion({
		configPort,
		editorAPI,
		linkMenuPopoverController,
	});

	const modificationCleanup = handleLinkModification({
		configPort,
		editorAPI,
	});

	const unwrapCleanup = handleComponentUnwrap({
		port: configPort,
		editorAPI,
		getComponent: () => configPort.currentComponent,
	});

	const menuCloseCleanup = handleLinkMenuClose({
		configPort,
		editorAPI,
		linkMenuPopoverController,
	});

	return () => {
		selectionMenuInteractionCleanup();
		placementStateCleanup();
		menuOpenCleanup();
		linkInteractionCleanup();
		insertionCleanup();
		modificationCleanup();
		unwrapCleanup();
		menuCloseCleanup();
		linkMenuPopoverController.cleanup();
	};
};
