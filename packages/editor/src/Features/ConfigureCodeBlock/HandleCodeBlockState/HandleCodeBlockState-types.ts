import type { EditorAPI } from "rich-text-area";
import type { CodeBlockConfigPort, CodeBlockTheme } from "#adapters/CodeBlock";
import type { CodeHighlighter } from "../CodeHighlighter";

export interface HandleCodeBlockStateParams {
	configPort: CodeBlockConfigPort;
	editorAPI: EditorAPI;
	codeHighlighter: CodeHighlighter;
}

export interface IsHighlightedParams {
	language: string | null;
	theme: CodeBlockTheme | null;
}
