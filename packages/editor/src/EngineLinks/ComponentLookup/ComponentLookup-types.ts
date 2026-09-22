import type {
	BlockComponent,
	EditorAPI,
	EditorNode,
	InlineComponent,
} from "rich-text-area";
import type { BlockComponentName, InlineComponentName } from "../Constants";

export interface ClosestBlockParams {
	fromNode: EditorNode;
	components: BlockComponentName[];
}

export type ClosestBlockResult = BlockComponent | null;

export type ClosestBlockFn = (params: ClosestBlockParams) => ClosestBlockResult;

export interface ClosestBlockBySelectionParams {
	components: BlockComponentName[];
}

export type ClosestBlockBySelectionResult = BlockComponent | null;

export type ClosestBlockBySelectionFn = (
	params: ClosestBlockBySelectionParams,
) => ClosestBlockBySelectionResult;

export interface ClosestInlineParams {
	fromNode: EditorNode;
	components: InlineComponentName[];
}

export type ClosestInlineResult = InlineComponent | null;

export type ClosestInlineFn = (
	params: ClosestInlineParams,
) => ClosestInlineResult;

export interface ClosestInlineBySelectionParams {
	components: InlineComponentName[];
}

export type ClosestInlineBySelectionResult = InlineComponent | null;

export type ClosestInlineBySelectionFn = (
	params: ClosestInlineBySelectionParams,
) => ClosestInlineBySelectionResult;

export interface ComponentLookup {
	closestBlock: ClosestBlockFn;
	closestBlockBySelection: ClosestBlockBySelectionFn;
	closestInline: ClosestInlineFn;
	closestInlineBySelection: ClosestInlineBySelectionFn;
}

export interface CreateComponentLookupParams {
	editorAPI: EditorAPI;
}

export interface CreateComponentLookupResult extends ComponentLookup {}
