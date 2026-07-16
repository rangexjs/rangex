import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { AudioInternals } from "../ConfigureAudio-types";

export interface HandleAudioSwapPopoverCloseParams {
	richTextEditorUI: RichTextEditorUI;
	internals: AudioInternals;
}
