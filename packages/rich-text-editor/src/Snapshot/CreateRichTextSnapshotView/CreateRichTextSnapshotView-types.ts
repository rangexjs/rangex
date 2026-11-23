import type { createSnapshotView, SnapshotLimits, StoredSnapshot } from "@rangex/editor/snapshot";
import type { HighlightCodeFn } from "@rangex/editor/code-block";

export interface CreateRichTextSnapshotViewParams {
  storedSnapshot: StoredSnapshot;
  limits: SnapshotLimits;
  highlightCode?: HighlightCodeFn;
}

export interface CreateRichTextSnapshotViewResult extends ReturnType<typeof createSnapshotView> {}
