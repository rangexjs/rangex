import type {
	ValidateTablePlacementParams,
	ValidateTablePlacementResult,
} from "./ValidateTablePlacement-types";

const isCountWithin = (value: number, max: number) =>
	Number.isInteger(value) && value >= 1 && value <= max;

/*
 * Validates whether a table can be placed with the given row and column counts: each must be an integer from 1 to its
 * limit. Returns the first mismatch with its field's name, or null when they're valid.
 */
export const validateTablePlacement = ({
	row,
	column,
	limits,
}: ValidateTablePlacementParams): ValidateTablePlacementResult => {
	if (!isCountWithin(row, limits.maxRows)) {
		return {
			field: "row",
			reason: `must be an integer from 1 to ${limits.maxRows}`,
		};
	}

	if (!isCountWithin(column, limits.maxCols)) {
		return {
			field: "column",
			reason: `must be an integer from 1 to ${limits.maxCols}`,
		};
	}

	return null;
};
