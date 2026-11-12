import type { CreateTableCellNestedEditableProps, CreateTableParams } from "@rangex/core";

export interface TableCellNestedEditableDefinition extends Pick<
	CreateTableCellNestedEditableProps,
	| "allowedComponents"
	| "allowedContentLineLocalNames"
	| "allowedContentLineStyleAttrNames"
	| "allowedGlyphFormatterStyleAttrNames"
	| "allowedGlyphFormatterInlineTags"
> {}

export interface TableDefinition extends Pick<
	CreateTableParams,
	"minColWidth" | "minRowHeight" | "defaultRowHeight" | "tableCellsEditable"
> {
	cellNestedEditableProps: TableCellNestedEditableDefinition;
}

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
