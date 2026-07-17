import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { BlockNestedContext } from "rich-text-area";
import type { VideoInternals } from "../ConfigureVideo-types";

export interface HandleVideoSwapPopoverToggleParams {
	richTextEditorUI: RichTextEditorUI;
	getCurrentBlock: () => BlockNestedContext | null;
	internals: VideoInternals;
}
