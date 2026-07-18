import type { EditorAPI } from "rich-text-area";
import type { ImageEmitSwapParams, ImagePort } from "#ports";
import type { ImageInternals } from "../ConfigureImage-types";

export interface HandleImageSwapParams {
	imagePort: ImagePort;
	editorAPI: EditorAPI;
	internals: ImageInternals;
}

export interface ResolveSwapSrcParams {
	emitSwapParams: ImageEmitSwapParams;
	imagePort: ImagePort;
	isStillCurrent: () => boolean;
}

export type ResolveSwapSrcResult = string | null;
