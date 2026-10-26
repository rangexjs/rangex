import type { BlockComponent, EditorAPI } from "@rangex/core";
import type {
	CurrentComponentConfigPort,
	QuickActionsConfigPort,
} from "#adapters";
import type { BlockComponentName } from "#constants";

export interface HandleQuickActionsAppearanceParams {
	port: CurrentComponentConfigPort<BlockComponent>;
	quickActionsPort: QuickActionsConfigPort;
	editorAPI: EditorAPI;
	componentName: BlockComponentName;
}
