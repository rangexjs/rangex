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
	EmojiPopoverController,
	TableQuickActionsPopoverController,
	TemplateVariablePopoverController,
} from "../PopoverControllers";
import {
	type OnHistoryNavigationFn,
	type OnNodeInsertionFn,
	type OnNonCategorizedOperationFn,
	ToolbarButtonsActionManager,
} from "../ToolbarButtonsActionManager";
import {
	HistoryNavigationButtonsStateManager,
	NodeInsertionButtonsStateManager,
	NonCategorizedOperationButtonsStateManager,
	type UpdateHistoryNavigationButtonsStateParams,
	type UpdateNodeInsertionButtonsStateParams,
	type UpdateNonCategorizedOperationButtonsStateParams,
} from "../ToolbarButtonsStateManager";
import type { RichTextEditorUIConstructorParams } from "./RichTextEditorUI-types";

export class RichTextEditorUI extends HTMLElement {
	#shadowRoot;
	#toolbarButtons;
	#richTextArea;
	#extensions;
	#dispose;
	#menuBarActionManager = new MenuBarActionManager();
	#menuBarButtonsStateManager = new MenuBarButtonsStateManager();
	#toolbarButtonsActionManager = new ToolbarButtonsActionManager();
	#historyNavigationButtonsStateManager =
		new HistoryNavigationButtonsStateManager();
	#nodeInsertionButtonsStateManager = new NodeInsertionButtonsStateManager();
	#nonCategorizedOperationButtonsStateManager =
		new NonCategorizedOperationButtonsStateManager();
	#emojiPopoverController = new EmojiPopoverController();
	#tableQuickActionsPopoverController =
		new TableQuickActionsPopoverController();
	#templateVariablePopoverController = new TemplateVariablePopoverController();

	constructor({
		toolbarButtons,
		richTextArea,
		extensions,
		overlayHost,
		options = {},
	}: RichTextEditorUIConstructorParams) {
		super();

		const { customComponentNames = [], fontFamilyOptions = [] } = options;

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

		this.#shadowRoot = this.attachShadow({ mode: "open" });
		this.#shadowRoot.append(style);
		this.#toolbarButtons = toolbarButtons;
		this.#richTextArea = richTextArea;
		this.#extensions = extensions;

		this.#dispose = render(
			() => (
				<App
					toolbarButtons={this.#toolbarButtons}
					richTextArea={this.#richTextArea}
					extensions={this.#extensions}
					options={{
						customComponentNames,
						fontFamilyOptions,
					}}
					menuBarActionManager={this.#menuBarActionManager}
					menuBarButtonsStateManager={this.#menuBarButtonsStateManager}
					toolbarButtonsActionManager={this.#toolbarButtonsActionManager}
					historyNavigationButtonsStateManager={
						this.#historyNavigationButtonsStateManager
					}
					nodeInsertionButtonsStateManager={
						this.#nodeInsertionButtonsStateManager
					}
					nonCategorizedOperationButtonsStateManager={
						this.#nonCategorizedOperationButtonsStateManager
					}
					emojiPopoverController={this.#emojiPopoverController}
					tableQuickActionsPopoverController={
						this.#tableQuickActionsPopoverController
					}
					templateVariablePopoverController={
						this.#templateVariablePopoverController
					}
					overlayContainerRef={(element) =>
						overlayHost.initialize({ container: element })
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

	get emojiPopover() {
		return this.#emojiPopoverController.publicAPI;
	}

	get tableQuickActionsPopover() {
		return this.#tableQuickActionsPopoverController.publicAPI;
	}

	get templateVariablePort() {
		return this.#templateVariablePopoverController.publicAPI;
	}

	dispose() {
		this.#dispose();
	}
}

customElements.define("rich-text-editor-ui", RichTextEditorUI);
