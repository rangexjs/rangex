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
	ToolbarButtonsActionManager,
} from "../ToolbarButtonsActionManager";
import {
	NodeInsertionButtonsStateManager,
	type UpdateNodeInsertionButtonsStateParams,
} from "../ToolbarButtonsStateManager";
import type { RichTextEditorUIConstructorParams } from "./RichTextEditorUI-types";

export class RichTextEditorUI extends HTMLElement {
	#shadowRoot;
	#toolbarButtons;
	#richTextArea;
	#extensions;
	#uiPorts;
	#dispose;
	#menuBarActionManager = new MenuBarActionManager();
	#menuBarButtonsStateManager = new MenuBarButtonsStateManager();
	#toolbarButtonsActionManager = new ToolbarButtonsActionManager();
	#nodeInsertionButtonsStateManager = new NodeInsertionButtonsStateManager();

	constructor({
		toolbarButtons,
		richTextArea,
		extensions,
		uiPorts,
		overlayHost,
	}: RichTextEditorUIConstructorParams) {
		super();

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
		this.#uiPorts = uiPorts;

		this.#dispose = render(
			() => (
				<App
					toolbarButtons={this.#toolbarButtons}
					richTextArea={this.#richTextArea}
					extensions={this.#extensions}
					uiPorts={this.#uiPorts}
					menuBarActionManager={this.#menuBarActionManager}
					menuBarButtonsStateManager={this.#menuBarButtonsStateManager}
					toolbarButtonsActionManager={this.#toolbarButtonsActionManager}
					nodeInsertionButtonsStateManager={
						this.#nodeInsertionButtonsStateManager
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

	dispose() {
		this.#dispose();
	}
}

customElements.define("rich-text-editor-ui", RichTextEditorUI);
