import type { EditorAPI } from "rich-text-area";
import type { MentionPort } from "#ports";

export interface HandlePopoverAppearanceParams {
	mentionPort: MentionPort;
	editorAPI: EditorAPI;
}
