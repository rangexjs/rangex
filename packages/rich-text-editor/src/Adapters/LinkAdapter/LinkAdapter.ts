import type { OnUnwrapFn } from "#ports";
import { LinkPopover } from "#ui-extensions";
import { createOverlayMount, type OverlayMount } from "../_Utilities";
import type {
	LinkAdapterConstructorParams,
	LinkDisplayText,
	LinkEditorPort,
	LinkMode,
	LinkOnCancelFn,
	LinkOnInsertFn,
	LinkOnModifyFn,
	LinkOnToolbarClickFn,
	LinkOnViewChangeFn,
	LinkToggleButtons,
	LinkToolbarButtonState,
	LinkUIPort,
	LinkUpdateDisplayTextFn,
	LinkUpdateModeFn,
	LinkUpdateToggleButtonsFn,
	LinkUpdateToolbarButtonFn,
	LinkUpdateURLFn,
	LinkUpdateViewFn,
	LinkURL,
	LinkView,
	UpdateLinkStateParams,
} from "./LinkAdapter-types";

export class LinkAdapter {
	#overlayMount: OverlayMount;
	#toolbarButton: LinkToolbarButtonState = {
		checked: false,
		disabled: true,
	};
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

	#uiPort: LinkUIPort | null = null;
	#editorPort: LinkEditorPort | null = null;

	constructor(...params: LinkAdapterConstructorParams) {
		const [_settings, { overlayHost }] = params;

		this.#overlayMount = createOverlayMount({
			overlayHost,
			component: LinkPopover,
			props: { uiPort: this.uiPort },
		});
	}

	#updateState({
		toolbarButton,
		view,
		mode,
		displayText,
		url,
		toggleButtons,
	}: UpdateLinkStateParams) {
		if (toolbarButton !== undefined) {
			this.#toolbarButton = toolbarButton;

			for (const listener of this.#toolbarButtonListeners) {
				listener(this.#toolbarButton);
			}
		}

		if (view !== undefined) {
			this.#view = view;

			for (const listener of this.#viewListeners) {
				listener(this.#view);
			}
		}

		if (mode !== undefined) {
			this.#mode = mode;

			for (const listener of this.#modeListeners) {
				listener(this.#mode);
			}
		}

		if (displayText !== undefined) {
			this.#displayText = displayText;

			for (const listener of this.#displayTextListeners) {
				listener(this.#displayText);
			}
		}

		if (url !== undefined) {
			this.#url = url;

			for (const listener of this.#urlListeners) {
				listener(this.#url);
			}
		}

		if (toggleButtons !== undefined) {
			this.#toggleButtons = toggleButtons;

			for (const listener of this.#toggleButtonsListeners) {
				listener(this.#toggleButtons);
			}
		}
	}

	get uiPort(): LinkUIPort {
		const adapter = this;

		this.#uiPort ??= {
			get popover() {
				return adapter.#overlayMount.uiOverlayMount;
			},

			get toolbarButton() {
				return adapter.#toolbarButton;
			},

			get view() {
				return adapter.#view;
			},

			get mode() {
				return adapter.#mode;
			},

			get displayText() {
				return adapter.#displayText;
			},

			get url() {
				return adapter.#url;
			},

			get toggleButtons() {
				return adapter.#toggleButtons;
			},

			onToolbarButtonUpdate: (callback) => {
				adapter.#toolbarButtonListeners.add(callback);
				return () => adapter.#toolbarButtonListeners.delete(callback);
			},

			onViewUpdate: (callback) => {
				adapter.#viewListeners.add(callback);
				return () => adapter.#viewListeners.delete(callback);
			},

			onModeUpdate: (callback) => {
				adapter.#modeListeners.add(callback);
				return () => adapter.#modeListeners.delete(callback);
			},

			onDisplayTextUpdate: (callback) => {
				adapter.#displayTextListeners.add(callback);
				return () => adapter.#displayTextListeners.delete(callback);
			},

			onUrlUpdate: (callback) => {
				adapter.#urlListeners.add(callback);
				return () => adapter.#urlListeners.delete(callback);
			},

			onToggleButtonsUpdate: (callback) => {
				adapter.#toggleButtonsListeners.add(callback);
				return () => adapter.#toggleButtonsListeners.delete(callback);
			},

			setView: (view) => adapter.#updateState({ view }),

			emitToolbarClick: () => {
				for (const listener of adapter.#onToolbarClickListeners) {
					listener();
				}
			},

			emitViewChange: () => {
				for (const listener of adapter.#onViewChangeListeners) {
					listener(adapter.#view);
				}
			},

			emitCancel: () => {
				for (const listener of adapter.#onCancelListeners) {
					listener();
				}
			},

			emitInsert: (params) => {
				for (const listener of adapter.#onInsertListeners) {
					listener(params);
				}
			},

			emitModify: (params) => {
				for (const listener of adapter.#onModifyListeners) {
					listener(params);
				}
			},

			emitUnwrap: () => {
				for (const listener of adapter.#onUnwrapListeners) {
					listener();
				}
			},
		};

		return this.#uiPort;
	}

	get editorPort(): LinkEditorPort {
		const adapter = this;

		this.#editorPort ??= {
			get popover() {
				return adapter.#overlayMount.editorOverlayMount;
			},

			updateState: (params) => adapter.#updateState(params),

			onToolbarClick: (callback) => {
				adapter.#onToolbarClickListeners.add(callback);
				return () => adapter.#onToolbarClickListeners.delete(callback);
			},

			onViewChange: (callback) => {
				adapter.#onViewChangeListeners.add(callback);
				return () => adapter.#onViewChangeListeners.delete(callback);
			},

			onCancel: (callback) => {
				adapter.#onCancelListeners.add(callback);
				return () => adapter.#onCancelListeners.delete(callback);
			},

			onInsert: (callback) => {
				adapter.#onInsertListeners.add(callback);
				return () => adapter.#onInsertListeners.delete(callback);
			},

			onModify: (callback) => {
				adapter.#onModifyListeners.add(callback);
				return () => adapter.#onModifyListeners.delete(callback);
			},

			onUnwrap: (callback) => {
				adapter.#onUnwrapListeners.add(callback);
				return () => adapter.#onUnwrapListeners.delete(callback);
			},
		};

		return this.#editorPort;
	}
}
