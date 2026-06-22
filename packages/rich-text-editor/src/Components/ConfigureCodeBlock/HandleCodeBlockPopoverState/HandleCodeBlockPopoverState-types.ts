import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { EditorAPI } from "rich-text-area";
import type { CodeHighlighter } from "../CodeHighlighter";
import type { CodeBlockInternals } from "../ConfigureCodeBlock-types";

export interface HandleCodeBlockPopoverStateParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	codeHighlighter: CodeHighlighter;
	internals: CodeBlockInternals;
}
