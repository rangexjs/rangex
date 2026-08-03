import type { StoredSnapshot } from "rich-text-area";
import type { ConfigureExtensionFn, ToolbarButtons } from "#ports";
import type { ExtensionValue } from "../Extensions";

// biome-ignore lint/suspicious/noExplicitAny: extension/adapter correlation can't be expressed across the union
export type ErasedConfigureExtensionFn = ConfigureExtensionFn<any>;

export type Extensions = ExtensionValue[];

export interface RichTextEditorParams {
	storedSnapshot?: StoredSnapshot;
	toolbarButtons?: ToolbarButtons;
	extensions: Extensions;
}
