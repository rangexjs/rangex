import type { EditorAPI } from "rich-text-area";
import type { CodeBlockEditorPort } from "#adapters";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface HandleCodeBlockToolbarButtonStateParams {
	editorPort: CodeBlockEditorPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
