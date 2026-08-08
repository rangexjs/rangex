import { render } from "solid-js/web";
import { App } from "../Components";
import { createDialogOpenObserver } from "../DialogOpenObserver";
import inlineTailwind from "../global.css?inline";
import {
	MenuBarActionManager,
	type OnMenuBarFn,
} from "../MenuBarActionManager";
import {
	MenuBarButtonsStateManager,
	type UpdateMenuBarButtonsStateParams,
} from "../MenuBarButtonsStateManager";
import type { RichTextEditorUIConstructorParams } from "./RichTextEditorUI-types";

const tailwindStyleSheet = new CSSStyleSheet();
tailwindStyleSheet.replaceSync(inlineTailwind);

if (import.meta.hot) {
	import.meta.hot.accept("../global.css?inline", (module) => {
		if (!module) {
			throw new Error("Module can't be undefined.");
		}

		tailwindStyleSheet.replaceSync(module.default);
	});
}

export class RichTextEditorUI extends HTMLElement {
	#shadowRoot;
	#toolbarButtons;
	#richTextArea;
	#extensions;
	#uiPorts;
	#dispose;
	#menuBarActionManager = new MenuBarActionManager();
	#menuBarButtonsStateManager = new MenuBarButtonsStateManager();
	#dialogOpenCleanup;

	constructor({
		toolbarButtons,
		richTextArea,
		extensions,
		uiPorts,
		overlayHost,
		externalStyleSheet,
	}: RichTextEditorUIConstructorParams) {
		super();

		if (import.meta.hot) {
			import.meta.hot.accept("../global.css?inline", (module) => {
				if (!module) {
					throw new Error("Module can't be undefined.");
				}

				tailwindStyleSheet.replaceSync(module.default);
			});
		}

		this.#shadowRoot = this.attachShadow({ mode: "open" });

		this.#shadowRoot.adoptedStyleSheets.push(tailwindStyleSheet);
		if (externalStyleSheet) {
			this.#shadowRoot.adoptedStyleSheets.push(externalStyleSheet);
		}

		this.#toolbarButtons = toolbarButtons;
		this.#richTextArea = richTextArea;
		this.#extensions = extensions;
		this.#uiPorts = uiPorts;

		this.#dialogOpenCleanup = createDialogOpenObserver(this.#shadowRoot);

		this.#dispose = render(
			() => (
				<App
					toolbarButtons={this.#toolbarButtons}
					richTextArea={this.#richTextArea}
					extensions={this.#extensions}
					uiPorts={this.#uiPorts}
					menuBarActionManager={this.#menuBarActionManager}
					menuBarButtonsStateManager={this.#menuBarButtonsStateManager}
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

	dispose() {
		this.#dialogOpenCleanup();
		this.#dispose();
	}
}

customElements.define("rich-text-editor-ui", RichTextEditorUI);
