import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { BlockNestedContext } from "rich-text-area";
import type { AudioInternals } from "../ConfigureAudio-types";

export interface HandleAudioSwapButtonOpenParams {
	richTextEditorUI: RichTextEditorUI;
	getCurrentBlock: () => BlockNestedContext | null;
	internals: AudioInternals;
}
