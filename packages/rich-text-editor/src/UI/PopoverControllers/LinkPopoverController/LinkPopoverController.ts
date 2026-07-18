import type {
	EmitInsertParams,
	EmitModifyParams,
	LinkDisplayText,
	LinkMode,
	LinkOnCancelFn,
	LinkOnInsertFn,
	LinkOnModifyFn,
	LinkOnViewChangeFn,
	LinkPort,
	LinkToggleButtons,
	LinkURL,
	LinkView,
	OnUnwrapFn,
	UpdateLinkPopoverStateParams,
} from "#ports";
import { assertNever } from "../../ErrorHandling";
import type {
	LinkListenerOption,
	LinkUpdateDisplayTextFn,
	LinkUpdateListenerParams,
	LinkUpdateModeFn,
	LinkUpdateToggleButtonsFn,
	LinkUpdateURLFn,
	LinkUpdateViewFn,
} from "./LinkPopoverController-types";

export class LinkPopoverController {
	#popover: HTMLDivElement | null = null;
	#view: LinkView = "preview";
	#mode: LinkMode = "insert";
	#displayText: LinkDisplayText = {
		inputValue: "",
		disabled: true,
	};
	#url: LinkURL = {
		inputValue: "",
	};
	#toggleButtons: LinkToggleButtons = {
		isNewTab: false,
	};

	#viewListeners: Set<LinkUpdateViewFn> = new Set();
	#modeListeners: Set<LinkUpdateModeFn> = new Set();
	#displayTextListeners: Set<LinkUpdateDisplayTextFn> = new Set();
	#urlListeners: Set<LinkUpdateURLFn> = new Set();
	#toggleButtonsListeners: Set<LinkUpdateToggleButtonsFn> = new Set();

	#onViewChangeListeners: Set<LinkOnViewChangeFn> = new Set();
	#onCancelListeners: Set<LinkOnCancelFn> = new Set();
	#onInsertListeners: Set<LinkOnInsertFn> = new Set();
	#onModifyListeners: Set<LinkOnModifyFn> = new Set();
	#onUnwrapListeners: Set<OnUnwrapFn> = new Set();

	get view() {
		return this.#view;
	}

	get mode() {
		return this.#mode;
	}

	get displayText() {
		return this.#displayText;
	}

	get url() {
		return this.#url;
	}

	get toggleButtons() {
		return this.#toggleButtons;
	}

	#updateListener({ type, callback, operation }: LinkUpdateListenerParams) {
		if (type === "view") {
			this.#viewListeners[operation](callback);
			return;
		}

		if (type === "mode") {
			this.#modeListeners[operation](callback);
			return;
		}

		if (type === "displayText") {
			this.#displayTextListeners[operation](callback);
			return;
		}

		if (type === "url") {
			this.#urlListeners[operation](callback);
			return;
		}

		if (type === "toggleButtons") {
			this.#toggleButtonsListeners[operation](callback);
			return;
		}

		assertNever(type);
	}

	subscribe(params: LinkListenerOption) {
		this.#updateListener({ ...params, operation: "add" });
	}

	unsubscribe(params: LinkListenerOption) {
		this.#updateListener({ ...params, operation: "delete" });
	}

	emitViewChange() {
		for (const listener of this.#onViewChangeListeners) {
			listener(this.#view);
		}
	}

	emitCancel() {
		for (const listener of this.#onCancelListeners) {
			listener();
		}
	}

	emitInsert(params: EmitInsertParams) {
		for (const listener of this.#onInsertListeners) {
			listener(params);
		}
	}

	emitModify(params: EmitModifyParams) {
		for (const listener of this.#onModifyListeners) {
			listener(params);
		}
	}

	emitUnwrap() {
		for (const listener of this.#onUnwrapListeners) {
			listener();
		}
	}

	updateState({
		view,
		mode,
		displayText,
		url,
		toggleButtons,
	}: UpdateLinkPopoverStateParams) {
		if (view) {
			this.#view = view;

			for (const listener of this.#viewListeners) {
				listener(this.#view);
			}
		}

		if (mode) {
			this.#mode = mode;

			for (const listener of this.#modeListeners) {
				listener(this.#mode);
			}
		}

		if (displayText) {
			this.#displayText = displayText;

			for (const listener of this.#displayTextListeners) {
				listener(this.#displayText);
			}
		}

		if (url) {
			this.#url = url;

			for (const listener of this.#urlListeners) {
				listener(this.#url);
			}
		}

		if (toggleButtons) {
			this.#toggleButtons = toggleButtons;

			for (const listener of this.#toggleButtonsListeners) {
				listener(this.#toggleButtons);
			}
		}
	}

	setPopover(element: HTMLDivElement) {
		this.#popover = element;
	}

	get publicAPI(): LinkPort {
		const controller = this;

		return {
			get popover() {
				if (!controller.#popover) {
					throw new Error("PopoverNode shouldn't be null.");
				}

				return controller.#popover;
			},

			updateState: (params) => this.updateState(params),

			onViewChange: (callback) => {
				this.#onViewChangeListeners.add(callback);
				return () => this.#onViewChangeListeners.delete(callback);
			},

			onCancel: (callback) => {
				this.#onCancelListeners.add(callback);
				return () => this.#onCancelListeners.delete(callback);
			},

			onInsert: (callback) => {
				this.#onInsertListeners.add(callback);
				return () => this.#onInsertListeners.delete(callback);
			},

			onModify: (callback) => {
				this.#onModifyListeners.add(callback);
				return () => this.#onModifyListeners.delete(callback);
			},

			onUnwrap: (callback) => {
				this.#onUnwrapListeners.add(callback);
				return () => this.#onUnwrapListeners.delete(callback);
			},
		};
	}
}
