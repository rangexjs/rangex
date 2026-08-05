import type { TableRowView } from "rich-text-area";
import type {
	DOMChildNode,
	StorageMap,
} from "../../CreateHTMLFromSnapshotView-types";

export interface CreateTableRowHTMLParams {
	tableRowView: TableRowView;
	childNodes: DOMChildNode[];
	storageMap: StorageMap;
}

export type CreateTableRowHTMLResult = HTMLElement;
