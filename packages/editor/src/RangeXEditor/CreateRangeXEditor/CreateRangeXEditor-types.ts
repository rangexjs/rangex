import type { EditorAPI } from "@rangex/core";

export interface CreateRangeXEditorParams {
  editorAPI: EditorAPI;
  cleanupList: Set<() => void>;
}
