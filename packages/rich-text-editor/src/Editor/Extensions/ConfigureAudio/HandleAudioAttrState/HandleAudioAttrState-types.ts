import type { BlockNestedContext, EditorAPI } from "rich-text-area";
import type { AudioEditorPort } from "#adapters";

export interface HandleAudioAttrStateParams {
	editorPort: AudioEditorPort;
	editorAPI: EditorAPI;
	getCurrentBlock: () => BlockNestedContext | null;
}
