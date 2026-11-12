import type { EditorAPI } from "@rangex/core";

import type { CodeBlockConfigPort } from "#adapters/CodeBlock";
import type { BlockComponentPlacement } from "#engine-links";

export interface HandleCodeBlockPlacementParams {
	configPort: CodeBlockConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
