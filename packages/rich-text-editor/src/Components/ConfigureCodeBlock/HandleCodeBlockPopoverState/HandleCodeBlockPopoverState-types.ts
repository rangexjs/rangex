import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { EditorAPI } from "rich-text-area";
import type { BlockPopoverAppearanceHandler } from "../../../BlockPopoverAppearanceHandler";
import type { CodeHighlighter } from "../CodeHighlighter";

export interface HandleCodeBlockPopoverStateParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	blockPopoverAppearanceHandler: BlockPopoverAppearanceHandler;
	codeHighlighter: CodeHighlighter;
}
