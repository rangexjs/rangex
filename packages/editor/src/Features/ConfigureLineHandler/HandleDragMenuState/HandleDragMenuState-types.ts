import type { BlockComponentLine } from "rich-text-area";
import type { LineHandlerConfigPort } from "#adapters/LineHandler";
import type { OnLineChangeFn } from "../HandleLineHover";

export interface HandleContentLineParams {
	configPort: LineHandlerConfigPort;
}

export interface HandleBlockComponentLineParams {
	configPort: LineHandlerConfigPort;
	blockComponentLine: BlockComponentLine;
}

export interface HandleDragMenuStateParams {
	configPort: LineHandlerConfigPort;
}

export type HandleDragMenuStateResult = OnLineChangeFn;
