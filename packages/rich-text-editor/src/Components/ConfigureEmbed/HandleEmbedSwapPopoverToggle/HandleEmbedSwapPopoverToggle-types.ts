import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { BlockNestedContext } from "rich-text-area";
import type { EmbedInternals } from "../ConfigureEmbed-types";

export interface HandleEmbedSwapPopoverToggleParams {
	richTextEditorUI: RichTextEditorUI;
	getCurrentBlock: () => BlockNestedContext | null;
	internals: EmbedInternals;
}
