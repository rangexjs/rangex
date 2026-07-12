import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { EditorAPI } from "rich-text-area";
import type { BlockPopoverAppearanceHandler } from "../../../BlockPopoverAppearanceHandler";

export interface HandleVideoTitleStateParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	blockPopoverAppearanceHandler: BlockPopoverAppearanceHandler;
}
