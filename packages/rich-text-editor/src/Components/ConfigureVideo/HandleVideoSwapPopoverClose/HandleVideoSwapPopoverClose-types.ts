import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { VideoInternals } from "../ConfigureVideo-types";

export interface HandleVideoSwapPopoverCloseParams {
	richTextEditorUI: RichTextEditorUI;
	internals: VideoInternals;
}
