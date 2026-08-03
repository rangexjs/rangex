import type { EditorAPI } from "rich-text-area";
import type { LineHandlerEditorPort } from "#adapters";

export interface ConfigureLineHandlerParams {
	editorPort: LineHandlerEditorPort;
	editorAPI: EditorAPI;
}
