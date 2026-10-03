import type { EditorAPI } from "@rangex/core";
import type { EmptyMediaConfigPort } from "#adapters/EmptyMedia";
import type { BlockComponentPlacement } from "#engine-links";

export interface HandleEmptyMediaInsertionParams {
	configPort: EmptyMediaConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
