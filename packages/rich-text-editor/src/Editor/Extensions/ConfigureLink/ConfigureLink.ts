import type { ConfigureLinkParams, LinkInternals } from "./ConfigureLink-types";
import { handleLinkClick } from "./HandleLinkClick";
import { handleLinkInsertion } from "./HandleLinkInsertion";
import { handleLinkModification } from "./HandleLinkModification";
import { handleLinkPopoverClose } from "./HandleLinkPopoverClose";
import { handleLinkToolbarButtonState } from "./HandleLinkToolbarButtonState";
import { handleLinkUnwrap } from "./HandleLinkUnwrap";
import { handleToolbarLinkClick } from "./HandleToolbarLinkClick";

export const configureLink = ({ linkPort, editorAPI }: ConfigureLinkParams) => {
	const internals: LinkInternals = { currentLink: null };

	const toolbarButtonStateCleanup = handleLinkToolbarButtonState({
		linkPort,
		editorAPI,
	});

	const toolbarLinkClickCleanup = handleToolbarLinkClick({
		linkPort,
		editorAPI,
	});

	const linkClickCleanup = handleLinkClick({
		linkPort,
		editorAPI,
		internals,
	});

	const linkInsertionCleanup = handleLinkInsertion({
		linkPort,
		editorAPI,
		internals,
	});

	const linkModificationCleanup = handleLinkModification({
		linkPort,
		editorAPI,
		internals,
	});

	const linkUnwrapCleanup = handleLinkUnwrap({
		linkPort,
		editorAPI,
		internals,
	});

	const linkPopoverCloseCleanup = handleLinkPopoverClose({
		linkPort,
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
