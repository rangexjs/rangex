import { EditorRange } from "@rangex/core";

import { getPositionBoundaryPoints } from "./GetPositionBoundaryPoints";
import { getSelectedTextBoundaryPoints } from "./GetSelectedTextBoundaryPoints";
import type {
  CreateSelectionNamespaceParams,
  SelectionNamespace,
} from "./SelectionNamespace-types";

/*
 * Focuses, blurs and reads the editor's selection, and subscribes to its focus and changes. focus() keeps the current
 * selection unless a position is given. getText() joins the lines with "\n", and reads a table's cell selection like
 * the engine's copy does.
 */
export const createSelectionNamespace = ({
  editorAPI,
}: CreateSelectionNamespaceParams): SelectionNamespace => {
  const { rootEditable, shadowRoot } = editorAPI;

  const editorSelection = editorAPI.getEditorSelection();

  const selectionNamespace: SelectionNamespace = {
    get isFocused() {
      const isFocused = editorAPI.getIsSelectionActive();

      return isFocused;
    },

    focus({ position = "current" }) {
      if (position !== "current") {
        const boundaryPoints = getPositionBoundaryPoints({ position, rootEditable });

        editorSelection.setBoundaryPoints(boundaryPoints);
      }

      editorAPI.focus();
    },

    blur() {
      const { activeElement } = shadowRoot;

      if (activeElement instanceof HTMLElement) {
        activeElement.blur();
      }
    },

    getText() {
      const boundaryPoints = getSelectedTextBoundaryPoints({ editorAPI });

      const text = editorAPI.getPlainText(boundaryPoints);

      return text;
    },

    scrollIntoView(params) {
      const { fromText, fromOffset, toText, toOffset } = editorSelection.getBoundaryPoints();

      const range = new EditorRange({ fromNode: fromText, fromOffset, toNode: toText, toOffset });

      range.scrollIntoView(params);
    },

    onFocus(callback) {
      const unsubscribe = editorAPI.subscribeEditorEvent({
        type: "selection-in",
        callback: () => {
          callback();
        },
      });

      return unsubscribe;
    },

    onBlur(callback) {
      const unsubscribe = editorAPI.subscribeEditorEvent({
        type: "selection-out",
        callback: () => {
          callback();
        },
      });

      return unsubscribe;
    },

    onChange(callback) {
      const unsubscribe = editorAPI.subscribeEditorEvent({
        type: "editor-selection-change",
        callback: () => {
          callback();
        },
      });

      return unsubscribe;
    },
  };

  return selectionNamespace;
};
