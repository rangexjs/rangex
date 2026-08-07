import type { BasicTextView } from "rich-text-area";
import type { StorageMap } from "../../CreateHTMLFromSnapshotView-types";

export interface CreateBasicTextHTMLParams {
	basicTextView: BasicTextView;
	storageMap: StorageMap;
}

export type CreateBasicTextHTMLResult = Text;
