import type { EditorAPI } from "rich-text-area";
import type { MentionPort } from "#ports";

export interface ConfigureMentionParams {
	mentionPort: MentionPort;
	editorAPI: EditorAPI;
}
