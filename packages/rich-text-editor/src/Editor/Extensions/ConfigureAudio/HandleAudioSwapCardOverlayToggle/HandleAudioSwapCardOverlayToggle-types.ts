import type { BlockComponent } from "rich-text-area";
import type { AudioEditorPort } from "#adapters";
import type { AnchoredOverlayController } from "../../../_Utilities";
import type { AudioInternals } from "../ConfigureAudio-types";

export interface HandleAudioSwapCardOverlayToggleParams {
	editorPort: AudioEditorPort;
	getCurrentBlock: () => BlockComponent | null;
	internals: AudioInternals;
	swapAnchorController: AnchoredOverlayController;
}
