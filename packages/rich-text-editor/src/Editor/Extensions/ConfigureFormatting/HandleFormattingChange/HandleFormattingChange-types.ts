import type { EditorAPI } from "rich-text-area";
import type { FormattingEditorPort } from "#adapters";

export interface HandleFormattingChangeParams {
	editorPort: FormattingEditorPort;
	editorAPI: EditorAPI;
}
