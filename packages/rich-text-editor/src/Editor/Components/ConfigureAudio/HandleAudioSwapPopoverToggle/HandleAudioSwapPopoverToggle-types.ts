import type { BlockNestedContext } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";
import type { AudioInternals } from "../ConfigureAudio-types";

export interface HandleAudioSwapPopoverToggleParams {
	richTextEditorUI: RichTextEditorUI;
	getCurrentBlock: () => BlockNestedContext | null;
	internals: AudioInternals;
}
