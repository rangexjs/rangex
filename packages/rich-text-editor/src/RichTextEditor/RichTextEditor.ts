import type { EditorAPI } from "rich-text-area";
import {
	anchorPositioningStyleSheet,
	configureCustomStyles,
	configurePreview,
	configureSettings,
	configureTemplate,
	configureView,
} from "#editor";
import { AdapterBus, OverlayHost, type UIExtension } from "#ports";
import { RichTextEditorUI } from "#ui";
import { toolbarButtons as defaultToolbarButtons } from "./_Utilities";
import { buildUIPorts } from "./BuildUIPorts";
import { createRangeX } from "./CreateRangeX";
import type {
	ErasedConfigureExtensionFn,
	RichTextEditorParams,
} from "./RichTextEditor-types";

export class RichTextEditor extends HTMLElement {
	#richTextEditorUI: RichTextEditorUI;
	#editorAPI: EditorAPI;
	#cleanups: Set<() => void> = new Set();

	constructor({
		storedSnapshot,
		toolbarButtons = defaultToolbarButtons,
		extensions = [],
	}: RichTextEditorParams) {
		super();

		const shadowRoot = this.attachShadow({ mode: "open" });
		const { editorAPI } = createRangeX({ storedSnapshot });
		this.#editorAPI = editorAPI;

		const adapterBus = new AdapterBus();
		const overlayHost = new OverlayHost();

		const extensionAdapters = extensions.map((extension) => ({
			extension,
			adapter: extension.createAdapter({ adapterBus, overlayHost }),
		}));

		const uiExtensions: UIExtension[] = extensionAdapters.map(
			({ extension }) => ({
				components: extension.components,
			}),
		);

		const uiPorts = buildUIPorts({
			adapters: extensionAdapters.map(({ adapter }) => adapter),
		});

		this.#richTextEditorUI = new RichTextEditorUI({
			richTextArea: editorAPI.host,
			toolbarButtons,
			extensions: uiExtensions,
			uiPorts,
			overlayHost,
			externalStyleSheet: anchorPositioningStyleSheet,
		});

		shadowRoot.append(this.#richTextEditorUI);

		// configure must run after the mount above — e.g. LinkEditorPort.anchoredOverlay throws until its element exists.
		for (const { extension, adapter } of extensionAdapters) {
			const configure = extension.configure as ErasedConfigureExtensionFn;
			const cleanup = configure({ adapter, editorAPI });

			this.#cleanups.add(cleanup);
		}

		configureCustomStyles({ editorAPI });

		const viewCleanup = configureView({
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
		});
		const previewCleanup = configurePreview({
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
		});

		this.#cleanups.add(viewCleanup);
		this.#cleanups.add(previewCleanup);

		configureTemplate({ richTextEditorUI: this.#richTextEditorUI, editorAPI });
		configureSettings({ richTextEditorUI: this.#richTextEditorUI, editorAPI });
	}

	destroy() {
		for (const cleanup of this.#cleanups) {
			cleanup();
		}

		this.#richTextEditorUI.dispose();
		this.#editorAPI.destroy();
	}
}

customElements.define("rich-text-editor", RichTextEditor);
