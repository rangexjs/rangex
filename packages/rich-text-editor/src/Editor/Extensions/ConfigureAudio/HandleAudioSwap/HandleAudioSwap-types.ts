import type { EditorAPI } from "rich-text-area";
import type { AudioEditorPort, AudioEmitSwapParams } from "#adapters";
import type { AnchoredOverlayController } from "../../../_Utilities";
import type { AudioInternals } from "../ConfigureAudio-types";

export interface HandleAudioSwapParams {
	editorPort: AudioEditorPort;
	editorAPI: EditorAPI;
	internals: AudioInternals;
	swapAnchorController: AnchoredOverlayController;
}

export interface ResolveSwapSrcParams {
	audioEmitSwapParams: AudioEmitSwapParams;
	editorPort: AudioEditorPort;
	isStillCurrent: () => boolean;
}

export type ResolveSwapSrcResult = string | null;
