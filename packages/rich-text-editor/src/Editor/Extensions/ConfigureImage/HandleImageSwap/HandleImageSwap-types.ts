import type { EditorAPI } from "rich-text-area";
import type { ImageEditorPort, ImageEmitSwapParams } from "#adapters";
import type { AnchoredOverlayController } from "../../../_Utilities";
import type { ImageInternals } from "../ConfigureImage-types";

export interface HandleImageSwapParams {
	editorPort: ImageEditorPort;
	editorAPI: EditorAPI;
	internals: ImageInternals;
	swapAnchorController: AnchoredOverlayController;
}

export interface ResolveSwapSrcParams {
	emitSwapParams: ImageEmitSwapParams;
	editorPort: ImageEditorPort;
	isStillCurrent: () => boolean;
}

export type ResolveSwapSrcResult = string | null;
