import { adapterIds } from "#ports";
import type {
	FindReplaceAdapterConstructorParams,
	FindReplaceCriteria,
	FindReplaceEditorPort,
	FindReplaceNavigateToIndexParams,
	FindReplaceOnNavigateToIndexFn,
	FindReplaceOnPopoverClosedFn,
	FindReplaceOnPopoverOpenFn,
	FindReplaceOnReplaceAllFn,
	FindReplaceOnReplaceFn,
	FindReplaceOnSearchChangeFn,
	FindReplaceOnStepBackFn,
	FindReplaceOnStepForwardFn,
	FindReplaceReplaceParams,
	FindReplaceResultsState,
	FindReplaceUIPort,
	FindReplaceUpdateResultsFn,
	UpdateFindReplaceStateParams,
} from "./FindReplaceAdapter-types";

export class FindReplaceAdapter {
	#results: FindReplaceResultsState = {
		currentIndex: 0,
		totalResults: 0,
		results: [],
	};

	#resultsListeners: Set<FindReplaceUpdateResultsFn> = new Set();

	#onPopoverOpenListeners: Set<FindReplaceOnPopoverOpenFn> = new Set();
	#onPopoverClosedListeners: Set<FindReplaceOnPopoverClosedFn> = new Set();
	#onSearchChangeListeners: Set<FindReplaceOnSearchChangeFn> = new Set();
	#onStepBackListeners: Set<FindReplaceOnStepBackFn> = new Set();
	#onStepForwardListeners: Set<FindReplaceOnStepForwardFn> = new Set();
	#onNavigateToIndexListeners: Set<FindReplaceOnNavigateToIndexFn> = new Set();
	#onReplaceListeners: Set<FindReplaceOnReplaceFn> = new Set();
	#onReplaceAllListeners: Set<FindReplaceOnReplaceAllFn> = new Set();

	#uiPort: FindReplaceUIPort | null = null;
	#editorPort: FindReplaceEditorPort | null = null;

	constructor(...params: FindReplaceAdapterConstructorParams) {
		const [_settings, _options] = params;
	}

	get id() {
		return adapterIds.findReplace;
	}

	#updateState({ results }: UpdateFindReplaceStateParams) {
		if (results !== undefined) {
			this.#results = results;

			for (const listener of this.#resultsListeners) {
				listener(this.#results);
			}
		}
	}

	get uiPort(): FindReplaceUIPort {
		const adapter = this;

		this.#uiPort ??= {
			get results() {
				return adapter.#results;
			},

			onResultsUpdate: (callback) => {
				adapter.#resultsListeners.add(callback);
				return () => adapter.#resultsListeners.delete(callback);
			},

			emitPopoverOpen: (params: FindReplaceCriteria) => {
				for (const listener of adapter.#onPopoverOpenListeners) {
					listener(params);
				}
			},

			emitPopoverClosed: () => {
				for (const listener of adapter.#onPopoverClosedListeners) {
					listener();
				}
			},

			emitSearchChange: (params: FindReplaceCriteria) => {
				for (const listener of adapter.#onSearchChangeListeners) {
					listener(params);
				}
			},

			emitStepBack: () => {
				for (const listener of adapter.#onStepBackListeners) {
					listener();
				}
			},

			emitStepForward: () => {
				for (const listener of adapter.#onStepForwardListeners) {
					listener();
				}
			},

			emitNavigateToIndex: (params: FindReplaceNavigateToIndexParams) => {
				for (const listener of adapter.#onNavigateToIndexListeners) {
					listener(params);
				}
			},

			emitReplace: (params: FindReplaceReplaceParams) => {
				for (const listener of adapter.#onReplaceListeners) {
					listener(params);
				}
			},

			emitReplaceAll: (params: FindReplaceReplaceParams) => {
				for (const listener of adapter.#onReplaceAllListeners) {
					listener(params);
				}
			},
		};

		return this.#uiPort;
	}

	get editorPort(): FindReplaceEditorPort {
		const adapter = this;

		this.#editorPort ??= {
			updateState: (params) => adapter.#updateState(params),

			onPopoverOpen: (callback) => {
				adapter.#onPopoverOpenListeners.add(callback);
				return () => adapter.#onPopoverOpenListeners.delete(callback);
			},

			onPopoverClosed: (callback) => {
				adapter.#onPopoverClosedListeners.add(callback);
				return () => adapter.#onPopoverClosedListeners.delete(callback);
			},

			onSearchChange: (callback) => {
				adapter.#onSearchChangeListeners.add(callback);
				return () => adapter.#onSearchChangeListeners.delete(callback);
			},

			onStepBack: (callback) => {
				adapter.#onStepBackListeners.add(callback);
				return () => adapter.#onStepBackListeners.delete(callback);
			},

			onStepForward: (callback) => {
				adapter.#onStepForwardListeners.add(callback);
				return () => adapter.#onStepForwardListeners.delete(callback);
			},

			onNavigateToIndex: (callback) => {
				adapter.#onNavigateToIndexListeners.add(callback);
				return () => adapter.#onNavigateToIndexListeners.delete(callback);
			},

			onReplace: (callback) => {
				adapter.#onReplaceListeners.add(callback);
				return () => adapter.#onReplaceListeners.delete(callback);
			},

			onReplaceAll: (callback) => {
				adapter.#onReplaceAllListeners.add(callback);
				return () => adapter.#onReplaceAllListeners.delete(callback);
			},
		};

		return this.#editorPort;
	}
}
