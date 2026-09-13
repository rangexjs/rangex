import { createPopoverOverlayController } from "#engine-links";
import {
	handleComponentUnwrap,
	handleSelectionMenuAppearance,
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
		cleanup: selectionMenuAppearanceCleanup,
	} = handleSelectionMenuAppearance({
		configPort,
		editorAPI,
	});

	const linkMenuPopoverController = createPopoverOverlayController({
		element: configPort.linkMenuEl,
		options: {
			lightDismiss: true,
			closeOnEscape: true,
			onToggle: () => {
				configPort.emitLinkMenuToggle();
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
		configPort,
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
		selectionMenuAppearanceCleanup();
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
