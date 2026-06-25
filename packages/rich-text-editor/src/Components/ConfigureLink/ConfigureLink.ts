import type { ConfigureLinkParams, LinkInternals } from "./ConfigureLink-types";
import { handleLinkClick } from "./HandleLinkClick";
import { handleLinkInsertion } from "./HandleLinkInsertion";
import { handleLinkModification } from "./HandleLinkModification";
import { handleLinkPopoverClose } from "./HandleLinkPopoverClose";
import { handleLinkToolbarButtonState } from "./HandleLinkToolbarButtonState";
import { handleLinkUnwrap } from "./HandleLinkUnwrap";
import { handleToolbarLinkClick } from "./HandleToolbarLinkClick";

export const configureLink = ({
	richTextEditorUI,
	editorAPI,
}: ConfigureLinkParams) => {
	const internals: LinkInternals = { currentLink: null };

	const toolbarButtonStateCleanup = handleLinkToolbarButtonState({
		richTextEditorUI,
		editorAPI,
	});
	const toolbarLinkClickCleanup = handleToolbarLinkClick({
		richTextEditorUI,
		editorAPI,
	});
	const linkClickCleanup = handleLinkClick({
		richTextEditorUI,
		editorAPI,
		internals,
	});
	const linkInsertionCleanup = handleLinkInsertion({
		richTextEditorUI,
		editorAPI,
		internals,
	});
	const linkModificationCleanup = handleLinkModification({
		richTextEditorUI,
		editorAPI,
		internals,
	});
	const linkUnwrapCleanup = handleLinkUnwrap({
		richTextEditorUI,
		editorAPI,
		internals,
	});
	const linkPopoverCloseCleanup = handleLinkPopoverClose({
		richTextEditorUI,
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
