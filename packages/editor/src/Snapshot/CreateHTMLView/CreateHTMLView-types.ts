import type { ElementView, NodeView, SnapshotLimits, StoredSnapshot, TextView } from "@rangex/core";

import type { HighlightCodeFn } from "#adapters/CodeBlock";
import type { NodeStorage } from "#storage";

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
	limits: SnapshotLimits;
	styles: string;
	highlightCode?: HighlightCodeFn;
}

export interface CreateHTMLViewResult extends HTMLView {}
