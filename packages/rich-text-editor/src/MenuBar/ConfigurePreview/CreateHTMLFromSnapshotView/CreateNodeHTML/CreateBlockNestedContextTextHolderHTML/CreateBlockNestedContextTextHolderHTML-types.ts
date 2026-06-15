import type { BlockNestedContextTextHolderView } from "rich-text-area";
import type { DOMChildNode } from "../../CreateHTMLFromSnapshotView-types";

export interface CreateBlockNestedContextTextHolderHTMLParams {
	blockNestedContextTextHolderView: BlockNestedContextTextHolderView;
	childNodes: DOMChildNode[];
}

export type CreateBlockNestedContextTextHolderHTMLResult = HTMLElement;
