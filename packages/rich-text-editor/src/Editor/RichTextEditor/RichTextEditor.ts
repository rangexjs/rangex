import { OverlayHost, type UIExtension } from "#ports";
import { RichTextEditorUI } from "#ui";
import {
	codeBlockLanguages,
	codeBlockThemes,
	customComponentNames,
	toolbarButtons as defaultToolbarButtons,
	fontFamilyOptions,
} from "../_Utilities";
import { createBlockComponentPlacement } from "../BlockComponentPlacement";
import { createBlockPopoverAppearanceHandler } from "../BlockPopoverAppearanceHandler";
import { createBlockResize } from "../BlockResize";
import {
	configureAudio,
	configureBlockQuote,
	configureCodeBlock,
	configureEmbed,
	configureEmoji,
	configureEmptyMedia,
	configureImage,
	configureList,
	configureTable,
	configureTemplateVariable,
	configureTodoList,
	configureVideo,
} from "../Components";
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

		const overlayHost = new OverlayHost();

		const extensionAdapters = extensions.map((extension) => ({
			extension,
			adapter: extension.createAdapter({ overlayHost }),
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
				codeBlockLanguages,
				codeBlockThemes,
				customComponentNames,
				fontFamilyOptions,
			},
		});

		shadowRoot.append(this.#richTextEditorUI);

		// configure must run after the mount above — e.g. LinkEditorPort.popover throws until its element exists.
		for (const { extension, adapter } of extensionAdapters) {
			const configure = extension.configure as ErasedConfigureExtensionFn;
			const cleanup = configure({ adapter, editorAPI });

			this.#cleanups.add(cleanup);
		}

		const blockComponentPlacement = createBlockComponentPlacement({
			editorAPI,
		});
		const blockResize = createBlockResize({
			blockResizePort: this.#richTextEditorUI.blockResizePopover,
			editorAPI,
		});
		const blockPopoverAppearanceHandler = createBlockPopoverAppearanceHandler({
			editorAPI,
		});

		this.#cleanups.add(blockResize.cleanup);
		this.#cleanups.add(blockPopoverAppearanceHandler.cleanup);

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

		const blockQuoteCleanup = configureBlockQuote({
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
			blockComponentPlacement,
		});
		const codeBlockCleanup = configureCodeBlock({
			codeBlockPort: this.#richTextEditorUI.codeBlockPopover,
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
			blockComponentPlacement,
			blockPopoverAppearanceHandler,
		});
		const listCleanup = configureList({
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
			blockComponentPlacement,
		});
		const todoListCleanup = configureTodoList({
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
			blockComponentPlacement,
		});
		const tableCleanup = configureTable({
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
			blockComponentPlacement,
		});
		const { cleanup: emptyMediaCleanup, onMediaResolve } = configureEmptyMedia({
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
			blockComponentPlacement,
		});

		const imageCleanup = configureImage({
			imagePort: this.#richTextEditorUI.imagePort,
			editorAPI,
			blockResize,
			blockPopoverAppearanceHandler,
			onMediaResolve,
		});
		const videoCleanup = configureVideo({
			videoPort: this.#richTextEditorUI.videoPort,
			editorAPI,
			blockResize,
			blockPopoverAppearanceHandler,
			onMediaResolve,
		});
		const audioCleanup = configureAudio({
			audioPort: this.#richTextEditorUI.audioPort,
			editorAPI,
			blockResize,
			blockPopoverAppearanceHandler,
			onMediaResolve,
		});
		const embedCleanup = configureEmbed({
			embedPort: this.#richTextEditorUI.embedPort,
			editorAPI,
			blockResize,
			blockPopoverAppearanceHandler,
			onMediaResolve,
		});

		this.#cleanups.add(blockQuoteCleanup);
		this.#cleanups.add(codeBlockCleanup);
		this.#cleanups.add(listCleanup);
		this.#cleanups.add(todoListCleanup);
		this.#cleanups.add(tableCleanup);
		this.#cleanups.add(emptyMediaCleanup);
		this.#cleanups.add(imageCleanup);
		this.#cleanups.add(videoCleanup);
		this.#cleanups.add(audioCleanup);
		this.#cleanups.add(embedCleanup);

		const emojiCleanup = configureEmoji({
			emojiPort: this.#richTextEditorUI.emojiPopover,
			editorAPI,
		});
		const templateVariableCleanup = configureTemplateVariable({
			templateVariablePort: this.#richTextEditorUI.templateVariablePort,
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
		});

		this.#cleanups.add(emojiCleanup);
		this.#cleanups.add(templateVariableCleanup);

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
