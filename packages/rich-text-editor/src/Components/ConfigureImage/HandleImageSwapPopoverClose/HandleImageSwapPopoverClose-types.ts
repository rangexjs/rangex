import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { ImageInternals } from "../ConfigureImage-types";

export interface HandleImageSwapPopoverCloseParams {
	richTextEditorUI: RichTextEditorUI;
	internals: ImageInternals;
}
