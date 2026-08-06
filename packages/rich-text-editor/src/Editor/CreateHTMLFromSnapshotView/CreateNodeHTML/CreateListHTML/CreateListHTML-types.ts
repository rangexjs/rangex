import type { ListView } from "rich-text-area";
import type {
	DOMChildNode,
	StorageMap,
} from "../../CreateHTMLFromSnapshotView-types";

export interface CreateListHTMLParams {
	listView: ListView;
	childNodes: DOMChildNode[];
	storageMap: StorageMap;
}

export type CreateListHTMLResult = HTMLElement;
