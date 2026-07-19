import type { StoredSnapshot } from "rich-text-area";
import type { ConfigureExtensionFn, ToolbarButtons } from "#ports";
import type { Link, Mention } from "../../Extensions";

export type ExtensionUnion =
	| ReturnType<typeof Link>
	| ReturnType<typeof Mention>;

// biome-ignore lint/suspicious/noExplicitAny: extension/adapter correlation can't be expressed across the union
export type ErasedConfigureExtensionFn = ConfigureExtensionFn<any, any, any>;

export type Extensions = ExtensionUnion[];

export interface RichTextEditorParams {
	storedSnapshot?: StoredSnapshot;
	toolbarButtons?: ToolbarButtons;
	extensions: Extensions;
}
