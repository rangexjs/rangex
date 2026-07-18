import type { EditorAPI } from "rich-text-area";
import type { TemplateVariablePort } from "#ports";

export interface CloseOnSelectionChangeParams {
	templateVariablePort: TemplateVariablePort;
	editorAPI: EditorAPI;
}

export interface CloseOnEditorBlurParams {
	templateVariablePort: TemplateVariablePort;
	editorAPI: EditorAPI;
}

export interface RestoreFocusOnEscapeParams {
	templateVariablePort: TemplateVariablePort;
	editorAPI: EditorAPI;
}

export interface HandleTemplateVariablePopoverCloseParams {
	templateVariablePort: TemplateVariablePort;
	editorAPI: EditorAPI;
}
