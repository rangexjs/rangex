import type { BlockNestedContextLine } from "rich-text-area";

export interface CreateTableParams {
	rows: number;
	cols: number;
}

export type CreateTableResult = BlockNestedContextLine;
