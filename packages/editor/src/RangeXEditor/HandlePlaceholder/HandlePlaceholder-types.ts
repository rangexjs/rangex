import type {
  BlockContentLineLocalName,
  EditorAPI,
  ScopedEditable,
  ScopedEditablePlaceholder,
} from "@rangex/core";

import type { placeholderComponentNames } from "./HandlePlaceholder";

export type PlaceholderComponentName = (typeof placeholderComponentNames)[number];

export type PlaceholderOwner = "root" | PlaceholderComponentName;

export interface PlaceholderLine {
  localName: BlockContentLineLocalName;
}

export interface PlaceholderContext {
  isFocused: boolean;
  owner: PlaceholderOwner;
  line: PlaceholderLine;
}

export type ResolvePlaceholderFn = (context: PlaceholderContext) => ScopedEditablePlaceholder;

export interface PlaceholderTarget {
  scopedEditable: ScopedEditable;
  context: PlaceholderContext;
}

export interface HandlePlaceholderParams {
  editorAPI: EditorAPI;
  resolvePlaceholder: ResolvePlaceholderFn;
}

export type HandlePlaceholderResult = () => void;
