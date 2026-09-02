import type { OnRemoveCallbackFn, OnUnwrapCallbackFn } from "../_Utilities";
import type {
	AccordionItemConfigPort,
	AccordionItemPublicPort,
	ConstructorParams,
	OnCanInsertUpdateCallbackFn,
	OnCanWrapUpdateCallbackFn,
	OnInsertCallbackFn,
	OnIsActiveUpdateCallbackFn,
	OnWrapCallbackFn,
	UpdateStateParams,
} from "./AccordionItemAdapter-types";

export class AccordionItemAdapter {
	#canInsert = false;
	#canWrap = false;
	#isActive = false;

	// ConfigPort
	#onInsertListeners: Set<OnInsertCallbackFn> = new Set();
	#onRemoveListeners: Set<OnRemoveCallbackFn> = new Set();
	#onWrapListeners: Set<OnWrapCallbackFn> = new Set();
	#onUnwrapListeners: Set<OnUnwrapCallbackFn> = new Set();

	// PublicPort
	#onCanInsertUpdateListeners: Set<OnCanInsertUpdateCallbackFn> = new Set();
	#onCanWrapUpdateListeners: Set<OnCanWrapUpdateCallbackFn> = new Set();
	#onIsActiveUpdateListeners: Set<OnIsActiveUpdateCallbackFn> = new Set();

	#configPort: AccordionItemConfigPort | null = null;
	#publicPort: AccordionItemPublicPort | null = null;

	constructor(...params: ConstructorParams) {
		const [_settings, _options] = params;
	}

	#updateState({ canInsert, canWrap, isActive }: UpdateStateParams) {
		if (canInsert !== undefined) {
			this.#canInsert = canInsert;

			for (const listener of this.#onCanInsertUpdateListeners) {
				listener(this.#canInsert);
			}
		}

		if (canWrap !== undefined) {
			this.#canWrap = canWrap;

			for (const listener of this.#onCanWrapUpdateListeners) {
				listener(this.#canWrap);
			}
		}

		if (isActive !== undefined) {
			this.#isActive = isActive;

			for (const listener of this.#onIsActiveUpdateListeners) {
				listener(this.#isActive);
			}
		}
	}

	get configPort(): AccordionItemConfigPort {
		const adapter = this;

		this.#configPort ??= {
			updateState(params) {
				adapter.#updateState(params);
			},

			onInsert(callback) {
				adapter.#onInsertListeners.add(callback);
				return () => adapter.#onInsertListeners.delete(callback);
			},

			onRemove(callback) {
				adapter.#onRemoveListeners.add(callback);
				return () => adapter.#onRemoveListeners.delete(callback);
			},

			onWrap(callback) {
				adapter.#onWrapListeners.add(callback);
				return () => adapter.#onWrapListeners.delete(callback);
			},

			onUnwrap(callback) {
				adapter.#onUnwrapListeners.add(callback);
				return () => adapter.#onUnwrapListeners.delete(callback);
			},
		};

		return this.#configPort;
	}

	get publicPort(): AccordionItemPublicPort {
		const adapter = this;

		this.#publicPort ??= {
			get canInsert() {
				return adapter.#canInsert;
			},

			get canWrap() {
				return adapter.#canWrap;
			},

			get isActive() {
				return adapter.#isActive;
			},

			onCanInsertUpdate(callback) {
				adapter.#onCanInsertUpdateListeners.add(callback);
				return () => adapter.#onCanInsertUpdateListeners.delete(callback);
			},

			onCanWrapUpdate(callback) {
				adapter.#onCanWrapUpdateListeners.add(callback);
				return () => adapter.#onCanWrapUpdateListeners.delete(callback);
			},

			onIsActiveUpdate(callback) {
				adapter.#onIsActiveUpdateListeners.add(callback);
				return () => adapter.#onIsActiveUpdateListeners.delete(callback);
			},

			insert() {
				for (const listener of adapter.#onInsertListeners) {
					listener();
				}
			},

			remove() {
				for (const listener of adapter.#onRemoveListeners) {
					listener();
				}
			},

			wrap() {
				for (const listener of adapter.#onWrapListeners) {
					listener();
				}
			},

			unwrap() {
				for (const listener of adapter.#onUnwrapListeners) {
					listener();
				}
			},
		};

		return this.#publicPort;
	}
}
