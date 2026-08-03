import type { BlockComponentView } from "rich-text-area";
import type {
	DOMChildNode,
	PendingTasks,
} from "../../CreateHTMLFromSnapshotView-types";

export interface CreateBlockComponentHTMLParams {
	blockComponentView: BlockComponentView;
	childNodes: DOMChildNode[];
	pendingTasks: PendingTasks;
}

export type CreateBlockComponentHTMLResult = HTMLElement;
