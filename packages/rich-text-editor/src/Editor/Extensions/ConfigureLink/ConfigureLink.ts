import { handleComponentUnwrap } from "../_Utilities";
import type { ConfigureLinkParams, LinkInternals } from "./ConfigureLink-types";
import { handleLinkClick } from "./HandleLinkClick";
import { handleLinkInsertion } from "./HandleLinkInsertion";
import { handleLinkModification } from "./HandleLinkModification";
import { handleLinkPopoverClose } from "./HandleLinkPopoverClose";
import { handleLinkToolbarButtonState } from "./HandleLinkToolbarButtonState";
import { handleToolbarLinkClick } from "./HandleToolbarLinkClick";

export const configureLink = ({
	editorPort,
	editorAPI,
}: ConfigureLinkParams) => {
	const internals: LinkInternals = { currentLink: null };

	const toolbarButtonStateCleanup = handleLinkToolbarButtonState({
		editorPort,
		editorAPI,
	});

	const toolbarLinkClickCleanup = handleToolbarLinkClick({
		editorPort,
		editorAPI,
	});

	const linkClickCleanup = handleLinkClick({
		editorPort,
		editorAPI,
		internals,
	});

	const linkInsertionCleanup = handleLinkInsertion({
		editorPort,
		editorAPI,
		internals,
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

	const linkPopoverCloseCleanup = handleLinkPopoverClose({
		editorPort,
		editorAPI,
		internals,
	});

	return () => {
		toolbarButtonStateCleanup();
		toolbarLinkClickCleanup();
		linkClickCleanup();
		linkInsertionCleanup();
		linkModificationCleanup();
		linkUnwrapCleanup();
		linkPopoverCloseCleanup();
	};
};
