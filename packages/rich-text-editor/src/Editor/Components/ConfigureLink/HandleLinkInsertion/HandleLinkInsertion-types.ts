import type {
	EditorAPI,
	EditorSelection,
	InlineNestedContext,
} from "rich-text-area";
import type { LinkPort } from "#ports";
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
	popover: HTMLDivElement;
}

export interface InsertAtCaretParams {
	linkPort: LinkPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	text: string;
	href: string;
	target: string;
}

export interface WrapWithLinkParams {
	linkPort: LinkPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	href: string;
	target: string;
}

export type OnInsertCallback = Parameters<LinkPort["onInsert"]>[0];

export interface HandleLinkInsertionParams {
	linkPort: LinkPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
}
