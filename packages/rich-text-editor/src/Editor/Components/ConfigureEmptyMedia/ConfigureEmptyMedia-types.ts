import type { EditorAPI } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";
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
