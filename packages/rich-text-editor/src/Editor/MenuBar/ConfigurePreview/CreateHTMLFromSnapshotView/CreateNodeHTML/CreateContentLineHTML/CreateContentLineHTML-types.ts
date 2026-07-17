import type { ContentLineView } from "rich-text-area";
import type { DOMChildNode } from "../../CreateHTMLFromSnapshotView-types";

export interface CreateContentLineHTMLParams {
	contentLineView: ContentLineView;
	childNodes: DOMChildNode[];
}

export type CreateContentLineHTMLResult = HTMLElement;
