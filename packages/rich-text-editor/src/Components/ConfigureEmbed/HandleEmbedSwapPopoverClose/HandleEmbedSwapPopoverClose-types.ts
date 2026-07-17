import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { EmbedInternals } from "../ConfigureEmbed-types";

export interface HandleEmbedSwapPopoverCloseParams {
	richTextEditorUI: RichTextEditorUI;
	internals: EmbedInternals;
}
