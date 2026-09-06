import type { AdapterFactoryValue } from "@rangex/editor";
import type { StoredSnapshot } from "rich-text-area";
import type { Component } from "solid-js";
import type { ToolbarButtonsLayout, ToolbarButtonValue } from "#constants";

export type ExtensionToolbarButtons = Partial<
	Record<ToolbarButtonValue, Component>
>;

export interface ExtensionComponents {
	toolbarButtons: ExtensionToolbarButtons;
}

export interface Extension {
	createAdapter: () => AdapterFactoryValue;
	components: ExtensionComponents;
}

export interface RichTextEditor {
	readonly editorHost: HTMLDivElement;
	destroy(): void;
}

export interface CreateRichTextEditorParams {
	storedSnapshot?: StoredSnapshot;
	extensions: Extension[];
	toolbarButtonsLayout?: ToolbarButtonsLayout;
}

export interface CreateRichTextEditorResult extends RichTextEditor {}
