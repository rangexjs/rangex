import { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import {
	// createSnapshotView,
	selectionStylesChangeEventType,
	snapshotIndexChangeEventType,
} from "rich-text-area";
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
	configureLink,
	configureList,
	configureMention,
	configureTable,
	configureTemplateVariable,
} from "../Components";
import { configureFindReplace, configureSymbolInsertion } from "../Configs";
import {
	configurePreview,
	configureSettings,
	configureTemplate,
	configureView,
} from "../MenuBar";
import {
	getFormatStylesButtonState,
	getSelectionStylesData,
} from "../SelectionStyle";
import { getStyleSheetTexts } from "../Styles";
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

	const { contentStyleSheetText, interactiveStyleSheetText } =
		getStyleSheetTexts();

	editorAPI.replaceCustomStyles(
		contentStyleSheetText + interactiveStyleSheetText,
	);

	editorAPI.subscribeEditorEvent({
		type: selectionStylesChangeEventType,
		callback: ({ selectionFormatStyles }) => {
			const formatStylesButtonState = getFormatStylesButtonState({
				selectionFormatStyles,
			});

			richTextEditorUI.updateFormatStylesButtonState(formatStylesButtonState);
		},
	});

	richTextEditorUI.onFormatStyles((formatStylesActionState) => {
		const selectionStylesData = getSelectionStylesData({
			formatStylesActionState,
			whenMixed: "apply",
		});

		editorAPI.updateSelectionStyles(selectionStylesData);

		editorAPI.focus();
	});

	richTextEditorUI.onNonCategorizedOperation((props) => {
		const { type } = props;

		if (type === "text-area-readability") {
			const { newState } = props;

			editorAPI.setIsTextAreaEditable(!newState);

			const checked = !editorAPI.getIsTextAreaEditable();

			richTextEditorUI.updateNonCategorizedButtonState({
				textAreaReadability: { checked },
			});
		}
	});

	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	richTextEditorUI.onHistoryNavigation(({ type }) => {
		if (type === "history-back") {
			snapshotTimeline.stepBack();
		}

		if (type === "history-forward") {
			snapshotTimeline.stepForward();
		}

		editorAPI.focus();
	});

	editorAPI.subscribeEditorEvent({
		type: snapshotIndexChangeEventType,
		callback: () => {
			richTextEditorUI.updateHistoryNavigationButtonState({
				historyBack: { disabled: !snapshotTimeline.canStepBack },
				historyForward: { disabled: !snapshotTimeline.canStepForward },
			});
		},
	});

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
