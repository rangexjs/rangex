import type { ListItemView } from "rich-text-area";
import type {
	DOMChildNode,
	StorageMap,
} from "../../CreateHTMLFromSnapshotView-types";

export interface CreateListItemHTMLParams {
	listItemView: ListItemView;
	childNodes: DOMChildNode[];
	storageMap: StorageMap;
}

export type CreateListItemHTMLResult = HTMLElement;
