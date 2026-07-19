import type { EditorAPI } from "rich-text-area";
import type { Component } from "solid-js";
import type { ToolbarButtonValue } from "../ToolbarButtons";
import type { ExtensionName } from "./ExtensionsName";

export interface AdapterPort<UIPort extends object, EditorPort extends object> {
	uiPort: UIPort;
	editorPort: EditorPort;
}

export type AdapterBlueprint<
	Options extends object,
	UIPort extends object,
	EditorPort extends object,
> = InstanceType<new (options: Options) => AdapterPort<UIPort, EditorPort>>;

export interface ConfigureExtensionParams<
	Options extends object,
	UIPort extends object,
	EditorPort extends object,
	Adapter extends AdapterBlueprint<Options, UIPort, EditorPort>,
> {
	adapter: Adapter;
	editorAPI: EditorAPI;
}

export type ConfigureExtensionResult = () => void;

export type ConfigureExtensionFn<
	Options extends object,
	UIPort extends object,
	EditorPort extends object,
	Adapter extends AdapterBlueprint<Options, UIPort, EditorPort>,
> = (
	params: ConfigureExtensionParams<Options, UIPort, EditorPort, Adapter>,
) => ConfigureExtensionResult;

export interface ExtensionComponents<UIPort extends object> {
	toolbarButtons?: Partial<
		Record<ToolbarButtonValue, Component<{ uiPort: UIPort }>>
	>;
	popover?: Component<{ uiPort: UIPort }>;
	nodeSlot?: Component<{ uiPort: UIPort }>;
	commandMenu?: Component<{ uiPort: UIPort }>;
}

export interface ExtensionDefinition<
	Name extends ExtensionName,
	Options extends object,
	UIPort extends object,
	EditorPort extends object,
	Adapter extends AdapterBlueprint<Options, UIPort, EditorPort>,
> {
	name: Name;
	defaultSettings: Options;
	createAdapter: (settings: Options) => Adapter;
	configure: ConfigureExtensionFn<Options, UIPort, EditorPort, Adapter>;
	components: ExtensionComponents<UIPort>;
}

export interface Extension<
	Name extends ExtensionName,
	Options extends object,
	UIPort extends object,
	EditorPort extends object,
	Adapter extends AdapterBlueprint<Options, UIPort, EditorPort>,
> {
	name: Name;
	createAdapter: () => Adapter;
	configure: ConfigureExtensionFn<Options, UIPort, EditorPort, Adapter>;
	components: ExtensionComponents<UIPort>;
}

// biome-ignore lint/suspicious/noExplicitAny: erased for the generic "any extension" shape
type AnyExtension = Extension<ExtensionName, any, any, any, any>;

/**
 * What `RichTextEditor` builds per active extension after calling `createAdapter`/`configure` —
 * the payload `RichTextEditorUI` needs to render `components.toolbarButtons`/`components.popover`, etc.
 * Derived from `Extension` (not hand-duplicated) so a rename/removal on `Extension` breaks this too.
 */
export type UIExtension = Pick<AnyExtension, "name" | "components"> & {
	uiPort: unknown;
};
