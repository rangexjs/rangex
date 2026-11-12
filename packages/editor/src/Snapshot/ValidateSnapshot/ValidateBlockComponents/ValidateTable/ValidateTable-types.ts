import type {
	ComponentDraft,
	TableCellDraft,
	TableColGroupDraft,
	TableDraft,
	TableRowDraft,
	TableSectionDraft,
} from "@rangex/core";

import type { TableLimits, TableLimitsParams } from "#constants";
import type { TableAttrValidators } from "#dom-attrs";

import type {
	ComponentValidator,
	ValidateComponentParams,
	ValidateComponentResult,
} from "../../ValidateSnapshot-types";

export interface ValidateTableCellParams {
	componentDraft: ComponentDraft;
	tableCellDraft: TableCellDraft;
	attrValidators: TableAttrValidators;
}

export type ValidateTableCellResult = ValidateComponentResult;

export interface ValidateTableRowParams {
	componentDraft: ComponentDraft;
	tableRowDraft: TableRowDraft;
	attrValidators: TableAttrValidators;
}

export type ValidateTableRowResult = ValidateComponentResult;

export interface ValidateTableSectionParams {
	componentDraft: ComponentDraft;
	tableSectionDraft: TableSectionDraft;
	attrValidators: TableAttrValidators;
}

export type ValidateTableSectionResult = ValidateComponentResult;

export interface ValidateTableColGroupParams {
	componentDraft: ComponentDraft;
	tableColGroupDraft: TableColGroupDraft;
}

export type ValidateTableColGroupResult = ValidateComponentResult;

export interface ResolveTableHeightParams {
	tableDraft: TableDraft;
}

export interface ValidateTableNodeParams {
	componentDraft: ComponentDraft;
	tableDraft: TableDraft;
	attrValidators: TableAttrValidators;
	limits: TableLimits;
}

export type ValidateTableNodeResult = ValidateComponentResult;

export interface ValidateTableParams extends ValidateComponentParams {
	attrValidators: TableAttrValidators;
	limits: TableLimits;
}

export type ValidateTableResult = ValidateComponentResult;

export interface CreateTableValidatorParams extends TableLimitsParams {}

export type CreateTableValidatorResult = ComponentValidator;
