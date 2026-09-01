import type { EditorAPI } from "rich-text-area";
import type { BlockResize } from "#adapters";
import type { ComponentName } from "../../../Constants";

export interface HandleBlockResizeAppearanceParams {
	blockResize: BlockResize;
	editorAPI: EditorAPI;
	componentName: ComponentName;
}
