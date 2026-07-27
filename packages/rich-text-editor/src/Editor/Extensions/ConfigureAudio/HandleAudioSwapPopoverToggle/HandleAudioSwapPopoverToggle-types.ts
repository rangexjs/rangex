import type { BlockNestedContext } from "rich-text-area";
import type { AudioEditorPort } from "#adapters";
import type { AudioInternals } from "../ConfigureAudio-types";

export interface HandleAudioSwapPopoverToggleParams {
	editorPort: AudioEditorPort;
	getCurrentBlock: () => BlockNestedContext | null;
	internals: AudioInternals;
}
