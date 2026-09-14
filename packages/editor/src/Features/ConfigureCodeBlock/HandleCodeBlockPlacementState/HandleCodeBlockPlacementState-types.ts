import type { EditorAPI } from "rich-text-area";
import type { CodeBlockConfigPort } from "#adapters/CodeBlock";
import type { BlockComponentPlacement } from "#engine-links";

export interface HandleCodeBlockPlacementStateParams {
	configPort: CodeBlockConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
