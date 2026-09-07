import type { AdapterFactoryValue } from "@rangex/editor";
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

export interface Extension {
	createAdapter: () => AdapterFactoryValue;
	components: ExtensionComponents;
}
