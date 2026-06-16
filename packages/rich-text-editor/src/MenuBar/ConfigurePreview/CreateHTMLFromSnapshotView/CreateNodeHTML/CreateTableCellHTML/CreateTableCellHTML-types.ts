import type { TableCellView } from "rich-text-area";
import type { DOMChildNode } from "../../CreateHTMLFromSnapshotView-types";

export interface CreateTableCellHTMLParams {
	tableCellView: TableCellView;
	childNodes: DOMChildNode[];
}

export type CreateTableCellHTMLResult = HTMLElement;
