import type { EditorAPI } from "rich-text-area";
import type { AudioEmitSwapParams, AudioPort } from "#ports";
import type { AudioInternals } from "../ConfigureAudio-types";

export interface HandleAudioSwapParams {
	audioPort: AudioPort;
	editorAPI: EditorAPI;
	internals: AudioInternals;
}

export interface ResolveSwapSrcParams {
	audioEmitSwapParams: AudioEmitSwapParams;
	audioPort: AudioPort;
	isStillCurrent: () => boolean;
}

export type ResolveSwapSrcResult = string | null;
