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
	type OnNodeInsertionFn,
	type OnNonCategorizedOperationFn,
	ToolbarButtonsActionManager,
} from "../ToolbarButtonsActionManager";
import {
	NodeInsertionButtonsStateManager,
	NonCategorizedOperationButtonsStateManager,
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
	#nodeInsertionButtonsStateManager = new NodeInsertionButtonsStateManager();
	#nonCategorizedOperationButtonsStateManager =
		new NonCategorizedOperationButtonsStateManager();

	constructor({
		toolbarButtons,
		richTextArea,
		extensions,
		overlayHost,
		options = {},
	}: RichTextEditorUIConstructorParams) {
		super();

		const { customComponentNames = [] } = options;

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
					}}
					menuBarActionManager={this.#menuBarActionManager}
					menuBarButtonsStateManager={this.#menuBarButtonsStateManager}
					toolbarButtonsActionManager={this.#toolbarButtonsActionManager}
					nodeInsertionButtonsStateManager={
						this.#nodeInsertionButtonsStateManager
					}
					nonCategorizedOperationButtonsStateManager={
						this.#nonCategorizedOperationButtonsStateManager
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

	updateNodeInsertionButtonState(state: UpdateNodeInsertionButtonsStateParams) {
		this.#nodeInsertionButtonsStateManager.updateState(state);
	}

	updateNonCategorizedButtonState(
		state: UpdateNonCategorizedOperationButtonsStateParams,
	) {
		this.#nonCategorizedOperationButtonsStateManager.updateState(state);
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

	dispose() {
		this.#dispose();
	}
}

customElements.define("rich-text-editor-ui", RichTextEditorUI);
