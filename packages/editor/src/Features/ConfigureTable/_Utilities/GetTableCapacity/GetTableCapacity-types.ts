import type { Table, TableCell } from "@rangex/core";
import type { TableLimits } from "#constants";

export interface GetTableCapacityParams {
	table: Table;
	tableCell: TableCell | null;
	limits: TableLimits;
}

export interface TableCapacity {
	canAddRow: boolean;
	canAddCol: boolean;
	canSplitHorizontally: boolean;
	canSplitVertically: boolean;
}

export type GetTableCapacityResult = TableCapacity;
