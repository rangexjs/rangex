import type { BlockNestedContext, EditorAPI } from "rich-text-area";
import type { VideoEditorPort } from "#adapters";

export interface HandleVideoAttrStateParams {
	editorPort: VideoEditorPort;
	editorAPI: EditorAPI;
	getCurrentBlock: () => BlockNestedContext | null;
}
