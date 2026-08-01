import type { EditorAPI } from "rich-text-area";
import type { LineHandlerEditorPort } from "#adapters";
import type { GetCurrentLineFn } from "../../_Utilities";

export interface HandleLineHoverParams {
	editorPort: LineHandlerEditorPort;
	editorAPI: EditorAPI;
}

export interface HandleLineHoverResult {
	getCurrentLine: GetCurrentLineFn;
	cleanup: () => void;
}
