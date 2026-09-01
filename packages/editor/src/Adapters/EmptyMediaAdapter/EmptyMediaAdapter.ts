import type { AdapterBus } from "../_Utilities";
import type {
	EmptyMediaAdapterConstructorParams,
	EmptyMediaConfigPort,
	EmptyMediaElementState,
	EmptyMediaOnCanInsertCallbackFn,
	EmptyMediaOnInsertCallbackFn,
	EmptyMediaOnResolveCallbackFn,
	EmptyMediaPublicPort,
	EmptyMediaUpdateElementStateParams,
	EmptyMediaUpdateStateParams,
	UploadMediaFileFn,
} from "./EmptyMediaAdapter-types";

export class EmptyMediaAdapter {
	#canInsert = false;
	#uploadFile: UploadMediaFileFn;
	#createSlottedElement;
	#disposeSlottedElement;
	#adapterBus: AdapterBus;

	#onCanInsertListeners: Set<EmptyMediaOnCanInsertCallbackFn> = new Set();
	#onInsertListeners: Set<EmptyMediaOnInsertCallbackFn> = new Set();
	#onResolveListeners: Set<EmptyMediaOnResolveCallbackFn> = new Set();

	#elements: Map<HTMLElement, EmptyMediaElementState> = new Map();

	#configPort: EmptyMediaConfigPort | null = null;
	#publicPort: EmptyMediaPublicPort | null = null;

	constructor(...params: EmptyMediaAdapterConstructorParams) {
		const [
			{ uploadFile, createSlottedElement, disposeSlottedElement },
			{ adapterBus },
		] = params;

		this.#uploadFile = uploadFile;
		this.#createSlottedElement = createSlottedElement;
		this.#disposeSlottedElement = disposeSlottedElement;
		this.#adapterBus = adapterBus;
	}

	#updateState({ canInsert }: EmptyMediaUpdateStateParams) {
		if (canInsert !== undefined) {
			this.#canInsert = canInsert;

			for (const listener of this.#onCanInsertListeners) {
				listener(this.#canInsert);
			}
		}
	}

	#getElementState(element: HTMLElement): EmptyMediaElementState {
		const state = this.#elements.get(element);

		if (!state) {
			throw new Error("No attached state for the given element.");
		}

		return state;
	}

	#updateElementState({
		element,
		uploadState,
	}: EmptyMediaUpdateElementStateParams) {
		const state = this.#getElementState(element);

		if (uploadState !== undefined) {
			state.uploadState = uploadState;

			for (const listener of state.uploadStateListeners) {
				listener(state.uploadState);
			}
		}
	}

	get configPort(): EmptyMediaConfigPort {
		const adapter = this;

		this.#configPort ??= {
			get uploadFile() {
				return adapter.#uploadFile;
			},

			createSlottedElement() {
				const slottedElement = adapter.#createSlottedElement();

				adapter.#elements.set(slottedElement, {
					uploadState: { status: "idle" },
					uploadStateListeners: new Set(),
				});

				return slottedElement;
			},

			disposeSlottedElement(element) {
				adapter.#elements.delete(element);
				adapter.#disposeSlottedElement(element);
			},

			updateState(params) {
				adapter.#updateState(params);
			},

			updateElementState({ element, uploadState }) {
				if (!adapter.#elements.has(element)) {
					return;
				}

				adapter.#updateElementState({ element, uploadState });
			},

			onInsert(callback) {
				adapter.#onInsertListeners.add(callback);
				return () => adapter.#onInsertListeners.delete(callback);
			},

			onResolve(callback) {
				adapter.#onResolveListeners.add(callback);
				return () => adapter.#onResolveListeners.delete(callback);
			},

			emitMediaResolve(params) {
				adapter.#adapterBus.emitMediaResolve(params);
			},
		};

		return this.#configPort;
	}

	get publicPort(): EmptyMediaPublicPort {
		const adapter = this;

		this.#publicPort ??= {
			get canInsert() {
				return adapter.#canInsert;
			},

			get supportedMediaTypes() {
				return adapter.#adapterBus.getSupportedMediaTypes();
			},

			onCanInsertUpdate(callback) {
				adapter.#onCanInsertListeners.add(callback);
				return () => adapter.#onCanInsertListeners.delete(callback);
			},

			getUploadState(element) {
				const { uploadState } = adapter.#getElementState(element);

				return uploadState;
			},

			onUploadStateUpdate(element, callback) {
				const state = adapter.#getElementState(element);
				state.uploadStateListeners.add(callback);
				return () => state.uploadStateListeners.delete(callback);
			},

			insert() {
				for (const listener of adapter.#onInsertListeners) {
					listener();
				}
			},

			resolve(params) {
				for (const listener of adapter.#onResolveListeners) {
					listener(params);
				}
			},
		};

		return this.#publicPort;
	}
}
