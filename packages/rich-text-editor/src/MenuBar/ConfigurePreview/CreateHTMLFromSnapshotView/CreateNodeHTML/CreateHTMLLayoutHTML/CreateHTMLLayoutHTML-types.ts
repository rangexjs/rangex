import type { HTMLLayoutView } from "rich-text-area";
import type { DOMChildNode } from "../../CreateHTMLFromSnapshotView-types";

export interface CreateHTMLLayoutHTMLParams {
	htmlLayoutView: HTMLLayoutView;
	childNodes: DOMChildNode[];
}

export type CreateHTMLLayoutHTMLResult = HTMLElement;
