import { createContentNamespace, createSnapshotNamespace } from "../Namespaces";
import type { RangeXEditor } from "../RangeXEditor-types";
import type { CreateRangeXEditorParams, RangeXEditorInternals } from "./CreateRangeXEditor-types";

/*
 * Builds the RangeXEditor instance: its namespaces and lifecycle methods. Adapters add their public ports to it later.
 * destroy() runs every cleanup in the given list, including the ones added after this call, then destroys the engine.
 * Calling it again does nothing.
 */
export const createRangeXEditor = ({
  editorAPI,
  snapshotSchema,
  cleanupList,
}: CreateRangeXEditorParams): RangeXEditor => {
  const content = createContentNamespace({ editorAPI });

  const snapshot = createSnapshotNamespace({ editorAPI, snapshotSchema });

  const internals: RangeXEditorInternals = {
    isDestroyed: false,
  };

  const editor: RangeXEditor = {
    get content() {
      return content;
    },

    get snapshot() {
      return snapshot;
    },

    focus() {
      editorAPI.focus();
    },

    destroy() {
      if (internals.isDestroyed) {
        return;
      }

      internals.isDestroyed = true;

      for (const cleanup of cleanupList) {
        cleanup();
      }

      editorAPI.destroy();
    },
  };

  return editor;
};
