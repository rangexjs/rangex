import type { EditorAPI } from "rich-text-area";
import type { LinkPopover, RichTextEditorUI } from "#ui";
import type { LinkInternals } from "../ConfigureLink-types";

export type OnRemoveCallback = Parameters<LinkPopover["onRemove"]>[0];

export interface HandleLinkUnwrapParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	internals: LinkInternals;
}
