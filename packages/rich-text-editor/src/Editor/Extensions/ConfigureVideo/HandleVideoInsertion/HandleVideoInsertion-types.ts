import type { EditorAPI } from "rich-text-area";
import type { VideoEditorPort } from "#adapters";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface HandleVideoInsertionParams {
	editorPort: VideoEditorPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
