import type { BlockNestedContext } from "rich-text-area";
import type { AudioPort } from "#ports";
import type { AudioInternals } from "../ConfigureAudio-types";

export interface HandleAudioSwapPopoverToggleParams {
	audioPort: AudioPort;
	getCurrentBlock: () => BlockNestedContext | null;
	internals: AudioInternals;
}
