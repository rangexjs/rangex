import type { EditorAPI, FailedStoredSnapshotValidation, StoredSnapshot } from "@rangex/core";

import type { SnapshotSchema } from "#snapshot";

export type LoadSnapshotResult = FailedStoredSnapshotValidation | null;

export interface SnapshotNamespace {
  create(): StoredSnapshot;
  load(storedSnapshot: StoredSnapshot): LoadSnapshotResult;
}

export interface CreateSnapshotNamespaceParams {
  editorAPI: EditorAPI;
  snapshotSchema: SnapshotSchema;
}
