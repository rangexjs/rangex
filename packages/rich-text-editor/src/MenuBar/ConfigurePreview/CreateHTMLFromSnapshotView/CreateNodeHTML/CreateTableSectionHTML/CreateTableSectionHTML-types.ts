import type { TableSectionView } from "rich-text-area";
import type { DOMChildNode } from "../../CreateHTMLFromSnapshotView-types";

export interface CreateTableSectionHTMLParams {
	tableSectionView: TableSectionView;
	childNodes: DOMChildNode[];
}

export type CreateTableSectionHTMLResult = HTMLElement;
