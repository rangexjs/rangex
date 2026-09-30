import type { BlockComponentLine } from "@rangex/core";

export interface CreateTableParams {
	rows: number;
	cols: number;
}

export type CreateTableResult = BlockComponentLine;
