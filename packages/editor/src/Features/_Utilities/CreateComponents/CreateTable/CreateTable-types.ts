import type { BlockComponentLine } from "rich-text-area";

export interface CreateTableParams {
	rows: number;
	cols: number;
}

export type CreateTableResult = BlockComponentLine;
