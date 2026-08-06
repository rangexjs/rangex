import type { BlockComponentView } from "rich-text-area";
import type {
	DOMChildNode,
	PendingTasks,
	StorageMap,
} from "../../CreateHTMLFromSnapshotView-types";

export interface CreateBlockComponentHTMLParams {
	blockComponentView: BlockComponentView;
	childNodes: DOMChildNode[];
	pendingTasks: PendingTasks;
	storageMap: StorageMap;
}

export type CreateBlockComponentHTMLResult = HTMLElement;
