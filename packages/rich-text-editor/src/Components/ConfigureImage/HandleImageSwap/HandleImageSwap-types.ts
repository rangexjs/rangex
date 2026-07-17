import type {
	ImageEmitSwapParams,
	ImagePopover,
	RichTextEditorUI,
} from "@rangex/rich-text-editor-ui";
import type { EditorAPI } from "rich-text-area";
import type { ImageInternals } from "../ConfigureImage-types";

export interface HandleImageSwapParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	internals: ImageInternals;
}

export interface ResolveSwapSrcParams {
	emitSwapParams: ImageEmitSwapParams;
	imagePopover: ImagePopover;
	isStillCurrent: () => boolean;
}

export type ResolveSwapSrcResult = string | null;
