import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { HTMLLayout } from "rich-text-area";
import type { EmbedInternals } from "../../ConfigureEmbed-types";

export interface ShowEmbedSwapPopoverParams {
	richTextEditorUI: RichTextEditorUI;
	internals: EmbedInternals;
	figure: HTMLLayout;
}
