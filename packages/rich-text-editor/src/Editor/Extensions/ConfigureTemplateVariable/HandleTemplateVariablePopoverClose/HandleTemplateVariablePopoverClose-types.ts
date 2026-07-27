import type { EditorAPI } from "rich-text-area";
import type { TemplateVariableEditorPort } from "#adapters";

export interface CloseOnSelectionChangeParams {
	editorPort: TemplateVariableEditorPort;
	editorAPI: EditorAPI;
}

export interface CloseOnEditorBlurParams {
	editorPort: TemplateVariableEditorPort;
	editorAPI: EditorAPI;
}

export interface RestoreFocusOnEscapeParams {
	editorPort: TemplateVariableEditorPort;
	editorAPI: EditorAPI;
}

export interface HandleTemplateVariablePopoverCloseParams {
	editorPort: TemplateVariableEditorPort;
	editorAPI: EditorAPI;
}
