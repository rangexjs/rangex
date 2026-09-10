import type {
	EditorAPI,
	EditorSelection,
	InlineComponent,
} from "rich-text-area";
import type { LinkConfigPort } from "#adapters/Link";
import type { PopoverOverlayController } from "#engine-links";
import type { LinkInternals } from "../ConfigureLink-types";

export interface HandleLinkInsertionParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	popoverController: PopoverOverlayController;
}

export interface SetSelectionToLinkEndParams {
	link: InlineComponent;
	selection: EditorSelection;
}

export interface AnchorToLinkParams {
	link: InlineComponent;
	popoverController: PopoverOverlayController;
}

export interface InsertAtCaretParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	text: string;
	href: string;
	target: string;
	popoverController: PopoverOverlayController;
}

export interface WrapWithLinkParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	href: string;
	target: string;
	popoverController: PopoverOverlayController;
}
