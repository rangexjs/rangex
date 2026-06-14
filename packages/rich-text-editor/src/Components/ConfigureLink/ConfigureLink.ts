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

	handleLinkToolbarButtonState({ richTextEditorUI, editorAPI });

	handleToolbarLinkClick({ richTextEditorUI, editorAPI });

	handleLinkClick({ richTextEditorUI, editorAPI, internals });

	handleLinkInsertion({ richTextEditorUI, editorAPI, internals });

	handleLinkModification({ richTextEditorUI, editorAPI, internals });

	handleLinkUnwrap({ richTextEditorUI, editorAPI, internals });

	handleLinkPopoverClose({ richTextEditorUI, editorAPI, internals });
};
