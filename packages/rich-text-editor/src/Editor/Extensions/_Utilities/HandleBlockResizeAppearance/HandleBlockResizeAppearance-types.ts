import type { EditorAPI } from "rich-text-area";
import type { EditorBlockResize } from "#adapters";
import type { ComponentName } from "../../../Constants";

export interface HandleBlockResizeAppearanceParams {
	blockResize: EditorBlockResize;
	editorAPI: EditorAPI;
	componentName: ComponentName;
}
