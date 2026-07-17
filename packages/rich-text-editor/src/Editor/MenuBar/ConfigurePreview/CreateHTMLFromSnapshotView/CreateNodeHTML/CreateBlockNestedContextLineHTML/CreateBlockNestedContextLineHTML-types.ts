import type { BlockNestedContextLineView } from "rich-text-area";
import type { DOMChildNode } from "../../CreateHTMLFromSnapshotView-types";

export interface CreateBlockNestedContextLineHTMLParams {
	blockNestedContextLineView: BlockNestedContextLineView;
	childNodes: DOMChildNode[];
}

export type CreateBlockNestedContextLineHTMLResult = HTMLElement;
