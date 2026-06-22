import { render } from "solid-js/web";
import { App } from "../Components";
import { toolbarButtonActionsName } from "../Constants";
import inlineTailwind from "../global.css?inline";
import {
	MenuBarActionManager,
	type OnMenuBarFn,
} from "../MenuBarActionManager";
import {
	MenuBarButtonsStateManager,
	type UpdateMenuBarButtonsStateParams,
} from "../MenuBarButtonsStateManager";
import {
	CodeBlockPopoverController,
	LinkPopoverController,
	MentionPopoverController,
	TableQuickActionsPopoverController,
} from "../PopoverControllers";
import { ToolbarButtonDefaultValues } from "../ToolbarButtonDefaultValues";
import {
	type OnFormatStylesFn,
	type OnHistoryNavigationFn,
	type OnNodeInsertionFn,
	type OnNonCategorizedOperationFn,
	ToolbarButtonsActionManager,
} from "../ToolbarButtonsActionManager";
import {
	FormatStylesButtonsStateManager,
	HistoryNavigationButtonsStateManager,
	NodeInsertionButtonsStateManager,
	NonCategorizedOperationButtonsStateManager,
	type UpdateFormatStylesButtonsStateParams,
	type UpdateHistoryNavigationButtonsStateParams,
	type UpdateNodeInsertionButtonsStateParams,
	type UpdateNonCategorizedOperationButtonsStateParams,
} from "../ToolbarButtonsStateManager";
import type { RichTextEditorUIConstructorParams } from "./RichTextEditorUI-types";

export class RichTextEditorUI extends HTMLElement {
	#shadowRoot;
	#toolbarButtons;
	#richTextArea;
	#menuBarActionManager = new MenuBarActionManager();
	#menuBarButtonsStateManager = new MenuBarButtonsStateManager();
	#toolbarButtonsActionManager = new ToolbarButtonsActionManager();
	#formatStylesButtonsStateManager = new FormatStylesButtonsStateManager();
	#historyNavigationButtonsStateManager =
		new HistoryNavigationButtonsStateManager();
	#nodeInsertionButtonsStateManager = new NodeInsertionButtonsStateManager();
	#nonCategorizedOperationButtonsStateManager =
		new NonCategorizedOperationButtonsStateManager();
	#toolbarButtonDefaultValues = new ToolbarButtonDefaultValues();
	#codeBlockPopoverController = new CodeBlockPopoverController();
	#linkPopoverController = new LinkPopoverController();
	#mentionPopoverController = new MentionPopoverController();
	#tableQuickActionsPopoverController =
		new TableQuickActionsPopoverController();

	constructor({
		toolbarButtons,
		richTextArea,
		defaultStyleValues,
		options = {},
	}: RichTextEditorUIConstructorParams) {
		super();

		const {
			codeBlockLanguages = [],
			codeBlockThemes = [],
			fontFamilyOptions = [],
		} = options;

		const style = document.createElement("style");
		style.textContent = inlineTailwind;

		if (import.meta.hot) {
			import.meta.hot.accept("../global.css?inline", (module) => {
				if (!module) {
					throw new Error("Module can't be undefined.");
				}

				style.textContent = module.default;
			});
		}

		if (defaultStyleValues) {
			this.#toolbarButtonDefaultValues.updateState(defaultStyleValues);
		}

		this.#shadowRoot = this.attachShadow({ mode: "open" });
		this.#shadowRoot.append(style);
		this.#toolbarButtons = toolbarButtons;
		this.#richTextArea = richTextArea;

		render(
			() => (
				<App
					toolbarButtons={this.#toolbarButtons}
					richTextArea={this.#richTextArea}
					options={{ codeBlockLanguages, codeBlockThemes, fontFamilyOptions }}
					menuBarActionManager={this.#menuBarActionManager}
					menuBarButtonsStateManager={this.#menuBarButtonsStateManager}
					toolbarButtonsActionManager={this.#toolbarButtonsActionManager}
					formatStylesButtonsStateManager={
						this.#formatStylesButtonsStateManager
					}
					historyNavigationButtonsStateManager={
						this.#historyNavigationButtonsStateManager
					}
					nodeInsertionButtonsStateManager={
						this.#nodeInsertionButtonsStateManager
					}
					nonCategorizedOperationButtonsStateManager={
						this.#nonCategorizedOperationButtonsStateManager
					}
					toolbarButtonDefaultValues={this.#toolbarButtonDefaultValues}
					codeBlockPopoverController={this.#codeBlockPopoverController}
					linkPopoverController={this.#linkPopoverController}
					mentionPopoverController={this.#mentionPopoverController}
					tableQuickActionsPopoverController={
						this.#tableQuickActionsPopoverController
					}
				/>
			),
			this.#shadowRoot,
		);
	}

	updateMenuBarButtonState(state: UpdateMenuBarButtonsStateParams) {
		this.#menuBarButtonsStateManager.updateState(state);
	}

	onMenuBar(callback: OnMenuBarFn) {
		this.#menuBarActionManager.subscribe(callback);

		return () => {
			this.#menuBarActionManager.unsubscribe(callback);
		};
	}

	updateFormatStylesButtonState(state: UpdateFormatStylesButtonsStateParams) {
		this.#formatStylesButtonsStateManager.updateState(state);
	}

	updateHistoryNavigationButtonState(
		state: UpdateHistoryNavigationButtonsStateParams,
	) {
		this.#historyNavigationButtonsStateManager.updateState(state);
	}

	updateNodeInsertionButtonState(state: UpdateNodeInsertionButtonsStateParams) {
		this.#nodeInsertionButtonsStateManager.updateState(state);
	}

	updateNonCategorizedButtonState(
		state: UpdateNonCategorizedOperationButtonsStateParams,
	) {
		this.#nonCategorizedOperationButtonsStateManager.updateState(state);
	}

	onFormatStyles(callback: OnFormatStylesFn) {
		this.#toolbarButtonsActionManager.subscribe({
			type: toolbarButtonActionsName.formatStyles,
			callback,
		});

		return () => {
			this.#toolbarButtonsActionManager.unsubscribe({
				type: toolbarButtonActionsName.formatStyles,
				callback,
			});
		};
	}

	onHistoryNavigation(callback: OnHistoryNavigationFn) {
		this.#toolbarButtonsActionManager.subscribe({
			type: toolbarButtonActionsName.historyNavigation,
			callback,
		});

		return () => {
			this.#toolbarButtonsActionManager.unsubscribe({
				type: toolbarButtonActionsName.historyNavigation,
				callback,
			});
		};
	}

	onNodeInsertion(callback: OnNodeInsertionFn) {
		this.#toolbarButtonsActionManager.subscribe({
			type: toolbarButtonActionsName.nodeInsertion,
			callback,
		});

		return () => {
			this.#toolbarButtonsActionManager.unsubscribe({
				type: toolbarButtonActionsName.nodeInsertion,
				callback,
			});
		};
	}

	onNonCategorizedOperation(callback: OnNonCategorizedOperationFn) {
		this.#toolbarButtonsActionManager.subscribe({
			type: toolbarButtonActionsName.nonCategorizedOperation,
			callback,
		});

		return () => {
			this.#toolbarButtonsActionManager.unsubscribe({
				type: toolbarButtonActionsName.nonCategorizedOperation,
				callback,
			});
		};
	}

	get codeBlockPopover() {
		return this.#codeBlockPopoverController.publicAPI;
	}

	get linkPopover() {
		return this.#linkPopoverController.publicAPI;
	}

	get mentionPopover() {
		return this.#mentionPopoverController.publicAPI;
	}

	get tableQuickActionsPopover() {
		return this.#tableQuickActionsPopoverController.publicAPI;
	}
}

customElements.define("rich-text-editor-ui", RichTextEditorUI);
