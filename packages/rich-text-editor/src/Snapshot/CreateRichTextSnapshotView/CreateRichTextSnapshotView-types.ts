import type { createSnapshotView, SnapshotLimits, StoredSnapshot } from "@rangex/editor";

export interface CreateRichTextSnapshotViewParams {
	storedSnapshot: StoredSnapshot;
	limits: SnapshotLimits;
}

export interface CreateRichTextSnapshotViewResult extends ReturnType<typeof createSnapshotView> {}
