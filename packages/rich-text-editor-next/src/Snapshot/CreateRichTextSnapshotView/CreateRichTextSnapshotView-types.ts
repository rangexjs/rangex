import type { createSnapshotView } from "@rangex/editor";
import type { StoredSnapshot } from "rich-text-area";

export interface CreateRichTextSnapshotViewParams {
	storedSnapshot: StoredSnapshot;
}

export interface CreateRichTextSnapshotViewResult
	extends ReturnType<typeof createSnapshotView> {}
