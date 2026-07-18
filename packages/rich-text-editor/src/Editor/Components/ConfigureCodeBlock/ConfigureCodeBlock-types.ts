import type { EditorAPI } from "rich-text-area";
import type { CodeBlockPort } from "#ports";
import type { RichTextEditorUI } from "#ui";
import type { BlockComponentPlacement } from "../../BlockComponentPlacement";
import type { BlockPopoverAppearanceHandler } from "../../BlockPopoverAppearanceHandler";

export interface ConfigureCodeBlockParams {
	codeBlockPort: CodeBlockPort;
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
	blockPopoverAppearanceHandler: BlockPopoverAppearanceHandler;
}
