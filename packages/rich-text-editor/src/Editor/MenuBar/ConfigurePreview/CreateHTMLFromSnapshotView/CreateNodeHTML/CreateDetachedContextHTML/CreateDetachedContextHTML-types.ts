import type { DetachedContextView } from "rich-text-area";
import type { StorageMap } from "../../CreateHTMLFromSnapshotView-types";

export interface CreateDetachedContextHTMLParams {
	detachedContextView: DetachedContextView;
	storageMap: StorageMap;
}

export type CreateDetachedContextHTMLResult = HTMLElement | null;
