import type { OneVisualUnitTextView } from "rich-text-area";
import type { StorageMap } from "../../CreateHTMLFromSnapshotView-types";

export interface CreateOneVisualUnitTextHTMLParams {
	oneVisualUnitTextView: OneVisualUnitTextView;
	storageMap: StorageMap;
}

export type CreateOneVisualUnitTextHTMLResult = Text;
