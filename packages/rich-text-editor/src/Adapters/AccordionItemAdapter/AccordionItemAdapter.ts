import { adapterIds } from "#ports";
import type {
	AccordionItemAdapterConstructorParams,
	AccordionItemEditorPort,
	AccordionItemOnInsertRequestFn,
	AccordionItemToolbarButtonState,
	AccordionItemUIPort,
	AccordionItemUpdateToolbarButtonFn,
	UpdateAccordionItemStateParams,
} from "./AccordionItemAdapter-types";

export class AccordionItemAdapter {
	#toolbarButton: AccordionItemToolbarButtonState = { disabled: true };

	#toolbarButtonListeners: Set<AccordionItemUpdateToolbarButtonFn> = new Set();
	#onInsertRequestListeners: Set<AccordionItemOnInsertRequestFn> = new Set();

	#uiPort: AccordionItemUIPort | null = null;
	#editorPort: AccordionItemEditorPort | null = null;

	constructor(...params: AccordionItemAdapterConstructorParams) {
		const [_settings, _options] = params;
	}

	get id() {
		return adapterIds.accordionItem;
	}

	#updateState({ toolbarButton }: UpdateAccordionItemStateParams) {
		if (toolbarButton !== undefined) {
			this.#toolbarButton = toolbarButton;

			for (const listener of this.#toolbarButtonListeners) {
				listener(this.#toolbarButton);
			}
		}
	}

	get uiPort(): AccordionItemUIPort {
		const adapter = this;

		this.#uiPort ??= {
			get toolbarButton() {
				return adapter.#toolbarButton;
			},

			onToolbarButtonUpdate: (callback) => {
				adapter.#toolbarButtonListeners.add(callback);
				return () => adapter.#toolbarButtonListeners.delete(callback);
			},

			emitInsertRequest: () => {
				for (const listener of adapter.#onInsertRequestListeners) {
					listener();
				}
			},
		};

		return this.#uiPort;
	}

	get editorPort(): AccordionItemEditorPort {
		const adapter = this;

		this.#editorPort ??= {
			updateState: (params) => adapter.#updateState(params),

			onInsertRequest: (callback) => {
				adapter.#onInsertRequestListeners.add(callback);
				return () => adapter.#onInsertRequestListeners.delete(callback);
			},
		};

		return this.#editorPort;
	}
}
