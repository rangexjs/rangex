import { componentsName } from "../../ComponentsName";
import type {
	ResolveTableLimitsResult,
	TableDefinition,
	TableLimits,
	TableLimitsParams,
} from "./TableDefinition-types";

// The engine's own limits: createTable throws past the column count, and a snapshot's grid can't be larger
const engineMaxTableCols = 1000;
const engineMaxTableGridSize = 500_000;

/*
 * The state of every table: createTable builds it with this, and a snapshot's table must match it. A cell only allows
 * inline components, each listed by name, so a new component stays out until it's added.
 */
export const tableDefinition = {
	minColWidth: 40,
	minRowHeight: 40,
	defaultRowHeight: 40,
	tableCellsEditable: "true",
	cellNestedEditableProps: {
		allowedComponents: [
			componentsName.link,
			componentsName.mention,
			componentsName.templateVariable,
			componentsName.comment,
		],
		allowedContentLineLocalNames: null,
		allowedContentLineStyleAttrNames: null,
		allowedGlyphFormatterStyleAttrNames: null,
		allowedGlyphFormatterInlineTags: null,
	},
} satisfies TableDefinition;

export const defaultTableLimits: TableLimits = {
	maxRows: 100,
	maxCols: 40,
};

/*
 * The largest sum of a table's row heights in px
 */
export const maxTableHeight = 100_000;

const isCount = (value: number) => Number.isInteger(value) && value >= 1;

/*
 * Resolves the given limits, the defaults filling in the ones left out. Throws if they're not positive integers, or
 * they're past the engine's own limits.
 */
export const resolveTableLimits = ({
	maxRows = defaultTableLimits.maxRows,
	maxCols = defaultTableLimits.maxCols,
}: TableLimitsParams): ResolveTableLimitsResult => {
	if (!(isCount(maxRows) && isCount(maxCols))) {
		throw new Error("Table's maxRows and maxCols must be positive integers.");
	}

	if (maxCols > engineMaxTableCols) {
		throw new Error(
			`Table's maxCols can't be more than ${engineMaxTableCols}.`,
		);
	}

	if (maxRows * maxCols > engineMaxTableGridSize) {
		throw new Error(
			`Table's maxRows × maxCols can't be more than ${engineMaxTableGridSize}.`,
		);
	}

	return { maxRows, maxCols };
};
