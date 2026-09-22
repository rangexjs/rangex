import type {
	ElementView,
	NodeView,
	StoredSnapshot,
	TextView,
} from "rich-text-area";

export type Storage = Record<string, unknown>;

export interface HTMLView {
	styles: string;
	html: string;
	storage: Storage;
}

export interface CreateElementParams {
	storage: Storage;
	elementView: ElementView;
	childNodes: string;
}

export interface CreateTextParams {
	textView: TextView;
}

export interface CreateHTMLTreeParams {
	storage: Storage;
	nodeView: NodeView;
}

export type CreateHTMLTreeResult = string;

export interface CreateHTMLViewParams {
	storedSnapshot: StoredSnapshot;
	styles: string;
}

export interface CreateHTMLViewResult extends HTMLView {}
