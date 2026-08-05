import type { TableCellView } from "rich-text-area";
import type {
	DOMChildNode,
	StorageMap,
} from "../../CreateHTMLFromSnapshotView-types";

export interface CreateTableCellHTMLParams {
	tableCellView: TableCellView;
	childNodes: DOMChildNode[];
	storageMap: StorageMap;
}

export type CreateTableCellHTMLResult = HTMLElement;
