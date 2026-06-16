import type { ListItemView } from "rich-text-area";
import type { DOMChildNode } from "../../CreateHTMLFromSnapshotView-types";

export interface CreateListItemHTMLParams {
	listItemView: ListItemView;
	childNodes: DOMChildNode[];
}

export type CreateListItemHTMLResult = HTMLElement;
