import type { BlockComponent, EditorAPI } from "rich-text-area";
import type { CodeBlockConfigPort } from "#adapters/CodeBlock";
import type { CodeHighlighter } from "../CodeHighlighter";

export interface HandleCodeBlockOverlayStateParams {
	configPort: CodeBlockConfigPort;
	editorAPI: EditorAPI;
	getCurrentBlock: () => BlockComponent | null;
	codeHighlighter: CodeHighlighter;
}
