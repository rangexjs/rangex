import type {
	TemplateVariablePopoverItem,
	TemplateVariablePopoverItems,
	TemplateVariablePopoverOnSelectFn,
	TemplateVariablePort,
	UpdateTemplateVariablePopoverStateParams,
} from "#ports";
import { assertNever } from "../../ErrorHandling";
import type {
	TemplateVariablePopoverListenerOption,
	TemplateVariablePopoverUpdateFilteredItemsFn,
	TemplateVariablePopoverUpdateListenerParams,
} from "./TemplateVariablePopoverController-types";

const ALL_ITEMS: TemplateVariablePopoverItems = [
	{ kind: "full-name", label: "{{FullName}}" },
	{ kind: "first-name", label: "{{FirstName}}" },
	{ kind: "last-name", label: "{{LastName}}" },
	{ kind: "email", label: "{{Email}}" },
	{ kind: "date", label: "{{Date}}" },
];

export class TemplateVariablePopoverController {
	#popover: HTMLDivElement | null = null;
	#query = "";
	#filteredItems: TemplateVariablePopoverItems = [];

	#filteredItemsListeners: Set<TemplateVariablePopoverUpdateFilteredItemsFn> =
		new Set();

	#onSelectListeners: Set<TemplateVariablePopoverOnSelectFn> = new Set();

	get query() {
		return this.#query;
	}

	get filteredItems() {
		return this.#filteredItems;
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

	#updateListener({
		type,
		callback,
		operation,
	}: TemplateVariablePopoverUpdateListenerParams) {
		if (type === "filteredItems") {
			this.#filteredItemsListeners[operation](callback);
			return;
		}

		assertNever(type);
	}

	subscribe(params: TemplateVariablePopoverListenerOption) {
		this.#updateListener({ ...params, operation: "add" });
	}

	unsubscribe(params: TemplateVariablePopoverListenerOption) {
		this.#updateListener({ ...params, operation: "delete" });
	}

	emitSelect(item: TemplateVariablePopoverItem) {
		for (const listener of this.#onSelectListeners) {
			listener(item);
		}
	}

	updateState({ query }: UpdateTemplateVariablePopoverStateParams) {
		if (query !== undefined) {
			this.#query = query;
			this.#computeFilteredItems();
		}
	}

	setPopover(element: HTMLDivElement) {
		this.#popover = element;
	}

	get publicAPI(): TemplateVariablePort {
		const controller = this;

		return {
			get popover() {
				if (!controller.#popover) {
					throw new Error("PopoverNode shouldn't be null.");
				}

				return controller.#popover;
			},

			get filteredItems() {
				return controller.#filteredItems;
			},

			updateState: (params) => this.updateState(params),

			onSelect: (callback) => {
				this.#onSelectListeners.add(callback);
				return () => this.#onSelectListeners.delete(callback);
			},
		};
	}
}
