import type { EditorAPI } from "rich-text-area";
import type { CodeBlockConfigPort } from "#adapters/CodeBlock";
import type { BlockComponentPlacement } from "#engine-links";

export interface HandleCodeBlockPlacementParams {
	configPort: CodeBlockConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
