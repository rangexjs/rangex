import type { BlockComponentLineView } from "rich-text-area";
import type {
	DOMChildNode,
	StorageMap,
} from "../../CreateHTMLFromSnapshotView-types";

export interface CreateBlockComponentLineHTMLParams {
	blockComponentLineView: BlockComponentLineView;
	childNodes: DOMChildNode[];
	storageMap: StorageMap;
}

export type CreateBlockComponentLineHTMLResult = HTMLElement;
