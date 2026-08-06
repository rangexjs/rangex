import type { BeamTextView } from "rich-text-area";
import type { StorageMap } from "../../CreateHTMLFromSnapshotView-types";

export interface CreateBeamTextHTMLParams {
	beamTextView: BeamTextView;
	storageMap: StorageMap;
}

export type CreateBeamTextHTMLResult = Text;
