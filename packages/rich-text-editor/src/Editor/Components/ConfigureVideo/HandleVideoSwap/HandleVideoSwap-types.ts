import type { EditorAPI } from "rich-text-area";
import type { RichTextEditorUI, VideoEmitSwapParams, VideoPopover } from "#ui";
import type { VideoInternals } from "../ConfigureVideo-types";

export interface HandleVideoSwapParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	internals: VideoInternals;
}

export interface ResolveSwapSrcParams {
	videoEmitSwapParams: VideoEmitSwapParams;
	videoPopover: VideoPopover;
	isStillCurrent: () => boolean;
}

export type ResolveSwapSrcResult = string | null;
