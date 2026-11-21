import type { createRichTextEditor as createRichTextEditorFn } from "../CreateRichTextEditor";
import { createClientOnlyFn } from "../ServerStubs";

export const createRichTextEditor: typeof createRichTextEditorFn =
  createClientOnlyFn("createRichTextEditor");
