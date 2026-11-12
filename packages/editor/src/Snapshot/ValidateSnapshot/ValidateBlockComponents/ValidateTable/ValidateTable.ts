import {
	blockComponentRole,
	nestedEditableRole,
	tableColGroupRole,
	tableRole,
	tableSectionRole,
} from "@rangex/core";

import { componentsName, maxTableHeight, resolveTableLimits, tableDefinition } from "#constants";
import { createTableAttrValidators, tableAttrsShape } from "#dom-attrs";
import { tableStoragePattern } from "#storage";
import { matchJSON } from "#utilities";

import {
	describeJSONMismatch,
	formatNodePath,
	resolveDraftDOMAttrs,
	validateNestedEditableState,
} from "../../_Utilities";
import { validateBlockComponentLine, validateBlockComponentState } from "../_Utilities";
import type {
	CreateTableValidatorParams,
	CreateTableValidatorResult,
	ResolveTableHeightParams,
	ValidateTableCellParams,
	ValidateTableCellResult,
	ValidateTableColGroupParams,
	ValidateTableColGroupResult,
	ValidateTableNodeParams,
	ValidateTableNodeResult,
	ValidateTableParams,
	ValidateTableResult,
	ValidateTableRowParams,
	ValidateTableRowResult,
	ValidateTableSectionParams,
	ValidateTableSectionResult,
} from "./ValidateTable-types";

// The NestedEditable's domAttrs are resolved by the cell's shape before its state is matched
const isResolvedDOMAttrs = () => true;

/*
 * Validates a table cell. Its only child, a NestedEditable, is guaranteed by the engine's validation: its domAttrs are
 * resolved by the cell's NestedEditable shape, and its state must match the tableDefinition. Its content is left to the
 * engine's validation.
 */
const validateTableCell = ({
	componentDraft,
	tableCellDraft,
	attrValidators,
}: ValidateTableCellParams): ValidateTableCellResult => {
	const tableCellAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: componentDraft,
		elementDraft: tableCellDraft,
		elementAttrsShape: {},
		elementAttrValidators: {},
	});

	if (tableCellAttrsFailed) {
		return tableCellAttrsFailed;
	}

	const nestedEditableDraft = tableCellDraft.childNodes.at(0);

	if (nestedEditableDraft?.editorRole !== nestedEditableRole) {
		throw new Error("Expected a NestedEditable inside the TableCell.");
	}

	const nestedEditableAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: componentDraft,
		elementDraft: nestedEditableDraft,
		elementAttrsShape: tableAttrsShape.cellNestedEditable,
		elementAttrValidators: attrValidators.cellNestedEditable,
	});

	if (nestedEditableAttrsFailed) {
		return nestedEditableAttrsFailed;
	}

	const nestedEditableFailed = validateNestedEditableState({
		componentDraft,
		nestedEditableDraft,
		expectedState: {
			editorRole: nestedEditableRole,
			display: "block multi-line",
			editState: tableDefinition.tableCellsEditable,
			...tableDefinition.cellNestedEditableProps,
			domAttrs: isResolvedDOMAttrs,
			customStorage: null,
		},
	});

	if (nestedEditableFailed) {
		return nestedEditableFailed;
	}

	return null;
};

/*
 * Validates a table row and each of its cells.
 */
const validateTableRow = ({
	componentDraft,
	tableRowDraft,
	attrValidators,
}: ValidateTableRowParams): ValidateTableRowResult => {
	const domAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: componentDraft,
		elementDraft: tableRowDraft,
		elementAttrsShape: {},
		elementAttrValidators: {},
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
	}

	for (const tableCellDraft of tableRowDraft.childNodes) {
		const tableCellFailed = validateTableCell({
			componentDraft,
			tableCellDraft,
			attrValidators,
		});

		if (tableCellFailed) {
			return tableCellFailed;
		}
	}

	return null;
};

/*
 * Validates a table section (thead, tbody or tfoot) and each of its rows.
 */
const validateTableSection = ({
	componentDraft,
	tableSectionDraft,
	attrValidators,
}: ValidateTableSectionParams): ValidateTableSectionResult => {
	const domAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: componentDraft,
		elementDraft: tableSectionDraft,
		elementAttrsShape: {},
		elementAttrValidators: {},
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
	}

	for (const tableRowDraft of tableSectionDraft.childNodes) {
		const tableRowFailed = validateTableRow({
			componentDraft,
			tableRowDraft,
			attrValidators,
		});

		if (tableRowFailed) {
			return tableRowFailed;
		}
	}

	return null;
};

/*
 * Validates the column group and each of its columns. Their widths are the Table's colGroups, so they have no
 * attributes.
 */
const validateTableColGroup = ({
	componentDraft,
	tableColGroupDraft,
}: ValidateTableColGroupParams): ValidateTableColGroupResult => {
	const domAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: componentDraft,
		elementDraft: tableColGroupDraft,
		elementAttrsShape: {},
		elementAttrValidators: {},
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
	}

	for (const tableColDraft of tableColGroupDraft.childNodes) {
		const tableColFailed = resolveDraftDOMAttrs({
			rootDraft: componentDraft,
			elementDraft: tableColDraft,
			elementAttrsShape: {},
			elementAttrValidators: {},
		});

		if (tableColFailed) {
			return tableColFailed;
		}
	}

	return null;
};

/*
 * Resets every row to the default height if the rows are taller than maxTableHeight together. Dragging a row can make
 * it as tall as any height, so a table this tall is repaired instead of making the snapshot invalid.
 */
const resolveTableHeight = ({ tableDraft }: ResolveTableHeightParams) => {
	const { rowGroups, defaultRowHeight } = tableDraft;

	const tableHeight = rowGroups.reduce((sum, rowHeight) => sum + rowHeight, 0);

	if (tableHeight <= maxTableHeight) {
		return;
	}

	tableDraft.rowGroups = rowGroups.map(() => defaultRowHeight);
};

/*
 * Validates the engine's Table: its settings must match the tableDefinition, and its size the given limits. The
 * cells' settings carry no attributes, so theirs are dropped, as are the attributes of the Table and every node in it
 * but the cells' NestedEditables. The grid itself is left to the engine's validation.
 */
const validateTableNode = ({
	componentDraft,
	tableDraft,
	attrValidators,
	limits,
}: ValidateTableNodeParams): ValidateTableNodeResult => {
	tableDraft.tableCellProps = { domAttrs: {} };
	tableDraft.cellNestedEditableProps = {
		...tableDraft.cellNestedEditableProps,
		domAttrs: {},
	};

	const {
		minColWidth,
		minRowHeight,
		defaultRowHeight,
		tableCellsEditable,
		cellNestedEditableProps,
		customStorage,
	} = tableDraft;

	const tableState = {
		minColWidth,
		minRowHeight,
		defaultRowHeight,
		tableCellsEditable,
		cellNestedEditableProps,
		customStorage,
	};

	const tableMismatch = matchJSON({
		value: tableState,
		pattern: {
			...tableDefinition,
			cellNestedEditableProps: {
				...tableDefinition.cellNestedEditableProps,
				domAttrs: {},
			},
			customStorage: null,
		},
	});

	if (tableMismatch) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: tableDraft,
			reason: describeJSONMismatch({
				rootDraft: componentDraft,
				nodeDraft: tableDraft,
				value: tableState,
				mismatch: tableMismatch,
			}),
		};
	}

	const { rowGroups, colGroups } = tableDraft;

	if (rowGroups.length > limits.maxRows || colGroups.length > limits.maxCols) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: tableDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: tableDraft })}: must have at most ${limits.maxRows} rows and ${limits.maxCols} columns.`,
		};
	}

	resolveTableHeight({ tableDraft });

	const domAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: componentDraft,
		elementDraft: tableDraft,
		elementAttrsShape: {},
		elementAttrValidators: {},
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
	}

	for (const childDraft of tableDraft.childNodes) {
		if (childDraft.editorRole === tableColGroupRole) {
			const tableColGroupFailed = validateTableColGroup({
				componentDraft,
				tableColGroupDraft: childDraft,
			});

			if (tableColGroupFailed) {
				return tableColGroupFailed;
			}

			continue;
		}

		if (childDraft.editorRole === tableSectionRole) {
			const tableSectionFailed = validateTableSection({
				componentDraft,
				tableSectionDraft: childDraft,
				attrValidators,
			});

			if (tableSectionFailed) {
				return tableSectionFailed;
			}

			continue;
		}

		throw new Error("Expected a TableColGroup or a TableSection inside the Table.");
	}

	return null;
};

/*
 * Validates a Table component, its BlockComponentLine, and everything down to its cells' NestedEditables, node by
 * node: each node's own state, then its children. It's built as a BlockComponent holding exactly one engine Table. The
 * cells' NestedEditables keep their vertical alignment (see createTableAttrValidators), every other attribute is dropped.
 * The NestedEditables' content is left to the engine's validation.
 */
const validateTable = ({
	componentDraft,
	attrValidators,
	limits,
}: ValidateTableParams): ValidateTableResult => {
	if (componentDraft.editorRole !== blockComponentRole) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: componentDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: componentDraft })}: must be a ${blockComponentRole}.`,
		};
	}

	const stateFailed = validateBlockComponentState({
		blockComponentDraft: componentDraft,
		expectedState: {
			editorRole: blockComponentRole,
			name: componentsName.table,
			content: { type: "custom" },
			editState: "inherit",
			shouldSelectBeforeRemove: true,
			shouldSelectOnNavigation: true,
			customStorage: tableStoragePattern,
		},
	});

	if (stateFailed) {
		return stateFailed;
	}

	const lineFailed = validateBlockComponentLine({
		blockComponentDraft: componentDraft,
		lineAttrsShape: {},
		lineAttrValidators: {},
	});

	if (lineFailed) {
		return lineFailed;
	}

	const domAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: componentDraft,
		elementDraft: componentDraft,
		elementAttrsShape: {},
		elementAttrValidators: {},
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
	}

	const { childNodes } = componentDraft;

	const tableDraft = childNodes.at(0);

	if (childNodes.length !== 1 || tableDraft?.editorRole !== tableRole) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: componentDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: componentDraft })}: must contain exactly one ${tableRole}.`,
		};
	}

	const tableNodeFailed = validateTableNode({
		componentDraft,
		tableDraft,
		attrValidators,
		limits,
	});

	if (tableNodeFailed) {
		return tableNodeFailed;
	}

	return null;
};

/*
 * Creates the Table's ComponentValidator, which validates the Tables' size by the given limits (see resolveTableLimits)
 * and their cells' attributes by the Table's validators (see createTableAttrValidators).
 */
export const createTableValidator = (
	params: CreateTableValidatorParams,
): CreateTableValidatorResult => {
	const limits = resolveTableLimits(params);

	const tableAttrValidators = createTableAttrValidators({});

	return {
		name: componentsName.table,
		validate: ({ componentDraft }) =>
			validateTable({
				componentDraft,
				attrValidators: tableAttrValidators,
				limits,
			}),
	};
};
