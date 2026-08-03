import type { BlockComponentLineView } from "rich-text-area";
import type { DOMChildNode } from "../../CreateHTMLFromSnapshotView-types";

export interface CreateBlockComponentLineHTMLParams {
	blockComponentLineView: BlockComponentLineView;
	childNodes: DOMChildNode[];
}

export type CreateBlockComponentLineHTMLResult = HTMLElement;
