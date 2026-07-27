import { TemplateVariablePopover } from "#ui-extensions";
import { createOverlayMount, type OverlayMount } from "../_Utilities";
import type {
	TemplateVariableAdapterConstructorParams,
	TemplateVariableEditorPort,
	TemplateVariableOnInsertRequestFn,
	TemplateVariableOnSelectFn,
	TemplateVariableOnUpdateRequestFn,
	TemplateVariablePopoverItems,
	TemplateVariableToolbarButtonState,
	TemplateVariableUIPort,
	TemplateVariableUpdateFilteredItemsFn,
	TemplateVariableUpdateToolbarButtonFn,
	UpdateTemplateVariableStateParams,
} from "./TemplateVariableAdapter-types";

const ALL_ITEMS: TemplateVariablePopoverItems = [
	{ kind: "full-name", label: "{{FullName}}" },
	{ kind: "first-name", label: "{{FirstName}}" },
	{ kind: "last-name", label: "{{LastName}}" },
	{ kind: "email", label: "{{Email}}" },
	{ kind: "date", label: "{{Date}}" },
];

export class TemplateVariableAdapter {
	#overlayMount: OverlayMount;

	#toolbarButton: TemplateVariableToolbarButtonState = {
		disabled: true,
		options: { firstName: null, lastName: null, email: null, date: null },
	};
	#query = "";
	#filteredItems: TemplateVariablePopoverItems = [];

	#toolbarButtonListeners: Set<TemplateVariableUpdateToolbarButtonFn> =
		new Set();
	#filteredItemsListeners: Set<TemplateVariableUpdateFilteredItemsFn> =
		new Set();

	#onInsertRequestListeners: Set<TemplateVariableOnInsertRequestFn> = new Set();
	#onUpdateRequestListeners: Set<TemplateVariableOnUpdateRequestFn> = new Set();
	#onSelectListeners: Set<TemplateVariableOnSelectFn> = new Set();

	#uiPort: TemplateVariableUIPort | null = null;
	#editorPort: TemplateVariableEditorPort | null = null;

	constructor(...params: TemplateVariableAdapterConstructorParams) {
		const [_settings, { overlayHost }] = params;

		this.#overlayMount = createOverlayMount({
			overlayHost,
			component: TemplateVariablePopover,
			props: { uiPort: this.uiPort },
		});
	}

	#computeFilteredItems() {
		const q = this.#query.toLowerCase();
		this.#filteredItems = q
			? ALL_ITEMS.filter((item) => item.label.toLowerCase().includes(q))
			: ALL_ITEMS;

		for (const listener of this.#filteredItemsListeners) {
			listener(this.#filteredItems);
		}
	}

	#updateState({ toolbarButton, query }: UpdateTemplateVariableStateParams) {
		if (toolbarButton !== undefined) {
			this.#toolbarButton = toolbarButton;

			for (const listener of this.#toolbarButtonListeners) {
				listener(this.#toolbarButton);
			}
		}

		if (query !== undefined) {
			this.#query = query;
			this.#computeFilteredItems();
		}
	}

	get uiPort(): TemplateVariableUIPort {
		const adapter = this;

		this.#uiPort ??= {
			get popover() {
				return adapter.#overlayMount.uiOverlayMount;
			},

			get toolbarButton() {
				return adapter.#toolbarButton;
			},

			get filteredItems() {
				return adapter.#filteredItems;
			},

			onToolbarButtonUpdate: (callback) => {
				adapter.#toolbarButtonListeners.add(callback);
				return () => adapter.#toolbarButtonListeners.delete(callback);
			},

			onFilteredItemsUpdate: (callback) => {
				adapter.#filteredItemsListeners.add(callback);
				return () => adapter.#filteredItemsListeners.delete(callback);
			},

			emitInsertRequest: (params) => {
				for (const listener of adapter.#onInsertRequestListeners) {
					listener(params);
				}
			},

			emitUpdateRequest: (params) => {
				for (const listener of adapter.#onUpdateRequestListeners) {
					listener(params);
				}
			},

			emitSelect: (item) => {
				for (const listener of adapter.#onSelectListeners) {
					listener(item);
				}
			},
		};

		return this.#uiPort;
	}

	get editorPort(): TemplateVariableEditorPort {
		const adapter = this;

		this.#editorPort ??= {
			get popover() {
				return adapter.#overlayMount.editorOverlayMount;
			},

			get toolbarButton() {
				return adapter.#toolbarButton;
			},

			get filteredItems() {
				return adapter.#filteredItems;
			},

			updateState: (params) => adapter.#updateState(params),

			onInsertRequest: (callback) => {
				adapter.#onInsertRequestListeners.add(callback);
				return () => adapter.#onInsertRequestListeners.delete(callback);
			},

			onUpdateRequest: (callback) => {
				adapter.#onUpdateRequestListeners.add(callback);
				return () => adapter.#onUpdateRequestListeners.delete(callback);
			},

			onSelect: (callback) => {
				adapter.#onSelectListeners.add(callback);
				return () => adapter.#onSelectListeners.delete(callback);
			},
		};

		return this.#editorPort;
	}
}
