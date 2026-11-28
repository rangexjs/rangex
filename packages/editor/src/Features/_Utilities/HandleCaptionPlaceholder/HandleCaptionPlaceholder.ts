import {
  nestedEditableRole,
  nestedEditableRoleSelector,
  type ScopedEditablePlaceholder,
} from "@rangex/core";

import { createComponentSelector } from "#constants";

import type { HandleCaptionPlaceholderParams } from "./HandleCaptionPlaceholder-types";

/*
 * Gives every caption of the given source component its placeholder, with the given text. The engine doesn't store the placeholder in the
 * snapshot, so a caption created by paste, drag and drop, undo/redo or loadStoredSnapshot has none: the captions are
 * re-checked on every mutation of the root, and the ones without a placeholder get it.
 */
export const handleCaptionPlaceholder = ({
  editorAPI,
  componentName,
  text,
}: HandleCaptionPlaceholderParams) => {
  const { rootEditable } = editorAPI;

  const captionPlaceholder: ScopedEditablePlaceholder = { text, showWhen: "empty editable" };

  const captionSelector = `${createComponentSelector(componentName)} figcaption > ${nestedEditableRoleSelector}`;

  const syncCaptionPlaceholders = () => {
    const captions = rootEditable.$$querySelectorAll(captionSelector);

    for (const caption of captions) {
      if (caption.$$editorRole !== nestedEditableRole) {
        throw new Error("Caption's type is invalid.");
      }

      if (caption.$$getPlaceholder()) {
        continue;
      }

      caption.$$setPlaceholder(captionPlaceholder);
    }
  };

  syncCaptionPlaceholders();

  const captionObserver = new MutationObserver(() => {
    syncCaptionPlaceholders();
  });

  captionObserver.observe(rootEditable, { childList: true, subtree: true });

  return () => {
    captionObserver.disconnect();
  };
};
