import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { BlockNestedContext, EditorAPI } from "rich-text-area";
import type { BlockResizeInternals } from "../BlockResize-types";

export interface CalcFlexBasisParams {
	blockNestedContext: BlockNestedContext;
	deltaPx: number;
	handleSide: "left" | "right";
	dragStartWidth: number;
}

export type CalcFlexBasisResult = string;

export interface HandleBlockResizeInteractionParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	internals: BlockResizeInternals;
}
