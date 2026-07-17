import type { EditorAPI } from "rich-text-area";
import type { RichTextEditorUI, TemplateVariablePopover } from "#ui";

export interface CloseOnSelectionChangeParams {
	templateVariablePopover: TemplateVariablePopover;
	editorAPI: EditorAPI;
}

export interface CloseOnEditorBlurParams {
	templateVariablePopover: TemplateVariablePopover;
	editorAPI: EditorAPI;
}

export interface RestoreFocusOnEscapeParams {
	templateVariablePopover: TemplateVariablePopover;
	editorAPI: EditorAPI;
}

export interface HandleTemplateVariablePopoverCloseParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
