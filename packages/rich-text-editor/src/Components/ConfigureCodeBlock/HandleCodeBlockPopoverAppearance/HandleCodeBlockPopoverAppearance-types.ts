import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { BlockPopoverAppearanceHandler } from "../../../BlockPopoverAppearanceHandler";

export interface HandleCodeBlockPopoverAppearanceParams {
	richTextEditorUI: RichTextEditorUI;
	blockPopoverAppearanceHandler: BlockPopoverAppearanceHandler;
}
