import type { BlockNestedContext, EditorAPI } from "rich-text-area";
import type { ComponentName } from "../Constants";

export interface OnBlockPopoverShowParams {
	blockNestedContext: BlockNestedContext;
}

export type OnBlockPopoverShowFn = (params: OnBlockPopoverShowParams) => void;

type CurrentBlock = BlockNestedContext | null;

export interface BlockPopoverRegistration {
	popover: HTMLDivElement;
	position: Partial<CSSStyleDeclaration>;
	onShow?: OnBlockPopoverShowFn;
	currentBlock: CurrentBlock;
	hideTimeoutId: number;
	abortController: AbortController;
	pointerOver: boolean;
	focusWithin: boolean;
}

export interface RegisterComponentParams {
	componentName: ComponentName;
	popover: HTMLDivElement;
	position: Partial<CSSStyleDeclaration>;
	onShow?: OnBlockPopoverShowFn;
}

export interface UnregisterComponentParams {
	componentName: ComponentName;
}

export interface GetCurrentBlockParams {
	componentName: ComponentName;
}

export interface BlockPopoverAppearanceHandler {
	registerComponent: (params: RegisterComponentParams) => void;
	unregisterComponent: (params: UnregisterComponentParams) => void;
	getCurrentBlock: (params: GetCurrentBlockParams) => CurrentBlock;
	cleanup: () => void;
}

export interface CreateBlockPopoverAppearanceHandlerParams {
	editorAPI: EditorAPI;
}

export interface CreateBlockPopoverAppearanceHandlerResult
	extends BlockPopoverAppearanceHandler {}
