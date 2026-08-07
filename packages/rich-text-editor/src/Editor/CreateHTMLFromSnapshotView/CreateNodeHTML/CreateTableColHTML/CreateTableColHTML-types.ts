import type { TableColView } from "rich-text-area";
import type {
	DOMChildNode,
	StorageMap,
} from "../../CreateHTMLFromSnapshotView-types";

export interface CreateTableColHTMLParams {
	tableColView: TableColView;
	childNodes: DOMChildNode[];
	storageMap: StorageMap;
}

export type CreateTableColHTMLResult = HTMLElement;
