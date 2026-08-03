import type { BlockComponent, EditorAPI } from "rich-text-area";
import type { CodeBlockEditorPort } from "#adapters";
import type { CodeHighlighter } from "../CodeHighlighter";

export interface HandleCodeBlockPopoverStateParams {
	editorPort: CodeBlockEditorPort;
	editorAPI: EditorAPI;
	getCurrentBlock: () => BlockComponent | null;
	codeHighlighter: CodeHighlighter;
}
