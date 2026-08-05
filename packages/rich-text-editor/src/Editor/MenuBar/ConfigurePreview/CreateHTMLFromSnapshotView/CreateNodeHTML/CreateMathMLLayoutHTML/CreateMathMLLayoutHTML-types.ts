import type { MathMLLayoutView } from "rich-text-area";
import type {
	DOMChildNode,
	StorageMap,
} from "../../CreateHTMLFromSnapshotView-types";

export interface CreateMathMLLayoutHTMLParams {
	mathMLLayoutView: MathMLLayoutView;
	childNodes: DOMChildNode[];
	storageMap: StorageMap;
}

export type CreateMathMLLayoutHTMLResult = MathMLElement;
