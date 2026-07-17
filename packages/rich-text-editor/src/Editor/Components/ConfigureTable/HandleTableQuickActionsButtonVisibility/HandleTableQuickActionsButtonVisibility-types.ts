import type { EditorAPI } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";

export interface SyncPopoverVisibilityParams {
	popover: HTMLElement;
	editorAPI: EditorAPI;
}

export interface HandleTableQuickActionsButtonVisibilityParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
