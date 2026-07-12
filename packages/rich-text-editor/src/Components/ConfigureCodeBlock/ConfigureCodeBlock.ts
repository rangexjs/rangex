import { CodeHighlighter } from "./CodeHighlighter";
import type { ConfigureCodeBlockParams } from "./ConfigureCodeBlock-types";
import { handleCodeBlockInsertion } from "./HandleCodeBlockInsertion";
import { handleCodeBlockPopoverAppearance } from "./HandleCodeBlockPopoverAppearance";
import { handleCodeBlockPopoverState } from "./HandleCodeBlockPopoverState";
import { handleCodeBlockToolbarButtonState } from "./HandleCodeBlockToolbarButtonState";
import { handleLineNumbers } from "./HandleLineNumbers";

export const configureCodeBlock = ({
	richTextEditorUI,
	editorAPI,
	blockComponentPlacement,
	blockPopoverAppearanceHandler,
}: ConfigureCodeBlockParams) => {
	const codeHighlighter = new CodeHighlighter({ editorAPI });

	const toolbarButtonStateCleanup = handleCodeBlockToolbarButtonState({
		richTextEditorUI,
		editorAPI,
		blockComponentPlacement,
	});

	const insertionCleanup = handleCodeBlockInsertion({
		richTextEditorUI,
		editorAPI,
		blockComponentPlacement,
	});

	const lineNumbersCleanup = handleLineNumbers({ editorAPI });

	const { getCurrentBlock, cleanup: popoverAppearanceCleanup } =
		handleCodeBlockPopoverAppearance({
			richTextEditorUI,
			blockPopoverAppearanceHandler,
		});

	const popoverStateCleanup = handleCodeBlockPopoverState({
		richTextEditorUI,
		editorAPI,
		codeHighlighter,
		getCurrentBlock,
	});

	return () => {
		toolbarButtonStateCleanup();
		insertionCleanup();
		lineNumbersCleanup();
		popoverStateCleanup();
		popoverAppearanceCleanup();
	};
};
