import type { TableView } from "rich-text-area";
import type {
	DOMChildNode,
	StorageMap,
} from "../../CreateHTMLFromSnapshotView-types";

export interface CreateTableHTMLParams {
	tableView: TableView;
	childNodes: DOMChildNode[];
	storageMap: StorageMap;
}

export type CreateTableHTMLResult = HTMLElement;
