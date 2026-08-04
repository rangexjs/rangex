import type { EditorAPI } from "rich-text-area";
import type { VideoEditorPort, VideoEmitSwapParams } from "#adapters";
import type { AnchoredOverlayController } from "../../../_Utilities";
import type { VideoInternals } from "../ConfigureVideo-types";

export interface HandleVideoSwapParams {
	editorPort: VideoEditorPort;
	editorAPI: EditorAPI;
	internals: VideoInternals;
	swapAnchorController: AnchoredOverlayController;
}

export interface ResolveSwapSrcParams {
	videoEmitSwapParams: VideoEmitSwapParams;
	editorPort: VideoEditorPort;
	isStillCurrent: () => boolean;
}

export type ResolveSwapSrcResult = string | null;
