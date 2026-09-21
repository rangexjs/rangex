import type { ElementView, NodeView, SnapshotView } from "rich-text-area";

export type DOMChildNode = Element | Text;

export type StorageMap = Map<Node, unknown>;

export type PendingTasks = Promise<void>[];

export type ToDOMResult = DOMChildNode | null;

export interface GetElementNamespaceURIParams {
	parentNamespaceURI: string;
	localName: string;
}

export interface GetChildNamespaceURIParams {
	namespaceURI: string;
	localName: string;
}

export interface ToDOMParams {
	node: NodeView;
	parentNamespaceURI: string;
}

export interface AppendShadowRootParams {
	host: Element;
	template: ElementView;
}

export interface CreateHTMLFromSnapshotViewParams {
	snapshotView: SnapshotView;
}

export interface CreateHTMLFromSnapshotViewResult {
	style: HTMLStyleElement;
	rootElement: HTMLElement;
	settled: Promise<void>;
}
