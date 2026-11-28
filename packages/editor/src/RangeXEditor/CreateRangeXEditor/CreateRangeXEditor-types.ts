import type { EditorAPI } from "@rangex/core";

import type { SnapshotSchema } from "#snapshot";

export interface CreateRangeXEditorParams {
  editorAPI: EditorAPI;
  snapshotSchema: SnapshotSchema;
  cleanupList: Set<() => void>;
}

export interface RangeXEditorInternals {
  isDestroyed: boolean;
}
