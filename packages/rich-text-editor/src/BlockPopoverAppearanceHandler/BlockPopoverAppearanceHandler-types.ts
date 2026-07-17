import type { BlockNestedContext, EditorAPI } from "rich-text-area";

export interface OnBlockPopoverShowParams {
	blockNestedContext: BlockNestedContext;
}

/**
 * Determines whether this registration owns a given hovered block, and if so, whether
 * its popover should appear for it. Called for every hovered block-nested-context
 * regardless of component type, so implementations must narrow by the block's own
 * component type before doing anything type-specific.
 */
export type OnBlockPopoverCanShowFn = (
	params: OnBlockPopoverShowParams,
) => boolean;

/**
 * Called once, right before the popover appears for a new block — the place to push
 * that block's current state into the popover.
 */
export type OnBlockPopoverShowFn = (params: OnBlockPopoverShowParams) => void;

type CurrentBlock = BlockNestedContext | null;

export interface BlockPopoverRegistration {
	popover: HTMLDivElement;
	position: Partial<CSSStyleDeclaration>;
	canShow: OnBlockPopoverCanShowFn;
	onShow?: OnBlockPopoverShowFn;
	currentBlock: CurrentBlock;
	hideTimeoutId: number;
	abortController: AbortController;
	pointerOver: boolean;
	focusWithin: boolean;
}

export interface RegisterComponentParams {
	popover: HTMLDivElement;
	position: Partial<CSSStyleDeclaration>;
	canShow: OnBlockPopoverCanShowFn;
	onShow?: OnBlockPopoverShowFn;
}

export interface RegisterComponentResult {
	getCurrentBlock: () => CurrentBlock;
	cleanup: () => void;
}

export interface BlockPopoverAppearanceHandler {
	registerComponent: (
		params: RegisterComponentParams,
	) => RegisterComponentResult;
	cleanup: () => void;
}

export interface CreateBlockPopoverAppearanceHandlerParams {
	editorAPI: EditorAPI;
}

export interface CreateBlockPopoverAppearanceHandlerResult
	extends BlockPopoverAppearanceHandler {}
