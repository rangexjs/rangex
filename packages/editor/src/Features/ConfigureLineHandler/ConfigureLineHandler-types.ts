import type { EditorAPI } from "rich-text-area";
import type { LineHandlerConfigPort } from "#adapters/LineHandler";

export interface ConfigureLineHandlerParams {
	configPort: LineHandlerConfigPort;
	editorAPI: EditorAPI;
}
