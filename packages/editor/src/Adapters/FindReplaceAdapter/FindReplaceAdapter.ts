import { extendObjectProperties } from "#utilities";

import { createEmitter, createStateEmitter } from "../_Utilities";
import type {
	CreateFindReplaceAdapterParams,
	CreateFindReplaceAdapterResult,
	FindReplaceConfigPort,
	FindReplaceConfigPortProps,
	FindReplacePublicPort,
	FindReplacePublicPortProps,
	FindReplaceSearchResult,
	OnCloseCallbackFn,
	OnNavigateToIndexCallbackFn,
	OnOpenCallbackFn,
	OnReplaceAllCallbackFn,
	OnReplaceCallbackFn,
	OnSearchCallbackFn,
	OnStepBackCallbackFn,
	OnStepForwardCallbackFn,
	UpdateStateParams,
} from "./FindReplaceAdapter-types";

export const createFindReplaceAdapter = (
	...params: CreateFindReplaceAdapterParams
): CreateFindReplaceAdapterResult => {
	const [_settings, { adapterBus }] = params;

	adapterBus.registerAdapter("findReplace");

	// States
	const currentIndexState = createStateEmitter<number>(0);
	const resultsState = createStateEmitter<FindReplaceSearchResult[]>([]);

	// CommandListeners
	const openEmitter = createEmitter<OnOpenCallbackFn>();
	const closeEmitter = createEmitter<OnCloseCallbackFn>();
	const searchEmitter = createEmitter<OnSearchCallbackFn>();
	const stepBackEmitter = createEmitter<OnStepBackCallbackFn>();
	const stepForwardEmitter = createEmitter<OnStepForwardCallbackFn>();
	const navigateToIndexEmitter = createEmitter<OnNavigateToIndexCallbackFn>();
	const replaceEmitter = createEmitter<OnReplaceCallbackFn>();
	const replaceAllEmitter = createEmitter<OnReplaceAllCallbackFn>();

	const updateState = ({ currentIndex, results }: UpdateStateParams) => {
		if (currentIndex !== undefined) {
			currentIndexState.set(currentIndex);
		}

		if (results !== undefined) {
			resultsState.set(results);
		}
	};

	const configPort: FindReplaceConfigPort = extendObjectProperties({}, {
		updateState(params) {
			updateState(params);
		},

		onOpen(callback) {
			return openEmitter.subscribe(callback);
		},

		onClose(callback) {
			return closeEmitter.subscribe(callback);
		},

		onSearch(callback) {
			return searchEmitter.subscribe(callback);
		},

		onStepBack(callback) {
			return stepBackEmitter.subscribe(callback);
		},

		onStepForward(callback) {
			return stepForwardEmitter.subscribe(callback);
		},

		onNavigateToIndex(callback) {
			return navigateToIndexEmitter.subscribe(callback);
		},

		onReplace(callback) {
			return replaceEmitter.subscribe(callback);
		},

		onReplaceAll(callback) {
			return replaceAllEmitter.subscribe(callback);
		},
	} satisfies FindReplaceConfigPortProps);

	const publicPort: FindReplacePublicPort = extendObjectProperties({}, {
		get currentIndex() {
			return currentIndexState.get();
		},

		get results() {
			return resultsState.get();
		},

		onCurrentIndexUpdate(callback) {
			return currentIndexState.subscribe(callback);
		},

		onResultsUpdate(callback) {
			return resultsState.subscribe(callback);
		},

		open(criteria) {
			openEmitter.emit(criteria);
		},

		close() {
			closeEmitter.emit();
		},

		search(criteria) {
			searchEmitter.emit(criteria);
		},

		stepBack() {
			stepBackEmitter.emit();
		},

		stepForward() {
			stepForwardEmitter.emit();
		},

		navigateToIndex(params) {
			navigateToIndexEmitter.emit(params);
		},

		replace(params) {
			replaceEmitter.emit(params);
		},

		replaceAll(params) {
			replaceAllEmitter.emit(params);
		},
	} satisfies FindReplacePublicPortProps);

	return { configPort, publicPort };
};
