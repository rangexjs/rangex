import type {
	EmbedEmitSwapParams,
	EmbedSwapPopover,
	RichTextEditorUI,
} from "@rangex/rich-text-editor-ui";
import type { EditorAPI } from "rich-text-area";
import type { EmbedInternals } from "../ConfigureEmbed-types";

export interface HandleEmbedSwapParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	internals: EmbedInternals;
}

export interface ResolveSwapSrcParams {
	embedEmitSwapParams: EmbedEmitSwapParams;
	embedSwapPopover: EmbedSwapPopover;
}

export type ResolveSwapSrcResult = string | null;
