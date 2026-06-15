import type { SnapshotView } from "rich-text-area";

export type DOMChildNode = HTMLElement | SVGElement | MathMLElement | Text;

export type ToDOMResult = DOMChildNode | null;

export interface CreateHTMLFromSnapshotViewParams {
	snapshotView: SnapshotView;
}

export interface CreateHTMLFromSnapshotViewResult {
	style: HTMLStyleElement;
	rootElement: HTMLElement;
}
