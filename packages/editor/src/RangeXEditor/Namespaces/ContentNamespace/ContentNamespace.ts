import type { MergedFormatsStyles, TextFormatInlineTags } from "@rangex/core";

import { glyphFormatterInlineTagsOrder } from "#constants";
import { isScopedEditableEmpty } from "#engine-links";

import type { ContentNamespace, CreateContentNamespaceParams } from "./ContentNamespace-types";

const clearedStyles: MergedFormatsStyles = {
  lineHeight: null,
  paddingBlock: null,
  paddingInline: null,
  textAlign: null,
  textIndent: null,
  backgroundColor: null,
  color: null,
  fontFamily: null,
  fontSize: null,
  fontStyle: null,
  fontWeight: null,
  letterSpacing: null,
  textDecoration: null,
};

const clearedInlineTags: TextFormatInlineTags = Object.fromEntries(
  glyphFormatterInlineTagsOrder.map((inlineTag) => [inlineTag, false]),
);

/*
 * Reads and clears the editor's content, and subscribes to its changes. getText() joins the lines with "\n". clear()
 * leaves one empty paragraph without any style or format, like a new editor, and can be undone like any other edit.
 * onChange() callbacks run once per batch of changes, after them.
 */
export const createContentNamespace = ({
  editorAPI,
}: CreateContentNamespaceParams): ContentNamespace => {
  const { rootEditable } = editorAPI;

  const contentNamespace: ContentNamespace = {
    get isEmpty() {
      const isEmpty = isScopedEditableEmpty({ scopedEditable: rootEditable });

      return isEmpty;
    },

    getText() {
      const text = editorAPI.getPlainText({
        fromNode: rootEditable,
        fromOffset: 0,
        toNode: rootEditable,
        toOffset: rootEditable.$$childNodes.length,
      });

      return text;
    },

    clear() {
      // TODO: also check the line's tag, styles and pending format once the engine exposes them on the ContentLine
      if (contentNamespace.isEmpty) {
        return;
      }

      const snapshotTimeline = editorAPI.getSnapshotTimeline();

      snapshotTimeline.syncCurrentSnapshotSelection();

      editorAPI.removeNodesInRange({
        fromNode: rootEditable,
        fromOffset: 0,
        toNode: rootEditable,
        toOffset: rootEditable.$$childNodes.length,
      });

      editorAPI.updateSelectionStyles({
        localName: "p",
        styles: clearedStyles,
        inlineTags: clearedInlineTags,
      });

      snapshotTimeline.registerSnapshotBoundary();
    },

    onChange(callback) {
      const unsubscribe = editorAPI.subscribeEditorEvent({
        type: "content-change",
        callback: () => {
          callback();
        },
      });

      return unsubscribe;
    },
  };

  return contentNamespace;
};
