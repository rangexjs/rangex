import type {
	LinkPopover,
	RichTextEditorUI,
} from "@rangex/rich-text-editor-ui";
import type { EditorAPI } from "rich-text-area";
import type { LinkInternals } from "../ConfigureLink-types";

export type OnModifyCallback = Parameters<LinkPopover["onModify"]>[0];

export interface HandleLinkModificationParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	internals: LinkInternals;
}
