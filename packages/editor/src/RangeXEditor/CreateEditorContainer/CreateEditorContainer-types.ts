import type { EditorAPI } from "@rangex/core";

export interface CreateEditorContainerParams {
  editorAPI: EditorAPI;
}

export interface CreateEditorContainerResult {
  editorContainer: HTMLDivElement;
  floatingContainer: HTMLDivElement;
  containerStyles: string;
}
