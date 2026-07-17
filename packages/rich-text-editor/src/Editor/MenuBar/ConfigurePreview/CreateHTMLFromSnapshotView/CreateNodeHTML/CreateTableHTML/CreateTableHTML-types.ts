import type { TableView } from "rich-text-area";
import type { DOMChildNode } from "../../CreateHTMLFromSnapshotView-types";

export interface CreateTableHTMLParams {
	tableView: TableView;
	childNodes: DOMChildNode[];
}

export type CreateTableHTMLResult = HTMLElement;
