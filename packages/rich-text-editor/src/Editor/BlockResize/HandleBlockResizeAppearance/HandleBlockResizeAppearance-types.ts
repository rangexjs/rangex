import type { EditorAPI } from "rich-text-area";
import type { BlockResizePort } from "#ports";
import type { BlockResizeInternals } from "../BlockResize-types";

export interface HandleBlockResizeAppearanceParams {
	blockResizePort: BlockResizePort;
	editorAPI: EditorAPI;
	internals: BlockResizeInternals;
}
