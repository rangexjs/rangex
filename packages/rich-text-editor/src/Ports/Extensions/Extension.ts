import type { EditorAPI } from "rich-text-area";
import type { Component } from "solid-js";
import type { AdapterBus } from "../AdapterBus";
import type { OverlayHost } from "../OverlayHost";
import type { ToolbarButtonValue } from "../ToolbarButtons";
import type { ExtensionName } from "./ExtensionsName";

export interface AdapterOptions {
	adapterBus: AdapterBus;
	overlayHost: OverlayHost;
}

export type CreateAdapterConstructor<Settings extends object> = [
	Settings,
	AdapterOptions,
];

export interface AdapterPort<UIPort extends object, EditorPort extends object> {
	uiPort: UIPort;
	editorPort: EditorPort;
}

export type AdapterBlueprint<
	Settings extends object,
	UIPort extends object,
	EditorPort extends object,
> = InstanceType<
	new (
		settings: Settings,
		options: AdapterOptions,
	) => AdapterPort<UIPort, EditorPort>
>;

export interface ConfigureExtensionParams<
	Settings extends object,
	UIPort extends object,
	EditorPort extends object,
	Adapter extends AdapterBlueprint<Settings, UIPort, EditorPort>,
> {
	adapter: Adapter;
	editorAPI: EditorAPI;
}

export type ConfigureExtensionResult = () => void;

export type ConfigureExtensionFn<
	Settings extends object,
	UIPort extends object,
	EditorPort extends object,
	Adapter extends AdapterBlueprint<Settings, UIPort, EditorPort>,
> = (
	params: ConfigureExtensionParams<Settings, UIPort, EditorPort, Adapter>,
) => ConfigureExtensionResult;

export interface ExtensionComponents {
	toolbarButtons?: Partial<Record<ToolbarButtonValue, Component>>;
	commandMenu?: Component;
}

export interface ExtensionDefinition<
	Name extends ExtensionName,
	Settings extends object,
	UIPort extends object,
	EditorPort extends object,
	Adapter extends AdapterBlueprint<Settings, UIPort, EditorPort>,
> {
	name: Name;
	defaultSettings: Settings;
	createAdapter: (settings: Settings, options: AdapterOptions) => Adapter;
	configure: ConfigureExtensionFn<Settings, UIPort, EditorPort, Adapter>;
	components: ExtensionComponents;
}

export interface Extension<
	Name extends ExtensionName,
	Settings extends object,
	UIPort extends object,
	EditorPort extends object,
	Adapter extends AdapterBlueprint<Settings, UIPort, EditorPort>,
> {
	name: Name;
	createAdapter: (options: AdapterOptions) => Adapter;
	configure: ConfigureExtensionFn<Settings, UIPort, EditorPort, Adapter>;
	components: ExtensionComponents;
}

// biome-ignore lint/suspicious/noExplicitAny: erased for the generic "any extension" shape
type AnyExtension = Extension<ExtensionName, any, any, any, any>;

/**
 * What `RichTextEditor` builds per active extension after calling `createAdapter`/`configure` —
 * the payload `RichTextEditorUI` needs to render `components.toolbarButtons`/`components.commandMenu`, etc.
 * Derived from `Extension` (not hand-duplicated) so a rename/removal on `Extension` breaks this too.
 */
export type UIExtension = Pick<AnyExtension, "name" | "components">;
