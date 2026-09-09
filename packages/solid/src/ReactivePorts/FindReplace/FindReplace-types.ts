import type {
	FindReplaceCriteria,
	FindReplaceResultsState,
} from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface NavigateToIndexParams {
	index: number;
}

export interface ReplaceParams {
	replaceText: string;
}

export interface ReactiveFindReplacePort {
	results: Accessor<FindReplaceResultsState>;

	open(criteria: FindReplaceCriteria): void;
	close(): void;
	search(criteria: FindReplaceCriteria): void;
	stepBack(): void;
	stepForward(): void;
	navigateToIndex(params: NavigateToIndexParams): void;
	replace(params: ReplaceParams): void;
	replaceAll(params: ReplaceParams): void;
}

export interface ReactiveFindReplaceResult {
	port: ReactiveFindReplacePort;
	dispose: () => void;
}
