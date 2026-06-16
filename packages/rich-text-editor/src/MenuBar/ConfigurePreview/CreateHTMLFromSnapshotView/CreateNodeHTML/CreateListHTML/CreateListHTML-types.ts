import type { ListView } from "rich-text-area";
import type { DOMChildNode } from "../../CreateHTMLFromSnapshotView-types";

export interface CreateListHTMLParams {
	listView: ListView;
	childNodes: DOMChildNode[];
}

export type CreateListHTMLResult = HTMLElement;
