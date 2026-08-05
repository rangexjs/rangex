import type { SVGLayoutView } from "rich-text-area";
import type {
	DOMChildNode,
	StorageMap,
} from "../../CreateHTMLFromSnapshotView-types";

export interface CreateSVGLayoutHTMLParams {
	svgLayoutView: SVGLayoutView;
	childNodes: DOMChildNode[];
	storageMap: StorageMap;
}

export type CreateSVGLayoutHTMLResult = SVGElement;
