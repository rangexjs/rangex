import type {
	MediaResolveType,
	RichTextEditorUI,
} from "@rangex/rich-text-editor-ui";
import type { BlockNestedContext, EditorAPI } from "rich-text-area";

export interface WatchEmptyMediaParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}

export interface OnMediaResolveCallbackParams {
	blockNestedContext: BlockNestedContext;
	type: MediaResolveType;
	src: string;
}

export type OnMediaResolveCallbackFn = (
	params: OnMediaResolveCallbackParams,
) => void;

type OnMediaResolveParams = OnMediaResolveCallbackFn;

type OnMediaResolveResult = () => void;

export type OnMediaResolveFn = (
	callback: OnMediaResolveParams,
) => OnMediaResolveResult;

export interface WatchEmptyMediaResult {
	cleanup: () => void;
	onMediaResolve: OnMediaResolveFn;
}
