import { createPopoverOverlayController } from "#engine-links";
import { handleComponentUnwrap } from "../_Utilities";
import type { ConfigureLinkParams, LinkInternals } from "./ConfigureLink-types";
import { handleLinkClick } from "./HandleLinkClick";
import { handleLinkInsertion } from "./HandleLinkInsertion";
import { handleLinkModification } from "./HandleLinkModification";
import { handleLinkOverlayClose } from "./HandleLinkOverlayClose";
import { handleLinkToolbarButtonState } from "./HandleLinkToolbarButtonState";
import { handleLinkToolbarClick } from "./HandleLinkToolbarClick";
import { handleLinkViewChange } from "./HandleLinkViewChange";

export const configureLink = ({
	configPort,
	editorAPI,
}: ConfigureLinkParams) => {
	const internals: LinkInternals = { currentLink: null };

	const popoverController = createPopoverOverlayController({
		element: configPort.overlayEl,
		options: {
			popover: "auto",
			onToggle: (isOpen) => {
				if (!isOpen) {
					editorAPI.focus();
				}
			},
		},
	});

	const toolbarButtonStateCleanup = handleLinkToolbarButtonState({
		configPort,
		editorAPI,
	});

	const toolbarClickCleanup = handleLinkToolbarClick({
		configPort,
		editorAPI,
		popoverController,
	});

	const clickCleanup = handleLinkClick({
		configPort,
		editorAPI,
		internals,
		popoverController,
	});

	const insertionCleanup = handleLinkInsertion({
		configPort,
		editorAPI,
		internals,
		popoverController,
	});

	const modificationCleanup = handleLinkModification({
		configPort,
		editorAPI,
		internals,
	});

	const unwrapCleanup = handleComponentUnwrap({
		port: configPort,
		editorAPI,
		getComponent: () => internals.currentLink,
	});

	const overlayCloseCleanup = handleLinkOverlayClose({
		configPort,
		editorAPI,
		internals,
		popoverController,
	});

	const viewChangeCleanup = handleLinkViewChange({ configPort });

	return () => {
		toolbarButtonStateCleanup();
		toolbarClickCleanup();
		clickCleanup();
		insertionCleanup();
		modificationCleanup();
		unwrapCleanup();
		overlayCloseCleanup();
		viewChangeCleanup();
	};
};
