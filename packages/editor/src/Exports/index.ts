export type { EditorAPI, SnapshotLimits, StoredSnapshot } from "@rangex/core";
export type {
	BlockAlignValue,
	CaptionPosition,
	CaptionState,
	CaretMenuPublicPort,
	CaretMenuQuery,
	InsertRootLinePosition,
	MediaType,
} from "#adapters";
export type {
	AdapterFactoryValue,
	CreateEditorParams,
	CreateEditorResult,
	RangeXEditor,
} from "#rangex-editor";
export { createEditor } from "#rangex-editor";
export type {
	ComponentValidator,
	SnapshotView,
	ValidateComponentFn,
	ValidateComponentParams,
	ValidateComponentResult,
	ValidateSnapshotParams,
	ValidateSnapshotResult,
} from "#snapshot";
export {
	createHTMLView,
	createSnapshotView,
	validateSnapshot,
} from "#snapshot";
export { buildViewStyleText } from "../Styles";
