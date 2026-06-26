import { toolbarButtonsName } from "../../Constants";
import { assertNever } from "../../ErrorHandling";
import type {
	AnchorToolbarButtonState,
	BlockQuoteToolbarButtonState,
	CheckboxListToolbarButtonState,
	CodeBlockToolbarButtonState,
	CustomComponentToolbarButtonState,
	ImageToolbarButtonState,
	OrderedListToolbarButtonState,
	SymbolsToolbarButtonState,
	TableToolbarButtonState,
	TemplateVariableToolbarButtonState,
	UnorderedListToolbarButtonState,
} from "../../ToolbarButtonProps";
import type {
	ListenerOption,
	StateChangeFn,
	UpdateAnchorStateFn,
	UpdateBlockQuoteStateFn,
	UpdateCheckboxListStateFn,
	UpdateCodeBlockStateFn,
	UpdateCustomComponentStateFn,
	UpdateImageStateFn,
	UpdateListenerParams,
	UpdateNodeInsertionButtonsStateParams,
	UpdateOrderedListStateFn,
	UpdateSymbolsStateFn,
	UpdateTableStateFn,
	UpdateTemplateVariableStateFn,
	UpdateUnorderedListStateFn,
} from "./NodeInsertionButtonsStateManager-types";

export class NodeInsertionButtonsStateManager {
	#anchor: AnchorToolbarButtonState = { disabled: true, checked: false };
	#blockQuote: BlockQuoteToolbarButtonState = { disabled: true };
	#checkboxList: CheckboxListToolbarButtonState = { disabled: true };
	#codeBlock: CodeBlockToolbarButtonState = { disabled: true };
	#customComponent: CustomComponentToolbarButtonState = { disabled: true };
	#image: ImageToolbarButtonState = { disabled: true };
	#orderedList: OrderedListToolbarButtonState = { disabled: true };
	#symbols: SymbolsToolbarButtonState = { disabled: true };
	#table: TableToolbarButtonState = { disabled: true };
	#templateVariable: TemplateVariableToolbarButtonState = {
		disabled: true,
		options: { firstName: null, lastName: null, email: null, date: null },
	};
	#unorderedList: UnorderedListToolbarButtonState = { disabled: true };

	#anchorListeners: Set<UpdateAnchorStateFn> = new Set();
	#blockQuoteListeners: Set<UpdateBlockQuoteStateFn> = new Set();
	#checkboxListListeners: Set<UpdateCheckboxListStateFn> = new Set();
	#codeBlockListeners: Set<UpdateCodeBlockStateFn> = new Set();
	#customComponentListeners: Set<UpdateCustomComponentStateFn> = new Set();
	#imageListeners: Set<UpdateImageStateFn> = new Set();
	#orderedListListeners: Set<UpdateOrderedListStateFn> = new Set();
	#symbolsListeners: Set<UpdateSymbolsStateFn> = new Set();
	#tableListeners: Set<UpdateTableStateFn> = new Set();
	#templateVariableListeners: Set<UpdateTemplateVariableStateFn> = new Set();
	#unorderedListListeners: Set<UpdateUnorderedListStateFn> = new Set();
	#stateChangeListeners: Set<StateChangeFn> = new Set();

	get anchor() {
		return this.#anchor;
	}

	get blockQuote() {
		return this.#blockQuote;
	}

	get checkboxList() {
		return this.#checkboxList;
	}

	get codeBlock() {
		return this.#codeBlock;
	}

	get customComponent() {
		return this.#customComponent;
	}

	get image() {
		return this.#image;
	}

	get orderedList() {
		return this.#orderedList;
	}

	get symbols() {
		return this.#symbols;
	}

	get table() {
		return this.#table;
	}

	get templateVariable() {
		return this.#templateVariable;
	}

	get unorderedList() {
		return this.#unorderedList;
	}

	#updateListener({ type, callback, operation }: UpdateListenerParams) {
		if (type === toolbarButtonsName.anchor) {
			this.#anchorListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.blockQuote) {
			this.#blockQuoteListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.checkboxList) {
			this.#checkboxListListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.codeBlock) {
			this.#codeBlockListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.customComponent) {
			this.#customComponentListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.image) {
			this.#imageListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.symbols) {
			this.#symbolsListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.orderedList) {
			this.#orderedListListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.table) {
			this.#tableListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.templateVariable) {
			this.#templateVariableListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.unorderedList) {
			this.#unorderedListListeners[operation](callback);
			return;
		}

		if (type === "statechange") {
			this.#stateChangeListeners[operation](callback);
			return;
		}

		assertNever(type);
	}

	subscribe(params: ListenerOption) {
		this.#updateListener({ ...params, operation: "add" });
	}

	unsubscribe(params: ListenerOption) {
		this.#updateListener({ ...params, operation: "delete" });
	}

	updateState({
		anchor,
		blockQuote,
		checkboxList,
		codeBlock,
		customComponent,
		image,
		orderedList,
		symbols,
		table,
		templateVariable,
		unorderedList,
	}: UpdateNodeInsertionButtonsStateParams) {
		if (anchor) {
			this.#anchor = { ...this.#anchor, ...anchor };

			for (const listener of this.#anchorListeners) {
				listener(this.#anchor);
			}
		}

		if (blockQuote) {
			this.#blockQuote = { ...this.#blockQuote, ...blockQuote };

			for (const listener of this.#blockQuoteListeners) {
				listener(this.#blockQuote);
			}
		}

		if (checkboxList) {
			this.#checkboxList = { ...this.#checkboxList, ...checkboxList };

			for (const listener of this.#checkboxListListeners) {
				listener(this.#checkboxList);
			}
		}

		if (codeBlock) {
			this.#codeBlock = { ...this.#codeBlock, ...codeBlock };

			for (const listener of this.#codeBlockListeners) {
				listener(this.#codeBlock);
			}
		}

		if (customComponent) {
			this.#customComponent = { ...this.#customComponent, ...customComponent };

			for (const listener of this.#customComponentListeners) {
				listener(this.#customComponent);
			}
		}

		if (image) {
			this.#image = { ...this.#image, ...image };

			for (const listener of this.#imageListeners) {
				listener(this.#image);
			}
		}

		if (orderedList) {
			this.#orderedList = { ...this.#orderedList, ...orderedList };

			for (const listener of this.#orderedListListeners) {
				listener(this.#orderedList);
			}
		}

		if (symbols) {
			this.#symbols = { ...this.#symbols, ...symbols };

			for (const listener of this.#symbolsListeners) {
				listener(this.#symbols);
			}
		}

		if (table) {
			this.#table = { ...this.#table, ...table };

			for (const listener of this.#tableListeners) {
				listener(this.#table);
			}
		}

		if (templateVariable) {
			this.#templateVariable = {
				...this.#templateVariable,
				...templateVariable,
			};

			for (const listener of this.#templateVariableListeners) {
				listener(this.#templateVariable);
			}
		}

		if (unorderedList) {
			this.#unorderedList = { ...this.#unorderedList, ...unorderedList };

			for (const listener of this.#unorderedListListeners) {
				listener(this.#unorderedList);
			}
		}

		for (const listener of this.#stateChangeListeners) {
			listener();
		}
	}
}
