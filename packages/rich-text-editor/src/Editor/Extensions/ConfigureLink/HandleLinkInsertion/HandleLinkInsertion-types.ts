import type {
	EditorAPI,
	EditorSelection,
	InlineComponent,
} from "rich-text-area";
import type { LinkEditorPort } from "#adapters";
import type { LinkInternals } from "../ConfigureLink-types";

export interface SetSelectionToLinkEndParams {
	link: InlineComponent;
	selection: EditorSelection;
}

export interface AnchorPopoverToLinkParams {
	link: InlineComponent;
	editorPort: LinkEditorPort;
}

export interface InsertAtCaretParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	text: string;
	href: string;
	target: string;
}

export interface WrapWithLinkParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	href: string;
	target: string;
}

export type OnInsertCallback = Parameters<LinkEditorPort["onInsert"]>[0];

export interface HandleLinkInsertionParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
}
