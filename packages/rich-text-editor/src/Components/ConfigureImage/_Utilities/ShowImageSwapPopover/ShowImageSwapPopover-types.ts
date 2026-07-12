import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { HTMLLayout } from "rich-text-area";
import type { ImageInternals } from "../../ConfigureImage-types";

export interface ShowImageSwapPopoverParams {
	richTextEditorUI: RichTextEditorUI;
	internals: ImageInternals;
	figure: HTMLLayout;
}
