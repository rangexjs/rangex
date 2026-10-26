import type {
	BlockComponentLine,
	ContentFlowNode,
	EditorAPI,
	EditorNode,
	Line,
	List,
	NestedEditable,
} from "@rangex/core";
import type { AdapterBus } from "#adapters";
import type { BlockComponentName } from "#constants";

/*
 * Which ScopedEditable a `can*` check is evaluated against: `"current"` is the one directly holding the
 * given position, and fails if that one isn't `"block multi-line"`; `"nearest-multi-line"` walks up to
 * the closest `"block multi-line"` one.
 */
export type PlacementScope = "current" | "nearest-multi-line";

export interface CanInsertParams {
	fromNode: EditorNode;
	scope: PlacementScope;
	allowedComponents: BlockComponentName[];
}

export type CanInsertResult = boolean;

export type CanInsertFn = (params: CanInsertParams) => CanInsertResult;

export interface InsertParams {
	fromNode: EditorNode;
	lines: Line[];
	shouldReplaceContentLineIfEmpty?: boolean;
}

export type InsertFn = (params: InsertParams) => void;

export interface CanInsertBySelectionParams {
	scope: PlacementScope;
	allowedComponents: BlockComponentName[];
}

export type CanInsertBySelectionResult = boolean;

export type CanInsertBySelectionFn = (
	params: CanInsertBySelectionParams,
) => CanInsertBySelectionResult;

export interface InsertBySelectionParams {
	lines: Line[];
	shouldReplaceContentLineIfEmpty?: boolean;
}

export type InsertBySelectionFn = (params: InsertBySelectionParams) => void;

export interface CanWrapParams {
	fromNode: ContentFlowNode;
	fromOffset: number;
	toNode: ContentFlowNode;
	toOffset: number;
	scope: PlacementScope;
	allowedComponents: BlockComponentName[];
}

export type CanWrapResult = boolean;

export type CanWrapFn = (params: CanWrapParams) => CanWrapResult;

type WrapTarget = NestedEditable | List;

export interface WrapParams {
	fromNode: ContentFlowNode;
	fromOffset: number;
	toNode: ContentFlowNode;
	toOffset: number;
	blockComponentLine: BlockComponentLine;
	target: WrapTarget;
}

export type WrapFn = (params: WrapParams) => void;

export interface CanWrapBySelectionParams {
	scope: PlacementScope;
	allowedComponents: BlockComponentName[];
}

export type CanWrapBySelectionResult = boolean;

export type CanWrapBySelectionFn = (
	params: CanWrapBySelectionParams,
) => CanWrapBySelectionResult;

export interface WrapBySelectionParams {
	blockComponentLine: BlockComponentLine;
	target: WrapTarget;
}

export type WrapBySelectionFn = (params: WrapBySelectionParams) => void;

export interface BlockComponentPlacement {
	canInsert: CanInsertFn;
	insert: InsertFn;
	canInsertBySelection: CanInsertBySelectionFn;
	insertBySelection: InsertBySelectionFn;

	canWrap: CanWrapFn;
	wrap: WrapFn;
	canWrapBySelection: CanWrapBySelectionFn;
	wrapBySelection: WrapBySelectionFn;
}

export interface CreateBlockComponentPlacementParams {
	editorAPI: EditorAPI;
	adapterBus: AdapterBus;
}

export interface CreateBlockComponentPlacementResult
	extends BlockComponentPlacement {}
