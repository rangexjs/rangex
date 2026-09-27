import type { EditorAPI } from "rich-text-area";
import type { CodeBlockConfigPort } from "#adapters/CodeBlock";
import type { CodeHighlighter } from "../CodeHighlighter";

export interface HandleCodeBlockStateParams {
	configPort: CodeBlockConfigPort;
	editorAPI: EditorAPI;
	codeHighlighter: CodeHighlighter;
}
