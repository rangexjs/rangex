import type { RootEditableView } from "rich-text-area";
import type { DOMChildNode } from "../../CreateHTMLFromSnapshotView-types";

export interface CreateRootEditableHTMLParams {
	rootEditableView: RootEditableView;
	childNodes: DOMChildNode[];
}

export type CreateRootEditableHTMLResult = HTMLElement;
