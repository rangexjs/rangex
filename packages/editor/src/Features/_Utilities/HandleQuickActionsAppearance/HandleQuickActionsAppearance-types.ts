import type { BlockComponent, EditorAPI } from "@rangex/core";

import type { CurrentComponentConfigPort, QuickActionsConfigPort } from "#adapters";
import type { BlockComponentName } from "#constants";
import type { AnchorPositionStyle } from "#engine-links";

export interface HandleQuickActionsAppearanceParams {
	port: CurrentComponentConfigPort<BlockComponent>;
	quickActionsPort: QuickActionsConfigPort;
	editorAPI: EditorAPI;
	componentName: BlockComponentName;
	anchorStyle?: Omit<AnchorPositionStyle, "position">;
}
