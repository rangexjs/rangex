import type { BlockComponentLine, ContentLine, Line } from "@rangex/core";
import type { LineHandlerConfigPort } from "#adapters/LineHandler";
import type { BlockComponentName } from "#constants";
import type { BlockComponentPlacement } from "#engine-links";
import type { OnLineChangeFn } from "../HandleLineHover";

export interface IsAllowedAtLineParams {
	blockComponentPlacement: BlockComponentPlacement;
	line: Line;
	name: BlockComponentName;
}

export type IsAllowedAtLineResult = boolean;

export interface HandleContentLineParams {
	configPort: LineHandlerConfigPort;
	blockComponentPlacement: BlockComponentPlacement;
	contentLine: ContentLine;
}

export interface HandleBlockComponentLineParams {
	configPort: LineHandlerConfigPort;
	blockComponentPlacement: BlockComponentPlacement;
	blockComponentLine: BlockComponentLine;
}

export interface HandleDragMenuStateParams {
	configPort: LineHandlerConfigPort;
	blockComponentPlacement: BlockComponentPlacement;
}

export type HandleDragMenuStateResult = OnLineChangeFn;
