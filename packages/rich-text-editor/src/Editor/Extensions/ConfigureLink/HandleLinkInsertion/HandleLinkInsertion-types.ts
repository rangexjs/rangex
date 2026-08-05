import type {
	EditorAPI,
	EditorSelection,
	InlineComponent,
} from "rich-text-area";
import type { LinkEditorPort } from "#adapters";
import type { AnchoredOverlayController } from "../../../_Utilities";
import type { LinkInternals } from "../ConfigureLink-types";

export interface SetSelectionToLinkEndParams {
	link: InlineComponent;
	selection: EditorSelection;
}

export interface AnchorToLinkParams {
	link: InlineComponent;
	anchorController: AnchoredOverlayController;
}

export interface InsertAtCaretParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	text: string;
	href: string;
	target: string;
	anchorController: AnchoredOverlayController;
}

export interface WrapWithLinkParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	href: string;
	target: string;
	anchorController: AnchoredOverlayController;
}

export interface HandleLinkInsertionParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	anchorController: AnchoredOverlayController;
}
