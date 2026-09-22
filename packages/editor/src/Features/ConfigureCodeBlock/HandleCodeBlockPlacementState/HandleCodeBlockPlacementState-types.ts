import type { EditorAPI } from "rich-text-area";
import type { CodeBlockConfigPort } from "#adapters/CodeBlock";
import type { BlockComponentPlacement, ComponentLookup } from "#engine-links";

export interface HandleCodeBlockPlacementStateParams {
	configPort: CodeBlockConfigPort;
	editorAPI: EditorAPI;
	componentLookup: ComponentLookup;
	blockComponentPlacement: BlockComponentPlacement;
}
