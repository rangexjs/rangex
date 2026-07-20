import type { StoredSnapshot } from "rich-text-area";
import type { ConfigureExtensionFn, ToolbarButtons } from "#ports";
import type { Formatting, Link, Mention } from "../../Extensions";

export type ExtensionUnion =
	| ReturnType<typeof Formatting>
	| ReturnType<typeof Link>
	| ReturnType<typeof Mention>;

// biome-ignore lint/suspicious/noExplicitAny: extension/adapter correlation can't be expressed across the union
type ErasedPort = any;

export type ErasedConfigureExtensionFn = ConfigureExtensionFn<
	ErasedPort,
	ErasedPort,
	ErasedPort,
	ErasedPort
>;

export type Extensions = ExtensionUnion[];

export interface RichTextEditorParams {
	storedSnapshot?: StoredSnapshot;
	toolbarButtons?: ToolbarButtons;
	extensions: Extensions;
}
