import type { createSnapshotView, StoredSnapshot } from "@rangex/editor";

export interface CreateRichTextSnapshotViewParams {
	storedSnapshot: StoredSnapshot;
}

export interface CreateRichTextSnapshotViewResult
	extends ReturnType<typeof createSnapshotView> {}
