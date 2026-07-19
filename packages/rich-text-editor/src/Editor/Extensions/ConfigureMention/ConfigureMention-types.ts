import type { EditorAPI } from "rich-text-area";
import type { MentionEditorPort } from "#adapters";

export interface ConfigureMentionParams {
	editorPort: MentionEditorPort;
	editorAPI: EditorAPI;
}
