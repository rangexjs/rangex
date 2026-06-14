import type {
	LinkPopover,
	RichTextEditorUI,
} from "@rangex/rich-text-editor-ui";
import type {
	EditorAPI,
	EditorSelection,
	InlineNestedContext,
} from "rich-text-area";
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
	linkPopover: LinkPopover;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	text: string;
	href: string;
	target: string;
}

export interface WrapWithLinkParams {
	linkPopover: LinkPopover;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	href: string;
	target: string;
}

export type OnInsertCallback = Parameters<LinkPopover["onInsert"]>[0];

export interface HandleLinkInsertionParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	internals: LinkInternals;
}
