import type { EditorAPI } from "rich-text-area";
import type { VideoEmitSwapParams, VideoPort } from "#ports";
import type { VideoInternals } from "../ConfigureVideo-types";

export interface HandleVideoSwapParams {
	videoPort: VideoPort;
	editorAPI: EditorAPI;
	internals: VideoInternals;
}

export interface ResolveSwapSrcParams {
	videoEmitSwapParams: VideoEmitSwapParams;
	videoPort: VideoPort;
	isStillCurrent: () => boolean;
}

export type ResolveSwapSrcResult = string | null;
