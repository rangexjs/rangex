import type { BlockNestedContext, EditorAPI } from "rich-text-area";
import type { VideoPort } from "#ports";

export interface HandleVideoAttrStateParams {
	videoPort: VideoPort;
	editorAPI: EditorAPI;
	getCurrentBlock: () => BlockNestedContext | null;
}
