import type { AdapterFactoryValue, RangeXEditor } from "@rangex/editor";
import type { Component } from "solid-js";

import type { ToolbarButtonValue } from "#constants";
import type { UIOptions } from "#context";

export type ExtensionToolbarButtons = Partial<Record<ToolbarButtonValue, Component>>;

export type ExtensionFloatingComponents = Component[];

export interface ExtensionComponents {
	toolbarButtons: ExtensionToolbarButtons;
	floatingComponents: ExtensionFloatingComponents;
}

export type RegisterFn = (editor: RangeXEditor) => void;

export interface Extension {
	createAdapter: () => AdapterFactoryValue;
	components: ExtensionComponents;
	uiOptions?: UIOptions;
	register?: RegisterFn;
}
