import type { InsertParams } from "#adapters/Table";
import type { TableLimits } from "#constants";

export interface ValidateTablePlacementParams extends InsertParams {
	limits: TableLimits;
}

export interface TablePlacementMismatch {
	field: "row" | "column";
	reason: string;
}

export type ValidateTablePlacementResult = TablePlacementMismatch | null;
