export type {
  FileId,
  PlaceholderComponentName,
  PlaceholderContext,
  PlaceholderLine,
  PlaceholderOwner,
  ResolvePlaceholderFn,
  ScopedEditablePlaceholder,
  ScopedEditablePlaceholderCondition,
  ScopedEditablePlaceholderOptions,
} from "@rangex/editor";
export type { SnapshotSchema, StoredSnapshot } from "@rangex/editor/snapshot";
export type {
  Extension,
  ExtensionComponents,
  ExtensionFloatingComponents,
  ExtensionToolbarButtons,
  RegisterFn,
} from "#extensions";
export type {
  CreateRichTextEditorParams,
  CreateRichTextEditorResult,
  RichTextEditor,
} from "../CreateRichTextEditor";
export { createRichTextEditor } from "../CreateRichTextEditor";
export type { ThemeValue } from "../App";
