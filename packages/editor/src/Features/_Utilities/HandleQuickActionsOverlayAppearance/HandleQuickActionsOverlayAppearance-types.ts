import type { BlockComponent, EditorAPI } from "rich-text-area";
import type { CurrentBlockConfigPort, QuickActionsConfigPort } from "#adapters";
import type { BlockComponentName } from "#engine-links";

export interface OnBeforeOpenParams {
	blockComponent: BlockComponent;
}

export type OnBeforeOpenFn = (params: OnBeforeOpenParams) => void;

export interface HandleQuickActionsOverlayAppearanceParams {
	port: QuickActionsConfigPort & CurrentBlockConfigPort;
	editorAPI: EditorAPI;
	componentName: BlockComponentName;
	beforeOpen: OnBeforeOpenFn;
}
