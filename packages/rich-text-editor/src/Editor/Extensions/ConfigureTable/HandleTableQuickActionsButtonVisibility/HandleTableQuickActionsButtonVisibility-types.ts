import type { EditorAPI } from "rich-text-area";
import type { TableEditorPort } from "#adapters";

export interface SyncPopoverVisibilityParams {
	popover: HTMLElement;
	editorAPI: EditorAPI;
}

export interface HandleTableQuickActionsButtonVisibilityParams {
	editorPort: TableEditorPort;
	editorAPI: EditorAPI;
}
