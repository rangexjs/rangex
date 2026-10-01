export type { SnapshotView, StoredSnapshot } from "@rangex/editor";
export { createSnapshotView } from "@rangex/editor";
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
export {
	createRichTextHTMLView,
	createRichTextSnapshotView,
} from "../Snapshot";
