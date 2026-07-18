import type { BlockNestedContext, EditorAPI } from "rich-text-area";
import type { CodeBlockPort } from "#ports";
import type { CodeHighlighter } from "../CodeHighlighter";

export interface HandleCodeBlockPopoverStateParams {
	codeBlockPort: CodeBlockPort;
	editorAPI: EditorAPI;
	getCurrentBlock: () => BlockNestedContext | null;
	codeHighlighter: CodeHighlighter;
}
