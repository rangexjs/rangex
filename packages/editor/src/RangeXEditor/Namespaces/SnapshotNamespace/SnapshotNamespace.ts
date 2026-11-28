import { resolveStoredSnapshot } from "../../ResolveStoredSnapshot";
import type { CreateSnapshotNamespaceParams, SnapshotNamespace } from "./SnapshotNamespace-types";

/*
 * Creates and loads StoredSnapshots. load() replaces the content of the running editor and clears its undo history,
 * after migrating and validating the snapshot like createEditor does. An invalid snapshot leaves the editor unchanged,
 * and the failure is returned.
 */
export const createSnapshotNamespace = ({
  editorAPI,
  snapshotSchema,
}: CreateSnapshotNamespaceParams): SnapshotNamespace => {
  const snapshotNamespace: SnapshotNamespace = {
    create() {
      const storedSnapshot = editorAPI.createStoredSnapshot();

      return storedSnapshot;
    },

    load(storedSnapshot) {
      const resolveResult = resolveStoredSnapshot({ storedSnapshot, snapshotSchema });

      if (!resolveResult.isValid) {
        return resolveResult.storedSnapshotFailed;
      }

      const storedSnapshotFailed = editorAPI.loadStoredSnapshot({
        storedSnapshot: resolveResult.storedSnapshot,
      });

      if (storedSnapshotFailed) {
        console.warn("Snapshot validation failed.", storedSnapshotFailed.reason);
      }

      return storedSnapshotFailed;
    },
  };

  return snapshotNamespace;
};
