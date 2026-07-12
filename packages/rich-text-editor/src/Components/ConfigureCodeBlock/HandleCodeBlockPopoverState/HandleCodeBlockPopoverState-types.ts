import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { BlockNestedContext, EditorAPI } from "rich-text-area";
import type { CodeHighlighter } from "../CodeHighlighter";

export interface HandleCodeBlockPopoverStateParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	getCurrentBlock: () => BlockNestedContext | null;
	codeHighlighter: CodeHighlighter;
}
