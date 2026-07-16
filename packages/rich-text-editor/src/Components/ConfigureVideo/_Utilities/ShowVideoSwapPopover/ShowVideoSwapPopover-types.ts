import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { HTMLLayout } from "rich-text-area";
import type { VideoInternals } from "../../ConfigureVideo-types";

export interface ShowVideoSwapPopoverParams {
	richTextEditorUI: RichTextEditorUI;
	internals: VideoInternals;
	figure: HTMLLayout;
}
