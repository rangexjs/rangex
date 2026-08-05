import type { NestedEditableView } from "rich-text-area";
import type {
	DOMChildNode,
	StorageMap,
} from "../../CreateHTMLFromSnapshotView-types";

export interface CreateNestedEditableHTMLParams {
	nestedEditableView: NestedEditableView;
	childNodes: DOMChildNode[];
	storageMap: StorageMap;
}

export type CreateNestedEditableHTMLResult = HTMLElement;
