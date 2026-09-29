import type { CreateAdapterParams } from "../_Utilities";

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

export interface FindReplaceState {
	currentIndex?: number;
	results?: FindReplaceSearchResult[];
}

export type OnCurrentIndexUpdateCallbackFn = (currentIndex: number) => void;
export type OnResultsUpdateCallbackFn = (
	results: FindReplaceSearchResult[],
) => void;

export interface NavigateToIndexParams {
	index: number;
}

export interface ReplaceParams {
	replaceText: string;
}

export type OnOpenCallbackFn = (criteria: FindReplaceCriteria) => void;
export type OnCloseCallbackFn = () => void;
export type OnSearchCallbackFn = (criteria: FindReplaceCriteria) => void;
export type OnStepBackCallbackFn = () => void;
export type OnStepForwardCallbackFn = () => void;
export type OnNavigateToIndexCallbackFn = (
	params: NavigateToIndexParams,
) => void;
export type OnReplaceCallbackFn = (params: ReplaceParams) => void;
export type OnReplaceAllCallbackFn = (params: ReplaceParams) => void;

export interface UpdateStateParams extends FindReplaceState {}

export interface FindReplaceConfigPortProps {
	updateState(params: UpdateStateParams): void;

	onOpen(callback: OnOpenCallbackFn): () => void;
	onClose(callback: OnCloseCallbackFn): () => void;
	onSearch(callback: OnSearchCallbackFn): () => void;
	onStepBack(callback: OnStepBackCallbackFn): () => void;
	onStepForward(callback: OnStepForwardCallbackFn): () => void;
	onNavigateToIndex(callback: OnNavigateToIndexCallbackFn): () => void;
	onReplace(callback: OnReplaceCallbackFn): () => void;
	onReplaceAll(callback: OnReplaceAllCallbackFn): () => void;
}

export interface FindReplaceConfigPort extends FindReplaceConfigPortProps {}

export interface FindReplacePublicPortProps {
	readonly currentIndex: number;
	readonly results: FindReplaceSearchResult[];

	onCurrentIndexUpdate(callback: OnCurrentIndexUpdateCallbackFn): () => void;
	onResultsUpdate(callback: OnResultsUpdateCallbackFn): () => void;

	open(criteria: FindReplaceCriteria): void;
	close(): void;
	search(criteria: FindReplaceCriteria): void;
	stepBack(): void;
	stepForward(): void;
	navigateToIndex(params: NavigateToIndexParams): void;
	replace(params: ReplaceParams): void;
	replaceAll(params: ReplaceParams): void;
}

export interface FindReplacePublicPort extends FindReplacePublicPortProps {}

export interface FindReplaceInternals {
	currentIndex: number;
	results: FindReplaceSearchResult[];
}

export interface FindReplaceAdapter {
	configPort: FindReplaceConfigPort;
	publicPort: FindReplacePublicPort;
}

export interface FindReplaceSettings {}

export interface CreateFindReplaceAdapterParams
	extends CreateAdapterParams<FindReplaceSettings> {}

export interface CreateFindReplaceAdapterResult extends FindReplaceAdapter {}
