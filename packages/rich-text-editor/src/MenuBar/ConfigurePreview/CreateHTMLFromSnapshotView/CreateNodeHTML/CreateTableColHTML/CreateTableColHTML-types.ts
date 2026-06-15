import type { TableColView } from "rich-text-area";
import type { DOMChildNode } from "../../CreateHTMLFromSnapshotView-types";

export interface CreateTableColHTMLParams {
	tableColView: TableColView;
	childNodes: DOMChildNode[];
}

export type CreateTableColHTMLResult = HTMLElement;
