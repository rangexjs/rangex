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

	handleCodeBlockToolbarButtonState({
		richTextEditorUI,
		editorAPI,
		blockComponentPlacement,
	});

	handleCodeBlockInsertion({
		richTextEditorUI,
		editorAPI,
		blockComponentPlacement,
	});

	handleLineNumbers({ editorAPI });

	handleCodeBlockPopoverState({
		richTextEditorUI,
		editorAPI,
		codeHighlighter,
		internals,
	});

	handleCodeBlockPopoverAppearance({
		richTextEditorUI,
		editorAPI,
		internals,
	});
};
