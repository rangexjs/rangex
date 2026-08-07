import type { RootEditableView } from "rich-text-area";
import type {
	DOMChildNode,
	StorageMap,
} from "../../CreateHTMLFromSnapshotView-types";

export interface CreateRootEditableHTMLParams {
	rootEditableView: RootEditableView;
	childNodes: DOMChildNode[];
	storageMap: StorageMap;
}

export type CreateRootEditableHTMLResult = HTMLElement;
