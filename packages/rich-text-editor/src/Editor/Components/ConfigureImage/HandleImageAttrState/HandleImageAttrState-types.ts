import type { BlockNestedContext, EditorAPI } from "rich-text-area";
import type { ImagePort } from "#ports";

export interface HandleImageAttrStateParams {
	imagePort: ImagePort;
	editorAPI: EditorAPI;
	getCurrentBlock: () => BlockNestedContext | null;
}
