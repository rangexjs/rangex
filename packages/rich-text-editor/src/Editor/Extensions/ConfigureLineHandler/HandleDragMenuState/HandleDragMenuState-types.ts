import type { BlockNestedContextLine } from "rich-text-area";
import type { LineHandlerEditorPort } from "#adapters";
import type { OnLineChangeFn } from "../HandleLineHover";

export interface HandleContentLineParams {
	editorPort: LineHandlerEditorPort;
}

export interface HandleBlockNestedContextLineParams {
	editorPort: LineHandlerEditorPort;
	blockNestedContextLine: BlockNestedContextLine;
}

export interface HandleDragMenuStateParams {
	editorPort: LineHandlerEditorPort;
}

export type HandleDragMenuStateResult = OnLineChangeFn;
