import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { EditorAPI } from "rich-text-area";
import type { BlockResizeInternals } from "../BlockResize-types";

export interface HandleBlockResizeAppearanceParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	internals: BlockResizeInternals;
}
