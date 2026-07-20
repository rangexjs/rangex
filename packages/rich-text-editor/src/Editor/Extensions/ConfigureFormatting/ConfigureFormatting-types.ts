import type { EditorAPI } from "rich-text-area";
import type { FormattingEditorPort } from "#adapters";

export interface ConfigureFormattingParams {
	editorPort: FormattingEditorPort;
	editorAPI: EditorAPI;
}
