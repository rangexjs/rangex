import { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
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
	configureBlockQuote,
	configureCodeBlock,
	configureEmoji,
	configureImage,
	configureLink,
	configureList,
	configureMention,
	configureTable,
	configureTemplateVariable,
	configureTodoList,
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
			editorAPI,
			richTextEditorUI: this.#richTextEditorUI,
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
		const imageCleanup = configureImage({
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
			blockComponentPlacement,
			blockResize,
			blockPopoverAppearanceHandler,
		});

		this.#cleanups.add(blockQuoteCleanup);
		this.#cleanups.add(codeBlockCleanup);
		this.#cleanups.add(listCleanup);
		this.#cleanups.add(todoListCleanup);
		this.#cleanups.add(tableCleanup);
		this.#cleanups.add(imageCleanup);

		const linkCleanup = configureLink({
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
		});
		const emojiCleanup = configureEmoji({
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
		});
		const mentionCleanup = configureMention({
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
		});
		const templateVariableCleanup = configureTemplateVariable({
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
