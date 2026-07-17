import type { EditorAPI } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";
import type { BlockResizeInternals } from "../BlockResize-types";

export interface HandleBlockResizeAppearanceParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	internals: BlockResizeInternals;
}
