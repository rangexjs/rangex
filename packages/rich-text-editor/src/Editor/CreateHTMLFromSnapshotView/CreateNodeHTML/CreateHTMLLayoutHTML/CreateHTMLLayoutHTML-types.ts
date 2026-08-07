import type { HTMLLayoutView } from "rich-text-area";
import type {
	DOMChildNode,
	StorageMap,
} from "../../CreateHTMLFromSnapshotView-types";

export interface CreateHTMLLayoutHTMLParams {
	htmlLayoutView: HTMLLayoutView;
	childNodes: DOMChildNode[];
	storageMap: StorageMap;
}

export type CreateHTMLLayoutHTMLResult = HTMLElement;
