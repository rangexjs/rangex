import type { InlineComponentView } from "rich-text-area";
import type {
	DOMChildNode,
	StorageMap,
} from "../../CreateHTMLFromSnapshotView-types";

export interface CreateInlineComponentHTMLParams {
	inlineComponentView: InlineComponentView;
	childNodes: DOMChildNode[];
	storageMap: StorageMap;
}

export type CreateInlineComponentHTMLResult = HTMLElement;
