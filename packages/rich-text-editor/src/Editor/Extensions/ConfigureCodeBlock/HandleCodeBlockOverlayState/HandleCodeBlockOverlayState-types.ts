import type { BlockComponent, EditorAPI } from "rich-text-area";
import type { CodeBlockEditorPort } from "#adapters";
import type { CodeHighlighter } from "../CodeHighlighter";

export interface HandleCodeBlockOverlayStateParams {
	editorPort: CodeBlockEditorPort;
	editorAPI: EditorAPI;
	getCurrentBlock: () => BlockComponent | null;
	codeHighlighter: CodeHighlighter;
}
