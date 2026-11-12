import { componentsName } from "#constants";
import { linkAttrsShape, normalizeLinkAttrs } from "#dom-attrs";
import { createPopoverOverlayController } from "#engine-links";

import {
	getLinkParts,
	handleComponentUnwrap,
	handleDOMAttrs,
	handleSelectionComponent,
	handleSelectionMenuInteraction,
} from "../_Utilities";
import type { ConfigureLinkParams } from "./ConfigureLink-types";
import { handleDisplayTextChange } from "./HandleDisplayTextChange";
import { handleDisplayTextRegistration } from "./HandleDisplayTextRegistration";
import { handleLinkInsertion } from "./HandleLinkInsertion";
import { handleLinkInteraction } from "./HandleLinkInteraction";
import { handleLinkMenuClose } from "./HandleLinkMenuClose";
import { handleLinkPlacementState } from "./HandleLinkPlacementState";
import { handleSelectionMenuOpen } from "./HandleSelectionMenuOpen";

/*
 * Wires up the link feature: selection menu appearance, display text, placement state, menu
 * open/close, interaction tracking, insertion, display text change, and unwrap handling. Returns a
 * cleanup function that tears down all of it.
 */
export const configureLink = ({ configPort, editorAPI }: ConfigureLinkParams) => {
	const selectionComponentCleanup = handleSelectionComponent({
		port: configPort,
		editorAPI,
		componentName: componentsName.link,
	});

	const { selectionMenuPopoverController, cleanup: selectionMenuInteractionCleanup } =
		handleSelectionMenuInteraction({
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

	const displayTextChangeCleanup = handleDisplayTextChange({
		configPort,
		editorAPI,
	});

	const domAttrsCleanup = handleDOMAttrs({
		currentComponentPort: configPort,
		domAttrsPort: configPort,
		editorAPI,
		componentAttrsShape: linkAttrsShape,
		componentAttrValidators: configPort.attrValidators,
		normalizeDOMAttrs: normalizeLinkAttrs,
		resolveElements: (link) => getLinkParts({ link }),
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
		selectionComponentCleanup();
		selectionMenuInteractionCleanup();
		placementStateCleanup();
		menuOpenCleanup();
		linkInteractionCleanup();
		insertionCleanup();
		displayTextChangeCleanup();
		domAttrsCleanup();
		unwrapCleanup();
		menuCloseCleanup();
		linkMenuPopoverController.cleanup();
	};
};
