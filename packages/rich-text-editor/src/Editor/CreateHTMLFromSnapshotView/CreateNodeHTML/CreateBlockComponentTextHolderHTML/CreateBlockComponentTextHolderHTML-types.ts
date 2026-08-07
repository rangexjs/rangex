import type { BlockComponentTextHolderView } from "rich-text-area";
import type {
	DOMChildNode,
	StorageMap,
} from "../../CreateHTMLFromSnapshotView-types";

export interface CreateBlockComponentTextHolderHTMLParams {
	blockComponentTextHolderView: BlockComponentTextHolderView;
	childNodes: DOMChildNode[];
	storageMap: StorageMap;
}

export type CreateBlockComponentTextHolderHTMLResult = HTMLElement;
