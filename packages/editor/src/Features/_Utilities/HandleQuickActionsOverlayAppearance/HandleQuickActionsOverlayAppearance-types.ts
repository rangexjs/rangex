import type { BlockComponent, EditorAPI } from "rich-text-area";
import type {
	CurrentComponentConfigPort,
	QuickActionsConfigPort,
} from "#adapters";
import type { BlockComponentName } from "#engine-links";

export interface OnBeforeOpenParams {
	blockComponent: BlockComponent;
}

export type OnBeforeOpenFn = (params: OnBeforeOpenParams) => void;

export interface HandleQuickActionsOverlayAppearanceParams {
	port: CurrentComponentConfigPort<BlockComponent>;
	quickActionsPort: QuickActionsConfigPort;
	editorAPI: EditorAPI;
	componentName: BlockComponentName;
	beforeOpen: OnBeforeOpenFn;
}
