import type { EditorAPI } from "rich-text-area";
import type { SeparatorEditorPort } from "#adapters";

export interface ConfigureSeparatorParams {
	editorPort: SeparatorEditorPort;
	editorAPI: EditorAPI;
}
