import { extendObjectProperties } from "#utilities";
import { createEmitter, type MediaType } from "../_Utilities";
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

const mediaTypes: MediaType[] = ["image", "video", "audio", "embed"];

export const createEmptyMediaAdapter = (
	...params: CreateEmptyMediaAdapterParams
): CreateEmptyMediaAdapterResult => {
	const [{ uploadFile }, { adapterBus }] = params;

	adapterBus.registerAdapter("emptyMedia");

	const internals: EmptyMediaInternals = {
		// States
		canInsert: false,
		// Rest
		registerSlottedElement: null,
	};

	const elements: Map<HTMLDivElement, ElementState> = new Map();
	const disposes: Map<HTMLDivElement, () => void> = new Map();

	// StateListeners
	const canInsertUpdateEmitter = createEmitter<OnCanInsertUpdateCallbackFn>();

	// CommandListeners
	const insertEmitter = createEmitter<OnInsertCallbackFn>();
	const resolveEmitter = createEmitter<OnResolveCallbackFn>();

	const getElementState = (element: HTMLDivElement): ElementState => {
		const state = elements.get(element);

		if (!state) {
			throw new Error("No attached state for the given element.");
		}

		return state;
	};

	const updateState = ({ canInsert }: UpdateStateParams) => {
		if (canInsert !== undefined) {
			internals.canInsert = canInsert;

			canInsertUpdateEmitter.emit(internals.canInsert);
		}
	};

	const updateElementState = ({
		element,
		uploadState,
	}: UpdateElementStateParams) => {
		const state = getElementState(element);

		if (uploadState !== undefined) {
			state.uploadState = uploadState;

			state.uploadStateEmitter.emit(state.uploadState);
		}
	};

	const configPort: EmptyMediaConfigPort = extendObjectProperties({}, {
		get uploadFile() {
			return uploadFile;
		},

		createSlottedElement() {
			const container = document.createElement("div");

			elements.set(container, {
				uploadState: { status: "idle" },
				uploadStateEmitter: createEmitter(),
			});

			const dispose = internals.registerSlottedElement?.(container);

			if (dispose) {
				disposes.set(container, dispose);
			}

			return container;
		},

		removeSlottedElement(container) {
			if (!elements.has(container)) {
				throw new Error("Container wasn't registered.");
			}

			const dispose = disposes.get(container);
			dispose?.();
			disposes.delete(container);
			elements.delete(container);
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
			return insertEmitter.subscribe(callback);
		},

		onSwap(callback) {
			const cleanup = adapterBus.onSwapToEmptyMedia(callback);
			return () => cleanup();
		},

		onResolve(callback) {
			return resolveEmitter.subscribe(callback);
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
			return mediaTypes.filter((type) => adapterBus.hasAdapter(type));
		},

		registerSlottedElement(callback) {
			internals.registerSlottedElement = callback;

			for (const element of elements.keys()) {
				disposes.get(element)?.();

				const dispose = internals.registerSlottedElement(element);
				disposes.set(element, dispose);
			}
		},

		onCanInsertUpdate(callback) {
			return canInsertUpdateEmitter.subscribe(callback);
		},

		getUploadState(element) {
			const { uploadState } = getElementState(element);

			return uploadState;
		},

		onUploadStateUpdate(element, callback) {
			const state = getElementState(element);
			return state.uploadStateEmitter.subscribe(callback);
		},

		insert() {
			insertEmitter.emit();
		},

		resolve(params) {
			resolveEmitter.emit(params);
		},
	} satisfies EmptyMediaPublicPortProps);

	return { configPort, publicPort };
};
