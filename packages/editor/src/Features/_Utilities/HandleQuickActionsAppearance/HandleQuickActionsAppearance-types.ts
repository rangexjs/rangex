import type { BlockComponent, EditorAPI } from "rich-text-area";
import type {
	CurrentComponentConfigPort,
	QuickActionsConfigPort,
} from "#adapters";
import type { BlockComponentName } from "#engine-links";

export interface HandleQuickActionsAppearanceParams {
	port: CurrentComponentConfigPort<BlockComponent>;
	quickActionsPort: QuickActionsConfigPort;
	editorAPI: EditorAPI;
	componentName: BlockComponentName;
}
