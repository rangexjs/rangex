import type { EditorAPI } from "@rangex/core";

import type { ComponentName } from "#constants";

export interface HandleCaptionPlaceholderParams {
  editorAPI: EditorAPI;
  componentName: ComponentName;
  text: string;
}
