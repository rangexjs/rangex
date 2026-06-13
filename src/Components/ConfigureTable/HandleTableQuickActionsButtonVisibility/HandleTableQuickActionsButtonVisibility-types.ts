import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { EditorAPI } from "rich-text-area";

export interface SyncPopoverVisibilityParams {
	popover: HTMLElement;
	editorAPI: EditorAPI;
}

export interface HandleTableQuickActionsButtonVisibilityParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
