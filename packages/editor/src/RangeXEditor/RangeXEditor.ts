import { createCore } from "./CreateCore";
import { createEditorContainer } from "./CreateEditorContainer";
import { createRangeXEditor } from "./CreateRangeXEditor";
import { handlePlaceholder } from "./HandlePlaceholder";
import type { CreateEditorParams, CreateEditorResult } from "./RangeXEditor-types";
import { registerAdapters } from "./RegisterAdapters";

export const createEditor = ({
  licenseKey,
  storedSnapshot,
  snapshotSchema,
  adapters,
  styles,
  placeholder,
}: CreateEditorParams): CreateEditorResult => {
  const { editorAPI } = createCore({
    licenseKey,
    storedSnapshot,
    snapshotSchema,
    styles,
  });

  const { editorContainer, floatingContainer, containerStyles } = createEditorContainer({
    editorAPI,
  });

  const cleanupList = new Set<() => void>();

  const editor = createRangeXEditor({ editorAPI, cleanupList });

  const adaptersCleanup = registerAdapters({
    adapters,
    components: snapshotSchema.components,
    floatingContainer,
    editor,
    editorAPI,
  });

  cleanupList.add(adaptersCleanup);

  if (placeholder) {
    const placeholderCleanup = handlePlaceholder({ editorAPI, resolvePlaceholder: placeholder });

    cleanupList.add(placeholderCleanup);
  }

  return { editor, editorContainer, containerStyles };
};
