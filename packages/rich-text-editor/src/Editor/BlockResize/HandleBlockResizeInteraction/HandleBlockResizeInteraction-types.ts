import type { BlockNestedContext, EditorAPI } from "rich-text-area";
import type { BlockResizePort } from "#ports";
import type { BlockResizeInternals } from "../BlockResize-types";

export interface CalcFlexBasisParams {
	blockNestedContext: BlockNestedContext;
	deltaPx: number;
	handleSide: "left" | "right";
	dragStartWidth: number;
}

export type CalcFlexBasisResult = string;

export interface HandleBlockResizeInteractionParams {
	blockResizePort: BlockResizePort;
	editorAPI: EditorAPI;
	internals: BlockResizeInternals;
}
