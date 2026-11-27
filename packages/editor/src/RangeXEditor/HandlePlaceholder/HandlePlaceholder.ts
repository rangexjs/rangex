import {
  type ContentLine,
  type EditorAPI,
  rootEditableRole,
  type ScopedEditable,
  type ScopedEditablePlaceholder,
} from "@rangex/core";

import { type BlockComponentName, blockComponentsName } from "#constants";
import { getClosestBlockComponent, getClosestContentLine } from "#engine-links";

import type {
  HandlePlaceholderParams,
  HandlePlaceholderResult,
  PlaceholderOwner,
  PlaceholderTarget,
} from "./HandlePlaceholder-types";

export const placeholderComponentNames = [
  blockComponentsName.codeBlock,
  blockComponentsName.blockQuote,
] satisfies BlockComponentName[];

const getPlaceholderOwner = (scopedEditable: ScopedEditable): PlaceholderOwner | null => {
  if (scopedEditable.$$editorRole === rootEditableRole) {
    return "root";
  }

  const blockComponent = getClosestBlockComponent({ fromNode: scopedEditable });

  if (!blockComponent) {
    return null;
  }

  const { $$name } = blockComponent;

  const componentName = placeholderComponentNames.find((name) => name === $$name);

  if (!componentName) {
    return null;
  }

  return componentName;
};

const getCaretContentLine = (editorAPI: EditorAPI) => {
  const selection = editorAPI.getEditorSelection();
  const { fromText, fromOffset, toText, toOffset } = selection.getBoundaryPoints();

  const isCollapsed = fromText === toText && fromOffset === toOffset;

  if (!isCollapsed) {
    return null;
  }

  const contentLine = getClosestContentLine({ fromNode: fromText });

  if (contentLine?.$$display !== "block") {
    return null;
  }

  return contentLine;
};

const getPlaceholderTarget = (
  contentLine: ContentLine,
  isFocused: boolean,
): PlaceholderTarget | null => {
  const { $$localName } = contentLine;

  if ($$localName === "span") {
    return null;
  }

  const scopedEditable = contentLine.$$parentElement;

  if (!scopedEditable) {
    return null;
  }

  const owner = getPlaceholderOwner(scopedEditable);

  if (!owner) {
    return null;
  }

  return {
    scopedEditable,
    context: {
      isFocused,
      owner,
      line: { localName: $$localName },
    },
  };
};

const isPlaceholderEqual = (a: ScopedEditablePlaceholder, b: ScopedEditablePlaceholder) => {
  if (!a || !b) {
    return a === b;
  }

  return a.text === b.text && a.showWhen === b.showWhen;
};

/*
 * Resolves the placeholder of the ScopedEditable holding the caret, on every focus, selection or content change. Only that
 * ScopedEditable is given a placeholder: it's removed from the previous one when the caret leaves it. A ScopedEditable
 * whose placeholder was set elsewhere (e.g. a caption's) is left untouched.
 */
export const handlePlaceholder = ({
  editorAPI,
  resolvePlaceholder,
}: HandlePlaceholderParams): HandlePlaceholderResult => {
  let resolvedEditable: ScopedEditable | null = null;

  let isFocused = false;

  const clearResolvedEditable = () => {
    resolvedEditable?.$$setPlaceholder(null);
    resolvedEditable = null;
  };

  const syncPlaceholder = () => {
    const contentLine = getCaretContentLine(editorAPI);

    if (!contentLine) {
      return;
    }

    const target = getPlaceholderTarget(contentLine, isFocused);

    if (!target) {
      return;
    }

    const { scopedEditable, context } = target;

    const isNewEditable = scopedEditable !== resolvedEditable;

    const isSetElsewhere = isNewEditable && scopedEditable.$$getPlaceholder() !== null;

    if (isNewEditable) {
      clearResolvedEditable();
    }

    if (isSetElsewhere) {
      return;
    }

    const placeholder = resolvePlaceholder(context);

    resolvedEditable = placeholder ? scopedEditable : null;

    if (isPlaceholderEqual(scopedEditable.$$getPlaceholder(), placeholder)) {
      return;
    }

    scopedEditable.$$setPlaceholder(placeholder);
  };

  syncPlaceholder();

  const unsubscribeSelectionIn = editorAPI.subscribeEditorEvent({
    type: "selection-in",
    callback: () => {
      isFocused = true;
      syncPlaceholder();
    },
  });

  const unsubscribeSelectionChange = editorAPI.subscribeEditorEvent({
    type: "editor-selection-change",
    callback: () => {
      syncPlaceholder();
    },
  });

  const unsubscribeContentChange = editorAPI.subscribeEditorEvent({
    type: "content-change",
    callback: () => {
      syncPlaceholder();
    },
  });

  const unsubscribeSelectionOut = editorAPI.subscribeEditorEvent({
    type: "selection-out",
    callback: () => {
      isFocused = false;
      syncPlaceholder();
    },
  });

  return () => {
    unsubscribeSelectionIn();
    unsubscribeSelectionChange();
    unsubscribeContentChange();
    unsubscribeSelectionOut();
    clearResolvedEditable();
  };
};
