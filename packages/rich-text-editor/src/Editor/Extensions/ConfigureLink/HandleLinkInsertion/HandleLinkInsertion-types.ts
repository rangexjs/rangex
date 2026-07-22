import type {
	EditorAPI,
	EditorSelection,
	InlineNestedContext,
} from "rich-text-area";
import type { LinkEditorPort } from "#adapters";
import type { LinkInternals } from "../ConfigureLink-types";

export interface CreateLinkComponentParams {
	text: string;
	href: string;
	target: string;
}

export interface CreateLinkComponentResult extends InlineNestedContext {}

export interface SetSelectionToLinkEndParams {
	link: InlineNestedContext;
	selection: EditorSelection;
}

export interface AnchorPopoverToLinkParams {
	link: InlineNestedContext;
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
