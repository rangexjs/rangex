import type { BlockNestedContext } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";
import type { EmbedInternals } from "../ConfigureEmbed-types";

export interface HandleEmbedSwapPopoverToggleParams {
	richTextEditorUI: RichTextEditorUI;
	getCurrentBlock: () => BlockNestedContext | null;
	internals: EmbedInternals;
}
