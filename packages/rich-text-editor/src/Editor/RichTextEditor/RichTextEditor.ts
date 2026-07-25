import { AdapterBus, OverlayHost, type UIExtension } from "#ports";
import { RichTextEditorUI } from "#ui";
import {
	customComponentNames,
	toolbarButtons as defaultToolbarButtons,
} from "../_Utilities";
import {
	configureCustomStyles,
	configureFindReplace,
	configureHistoryNavigation,
	configureNonCategorized,
	configureSymbolInsertion,
} from "../Configs";
import {
	configurePreview,
	configureSettings,
	configureTemplate,
	configureView,
} from "../MenuBar";
import { createRangeX } from "./CreateRangeX";
import type {
	ErasedConfigureExtensionFn,
	RichTextEditorParams,
} from "./RichTextEditor-types";

export class RichTextEditor extends HTMLElement {
	#richTextEditorUI: RichTextEditorUI;
	#cleanups: Set<() => void> = new Set();

	constructor({
		storedSnapshot,
		toolbarButtons = defaultToolbarButtons,
		extensions = [],
	}: RichTextEditorParams) {
		super();

		const shadowRoot = this.attachShadow({ mode: "open" });
		const rangeX = createRangeX({ storedSnapshot });
		const { editorAPI } = rangeX;

		const adapterBus = new AdapterBus();
		const overlayHost = new OverlayHost();

		const extensionAdapters = extensions.map((extension) => ({
			extension,
			adapter: extension.createAdapter({ adapterBus, overlayHost }),
		}));

		const uiExtensions: UIExtension[] = extensionAdapters.map(
			({ extension, adapter }) => ({
				name: extension.name,
				uiPort: adapter.uiPort,
				components: extension.components,
			}),
		);

		this.#richTextEditorUI = new RichTextEditorUI({
			richTextArea: rangeX,
			toolbarButtons,
			extensions: uiExtensions,
			overlayHost,
			options: {
				customComponentNames,
			},
		});

		shadowRoot.append(this.#richTextEditorUI);

		// configure must run after the mount above — e.g. LinkEditorPort.popover throws until its element exists.
		for (const { extension, adapter } of extensionAdapters) {
			const configure = extension.configure as ErasedConfigureExtensionFn;
			const cleanup = configure({ adapter, editorAPI });

			this.#cleanups.add(cleanup);
		}

		configureCustomStyles({ editorAPI });

		const nonCategorizedCleanup = configureNonCategorized({
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
		});
		const historyNavigationCleanup = configureHistoryNavigation({
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
		});

		this.#cleanups.add(nonCategorizedCleanup);
		this.#cleanups.add(historyNavigationCleanup);

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

		const findReplaceCleanup = configureFindReplace({
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
		});
		const symbolInsertionCleanup = configureSymbolInsertion({
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
		});

		this.#cleanups.add(findReplaceCleanup);
		this.#cleanups.add(symbolInsertionCleanup);

		// ---------- CODE BELOW IS TEMPORARY ----------

		// window.snapshot = () => {
		// 	const storedSnapshot = editorAPI.createStoredSnapshot();
		// 	// console.log(storedSnapshot);

		// 	const res = createSnapshotView({ storedSnapshot });

		// 	console.log(res);
		// };
	}

	destroy() {
		for (const cleanup of this.#cleanups) {
			cleanup();
		}

		this.#richTextEditorUI.dispose();
	}
}

customElements.define("rich-text-editor", RichTextEditor);
