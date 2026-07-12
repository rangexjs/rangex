import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { EditorAPI } from "rich-text-area";
import type { ImageInternals } from "../ConfigureImage-types";

export interface HandleImageSwapParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	internals: ImageInternals;
}
