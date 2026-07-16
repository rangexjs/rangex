import type {
	AudioEmitSwapParams,
	AudioSwapPopover,
	RichTextEditorUI,
} from "@rangex/rich-text-editor-ui";
import type { EditorAPI } from "rich-text-area";
import type { AudioInternals } from "../ConfigureAudio-types";

export interface HandleAudioSwapParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	internals: AudioInternals;
}

export interface ResolveSwapSrcParams {
	audioEmitSwapParams: AudioEmitSwapParams;
	audioSwapPopover: AudioSwapPopover;
	isStillCurrent: () => boolean;
}

export type ResolveSwapSrcResult = string | null;
