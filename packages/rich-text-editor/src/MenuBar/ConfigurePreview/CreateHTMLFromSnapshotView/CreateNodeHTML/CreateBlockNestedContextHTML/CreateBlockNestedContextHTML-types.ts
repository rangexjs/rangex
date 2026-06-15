import type { BlockNestedContextView } from "rich-text-area";
import type { DOMChildNode } from "../../CreateHTMLFromSnapshotView-types";

export interface CreateBlockNestedContextHTMLParams {
	blockNestedContextView: BlockNestedContextView;
	childNodes: DOMChildNode[];
}

export type CreateBlockNestedContextHTMLResult = HTMLElement;
