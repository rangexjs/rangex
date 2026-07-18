import type { BlockNestedContext, EditorAPI } from "rich-text-area";
import type { BlockResizePort } from "#ports";

export interface OnBlockResizeCanShowParams {
	blockNestedContext: BlockNestedContext;
}

/**
 * Determines whether this registration owns a given hovered block, and if so, whether
 * its resize handles should appear for it. Called for every hovered block-nested-context
 * regardless of component type, so implementations must narrow by the block's own
 * component type before doing anything type-specific.
 */
export type OnBlockResizeCanShowFn = (
	params: OnBlockResizeCanShowParams,
) => boolean;

export interface BlockResizeRegistration {
	handleX: number;
	canShow: OnBlockResizeCanShowFn;
}

export type BlockResizeRegistrationSet = Set<BlockResizeRegistration>;

export interface BlockResizeInternals {
	currentBlock: BlockNestedContext | null;
	registrations: BlockResizeRegistrationSet;
}

export interface RegisterComponentParams {
	handleX: number;
	canShow: OnBlockResizeCanShowFn;
}

export interface BlockResize {
	registerComponent: (params: RegisterComponentParams) => () => void;
	cleanup: () => void;
}

export interface CreateBlockResizeParams {
	blockResizePort: BlockResizePort;
	editorAPI: EditorAPI;
}

export interface CreateBlockResizeResult extends BlockResize {}
