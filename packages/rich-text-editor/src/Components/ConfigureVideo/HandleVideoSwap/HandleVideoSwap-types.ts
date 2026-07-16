import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { EditorAPI } from "rich-text-area";
import type { VideoInternals } from "../ConfigureVideo-types";

export interface HandleVideoSwapParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	internals: VideoInternals;
}
