import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { EditorAPI } from "rich-text-area";
import type { BlockComponentPlacement } from "../../BlockComponentPlacement";
import type { OnMediaResolveFn } from "./WatchEmptyMedia";

export interface ConfigureEmptyMediaParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}

export interface ConfigureEmptyMediaResult {
	cleanup: () => void;
	onMediaResolve: OnMediaResolveFn;
}
