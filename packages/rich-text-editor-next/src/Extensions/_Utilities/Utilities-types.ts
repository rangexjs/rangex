import type { AdapterFactoryValue, RangeXEditor } from "@rangex/editor";
import type { ReactiveEditor } from "@rangex/solid";
import type { Component } from "solid-js";
import type { ToolbarButtonValue } from "#constants";

export type ExtensionToolbarButtons = Partial<
	Record<ToolbarButtonValue, Component>
>;

export type ExtensionFloatingComponents = Component[];

export interface ExtensionComponents {
	toolbarButtons: ExtensionToolbarButtons;
	floatingComponents: ExtensionFloatingComponents;
}

export interface RegisterEditor {
	editor: RangeXEditor;
	reactiveEditor: ReactiveEditor;
}

export type RegisterFn = (editor: RegisterEditor) => void;

export interface Extension {
	createAdapter: () => AdapterFactoryValue;
	components: ExtensionComponents;
	register?: RegisterFn;
}
