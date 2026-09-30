import type { EditorAPI, EditorSelection, InlineComponent } from "@rangex/core";
import type { LinkConfigPort } from "#adapters/Link";
import type { PopoverOverlayController } from "#engine-links";

export interface HandleLinkInsertionParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
	linkMenuPopoverController: PopoverOverlayController;
}

export interface SetSelectionToLinkEndParams {
	link: InlineComponent;
	selection: EditorSelection;
}

export interface AnchorToLinkParams {
	link: InlineComponent;
	linkMenuPopoverController: PopoverOverlayController;
}

export interface InsertAtCaretParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
	text: string;
	linkMenuPopoverController: PopoverOverlayController;
	afterInsertion?: (link: HTMLElement) => void;
}

export interface WrapWithLinkParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
	linkMenuPopoverController: PopoverOverlayController;
	afterInsertion?: (link: HTMLElement) => void;
}
