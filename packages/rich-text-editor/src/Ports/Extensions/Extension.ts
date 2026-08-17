import type { EditorAPI } from "rich-text-area";
import type { Component } from "solid-js";
import type { AdapterBus } from "../AdapterBus";
import type { OverlayHost } from "../OverlayHost";
import type { ToolbarButtonValue } from "../ToolbarButtons";

export interface AdapterOptions {
	adapterBus: AdapterBus;
	overlayHost: OverlayHost;
}

export type CreateAdapterConstructor<Settings extends object> = [
	Settings,
	AdapterOptions,
];

export interface AdapterPort {
	// biome-ignore lint/suspicious/noExplicitAny: concrete Adapter classes carry the real uiPort type
	uiPort: any;
	// biome-ignore lint/suspicious/noExplicitAny: concrete Adapter classes carry the real editorPort type
	editorPort: any;
}

export type AdapterBlueprint = new (
	// biome-ignore lint/suspicious/noExplicitAny: concrete Adapter classes carry the real settings type
	settings: any,
	options: AdapterOptions,
) => AdapterPort;

export interface ConfigureExtensionParams<Adapter extends AdapterBlueprint> {
	adapter: InstanceType<Adapter>;
	editorAPI: EditorAPI;
}

export type ConfigureExtensionResult = () => void;

export type ConfigureExtensionFn<Adapter extends AdapterBlueprint> = (
	params: ConfigureExtensionParams<Adapter>,
) => ConfigureExtensionResult;

export interface ExtensionComponents {
	toolbarButtons?: Partial<Record<ToolbarButtonValue, Component>>;
}

export type GetSettings<T> = T extends AdapterBlueprint
	? ConstructorParameters<T>["0"]
	: never;

export interface ExtensionDefinition<Adapter extends AdapterBlueprint> {
	createAdapter: (
		settings: GetSettings<Adapter>,
		options: AdapterOptions,
	) => InstanceType<Adapter>;
	configure: ConfigureExtensionFn<Adapter>;
	components: ExtensionComponents;
}

export interface Extension<Adapter extends AdapterBlueprint> {
	createAdapter: (options: AdapterOptions) => InstanceType<Adapter>;
	configure: ConfigureExtensionFn<Adapter>;
	components: ExtensionComponents;
}

// biome-ignore lint/suspicious/noExplicitAny: erased for the generic "any extension" shape
type AnyExtension = Extension<any>;

/**
 * What `RichTextEditor` builds per active extension after calling `createAdapter`/`configure` —
 * the payload `RichTextEditorUI` needs to render `components.toolbarButtons`, etc.
 * Derived from `Extension` (not hand-duplicated) so a rename/removal on `Extension` breaks this too.
 */
export type UIExtension = Pick<AnyExtension, "components">;
