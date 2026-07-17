import type { BlockNestedContext } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";
import type { VideoInternals } from "../ConfigureVideo-types";

export interface HandleVideoSwapPopoverToggleParams {
	richTextEditorUI: RichTextEditorUI;
	getCurrentBlock: () => BlockNestedContext | null;
	internals: VideoInternals;
}
