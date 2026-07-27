import type { BlockNestedContext, EditorAPI } from "rich-text-area";

export interface OnOverlayShowParams {
	blockNestedContext: BlockNestedContext;
}

/**
 * Determines whether this registration owns a given hovered block, and if so, whether
 * its popover should appear for it. Called for every hovered block-nested-context
 * regardless of component type, so implementations must narrow by the block's own
 * component type before doing anything type-specific.
 */
export type OnOverlayShouldShowFn = (params: OnOverlayShowParams) => boolean;

/**
 * Called once when a new block takes over the registration — the place to push that
 * block's current state into the popover, then toggle it open itself (`hidePopover()`
 * followed by `showPopover({ source: blockNestedContext })`), since the handler no
 * longer does this on the registrant's behalf.
 */
export type OnOverlayShowFn = (params: OnOverlayShowParams) => void;

/**
 * Called instead of the handler hiding the popover itself — the registrant owns hiding
 * (typically just `popover.hidePopover()`), which also gives it a place to run any
 * cleanup exactly at the close point.
 */
export type OnOverlayCloseFn = (params: OnOverlayShowParams) => void;

type CurrentBlock = BlockNestedContext | null;

export interface OverlayRegistration {
	popover: HTMLDivElement;
	position: Partial<CSSStyleDeclaration>;
	shouldShow: OnOverlayShouldShowFn;
	onShow: OnOverlayShowFn;
	onClose: OnOverlayCloseFn;
	currentBlock: CurrentBlock;
	hideTimeoutId: number;
	abortController: AbortController;
	pointerOver: boolean;
	focusWithin: boolean;
}

export interface RegisterOverlayParams {
	popover: HTMLDivElement;
	position: Partial<CSSStyleDeclaration>;
	shouldShow: OnOverlayShouldShowFn;
	onShow: OnOverlayShowFn;
	onClose: OnOverlayCloseFn;
}

export interface RegisterOverlayResult {
	getCurrentBlock: () => CurrentBlock;
	cleanup: () => void;
}

export interface OverlayAppearanceHandler {
	registerComponent: (params: RegisterOverlayParams) => RegisterOverlayResult;
	cleanup: () => void;
}

export interface CreateOverlayAppearanceHandlerParams {
	editorAPI: EditorAPI;
}

export interface CreateOverlayAppearanceHandlerResult
	extends OverlayAppearanceHandler {}
