import type { EditorAPI } from "rich-text-area";
import type { FormattingEditorPort } from "#adapters";

export interface HandleFormattingButtonStateParams {
	editorPort: FormattingEditorPort;
	editorAPI: EditorAPI;
}
