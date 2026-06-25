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
import type { CreateRichTextEditorParams } from "./CreateRichTextEditor-types";

export const createRichTextEditor = ({
	rangeX,
}: CreateRichTextEditorParams) => {
	const richTextEditorUI = new RichTextEditorUI({
		richTextArea: rangeX,
		toolbarButtons,
		options: {
			codeBlockLanguages,
			codeBlockThemes,
			customComponentNames,
			fontFamilyOptions,
		},
	});

	const { editorAPI } = rangeX;

	configureCustomStyles({ editorAPI });

	configureFormatStyles({ richTextEditorUI, editorAPI });
	configureNonCategorized({ richTextEditorUI, editorAPI });
	configureHistoryNavigation({ richTextEditorUI, editorAPI });

	configureView({ richTextEditorUI, editorAPI });
	configureTemplate({ richTextEditorUI, editorAPI });
	configureSettings({ richTextEditorUI, editorAPI });
	configurePreview({ richTextEditorUI, editorAPI });

	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });

	configureBlockQuote({ richTextEditorUI, editorAPI, blockComponentPlacement });
	configureCodeBlock({ richTextEditorUI, editorAPI, blockComponentPlacement });
	configureList({ richTextEditorUI, editorAPI, blockComponentPlacement });
	configureTable({ richTextEditorUI, editorAPI, blockComponentPlacement });

	configureLink({ richTextEditorUI, editorAPI });
	configureEmoji({ richTextEditorUI, editorAPI });
	configureMention({ richTextEditorUI, editorAPI });
	configureTemplateVariable({ richTextEditorUI, editorAPI });

	configureFindReplace({ richTextEditorUI, editorAPI });
	configureSymbolInsertion({ richTextEditorUI, editorAPI });

	// ---------- CODE BELOW IS TEMPORARY ----------

	// window.snapshot = () => {
	// 	const storedSnapshot = editorAPI.createStoredSnapshot();
	// 	// console.log(storedSnapshot);

	// 	const res = createSnapshotView({ storedSnapshot });

	// 	console.log(res);
	// };

	richTextEditorUI.updateNodeInsertionButtonState({
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

	// editorAPI.registerDOMEvent({
	// 	when: ({ element }) => {
	// 		if (element.editorRole !== nestedEditableName) {
	// 			return false;
	// 		}

	// 		const { parentElement } = element;

	// 		return parentElement.editorRole === summaryBuilderName;
	// 	},
	// 	eventListener: {
	// 		type: "click",
	// 		listener: (e) => {
	// 			e.preventDefault();
	// 		},
	// 	},
	// });

	// // biome-ignore lint/correctness/noUnusedVariables: here as an example
	// const unregister = editorAPI.registerDOMEvent({
	// 	when: ({ element }) => {
	// 		return (
	// 			element.editorRole === inlineNestedContextName &&
	// 			element.componentName === componentsName.link
	// 		);
	// 	},
	// 	eventListener: {
	// 		type: "click",
	// 		listener: () => {
	// 			const { isPopoverOpen } = linkManager;

	// 			if (isPopoverOpen) {
	// 				return;
	// 			}

	// 			linkManager.openAnchorOverlay();
	// 		},
	// 	},
	// });

	return richTextEditorUI;
};
