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
	AudioEditPopoverController,
	AudioSwapPopoverController,
	BlockResizePopoverController,
	CodeBlockPopoverController,
	EmojiPopoverController,
	ImageEditPopoverController,
	ImageSwapPopoverController,
	LinkPopoverController,
	MentionPopoverController,
	TableQuickActionsPopoverController,
	TemplateVariablePopoverController,
	VideoEditPopoverController,
	VideoSwapPopoverController,
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
	#dispose;
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
	#audioEditPopoverController = new AudioEditPopoverController();
	#audioSwapPopoverController = new AudioSwapPopoverController();
	#blockResizePopoverController = new BlockResizePopoverController();
	#codeBlockPopoverController = new CodeBlockPopoverController();
	#emojiPopoverController = new EmojiPopoverController();
	#emptyMediaSlotController = new EmptyMediaSlotController();
	#imageEditPopoverController = new ImageEditPopoverController();
	#imageSwapPopoverController = new ImageSwapPopoverController();
	#linkPopoverController = new LinkPopoverController();
	#mentionPopoverController = new MentionPopoverController();
	#tableQuickActionsPopoverController =
		new TableQuickActionsPopoverController();
	#templateVariablePopoverController = new TemplateVariablePopoverController();
	#videoEditPopoverController = new VideoEditPopoverController();
	#videoSwapPopoverController = new VideoSwapPopoverController();

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

		if (defaultStyleValues) {
			this.#toolbarButtonDefaultValues.updateState(defaultStyleValues);
		}

		this.#shadowRoot = this.attachShadow({ mode: "open" });
		this.#shadowRoot.append(style);
		this.#toolbarButtons = toolbarButtons;
		this.#richTextArea = richTextArea;

		this.#dispose = render(
			() => (
				<App
					toolbarButtons={this.#toolbarButtons}
					richTextArea={this.#richTextArea}
					options={{
						codeBlockLanguages,
						codeBlockThemes,
						customComponentNames,
						fontFamilyOptions,
					}}
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
					audioEditPopoverController={this.#audioEditPopoverController}
					audioSwapPopoverController={this.#audioSwapPopoverController}
					blockResizePopoverController={this.#blockResizePopoverController}
					codeBlockPopoverController={this.#codeBlockPopoverController}
					emojiPopoverController={this.#emojiPopoverController}
					imageEditPopoverController={this.#imageEditPopoverController}
					imageSwapPopoverController={this.#imageSwapPopoverController}
					linkPopoverController={this.#linkPopoverController}
					mentionPopoverController={this.#mentionPopoverController}
					tableQuickActionsPopoverController={
						this.#tableQuickActionsPopoverController
					}
					templateVariablePopoverController={
						this.#templateVariablePopoverController
					}
					videoEditPopoverController={this.#videoEditPopoverController}
					videoSwapPopoverController={this.#videoSwapPopoverController}
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

	get audioEditPopover() {
		return this.#audioEditPopoverController.publicAPI;
	}

	get audioSwapPopover() {
		return this.#audioSwapPopoverController.publicAPI;
	}

	get blockResizePopover() {
		return this.#blockResizePopoverController.publicAPI;
	}

	get codeBlockPopover() {
		return this.#codeBlockPopoverController.publicAPI;
	}

	get emojiPopover() {
		return this.#emojiPopoverController.publicAPI;
	}

	get emptyMediaSlot() {
		return this.#emptyMediaSlotController.publicAPI;
	}

	get imageEditPopover() {
		return this.#imageEditPopoverController.publicAPI;
	}

	get imageSwapPopover() {
		return this.#imageSwapPopoverController.publicAPI;
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

	get templateVariablePopover() {
		return this.#templateVariablePopoverController.publicAPI;
	}

	get videoEditPopover() {
		return this.#videoEditPopoverController.publicAPI;
	}

	get videoSwapPopover() {
		return this.#videoSwapPopoverController.publicAPI;
	}

	dispose() {
		this.#dispose();
	}
}

customElements.define("rich-text-editor-ui", RichTextEditorUI);
