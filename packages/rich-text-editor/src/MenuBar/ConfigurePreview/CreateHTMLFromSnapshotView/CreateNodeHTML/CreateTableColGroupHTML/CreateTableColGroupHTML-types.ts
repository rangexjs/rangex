import type { TableColGroupView } from "rich-text-area";
import type { DOMChildNode } from "../../CreateHTMLFromSnapshotView-types";

export interface CreateTableColGroupHTMLParams {
	tableColGroupView: TableColGroupView;
	childNodes: DOMChildNode[];
}

export type CreateTableColGroupHTMLResult = HTMLElement;
