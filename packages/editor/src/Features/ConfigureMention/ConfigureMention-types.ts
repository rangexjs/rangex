import type { EditorAPI } from "rich-text-area";
import type { MentionConfigPort } from "#adapters/Mention";

export interface ConfigureMentionParams {
	configPort: MentionConfigPort;
	editorAPI: EditorAPI;
}
