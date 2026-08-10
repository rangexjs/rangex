import { createPopoverOverlayController } from "../../_Utilities";
import { handleComponentUnwrap } from "../_Utilities";
import type { ConfigureLinkParams, LinkInternals } from "./ConfigureLink-types";
import { handleLinkClick } from "./HandleLinkClick";
import { handleLinkInsertion } from "./HandleLinkInsertion";
import { handleLinkModification } from "./HandleLinkModification";
import { handleLinkToolbarButtonState } from "./HandleLinkToolbarButtonState";
import { handleLinkViewChange } from "./HandleLinkViewChange";
import { handleOverlayClose } from "./HandleOverlayClose";
import { handleToolbarLinkClick } from "./HandleToolbarLinkClick";

export const configureLink = ({
	editorPort,
	editorAPI,
}: ConfigureLinkParams) => {
	const internals: LinkInternals = { currentLink: null };

	editorPort.anchoredOverlay.mount();

	const popoverController = createPopoverOverlayController({
		element: editorPort.anchoredOverlay.element,
		options: {
			popover: "auto",
			onToggle: (isOpen) => !isOpen && editorAPI.focus(),
		},
	});

	const toolbarButtonStateCleanup = handleLinkToolbarButtonState({
		editorPort,
		editorAPI,
	});

	const toolbarLinkClickCleanup = handleToolbarLinkClick({
		editorPort,
		editorAPI,
		popoverController,
	});

	const linkClickCleanup = handleLinkClick({
		editorPort,
		editorAPI,
		internals,
		popoverController,
	});

	const linkInsertionCleanup = handleLinkInsertion({
		editorPort,
		editorAPI,
		internals,
		popoverController,
	});

	const linkModificationCleanup = handleLinkModification({
		editorPort,
		editorAPI,
		internals,
	});

	const linkUnwrapCleanup = handleComponentUnwrap({
		port: editorPort,
		editorAPI,
		getComponent: () => internals.currentLink,
	});

	const overlayCloseCleanup = handleOverlayClose({
		editorPort,
		editorAPI,
		internals,
		popoverController,
	});

	const linkViewChangeCleanup = handleLinkViewChange({ editorPort });

	return () => {
		editorPort.anchoredOverlay.unmount();

		toolbarButtonStateCleanup();
		toolbarLinkClickCleanup();
		linkClickCleanup();
		linkInsertionCleanup();
		linkModificationCleanup();
		linkUnwrapCleanup();
		overlayCloseCleanup();
		linkViewChangeCleanup();
	};
};
