/*
 * How large a table can grow: the editor doesn't create, or grow a table into, one larger than these
 */
export interface TableLimits {
	maxRows: number;
	maxCols: number;
}

export interface TableLimitsParams {
	maxRows?: number;
	maxCols?: number;
}

export type ResolveTableLimitsResult = TableLimits;
