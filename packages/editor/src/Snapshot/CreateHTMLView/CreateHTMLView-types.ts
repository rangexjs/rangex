import type {
	ElementView,
	NodeView,
	StoredSnapshot,
	TextView,
} from "rich-text-area";
import type { NodeStorage } from "../../EngineLinks/Storage/_Utilities";

export type HTMLViewStorage = Record<string, NodeStorage>;

export type CreateIdFn = () => string;

export interface HTMLView {
	styles: string;
	html: string;
	storage: HTMLViewStorage;
}

export interface CreateElementParams {
	storage: HTMLViewStorage;
	createId: CreateIdFn;
	elementView: ElementView;
	childNodes: string;
}

export interface CreateTextParams {
	textView: TextView;
}

export interface CreateHTMLTreeParams {
	storage: HTMLViewStorage;
	createId: CreateIdFn;
	nodeView: NodeView;
}

export type CreateHTMLTreeResult = string;

export interface CreateHTMLViewParams {
	storedSnapshot: StoredSnapshot;
	styles: string;
}

export interface CreateHTMLViewResult extends HTMLView {}
