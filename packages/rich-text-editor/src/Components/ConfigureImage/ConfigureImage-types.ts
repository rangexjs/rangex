import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { EditorAPI } from "rich-text-area";
import type { BlockComponentPlacement } from "../../BlockComponentPlacement";
import type { BlockPopoverAppearanceHandler } from "../../BlockPopoverAppearanceHandler";
import type { BlockResize } from "../../BlockResize";

export interface ConfigureImageParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
	blockResize: BlockResize;
	blockPopoverAppearanceHandler: BlockPopoverAppearanceHandler;
}
