import { createSnapshotNamespace } from "../Namespaces";
import type { RangeXEditor } from "../RangeXEditor-types";
import type { CreateRangeXEditorParams } from "./CreateRangeXEditor-types";

/*
 * Builds the RangeXEditor instance: its namespaces and lifecycle methods. Adapters add their public ports to it later.
 * destroy() runs every cleanup in the given list, including the ones added after this call.
 */
export const createRangeXEditor = ({
  editorAPI,
  snapshotSchema,
  cleanupList,
}: CreateRangeXEditorParams): RangeXEditor => {
  const snapshot = createSnapshotNamespace({ editorAPI, snapshotSchema });

  const editor: RangeXEditor = {
    get snapshot() {
      return snapshot;
    },

    focus() {
      editorAPI.focus();
    },

    destroy() {
      for (const cleanup of cleanupList) {
        cleanup();
      }
    },
  };

  return editor;
};
