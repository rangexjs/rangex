import type { NestedEditableView } from "rich-text-area";
import type { DOMChildNode } from "../../CreateHTMLFromSnapshotView-types";

export interface CreateNestedEditableHTMLParams {
	nestedEditableView: NestedEditableView;
	childNodes: DOMChildNode[];
}

export type CreateNestedEditableHTMLResult = HTMLElement;
