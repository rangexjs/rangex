import type {
	LinkPopover,
	RichTextEditorUI,
} from "@rangex/rich-text-editor-ui";
import type { EditorAPI } from "rich-text-area";
import type { LinkInternals } from "../ConfigureLink-types";

export type OnRemoveCallback = Parameters<LinkPopover["onRemove"]>[0];

export interface HandleLinkUnwrapParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	internals: LinkInternals;
}
