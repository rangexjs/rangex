import { createAnchoredOverlayController } from "../../_Utilities";
import { handleComponentUnwrap } from "../_Utilities";
import type { ConfigureLinkParams, LinkInternals } from "./ConfigureLink-types";
import { handleLinkClick } from "./HandleLinkClick";
import { handleLinkInsertion } from "./HandleLinkInsertion";
import { handleLinkModification } from "./HandleLinkModification";
import { handleLinkOverlayClose } from "./HandleLinkOverlayClose";
import { handleLinkToolbarButtonState } from "./HandleLinkToolbarButtonState";
import { handleLinkViewChange } from "./HandleLinkViewChange";
import { handleToolbarLinkClick } from "./HandleToolbarLinkClick";

export const configureLink = ({
	editorPort,
	editorAPI,
}: ConfigureLinkParams) => {
	const internals: LinkInternals = { currentLink: null };

	editorPort.anchoredOverlay.mount();

	const anchorController = createAnchoredOverlayController({
		element: editorPort.anchoredOverlay.element,
	});

	const toolbarButtonStateCleanup = handleLinkToolbarButtonState({
		editorPort,
		editorAPI,
	});

	const toolbarLinkClickCleanup = handleToolbarLinkClick({
		editorPort,
		editorAPI,
		anchorController,
	});

	const linkClickCleanup = handleLinkClick({
		editorPort,
		editorAPI,
		internals,
		anchorController,
	});

	const linkInsertionCleanup = handleLinkInsertion({
		editorPort,
		editorAPI,
		internals,
		anchorController,
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

	const linkOverlayCloseCleanup = handleLinkOverlayClose({
		editorPort,
		editorAPI,
		internals,
		anchorController,
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
		linkOverlayCloseCleanup();
		linkViewChangeCleanup();
	};
};
