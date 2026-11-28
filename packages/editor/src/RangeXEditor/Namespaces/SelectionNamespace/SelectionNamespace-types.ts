import type { EditorAPI } from "@rangex/core";

export type FocusPosition = "current" | "start" | "end" | "all";

export interface FocusParams {
  position?: FocusPosition;
}

export interface ScrollIntoViewParams extends ScrollIntoViewOptions {}

export type OnFocusCallbackFn = () => void;

export type OnBlurCallbackFn = () => void;

export type OnSelectionChangeCallbackFn = () => void;

export interface SelectionNamespace {
  readonly isFocused: boolean;
  focus(params: FocusParams): void;
  blur(): void;
  getText(): string;
  scrollIntoView(params: ScrollIntoViewParams): void;
  onFocus(callback: OnFocusCallbackFn): () => void;
  onBlur(callback: OnBlurCallbackFn): () => void;
  onChange(callback: OnSelectionChangeCallbackFn): () => void;
}

export interface CreateSelectionNamespaceParams {
  editorAPI: EditorAPI;
}
