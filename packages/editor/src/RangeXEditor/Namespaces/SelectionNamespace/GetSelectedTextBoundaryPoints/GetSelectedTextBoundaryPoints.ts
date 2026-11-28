import {
  nestedEditableRole,
  nestedEditableRoleSelector,
  tableRole,
  tableRoleSelector,
} from "@rangex/core";

import type {
  GetActiveSelectionTableParams,
  GetActiveSelectionTableResult,
  GetSelectedTextBoundaryPointsParams,
  GetSelectedTextBoundaryPointsResult,
  GetTableCellEditableParams,
  GetTableCellEditableResult,
} from "./GetSelectedTextBoundaryPoints-types";

const getActiveSelectionTable = ({
  rootEditable,
}: GetActiveSelectionTableParams): GetActiveSelectionTableResult => {
  const tables = rootEditable.$$querySelectorAll(tableRoleSelector);

  for (const table of tables) {
    if (table.$$editorRole !== tableRole) {
      throw new Error("Table's type is invalid.");
    }

    if (table.$$isTableSelectionActive) {
      return table;
    }
  }

  return null;
};

const getTableCellEditable = ({
  tableCell,
}: GetTableCellEditableParams): GetTableCellEditableResult => {
  const nestedEditable = tableCell.$$querySelector(nestedEditableRoleSelector);

  if (nestedEditable?.$$editorRole !== nestedEditableRole) {
    throw new Error("NestedEditable's type is invalid.");
  }

  return nestedEditable;
};

/*
 * Returns the boundary points of the selected text. While a table has a cell selection, they span from the start of its
 * first selected cell to the end of its last one, like the engine's copy. Otherwise they're the EditorSelection's.
 */
export const getSelectedTextBoundaryPoints = ({
  editorAPI,
}: GetSelectedTextBoundaryPointsParams): GetSelectedTextBoundaryPointsResult => {
  const table = getActiveSelectionTable({ rootEditable: editorAPI.rootEditable });

  if (table) {
    const selectedCells = table.$$tableCells.filter((tableCell) => tableCell.$$isInMultiSelection);

    const firstCell = selectedCells.at(0);
    const lastCell = selectedCells.at(-1);

    if (!(firstCell && lastCell)) {
      throw new Error("SelectedCells can't be empty on table with active selection.");
    }

    const firstEditable = getTableCellEditable({ tableCell: firstCell });
    const lastEditable = getTableCellEditable({ tableCell: lastCell });

    return {
      fromNode: firstEditable,
      fromOffset: 0,
      toNode: lastEditable,
      toOffset: lastEditable.$$childNodes.length,
    };
  }

  const editorSelection = editorAPI.getEditorSelection();

  const { fromText, fromOffset, toText, toOffset } = editorSelection.getBoundaryPoints();

  return { fromNode: fromText, fromOffset, toNode: toText, toOffset };
};
