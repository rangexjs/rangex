import type { EditorAPI } from "@rangex/core";

import type { SourcePlaceholderConfigPort } from "#adapters/SourcePlaceholder";
import type { BlockComponentPlacement } from "#engine-links";

export interface HandleSourcePlaceholderInsertionParams {
	configPort: SourcePlaceholderConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
