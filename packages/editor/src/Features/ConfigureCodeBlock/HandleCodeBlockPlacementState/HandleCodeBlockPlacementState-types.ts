import type { EditorAPI } from "@rangex/core";
import type { CodeBlockConfigPort } from "#adapters/CodeBlock";
import type { BlockComponentPlacement } from "#engine-links";

export interface HandleCodeBlockPlacementStateParams {
	configPort: CodeBlockConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
