import type { BlockNestedContextView } from "rich-text-area";
import type {
	DOMChildNode,
	PendingTasks,
} from "../../CreateHTMLFromSnapshotView-types";

export interface CreateBlockNestedContextHTMLParams {
	blockNestedContextView: BlockNestedContextView;
	childNodes: DOMChildNode[];
	pendingTasks: PendingTasks;
}

export type CreateBlockNestedContextHTMLResult = HTMLElement;
