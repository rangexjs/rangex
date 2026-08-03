import type { BlockComponentLine } from "rich-text-area";
import type { LineHandlerEditorPort } from "#adapters";
import type { OnLineChangeFn } from "../HandleLineHover";

export interface HandleContentLineParams {
	editorPort: LineHandlerEditorPort;
}

export interface HandleBlockComponentLineParams {
	editorPort: LineHandlerEditorPort;
	blockComponentLine: BlockComponentLine;
}

export interface HandleDragMenuStateParams {
	editorPort: LineHandlerEditorPort;
}

export type HandleDragMenuStateResult = OnLineChangeFn;
