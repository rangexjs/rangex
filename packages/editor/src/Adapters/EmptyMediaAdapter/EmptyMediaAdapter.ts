import { extendObjectProperties } from "#utilities";
import type {
	CreateEmptyMediaAdapterParams,
	CreateEmptyMediaAdapterResult,
	ElementState,
	EmptyMediaConfigPort,
	EmptyMediaConfigPortProps,
	EmptyMediaInternals,
	EmptyMediaPublicPort,
	EmptyMediaPublicPortProps,
	OnCanInsertUpdateCallbackFn,
	OnInsertCallbackFn,
	OnResolveCallbackFn,
	UpdateElementStateParams,
	UpdateStateParams,
} from "./EmptyMediaAdapter-types";

export const createEmptyMediaAdapter = (
	...params: CreateEmptyMediaAdapterParams
): CreateEmptyMediaAdapterResult => {
	const [
		{ uploadFile, createSlottedElement, disposeSlottedElement },
		{ adapterBus },
	] = params;

	const internals: EmptyMediaInternals = {
		canInsert: false,
	};

	const elements: Map<HTMLElement, ElementState> = new Map();

	// ConfigPort
	const onInsertListeners: Set<OnInsertCallbackFn> = new Set();
	const onResolveListeners: Set<OnResolveCallbackFn> = new Set();

	// PublicPort
	const onCanInsertUpdateListeners: Set<OnCanInsertUpdateCallbackFn> =
		new Set();

	const getElementState = (element: HTMLElement): ElementState => {
		const state = elements.get(element);

		if (!state) {
			throw new Error("No attached state for the given element.");
		}

		return state;
	};

	const updateState = ({ canInsert }: UpdateStateParams) => {
		if (canInsert !== undefined) {
			internals.canInsert = canInsert;

			for (const listener of onCanInsertUpdateListeners) {
				listener(internals.canInsert);
			}
		}
	};

	const updateElementState = ({
		element,
		uploadState,
	}: UpdateElementStateParams) => {
		const state = getElementState(element);

		if (uploadState !== undefined) {
			state.uploadState = uploadState;

			for (const listener of state.uploadStateListeners) {
				listener(state.uploadState);
			}
		}
	};

	const configPort: EmptyMediaConfigPort = extendObjectProperties({}, {
		get uploadFile() {
			return uploadFile;
		},

		createSlottedElement() {
			const slottedElement = createSlottedElement();

			elements.set(slottedElement, {
				uploadState: { status: "idle" },
				uploadStateListeners: new Set(),
			});

			return slottedElement;
		},

		disposeSlottedElement(element) {
			elements.delete(element);
			disposeSlottedElement(element);
		},

		updateState(params) {
			updateState(params);
		},

		updateElementState({ element, uploadState }) {
			if (!elements.has(element)) {
				return;
			}

			updateElementState({ element, uploadState });
		},

		onInsert(callback) {
			onInsertListeners.add(callback);
			return () => onInsertListeners.delete(callback);
		},

		onResolve(callback) {
			onResolveListeners.add(callback);
			return () => onResolveListeners.delete(callback);
		},

		emitMediaResolve(params) {
			adapterBus.emitMediaResolve(params);
		},
	} satisfies EmptyMediaConfigPortProps);

	const publicPort: EmptyMediaPublicPort = extendObjectProperties({}, {
		get canInsert() {
			return internals.canInsert;
		},

		get supportedMediaTypes() {
			return adapterBus.getSupportedMediaTypes();
		},

		onCanInsertUpdate(callback) {
			onCanInsertUpdateListeners.add(callback);
			return () => onCanInsertUpdateListeners.delete(callback);
		},

		getUploadState(element) {
			const { uploadState } = getElementState(element);

			return uploadState;
		},

		onUploadStateUpdate(element, callback) {
			const state = getElementState(element);
			state.uploadStateListeners.add(callback);
			return () => state.uploadStateListeners.delete(callback);
		},

		insert() {
			for (const listener of onInsertListeners) {
				listener();
			}
		},

		resolve(params) {
			for (const listener of onResolveListeners) {
				listener(params);
			}
		},
	} satisfies EmptyMediaPublicPortProps);

	return { configPort, publicPort };
};
