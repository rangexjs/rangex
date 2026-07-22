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
import { EmptyMediaSlotController } from "../NodeSlotControllers";
import {
	AudioPopoverController,
	BlockResizePopoverController,
	CodeBlockPopoverController,
	EmbedPopoverController,
	EmojiPopoverController,
	ImagePopoverController,
	TableQuickActionsPopoverController,
	TemplateVariablePopoverController,
	VideoPopoverController,
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
	#audioPopoverController = new AudioPopoverController();
	#blockResizePopoverController = new BlockResizePopoverController();
	#codeBlockPopoverController = new CodeBlockPopoverController();
	#embedPopoverController = new EmbedPopoverController();
	#emojiPopoverController = new EmojiPopoverController();
	#emptyMediaSlotController = new EmptyMediaSlotController();
	#imagePopoverController = new ImagePopoverController();
	#tableQuickActionsPopoverController =
		new TableQuickActionsPopoverController();
	#templateVariablePopoverController = new TemplateVariablePopoverController();
	#videoPopoverController = new VideoPopoverController();

	constructor({
		toolbarButtons,
		richTextArea,
		extensions,
		overlayHost,
		options = {},
	}: RichTextEditorUIConstructorParams) {
		super();

		const {
			codeBlockLanguages = [],
			codeBlockThemes = [],
			customComponentNames = [],
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
						codeBlockLanguages,
						codeBlockThemes,
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
					audioPopoverController={this.#audioPopoverController}
					blockResizePopoverController={this.#blockResizePopoverController}
					codeBlockPopoverController={this.#codeBlockPopoverController}
					embedPopoverController={this.#embedPopoverController}
					emojiPopoverController={this.#emojiPopoverController}
					imagePopoverController={this.#imagePopoverController}
					tableQuickActionsPopoverController={
						this.#tableQuickActionsPopoverController
					}
					templateVariablePopoverController={
						this.#templateVariablePopoverController
					}
					videoPopoverController={this.#videoPopoverController}
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

	get audioPort() {
		return this.#audioPopoverController.publicAPI;
	}

	get blockResizePopover() {
		return this.#blockResizePopoverController.publicAPI;
	}

	get codeBlockPopover() {
		return this.#codeBlockPopoverController.publicAPI;
	}

	get embedPort() {
		return this.#embedPopoverController.publicAPI;
	}

	get emojiPopover() {
		return this.#emojiPopoverController.publicAPI;
	}

	get emptyMediaSlot() {
		return this.#emptyMediaSlotController.publicAPI;
	}

	get imagePort() {
		return this.#imagePopoverController.publicAPI;
	}

	get tableQuickActionsPopover() {
		return this.#tableQuickActionsPopoverController.publicAPI;
	}

	get templateVariablePort() {
		return this.#templateVariablePopoverController.publicAPI;
	}

	get videoPort() {
		return this.#videoPopoverController.publicAPI;
	}

	dispose() {
		this.#dispose();
	}
}

customElements.define("rich-text-editor-ui", RichTextEditorUI);
