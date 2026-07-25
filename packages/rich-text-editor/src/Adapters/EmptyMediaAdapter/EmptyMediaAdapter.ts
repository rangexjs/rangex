import type { AdapterBus } from "#ports";
import { renderComponent } from "#ports";
import { EmptyMediaSlot } from "#ui-extensions";
import type {
	AttachEmptyMediaParams,
	DetachEmptyMediaParams,
	EmptyMediaAdapterConstructorParams,
	EmptyMediaEditorPort,
	EmptyMediaElementState,
	EmptyMediaOnInsertRequestFn,
	EmptyMediaOnResolveFn,
	EmptyMediaToolbarButtonState,
	EmptyMediaUIPort,
	EmptyMediaUpdateToolbarButtonFn,
	UpdateEmptyMediaElementStateParams,
	UpdateEmptyMediaStateParams,
} from "./EmptyMediaAdapter-types";

export class EmptyMediaAdapter {
	#adapterBus: AdapterBus;

	#toolbarButton: EmptyMediaToolbarButtonState = { disabled: true };
	#toolbarButtonListeners: Set<EmptyMediaUpdateToolbarButtonFn> = new Set();

	#onInsertRequestListeners: Set<EmptyMediaOnInsertRequestFn> = new Set();
	#onResolveListeners: Set<EmptyMediaOnResolveFn> = new Set();

	#elements: Map<HTMLElement, EmptyMediaElementState> = new Map();

	#uiPort: EmptyMediaUIPort | null = null;
	#editorPort: EmptyMediaEditorPort | null = null;

	constructor(...params: EmptyMediaAdapterConstructorParams) {
		const [_settings, { adapterBus }] = params;

		this.#adapterBus = adapterBus;
	}

	#getElementState(element: HTMLElement): EmptyMediaElementState {
		const state = this.#elements.get(element);

		if (!state) {
			throw new Error("No attached state for the given element.");
		}

		return state;
	}

	#updateState({ toolbarButton }: UpdateEmptyMediaStateParams) {
		if (toolbarButton !== undefined) {
			this.#toolbarButton = toolbarButton;

			for (const listener of this.#toolbarButtonListeners) {
				listener(this.#toolbarButton);
			}
		}
	}

	#updateElementState({
		element,
		uploadState,
	}: UpdateEmptyMediaElementStateParams) {
		const state = this.#getElementState(element);

		if (uploadState !== undefined) {
			state.uploadState = uploadState;

			for (const listener of state.uploadStateListeners) {
				listener(state.uploadState);
			}
		}
	}

	#attach({ element }: AttachEmptyMediaParams) {
		if (this.#elements.has(element)) {
			throw new Error("Element is already attached.");
		}

		// The bucket must exist before `renderComponent` runs — `EmptyMediaSlot`'s `onMount`
		// synchronously calls `uiPort.onUploadStateUpdate(element, ...)`, which looks it up
		// immediately.
		this.#elements.set(element, {
			uploadState: { status: "idle" },
			uploadStateListeners: new Set(),
			// Overwritten below, once `renderComponent` returns its dispose fn — the bucket
			// must exist first since `EmptyMediaSlot`'s `onMount` reads it synchronously.
			dispose: () => undefined,
		});

		const dispose = renderComponent({
			container: element,
			component: EmptyMediaSlot,
			props: { uiPort: this.uiPort, element },
		});

		this.#getElementState(element).dispose = dispose;
	}

	#detach({ element }: DetachEmptyMediaParams) {
		const state = this.#getElementState(element);

		state.dispose();
		this.#elements.delete(element);
	}

	get uiPort(): EmptyMediaUIPort {
		const adapter = this;

		this.#uiPort ??= {
			get toolbarButton() {
				return adapter.#toolbarButton;
			},

			onToolbarButtonUpdate: (callback) => {
				adapter.#toolbarButtonListeners.add(callback);
				return () => adapter.#toolbarButtonListeners.delete(callback);
			},

			getUploadState: (element) =>
				adapter.#getElementState(element).uploadState,

			onUploadStateUpdate: (element, callback) => {
				const state = adapter.#getElementState(element);
				state.uploadStateListeners.add(callback);
				return () => state.uploadStateListeners.delete(callback);
			},

			emitInsertRequest: () => {
				for (const listener of adapter.#onInsertRequestListeners) {
					listener();
				}
			},

			emitResolve: (params) => {
				for (const listener of adapter.#onResolveListeners) {
					listener(params);
				}
			},
		};

		return this.#uiPort;
	}

	get editorPort(): EmptyMediaEditorPort {
		const adapter = this;

		this.#editorPort ??= {
			updateState: (params) => adapter.#updateState(params),

			updateElementState: ({ element, uploadState }) => {
				if (!adapter.#elements.has(element)) {
					return;
				}

				adapter.#updateElementState({ element, uploadState });
			},

			onInsertRequest: (callback) => {
				adapter.#onInsertRequestListeners.add(callback);
				return () => adapter.#onInsertRequestListeners.delete(callback);
			},

			attach: (params) => adapter.#attach(params),

			detach: (params) => adapter.#detach(params),

			onResolve: (callback) => {
				adapter.#onResolveListeners.add(callback);
				return () => adapter.#onResolveListeners.delete(callback);
			},

			emitMediaResolve: (params) =>
				adapter.#adapterBus.emitMediaResolve(params),
		};

		return this.#editorPort;
	}
}
