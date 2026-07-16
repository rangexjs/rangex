import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { HTMLLayout } from "rich-text-area";
import type { AudioInternals } from "../../ConfigureAudio-types";

export interface ShowAudioSwapPopoverParams {
	richTextEditorUI: RichTextEditorUI;
	internals: AudioInternals;
	figure: HTMLLayout;
}
