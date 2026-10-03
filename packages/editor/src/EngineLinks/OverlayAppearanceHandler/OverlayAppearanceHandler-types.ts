import type { BlockComponent, EditorAPI } from "@rangex/core";

export interface OnOverlayShowParams {
	blockComponent: BlockComponent;
}

/**
 * Determines whether this registration owns a given hovered block, and if so, whether
 * its overlay should appear for it. Called for every hovered block-component
 * regardless of component type, so implementations must narrow by the block's own
 * component type before doing anything type-specific.
 */
export type OnOverlayShouldShowFn = (params: OnOverlayShowParams) => boolean;

/**
 * Called once when a new block takes over the registration — the place to push that
 * block's current state into the overlay, then toggle it open itself (e.g. `hidePopover()`
 * followed by `showPopover({ source: blockComponent })` for a popover-backed overlay, or
 * an `AnchoredOverlayController.show(blockComponent, ...)` call for an anchored one), since
 * the handler no longer does this on the registrant's behalf.
 */
export type OnOverlayShowFn = (params: OnOverlayShowParams) => void;

/**
 * Called instead of the handler hiding the overlay itself — the registrant owns hiding it
 * (`popover.hidePopover()` or `AnchoredOverlayController.hide()`), which also gives it a
 * place to run any cleanup exactly at the close point.
 */
export type OnOverlayCloseFn = (params: OnOverlayShowParams) => void;

type CurrentBlock = BlockComponent | null;

export interface OverlayRegistration {
	popover: HTMLElement;
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
	popover: HTMLElement;
	extraElements?: HTMLElement[];
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
