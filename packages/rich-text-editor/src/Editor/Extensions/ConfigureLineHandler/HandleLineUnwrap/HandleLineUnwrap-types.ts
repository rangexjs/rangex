import type { EditorAPI } from "rich-text-area";
import type { LineHandlerEditorPort } from "#adapters";
import type { GetCurrentLineFn } from "../../_Utilities";

export interface HandleLineUnwrapParams {
	editorPort: LineHandlerEditorPort;
	editorAPI: EditorAPI;
	getCurrentLine: GetCurrentLineFn;
}
