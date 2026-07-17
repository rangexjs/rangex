import type { TableRowView } from "rich-text-area";
import type { DOMChildNode } from "../../CreateHTMLFromSnapshotView-types";

export interface CreateTableRowHTMLParams {
	tableRowView: TableRowView;
	childNodes: DOMChildNode[];
}

export type CreateTableRowHTMLResult = HTMLElement;
