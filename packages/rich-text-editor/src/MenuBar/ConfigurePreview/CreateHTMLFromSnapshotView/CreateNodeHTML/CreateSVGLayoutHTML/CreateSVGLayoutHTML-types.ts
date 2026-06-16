import type { SVGLayoutView } from "rich-text-area";
import type { DOMChildNode } from "../../CreateHTMLFromSnapshotView-types";

export interface CreateSVGLayoutHTMLParams {
	svgLayoutView: SVGLayoutView;
	childNodes: DOMChildNode[];
}

export type CreateSVGLayoutHTMLResult = SVGElement;
