import type { CreateSnapshotNamespaceParams, SnapshotNamespace } from "./SnapshotNamespace-types";

export const createSnapshotNamespace = ({
  editorAPI,
}: CreateSnapshotNamespaceParams): SnapshotNamespace => {
  const snapshotNamespace: SnapshotNamespace = {
    createStored() {
      const storedSnapshot = editorAPI.createStoredSnapshot();

      return storedSnapshot;
    },

    commit() {
      const snapshotTimeline = editorAPI.getSnapshotTimeline();
      snapshotTimeline.registerSnapshotBoundary();
    },
  };

  return snapshotNamespace;
};
