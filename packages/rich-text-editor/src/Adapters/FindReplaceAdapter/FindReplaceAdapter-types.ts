import type { CreateAdapterConstructor } from "#ports";

export type FindReplaceAdapterConstructorParams = CreateAdapterConstructor<{
	[index: string]: never;
}>;

export interface FindReplacePattern {
	source: string;
	flags: string;
}

export interface FindReplaceSearchResult {
	segmentText: string;
	matchStart: number;
	matchEnd: number;
}

export interface FindReplaceCriteria {
	pattern: FindReplacePattern;
	includeNonEditableContent: boolean;
}

export interface FindReplaceResultsState {
	currentIndex: number;
	totalResults: number;
	results: FindReplaceSearchResult[];
}

export interface FindReplaceState {
	results?: FindReplaceResultsState;
}

export interface UpdateFindReplaceStateParams extends FindReplaceState {}

export interface FindReplaceNavigateToIndexParams {
	index: number;
}

export interface FindReplaceReplaceParams {
	replaceText: string;
}

export type FindReplaceUpdateResultsFn = (
	value: FindReplaceResultsState,
) => void;

export interface FindReplaceUIPort {
	readonly results: FindReplaceResultsState;
	onResultsUpdate(callback: FindReplaceUpdateResultsFn): () => void;
	emitPopoverOpen(params: FindReplaceCriteria): void;
	emitPopoverClosed(): void;
	emitSearchChange(params: FindReplaceCriteria): void;
	emitStepBack(): void;
	emitStepForward(): void;
	emitNavigateToIndex(params: FindReplaceNavigateToIndexParams): void;
	emitReplace(params: FindReplaceReplaceParams): void;
	emitReplaceAll(params: FindReplaceReplaceParams): void;
}

export type FindReplaceOnPopoverOpenFn = (params: FindReplaceCriteria) => void;
export type FindReplaceOnPopoverClosedFn = () => void;
export type FindReplaceOnSearchChangeFn = (params: FindReplaceCriteria) => void;
export type FindReplaceOnStepBackFn = () => void;
export type FindReplaceOnStepForwardFn = () => void;
export type FindReplaceOnNavigateToIndexFn = (
	params: FindReplaceNavigateToIndexParams,
) => void;
export type FindReplaceOnReplaceFn = (params: FindReplaceReplaceParams) => void;
export type FindReplaceOnReplaceAllFn = (
	params: FindReplaceReplaceParams,
) => void;

export interface FindReplaceEditorPort {
	updateState(params: UpdateFindReplaceStateParams): void;
	onPopoverOpen(callback: FindReplaceOnPopoverOpenFn): () => void;
	onPopoverClosed(callback: FindReplaceOnPopoverClosedFn): () => void;
	onSearchChange(callback: FindReplaceOnSearchChangeFn): () => void;
	onStepBack(callback: FindReplaceOnStepBackFn): () => void;
	onStepForward(callback: FindReplaceOnStepForwardFn): () => void;
	onNavigateToIndex(callback: FindReplaceOnNavigateToIndexFn): () => void;
	onReplace(callback: FindReplaceOnReplaceFn): () => void;
	onReplaceAll(callback: FindReplaceOnReplaceAllFn): () => void;
}
