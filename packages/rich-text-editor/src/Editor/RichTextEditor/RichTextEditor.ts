import { RichTextEditorUI } from "#ui";
import {
	codeBlockLanguages,
	codeBlockThemes,
	customComponentNames,
	fontFamilyOptions,
	toolbarButtons,
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
	configureLink,
	configureList,
	configureMention,
	configureTable,
	configureTemplateVariable,
	configureTodoList,
	configureVideo,
} from "../Components";
import {
	configureCustomStyles,
	configureFindReplace,
	configureFormatStyles,
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
import type { RichTextEditorParams } from "./RichTextEditor-types";

export class RichTextEditor extends HTMLElement {
	#richTextEditorUI: RichTextEditorUI;
	#cleanups: Set<() => void> = new Set();

	constructor({ rangeX }: RichTextEditorParams) {
		super();

		const shadowRoot = this.attachShadow({ mode: "open" });

		this.#richTextEditorUI = new RichTextEditorUI({
			richTextArea: rangeX,
			toolbarButtons,
			options: {
				codeBlockLanguages,
				codeBlockThemes,
				customComponentNames,
				fontFamilyOptions,
			},
		});

		shadowRoot.append(this.#richTextEditorUI);

		const { editorAPI } = rangeX;

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

		const formatStylesCleanup = configureFormatStyles({
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
		});
		const nonCategorizedCleanup = configureNonCategorized({
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
		});
		const historyNavigationCleanup = configureHistoryNavigation({
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
		});

		this.#cleanups.add(formatStylesCleanup);
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

		const linkCleanup = configureLink({
			richTextEditorUI: this.#richTextEditorUI,
			linkPort: this.#richTextEditorUI.linkPort,
			editorAPI,
		});
		const emojiCleanup = configureEmoji({
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
		});
		const mentionCleanup = configureMention({
			mentionPort: this.#richTextEditorUI.mentionPort,
			editorAPI,
		});
		const templateVariableCleanup = configureTemplateVariable({
			templateVariablePort: this.#richTextEditorUI.templateVariablePort,
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
		});

		this.#cleanups.add(linkCleanup);
		this.#cleanups.add(emojiCleanup);
		this.#cleanups.add(mentionCleanup);
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
