import type {
	EmitInsertParams,
	EmitModifyParams,
	LinkDisplayText,
	LinkMode,
	LinkOnCancelFn,
	LinkOnInsertFn,
	LinkOnModifyFn,
	LinkOnToolbarClickFn,
	LinkOnViewChangeFn,
	LinkPort,
	LinkToggleButtons,
	LinkToolbarButtonState,
	LinkURL,
	LinkView,
	OnUnwrapFn,
	UpdateLinkPopoverStateParams,
} from "#ports";
import { assertNever } from "../_Utilities";
import type {
	LinkAdapterConstructorParams,
	LinkListenerOption,
	LinkUpdateDisplayTextFn,
	LinkUpdateListenerParams,
	LinkUpdateModeFn,
	LinkUpdateToggleButtonsFn,
	LinkUpdateToolbarButtonFn,
	LinkUpdateURLFn,
	LinkUpdateViewFn,
} from "./LinkAdapter-types";

export class LinkAdapter {
	#toolbarButton: LinkToolbarButtonState = {
		checked: false,
		disabled: true,
	};
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

	#toolbarButtonListeners: Set<LinkUpdateToolbarButtonFn> = new Set();
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
	#onToolbarClickListeners: Set<LinkOnToolbarClickFn> = new Set();

	// biome-ignore lint/complexity/noUselessConstructor: Allowed for adapters
	// biome-ignore lint/suspicious/noEmptyBlockStatements: Allowed for adapters
	constructor(_params: LinkAdapterConstructorParams) {}

	get toolbarButton() {
		return this.#toolbarButton;
	}

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
		if (type === "toolbarButton") {
			this.#toolbarButtonListeners[operation](callback);
			return;
		}

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

	emitToolbarClick() {
		for (const listener of this.#onToolbarClickListeners) {
			listener();
		}
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
		toolbarButton,
		view,
		mode,
		displayText,
		url,
		toggleButtons,
	}: UpdateLinkPopoverStateParams) {
		if (toolbarButton) {
			this.#toolbarButton = toolbarButton;

			for (const listener of this.#toolbarButtonListeners) {
				listener(this.#toolbarButton);
			}
		}

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

	get port(): LinkPort {
		const adapter = this;

		return {
			get popover() {
				if (!adapter.#popover) {
					throw new Error("PopoverNode shouldn't be null.");
				}

				return adapter.#popover;
			},

			updateState: (params) => this.updateState(params),

			onToolbarClick: (callback) => {
				this.#onToolbarClickListeners.add(callback);
				return () => this.#onToolbarClickListeners.delete(callback);
			},

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
