import type { EditorAPI, StoredSnapshot } from "@rangex/core";

export interface SnapshotNamespace {
  createStored(): StoredSnapshot;
  commit(): void;
}

export interface CreateSnapshotNamespaceParams {
  editorAPI: EditorAPI;
}
