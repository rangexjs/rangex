import type { createRichTextEditor as createRichTextEditorFn } from "../CreateRichTextEditor";
import { createClientOnlyFn } from "../ServerStubs";

export { configureSanitizer, createSnapshotView } from "@rangex/editor";
export { createRichTextHTMLView, createRichTextSnapshotView } from "../Snapshot";

export const createRichTextEditor: typeof createRichTextEditorFn =
  createClientOnlyFn("createRichTextEditor");
