import type { EditorAPI } from "rich-text-area";
import type { VideoEditorPort } from "#adapters";

export interface HandleVideoInsertionParams {
	editorPort: VideoEditorPort;
	editorAPI: EditorAPI;
}
