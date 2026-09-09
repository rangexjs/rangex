import { extendObjectProperties } from "#utilities";
import type {
	CreateFindReplaceAdapterParams,
	CreateFindReplaceAdapterResult,
	FindReplaceConfigPort,
	FindReplaceConfigPortProps,
	FindReplaceInternals,
	FindReplacePublicPort,
	FindReplacePublicPortProps,
	OnCloseCallbackFn,
	OnNavigateToIndexCallbackFn,
	OnOpenCallbackFn,
	OnReplaceAllCallbackFn,
	OnReplaceCallbackFn,
	OnResultsUpdateCallbackFn,
	OnSearchCallbackFn,
	OnStepBackCallbackFn,
	OnStepForwardCallbackFn,
	UpdateStateParams,
} from "./FindReplaceAdapter-types";

export const createFindReplaceAdapter = (
	...params: CreateFindReplaceAdapterParams
): CreateFindReplaceAdapterResult => {
	const [_settings, _options] = params;

	const internals: FindReplaceInternals = {
		results: { currentIndex: 0, totalResults: 0, results: [] },
	};

	// ConfigPort
	const onOpenListeners: Set<OnOpenCallbackFn> = new Set();
	const onCloseListeners: Set<OnCloseCallbackFn> = new Set();
	const onSearchListeners: Set<OnSearchCallbackFn> = new Set();
	const onStepBackListeners: Set<OnStepBackCallbackFn> = new Set();
	const onStepForwardListeners: Set<OnStepForwardCallbackFn> = new Set();
	const onNavigateToIndexListeners: Set<OnNavigateToIndexCallbackFn> =
		new Set();
	const onReplaceListeners: Set<OnReplaceCallbackFn> = new Set();
	const onReplaceAllListeners: Set<OnReplaceAllCallbackFn> = new Set();

	// PublicPort
	const onResultsUpdateListeners: Set<OnResultsUpdateCallbackFn> = new Set();

	const updateState = ({ results }: UpdateStateParams) => {
		if (results !== undefined) {
			internals.results = results;

			for (const listener of onResultsUpdateListeners) {
				listener(internals.results);
			}
		}
	};

	const configPort: FindReplaceConfigPort = extendObjectProperties({}, {
		updateState(params) {
			updateState(params);
		},

		onOpen(callback) {
			onOpenListeners.add(callback);
			return () => onOpenListeners.delete(callback);
		},

		onClose(callback) {
			onCloseListeners.add(callback);
			return () => onCloseListeners.delete(callback);
		},

		onSearch(callback) {
			onSearchListeners.add(callback);
			return () => onSearchListeners.delete(callback);
		},

		onStepBack(callback) {
			onStepBackListeners.add(callback);
			return () => onStepBackListeners.delete(callback);
		},

		onStepForward(callback) {
			onStepForwardListeners.add(callback);
			return () => onStepForwardListeners.delete(callback);
		},

		onNavigateToIndex(callback) {
			onNavigateToIndexListeners.add(callback);
			return () => onNavigateToIndexListeners.delete(callback);
		},

		onReplace(callback) {
			onReplaceListeners.add(callback);
			return () => onReplaceListeners.delete(callback);
		},

		onReplaceAll(callback) {
			onReplaceAllListeners.add(callback);
			return () => onReplaceAllListeners.delete(callback);
		},
	} satisfies FindReplaceConfigPortProps);

	const publicPort: FindReplacePublicPort = extendObjectProperties({}, {
		get results() {
			return internals.results;
		},

		onResultsUpdate(callback) {
			onResultsUpdateListeners.add(callback);
			return () => onResultsUpdateListeners.delete(callback);
		},

		open(criteria) {
			for (const listener of onOpenListeners) {
				listener(criteria);
			}
		},

		close() {
			for (const listener of onCloseListeners) {
				listener();
			}
		},

		search(criteria) {
			for (const listener of onSearchListeners) {
				listener(criteria);
			}
		},

		stepBack() {
			for (const listener of onStepBackListeners) {
				listener();
			}
		},

		stepForward() {
			for (const listener of onStepForwardListeners) {
				listener();
			}
		},

		navigateToIndex(params) {
			for (const listener of onNavigateToIndexListeners) {
				listener(params);
			}
		},

		replace(params) {
			for (const listener of onReplaceListeners) {
				listener(params);
			}
		},

		replaceAll(params) {
			for (const listener of onReplaceAllListeners) {
				listener(params);
			}
		},
	} satisfies FindReplacePublicPortProps);

	return { configPort, publicPort };
};
