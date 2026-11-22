import type { SnapshotLimits, SnapshotView, StoredSnapshot } from "@rangex/core";

import type { HighlightCodeFn } from "#adapters/CodeBlock";

export interface CreateSnapshotViewParams {
  storedSnapshot: StoredSnapshot;
  limits: SnapshotLimits;
  styles: string;
  highlightCode?: HighlightCodeFn;
}

export interface CreateSnapshotViewResult {
  snapshotView: SnapshotView;
}
