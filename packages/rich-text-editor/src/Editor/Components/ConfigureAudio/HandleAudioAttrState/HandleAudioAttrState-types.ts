import type { BlockNestedContext, EditorAPI } from "rich-text-area";
import type { AudioPort } from "#ports";

export interface HandleAudioAttrStateParams {
	audioPort: AudioPort;
	editorAPI: EditorAPI;
	getCurrentBlock: () => BlockNestedContext | null;
}
