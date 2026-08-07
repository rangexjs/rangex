import type { ContentLineView } from "rich-text-area";
import type {
	DOMChildNode,
	StorageMap,
} from "../../CreateHTMLFromSnapshotView-types";

export interface CreateContentLineHTMLParams {
	contentLineView: ContentLineView;
	childNodes: DOMChildNode[];
	storageMap: StorageMap;
}

export type CreateContentLineHTMLResult = HTMLElement;
