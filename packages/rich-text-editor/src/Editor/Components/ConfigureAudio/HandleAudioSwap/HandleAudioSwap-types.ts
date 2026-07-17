import type { EditorAPI } from "rich-text-area";
import type { AudioEmitSwapParams, AudioPopover, RichTextEditorUI } from "#ui";
import type { AudioInternals } from "../ConfigureAudio-types";

export interface HandleAudioSwapParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	internals: AudioInternals;
}

export interface ResolveSwapSrcParams {
	audioEmitSwapParams: AudioEmitSwapParams;
	audioPopover: AudioPopover;
	isStillCurrent: () => boolean;
}

export type ResolveSwapSrcResult = string | null;
