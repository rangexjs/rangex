import type { OnDeleteCallbackFn, OnUnwrapCallbackFn } from "../_Utilities";
import type {
	AccordionItemAdapterConstructorParams,
	AccordionItemConfigPort,
	AccordionItemOnCanInsertCallbackFn,
	AccordionItemOnCanWrapCallbackFn,
	AccordionItemOnInsertCallbackFn,
	AccordionItemOnIsActiveCallbackFn,
	AccordionItemOnWrapCallbackFn,
	AccordionItemPublicPort,
	UpdateAccordionItemStateParams,
} from "./AccordionItemAdapter-types";

export class AccordionItemAdapter {
	#canInsert = false;
	#canWrap = false;
	#isActive = false;

	#canInsertListeners: Set<AccordionItemOnCanInsertCallbackFn> = new Set();
	#canWrapListeners: Set<AccordionItemOnCanWrapCallbackFn> = new Set();
	#isActiveListeners: Set<AccordionItemOnIsActiveCallbackFn> = new Set();

	#onInsertListeners: Set<AccordionItemOnInsertCallbackFn> = new Set();
	#onWrapListeners: Set<AccordionItemOnWrapCallbackFn> = new Set();
	#onDeleteListeners: Set<OnDeleteCallbackFn> = new Set();
	#onUnwrapListeners: Set<OnUnwrapCallbackFn> = new Set();

	#configPort: AccordionItemConfigPort | null = null;
	#publicPort: AccordionItemPublicPort | null = null;

	constructor(...params: AccordionItemAdapterConstructorParams) {
		const [_settings, _options] = params;
	}

	#updateState({
		canInsert,
		canWrap,
		isActive,
	}: UpdateAccordionItemStateParams) {
		if (canInsert !== undefined) {
			this.#canInsert = canInsert;

			for (const listener of this.#canInsertListeners) {
				listener(this.#canInsert);
			}
		}

		if (canWrap !== undefined) {
			this.#canWrap = canWrap;

			for (const listener of this.#canWrapListeners) {
				listener(this.#canWrap);
			}
		}

		if (isActive !== undefined) {
			this.#isActive = isActive;

			for (const listener of this.#isActiveListeners) {
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

			onWrap(callback) {
				adapter.#onWrapListeners.add(callback);
				return () => adapter.#onWrapListeners.delete(callback);
			},

			onDelete(callback) {
				adapter.#onDeleteListeners.add(callback);
				return () => adapter.#onDeleteListeners.delete(callback);
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
				adapter.#canInsertListeners.add(callback);
				return () => adapter.#canInsertListeners.delete(callback);
			},

			onCanWrapUpdate(callback) {
				adapter.#canWrapListeners.add(callback);
				return () => adapter.#canWrapListeners.delete(callback);
			},

			onIsActiveUpdate(callback) {
				adapter.#isActiveListeners.add(callback);
				return () => adapter.#isActiveListeners.delete(callback);
			},

			insert() {
				for (const listener of adapter.#onInsertListeners) {
					listener();
				}
			},

			delete() {
				for (const listener of adapter.#onDeleteListeners) {
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
