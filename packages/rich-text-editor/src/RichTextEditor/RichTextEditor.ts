import { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import {
	codeBlockLanguages,
	codeBlockThemes,
	customComponentNames,
	fontFamilyOptions,
	toolbarButtons,
} from "../_Utilities";
import { createBlockComponentPlacement } from "../BlockComponentPlacement";
import {
	configureBlockQuote,
	configureCodeBlock,
	configureEmoji,
	configureLink,
	configureList,
	configureMention,
	configureTable,
	configureTemplateVariable,
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

		configureView({ richTextEditorUI: this.#richTextEditorUI, editorAPI });
		configureTemplate({ richTextEditorUI: this.#richTextEditorUI, editorAPI });
		configureSettings({ richTextEditorUI: this.#richTextEditorUI, editorAPI });
		configurePreview({ richTextEditorUI: this.#richTextEditorUI, editorAPI });

		configureBlockQuote({
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
			blockComponentPlacement,
		});
		configureCodeBlock({
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
			blockComponentPlacement,
		});
		configureList({
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
			blockComponentPlacement,
		});
		configureTable({
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
			blockComponentPlacement,
		});

		configureLink({ richTextEditorUI: this.#richTextEditorUI, editorAPI });
		configureEmoji({ richTextEditorUI: this.#richTextEditorUI, editorAPI });
		configureMention({ richTextEditorUI: this.#richTextEditorUI, editorAPI });
		configureTemplateVariable({
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
		});

		configureFindReplace({
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
		});
		configureSymbolInsertion({
			richTextEditorUI: this.#richTextEditorUI,
			editorAPI,
		});

		// ---------- CODE BELOW IS TEMPORARY ----------

		// window.snapshot = () => {
		// 	const storedSnapshot = editorAPI.createStoredSnapshot();
		// 	// console.log(storedSnapshot);

		// 	const res = createSnapshotView({ storedSnapshot });

		// 	console.log(res);
		// };

		this.#richTextEditorUI.updateNodeInsertionButtonState({
			table: { disabled: false },
			orderedList: { disabled: false },
			checkboxList: { disabled: false },
			unorderedList: { disabled: false },
			codeBlock: { disabled: false },
			blockQuote: { disabled: false },
			image: { disabled: false },
			customComponent: { disabled: false },
			symbols: { disabled: false },
			anchor: { checked: false, disabled: false },
			templateVariable: {
				disabled: false,
				options: {
					name: { firstName: "John", lastName: "Doe" },
					email: null,
					date: "2024-02-10",
				},
			},
		});
	}

	destroy() {
		for (const cleanup of this.#cleanups) {
			cleanup();
		}

		this.#richTextEditorUI.dispose();
	}
}

customElements.define("rich-text-editor", RichTextEditor);
