import type { TableColGroupView } from "rich-text-area";
import type {
	DOMChildNode,
	StorageMap,
} from "../../CreateHTMLFromSnapshotView-types";

export interface CreateTableColGroupHTMLParams {
	tableColGroupView: TableColGroupView;
	childNodes: DOMChildNode[];
	storageMap: StorageMap;
}

export type CreateTableColGroupHTMLResult = HTMLElement;
