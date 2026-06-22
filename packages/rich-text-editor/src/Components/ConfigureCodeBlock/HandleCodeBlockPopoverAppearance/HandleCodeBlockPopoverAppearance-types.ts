import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { EditorAPI } from "rich-text-area";
import type { CodeBlockInternals } from "../ConfigureCodeBlock-types";

export interface HandleCodeBlockPopoverAppearanceParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	internals: CodeBlockInternals;
}
