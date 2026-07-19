import type { EditorAPI } from "rich-text-area";
import type { Component } from "solid-js";

export interface ConfigPort<Port extends object> {
	port: Port;
}

export type AdapterBlueprint<
	Options extends object,
	Port extends object,
> = InstanceType<new (options: Options) => ConfigPort<Port>>;

export interface ConfigureExtensionParams<
	Options extends object,
	Port extends object,
	Adapter extends AdapterBlueprint<Options, Port>,
> {
	adapter: Adapter;
	editorAPI: EditorAPI;
}

export type ConfigureExtensionResult = () => void;

export type ConfigureExtensionFn<
	Options extends object,
	Port extends object,
	Adapter extends AdapterBlueprint<Options, Port>,
> = (
	params: ConfigureExtensionParams<Options, Port, Adapter>,
) => ConfigureExtensionResult;

export interface ExtensionComponents<
	Options extends object,
	Port extends object,
	Adapter extends AdapterBlueprint<Options, Port>,
> {
	toolbarButton?: Component<{ adapter: Adapter }>;
	popover?: Component<{ adapter: Adapter }>;
	nodeSlot?: Component<{ adapter: Adapter }>;
	commandMenu?: Component<{ adapter: Adapter }>;
}

export interface ExtensionDefinition<
	Name extends string,
	Options extends object,
	Port extends object,
	Adapter extends AdapterBlueprint<Options, Port>,
> {
	name: Name;
	defaultSettings: Options;
	createAdapter: (settings: Options) => Adapter;
	configure: ConfigureExtensionFn<Options, Port, Adapter>;
	components: ExtensionComponents<Options, Port, Adapter>;
}

export interface Extension<
	Name extends string,
	Options extends object,
	Port extends object,
	Adapter extends AdapterBlueprint<Options, Port>,
> {
	name: Name;
	createAdapter: () => Adapter;
	configure: ConfigureExtensionFn<Options, Port, Adapter>;
	components: ExtensionComponents<Options, Port, Adapter>;
}

// biome-ignore lint/suspicious/noExplicitAny: erased for the generic "any extension" shape
type AnyExtension = Extension<string, any, any, any>;

/**
 * What `RichTextEditor` builds per active extension after calling `createAdapter`/`configure` —
 * the payload `RichTextEditorUI` needs to render `components.toolbarButton`/`components.popover`, etc.
 * Derived from `Extension` (not hand-duplicated) so a rename/removal on `Extension` breaks this too.
 */
export type ResolvedExtension = Pick<AnyExtension, "name" | "components"> & {
	adapter: unknown;
};
