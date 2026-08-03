import type { BlockComponentTextHolderView } from "rich-text-area";
import type { DOMChildNode } from "../../CreateHTMLFromSnapshotView-types";

export interface CreateBlockComponentTextHolderHTMLParams {
	blockComponentTextHolderView: BlockComponentTextHolderView;
	childNodes: DOMChildNode[];
}

export type CreateBlockComponentTextHolderHTMLResult = HTMLElement;
