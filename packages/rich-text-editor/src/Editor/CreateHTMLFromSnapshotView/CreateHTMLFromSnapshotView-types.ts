import type { SnapshotView } from "rich-text-area";

export type DOMChildNode = HTMLElement | SVGElement | MathMLElement | Text;

export type StorageMap = Map<Node, unknown>;

export type PendingTasks = Promise<void>[];

export type ToDOMResult = DOMChildNode | null;

export interface CreateHTMLFromSnapshotViewParams {
	snapshotView: SnapshotView;
}

export interface CreateHTMLFromSnapshotViewResult {
	style: HTMLStyleElement;
	rootElement: HTMLElement;
	settled: Promise<void>;
}
