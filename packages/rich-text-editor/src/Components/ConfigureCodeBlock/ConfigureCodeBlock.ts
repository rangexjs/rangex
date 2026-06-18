import { CodeHighlighter } from "./CodeHighlighter";
import type { ConfigureCodeBlockParams } from "./ConfigureCodeBlock-types";
import { handleCodeBlockInsertion } from "./HandleCodeBlockInsertion";
import { handleCodeBlockPopoverAppearance } from "./HandleCodeBlockPopoverAppearance";
import { handleCodeBlockToolbarButtonState } from "./HandleCodeBlockToolbarButtonState";
import { handleLineNumbers } from "./HandleLineNumbers";

export const configureCodeBlock = ({
	richTextEditorUI,
	editorAPI,
	blockComponentPlacement,
}: ConfigureCodeBlockParams) => {
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

	handleCodeBlockPopoverAppearance({ richTextEditorUI, editorAPI });

	// biome-ignore lint/correctness/noUnusedVariables: UI will be implemented later
	const codeHighlighter = new CodeHighlighter({ editorAPI });
};
