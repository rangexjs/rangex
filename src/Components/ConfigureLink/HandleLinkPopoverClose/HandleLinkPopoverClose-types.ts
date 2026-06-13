import type {
	LinkPopover,
	RichTextEditorUI,
} from "@rangex/rich-text-editor-ui";
import type { EditorAPI } from "rich-text-area";
import type { LinkInternals } from "../ConfigureLink-types";

export interface CloseOnSelectionChangeParams {
	linkPopover: LinkPopover;
	editorAPI: EditorAPI;
	internals: LinkInternals;
}

export interface HandleLinkPopoverCancelParams {
	linkPopover: LinkPopover;
	internals: LinkInternals;
}

export interface RestoreFocusOnEscapeParams {
	linkPopover: LinkPopover;
	editorAPI: EditorAPI;
}

export interface OnPopoverCloseParams {
	linkPopover: LinkPopover;
	editorAPI: EditorAPI;
	internals: LinkInternals;
}

export interface HandleLinkPopoverCloseParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	internals: LinkInternals;
}
