import type {
	LinkPopover,
	RichTextEditorUI,
} from "@rangex/rich-text-editor-ui";
import type { EditorAPI, InlineNestedContext } from "rich-text-area";
import type { LinkInternals } from "../ConfigureLink-types";

export interface OpenLinkPopoverParams {
	linkPopover: LinkPopover;
	editorAPI: EditorAPI;
	internals: LinkInternals;
	link: InlineNestedContext;
}

export interface HandleLinkClickParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	internals: LinkInternals;
}
