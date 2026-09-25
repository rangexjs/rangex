import type {
	BlockComponentLine,
	ContentFlowNode,
	EditorAPI,
	EditorNode,
	Line,
	List,
	NestedEditable,
} from "rich-text-area";
import type { AdapterBus } from "#adapters";
import type { BlockComponentName } from "../Constants";

export interface CanInsertParams {
	fromNode: EditorNode;
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
