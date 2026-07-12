import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { EditorAPI } from "rich-text-area";
import type { BlockPopoverAppearanceHandler } from "../../../BlockPopoverAppearanceHandler";

export interface HandleVideoSwapParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	blockPopoverAppearanceHandler: BlockPopoverAppearanceHandler;
}
