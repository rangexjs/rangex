import {
	AccordionItemAdapter,
	BlockQuoteAdapter,
	CodeBlockAdapter,
	EmptyMediaAdapter,
	FindReplaceAdapter,
	FormattingAdapter,
	LinkAdapter,
	ListAdapter,
	SymbolsAdapter,
	TableAdapter,
	TemplateVariableAdapter,
	TodoListAdapter,
	UndoRedoAdapter,
} from "#adapters";
import type { UIPortsContextValue } from "#ui";
import type { BuildUIPortsParams } from "./BuildUIPorts-types";

/**
 * Resolves each constructed Adapter instance's concrete class to fill in `UIPortsContextValue` —
 * `instanceof` has to run against the raw Adapter (built here, before `RichTextEditor` narrows it
 * down to `uiExtensions`), not against `adapter.uiPort`, which is a plain object literal with no
 * connection to the Adapter's own class hierarchy.
 */
export const buildUIPorts = ({
	adapters,
}: BuildUIPortsParams): UIPortsContextValue => {
	const uiPorts: UIPortsContextValue = {
		accordionItemUIPort: null,
		linkUIPort: null,
		undoRedoUIPort: null,
		symbolsUIPort: null,
		findReplaceUIPort: null,
		formattingUIPort: null,
		blockQuoteUIPort: null,
		codeBlockUIPort: null,
		emptyMediaUIPort: null,
		listUIPort: null,
		tableUIPort: null,
		templateVariableUIPort: null,
		todoListUIPort: null,
	};

	for (const adapter of adapters) {
		if (adapter instanceof AccordionItemAdapter) {
			uiPorts.accordionItemUIPort = adapter.uiPort;
		}

		if (adapter instanceof LinkAdapter) {
			uiPorts.linkUIPort = adapter.uiPort;
		}

		if (adapter instanceof UndoRedoAdapter) {
			uiPorts.undoRedoUIPort = adapter.uiPort;
		}

		if (adapter instanceof SymbolsAdapter) {
			uiPorts.symbolsUIPort = adapter.uiPort;
		}

		if (adapter instanceof FindReplaceAdapter) {
			uiPorts.findReplaceUIPort = adapter.uiPort;
		}

		if (adapter instanceof FormattingAdapter) {
			uiPorts.formattingUIPort = adapter.uiPort;
		}

		if (adapter instanceof BlockQuoteAdapter) {
			uiPorts.blockQuoteUIPort = adapter.uiPort;
		}

		if (adapter instanceof CodeBlockAdapter) {
			uiPorts.codeBlockUIPort = adapter.uiPort;
		}

		if (adapter instanceof EmptyMediaAdapter) {
			uiPorts.emptyMediaUIPort = adapter.uiPort;
		}

		if (adapter instanceof ListAdapter) {
			uiPorts.listUIPort = adapter.uiPort;
		}

		if (adapter instanceof TableAdapter) {
			uiPorts.tableUIPort = adapter.uiPort;
		}

		if (adapter instanceof TemplateVariableAdapter) {
			uiPorts.templateVariableUIPort = adapter.uiPort;
		}

		if (adapter instanceof TodoListAdapter) {
			uiPorts.todoListUIPort = adapter.uiPort;
		}
	}

	return uiPorts;
};
