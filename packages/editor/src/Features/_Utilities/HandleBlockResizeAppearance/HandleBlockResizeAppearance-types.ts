import type { EditorAPI } from "@rangex/core";
import type { BlockResize } from "#adapters";
import type { ComponentName } from "#constants";

export interface HandleBlockResizeAppearanceParams {
	blockResize: BlockResize;
	editorAPI: EditorAPI;
	componentName: ComponentName;
}
