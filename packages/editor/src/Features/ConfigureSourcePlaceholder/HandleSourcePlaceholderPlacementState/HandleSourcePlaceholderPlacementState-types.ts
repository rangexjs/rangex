import type { EditorAPI } from "@rangex/core";

import type { SourcePlaceholderConfigPort } from "#adapters/SourcePlaceholder";
import type { BlockComponentPlacement } from "#engine-links";

export interface HandleSourcePlaceholderPlacementStateParams {
	configPort: SourcePlaceholderConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
