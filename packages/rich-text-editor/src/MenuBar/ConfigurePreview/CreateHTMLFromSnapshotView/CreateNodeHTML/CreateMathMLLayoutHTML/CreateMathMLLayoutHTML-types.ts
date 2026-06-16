import type { MathMLLayoutView } from "rich-text-area";
import type { DOMChildNode } from "../../CreateHTMLFromSnapshotView-types";

export interface CreateMathMLLayoutHTMLParams {
	mathMLLayoutView: MathMLLayoutView;
	childNodes: DOMChildNode[];
}

export type CreateMathMLLayoutHTMLResult = MathMLElement;
