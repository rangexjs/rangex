import type {
	ElementView,
	NodeView,
	StoredSnapshot,
	TextView,
} from "rich-text-area";

export type StorageMap = Record<string, unknown>;

export interface HTMLView {
	styles: string;
	tree: string;
	storageMap: StorageMap;
}

export interface CreateElementParams {
	storageMap: StorageMap;
	elementView: ElementView;
	childNodes: string;
}

export interface CreateTextParams {
	textView: TextView;
}

export interface CreateHTMLTreeParams {
	storageMap: StorageMap;
	nodeView: NodeView;
}

export type CreateHTMLTreeResult = string;

export interface CreateHTMLViewParams {
	storedSnapshot: StoredSnapshot;
}

export interface CreateHTMLViewResult extends HTMLView {}
