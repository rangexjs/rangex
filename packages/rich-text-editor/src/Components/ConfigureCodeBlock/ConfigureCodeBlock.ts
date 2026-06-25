import { CodeHighlighter } from "./CodeHighlighter";
import type {
	CodeBlockInternals,
	ConfigureCodeBlockParams,
} from "./ConfigureCodeBlock-types";
import { handleCodeBlockInsertion } from "./HandleCodeBlockInsertion";
import { handleCodeBlockPopoverAppearance } from "./HandleCodeBlockPopoverAppearance";
import { handleCodeBlockPopoverState } from "./HandleCodeBlockPopoverState";
import { handleCodeBlockToolbarButtonState } from "./HandleCodeBlockToolbarButtonState";
import { handleLineNumbers } from "./HandleLineNumbers";

export const configureCodeBlock = ({
	richTextEditorUI,
	editorAPI,
	blockComponentPlacement,
}: ConfigureCodeBlockParams) => {
	const internals: CodeBlockInternals = { currentCodeBlock: null };

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

	const popoverStateCleanup = handleCodeBlockPopoverState({
		richTextEditorUI,
		editorAPI,
		codeHighlighter,
		internals,
	});

	const popoverAppearanceCleanup = handleCodeBlockPopoverAppearance({
		richTextEditorUI,
		editorAPI,
		internals,
	});

	return () => {
		toolbarButtonStateCleanup();
		insertionCleanup();
		lineNumbersCleanup();
		popoverStateCleanup();
		popoverAppearanceCleanup();
	};
};
