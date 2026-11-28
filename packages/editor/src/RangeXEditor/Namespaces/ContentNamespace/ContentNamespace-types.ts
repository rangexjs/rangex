import type { EditorAPI } from "@rangex/core";

export type OnContentChangeCallbackFn = () => void;

export interface ContentNamespace {
  readonly isEmpty: boolean;
  getText(): string;
  clear(): void;
  onChange(callback: OnContentChangeCallbackFn): () => void;
}

export interface CreateContentNamespaceParams {
  editorAPI: EditorAPI;
}
